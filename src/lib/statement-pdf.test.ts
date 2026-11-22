// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { buildStatementPdf } from './statement-pdf';

function pageText(pdf: ReturnType<typeof buildStatementPdf>): string {
  // Uncompressed raw PDF source contains every text string drawn on the pages.
  return pdf.output();
}

describe('buildStatementPdf', () => {
  const records = Array.from({ length: 70 }, (_, i) => ({
    id: `bill-${i}`,
    description: i % 7 === 0
      ? `Canteen Fee (Daily) - a deliberately long description that must wrap onto several lines in the PDF table row ${i}`
      : `Tuition Fee Instalment ${i}`,
    billedAmount: 100 + i,
    createdAt: { toDate: () => new Date(2026, 0, 1 + i) },
  }));
  const payments = [
    { id: 'rcpt-1', amount: 500, description: 'Payment Received', paidAt: { seconds: Date.UTC(2026, 1, 1) / 1000 } },
    { id: 'rcpt-2', amount: -50, notes: 'Reversal', processedByName: 'Bursar', paidAt: { seconds: Date.UTC(2026, 1, 2) / 1000 } },
  ];
  const totalBilled = records.reduce((a, r) => a + r.billedAmount, 0);
  const closingBalance = totalBilled - 450;

  const build = (compress = false) => buildStatementPdf({
    compress,
    studentName: 'Ama Mensah',
    studentCode: 'STU-001',
    records,
    payments,
    closingBalance,
    school: { name: "Mercy's Springfield Academy", motto: 'Knowledge is light', primaryColor: '#1e3a8a' },
    now: new Date(2026, 10, 22),
  });

  it('spreads a long ledger over several A4 pages with numbered pages', () => {
    const pdf = build();
    const pages = pdf.getNumberOfPages();
    expect(pages).toBeGreaterThan(2);
    const raw = pageText(pdf);
    expect(raw).toContain(`Page 1 of ${pages}`);
    expect(raw).toContain(`Page ${pages} of ${pages}`);
  });

  it('includes every ledger line and the closing balance (nothing lost between pages)', () => {
    const raw = pageText(build());
    for (let i = 1; i < 70; i++) {
      if (i % 7 !== 0) expect(raw).toContain(`Tuition Fee Instalment ${i}`);
    }
    expect(raw).toContain('Receipt #rcpt-1');
    expect(raw).toContain('STATEMENT OUTSTANDING BALANCE');
    const closing = closingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    expect(raw).toContain(`GHS ${closing}`);
  });

  it('is a small text PDF, not a large image', () => {
    const size = build(true).output('arraybuffer').byteLength;
    expect(size).toBeLessThan(300 * 1024);
  });
});
