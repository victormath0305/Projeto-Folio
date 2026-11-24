import {
  ALL_TEMPLATE_IDS,
  CourseItem,
  EducationItem,
  EducationLevel,
  EditorSectionId,
  ExperienceItem,
  LanguageItem,
  ResumeDocument,
  ResumeTemplateId,
  SkillGroup,
  WorkspacePreferences,
} from '../types/resume';
import { isSafePhotoDataUrl } from './imageSecurityService';

const PREFS_STORAGE_KEY = 'folio:workspace-preferences:v1';
const RESUME_STORAGE_KEY = 'folio:resume-document:v1';
export const POST_DOWNLOAD_SUPPORT_KEY = 'folio:post-download-support:v1';

const MAX_STORAGE_PAYLOAD_LENGTH = 4_500_000;
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const VALID_SECTION_IDS: readonly EditorSectionId[] = [
  'dados-pessoais',
  'objetivo',
  'resumo',
  'experiencia',
  'formacao',
  'cursos',
  'habilidades',
  'idiomas',
  'adicionais',
];

const VALID_GOALS: readonly NonNullable<WorkspacePreferences['candidateGoal']>[] = [
  'primeiro-emprego',
  'estagio',
  'recolocacao',
  'transicao-carreira',
];

const VALID_EDUCATION_LEVELS: readonly EducationLevel[] = [
  '',
  'Ensino Médio',
  'Ensino Técnico',
  'Tecnólogo',
  'Bacharelado',
  'Licenciatura',
  'Especialização / Pós-graduação',
  'MBA',
  'Mestrado',
  'Doutorado',
];

export const STORAGE_LIMITS = {
  maxShortText: 160,
  maxMediumText: 400,
  maxLongText: 4000,
  maxExperiences: 40,
  maxHighlightsPerExperience: 20,
  maxEducation: 25,
  maxCourses: 40,
  maxSkills: 80,
  maxSkillGroups: 20,
  maxLanguages: 20,
} as const;

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Parser JSON protegido contra Prototype Pollution e payloads gigantescos.
 */
export function safeJsonParse(raw: string): unknown {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > MAX_STORAGE_PAYLOAD_LENGTH) {
    return null;
  }
  try {
    return JSON.parse(raw, (key, value) => {
      if (DANGEROUS_KEYS.has(key)) {
        return undefined;
      }
      return value;
    });
  } catch {
    return null;
  }
}

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\u0000/g, '').slice(0, maxLength);
}

function sanitizeOptionalText(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  return value.replace(/\u0000/g, '').slice(0, maxLength);
}

function sanitizeExperienceList(raw: unknown): ExperienceItem[] {
  if (!Array.isArray(raw)) return [];
  const result: ExperienceItem[] = [];
  for (let i = 0; i < Math.min(raw.length, STORAGE_LIMITS.maxExperiences); i++) {
    const item = raw[i];
    if (!isPlainRecord(item)) continue;
    const rawHighlights = Array.isArray(item.highlights)
      ? item.highlights
          .slice(0, STORAGE_LIMITS.maxHighlightsPerExperience)
          .map((h) => sanitizeText(h, STORAGE_LIMITS.maxMediumText))
          .filter(Boolean)
      : undefined;

    result.push({
      id: sanitizeText(item.id, 64) || `exp-${i + 1}`,
      company: sanitizeText(item.company, STORAGE_LIMITS.maxShortText),
      role: sanitizeText(item.role, STORAGE_LIMITS.maxShortText),
      location: sanitizeText(item.location, STORAGE_LIMITS.maxShortText),
      startDate: sanitizeOptionalText(item.startDate, 40),
      endDate: sanitizeOptionalText(item.endDate, 40),
      isCurrent: typeof item.isCurrent === 'boolean' ? item.isCurrent : false,
      description: sanitizeOptionalText(item.description, STORAGE_LIMITS.maxLongText),
      period: sanitizeOptionalText(item.period, 80),
      highlights: rawHighlights,
    });
  }
  return result;
}

