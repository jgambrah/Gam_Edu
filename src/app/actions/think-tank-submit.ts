'use server';

import type { Firestore } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { getSessionUser, type SessionUser } from '@/lib/session-guard';
import {
  resolveThinkTankStudentOrStaff,
  resolveStaffFallbackSchoolId,
} from '@/lib/resolve-think-tank-student';
import {
  calculateParadoxXp,
  PARADOX_MAX_XP,
  MAX_SELF_XP_PER_DAY,
  type ParadoxGrade,
} from '@/lib/think-tank-xp';
import {
  evaluateParadoxSubmission,
  type ParadoxEvaluationResult,
} from '@/lib/think-tank-evaluator';
import { getTrustedParadox } from '@/lib/think-tank-server-curriculum';

export type SubmitThinkTankParadoxInput = {
  paradoxId: string;
  conclusion: string;
  theory: string;
};

export interface SafeParadoxDiagnosticEvaluation extends ParadoxEvaluationResult {
  grade: ParadoxGrade;
}

export interface SubmitThinkTankParadoxResponse {
  success: boolean;
  error?: string;
  evaluation?: SafeParadoxDiagnosticEvaluation;
  awarded?: number;
  totalParadoxXp?: number;
  thinkTankScore?: number;
  totalPoints?: number;
  xpEarnedToday?: number;
  isCompleted?: boolean;
  isBlueprintLocked?: boolean;
  masteryAchieved?: boolean;
  fullyCredited?: boolean;
  pendingXp?: number;
  blueprint?: {
    answer: string;
    explanation: string;
  };
}

export interface LockThinkTankBlueprintResponse {
  success: boolean;
  locked?: boolean;
  blueprint?: {
    answer: string;
    explanation: string;
  };
  error?: string;
}

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

