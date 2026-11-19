import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { analyticsService } from '../services/analyticsService';
import { applyRouteSEOMetadata, ROUTE_SEO_CONFIG } from '../services/seoService';
import { storageService } from '../services/storageService';

describe('FOLIO — Fases 05 e 06: SEO Técnico, Páginas Legais, Segurança e Fluxos de Lançamento', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState(null, '', '/');
  });

  it('1. Configura metadados exclusivos (title, description, canonical, OpenGraph, Twitter e JSON-LD) para todas as rotas públicas, incluindo /privacidade, /termos-de-uso e /contato', () => {
    const publicRoutes = [
      'landing',
      'modelos-de-curriculo',
      'curriculo-primeiro-emprego',
      'curriculo-sem-experiencia',
      'como-fazer-um-curriculo',
      'curriculo-profissional',
      'privacidade',
      'termos-de-uso',
      'contato',
    ] as const;

    const seenTitles = new Set<string>();
    const seenDescriptions = new Set<string>();

    for (const route of publicRoutes) {
      const meta = applyRouteSEOMetadata(route);
      expect(document.title).toBe(meta.title);
      expect(seenTitles.has(meta.title)).toBe(false);
      seenTitles.add(meta.title);

      const descEl = document.head.querySelector('meta[name="description"]');
      expect(descEl?.getAttribute('content')).toBe(meta.description);
      expect(seenDescriptions.has(meta.description)).toBe(false);
      seenDescriptions.add(meta.description);

      const robotsEl = document.head.querySelector('meta[name="robots"]');
      expect(robotsEl?.getAttribute('content')).toBe('index, follow');

      const canonicalEl = document.head.querySelector('link[rel="canonical"]');
      expect(canonicalEl?.getAttribute('href')).toBe(meta.canonicalUrl);

      const ldScript = document.getElementById('folio-structured-data');
      expect(ldScript?.textContent).toContain('"@context":"https://schema.org"');
    }
  });

  it('2. Aplica proteção estrita "noindex, nofollow" na rota de edição (/editor) e não expõe dados pessoais nos metadados', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Criar meu currículo' }));

    const robotsEl = document.head.querySelector('meta[name="robots"]');
    expect(robotsEl?.getAttribute('content')).toBe('noindex, nofollow');
    expect(document.title).toBe(ROUTE_SEO_CONFIG.editor.title);

    await user.type(screen.getByLabelText(/Nome completo/i), 'Nome Privado Confidencial');
    await user.type(screen.getByLabelText(/E-mail/i), 'privado@confidencial.com.br');

    expect(document.title).not.toContain('Nome Privado Confidencial');
    const descContent =
      document.head.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    expect(descContent).not.toContain('Nome Privado Confidencial');
    expect(descContent).not.toContain('privado@confidencial.com.br');
  });

  it('3. Navega para a página pública /modelos-de-curriculo e apresenta os 5 modelos com perfil recomendado e prévia visual sem dados privados', async () => {
    const user = userEvent.setup();
    render(<App />);

    const footer = screen.getByRole('contentinfo');
    await user.click(
      within(footer).getByRole('link', {
        name: /Modelos de currículo profissional \(5 Matrizes A4\)/i,
      })
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Modelos de currículo profissional prontos para preencher e imprimir\./i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 2, name: /Modelo ESSENCIAL/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /Modelo EDITORIAL/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /Modelo CLÁSSICO/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /Modelo EXECUTIVO/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /Modelo TÉCNICO/i })
    ).toBeInTheDocument();
  });

  it('4. Navega pelas 4 páginas públicas de guias editoriais e permite abrir o editor com o modo Primeiro Emprego pré-configurado', async () => {
    const user = userEvent.setup();
    render(<App />);

    const footer = screen.getByRole('contentinfo');
    await user.click(
      within(footer).getByRole('link', {
        name: /Currículo para primeiro emprego e estágio/i,
      })
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Como estruturar um currículo para o primeiro emprego\./i,
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /Currículo Sem Experiência/i })
    );
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /O que colocar em um currículo sem experiência\./i,
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /Como Fazer um Currículo/i })
    );
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Como fazer um currículo profissional passo a passo\./i,
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /Currículo Profissional em PDF/i })
    );
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /A arquitetura de um currículo profissional de alto nível\./i,
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /Currículo Primeiro Emprego/i })
    );
    const startButtons = screen.getAllByRole('button', {
      name: /Criar currículo de primeiro emprego grátis/i,
    });
    await user.click(startButtons[0]);

    await user.click(screen.getByRole('button', { name: /04 Experiência/i }));
    expect(screen.getByLabelText(/Busco meu 1º emprego/i)).toBeChecked();
  });

  it('5. Renderiza as páginas legais (/privacidade, /termos-de-uso e /contato) com controle de consentimento, limpeza de LocalStorage e transparência de contato', async () => {
    const user = userEvent.setup();
    render(<App />);

    const footer = screen.getByRole('contentinfo');
    await user.click(
      within(footer).getByRole('link', {
        name: /Página completa de Privacidade & LGPD/i,
      })
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Política de Privacidade e Proteção de Dados\./i,
      })
    ).toBeInTheDocument();

    // Testa alternância de consentimento de analytics na página /privacidade
    expect(analyticsService.hasConsent()).toBe(false);
    await user.click(
      screen.getByRole('button', { name: /Autorizar métricas anônimas/i })
    );
    expect(analyticsService.hasConsent()).toBe(true);

    await user.click(
      screen.getByRole('button', { name: /Manter desativado \/ Revogar/i })
    );
    expect(analyticsService.hasConsent()).toBe(false);

    // Testa botão de apagar dados locais na página /privacidade
    await user.click(
      screen.getByRole('button', { name: /Apagar dados locais deste navegador/i })
    );
    expect(
      screen.getByText(/Todos os rascunhos de currículo e preferências locais foram removidos/i)
    ).toBeInTheDocument();

    // Navega para /termos-de-uso
    await user.click(
      screen.getByRole('button', { name: /DOC·02 Termos de Uso/i })
    );
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Termos de Uso e Condições do Serviço\./i,
      })
    ).toBeInTheDocument();

    // Navega para /contato e verifica transparência (sem e-mail ou telefone inventado)
    await user.click(
      screen.getByRole('button', { name: /DOC·03 Contato Institucional/i })
    );
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Contato e Canal Institucional\./i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Canal de e-mail institucional aguardando definição de publicação/i)
    ).toBeInTheDocument();
  });

  it('6. Exibe a página 404 personalizada com noindex quando o usuário acessa uma rota inexistente e sanitiza photoUrl malicioso no LocalStorage', async () => {
    const user = userEvent.setup();
    window.history.pushState(null, '', '/pagina-que-nao-existe-404');
    render(<App />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Esta página não consta no nosso índice editorial\./i,
      })
    ).toBeInTheDocument();
    expect(
      document.head.querySelector('meta[name="robots"]')?.getAttribute('content')
    ).toBe('noindex, nofollow');

    // Testa retorno à página inicial a partir da 404
    await user.click(
      screen.getByRole('button', { name: /Voltar para a página inicial/i })
    );
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Seu próximo capítulo começa no papel\./i,
      })
    ).toBeInTheDocument();

    // Verifica sanitização contra URI maliciosa em photoUrl no LocalStorage
    window.localStorage.setItem(
      'folio:resume-document:v1',
      JSON.stringify({
        personal: {
          fullName: 'Teste Segurança',
          photoUrl: 'javascript:alert(1)',
        },
      })
    );
    const loadedDoc = storageService.loadResumeDocument();
    expect(loadedDoc.personal.photoUrl).toBe('');
  });
});