function sanitizeEducationList(raw: unknown): EducationItem[] {
  if (!Array.isArray(raw)) return [];
  const result: EducationItem[] = [];
  for (let i = 0; i < Math.min(raw.length, STORAGE_LIMITS.maxEducation); i++) {
    const item = raw[i];
    if (!isPlainRecord(item)) continue;
    const rawLevel =
      typeof item.educationLevel === 'string' &&
      VALID_EDUCATION_LEVELS.includes(item.educationLevel as EducationLevel)
        ? (item.educationLevel as EducationLevel)
        : '';

    result.push({
      id: sanitizeText(item.id, 64) || `edu-${i + 1}`,
      institution: sanitizeText(item.institution, STORAGE_LIMITS.maxShortText),
      degree: sanitizeText(item.degree, STORAGE_LIMITS.maxShortText),
      educationLevel: rawLevel,
      startDate: sanitizeOptionalText(item.startDate, 40),
      endDate: sanitizeOptionalText(item.endDate, 40),
      isCurrent: typeof item.isCurrent === 'boolean' ? item.isCurrent : false,
      period: sanitizeOptionalText(item.period, 80),
      details: sanitizeOptionalText(item.details, STORAGE_LIMITS.maxLongText),
    });
  }
  return result;
}

function sanitizeCoursesList(raw: unknown): CourseItem[] {
  if (!Array.isArray(raw)) return [];
  const result: CourseItem[] = [];
  for (let i = 0; i < Math.min(raw.length, STORAGE_LIMITS.maxCourses); i++) {
    const item = raw[i];
    if (!isPlainRecord(item)) continue;
    result.push({
      id: sanitizeText(item.id, 64) || `course-${i + 1}`,
      name: sanitizeText(item.name, STORAGE_LIMITS.maxShortText),
      institution: sanitizeText(item.institution, STORAGE_LIMITS.maxShortText),
      completionYear: sanitizeText(item.completionYear, 32),
      workload: sanitizeOptionalText(item.workload, 40),
    });
  }
  return result;
}

function sanitizeSkillsList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, STORAGE_LIMITS.maxSkills)
    .map((s) => sanitizeText(s, 80).trim())
    .filter(Boolean);
}

function sanitizeSkillGroupsList(raw: unknown): SkillGroup[] {
  if (!Array.isArray(raw)) return [];
  const result: SkillGroup[] = [];
  for (let i = 0; i < Math.min(raw.length, STORAGE_LIMITS.maxSkillGroups); i++) {
    const item = raw[i];
    if (!isPlainRecord(item)) continue;
    result.push({
      id: sanitizeText(item.id, 64) || `sg-${i + 1}`,
      category: sanitizeText(item.category, STORAGE_LIMITS.maxShortText),
      skills: sanitizeSkillsList(item.skills),
    });
  }
  return result;
}

function sanitizeLanguagesList(raw: unknown): LanguageItem[] {
  if (!Array.isArray(raw)) return [];
  const result: LanguageItem[] = [];
  for (let i = 0; i < Math.min(raw.length, STORAGE_LIMITS.maxLanguages); i++) {
    const item = raw[i];
    if (!isPlainRecord(item)) continue;
    result.push({
      id: sanitizeText(item.id, 64) || `lang-${i + 1}`,
      language: sanitizeText(item.language, 80),
      proficiency: sanitizeText(item.proficiency, 60) || 'Intermediário',
    });
  }
  return result;
}

/**
 * Valida e sanitiza integralmente um objeto de currículo recuperado do armazenamento local.
 */
