// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { FilteredFeed, planQuery } from './dashboard-query';
import { CatalogueClient, MemoryKV } from './catalogue-client';
import { StaticCatalogueBackend } from './static-catalogue';
import type { CatalogueEntry } from './types';
import { CLASS_REGISTRY, GENRES, READING_LEVELS, CATALOGUE_QUERY_SHAPES } from './classification';

const entry = (i: number, over: Partial<CatalogueEntry> = {}): CatalogueEntry => ({
  storyKey: `s-${String(i).padStart(4, '0')}`, version: 1, packageVersion: 1, status: 'published', title: `Story ${i}`, ageTiers: ['5-6'], pageCount: 8,
  packagePath: '/p.json', packageHash: 'sha256:' + 'a'.repeat(64), contentHash: 'sha256:' + 'b'.repeat(64), publishedBy: 'x', updatedAt: 1 as unknown, sortKey: i,
  classIds: [CLASS_REGISTRY[i % 13].id], ageMin: CLASS_REGISTRY[i % 13].typicalAge[0], ageMax: CLASS_REGISTRY[i % 13].typicalAge[1] + 1,
  readingLevel: READING_LEVELS[i % 6].id, genres: [GENRES[i % GENRES.length].id], ...over,
});
const lib = (n: number) => Array.from({ length: n }, (_, i) => entry(i + 1));

describe('planQuery', () => {
  it('always yields one of the indexed query shapes', () => {
    const ids = new Set(CATALOGUE_QUERY_SHAPES.map((s) => s.id));
    for (const classId of [undefined, 'kg-1']) for (const genre of [undefined, 'animal']) for (const readingLevel of [undefined, 'early']) for (const ageYears of [undefined, 6]) {
      const p = planQuery({ classId, genre, readingLevel, ageYears });
      expect(ids.has(p.shapeId)).toBe(true);
    }
  });
  it('sends the most selective supported filter to the server and refines the rest locally', () => {
    expect(planQuery({ classId: 'kg-1', readingLevel: 'early' }).server).toEqual({ classId: 'kg-1', readingLevel: 'early' });
    expect(planQuery({ classId: 'kg-1', genre: 'animal' }).server).toEqual({ classId: 'kg-1' });
    expect(planQuery({ genre: 'animal' }).shapeId).toBe('by-genre');
    expect(planQuery({ ageYears: 7 }).server).toEqual({});
  });
  it('refinement is exact for the filters the server could not apply', () => {
    const p = planQuery({ classId: 'kg-1', genre: 'animal', ageYears: 5 });
    expect(p.refine(entry(1, { classIds: ['kg-1'], genres: ['animal'], ageMin: 4, ageMax: 6 }))).toBe(true);
    expect(p.refine(entry(1, { classIds: ['kg-1'], genres: ['folktale'], ageMin: 4, ageMax: 6 }))).toBe(false);
    expect(p.refine(entry(1, { classIds: ['kg-1'], genres: ['animal'], ageMin: 7, ageMax: 9 }))).toBe(false);
  });
});

describe('FilteredFeed', () => {
  const make = (entries: CatalogueEntry[]) => {
    const backend = new StaticCatalogueBackend({ catalogueVersion: 1, entries });
    const client = new CatalogueClient(backend, new MemoryKV(), { pageSize: 5, refresh: 'delta' });
    return { backend, client };
  };
  it('returns exactly the matching stories, filtering by class + genre + age across pages', async () => {
    const entries = lib(120);
    const { client } = make(entries);
    await client.startSession();
    const plan = planQuery({ classId: 'primary-1', genre: GENRES[4].id, ageYears: 7 });
    const feed = new FilteredFeed(client, plan, 5, 100);
    while (!feed.exhausted) await feed.loadMore(50);
    const truth = entries.filter((e) => (e.classIds ?? []).includes('primary-1') && (e.genres ?? []).includes(GENRES[4].id) && e.ageMin! <= 7 && 7 <= e.ageMax!);
    expect(feed.entries.map((e) => e.storyKey)).toEqual(truth.map((e) => e.storyKey));
  });
  it('does not read the whole library for a narrow filter, and caches pages per filter', async () => {
    const { backend, client } = make(lib(400));
    await client.startSession();
    const feed = new FilteredFeed(client, planQuery({ classId: 'jhs-3' }), 5, 5);
    await feed.loadMore(3);
    expect(backend.counters.entriesRead).toBeLessThan(40); // not 400
    const before = backend.counters.queries;
    const again = new FilteredFeed(client, planQuery({ classId: 'jhs-3' }), 5, 5);
    await again.loadMore(3);
    expect(backend.counters.queries).toBe(before); // second visit served from the device cache
  });
  it('reports an empty result cleanly', async () => {
    const { client } = make(lib(10).map((e) => ({ ...e, classIds: ['kg-1'] })));
    await client.startSession();
    const feed = new FilteredFeed(client, planQuery({ classId: 'jhs-2' }), 5, 5);
    expect(await feed.loadMore()).toEqual([]);
    expect(feed.exhausted).toBe(true);
  });
});
