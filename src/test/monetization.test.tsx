import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { EditorialAdSlot } from '../components/monetization/EditorialAdSlot';
import { AdBlockRecoveryModal } from '../components/monetization/AdBlockRecoveryModal';
import { SupportPixPage } from '../components/pages/SupportPixPage';
import { SITE_CONFIG } from '../config/siteConfig';
import { adSenseService } from '../services/adSenseService';
import { analyticsService } from '../services/analyticsService';
import {
  computePixCrc16,
  generatePixPaymentArtifact,
  isPixConfigured,
} from '../services/pixPayloadService';

describe('FOLIO — Fase 07: Monetização com AdSense, Recuperação de Adblock e Doações Pix', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    window.history.pushState(null, '', '/');
  });

  it('1, 2, 3 e 12. O editor e a exportação PDF funcionam normalmente sem anúncios sobre campos, botões ou pré-visualização, mesmo quando o AdSense não carrega', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Criar meu currículo' }));

    // Verifica que não há nenhum slot publicitário dentro do editor
    expect(
      screen.queryByLabelText(/Espaço publicitário discreto/i)
    ).not.toBeInTheDocument();

    // Tenta renderizar explicitamente um EditorialAdSlot forçando activeView="editor"
    const { container } = render(
      <EditorialAdSlot
        placement="landing"
        activeView="editor"
        config={{
          clientId: 'ca-pub-1234567890123456',
          slotLanding: '1234567890',
          slotContent: '1234567890',
          slotFooter: '1234567890',
          adBlockRecoveryEnabled: false,
          requireConsent: false,
        }}
      />
    );
    expect(container.innerHTML).toBe('');

    // Preenche e exporta PDF gratuitamente sem bloqueios
    await user.type(screen.getByLabelText(/Nome completo/i), 'Mariana Costa');
    const exportBtns = screen.getAllByRole('button', {
      name: /BAIXAR CURRÍCULO PDF/i,
    });
    await user.click(exportBtns[0]);

    expect(
      await screen.findByText(/PDF gerado com sucesso: curriculo-Mariana-Costa\.pdf/i)
    ).toBeInTheDocument();
  });

  it('4 e 11. Espaços publicitários não exibem anúncios fictícios quando desconfigurados e reservam altura anti-CLS quando configurados com consentimento', () => {
    // Estado padrão (sem Publisher ID): não renderiza anúncio falso
    const { container: unconfiguredContainer } = render(
      <EditorialAdSlot placement="landing" activeView="landing" />
    );
    expect(unconfiguredContainer.innerHTML).toBe('');

    // Com configuração válida, mas exigindo consentimento ainda não concedido: não carrega script
    const validConfig = {
      clientId: 'ca-pub-9876543210987654',
      slotLanding: '1122334455',
      slotContent: '2233445566',
      slotFooter: '3344556677',
      adBlockRecoveryEnabled: true,
      requireConsent: true,
    };

    const { container: noConsentContainer } = render(
      <EditorialAdSlot
        placement="landing"
        activeView="landing"
        config={validConfig}
      />
    );
    expect(noConsentContainer.innerHTML).toBe('');

    // Após o usuário conceder consentimento para anúncios não personalizados
    adSenseService.setAdvertisingConsent('non_personalized');
    render(
      <EditorialAdSlot
        placement="landing"
        activeView="landing"
        config={validConfig}
      />
    );

    const adRegion = screen.getByLabelText(
      /Espaço publicitário discreto para manutenção gratuita do FOLIO/i
    );
    expect(adRegion).toBeInTheDocument();
    expect(within(adRegion).getByText(/ESPAÇO RESERVADO \(ZERO CLS\)/i)).toBeInTheDocument();
  });

  it('5 e 9. A página /apoie utiliza a configuração centralizada definitiva do Pix, exibe beneficiário e instituição, e nunca gera QR Code falso se a configuração for esvaziada', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navega para /apoie pelo link do rodapé
    const footer = screen.getByRole('contentinfo');
    await user.click(
      within(footer).getByRole('link', {
        name: /Apoie o projeto \(Doação voluntária Pix\)/i,
      })
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Apoie a continuidade do FOLIO gratuito\./i,
      })
    ).toBeInTheDocument();

    // Verifica que a configuração centralizada oficial do Pix está ativa e exibe beneficiário + instituição
    expect(isPixConfigured()).toBe(true);
    expect(screen.getByTestId('pix-qrcode-svg')).toBeInTheDocument();
    expect(screen.getByTestId('pix-beneficiary-name')).toHaveTextContent(
      'Victor Matheus Barros Trindade'
    );
    expect(screen.getByTestId('pix-beneficiary-institution')).toHaveTextContent(
      'Nubank'
    );

    // Garante que o evento de analytics ao copiar o código Pix nunca envia a chave Pix
    const gtagSpy = vi.fn();
    window.gtag = gtagSpy;
    analyticsService.setConsent(true);
    gtagSpy.mockClear();

    await user.click(
      screen.getByRole('button', { name: /Copiar código Pix Copia e Cola/i })
    );
    expect(screen.getByText(/Código Pix copiado!/i)).toBeInTheDocument();
    expect(gtagSpy).toHaveBeenCalledWith('event', 'pix_code_copied', {
      route: '/apoie',
    });
    const serializedGtagCalls = JSON.stringify(gtagSpy.mock.calls);
    expect(serializedGtagCalls).not.toContain(SITE_CONFIG.pix.pixKey);

    // Verifica que, se a configuração for esvaziada via override, nenhum QR Code falso é gerado
    const emptyPixConfig = {
      pixKey: '',
      recipientName: '',
      recipientInstitution: '',
      recipientCity: '',
      txId: '',
    };
    expect(isPixConfigured(emptyPixConfig)).toBe(false);
    expect(generatePixPaymentArtifact(10, emptyPixConfig)).toBeNull();
  });

  it('6, 7 e 8. O QR Code Pix corresponde exatamente ao código Pix Copia e Cola e atualiza conforme o valor selecionado (R$ 5, R$ 10, R$ 20, R$ 50 e Outro valor)', async () => {
    const user = userEvent.setup();

    render(
      <SupportPixPage
        onNavigateToRoute={() => {}}
        onStartEditor={() => {}}
      />
    );

    // Valor inicial selecionado por padrão: R$ 10 (540510.00 no padrão EMV)
    const qrSvg10 = screen.getByTestId('pix-qrcode-svg');
    const copyPasteTextarea = screen.getByLabelText(/Código Pix Copia e Cola/i) as HTMLTextAreaElement;

    expect(copyPasteTextarea.value).toContain('0014br.gov.bcb.pix');
    expect(copyPasteTextarea.value).toContain('540510.00');
    expect(qrSvg10.getAttribute('data-qr-payload')).toBe(copyPasteTextarea.value);
    expect(qrSvg10.getAttribute('data-qr-amount')).toBe('10.00');

    // Seleciona R$ 5
    await user.click(screen.getByRole('button', { name: /R\$ 5\s+Pix/i }));
    expect(copyPasteTextarea.value).toContain('54045.00');
    expect(screen.getByTestId('pix-qrcode-svg').getAttribute('data-qr-payload')).toBe(
      copyPasteTextarea.value
    );

    // Seleciona R$ 20
    await user.click(screen.getByRole('button', { name: /R\$ 20/i }));
    expect(copyPasteTextarea.value).toContain('540520.00');
    expect(screen.getByTestId('pix-qrcode-svg').getAttribute('data-qr-payload')).toBe(
      copyPasteTextarea.value
    );

    // Seleciona R$ 50
    await user.click(screen.getByRole('button', { name: /R\$ 50/i }));
    expect(copyPasteTextarea.value).toContain('540550.00');
    expect(screen.getByTestId('pix-qrcode-svg').getAttribute('data-qr-payload')).toBe(
      copyPasteTextarea.value
    );

    // Seleciona "Outro valor" e digita 25,50
    await user.click(screen.getByRole('button', { name: /Outro valor/i }));
    const customInput = screen.getByLabelText(/Digite o valor desejado em Reais/i);
    await user.clear(customInput);
    await user.type(customInput, '25,50');

    expect(copyPasteTextarea.value).toContain('540525.50');
    expect(screen.getByTestId('pix-qrcode-svg').getAttribute('data-qr-payload')).toBe(
      copyPasteTextarea.value
    );

    // Verifica integridade do CRC16-CCITT nos 4 últimos caracteres
    const payloadWithoutCrc = copyPasteTextarea.value.slice(0, -4);
    const actualCrc = copyPasteTextarea.value.slice(-4);
    expect(actualCrc).toBe(computePixCrc16(payloadWithoutCrc));

    // Testa botão Copia e Cola
    await user.click(
      screen.getByRole('button', { name: /Copiar código Pix Copia e Cola/i })
    );
    expect(screen.getByText(/Código Pix copiado!/i)).toBeInTheDocument();

    // Verifica que generatePixPaymentArtifact rejeita valores negativos ou zero
    expect(generatePixPaymentArtifact(0)).toBeNull();
    expect(generatePixPaymentArtifact(-10)).toBeNull();
  });

  it('10. O aviso de Adblock apresenta o texto e os 3 botões obrigatórios, exibe instruções genéricas sem pedir cliques em anúncios e permite dispensar sem bloquear o site', async () => {
    const user = userEvent.setup();
    let dismissed = false;

    render(
      <AdBlockRecoveryModal
        isOpen={true}
        onAllowAds={() => {}}
        onDismiss={() => {
          dismissed = true;
        }}
      />
    );

    const dialog = screen.getByRole('dialog', {
      name: /Ajude o FOLIO a continuar gratuito/i,
    });
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        /Para manter o projeto seguro, disponível e gratuito para todos, precisamos da exibição de anúncios\./i
      )
    ).toBeInTheDocument();

    // Verifica os 3 botões obrigatórios
    expect(
      within(dialog).getByRole('button', { name: 'Permitir anúncios' })
    ).toBeInTheDocument();
    const howToBtn = within(dialog).getByRole('button', {
      name: /Como desativar meu Adblock/i,
    });
    const continueBtn = within(dialog).getByRole('button', {
      name: 'Continuar sem alterar',
    });

    // Expande as orientações genéricas
    await user.click(howToBtn);
    expect(
      within(dialog).getByText(
        /ORIENTAÇÕES GERAIS PARA PERMITIR ANÚNCIOS NESTE SITE/i
      )
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/nunca solicitamos cliques em anúncios/i)
    ).toBeInTheDocument();

    // Dispensa o modal ("Continuar sem alterar") e verifica registro na sessão para não repetir
    await user.click(continueBtn);
    expect(dismissed).toBe(true);
    expect(adSenseService.isAdBlockNoticeDismissedInSession()).toBe(true);
  });
});
