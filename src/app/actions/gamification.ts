'use server';

import type { Firestore } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { getSessionUser, schoolsOfUser, type SessionUser } from '@/lib/session-guard';
import {
  BADGE_CATALOG,
  computeBadgeUpdate,
  type BadgeCatalogItem,
  type GamificationEvent,
} from '@/lib/badge-rules';

/**
 * XP and badges, awarded on the server.
 *
 * Security Rules (Step 10A.7):
 * - A student can never increase their own XP simply by supplying an amount to `awardActivityXpAction`.
 * - Student XP for challenges (e.g., The Think Tank) is awarded atomically inside the verified activity's own Server Action.
 * - Client-submitted `STEM_CHALLENGE_COMPLETED` and `LIBRARY_BOOK_RETURNED` events are rejected for `relation === 'self'`.
 * - Legitimate STEM badge completions must be verified against server-side completion state (`recordVerifiedStemCompletionOnServer`) or recorded by authorized school staff.
 * - Staff XP and badge operations require verified school membership (`student.schoolId` in `ctx.schools`) and an explicit academic staff role (`Teacher`, `Administrator`, `Director`, etc.) with `canAwardXp !== false`.
 * - Parents cannot award XP or record badge events for students.
 */

const MAX_XP_PER_ACTIVITY = 150;

const AUTHORIZED_XP_STAFF_ROLES = new Set([
  'administrator',
  'director',
  'teacher',
  'admin',
  'super_admin',
  'principal',
  'headmaster',
  'proprietor',
  'academic_head',
]);

const AUTHORIZED_LIBRARY_STAFF_ROLES = new Set([
  ...AUTHORIZED_XP_STAFF_ROLES,
  'librarian',
]);

const INACTIVE_STATUSES = new Set([
  'inactive',
  'suspended',
  'terminated',
  'withdrawn',
  'transferred',
  'graduated',
]);

type Relation = 'staff' | 'self' | 'none';

export interface GamificationTestDeps {
  db?: Firestore;
  user?: SessionUser | null;
  todayOverride?: string;
}

interface CallerContext {
  user: SessionUser;
  isStaff: boolean;
  canAwardXp: boolean;
  canRecordLibraryReturn: boolean;
  schools: string[];
  parentStudentIds: string[];
}

function isRecordActive(record: Record<string, any> | null | undefined): boolean {
  if (!record) return true;
  if (record.isActive === false) return false;
  if (
    typeof record.status === 'string' &&
    INACTIVE_STATUSES.has(record.status.trim().toLowerCase())
  ) {
    return false;
  }
  return true;
}

async function resolveCallerSchools(
  db: Firestore,
  user: SessionUser,
  staffData: Record<string, any> | null,
  userData: Record<string, any> | null,
  parentData: Record<string, any> | null,
  useCustomDb: boolean
): Promise<string[]> {
  const schools = new Set<string>();
  [staffData, userData, parentData].forEach((docData) => {
    if (typeof docData?.schoolId === 'string' && docData.schoolId.trim()) {
      schools.add(docData.schoolId.trim());
    }
  });

  const studentSnap = await db.collection('students').doc(user.uid).get();
  if (studentSnap.exists) {
    const sSchool = (studentSnap.data() as any)?.schoolId;
    if (typeof sSchool === 'string' && sSchool.trim()) {
      schools.add(sSchool.trim());
    }
  }

  if (!useCustomDb) {
    try {
      const guardSchools = await schoolsOfUser(user);
      guardSchools.forEach((s) => {
        if (typeof s === 'string' && s.trim()) {
          schools.add(s.trim());
        }
      });
    } catch {
      // Fallback to Firestore profile documents already loaded above
    }
  }

  return Array.from(schools);
}

