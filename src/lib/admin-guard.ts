import { getAdminAuth, getAdminDb } from '@/lib/firebaseAdmin';

/**
 * Server-side check for API routes that change money or term state.
 * Mirrors isAdmin() in firestore.rules: super admins, or a Director/Administrator/Principal… role on the
 * user's `staff/{uid}` or `users/{uid}` document (or token claim). When the user's document records a
 * schoolId, it must match the school being acted on.
 */

const SUPER_ADMIN_UIDS = new Set([
  'L4oE5XWweKRYrhtIXn6hB8IDHBC2',
  'gZxe3nMbGcQhNgEzkwEZwDBnkFR2',
  '7GVi5qCxC4YDnjKkjVwSjAYtQz73',
]);
const SUPER_ADMIN_EMAILS = new Set(['jamesgambrah@gmail.com', 'atampokaadongo@gmail.com']);
const ADMIN_ROLES = new Set([
  'director', 'administrator', 'admin', 'principal', 'headmaster', 'headmistress', 'head teacher', 'owner', 'super_admin',
]);

export class AuthError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

/** Verifies a Firebase ID token belongs to an administrator of `schoolId`. Throws AuthError otherwise. */
export async function verifySchoolAdminToken(idToken: string | undefined | null, schoolId: string): Promise<{ uid: string; name: string }> {
  if (!idToken) throw new AuthError('Sign in again: missing authorization token.', 401);
  if (!schoolId) throw new AuthError('Missing school.', 400);

  let decoded: any;
  try {
    decoded = await getAdminAuth().verifyIdToken(idToken);
  } catch {
    throw new AuthError('Your session has expired. Sign in again.', 401);
  }
  const uid: string = decoded.uid;
  const email = String(decoded.email || '').toLowerCase();
  const name = decoded.name || decoded.email || uid;

  if (SUPER_ADMIN_UIDS.has(uid) || SUPER_ADMIN_EMAILS.has(email) || decoded.role === 'super_admin') {
    return { uid, name };
  }

  const db = getAdminDb();
  const [staffSnap, userSnap] = await Promise.all([
    db.collection('staff').doc(uid).get(),
    db.collection('users').doc(uid).get(),
  ]);
  const staff: any = staffSnap.exists ? staffSnap.data() : null;
  const user: any = userSnap.exists ? userSnap.data() : null;

  const roles = [decoded.role, staff?.role, user?.role].filter(Boolean).map((r: string) => String(r).toLowerCase());
  if (!roles.some(r => ADMIN_ROLES.has(r))) {
    throw new AuthError('Only a school administrator can do this.', 403);
  }

  const schools = [staff?.schoolId, user?.schoolId].filter(Boolean);
  if (schools.length > 0 && !schools.includes(schoolId)) {
    throw new AuthError('You are not an administrator of this school.', 403);
  }
  return { uid, name };
}

/** For API routes: reads the `Authorization: Bearer <idToken>` header. */
export async function requireSchoolAdmin(req: Request, schoolId: string): Promise<{ uid: string; name: string }> {
  const header = req.headers.get('Authorization') || '';
  if (!header.startsWith('Bearer ')) throw new AuthError('Sign in again: missing authorization token.', 401);
  return verifySchoolAdminToken(header.slice(7), schoolId);
}

const STAFF_ROLES = new Set([
  ...Array.from(ADMIN_ROLES), 'super admin', 'school_admin', 'teacher', 'accountant', 'accounts officer', 'finance',
  'finance officer', 'bursar', 'cashier', 'secretary', 'receptionist', 'staff', 'registrar', 'admissions',
]);

/** Verifies a Firebase ID token belongs to a staff member of `schoolId` (teachers, finance, admin…). */
export async function verifySchoolStaffToken(idToken: string | undefined | null, schoolId: string): Promise<{ uid: string; name: string }> {
  if (!idToken) throw new AuthError('Sign in again: missing authorization token.', 401);
  if (!schoolId) throw new AuthError('Missing school.', 400);
  let decoded: any;
  try {
    decoded = await getAdminAuth().verifyIdToken(idToken);
  } catch {
    throw new AuthError('Your session has expired. Sign in again.', 401);
  }
  const uid: string = decoded.uid;
  const email = String(decoded.email || '').toLowerCase();
  const name = decoded.name || decoded.email || uid;
  if (SUPER_ADMIN_UIDS.has(uid) || SUPER_ADMIN_EMAILS.has(email) || decoded.role === 'super_admin') return { uid, name };

  const db = getAdminDb();
  const [staffSnap, userSnap] = await Promise.all([db.collection('staff').doc(uid).get(), db.collection('users').doc(uid).get()]);
  const staff: any = staffSnap.exists ? staffSnap.data() : null;
  const user: any = userSnap.exists ? userSnap.data() : null;
  const roles = [decoded.role, staff?.role, user?.role].filter(Boolean).map((r: string) => String(r).toLowerCase());
  if (!staff && !roles.some(r => STAFF_ROLES.has(r))) throw new AuthError('Only school staff can do this.', 403);
  const schools = [staff?.schoolId, user?.schoolId].filter(Boolean);
  if (schools.length > 0 && !schools.includes(schoolId)) throw new AuthError('You are not staff of this school.', 403);
  return { uid, name };
}
