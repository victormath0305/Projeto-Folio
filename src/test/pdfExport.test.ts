import { describe, expect, it } from 'vitest';
import { TEMPLATE_CATALOG } from '../data/sampleResumes';
import { createEmptyResumeDocument } from '../services/storageService';
import { paginateResumeDocument } from '../services/paginationEngine';
import {
  generateResumePDF,
  sanitizeResumeFileName,
  validateResumeForExport,
} from '../services/pdfExportService';
import { ALL_TEMPLATE_IDS, ResumeDocument, ResumeTemplateId } from '../types/resume';

describe('FOLIO — Fases 03 e 04: Exportação PDF Vetorial e Paginação nos 5 Modelos Profissionais', () => {
  it('1. Verifica a existência e integridade dos 5 modelos no catálogo oficial', () => {
    expect(ALL_TEMPLATE_IDS).toEqual([
      'essencial',
      'editorial',
      'classico',
      'executivo',
      'tecnico',
    ]);
    expect(TEMPLATE_CATALOG).toHaveLength(5);

    const codes = TEMPLATE_CATALOG.map((t) => t.shortCode);
    expect(codes).toEqual(['M·01', 'M·02', 'M·03', 'M·04', 'M·05']);
  });

  it('2. Exporta um currículo básico em formato A4 (210 × 297 mm) com stream PDF vetorial válido', async () => {
    const doc = createEmptyResumeDocument('essencial');
    doc.personal.fullName = 'Camila Vasconcelos';
    doc.personal.roleTitle = 'Analista de Negócios Pleno';
    doc.personal.email = 'camila@vasconcelos.com.br';
    doc.personal.phone = '(11) 98877-6655';
    doc.personal.location = 'São Paulo, SP';
    doc.personal.summary =
      'Profissional com foco em mapeamento de processos e indicadores operacionais.';

    const artifact = await generateResumePDF(doc);

    expect(artifact.fileName).toBe('curriculo-Camila-Vasconcelos.pdf');
    expect(artifact.pageCount).toBe(1);
    expect(artifact.widthMm).toBe(210);
    expect(artifact.heightMm).toBe(297);
    expect(artifact.pdfBytes.byteLength).toBeGreaterThan(1000);

    const rawPdfString = new TextDecoder('latin1').decode(artifact.pdfBytes);
    expect(rawPdfString.startsWith('%PDF-')).toBe(true);
    expect(rawPdfString).toMatch(/\/MediaBox \[0 0 595\.2[78]\d* 841\.8[89]\d*\]/);
    expect(rawPdfString).toContain('(CAMILA VASCONCELOS) Tj');
    expect(rawPdfString).toContain('(Analista de Negócios Pleno) Tj');
    expect(artifact.fullExtractedText).toContain('Camila Vasconcelos');
    expect(artifact.fullExtractedText).toContain('Analista de Negócios Pleno');
  });

  it('3. Exporta currículo sem experiência profissional (Primeiro Emprego) nos 5 modelos sem erros e sem seção vazia', async () => {
    for (const templateId of ALL_TEMPLATE_IDS) {
      const doc = createEmptyResumeDocument(templateId);
      doc.metadata.isFirstJobMode = true;
      doc.personal.fullName = 'Mateus Oliveira';
      doc.personal.roleTitle = 'Estudante de Engenharia de Software';
      doc.personal.objective =
        'Busco oportunidade de estágio em desenvolvimento web frontend.';
      doc.education = [
        {
          id: 'edu-1',
          institution: 'Universidade de Brasília (UnB)',
          degree: 'Engenharia de Software',
          educationLevel: 'Bacharelado',
          startDate: '2024',
          isCurrent: true,
        },
      ];
      doc.skills = ['TypeScript', 'HTML5', 'CSS3', 'Git'];

      const artifact = await generateResumePDF(doc, templateId);
      expect(artifact.pageCount).toBe(1);
      expect(artifact.fullExtractedText).toContain('Mateus Oliveira');
      expect(artifact.fullExtractedText).toContain('Universidade de Brasília (UnB)');
      expect(artifact.fullExtractedText).not.toContain('EXPERIÊNCIA PROFISSIONAL');
      expect(artifact.fullExtractedText).not.toContain('TRAJETÓRIA EXECUTIVA');
    }
  });

  it('4. Exporta currículo completo com todas as 09 seções e foto nos 5 modelos (M·01 a M·05) com texto vetorial selecionável', async () => {
    const doc = createEmptyResumeDocument('essencial');
    doc.personal.fullName = 'Helena Vasconcelos';
    doc.personal.roleTitle = 'Diretora de Engenharia & Arquitetura Digital';
    doc.personal.location = 'São Paulo, SP';
    doc.personal.address = 'Jardim Paulista';
    doc.personal.email = 'helena@vasconcelos.dev.br';
    doc.personal.phone = '(11) 98412-3090';
    doc.personal.linkedin = 'linkedin.com/in/helenavasconcelos';
    doc.personal.portfolio = 'helenavasconcelos.dev';
    doc.personal.photoUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    doc.personal.objective =
      'Atuar na liderança executiva de engenharia de software e transformação tecnológica.';
    doc.personal.summary =
      'Arquiteta de sistemas com 12 anos de trajetória liderando plataformas críticas, governança técnica e equipes multidisciplinares.';
    doc.experiences = [
      {
        id: 'exp-1',
        company: 'Nexo Sistemas Financeiros',
        role: 'Diretora de Engenharia de Plataforma',
        location: 'São Paulo, SP',
        startDate: 'Mar 2022',
        isCurrent: true,
        description:
          'Liderou 45 engenheiros na modernização da arquitetura distribuída.\nReduziu o custo de infraestrutura em nuvem em 32% ao ano.',
      },
      {
        id: 'exp-2',
        company: 'Estúdio Vértice Digital',
        role: 'Tech Lead & Arquiteta Frontend',
        location: 'Curitiba, PR',
        startDate: 'Jan 2018',
        endDate: 'Fev 2022',
        isCurrent: false,
        description:
          'Implantou Design System corporativo e motor de relatórios PDF vetoriais.',
      },
    ];
    doc.education = [
      {
        id: 'edu-1',
        institution: 'UNICAMP',
        degree: 'Ciência da Computação',
        educationLevel: 'Mestrado',
        startDate: '2016',
        endDate: '2018',
      },
      {
        id: 'edu-2',
        institution: 'USP',
        degree: 'Engenharia de Computação',
        educationLevel: 'Bacharelado',
        startDate: '2011',
        endDate: '2015',
      },
    ];
    doc.courses = [
      {
        id: 'c-1',
        name: 'Arquitetura de Sistemas Distribuídos em Alta Escala',
        institution: 'MIT Professional Education',
        completionYear: '2024',
        workload: '80h',
      },
    ];
    doc.skills = [
      'TypeScript',
      'Arquitetura de Software',
      'Gestão de Engenharia',
      'Sistemas Distribuídos',
      'Design Systems',
    ];
    doc.languages = [
      { id: 'l-1', language: 'Português', proficiency: 'Nativo' },
      { id: 'l-2', language: 'Inglês', proficiency: 'Fluente' },
    ];
    doc.additionalNotes =
      'Palestrante internacional e autora de artigos sobre engenharia de software.';

    const scratchDir =
      'C:\\Users\\victo\\.gemini\\antigravity\\brain\\40d49914-77b8-4489-bee5-0b67210e0435\\scratch';
    const loadNodeFs = new Function('return import("node:fs")') as () => Promise<{
      mkdirSync: (p: string, opts: { recursive: boolean }) => void;
      writeFileSync: (p: string, data: Uint8Array) => void;
    }>;
    const nodeFs = await loadNodeFs().catch(() => null);
    if (nodeFs) {
      nodeFs.mkdirSync(scratchDir, { recursive: true });
    }

    for (const tpl of ALL_TEMPLATE_IDS) {
      const artifact = await generateResumePDF(doc, tpl);
      expect(artifact.templateId).toBe(tpl);
      expect(artifact.pageCount).toBe(1);
      expect(artifact.widthMm).toBe(210);
      expect(artifact.heightMm).toBe(297);

      const rawPdf = new TextDecoder('latin1').decode(artifact.pdfBytes);
      expect(rawPdf).toContain('Tj');
      expect(artifact.fullExtractedText).toContain('Helena Vasconcelos');
      expect(artifact.fullExtractedText).toContain('Nexo Sistemas Financeiros');
      expect(artifact.fullExtractedText).toContain('UNICAMP');
      expect(artifact.fullExtractedText).toContain('TypeScript');
      expect(artifact.fullExtractedText).toContain('PÁG. 01 / 01');

      // Também gera e salva o PDF do catálogo oficial de cada modelo para inspeção visual
      const catalogEntry = TEMPLATE_CATALOG.find((c) => c.id === tpl)!;
      const sampleArtifact = await generateResumePDF(
        catalogEntry.sampleDocument,
        tpl
      );
      if (nodeFs) {
        nodeFs.writeFileSync(
          `${scratchDir}\\sample-${tpl}.pdf`,
          sampleArtifact.pdfBytes
        );
      }
    }
  });

  it('5. Pagina automaticamente currículos extensos em múltiplas páginas A4 nos 5 modelos sem páginas vazias e sem cortes', async () => {
    const baseDoc: ResumeDocument = createEmptyResumeDocument('essencial');
    baseDoc.personal.fullName = 'Dr. Carlos Eduardo Meirelles';
    baseDoc.personal.roleTitle = 'Diretor de Operações e Engenharia Industrial';
    baseDoc.personal.email = 'carlos.meirelles@industria.com.br';
    baseDoc.personal.phone = '(11) 99988-7766';
    baseDoc.personal.location = 'Campinas, SP';
    baseDoc.personal.objective =
      'Atuar na diretoria de operações industriais e transformação logística na América Latina.';
    baseDoc.personal.summary =
      'Executivo com 18 anos de trajetória liderando plantas fabris de grande porte, programas Lean Six Sigma e modernização de cadeias de suprimentos.';

    baseDoc.experiences = Array.from({ length: 8 }).map((_, i) => ({
      id: `exp-long-${i + 1}`,
      company: `Complexo Industrial Alfa ${i + 1}`,
      role: `Gerente Sênior de Planta Industrial Nível ${i + 1}`,
      location: 'Campinas, SP',
      startDate: `Jan ${2015 + i}`,
      endDate: `Dez ${2016 + i}`,
      isCurrent: false,
      description: [
        `Liderou operação com 240 colaboradores diretos e orçamento anual de R$ ${20 + i * 5} milhões.`,
        `Implementou automação de linha de montagem reduzindo o índice de refugo em ${12 + i}%.`,
        `Conduziu auditorias internacionais ISO 9001 e ISO 14001 com zero não-conformidades críticas.`,
        `Reestruturou contratos logísticos gerando economia recorrente no transporte rodoviário.`,
      ].join('\n'),
    }));

    baseDoc.education = [
      {
        id: 'edu-long-1',
        institution: 'UNICAMP',
        degree: 'Engenharia Mecânica',
        educationLevel: 'Mestrado',
        startDate: '2012',
        endDate: '2014',
      },
      {
        id: 'edu-long-2',
        institution: 'USP',
        degree: 'Engenharia Mecânica',
        educationLevel: 'Bacharelado',
        startDate: '2006',
        endDate: '2010',
      },
    ];
    baseDoc.courses = [
      {
        id: 'c-long-1',
        name: 'Master Black Belt Lean Six Sigma',
        institution: 'Fundação Vanzolini',
        completionYear: '2019',
        workload: '120h',
      },
    ];
    baseDoc.skills = ['Lean Manufacturing', 'SAP S/4HANA', 'Gestão de P&L', 'ISO 9001'];
    baseDoc.languages = [{ id: 'l-long-1', language: 'Inglês', proficiency: 'Fluente' }];
    baseDoc.additionalNotes = 'Conselheiro consultivo da Associação Brasileira de Engenharia.';

    const templates: ResumeTemplateId[] = [
      'essencial',
      'editorial',
      'classico',
      'executivo',
      'tecnico',
    ];

    for (const tpl of templates) {
      const pages = paginateResumeDocument(baseDoc, tpl);
      expect(pages.length).toBeGreaterThanOrEqual(2);

      const artifact = await generateResumePDF(baseDoc, tpl);
      expect(artifact.pageCount).toBe(pages.length);
      expect(artifact.pageCount).toBeGreaterThanOrEqual(2);

      // Ausência de páginas vazias
      artifact.extractedTextByPage.forEach((pageText, idx) => {
        expect(pageText.trim().length).toBeGreaterThan(50);
        expect(pageText).toContain(
          `PÁG. ${String(idx + 1).padStart(2, '0')} / ${String(artifact.pageCount).padStart(2, '0')}`
        );
      });

      // Integridade de todas as 8 experiências e seções finais (incluindo idiomas e cursos)
      for (let i = 1; i <= 8; i++) {
        expect(artifact.fullExtractedText).toContain(`Complexo Industrial Alfa ${i}`);
      }
      expect(artifact.fullExtractedText).toContain('Master Black Belt Lean Six Sigma');
      expect(artifact.fullExtractedText).toContain('Inglês');
    }
  });

  it('6. Sanitiza corretamente nomes de arquivos com acentos e caracteres especiais e valida documentos vazios', () => {
    expect(sanitizeResumeFileName('João da Silva Júnior')).toBe(
      'curriculo-Joao-da-Silva-Junior.pdf'
    );
    expect(sanitizeResumeFileName('  Maria / Conceição : Dev* ? " <> |  ')).toBe(
      'curriculo-Maria-Conceicao-Dev.pdf'
    );
    expect(sanitizeResumeFileName('')).toBe('curriculo-Profissional.pdf');

    const emptyDoc = createEmptyResumeDocument('executivo');
    expect(validateResumeForExport(emptyDoc).canExport).toBe(false);
  });
});
