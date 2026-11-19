import type { jsPDF as JsPDFType } from 'jspdf';
import {
  formatEducationDegreeTitle,
  formatEducationPeriodText,
  formatExperienceBullets,
  formatExperiencePeriodText,
  PaginatedResumePage,
  paginateResumeDocument,
} from './paginationEngine';
import { isResumeDocumentEmpty } from './storageService';
import { ResumeDocument, ResumeTemplateId } from '../types/resume';

export interface PDFExportValidation {
  canExport: boolean;
  reason?: string;
}

export interface PDFExportArtifact {
  fileName: string;
  templateId: ResumeTemplateId;
  pageCount: number;
  widthMm: 210;
  heightMm: 297;
  blob: Blob;
  pdfBytes: Uint8Array;
  extractedTextByPage: string[];
  fullExtractedText: string;
}

const COLORS = {
  ink: [25, 25, 25] as const,
  inkMuted: [74, 71, 65] as const,
  inkSubtle: [110, 106, 99] as const,
  vermilion: [217, 71, 50] as const,
  paper: [200, 193, 180] as const,
  ivory: [243, 239, 230] as const,
  sheet: [255, 255, 255] as const,
};

/**
 * Sanitiza o nome do candidato para gerar o nome de arquivo padrão:
 * curriculo-Nome-Sobrenome.pdf
 */
export function sanitizeResumeFileName(fullName: string): string {
  const cleaned = (fullName || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, ' ')
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!cleaned) {
    return 'curriculo-Profissional.pdf';
  }

  return `curriculo-${cleaned}.pdf`;
}

/**
 * Verifica se há conteúdo suficiente no currículo para gerar um documento PDF válido
 */
export function validateResumeForExport(doc: ResumeDocument): PDFExportValidation {
  if (isResumeDocumentEmpty(doc)) {
    return {
      canExport: false,
      reason: 'Preencha ao menos seu nome e informações básicas antes de gerar o PDF.',
    };
  }

  if (!doc.personal.fullName.trim()) {
    return {
      canExport: false,
      reason: 'Informe seu nome completo na seção 01 — Dados pessoais para identificar o currículo.',
    };
  }

  return { canExport: true };
}

/**
 * Motor de Exportação PDF Vetorial (ISO 216 A4 — 210 × 297 mm)
 * Gera o arquivo PDF inteiramente no navegador com texto selecionável e pesquisável,
 * sem rasterizar o documento como imagem e sem enviar dados a servidores externos.
 */
export async function generateResumePDF(
  document: ResumeDocument,
  overrideTemplateId?: ResumeTemplateId
): Promise<PDFExportArtifact> {
  const validation = validateResumeForExport(document);
  if (!validation.canExport) {
    throw new Error(validation.reason || 'Conteúdo insuficiente para exportação.');
  }

  const templateId = overrideTemplateId ?? document.metadata.templateId;
  const pages = paginateResumeDocument(document, templateId);
  const fileName = sanitizeResumeFileName(document.personal.fullName);

  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: false,
    putOnlyUsedFonts: true,
  });

  pdf.setProperties({
    title: `Curriculo - ${normalizePdfGlyphs(document.personal.fullName.trim())}`,
    author: normalizePdfGlyphs(document.personal.fullName.trim()),
    subject: normalizePdfGlyphs(document.personal.roleTitle?.trim() || 'Curriculo Profissional'),
    creator: 'FOLIO - Compositor Tipografico A4',
  });

  const extractedTextByPage: string[] = [];

  pages.forEach((pageData, pageIdx) => {
    if (pageIdx > 0) {
      pdf.addPage('a4', 'portrait');
    }

    const pageTexts: string[] = [];
    const recordText = (txt: string) => {
      if (txt && txt.trim()) {
        pageTexts.push(txt.trim());
      }
    };

    pdf.setFillColor(...COLORS.sheet);
    pdf.rect(0, 0, 210, 297, 'F');

    if (templateId === 'essencial') {
      renderEssencialPageToPDF(pdf, pageData, recordText);
    } else if (templateId === 'editorial') {
      renderEditorialPageToPDF(pdf, pageData, recordText);
    } else if (templateId === 'executivo') {
      renderExecutivoPageToPDF(pdf, pageData, recordText);
    } else if (templateId === 'tecnico') {
      renderTecnicoPageToPDF(pdf, pageData, recordText);
    } else {
      renderClassicoPageToPDF(pdf, pageData, recordText);
    }

    extractedTextByPage.push(pageTexts.join('\n'));
  });

  const arrayBuffer = pdf.output('arraybuffer');
  const pdfBytes = new Uint8Array(arrayBuffer);
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  return {
    fileName,
    templateId,
    pageCount: pages.length,
    widthMm: 210,
    heightMm: 297,
    blob,
    pdfBytes,
    extractedTextByPage,
    fullExtractedText: extractedTextByPage.join('\n\n--- QUEBRA DE PÁGINA A4 ---\n\n'),
  };
}

/**
 * Gera o PDF e aciona o download imediato no navegador do usuário
 */
export async function downloadResumePDF(
  document: ResumeDocument,
  overrideTemplateId?: ResumeTemplateId
): Promise<PDFExportArtifact> {
  const artifact = await generateResumePDF(document, overrideTemplateId);

  if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    const url = URL.createObjectURL(artifact.blob);
    const anchor = window.document.createElement('a');
    anchor.href = url;
    anchor.download = artifact.fileName;
    anchor.style.display = 'none';
    window.document.body.appendChild(anchor);
    anchor.click();
    window.document.body.removeChild(anchor);
    window.setTimeout(() => URL.revokeObjectURL(url), 3000);
  }

  return artifact;
}

/* ============================================================================
 * AUXILIARES DE DESENHO VETORIAL E NORMALIZAÇÃO WINANSI (LATIN-1)
 * ============================================================================ */

function normalizePdfGlyphs(text: string): string {
  return (text || '')
    .replace(/[—–]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/•/g, '·');
}

function drawSafePdfText(
  pdf: JsPDFType,
  text: string,
  x: number,
  y: number,
  options?: { align?: 'left' | 'center' | 'right' }
): void {
  pdf.text(normalizePdfGlyphs(text), x, y, options);
}

function tryDrawProfilePhoto(
  pdf: JsPDFType,
  photoUrl: string | undefined,
  x: number,
  y: number,
  w: number,
  h: number
): boolean {
  if (!photoUrl || !photoUrl.startsWith('data:image/')) return false;
  try {
    let format = 'JPEG';
    if (photoUrl.startsWith('data:image/png')) format = 'PNG';
    else if (photoUrl.startsWith('data:image/webp')) format = 'WEBP';
    pdf.addImage(photoUrl, format, x, y, w, h);
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.3);
    pdf.rect(x, y, w, h, 'S');
    return true;
  } catch {
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.3);
    pdf.rect(x, y, w, h, 'S');
    return true;
  }
}

function drawWrappedVectorText(
  pdf: JsPDFType,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeightMm: number,
  recordText: (t: string) => void
): number {
  const cleaned = (text || '').trim();
  if (!cleaned) return y;
  recordText(cleaned);
  const safePdfText = normalizePdfGlyphs(cleaned);
  const lines: string[] = pdf.splitTextToSize(safePdfText, maxWidth);
  for (const line of lines) {
    drawSafePdfText(pdf, line, x, y);
    y += lineHeightMm;
  }
  return y;
}

