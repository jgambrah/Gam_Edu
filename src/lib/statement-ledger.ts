import type { DateRange } from 'react-day-picker';

export interface StatementLedgerEntry {
  id: string;
  date: Date;
  description: string;
  debit: number;
  credit: number;
  type: 'Charge' | 'Payment' | 'Reversal' | 'Waiver';
  originalRecord?: any;
}

/**
 * Compiles a student's bills (debits), waivers and payments (credits) into one chronological ledger.
 * Shared by the on-screen statement preview and the downloadable PDF so both always show the same lines.
 */
export function buildStatementLedger(
  records: any[] | undefined,
  payments: any[] | undefined,
  dateRange?: DateRange,
): StatementLedgerEntry[] {
  const entries: StatementLedgerEntry[] = [];

  // 1. Charges (debits) and waivers (credits)
  (records || []).forEach(rec => {
    const recDate = rec.createdAt?.toDate ? rec.createdAt.toDate() : new Date();
    entries.push({
      id: `charge-${rec.id}`,
      date: recDate,
      description: rec.description || 'Service Charge',
      debit: rec.billedAmount || 0,
      credit: 0,
      type: 'Charge',
      originalRecord: rec,
    });

    if (rec.waiverAmount && rec.waiverAmount > 0) {
      entries.push({
        id: `waiver-${rec.id}`,
        date: recDate,
        description: `Waiver Applied for ${rec.description || 'Charge'}`,
        debit: 0,
        credit: rec.waiverAmount,
        type: 'Waiver',
        originalRecord: rec,
      });
    }
  });

  // 2. Payments (credits) and reversals (negative credits)
  (payments || []).forEach(pay => {
    const payDate = pay.paidAt?.toDate
      ? pay.paidAt.toDate()
      : (pay.paidAt?.seconds ? new Date(pay.paidAt.seconds * 1000) : new Date());

    if (dateRange?.from || dateRange?.to) {
      if (dateRange.from && payDate < dateRange.from) return;
      if (dateRange.to && payDate > dateRange.to) return;
    }

    if (pay.amount > 0) {
      entries.push({
        id: pay.id,
        date: payDate,
        description: `${pay.description || 'Payment Received'} (Receipt #${pay.id})` + (pay.status === 'Reversed' ? ' - [REVERSED]' : ''),
        debit: 0,
        credit: pay.amount,
        type: 'Payment',
        originalRecord: pay,
      });
    } else if (pay.amount < 0) {
      entries.push({
        id: pay.id,
        date: payDate,
        description: `${pay.notes || pay.description || 'Reversal of Payment'} (${pay.processedByName ? `by ${pay.processedByName}` : ''})`,
        debit: 0,
        credit: pay.amount,
        type: 'Reversal',
        originalRecord: pay,
      });
    }
  });

  // Oldest first
  return entries.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/** Period totals and the opening balance brought forward, given the student's overall closing balance. */
export function statementPeriodTotals(entries: StatementLedgerEntry[], closingBalance: number) {
  const totalBilled = entries.reduce((acc, r) => acc + r.debit, 0);
  const totalPaid = entries.reduce((acc, r) => acc + r.credit, 0);
  const balanceBroughtForward = closingBalance - (totalBilled - totalPaid);
  return { totalBilled, totalPaid, balanceBroughtForward };
}
