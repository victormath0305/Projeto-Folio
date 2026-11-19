import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  HeartHandshake,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import { PixRecipientConfig, SITE_CONFIG } from '../../config/siteConfig';
import {
  generatePixPaymentArtifact,
  getMissingPixConfigFields,
  isPixConfigured,
  SUGGESTED_PIX_AMOUNTS,
} from '../../services/pixPayloadService';
import { AppRouteView } from '../../services/seoService';

interface SupportPixPageProps {
  pixConfigOverride?: PixRecipientConfig;
  onNavigateToRoute: (route: AppRouteView) => void;
  onStartEditor: () => void;
  onPreviewAdBlockModal?: () => void;
}

/**
 * Página de Doações Voluntárias por Pix (/apoie) — Fase 07 (Seção 4)
 *
 * Princípios:
 * - Identidade editorial (fundo marfim, texto humano e direto, sem aparência de checkout comercial).
 * - Valores selecionáveis: R$ 5, R$ 10, R$ 20, R$ 50 e Outro valor.
 * - O código Pix Copia e Cola e o QR Code SVG são gerados dinamicamente para o valor escolhido.
 * - Quando os dados de recebimento Pix não estão configurados, jamais gera QR Code ou chave falsa.
 * - Não exibe confirmação falsa de pagamento recebido.
 */