export function sanitizeResumeDocument(
  raw: unknown,
  fallbackTemplateId: ResumeTemplateId = 'editorial'
): ResumeDocument {
  const base = createEmptyResumeDocument(fallbackTemplateId);
  if (!isPlainRecord(raw)) {
    return base;
  }

  const rawMeta = isPlainRecord(raw.metadata) ? raw.metadata : {};
  const rawPersonal = isPlainRecord(raw.personal) ? raw.personal : {};

  const templateId = ALL_TEMPLATE_IDS.includes(
    rawMeta.templateId as ResumeTemplateId
  )
    ? (rawMeta.templateId as ResumeTemplateId)
    : base.metadata.templateId;

  const rawMargins =
    typeof rawMeta.marginsMm === 'number' &&
    Number.isFinite(rawMeta.marginsMm) &&
    rawMeta.marginsMm >= 10 &&
    rawMeta.marginsMm <= 30
      ? rawMeta.marginsMm
      : base.metadata.marginsMm;

  const safePhotoUrl = isSafePhotoDataUrl(rawPersonal.photoUrl)
    ? rawPersonal.photoUrl
    : '';

  return {
    metadata: {
      id: sanitizeText(rawMeta.id, 64) || base.metadata.id,
      templateId,
      updatedAt: sanitizeText(rawMeta.updatedAt, 40) || base.metadata.updatedAt,
      locale: 'pt-BR',
      paperFormat: 'A4',
      marginsMm: rawMargins,
      isFirstJobMode:
        typeof rawMeta.isFirstJobMode === 'boolean'
          ? rawMeta.isFirstJobMode
          : false,
    },
    personal: {
      fullName: sanitizeText(rawPersonal.fullName, STORAGE_LIMITS.maxShortText),
      roleTitle: sanitizeText(rawPersonal.roleTitle, STORAGE_LIMITS.maxShortText),
      seniorityLabel: sanitizeOptionalText(
        rawPersonal.seniorityLabel,
        STORAGE_LIMITS.maxShortText
      ),
      location: sanitizeText(rawPersonal.location, STORAGE_LIMITS.maxShortText),
      address: sanitizeText(rawPersonal.address, STORAGE_LIMITS.maxMediumText),
      email: sanitizeText(rawPersonal.email, STORAGE_LIMITS.maxShortText),
      phone: sanitizeText(rawPersonal.phone, 50),
      linkedin: sanitizeText(rawPersonal.linkedin, STORAGE_LIMITS.maxMediumText),
      portfolio: sanitizeText(rawPersonal.portfolio, STORAGE_LIMITS.maxMediumText),
      portfolioOrLinkedin: sanitizeText(
        rawPersonal.portfolioOrLinkedin,
        STORAGE_LIMITS.maxMediumText
      ),
      photoUrl: safePhotoUrl,
      objective: sanitizeText(rawPersonal.objective, STORAGE_LIMITS.maxLongText),
      summary: sanitizeText(rawPersonal.summary, STORAGE_LIMITS.maxLongText),
    },
    experiences: sanitizeExperienceList(raw.experiences),
    education: sanitizeEducationList(raw.education),
    courses: sanitizeCoursesList(raw.courses),
    skills: sanitizeSkillsList(raw.skills),
    skillGroups: sanitizeSkillGroupsList(raw.skillGroups),
    languages: sanitizeLanguagesList(raw.languages),
    additionalNotes: sanitizeText(raw.additionalNotes, STORAGE_LIMITS.maxLongText),
  };
}

export interface PostDownloadSupportState {
  status: 'dismissed' | 'evaluated';
  rating?: number;
  updatedAt: string;
}

const DEFAULT_PREFERENCES: WorkspacePreferences = {
  selectedTemplateId: 'editorial',
  candidateGoal: 'recolocacao',
  candidateNameDraft: '',
  candidateRoleDraft: '',
  activeSectionId: 'dados-pessoais',
  lastView: 'landing',
  lastSavedAt: new Date().toISOString(),
};

export function createEmptyResumeDocument(
  templateId: ResumeTemplateId = 'editorial'
): ResumeDocument {
  return {
    metadata: {
      id: 'folio-user-resume',
      templateId,
      updatedAt: new Date().toISOString(),
      locale: 'pt-BR',
      paperFormat: 'A4',
      marginsMm: 18,
      isFirstJobMode: false,
    },
    personal: {
      fullName: '',
      roleTitle: '',
      location: '',
      address: '',
      email: '',
      phone: '',
      linkedin: '',
      portfolio: '',
      photoUrl: '',
      objective: '',
      summary: '',
    },
    experiences: [],
    education: [],
    courses: [],
    skills: [],
    skillGroups: [],
    languages: [],
    additionalNotes: '',
  };
}

/**
 * Verifica se o currículo do usuário ainda está completamente em branco
 */
