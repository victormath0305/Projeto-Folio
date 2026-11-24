import { AdSenseConfig, SITE_CONFIG } from '../config/siteConfig';

/**
 * FOLIO — Serviço de Integração Google AdSense & Ad Blocking Recovery (Fase 07 — Seções 2, 3 e 5)
 *
 * Princípios Técnicos:
 * 1. Não inventa Publisher ID (ca-pub-...) nem Ad Slot IDs.
 * 2. Não carrega scripts externos do AdSense enquanto a configuração real estiver vazia.
 * 3. Mantém o controle de consentimento de publicidade (LGPD/GDPR) separado da recuperação de Adblock.
 * 4. Bloqueia qualquer exibição de anúncios na rota de edição (/editor) ou exportação de PDF.
 */

const AD_CONSENT_STORAGE_KEY = 'folio:advertising-consent:v1';
const ADBLOCK_DISMISS_SESSION_KEY = 'folio:adblock-recovery-dismissed:v1';

export type AdSlotPlacement = 'landing' | 'content' | 'footer';

export type AdvertisingConsentMode = 'personalized' | 'non_personalized' | 'unset';

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
    googlefc?: Record<string, unknown>;
  }
}

export function isValidAdSenseClientId(clientId: string): boolean {
  return /^ca-pub-\d{10,20}$/.test((clientId || '').trim());
}

export function isValidAdSenseSlotId(slotId: string): boolean {
  return /^\d{6,20}$/.test((slotId || '').trim());
}