/**
 * Resolves the student's authoritative schoolId from trusted server-side records.
 * Never trusts a schoolId supplied by the client.
 */
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
  if (typeof raw !== 'number' || !Number.isFinite(raw) || raw < 0 || !Number.isInteger(raw)) {
    throw new Error(`Invalid persisted counter for ${fieldName}.`);
  }
  if (maxAllowed !== undefined && raw > maxAllowed) {
    throw new Error(`Persisted counter ${fieldName} exceeds maximum allowed (${maxAllowed}).`);
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

function validateAwardedMap(
  raw: unknown
): Record<string, number> {
  if (raw === undefined || raw === null) {
    return {};
  }
  if (typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Invalid persisted thinkTankAwardedXp map.');
  }
  const map = raw as Record<string, unknown>;
  const validated: Record<string, number> = {};
  for (const [key, val] of Object.entries(map)) {
    validated[key] = validateStoredCounter(
      val,
      `thinkTankAwardedXp.${key}`,
      PARADOX_MAX_XP
    );
  }
  return validated;
}

export async function submitThinkTankParadoxAction(
  input: SubmitThinkTankParadoxInput,
  deps?: {
    db?: Firestore;
    user?: SessionUser | null;
    todayOverride?: string;
  }
): Promise<SubmitThinkTankParadoxResponse> {
  const user =
    deps && 'user' in deps ? deps.user : await getSessionUser();

  if (!user?.uid) {
    return { success: false, error: 'Not authenticated.' };
  }

  if (
    !input?.paradoxId ||
    typeof input.paradoxId !== 'string' ||
    typeof input.conclusion !== 'string' ||
    typeof input.theory !== 'string' ||
    input.conclusion.length > 2000 ||
    input.theory.length > 5000
  ) {
    return { success: false, error: 'Invalid submission.' };
  }

  try {
    const db = deps?.db ?? getAdminDb();

    // Must be derived from verified server-side school membership, not client input.
    const verifiedSchoolId = await getVerifiedStudentSchoolId(db, user);

    const { studentRef, isStaff } = await resolveThinkTankStudentOrStaff(
      db,
      user,
      verifiedSchoolId
    );

    // Load from trusted server-side curriculum.
    const paradox = await getTrustedParadox(input.paradoxId, {
      db,
      verifiedSchoolId,
    });

    if (!paradox) {
      return { success: false, error: 'Paradox not found.' };
    }

    const rawEvaluation = evaluateParadoxSubmission(
      paradox,
      input.conclusion,
      input.theory
    );

    const progressRef = db.collection('student_progress').doc(user.uid);
    const today =
      deps?.todayOverride ?? new Date().toISOString().slice(0, 10);

    const result = await db.runTransaction(async (tx) => {
      // All reads occur before writes.
      const progressSnap = await tx.get(progressRef);
      const studentSnap = studentRef ? await tx.get(studentRef) : null;

      if (!isStaff && (!studentSnap || !studentSnap.exists)) {
        throw new Error('Student record unavailable.');
      }

      const progress = (progressSnap.data() ?? {}) as Record<string, any>;
      const student = (studentSnap?.data() ?? {}) as Record<string, any>;

      // Revalidate identity, school, and active status within transaction for students.
      if (
        !isStaff &&
        (student.schoolId !== verifiedSchoolId ||
          (student.uid && student.uid !== user.uid) ||
          !isStudentRecordActive(student))
      ) {
        throw new Error('Student identity mismatch.');
      }

      const locked = validateStringArray(
        progress.thinkTankLockedBlueprints,
        'thinkTankLockedBlueprints'
      );
      const completed = validateStringArray(
        progress.thinkTankCompleted,
        'thinkTankCompleted'
      );
      const awardedMap = validateAwardedMap(progress.thinkTankAwardedXp);

      const currentThinkTankScore = validateStoredCounter(
        progress.thinkTankScore,
        'thinkTankScore'
      );
      const currentTotalPoints = validateStoredCounter(
        student.totalPoints,
        'totalPoints'
      );

      // If legacy progress marked this paradox completed before per-activity XP map existed,
      // treat alreadyAwarded as PARADOX_MAX_XP (15).
      const alreadyAwarded =
        awardedMap[input.paradoxId] !== undefined
          ? awardedMap[input.paradoxId]
          : completed.includes(input.paradoxId)
            ? PARADOX_MAX_XP
            : 0;

      const storedEarnedToday = validateStoredCounter(
        student.xpEarnedToday,
        'xpEarnedToday',
        MAX_SELF_XP_PER_DAY
      );

      const earnedToday =
        student.xpEarnedDay === today ? storedEarnedToday : 0;

      const isBlueprintLocked = locked.includes(input.paradoxId);

      const xp = calculateParadoxXp({
        grade: rawEvaluation.tier,
        alreadyAwarded,
        earnedToday,
        isBlueprintLocked,
      });

      const isCompletedNow =
        completed.includes(input.paradoxId) ||
        xp.newParadoxAward >= PARADOX_MAX_XP;

      const nextCompleted =
        isCompletedNow && !completed.includes(input.paradoxId)
          ? [...completed, input.paradoxId]
          : completed;

      const nextThinkTankScore = currentThinkTankScore + xp.awarded;
      const nextTotalPoints = currentTotalPoints + xp.awarded;

      if (xp.awarded > 0) {
        tx.set(
          progressRef,
          {
            thinkTankScore: nextThinkTankScore,
            thinkTankAwardedXp: {
              ...awardedMap,
              [input.paradoxId]: xp.newParadoxAward,
            },
            thinkTankCompleted: nextCompleted,
          },
          { merge: true }
        );

        if (studentRef) {
          tx.update(studentRef, {
            totalPoints: nextTotalPoints,
            xpEarnedDay: today,
            xpEarnedToday: xp.newDailyEarned,
          });
        }
      }

      const targetXpForGrade =
        rawEvaluation.tier === 'Mastered'
          ? 15
          : rawEvaluation.tier === 'Partially Correct'
            ? 8
            : 0;

      const pendingXp = isBlueprintLocked
        ? 0
        : Math.max(0, targetXpForGrade - xp.newParadoxAward);

      return {
        awarded: xp.awarded,
        totalParadoxXp: xp.newParadoxAward,
        thinkTankScore: nextThinkTankScore,
        totalPoints: nextTotalPoints,
        xpEarnedToday: xp.newDailyEarned,
        isCompleted: isCompletedNow,
        isBlueprintLocked,
        masteryAchieved: rawEvaluation.tier === 'Mastered',
        fullyCredited: xp.newParadoxAward >= targetXpForGrade,
        pendingXp,
      };
    });

    // Return only diagnostic evaluation fields (never expose canonical answer or explanation).
    const evaluation: SafeParadoxDiagnosticEvaluation = {
      tier: rawEvaluation.tier,
      grade: rawEvaluation.tier,
      xpAwarded: result.awarded,
      xpEarned: result.totalParadoxXp,
      maxXp: rawEvaluation.maxXp,
      headline: result.isBlueprintLocked
        ? 'Blueprint Already Revealed — 0 XP Eligible'
        : result.masteryAchieved && !result.fullyCredited
          ? `Mastered! (+${result.awarded} XP credited today — ${result.pendingXp} XP eligible after daily reset)`
          : rawEvaluation.headline,
      feedback: result.isBlueprintLocked
        ? 'The official blueprint for this paradox has already been revealed on your account, so no additional XP can be awarded.'
        : rawEvaluation.feedback,
      coachingHint: rawEvaluation.coachingHint,
    };

    return {
      success: true,
      evaluation,
      ...result,
      ...(result.isCompleted
        ? {
            blueprint: {
              answer: paradox.answer,
              explanation: paradox.explanation,
            },
          }
        : {}),
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Could not process paradox submission.',
    };
  }
}

export async function lockThinkTankBlueprintAction(
  paradoxId: string,
  deps?: {
    db?: Firestore;
    user?: SessionUser | null;
  }
): Promise<LockThinkTankBlueprintResponse> {
  const user =
    deps && 'user' in deps ? deps.user : await getSessionUser();

  if (!user?.uid) {
    return {
      success: false,
      error: 'Not authenticated.',
    };
  }

  if (
    typeof paradoxId !== 'string' ||
    paradoxId.trim().length === 0 ||
    paradoxId.length > 200
  ) {
    return {
      success: false,
      error: 'Invalid paradox ID.',
    };
  }

  const cleanParadoxId = paradoxId.trim();

  try {
    const db = deps?.db ?? getAdminDb();

    const verifiedSchoolId = await getVerifiedStudentSchoolId(db, user);

    const { studentRef, isStaff } = await resolveThinkTankStudentOrStaff(
      db,
      user,
      verifiedSchoolId
    );

    const paradox = await getTrustedParadox(cleanParadoxId, {
      db,
      verifiedSchoolId,
    });

    if (!paradox) {
      return {
        success: false,
        error: 'Paradox not found.',
      };
    }

    const progressRef = db.collection('student_progress').doc(user.uid);

    return await db.runTransaction(async (tx) => {
      // All reads before writes.
      const studentSnap = studentRef ? await tx.get(studentRef) : null;
      const progressSnap = await tx.get(progressRef);

      if (!isStaff && (!studentSnap || !studentSnap.exists)) {
        throw new Error('Student record unavailable.');
      }

      const student = (studentSnap?.data() ?? {}) as Record<string, any>;

      // Check schoolId, uid, isActive, status, and enrollmentStatus independently for students.
      if (
        !isStaff &&
        (student.schoolId !== verifiedSchoolId ||
          (student.uid && student.uid !== user.uid) ||
          !isStudentRecordActive(student))
      ) {
        throw new Error('Student not eligible.');
      }

      const progress = (progressSnap.data() ?? {}) as Record<string, any>;

      if (
        progress.thinkTankLockedBlueprints !== undefined &&
        (!Array.isArray(progress.thinkTankLockedBlueprints) ||
          !progress.thinkTankLockedBlueprints.every(
            (id: unknown) => typeof id === 'string'
          ))
      ) {
        throw new Error('Invalid stored blueprint locks.');
      }

      const existing: string[] = progress.thinkTankLockedBlueprints ?? [];

      if (!existing.includes(cleanParadoxId)) {
        tx.set(
          progressRef,
          {
            thinkTankLockedBlueprints: [...existing, cleanParadoxId],
          },
          { merge: true }
        );
      }

      // Only expose the canonical blueprint after the lock transaction commits.
      return {
        success: true,
        locked: true,
        blueprint: {
          answer: paradox.answer,
          explanation: paradox.explanation,
        },
      };
    });
  } catch (error) {
    console.error('lockThinkTankBlueprintAction failed:', error);

    return {
      success: false,
      error: 'Unable to lock blueprint.',
    };
  }
}


