import { cookies } from 'next/headers';
import { getAdminAuth, getAdminDb } from '@/lib/firebaseAdmin';

/**
 * Who is calling a server action?
 *
 * Server actions are public HTTP endpoints: anyone can call them with any arguments. Most of the app's
 * actions take a `schoolId` argument, so before this guard existed anybody could, for example, spend any
 * school's AI credits. The browser now keeps a Firebase session cookie (set by /api/auth/session whenever
 * the signed-in user's token changes — see FirebaseProvider), and server actions read it here.
 */

export const SESSION_COOKIE = 'gam_session';
export const ID_TOKEN_COOKIE = 'gam_idt';

const SUPER_ADMIN_UIDS = new Set([
  'L4oE5XWweKRYrhtIXn6hB8IDHBC2',
  'gZxe3nMbGcQhNgEzkwEZwDBnkFR2',
  '7GVi5qCxC4YDnjKkjVwSjAYtQz73',
]);
const SUPER_ADMIN_EMAILS = new Set(['jamesgambrah@gmail.com', 'atampokaadongo@gmail.com']);
// Mirrors getUserSchoolId() in firestore.rules.
const HARDCODED_SCHOOL: Record<string, string> = { '7GVi5qCxC4YDnjKkjVwSjAYtQz73': 'oHr3BrGdK2eS5MQ5zmZU' };
const HARDCODED_SCHOOL_EMAILS: Record<string, string> = { 'atampokaadongo@gmail.com': 'oHr3BrGdK2eS5MQ5zmZU' };

export interface SessionUser {
  uid: string;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  claims: Record<string, any>;
}

export class SessionError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

/** The signed-in user for this request, or null. Never throws. */
export async function getSessionUser(): Promise<SessionUser | null> {
  let store: Awaited<ReturnType<typeof cookies>>;
  try {
    store = await cookies();
  } catch {
    return null; // not inside a request (e.g. a script)
  }
  const auth = getAdminAuth();
  let decoded: any = null;
  const session = store.get(SESSION_COOKIE)?.value;
  if (session) {
    try { decoded = await auth.verifySessionCookie(session); } catch { decoded = null; }
  }
  if (!decoded) {
    const idt = store.get(ID_TOKEN_COOKIE)?.value;
    if (idt) {
      try { decoded = await auth.verifyIdToken(idt); } catch { decoded = null; }
    }
  }
  if (!decoded?.uid) return null;
  const email = String(decoded.email || '').toLowerCase();
  return {
    uid: decoded.uid,
    email,
    name: decoded.name || decoded.email || decoded.uid,
    isSuperAdmin: SUPER_ADMIN_UIDS.has(decoded.uid) || SUPER_ADMIN_EMAILS.has(email) || decoded.role === 'super_admin',
    claims: decoded,
  };
}

/** Throws SessionError(401) when nobody is signed in. */
export async function requireSignedIn(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new SessionError('Your session has expired. Please refresh the page or sign in again.', 401);
  return user;
}

// Small in-memory cache so busy pages do not re-read the user's profile documents on every AI call.
const membershipCache = new Map<string, { schools: string[]; at: number }>();
const MEMBERSHIP_TTL_MS = 5 * 60 * 1000;

/** Every school the user belongs to (staff, teacher, student, parent…). */
export async function schoolsOfUser(user: SessionUser): Promise<string[]> {
  const cached = membershipCache.get(user.uid);
  if (cached && Date.now() - cached.at < MEMBERSHIP_TTL_MS) return cached.schools;

  const schools = new Set<string>();
  if (user.claims?.schoolId) schools.add(String(user.claims.schoolId));
  if (HARDCODED_SCHOOL[user.uid]) schools.add(HARDCODED_SCHOOL[user.uid]);
  if (HARDCODED_SCHOOL_EMAILS[user.email]) schools.add(HARDCODED_SCHOOL_EMAILS[user.email]);

  const db = getAdminDb();
  const [staff, usr, student, parent, studentByUid] = await Promise.all([
    db.collection('staff').doc(user.uid).get(),
    db.collection('users').doc(user.uid).get(),
    db.collection('students').doc(user.uid).get(),
    db.collection('parents').doc(user.uid).get(),
    db.collection('students').where('uid', '==', user.uid).limit(3).get(),
  ]);
  [staff, usr, student, parent].forEach(s => {
    const d: any = s.exists ? s.data() : null;
    if (d?.schoolId) schools.add(String(d.schoolId));
  });
  studentByUid.docs.forEach(d => { const s = d.data()?.schoolId; if (s) schools.add(String(s)); });

  const list = Array.from(schools);
  membershipCache.set(user.uid, { schools: list, at: Date.now() });
  return list;
}

/** The caller must be signed in and belong to `schoolId` (or be a platform super admin). */
export async function requireSchoolMember(schoolId: string): Promise<SessionUser> {
  if (!schoolId) throw new SessionError('Missing school.', 400);
  const user = await requireSignedIn();
  if (user.isSuperAdmin) return user;
  const schools = await schoolsOfUser(user);
  if (!schools.includes(schoolId)) {
    throw new SessionError('You can only use your own school\'s account.', 403);
  }
  return user;
}

/** For 'use server' AI flows that do not take a school: just require a signed-in user. */
export async function requireSignedInAction(): Promise<void> {
  await requireSignedIn();
}
