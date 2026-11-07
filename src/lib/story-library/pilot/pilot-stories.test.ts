// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { PILOT_STORIES } from './pilot-stories';
import { textOnlyPackage, wordCount } from './pilot-package';
import { errorsOf, presentationFor, validateClassification } from '../classification';
import { validateActivities, validateGlossary } from '../premium';
import { aspectHashes } from '../aspects';
import { evaluateReadiness } from '../readiness';

describe('pilot stories', () => {
  it('are the five named stories plus one labelled extension sample', () => {
    expect(PILOT_STORIES.filter((s) => s.set === 'pilot').map((s) => s.title)).toEqual([
      'Ama and the Lost Little Goat', 'Kofi’s Colourful Garden', 'The Clever Tortoise and the Rain', 'Amina’s First Day at School', 'The Little Star That Loved to Shine',
    ]);
    expect(PILOT_STORIES.filter((s) => s.set === 'extension')).toHaveLength(1);
    expect(new Set(PILOT_STORIES.map((s) => s.key)).size).toBe(PILOT_STORIES.length);
  });

  for (const s of PILOT_STORIES) {
    describe(s.title, () => {
      it('has a valid classification (no invented curriculum codes)', () => {
        expect(errorsOf(validateClassification(s.classification))).toEqual([]);
        expect(s.classification.curriculum).toBeUndefined();
      });
      it('has valid activities and glossary', () => {
        expect(validateActivities(s.activities, s.pages.length)).toEqual([]);
        expect(validateGlossary(s.glossary, s.pages.map((p) => p.text))).toEqual([]);
      });
      it('has alt text, an illustration brief and narration direction on every page', () => {
        for (const p of s.pages) { expect(p.alt.length).toBeGreaterThan(10); expect(p.brief.length).toBeGreaterThan(20); expect(p.narration.length).toBeGreaterThan(5); }
      });
      it('estimated duration is consistent with the length and the narration pace', () => {
        const wpm = Number(/about (\d+) words/.exec(s.narrationPlan.pace)?.[1] ?? 110);
        const speakingSec = (wordCount(s) / wpm) * 60;
        const est = s.classification.estimatedDurationSec;
        expect(est).toBeGreaterThanOrEqual(speakingSec * 0.9);
        expect(est).toBeLessThanOrEqual(speakingSec * 3); // allows page turns, activities, pauses
      });
      it('is NOT premium-ready: nothing here has illustrations, narration or human reviews yet', () => {
        const pkg = textOnlyPackage(s);
        const aspects = aspectHashes(pkg, {});
        const r = evaluateReadiness({ contentHash: pkg.contentHash, classification: s.classification, aspects, pkg, reviews: [], licence: {} });
        expect(r.premiumReady).toBe(false);
        const codes = r.blockers.map((b) => b.code);
        expect(codes).toContain('missing-illustration');
        expect(codes).toContain('missing-narration');
        expect(codes).toContain('review-missing');
      });
      it('personal data and links are absent from the text', () => {
        const text = s.pages.map((p) => p.text).join(' ');
        expect(text).not.toMatch(/https?:|www\.|@|\d{9,}/);
      });
    });
  }

  it('covers the intended range of learners and presentations', () => {
    const presentations = new Set(PILOT_STORIES.map((s) => presentationFor(s.classification.classIds).id));
    expect(presentations.has('lower-primary')).toBe(true);
    expect(presentations.has('jhs')).toBe(true);
    expect(presentations.has('early-years')).toBe(true);
  });
});