async function loadCaller(
  user: SessionUser,
  deps?: GamificationTestDeps
): Promise<CallerContext> {
  const db = deps?.db ?? getAdminDb();
  const useCustomDb = Boolean(deps?.db);

  const [staffSnap, userSnap, parentSnap] = await Promise.all([
    db.collection('staff').doc(user.uid).get(),
    db.collection('users').doc(user.uid).get(),
    db.collection('parents').doc(user.uid).get(),
  ]);

  const staffData: Record<string, any> | null = staffSnap.exists
    ? (staffSnap.data() as any)
    : null;
  const userData: Record<string, any> | null = userSnap.exists
    ? (userSnap.data() as any)
    : null;
  const parentData: Record<string, any> | null = parentSnap.exists
    ? (parentSnap.data() as any)
    : null;

  const schools = await resolveCallerSchools(
    db,
    user,
    staffData,
    userData,
    parentData,
    useCustomDb
  );

  const rawRole = String(
    staffData?.role ||
      userData?.role ||
      (user.isSuperAdmin ? 'super_admin' : '')
  )
    .trim()
    .toLowerCase();

  const activeAccount =
    isRecordActive(staffData) && isRecordActive(userData);

  const explicitPermissionDenied =
    staffData?.canAwardXp === false || userData?.canAwardXp === false;

  const isAcademicStaff =
    Boolean(user.isSuperAdmin) ||
    (activeAccount && AUTHORIZED_XP_STAFF_ROLES.has(rawRole));

  const isLibraryStaff =
    Boolean(user.isSuperAdmin) ||
    (activeAccount && AUTHORIZED_LIBRARY_STAFF_ROLES.has(rawRole));

  return {
    user,
    isStaff: isAcademicStaff || isLibraryStaff,
    canAwardXp: isAcademicStaff && !explicitPermissionDenied,
    canRecordLibraryReturn: isLibraryStaff && !explicitPermissionDenied,
    schools,
    parentStudentIds: Array.isArray(parentData?.studentIds)
      ? parentData.studentIds
      : [],
  };
}

function relationTo(
  ctx: CallerContext,
  student: any,
  studentDocId: string
): Relation {
  const { user } = ctx;
  if (user.isSuperAdmin) return 'staff';

  const isSameStudent =
    student?.uid === user.uid || studentDocId === user.uid;

  if (isSameStudent) {
    if (
      typeof student?.schoolId === 'string' &&
      student.schoolId.trim() &&
      ctx.schools.length > 0 &&
      !ctx.schools.includes(student.schoolId.trim())
    ) {
      return 'none';
    }
    return 'self';
  }

  // Parents are not authorized to self-award XP or spoof student completion events
  const isParentOfStudent =
    student?.parentId === user.uid ||
    (Array.isArray(student?.parentIds) &&
      student.parentIds.includes(user.uid)) ||
    ctx.parentStudentIds.includes(studentDocId) ||
    (student?.uid && ctx.parentStudentIds.includes(student.uid));

  if (!ctx.isStaff) {
    return isParentOfStudent ? 'none' : 'none';
  }

  const studentSchoolId =
    typeof student?.schoolId === 'string' ? student.schoolId.trim() : '';

  if (!studentSchoolId || !ctx.schools.includes(studentSchoolId)) {
    return 'none';
  }

  return 'staff';
}

function badgeEntries(badges: BadgeCatalogItem[]) {
  const now = Date.now();
  let xp = 0;
  const entries = badges.map((b, idx) => {
    xp += b.xpReward;
    return {
      id: `${b.id}_${now}_${idx}`,
      title: b.title,
      category: b.category,
      unlockedAt: new Date().toISOString(),
      xpAwarded: b.xpReward,
    };
  });
  return { entries, xp };
}

async function hasUncreditedServerQuizAttempt(
  db: Firestore,
  studentUid: string,
  studentDocId: string,
  studentData: Record<string, any>
): Promise<{ verified: boolean; latestScorePercent?: number }> {
  const candidateIds = Array.from(
    new Set([studentUid, studentDocId].filter((v) => typeof v === 'string' && v.trim()))
  );
  let verifiedAttempts: Record<string, any>[] = [];

  for (const id of candidateIds) {
    const snap = await db
      .collection('quizAttempts')
      .where('studentId', '==', id)
      .get();
    for (const d of snap.docs) {
      const data = d.data() as Record<string, any>;
      if (data?.gradedOnServer === true) {
        verifiedAttempts.push(data);
      }
    }
  }

  const creditedCount = Number(studentData?.verifiedQuizBadgeCount || 0);
  if (verifiedAttempts.length <= creditedCount) {
    return { verified: false };
  }

  const latest = verifiedAttempts[verifiedAttempts.length - 1];
  const score = Number(latest?.score || 0);
  const total = Number(latest?.total || 0);
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  return { verified: true, latestScorePercent: pct };
}

