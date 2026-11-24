/**
 * FOLIO — Serviço de Validação Binária e Sanitização de Fotografias (SEC-03)
 *
 * - Valida assinatura binária real (magic bytes) para JPEG, PNG e WebP.
 * - Rejeita arquivos com extensão ou MIME falsificados (ex.: HTML/SVG/texto renomeado para .jpg).
 * - Recodifica a imagem via Canvas 2D no navegador para remover metadados EXIF (incluindo GPS).
 * - Mantém qualidade visual e proporção original sem alterar o layout do editor.
 */

export const MAX_PHOTO_FILE_BYTES = 2 * 1024 * 1024; // 2 MB
export const MAX_PHOTO_DATA_URL_LENGTH = 2_900_000; // ~2 MB em base64
const MAX_CANVAS_DIMENSION = 1024;

export type ValidImageMime = 'image/jpeg' | 'image/png' | 'image/webp';

const ALLOWED_MIME_TYPES: readonly ValidImageMime[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

/**
 * Inspeciona os primeiros 12 bytes reais do arquivo para confirmar se é JPEG, PNG ou WebP legítimo.
 */
export function detectImageFormatByMagicBytes(
  bytes: Uint8Array
): ValidImageMime | null {
  if (!bytes || bytes.length < 12) return null;

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'image/png';
  }

  // WebP: "RIFF" (0..3) + "WEBP" (8..11)
  const isRiff =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46;
  const isWebp =
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;
  if (isRiff && isWebp) {
    return 'image/webp';
  }

  return null;
}

/**
 * Valida se uma Data URL de imagem está estritamente dentro do formato e limite seguro.
 */
export function isSafePhotoDataUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (value.length === 0 || value.length > MAX_PHOTO_DATA_URL_LENGTH) {
    return false;
  }
  return /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(value);
}

function readHeaderBytes(file: Blob): Promise<Uint8Array> {
  const slice = file.slice(0, 12);
  if (typeof slice.arrayBuffer === 'function') {
    return slice.arrayBuffer().then((buf) => new Uint8Array(buf));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error('Falha ao ler cabeçalho binário'));
      }
    };
    reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
    reader.readAsArrayBuffer(slice);
  });
}

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Falha ao ler conteúdo da imagem'));
      }
    };
    reader.onerror = () => reject(new Error('Falha ao ler imagem'));
    reader.readAsDataURL(file);
  });
}

export type CanvasProcessingResult =
  | { status: 'ok'; dataUrl: string }
  | { status: 'corrupted' }
  | { status: 'unsupported' };

/**
 * Verifica se o ambiente atual possui suporte real a Canvas 2D.
 */
export function hasCanvas2DSupport(): boolean {
  if (typeof document === 'undefined' || typeof Image === 'undefined') {
    return false;
  }
  try {
    const probe = document.createElement('canvas');
    return Boolean(
      probe &&
        typeof probe.getContext === 'function' &&
        probe.getContext('2d') !== null
    );
  } catch {
    return false;
  }
}

/**
 * Recodifica a imagem via Canvas 2D para eliminar metadados EXIF (incluindo localização GPS)
 * e validar a decodificação real da imagem no navegador.
 * - `ok`: imagem decodificada e recodificada com sucesso.
 * - `corrupted`: ambiente suporta Canvas 2D, mas a imagem falhou ao decodificar ou é inválida.
 * - `unsupported`: ambiente sem suporte a Canvas 2D (permite fallback controlado).
 */
export function stripExifViaCanvas(
  rawDataUrl: string,
  targetMime: ValidImageMime
): Promise<CanvasProcessingResult> {
  if (!hasCanvas2DSupport()) {
    return Promise.resolve({ status: 'unsupported' });
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const naturalW = img.naturalWidth || img.width;
        const naturalH = img.naturalHeight || img.height;
        if (!naturalW || !naturalH || naturalW > 12000 || naturalH > 12000) {
          resolve({ status: 'corrupted' });
          return;
        }

        const scale = Math.min(
          1,
          MAX_CANVAS_DIMENSION / Math.max(naturalW, naturalH)
        );
        const width = Math.max(1, Math.round(naturalW * scale));
        const height = Math.max(1, Math.round(naturalH * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ status: 'unsupported' });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const outputMime: ValidImageMime =
          targetMime === 'image/png' ? 'image/png' : 'image/jpeg';
        const recoded = canvas.toDataURL(
          outputMime,
          outputMime === 'image/jpeg' ? 0.9 : undefined
        );

        if (isSafePhotoDataUrl(recoded)) {
          resolve({ status: 'ok', dataUrl: recoded });
        } else {
          resolve({ status: 'corrupted' });
        }
      } catch {
        resolve({ status: 'corrupted' });
      }
    };
    img.onerror = () => resolve({ status: 'corrupted' });
    img.src = rawDataUrl;
  });
}

export interface PhotoValidationResult {
  ok: boolean;
  dataUrl?: string;
  error?: string;
}

/**
 * Pipeline completo de validação e sanitização de fotografia enviada pelo usuário.
 */
export async function processAndSanitizePhotoFile(
  file: File
): Promise<PhotoValidationResult> {
  if (!ALLOWED_MIME_TYPES.includes(file.type as ValidImageMime)) {
    return {
      ok: false,
      error:
        'Selecione um arquivo de imagem seguro nos formatos JPG, PNG ou WebP.',
    };
  }

  if (file.size <= 0 || file.size > MAX_PHOTO_FILE_BYTES) {
    return {
      ok: false,
      error:
        'A imagem deve ter no máximo 2 MB para armazenamento local eficiente.',
    };
  }

  let detectedMime: ValidImageMime | null = null;
  try {
    const headerBytes = await readHeaderBytes(file);
    detectedMime = detectImageFormatByMagicBytes(headerBytes);
  } catch {
    return {
      ok: false,
      error: 'Não foi possível validar o conteúdo da imagem selecionada.',
    };
  }

  if (!detectedMime) {
    return {
      ok: false,
      error:
        'Arquivo inválido ou incompatível. Envie uma fotografia real em JPG, PNG ou WebP.',
    };
  }

  try {
    const rawDataUrl = await readAsDataUrl(file);
    if (!isSafePhotoDataUrl(rawDataUrl)) {
      return {
        ok: false,
        error: 'Não foi possível validar o conteúdo da imagem selecionada.',
      };
    }

    const canvasResult = await stripExifViaCanvas(rawDataUrl, detectedMime);

    if (canvasResult.status === 'ok') {
      return {
        ok: true,
        dataUrl: canvasResult.dataUrl,
      };
    }

    if (canvasResult.status === 'corrupted') {
      return {
        ok: false,
        error:
          'A imagem parece estar corrompida ou não pôde ser processada. Tente enviar outra fotografia em JPG, PNG ou WebP.',
      };
    }

    // Fallback controlado exclusivamente quando o ambiente não oferece suporte a Canvas 2D
    return {
      ok: true,
      dataUrl: rawDataUrl,
    };
  } catch {
    return {
      ok: false,
      error: 'Não foi possível processar a imagem selecionada.',
    };
  }
}
