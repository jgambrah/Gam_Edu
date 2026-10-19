'use server';

import { spendSchoolCredits } from '@/lib/credits-server';
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
