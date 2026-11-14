// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { GHANAIAN_PRONUNCIATIONS as DICT } from './dictionary';
import { buildSpokenScript, pronunciationBlockers, splitToken, unknownProperNouns, usableForPublishedAudio, validateDictionary } from './apply';
import { buildPageUnits, buildStoryUnits, composePage, planRegeneration, replaceSentenceClip, reverificationNeeded, revalidatePage, stableHash, type Clip, type UnitConfig } from './regeneration';
import { tokenize } from '../premium';
import type { PronunciationDictionary } from './types';

const cfg: UnitConfig = { engine: 'browser', voice: 'v1', stylePrompt: '', dictionary: DICT, allowUnverifiedPronunciation: true };
const UNVERIFIED_DICT: PronunciationDictionary = {
  version: DICT.version,
  entries: DICT.entries.map((e) => ({ ...e, status: 'needs-native-review' as const })),
};

describe('dictionary', () => {
  it('is well formed and pre-verified: every entry is approved, has no invented IPA, and the core names are present', () => {
    expect(validateDictionary(DICT)).toEqual([]);
    expect(DICT.entries.every((e) => e.status === 'approved' && !e.ipa && usableForPublishedAudio(e))).toBe(true);
    for (const n of ['Efua', 'Kwame', 'Kofi', 'Akosua', 'Adwoa', 'Nhyira', 'Yaa']) expect(DICT.entries.some((e) => e.written === n)).toBe(true);
  });
  it('retains phonetic notes for hard clusters', () => {
    const risky = DICT.entries.filter((e) => e.reviewerNotes.some((n) => n.startsWith('HIGH RISK'))).map((e) => e.written);
    expect(risky).toEqual(expect.arrayContaining(['Adwoa', 'Nhyira']));
  });
  it('validation catches fabricated verification, invented IPA on unverified entries, and multi-token respellings', () => {
    const bad: PronunciationDictionary = { version: 1, entries: [
      { ...DICT.entries[0], id: 'a', written: 'A', status: 'native-speaker-verified' },
      { ...DICT.entries[0], id: 'b', written: 'B', status: 'needs-native-review', ipa: '/x/' },
      { ...DICT.entries[0], id: 'c', written: 'C', engines: { browser: { kind: 'respell', text: 'two words', candidate: false } } },
      { ...DICT.entries[0], id: 'd', written: 'D', engines: { 'cloud-tts': { kind: 'ssml-phoneme', ph: 'x' } } },
    ] };
    const p = validateDictionary(bad).join('|');
    expect(p).toMatch(/a: native-speaker-verified requires verifiedBy/);
    expect(p).toMatch(/b: IPA present on an unverified entry/);
    expect(p).toMatch(/c\/browser: respelling must be a single token/);
    expect(p).toMatch(/d\/cloud-tts: SSML phoneme requires verified IPA/);
  });
});

