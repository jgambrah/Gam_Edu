"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestTermUnlock = requestTermUnlock;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
function getAdminDb() {
    const existingApps = (0, app_1.getApps)();
    const adminApp = existingApps.find(app => app.name === 'admin');
    if (adminApp)
        return (0, firestore_1.getFirestore)(adminApp);
    if (existingApps.length > 0)
        return (0, firestore_1.getFirestore)(existingApps[0]);
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
    if (projectId && clientEmail && privateKeyRaw) {
        const formattedKey = privateKeyRaw.replace(/\\n/g, '\n').replace(/"/g, '');
        const app = (0, app_1.initializeApp)({
            credential: (0, app_1.cert)({
                projectId,
                clientEmail,
                privateKey: formattedKey,
            }),
        }, 'admin');
        return (0, firestore_1.getFirestore)(app);
    }
    const defaultApp = (0, app_1.initializeApp)();
    return (0, firestore_1.getFirestore)(defaultApp);
}
/**
 * requestTermUnlock
 *
 * Temporarily unlocks an archived term for corrections (default 24h).
 * Un-archives raw term records, sets expiration timestamp, and logs an audit record.
 */
async function requestTermUnlock(params) {
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
        unlockedAt: firestore_1.FieldValue.serverTimestamp(),
        unlockExpiresAt: firestore_1.Timestamp.fromMillis(unlockExpiresAtMs),
        unlockReason: reason,
        unlockedBy: requestedBy,
    }, { merge: true });
    // Update top-level schoolSettings pointer state
    const schoolRef = db.collection('schoolSettings').doc(schoolId);
    batch.set(schoolRef, {
        activeUnlockedTermId: termId,
        isTermCorrectionActive: true,
        termUnlockExpiresAt: firestore_1.Timestamp.fromMillis(unlockExpiresAtMs),
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
        unlockedAt: firestore_1.FieldValue.serverTimestamp(),
        expiresAt: firestore_1.Timestamp.fromMillis(unlockExpiresAtMs),
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
            if (docTerm === termId ||
                docTerm.toLowerCase() === termId.toLowerCase() ||
                docTerm.toLowerCase().includes(termId.toLowerCase()) ||
                termId.toLowerCase().includes(docTerm.toLowerCase())) {
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
//# sourceMappingURL=term-management.js.map