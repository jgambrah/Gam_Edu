// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  activeIndex, duckedVolume, effectiveHighlight, estimateSentenceTimings, splitSentences, tokenize, validateActivities, validateGlossary, validateMusic,
  type AudioRef, type TimingTrack,
} from './premium';
import { validateStoryPackage } from './validate';
import { makeSyntheticPackage } from './lazy-loader';

const TEXT = 'Ama ran to the river. She saw a little goat! Where was it going?';
const SENTENCES = splitSentences(TEXT);
const WORDS = tokenize(TEXT);
const H = 'sha256:' + 'a'.repeat(64);
const sentenceMarks = (): Array<[number, number]> => [[0, 2000], [2200, 4500], [4700, 6500]];
const wordMarks = (): Array<[number, number]> => WORDS.map((_, i) => [i * 400, i * 400 + 380] as [number, number]);
const audio = (timing?: Partial<TimingTrack>, durationMs = 6500): AudioRef => ({
  hash: H, durationMs, ...(timing ? { timing: { granularity: 'sentence', method: 'manual', verified: true, sentences: sentenceMarks(), ...timing } as TimingTrack } : {}),
});
const decide = (a?: AudioRef) => effectiveHighlight({ text: TEXT, sentences: SENTENCES, audio: a });

describe('text units', () => {
  it('splits sentences and words deterministically', () => {
    expect(SENTENCES).toEqual(['Ama ran to the river.', 'She saw a little goat!', 'Where was it going?']);
    expect(WORDS.length).toBe(14);
    expect(tokenize('  ')).toEqual([]);
  });
});

describe('effectiveHighlight: never claims more sync than the data supports', () => {
  it('no narration → none; narration without timing → none', () => {
    expect(decide(undefined).level).toBe('none');
    expect(decide(audio()).level).toBe('none');
  });
  it('verified word timing that matches the text → word', () => {
    expect(decide(audio({ granularity: 'word', words: wordMarks(), method: 'forced-alignment' })).level).toBe('word');
  });
  it.each([
    ['word timing not verified', { granularity: 'word', words: wordMarks(), verified: false }],
    ['word timing only estimated', { granularity: 'word', words: wordMarks(), method: 'estimated' }],
    ['word marks missing', { granularity: 'word' }],
    ['wrong number of word marks', { granularity: 'word', words: wordMarks().slice(1) }],
    ['overlapping word marks', { granularity: 'word', words: wordMarks().map(([s, e], i) => (i === 3 ? [s - 300, e] : [s, e])) }],
    ['a word ends after the audio', { granularity: 'word', words: wordMarks().map(([s, e], i) => (i === 13 ? [s, e + 9000] : [s, e])) }],
  ])('falls back to sentence level when %s', (_n, t) => {
    const d = decide(audio(t as Partial<TimingTrack>));
    expect(d.level).toBe('sentence');
    expect(d.reason).toMatch(/falling back/);
  });
  it('estimated or unverified sentence timing is shown at sentence level but never described as verified', () => {
    const e = estimateSentenceTimings(SENTENCES, 6500);
    const d = decide({ hash: H, durationMs: 6500, timing: e });
    expect(d.level).toBe('sentence');
    expect(d.reason).toMatch(/unverified/);
  });
  it.each([
    ['wrong sentence count', { sentences: sentenceMarks().slice(1) }],
    ['end before start', { sentences: [[0, 2000], [4500, 2200], [4700, 6500]] }],
    ['overlap', { sentences: [[0, 2000], [1000, 4500], [4700, 6500]] }],
    ['past the end', { sentences: [[0, 2000], [2200, 4500], [4700, 9999]] }],
    ['NaN', { sentences: [[0, 2000], [2200, NaN], [4700, 6500]] }],
  ])('invalid sentence marks (%s) → none, with no claim of sync', (_n, t) => {
    expect(decide(audio(t as Partial<TimingTrack>)).level).toBe('none');
  });
  it('tolerates codec padding (50 ms) at the end', () => {
    expect(decide(audio({ sentences: [[0, 2000], [2200, 4500], [4700, 6540]] })).level).toBe('sentence');
  });
});

