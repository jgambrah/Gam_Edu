import { onSchedule } from 'firebase-functions/v2/scheduler';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { executeTermFinancialRollover } from './financial-rollover';

if (!getApps().length) initializeApp();
const db = getFirestore();

/**
 * enforceTermRolloverSafetyNet
 *
 * Daily Cloud Scheduler task (runs at 00:00 UTC) implementing the 21-Day Safety Net:
 * - Day 0 (Vacation Date): Soft-scopes active query pointers to nextTermId.
 * - Day +7 & Day +14: Sends in-app reminder alerts to School Admins.
 * - Day +21 (Hard Stop): Automatically executes term financial rollover & archiving.
 */
export const enforceTermRolloverSafetyNet = onSchedule('0 0 * * *', async () => {
  const now = new Date();
  const todayMs = now.getTime();

  const schoolsSnap = await db.collection('schoolSettings').get();

  for (const schoolDoc of schoolsSnap.docs) {
    const s = schoolDoc.data();
    const schoolId = schoolDoc.id;
    const currentTermId = s.currentTermId || s.termId;
    const nextTermId = s.nextTermId || `${currentTermId}-next`;
    const vacationDateVal = s.vacationDate || s.termEndDate;

    if (!vacationDateVal || !currentTermId) continue;

    let vacationMs = 0;
    if (typeof vacationDateVal.toMillis === 'function') {
      vacationMs = vacationDateVal.toMillis();
    } else {
      vacationMs = new Date(vacationDateVal).getTime();
    }

    if (isNaN(vacationMs) || vacationMs > todayMs) continue; // Vacation hasn't arrived yet

    const daysSinceVacation = Math.floor((todayMs - vacationMs) / (1000 * 60 * 60 * 24));

    // Day 0: Soft-scope active pointers to next term pointer if not already done
    if (daysSinceVacation >= 0 && !s.softScopedPointer) {
      await db.collection('schoolSettings').doc(schoolId).set({
        softScopedPointer: true,
        activeQueryTermId: nextTermId,
        updatedAt: FieldValue.serverTimestamp(),
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
        createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }

    // Day +21 (Hard Stop): Automated Cloud Function executes the final archiving script
    if (daysSinceVacation >= 21 && s.termStatus !== 'Archived') {
      try {
        console.log(`[SAFETY NET DAY +21] Executing automated financial rollover for school: ${schoolId}`);
        await executeTermFinancialRollover(schoolId, currentTermId, nextTermId);

        await db.collection('notifications').doc(`rollover_auto_${schoolId}`).set({
          id: `rollover_auto_${schoolId}`,
          schoolId,
          type: 'rollover_executed',
          title: 'Automated 21-Day Term Rollover Completed',
          message: 'The 21-day safety net executed end-of-term financial archiving and carried forward itemized student balances.',
          read: false,
          createdAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.error(`[SAFETY NET ERROR] Automated rollover failed for school ${schoolId}:`, err);
      }
    }
  }
});
