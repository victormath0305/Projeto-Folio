import React, { useRef, useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { processAndSanitizePhotoFile } from '../../../services/imageSecurityService';
import { PersonalInfo } from '../../../types/resume';
import { validateEmailFormat, validatePhoneFormat } from '../editorConfig';

interface PersonalSectionFormProps {
  mode: 'dados-pessoais' | 'objetivo' | 'resumo';
  personal: PersonalInfo;
  onChange: (updates: Partial<PersonalInfo>) => void;
}

export const PersonalSectionForm: React.FC<PersonalSectionFormProps> = ({
  mode,
  personal,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const emailWarning = validateEmailFormat(personal.email);
  const phoneWarning = validatePhoneFormat(personal.phone);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setPhotoError(null);
    if (!file) return;

    const result = await processAndSanitizePhotoFile(file);
    if (result.ok && result.dataUrl) {
      onChange({ photoUrl: result.dataUrl });
    } else {
      setPhotoError(
        result.error ||
          'Não foi possível validar o conteúdo da imagem selecionada.'
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (mode === 'objetivo') {
    return (
      <div className="space-y-6">
        {/* Orientação Editorial sobre Objetivo Profissional */}
        <div className="border-l-2 border-vermilion bg-ivory-warm/70 p-4 space-y-2">
          <div className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold">
            COMO ESCREVER UM BOM OBJETIVO PROFISSIONAL
          </div>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            Seja direto e específico em 1 ou 2 frases: mencione o <strong>cargo ou área</strong> que você busca, seu momento atual (ex.: <em>primeiro emprego</em>, <em>estágio</em> ou <em>atuação sênior</em>) e de que forma pretende colaborar com a equipe. Evite frases vagas como “busco somar na empresa”.
          </p>
          <div className="pt-1 font-mono text-[11px] text-ink-subtle">
            Exemplo: “Atuar como Analista Financeiro Júnior, aplicando conhecimentos em controle de fluxo de caixa e automação de relatórios em Excel.”
          </div>
        </div>

        <div>
          <label
            htmlFor="field-objective"
            className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1.5"
          >
            Objetivo profissional
          </label>
          <textarea
            id="field-objective"
            rows={4}
            value={personal.objective ?? ''}
            onChange={(e) => onChange({ objective: e.target.value })}
            placeholder="Descreva em poucas linhas o cargo ou área pretendida e seu foco de contribuição..."
            className="w-full border border-ink bg-sheet p-3.5 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none leading-relaxed"
          />
          <div className="mt-1.5 flex justify-between font-mono text-[11px] text-ink-subtle">
            <span>Campo opcional · Atualiza a folha A4 instantaneamente</span>
            <span>{(personal.objective ?? '').length} caracteres</span>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'resumo') {
    return (
      <div className="space-y-6">
        {/* Orientação Editorial sobre Resumo Profissional */}
        <div className="border-l-2 border-vermilion bg-ivory-warm/70 p-4 space-y-2">
          <div className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold">
            ORIENTAÇÃO EDITORIAL · RESUMO PROFISSIONAL
          </div>
          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            Sintetize sua trajetória em um parágrafo curto (3 a 5 linhas). Apresente sua área de especialidade, principais ferramentas ou competências que domina e o tipo de resultado que costuma entregar. Se estiver buscando o primeiro emprego, destaque sua formação, dedicação acadêmica e projetos práticos.
          </p>
        </div>

        <div>
          <label
            htmlFor="field-summary"
            className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1.5"
          >
            Resumo profissional
          </label>
          <textarea
            id="field-summary"
            rows={5}
            value={personal.summary}
            onChange={(e) => onChange({ summary: e.target.value })}
            placeholder="Apresente sua trajetória, qualificações principais e áreas de domínio..."
            className="w-full border border-ink bg-sheet p-3.5 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none leading-relaxed"
          />
          <div className="mt-1.5 flex justify-between font-mono text-[11px] text-ink-subtle">
            <span>Recomendado: entre 180 e 450 caracteres</span>
            <span>{personal.summary.length} caracteres</span>
          </div>
        </div>
      </div>
    );
  }

  /* MODO 01: DADOS PESSOAIS */
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label
            htmlFor="field-fullName"
            className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1"
          >
            Nome completo
          </label>
          <input
            id="field-fullName"
            type="text"
            value={personal.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            placeholder="Ex.: Mariana Costa Ribeiro"
            className="w-full border border-ink bg-sheet px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="field-roleTitle"
            className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1"
          >
            Cargo ou título profissional
          </label>
          <input
            id="field-roleTitle"
            type="text"
            value={personal.roleTitle}
            onChange={(e) => onChange({ roleTitle: e.target.value })}
            placeholder="Ex.: Desenvolvedora Web Júnior · ou · Estudante de Administração"
            className="w-full border border-ink bg-sheet px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
          />
          <p className="mt-1 text-xs text-ink-muted">
            Aparece logo abaixo do seu nome no cabeçalho da folha A4.
          </p>
        </div>

        <div>
          <label
            htmlFor="field-email"
            className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1"
          >
            E-mail
          </label>
          <input
            id="field-email"
            type="email"
            value={personal.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="Ex.: mariana.ribeiro@email.com.br"
            aria-invalid={Boolean(emailWarning)}
            className="w-full border border-ink bg-sheet px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
          />
          {emailWarning && (
            <p className="mt-1 font-mono text-[11px] text-vermilion">
              {emailWarning}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="field-phone"
            className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1"
          >
            Telefone / WhatsApp
          </label>
          <input
            id="field-phone"
            type="tel"
            value={personal.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="Ex.: (11) 98765-4321"
            aria-invalid={Boolean(phoneWarning)}
            className="w-full border border-ink bg-sheet px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
          />
          {phoneWarning && (
            <p className="mt-1 font-mono text-[11px] text-vermilion">
              {phoneWarning}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="field-location"
            className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1"
          >
            Cidade e estado
          </label>
          <input
            id="field-location"
            type="text"
            value={personal.location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="Ex.: Recife, PE"
            className="w-full border border-ink bg-sheet px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="field-address"
            className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1"
          >
            Endereço <span className="text-ink-subtle font-normal">(opcional)</span>
          </label>
          <input
            id="field-address"
            type="text"
            value={personal.address ?? ''}
            onChange={(e) => onChange({ address: e.target.value })}
            placeholder="Ex.: Bairro Boa Viagem"
            className="w-full border border-ink bg-sheet px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="field-linkedin"
            className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1"
          >
            LinkedIn <span className="text-ink-subtle font-normal">(opcional)</span>
          </label>
          <input
            id="field-linkedin"
            type="text"
            value={personal.linkedin ?? ''}
            onChange={(e) => onChange({ linkedin: e.target.value })}
            placeholder="Ex.: linkedin.com/in/marianaribeiro"
            className="w-full border border-ink bg-sheet px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="field-portfolio"
            className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold mb-1"
          >
            Portfólio ou site <span className="text-ink-subtle font-normal">(opcional)</span>
          </label>
          <input
            id="field-portfolio"
            type="text"
            value={personal.portfolio ?? ''}
            onChange={(e) => onChange({ portfolio: e.target.value })}
            placeholder="Ex.: github.com/mariana · ou · behance.net/mariana"
            className="w-full border border-ink bg-sheet px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-subtle/60 focus:border-vermilion focus:outline-none"
          />
        </div>
      </div>

      {/* Campo de Foto Opcional */}
      <div className="border-t border-paper pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-paper bg-ivory-warm/50 p-4">
          <div className="flex items-center gap-4">
            {personal.photoUrl ? (
              <img
                src={personal.photoUrl}
                alt="Prévia da foto do currículo"
                className="w-14 h-18 object-cover border border-ink bg-sheet shrink-0"
              />
            ) : (
              <div className="w-14 h-18 border border-dashed border-ink/50 bg-ivory flex items-center justify-center text-ink-subtle shrink-0">
                <Camera className="w-5 h-5" aria-hidden="true" />
              </div>
            )}
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                Foto de perfil <span className="text-ink-subtle font-normal">(opcional)</span>
              </div>
              <p className="text-xs text-ink-muted mt-0.5 max-w-md leading-relaxed">
                No Brasil, a foto não é obrigatória na maioria dos processos seletivos. Se optar por incluí-la, escolha uma imagem bem iluminada e com fundo neutro.
              </p>
              {photoError && (
                <p className="mt-1 font-mono text-[11px] text-vermilion">{photoError}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoUpload}
              className="sr-only"
              id="field-photo-upload"
            />
            <label
              htmlFor="field-photo-upload"
              className="cursor-pointer inline-flex items-center gap-1.5 border border-ink bg-ivory px-3 py-2 text-xs font-mono uppercase tracking-wider text-ink hover:bg-ink hover:text-ivory transition-colors"
            >
              <Camera className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{personal.photoUrl ? 'Trocar foto' : 'Adicionar foto'}</span>
            </label>

            {personal.photoUrl && (
              <button
                type="button"
                onClick={() => {
                  onChange({ photoUrl: '' });
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="inline-flex items-center gap-1 border border-paper bg-ivory px-2.5 py-2 text-xs font-mono uppercase tracking-wider text-vermilion hover:border-vermilion transition-colors"
                aria-label="Remover foto do currículo"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Remover</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
