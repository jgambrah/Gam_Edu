'use server';

import { getAdminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';
import { getSessionUser, schoolsOfUser, type SessionUser } from '@/lib/session-guard';
import { BADGE_CATALOG, computeBadgeUpdate, type BadgeCatalogItem, type GamificationEvent } from '@/lib/badge-rules';

/**
 * XP and badges, awarded on the server.
 *
 * Before, the browser wrote `totalPoints` / `earnedBadges` straight into the student's record, so anyone
 * signed in could give any student unlimited XP. Now:
 *  - school staff (teachers, admins…) may record any event for students of their own school;
 *  - a student (or their parent) may only record learning activities for that student, with a limit per
 *    activity and per day;
 *  - attendance streaks and manual awards can only come from staff.
 * firestore.rules stops browsers changing these fields directly.
 */

const SELF_EVENTS = new Set(['QUIZ_SUBMITTED', 'LIBRARY_BOOK_RETURNED', 'STEM_CHALLENGE_COMPLETED']);
const MAX_XP_PER_ACTIVITY = 150;
const MAX_SELF_XP_PER_DAY = 1000;
const NON_STAFF_ROLES = new Set(['student', 'parent', 'guardian']);

type Relation = 'staff' | 'self' | 'none';

interface CallerContext {
  user: SessionUser;
  isStaff: boolean;
  schools: string[];
  parentStudentIds: string[];
}

async function loadCaller(user: SessionUser): Promise<CallerContext> {
  const db = getAdminDb();
  const [staffSnap, userSnap, parentSnap, schools] = await Promise.all([
    db.collection('staff').doc(user.uid).get(),
    db.collection('users').doc(user.uid).get(),
    db.collection('parents').doc(user.uid).get(),
    schoolsOfUser(user),
  ]);
  const role = String((userSnap.data() as any)?.role || user.claims?.role || '').toLowerCase();
  const parent: any = parentSnap.exists ? parentSnap.data() : null;
  return {
    user,
    isStaff: user.isSuperAdmin || staffSnap.exists || (userSnap.exists && role !== '' && !NON_STAFF_ROLES.has(role)),
    schools,
    parentStudentIds: Array.isArray(parent?.studentIds) ? parent.studentIds : [],
  };
}

function relationTo(ctx: CallerContext, student: any, studentDocId: string): Relation {
  const { user } = ctx;
  if (user.isSuperAdmin) return 'staff';
  if (student?.uid === user.uid || studentDocId === user.uid) return 'self';
  if (student?.parentId === user.uid || (Array.isArray(student?.parentIds) && student.parentIds.includes(user.uid))) return 'self';
  if (ctx.parentStudentIds.includes(studentDocId) || (student?.uid && ctx.parentStudentIds.includes(student.uid))) return 'self';
  if (!ctx.isStaff) return 'none';
  return !student?.schoolId || ctx.schools.includes(student.schoolId) ? 'staff' : 'none';
}

function badgeEntries(badges: BadgeCatalogItem[]) {
  const now = Date.now();
  let xp = 0;
  const entries = badges.map((b, idx) => {
    xp += b.xpReward;
    return { id: `${b.id}_${now}_${idx}`, title: b.title, category: b.category, unlockedAt: new Date().toISOString(), xpAwarded: b.xpReward };
  });
  return { entries, xp };
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

async function applyEvent(ctx: CallerContext, studentId: string, event: GamificationEvent): Promise<{ success: boolean; error?: string }> {
  if (!studentId || !event?.type) return { success: false, error: 'Missing student or event.' };
  try {
    const db = getAdminDb();
    const ref = db.collection('students').doc(studentId);
    return await db.runTransaction(async t => {
      const snap = await t.get(ref);
      if (!snap.exists) return { success: false, error: 'Student not found.' };
      const student: any = snap.data();
      const relation = relationTo(ctx, student, studentId);
      if (relation === 'none') return { success: false, error: 'Not allowed.' };
      if (relation === 'self' && !SELF_EVENTS.has(event.type)) return { success: false, error: 'Only school staff can record this.' };

      const { fields, newBadges } = computeBadgeUpdate(student, event);
      const update: Record<string, any> = { ...fields };
      if (newBadges.length > 0) {
        const { entries, xp } = badgeEntries(newBadges);
        update.earnedBadges = FieldValue.arrayUnion(...entries);
        update.totalPoints = FieldValue.increment(xp);
      }
      if (Object.keys(update).length === 0) return { success: true };
      update.lastGamificationUpdate = FieldValue.serverTimestamp();
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
  event: GamificationEvent
): Promise<{ success: boolean; error?: string }> {
  const [res] = await recordGamificationEventsAction([{ studentId, event }]);
  return res;
}

/** Several events in one round trip (the attendance register records one per student). */
export async function recordGamificationEventsAction(
  items: { studentId: string; event: GamificationEvent }[]
): Promise<{ success: boolean; error?: string }[]> {
  const list = Array.isArray(items) ? items.slice(0, 500) : [];
  if (list.length === 0) return [];
  const user = await getSessionUser();
  if (!user) return list.map(() => ({ success: false, error: 'Not signed in.' }));
  const ctx = await loadCaller(user);
  const results: { success: boolean; error?: string }[] = [];
  // Small groups in parallel: quick for a class register, gentle on Firestore.
  for (let i = 0; i < list.length; i += 10) {
    const chunk = list.slice(i, i + 10);
    results.push(...await Promise.all(chunk.map(it => applyEvent(ctx, it?.studentId, it?.event))));
  }
  return results;
}

export async function awardActivityXpAction(
  studentId: string,
  xpAmount: number,
  activityName?: string,
  badgeId?: string
): Promise<{ success: boolean; awarded?: number; error?: string }> {
  const requested = Math.floor(Number(xpAmount));
  if (!studentId || !Number.isFinite(requested) || requested <= 0) return { success: false, error: 'Invalid XP amount.' };
  const user = await getSessionUser();
  if (!user) return { success: false, error: 'Not signed in.' };
  try {
    const ctx = await loadCaller(user);
    const db = getAdminDb();
    const ref = db.collection('students').doc(studentId);
    return await db.runTransaction(async t => {
      const snap = await t.get(ref);
      if (!snap.exists) return { success: false, error: 'Student not found.' };
      const student: any = snap.data();
      const relation = relationTo(ctx, student, studentId);
      if (relation === 'none') return { success: false, error: 'Not allowed.' };

      let amount = Math.min(requested, MAX_XP_PER_ACTIVITY);
      const update: Record<string, any> = {};
      if (relation === 'self') {
        const day = today();
        const usedToday = student.xpEarnedDay === day ? Number(student.xpEarnedToday || 0) : 0;
        amount = Math.max(0, Math.min(amount, MAX_SELF_XP_PER_DAY - usedToday));
        update.xpEarnedDay = day;
        update.xpEarnedToday = usedToday + amount;
      }

      if (badgeId) {
        const cat = BADGE_CATALOG.find(b => b.id === badgeId);
        const existing: any[] = Array.isArray(student.earnedBadges) ? student.earnedBadges : [];
        const already = existing.some(b => b?.id === badgeId || (typeof b?.id === 'string' && b.id.startsWith(`${badgeId}_`)));
        // Students earn a catalogue badge once; staff may award again.
        if (cat && (relation === 'staff' || !already)) {
          update.earnedBadges = FieldValue.arrayUnion({
            id: `${cat.id}_${Date.now()}`, title: cat.title, category: cat.category,
            unlockedAt: new Date().toISOString(), xpAwarded: cat.xpReward || amount,
          });
        }
      }

      if (amount <= 0 && !update.earnedBadges) {
        return { success: false, awarded: 0, error: 'Daily XP limit reached.' };
      }
      if (amount > 0) update.totalPoints = FieldValue.increment(amount);
      update.lastGamificationUpdate = FieldValue.serverTimestamp();
      t.update(ref, update);
      return { success: true, awarded: amount };
    });
  } catch (e: any) {
    console.error('awardActivityXpAction failed:', e?.message);
    return { success: false, error: 'Could not award XP.' };
  }
}
