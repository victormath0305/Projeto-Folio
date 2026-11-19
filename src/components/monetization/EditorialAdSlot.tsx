import React, { useEffect, useRef } from 'react';
import { AdSenseConfig, SITE_CONFIG } from '../../config/siteConfig';
import { adSenseService, AdSlotPlacement } from '../../services/adSenseService';

interface EditorialAdSlotProps {
  placement: AdSlotPlacement;
  activeView: string;
  config?: AdSenseConfig;
  className?: string;
}

/**
 * Espaço Publicitário Modular do FOLIO (Fase 07 — Seção 2)
 *
 * Regras de Engenharia e UX:
 * - Nunca renderiza dentro do editor (/editor), sobre formulários, sobre a folha A4 ou no PDF.
 * - Não exibe anúncios fictícios quando o AdSense não está configurado.
 * - Quando configurado e ativo, reserva altura mínima determinística (min-h-[110px]) para evitar CLS.
 * - Respeita falhas de carregamento sem quebrar a página.
 */
export const EditorialAdSlot: React.FC<EditorialAdSlotProps> = ({
  placement,
  activeView,
  config = SITE_CONFIG.adsense,
  className = '',
}) => {
  const pushedRef = useRef(false);

  const isAllowedRoute = adSenseService.isRouteAllowedForAds(activeView);
  const isSlotReady = adSenseService.isSlotReady(placement, config);
  const canInit = adSenseService.canInitializeAds(config);
  const slotId = adSenseService.getSlotId(placement, config);

  useEffect(() => {
    if (!isAllowedRoute || !isSlotReady || !canInit || pushedRef.current) {
      return;
    }

    try {
      adSenseService.ensureAdSenseScriptLoaded(config);
      const consentMode = adSenseService.getAdvertisingConsent();
      window.adsbygoogle = window.adsbygoogle || [];
      if (consentMode === 'non_personalized') {
        (window.adsbygoogle as unknown as { requestNonPersonalizedAds?: number }).requestNonPersonalizedAds = 1;
      }
      window.adsbygoogle.push({});
      pushedRef.current = true;
    } catch {
      // Falha silenciosa caso um bloqueador impeça o script: o site permanece 100% funcional
    }
  }, [isAllowedRoute, isSlotReady, canInit, config]);

  // Proteção estrita: jamais renderiza no editor ou quando não há configuração real do AdSense
  if (!isAllowedRoute || !isSlotReady || !canInit) {
    return null;
  }

  return (
    <aside
      aria-label="Espaço publicitário discreto para manutenção gratuita do FOLIO"
      data-ad-placement={placement}
      className={`mx-auto max-w-7xl px-4 sm:px-8 my-6 ${className}`}
    >
      <div className="border border-paper bg-ivory-warm/35 p-3">
        <div className="flex items-center justify-between font-mono text-[9.5px] uppercase tracking-widest text-ink-subtle mb-2">
          <span>PUBLICIDADE · APOIO À GRATUIDADE DO FOLIO</span>
          <span>ESPAÇO RESERVADO (ZERO CLS)</span>
        </div>

        {/* Container com altura mínima reservada para evitar Cumulative Layout Shift (CLS) */}
        <div className="min-h-[100px] sm:min-h-[110px] w-full flex items-center justify-center overflow-hidden bg-ivory/60">
          <ins
            className="adsbygoogle block w-full"
            style={{ display: 'block', minHeight: '90px' }}
            data-ad-client={config.clientId}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </aside>
  );
};
