/**
 * Premium story structures (Stage 3): narration timing with an HONEST sync level, interactive activities, vocabulary
 * glossary, background music, image alt text. Pure functions: no I/O, no Firebase, no clock.
 *
 * Everything here is story CONTENT shared by every school. It never holds learner data, school data or voice recordings.
 */

// ------------------------------------------------------------------------------------------------ narration timing

export type TimingMethod = 'manual' | 'forced-alignment' | 'tts-marks' | 'estimated';

/**
 * Timing for one page's narration, in MEDIA time (milliseconds into the audio file), so playback speed, pauses and
 * replays never change the mapping: the player converts its media clock to a unit, whatever the speed.
 */
export interface TimingTrack {
  granularity: 'sentence' | 'word';
  method: TimingMethod;
  /** A person (or a validated tool plus person) confirmed the marks match the audio. Never inferred. */
  verified: boolean;
  /** One [startMs, endMs] per entry of `page.sentences`. */
  sentences: Array<[number, number]>;
  /** One [startMs, endMs] per token of `tokenize(page.text)`. Only for granularity 'word'. */
  words?: Array<[number, number]>;
}

export interface AudioRef { hash: string; durationMs: number; timing?: TimingTrack }

/** The single, documented tokenisation used for word-level highlighting and tap-a-word. */
export function tokenize(text: string): string[] {
  const t = text.trim();
  return t ? t.split(/\s+/) : [];
}

/** Split text into sentences for sentence-level highlighting (conservative: ., !, ? followed by space). */
export function splitSentences(text: string): string[] {
  return text.trim().split(/(?<=[.!?])\s+/).filter(Boolean);
}

export interface PageTimingInput { text: string; sentences?: string[]; audio?: AudioRef }

const monotonic = (marks: Array<[number, number]>, duration: number): string | null => {
  let prevEnd = 0;
  for (let i = 0; i < marks.length; i++) {
    const m = marks[i];
    if (!Array.isArray(m) || m.length !== 2 || !m.every((x) => Number.isFinite(x))) return `mark ${i} is not [start,end]`;
    const [s, e] = m;
    if (s < 0 || e <= s) return `mark ${i} has start ${s}, end ${e}`;
    if (s < prevEnd) return `mark ${i} overlaps the previous one`;
    if (e > duration + 50) return `mark ${i} ends after the audio (${e} > ${duration})`; // 50 ms codec padding tolerance
    prevEnd = e;
  }
  return null;
};

export type HighlightLevel = 'word' | 'sentence' | 'none';
export interface HighlightDecision { level: HighlightLevel; reason: string }

/**
 * What the reader may truthfully show for a page. Word-level only when word timing exists, is VERIFIED, and is
 * structurally consistent with the text; otherwise sentence-level if that is valid; otherwise none (the reader then
 * shows the text un-highlighted and says nothing about synchronisation).
 */
export function effectiveHighlight(p: PageTimingInput): HighlightDecision {
  const a = p.audio;
  if (!a) return { level: 'none', reason: 'no narration' };
  const t = a.timing;
  if (!t) return { level: 'none', reason: 'no timing data' };
  const sentences = p.sentences ?? splitSentences(p.text);

  const sentenceProblem = !Array.isArray(t.sentences) ? 'no sentence marks'
    : t.sentences.length !== sentences.length ? `${t.sentences.length} sentence marks for ${sentences.length} sentences`
    : monotonic(t.sentences, a.durationMs);

  if (t.granularity === 'word') {
    const tokens = tokenize(p.text);
    const wordProblem = !t.verified ? 'word timing is not verified'
      : t.method === 'estimated' ? 'word timing is only estimated'
      : !Array.isArray(t.words) ? 'no word marks'
      : t.words.length !== tokens.length ? `${t.words.length} word marks for ${tokens.length} words`
      : monotonic(t.words, a.durationMs);
    if (!wordProblem && !sentenceProblem) return { level: 'word', reason: 'verified word timing' };
    if (!sentenceProblem) return { level: 'sentence', reason: `falling back to sentence level: ${wordProblem}` };
    return { level: 'none', reason: `${sentenceProblem}${wordProblem ? `; ${wordProblem}` : ''}` };
  }
  if (sentenceProblem) return { level: 'none', reason: sentenceProblem };
  // Estimated timing is allowed for gentle sentence-level display but is never presented as accurate.
  return { level: 'sentence', reason: t.verified ? 'verified sentence timing' : `sentence timing (${t.method}, unverified)` };
}

