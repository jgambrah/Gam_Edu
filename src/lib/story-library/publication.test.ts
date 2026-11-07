// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { MemoryBackend } from './seeder/memory-backend';
import { runSeed } from './seeder/seeder';
import type { StoryInput } from './seeder/types';
import { premiumStory } from './test-fixtures';
import { makeStory } from './seeder/synthetic';
import { CATALOGUE, FEATURED, META, PublicationError, promotePendingVersion, publishStory, recordReview, refreshReadiness, withdrawStory, type Actor } from './publication';
import { REVIEW_TYPES } from './aspects';
import { CatalogueClient, MemoryKV } from './catalogue-client';
import { StaticCatalogueBackend } from './static-catalogue';
import { validateCatalogueEntry, validateStoryPackage } from './validate';
import { MAX_CATALOGUE_ENTRY_BYTES, type StoryPackage } from './types';

const pub = (uid: string): Actor => ({ uid, isPublisher: true });
const outsider: Actor = { uid: 'teacher-1', isPublisher: false };
const ADMIN = (id: string) => `story_library_admin/${id}`;

async function seeded(story: StoryInput = premiumStory()) {
  const b = new MemoryBackend({ yieldToLoop: false });
  await runSeed(b, [story], { owner: 't' });
  return { b, id: story.storyKey };
}
const patch = (b: MemoryBackend, id: string, p: Record<string, unknown>) => b.transact(async (tx) => { const d = await tx.get(ADMIN(id)); tx.set(ADMIN(id), { ...d, ...p }); });
const admin = async (b: MemoryBackend, id: string) => (await b.transact((tx) => tx.get(ADMIN(id))))!;

/** Stand in for what a publisher does in the admin UI (the Firestore rules enforce these steps for real clients). */
async function reviewAll(b: MemoryBackend, id: string, reviewer = 'rev1') { for (const type of REVIEW_TYPES) await recordReview(b, pub(reviewer), { storyId: id, type, outcome: 'pass' }); }
async function toApproved(b: MemoryBackend, id: string, o: { editor?: string; submitter?: string; approver?: string } = {}) {
  await patch(b, id, { lastEditedBy: o.editor ?? 'ed1', status: 'review', submittedBy: o.submitter ?? 'sub1', submittedAt: b.now() });
  await reviewAll(b, id);
  await patch(b, id, { status: 'approved', approvedBy: o.approver ?? 'app1', approvedAt: b.now() });
}
async function ready(story?: StoryInput) { const s = await seeded(story); await toApproved(s.b, s.id); return s; }

describe('readiness record', () => {
  it('is recomputed from the staged package and only becomes premium-ready when every review has passed', async () => {
    const { b, id } = await seeded();
    const r0 = await refreshReadiness(b, id);
    expect(r0.result.premiumReady).toBe(false);
    for (const type of REVIEW_TYPES.slice(0, 6)) await recordReview(b, pub('rev1'), { storyId: id, type, outcome: 'pass' });
    let doc = (await b.transact((tx) => tx.get(`${ADMIN(id)}/readiness/current`)))!;
    expect(doc.premiumReady).toBe(false);
    await recordReview(b, pub('rev2'), { storyId: id, type: REVIEW_TYPES[6], outcome: 'pass' });
    doc = (await b.transact((tx) => tx.get(`${ADMIN(id)}/readiness/current`)))!;
    expect(doc.premiumReady).toBe(true);
    expect(doc.contentHash).toBe((await admin(b, id)).contentHash);
    expect(doc.reviewerIds).toEqual(['rev1', 'rev2']);
  });
  it('a story without illustrations, narration or timing is never ready (synthetic seed stories are not premium)', async () => {
    const plain = makeStory(9);
    const { b, id } = await seeded(plain);
    const { result } = await refreshReadiness(b, id);
    expect(result.premiumReady).toBe(false);
    expect(result.blockers.map((x) => x.code)).toEqual(expect.arrayContaining(['missing-alt-text', 'timing-unusable']));
  });
  it('only publishers may record a review; unknown types and outcomes are refused', async () => {
    const { b, id } = await seeded();
    await expect(recordReview(b, outsider, { storyId: id, type: 'text', outcome: 'pass' })).rejects.toMatchObject({ code: 'not-authorised' });
    await expect(recordReview(b, pub('r'), { storyId: id, type: 'nope' as any, outcome: 'pass' })).rejects.toMatchObject({ code: 'invalid' });
    await expect(recordReview(b, pub('r'), { storyId: id, type: 'text', outcome: 'maybe' as any })).rejects.toMatchObject({ code: 'invalid' });
    await expect(recordReview(b, pub('r'), { storyId: 'missing-story', type: 'text', outcome: 'pass' })).rejects.toMatchObject({ code: 'not-found' });
  });
  it('reviews are not accepted once the story is approved (content is frozen)', async () => {
    const { b, id } = await ready();
    await expect(recordReview(b, pub('late'), { storyId: id, type: 'text', outcome: 'fail' })).rejects.toMatchObject({ code: 'bad-state' });
  });
  it('a failed review blocks readiness, and a later pass restores it', async () => {
    const { b, id } = await seeded();
    await patch(b, id, { status: 'review' });
    await reviewAll(b, id);
    b.advance(1000);
    await recordReview(b, pub('rev1'), { storyId: id, type: 'cultural', outcome: 'needs-work', notes: 'rename the market scene' });
    expect((await refreshReadiness(b, id)).result.premiumReady).toBe(false);
    b.advance(1000);
    expect((await recordReview(b, pub('rev1'), { storyId: id, type: 'cultural', outcome: 'pass' })).result.premiumReady).toBe(true);
  });
});

