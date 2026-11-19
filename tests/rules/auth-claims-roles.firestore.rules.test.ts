/**
 * Firestore rules — Custom Auth Claims (`{ role, schoolId }`) fast-path vs Firestore fallback (Task 5).
 *
 * Verifies in the real Firebase Firestore Emulator across all four primary school roles
 * (`Teacher`, `Director`, `Student`, `Parent`):
 *   1. With custom claims `{ role, schoolId }` set (and NO `staff`/`users`/`students` profile docs seeded,
 *      proving `firestore.rules` short-circuits with 0 profile lookup reads!), each role gets its exact
 *      expected permissions and cross-school / privilege boundaries hold.
 *   2. Without custom claims (flag off / pre-sync users), the Firestore document fallback behaves identically.
 *
 * Run:  npm run test:rules
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { assertSucceeds, assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, query, where } from 'firebase/firestore';
import { createEnv, readRules, SCHOOL_A, SCHOOL_B } from './helpers';

let env: RulesTestEnvironment;

const seed = (path: string, data: Record<string, any>) =>
  env.withSecurityRulesDisabled(async (ctx: any) => {
    await setDoc(doc(ctx.firestore(), path), data);
  });

beforeAll(async () => {
  env = await createEnv('demo-gam-edu-auth-claims', { firestore: readRules('firestore.rules') });
});

afterAll(async () => {
  await env?.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
  await seed('classes/jhs1', { schoolId: SCHOOL_A, name: 'JHS 1', teacherId: 'claimTeacher' });
  await seed('subjects/math', { schoolId: SCHOOL_A, name: 'Mathematics' });
  await seed('assessments/m1', {
    schoolId: SCHOOL_A,
    classId: 'jhs1',
    subjectId: 'math',
    studentId: 'claimStudent',
    termId: '2025-2026_T1',
    academicYear: '2025-2026',
    term: 'First Term',
    assessmentName: 'Test 1',
    assessmentType: 'Class Exercise (CA)',
    score: 18,
    maxScore: 20,
  });
  await seed('report-cards/rc_pub', {
    schoolId: SCHOOL_A,
    classId: 'jhs1',
    studentId: 'claimStudent',
    academicYear: '2025-2026',
    term: 'First Term',
    status: 'Published',
  });
  await seed('report-cards/rc_draft', {
    schoolId: SCHOOL_A,
    classId: 'jhs1',
    studentId: 'claimStudent',
    academicYear: '2025-2026',
    term: 'First Term',
    status: 'Draft',
  });
  await seed(`academic_report_snapshots/${SCHOOL_A}_snap1`, {
    schoolId: SCHOOL_A,
    calcVersion: 2,
    classId: 'jhs1',
  });
});

describe('Custom Claims ({ role, schoolId }) fast-path — 0 profile lookup docs seeded', () => {
  const ctxWithClaims = (uid: string, role: string, schoolId: string) =>
    env.authenticatedContext(uid, { email: `${uid}@test.example`, role, schoolId }).firestore();

  it('Director with custom claims reads/writes assessments, publishes report cards, and writes Master List snapshots without staff/users docs', async () => {
    const db = ctxWithClaims('claimDirector', 'Director', SCHOOL_A);
    await assertSucceeds(getDocs(query(collection(db, 'assessments'), where('schoolId', '==', SCHOOL_A))));
    await assertSucceeds(updateDoc(doc(db, 'report-cards/rc_draft'), {
      status: 'Published',
      headmasterName: 'Head of School',
      digitalFingerprint: 'AUTH-1234',
    }));
    await assertSucceeds(setDoc(doc(db, `academic_report_snapshots/${SCHOOL_A}_snap2`), {
      schoolId: SCHOOL_A,
      calcVersion: 2,
    }));
    // Cross-school blocked
    await assertFails(setDoc(doc(db, `academic_report_snapshots/${SCHOOL_B}_snap2`), {
      schoolId: SCHOOL_B,
      calcVersion: 2,
    }));
  });

  it('Teacher with custom claims reads/writes marks & draft cards and reads snapshots, but cannot publish cards or write snapshots', async () => {
    const db = ctxWithClaims('claimTeacher', 'Teacher', SCHOOL_A);
    await assertSucceeds(getDocs(query(collection(db, 'assessments'), where('schoolId', '==', SCHOOL_A))));
    await assertSucceeds(setDoc(doc(db, 'assessments/m2'), {
      schoolId: SCHOOL_A,
      classId: 'jhs1',
      subjectId: 'math',
      studentId: 'claimStudent',
      score: 19,
      maxScore: 20,
    }));
    await assertSucceeds(getDoc(doc(db, `academic_report_snapshots/${SCHOOL_A}_snap1`)));
    await assertFails(setDoc(doc(db, `academic_report_snapshots/${SCHOOL_A}_snap3`), { schoolId: SCHOOL_A }));
    await assertFails(updateDoc(doc(db, 'report-cards/rc_draft'), { status: 'Published' }));
  });

  it('Student with custom claims reads own marks & published card, and is blocked from classmates, drafts, and writes', async () => {
    const db = ctxWithClaims('claimStudent', 'Student', SCHOOL_A);
    const snap = await assertSucceeds(
      getDocs(query(collection(db, 'assessments'), where('schoolId', '==', SCHOOL_A), where('studentId', '==', 'claimStudent')))
    );
    expect(snap.size).toBe(1);
    await assertSucceeds(getDoc(doc(db, 'report-cards/rc_pub')));
    await assertFails(getDoc(doc(db, 'report-cards/rc_draft')));
    await assertFails(getDocs(query(collection(db, 'assessments'), where('schoolId', '==', SCHOOL_A))));
    await assertFails(updateDoc(doc(db, 'assessments/m1'), { score: 20 }));
  });

  it('Parent with custom claims reads linked ward marks & published card, and is blocked from unlinked pupils and writes', async () => {
    // Only the parent->ward link field is needed (`parents/claimParent.studentIds`)
    await seed('parents/claimParent', { uid: 'claimParent', schoolId: SCHOOL_A, studentIds: ['claimStudent'] });
    const db = ctxWithClaims('claimParent', 'Parent', SCHOOL_A);
    await assertSucceeds(
      getDocs(query(collection(db, 'assessments'), where('schoolId', '==', SCHOOL_A), where('studentId', '==', 'claimStudent')))
    );
    await assertSucceeds(getDoc(doc(db, 'report-cards/rc_pub')));
    await assertFails(getDoc(doc(db, 'report-cards/rc_draft')));
    await assertFails(updateDoc(doc(db, 'assessments/m1'), { score: 20 }));
  });
});

describe('Firestore profile fallback (no custom claims on token — flag disabled)', () => {
  const ctxNoClaims = (uid: string) =>
    env.authenticatedContext(uid, { email: `${uid}@test.example` }).firestore();

  it('Director, Teacher, Student, and Parent still work identically via Firestore profile docs when claims are absent', async () => {
    await seed('staff/fbDirector', { uid: 'fbDirector', role: 'Director', schoolId: SCHOOL_A });
    await seed('staff/fbTeacher', { uid: 'fbTeacher', role: 'Teacher', schoolId: SCHOOL_A });
    await seed('students/claimStudent', { uid: 'claimStudent', schoolId: SCHOOL_A });
    await seed('parents/fbParent', { uid: 'fbParent', schoolId: SCHOOL_A, studentIds: ['claimStudent'] });

    await assertSucceeds(updateDoc(doc(ctxNoClaims('fbDirector'), 'report-cards/rc_draft'), { headmasterComment: 'Well done' }));
    await assertSucceeds(getDoc(doc(ctxNoClaims('fbTeacher'), `academic_report_snapshots/${SCHOOL_A}_snap1`)));
    await assertSucceeds(getDoc(doc(ctxNoClaims('claimStudent'), 'report-cards/rc_pub')));
    await assertSucceeds(getDoc(doc(ctxNoClaims('fbParent'), 'report-cards/rc_pub')));
  });
});