/** Index of the unit being spoken at `positionMs`, or -1 in a gap / before the start / after the end. */
export function activeIndex(marks: Array<[number, number]>, positionMs: number): number {
  let lo = 0, hi = marks.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const [s, e] = marks[mid];
    if (positionMs < s) hi = mid - 1;
    else if (positionMs >= e) lo = mid + 1;
    else return mid;
  }
  return -1;
}

/**
 * Fallback when no real timing exists: spread the narration over sentences in proportion to their length. It is
 * explicitly `estimated` and `verified: false`; it can drive gentle sentence-level display but never counts as accurate
 * sync and never satisfies the premium readiness checks.
 */
export function estimateSentenceTimings(sentences: string[], durationMs: number): TimingTrack {
  const weights = sentences.map((s) => Math.max(1, s.length));
  const total = weights.reduce((a, b) => a + b, 0);
  let t = 0;
  const marks = weights.map((w, i) => {
    const s = Math.round(t);
    t += (w / total) * durationMs;
    const e = i === weights.length - 1 ? durationMs : Math.round(t);
    return [s, Math.max(e, s + 1)] as [number, number];
  });
  return { granularity: 'sentence', method: 'estimated', verified: false, sentences: marks };
}

// ----------------------------------------------------------------------------------------------------- activities

export const ACTIVITY_TYPE_IDS = ['comprehension', 'vocabulary', 'phonics', 'sequencing', 'prediction', 'sel'] as const;
export type ActivityTypeId = (typeof ACTIVITY_TYPE_IDS)[number];

interface ActivityBase { id: string; type: ActivityTypeId; /** Shown after this page (1-based). Omit for end of story. */ afterPage?: number }
export interface ComprehensionActivity extends ActivityBase { type: 'comprehension'; question: string; options: string[]; correctIndex: number; explanation?: string }
export interface VocabularyActivity extends ActivityBase { type: 'vocabulary'; word: string; definition: string; distractors: string[] }
export interface PhonicsActivity extends ActivityBase { type: 'phonics'; targetSound: string; prompt: string; options: string[]; correctIndexes: number[] }
export interface SequencingActivity extends ActivityBase { type: 'sequencing'; prompt: string; /** In the CORRECT order; the app shuffles. */ items: string[] }
export interface PredictionActivity extends ActivityBase { type: 'prediction'; prompt: string; options?: string[] }
export interface SelActivity extends ActivityBase { type: 'sel'; prompt: string; feelingOptions?: string[] }
export type Activity = ComprehensionActivity | VocabularyActivity | PhonicsActivity | SequencingActivity | PredictionActivity | SelActivity;

export interface GlossaryEntry { word: string; definition: string; pages: number[]; /** Optional recorded pronunciation (an asset hash). */ audio?: string }
export interface MusicRef { hash: string; title: string; licenceId: string; defaultVolume: number; duckTo: number }

export interface PremiumIssue { path: string; message: string }

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (v: unknown, lo: number, hi: number) => typeof v === 'string' && v.trim().length >= lo && v.length <= hi;
const URLISH = /(https?:\/\/|www\.|@[a-z0-9-]+\.[a-z]{2,})/i;
const textOk = (v: unknown, lo: number, hi: number) => str(v, lo, hi) && !URLISH.test(v as string);

