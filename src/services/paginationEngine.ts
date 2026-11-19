import { isResumeDocumentEmpty } from './storageService';
import {
  CourseItem,
  EducationItem,
  ExperienceItem,
  LanguageItem,
  PersonalInfo,
  ResumeDocument,
  ResumeTemplateId,
  SkillGroup,
} from '../types/resume';

/**
 * Representa o conteúdo paginado de uma única folha ISO 216 A4 (210 × 297 mm).
 * Compartilhado entre a pré-visualização DOM e o motor de exportação PDF vetorial
 * para todas as 5 matrizes do FOLIO: Essencial, Editorial, Clássico, Executivo e Técnico.
 */
export interface PaginatedResumePage {
  pageNumber: number;
  totalPages: number;
  templateId: ResumeTemplateId;
  isFirstPage: boolean;
  personal: PersonalInfo;
  showObjective: boolean;
  showSummary: boolean;
  experiences: ExperienceItem[];
  education: EducationItem[];
  courses: CourseItem[];
  skills: string[];
  skillGroups: SkillGroup[];
  languages: LanguageItem[];
  additionalNotes: string;
}

export function formatExperiencePeriodText(exp: ExperienceItem): string {
  if (exp.period && exp.period.trim()) return exp.period.trim();
  const start = exp.startDate?.trim() || '';
  const end = exp.isCurrent ? 'Atual' : exp.endDate?.trim() || '';
  if (start && end) return `${start} — ${end}`;
  return start || end;
}

export function formatExperienceBullets(exp: ExperienceItem): string[] {
  if (exp.description && exp.description.trim()) {
    return exp.description
      .split('\n')
      .map((line) => line.replace(/^[-•*—▪]\s*/, '').trim())
      .filter(Boolean);
  }
  return (exp.highlights ?? []).map((h) => h.trim()).filter(Boolean);
}

export function formatEducationPeriodText(edu: EducationItem): string {
  if (edu.period && edu.period.trim()) return edu.period.trim();
  const start = edu.startDate?.trim() || '';
  const end = edu.isCurrent ? 'Em andamento' : edu.endDate?.trim() || '';
  if (start && end) return `${start} — ${end}`;
  return start || end;
}

export function formatEducationDegreeTitle(edu: EducationItem): string {
  if (edu.educationLevel && edu.degree) {
    if (edu.degree.toLowerCase().startsWith(edu.educationLevel.toLowerCase())) {
      return edu.degree;
    }
    return `${edu.educationLevel} em ${edu.degree}`;
  }
  return edu.degree || edu.educationLevel || '';
}

function estimateTextHeightMm(
  text: string,
  charsPerLine: number,
  lineHeightMm: number
): number {
  const cleaned = text.trim();
  if (!cleaned) return 0;
  const paragraphs = cleaned.split('\n');
  let totalLines = 0;
  for (const p of paragraphs) {
    const len = p.trim().length;
    totalLines += Math.max(1, Math.ceil(len / charsPerLine));
  }
  return totalLines * lineHeightMm;
}

function estimateExperienceHeightMm(
  exp: ExperienceItem,
  charsPerLine: number
): number {
  const bullets = formatExperienceBullets(exp);
  let height = 11.5;
  for (const b of bullets) {
    height += estimateTextHeightMm(b, charsPerLine, 4.2) + 1.2;
  }
  return height;
}

function estimateEducationHeightMm(edu: EducationItem): number {
  let height = 10;
  if (edu.details && edu.details.trim()) {
    height += estimateTextHeightMm(edu.details, 65, 4);
  }
  return height;
}

function estimateCourseHeightMm(): number {
  return 6.5;
}

function splitOversizedExperience(
  exp: ExperienceItem,
  maxBulletsPerChunk = 10
): ExperienceItem[] {
  const bullets = formatExperienceBullets(exp);
  if (bullets.length <= maxBulletsPerChunk) {
    return [exp];
  }

  const chunks: ExperienceItem[] = [];
  for (let i = 0; i < bullets.length; i += maxBulletsPerChunk) {
    const slice = bullets.slice(i, i + maxBulletsPerChunk);
    const isContinuation = i > 0;
    chunks.push({
      ...exp,
      id: `${exp.id}-part-${Math.floor(i / maxBulletsPerChunk) + 1}`,
      role: isContinuation ? `${exp.role} (Continuação)` : exp.role,
      description: slice.join('\n'),
      highlights: slice,
    });
  }
  return chunks;
}

