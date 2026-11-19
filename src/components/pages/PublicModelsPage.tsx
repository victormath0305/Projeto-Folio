import React from 'react';
import { ArrowLeft, ArrowUpRight, Check, Maximize2, ShieldCheck } from 'lucide-react';
import { TEMPLATE_CATALOG } from '../../data/sampleResumes';
import { PublicGuideSlug } from '../../services/seoService';
import { ResumeDocument, ResumeTemplateId } from '../../types/resume';
import { A4DocumentRenderer } from '../resume-templates/A4DocumentRenderer';

interface PublicModelsPageProps {
  selectedTemplateId: ResumeTemplateId;
  onSelectAndStartEditor: (templateId: ResumeTemplateId) => void;
  onInspectDocument: (doc: ResumeDocument, templateId: ResumeTemplateId) => void;
  onNavigateToRoute: (route: 'landing' | 'editor' | PublicGuideSlug) => void;
}

/**
 * Página Pública de Apresentação da Biblioteca de Modelos (/modelos-de-curriculo)
 * Atende à Seção 4 (SEO dos Modelos): exibe apenas exemplos demonstrativos públicos,
 * garantindo que nenhum currículo pessoal de usuário seja indexado.
 */
export const PublicModelsPage: React.FC<PublicModelsPageProps> = ({
  selectedTemplateId,
  onSelectAndStartEditor,
  onInspectDocument,
  onNavigateToRoute,
}) => {
  const relatedGuides: { slug: PublicGuideSlug; number: string; title: string }[] = [
    {
      slug: 'curriculo-primeiro-emprego',
      number: '01',
      title: 'Currículo para Primeiro Emprego e Estágio',
    },
    {
      slug: 'curriculo-sem-experiencia',
      number: '02',
      title: 'Como Fazer Currículo Sem Experiência Formal',
    },
    {
      slug: 'como-fazer-um-curriculo',
      number: '03',
      title: 'Como Fazer um Currículo Passo a Passo',
    },
    {
      slug: 'curriculo-profissional',
      number: '04',
      title: 'Padrões de Currículo Profissional em PDF',
    },
  ];

  return (
    <article className="bg-ivory text-ink border-b border-ink">
      <div className="mx-auto max-w-7xl">
        {/* Barra de Migalhas Editorial (Breadcrumb Semântico) */}
        <nav
          aria-label="Localização na publicação"
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
            <span className="text-vermilion font-semibold">
              BIBLIOTECA PÚBLICA DE MODELOS A4
            </span>
          </div>
          <span>NORMA ISO 216 · 210 × 297 MM · PDF VETORIAL</span>
        </nav>

        {/* Cabeçalho Principal da Página Pública (H1 Exclusivo) */}
        <header className="grid grid-cols-1 lg:grid-cols-12 border-b border-ink px-4 sm:px-8 py-12 sm:py-16 gap-8 items-end">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 border border-ink bg-ivory-warm px-3 py-1 mb-5">
              <span className="h-2 w-2 bg-vermilion inline-block" aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink font-medium">
                CATÁLOGO OFICIAL · 5 MODELOS DE CURRÍCULO PARA BAIXAR EM PDF
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl text-ink tracking-tight leading-[1.02]">
              Modelos de currículo profissional{' '}
              <span className="italic text-vermilion">prontos para preencher e imprimir.</span>
            </h1>
          </div>

          <div className="lg:col-span-5 lg:border-l lg:border-paper lg:pl-8 space-y-4">
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              Explore as cinco matrizes tipográficas gratuitas do FOLIO. Cada modelo de currículo foi projetado em formato A4 para valorizar diferentes momentos de carreira — do primeiro emprego à diretoria executiva — com exportação direta em PDF vetorial e texto 100% selecionável.
            </p>
            <div className="flex items-center gap-2 font-mono text-xs text-ink">
              <ShieldCheck className="w-4 h-4 text-vermilion shrink-0" aria-hidden="true" />
              <span>Acesso gratuito, sem cadastro e sem marcas d’água.</span>
            </div>
          </div>
        </header>

        {/* Apresentação Detalhada de Cada um dos 5 Modelos (H2 por Modelo) */}
        <div className="divide-y divide-ink">
          {TEMPLATE_CATALOG.map((model, index) => {
            const isSelected = selectedTemplateId === model.id;

            return (
              <section
                key={model.id}
                aria-labelledby={`heading-model-${model.id}`}
                className="grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Coluna Esquerda (7 Colunas): Ficha Editorial, Características e Orientações */}
                <div className="lg:col-span-7 px-4 sm:px-8 py-10 sm:py-12 lg:border-r border-ink flex flex-col justify-between">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs uppercase tracking-widest text-vermilion font-semibold">
                          {model.shortCode} · {model.code}
                        </span>
                        <span className="font-mono text-xs text-ink-subtle">
                          MATRIZ 0{index + 1} DE 05
                        </span>
                      </div>

                      <h2
                        id={`heading-model-${model.id}`}
                        className="font-serif text-3xl sm:text-5xl text-ink tracking-tight"
                      >
                        Modelo {model.name} — {model.seriesName}
                      </h2>
                      <p className="mt-2 text-base sm:text-lg font-medium text-ink">
                        {model.tagline}
                      </p>
                    </div>

                    <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                      {model.description}
                    </p>

                    {/* Blocos de Perfil Recomendado, Estrutura e Orientação de Uso */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="border border-paper bg-ivory-warm/50 p-4">
                        <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1.5">
                          Perfil Recomendado
                        </h3>
                        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                          {model.recommendedProfile}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {model.idealFor.map((tag) => (
                            <span
                              key={tag}
                              className="border border-paper bg-ivory px-2 py-0.5 text-[11px] text-ink font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border border-paper bg-ivory-warm/50 p-4">
                        <h3 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1.5">
                          Características &amp; Orientações de Uso
                        </h3>
                        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                          {model.structuralHighlight}
                        </p>
                        <p className="mt-2 text-xs text-ink font-medium border-l-2 border-vermilion pl-2.5">
                          {model.atsGuidance}
                        </p>
                      </div>
                    </div>

                    {/* Especificações Tipográficas */}
                    <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-paper pt-4 text-xs">
                      <div>
                        <dt className="font-mono text-[10px] uppercase text-ink-subtle">
                          Tipografia de Títulos
                        </dt>
                        <dd className="text-ink font-medium mt-0.5">
                          {model.typographicPairing.heading}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase text-ink-subtle">
                          Arquitetura da Folha
                        </dt>
                        <dd className="text-ink font-medium mt-0.5">
                          {model.layoutSpecs.columns}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase text-ink-subtle">
                          Compatibilidade ATS
                        </dt>
                        <dd className="text-ink font-medium mt-0.5">
                          {model.layoutSpecs.atsCompatibility}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Botões de Ação do Modelo */}
                  <div className="mt-8 pt-5 border-t border-paper flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onSelectAndStartEditor(model.id)}
                      className="btn-editorial-primary py-3 px-6 text-xs sm:text-sm"
                    >
                      {isSelected && <Check className="w-4 h-4" aria-hidden="true" />}
                      <span>Preencher currículo no modelo {model.name}</span>
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onInspectDocument(model.sampleDocument, model.id)}
                      className="btn-editorial-secondary py-3 px-5 text-xs sm:text-sm"
                    >
                      <Maximize2 className="w-4 h-4 text-vermilion" aria-hidden="true" />
                      <span>Ampliar prévia A4</span>
                    </button>
                  </div>
                </div>

                {/* Coluna Direita (5 Colunas): Prévia Visual A4 do Modelo */}
                <div className="lg:col-span-5 bg-ivory-warm/70 paper-grid-bg p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 border-ink">
                  <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-ink-subtle uppercase tracking-wider">
                    <span>PRÉVIA VISUAL A4 · {model.shortCode}</span>
                    <span>EXEMPLO PÚBLICO: {model.sampleDocument.personal.fullName.toUpperCase()}</span>
                  </div>

                  <div className="mx-auto w-full max-w-[380px]">
                    <A4DocumentRenderer
                      document={model.sampleDocument}
                      templateId={model.id}
                      compact
                    />
                  </div>

                  <div className="mt-4 pt-3 border-t border-paper flex items-center justify-between font-mono text-[10px] text-ink-muted">
                    <span>FORMATO: 210 × 297 MM</span>
                    <span>EXPORTAÇÃO PDF GRATUITA</span>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Seção de Links Internos Relevantes para os Guias Editoriais */}
        <section
          aria-labelledby="guias-relacionados-heading"
          className="border-t border-ink bg-ivory-warm/50 px-4 sm:px-8 py-12"
        >
          <div className="mb-6">
            <span className="font-mono text-xs uppercase tracking-widest text-vermilion font-semibold">
              LEITURA COMPLEMENTAR · GUIAS DE REDAÇÃO CURRICULAR
            </span>
            <h2
              id="guias-relacionados-heading"
              className="font-serif text-3xl text-ink mt-1"
            >
              Guias práticos para cada momento profissional
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedGuides.map((g) => (
              <button
                key={g.slug}
                type="button"
                onClick={() => onNavigateToRoute(g.slug)}
                className="group text-left border border-ink bg-ivory p-4 transition-all hover:bg-ink hover:text-ivory"
              >
                <div className="font-mono text-xs text-vermilion mb-1">
                  CADERNO {g.number}
                </div>
                <div className="font-serif text-xl leading-snug group-hover:text-ivory">
                  {g.title}
                </div>
                <div className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted group-hover:text-vermilion">
                  <span>Ler guia completo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};