function collectContactParts(personal: PaginatedResumePage['personal']): string[] {
  return [
    personal.location,
    personal.address,
    personal.email,
    personal.phone,
    personal.linkedin,
    personal.portfolio,
    personal.portfolioOrLinkedin,
  ]
    .map((v) => v?.trim() || '')
    .filter(Boolean);
}

/* ============================================================================
 * RENDERIZADOR VETORIAL M·01: ESSENCIAL (Série Suíça — Grade Linear)
 * ============================================================================ */
function renderEssencialPageToPDF(
  pdf: JsPDFType,
  page: PaginatedResumePage,
  recordText: (t: string) => void
): void {
  const marginX = 16;
  const contentWidth = 210 - marginX * 2;
  const leftColWidth = 38;
  const rightColX = marginX + leftColWidth + 4;
  const rightColWidth = 210 - marginX - rightColX;
  let cursorY = 18;

  const { personal } = page;

  if (page.isFirstPage) {
    const hasPhoto = Boolean(personal.photoUrl);
    const headerMaxWidth = hasPhoto ? contentWidth - 26 : contentWidth;

    if (hasPhoto) {
      tryDrawProfilePhoto(pdf, personal.photoUrl, 210 - marginX - 20, cursorY - 2, 20, 25);
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(...COLORS.ink);
    const nameStr = (personal.fullName || 'Candidato').toUpperCase();
    drawSafePdfText(pdf, nameStr, marginX, cursorY + 4);
    recordText(personal.fullName);
    cursorY += 9;

    if (personal.roleTitle?.trim()) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10.5);
      pdf.setTextColor(...COLORS.inkMuted);
      cursorY = drawWrappedVectorText(
        pdf,
        personal.roleTitle,
        marginX,
        cursorY,
        headerMaxWidth,
        4.5,
        recordText
      );
      cursorY += 1;
    }

    const contacts = collectContactParts(personal);
    if (contacts.length > 0) {
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(...COLORS.inkSubtle);
      const contactLine = contacts.join('  ·  ');
      cursorY = drawWrappedVectorText(
        pdf,
        contactLine,
        marginX,
        cursorY,
        headerMaxWidth,
        3.8,
        recordText
      );
    }

    if (hasPhoto && cursorY < 45) {
      cursorY = 45;
    }

    cursorY += 2.5;
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.6);
    pdf.line(marginX, cursorY, 210 - marginX, cursorY);
    cursorY += 6;
  } else {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(...COLORS.inkMuted);
    const contHeader = `${personal.fullName.toUpperCase()} - CONTINUAÇÃO`;
    drawSafePdfText(pdf, contHeader, marginX, cursorY);
    recordText(contHeader);
    cursorY += 3;
    pdf.setDrawColor(...COLORS.paper);
    pdf.setLineWidth(0.3);
    pdf.line(marginX, cursorY, 210 - marginX, cursorY);
    cursorY += 6;
  }

  const drawSwissSection = (label: string, renderBody: (startY: number) => number) => {
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.inkMuted);
    drawSafePdfText(pdf, label.toUpperCase(), marginX, cursorY);
    recordText(label);

    const nextY = renderBody(cursorY);
    cursorY = Math.max(cursorY + 6, nextY) + 2.5;

    if (cursorY < 274) {
      pdf.setDrawColor(...COLORS.paper);
      pdf.setLineWidth(0.25);
      pdf.line(marginX, cursorY - 1.5, 210 - marginX, cursorY - 1.5);
      cursorY += 2.5;
    }
  };

  if (page.showObjective && personal.objective?.trim()) {
    drawSwissSection('Objetivo', (y) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(...COLORS.ink);
      return drawWrappedVectorText(
        pdf,
        personal.objective!,
        rightColX,
        y,
        rightColWidth,
        4.4,
        recordText
      );
    });
  }

  if (page.showSummary && personal.summary?.trim()) {
    drawSwissSection('01 / Perfil', (y) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(...COLORS.ink);
      return drawWrappedVectorText(
        pdf,
        personal.summary,
        rightColX,
        y,
        rightColWidth,
        4.4,
        recordText
      );
    });
  }

  if (page.experiences.length > 0) {
    drawSwissSection('02 / Trajetória', (startY) => {
      let y = startY;
      page.experiences.forEach((exp, idx) => {
        if (idx > 0) y += 2.5;
        const period = formatExperiencePeriodText(exp);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9.8);
        pdf.setTextColor(...COLORS.ink);
        const roleTitle = exp.role || exp.company;
        drawSafePdfText(pdf, roleTitle, rightColX, y);
        recordText(roleTitle);

        if (period) {
          pdf.setFont('courier', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(...COLORS.inkMuted);
          drawSafePdfText(pdf, period, 210 - marginX, y, { align: 'right' });
          recordText(period);
        }
        y += 4.2;

        const subLine = [exp.company, exp.location].filter(Boolean).join(' · ');
        if (subLine) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8.8);
          pdf.setTextColor(...COLORS.inkMuted);
          drawSafePdfText(pdf, subLine, rightColX, y);
          recordText(subLine);
          y += 4.2;
        }

        const bullets = formatExperienceBullets(exp);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(...COLORS.ink);
        bullets.forEach((b) => {
          drawSafePdfText(pdf, '-', rightColX, y);
          y = drawWrappedVectorText(
            pdf,
            b,
            rightColX + 4.5,
            y,
            rightColWidth - 4.5,
            4.1,
            recordText
          );
          y += 0.6;
        });
      });
      return y;
    });
  }

  if (page.education.length > 0) {
    drawSwissSection('03 / Formação', (startY) => {
      let y = startY;
      page.education.forEach((edu, idx) => {
        if (idx > 0) y += 2;
        const degreeTitle = formatEducationDegreeTitle(edu);
        const period = formatEducationPeriodText(edu);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9.5);
        pdf.setTextColor(...COLORS.ink);
        drawSafePdfText(pdf, degreeTitle, rightColX, y);
        recordText(degreeTitle);

        if (period) {
          pdf.setFont('courier', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(...COLORS.inkMuted);
          drawSafePdfText(pdf, period, 210 - marginX, y, { align: 'right' });
          recordText(period);
        }
        y += 4;

        if (edu.institution) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8.8);
          pdf.setTextColor(...COLORS.inkMuted);
          y = drawWrappedVectorText(
            pdf,
            edu.institution,
            rightColX,
            y,
            rightColWidth,
            4,
            recordText
          );
        }
      });
      return y;
    });
  }

  if (page.courses.length > 0) {
    drawSwissSection('Cursos', (startY) => {
      let y = startY;
      page.courses.forEach((c) => {
        const line = [
          c.name,
          c.institution ? `· ${c.institution}` : '',
          c.workload ? `(${c.workload})` : '',
        ]
          .filter(Boolean)
          .join(' ');

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(...COLORS.ink);
        drawSafePdfText(pdf, line, rightColX, y);
        recordText(line);

        if (c.completionYear) {
          pdf.setFont('courier', 'normal');
          pdf.setFontSize(8);
          pdf.setTextColor(...COLORS.inkMuted);
          drawSafePdfText(pdf, c.completionYear, 210 - marginX, y, { align: 'right' });
          recordText(c.completionYear);
        }
        y += 4.4;
      });
      return y;
    });
  }

  if (page.skills.length > 0 || page.skillGroups.length > 0 || page.languages.length > 0) {
    drawSwissSection('04 / Domínio', (startY) => {
      let y = startY;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(...COLORS.ink);

      if (page.skills.length > 0) {
        const skillStr = `Habilidades: ${page.skills.join(' · ')}`;
        y = drawWrappedVectorText(pdf, skillStr, rightColX, y, rightColWidth, 4.2, recordText);
        y += 1;
      }

      page.skillGroups.forEach((group) => {
        const groupStr = `${group.category}: ${group.skills.join(' · ')}`;
        y = drawWrappedVectorText(pdf, groupStr, rightColX, y, rightColWidth, 4.2, recordText);
        y += 1;
      });

      if (page.languages.length > 0) {
        const langStr = `Idiomas: ${page.languages
          .map((l) => `${l.language} (${l.proficiency})`)
          .join(' · ')}`;
        y = drawWrappedVectorText(pdf, langStr, rightColX, y, rightColWidth, 4.2, recordText);
      }

      return y;
    });
  }

  if (page.additionalNotes && page.additionalNotes.trim()) {
    drawSwissSection('Adicionais', (startY) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(...COLORS.ink);
      return drawWrappedVectorText(
        pdf,
        page.additionalNotes,
        rightColX,
        startY,
        rightColWidth,
        4.2,
        recordText
      );
    });
  }

  drawPageFooter(pdf, marginX, 'FOLIO · MATRIZ ESSENCIAL (SUÍÇA)', page, recordText);
}

