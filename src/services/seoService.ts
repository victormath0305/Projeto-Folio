import { SITE_CONFIG } from '../config/siteConfig';

export type PublicGuideSlug =
  | 'modelos-de-curriculo'
  | 'curriculo-primeiro-emprego'
  | 'curriculo-sem-experiencia'
  | 'como-fazer-um-curriculo'
  | 'curriculo-profissional';

export type PublicLegalSlug = 'privacidade' | 'termos-de-uso' | 'contato' | 'apoie';

export type AppRouteView =
  | 'landing'
  | 'editor'
  | PublicGuideSlug
  | PublicLegalSlug
  | 'not-found';

export interface RouteSEOMetadata {
  view: AppRouteView;
  path: string;
  title: string;
  description: string;
  canonicalUrl: string;
  robots: 'index, follow' | 'noindex, nofollow';
  ogType: 'website' | 'article';
  jsonLd: Record<string, unknown>;
}

const BASE_ORIGIN = SITE_CONFIG.siteUrl;

export const ROUTE_SEO_CONFIG: Record<AppRouteView, RouteSEOMetadata> = {
  landing: {
    view: 'landing',
    path: '/',
    title: 'Criar Currículo Grátis em PDF Online (Sem Cadastro) | FOLIO',
    description:
      'Faça seu currículo online grátis pelo celular ou computador, sem cadastro e sem marca d’água. Escolha entre 5 modelos prontos para preencher e baixar em PDF.',
    canonicalUrl: `${BASE_ORIGIN}/`,
    robots: 'index, follow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: 'FOLIO — Gerador de Currículos Gratuito',
          alternateName: 'FOLIO Currículo',
          url: `${BASE_ORIGIN}/`,
          inLanguage: 'pt-BR',
        },
        {
          '@type': 'WebApplication',
          name: 'FOLIO — Gerador de Currículos Gratuito',
          url: `${BASE_ORIGIN}/`,
          inLanguage: 'pt-BR',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'All',
          isAccessibleForFree: true,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'BRL',
          },
          featureList: [
            'Criar currículo grátis online sem cadastro',
            '5 modelos de currículo prontos para preencher (Essencial, Editorial, Clássico, Executivo e Técnico)',
            'Exportação gratuita em PDF formato A4 sem marca d’água',
            'Modo dedicado para primeiro emprego, estágio e currículo sem experiência',
          ],
          description:
            'Gerador de currículos online gratuito para criar currículo simples ou profissional, preencher pelo celular ou computador e baixar em PDF A4 sem cadastro e sem marca d’água.',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'O FOLIO é realmente grátis para baixar o currículo em PDF?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Sim. Todos os cinco modelos de currículo do FOLIO são 100% gratuitos, sem cadastro obrigatório, sem assinatura oculta e sem marca d’água no PDF baixado.',
              },
            },
            {
              '@type': 'Question',
              name: 'Posso fazer um currículo para primeiro emprego ou sem experiência?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Sim. O editor possui um modo dedicado para primeiro emprego, estágio e jovem aprendiz que destaca formação acadêmica, cursos, projetos e habilidades.',
              },
            },
            {
              '@type': 'Question',
              name: 'Dá para criar e baixar currículo em PDF pelo celular?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Sim. O FOLIO funciona diretamente no navegador do celular ou computador, com prévia em tempo real e download imediato em PDF formato A4 pronto para enviar ou imprimir.',
              },
            },
          ],
        },
      ],
    },
  },
  editor: {
    view: 'editor',
    path: '/editor',
    title: 'Editor de Currículo A4 (Sessão Local Privada) — FOLIO',
    description:
      'Mesa de composição curricular privada do FOLIO. Seus dados permanecem armazenados localmente no seu navegador e não são indexados.',
    canonicalUrl: `${BASE_ORIGIN}/`,
    robots: 'noindex, nofollow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Editor de Currículo A4 — FOLIO',
      isAccessibleForFree: true,
    },
  },
  'modelos-de-curriculo': {
    view: 'modelos-de-curriculo',
    path: '/modelos-de-curriculo',
    title: 'Modelos de Currículo Prontos para Preencher e Baixar em PDF Grátis | FOLIO',
    description:
      'Escolha entre 5 modelos de currículo prontos para preencher online (Essencial, Editorial, Clássico, Executivo e Técnico) e baixe grátis em PDF A4 para imprimir.',
    canonicalUrl: `${BASE_ORIGIN}/modelos-de-curriculo`,
    robots: 'index, follow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: '5 Modelos de Currículo Prontos para Preencher e Baixar em PDF — FOLIO',
      url: `${BASE_ORIGIN}/modelos-de-curriculo`,
      numberOfItems: 5,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'M·01 Essencial — Modelo de Currículo Simples e Linear compatível com ATS',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'M·02 Editorial — Modelo de Currículo Moderno em Duas Colunas',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'M·03 Clássico — Modelo de Currículo Tradicional e Formal',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'M·04 Executivo — Modelo de Currículo para Gestores e Lideranças',
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'M·05 Técnico — Modelo de Currículo para Engenharia e Tecnologia',
        },
      ],
    },
  },
  'curriculo-primeiro-emprego': {
    view: 'curriculo-primeiro-emprego',
    path: '/curriculo-primeiro-emprego',
    title: 'Currículo Primeiro Emprego e Jovem Aprendiz: Modelo Pronto em PDF Grátis | FOLIO',
    description:
      'Veja como fazer currículo para primeiro emprego, jovem aprendiz ou estágio. Exemplos de objetivo profissional e modelo pronto para preencher e baixar grátis em PDF.',
    canonicalUrl: `${BASE_ORIGIN}/curriculo-primeiro-emprego`,
    robots: 'index, follow',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Como Fazer um Currículo para Primeiro Emprego, Jovem Aprendiz e Estágio',
      inLanguage: 'pt-BR',
      author: { '@type': 'Organization', name: 'FOLIO' },
      url: `${BASE_ORIGIN}/curriculo-primeiro-emprego`,
    },
  },
  'curriculo-sem-experiencia': {
    view: 'curriculo-sem-experiencia',
    path: '/curriculo-sem-experiencia',
    title: 'Currículo Sem Experiência: Modelo Pronto e Como Fazer Grátis em PDF | FOLIO',
    description:
      'Aprenda o que colocar no currículo sem experiência formal. Destaque escolaridade, cursos, projetos e trabalho voluntário e baixe seu currículo pronto em PDF grátis.',
    canonicalUrl: `${BASE_ORIGIN}/curriculo-sem-experiencia`,
    robots: 'index, follow',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Currículo Sem Experiência: O Que Colocar e Como Montar Online Grátis',
      inLanguage: 'pt-BR',
      author: { '@type': 'Organization', name: 'FOLIO' },
      url: `${BASE_ORIGIN}/curriculo-sem-experiencia`,
    },
  },
  'como-fazer-um-curriculo': {
    view: 'como-fazer-um-curriculo',
    path: '/como-fazer-um-curriculo',
    title: 'Como Fazer um Currículo Simples e Profissional Passo a Passo (PDF Grátis) | FOLIO',
    description:
      'Guia passo a passo de como fazer um currículo simples e profissional: o que colocar em cada seção, dicas de redação e gerador online gratuito para baixar em PDF.',
    canonicalUrl: `${BASE_ORIGIN}/como-fazer-um-curriculo`,
    robots: 'index, follow',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'Como Fazer um Currículo Simples e Profissional em PDF',
      inLanguage: 'pt-BR',
      step: [
        { '@type': 'HowToStep', name: 'Escolha um modelo de currículo pronto adequado à sua área' },
        { '@type': 'HowToStep', name: 'Preencha dados de contato objetivos e objetivo profissional' },
        { '@type': 'HowToStep', name: 'Estruture experiências, formação, cursos e habilidades' },
        { '@type': 'HowToStep', name: 'Baixe grátis em PDF A4 pronto para enviar ou imprimir' },
      ],
    },
  },
  'curriculo-profissional': {
    view: 'curriculo-profissional',
    path: '/curriculo-profissional',
    title: 'Currículo Profissional Pronto para Imprimir ou Enviar em PDF Grátis | FOLIO',
    description:
      'Crie um currículo profissional limpo, compatível com sistemas ATS e pronto para imprimir ou enviar em PDF. Ideal para recolocação, especialistas e cargos de liderança.',
    canonicalUrl: `${BASE_ORIGIN}/curriculo-profissional`,
    robots: 'index, follow',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Como Criar um Currículo Profissional em PDF para Recolocação e Liderança',
      inLanguage: 'pt-BR',
      author: { '@type': 'Organization', name: 'FOLIO' },
      url: `${BASE_ORIGIN}/curriculo-profissional`,
    },
  },
  privacidade: {
    view: 'privacidade',
    path: '/privacidade',
    title: 'Política de Privacidade e Proteção de Dados | FOLIO',
    description:
      'Conheça a Política de Privacidade do FOLIO: armazenamento local dos dados do currículo no seu navegador, tratamento local de fotos, ausência de envio para servidores e controle de consentimento.',
    canonicalUrl: `${BASE_ORIGIN}/privacidade`,
    robots: 'index, follow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Política de Privacidade — FOLIO',
      inLanguage: 'pt-BR',
      url: `${BASE_ORIGIN}/privacidade`,
    },
  },
  'termos-de-uso': {
    view: 'termos-de-uso',
    path: '/termos-de-uso',
    title: 'Termos de Uso e Compromisso de Gratuidade | FOLIO',
    description:
      'Termos de Uso do FOLIO: natureza gratuita do gerador de currículos, titularidade integral do usuário sobre os PDFs gerados, limitações técnicas de armazenamento local e regras de utilização.',
    canonicalUrl: `${BASE_ORIGIN}/termos-de-uso`,
    robots: 'index, follow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Termos de Uso — FOLIO',
      inLanguage: 'pt-BR',
      url: `${BASE_ORIGIN}/termos-de-uso`,
    },
  },
  contato: {
    view: 'contato',
    path: '/contato',
    title: 'Contato, Suporte e Canal Institucional | FOLIO',
    description:
      'Canal institucional de contato do projeto FOLIO — Gerador de Currículos Profissionais Gratuito.',
    canonicalUrl: `${BASE_ORIGIN}/contato`,
    robots: 'index, follow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contato — FOLIO',
      inLanguage: 'pt-BR',
      url: `${BASE_ORIGIN}/contato`,
    },
  },
  apoie: {
    view: 'apoie',
    path: '/apoie',
    title: 'Apoie o FOLIO — Contribuição Voluntária via Pix | FOLIO',
    description:
      'Contribua voluntariamente via Pix para manter o gerador de currículos FOLIO gratuito, independente, sem cadastro e sem marcas d’água para todos.',
    canonicalUrl: `${BASE_ORIGIN}/apoie`,
    robots: 'index, follow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Apoie o FOLIO — Doações Voluntárias via Pix',
      inLanguage: 'pt-BR',
      url: `${BASE_ORIGIN}/apoie`,
    },
  },
  'not-found': {
    view: 'not-found',
    path: '/404',
    title: 'Página Não Encontrada (Erro 404) | FOLIO',
    description:
      'A página solicitada não foi encontrada no acervo do FOLIO. Retorne à página inicial ou acesse o editor gratuito de currículos A4.',
    canonicalUrl: `${BASE_ORIGIN}/`,
    robots: 'noindex, nofollow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Erro 404 — Página Não Encontrada — FOLIO',
    },
  },
};

