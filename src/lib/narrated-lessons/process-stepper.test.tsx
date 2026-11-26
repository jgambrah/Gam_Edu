import React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import {
  computeProcessStateDiff,
  evaluateSequenceOrder,
  isApprovedProcessAssetPath,
  stepNextStage,
  stepPrevStage,
} from './process-stepper-logic';
import {
  assertValidLessonInteractives,
  validateSlideInteractiveConfig,
  type ProcessStepperInteractiveConfig,
} from './interactive-schema';
import { ProcessStepperEngine } from '@/components/narrated-lessons/ProcessStepperEngine';
import { InteractiveEngineRegistry } from '@/components/narrated-lessons/InteractiveEngineRegistry';
import type { LessonSlide, NarratedLesson } from './types';

function referenceBinarySearch(arr: readonly number[], target: number): { index: number; steps: Array<{ low: number; mid: number; high: number }> } {
  let low = 0;
  let high = arr.length - 1;
  const steps: Array<{ low: number; mid: number; high: number }> = [];
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push({ low, mid, high });
    if (arr[mid] === target) return { index: mid, steps };
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return { index: -1, steps };
}

describe('Step 4B Pure Logic: State Diffing, Navigation, Sequencing, Asset Allowlist & Binary Search Verification', () => {
  it('computes accurate state diffs for unchanged, changed, added, and removed fields', () => {
    const prev = [
      { id: 'pc', label: 'PC', value: '100' },
      { id: 'mar', label: 'MAR', value: '100' },
      { id: 'temp', label: 'Temp', value: 'OLD' },
    ];
    const curr = [
      { id: 'pc', label: 'PC', value: '101' },
      { id: 'mar', label: 'MAR', value: '100' },
      { id: 'mdr', label: 'MDR', value: 'LOAD 5' },
    ];
    const diff = computeProcessStateDiff(prev, curr);
    expect(diff.find((r) => r.id === 'pc')?.status).toBe('changed');
    expect(diff.find((r) => r.id === 'mar')?.status).toBe('unchanged');
    expect(diff.find((r) => r.id === 'mdr')?.status).toBe('added');
    expect(diff.find((r) => r.id === 'temp')?.status).toBe('removed');
  });

  it('distinguishes linear stopping from cyclic wrapping', () => {
    expect(stepNextStage(3, 4, 'linear')).toEqual({ nextIndex: 3, wrapped: false, atEnd: true });
    expect(stepNextStage(3, 4, 'cyclic')).toEqual({ nextIndex: 0, wrapped: true, atEnd: false });
    expect(stepPrevStage(0, 4, 'linear')).toEqual({ prevIndex: 0, wrapped: false });
    expect(stepPrevStage(0, 4, 'cyclic')).toEqual({ prevIndex: 3, wrapped: true });
  });

  it('enforces strict approved WebP/PNG asset paths and blocks untrusted URLs or protocols', () => {
    expect(isApprovedProcessAssetPath('images/s01.webp')).toBe(true);
    expect(isApprovedProcessAssetPath('/preview-fixtures/digestion.png')).toBe(true);
    expect(
      isApprovedProcessAssetPath('https://storage.googleapis.com/gamedu-69888475-f5783.firebasestorage.app/story-spark-preview/narrated-lessons/test/images/s01.webp'),
    ).toBe(true);

    expect(isApprovedProcessAssetPath('https://evil.example.com/img.png')).toBe(false);
    expect(isApprovedProcessAssetPath('javascript:alert(1)')).toBe(false);
    expect(isApprovedProcessAssetPath('data:image/svg+xml,<svg/>')).toBe(false);
    expect(isApprovedProcessAssetPath('images/../secret.png')).toBe(false);
    expect(isApprovedProcessAssetPath('images/diagram.svg')).toBe(false);
  });

  it('independently verifies Binary Search (found target=42 -> index 5 AND not-found target=30 -> -1)', () => {
    const arr = [4, 11, 18, 25, 33, 42, 57];
    const found = referenceBinarySearch(arr, 42);
    expect(found.index).toBe(5);
    expect(found.steps).toEqual([
      { low: 0, mid: 3, high: 6 },
      { low: 4, mid: 5, high: 6 },
    ]);

    const notFound = referenceBinarySearch(arr, 30);
    expect(notFound.index).toBe(-1);
    expect(notFound.steps).toEqual([
      { low: 0, mid: 3, high: 6 },
      { low: 4, mid: 5, high: 6 },
      { low: 4, mid: 4, high: 4 },
    ]);
  });

  it('evaluates sequence ordering accurately', () => {
    expect(evaluateSequenceOrder(['a', 'b', 'c'], ['a', 'b', 'c'])).toEqual({
      correct: true,
      matchedPositions: 3,
      total: 3,
    });
    expect(evaluateSequenceOrder(['a', 'c', 'b'], ['a', 'b', 'c'])).toEqual({
      correct: false,
      matchedPositions: 1,
      total: 3,
    });
  });
});