/* ============================================================================
 * RENDERIZADOR VETORIAL M·02: EDITORIAL (Série Lauda — 2 Colunas Assimétricas)
 * ============================================================================ */
function renderEditorialPageToPDF(
  pdf: JsPDFType,
  page: PaginatedResumePage,
  recordText: (t: string) => void
): void {
  const marginX = 16;
  const contentWidth = 210 - marginX * 2;
  const mainColWidth = 116;
  const sidebarX = marginX + mainColWidth + 8;
  const sidebarWidth = 210 - marginX - sidebarX;
  let cursorY = 18;

  const { personal } = page;

  if (page.isFirstPage) {
    const hasPhoto = Boolean(personal.photoUrl);
    const headerMaxWidth = hasPhoto ? contentWidth - 26 : contentWidth;

    if (hasPhoto) {
      tryDrawProfilePhoto(pdf, personal.photoUrl, 210 - marginX - 20, cursorY - 2, 20, 25);
    }

    pdf.setFont('courier', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COLORS.vermilion);
    drawSafePdfText(pdf, 'DOSSIÊ PROFISSIONAL · N° 01', marginX, cursorY);

    if (personal.location?.trim()) {
      pdf.setFont('courier', 'normal');
      pdf.setTextColor(...COLORS.inkSubtle);
      drawSafePdfText(pdf, personal.location.toUpperCase(), marginX + headerMaxWidth, cursorY, {
        align: 'right',
      });
      recordText(personal.location);
    }
    cursorY += 7;

    pdf.setFont('times', 'normal');
    pdf.setFontSize(22);
    pdf.setTextColor(...COLORS.ink);
    drawSafePdfText(pdf, personal.fullName || 'Candidato', marginX, cursorY);
    recordText(personal.fullName);
    cursorY += 5.5;

    if (personal.roleTitle?.trim()) {
      pdf.setFont('times', 'italic');
      pdf.setFontSize(11);
      pdf.setTextColor(...COLORS.inkMuted);
      cursorY = drawWrappedVectorText(
        pdf,
        personal.roleTitle,
        marginX,
        cursorY,
        headerMaxWidth,
        4.6,
        recordText
      );
    }

    if (hasPhoto && cursorY < 45) {
      cursorY = 45;
    }

    cursorY += 2.5;
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.4);
    pdf.line(marginX, cursorY, 210 - marginX, cursorY);
    cursorY += 6;
  } else {
    pdf.setFont('times', 'italic');
    pdf.setFontSize(11);
    pdf.setTextColor(...COLORS.inkMuted);
    const contText = `${personal.fullName} - Dossiê Profissional (Continuação)`;
    drawSafePdfText(pdf, contText, marginX, cursorY);
    recordText(contText);
    cursorY += 3;
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.3);
    pdf.line(marginX, cursorY, 210 - marginX, cursorY);
    cursorY += 6;
  }

  const bodyStartY = cursorY;
  let mainY = bodyStartY;

  if (page.showObjective && personal.objective?.trim()) {
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COLORS.vermilion);
    drawSafePdfText(pdf, '§ OBJETIVO PROFISSIONAL', marginX, mainY);
    mainY += 4.2;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.2);
    pdf.setTextColor(...COLORS.ink);
    mainY = drawWrappedVectorText(
      pdf,
      personal.objective,
      marginX,
      mainY,
      mainColWidth,
      4.3,
      recordText
    );
    mainY += 4;
  }

  if (page.showSummary && personal.summary?.trim()) {
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COLORS.vermilion);
    drawSafePdfText(pdf, '§ SÍNTESE EDITORIAL', marginX, mainY);
    mainY += 4.2;

    pdf.setFont('times', 'italic');
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.ink);
    mainY = drawWrappedVectorText(
      pdf,
      `"${personal.summary}"`,
      marginX,
      mainY,
      mainColWidth,
      4.5,
      recordText
    );
    mainY += 4;
  }

  if (page.experiences.length > 0) {
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COLORS.inkMuted);
    drawSafePdfText(pdf, '§ EXPERIÊNCIA PROFISSIONAL', marginX, mainY);
    mainY += 4.8;

    page.experiences.forEach((exp, idx) => {
      if (idx > 0) mainY += 3;
      const roleTitle = exp.role || exp.company;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.8);
      pdf.setTextColor(...COLORS.ink);
      mainY = drawWrappedVectorText(
        pdf,
        roleTitle,
        marginX,
        mainY,
        mainColWidth,
        4.2,
        recordText
      );

      const companyAndLoc = [exp.company, exp.location].filter(Boolean).join(' · ');
      const period = formatExperiencePeriodText(exp);
      if (companyAndLoc || period) {
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(7.8);
        pdf.setTextColor(...COLORS.vermilion);
        if (companyAndLoc) {
          drawSafePdfText(pdf, companyAndLoc, marginX, mainY);
          recordText(companyAndLoc);
        }
        if (period) {
          pdf.setTextColor(...COLORS.inkSubtle);
          drawSafePdfText(pdf, period, marginX + mainColWidth, mainY, { align: 'right' });
          recordText(period);
        }
        mainY += 4.2;
      }

      const bullets = formatExperienceBullets(exp);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.8);
      pdf.setTextColor(...COLORS.ink);
      bullets.forEach((b) => {
        const bulletStartY = mainY - 2.8;
        mainY = drawWrappedVectorText(
          pdf,
          b,
          marginX + 3.5,
          mainY,
          mainColWidth - 3.5,
          4.1,
          recordText
        );
        pdf.setDrawColor(...COLORS.paper);
        pdf.setLineWidth(0.3);
        pdf.line(marginX + 0.8, bulletStartY, marginX + 0.8, mainY - 2.5);
        mainY += 0.8;
      });
    });
    mainY += 3;
  }

  if (page.courses.length > 0) {
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COLORS.inkMuted);
    drawSafePdfText(pdf, '§ CURSOS & CERTIFICAÇÕES', marginX, mainY);
    mainY += 4.5;

    page.courses.forEach((c) => {
      const courseStr = [
        c.name,
        c.institution ? `- ${c.institution}` : '',
        c.workload ? `(${c.workload})` : '',
      ]
        .filter(Boolean)
        .join(' ');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.8);
      pdf.setTextColor(...COLORS.ink);
      drawSafePdfText(pdf, courseStr, marginX, mainY);
      recordText(courseStr);

      if (c.completionYear) {
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(7.5);
        pdf.setTextColor(...COLORS.inkSubtle);
        drawSafePdfText(pdf, c.completionYear, marginX + mainColWidth, mainY, { align: 'right' });
        recordText(c.completionYear);
      }
      mainY += 4.3;
    });
    mainY += 2;
  }

  if (page.additionalNotes && page.additionalNotes.trim()) {
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COLORS.inkMuted);
    drawSafePdfText(pdf, '§ INFORMAÇÕES COMPLEMENTARES', marginX, mainY);
    mainY += 4.2;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.8);
    pdf.setTextColor(...COLORS.ink);
    mainY = drawWrappedVectorText(
      pdf,
      page.additionalNotes,
      marginX,
      mainY,
      mainColWidth,
      4.1,
      recordText
    );
  }

  let sideY = bodyStartY;

  if (page.isFirstPage) {
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(7.2);
    pdf.setTextColor(...COLORS.inkMuted);
    drawSafePdfText(pdf, 'CONTATO DIRETO', sidebarX, sideY);
    sideY += 4;

    const sideContacts = [
      personal.email,
      personal.phone,
      personal.address,
      personal.linkedin,
      personal.portfolio,
      personal.portfolioOrLinkedin,
    ]
      .map((s) => s?.trim() || '')
      .filter(Boolean);

    pdf.setFont('courier', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COLORS.ink);
    sideContacts.forEach((c) => {
      sideY = drawWrappedVectorText(pdf, c, sidebarX, sideY, sidebarWidth, 3.8, recordText);
    });
    sideY += 4;
  }

  if (page.education.length > 0) {
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(7.2);
    pdf.setTextColor(...COLORS.inkMuted);
    drawSafePdfText(pdf, 'FORMAÇÃO ACADÊMICA', sidebarX, sideY);
    sideY += 4;

    page.education.forEach((edu) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(...COLORS.ink);
      sideY = drawWrappedVectorText(
        pdf,
        formatEducationDegreeTitle(edu),
        sidebarX,
        sideY,
        sidebarWidth,
        3.9,
        recordText
      );

      if (edu.institution) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(...COLORS.inkMuted);
        sideY = drawWrappedVectorText(
          pdf,
          edu.institution,
          sidebarX,
          sideY,
          sidebarWidth,
          3.8,
          recordText
        );
      }

      const period = formatEducationPeriodText(edu);
      if (period) {
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(7.2);
        pdf.setTextColor(...COLORS.inkSubtle);
        sideY = drawWrappedVectorText(
          pdf,
          period,
          sidebarX,
          sideY,
          sidebarWidth,
          3.8,
          recordText
        );
      }
      sideY += 2.5;
    });
    sideY += 2;
  }

  if (page.skills.length > 0 || page.skillGroups.length > 0) {
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(7.2);
    pdf.setTextColor(...COLORS.inkMuted);
    drawSafePdfText(pdf, 'HABILIDADES', sidebarX, sideY);
    sideY += 4;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.2);
    pdf.setTextColor(...COLORS.ink);

    if (page.skills.length > 0) {
      sideY = drawWrappedVectorText(
        pdf,
        page.skills.join(' · '),
        sidebarX,
        sideY,
        sidebarWidth,
        4,
        recordText
      );
      sideY += 2;
    }

    page.skillGroups.forEach((g) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      sideY = drawWrappedVectorText(
        pdf,
        g.category,
        sidebarX,
        sideY,
        sidebarWidth,
        3.8,
        recordText
      );
      pdf.setFont('helvetica', 'normal');
      sideY = drawWrappedVectorText(
        pdf,
        g.skills.join(' · '),
        sidebarX,
        sideY,
        sidebarWidth,
        3.8,
        recordText
      );
      sideY += 2;
    });
    sideY += 2;
  }

  if (page.languages.length > 0) {
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(7.2);
    pdf.setTextColor(...COLORS.inkMuted);
    drawSafePdfText(pdf, 'IDIOMAS', sidebarX, sideY);
    sideY += 4;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.2);
    pdf.setTextColor(...COLORS.ink);
    page.languages.forEach((l) => {
      const langLine = `${l.language} - ${l.proficiency}`;
      sideY = drawWrappedVectorText(
        pdf,
        langLine,
        sidebarX,
        sideY,
        sidebarWidth,
        4,
        recordText
      );
    });
  }

  const maxColY = Math.max(mainY, sideY, 120);
  pdf.setDrawColor(...COLORS.paper);
  pdf.setLineWidth(0.25);
  pdf.line(sidebarX - 4, bodyStartY - 2, sidebarX - 4, Math.min(maxColY, 274));

  drawPageFooter(pdf, marginX, 'FOLIO · MATRIZ EDITORIAL (LAUDA)', page, recordText);
}

