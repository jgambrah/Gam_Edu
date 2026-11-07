import { describe, it, expect } from 'vitest';
import {
  PRICING, BASE, REVISED, MEASURED_LAZY, model, progressWrites, firestoreOps, gcsEgress, cdnEgress, SCALE_POINTS, CACHE_SCENARIOS,
  type OptionKey,
} from './cost-model';

const KEYS: OptionKey[] = ['A', 'B', 'B-lookup', 'C'];
const at = (learners: number, over: Partial<typeof REVISED> = {}) => ({ ...REVISED, learners, schools: learners / 100, ...over });

describe('pricing snapshot (verified 2026-11-07; a change here must come with a new verification)', () => {
  it('Firestore', () => {
    expect(PRICING.firestore).toMatchObject({ readPer100k: 0.03, writePer100k: 0.09, freeReadsPerDay: 50_000, freeWritesPerDay: 20_000, egressPerGiB: 0.12, egressFreeGiB: 10 });
    expect(PRICING.firestore.storedGiBMonth).toBeCloseTo(0.15, 2); // unit read as per GiB-hour: unverified, no effect on totals
  });
  it('Cloud Storage', () => {
    expect(PRICING.gcs).toMatchObject({ storedGiBMonthRegional: 0.02, storedGiBMonthMulti: 0.026, classBPer1k: 0.0004, classAPer1kRegional: 0.005, egressTier1PerGiB: 0.12, egressTier2PerGiB: 0.11 });
  });
  it('Hosting and Cloud CDN', () => {
    expect(PRICING.hosting).toMatchObject({ transferPerGB: 0.15, storagePerGB: 0.026 });
    expect(PRICING.cloudCdn).toMatchObject({ egressOtherDestPerGiB_0_10TiB: 0.09, egressOtherDestPerGiB_10_150TiB: 0.06, cacheFillPerGiBInterRegion: 0.04, lookupPer10kRequests: 0.0075 });
  });
  it('Hosting is dearer per GB than Storage egress, so it is not a cheaper media CDN', () => {
    expect(PRICING.hosting.transferPerGB).toBeGreaterThan(PRICING.gcs.egressTier1PerGiB);
  });
});

describe('assumption snapshot (changing one is a deliberate act, so it fails loudly)', () => {
  it('first-pass BASE', () => {
    expect(BASE).toMatchObject({
      learners: 100_000, schools: 1_000, sessionsPerLearnerMonth: 12, opensPerSession: 2, deviceCacheHit: 0.6, edgeCacheHit: 0.9,
      packageMB: 1.2, filesPerPackage: 21, checkpointsPerOpen: 1.5, naiveWritesPerOpen: 10, storiesInLibrary: 2_000, versionsKept: 3,
      lazyBytesFactor: 1, lazyFilesFactor: 1, rulesReadsPerLibraryRequest: 0,
    });
  });
  it('REVISED differs from BASE only by lazy loading and rules-lookup reads', () => {
    const { lazyBytesFactor, lazyFilesFactor, rulesReadsPerLibraryRequest, rulesReadsPerStorageFile, ...rest } = REVISED;
    const { lazyBytesFactor: _a, lazyFilesFactor: _b, rulesReadsPerLibraryRequest: _c, rulesReadsPerStorageFile: _d, ...baseRest } = BASE;
    expect(rest).toEqual(baseRest);
    expect(lazyBytesFactor).toBe(MEASURED_LAZY.bytesFactor);
    expect(lazyFilesFactor).toBe(MEASURED_LAZY.filesFactor);
    expect(rulesReadsPerLibraryRequest).toBe(3);
    expect(rulesReadsPerStorageFile).toBeLessThanOrEqual(2); // a Storage rule may do at most 2 lookups
  });
});

describe('building blocks', () => {
  it('Firestore free quota is applied per day x 30, then billed per 100k', () => {
    expect(firestoreOps(1_500_000, 0, 0)).toBe(0);
    expect(firestoreOps(1_600_000, 0, 0)).toBeCloseTo(0.03, 6);
    expect(firestoreOps(0, 700_000, 0)).toBeCloseTo(0.09, 6);
    expect(firestoreOps(0, 0, 10)).toBe(0);
    expect(firestoreOps(0, 0, 11)).toBeCloseTo(0.12, 6);
  });
  it('Storage and CDN egress change rate exactly at 10 TiB', () => {
    const T = 10 * 1024;
    expect(gcsEgress(T)).toBeCloseTo(T * 0.12, 6);
    expect(gcsEgress(T + 1)).toBeCloseTo(T * 0.12 + 0.11, 6);
    expect(cdnEgress(T)).toBeCloseTo(T * 0.09, 6);
    expect(cdnEgress(T + 1)).toBeCloseTo(T * 0.09 + 0.06, 6);
  });
  it('batched progress writes are 10/1.5 times fewer and at least 7x cheaper', () => {
    const p = progressWrites(BASE);
    expect(p.naiveWrites / p.batchedWrites).toBeCloseTo(10 / 1.5, 6);
    expect(p.naiveUsd / p.batchedUsd).toBeGreaterThan(7);
  });
});

