/**
 * Shared rules for the bill actions on Student Billing (waivers, edits, reversals), so every screen
 * applies them the same way.
 */

export const round2 = (n: number) => Math.round((Number(n) || 0) * 100) / 100;

/** The app's standard statuses: a bill is 'Paid' when nothing is owed, otherwise 'Unpaid' (or 'Overdue'). */
export function standardStatus(billed: number, paid: number, waiver: number, prevStatus?: string): 'Paid' | 'Unpaid' | 'Overdue' {
  if (round2(billed) - round2(paid) - round2(waiver) <= 0.009) return 'Paid';
  return prevStatus === 'Overdue' ? 'Overdue' : 'Unpaid';
}

export const billBalance = (r: any) =>
  round2((Number(r?.billedAmount) || 0) - (Number(r?.amountPaid) || 0) - (Number(r?.waiverAmount) || 0));

/**
 * Payments on a bill that a reversal may undo: real receipts that are still active.
 * Excluded: receipts already reversed, the negative "-REV" entries themselves, credit brought forward from a
 * closed term (not cash), and anything with no positive amount. Surplus moved in from another receipt
 * ("allocation") is included — it is part of what was paid on this bill.
 */
export function reversiblePayments<T extends { amount?: any; status?: any; isReversal?: any; isCarryForward?: any }>(list: T[]): T[] {
  return (list || []).filter(p =>
    p && p.status !== 'Reversed' && p.status !== 'Cancelled' && !p.isReversal && !p.isCarryForward && (Number(p.amount) || 0) > 0
  );
}
