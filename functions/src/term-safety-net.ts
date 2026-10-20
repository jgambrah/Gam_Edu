import { onSchedule } from 'firebase-functions/v2/scheduler';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { reconcileCorrectedTerm } from './financial-rollover';
import { currentTermFromProfile, nextTermStamp, stampFromTermId } from './term-utils';
import { recalculateSchoolFinancials, refreshOpenDebts } from './dashboard-aggregators';
import { relockAcademicTerm } from './academic-rollover';

if (!getApps().length) initializeApp();
const db = getFirestore();

/**
 * enforceTermRolloverSafetyNet
 *
 * Daily Cloud Scheduler task (runs at 00:00 UTC) implementing:
 * 1. Term-rollover REMINDERS after the term end date (Day 0, +7, +14, +21 and weekly after).
 *    The rollover itself is never automatic: an administrator runs it from Finance Settings
 *    (dry run first, then confirm).
 * 2. Automated Re-Lock & Re-Summarization when 24h correction unlock windows expire.
 */
export const enforceTermRolloverSafetyNet = onSchedule({ schedule: '0 0 * * *', timeoutSeconds: 540, memory: '1GiB' }, async () => {
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
          // New month: the month's collections start again (the weekly full rebuild no longer does this daily).
          ...(new Date().getUTCDate() === 1 ? { 'financials.totalCollectedThisMonth': 0 } : {}),
          'attendance.totalPresent': 0,
          'attendance.totalAbsent': 0,
          'attendance.totalLate': 0,
          'attendance.attendanceRate': 0,
          'staff.presentToday': 0,
          'staff.lateToday': 0,
          'staff.absentToday': 0,
          lastDailyMidnightResetAt: FieldValue.serverTimestamp(),
        });
      });
      await batch.commit();
      console.log(`[MIDNIGHT RESET] Successfully reset daily collections and attendance across ${summariesSnap.size} school summaries.`);
    }
  } catch (resetErr) {
    console.error('[MIDNIGHT RESET] Error resetting daily summaries at midnight:', resetErr);
  }

  const schoolsSnap = await db.collection('schoolSettings').get();

  for (const schoolDoc of schoolsSnap.docs) {
    const s = schoolDoc.data();
    const schoolId = schoolDoc.id;
    const currentTerm = currentTermFromProfile(s);
    const currentTermId = currentTerm?.termId || '';
    const vacationDateVal = s.termEndDate || s.vacationDate;

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
        const expiresMs = expiresVal?.toMillis?.() ?? (expiresVal ? new Date(expiresVal).getTime() : 0);

        if (expiresMs > 0 && todayMs >= expiresMs) {
          console.log(`[TERM RE-LOCK] Correction window expired for school ${schoolId}, term ${unlockedTermId}. Re-locking & re-summarizing...`);

          // 1-2. Re-archive the term's academic records and refresh attendance summaries / frozen report cards
          //      (only if the term had been academically closed).
          await relockAcademicTerm(schoolId, unlockedTermId, 'Auto re-lock');

          // 3. Post any balance change made during the correction window into the CURRENT term as an
          //    adjustment, and re-archive the corrected bills. (Never re-runs the rollover, which would
          //    sweep the current term's bills.)
          if (stampFromTermId(unlockedTermId)) {
            await reconcileCorrectedTerm(schoolId, unlockedTermId, 'Auto re-lock');
          }

          // 4. Update term metadata to re-locked status
          await tDoc.ref.set({
            isArchived: true,
            isUnlockedForCorrection: false,
            relockedAt: FieldValue.serverTimestamp(),
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
            relockedAt: FieldValue.serverTimestamp(),
            reason: 'Correction window expired (auto re-locked & re-summarized)',
          });
        }
      }
    } catch (unlockedErr) {
      console.warn(`[TERM RE-LOCK CHECK WARNING] Error processing unlocked terms for school ${schoolId}:`, unlockedErr);
    }

    // ── CHECK 2: ROLLOVER REMINDERS (no automatic rollover) ──
    if (!vacationDateVal || !currentTerm) continue;

    let vacationMs = 0;
    if (typeof vacationDateVal.toMillis === 'function') {
      vacationMs = vacationDateVal.toMillis();
    } else {
      vacationMs = new Date(vacationDateVal).getTime();
    }

    if (isNaN(vacationMs) || vacationMs > todayMs) continue; // Term hasn't ended yet

    // Already closed? The rollover records the closed term id and moves the profile to the next term.
    const alreadyRolledOver =
      (Array.isArray(s.rolledOverTermIds) && s.rolledOverTermIds.includes(currentTermId)) ||
      s.lastRolledOverTermId === currentTermId;
    if (alreadyRolledOver) continue;

    const daysSinceVacation = Math.floor((todayMs - vacationMs) / (1000 * 60 * 60 * 24));
    const isReminderDay = daysSinceVacation === 0 || daysSinceVacation === 7 || daysSinceVacation === 14 ||
      (daysSinceVacation >= 21 && (daysSinceVacation - 21) % 7 === 0);
    if (!isReminderDay) continue;

    const next = nextTermStamp(currentTerm);
    const notifId = `rollover_reminder_${schoolId}_${currentTermId}_day${daysSinceVacation}`;
    await db.collection('notifications').doc(notifId).set({
      id: notifId,
      schoolId,
      type: 'rollover_reminder',
      title: daysSinceVacation >= 21 ? 'Term rollover overdue' : 'Term rollover reminder',
      message: `${currentTerm.term} ${currentTerm.academicYear} ended ${daysSinceVacation} day(s) ago. ` +
        `Go to Finance Settings → End of Term, review the dry run, then close the term to carry balances into ${next.term} ${next.academicYear}. ` +
        `Nothing is rolled over automatically.`,
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  }

  // ── NIGHTLY FINANCIAL SUMMARY UPKEEP (read-cost aware) ──
  // Live figures are kept current by the triggers (no reads). Each night only UNPAID bills are read to
  // re-bucket debt aging as bills get older (refreshOpenDebts). The FULL rebuild — every open bill and every
  // payment — runs once a week (Sunday) to remove any drift, or whenever the light refresh cannot run.
  const isFullRebuildDay = new Date().getUTCDay() === 0;
  for (const schoolDoc of schoolsSnap.docs) {
    try {
      if (isFullRebuildDay) {
        await recalculateSchoolFinancials(schoolDoc.id);
      } else {
        try {
          await refreshOpenDebts(schoolDoc.id);
        } catch (lightErr: any) {
          console.warn(`[NIGHTLY REFRESH] Light refresh not possible for ${schoolDoc.id} (${lightErr?.message}); running full rebuild.`);
          await recalculateSchoolFinancials(schoolDoc.id);
        }
      }
    } catch (rebuildErr) {
      console.error(`[NIGHTLY REBUILD] Failed for school ${schoolDoc.id}:`, rebuildErr);
    }
  }
});
