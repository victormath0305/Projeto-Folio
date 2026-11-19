import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  CourseItem,
  EducationItem,
  EducationLevel,
} from '../../../types/resume';
import { EDUCATION_LEVEL_OPTIONS } from '../editorConfig';

interface EducationCoursesSectionFormProps {
  mode: 'formacao' | 'cursos';
  education: EducationItem[];
  courses: CourseItem[];
  onChangeEducation: (items: EducationItem[]) => void;
  onChangeCourses: (items: CourseItem[]) => void;
}

export const EducationCoursesSectionForm: React.FC<EducationCoursesSectionFormProps> = ({
  mode,
  education,
  courses,
  onChangeEducation,
  onChangeCourses,
}) => {
  /* ============================================================================
   * MODO 05: FORMAÇÃO ACADÊMICA
   * ============================================================================ */
  if (mode === 'formacao') {
    const handleAddEducation = () => {
      const newEdu: EducationItem = {
        id: `edu-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        institution: '',
        degree: '',
        educationLevel: 'Bacharelado',
        startDate: '',
        endDate: '',
        isCurrent: false,
      };
      onChangeEducation([...education, newEdu]);
    };

    const handleUpdateEducation = (id: string, updates: Partial<EducationItem>) => {
      onChangeEducation(
        education.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu))
      );
    };

    const handleRemoveEducation = (id: string) => {
      onChangeEducation(education.filter((edu) => edu.id !== id));
    };

    return (
      <div className="space-y-6">
        {education.length === 0 ? (
          <div className="border border-dashed border-paper bg-ivory-warm/40 p-6 text-center space-y-2">
            <p className="font-serif text-xl text-ink">
              Nenhuma formação acadêmica adicionada ainda.
            </p>
            <p className="text-xs text-ink-muted max-w-md mx-auto">
              Inclua seu ensino médio, curso técnico, graduação ou pós-graduação clicando no botão abaixo.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {education.map((edu, idx) => (
              <div
                key={edu.id}
                className="border border-ink bg-ivory p-4 sm:p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-paper pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-vermilion">
                      ACAD · 0{idx + 1}
                    </span>
                    <span className="text-xs font-medium text-ink truncate max-w-xs">
                      {edu.degree || edu.institution || 'Nova formação acadêmica'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(edu.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-paper bg-ivory text-vermilion hover:border-vermilion text-xs font-mono uppercase tracking-wider"
                    aria-label={`Excluir formação ${idx + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Excluir</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`edu-inst-${edu.id}`}
                      className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                    >
                      Instituição de ensino
                    </label>
                    <input
                      id={`edu-inst-${edu.id}`}
                      type="text"
                      value={edu.institution}
                      onChange={(e) =>
                        handleUpdateEducation(edu.id, { institution: e.target.value })
                      }
                      placeholder="Ex.: Universidade de São Paulo (USP) · ou · ETEC"
                      className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`edu-degree-${edu.id}`}
                      className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                    >
                      Curso
                    </label>
                    <input
                      id={`edu-degree-${edu.id}`}
                      type="text"
                      value={edu.degree}
                      onChange={(e) =>
                        handleUpdateEducation(edu.id, { degree: e.target.value })
                      }
                      placeholder="Ex.: Ciência da Computação · ou · Ensino Médio"
                      className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`edu-level-${edu.id}`}
                      className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                    >
                      Grau de formação
                    </label>
                    <select
                      id={`edu-level-${edu.id}`}
                      value={edu.educationLevel ?? ''}
                      onChange={(e) =>
                        handleUpdateEducation(edu.id, {
                          educationLevel: e.target.value as EducationLevel,
                        })
                      }
                      className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink focus:border-vermilion focus:outline-none"
                    >
                      <option value="">Selecione o grau (opcional)</option>
                      {EDUCATION_LEVEL_OPTIONS.map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {lvl}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor={`edu-start-${edu.id}`}
                      className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                    >
                      Data de início
                    </label>
                    <input
                      id={`edu-start-${edu.id}`}
                      type="text"
                      value={edu.startDate ?? ''}
                      onChange={(e) =>
                        handleUpdateEducation(edu.id, {
                          startDate: e.target.value,
                          period: undefined,
                        })
                      }
                      placeholder="Ex.: 2022"
                      className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`edu-end-${edu.id}`}
                      className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                    >
                      Data de conclusão
                    </label>
                    <input
                      id={`edu-end-${edu.id}`}
                      type="text"
                      value={edu.isCurrent ? 'Em andamento' : edu.endDate ?? ''}
                      disabled={Boolean(edu.isCurrent)}
                      onChange={(e) =>
                        handleUpdateEducation(edu.id, {
                          endDate: e.target.value,
                          period: undefined,
                        })
                      }
                      placeholder="Ex.: 2026"
                      className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none disabled:bg-ivory-warm disabled:text-ink-muted"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-1">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono uppercase tracking-wider text-ink select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(edu.isCurrent)}
                        onChange={(e) =>
                          handleUpdateEducation(edu.id, {
                            isCurrent: e.target.checked,
                            endDate: e.target.checked ? '' : edu.endDate,
                            period: undefined,
                          })
                        }
                        className="h-4 w-4 accent-vermilion"
                      />
                      <span>Curso em andamento</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddEducation}
          className="w-full btn-editorial-secondary py-3.5 border-dashed"
        >
          <Plus className="w-4 h-4 text-vermilion" aria-hidden="true" />
          <span>Adicionar formação acadêmica</span>
        </button>
      </div>
    );
  }

  /* ============================================================================
   * MODO 06: CURSOS E CERTIFICAÇÕES
   * ============================================================================ */
  const handleAddCourse = () => {
    const newCourse: CourseItem = {
      id: `course-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: '',
      institution: '',
      completionYear: '',
      workload: '',
    };
    onChangeCourses([...courses, newCourse]);
  };

  const handleUpdateCourse = (id: string, updates: Partial<CourseItem>) => {
    onChangeCourses(
      courses.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleRemoveCourse = (id: string) => {
    onChangeCourses(courses.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {courses.length === 0 ? (
        <div className="border border-dashed border-paper bg-ivory-warm/40 p-6 text-center space-y-2">
          <p className="font-serif text-xl text-ink">
            Nenhum curso ou certificação adicionado.
          </p>
          <p className="text-xs text-ink-muted max-w-md mx-auto">
            Adicione cursos livres, certificações técnicas, workshops ou formações complementares relevantes.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course, idx) => (
            <div
              key={course.id}
              className="border border-ink bg-ivory p-4 sm:p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-paper pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-vermilion">
                    CURSO · 0{idx + 1}
                  </span>
                  <span className="text-xs font-medium text-ink truncate max-w-xs">
                    {course.name || 'Novo curso ou certificação'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveCourse(course.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-paper bg-ivory text-vermilion hover:border-vermilion text-xs font-mono uppercase tracking-wider"
                  aria-label={`Excluir curso ${idx + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Excluir</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={`course-name-${course.id}`}
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                  >
                    Nome do curso
                  </label>
                  <input
                    id={`course-name-${course.id}`}
                    type="text"
                    value={course.name}
                    onChange={(e) =>
                      handleUpdateCourse(course.id, { name: e.target.value })
                    }
                    placeholder="Ex.: Excel Aplicado à Gestão Financeira"
                    className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`course-inst-${course.id}`}
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                  >
                    Instituição
                  </label>
                  <input
                    id={`course-inst-${course.id}`}
                    type="text"
                    value={course.institution}
                    onChange={(e) =>
                      handleUpdateCourse(course.id, { institution: e.target.value })
                    }
                    placeholder="Ex.: Fundação Bradesco · SENAI · Alura"
                    className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`course-year-${course.id}`}
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                  >
                    Ano de conclusão
                  </label>
                  <input
                    id={`course-year-${course.id}`}
                    type="text"
                    value={course.completionYear}
                    onChange={(e) =>
                      handleUpdateCourse(course.id, { completionYear: e.target.value })
                    }
                    placeholder="Ex.: 2025"
                    className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`course-workload-${course.id}`}
                    className="block font-mono text-[11px] uppercase tracking-wider text-ink font-semibold mb-1"
                  >
                    Carga horária <span className="text-ink-subtle font-normal">(opcional)</span>
                  </label>
                  <input
                    id={`course-workload-${course.id}`}
                    type="text"
                    value={course.workload ?? ''}
                    onChange={(e) =>
                      handleUpdateCourse(course.id, { workload: e.target.value })
                    }
                    placeholder="Ex.: 40h"
                    className="w-full border border-ink bg-sheet px-3 py-2 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleAddCourse}
        className="w-full btn-editorial-secondary py-3.5 border-dashed"
      >
        <Plus className="w-4 h-4 text-vermilion" aria-hidden="true" />
        <span>Adicionar curso ou certificação</span>
      </button>
    </div>
  );
};
