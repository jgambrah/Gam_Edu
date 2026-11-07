/**
 * Seeder against the REAL Firestore (and Storage) EMULATORS, then the client security rules against what it wrote.
 * Run: npm run test:rules  (starts the emulators; refuses to run without them).
 *
 * Proves, end to end:
 *  - the Admin-SDK seeder works with real Firestore transactions (reads-before-writes, contention, crash/resume);
 *  - everything it writes is a DRAFT that no school can see;
 *  - no client (publisher or super admin) can publish a seeded draft without the independent approval workflow;
 *  - a seeded story's author (`seeder-bot`) can never approve it;
 *  - rollback never destroys work a person has moved on.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { assertSucceeds, assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, query, where, limit, serverTimestamp } from 'firebase/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { as, createEnv, readRules, seedProfiles } from './helpers';
import { createEmulatorBackend, type EmulatorBackend } from '../../src/lib/story-library/seeder/firestore-backend';
import { runSeed, rollbackJob } from '../../src/lib/story-library/seeder/seeder';
import { generateCorpus, makeStory } from '../../src/lib/story-library/seeder/synthetic';
import { FaultyBackend } from '../../src/lib/story-library/seeder/memory-backend';
import { ProcessCrash, SEEDER_UID } from '../../src/lib/story-library/seeder/types';
import { packagePathFor } from '../../src/lib/story-library/validate';

const PROJECT = 'demo-gam-edu-seeder';
let env: RulesTestEnvironment;
let seeded: EmulatorBackend;
const corpus = generateCorpus({ count: 1000, seed: 21 }); // ~1,000 synthetic stories, as approved
let jobId = '';

const pub = (uid: string) => env.authenticatedContext(uid, { email: `${uid}@test.example`, story_publisher: true }).firestore();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const adminCount = async (b: EmulatorBackend) => (await b.db.collection('story_library_admin').get()).size;

const catalogueEntryFor = (id: string, d: Record<string, any>) => ({
  storyKey: d.storyKey, version: 1, packageVersion: 1, status: 'published', title: d.title, ageTiers: d.ageTiers,
  pageCount: d.pageCount, packagePath: packagePathFor(id, 1), packageHash: d.packageHash, contentHash: d.contentHash, publishedBy: 'publisher1',
});

beforeAll(async () => {
  env = await createEnv(PROJECT, { firestore: readRules('firestore.rules') });
  await seedProfiles(env, { 'schools/schoolA': { name: 'School A' } });
  seeded = createEmulatorBackend(PROJECT);
  const t0 = Date.now();
  const s = await runSeed(seeded.backend, corpus.stories, { owner: 'emu-1', parallel: 4 });
  jobId = s.jobId;
  // eslint-disable-next-line no-console
  console.log(`[emulator seeding] ${corpus.stories.length} stories via Admin SDK + Firestore emulator in ${Date.now() - t0} ms; outcomes=${JSON.stringify(s.outcomes)}; completed=${s.completed}`);
  expect(s.completed).toBe(true);
}, 600_000);

afterAll(async () => { await seeded?.close(); await env?.cleanup(); });

describe('seeding on the real emulator', () => {
  it('writes only drafts authored by the seeder, one per distinct story', async () => {
    const snap = await seeded.db.collection('story_library_admin').get();
    expect(snap.size).toBe(corpus.distinct.length);
    for (const d of snap.docs) {
      expect(d.get('status')).toBe('draft');
      expect(d.get('createdBy')).toBe(SEEDER_UID);
      expect(d.get('synthetic')).toBe(true);
    }
  });

  it('duplicates were blocked; nothing reached the catalogue or library_meta', async () => {
    const ids = new Set((await seeded.db.collection('story_library_admin').get()).docs.map((d) => d.id));
    for (const e of corpus.planted.exact) expect(ids.has(e.key)).toBe(false);
    for (const n of corpus.planted.near) expect(ids.has(n.key)).toBe(false);
    expect((await seeded.db.collection('story_catalogue').get()).size).toBe(0);
    expect((await seeded.db.doc('library_meta/current').get()).exists).toBe(false);
  });

  it('a second run is a no-op', async () => {
    const before = await adminCount(seeded);
    const s = await runSeed(seeded.backend, corpus.stories, { owner: 'emu-2', parallel: 4 });
    expect(s.alreadyCompleted).toBe(true);
    expect(await adminCount(seeded)).toBe(before);
  });
});

describe('client rules over seeded drafts', () => {
  const draftId = () => corpus.distinct[0];

  it('schools cannot see seeded drafts, job records or the duplicate index', async () => {
    const teacher = as(env, 'teacherA').firestore();
    await assertFails(getDoc(doc(teacher, `story_library_admin/${draftId()}`)));
    await assertFails(getDoc(doc(teacher, `library_seed_jobs/${jobId}`)));
    await assertFails(getDoc(doc(teacher, `library_seed_jobs/${jobId}/items/${draftId()}`)));
    const list = await assertSucceeds(getDocs(query(collection(teacher, 'story_catalogue'), where('status', '==', 'published'), limit(10))));
    expect(list.size).toBe(0);
  });

  it('publishers can read drafts and job records, but cannot write job or index records', async () => {
    const p = pub('publisher1');
    await assertSucceeds(getDoc(doc(p, `story_library_admin/${draftId()}`)));
    await assertSucceeds(getDoc(doc(p, `library_seed_jobs/${jobId}`)));
    await assertFails(setDoc(doc(p, `library_seed_jobs/${jobId}/items/${draftId()}`), { state: 'forged' }));
    await assertFails(setDoc(doc(p, 'library_seed_jobs/_index/text/abc'), { storyKey: 'x' }));
  });

  it('no client can publish a seeded draft: not a publisher, not the super admin', async () => {
    const id = corpus.distinct[1];
    const d = (await seeded.db.doc(`story_library_admin/${id}`).get()).data()!;
    const entry = catalogueEntryFor(id, d);
    await assertFails(setDoc(doc(pub('publisher1'), `story_catalogue/${id}`), entry));
    await assertFails(setDoc(doc(as(env, 'superAdmin').firestore(), `story_catalogue/${id}`), entry));
    // the catalogue is server-only: even a genuinely published admin copy gives a client no write path
    const other = corpus.distinct[2];
    const od = (await seeded.db.doc(`story_library_admin/${other}`).get()).data()!;
    await seeded.db.doc(`story_library_admin/${other}`).update({ status: 'published' });
    await assertFails(setDoc(doc(pub('publisher1'), `story_catalogue/${other}`), catalogueEntryFor(other, od)));
    await assertFails(setDoc(doc(as(env, 'superAdmin').firestore(), `story_catalogue/${other}`), catalogueEntryFor(other, od)));
    await seeded.db.doc(`story_library_admin/${other}`).update({ status: 'draft' }); // restore for later tests
  });
  /** The server-written readiness record for a seeded story's current content (what the publication service computes). */
  const markReady = async (id: string, reviewerIds: string[] = []) => {
    const d = (await seeded.db.doc(`story_library_admin/${id}`).get()).data()!;
    await seeded.db.doc(`story_library_admin/${id}/readiness/current`).set({ premiumReady: true, contentHash: d.contentHash, reviewerIds });
  };

  it('a client cannot claim to be the seeder: createdBy must equal the signed-in uid', async () => {
    await assertFails(setDoc(doc(pub('publisher1'), 'story_library_admin/forged-seed'), {
      storyKey: 'forged-seed', title: 'x', status: 'draft', createdBy: SEEDER_UID, updatedAt: new Date(),
    }));
  });

  const T = () => serverTimestamp();
  const submitAs = (db: ReturnType<typeof pub>, uid: string, id: string) =>
    updateDoc(doc(db, `story_library_admin/${id}`), { status: 'review', lastEditedBy: uid, submittedBy: uid, submittedAt: T(), updatedAt: T() });
  const approveAs = (db: ReturnType<typeof pub>, uid: string, id: string) =>
    updateDoc(doc(db, `story_library_admin/${id}`), { status: 'approved', approvedBy: uid, approvedAt: T(), updatedAt: T() });

  it('the seeder identity can never approve its own story, even with a publisher token', async () => {
    const id = corpus.distinct[3];
    const botDb = pub(SEEDER_UID);
    await markReady(id);
    await assertSucceeds(submitAs(botDb, SEEDER_UID, id));
    await assertFails(approveAs(botDb, SEEDER_UID, id));
    await seeded.db.doc(`story_library_admin/${id}`).set({ status: 'draft', lastEditedBy: SEEDER_UID }, { merge: true });
    await seeded.db.doc(`story_library_admin/${id}`).update({ submittedBy: FieldValue.delete(), submittedAt: FieldValue.delete() });
  });

  it('full path: draft → review → approved by an INDEPENDENT publisher (premium-ready) → published by the service → visible to schools', async () => {
    const id = corpus.distinct[4];
    const d = (await seeded.db.doc(`story_library_admin/${id}`).get()).data()!;
    const p1 = pub('publisher1'), p2 = pub('publisher2');
    await assertSucceeds(submitAs(p1, 'publisher1', id));
    await assertFails(approveAs(p2, 'publisher2', id));                       // not premium-ready yet: no readiness record
    await markReady(id);
    await assertFails(approveAs(p1, 'publisher1', id));                       // the submitter cannot approve
    await assertFails(updateDoc(doc(p2, `story_library_admin/${id}`), { status: 'approved', approvedBy: 'publisher1', approvedAt: T(), updatedAt: T() })); // cannot name someone else
    await assertSucceeds(approveAs(p2, 'publisher2', id));
    await assertFails(updateDoc(doc(p1, `story_library_admin/${id}`), { status: 'published', publishedBy: 'publisher1', publishedAt: T(), updatedAt: T() })); // no client publish
    await assertFails(setDoc(doc(p1, `story_catalogue/${id}`), catalogueEntryFor(id, d)));
    // the publication service (Admin SDK) publishes: admin copy + catalogue entry
    await seeded.db.doc(`story_library_admin/${id}`).update({ status: 'published' });
    await seeded.db.doc(`story_catalogue/${id}`).set(catalogueEntryFor(id, d));
    await assertSucceeds(getDoc(doc(as(env, 'teacherA').firestore(), `story_catalogue/${id}`)));
  });

  // ---- security findings F1 and F2 (Stage 3: FIXED; these tests now prove the fix on machine-seeded stories) ----
  it('F1 FIXED: one human cannot submit a seeded draft AND approve it', async () => {
    const id = corpus.distinct[5];
    const p1 = pub('publisher1');
    await markReady(id);
    await assertSucceeds(submitAs(p1, 'publisher1', id));
    await assertFails(approveAs(p1, 'publisher1', id));
  });

  it('F2 FIXED: whoever edits a seeded story in review cannot approve it, and approval cannot carry an edit', async () => {
    const id = corpus.distinct[6];
    const p1 = pub('publisher1'), p2 = pub('publisher2'), p3 = pub('publisher3');
    await markReady(id);
    await assertSucceeds(submitAs(p1, 'publisher1', id));
    await assertSucceeds(updateDoc(doc(p2, `story_library_admin/${id}`), { notes: 'Edited in review', lastEditedBy: 'publisher2', updatedAt: T() }));
    await assertFails(updateDoc(doc(p2, `story_library_admin/${id}`), { title: 'Client title edit', lastEditedBy: 'publisher2', updatedAt: T() })); // content is server-written
    await assertFails(approveAs(p2, 'publisher2', id));                       // last editor
    await assertFails(updateDoc(doc(p3, `story_library_admin/${id}`), { status: 'approved', approvedBy: 'publisher3', approvedAt: T(), updatedAt: T(), notes: 'Sneaky' }));
    await assertSucceeds(approveAs(p3, 'publisher3', id));
    const after = (await seeded.db.doc(`story_library_admin/${id}`).get()).data()!;
    expect(after.lastEditedBy).toBe('publisher2');                            // the edit is on the record
    expect(after.submittedBy).toBe('publisher1');
    expect(after.approvedBy).toBe('publisher3');
  });
});