export const SupportPixPage: React.FC<SupportPixPageProps> = ({
  pixConfigOverride,
  onNavigateToRoute,
  onStartEditor,
  onPreviewAdBlockModal,
}) => {
  const activePixConfig = pixConfigOverride ?? SITE_CONFIG.pix;

  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(10);
  const [customAmountInput, setCustomAmountInput] = useState<string>('15');
  const [copiedFeedback, setCopiedFeedback] = useState<boolean>(false);

  const numericAmount = useMemo(() => {
    if (selectedPreset !== 'custom') {
      return selectedPreset;
    }
    const normalized = customAmountInput.replace(',', '.').replace(/[^0-9.]/g, '');
    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  }, [selectedPreset, customAmountInput]);

  const pixReady = isPixConfigured(activePixConfig);
  const missingFields = getMissingPixConfigFields(activePixConfig);

  const pixArtifact = useMemo(() => {
    if (!pixReady || numericAmount <= 0) return null;
    return generatePixPaymentArtifact(numericAmount, activePixConfig);
  }, [pixReady, numericAmount, activePixConfig]);

  const handleSelectPreset = (amount: number | 'custom') => {
    setSelectedPreset(amount);
    setCopiedFeedback(false);
  };

  const handleCopyPixCode = async () => {
    if (!pixArtifact) return;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(pixArtifact.payload);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = pixArtifact.payload;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedFeedback(true);
    } catch {
      setCopiedFeedback(true);
    }
  };

  return (
    <article className="bg-ivory text-ink border-b border-ink">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb Semântico */}
        <nav
          aria-label="Localização na página de apoio"
          className="border-b border-paper bg-ivory-warm/60 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink-muted"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToRoute('landing')}
              className="inline-flex items-center gap-1.5 text-ink hover:text-vermilion font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Início FOLIO</span>
            </button>
            <span className="text-paper-dark">/</span>
            <span className="text-vermilion font-semibold uppercase">
              APOIO VOLUNTÁRIO · MANUTENÇÃO DO PROJETO (/APOIE)
            </span>
          </div>
          <span>CONTRIBUIÇÃO OPCIONAL VIA PIX</span>
        </nav>

        {/* Corpo Assimétrico Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Coluna Esquerda (7 Colunas): Manifesto de Apoio, Seleção de Valor e Orientações */}
          <div className="lg:col-span-7 px-4 sm:px-8 py-10 sm:py-14 lg:border-r border-ink flex flex-col justify-between space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 border border-ink bg-ivory-warm px-3 py-1">
                <HeartHandshake className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink font-medium">
                  SUSTENTABILIDADE INDEPENDENTE · 100% OPCIONAL
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl text-ink tracking-tight leading-[1.02]">
                Apoie a continuidade do{' '}
                <span className="italic text-vermilion">FOLIO gratuito.</span>
              </h1>

              <div className="space-y-3 text-sm sm:text-base text-ink-muted leading-relaxed max-w-2xl">
                <p>
                  O <strong className="text-ink">FOLIO</strong> foi criado com um compromisso claro: qualquer pessoa deve conseguir diagramar e baixar um currículo profissional em formato A4 gratuitamente, sem precisar cadastrar cartão de crédito, sem assinaturas surpresa e sem marcas d’água.
                </p>
                <p>
                  Se a ferramenta foi útil para a sua recolocação, estágio ou primeiro emprego e você puder contribuir voluntariamente com qualquer valor via Pix, seu apoio ajuda a custear o domínio, a infraestrutura e a evolução contínua do projeto.
                </p>
              </div>

              {/* Seleção de Valores Sugeridos */}
              <div className="pt-2 space-y-4">
                <div className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                  01. Escolha um valor para o seu Pix voluntário
                </div>

                <div
                  className="grid grid-cols-2 sm:grid-cols-5 gap-2.5"
                  role="group"
                  aria-label="Valores sugeridos para contribuição via Pix"
                >
                  {SUGGESTED_PIX_AMOUNTS.map((val) => {
                    const isSelected = selectedPreset === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleSelectPreset(val)}
                        aria-pressed={isSelected}
                        className={`py-3 px-3 border text-center transition-all ${
                          isSelected
                            ? 'bg-ink text-ivory border-ink font-semibold shadow-architectural-red -translate-y-0.5'
                            : 'bg-ivory text-ink border-ink hover:bg-ivory-warm'
                        }`}
                      >
                        <span className="font-serif text-2xl block leading-none">
                          R$ {val}
                        </span>
                        <span
                          className={`font-mono text-[10px] uppercase tracking-wider mt-1 block ${
                            isSelected ? 'text-vermilion' : 'text-ink-subtle'
                          }`}
                        >
                          Pix único
                        </span>
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => handleSelectPreset('custom')}
                    aria-pressed={selectedPreset === 'custom'}
                    className={`col-span-2 sm:col-span-1 py-3 px-3 border text-center transition-all ${
                      selectedPreset === 'custom'
                        ? 'bg-ink text-ivory border-ink font-semibold shadow-architectural-red -translate-y-0.5'
                        : 'bg-ivory text-ink border-ink hover:bg-ivory-warm'
                    }`}
                  >
                    <span className="font-serif text-xl block leading-none">
                      Outro valor
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-wider mt-1 block ${
                        selectedPreset === 'custom'
                          ? 'text-vermilion'
                          : 'text-ink-subtle'
                      }`}
                    >
                      Livre
                    </span>
                  </button>
                </div>

                {/* Campo quando "Outro valor" está selecionado */}
                {selectedPreset === 'custom' && (
                  <div className="border border-ink bg-ivory-warm/60 p-4 max-w-sm">
                    <label
                      htmlFor="custom-pix-amount-input"
                      className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1.5"
                    >
                      Digite o valor desejado em Reais (R$)
                    </label>
                    <div className="flex items-center border border-ink bg-sheet px-3 py-2">
                      <span className="font-mono text-sm text-ink-muted mr-2">
                        R$
                      </span>
                      <input
                        id="custom-pix-amount-input"
                        type="text"
                        inputMode="decimal"
                        value={customAmountInput}
                        onChange={(e) => {
                          setCustomAmountInput(e.target.value);
                          setCopiedFeedback(false);
                        }}
                        placeholder="Ex.: 15,00"
                        className="w-full text-sm font-mono text-ink focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Orientações Simples para Concluir pelo Aplicativo do Banco */}
              <div className="border-t border-paper pt-6 space-y-3">
                <h2 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                  02. Como concluir a contribuição pelo aplicativo do seu banco
                </h2>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-ink-muted">
                  <li className="border border-paper bg-ivory-warm/40 p-3.5">
                    <strong className="font-mono text-[11px] text-vermilion uppercase block mb-1">
                      PASSO 01 · APLICATIVO
                    </strong>
                    Abra o aplicativo da sua instituição financeira ou banco digital e acesse a área <strong>Pix</strong>.
                  </li>
                  <li className="border border-paper bg-ivory-warm/40 p-3.5">
                    <strong className="font-mono text-[11px] text-vermilion uppercase block mb-1">
                      PASSO 02 · LEITURA OU CÓPIA
                    </strong>
                    Escolha <strong>Ler QR Code</strong> com a câmera ou selecione <strong>Pix Copia e Cola</strong> e cole o código ao lado.
                  </li>
                  <li className="border border-paper bg-ivory-warm/40 p-3.5">
                    <strong className="font-mono text-[11px] text-vermilion uppercase block mb-1">
                      PASSO 03 · CONFERÊNCIA
                    </strong>
                    Confira o valor selecionado e os dados do beneficiário na tela do seu banco antes de confirmar.
                  </li>
                </ol>
              </div>
            </div>

            {/* Nota de Gratuidade Incondicional + Atalho para o Editor */}
            <div className="pt-6 border-t border-paper flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <ShieldCheck className="w-4 h-4 text-vermilion shrink-0" aria-hidden="true" />
                <span>
                  Todos os recursos e modelos do FOLIO permanecem 100% liberados independentemente de doação.
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {onPreviewAdBlockModal && (
                  <button
                    type="button"
                    onClick={onPreviewAdBlockModal}
                    className="text-xs font-mono text-ink-muted hover:text-vermilion underline underline-offset-4"
                  >
                    Ver aviso sobre anúncios
                  </button>
                )}

                <button
                  type="button"
                  onClick={onStartEditor}
                  className="btn-editorial-secondary py-2.5 px-4 text-xs"
                >
                  <span>Ir para o editor de currículos</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Coluna Direita (5 Colunas): Quadro Técnico do QR Code Pix e Copia e Cola */}
          <div className="lg:col-span-5 bg-ivory-warm/70 paper-grid-bg p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-t lg:border-t-0 border-ink">
            {pixArtifact ? (
              <div className="space-y-5">
                <div className="border border-ink bg-ivory p-4 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle">
                      VALOR SELECIONADO NO CÓDIGO PIX
                    </div>
                    <div
                      data-testid="pix-selected-amount-display"
                      className="font-serif text-3xl text-ink leading-none mt-1"
                    >
                      {pixArtifact.formattedAmountBRL}
                    </div>
                  </div>
                  <div className="text-right font-mono text-[10px] text-ink-muted">
                    <div>PADRÃO BCB · BR CODE</div>
                    <div className="text-vermilion font-semibold">
                      CRC16: {pixArtifact.crc16}
                    </div>
                  </div>
                </div>

                {/* Moldura do QR Code Vetorial Correspondente ao Payload */}
                <div className="border-2 border-ink bg-sheet p-5 flex flex-col items-center">
                  <div className="w-full flex items-center justify-between font-mono text-[10px] text-ink-subtle uppercase tracking-wider mb-3">
                    <span className="inline-flex items-center gap-1 text-ink font-semibold">
                      <QrCode className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
                      QR CODE PIX OFICIAL
                    </span>
                    <span>VALOR: R$ {pixArtifact.amount.toFixed(2)}</span>
                  </div>

                  <div className="p-3 border border-paper bg-sheet">
                    <svg
                      viewBox={`0 0 ${pixArtifact.qrMatrix.size + 4} ${
                        pixArtifact.qrMatrix.size + 4
                      }`}
                      className="w-48 h-48 sm:w-56 sm:h-56"
                      role="img"
                      aria-label={`QR Code Pix para pagamento de ${pixArtifact.formattedAmountBRL}`}
                      data-testid="pix-qrcode-svg"
                      data-qr-payload={pixArtifact.payload}
                      data-qr-amount={pixArtifact.amount.toFixed(2)}
                    >
                      <rect
                        width={pixArtifact.qrMatrix.size + 4}
                        height={pixArtifact.qrMatrix.size + 4}
                        fill="#FFFFFF"
                      />
                      {pixArtifact.qrMatrix.modules.map((row, rIdx) =>
                        row.map((isDark, cIdx) =>
                          isDark ? (
                            <rect
                              key={`${rIdx}-${cIdx}`}
                              x={cIdx + 2}
                              y={rIdx + 2}
                              width={1}
                              height={1}
                              fill="#191919"
                            />
                          ) : null
                        )
                      )}
                    </svg>
                  </div>

                  <div className="mt-3 w-full pt-2.5 border-t border-paper flex items-center justify-between font-mono text-[10px] text-ink-muted">
                    <span>BENEFICIÁRIO: {pixArtifact.recipientName}</span>
                    <span>{pixArtifact.recipientCity}</span>
                  </div>
                </div>

                {/* Código Pix Copia e Cola + Botão Copiar */}
                <div className="border border-ink bg-ivory p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="pix-copia-e-cola-textarea"
                      className="font-mono text-xs uppercase tracking-wider text-ink font-semibold"
                    >
                      Código Pix Copia e Cola
                    </label>
                    <span className="font-mono text-[10px] text-vermilion">
                      EMV® QRCPS-MPM
                    </span>
                  </div>

                  <textarea
                    id="pix-copia-e-cola-textarea"
                    readOnly
                    rows={3}
                    value={pixArtifact.payload}
                    className="w-full border border-paper bg-sheet p-2.5 font-mono text-[11px] text-ink break-all focus:border-vermilion focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleCopyPixCode}
                    className="w-full btn-editorial-primary py-3 text-xs font-mono uppercase tracking-wider"
                  >
                    {copiedFeedback ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>Código Pix copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" aria-hidden="true" />
                        <span>Copiar código Pix Copia e Cola</span>
                      </>
                    )}
                  </button>

                  {copiedFeedback && (
                    <p
                      role="status"
                      className="text-xs font-mono text-vermilion text-center"
                    >
                      Cole o código na opção “Pix Copia e Cola” do aplicativo do seu banco para concluir.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Estado Seguro quando os dados reais de recebimento Pix ainda não foram preenchidos */
              <div
                data-testid="pix-unconfigured-notice"
                className="my-auto border-2 border-ink bg-ivory p-6 space-y-4"
              >
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-vermilion font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>CONFIGURAÇÃO DE RECEBIMENTO PIX PENDENTE</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-ink">
                  Nenhum QR Code falso é gerado sem dados reais de recebimento
                </h2>

                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Valor selecionado na simulação:{' '}
                  <strong className="text-ink font-mono">
                    {numericAmount > 0
                      ? new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(numericAmount)
                      : 'Valor inválido'}
                  </strong>
                  . Por medida estrita de segurança e transparência, o motor EMV do FOLIO não inventa chave Pix nem nome de beneficiário.
                </p>

                {missingFields.length > 0 && (
                  <div className="border border-paper bg-ivory-warm/60 p-4 space-y-2 text-xs">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold">
                      Parâmetros públicos pendentes de definição pelo proprietário:
                    </div>
                    <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-ink-muted">
                      {missingFields.map((field) => (
                        <li key={field}>{field}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-xs text-ink-subtle font-mono">
                  Assim que as variáveis acima forem definidas no ambiente de publicação, o QR Code oficial e o código Pix Copia e Cola serão gerados automaticamente para o valor escolhido.
                </p>
              </div>
            )}

            <div className="mt-6 pt-3 border-t border-paper flex items-center justify-between font-mono text-[10px] text-ink-muted">
              <span>SEM INTERMEDIÁRIOS · PIX DIRETO</span>
              <span>ZERO CREDENCIAIS NO FRONTEND</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
