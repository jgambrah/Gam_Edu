/**
 * Firestore Rules emulator test for batched daily billing & billingReconciliation.
 *
 * Verifies:
 *   1. A teacher-role account can commit a single writeBatch of 70 daily bills (35 canteen + 35 transport)
 *      without hitting Firestore Rules access-call limits.
 *   2. `billingReconciliation/{docId}` is readable by finance/admin roles (`isFinanceRole()`) in the same
 *      school, denied to teachers, and denied for all client writes.
 *
 * Requires Java 17+ and the Firestore Emulator (`npm run test:rules`).
 * Automatically skipped when `FIRESTORE_EMULATOR_HOST` is not set.
 */
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, writeBatch, Timestamp } from 'firebase/firestore';
import fs from 'node:fs';
import path from 'node:path';

const hasEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);

describe.skipIf(!hasEmulator)('Firestore Rules: Batched Daily Billing & billingReconciliation', () => {
  let testEnv: RulesTestEnvironment;
  const schoolId = 'school-mercy';
  const otherSchoolId = 'school-other';
  const dateStr = '2026-11-23';

  beforeAll(async () => {
    const rules = fs.readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8');
    testEnv = await initializeTestEnvironment({
      projectId: 'demo-gam-edu',
      firestore: { rules },
    });
  });

  afterAll(async () => {
    if (testEnv) await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await setDoc(doc(db, 'users', 'teacher-1'), { schoolId, role: 'Teacher' });
      await setDoc(doc(db, 'staff', 'teacher-1'), { schoolId, role: 'Teacher' });
      await setDoc(doc(db, 'users', 'accountant-1'), { schoolId, role: 'Accountant' });
      await setDoc(doc(db, 'staff', 'accountant-1'), { schoolId, role: 'Accountant' });
      await setDoc(doc(db, 'users', 'other-accountant'), { schoolId: otherSchoolId, role: 'Accountant' });
      await setDoc(doc(db, 'billingReconciliation', `${schoolId}_${dateStr}`), {
        schoolId,
        dateStr,
        expected: 291,
        existing: 291,
        created: 0,
        failed: 0,
      });
    });
  });

  it('allows a Teacher to create 70 daily bills in a single writeBatch', async () => {
    const teacherDb = testEnv.authenticatedContext('teacher-1').firestore();
    const batch = writeBatch(teacherDb);
    const dueDate = Timestamp.fromDate(new Date('2026-11-23T00:00:00.000Z'));

    for (let i = 1; i <= 35; i++) {
      const uid = `stu-${i}`;
      batch.set(doc(teacherDb, 'financialRecords', `canteen-${uid}-${dateStr}`), {
        schoolId,
        studentId: uid,
        studentName: `Student ${i}`,
        classId: 'grade-4-daisy',
        type: 'Canteen Fee (Daily)',
        description: 'Canteen - November 23rd, 2026',
        billedAmount: 9,
        amountPaid: 0,
        waiverAmount: 0,
        status: 'Unpaid',
        dueDate,
        isArchived: false,
      });
      batch.set(doc(teacherDb, 'financialRecords', `transport-${uid}-${dateStr}`), {
        schoolId,
        studentId: uid,
        studentName: `Student ${i}`,
        classId: 'grade-4-daisy',
        type: 'Transport Fee (Daily)',
        description: 'Transport - November 23rd, 2026',
        billedAmount: 12,
        amountPaid: 0,
        waiverAmount: 0,
        status: 'Unpaid',
        dueDate,
        isArchived: false,
      });
    }

    await assertSucceeds(batch.commit());
  });

  it('allows Accountant in same school to read billingReconciliation, denies Teacher and cross-school reads and all client writes', async () => {
    const accountantDb = testEnv.authenticatedContext('accountant-1').firestore();
    const teacherDb = testEnv.authenticatedContext('teacher-1').firestore();
    const otherAccDb = testEnv.authenticatedContext('other-accountant').firestore();

    const refPath = `${schoolId}_${dateStr}`;
    await assertSucceeds(getDoc(doc(accountantDb, 'billingReconciliation', refPath)));
    await assertFails(getDoc(doc(teacherDb, 'billingReconciliation', refPath)));
    await assertFails(getDoc(doc(otherAccDb, 'billingReconciliation', refPath)));
    await assertFails(setDoc(doc(accountantDb, 'billingReconciliation', refPath), { schoolId, dateStr, created: 99 }));
    await assertFails(setDoc(doc(teacherDb, 'billingReconciliation', refPath), { schoolId, dateStr, created: 99 }));
  });
});
