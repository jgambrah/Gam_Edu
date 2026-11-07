/**
 * Learner-session economics simulation (Stage 2). Deterministic; drives the REAL StoryLoader and CatalogueClient with
 * synthetic stories against counting backends. Behaviour parameters are ASSUMPTIONS: every number that comes out is
 * provisional until the pilot (docs/STORY-LIBRARY-STAGE-2-REPORT.md, "Pilot measurement strategy") replaces them.
 *
 * Two device models, because we must not assume which dominates:
 *   shared   — one tablet/PC (or cart) per class; ~30 learners take turns; ONE cache for all of them;
 *   personal — each learner has a phone/tablet of their own; one private cache each, which can be evicted/cleared.
 */
import { MemoryAssetStore, StoryLoader, emptyStats, makeSyntheticPackage, syntheticBackend, type Backend, type ReadMode, type Stats } from './lazy-loader';
import { BEHAVIOUR, STORY_SPEC } from './lazy-measurement';
import { CatalogueClient, MemoryKV, SimulatedCatalogue, loadWholeCatalogue } from './catalogue-client';
import { BASE, REVISED, model, type Assumptions } from './cost-model';
import { rng } from './seeder/synthetic';
import type { StoryPackage } from './types';

export interface SimConfig {
  library: number;
  learners: number;             // simulated learners (a multiple of classSize keeps classes whole)
  classSize: number;
  device: 'shared' | 'personal';
  sessionsPerLearnerMonth: number;
  opensPerSession: number;
  /** Zipf exponent of free-choice popularity (1 = a few stories dominate). */
  zipf: number;
  /** Chance a learner reads the story their teacher assigned this week instead of choosing freely. */
  assignedShare: number;
  /** Chance (for a non-assigned open) that a learner re-opens a story they already read. ASSUMPTION: young readers re-read favourites. */
  rereadShare: number;
  /** Personal devices: chance per month that the cache is lost (storage eviction, cleared data, new phone). */
  personalCacheLossPerMonth: number;
  /** Shared devices: chance per month the device is reset/re-imaged (term resets, multiple classes sharing). */
  sharedCacheLossPerMonth: number;
  /** Cache cap per device in bytes. */
  cacheBytes: number;
  publishesPerMonth: number;
  refresh: 'refetch' | 'delta';
  /** Where newly published stories sort in the catalogue. */
  insertMode: 'append' | 'random';
  months: number;
  seed: number;
}

export const DEFAULT_SIM: SimConfig = {
  library: 1000, learners: 300, classSize: 30, device: 'personal',
  sessionsPerLearnerMonth: BASE.sessionsPerLearnerMonth, opensPerSession: BASE.opensPerSession,
  zipf: 1.0, assignedShare: 0.5, rereadShare: 0.25,
  personalCacheLossPerMonth: 0.1, sharedCacheLossPerMonth: 0.1,
  cacheBytes: 250 * 1024 * 1024, publishesPerMonth: 8, refresh: 'delta', insertMode: 'append', months: 3, seed: 7,
};

export interface SimResult {
  config: SimConfig;
  perLearnerMonth: {
    firestoreReads: number;        // library_meta + catalogue pages + delta queries (excludes rules lookups)
    rulesLookupReads: number;      // reads billed to security-rules lookups for those requests
    storageRequests: number;       // package + media GETs
    storageMB: number;
    opens: number;
  };
  /** Share of story opens that needed NO network at all (what cost-model.deviceCacheHit means). */
  deviceCacheHitOpens: number;
  /** Share of requested objects served from cache (finer: counts partially cached opens). */
  objectHit: number;
}

function zipfTable(n: number, s: number): number[] {
  const w = Array.from({ length: n }, (_, i) => 1 / Math.pow(i + 1, s));
  const total = w.reduce((a, b) => a + b, 0);
  let acc = 0;
  return w.map((x) => (acc += x / total));
}
function draw(cdf: number[], u: number): number {
  let lo = 0, hi = cdf.length - 1;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (cdf[mid] >= u) hi = mid; else lo = mid + 1; }
  return lo;
}
function pickWeighted<T extends { weight: number }>(items: T[], u: number): T {
  let a = 0; for (const it of items) { a += it.weight; if (u <= a) return it; } return items[items.length - 1];
}

class Library {
  private cache = new Map<number, { pkg: StoryPackage; sizes: Map<string, number> }>();
  get(i: number) {
    let v = this.cache.get(i);
    if (!v) { v = makeSyntheticPackage({ ...STORY_SPEC, seed: i + 1 }); this.cache.set(i, v); }
    return v;
  }
}

interface Device { store: MemoryAssetStore; kv: MemoryKV; catalogue: CatalogueClient }

