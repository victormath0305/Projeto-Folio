import React from 'react';
import {
  formatEducationDegreeTitle,
  formatEducationPeriodText,
  formatExperienceBullets,
  formatExperiencePeriodText,
  PaginatedResumePage,
  paginateResumeDocument,
} from '../../services/paginationEngine';
import { isResumeDocumentEmpty } from '../../services/storageService';
import {
  ResumeDocument,
  ResumeTemplateId,
} from '../../types/resume';

interface A4DocumentRendererProps {
  document: ResumeDocument;
  templateId?: ResumeTemplateId;
  /** Quando fornecido, renderiza especificamente esta página paginada (ex.: Pág. 2 de 2) */
  paginatedPage?: PaginatedResumePage;
  showEditorialGrid?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * Renderizador de Folha A4 (Proporção ISO 216 — 210 × 297 mm)
 * Suporta os 5 modelos estruturalmente distintos do FOLIO:
 * M·01 Essencial | M·02 Editorial | M·03 Clássico | M·04 Executivo | M·05 Técnico
 */
export const A4DocumentRenderer: React.FC<A4DocumentRendererProps> = React.memo(({
  document,
  templateId,
  paginatedPage,
  showEditorialGrid = false,
  compact = false,
  className = '',
}) => {
  const activeTemplate =
    paginatedPage?.templateId ?? templateId ?? document.metadata.templateId;
  const isEmpty = isResumeDocumentEmpty(document);

  const pageData =
    paginatedPage ?? paginateResumeDocument(document, activeTemplate)[0];

  const pageSuffix =
    pageData.totalPages > 1
      ? ` — Página ${pageData.pageNumber} de ${pageData.totalPages}`
      : '';

  return (
    <div
      className={`relative bg-sheet text-ink a4-aspect w-full overflow-hidden border border-paper shadow-sheet transition-shadow duration-300 ${className}`}
      aria-label={`Folha de currículo A4 — Modelo ${activeTemplate.toUpperCase()}${
        document.personal.fullName
          ? ` de ${document.personal.fullName}${pageSuffix}`
          : ' (Folha em branco)'
      }`}
    >
      {/* Camada de Raio-X Editorial / Grade Suíça quando ativada */}
      {showEditorialGrid && (
        <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
          <div className="absolute inset-4 sm:inset-5 border border-dashed border-vermilion/60" />
          <div className="grid h-full w-full grid-cols-12 gap-1.5 px-4 sm:px-5 opacity-25">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="h-full bg-vermilion/15 border-x border-vermilion/30" />
            ))}
          </div>
          <div className="absolute top-1.5 left-4 sm:left-5 bg-vermilion text-sheet px-1.5 py-0.5 font-mono text-[7.5px] tracking-widest uppercase">
            MARGEM SUP. 18MM · GRADE 12 COL
          </div>
          <div className="absolute bottom-1.5 right-4 sm:right-5 bg-ink text-ivory px-1.5 py-0.5 font-mono text-[7.5px] tracking-widest uppercase">
            ISO 216 · 210 × 297 MM
          </div>
        </div>
      )}

      {/* Marcas discretas de corte de gráfica nos cantos da folha */}
      <div className="pointer-events-none absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-paper/80" aria-hidden="true" />
      <div className="pointer-events-none absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-paper/80" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-paper/80" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-paper/80" aria-hidden="true" />

      {isEmpty ? (
        <BlankA4SheetState activeTemplate={activeTemplate} />
      ) : (
        <>
          {activeTemplate === 'essencial' && (
            <EssencialMatrix page={pageData} compact={compact} />
          )}
          {activeTemplate === 'editorial' && (
            <EditorialMatrix page={pageData} compact={compact} />
          )}
          {activeTemplate === 'classico' && (
            <ClassicoMatrix page={pageData} compact={compact} />
          )}
          {activeTemplate === 'executivo' && (
            <ExecutivoMatrix page={pageData} compact={compact} />
          )}
          {activeTemplate === 'tecnico' && (
            <TecnicoMatrix page={pageData} compact={compact} />
          )}
        </>
      )}
    </div>
  );
});

/* ============================================================================
 * ESTADO DE FOLHA A4 EM BRANCO (Quando o usuário ainda não preencheu campos)
 * ============================================================================ */
const BlankA4SheetState: React.FC<{ activeTemplate: ResumeTemplateId }> = ({
  activeTemplate,
}) => {
  return (
    <div className="h-full w-full p-6 sm:p-8 flex flex-col justify-between text-ink-muted">
      <div className="border-b border-dashed border-paper pb-3 flex items-center justify-between font-mono text-[8px] uppercase tracking-widest">
        <span>LAUDA A4 AGUARDANDO COMPOSIÇÃO</span>
        <span className="text-vermilion">MATRIZ: {activeTemplate.toUpperCase()}</span>
      </div>

      <div className="my-auto max-w-xs mx-auto text-center space-y-2 border border-dashed border-paper p-5 bg-ivory/30">
        <div className="font-mono text-[9px] uppercase tracking-widest text-vermilion">
          PRÉ-VISUALIZAÇÃO EM TEMPO REAL
        </div>
        <p className="font-serif text-xl text-ink">
          Sua folha A4 está pronta.
        </p>
        <p className="text-[10px] text-ink-muted leading-relaxed">
          Preencha os campos no painel ao lado para diagramar seu currículo instantaneamente, ou ative a opção de exemplo para inspecionar a matriz preenchida.
        </p>
      </div>

      <div className="border-t border-dashed border-paper pt-2 flex items-center justify-between font-mono text-[7px] text-ink-subtle uppercase tracking-wider">
        <span>FOLIO · ZERO DADOS FICTÍCIOS MISTURADOS</span>
        <span>210 × 297 MM</span>
      </div>
    </div>
  );
};

/* ============================================================================
 * MATRIZ 01: ESSENCIAL (Série Suíça — Minimalista, direto e linear)
 * ============================================================================ */
