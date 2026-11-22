import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { buildStatementLedger, statementPeriodTotals } from '@/lib/statement-ledger';

/**
 * Builds the student financial statement as a real (text-based) multi-page A4 PDF.
 *
 * Unlike the old screenshot approach (html2canvas -> image), the text stays sharp, can be selected and
 * searched, the file is a few hundred KB instead of tens of MB, and page breaks fall between ledger rows,
 * so no line is ever lost or cut between pages. The table header repeats on every page and the closing
 * balance always appears on the last page.
 */
export interface StatementPdfInput {
  studentName: string;
  studentCode?: string;
  records: any[];
  payments: any[];
  dateRange?: DateRange;
  closingBalance: number;
  school: {
    name?: string;
    motto?: string;
    address?: string;
    contactLine?: string;
    logoDataUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
  now?: Date;
  /** Compress page streams (default true). Turned off only in tests so the text can be inspected. */
  compress?: boolean;
}

type RGB = [number, number, number];

function hexToRgb(hex: string | undefined, fallback: RGB): RGB {
  if (!hex) return fallback;
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return fallback;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

// The built-in PDF fonts cannot draw the cedi sign (₵), so amounts are written as "GHS".
function money(n: number): string {
  const abs = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${n < 0 ? '-' : ''}GHS ${abs}`;
}

// Keep text inside the built-in font's character set (e.g. replace the cedi sign, smart quotes, bullets).
function safe(text: string | undefined | null): string {
  return String(text ?? '')
    .replace(/GH₵|₵/g, 'GHS ')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/•/g, '-')
    .replace(/[^\x00-\xFF]/g, '');
}

function imageFormatOf(dataUrl: string): string | null {
  const m = /^data:image\/(png|jpe?g|webp)/i.exec(dataUrl);
  if (!m) return null;
  const f = m[1].toLowerCase();
  return f === 'jpg' || f === 'jpeg' ? 'JPEG' : f.toUpperCase();
}

export function buildStatementPdf(input: StatementPdfInput): jsPDF {
  const now = input.now ?? new Date();
  const primary = hexToRgb(input.school.primaryColor, [30, 41, 59]);
  const secondary = hexToRgb(input.school.secondaryColor || input.school.primaryColor, primary);
  const slate800: RGB = [30, 41, 59];
  const slate500: RGB = [100, 116, 139];
  const slate400: RGB = [148, 163, 184];
  const emerald: RGB = [5, 150, 105];
  const indigo: RGB = [79, 70, 229];

  const entries = buildStatementLedger(input.records, input.payments, input.dateRange);
  const { totalBilled, totalPaid, balanceBroughtForward } = statementPeriodTotals(entries, input.closingBalance);

  const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: input.compress !== false });
  const W = pdf.internal.pageSize.getWidth();   // 210
  const H = pdf.internal.pageSize.getHeight();  // 297
  const M = 14;                                 // side margin
  const contentBottom = H - 16;                 // leave room for the page footer

  // Table columns (total width = W - 2M = 182mm)
  const colDesc = { x: M, w: 86 };
  const colDebit = { x: M + 86, w: 30 };
  const colCredit = { x: M + 116, w: 30 };
  const colBal = { x: M + 146, w: 36 };
  const cellPad = 2.5;

  const setText = (rgb: RGB) => pdf.setTextColor(rgb[0], rgb[1], rgb[2]);
  const setFill = (rgb: RGB) => pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
  const setDraw = (rgb: RGB) => pdf.setDrawColor(rgb[0], rgb[1], rgb[2]);

  const periodText = `${input.dateRange?.from ? format(input.dateRange.from, 'PPP') : 'Opening of Ledger'} - ${input.dateRange?.to ? format(input.dateRange.to, 'PPP') : 'Today'}`;

  // ---------- First-page header ----------
  let y = 0;
  const headerH = 36;
  setFill(primary);
  pdf.rect(0, 0, W, headerH, 'F');

  let textLeft = M;
  if (input.school.logoDataUrl) {
    const fmt = imageFormatOf(input.school.logoDataUrl);
    if (fmt) {
      try {
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(M, 8, 20, 20, 3, 3, 'F');
        pdf.addImage(input.school.logoDataUrl, fmt, M + 2, 10, 16, 16, undefined, 'FAST');
        textLeft = M + 25;
      } catch {
        textLeft = M; // unsupported logo image: skip it rather than fail the statement
      }
    }
  }

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  const nameLines = pdf.splitTextToSize(safe(input.school.name || 'School Name').toUpperCase(), W - textLeft - 60);
  pdf.text(nameLines.slice(0, 2), textLeft, 14);
  let hy = 14 + (Math.min(nameLines.length, 2) - 1) * 6 + 5;
  pdf.setFontSize(7.5);
  if (input.school.motto) {
    pdf.setFont('helvetica', 'italic');
    pdf.text(`"${safe(input.school.motto)}"`, textLeft, hy);
    hy += 4;
  }
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.5);
  if (input.school.address) {
    pdf.text(pdf.splitTextToSize(safe(input.school.address).toUpperCase(), W - textLeft - 60).slice(0, 1), textLeft, hy);
    hy += 3.5;
  }
  if (input.school.contactLine) {
    pdf.text(pdf.splitTextToSize(safe(input.school.contactLine), W - textLeft - 60).slice(0, 1), textLeft, hy);
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('STATEMENT', W - M, 16, { align: 'right' });
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Run Date: ${format(now, 'PPP')}`, W - M, 22, { align: 'right' });

  y = headerH + 8;

  // ---------- Account holder / period box ----------
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(241, 245, 249);
  pdf.roundedRect(M, y, W - 2 * M, 22, 3, 3, 'FD');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.5);
  setText(slate400);
  pdf.text('ACCOUNT HOLDER', M + 5, y + 6);
  pdf.text('BILLING PERIOD', W - M - 5, y + 6, { align: 'right' });
  pdf.setFontSize(12);
  setText(slate800);
  pdf.text(pdf.splitTextToSize(safe(input.studentName).toUpperCase(), 95).slice(0, 1), M + 5, y + 12.5);
  pdf.setFontSize(8.5);
  pdf.text(safe(periodText), W - M - 5, y + 12.5, { align: 'right' });
  pdf.setFontSize(7.5);
  pdf.setFont('courier', 'bold');
  setText(slate500);
  if (input.studentCode) pdf.text(safe(input.studentCode), M + 5, y + 17.5);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.5);
  setText(slate400);
  pdf.text('VERIFIED BALANCE STATEMENT', W - M - 5, y + 17.5, { align: 'right' });
  y += 30;

  // ---------- Ledger table ----------
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  setText(primary);
  pdf.text('LEDGER TRANSACTION ENTRIES', M, y);
  setDraw(secondary);
  pdf.setLineWidth(0.5);
  pdf.line(M, y + 1.5, W - M, y + 1.5);
  y += 5;

  const drawTableHeader = () => {
    const h = 9;
    setFill(secondary);
    pdf.rect(M, y, W - 2 * M, h, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    const ty = y + 5.8;
    pdf.text('POSTING DATE & DESCRIPTION', colDesc.x + cellPad + 2, ty);
    pdf.text('CHARGES (DEBITS)', colDebit.x + colDebit.w - cellPad, ty, { align: 'right' });
    pdf.text('RECEIPTS (CREDITS)', colCredit.x + colCredit.w - cellPad, ty, { align: 'right' });
    pdf.text('RUNNING BALANCE', colBal.x + colBal.w - cellPad, ty, { align: 'right' });
    y += h;
  };

  const startContinuationPage = () => {
    pdf.addPage();
    y = 14;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    setText(primary);
    pdf.text(safe(`${input.school.name || ''}`).toUpperCase(), M, y);
    pdf.setFont('helvetica', 'normal');
    setText(slate500);
    pdf.text(safe(`Statement - ${input.studentName} (continued)`), W - M, y, { align: 'right' });
    setDraw(secondary);
    pdf.setLineWidth(0.3);
    pdf.line(M, y + 2, W - M, y + 2);
    y += 7;
    drawTableHeader();
  };

  const rowBorder = () => {
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.2);
    pdf.line(M, y, W - M, y);
  };

  drawTableHeader();

  // Opening balance row
  {
    const h = 9;
    pdf.setFillColor(248, 250, 252);
    pdf.rect(M, y, W - 2 * M, h, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    setText(slate500);
    pdf.text('OPENING BALANCE BROUGHT FORWARD', colDesc.x + cellPad + 2, y + 5.8);
    pdf.setFontSize(8);
    setText(slate800);
    pdf.text(money(balanceBroughtForward), colBal.x + colBal.w - cellPad, y + 5.8, { align: 'right' });
    y += h;
    rowBorder();
  }

  let running = balanceBroughtForward;
  entries.forEach((entry, i) => {
    running += entry.debit - entry.credit;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    const descLines: string[] = pdf.splitTextToSize(safe(entry.description), colDesc.w - 2 * cellPad - 2);
    const lineH = 3.6;
    const rowH = 3 + descLines.length * lineH + 3.4 + 2.2;

    if (y + rowH > contentBottom) startContinuationPage();

    if (i % 2 === 1) {
      pdf.setFillColor(250, 251, 252);
      pdf.rect(M, y, W - 2 * M, rowH, 'F');
    }

    // Description + type/date
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    setText(slate800);
    pdf.text(descLines, colDesc.x + cellPad + 2, y + 3 + 2.6, { lineHeightFactor: 1.25 });
    pdf.setFontSize(6);
    setText(indigo);
    pdf.text(`${entry.type.toUpperCase()} - ${format(entry.date, 'dd MMM yyyy')}`, colDesc.x + cellPad + 2, y + 3 + descLines.length * lineH + 2.4);

    // Amounts (vertically aligned with the first description line)
    const ay = y + 3 + 2.6;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    setText([51, 65, 85]);
    pdf.text(entry.debit > 0 ? money(entry.debit) : '-', colDebit.x + colDebit.w - cellPad, ay, { align: 'right' });
    setText(emerald);
    pdf.text(entry.credit !== 0 ? money(entry.credit) : '-', colCredit.x + colCredit.w - cellPad, ay, { align: 'right' });
    setText(primary);
    pdf.text(money(running), colBal.x + colBal.w - cellPad, ay, { align: 'right' });

    // Column separators
    pdf.setDrawColor(241, 245, 249);
    pdf.setLineWidth(0.2);
    [colDebit.x, colCredit.x, colBal.x].forEach(x => pdf.line(x, y, x, y + rowH));

    y += rowH;
    rowBorder();
  });

  if (entries.length === 0) {
    const h = 10;
    if (y + h > contentBottom) startContinuationPage();
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    setText(slate400);
    pdf.text('No transactions in this period.', W / 2, y + 6.5, { align: 'center' });
    y += h;
    rowBorder();
  }

  // ---------- Totals + seal (kept together, always on the last page) ----------
  // totals (~37mm) + seal & signature (~44mm)
  const closingBlockH = 82;
  if (y + 10 + closingBlockH > contentBottom) {
    pdf.addPage();
    y = 14;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    setText(slate500);
    pdf.text(safe(`Statement - ${input.studentName} (continued)`), W - M, y, { align: 'right' });
    y += 8;
  } else {
    y += 10;
  }

  const boxX = W / 2;
  const boxW = W - M - boxX;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  setText(slate400);
  pdf.text('CHARGES THIS PERIOD', boxX + 2, y + 4);
  setText(slate800);
  pdf.text(money(totalBilled), W - M, y + 4, { align: 'right' });
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineDashPattern([1, 1], 0);
  pdf.line(boxX, y + 6, W - M, y + 6);
  y += 8;
  setText(slate400);
  pdf.text('PAYMENTS / WAIVERS THIS PERIOD', boxX + 2, y + 4);
  setText(emerald);
  pdf.text(money(totalPaid), W - M, y + 4, { align: 'right' });
  pdf.line(boxX, y + 6, W - M, y + 6);
  pdf.setLineDashPattern([], 0);
  y += 10;

  setFill(primary);
  pdf.roundedRect(boxX, y, boxW, 14, 3, 3, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7.5);
  pdf.text('STATEMENT OUTSTANDING BALANCE', boxX + 4, y + 8.5);
  pdf.setFontSize(12);
  pdf.text(money(input.closingBalance), W - M - 4, y + 9, { align: 'right' });
  y += 19;
  pdf.setFontSize(5.5);
  setText(slate400);
  pdf.text('* AUTHENTICATED ACADEMIC LEDGER TRANSCRIPT', W - M, y, { align: 'right' });

  // Seal
  const sealY = Math.max(y + 14, contentBottom - 32);
  const sealCx = M + 30;
  const sealCy = sealY + 12;
  pdf.setDrawColor(99, 102, 241);
  pdf.setLineWidth(0.3);
  pdf.setLineDashPattern([0.8, 0.8], 0);
  pdf.circle(sealCx, sealCy, 10, 'S');
  pdf.setLineDashPattern([], 0);
  pdf.circle(sealCx, sealCy, 8.8, 'S');
  pdf.circle(sealCx, sealCy, 6, 'S');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(5.5);
  pdf.setTextColor(99, 102, 241);
  pdf.text('OFFICIAL', sealCx, sealCy + 0.3, { align: 'center' });
  pdf.setFontSize(4.5);
  pdf.text('SEAL', sealCx, sealCy + 2.6, { align: 'center' });
  pdf.setDrawColor(203, 213, 225);
  pdf.setLineDashPattern([1, 1], 0);
  pdf.line(M + 8, sealCy + 14, M + 52, sealCy + 14);
  pdf.setLineDashPattern([], 0);
  pdf.setFontSize(6.5);
  setText(slate400);
  pdf.text("BURSAR'S VERIFIED SEAL", sealCx, sealCy + 18, { align: 'center' });
  pdf.setFontSize(5.5);
  pdf.text('GAM-EDU CLOUD LEDGER SYSTEM', W - M, sealCy + 18, { align: 'right' });

  // ---------- Page numbers on every page ----------
  const pageCount = pdf.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    pdf.setPage(p);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.5);
    setText(slate400);
    pdf.text(safe(`${input.studentName}${input.studentCode ? ` (${input.studentCode})` : ''}`), M, H - 8);
    pdf.text(`Page ${p} of ${pageCount}`, W - M, H - 8, { align: 'right' });
  }

  return pdf;
}
