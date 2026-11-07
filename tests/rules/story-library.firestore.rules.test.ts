/**
 * Firestore rules: Central Story Library (emulator tests). Run: npm run test:rules
 *
 * Policy under test (docs/STORY-SPARK-2.0-PLAN.md, Part 3):
 *  - only central publishers (super admin or the server-set `story_publisher` claim) write;
 *  - eligible schools read PUBLISHED catalogue entries only; drafts and archived entries are hidden from schools;
 *  - lists need `limit <= 50` and a status == 'published' filter;
 *  - approval needs a different person from the author; approved/published content is not editable;
 *  - school-created stories (`junior_stories`) are unaffected.
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { assertSucceeds, assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where, limit, addDoc } from 'firebase/firestore';
import { as, createEnv, readRules, seedProfiles, SCHOOL_A, SCHOOL_B, cast, type ActorName } from './helpers';
import { packagePathFor, validateCatalogueEntry } from '../../src/lib/story-library/validate';

let env: RulesTestEnvironment;

type Who = ActorName | 'publisher1' | 'publisher2' | 'claimFalse' | 'roleOnly';
const ctx = (who: Who) => {
  switch (who) {
    case 'publisher1': return env.authenticatedContext('publisher1', { email: 'publisher1@test.example', story_publisher: true });
    case 'publisher2': return env.authenticatedContext('publisher2', { email: 'publisher2@test.example', story_publisher: true });
    case 'claimFalse': return env.authenticatedContext('claimFalse', { email: 'cf@test.example', story_publisher: false });
    case 'roleOnly': return env.authenticatedContext('roleOnly', { email: 'ro@test.example', role: 'Publisher' }); // a role NAME is not the claim
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
  storyKey: 'key', title: 'The Brave Little Kite', status, createdBy: 'publisher1', updatedAt: new Date(), ...over,
});
const seed = (path: string, data: Record<string, unknown>) =>
  env.withSecurityRulesDisabled(async (c) => { await setDoc(doc(c.firestore(), path), data); });

const verdict = (ok: boolean) => (ok ? assertSucceeds : assertFails);

beforeAll(async () => {
  env = await createEnv('demo-gam-edu-library', { firestore: readRules('firestore.rules') });
});
afterAll(async () => { await env?.cleanup(); });
beforeEach(async () => {
  await env.clearFirestore();
  await seedProfiles(env, {
    'schools/schoolA': { name: 'School A' },                            // flag absent => eligible
    'schools/schoolB': { name: 'School B', storyLibraryEnabled: false }, // explicitly switched off
  });
  await seed('story_catalogue/story_pub', entry('story_pub'));
  await seed('story_catalogue/story_arch', entry('story_arch', { status: 'archived' }));
  await seed('story_catalogue/story_corrupt_draft', entry('story_corrupt_draft', { status: 'draft' })); // should never exist; rules must still hide it
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
    expect(snap.docs.map((d) => d.id)).toEqual(['story_pub']); // the archived and draft-status docs are not returned
  });
  it('a list without a limit is refused', async () => {
    await assertFails(getDocs(query(collection(db('teacherA'), 'story_catalogue'), where('status', '==', 'published'))));
  });
  it('a list with limit 51 is refused; limit 50 is allowed', async () => {
    await assertFails(getDocs(published(51)));
    await assertSucceeds(getDocs(published(50)));
  });
  it('a list that does not filter on status == published is refused (no pulling drafts or archive)', async () => {
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
  it.each(NON_PUBLISHERS.map((w) => [w] as const))('%s cannot write it', async (who) => {
    await assertFails(setDoc(doc(db(who), 'library_meta/current'), { catalogueVersion: 6, updatedAt: new Date() }));
  });
  it('a publisher can raise the version but never lower or repeat it, and cannot add unknown fields', async () => {
    await assertSucceeds(updateDoc(doc(db('publisher1'), 'library_meta/current'), { catalogueVersion: 6 }));
    await assertFails(updateDoc(doc(db('publisher1'), 'library_meta/current'), { catalogueVersion: 6 }));
    await assertFails(updateDoc(doc(db('publisher1'), 'library_meta/current'), { catalogueVersion: 3 }));
    await assertFails(updateDoc(doc(db('publisher1'), 'library_meta/current'), { catalogueVersion: 9, schoolId: 'schoolA' }));
  });
  it('it cannot be deleted', async () => {
    await assertFails(deleteDoc(doc(db('publisher1'), 'library_meta/current')));
    await assertFails(deleteDoc(doc(db('superAdmin'), 'library_meta/current')));
  });
});

describe('catalogue: writing', () => {
  it.each(NON_PUBLISHERS.map((w) => [w] as const))('%s cannot create, change or delete a catalogue entry', async (who) => {
    await seed('story_library_admin/story_new', adminDocData('approved'));
    await assertFails(setDoc(doc(db(who), 'story_catalogue/story_new'), entry('story_new', { publishedBy: cast[who as keyof typeof cast]?.uid ?? 'x' })));
    await assertFails(updateDoc(doc(db(who), 'story_catalogue/story_pub'), { title: 'Hacked' }));
    await assertFails(deleteDoc(doc(db(who), 'story_catalogue/story_pub')));
  });
  it('a publisher can publish a story whose admin copy is APPROVED', async () => {
    await seed('story_library_admin/story_new', adminDocData('approved', { approvedBy: 'publisher2' }));
    await assertSucceeds(setDoc(doc(db('publisher1'), 'story_catalogue/story_new'), entry('story_new')));
  });
  it('a super admin counts as a publisher', async () => {
    await seed('story_library_admin/story_new', adminDocData('approved'));
    await assertSucceeds(setDoc(doc(db('superAdmin'), 'story_catalogue/story_new'), entry('story_new', { publishedBy: 'L4oE5XWweKRYrhtIXn6hB8IDHBC2' })));
  });
  it.each([['draft'], ['review']])('a story still in %s cannot be published', async (status) => {
    await seed('story_library_admin/story_new', adminDocData(status));
    await assertFails(setDoc(doc(db('publisher1'), 'story_catalogue/story_new'), entry('story_new')));
  });
  it('a story with no admin copy at all cannot be published', async () => {
    await assertFails(setDoc(doc(db('publisher1'), 'story_catalogue/story_orphan'), entry('story_orphan')));
  });
  it('a draft or archived status cannot be CREATED in the catalogue', async () => {
    await seed('story_library_admin/story_new', adminDocData('approved'));
    await assertFails(setDoc(doc(db('publisher1'), 'story_catalogue/story_new'), entry('story_new', { status: 'draft' })));
    await assertFails(setDoc(doc(db('publisher1'), 'story_catalogue/story_new'), entry('story_new', { status: 'archived' })));
  });
  it.each([
    ['an extra field (e.g. a school id)', { schoolId: 'schoolA' }],
    ['page text', { pages: [{ text: 'hi' }] }],
    ['a package path for another story', { packagePath: packagePathFor('someone_else', 1) }],
    ['a package path outside the library', { packagePath: 'schools/schoolA/x/package.json' }],
    ['publishedBy set to another person', { publishedBy: 'publisher2' }],
    ['zero pages', { pageCount: 0 }],
    ['41 pages', { pageCount: 41 }],
    ['no age tier', { ageTiers: [] }],
    ['seven age tiers', { ageTiers: ['1', '2', '3', '4', '5', '6', '7'] }],
    ['a 121-character title', { title: 'x'.repeat(121) }],
    ['21 categories', { categories: Array.from({ length: 21 }, (_, i) => `c${i}`) }],
    ['version 0', { version: 0 }],
  ])('a publisher cannot publish an entry with %s', async (_label, over) => {
    await seed('story_library_admin/story_new', adminDocData('approved'));
    await assertFails(setDoc(doc(db('publisher1'), 'story_catalogue/story_new'), entry('story_new', over as Record<string, unknown>)));
  });
  it('a publisher can archive a published entry (the tombstone), but it stays readable only to publishers', async () => {
    await assertSucceeds(setDoc(doc(db('publisher1'), 'story_catalogue/story_pub'), entry('story_pub', { status: 'archived' })));
    await assertFails(getDoc(doc(db('teacherA'), 'story_catalogue/story_pub')));
  });
  it('a new package version can replace the old one, but a lower package version cannot', async () => {
    await assertSucceeds(setDoc(doc(db('publisher1'), 'story_catalogue/story_pub'), entry('story_pub', { packageVersion: 2, packagePath: packagePathFor('story_pub', 2) })));
    await assertFails(setDoc(doc(db('publisher1'), 'story_catalogue/story_pub'), entry('story_pub', { packageVersion: 1 })));
  });
  it('nobody, not even a super admin, can delete a catalogue entry (archive instead)', async () => {
    await assertFails(deleteDoc(doc(db('publisher1'), 'story_catalogue/story_pub')));
    await assertFails(deleteDoc(doc(db('superAdmin'), 'story_catalogue/story_pub')));
  });
});

describe('story_library_admin: drafts, review, approval', () => {
  it.each(NON_PUBLISHERS.map((w) => [w] as const))('%s cannot read or write drafts, notes or licences', async (who) => {
    await assertFails(getDoc(doc(db(who), 'story_library_admin/story_draft')));
    await assertFails(getDocs(collection(db(who), 'story_library_admin')));
    await assertFails(setDoc(doc(db(who), 'story_library_admin/story_x'), adminDocData('draft', { createdBy: 'x' })));
    await assertFails(updateDoc(doc(db(who), 'story_library_admin/story_draft'), { title: 'Hacked' }));
    await assertFails(deleteDoc(doc(db(who), 'story_library_admin/story_draft')));
  });
  it.each(PUBLISHERS.map((w) => [w] as const))('%s (publisher) can read drafts', async (who) => {
    await assertSucceeds(getDoc(doc(db(who), 'story_library_admin/story_draft')));
  });
  it('a publisher can create a draft as themselves, but not as someone else, and not in a later state', async () => {
    await assertSucceeds(setDoc(doc(db('publisher2'), 'story_library_admin/story_x'), adminDocData('draft', { createdBy: 'publisher2' })));
    await assertFails(setDoc(doc(db('publisher2'), 'story_library_admin/story_y'), adminDocData('draft', { createdBy: 'publisher1' })));
    await assertFails(setDoc(doc(db('publisher2'), 'story_library_admin/story_z'), adminDocData('approved', { createdBy: 'publisher2' })));
    await assertFails(setDoc(doc(db('publisher2'), 'story_library_admin/story_w'), adminDocData('published', { createdBy: 'publisher2' })));
  });

  const setStatus = (who: Who, id: string, status: string, extra: Record<string, unknown> = {}) =>
    updateDoc(doc(db(who), `story_library_admin/${id}`), { status, updatedAt: new Date(), ...extra });

  it('draft <-> review is allowed and the content can be edited while in draft or review', async () => {
    await assertSucceeds(updateDoc(doc(db('publisher1'), 'story_library_admin/story_draft'), { title: 'A better title' }));
    await assertSucceeds(setStatus('publisher1', 'story_draft', 'review'));
    await assertSucceeds(setStatus('publisher1', 'story_draft', 'draft'));
  });
  it('the AUTHOR cannot approve their own story', async () => {
    await seed('story_library_admin/story_r', adminDocData('review'));
    await assertFails(setStatus('publisher1', 'story_r', 'approved', { approvedBy: 'publisher1' }));
  });
  it('a different publisher can approve, but only by recording themselves as the approver', async () => {
    await seed('story_library_admin/story_r', adminDocData('review'));
    await assertFails(setStatus('publisher2', 'story_r', 'approved'));
    await assertFails(setStatus('publisher2', 'story_r', 'approved', { approvedBy: 'publisher1' }));
    await assertSucceeds(setStatus('publisher2', 'story_r', 'approved', { approvedBy: 'publisher2' }));
  });
  it('a draft cannot jump to approved or published', async () => {
    await assertFails(setStatus('publisher2', 'story_draft', 'approved', { approvedBy: 'publisher2' }));
    await assertFails(setStatus('publisher2', 'story_draft', 'published', { publishedBy: 'publisher2' }));
  });
  it('approved -> published works, and the approved/published content is then frozen', async () => {
    await seed('story_library_admin/story_a', adminDocData('approved', { approvedBy: 'publisher2' }));
    await assertFails(updateDoc(doc(db('publisher1'), 'story_library_admin/story_a'), { title: 'Edited after approval' }));
    await assertSucceeds(setStatus('publisher1', 'story_a', 'published', { publishedBy: 'publisher1' }));
    await assertFails(updateDoc(doc(db('publisher1'), 'story_library_admin/story_a'), { title: 'Edited after publication' }));
  });
  it('published -> archived works; archived -> review re-opens it; archived cannot go straight back to published', async () => {
    await assertSucceeds(setStatus('publisher1', 'story_pub', 'archived', { archivedBy: 'publisher1' }));
    await assertFails(setStatus('publisher1', 'story_pub', 'published', { publishedBy: 'publisher1' }));
    await assertSucceeds(setStatus('publisher1', 'story_pub', 'review'));
  });
  it('the author field cannot be changed to dodge four-eyes approval', async () => {
    await seed('story_library_admin/story_r', adminDocData('review'));
    await assertFails(updateDoc(doc(db('publisher1'), 'story_library_admin/story_r'), { createdBy: 'publisher2' }));
  });
  it('only an unpublished draft can be deleted', async () => {
    await seed('story_library_admin/story_r', adminDocData('review'));
    await assertSucceeds(deleteDoc(doc(db('publisher1'), 'story_library_admin/story_draft')));
    await assertFails(deleteDoc(doc(db('publisher1'), 'story_library_admin/story_r')));
    await assertFails(deleteDoc(doc(db('publisher1'), 'story_library_admin/story_pub')));
  });
});

describe('super admins are bound by the same workflow (they are publishers, not exempt)', () => {
  const SUPER = 'L4oE5XWweKRYrhtIXn6hB8IDHBC2';
  it('a super admin cannot publish a story whose admin copy is not approved', async () => {
    await seed('story_library_admin/story_new', adminDocData('review'));
    await assertFails(setDoc(doc(db('superAdmin'), 'story_catalogue/story_new'), entry('story_new', { publishedBy: SUPER })));
  });
  it('a super admin cannot approve a story they wrote themselves', async () => {
    await seed('story_library_admin/story_s', adminDocData('review', { createdBy: SUPER }));
    await assertFails(updateDoc(doc(db('superAdmin'), 'story_library_admin/story_s'), { status: 'approved', approvedBy: SUPER, updatedAt: new Date() }));
  });
  it('a super admin cannot skip the schema checks or edit a published story', async () => {
    await seed('story_library_admin/story_new', adminDocData('approved'));
    await assertFails(setDoc(doc(db('superAdmin'), 'story_catalogue/story_new'), entry('story_new', { publishedBy: SUPER, schoolId: 'schoolA' })));
    await assertFails(updateDoc(doc(db('superAdmin'), 'story_library_admin/story_pub'), { title: 'Edited after publication' }));
  });
  it('a super admin cannot delete published work', async () => {
    await assertFails(deleteDoc(doc(db('superAdmin'), 'story_library_admin/story_pub')));
  });
  it('a super admin still reads a school-private collection exactly as before (the exclusion is library-only)', async () => {
    await seed('junior_stories/s2', { title: 'T', content: 'c', schoolId: SCHOOL_A, createdBy: 'teacherA' });
    await assertSucceeds(getDoc(doc(db('superAdmin'), 'junior_stories/s2')));
  });
});

describe('library_seed_jobs', () => {
  it('publishers read and write; everyone else is refused', async () => {
    await assertSucceeds(setDoc(doc(db('publisher1'), 'library_seed_jobs/job1'), { state: 'running' }));
    await assertSucceeds(setDoc(doc(db('publisher1'), 'library_seed_jobs/job1/items/key-1'), { state: 'done' }));
    for (const who of NON_PUBLISHERS) {
      await verdict(false)(getDoc(doc(db(who), 'library_seed_jobs/job1')));
      await verdict(false)(setDoc(doc(db(who), 'library_seed_jobs/job2'), { state: 'x' }));
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
  it('being a library publisher gives no extra power over a school\'s junior_stories', async () => {
    await seed('junior_stories/s1', { title: 'T', content: 'c', schoolId: SCHOOL_A, createdBy: 'teacherA' });
    await assertFails(updateDoc(doc(db('publisher1'), 'junior_stories/s1'), { title: 'Edited by publisher' }));
    await assertFails(deleteDoc(doc(db('publisher1'), 'junior_stories/s1')));
  });
});
