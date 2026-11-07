import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BrowserAssetCache } from './browser-cache';

class FakeCache {
  m = new Map<string, Response>();
  async match(u: string) { return this.m.get(u)?.clone(); }
  async put(u: string, r: Response) { this.m.set(u, r); }
}
function installCaches(): FakeCache {
  const c = new FakeCache();
  (globalThis as any).caches = { open: async () => c, delete: async () => { c.m.clear(); return true; } };
  return c;
}
const okFetch = (body = 'abcdef') => vi.fn(async () => new Response(body, { status: 200 }));

describe('BrowserAssetCache', () => {
  beforeEach(() => { (globalThis as any).URL.createObjectURL = vi.fn(() => 'blob:x'); (globalThis as any).URL.revokeObjectURL = vi.fn(); });
  afterEach(() => { delete (globalThis as any).caches; });

  it('downloads once, then serves from the device cache and counts both honestly', async () => {
    installCaches(); const f = okFetch();
    const c = new BrowserAssetCache(f as any);
    await c.blob('/a.mp3'); await c.blob('/a.mp3'); await c.blob('/a.mp3');
    expect(f).toHaveBeenCalledTimes(1);
    expect(c.stats).toMatchObject({ requests: 1, cacheHits: 2, bytesDownloaded: 6, bytesFromCache: 12, failures: 0 });
  });
  it('a second cache instance (a page reload) reuses what the first stored', async () => {
    installCaches(); const f = okFetch();
    await new BrowserAssetCache(f as any).blob('/a.mp3');
    const again = new BrowserAssetCache(f as any); await again.blob('/a.mp3');
    expect(f).toHaveBeenCalledTimes(1); expect(again.stats.cacheHits).toBe(1);
  });
  it('re-reading a just-fetched file for playback is not counted as a cache hit', async () => {
    installCaches(); const f = okFetch();
    const c = new BrowserAssetCache(f as any);
    await c.fetchFile('/a.mp3'); await c.objectUrl('/a.mp3');
    expect(c.stats.cacheHits).toBe(0); expect(c.stats.requests).toBe(1);
  });
  it('works without Cache Storage (falls back to plain fetch)', async () => {
    delete (globalThis as any).caches; const f = okFetch();
    const c = new BrowserAssetCache(f as any); await c.blob('/a'); await c.blob('/a');
    expect(f).toHaveBeenCalledTimes(2); expect(c.stats.cacheHits).toBe(0);
  });
  it('records failures and does not cache an error response', async () => {
    const cache = installCaches();
    const f = vi.fn(async () => new Response('nope', { status: 404 }));
    const c = new BrowserAssetCache(f as any);
    await expect(c.blob('/missing')).rejects.toThrow(/404/);
    expect(c.stats.failures).toBe(1); expect(cache.m.size).toBe(0);
    const net = new BrowserAssetCache((async () => { throw new Error('offline'); }) as any);
    await expect(net.blob('/x')).rejects.toThrow('offline'); expect(net.stats.failures).toBe(1);
  });
  it('clear() empties the device cache', async () => {
    const cache = installCaches(); const c = new BrowserAssetCache(okFetch() as any);
    await c.blob('/a'); expect(cache.m.size).toBe(1); await c.clear(); expect(cache.m.size).toBe(0);
  });
  it('parses a package through the loader Backend', async () => {
    installCaches(); const c = new BrowserAssetCache((async () => new Response(JSON.stringify({ storyId: 's', pages: [] }))) as any);
    const r = await c.fetchPackage('/p.json'); expect(r.pkg.storyId).toBe('s'); expect(r.bytes).toBeGreaterThan(5);
  });
});
