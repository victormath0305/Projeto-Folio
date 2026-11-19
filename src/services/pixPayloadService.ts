import { PixRecipientConfig, SITE_CONFIG } from '../config/siteConfig';
import { encodeTextToQrMatrix, QrMatrixResult } from './qrCodeEncoder';

/**
 * FOLIO — Serviço Oficial de Geração de Payload Pix (BR Code EMV® QRCPS-MPM / Banco Central)
 *
 * Regras estritas (Fase 07 — Seção 4):
 * - Não inventa chave Pix, nome de beneficiário, instituição ou código de pagamento.
 * - Se os dados reais de recebimento estiverem ausentes, retorna null (jamais gera QR Code falso).
 * - Quando os dados reais são fornecidos, gera o payload EMV com CRC16-CCITT (0x1021)
 *   contendo o valor exato escolhido pelo usuário e a matriz QR Code correspondente.
 */

export const SUGGESTED_PIX_AMOUNTS = [5, 10, 20, 50] as const;

export interface PixPaymentArtifact {
  payload: string;
  amount: number;
  formattedAmountBRL: string;
  /** Nome normalizado em ASCII (máx. 25 chars) embutido no campo 59 do BR Code */
  recipientName: string;
  /** Nome completo do beneficiário para exibição transparente antes do pagamento */
  displayRecipientName: string;
  /** Instituição financeira do beneficiário (ex.: Nubank) */
  recipientInstitution: string;
  recipientCity: string;
  txId: string;
  crc16: string;
  qrMatrix: QrMatrixResult;
}

/**
 * Verifica se os dados obrigatórios do recebedor Pix foram fornecidos na configuração
 */
export function isPixConfigured(
  config: PixRecipientConfig = SITE_CONFIG.pix
): boolean {
  return Boolean(
    config.pixKey &&
      config.pixKey.trim().length >= 3 &&
      config.recipientName &&
      config.recipientName.trim().length >= 2 &&
      config.recipientCity &&
      config.recipientCity.trim().length >= 2
  );
}

/**
 * Retorna a lista de campos Pix que ainda precisam ser preenchidos pelo proprietário
 */
export function getMissingPixConfigFields(
  config: PixRecipientConfig = SITE_CONFIG.pix
): string[] {
  const missing: string[] = [];
  if (!config.pixKey || !config.pixKey.trim()) {
    missing.push('Chave Pix do recebedor (VITE_PIX_KEY)');
  }
  if (!config.recipientName || !config.recipientName.trim()) {
    missing.push('Nome do beneficiário (VITE_PIX_RECIPIENT_NAME)');
  }
  if (!config.recipientCity || !config.recipientCity.trim()) {
    missing.push('Cidade do beneficiário (VITE_PIX_RECIPIENT_CITY)');
  }
  return missing;
}

function normalizeEmvAscii(text: string, maxLen: number): string {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
    .toUpperCase()
    .slice(0, maxLen);
}

function formatEmvTlv(id: string, value: string): string {
  const len = String(value.length).padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Cálculo oficial CRC16-CCITT (Polinômio 0x1021, Valor Inicial 0xFFFF)
 * exigido pelo Manual de Padrões para Iniciação do Pix (Banco Central do Brasil).
 */
export function computePixCrc16(payloadWithoutCrcValue: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payloadWithoutCrcValue.length; i++) {
    crc ^= payloadWithoutCrcValue.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Constrói o código Pix Copia e Cola e o QR Code correspondente para o valor selecionado.
 * Retorna null se os dados reais do recebedor Pix estiverem ausentes ou se o valor for inválido.
 */
export function generatePixPaymentArtifact(
  amount: number,
  config: PixRecipientConfig = SITE_CONFIG.pix
): PixPaymentArtifact | null {
  if (!isPixConfigured(config)) {
    return null;
  }

  if (!Number.isFinite(amount) || amount <= 0 || amount > 100000) {
    return null;
  }

  const rawKey = config.pixKey.trim();
  // Se a chave for CPF formatado (000.000.000-00), normaliza para os 11 dígitos exigidos pelo padrão BCB
  const cleanKey = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(rawKey)
    ? rawKey.replace(/\D/g, '')
    : rawKey;
  const displayRecipientName = config.recipientName.trim();
  const recipientInstitution = (config.recipientInstitution || '').trim();
  const cleanName = normalizeEmvAscii(displayRecipientName, 25);
  const cleanCity = normalizeEmvAscii(config.recipientCity, 15);
  const cleanTxId =
    normalizeEmvAscii(config.txId || 'FOLIOAPOIO', 25).replace(/\s+/g, '') ||
    '***';

  if (!cleanName || !cleanCity) {
    return null;
  }

  const amountFixed = amount.toFixed(2);

  // Bloco 26: Merchant Account Information (GUI br.gov.bcb.pix + Chave Pix)
  const merchantAccountValue =
    formatEmvTlv('00', 'br.gov.bcb.pix') + formatEmvTlv('01', cleanKey);

  // Bloco 62: Additional Data Field Template (Subcampo 05 = Reference Label / TxID)
  const additionalDataValue = formatEmvTlv('05', cleanTxId);

  const payloadWithoutCrc =
    formatEmvTlv('00', '01') +
    formatEmvTlv('26', merchantAccountValue) +
    formatEmvTlv('52', '0000') +
    formatEmvTlv('53', '986') +
    formatEmvTlv('54', amountFixed) +
    formatEmvTlv('58', 'BR') +
    formatEmvTlv('59', cleanName) +
    formatEmvTlv('60', cleanCity) +
    formatEmvTlv('62', additionalDataValue) +
    '6304';

  const crc16 = computePixCrc16(payloadWithoutCrc);
  const fullPayload = `${payloadWithoutCrc}${crc16}`;
  const qrMatrix = encodeTextToQrMatrix(fullPayload);

  const formattedAmountBRL = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);

  return {
    payload: fullPayload,
    amount: Number(amountFixed),
    formattedAmountBRL,
    recipientName: cleanName,
    displayRecipientName,
    recipientInstitution,
    recipientCity: cleanCity,
    txId: cleanTxId,
    crc16,
    qrMatrix,
  };
}