export function validateActivities(list: unknown, pageCount: number): PremiumIssue[] {
  const out: PremiumIssue[] = [];
  const bad = (path: string, message: string) => out.push({ path, message });
  if (!Array.isArray(list)) return [{ path: 'activities', message: 'must be a list' }];
  if (list.length > 30) bad('activities', 'at most 30 activities per story');
  const seen = new Set<string>();
  list.forEach((a: unknown, i: number) => {
    const at = `activities[${i}]`;
    if (!isObj(a)) return bad(at, 'must be an object');
    if (!(typeof a.id === 'string' && /^[a-z0-9-]{2,40}$/.test(a.id))) bad(`${at}.id`, 'lowercase slug 2-40');
    else if (seen.has(a.id)) bad(`${at}.id`, 'duplicate id'); else seen.add(a.id);
    if (!(ACTIVITY_TYPE_IDS as readonly unknown[]).includes(a.type)) return bad(`${at}.type`, 'unknown activity type');
    if (a.afterPage !== undefined && !(Number.isInteger(a.afterPage) && (a.afterPage as number) >= 1 && (a.afterPage as number) <= pageCount)) bad(`${at}.afterPage`, `1-${pageCount}`);
    const opts = (key: string, min: number, max: number, v: unknown) => {
      if (!Array.isArray(v) || v.length < min || v.length > max || !v.every((x) => textOk(x, 1, 80))) { bad(`${at}.${key}`, `${min}-${max} short text options`); return false; }
      if (new Set(v.map((x) => String(x).trim().toLowerCase())).size !== v.length) { bad(`${at}.${key}`, 'options must be distinct'); return false; }
      return true;
    };
    const allowed: Record<string, string[]> = {
      comprehension: ['id', 'type', 'afterPage', 'question', 'options', 'correctIndex', 'explanation'],
      vocabulary: ['id', 'type', 'afterPage', 'word', 'definition', 'distractors'],
      phonics: ['id', 'type', 'afterPage', 'targetSound', 'prompt', 'options', 'correctIndexes'],
      sequencing: ['id', 'type', 'afterPage', 'prompt', 'items'],
      prediction: ['id', 'type', 'afterPage', 'prompt', 'options'],
      sel: ['id', 'type', 'afterPage', 'prompt', 'feelingOptions'],
    };
    for (const k of Object.keys(a)) if (!allowed[a.type as string].includes(k)) bad(`${at}.${k}`, 'field not allowed for this activity type');
    switch (a.type) {
      case 'comprehension':
        if (!textOk(a.question, 3, 200)) bad(`${at}.question`, '3-200 characters');
        if (opts('options', 2, 4, a.options) && !(Number.isInteger(a.correctIndex) && (a.correctIndex as number) >= 0 && (a.correctIndex as number) < (a.options as unknown[]).length)) bad(`${at}.correctIndex`, 'must point at an option');
        if (a.explanation !== undefined && !textOk(a.explanation, 1, 200)) bad(`${at}.explanation`, '1-200 characters');
        break;
      case 'vocabulary':
        if (!textOk(a.word, 1, 40)) bad(`${at}.word`, '1-40 characters');
        if (!textOk(a.definition, 3, 160)) bad(`${at}.definition`, '3-160 characters');
        opts('distractors', 1, 3, a.distractors);
        break;
      case 'phonics':
        if (!textOk(a.targetSound, 1, 12)) bad(`${at}.targetSound`, '1-12 characters');
        if (!textOk(a.prompt, 3, 120)) bad(`${at}.prompt`, '3-120 characters');
        if (opts('options', 2, 6, a.options)) {
          const ci = a.correctIndexes;
          if (!Array.isArray(ci) || ci.length < 1 || !ci.every((x) => Number.isInteger(x) && x >= 0 && x < (a.options as unknown[]).length) || new Set(ci).size !== ci.length) bad(`${at}.correctIndexes`, 'distinct indexes of options');
        }
        break;
      case 'sequencing':
        if (!textOk(a.prompt, 3, 120)) bad(`${at}.prompt`, '3-120 characters');
        opts('items', 3, 6, a.items);
        break;
      case 'prediction':
        if (!textOk(a.prompt, 3, 160)) bad(`${at}.prompt`, '3-160 characters');
        if (a.options !== undefined) opts('options', 2, 4, a.options);
        break;
      case 'sel':
        if (!textOk(a.prompt, 3, 160)) bad(`${at}.prompt`, '3-160 characters');
        if (a.feelingOptions !== undefined) opts('feelingOptions', 2, 6, a.feelingOptions);
        break;
    }
  });
  return out;
}

