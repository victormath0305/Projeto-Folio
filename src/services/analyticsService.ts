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
  | 'first_job_mode_toggled';

export interface SafeAnalyticsPayload {
  route?: string;
  templateId?: string;
  pageCount?: number;
  guideSlug?: string;
  isFirstJobMode?: boolean;
}

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'consent',
      target: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

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
    return Boolean(SITE_CONFIG.gaMeasurementId && SITE_CONFIG.gaMeasurementId.trim());
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
