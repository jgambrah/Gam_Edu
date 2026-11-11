/**
 * Firestore rules: Central Story Library (emulator tests). Run: npm run test:rules
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { assertSucceeds, assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where, limit, addDoc, serverTimestamp, deleteField } from 'firebase/firestore';
import { as, createEnv, readRules, seedProfiles, SCHOOL_A, SCHOOL_B, cast, type ActorName } from './helpers';
import { packagePathFor, validateCatalogueEntry } from '../../src/lib/story-library/validate';

let env: RulesTestEnvironment;

type Who = ActorName | 'publisher1' | 'publisher2' | 'claimFalse' | 'roleOnly';
const ctx = (who: Who) => {
  switch (who) {
    case 'publisher1': return env.authenticatedContext('publisher1', { email: 'publisher1@test.example', story_publisher: true });
    case 'publisher2': return env.authenticatedContext('publisher2', { email: 'publisher2@test.example', story_publisher: true });
    case 'claimFalse': return env.authenticatedContext('claimFalse', { email: 'cf@test.example', story_publisher: false });
    case 'roleOnly': return env.authenticatedContext('roleOnly', { email: 'ro@test.example', role: 'Publisher' });
    default: return as(env, who);
  }
};
const db = (who: Who) => ctx(who).firestore();

const H = (c: string) => `sha256:${c.repeat(64)}`;
const entry = (id: string, over: Record<string, unknown> = {}) => ({
  storyKey: `key-${id}`, version: 1, packageVersion: 1, status: 'published', title: 'The Brave Little Kite', ageTiers: ['3-4'],
  pageCount: 10, packagePath: packagePathFor(id, 1), packageHash: H('a'), contentHash: H('b'), publishedBy: 'publisher1', ...over,
});
const adminDocData = (status: string, over: Record<string, unknown> = {}) => ({
  storyKey: 'key', title: 'The Brave Little Kite', status, createdBy: 'publisher1', lastEditedBy: 'publisher1', updatedAt: new Date(),
  ...(status !== 'draft' ? { contentHash: H('b') } : {}),
  ...(status === 'review' ? { submittedBy: 'publisher1', submittedAt: new Date() } : {}),
  ...(['approved', 'published', 'archived'].includes(status) ? { approvedBy: 'publisher1', approvedAt: new Date() } : {}),
  ...over,
});
const newDraft = (uid: string, over: Record<string, unknown> = {}) => ({
  storyKey: 'key', title: 'The Brave Little Kite', status: 'draft', createdBy: uid, lastEditedBy: uid, updatedAt: serverTimestamp(), ...over,
});
const seed = (path: string, data: Record<string, unknown>) =>
  env.withSecurityRulesDisabled(async (c) => { await setDoc(doc(c.firestore(), path), data); });

const seedReadiness = (id: string, over: Record<string, unknown> = {}) =>
  seed(`story_library_admin/${id}/readiness/current`, { premiumReady: true, contentHash: H('b'), reviewerIds: [], ...over });

const verdict = (ok: boolean) => (ok ? assertSucceeds : assertFails);

beforeAll(async () => {
  env = await createEnv('demo-gam-edu-library', { firestore: readRules('firestore.rules') });
});
afterAll(async () => { await env?.cleanup(); });
beforeEach(async () => {
  await env.clearFirestore();
  await seedProfiles(env, {
    'schools/schoolA': { name: 'School A' },
    'schools/schoolB': { name: 'School B', storyLibraryEnabled: false },
  });
  await seed('story_catalogue/story_pub', entry('story_pub'));
  await seed('story_catalogue/story_arch', entry('story_arch', { status: 'archived' }));
  await seed('story_catalogue/story_corrupt_draft', entry('story_corrupt_draft', { status: 'draft' }));
  await seed('story_library_admin/story_pub', adminDocData('published'));
  await seed('story_library_admin/story_draft', adminDocData('draft'));
  await seed('library_meta/current', { catalogueVersion: 5, updatedAt: new Date() });
});

const SCHOOL_READERS: Who[] = ['teacherA', 'teacherA2', 'adminA', 'registrarA', 'cookA', 'pupilA', 'parentA', 'staffOnlyA', 'studentsDocOnlyA'];
const PUBLISHERS: Who[] = ['publisher1', 'publisher2', 'superAdmin'];
const OUTSIDERS: Who[] = ['anon', 'noDocsUser', 'fakeSuperClaim', 'claimFalse', 'roleOnly'];
const DISABLED_SCHOOL: Who[] = ['teacherB', 'adminB', 'pupilB', 'parentB'];
const NON_PUBLISHERS: Who[] = [...SCHOOL_READERS, ...DISABLED_SCHOOL, ...OUTSIDERS];

describe('the tests agree with the TypeScript validators', () => {
  it('the fixture entry is valid for the app-side validator', () => {
    expect(validateCatalogueEntry('story_new', entry('story_new'))).toEqual([]);
  });
});

describe('catalogue: reading a single entry', () => {
  it.each(SCHOOL_READERS.map((w) => [w] as const))('%s (eligible school) can read a PUBLISHED entry', async (who) => {
    await assertSucceeds(getDoc(doc(db(who), 'story_catalogue/story_pub')));
  });
  it.each([...PUBLISHERS].map((w) => [w] as const))('%s (publisher) can read a published entry', async (who) => {
    await assertSucceeds(getDoc(doc(db(who), 'story_catalogue/story_pub')));
  });
  it.each([...OUTSIDERS, ...DISABLED_SCHOOL].map((w) => [w] as const))('%s cannot read a published entry', async (who) => {
    await assertFails(getDoc(doc(db(who), 'story_catalogue/story_pub')));
  });
  it.each(SCHOOL_READERS.map((w) => [w] as const))('%s cannot read an ARCHIVED entry', async (who) => {
    await assertFails(getDoc(doc(db(who), 'story_catalogue/story_arch')));
  });
  it.each(SCHOOL_READERS.map((w) => [w] as const))('%s cannot read a DRAFT-status entry even if one is wrongly present', async (who) => {
    await assertFails(getDoc(doc(db(who), 'story_catalogue/story_corrupt_draft')));
  });
  it.each(PUBLISHERS.map((w) => [w] as const))('%s (publisher) can read archived and draft-status entries', async (who) => {
    await assertSucceeds(getDoc(doc(db(who), 'story_catalogue/story_arch')));
    await assertSucceeds(getDoc(doc(db(who), 'story_catalogue/story_corrupt_draft')));
  });
  it('PINNED (finding S5): a token-claim-only user with no profile is treated as a member of the claimed school', async () => {
    await assertSucceeds(getDoc(doc(db('claimOnlyUser'), 'story_catalogue/story_pub')));
  });
});

describe('catalogue: listing', () => {
  const published = (n?: number) => query(collection(db('teacherA'), 'story_catalogue'), where('status', '==', 'published'), limit(n ?? 20));
  it('an eligible school lists published entries only, with a limit', async () => {
    const snap = await assertSucceeds(getDocs(published()));
    expect(snap.docs.map((d) => d.id)).toEqual(['story_pub']);
  });
  it('a list without a limit is refused', async () => {
    await assertFails(getDocs(query(collection(db('teacherA'), 'story_catalogue'), where('status', '==', 'published'))));
  });
  it('a list with limit 51 is refused; limit 50 is allowed', async () => {
    await assertFails(getDocs(published(51)));
    await assertSucceeds(getDocs(published(50)));
  });
  it('a list that does not filter on status == published is refused', async () => {
    await assertFails(getDocs(query(collection(db('teacherA'), 'story_catalogue'), limit(20))));
    await assertFails(getDocs(query(collection(db('teacherA'), 'story_catalogue'), where('status', '==', 'archived'), limit(20))));
  });
  it('a school with the library switched off, and outsiders, cannot list', async () => {
    for (const who of ['teacherB', 'pupilB', 'anon', 'noDocsUser'] as Who[]) {
      await assertFails(getDocs(query(collection(db(who), 'story_catalogue'), where('status', '==', 'published'), limit(20))));
    }
  });
  it('publishers can list everything, including archived', async () => {
    const snap = await assertSucceeds(getDocs(query(collection(db('publisher1'), 'story_catalogue'), limit(100))));
    expect(snap.size).toBe(3);
  });
});

describe('library_meta (the one document read per session)', () => {
  it.each(SCHOOL_READERS.map((w) => [w] as const))('%s can read it', async (who) => {
    await assertSucceeds(getDoc(doc(db(who), 'library_meta/current')));
  });
  it.each([...OUTSIDERS, ...DISABLED_SCHOOL].map((w) => [w] as const))('%s cannot read it', async (who) => {
    await assertFails(getDoc(doc(db(who), 'library_meta/current')));
  });
  it('only one document is ever read: school users and publishers cannot list the collection', async () => {
    for (const who of ['teacherA', 'publisher1'] as Who[]) await assertFails(getDocs(collection(db(who), 'library_meta')));
  });
  it.each([...NON_PUBLISHERS, ...PUBLISHERS].map((w) => [w] as const))('%s cannot write library_meta', async (who) => {
    await assertFails(setDoc(doc(db(who), 'library_meta/current'), { catalogueVersion: 6, updatedAt: new Date() }));
  });
});

describe('catalogue: writing is server-only', () => {
  it.each([...NON_PUBLISHERS, ...PUBLISHERS].map((w) => [w] as const))('%s cannot create, change or delete a catalogue entry', async (who) => {
    await seed('story_library_admin/story_new', adminDocData('approved'));
    await seedReadiness('story_new');
    await assertFails(setDoc(doc(db(who), 'story_catalogue/story_new'), entry('story_new', { publishedBy: cast[who as keyof typeof cast]?.uid ?? 'x' })));
    await assertFails(updateDoc(doc(db(who), 'story_catalogue/story_pub'), { title: 'Hacked' }));
    await assertFails(deleteDoc(doc(db(who), 'story_catalogue/story_pub')));
  });
});

describe('story_library_admin: instant approval & workflow', () => {
  it.each(NON_PUBLISHERS.map((w) => [w] as const))('%s cannot read or write story_library_admin', async (who) => {
    await assertFails(getDoc(doc(db(who), 'story_library_admin/story_draft')));
    await assertFails(getDocs(collection(db(who), 'story_library_admin')));
    await assertFails(setDoc(doc(db(who), 'story_library_admin/story_x'), adminDocData('draft', { createdBy: 'x' })));
  });

  it('a publisher can create a story directly as approved or draft, as themselves, but never as published', async () => {
    await assertSucceeds(setDoc(doc(db('publisher2'), 'story_library_admin/story_x'), newDraft('publisher2')));
    await assertSucceeds(setDoc(doc(db('publisher2'), 'story_library_admin/story_inst'), newDraft('publisher2', {
      status: 'approved', approvedBy: 'publisher2', approvedAt: serverTimestamp(),
    })));
    await assertFails(setDoc(doc(db('publisher2'), 'story_library_admin/story_y'), newDraft('publisher2', { createdBy: 'publisher1' })));
    await assertFails(setDoc(doc(db('publisher2'), 'story_library_admin/story_z'), newDraft('publisher2', { status: 'approved' }))); // missing approvedBy/At
    await assertFails(setDoc(doc(db('publisher2'), 'story_library_admin/story_w'), newDraft('publisher2', { status: 'published' })));
  });

  const uidOf = (who: Who) => (who === 'superAdmin' ? 'L4oE5XWweKRYrhtIXn6hB8IDHBC2' : who);
  const setStatus = (who: Who, id: string, status: string, extra: Record<string, unknown> = {}) => {
    const uid = uidOf(who);
    const trail: Record<string, unknown> =
      status === 'review' ? { lastEditedBy: uid, submittedBy: uid, submittedAt: serverTimestamp(), approvedBy: deleteField(), approvedAt: deleteField() }
      : status === 'draft' ? { lastEditedBy: uid, submittedBy: deleteField(), submittedAt: deleteField(), approvedBy: deleteField(), approvedAt: deleteField() }
      : status === 'approved' ? { approvedBy: uid, approvedAt: serverTimestamp() }
      : {};
    return updateDoc(doc(db(who), `story_library_admin/${id}`), { status, updatedAt: serverTimestamp(), ...trail, ...extra });
  };
  const edit = (who: Who, id: string, fields: Record<string, unknown>) =>
    updateDoc(doc(db(who), `story_library_admin/${id}`), { lastEditedBy: uidOf(who), updatedAt: serverTimestamp(), ...fields });

  it('any publisher (including the author) can approve a premium-ready story from draft or review', async () => {
    await seed('story_library_admin/story_r', adminDocData('review'));
    await seedReadiness('story_r');
    await assertSucceeds(setStatus('publisher1', 'story_r', 'approved'));

    await seed('story_library_admin/story_d2', adminDocData('draft', { contentHash: H('b') }));
    await seedReadiness('story_d2');
    await assertSucceeds(setStatus('publisher1', 'story_d2', 'approved'));
  });

  it('approval requires a matching premiumReady record and honest approver uid', async () => {
    await seed('story_library_admin/story_none', adminDocData('review'));
    await assertFails(setStatus('publisher1', 'story_none', 'approved'));
    await seed('story_library_admin/story_nr', adminDocData('review'));
    await seedReadiness('story_nr', { premiumReady: false });
    await assertFails(setStatus('publisher1', 'story_nr', 'approved'));
    await seedReadiness('story_nr', { premiumReady: true });
    await assertFails(setStatus('publisher2', 'story_nr', 'approved', { approvedBy: 'publisher1' }));
    await assertSucceeds(setStatus('publisher2', 'story_nr', 'approved'));
  });

  it('there is no client path to published or archived, and approved/published content is frozen', async () => {
    await seed('story_library_admin/story_a', adminDocData('approved'));
    await assertFails(setStatus('publisher1', 'story_a', 'published', { publishedBy: 'publisher1', publishedAt: serverTimestamp() }));
    await assertFails(edit('publisher1', 'story_a', { notes: 'edited after approval' }));
    await assertFails(edit('publisher1', 'story_pub', { notes: 'edited after publication' }));
  });
});

describe('library_seed_jobs & pending_versions', () => {
  it('publishers read job records and pending versions; nobody writes them from a client', async () => {
    await seed('library_seed_jobs/job1', { state: 'running' });
    await seed('story_library_admin/story_pub/pending_versions/2', { status: 'approved', storyKey: 'key' });
    for (const who of PUBLISHERS) {
      await assertSucceeds(getDoc(doc(db(who), 'library_seed_jobs/job1')));
      await assertSucceeds(getDoc(doc(db(who), 'story_library_admin/story_pub/pending_versions/2')));
      await assertFails(setDoc(doc(db(who), 'library_seed_jobs/job2'), { state: 'x' }));
    }
    for (const who of NON_PUBLISHERS) {
      await verdict(false)(getDoc(doc(db(who), 'library_seed_jobs/job1')));
    }
  });
});

describe('compatibility: school-created stories (junior_stories) are untouched', () => {
  it('a teacher still saves and reads their own school story exactly as before', async () => {
    const ref = await assertSucceeds(addDoc(collection(db('teacherA'), 'junior_stories'), {
      title: 'My class story', content: 'Once upon a time.', schoolId: SCHOOL_A, createdBy: 'teacherA',
    }));
    await assertSucceeds(getDoc(ref));
  });
  it('a teacher still cannot save a story into another school', async () => {
    await assertFails(addDoc(collection(db('teacherA'), 'junior_stories'), {
      title: 'Wrong school', content: 'x', schoolId: SCHOOL_B, createdBy: 'teacherA',
    }));
  });
});