export const adSenseService = {
  /**
   * Verifica se o Publisher ID oficial do AdSense foi configurado
   */
  isConfigured(config: AdSenseConfig = SITE_CONFIG.adsense): boolean {
    return isValidAdSenseClientId(config.clientId);
  },

  /**
   * Retorna o ID do slot configurado para a posição solicitada, ou string vazia se ausente
   */
  getSlotId(
    placement: AdSlotPlacement,
    config: AdSenseConfig = SITE_CONFIG.adsense
  ): string {
    const raw =
      placement === 'landing'
        ? config.slotLanding
        : placement === 'content'
          ? config.slotContent
          : config.slotFooter;
    return isValidAdSenseSlotId(raw) ? raw.trim() : '';
  },

  /**
   *Verifica se um slot específico está totalmente configurado (Publisher ID + Slot ID)
   */
  isSlotReady(
    placement: AdSlotPlacement,
    config: AdSenseConfig = SITE_CONFIG.adsense
  ): boolean {
    return this.isConfigured(config) && Boolean(this.getSlotId(placement, config));
  },

  /**
   * Obtém a preferência de consentimento de publicidade (separada de analytics e de adblock)
   */
  getAdvertisingConsent(): AdvertisingConsentMode {
    if (typeof window === 'undefined') return 'unset';
    try {
      const val = window.localStorage.getItem(AD_CONSENT_STORAGE_KEY);
      if (val === 'personalized' || val === 'non_personalized') return val;
      return 'unset';
    } catch {
      return 'unset';
    }
  },

  /**
   * Define a preferência de consentimento para anúncios personalizados ou não personalizados
   */
  setAdvertisingConsent(mode: AdvertisingConsentMode): void {
    if (typeof window === 'undefined') return;
    try {
      if (mode === 'unset') {
        window.localStorage.removeItem(AD_CONSENT_STORAGE_KEY);
      } else {
        window.localStorage.setItem(AD_CONSENT_STORAGE_KEY, mode);
      }
    } catch {
      // Ignora falha de acesso ao storage
    }
  },

  /**
   * Verifica se os anúncios podem ser inicializados considerando configuração e consentimento
   */
  canInitializeAds(config: AdSenseConfig = SITE_CONFIG.adsense): boolean {
    if (!this.isConfigured(config)) return false;
    if (!config.requireConsent) return true;
    const consent = this.getAdvertisingConsent();
    return consent === 'personalized' || consent === 'non_personalized';
  },

  /**
   * Verifica se a rota atual permite espaços publicitários.
   * Jamais permite anúncios dentro do editor (/editor ou #editor).
   */
  isRouteAllowedForAds(activeView: string): boolean {
    if (activeView === 'editor' || activeView === 'not-found' || activeView === 'apoie') {
      return false;
    }
    if (typeof window !== 'undefined') {
      if (
        window.location.pathname.includes('/editor') ||
        window.location.hash === '#editor'
      ) {
        return false;
      }
    }
    return true;
  },

  /**
   * Carrega o script oficial do Google AdSense somente quando o Publisher ID real
   * estiver configurado e o consentimento aplicável tiver sido obtido.
   */
  ensureAdSenseScriptLoaded(config: AdSenseConfig = SITE_CONFIG.adsense): void {
    if (typeof document === 'undefined') return;
    if (!this.canInitializeAds(config)) return;

    const existing = document.getElementById('folio-adsense-script');
    if (existing) return;

    const script = document.createElement('script');
    script.id = 'folio-adsense-script';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      config.clientId.trim()
    )}`;
    document.head.appendChild(script);
  },

  /**
   * Ponto oficial de integração para o código de Ad Blocking Recovery (Google Funding Choices).
   * Só injeta a tag oficial quando o Publisher ID real e a flag VITE_ADSENSE_ADBLOCK_RECOVERY=true
   * estiverem configurados após ativação no painel do Google AdSense (Privacidade e mensagens).
   */
  ensureOfficialAdBlockRecoveryLoaded(
    config: AdSenseConfig = SITE_CONFIG.adsense
  ): boolean {
    if (typeof document === 'undefined') return false;
    if (!this.isConfigured(config) || !config.adBlockRecoveryEnabled) {
      return false;
    }

    const existing = document.getElementById('folio-googlefc-recovery-script');
    if (existing) return true;

    const pubNumber = config.clientId.replace(/^ca-/, '');
    const script = document.createElement('script');
    script.id = 'folio-googlefc-recovery-script';
    script.async = true;
    script.src = `https://fundingchoicesmessages.google.com/i/${encodeURIComponent(
      pubNumber
    )}?ers=1`;
    document.head.appendChild(script);
    return true;
  },

  /**
   * Detecta bloqueadores de anúncios (AdBlock, uBlock Origin, AdGuard, Brave Shields, DNS)
   * de forma leve e sem falsos positivos em ambiente offline ou testes (jsdom).
   */
  async detectAdBlocker(): Promise<boolean> {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }
    // Evita rodar em ambientes de teste (jsdom) ou quando o usuário está sem internet
    if (
      typeof navigator !== 'undefined' &&
      (navigator.onLine === false || /jsdom/i.test(navigator.userAgent || ''))
    ) {
      return false;
    }

    // Se o script oficial do Google AdSense no <head> já carregou com sucesso, não há bloqueador ativo
    if (
      (window.adsbygoogle as unknown as { loaded?: boolean } | undefined)
        ?.loaded === true
    ) {
      return false;
    }

    // 1. Verificação por elemento isca (EasyList CSS hiding)
    try {
      const bait = document.createElement('div');
      bait.className = 'adsbox ad-banner pub_300x250';
      bait.setAttribute('aria-hidden', 'true');
      bait.style.position = 'absolute';
      bait.style.top = '-9999px';
      bait.style.left = '-9999px';
      bait.style.width = '1px';
      bait.style.height = '1px';
      bait.textContent = '\u00A0';
      document.body.appendChild(bait);

      const computed = window.getComputedStyle(bait);
      const hiddenByCss =
        bait.offsetHeight === 0 ||
        computed.display === 'none' ||
        computed.visibility === 'hidden';

      document.body.removeChild(bait);
      if (hiddenByCss) {
        return true;
      }
    } catch {
      // Segue para a verificação de rede
    }

    // 2. Verificação de bloqueio de rede do script oficial do Google AdSense
    try {
      const controller =
        typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller
        ? window.setTimeout(() => controller.abort(), 3500)
        : null;

      await fetch(
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
        {
          method: 'GET',
          mode: 'no-cors',
          cache: 'no-store',
          signal: controller?.signal,
        }
      );

      if (timeoutId !== null) window.clearTimeout(timeoutId);
      return false;
    } catch (err) {
      // Ignora timeout de rede lenta (AbortError) para evitar falso positivo
      if (err instanceof DOMException && err.name === 'AbortError') {
        return false;
      }
      return true;
    }
  },

  /**
   * Controle de dispensa (dismiss) do aviso de Adblock na sessão atual,
   * garantindo que o visitante não seja interrompido repetidamente a cada navegação.
   */
  isAdBlockNoticeDismissedInSession(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return window.sessionStorage.getItem(ADBLOCK_DISMISS_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  },

  dismissAdBlockNoticeForSession(): void {
    if (typeof window === 'undefined') return;
    try {
      window.sessionStorage.setItem(ADBLOCK_DISMISS_SESSION_KEY, 'true');
    } catch {
      // Ignora falha
    }
  },
};
