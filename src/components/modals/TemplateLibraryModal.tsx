import React, { useEffect, useState } from 'react';
import { Check, Eye, Layers, ShieldCheck, X } from 'lucide-react';
import { TEMPLATE_CATALOG } from '../../data/sampleResumes';
import { isResumeDocumentEmpty } from '../../services/storageService';
import { ResumeDocument, ResumeTemplateId } from '../../types/resume';
import { A4DocumentRenderer } from '../resume-templates/A4DocumentRenderer';

interface TemplateLibraryModalProps {
  isOpen: boolean;
  selectedTemplateId: ResumeTemplateId;
  userDocument: ResumeDocument;
  onSelectTemplate: (templateId: ResumeTemplateId) => void;
  onClose: () => void;
}

/**
 * Biblioteca Visual dos 5 Modelos Profissionais do FOLIO (Fase 04)
 * Permite comparar estrutura, perfil recomendado, orientação ATS honesta
 * e visualizar cada matriz com os próprios dados reais do usuário.
 */
export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  selectedTemplateId,
  userDocument,
  onSelectTemplate,
  onClose,
}) => {
  const userHasData = !isResumeDocumentEmpty(userDocument);
  const [previewWithUserData, setPreviewWithUserData] = useState<boolean>(userHasData);

  useEffect(() => {
    setPreviewWithUserData(!isResumeDocumentEmpty(userDocument));
  }, [userDocument, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-library-title"
    >
      <div className="relative my-auto w-full max-w-7xl border-2 border-ink bg-ivory shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Barra Superior da Biblioteca de Modelos */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink bg-ivory-warm px-4 sm:px-6 py-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-vermilion inline-block" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-vermilion font-semibold">
                ACERVO TIPOGRÁFICO FOLIO · 05 MATRIZES A4
              </span>
            </div>
            <h2
              id="template-library-title"
              className="font-serif text-2xl sm:text-3xl text-ink tracking-tight mt-0.5"
            >
              Biblioteca de Modelos Profissionais
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Alternador: Visualizar com dados reais do usuário vs exemplos */}
            {userHasData && (
              <div
                className="inline-flex items-center border border-ink bg-ivory p-0.5"
                role="group"
                aria-label="Modo de dados da pré-visualização na biblioteca"
              >
                <button
                  type="button"
                  onClick={() => setPreviewWithUserData(true)}
                  aria-pressed={previewWithUserData}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                    previewWithUserData
                      ? 'bg-ink text-ivory font-semibold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Com meus dados
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewWithUserData(false)}
                  aria-pressed={!previewWithUserData}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                    !previewWithUserData
                      ? 'bg-vermilion text-sheet font-semibold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  Exemplos de perfil
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center p-2 border border-ink bg-ivory text-ink hover:bg-vermilion hover:border-vermilion hover:text-sheet transition-colors"
              aria-label="Fechar biblioteca de modelos"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Faixa de Recomendação Honesta sobre Sistemas ATS */}
        <div className="border-b border-paper bg-ivory px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-vermilion shrink-0" aria-hidden="true" />
            <span>
              <strong className="text-ink">Nota de transparência ATS:</strong> Nenhum modelo visual garante aprovação automática em processos seletivos, mas todos os 5 modelos do FOLIO geram PDFs com texto 100% vetorial, selecionável e títulos convencionais. Para triagens automatizadas rigorosas, recomendamos priorizar o modelo <strong className="text-ink">M·01 ESSENCIAL</strong>.
            </span>
          </div>
        </div>

        {/* Grade Comparativa dos 5 Modelos A4 */}
        <div className="overflow-y-auto flex-1 divide-y divide-ink">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-ink">
            {TEMPLATE_CATALOG.map((item) => {
              const isSelected = selectedTemplateId === item.id;
              const docToRender =
                previewWithUserData && userHasData
                  ? userDocument
                  : item.sampleDocument;

              return (
                <article
                  key={item.id}
                  aria-label={`Modelo ${item.shortCode} ${item.name}`}
                  className={`flex flex-col justify-between transition-colors ${
                    isSelected ? 'bg-ivory-warm/50' : 'bg-ivory'
                  }`}
                >
                  <div>
                    {/* Cabeçalho do Modelo */}
                    <div className="p-4 border-b border-paper">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-vermilion">
                          {item.shortCode} · {item.seriesName}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1 bg-ink text-ivory px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider">
                            <Check className="w-3 h-3 text-vermilion" aria-hidden="true" />
                            Ativo
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-2xl text-ink tracking-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-ink mt-0.5">
                        {item.tagline}
                      </p>
                    </div>

                    {/* Miniatura Real de Documento A4 */}
                    <div className="p-4 bg-ivory-warm/75 paper-grid-bg border-b border-paper">
                      <div className="mb-1.5 flex items-center justify-between font-mono text-[9.5px] text-ink-subtle uppercase">
                        <span>{item.code}</span>
                        <span>
                          {previewWithUserData && userHasData ? 'SEUS DADOS' : 'EXEMPLO'}
                        </span>
                      </div>

                      <div
                        onClick={() => {
                          onSelectTemplate(item.id);
                          onClose();
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectTemplate(item.id);
                            onClose();
                          }
                        }}
                        aria-label={`Selecionar e aplicar modelo ${item.name}`}
                        className="cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                      >
                        <A4DocumentRenderer
                          document={docToRender}
                          templateId={item.id}
                          compact
                        />
                      </div>
                    </div>

                    {/* Ficha Comparativa de Perfil e Estrutura */}
                    <div className="p-4 space-y-3 text-xs">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle mb-0.5">
                          Perfil recomendado
                        </div>
                        <p className="text-ink font-medium leading-snug">
                          {item.recommendedProfile}
                        </p>
                      </div>

                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle mb-0.5 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-vermilion" aria-hidden="true" />
                          <span>Diferencial estrutural</span>
                        </div>
                        <p className="text-ink-muted leading-snug text-[11.5px]">
                          {item.structuralHighlight}
                        </p>
                      </div>

                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle mb-0.5 flex items-center gap-1">
                          <Eye className="w-3 h-3 text-vermilion" aria-hidden="true" />
                          <span>Leitura &amp; ATS</span>
                        </div>
                        <p className="text-ink-muted leading-snug text-[11px]">
                          {item.atsGuidance}
                        </p>
                      </div>

                      <div className="pt-1 flex flex-wrap gap-1">
                        {item.idealFor.map((tag) => (
                          <span
                            key={tag}
                            className="border border-paper bg-ivory-warm px-1.5 py-0.5 text-[10px] text-ink"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Botão de Seleção do Modelo */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTemplate(item.id);
                        onClose();
                      }}
                      className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-mono uppercase tracking-wider border transition-colors ${
                        isSelected
                          ? 'bg-vermilion border-vermilion text-sheet font-semibold'
                          : 'bg-ink border-ink text-ivory hover:bg-vermilion hover:border-vermilion hover:text-sheet'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Modelo {item.name} ativo</span>
                        </>
                      ) : (
                        <span>Utilizar modelo {item.name}</span>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
