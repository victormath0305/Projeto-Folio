import React, { useEffect, useState } from 'react';
import { HelpCircle, ShieldAlert, X } from 'lucide-react';
import { adSenseService } from '../../services/adSenseService';

interface AdBlockRecoveryModalProps {
  isOpen: boolean;
  onAllowAds: () => void;
  onDismiss: () => void;
}

/**
 * Modal Editorial de Recuperação de Bloqueio de Anúncios (Fase 07 — Seção 3)
 *
 * Importante:
 * - Quando o script oficial do Google AdSense (Funding Choices / Privacy & Messaging)
 *   está ativo, o próprio Google gerencia o modal e este componente não é aberto em duplicidade.
 * - Este componente materializa o texto, os 3 botões obrigatórios ("Permitir anúncios",
 *   "Como desativar meu Adblock" e "Continuar sem alterar") e as instruções genéricas
 *   para homologação e integração, sendo 100% dispensável (dismiss) e não-bloqueante.
 */
export const AdBlockRecoveryModal: React.FC<AdBlockRecoveryModalProps> = ({
  isOpen,
  onAllowAds,
  onDismiss,
}) => {
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        adSenseService.dismissAdBlockNoticeForSession();
        onDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;

  const handleContinueWithoutChanging = () => {
    adSenseService.dismissAdBlockNoticeForSession();
    onDismiss();
  };

  const handleAllowAdsClick = () => {
    adSenseService.dismissAdBlockNoticeForSession();
    onAllowAds();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="adblock-recovery-title"
    >
      <div className="relative my-auto w-full max-w-xl border-2 border-ink bg-ivory shadow-2xl">
        {/* Barra Superior Discreta */}
        <div className="flex items-center justify-between border-b border-ink bg-ivory-warm px-5 py-3.5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-vermilion" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-widest text-ink font-semibold">
              COMUNICADO DE SUSTENTABILIDADE · ACESSO GRATUITO
            </span>
          </div>

          <button
            type="button"
            onClick={handleContinueWithoutChanging}
            className="p-1.5 border border-ink bg-ivory text-ink hover:bg-vermilion hover:border-vermilion hover:text-sheet transition-colors"
            aria-label="Continuar sem alterar e fechar aviso"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Corpo da Mensagem Obrigatória */}
        <div className="p-6 sm:p-8 space-y-4 text-sm text-ink-muted leading-relaxed">
          <h2
            id="adblock-recovery-title"
            className="font-serif text-3xl sm:text-4xl text-ink tracking-tight leading-tight"
          >
            Ajude o FOLIO a continuar gratuito
          </h2>

          <p>
            O <strong className="text-ink">FOLIO</strong> foi criado para oferecer uma ferramenta 100% gratuita para qualquer pessoa criar um currículo profissional, sem mensalidades, assinaturas ou limitações.
          </p>

          <p>
            Para manter o projeto seguro, disponível e gratuito para todos, precisamos da exibição de anúncios.
          </p>

          <p>
            Pode ficar tranquilo: nossos anúncios são discretos, aparecem apenas nas páginas informativas e não incomodam em nada a criação do seu currículo.
          </p>

          <p className="text-ink font-medium border-l-2 border-vermilion pl-3.5">
            Se você utiliza Adblock ou outro bloqueador de anúncios, pedimos que desative o bloqueio para este site e nos ajude a manter o FOLIO 100% gratuito.
          </p>

          {/* Painel Expansível: "Como desativar meu Adblock" */}
          {showInstructions && (
            <div
              id="adblock-instructions-panel"
              className="mt-4 border border-ink bg-ivory-warm/70 p-4 space-y-2.5 text-xs"
            >
              <div className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold">
                ORIENTAÇÕES GERAIS PARA PERMITIR ANÚNCIOS NESTE SITE
              </div>
              <p className="text-ink-muted">
                O procedimento exato varia conforme o navegador e a extensão utilizada (como AdBlock, uBlock Origin, AdGuard ou proteções nativas do navegador):
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-ink">
                <li>
                  Localize o ícone do seu bloqueador de anúncios ou escudo de proteção na barra superior do navegador (próximo ao endereço do site).
                </li>
                <li>
                  Clique sobre o ícone e selecione a opção para <strong>pausar neste site</strong> ou <strong>desativar o bloqueio para este domínio</strong>.
                </li>
                <li>
                  Atualize a página ou clique em <strong>“Permitir anúncios”</strong> abaixo para continuar.
                </li>
              </ol>
              <p className="font-mono text-[10.5px] text-ink-subtle pt-1">
                Nota: nosso pedido é exclusivamente para permitir a exibição dos espaços publicitários; nunca solicitamos cliques em anúncios.
              </p>
            </div>
          )}

          {/* Três Botões Obrigatórios */}
          <div className="pt-4 border-t border-paper flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={handleAllowAdsClick}
              className="btn-editorial-primary py-3 px-5 text-xs font-mono uppercase tracking-wider"
            >
              <span>Permitir anúncios</span>
            </button>

            <button
              type="button"
              onClick={() => setShowInstructions((prev) => !prev)}
              aria-expanded={showInstructions}
              aria-controls="adblock-instructions-panel"
              className="btn-editorial-secondary py-3 px-4 text-xs font-mono uppercase tracking-wider bg-ivory"
            >
              <HelpCircle className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
              <span>Como desativar meu Adblock</span>
            </button>

            <button
              type="button"
              onClick={handleContinueWithoutChanging}
              className="py-3 px-4 text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink underline underline-offset-4 text-center sm:ml-auto"
            >
              Continuar sem alterar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