export function validateGlossary(list: unknown, pageTexts: string[]): PremiumIssue[] {
  const out: PremiumIssue[] = [];
  const bad = (path: string, message: string) => out.push({ path, message });
  if (!Array.isArray(list)) return [{ path: 'glossary', message: 'must be a list' }];
  if (list.length > 40) bad('glossary', 'at most 40 words');
  const seen = new Set<string>();
  list.forEach((g: unknown, i: number) => {
    const at = `glossary[${i}]`;
    if (!isObj(g)) return bad(at, 'must be an object');
    for (const k of Object.keys(g)) if (!['word', 'definition', 'pages', 'audio'].includes(k)) bad(`${at}.${k}`, 'field not allowed');
    if (!textOk(g.word, 1, 40)) return bad(`${at}.word`, '1-40 characters');
    const key = (g.word as string).toLowerCase();
    if (seen.has(key)) bad(`${at}.word`, 'duplicate word'); else seen.add(key);
    if (!textOk(g.definition, 3, 160)) bad(`${at}.definition`, '3-160 characters (age-appropriate)');
    if (!Array.isArray(g.pages) || !g.pages.length || !g.pages.every((p) => Number.isInteger(p) && p >= 1 && p <= pageTexts.length)) return bad(`${at}.pages`, 'page numbers that exist');
    for (const p of g.pages as number[]) {
      const tokens = tokenize(pageTexts[p - 1]).map((t) => t.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''));
      if (!tokens.includes(key)) bad(`${at}.pages`, `"${g.word}" does not appear on page ${p}`);
    }
    if (g.audio !== undefined && !(typeof g.audio === 'string' && /^sha256:[0-9a-f]{64}$/.test(g.audio))) bad(`${at}.audio`, 'must be an asset hash');
  });
  return out;
}

export function validateMusic(m: unknown, assets: Record<string, unknown>): PremiumIssue[] {
  const out: PremiumIssue[] = [];
  const bad = (path: string, message: string) => out.push({ path, message });
  if (!isObj(m)) return [{ path: 'music', message: 'must be an object' }];
  for (const k of Object.keys(m)) if (!['hash', 'title', 'licenceId', 'defaultVolume', 'duckTo'].includes(k)) bad(`music.${k}`, 'field not allowed');
  if (!(typeof m.hash === 'string' && m.hash in assets)) bad('music.hash', 'not listed in assets');
  if (!textOk(m.title, 1, 80)) bad('music.title', '1-80 characters');
  if (!(typeof m.licenceId === 'string' && m.licenceId.trim())) bad('music.licenceId', 'a verified licence id is required');
  if (!(typeof m.defaultVolume === 'number' && m.defaultVolume >= 0 && m.defaultVolume <= 0.3)) bad('music.defaultVolume', 'gentle: 0 to 0.3');
  if (!(typeof m.duckTo === 'number' && m.duckTo >= 0 && m.duckTo <= 0.6)) bad('music.duckTo', 'duck factor 0 to 0.6 (music volume is multiplied by this while narration plays)');
  return out;
}

export const validAlt = (alt: unknown) => textOk(alt, 5, 200);

/**
 * Music volume. The learner's slider (0-1, default 1) scales the story's gentle default (<= 0.3), so music can never be
 * louder than the story allows; while narration plays it is multiplied by `duckTo` so the voice always leads.
 */
export function duckedVolume(userVolume: number, music: Pick<MusicRef, 'defaultVolume' | 'duckTo'>, narrating: boolean): number {
  const base = Math.min(1, Math.max(0, userVolume)) * music.defaultVolume;
  return narrating ? base * music.duckTo : base;
}