async function applyEvent(
  db: Firestore,
  ctx: CallerContext,
  studentId: string,
  event: GamificationEvent
): Promise<{ success: boolean; error?: string }> {
  if (!studentId || typeof studentId !== 'string' || !event?.type) {
    return { success: false, error: 'Missing student or event.' };
  }

  try {
    const ref = db.collection('students').doc(studentId);
    return await db.runTransaction(async (t) => {
      const snap = await t.get(ref);
      if (!snap.exists) {
        return { success: false, error: 'Student not found.' };
      }
      const student: any = snap.data() || {};
      const relation = relationTo(ctx, student, studentId);

      if (relation === 'none') {
        return { success: false, error: 'Not authorized.' };
      }

      let effectiveEvent: GamificationEvent = event;
      let extraFields: Record<string, any> = {};

      if (relation === 'self') {
        if (event.type === 'STEM_CHALLENGE_COMPLETED') {
          return {
            success: false,
            error:
              'Student-submitted STEM_CHALLENGE_COMPLETED events are not allowed; STEM completions must originate from a verified server-side completion.',
          };
        }

        if (event.type === 'LIBRARY_BOOK_RETURNED') {
          return {
            success: false,
            error: 'Only authorized school staff can record library book returns.',
          };
        }

        if (event.type === 'QUIZ_SUBMITTED') {
          const quizCheck = await hasUncreditedServerQuizAttempt(
            db,
            student.uid || studentId,
            studentId,
            student
          );
          if (!quizCheck.verified) {
            return {
              success: false,
              error: 'Quiz badge events require a server-graded quiz attempt.',
            };
          }
          effectiveEvent = {
            type: 'QUIZ_SUBMITTED',
            quizScorePercent: quizCheck.latestScorePercent ?? 0,
          };
          extraFields.verifiedQuizBadgeCount =
            Number(student.verifiedQuizBadgeCount || 0) + 1;
        } else {
          return {
            success: false,
            error: 'Only school staff can record this.',
          };
        }
      } else {
        // relation === 'staff'
        if (event.type === 'LIBRARY_BOOK_RETURNED') {
          if (!ctx.canRecordLibraryReturn) {
            return {
              success: false,
              error: 'Not authorized to record library returns.',
            };
          }
        } else if (!ctx.canAwardXp) {
          return {
            success: false,
            error: 'Not authorized to award student badges or XP.',
          };
        }
      }

      const { fields, newBadges } = computeBadgeUpdate(student, effectiveEvent);
      const update: Record<string, any> = { ...fields, ...extraFields };

      if (newBadges.length > 0) {
        const { entries, xp } = badgeEntries(newBadges);
        const existingBadges: any[] = Array.isArray(student.earnedBadges)
          ? student.earnedBadges
          : [];
        const currentPoints = Number(student.totalPoints || 0);
        update.earnedBadges = [...existingBadges, ...entries];
        update.totalPoints = currentPoints + xp;
      }

      if (Object.keys(update).length === 0) {
        return { success: true };
      }
      update.lastGamificationUpdate = new Date().toISOString();
      t.update(ref, update);
      return { success: true };
    });
  } catch (e: any) {
    console.error('recordGamificationEvent failed:', e?.message);
    return { success: false, error: 'Could not record the activity.' };
  }
}

export async function recordGamificationEventAction(
  studentId: string,
  event: GamificationEvent,
  deps?: GamificationTestDeps
): Promise<{ success: boolean; error?: string }> {
  const [res] = await recordGamificationEventsAction(
    [{ studentId, event }],
    deps
  );
  return res;
}

