"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceTermRolloverSafetyNet = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const financial_rollover_1 = require("./financial-rollover");
const dashboard_aggregators_1 = require("./dashboard-aggregators");
if (!(0, app_1.getApps)().length)
    (0, app_1.initializeApp)();
const db = (0, firestore_1.getFirestore)();
/**
 * enforceTermRolloverSafetyNet
 *
 * Daily Cloud Scheduler task (runs at 00:00 UTC) implementing:
 * 1. 21-Day Safety Net for term rollovers.
 * 2. Automated Re-Lock & Re-Summarization when 24h correction unlock windows expire.
 */
exports.enforceTermRolloverSafetyNet = (0, scheduler_1.onSchedule)('0 0 * * *', async () => {
    var _a, _b;
    const now = new Date();
    const todayMs = now.getTime();
    // ── RESET DAILY DASHBOARD SUMMARIES COLLECTIONS AT MIDNIGHT (00:00 CUT-OFF) ──
    try {
        const summariesSnap = await db.collection('dashboard_summaries').get();
        if (!summariesSnap.empty) {
            const batch = db.batch();
            summariesSnap.forEach(docSnap => {
                batch.update(docSnap.ref, {
                    'financials.totalCollectedToday': 0,
                    'attendance.totalPresent': 0,
                    'attendance.totalAbsent': 0,
                    'attendance.totalLate': 0,
                    'attendance.attendanceRate': 0,
                    'staff.presentToday': 0,
                    'staff.lateToday': 0,
                    'staff.absentToday': 0,
                    lastDailyMidnightResetAt: firestore_1.FieldValue.serverTimestamp(),
                });
            });
            await batch.commit();
            console.log(`[MIDNIGHT RESET] Successfully reset daily collections and attendance across ${summariesSnap.size} school summaries.`);
        }
    }
    catch (resetErr) {
        console.error('[MIDNIGHT RESET] Error resetting daily summaries at midnight:', resetErr);
    }
    const schoolsSnap = await db.collection('schoolSettings').get();
    for (const schoolDoc of schoolsSnap.docs) {
        const s = schoolDoc.data();
        const schoolId = schoolDoc.id;
        const currentTermId = s.currentTermId || s.termId;
        const nextTermId = s.nextTermId || `${currentTermId}-next`;
        const vacationDateVal = s.vacationDate || s.termEndDate;
        // ── CHECK 1: EXPIRED UNLOCKED TERMS (Automated Re-Lock & Re-Summarization) ──
        try {
            const unlockedTermsSnap = await db.collection('schoolSettings').doc(schoolId)
                .collection('terms')
                .where('isUnlockedForCorrection', '==', true)
                .get();
            for (const tDoc of unlockedTermsSnap.docs) {
                const termData = tDoc.data();
                const unlockedTermId = tDoc.id;
                const expiresVal = termData.unlockExpiresAt;
                const expiresMs = (_b = (_a = expiresVal === null || expiresVal === void 0 ? void 0 : expiresVal.toMillis) === null || _a === void 0 ? void 0 : _a.call(expiresVal)) !== null && _b !== void 0 ? _b : (expiresVal ? new Date(expiresVal).getTime() : 0);
                if (expiresMs > 0 && todayMs >= expiresMs) {
                    console.log(`[TERM RE-LOCK] Correction window expired for school ${schoolId}, term ${unlockedTermId}. Re-locking & re-summarizing...`);
                    // 1. Re-run attendance summarization
                    await (0, dashboard_aggregators_1.summarizeTermAttendance)(schoolId, unlockedTermId);
                    // 2. Re-run academic report card locking
                    await (0, dashboard_aggregators_1.lockTermReportCards)(schoolId, unlockedTermId);
                    // 3. Re-run financial rollover to update itemized arrears deterministically
                    await (0, financial_rollover_1.executeTermFinancialRollover)(schoolId, unlockedTermId, nextTermId);
                    // 4. Update term metadata to re-locked status
                    await tDoc.ref.set({
                        isArchived: true,
                        isUnlockedForCorrection: false,
                        relockedAt: firestore_1.FieldValue.serverTimestamp(),
                    }, { merge: true });
                    if (s.activeUnlockedTermId === unlockedTermId) {
                        await db.collection('schoolSettings').doc(schoolId).set({
                            isTermCorrectionActive: false,
                            activeUnlockedTermId: null,
                        }, { merge: true });
                    }
                    // Audit log for automated re-lock
                    await db.collection('auditLogs').add({
                        action: 'TERM_AUTOMATED_RELOCK',
                        schoolId,
                        termId: unlockedTermId,
                        relockedAt: firestore_1.FieldValue.serverTimestamp(),
                        reason: 'Correction window expired (auto re-locked & re-summarized)',
                    });
                }
            }
        }
        catch (unlockedErr) {
            console.warn(`[TERM RE-LOCK CHECK WARNING] Error processing unlocked terms for school ${schoolId}:`, unlockedErr);
        }
        // ── CHECK 2: 21-DAY AUTO-SAFETY NET ROLLOVER ──
        if (!vacationDateVal || !currentTermId)
            continue;
        let vacationMs = 0;
        if (typeof vacationDateVal.toMillis === 'function') {
            vacationMs = vacationDateVal.toMillis();
        }
        else {
            vacationMs = new Date(vacationDateVal).getTime();
        }
        if (isNaN(vacationMs) || vacationMs > todayMs)
            continue; // Vacation hasn't arrived yet
        const daysSinceVacation = Math.floor((todayMs - vacationMs) / (1000 * 60 * 60 * 24));
        // Day 0: Soft-scope active pointers to next term pointer if not already done
        if (daysSinceVacation >= 0 && !s.softScopedPointer) {
            await db.collection('schoolSettings').doc(schoolId).set({
                softScopedPointer: true,
                activeQueryTermId: nextTermId,
                updatedAt: firestore_1.FieldValue.serverTimestamp(),
            }, { merge: true });
        }
        // Day +7 & Day +14: In-app & email notification reminders
        if (daysSinceVacation === 7 || daysSinceVacation === 14) {
            const notifId = `rollover_reminder_${schoolId}_day${daysSinceVacation}`;
            await db.collection('notifications').doc(notifId).set({
                id: notifId,
                schoolId,
                type: 'rollover_reminder',
                title: `Term Rollover Reminder (Day +${daysSinceVacation})`,
                message: `Vacation date was ${daysSinceVacation} days ago. Please review and confirm your end-of-term financial rollover in Admin Settings. Automatic archiving will execute at Day +21.`,
                read: false,
                createdAt: firestore_1.FieldValue.serverTimestamp(),
            }, { merge: true });
        }
        // Day +21 (Hard Stop): Automated Cloud Function executes the final archiving script
        if (daysSinceVacation >= 21 && s.termStatus !== 'Archived') {
            try {
                console.log(`[SAFETY NET DAY +21] Executing automated financial rollover for school: ${schoolId}`);
                await (0, financial_rollover_1.executeTermFinancialRollover)(schoolId, currentTermId, nextTermId);
                await db.collection('notifications').doc(`rollover_auto_${schoolId}`).set({
                    id: `rollover_auto_${schoolId}`,
                    schoolId,
                    type: 'rollover_executed',
                    title: 'Automated 21-Day Term Rollover Completed',
                    message: 'The 21-day safety net executed end-of-term financial archiving and carried forward itemized student balances.',
                    read: false,
                    createdAt: firestore_1.FieldValue.serverTimestamp(),
                }, { merge: true });
            }
            catch (err) {
                console.error(`[SAFETY NET ERROR] Automated rollover failed for school ${schoolId}:`, err);
            }
        }
    }
});
//# sourceMappingURL=term-safety-net.js.map