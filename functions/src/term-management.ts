import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';

if (!getApps().length) initializeApp();
const db = getFirestore();

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
      .where('termId', '==', termId)
      .get();

    snap.forEach(docSnap => {
      batch.update(docSnap.ref, { isArchived: false, unlockedForCorrection: true });
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
