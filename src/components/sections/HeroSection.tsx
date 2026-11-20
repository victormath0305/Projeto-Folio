import React, { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Eye, Grid, Maximize2 } from 'lucide-react';
import { HERO_SPECIMEN_RESUME } from '../../data/sampleResumes';
import { ResumeDocument, ResumeTemplateId } from '../../types/resume';
import { A4DocumentRenderer } from '../resume-templates/A4DocumentRenderer';

interface HeroSectionProps {
  hasSavedResume?: boolean;
  onOpenStartModal: (templateId?: ResumeTemplateId) => void;
  onContinueSavedResume?: () => void;
  onInspectDocument: (document: ResumeDocument, templateId: ResumeTemplateId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  hasSavedResume = false,
  onOpenStartModal,
  onContinueSavedResume,
  onInspectDocument,
}) => {
  const [specimenTemplate, setSpecimenTemplate] = useState<ResumeTemplateId>('editorial');
  const [showEditorialGrid, setShowEditorialGrid] = useState<boolean>(false);

  const templateSwitchOptions: { id: ResumeTemplateId; label: string; refCode: string }[] = [
    { id: 'editorial', label: 'Editorial', refCode: 'M·02' },
    { id: 'essencial', label: 'Essencial', refCode: 'M·01' },
    { id: 'classico', label: 'Clássico', refCode: 'M·03' },
    { id: 'executivo', label: 'Executivo', refCode: 'M·04' },
    { id: 'tecnico', label: 'Técnico', refCode: 'M·05' },
  ];

  return (
    <section
      id="topo"
      aria-labelledby="hero-heading"
      className="relative border-b border-ink bg-ivory"
    >
      <div className="mx-auto max-w-7xl">
        {/* Linha de Metadados de Seção (Cabeçalho de Grade) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-paper px-4 sm:px-8 py-3 text-xs font-mono text-ink-muted">
          <div className="lg:col-span-7 flex items-center justify-between lg:pr-8">
            <span className="text-ink font-medium">
              § 01 — CURRÍCULOS PROFISSIONAIS EM FORMATO A4
            </span>
            <span className="hidden sm:inline text-ink-subtle">
              DESIGN EDITORIAL
            </span>
          </div>
          <div className="hidden lg:flex lg:col-span-5 lg:pl-8 lg:border-l lg:border-paper items-center justify-between">
            <span>PRÉVIA INTERATIVA · FORMATO A4</span>
            <span className="text-vermilion font-medium">5 MODELOS</span>
          </div>
        </div>

        {/* Composição Editorial Assimétrica Principal (7 Colunas / 5 Colunas) */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Coluna Esquerda: Chamada Editorial, Manifesto e Ação */}
          <div className="lg:col-span-7 px-4 sm:px-8 pt-10 pb-12 sm:pt-16 sm:pb-16 lg:pr-12 flex flex-col justify-between">
            <div>
              {/* Selo Editorial & Proposta de Valor Comercial */}
              <div className="inline-flex flex-wrap items-center gap-2.5 border border-ink bg-ivory-warm px-3 py-1 mb-8">
                <span className="h-2 w-2 bg-vermilion inline-block" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink font-semibold">
                  FOLIO — Crie seu currículo profissional gratuitamente
                </span>
              </div>

              {/* Mensagem Principal Obrigatória */}
              <h1
                id="hero-heading"
                className="font-serif text-5xl sm:text-6xl xl:text-[4.65rem] text-ink leading-[0.98] tracking-tight max-w-2xl"
              >
                Seu próximo capítulo{' '}
                <span className="italic font-normal text-vermilion">
                  começa no papel.
                </span>
              </h1>

              {/* Divisor Assimétrico com Cota */}
              <div className="my-7 sm:my-9 flex items-center gap-4">
                <span className="h-[1.5px] w-16 bg-vermilion inline-block" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                  Tipografia como instrumento de clareza profissional
                </span>
              </div>

              {/* Texto de Apoio Obrigatório + Contextualização Editorial */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start max-w-2xl">
                <p className="sm:col-span-7 text-lg sm:text-xl text-ink font-normal leading-relaxed">
                  Transforme sua trajetória profissional em um currículo que merece ser lido.
                </p>
                <p className="sm:col-span-5 text-sm text-ink-muted leading-relaxed border-l border-paper pl-4">
                  Faça seu currículo online grátis pelo celular ou computador: escolha entre 5 modelos prontos para preencher — do primeiro emprego à liderança — e baixe em PDF sem cadastro.
                </p>
              </div>

              {/* Ações Principais */}
              <div className="mt-9 sm:mt-11 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onOpenStartModal(specimenTemplate)}
                  className="btn-editorial-primary text-base px-8 py-4"
                >
                  <span>Criar meu currículo</span>
                  <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
                </button>

                {hasSavedResume && onContinueSavedResume && (
                  <button
                    type="button"
                    onClick={onContinueSavedResume}
                    className="btn-editorial-secondary px-6 py-4 border-vermilion text-ink hover:border-ink"
                  >
                    <span>Continuar currículo salvo</span>
                    <ArrowUpRight className="w-4 h-4 text-vermilion" aria-hidden="true" />
                  </button>
                )}

                <a
                  href="#modelos"
                  className="btn-editorial-secondary px-6 py-4"
                >
                  <span>Explorar modelos A4</span>
                  <ArrowDownRight className="w-4 h-4 text-vermilion" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Rodapé Interno da Coluna Esquerda: Ficha Técnica de Princípios */}
            <div className="mt-12 pt-8 border-t border-paper grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="font-mono text-[11px] text-vermilion uppercase tracking-wider mb-1">
                  01 / Custo Zero &amp; Fácil Uso
                </div>
                <div className="text-sm font-semibold text-ink">100% Gratuito</div>
                <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                  Criação gratuita, intuitiva e sem cobrança surpresa ao exportar.
                </p>
              </div>

              <div className="sm:border-l sm:border-paper sm:pl-5">
                <div className="font-mono text-[11px] text-vermilion uppercase tracking-wider mb-1">
                  02 / Privacidade Local
                </div>
                <div className="text-sm font-semibold text-ink">Sem Cadastro</div>
                <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                  Dados armazenados localmente no seu próprio navegador.
                </p>
              </div>

              <div className="sm:border-l sm:border-paper sm:pl-5">
                <div className="font-mono text-[11px] text-vermilion uppercase tracking-wider mb-1">
                  03 / 5 Modelos &amp; PDF A4
                </div>
                <div className="text-sm font-semibold text-ink">Fidelidade A4</div>
                <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">
                  Cinco modelos profissionais com exportação PDF vetorial em formato A4.
                </p>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Mesa de Prova Tipográfica (Composição Original em Formato A4) */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-ink bg-ivory-warm/60 paper-grid-bg px-4 sm:px-8 py-8 sm:py-10 flex flex-col justify-between">
            {/* Barra de Controle da Prova A4 */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border border-ink bg-ivory p-2">
              <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Alternar matriz tipográfica na folha de demonstração">
                {templateSwitchOptions.map((option) => {
                  const isActive = specimenTemplate === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSpecimenTemplate(option.id)}
                      aria-pressed={isActive}
                      className={`px-2 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'bg-ink text-ivory font-medium'
                          : 'text-ink-muted hover:text-ink hover:bg-ivory-warm'
                      }`}
                    >
                      <span className="text-vermilion mr-1">{option.refCode}</span>
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowEditorialGrid((prev) => !prev)}
                aria-pressed={showEditorialGrid}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider border transition-colors ${
                  showEditorialGrid
                    ? 'border-vermilion bg-vermilion text-sheet'
                    : 'border-paper bg-ivory text-ink hover:border-ink'
                }`}
                title="Exibir ou ocultar linhas de construção da grade suíça"
              >
                <Grid className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Grade</span>
              </button>
            </div>

            {/* Régua Milimétrica Superior */}
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-ink-subtle uppercase tracking-widest px-1" aria-hidden="true">
              <span>├ 0 mm</span>
              <span>105 mm (EIXO)</span>
              <span>210 mm ┤</span>
            </div>

            {/* Container da Folha A4 com Sombra Editorial e Legenda Flutuante */}
            <div className="relative mx-auto w-full max-w-[420px] group">
              {/* Folha de fundo em ângulo sutil (efeito de lauda arquivada) */}
              <div
                className="pointer-events-none absolute inset-0 translate-x-2 translate-y-2 border border-ink/30 bg-ivory"
                aria-hidden="true"
              />

              {/* Renderizador Real do Currículo A4 */}
              <div className="relative">
                <A4DocumentRenderer
                  document={HERO_SPECIMEN_RESUME}
                  templateId={specimenTemplate}
                  showEditorialGrid={showEditorialGrid}
                />

                {/* Botão Discreto de Inspeção em Escala Ampliada */}
                <button
                  type="button"
                  onClick={() => onInspectDocument(HERO_SPECIMEN_RESUME, specimenTemplate)}
                  className="absolute bottom-3 right-3 z-30 inline-flex items-center gap-1.5 bg-ink/90 text-ivory px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border border-ink transition-all hover:bg-vermilion hover:border-vermilion hover:text-sheet"
                >
                  <Maximize2 className="w-3 h-3" aria-hidden="true" />
                  <span>Inspecionar A4</span>
                </button>
              </div>
            </div>

            {/* Legenda Inferior da Prévia */}
            <div className="mt-5 pt-3 border-t border-paper flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-ink-muted">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-vermilion shrink-0" aria-hidden="true" />
                <span>
                  Prévia interativa do modelo{' '}
                  <strong className="text-ink font-medium uppercase">{specimenTemplate}</strong>
                </span>
              </div>
              <span className="text-ink-subtle">PRONTO PARA EXPORTAR EM PDF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
