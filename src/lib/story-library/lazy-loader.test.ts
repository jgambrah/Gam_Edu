import { describe, it, expect } from 'vitest';
import { MemoryAssetStore, StoryLoader, makeSyntheticPackage, syntheticBackend, hashOf } from './lazy-loader';
import { STORY_SPEC, measureAll, classOf, firstOpen, repeatOpen } from './lazy-measurement';
import { MEASURED_LAZY } from './cost-model';

const make = (spec = STORY_SPEC, cap?: number) => {
  const { pkg, sizes } = makeSyntheticPackage(spec);
  const be = syntheticBackend(pkg, sizes, spec.packageBytes);
  return { pkg, be, store: new MemoryAssetStore(cap) };
};

describe('StoryLoader', () => {
  it('eager open downloads the package once and each distinct asset once (shared art stored once)', async () => {
    const { be, store } = make();
    const l = new StoryLoader(be, store);
    await l.openEager(be.path);
    expect(l.stats.packageRequests).toBe(1);
    expect(l.stats.imageRequests).toBe(9); // pages 1 and 10 share one illustration
    expect(l.stats.audioRequests).toBe(10);
    expect(l.stats.requests).toBe(20);
  });
  it('lazy open fetches only the package until a page is shown', async () => {
    const { be, store } = make();
    const l = new StoryLoader(be, store);
    await l.openPackage(be.path);
    expect(l.stats.requests).toBe(1);
  });
  it('showing page 1 in listen mode fetches page 1 art + narration, plus the look-ahead page', async () => {
    const { be, store } = make();
    const l = new StoryLoader(be, store, { lookAhead: 1 });
    const pkg = await l.openPackage(be.path);
    await l.showPage(pkg, 0, 'listen');
    expect(l.stats.imageRequests).toBe(2);
    expect(l.stats.audioRequests).toBe(2);
  });
  it('solo mode ("Let Me Read") never fetches narration', async () => {
    const { be, store } = make();
    const l = new StoryLoader(be, store);
    const pkg = await l.openPackage(be.path);
    for (let i = 0; i < 10; i++) await l.showPage(pkg, i, 'solo');
    expect(l.stats.audioRequests).toBe(0);
    expect(l.stats.imageRequests).toBe(9);
  });
  it('lazy reading the whole story never costs more than the eager download', async () => {
    for (const mode of ['listen', 'follow', 'solo'] as const) {
      const a = make(); const eager = new StoryLoader(a.be, a.store); await eager.openEager(a.be.path);
      const b = make(); const lazy = new StoryLoader(b.be, b.store); const pkg = await lazy.openPackage(b.be.path);
      for (let i = 0; i < 10; i++) await lazy.showPage(pkg, i, mode);
      expect(lazy.stats.requests).toBeLessThanOrEqual(eager.stats.requests);
      expect(lazy.stats.bytes).toBeLessThanOrEqual(eager.stats.bytes);
    }
  });
  it('a repeat open on a warm device cache makes zero requests', async () => {
    const r = await repeatOpen();
    expect(r.requests).toBe(0);
    expect(r.bytes).toBe(0);
  });
  it('two concurrent requests for one asset share a single download', async () => {
    const { be, store } = make();
    let calls = 0;
    const counting = { ...be, fetchFile: async (p: string) => { calls++; return be.fetchFile(p); } };
    const l = new StoryLoader(counting, store);
    const pkg = await l.openPackage(be.path);
    await Promise.all([l.showPage(pkg, 0, 'solo'), l.showPage(pkg, 9, 'solo')]); // pages 1 and 10 share art
    expect(calls).toBe(2); // shared art for pages 1 and 10 once + page 2 art (look-ahead). Without dedup this would be 3.
  });
  it('the store evicts least-recently-used entries and respects its byte cap', () => {
    const s = new MemoryAssetStore(100);
    s.put('a', 40); s.put('b', 40); s.has('a'); s.put('c', 40);
    expect(s.has('b')).toBe(false); // b was least recently used
    expect(s.has('a')).toBe(true);
    expect(s.size).toBeLessThanOrEqual(100);
    s.put('huge', 500);
    expect(s.has('huge')).toBe(false);
  });
  it('synthetic hashes are valid sha256 strings and unique per asset', () => {
    expect(hashOf(5)).toMatch(/^sha256:[0-9a-f]{64}$/);
    const { pkg } = makeSyntheticPackage(STORY_SPEC);
    expect(Object.keys(pkg.assets)).toHaveLength(19);
  });
});

describe('measured effect of lazy loading and caching (synthetic 10-page story, assumed reading behaviour)', () => {
  it('eager baseline: 20 requests, 1.058 MB', async () => {
    const eager = await firstOpen('eager');
    expect(eager.requests).toBe(20);
    expect(eager.bytes).toBe(8_000 + 9 * 50_000 + 10 * 60_000);
  });
  it('lazy loading cuts first-open bytes and requests by roughly a quarter under the assumed behaviour mix', async () => {
    const m = await measureAll();
    expect(m.ratios.bytesLazyVsEager).toBeGreaterThan(0.7);
    expect(m.ratios.bytesLazyVsEager).toBeLessThan(0.78);
    expect(m.ratios.requestsLazyVsEager).toBeGreaterThan(0.72);
    expect(m.ratios.requestsLazyVsEager).toBeLessThan(0.8);
  });
  it('look-ahead costs little: each extra page of look-ahead adds under 5% bytes', async () => {
    const l0 = await firstOpen('lazy', 0), l1 = await firstOpen('lazy', 1), l2 = await firstOpen('lazy', 2);
    expect(l1.bytes / l0.bytes).toBeLessThan(1.05);
    expect(l2.bytes / l1.bytes).toBeLessThan(1.05);
  });
  it('cost-model MEASURED_LAZY constants have not drifted from the measurement', async () => {
    const m = await measureAll();
    expect(Math.abs(m.ratios.bytesLazyVsEager - MEASURED_LAZY.bytesFactor)).toBeLessThan(0.005);
    expect(Math.abs(m.ratios.requestsLazyVsEager - MEASURED_LAZY.filesFactor)).toBeLessThan(0.005);
  });
  it('a class of 30 on one shared device downloads a story about once; on personal devices 30 times', async () => {
    const shared = await classOf(30, true);
    const personal = await classOf(30, false);
    expect(personal.requestsPerChild).toBe(20);
    expect(shared.requestsPerChild).toBeCloseTo(20 / 30, 6);
    expect(shared.mbPerChild).toBeCloseTo(personal.mbPerChild / 30, 6);
  });
});
