import type { NormalizedStory, StoryPage, StoryQuestion } from './types';

const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

function normalizePages(raw: unknown): StoryPage[] {
  if (!Array.isArray(raw)) return [];
  const pages: StoryPage[] = [];
  raw.forEach((item) => {
    const text = typeof item === 'string' ? item : (item as any)?.text;
    if (!isNonEmptyString(text)) return;
    const page: StoryPage = { id: `p${pages.length + 1}`, text };
    if (item && typeof item === 'object') {
      const { emoji, imageUrl } = item as any;
      if (isNonEmptyString(emoji)) page.emoji = emoji;
      if (isNonEmptyString(imageUrl)) page.imageUrl = imageUrl;
    }
    pages.push(page);
  });
  return pages;
}

function normalizeQuestions(raw: unknown): StoryQuestion[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((q: any) => q && isNonEmptyString(q.question) && isNonEmptyString(q.answer))
    .map((q: any) => ({ question: q.question, answer: q.answer }));
}

/**
 * Turn any stored or generated story (legacy `content`, `pages`, or something half-filled) into one
 * predictable shape. Never throws: a missing or malformed story becomes an empty one the reader can show.
 *
 * - `pages` wins when it has readable text; otherwise `content` becomes a single page with its text untouched
 *   (line breaks kept, so read-aloud highlighting lines up exactly as it did before).
 * - Questions are optional. A story without questions simply has no quiz (enjoyment-only reading).
 */
export function normalizeStory(raw: unknown): NormalizedStory {
  const src: any = raw && typeof raw === 'object' ? raw : {};

  let pages = normalizePages(src.pages);
  let shape: NormalizedStory['shape'] = 'pages';
  if (pages.length === 0) {
    if (isNonEmptyString(src.content)) {
      pages = [{ id: 'p1', text: src.content }];
      shape = 'content';
    } else {
      shape = 'empty';
    }
  }

  return {
    id: typeof src.id === 'string' ? src.id : undefined,
    title: isNonEmptyString(src.title) ? src.title.trim() : 'Untitled story',
    emojiIcon: isNonEmptyString(src.emojiIcon) ? src.emojiIcon : '📖',
    imageUrl: isNonEmptyString(src.imageUrl) ? src.imageUrl : '',
    pages,
    questions: normalizeQuestions(src.questions),
    fullText: pages.map((p) => p.text).join('\n'),
    shape,
  };
}