const EssencialMatrix: React.FC<{ page: PaginatedResumePage; compact: boolean }> = ({
  page,
  compact,
}) => {
  const {
    personal,
    isFirstPage,
    showObjective,
    showSummary,
    experiences,
    education,
    courses,
    skills,
    skillGroups,
    languages,
    additionalNotes,
    pageNumber,
    totalPages,
  } = page;

  const contactItems = [
    personal.location,
    personal.address,
    personal.email,
    personal.phone,
    personal.linkedin,
    personal.portfolio,
    personal.portfolioOrLinkedin,
  ].filter((item): item is string => Boolean(item && item.trim()));

  return (
    <div className={`h-full w-full flex flex-col justify-between font-sans ${compact ? 'p-3.5 sm:p-4 text-[7.8px]' : 'p-4 sm:p-6 text-[8.8px]'} leading-snug`}>
      <div className="space-y-2.5 overflow-hidden">
        {isFirstPage ? (
          <div className="border-b-2 border-ink pb-2 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <div className={`${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'} font-bold tracking-tight text-ink uppercase truncate`}>
                  {personal.fullName || 'Nome do Candidato'}
                </div>
                <span className="font-mono text-[6.5px] uppercase tracking-wider text-ink-muted shrink-0">
                  REF · A4-ESS
                </span>
              </div>
              {personal.roleTitle && (
                <p className="font-medium text-ink-muted text-[8.5px] sm:text-[9.5px] mt-0.5">
                  {personal.roleTitle}
                </p>
              )}
              {contactItems.length > 0 && (
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[7px] text-ink-subtle">
                  {contactItems.map((item, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span>·</span>}
                      <span>{item}</span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {personal.photoUrl && (
              <img
                src={personal.photoUrl}
                alt={`Foto de ${personal.fullName || 'candidato'}`}
                className="w-11 h-14 object-cover border border-ink shrink-0"
              />
            )}
          </div>
        ) : (
          <div className="border-b border-paper pb-1.5 flex items-center justify-between font-mono text-[7px] uppercase tracking-wider text-ink-muted">
            <span>{personal.fullName} — CONTINUAÇÃO</span>
            <span>FOLHA {String(pageNumber).padStart(2, '0')}</span>
          </div>
        )}

        {showObjective && personal.objective && personal.objective.trim() && (
          <div className="grid grid-cols-12 gap-2 border-b border-paper/70 pb-2">
            <div className="col-span-3 font-mono text-[7px] uppercase tracking-wider text-ink-muted pt-0.5">
              Objetivo
            </div>
            <div className="col-span-9 text-ink/90 leading-relaxed">
              {personal.objective}
            </div>
          </div>
        )}

        {showSummary && personal.summary && personal.summary.trim() && (
          <div className="grid grid-cols-12 gap-2 border-b border-paper/70 pb-2">
            <div className="col-span-3 font-mono text-[7px] uppercase tracking-wider text-ink-muted pt-0.5">
              01 / Perfil
            </div>
            <div className="col-span-9 text-ink/90 leading-relaxed">
              {personal.summary}
            </div>
          </div>
        )}

        {experiences.length > 0 && (
          <div className="grid grid-cols-12 gap-2 border-b border-paper/70 pb-2">
            <div className="col-span-3 font-mono text-[7px] uppercase tracking-wider text-ink-muted pt-0.5">
              02 / Trajetória
            </div>
            <div className="col-span-9 space-y-2">
              {experiences.map((exp) => {
                const lines = formatExperienceBullets(exp);
                const period = formatExperiencePeriodText(exp);
                return (
                  <div key={exp.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-ink">{exp.role || exp.company}</span>
                      {period && (
                        <span className="font-mono text-[7px] text-ink-muted shrink-0">{period}</span>
                      )}
                    </div>
                    {(exp.company || exp.location) && (
                      <div className="text-[7.5px] font-medium text-ink-muted mb-0.5">
                        {[exp.company, exp.location].filter(Boolean).join(' · ')}
                      </div>
                    )}
                    {lines.length > 0 && (
                      <ul className="space-y-0.5 text-ink/85">
                        {lines.slice(0, compact ? 2 : 6).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-ink-muted">—</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="grid grid-cols-12 gap-2 border-b border-paper/70 pb-2">
            <div className="col-span-3 font-mono text-[7px] uppercase tracking-wider text-ink-muted pt-0.5">
              03 / Formação
            </div>
            <div className="col-span-9 space-y-1.5">
              {education.map((edu) => {
                const period = formatEducationPeriodText(edu);
                return (
                  <div key={edu.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-ink">{formatEducationDegreeTitle(edu)}</span>
                      {period && (
                        <span className="font-mono text-[7px] text-ink-muted shrink-0">{period}</span>
                      )}
                    </div>
                    <div className="text-[7.5px] text-ink-muted">{edu.institution}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {courses.length > 0 && (
          <div className="grid grid-cols-12 gap-2 border-b border-paper/70 pb-2">
            <div className="col-span-3 font-mono text-[7px] uppercase tracking-wider text-ink-muted pt-0.5">
              Cursos
            </div>
            <div className="col-span-9 space-y-1">
              {courses.map((course) => (
                <div key={course.id} className="flex items-baseline justify-between gap-2 text-[7.5px]">
                  <div>
                    <span className="font-semibold text-ink">{course.name}</span>
                    {course.institution && (
                      <span className="text-ink-muted"> · {course.institution}</span>
                    )}
                    {course.workload && (
                      <span className="text-ink-subtle"> ({course.workload})</span>
                    )}
                  </div>
                  {course.completionYear && (
                    <span className="font-mono text-[7px] text-ink-muted shrink-0">
                      {course.completionYear}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {(skills.length > 0 || skillGroups.length > 0 || languages.length > 0) && (
          <div className="grid grid-cols-12 gap-2 border-b border-paper/70 pb-2 last:border-b-0">
            <div className="col-span-3 font-mono text-[7px] uppercase tracking-wider text-ink-muted pt-0.5">
              04 / Domínio
            </div>
            <div className="col-span-9 space-y-1 text-[7.5px]">
              {skills.length > 0 && (
                <div>
                  <span className="font-semibold text-ink">Habilidades: </span>
                  <span className="text-ink/85">{skills.join(' · ')}</span>
                </div>
              )}
              {skillGroups.map((group) => (
                <div key={group.id}>
                  <span className="font-semibold text-ink">{group.category}: </span>
                  <span className="text-ink/80">{group.skills.join(' · ')}</span>
                </div>
              ))}
              {languages.length > 0 && (
                <div>
                  <span className="font-semibold text-ink">Idiomas: </span>
                  <span className="text-ink/85">
                    {languages.map((l) => `${l.language} (${l.proficiency})`).join(' · ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {additionalNotes && additionalNotes.trim() && (
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-3 font-mono text-[7px] uppercase tracking-wider text-ink-muted pt-0.5">
              Adicionais
            </div>
            <div className="col-span-9 text-[7.5px] text-ink/85 whitespace-pre-line">
              {additionalNotes}
            </div>
          </div>
        )}
      </div>

      <div className="pt-1.5 border-t border-paper/60 flex items-center justify-between font-mono text-[6.5px] text-ink-subtle uppercase tracking-wider">
        <span>FOLIO · MATRIZ ESSENCIAL (SUÍÇA)</span>
        <span>
          PÁG. {String(pageNumber).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

/* ============================================================================
 * MATRIZ 02: EDITORIAL (Série Lauda — Personalidade tipográfica e assimetria)
 * ============================================================================ */
const EditorialMatrix: React.FC<{ page: PaginatedResumePage; compact: boolean }> = ({
  page,
  compact,
}) => {
  const {
    personal,
    isFirstPage,
    showObjective,
    showSummary,
    experiences,
    education,
    courses,
    skills,
    skillGroups,
    languages,
    additionalNotes,
    pageNumber,
    totalPages,
  } = page;

  return (
    <div className={`h-full w-full flex flex-col justify-between font-sans ${compact ? 'p-3.5 sm:p-4 text-[7.8px]' : 'p-4 sm:p-6 text-[8.8px]'} leading-snug`}>
      <div className="overflow-hidden">
        {isFirstPage ? (
          <div className="border-b border-ink pb-2.5 mb-2.5 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className="inline-flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-widest text-vermilion font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-vermilion inline-block" />
                  DOSSIÊ PROFISSIONAL · N° 01
                </span>
                {personal.location && (
                  <span className="font-mono text-[7px] text-ink-subtle uppercase tracking-widest truncate">
                    {personal.location}
                  </span>
                )}
              </div>

              <div className={`font-serif ${compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} text-ink tracking-tight leading-none mt-0.5`}>
                {personal.fullName || 'Nome do Candidato'}
              </div>
              {personal.roleTitle && (
                <p className="font-editorial italic text-ink-muted text-[9px] sm:text-[10px] mt-0.5">
                  {personal.roleTitle}
                </p>
              )}
            </div>

            {personal.photoUrl && (
              <img
                src={personal.photoUrl}
                alt={`Foto de ${personal.fullName || 'candidato'}`}
                className="w-11 h-14 object-cover border border-ink shrink-0"
              />
            )}
          </div>
        ) : (
          <div className="border-b border-ink pb-1.5 mb-2.5 flex items-center justify-between font-mono text-[7px] uppercase tracking-widest text-ink-muted">
            <span className="text-vermilion">{personal.fullName} — CONTINUAÇÃO</span>
            <span>LAUDA {String(pageNumber).padStart(2, '0')}</span>
          </div>
        )}

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-8 pr-2 border-r border-paper/70 space-y-2.5">
            {showObjective && personal.objective && personal.objective.trim() && (
              <div>
                <div className="font-mono text-[6.5px] uppercase tracking-widest text-vermilion mb-0.5">
                  § Objetivo Profissional
                </div>
                <p className="text-[8px] sm:text-[8.5px] text-ink leading-relaxed">
                  {personal.objective}
                </p>
              </div>
            )}

            {showSummary && personal.summary && personal.summary.trim() && (
              <div>
                <div className="font-mono text-[6.5px] uppercase tracking-widest text-vermilion mb-0.5">
                  § Síntese Editorial
                </div>
                <p className="font-editorial text-[8px] sm:text-[8.8px] text-ink leading-relaxed">
                  “{personal.summary}”
                </p>
              </div>
            )}

            {((showObjective && personal.objective?.trim()) ||
              (showSummary && personal.summary.trim())) &&
              (experiences.length > 0 || courses.length > 0 || additionalNotes?.trim()) && (
                <hr className="border-paper/70" />
              )}

            {experiences.length > 0 && (
              <div>
                <div className="font-mono text-[6.5px] uppercase tracking-widest text-ink-muted mb-1.5">
                  § Experiência Profissional
                </div>
                <div className="space-y-2">
                  {experiences.map((exp) => {
                    const lines = formatExperienceBullets(exp);
                    const period = formatExperiencePeriodText(exp);
                    return (
                      <div key={exp.id}>
                        <div className="font-semibold text-ink text-[8.2px] sm:text-[9px]">
                          {exp.role || exp.company}
                        </div>
                        <div className="flex items-center justify-between font-mono text-[7px] text-vermilion mb-0.5">
                          <span>{[exp.company, exp.location].filter(Boolean).join(' · ')}</span>
                          <span className="text-ink-subtle">{period}</span>
                        </div>
                        {lines.length > 0 && (
                          <ul className="space-y-0.5 text-ink/85 text-[7.5px] sm:text-[8px]">
                            {lines.slice(0, compact ? 2 : 6).map((h, i) => (
                              <li key={i} className="leading-snug pl-2 border-l border-paper">
                                {h}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {courses.length > 0 && (
              <div>
                <div className="font-mono text-[6.5px] uppercase tracking-widest text-ink-muted mb-1">
                  § Cursos &amp; Certificações
                </div>
                <div className="space-y-1">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-baseline justify-between gap-2 text-[7.5px]">
                      <div>
                        <span className="font-semibold text-ink">{course.name}</span>
                        {course.institution && (
                          <span className="text-ink-muted"> — {course.institution}</span>
                        )}
                        {course.workload && (
                          <span className="text-ink-subtle"> ({course.workload})</span>
                        )}
                      </div>
                      {course.completionYear && (
                        <span className="font-mono text-[6.5px] text-ink-subtle shrink-0">
                          {course.completionYear}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {additionalNotes && additionalNotes.trim() && (
              <div>
                <div className="font-mono text-[6.5px] uppercase tracking-widest text-ink-muted mb-0.5">
                  § Informações Complementares
                </div>
                <p className="text-[7.5px] text-ink/85 leading-snug whitespace-pre-line">
                  {additionalNotes}
                </p>
              </div>
            )}
          </div>

          <aside className="col-span-4 space-y-2.5 text-[7.5px]">
            {isFirstPage && (
              <div>
                <div className="font-mono text-[6.5px] uppercase tracking-widest text-ink-muted mb-0.5">
                  Contato Direto
                </div>
                <div className="space-y-0.5 font-mono text-[6.5px] text-ink/85">
                  {personal.email && <div className="truncate">{personal.email}</div>}
                  {personal.phone && <div>{personal.phone}</div>}
                  {personal.address && <div className="truncate">{personal.address}</div>}
                  {personal.linkedin && <div className="text-vermilion truncate">{personal.linkedin}</div>}
                  {personal.portfolio && <div className="text-vermilion truncate">{personal.portfolio}</div>}
                  {personal.portfolioOrLinkedin && (
                    <div className="text-vermilion truncate">{personal.portfolioOrLinkedin}</div>
                  )}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <>
                {isFirstPage && <hr className="border-paper/70" />}
                <div>
                  <div className="font-mono text-[6.5px] uppercase tracking-widest text-ink-muted mb-0.5">
                    Formação Acadêmica
                  </div>
                  {education.map((edu) => (
                    <div key={edu.id} className="mb-1.5 last:mb-0">
                      <div className="font-semibold text-ink leading-tight">
                        {formatEducationDegreeTitle(edu)}
                      </div>
                      <div className="text-ink-muted text-[7px] mt-0.5">{edu.institution}</div>
                      <div className="font-mono text-[6.5px] text-ink-subtle">
                        {formatEducationPeriodText(edu)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {(skills.length > 0 || skillGroups.length > 0) && (
              <>
                <hr className="border-paper/70" />
                <div>
                  <div className="font-mono text-[6.5px] uppercase tracking-widest text-ink-muted mb-1">
                    Habilidades
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 mb-1">
                      {skills.map((s) => (
                        <span
                          key={s}
                          className="bg-ivory px-1 py-0.5 text-[6.5px] text-ink border border-paper/70"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="space-y-1">
                    {skillGroups.map((group) => (
                      <div key={group.id}>
                        <div className="font-medium text-ink text-[7px] mb-0.5">{group.category}</div>
                        <div className="flex flex-wrap gap-0.5">
                          {group.skills.map((s) => (
                            <span
                              key={s}
                              className="bg-ivory px-1 py-0.5 text-[6.5px] text-ink border border-paper/70"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {languages.length > 0 && (
              <div>
                <div className="font-mono text-[6.5px] uppercase tracking-widest text-ink-muted mb-0.5">
                  Idiomas
                </div>
                <div className="space-y-0.5 text-[7px]">
                  {languages.map((l) => (
                    <div key={l.id} className="flex justify-between gap-1">
                      <span className="font-medium text-ink">{l.language}</span>
                      <span className="text-ink-muted truncate">{l.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <div className="pt-1.5 border-t border-ink/80 flex items-center justify-between font-mono text-[6.5px] text-ink-subtle uppercase tracking-wider">
        <span>FOLIO · MATRIZ EDITORIAL (LAUDA)</span>
        <span className="text-vermilion">
          PÁG. {String(pageNumber).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

/* ============================================================================
 * MATRIZ 03: CLÁSSICO (Série Cátedra — Simetria formal e solidez institucional)
 * ============================================================================ */
const ClassicoMatrix: React.FC<{ page: PaginatedResumePage; compact: boolean }> = ({
  page,
  compact,
}) => {
  const {
    personal,
    isFirstPage,
    showObjective,
    showSummary,
    experiences,
    education,
    courses,
    skills,
    skillGroups,
    languages,
    additionalNotes,
    pageNumber,
    totalPages,
  } = page;

  const contactItems = [
    personal.location,
    personal.address,
    personal.phone,
    personal.email,
    personal.linkedin,
    personal.portfolio,
    personal.portfolioOrLinkedin,
  ].filter((item): item is string => Boolean(item && item.trim()));

  return (
    <div className={`h-full w-full flex flex-col justify-between font-sans ${compact ? 'p-3.5 sm:p-4 text-[7.8px]' : 'p-4 sm:p-6 text-[8.8px]'} leading-snug`}>
      <div className="overflow-hidden">
        {isFirstPage ? (
          <div className="text-center border-b border-ink pb-2 mb-2.5 flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className={`font-editorial ${compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'} font-semibold tracking-wide uppercase text-ink`}>
                {personal.fullName || 'Nome do Candidato'}
              </div>
              {personal.roleTitle && (
                <p className="font-editorial italic text-[9px] text-ink-muted mt-0.5">
                  {personal.roleTitle}
                </p>
              )}
              {contactItems.length > 0 && (
                <div className="mt-1 flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 text-[7px] text-ink-subtle font-mono">
                  {contactItems.map((item, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span>•</span>}
                      <span>{item}</span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {personal.photoUrl && (
              <img
                src={personal.photoUrl}
                alt={`Foto de ${personal.fullName || 'candidato'}`}
                className="w-11 h-14 object-cover border border-ink shrink-0"
              />
            )}
          </div>
        ) : (
          <div className="border-b border-paper pb-1.5 mb-2.5 flex items-center justify-between font-mono text-[7px] uppercase tracking-wider text-ink-muted">
            <span>{personal.fullName} — CONTINUAÇÃO</span>
            <span>FOLHA {String(pageNumber).padStart(2, '0')}</span>
          </div>
        )}

        {showObjective && personal.objective && personal.objective.trim() && (
          <div className="mb-2">
            <div className="font-editorial text-[8px] font-semibold uppercase tracking-widest text-ink border-b border-paper pb-0.5 mb-1 text-center">
              Objetivo Profissional
            </div>
            <p className="text-ink/90 text-justify leading-relaxed">
              {personal.objective}
            </p>
          </div>
        )}

        {showSummary && personal.summary && personal.summary.trim() && (
          <div className="mb-2">
            <div className="font-editorial text-[8px] font-semibold uppercase tracking-widest text-ink border-b border-paper pb-0.5 mb-1 text-center">
              Síntese de Qualificações
            </div>
            <p className="text-ink/90 text-justify leading-relaxed">
              {personal.summary}
            </p>
          </div>
        )}

        {experiences.length > 0 && (
          <div className="mb-2">
            <div className="font-editorial text-[8px] font-semibold uppercase tracking-widest text-ink border-b border-paper pb-0.5 mb-1 text-center">
              Experiência Profissional
            </div>
            <div className="space-y-1.5">
              {experiences.map((exp) => {
                const lines = formatExperienceBullets(exp);
                const period = formatExperiencePeriodText(exp);
                return (
                  <div key={exp.id}>
                    <div className="flex items-baseline justify-between font-semibold text-ink">
                      <span>{[exp.company, exp.location].filter(Boolean).join(' — ')}</span>
                      <span className="font-mono text-[7px] font-normal text-ink-muted">{period}</span>
                    </div>
                    {exp.role && (
                      <div className="font-editorial italic text-ink-muted text-[8px] mb-0.5">
                        {exp.role}
                      </div>
                    )}
                    {lines.length > 0 && (
                      <ul className="list-disc list-inside space-y-0.5 text-ink/85 text-[7.5px]">
                        {lines.slice(0, compact ? 2 : 6).map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="mb-2">
            <div className="font-editorial text-[8px] font-semibold uppercase tracking-widest text-ink border-b border-paper pb-0.5 mb-1 text-center">
              Formação Acadêmica
            </div>
            <div className="space-y-1">
              {education.map((edu) => (
                <div key={edu.id} className="flex items-baseline justify-between gap-2">
                  <div>
                    <span className="font-semibold text-ink">{formatEducationDegreeTitle(edu)}</span>
                    {edu.institution && <span className="text-ink-muted"> — {edu.institution}</span>}
                  </div>
                  <span className="font-mono text-[7px] text-ink-muted shrink-0">
                    {formatEducationPeriodText(edu)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {courses.length > 0 && (
          <div className="mb-2">
            <div className="font-editorial text-[8px] font-semibold uppercase tracking-widest text-ink border-b border-paper pb-0.5 mb-1 text-center">
              Cursos &amp; Certificações
            </div>
            <div className="space-y-0.5 text-[7.5px]">
              {courses.map((c) => (
                <div key={c.id} className="flex justify-between gap-2">
                  <span>
                    <strong className="text-ink">{c.name}</strong>
                    {c.institution ? ` — ${c.institution}` : ''}
                    {c.workload ? ` (${c.workload})` : ''}
                  </span>
                  <span className="font-mono text-[7px] text-ink-muted">{c.completionYear}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(skills.length > 0 || skillGroups.length > 0 || languages.length > 0 || additionalNotes?.trim()) && (
          <div>
            <div className="font-editorial text-[8px] font-semibold uppercase tracking-widest text-ink border-b border-paper pb-0.5 mb-1 text-center">
              Competências, Idiomas &amp; Informações
            </div>
            <div className="space-y-0.5 text-[7.5px]">
              {skills.length > 0 && (
                <div>
                  <span className="font-semibold text-ink">Habilidades: </span>
                  <span className="text-ink/85">{skills.join(', ')}.</span>
                </div>
              )}
              {skillGroups.map((group) => (
                <div key={group.id}>
                  <span className="font-semibold text-ink">{group.category}: </span>
                  <span className="text-ink/85">{group.skills.join(', ')}.</span>
                </div>
              ))}
              {languages.length > 0 && (
                <div>
                  <span className="font-semibold text-ink">Idiomas: </span>
                  <span className="text-ink/85">
                    {languages.map((l) => `${l.language} (${l.proficiency})`).join('; ')}.
                  </span>
                </div>
              )}
              {additionalNotes && additionalNotes.trim() && (
                <div>
                  <span className="font-semibold text-ink">Adicionais: </span>
                  <span className="text-ink/85">{additionalNotes}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="pt-1.5 border-t border-paper/60 flex items-center justify-between font-mono text-[6.5px] text-ink-subtle uppercase tracking-wider">
        <span>FOLIO · MATRIZ CLÁSSICA (CÁTEDRA)</span>
        <span>
          PÁG. {String(pageNumber).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

/* ============================================================================
 * MATRIZ 04: EXECUTIVO (Série Conselho — Liderança, Síntese e Resultados)
 * Diferença estrutural:
 * - Cabeçalho arquitetônico com barra superior espessa (border-t-[3px] border-ink)
 * - Quadro emoldurado de Síntese Executiva + Faixa de Competências de Governança no topo
 * - Experiências com datas em moldura retangular e ênfase em resultados
 * ============================================================================ */
const ExecutivoMatrix: React.FC<{ page: PaginatedResumePage; compact: boolean }> = ({
  page,
  compact,
}) => {
  const {
    personal,
    isFirstPage,
    showObjective,
    showSummary,
    experiences,
    education,
    courses,
    skills,
    skillGroups,
    languages,
    additionalNotes,
    pageNumber,
    totalPages,
  } = page;

  const allSkills = [
    ...skills,
    ...skillGroups.flatMap((g) => g.skills),
  ];

  const rightContacts = [
    personal.location,
    personal.email,
    personal.phone,
    personal.linkedin || personal.portfolio || personal.portfolioOrLinkedin,
  ].filter((item): item is string => Boolean(item && item.trim()));

  return (
    <div className={`h-full w-full flex flex-col justify-between font-sans ${compact ? 'p-3.5 sm:p-4 text-[7.8px]' : 'p-4 sm:p-6 text-[8.8px]'} leading-snug`}>
      <div className="space-y-2.5 overflow-hidden">
        {isFirstPage ? (
          <div className="border-t-[3px] border-b border-ink pt-2 pb-2.5 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="font-mono text-[6.5px] uppercase tracking-widest text-ink-muted mb-0.5">
                DOSSIÊ EXECUTIVO · SÉRIE CONSELHO (M·04)
              </div>
              <div className={`font-serif ${compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} text-ink tracking-tight leading-none`}>
                {personal.fullName || 'Nome do Executivo'}
              </div>
              {personal.roleTitle && (
                <div className="font-sans font-bold uppercase tracking-wider text-vermilion text-[7.8px] sm:text-[8.5px] mt-1">
                  {personal.roleTitle}
                </div>
              )}
            </div>

            {rightContacts.length > 0 && (
              <div className="text-right font-mono text-[6.8px] text-ink-muted space-y-0.5 shrink-0 max-w-[42%]">
                {rightContacts.map((c, idx) => (
                  <div key={idx} className="truncate">
                    {c}
                  </div>
                ))}
              </div>
            )}

            {personal.photoUrl && (
              <img
                src={personal.photoUrl}
                alt={`Foto de ${personal.fullName || 'candidato'}`}
                className="w-11 h-14 object-cover border border-ink shrink-0"
              />
            )}
          </div>
        ) : (
          <div className="border-t-2 border-b border-ink py-1.5 flex items-center justify-between font-mono text-[7px] uppercase tracking-widest text-ink-muted">
            <span className="font-semibold text-ink">{personal.fullName} — DOSSIÊ EXECUTIVO (CONTINUAÇÃO)</span>
            <span>PÁG. {String(pageNumber).padStart(2, '0')}</span>
          </div>
        )}

        {/* Quadro Emoldurado de Síntese Executiva & Competências de Governança */}
        {((showObjective && personal.objective?.trim()) ||
          (showSummary && personal.summary.trim()) ||
          allSkills.length > 0) && (
          <div className="border border-ink bg-ivory/55 p-2.5 space-y-1.5">
            {showObjective && personal.objective && personal.objective.trim() && (
              <div className="text-[7.8px] text-ink">
                <span className="font-mono text-[6.5px] uppercase tracking-widest text-vermilion font-semibold mr-1.5">
                  ESCOPO DE ATUAÇÃO:
                </span>
                <span className="font-medium">{personal.objective}</span>
              </div>
            )}

            {showSummary && personal.summary && personal.summary.trim() && (
              <div>
                <div className="font-mono text-[6.5px] uppercase tracking-widest text-ink-muted font-semibold mb-0.5">
                  SÍNTESE EXECUTIVA
                </div>
                <p className="text-ink/90 leading-relaxed text-[8px]">
                  {personal.summary}
                </p>
              </div>
            )}

            {allSkills.length > 0 && (
              <div className="pt-1 border-t border-paper/80">
                <div className="font-mono text-[6.3px] uppercase tracking-widest text-ink-subtle mb-1">
                  COMPETÊNCIAS DE LIDERANÇA &amp; GESTÃO
                </div>
                <div className="flex flex-wrap gap-1">
                  {allSkills.map((sk) => (
                    <span
                      key={sk}
                      className="border border-ink/70 bg-sheet px-1.5 py-0.5 font-mono text-[6.5px] uppercase tracking-wider text-ink font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Histórico de Liderança & Resultados */}
        {experiences.length > 0 && (
          <div>
            <div className="flex items-center justify-between border-b-2 border-ink pb-0.5 mb-2">
              <span className="font-mono text-[7.2px] font-bold uppercase tracking-widest text-ink">
                TRAJETÓRIA EXECUTIVA &amp; RESULTADOS
              </span>
              <span className="font-mono text-[6.5px] uppercase tracking-wider text-ink-subtle">
                HISTÓRICO CRONOLÓGICO
              </span>
            </div>

            <div className="space-y-2.5">
              {experiences.map((exp) => {
                const lines = formatExperienceBullets(exp);
                const period = formatExperiencePeriodText(exp);
                return (
                  <div key={exp.id}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold uppercase tracking-wide text-ink text-[8px] sm:text-[8.5px]">
                        {[exp.company, exp.location].filter(Boolean).join(' · ') || exp.role}
                      </span>
                      {period && (
                        <span className="border border-ink bg-ivory px-1.5 py-0.2 font-mono text-[6.5px] text-ink shrink-0">
                          {period}
                        </span>
                      )}
                    </div>
                    {exp.role && (
                      <div className="font-editorial italic text-vermilion font-medium text-[8.5px] mb-0.5">
                        {exp.role}
                      </div>
                    )}
                    {lines.length > 0 && (
                      <ul className="space-y-0.5 text-ink/90 text-[7.6px]">
                        {lines.slice(0, compact ? 2 : 6).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-vermilion text-[7px] mt-0.5">▪</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Grade Executiva Inferior: Formação Acadêmica, Certificações e Idiomas */}
        {(education.length > 0 || courses.length > 0 || languages.length > 0 || additionalNotes?.trim()) && (
          <div className="grid grid-cols-12 gap-3 pt-1 border-t border-ink">
            {education.length > 0 && (
              <div className={courses.length > 0 || languages.length > 0 ? 'col-span-7' : 'col-span-12'}>
                <div className="font-mono text-[6.8px] font-bold uppercase tracking-widest text-ink mb-1">
                  FORMAÇÃO ACADÊMICA &amp; PÓS-GRADUAÇÃO
                </div>
                <div className="space-y-1">
                  {education.map((edu) => (
                    <div key={edu.id} className="text-[7.5px]">
                      <div className="font-semibold text-ink">
                        {formatEducationDegreeTitle(edu)}
                      </div>
                      <div className="text-ink-muted flex justify-between gap-2 text-[7px]">
                        <span>{edu.institution}</span>
                        <span className="font-mono text-[6.5px] shrink-0">
                          {formatEducationPeriodText(edu)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(courses.length > 0 || languages.length > 0) && (
              <div className={education.length > 0 ? 'col-span-5 border-l border-paper pl-2.5 space-y-1.5' : 'col-span-12 space-y-1.5'}>
                {courses.length > 0 && (
                  <div>
                    <div className="font-mono text-[6.8px] font-bold uppercase tracking-widest text-ink mb-0.5">
                      CONSELHOS &amp; CERTIFICAÇÕES
                    </div>
                    <div className="space-y-0.5 text-[7px]">
                      {courses.map((c) => (
                        <div key={c.id} className="truncate">
                          <strong className="text-ink">{c.name}</strong>
                          {c.institution ? ` · ${c.institution}` : ''}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {languages.length > 0 && (
                  <div>
                    <div className="font-mono text-[6.8px] font-bold uppercase tracking-widest text-ink mb-0.5">
                      IDIOMAS
                    </div>
                    <div className="text-[7px] text-ink/90">
                      {languages.map((l) => `${l.language} (${l.proficiency})`).join(' · ')}
                    </div>
                  </div>
                )}
              </div>
            )}

            {additionalNotes && additionalNotes.trim() && (
              <div className="col-span-12 pt-1 border-t border-paper/70 text-[7.2px] text-ink/85">
                <strong className="font-mono text-[6.5px] uppercase tracking-wider text-ink">
                  NOTAS EXECUTIVAS:{' '}
                </strong>
                <span>{additionalNotes}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-1.5 border-t border-ink flex items-center justify-between font-mono text-[6.5px] text-ink-subtle uppercase tracking-wider">
        <span>FOLIO · MATRIZ EXECUTIVA (CONSELHO)</span>
        <span>
          PÁG. {String(pageNumber).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

/* ============================================================================
 * MATRIZ 05: TÉCNICO (Série Engenharia — Grade Modular & Stack no Topo)
 * Diferença estrutural:
 * - Cabeçalho em caixa de especificação técnica bipartida (Identificação + Tabela Monoespaçada)
 * - Matriz de Competências Técnicas, Ferramentas e Idiomas posicionada no topo da lauda
 * - Seções numeradas com tarjas de alto contraste ([01], [02], [03])
 * ============================================================================ */
const TecnicoMatrix: React.FC<{ page: PaginatedResumePage; compact: boolean }> = ({
  page,
  compact,
}) => {
  const {
    personal,
    isFirstPage,
    showObjective,
    showSummary,
    experiences,
    education,
    courses,
    skills,
    skillGroups,
    languages,
    additionalNotes,
    pageNumber,
    totalPages,
  } = page;

  const allSkills = [
    ...skills,
    ...skillGroups.flatMap((g) => g.skills),
  ];

  return (
    <div className={`h-full w-full flex flex-col justify-between font-sans ${compact ? 'p-3.5 sm:p-4 text-[7.8px]' : 'p-4 sm:p-6 text-[8.8px]'} leading-snug`}>
      <div className="space-y-2.5 overflow-hidden">
        {isFirstPage ? (
          <div className="border border-ink">
            {/* Tarja Superior de Especificação Técnica */}
            <div className="bg-ink text-ivory px-2.5 py-0.5 flex items-center justify-between font-mono text-[6.3px] uppercase tracking-widest">
              <span>ESPECIFICAÇÃO PROFISSIONAL · MATRIZ M·05 (TÉCNICO)</span>
              <span>ISO 216 · A4</span>
            </div>

            {/* Grade Bipartida do Cabeçalho */}
            <div className="grid grid-cols-12 divide-x divide-ink">
              <div className="col-span-7 p-2.5 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className={`${compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'} font-bold uppercase tracking-tight text-ink truncate`}>
                    {personal.fullName || 'Nome do Profissional'}
                  </div>
                  {personal.roleTitle && (
                    <div className="font-mono text-[7.5px] text-vermilion font-semibold mt-0.5">
                      {personal.roleTitle}
                    </div>
                  )}
                </div>

                {personal.photoUrl && (
                  <img
                    src={personal.photoUrl}
                    alt={`Foto de ${personal.fullName || 'candidato'}`}
                    className="w-10 h-12 object-cover border border-ink shrink-0"
                  />
                )}
              </div>

              <div className="col-span-5 p-2 bg-ivory/40 font-mono text-[6.5px] text-ink space-y-0.5">
                {personal.location && (
                  <div className="truncate">
                    <span className="text-ink-subtle">LOC: </span>
                    {personal.location}
                  </div>
                )}
                {personal.email && (
                  <div className="truncate">
                    <span className="text-ink-subtle">MAIL: </span>
                    {personal.email}
                  </div>
                )}
                {personal.phone && (
                  <div className="truncate">
                    <span className="text-ink-subtle">TEL: </span>
                    {personal.phone}
                  </div>
                )}
                {(personal.linkedin || personal.portfolio || personal.portfolioOrLinkedin) && (
                  <div className="truncate text-vermilion">
                    <span className="text-ink-subtle">REF: </span>
                    {personal.portfolio || personal.linkedin || personal.portfolioOrLinkedin}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-ink bg-ivory/40 px-2.5 py-1 flex items-center justify-between font-mono text-[7px] uppercase tracking-wider text-ink">
            <span>{personal.fullName} — ESPECIFICAÇÃO TÉCNICA (CONTINUAÇÃO)</span>
            <span>FOLHA {String(pageNumber).padStart(2, '0')}</span>
          </div>
        )}

        {/* Objetivo e Resumo Técnico */}
        {((showObjective && personal.objective?.trim()) ||
          (showSummary && personal.summary.trim())) && (
          <div className="border-l-2 border-ink pl-2.5 space-y-1">
            {showObjective && personal.objective && personal.objective.trim() && (
              <div className="text-[7.8px] text-ink">
                <span className="font-mono text-[6.8px] font-bold uppercase text-vermilion mr-1.5">
                  [OBJETIVO TÉCNICO]
                </span>
                <span>{personal.objective}</span>
              </div>
            )}
            {showSummary && personal.summary && personal.summary.trim() && (
              <p className="text-[7.8px] text-ink/90 leading-relaxed">
                {personal.summary}
              </p>
            )}
          </div>
        )}

        {/* MATRIZ DE COMPETÊNCIAS TÉCNICAS & FERRAMENTAS NO TOPO (Diferencial estrutural M·05) */}
        {(allSkills.length > 0 || (isFirstPage && languages.length > 0)) && (
          <div className="border border-ink bg-ivory/35">
            <div className="border-b border-ink bg-ivory-warm px-2 py-0.5 flex items-center justify-between font-mono text-[6.5px] font-bold uppercase tracking-wider text-ink">
              <span>[01] MATRIZ DE COMPETÊNCIAS TÉCNICAS, FERRAMENTAS &amp; TECNOLOGIAS</span>
              <span className="text-vermilion">{allSkills.length} ITENS</span>
            </div>
            <div className="p-2 space-y-1.5">
              {allSkills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {allSkills.map((sk) => (
                    <span
                      key={sk}
                      className="border border-ink bg-sheet px-1.5 py-0.5 font-mono text-[6.5px] text-ink font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              )}
              {languages.length > 0 && (
                <div className="pt-1 border-t border-paper/80 font-mono text-[6.8px] text-ink flex flex-wrap gap-x-3 gap-y-0.5">
                  <span className="font-bold text-ink-muted uppercase">IDIOMAS:</span>
                  {languages.map((l) => (
                    <span key={l.id}>
                      {l.language}: <strong>{l.proficiency}</strong>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Experiência Técnica & Projetos */}
        {experiences.length > 0 && (
          <div>
            <div className="flex items-center gap-2 border-b border-ink pb-0.5 mb-1.5">
              <span className="bg-ink text-ivory px-1.5 py-0.2 font-mono text-[6.5px] font-bold uppercase">
                [02]
              </span>
              <span className="font-mono text-[7.2px] font-bold uppercase tracking-wider text-ink">
                EXPERIÊNCIA PROFISSIONAL &amp; ENGENHARIA
              </span>
            </div>

            <div className="space-y-2">
              {experiences.map((exp) => {
                const lines = formatExperienceBullets(exp);
                const period = formatExperiencePeriodText(exp);
                return (
                  <div key={exp.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-bold text-ink text-[8px] sm:text-[8.5px]">
                        {exp.role || exp.company}
                      </span>
                      {period && (
                        <span className="font-mono text-[6.8px] text-vermilion font-medium shrink-0">
                          [{period}]
                        </span>
                      )}
                    </div>
                    {(exp.company || exp.location) && (
                      <div className="font-mono text-[7px] text-ink-muted mb-0.5">
                        {[exp.company, exp.location].filter(Boolean).join(' // ')}
                      </div>
                    )}
                    {lines.length > 0 && (
                      <ul className="space-y-0.5 text-ink/90 text-[7.5px]">
                        {lines.slice(0, compact ? 2 : 6).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="font-mono text-[7px] text-ink-muted">&gt;</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Formação Acadêmica e Certificações Técnicas */}
        {(education.length > 0 || courses.length > 0) && (
          <div className="grid grid-cols-12 gap-2.5">
            {education.length > 0 && (
              <div className={courses.length > 0 ? 'col-span-6' : 'col-span-12'}>
                <div className="flex items-center gap-1.5 border-b border-ink pb-0.5 mb-1">
                  <span className="bg-ink text-ivory px-1 py-0.2 font-mono text-[6.3px] font-bold">
                    [03]
                  </span>
                  <span className="font-mono text-[7px] font-bold uppercase tracking-wider text-ink">
                    FORMAÇÃO ACADÊMICA
                  </span>
                </div>
                <div className="space-y-1">
                  {education.map((edu) => (
                    <div key={edu.id} className="text-[7.4px]">
                      <div className="font-semibold text-ink">
                        {formatEducationDegreeTitle(edu)}
                      </div>
                      <div className="text-ink-muted text-[7px]">{edu.institution}</div>
                      <div className="font-mono text-[6.5px] text-ink-subtle">
                        {formatEducationPeriodText(edu)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {courses.length > 0 && (
              <div className={education.length > 0 ? 'col-span-6' : 'col-span-12'}>
                <div className="flex items-center gap-1.5 border-b border-ink pb-0.5 mb-1">
                  <span className="bg-ink text-ivory px-1 py-0.2 font-mono text-[6.3px] font-bold">
                    [04]
                  </span>
                  <span className="font-mono text-[7px] font-bold uppercase tracking-wider text-ink">
                    CERTIFICAÇÕES &amp; NORMAS
                  </span>
                </div>
                <div className="space-y-1 text-[7.2px]">
                  {courses.map((c) => (
                    <div key={c.id} className="flex items-baseline justify-between gap-1">
                      <div className="truncate">
                        <strong className="text-ink">{c.name}</strong>
                        {c.institution ? ` · ${c.institution}` : ''}
                        {c.workload ? ` (${c.workload})` : ''}
                      </div>
                      {c.completionYear && (
                        <span className="font-mono text-[6.5px] text-ink-muted shrink-0">
                          {c.completionYear}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informações Adicionais */}
        {additionalNotes && additionalNotes.trim() && (
          <div className="border-t border-paper pt-1 text-[7.2px] text-ink/85">
            <span className="font-mono text-[6.5px] font-bold uppercase text-ink mr-1.5">
              [ESPECIFICAÇÕES ADICIONAIS]:
            </span>
            <span>{additionalNotes}</span>
          </div>
        )}
      </div>

      <div className="pt-1.5 border-t border-ink flex items-center justify-between font-mono text-[6.5px] text-ink-subtle uppercase tracking-wider">
        <span>FOLIO · MATRIZ TÉCNICA (ENGENHARIA)</span>
        <span>
          PÁG. {String(pageNumber).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};