describe('Step 4B Schema Validation, Security & Production Compatibility', () => {
  const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step4b-process-stepper-pilot.json');
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as NarratedLesson;

  it('validates all 8 cross-subject pilot slides under production publish gate (productionVersion: 1.0.0) and still blocks unsupported future versions', () => {
    expect(fixture.slides.length).toBe(8);

    expect(() => assertValidLessonInteractives(fixture)).not.toThrow();

    const futureLesson: NarratedLesson = {
      ...fixture,
      slides: [
        {
          ...fixture.slides[0],
          interactive: {
            ...(fixture.slides[0].interactive as ProcessStepperInteractiveConfig),
            minEngineVersion: '2.0.0',
          },
        },
      ],
    };
    expect(() => assertValidLessonInteractives(futureLesson)).toThrow(/exceeds productionVersion "1\.0\.0"/i);
  });

  it('rejects duplicate stage IDs, unsafe prototype state keys, untrusted visual URLs, and invalid highlight coordinates', () => {
    const baseCfg = fixture.slides[0].interactive as ProcessStepperInteractiveConfig;

    const dupStages = validateSlideInteractiveConfig({
      ...baseCfg,
      stages: [baseCfg.stages[0], baseCfg.stages[0]],
    });
    expect(dupStages.ok).toBe(false);
    expect(dupStages.errors.join(' ')).toMatch(/duplicate stage id/i);

    const unsafeStateKey = validateSlideInteractiveConfig({
      ...baseCfg,
      stages: [
        {
          ...baseCfg.stages[0],
          stateSnapshot: [{ id: 'constructor', label: 'Bad', value: 'X' }],
        },
        baseCfg.stages[1],
      ],
    });
    expect(unsafeStateKey.ok).toBe(false);
    expect(unsafeStateKey.errors.join(' ')).toMatch(/invalid or unsafe/i);

    const badHighlight = validateSlideInteractiveConfig({
      ...baseCfg,
      visualMode: 'shared-highlight',
      sharedVisual: { src: '/preview-fixtures/body.png', altText: 'Human digestive diagram' },
      stages: [
        {
          ...baseCfg.stages[0],
          highlightRegion: { xPct: 80, yPct: 10, widthPct: 30, heightPct: 20, label: 'Out of bounds' },
        },
        baseCfg.stages[1],
      ],
    });
    expect(badHighlight.ok).toBe(false);
    expect(badHighlight.errors.join(' ')).toMatch(/bounded within 0\.\.100%/i);

    const badAsset = validateSlideInteractiveConfig({
      ...baseCfg,
      visualMode: 'stage-illustrations',
      stages: [
        {
          ...baseCfg.stages[0],
          visual: { src: 'https://untrusted.example.org/pic.png', altText: 'Untrusted image' },
        },
        baseCfg.stages[1],
      ],
    });
    expect(badAsset.ok).toBe(false);
    expect(badAsset.errors.join(' ')).toMatch(/approved WebP\/PNG media path/i);
  });
});

