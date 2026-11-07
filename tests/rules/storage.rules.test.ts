/**
 * Cloud Storage rules — emulator tests.
 *
 * Every feature that uses Storage is exercised with its REAL path (copied from the app code), for every person in
 * the cast, for read / write / delete. The expected sets below ARE the access policy: if a row is wrong, either
 * the rules or the policy needs to change, and a reviewer can see exactly which.
 *
 * Run:  npm run test:rules   (starts the Firestore + Storage emulators, needs Java)
 */
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { assertSucceeds, assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { ref, uploadBytes, getBytes, deleteObject } from 'firebase/storage';
import { cast, as, createEnv, readRules, seedProfiles, SCHOOL_A, SCHOOL_B, type ActorName } from './helpers';
import { buildStoryCoverPath } from '../../src/lib/story-spark/storage-path';

let env: RulesTestEnvironment;
const bytes = new Uint8Array([1, 2, 3, 4]);
const PNG = { contentType: 'image/png' };
const PDF = { contentType: 'application/pdf' };
const HTML = { contentType: 'text/html' };

const ALL = [...(Object.keys(cast) as ActorName[]), 'anon' as const];

// ---- who may do what, per school A (people not listed are DENIED) ----
const A_MEMBERS: ActorName[] = ['adminA', 'registrarA', 'teacherA', 'teacherA2', 'cookA', 'pupilA', 'pupilA2', 'parentA', 'staffOnlyA', 'superAdmin'];
const A_STAFF: ActorName[] = ['adminA', 'registrarA', 'teacherA', 'teacherA2', 'cookA', 'staffOnlyA', 'superAdmin'];
const A_ADMINS: ActorName[] = ['adminA', 'registrarA', 'superAdmin'];

// ---- the app's real storage paths (see docs/STORY-SPARK-2.0-PLAN.md, "Storage inventory") ----
const P = {
  logo: (s: string) => `schools/${s}/assets/logo`,                                                    // school-profile page
  website: (s: string) => `schools/${s}/website/cover`,                                               // website-builder page
  gallery: (s: string) => `schools/${s}/website/gallery_1700000000000_0`,
  profilePic: (s: string, uid: string) => `schools/${s}/students/${uid}/profile_pic`,                 // students-v3, id-cards
  timeline: (s: string, uid: string) => `schools/${s}/students/${uid}/timeline/evt1/1700000000000_note.pdf`, // StudentJourneyTimeline
  material: (s: string) => `schools/${s}/learning_materials/general/1700000000000-notes.pdf`,         // learning-materials page
  submission: (s: string, uid: string) => `schools/${s}/submissions/asg1/${uid}/1700000000000-essay.pdf`, // assignments student-view
  chat: (s: string, chatId: string) => `schools/${s}/chats/${chatId}/1700000000000_pic.jpg`,          // messages page
  attendance: (s: string, uid: string) => `schools/${s}/staff_attendance/${uid}/2026-11-06_in_1.jpg`, // staff-clock (server, Admin SDK)
  cover: (s: string, uid: string) => buildStoryCoverPath(s, uid, 1700000000000)!,                     // Story Spark
  signature: (s: string, uid: string) => `signatures/${s}/${uid}/signature.png`,                      // SignatureManager
};

const st = (who: ActorName) => as(env, who).storage();
const put = (who: ActorName, path: string, meta: { contentType: string } = PNG) => uploadBytes(ref(st(who), path), bytes, meta);
const read = (who: ActorName, path: string) => getBytes(ref(st(who), path));
const remove = (who: ActorName, path: string) => deleteObject(ref(st(who), path));
const seed = (path: string, meta: { contentType: string } = PNG) =>
  env.withSecurityRulesDisabled(async (ctx) => { await uploadBytes(ref(ctx.storage(), path), bytes, meta); });
const verdict = (ok: boolean) => (ok ? assertSucceeds : assertFails);

interface Feature {
  path: string;
  meta?: { contentType: string };
  read: ActorName[];
  write: ActorName[];
  del: ActorName[];
}

function matrix(title: string, f: Feature) {
  describe(title, () => {
    beforeAll(() => seed(f.path, f.meta));
    it.each(ALL.map((w) => [w, f.read.includes(w)] as const))('read   — %s → allowed: %s', async (who, ok) => {
      await verdict(ok)(read(who, f.path));
    });
    it.each(ALL.map((w) => [w, f.write.includes(w)] as const))('write  — %s → allowed: %s', async (who, ok) => {
      await verdict(ok)(put(who, f.path, f.meta));
    });
    it.each(ALL.map((w) => [w, f.del.includes(w)] as const))('delete — %s → allowed: %s', async (who, ok) => {
      await seed(f.path, f.meta);
      await verdict(ok)(remove(who, f.path));
    });
  });
}

const ALLOW_ALL_FIRESTORE = 'rules_version = "2"; service cloud.firestore { match /databases/{d}/documents { match /{document=**} { allow read, write: if true; } } }';
/**
 * (Re)loads storage.rules and the profile documents. NOTE: the Storage emulator holds ONE rule set for the whole
 * emulator (not one per project), so any test that loads other rules (the "legacy" block) must call this again afterwards.
 */
async function loadNewRules() {
  env = await createEnv('demo-gam-edu', { storage: readRules('storage.rules'), firestore: ALLOW_ALL_FIRESTORE });
  await seedProfiles(env, {
    // chat1: school A, teacherA + pupilA. chat2: school B. chat3: a school-B chat that teacherA is in (must not unlock school A's folder).
    'direct_messages/chat1': { schoolId: SCHOOL_A, participants: ['teacherA', 'pupilA'] },
    'direct_messages/chat2': { schoolId: SCHOOL_B, participants: ['teacherB'] },
    'direct_messages/chat3': { schoolId: SCHOOL_B, participants: ['teacherA'] },
  });
}
beforeAll(loadNewRules);
afterAll(async () => { await env?.cleanup(); });

describe('Storage rules — membership is decided from Firestore, per school', () => {
  matrix('School logo  schools/{school}/assets/logo', {
    path: P.logo(SCHOOL_A), read: A_MEMBERS, write: A_ADMINS, del: A_ADMINS,
  });
  matrix('Website media  schools/{school}/website/cover', {
    path: P.website(SCHOOL_A), read: A_MEMBERS, write: A_ADMINS, del: A_ADMINS,
  });
  matrix('Website gallery  schools/{school}/website/gallery_…', {
    path: P.gallery(SCHOOL_A), read: A_MEMBERS, write: A_ADMINS, del: A_ADMINS,
  });
  matrix('Pupil profile photo  schools/{school}/students/{pupil}/profile_pic', {
    path: P.profilePic(SCHOOL_A, 'pupilA'), read: [...A_STAFF, 'pupilA'], write: A_STAFF, del: A_STAFF,
  });
  matrix('Pupil timeline attachment  schools/{school}/students/{pupil}/timeline/…', {
    path: P.timeline(SCHOOL_A, 'pupilA'), meta: PDF, read: A_STAFF, write: A_STAFF, del: A_STAFF,
  });
  matrix('Learning material  schools/{school}/learning_materials/…', {
    path: P.material(SCHOOL_A), meta: PDF, read: A_MEMBERS, write: A_STAFF, del: A_STAFF,
  });
  matrix("Assignment submission (pupilA's folder)  schools/{school}/submissions/{assignment}/{pupil}/…", {
    path: P.submission(SCHOOL_A, 'pupilA'), meta: PDF, read: ['pupilA', ...A_STAFF], write: ['pupilA'], del: ['pupilA', ...A_STAFF],
  });
  matrix('Chat attachment (chat1: teacherA + pupilA)  schools/{school}/chats/{chat}/…', {
    path: P.chat(SCHOOL_A, 'chat1'), meta: { contentType: 'image/jpeg' }, read: ['teacherA', 'pupilA'], write: ['teacherA', 'pupilA'], del: [],
  });
  matrix("Staff clock-in selfie (teacherA's)  schools/{school}/staff_attendance/{staff}/…", {
    path: P.attendance(SCHOOL_A, 'teacherA'), meta: { contentType: 'image/jpeg' }, read: [...A_ADMINS, 'teacherA'], write: [], del: [],
  });
  matrix('Story Spark cover  schools/{school}/junior_stories/…', {
    path: P.cover(SCHOOL_A, 'teacherA'), read: A_MEMBERS, write: A_STAFF, del: A_STAFF,
  });
  matrix("Signature (teacherA's)  signatures/{school}/{user}/signature.png", {
    path: P.signature(SCHOOL_A, 'teacherA'), read: A_MEMBERS, write: ['teacherA'], del: ['teacherA'],
  });
});

describe('Storage rules — people can see only their own school', () => {
  it('school B people get school B, and only school B', async () => {
    await assertSucceeds(put('adminB', P.logo(SCHOOL_B)));
    await assertSucceeds(put('teacherB', P.material(SCHOOL_B), PDF));
    await assertFails(put('adminB', P.logo(SCHOOL_A)));
    await assertFails(put('teacherB', P.material(SCHOOL_A), PDF));
    await assertFails(read('teacherB', P.material(SCHOOL_A)));
  });

  it('changing the school id in the path never helps: admin A cannot touch school B', async () => {
    await seed(P.logo(SCHOOL_B));
    await assertFails(put('adminA', P.logo(SCHOOL_B)));
    await assertFails(read('adminA', P.logo(SCHOOL_B)));
    await assertFails(remove('adminA', P.logo(SCHOOL_B)));
  });

  it('a platform super admin can act in any school', async () => {
    await seed(P.logo(SCHOOL_B));
    await assertSucceeds(put('superAdmin', P.logo(SCHOOL_B)));
    await assertSucceeds(read('superAdmin', P.logo(SCHOOL_B)));
  });

  it("a pupil cannot read or write another pupil's submissions, in their own school or another", async () => {
    await seed(P.submission(SCHOOL_A, 'pupilA2'), PDF);
    await assertFails(read('pupilA', P.submission(SCHOOL_A, 'pupilA2')));
    await assertFails(put('pupilA', P.submission(SCHOOL_A, 'pupilA2'), PDF));
    await assertFails(put('pupilB', P.submission(SCHOOL_A, 'pupilB'), PDF)); // own uid, wrong school
  });

  it("a teacher at school B cannot read a school A pupil's photo or timeline", async () => {
    await seed(P.profilePic(SCHOOL_A, 'pupilA'));
    await seed(P.timeline(SCHOOL_A, 'pupilA'), PDF);
    await assertFails(read('teacherB', P.profilePic(SCHOOL_A, 'pupilA')));
    await assertFails(read('teacherB', P.timeline(SCHOOL_A, 'pupilA')));
  });

  it('a chat from another school cannot be used to open school A\'s chat folder', async () => {
    // chat3 belongs to school B but teacherA is a participant: its files must stay in school B's folder.
    await assertFails(put('teacherA', P.chat(SCHOOL_A, 'chat3'), { contentType: 'image/jpeg' }));
    await assertSucceeds(put('teacherA', P.chat(SCHOOL_B, 'chat3'), { contentType: 'image/jpeg' }));
  });

  it('a chat that does not exist has no files', async () => {
    await assertFails(put('teacherA', P.chat(SCHOOL_A, 'no-such-chat'), { contentType: 'image/jpeg' }));
  });

  it('nobody can delete chat files, not even participants', async () => {
    await seed(P.chat(SCHOOL_A, 'chat1'), { contentType: 'image/jpeg' });
    await assertFails(remove('teacherA', P.chat(SCHOOL_A, 'chat1')));
  });

  it('even a super admin cannot write staff selfies from a browser (only the server can)', async () => {
    await assertFails(put('superAdmin', P.attendance(SCHOOL_A, 'teacherA'), { contentType: 'image/jpeg' }));
  });
});

describe('Storage rules — missing, stale and forged claims', () => {
  it('a stale claim (token says school A, profile says school B): school B access only', async () => {
    await assertSucceeds(put('staleClaimUser', P.material(SCHOOL_B), PDF));
    await assertFails(put('staleClaimUser', P.material(SCHOOL_A), PDF));
    await seed(P.material(SCHOOL_A), PDF);
    await assertFails(read('staleClaimUser', P.material(SCHOOL_A)));
  });

  it('a token claim with no profile documents behind it grants nothing', async () => {
    await assertFails(put('claimOnlyUser', P.material(SCHOOL_A), PDF));
    await seed(P.material(SCHOOL_A), PDF);
    await assertFails(read('claimOnlyUser', P.material(SCHOOL_A)));
  });

  it('a signed-in user with no school has no access anywhere', async () => {
    await seed(P.material(SCHOOL_A), PDF);
    await assertFails(read('noDocsUser', P.material(SCHOOL_A)));
    await assertFails(put('noDocsUser', P.logo(SCHOOL_A)));
    await assertFails(put('noDocsUser', P.signature(SCHOOL_A, 'noDocsUser')));
  });

  it('a made-up role claim does not make anyone a super admin', async () => {
    await assertFails(put('fakeSuperClaim', P.logo(SCHOOL_A)));
    await assertFails(put('fakeSuperClaim', P.logo(SCHOOL_B)));
  });

  it("the real super-admin token claim (role == 'super_admin') is honoured", async () => {
    const ctx = env.authenticatedContext('someoneElse', { role: 'super_admin' });
    await assertSucceeds(uploadBytes(ref(ctx.storage(), P.logo(SCHOOL_A)), bytes, PNG));
  });

  it('older accounts keep working: staff with only a staff/{uid} document; pupil with only a students/{uid} document', async () => {
    await assertSucceeds(put('staffOnlyA', P.material(SCHOOL_A), PDF));
    await assertSucceeds(put('studentsDocOnlyA', P.submission(SCHOOL_A, 'studentsDocOnlyA'), PDF));
    await assertSucceeds(read('studentsDocOnlyA', P.submission(SCHOOL_A, 'studentsDocOnlyA')));
  });
});

describe('Storage rules — file types and unknown paths', () => {
  it.each([
    ['logo', P.logo(SCHOOL_A), 'adminA'],
    ['website media', P.website(SCHOOL_A), 'adminA'],
    ['pupil photo', P.profilePic(SCHOOL_A, 'pupilA'), 'teacherA'],
    ['story cover', P.cover(SCHOOL_A, 'teacherA'), 'teacherA'],
    ['signature', P.signature(SCHOOL_A, 'teacherA'), 'teacherA'],
  ] as const)('%s must be an image: html is refused, png and jpeg are accepted', async (_n, path, who) => {
    await assertFails(put(who, path, HTML));
    await assertFails(put(who, path, PDF));
    await assertSucceeds(put(who, path, PNG));
    await assertSucceeds(put(who, path, { contentType: 'image/jpeg' }));
  });

  it('documents are accepted where documents belong', async () => {
    await assertSucceeds(put('teacherA', P.material(SCHOOL_A), PDF));
    await assertSucceeds(put('teacherA', P.timeline(SCHOOL_A, 'pupilA'), PDF));
    await assertSucceeds(put('pupilA', P.submission(SCHOOL_A, 'pupilA'), { contentType: 'application/octet-stream' }));
  });

  it.each([
    'schools/schoolA/unlisted/file.png',
    'schools/schoolA/file-at-school-root.png',
    'schools/schoolA',
    'junior_stories/teacherA_1700000000000_cover.png',
    'uploads/anything.png',
    'anything.png',
  ])('unknown path %s is closed to everyone, including admins and super admins', async (path) => {
    await seed(path);
    for (const who of ['adminA', 'teacherA', 'superAdmin', 'anon'] as ActorName[]) {
      await assertFails(read(who, path));
      await assertFails(put(who, path));
    }
  });
});

describe('Regression: the Story Spark cover fix (Phase 1) works under the new rules', () => {
  it('the path the component now uses is accepted for a teacher, and the old path it used is denied', async () => {
    const newPath = buildStoryCoverPath(SCHOOL_A, 'teacherA')!;
    const oldPath = 'junior_stories/teacherA_1700000000000_cover.png';
    expect(newPath.startsWith(`schools/${SCHOOL_A}/junior_stories/`)).toBe(true);
    await assertSucceeds(put('teacherA', newPath)); // uploadString(data_url) sends image/png
    await assertFails(put('teacherA', oldPath));
  });

  it('a teacher cannot save a cover into another school by supplying its id', async () => {
    await assertFails(put('teacherA', buildStoryCoverPath(SCHOOL_B, 'teacherA')!));
  });
});

describe('Before/after: the legacy rule really was open (documents the vulnerability being fixed)', () => {
  let legacy: RulesTestEnvironment;
  beforeAll(async () => {
    legacy = await createEnv('demo-gam-edu-storage-legacy', { storage: readRules('tests/rules/fixtures/legacy-storage.rules') });
  });
  afterAll(async () => { await legacy?.cleanup(); });
  beforeEach(async () => {
    await legacy.withSecurityRulesDisabled(async (ctx) => { await uploadBytes(ref(ctx.storage(), P.logo(SCHOOL_A)), bytes, PNG); });
  });

  it('LEGACY: a teacher at school B could read, overwrite and delete school A\'s logo', async () => {
    const s = legacy.authenticatedContext('teacherB').storage();
    await assertSucceeds(getBytes(ref(s, P.logo(SCHOOL_A))));
    await assertSucceeds(uploadBytes(ref(s, P.logo(SCHOOL_A)), bytes, PNG));
    await assertSucceeds(deleteObject(ref(s, P.logo(SCHOOL_A))));
  });

  it('LEGACY: a user with no school at all could do the same', async () => {
    const s = legacy.authenticatedContext('nobody').storage();
    await assertSucceeds(uploadBytes(ref(s, P.logo(SCHOOL_A)), bytes, PNG));
  });

  it('LEGACY: anyone could write any other signatures folder (the path school id was never checked)', async () => {
    const s = legacy.authenticatedContext('teacherB').storage();
    await assertSucceeds(uploadBytes(ref(s, P.signature(SCHOOL_A, 'teacherB')), bytes, PNG));
  });

  it('NEW rules deny the same three attacks', async () => {
    await loadNewRules(); // the legacy rules above replaced the emulator's rule set
    await seed(P.logo(SCHOOL_A));
    await assertFails(read('teacherB', P.logo(SCHOOL_A)));
    await assertFails(put('teacherB', P.logo(SCHOOL_A)));
    await assertFails(remove('teacherB', P.logo(SCHOOL_A)));
    await assertFails(put('noDocsUser', P.logo(SCHOOL_A)));
    await assertFails(put('teacherB', P.signature(SCHOOL_A, 'teacherB')));
  });
});

