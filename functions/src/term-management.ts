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
  updateRawRecords?: boolean;
}

/**
 * Helper to commit document updates in safe batches of max 400 operations.
 * Prevents Firestore's 500-write and 10MB transaction size limit.
 */
async function commitUpdatesInChunks(
  db: FirebaseFirestore.Firestore,
  updates: Array<{ ref: FirebaseFirestore.DocumentReference; data: Record<string, any> }>,
  chunkSize = 400
): Promise<number> {
  let committedCount = 0;
  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
    const batch = db.batch();
    for (const item of chunk) {
      batch.update(item.ref, item.data);
    }
    await batch.commit();
    committedCount += chunk.length;
  }
  return committedCount;
}

/**
 * requestTermUnlock
 *
 * Temporarily unlocks an archived term for corrections (default 24h).
 * Refactored to avoid single-transaction size limits:
 * 1. Atomically writes term status metadata (terms/{termId}.isArchived = false, unlockedUntil, audit log) in one small write.
 * 2. Does NOT execute unbounded transactions across raw grade/attendance documents.
 * 3. Client queries check parent term status / active unlock window instead of individual flags.
 * 4. If updateRawRecords is requested, processes in safe 400-doc batch chunks without failing the primary unlock.
 */
export async function requestTermUnlock(params: TermUnlockParams): Promise<{
  success: boolean;
  termId: string;
  unlockExpiresAt: Date;
  auditLogId: string;
  rawRecordsUpdated?: number;
}> {
  const { schoolId, termId, requestedDurationHours = 24, reason, requestedBy = 'Admin', updateRawRecords = false } = params;

  if (!schoolId || !termId || !reason) {
    throw new Error('Missing required params: schoolId, termId, and reason are required.');
  }

  const db = getAdminDb();
  const durationHours = Math.max(1, Math.min(requestedDurationHours, 72));
  const nowMs = Date.now();
  const unlockExpiresAtMs = nowMs + durationHours * 60 * 60 * 1000;
  const unlockExpiresAt = new Date(unlockExpiresAtMs);

  const batch = db.batch();

  // 1. Update term metadata status on schoolSettings/terms/{termId}
  const termRef = db.collection('schoolSettings').doc(schoolId).collection('terms').doc(termId);
  batch.set(termRef, {
    termId,
    schoolId,
    isArchived: false,
    isUnlockedForCorrection: true,
    unlockedAt: FieldValue.serverTimestamp(),
    unlockExpiresAt: Timestamp.fromMillis(unlockExpiresAtMs),
    unlockedUntil: Timestamp.fromMillis(unlockExpiresAtMs),
    unlockReason: reason,
    unlockedBy: requestedBy,
  }, { merge: true });

  // Update top-level schoolSettings pointer state
  const schoolRef = db.collection('schoolSettings').doc(schoolId);
  batch.set(schoolRef, {
    activeUnlockedTermId: termId,
    isTermCorrectionActive: true,
    termUnlockExpiresAt: Timestamp.fromMillis(unlockExpiresAtMs),
    unlockedUntil: Timestamp.fromMillis(unlockExpiresAtMs),
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

  // Commit the primary metadata & audit update in one small atomic write (3 operations total)
  await batch.commit();

  let rawRecordsUpdated = 0;

  // 3. Optional chunked background mutation across raw records if explicitly requested
  if (updateRawRecords) {
    try {
      const collectionsToUnlock = ['attendance', 'assessments', 'report-cards', 'financialRecords'];
      const docUpdates: Array<{ ref: FirebaseFirestore.DocumentReference; data: Record<string, any> }> = [];

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
            docUpdates.push({
              ref: docSnap.ref,
              data: { isArchived: false, unlockedForCorrection: true }
            });
          }
        });
      }

      if (docUpdates.length > 0) {
        rawRecordsUpdated = await commitUpdatesInChunks(db, docUpdates, 400);
      }
    } catch (chunkErr) {
      console.warn(`[WARN] Chunked raw record update completed with partial warnings:`, chunkErr);
    }
  }

  return {
    success: true,
    termId,
    unlockExpiresAt,
    auditLogId,
    rawRecordsUpdated,
  };
}
