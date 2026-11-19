import { ResumeDocument, TemplateCatalogEntry } from '../types/resume';

/**
 * Documento principal exibido na Hero Section (Folha A4 de Demonstração)
 */
export const HERO_SPECIMEN_RESUME: ResumeDocument = {
  metadata: {
    id: 'specimen-hero-01',
    templateId: 'editorial',
    updatedAt: '2026-11-18',
    locale: 'pt-BR',
    paperFormat: 'A4',
    marginsMm: 18,
  },
  personal: {
    fullName: 'Helena Vasconcelos',
    roleTitle: 'Arquiteta de Software & Sistemas Digitais',
    seniorityLabel: '8 anos de trajetória · São Paulo, SP',
    location: 'São Paulo, SP — Brasil',
    email: 'helena@vasconcelos.dev.br',
    phone: '+55 (11) 98412-3090',
    portfolioOrLinkedin: 'helenavasconcelos.dev',
    summary:
      'Especialista na construção de plataformas críticas de alta disponibilidade e sistemas de design escaláveis. Liderou a modernização de arquiteturas web para mais de 4 milhões de usuários ativos mensais no setor financeiro e educacional.',
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'Nexo Sistemas Financeiros',
      role: 'Engenheira de Software Principal (Frontend & Plataforma)',
      period: 'Mar 2023 — Atual',
      location: 'São Paulo, SP',
      highlights: [
        'Redesenhou a arquitetura de fundação em React e TypeScript, reduzindo o tempo de carregamento inicial (LCP) em 41% em conexões móveis.',
        'Coordenou a especificação de acessibilidade WCAG 2.1 AA em 48 componentes reutilizáveis adotados por 6 squads de produto.',
        'Mentoria técnica direta para 9 desenvolvedores plenos e juniores em práticas de testes automatizados e revisão de código.',
      ],
    },
    {
      id: 'exp-2',
      company: 'Estúdio Vértice Digital',
      role: 'Desenvolvedora Frontend Sênior',
      period: 'Jan 2020 — Fev 2023',
      location: 'Remoto · Curitiba, PR',
      highlights: [
        'Liderou o desenvolvimento de plataformas editoriais e ferramentas de publicação digital para instituições culturais e editoras independentes.',
        'Implementou motor de geração de relatórios em PDF client-side com fidelidade tipográfica milimétrica.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Universidade Estadual de Campinas (UNICAMP)',
      degree: 'Bacharelado em Ciência da Computação',
      period: '2015 — 2018',
      details: 'Pesquisa de iniciação científica em Interfaces Humano-Computador e Tipografia Digital.',
    },
  ],
  skillGroups: [
    {
      id: 'sk-1',
      category: 'Arquitetura & Engenharia',
      skills: ['TypeScript', 'React', 'Next.js', 'Sistemas Distribuídos', 'Performance Web', 'Testes Automatizados'],
    },
    {
      id: 'sk-2',
      category: 'Design & Produto',
      skills: ['Design Systems', 'Acessibilidade (WCAG)', 'Tipografia Digital', 'Liderança Técnica'],
    },
  ],
  languages: [
    { id: 'lang-1', language: 'Português', proficiency: 'Nativo' },
    { id: 'lang-2', language: 'Inglês', proficiency: 'Fluente (C1)' },
    { id: 'lang-3', language: 'Espanhol', proficiency: 'Avançado (B2)' },
  ],
};

/**
 * Catálogo Oficial dos 5 Modelos Profissionais do FOLIO (Fase 04):
 * M·01 — ESSENCIAL
 * M·02 — EDITORIAL
 * M·03 — CLÁSSICO
 * M·04 — EXECUTIVO
 * M·05 — TÉCNICO
 */
