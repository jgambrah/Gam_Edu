// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

vi.setConfig({ testTimeout: 120_000 });
import { MemoryBackend, FaultyBackend, type FaultPlan } from './memory-backend';
import { jobIdFor, prepare, rollbackJob, runSeed } from './seeder';
import { cloneStory, generateCorpus, makeStory } from './synthetic';
import { assertEmulatorOnly, assertSyntheticOnly, SeederGuardError } from './guard';
import { estimateJaccard, signatureOf, bandKeys } from './fingerprint';
import { ProcessCrash, SEEDER_UID, type StoryInput } from './types';
import { ADMIN_COLLECTION } from './types';

const opts = (owner = 'runner-1', extra = {}) => ({ owner, parallel: 4, leaseMs: 60_000, ...extra });
const FORBIDDEN = [/^story_catalogue\//, /^library_meta\//, /^story_library\/published\//];
const admin = (b: MemoryBackend, id: string) => b.docs.get(`${ADMIN_COLLECTION}/${id}`)?.data;
const adminIds = (b: MemoryBackend) => [...b.docs.keys()].filter((k) => /^story_library_admin\/[^/]+$/.test(k)).map((k) => k.split('/')[1]).sort();

describe('fingerprint', () => {
  it('identical text → similarity 1; unrelated text → near 0', () => {
    const a = makeStory(1), b = makeStory(2);
    const t = (s: StoryInput) => s.pages.map((p) => p.text).join(' ');
    expect(estimateJaccard(signatureOf(t(a)), signatureOf(t(a)))).toBe(1);
    expect(estimateJaccard(signatureOf(t(a)), signatureOf(t(b)))).toBeLessThan(0.1);
  });
  it('a two-word edit stays above the 0.85 threshold and shares an LSH bucket', () => {
    const a = makeStory(3), n = cloneStory(a, 'syn-99999', 2);
    const t = (s: StoryInput) => s.pages.map((p) => p.text).join(' ');
    const sa = signatureOf(t(a)), sn = signatureOf(t(n));
    expect(estimateJaccard(sa, sn)).toBeGreaterThan(0.85);
    const ka = new Set(bandKeys(sa));
    expect(bandKeys(sn).some((k) => ka.has(k))).toBe(true);
  });
});

describe('guard', () => {
  const good = { FIRESTORE_EMULATOR_HOST: '127.0.0.1:8080' } as unknown as NodeJS.ProcessEnv;
  it('accepts a demo project with the emulator host', () => expect(() => assertEmulatorOnly('demo-gam-edu-seeder', good)).not.toThrow());
  it('refuses the production project id', () => expect(() => assertEmulatorOnly('gamedu-69888475-f5783', good)).toThrow(SeederGuardError));
  it('refuses a non-demo project', () => expect(() => assertEmulatorOnly('my-project', good)).toThrow(SeederGuardError));
  it('refuses when no emulator host is set', () => expect(() => assertEmulatorOnly('demo-x', {} as NodeJS.ProcessEnv)).toThrow(SeederGuardError));
  it('refuses when real credentials are present', () => {
    expect(() => assertEmulatorOnly('demo-x', { ...good, GOOGLE_APPLICATION_CREDENTIALS: '/k.json' } as NodeJS.ProcessEnv)).toThrow(SeederGuardError);
    expect(() => assertEmulatorOnly('demo-x', { ...good, FIREBASE_PRIVATE_KEY: 'x' } as NodeJS.ProcessEnv)).toThrow(SeederGuardError);
  });
  it('needs the storage emulator host when objects are used', () => {
    expect(() => assertEmulatorOnly('demo-x', good, { needStorage: true })).toThrow(SeederGuardError);
  });
  it('refuses non-synthetic stories', () => {
    expect(() => assertSyntheticOnly([{ ...makeStory(1), synthetic: false as unknown as true }])).toThrow(SeederGuardError);
  });
});

describe('1,000-story seeding run', () => {
  const corpus = generateCorpus({ count: 1000, seed: 1 });
  const b = new MemoryBackend({ yieldToLoop: false });
  let summary: Awaited<ReturnType<typeof runSeed>>;
  let ms = 0;

  it('seeds the corpus', async () => {
    const t0 = performance.now();
    summary = await runSeed(b, corpus.stories, opts('runner-1', { parallel: 1 }));
    ms = performance.now() - t0;
    expect(summary.completed).toBe(true);
    expect(summary.failed).toBe(0);
    // eslint-disable-next-line no-console
    console.log(`[seeding] ${corpus.stories.length} stories in ${ms.toFixed(0)} ms (${(ms / corpus.stories.length).toFixed(2)} ms/story); outcomes=${JSON.stringify(summary.outcomes)}; stats=${JSON.stringify(b.stats)}`);
  });

  it('every accepted story is a DRAFT written by the seeder; nothing else is created', () => {
    const ids = adminIds(b);
    expect(ids.length).toBe(corpus.distinct.length);
    for (const id of ids) {
      const d = admin(b, id)!;
      expect(d.status).toBe('draft');
      expect(d.createdBy).toBe(SEEDER_UID);
      expect(d.synthetic).toBe(true);
      expect(d.version).toBe(1);
    }
  });

  it('never writes to the catalogue, library_meta or published media', () => {
    for (const w of b.writeLog) for (const re of FORBIDDEN) expect(re.test(w.path)).toBe(false);
    expect(b.writeLog.some((w) => w.kind === 'object' && !w.path.startsWith('story_library/private/'))).toBe(false);
  });

  it('duplicate prevention: every planted exact and near duplicate is blocked, no distinct story is', () => {
    const ids = new Set(adminIds(b));
    for (const e of corpus.planted.exact) expect(ids.has(e.key), `exact ${e.key}`).toBe(false);
    const nearMissed = corpus.planted.near.filter((n) => ids.has(n.key));
    const falsePositives = corpus.distinct.filter((k) => !ids.has(k));
    // eslint-disable-next-line no-console
    console.log(`[duplicates] exact planted=${corpus.planted.exact.length} blocked=${corpus.planted.exact.length}; near planted=${corpus.planted.near.length} missed=${nearMissed.length}; false positives=${falsePositives.length}/${corpus.distinct.length}`);
    expect(nearMissed).toEqual([]);
    expect(falsePositives).toEqual([]);
    expect(summary.outcomes.blocked_exact_duplicate).toBe(corpus.planted.exact.length);
    expect(summary.outcomes.blocked_near_duplicate).toBe(corpus.planted.near.length);
  });

  it('media is content-addressed: the shared closing illustration is stored once', () => {
    const imgs = [...b.objects.keys()].filter((k) => k.includes('/assets/') && k.endsWith('.webp'));
    const perStory = 9; // 10 pages, last image shared by every story
    expect(imgs.length).toBe(corpus.distinct.length * perStory + 1);
  });

  it('a second run changes nothing (idempotent): 0 writes', async () => {
    const before = b.writeLog.length;
    const s2 = await runSeed(b, corpus.stories, opts('runner-2', { parallel: 1 }));
    expect(s2.alreadyCompleted).toBe(true);
    expect(b.writeLog.length).toBe(before);
  });
});

describe('false positives on 1,000 distinct stories', () => {
  it('none are flagged as duplicates of each other', async () => {
    const stories = Array.from({ length: 1000 }, (_, i) => makeStory(i + 1, { seed: 5 }));
    const b = new MemoryBackend({ yieldToLoop: false });
    const s = await runSeed(b, stories, opts('r', { parallel: 1 }));
    expect(s.outcomes.created).toBe(1000);
    expect(s.outcomes.blocked_exact_duplicate ?? 0).toBe(0);
    expect(s.outcomes.blocked_near_duplicate ?? 0).toBe(0);
  });
});

describe('duplicate decisions', () => {
  it('a human decision overrides a block, but only for the story it names', async () => {
    const a = makeStory(1);
    const dup = cloneStory(a, 'syn-dup-1', 0);
    const b = new MemoryBackend({ yieldToLoop: false });
    await runSeed(b, [a], opts());
    const blocked = await runSeed(b, [a, dup], opts());
    expect(blocked.outcomes.blocked_exact_duplicate).toBe(1);

    const wrong = { ...dup, duplicateDecision: { of: 'someone-else', allow: true as const, note: 'ok' } };
    expect((await runSeed(b, [a, wrong], opts())).outcomes.blocked_exact_duplicate).toBe(1);

    const right = { ...dup, duplicateDecision: { of: a.storyKey, allow: true as const, note: 'reviewed: intentional re-telling' } };
    const s = await runSeed(b, [a, right], opts());
    expect(s.outcomes.created).toBe(1);
    expect(admin(b, 'syn-dup-1')!.duplicateOverride.of).toBe(a.storyKey);
    expect(admin(b, 'syn-dup-1')!.status).toBe('draft');
  });
});

describe('invalid input', () => {
  it('records invalid stories without writing a story document', async () => {
    const b = new MemoryBackend({ yieldToLoop: false });
    const bad = { ...makeStory(1), pages: [] } as StoryInput;
    const bad2 = { ...makeStory(2), storyKey: 'x' } as StoryInput;
    const s = await runSeed(b, [bad, bad2, makeStory(3)], opts());
    expect(s.outcomes.invalid).toBe(2);
    expect(s.outcomes.created).toBe(1);
    expect(adminIds(b)).toEqual(['syn-00003']);
  });
  it('rejects a manifest with repeated storyKeys', async () => {
    const b = new MemoryBackend({ yieldToLoop: false });
    await expect(runSeed(b, [makeStory(1), makeStory(1)], opts())).rejects.toThrow(/Duplicate storyKey/);
  });
});

describe('interruption, resume and faults', () => {
  const corpus = generateCorpus({ count: 120, seed: 3 });
  const clean = async () => {
    const b = new MemoryBackend({ yieldToLoop: false });
    await runSeed(b, corpus.stories, opts('clean', { parallel: 1 }));
    return b.snapshot({ ignoreRunFields: true });
  };

  it.each([
    ['crash before a transaction', (n: number): FaultPlan => (op, i) => (op === 'transact' && i === n ? 'crash_before' : undefined)],
    ['crash after a transaction commits (work done, process died before knowing)', (n: number): FaultPlan => (op, i) => (op === 'transact' && i === n ? 'crash_after' : undefined)],
    ['crash during media upload', (n: number): FaultPlan => (op, i) => (op === 'put' && i === n ? 'crash_after' : undefined)],
  ])('%s: a resumed run converges to exactly the clean-run result', async (_name, planFor) => {
    const expected = await clean();
    for (const n of [1, 2, 3, 7, 20, 55, 111, 200]) {
      const base = new MemoryBackend({ yieldToLoop: false });
      const faulty = new FaultyBackend(base, planFor(n));
      await expect(runSeed(faulty, corpus.stories, opts('crashy', { parallel: 1 }))).rejects.toBeInstanceOf(ProcessCrash);
      base.advance(120_000); // the dead runner's lease expires
      const s = await runSeed(base, corpus.stories, opts('rescuer', { parallel: 1 }));
      expect(s.completed, `n=${n}`).toBe(true);
      expect(base.snapshot({ ignoreRunFields: true })).toEqual(expected);
    }
  });

  it('a lease that has not expired is respected (no double work), then reclaimed once it has', async () => {
    const base = new MemoryBackend({ yieldToLoop: false });
    const faulty = new FaultyBackend(base, (op, i) => (op === 'put' && i === 3 ? 'crash_before' : undefined));
    await expect(runSeed(faulty, corpus.stories.slice(0, 5), opts('dead', { parallel: 1 }))).rejects.toBeInstanceOf(ProcessCrash);
    const early = await runSeed(base, corpus.stories.slice(0, 5), opts('other', { parallel: 1 }));
    expect(early.skippedBusy).toBe(1);
    expect(early.completed).toBe(false);
    base.advance(61_000);
    const late = await runSeed(base, corpus.stories.slice(0, 5), opts('other', { parallel: 1 }));
    expect(late.completed).toBe(true);
  });

  it('transient errors are retried inline and the result still matches a clean run', async () => {
    const expected = await clean();
    const base = new MemoryBackend({ yieldToLoop: false });
    const faulty = new FaultyBackend(base, (op, i) => ((op === 'transact' || op === 'put') && i % 13 === 0 ? 'transient' : undefined));
    const s = await runSeed(faulty, corpus.stories, opts('flaky', { parallel: 1 }));
    expect(s.completed).toBe(true);
    expect(base.snapshot({ ignoreRunFields: true })).toEqual(expected);
  });

  it('a permanently failing story is capped by maxAttempts and does not block the rest', async () => {
    const base = new MemoryBackend({ yieldToLoop: false });
    const poison = corpus.stories[5].storyKey;
    const wrapped = new FaultyBackend(base, (op, _i, path) => (op === 'put' && path?.includes('/packages/' + poison + '/') ? 'transient' : undefined));
    let last;
    for (let run = 0; run < 7; run++) last = await runSeed(wrapped, corpus.stories.slice(0, 12), opts('r', { parallel: 1, maxAttempts: 3, maxInlineRetries: 1 }));
    expect(last!.completed).toBe(false);
    expect(base.docs.get(`library_seed_jobs/${last!.jobId}/items/${poison}`)!.data.attempts).toBe(3);
    expect(admin(base, poison)).toBeUndefined();
    expect(adminIds(base).length).toBeGreaterThanOrEqual(10);
  });
});

describe('concurrent runners', () => {
  it('three runners over the same manifest produce exactly the clean-run result, no story twice', async () => {
    const corpus = generateCorpus({ count: 150, seed: 4 });
    const cleanB = new MemoryBackend({ yieldToLoop: false });
    await runSeed(cleanB, corpus.stories, opts('c', { parallel: 1 }));
    const b = new MemoryBackend(); // interleaving
    const [s1, s2, s3] = await Promise.all(['a', 'b', 'c'].map((o) => runSeed(b, corpus.stories, opts(o, { parallel: 3 }))));
    expect(adminIds(b)).toEqual(adminIds(cleanB));
    const created = (s1.outcomes.created ?? 0) + (s2.outcomes.created ?? 0) + (s3.outcomes.created ?? 0);
    expect(created).toBe(corpus.distinct.length);
    // each story document written once: version 1 everywhere
    for (const id of adminIds(b)) expect(admin(b, id)!.version).toBe(1);
    // eslint-disable-next-line no-console
    console.log(`[concurrency] 3 runners × 3 workers, 150 stories: created=${created}, tx conflicts retried=${b.stats.txConflicts}`);
  });

  it('racing near-duplicates submitted by different runners: exactly one is created', async () => {
    const a = makeStory(11, { seed: 8 });
    const group = [a, cloneStory(a, 'race-1', 1), cloneStory(a, 'race-2', 1), cloneStory(a, 'race-3', 2)];
    for (let trial = 0; trial < 20; trial++) {
      const b = new MemoryBackend();
      await Promise.all(group.map((s, i) => runSeed(b, [s], opts(`r${i}`, { parallel: 1 }))));
      expect(adminIds(b).length, `trial ${trial}`).toBe(1);
    }
  });
});

describe('versions', () => {
  const v1 = makeStory(1, { seed: 9 });
  const edited = (s: StoryInput): StoryInput => ({ ...s, pages: s.pages.map((p, i) => (i === 0 ? { ...p, text: p.text + ' A brand new closing line for the first page appears here.' } : p)) });

  it('unchanged content is a no-op; changed draft is updated in place with a revision trail', async () => {
    const b = new MemoryBackend({ yieldToLoop: false });
    await runSeed(b, [v1], opts());
    const writes = b.writeLog.length;
    // same content, different job (add a second story so the job id differs)
    const other = makeStory(2, { seed: 9 });
    const s = await runSeed(b, [v1, other], opts());
    expect(s.outcomes.unchanged).toBe(1);
    expect(b.writeLog.slice(writes).some((w) => w.path === `${ADMIN_COLLECTION}/${v1.storyKey}`)).toBe(false);

    const s2 = await runSeed(b, [edited(v1)], opts());
    expect(s2.outcomes.updated_draft).toBe(1);
    const d = admin(b, v1.storyKey)!;
    expect(d.status).toBe('draft');
    expect(d.version).toBe(2);
    expect(d.revisions).toHaveLength(1);
    expect(d.revisions[0].version).toBe(1);
  });

  it.each(['review', 'approved', 'published', 'archived'])('a re-seed of a story in "%s" never touches the live copy: it becomes a pending draft version', async (status) => {
    const b = new MemoryBackend({ yieldToLoop: false });
    await runSeed(b, [v1], opts());
    const live = admin(b, v1.storyKey)!;
    b.docs.set(`${ADMIN_COLLECTION}/${v1.storyKey}`, { data: { ...live, status, approvedBy: 'human-2' }, ver: 99 }); // a person moved it
    const s = await runSeed(b, [edited(v1)], opts());
    expect(s.outcomes.pending_version).toBe(1);
    const after = admin(b, v1.storyKey)!;
    expect(after.status).toBe(status);
    expect(after.version).toBe(1);
    expect(after.title).toBe(live.title);
    expect(after.packagePath).toBe(live.packagePath);
    const pending = b.docs.get(`${ADMIN_COLLECTION}/${v1.storyKey}/pending_versions/2`)!.data;
    expect(pending.status).toBe('draft');
    expect(pending.basedOnVersion).toBe(1);
    // re-running the same edit is a no-op
    expect((await runSeed(b, [edited(v1)], opts())).alreadyCompleted).toBe(true);
  });

  it('package files are immutable per version and content-addressed', async () => {
    const b = new MemoryBackend({ yieldToLoop: false });
    await runSeed(b, [v1], opts());
    await runSeed(b, [edited(v1)], opts());
    const pk = [...b.objects.keys()].filter((k) => k.includes('/packages/'));
    expect(pk.length).toBe(2);
    expect(pk[0]).not.toBe(pk[1]);
  });
});

describe('human edits are never overwritten', () => {
  const v1 = makeStory(1, { seed: 15 });
  const v2: StoryInput = { ...v1, pages: v1.pages.map((p, i) => (i === 0 ? { ...p, text: p.text + ' A newly added closing line for the first page appears right here today.' } : p)) };

  it('a draft a person has edited is not updated in place: the new version is staged beside it', async () => {
    const b = new MemoryBackend({ yieldToLoop: false });
    await runSeed(b, [v1], opts());
    const live = admin(b, v1.storyKey)!;
    expect(live.lastEditedBy).toBe(SEEDER_UID);
    b.docs.set(`${ADMIN_COLLECTION}/${v1.storyKey}`, { data: { ...live, title: 'Fixed by an editor', lastEditedBy: 'editor-1' }, ver: 9 });
    const s = await runSeed(b, [v2], opts());
    expect(s.outcomes.pending_version).toBe(1);
    expect(admin(b, v1.storyKey)!.title).toBe('Fixed by an editor');
    expect(admin(b, v1.storyKey)!.version).toBe(1);
  });

  it('rollback keeps a draft whose last editor is a person, even though the seeder created it', async () => {
    const b = new MemoryBackend({ yieldToLoop: false });
    const j = await runSeed(b, [v1], opts());
    const live = admin(b, v1.storyKey)!;
    b.docs.set(`${ADMIN_COLLECTION}/${v1.storyKey}`, { data: { ...live, title: 'Fixed by an editor', lastEditedBy: 'editor-1' }, ver: 9 });
    const r = await rollbackJob(b, j.jobId);
    expect(r.keptHumanModified).toBe(1);
    expect(admin(b, v1.storyKey)!.title).toBe('Fixed by an editor');
  });
});

describe('classification on seeded drafts', () => {
  it('a valid classification is stored on the draft; an invalid one is rejected before anything is written', async () => {
    const b = new MemoryBackend({ yieldToLoop: false });
    const ok = makeStory(1, { seed: 16 });
    const bad = { ...makeStory(2, { seed: 16 }), classification: { ...makeStory(2, { seed: 16 }).classification!, classIds: ['primary-9'] } } as StoryInput;
    const s = await runSeed(b, [ok, bad], opts());
    expect(s.outcomes.created).toBe(1);
    expect(s.outcomes.invalid).toBe(1);
    expect(admin(b, ok.storyKey)!.classification.classIds.length).toBeGreaterThan(0);
    expect(admin(b, bad.storyKey)).toBeUndefined();
  });
  it('re-classifying a draft updates it in place with a revision', async () => {
    const b = new MemoryBackend({ yieldToLoop: false });
    const s1 = makeStory(1, { seed: 17 });
    await runSeed(b, [s1], opts());
    const re = { ...s1, classification: { ...s1.classification!, difficulty: s1.classification!.difficulty === 5 ? 4 : 5 } };
    const r = await runSeed(b, [re], opts());
    expect(r.outcomes.updated_draft).toBe(1);
    expect(admin(b, s1.storyKey)!.revisions).toHaveLength(1);
  });
});

describe('approval enforcement', () => {
  it('the seeder module exposes no publish or approve capability', async () => {
    const mod = await import('./seeder');
    expect(Object.keys(mod).sort()).toEqual(['jobIdFor', 'prepare', 'rollbackJob', 'runSeed']);
  });
  it('the seeder source never names the catalogue, library_meta or published prefix as a write target', async () => {
    const { readFileSync } = await import('node:fs');
    const src = readFileSync(new URL('./seeder.ts', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    expect(src).not.toMatch(/story_catalogue|library_meta|PUBLISHED_PREFIX|story_library\/published/);
    expect(src).not.toMatch(/status:\s*'(review|approved|published)'/);
  });
});

describe('rollback', () => {
  it('removes untouched created drafts, restores updated drafts, keeps human-modified work', async () => {
    const stories = Array.from({ length: 10 }, (_, i) => makeStory(i + 1, { seed: 12 }));
    const b = new MemoryBackend({ yieldToLoop: false });
    const first = await runSeed(b, stories.slice(0, 5), opts());
    const second = await runSeed(b, stories, opts());
    expect(second.outcomes.created).toBe(5);
    // a person moves one new story into review, and edits another
    const reviewed = adminIds(b)[7];
    const edited = adminIds(b)[8];
    const rd = admin(b, reviewed)!; b.docs.set(`${ADMIN_COLLECTION}/${reviewed}`, { data: { ...rd, status: 'review' }, ver: 50 });
    const ed = admin(b, edited)!; b.docs.set(`${ADMIN_COLLECTION}/${edited}`, { data: { ...ed, title: 'Edited by a person', createdBy: 'human-1' }, ver: 50 });

    const r = await rollbackJob(b, second.jobId);
    expect(r.rolledBack).toBe(3);
    expect(r.keptHumanModified).toBe(2);
    expect(admin(b, reviewed)!.status).toBe('review');
    expect(admin(b, edited)!.title).toBe('Edited by a person');
    expect(adminIds(b).length).toBe(5 + 2);
    expect(first.completed).toBe(true);

    // idempotent
    const writes = b.writeLog.length;
    const r2 = await rollbackJob(b, second.jobId);
    expect(r2.rolledBack).toBe(0);
    expect(b.writeLog.length).toBeGreaterThan(writes - 1); // job doc touched, no story changes
    expect(adminIds(b).length).toBe(7);
  });

  it('restores a draft updated in place, and a pending version is deleted', async () => {
    const s = makeStory(1, { seed: 13 });
    const s2: StoryInput = { ...s, pages: s.pages.map((p, i) => (i === 0 ? { ...p, text: p.text + ' extra words added to this first page for the second version.' } : p)) };
    const b = new MemoryBackend({ yieldToLoop: false });
    await runSeed(b, [s], opts());
    const v1 = admin(b, s.storyKey)!;
    const j2 = await runSeed(b, [s2], opts());
    expect(admin(b, s.storyKey)!.version).toBe(2);
    await rollbackJob(b, j2.jobId);
    const back = admin(b, s.storyKey)!;
    expect(back.contentHash).toBe(v1.contentHash);
    expect(back.packagePath).toBe(v1.packagePath);
    expect(back.status).toBe('draft');
    // the restored text is searchable for duplicates again, and re-seeding v2 works
    const again = await runSeed(b, [s2], opts());
    expect(again.outcomes.updated_draft).toBe(1);

    // pending version: move live to approved, seed v3, roll back
    const live = admin(b, s.storyKey)!;
    b.docs.set(`${ADMIN_COLLECTION}/${s.storyKey}`, { data: { ...live, status: 'approved', approvedBy: 'h' }, ver: 77 });
    const s3: StoryInput = { ...s, pages: s.pages.map((p, i) => (i === 1 ? { ...p, text: p.text + ' yet more different words that make a third version here.' } : p)) };
    const j3 = await runSeed(b, [s3], opts());
    expect(j3.outcomes.pending_version).toBe(1);
    await rollbackJob(b, j3.jobId);
    expect([...b.docs.keys()].some((k) => k.includes('/pending_versions/'))).toBe(false);
    expect(admin(b, s.storyKey)!.status).toBe('approved');
  });

  it('after a rollback the same manifest can be seeded again', async () => {
    const stories = Array.from({ length: 6 }, (_, i) => makeStory(i + 1, { seed: 14 }));
    const b = new MemoryBackend({ yieldToLoop: false });
    const j = await runSeed(b, stories, opts());
    await rollbackJob(b, j.jobId);
    expect(adminIds(b)).toEqual([]);
    expect([...b.docs.keys()].filter((k) => k.startsWith('library_seed_jobs/_index/'))).toEqual([]);
    const again = await runSeed(b, stories, opts());
    expect(again.outcomes.created).toBe(6);
  });
});

describe('job identity', () => {
  it('is stable for the same manifest in any order, and changes when content changes', () => {
    const s = [makeStory(1), makeStory(2), makeStory(3)];
    expect(jobIdFor(s)).toBe(jobIdFor([...s].reverse()));
    expect(jobIdFor(s)).not.toBe(jobIdFor([s[0], s[1]]));
    expect(prepare(s[0]).contentHash).toBe(prepare(makeStory(1)).contentHash);
  });
});
