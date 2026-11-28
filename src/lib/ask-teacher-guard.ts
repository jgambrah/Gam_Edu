import { getAdminAuth, getAdminDb } from '@/lib/firebaseAdmin';
import { evaluateStudentEnrichmentAccess } from '@/lib/student-enrichment-release';

/**
 * Server-side authorisation and shared spending cap for the Ask Teacher (Gemini) endpoint.
 *
 *  - Authentication alone is not authorisation: the caller must belong to a school and, while Student Enrichment is
 *    Under Construction, hold one of the release-gate staff roles (the client gate is a UX control, not a security one).
 *  - The daily cap is stored in Firestore so it holds ACROSS serverless instances. One small transaction is made only
 *    when an AI call is actually about to be paid for (never for curated FAQ or safeguarding answers).
 *  - If the cap cannot be checked (Firestore unavailable) the AI call is refused: fail closed protects the budget.
 */

export interface AskCaller {
  uid: string;
  role: string | null;
  schoolId: string | null;
}

const PROFILE_TTL_MS = 5 * 60 * 1000;
const profileCache = new Map<string, { value: AskCaller; expiresAt: number }>();

const DIRECTOR_LIKE = new Set(['director', 'super_admin', 'super admin', 'superadmin', 'owner']);
const ADMIN_LIKE = new Set(['administrator', 'admin', 'school_admin', 'principal', 'headmaster', 'headmistress', 'head teacher']);

/** Maps the many role spellings in use onto the three roles the release gate understands. */
export function canonicalEnrichmentRole(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const r = String(raw).trim().toLowerCase();
  if (DIRECTOR_LIKE.has(r)) return 'Director';
  if (ADMIN_LIKE.has(r)) return 'Administrator';
  if (r === 'teacher') return 'Teacher';
  return String(raw).trim();
}

/** Verifies the bearer token and resolves the caller's role and school (token claims first, then user documents). */
export async function authenticateCaller(req: Request): Promise<AskCaller | null> {
  const header = req.headers.get('Authorization') || '';
  if (!header.startsWith('Bearer ')) return null;
  let decoded: any;
  try {
    decoded = await getAdminAuth().verifyIdToken(header.slice(7));
  } catch {
    return null;
  }
  const uid: string | undefined = decoded?.uid;
  if (!uid) return null;

  const cached = profileCache.get(uid);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  let role: string | null = typeof decoded.role === 'string' ? decoded.role : null;
  let schoolId: string | null = typeof decoded.schoolId === 'string' ? decoded.schoolId : null;
  if (!role || !schoolId) {
    try {
      const db = getAdminDb();
      const [userSnap, staffSnap] = await Promise.all([db.collection('users').doc(uid).get(), db.collection('staff').doc(uid).get()]);
      const user: any = userSnap.exists ? userSnap.data() : null;
      const staff: any = staffSnap.exists ? staffSnap.data() : null;
      role = role || staff?.role || user?.role || null;
      schoolId = schoolId || staff?.schoolId || user?.schoolId || null;
    } catch {
      // cannot establish the profile: treated as unauthorised below (no role / school)
    }
  }
  const value: AskCaller = { uid, role, schoolId };
  profileCache.set(uid, { value, expiresAt: Date.now() + PROFILE_TTL_MS });
  if (profileCache.size > 5000) {
    const now = Date.now();
    for (const [k, v] of profileCache) if (v.expiresAt < now) profileCache.delete(k);
  }
  return value;
}

export type AskAccessDecision = { allowed: true } | { allowed: false; reason: 'no-school' | 'restricted-under-construction' };

/** May this caller use Ask Teacher right now? Mirrors the Student Enrichment release gate on the server. */
export function mayUseAskTeacher(caller: AskCaller): AskAccessDecision {
  const role = canonicalEnrichmentRole(caller.role);
  const isDirector = role === 'Director';
  if (!isDirector && !caller.schoolId) return { allowed: false, reason: 'no-school' };
  const decision = evaluateStudentEnrichmentAccess({ role, isAuthenticated: true });
  return decision.allowed ? { allowed: true } : { allowed: false, reason: 'restricted-under-construction' };
}

export const ASK_TEACHER_CAPS = {
  perUserPerDay: () => Number(process.env.ASK_TEACHER_USER_DAILY_CAP) || 30,
  perSchoolPerDay: () => Number(process.env.ASK_TEACHER_SCHOOL_DAILY_CAP) || 1000,
};

export type ReserveResult = { ok: true } | { ok: false; reason: 'user-cap' | 'school-cap' | 'unavailable' };

/** Atomically counts one paid AI call against the user's and school's daily caps (shared across all instances). */
export async function reserveSharedAiCall(caller: AskCaller, now: Date = new Date(), dbOverride?: any): Promise<ReserveResult> {
  const day = now.toISOString().slice(0, 10);
  try {
    const db = dbOverride ?? getAdminDb();
    const userRef = db.collection('askTeacherUsage').doc(`u_${caller.uid}_${day}`);
    const schoolRef = caller.schoolId ? db.collection('askTeacherUsage').doc(`s_${caller.schoolId}_${day}`) : null;
    const userCap = ASK_TEACHER_CAPS.perUserPerDay();
    const schoolCap = ASK_TEACHER_CAPS.perSchoolPerDay();

    return await db.runTransaction(async (tx: any) => {
      const [uSnap, sSnap] = await Promise.all([tx.get(userRef), schoolRef ? tx.get(schoolRef) : Promise.resolve(null)]);
      const uCount = uSnap.exists ? Number(uSnap.data()?.count) || 0 : 0;
      const sCount = sSnap && sSnap.exists ? Number(sSnap.data()?.count) || 0 : 0;
      if (uCount >= userCap) return { ok: false as const, reason: 'user-cap' as const };
      if (schoolRef && sCount >= schoolCap) return { ok: false as const, reason: 'school-cap' as const };
      tx.set(userRef, { count: uCount + 1, day, uid: caller.uid, updatedAt: now.toISOString() }, { merge: true });
      if (schoolRef) tx.set(schoolRef, { count: sCount + 1, day, schoolId: caller.schoolId, updatedAt: now.toISOString() }, { merge: true });
      return { ok: true as const };
    });
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}

/** Test hook. */
export function __clearAskProfileCache() {
  profileCache.clear();
}
