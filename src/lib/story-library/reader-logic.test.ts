// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { buildFlow, highlightAt, lookupWord, modeInfo, NO_HIGHLIGHT, pageWords, READ_MODES, scoreResults, syncDescription } from './reader-logic';
import type { PackagePage } from './types';
import { PILOT_STORIES } from './pilot/pilot-stories';
import { textOnlyPackage } from './pilot/pilot-package';

const page = (over: Partial<PackagePage> = {}): PackagePage => ({
  n: 1, text: 'Ama had a goat. The goat was small.', sentences: ['Ama had a goat.', 'The goat was small.'],
  audio: { hash: 'sha256:' + 'a'.repeat(64), durationMs: 7000, timing: { granularity: 'word', method: 'tts-marks', verified: true,
    sentences: [[0, 3000], [3000, 7000]], words: [[0, 600], [600, 1200], [1200, 1800], [1800, 3000], [3000, 3800], [3800, 4600], [4600, 5600], [5600, 7000]] } }, ...over,
});

describe('reading modes', () => {
  it('has the three modes with the right narration behaviour', () => {
    expect(READ_MODES.map((m) => m.label)).toEqual(['Listen to Me', 'Read With Me', 'Let Me Read']);
    expect(modeInfo('listen')).toMatchObject({ narration: true, autoplay: true, autoAdvance: true });
    expect(modeInfo('follow')).toMatchObject({ narration: true, autoplay: true, autoAdvance: false });
    expect(modeInfo('solo')).toMatchObject({ narration: false, autoplay: false, autoAdvance: false });
  });
});

describe('flow', () => {
  it('places each activity right after its page, and unplaced activities at the end', () => {
    const pkg = textOnlyPackage(PILOT_STORIES[0]);
    const flow = buildFlow(pkg);
    expect(flow.filter((s) => s.kind === 'page')).toHaveLength(pkg.pages.length);
    expect(flow.filter((s) => s.kind === 'activity')).toHaveLength(pkg.activities!.length);
    flow.forEach((s, i) => { if (s.kind === 'activity') { const prev = flow.slice(0, i).reverse().find((x) => x.kind === 'page') as { index: number }; expect(pkg.pages[prev.index].n).toBe(s.activity.afterPage); } });
    const odd = buildFlow({ pages: pkg.pages, activities: [{ id: 'x-1', type: 'prediction', prompt: 'What next?' } as any, { id: 'x-2', type: 'prediction', afterPage: 99, prompt: 'What next?' } as any] });
    expect(odd.slice(-2).every((s) => s.kind === 'activity')).toBe(true);
  });
});

describe('highlight', () => {
  it('follows the verified word marks, including the sentence of each word', () => {
    expect(highlightAt(page(), 100)).toEqual({ level: 'word', word: 0, sentence: 0 });
    expect(highlightAt(page(), 3900)).toEqual({ level: 'word', word: 5, sentence: 1 });
    expect(highlightAt(page(), 6999)).toMatchObject({ word: 7, sentence: 1 });
  });
  it('is independent of playback speed because marks are media time', () => {
    // The same media position gives the same highlight whatever the speed; the player passes currentTime, not wall time.
    expect(highlightAt(page(), 1500)).toEqual(highlightAt(page(), 1500));
  });
  it('keeps the previous highlight through a gap and shows nothing before the first mark', () => {
    const gappy = page({ audio: { ...page().audio!, timing: { ...page().audio!.timing!, words: [[500, 900], [1000, 1400], [1500, 1800], [1900, 3000], [3000, 3800], [3800, 4600], [4600, 5600], [5600, 7000]] } } });
    expect(highlightAt(gappy, 100)).toEqual(NO_HIGHLIGHT);
    const a = highlightAt(gappy, 600);
    expect(highlightAt(gappy, 950, a)).toEqual(a);
  });
  it('never claims word sync when word timing is unverified: falls back to sentence level', () => {
    const p = page({ audio: { ...page().audio!, timing: { ...page().audio!.timing!, verified: false } } });
    expect(highlightAt(p, 3500)).toEqual({ level: 'sentence', word: -1, sentence: 1 });
    expect(syncDescription(p, 'follow')).toMatch(/Sentence highlighting/);
  });
  it('shows nothing, and says so, when there is no usable timing', () => {
    const p = page({ audio: { ...page().audio!, timing: undefined } });
    expect(highlightAt(p, 3500)).toEqual(NO_HIGHLIGHT);
    expect(syncDescription(p, 'listen')).toMatch(/without highlighting/);
    expect(highlightAt(page({ audio: undefined }), 100)).toEqual(NO_HIGHLIGHT);
    expect(syncDescription(page(), 'solo')).toBe('No narration in this mode.');
  });
  it('maps tokens to sentences', () => {
    const w = pageWords(page());
    expect(w.tokens).toHaveLength(8);
    expect(w.sentenceOfToken).toEqual([0, 0, 0, 0, 1, 1, 1, 1]);
  });
});

describe('tap a word', () => {
  const g = [{ word: 'goat', definition: 'An animal with horns.', pages: [1] }];
  it('finds a glossary word ignoring case and punctuation, only on its pages', () => {
    expect(lookupWord(g, 1, 'Goat.')?.definition).toMatch(/animal/);
    expect(lookupWord(g, 2, 'goat')).toBeUndefined();
    expect(lookupWord(g, 1, '‘Meh-eh-eh!’')).toBeUndefined();
    expect(lookupWord(undefined, 1, 'goat')).toBeUndefined();
  });
});

describe('scoring', () => {
  it('counts only activities that have a right answer', () => {
    expect(scoreResults([{ type: 'comprehension', correct: true }, { type: 'phonics', correct: false }, { type: 'sel' }, { type: 'prediction' }])).toEqual({ answered: 4, scored: 2, correct: 1 });
  });
});