describe('rollback on the real emulator never destroys human work', () => {
  it('removes untouched drafts, keeps stories a person moved on', async () => {
    const before = await adminCount(seeded);
    const t0 = Date.now();
    const r = await rollbackJob(seeded.backend, jobId);
    // distinct[4] (published), [5] (in review), [6] (approved, edited in review) were moved on by people and must survive.
    expect(r.keptHumanModified).toBe(3);
    expect(r.rolledBack).toBe(before - 3);
    const left = await seeded.db.collection('story_library_admin').get();
    expect(left.size).toBe(3);
    expect((await seeded.db.doc(`story_catalogue/${corpus.distinct[4]}`).get()).exists).toBe(true);
    // the duplicate index no longer holds entries for removed stories
    const idx = await seeded.db.collection('library_seed_jobs/_index/text').get();
    expect(idx.size).toBe(3);
    // eslint-disable-next-line no-console
    console.log(`[emulator rollback] ${r.rolledBack} drafts rolled back in ${Date.now() - t0} ms; ${r.keptHumanModified} kept`);
  }, 600_000);
});

describe('crash and resume on real Firestore transactions', () => {
  it('a runner killed after a commit is resumed by another; the result equals an uninterrupted run', async () => {
    const stories = generateCorpus({ count: 40, seed: 31 }).stories;
    const a = createEmulatorBackend('demo-gam-edu-seeder-clean');
    const b = createEmulatorBackend('demo-gam-edu-seeder-crash');
    try {
      await runSeed(a.backend, stories, { owner: 'clean', parallel: 1 });
      const faulty = new FaultyBackend(b.backend, (op, n) => (op === 'transact' && n === 25 ? 'crash_after' : undefined));
      await expect(runSeed(faulty, stories, { owner: 'dies', parallel: 1, leaseMs: 200 })).rejects.toBeInstanceOf(ProcessCrash);
      await sleep(300);
      const s = await runSeed(b.backend, stories, { owner: 'rescuer', parallel: 1, leaseMs: 200 });
      expect(s.completed).toBe(true);
      const ids = async (x: EmulatorBackend) => (await x.db.collection('story_library_admin').get()).docs.map((d) => `${d.id}:${d.get('contentHash')}`).sort();
      expect(await ids(b)).toEqual(await ids(a));
    } finally { await a.close(); await b.close(); }
  }, 120_000);
});

