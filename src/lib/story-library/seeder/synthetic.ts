/**
 * Deterministic SYNTHETIC story corpus for seeding tests. No AI generation, no real content, no network.
 * Text is built from pseudo-words so unrelated stories share almost no 5-word shingles; duplicates are planted
 * on purpose so detection can be measured against known ground truth.
 */
import type { StoryInput } from './types';
import { CLASSIFICATION_VERSION, CLASS_REGISTRY, GENRES, OBJECTIVES, READING_LEVELS, THEMES, type Classification } from '../classification';

/** mulberry32 */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SYLL = ['ba', 'ko', 'mi', 'ra', 'tu', 'ne', 'so', 'li', 'pa', 'do', 'ze', 'fu', 'gi', 'ha', 'jo', 'ku', 'lo', 'mu', 'na', 'pi', 'qua', 'ri', 'sa', 'ti', 'vo', 'wa', 'xe', 'yo'];

function word(r: () => number): string {
  const n = 2 + Math.floor(r() * 3);
  let w = '';
  for (let i = 0; i < n; i++) w += SYLL[Math.floor(r() * SYLL.length)];
  return w;
}

function sentence(r: () => number): string {
  const n = 8 + Math.floor(r() * 5);
  const ws = Array.from({ length: n }, () => word(r));
  return ws[0][0].toUpperCase() + ws[0].slice(1) + ' ' + ws.slice(1).join(' ') + '.';
}

function bytes(r: () => number, n: number): Uint8Array {
  const b = new Uint8Array(n);
  for (let i = 0; i < n; i++) b[i] = Math.floor(r() * 256);
  return b;
}

export const SYNTHETIC_LICENCE = { source: 'synthetic-test-corpus', licenseId: 'CC0-1.0', attribution: 'Generated for tests' };
const AGE_TIERS = ['3-4', '5-6', '7-8', '9-10'];
const CATEGORIES = ['animals', 'family', 'adventure', 'school', 'nature', 'friendship'];

export interface CorpusOptions {
  /** Total stories including planted duplicates. */
  count: number;
  seed?: number;
  pages?: number;
  sentencesPerPage?: number;
  /** Fraction of the total that are exact copies (new key, identical text). */
  exactFraction?: number;
  /** Fraction of the total that are near copies (a few words changed). */
  nearFraction?: number;
  /** Bytes per synthetic image / audio file. */
  imageBytes?: number;
  audioBytes?: number;
}

export interface Corpus {
  stories: StoryInput[];
  planted: { exact: Array<{ key: string; of: string }>; near: Array<{ key: string; of: string }> };
  distinct: string[];
}

const keyOf = (i: number) => `syn-${String(i).padStart(5, '0')}`;

/** A valid classification derived deterministically from the story index (ages follow the class's typical ages). */
export function syntheticClassification(index: number): Classification {
  const cls = CLASS_REGISTRY[index % CLASS_REGISTRY.length];
  const next = CLASS_REGISTRY[(index + 1) % CLASS_REGISTRY.length];
  const classIds = index % 3 === 0 && next.order === cls.order + 1 ? [cls.id, next.id] : [cls.id];
  const ageMin = cls.typicalAge[0];
  const ageMax = classIds.length === 2 ? next.typicalAge[1] : cls.typicalAge[1];
  const level = READING_LEVELS[Math.min(READING_LEVELS.length - 1, Math.max(0, Math.floor((cls.order - 1) * 5 / CLASS_REGISTRY.length)))];
  return {
    schemaVersion: CLASSIFICATION_VERSION, language: 'en', classIds, ageMin, ageMax, readingLevel: level.id, difficulty: Math.min(5, 1 + (index % 4)),
    genres: [GENRES[index % GENRES.length].id], themes: [THEMES[index % THEMES.length].id],
    objectives: [OBJECTIVES[index % OBJECTIVES.length].id, OBJECTIVES[(index + 3) % OBJECTIVES.length].id],
    ghanaianContext: index % 2 === 0 ? 'incidental' : 'none', estimatedDurationSec: 120 + (index % 10) * 20,
  };
}

export function makeStory(index: number, o: Pick<CorpusOptions, 'seed' | 'pages' | 'sentencesPerPage' | 'imageBytes' | 'audioBytes'> = {}): StoryInput {
  const r = rng((o.seed ?? 1) * 1_000_003 + index * 7919);
  const pages = o.pages ?? 10;
  const sp = o.sentencesPerPage ?? 3;
  const shared = rng(424242);
  const closingImage = bytes(shared, o.imageBytes ?? 48); // identical in every story: content addressing stores it once
  return {
    synthetic: true,
    storyKey: keyOf(index),
    title: `${word(r)} ${word(r)} ${word(r)}`.replace(/^./, (c) => c.toUpperCase()),
    ageTiers: [AGE_TIERS[index % AGE_TIERS.length]],
    language: 'en',
    categories: [CATEGORIES[index % CATEGORIES.length]],
    objectives: [`objective-${index % 9}`],
    access: index % 5 === 0 ? 'licensed' : 'open',
    classification: syntheticClassification(index),
    licence: SYNTHETIC_LICENCE,
    pages: Array.from({ length: pages }, (_, p) => ({
      text: Array.from({ length: sp }, () => sentence(r)).join(' '),
      image: p === pages - 1 ? { bytes: closingImage, ext: 'webp' } : { bytes: bytes(r, o.imageBytes ?? 48), ext: 'webp' },
      audio: { bytes: bytes(r, o.audioBytes ?? 64), ext: 'opus', durationMs: 15000 },
    })),
  };
}

/** Copy of `s` under a new key, optionally changing `changes` words (spread across pages). */
export function cloneStory(s: StoryInput, newKey: string, changes = 0, r: () => number = rng(9)): StoryInput {
  const pages = s.pages.map((p) => ({ ...p }));
  for (let c = 0; c < changes; c++) {
    const pi = Math.floor((c + 0.5) * pages.length / Math.max(1, changes)) % pages.length;
    const ws = pages[pi].text.split(' ');
    ws[Math.floor(ws.length / 2)] = word(r) + 'x';
    pages[pi] = { ...pages[pi], text: ws.join(' ') };
  }
  return { ...s, storyKey: newKey, pages, title: changes ? s.title : s.title };
}

export function generateCorpus(o: CorpusOptions): Corpus {
  const exactN = Math.round(o.count * (o.exactFraction ?? 0.02));
  const nearN = Math.round(o.count * (o.nearFraction ?? 0.03));
  const distinctN = o.count - exactN - nearN;
  const stories: StoryInput[] = [];
  const distinct: string[] = [];
  for (let i = 1; i <= distinctN; i++) { const s = makeStory(i, o); stories.push(s); distinct.push(s.storyKey); }
  const r = rng((o.seed ?? 1) + 77);
  const planted: Corpus['planted'] = { exact: [], near: [] };
  let idx = distinctN + 1;
  // Sources are sampled WITHOUT replacement so every duplicate group has exactly two members (clear ground truth).
  const order = Array.from({ length: distinctN }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  let take = 0;
  for (let k = 0; k < exactN; k++) {
    const src = stories[order[take++]];
    const c = cloneStory(src, keyOf(idx++), 0);
    stories.push(c); planted.exact.push({ key: c.storyKey, of: src.storyKey });
  }
  for (let k = 0; k < nearN; k++) {
    const src = stories[order[take++]];
    const c = cloneStory(src, keyOf(idx++), 2, r);
    stories.push(c); planted.near.push({ key: c.storyKey, of: src.storyKey });
  }
  return { stories, planted, distinct };
}
