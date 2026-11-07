/**
 * Measures lazy loading and caching with the real StoryLoader against a counting backend.
 * Deterministic: no randomness, no network. The reading-behaviour mix below is an ASSUMPTION (replace with pilot data);
 * what is measured is what the loader does for each behaviour.
 */
import { MemoryAssetStore, StoryLoader, emptyStats, makeSyntheticPackage, syntheticBackend, type ReadMode, type Stats } from './lazy-loader';

/** The synthetic story: 10 pages, 50 KB image + 60 KB narration per page, 8 KB package JSON, closing card reuses page 1's art. */
export const STORY_SPEC = { pages: 10, imageBytes: 50_000, audioBytes: 60_000, packageBytes: 8_000, sharedImagePages: [1, 10] };

/** Behaviour assumptions: who reads how far, in which mode. Weights sum to 1 within each list. */
export const BEHAVIOUR = {
  reach: [ { pagesViewed: 10, weight: 0.7 }, { pagesViewed: 3, weight: 0.3 } ],
  modes: [ { mode: 'listen' as ReadMode, weight: 0.5 }, { mode: 'follow' as ReadMode, weight: 0.3 }, { mode: 'solo' as ReadMode, weight: 0.2 } ],
};

const MB = 1e6;
export interface Row { label: string; requests: number; mb: number; cacheHits: number }

async function readStory(loader: StoryLoader, path: string, mode: ReadMode, pagesViewed: number) {
  const pkg = await loader.openPackage(path);
  for (let i = 0; i < pagesViewed; i++) await loader.showPage(pkg, i, mode);
}

/** Expected cost of ONE first-time open on an empty cache, weighted over the behaviour mix. */
export async function firstOpen(strategy: 'eager' | 'lazy', lookAhead = 1): Promise<Stats> {
  const acc = emptyStats();
  for (const r of BEHAVIOUR.reach) for (const m of BEHAVIOUR.modes) {
    const { pkg, sizes } = makeSyntheticPackage(STORY_SPEC);
    const be = syntheticBackend(pkg, sizes, STORY_SPEC.packageBytes);
    const loader = new StoryLoader(be, new MemoryAssetStore(), { lookAhead });
    if (strategy === 'eager') await loader.openEager(be.path); else await readStory(loader, be.path, m.mode, r.pagesViewed);
    const w = r.weight * m.weight;
    for (const k of Object.keys(acc) as Array<keyof Stats>) acc[k] += loader.stats[k] * w;
  }
  return acc;
}

/** Cost of opening the same story a second time on the same device (cache warm), lazy strategy. */
export async function repeatOpen(): Promise<Stats> {
  const { pkg, sizes } = makeSyntheticPackage(STORY_SPEC);
  const be = syntheticBackend(pkg, sizes, STORY_SPEC.packageBytes);
  const store = new MemoryAssetStore();
  const first = new StoryLoader(be, store);
  await readStory(first, be.path, 'listen', 10);
  const second = new StoryLoader(be, store);
  await readStory(second, be.path, 'listen', 10);
  return second.stats;
}

/** A class of `n` children opening the same assigned story: on ONE shared device vs on n personal devices. Per child. */
export async function classOf(n: number, shared: boolean): Promise<{ requestsPerChild: number; mbPerChild: number }> {
  const { pkg, sizes } = makeSyntheticPackage(STORY_SPEC);
  const be = syntheticBackend(pkg, sizes, STORY_SPEC.packageBytes);
  let store = new MemoryAssetStore();
  let requests = 0, bytes = 0;
  for (let i = 0; i < n; i++) {
    if (!shared) store = new MemoryAssetStore();
    const l = new StoryLoader(be, store);
    await readStory(l, be.path, 'listen', 10);
    requests += l.stats.requests; bytes += l.stats.bytes;
  }
  return { requestsPerChild: requests / n, mbPerChild: bytes / n / MB };
}

export async function measureAll() {
  const eager = await firstOpen('eager');
  const lazy0 = await firstOpen('lazy', 0);
  const lazy1 = await firstOpen('lazy', 1);
  const lazy2 = await firstOpen('lazy', 2);
  const repeat = await repeatOpen();
  const row = (label: string, s: Stats): Row => ({ label, requests: s.requests, mb: s.bytes / MB, cacheHits: s.cacheHits });
  return {
    firstOpen: [
      row('eager (download everything on open)', eager),
      row('lazy, no look-ahead', lazy0),
      row('lazy, look-ahead 1 page (default)', lazy1),
      row('lazy, look-ahead 2 pages', lazy2),
    ],
    repeatOpenSameDevice: row('repeat open, warm cache', repeat),
    class30SharedDevice: await classOf(30, true),
    class30PersonalDevices: await classOf(30, false),
    ratios: {
      bytesLazyVsEager: lazy1.bytes / eager.bytes,
      requestsLazyVsEager: lazy1.requests / eager.requests,
    },
  };
}