describe('publishing', () => {
  it('publishes an approved, premium-ready story: catalogue entry, version, featured list, promoted files', async () => {
    const { b, id } = await ready();
    const r = await publishStory(b, pub('pub1'), id);
    expect(r).toMatchObject({ outcome: 'published', catalogueVersion: 1, sortKey: 1, version: 1 });
    const cat = (await b.transact((tx) => tx.get(`${CATALOG}/${id}`)))!;
    expect(cat).toMatchObject({ status: 'published', storyKey: id, publishedBy: 'pub1', changedInVersion: 1, hasNarration: true, hasActivities: true });
    expect(validateCatalogueEntry(id, cat)).toEqual([]);
    expect(JSON.stringify(cat).length).toBeLessThan(MAX_CATALOGUE_ENTRY_BYTES);
    expect(cat.classIds).toBeTruthy(); expect(cat.readingLevel).toBe('emergent');
    const meta = (await b.transact((tx) => tx.get(META)))!;
    expect(meta).toMatchObject({ catalogueVersion: 1, nextSortKey: 2 });
    expect((await b.transact((tx) => tx.get(FEATURED)))!.items.map((x: any) => x.storyKey)).toEqual([id]);
    const a = await admin(b, id);
    expect(a).toMatchObject({ status: 'published', publishedBy: 'pub1', publishedContentHash: a.contentHash });
    // files promoted to content-addressed public paths, identical bytes
    const pkgBytes = await b.getObject(cat.packagePath);
    expect(pkgBytes).toBeTruthy();
    const pkg = JSON.parse(new TextDecoder().decode(pkgBytes!)) as StoryPackage;
    expect(validateStoryPackage(pkg)).toEqual([]);
    for (const asset of Object.values(pkg.assets)) expect(await b.hasObject(asset.path)).toBe(true);
  });
  it('is idempotent: publishing twice changes nothing the second time', async () => {
    const { b, id } = await ready();
    await publishStory(b, pub('pub1'), id);
    const log = b.writeLog.length;
    const again = await publishStory(b, pub('pub2'), id);
    expect(again.outcome).toBe('unchanged'); expect(b.writeLog.length).toBe(log);
  });
  it('new stories append (sortKey rises), existing stories keep their place on republish', async () => {
    const b = new MemoryBackend({ yieldToLoop: false });
    const stories = [premiumStory({}, 3), premiumStory({ storyKey: 'syn-premium-b', title: 'Another Story' }, 4)];
    stories[0] = { ...stories[0], storyKey: 'syn-premium-a' };
    await runSeed(b, stories, { owner: 't' });
    for (const s of stories) await toApproved(b, s.storyKey);
    const a = await publishStory(b, pub('pub1'), 'syn-premium-a');
    const c = await publishStory(b, pub('pub1'), 'syn-premium-b');
    expect([a.sortKey, c.sortKey]).toEqual([1, 2]);
    expect((await b.transact((tx) => tx.get(FEATURED)))!.items.map((x: any) => x.storyKey)).toEqual(['syn-premium-b', 'syn-premium-a']);
    expect((await b.transact((tx) => tx.get(META)))!.catalogueVersion).toBe(2);
  });
});

