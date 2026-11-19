import React, { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { PublicGuideSlug } from '../../services/seoService';
import { ResumeTemplateId } from '../../types/resume';

interface HeaderProps {
  selectedTemplateId: ResumeTemplateId;
  onOpenStartModal: (templateId?: ResumeTemplateId) => void;
  onNavigateToRoute?: (route: 'landing' | 'editor' | PublicGuideSlug) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedTemplateId,
  onOpenStartModal,
  onNavigateToRoute,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { index: '01', label: 'Modelos', href: '#modelos' },
    { index: '02', label: 'Como funciona', href: '#como-funciona' },
    { index: '03', label: 'Sobre', href: '#sobre' },
  ];

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigateToRoute && window.location.pathname !== '/') {
      e.preventDefault();
      onNavigateToRoute('landing');
    }
  };

  const handleSectionLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setMobileMenuOpen(false);
    if (onNavigateToRoute && window.location.pathname !== '/') {
      e.preventDefault();
      onNavigateToRoute('landing');
      window.setTimeout(() => {
        window.location.hash = href;
      }, 50);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-sm border-b border-ink">
      {/* Faixa Técnica de Expediente Editorial (Colofão Superior) */}
      <div className="border-b border-paper bg-ivory-warm/70 px-3 sm:px-8 py-1.5">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-ink-muted">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-ink font-medium truncate">
              <span className="h-1.5 w-1.5 bg-vermilion inline-block shrink-0" aria-hidden="true" />
              <span>EDIÇÃO N° 01 · FUNDAÇÃO</span>
            </span>
            <span className="hidden md:inline text-paper-dark">|</span>
            <span className="hidden md:inline">COMPOSITOR TIPOGRÁFICO A4 (ISO 216)</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline">ACESSO PÚBLICO · ZERO MARCA D’ÁGUA</span>
            <span className="text-vermilion font-semibold">BR / PT</span>
          </div>
        </div>
      </div>

      {/* Barra Principal de Navegação */}
      <div className="mx-auto max-w-7xl px-3 sm:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-2 sm:gap-4">
          {/* Logotipo Tipográfico FOLIO */}
          <div className="flex items-baseline gap-4">
            <a
              href="#topo"
              onClick={handleLogoClick}
              className="group inline-flex items-baseline gap-1 focus:outline-none"
              aria-label="FOLIO — Página inicial do gerador de currículos"
            >
              <span className="font-serif text-3xl sm:text-4xl tracking-tight text-ink transition-colors group-hover:text-vermilion">
                FOLIO
              </span>
              <span
                className="inline-block h-2 w-2 bg-vermilion transition-transform duration-200 group-hover:scale-125"
                aria-hidden="true"
              />
            </a>
            <span className="hidden lg:inline-block font-mono text-[10px] uppercase tracking-widest text-ink-muted border-l border-paper pl-3">
              Arquitetura de Currículos
            </span>
          </div>

          {/* Navegação Desktop */}
          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-7 lg:gap-9"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSectionLinkClick(e, item.href)}
                className="group relative py-1 text-sm font-medium text-ink transition-colors hover:text-vermilion"
              >
                <span className="font-mono text-[10px] text-ink-subtle mr-1.5 transition-colors group-hover:text-vermilion">
                  {item.index}.
                </span>
                <span>{item.label}</span>
                <span
                  className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-vermilion transition-all duration-200 group-hover:w-full"
                  aria-hidden="true"
                />
              </a>
            ))}

            {onNavigateToRoute && (
              <a
                href="/como-fazer-um-curriculo"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToRoute('como-fazer-um-curriculo');
                }}
                className="group relative py-1 text-sm font-medium text-ink transition-colors hover:text-vermilion"
              >
                <span className="font-mono text-[10px] text-ink-subtle mr-1.5 transition-colors group-hover:text-vermilion">
                  04.
                </span>
                <span>Guias</span>
                <span
                  className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-vermilion transition-all duration-200 group-hover:w-full"
                  aria-hidden="true"
                />
              </a>
            )}
          </nav>

          {/* Ação Principal Desktop + Botão Mobile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => onOpenStartModal(selectedTemplateId)}
              className="hidden sm:inline-flex items-center gap-2.5 bg-ink text-ivory px-5 py-2.5 text-xs sm:text-sm font-medium tracking-wide border border-ink transition-all duration-200 hover:bg-vermilion hover:border-vermilion hover:text-sheet hover:-translate-y-0.5 hover:shadow-architectural active:translate-y-0"
            >
              <span>Criar currículo</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center p-2.5 border border-ink text-ink hover:bg-ivory-warm transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="menu-navegacao-mobile"
              aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Painel de Navegação Mobile Adaptado (Composição Editorial) */}
      {mobileMenuOpen && (
        <div
          id="menu-navegacao-mobile"
          className="md:hidden border-t border-ink bg-ivory px-4 pt-4 pb-6"
        >
          <div className="tech-caption text-ink-muted mb-3">
            ÍNDICE DE NAVEGAÇÃO
          </div>
          <nav aria-label="Navegação móvel" className="divide-y divide-paper border-y border-paper mb-5">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSectionLinkClick(e, item.href)}
                className="flex items-center justify-between py-3.5 text-base font-medium text-ink hover:text-vermilion"
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-vermilion">{item.index}</span>
                  <span>{item.label}</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-ink-muted" aria-hidden="true" />
              </a>
            ))}
            {onNavigateToRoute && (
              <a
                href="/como-fazer-um-curriculo"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  onNavigateToRoute('como-fazer-um-curriculo');
                }}
                className="flex items-center justify-between py-3.5 text-base font-medium text-ink hover:text-vermilion"
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-vermilion">04</span>
                  <span>Guias de Currículo</span>
                </span>
                <ArrowUpRight className="w-4 h-4 text-ink-muted" aria-hidden="true" />
              </a>
            )}
          </nav>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenStartModal(selectedTemplateId);
            }}
            className="w-full btn-editorial-primary"
          >
            <span>Criar currículo</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </header>
  );
};
