import { describe, expect, it } from 'vitest';
import { fits, isMissionStory, recommendReadNext, scoreEntry, type RecProfile } from './recommendations';
import type { CatalogueEntry } from './types';

let n = 0;
const E = (o: Partial<CatalogueEntry> & { storyKey: string }): CatalogueEntry =>
  ({ version: 1, packageVersion: 1, status: 'published', title: o.storyKey, ageTiers: [], pageCount: 6, packagePath: '', packageHash: '', contentHash: '', publishedBy: 't', sortKey: ++n, ...o }) as CatalogueEntry;

const animal = (k: string, extra: Partial<CatalogueEntry> = {}) => E({ storyKey: k, genres: ['animal'], themes: ['animals-and-habitats'], classIds: ['primary-2'], ageMin: 6, ageMax: 8, difficulty: 2, ...extra });
const profile = (p: Partial<RecProfile> = {}): RecProfile => ({ interests: ['animals'], ...p });

describe('fit comes first', () => {
  it('excludes stories outside the reader’s class or age however well they match', () => {
    const jhs = animal('jhs-animals', { classIds: ['jhs-1'], ageMin: 12, ageMax: 14 });
    expect(scoreEntry(jhs, profile({ classIds: ['primary-2'] }))).toBeNull();
    expect(scoreEntry(jhs, profile({ ageYears: 7 }))).toBeNull();
    expect(scoreEntry(animal('ok'), profile({ classIds: ['primary-2'], ageYears: 7 }))).not.toBeNull();
  });
  it('never excludes a story for missing class or age data, nor when the reader gave none', () => {
    expect(fits(E({ storyKey: 'x' }), { classIds: ['primary-2'], ageYears: 7 })).toBe(true);
    expect(fits(animal('a'), {})).toBe(true);
  });
  it('leaves out stories in the exclude set', () => {
    expect(scoreEntry(animal('seen'), profile({ excludeKeys: new Set(['seen']) }))).toBeNull();
  });
});

describe('scoring', () => {
  it('scores more for stories that match more of the reader’s interests (capped)', () => {
    const one = scoreEntry(animal('one'), profile())!;
    const two = scoreEntry(animal('two', { genres: ['animal', 'science'] }), profile({ interests: ['animals', 'science'] }))!;
    expect(two.score).toBeGreaterThan(one.score);
    expect(one.reasons).toContain('interest');
  });
  it('learns from finished and saved stories', () => {
    const hist = [E({ storyKey: 'h', genres: ['humour'], themes: ['school'] })];
    const liked = scoreEntry(E({ storyKey: 'l', genres: ['humour'], classIds: ['primary-2'] }), { interests: [], history: hist })!;
    expect(liked.reasons).toContain('like-your-reads');
    expect(liked.score).toBeGreaterThan(0);
  });
  it('nudges towards one step harder and away from far harder', () => {
    const fin = [E({ storyKey: 'f1', difficulty: 2 }), E({ storyKey: 'f2', difficulty: 2 })];
    const base = profile({ finished: fin });
    const same = scoreEntry(animal('same', { difficulty: 2 }), base)!.score;
    const next = scoreEntry(animal('next', { difficulty: 3 }), base)!.score;
    const far = scoreEntry(animal('far', { difficulty: 5 }), base)!.score;
    expect(next).toBeGreaterThan(same);
    expect(far).toBeLessThan(same);
  });
  it('lifts stories that match a teacher’s NaCCA focus', () => {
    const plain = animal('plain');
    const tagged = animal('tagged', { nacca: ['B4.2.2.1.1'] });
    const p = profile({ focusNacca: ['B4.2'] });
    expect(scoreEntry(tagged, p)!.score).toBeGreaterThan(scoreEntry(plain, p)!.score + 5);
    expect(scoreEntry(tagged, p)!.reasons).toContain('class-focus');
  });
  it('recognises the library’s mission stories', () => {
    expect(isMissionStory(E({ storyKey: 'a', genres: ['science'] }))).toBe(true);
    expect(isMissionStory(E({ storyKey: 'b', nacca: ['B1.2.2.1'] }))).toBe(true);
    expect(isMissionStory(E({ storyKey: 'c', genres: ['humour'] }))).toBe(false);
  });
});

describe('the Read next list', () => {
  it('is empty when there is nothing to personalise with', () => {
    expect(recommendReadNext([animal('a')], { interests: [] })).toEqual([]);
  });
  it('is ordered, limited, free of excluded stories and stable between calls', () => {
    const pool = Array.from({ length: 12 }, (_, i) => animal(`a${i}`, { genres: [i % 2 ? 'animal' : 'folktale'] }));
    const a = recommendReadNext(pool, profile({ excludeKeys: new Set(['a0']) }), { limit: 5 });
    const b = recommendReadNext(pool, profile({ excludeKeys: new Set(['a0']) }), { limit: 5 });
    expect(a).toHaveLength(5);
    expect(a.map((r) => r.entry.storyKey)).toEqual(b.map((r) => r.entry.storyKey));
    expect(a.some((r) => r.entry.storyKey === 'a0')).toBe(false);
    for (let i = 1; i < a.length; i++) expect(a[i - 1].score).toBeGreaterThanOrEqual(a[i].score);
  });
  it('keeps places for science and heritage stories even when interests point elsewhere', () => {
    const funny = Array.from({ length: 8 }, (_, i) => E({ storyKey: `f${i}`, genres: [`humour`, 'moral'].slice(0, 1), themes: ['school'], classIds: ['primary-2'] }));
    const sci = E({ storyKey: 'sci', genres: ['science'], classIds: ['primary-2'], nacca: ['B2.2.1.4.2'] });
    const got = recommendReadNext([...funny, sci], { interests: ['funny'], focusNacca: [] }, { limit: 4, maxPerGenre: 10 });
    expect(got.map((r) => r.entry.storyKey)).toContain('sci');
  });
  it('limits how many stories of one main genre appear', () => {
    const pool = Array.from({ length: 10 }, (_, i) => animal(`z${i}`));
    expect(recommendReadNext(pool, profile(), { limit: 6, maxPerGenre: 2 })).toHaveLength(2);
  });
  it('brings forward a focused standard to the top for a class even with no personal history', () => {
    const pool = [animal('plain'), animal('focus', { nacca: ['B4.3.2.1.1'], genres: ['science'], themes: [] })];
    const got = recommendReadNext(pool, { interests: [], focusNacca: ['B4.3'] });
    expect(got[0].entry.storyKey).toBe('focus');
  });
});
