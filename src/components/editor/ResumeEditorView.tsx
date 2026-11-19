import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Download,
  Eye,
  FileEdit,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  calculateResumeProgress,
  storageService,
} from '../../services/storageService';
import {
  downloadResumePDF,
  validateResumeForExport,
} from '../../services/pdfExportService';
import { analyticsService } from '../../services/analyticsService';
import {
  CourseItem,
  EducationItem,
  EditorSectionId,
  ExperienceItem,
  LanguageItem,
  PersonalInfo,
  ResumeDocument,
  ResumeTemplateId,
} from '../../types/resume';
import { EDITOR_SECTIONS } from './editorConfig';
import { EditorHeader } from './EditorHeader';
import { EditorSectionNav } from './EditorSectionNav';
import { EditorPreviewPane } from './EditorPreviewPane';
import { PersonalSectionForm } from './sections/PersonalSectionForm';
import { ExperienceSectionForm } from './sections/ExperienceSectionForm';
import { EducationCoursesSectionForm } from './sections/EducationCoursesSectionForm';
import { SkillsLanguagesAdditionalForm } from './sections/SkillsLanguagesAdditionalForm';
import { TemplateLibraryModal } from '../modals/TemplateLibraryModal';

interface ResumeEditorViewProps {
  initialTemplateId: ResumeTemplateId;
  onBackToLanding: () => void;
  onInspectDocument: (doc: ResumeDocument, templateId: ResumeTemplateId) => void;
}