/** Several events in one round trip (the attendance register records one per student). */
export async function recordGamificationEventsAction(
  items: { studentId: string; event: GamificationEvent }[],
  deps?: GamificationTestDeps
): Promise<{ success: boolean; error?: string }[]> {
  const list = Array.isArray(items) ? items.slice(0, 500) : [];
  if (list.length === 0) return [];
  const user =
    deps && 'user' in deps ? deps.user : await getSessionUser();
  if (!user) {
    return list.map(() => ({ success: false, error: 'Not signed in.' }));
  }
  const db = deps?.db ?? getAdminDb();
  const ctx = await loadCaller(user, deps);
  const results: { success: boolean; error?: string }[] = [];
  for (let i = 0; i < list.length; i += 10) {
    const chunk = list.slice(i, i + 10);
    results.push(
      ...(await Promise.all(
        chunk.map((it) => applyEvent(db, ctx, it?.studentId, it?.event))
      ))
    );
  }
  return results;
}

/**
 * Trusted server-side helper to record a STEM challenge badge progression
 * only when backed by an authoritative completion record in `student_progress/{uid}`.
 */
export async function recordVerifiedStemCompletionOnServer(
  input: {
    studentId: string;
    activityId: string;
  },
  deps?: GamificationTestDeps
): Promise<{
  success: boolean;
  stemCount?: number;
  badgeAwarded?: boolean;
  xpAwarded?: number;
  error?: string;
}> {
  const cleanStudentId =
    typeof input?.studentId === 'string' ? input.studentId.trim() : '';
  const cleanActivityId =
    typeof input?.activityId === 'string' ? input.activityId.trim() : '';

  if (
    !cleanStudentId ||
    cleanStudentId.includes('/') ||
    !cleanActivityId ||
    cleanActivityId.includes('/')
  ) {
    return {
      success: false,
      error: 'Invalid studentId or activityId.',
    };
  }

  const user =
    deps && 'user' in deps ? deps.user : await getSessionUser();
  if (!user?.uid) {
    return {
      success: false,
      error: 'Not signed in.',
    };
  }

  try {
    const db = deps?.db ?? getAdminDb();
    const ctx = await loadCaller(user, deps);
    const studentRef = db.collection('students').doc(cleanStudentId);

    return await db.runTransaction(async (tx) => {
      const studentSnap = await tx.get(studentRef);
      if (!studentSnap.exists) {
        return {
          success: false,
          error: 'Student not found.',
        };
      }

      const student = (studentSnap.data() || {}) as Record<string, any>;
      const relation = relationTo(ctx, student, cleanStudentId);

      if (relation === 'none') {
        return {
          success: false,
          error: 'Not authorized.',
        };
      }

      if (relation === 'staff' && !ctx.canAwardXp) {
        return {
          success: false,
          error: 'Not authorized to record STEM completions.',
        };
      }

      const targetUid =
        typeof student.uid === 'string' && student.uid.trim()
          ? student.uid.trim()
          : cleanStudentId;
      const progressRef = db.collection('student_progress').doc(targetUid);
      const progressSnap = await tx.get(progressRef);

      if (!progressSnap.exists) {
        return {
          success: false,
          error: 'No server-verified progress record found for student.',
        };
      }

      const progress = (progressSnap.data() || {}) as Record<string, any>;
      const verifiedSet = new Set<string>();
      for (const field of [
        'thinkTankCompleted',
        'thinkTankDetectiveCompletedIds',
        'thinkTankRiddleCompletedIds',
        'thinkTankDebateCompletedIds',
      ]) {
        const arr = progress[field];
        if (Array.isArray(arr)) {
          arr.forEach((id) => {
            if (typeof id === 'string' && id.trim()) {
              verifiedSet.add(id.trim());
            }
          });
        }
      }

      if (
        progress.thinkTankAwardedXp &&
        typeof progress.thinkTankAwardedXp === 'object'
      ) {
        for (const [id, xp] of Object.entries(progress.thinkTankAwardedXp)) {
          if (typeof xp === 'number' && xp > 0) {
            verifiedSet.add(id);
          }
        }
      }

      if (!verifiedSet.has(cleanActivityId)) {
        return {
          success: false,
          error:
            'Activity completion has not been verified on the server.',
        };
      }

      const creditedIds: string[] = Array.isArray(
        progress.stemCreditedActivityIds
      )
        ? progress.stemCreditedActivityIds
        : [];

      if (creditedIds.includes(cleanActivityId)) {
        return {
          success: true,
          stemCount: Number(student.stemCount || 0),
          badgeAwarded: false,
          xpAwarded: 0,
        };
      }

      const { fields, newBadges } = computeBadgeUpdate(student, {
        type: 'STEM_CHALLENGE_COMPLETED',
      });
      const update: Record<string, any> = { ...fields };
      let xpAwarded = 0;

      if (newBadges.length > 0) {
        const { entries, xp } = badgeEntries(newBadges);
        xpAwarded = xp;
        const existingBadges: any[] = Array.isArray(student.earnedBadges)
          ? student.earnedBadges
          : [];
        const currentPoints = Number(student.totalPoints || 0);
        update.earnedBadges = [...existingBadges, ...entries];
        update.totalPoints = currentPoints + xp;
      }

      update.lastGamificationUpdate = new Date().toISOString();
      tx.update(studentRef, update);
      tx.set(
        progressRef,
        {
          stemCreditedActivityIds: [...creditedIds, cleanActivityId],
        },
        { merge: true }
      );

      return {
        success: true,
        stemCount: Number(update.stemCount ?? student.stemCount ?? 0),
        badgeAwarded: newBadges.length > 0,
        xpAwarded,
      };
    });
  } catch (e: any) {
    console.error('recordVerifiedStemCompletionOnServer failed:', e?.message);
    return {
      success: false,
      error: 'Could not record verified STEM completion.',
    };
  }
}

