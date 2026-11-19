import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  LayoutGrid,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { ResumeTemplateId } from '../../types/resume';

interface EditorHeaderProps {
  templateId: ResumeTemplateId;
  progressPercentage: number;
  lastSavedTime: string;
  isSaving: boolean;
  isExportingPdf: boolean;
  onSelectTemplate: (templateId: ResumeTemplateId) => void;
  onOpenTemplateLibrary: () => void;
  onBackToLanding: () => void;
  onRequestClear: () => void;
  onExportPdf: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  templateId,
  progressPercentage,
  lastSavedTime,
  isSaving,
  isExportingPdf,
  onSelectTemplate,
  onOpenTemplateLibrary,
  onBackToLanding,
  onRequestClear,
  onExportPdf,
}) => {
  const templates: { id: ResumeTemplateId; label: string; code: string }[] = [
    { id: 'essencial', label: 'Essencial', code: 'M·01' },
    { id: 'editorial', label: 'Editorial', code: 'M·02' },
    { id: 'classico', label: 'Clássico', code: 'M·03' },
    { id: 'executivo', label: 'Executivo', code: 'M·04' },
    { id: 'tecnico', label: 'Técnico', code: 'M·05' },
  ];

  return (
    <header className="sm:sticky sm:top-0 z-40 bg-ivory/95 backdrop-blur-sm border-b border-ink">
      {/* Faixa Superior de Status, Progresso e Salvamento */}
      <div className="border-b border-paper bg-ivory-warm/80 px-4 sm:px-6 py-1.5">
        <div className="mx-auto max-w-[1600px] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-ink-muted">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-ink font-semibold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 bg-vermilion inline-block" aria-hidden="true" />
              <span className="hidden sm:inline">EDITOR DE CURRÍCULO · FORMATO A4</span>
              <span className="sm:hidden">EDITOR A4</span>
            </span>
            <span className="text-paper-dark">|</span>
            <span
              role="status"
              aria-live="polite"
              className="inline-flex items-center gap-1 text-ink text-[10px] sm:text-[11px]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-vermilion shrink-0" aria-hidden="true" />
              {isSaving ? (
                <span>Salvando...</span>
              ) : (
                <span>Salvo ({lastSavedTime})</span>
              )}
            </span>
          </div>

          {/* Barra de Progresso Discreta */}
          <div className="flex items-center gap-2">
            <span className="uppercase tracking-wider text-[10px]">
              Preenchimento: <strong className="text-ink">{progressPercentage}%</strong>
            </span>
            <div
              className="w-20 sm:w-28 h-2 bg-ivory border border-ink overflow-hidden"
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso de preenchimento do currículo"
            >
              <div
                className="h-full bg-vermilion transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Barra Principal do Editor (Adaptada para Mobile e Desktop com 5 modelos) */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Identidade FOLIO + Voltar */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              type="button"
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink hover:text-vermilion border border-paper hover:border-ink bg-ivory-warm/60 px-2.5 py-1.5 transition-colors"
              title="Voltar para a página inicial (seus dados permanecem salvos)"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Voltar à capa</span>
              <span className="sm:hidden">Capa</span>
            </button>

            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl sm:text-3xl tracking-tight text-ink">
                FOLIO
              </span>
              <span className="inline-block h-1.5 w-1.5 bg-vermilion" aria-hidden="true" />
              <span className="hidden 2xl:inline-block font-mono text-[10px] uppercase tracking-widest text-ink-muted border-l border-paper pl-2.5 ml-1">
                Editor Tipográfico
              </span>
            </div>
          </div>

          {/* Botões Rápidos no Mobile (Biblioteca + Limpar) */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenTemplateLibrary}
              className="inline-flex items-center gap-1 px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider border border-ink bg-ivory-warm text-ink font-medium"
            >
              <LayoutGrid className="w-3 h-3 text-vermilion" aria-hidden="true" />
              <span>5 Modelos</span>
            </button>

            <button
              type="button"
              onClick={onRequestClear}
              className="inline-flex items-center gap-1 px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider border border-paper text-ink-muted hover:text-vermilion hover:border-vermilion bg-ivory transition-colors"
              title="Limpar todos os dados preenchidos no currículo"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Limpar</span>
            </button>
          </div>

          {/* Seletor dos 5 Modelos + Biblioteca Visual + Limpar Dados + Botão BAIXAR CURRÍCULO PDF */}
          <div className="w-full sm:w-auto flex flex-wrap items-center justify-between sm:justify-end gap-2">
            <div
              className="w-full sm:w-auto grid grid-cols-3 sm:flex sm:flex-wrap items-center border border-ink bg-ivory p-0.5 gap-0.5"
              role="group"
              aria-label="Selecionar modelo visual do currículo"
            >
              {templates.map((t) => {
                const active = templateId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onSelectTemplate(t.id)}
                    aria-pressed={active}
                    className={`px-1.5 sm:px-2.5 py-1.5 sm:py-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-center whitespace-nowrap transition-colors ${
                      active
                        ? 'bg-ink text-ivory font-medium'
                        : 'text-ink-muted hover:text-ink hover:bg-ivory-warm'
                    }`}
                  >
                    <span className="hidden xl:inline text-vermilion mr-1">{t.code}</span>
                    {t.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onOpenTemplateLibrary}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider border border-ink bg-ivory-warm text-ink hover:bg-ink hover:text-ivory transition-colors shrink-0"
              title="Abrir biblioteca visual para comparar os 5 modelos profissionais"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
              <span>Comparar 5 modelos</span>
            </button>

            <button
              type="button"
              onClick={onRequestClear}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider border border-paper text-ink-muted hover:text-vermilion hover:border-vermilion bg-ivory transition-colors shrink-0"
              title="Limpar todos os dados preenchidos no currículo"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden lg:inline">Limpar dados</span>
            </button>

            <button
              type="button"
              onClick={onExportPdf}
              disabled={isExportingPdf}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-vermilion text-sheet px-3.5 py-2 sm:py-1.5 text-xs font-mono uppercase tracking-wider font-semibold border border-ink transition-all hover:bg-ink hover:text-ivory disabled:opacity-60 disabled:pointer-events-none shrink-0"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  <span>GERANDO PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>BAIXAR CURRÍCULO PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
