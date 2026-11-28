import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  areFractionsEquivalent,
  computeClockHandAngles,
  computeMinimumGhanaPieces,
  evaluateAnalogueClock,
  evaluateArraysGrouping,
  evaluateBaseTen,
  evaluateFractionsDecimals,
  evaluateGhanaMoney,
  evaluateNumberBond,
  evaluateNumberLine,
  evaluatePattern,
  evaluateTenFrame,
  formatGhanaPesewas,
  formatTime12h,
  formatTime24h,
  improperToMixed,
  regroupBaseTen,
} from './number-manipulative-engine';
import {
  SUPPORTED_INTERACTIVE_ENGINES,
  assertValidLessonInteractives,
  type NumberManipulativeConstructionConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import { NumberManipulativeLab } from '@/components/narrated-lessons/construction/NumberManipulativeLab';

describe('Step 5F — Primary Number Manipulatives (construction-lab: number-manipulative 1.7.0)', () => {
  it('keeps construction-lab engineVersion >= 1.7.0 while holding productionVersion at 1.3.0', () => {
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].engineVersion >= '1.7.0').toBe(true);
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].productionVersion).toBe('1.3.0');
  });

  describe('1. Pure Mathematical Correctness Across All CPA Primary Manipulatives', () => {
    it('evaluates Base-Ten canonical AND non-canonical regrouping + bidirectional exchanges', () => {
      const nonCanon = { thousands: 0, hundreds: 1, tens: 2, ones: 14 }; // = 134
      expect(
        evaluateBaseTen({ mode: 'base-ten-place-value', maxPlace: 'hundreds', targetNumber: 134 }, nonCanon).passed,
      ).toBe(true);
      expect(
        evaluateBaseTen(
          { mode: 'base-ten-place-value', maxPlace: 'hundreds', targetNumber: 134, requireCanonical: true },
          nonCanon,
        ).passed,
      ).toBe(false);

      const regrouped = regroupBaseTen(nonCanon, 'ones-to-ten');
      expect(regrouped).toEqual({ thousands: 0, hundreds: 1, tens: 3, ones: 4 });
      expect(
        evaluateBaseTen(
          { mode: 'base-ten-place-value', maxPlace: 'hundreds', targetNumber: 134, requireCanonical: true },
          regrouped!,
        ).passed,
      ).toBe(true);
      // Reverse exchange preserves total value
      expect(regroupBaseTen(regrouped!, 'ten-to-ones')).toEqual(nonCanon);
    });

    it('computes exact Ghanaian currency in integer pesewas (zero float drift) + change + minimum coins', () => {
      expect(formatGhanaPesewas(650)).toBe('GH₵6.50');
      expect(formatGhanaPesewas(50)).toBe('50 Gp');
      expect(computeMinimumGhanaPieces(770, ['10p', '20p', '50p', '1c', '2c', '5c'])).toBe(4);

      const minSpec = {
        mode: 'ghana-money' as const,
        taskKind: 'minimum-coins' as const,
        allowedDenomIds: ['10p', '20p', '50p', '1c', '2c', '5c'],
        targetPesewas: 770,
      };
      // Optimal 4 pieces: 5c + 2c + 50p + 20p = 770p
      expect(evaluateGhanaMoney(minSpec, { '5c': 1, '2c': 1, '50p': 1, '20p': 1 }).passed).toBe(true);
      // Non-optimal 8 pieces (7x 1c + 50p + 20p) -> rejected by minimum-coins check
      expect(evaluateGhanaMoney(minSpec, { '1c': 7, '50p': 1, '20p': 1 }).passed).toBe(false);
    });

    it('models continuous analogue clock hour-hand kinematics accurately (3:30 -> 105°, 6:15 -> 187.5°)', () => {
      expect(computeClockHandAngles(3, 30)).toEqual({ hourAngleDeg: 105, minuteAngleDeg: 180 });
      expect(computeClockHandAngles(6, 15)).toEqual({ hourAngleDeg: 187.5, minuteAngleDeg: 90 });
      expect(computeClockHandAngles(12, 0)).toEqual({ hourAngleDeg: 0, minuteAngleDeg: 0 });
      expect(formatTime12h(13 * 60 + 45)).toBe('1:45 PM');
      expect(formatTime24h(13 * 60 + 45)).toBe('13:45');

      expect(
        evaluateAnalogueClock(
          { mode: 'analogue-clock', taskKind: 'elapsed-time', startHours: 8, startMinutes: 15, targetHours: 9, targetMinutes: 45 },
          9 * 60 + 45,
        ).passed,
      ).toBe(true);
    });

    it('verifies exact rational fractions, mixed/improper conversion, decimal place value, division remainders, bonds, ten frames, number line, and patterns', () => {
      expect(areFractionsEquivalent({ n: 2, d: 3 }, { n: 4, d: 6 })).toBe(true);
      expect(improperToMixed(7, 4)).toEqual({ whole: 1, remNum: 3, den: 4 });
      expect(
        evaluateFractionsDecimals(
          { mode: 'fractions-decimals', representation: 'fraction-bar', targetNumerator: 2, targetDenominator: 3 },
          { numerator: 4, denominator: 6 },
        ).passed,
      ).toBe(true);
      expect(
        evaluateFractionsDecimals(
          { mode: 'fractions-decimals', representation: 'decimal-place-value', targetHundredths: 235 },
          { ones: 2, tenths: 3, hundredths: 5 },
        ).passed,
      ).toBe(true);

      // Division with remainder strictly enforces 0 <= remainder < divisor
      const divSpec = { mode: 'arrays-grouping' as const, taskKind: 'division-remainder' as const, targetTotal: 17, divisorOrFactor: 5 };
      expect(evaluateArraysGrouping(divSpec, { groupSize: 3, remainder: 2 }).passed).toBe(true);
      expect(evaluateArraysGrouping(divSpec, { groupSize: 2, remainder: 7 }).passed).toBe(false);

      expect(evaluateTenFrame({ mode: 'counting-ten-frame', frameCount: 2, targetCount: 13, twoColorSplit: { firstColorTarget: 8, secondColorTarget: 5 } }, 8, 5).passed).toBe(true);
      expect(evaluateNumberBond({ mode: 'number-bonds', whole: 10, knownParts: [6], missingRole: 'part', expectedValue: 4 }, 4).passed).toBe(true);
      expect(evaluateNumberLine({ mode: 'number-line', min: 0, max: 50, step: 1, startValue: 14, targetValue: 37 }, 37).passed).toBe(true);
      expect(evaluatePattern({ mode: 'patterns', patternKind: 'growing', givenSequence: ['4', '7', '10'], expectedNext: ['13', '16'], palette: ['12', '13', '16'] }, ['13', '16']).passed).toBe(true);
    });
  });

  describe('2. Pilot Fixture Validation, Production Gate & Interactive Child-Friendly UI (>=48px targets)', () => {
    it('validates all 18 slides in step5f-number-manipulatives-pilot.json and keeps 1.7.0 production gate CLOSED', () => {
      const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step5f-number-manipulatives-pilot.json');
      const lesson = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as {
        lessonId: string;
        slides: Array<{ id: string; interactive?: unknown[] }>;
      };
      expect(lesson.slides).toHaveLength(18);
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: true })).not.toThrow();
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: false })).toThrow(/1\.7\.0|production/i);
    });

    it('supports interactive learner actions on Ghanaian Money, Analogue Clock, and Base-Ten Regrouping UI with >=48px targets', () => {
      const moneyCfg: NumberManipulativeConstructionConfig = {
        id: 'ui-money-1',
        engine: 'construction-lab',
        labKind: 'number-manipulative',
        mode: 'ghana-money',
        schemaVersion: 1,
        minEngineVersion: '1.7.0',
        title: 'Makola Change',
        instructions: 'Make GH₵6.50 change.',
        accessibilityLabel: 'Ghanaian money tray',
        fallbackText: 'GH₵5 + GH₵1 + 50 Gp = GH₵6.50.',
        taskKind: 'make-change',
        allowedDenomIds: ['50p', '1c', '5c'],
        costPesewas: 1350,
        paidPesewas: 2000,
      };
      const { unmount } = render(<NumberManipulativeLab config={moneyCfg} />);
      const add5c = screen.getByRole('button', { name: 'Add GH₵5' });
      expect(add5c.className).toContain('min-h-[48px]');
      fireEvent.click(add5c);
      fireEvent.click(screen.getByRole('button', { name: 'Add GH₵1' }));
      fireEvent.click(screen.getByRole('button', { name: 'Add 50 Gp' }));
      fireEvent.click(screen.getByRole('button', { name: /Check/i }));
      expect(screen.getByText(/Verified! GH₵6\.50/i)).toBeTruthy();
      unmount();

      const clockCfg: NumberManipulativeConstructionConfig = {
        id: 'ui-clock-1',
        engine: 'construction-lab',
        labKind: 'number-manipulative',
        mode: 'analogue-clock',
        schemaVersion: 1,
        minEngineVersion: '1.7.0',
        title: 'Clock Test',
        instructions: 'Advance 1 hr 15 min from 8:15.',
        accessibilityLabel: 'Analogue clock',
        fallbackText: '9:30 AM.',
        taskKind: 'elapsed-time',
        startHours: 8,
        startMinutes: 15,
        targetHours: 9,
        targetMinutes: 30,
        minuteStep: 15,
      };
      render(<NumberManipulativeLab config={clockCfg} />);
      fireEvent.click(screen.getByRole('button', { name: '+1 hr' }));
      fireEvent.click(screen.getByRole('button', { name: '+15 min' }));
      fireEvent.click(screen.getByRole('button', { name: /Check/i }));
      expect(screen.getByText(/Spot on! Clock set accurately to 9:30 AM/i)).toBeTruthy();
    });
  });
});
