/**
 * Custom Auth Claims Sync (`{ role, schoolId }`) — gated behind `ENABLE_CUSTOM_CLAIMS === 'true'`.
 *
 * Why: Without custom claims on the Firebase ID token, every Firestore request evaluates `exists()` + `get()`
 * against `staff/{uid}`, `users/{uid}`, `students/{uid}`, and `parents/{uid}` inside `firestore.rules`
 * (2-4 billed reads per request). When `ENABLE_CUSTOM_CLAIMS=true`, custom claims `{ role, schoolId }` are
 * stamped on login and whenever a profile document changes, dropping rule lookup cost to 0 reads while
 * keeping the full Firestore document fallback in `firestore.rules` for accounts without claims.
 */
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) initializeApp();

const MERCY_ADMIN_UID = '7GVi5qCxC4YDnjKkjVwSjAYtQz73';
const MERCY_ADMIN_EMAIL = 'atampokaadongo@gmail.com';
const MERCY_SCHOOL_ID = 'oHr3BrGdK2eS5MQ5zmZU';

export function isCustomClaimsEnabled(): boolean {
  return (
    process.env.ENABLE_CUSTOM_CLAIMS === 'true' ||
    process.env.NEXT_PUBLIC_ENABLE_CUSTOM_CLAIMS === 'true'
  );
}

/**
 * Resolves `{ role, schoolId }` using the exact same precedence as `getUserRole()` & `getUserSchoolId()`
 * in `firestore.rules` (`staff/{uid}` -> `users/{uid}` -> `students/{uid}` -> `parents/{uid}`).
 */
export async function resolveCanonicalClaimsForUid(
  store: any,
  uid: string,
  email?: string | null
): Promise<{ role: string | null; schoolId: string | null; isStaff: boolean }> {
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (uid === MERCY_ADMIN_UID || cleanEmail === MERCY_ADMIN_EMAIL) {
    return { role: 'Director', schoolId: MERCY_SCHOOL_ID, isStaff: true };
  }

  const [staffSnap, userSnap, studentSnap, parentSnap] = await Promise.all([
    store.collection('staff').doc(uid).get(),
    store.collection('users').doc(uid).get(),
    store.collection('students').doc(uid).get(),
    store.collection('parents').doc(uid).get(),
  ]);

  const staff = staffSnap.exists ? (staffSnap.data() as any) : null;
  const user = userSnap.exists ? (userSnap.data() as any) : null;
  const student = studentSnap.exists ? (studentSnap.data() as any) : null;
  const parent = parentSnap.exists ? (parentSnap.data() as any) : null;

  const schoolId =
    (staff?.schoolId ? String(staff.schoolId) : '') ||
    (user?.schoolId ? String(user.schoolId) : '') ||
    (student?.schoolId ? String(student.schoolId) : '') ||
    (parent?.schoolId ? String(parent.schoolId) : '') ||
    null;

  const role =
    (staff?.role ? String(staff.role) : '') ||
    (user?.role ? String(user.role) : '') ||
    (student ? 'Student' : '') ||
    (parent ? 'Parent' : '') ||
    null;

  return { role, schoolId, isStaff: Boolean(staff) };
}

/**
 * Stamps `{ role, schoolId, isStaff }` onto Firebase Auth custom claims while preserving all unrelated claims
 * (`story_publisher`, `super_admin`, etc.). Never overwrites or clears `role === 'super_admin'`.
 */
