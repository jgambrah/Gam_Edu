/**
 * Story Spark — shared types.
 *
 * Two shapes exist in the wild and both must keep opening:
 *  - "content" stories: one block of text (what the AI generator and saved library stories use);
 *  - "pages" stories: a list of pages (the built-in toddler story, and the shape Story Spark 2.0 builds on).
 * `normalizeStory()` turns either into a `NormalizedStory`, which is all the reader ever looks at.
 */

export interface StoryQuestion {
  question: string;
  answer: string;
}

export interface StoryPage {
  id: string;
  text: string;
  emoji?: string;
  imageUrl?: string;
}

export type StoryShape = 'pages' | 'content' | 'empty';

export interface NormalizedStory {
  id?: string;
  title: string;
  emojiIcon: string;
  /** Cover illustration URL, or '' when the story has none. */
  imageUrl: string;
  pages: StoryPage[];
  questions: StoryQuestion[];
  /** All page text joined with newlines — what the continuous reader shows and speaks. */
  fullText: string;
  /** Which stored shape this came from (useful for tests and migration reports). */
  shape: StoryShape;
}