const CATALOG = CATALOGUE;

describe('publishing is refused unless every condition holds (the service does not trust the client)', () => {
  const refuses = async (b: MemoryBackend, id: string, code: PublicationError['code'], actor = pub('pub1')) =>
    expect(publishStory(b, actor, id)).rejects.toMatchObject({ code });

  it('not approved (draft, review) → bad-state; nothing is written', async () => {
    const { b, id } = await seeded();
    const log = b.writeLog.length;
    await refuses(b, id, 'bad-state');
    await patch(b, id, { status: 'review' }); await refuses(b, id, 'bad-state');
    expect(b.writeLog.filter((w) => w.path.startsWith('story_catalogue') || w.path.startsWith('library_meta')).length).toBe(0);
    expect(b.writeLog.length).toBeGreaterThanOrEqual(log);
  });
  it('a non-publisher cannot publish, withdraw or review', async () => {
    const { b, id } = await ready();
    await refuses(b, id, 'not-authorised', outsider);
    await expect(withdrawStory(b, outsider, id, 'x')).rejects.toMatchObject({ code: 'not-authorised' });
  });
  for (const [label, who] of [['creator', 'seeder-bot'], ['last editor', 'ed1'], ['submitter', 'sub1'], ['a reviewer', 'rev1']] as const) {
    it(`approver who is the ${label} → not-independent`, async () => {
      const { b, id } = await seeded();
      await toApproved(b, id, { approver: who });
      await refuses(b, id, 'not-independent');
    });
  }
  it('approved but a review was never recorded (readiness not met) → not-ready', async () => {
    const { b, id } = await seeded();
    await patch(b, id, { lastEditedBy: 'ed1', status: 'approved', submittedBy: 'sub1', approvedBy: 'app1' }); // forged approval without reviews
    await refuses(b, id, 'not-ready');
  });
  it('approved but the story has no illustration/narration/timing → not-ready even with every review passed', async () => {
    const { b, id } = await seeded(makeStory(11));
    await toApproved(b, id);
    await refuses(b, id, 'not-ready');
  });
  it('content changed after the reviews (material edit) → the old reviews no longer count', async () => {
    const { b, id } = await ready();
    await patch(b, id, { contentHash: 'sha256:' + 'e'.repeat(64) }); // a tampered/changed hash with the old package
    await refuses(b, id, 'integrity');
  });
  it('a tampered staged package is detected (hash mismatch)', async () => {
    const { b, id } = await ready();
    const a = await admin(b, id);
    const o = b.objects.get(a.packagePath)!;
    o.bytes = new TextEncoder().encode(new TextDecoder().decode(o.bytes).replace('"title"', '"titel"'));
    await refuses(b, id, 'integrity');
  });
  it('an asset missing from storage blocks publication', async () => {
    const { b, id } = await ready();
    const a = await admin(b, id);
    const pkg = JSON.parse(new TextDecoder().decode(await b.getObject(a.packagePath))) as StoryPackage;
    const first = Object.values(pkg.assets)[0];
    for (const p of [...b.objects.keys()]) if (p.includes(first.path.split('/').pop()!.split('.')[0])) b.objects.delete(p);
    await refuses(b, id, 'not-ready');
  });
  it('the story changing while publishing aborts without publishing', async () => {
    const { b, id } = await ready();
    const real = b.transact.bind(b);
    let n = 0;
    (b as any).transact = async (fn: any) => { if (++n === 2) await real(async (tx: any) => { const d = await tx.get(ADMIN(id)); tx.set(ADMIN(id), { ...d, status: 'review' }); }); return real(fn); };
    await expect(publishStory(b, pub('pub1'), id)).rejects.toMatchObject({ code: 'conflict' });
    (b as any).transact = real;
    expect(await b.transact((tx) => tx.get(`${CATALOG}/${id}`))).toBeUndefined();
  });
});

