/**
 * Premium subscription periods — one place for the numbers and the date rules, so the payment webhook, the
 * access lock, the "expires in N days" banner and Super Admin can never disagree.
 *
 *  GHS 3,000 (annual) buys 365 days; GHS 300 (monthly) buys 31 days; amounts add up (e.g. 3,300 = 1 year + 1 month).
 */
export const MONTHLY_FEE = 300;
export const ANNUAL_FEE = 3000;
export const MONTH_DAYS = 31;
export const YEAR_DAYS = 365;
export const GRACE_DAYS = 7;
const DAY = 24 * 60 * 60 * 1000;

/** Days of Premium that a payment of `paid` GHS buys (0 when it is below one month's fee). */
export function daysForPayment(paid: number): number {
  const amount = Number(paid) || 0;
  if (amount < MONTHLY_FEE) return 0;
  return amount >= ANNUAL_FEE
    ? YEAR_DAYS * Math.floor(amount / ANNUAL_FEE) + MONTH_DAYS * Math.floor((amount % ANNUAL_FEE) / MONTHLY_FEE)
    : MONTH_DAYS * Math.floor(amount / MONTHLY_FEE);
}

const toDate = (v: any): Date | null => {
  if (!v) return null;
  if (typeof v.toDate === 'function') { const d = v.toDate(); return d instanceof Date && !isNaN(d.getTime()) ? d : null; }
  if (typeof v.seconds === 'number') return new Date(v.seconds * 1000);
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
};

/**
 * What the school's last recorded payment covers on its own: last payment date + the days that amount buys.
 * null when the school has no recorded payment amount/date.
 */
export function paymentCoversUntil(school: any): Date | null {
  const paidAt = toDate(school?.lastPaymentDate);
  const days = daysForPayment(Number(school?.lastPaymentAmount));
  if (!paidAt || days <= 0) return null;
  return new Date(paidAt.getTime() + days * DAY);
}

/**
 * The date a Premium school is paid up to.
 *
 * Normally just `paidUntil`. Safety net: when the recorded last payment covers MORE than `paidUntil` says (e.g. a
 * GHS 3,000 annual payment that was stored as a one-month period), the later date wins, so a school that paid for a
 * year is never told its plan ends in 2 days. It never shortens anything, and it is skipped when Super Admin set the
 * date by hand (`paidUntilManual`).
 */
export function effectivePaidUntil(school: any): Date | null {
  const stored = toDate(school?.paidUntil);
  if (school?.paidUntilManual === true) return stored;
  const covered = paymentCoversUntil(school);
  if (!stored) return null; // no paid-up date at all: callers treat that as "not tracked" (unchanged behaviour)
  return covered && covered.getTime() > stored.getTime() ? covered : stored;
}

/** Whole days from `now` until `date` (rounded up; <= 0 once it has passed). */
export const daysUntil = (date: Date, now: number = Date.now()): number => Math.ceil((date.getTime() - now) / DAY);
