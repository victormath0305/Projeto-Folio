import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Lock,
  Mail,
  RotateCcw,
  Shield,
} from 'lucide-react';
import { SITE_CONFIG } from '../../config/siteConfig';
import {
  adSenseService,
  AdvertisingConsentMode,
} from '../../services/adSenseService';
import { analyticsService, ConsentStatus } from '../../services/analyticsService';
import { AppRouteView, PublicLegalSlug } from '../../services/seoService';
import { storageService } from '../../services/storageService';

interface PublicLegalPageProps {
  slug: Exclude<PublicLegalSlug, 'apoie'>;
  onNavigateToRoute: (route: AppRouteView) => void;
  onStartEditor: () => void;
}

export const PublicLegalPage: React.FC<PublicLegalPageProps> = ({
  slug,
  onNavigateToRoute,
  onStartEditor,
}) => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(() =>
    analyticsService.getConsentStatus()
  );
  const [adConsent, setAdConsent] = useState<AdvertisingConsentMode>(() =>
    adSenseService.getAdvertisingConsent()
  );
  const [localClearedMessage, setLocalClearedMessage] = useState<string | null>(
    null
  );

  const handleToggleConsent = (grant: boolean) => {
    analyticsService.setConsent(grant);
    setConsentStatus(analyticsService.getConsentStatus());
  };

  const handleSetAdvertisingConsent = (mode: AdvertisingConsentMode) => {
    adSenseService.setAdvertisingConsent(mode);
    setAdConsent(adSenseService.getAdvertisingConsent());
  };

  const handleClearLocalDataNow = () => {
    storageService.clearResumeDocument();
    storageService.clearPreferences();
    setLocalClearedMessage(
      'Todos os rascunhos de currículo e preferências locais foram removidos deste navegador.'
    );
  };

  const legalTabs: { id: Exclude<PublicLegalSlug, 'apoie'>; label: string; code: string }[] = [
    { id: 'privacidade', label: 'Política de Privacidade', code: 'DOC·01' },
    { id: 'termos-de-uso', label: 'Termos de Uso', code: 'DOC·02' },
    { id: 'contato', label: 'Contato Institucional', code: 'DOC·03' },
  ];

  return (
    <article className="bg-ivory text-ink border-b border-ink">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb Semântico */}
        <nav
          aria-label="Localização na documentação legal"
          className="border-b border-paper bg-ivory-warm/60 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink-muted"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateToRoute('landing')}
              className="inline-flex items-center gap-1.5 text-ink hover:text-vermilion font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Início FOLIO</span>
            </button>
            <span className="text-paper-dark">/</span>
            <span className="text-vermilion font-semibold uppercase">
              GOVERNANÇA, PRIVACIDADE &amp; TERMOS ({slug.toUpperCase()})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {legalTabs.map((tab) => {
              const active = tab.id === slug;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onNavigateToRoute(tab.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider border transition-colors ${
                    active
                      ? 'bg-ink text-ivory border-ink font-semibold'
                      : 'bg-ivory text-ink border-paper hover:border-ink'
                  }`}
                >
                  <span className="text-vermilion mr-1">{tab.code}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* ====================================================================
         * ROTA 1: /privacidade — POLÍTICA DE PRIVACIDADE
         * ==================================================================== */}
        {slug === 'privacidade' && (
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-8 px-4 sm:px-8 py-12 space-y-10 lg:border-r border-ink">
              <header className="border-b border-ink pb-6">
                <div className="inline-flex items-center gap-2 border border-ink bg-ivory-warm px-3 py-1 mb-4">
                  <Lock className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-ink font-medium">
                    DOCUMENTO NORMATIVO · ARQUITETURA LOCAL-FIRST &amp; LGPD
                  </span>
                </div>

                <h1 className="font-serif text-4xl sm:text-6xl text-ink tracking-tight leading-[1.02]">
                  Política de Privacidade e{' '}
                  <span className="italic text-vermilion">Proteção de Dados.</span>
                </h1>
                <p className="mt-4 text-sm sm:text-base text-ink-muted leading-relaxed">
                  Última atualização: Novembro de 2026. Esta política descreve com transparência técnica como o FOLIO trata os dados inseridos durante a criação do seu currículo.
                </p>
              </header>

              <section className="space-y-3">
                <div className="font-mono text-xs uppercase tracking-widest text-vermilion font-semibold">
                  § 01 — COMO OS DADOS DO CURRÍCULO SÃO ARMAZENADOS (LOCALSTORAGE)
                </div>
                <h2 className="font-serif text-3xl text-ink">
                  Armazenamento exclusivo no seu navegador e ausência de envio para servidores
                </h2>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  O <strong className="text-ink">FOLIO</strong> opera sob arquitetura <em>Local-First</em> (processamento integral no cliente). Todas as informações digitadas no editor — como nome, telefone, endereço de e-mail, experiências profissionais, formação acadêmica, cursos, habilidades e idiomas — são salvas exclusivamente no armazenamento local do seu próprio navegador (<code className="font-mono text-xs bg-ivory-warm px-1.5 py-0.5 border border-paper">window.localStorage</code>, nas chaves <code className="font-mono text-xs bg-ivory-warm px-1.5 py-0.5 border border-paper">folio:resume-document:v1</code> e <code className="font-mono text-xs bg-ivory-warm px-1.5 py-0.5 border border-paper">folio:workspace-preferences:v1</code>).
                </p>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  <strong>Ausência de transmissão para servidores:</strong> O FOLIO não possui banco de dados centralizado de candidatos e não envia o conteúdo do seu currículo para servidores externos. A paginação A4 e a geração do arquivo PDF vetorial ocorrem inteiramente na memória do seu dispositivo.
                </p>
              </section>

              <section className="space-y-3">
                <div className="font-mono text-xs uppercase tracking-widest text-vermilion font-semibold">
                  § 02 — TRATAMENTO DE FOTOGRAFIAS
                </div>
                <h2 className="font-serif text-3xl text-ink">
                  Processamento local de imagens de perfil
                </h2>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  A inclusão de fotografia no currículo é opcional. Quando você seleciona um arquivo de imagem (formatos aceitos: <code className="font-mono text-xs">JPG</code>, <code className="font-mono text-xs">PNG</code> ou <code className="font-mono text-xs">WebP</code>, limitado a <code className="font-mono text-xs">2 MB</code>), o arquivo é lido localmente pela API <code className="font-mono text-xs">FileReader</code> do navegador e convertido em uma string local (<code className="font-mono text-xs">Data URL base64</code>) para exibição na prévia A4 e incorporação direta no PDF. A fotografia nunca é enviada para servidores de armazenamento em nuvem.
                </p>
              </section>

              <section className="space-y-3">
                <div className="font-mono text-xs uppercase tracking-widest text-vermilion font-semibold">
                  § 03 — DEPENDÊNCIAS EXTERNAS, COOKIES E ANALYTICS MEDIANTE CONSENTIMENTO
                </div>
                <h2 className="font-serif text-3xl text-ink">
                  Transparência sobre requisições técnicas e telemetria opcional
                </h2>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  Para garantir total transparência técnica, informamos como funcionam os recursos de rede e monitoramento da aplicação:
                </p>
                <ul className="space-y-2.5 text-sm text-ink-muted list-disc list-inside">
                  <li>
                    <strong className="text-ink">Carregamento de Fontes Tipográficas (Google Fonts):</strong> A interface carrega as famílias tipográficas (<em>Instrument Serif</em>, <em>Newsreader</em>, <em>Plus Jakarta Sans</em> e <em>JetBrains Mono</em>) a partir dos servidores públicos do Google Fonts (<code className="font-mono text-xs">fonts.googleapis.com</code> e <code className="font-mono text-xs">fonts.gstatic.com</code>). Nessa requisição padrão de navegador, o provedor de fontes recebe apenas os cabeçalhos HTTP técnicos necessários para entregar os arquivos de fonte (como endereço IP e User-Agent do navegador), sem qualquer acesso aos dados do seu currículo.
                  </li>
                  <li>
                    <strong className="text-ink">Armazenamento Local vs. Cookies:</strong> O FOLIO não utiliza cookies de rastreamento publicitário ou de terceiros. Utilizamos apenas o <code className="font-mono text-xs">localStorage</code> do navegador para manter seu rascunho salvo e registrar sua escolha de consentimento (<code className="font-mono text-xs">folio:analytics-consent:v1</code>).
                  </li>
                  <li>
                    <strong className="text-ink">Analytics Mediante Consentimento (Opt-In):</strong> O módulo de métricas de uso (preparado para Google Analytics 4) permanece <strong>desativado por padrão</strong>. Somente caso você opte expressamente por autorizar o compartilhamento de métricas anônimas, poderão ser registrados cinco eventos estritamente técnicos de uso do produto (<code className="font-mono text-xs">page_view</code>, <code className="font-mono text-xs">start_resume</code>, <code className="font-mono text-xs">select_template</code>, <code className="font-mono text-xs">complete_resume</code> e <code className="font-mono text-xs">export_pdf</code>). Mesmo com o consentimento ativo, um filtro de lista branca no código bloqueia o envio de nome, telefone, e-mail ou qualquer texto do currículo.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <div className="font-mono text-xs uppercase tracking-widest text-vermilion font-semibold">
                  § 04 — GOOGLE ADSENSE, COOKIES DE PUBLICIDADE E ANÚNCIOS PERSONALIZADOS
                </div>
                <h2 className="font-serif text-3xl text-ink">
                  Exibição discreta de anúncios em páginas públicas e controle de consentimento
                </h2>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  Para sustentar a gratuidade do projeto sem cobrar assinaturas, o FOLIO possui integração preparada para exibição de espaços publicitários discretos via <strong className="text-ink">Google AdSense</strong> exclusivamente nas páginas públicas informativas (nunca dentro do editor de currículos nem nos PDFs exportados).
                </p>
                <ul className="space-y-2.5 text-sm text-ink-muted list-disc list-inside">
                  <li>
                    <strong className="text-ink">Cookies e Tecnologias de Publicidade de Terceiros:</strong> Quando o Google AdSense está ativo e você concede consentimento, o Google e seus parceiros podem utilizar cookies (como o cookie de publicidade do Google) e identificadores web para veicular anúncios com base nas visitas anteriores do usuário a este ou a outros sites na internet.
                  </li>
                  <li>
                    <strong className="text-ink">Anúncios Personalizados vs. Não Personalizados:</strong> Você pode escolher no painel ao lado se autoriza <strong>anúncios personalizados</strong>, se prefere apenas <strong>anúncios não personalizados</strong> (baseados apenas no contexto geral da página, sem criação de perfil comportamental, via parâmetro <code className="font-mono text-xs">requestNonPersonalizedAds = 1</code>) ou se mantém a inicialização de scripts de anúncios <strong>desativada</strong>.
                  </li>
                  <li>
                    <strong className="text-ink">Separação entre Consentimento (LGPD) e Aviso de Adblock:</strong> O gerenciamento de consentimento de privacidade (LGPD/GDPR) e o comunicado de recuperação de bloqueio de anúncios (Ad Blocking Recovery) operam como mecanismos independentes. Nenhuma tecnologia de publicidade que dependa de consentimento é iniciada antes da sua escolha explícita.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <div className="font-mono text-xs uppercase tracking-widest text-vermilion font-semibold">
                  § 05 — COMO LIMPAR SEUS DADOS E DIREITOS DO USUÁRIO (LGPD)
                </div>
                <h2 className="font-serif text-3xl text-ink">
                  Controle integral, exclusão imediata e revogação
                </h2>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  Em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD), você detém controle direto sobre suas informações. Como os dados residem no seu próprio navegador, você pode visualizá-los, retificá-los ou excluí-los permanentemente a qualquer instante clicando no botão <strong>“Limpar dados”</strong> no cabeçalho do editor, utilizando o painel de controle ao lado nesta página ou limpando os dados de sites nas configurações do seu navegador.
                </p>
              </section>
            </div>

            {/* Coluna Lateral: Painel Interativo de Privacidade, Limpeza Local e Consentimento */}
            <aside className="lg:col-span-4 p-6 sm:p-8 bg-ivory-warm/40 space-y-6 border-t lg:border-t-0 border-ink">
              {/* Controle de Consentimento de Publicidade (Google AdSense) */}
              <div className="border border-ink bg-ivory p-5 space-y-3.5">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                  <Shield className="w-4 h-4 text-vermilion" aria-hidden="true" />
                  <span>Consentimento de Publicidade (AdSense)</span>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Preferência atual para exibição de anúncios em páginas públicas:{' '}
                  <strong className="text-ink uppercase font-mono">
                    {adConsent === 'personalized'
                      ? 'Anúncios Personalizados'
                      : adConsent === 'non_personalized'
                        ? 'Anúncios Não Personalizados'
                        : 'Desativado (Padrão)'}
                  </strong>
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleSetAdvertisingConsent('personalized')}
                    aria-pressed={adConsent === 'personalized'}
                    className={`w-full py-2 px-3 text-xs font-mono uppercase tracking-wider border transition-colors ${
                      adConsent === 'personalized'
                        ? 'bg-ink text-ivory border-ink font-semibold'
                        : 'bg-ivory-warm text-ink border-paper hover:border-ink'
                    }`}
                  >
                    Permitir anúncios personalizados
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAdvertisingConsent('non_personalized')}
                    aria-pressed={adConsent === 'non_personalized'}
                    className={`w-full py-2 px-3 text-xs font-mono uppercase tracking-wider border transition-colors ${
                      adConsent === 'non_personalized'
                        ? 'bg-ink text-ivory border-ink font-semibold'
                        : 'bg-ivory-warm text-ink border-paper hover:border-ink'
                    }`}
                  >
                    Apenas anúncios não personalizados
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAdvertisingConsent('unset')}
                    aria-pressed={adConsent === 'unset'}
                    className={`w-full py-2 px-3 text-xs font-mono uppercase tracking-wider border transition-colors ${
                      adConsent === 'unset'
                        ? 'bg-vermilion text-sheet border-vermilion font-semibold'
                        : 'bg-ivory-warm text-ink border-paper hover:border-ink'
                    }`}
                  >
                    Desativar scripts de publicidade
                  </button>
                </div>
              </div>

              {/* Controle de Consentimento de Analytics */}
              <div className="border border-ink bg-ivory p-5 space-y-4">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                  <Shield className="w-4 h-4 text-vermilion" aria-hidden="true" />
                  <span>Preferência de Consentimento (Analytics)</span>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Status atual do envio de métricas anônimas de uso:{' '}
                  <strong className="text-ink uppercase font-mono">
                    {consentStatus === 'granted'
                      ? 'Autorizado (Opt-In)'
                      : 'Desativado (Padrão)'}
                  </strong>
                </p>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleConsent(true)}
                    aria-pressed={consentStatus === 'granted'}
                    className={`w-full py-2.5 px-3 text-xs font-mono uppercase tracking-wider border transition-colors ${
                      consentStatus === 'granted'
                        ? 'bg-ink text-ivory border-ink font-semibold'
                        : 'bg-ivory-warm text-ink border-paper hover:border-ink'
                    }`}
                  >
                    Autorizar métricas anônimas
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleConsent(false)}
                    aria-pressed={consentStatus !== 'granted'}
                    className={`w-full py-2.5 px-3 text-xs font-mono uppercase tracking-wider border transition-colors ${
                      consentStatus !== 'granted'
                        ? 'bg-vermilion text-sheet border-vermilion font-semibold'
                        : 'bg-ivory-warm text-ink border-paper hover:border-ink'
                    }`}
                  >
                    Manter desativado / Revogar
                  </button>
                </div>
              </div>

              {/* Painel de Exclusão Imediata do LocalStorage */}
              <div className="border border-ink bg-ivory p-5 space-y-4">
                <div className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                  Limpeza de Dados Locais
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Caso esteja utilizando um computador público ou compartilhado, você pode apagar imediatamente todos os dados do currículo salvos no navegador:
                </p>
                <button
                  type="button"
                  onClick={handleClearLocalDataNow}
                  className="w-full inline-flex items-center justify-center gap-2 border border-ink bg-ivory-warm px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-ink hover:bg-vermilion hover:border-vermilion hover:text-sheet transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Apagar dados locais deste navegador</span>
                </button>
                {localClearedMessage && (
                  <p
                    role="status"
                    className="text-xs font-mono text-vermilion font-medium"
                  >
                    ✓ {localClearedMessage}
                  </p>
                )}
              </div>

              {/* Canal de Contato sobre Privacidade */}
              <div className="border border-paper bg-ivory p-5 space-y-2 text-xs">
                <div className="font-mono uppercase tracking-wider text-ink font-semibold">
                  Dúvidas sobre Privacidade
                </div>
                <p className="text-ink-muted leading-relaxed">
                  Para questões relacionadas a esta política ou aos seus direitos, consulte nossa página de contato institucional.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigateToRoute('contato')}
                  className="inline-flex items-center gap-1 font-mono text-vermilion underline pt-1"
                >
                  <span>Acessar página de contato</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* ====================================================================
         * ROTA 2: /termos-de-uso — TERMOS DE USO
         * ==================================================================== */}
        {slug === 'termos-de-uso' && (
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-8 px-4 sm:px-8 py-12 space-y-9 lg:border-r border-ink">
              <header className="border-b border-ink pb-6">
                <div className="font-mono text-xs uppercase tracking-widest text-vermilion font-semibold mb-2">
                  DOCUMENTO NORMATIVO · LICENÇA PÚBLICA DE UTILIZAÇÃO
                </div>
                <h1 className="font-serif text-4xl sm:text-6xl text-ink tracking-tight leading-[1.02]">
                  Termos de Uso e{' '}
                  <span className="italic text-vermilion">Condições do Serviço.</span>
                </h1>
                <p className="mt-4 text-sm sm:text-base text-ink-muted leading-relaxed">
                  Ao utilizar o gerador de currículos FOLIO, você concorda com as condições transparentes descritas abaixo.
                </p>
              </header>

              <section className="space-y-2.5">
                <h2 className="font-serif text-2xl sm:text-3xl text-ink">
                  1. Natureza Gratuita do Serviço
                </h2>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  O <strong className="text-ink">FOLIO</strong> é disponibilizado gratuitamente para criação, diagramação e exportação de currículos em formato PDF A4. Não exigimos cadastro prévio, não cobramos taxas para download das cinco matrizes profissionais e não aplicamos marcas d’água promocionais nos documentos gerados.
                </p>
              </section>

              <section className="space-y-2.5">
                <h2 className="font-serif text-2xl sm:text-3xl text-ink">
                  2. Titularidade e Direitos sobre os Currículos Criados
                </h2>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  Todo o conteúdo textual e fotográfico inserido pelo usuário, bem como o arquivo PDF final exportado, pertencem integralmente ao usuário. Você possui licença livre e irrestrita para imprimir, enviar por e-mail, publicar em portais de emprego ou compartilhar seu currículo com recrutadores e empresas.
                </p>
              </section>

              <section className="space-y-2.5">
                <h2 className="font-serif text-2xl sm:text-3xl text-ink">
                  3. Responsabilidade pelas Informações Inseridas
                </h2>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  O usuário é o único responsável pela veracidade, exatidão, atualização e legalidade dos dados pessoais, histórico acadêmico, certificações e experiências profissionais declarados em seu currículo. O FOLIO atua exclusivamente como ferramenta de diagramação tipográfica e não realiza verificação cadastral das informações digitadas.
                </p>
              </section>

              <section className="space-y-2.5">
                <h2 className="font-serif text-2xl sm:text-3xl text-ink">
                  4. Limitações Técnicas e Armazenamento Local
                </h2>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  Como o FOLIO preserva sua privacidade salvando o rascunho apenas no armazenamento local (<code className="font-mono text-xs">LocalStorage</code>) do navegador utilizado, os dados não são sincronizados na nuvem entre aparelhos diferentes. Caso você limpe os dados de navegação do seu navegador, utilize janelas anônimas/privadas ou troque de dispositivo, o rascunho anterior não estará disponível. Recomendamos fortemente baixar e guardar seu arquivo PDF ao concluir a edição.
                </p>
              </section>

              <section className="space-y-2.5">
                <h2 className="font-serif text-2xl sm:text-3xl text-ink">
                  5. Disponibilidade do Serviço e Limitações de Responsabilidade
                </h2>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  A plataforma é fornecida “no estado em que se encontra” (<em>as-is</em>). Embora empreguemos boas práticas de engenharia, tipografia e compatibilidade com sistemas de recrutamento (ATS), o FOLIO não garante contratação, convocação para entrevistas ou aprovação automática em processos seletivos, que dependem exclusivamente dos critérios de cada empregador.
                </p>
              </section>

              <section className="space-y-2.5">
                <h2 className="font-serif text-2xl sm:text-3xl text-ink">
                  6. Regras de Utilização
                </h2>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  É vedado utilizar a ferramenta para gerar documentos fraudulentos, falsidade ideológica, violação de direitos de terceiros ou tentativas de exploração técnica da infraestrutura da aplicação.
                </p>
              </section>
            </div>

            <aside className="lg:col-span-4 p-6 sm:p-8 bg-ivory-warm/40 flex flex-col justify-between border-t lg:border-t-0 border-ink">
              <div className="border border-ink bg-ivory p-5 space-y-4">
                <div className="font-mono text-xs uppercase tracking-wider text-vermilion font-semibold">
                  RESUMO DOS SEUS DIREITOS
                </div>
                <ul className="space-y-2.5 text-xs text-ink-muted">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-vermilion shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Uso 100% gratuito para uso pessoal e profissional.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-vermilion shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Zero marca d’água nos PDFs exportados.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-vermilion shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Seus dados nunca são vendidos ou retidos em servidores.</span>
                  </li>
                </ul>
                <button
                  type="button"
                  onClick={onStartEditor}
                  className="w-full btn-editorial-primary py-3 text-xs"
                >
                  <span>Abrir editor de currículos</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-8 pt-4 border-t border-paper font-mono text-[10px] text-ink-subtle uppercase">
                FOLIO · TERMOS DE USO PÚBLICOS
              </div>
            </aside>
          </div>
        )}

        {/* ====================================================================
         * ROTA 3: /contato — CONTATO INSTITUCIONAL
         * ==================================================================== */}
        {slug === 'contato' && (
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-8 px-4 sm:px-8 py-12 space-y-8 lg:border-r border-ink">
              <header className="border-b border-ink pb-6">
                <div className="inline-flex items-center gap-2 border border-ink bg-ivory-warm px-3 py-1 mb-4">
                  <Mail className="w-3.5 h-3.5 text-vermilion" aria-hidden="true" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-ink font-medium">
                    EXPEDIENTE &amp; ATENDIMENTO · PROJETO FOLIO
                  </span>
                </div>
                <h1 className="font-serif text-4xl sm:text-6xl text-ink tracking-tight leading-[1.02]">
                  Contato e{' '}
                  <span className="italic text-vermilion">Canal Institucional.</span>
                </h1>
                <p className="mt-4 text-sm sm:text-base text-ink-muted leading-relaxed">
                  Canal dedicado a dúvidas sobre o funcionamento do gerador de currículos, relatos técnicos de paginação A4, acessibilidade e solicitações relacionadas à Política de Privacidade.
                </p>
              </header>

              {SITE_CONFIG.contactEmail ? (
                <section className="border border-ink bg-ivory-warm/50 p-6 space-y-3">
                  <div className="font-mono text-xs uppercase tracking-widest text-vermilion font-semibold">
                    CORREIO ELETRÔNICO OFICIAL
                  </div>
                  <h2 className="font-serif text-3xl text-ink">
                    Atendimento via E-mail
                  </h2>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    Envie sua mensagem diretamente para o endereço oficial da equipe do projeto:
                  </p>
                  <div className="pt-2">
                    <a
                      href={`mailto:${SITE_CONFIG.contactEmail}`}
                      className="inline-flex items-center gap-2 border border-ink bg-ink text-ivory px-5 py-3 font-mono text-xs hover:bg-vermilion hover:border-vermilion transition-colors"
                    >
                      <Mail className="w-4 h-4" aria-hidden="true" />
                      <span>{SITE_CONFIG.contactEmail}</span>
                    </a>
                  </div>
                </section>
              ) : (
                <section
                  aria-labelledby="pending-contact-heading"
                  className="border-2 border-ink bg-ivory-warm/70 p-6 space-y-3"
                >
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-vermilion font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>CONFIGURAÇÃO DE LANÇAMENTO · CANAL DE CONTATO</span>
                  </div>
                  <h2
                    id="pending-contact-heading"
                    className="font-serif text-2xl sm:text-3xl text-ink"
                  >
                    Canal de e-mail institucional aguardando definição de publicação
                  </h2>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    Em respeito à política de transparência do FOLIO, não exibimos endereços, telefones ou e-mails fictícios. O endereço oficial de correio eletrônico será ativado pelo administrador do projeto por meio da variável de ambiente <code className="font-mono text-xs bg-ivory px-1.5 py-0.5 border border-paper">VITE_CONTACT_EMAIL</code> no momento da publicação definitiva do domínio.
                  </p>
                </section>
              )}

              <section className="space-y-3 pt-2">
                <h2 className="font-serif text-2xl text-ink">
                  Importante: Segurança dos seus dados ao entrar em contato
                </h2>
                <p className="text-sm text-ink-muted leading-relaxed">
                  Como o FOLIO não armazena cópias dos currículos em servidores, nossa equipe não possui acesso aos documentos que você edita no seu navegador. Caso precise relatar alguma dúvida sobre formatação, não é necessário enviar documentos pessoais sensíveis (como CPF ou RG).
                </p>
              </section>
            </div>

            <aside className="lg:col-span-4 p-6 sm:p-8 bg-ivory-warm/40 space-y-6 border-t lg:border-t-0 border-ink">
              <div className="border border-ink bg-ivory p-5 space-y-3">
                <div className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                  Perguntas Frequentes &amp; Ajuda Rápida
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Muitas dúvidas sobre preenchimento, primeiro emprego e exportação PDF estão respondidas em nossos cadernos editoriais gratuitos:
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigateToRoute('como-fazer-um-curriculo')}
                    className="text-left text-xs font-mono text-ink hover:text-vermilion underline"
                  >
                    → Como fazer um currículo passo a passo
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToRoute('modelos-de-curriculo')}
                    className="text-left text-xs font-mono text-ink hover:text-vermilion underline"
                  >
                    → Conhecer os 5 modelos profissionais A4
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToRoute('privacidade')}
                    className="text-left text-xs font-mono text-ink hover:text-vermilion underline"
                  >
                    → Gerenciar ou apagar dados locais (LocalStorage)
                  </button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </article>
  );
};
