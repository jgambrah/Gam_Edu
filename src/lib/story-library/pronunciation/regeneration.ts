import { effectiveHighlight, splitSentences, tokenize, type AudioRef, type HighlightDecision, type TimingMethod, type TimingTrack } from '../premium';
import { buildSpokenScript } from './apply';
import type { EngineId, PronunciationDictionary } from './types';

/**
 * Regenerating narration for one sentence or one page, without redoing the rest, and without ever letting changed audio
 * keep timing that no longer matches it.
 *
 * MODEL
 *  - A page's narration is an ordered list of SENTENCE CLIPS joined by a fixed gap of silence.
 *  - Every clip has a cache key built from the exact spoken text, engine, voice, style prompt and dictionary version.
 *    Change a dictionary entry, a voice or a word, and exactly the clips whose key changes are regenerated.
 *  - Page timing is COMPOSED from the clips, so replacing one clip shifts later marks by the change in length.
 *  - A page's timing is `verified` only if EVERY clip's timing is verified. A regenerated clip arrives with whatever
 *    verification its generator can honestly claim (engine word events: yes, by construction; forced alignment or a
 *    sentence-only engine: no, until a person checks), so regeneration can never silently keep a "verified" label.
 */

export interface UnitConfig { engine: EngineId; voice: string; stylePrompt: string; dictionary: PronunciationDictionary; allowUnverifiedPronunciation?: boolean }

export interface AudioUnit {
  id: string;            // "p3.s2": page 3, sentence 2 (1-based)
  page: number;
  sentence: number;
  written: string;       // what the child reads
  spoken: string;        // what the engine is given (pronunciation applied, same token count as `written`)
  key: string;           // cache key
  promptHints: string[]; // for prompt-driven engines
  unverifiedPronunciation: string[];
}

/** Small, stable, non-cryptographic hash for cache keys (cyrb53). Collision risk is irrelevant at this scale; not for security. */
export function stableHash(s: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, '0');
}

export function buildPageUnits(page: number, text: string, cfg: UnitConfig): AudioUnit[] {
  return splitSentences(text).map((written, i) => {
    const s = buildSpokenScript(written, cfg.dictionary, cfg.engine, { allowUnverified: cfg.allowUnverifiedPronunciation });
    const key = stableHash(JSON.stringify([s.spoken, s.promptHints, cfg.engine, cfg.voice, cfg.stylePrompt, cfg.dictionary.version]));
    return { id: `p${page}.s${i + 1}`, page, sentence: i + 1, written, spoken: s.spoken, key, promptHints: s.promptHints, unverifiedPronunciation: s.unverified };
  });
}

export const buildStoryUnits = (pages: string[], cfg: UnitConfig): AudioUnit[] => pages.flatMap((t, i) => buildPageUnits(i + 1, t, cfg));

export interface RegenerationRequest { pages?: number[]; units?: string[]; all?: boolean }
export interface RegenerationPlan { regenerate: AudioUnit[]; reuse: AudioUnit[]; reasons: Record<string, 'new' | 'changed' | 'requested'> }

/**
 * Which units need new audio. `previous` maps unit id -> cache key of the audio you already have (null = nothing yet).
 * A unit is regenerated if it is new, if its key changed (text, voice, style or dictionary), or if explicitly requested.
 */
export function planRegeneration(previous: Record<string, string> | null, next: AudioUnit[], request: RegenerationRequest = {}): RegenerationPlan {
  const regenerate: AudioUnit[] = [], reuse: AudioUnit[] = [], reasons: RegenerationPlan['reasons'] = {};
  for (const u of next) {
    const asked = request.all || request.pages?.includes(u.page) || request.units?.includes(u.id);
    const had = previous?.[u.id];
    if (asked) { regenerate.push(u); reasons[u.id] = 'requested'; }
    else if (had === undefined) { regenerate.push(u); reasons[u.id] = 'new'; }
    else if (had !== u.key) { regenerate.push(u); reasons[u.id] = 'changed'; }
    else reuse.push(u);
  }
  return { regenerate, reuse, reasons };
}

// ------------------------------------------------------------------------------------------------ composing timing

export interface Clip {
  key: string;
  durationMs: number;
  /** Per-token marks relative to the START OF THIS CLIP, if the generator provides them. */
  words?: Array<[number, number]>;
  method: TimingMethod;
  verified: boolean;
}

const STRENGTH: Record<TimingMethod, number> = { estimated: 0, 'tts-marks': 1, 'forced-alignment': 2, manual: 3 };
export const DEFAULT_GAP_MS = 350;

/** Joins sentence clips into one page's AudioRef with composed timing. */
export function composePage(hash: string, text: string, clips: Clip[], gapMs = DEFAULT_GAP_MS): AudioRef {
  const sentences = splitSentences(text);
  if (clips.length !== sentences.length) throw new Error(`${clips.length} clips for ${sentences.length} sentences`);
  const sentenceMarks: Array<[number, number]> = [];
  const wordMarks: Array<[number, number]> = [];
  let at = 0;
  let haveWords = true;
  clips.forEach((c, i) => {
    sentenceMarks.push([at, at + c.durationMs]);
    const n = tokenize(sentences[i]).length;
    if (c.words && c.words.length === n) c.words.forEach(([s, e]) => wordMarks.push([at + s, at + e]));
    else haveWords = false;
    at += c.durationMs + (i < clips.length - 1 ? gapMs : 0);
  });
  const weakest = clips.reduce<TimingMethod>((m, c) => (STRENGTH[c.method] < STRENGTH[m] ? c.method : m), clips[0].method);
  const verified = clips.every((c) => c.verified) && weakest !== 'estimated';
  const timing: TimingTrack = haveWords
    ? { granularity: 'word', method: weakest, verified, sentences: sentenceMarks, words: wordMarks }
    : { granularity: 'sentence', method: weakest, verified, sentences: sentenceMarks };
  return { hash, durationMs: at, timing };
}

/** Replace one sentence's clip and recompose. Later marks shift; the replaced clip's own honesty decides `verified`. */
export function replaceSentenceClip(hash: string, text: string, clips: Clip[], sentenceIndex: number, replacement: Clip, gapMs = DEFAULT_GAP_MS): { audio: AudioRef; clips: Clip[] } {
  if (sentenceIndex < 0 || sentenceIndex >= clips.length) throw new Error('sentence index out of range');
  const next = clips.map((c, i) => (i === sentenceIndex ? replacement : c));
  return { audio: composePage(hash, text, next, gapMs), clips: next };
}

/** The same decision the reader and the readiness check make, so a regenerated page is judged exactly as it will be shown. */
export const revalidatePage = (text: string, audio: AudioRef): HighlightDecision => effectiveHighlight({ text, audio });

/** True when regeneration left a page that can no longer claim word-level highlighting, and what a reviewer must do. */
export function reverificationNeeded(before: AudioRef | undefined, after: AudioRef, text: string): { needed: boolean; reason: string } {
  const was = before ? effectiveHighlight({ text, audio: before }).level : 'none';
  const now = revalidatePage(text, after);
  if (now.level === 'word') return { needed: false, reason: 'verified word timing' };
  return { needed: true, reason: `${was === 'word' ? 'lost word-level highlighting: ' : ''}${now.reason}` };
}