describe('concurrent runners on real Firestore transactions', () => {
  it('three runners over one manifest never create a story twice or accept a racing duplicate', async () => {
    const corp = generateCorpus({ count: 60, seed: 41 });
    const x = createEmulatorBackend('demo-gam-edu-seeder-conc');
    try {
      const results = await Promise.all(['a', 'b', 'c'].map((o) => runSeed(x.backend, corp.stories, { owner: o, parallel: 3, leaseMs: 5_000 })));
      // contention may leave a few items for a final pass; a further run converges
      const last = await runSeed(x.backend, corp.stories, { owner: 'finisher', parallel: 3, leaseMs: 100 });
      if (!last.completed) { await sleep(6_000); await runSeed(x.backend, corp.stories, { owner: 'finisher2', parallel: 3, leaseMs: 100 }); }
      const docs = (await x.db.collection('story_library_admin').get()).docs;
      expect(docs.length).toBe(corp.distinct.length);
      for (const d of docs) expect(d.get('version')).toBe(1);
      expect(results.reduce((n, r) => n + (r.outcomes.created ?? 0), 0)).toBeLessThanOrEqual(corp.distinct.length);
    } finally { await x.close(); }
  }, 180_000);
});

describe('Storage emulator: create-only staged objects', () => {
  it('never overwrites an existing object; reports same vs different content', async () => {
    const st = createEmulatorBackend('demo-gam-edu-seeder-storage', { useStorageEmulator: true });
    try {
      const path = 'story_library/private/assets/ab/test-object.webp';
      const bytes = new Uint8Array([1, 2, 3, 4]);
      expect(await st.backend.putObjectIfAbsent(path, bytes, 'image/webp', 'sha-1')).toBe('created');
      expect(await st.backend.putObjectIfAbsent(path, bytes, 'image/webp', 'sha-1')).toBe('exists_same');
      expect(await st.backend.putObjectIfAbsent(path, new Uint8Array([9, 9]), 'image/webp', 'sha-2')).toBe('exists_different');
    } finally { await st.close(); }
  }, 60_000);
});

// keep makeStory referenced for tree-shaking-free type checking of imports
void makeStory;
