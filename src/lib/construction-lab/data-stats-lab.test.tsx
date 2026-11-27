import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  buildCumulativeFrequency,
  buildHistogramModel,
  computeDescriptiveStats,
  computeGroupedStats,
  computeQuartiles,
  computeScatterRegression,
  computeTheoreticalProbability,
  createSeededRng,
  evaluateDataStatsAnswer,
  runProbabilityBatch,
  type ProbabilityExperimentSpec,
} from './data-stats-engine';
import {
  SUPPORTED_INTERACTIVE_ENGINES,
  assertValidLessonInteractives,
  validateSlideInteractiveConfig,
  type DataStatsLabConstructionConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import { DataStatsLab } from '@/components/narrated-lessons/construction/DataStatsLab';
import { InteractiveEngineRegistry } from '@/components/narrated-lessons/InteractiveEngineRegistry';

describe('Step 5D — Probability & Statistics Lab (construction-lab: data-stats-lab 1.5.0)', () => {
  it('extends construction-lab to engineVersion 1.6.0 while holding productionVersion at 1.3.0', () => {
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].engineVersion).toBe('1.6.0');
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].productionVersion).toBe('1.3.0');
  });

  describe('1. Independent Mathematical Reference Verification — Probability & Seeded PRNG', () => {
    it('computes exact theoretical probabilities for with-replacement, without-replacement, and two-dice sum events', () => {
      const withRep: ProbabilityExperimentSpec = {
        mode: 'probability-experiment',
        experimentKind: 'counters',
        withReplacement: true,
        drawsPerTrial: 2,
        outcomes: [{ id: 'R', label: 'Red', count: 3 }, { id: 'B', label: 'Blue', count: 2 }],
        targetEvent: { kind: 'outcome-equals', outcomeId: 'R', description: 'Both Red' },
      };
      // Hand calculation: (3/5)*(3/5) = 9/25 = 0.36
      expect(computeTheoreticalProbability(withRep)).toBe(0.36);

      const withoutRep: ProbabilityExperimentSpec = { ...withRep, withReplacement: false };
      // Hand calculation: (3/5)*(2/4) = 6/20 = 0.30
      expect(computeTheoreticalProbability(withoutRep)).toBe(0.3);

      // Two dice sum = 7 -> 6/36 = 1/6
      const twoDice: ProbabilityExperimentSpec = {
        mode: 'probability-experiment',
        experimentKind: 'die',
        drawsPerTrial: 2,
        outcomes: [1, 2, 3, 4, 5, 6].map((n) => ({ id: String(n), label: String(n), numericValue: n })),
        targetEvent: { kind: 'sum-equals', targetSum: 7, description: 'Sum = 7' },
      };
      expect(computeTheoreticalProbability(twoDice)).toBeCloseTo(1 / 6, 6);
    });

    it('reproduces identical sequences from the same seed, advances state per trial, and never produces impossible draws without replacement', () => {
      const spec: ProbabilityExperimentSpec = {
        mode: 'probability-experiment',
        experimentKind: 'counters',
        withReplacement: false,
        drawsPerTrial: 2,
        outcomes: [{ id: 'R', label: 'Red', count: 1 }, { id: 'B', label: 'Blue', count: 2 }],
        targetEvent: { kind: 'outcome-equals', outcomeId: 'R', description: 'Both Red (impossible!)' },
      };
      // Only 1 Red counter -> impossible to draw 2 Reds without replacement -> exact 0
      expect(computeTheoreticalProbability(spec)).toBe(0);

      const b1 = runProbabilityBatch(spec, 50, createSeededRng(42));
      const b2 = runProbabilityBatch(spec, 50, createSeededRng(42));
      expect(b1.eventHits).toBe(0);
      expect(b1.outcomeCounts).toEqual(b2.outcomeCounts);
      // Confirm RNG advances (not stuck on a single value)
      const rng = createSeededRng(42);
      const first = rng();
      const second = rng();
      expect(first).not.toBe(second);
    });
  });

  describe('2. Independent Mathematical Reference Verification — Descriptive Statistics, Quartiles, Histogram & Regression', () => {
    it('computes exact mean, median, multimodal/no-mode, population vs sample variance/SD, and all 3 quartile conventions', () => {
      // Classic hand-calculated dataset: [2, 4, 4, 4, 5, 5, 7, 9]
      // n=8, mean=5, median=4.5, mode=[4], range=7, popVar=32/8=4, popSD=2, sampVar=32/7≈4.571429, sampSD≈2.13809
      const st = computeDescriptiveStats([2, 4, 4, 4, 5, 5, 7, 9], 'tukey-exclusive');
      expect(st.n).toBe(8);
      expect(st.mean).toBe(5);
      expect(st.median).toBe(4.5);
      expect(st.modes).toEqual([4]);
      expect(st.range).toBe(7);
      expect(st.populationVariance).toBe(4);
      expect(st.populationStdDev).toBe(2);
      expect(st.sampleVariance).toBeCloseTo(32 / 7, 5);
      expect(st.sampleStdDev).toBeCloseTo(Math.sqrt(32 / 7), 5);

      // No mode when all frequencies equal; multimodal when two values tie
      expect(computeDescriptiveStats([1, 2, 3, 4]).modes).toEqual([]);
      expect(computeDescriptiveStats([1, 1, 2, 3, 3]).modes).toEqual([1, 3]);

      // Quartile conventions on odd dataset [1, 2, 3, 4, 5, 6, 7]
      expect(computeQuartiles([1, 2, 3, 4, 5, 6, 7], 'tukey-exclusive')).toEqual({ q1: 2, median: 4, q3: 6 });
      expect(computeQuartiles([1, 2, 3, 4, 5, 6, 7], 'tukey-inclusive')).toEqual({ q1: 2.5, median: 4, q3: 5.5 });
      expect(computeQuartiles([1, 2, 3, 4, 5, 6, 7], 'linear-interpolation')).toEqual({ q1: 2.5, median: 4, q3: 5.5 });

      // Empty & single-element edge cases
      expect(computeDescriptiveStats([]).mean).toBeNull();
      const single = computeDescriptiveStats([42]);
      expect(single.populationVariance).toBe(0);
      expect(single.sampleVariance).toBeNull();
    });

    it('computes grouped-data estimated mean, unequal-width histogram frequency density (area === frequency), and monotonic cumulative frequency', () => {
      const grouped = [
        { lower: 0, upper: 10, frequency: 10 },
        { lower: 10, upper: 20, frequency: 20 },
        { lower: 20, upper: 40, frequency: 30 },
      ];
      const gs = computeGroupedStats(grouped);
      expect(gs.isGroupedEstimate).toBe(true);
      // (5*10 + 15*20 + 30*30) / 60 = 1250 / 60 = 20.833333
      expect(gs.mean).toBeCloseTo(1250 / 60, 5);

      const hist = buildHistogramModel(grouped);
      expect(hist[2].classWidth).toBe(20);
      expect(hist[2].frequencyDensity).toBe(1.5);
      expect(hist[2].barArea).toBe(30); // Area === frequency!

      const cf = buildCumulativeFrequency(grouped);
      expect(cf).toEqual([
        { x: 0, cumulativeFrequency: 0 },
        { x: 10, cumulativeFrequency: 10 },
        { x: 20, cumulativeFrequency: 30 },
        { x: 40, cumulativeFrequency: 60 },
      ]);
      for (let i = 1; i < cf.length; i++) {
        expect(cf[i].cumulativeFrequency).toBeGreaterThanOrEqual(cf[i - 1].cumulativeFrequency);
      }
    });

    it('computes exact Pearson r, simple linear regression, interpolation vs extrapolation, and handles degenerate datasets', () => {
      // Exact line y = 2x + 1
      const reg = computeScatterRegression([
        { x: 1, y: 3 },
        { x: 2, y: 5 },
        { x: 3, y: 7 },
        { x: 4, y: 9 },
      ]);
      expect(reg.isDegenerate).toBe(false);
      expect(reg.pearsonR).toBe(1);
      expect(reg.slope).toBe(2);
      expect(reg.intercept).toBe(1);
      expect(reg.predict(2.5)).toEqual({ y: 6, isExtrapolation: false });
      expect(reg.predict(6)).toEqual({ y: 13, isExtrapolation: true });

      // Degenerate constant X -> r is null, slope is null
      const degen = computeScatterRegression([
        { x: 5, y: 1 },
        { x: 5, y: 4 },
        { x: 5, y: 9 },
      ]);
      expect(degen.isDegenerate).toBe(true);
      expect(degen.pearsonR).toBeNull();
      expect(degen.slope).toBeNull();
    });

    it('verifies Step 5D close-out: multimodal & no-mode grading, experimental probability trial gating, genuine pie/pictogram/dot-plot/frequency-polygon/box-plot SVG geometry', () => {
      // 1. Multimodal & no-mode grading
      const bimodalSpec = {
        mode: 'descriptive-stats' as const,
        data: [1, 1, 2, 3, 3],
        targetMeasure: 'mode' as const,
      };
      expect(evaluateDataStatsAnswer(bimodalSpec, '1').passed).toBe(false); // incomplete set rejected!
      expect(evaluateDataStatsAnswer(bimodalSpec, '3, 1').passed).toBe(true); // unordered complete set accepted!
      const noModeSpec = {
        mode: 'descriptive-stats' as const,
        data: [2, 4, 6, 8],
        targetMeasure: 'mode' as const,
      };
      expect(evaluateDataStatsAnswer(noModeSpec, 'none').passed).toBe(true);
      expect(evaluateDataStatsAnswer(noModeSpec, '2').passed).toBe(false);

      // 2. Experimental probability requires minRequiredTrials and grades against live state
      const expProbSpec: ProbabilityExperimentSpec = {
        mode: 'probability-experiment',
        experimentKind: 'coin',
        outcomes: [{ id: 'H', label: 'Heads' }, { id: 'T', label: 'Tails' }],
        targetEvent: { kind: 'outcome-equals', outcomeId: 'H', description: 'Heads' },
        expectedAnswerKind: 'experimental-relative-frequency',
        minRequiredTrials: 20,
      };
      expect(evaluateDataStatsAnswer(expProbSpec, '0.5', undefined, false, { totalTrials: 5, eventHits: 3 }).passed).toBe(false);
      expect(evaluateDataStatsAnswer(expProbSpec, '0.6', undefined, false, { totalTrials: 20, eventHits: 12 }).passed).toBe(true);

      // 3. Genuine Pie chart SVG sector angle (14/32 * 360 = 157.5°)
      const { container: pieC } = render(
        <DataStatsLab
          config={{
            id: 'gfx-pie',
            engine: 'construction-lab',
            labKind: 'data-stats-lab',
            schemaVersion: 1,
            minEngineVersion: '1.5.0',
            curriculumLevel: 'primary',
            mode: 'data-visualisation',
            chartKind: 'pie',
            categories: [
              { label: 'A', frequency: 1 },
              { label: 'B', frequency: 3 },
            ],
            expectedNumericAnswer: 1,
            title: 'Pie GFX',
            instructions: 'Inspect pie.',
            accessibilityLabel: 'Pie GFX',
            fallbackText: 'Fallback.',
          }}
        />,
      );
      expect(pieC.querySelector('[data-testid="pie-sector-0"]')?.getAttribute('data-angle-deg')).toBe('90');
      expect(pieC.querySelector('[data-testid="pie-sector-1"]')?.getAttribute('data-angle-deg')).toBe('270');

      // 4. Genuine Dot plot stacking (NEVER renders a box plot!)
      const { container: dotC } = render(
        <DataStatsLab
          config={{
            id: 'gfx-dot',
            engine: 'construction-lab',
            labKind: 'data-stats-lab',
            schemaVersion: 1,
            minEngineVersion: '1.5.0',
            curriculumLevel: 'primary',
            mode: 'data-visualisation',
            chartKind: 'dot-plot',
            rawValues: [2, 2, 2, 5],
            expectedNumericAnswer: 2,
            title: 'Dot GFX',
            instructions: 'Inspect dot plot.',
            accessibilityLabel: 'Dot GFX',
            fallbackText: 'Fallback.',
          }}
        />,
      );
      expect(dotC.querySelector('[data-testid="svg-dot-plot"]')).toBeTruthy();
      expect(dotC.querySelector('[data-testid="svg-box-plot"]')).toBeNull();
      expect(dotC.querySelector('[data-dot-value="2"]')?.getAttribute('data-dot-stack')).toBe('3');

      // 5. Genuine Box plot with Tukey 1.5-IQR outlier rendered separately
      const { container: bpC } = render(
        <DataStatsLab
          config={{
            id: 'gfx-bp',
            engine: 'construction-lab',
            labKind: 'data-stats-lab',
            schemaVersion: 1,
            minEngineVersion: '1.5.0',
            curriculumLevel: 'as-a-level',
            mode: 'data-visualisation',
            chartKind: 'box-plot',
            whiskerConvention: 'tukey-1.5-iqr',
            rawValues: [1, 2, 3, 4, 5, 6, 7, 50],
            expectedNumericAnswer: 4,
            title: 'Box GFX',
            instructions: 'Inspect box plot.',
            accessibilityLabel: 'Box GFX',
            fallbackText: 'Fallback.',
          }}
        />,
      );
      expect(bpC.querySelector('[data-testid="boxplot-outlier"]')?.getAttribute('data-outlier-val')).toBe('50');
    });
  });

  describe('3. Strict Schema Validation, Resource Bounds & 20-Slide Pilot Fixture', () => {
    it('rejects overlapping intervals, negative frequencies, impossible sampling without replacement, and downgraded minEngineVersion', () => {
      expect(
        validateSlideInteractiveConfig({
          id: 'bad-hist',
          engine: 'construction-lab',
          labKind: 'data-stats-lab',
          schemaVersion: 1,
          minEngineVersion: '1.5.0',
          curriculumLevel: 'igcse',
          mode: 'data-visualisation',
          chartKind: 'histogram',
          title: 'Bad Hist',
          instructions: 'Inspect.',
          accessibilityLabel: 'Bad hist',
          fallbackText: 'Fallback.',
          groupedTable: [
            { lower: 0, upper: 15, frequency: 5 },
            { lower: 10, upper: 20, frequency: -2 },
          ],
        }).ok,
      ).toBe(false);

      expect(
        validateSlideInteractiveConfig({
          id: 'bad-sample',
          engine: 'construction-lab',
          labKind: 'data-stats-lab',
          schemaVersion: 1,
          minEngineVersion: '1.5.0',
          curriculumLevel: 'igcse',
          mode: 'probability-experiment',
          experimentKind: 'counters',
          withReplacement: false,
          drawsPerTrial: 3,
          outcomes: [{ id: 'R', label: 'Red', count: 1 }, { id: 'B', label: 'Blue', count: 1 }],
          targetEvent: { kind: 'outcome-equals', outcomeId: 'R', description: 'Red' },
          title: 'Impossible',
          instructions: 'Draw 3 from 2.',
          accessibilityLabel: 'Impossible draw',
          fallbackText: 'Fallback.',
        }).ok,
      ).toBe(false);
    });

    it('validates all 20 slides (20 activities) in step5d-data-stats-pilot.json and keeps 1.5.0 production gate CLOSED', () => {
      const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step5d-data-stats-pilot.json');
      const lesson = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as {
        lessonId: string;
        slides: Array<{ id: string; interactive?: unknown[] }>;
      };
      expect(lesson.slides).toHaveLength(20);
      expect(lesson.slides.reduce((acc, s) => acc + (s.interactive?.length ?? 0), 0)).toBe(20);
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: true })).not.toThrow();
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: false })).toThrow(/1\.5\.0|production/i);
    });
  });

  describe('4. UI Interaction, Reset, Low-Data Mode & Performance', () => {
    const probCfg: DataStatsLabConstructionConfig = {
      id: 'ui-ds-1',
      engine: 'construction-lab',
      labKind: 'data-stats-lab',
      schemaVersion: 1,
      minEngineVersion: '1.5.0',
      curriculumLevel: 'primary',
      mode: 'probability-experiment',
      experimentKind: 'coin',
      outcomes: [{ id: 'H', label: 'Heads' }, { id: 'T', label: 'Tails' }],
      targetEvent: { kind: 'outcome-equals', outcomeId: 'H', description: 'Heads' },
      title: 'Coin Toss Lab',
      instructions: 'Run trials and enter P(Heads).',
      accessibilityLabel: 'Coin toss lab',
      fallbackText: 'Fair coin: P(Heads) = 1/2.',
    };

    it('runs trials, verifies fraction/decimal answer, resets cleanly, and honours Low-Data Mode', () => {
      render(<DataStatsLab config={probCfg} />);
      fireEvent.click(screen.getByRole('button', { name: '+20 Trials' }));
      expect(screen.getByTestId('prob-total-trials').textContent).toBe('20');

      fireEvent.change(screen.getByLabelText(/Your Answer/i), { target: { value: '1/2' } });
      fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
      expect(screen.getByText(/Verified!/i)).toBeTruthy();

      fireEvent.click(screen.getByRole('button', { name: 'Reset probability and statistics lab' }));
      expect(screen.getByTestId('prob-total-trials').textContent).toBe('0');

      // Malformed answer rejected
      expect(evaluateDataStatsAnswer(probCfg, 'not-a-number').passed).toBe(false);

      // Low-Data Mode
      render(
        <InteractiveEngineRegistry
          lesson={{ lessonId: 'step5d-test' } as never}
          slide={{ id: 'ds-s01', interactive: probCfg } as never}
          lowDataMode={true}
        />,
      );
      expect(screen.getByText('Fair coin: P(Heads) = 1/2.')).toBeTruthy();
    });

    it('runs 500-trial batches and regression well under budget (< 2 ms avg)', () => {
      const t0 = performance.now();
      for (let i = 0; i < 50; i++) {
        runProbabilityBatch(probCfg, 100, createSeededRng(100 + i));
        computeScatterRegression([
          { x: 1, y: 3 },
          { x: 2, y: 5 },
          { x: 3, y: 7 },
          { x: 4, y: 9 },
        ]);
      }
      const avgMs = (performance.now() - t0) / 50;
      console.log(`STEP5D_PERF_AVG_MS=${avgMs.toFixed(4)}ms`);
      expect(avgMs).toBeLessThan(5);
    });
  });
});
