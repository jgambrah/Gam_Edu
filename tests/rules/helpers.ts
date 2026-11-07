import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc } from 'firebase/firestore';

export const root = (p: string) => resolve(__dirname, '../..', p);
export const readRules = (p: string) => readFileSync(root(p), 'utf8');

export const SCHOOL_A = 'schoolA';
export const SCHOOL_B = 'schoolB';

/** Uids hard-coded as platform super admins in firestore.rules / storage.rules. */
export const SUPER_ADMIN_UID = 'L4oE5XWweKRYrhtIXn6hB8IDHBC2';

/**
 * One person in the cast. `users`, `staff`, `students`, `parents` say which Firestore profile documents exist for them
 * (that is what school membership is decided from). `claims` are custom token claims — the rules must NOT trust them.
 */
export interface Actor {
  uid: string;
  users?: { role: string; schoolId: string };
  staff?: { role: string; schoolId: string };
  students?: { schoolId: string };
  parents?: { schoolId: string };
  claims?: Record<string, any>;
}

const both = (role: string, schoolId: string): Pick<Actor, 'users' | 'staff'> => ({
  users: { role, schoolId },
  staff: { role, schoolId },
});

export const cast = {
  // ---- School A ----
  adminA: { uid: 'adminA', ...both('Director', SCHOOL_A) },
  registrarA: { uid: 'registrarA', ...both('Registrar', SCHOOL_A) },
  teacherA: { uid: 'teacherA', ...both('Teacher', SCHOOL_A) },
  teacherA2: { uid: 'teacherA2', ...both('Teacher', SCHOOL_A) },
  cookA: { uid: 'cookA', ...both('Cook', SCHOOL_A) }, // staff, but not a teacher or an admin
  pupilA: { uid: 'pupilA', users: { role: 'Student', schoolId: SCHOOL_A }, students: { schoolId: SCHOOL_A } },
  pupilA2: { uid: 'pupilA2', users: { role: 'Student', schoolId: SCHOOL_A }, students: { schoolId: SCHOOL_A } },
  parentA: { uid: 'parentA', users: { role: 'Parent', schoolId: SCHOOL_A }, parents: { schoolId: SCHOOL_A } },
  // Older accounts that only have a role-specific profile document and no users/{uid} document.
  staffOnlyA: { uid: 'staffOnlyA', staff: { role: 'Teacher', schoolId: SCHOOL_A } },
  studentsDocOnlyA: { uid: 'studentsDocOnlyA', students: { schoolId: SCHOOL_A } },

  // ---- School B ----
  adminB: { uid: 'adminB', ...both('Director', SCHOOL_B) },
  teacherB: { uid: 'teacherB', ...both('Teacher', SCHOOL_B) },
  pupilB: { uid: 'pupilB', users: { role: 'Student', schoolId: SCHOOL_B }, students: { schoolId: SCHOOL_B } },
  parentB: { uid: 'parentB', users: { role: 'Parent', schoolId: SCHOOL_B }, parents: { schoolId: SCHOOL_B } },

  // ---- Platform ----
  superAdmin: { uid: SUPER_ADMIN_UID },

  // ---- Awkward claim situations ----
  // Claims the wrong way round: token says school A, but the profile documents say school B.
  staleClaimUser: { uid: 'staleClaimUser', ...both('Teacher', SCHOOL_B), claims: { schoolId: SCHOOL_A, role: 'Teacher' } },
  // A token that says "teacher at school A" with no profile documents at all: nothing to verify it against.
  claimOnlyUser: { uid: 'claimOnlyUser', claims: { schoolId: SCHOOL_A, role: 'Teacher' } },
  // Signed in, no school anywhere.
  noDocsUser: { uid: 'noDocsUser' },
  // A forged-looking claim: the token claims to be a super admin by *role name* only.
  fakeSuperClaim: { uid: 'fakeSuperClaim', claims: { role: 'Super Admin' } },
} satisfies Record<string, Actor>;

export type ActorName = keyof typeof cast | 'anon';

export async function createEnv(projectId: string, rules: { firestore?: string; storage?: string }) {
  return initializeTestEnvironment({
    projectId,
    ...(rules.firestore ? { firestore: { rules: rules.firestore } } : {}),
    ...(rules.storage ? { storage: { rules: rules.storage } } : {}),
  });
}

/** Write every actor's profile documents, and any extra documents, bypassing rules. */
export async function seedProfiles(env: RulesTestEnvironment, extraDocs: Record<string, any> = {}) {
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    for (const a of Object.values(cast) as Actor[]) {
      if (a.users) await setDoc(doc(db, 'users', a.uid), a.users);
      if (a.staff) await setDoc(doc(db, 'staff', a.uid), { uid: a.uid, ...a.staff });
      if (a.students) await setDoc(doc(db, 'students', a.uid), { uid: a.uid, ...a.students });
      if (a.parents) await setDoc(doc(db, 'parents', a.uid), { uid: a.uid, ...a.parents });
    }
    for (const [path, data] of Object.entries(extraDocs)) await setDoc(doc(db, path), data);
  });
}

/** An app context for a cast member (or an unauthenticated visitor). */
export function as(env: RulesTestEnvironment, who: ActorName) {
  if (who === 'anon') return env.unauthenticatedContext();
  const a = cast[who] as Actor;
  return env.authenticatedContext(a.uid, a.claims ?? {});
}