describe('activeIndex: media-time mapping (speed, pause, seek and replay never change it)', () => {
  const m = sentenceMarks();
  it.each([[0, 0], [1999, 0], [2000, -1], [2100, -1], [2200, 1], [4499, 1], [4600, -1], [4700, 2], [6499, 2], [6500, -1], [-5, -1], [99999, -1]])(
    'position %i ms → unit %i', (pos, expected) => expect(activeIndex(m, pos)).toBe(expected));
  it('the same media position gives the same unit however the clock got there (seek back, replay)', () => {
    const path = [0, 3000, 5000, 1000, 3000, 0, 5000];
    const seen = path.map((p) => activeIndex(m, p));
    expect(seen).toEqual([0, 1, 2, 0, 1, 0, 2]);
  });
  it('word marks find the right word', () => {
    const w = wordMarks();
    expect(activeIndex(w, 5 * 400 + 10)).toBe(5);
    expect(activeIndex(w, 5 * 400 + 390)).toBe(-1); // inside the 20 ms gap
  });
});

describe('estimateSentenceTimings (fallback only)', () => {
  it('covers the whole narration in order, in proportion to length, flagged estimated and unverified', () => {
    const t = estimateSentenceTimings(SENTENCES, 6500);
    expect(t.method).toBe('estimated');
    expect(t.verified).toBe(false);
    expect(t.sentences[0][0]).toBe(0);
    expect(t.sentences[t.sentences.length - 1][1]).toBe(6500);
    for (let i = 1; i < t.sentences.length; i++) expect(t.sentences[i][0]).toBeGreaterThanOrEqual(t.sentences[i - 1][1]);
    expect(t.sentences[1][1] - t.sentences[1][0]).toBeGreaterThan(t.sentences[0][1] - t.sentences[0][0] - 1000);
  });
});

describe('activities', () => {
  const comp = (o: Record<string, unknown> = {}) => ({ id: 'c1', type: 'comprehension', afterPage: 2, question: 'Where did Ama go?', options: ['The river', 'The school'], correctIndex: 0, ...o });
  const paths = (a: unknown, pages = 10) => validateActivities(a, pages).map((i) => i.path);
  it('accepts one good activity of every type', () => {
    const all = [
      comp(),
      { id: 'v1', type: 'vocabulary', word: 'river', definition: 'A big stream of water', distractors: ['A tall hill'] },
      { id: 'p1', type: 'phonics', targetSound: 'g', prompt: 'Tap the words that start with g', options: ['goat', 'garden', 'river'], correctIndexes: [0, 1] },
      { id: 's1', type: 'sequencing', prompt: 'Put the story in order', items: ['Ama woke up', 'Ama saw the goat', 'Ama found it'] },
      { id: 'pr1', type: 'prediction', afterPage: 3, prompt: 'What will Ama do next?', options: ['Ask for help', 'Go home'] },
      { id: 'e1', type: 'sel', prompt: 'How did Ama feel?', feelingOptions: ['worried', 'happy'] },
    ];
    expect(validateActivities(all, 10)).toEqual([]);
  });
  it.each([
    ['correctIndex out of range', comp({ correctIndex: 5 }), 'activities[0].correctIndex'],
    ['one option only', comp({ options: ['x'] }), 'activities[0].options'],
    ['duplicate options', comp({ options: ['Yes', 'yes'] }), 'activities[0].options'],
    ['afterPage beyond story', comp({ afterPage: 11 }), 'activities[0].afterPage'],
    ['link in text', comp({ question: 'Visit www.example.com now' }), 'activities[0].question'],
    ['unknown field', comp({ score: 10 }), 'activities[0].score'],
    ['bad id', comp({ id: 'Bad Id!' }), 'activities[0].id'],
  ])('rejects %s', (_n, a, path) => expect(paths([a])).toContain(path));
  it('rejects duplicate ids, unknown types and non-lists', () => {
    expect(paths([comp(), comp()])).toContain('activities[1].id');
    expect(paths([{ id: 'x1', type: 'quiz' }])).toContain('activities[0].type');
    expect(paths('nope')).toContain('activities');
  });
  it('a phonics activity needs distinct valid answer indexes', () => {
    const p = (ci: number[]) => ({ id: 'p1', type: 'phonics', targetSound: 'g', prompt: 'Tap the g words', options: ['goat', 'river'], correctIndexes: ci });
    expect(paths([p([])])).toContain('activities[0].correctIndexes');
    expect(paths([p([0, 0])])).toContain('activities[0].correctIndexes');
    expect(paths([p([3])])).toContain('activities[0].correctIndexes');
  });
});

