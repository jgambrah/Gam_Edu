/**
 * Lazy story loader + asset cache (Stage 1: logic and measurement; the IndexedDB-backed store comes in Stage 3).
 *
 * Opening a story fetches ONE small package JSON. Each page's illustration is fetched when the page is shown (plus a
 * small look-ahead), narration only in modes that play it, and everything is cached by content hash, so a repeat
 * open, a shared illustration, or a second child on the same device costs no request. No Firestore read per page.
 */
import type { StoryPackage } from './types';

export type ReadMode = 'listen' | 'follow' | 'solo';
/** `solo` ("Let Me Read") plays no narration, so its audio is never fetched. */
export const modeUsesAudio = (m: ReadMode) => m !== 'solo';

export interface Backend {
  fetchPackage(path: string): Promise<{ pkg: StoryPackage; bytes: number }>;
  fetchFile(path: string): Promise<{ bytes: number }>;
}

/** Byte-capped LRU. Entries record size only; the real store (Stage 3) keeps the Blob as well. */
export class MemoryAssetStore {
  private map = new Map<string, number>();
  private values = new Map<string, unknown>(); // parsed packages live here too, so every loader on a device shares them
  private total = 0;
  constructor(readonly capBytes = 250 * 1024 * 1024) {}
  has(key: string) {
    if (!this.map.has(key)) return false;
    const v = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, v); // mark most recently used
    return true;
  }
  value<T>(key: string): T | undefined { return this.has(key) ? (this.values.get(key) as T | undefined) : undefined; }
  put(key: string, bytes: number, value?: unknown) {
    if (bytes > this.capBytes) return;
    if (this.map.has(key)) { this.total -= this.map.get(key)!; this.map.delete(key); this.values.delete(key); }
    this.map.set(key, bytes);
    if (value !== undefined) this.values.set(key, value);
    this.total += bytes;
    while (this.total > this.capBytes) {
      const oldest = this.map.keys().next().value as string;
      this.total -= this.map.get(oldest)!;
      this.map.delete(oldest);
      this.values.delete(oldest);
    }
  }
  get size() { return this.total; }
  get count() { return this.map.size; }
}

export interface Stats {
  requests: number;
  bytes: number;
  cacheHits: number;
  packageRequests: number;
  imageRequests: number;
  audioRequests: number;
}
export const emptyStats = (): Stats => ({ requests: 0, bytes: 0, cacheHits: 0, packageRequests: 0, imageRequests: 0, audioRequests: 0 });

export class StoryLoader {
  readonly stats = emptyStats();
  private inflight = new Map<string, Promise<void>>();
  constructor(private backend: Backend, private store: MemoryAssetStore, private opts: { lookAhead: number } = { lookAhead: 1 }) {}

  async openPackage(path: string): Promise<StoryPackage> {
    const key = `pkg:${path}`;
    const cachedPkg = this.store.value<StoryPackage>(key);
    if (cachedPkg) { this.stats.cacheHits++; return cachedPkg; }
    const { pkg, bytes } = await this.backend.fetchPackage(path);
    this.stats.requests++; this.stats.packageRequests++; this.stats.bytes += bytes;
    this.store.put(key, bytes, pkg);
    return pkg;
  }

  private async asset(hash: string, pkg: StoryPackage, kind: 'image' | 'audio') {
    const info = pkg.assets[hash];
    if (!info) return;
    if (this.store.has(hash)) { this.stats.cacheHits++; return; }
    const pending = this.inflight.get(hash);
    if (pending) return pending; // two pages asking for the same asset share one request
    const p = (async () => {
      const { bytes } = await this.backend.fetchFile(info.path);
      this.stats.requests++; this.stats.bytes += bytes;
      if (kind === 'image') this.stats.imageRequests++; else this.stats.audioRequests++;
      this.store.put(hash, bytes);
    })().finally(() => this.inflight.delete(hash));
    this.inflight.set(hash, p);
    return p;
  }

