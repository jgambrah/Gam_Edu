import { describe, it, expect } from 'vitest';
import { normalizeStory } from './normalize';

// The built-in toddler story exactly as it is defined in the Story Spark component.
const TODDLER_STORY = {
  title: 'The Happy Little Puppy 🐶',
  pages: [
    { text: 'Once upon a time, a happy little puppy ran in the green grass. Woof woof!', emoji: '🐶' },
    { text: 'The puppy found a bright red ball and rolled it with his nose. Wheee!', emoji: '⚽' },
    { text: 'After playing all day, the tired puppy went to sleep under the warm sun. Goodnight puppy!', emoji: '😴' },
  ],
};

// A saved library story as the AI generator + handleSave produce it.
const LEGACY_SAVED_STORY = {
  id: 'abc123',
  title: 'The Dragon Who Loved Cupcakes',
  emojiIcon: '🐉',
  content: 'Dax the dragon loved cupcakes.\nEvery day he baked one.\n\nThen he shared them.',
  imageUrl: 'https://example.com/cover.png',
  questions: [
    { question: 'What did Dax love?', answer: 'cupcakes' },
    { question: 'What did Dax do every day?', answer: 'baked' },
    { question: 'What did he do with them?', answer: 'shared' },
  ],
  topic: 'dragons',
  schoolId: 's1',
  createdBy: 'u1',
};

describe('normalizeStory — pages stories (previously rendered blank)', () => {
  it('reads the built-in toddler story: text is present and nothing throws', () => {
    const s = normalizeStory(TODDLER_STORY);
    expect(s.shape).toBe('pages');
    expect(s.pages).toHaveLength(3);
    expect(s.fullText).toContain('happy little puppy');
    expect(s.fullText).toContain('Goodnight puppy!');
    expect(s.fullText.split('\n')).toHaveLength(3);
  });

  it('keeps per-page emoji and ids', () => {
    const s = normalizeStory(TODDLER_STORY);
    expect(s.pages.map((p) => p.id)).toEqual(['p1', 'p2', 'p3']);
    expect(s.pages[1].emoji).toBe('⚽');
  });

  it('has no questions (so the reader hides the quiz instead of crashing on story.questions.length)', () => {
    expect(normalizeStory(TODDLER_STORY).questions).toEqual([]);
  });

  it('accepts plain-string pages and skips blank ones', () => {
    const s = normalizeStory({ title: 'T', pages: ['One.', '   ', '', { text: 'Two.' }, { nope: true }] });
    expect(s.pages.map((p) => p.text)).toEqual(['One.', 'Two.']);
    expect(s.pages.map((p) => p.id)).toEqual(['p1', 'p2']);
  });

  it('keeps a page image when present', () => {
    const s = normalizeStory({ pages: [{ text: 'Hi', imageUrl: 'https://x/y.webp' }] });
    expect(s.pages[0].imageUrl).toBe('https://x/y.webp');
  });
});

describe('normalizeStory — legacy content stories (must keep working unchanged)', () => {
  it('turns content into one page and leaves the text byte-for-byte untouched', () => {
    const s = normalizeStory(LEGACY_SAVED_STORY);
    expect(s.shape).toBe('content');
    expect(s.pages).toHaveLength(1);
    // Exact equality: read-aloud highlighting is computed from character offsets in this string.
    expect(s.fullText).toBe(LEGACY_SAVED_STORY.content);
  });

  it('carries title, emoji, cover image, id and questions through', () => {
    const s = normalizeStory(LEGACY_SAVED_STORY);
    expect(s.id).toBe('abc123');
    expect(s.title).toBe('The Dragon Who Loved Cupcakes');
    expect(s.emojiIcon).toBe('🐉');
    expect(s.imageUrl).toBe('https://example.com/cover.png');
    expect(s.questions).toHaveLength(3);
    expect(s.questions[0]).toEqual({ question: 'What did Dax love?', answer: 'cupcakes' });
  });
});

describe('normalizeStory — precedence and bad input', () => {
  it('prefers pages when both pages and content exist', () => {
    const s = normalizeStory({ content: 'Old text', pages: [{ text: 'New page' }] });
    expect(s.shape).toBe('pages');
    expect(s.fullText).toBe('New page');
  });

  it('falls back to content when pages has no readable text', () => {
    const s = normalizeStory({ content: 'Fallback text', pages: [{ text: '' }, {}] });
    expect(s.shape).toBe('content');
    expect(s.fullText).toBe('Fallback text');
  });

  it.each([null, undefined, 42, 'a string', true, [], {}])('never throws and returns an empty story for %p', (bad) => {
    const s = normalizeStory(bad as any);
    expect(s.shape).toBe('empty');
    expect(s.pages).toEqual([]);
    expect(s.fullText).toBe('');
    expect(s.questions).toEqual([]);
    expect(s.title).toBe('Untitled story');
    expect(s.emojiIcon).toBe('📖');
    expect(s.imageUrl).toBe('');
  });

  it('drops malformed questions but keeps valid ones', () => {
    const s = normalizeStory({
      content: 'Text',
      questions: [
        { question: 'Good?', answer: 'yes' },
        { question: 'No answer' },
        { answer: 'no question' },
        null,
        'nope',
        { question: '  ', answer: 'blank' },
      ],
    });
    expect(s.questions).toEqual([{ question: 'Good?', answer: 'yes' }]);
  });

  it('ignores a non-string questions field', () => {
    expect(normalizeStory({ content: 'Text', questions: 'not an array' }).questions).toEqual([]);
  });

  it('does not mutate its input', () => {
    const input = JSON.parse(JSON.stringify(TODDLER_STORY));
    const before = JSON.stringify(input);
    normalizeStory(input);
    expect(JSON.stringify(input)).toBe(before);
  });
});