export const TEMPLATE_CATALOG: TemplateCatalogEntry[] = [
  {
    id: 'essencial',
    shortCode: 'M·01',
    code: 'MATRIZ 01 / SÉRIE SUÍÇA',
    seriesName: 'Série Suíça · Grade Linear',
    name: 'ESSENCIAL',
    tagline: 'Minimalista, direto e profissional.',
    description:
      'Construído sobre uma grade suíça de coluna única com índice lateral limpo e fios divisórios precisos. Prioriza leitura linear imediata por recrutadores e sistemas automatizados de triagem (ATS).',
    recommendedProfile: 'Profissionais que buscam objetividade e compatibilidade com ATS.',
    idealFor: ['Triagem via ATS', 'Primeiro Emprego & Estágio', 'Corporativo & Administrativo'],
    structuralHighlight: 'Fluxo de uma coluna com rótulos de seção à esquerda e datas tabuladas à direita.',
    atsGuidance:
      'Priorizado para sistemas ATS: ordem de leitura 100% linear de cima para baixo, títulos convencionais e ausência de colunas paralelas.',
    typographicPairing: {
      heading: 'Plus Jakarta Sans SemiBold',
      body: 'Plus Jakarta Sans Regular',
      scale: '9.5pt / 16pt (Linear Suíça)',
    },
    layoutSpecs: {
      columns: '1 Coluna Linear com Índice Lateral (20% / 80%)',
      density: 'Alta',
      atsCompatibility: 'Prioridade ATS (Fluxo Linear)',
    },
    sampleDocument: {
      metadata: {
        id: 'sample-essencial',
        templateId: 'essencial',
        updatedAt: '2026-11-18',
        locale: 'pt-BR',
        paperFormat: 'A4',
        marginsMm: 16,
      },
      personal: {
        fullName: 'Lucas Andrade Rocha',
        roleTitle: 'Analista de Dados & Engenharia de Analytics',
        seniorityLabel: 'Pleno · Belo Horizonte, MG',
        location: 'Belo Horizonte, MG',
        email: 'lucas.rocha@email.com.br',
        phone: '+55 (31) 99124-8810',
        portfolioOrLinkedin: 'github.com/lucasrocha-dados',
        summary:
          'Profissional de Dados com 4 anos de atuação na modelagem de indicadores operacionais, automação de pipelines SQL/Python e construção de painéis executivos para tomada de decisão em logística e varejo.',
      },
      experiences: [
        {
          id: 'ess-exp-1',
          company: 'ViaLogística Brasil S.A.',
          role: 'Analista de Business Intelligence Pleno',
          period: 'Abr 2024 — Atual',
          location: 'Belo Horizonte, MG',
          highlights: [
            'Automatizou pipelines diários em Python e dbt, reduzindo o tempo de atualização dos relatórios de frota de 4 horas para 18 minutos.',
            'Estruturou matriz de indicadores de eficiência de entregas em 14 centros de distribuição, apoiando redução de 12% em custos de rota.',
          ],
        },
        {
          id: 'ess-exp-2',
          company: 'Grupo Horizonte Varejo',
          role: 'Analista de Dados Júnior (Efetivado após Estágio)',
          period: 'Fev 2022 — Mar 2024',
          location: 'Belo Horizonte, MG',
          highlights: [
            'Desenvolveu consultas otimizadas em PostgreSQL e BigQuery para acompanhamento de estoque e previsão de demanda sazonal.',
            'Padronizou a documentação de métricas financeiras junto às equipes de controladoria e operações.',
          ],
        },
      ],
      education: [
        {
          id: 'ess-edu-1',
          institution: 'Universidade Federal de Minas Gerais (UFMG)',
          degree: 'Bacharelado em Engenharia de Produção',
          period: '2018 — 2022',
          details: 'Monitor de Estatística Aplicada e Pesquisa Operacional.',
        },
      ],
      skillGroups: [
        {
          id: 'ess-sk-1',
          category: 'Tecnologias',
          skills: ['SQL (PostgreSQL / BigQuery)', 'Python (Pandas)', 'dbt', 'Power BI', 'Git', 'Modelagem Dimensional'],
        },
        {
          id: 'ess-sk-2',
          category: 'Negócios',
          skills: ['Indicadores (KPIs)', 'Análise de Coorte', 'Automação de Processos', 'Estatística Descritiva'],
        },
      ],
      languages: [
        { id: 'ess-lang-1', language: 'Português', proficiency: 'Nativo' },
        { id: 'ess-lang-2', language: 'Inglês', proficiency: 'Avançado' },
      ],
    },
  },
  {
    id: 'editorial',
    shortCode: 'M·02',
    code: 'MATRIZ 02 / SÉRIE LAUDA',
    seriesName: 'Série Lauda · Assimétrica',
    name: 'EDITORIAL',
    tagline: 'Personalidade tipográfica e composição diferenciada.',
    description:
      'Inspirado em publicações impressas contemporâneas. Combina títulos expressivos em serifa editorial com uma coluna lateral técnica para metadados, competências e formação. Projetado para destacar autoria e repertório.',
    recommendedProfile: 'Profissionais de comunicação, marketing, design e áreas criativas.',
    idealFor: ['Design, Arquitetura & Criação', 'Comunicação & Marketing', 'Produto & UX'],
    structuralHighlight: 'Composição assimétrica em duas colunas (68% narrativa / 32% ficha lateral) com marcadores em vermelho editorial.',
    atsGuidance:
      'Mantém texto 100% selecionável e títulos semânticos claros em duas colunas. Para candidaturas em portais corporativos rígidos, considere comparar com o modelo Essencial.',
    typographicPairing: {
      heading: 'Instrument Serif Regular & Italic',
      body: 'Plus Jakarta Sans Regular',
      scale: '10pt / 22pt (Contraste Editorial)',
    },
    layoutSpecs: {
      columns: '2 Colunas Assimétricas (68% / 32%)',
      density: 'Equilibrada',
      atsCompatibility: 'Alta (Duas Colunas Semânticas)',
    },
    sampleDocument: {
      metadata: {
        id: 'sample-editorial',
        templateId: 'editorial',
        updatedAt: '2026-11-18',
        locale: 'pt-BR',
        paperFormat: 'A4',
        marginsMm: 18,
      },
      personal: {
        fullName: 'Marina Albuquerque',
        roleTitle: 'Product Designer Sênior & Diretora de Arte',
        seniorityLabel: '7 anos de experiência · Rio de Janeiro, RJ',
        location: 'Rio de Janeiro, RJ',
        email: 'marina@albuquerque.design',
        phone: '+55 (21) 99602-4418',
        portfolioOrLinkedin: 'marinaalbuquerque.design',
        summary:
          'Designer de produto com formação editorial e foco em sistemas de interface claros, acessíveis e centrados na leitura humana. Une pesquisa qualitativa, direção tipográfica e prototipagem de alta fidelidade.',
      },
      experiences: [
        {
          id: 'ed-exp-1',
          company: 'Plural Educação & Cultura',
          role: 'Lead Product Designer',
          period: 'Jan 2023 — Atual',
          location: 'Rio de Janeiro, RJ',
          highlights: [
            'Liderou a reformulação completa da experiência de leitura digital para 680 mil estudantes, elevando a retenção semanal em 29%.',
            'Criou e documentou o Design System multiplataforma em parceria direta com a engenharia frontend.',
          ],
        },
        {
          id: 'ed-exp-2',
          company: 'Ateliê Gráfico Guanabara',
          role: 'UX/UI Designer & Diretora de Arte Digital',
          period: 'Ago 2019 — Dez 2022',
          location: 'Rio de Janeiro, RJ',
          highlights: [
            'Conduziu projetos de identidade digital, arquitetura de informação e testes de usabilidade para 18 clientes nacionais.',
            'Premiada na Bienal Brasileira de Design Gráfico na categoria Publicações Digitais Independentes.',
          ],
        },
      ],
      education: [
        {
          id: 'ed-edu-1',
          institution: 'ESDI — Universidade do Estado do Rio de Janeiro (UERJ)',
          degree: 'Bacharelado em Desenho Industrial / Programação Visual',
          period: '2015 — 2019',
        },
      ],
      skillGroups: [
        {
          id: 'ed-sk-1',
          category: 'Especialidades',
          skills: ['Product Design', 'Sistemas Tipográficos', 'Pesquisa com Usuários', 'Design Systems', 'Acessibilidade Web'],
        },
        {
          id: 'ed-sk-2',
          category: 'Ferramentas',
          skills: ['Figma', 'HTML / CSS Semântico', 'Prototipagem Interativa', 'InDesign'],
        },
      ],
      languages: [
        { id: 'ed-lang-1', language: 'Português', proficiency: 'Nativo' },
        { id: 'ed-lang-2', language: 'Inglês', proficiency: 'Fluente' },
        { id: 'ed-lang-3', language: 'Francês', proficiency: 'Intermediário' },
      ],
    },
  },
  {
    id: 'classico',
    shortCode: 'M·03',
    code: 'MATRIZ 03 / SÉRIE CÁTEDRA',
    seriesName: 'Série Cátedra · Simetria Formal',
    name: 'CLÁSSICO',
    tagline: 'Tradicional e organizado.',
    description:
      'Estrutura canônica com cabeçalho equilibrado, divisores horizontais sóbrios e hierarquia cronológica rigorosa. Transmite solidez institucional para áreas jurídicas, financeiras, acadêmicas, administrativas e saúde.',
    recommendedProfile: 'Profissionais que preferem currículos tradicionais e formais.',
    idealFor: ['Jurídico & Finanças', 'Saúde & Educação', 'Administração & Setor Público'],
    structuralHighlight: 'Cabeçalho simétrico centralizado e títulos de seção formais com fios horizontais integrais.',
    atsGuidance:
      'Ordem cronológica tradicional em coluna única, amplamente reconhecida por leitores humanos e softwares de recrutamento.',
    typographicPairing: {
      heading: 'Newsreader Medium & Serif Caps',
      body: 'Plus Jakarta Sans Regular',
      scale: '10pt / 17pt (Proporção Clássica)',
    },
    layoutSpecs: {
      columns: '1 Coluna Clássica com Cabeçalho Centralizado',
      density: 'Clássica',
      atsCompatibility: 'Alta (Ordem Cronológica)',
    },
    sampleDocument: {
      metadata: {
        id: 'sample-classico',
        templateId: 'classico',
        updatedAt: '2026-11-18',
        locale: 'pt-BR',
        paperFormat: 'A4',
        marginsMm: 20,
      },
      personal: {
        fullName: 'Rafael Monteiro Cavalcanti',
        roleTitle: 'Coordenador de Operações & Governança Corporativa',
        seniorityLabel: '10 anos de experiência · Porto Alegre, RS',
        location: 'Porto Alegre, RS',
        email: 'rafael.cavalcanti@email.com.br',
        phone: '+55 (51) 99811-2045',
        portfolioOrLinkedin: 'linkedin.com/in/rafaelmonteiro-gestao',
        summary:
          'Profissional com sólida trajetória na estruturação de processos corporativos, governança de contratos e coordenação de equipes multidisciplinares no setor industrial e de serviços de saúde.',
      },
      experiences: [
        {
          id: 'cl-exp-1',
          company: 'Instituto Sul-Brasileiro de Gestão Hospitalar',
          role: 'Coordenador de Planejamento e Operações',
          period: 'Mai 2021 — Atual',
          location: 'Porto Alegre, RS',
          highlights: [
            'Coordena orçamento anual de R$ 28 milhões e equipe de 35 profissionais distribuídos em três unidades operacionais.',
            'Reduziu o tempo médio de homologação de fornecedores em 34% por meio da revisão normativa de processos internos.',
          ],
        },
        {
          id: 'cl-exp-2',
          company: 'Metalúrgica Meridional S.A.',
          role: 'Analista Sênior de Processos e Qualidade (ISO 9001)',
          period: 'Mar 2017 — Abr 2021',
          location: 'Caxias do Sul, RS',
          highlights: [
            'Conduziu auditorias internas de conformidade e programas de melhoria contínua em quatro linhas fabris.',
            'Elaborou relatórios mensais para o conselho diretor com foco em redução de desperdício e segurança operacional.',
          ],
        },
      ],
      education: [
        {
          id: 'cl-edu-1',
          institution: 'Fundação Getulio Vargas (FGV)',
          degree: 'MBA em Gestão Empresarial e Governança Corporativa',
          period: '2019 — 2021',
        },
        {
          id: 'cl-edu-2',
          institution: 'Universidade Federal do Rio Grande do Sul (UFRGS)',
          degree: 'Bacharelado em Administração',
          period: '2012 — 2016',
        },
      ],
      skillGroups: [
        {
          id: 'cl-sk-1',
          category: 'Competências de Gestão',
          skills: ['Planejamento Estratégico', 'Gestão Orçamentária', 'Governança & Compliance', 'ISO 9001', 'Negociação de Contratos'],
        },
      ],
      languages: [
        { id: 'cl-lang-1', language: 'Português', proficiency: 'Nativo' },
        { id: 'cl-lang-2', language: 'Inglês', proficiency: 'Avançado' },
        { id: 'cl-lang-3', language: 'Espanhol', proficiency: 'Fluente' },
      ],
    },
  },
  {
    id: 'executivo',
    shortCode: 'M·04',
    code: 'MATRIZ 04 / SÉRIE CONSELHO',
    seriesName: 'Série Conselho · Liderança',
    name: 'EXECUTIVO',
    tagline: 'Autoridade, síntese estratégica e foco em resultados.',
    description:
      'Desenvolvido para lideranças e profissionais seniores. Apresenta cabeçalho arquitetônico de forte presença, quadro emoldurado de síntese executiva, competências-chave de gestão no topo e histórico orientado a realizações.',
    recommendedProfile: 'Gestores, coordenadores, supervisores, diretores e profissionais experientes.',
    idealFor: ['Diretoria, Gerência & Coordenação', 'Gestão de Projetos & P&L', 'Transição Executiva & Consultoria'],
    structuralHighlight: 'Cabeçalho com barra superior espessa, quadro de Síntese Executiva emoldurado e faixa de competências de liderança antes da trajetória.',
    atsGuidance:
      'Estrutura de coluna única com títulos padronizados e ênfase em síntese executiva e resultados quantificáveis.',
    typographicPairing: {
      heading: 'Instrument Serif & Plus Jakarta Sans Bold',
      body: 'Plus Jakarta Sans Regular',
      scale: '9.5pt / 20pt (Dossiê Executivo)',
    },
    layoutSpecs: {
      columns: '1 Coluna Executiva + Rodapé Acadêmico em 2 Colunas',
      density: 'Executiva',
      atsCompatibility: 'Alta (Dossiê Executivo)',
    },
    sampleDocument: {
      metadata: {
        id: 'sample-executivo',
        templateId: 'executivo',
        updatedAt: '2026-11-18',
        locale: 'pt-BR',
        paperFormat: 'A4',
        marginsMm: 18,
      },
      personal: {
        fullName: 'Henrique Bastos Meirelles',
        roleTitle: 'Diretor de Operações & Planejamento Estratégico',
        seniorityLabel: '15 anos de liderança · São Paulo, SP',
        location: 'São Paulo, SP',
        email: 'henrique@meirelles.exec.br',
        phone: '+55 (11) 99401-7720',
        portfolioOrLinkedin: 'linkedin.com/in/henriquemeirelles',
        objective: 'Diretoria de Operações (COO) ou Unidade de Negócios em empresas de médio e grande porte.',
        summary:
          'Executivo com 15 anos de experiência na condução de operações B2B, reestruturação de eficiência operacional e gestão de P&L acima de R$ 180 milhões anuais. Histórico comprovado em expansão regional, fusões operacionais e formação de lideranças de alta performance.',
      },
      experiences: [
        {
          id: 'ex-exp-1',
          company: 'Grupo Vanguarda Logística & Suprimentos',
          role: 'Diretor de Operações Regionais',
          period: 'Jan 2022 — Atual',
          location: 'São Paulo, SP',
          highlights: [
            'Lidera operação integrada com 420 colaboradores diretos e indiretos em 6 estados, elevando a margem EBITDA da divisão de 14% para 21% em dois exercícios.',
            'Conduziu a transformação digital da malha de distribuição, reduzindo o custo operacional logístico em R$ 14,5 milhões ao ano.',
          ],
        },
        {
          id: 'ex-exp-2',
          company: 'Aliança Industrial Brasileira S.A.',
          role: 'Gerente Sênior de Planejamento e Eficiência Operacional',
          period: 'Mar 2017 — Dez 2021',
          location: 'Campinas, SP',
          highlights: [
            'Implantou governança de indicadores S&OP e gestão matricial de despesas em três unidades industriais.',
            'Coordenou programa de sucessão e desenvolvimento gerencial para 24 supervisores e coordenadores.',
          ],
        },
      ],
      education: [
        {
          id: 'ex-edu-1',
          institution: 'Insper — Instituto de Ensino e Pesquisa',
          degree: 'Executive MBA em Finanças e Estratégia Corporativa',
          period: '2018 — 2020',
        },
        {
          id: 'ex-edu-2',
          institution: 'Escola Politécnica da USP',
          degree: 'Bacharelado em Engenharia Mecânica',
          period: '2007 — 2011',
        },
      ],
      skills: [
        'Gestão de P&L',
        'Planejamento Estratégico (S&OP)',
        'Eficiência Operacional',
        'Liderança de Equipes',
        'Governança Corporativa',
        'Negociação Executiva',
      ],
      skillGroups: [],
      languages: [
        { id: 'ex-lang-1', language: 'Português', proficiency: 'Nativo' },
        { id: 'ex-lang-2', language: 'Inglês', proficiency: 'Fluente' },
        { id: 'ex-lang-3', language: 'Espanhol', proficiency: 'Avançado' },
      ],
    },
  },
  {
    id: 'tecnico',
    shortCode: 'M·05',
    code: 'MATRIZ 05 / SÉRIE ENGENHARIA',
    seriesName: 'Série Engenharia · Modular',
    name: 'TÉCNICO',
    tagline: 'Hierarquia estruturada com foco em competências e certificações.',
    description:
      'Projetado como uma folha de especificação técnica de alta precisão. Posiciona a matriz de ferramentas, tecnologias, certificações e idiomas em destaque logo após o perfil, facilitando a avaliação técnica rápida.',
    recommendedProfile: 'Profissionais de tecnologia, engenharia, indústria, manutenção e áreas acadêmicas.',
    idealFor: ['Engenharia, Tecnologia & TI', 'Indústria, Manutenção & Qualidade', 'Pesquisa & Área Acadêmica'],
    structuralHighlight: 'Cabeçalho em tabela técnica modular e Matriz de Competências, Ferramentas e Certificações posicionada no topo.',
    atsGuidance:
      'Excelente indexação de palavras-chave técnicas, ferramentas, normas (ISO/NR) e certificações logo na metade superior da primeira página.',
    typographicPairing: {
      heading: 'Plus Jakarta Sans Bold & JetBrains Mono',
      body: 'Plus Jakarta Sans Regular',
      scale: '9pt / 15pt (Grade Modular Técnica)',
    },
    layoutSpecs: {
      columns: 'Grade Modular Técnica com Matriz de Competências Superior',
      density: 'Estruturada',
      atsCompatibility: 'Alta (Indexação Técnica)',
    },
    sampleDocument: {
      metadata: {
        id: 'sample-tecnico',
        templateId: 'tecnico',
        updatedAt: '2026-11-18',
        locale: 'pt-BR',
        paperFormat: 'A4',
        marginsMm: 16,
      },
      personal: {
        fullName: 'Camila Nogueira Santos',
        roleTitle: 'Engenheira de Automação Industrial & Confiabilidade',
        seniorityLabel: 'Sênior · Joinville, SC',
        location: 'Joinville, SC',
        email: 'camila.santos@engenharia.ind.br',
        phone: '+55 (47) 99218-6040',
        portfolioOrLinkedin: 'linkedin.com/in/camilanogueira-automacao',
        summary:
          'Engenheira de Automação com 8 anos de atuação em projetos de modernização de plantas industriais, programação de CLPs, redes industriais, manutenção preditiva e adequação de segurança de máquinas (NR-12).',
      },
      experiences: [
        {
          id: 'tec-exp-1',
          company: 'SulMecânica Sistemas Industriais S.A.',
          role: 'Engenheira de Automação e Manutenção Sênior',
          period: 'Fev 2022 — Atual',
          location: 'Joinville, SC',
          highlights: [
            'Liderou o comissionamento de 4 células robotizadas com CLPs Siemens S7-1500 e supervisório SCADA, aumentando o OEE da linha em 19%.',
            'Implementou plano de manutenção preditiva por análise de vibração e termografia, reduzindo paradas não programadas em 38%.',
          ],
        },
        {
          id: 'tec-exp-2',
          company: 'EletroPolo Automação & Controle',
          role: 'Engenheira de Projetos de Automação Pleno',
          period: 'Jan 2018 — Jan 2022',
          location: 'Curitiba, PR',
          highlights: [
            'Elaborou diagramas elétricos em EPLAN, especificação de instrumentação de campo e documentação técnica As-Built.',
            'Executou adequação técnica de painéis e intertravamentos de segurança conforme norma NR-12 e ISO 13849.',
          ],
        },
      ],
      education: [
        {
          id: 'tec-edu-1',
          institution: 'Universidade Tecnológica Federal do Paraná (UTFPR)',
          degree: 'Bacharelado em Engenharia de Controle e Automação',
          period: '2013 — 2017',
        },
      ],
      courses: [
        {
          id: 'tec-c-1',
          name: 'Segurança de Máquinas e Equipamentos — NR-12 &NR-10',
          institution: 'SENAI Santa Catarina',
          completionYear: '2024',
          workload: '60h',
        },
        {
          id: 'tec-c-2',
          name: 'Programação Avançada TIA Portal & Redes Profinet',
          institution: 'Siemens SITRAIN',
          completionYear: '2023',
          workload: '40h',
        },
      ],
      skills: [
        'CLP Siemens (TIA Portal)',
        'Rockwell Studio 5000',
        'Sistemas SCADA / IHM',
        'EPLAN Electric P8',
        'AutoCAD',
        'NR-12 / NR-10',
        'Manutenção Confiabilidade (RCM)',
        'Python / SQL Industrial',
      ],
      skillGroups: [],
      languages: [
        { id: 'tec-lang-1', language: 'Português', proficiency: 'Nativo' },
        { id: 'tec-lang-2', language: 'Inglês', proficiency: 'Avançado' },
        { id: 'tec-lang-3', language: 'Alemão', proficiency: 'Básico' },
      ],
      additionalNotes: 'Registro CREA-SC ativo. Disponibilidade para viagens técnicas.',
    },
  },
];