describe('glossary and music', () => {
  const pages = ['Ama saw a little goat by the river.', 'The goat was lost.'];
  it('a glossary word must appear on the pages it names', () => {
    expect(validateGlossary([{ word: 'river', definition: 'A big stream of water', pages: [1] }], pages)).toEqual([]);
    expect(validateGlossary([{ word: 'river', definition: 'A big stream of water', pages: [2] }], pages).length).toBe(1);
    expect(validateGlossary([{ word: 'goat', definition: 'An animal', pages: [1, 2] }, { word: 'GOAT', definition: 'An animal', pages: [1] }], pages).some((i) => /duplicate/.test(i.message))).toBe(true);
    expect(validateGlossary([{ word: 'goat', definition: 'x', pages: [1] }], pages).length).toBe(1);
  });
  it('music must be gentle, licensed, and a known asset', () => {
    const assets = { [H]: {} };
    const ok = { hash: H, title: 'Soft kalimba', licenceId: 'CC0-1.0', defaultVolume: 0.2, duckTo: 0.3 };
    expect(validateMusic(ok, assets)).toEqual([]);
    expect(validateMusic({ ...ok, defaultVolume: 0.9 }, assets).length).toBe(1);
    expect(validateMusic({ ...ok, licenceId: '' }, assets).length).toBe(1);
    expect(validateMusic({ ...ok, hash: 'sha256:' + 'b'.repeat(64) }, assets).length).toBe(1);
    expect(validateMusic({ ...ok, duckTo: 0.9 }, assets).length).toBe(1);
  });
  it('ducking lowers music under narration, the slider scales it, and it never exceeds the story default', () => {
    const m = { defaultVolume: 0.2, duckTo: 0.25 };
    expect(duckedVolume(1, m, false)).toBeCloseTo(0.2);
    expect(duckedVolume(1, m, true)).toBeCloseTo(0.05);
    expect(duckedVolume(0.5, m, false)).toBeCloseTo(0.1);
    expect(duckedVolume(0, m, false)).toBe(0);
    expect(duckedVolume(5, m, false)).toBeCloseTo(0.2);
    expect(duckedVolume(-1, m, true)).toBe(0);
  });
});

describe('package validation includes the premium structures', () => {
  it('a package carrying valid activities, glossary, alt text and timing passes; bad ones are reported with paths', () => {
    const { pkg } = makeSyntheticPackage({ pages: 3, imageBytes: 10, audioBytes: 10, packageBytes: 10 });
    const good = { ...pkg, pages: pkg.pages.map((p) => ({ ...p, text: 'Ama saw the river today.', alt: 'A girl by a river' })),
      activities: [{ id: 'c1', type: 'comprehension', question: 'Who saw the river?', options: ['Ama', 'Kofi'], correctIndex: 0 }],
      glossary: [{ word: 'river', definition: 'A big stream of water', pages: [1] }] };
    expect(validateStoryPackage(good)).toEqual([]);
    const bad = { ...good, activities: [{ id: 'c1', type: 'comprehension', question: 'Q?', options: ['A'], correctIndex: 9 }], glossary: [{ word: 'zebra', definition: 'An animal', pages: [1] }],
      pages: good.pages.map((p, i) => (i === 0 ? { ...p, alt: 'x' } : p)) };
    const paths = validateStoryPackage(bad).map((i) => i.path);
    expect(paths).toEqual(expect.arrayContaining(['pages[0].alt', 'activities[0].options', 'glossary[0].pages']));
  });
});
