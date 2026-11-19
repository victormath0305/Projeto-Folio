import React from 'react';
import { ArrowLeft, ArrowUpRight, FileQuestion } from 'lucide-react';
import { AppRouteView } from '../../services/seoService';

interface NotFoundPageProps {
  onNavigateToRoute: (route: AppRouteView) => void;
  onStartEditor: () => void;
}

/**
 * Página 404 Personalizada com a Identidade Editorial do FOLIO (Fase 06 — Seção 5)
 */
export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateToRoute,
  onStartEditor,
}) => {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="bg-ivory text-ink border-b border-ink py-16 sm:py-24 px-4 sm:px-8"
    >
      <div className="mx-auto max-w-4xl border-2 border-ink bg-ivory-warm/50 p-6 sm:p-12">
        <div className="flex items-center justify-between border-b border-ink pb-4 mb-8 font-mono text-xs uppercase tracking-widest text-ink-muted">
          <span className="inline-flex items-center gap-2 text-vermilion font-semibold">
            <FileQuestion className="w-4 h-4" aria-hidden="true" />
            ERRO HTTP 404 · LAUDA NÃO ENCONTRADA
          </span>
          <span>ACERVO FOLIO</span>
        </div>

        <h1
          id="not-found-heading"
          className="font-serif text-4xl sm:text-6xl text-ink tracking-tight leading-[1.04]"
        >
          Esta página não consta no{' '}
          <span className="italic text-vermilion">nosso índice editorial.</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-ink-muted leading-relaxed max-w-2xl">
          O endereço acessado pode ter sido digitado incorretamente ou movido. Seus dados curriculares salvos localmente no navegador permanecem intactos.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3.5">
          <button
            type="button"
            onClick={() => onNavigateToRoute('landing')}
            className="btn-editorial-primary py-3.5 px-6 text-xs sm:text-sm"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Voltar para a página inicial</span>
          </button>

          <button
            type="button"
            onClick={onStartEditor}
            className="btn-editorial-secondary py-3.5 px-6 text-xs sm:text-sm bg-ivory"
          >
            <span>Abrir editor de currículos</span>
            <ArrowUpRight className="w-4 h-4 text-vermilion" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateToRoute('modelos-de-curriculo')}
            className="btn-editorial-secondary py-3.5 px-5 text-xs sm:text-sm bg-ivory"
          >
            <span>Ver 5 modelos A4</span>
          </button>
        </div>
      </div>
    </section>
  );
};