/* ============================================================================
 * RENDERIZADOR VETORIAL M·03: CLÁSSICO (Série Cátedra — Simetria Formal)
 * ============================================================================ */
function renderClassicoPageToPDF(
  pdf: JsPDFType,
  page: PaginatedResumePage,
  recordText: (t: string) => void
): void {
  const marginX = 18;
  const contentWidth = 210 - marginX * 2;
  const centerX = 105;
  let cursorY = 18;

  const { personal } = page;

  if (page.isFirstPage) {
    if (personal.photoUrl) {
      tryDrawProfilePhoto(pdf, personal.photoUrl, 210 - marginX - 20, cursorY - 2, 20, 25);
    }

    pdf.setFont('times', 'bold');
    pdf.setFontSize(17);
    pdf.setTextColor(...COLORS.ink);
    const upperName = (personal.fullName || 'Candidato').toUpperCase();
    drawSafePdfText(pdf, upperName, centerX, cursorY + 4, { align: 'center' });
    recordText(personal.fullName);
    cursorY += 9;

    if (personal.roleTitle?.trim()) {
      pdf.setFont('times', 'italic');
      pdf.setFontSize(11);
      pdf.setTextColor(...COLORS.inkMuted);
      drawSafePdfText(pdf, personal.roleTitle, centerX, cursorY, { align: 'center' });
      recordText(personal.roleTitle);
      cursorY += 5;
    }

    const contacts = collectContactParts(personal);
    if (contacts.length > 0) {
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(7.8);
      pdf.setTextColor(...COLORS.inkSubtle);
      const contactStr = contacts.join('  ·  ');
      const lines: string[] = pdf.splitTextToSize(normalizePdfGlyphs(contactStr), contentWidth - 40);
      lines.forEach((l) => {
        drawSafePdfText(pdf, l, centerX, cursorY, { align: 'center' });
        cursorY += 3.8;
      });
      recordText(contactStr);
    }

    cursorY += 2;
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.4);
    pdf.line(marginX, cursorY, 210 - marginX, cursorY);
    cursorY += 6;
  } else {
    pdf.setFont('times', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.inkMuted);
    const contText = `${personal.fullName.toUpperCase()} - CONTINUAÇÃO`;
    drawSafePdfText(pdf, contText, centerX, cursorY, { align: 'center' });
    recordText(contText);
    cursorY += 3;
    pdf.setDrawColor(...COLORS.paper);
    pdf.setLineWidth(0.3);
    pdf.line(marginX, cursorY, 210 - marginX, cursorY);
    cursorY += 6;
  }

  const drawClassicHeading = (title: string) => {
    pdf.setFont('times', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(...COLORS.ink);
    drawSafePdfText(pdf, title.toUpperCase(), centerX, cursorY, { align: 'center' });
    recordText(title);
    cursorY += 2;
    pdf.setDrawColor(...COLORS.paper);
    pdf.setLineWidth(0.25);
    pdf.line(marginX, cursorY, 210 - marginX, cursorY);
    cursorY += 4.5;
  };

  if (page.showObjective && personal.objective?.trim()) {
    drawClassicHeading('Objetivo Profissional');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.2);
    pdf.setTextColor(...COLORS.ink);
    cursorY = drawWrappedVectorText(
      pdf,
      personal.objective,
      marginX,
      cursorY,
      contentWidth,
      4.3,
      recordText
    );
    cursorY += 3.5;
  }

  if (page.showSummary && personal.summary?.trim()) {
    drawClassicHeading('Síntese de Qualificações');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.2);
    pdf.setTextColor(...COLORS.ink);
    cursorY = drawWrappedVectorText(
      pdf,
      personal.summary,
      marginX,
      cursorY,
      contentWidth,
      4.3,
      recordText
    );
    cursorY += 3.5;
  }

  if (page.experiences.length > 0) {
    drawClassicHeading('Experiência Profissional');
    page.experiences.forEach((exp, idx) => {
      if (idx > 0) cursorY += 2.5;
      const companyLine = [exp.company, exp.location].filter(Boolean).join(' - ');
      const period = formatExperiencePeriodText(exp);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(...COLORS.ink);
      drawSafePdfText(pdf, companyLine || exp.role, marginX, cursorY);
      recordText(companyLine || exp.role);

      if (period) {
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(...COLORS.inkMuted);
        drawSafePdfText(pdf, period, 210 - marginX, cursorY, { align: 'right' });
        recordText(period);
      }
      cursorY += 4.2;

      if (exp.role) {
        pdf.setFont('times', 'italic');
        pdf.setFontSize(9.5);
        pdf.setTextColor(...COLORS.inkMuted);
        drawSafePdfText(pdf, exp.role, marginX, cursorY);
        recordText(exp.role);
        cursorY += 4.2;
      }

      const bullets = formatExperienceBullets(exp);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.8);
      pdf.setTextColor(...COLORS.ink);
      bullets.forEach((b) => {
        drawSafePdfText(pdf, '·', marginX + 1, cursorY);
        cursorY = drawWrappedVectorText(
          pdf,
          b,
          marginX + 5,
          cursorY,
          contentWidth - 5,
          4.1,
          recordText
        );
        cursorY += 0.5;
      });
    });
    cursorY += 3.5;
  }

  if (page.education.length > 0) {
    drawClassicHeading('Formação Acadêmica');
    page.education.forEach((edu) => {
      const eduText = [formatEducationDegreeTitle(edu), edu.institution]
        .filter(Boolean)
        .join(' - ');
      const period = formatEducationPeriodText(edu);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(...COLORS.ink);
      cursorY = drawWrappedVectorText(
        pdf,
        eduText,
        marginX,
        cursorY,
        contentWidth - 36,
        4.1,
        recordText
      );

      if (period) {
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(...COLORS.inkMuted);
        drawSafePdfText(pdf, period, 210 - marginX, cursorY - 4.1, { align: 'right' });
        recordText(period);
      }
      cursorY += 1.5;
    });
    cursorY += 2.5;
  }

  if (page.courses.length > 0) {
    drawClassicHeading('Cursos & Certificações');
    page.courses.forEach((c) => {
      const courseLine = [
        c.name,
        c.institution ? `- ${c.institution}` : '',
        c.workload ? `(${c.workload})` : '',
      ]
        .filter(Boolean)
        .join(' ');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.8);
      pdf.setTextColor(...COLORS.ink);
      drawSafePdfText(pdf, courseLine, marginX, cursorY);
      recordText(courseLine);

      if (c.completionYear) {
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(...COLORS.inkMuted);
        drawSafePdfText(pdf, c.completionYear, 210 - marginX, cursorY, { align: 'right' });
        recordText(c.completionYear);
      }
      cursorY += 4.3;
    });
    cursorY += 2.5;
  }

  if (
    page.skills.length > 0 ||
    page.skillGroups.length > 0 ||
    page.languages.length > 0 ||
    page.additionalNotes.trim()
  ) {
    drawClassicHeading('Competências, Idiomas & Informações');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.8);
    pdf.setTextColor(...COLORS.ink);

    if (page.skills.length > 0) {
      cursorY = drawWrappedVectorText(
        pdf,
        `Habilidades: ${page.skills.join(', ')}.`,
        marginX,
        cursorY,
        contentWidth,
        4.1,
        recordText
      );
      cursorY += 1;
    }

    page.skillGroups.forEach((g) => {
      cursorY = drawWrappedVectorText(
        pdf,
        `${g.category}: ${g.skills.join(', ')}.`,
        marginX,
        cursorY,
        contentWidth,
        4.1,
        recordText
      );
      cursorY += 1;
    });

    if (page.languages.length > 0) {
      cursorY = drawWrappedVectorText(
        pdf,
        `Idiomas: ${page.languages
          .map((l) => `${l.language} (${l.proficiency})`)
          .join('; ')}.`,
        marginX,
        cursorY,
        contentWidth,
        4.1,
        recordText
      );
      cursorY += 1;
    }

    if (page.additionalNotes.trim()) {
      cursorY = drawWrappedVectorText(
        pdf,
        `Adicionais: ${page.additionalNotes}`,
        marginX,
        cursorY,
        contentWidth,
        4.1,
        recordText
      );
    }
  }

  drawPageFooter(pdf, marginX, 'FOLIO · MATRIZ CLÁSSICA (CÁTEDRA)', page, recordText);
}

