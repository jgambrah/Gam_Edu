'use server';

import type { Firestore } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { getSessionUser, type SessionUser } from '@/lib/session-guard';
import {
  resolveThinkTankStudentOrStaff,
  resolveStaffFallbackSchoolId,
} from '@/lib/resolve-think-tank-student';
import { MAX_SELF_XP_PER_DAY } from '@/lib/think-tank-xp';
import {
  getTrustedRiddle,
  isCorrectRiddleGuess,
} from '@/lib/think-tank-server-curriculum';

export type SubmitThinkTankRiddleInput = {
  riddleId: string;
  guess: string;
};

export type RiddleSubmissionResult = {
  success: boolean;
  correct?: boolean;
  awardedXp?: number;
  alreadyCompleted?: boolean;
  alreadyRevealed?: boolean;
  answer?: string;
  explanation?: string;
  feedback?: string;
  thinkTankScore?: number;
  totalPoints?: number;
  xpEarnedToday?: number;
  error?: string;
};

export type RevealThinkTankRiddleInput = {
  riddleId: string;
};

export type RiddleRevealResult = {
  success: boolean;
  revealed?: boolean;
  awardedXp?: number;
  alreadyCompleted?: boolean;
  answer?: string;
  explanation?: string;
  error?: string;
};

const RIDDLE_MAX_XP = 15;

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

  const staffFallbackSchoolId =
    !studentSchoolId && !userProfileSchoolId && !claimSchoolId
      ? await resolveStaffFallbackSchoolId(db, user)
      : '';

  const resolved =
    studentSchoolId ||
    userProfileSchoolId ||
    claimSchoolId ||
    staffFallbackSchoolId;
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

