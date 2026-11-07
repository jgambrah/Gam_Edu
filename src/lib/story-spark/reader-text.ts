import type { NormalizedStory } from './types';

export interface Word { text: string; start: number; end: number }
export interface ReaderPage { id: string; text: string; emoji?: string; imageUrl?: string }

/** Words with their character offsets in `text` (what speech "boundary" events report). */
export function tokenizeWords(text: string): Word[] {
  const out: Word[] = [];
  for (const m of text.matchAll(/\S+/g)) out.push({ text: m[0], start: m.index!, end: m.index! + m[0].length });
  return out;
}

/** Index of the word being spoken at `charIndex`; the next word if it falls in whitespace; -1 when past the end. */
export function wordIndexAtChar(words: Word[], charIndex: number): number {
  if (charIndex < 0) return -1;
  for (let i = 0; i < words.length; i++) {
    if (charIndex < words[i].end) return i; // inside this word, or in the gap just before it
  }
  return -1;
}

/** A word without surrounding punctuation, for speaking or looking up on its own. */
export function cleanWord(w: string): string {
  return w.replace(/^[^\p{L}\p{N}']+|[^\p{L}\p{N}']+$/gu, '');
}

export function splitSentences(text: string): string[] {
  return (text.match(/[^.!?\n]+[.!?]+["')\]]*|[^.!?\n]+$/g) || []).map((s) => s.trim()).filter(Boolean);
}

/**
 * Break one long block of text into book-sized pages (2–3 short sentences each, never splitting a sentence).
 * Old `content` stories are one block; this gives them real pages in the reader without touching stored data.
 */
export function paginateText(text: string, maxChars = 180): string[] {
  const paragraphs = text.split(/\n{1,}/).map((p) => p.trim()).filter(Boolean);
  const pages: string[] = [];
  for (const para of paragraphs) {
    let cur = '';
    for (const s of splitSentences(para)) {
      if (cur && (cur + ' ' + s).length > maxChars) { pages.push(cur); cur = s; }
      else cur = cur ? cur + ' ' + s : s;
    }
    if (cur) pages.push(cur);
  }
  return pages;
}

/** The pages the reader shows: real pages when the story has several, otherwise the text paginated. Never empty for a story with text. */
export function readerPages(story: NormalizedStory): ReaderPage[] {
  if (story.shape === 'pages' && story.pages.length > 1) return story.pages.map((p) => ({ ...p }));
  if (story.pages.length === 0) return [];
  const only = story.pages[0];
  const chunks = paginateText(only.text);
  if (chunks.length <= 1) return [{ ...only }];
  // The cover/emoji illustrate the first page; later pages fall back to the story emoji in the reader.
  return chunks.map((text, i) => ({ id: `${only.id}-${i + 1}`, text, ...(i === 0 && only.imageUrl ? { imageUrl: only.imageUrl } : {}), ...(only.emoji ? { emoji: only.emoji } : {}) }));
}

/**
 * When the browser can't report which word is being spoken (e.g. Chrome on Android), highlight by estimated time:
 * start time (ms) of each word at `wordsPerMinute`, with a slightly longer beat after sentence punctuation.
 */
export function estimateWordTimings(words: Word[], wordsPerMinute: number): number[] {
  const perWord = 60000 / Math.max(wordsPerMinute, 30);
  const starts: number[] = [];
  let t = 0;
  for (const w of words) {
    starts.push(Math.round(t));
    t += perWord * (1 + Math.min(w.text.length, 12) / 24); // longer words take longer
    if (/[.!?]["')\]]*$/.test(w.text)) t += perWord * 0.6;
    else if (/[,;:]$/.test(w.text)) t += perWord * 0.3;
  }
  return starts;
}