describe('spoken script', () => {
  const text = '‘Efua,’ said Kwame, ‘Yaa’s cakes cost twelve cedis.’ Kofi smiled.';
  it('keeps the written text untouched and the token count identical', () => {
    const s = buildSpokenScript(text, DICT, 'browser');
    expect(s.tokenCount).toBe(tokenize(text).length);
    expect(tokenize(s.spoken)).toHaveLength(tokenize(text).length);
    expect(s.spoken).not.toBe(text);
    expect(text).toContain('Efua');
  });
  it('preserves punctuation, quotes and possessives around a respelled name', () => {
    const s = buildSpokenScript(text, DICT, 'browser');
    expect(s.spoken).toContain('‘eh-foo-ah,’');
    expect(s.spoken).toContain('yaah’s');
    expect(s.spoken).toContain('see-deez.’');
    expect(s.unverified).toEqual([]);
  });
  it('splitToken separates punctuation and possessive', () => {
    expect(splitToken('‘Efua,’')).toEqual(['‘', 'Efua', ',’']);
    expect(splitToken('Yaa’s')).toEqual(['', 'Yaa', '’s']);
  });
  it('still blocks explicitly unverified (needs-native-review) entries unless allowUnverified is set', () => {
    const s = buildSpokenScript(text, UNVERIFIED_DICT, 'browser');
    expect(s.spoken).toBe(text);
    expect(s.unverified).toEqual(expect.arrayContaining(['efua', 'kwame', 'yaa', 'cedis', 'kofi']));
  });
  it('prompt-driven engines get hints, not altered text', () => {
    const s = buildSpokenScript(text, DICT, 'gemini-tts');
    expect(s.spoken).toBe(text);
    expect(s.promptHints.length).toBeGreaterThan(3);
    expect(s.promptHints[0]).toMatch(/Efua/);
  });
  it('an engine with no instruction falls back to the written word (cloud-tts has none until IPA is supplied)', () => {
    const s = buildSpokenScript(text, DICT, 'cloud-tts');
    expect(s.spoken).toBe(text);
    expect(s.ssmlPhonemes).toEqual([]);
  });
  it('verified entries ARE applied immediately, and SSML phonemes are surfaced when IPA is present', () => {
    const verified: PronunciationDictionary = { version: 2, entries: [{ ...DICT.entries[0], status: 'native-speaker-verified', ipa: '/x/', verifiedBy: { name: 'Reviewer', language: 'Twi', date: '2026-11-07' },
      engines: { browser: { kind: 'respell', text: 'eh-foo-ah', candidate: false }, 'cloud-tts': { kind: 'ssml-phoneme', ph: 'x' } } }] };
    expect(validateDictionary(verified)).toEqual([]);
    expect(buildSpokenScript('Efua ran.', verified, 'browser').spoken).toBe('eh-foo-ah ran.');
    expect(buildSpokenScript('Efua ran.', verified, 'cloud-tts').ssmlPhonemes).toEqual([{ tokenIndex: 0, written: 'Efua', ph: 'x' }]);
    expect(pronunciationBlockers(['Efua ran.'], verified)).toEqual([]);
  });
  it('approved dictionary has zero blockers; unverified entries report blockers once each', () => {
    expect(pronunciationBlockers(['Efua met Kwame.', 'Efua left.'], DICT)).toEqual([]);
    const b = pronunciationBlockers(['Efua met Kwame.', 'Efua left.'], UNVERIFIED_DICT);
    expect(b.map((x) => x.entryId).sort()).toEqual(['efua', 'kwame']);
  });
  it('finds proper nouns missing from the dictionary', () => {
    const found = unknownProperNouns(['She met Kwame and Quartey at Tema.'], DICT, new Set(['she']));
    expect(found).toEqual(['Quartey', 'Tema']);
  });
});

describe('regeneration planning', () => {
  const pages = ['Efua smiled. Kwame waved.', 'Kofi ran home.'];
  it('first run regenerates everything; a re-run regenerates nothing', () => {
    const units = buildStoryUnits(pages, cfg);
    expect(units.map((u) => u.id)).toEqual(['p1.s1', 'p1.s2', 'p2.s1']);
    expect(planRegeneration(null, units).regenerate).toHaveLength(3);
    const have = Object.fromEntries(units.map((u) => [u.id, u.key]));
    const again = planRegeneration(have, buildStoryUnits(pages, cfg));
    expect(again.regenerate).toEqual([]);
    expect(again.reuse).toHaveLength(3);
  });
  it('editing one sentence regenerates only that sentence', () => {
    const have = Object.fromEntries(buildStoryUnits(pages, cfg).map((u) => [u.id, u.key]));
    const plan = planRegeneration(have, buildStoryUnits(['Efua smiled. Kwame waved hello.', pages[1]], cfg));
    expect(plan.regenerate.map((u) => u.id)).toEqual(['p1.s2']);
    expect(plan.reasons['p1.s2']).toBe('changed');
  });
  it('changing a dictionary entry regenerates exactly the sentences containing that name', () => {
    const have = Object.fromEntries(buildStoryUnits(pages, cfg).map((u) => [u.id, u.key]));
    const changed: PronunciationDictionary = { version: 2, entries: DICT.entries.map((e) => (e.id === 'kwame' ? { ...e, engines: { ...e.engines, browser: { kind: 'respell' as const, text: 'kwah-mee', candidate: false } } } : e)) };
    const plan = planRegeneration(have, buildStoryUnits(pages, { ...cfg, dictionary: changed }));
    expect(plan.regenerate.length).toBe(3);
    const sameVersion: PronunciationDictionary = { ...changed, version: 1 };
    const plan2 = planRegeneration(have, buildStoryUnits(pages, { ...cfg, dictionary: sameVersion }));
    expect(plan2.regenerate.map((u) => u.id)).toEqual(['p1.s2']);
  });
  it('a different voice or style changes every key; an explicit page request regenerates that page only', () => {
    const base = buildStoryUnits(pages, cfg);
    const have = Object.fromEntries(base.map((u) => [u.id, u.key]));
    expect(planRegeneration(have, buildStoryUnits(pages, { ...cfg, voice: 'v2' })).regenerate).toHaveLength(3);
    const plan = planRegeneration(have, base, { pages: [2] });
    expect(plan.regenerate.map((u) => u.id)).toEqual(['p2.s1']);
    expect(plan.reasons['p2.s1']).toBe('requested');
    expect(planRegeneration(have, base, { units: ['p1.s1'] }).regenerate.map((u) => u.id)).toEqual(['p1.s1']);
  });
  it('stableHash is deterministic and sensitive', () => {
    expect(stableHash('a')).toBe(stableHash('a'));
    expect(stableHash('a')).not.toBe(stableHash('b'));
  });
  it('approved dictionary units carry an empty unverified-pronunciation list; unverified entries are tracked', () => {
    expect(buildPageUnits(1, 'Efua smiled.', cfg)[0].unverifiedPronunciation).toEqual([]);
    expect(buildPageUnits(1, 'Efua smiled.', { ...cfg, dictionary: UNVERIFIED_DICT })[0].unverifiedPronunciation).toEqual(['efua']);
  });
});

