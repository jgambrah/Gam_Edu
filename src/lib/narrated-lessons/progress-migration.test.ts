import { describe, it, expect } from 'vitest';
import { resolveRestoredStepIndex } from './progress-migration';

const ELEVEN_SLIDE_STEPS = [
  { id: 'intro' },
  { id: 'slide-intro01' },
  { id: 'cp-cpIntro01' },
  { id: 'slide-intro02' },
  { id: 'cp-cpIntro02' },
  { id: 'slide-intro03' },
  { id: 'cp-cpIntro03' },
  { id: 'slide-s01' },
  { id: 'cp-cp01' },
  { id: 'slide-s02' },
  { id: 'cp-cp02' },
  { id: 'mastery' },
  { id: 'summary' },
];

describe('NarratedLessonPlayer progress migration (Boolean Logic 10A)', () => {
  it('resolves exact step when stable currentStepId is saved', () => {
    const idx = resolveRestoredStepIndex('igcse-cs-boolean-logic-a', ELEVEN_SLIDE_STEPS, {
      stepIdx: 1,
      currentStepId: 'slide-s02',
    });
    expect(ELEVEN_SLIDE_STEPS[idx].id).toBe('slide-s02');
  });

  it('migrates legacy stepIdx > 0 by +6 so returning students land on their original slide', () => {
    // Previously step 1 was slide-s01; after inserting 3 slides + 3 checkpoints, slide-s01 is at index 7
    const s01Idx = resolveRestoredStepIndex('igcse-cs-boolean-logic-a', ELEVEN_SLIDE_STEPS, {
      stepIdx: 1,
    });
    expect(ELEVEN_SLIDE_STEPS[s01Idx].id).toBe('slide-s01');

    // Previously step 3 was slide-s02; now at index 9
    const s02Idx = resolveRestoredStepIndex('igcse-cs-boolean-logic-a', ELEVEN_SLIDE_STEPS, {
      stepIdx: 3,
    });
    expect(ELEVEN_SLIDE_STEPS[s02Idx].id).toBe('slide-s02');
  });

  it('keeps fresh learners at step 0 (intro screen) without skipping new intro slides', () => {
    const idx = resolveRestoredStepIndex('igcse-cs-boolean-logic-a', ELEVEN_SLIDE_STEPS, {
      stepIdx: 0,
    });
    expect(idx).toBe(0);
  });
});