describe('material edits invalidate approval', () => {
  it('a newly staged version returns the story to draft with no approval, and the old approval cannot publish it', async () => {
    const original = premiumStory();
    const { b, id } = await ready(original);
    await publishStory(b, pub('pub1'), id);
    // a corrected version is seeded; because the story is past draft it is staged beside the live one
    const fixed = premiumStory({ title: 'Corrected Title' });
    await runSeed(b, [{ ...fixed, storyKey: id, pages: fixed.pages.map((p, i) => (i === 0 ? { ...p, text: p.text + ' A new sentence was added here.', sentences: undefined, timing: undefined as any } : p)) }], { owner: 't2' });
    const pend = await b.listDocs(`${ADMIN(id)}/pending_versions`);
    expect(pend.length).toBe(1);
    await promotePendingVersion(b, pub('ed2'), id, Number(pend[0].id));
    const a = await admin(b, id);
    expect(a).toMatchObject({ status: 'draft', approvedBy: '', lastEditedBy: 'ed2' });
    expect(await b.transact((tx) => tx.get(`${ADMIN(id)}/readiness/current`))).toBeUndefined();
    // the LIVE catalogue entry is untouched until the new version is approved and published
    expect((await b.transact((tx) => tx.get(`${CATALOG}/${id}`)))!.status).toBe('published');
    await expect(publishStory(b, pub('pub1'), id)).rejects.toMatchObject({ code: 'bad-state' });
    // a forged "approved" status with the OLD reviews does not help: reviews bound to the old content hash do not count
    await patch(b, id, { status: 'approved', approvedBy: 'app9', submittedBy: 'sub2' });
    await expect(publishStory(b, pub('pub1'), id)).rejects.toMatchObject({ code: expect.stringMatching(/not-ready|integrity/) });
  });
});

describe('withdrawal and the delta catalogue', () => {
  it('withdrawing keeps a tombstone, bumps the version, drops it from featured, and is idempotent', async () => {
    const { b, id } = await ready();
    await publishStory(b, pub('pub1'), id);
    const w = await withdrawStory(b, pub('pub2'), id, 'found an error in page 3');
    expect(w).toEqual({ outcome: 'withdrawn', catalogueVersion: 2 });
    expect(await admin(b, id)).toMatchObject({ status: 'archived', archivedBy: 'pub2', archiveReason: 'found an error in page 3' });
    expect((await b.transact((tx) => tx.get(`${CATALOG}/${id}`)))).toMatchObject({ status: 'archived', changedInVersion: 2 });
    expect((await b.transact((tx) => tx.get(META)))!.tombstones).toEqual([{ storyId: id, withdrawnAtVersion: 2 }]);
    expect((await b.transact((tx) => tx.get(FEATURED)))!.items).toEqual([]);
    expect((await withdrawStory(b, pub('pub2'), id, 'again')).outcome).toBe('unchanged');
  });
  it('refuses to withdraw something that is not live, and needs a reason', async () => {
    const { b, id } = await ready();
    await expect(withdrawStory(b, pub('p'), id, 'x')).rejects.toMatchObject({ code: 'bad-state' });
    await publishStory(b, pub('pub1'), id);
    await expect(withdrawStory(b, pub('p'), id, '')).rejects.toMatchObject({ code: 'invalid' });
  });
  it('a withdrawn story disappears from a client that cached it, even though it never changed position', async () => {
    const { b, id } = await ready();
    await publishStory(b, pub('pub1'), id);
    const snapshot = async () => (await b.listDocs(CATALOGUE)).map((d) => d.data as any);
    const meta1 = (await b.transact((tx) => tx.get(META)))!.catalogueVersion;
    const v1 = new StaticCatalogueBackend({ catalogueVersion: meta1, entries: await snapshot() });
    const store = new MemoryKV();
    const c1 = new CatalogueClient(v1, store, { pageSize: 10, refresh: 'delta' });
    await c1.startSession(); expect((await c1.getPage(0)).map((e) => e.storyKey)).toEqual([id]);
    await withdrawStory(b, pub('pub1'), id, 'withdrawn for review');
    const meta2 = (await b.transact((tx) => tx.get(META)))!.catalogueVersion;
    const v2 = new StaticCatalogueBackend({ catalogueVersion: meta2, entries: await snapshot() });
    const c2 = new CatalogueClient(v2, store, { pageSize: 10, refresh: 'delta' });
    expect((await c2.startSession()).changed).toBe(true);
    expect(await c2.getPage(0)).toEqual([]);
  });
});
