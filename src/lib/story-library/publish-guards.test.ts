// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { verifyCatalogueSafetyAgainstRemote } from '../../../scripts/library/publish-to-storage';
import { planMediaGeneration } from '../../../scripts/library/seed-batch-media';
import type { PilotStory } from './pilot/pilot-stories';

const stubStory = (key: string, pageCount = 2): PilotStory =>
  ({
    key,
    title: key,
    summary: 'stub',
    set: 'pilot',
    palette: ['#ffffff', '#000000'],
    classification: {
      version: 1,
      classIds: ['b7'],
      ageMin: 12,
      ageMax: 14,
      readingLevel: 'fluent',
      difficulty: 3,
      genres: ['folktale'],
      themes: ['community'],
      objectives: ['comprehension'],
      language: 'en',
      narrationLocale: 'en-GH',
      ghanaianContext: 'national',
      estimatedDurationSec: 120,
    },
    characters: ['Ama'],
    pages: Array.from({ length: pageCount }, (_, i) => ({
      motif: '📖',
      text: `Page ${i + 1} text.`,
      alt: `Page ${i + 1} alt description.`,
      brief: `Page ${i + 1} illustration brief.`,
      narration: 'Warm narrator.',
    })),
    activities: [],
    glossary: [],
    narrationPlan: { voice: 'Kore', pace: 'steady', notes: [] },
    music: 'none',
    culturalNotes: [],
    reviewQuestions: [],
  }) as unknown as PilotStory;

describe('publish-to-storage catalogue shrink & missing-key safety guard', () => {
  it('blocks upload when new entry count is lower than live Storage catalogue', () => {
    const res = verifyCatalogueSafetyAgainstRemote(
      [{ storyKey: 's1' }, { storyKey: 's2' }, { storyKey: 's3' }],
      [{ storyKey: 's1' }, { storyKey: 's2' }],
      false,
    );
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.remoteCount).toBe(3);
      expect(res.newCount).toBe(2);
      expect(res.missingKeys).toEqual(['s3']);
    }
  });

  it('blocks upload when entry count grows or stays equal but an existing storyKey is missing', () => {
    const res = verifyCatalogueSafetyAgainstRemote(
      [{ storyKey: 's1' }, { storyKey: 's2' }],
      [{ storyKey: 's1' }, { storyKey: 's3' }, { storyKey: 's4' }],
      false,
    );
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.missingKeys).toEqual(['s2']);
    }
  });

  it('allows upload only when --allow-shrink is explicitly true or when all existing keys are preserved', () => {
    expect(
      verifyCatalogueSafetyAgainstRemote(
        [{ storyKey: 's1' }, { storyKey: 's2' }],
        [{ storyKey: 's1' }, { storyKey: 's2' }, { storyKey: 's3' }],
        false,
      ),
    ).toEqual({ ok: true });

    expect(
      verifyCatalogueSafetyAgainstRemote([{ storyKey: 's1' }, { storyKey: 's2' }], [{ storyKey: 's1' }], true),
    ).toEqual({ ok: true });
  });
});

describe('seed-batch-media skip-existing & dry-run planner', () => {
  it('skips stories that already have media even when passed via --keys unless --force-regenerate names the story', () => {
    const stories = [stubStory('existing-story', 2), stubStory('brand-new-story', 2)];
    const existing = new Set(['existing-story']);

    const defaultPlan = planMediaGeneration(stories, existing, {
      explicitKeys: null,
      forceRegenerateKeys: new Set(),
      audioOnly: false,
      imagesOnly: false,
    });
    expect(defaultPlan.planned.map((p) => p.story.key)).toEqual(['brand-new-story']);

    const explicitPlan = planMediaGeneration(stories, existing, {
      explicitKeys: new Set(['existing-story']),
      forceRegenerateKeys: new Set(),
      audioOnly: false,
      imagesOnly: false,
    });
    expect(explicitPlan.planned).toEqual([]);
    expect(explicitPlan.skippedExisting).toEqual(['existing-story']);

    const forcedPlan = planMediaGeneration(stories, existing, {
      explicitKeys: null,
      forceRegenerateKeys: new Set(['existing-story']),
      audioOnly: false,
      imagesOnly: false,
    });
    expect(forcedPlan.planned.map((p) => p.story.key)).toEqual(['existing-story', 'brand-new-story']);
  });
});

