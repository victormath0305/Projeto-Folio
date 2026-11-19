import React from 'react';
import { ArrowUpRight, HeartHandshake } from 'lucide-react';
import { AppRouteView, PublicGuideSlug } from '../../services/seoService';

interface AboutSectionProps {
  onNavigateToRoute?: (route: AppRouteView) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onNavigateToRoute,
}) => {
  const audienceProfiles: {
    index: string;
    title: string;
    description: string;
    guideSlug: PublicGuideSlug;
    guideLabel: string;
  }[] = [
    {
      index: 'A·01',
      title: 'Primeiro Emprego & Estágio',
      description:
        'Organiza formação acadêmica, projetos de extensão, monitorias e competências técnicas de modo que a falta de longa experiência corporativa não diminua o peso do candidato.',
      guideSlug: 'curriculo-primeiro-emprego',
      guideLabel: 'Ler guia de currículo para primeiro emprego',
    },
    {
      index: 'A·02',
      title: 'Currículo Sem Experiência Formal',
      description:
        'Valoriza cursos livres, iniciativas autônomas, trabalho voluntário e repertório acadêmico sem necessidade de inventar cargos ou deixar espaços vazios na folha A4.',
      guideSlug: 'curriculo-sem-experiencia',
      guideLabel: 'Ler guia de currículo sem experiência',
    },
    {
      index: 'A·03',
      title: 'Recolocação & Liderança Profissional',
      description:
        'Destaca resultados mensuráveis, síntese executiva e domínio técnico em cinco matrizes A4 prontas para imprimir ou enviar em PDF vetorial.',
      guideSlug: 'curriculo-profissional',
      guideLabel: 'Ler guia de currículo profissional',
    },
  ];

  const handleGuideClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    slug: PublicGuideSlug
  ) => {
    if (onNavigateToRoute) {
      e.preventDefault();
      onNavigateToRoute(slug);
    }
  };

  return (
    <section
      id="sobre"
      aria-labelledby="sobre-heading"
      className="border-b border-ink bg-ivory"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Coluna Editorial Principal (7 Colunas) */}
          <div className="lg:col-span-7 px-4 sm:px-8 py-12 sm:py-16 border-b lg:border-b-0 lg:border-r border-ink flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest text-vermilion font-medium mb-3">
                § 05 — SOBRE O PROJETO FOLIO
              </div>

              <h2
                id="sobre-heading"
                className="font-serif text-4xl sm:text-5xl text-ink tracking-tight leading-[1.05] max-w-xl"
              >
                Design gráfico de estúdio a serviço da{' '}
                <span className="italic text-vermilion">sua trajetória.</span>
              </h2>

              <div className="mt-6 space-y-4 text-sm sm:text-base text-ink-muted leading-relaxed max-w-2xl">
                <p>
                  O <strong className="text-ink font-semibold">FOLIO</strong> é um gerador de currículos online, gratuito e sem cadastro, criado para quem busca primeiro emprego, estágio, recolocação ou transição de carreira sem precisar pagar assinaturas ao final do preenchimento.
                </p>
                <p>
                  Inspirado na tradição da tipografia suíça e nas publicações independentes contemporâneas, o sistema funciona diretamente no seu navegador: você escolhe entre cinco matrizes A4, preenche suas informações com salvamento automático local e exporta o documento em PDF vetorial sem marcas d’água.
                </p>
                <p>
                  O projeto permanece gratuito para todos e se mantém de forma independente por meio de espaços publicitários discretos apenas em páginas públicas informativas (nunca dentro do editor) e de contribuições voluntárias via Pix.
                </p>
              </div>
            </div>

            {/* Colofão Tipográfico e Técnico */}
            <div className="mt-10 pt-8 border-t border-paper grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <div className="tech-caption text-ink-subtle">FAMÍLIA SERIFADA</div>
                <div className="mt-1 font-serif text-xl text-ink">Instrument Serif</div>
                <div className="text-xs text-ink-muted">Títulos &amp; Numeração</div>
              </div>
              <div>
                <div className="tech-caption text-ink-subtle">FAMÍLIA GROTESCA</div>
                <div className="mt-1 font-sans text-base font-semibold text-ink">Plus Jakarta Sans</div>
                <div className="text-xs text-ink-muted">Corpo, Leitura &amp; UI</div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="tech-caption text-ink-subtle">ARQUITETURA</div>
                <div className="mt-1 font-mono text-xs font-semibold text-ink">Local-First / Zero Servidor</div>
                <div className="text-xs text-ink-muted">Seus dados ficam no seu aparelho</div>
              </div>
            </div>

            {/* Ponto de Acesso Discreto para Doação Voluntária via Pix (/apoie) na Página Inicial */}
            <div className="mt-8 border border-paper bg-ivory-warm/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <HeartHandshake className="w-4 h-4 text-vermilion shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-xs text-ink-muted leading-relaxed">
                  <strong className="text-ink font-semibold">Mantenha o FOLIO aberto e gratuito:</strong>{' '}
                  O projeto é independente e sem fins de assinatura. Se desejar apoiar voluntariamente sua manutenção via Pix, conheça nossa página de apoio.
                </div>
              </div>
              <a
                href="/apoie"
                onClick={(e) => {
                  if (onNavigateToRoute) {
                    e.preventDefault();
                    onNavigateToRoute('apoie');
                  }
                }}
                className="inline-flex items-center gap-1.5 border border-ink bg-ivory px-3.5 py-2 font-mono text-xs uppercase tracking-wider text-ink hover:bg-ink hover:text-ivory transition-colors shrink-0"
              >
                <span>Apoiar via Pix</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Coluna Direita (5 Colunas): Perfis Atendidos & Links Internos para Guias */}
          <div className="lg:col-span-5 divide-y divide-paper bg-ivory-warm/35 flex flex-col justify-between">
            <div className="px-4 sm:px-8 py-5 bg-ivory-warm border-b border-paper flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-ink font-medium">
                PARA QUEM PROJETAMOS O FOLIO
              </span>
              <a
                href="/como-fazer-um-curriculo"
                onClick={(e) => handleGuideClick(e, 'como-fazer-um-curriculo')}
                className="font-mono text-[11px] text-vermilion hover:underline inline-flex items-center gap-1"
              >
                <span>Manual completo</span>
                <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>

            <div className="divide-y divide-paper flex-1">
              {audienceProfiles.map((profile) => (
                <div key={profile.index} className="px-4 sm:px-8 py-6">
                  <div className="flex items-baseline justify-between mb-1.5">
                    <h3 className="font-serif text-2xl text-ink">{profile.title}</h3>
                    <span className="font-mono text-xs text-vermilion font-medium">
                      {profile.index}
                    </span>
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {profile.description}
                  </p>
                  <a
                    href={`/${profile.guideSlug}`}
                    onClick={(e) => handleGuideClick(e, profile.guideSlug)}
                    className="mt-2.5 inline-flex items-center gap-1 font-mono text-xs text-ink hover:text-vermilion underline decoration-paper underline-offset-4 transition-colors"
                  >
                    <span>{profile.guideLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