export async function submitThinkTankRiddleAction(
  input: SubmitThinkTankRiddleInput,
  deps?: {
    db?: Firestore;
    user?: SessionUser | null;
    todayOverride?: string;
  }
): Promise<RiddleSubmissionResult> {
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
    typeof input.riddleId !== 'string' ||
    typeof input.guess !== 'string'
  ) {
    return {
      success: false,
      error: 'Invalid riddle submission.',
    };
  }

  const cleanRiddleId = input.riddleId.trim();
  const cleanGuess = input.guess.trim();

  if (
    !cleanRiddleId ||
    cleanRiddleId.includes('/') ||
    !cleanGuess ||
    cleanGuess.length > 500
  ) {
    return {
      success: false,
      error: 'Invalid riddle submission.',
    };
  }

  try {
    const db = deps?.db ?? getAdminDb();
    const verifiedSchoolId = await getVerifiedStudentSchoolId(db, user);
    const { studentRef, isStaff } = await resolveThinkTankStudentOrStaff(
      db,
      user,
      verifiedSchoolId
    );

    const riddle = await getTrustedRiddle(cleanRiddleId, verifiedSchoolId, {
      db,
    });

    if (!riddle) {
      return {
        success: false,
        error: 'Riddle not found.',
      };
    }

    const correct = isCorrectRiddleGuess(
      cleanGuess,
      riddle.answer,
      riddle.acceptedKeywords
    );

    const progressRef = db.collection('student_progress').doc(user.uid);
    const today =
      deps?.todayOverride ?? new Date().toISOString().slice(0, 10);

    const txOutcome = await db.runTransaction(async (tx) => {
      const progressSnap = await tx.get(progressRef);
      const studentSnap = studentRef ? await tx.get(studentRef) : null;

      if (!isStaff && (!studentSnap || !studentSnap.exists)) {
        throw new Error('Student record unavailable.');
      }

      const progress = (progressSnap.data() ?? {}) as Record<string, any>;
      const student = (studentSnap?.data() ?? {}) as Record<string, any>;

      if (
        !isStaff &&
        (student.schoolId !== verifiedSchoolId ||
          (student.uid && student.uid !== user.uid) ||
          !isStudentRecordActive(student))
      ) {
        throw new Error('Student identity mismatch.');
      }

      const riddleCompletedIds = validateStringArray(
        progress.thinkTankRiddleCompletedIds,
        'thinkTankRiddleCompletedIds'
      );
      const riddleRevealedIds = validateStringArray(
        progress.thinkTankRiddleRevealedIds,
        'thinkTankRiddleRevealedIds'
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
        riddleCompletedIds.includes(cleanRiddleId) ||
        completedIds.includes(cleanRiddleId);
      const alreadyRevealed = riddleRevealedIds.includes(cleanRiddleId);

      const earnedToday =
        student.xpEarnedDay === today ? storedEarnedToday : 0;
      const remainingDailyAllowance = Math.max(
        0,
        MAX_SELF_XP_PER_DAY - earnedToday
      );

      const eligibleForXp =
        correct && !alreadyCompleted && !alreadyRevealed;
      const requestedXp = eligibleForXp ? RIDDLE_MAX_XP : 0;
      const awardedXp = Math.min(requestedXp, remainingDailyAllowance);
      const newDailyEarned = earnedToday + awardedXp;

      const nextThinkTankScore = currentThinkTankScore + awardedXp;
      const nextTotalPoints = currentTotalPoints + awardedXp;

      if (eligibleForXp) {
        const nextRiddleCompletedIds = riddleCompletedIds.includes(
          cleanRiddleId
        )
          ? riddleCompletedIds
          : [...riddleCompletedIds, cleanRiddleId];

        const nextCompletedIds = completedIds.includes(cleanRiddleId)
          ? completedIds
          : [...completedIds, cleanRiddleId];

        tx.set(
          progressRef,
          {
            thinkTankRiddleCompletedIds: nextRiddleCompletedIds,
            thinkTankCompleted: nextCompletedIds,
            thinkTankScore: nextThinkTankScore,
          },
          { merge: true }
        );

        if (awardedXp > 0 && studentRef) {
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
        alreadyRevealed,
        thinkTankScore: nextThinkTankScore,
        totalPoints: nextTotalPoints,
        xpEarnedToday: newDailyEarned,
      };
    });

    if (!correct) {
      return {
        success: true,
        correct: false,
        awardedXp: 0,
        alreadyCompleted: txOutcome.alreadyCompleted,
        alreadyRevealed: txOutcome.alreadyRevealed,
        feedback:
          'Not quite! Try unlocking a clue or phrasing your answer simply.',
        thinkTankScore: txOutcome.thinkTankScore,
        totalPoints: txOutcome.totalPoints,
        xpEarnedToday: txOutcome.xpEarnedToday,
      };
    }

    const feedback = txOutcome.alreadyRevealed
      ? `${riddle.explanation} (Answer was already revealed — 0 XP.)`
      : txOutcome.alreadyCompleted
      ? `${riddle.explanation} (Already completed — 0 additional XP.)`
      : txOutcome.awardedXp < RIDDLE_MAX_XP
      ? `${riddle.explanation} (Daily XP limit reached: +${txOutcome.awardedXp} XP credited.)`
      : riddle.explanation;

    return {
      success: true,
      correct: true,
      awardedXp: txOutcome.awardedXp,
      alreadyCompleted: txOutcome.alreadyCompleted,
      alreadyRevealed: txOutcome.alreadyRevealed,
      answer: riddle.answer,
      explanation: riddle.explanation,
      feedback,
      thinkTankScore: txOutcome.thinkTankScore,
      totalPoints: txOutcome.totalPoints,
      xpEarnedToday: txOutcome.xpEarnedToday,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Could not process riddle submission.',
    };
  }
}

export async function revealThinkTankRiddleAction(
  input: RevealThinkTankRiddleInput,
  deps?: {
    db?: Firestore;
    user?: SessionUser | null;
  }
): Promise<RiddleRevealResult> {
  const user =
    deps && 'user' in deps ? deps.user : await getSessionUser();

  if (!user?.uid) {
    return {
      success: false,
      error: 'Not authenticated.',
    };
  }

  const cleanRiddleId =
    typeof input?.riddleId === 'string' ? input.riddleId.trim() : '';

  if (!cleanRiddleId || cleanRiddleId.includes('/')) {
    return {
      success: false,
      error: 'Invalid riddle ID.',
    };
  }

  try {
    const db = deps?.db ?? getAdminDb();
    const verifiedSchoolId = await getVerifiedStudentSchoolId(db, user);
    const { studentRef, isStaff } = await resolveThinkTankStudentOrStaff(
      db,
      user,
      verifiedSchoolId
    );

    const riddle = await getTrustedRiddle(cleanRiddleId, verifiedSchoolId, {
      db,
    });

    if (!riddle) {
      return {
        success: false,
        error: 'Riddle not found.',
      };
    }

    const progressRef = db.collection('student_progress').doc(user.uid);

    const txOutcome = await db.runTransaction(async (tx) => {
      const progressSnap = await tx.get(progressRef);
      const studentSnap = studentRef ? await tx.get(studentRef) : null;

      if (!isStaff && (!studentSnap || !studentSnap.exists)) {
        throw new Error('Student record unavailable.');
      }

      const progress = (progressSnap.data() ?? {}) as Record<string, any>;
      const student = (studentSnap?.data() ?? {}) as Record<string, any>;

      if (
        !isStaff &&
        (student.schoolId !== verifiedSchoolId ||
          (student.uid && student.uid !== user.uid) ||
          !isStudentRecordActive(student))
      ) {
        throw new Error('Student identity mismatch.');
      }

      const riddleRevealedIds = validateStringArray(
        progress.thinkTankRiddleRevealedIds,
        'thinkTankRiddleRevealedIds'
      );
      const riddleCompletedIds = validateStringArray(
        progress.thinkTankRiddleCompletedIds,
        'thinkTankRiddleCompletedIds'
      );
      const completedIds = validateStringArray(
        progress.thinkTankCompleted,
        'thinkTankCompleted'
      );
      // Validate existing counters so malformed persisted state is rejected
      validateStoredCounter(progress.thinkTankScore, 'thinkTankScore');
      validateStoredCounter(student.totalPoints, 'totalPoints');
      validateStoredCounter(
        student.xpEarnedToday,
        'xpEarnedToday',
        MAX_SELF_XP_PER_DAY
      );

      const alreadyCompleted =
        riddleCompletedIds.includes(cleanRiddleId) ||
        completedIds.includes(cleanRiddleId);

      const nextRiddleRevealedIds = riddleRevealedIds.includes(cleanRiddleId)
        ? riddleRevealedIds
        : [...riddleRevealedIds, cleanRiddleId];

      tx.set(
        progressRef,
        {
          thinkTankRiddleRevealedIds: nextRiddleRevealedIds,
        },
        { merge: true }
      );

      return {
        alreadyCompleted,
      };
    });

    return {
      success: true,
      revealed: true,
      awardedXp: 0,
      alreadyCompleted: txOutcome.alreadyCompleted,
      answer: riddle.answer,
      explanation: riddle.explanation,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Could not reveal riddle answer.',
    };
  }
}

