import React from 'react';
import { ArrowDown, ArrowUp, BookOpen, Plus, Trash2 } from 'lucide-react';
import { EditorSectionId, ExperienceItem } from '../../../types/resume';

interface ExperienceSectionFormProps {
  experiences: ExperienceItem[];
  isFirstJobMode: boolean;
  onChangeExperiences: (experiences: ExperienceItem[]) => void;
  onToggleFirstJobMode: (isFirstJob: boolean) => void;
  onNavigateToSection: (sectionId: EditorSectionId) => void;
}

export const ExperienceSectionForm: React.FC<ExperienceSectionFormProps> = ({
  experiences,
  isFirstJobMode,
  onChangeExperiences,
  onToggleFirstJobMode,
  onNavigateToSection,
}) => {
  const handleAddExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    };
    onChangeExperiences([...experiences, newItem]);
  };

  const handleUpdateExperience = (id: string, updates: Partial<ExperienceItem>) => {
    onChangeExperiences(
      experiences.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
    );
  };

  const handleRemoveExperience = (id: string) => {
    onChangeExperiences(experiences.filter((exp) => exp.id !== id));
  };

  const handleMoveExperience = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;
    const copy = [...experiences];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    onChangeExperiences(copy);
  };

  return (
    <div className="space-y-6">
      {/* Painel Especial para Primeiro Emprego / Sem Experiência Formal */}
      <div className="border border-ink bg-ivory-warm/70 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-vermilion font-semibold">
              PRIMEIRO EMPREGO, ESTÁGIO OU INÍCIO DE CARREIRA
            </div>
            <h4 className="font-serif text-xl text-ink mt-0.5">
              Ainda não possui experiência profissional formal?
            </h4>
            <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
              Você pode criar seu currículo sem preencher esta seção. A folha A4 será diagramada automaticamente sem espaços vazios, dando destaque à sua formação e qualificações.
            </p>
          </div>

          <label className="inline-flex items-center gap-2.5 cursor-pointer border border-ink bg-ivory px-3.5 py-2.5 text-xs font-mono uppercase tracking-wider text-ink shrink-0 select-none">
            <input
              type="checkbox"
              checked={isFirstJobMode}
              onChange={(e) => onToggleFirstJobMode(e.target.checked)}
              className="h-4 w-4 accent-vermilion"
            />
            <span>Busco meu 1º emprego</span>
          </label>
        </div>

        {/* Guia Editorial para Valorizar Currículo Sem Experiência */}
        {(isFirstJobMode || experiences.length === 0) && (
          <div className="mt-4 pt-4 border-t border-paper space-y-3">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
              <span>Como valorizar seu currículo sem experiência prévia:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              <div className="border border-paper bg-ivory p-2.5">
                <strong className="text-ink block font-mono text-[10px] uppercase">
                  1. Formação acadêmica
                </strong>
                <span className="text-ink-muted">
                  Informe sua escola, curso técnico ou faculdade em andamento na seção 05.
                </span>
              </div>
              <div className="border border-paper bg-ivory p-2.5">
                <strong className="text-ink block font-mono text-[10px] uppercase">
                  2. Cursos livres
                </strong>
                <span className="text-ink-muted">
                  Adicione oficinas, cursos online e certificações na seção 06.
                </span>
              </div>
              <div className="border border-paper bg-ivory p-2.5">
                <strong className="text-ink block font-mono text-[10px] uppercase">
                  3. Projetos práticos
                </strong>
                <span className="text-ink-muted">
                  Mencione trabalhos acadêmicos, TCC ou projetos pessoais na seção 09.
                </span>
              </div>
              <div className="border border-paper bg-ivory p-2.5">
                <strong className="text-ink block font-mono text-[10px] uppercase">
                  4. Trabalho voluntário
                </strong>
                <span className="text-ink-muted">
                  Atuação em ONGs, ações comunitárias ou grêmios estudantis demonstram proatividade.
                </span>
              </div>
              <div className="border border-paper bg-ivory p-2.5">
                <strong className="text-ink block font-mono text-[10px] uppercase">
                  5. Habilidades técnicas
                </strong>
                <span className="text-ink-muted">
                  Liste softwares, ferramentas e competências que você domina na seção 07.
                </span>
              </div>
              <div className="border border-paper bg-ivory p-2.5">
                <strong className="text-ink block font-mono text-[10px] uppercase">
                  6. Extracurriculares
                </strong>
                <span className="text-ink-muted">
                  Monitorias, empresas juniores, olimpíadas científicas e eventos estudantis.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigateToSection('formacao')}
                className="text-xs font-mono uppercase tracking-wider text-vermilion underline underline-offset-4 hover:text-ink"
              >
                Ir para 05 — Formação acadêmica →
              </button>
              <span className="text-paper">|</span>
              <button
                type="button"
                onClick={() => onNavigateToSection('cursos')}
                className="text-xs font-mono uppercase tracking-wider text-vermilion underline underline-offset-4 hover:text-ink"
              >
                Ir para 06 — Cursos e certificações →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Experiências Profissionais */}
      {experiences.length > 0 && (
        <div className="space-y-5">
          {experiences.map((exp, idx) => (
            <div
              key={exp.id}
              className="border border-ink bg-ivory p-4 sm:p-5 space-y-4"
            >
              {/* Barra Superior do Item: Numeração, Reordenação e Exclusão */}
              <div className="flex items-center justify-between border-b border-paper pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-vermilion">
                    EXP · 0{idx + 1}
                  </span>
                  <span className="text-xs font-medium text-ink truncate max-w-[220px] sm:max-w-xs">
                    {exp.role || exp.company || 'Nova experiência profissional'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMoveExperience(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 border border-paper bg-ivory text-ink hover:border-ink disabled:opacity-35 disabled:pointer-events-none"
                    title="Mover experiência para cima"
                    aria-label={`Mover experiência ${idx + 1} para cima`}
                  >
                    <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveExperience(idx, 'down')}
                    disabled={idx === experiences.length - 1}
                    className="p-1.5 border border-paper bg-ivory text-ink hover:border-ink disabled:opacity-35 disabled:pointer-events-none"
                    title="Mover experiência para baixo"
                    aria-label={`Mover experiência ${idx + 1} para baixo`}
                  >
                    <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(exp.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-paper bg-ivory text-vermilion hover:border-vermilion text-xs font-mono uppercase tracking-wider ml-1"
                    aria-label={`Excluir experiência ${idx + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Excluir</span>
                  </button>
                </div>
              </div>

              {/* Campos da Experiência */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={`exp-company-${exp.id}`}
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                  >
                    Nome da empresa
                  </label>
                  <input
                    id={`exp-company-${exp.id}`}
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      handleUpdateExperience(exp.id, { company: e.target.value })
                    }
                    placeholder="Ex.: Editora Horizonte Ltda."
                    className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`exp-role-${exp.id}`}
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                  >
                    Cargo
                  </label>
                  <input
                    id={`exp-role-${exp.id}`}
                    type="text"
                    value={exp.role}
                    onChange={(e) =>
                      handleUpdateExperience(exp.id, { role: e.target.value })
                    }
                    placeholder="Ex.: Assistente Administrativo"
                    className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`exp-location-${exp.id}`}
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                  >
                    Cidade <span className="text-ink-subtle font-normal">(opcional)</span>
                  </label>
                  <input
                    id={`exp-location-${exp.id}`}
                    type="text"
                    value={exp.location}
                    onChange={(e) =>
                      handleUpdateExperience(exp.id, { location: e.target.value })
                    }
                    placeholder="Ex.: São Paulo, SP · ou · Remoto"
                    className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
                  />
                </div>

                <div className="flex items-end pb-1">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono uppercase tracking-wider text-ink select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(exp.isCurrent)}
                      onChange={(e) =>
                        handleUpdateExperience(exp.id, {
                          isCurrent: e.target.checked,
                          endDate: e.target.checked ? '' : exp.endDate,
                        })
                      }
                      className="h-4 w-4 accent-vermilion"
                    />
                    <span>Emprego atual</span>
                  </label>
                </div>

                <div>
                  <label
                    htmlFor={`exp-start-${exp.id}`}
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                  >
                    Data de início
                  </label>
                  <input
                    id={`exp-start-${exp.id}`}
                    type="text"
                    value={exp.startDate ?? ''}
                    onChange={(e) =>
                      handleUpdateExperience(exp.id, { startDate: e.target.value })
                    }
                    placeholder="Ex.: Mar 2023 · ou · 03/2023"
                    className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`exp-end-${exp.id}`}
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                  >
                    Data de término
                  </label>
                  <input
                    id={`exp-end-${exp.id}`}
                    type="text"
                    value={exp.isCurrent ? 'Atual' : exp.endDate ?? ''}
                    disabled={Boolean(exp.isCurrent)}
                    onChange={(e) =>
                      handleUpdateExperience(exp.id, { endDate: e.target.value })
                    }
                    placeholder="Ex.: Nov 2025"
                    className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none disabled:bg-ivory-warm disabled:text-ink-muted"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`exp-desc-${exp.id}`}
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                  >
                    Descrição das atividades realizadas
                  </label>
                  <textarea
                    id={`exp-desc-${exp.id}`}
                    rows={4}
                    value={exp.description ?? (exp.highlights ? exp.highlights.join('\n') : '')}
                    onChange={(e) =>
                      handleUpdateExperience(exp.id, {
                        description: e.target.value,
                        highlights: undefined,
                      })
                    }
                    placeholder="Descreva suas responsabilidades e conquistas (uma atividade por linha para gerar tópicos organizados na folha A4)..."
                    className="w-full border border-ink bg-sheet p-3 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none leading-relaxed"
                  />
                  <p className="mt-1 text-xs text-ink-muted">
                    Dica: use quebras de linha (`Enter`) para separar cada realização em um tópico na folha A4.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão para Adicionar Experiência */}
      <button
        type="button"
        onClick={handleAddExperience}
        className="w-full btn-editorial-secondary py-3.5 border-dashed"
      >
        <Plus className="w-4 h-4 text-vermilion" aria-hidden="true" />
        <span>Adicionar experiência profissional</span>
      </button>
    </div>
  );
};