describe('composed timing and revalidation', () => {
  const text = 'Efua smiled. Kwame waved hello.';
  const clip = (words: Array<[number, number]>, dur: number, over: Partial<Clip> = {}): Clip => ({ key: 'k', durationMs: dur, words, method: 'tts-marks', verified: true, ...over });
  const c1 = clip([[0, 400], [450, 900]], 1000);
  const c2 = clip([[0, 300], [350, 700], [750, 1100]], 1200);

  it('composes sentence and word marks with a gap, and the page qualifies for word highlighting', () => {
    const a = composePage('h', text, [c1, c2], 300);
    expect(a.timing?.sentences).toEqual([[0, 1000], [1300, 2500]]);
    expect(a.timing?.words?.[2]).toEqual([1300, 1600]);
    expect(a.durationMs).toBe(2500);
    expect(revalidatePage(text, a).level).toBe('word');
  });
  it('regenerating one sentence shifts later marks and keeps verification only if the new clip is verified', () => {
    const first = composePage('h', text, [c1, c2], 300);
    const longer = clip([[0, 500], [550, 1200]], 1500);
    const r = replaceSentenceClip('h', text, [c1, c2], 0, longer, 300);
    expect(r.audio.timing?.sentences).toEqual([[0, 1500], [1800, 3000]]);
    expect(r.audio.timing?.words?.[2]).toEqual([1800, 2100]);
    expect(reverificationNeeded(first, r.audio, text)).toEqual({ needed: false, reason: 'verified word timing' });
  });
  it('a regenerated sentence from an engine with no word timing drops the page to sentence level and demands re-verification', () => {
    const first = composePage('h', text, [c1, c2], 300);
    const noWords: Clip = { key: 'k2', durationMs: 1400, method: 'estimated', verified: false };
    const r = replaceSentenceClip('h', text, [c1, c2], 1, noWords, 300);
    expect(r.audio.timing?.granularity).toBe('sentence');
    expect(r.audio.timing?.verified).toBe(false);
    const need = reverificationNeeded(first, r.audio, text);
    expect(need.needed).toBe(true);
    expect(need.reason).toMatch(/lost word-level highlighting/);
  });
  it('mixed timing methods compose to the weakest honest method; one unverified clip makes the page unverified', () => {
    const a = composePage('h', text, [c1, clip(c2.words!, 1200, { method: 'forced-alignment', verified: false })]);
    expect(a.timing?.method).toBe('tts-marks');
    expect(a.timing?.verified).toBe(false);
    expect(revalidatePage(text, a).level).toBe('sentence');
  });
  it('rejects a clip count that does not match the sentences', () => {
    expect(() => composePage('h', text, [c1])).toThrow();
    expect(() => replaceSentenceClip('h', text, [c1, c2], 5, c1)).toThrow();
  });
  it('word marks whose count does not match the sentence tokens are not trusted', () => {
    const bad = clip([[0, 400]], 1000);
    const a = composePage('h', text, [bad, c2]);
    expect(a.timing?.granularity).toBe('sentence');
  });
});
