import React from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { EDITORIAL_GUIDES } from '../../data/editorialGuides';
import { TEMPLATE_CATALOG } from '../../data/sampleResumes';
import { PublicGuideSlug } from '../../services/seoService';
import { ResumeDocument, ResumeTemplateId } from '../../types/resume';
import { A4DocumentRenderer } from '../resume-templates/A4DocumentRenderer';

interface PublicGuidePageProps {
  slug: Exclude<PublicGuideSlug, 'modelos-de-curriculo'>;
  onStartEditorWithConfig: (
    templateId: ResumeTemplateId,
    firstJobMode?: boolean
  ) => void;
  onInspectDocument: (doc: ResumeDocument, templateId: ResumeTemplateId) => void;
  onNavigateToRoute: (route: 'landing' | 'editor' | PublicGuideSlug) => void;
}

/**
 * Página Editorial Pública de Conteúdo Orgânico (Seção 3 — Páginas de Conteúdo)
 * Renderiza artigos originais com hierarquia semântica H1 -> H2 -> H3, tabelas comparativas,
 * perguntas frequentes e prévia A4 ao vivo do modelo recomendado.
 */
export const PublicGuidePage: React.FC<PublicGuidePageProps> = ({
  slug,
  onStartEditorWithConfig,
  onInspectDocument,
  onNavigateToRoute,
}) => {
  const guide = EDITORIAL_GUIDES[slug];
  const recommendedModel =
    TEMPLATE_CATALOG.find((t) => t.id === guide.recommendedTemplateId) ??
    TEMPLATE_CATALOG[0];

  const allGuideLinks: { slug: PublicGuideSlug; label: string }[] = [
    { slug: 'modelos-de-curriculo', label: '5 Modelos de Currículo A4' },
    { slug: 'curriculo-primeiro-emprego', label: 'Currículo Primeiro Emprego' },
    { slug: 'curriculo-sem-experiencia', label: 'Currículo Sem Experiência' },
    { slug: 'como-fazer-um-curriculo', label: 'Como Fazer um Currículo' },
    { slug: 'curriculo-profissional', label: 'Currículo Profissional em PDF' },
  ];

  return (
    <article className="bg-ivory text-ink border-b border-ink">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb Semântico */}
        <nav
          aria-label="Localização no guia editorial"
          className="border-b border-paper bg-ivory-warm/60 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink-muted"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToRoute('landing')}
              className="inline-flex items-center gap-1.5 text-ink hover:text-vermilion font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Início FOLIO</span>
            </button>
            <span className="text-paper-dark">/</span>
            <span className="text-vermilion font-semibold">{guide.issueNumber}</span>
          </div>
          <span>LEITURA TÉCNICA · ACESSO PÚBLICO GRATUITO</span>
        </nav>

        {/* Cabeçalho Assimétrico do Artigo (H1 Exclusivo) */}
        <header className="grid grid-cols-1 lg:grid-cols-12 border-b border-ink">
          <div className="lg:col-span-7 px-4 sm:px-8 py-10 sm:py-14 lg:border-r border-ink flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 border border-ink bg-ivory-warm px-3 py-1 mb-6">
                <BookOpen className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink font-medium">
                  {guide.kicker}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl text-ink tracking-tight leading-[1.02]">
                {guide.h1Title}{' '}
                <span className="italic text-vermilion">{guide.h1Highlight}</span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-ink-muted leading-relaxed max-w-2xl">
                {guide.lead}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-paper flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onStartEditorWithConfig(
                    guide.recommendedTemplateId,
                    guide.recommendedFirstJobMode
                  )
                }
                className="btn-editorial-primary py-3.5 px-7 text-sm"
              >
                <span>{guide.ctaLabel}</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateToRoute('modelos-de-curriculo')}
                className="btn-editorial-secondary py-3.5 px-5 text-xs sm:text-sm"
              >
                <span>Ver todos os 5 modelos A4</span>
              </button>
            </div>
          </div>

          {/* Coluna Direita (5 Colunas): Matriz A4 Recomendada para este Guia */}
          <div className="lg:col-span-5 bg-ivory-warm/70 paper-grid-bg p-6 sm:p-8 flex flex-col justify-between">
            <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-ink-subtle uppercase tracking-wider">
              <span>MATRIZ RECOMENDADA: {recommendedModel.shortCode} {recommendedModel.name}</span>
              <span className="text-vermilion">ISO 216 · A4</span>
            </div>

            <div
              onClick={() =>
                onInspectDocument(recommendedModel.sampleDocument, recommendedModel.id)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onInspectDocument(
                    recommendedModel.sampleDocument,
                    recommendedModel.id
                  );
                }
              }}
              aria-label={`Inspecionar folha A4 do modelo recomendado ${recommendedModel.name}`}
              className="mx-auto w-full max-w-[340px] cursor-pointer transition-transform hover:-translate-y-1"
            >
              <A4DocumentRenderer
                document={recommendedModel.sampleDocument}
                templateId={recommendedModel.id}
                compact
              />
            </div>

            <div className="mt-4 pt-3 border-t border-paper flex items-center justify-between text-xs font-mono text-ink-muted">
              <span>{recommendedModel.seriesName}</span>
              <button
                type="button"
                onClick={() =>
                  onInspectDocument(
                    recommendedModel.sampleDocument,
                    recommendedModel.id
                  )
                }
                className="text-vermilion underline font-medium"
              >
                Ampliar exemplo A4
              </button>
            </div>
          </div>
        </header>

        {/* Corpo do Artigo Editorial (Seções H2 e H3 + Tabela Comparativa + FAQ) */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Coluna Principal de Leitura (8 Colunas) */}
          <div className="lg:col-span-8 px-4 sm:px-8 py-12 space-y-12 lg:border-r border-ink">
            {guide.sections.map((sec) => (
              <section key={sec.index} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-vermilion font-semibold">
                    {sec.index}
                  </span>
                  <span className="h-[1px] w-8 bg-paper inline-block" aria-hidden="true" />
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight leading-tight">
                  {sec.heading}
                </h2>

                <div className="space-y-3 text-sm sm:text-base text-ink-muted leading-relaxed">
                  {sec.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {sec.bullets && (
                  <div className="mt-4 grid grid-cols-1 gap-3 pt-2">
                    {sec.bullets.map((b) => (
                      <div
                        key={b.label}
                        className="border border-paper bg-ivory-warm/45 p-4"
                      >
                        <h3 className="font-serif text-xl text-ink mb-1">
                          {b.label}
                        </h3>
                        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                          {b.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {sec.callout && (
                  <div className="border-l-2 border-vermilion bg-ivory-warm/70 p-4 mt-4">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1">
                      {sec.callout.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                      {sec.callout.text}
                    </p>
                  </div>
                )}
              </section>
            ))}

            {/* Tabela Comparativa Editorial */}
            <section aria-label={guide.comparisonTable.caption} className="pt-4">
              <div className="font-mono text-xs uppercase tracking-widest text-vermilion font-semibold mb-3">
                {guide.comparisonTable.caption}
              </div>
              <div className="overflow-x-auto border border-ink">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-ink bg-ivory-warm font-mono text-[11px] uppercase tracking-wider text-ink">
                      <th className="p-3.5 border-r border-paper w-1/2">
                        {guide.comparisonTable.leftHeader}
                      </th>
                      <th className="p-3.5 w-1/2">
                        {guide.comparisonTable.rightHeader}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-paper">
                    {guide.comparisonTable.rows.map((row, idx) => (
                      <tr key={idx} className="bg-ivory">
                        <td className="p-3.5 border-r border-paper text-ink-muted align-top">
                          {row.left}
                        </td>
                        <td className="p-3.5 text-ink font-medium align-top">
                          {row.right}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Perguntas Frequentes (FAQ) */}
            <section aria-labelledby="faq-guide-heading" className="pt-6 border-t border-paper">
              <div className="font-mono text-xs uppercase tracking-widest text-vermilion font-semibold mb-2">
                DÚVIDAS FREQUENTES
              </div>
              <h2 id="faq-guide-heading" className="font-serif text-3xl text-ink mb-5">
                Perguntas e respostas práticas
              </h2>
              <dl className="space-y-4">
                {guide.faqItems.map((item) => (
                  <div
                    key={item.question}
                    className="border border-paper bg-ivory-warm/40 p-4"
                  >
                    <dt className="font-serif text-xl text-ink mb-1">
                      {item.question}
                    </dt>
                    <dd className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          {/* Coluna Lateral (4 Colunas): Navegação Interna entre Guias & Chamada para o Editor */}
          <aside className="lg:col-span-4 p-6 sm:p-8 bg-ivory-warm/35 flex flex-col justify-between border-t lg:border-t-0 border-ink">
            <div className="space-y-8">
              {/* Quadro de Ação Rápida */}
              <div className="border border-ink bg-ivory p-5 space-y-4">
                <div className="font-mono text-[11px] uppercase tracking-widest text-vermilion font-semibold">
                  FERRAMENTA GRATUITA · SEM CADASTRO
                </div>
                <h2 className="font-serif text-2xl text-ink">
                  Coloque estas orientações em prática agora.
                </h2>
                <ul className="space-y-2 text-xs text-ink-muted">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-vermilion shrink-0" aria-hidden="true" />
                    <span>Pré-visualização A4 em tempo real</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-vermilion shrink-0" aria-hidden="true" />
                    <span>Download em PDF vetorial sem marca d’água</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-vermilion shrink-0" aria-hidden="true" />
                    <span>Salvamento automático no seu navegador</span>
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={() =>
                    onStartEditorWithConfig(
                      guide.recommendedTemplateId,
                      guide.recommendedFirstJobMode
                    )
                  }
                  className="w-full btn-editorial-primary py-3 text-xs"
                >
                  <span>{guide.ctaLabel}</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Índice de Todos os Cadernos Públicos (Links Internos SEO) */}
              <div>
                <h2 className="font-mono text-xs uppercase tracking-widest text-ink font-semibold mb-3">
                  Cadernos &amp; Guias Públicos FOLIO
                </h2>
                <nav aria-label="Guias editoriais relacionados">
                  <ul className="divide-y divide-paper border-y border-paper">
                    {allGuideLinks.map((link) => {
                      const isCurrent = link.slug === slug;
                      return (
                        <li key={link.slug}>
                          <button
                            type="button"
                            onClick={() => onNavigateToRoute(link.slug)}
                            aria-current={isCurrent ? 'page' : undefined}
                            className={`w-full py-3 flex items-center justify-between text-left text-xs sm:text-sm transition-colors ${
                              isCurrent
                                ? 'text-vermilion font-semibold'
                                : 'text-ink hover:text-vermilion'
                            }`}
                          >
                            <span>{link.label}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-paper font-mono text-[10px] text-ink-subtle uppercase">
              PUBLICAÇÃO EDITORIAL FOLIO · PRIVACIDADE LOCAL
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
};
