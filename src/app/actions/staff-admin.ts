'use server';
/**
 * Removing a staff member properly (server side).
 *
 * Before, "Delete" only removed the staff/{uid} document. The person could still sign in, and their
 * users/{uid} record still said "Director"/"Teacher" — which the security rules and server actions also
 * trust — so a removed staff member kept their access.
 *
 * This action (callable only by a Director/Administrator of the SAME school):
 *   1. disables the sign-in account and signs it out everywhere;
 *   2. marks users/{uid} as "Former Staff" (keeping the old role/school for the record);
 *   3. removes staff/{uid}.
 */
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminDb } from '@/lib/firebaseAdmin';
import { sanitizeErrorMessage } from '@/lib/error-handler';

const ADMIN_ROLES = ['Director', 'Administrator', 'Admin', 'director', 'administrator', 'admin'];
const PLATFORM_ADMINS = new Set(['L4oE5XWweKRYrhtIXn6hB8IDHBC2', 'gZxe3nMbGcQhNgEzkwEZwDBnkFR2']);

export async function deactivateStaffAccount(uid: string, idToken?: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!uid) throw new Error('Missing staff member.');
    if (!idToken) throw new Error('Authentication token required.');
    const auth = getAdminAuth();
    const db = getAdminDb();
    const caller = await auth.verifyIdToken(idToken);
    if (caller.uid === uid) throw new Error('You cannot remove your own account.');
    if (PLATFORM_ADMINS.has(uid)) throw new Error('This account cannot be removed here.');

    const [callerUser, callerStaff, targetStaff, targetUser] = await Promise.all([
      db.collection('users').doc(caller.uid).get(),
      db.collection('staff').doc(caller.uid).get(),
      db.collection('staff').doc(uid).get(),
      db.collection('users').doc(uid).get(),
    ]);
    const callerData: any = { ...(callerUser.data() || {}), ...(callerStaff.data() || {}) };
    const callerSchool = String(callerData.schoolId || '');
    const isPlatformAdmin = PLATFORM_ADMINS.has(caller.uid);
    if (!isPlatformAdmin && !ADMIN_ROLES.includes(String(callerData.role || ''))) {
      throw new Error('Only a Director or Administrator can remove staff.');
    }
    const target: any = targetStaff.exists ? targetStaff.data() : (targetUser.data() || {});
    const targetSchool = String(target?.schoolId || '');
    if (!isPlatformAdmin && (!callerSchool || targetSchool !== callerSchool)) {
      throw new Error('You can only remove staff of your own school.');
    }

    // 1. Sign-in disabled and existing sessions ended (ignore if the auth account no longer exists).
    try {
      await auth.updateUser(uid, { disabled: true });
      await auth.revokeRefreshTokens(uid);
    } catch (e: any) {
      if (e?.code !== 'auth/user-not-found') throw e;
    }

    // 2 + 3. Access records.
    const batch = db.batch();
    batch.set(db.collection('users').doc(uid), {
      role: 'Former Staff',
      formerRole: target?.role || targetUser.data()?.role || null,
      formerSchoolId: targetSchool || null,
      schoolId: FieldValue.delete(),
      deactivatedAt: FieldValue.serverTimestamp(),
      deactivatedBy: caller.uid,
    }, { merge: true });
    if (targetStaff.exists) batch.delete(db.collection('staff').doc(uid));
    await batch.commit();

    return { success: true };
  } catch (error: any) {
    return { success: false, error: sanitizeErrorMessage(error) };
  }
}