function setMetaTag(
  selector: string,
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
) {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Atualiza dinamicamente os metadados de SEO (<title>, description, canonical, robots, Open Graph, Twitter e JSON-LD)
 * garantindo que dados pessoais do usuário nunca vazem para os metadados da página.
 */
export function applyRouteSEOMetadata(view: AppRouteView): RouteSEOMetadata {
  const meta = ROUTE_SEO_CONFIG[view] ?? ROUTE_SEO_CONFIG.landing;

  if (typeof document !== 'undefined') {
    document.title = meta.title;

    setMetaTag('meta[name="description"]', 'name', 'description', meta.description);
    setMetaTag('meta[name="robots"]', 'name', 'robots', meta.robots);

    setMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
    setMetaTag(
      'meta[property="og:description"]',
      'property',
      'og:description',
      meta.description
    );
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', meta.ogType);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', meta.canonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', `${BASE_ORIGIN}/og-card.svg`);

    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
    setMetaTag(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      meta.description
    );
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', `${BASE_ORIGIN}/og-card.svg`);

    if (SITE_CONFIG.gscVerificationToken) {
      setMetaTag(
        'meta[name="google-site-verification"]',
        'name',
        'google-site-verification',
        SITE_CONFIG.gscVerificationToken
      );
    }

    let canonicalEl = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', meta.canonicalUrl);

    let ldScript = document.getElementById('folio-structured-data');
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.id = 'folio-structured-data';
      ldScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify(meta.jsonLd);
  }

  return meta;
}
