/**
 * Shared reading of the server's dashboard summary (dashboard_summaries/{schoolId}), so the Director,
 * Accountant and Accounts pages show the same figures from the same numbers.
 *
 *  - Debt = sum of the aging buckets (every unpaid bill, all terms). Same as Accounts > Debt Aging.
 *  - Collection rate = paid ÷ (billed − waivers) on the CURRENT academic year's bills (Accounts > Student
 *    Billing "All-Time Ledger" uses the same rule); older years' debt is still in the debt figures.
 */
export interface YearPerformance { year: string; billed: number; paid: number; waived: number; rate: number }

export function summaryGrossDebt(summary: any): number | null {
  const da = summary?.debtAging;
  if (da) {
    const sum = ['current', 'age30', 'age60', 'age90', 'over90'].reduce((t, k) => t + (Number(da[k]) || 0), 0);
    if (sum > 0) return Math.max(0, sum);
  }
  const t = summary?.financials?.totalOutstanding;
  return t === undefined || t === null ? null : Math.max(0, Number(t) || 0);
}

export function summaryCredits(summary: any): number {
  return Math.max(0, Number(summary?.debtAging?.overpayments ?? summary?.financials?.advancePayments ?? 0) || 0);
}

/** Collection performance for `year` (defaults to the year the server recorded as current). */
export function summaryYearPerformance(summary: any, year?: string | null): YearPerformance | null {
  const fin = summary?.financials;
  const y = String(year || fin?.currentAcademicYear || '');
  const row = y && fin?.yearBills ? fin.yearBills[y] : null;
  if (!row) return null;
  const billed = Number(row.billed) || 0;
  const paid = Number(row.paid) || 0;
  const waived = Number(row.waived) || 0;
  const collectible = billed - waived;
  const rate = collectible > 0 ? Math.min(100, Math.round((paid / collectible) * 1000) / 10) : 0;
  return { year: y, billed, paid, waived, rate };
}

/**
 * How much of the debt is filed under the current academic year, and how much under earlier years or
 * under no year at all ('unknown' — usually bills created before School Profile was set to the new year).
 * Null until the server has produced the split (after the next rebuild).
 */
export function summaryDebtSplit(summary: any, year?: string | null): { year: string; thisYear: number; earlier: number; unfiled: number; tuitionThisYear: number; tuitionOther: number } | null {
  const fin = summary?.financials;
  const by = fin?.debtByYear;
  if (!by || typeof by !== 'object') return null;
  const y = String(year || fin?.currentAcademicYear || '');
  let thisYear = 0, earlier = 0, unfiled = 0, tuitionThisYear = 0, tuitionOther = 0;
  Object.entries(by as Record<string, any>).forEach(([k, v]) => {
    const total = Number(v?.total) || 0;
    const tuition = Number(v?.tuition) || 0;
    if (k === y) { thisYear += total; tuitionThisYear += tuition; }
    else { if (k === 'unknown' || !k) unfiled += total; else earlier += total; tuitionOther += tuition; }
  });
  return { year: y, thisYear, earlier, unfiled, tuitionThisYear, tuitionOther };
}

/** Same student-matching rule everywhere: active (or no status), not archived, any of the student's ids. */
export function activeStudentKeySet(students: any[] | null | undefined): Set<string> {
  const set = new Set<string>();
  (students || []).forEach((s: any) => {
    if (!(s?.enrollmentStatus === 'Active' || !s?.enrollmentStatus) || s?.isArchived === true) return;
    [s.id, s.uid, s.studentId, s.admissionNo, s.admissionNumber].forEach((k: any) => { if (k) set.add(String(k)); });
  });
  return set;
}

const toMs = (v: any): number => {
  if (!v) return 0;
  if (typeof v?.toMillis === 'function') return v.toMillis();
  if (typeof v?.toDate === 'function') return v.toDate().getTime();
  if (typeof v?.seconds === 'number') return v.seconds * 1000;
  const t = new Date(v).getTime();
  return isNaN(t) ? 0 : t;
};

