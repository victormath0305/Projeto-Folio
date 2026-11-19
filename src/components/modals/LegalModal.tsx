import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  type: 'privacidade' | 'termos' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    if (!type) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [type, onClose]);

  if (!type) return null;

  const isPrivacy = type === 'privacidade';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="relative my-auto w-full max-w-2xl border-2 border-ink bg-ivory shadow-2xl">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-ink bg-ivory-warm px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 bg-vermilion inline-block" aria-hidden="true" />
            <h2
              id="legal-modal-title"
              className="font-mono text-xs uppercase tracking-widest text-ink font-semibold"
            >
              {isPrivacy
                ? 'DOCUMENTO NORMATIVO · POLÍTICA DE PRIVACIDADE'
                : 'DOCUMENTO NORMATIVO · TERMOS DE USO'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 border border-ink bg-ivory text-ink hover:bg-vermilion hover:border-vermilion hover:text-sheet transition-colors"
            aria-label="Fechar documento"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Corpo do Documento */}
        <div className="p-6 sm:p-8 space-y-5 text-sm text-ink-muted leading-relaxed max-h-[75vh] overflow-y-auto">
          {isPrivacy ? (
            <>
              <h3 className="font-serif text-3xl text-ink">
                Privacidade e Armazenamento no Seu Navegador
              </h3>
              <p>
                Um currículo contém informações pessoais sensíveis: histórico profissional, formação acadêmica, telefone, e-mail e cidade de residência. Por isso, o <strong className="text-ink">FOLIO</strong> foi projetado para operar diretamente no seu navegador.
              </p>
              <div className="border-l-2 border-vermilion pl-4 py-1 text-ink font-medium">
                Não possuímos banco de dados centralizado de candidatos, não exigimos criação de conta e não comercializamos dados pessoais.
              </div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold pt-2">
                1. Armazenamento Local e Exportação
              </h4>
              <p>
                Seus rascunhos, preferências de modelo e fotografia opcional ficam salvos apenas no armazenamento local do dispositivo utilizado. Toda a montagem das páginas A4 e a geração do PDF acontecem no seu navegador.
              </p>
              <h4 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold pt-2">
                2. Estatísticas e Publicidade em Páginas Públicas
              </h4>
              <p>
                Utilizamos o Vercel Web Analytics (sem cookies) para estatísticas agregadas de acesso. Nas páginas públicas informativas (nunca dentro do editor), o Google AdSense pode utilizar cookies publicitários conforme a preferência de consentimento definida na página de Privacidade.
              </p>
            </>
          ) : (
            <>
              <h3 className="font-serif text-3xl text-ink">
                Termos de Uso &amp; Compromisso de Gratuidade
              </h3>
              <p>
                O <strong className="text-ink">FOLIO</strong> é uma ferramenta pública e gratuita voltada à criação e formatação de currículos profissionais em formato A4.
              </p>
              <h4 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold pt-2">
                1. Licença de Uso dos Cinco Modelos Profissionais
              </h4>
              <p>
                Todos os documentos gerados nos modelos <strong>Essencial</strong>, <strong>Editorial</strong>, <strong>Clássico</strong>, <strong>Executivo</strong> e <strong>Técnico</strong> pertencem integralmente ao usuário autor das informações, podendo ser impressos, enviados por e-mail ou anexados em plataformas de recrutamento sem restrições.
              </p>
              <h4 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold pt-2">
                2. Ausência de Marcas D’Água e Cobranças Ocultas
              </h4>
              <p>
                Mantemos a criação e exportação dos cinco modelos livre de marcas d’água promocionais ou bloqueios de pagamento ao final do preenchimento.
              </p>
              <h4 className="font-mono text-xs uppercase tracking-wider text-ink font-semibold pt-2">
                3. Responsabilidade Editorial
              </h4>
              <p>
                A veracidade das informações profissionais, datas e qualificações inseridas no documento é de responsabilidade exclusiva do candidato.
              </p>
            </>
          )}
        </div>

        {/* Rodapé */}
        <div className="border-t border-paper bg-ivory-warm px-6 py-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-editorial-primary py-2 px-5 text-xs"
          >
            Compreendido
          </button>
        </div>
      </div>
    </div>
  );
};
