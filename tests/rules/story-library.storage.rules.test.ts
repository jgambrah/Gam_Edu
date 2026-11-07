/**
 * Cloud Storage rules: Central Story Library (emulator tests). Run: npm run test:rules
 *
 *  story_library/published/**  readable by publishers and by signed-in members of a school; never writable from a client.
 *  story_library/private/**    staging: publishers only, create-only (immutable), type and size limited.
 *
 * Known limit pinned in a test below: a person whose only profile is a `students/{uid}` document (no users/ or staff/
 * document) can read the catalogue (firestore.rules) but not the Storage files (a rule may do only two lookups).
 * Run `scripts/audit-school-membership.ts` (read-only) to count such accounts before enabling the library.
 */
import { describe, it, beforeAll, afterAll } from 'vitest';
import { assertSucceeds, assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { ref, uploadBytes, getBytes, deleteObject } from 'firebase/storage';
import { as, cast, createEnv, readRules, seedProfiles, type ActorName } from './helpers';
import { assetPathFor } from '../../src/lib/story-library/validate';

let env: RulesTestEnvironment;
type Who = ActorName | 'publisher1' | 'claimFalse' | 'roleOnly';

const ALLOW_ALL_FIRESTORE = 'rules_version = "2"; service cloud.firestore { match /databases/{d}/documents { match /{document=**} { allow read, write: if true; } } }';

const ctx = (who: Who) => {
  switch (who) {
    case 'publisher1': return env.authenticatedContext('publisher1', { email: 'publisher1@test.example', story_publisher: true });
    case 'claimFalse': return env.authenticatedContext('claimFalse', { email: 'cf@test.example', story_publisher: false });
    case 'roleOnly': return env.authenticatedContext('roleOnly', { email: 'ro@test.example', role: 'Publisher' });
    default: return as(env, who);
  }
};
const st = (who: Who) => ctx(who).storage();
const bytes = new Uint8Array([1, 2, 3, 4]);
const WEBP = { contentType: 'image/webp' };

const HASH = `sha256:${'c'.repeat(64)}`;
const PUBLISHED = assetPathFor(HASH, 'webp')!;
const PACKAGE = 'story_library/published/packages/story_0001/v1/package.json';
const PRIVATE = 'story_library/private/job1/draft-page-1.webp';

const put = (who: Who, path: string, meta: { contentType: string } = WEBP, data: Uint8Array = bytes) => uploadBytes(ref(st(who), path), data, meta);
const read = (who: Who, path: string) => getBytes(ref(st(who), path));
const remove = (who: Who, path: string) => deleteObject(ref(st(who), path));
const seedFile = (path: string, meta: { contentType: string } = WEBP) =>
  env.withSecurityRulesDisabled(async (c) => { await uploadBytes(ref(c.storage(), path), bytes, meta); });

// The Storage emulator holds ONE ruleset for the whole emulator, so load it here (other files load their own).
beforeAll(async () => {
  env = await createEnv('demo-gam-edu', { storage: readRules('storage.rules'), firestore: ALLOW_ALL_FIRESTORE });
  await seedProfiles(env);
});
afterAll(async () => { await env?.cleanup(); });

const MEMBERS: Who[] = ['teacherA', 'adminA', 'registrarA', 'cookA', 'pupilA', 'parentA', 'staffOnlyA', 'teacherB', 'pupilB', 'parentB'];
const PUBLISHERS: Who[] = ['publisher1', 'superAdmin'];
const OUTSIDERS: Who[] = ['anon', 'noDocsUser', 'claimOnlyUser', 'fakeSuperClaim', 'claimFalse', 'roleOnly'];
const NON_PUBLISHERS: Who[] = [...MEMBERS, ...OUTSIDERS, 'studentsDocOnlyA'];

describe('published files: read', () => {
  beforeAll(async () => { await seedFile(PUBLISHED); await seedFile(PACKAGE, { contentType: 'application/json' }); });
  it.each([...MEMBERS, ...PUBLISHERS].map((w) => [w] as const))('%s can read a published asset and package', async (who) => {
    await assertSucceeds(read(who, PUBLISHED));
    await assertSucceeds(read(who, PACKAGE));
  });
  it.each(OUTSIDERS.map((w) => [w] as const))('%s cannot read them', async (who) => {
    await assertFails(read(who, PUBLISHED));
    await assertFails(read(who, PACKAGE));
  });
  it('PINNED LIMIT: an account with only a students/ profile document cannot read Storage files (but can read the catalogue)', async () => {
    await assertFails(read('studentsDocOnlyA', PUBLISHED));
  });
});

describe('published files: nobody writes from a client (the server promotes approved files)', () => {
  it.each([...NON_PUBLISHERS, ...PUBLISHERS].map((w) => [w] as const))('%s cannot create, overwrite or delete a published file', async (who) => {
    await seedFile(PUBLISHED);
    await assertFails(put(who, `story_library/published/assets/zz/${'d'.repeat(64)}.webp`));
    await assertFails(put(who, PUBLISHED));
    await assertFails(remove(who, PUBLISHED));
  });
});

describe('private staging', () => {
  it.each(NON_PUBLISHERS.map((w) => [w] as const))('%s cannot read, write or delete staged drafts', async (who) => {
    await seedFile(PRIVATE);
    await assertFails(read(who, PRIVATE));
    await assertFails(put(who, 'story_library/private/job1/new.webp'));
    await assertFails(remove(who, PRIVATE));
  });
  it.each(PUBLISHERS.map((w) => [w] as const))('%s can stage, read and delete a draft file', async (who) => {
    await assertSucceeds(put(who, `story_library/private/job-${who}/page-1.webp`));
    await assertSucceeds(read(who, `story_library/private/job-${who}/page-1.webp`));
    await assertSucceeds(remove(who, `story_library/private/job-${who}/page-1.webp`));
  });
  it('a staged object is immutable: it cannot be overwritten, even by a publisher', async () => {
    await seedFile(PRIVATE);
    await assertFails(put('publisher1', PRIVATE));
  });
  it.each([
    ['narration (ogg)', 'audio/ogg'],
    ['narration (opus)', 'audio/opus'],
    ['a story package (json)', 'application/json'],
    ['an illustration (png)', 'image/png'],
  ])('a publisher may stage %s', async (_l, contentType) => {
    await assertSucceeds(put('publisher1', `story_library/private/job2/${contentType.replace('/', '_')}.bin`, { contentType }));
  });
  it.each([['html', 'text/html'], ['a pdf', 'application/pdf'], ['an executable', 'application/octet-stream']])('a publisher cannot stage %s', async (_l, contentType) => {
    await assertFails(put('publisher1', `story_library/private/job3/${contentType.replace('/', '_')}.bin`, { contentType }));
  });
  it('a file over 4 MB is refused', async () => {
    await assertFails(put('publisher1', 'story_library/private/job4/big.webp', WEBP, new Uint8Array(4 * 1024 * 1024 + 1)));
    await assertSucceeds(put('publisher1', 'story_library/private/job4/ok.webp', WEBP, new Uint8Array(1024 * 1024)));
  });
});

describe('compatibility: existing school-created story covers are untouched', () => {
  it('a teacher can still store and read a cover under schools/{school}/junior_stories/, a pupil of the school can read it', async () => {
    const path = 'schools/schoolA/junior_stories/teacherA_1700000000000_cover.png';
    await assertSucceeds(put('teacherA', path, { contentType: 'image/png' }));
    await assertSucceeds(read('pupilA', path));
    await assertFails(read('pupilB', path));
  });
  it('library publishers have no access to a school\'s private folders', async () => {
    await seedFile('schools/schoolA/assets/logo', { contentType: 'image/png' });
    await assertFails(read('publisher1', 'schools/schoolA/assets/logo'));
  });
});
