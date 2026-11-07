import type { StoryPackage } from '../types';
import { splitSentences } from '../premium';
import { PILOT_STORIES, type PilotStory } from './pilot-stories';

/** Text-only package for a pilot story: NO illustrations and NO narration, because none exist yet. */
export function textOnlyPackage(s: PilotStory, version = 1): StoryPackage {
  return {
    schemaVersion: 1, storyId: s.key, version, contentHash: `sha256:${'0'.repeat(64)}`, title: s.title,
    ageTiers: [], language: s.classification.language, narrationLocale: s.classification.narrationLocale,
    pages: s.pages.map((p, i) => ({ n: i + 1, text: p.text, sentences: splitSentences(p.text), alt: p.alt })),
    activities: s.activities, glossary: s.glossary, assets: {},
  };
}

export const wordCount = (s: PilotStory) => s.pages.reduce((n, p) => n + p.text.trim().split(/\s+/).length, 0);
export { PILOT_STORIES };
