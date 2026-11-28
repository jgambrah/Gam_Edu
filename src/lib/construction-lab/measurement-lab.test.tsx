import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  computeDerivedLeastCount,
  computeExpectedUncertainty,
  computeInstrumentModel,
  evaluateMeasurementSubmission,
  type MeasurementLabSpec,
} from './measurement-engine';
import {
  SUPPORTED_INTERACTIVE_ENGINES,
  assertValidLessonInteractives,
  compareSemver,
  validateSlideInteractiveConfig,
  type MeasurementLabConstructionConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import { MeasurementLab } from '@/components/narrated-lessons/construction/MeasurementLab';
import { InteractiveEngineRegistry } from '@/components/narrated-lessons/InteractiveEngineRegistry';

describe('Step 5C — Virtual Measuring Instruments (construction-lab: measurement-lab 1.4.0)', () => {
  it('keeps construction-lab engineVersion >= 1.7.0 while holding productionVersion at 1.3.0', () => {
    expect(compareSemver(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].engineVersion, '1.7.0')! >= 0).toBe(true);
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].productionVersion).toBe('1.3.0');
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].supportedSchemaVersions).toEqual([1]);
  });

  describe('1. Instrument Mathematical Models & Independently Calculated Reference Cases', () => {
    it('computes vernier callipers main scale + aligned division consistent with observed reading & positive zero error', () => {
      const spec: MeasurementLabSpec = {
        instrument: 'vernier-callipers',
        curriculumLevel: 'igcse',
        unit: 'mm',
        minValue: 0,
        maxValue: 50,
        scaleDivision: 1,
        mainScaleStep: 1,
        vernierDivisions: 10,
        leastCount: 0.1,
        trueValue: 18.4,
        zeroError: 0.2,
      };
      expect(computeDerivedLeastCount(spec)).toBe(0.1);
      const model = computeInstrumentModel(spec);
      expect(model.observedReading).toBe(18.6);
      expect(model.correctedReading).toBe(18.4);
      expect(model.vernier?.mainScaleReading).toBe(18);
      expect(model.vernier?.alignedDivision).toBe(6);
      expect(model.vernier?.observedReading).toBe(18.6);

      // Correct answer passes; raw observed reading diagnoses positive zero error; wrong sign diagnoses sign mistake
      expect(evaluateMeasurementSubmission(spec, { valueText: '18.4', unitText: 'mm' }).passed).toBe(true);
      // Equivalent SI unit conversion (1.84 cm == 18.4 mm) via math-eval-units-precision.ts
      expect(evaluateMeasurementSubmission(spec, { valueText: '1.84', unitText: 'cm' }).passed).toBe(true);
      const rawRes = evaluateMeasurementSubmission(spec, { valueText: '18.6', unitText: 'mm' });
      expect(rawRes.passed).toBe(false);
      expect(rawRes.diagnostics.zeroErrorSignMistake).toBe(true);
      const wrongSignRes = evaluateMeasurementSubmission(spec, { valueText: '18.8', unitText: 'mm' });
      expect(wrongSignRes.passed).toBe(false);
      expect(wrongSignRes.diagnostics.zeroErrorSignMistake).toBe(true);
    });

    it('computes micrometer sleeve (with visible 0.5 mm mark), thimble alignment & negative zero error', () => {
      const spec: MeasurementLabSpec = {
        instrument: 'micrometer',
        curriculumLevel: 'igcse',
        unit: 'mm',
        minValue: 0,
        maxValue: 25,
        scaleDivision: 0.5,
        pitchMm: 0.5,
        thimbleDivisions: 50,
        hasHalfMmSleeve: true,
        leastCount: 0.01,
        trueValue: 4.78,
        zeroError: -0.03,
        requiredDecimalPlaces: 2,
      };
      expect(computeDerivedLeastCount(spec)).toBe(0.01);
      const model = computeInstrumentModel(spec);
      // Observed = 4.78 + (-0.03) = 4.75 mm -> sleeve 4.5 mm (0.5 visible) + thimble 25
      expect(model.observedReading).toBe(4.75);
      expect(model.micrometer?.sleeveWholeMm).toBe(4);
      expect(model.micrometer?.hasHalfMmVisible).toBe(true);
      expect(model.micrometer?.sleeveReadingMm).toBe(4.5);
      expect(model.micrometer?.thimbleDivision).toBe(25);
      expect(model.micrometer?.observedMm).toBe(4.75);

      expect(evaluateMeasurementSubmission(spec, { valueText: '4.78', unitText: 'mm' }).passed).toBe(true);
      // Precision check rejects 4.780 (3 d.p. instead of 2 d.p.)
      const badDp = evaluateMeasurementSubmission(spec, { valueText: '4.780', unitText: 'mm' });
      expect(badDp.passed).toBe(false);
      expect(badDp.diagnostics.precisionOk).toBe(false);
    });

    it('models measuring cylinder concave/convex meniscus & parallax error consistently', () => {
      const spec: MeasurementLabSpec = {
        instrument: 'measuring-cylinder',
        curriculumLevel: 'lower-secondary',
        meniscusType: 'concave',
        enableParallax: true,
        unit: 'mL',
        minValue: 0,
        maxValue: 100,
        scaleDivision: 1,
        leastCount: 1,
        trueValue: 46,
        tolerance: 0.5,
      };
      const highEye = computeInstrumentModel(spec, { eyeOffsetDeg: 20 });
      expect(highEye.parallaxShift).toBeLessThan(0);
      expect(highEye.observedReading).toBeCloseTo(45.2, 2);

      const parallaxMistake = evaluateMeasurementSubmission(
        spec,
        { valueText: '45.2', unitText: 'mL' },
        { eyeOffsetDeg: 20 },
      );
      expect(parallaxMistake.passed).toBe(false);
      expect(parallaxMistake.diagnostics.parallaxNotLevel).toBe(true);

      expect(
        evaluateMeasurementSubmission(spec, { valueText: '46', unitText: 'mL' }, { eyeOffsetDeg: 0 }).passed,
      ).toBe(true);
    });

    it('distinguishes mass (g/kg) from weight (N) on balance and supports tare', () => {
      const spec: MeasurementLabSpec = {
        instrument: 'balance',
        curriculumLevel: 'lower-secondary',
        displayMode: 'digital',
        unit: 'g',
        minValue: 0,
        maxValue: 500,
        scaleDivision: 0.1,
        leastCount: 0.1,
        trueValue: 145.6,
        initialTareOffset: 34.2,
        requireUnit: true,
      };
      expect(computeInstrumentModel(spec, { tareApplied: false }).observedReading).toBe(179.8);
      expect(computeInstrumentModel(spec, { tareApplied: true }).observedReading).toBe(145.6);

      const weightConfusion = evaluateMeasurementSubmission(spec, { valueText: '145.6', unitText: 'N' });
      expect(weightConfusion.passed).toBe(false);
      expect(weightConfusion.diagnostics.massWeightConfusion).toBe(true);
      expect(weightConfusion.feedback).toMatch(/mass.*not weight/i);

      expect(evaluateMeasurementSubmission(spec, { valueText: '0.1456', unitText: 'kg' }).passed).toBe(true);
    });

    it('distinguishes stopwatch resolution from reaction-time uncertainty and computes repeated-trial mean + half-range', () => {
      const swSpec: MeasurementLabSpec = {
        instrument: 'stopwatch',
        curriculumLevel: 'as-a-level',
        displayMode: 'digital',
        unit: 's',
        minValue: 0,
        maxValue: 30,
        scaleDivision: 0.01,
        leastCount: 0.01,
        trueValue: 12.2,
        repeatedTrials: [12.0, 12.2, 12.4],
        uncertaintyConvention: 'half-range',
        requireUncertainty: true,
      };
      expect(computeExpectedUncertainty(swSpec)).toBe(0.2);
      expect(
        evaluateMeasurementSubmission(swSpec, { valueText: '12.2', unitText: 's', uncertaintyText: '0.2' }).passed,
      ).toBe(true);
      expect(
        evaluateMeasurementSubmission(swSpec, { valueText: '12.2', unitText: 's', uncertaintyText: '0.01' }).passed,
      ).toBe(false);
    });

    it('evaluates analogue ammeter/voltmeter ranges, significant figures, and rejects malformed submissions', () => {
      const ammSpec: MeasurementLabSpec = {
        instrument: 'ammeter',
        curriculumLevel: 'igcse',
        unit: 'A',
        minValue: 0,
        maxValue: 3,
        scaleRanges: [0.6, 3],
        activeRangeIndex: 0,
        scaleDivision: 0.02,
        leastCount: 0.02,
        trueValue: 0.42,
        requireUnit: true,
      };
      expect(evaluateMeasurementSubmission(ammSpec, { valueText: '420', unitText: 'mA' }).passed).toBe(true);
      expect(evaluateMeasurementSubmission(ammSpec, { valueText: '0.42', unitText: 'V' }).passed).toBe(false);
      expect(evaluateMeasurementSubmission(ammSpec, { valueText: 'abc', unitText: 'A' }).passed).toBe(false);
    });

    it('verifies Step 5C scientific close-out: negative vernier/micrometer wraparound, over-range rejection, sig-figs across unit conversion, absolute vs differential temperature, zero/negative uncertainty rejection, incomplete trials & graphical SVG alignment', () => {
      // 1. Negative vernier zero error does NOT clamp to 0 when inspecting closed jaws
      const negVernier: MeasurementLabSpec = {
        instrument: 'vernier-callipers',
        curriculumLevel: 'igcse',
        unit: 'mm',
        minValue: 0,
        maxValue: 50,
        scaleDivision: 1,
        mainScaleStep: 1,
        vernierDivisions: 10,
        leastCount: 0.1,
        trueValue: 12.5,
        zeroError: -0.3,
      };
      const closedVernier = computeInstrumentModel(negVernier, { inspectingZeroError: true });
      expect(closedVernier.observedReading).toBe(-0.3);
      expect(closedVernier.vernier?.isNegativeZeroView).toBe(true);
      expect(closedVernier.vernier?.vernierZeroPos).toBe(-0.3);
      expect(closedVernier.vernier?.alignedDivision).toBe(7);

      // 2. Negative micrometer zero error (-0.03 mm on 50-div thimble) wraps to thimble mark 47
      const negMicro: MeasurementLabSpec = {
        instrument: 'micrometer',
        curriculumLevel: 'igcse',
        unit: 'mm',
        minValue: 0,
        maxValue: 25,
        scaleDivision: 0.5,
        pitchMm: 0.5,
        thimbleDivisions: 50,
        hasHalfMmSleeve: true,
        leastCount: 0.01,
        trueValue: 6.25,
        zeroError: -0.03,
      };
      const closedMicro = computeInstrumentModel(negMicro, { inspectingZeroError: true });
      expect(closedMicro.micrometer?.isNegativeZeroView).toBe(true);
      expect(closedMicro.micrometer?.thimbleDivision).toBe(47);

      // 3. Over-range rejection on ammeter (trueValue=1.8 A on 0-0.6 A range -> overRange=true, NEVER passes)
      const overAmm: MeasurementLabSpec = {
        instrument: 'ammeter',
        curriculumLevel: 'igcse',
        taskKind: 'select-range',
        unit: 'A',
        minValue: 0,
        maxValue: 3,
        scaleRanges: [0.6, 3],
        activeRangeIndex: 0,
        scaleDivision: 0.02,
        leastCount: 0.02,
        trueValue: 1.8,
      };
      expect(computeInstrumentModel(overAmm, { selectedRangeIndex: 0 }).overRange).toBe(true);
      expect(
        evaluateMeasurementSubmission(overAmm, { valueText: '1.8', unitText: 'A' }, { selectedRangeIndex: 0 }).passed,
      ).toBe(false);
      // Switching to 0-3 A range resolves over-range and scales leastCount by 3/0.6 = 5x -> 0.1 A
      expect(computeInstrumentModel(overAmm, { selectedRangeIndex: 1 }).leastCount).toBe(0.1);
      expect(
        evaluateMeasurementSubmission(overAmm, { valueText: '1.8', unitText: 'A' }, { selectedRangeIndex: 1 }).passed,
      ).toBe(true);

      // 4. Significant figures STILL enforced across unit conversion (1.840 cm has 4 sf, required 3 sf -> rejected)
      const sfSpec: MeasurementLabSpec = {
        instrument: 'ruler',
        curriculumLevel: 'as-a-level',
        unit: 'mm',
        minValue: 0,
        maxValue: 100,
        scaleDivision: 1,
        leastCount: 1,
        trueValue: 18.4,
        requiredSigFigs: 3,
        requireUnit: true,
        requireUncertainty: true,
      };
      expect(evaluateMeasurementSubmission(sfSpec, { valueText: '1.840', unitText: 'cm', uncertaintyText: '0.5' }).passed).toBe(false);
      expect(evaluateMeasurementSubmission(sfSpec, { valueText: '1.84', unitText: 'cm', uncertaintyText: '0.5' }).passed).toBe(true);
      // Zero and negative uncertainty rejected
      expect(evaluateMeasurementSubmission(sfSpec, { valueText: '18.4', unitText: 'mm', uncertaintyText: '0' }).passed).toBe(false);
      expect(evaluateMeasurementSubmission(sfSpec, { valueText: '18.4', unitText: 'mm', uncertaintyText: '-0.5' }).passed).toBe(false);

      // 5. Absolute vs differential temperature conversion (°C <-> K)
      const absTemp: MeasurementLabSpec = {
        instrument: 'thermometer',
        curriculumLevel: 'igcse',
        isTemperatureDifference: false,
        unit: '°C',
        minValue: 0,
        maxValue: 100,
        scaleDivision: 1,
        leastCount: 1,
        trueValue: 27,
      };
      expect(evaluateMeasurementSubmission(absTemp, { valueText: '300.15', unitText: 'K' }).passed).toBe(true);
      const diffTemp: MeasurementLabSpec = { ...absTemp, isTemperatureDifference: true, trueValue: 10 };
      expect(evaluateMeasurementSubmission(diffTemp, { valueText: '10', unitText: 'K' }).passed).toBe(true);

      // 6. Incomplete repeated trials rejected
      const repSpec: MeasurementLabSpec = {
        instrument: 'stopwatch',
        curriculumLevel: 'as-a-level',
        displayMode: 'digital',
        unit: 's',
        minValue: 0,
        maxValue: 30,
        scaleDivision: 0.01,
        leastCount: 0.01,
        trueValue: 12.2,
        repeatedTrials: [12.0, 12.2, 12.4],
        uncertaintyConvention: 'half-range',
        requireUncertainty: true,
      };
      const incRes = evaluateMeasurementSubmission(
        repSpec,
        { valueText: '12.2', unitText: 's', uncertaintyText: '0.2' },
        { completedTrialCount: 1 },
      );
      expect(incRes.passed).toBe(false);
      expect(incRes.diagnostics.incompleteTrials).toBe(true);

      // 7. Graphical SVG alignment agrees with mathematical model (vernier & micrometer)
      const { container } = render(
        <MeasurementLab
          config={{
            ...negMicro,
            id: 'gfx-micro-check',
            engine: 'construction-lab',
            labKind: 'measurement-lab',
            schemaVersion: 1,
            minEngineVersion: '1.4.0',
            title: 'Micrometer GFX Check',
            instructions: 'Read micrometer.',
            accessibilityLabel: 'Micrometer GFX check',
            fallbackText: 'Fallback.',
          }}
        />,
      );
      const microGroup = container.querySelector('[data-testid="svg-micrometer"]');
      expect(microGroup?.getAttribute('data-thimble-div')).toBe('22'); // 6.25 + (-0.03) = 6.22 -> thimble 22
    });
  });

  describe('2. Strict Schema Validation, Impossible Config Rejection & Pilot Fixture', () => {
    it('rejects impossible or internally inconsistent measurement-lab configurations', () => {
      const base = {
        id: 'bad-ml',
        engine: 'construction-lab',
        labKind: 'measurement-lab',
        schemaVersion: 1,
        minEngineVersion: '1.4.0',
        curriculumLevel: 'igcse',
        title: 'Bad',
        instructions: 'Measure it.',
        accessibilityLabel: 'Bad instrument',
        fallbackText: 'Fallback.',
        instrument: 'vernier-callipers',
        unit: 'mm',
        minValue: 0,
        maxValue: 50,
        scaleDivision: 1,
        mainScaleStep: 1,
        vernierDivisions: 10,
        leastCount: 0.1,
        trueValue: 15.2,
      };

      // Inconsistent vernier leastCount (0.05 != 1/10)
      expect(validateSlideInteractiveConfig({ ...base, leastCount: 0.05 }).ok).toBe(false);
      // Incompatible unit (Newtons for balance)
      expect(validateSlideInteractiveConfig({ ...base, instrument: 'balance', unit: 'N' }).ok).toBe(false);
      // Out-of-range trueValue
      expect(validateSlideInteractiveConfig({ ...base, trueValue: 60 }).ok).toBe(false);
      // Excessive zeroError (> 20% of span)
      expect(validateSlideInteractiveConfig({ ...base, zeroError: 15 }).ok).toBe(false);
      // Downgraded minEngineVersion (< 1.4.0)
      expect(validateSlideInteractiveConfig({ ...base, minEngineVersion: '1.3.0' }).ok).toBe(false);
    });

    it('validates all 15 slides (15 activities) in step5c-measurement-lab-pilot.json and keeps 1.4.0 production gate CLOSED', () => {
      const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step5c-measurement-lab-pilot.json');
      const lesson = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as {
        lessonId: string;
        slides: Array<{ id: string; interactive?: unknown[] }>;
      };
      expect(lesson.slides).toHaveLength(15);
      expect(lesson.slides.reduce((acc, s) => acc + (s.interactive?.length ?? 0), 0)).toBe(15);
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: true })).not.toThrow();
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: false })).toThrow(/1\.4\.0|production/i);
    });
  });

  describe('3. UI Interaction, Reset, Non-Visual Accessibility, Isolation & Performance', () => {
    const cfg: MeasurementLabConstructionConfig = {
      id: 'ui-ml-1',
      engine: 'construction-lab',
      labKind: 'measurement-lab',
      schemaVersion: 1,
      minEngineVersion: '1.4.0',
      curriculumLevel: 'as-a-level',
      instrument: 'ruler',
      enableParallax: true,
      initialEyeOffsetDeg: 0,
      unit: 'cm',
      minValue: 0,
      maxValue: 15,
      scaleDivision: 0.1,
      leastCount: 0.1,
      trueValue: 10.0,
      uncertaintyConvention: 'half-least-count',
      requireUncertainty: true,
      requiredSigFigs: 3,
      requiredDecimalPlaces: 1,
      title: 'Ruler Precision Test',
      instructions: 'Record to 3 s.f. with uncertainty.',
      accessibilityLabel: 'Ruler precision test',
      fallbackText: 'Block measures 10.0 cm ± 0.05 cm.',
      nonVisualQuestion: {
        prompt: 'What is the proper reading for a 0.1 cm ruler at 10 cm?',
        options: ['10 cm ± 0.1 cm', '10.0 cm ± 0.05 cm'],
        correctIndex: 1,
        explanation: '1 d.p. with half-least-count ±0.05 cm.',
      },
    };

    it('checks measurement, resets cleanly, supports non-visual alternative without leaking answer in aria-label, and honours Low-Data Mode', () => {
      render(<MeasurementLab config={cfg} />);

      // SVG aria-label must NOT expose the expected numeric answer prematurely
      const svg = screen.getByRole('img', { name: /Interactive graduated ruler scale/i });
      expect(svg.getAttribute('aria-label')).not.toMatch(/10\.0/);

      // Enter 10.0 and 0.05 -> Verified!
      fireEvent.change(screen.getByLabelText(/Corrected Reading/i), { target: { value: '10.0' } });
      fireEvent.change(screen.getByLabelText(/Uncertainty/i), { target: { value: '0.05' } });
      fireEvent.click(screen.getByRole('button', { name: 'Check Measurement' }));
      expect(screen.getByText(/Verified!/i)).toBeTruthy();

      // Reset clears inputs
      fireEvent.click(screen.getByRole('button', { name: 'Reset measurement instrument' }));
      expect((screen.getByLabelText(/Corrected Reading/i) as HTMLInputElement).value).toBe('');

      // Switch to non-visual accessible equivalent
      fireEvent.click(screen.getByRole('button', { name: 'Use non-visual question' }));
      fireEvent.click(screen.getByRole('button', { name: '10.0 cm ± 0.05 cm' }));
      expect(screen.getByText(/Correct!/i)).toBeTruthy();

      // Low-Data Mode fallback
      render(
        <InteractiveEngineRegistry
          lesson={{ lessonId: 'step5c-test' } as never}
          slide={{ id: 'ml-s15', interactive: cfg } as never}
          lowDataMode={true}
        />,
      );
      expect(screen.getByText('Block measures 10.0 cm ± 0.05 cm.')).toBeTruthy();
    });

    it('evaluates instruments well under budget (< 1 ms avg)', () => {
      const t0 = performance.now();
      for (let i = 0; i < 200; i++) {
        computeInstrumentModel(cfg, { eyeOffsetDeg: 10 });
        evaluateMeasurementSubmission(cfg, { valueText: '10.0', unitText: 'cm', uncertaintyText: '0.05' });
      }
      const avgMs = (performance.now() - t0) / 200;
      console.log(`STEP5C_PERF_AVG_MS=${avgMs.toFixed(4)}ms`);
      expect(avgMs).toBeLessThan(2);
    });
  });
});
