/**
 * Firestore rules — Story Spark / Junior Campus content (emulator tests).
 *
 * Covers the cross-school findings S2 and S3: who may create, read, change and delete stories, science facts and
 * the other Nursery Bloom content collections, including the legacy "no school" items.
 *
 * Run:  npm run test:rules
 */
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { assertSucceeds, assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';
import { as, createEnv, readRules, seedProfiles, SCHOOL_A, SCHOOL_B, type ActorName } from './helpers';

let env: RulesTestEnvironment;
let legacyEnv: RulesTestEnvironment;

const db = (who: ActorName, e: RulesTestEnvironment = env) => as(e, who).firestore();

const story = (over: Record<string, any> = {}) => ({
  title: 'The Dragon Who Loved Cupcakes',
  content: 'Dax the dragon loved cupcakes.',
  schoolId: SCHOOL_A,
  createdBy: 'teacherA',
  ...over,
});

/** A story that already exists (written with rules disabled). */
const seedDoc = (path: string, data: Record<string, any>) =>
  env.withSecurityRulesDisabled(async (ctx) => { await setDoc(doc(ctx.firestore(), path), data); });

beforeAll(async () => {
  env = await createEnv('demo-gam-edu-firestore', { firestore: readRules('firestore.rules') });
  legacyEnv = await createEnv('demo-gam-edu-firestore-legacy', { firestore: readRules('tests/rules/fixtures/legacy-firestore.rules') });
});
afterAll(async () => {
  await env?.cleanup();
  await legacyEnv?.cleanup();
});
beforeEach(async () => {
  await env.clearFirestore();
  await seedProfiles(env);
  await legacyEnv.clearFirestore();
  await seedProfiles(legacyEnv);
});

// The two user-generated collections and one ordinary activity collection, to prove the shared helpers behave the same.
const COLLECTIONS = [
  ['junior_stories', 'story'],
  ['junior_science', 'science fact'],
  ['junior_abc_words', 'ABC word'],
] as const;

describe.each(COLLECTIONS)('%s (%s) — creating', (coll) => {
  it.each([
    ['teacherA', true],
    ['adminA', true],
    ['superAdmin', true],
  ] as const)("%s saving their own school's item → allowed: %s", async (who, ok) => {
    const data = story({ createdBy: who === 'superAdmin' ? 'L4oE5XWweKRYrhtIXn6hB8IDHBC2' : who });
    await (ok ? assertSucceeds : assertFails)(addDoc(collection(db(who), coll), data));
  });

  it.each(['pupilA', 'parentA', 'noDocsUser', 'anon'] as const)('%s cannot create → denied', async (who) => {
    await assertFails(addDoc(collection(db(who), coll), story({ createdBy: who === 'anon' ? '' : who })));
  });

  it('a teacher cannot create an item with NO school (a "shared with every school" item) — fixes S2', async () => {
    await assertFails(addDoc(collection(db('teacherA'), coll), story({ schoolId: null })));
    await assertFails(addDoc(collection(db('teacherA'), coll), (({ schoolId, ...rest }) => rest)(story())));
  });

  it("a teacher cannot create an item in another school", async () => {
    await assertFails(addDoc(collection(db('teacherA'), coll), story({ schoolId: SCHOOL_B })));
  });

  // Only the two user-generated collections check createdBy (the other ten Junior collections never did).
  (coll === 'junior_abc_words' ? it.skip : it)("a teacher cannot create an item in someone else's name", async () => {
    await assertFails(addDoc(collection(db('teacherA'), coll), story({ createdBy: 'teacherA2' })));
  });

  it('only a super admin may create a deliberately shared (no-school) item', async () => {
    await assertSucceeds(addDoc(collection(db('superAdmin'), coll), story({ schoolId: null, createdBy: 'L4oE5XWweKRYrhtIXn6hB8IDHBC2' })));
    await assertFails(addDoc(collection(db('adminA'), coll), story({ schoolId: null, createdBy: 'adminA' })));
  });

  it('someone with no resolvable school cannot create', async () => {
    await assertFails(addDoc(collection(db('noDocsUser'), coll), story({ createdBy: 'noDocsUser' })));
    await assertFails(addDoc(collection(db('noDocsUser'), coll), story({ createdBy: 'noDocsUser', schoolId: '' })));
  });
});

describe.each(COLLECTIONS)('%s (%s) — changing and deleting', (coll) => {
  const A = `${coll}/a1`;
  const LEGACY = `${coll}/legacy1`;
  beforeEach(async () => {
    await seedDoc(A, story());
    await seedDoc(LEGACY, story({ schoolId: null, createdBy: 'someoneLongGone' }));
  });

  it.each([
    ['teacherA', true],   // creator
    ['teacherA2', true],  // colleague, same school
    ['adminA', true],
    ['superAdmin', true],
    ['teacherB', false],  // other school
    ['adminB', false],
    ['pupilA', false],
    ['parentA', false],
    ['noDocsUser', false],
    ['anon', false],
  ] as const)("%s editing a school A item → allowed: %s", async (who, ok) => {
    await (ok ? assertSucceeds : assertFails)(updateDoc(doc(db(who), A), { title: 'Edited' }));
  });

  it.each([
    ['teacherA', true],
    ['teacherA2', true],
    ['adminA', true],
    ['superAdmin', true],
    ['teacherB', false],
    ['adminB', false],
    ['pupilA', false],
    ['anon', false],
  ] as const)('%s deleting a school A item → allowed: %s', async (who, ok) => {
    await (ok ? assertSucceeds : assertFails)(deleteDoc(doc(db(who), A)));
  });

  it("nobody but a super admin can change an item's school — fixes the 'publish to every school' hole", async () => {
    await assertFails(updateDoc(doc(db('teacherA'), A), { schoolId: null }));      // blank it → shared with all
    await assertFails(updateDoc(doc(db('teacherA'), A), { schoolId: SCHOOL_B }));  // move it away
    await assertFails(updateDoc(doc(db('adminA'), A), { schoolId: null }));
    await assertSucceeds(updateDoc(doc(db('superAdmin'), A), { schoolId: null }));
  });

  it('shared (no-school) items: a school administrator can no longer edit or delete them — fixes S3', async () => {
    await assertFails(updateDoc(doc(db('adminA'), LEGACY), { title: 'Vandalised' }));
    await assertFails(updateDoc(doc(db('adminB'), LEGACY), { title: 'Vandalised' }));
    await assertFails(deleteDoc(doc(db('adminA'), LEGACY)));
    await assertFails(deleteDoc(doc(db('adminB'), LEGACY)));
    await assertFails(deleteDoc(doc(db('teacherB'), LEGACY)));
    await assertSucceeds(updateDoc(doc(db('superAdmin'), LEGACY), { title: 'Curated' }));
  });

  it('shared (no-school) items: their own creator can still maintain them (nothing breaks for old content)', async () => {
    await seedDoc(`${coll}/legacyMine`, story({ schoolId: null, createdBy: 'teacherA' }));
    await assertSucceeds(updateDoc(doc(db('teacherA'), `${coll}/legacyMine`), { title: 'Mine, edited' }));
    await assertFails(updateDoc(doc(db('teacherA'), `${coll}/legacyMine`), { schoolId: SCHOOL_A })); // still can't re-home it
    await assertSucceeds(deleteDoc(doc(db('teacherA'), `${coll}/legacyMine`)));
  });
});

describe('junior_stories / junior_science — reading (unchanged behaviour, pinned so it stays that way)', () => {
  beforeEach(async () => {
    await seedDoc('junior_stories/a1', story());
    await seedDoc('junior_stories/legacy1', story({ schoolId: null, createdBy: 'someoneLongGone' }));
  });

  it.each([
    ['teacherA', true],
    ['pupilA', true],
    ['parentA', true],
    ['adminA', true],
    ['superAdmin', true],
    ['teacherB', false], // cross-school read of a private story
    ['pupilB', false],
    ['noDocsUser', false],
    ['anon', false],
  ] as const)("%s reading a school A story → allowed: %s", async (who, ok) => {
    await (ok ? assertSucceeds : assertFails)(getDoc(doc(db(who), 'junior_stories/a1')));
  });

  it('shared (no-school) stories stay readable by any signed-in user, so existing libraries keep working', async () => {
    await assertSucceeds(getDoc(doc(db('teacherB'), 'junior_stories/legacy1')));
    await assertSucceeds(getDoc(doc(db('pupilB'), 'junior_stories/legacy1')));
    await assertFails(getDoc(doc(db('anon'), 'junior_stories/legacy1')));
  });

  it('reference content (phonics, puzzles) is still readable by any signed-in user', async () => {
    await seedDoc('junior_phonics/p1', { word: 'cat', schoolId: null });
    await assertSucceeds(getDoc(doc(db('pupilB'), 'junior_phonics/p1')));
    await assertFails(getDoc(doc(db('anon'), 'junior_phonics/p1')));
  });
});

describe('Before/after: the legacy Firestore rules really allowed these (documents what is being fixed)', () => {
  it('LEGACY: a pupil could publish a story to every school (S2)', async () => {
    await assertSucceeds(addDoc(collection(db('pupilA', legacyEnv), 'junior_stories'), story({ schoolId: null, createdBy: 'pupilA' })));
  });

  it('LEGACY: a user with no school could do the same', async () => {
    await assertSucceeds(addDoc(collection(db('noDocsUser', legacyEnv), 'junior_science'), story({ schoolId: null, createdBy: 'noDocsUser' })));
  });

  it("LEGACY: a school B administrator could delete another school's shared story (S3)", async () => {
    await legacyEnv.withSecurityRulesDisabled(async (ctx) => { await setDoc(doc(ctx.firestore(), 'junior_stories/legacy1'), story({ schoolId: null, createdBy: 'x' })); });
    await assertSucceeds(deleteDoc(doc(db('adminB', legacyEnv), 'junior_stories/legacy1')));
  });

  it("LEGACY: a teacher could blank their story's school to share it with everyone", async () => {
    await legacyEnv.withSecurityRulesDisabled(async (ctx) => { await setDoc(doc(ctx.firestore(), 'junior_stories/a1'), story()); });
    await assertSucceeds(updateDoc(doc(db('teacherA', legacyEnv), 'junior_stories/a1'), { schoolId: null }));
  });
});

/**
 * KNOWN ISSUE S5 — not changed in Phase 2 (needs your decision; see the report).
 * Unlike the new Storage rules, firestore.rules trusts the `schoolId` / `role` token claims FIRST
 * (getUserSchoolId / getUserRole), before looking at the profile documents. Nothing in this repo sets those claims,
 * so today it affects nobody, but a stale or hand-set claim would override the person's real school.
 * These tests pin the CURRENT behaviour so the issue is visible, and will fail (usefully) if it is ever fixed.
 */
describe('KNOWN ISSUE S5 — Firestore rules trust token claims over profile documents (current behaviour, not endorsed)', () => {
  it('a token claiming "Teacher at school A" with no profile documents can create a school A story', async () => {
    await assertSucceeds(addDoc(collection(db('claimOnlyUser'), 'junior_stories'), story({ createdBy: 'claimOnlyUser' })));
  });

  it("a stale claim wins over the real school: a school B teacher whose token still says school A writes into A, and is locked out of B", async () => {
    await assertSucceeds(addDoc(collection(db('staleClaimUser'), 'junior_stories'), story({ createdBy: 'staleClaimUser', schoolId: SCHOOL_A })));
    await assertFails(addDoc(collection(db('staleClaimUser'), 'junior_stories'), story({ createdBy: 'staleClaimUser', schoolId: SCHOOL_B })));
  });
});
