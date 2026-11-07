// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { blend, librarySweep, monthlyCostAt, simulate } from './session-simulation';
import { REVISED } from './cost-model';

vi.setConfig({ testTimeout: 180_000 });

const total = (r: { firestoreReads: number; rulesLookupReads: number }) => r.firestoreReads + r.rulesLookupReads;
const f = (n: number, d = 2) => n.toFixed(d);

describe('growing the central library does not grow a normal learner session\'s Firestore reads in proportion', () => {
  for (const device of ['personal', 'shared'] as const) {
    it(`${device} devices: 100 → 1,000 → 10,000 stories`, async () => {
      const sweep = await librarySweep([100, 1000, 10_000], { device });
      const [a, b, c] = sweep;
      const ra = total(a.res.perLearnerMonth), rb = total(b.res.perLearnerMonth), rc = total(c.res.perLearnerMonth);
      const naive = (x: typeof a) => x.naiveFullCatalogueReads;
      // eslint-disable-next-line no-console
      console.log(`[library growth, ${device}] reads/learner-month (incl. rules lookups): 100→${f(ra)}, 1,000→${f(rb)}, 10,000→${f(rc)}; naive whole-catalogue reads per session: ${naive(a)}, ${naive(b)}, ${naive(c)}; storage GETs/learner-month: ${f(a.res.perLearnerMonth.storageRequests, 1)}, ${f(b.res.perLearnerMonth.storageRequests, 1)}, ${f(c.res.perLearnerMonth.storageRequests, 1)}; MB: ${f(a.res.perLearnerMonth.storageMB, 1)}, ${f(b.res.perLearnerMonth.storageMB, 1)}, ${f(c.res.perLearnerMonth.storageMB, 1)}`);
      // 10x the library → well under 1.5x the reads (a 100-story library cannot fill three 20-entry pages per age tier)
      expect(rb / ra).toBeLessThan(1.5);
      // beyond the point where pages are full, reads are flat
      expect(rc / rb).toBeLessThan(1.02);
      // while the naive approach is proportional
      expect(naive(b) / naive(a)).toBeGreaterThan(9);
      expect(naive(c) / naive(b)).toBeGreaterThan(9);
      // same behaviour in every run: the learner's opens do not depend on library size
      for (const s of sweep) expect(s.res.perLearnerMonth.opens).toBeCloseTo(24, 5);
      // storage requests grow sub-linearly (more distinct stories → fewer repeats), nowhere near 10x
      expect(b.res.perLearnerMonth.storageRequests / a.res.perLearnerMonth.storageRequests).toBeLessThan(5);
      expect(c.res.perLearnerMonth.storageRequests / b.res.perLearnerMonth.storageRequests).toBeLessThan(2);
    });
  }
});

describe('opening a story costs no Firestore read', () => {
  it('with the catalogue cached and unchanged, a session reads exactly one document (library_meta)', async () => {
    const r = await simulate({ library: 1000, learners: 30, months: 2, publishesPerMonth: 0, sessionsPerLearnerMonth: 12 });
    // 1 read per session (meta) once warm; the first session of each device also reads its pages. Bound it tightly.
    const perSession = r.perLearnerMonth.firestoreReads / 12;
    expect(perSession).toBeLessThan(1 + (3 * 20) / 12 / 2 + 0.5);
  });
});

describe('shared and personal devices', () => {
  it('a shared class device serves more opens from cache than personal devices, at every library size', async () => {
    for (const library of [100, 1000]) {
      const shared = await simulate({ library, device: 'shared' });
      const personal = await simulate({ library, device: 'personal' });
      expect(shared.deviceCacheHitOpens).toBeGreaterThan(personal.deviceCacheHitOpens);
      expect(shared.perLearnerMonth.storageMB).toBeLessThan(personal.perLearnerMonth.storageMB);
    }
  });

  it('is deterministic', async () => {
    const a = await simulate({ library: 500, learners: 60, months: 2 });
    const b = await simulate({ library: 500, learners: 60, months: 2 });
    expect(b).toEqual(a);
  });

  it('delta refresh cuts catalogue reads a lot versus refetching browsed pages', async () => {
    const d = await simulate({ library: 1000, refresh: 'delta' });
    const r = await simulate({ library: 1000, refresh: 'refetch' });
    expect(d.perLearnerMonth.firestoreReads).toBeLessThan(r.perLearnerMonth.firestoreReads / 3);
    // even if new stories land at random positions (worst case for delta), it stays better than refetching
    const worst = await simulate({ library: 1000, refresh: 'delta', insertMode: 'random' });
    expect(worst.perLearnerMonth.firestoreReads).toBeLessThan(r.perLearnerMonth.firestoreReads);
  });

  it('a very small device cache lowers the hit rate (LRU eviction is modelled)', async () => {
    const big = await simulate({ library: 300, learners: 60, months: 2 });
    const tiny = await simulate({ library: 300, learners: 60, months: 2, cacheBytes: 3 * 1024 * 1024 });
    expect(tiny.deviceCacheHitOpens).toBeLessThan(big.deviceCacheHitOpens);
  });

  it('sensitivity: the 60% planning hit rate versus what the simulation produces, and what each costs per month at 100k learners', async () => {
    const shared = await simulate({ library: 1000, device: 'shared' });
    const personal = await simulate({ library: 1000, device: 'personal' });
    const rows = [0, 0.25, 0.5, 0.75, 1].map((fr) => blend(shared, personal, fr));
    // eslint-disable-next-line no-console
    console.log('[shared vs personal, library 1,000]\n' + [
      '| device mix | opens served from cache | Firestore reads/learner-mo (+rules) | Storage GETs/learner-mo | MB/learner-mo | model $/month @100k (Option B) |',
      '|---|---|---|---|---|---|',
      ...rows.map((x) => `| ${Math.round(x.sharedFraction * 100)}% shared | ${f(x.deviceCacheHitOpens * 100, 0)}% | ${f(x.firestoreReads, 1)} (+${f(x.rulesLookupReads, 1)}) | ${f(x.storageRequests, 0)} | ${f(x.storageMB, 1)} | $${f(monthlyCostAt(x.deviceCacheHitOpens).totalUsd, 0)} |`),
      `| planning figure | 60% | – | – | – | $${f(monthlyCostAt(0.6).totalUsd, 0)} |`,
    ].join('\n'));
    // blended hit rate rises monotonically with the share of shared devices
    for (let i = 1; i < rows.length; i++) expect(rows[i].deviceCacheHitOpens).toBeGreaterThan(rows[i - 1].deviceCacheHitOpens);
    // and cost falls with it
    const costs = rows.map((x) => monthlyCostAt(x.deviceCacheHitOpens).totalUsd);
    for (let i = 1; i < costs.length; i++) expect(costs[i]).toBeLessThan(costs[i - 1]);
    // even the worst device mix stays within a small multiple of the planning cost (the budget is not hostage to this assumption)
    expect(Math.max(...costs) / monthlyCostAt(0.6).totalUsd).toBeLessThan(2);
    expect(REVISED.deviceCacheHit).toBe(0.6); // the planning figure is unchanged
  });
});
