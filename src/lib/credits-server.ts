import { getAdminDb } from '@/lib/firebaseAdmin';

/**
 * Takes `cost` AI credits from a school, atomically. Server-only: callers must already have checked who
 * is asking (the `checkAndSpendCredits` server action does that via the session cookie; API routes check
 * a Bearer token). `aiCredits` is the balance; the older `aiCreditBalance` field is kept in step when present.
 */
export async function spendSchoolCredits(schoolId: string, cost: number): Promise<{ success: boolean; error?: string }> {
  if (!schoolId) return { success: false, error: 'School ID is required.' };
  if (!Number.isFinite(cost) || cost <= 0 || cost > 500) return { success: false, error: 'Invalid credit amount.' };

  try {
    const db = getAdminDb();
    const schoolRef = db.collection('schools').doc(schoolId);
    const ok = await db.runTransaction(async t => {
      const doc = await t.get(schoolRef);
      if (!doc.exists) throw new Error('School not found in the database.');
      const data: any = doc.data() || {};
      const current = Number(data.aiCredits ?? data.aiCreditBalance ?? 0);
      if (current < cost) return false;
      const update: Record<string, number> = { aiCredits: current - cost };
      if (data.aiCreditBalance !== undefined) update.aiCreditBalance = current - cost;
      t.update(schoolRef, update);
      return true;
    });
    return ok ? { success: true } : { success: false, error: 'Insufficient AI credits.' };
  } catch (error: any) {
    console.error('Credit transaction failed:', error);
    return { success: false, error: error?.message || 'An unexpected error occurred during the transaction.' };
  }
}


/**
 * Gives `amount` credits back to a school (server-only) — used when an AI job was charged but produced nothing.
 * Never call this from a client-reachable action without having charged the same school first.
 */
export async function refundSchoolCredits(schoolId: string, amount: number): Promise<void> {
  if (!schoolId || !Number.isFinite(amount) || amount <= 0 || amount > 500) return;
  try {
    const db = getAdminDb();
    const schoolRef = db.collection('schools').doc(schoolId);
    await db.runTransaction(async t => {
      const doc = await t.get(schoolRef);
      if (!doc.exists) return;
      const data: any = doc.data() || {};
      const current = Number(data.aiCredits ?? data.aiCreditBalance ?? 0);
      const update: Record<string, number> = { aiCredits: current + amount };
      if (data.aiCreditBalance !== undefined) update.aiCreditBalance = current + amount;
      t.update(schoolRef, update);
    });
  } catch (error: any) {
    console.error('Credit refund failed:', error?.message || error);
  }
}


// ---------------------------------------------------------------------------------------------------------
// Idempotent charging. Each paid action gets a key (same key = same job). The key's ledger entry lives in
// schools/{id}/credit_ledger/{key} and is written in the SAME transaction as the balance change, so:
//   • charging twice with one key spends once (a retry, double click or replayed request is free);
//   • a refund only happens for a charge that exists and has not been refunded, and only once;
//   • a refunded key can be charged again (a genuine, user-initiated redo) only by using a new key.
// Clients cannot touch the ledger (firestore.rules: write false; Admin SDK bypasses rules).
// ---------------------------------------------------------------------------------------------------------

/** charged = money taken, job running or unfinished · completed = job produced a result (final) · refunded = money returned. */
export type LedgerStatus = 'charged' | 'completed' | 'refunded';
export type ChargeResult = { success: boolean; error?: string; alreadyCharged?: boolean };

/** Ledger keys become Firestore document ids: keep them short and free of '/'. */
export function ledgerKey(parts: string[]): string | null {
  const key = parts.join('_');
  return /^[A-Za-z0-9_.:-]{1,200}$/.test(key) && key !== '.' && key !== '..' ? key.replace(/:/g, '_') : null;
}

export async function chargeCreditsOnce(
  schoolId: string, cost: number, key: string, meta: { uid?: string; reason?: string } = {},
): Promise<ChargeResult> {
  if (!schoolId) return { success: false, error: 'School ID is required.' };
  if (!Number.isFinite(cost) || cost <= 0 || cost > 500) return { success: false, error: 'Invalid credit amount.' };
  if (!ledgerKey([key])) return { success: false, error: 'Invalid request key.' };
  try {
    const db = getAdminDb();
    const schoolRef = db.collection('schools').doc(schoolId);
    const entryRef = schoolRef.collection('credit_ledger').doc(ledgerKey([key])!);
    return await db.runTransaction(async t => {
      const [school, entry] = await Promise.all([t.get(schoolRef), t.get(entryRef)]);
      if (!school.exists) throw new Error('School not found in the database.');
      const st = (entry.data() as any)?.status;
      if (entry.exists && (st === 'charged' || st === 'completed')) return { success: true, alreadyCharged: true };
      if (entry.exists) return { success: false, error: 'This request was already completed and refunded. Start a new one to try again.' };
      const data: any = school.data() || {};
      const current = Number(data.aiCredits ?? data.aiCreditBalance ?? 0);
      if (current < cost) return { success: false, error: 'Insufficient AI credits.' };
      const update: Record<string, number> = { aiCredits: current - cost };
      if (data.aiCreditBalance !== undefined) update.aiCreditBalance = current - cost;
      t.update(schoolRef, update);
      t.set(entryRef, { status: 'charged' as LedgerStatus, amount: cost, uid: meta.uid ?? null, reason: meta.reason ?? null, chargedAt: new Date() });
      return { success: true };
    });
  } catch (error: any) {
    console.error('Idempotent credit charge failed:', error);
    return { success: false, error: error?.message || 'An unexpected error occurred during the transaction.' };
  }
}