/* ============================================================================
 * RENDERIZADOR VETORIAL M·04: EXECUTIVO (Série Conselho — Liderança & Resultados)
 * ============================================================================ */
function renderExecutivoPageToPDF(
  pdf: JsPDFType,
  page: PaginatedResumePage,
  recordText: (t: string) => void
): void {
  const marginX = 16;
  const contentWidth = 210 - marginX * 2; // 178mm
  let cursorY = 17;

  const { personal } = page;
  const allSkills = [...page.skills, ...page.skillGroups.flatMap((g) => g.skills)];

  if (page.isFirstPage) {
    // Barra superior arquitetônica espessa (3pt)
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(1.1);
    pdf.line(marginX, cursorY, 210 - marginX, cursorY);
    cursorY += 5;

    const hasPhoto = Boolean(personal.photoUrl);
    if (hasPhoto) {
      tryDrawProfilePhoto(pdf, personal.photoUrl, 210 - marginX - 20, cursorY - 1, 20, 25);
    }

    const contactBlockWidth = 62;
    const leftHeaderWidth = contentWidth - contactBlockWidth - (hasPhoto ? 24 : 4);

    // Kicker executivo
    pdf.setFont('courier', 'normal');
    pdf.setFontSize(7.2);
    pdf.setTextColor(...COLORS.inkMuted);
    drawSafePdfText(pdf, 'DOSSIÊ EXECUTIVO · SÉRIE CONSELHO (M·04)', marginX, cursorY);

    // Contatos alinhados à direita do cabeçalho
    const rightContacts = [
      personal.location,
      personal.email,
      personal.phone,
      personal.linkedin || personal.portfolio || personal.portfolioOrLinkedin,
    ]
      .map((c) => c?.trim() || '')
      .filter(Boolean);

    const contactRightX = hasPhoto ? 210 - marginX - 24 : 210 - marginX;
    let contactY = cursorY;
    pdf.setFont('courier', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COLORS.inkMuted);
    rightContacts.forEach((c) => {
      drawSafePdfText(pdf, c, contactRightX, contactY, { align: 'right' });
      recordText(c);
      contactY += 3.8;
    });

    cursorY += 6.5;

    // Nome em Serifa de Grande Porte
    pdf.setFont('times', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(...COLORS.ink);
    drawSafePdfText(pdf, personal.fullName || 'Executivo', marginX, cursorY);
    recordText(personal.fullName);
    cursorY += 5.5;

    // Cargo em Caixa Alta Vermelho Editorial
    if (personal.roleTitle?.trim()) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(...COLORS.vermilion);
      cursorY = drawWrappedVectorText(
        pdf,
        personal.roleTitle.toUpperCase(),
        marginX,
        cursorY,
        leftHeaderWidth,
        4.2,
        recordText
      );
      recordText(personal.roleTitle);
    }

    cursorY = Math.max(cursorY, contactY, hasPhoto ? 45 : 0) + 2;
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.35);
    pdf.line(marginX, cursorY, 210 - marginX, cursorY);
    cursorY += 5;
  } else {
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.7);
    pdf.line(marginX, cursorY, 210 - marginX, cursorY);
    cursorY += 4.5;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...COLORS.ink);
    const contText = `${personal.fullName.toUpperCase()} - DOSSIÊ EXECUTIVO (CONTINUAÇÃO)`;
    drawSafePdfText(pdf, contText, marginX, cursorY);
    recordText(contText);
    cursorY += 2.5;

    pdf.setLineWidth(0.25);
    pdf.line(marginX, cursorY, 210 - marginX, cursorY);
    cursorY += 5.5;
  }

  // Quadro Emoldurado de Síntese Executiva + Competências de Liderança no Topo
  const hasExecBox =
    (page.showObjective && Boolean(personal.objective?.trim())) ||
    (page.showSummary && Boolean(personal.summary?.trim())) ||
    allSkills.length > 0;

  if (hasExecBox) {
    const boxStartY = cursorY;
    const boxPaddingX = 4;
    const innerWidth = contentWidth - boxPaddingX * 2;
    let boxY = boxStartY + 5;

    if (page.showObjective && personal.objective?.trim()) {
      pdf.setFont('courier', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(...COLORS.vermilion);
      drawSafePdfText(pdf, 'ESCOPO DE ATUAÇÃO:', marginX + boxPaddingX, boxY);
      boxY += 3.8;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(...COLORS.ink);
      boxY = drawWrappedVectorText(
        pdf,
        personal.objective,
        marginX + boxPaddingX,
        boxY,
        innerWidth,
        4.2,
        recordText
      );
      boxY += 2;
    }

    if (page.showSummary && personal.summary?.trim()) {
      pdf.setFont('courier', 'bold');
      pdf.setFontSize(7.5);
      pdf.setTextColor(...COLORS.inkMuted);
      drawSafePdfText(pdf, 'SÍNTESE EXECUTIVA', marginX + boxPaddingX, boxY);
      boxY += 3.8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.2);
      pdf.setTextColor(...COLORS.ink);
      boxY = drawWrappedVectorText(
        pdf,
        personal.summary,
        marginX + boxPaddingX,
        boxY,
        innerWidth,
        4.3,
        recordText
      );
      boxY += 2;
    }

    if (allSkills.length > 0) {
      pdf.setDrawColor(...COLORS.paper);
      pdf.setLineWidth(0.2);
      pdf.line(marginX + boxPaddingX, boxY - 1, 210 - marginX - boxPaddingX, boxY - 1);
      boxY += 3;

      pdf.setFont('courier', 'bold');
      pdf.setFontSize(7.2);
      pdf.setTextColor(...COLORS.inkSubtle);
      drawSafePdfText(
        pdf,
        'COMPETÊNCIAS DE LIDERANÇA & GESTÃO:',
        marginX + boxPaddingX,
        boxY
      );
      boxY += 3.8;

      pdf.setFont('courier', 'normal');
      pdf.setFontSize(8.2);
      pdf.setTextColor(...COLORS.ink);
      const skillsLine = allSkills.join('  |  ');
      boxY = drawWrappedVectorText(
        pdf,
        skillsLine,
        marginX + boxPaddingX,
        boxY,
        innerWidth,
        4,
        recordText
      );
    }

    const boxHeight = boxY - boxStartY + 2;
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.35);
    pdf.rect(marginX, boxStartY, contentWidth, boxHeight, 'S');
    cursorY = boxStartY + boxHeight + 6;
  }

  const drawExecSectionHeader = (title: string) => {
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(...COLORS.ink);
    drawSafePdfText(pdf, title.toUpperCase(), marginX, cursorY);
    recordText(title);
    cursorY += 2;
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.45);
    pdf.line(marginX, cursorY, 210 - marginX, cursorY);
    cursorY += 4.8;
  };

  // Experiências Executivas
  if (page.experiences.length > 0) {
    drawExecSectionHeader('Trajetória Executiva & Resultados');

    page.experiences.forEach((exp, idx) => {
      if (idx > 0) cursorY += 3;
      const companyHeader =
        [exp.company, exp.location].filter(Boolean).join(' · ') || exp.role;
      const period = formatExperiencePeriodText(exp);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.8);
      pdf.setTextColor(...COLORS.ink);
      drawSafePdfText(pdf, companyHeader.toUpperCase(), marginX, cursorY);
      recordText(companyHeader);

      if (period) {
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(7.8);
        pdf.setTextColor(...COLORS.ink);
        drawSafePdfText(pdf, `[${period}]`, 210 - marginX, cursorY, { align: 'right' });
        recordText(period);
      }
      cursorY += 4.2;

      if (exp.role) {
        pdf.setFont('times', 'italic');
        pdf.setFontSize(10);
        pdf.setTextColor(...COLORS.vermilion);
        drawSafePdfText(pdf, exp.role, marginX, cursorY);
        recordText(exp.role);
        cursorY += 4.3;
      }

      const bullets = formatExperienceBullets(exp);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.9);
      pdf.setTextColor(...COLORS.ink);
      bullets.forEach((b) => {
        drawSafePdfText(pdf, '-', marginX + 1, cursorY);
        cursorY = drawWrappedVectorText(
          pdf,
          b,
          marginX + 5,
          cursorY,
          contentWidth - 5,
          4.1,
          recordText
        );
        cursorY += 0.6;
      });
    });
    cursorY += 4;
  }

  // Formação Acadêmica & Pós-Graduação
  if (page.education.length > 0) {
    drawExecSectionHeader('Formação Acadêmica & Pós-Graduação');
    page.education.forEach((edu) => {
      const degreeTitle = formatEducationDegreeTitle(edu);
      const period = formatEducationPeriodText(edu);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.2);
      pdf.setTextColor(...COLORS.ink);
      drawSafePdfText(pdf, degreeTitle, marginX, cursorY);
      recordText(degreeTitle);

      if (period) {
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(7.8);
        pdf.setTextColor(...COLORS.inkMuted);
        drawSafePdfText(pdf, period, 210 - marginX, cursorY, { align: 'right' });
        recordText(period);
      }
      cursorY += 4;

      if (edu.institution) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8.6);
        pdf.setTextColor(...COLORS.inkMuted);
        cursorY = drawWrappedVectorText(
          pdf,
          edu.institution,
          marginX,
          cursorY,
          contentWidth,
          3.9,
          recordText
        );
      }
      cursorY += 1.5;
    });
    cursorY += 2;
  }

  // Conselhos & Certificações
  if (page.courses.length > 0) {
    drawExecSectionHeader('Conselhos, Cursos & Certificações');
    page.courses.forEach((c) => {
      const line = [
        c.name,
        c.institution ? `· ${c.institution}` : '',
        c.workload ? `(${c.workload})` : '',
      ]
        .filter(Boolean)
        .join(' ');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.8);
      pdf.setTextColor(...COLORS.ink);
      drawSafePdfText(pdf, line, marginX, cursorY);
      recordText(line);

      if (c.completionYear) {
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(7.8);
        pdf.setTextColor(...COLORS.inkMuted);
        drawSafePdfText(pdf, c.completionYear, 210 - marginX, cursorY, { align: 'right' });
        recordText(c.completionYear);
      }
      cursorY += 4.2;
    });
    cursorY += 2;
  }

  // Idiomas & Informações Adicionais
  if (page.languages.length > 0 || page.additionalNotes.trim()) {
    drawExecSectionHeader('Idiomas & Informações Executivas');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.8);
    pdf.setTextColor(...COLORS.ink);

    if (page.languages.length > 0) {
      const langLine = `Idiomas: ${page.languages
        .map((l) => `${l.language} (${l.proficiency})`)
        .join(' · ')}`;
      cursorY = drawWrappedVectorText(
        pdf,
        langLine,
        marginX,
        cursorY,
        contentWidth,
        4.1,
        recordText
      );
      cursorY += 1;
    }

    if (page.additionalNotes.trim()) {
      cursorY = drawWrappedVectorText(
        pdf,
        `Notas: ${page.additionalNotes}`,
        marginX,
        cursorY,
        contentWidth,
        4.1,
        recordText
      );
    }
  }

  drawPageFooter(pdf, marginX, 'FOLIO · MATRIZ EXECUTIVA (CONSELHO)', page, recordText);
}

