import {
  ALL_TEMPLATE_IDS,
  ResumeDocument,
  ResumeTemplateId,
  WorkspacePreferences,
} from '../types/resume';

const PREFS_STORAGE_KEY = 'folio:workspace-preferences:v1';
const RESUME_STORAGE_KEY = 'folio:resume-document:v1';

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
      const parsed = JSON.parse(raw) as Partial<WorkspacePreferences>;
      const selectedTemplateId = ALL_TEMPLATE_IDS.includes(
        parsed.selectedTemplateId as ResumeTemplateId
      )
        ? (parsed.selectedTemplateId as ResumeTemplateId)
        : DEFAULT_PREFERENCES.selectedTemplateId;

      return {
        ...DEFAULT_PREFERENCES,
        ...parsed,
        selectedTemplateId,
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

      const parsed = JSON.parse(raw) as Partial<ResumeDocument>;
      const base = createEmptyResumeDocument(fallbackTemplateId);
      const rawPhoto = parsed.personal?.photoUrl ?? '';
      const safePhotoUrl = /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(rawPhoto)
        ? rawPhoto
        : '';

      return {
        ...base,
        ...parsed,
        metadata: {
          ...base.metadata,
          ...(parsed.metadata ?? {}),
        },
        personal: {
          ...base.personal,
          ...(parsed.personal ?? {}),
          photoUrl: safePhotoUrl,
        },
        experiences: Array.isArray(parsed.experiences) ? parsed.experiences : [],
        education: Array.isArray(parsed.education) ? parsed.education : [],
        courses: Array.isArray(parsed.courses) ? parsed.courses : [],
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        skillGroups: Array.isArray(parsed.skillGroups) ? parsed.skillGroups : [],
        languages: Array.isArray(parsed.languages) ? parsed.languages : [],
        additionalNotes: typeof parsed.additionalNotes === 'string' ? parsed.additionalNotes : '',
      };
    } catch {
      return createEmptyResumeDocument(fallbackTemplateId);
    }
  },

  saveResumeDocument(doc: ResumeDocument): ResumeDocument {
    const updated: ResumeDocument = {
      ...doc,
      metadata: {
        ...doc.metadata,
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
};
