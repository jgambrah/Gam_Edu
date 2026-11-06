'use server';

import type { Firestore } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { getSessionUser, type SessionUser } from '@/lib/session-guard';
import { resolveThinkTankStudent } from '@/lib/resolve-think-tank-student';
import { MAX_SELF_XP_PER_DAY } from '@/lib/think-tank-xp';
import { getTrustedDetectiveCase } from '@/lib/think-tank-server-curriculum';

const DETECTIVE_CASE_XP = 25;

export type SubmitThinkTankDetectiveInput = {
  caseId: string;
  selectedOption: string;
};

export type DetectiveSubmissionResult = {
  success: boolean;
  correct?: boolean;
  awardedXp?: number;
  alreadyCompleted?: boolean;
  feedback?: string;
  explanation?: string;
  thinkTankScore?: number;
  totalPoints?: number;
  xpEarnedToday?: number;
  error?: string;
};

const INACTIVE_STATUSES = new Set([
  'inactive',
  'transferred',
  'withdrawn',
  'suspended',
  'graduated',
]);

function isStudentRecordActive(student: Record<string, any>): boolean {
  if (student.isActive === false) return false;
  if (
    typeof student.status === 'string' &&
    INACTIVE_STATUSES.has(student.status.toLowerCase())
  ) {
    return false;
  }
  if (
    typeof student.enrollmentStatus === 'string' &&
    INACTIVE_STATUSES.has(student.enrollmentStatus.toLowerCase())
  ) {
    return false;
  }
  return true;
}

async function getVerifiedStudentSchoolId(
  db: Firestore,
  user: SessionUser
): Promise<string> {
  if (!user?.uid) {
    throw new Error('Missing authenticated user.');
  }

  const [userSnap, directStudentSnap, linkedStudentsSnap] = await Promise.all([
    db.collection('users').doc(user.uid).get(),
    db.collection('students').doc(user.uid).get(),
    db.collection('students').where('uid', '==', user.uid).get(),
  ]);

  const activeStudentSchools = new Set<string>();

  const collectFromStudentDoc = (data?: Record<string, any>) => {
    if (!data) return;
    if (data.uid && data.uid !== user.uid) return;
    if (!isStudentRecordActive(data)) return;
    if (typeof data.schoolId === 'string' && data.schoolId.trim()) {
      activeStudentSchools.add(data.schoolId.trim());
    }
  };

  if (directStudentSnap.exists) {
    collectFromStudentDoc(directStudentSnap.data() as Record<string, any>);
  }
  linkedStudentsSnap.docs.forEach((docSnap) => {
    if (docSnap.exists) {
      collectFromStudentDoc(docSnap.data() as Record<string, any>);
    }
  });

  if (activeStudentSchools.size > 1) {
    throw new Error(
      'Multiple active schools found for student account. Administrator reconciliation required.'
    );
  }

  const userProfileSchoolId =
    userSnap.exists && typeof userSnap.data()?.schoolId === 'string'
      ? userSnap.data()!.schoolId.trim()
      : '';
  const claimSchoolId =
    typeof user.claims?.schoolId === 'string'
      ? user.claims.schoolId.trim()
      : '';

  const studentSchoolId =
    activeStudentSchools.size === 1
      ? Array.from(activeStudentSchools)[0]
      : '';

  if (
    studentSchoolId &&
    userProfileSchoolId &&
    studentSchoolId !== userProfileSchoolId
  ) {
    throw new Error('Student school mismatch with user profile.');
  }

  if (studentSchoolId && claimSchoolId && studentSchoolId !== claimSchoolId) {
    throw new Error('Student school mismatch with session claims.');
  }

  const resolved = studentSchoolId || userProfileSchoolId || claimSchoolId;
  if (!resolved) {
    throw new Error('Could not verify student school membership.');
  }

  return resolved;
}

function validateStoredCounter(
  raw: unknown,
  fieldName: string,
  maxAllowed?: number
): number {
  if (raw === undefined || raw === null) {
    return 0;
  }
  if (
    typeof raw !== 'number' ||
    !Number.isFinite(raw) ||
    raw < 0 ||
    !Number.isInteger(raw)
  ) {
    throw new Error(`Invalid persisted counter for ${fieldName}.`);
  }
  if (maxAllowed !== undefined && raw > maxAllowed) {
    throw new Error(
      `Persisted counter ${fieldName} exceeds maximum allowed (${maxAllowed}).`
    );
  }
  return raw;
}

function validateStringArray(raw: unknown, fieldName: string): string[] {
  if (raw === undefined || raw === null) {
    return [];
  }
  if (!Array.isArray(raw) || !raw.every((item) => typeof item === 'string')) {
    throw new Error(`Invalid persisted array for ${fieldName}.`);
  }
  return raw;
}

