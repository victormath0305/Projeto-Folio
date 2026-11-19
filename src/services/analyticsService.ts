import { SITE_CONFIG } from '../config/siteConfig';

/**
 * FOLIO — Arquitetura de Monitoramento e Analytics com Privacidade por Padrão (Fase 06 — Seção 8)
 * - Preparado para Google Analytics 4 (GA4) via VITE_GA_MEASUREMENT_ID (sem IDs fictícios)
 * - Requer consentimento explícito (Opt-In) antes de emitir qualquer evento externo
 * - Permite alterar ou revogar o consentimento a qualquer momento em /privacidade
 * - Jamais coleta, serializa ou transmite nome, telefone, e-mail ou conteúdo do currículo (PII)
 */

const CONSENT_STORAGE_KEY = 'folio:analytics-consent:v1';

export type ConsentStatus = 'granted' | 'denied' | 'unset';

export type AnalyticsEventName =
  | 'page_view'
  | 'start_resume'
  | 'select_template'
  | 'complete_resume'
  | 'export_pdf'
  | 'template_selected'
  | 'pdf_exported'
  | 'guide_opened'
  | 'first_job_mode_toggled'
  | 'support_page_viewed'
  | 'pix_code_copied';

export interface SafeAnalyticsPayload {
  route?: string;
  templateId?: string;
  pageCount?: number;
  guideSlug?: string;
  isFirstJobMode?: boolean;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: 'event' | 'config' | 'consent' | 'js',
      target: string | Date,
      params?: Record<string, unknown>
    ) => void;
  }
}

const GA_SCRIPT_ID = 'folio-ga4-script';

export const analyticsService = {
  getConsentStatus(): ConsentStatus {
    if (typeof window === 'undefined') return 'unset';
    try {
      const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (raw === 'granted' || raw === 'denied') return raw;
      return 'unset';
    } catch {
      return 'unset';
    }
  },

  hasConsent(): boolean {
    return this.getConsentStatus() === 'granted';
  },

  setConsent(granted: boolean): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        granted ? 'granted' : 'denied'
      );
      if (granted) {
        this.ensureGoogleAnalyticsLoaded();
      }
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: granted ? 'granted' : 'denied',
        });
      }
    } catch {
      // Ignora caso localStorage esteja indisponível
    }
  },

  isConfigured(): boolean {
    return Boolean(
      SITE_CONFIG.gaMeasurementId &&
        /^G-[A-Z0-9]{6,16}$/i.test(SITE_CONFIG.gaMeasurementId.trim())
    );
  },

  /**
   * Injeta o script oficial do Google Analytics 4 de forma assíncrona somente quando:
   * 1. VITE_GA_MEASUREMENT_ID estiver configurado com um ID válido; e
   * 2. O usuário tiver concedido consentimento explícito (Opt-In).
   */
  ensureGoogleAnalyticsLoaded(): boolean {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }
    if (!this.isConfigured() || !this.hasConsent()) {
      return false;
    }
    if (document.getElementById(GA_SCRIPT_ID)) {
      return true;
    }

    const measurementId = SITE_CONFIG.gaMeasurementId.trim();
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtagShim() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };

    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    const script = document.createElement('script');
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      measurementId
    )}`;
    document.head.appendChild(script);
    return true;
  },

  /**
   * Registra apenas eventos anônimos de produto quando o usuário concedeu consentimento.
   * Filtra estritamente qualquer campo fora da lista branca (SafeAnalyticsPayload),
   * impedindo o envio de nome, telefone, e-mail ou texto do currículo.
   */
  trackEvent(
    eventName: AnalyticsEventName,
    payload: SafeAnalyticsPayload = {}
  ): void {
    if (!this.hasConsent()) return;

    const sanitizedParams: Record<string, string | number | boolean> = {};
    if (payload.route) sanitizedParams.route = String(payload.route).slice(0, 64);
    if (payload.templateId) {
      sanitizedParams.template_id = String(payload.templateId).slice(0, 32);
    }
    if (typeof payload.pageCount === 'number') {
      sanitizedParams.page_count = payload.pageCount;
    }
    if (payload.guideSlug) {
      sanitizedParams.guide_slug = String(payload.guideSlug).slice(0, 64);
    }
    if (typeof payload.isFirstJobMode === 'boolean') {
      sanitizedParams.first_job_mode = payload.isFirstJobMode;
    }

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, sanitizedParams);
    }
  },
};
