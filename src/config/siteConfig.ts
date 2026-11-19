/**
 * FOLIO — Fonte Única de Configuração de Produção, Domínio, Monetização e Pix (Fases 06 e 07)
 *
 * Todas as referências a domínio canônico, canal de contato, Google Analytics 4,
 * Google Search Console, Google AdSense, Ad Blocking Recovery e recebimento Pix
 * são centralizadas neste módulo e lidas a partir de variáveis de ambiente VITE_*.
 * Nenhum identificador, chave Pix, Publisher ID ou código oficial é inventado.
 */

const env =
  (typeof import.meta !== 'undefined' && import.meta.env) ||
  ({} as Record<string, string | undefined>);

const rawSiteUrl = env.VITE_SITE_URL || 'https://folio-curriculos.com.br';

export interface PixRecipientConfig {
  pixKey: string;
  recipientName: string;
  recipientCity: string;
  txId: string;
}

export interface AdSenseConfig {
  clientId: string;
  slotLanding: string;
  slotContent: string;
  slotFooter: string;
  adBlockRecoveryEnabled: boolean;
  requireConsent: boolean;
}

export const SITE_CONFIG = {
  /** Nome oficial do produto */
  productName: 'FOLIO',
  /** Proposta comercial principal */
  commercialTagline: 'FOLIO — Crie seu currículo profissional gratuitamente.',
  /** URL base canônica de produção (sem barra final) */
  siteUrl: String(rawSiteUrl).replace(/\/+$/, ''),
  /** Indica se o domínio foi definido explicitamente via variável de ambiente */
  isCustomDomainConfigured: Boolean(env.VITE_SITE_URL),
  /** Canal oficial de contato (vazio até definição pelo proprietário) */
  contactEmail: (env.VITE_CONTACT_EMAIL || '').trim(),
  /** ID de mensuração do Google Analytics 4 (vazio por padrão — sem IDs fictícios) */
  gaMeasurementId: (env.VITE_GA_MEASUREMENT_ID || '').trim(),
  /** Token de verificação do Google Search Console (vazio por padrão) */
  gscVerificationToken: (env.VITE_GSC_VERIFICATION_TOKEN || '').trim(),

  /**
   * Configuração do Google AdSense & Ad Blocking Recovery (Fase 07 — Seções 2 e 3)
   * Permanece desativada até que o proprietário forneça o Publisher ID real (ca-pub-...).
   */
  adsense: {
    clientId: (env.VITE_ADSENSE_CLIENT_ID || '').trim(),
    slotLanding: (env.VITE_ADSENSE_SLOT_LANDING || '').trim(),
    slotContent: (env.VITE_ADSENSE_SLOT_CONTENT || '').trim(),
    slotFooter: (env.VITE_ADSENSE_SLOT_FOOTER || '').trim(),
    adBlockRecoveryEnabled: env.VITE_ADSENSE_ADBLOCK_RECOVERY === 'true',
    requireConsent: env.VITE_ADSENSE_REQUIRE_CONSENT !== 'false',
  } satisfies AdSenseConfig,

  /**
   * Configuração Pública de Recebimento de Doações Voluntárias via Pix (Fase 07 — Seção 4)
   * Jamais inventa chave Pix, nome de beneficiário ou cidade.
   * Nunca armazena segredos ou credenciais bancárias no frontend.
   */
  pix: {
    pixKey: (env.VITE_PIX_KEY || '').trim(),
    recipientName: (env.VITE_PIX_RECIPIENT_NAME || '').trim(),
    recipientCity: (env.VITE_PIX_RECIPIENT_CITY || '').trim(),
    txId: (env.VITE_PIX_TXID || 'FOLIOAPOIO').trim(),
  } satisfies PixRecipientConfig,

  /** Versão da aplicação */
  version: '1.1.0-rc.1',
} as const;
