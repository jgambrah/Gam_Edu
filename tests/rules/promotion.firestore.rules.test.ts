/**
 * Firestore rules — Student Promotion / Graduation to Alumni (emulator tests).
 *
 * A school Director graduating a final-year class got "Missing or insufficient permissions". The cause was
 * not the Director's role: each pupil's timeline entry makes the rules look up that pupil's document, and
 * Firestore allows at most 20 such look-ups in ONE batched write. A class of 20+ pupils in a single batch
 * was therefore refused. The promotion page now sends small batches (PROMOTION_BATCH_SIZE pupils each).
 *
 * The refusal itself (20+ pupils in one batch) is a production Firestore limit and is not asserted here.
 *
 * Run:  npm run test:rules
 */
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { assertSucceeds, assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, writeBatch, collection, serverTimestamp } from 'firebase/firestore';
import { as, createEnv, readRules, seedProfiles, SCHOOL_A, SCHOOL_B, type ActorName } from './helpers';
import { PROMOTION_BATCH_SIZE, chunkForPromotion } from '../../src/lib/promotion-batches';

let env: RulesTestEnvironment;
const db = (who: ActorName) => as(env, who).firestore();

const pupilIds = (n: number, prefix = 'jhs3-') => Array.from({ length: n }, (_, i) => `${prefix}${i + 1}`);

const seedPupils = (ids: string[], schoolId = SCHOOL_A) =>
  env.withSecurityRulesDisabled(async (ctx) => {
    for (const id of ids) {
      await setDoc(doc(ctx.firestore(), 'students', id), {
        uid: id, schoolId, classId: 'jhs3', enrollmentStatus: 'Active', firstName: 'Pupil', lastName: id,
      });
    }
  });

/** The same writes the promotion page makes for each pupil: update the pupil + add a timeline entry. */
function graduationBatch(firestore: any, ids: string[]) {
  const batch = writeBatch(firestore);
  for (const id of ids) {
    batch.update(doc(firestore, 'students', id), {
      enrollmentStatus: 'Graduated',
      previousClassId: 'jhs3',
      graduationYear: 2026,
      graduatedAt: serverTimestamp(),
      graduatedFromClassName: 'JHS 3',
      updatedAt: serverTimestamp(),
    });
    batch.set(doc(collection(firestore, 'students', id, 'timeline')), {
      studentId: id, title: 'Graduation 🎓', category: 'graduation', schoolId: SCHOOL_A, createdAt: serverTimestamp(),
    });
  }
  return batch.commit();
}

beforeAll(async () => {
  env = await createEnv('demo-gam-edu-promotion', { firestore: readRules('firestore.rules') });
});
afterAll(async () => { await env?.cleanup(); });
beforeEach(async () => {
  await env.clearFirestore();
  await seedProfiles(env);
});

describe('Graduating a final-year class to Alumni', () => {
  it('PROBE (CI only, not asserted): does one batch of 30 get refused?', async () => {
    const ids = pupilIds(30);
    await seedPupils(ids);
    let outcome = 'ACCEPTED';
    try { await graduationBatch(db('adminA'), ids); } catch (e: any) { outcome = `REFUSED: ${e?.code} ${String(e?.message).slice(0, 200)}`; }
    console.log(`PROBE_BATCH_30 => ${outcome}`);
  });

  it('USE CASE: a Director graduates a class of 30 when it is sent in small batches', async () => {
    const ids = pupilIds(30);
    await seedPupils(ids);
    for (const group of chunkForPromotion(ids)) {
      await assertSucceeds(graduationBatch(db('adminA'), group));
    }
  });

  it('USE CASE: one full batch of the configured size is accepted', async () => {
    const ids = pupilIds(PROMOTION_BATCH_SIZE);
    await seedPupils(ids);
    await assertSucceeds(graduationBatch(db('adminA'), ids));
  });

  it('USE CASE: a Registrar (admin role) can graduate pupils too', async () => {
    const ids = pupilIds(PROMOTION_BATCH_SIZE);
    await seedPupils(ids);
    await assertSucceeds(graduationBatch(db('registrarA'), ids));
  });

  it('SAFETY: a Director of another school still cannot graduate this school\'s pupils', async () => {
    const ids = pupilIds(3);
    await seedPupils(ids);
    await assertFails(graduationBatch(db('adminB'), ids));
  });

  it('SAFETY: a pupil cannot mark themself as graduated', async () => {
    await seedPupils(['pupilA']);
    await assertFails(graduationBatch(db('pupilA'), ['pupilA']));
  });

  it('SAFETY: pupils of another school in the batch make the whole batch fail', async () => {
    await seedPupils(['a-1']);
    await seedPupils(['b-1'], SCHOOL_B);
    await assertFails(graduationBatch(db('adminA'), ['a-1', 'b-1']));
  });
});
