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
    title: 'FOLIO — Criar Currículo Grátis em PDF A4 | Gerador de Currículos Online',
    description:
      'Crie seu currículo grátis no FOLIO: gerador de currículos gratuito para fazer currículo online, escolher modelo de currículo profissional (inclusive para primeiro emprego ou sem experiência) e baixar currículo em PDF A4 pronto para imprimir, sem cadastro e sem marca d’água.',
    canonicalUrl: `${BASE_ORIGIN}/`,
    robots: 'index, follow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'FOLIO — Gerador de Currículos Gratuito',
      url: `${BASE_ORIGIN}/`,
      inLanguage: 'pt-BR',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'BRL',
      },
      description:
        'Plataforma gratuita para criar currículo grátis, fazer currículo online com 5 modelos de currículo profissional e baixar currículo em PDF A4 pronto para imprimir.',
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
    title: '5 Modelos de Currículo Profissional para Baixar em PDF A4 Grátis | FOLIO',
    description:
      'Conheça os 5 modelos de currículo profissional do FOLIO (Essencial, Editorial, Clássico, Executivo e Técnico). Escolha seu modelo de currículo para baixar e imprimir em PDF A4 gratuitamente.',
    canonicalUrl: `${BASE_ORIGIN}/modelos-de-curriculo`,
    robots: 'index, follow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Biblioteca de 5 Modelos de Currículo Profissional A4 — FOLIO',
      url: `${BASE_ORIGIN}/modelos-de-curriculo`,
      numberOfItems: 5,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'M·01 Essencial — Modelo de Currículo Linear compatível com ATS',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'M·02 Editorial — Modelo de Currículo em Duas Colunas Assimétricas',
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
    title: 'Currículo para Primeiro Emprego e Jovem Aprendiz: Guia e Modelo PDF Grátis | FOLIO',
    description:
      'Saiba como fazer um currículo para primeiro emprego ou estágio. Exemplos reais de objetivo profissional, como destacar estudos e cursos, e gerador gratuito para criar currículo em PDF A4.',
    canonicalUrl: `${BASE_ORIGIN}/curriculo-primeiro-emprego`,
    robots: 'index, follow',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Como Fazer um Currículo para Primeiro Emprego e Estágio em Formato A4',
      inLanguage: 'pt-BR',
      author: { '@type': 'Organization', name: 'FOLIO' },
      url: `${BASE_ORIGIN}/curriculo-primeiro-emprego`,
    },
  },
  'curriculo-sem-experiencia': {
    view: 'curriculo-sem-experiencia',
    path: '/curriculo-sem-experiencia',
    title: 'Currículo Sem Experiência: O Que Colocar e Como Fazer Online Grátis | FOLIO',
    description:
      'Guia prático para montar um currículo sem experiência formal em carteira. Aprenda a transformar formação, cursos livres, projetos acadêmicos e trabalho voluntário em qualificações claras.',
    canonicalUrl: `${BASE_ORIGIN}/curriculo-sem-experiencia`,
    robots: 'index, follow',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Currículo Sem Experiência Formal: Estrutura e Estratégia Editorial',
      inLanguage: 'pt-BR',
      author: { '@type': 'Organization', name: 'FOLIO' },
      url: `${BASE_ORIGIN}/curriculo-sem-experiencia`,
    },
  },
  'como-fazer-um-curriculo': {
    view: 'como-fazer-um-curriculo',
    path: '/como-fazer-um-curriculo',
    title: 'Como Fazer um Currículo Passo a Passo: Estrutura A4 e Redação | FOLIO',
    description:
      'Aprenda como fazer um currículo profissional passo a passo: estrutura das 9 seções, dicas de redação objetiva, o que evitar e como exportar um currículo para imprimir ou enviar em PDF.',
    canonicalUrl: `${BASE_ORIGIN}/como-fazer-um-curriculo`,
    robots: 'index, follow',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'Como Fazer um Currículo Profissional em Formato A4',
      inLanguage: 'pt-BR',
      step: [
        { '@type': 'HowToStep', name: 'Escolha uma matriz tipográfica adequada à sua área' },
        { '@type': 'HowToStep', name: 'Preencha dados de contato objetivos e objetivo profissional' },
        { '@type': 'HowToStep', name: 'Estruture experiências, formação, cursos e habilidades' },
        { '@type': 'HowToStep', name: 'Exporte em PDF vetorial A4 com texto selecionável' },
      ],
    },
  },
  'curriculo-profissional': {
    view: 'curriculo-profissional',
    path: '/curriculo-profissional',
    title: 'Currículo Profissional para Imprimir ou Enviar em PDF Vetorial | FOLIO',
    description:
      'Construa um currículo profissional com direção de arte suíça, hierarquia tipográfica clara e texto vetorial selecionável para sistemas ATS. Ideal para recolocação, especialistas e gestores.',
    canonicalUrl: `${BASE_ORIGIN}/curriculo-profissional`,
    robots: 'index, follow',
    ogType: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Padrões de Excelência para Currículo Profissional e Recolocação',
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

    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
    setMetaTag(
      'meta[name="twitter:description"]',
      'name',
      'twitter:description',
      meta.description
    );

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
