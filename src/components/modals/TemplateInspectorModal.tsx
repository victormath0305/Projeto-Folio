import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Grid, X } from 'lucide-react';
import { TEMPLATE_CATALOG } from '../../data/sampleResumes';
import { paginateResumeDocument } from '../../services/paginationEngine';
import { ResumeDocument, ResumeTemplateId } from '../../types/resume';
import { A4DocumentRenderer } from '../resume-templates/A4DocumentRenderer';

interface TemplateInspectorModalProps {
  isOpen: boolean;
  document: ResumeDocument | null;
  initialTemplateId: ResumeTemplateId;
  onClose: () => void;
  onSelectAndStart: (templateId: ResumeTemplateId) => void;
}

export const TemplateInspectorModal: React.FC<TemplateInspectorModalProps> = ({
  isOpen,
  document,
  initialTemplateId,
  onClose,
  onSelectAndStart,
}) => {
  const [activeTemplateId, setActiveTemplateId] = useState<ResumeTemplateId>(initialTemplateId);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    setActiveTemplateId(initialTemplateId);
  }, [initialTemplateId]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !document) return null;

  const catalogInfo = TEMPLATE_CATALOG.find((t) => t.id === activeTemplateId) ?? TEMPLATE_CATALOG[0];
  const pages = paginateResumeDocument(document, activeTemplateId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspector-modal-title"
    >
      <div className="relative my-auto w-full max-w-5xl border-2 border-ink bg-ivory shadow-2xl overflow-hidden">
        {/* Barra Superior Técnica do Inspetor */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink bg-ivory-warm px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-vermilion inline-block" aria-hidden="true" />
            <h2
              id="inspector-modal-title"
              className="font-mono text-xs uppercase tracking-widest text-ink font-semibold"
            >
              INSPETOR DE MATRIZ A4 · {catalogInfo.name} ({pages.length} {pages.length === 1 ? 'LAUDA' : 'LAUDAS'})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowGrid((prev) => !prev)}
              aria-pressed={showGrid}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors ${
                showGrid
                  ? 'border-vermilion bg-vermilion text-sheet'
                  : 'border-ink bg-ivory text-ink hover:bg-ivory-warm'
              }`}
            >
              <Grid className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Grade Suíça</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center p-1.5 border border-ink bg-ivory text-ink hover:bg-vermilion hover:border-vermilion hover:text-sheet transition-colors"
              aria-label="Fechar inspetor de documento"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Corpo do Inspetor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
          {/* Coluna das Folhas A4 (8 Colunas) */}
          <div className="lg:col-span-8 bg-ivory-warm/70 paper-grid-bg p-5 sm:p-8 flex flex-col items-center justify-center gap-6 border-b lg:border-b-0 lg:border-r border-ink">
            {pages.map((pageData) => (
              <div key={pageData.pageNumber} className="w-full max-w-[520px]">
                <A4DocumentRenderer
                  document={document}
                  templateId={activeTemplateId}
                  paginatedPage={pageData}
                  showEditorialGrid={showGrid}
                />
              </div>
            ))}
          </div>

          {/* Coluna Lateral de Metadados e Troca de Matriz (4 Colunas) */}
          <div className="lg:col-span-4 p-5 sm:p-6 flex flex-col justify-between bg-ivory">
            <div className="space-y-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-subtle mb-2">
                  Alternar Matriz no Mesmo Conteúdo (5 Modelos)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {TEMPLATE_CATALOG.map((t) => {
                    const active = t.id === activeTemplateId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTemplateId(t.id)}
                        aria-pressed={active}
                        className={`px-2 py-1.5 text-[11px] font-mono uppercase tracking-wider border text-center transition-colors ${
                          active
                            ? 'bg-ink text-ivory border-ink font-semibold'
                            : 'bg-ivory-warm text-ink border-paper hover:border-ink'
                        }`}
                      >
                        <span className="text-vermilion mr-1">{t.shortCode}</span>
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-paper pt-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-vermilion mb-1">
                  {catalogInfo.seriesName}
                </div>
                <h3 className="font-serif text-3xl text-ink">{catalogInfo.name}</h3>
                <p className="text-xs font-semibold text-ink mt-1">{catalogInfo.tagline}</p>
                <p className="text-xs text-ink-muted leading-relaxed mt-2">
                  {catalogInfo.description}
                </p>
              </div>

              <dl className="border-t border-paper divide-y divide-paper text-xs">
                <div className="py-2 flex justify-between gap-2">
                  <dt className="font-mono text-[10px] uppercase text-ink-subtle">Fonte Títulos</dt>
                  <dd className="text-ink font-medium text-right">{catalogInfo.typographicPairing.heading}</dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="font-mono text-[10px] uppercase text-ink-subtle">Fonte Corpo</dt>
                  <dd className="text-ink font-medium text-right">{catalogInfo.typographicPairing.body}</dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="font-mono text-[10px] uppercase text-ink-subtle">Escala</dt>
                  <dd className="text-ink font-medium text-right">{catalogInfo.typographicPairing.scale}</dd>
                </div>
                <div className="py-2 flex justify-between gap-2">
                  <dt className="font-mono text-[10px] uppercase text-ink-subtle">Compatibilidade</dt>
                  <dd className="text-ink font-medium text-right">{catalogInfo.layoutSpecs.atsCompatibility}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 pt-4 border-t border-paper space-y-2.5">
              <button
                type="button"
                onClick={() => onSelectAndStart(activeTemplateId)}
                className="w-full btn-editorial-primary py-3 text-xs sm:text-sm"
              >
                <span>Escolher matriz {catalogInfo.name}</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink border border-paper"
              >
                Fechar inspeção
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
