/**
 * Persistent asset cache for the reader (Cache Storage API), plus the `Backend` the StoryLoader uses.
 * Everything is keyed by URL, and library URLs are content-hashed/immutable, so a cached file is never stale.
 * Supports an optional CDN/Storage URL resolver so content-addressed Storage paths resolve transparently to CDN URLs.
 * If Cache Storage is unavailable (older browsers, private mode) it falls back to plain fetch: slower, never broken.
 */
import type { StoryPackage } from './types';
import type { Backend } from './lazy-loader';

export interface CacheStats { requests: number; cacheHits: number; bytesDownloaded: number; bytesFromCache: number; failures: number }
export const emptyCacheStats = (): CacheStats => ({ requests: 0, cacheHits: 0, bytesDownloaded: 0, bytesFromCache: 0, failures: 0 });

export const CACHE_NAME = 'story-spark-library-v1';

export class BrowserAssetCache implements Backend {
  readonly stats = emptyCacheStats();
  private urls = new Map<string, string>();
  constructor(
    private fetchFn: typeof fetch = (...a) => fetch(...a),
    private cacheName = CACHE_NAME,
    private resolveUrl: (path: string) => string = (p) => p,
  ) {}

  private async cache(): Promise<Cache | undefined> {
    try { return typeof caches !== 'undefined' ? await caches.open(this.cacheName) : undefined; } catch { return undefined; }
  }

  /** The response body as a Blob, from the device cache when present, else downloaded once and stored. */
  async blob(pathOrUrl: string, countHit = true): Promise<Blob> {
    const url = this.resolveUrl(pathOrUrl);
    const cache = await this.cache();
    if (cache) {
      const hit = await cache.match(url);
      if (hit) { const b = await hit.blob(); if (countHit) { this.stats.cacheHits++; this.stats.bytesFromCache += b.size; } return b; }
    }
    this.stats.requests++;
    let res: Response;
    try { res = await this.fetchFn(url); } catch (e) { this.stats.failures++; throw e; }
    if (!res.ok) { this.stats.failures++; throw new Error(`HTTP ${res.status} for ${url}`); }
    const copy = res.clone();
    const b = await res.blob();
    this.stats.bytesDownloaded += b.size;
    if (cache) { try { await cache.put(url, copy); } catch { /* quota: still usable this session */ } }
    return b;
  }

  /** An object URL for <audio>/<img>, reused for the life of the page. */
  async objectUrl(pathOrUrl: string): Promise<string> {
    const url = this.resolveUrl(pathOrUrl);
    const known = this.urls.get(url);
    if (known) return known;
    // Re-reading a file the loader just fetched is not a new cache hit, so it is not counted.
    const u = URL.createObjectURL(await this.blob(url, false));
    this.urls.set(url, u);
    return u;
  }

  // ---- lazy-loader Backend
  async fetchPackage(path: string) {
    const b = await this.blob(path);
    const txt = typeof b.text === 'function'
      ? await b.text()
      : await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result ?? ''));
          r.onerror = () => reject(r.error);
          r.readAsText(b);
        });
    return { pkg: JSON.parse(txt) as StoryPackage, bytes: b.size };
  }
  async fetchFile(path: string) { return { bytes: (await this.blob(path)).size }; }

  async clear() {
    try { await caches.delete(this.cacheName); } catch { /* ignore */ }
    for (const u of this.urls.values()) URL.revokeObjectURL(u);
    this.urls.clear();
  }
}
