import React from 'react';

interface BenefitItem {
  number: string;
  title: string;
  specLabel: string;
  description: string;
  editorialNote: string;
}

const BENEFITS_LIST: BenefitItem[] = [
  {
    number: '01',
    title: 'Criação gratuita',
    specLabel: 'ACESSO PÚBLICO INTEGRAL · R$ 0,00',
    description:
      'Procurar emprego ou estágio não deveria exigir uma assinatura mensal. Todas as matrizes tipográficas, seções curriculares e ferramentas de composição do FOLIO são abertas e gratuitas.',
    editorialNote: 'Sem planos ocultos ou bloqueio de exportação no último passo.',
  },
  {
    number: '02',
    title: 'Sem necessidade de cadastro',
    specLabel: 'ZERO FRICÇÃO · PRIVACIDADE POR PADRÃO',
    description:
      'Abra a página, escolha sua matriz e comece a escrever imediatamente. Não pedimos seu e-mail, senha ou telefone antes de permitir que você construa e baixe seu documento.',
    editorialNote: 'Armazenamento local (LocalStorage) sob seu controle exclusivo.',
  },
  {
    number: '03',
    title: 'Download em PDF',
    specLabel: 'NORMA ISO 216 A4 · TEXTO SELECIONÁVEL',
    description:
      'Geração de documentos em formato A4 (210 × 297 mm) prontos para envio digital ou impressão física, sem marcas d’água, rodapés promocionais ou perda de nitidez tipográfica.',
    editorialNote: 'Estrutura textual limpa para leitura humana e sistemas ATS.',
  },
  {
    number: '04',
    title: 'Modelos profissionais',
    specLabel: 'DIREÇÃO DE ARTE SUÍÇA & EDITORIAL',
    description:
      'Esqueça templates poluídos com barras de porcentagem arbitrárias ou gráficos sem significado. Nossas matrizes seguem princípios clássicos de design editorial, proporção e legibilidade.',
    editorialNote: 'Três séries fundacionais: Essencial, Editorial e Clássico.',
  },
  {
    number: '05',
    title: 'Fácil personalização',
    specLabel: 'COMPOSIÇÃO GUIADA · FOCO NO CONTEÚDO',
    description:
      'Você foca na clareza das suas experiências, conquistas e formação acadêmica; o motor tipográfico cuida automaticamente das margens, alinhamentos, entrelinhas e quebras visuais.',
    editorialNote: 'Troque entre modelos a qualquer momento sem precisar redigitar.',
  },
];

export const BenefitsSection: React.FC = () => {
  return (
    <section
      id="beneficios"
      aria-labelledby="beneficios-heading"
      className="border-b border-ink bg-ivory"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Coluna Esquerda (4 Colunas): Manifesto de Utilidade Pública */}
          <div className="lg:col-span-4 px-4 sm:px-8 py-12 sm:py-16 border-b lg:border-b-0 lg:border-r border-ink flex flex-col justify-between bg-ivory-warm/40">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-vermilion font-medium mb-3">
                § 03 — PRINCÍPIOS DO PRODUTO
              </div>
              <h2
                id="beneficios-heading"
                className="font-serif text-4xl sm:text-5xl text-ink tracking-tight leading-[1.05]"
              >
                Projetado com respeito por quem{' '}
                <span className="italic text-vermilion">busca oportunidade.</span>
              </h2>
              <p className="mt-5 text-sm sm:text-base text-ink-muted leading-relaxed">
                Muitas ferramentas online atraem candidatos com a promessa de gratuidade e cobram pelo download apenas após trinta minutos de preenchimento. O FOLIO nasceu como resposta ética e estética a essa prática.
              </p>
            </div>

            {/* Nota Editorial de Rodapé de Coluna */}
            <div className="mt-10 pt-6 border-t border-paper">
              <div className="tech-caption text-ink-subtle mb-1">
                NOTA DA DIREÇÃO DE ARTE
              </div>
              <p className="font-editorial italic text-sm text-ink">
                “Um bom currículo não grita para chamar atenção; ele organiza a trajetória com tanta clareza que a leitura se torna inevitável.”
              </p>
            </div>
          </div>

          {/* Coluna Direita (8 Colunas): Tabela Editorial Numerada dos 5 Benefícios */}
          <div className="lg:col-span-8 divide-y divide-paper">
            {BENEFITS_LIST.map((item) => (
              <div
                key={item.number}
                className="group px-4 sm:px-8 py-8 sm:py-9 transition-colors duration-200 hover:bg-ivory-warm/50"
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-baseline">
                  {/* Índice Numérico */}
                  <div className="sm:col-span-2 flex sm:block items-baseline justify-between">
                    <span className="font-serif text-3xl sm:text-4xl text-vermilion leading-none">
                      {item.number}
                    </span>
                    <span className="sm:hidden font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
                      {item.specLabel}
                    </span>
                  </div>

                  {/* Título e Especificação */}
                  <div className="sm:col-span-4">
                    <div className="hidden sm:block font-mono text-[10px] uppercase tracking-widest text-ink-subtle mb-1">
                      {item.specLabel}
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-ink tracking-tight group-hover:text-vermilion transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Descrição e Nota Técnica */}
                  <div className="sm:col-span-6 space-y-2.5">
                    <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                      {item.description}
                    </p>
                    <div className="inline-flex items-center gap-2 font-mono text-[11px] text-ink pt-1">
                      <span className="h-1.5 w-1.5 bg-vermilion inline-block" aria-hidden="true" />
                      <span>{item.editorialNote}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
