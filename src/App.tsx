import { useEffect, useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { TemplatesSection } from './components/sections/TemplatesSection';
import { BenefitsSection } from './components/sections/BenefitsSection';
import { HowItWorksSection } from './components/sections/HowItWorksSection';
import { AboutSection } from './components/sections/AboutSection';
import { TemplateInspectorModal } from './components/modals/TemplateInspectorModal';
import { LegalModal } from './components/modals/LegalModal';
import { ResumeEditorView } from './components/editor/ResumeEditorView';
import { PublicModelsPage } from './components/pages/PublicModelsPage';
import { PublicGuidePage } from './components/pages/PublicGuidePage';
import { PublicLegalPage } from './components/pages/PublicLegalPage';
import { SupportPixPage } from './components/pages/SupportPixPage';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { EditorialAdSlot } from './components/monetization/EditorialAdSlot';
import { AdBlockRecoveryModal } from './components/monetization/AdBlockRecoveryModal';
import { storageService } from './services/storageService';
import {
  applyRouteSEOMetadata,
  AppRouteView,
  PublicGuideSlug,
  PublicLegalSlug,
} from './services/seoService';
import { analyticsService } from './services/analyticsService';
import { adSenseService } from './services/adSenseService';
import {
  ResumeDocument,
  ResumeTemplateId,
  WorkspacePreferences,
} from './types/resume';

const PUBLIC_GUIDE_SLUGS: PublicGuideSlug[] = [
  'modelos-de-curriculo',
  'curriculo-primeiro-emprego',
  'curriculo-sem-experiencia',
  'como-fazer-um-curriculo',
  'curriculo-profissional',
];

const PUBLIC_LEGAL_SLUGS: PublicLegalSlug[] = [
  'privacidade',
  'termos-de-uso',
  'contato',
  'apoie',
];

function resolveViewFromLocation(): AppRouteView {
  if (typeof window === 'undefined') return 'landing';

  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (pathname === 'editor' || window.location.hash === '#editor') {
    return 'editor';
  }

  if (PUBLIC_GUIDE_SLUGS.includes(pathname as PublicGuideSlug)) {
    return pathname as PublicGuideSlug;
  }

  if (PUBLIC_LEGAL_SLUGS.includes(pathname as PublicLegalSlug)) {
    return pathname as PublicLegalSlug;
  }

  const hashSlug = window.location.hash.replace(/^#\/?/, '');
  if (PUBLIC_GUIDE_SLUGS.includes(hashSlug as PublicGuideSlug)) {
    return hashSlug as PublicGuideSlug;
  }
  if (PUBLIC_LEGAL_SLUGS.includes(hashSlug as PublicLegalSlug)) {
    return hashSlug as PublicLegalSlug;
  }

  if (pathname && pathname !== 'index.html') {
    return 'not-found';
  }

  const savedPrefs = storageService.loadPreferences();
  if (savedPrefs.lastView === 'editor' && !pathname) {
    return 'editor';
  }

  return 'landing';
}

export function App() {
  const [preferences, setPreferences] = useState<WorkspacePreferences>(() =>
    storageService.loadPreferences()
  );

  const [activeView, setActiveView] = useState<AppRouteView>(() =>
    resolveViewFromLocation()
  );

  // Estado do Inspetor de Documento A4 em Escala Ampliada
  const [inspectedDoc, setInspectedDoc] = useState<ResumeDocument | null>(null);
  const [inspectedTemplate, setInspectedTemplate] =
    useState<ResumeTemplateId>('editorial');

  // Estado dos Documentos Normativos (Privacidade e Termos — Resumo Rápido em Modal)
  const [legalModalType, setLegalModalType] = useState<
    'privacidade' | 'termos' | null
  >(null);

  // Estado do Modal de Aviso de Adblock (Dispensável e Não-Bloqueante)
  const [adBlockModalOpen, setAdBlockModalOpen] = useState<boolean>(false);

  // Atualiza dinamicamente SEO (<title>, meta description, canonical, robots, OpenGraph e JSON-LD)
  useEffect(() => {
    const meta = applyRouteSEOMetadata(activeView);
    analyticsService.trackEvent('page_view', { route: meta.path });

    // Inicializa a tag oficial de Ad Blocking Recovery (Funding Choices) quando configurada no ambiente
    if (adSenseService.isRouteAllowedForAds(activeView)) {
      adSenseService.ensureOfficialAdBlockRecoveryLoaded();
    }
  }, [activeView]);

  useEffect(() => {
    const handleLocationChange = () => {
      if (
        window.location.hash === '#topo' ||
        window.location.hash === '#modelos' ||
        window.location.hash === '#beneficios' ||
        window.location.hash === '#como-funciona' ||
        window.location.hash === '#sobre'
      ) {
        setActiveView('landing');
        return;
      }
      setActiveView(resolveViewFromLocation());
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const handleSelectTemplate = (templateId: ResumeTemplateId) => {
    const updated = storageService.savePreferences({ selectedTemplateId: templateId });
    setPreferences(updated);
    analyticsService.trackEvent('select_template', { templateId });
  };

  const handleOpenEditor = (
    templateId?: ResumeTemplateId,
    firstJobMode?: boolean
  ) => {
    const targetTemplate = templateId ?? preferences.selectedTemplateId;
    const updated = storageService.savePreferences({
      selectedTemplateId: targetTemplate,
      lastView: 'editor',
    });
    setPreferences(updated);

    if (firstJobMode) {
      const currentDoc = storageService.loadResumeDocument(targetTemplate);
      storageService.saveResumeDocument({
        ...currentDoc,
        metadata: {
          ...currentDoc.metadata,
          templateId: targetTemplate,
          isFirstJobMode: true,
        },
      });
    }

    analyticsService.trackEvent('start_resume', {
      templateId: targetTemplate,
      isFirstJobMode: Boolean(firstJobMode),
    });

    setActiveView('editor');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '#editor');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToLanding = () => {
    const updated = storageService.savePreferences({ lastView: 'landing' });
    setPreferences(updated);
    setActiveView('landing');
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateToRoute = (route: AppRouteView) => {
    if (route === 'editor') {
      handleOpenEditor();
      return;
    }
    if (route === 'landing') {
      handleBackToLanding();
      return;
    }

    const updated = storageService.savePreferences({ lastView: 'landing' });
    setPreferences(updated);
    setActiveView(route);
    if (typeof window !== 'undefined') {
      const targetUrl = route === 'not-found' ? '/404' : `/${route}`;
      window.history.pushState(null, '', targetUrl);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleInspectDocument = (
    document: ResumeDocument,
    templateId: ResumeTemplateId
  ) => {
    setInspectedDoc(document);
    setInspectedTemplate(templateId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-ink selection:bg-vermilion selection:text-sheet overflow-x-hidden">
      {/* Link de salto para acessibilidade por teclado (WCAG 2.2 AA) */}
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-vermilion focus:text-sheet focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase"
      >
        Pular para o conteúdo principal
      </a>

      {activeView === 'editor' ? (
        /* Editor de Currículos: 100% livre de anúncios para não interferir no preenchimento nem na prévia A4 */
        <ResumeEditorView
          initialTemplateId={preferences.selectedTemplateId}
          onBackToLanding={handleBackToLanding}
          onInspectDocument={handleInspectDocument}
        />
      ) : (
        <>
          {/* Cabeçalho Editorial */}
          <Header
            selectedTemplateId={preferences.selectedTemplateId}
            onOpenStartModal={handleOpenEditor}
            onNavigateToRoute={handleNavigateToRoute}
          />

          {/* Conteúdo Principal */}
          <main id="conteudo-principal" className="flex-1">
            {activeView === 'landing' && (
              <>
                <HeroSection
                  onOpenStartModal={handleOpenEditor}
                  onInspectDocument={handleInspectDocument}
                />

                <TemplatesSection
                  selectedTemplateId={preferences.selectedTemplateId}
                  onSelectTemplate={handleSelectTemplate}
                  onOpenStartModal={handleOpenEditor}
                  onInspectDocument={handleInspectDocument}
                />

                {/* Espaço Publicitário Modular (Apenas quando AdSense real estiver configurado e consentido) */}
                <EditorialAdSlot placement="landing" activeView={activeView} />

                <BenefitsSection />

                <HowItWorksSection
                  selectedTemplateId={preferences.selectedTemplateId}
                  onOpenStartModal={handleOpenEditor}
                />

                <AboutSection onNavigateToRoute={handleNavigateToRoute} />
              </>
            )}

            {activeView === 'modelos-de-curriculo' && (
              <>
                <PublicModelsPage
                  selectedTemplateId={preferences.selectedTemplateId}
                  onSelectAndStartEditor={(tpl) => {
                    handleSelectTemplate(tpl);
                    handleOpenEditor(tpl);
                  }}
                  onInspectDocument={handleInspectDocument}
                  onNavigateToRoute={handleNavigateToRoute}
                />
                <EditorialAdSlot placement="content" activeView={activeView} />
              </>
            )}

            {(activeView === 'curriculo-primeiro-emprego' ||
              activeView === 'curriculo-sem-experiencia' ||
              activeView === 'como-fazer-um-curriculo' ||
              activeView === 'curriculo-profissional') && (
              <>
                <PublicGuidePage
                  slug={activeView}
                  onStartEditorWithConfig={(tpl, firstJob) => {
                    handleSelectTemplate(tpl);
                    handleOpenEditor(tpl, firstJob);
                  }}
                  onInspectDocument={handleInspectDocument}
                  onNavigateToRoute={handleNavigateToRoute}
                />
                <EditorialAdSlot placement="content" activeView={activeView} />
              </>
            )}

            {(activeView === 'privacidade' ||
              activeView === 'termos-de-uso' ||
              activeView === 'contato') && (
              <PublicLegalPage
                slug={activeView}
                onNavigateToRoute={handleNavigateToRoute}
                onStartEditor={() => handleOpenEditor()}
              />
            )}

            {activeView === 'apoie' && (
              <SupportPixPage
                onNavigateToRoute={handleNavigateToRoute}
                onStartEditor={() => handleOpenEditor()}
                onPreviewAdBlockModal={() => setAdBlockModalOpen(true)}
              />
            )}

            {activeView === 'not-found' && (
              <NotFoundPage
                onNavigateToRoute={handleNavigateToRoute}
                onStartEditor={() => handleOpenEditor()}
              />
            )}

            <EditorialAdSlot placement="footer" activeView={activeView} />
          </main>

          {/* Rodapé Editorial */}
          <Footer
            onOpenLegalModal={(type) => setLegalModalType(type)}
            onOpenStartModal={handleOpenEditor}
            onNavigateToRoute={handleNavigateToRoute}
          />
        </>
      )}

      {/* Modal: Inspetor de Documento A4 */}
      <TemplateInspectorModal
        isOpen={Boolean(inspectedDoc)}
        document={inspectedDoc}
        initialTemplateId={inspectedTemplate}
        onClose={() => setInspectedDoc(null)}
        onSelectAndStart={(chosenTemplate) => {
          setInspectedDoc(null);
          handleOpenEditor(chosenTemplate);
        }}
      />

      {/* Modal: Política de Privacidade e Termos de Uso (Resumo Rápido) */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* Modal: Comunicado de Sustentabilidade / Adblock Recovery (Dispensável) */}
      <AdBlockRecoveryModal
        isOpen={adBlockModalOpen}
        onAllowAds={() => setAdBlockModalOpen(false)}
        onDismiss={() => setAdBlockModalOpen(false)}
      />
    </div>
  );
}

export default App;
