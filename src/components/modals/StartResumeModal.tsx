import React, { useEffect, useState } from 'react';
import { Check, Sparkles, X } from 'lucide-react';
import { TEMPLATE_CATALOG } from '../../data/sampleResumes';
import { storageService } from '../../services/storageService';
import { ResumeDocument, ResumeTemplateId, WorkspacePreferences } from '../../types/resume';
import { A4DocumentRenderer } from '../resume-templates/A4DocumentRenderer';

interface StartResumeModalProps {
  isOpen: boolean;
  initialTemplateId: ResumeTemplateId;
  onClose: () => void;
  onSavePreferences: (prefs: WorkspacePreferences) => void;
}

export const StartResumeModal: React.FC<StartResumeModalProps> = ({
  isOpen,
  initialTemplateId,
  onClose,
  onSavePreferences,
}) => {
  const [templateId, setTemplateId] = useState<ResumeTemplateId>(initialTemplateId);
  const [goal, setGoal] = useState<WorkspacePreferences['candidateGoal']>('recolocacao');
  const [nameDraft, setNameDraft] = useState('');
  const [roleDraft, setRoleDraft] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    const existing = storageService.loadPreferences();
    setTemplateId(initialTemplateId || existing.selectedTemplateId);
    setGoal(existing.candidateGoal ?? 'recolocacao');
    setNameDraft(existing.candidateNameDraft ?? '');
    setRoleDraft(existing.candidateRoleDraft ?? '');
    setSavedFeedback(false);
  }, [initialTemplateId, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedCatalog =
    TEMPLATE_CATALOG.find((t) => t.id === templateId) ?? TEMPLATE_CATALOG[1];

  // Cria documento de prévia ao vivo combinando os dados demonstrativos com o nome/cargo do usuário
  const livePreviewDocument: ResumeDocument = {
    ...selectedCatalog.sampleDocument,
    personal: {
      ...selectedCatalog.sampleDocument.personal,
      fullName:
        nameDraft.trim().length > 0
          ? nameDraft.trim()
          : selectedCatalog.sampleDocument.personal.fullName,
      roleTitle:
        roleDraft.trim().length > 0
          ? roleDraft.trim()
          : selectedCatalog.sampleDocument.personal.roleTitle,
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storageService.savePreferences({
      selectedTemplateId: templateId,
      candidateGoal: goal,
      candidateNameDraft: nameDraft.trim(),
      candidateRoleDraft: roleDraft.trim(),
    });
    onSavePreferences(updated);
    setSavedFeedback(true);
  };

  const goalOptions: { value: WorkspacePreferences['candidateGoal']; label: string }[] = [
    { value: 'primeiro-emprego', label: 'Primeiro emprego' },
    { value: 'estagio', label: 'Estágio universitário / técnico' },
    { value: 'recolocacao', label: 'Recolocação profissional' },
    { value: 'transicao-carreira', label: 'Transição de carreira' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-modal-title"
    >
      <div className="relative my-auto w-full max-w-5xl border-2 border-ink bg-ivory shadow-2xl overflow-hidden">
        {/* Cabeçalho Técnico */}
        <div className="flex items-center justify-between border-b border-ink bg-ivory-warm px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 bg-vermilion inline-block" aria-hidden="true" />
            <h2
              id="start-modal-title"
              className="font-mono text-xs uppercase tracking-widest text-ink font-semibold"
            >
              CONFIGURAÇÃO DE MATRIZ BASE · FUNDAÇÃO FOLIO
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center p-1.5 border border-ink bg-ivory text-ink hover:bg-vermilion hover:border-vermilion hover:text-sheet transition-colors"
            aria-label="Fechar janela de configuração"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Conteúdo em 2 Colunas: Formulário de Base + Prova de Cabeçalho A4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[84vh] overflow-y-auto">
          {/* Coluna Esquerda (7 Colunas): Configuração Inicial */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 p-5 sm:p-6 space-y-4 border-b lg:border-b-0 lg:border-r border-ink"
          >
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-vermilion mb-1">
                PASSO INICIAL · ARMAZENAMENTO LOCAL
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
                Prepare sua lauda A4.
              </h3>
              <p className="text-sm text-ink-muted mt-1 leading-relaxed">
                Defina sua matriz tipográfica preferida e teste seu cabeçalho na folha ao lado. Suas escolhas ficam salvas localmente neste navegador.
              </p>
            </div>

            {/* 1. Seleção de Matriz */}
            <fieldset>
              <legend className="font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-2.5">
                01. Escolha a matriz tipográfica
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {TEMPLATE_CATALOG.map((item) => {
                  const active = templateId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setTemplateId(item.id);
                        setSavedFeedback(false);
                      }}
                      aria-pressed={active}
                      className={`p-3 text-left border transition-all ${
                        active
                          ? 'border-vermilion bg-ivory-warm shadow-architectural-red'
                          : 'border-paper bg-ivory hover:border-ink'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-xl text-ink">{item.name}</span>
                        {active && <Check className="w-4 h-4 text-vermilion" aria-hidden="true" />}
                      </div>
                      <div className="font-mono text-[10px] text-ink-muted mt-1">
                        {item.seriesName}
                      </div>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* 2. Momento Profissional */}
            <fieldset>
              <legend className="font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-2.5">
                02. Objetivo principal do documento
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {goalOptions.map((opt) => {
                  const active = goal === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setGoal(opt.value);
                        setSavedFeedback(false);
                      }}
                      aria-pressed={active}
                      className={`px-3.5 py-2.5 text-left text-xs font-medium border transition-colors ${
                        active
                          ? 'border-ink bg-ink text-ivory'
                          : 'border-paper bg-ivory text-ink hover:bg-ivory-warm'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {/* 3. Teste de Cabeçalho Tipográfico ao Vivo */}
            <div className="space-y-4 pt-2 border-t border-paper">
              <div className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                03. Teste seu nome na prova tipográfica (Opcional)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="candidate-name-input"
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink-muted mb-1"
                  >
                    Seu nome completo
                  </label>
                  <input
                    id="candidate-name-input"
                    type="text"
                    value={nameDraft}
                    onChange={(e) => {
                      setNameDraft(e.target.value);
                      setSavedFeedback(false);
                    }}
                    placeholder="Ex.: Carolina Mendes Silva"
                    className="w-full border border-ink bg-sheet px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="candidate-role-input"
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink-muted mb-1"
                  >
                    Cargo ou área pretendida
                  </label>
                  <input
                    id="candidate-role-input"
                    type="text"
                    value={roleDraft}
                    onChange={(e) => {
                      setRoleDraft(e.target.value);
                      setSavedFeedback(false);
                    }}
                    placeholder="Ex.: Dev Frontend Júnior"
                    className="w-full border border-ink bg-sheet px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Nota Transparente da Fase 01 */}
            <div className="border border-paper bg-ivory-warm/80 p-4 text-xs text-ink-muted leading-relaxed">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
                <span>Status da Plataforma — Fase 01 (Fundação &amp; Design System)</span>
              </div>
              <p>
                A fundação tipográfica, as três matrizes A4 e a persistência local já estão operacionais. O editor completo de múltiplas seções e a exportação vetorial em PDF fazem parte da próxima etapa do projeto.
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="submit"
                className="btn-editorial-primary py-3 px-6 text-xs sm:text-sm"
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Salvar preferência de matriz localmente</span>
              </button>

              {savedFeedback && (
                <span
                  role="status"
                  className="font-mono text-xs text-vermilion font-medium"
                >
                  ✓ Preferências salvas no navegador (LocalStorage)
                </span>
              )}
            </div>
          </form>

          {/* Coluna Direita (5 Colunas): Prévia em Tempo Real na Folha A4 */}
          <div className="lg:col-span-5 bg-ivory-warm/70 paper-grid-bg p-5 sm:p-7 flex flex-col justify-between">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              <span>PROVA EM TEMPO REAL · {selectedCatalog.name}</span>
              <span className="text-vermilion">A4 · 210 × 297 MM</span>
            </div>

            <div className="my-auto mx-auto w-full max-w-[360px]">
              <A4DocumentRenderer
                document={livePreviewDocument}
                templateId={templateId}
                compact
              />
            </div>

            <div className="mt-4 pt-3 border-t border-paper text-[11px] font-mono text-ink-muted flex justify-between">
              <span>ZERO MARCA D’ÁGUA</span>
              <span>DADOS 100% LOCAIS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
