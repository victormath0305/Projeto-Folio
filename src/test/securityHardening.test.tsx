import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PostDownloadSupportModal } from '../components/modals/PostDownloadSupportModal';
import { SITE_CONFIG } from '../config/siteConfig';
import {
  detectImageFormatByMagicBytes,
  isSafePhotoDataUrl,
  processAndSanitizePhotoFile,
  stripExifViaCanvas,
} from '../services/imageSecurityService';
import { generateResumePDF } from '../services/pdfExportService';
import {
  computePixCrc16,
  generatePixPaymentArtifact,
} from '../services/pixPayloadService';
import {
  createEmptyResumeDocument,
  safeJsonParse,
  sanitizeResumeDocument,
  STORAGE_LIMITS,
  storageService,
} from '../services/storageService';

describe('FOLIO — Operação Security Hardening (SEC-02 a SEC-07)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('SEC-05 & SEC-07: utiliza a nova chave Pix aleatória (EVP), gera BR Code válido e congela SITE_CONFIG em runtime', () => {
    expect(SITE_CONFIG.pix.pixKey).toBe('55cbf14e-ee90-4b56-addf-9382267cf9a9');
    expect(SITE_CONFIG.pix.recipientName).toBe('Victor Matheus Barros Trindade');
    expect(SITE_CONFIG.pix.recipientInstitution).toBe('Nubank');

    // Garante imutabilidade profunda em runtime
    expect(Object.isFrozen(SITE_CONFIG)).toBe(true);
    expect(Object.isFrozen(SITE_CONFIG.pix)).toBe(true);
    expect(Object.isFrozen(SITE_CONFIG.adsense)).toBe(true);

    // Valida BR Code com a nova chave aleatória
    const artifact = generatePixPaymentArtifact(10);
    expect(artifact).not.toBeNull();
    expect(artifact!.payload).toContain('0014br.gov.bcb.pix');
    expect(artifact!.payload).toContain('55cbf14e-ee90-4b56-addf-9382267cf9a9');
    expect(artifact!.payload).toContain('540510.00');
    expect(artifact!.payload.slice(-4)).toBe(
      computePixCrc16(artifact!.payload.slice(0, -4))
    );
  });

  it('SEC-02: bloqueia Prototype Pollution, JSON malformado, tipos incorretos e aplica limites de tamanho no LocalStorage', () => {
    // 1. Prototype Pollution via JSON.parse
    const pollutedJson =
      '{"__proto__":{"polluted":true},"constructor":{"prototype":{"hacked":true}},"personal":{"fullName":"Ana"},"experiences":[]}';
    const parsed = safeJsonParse(pollutedJson) as Record<string, unknown>;
    expect(parsed).not.toBeNull();
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(({} as Record<string, unknown>).hacked).toBeUndefined();

    // 2. JSON completamente malformado -> recuperação limpa sem crash
    window.localStorage.setItem('folio:resume-document:v1', '{invalid-json!!!');
    const recoveredFromBroken = storageService.loadResumeDocument('essencial');
    expect(recoveredFromBroken.metadata.templateId).toBe('essencial');
    expect(recoveredFromBroken.personal.fullName).toBe('');

    // 3. Campos com tipos errados, strings gigantes, arrays gigantes e photoUrl malicioso
    const hugeString = 'A'.repeat(10000);
    const hugeExperiences = Array.from({ length: 120 }, (_, idx) => ({
      id: `exp-${idx}`,
      company: `Empresa ${idx}`,
      role: hugeString,
      location: 'SP',
      highlights: Array.from({ length: 50 }, () => hugeString),
    }));

    const sanitized = sanitizeResumeDocument({
      metadata: { templateId: 'modelo-invalido', marginsMm: 999 },
      personal: {
        fullName: { objetoMalicioso: true },
        roleTitle: hugeString,
        photoUrl: 'javascript:alert(1)',
        summary: hugeString,
      },
      experiences: hugeExperiences,
      skills: Array.from({ length: 200 }, (_, i) => `Skill ${i}`),
    });

    expect(sanitized.metadata.templateId).toBe('editorial');
    expect(sanitized.metadata.marginsMm).toBe(18);
    expect(sanitized.personal.fullName).toBe('');
    expect(sanitized.personal.roleTitle.length).toBe(STORAGE_LIMITS.maxShortText);
    expect(sanitized.personal.summary.length).toBe(STORAGE_LIMITS.maxLongText);
    expect(sanitized.personal.photoUrl).toBe('');
    expect(sanitized.experiences.length).toBe(STORAGE_LIMITS.maxExperiences);
    expect(sanitized.experiences[0].highlights?.length).toBe(
      STORAGE_LIMITS.maxHighlightsPerExperience
    );
    expect(sanitized.skills?.length).toBe(STORAGE_LIMITS.maxSkills);
  });

  it('SEC-03: valida magic bytes reais de JPEG, PNG e WebP e rejeita arquivos com extensão falsificada', async () => {
    const validJpeg = new Uint8Array([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    ]);
    const validPng = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    ]);
    const validWebp = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
    ]);
    const fakeHtmlAsJpg = new TextEncoder().encode(
      '<html><script>alert(1)</script></html>'
    );

    expect(detectImageFormatByMagicBytes(validJpeg)).toBe('image/jpeg');
    expect(detectImageFormatByMagicBytes(validPng)).toBe('image/png');
    expect(detectImageFormatByMagicBytes(validWebp)).toBe('image/webp');
    expect(detectImageFormatByMagicBytes(fakeHtmlAsJpg)).toBeNull();

    // Rejeita arquivo falsificado (MIME image/jpeg mas conteúdo HTML)
    const spoofedFile = new File([fakeHtmlAsJpg], 'foto-falsa.jpg', {
      type: 'image/jpeg',
    });
    const spoofResult = await processAndSanitizePhotoFile(spoofedFile);
    expect(spoofResult.ok).toBe(false);
    expect(spoofResult.dataUrl).toBeUndefined();

    // Valida isSafePhotoDataUrl contra data:text/html e tamanho excessivo
    expect(isSafePhotoDataUrl('data:text/html;base64,PHNjcmlwdD4=')).toBe(false);
    expect(isSafePhotoDataUrl('javascript:alert(1)')).toBe(false);
    expect(isSafePhotoDataUrl('data:image/png;base64,iVBORw0KGgo=')).toBe(true);
  });

  it('SEC-07: rejeita endpoint de feedback HTTP inseguro ou URL inválida no PostDownloadSupportModal', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    render(
      <PostDownloadSupportModal
        isOpen={true}
        onClose={() => {}}
        feedbackEndpointOverride="http://inseguro.example.com/feedback"
      />
    );

    await user.click(screen.getByRole('radio', { name: /5 estrelas/i }));
    await user.click(screen.getByRole('button', { name: /Enviar avaliação/i }));

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(
      screen.getByText(/não está conectado a um servidor externo/i)
    ).toBeInTheDocument();
  });

  it('SEC-03 (estados ok / corrupted / unsupported): diferencia imagem válida, imagem corrompida com magic bytes válidos, falha de decodificação e ambiente sem Canvas 2D', async () => {
    const validJpegBytes = new Uint8Array([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    ]);
    const validPngBytes = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    ]);
    const validWebpBytes = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x24, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
    ]);

    // 1. Ambiente sem Canvas 2D (jsdom padrão) -> status 'unsupported' + fallback controlado
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(null);

    const unsupportedRes = await stripExifViaCanvas(
      'data:image/jpeg;base64,/9j/4AAQ',
      'image/jpeg'
    );
    expect(unsupportedRes).toEqual({ status: 'unsupported' });

    const jpegFileFallback = new File([validJpegBytes], 'foto.jpg', {
      type: 'image/jpeg',
    });
    const fallbackResult = await processAndSanitizePhotoFile(jpegFileFallback);
    expect(fallbackResult.ok).toBe(true);
    expect(fallbackResult.dataUrl).toMatch(/^data:image\/jpeg;base64,/i);

    // 2. Ambiente com Canvas 2D: testa decodificação válida para JPEG, PNG e WebP -> status 'ok'
    const fakeCtx = { drawImage: vi.fn() } as unknown as CanvasRenderingContext2D;
    getContextSpy.mockReturnValue(fakeCtx);
    const toDataUrlSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
      .mockImplementation((mime) =>
        mime === 'image/png'
          ? 'data:image/png;base64,iVBORw0KGgo='
          : 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      );

    const OriginalImage = globalThis.Image;
    class MockValidImage {
      naturalWidth = 200;
      naturalHeight = 200;
      width = 200;
      height = 200;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => this.onload?.(), 0);
      }
    }
    vi.stubGlobal('Image', MockValidImage);

    for (const [bytes, name, mime] of [
      [validJpegBytes, 'ok.jpg', 'image/jpeg'],
      [validPngBytes, 'ok.png', 'image/png'],
      [validWebpBytes, 'ok.webp', 'image/webp'],
    ] as const) {
      const res = await processAndSanitizePhotoFile(
        new File([bytes], name, { type: mime })
      );
      expect(res.ok).toBe(true);
      expect(res.dataUrl).toBeTruthy();
    }

    // 3. Magic bytes válidos + corpo corrompido (img.onerror) -> status 'corrupted' e REJEITA
    class MockCorruptedImage {
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => this.onerror?.(), 0);
      }
    }
    vi.stubGlobal('Image', MockCorruptedImage);

    const corruptedJpeg = new File([validJpegBytes], 'corrompida.jpg', {
      type: 'image/jpeg',
    });
    const corruptedResult = await processAndSanitizePhotoFile(corruptedJpeg);
    expect(corruptedResult.ok).toBe(false);
    expect(corruptedResult.dataUrl).toBeUndefined();
    expect(corruptedResult.error).toMatch(/corrompida/i);

    // 4. Falha de decodificação (dimensões 0x0 no onload) -> status 'corrupted' e REJEITA
    class MockZeroDimImage {
      naturalWidth = 0;
      naturalHeight = 0;
      width = 0;
      height = 0;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      set src(_val: string) {
        setTimeout(() => this.onload?.(), 0);
      }
    }
    vi.stubGlobal('Image', MockZeroDimImage);

    const zeroDimRes = await stripExifViaCanvas(
      'data:image/png;base64,iVBORw0KGgo=',
      'image/png'
    );
    expect(zeroDimRes).toEqual({ status: 'corrupted' });

    vi.stubGlobal('Image', OriginalImage);
    toDataUrlSpy.mockRestore();
    getContextSpy.mockRestore();
  });

  it('SEC-03: exporta PDF A4 normalmente com fotografia PNG válida incorporada', async () => {
    // PNG real 1x1 pixel transparente em base64
    const realTinyPng =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    const doc = createEmptyResumeDocument('editorial');
    doc.personal.fullName = 'Camila Ferreira';
    doc.personal.roleTitle = 'Designer Editorial';
    doc.personal.photoUrl = realTinyPng;

    const artifact = await generateResumePDF(doc, 'editorial');
    expect(artifact.pageCount).toBe(1);
    expect(artifact.widthMm).toBe(210);
    expect(artifact.heightMm).toBe(297);
    expect(artifact.pdfBytes.length).toBeGreaterThan(500);
  });
});