export async function submitThinkTankDetectiveAction(
  input: SubmitThinkTankDetectiveInput,
  deps?: {
    db?: Firestore;
    user?: SessionUser | null;
    todayOverride?: string;
  }
): Promise<DetectiveSubmissionResult> {
  const user =
    deps && 'user' in deps ? deps.user : await getSessionUser();

  if (!user?.uid) {
    return {
      success: false,
      error: 'Not authenticated.',
    };
  }

  if (
    !input ||
    typeof input !== 'object' ||
    typeof input.caseId !== 'string' ||
    typeof input.selectedOption !== 'string'
  ) {
    return {
      success: false,
      error: 'Invalid detective submission.',
    };
  }

  const cleanCaseId = input.caseId.trim();
  const cleanSelectedOption = input.selectedOption.trim();

  if (
    !cleanCaseId ||
    cleanCaseId.includes('/') ||
    !cleanSelectedOption ||
    cleanSelectedOption.length > 1000
  ) {
    return {
      success: false,
      error: 'Invalid detective submission.',
    };
  }

  try {
    const db = deps?.db ?? getAdminDb();

    // 1 & 2. Resolve authoritative student document and verified schoolId
    const verifiedSchoolId = await getVerifiedStudentSchoolId(db, user);
    const studentRef = await resolveThinkTankStudent(
      db,
      user.uid,
      verifiedSchoolId
    );

    // 3 & 4. Load canonical Detective Case from server-only curriculum or trusted private school doc
    const detectiveCase = await getTrustedDetectiveCase(cleanCaseId, {
      db,
      verifiedSchoolId,
    });

    if (!detectiveCase) {
      return {
        success: false,
        error: 'Detective case not found.',
      };
    }

    // 5. Compare selectedOption with canonical correctAnswer on the server
    const validOptions = detectiveCase.options.map((o) => o.trim());
    const isValidOption = validOptions.includes(cleanSelectedOption);
    const correct =
      isValidOption &&
      cleanSelectedOption === detectiveCase.correctAnswer.trim();

    const progressRef = db.collection('student_progress').doc(user.uid);
    const today =
      deps?.todayOverride ?? new Date().toISOString().slice(0, 10);

    // 6 & 7. Persist completion and XP atomically using an Admin SDK transaction
    const txOutcome = await db.runTransaction(async (tx) => {
      const [progressSnap, studentSnap] = await Promise.all([
        tx.get(progressRef),
        tx.get(studentRef),
      ]);

      if (!studentSnap.exists) {
        throw new Error('Student record unavailable.');
      }

      const progress = (progressSnap.data() ?? {}) as Record<string, any>;
      const student = (studentSnap.data() ?? {}) as Record<string, any>;

      if (
        student.schoolId !== verifiedSchoolId ||
        (student.uid && student.uid !== user.uid) ||
        !isStudentRecordActive(student)
      ) {
        throw new Error('Student identity mismatch.');
      }

      const detectiveCompletedIds = validateStringArray(
        progress.thinkTankDetectiveCompletedIds,
        'thinkTankDetectiveCompletedIds'
      );
      const completedIds = validateStringArray(
        progress.thinkTankCompleted,
        'thinkTankCompleted'
      );
      const currentThinkTankScore = validateStoredCounter(
        progress.thinkTankScore,
        'thinkTankScore'
      );
      const currentTotalPoints = validateStoredCounter(
        student.totalPoints,
        'totalPoints'
      );
      const storedEarnedToday = validateStoredCounter(
        student.xpEarnedToday,
        'xpEarnedToday',
        MAX_SELF_XP_PER_DAY
      );

      const alreadyCompleted =
        detectiveCompletedIds.includes(cleanCaseId) ||
        completedIds.includes(cleanCaseId);

      const earnedToday =
        student.xpEarnedDay === today ? storedEarnedToday : 0;
      const remainingDailyAllowance = Math.max(
        0,
        MAX_SELF_XP_PER_DAY - earnedToday
      );

      const requestedXp =
        correct && !alreadyCompleted ? DETECTIVE_CASE_XP : 0;
      const awardedXp = Math.min(requestedXp, remainingDailyAllowance);
      const newDailyEarned = earnedToday + awardedXp;

      const nextThinkTankScore = currentThinkTankScore + awardedXp;
      const nextTotalPoints = currentTotalPoints + awardedXp;

      if (correct && !alreadyCompleted) {
        const nextDetectiveCompletedIds = detectiveCompletedIds.includes(
          cleanCaseId
        )
          ? detectiveCompletedIds
          : [...detectiveCompletedIds, cleanCaseId];

        const nextCompletedIds = completedIds.includes(cleanCaseId)
          ? completedIds
          : [...completedIds, cleanCaseId];

        tx.set(
          progressRef,
          {
            thinkTankDetectiveCompletedIds: nextDetectiveCompletedIds,
            thinkTankCompleted: nextCompletedIds,
            thinkTankScore: nextThinkTankScore,
          },
          { merge: true }
        );

        if (awardedXp > 0) {
          tx.update(studentRef, {
            totalPoints: nextTotalPoints,
            xpEarnedDay: today,
            xpEarnedToday: newDailyEarned,
          });
        }
      }

      return {
        awardedXp,
        alreadyCompleted,
        thinkTankScore: nextThinkTankScore,
        totalPoints: nextTotalPoints,
        xpEarnedToday: newDailyEarned,
      };
    });

    // 8. Return only safe evaluation information to the browser
    if (!correct) {
      return {
        success: true,
        correct: false,
        awardedXp: 0,
        alreadyCompleted: txOutcome.alreadyCompleted,
        feedback:
          'Your selected analysis does not match the evidence in the case file. Re-examine the scenario clues and try again.',
        thinkTankScore: txOutcome.thinkTankScore,
        totalPoints: txOutcome.totalPoints,
        xpEarnedToday: txOutcome.xpEarnedToday,
      };
    }

    const feedback = txOutcome.alreadyCompleted
      ? `${detectiveCase.explanation} (Already completed — 0 additional XP.)`
      : txOutcome.awardedXp < DETECTIVE_CASE_XP
      ? `${detectiveCase.explanation} (Daily XP limit reached: +${txOutcome.awardedXp} XP credited.)`
      : detectiveCase.explanation;

    return {
      success: true,
      correct: true,
      awardedXp: txOutcome.awardedXp,
      alreadyCompleted: txOutcome.alreadyCompleted,
      feedback,
      explanation: detectiveCase.explanation,
      thinkTankScore: txOutcome.thinkTankScore,
      totalPoints: txOutcome.totalPoints,
      xpEarnedToday: txOutcome.xpEarnedToday,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Could not process detective submission.',
    };
  }
}