/**
 * Motor de Paginação A4 Determinístico para os 5 Modelos Profissionais do FOLIO
 */
export function paginateResumeDocument(
  document: ResumeDocument,
  overrideTemplateId?: ResumeTemplateId
): PaginatedResumePage[] {
  const templateId = overrideTemplateId ?? document.metadata.templateId;

  if (isResumeDocumentEmpty(document)) {
    return [
      {
        pageNumber: 1,
        totalPages: 1,
        templateId,
        isFirstPage: true,
        personal: document.personal,
        showObjective: false,
        showSummary: false,
        experiences: [],
        education: [],
        courses: [],
        skills: [],
        skillGroups: [],
        languages: [],
        additionalNotes: '',
      },
    ];
  }

  const MAX_PAGE_HEIGHT_MM = 246;
  const FIRST_PAGE_HEADER_HEIGHT_MM =
    templateId === 'executivo' || templateId === 'tecnico' ? 35 : 32;

  const isTwoColumnEditorial = templateId === 'editorial';
  const isTopSkillsModel = templateId === 'executivo' || templateId === 'tecnico';
  const mainCharsPerLine = isTwoColumnEditorial ? 56 : 74;

  const normalizedExperiences = document.experiences.flatMap((exp) =>
    splitOversizedExperience(exp, isTwoColumnEditorial ? 9 : 11)
  );

  const pages: Omit<PaginatedResumePage, 'pageNumber' | 'totalPages'>[] = [];

  const createBlankPage = (
    isFirst: boolean
  ): Omit<PaginatedResumePage, 'pageNumber' | 'totalPages'> => ({
    templateId,
    isFirstPage: isFirst,
    personal: document.personal,
    showObjective: false,
    showSummary: false,
    experiences: [],
    education: [],
    courses: [],
    skills: [],
    skillGroups: [],
    languages: [],
    additionalNotes: '',
  });

  let currentPage = createBlankPage(true);
  let usedHeightMm = FIRST_PAGE_HEADER_HEIGHT_MM;

  const flushPageAndStartNew = () => {
    pages.push(currentPage);
    currentPage = createBlankPage(false);
    usedHeightMm = 14;
  };

  // 1. Objetivo Profissional
  if (document.personal.objective && document.personal.objective.trim()) {
    const objHeight =
      8 + estimateTextHeightMm(document.personal.objective, mainCharsPerLine, 4.5);
    currentPage.showObjective = true;
    usedHeightMm += objHeight;
  }

  // 2. Resumo Profissional
  if (document.personal.summary && document.personal.summary.trim()) {
    const sumHeight =
      9 + estimateTextHeightMm(document.personal.summary, mainCharsPerLine, 4.5);
    if (usedHeightMm + sumHeight > MAX_PAGE_HEIGHT_MM && currentPage.showObjective) {
      flushPageAndStartNew();
    }
    currentPage.showSummary = true;
    usedHeightMm += sumHeight;
  }

  // Para M·04 EXECUTIVO e M·05 TÉCNICO, as Competências-Chave / Habilidades aparecem em destaque no topo da Página 1
  if (isTopSkillsModel) {
    const hasTopSkills =
      (document.skills?.length ?? 0) > 0 ||
      (document.skillGroups?.length ?? 0) > 0 ||
      (templateId === 'tecnico' && document.languages.length > 0);
    if (hasTopSkills) {
      const skillsCount =
        (document.skills?.length ?? 0) +
        (document.skillGroups ?? []).reduce((acc, g) => acc + g.skills.length, 0);
      const topSkillsHeight =
        10 +
        Math.ceil(skillsCount / 5) * 5 +
        (templateId === 'tecnico' && document.languages.length > 0 ? 5 : 0);
      currentPage.skills = [...(document.skills ?? [])];
      currentPage.skillGroups = [...(document.skillGroups ?? [])];
      if (templateId === 'tecnico') {
        currentPage.languages = [...document.languages];
      }
      usedHeightMm += topSkillsHeight;
    }
  }

  // 3. Experiências Profissionais (com proteção contra título órfão)
  if (normalizedExperiences.length > 0) {
    const sectionHeaderHeight = 8;
    const firstExpHeight = estimateExperienceHeightMm(
      normalizedExperiences[0],
      mainCharsPerLine
    );

    if (
      usedHeightMm + sectionHeaderHeight + firstExpHeight > MAX_PAGE_HEIGHT_MM &&
      (currentPage.showObjective ||
        currentPage.showSummary ||
        currentPage.skills.length > 0)
    ) {
      flushPageAndStartNew();
    }

    usedHeightMm += sectionHeaderHeight;

    for (const exp of normalizedExperiences) {
      const expH = estimateExperienceHeightMm(exp, mainCharsPerLine);
      if (
        usedHeightMm + expH > MAX_PAGE_HEIGHT_MM &&
        (currentPage.experiences.length > 0 ||
          currentPage.showObjective ||
          currentPage.showSummary)
      ) {
        flushPageAndStartNew();
        usedHeightMm += sectionHeaderHeight;
      }
      currentPage.experiences.push(exp);
      usedHeightMm += expH;
    }
  }

  // Fluxo específico da Matriz M·02 EDITORIAL (2 colunas)
  if (isTwoColumnEditorial) {
    const allEdu = [...document.education];
    const allSkills = [...(document.skills ?? [])];
    const allGroups = [...(document.skillGroups ?? [])];
    const allLangs = [...document.languages];

    const courses = document.courses ?? [];
    if (courses.length > 0) {
      const sectionHeaderH = 8;
      const firstCourseH = estimateCourseHeightMm();
      if (usedHeightMm + sectionHeaderH + firstCourseH > MAX_PAGE_HEIGHT_MM) {
        flushPageAndStartNew();
      }
      usedHeightMm += sectionHeaderH;

      for (const course of courses) {
        const cH = estimateCourseHeightMm();
        if (usedHeightMm + cH > MAX_PAGE_HEIGHT_MM && currentPage.courses.length > 0) {
          flushPageAndStartNew();
          usedHeightMm += sectionHeaderH;
        }
        currentPage.courses.push(course);
        usedHeightMm += cH;
      }
    }

    if (document.additionalNotes && document.additionalNotes.trim()) {
      const addH =
        10 + estimateTextHeightMm(document.additionalNotes, mainCharsPerLine, 4.2);
      if (
        usedHeightMm + addH > MAX_PAGE_HEIGHT_MM &&
        (currentPage.experiences.length > 0 || currentPage.courses.length > 0)
      ) {
        flushPageAndStartNew();
      }
      currentPage.additionalNotes = document.additionalNotes;
      usedHeightMm += addH;
    }

    pages.push(currentPage);

    const firstPage = pages[0];
    const MAX_SIDEBAR_EDU_PAGE_1 = 4;
    firstPage.education = allEdu.slice(0, MAX_SIDEBAR_EDU_PAGE_1);
    firstPage.skills = allSkills;
    firstPage.skillGroups = allGroups;
    firstPage.languages = allLangs;

    if (allEdu.length > MAX_SIDEBAR_EDU_PAGE_1) {
      const remainingEdu = allEdu.slice(MAX_SIDEBAR_EDU_PAGE_1);
      if (pages.length < 2) {
        pages.push(createBlankPage(false));
      }
      pages[1].education = remainingEdu;
    }
  } else {
    // Fluxo de Formação Acadêmica para M·01 ESSENCIAL, M·03 CLÁSSICO, M·04 EXECUTIVO e M·05 TÉCNICO
    if (document.education.length > 0) {
      const sectionHeaderH = 8;
      const firstEduH = estimateEducationHeightMm(document.education[0]);
      if (usedHeightMm + sectionHeaderH + firstEduH > MAX_PAGE_HEIGHT_MM) {
        flushPageAndStartNew();
      }
      usedHeightMm += sectionHeaderH;

      for (const edu of document.education) {
        const eduH = estimateEducationHeightMm(edu);
        if (usedHeightMm + eduH > MAX_PAGE_HEIGHT_MM && currentPage.education.length > 0) {
          flushPageAndStartNew();
          usedHeightMm += 8;
        }
        currentPage.education.push(edu);
        usedHeightMm += eduH;
      }
    }

    // Cursos e Certificações
    const courses = document.courses ?? [];
    if (courses.length > 0) {
      const sectionHeaderH = 8;
      const firstCourseH = estimateCourseHeightMm();
      if (usedHeightMm + sectionHeaderH + firstCourseH > MAX_PAGE_HEIGHT_MM) {
        flushPageAndStartNew();
      }
      usedHeightMm += sectionHeaderH;

      for (const course of courses) {
        const cH = estimateCourseHeightMm();
        if (usedHeightMm + cH > MAX_PAGE_HEIGHT_MM && currentPage.courses.length > 0) {
          flushPageAndStartNew();
          usedHeightMm += sectionHeaderH;
        }
        currentPage.courses.push(course);
        usedHeightMm += cH;
      }
    }

    // Habilidades (para Essencial e Clássico, onde ficam após Formação/Cursos) + Idiomas (exceto Técnico, onde Idiomas já ficam no Box [01] do topo)
    const needsBottomSkills = !isTopSkillsModel;
    const needsBottomLanguages = templateId !== 'tecnico';
    const hasBottomSkillsOrLangs =
      (needsBottomSkills &&
        ((document.skills?.length ?? 0) > 0 ||
          (document.skillGroups?.length ?? 0) > 0)) ||
      (needsBottomLanguages && document.languages.length > 0);

    if (hasBottomSkillsOrLangs) {
      const skillsText = needsBottomSkills ? (document.skills ?? []).join(' · ') : '';
      const langsText = needsBottomLanguages
        ? document.languages
            .map((l) => `${l.language} (${l.proficiency})`)
            .join(' · ')
        : '';
      const domainBlockH =
        10 +
        estimateTextHeightMm(skillsText, mainCharsPerLine, 4.2) +
        estimateTextHeightMm(langsText, mainCharsPerLine, 4.2) +
        (needsBottomSkills ? (document.skillGroups?.length ?? 0) * 6 : 0);

      if (usedHeightMm + domainBlockH > MAX_PAGE_HEIGHT_MM) {
        flushPageAndStartNew();
      }
      if (needsBottomSkills) {
        currentPage.skills = [...(document.skills ?? [])];
        currentPage.skillGroups = [...(document.skillGroups ?? [])];
      }
      if (needsBottomLanguages) {
        currentPage.languages = [...document.languages];
      }
      usedHeightMm += domainBlockH;
    }

    // Informações Adicionais
    if (document.additionalNotes && document.additionalNotes.trim()) {
      const addH =
        10 + estimateTextHeightMm(document.additionalNotes, mainCharsPerLine, 4.2);
      if (usedHeightMm + addH > MAX_PAGE_HEIGHT_MM) {
        flushPageAndStartNew();
      }
      currentPage.additionalNotes = document.additionalNotes;
      usedHeightMm += addH;
    }

    pages.push(currentPage);
  }

  // Filtra qualquer página eventualmente vazia (garantia estrita contra páginas em branco)
  const nonEmptyPages = pages.filter((p, idx) => {
    if (idx === 0) return true;
    return (
      p.showObjective ||
      p.showSummary ||
      p.experiences.length > 0 ||
      p.education.length > 0 ||
      p.courses.length > 0 ||
      p.skills.length > 0 ||
      p.skillGroups.length > 0 ||
      p.languages.length > 0 ||
      Boolean(p.additionalNotes.trim())
    );
  });

  const totalPages = nonEmptyPages.length;
  return nonEmptyPages.map((p, index) => ({
    ...p,
    pageNumber: index + 1,
    totalPages,
  }));
}