/** Aging bucket of an unpaid bill: by due date (else bill date / creation date); no date = not yet due. */
export function agingBucketOf(r: any, now: Date = new Date()): 'current' | 'age30' | 'age60' | 'age90' {
  const due = toMs(r?.dueDate) || toMs(r?.date) || toMs(r?.createdAt);
  if (!due) return 'current';
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const d = new Date(due); d.setHours(0, 0, 0, 0);
  const days = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (days <= 0) return 'current';
  if (days <= 30) return 'age30';
  if (days <= 60) return 'age60';
  return 'age90';
}

export function feeCategoryOf(r: any): 'Tuition' | 'Canteen' | 'Transport' | 'PTA Levy' | 'Other' {
  const t = String(r?.type || '').toLowerCase();
  if (t.includes('tuition')) return 'Tuition';
  if (t.includes('canteen')) return 'Canteen';
  if (t.includes('transport')) return 'Transport';
  if (t.includes('pta')) return 'PTA Levy';
  return 'Other';
}

export interface LedgerFigures {
  gross: number; credits: number; net: number;
  streams: { tuition: number; canteen: number; transport: number; other: number };
  aging: { current: number; age30: number; age60: number; age90: number };
  performance: { billed: number; paid: number; waived: number; rate: number };
  categories: { name: string; billed: number; paid: number; waived: number; outstanding: number; rate: number }[];
  earlierYearsDebt: number;
}

/**
 * The figures Accounts > Student Billing ("All-Time Ledger") shows, from a full list of bills.
 * `yearOf` returns a bill's academic year ("2026-2027"); `currentYear` selects the bills the collection
 * rate is measured on.
 */
export function computeLedgerFigures(records: any[], students: any[] | null | undefined, currentYear: string, yearOf: (r: any) => string): LedgerFigures {
  const keys = activeStudentKeySet(students);
  const cats: Record<string, { billed: number; paid: number; waived: number; owed: number }> = {};
  ['Tuition', 'Canteen', 'Transport', 'PTA Levy', 'Other'].forEach(n => { cats[n] = { billed: 0, paid: 0, waived: 0, owed: 0 }; });
  const f: LedgerFigures = {
    gross: 0, credits: 0, net: 0,
    streams: { tuition: 0, canteen: 0, transport: 0, other: 0 },
    aging: { current: 0, age30: 0, age60: 0, age90: 0 },
    performance: { billed: 0, paid: 0, waived: 0, rate: 0 },
    categories: [], earlierYearsDebt: 0,
  };
  const now = new Date();
  (records || []).forEach(r => {
    if (!r || r.isArchived === true || r.status === 'Pending Reversal') return;
    if (keys.size > 0 && r.studentId && !keys.has(String(r.studentId))) return;
    const billed = Number(r.billedAmount) || 0;
    const paid = Number(r.amountPaid) || 0;
    const waived = Number(r.waiverAmount) || 0;
    const bal = billed - paid - waived;
    const cat = feeCategoryOf(r);
    const inYear = !currentYear || yearOf(r) === currentYear;
    if (inYear) {
      f.performance.billed += billed; f.performance.paid += paid; f.performance.waived += waived;
      cats[cat].billed += billed; cats[cat].paid += paid; cats[cat].waived += waived;
    }
    if (bal > 0.01) {
      f.gross += bal;
      cats[cat].owed += bal;
      if (cat === 'Tuition') f.streams.tuition += bal;
      else if (cat === 'Canteen') f.streams.canteen += bal;
      else if (cat === 'Transport') f.streams.transport += bal;
      else f.streams.other += bal;
      f.aging[agingBucketOf(r, now)] += bal;
      if (!inYear) f.earlierYearsDebt += bal;
    } else if (bal < -0.01) {
      f.credits += -bal;
    }
  });
  f.net = Math.max(0, f.gross - f.credits);
  const c = f.performance.billed - f.performance.waived;
  f.performance.rate = c > 0 ? Math.min(100, (f.performance.paid / c) * 100) : (f.gross > 0.01 ? 0 : 100);
  f.categories = Object.entries(cats).map(([name, v]) => {
    const nb = v.billed - v.waived;
    return { name, billed: v.billed, paid: v.paid, waived: v.waived, outstanding: v.owed, rate: nb > 0 ? Math.min(100, (v.paid / nb) * 100) : (v.owed > 0.01 ? 0 : 100) };
  });
  return f;
}