export async function syncUserCustomClaims(params: {
  uid: string;
  auth?: any;
  store?: any;
  forceWhenFlagOff?: boolean;
}): Promise<{
  enabled: boolean;
  updated: boolean;
  role: string | null;
  schoolId: string | null;
  isStaff?: boolean;
}> {
  const enabled = params.forceWhenFlagOff === true || isCustomClaimsEnabled();
  if (!enabled) {
    return { enabled: false, updated: false, role: null, schoolId: null };
  }

  const auth = params.auth || getAuth();
  const store = params.store || getFirestore();
  const authUser = await auth.getUser(params.uid);
  const existingClaims = { ...(authUser.customClaims || {}) };

  const resolved = await resolveCanonicalClaimsForUid(store, params.uid, authUser.email);
  // R5-1: Never demote or overwrite an account holding `role: 'super_admin'`
  const effectiveRole = existingClaims.role === 'super_admin' ? 'super_admin' : resolved.role;
  const effectiveSchoolId = resolved.schoolId ?? (existingClaims.role === 'super_admin' ? (existingClaims.schoolId ?? null) : null);
  const effectiveIsStaff = existingClaims.role === 'super_admin' ? true : resolved.isStaff;

  const prevRole = existingClaims.role ?? null;
  const prevSchoolId = existingClaims.schoolId ?? null;
  const prevIsStaff = typeof existingClaims.isStaff === 'boolean' ? existingClaims.isStaff : null;
  if (prevRole === effectiveRole && prevSchoolId === effectiveSchoolId && prevIsStaff === effectiveIsStaff) {
    return { enabled: true, updated: false, role: effectiveRole, schoolId: effectiveSchoolId, isStaff: effectiveIsStaff };
  }

  const nextClaims: Record<string, any> = { ...existingClaims, isStaff: effectiveIsStaff };
  if (effectiveRole) nextClaims.role = effectiveRole;
  else delete nextClaims.role;

  if (effectiveSchoolId) nextClaims.schoolId = effectiveSchoolId;
  else delete nextClaims.schoolId;

  await auth.setCustomUserClaims(params.uid, nextClaims);
  return { enabled: true, updated: true, role: effectiveRole, schoolId: effectiveSchoolId, isStaff: effectiveIsStaff };
}

function didClaimFieldsChange(before: any | null, after: any | null): boolean {
  if (!before || !after) return true;
  return String(before.role || '') !== String(after.role || '') ||
    String(before.schoolId || '') !== String(after.schoolId || '');
}

async function handleProfileClaimTrigger(uid: string, before: any | null, after: any | null): Promise<void> {
  if (!isCustomClaimsEnabled()) return;
  if (!uid || !didClaimFieldsChange(before, after)) return;
  try {
    await syncUserCustomClaims({ uid });
  } catch (err: any) {
    // Non-Auth placeholder roster docs (whose doc id is not a Firebase Auth UID) raise auth/user-not-found — safe to ignore
    if (err?.code === 'auth/user-not-found') return;
    console.warn('[authClaims] Failed to sync claims for', uid, err?.message);
  }
}

export const onStaffWriteSyncClaims = onDocumentWritten('staff/{uid}', async (event) => {
  const before = event.data?.before?.exists ? event.data.before.data() : null;
  const after = event.data?.after?.exists ? event.data.after.data() : null;
  await handleProfileClaimTrigger(event.params.uid, before, after);
});

export const onUserDocWriteSyncClaims = onDocumentWritten('users/{uid}', async (event) => {
  const before = event.data?.before?.exists ? event.data.before.data() : null;
  const after = event.data?.after?.exists ? event.data.after.data() : null;
  await handleProfileClaimTrigger(event.params.uid, before, after);
});

export const onStudentDocWriteSyncClaims = onDocumentWritten('students/{uid}', async (event) => {
  const before = event.data?.before?.exists ? event.data.before.data() : null;
  const after = event.data?.after?.exists ? event.data.after.data() : null;
  await handleProfileClaimTrigger(event.params.uid, before, after);
});

export const onParentDocWriteSyncClaims = onDocumentWritten('parents/{uid}', async (event) => {
  const before = event.data?.before?.exists ? event.data.before.data() : null;
  const after = event.data?.after?.exists ? event.data.after.data() : null;
  await handleProfileClaimTrigger(event.params.uid, before, after);
});
