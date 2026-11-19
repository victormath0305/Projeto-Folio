import React from 'react';
import { ArrowUpRight, Check, Maximize2, ShieldCheck } from 'lucide-react';
import { TEMPLATE_CATALOG } from '../../data/sampleResumes';
import { ResumeDocument, ResumeTemplateId } from '../../types/resume';
import { A4DocumentRenderer } from '../resume-templates/A4DocumentRenderer';

interface TemplatesSectionProps {
  selectedTemplateId: ResumeTemplateId;
  onSelectTemplate: (templateId: ResumeTemplateId) => void;
  onOpenStartModal: (templateId: ResumeTemplateId) => void;
  onInspectDocument: (document: ResumeDocument, templateId: ResumeTemplateId) => void;
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  selectedTemplateId,
  onSelectTemplate,
  onOpenStartModal,
  onInspectDocument,
}) => {
  return (
    <section
      id="modelos"
      aria-labelledby="modelos-heading"
      className="border-b border-ink bg-ivory"
    >
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho Editorial da Seção */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-ink px-4 sm:px-8 py-10 sm:py-14 gap-6 items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-vermilion font-medium">
                § 02 — BIBLIOTECA DE MODELOS
              </span>
              <span className="h-[1px] w-10 bg-paper inline-block" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                05 MATRIZES A4
              </span>
            </div>
            <h2
              id="modelos-heading"
              className="font-serif text-4xl sm:text-5xl text-ink tracking-tight leading-[1.04]"
            >
              Cinco matrizes reais, desenhadas para{' '}
              <span className="italic text-vermilion">diferentes trajetórias.</span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:border-l lg:border-paper lg:pl-8 space-y-3">
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              Cada modelo do FOLIO possui arquitetura própria em formato A4 — da objetividade linear para triagem via ATS até dossiês executivos e folhas de especificação técnica.
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] text-ink">
              <ShieldCheck className="w-3.5 h-3.5 text-vermilion shrink-0" aria-hidden="true" />
              <span>Troque de matriz a qualquer momento sem perder seus dados.</span>
            </div>
          </div>
        </div>

        {/* Grade Editorial das 5 Matrizes A4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-ink">
          {TEMPLATE_CATALOG.map((item, idx) => {
            const isSelected = selectedTemplateId === item.id;

            return (
              <article
                key={item.id}
                className="flex flex-col justify-between bg-ivory border-b border-r border-ink/80 transition-colors duration-200"
                aria-label={`Modelo ${item.name} — ${item.tagline}`}
              >
                {/* Topo da Matriz: Identificação e Conceito */}
                <div>
                  <div className="px-4 sm:px-6 pt-6 pb-4 border-b border-paper">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                        {item.shortCode} · {item.code}
                      </span>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 bg-vermilion text-sheet px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">
                          <Check className="w-3 h-3" aria-hidden="true" />
                          Matriz Ativa
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                          N° 0{idx + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight">
                        {item.name}
                      </h3>
                      <span className="font-mono text-[11px] text-vermilion">
                        {item.seriesName}
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm font-semibold text-ink">
                      {item.tagline}
                    </p>
                  </div>

                  {/* Berço do Documento A4 (Exibição como Folha Impressa, não card genérico) */}
                  <div className="relative bg-ivory-warm/75 paper-grid-bg px-5 sm:px-7 py-6 border-b border-paper group">
                    <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-ink-subtle uppercase tracking-wider">
                      <span>PRÉVIA DO MODELO</span>
                      <span>A4 · 210 × 297 MM</span>
                    </div>

                    <div
                      onClick={() => onInspectDocument(item.sampleDocument, item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onInspectDocument(item.sampleDocument, item.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Ampliar visualização do modelo ${item.name}`}
                      className="relative cursor-pointer transition-transform duration-300 group-hover:-translate-y-1.5"
                    >
                      <A4DocumentRenderer
                        document={item.sampleDocument}
                        templateId={item.id}
                        compact
                        className="group-hover:shadow-sheet-hover"
                      />

                      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-ink-muted group-hover:text-vermilion transition-colors">
                        <span className="truncate">
                          EXEMPLO: {item.sampleDocument.personal.fullName.toUpperCase()}
                        </span>
                        <span className="inline-flex items-center gap-1 font-medium shrink-0">
                          <Maximize2 className="w-3 h-3" aria-hidden="true" />
                          Ampliar folha
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Especificações Tipográficas, Perfil Recomendado e Orientação ATS */}
                  <div className="px-4 sm:px-6 py-5 space-y-4">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-vermilion font-semibold mb-0.5">
                        Perfil Recomendado
                      </div>
                      <p className="text-xs font-medium text-ink">
                        {item.recommendedProfile}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                      {item.description}
                    </p>

                    <dl className="border-t border-paper divide-y divide-paper text-xs">
                      <div className="py-1.5 flex items-baseline justify-between gap-3">
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                          Arquitetura
                        </dt>
                        <dd className="text-ink font-medium text-right">
                          {item.layoutSpecs.columns}
                        </dd>
                      </div>
                      <div className="py-1.5 flex items-baseline justify-between gap-3">
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                          Leitura ATS
                        </dt>
                        <dd className="text-ink font-medium text-right">
                          {item.layoutSpecs.atsCompatibility}
                        </dd>
                      </div>
                    </dl>

                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-subtle mb-1.5">
                        Indicado para
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.idealFor.map((tag) => (
                          <span
                            key={tag}
                            className="border border-paper bg-ivory-warm px-2 py-0.5 text-[11px] text-ink"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rodapé de Ação da Coluna */}
                <div className="px-4 sm:px-6 pb-6 pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTemplate(item.id);
                      onOpenStartModal(item.id);
                    }}
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-medium border transition-all duration-200 ${
                      isSelected
                        ? 'bg-vermilion border-vermilion text-sheet hover:bg-ink hover:border-ink'
                        : 'bg-ink border-ink text-ivory hover:bg-vermilion hover:border-vermilion hover:text-sheet'
                    }`}
                  >
                    <span>Usar modelo {item.name}</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onInspectDocument(item.sampleDocument, item.id)}
                    className="px-3 py-3 border border-ink text-ink hover:bg-ivory-warm transition-colors text-xs font-mono uppercase tracking-wider"
                    title={`Examinar documento ${item.name} em tamanho ampliado`}
                  >
                    Ler A4
                  </button>
                </div>
              </article>
            );
          })}

          {/* 6º Bloco Editorial para fechar a grade de 3 colunas no desktop com orientação prática */}
          <aside className="flex flex-col justify-between bg-ivory-warm/45 border-b border-r border-ink/80 p-6 sm:p-8">
            <div className="space-y-4">
              <div className="font-mono text-[11px] uppercase tracking-widest text-vermilion font-medium">
                ORIENTAÇÃO RÁPIDA
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-ink tracking-tight leading-[1.06]">
                Não sabe qual modelo escolher?
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Comece por qualquer um dos cinco modelos. Todos compartilham os mesmos campos e você pode alternar entre <strong>Essencial</strong>, <strong>Editorial</strong>, <strong>Clássico</strong>, <strong>Executivo</strong> e <strong>Técnico</strong> com um clique, sem perder nada do que escreveu.
              </p>
              <div className="border-l-2 border-vermilion pl-3.5 text-xs text-ink leading-relaxed">
                Dica: para primeiro emprego, estágio ou processos seletivos automatizados (ATS), o modelo <strong>Essencial</strong> é um excelente ponto de partida.
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-paper">
              <button
                type="button"
                onClick={() => {
                  onSelectTemplate('essencial');
                  onOpenStartModal('essencial');
                }}
                className="w-full btn-editorial-primary py-3 px-4 text-xs sm:text-sm"
              >
                <span>Começar pelo modelo Essencial</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
