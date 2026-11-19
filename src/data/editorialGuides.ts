import { PublicGuideSlug } from '../services/seoService';
import { ResumeTemplateId } from '../types/resume';

export interface GuideArticleBlock {
  index: string;
  heading: string;
  paragraphs: string[];
  bullets?: { label: string; detail: string }[];
  callout?: { title: string; text: string };
}

export interface EditorialGuideData {
  slug: Exclude<PublicGuideSlug, 'modelos-de-curriculo'>;
  issueNumber: string;
  kicker: string;
  h1Title: string;
  h1Highlight: string;
  lead: string;
  recommendedTemplateId: ResumeTemplateId;
  recommendedFirstJobMode?: boolean;
  ctaLabel: string;
  sections: GuideArticleBlock[];
  comparisonTable: {
    caption: string;
    leftHeader: string;
    rightHeader: string;
    rows: { left: string; right: string }[];
  };
  faqItems: { question: string; answer: string }[];
}

export const EDITORIAL_GUIDES: Record<
  Exclude<PublicGuideSlug, 'modelos-de-curriculo'>,
  EditorialGuideData
> = {
  'curriculo-primeiro-emprego': {
    slug: 'curriculo-primeiro-emprego',
    issueNumber: 'CADERNO EDITORIAL N° 01 · INÍCIO DE CARREIRA',
    kicker: 'GUIA PRÁTICO · PRIMEIRO EMPREGO, JOVEM APRENDIZ & ESTÁGIO',
    h1Title: 'Como estruturar um currículo para o',
    h1Highlight: 'primeiro emprego.',
    lead: 'Entrar no mercado de trabalho exige clareza, não invenção. Veja como organizar sua escolaridade, objetivo profissional, cursos e habilidades em uma folha A4 limpa e pronta para processos seletivos de estágio, jovem aprendiz ou vagas iniciais.',
    recommendedTemplateId: 'essencial',
    recommendedFirstJobMode: true,
    ctaLabel: 'Criar currículo de primeiro emprego grátis',
    sections: [
      {
        index: '§ 01',
        heading: 'O que os recrutadores realmente avaliam em candidatos iniciantes',
        paragraphs: [
          'Quando uma empresa abre vagas para jovem aprendiz, estágio ou auxiliar em início de carreira, o recrutador já sabe que os candidatos não possuem uma longa lista de empregos anteriores. O que está em avaliação é a sua capacidade de comunicação escrita, organização, pontualidade acadêmica e domínio de ferramentas básicas.',
          'Por isso, um currículo de uma única página A4, bem alinhado, sem erros de digitação e com informações de contato fáceis de localizar transmite imediatamente maturidade profissional.',
        ],
        callout: {
          title: 'Regra de Ouro do Primeiro Emprego',
          text: 'Nunca deixe a seção de Experiência Profissional com frases como “Não tenho experiência, mas tenho muita vontade de aprender”. No FOLIO, ao ativar o modo Primeiro Emprego, a seção de experiências é omitida automaticamente e o espaço nobre da folha é ocupado pela sua formação, cursos e competências.',
        },
      },
      {
        index: '§ 02',
        heading: 'Exemplos práticos de Objetivo Profissional para Primeiro Emprego',
        paragraphs: [
          'O objetivo profissional é a primeira leitura após o seu nome. Ele deve ter apenas uma ou duas frases indicando a área em que você deseja atuar e como sua formação atual apoia essa função.',
        ],
        bullets: [
          {
            label: 'Área Administrativa / Jovem Aprendiz',
            detail:
              '“Atuar como Jovem Aprendiz na área administrativa, aplicando conhecimentos de organização documental, atendimento e planilhas em Excel para apoiar a rotina da equipe.”',
          },
          {
            label: 'Estágio em Tecnologia / Desenvolvimento',
            detail:
              '“Busco oportunidade de Estágio em Desenvolvimento Web, utilizando fundamentos de lógica de programação, HTML, CSS, TypeScript e controle de versão com Git adquiridos em projetos acadêmicos.”',
          },
          {
            label: 'Atendimento, Comércio e Recepção',
            detail:
              '“Iniciar trajetória profissional na área de Atendimento ao Cliente e Recepção, contribuindo com comunicação clara, agilidade no registro de solicitações e facilidade com sistemas digitais.”',
          },
          {
            label: 'Logística e Operações',
            detail:
              '“Atuar como Auxiliar de Logística em início de carreira, colaborando no controle de estoque, conferência de mercadorias e organização de processos operacionais.”',
          },
        ],
      },
      {
        index: '§ 03',
        heading: 'Dados que você não precisa (e não deve) colocar no currículo',
        paragraphs: [
          'Padrões antigos de currículo exigiam documentos pessoais que hoje não são recomendados na primeira etapa de triagem por motivos de segurança e privacidade (LGPD).',
          'Informe apenas seu nome completo, cidade e estado (ou bairro), telefone com WhatsApp, e-mail profissional e link do LinkedIn ou portfólio. Dispense números de CPF, RG, título de eleitor, nome dos pais ou pretensão salarial não solicitada.',
        ],
      },
    ],
    comparisonTable: {
      caption: 'TABELA 01 — TRANSFORMAÇÃO DE REDAÇÃO PARA INICIANTES',
      leftHeader: 'Evite (Vago ou Informal)',
      rightHeader: 'Prefira (Claro e Objetivo na Folha A4)',
      rows: [
        {
          left: '“Qualquer vaga na empresa para ganhar experiência.”',
          right: '“Atuar como Auxiliar Administrativo ou Atendimento ao Cliente.”',
        },
        {
          left: '“Sei mexer bem em computador e internet.”',
          right: '“Domínio de Pacote Office (Word, Excel), Google Workspace e digitação ágil.”',
        },
        {
          left: '“Fiz alguns trabalhos na escola/faculdade.”',
          right: '“Desenvolvimento de projeto acadêmico de gestão de estoque em equipe (2025).”',
        },
      ],
    },
    faqItems: [
      {
        question: 'Qual o melhor modelo de currículo para primeiro emprego?',
        answer:
          'Recomendamos o modelo M·01 ESSENCIAL (Série Suíça). Ele possui estrutura linear de uma coluna, excelente aproveitamento para formação e cursos, e leitura imediata por plataformas de recrutamento (ATS).',
      },
      {
        question: 'Preciso colocar foto no currículo para primeiro emprego?',
        answer:
          'Na grande maioria das vagas no Brasil, a foto não é obrigatória. Só inclua foto se a descrição da vaga solicitar expressamente.',
      },
    ],
  },

  'curriculo-sem-experiencia': {
    slug: 'curriculo-sem-experiencia',
    issueNumber: 'CADERNO EDITORIAL N° 02 · REPERTÓRIO & COMPETÊNCIAS',
    kicker: 'ESTRATÉGIA DE CONTEÚDO · CURRÍCULO SEM EXPERIÊNCIA FORMAL',
    h1Title: 'O que colocar em um currículo',
    h1Highlight: 'sem experiência.',
    lead: 'Não ter registro formal em carteira de trabalho não significa ausência de repertório. Aprenda a documentar projetos práticos, atividades autônomas, cursos livres e ações voluntárias com rigor profissional.',
    recommendedTemplateId: 'essencial',
    recommendedFirstJobMode: true,
    ctaLabel: 'Montar currículo sem experiência em PDF',
    sections: [
      {
        index: '§ 01',
        heading: 'Diferença entre ausência de vínculo formal e ausência de vivência',
        paragraphs: [
          'Muitos candidatos — seja em transição de área, retorno ao mercado após dedicação aos estudos ou início de carreira — acreditam que só podem listar experiências com registro CLT. Na prática, recrutadores buscam evidências de que você sabe executar tarefas, cumprir prazos e resolver problemas.',
          'Projetos universitários ou técnicos, organização de eventos estudantis, trabalhos autônomos pontuais, apoio em negócios familiares e trabalho voluntário são fontes legítimas de competência prática.',
        ],
      },
      {
        index: '§ 02',
        heading: 'Seis elementos que substituem a experiência tradicional na lauda A4',
        paragraphs: [
          'Quando o currículo não possui histórico corporativo, as demais seções deixam de ser coadjuvantes e assumem o protagonismo visual do documento:',
        ],
        bullets: [
          {
            label: '01. Resumo de Qualificações Focado em Preparo',
            detail:
              'Utilize a seção 03 (Resumo profissional) para apresentar sua formação, horas de estudo prático e ferramentas que você já sabe operar no dia a dia.',
          },
          {
            label: '02. Cursos Livres e Certificações com Carga Horária',
            detail:
              'Cursos gratuitos ou técnicos (SENAI, SEBRAE, Fundação Bradesco, ENAP, plataformas de tecnologia) demonstram iniciativa contínua. Informe sempre a instituição e o ano de conclusão.',
          },
          {
            label: '03. Projetos Acadêmicos, TCC e Iniciação Científica',
            detail:
              'Descreva na seção 09 (Informações adicionais) projetos práticos que você construiu durante o curso técnico ou faculdade.',
          },
          {
            label: '04. Trabalho Voluntário e Ações Comunitárias',
            detail:
              'Atuação em ONGs, bibliotecas comunitárias, mutirões ou centros acadêmicos comprova trabalho em equipe, responsabilidade e comunicação.',
          },
          {
            label: '05. Habilidades Técnicas Específicas',
            detail:
              'Em vez de listar apenas adjetivos subjetivos (“proativo”, “dinâmico”), priorize ferramentas verificáveis: Excel, Canva, AutoCAD, atendimento via CRM, redação empresarial ou lógica de programação.',
          },
          {
            label: '06. Idiomas e Comunicação',
            detail:
              'Mesmo o nível básico ou intermediário de leitura técnica em inglês ou espanhol, ou conhecimento em Libras, agrega valor real a vagas operacionais e técnicas.',
          },
        ],
      },
    ],
    comparisonTable: {
      caption: 'TABELA 02 — COMO TRADUZIR VIVÊNCIAS EM QUALIFICAÇÕES PROFISSIONAIS',
      leftHeader: 'Vivência Real do Candidato',
      rightHeader: 'Como Descrever no Currículo FOLIO',
      rows: [
        {
          left: 'Ajudou no controle de vendas de pequeno comércio familiar.',
          right: 'Apoio em rotinas de atendimento ao cliente, controle de caixa e organização de estoque.',
        },
        {
          left: 'Participou da organização da semana acadêmica da faculdade.',
          right: 'Membro da comissão organizadora da Semana Acadêmica (credenciamento de 300 participantes).',
        },
        {
          left: 'Criou planilhas ou pequenos sites durante cursos online.',
          right: 'Desenvolvimento de projetos práticos de controle financeiro em Excel / aplicações web responsivas.',
        },
      ],
    },
    faqItems: [
      {
        question: 'Devo inventar experiências para preencher a folha?',
        answer:
          'Jamais. Informações inverídicas são facilmente identificadas em entrevistas técnicas ou checagens cadastrais. Um currículo enxuto, honesto e bem diagramado em 1 página A4 tem muito mais valor.',
      },
      {
        question: 'Como o FOLIO formata o currículo quando não preencho experiências?',
        answer:
          'O motor tipográfico do FOLIO remove automaticamente o título “Experiência Profissional” da folha A4 quando a lista está vazia, evitando espaços em branco e mantendo o documento equilibrado.',
      },
    ],
  },

  'como-fazer-um-curriculo': {
    slug: 'como-fazer-um-curriculo',
    issueNumber: 'CADERNO EDITORIAL N° 03 · MANUAL DE COMPOSIÇÃO',
    kicker: 'METODOLOGIA PASSO A PASSO · REDAÇÃO & ARQUITETURA DA INFORMAÇÃO',
    h1Title: 'Como fazer um currículo profissional',
    h1Highlight: 'passo a passo.',
    lead: 'Um currículo eficaz combina conteúdo bem redigido e hierarquia visual silenciosa. Conheça a anatomia completa das 9 seções de um documento profissional em padrão ISO 216 A4.',
    recommendedTemplateId: 'editorial',
    ctaLabel: 'Abrir editor e fazer meu currículo agora',
    sections: [
      {
        index: '§ 01',
        heading: 'A regra dos 10 segundos: como um currículo é lido',
        paragraphs: [
          'Antes de ler cada parágrafo com atenção, recrutadores e gestores fazem uma leitura dinâmica (scanning) que dura entre 6 e 15 segundos. Nessa primeira varredura, os olhos buscam quatro âncoras visuais: seu nome e cargo pretendido, sua experiência ou formação mais recente, as datas de atuação e suas competências técnicas.',
          'Se a página estiver poluída com gráficos de barras sem escala, ícones excessivos, fontes difíceis de ler ou blocos compactos de texto sem margem, a leitura é interrompida.',
        ],
      },
      {
        index: '§ 02',
        heading: 'Roteiro das 9 seções para fazer seu currículo online no FOLIO',
        paragraphs: [
          'Organizamos o editor do FOLIO na ordem lógica de construção de um documento editorial:',
        ],
        bullets: [
          {
            label: '01 — Dados Pessoais & 02 — Objetivo Profissional',
            detail:
              'Cabeçalho limpo com nome, título profissional, cidade/UF, telefone, e-mail e links (LinkedIn/Portfólio), seguido pelo cargo ou área específica que você pleiteia.',
          },
          {
            label: '03 — Resumo Profissional',
            detail:
              'Um parágrafo de 3 a 5 linhas sintetizando seu tempo de atuação (ou foco acadêmico), principais especialidades e contexto das empresas ou projetos pelos quais passou.',
          },
          {
            label: '04 — Experiência Profissional (Ordem Cronológica Inversa)',
            detail:
              'Comece sempre pelo emprego mais recente. Em vez de apenas copiar a descrição do cargo, liste de 2 a 4 tópicos iniciados por verbos de ação (implementou, coordenou, reduziu, estruturou) com resultados concretos.',
          },
          {
            label: '05 — Formação Acadêmica & 06 — Cursos e Certificações',
            detail:
              'Registre sua escolaridade formal e selecione os cursos complementares que têm relação direta com o objetivo atual.',
          },
          {
            label: '07 — Habilidades, 08 — Idiomas & 09 — Informações Adicionais',
            detail:
              'Feche o documento com palavras-chave técnicas precisas, nível real de idiomas e notas relevantes (disponibilidade, projetos, CNH ou atuação voluntária).',
          },
        ],
      },
      {
        index: '§ 03',
        heading: 'Lista de revisão antes de baixar seu currículo em PDF',
        paragraphs: [
          'Antes de clicar em “Baixar Currículo PDF”, revise três pontos fundamentais: (1) verifique se o telefone e o e-mail estão corretos; (2) confira se os períodos de início e término seguem um padrão uniforme (ex.: “Mar 2023 — Atual”); (3) certifique-se de que o arquivo final está em formato PDF vetorial com texto selecionável.',
        ],
      },
    ],
    comparisonTable: {
      caption: 'TABELA 03 — DESCRIÇÃO DE TAREFAS VS. DESCRIÇÃO ORIENTADA A RESULTADOS',
      leftHeader: 'Descrição Passiva (Apenas Tarefa)',
      rightHeader: 'Descrição Ativa (Ação + Contexto + Impacto)',
      rows: [
        {
          left: '“Responsável pelas vendas e atendimento da loja.”',
          right: '“Realizou atendimento consultivo a média de 45 clientes/dia, superando a meta trimestral em 18%.”',
        },
        {
          left: '“Trabalhei com desenvolvimento de telas em React.”',
          right: '“Desenvolveu 12 módulos frontend em React e TypeScript, reduzindo chamados de suporte em 25%.”',
        },
        {
          left: '“Fazia relatórios financeiros no Excel.”',
          right: '“Automatizou o fechamento mensal de fluxo de caixa em Excel, economizando 6 horas semanais da equipe.”',
        },
      ],
    },
    faqItems: [
      {
        question: 'Qual o tamanho ideal de um currículo: 1 ou 2 páginas A4?',
        answer:
          'Para candidatos em início de carreira ou até 5 anos de trajetória, 1 página A4 é o ideal. Para profissionais seniores, gestores, engenheiros ou acadêmicos com histórico extenso, 2 páginas A4 bem paginadas são perfeitamente adequadas.',
      },
      {
        question: 'Por que enviar o currículo em PDF em vez de Word (.docx)?',
        answer:
          'O arquivo PDF preserva exatamente as fontes, margens, fios divisórios e proporções da folha A4 em qualquer celular ou computador, evitando que a formatação quebre na tela do recrutador.',
      },
    ],
  },

  'curriculo-profissional': {
    slug: 'curriculo-profissional',
    issueNumber: 'CADERNO EDITORIAL N° 04 · RECOLOCAÇÃO & LIDERANÇA',
    kicker: 'PADRÃO DE ESTÚDIO · CURRÍCULO PROFISSIONAL PARA IMPRIMIR OU ENVIAR EM PDF',
    h1Title: 'A arquitetura de um currículo',
    h1Highlight: 'profissional de alto nível.',
    lead: 'Para profissionais em recolocação, especialistas técnicos e lideranças executivas, a apresentação visual do currículo comunica rigor e método antes mesmo da primeira entrevista.',
    recommendedTemplateId: 'executivo',
    ctaLabel: 'Criar currículo profissional em formato A4',
    sections: [
      {
        index: '§ 01',
        heading: 'Por que o design editorial supera templates decorativos',
        paragraphs: [
          'Nos últimos anos, popularizaram-se templates de currículo repletos de faixas coloridas laterais, gráficos circulares de habilidades (“80% liderança”) e ícones decorativos. Além de desperdiçarem até 40% da área útil da folha A4, esses elementos dificultam a leitura por sistemas corporativos de triagem (ATS) e consomem tinta excessiva quando impressos.',
          'O FOLIO adota a tradição do design editorial suíço: fundo branco limpo na folha A4, tipografia calibrada para leitura longa, fios estruturais finos e separação clara entre metadados (datas, locais, instituições) e narrativa de realizações.',
        ],
      },
      {
        index: '§ 02',
        heading: 'Como escolher entre as 5 matrizes profissionais do FOLIO',
        paragraphs: [
          'Cada trajetória pede uma estrutura espacial diferente na folha A4:',
        ],
        bullets: [
          {
            label: 'M·01 Essencial (Série Suíça)',
            detail:
              'A escolha mais segura para processos seletivos em grandes corporações com triagem automatizada via ATS. Fluxo linear de uma coluna com índices laterais.',
          },
          {
            label: 'M·02 Editorial (Série Lauda)',
            detail:
              'Projetado para profissionais de design, produto, arquitetura, marketing e comunicação que desejam demonstrar repertório estético e contraste tipográfico em duas colunas assimétricas.',
          },
          {
            label: 'M·03 Clássico (Série Cátedra)',
            detail:
              'Simetria tradicional com cabeçalho e títulos centralizados. Indicado para áreas jurídicas, financeiras, médicas, docência e relações institucionais.',
          },
          {
            label: 'M·04 Executivo (Série Conselho)',
            detail:
              'Desenvolvido para gerentes, coordenadores e diretores. Posiciona um quadro emoldurado de Síntese Executiva e Competências de Governança logo no topo da primeira página.',
          },
          {
            label: 'M·05 Técnico (Série Engenharia)',
            detail:
              'Construído para engenheiros, desenvolvedores de software, especialistas de infraestrutura e indústria. Destaca a matriz de tecnologias, ferramentas e certificações na metade superior da lauda.',
          },
        ],
      },
      {
        index: '§ 03',
        heading: 'Qualidade técnica para impressão física e leitura digital (Texto Vetorial)',
        paragraphs: [
          'Muitos geradores online exportam o currículo como uma imagem achatada dentro de um PDF. O motor do FOLIO gera documentos PDF 100% vetoriais em proporção exata ISO 216 A4 (210 × 297 mm): o texto permanece selecionável, pesquisável e com nitidez absoluta tanto em monitores Retina quanto na impressão física em papel A4.',
        ],
      },
    ],
    comparisonTable: {
      caption: 'TABELA 04 — COMPARATIVO TÉCNICO: FOLIO VS. GERADORES CONVENCIONAIS',
      leftHeader: 'Critério de Qualidade',
      rightHeader: 'Padrão Implementado no FOLIO',
      rows: [
        {
          left: 'Natureza do arquivo PDF exportado',
          right: '100% Vetorial (texto selecionável, pesquisável e legível por sistemas ATS).',
        },
        {
          left: 'Paginação para currículos extensos',
          right: 'Paginação automática A4 com cabeçalho de continuação e proteção contra títulos órfãos.',
        },
        {
          left: 'Privacidade e custo de exportação',
          right: 'Gratuito, sem marca d’água, sem cadastro e com dados salvos apenas no navegador do usuário.',
        },
      ],
    },
    faqItems: [
      {
        question: 'Posso alternar entre os 5 modelos depois de preencher meu currículo?',
        answer:
          'Sim. No FOLIO, os dados do currículo são separados da camada visual. Você pode alternar entre os modelos Essencial, Editorial, Clássico, Executivo e Técnico com um clique sem perder nenhuma informação.',
      },
      {
        question: 'O currículo exportado fica bem em impressão preto e branco?',
        answer:
          'Sim. A paleta de alto contraste (Grafite #191919 sobre Branco #FFFFFF com detalhes pontuais em Vermelho Editorial #D94732) foi calibrada para manter legibilidade máxima tanto em impressão colorida quanto monocromática.',
      },
    ],
  },
};
