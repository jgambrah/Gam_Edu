'use server';
/**
 * Looking up a temporary password again (for a parent/pupil/staff member who comes for it later), and
 * clearing it once the person has chosen their own password.
 */
import { getAdminAuth, getAdminDb } from '@/lib/firebaseAdmin';
import { clearPendingCredential } from '@/lib/pending-credentials';

const ADMIN_ROLES = ['Director', 'Administrator', 'Admin', 'director', 'administrator', 'admin'];
const PLATFORM_ADMINS = new Set(['L4oE5XWweKRYrhtIXn6hB8IDHBC2', 'gZxe3nMbGcQhNgEzkwEZwDBnkFR2']);

export type PendingCredentialView = { password: string; email: string; name: string; setAt: string | null };

/** Director/Administrator of the same school only. Returns null when the person has set their own password. */
export async function getPendingCredential(uid: string, idToken?: string): Promise<{ success: boolean; credential?: PendingCredentialView | null; error?: string }> {
    try {
        if (!uid || !idToken) throw new Error('Not signed in.');
        const auth = getAdminAuth();
        const db = getAdminDb();
        const caller = await auth.verifyIdToken(idToken);
        const [callerUser, callerStaff, pendingSnap, targetUser] = await Promise.all([
            db.collection('users').doc(caller.uid).get(),
            db.collection('staff').doc(caller.uid).get(),
            db.collection('pendingCredentials').doc(uid).get(),
            db.collection('users').doc(uid).get(),
        ]);
        const callerData: any = { ...(callerUser.data() || {}), ...(callerStaff.data() || {}) };
        const isPlatformAdmin = PLATFORM_ADMINS.has(caller.uid);
        if (!isPlatformAdmin && !ADMIN_ROLES.includes(String(callerData.role || ''))) {
            throw new Error('Only a Director or Administrator can view login details.');
        }
        const pending: any = pendingSnap.exists ? pendingSnap.data() : null;
        const targetSchool = String(pending?.schoolId || targetUser.data()?.schoolId || '');
        if (!isPlatformAdmin && (!callerData.schoolId || targetSchool !== String(callerData.schoolId))) {
            throw new Error('You can only view login details for your own school.');
        }
        if (!pending) return { success: true, credential: null };
        const ms = pending.setAt?.toMillis?.() ?? null;
        return {
            success: true,
            credential: { password: String(pending.password || ''), email: String(pending.email || ''), name: String(pending.name || ''), setAt: ms ? new Date(ms).toISOString() : null },
        };
    } catch (e: any) {
        return { success: false, error: e?.message || 'Could not load login details.' };
    }
}

/** Called after a person sets their own password: the temporary one is forgotten. */
export async function clearMyPendingCredential(idToken?: string): Promise<{ success: boolean }> {
    try {
        if (!idToken) return { success: false };
        const caller = await getAdminAuth().verifyIdToken(idToken);
        await clearPendingCredential(getAdminDb(), caller.uid);
        return { success: true };
    } catch {
        return { success: false };
    }
}
