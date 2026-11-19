import {
  EducationLevel,
  EditorSectionId,
  LanguageProficiency,
  ResumeDocument,
} from '../../types/resume';

export interface EditorSectionMeta {
  id: EditorSectionId;
  number: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  editorialTip: string;
}

export const EDITOR_SECTIONS: EditorSectionMeta[] = [
  {
    id: 'dados-pessoais',
    number: '01',
    title: '01 — Dados pessoais',
    shortTitle: 'Dados pessoais',
    subtitle: 'Identificação, contato direto, links profissionais e foto opcional.',
    editorialTip:
      'Informe apenas dados essenciais de contato. Não é necessário incluir CPF, RG, estado civil ou endereço completo com CEP se preferir apenas Cidade e Estado.',
  },
  {
    id: 'objetivo',
    number: '02',
    title: '02 — Objetivo profissional',
    shortTitle: 'Objetivo',
    subtitle: 'Direcionamento claro do cargo ou área em que você deseja atuar.',
    editorialTip:
      'Um bom objetivo profissional é direto (1 a 2 frases): indique o cargo ou área pretendida, seu momento de carreira (ex.: primeiro emprego, estágio ou sênior) e como pretende contribuir.',
  },
  {
    id: 'resumo',
    number: '03',
    title: '03 — Resumo profissional',
    shortTitle: 'Resumo',
    subtitle: 'Síntese da sua trajetória, qualificações e principais competências.',
    editorialTip:
      'Apresente em um parágrafo curto sua experiência acumulada (ou foco acadêmico), suas principais ferramentas de domínio e um resultado ou diferencial relevante.',
  },
  {
    id: 'experiencia',
    number: '04',
    title: '04 — Experiência profissional',
    shortTitle: 'Experiência',
    subtitle: 'Histórico de atuação em empresas, projetos autônomos ou estágios.',
    editorialTip:
      'Ordene da experiência mais recente para a mais antiga. Caso esteja buscando o primeiro emprego, você pode deixar esta seção em branco sem qualquer prejuízo.',
  },
  {
    id: 'formacao',
    number: '05',
    title: '05 — Formação acadêmica',
    shortTitle: 'Formação',
    subtitle: 'Escolaridade, cursos técnicos, graduação e pós-graduação.',
    editorialTip:
      'Inclua a instituição, o nome do curso, o grau de formação e o período. Se ainda estiver estudando, marque a opção "Em andamento".',
  },
  {
    id: 'cursos',
    number: '06',
    title: '06 — Cursos e certificações',
    shortTitle: 'Cursos',
    subtitle: 'Qualificações complementares, certificações técnicas, oficinas e imersões.',
    editorialTip:
      'Destaque cursos relevantes para a vaga desejada. Para quem busca o primeiro emprego, esta seção ajuda a demonstrar iniciativa e preparo técnico.',
  },
  {
    id: 'habilidades',
    number: '07',
    title: '07 — Habilidades',
    shortTitle: 'Habilidades',
    subtitle: 'Competências técnicas, ferramentas, softwares e metodologias.',
    editorialTip:
      'Adicione habilidades específicas e verificáveis (ex.: Excel Avançado, TypeScript, Atendimento ao Cliente, AutoCAD, Gestão de Projetos).',
  },
  {
    id: 'idiomas',
    number: '08',
    title: '08 — Idiomas',
    shortTitle: 'Idiomas',
    subtitle: 'Línguas estrangeiras e nativas com nível real de proficiência.',
    editorialTip:
      'Seja transparente quanto ao seu nível atual (Básico, Intermediário, Avançado, Fluente ou Nativo).',
  },
  {
    id: 'adicionais',
    number: '09',
    title: '09 — Informações adicionais',
    shortTitle: 'Adicionais',
    subtitle: 'Projetos acadêmicos, trabalho voluntário, conquistas ou disponibilidade.',
    editorialTip:
      'Excelente espaço para mencionar projetos universitários, iniciação científica, ações voluntárias, premiações, CNH ou disponibilidade para mudança.',
  },
];

export const EDUCATION_LEVEL_OPTIONS: EducationLevel[] = [
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

export const LANGUAGE_PROFICIENCY_OPTIONS: LanguageProficiency[] = [
  'Básico',
  'Intermediário',
  'Avançado',
  'Fluente',
  'Nativo',
];

/**
 * Verifica se uma seção específica do currículo possui dados preenchidos
 */
export function isSectionFilled(doc: ResumeDocument, sectionId: EditorSectionId): boolean {
  const p = doc.personal;
  switch (sectionId) {
    case 'dados-pessoais':
      return Boolean(p.fullName.trim() || p.roleTitle.trim() || p.email.trim() || p.phone.trim());
    case 'objetivo':
      return Boolean(p.objective && p.objective.trim());
    case 'resumo':
      return Boolean(p.summary && p.summary.trim());
    case 'experiencia':
      return doc.experiences.length > 0 || Boolean(doc.metadata.isFirstJobMode);
    case 'formacao':
      return doc.education.length > 0;
    case 'cursos':
      return Boolean(doc.courses && doc.courses.length > 0);
    case 'habilidades':
      return Boolean(doc.skills && doc.skills.length > 0);
    case 'idiomas':
      return doc.languages.length > 0;
    case 'adicionais':
      return Boolean(doc.additionalNotes && doc.additionalNotes.trim());
    default:
      return false;
  }
}

/**
 * Validação não-bloqueante de e-mail
 */
export function validateEmailFormat(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return 'Verifique o formato do e-mail (exemplo: nome@dominio.com.br).';
  }
  return null;
}

/**
 * Validação não-bloqueante de telefone
 */
export function validatePhoneFormat(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return null;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 8) {
    return 'Informe um telefone com DDD (exemplo: (11) 98765-4321).';
  }
  return null;
}
