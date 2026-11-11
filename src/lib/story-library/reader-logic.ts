/**
 * Pure logic behind the storybook reader (testable without a browser).
 *  - reading modes and their behaviour,
 *  - the flow of pages and activities,
 *  - what to highlight at a given media time (never more than the timing data truthfully supports),
 *  - glossary lookup for tap-a-word.
 */
import { activeIndex, effectiveHighlight, splitSentences, tokenize, type Activity, type GlossaryEntry, type HighlightLevel } from './premium';
import type { PackagePage, StoryPackage } from './types';
import type { ReadMode } from './lazy-loader';
import { lookupWordHelp, type WordHelpResult } from './word-help';

export { lookupWordHelp, type WordHelpResult };

export const READ_MODES: Array<{ id: ReadMode; label: string; blurb: string; autoplay: boolean; autoAdvance: boolean; narration: boolean }> = [
  { id: 'listen', label: 'Listen to Me', blurb: 'The story is read to you and the pages turn by themselves.', autoplay: true, autoAdvance: true, narration: true },
  { id: 'follow', label: 'Read With Me', blurb: 'Follow the highlighted words while the story is read. You turn the pages.', autoplay: true, autoAdvance: false, narration: true },
  { id: 'solo', label: 'Let Me Read', blurb: 'No narration. Read it yourself and tap any word for help.', autoplay: false, autoAdvance: false, narration: false },
];
export const modeInfo = (m: ReadMode) => READ_MODES.find((x) => x.id === m)!;

export type Step = { kind: 'page'; index: number } | { kind: 'activity'; activity: Activity };

/** Page, then the activities placed after it (in listed order); activities with no page go at the very end. */
export function buildFlow(pkg: Pick<StoryPackage, 'pages' | 'activities'>): Step[] {
  const steps: Step[] = [];
  const acts = pkg.activities ?? [];
  pkg.pages.forEach((p, index) => {
    steps.push({ kind: 'page', index });
    for (const a of acts) if (a.afterPage === p.n) steps.push({ kind: 'activity', activity: a });
  });
  for (const a of acts) if (a.afterPage === undefined || !pkg.pages.some((p) => p.n === a.afterPage)) steps.push({ kind: 'activity', activity: a });
  return steps;
}

export interface PageWords { tokens: string[]; sentenceOfToken: number[]; sentenceCount: number }


/** Token indexes after which an explicit newline (`\n`) occurs in verse/rhymes, without altering `tokenize()` indices. */
export function lineBreakAfterTokens(text: string): Set<number> {
  const lines = text.trim().split(/\r?\n/).map((l) => tokenize(l)).filter((t) => t.length > 0);
  const out = new Set<number>();
  let cursor = 0;
  for (let i = 0; i < lines.length - 1; i++) {
    cursor += lines[i].length;
    out.add(cursor - 1);
  }
  return out;
}

export function pageWords(page: Pick<PackagePage, 'text' | 'sentences'>): PageWords {
  const tokens = tokenize(page.text);
  const sentences = page.sentences ?? splitSentences(page.text);
  const sentenceOfToken: number[] = [];
  sentences.forEach((s, i) => { for (let k = 0; k < tokenize(s).length; k++) sentenceOfToken.push(i); });
  while (sentenceOfToken.length < tokens.length) sentenceOfToken.push(Math.max(0, sentences.length - 1));
  return { tokens, sentenceOfToken, sentenceCount: sentences.length };
}

export interface HighlightState { level: HighlightLevel; sentence: number; word: number }
export const NO_HIGHLIGHT: HighlightState = { level: 'none', sentence: -1, word: -1 };

/**
 * What to highlight at `ms` into this page's narration. `previous` keeps the last highlight through the tiny gaps
 * between marks so the display does not flicker; before the first mark nothing is highlighted.
 */
export function highlightAt(page: PackagePage, ms: number, previous: HighlightState = NO_HIGHLIGHT): HighlightState {
  const decision = effectiveHighlight(page);
  const t = page.audio?.timing;
  if (decision.level === 'none' || !t) return NO_HIGHLIGHT;
  const { sentenceOfToken } = pageWords(page);
  if (decision.level === 'word' && t.words) {
    const w = activeIndex(t.words, ms);
    if (w >= 0) return { level: 'word', word: w, sentence: sentenceOfToken[w] ?? -1 };
    return previous.level === 'word' ? previous : NO_HIGHLIGHT;
  }
  const s = activeIndex(t.sentences, ms);
  if (s >= 0) return { level: 'sentence', word: -1, sentence: s };
  return previous.level === 'sentence' ? previous : NO_HIGHLIGHT;
}

/** The honest one-line description of what the reader is showing, for the status line. */
export function syncDescription(page: PackagePage, mode: ReadMode): string {
  if (!modeInfo(mode).narration) return 'No narration in this mode.';
  const d = effectiveHighlight(page);
  if (d.level === 'word') return 'Word-by-word highlighting follows the narration.';
  if (d.level === 'sentence') return 'Sentence highlighting follows the narration. Word timing is not available for this page.';
  return 'Narration plays without highlighting: no usable timing for this page.';
}

const clean = (w: string) => w.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
export const cleanWord = clean;

/** Glossary entry for a tapped word on a page (the entry must list that page), else undefined. */
export function lookupWord(glossary: GlossaryEntry[] | undefined, pageNumber: number, token: string): GlossaryEntry | undefined {
  const w = clean(token);
  return glossary?.find((g) => g.word.toLowerCase() === w && g.pages.includes(pageNumber));
}

/** Score for a finished story: only activities that have a right answer count. Reflection activities never score. */
export function scoreResults(results: Array<{ type: Activity['type']; correct?: boolean }>) {
  const scored = results.filter((r) => r.correct !== undefined);
  return { answered: results.length, scored: scored.length, correct: scored.filter((r) => r.correct).length };
}
