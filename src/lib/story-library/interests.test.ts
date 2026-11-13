import { describe, expect, it } from 'vitest';
import { INTEREST_OPTIONS, interestsOf, loadInterests, saveInterests, toggleInterest } from './interests';

const mem = () => {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), key: (i: number) => [...m.keys()][i] ?? null, get length() { return m.size; }, clear: () => m.clear() } as Storage;
};

describe('interest options', () => {
  it('have unique ids and every option maps to at least one genre, theme or objective', () => {
    expect(new Set(INTEREST_OPTIONS.map((o) => o.id)).size).toBe(INTEREST_OPTIONS.length);
    for (const o of INTEREST_OPTIONS) expect((o.genres?.length ?? 0) + (o.themes?.length ?? 0) + (o.objectives?.length ?? 0)).toBeGreaterThan(0);
  });
  it('match a story by genre, theme or objective', () => {
    expect(interestsOf({ genres: ['animal'] })).toContain('animals');
    expect(interestsOf({ themes: ['money-and-enterprise'] })).toContain('money');
    expect(interestsOf({ objectives: ['financial-literacy'] })).toContain('money');
    expect(interestsOf({ categories: ['humour'] })).toContain('funny');
    expect(interestsOf({ genres: ['educational'] })).toEqual([]);
  });
});

describe('interest storage', () => {
  it('saves, reloads, toggles and drops unknown or duplicate ids', () => {
    const s = mem();
    expect(loadInterests(s, null)).toEqual([]);
    expect(saveInterests(['animals', 'animals', 'nope', 'science'], s, null)).toEqual(['animals', 'science']);
    expect(loadInterests(s, null)).toEqual(['animals', 'science']);
    expect(toggleInterest('animals', s, null)).toEqual(['science']);
    expect(toggleInterest('rhymes', s, null)).toEqual(['science', 'rhymes']);
  });
  it('keeps each signed-in user’s choices separate', () => {
    const s = mem();
    saveInterests(['animals'], s, 'u1');
    saveInterests(['science'], s, 'u2');
    expect(loadInterests(s, 'u1')).toEqual(['animals']);
    expect(loadInterests(s, 'u2')).toEqual(['science']);
    expect(loadInterests(s, null)).toEqual([]);
  });
  it('survives corrupt data and a missing or blocked storage', () => {
    const s = mem();
    s.setItem('story-spark-preview:interests', '{not json');
    expect(loadInterests(s, null)).toEqual([]);
    s.setItem('story-spark-preview:interests', '"text"');
    expect(loadInterests(s, null)).toEqual([]);
    expect(loadInterests(undefined, null)).toEqual([]);
    expect(saveInterests(['animals'], { setItem: () => { throw new Error('full'); } }, null)).toEqual(['animals']);
  });
});
