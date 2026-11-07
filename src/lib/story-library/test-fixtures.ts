/** Test-only builders for a complete premium story input (every mandatory element present). */
import { makeStory, syntheticClassification } from './seeder/synthetic';
import { splitSentences, tokenize, type Activity, type TimingTrack } from './premium';
import type { StoryInput } from './seeder/types';

export const LIC = { source: 'test-studio', licenseId: 'CC-BY-4.0' };

export function wordTrack(text: string, durationMs: number, over: Partial<TimingTrack> = {}): TimingTrack {
  const sents = splitSentences(text); const words = tokenize(text);
  const per = Math.floor((durationMs - 100) / words.length);
  const wm = words.map((_, i) => [i * per + 10, (i + 1) * per] as [number, number]);
  let at = 0;
  const sm = sents.map((s) => { const n = tokenize(s).length; const m: [number, number] = [wm[at][0], wm[at + n - 1][1]]; at += n; return m; });
  return { granularity: 'word', method: 'forced-alignment', verified: true, sentences: sm, words: wm, ...over };
}

export function premiumStory(over: Partial<StoryInput> = {}, index = 3): StoryInput {
  const base = makeStory(index, { pages: 4, sentencesPerPage: 2 });
  const classification = { ...syntheticClassification(index), objectives: ['vocabulary', 'reading-comprehension'], readingLevel: 'emergent', narrationLocale: 'en-GH', estimatedDurationSec: 60 } as any;
  const pages = base.pages.map((p, i) => {
    const durationMs = 15000;
    return { ...p, alt: `Picture for page ${i + 1}`, image: { ...p.image, licence: LIC }, sentences: splitSentences(p.text),
      audio: { ...p.audio!, durationMs, licence: LIC }, timing: wordTrack(p.text, durationMs) };
  });
  const clean = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  const activities: Activity[] = [
    { id: 'c1', type: 'comprehension', question: 'What happened first?', options: ['one', 'two'], correctIndex: 0 },
    { id: 'c2', type: 'comprehension', question: 'Who was in it?', options: ['a', 'b', 'c'], correctIndex: 1 },
    { id: 'v1', type: 'vocabulary', word: clean(tokenize(pages[0].text)[1]), definition: 'a word in the story', distractors: ['nothing'] },
  ];
  const glossary = [1, 2, 3].map((k) => ({ word: clean(tokenize(pages[0].text)[k]), definition: 'a word in the story', pages: [1] }));
  return { ...base, classification, narrationLocale: 'en-GH', pages, activities, glossary, ...over } as StoryInput;
}