/** Marks a charged job as having produced a result. A completed charge is final: the automatic refund paths skip it. */
export async function markChargeCompleted(schoolId: string, key: string): Promise<void> {
  if (!schoolId || !ledgerKey([key])) return;
  try {
    const db = getAdminDb();
    const entryRef = db.collection('schools').doc(schoolId).collection('credit_ledger').doc(ledgerKey([key])!);
    await db.runTransaction(async t => {
      const entry = await t.get(entryRef);
      if (entry.exists && (entry.data() as any)?.status === 'charged') t.update(entryRef, { status: 'completed' as LedgerStatus, completedAt: new Date() });
    });
  } catch (error: any) {
    console.error('Marking credit charge completed failed:', error?.message || error); // harmless: the stale-charge sweep re-checks
  }
}

/**
 * Refunds a charge made with `chargeCreditsOnce` — at most once. Returns whether credits were returned.
 * By default only a still-`charged` entry is refunded (job failed). `includeCompleted` is for a deliberate,
 * audited manual refund of a result that never reached the user (see docs: lost-result recovery); never use it automatically.
 */
export async function refundChargeOnce(
  schoolId: string, key: string,
  opts: { includeCompleted?: boolean; reason?: 'job_failed' | 'stale_sweep' | 'manual'; by?: string } = {},
): Promise<boolean> {
  if (!schoolId || !ledgerKey([key])) return false;
  try {
    const db = getAdminDb();
    const schoolRef = db.collection('schools').doc(schoolId);
    const entryRef = schoolRef.collection('credit_ledger').doc(ledgerKey([key])!);
    return await db.runTransaction(async t => {
      const [school, entry] = await Promise.all([t.get(schoolRef), t.get(entryRef)]);
      if (!school.exists || !entry.exists) return false;
      const e: any = entry.data() || {};
      if (e.status !== 'charged' && !(opts.includeCompleted && e.status === 'completed')) return false;
      const data: any = school.data() || {};
      const current = Number(data.aiCredits ?? data.aiCreditBalance ?? 0);
      const update: Record<string, number> = { aiCredits: current + Number(e.amount) };
      if (data.aiCreditBalance !== undefined) update.aiCreditBalance = current + Number(e.amount);
      t.update(schoolRef, update);
      t.update(entryRef, { status: 'refunded' as LedgerStatus, refundedAt: new Date(), refundReason: opts.reason ?? 'job_failed', refundedBy: opts.by ?? 'system' });
      return true;
    });
  } catch (error: any) {
    console.error('Idempotent credit refund failed:', error?.message || error);
    return false;
  }
}


/**
 * Safety net for crashed jobs: refunds entries still `charged` (never completed) after `olderThanMs`
 * (e.g. the server died between charging and finishing). Safe to run repeatedly — refunds happen once per entry,
 * and completed jobs are never touched. Intended for a scheduled server job; nothing calls it yet.
 */
export async function refundStaleCharges(schoolId: string, olderThanMs = 15 * 60 * 1000): Promise<number> {
  if (!schoolId) return 0;
  const db = getAdminDb();
  const cutoff = new Date(Date.now() - olderThanMs);
  const snap = await db.collection('schools').doc(schoolId).collection('credit_ledger')
    .where('status', '==', 'charged').where('chargedAt', '<', cutoff).get();
  let refunded = 0;
  for (const d of snap.docs) if (await refundChargeOnce(schoolId, d.id, { reason: 'stale_sweep', by: 'stale-sweep' })) refunded++;
  return refunded;
}


export type SweepResult = { scanned: number; refunded: number; credits: number; dryRun: boolean; bySchool: Record<string, number> };

/**
 * Cross-school stale-charge sweep, for a scheduled server job (nothing schedules it yet).
 *  • dryRun (the default) only counts what WOULD be refunded.
 *  • Each refund is the same idempotent, once-only transaction as above and records why/by whom in the ledger entry.
 *  • `limit` bounds one run; run again to continue. Needs a collection-group index (firestore.indexes.json).
 * Returns aggregate numbers only.
 */
export async function sweepStaleCharges(opts: { olderThanMs?: number; limit?: number; dryRun?: boolean } = {}): Promise<SweepResult> {
  const dryRun = opts.dryRun !== false;
  const olderThanMs = Math.max(opts.olderThanMs ?? 15 * 60 * 1000, 5 * 60 * 1000); // never sweep jobs that may still be running
  const limit = Math.min(Math.max(opts.limit ?? 200, 1), 500);
  const db = getAdminDb();
  const snap = await db.collectionGroup('credit_ledger')
    .where('status', '==', 'charged').where('chargedAt', '<', new Date(Date.now() - olderThanMs)).limit(limit).get();
  const out: SweepResult = { scanned: snap.docs.length, refunded: 0, credits: 0, dryRun, bySchool: {} };
  for (const d of snap.docs) {
    const schoolId = d.ref.parent.parent?.id;
    if (!schoolId) continue;
    const amount = Number((d.data() as any).amount) || 0;
    if (dryRun) { out.bySchool[schoolId] = (out.bySchool[schoolId] ?? 0) + 1; continue; }
    if (await refundChargeOnce(schoolId, d.id, { reason: 'stale_sweep', by: 'stale-sweep' })) {
      out.refunded++; out.credits += amount; out.bySchool[schoolId] = (out.bySchool[schoolId] ?? 0) + 1;
    }
  }
  return out;
}
