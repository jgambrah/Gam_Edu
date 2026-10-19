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