/* ============================================================================
 * RENDERIZADOR VETORIAL M·05: TÉCNICO (Série Engenharia — Modular & Stack)
 * ============================================================================ */
function renderTecnicoPageToPDF(
  pdf: JsPDFType,
  page: PaginatedResumePage,
  recordText: (t: string) => void
): void {
  const marginX = 16;
  const contentWidth = 210 - marginX * 2; // 178mm
  let cursorY = 16;

  const { personal } = page;
  const allSkills = [...page.skills, ...page.skillGroups.flatMap((g) => g.skills)];

  if (page.isFirstPage) {
    // Tarja Superior Grafite (Ficha de Especificação M·05)
    pdf.setFillColor(...COLORS.ink);
    pdf.rect(marginX, cursorY, contentWidth, 5.5, 'F');
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(...COLORS.ivory);
    drawSafePdfText(
      pdf,
      'ESPECIFICAÇÃO PROFISSIONAL · MATRIZ M·05 (TÉCNICO)',
      marginX + 2.5,
      cursorY + 3.8
    );
    drawSafePdfText(pdf, 'ISO 216 · A4', 210 - marginX - 2.5, cursorY + 3.8, {
      align: 'right',
    });

    const headerBoxTop = cursorY + 5.5;
    const splitX = marginX + 108;

    // Célula Esquerda: Nome e Especialidade Técnica
    let leftY = headerBoxTop + 6;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    pdf.setTextColor(...COLORS.ink);
    drawSafePdfText(
      pdf,
      (personal.fullName || 'Profissional').toUpperCase(),
      marginX + 3,
      leftY
    );
    recordText(personal.fullName);
    leftY += 5;

    if (personal.roleTitle?.trim()) {
      pdf.setFont('courier', 'bold');
      pdf.setFontSize(8.5);
      pdf.setTextColor(...COLORS.vermilion);
      leftY = drawWrappedVectorText(
        pdf,
        personal.roleTitle,
        marginX + 3,
        leftY,
        102,
        3.9,
        recordText
      );
    }

    // Célula Direita: Tabela Monoespaçada de Contato
    let rightY = headerBoxTop + 4.5;
    const rightCellWidth = 210 - marginX - splitX - 4;
    pdf.setFont('courier', 'normal');
    pdf.setFontSize(7.3);
    pdf.setTextColor(...COLORS.ink);

    const techContacts = [
      personal.location ? `LOC: ${personal.location}` : '',
      personal.email ? `MAIL: ${personal.email}` : '',
      personal.phone ? `TEL: ${personal.phone}` : '',
      personal.portfolio || personal.linkedin || personal.portfolioOrLinkedin
        ? `REF: ${personal.portfolio || personal.linkedin || personal.portfolioOrLinkedin}`
        : '',
    ].filter(Boolean);

    techContacts.forEach((tc) => {
      rightY = drawWrappedVectorText(
        pdf,
        tc,
        splitX + 2.5,
        rightY,
        rightCellWidth,
        3.6,
        recordText
      );
    });

    if (personal.photoUrl) {
      tryDrawProfilePhoto(pdf, personal.photoUrl, splitX - 20, headerBoxTop + 2, 18, 22);
      leftY = Math.max(leftY, headerBoxTop + 25);
    }

    const headerBoxHeight = Math.max(leftY, rightY, headerBoxTop + 18) - headerBoxTop + 2;
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.35);
    pdf.rect(marginX, headerBoxTop, contentWidth, headerBoxHeight, 'S');
    pdf.line(splitX, headerBoxTop, splitX, headerBoxTop + headerBoxHeight);

    cursorY = headerBoxTop + headerBoxHeight + 5;
  } else {
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.35);
    pdf.rect(marginX, cursorY, contentWidth, 7, 'S');
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(7.8);
    pdf.setTextColor(...COLORS.ink);
    const contHeader = `${personal.fullName.toUpperCase()} - ESPECIFICAÇÃO TÉCNICA (CONTINUAÇÃO)`;
    drawSafePdfText(pdf, contHeader, marginX + 2.5, cursorY + 4.6);
    recordText(contHeader);
    cursorY += 11;
  }

  // Objetivo e Resumo Técnico
  if (
    (page.showObjective && personal.objective?.trim()) ||
    (page.showSummary && personal.summary?.trim())
  ) {
    const startBarY = cursorY - 3;
    if (page.showObjective && personal.objective?.trim()) {
      pdf.setFont('courier', 'bold');
      pdf.setFontSize(7.8);
      pdf.setTextColor(...COLORS.vermilion);
      drawSafePdfText(pdf, '[OBJETIVO TÉCNICO]', marginX + 3, cursorY);
      cursorY += 3.8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(...COLORS.ink);
      cursorY = drawWrappedVectorText(
        pdf,
        personal.objective,
        marginX + 3,
        cursorY,
        contentWidth - 4,
        4.2,
        recordText
      );
      cursorY += 1.5;
    }

    if (page.showSummary && personal.summary?.trim()) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(...COLORS.ink);
      cursorY = drawWrappedVectorText(
        pdf,
        personal.summary,
        marginX + 3,
        cursorY,
        contentWidth - 4,
        4.2,
        recordText
      );
    }

    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.6);
    pdf.line(marginX, startBarY, marginX, cursorY - 2);
    cursorY += 3.5;
  }

  // [01] MATRIZ DE COMPETÊNCIAS TÉCNICAS, FERRAMENTAS & TECNOLOGIAS NO TOPO
  if (allSkills.length > 0 || (page.isFirstPage && page.languages.length > 0)) {
    const matrixTopY = cursorY;
    pdf.setFillColor(...COLORS.ivory);
    pdf.rect(marginX, matrixTopY, contentWidth, 5.5, 'F');
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.3);
    pdf.rect(marginX, matrixTopY, contentWidth, 5.5, 'S');

    pdf.setFont('courier', 'bold');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COLORS.ink);
    drawSafePdfText(
      pdf,
      '[01] MATRIZ DE COMPETÊNCIAS TÉCNICAS, FERRAMENTAS & TECNOLOGIAS',
      marginX + 2.5,
      matrixTopY + 3.8
    );

    let matrixBodyY = matrixTopY + 9.5;
    if (allSkills.length > 0) {
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(8.2);
      pdf.setTextColor(...COLORS.ink);
      const skillsFormatted = allSkills.map((s) => `[${s}]`).join('  ');
      matrixBodyY = drawWrappedVectorText(
        pdf,
        skillsFormatted,
        marginX + 2.5,
        matrixBodyY,
        contentWidth - 5,
        4.1,
        recordText
      );
      recordText(allSkills.join(' · '));
      matrixBodyY += 1;
    }

    if (page.languages.length > 0) {
      pdf.setFont('courier', 'bold');
      pdf.setFontSize(7.6);
      pdf.setTextColor(...COLORS.inkMuted);
      const langFormatted = `IDIOMAS: ${page.languages
        .map((l) => `${l.language} (${l.proficiency})`)
        .join('  ·  ')}`;
      matrixBodyY = drawWrappedVectorText(
        pdf,
        langFormatted,
        marginX + 2.5,
        matrixBodyY,
        contentWidth - 5,
        4,
        recordText
      );
    }

    const totalMatrixH = matrixBodyY - matrixTopY + 1.5;
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.3);
    pdf.rect(marginX, matrixTopY, contentWidth, totalMatrixH, 'S');
    cursorY = matrixTopY + totalMatrixH + 5.5;
  }

  const drawTechSectionHeader = (code: string, title: string) => {
    pdf.setFillColor(...COLORS.ink);
    pdf.rect(marginX, cursorY - 3.3, 8, 4.5, 'F');
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(7.2);
    pdf.setTextColor(...COLORS.ivory);
    drawSafePdfText(pdf, code, marginX + 1.2, cursorY - 0.2);

    pdf.setFont('courier', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(...COLORS.ink);
    drawSafePdfText(pdf, title.toUpperCase(), marginX + 10, cursorY - 0.2);
    recordText(title);

    cursorY += 2;
    pdf.setDrawColor(...COLORS.ink);
    pdf.setLineWidth(0.35);
    pdf.line(marginX, cursorY, 210 - marginX, cursorY);
    cursorY += 4.5;
  };

  // [02] Experiência Profissional & Engenharia
  if (page.experiences.length > 0) {
    drawTechSectionHeader('[02]', 'Experiência Profissional & Engenharia');

    page.experiences.forEach((exp, idx) => {
      if (idx > 0) cursorY += 2.5;
      const roleTitle = exp.role || exp.company;
      const period = formatExperiencePeriodText(exp);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.6);
      pdf.setTextColor(...COLORS.ink);
      drawSafePdfText(pdf, roleTitle, marginX, cursorY);
      recordText(roleTitle);

      if (period) {
        pdf.setFont('courier', 'bold');
        pdf.setFontSize(7.8);
        pdf.setTextColor(...COLORS.vermilion);
        drawSafePdfText(pdf, `[${period}]`, 210 - marginX, cursorY, { align: 'right' });
        recordText(period);
      }
      cursorY += 4.1;

      const companyAndLoc = [exp.company, exp.location].filter(Boolean).join(' // ');
      if (companyAndLoc) {
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(...COLORS.inkMuted);
        drawSafePdfText(pdf, companyAndLoc, marginX, cursorY);
        recordText(companyAndLoc);
        cursorY += 4.1;
      }

      const bullets = formatExperienceBullets(exp);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.8);
      pdf.setTextColor(...COLORS.ink);
      bullets.forEach((b) => {
        pdf.setFont('courier', 'bold');
        drawSafePdfText(pdf, '>', marginX + 0.5, cursorY);
        pdf.setFont('helvetica', 'normal');
        cursorY = drawWrappedVectorText(
          pdf,
          b,
          marginX + 4.5,
          cursorY,
          contentWidth - 4.5,
          4.1,
          recordText
        );
        cursorY += 0.5;
      });
    });
    cursorY += 3.5;
  }

  // [03] Formação Acadêmica
  if (page.education.length > 0) {
    drawTechSectionHeader('[03]', 'Formação Acadêmica');
    page.education.forEach((edu) => {
      const degreeTitle = formatEducationDegreeTitle(edu);
      const period = formatEducationPeriodText(edu);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.2);
      pdf.setTextColor(...COLORS.ink);
      drawSafePdfText(pdf, degreeTitle, marginX, cursorY);
      recordText(degreeTitle);

      if (period) {
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(7.8);
        pdf.setTextColor(...COLORS.inkMuted);
        drawSafePdfText(pdf, `[${period}]`, 210 - marginX, cursorY, { align: 'right' });
        recordText(period);
      }
      cursorY += 4;

      if (edu.institution) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8.5);
        pdf.setTextColor(...COLORS.inkMuted);
        cursorY = drawWrappedVectorText(
          pdf,
          edu.institution,
          marginX,
          cursorY,
          contentWidth,
          3.9,
          recordText
        );
      }
      cursorY += 1.5;
    });
    cursorY += 2;
  }

  // [04] Certificações, Normas & Cursos
  if (page.courses.length > 0) {
    drawTechSectionHeader('[04]', 'Certificações, Normas & Cursos');
    page.courses.forEach((c) => {
      const line = [
        c.name,
        c.institution ? `· ${c.institution}` : '',
        c.workload ? `(${c.workload})` : '',
      ]
        .filter(Boolean)
        .join(' ');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.8);
      pdf.setTextColor(...COLORS.ink);
      drawSafePdfText(pdf, line, marginX, cursorY);
      recordText(line);

      if (c.completionYear) {
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(7.8);
        pdf.setTextColor(...COLORS.inkMuted);
        drawSafePdfText(pdf, c.completionYear, 210 - marginX, cursorY, { align: 'right' });
        recordText(c.completionYear);
      }
      cursorY += 4.2;
    });
    cursorY += 2;
  }

  // Especificações Adicionais
  if (page.additionalNotes.trim()) {
    drawTechSectionHeader('[05]', 'Especificações Complementares');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.8);
    pdf.setTextColor(...COLORS.ink);
    cursorY = drawWrappedVectorText(
      pdf,
      page.additionalNotes,
      marginX,
      cursorY,
      contentWidth,
      4.1,
      recordText
    );
  }

  drawPageFooter(pdf, marginX, 'FOLIO · MATRIZ TÉCNICA (ENGENHARIA)', page, recordText);
}

function drawPageFooter(
  pdf: JsPDFType,
  marginX: number,
  matrixLabel: string,
  page: PaginatedResumePage,
  recordText: (t: string) => void
): void {
  const footerLineY = 281;
  pdf.setDrawColor(...COLORS.paper);
  pdf.setLineWidth(0.25);
  pdf.line(marginX, footerLineY, 210 - marginX, footerLineY);

  pdf.setFont('courier', 'normal');
  pdf.setFontSize(7.2);
  pdf.setTextColor(...COLORS.inkSubtle);
  drawSafePdfText(pdf, matrixLabel, marginX, footerLineY + 4.5);

  const pageCounter = `PÁG. ${String(page.pageNumber).padStart(2, '0')} / ${String(
    page.totalPages
  ).padStart(2, '0')}`;
  drawSafePdfText(pdf, pageCounter, 210 - marginX, footerLineY + 4.5, { align: 'right' });
  recordText(pageCounter);
}