export function isResumeDocumentEmpty(doc: ResumeDocument): boolean {
  const p = doc.personal;
  const hasPersonal = Boolean(
    p.fullName.trim() ||
      p.roleTitle.trim() ||
      p.email.trim() ||
      p.phone.trim() ||
      p.location.trim() ||
      p.address?.trim() ||
      p.linkedin?.trim() ||
      p.portfolio?.trim() ||
      p.photoUrl ||
      p.objective?.trim() ||
      p.summary.trim()
  );

  const hasLists =
    doc.experiences.length > 0 ||
    doc.education.length > 0 ||
    (doc.courses?.length ?? 0) > 0 ||
    (doc.skills?.length ?? 0) > 0 ||
    doc.languages.length > 0 ||
    Boolean(doc.additionalNotes?.trim());

  return !hasPersonal && !hasLists;
}

/**
 * Calcula o percentual de preenchimento do currículo de forma inteligente,
 * sem penalizar candidatos em busca do primeiro emprego (sem experiência profissional).
 */
export function calculateResumeProgress(doc: ResumeDocument): {
  percentage: number;
  filledCount: number;
  totalCount: number;
} {
  const p = doc.personal;
  const checks: boolean[] = [
    // 1. Dados pessoais básicos (nome + cargo ou contato)
    Boolean(p.fullName.trim() && (p.email.trim() || p.phone.trim() || p.roleTitle.trim())),
    // 2. Objetivo ou Resumo profissional preenchido
    Boolean(p.objective?.trim() || p.summary.trim()),
    // 3. Experiência profissional OU modo primeiro emprego / projetos adicionais
    Boolean(
      doc.experiences.length > 0 ||
        doc.metadata.isFirstJobMode ||
        (doc.courses && doc.courses.length > 0) ||
        doc.additionalNotes?.trim()
    ),
    // 4. Formação acadêmica
    Boolean(doc.education.length > 0),
    // 5. Habilidades ou Idiomas
    Boolean((doc.skills && doc.skills.length > 0) || doc.languages.length > 0),
  ];

  const filledCount = checks.filter(Boolean).length;
  const totalCount = checks.length;
  const percentage = Math.round((filledCount / totalCount) * 100);

  return { percentage, filledCount, totalCount };
}

/**
 * Serviço de Persistência Local (Local-First)
 * Garante que todas as escolhas e dados do currículo permaneçam exclusivamente no navegador.
 */
