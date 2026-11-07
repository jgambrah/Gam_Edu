import { describe, it, expect } from 'vitest';
import { tokenizeWords, wordIndexAtChar, cleanWord, splitSentences, paginateText, readerPages, estimateWordTimings } from './reader-text';
import { normalizeStory } from './normalize';

describe('tokenizeWords / wordIndexAtChar', () => {
  const text = 'The fox ran.\nIt hid!';
  const words = tokenizeWords(text);
  it('gives each word its exact character range', () => {
    expect(words.map((w) => text.slice(w.start, w.end))).toEqual(['The', 'fox', 'ran.', 'It', 'hid!']);
  });
  it('maps a speech boundary position to the word being spoken', () => {
    expect(wordIndexAtChar(words, 0)).toBe(0);
    expect(wordIndexAtChar(words, 5)).toBe(1);
    expect(wordIndexAtChar(words, 13)).toBe(3);
    expect(wordIndexAtChar(words, 3)).toBe(1);   // whitespace → the next word
  });
  it('returns -1 past the end or for a negative index, and handles empty text', () => {
    expect(wordIndexAtChar(words, 999)).toBe(-1);
    expect(wordIndexAtChar(words, -1)).toBe(-1);
    expect(tokenizeWords('   ')).toEqual([]);
  });
});

describe('cleanWord', () => {
  it('strips punctuation but keeps apostrophes and letters from any language', () => {
    expect(cleanWord('"Hello,"')).toBe('Hello');
    expect(cleanWord("don't!")).toBe("don't");
    expect(cleanWord('Akwaaba…')).toBe('Akwaaba');
    expect(cleanWord('...')).toBe('');
  });
});

describe('pagination', () => {
  it('splits sentences', () => expect(splitSentences('One. Two! Three? Four')).toEqual(['One.', 'Two!', 'Three?', 'Four']));
  it('groups short sentences into pages without splitting any sentence', () => {
    const text = 'Ama had a goat. The goat was little. One day it ran away. Ama looked everywhere. She found it by the river.';
    const pages = paginateText(text, 60);
    expect(pages.length).toBeGreaterThan(1);
    expect(pages.join(' ')).toBe(text);
    pages.forEach((p) => expect(/[.!?]$/.test(p)).toBe(true));
  });
  it('keeps one very long sentence whole', () => {
    const s = 'word '.repeat(80).trim() + '.';
    expect(paginateText(s, 60)).toEqual([s]);
  });
  it('treats paragraphs as page boundaries', () => expect(paginateText('First part.\n\nSecond part.')).toEqual(['First part.', 'Second part.']));
});

describe('readerPages', () => {
  it('uses real pages as they are', () => {
    const story = normalizeStory({ title: 'T', pages: [{ text: 'A.', emoji: '🐶' }, { text: 'B.' }] });
    expect(readerPages(story).map((p) => p.text)).toEqual(['A.', 'B.']);
    expect(readerPages(story)[0].emoji).toBe('🐶');
  });
  it('turns a legacy one-block story into several book-sized pages (the cover stays on the story)', () => {
    const content = Array.from({ length: 12 }, (_, i) => `Sentence number ${i + 1} is here.`).join(' ');
    const story = normalizeStory({ title: 'T', content, imageUrl: 'https://x/c.png', emojiIcon: '🦊' });
    const pages = readerPages(story);
    expect(pages.length).toBeGreaterThanOrEqual(2);
    pages.forEach((p) => expect(p.text.length).toBeLessThanOrEqual(180));
    expect(pages.map((p) => p.text).join(' ')).toBe(content);
    expect(pages[0].imageUrl).toBeUndefined(); // cover is on the story, not copied into text pages
  });
  it('is empty for an empty story and a single page for a short one', () => {
    expect(readerPages(normalizeStory(null))).toEqual([]);
    expect(readerPages(normalizeStory({ content: 'Short.' }))).toHaveLength(1);
  });
});

describe('estimateWordTimings', () => {
  const words = tokenizeWords('Hello there, little fox. Run!');
  it('starts at 0 and is increasing', () => {
    const t = estimateWordTimings(words, 150);
    expect(t[0]).toBe(0);
    for (let i = 1; i < t.length; i++) expect(t[i]).toBeGreaterThan(t[i - 1]);
  });
  it('pauses a little longer after a sentence end than after a plain word', () => {
    const t = estimateWordTimings(tokenizeWords('aaa bbb. ccc ddd'), 150);
    expect(t[2] - t[1]).toBeGreaterThan(t[3] - t[2]); // after "bbb." vs after "ccc"
  });
  it('is slower at a lower speed', () => {
    expect(estimateWordTimings(words, 90).at(-1)!).toBeGreaterThan(estimateWordTimings(words, 180).at(-1)!);
  });
});