describe('model behaviour', () => {
  it('the total is the sum of its parts and nothing is negative', () => {
    for (const k of KEYS) for (const s of SCALE_POINTS) {
      const r = model(k, { ...REVISED, learners: s.learners, schools: s.schools });
      expect(r.totalUsd).toBeCloseTo(r.firestoreUsd + r.storageUsd + r.cdnUsd, 9);
      for (const v of [r.firestoreUsd, r.storageUsd, r.cdnUsd, r.mediaGiB, r.firestoreReads, r.firestoreWrites]) expect(v).toBeGreaterThanOrEqual(0);
    }
  });
  it('an empty platform costs almost nothing (only stored library data)', () => {
    const r = model('B', { ...REVISED, learners: 0, schools: 0 });
    expect(r.firestoreUsd).toBe(0);
    expect(r.mediaGiB).toBe(0);
    expect(r.totalUsd).toBeLessThan(1);
  });
  it('cost per learner stays within 5% from 100,000 to 500,000 learners (linear scaling)', () => {
    for (const k of KEYS) {
      const a = model(k, at(100_000)).perLearnerUsd;
      const b = model(k, at(500_000)).perLearnerUsd;
      expect(Math.abs(b - a) / a).toBeLessThan(0.05);
    }
  });
  it('option A costs more than B at the target scale, at every cache level', () => {
    for (const c of CACHE_SCENARIOS) {
      expect(model('A', at(100_000, { deviceCacheHit: c.hit })).totalUsd).toBeGreaterThan(model('B', at(100_000, { deviceCacheHit: c.hit })).totalUsd * 1.5);
    }
  });
  it('rules lookups in Storage make B-lookup cost at least as much as B', () => {
    expect(model('B-lookup', at(100_000)).firestoreReads).toBeGreaterThan(model('B', at(100_000)).firestoreReads);
    expect(model('B-lookup', at(100_000)).totalUsd).toBeGreaterThanOrEqual(model('B', at(100_000)).totalUsd);
  });
  it('a better device cache hit rate always lowers cost, for every option', () => {
    for (const k of KEYS) {
      const costs = CACHE_SCENARIOS.map((c) => model(k, at(100_000, { deviceCacheHit: c.hit })).totalUsd);
      expect(costs[0]).toBeGreaterThan(costs[1]);
      expect(costs[1]).toBeGreaterThan(costs[2]);
    }
  });
  it('media bandwidth is the dominant cost of option B at the target scale', () => {
    const r = model('B', at(100_000));
    expect(r.storageUsd / r.totalUsd).toBeGreaterThan(0.85);
  });
  it('lazy loading lowers bytes and requests by exactly the measured factors', () => {
    const eager = model('B', { ...REVISED, lazyBytesFactor: 1, lazyFilesFactor: 1 });
    const lazy = model('B', REVISED);
    expect(lazy.mediaGiB / eager.mediaGiB).toBeCloseTo(MEASURED_LAZY.bytesFactor, 6);
    expect(lazy.mediaGiB).toBeLessThan(eager.mediaGiB);
    expect(lazy.storageGets).toBeLessThan(eager.storageGets);
  });
  it('Firestore reads do not grow with the number of stories in the library (B, C)', () => {
    for (const k of ['B', 'B-lookup', 'C'] as const) {
      const small = model(k, { ...REVISED, storiesInLibrary: 200 });
      const huge = model(k, { ...REVISED, storiesInLibrary: 20_000 });
      expect(huge.firestoreReads).toBe(small.firestoreReads);
      expect(huge.mediaGiB).toBe(small.mediaGiB);
    }
  });
  it('option C: CDN cost equals egress + cache fill on edge misses + lookups (hand calculation)', () => {
    const a = { ...REVISED, learners: 1_000, schools: 10, deviceCacheHit: 0.5, edgeCacheHit: 0.8 };
    const r = model('C', a);
    const expected = r.mediaGiB * 0.09 + r.mediaGiB * 0.2 * 0.04 + (r.storageGets / 1e4) * 0.0075;
    expect(r.cdnUsd).toBeCloseTo(expected, 9);
  });
  it('reads scale with sessions, not with media: doubling package size leaves reads unchanged', () => {
    const a = model('B', REVISED);
    const b = model('B', { ...REVISED, packageMB: REVISED.packageMB * 2 });
    expect(b.firestoreReads).toBe(a.firestoreReads);
    expect(b.mediaGiB / a.mediaGiB).toBeCloseTo(2, 6);
  });
});
