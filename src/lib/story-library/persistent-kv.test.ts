import { describe, expect, it } from 'vitest';
import { PersistentKV } from './persistent-kv';
import { CatalogueClient } from './catalogue-client';
import { StaticCatalogueBackend } from './static-catalogue';

class FakeStorage {
  m = new Map<string, string>(); failWrites = false;
  get length() { return this.m.size; }
  key(i: number) { return [...this.m.keys()][i] ?? null; }
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { if (this.failWrites) throw new Error('QuotaExceededError'); this.m.set(k, v); }
  removeItem(k: string) { this.m.delete(k); }
}

describe('PersistentKV', () => {
  it('survives a reload (a new instance over the same storage)', () => {
    const st = new FakeStorage();
    const a = new PersistentKV('t', st); a.set('x', { n: 1 }); a.set('y', [1, 2]);
    const b = new PersistentKV('t', st);
    expect(b.get('x')).toEqual({ n: 1 }); expect(b.keys().sort()).toEqual(['x', 'y']);
    b.delete('x');
    expect(new PersistentKV('t', st).get('x')).toBeUndefined();
  });
  it('is namespaced and ignores a corrupt entry (and removes it)', () => {
    const st = new FakeStorage(); st.setItem('t:bad', '{not json'); st.setItem('other:z', '1');
    const kv = new PersistentKV('t', st);
    expect(kv.keys()).toEqual([]); expect(st.getItem('t:bad')).toBeNull(); expect(st.getItem('other:z')).toBe('1');
  });
  it('degrades to memory when storage is unavailable or full: browsing still works', () => {
    const none = new PersistentKV('t', null); none.set('a', 1); expect(none.get('a')).toBe(1); expect(none.persistent).toBe(false);
    const st = new FakeStorage(); st.failWrites = true;
    const full = new PersistentKV('t', st); full.set('a', 1);
    expect(full.get('a')).toBe(1); expect(full.persistent).toBe(false);
  });
  it('a corrupted cached page cannot break the catalogue client: it is just refetched', async () => {
    const st = new FakeStorage();
    const entries = [1, 2, 3].map((i) => ({ storyKey: `s-${i}`, version: 1, packageVersion: 1, status: 'published' as const, title: `S${i}`, ageTiers: ['5-6'], pageCount: 1, packagePath: '/p', packageHash: 'h', contentHash: 'c', publishedBy: 'x', updatedAt: 1 as unknown }));
    const backend = new StaticCatalogueBackend({ catalogueVersion: 1, entries });
    const c1 = new CatalogueClient(backend, new PersistentKV('t', st), { pageSize: 2, refresh: 'delta' });
    await c1.startSession(); expect((await c1.getPage(0)).length).toBe(2);
    const q = backend.counters.queries;
    // second visit, same version: served from the device, no query
    const c2 = new CatalogueClient(backend, new PersistentKV('t', st), { pageSize: 2, refresh: 'delta' });
    await c2.startSession(); expect((await c2.getPage(0)).length).toBe(2); expect(backend.counters.queries).toBe(q);
  });
  it('new catalogue version: removed (archived) stories disappear on the next session', async () => {
    const st = new FakeStorage();
    const mk = (i: number, status: 'published' | 'archived' = 'published', updatedAt = 1) => ({ storyKey: `s-${i}`, version: 1, packageVersion: 1, status, title: `S${i}`, ageTiers: ['5-6'], pageCount: 1, packagePath: '/p', packageHash: 'h', contentHash: 'c', publishedBy: 'x', updatedAt: updatedAt as unknown });
    const v1 = new StaticCatalogueBackend({ catalogueVersion: 1, entries: [mk(1), mk(2), mk(3)] });
    const c1 = new CatalogueClient(v1, new PersistentKV('t', st), { pageSize: 10, refresh: 'delta' });
    await c1.startSession(); await c1.getPage(0);
    const v2 = new StaticCatalogueBackend({ catalogueVersion: 2, entries: [mk(1), mk(2, 'archived', 2), mk(3)] });
    const c2 = new CatalogueClient(v2, new PersistentKV('t', st), { pageSize: 10, refresh: 'delta' });
    const s = await c2.startSession(); expect(s.changed).toBe(true);
    expect((await c2.getPage(0)).map((e) => e.storyKey)).toEqual(['s-1', 's-3']);
  });
});
