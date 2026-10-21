/**
 * SERVER ONLY. Temporary passwords waiting to be handed to their owner.
 *
 * pendingCredentials/{uid} = { schoolId, password, email, name, role, setAt, setBy }
 * - written when the school creates an account or resets a password;
 * - removed as soon as the person chooses their own password;
 * - readable only through app/actions/credentials.ts (Director/Administrator of the same school) — the
 *   security rules give no browser access to this collection.
 * So the school can give the login details to a parent or pupil whenever they turn up, without ever
 * seeing a password the person chose themselves.
 */
import type { Firestore } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase-admin/firestore';

export async function savePendingCredential(
    db: Firestore,
    data: { uid: string; schoolId: string; password: string; email?: string; name?: string; role?: string; setBy?: string }
): Promise<void> {
    if (!data.uid || !data.password) return;
    try {
        await db.collection('pendingCredentials').doc(data.uid).set({
            schoolId: data.schoolId || '',
            password: data.password,
            email: data.email || '',
            name: data.name || '',
            role: data.role || '',
            setBy: data.setBy || '',
            setAt: FieldValue.serverTimestamp(),
        });
    } catch (e) {
        console.warn('Could not store pending credential:', e);
    }
}

export async function clearPendingCredential(db: Firestore, uid: string): Promise<void> {
    if (!uid) return;
    try { await db.collection('pendingCredentials').doc(uid).delete(); } catch { /* nothing to clear */ }
}
