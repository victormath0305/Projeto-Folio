import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AppRouteView, PublicGuideSlug } from '../../services/seoService';
import { ResumeTemplateId } from '../../types/resume';

interface FooterProps {
  onOpenLegalModal: (type: 'privacidade' | 'termos') => void;
  onOpenStartModal: (templateId?: ResumeTemplateId) => void;
  onNavigateToRoute?: (route: AppRouteView) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLegalModal,
  onOpenStartModal,
  onNavigateToRoute,
}) => {
  const publicSeoLinks: { slug: PublicGuideSlug; path: string; label: string }[] = [
    {
      slug: 'modelos-de-curriculo',
      path: '/modelos-de-curriculo',
      label: 'Modelos de currículo profissional (5 Matrizes A4)',
    },
    {
      slug: 'curriculo-primeiro-emprego',
      path: '/curriculo-primeiro-emprego',
      label: 'Currículo para primeiro emprego e estágio',
    },
    {
      slug: 'curriculo-sem-experiencia',
      path: '/curriculo-sem-experiencia',
      label: 'Como montar currículo sem experiência',
    },
    {
      slug: 'como-fazer-um-curriculo',
      path: '/como-fazer-um-curriculo',
      label: 'Como fazer um currículo passo a passo',
    },
    {
      slug: 'curriculo-profissional',
      path: '/curriculo-profissional',
      label: 'Currículo profissional para imprimir em PDF',
    },
  ];

  const handleSeoLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    slug: PublicGuideSlug
  ) => {
    if (onNavigateToRoute) {
      e.preventDefault();
      onNavigateToRoute(slug);
    }
  };

  const handleSectionAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash: string
  ) => {
    if (onNavigateToRoute && window.location.pathname !== '/') {
      e.preventDefault();
      onNavigateToRoute('landing');
      window.setTimeout(() => {
        const targetId = hash.replace(/^#/, '');
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.hash = hash;
        }
      }, 60);
    }
  };

  return (
    <footer className="bg-ink text-ivory border-t border-ink" role="contentinfo">
      <div className="mx-auto max-w-7xl">
        {/* Bloco Principal do Rodapé em Grade Editorial */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-ivory/15">
          {/* Coluna 1 (4 Colunas): Identidade FOLIO e Sobre o Projeto */}
          <div className="md:col-span-4 px-4 sm:px-8 py-12 flex flex-col justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-4xl sm:text-5xl tracking-tight text-ivory">
                  FOLIO
                </span>
                <span className="inline-block h-2.5 w-2.5 bg-vermilion" aria-hidden="true" />
              </div>

              <p className="mt-4 text-sm text-paper leading-relaxed">
                <strong className="text-ivory font-medium">Sobre o projeto:</strong>{' '}
                Gerador de currículos gratuito e plataforma aberta de composição tipográfica em formato A4. Projetado para quem busca criar currículo grátis, fazer currículo online e baixar em PDF com privacidade local.
              </p>
            </div>

            {/* Selo de Informação de Gratuidade */}
            <div className="mt-8 border border-ivory/20 bg-ivory/5 p-4">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-vermilion mb-1">
                <span className="h-1.5 w-1.5 bg-vermilion inline-block" aria-hidden="true" />
                <span>Informação de Gratuidade</span>
              </div>
              <p className="text-xs text-paper leading-relaxed">
                O FOLIO é 100% gratuito. Não exigimos cartão de crédito, não criamos assinaturas ocultas e nunca inserimos marcas d’água nos seus documentos exportados.
              </p>
            </div>
          </div>

          {/* Coluna 2 (4 Colunas): Guias Públicos & Modelos de Currículo (Links Internos SEO) */}
          <div className="md:col-span-4 px-4 sm:px-8 py-12 flex flex-col justify-between">
            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-vermilion mb-5">
                Guias &amp; Modelos de Currículo
              </h2>
              <ul className="space-y-3 text-sm">
                {publicSeoLinks.map((item, idx) => (
                  <li key={item.slug}>
                    <a
                      href={item.path}
                      onClick={(e) => handleSeoLinkClick(e, item.slug)}
                      className="text-paper hover:text-ivory transition-colors inline-flex items-baseline gap-2"
                    >
                      <span className="font-mono text-xs text-ivory/50">0{idx + 1}.</span>
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-ivory/15">
              <div className="font-mono text-[10px] uppercase tracking-widest text-paper/70 mb-2">
                Navegação da Capa
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-paper">
                <a href="#topo" onClick={(e) => handleSectionAnchorClick(e, '#topo')} className="hover:text-ivory">Início</a>
                <a href="#modelos" onClick={(e) => handleSectionAnchorClick(e, '#modelos')} className="hover:text-ivory">Modelos A4</a>
                <a href="#beneficios" onClick={(e) => handleSectionAnchorClick(e, '#beneficios')} className="hover:text-ivory">Benefícios</a>
                <a href="#como-funciona" onClick={(e) => handleSectionAnchorClick(e, '#como-funciona')} className="hover:text-ivory">Como funciona</a>
                <a href="#sobre" onClick={(e) => handleSectionAnchorClick(e, '#sobre')} className="hover:text-ivory">Sobre</a>
              </div>
            </div>
          </div>

          {/* Coluna 3 (4 Colunas): Governança, Privacidade e Ação */}
          <div className="md:col-span-4 px-4 sm:px-8 py-12 flex flex-col justify-between">
            <div>
              <h2 className="font-mono text-xs uppercase tracking-widest text-vermilion mb-5">
                Transparência &amp; Termos
              </h2>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="/privacidade"
                    onClick={(e) => {
                      if (onNavigateToRoute) {
                        e.preventDefault();
                        onNavigateToRoute('privacidade');
                      } else {
                        e.preventDefault();
                        onOpenLegalModal('privacidade');
                      }
                    }}
                    className="text-paper hover:text-ivory transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Política de Privacidade</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    href="/termos-de-uso"
                    onClick={(e) => {
                      if (onNavigateToRoute) {
                        e.preventDefault();
                        onNavigateToRoute('termos-de-uso');
                      } else {
                        e.preventDefault();
                        onOpenLegalModal('termos');
                      }
                    }}
                    className="text-paper hover:text-ivory transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Termos de Uso</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    href="/contato"
                    onClick={(e) => {
                      if (onNavigateToRoute) {
                        e.preventDefault();
                        onNavigateToRoute('contato');
                      }
                    }}
                    className="text-paper hover:text-ivory transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Contato institucional</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    href="/apoie"
                    onClick={(e) => {
                      if (onNavigateToRoute) {
                        e.preventDefault();
                        onNavigateToRoute('apoie');
                      }
                    }}
                    className="text-paper hover:text-ivory transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Apoie o projeto (Doação voluntária Pix)</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
                  </a>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-ivory/15 text-xs text-paper/80 space-y-1 font-mono">
                <div>FORMATO PADRÃO: A4 (210 × 297 MM)</div>
                <div>PRIVACIDADE: DADOS SALVOS NO SEU NAVEGADOR</div>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => onOpenStartModal()}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-vermilion text-sheet px-5 py-3.5 text-sm font-medium border border-vermilion transition-colors hover:bg-ivory hover:text-ink hover:border-ivory"
              >
                <span>Criar meu currículo agora</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Colofão Final */}
        <div className="border-t border-ivory/15 px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-paper/70">
          <div>
            © {new Date().getFullYear()} FOLIO — GERADOR DE CURRÍCULOS GRATUITO. TODOS OS DIREITOS DE COMPOSIÇÃO RESERVADOS AO USUÁRIO.
          </div>
          <div className="text-ivory">
            100% GRATUITO · SEM CADASTRO · FORMATO A4
          </div>
        </div>
      </div>
    </footer>
  );
};
