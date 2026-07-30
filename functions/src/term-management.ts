import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

function getAdminDb() {
  const existingApps = getApps();
  const adminApp = existingApps.find(app => app.name === 'admin');
  if (adminApp) return getFirestore(adminApp);
  if (existingApps.length > 0) return getFirestore(existingApps[0]);

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKeyRaw) {
    const formattedKey = privateKeyRaw.replace(/\\n/g, '\n').replace(/"/g, '');
    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: formattedKey,
      }),
    }, 'admin');
    return getFirestore(app);
  }

  const defaultApp = initializeApp();
  return getFirestore(defaultApp);
}

export interface TermUnlockParams {
  schoolId: string;
  termId: string;
  requestedDurationHours?: number;
  reason: string;
  requestedBy?: string;
}

/**
 * requestTermUnlock
 *
 * Temporarily unlocks an archived term for corrections (default 24h).
 * Un-archives raw term records, sets expiration timestamp, and logs an audit record.
 */
export async function requestTermUnlock(params: TermUnlockParams): Promise<{
  success: boolean;
  termId: string;
  unlockExpiresAt: Date;
  auditLogId: string;
}> {
  const { schoolId, termId, requestedDurationHours = 24, reason, requestedBy = 'Admin' } = params;

  if (!schoolId || !termId || !reason) {
    throw new Error('Missing required params: schoolId, termId, and reason are required.');
  }

  const db = getAdminDb();
  const durationHours = Math.max(1, Math.min(requestedDurationHours, 72));
  const nowMs = Date.now();
  const unlockExpiresAtMs = nowMs + durationHours * 60 * 60 * 1000;
  const unlockExpiresAt = new Date(unlockExpiresAtMs);

  const batch = db.batch();

  // 1. Update term metadata status on schoolSettings
  const termRef = db.collection('schoolSettings').doc(schoolId).collection('terms').doc(termId);
  batch.set(termRef, {
    termId,
    schoolId,
    isArchived: false,
    isUnlockedForCorrection: true,
    unlockedAt: FieldValue.serverTimestamp(),
    unlockExpiresAt: Timestamp.fromMillis(unlockExpiresAtMs),
    unlockReason: reason,
    unlockedBy: requestedBy,
  }, { merge: true });

  // Update top-level schoolSettings pointer state
  const schoolRef = db.collection('schoolSettings').doc(schoolId);
  batch.set(schoolRef, {
    activeUnlockedTermId: termId,
    isTermCorrectionActive: true,
    termUnlockExpiresAt: Timestamp.fromMillis(unlockExpiresAtMs),
  }, { merge: true });

  // 2. Write structured audit log entry
  const auditLogId = `audit_unlock_${schoolId}_${termId}_${nowMs}`;
  const auditRef = db.collection('auditLogs').doc(auditLogId);
  batch.set(auditRef, {
    id: auditLogId,
    action: 'TERM_UNLOCK_FOR_CORRECTION',
    schoolId,
    termId,
    reason,
    requestedBy,
    durationHours,
    unlockedAt: FieldValue.serverTimestamp(),
    expiresAt: Timestamp.fromMillis(unlockExpiresAtMs),
  }, { merge: true });

  // 3. Mark raw documents for this term as temporarily un-archived
  const collectionsToUnlock = ['attendance', 'assessments', 'report-cards', 'financialRecords'];
  for (const colName of collectionsToUnlock) {
    const snap = await db.collection(colName)
      .where('schoolId', '==', schoolId)
      .get();

    snap.forEach(docSnap => {
      const data = docSnap.data();
      const docTerm = data.termId || data.term || '';
      if (
        docTerm === termId ||
        docTerm.toLowerCase() === termId.toLowerCase() ||
        docTerm.toLowerCase().includes(termId.toLowerCase()) ||
        termId.toLowerCase().includes(docTerm.toLowerCase())
      ) {
        batch.update(docSnap.ref, { isArchived: false, unlockedForCorrection: true });
      }
    });
  }

  await batch.commit();

  return {
    success: true,
    termId,
    unlockExpiresAt,
    auditLogId,
  };
}
