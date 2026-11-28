/**
 * Firestore rules: askTeacherUsage (server-only daily cap counters for the Ask Teacher AI endpoint).
 * Only the Admin SDK (which bypasses rules) may touch these documents; every ordinary client, including directors,
 * teachers, pupils, parents and anonymous users, must be denied read and write. Run: npm run test:rules
 */
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { as, createEnv, readRules, seedProfiles, SCHOOL_A, type ActorName } from './helpers';

let env: RulesTestEnvironment;
const PATH = 'askTeacherUsage/u_teacherA_2026-11-29';

beforeAll(async () => {
  env = await createEnv('demo-gam-edu-ask-usage', { firestore: readRules('firestore.rules') });
});
afterAll(async () => { await env?.cleanup(); });
beforeEach(async () => {
  await env.clearFirestore();
  await seedProfiles(env, { [`schools/${SCHOOL_A}`]: { name: 'School A' } });
  await env.withSecurityRulesDisabled(async (c) => {
    await setDoc(doc(c.firestore(), PATH), { count: 3, day: '2026-11-29', uid: 'teacherA' });
  });
});

const actors: ActorName[] = ['adminA', 'teacherA', 'pupilA', 'parentA', 'anon'];

describe('askTeacherUsage is server-only', () => {
  for (const who of actors) {
    it(`${who} cannot read, list, create, update (reset the cap) or delete`, async () => {
      const db = as(env, who).firestore();
      await assertFails(getDoc(doc(db, PATH)));
      await assertFails(getDocs(collection(db, 'askTeacherUsage')));
      await assertFails(setDoc(doc(db, 'askTeacherUsage/u_x_2026-11-29'), { count: 0 }));
      await assertFails(updateDoc(doc(db, PATH), { count: 0 }));
      await assertFails(deleteDoc(doc(db, PATH)));
    });
  }
});