export async function awardActivityXpAction(
  studentId: string,
  xpAmount: number,
  activityName?: string,
  badgeId?: string,
  deps?: GamificationTestDeps
): Promise<{ success: boolean; awarded?: number; error?: string }> {
  const requested = Math.floor(Number(xpAmount));
  if (
    !studentId ||
    typeof studentId !== 'string' ||
    !Number.isFinite(requested) ||
    requested <= 0
  ) {
    return { success: false, error: 'Invalid XP amount.' };
  }

  const user =
    deps && 'user' in deps ? deps.user : await getSessionUser();
  if (!user) {
    return { success: false, error: 'Not signed in.' };
  }

  try {
    const ctx = await loadCaller(user, deps);
    const db = deps?.db ?? getAdminDb();
    const ref = db.collection('students').doc(studentId);

    return await db.runTransaction(async (t) => {
      const snap = await t.get(ref);
      if (!snap.exists) {
        return { success: false, error: 'Student not found.' };
      }

      const student: any = snap.data() || {};
      const relation = relationTo(ctx, student, studentId);

      if (relation === 'none') {
        return {
          success: false,
          error: 'Not authorized.',
        };
      }

      if (relation === 'self') {
        return {
          success: false,
          error: 'Student XP must be awarded through a verified activity.',
        };
      }

      if (!ctx.canAwardXp) {
        return {
          success: false,
          error: 'Not authorized to award student XP.',
        };
      }

      const amount = Math.min(requested, MAX_XP_PER_ACTIVITY);
      const update: Record<string, any> = {};

      if (badgeId) {
        const cat = BADGE_CATALOG.find((b) => b.id === badgeId);
        if (cat) {
          const existingBadges: any[] = Array.isArray(student.earnedBadges)
            ? student.earnedBadges
            : [];
          update.earnedBadges = [
            ...existingBadges,
            {
              id: `${cat.id}_${Date.now()}`,
              title: cat.title,
              category: cat.category,
              unlockedAt: new Date().toISOString(),
              xpAwarded: cat.xpReward || amount,
            },
          ];
        }
      }

      const currentPoints = Number(student.totalPoints || 0);
      if (!Number.isFinite(currentPoints) || currentPoints < 0) {
        throw new Error('Corrupted student totalPoints counter.');
      }

      if (amount > 0) {
        update.totalPoints = currentPoints + amount;
      }
      update.lastGamificationUpdate = new Date().toISOString();
      t.update(ref, update);
      return { success: true, awarded: amount };
    });
  } catch (e: any) {
    console.error('awardActivityXpAction failed:', e?.message);
    return { success: false, error: 'Could not award XP.' };
  }
}
