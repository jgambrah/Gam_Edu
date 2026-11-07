// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { CatalogueClient, MemoryKV, SimulatedCatalogue, loadWholeCatalogue } from './catalogue-client';
import { rng } from './seeder/synthetic';

const client = (cat: SimulatedCatalogue, refresh: 'refetch' | 'delta' = 'delta', kv = new MemoryKV()) => ({ kv, c: new CatalogueClient(cat, kv, { pageSize: 20, refresh }) });

async function walk(c: CatalogueClient, filter = 'all') {
  const out: string[] = [];
  for (let i = 0; i < 1000; i++) { const p = await c.getPage(i, filter); if (!p.length) break; out.push(...p.map((e) => e.storyKey)); if (p.length < 20) break; }
  return out;
}

describe('page size is capped at 50', () => {
  it('the client refuses a larger page and so does the (simulated) rules-enforced backend', async () => {
    const cat = new SimulatedCatalogue(10);
    expect(() => new CatalogueClient(cat, new MemoryKV(), { pageSize: 51, refresh: 'delta' })).toThrow();
    await expect(cat.listPage({ limit: 51 })).rejects.toThrow(/50/);
  });
});

describe('cursor pagination', () => {
  it.each([0, 1, 19, 20, 21, 137, 400])('walking every page of a %i-story catalogue returns each story exactly once, in order', async (n) => {
    const cat = new SimulatedCatalogue(n);
    const { c } = client(cat);
    await c.startSession();
    const ids = await walk(c);
    expect(ids).toEqual(cat.truth().map((e) => e.storyKey));
    expect(new Set(ids).size).toBe(n);
  });
  it('an age filter returns only that tier, matching the server', async () => {
    const cat = new SimulatedCatalogue(300);
    const { c } = client(cat);
    await c.startSession();
    expect(await walk(c, '5-6')).toEqual(cat.truth('5-6').map((e) => e.storyKey));
  });
});

describe('what a learner session reads', () => {
  const browse = async (c: CatalogueClient) => { await c.startSession(); for (let p = 0; p < 3; p++) await c.getPage(p, '5-6'); };

  it('first session: 1 meta read + only the pages browsed; the size of the library does not matter', async () => {
    const reads: Record<number, number> = {};
    for (const n of [400, 1000, 10_000, 100_000]) {
      const cat = new SimulatedCatalogue(n);
      await browse(client(cat).c);
      reads[n] = cat.counters.reads;
    }
    expect(reads[400]).toBe(1 + 3 * 20);
    expect(new Set(Object.values(reads)).size).toBe(1);
  });

  it('the naive client (whole catalogue) grows in proportion to the library', async () => {
    const r: Record<number, number> = {};
    for (const n of [100, 1000, 10_000]) { const cat = new SimulatedCatalogue(n); await loadWholeCatalogue(cat); r[n] = cat.counters.reads; }
    expect(r[1000] / r[100]).toBeGreaterThan(9);
    expect(r[10_000] / r[1000]).toBeGreaterThan(9);
  });

  it('repeat session with an unchanged catalogue: exactly ONE read (library_meta), zero page queries', async () => {
    const cat = new SimulatedCatalogue(1000);
    const { c } = client(cat);
    await browse(c);
    cat.reset();
    await browse(c);
    expect(cat.counters.reads).toBe(1);
    expect(cat.counters.queries).toBe(1);
  });

  it('a new device sharing the same cache (a shared tablet) pays nothing for the second learner', async () => {
    const cat = new SimulatedCatalogue(1000);
    const kv = new MemoryKV();
    await browse(client(cat, 'delta', kv).c);
    cat.reset();
    await browse(client(cat, 'delta', kv).c);
    expect(cat.counters.reads).toBe(1);
  });

  it("catalogue changed: 'refetch' re-reads the browsed pages, 'delta' reads only the changes", async () => {
    const run = async (mode: 'refetch' | 'delta') => {
      const cat = new SimulatedCatalogue(1000);
      const { c } = client(cat, mode);
      await browse(c);
      cat.publishBatch({ add: [1000, 1001], update: ['story-000005'] });
      cat.reset();
      await browse(c);
      return cat.counters.reads;
    };
    const refetch = await run('refetch');
    const delta = await run('delta');
    expect(refetch).toBeGreaterThanOrEqual(1 + 3 * 20 - 5);
    expect(delta).toBeLessThanOrEqual(1 + 3 + 3 * 20); // meta + the 3 changed docs (+ pages only if invalidated)
    expect(delta).toBeLessThan(refetch);
  });
});

describe('delta refresh stays correct', () => {
  it.each(['append', 'random'] as const)('after random publishes, updates and archives (%s inserts) the cached pages equal the server', async (mode) => {
    for (let seed = 1; seed <= 12; seed++) {
      const r = rng(seed);
      const cat = new SimulatedCatalogue(200, 3, mode);
      const { c } = client(cat, 'delta');
      await c.startSession();
      await walk(c); // cache everything
      let next = 200;
      for (let round = 0; round < 6; round++) {
        const add = Array.from({ length: Math.floor(r() * 4) }, () => next++);
        const pool = cat.truth();
        const update = pool.length ? [pool[Math.floor(r() * pool.length)].storyKey] : [];
        const archive = r() < 0.5 && pool.length ? [pool[Math.floor(r() * pool.length)].storyKey] : [];
        cat.publishBatch({ add, update, archive });
        await c.startSession();
        const got = (await walkEntries(c)).map((e) => `${e.storyKey}:${e.version}`);
        expect(got, `seed ${seed} round ${round}`).toEqual(cat.truth().map((e) => `${e.storyKey}:${e.version}`));
      }
    }
  });
});

async function walkEntries(c: CatalogueClient) {
  const out = [];
  for (let i = 0; i < 1000; i++) { const p = await c.getPage(i, 'all'); out.push(...p); if (p.length < 20) break; }
  return out;
}