export async function simulate(partial: Partial<SimConfig> = {}): Promise<SimResult> {
  const c: SimConfig = { ...DEFAULT_SIM, ...partial };
  const r = rng(c.seed);
  const cat = new SimulatedCatalogue(c.library, REVISED.rulesReadsPerLibraryRequest, c.insertMode);
  const lib = new Library();
  const cdf = zipfTable(c.library, c.zipf);
  let nextNew = c.library;

  const backendFor = (storyIdx: number): Backend & { path: string } => {
    const { pkg, sizes } = lib.get(storyIdx);
    return syntheticBackend(pkg, sizes, STORY_SPEC.packageBytes);
  };
  const newDevice = (): Device => {
    const kv = new MemoryKV();
    return { store: new MemoryAssetStore(c.cacheBytes), kv, catalogue: new CatalogueClient(cat, kv, { pageSize: 20, refresh: c.refresh }) };
  };

  const history: number[][] = Array.from({ length: c.learners }, () => []);
  const classes = Math.ceil(c.learners / c.classSize);
  const devices: Device[] = c.device === 'shared' ? Array.from({ length: classes }, newDevice) : Array.from({ length: c.learners }, newDevice);
  const deviceOf = (learner: number) => (c.device === 'shared' ? devices[Math.floor(learner / c.classSize)] : devices[learner]);

  const net: Stats = emptyStats();
  let opens = 0, zeroNetworkOpens = 0;

  for (let month = 0; month < c.months; month++) {
    // cache loss events at month boundaries (not before the first month: the first month is the cold start we want to see)
    if (month > 0) {
      const p = c.device === 'shared' ? c.sharedCacheLossPerMonth : c.personalCacheLossPerMonth;
      for (let d = 0; d < devices.length; d++) if (r() < p) devices[d] = newDevice();
    }
    const assigned = Array.from({ length: classes * 4 }, () => draw(cdf, r())); // one assigned story per class per week
    // publishes spread over the month: each publish moves the catalogue version and changes a few entries
    const publishAt = new Set(Array.from({ length: c.publishesPerMonth }, (_, k) => Math.floor(((k + 0.5) * c.sessionsPerLearnerMonth) / c.publishesPerMonth)));

    for (let s = 0; s < c.sessionsPerLearnerMonth; s++) {
      if (publishAt.has(s)) {
        const add = [nextNew++, nextNew++];
        const upd = [cat.entries[Math.floor(r() * cat.entries.length)].storyKey];
        cat.publishBatch({ add, update: upd });
      }
      const week = Math.min(3, Math.floor((s * 4) / c.sessionsPerLearnerMonth));
      for (let learner = 0; learner < c.learners; learner++) {
        const dev = deviceOf(learner);
        const tier = ['3-4', '5-6', '7-8', '9-10'][Math.floor(learner / c.classSize) % 4];
        await dev.catalogue.startSession();
        const u = r();
        const pages = u < 0.6 ? 1 : u < 0.9 ? 2 : 3;
        for (let p = 0; p < pages; p++) await dev.catalogue.getPage(p, tier);

        for (let o = 0; o < c.opensPerSession; o++) {
          const klass = Math.floor(learner / c.classSize);
          let story: number;
          if (r() < c.assignedShare && o === 0) story = assigned[klass * 4 + week];
          else if (history[learner].length && r() < c.rereadShare) story = history[learner][Math.floor(r() * history[learner].length)];
          else story = draw(cdf, r());
          if (!history[learner].includes(story)) history[learner].push(story);
          const be = backendFor(story);
          const loader = new StoryLoader(be, dev.store, { lookAhead: 1 });
          const reach = pickWeighted(BEHAVIOUR.reach, r());
          const mode: ReadMode = pickWeighted(BEHAVIOUR.modes, r()).mode;
          const pkg = await loader.openPackage(be.path);
          for (let i = 0; i < reach.pagesViewed; i++) await loader.showPage(pkg, i, mode);
          opens++;
          if (loader.stats.requests === 0) zeroNetworkOpens++;
          for (const k of Object.keys(net) as Array<keyof Stats>) net[k] += loader.stats[k];
        }
      }
    }
  }

  const lm = c.learners * c.months;
  const requested = net.requests + net.cacheHits;
  const MBv = 1e6;
  return {
    config: c,
    perLearnerMonth: {
      firestoreReads: cat.counters.reads / lm,
      rulesLookupReads: cat.counters.rulesReads / lm,
      storageRequests: net.requests / lm,
      storageMB: net.bytes / MBv / lm,
      opens: opens / lm,
    },
    deviceCacheHitOpens: zeroNetworkOpens / opens,
    objectHit: requested ? net.cacheHits / requested : 0,
  };
}

/** Blend shared-device and personal-device results by the share of learners on shared devices. */
export function blend(shared: SimResult, personal: SimResult, sharedFraction: number) {
  const f = sharedFraction;
  const mix = (a: number, b: number) => f * a + (1 - f) * b;
  const s = shared.perLearnerMonth, p = personal.perLearnerMonth;
  return {
    sharedFraction: f,
    firestoreReads: mix(s.firestoreReads, p.firestoreReads),
    rulesLookupReads: mix(s.rulesLookupReads, p.rulesLookupReads),
    storageRequests: mix(s.storageRequests, p.storageRequests),
    storageMB: mix(s.storageMB, p.storageMB),
    deviceCacheHitOpens: mix(shared.deviceCacheHitOpens, personal.deviceCacheHitOpens),
  };
}

/** Plug a simulated hit rate into the cost model. The 60% planning figure is left untouched elsewhere. */
export function monthlyCostAt(hit: number, a: Assumptions = REVISED) {
  const r = model('B', { ...a, deviceCacheHit: hit });
  return { hit, totalUsd: r.totalUsd, perLearnerUsd: r.perLearnerUsd, firestoreReads: r.firestoreReads, storageGets: r.storageGets, mediaGiB: r.mediaGiB };
}

/** Library-size sweep for a single device model: how the per-learner numbers move as the library grows. */
export async function librarySweep(sizes: number[], base: Partial<SimConfig> = {}) {
  const out: Array<{ library: number; res: SimResult; naiveFullCatalogueReads: number }> = [];
  for (const library of sizes) {
    const res = await simulate({ ...base, library });
    const naive = new SimulatedCatalogue(library, REVISED.rulesReadsPerLibraryRequest);
    await loadWholeCatalogue(naive);
    out.push({ library, res, naiveFullCatalogueReads: naive.counters.reads });
  }
  return out;
}