export const storageService = {
  loadPreferences(): WorkspacePreferences {
    if (typeof window === 'undefined') {
      return DEFAULT_PREFERENCES;
    }

    try {
      const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
      if (!raw) {
        return DEFAULT_PREFERENCES;
      }
      const parsed = safeJsonParse(raw);
      if (!isPlainRecord(parsed)) {
        return DEFAULT_PREFERENCES;
      }

      const selectedTemplateId = ALL_TEMPLATE_IDS.includes(
        parsed.selectedTemplateId as ResumeTemplateId
      )
        ? (parsed.selectedTemplateId as ResumeTemplateId)
        : DEFAULT_PREFERENCES.selectedTemplateId;

      const candidateGoal = VALID_GOALS.includes(
        parsed.candidateGoal as NonNullable<WorkspacePreferences['candidateGoal']>
      )
        ? (parsed.candidateGoal as WorkspacePreferences['candidateGoal'])
        : DEFAULT_PREFERENCES.candidateGoal;

      const activeSectionId = VALID_SECTION_IDS.includes(
        parsed.activeSectionId as EditorSectionId
      )
        ? (parsed.activeSectionId as EditorSectionId)
        : DEFAULT_PREFERENCES.activeSectionId;

      const lastView =
        parsed.lastView === 'editor' || parsed.lastView === 'landing'
          ? parsed.lastView
          : DEFAULT_PREFERENCES.lastView;

      return {
        selectedTemplateId,
        candidateGoal,
        candidateNameDraft: sanitizeText(
          parsed.candidateNameDraft,
          STORAGE_LIMITS.maxShortText
        ),
        candidateRoleDraft: sanitizeText(
          parsed.candidateRoleDraft,
          STORAGE_LIMITS.maxShortText
        ),
        activeSectionId,
        lastView,
        lastSavedAt:
          sanitizeText(parsed.lastSavedAt, 40) || DEFAULT_PREFERENCES.lastSavedAt,
      };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(updates: Partial<WorkspacePreferences>): WorkspacePreferences {
    const current = this.loadPreferences();
    const next: WorkspacePreferences = {
      ...current,
      ...updates,
      lastSavedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Silencia erro caso o armazenamento esteja restrito
      }
    }

    return next;
  },

  clearPreferences(): void {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(PREFS_STORAGE_KEY);
      } catch {
        // Ignora falhas de acesso
      }
    }
  },

  loadResumeDocument(fallbackTemplateId: ResumeTemplateId = 'editorial'): ResumeDocument {
    if (typeof window === 'undefined') {
      return createEmptyResumeDocument(fallbackTemplateId);
    }

    try {
      const raw = window.localStorage.getItem(RESUME_STORAGE_KEY);
      if (!raw) {
        const prefs = this.loadPreferences();
        const empty = createEmptyResumeDocument(prefs.selectedTemplateId || fallbackTemplateId);
        if (prefs.candidateNameDraft) {
          empty.personal.fullName = prefs.candidateNameDraft;
        }
        if (prefs.candidateRoleDraft) {
          empty.personal.roleTitle = prefs.candidateRoleDraft;
        }
        if (prefs.candidateGoal === 'primeiro-emprego' || prefs.candidateGoal === 'estagio') {
          empty.metadata.isFirstJobMode = true;
        }
        return empty;
      }

      const parsed = safeJsonParse(raw);
      return sanitizeResumeDocument(parsed, fallbackTemplateId);
    } catch {
      return createEmptyResumeDocument(fallbackTemplateId);
    }
  },

  saveResumeDocument(doc: ResumeDocument): ResumeDocument {
    const sanitized = sanitizeResumeDocument(doc, doc.metadata.templateId);
    const updated: ResumeDocument = {
      ...sanitized,
      metadata: {
        ...sanitized.metadata,
        updatedAt: new Date().toISOString(),
      },
    };

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignora falha de quota
      }
    }

    return updated;
  },

  clearResumeDocument(templateId: ResumeTemplateId = 'editorial'): ResumeDocument {
    const fresh = createEmptyResumeDocument(templateId);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(RESUME_STORAGE_KEY);
      } catch {
        // Ignora falha
      }
    }
    return fresh;
  },

  hasSavedResumeDraft(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const raw = window.localStorage.getItem(RESUME_STORAGE_KEY);
      if (!raw) return false;
      const doc = this.loadResumeDocument();
      return !isResumeDocumentEmpty(doc);
    } catch {
      return false;
    }
  },

  getPostDownloadSupportState(): PostDownloadSupportState | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem(POST_DOWNLOAD_SUPPORT_KEY);
      if (!raw) return null;
      const parsed = safeJsonParse(raw);
      if (!isPlainRecord(parsed)) return null;
      if (parsed.status === 'dismissed' || parsed.status === 'evaluated') {
        return {
          status: parsed.status,
          rating:
            typeof parsed.rating === 'number' &&
            parsed.rating >= 1 &&
            parsed.rating <= 5
              ? parsed.rating
              : undefined,
          updatedAt:
            sanitizeText(parsed.updatedAt, 40) || new Date().toISOString(),
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  shouldShowPostDownloadSupportModal(): boolean {
    return this.getPostDownloadSupportState() === null;
  },

  markPostDownloadSupportDismissed(): void {
    if (typeof window === 'undefined') return;
    try {
      const state: PostDownloadSupportState = {
        status: 'dismissed',
        updatedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(POST_DOWNLOAD_SUPPORT_KEY, JSON.stringify(state));
    } catch {
      // Silencia erros de armazenamento sem impedir o uso do site
    }
  },

  markPostDownloadSupportEvaluated(rating?: number): void {
    if (typeof window === 'undefined') return;
    try {
      const state: PostDownloadSupportState = {
        status: 'evaluated',
        rating,
        updatedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(POST_DOWNLOAD_SUPPORT_KEY, JSON.stringify(state));
    } catch {
      // Silencia erros de armazenamento sem impedir o uso do site
    }
  },
};
