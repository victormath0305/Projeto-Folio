import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import {
  LanguageItem,
  LanguageProficiency,
} from '../../../types/resume';
import { LANGUAGE_PROFICIENCY_OPTIONS } from '../editorConfig';

interface SkillsLanguagesAdditionalFormProps {
  mode: 'habilidades' | 'idiomas' | 'adicionais';
  skills: string[];
  languages: LanguageItem[];
  additionalNotes: string;
  onChangeSkills: (skills: string[]) => void;
  onChangeLanguages: (languages: LanguageItem[]) => void;
  onChangeAdditionalNotes: (notes: string) => void;
}

export const SkillsLanguagesAdditionalForm: React.FC<SkillsLanguagesAdditionalFormProps> = ({
  mode,
  skills,
  languages,
  additionalNotes,
  onChangeSkills,
  onChangeLanguages,
  onChangeAdditionalNotes,
}) => {
  const [skillInput, setSkillInput] = useState('');

  /* ============================================================================
   * MODO 07: HABILIDADES
   * ============================================================================ */
  if (mode === 'habilidades') {
    const handleAddSkill = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const cleaned = skillInput.trim();
      if (!cleaned) return;
      if (!skills.some((s) => s.toLowerCase() === cleaned.toLowerCase())) {
        onChangeSkills([...skills, cleaned]);
      }
      setSkillInput('');
    };

    const handleRemoveSkill = (skillToRemove: string) => {
      onChangeSkills(skills.filter((s) => s !== skillToRemove));
    };

    return (
      <div className="space-y-6">
        <form onSubmit={handleAddSkill} className="space-y-2">
          <label
            htmlFor="field-new-skill"
            className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold"
          >
            Adicionar habilidade individual
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              id="field-new-skill"
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Ex.: Excel Avançado · Pacote Office · React · Atendimento ao Cliente"
              className="flex-1 border border-ink bg-sheet px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
            />
            <button
              type="submit"
              className="btn-editorial-primary py-2.5 px-5 text-xs sm:text-sm shrink-0"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Adicionar habilidade</span>
            </button>
          </div>
          <p className="text-xs text-ink-muted">
            Digite o nome de uma competência ou ferramenta e clique em “Adicionar habilidade” (ou pressione Enter).
          </p>
        </form>

        {/* Lista de Habilidades Adicionadas */}
        <div className="border-t border-paper pt-5">
          <div className="font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-3">
            Habilidades no documento ({skills.length})
          </div>

          {skills.length === 0 ? (
            <div className="border border-dashed border-paper bg-ivory-warm/40 p-5 text-center text-xs text-ink-muted">
              Nenhuma habilidade adicionada ainda. Adicione suas competências técnicas e interpessoais acima.
            </div>
          ) : (
            <ul
              className="flex flex-wrap gap-2"
              aria-label="Lista de habilidades adicionadas"
            >
              {skills.map((skill) => (
                <li
                  key={skill}
                  className="inline-flex items-center gap-2 border border-ink bg-ivory-warm px-3 py-1.5 text-xs font-medium text-ink"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-ink-muted hover:text-vermilion transition-colors p-0.5"
                    aria-label={`Remover habilidade ${skill}`}
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  /* ============================================================================
   * MODO 08: IDIOMAS
   * ============================================================================ */
  if (mode === 'idiomas') {
    const handleAddLanguage = () => {
      const newLang: LanguageItem = {
        id: `lang-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        language: '',
        proficiency: 'Intermediário',
      };
      onChangeLanguages([...languages, newLang]);
    };

    const handleUpdateLanguage = (id: string, updates: Partial<LanguageItem>) => {
      onChangeLanguages(
        languages.map((l) => (l.id === id ? { ...l, ...updates } : l))
      );
    };

    const handleRemoveLanguage = (id: string) => {
      onChangeLanguages(languages.filter((l) => l.id !== id));
    };

    return (
      <div className="space-y-6">
        {languages.length === 0 ? (
          <div className="border border-dashed border-paper bg-ivory-warm/40 p-6 text-center space-y-2">
            <p className="font-serif text-xl text-ink">
              Nenhum idioma registrado.
            </p>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              Adicione idiomas que você conhece e selecione o nível correspondente (Básico, Intermediário, Avançado, Fluente ou Nativo).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {languages.map((lang, idx) => (
              <div
                key={lang.id}
                className="border border-ink bg-ivory p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
              >
                <div className="sm:col-span-6">
                  <label
                    htmlFor={`lang-name-${lang.id}`}
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                  >
                    0{idx + 1}. Idioma
                  </label>
                  <input
                    id={`lang-name-${lang.id}`}
                    type="text"
                    value={lang.language}
                    onChange={(e) =>
                      handleUpdateLanguage(lang.id, { language: e.target.value })
                    }
                    placeholder="Ex.: Inglês · Espanhol · Libras · Português"
                    className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label
                    htmlFor={`lang-level-${lang.id}`}
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                  >
                    Nível de proficiência
                  </label>
                  <select
                    id={`lang-level-${lang.id}`}
                    value={lang.proficiency}
                    onChange={(e) =>
                      handleUpdateLanguage(lang.id, {
                        proficiency: e.target.value as LanguageProficiency,
                      })
                    }
                    className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink focus:border-vermilion focus:outline-none"
                  >
                    {LANGUAGE_PROFICIENCY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveLanguage(lang.id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-2 border border-paper bg-ivory text-vermilion hover:border-vermilion text-xs font-mono uppercase tracking-wider"
                    aria-label={`Excluir idioma ${idx + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="sm:hidden">Excluir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddLanguage}
          className="w-full btn-editorial-secondary py-3.5 border-dashed"
        >
          <Plus className="w-4 h-4 text-vermilion" aria-hidden="true" />
          <span>Adicionar idioma</span>
        </button>
      </div>
    );
  }

  /* ============================================================================
   * MODO 09: INFORMAÇÕES ADICIONAIS
   * ============================================================================ */
  return (
    <div className="space-y-6">
      <div className="border-l-2 border-vermilion bg-ivory-warm/70 p-4 space-y-1.5">
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold">
          SUGESTÕES PARA INFORMAÇÕES COMPLEMENTARES
        </div>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          Utilize este espaço opcional para incluir: <strong>projetos acadêmicos ou pessoais</strong>, <strong>trabalho voluntário</strong>, <strong>atividades extracurriculares</strong> (monitoria, empresa júnior, iniciação científica), premiações, habilitação (CNH) ou disponibilidade para viagens e mudança.
        </p>
      </div>

      <div>
        <label
          htmlFor="field-additional-notes"
          className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1.5"
        >
          Informações adicionais <span className="text-ink-subtle font-normal">(opcional)</span>
        </label>
        <textarea
          id="field-additional-notes"
          rows={5}
          value={additionalNotes}
          onChange={(e) => onChangeAdditionalNotes(e.target.value)}
          placeholder="Ex.: Voluntário no projeto comunitário Leitura Viva (2024–2025). Participante da Empresa Júnior de Engenharia. Disponibilidade para início imediato."
          className="w-full border border-ink bg-sheet p-3.5 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none leading-relaxed"
        />
      </div>
    </div>
  );
};