export const ResumeEditorView: React.FC<ResumeEditorViewProps> = ({
  initialTemplateId,
  onBackToLanding,
  onInspectDocument,
}) => {
  const [document, setDocument] = useState<ResumeDocument>(() => {
    const loaded = storageService.loadResumeDocument(initialTemplateId);
    if (initialTemplateId && loaded.metadata.templateId !== initialTemplateId) {
      return {
        ...loaded,
        metadata: { ...loaded.metadata, templateId: initialTemplateId },
      };
    }
    return loaded;
  });

  const [activeSectionId, setActiveSectionId] = useState<EditorSectionId>(() => {
    const prefs = storageService.loadPreferences();
    return prefs.activeSectionId ?? 'dados-pessoais';
  });

  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [showSampleMode, setShowSampleMode] = useState<boolean>(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState<boolean>(false);
  const [templateLibraryOpen, setTemplateLibraryOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>(() =>
    new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  );

  // Estados de Exportação PDF (Fase 03)
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // Salvamento automático no LocalStorage a cada alteração no documento
  useEffect(() => {
    setIsSaving(true);
    storageService.saveResumeDocument(document);
    storageService.savePreferences({
      selectedTemplateId: document.metadata.templateId,
      activeSectionId,
      lastView: 'editor',
    });

    const timer = window.setTimeout(() => {
      setIsSaving(false);
      setLastSavedTime(
        new Date().toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    }, 150);

    return () => window.clearTimeout(timer);
  }, [document, activeSectionId]);

  const currentSectionIndex = EDITOR_SECTIONS.findIndex(
    (s) => s.id === activeSectionId
  );
  const currentSectionMeta =
    EDITOR_SECTIONS[currentSectionIndex] ?? EDITOR_SECTIONS[0];
  const prevSection =
    currentSectionIndex > 0 ? EDITOR_SECTIONS[currentSectionIndex - 1] : null;
  const nextSection =
    currentSectionIndex < EDITOR_SECTIONS.length - 1
      ? EDITOR_SECTIONS[currentSectionIndex + 1]
      : null;

  const progress = calculateResumeProgress(document);

  const clearExportBanners = () => {
    if (exportError) setExportError(null);
    if (exportSuccessMessage) setExportSuccessMessage(null);
  };

  const updatePersonal = (updates: Partial<PersonalInfo>) => {
    setShowSampleMode(false);
    clearExportBanners();
    setDocument((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...updates },
    }));
  };

  const updateExperiences = (experiences: ExperienceItem[]) => {
    setShowSampleMode(false);
    clearExportBanners();
    setDocument((prev) => ({ ...prev, experiences }));
  };

  const updateFirstJobMode = (isFirstJobMode: boolean) => {
    setShowSampleMode(false);
    clearExportBanners();
    setDocument((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, isFirstJobMode },
    }));
  };

  const updateEducation = (education: EducationItem[]) => {
    setShowSampleMode(false);
    clearExportBanners();
    setDocument((prev) => ({ ...prev, education }));
  };

  const updateCourses = (courses: CourseItem[]) => {
    setShowSampleMode(false);
    clearExportBanners();
    setDocument((prev) => ({ ...prev, courses }));
  };

  const updateSkills = (skills: string[]) => {
    setShowSampleMode(false);
    clearExportBanners();
    setDocument((prev) => ({ ...prev, skills }));
  };

  const updateLanguages = (languages: LanguageItem[]) => {
    setShowSampleMode(false);
    clearExportBanners();
    setDocument((prev) => ({ ...prev, languages }));
  };

  const updateAdditionalNotes = (additionalNotes: string) => {
    setShowSampleMode(false);
    clearExportBanners();
    setDocument((prev) => ({ ...prev, additionalNotes }));
  };

  const handleSelectTemplate = (templateId: ResumeTemplateId) => {
    clearExportBanners();
    setDocument((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, templateId },
    }));
    analyticsService.trackEvent('select_template', { templateId });
  };

  const handleConfirmClearAll = () => {
    const fresh = storageService.clearResumeDocument(document.metadata.templateId);
    setDocument(fresh);
    setActiveSectionId('dados-pessoais');
    setShowSampleMode(false);
    clearExportBanners();
    setConfirmClearOpen(false);
  };

  const handleExportPdf = async () => {
    if (isExportingPdf) return;
    setExportError(null);
    setExportSuccessMessage(null);

    const validation = validateResumeForExport(document);
    if (!validation.canExport) {
      setExportError(
        validation.reason ||
          'Preencha ao menos seu nome completo na seção 01 — Dados pessoais antes de baixar o PDF.'
      );
      setActiveSectionId('dados-pessoais');
      return;
    }

    setIsExportingPdf(true);
    try {
      const artifact = await downloadResumePDF(
        document,
        document.metadata.templateId
      );
      if (progress.percentage === 100) {
        analyticsService.trackEvent('complete_resume', {
          templateId: document.metadata.templateId,
          pageCount: artifact.pageCount,
        });
      }
      analyticsService.trackEvent('export_pdf', {
        templateId: document.metadata.templateId,
        pageCount: artifact.pageCount,
      });
      setExportSuccessMessage(
        `PDF gerado com sucesso: ${artifact.fileName} (${artifact.pageCount} ${
          artifact.pageCount === 1 ? 'página A4' : 'páginas A4'
        }).`
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Não foi possível concluir a geração do PDF. Tente novamente.';
      setExportError(message);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-ink">
      {/* Cabeçalho Compacto do Editor */}
      <EditorHeader
        templateId={document.metadata.templateId}
        progressPercentage={progress.percentage}
        lastSavedTime={lastSavedTime}
        isSaving={isSaving}
        isExportingPdf={isExportingPdf}
        onSelectTemplate={handleSelectTemplate}
        onOpenTemplateLibrary={() => setTemplateLibraryOpen(true)}
        onBackToLanding={onBackToLanding}
        onRequestClear={() => setConfirmClearOpen(true)}
        onExportPdf={handleExportPdf}
      />

      {/* Faixa de Feedback de Exportação PDF (Erro com "Tentar novamente" ou Confirmação) */}
      {exportError && (
        <div
          role="alert"
          className="border-b border-ink bg-vermilion text-sheet px-4 sm:px-6 py-2.5"
        >
          <div className="mx-auto max-w-[1600px] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{exportError}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportPdf}
                className="inline-flex items-center gap-1 border border-sheet bg-ink text-ivory px-2.5 py-1 uppercase tracking-wider hover:bg-sheet hover:text-ink transition-colors"
              >
                <RefreshCw className="w-3 h-3" aria-hidden="true" />
                <span>Tentar novamente</span>
              </button>
              <button
                type="button"
                onClick={() => setExportError(null)}
                className="p-1 border border-sheet/40 hover:border-sheet"
                aria-label="Fechar aviso de exportação"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {exportSuccessMessage && (
        <div
          role="status"
          className="border-b border-ink bg-ink text-ivory px-4 sm:px-6 py-2.5"
        >
          <div className="mx-auto max-w-[1600px] flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-vermilion shrink-0" aria-hidden="true" />
              <span>{exportSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setExportSuccessMessage(null)}
              className="p-1 text-paper hover:text-ivory"
              aria-label="Fechar confirmação de download"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Barra de Alternância Mobile (Formulário vs Pré-visualização A4) */}
      <div className="lg:hidden border-b border-ink bg-ivory-warm px-4 py-2 flex items-center gap-2 sticky top-[118px] z-30">
        <button
          type="button"
          onClick={() => setMobileTab('form')}
          aria-pressed={mobileTab === 'form'}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2 text-xs font-mono uppercase tracking-wider border transition-colors ${
            mobileTab === 'form'
              ? 'bg-ink text-ivory border-ink font-semibold'
              : 'bg-ivory text-ink border-paper'
          }`}
        >
          <FileEdit className="w-3.5 h-3.5" aria-hidden="true" />
          <span>01. Editar Campos</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          aria-pressed={mobileTab === 'preview'}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2 text-xs font-mono uppercase tracking-wider border transition-colors ${
            mobileTab === 'preview'
              ? 'bg-vermilion text-sheet border-vermilion font-semibold'
              : 'bg-ivory text-ink border-paper'
          }`}
        >
          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
          <span>02. Prévia Folha A4</span>
        </button>
      </div>

      {/* Navegação Horizontal entre as 09 Seções */}
      <EditorSectionNav
        activeSectionId={activeSectionId}
        document={document}
        onSelectSection={(secId) => {
          setActiveSectionId(secId);
          setMobileTab('form');
        }}
      />

      {/* Corpo Principal do Editor: Esquerda (Formulário) | Direita (Prévia A4 em Tempo Real) */}
      <main id="conteudo-principal" className="flex-1 mx-auto w-full max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-165px)]">
          {/* Coluna Esquerda (7 Colunas no Desktop): Formulário da Seção Ativa */}
          <div
            className={`lg:col-span-7 border-b lg:border-b-0 lg:border-r border-ink flex flex-col justify-between ${
              mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div className="p-4 sm:p-8 lg:p-10 space-y-7">
              {/* Cabeçalho Editorial da Seção Ativa */}
              <div className="border-b border-ink pb-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-vermilion font-semibold">
                    SEÇÃO {currentSectionMeta.number} DE 09 · DIAGRAMAÇÃO GUIADA
                  </span>
                  <span className="font-mono text-[11px] text-ink-subtle">
                    CAMPOS LIVRES &amp; NÃO-BLOQUEANTES
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
                  {currentSectionMeta.title}
                </h1>
                <p className="mt-1.5 text-sm text-ink-muted leading-relaxed">
                  {currentSectionMeta.subtitle}
                </p>

                {/* Nota Editorial Discreta da Seção */}
                <p className="mt-3 text-xs text-ink-subtle font-editorial italic border-l border-paper pl-3">
                  Dica editorial: {currentSectionMeta.editorialTip}
                </p>
              </div>

              {/* Renderização Condicional dos 09 Formulários */}
              {(activeSectionId === 'dados-pessoais' ||
                activeSectionId === 'objetivo' ||
                activeSectionId === 'resumo') && (
                <PersonalSectionForm
                  mode={activeSectionId}
                  personal={document.personal}
                  onChange={updatePersonal}
                />
              )}

              {activeSectionId === 'experiencia' && (
                <ExperienceSectionForm
                  experiences={document.experiences}
                  isFirstJobMode={Boolean(document.metadata.isFirstJobMode)}
                  onChangeExperiences={updateExperiences}
                  onToggleFirstJobMode={updateFirstJobMode}
                  onNavigateToSection={(secId) => setActiveSectionId(secId)}
                />
              )}

              {(activeSectionId === 'formacao' || activeSectionId === 'cursos') && (
                <EducationCoursesSectionForm
                  mode={activeSectionId}
                  education={document.education}
                  courses={document.courses ?? []}
                  onChangeEducation={updateEducation}
                  onChangeCourses={updateCourses}
                />
              )}

              {(activeSectionId === 'habilidades' ||
                activeSectionId === 'idiomas' ||
                activeSectionId === 'adicionais') && (
                <SkillsLanguagesAdditionalForm
                  mode={activeSectionId}
                  skills={document.skills ?? []}
                  languages={document.languages}
                  additionalNotes={document.additionalNotes ?? ''}
                  onChangeSkills={updateSkills}
                  onChangeLanguages={updateLanguages}
                  onChangeAdditionalNotes={updateAdditionalNotes}
                />
              )}
            </div>

            {/* Rodapé de Navegação Entre Etapas (Anterior / Próxima / Baixar PDF) */}
            <div className="border-t border-ink bg-ivory-warm/60 px-4 sm:px-8 py-4 flex items-center justify-between gap-3">
              {prevSection ? (
                <button
                  type="button"
                  onClick={() => setActiveSectionId(prevSection.id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 border border-ink bg-ivory text-xs sm:text-sm font-medium text-ink hover:bg-ivory-warm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {prevSection.number} — {prevSection.shortTitle}
                  </span>
                </button>
              ) : (
                <div className="font-mono text-[11px] text-ink-subtle uppercase">
                  Início do caderno curricular
                </div>
              )}

              {nextSection ? (
                <button
                  type="button"
                  onClick={() => setActiveSectionId(nextSection.id)}
                  className="btn-editorial-primary py-2.5 px-5 text-xs sm:text-sm"
                >
                  <span>
                    Próxima: {nextSection.number} — {nextSection.shortTitle}
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="btn-editorial-primary py-2.5 px-5 text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>BAIXAR CURRÍCULO PDF</span>
                </button>
              )}
            </div>
          </div>

          {/* Coluna Direita (5 Colunas no Desktop): Pré-visualização em Tempo Real */}
          <div
            className={`lg:col-span-5 ${
              mobileTab === 'form' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="lg:sticky lg:top-[112px]">
              <EditorPreviewPane
                userDocument={document}
                templateId={document.metadata.templateId}
                showSampleMode={showSampleMode}
                isExportingPdf={isExportingPdf}
                onToggleSampleMode={setShowSampleMode}
                onOpenTemplateLibrary={() => setTemplateLibraryOpen(true)}
                onInspectFullA4={onInspectDocument}
                onExportPdf={handleExportPdf}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Modal: Biblioteca Visual dos 5 Modelos Profissionais */}
      <TemplateLibraryModal
        isOpen={templateLibraryOpen}
        selectedTemplateId={document.metadata.templateId}
        userDocument={document}
        onSelectTemplate={handleSelectTemplate}
        onClose={() => setTemplateLibraryOpen(false)}
      />

      {/* Modal de Confirmação Antes de Limpar Dados */}
      {confirmClearOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="clear-modal-title"
        >
          <div className="w-full max-w-md border-2 border-ink bg-ivory shadow-2xl">
            <div className="flex items-center justify-between border-b border-ink bg-ivory-warm px-5 py-3.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-vermilion" aria-hidden="true" />
                <h2
                  id="clear-modal-title"
                  className="font-mono text-xs uppercase tracking-widest text-ink font-semibold"
                >
                  CONFIRMAR LIMPEZA DE DADOS
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setConfirmClearOpen(false)}
                className="p-1 border border-ink bg-ivory text-ink hover:bg-vermilion hover:text-sheet"
                aria-label="Cancelar e fechar confirmação"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="font-serif text-2xl text-ink">
                Deseja apagar todas as informações preenchidas?
              </p>
              <p className="text-sm text-ink-muted leading-relaxed">
                Esta ação limpará todos os campos do currículo armazenados localmente no seu navegador e devolverá a folha A4 ao estado inicial em branco.
              </p>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmClearOpen(false)}
                  className="px-4 py-2.5 border border-ink bg-ivory text-xs font-mono uppercase tracking-wider text-ink hover:bg-ivory-warm"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClearAll}
                  className="px-4 py-2.5 border border-vermilion bg-vermilion text-sheet text-xs font-mono uppercase tracking-wider font-semibold hover:bg-ink hover:border-ink transition-colors"
                >
                  Confirmar limpeza
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
