/**
 * FOLIO — Arquitetura de Domínio e Tipagens Base (Fases 01 a 04)
 * Preparado para:
 * - Biblioteca de 5 modelos tipográficos A4 (Essencial, Editorial, Clássico, Executivo, Técnico)
 * - Editor de currículos estruturado em 09 seções
 * - Persistência local sem servidor (LocalStorage)
 * - Exportação vetorial em PDF com paginação automática A4
 */

export type ResumeTemplateId =
  | 'essencial'
  | 'editorial'
  | 'classico'
  | 'executivo'
  | 'tecnico';

export const ALL_TEMPLATE_IDS: ResumeTemplateId[] = [
  'essencial',
  'editorial',
  'classico',
  'executivo',
  'tecnico',
];

export type LanguageProficiency =
  | 'Básico'
  | 'Intermediário'
  | 'Avançado'
  | 'Fluente'
  | 'Nativo';

export type EducationLevel =
  | 'Ensino Médio'
  | 'Ensino Técnico'
  | 'Tecnólogo'
  | 'Bacharelado'
  | 'Licenciatura'
  | 'Especialização / Pós-graduação'
  | 'MBA'
  | 'Mestrado'
  | 'Doutorado'
  | '';

export type EditorSectionId =
  | 'dados-pessoais'
  | 'objetivo'
  | 'resumo'
  | 'experiencia'
  | 'formacao'
  | 'cursos'
  | 'habilidades'
  | 'idiomas'
  | 'adicionais';

export interface PersonalInfo {
  fullName: string;
  roleTitle: string;
  seniorityLabel?: string;
  location: string;
  address?: string;
  email: string;
  phone: string;
  linkedin?: string;
  portfolio?: string;
  /** Campo legado usado nos exemplos da Fase 01 */
  portfolioOrLinkedin?: string;
  /** Foto opcional em Data URL (base64 local) */
  photoUrl?: string;
  /** Objetivo profissional (Seção 02) */
  objective?: string;
  /** Resumo profissional (Seção 03) */
  summary: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  /** Descrição livre das atividades no editor (Fase 02) */
  description?: string;
  /** Período formatado e destaques (usado nos exemplos da Fase 01 ou derivado) */
  period?: string;
  highlights?: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  educationLevel?: EducationLevel;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  period?: string;
  details?: string;
}

export interface CourseItem {
  id: string;
  name: string;
  institution: string;
  completionYear: string;
  workload?: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: LanguageProficiency | string;
}

export interface ResumeMetadata {
  id: string;
  templateId: ResumeTemplateId;
  updatedAt: string;
  locale: 'pt-BR';
  paperFormat: 'A4';
  marginsMm: number;
  isFirstJobMode?: boolean;
}

export interface ResumeDocument {
  metadata: ResumeMetadata;
  personal: PersonalInfo;
  experiences: ExperienceItem[];
  education: EducationItem[];
  courses?: CourseItem[];
  /** Lista individual de habilidades do editor (Seção 07) */
  skills?: string[];
  /** Agrupamento opcional usado nos espécimes demonstrativos */
  skillGroups: SkillGroup[];
  languages: LanguageItem[];
  additionalNotes?: string;
}

export interface TemplateCatalogEntry {
  id: ResumeTemplateId;
  shortCode: string;
  code: string;
  seriesName: string;
  name: string;
  tagline: string;
  description: string;
  recommendedProfile: string;
  idealFor: string[];
  structuralHighlight: string;
  atsGuidance: string;
  typographicPairing: {
    heading: string;
    body: string;
    scale: string;
  };
  layoutSpecs: {
    columns: string;
    density: 'Alta' | 'Equilibrada' | 'Clássica' | 'Executiva' | 'Estruturada';
    atsCompatibility:
      | 'Prioridade ATS (Fluxo Linear)'
      | 'Alta (Duas Colunas Semânticas)'
      | 'Alta (Ordem Cronológica)'
      | 'Alta (Dossiê Executivo)'
      | 'Alta (Indexação Técnica)';
  };
  sampleDocument: ResumeDocument;
}

export interface PDFExportConfig {
  paperSize: 'A4';
  widthMm: 210;
  heightMm: 297;
  includeCropMarks: boolean;
  colorProfile: 'RGB-Screen' | 'Print-HighContrast';
  fileName: string;
}

export interface EditorialAISuggestion {
  fieldPath: string;
  originalText: string;
  suggestedText: string;
  rationale: string;
  category: 'clareza' | 'impacto-mensuravel' | 'concisao' | 'verbos-acao';
}

export interface WorkspacePreferences {
  selectedTemplateId: ResumeTemplateId;
  candidateGoal?: 'primeiro-emprego' | 'estagio' | 'recolocacao' | 'transicao-carreira';
  candidateNameDraft?: string;
  candidateRoleDraft?: string;
  activeSectionId?: EditorSectionId;
  lastView?: 'landing' | 'editor';
  lastSavedAt: string;
}
