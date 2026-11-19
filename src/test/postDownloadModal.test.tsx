import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PostDownloadSupportModal } from '../components/modals/PostDownloadSupportModal';
import { ResumeEditorView } from '../components/editor/ResumeEditorView';
import { computePixCrc16, generatePixPaymentArtifact } from '../services/pixPayloadService';
import * as pdfExportService from '../services/pdfExportService';
import {
  POST_DOWNLOAD_SUPPORT_KEY,
  storageService,
} from '../services/storageService';

describe('FOLIO — Fase 02: Modal Pós-Download de Avaliação e Apoio Voluntário Pix', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('1. Gera BR Code Pix válido tanto para valor livre (sem campo 54) quanto para valor digitado pelo usuário, atualizando QR Code e Copia e Cola em tempo real', async () => {
    const user = userEvent.setup();
    render(<PostDownloadSupportModal isOpen={true} onClose={() => {}} />);

    const dialog = screen.getByRole('dialog', {
      name: /Seu próximo capítulo começa agora\./i,
    });
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        /Esperamos que seu novo currículo ajude você a conquistar grandes oportunidades\./i
      )
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/O que você achou do FOLIO\?/i)
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/Ajude o FOLIO a continuar gratuito\./i)
    ).toBeInTheDocument();

    // Estado inicial com campo vazio: BR Code válido sem campo 54 (valor livre no banco)
    const qrSvg = within(dialog).getByTestId('modal-pix-qrcode-svg');
    const textarea = within(dialog).getByLabelText(
      /Código Pix Copia e Cola do modal/i
    ) as HTMLTextAreaElement;

    expect(textarea.value).toContain('0014br.gov.bcb.pix');
    expect(textarea.value).not.toContain('5405');
    expect(qrSvg.getAttribute('data-qr-payload')).toBe(textarea.value);
    expect(qrSvg.getAttribute('data-qr-amount')).toBe('livre');
    expect(textarea.value.slice(-4)).toBe(
      computePixCrc16(textarea.value.slice(0, -4))
    );

    // Exibe beneficiário e instituição de forma transparente
    expect(
      within(dialog).getByText('Victor Matheus Barros Trindade')
    ).toBeInTheDocument();
    expect(within(dialog).getByText('Nubank')).toBeInTheDocument();

    // Digita valor livre: 12,50 -> atualiza QR Code e código Pix Copia e Cola
    const amountInput = within(dialog).getByLabelText(
      /Valor da contribuição/i
    );
    await user.type(amountInput, '12,50');

    expect(textarea.value).toContain('540512.50');
    expect(
      within(dialog).getByTestId('modal-pix-qrcode-svg').getAttribute('data-qr-payload')
    ).toBe(textarea.value);
    expect(textarea.value.slice(-4)).toBe(
      computePixCrc16(textarea.value.slice(0, -4))
    );

    // Testa cópia do código Pix com feedback visual
    await user.click(within(dialog).getByRole('button', { name: /Copiar código Pix/i }));
    expect(within(dialog).getByText(/Código Pix copiado!/i)).toBeInTheDocument();

    // Valida diretamente o serviço para valor livre (null)
    const openArtifact = generatePixPaymentArtifact(null);
    expect(openArtifact).not.toBeNull();
    expect(openArtifact?.amount).toBeNull();
  });

  it('2. Permite avaliar de 1 a 5 estrelas e deixar sugestão sem simular envio bem-sucedido quando não há endpoint configurado', async () => {
    const user = userEvent.setup();
    render(
      <PostDownloadSupportModal
        isOpen={true}
        onClose={() => {}}
        feedbackEndpointOverride=""
      />
    );

    await user.click(screen.getByRole('radio', { name: /5 estrelas/i }));
    expect(screen.getByText('5/5')).toBeInTheDocument();

    const suggestionField = screen.getByLabelText(/Quer deixar alguma sugestão\?/i);
    await user.type(suggestionField, 'Muito fácil de usar!');

    await user.click(screen.getByRole('button', { name: /Enviar avaliação/i }));

    // Não deve mentir que foi enviado ao servidor
    expect(
      screen.getByText(/não está conectado a um servidor externo/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/enviada com sucesso/i)
    ).not.toBeInTheDocument();

    // Registra persistência versionada para não repetir o convite
    expect(window.localStorage.getItem(POST_DOWNLOAD_SUPPORT_KEY)).toBeTruthy();
    expect(storageService.shouldShowPostDownloadSupportModal()).toBe(false);
  });

  it('3. Fecha com "Agora não", botão X ou tecla Escape e persiste para não reaparecer em downloads futuros', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { rerender } = render(
      <PostDownloadSupportModal isOpen={true} onClose={onClose} />
    );
    await user.click(screen.getByRole('button', { name: /Agora não/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(storageService.shouldShowPostDownloadSupportModal()).toBe(false);
    expect(window.localStorage.getItem(POST_DOWNLOAD_SUPPORT_KEY)).toContain(
      '"status":"dismissed"'
    );

    // Testa fechamento por tecla Escape e botão X
    window.localStorage.clear();
    rerender(<PostDownloadSupportModal isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(storageService.shouldShowPostDownloadSupportModal()).toBe(false);

    window.localStorage.clear();
    rerender(<PostDownloadSupportModal isOpen={true} onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: /Fechar janela/i }));
    expect(onClose).toHaveBeenCalledTimes(3);
    expect(storageService.shouldShowPostDownloadSupportModal()).toBe(false);
  });

  it('5. Não abre o modal quando ocorre erro na geração do PDF', async () => {
    vi.useFakeTimers();

    const doc = storageService.loadResumeDocument('editorial');
    storageService.saveResumeDocument({
      ...doc,
      personal: { ...doc.personal, fullName: 'Carlos Eduardo' },
    });

    vi.spyOn(pdfExportService, 'downloadResumePDF').mockRejectedValue(
      new Error('Falha simulada na geração do PDF')
    );

    render(
      <ResumeEditorView
        initialTemplateId="editorial"
        onBackToLanding={() => {}}
        onInspectDocument={() => {}}
      />
    );

    const downloadBtns = screen.getAllByRole('button', {
      name: /BAIXAR CURRÍCULO PDF/i,
    });
    await act(async () => {
      fireEvent.click(downloadBtns[0]);
      await Promise.resolve();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByTestId('post-download-support-modal')).not.toBeInTheDocument();
  });

  it('4. Abre somente ~2s após download de PDF bem-sucedido, não abre em caso de erro e não repete após ser dispensado', async () => {
    vi.useFakeTimers();

    // Prepara documento mínimo válido salvo no storage
    const doc = storageService.loadResumeDocument('editorial');
    storageService.saveResumeDocument({
      ...doc,
      personal: { ...doc.personal, fullName: 'Marina Silva' },
    });

    const downloadSpy = vi
      .spyOn(pdfExportService, 'downloadResumePDF')
      .mockResolvedValue({
        fileName: 'curriculo-marina-silva.pdf',
        templateId: 'editorial',
        pageCount: 1,
        widthMm: 210,
        heightMm: 297,
        blob: new Blob(['%PDF-1.4'], { type: 'application/pdf' }),
        pdfBytes: new Uint8Array([37, 80, 68, 70]),
        extractedTextByPage: ['Marina Silva'],
        fullExtractedText: 'Marina Silva',
      });

    render(
      <ResumeEditorView
        initialTemplateId="editorial"
        onBackToLanding={() => {}}
        onInspectDocument={() => {}}
      />
    );

    // Antes do download, o modal não existe
    expect(screen.queryByTestId('post-download-support-modal')).not.toBeInTheDocument();

    // Dispara download bem-sucedido
    const downloadBtns = screen.getAllByRole('button', {
      name: /BAIXAR CURRÍCULO PDF/i,
    });
    await act(async () => {
      fireEvent.click(downloadBtns[0]);
      await Promise.resolve();
    });

    expect(downloadSpy).toHaveBeenCalledTimes(1);

    // Antes dos 2 segundos, modal ainda não abriu
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.queryByTestId('post-download-support-modal')).not.toBeInTheDocument();

    // Após 2 segundos, o modal aparece
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.getByTestId('post-download-support-modal')).toBeInTheDocument();

    // Fecha clicando em "Agora não"
    fireEvent.click(screen.getByRole('button', { name: /Agora não/i }));
    expect(screen.queryByTestId('post-download-support-modal')).not.toBeInTheDocument();

    // Novo download NÃO deve reabrir o modal
    await act(async () => {
      fireEvent.click(downloadBtns[0]);
      await Promise.resolve();
    });
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.queryByTestId('post-download-support-modal')).not.toBeInTheDocument();
  });
});