  private async pageAssets(pkg: StoryPackage, index: number, mode: ReadMode) {
    const page = pkg.pages[index];
    if (!page) return;
    const jobs: Promise<void>[] = [];
    if (page.image) jobs.push(this.asset(page.image, pkg, 'image') as Promise<void>);
    if (page.audio && modeUsesAudio(mode)) jobs.push(this.asset(page.audio.hash, pkg, 'audio') as Promise<void>);
    await Promise.all(jobs);
  }

  /** Show a page: load it, then look ahead (fire and forget in the app; awaited here so counts are deterministic). */
  async showPage(pkg: StoryPackage, index: number, mode: ReadMode) {
    await this.pageAssets(pkg, index, mode);
    for (let k = 1; k <= this.opts.lookAhead; k++) await this.pageAssets(pkg, index + k, mode);
  }

  /** The naive alternative, for comparison: download every illustration and narration file up front. */
  async openEager(path: string) {
    const pkg = await this.openPackage(path);
    for (let i = 0; i < pkg.pages.length; i++) {
      const page = pkg.pages[i];
      if (page.image) await this.asset(page.image, pkg, 'image');
      if (page.audio) await this.asset(page.audio.hash, pkg, 'audio');
    }
    return pkg;
  }
}

// ----------------------------------------------------------------------------------------- synthetic fixtures

const hex64 = (n: number) => n.toString(16).padStart(64, '0');
export const hashOf = (n: number) => `sha256:${hex64(n)}`;

export interface SyntheticSpec {
  pages: number;
  imageBytes: number;
  audioBytes: number;
  packageBytes: number;
  /** Pages that reuse ONE shared illustration (e.g. a recurring title or closing card): content addressing stores it once. */
  sharedImagePages?: number[];
  seed?: number;
}

export function makeSyntheticPackage(spec: SyntheticSpec): { pkg: StoryPackage; sizes: Map<string, number> } {
  const seed = (spec.seed ?? 1) * 1000;
  const sizes = new Map<string, number>();
  const assets: StoryPackage['assets'] = {};
  const shared = new Set(spec.sharedImagePages ?? []);
  const sharedHash = hashOf(seed + 999);
  const pages: StoryPackage['pages'] = [];
  for (let i = 0; i < spec.pages; i++) {
    const imgHash = shared.has(i + 1) ? sharedHash : hashOf(seed + i * 2 + 1);
    const audHash = hashOf(seed + i * 2 + 2);
    const imgPath = `story_library/published/assets/${imgHash.slice(7, 9)}/${imgHash.slice(7)}.webp`;
    const audPath = `story_library/published/assets/${audHash.slice(7, 9)}/${audHash.slice(7)}.opus`;
    assets[imgHash] = { path: imgPath, bytes: spec.imageBytes, type: 'image/webp' };
    assets[audHash] = { path: audPath, bytes: spec.audioBytes, type: 'audio/ogg' };
    sizes.set(imgPath, spec.imageBytes);
    sizes.set(audPath, spec.audioBytes);
    pages.push({ n: i + 1, text: `Page ${i + 1} text.`, image: imgHash, audio: { hash: audHash, durationMs: 20000 } });
  }
  const storyId = `synthetic-${spec.seed ?? 1}`;
  const pkg: StoryPackage = { schemaVersion: 1, storyId, version: 1, contentHash: hashOf(seed), title: 'Synthetic', ageTiers: ['3-4'], pages, assets };
  return { pkg, sizes };
}

/** A backend that serves a synthetic package and counts nothing itself (the loader counts). */
export function syntheticBackend(pkg: StoryPackage, sizes: Map<string, number>, packageBytes: number): Backend & { path: string } {
  const path = `story_library/published/packages/${pkg.storyId}/v1/package.json`;
  return {
    path,
    fetchPackage: async () => ({ pkg, bytes: packageBytes }),
    fetchFile: async (p) => {
      const bytes = sizes.get(p);
      if (bytes === undefined) throw new Error(`unknown file ${p}`);
      return { bytes };
    },
  };
}