describe('Step 4B ProcessStepperEngine UI: Navigation, State Diff, Prediction, Sequencing, Isolation & Low-Data', () => {
  const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step4b-process-stepper-pilot.json');
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as NarratedLesson;

  it('supports linear navigation, state diff textual badges, prediction feedback, and Replay/Reset on Mitosis', () => {
    const mitosisCfg = fixture.slides[0].interactive as ProcessStepperInteractiveConfig;
    const { container } = render(<ProcessStepperEngine config={mitosisCfg} />);

    expect(container.querySelector('[data-active-stage-id="interphase"]')).toBeTruthy();

    // Advance to Prophase -> state diff should show textual "Changed (was ...)" badge
    fireEvent.click(screen.getByRole('button', { name: /Next Stage/i }));
    expect(container.querySelector('[data-active-stage-id="prophase"]')).toBeTruthy();
    expect(screen.getAllByText(/Changed \(was/i).length).toBeGreaterThan(0);

    // Advance to Metaphase -> test prediction check
    fireEvent.click(screen.getByRole('button', { name: /Next Stage/i }));
    expect(container.querySelector('[data-active-stage-id="metaphase"]')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Sister chromatids separate/i }));
    fireEvent.click(screen.getByRole('button', { name: /Check prediction/i }));
    expect(screen.getByText(/Correct!/i)).toBeTruthy();

    // Reset returns cleanly to Stage 1
    fireEvent.click(screen.getByRole('button', { name: /^Reset$/i }));
    expect(container.querySelector('[data-active-stage-id="interphase"]')).toBeTruthy();
  });

  it('supports cyclic wrapping on Water Cycle and independent state across two activities on one slide', () => {
    const waterCfg = fixture.slides[2].interactive as ProcessStepperInteractiveConfig;
    const eqCfg = fixture.slides[6].interactive as ProcessStepperInteractiveConfig;

    const { container } = render(
      <div>
        <ProcessStepperEngine config={waterCfg} />
        <ProcessStepperEngine config={eqCfg} />
      </div>,
    );

    const sections = container.querySelectorAll('section[data-interactive-engine="process-stepper"]');
    expect(sections.length).toBe(2);
    const waterSec = sections[0] as HTMLElement;
    const eqSec = sections[1] as HTMLElement;

    // Step Water Cycle through all 4 stages and wrap back to Stage 1
    fireEvent.click(within(waterSec).getByRole('button', { name: /Next Stage/i }));
    fireEvent.click(within(waterSec).getByRole('button', { name: /Next Stage/i }));
    fireEvent.click(within(waterSec).getByRole('button', { name: /Next Stage/i }));
    fireEvent.click(within(waterSec).getByRole('button', { name: /Restart Cycle/i }));
    expect(waterSec.querySelector('[data-active-stage-id="evaporation"]')).toBeTruthy();
    expect(within(waterSec).getByText(/Cycle restarted at Stage 1/i)).toBeTruthy();

    // Equation activity MUST still be on Stage 1 (completely independent)
    expect(eqSec.querySelector('[data-active-stage-id="start-eq"]')).toBeTruthy();
  });

  it('renders Mode C shared-highlight region and Low-Data Mode fallback via InteractiveEngineRegistry', () => {
    const baseCfg = fixture.slides[4].interactive as ProcessStepperInteractiveConfig;
    const modeCCfg: ProcessStepperInteractiveConfig = {
      ...baseCfg,
      id: 'pilot4b-mode-c-test',
      visualMode: 'shared-highlight',
      sharedVisual: {
        src: '/preview-fixtures/digestion-overview.png',
        altText: 'Human digestive system overview diagram',
        caption: 'Shared anatomical diagram with stage-specific highlight.',
      },
      stages: baseCfg.stages.map((st, idx) =>
        idx === 0
          ? {
              ...st,
              highlightRegion: { xPct: 20, yPct: 10, widthPct: 25, heightPct: 15, label: 'Mouth & Salivary Glands' },
            }
          : st,
      ),
    };

    expect(validateSlideInteractiveConfig(modeCCfg, { requireImplemented: true }).ok).toBe(true);
    render(<ProcessStepperEngine config={modeCCfg} />);
    expect(screen.getByLabelText(/Highlighted region: Mouth & Salivary Glands/i)).toBeTruthy();

    // Low-Data Mode via InteractiveEngineRegistry
    const stubSlide = fixture.slides[0] as LessonSlide;
    render(<InteractiveEngineRegistry lesson={fixture} slide={stubSlide} lowDataMode={true} />);
    expect(screen.getByText(/Low-Data Summary/i)).toBeTruthy();
  });

  it('renders A-Level Chemistry equation banner and structured reactionMeta (bonds broken/formed, electron movement, intermediates)', () => {
    const elecCfg = fixture.slides[7].interactive as ProcessStepperInteractiveConfig;
    const { container } = render(<ProcessStepperEngine config={elecCfg} />);

    // Advance to Stage 2 (pi-attack)
    fireEvent.click(screen.getByRole('button', { name: /Next Stage/i }));
    expect(container.querySelector('[data-stage-equation="true"]')?.textContent).toContain('CH₂=CH₂');
    expect(container.querySelector('[data-stage-reaction-meta="true"]')?.textContent).toContain('C=C π bond');
    expect(container.querySelector('[data-stage-reaction-meta="true"]')?.textContent).toContain('Curly arrow 1');

    // Reject unknown reactionMeta field
    const badMeta = validateSlideInteractiveConfig({
      ...elecCfg,
      stages: [
        {
          ...elecCfg.stages[0],
          reactionMeta: { unsupportedKey: ['x'] } as unknown as ProcessStepperInteractiveConfig['stages'][0]['reactionMeta'],
        },
        elecCfg.stages[1],
      ],
    });
    expect(badMeta.ok).toBe(false);
    expect(badMeta.errors.join(' ')).toMatch(/Unknown configuration field/i);
  });
});
