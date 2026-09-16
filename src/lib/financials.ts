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

/**
 * Normalizes academic year string to standard YYYY-YYYY format
 * e.g., "2025/2026" -> "2025-2026", "2025 - 2026" -> "2025-2026", "2026" -> "2026-2027"
 */
export function normalizeAcademicYear(yearStr?: string | null): string {
  if (!yearStr) return '';
  const cleaned = yearStr.trim();
  const match = cleaned.match(/(\d{4})\s*[\/-]\s*(\d{4})/);
  if (match) {
    return `${match[1]}-${match[2]}`;
  }
  const singleMatch = cleaned.match(/^(\d{4})$/);
  if (singleMatch) {
    const yr = parseInt(singleMatch[1], 10);
    return `${yr}-${yr + 1}`;
  }
  return cleaned.replace('/', '-');
}

/**
 * Returns the starting calendar year of an academic year string
 * e.g., "2025-2026" -> 2025, "2026/2027" -> 2026
 */
export function getAcademicYearStart(yearStr?: string | null): number | null {
  if (!yearStr) return null;
  const normalized = normalizeAcademicYear(yearStr);
  const match = normalized.match(/^(\d{4})/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
}

/**
 * Checks if yearA is strictly prior to yearB
 * e.g. "2024-2025" is prior to "2025-2026" -> true
 * "2025/2026" is prior to "2025-2026" -> false (same year)
 * "2026-2027" is prior to "2025-2026" -> false (current/future year)
 */
export function isPriorAcademicYear(yearA?: string | null, yearB?: string | null): boolean {
  const startA = getAcademicYearStart(yearA);
  const startB = getAcademicYearStart(yearB);
  if (startA !== null && startB !== null) {
    return startA < startB;
  }
  return false;
}

/**
 * Checks if two academic years represent the same academic year
 * e.g. "2025/2026" and "2025-2026" -> true
 */
export function isSameAcademicYear(yearA?: string | null, yearB?: string | null): boolean {
  if (!yearA || !yearB) return false;
  const normA = normalizeAcademicYear(yearA);
  const normB = normalizeAcademicYear(yearB);
  if (normA && normB && normA === normB) return true;
  const startA = getAcademicYearStart(yearA);
  const startB = getAcademicYearStart(yearB);
  if (startA !== null && startB !== null) {
    return startA === startB;
  }
  return false;
}

/**
 * Calculates standard default academic year based on current calendar date
 * In Ghana and standard September-based systems, months August (7) through December (11)
 * belong to the starting year of the new academic cycle.
 * e.g., September 2026 -> "2026-2027", May 2026 -> "2025-2026"
 */
export function getDefaultAcademicYear(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Jan, 7 = Aug, 8 = Sep
  if (month >= 7) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
}
