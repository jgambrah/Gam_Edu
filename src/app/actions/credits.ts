'use server';

import { spendSchoolCredits, chargeCreditsOnce, ledgerKey } from '@/lib/credits-server';
import { requireSchoolMember, SessionError } from '@/lib/session-guard';

/**
 * Atomically checks if a school has enough credits and spends them.
 *
 * This is a server action, i.e. a public endpoint. It only spends credits for a signed-in member of
 * `schoolId` (staff, student or parent of that school, or a platform super admin), and only positive,
 * sensible amounts — before, anyone could drain (or, with a negative cost, top up) any school's credits.
 *
 * @param schoolId The ID of the school document.
 * @param cost The number of credits to spend.
 * @returns An object indicating success or failure.
 */
export async function checkAndSpendCredits(schoolId: string, cost: number): Promise<{ success: boolean; error?: string }> {
  if (!schoolId) {
    return { success: false, error: 'School ID is required.' };
  }
  const amount = Number(cost);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 500) {
    return { success: false, error: 'Invalid credit amount.' };
  }
  try {
    await requireSchoolMember(schoolId);
  } catch (e: any) {
    if (e instanceof SessionError) return { success: false, error: e.message };
    console.error('Credit authorization failed:', e);
    return { success: false, error: 'Could not verify your account. Please refresh the page and try again.' };
  }
  return spendSchoolCredits(schoolId, amount);
}


/**
 * Like checkAndSpendCredits, but safe to retry: the same `requestId` (made once per user action in the browser)
 * only ever charges once. Returns the ledger `key` so the SERVER flow that was charged can refund it if the AI
 * produces nothing. There is deliberately no client-callable refund: a refund is only issued by server code
 * that has just seen its own AI call fail.
 */
export async function chargeCreditsIdempotent(
  schoolId: string, cost: number, requestId: string | undefined, step: string,
): Promise<{ success: boolean; error?: string; key?: string; uid?: string; alreadyCharged?: boolean }> {
  if (!requestId) return { ...(await checkAndSpendCredits(schoolId, cost)), key: undefined };
  const amount = Number(cost);
  if (!schoolId) return { success: false, error: 'School ID is required.' };
  if (!Number.isFinite(amount) || amount <= 0 || amount > 500) return { success: false, error: 'Invalid credit amount.' };
  let uid: string;
  try {
    uid = (await requireSchoolMember(schoolId)).uid;
  } catch (e: any) {
    if (e instanceof SessionError) return { success: false, error: e.message };
    console.error('Credit authorization failed:', e);
    return { success: false, error: 'Could not verify your account. Please refresh the page and try again.' };
  }
  const key = ledgerKey([uid, requestId, step]);
  if (!key) return { success: false, error: 'Invalid request key.' };
  const res = await chargeCreditsOnce(schoolId, amount, key, { uid, reason: step });
  // A key that was already charged must not run the AI job a second time for free (that would let a replayed
  // request mint unlimited generations). The caller reports it and the user starts a fresh request.
  if (res.alreadyCharged) return { success: false, alreadyCharged: true, error: 'This request was already processed. Please start it again.' };
  return { ...res, key, uid };
}
