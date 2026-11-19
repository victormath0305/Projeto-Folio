import React, { useState } from 'react';
import {
  Download,
  Eye,
  FileText,
  Grid,
  LayoutGrid,
  Loader2,
  Maximize2,
} from 'lucide-react';
import { TEMPLATE_CATALOG } from '../../data/sampleResumes';
import { paginateResumeDocument } from '../../services/paginationEngine';
import { sanitizeResumeFileName } from '../../services/pdfExportService';
import { ResumeDocument, ResumeTemplateId } from '../../types/resume';
import { A4DocumentRenderer } from '../resume-templates/A4DocumentRenderer';

interface EditorPreviewPaneProps {
  userDocument: ResumeDocument;
  templateId: ResumeTemplateId;
  showSampleMode: boolean;
  isExportingPdf: boolean;
  onToggleSampleMode: (showSample: boolean) => void;
  onOpenTemplateLibrary: () => void;
  onInspectFullA4: (doc: ResumeDocument, templateId: ResumeTemplateId) => void;
  onExportPdf: () => void;
}

export const EditorPreviewPane: React.FC<EditorPreviewPaneProps> = ({
  userDocument,
  templateId,
  showSampleMode,
  isExportingPdf,
  onToggleSampleMode,
  onOpenTemplateLibrary,
  onInspectFullA4,
  onExportPdf,
}) => {
  const [showEditorialGrid, setShowEditorialGrid] = useState(false);
  const [selectedPageFilter, setSelectedPageFilter] = useState<'all' | number>('all');

  const catalogItem =
    TEMPLATE_CATALOG.find((t) => t.id === templateId) ?? TEMPLATE_CATALOG[1];

  const activeDocument = showSampleMode ? catalogItem.sampleDocument : userDocument;
  const paginatedPages = paginateResumeDocument(activeDocument, templateId);
  const totalPages = paginatedPages.length;

  const visiblePages =
    selectedPageFilter === 'all' || selectedPageFilter > totalPages
      ? paginatedPages
      : paginatedPages.filter((p) => p.pageNumber === selectedPageFilter);

  const previewFileName = sanitizeResumeFileName(activeDocument.personal.fullName);

  return (
    <div className="h-full flex flex-col justify-between bg-ivory-warm/70 paper-grid-bg p-4 sm:p-6 lg:p-8">
      <div>
        {/* Barra de Controle Superior da Mesa de Prova A4 */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border border-ink bg-ivory p-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-vermilion inline-block" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold">
              PRÉVIA · {catalogItem.shortCode} {catalogItem.name}
            </span>
            <span className="border border-paper bg-ivory-warm px-1.5 py-0.5 font-mono text-[10px] text-ink">
              {totalPages} {totalPages === 1 ? 'PÁGINA A4' : 'PÁGINAS A4'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenTemplateLibrary}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border border-ink bg-ivory-warm text-ink hover:bg-ink hover:text-ivory transition-colors"
              title="Abrir biblioteca visual dos 5 modelos profissionais"
            >
              <LayoutGrid className="w-3 h-3 text-vermilion" aria-hidden="true" />
              <span>5 Modelos</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleSampleMode(!showSampleMode)}
              aria-pressed={showSampleMode}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border transition-colors ${
                showSampleMode
                  ? 'border-vermilion bg-vermilion text-sheet'
                  : 'border-paper bg-ivory text-ink hover:border-ink'
              }`}
              title="Alternar entre os seus dados reais e um exemplo demonstrativo da matriz"
            >
              <Eye className="w-3 h-3" aria-hidden="true" />
              <span>{showSampleMode ? 'Modo Exemplo Ativo' : 'Ver exemplo inicial'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowEditorialGrid((prev) => !prev)}
              aria-pressed={showEditorialGrid}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider border transition-colors ${
                showEditorialGrid
                  ? 'border-ink bg-ink text-ivory'
                  : 'border-paper bg-ivory text-ink hover:border-ink'
              }`}
              title="Exibir ou ocultar grade suíça de alinhamento"
            >
              <Grid className="w-3 h-3" aria-hidden="true" />
              <span>Grade</span>
            </button>
          </div>
        </div>

        {/* Barra de Paginação quando o currículo possui múltiplas folhas A4 */}
        {totalPages > 1 && (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border border-paper bg-ivory px-3 py-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
              <span>Paginação automática A4 ({totalPages} laudas)</span>
            </span>

            <div className="flex items-center gap-1" role="group" aria-label="Navegar entre páginas A4">
              <button
                type="button"
                onClick={() => setSelectedPageFilter('all')}
                aria-pressed={selectedPageFilter === 'all'}
                className={`px-2 py-0.5 font-mono text-[10px] uppercase border ${
                  selectedPageFilter === 'all'
                    ? 'bg-ink text-ivory border-ink'
                    : 'bg-ivory-warm text-ink border-paper'
                }`}
              >
                Todas ({totalPages})
              </button>
              {paginatedPages.map((p) => (
                <button
                  key={p.pageNumber}
                  type="button"
                  onClick={() => setSelectedPageFilter(p.pageNumber)}
                  aria-pressed={selectedPageFilter === p.pageNumber}
                  className={`px-2 py-0.5 font-mono text-[10px] uppercase border ${
                    selectedPageFilter === p.pageNumber
                      ? 'bg-vermilion text-sheet border-vermilion'
                      : 'bg-ivory-warm text-ink border-paper'
                  }`}
                >
                  Pág. 0{p.pageNumber}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Aviso quando o usuário está apenas inspecionando o exemplo inicial */}
        {showSampleMode && (
          <div className="mb-3 border border-vermilion bg-vermilion/10 px-3 py-2 flex items-center justify-between gap-2 text-xs">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink">
              Exibindo exemplo demonstrativo ({catalogItem.sampleDocument.personal.fullName}). Ao digitar no formulário, a folha volta aos seus dados reais.
            </span>
            <button
              type="button"
              onClick={() => onToggleSampleMode(false)}
              className="font-mono text-[10px] uppercase tracking-wider text-vermilion underline shrink-0 font-semibold"
            >
              Ver meus dados
            </button>
          </div>
        )}

        {/* Régua Milimétrica */}
        <div
          className="mb-2 flex items-center justify-between font-mono text-[10px] text-ink-subtle uppercase tracking-widest px-1"
          aria-hidden="true"
        >
          <span>├ 0 mm</span>
          <span>A4 (210 × 297 MM)</span>
          <span>210 mm ┤</span>
        </div>

        {/* Lista de Folhas A4 Paginadas */}
        <div className="space-y-6">
          {visiblePages.map((pageData) => (
            <div
              key={pageData.pageNumber}
              className="relative mx-auto w-full max-w-[490px]"
            >
              <div
                className="pointer-events-none absolute inset-0 translate-x-2 translate-y-2 border border-ink/25 bg-ivory"
                aria-hidden="true"
              />

              <div className="relative">
                <A4DocumentRenderer
                  document={activeDocument}
                  templateId={templateId}
                  paginatedPage={pageData}
                  showEditorialGrid={showEditorialGrid}
                />

                {pageData.pageNumber === 1 && (
                  <button
                    type="button"
                    onClick={() => onInspectFullA4(activeDocument, templateId)}
                    className="absolute bottom-3 right-3 z-30 inline-flex items-center gap-1.5 bg-ink/90 text-ivory px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border border-ink transition-all hover:bg-vermilion hover:border-vermilion hover:text-sheet"
                  >
                    <Maximize2 className="w-3 h-3" aria-hidden="true" />
                    <span>Ampliar A4</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Colofão Inferior da Mesa de Prova + Botão Direto de Exportação PDF */}
      <div className="mt-6 pt-4 border-t border-paper space-y-3">
        <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-ink-muted">
          <span className="truncate">
            ARQUIVO: <strong className="text-ink">{previewFileName}</strong>
          </span>
          <span className="shrink-0">VETORIAL · ZERO MARCA D’ÁGUA</span>
        </div>

        <button
          type="button"
          onClick={onExportPdf}
          disabled={isExportingPdf}
          className="w-full btn-editorial-primary py-3 text-xs font-mono uppercase tracking-wider disabled:opacity-60"
        >
          {isExportingPdf ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>PREPARANDO DOCUMENTO PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>BAIXAR CURRÍCULO PDF ({totalPages} {totalPages === 1 ? 'PÁG.' : 'PÁGS.'})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
