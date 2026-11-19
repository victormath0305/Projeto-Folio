import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Copy,
  HeartHandshake,
  QrCode,
  Send,
  Star,
  X,
} from 'lucide-react';
import { PixRecipientConfig, SITE_CONFIG } from '../../config/siteConfig';
import { analyticsService } from '../../services/analyticsService';
import {
  generatePixPaymentArtifact,
  isPixConfigured,
} from '../../services/pixPayloadService';
import { storageService } from '../../services/storageService';

interface PostDownloadSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixConfigOverride?: PixRecipientConfig;
  feedbackEndpointOverride?: string;
}

/**
 * Modal Editorial de Avaliação e Apoio Voluntário Pós-Download — FOLIO
 *
 * Exibido com atraso suave (~2s) exclusivamente após um download de PDF bem-sucedido.
 * - Avaliação opcional de 1 a 5 estrelas e campo opcional de sugestões (sem simular envio quando não há endpoint real).
 * - Contribuição voluntária via Pix com valor livre reaproveitando pixPayloadService.ts e SITE_CONFIG.pix.
 * - 100% dispensável ("Agora não", botão X ou Escape) com persistência versionada em storageService.
 */
export const PostDownloadSupportModal: React.FC<PostDownloadSupportModalProps> = ({
  isOpen,
  onClose,
  pixConfigOverride,
  feedbackEndpointOverride,
}) => {
  const activePixConfig = pixConfigOverride ?? SITE_CONFIG.pix;
  const feedbackEndpoint =
    (feedbackEndpointOverride ?? SITE_CONFIG.feedbackEndpointUrl).trim();

  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [suggestion, setSuggestion] = useState<string>('');
  const [isSendingFeedback, setIsSendingFeedback] = useState<boolean>(false);
  const [feedbackStatus, setFeedbackStatus] = useState<
    'idle' | 'sent' | 'not_configured' | 'error'
  >('idle');

  const [amountInput, setAmountInput] = useState<string>('');
  const [copiedPix, setCopiedPix] = useState<boolean>(false);

  const parsedAmount = useMemo<number | null>(() => {
    const cleaned = amountInput.replace(',', '.').replace(/[^0-9.]/g, '');
    if (!cleaned) return null; // Valor livre no app do banco (BR Code sem campo 54)
    const parsed = parseFloat(cleaned);
    if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 100000) {
      return null;
    }
    return parsed;
  }, [amountInput]);

  const pixReady = isPixConfigured(activePixConfig);
  const pixArtifact = useMemo(() => {
    if (!pixReady) return null;
    return generatePixPaymentArtifact(parsedAmount, activePixConfig);
  }, [pixReady, parsedAmount, activePixConfig]);

  const handleDismiss = () => {
    storageService.markPostDownloadSupportDismissed();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        storageService.markPostDownloadSupportDismissed();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 && !suggestion.trim()) return;

    // Se não houver endpoint real de recebimento configurado, jamais simula envio bem-sucedido
    if (!feedbackEndpoint) {
      setFeedbackStatus('not_configured');
      storageService.markPostDownloadSupportEvaluated(rating || undefined);
      return;
    }

    setIsSendingFeedback(true);
    setFeedbackStatus('idle');
    try {
      const response = await fetch(feedbackEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          rating: rating || null,
          comment: suggestion.trim().slice(0, 1000) || null,
          source: 'folio-post-download',
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha no envio');
      }

      setFeedbackStatus('sent');
      storageService.markPostDownloadSupportEvaluated(rating || undefined);
    } catch {
      setFeedbackStatus('error');
    } finally {
      setIsSendingFeedback(false);
    }
  };

  const handleCopyPix = async () => {
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
      setCopiedPix(true);
      analyticsService.trackEvent('pix_code_copied', { route: '/editor' });
    } catch {
      setCopiedPix(true);
    }
  };

  const activeStarValue = hoveredRating || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/75 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-download-modal-title"
      data-testid="post-download-support-modal"
    >
      <div className="relative my-auto w-full max-w-3xl border-2 border-ink bg-ivory shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Faixa Superior Editorial */}
        <div className="flex items-center justify-between border-b border-ink bg-ivory-warm px-4 sm:px-6 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-vermilion inline-block" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-ink font-semibold">
              CURRÍCULO EXPORTADO · FOLIO
            </span>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex items-center justify-center p-1.5 border border-ink bg-ivory text-ink hover:bg-vermilion hover:border-vermilion hover:text-sheet transition-colors"
            aria-label="Fechar janela"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Conteúdo Rolável Responsivo */}
        <div className="overflow-y-auto flex-1">
          {/* Cabeçalho Principal */}
          <div className="px-5 sm:px-8 pt-6 pb-5 border-b border-paper">
            <h2
              id="post-download-modal-title"
              className="font-serif text-3xl sm:text-4xl text-ink tracking-tight leading-[1.08]"
            >
              Seu próximo capítulo começa agora.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-ink-muted leading-relaxed">
              Esperamos que seu novo currículo ajude você a conquistar grandes oportunidades.
            </p>
          </div>

          {/* Grade Principal: Avaliação (Esquerda) + Apoio Voluntário Pix (Direita) */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-ink">
            {/* Bloco 1: Avaliação de 1 a 5 Estrelas + Sugestão Opcional */}
            <form
              onSubmit={handleSubmitFeedback}
              className="md:col-span-6 p-5 sm:p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-2xl text-ink">
                    O que você achou do FOLIO?
                  </h3>
                  <p className="text-xs text-ink-muted mt-1">
                    Sua avaliação é opcional e ajuda a melhorar a ferramenta.
                  </p>
                </div>

                {/* Estrelas 1 a 5 */}
                <div
                  className="flex items-center gap-1.5"
                  role="radiogroup"
                  aria-label="Avaliação de 1 a 5 estrelas"
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = star <= activeStarValue;
                    return (
                      <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={rating === star}
                        aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                        onClick={() => {
                          setRating(star);
                          setFeedbackStatus('idle');
                        }}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className={`p-2 border transition-colors ${
                          filled
                            ? 'border-vermilion bg-vermilion/10 text-vermilion'
                            : 'border-paper bg-ivory-warm/50 text-ink-subtle hover:border-ink hover:text-ink'
                        }`}
                      >
                        <Star
                          className="w-5 h-5"
                          fill={filled ? 'currentColor' : 'none'}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                  {rating > 0 && (
                    <span className="ml-2 font-mono text-xs text-ink font-medium">
                      {rating}/5
                    </span>
                  )}
                </div>

                {/* Campo Opcional de Sugestões */}
                <div>
                  <label
                    htmlFor="post-download-suggestion"
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1.5"
                  >
                    Quer deixar alguma sugestão?
                  </label>
                  <textarea
                    id="post-download-suggestion"
                    rows={3}
                    value={suggestion}
                    onChange={(e) => {
                      setSuggestion(e.target.value);
                      if (feedbackStatus !== 'idle') setFeedbackStatus('idle');
                    }}
                    placeholder="Opcional: conte o que podemos melhorar nos modelos ou no editor..."
                    className="w-full border border-ink bg-sheet px-3 py-2 text-xs sm:text-sm text-ink placeholder:text-ink-subtle/70 focus:border-vermilion focus:outline-none resize-y"
                  />
                </div>

                {/* Status Transparente do Envio */}
                {feedbackStatus === 'sent' && (
                  <p
                    role="status"
                    className="border-l-2 border-vermilion bg-ivory-warm px-3 py-2 text-xs text-ink"
                  >
                    Obrigado! Sua avaliação foi enviada com sucesso.
                  </p>
                )}

                {feedbackStatus === 'not_configured' && (
                  <p
                    role="status"
                    className="border-l-2 border-ink bg-ivory-warm px-3 py-2 text-xs text-ink-muted"
                  >
                    O envio automático de comentários ainda não está conectado a um servidor externo, portanto sua mensagem não foi transmitida. Obrigado por usar o FOLIO!
                  </p>
                )}

                {feedbackStatus === 'error' && (
                  <p
                    role="alert"
                    className="border-l-2 border-vermilion bg-vermilion/10 px-3 py-2 text-xs text-ink"
                  >
                    Não foi possível enviar sua avaliação agora. Você pode fechar esta janela normalmente.
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSendingFeedback || (rating === 0 && !suggestion.trim())}
                  className="w-full inline-flex items-center justify-center gap-2 border border-ink bg-ivory-warm px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-ink hover:bg-ink hover:text-ivory transition-colors disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {isSendingFeedback ? 'Enviando...' : 'Enviar avaliação'}
                  </span>
                </button>
              </div>
            </form>

            {/* Bloco 2: Apoio Financeiro Voluntário via Pix (Valor Livre) */}
            <div className="md:col-span-6 p-5 sm:p-6 bg-ivory-warm/45 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-vermilion font-semibold">
                  <HeartHandshake className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>APOIO VOLUNTÁRIO · PIX</span>
                </div>

                <h3 className="font-serif text-2xl text-ink leading-tight">
                  Ajude o FOLIO a continuar gratuito.
                </h3>

                <p className="text-xs text-ink-muted leading-relaxed">
                  O projeto foi criado para ajudar pessoas a apresentarem suas histórias profissionais. Se ele foi útil para você, considere fazer uma contribuição voluntária de qualquer valor.
                </p>

                {/* Campo de Valor Livre em Reais */}
                <div>
                  <label
                    htmlFor="post-download-pix-amount"
                    className="block font-mono text-[10px] uppercase tracking-wider text-ink font-semibold mb-1"
                  >
                    Valor da contribuição (opcional — ou escolha no banco)
                  </label>
                  <div className="flex items-center border border-ink bg-sheet px-3 py-2">
                    <span className="font-mono text-xs text-ink-muted mr-2">R$</span>
                    <input
                      id="post-download-pix-amount"
                      type="text"
                      inputMode="decimal"
                      value={amountInput}
                      onChange={(e) => {
                        setAmountInput(e.target.value);
                        setCopiedPix(false);
                      }}
                      placeholder="Qualquer valor (ex.: 10,00)"
                      className="w-full text-xs sm:text-sm font-mono text-ink placeholder:text-ink-subtle/70 focus:outline-none"
                    />
                  </div>
                </div>

                {/* QR Code + Beneficiário + Pix Copia e Cola */}
                {pixArtifact && (
                  <div className="border border-ink bg-sheet p-3.5 space-y-3">
                    <div className="flex items-center gap-3.5">
                      <div className="border border-paper p-1.5 bg-sheet shrink-0">
                        <svg
                          viewBox={`0 0 ${pixArtifact.qrMatrix.size + 4} ${
                            pixArtifact.qrMatrix.size + 4
                          }`}
                          className="w-24 h-24 sm:w-28 sm:h-28"
                          role="img"
                          aria-label={`QR Code Pix para apoio de ${pixArtifact.formattedAmountBRL}`}
                          data-testid="modal-pix-qrcode-svg"
                          data-qr-payload={pixArtifact.payload}
                          data-qr-amount={
                            pixArtifact.amount !== null
                              ? pixArtifact.amount.toFixed(2)
                              : 'livre'
                          }
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

                      <div className="min-w-0 flex-1 space-y-1.5 text-[11px]">
                        <div className="inline-flex items-center gap-1 font-mono text-[10px] uppercase text-vermilion font-semibold">
                          <QrCode className="w-3 h-3" aria-hidden="true" />
                          <span>{pixArtifact.formattedAmountBRL}</span>
                        </div>
                        <div className="font-mono text-[10px] text-ink-muted leading-snug">
                          <div className="text-ink-subtle uppercase">Beneficiário</div>
                          <div className="text-ink font-semibold break-words">
                            {pixArtifact.displayRecipientName}
                          </div>
                        </div>
                        {pixArtifact.recipientInstitution && (
                          <div className="font-mono text-[10px] text-ink-muted">
                            <span className="text-ink-subtle uppercase">Instituição: </span>
                            <span className="text-ink font-medium">
                              {pixArtifact.recipientInstitution}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <textarea
                      aria-label="Código Pix Copia e Cola do modal"
                      readOnly
                      rows={2}
                      value={pixArtifact.payload}
                      className="w-full border border-paper bg-ivory/60 p-2 font-mono text-[10px] text-ink break-all focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="w-full btn-editorial-primary py-2.5 text-xs font-mono uppercase tracking-wider"
                    >
                      {copiedPix ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Código Pix copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copiar código Pix</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé do Modal: Botão "Agora não" */}
        <div className="border-t border-ink bg-ivory-warm px-5 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] font-mono text-ink-subtle">
            Avaliação e apoio totalmente voluntários.
          </span>
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-2 border border-ink bg-ivory text-xs font-mono uppercase tracking-wider text-ink hover:bg-ink hover:text-ivory transition-colors"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
};
