/**
 * Billing pauses — the Director can suspend daily canteen and/or transport billing for a date range
 * (e.g. the kitchen is closed or the buses are off the road) while attendance is still taken normally.
 *
 * Stored in `schoolSettings/{schoolId}/rates/billingPause` (writable by the Director only, see firestore.rules):
 *   { pauses: BillingPause[] }
 *
 * Pure helpers only (no 'use client', no firebase imports) so the web app, server actions and the
 * Cloud Functions mirror (`functions/src/daily-billing.ts`) can share the exact same rules.
 * PARITY NOTICE: keep `isServicePausedOnDate` in sync with the copy in `functions/src/daily-billing.ts`.
 */

export type PausableService = 'canteen' | 'transport';

export interface BillingPause {
  id: string;
  /** Inclusive, YYYY-MM-DD (school calendar day). */
  fromDate: string;
  /** Inclusive, YYYY-MM-DD. Same as `fromDate` for a single day. */
  toDate: string;
  canteen: boolean;
  transport: boolean;
  reason: string;
  createdBy?: string;
  createdByName?: string;
}

export const BILLING_PAUSE_DOC_PATH = ['rates', 'billingPause'] as const;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Reads the `pauses` array from the stored document defensively (bad entries are dropped). */
export function parseBillingPauses(data: unknown): BillingPause[] {
  const raw = (data as { pauses?: unknown } | null | undefined)?.pauses;
  if (!Array.isArray(raw)) return [];
  const out: BillingPause[] = [];
  for (const p of raw) {
    if (!p || typeof p !== 'object') continue;
    const e = p as Record<string, unknown>;
    if (typeof e.fromDate !== 'string' || !DATE_RE.test(e.fromDate)) continue;
    if (typeof e.toDate !== 'string' || !DATE_RE.test(e.toDate)) continue;
    out.push({
      id: typeof e.id === 'string' ? e.id : `${e.fromDate}_${e.toDate}`,
      fromDate: e.fromDate,
      toDate: e.toDate,
      canteen: e.canteen !== false,
      transport: e.transport !== false,
      reason: typeof e.reason === 'string' ? e.reason : '',
      createdBy: typeof e.createdBy === 'string' ? e.createdBy : undefined,
      createdByName: typeof e.createdByName === 'string' ? e.createdByName : undefined,
    });
  }
  return out;
}

/** True when `service` must NOT be billed for the school day `dateStr` (YYYY-MM-DD). */
export function isServicePausedOnDate(
  pauses: BillingPause[] | null | undefined,
  dateStr: string,
  service: PausableService
): boolean {
  if (!pauses || pauses.length === 0 || !DATE_RE.test(dateStr)) return false;
  // YYYY-MM-DD strings compare correctly as plain strings.
  return pauses.some(p => p[service] && p.fromDate <= dateStr && dateStr <= p.toDate);
}

/** The pause (if any) that covers this date for at least one service — used for UI notices. */
export function findPauseForDate(
  pauses: BillingPause[] | null | undefined,
  dateStr: string
): BillingPause | undefined {
  if (!pauses || !DATE_RE.test(dateStr)) return undefined;
  return pauses.find(p => (p.canteen || p.transport) && p.fromDate <= dateStr && dateStr <= p.toDate);
}
