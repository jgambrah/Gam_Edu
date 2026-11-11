/**
 * Seeder against the REAL Firestore (and Storage) EMULATORS, then the client security rules against what it wrote.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { assertSucceeds, assertFails, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, query, where, limit, serverTimestamp } from 'firebase/firestore';
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
const corpus = generateCorpus({ count: 1000, seed: 21 });
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

describe('seeding on the real emulator (instant approval)', () => {
  it('writes approved stories authored and approved by the seeder, one per distinct story', async () => {
    const snap = await seeded.db.collection('story_library_admin').get();
    expect(snap.size).toBe(corpus.distinct.length);
    for (const d of snap.docs) {
      expect(d.get('status')).toBe('approved');
      expect(d.get('createdBy')).toBe(SEEDER_UID);
      expect(d.get('approvedBy')).toBe(SEEDER_UID);
      expect(d.get('synthetic')).toBe(true);
    }
  });

  it('duplicates were blocked; nothing reached story_catalogue or library_meta directly', async () => {
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

describe('client rules over seeded stories', () => {
  const firstId = () => corpus.distinct[0];

  it('schools cannot see un-published admin docs, job records or the duplicate index', async () => {
    const teacher = as(env, 'teacherA').firestore();
    await assertFails(getDoc(doc(teacher, `story_library_admin/${firstId()}`)));
    await assertFails(getDoc(doc(teacher, `library_seed_jobs/${jobId}`)));
    const list = await assertSucceeds(getDocs(query(collection(teacher, 'story_catalogue'), where('status', '==', 'published'), limit(10))));
    expect(list.size).toBe(0);
  });

  it('publishers can read admin and job records, while catalogue publishing remains server-only', async () => {
    const p = pub('publisher1');
    const id = corpus.distinct[1];
    const d = (await seeded.db.doc(`story_library_admin/${id}`).get()).data()!;
    await assertSucceeds(getDoc(doc(p, `story_library_admin/${firstId()}`)));
    await assertSucceeds(getDoc(doc(p, `library_seed_jobs/${jobId}`)));
    await assertFails(setDoc(doc(p, `story_catalogue/${id}`), catalogueEntryFor(id, d)));
  });

  it('once published by the publication service, schools immediately read the catalogue entry', async () => {
    const id = corpus.distinct[4];
    const d = (await seeded.db.doc(`story_library_admin/${id}`).get()).data()!;
    await seeded.db.doc(`story_library_admin/${id}`).update({ status: 'published' });
    await seeded.db.doc(`story_catalogue/${id}`).set(catalogueEntryFor(id, d));
    await assertSucceeds(getDoc(doc(as(env, 'teacherA').firestore(), `story_catalogue/${id}`)));
  });
});

describe('rollback on the real emulator never destroys human or published work', () => {
  it('removes untouched seeded stories, keeps published or human-edited stories', async () => {
    const editedId = corpus.distinct[5];
    const T = () => serverTimestamp();
    const p1 = pub('publisher1');
    // Re-open distinct[5] into review as a human editor
    await assertSucceeds(updateDoc(doc(p1, `story_library_admin/${editedId}`), {
      status: 'review', lastEditedBy: 'publisher1', submittedBy: 'publisher1', submittedAt: T(),
      approvedBy: '', approvedAt: null, updatedAt: T(),
    }));
    const before = await adminCount(seeded);
    const r = await rollbackJob(seeded.backend, jobId);
    expect(r.keptHumanModified).toBe(2); // distinct[4] (published) + distinct[5] (human-reopened)
    expect(r.rolledBack).toBe(before - 2);
    expect((await seeded.db.collection('story_library_admin').get()).size).toBe(2);
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

void makeStory;
