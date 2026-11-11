/**
 * Firestore rules — Learning Materials (emulator tests).
 *
 * Before: any signed-in account of ANY school could read every school's materials, and any teacher of ANY school
 * could delete (or take over) another school's topic. These tests pin the new policy AND every query the app
 * really runs, so tightening the rules cannot break a screen.
 *
 * Run:  npm run test:rules
 */
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { assertSucceeds, assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import {
  doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, collection, query, where, orderBy, limit,
} from 'firebase/firestore';
import { as, createEnv, readRules, seedProfiles, SCHOOL_A, SCHOOL_B, type ActorName } from './helpers';

let env: RulesTestEnvironment;
const db = (who: ActorName): any => as(env, who).firestore();
const COL = 'learning_materials';

const topic = (over: Record<string, any> = {}) => ({
  topicTitle: 'Diversity of Matter',
  content: 'Solids, liquids and gases.',
  subject: 'Integrated Science',
  classId: 'jhs1a',
  classIds: ['jhs1a', 'jhs1b'],
  schoolId: SCHOOL_A,
  uploadedBy: 'teacherA',
  videoLinks: [],
  attachments: [],
  practiceQuestions: [],
  ...over,
});

const seed = (id: string, data: Record<string, any>) =>
  env.withSecurityRulesDisabled(async (ctx) => { await setDoc(doc(ctx.firestore(), COL, id), data); });

beforeAll(async () => {
  env = await createEnv('demo-gam-edu-materials', { firestore: readRules('firestore.rules') });
});
afterAll(async () => { await env?.cleanup(); });
beforeEach(async () => {
  await env.clearFirestore();
  await seedProfiles(env);
  await seed('a1', topic());
  await seed('b1', topic({ schoolId: SCHOOL_B, classId: 'b-jhs1', classIds: ['b-jhs1'], uploadedBy: 'teacherB' }));
  // Older platform content of the BS7 course page: saved by the platform owner with no school.
  await seed('platform1', { courseId: 'bs7-integrated-science', strand: 'S1', subStrand: 'SS1', topicTitle: 'Matter', content: 'x' });
  await seed('a-bs7', { courseId: 'bs7-integrated-science', strand: 'S1', subStrand: 'SS2', topicTitle: 'Cells', content: 'x', schoolId: SCHOOL_A });
});

// ---- the queries the app really runs ----
const classQuery = (who: ActorName, school: string, classId: string) =>
  getDocs(query(collection(db(who), COL), where('schoolId', '==', school), where('classId', '==', classId)));
const sharedQuery = (who: ActorName, school: string, classId: string) =>
  getDocs(query(collection(db(who), COL), where('schoolId', '==', school), where('classIds', 'array-contains', classId)));
const dashboardQuery = (who: ActorName, school: string) =>
  getDocs(query(collection(db(who), COL), where('schoolId', '==', school), limit(50)));
const bs7Query = (who: ActorName) =>
  getDocs(query(collection(db(who), COL), where('courseId', '==', 'bs7-integrated-science'), orderBy('strand'), orderBy('subStrand')));

describe('Learning materials — every screen of the school still works', () => {
  const SCHOOL_A_PEOPLE: ActorName[] = ['adminA', 'registrarA', 'teacherA', 'cookA', 'pupilA', 'parentA', 'staffOnlyA', 'studentsDocOnlyA'];

  it.each(SCHOOL_A_PEOPLE)("USE CASE: %s loads their class's topics (Learning Materials page)", async (who) => {
    await assertSucceeds(classQuery(who, SCHOOL_A, 'jhs1a'));
  });

  it.each(SCHOOL_A_PEOPLE)('USE CASE: %s loads topics shared with a second class', async (who) => {
    await assertSucceeds(sharedQuery(who, SCHOOL_A, 'jhs1b'));
  });

  it.each(SCHOOL_A_PEOPLE)('USE CASE: %s loads the dashboard list of materials', async (who) => {
    await assertSucceeds(dashboardQuery(who, SCHOOL_A));
  });

  it.each(['teacherA', 'pupilA', 'teacherB', 'pupilB'] as ActorName[])(
    'USE CASE: %s still loads the BS7 Integrated Science course page (lists by course)',
    async (who) => { await assertSucceeds(bs7Query(who)); }
  );

  it('USE CASE: opening one topic of your own school, or older platform content with no school', async () => {
    await assertSucceeds(getDoc(doc(db('pupilA'), COL, 'a1')));
    await assertSucceeds(getDoc(doc(db('teacherA'), COL, 'a1')));
    await assertSucceeds(getDoc(doc(db('pupilA'), COL, 'platform1')));
    await assertSucceeds(getDoc(doc(db('pupilB'), COL, 'platform1')));
    await assertSucceeds(getDoc(doc(db('teacherA'), COL, 'does-not-exist')));
  });

  it('USE CASE: the platform owner can read, list, edit and delete anything', async () => {
    await assertSucceeds(classQuery('superAdmin', SCHOOL_B, 'b-jhs1'));
    await assertSucceeds(getDocs(collection(db('superAdmin'), COL)));
    await assertSucceeds(updateDoc(doc(db('superAdmin'), COL, 'platform1'), { content: 'y' }));
    await assertSucceeds(deleteDoc(doc(db('superAdmin'), COL, 'b1')));
  });
});

describe('Learning materials — other schools are shut out', () => {
  const OUTSIDERS: ActorName[] = ['adminB', 'teacherB', 'pupilB', 'parentB', 'noDocsUser', 'anon'];

  it.each(OUTSIDERS)("SAFETY: %s cannot list school A's topics", async (who) => {
    await assertFails(classQuery(who, SCHOOL_A, 'jhs1a'));
    await assertFails(sharedQuery(who, SCHOOL_A, 'jhs1b'));
    await assertFails(dashboardQuery(who, SCHOOL_A));
  });

  it.each(OUTSIDERS)("SAFETY: %s cannot open a school A topic by its id", async (who) => {
    await assertFails(getDoc(doc(db(who), COL, 'a1')));
  });

  it('SAFETY: nobody can list every school at once (a query with no school filter)', async () => {
    await assertFails(getDocs(collection(db('teacherA'), COL)));
    await assertFails(getDocs(query(collection(db('teacherA'), COL), where('classId', '==', 'jhs1a'))));
    await assertFails(getDocs(query(collection(db('adminA'), COL), where('subject', '==', 'Integrated Science'))));
  });

  it('SAFETY: a visitor who is not signed in sees nothing, including the BS7 course', async () => {
    await assertFails(bs7Query('anon'));
    await assertFails(getDoc(doc(db('anon'), COL, 'platform1')));
  });

  it('school B people still use their own materials normally', async () => {
    await assertSucceeds(classQuery('teacherB', SCHOOL_B, 'b-jhs1'));
    await assertSucceeds(classQuery('pupilB', SCHOOL_B, 'b-jhs1'));
    await assertSucceeds(getDoc(doc(db('pupilB'), COL, 'b1')));
  });
});

describe('Learning materials — saving and deleting', () => {
  it('USE CASE: a teacher or administrator creates, edits and deletes a topic of their own school', async () => {
    await assertSucceeds(addDoc(collection(db('teacherA'), COL), topic()));
    await assertSucceeds(addDoc(collection(db('adminA'), COL), topic({ uploadedBy: 'adminA' })));
    await assertSucceeds(updateDoc(doc(db('teacherA'), COL, 'a1'), { topicTitle: 'Matter (revised)', classIds: ['jhs1a'], term: 'Term 1', week: 3, tags: ['bece'] }));
    await assertSucceeds(updateDoc(doc(db('adminA'), COL, 'a1'), { content: 'Updated notes.' }));
    await assertSucceeds(deleteDoc(doc(db('teacherA'), COL, 'a1')));
  });

  it('USE CASE: a teacher adds a BS7 course topic for their own school', async () => {
    await assertSucceeds(addDoc(collection(db('teacherA'), COL), { courseId: 'bs7-integrated-science', strand: 'S1', subStrand: 'SS1', topicTitle: 'Energy', content: 'x', schoolId: SCHOOL_A }));
    await assertSucceeds(updateDoc(doc(db('teacherA'), COL, 'a-bs7'), { content: 'y' }));
  });

  it('SAFETY: pupils and parents cannot create, edit or delete topics', async () => {
    for (const who of ['pupilA', 'parentA'] as ActorName[]) {
      await assertFails(addDoc(collection(db(who), COL), topic({ uploadedBy: who })));
      await assertFails(updateDoc(doc(db(who), COL, 'a1'), { content: 'hacked' }));
      await assertFails(deleteDoc(doc(db(who), COL, 'a1')));
    }
  });

  it("SAFETY: a teacher or administrator of another school cannot delete school A's topic (they could before)", async () => {
    await assertFails(deleteDoc(doc(db('teacherB'), COL, 'a1')));
    await assertFails(deleteDoc(doc(db('adminB'), COL, 'a1')));
  });

  it("SAFETY: a teacher of another school cannot edit school A's topic or take it over (they could before)", async () => {
    await assertFails(updateDoc(doc(db('teacherB'), COL, 'a1'), { content: 'hacked' }));
    await assertFails(updateDoc(doc(db('teacherB'), COL, 'a1'), { schoolId: SCHOOL_B }));
  });

  it('SAFETY: a topic cannot be created in, or moved to, another school', async () => {
    await assertFails(addDoc(collection(db('teacherA'), COL), topic({ schoolId: SCHOOL_B })));
    await assertFails(addDoc(collection(db('teacherA'), COL), topic({ schoolId: '' })));
    await assertFails(updateDoc(doc(db('teacherA'), COL, 'a1'), { schoolId: SCHOOL_B }));
  });

  it('SAFETY: older platform content with no school can be changed only by the platform owner', async () => {
    await assertFails(updateDoc(doc(db('teacherA'), COL, 'platform1'), { content: 'mine now', schoolId: SCHOOL_A }));
    await assertFails(deleteDoc(doc(db('adminA'), COL, 'platform1')));
    await assertSucceeds(updateDoc(doc(db('superAdmin'), COL, 'platform1'), { content: 'updated' }));
  });

  it('SAFETY: an account with no school cannot create topics', async () => {
    await assertFails(addDoc(collection(db('noDocsUser'), COL), topic({ schoolId: '' })));
    await assertFails(addDoc(collection(db('anon'), COL), topic()));
  });
});
