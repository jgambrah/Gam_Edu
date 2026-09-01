import { differenceInCalendarDays, startOfDay } from 'date-fns';

export interface FinancialSummary {
  billedTarget: number;
  totalCollected: number;
  collectionRate: number;
  streamBreakdown: {
    tuition: number;
    canteen: number;
    transport: number;
    auxiliary: number;
  };
  grossReceivables: number;
  advanceCredits: number;
  netReceivables: number;
  aging: {
    current: { amount: number; count: number };
    days30: { amount: number; count: number };
    days60: { amount: number; count: number };
    days90Plus: { amount: number; count: number };
  };
}

/**
 * Pure Utility: Calculate Collection Rate percentage
 * Collection Rate (%) = (Gross Collections / Total Billed Target) * 100
 * Handles zero division defensively and rounds to 1 decimal place.
 */
export function calculateCollectionRate(collectedAmount: number, billedAmount: number): number {
  if (!billedAmount || billedAmount <= 0) return 0;
  if (!collectedAmount || collectedAmount <= 0) return 0;
  const rate = (collectedAmount / billedAmount) * 100;
  return Math.round(rate * 10) / 10;
}

/**
 * Pure Utility: Calculate Billing Totals and Receivables Reconciliation
 * Billed Target = max(sum of posted invoice billed amounts, Gross Collections + Gross Receivables)
 */
export function calculateBillingTotals(
  invoices: any[] = [],
  payments: any[] = [],
  explicitCredits: number = 0
): {
  totalCollected: number;
  grossReceivables: number;
  advanceCredits: number;
  billedTarget: number;
  netReceivables: number;
  collectionRate: number;
} {
  let totalCollected = 0;
  payments.forEach((p: any) => {
    if (p.status === 'Reversed' || p.status === 'Cancelled' || p.status === 'Pending Reversal') return;
    const amount = Number(p.amount) || Number(p.amountPaid) || 0;
    if (amount > 0) totalCollected += amount;
  });

  let sumBilled = 0;
  let grossReceivables = 0;
  let overpaymentCredits = 0;

  invoices.forEach((inv: any) => {
    if (inv.status === 'Pending Reversal') return;
    const billed = Number(inv.billedAmount) || 0;
    const paid = Number(inv.amountPaid) || 0;
    const waiver = Number(inv.waiverAmount) || 0;

    sumBilled += billed;
    const balance = billed - paid - waiver;

    if (balance < -0.01) {
      overpaymentCredits += Math.abs(balance);
    } else if (balance > 0.01) {
      grossReceivables += balance;
    }
  });

  const advanceCredits = Math.max(overpaymentCredits, explicitCredits);
  const billedTarget = Math.max(sumBilled, totalCollected + grossReceivables);
  const netReceivables = Math.max(0, grossReceivables - advanceCredits);
  const collectionRate = calculateCollectionRate(totalCollected, billedTarget);

  return {
    totalCollected,
    grossReceivables,
    advanceCredits,
    billedTarget,
    netReceivables,
    collectionRate,
  };
}

/**
 * Pure Utility: Calculate Aging Buckets based on due dates
 * Aging tiers:
 * - current: <= 0 days overdue
 * - days30: 1 to 30 days overdue
 * - days60: 31 to 60 days overdue
 * - days90Plus: > 60 days overdue (61+ days overdue)
 */
export function calculateAgingBuckets(
  unpaidInvoices: any[] = [],
  asOfDate: Date = new Date()
): FinancialSummary['aging'] {
  const asOf = startOfDay(asOfDate);
  const result: FinancialSummary['aging'] = {
    current: { amount: 0, count: 0 },
    days30: { amount: 0, count: 0 },
    days60: { amount: 0, count: 0 },
    days90Plus: { amount: 0, count: 0 },
  };

  unpaidInvoices.forEach((inv: any) => {
    if (inv.status === 'Pending Reversal') return;
    const billed = Number(inv.billedAmount) || 0;
    const paid = Number(inv.amountPaid) || 0;
    const waiver = Number(inv.waiverAmount) || 0;
    const balance = billed - paid - waiver;
    if (balance <= 0.01) return;

    let dueDate = inv.dueDate;
    if (typeof dueDate?.toDate === 'function') dueDate = dueDate.toDate();
    else if (dueDate) dueDate = new Date(dueDate);

    if (!dueDate || isNaN(dueDate.getTime())) {
      result.days30.amount += balance;
      result.days30.count++;
      return;
    }

    const diffDays = differenceInCalendarDays(asOf, startOfDay(dueDate));
    if (diffDays <= 0) {
      result.current.amount += balance;
      result.current.count++;
    } else if (diffDays <= 30) {
      result.days30.amount += balance;
      result.days30.count++;
    } else if (diffDays <= 60) {
      result.days60.amount += balance;
      result.days60.count++;
    } else {
      result.days90Plus.amount += balance;
      result.days90Plus.count++;
    }
  });

  return result;
}
