import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ResumeTemplateId } from '../../types/resume';

interface HowItWorksSectionProps {
  selectedTemplateId: ResumeTemplateId;
  onOpenStartModal: (templateId?: ResumeTemplateId) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  selectedTemplateId,
  onOpenStartModal,
}) => {
  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-heading"
      className="border-b border-ink bg-ivory"
    >
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho da Seção */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-ink px-4 sm:px-8 py-10 sm:py-14 gap-6 items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-vermilion font-medium">
                § 04 — COMO FUNCIONA
              </span>
              <span className="h-[1px] w-10 bg-paper inline-block" aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
                FLUXO EM 03 ETAPAS
              </span>
            </div>
            <h2
              id="como-funciona-heading"
              className="font-serif text-4xl sm:text-5xl text-ink tracking-tight leading-[1.04]"
            >
              Da folha em branco ao documento final,{' '}
              <span className="italic text-vermilion">sem distrações.</span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:border-l lg:border-paper lg:pl-8">
            <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
              Um método direto de composição editorial: separamos a estrutura visual da redação para que você construa um documento impecável em minutos.
            </p>
          </div>
        </div>

        {/* Três Colunas Visuais do Processo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-ink">
          {/* ETAPA 01 */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-paper pb-4 mb-6">
                <span className="font-serif text-5xl text-vermilion leading-none">
                  01
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                  ESCOLHA DO MODELO
                </span>
              </div>

              <h3 className="font-serif text-3xl text-ink tracking-tight mb-3">
                Escolha um modelo.
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-6">
                Selecione entre os cinco modelos profissionais — <strong>Essencial</strong>, <strong>Editorial</strong>, <strong>Clássico</strong>, <strong>Executivo</strong> ou <strong>Técnico</strong> — de acordo com a sua área e momento de carreira.
              </p>
            </div>

            {/* Esquema Visual 01: Seleção entre 5 Modelos A4 */}
            <div
              className="border border-ink bg-ivory-warm/70 p-4 paper-grid-bg min-h-[168px] flex flex-col justify-between"
              aria-hidden="true"
            >
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink-subtle mb-3 flex justify-between">
                <span>ESCOLHA VISUAL A4</span>
                <span className="text-vermilion">5 MODELOS</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {(['M·01', 'M·02', 'M·03', 'M·04', 'M·05'] as const).map((code) => {
                  const featured = code === 'M·02';
                  return (
                    <div
                      key={code}
                      className={`bg-sheet p-1.5 aspect-[210/297] flex flex-col justify-between ${
                        featured
                          ? 'border-2 border-vermilion shadow-architectural -translate-y-1'
                          : 'border border-paper opacity-80'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className={`h-1.5 w-4/5 ${featured ? 'bg-ink' : 'bg-ink/70'}`} />
                        <div className={`h-[1px] w-full ${featured ? 'bg-vermilion' : 'bg-paper'}`} />
                        <div className="h-0.5 w-full bg-paper/80" />
                        <div className="h-0.5 w-3/4 bg-paper/70" />
                      </div>
                      <span
                        className={`font-mono text-[6.5px] ${
                          featured ? 'text-vermilion font-bold' : 'text-ink-subtle'
                        }`}
                      >
                        {featured ? `${code} ✓` : code}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ETAPA 02 */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-paper pb-4 mb-6">
                <span className="font-serif text-5xl text-vermilion leading-none">
                  02
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                  PREENCHIMENTO GUIADO
                </span>
              </div>

              <h3 className="font-serif text-3xl text-ink tracking-tight mb-3">
                Preencha suas informações.
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-6">
                Insira seus dados de contato, objetivo, experiências, formação acadêmica e habilidades em campos simples, acompanhando o resultado em tempo real.
              </p>
            </div>

            {/* Esquema Visual 02: Entrada de Dados Estruturada */}
            <div
              className="border border-ink bg-ivory-warm/70 p-4 paper-grid-bg min-h-[168px] flex flex-col justify-between"
              aria-hidden="true"
            >
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink-subtle mb-3 flex justify-between">
                <span>PRÉVIA EM TEMPO REAL</span>
                <span className="text-ink">AUTO-AJUSTE</span>
              </div>
              <div className="bg-sheet border border-ink p-3 space-y-2.5">
                <div className="border-b border-paper pb-1.5">
                  <div className="font-mono text-[8px] uppercase text-vermilion">
                    CARGO ATUAL OU OBJETIVO
                  </div>
                  <div className="text-xs font-medium text-ink flex items-center justify-between">
                    <span>Engenheira de Software Sênior</span>
                    <span className="inline-block w-1.5 h-3.5 bg-vermilion" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-ink-muted">
                  <div className="border border-paper px-2 py-1 bg-ivory/60">
                    ✓ Paginação A4
                  </div>
                  <div className="border border-paper px-2 py-1 bg-ivory/60">
                    ✓ Salvo no navegador
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ETAPA 03 */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-paper pb-4 mb-6">
                <span className="font-serif text-5xl text-vermilion leading-none">
                  03
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                  DOWNLOAD EM PDF
                </span>
              </div>

              <h3 className="font-serif text-3xl text-ink tracking-tight mb-3">
                Baixe seu currículo.
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-6">
                Exporte seu documento finalizado em PDF pronto para enviar ou imprimir, sem marcas d’água, sem precisar criar conta e sem taxas escondidas.
              </p>
            </div>

            {/* Esquema Visual 03: Exportação PDF Limpa */}
            <div
              className="border border-ink bg-ivory-warm/70 p-4 paper-grid-bg min-h-[168px] flex flex-col justify-between"
              aria-hidden="true"
            >
              <div className="font-mono text-[9px] uppercase tracking-widest text-ink-subtle mb-3 flex justify-between">
                <span>EXPORTAÇÃO IMEDIATA</span>
                <span className="text-vermilion">PDF / A4</span>
              </div>
              <div className="bg-ink text-ivory p-3.5 border border-ink flex items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-[9px] text-vermilion uppercase tracking-widest">
                    DOCUMENTO PRONTO PARA ENVIO
                  </div>
                  <div className="font-mono text-xs text-sheet mt-0.5">
                    curriculo-profissional-a4.pdf
                  </div>
                  <div className="font-mono text-[9px] text-paper mt-1">
                    210 × 297 MM · SEM MARCA D’ÁGUA
                  </div>
                </div>
                <div className="border border-vermilion bg-vermilion text-sheet px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider shrink-0">
                  PDF ↓
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Faixa Inferior de Chamada para Ação */}
        <div className="border-t border-ink bg-ivory-warm px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 bg-vermilion inline-block" aria-hidden="true" />
            <p className="text-sm text-ink font-medium">
              Pronto para iniciar sua composição? Selecione sua matriz preferida e configure sua base.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenStartModal(selectedTemplateId)}
            className="btn-editorial-primary py-2.5 px-6 text-xs sm:text-sm shrink-0"
          >
            <span>Começar agora gratuitamente</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};
