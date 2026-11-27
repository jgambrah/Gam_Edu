/**
 * GAM EDU — Step 5C Pure TypeScript Engine: Virtual Measuring Instruments
 * (`construction-lab`, `labKind: 'measurement-lab'`, `engineVersion: '1.4.0'`)
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies, zero eval().
 * Reuses `math-eval-units-precision.ts` for exact SI unit parsing, dimensional
 * compatibility, unit conversion, significant figures, and decimal places.
 *
 * Supported Instruments (9 bounded models + analogue/digital display modes):
 *  1. ruler                (cm / mm, object positioning, parallax, zero offset)
 *  2. vernier-callipers    (mm / cm, main scale + aligned vernier division, signed zero error)
 *  3. micrometer           (mm, sleeve with optional 0.5 mm ticks + thimble, signed zero error)
 *  4. measuring-cylinder   (mL / cm^3, concave/convex/flat meniscus, eye-level parallax)
 *  5. thermometer          (°C / K, liquid column, parallax)
 *  6. balance              (g / kg, mass vs weight distinction, tare/zero adjustment)
 *  7. stopwatch            (s, instrument resolution vs human reaction-time uncertainty, deterministic trials)
 *  8. ammeter              (A / mA, selectable scale ranges, current)
 *  9. voltmeter            (V / mV, selectable scale ranges, potential difference)
 */

import {
  convertToBaseSI,
  dimensionsEqual,
  inspectRawNumericPrecision,
  parseUnitExpression,
  type DimVec,
} from '@/lib/math-evaluator/math-eval-units-precision';

export type MeasurementInstrumentKind =
  | 'ruler'
  | 'vernier-callipers'
  | 'micrometer'
  | 'measuring-cylinder'
  | 'thermometer'
  | 'balance'
  | 'stopwatch'
  | 'ammeter'
  | 'voltmeter';

export type MeasurementDisplayMode = 'analogue' | 'digital';
export type MeniscusType = 'concave' | 'convex' | 'flat';
export type UncertaintyConvention =
  | 'half-least-count'
  | 'one-least-count'
  | 'half-range'
  | 'reaction-time';

export const MEASUREMENT_LAB_LIMITS = {
  maxDivisions: 500,
  minDivisions: 4,
  maxRepeatedTrials: 6,
  maxScaleRanges: 4,
  maxEyeOffsetDeg: 30,
} as const;

export const INSTRUMENT_DIMENSIONS: Record<MeasurementInstrumentKind, DimVec> = {
  ruler: [0, 1, 0, 0, 0, 0, 0],
  'vernier-callipers': [0, 1, 0, 0, 0, 0, 0],
  micrometer: [0, 1, 0, 0, 0, 0, 0],
  'measuring-cylinder': [0, 3, 0, 0, 0, 0, 0],
  thermometer: [0, 0, 0, 0, 1, 0, 0],
  balance: [1, 0, 0, 0, 0, 0, 0],
  stopwatch: [0, 0, 1, 0, 0, 0, 0],
  ammeter: [0, 0, 0, 1, 0, 0, 0],
  voltmeter: [1, 2, -3, -1, 0, 0, 0],
};

export interface NonVisualMeasurementQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface MeasurementLabSpec {
  instrument: MeasurementInstrumentKind;
  curriculumLevel: 'primary' | 'lower-secondary' | 'igcse' | 'as-a-level';
  learningMode?: 'guided' | 'practice';
  displayMode?: MeasurementDisplayMode;
  unit: string;
  minValue: number;
  maxValue: number;
  scaleDivision: number;
  /** Instrument least count / resolution in `unit`. For vernier/micrometer must match derived least count. */
  leastCount: number;
  /** True physical quantity of the simulated object/sample in `unit`. */
  trueValue: number;
  /** Signed zero error in `unit` (positive = reads too high at zero; corrected = observed - zeroError). */
  zeroError?: number;
  /** Vernier callipers specifics */
  mainScaleStep?: number;
  vernierDivisions?: number;
  /** Micrometer screw gauge specifics */
  pitchMm?: number;
  thimbleDivisions?: number;
  hasHalfMmSleeve?: boolean;
  /** Measuring cylinder specifics */
  meniscusType?: MeniscusType;
  liquidName?: string;
  /** Balance specifics */
  initialTareOffset?: number;
  /** Stopwatch specifics */
  reactionTimeUncertainty?: number;
  /** Electrical instruments specifics */
  scaleRanges?: number[];
  activeRangeIndex?: number;
  /** Parallax demonstration support */
  enableParallax?: boolean;
  initialEyeOffsetDeg?: number;
  /** Repeated measurements (deterministic trial set in `unit`) */
  repeatedTrials?: number[];
  /** Assessment expectations */
  uncertaintyConvention?: UncertaintyConvention;
  requireUncertainty?: boolean;
  requireUnit?: boolean;
  requiredSigFigs?: number;
  requiredDecimalPlaces?: number;
  tolerance?: number;
  /** Optional object label for contextual Ghana / Cambridge realism */
  objectLabel?: string;
  /** Accessible nonvisual equivalent question (never exposes answer prematurely) */
  nonVisualQuestion?: NonVisualMeasurementQuestion;
}

export interface MeasurementInteractiveState {
  /** Adjustable jaw/thimble/object reading position in `unit` (for interactive exploration) */
  sliderValue: number;
  /** Eye vertical/horizontal offset angle in degrees (-30..+30; 0 = level, no parallax) */
  eyeOffsetDeg: number;
  /** Whether balance tare has been applied */
  tareApplied: boolean;
  /** Selected range index for ammeter / voltmeter */
  selectedRangeIndex: number;
  /** Whether learner is inspecting closed-jaws zero error */
  inspectingZeroError: boolean;
}

export interface VernierBreakdown {
  mainScaleReading: number;
  alignedDivision: number;
  leastCount: number;
  observedReading: number;
}

export interface MicrometerBreakdown {
  sleeveWholeMm: number;
  hasHalfMmVisible: boolean;
  sleeveReadingMm: number;
  thimbleDivision: number;
  leastCountMm: number;
  observedMm: number;
}

export interface InstrumentModelOutput {
  trueValue: number;
  zeroError: number;
  parallaxShift: number;
  tareOffset: number;
  observedReading: number;
  correctedReading: number;
  leastCount: number;
  expectedUncertainty: number;
  activeMaxRange: number;
  vernier?: VernierBreakdown;
  micrometer?: MicrometerBreakdown;
}

export function roundClean(v: number, decimals = 6): number {
  const f = Math.pow(10, decimals);
  return Math.round((v + Number.EPSILON) * f) / f;
}

export function computeDerivedLeastCount(spec: MeasurementLabSpec): number {
  if (spec.instrument === 'vernier-callipers' && spec.mainScaleStep && spec.vernierDivisions) {
    return roundClean(spec.mainScaleStep / spec.vernierDivisions, 6);
  }
  if (spec.instrument === 'micrometer' && spec.pitchMm && spec.thimbleDivisions) {
    return roundClean(spec.pitchMm / spec.thimbleDivisions, 6);
  }
  return spec.leastCount;
}

export function computeExpectedUncertainty(
  spec: MeasurementLabSpec,
  readings?: ReadonlyArray<number>,
): number {
  const lc = computeDerivedLeastCount(spec);
  const conv =
    spec.uncertaintyConvention ??
    (spec.instrument === 'stopwatch'
      ? 'reaction-time'
      : spec.displayMode === 'digital'
        ? 'one-least-count'
        : 'half-least-count');

  if (conv === 'reaction-time') {
    return roundClean(spec.reactionTimeUncertainty ?? 0.2, 6);
  }
  if (conv === 'one-least-count') {
    return roundClean(lc, 6);
  }
  if (conv === 'half-range') {
    const arr = readings && readings.length >= 2 ? readings : spec.repeatedTrials ?? [];
    if (arr.length >= 2) {
      const spread = (Math.max(...arr) - Math.min(...arr)) / 2;
      return roundClean(Math.max(spread, lc / 2), 6);
    }
    return roundClean(lc / 2, 6);
  }
  return roundClean(lc / 2, 6);
}

/**
 * Computes the exact deterministic physical/graphical instrument model so that
 * rendered SVG scales (vernier alignment, micrometer sleeve+thimble, meniscus
 * height, needle angle) agree identically with the numerical grading model.
 */
export function computeInstrumentModel(
  spec: MeasurementLabSpec,
  state?: Partial<MeasurementInteractiveState>,
): InstrumentModelOutput {
  const zeroError = spec.zeroError ?? 0;
  const lc = computeDerivedLeastCount(spec);
  const eyeDeg = spec.enableParallax ? (state?.eyeOffsetDeg ?? spec.initialEyeOffsetDeg ?? 0) : 0;
  const activeRangeIdx = state?.selectedRangeIndex ?? spec.activeRangeIndex ?? 0;
  const activeMaxRange =
    spec.scaleRanges && spec.scaleRanges[activeRangeIdx] !== undefined
      ? spec.scaleRanges[activeRangeIdx]
      : spec.maxValue;

  // Deterministic parallax model: viewing from above (+deg) shifts apparent reading down on vertical cylinder/thermometer
  const parallaxScale =
    spec.instrument === 'measuring-cylinder' || spec.instrument === 'thermometer'
      ? -0.04 * spec.scaleDivision * eyeDeg
      : spec.instrument === 'ruler' || spec.instrument === 'ammeter' || spec.instrument === 'voltmeter'
        ? 0.03 * spec.scaleDivision * eyeDeg
        : 0;
  const parallaxShift = roundClean(parallaxScale, 4);

  const tareOffset =
    spec.instrument === 'balance' && !(state?.tareApplied ?? false)
      ? (spec.initialTareOffset ?? 0)
      : 0;

  const baseReading = state?.inspectingZeroError ? 0 : spec.trueValue;
  const rawObserved = roundClean(baseReading + zeroError + tareOffset + parallaxShift, 6);
  const corrected = roundClean(rawObserved - zeroError - tareOffset, 6);

  let vernier: VernierBreakdown | undefined;
  if (spec.instrument === 'vernier-callipers') {
    const mainStep = spec.mainScaleStep ?? 1;
    const vDivs = spec.vernierDivisions ?? 10;
    const clampedObs = Math.max(0, rawObserved);
    const totalSubSteps = Math.round(clampedObs / lc);
    const mainSteps = Math.floor(totalSubSteps / vDivs);
    const alignedDivision = totalSubSteps % vDivs;
    const mainScaleReading = roundClean(mainSteps * mainStep, 6);
    vernier = {
      mainScaleReading,
      alignedDivision,
      leastCount: lc,
      observedReading: roundClean(mainScaleReading + alignedDivision * lc, 6),
    };
  }

  let micrometer: MicrometerBreakdown | undefined;
  if (spec.instrument === 'micrometer') {
    const pitch = spec.pitchMm ?? 0.5;
    const tDivs = spec.thimbleDivisions ?? 50;
    const clampedObs = Math.max(0, rawObserved);
    const totalTicks = Math.round(clampedObs / lc);
    const fullPitches = Math.floor(totalTicks / tDivs);
    const thimbleDivision = totalTicks % tDivs;
    const sleeveReadingMm = roundClean(fullPitches * pitch, 6);
    const sleeveWholeMm = Math.floor(sleeveReadingMm + 1e-9);
    const hasHalfMmVisible =
      (spec.hasHalfMmSleeve ?? pitch === 0.5) && sleeveReadingMm - sleeveWholeMm >= 0.49;
    micrometer = {
      sleeveWholeMm,
      hasHalfMmVisible,
      sleeveReadingMm,
      thimbleDivision,
      leastCountMm: lc,
      observedMm: roundClean(sleeveReadingMm + thimbleDivision * lc, 6),
    };
  }

  return {
    trueValue: spec.trueValue,
    zeroError,
    parallaxShift,
    tareOffset,
    observedReading: rawObserved,
    correctedReading: corrected,
    leastCount: lc,
    expectedUncertainty: computeExpectedUncertainty(spec),
    activeMaxRange,
    vernier,
    micrometer,
  };
}

export interface MeasurementSubmission {
  valueText: string;
  unitText?: string;
  uncertaintyText?: string;
  /** Optional learner-entered mean for repeatedTrials activities */
  meanText?: string;
}

export interface MeasurementEvalResult {
  passed: boolean;
  feedback: string;
  diagnostics: {
    numericOk: boolean;
    unitOk: boolean;
    precisionOk: boolean;
    uncertaintyOk: boolean;
    zeroErrorSignMistake: boolean;
    massWeightConfusion: boolean;
    parallaxNotLevel: boolean;
  };
  expectedValue: number;
  expectedUnit: string;
  expectedUncertainty: number;
}

const NUMERIC_RE = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

export function evaluateMeasurementSubmission(
  spec: MeasurementLabSpec,
  submission: MeasurementSubmission,
  state?: Partial<MeasurementInteractiveState>,
): MeasurementEvalResult {
  const model = computeInstrumentModel(spec, state);
  const expectedVal =
    spec.repeatedTrials && spec.repeatedTrials.length >= 2
      ? roundClean(
          spec.repeatedTrials.reduce((a, b) => a + b, 0) / spec.repeatedTrials.length,
          6,
        )
      : spec.trueValue;

  const expectedUnc = computeExpectedUncertainty(spec, spec.repeatedTrials);
  const tol = spec.tolerance ?? Math.max(model.leastCount * 0.5001, 1e-6);

  const diag = {
    numericOk: false,
    unitOk: true,
    precisionOk: true,
    uncertaintyOk: true,
    zeroErrorSignMistake: false,
    massWeightConfusion: false,
    parallaxNotLevel: Boolean(spec.enableParallax && Math.abs(state?.eyeOffsetDeg ?? 0) > 1),
  };

  if (!submission || typeof submission.valueText !== 'string') {
    return {
      passed: false,
      feedback: 'Malformed submission: please enter a numerical measurement.',
      diagnostics: diag,
      expectedValue: expectedVal,
      expectedUnit: spec.unit,
      expectedUncertainty: expectedUnc,
    };
  }

  const rawNumStr = submission.valueText.trim();
  if (!NUMERIC_RE.test(rawNumStr)) {
    return {
      passed: false,
      feedback: 'Enter a valid number (for example 12.4 or 0.35).',
      diagnostics: diag,
      expectedValue: expectedVal,
      expectedUnit: spec.unit,
      expectedUncertainty: expectedUnc,
    };
  }
  const learnerNum = Number(rawNumStr);
  if (!Number.isFinite(learnerNum)) {
    return {
      passed: false,
      feedback: 'Measurement value must be a finite number.',
      diagnostics: diag,
      expectedValue: expectedVal,
      expectedUnit: spec.unit,
      expectedUncertainty: expectedUnc,
    };
  }

  // Unit parsing & conversion via existing math-eval-units-precision.ts
  let learnerInSpecUnit = learnerNum;
  const expectedUnitParsed = parseUnitExpression(spec.unit);
  const rawUnit = (submission.unitText ?? '').trim();

  if (spec.requireUnit && !rawUnit) {
    diag.unitOk = false;
    return {
      passed: false,
      feedback: `Include the measurement unit (for example ${spec.unit}).`,
      diagnostics: diag,
      expectedValue: expectedVal,
      expectedUnit: spec.unit,
      expectedUncertainty: expectedUnc,
    };
  }

  if (rawUnit) {
    try {
      const learnerUnitParsed = parseUnitExpression(rawUnit);
      if (!dimensionsEqual(learnerUnitParsed.dim, expectedUnitParsed.dim)) {
        diag.unitOk = false;
        // Detect classic mass vs weight confusion (N vs g/kg) on balance
        const isForceDim = dimensionsEqual(learnerUnitParsed.dim, [1, 1, -2, 0, 0, 0, 0]);
        if (spec.instrument === 'balance' && isForceDim) {
          diag.massWeightConfusion = true;
          return {
            passed: false,
            feedback: `A laboratory balance measures mass (${spec.unit}), not weight (Newtons, N). Mass is in g or kg; weight is a force in N.`,
            diagnostics: diag,
            expectedValue: expectedVal,
            expectedUnit: spec.unit,
            expectedUncertainty: expectedUnc,
          };
        }
        return {
          passed: false,
          feedback: `Unit "${rawUnit}" does not match the physical quantity measured by this ${spec.instrument} (expected a unit compatible with ${spec.unit}).`,
          diagnostics: diag,
          expectedValue: expectedVal,
          expectedUnit: spec.unit,
          expectedUncertainty: expectedUnc,
        };
      }
      // Convert learner value into spec.unit using base SI
      const learnerBase = convertToBaseSI(learnerNum, learnerUnitParsed);
      learnerInSpecUnit = roundClean(
        (learnerBase - expectedUnitParsed.offsetK) / expectedUnitParsed.scale,
        6,
      );
    } catch {
      diag.unitOk = false;
      return {
        passed: false,
        feedback: `Unrecognised unit "${rawUnit}". Try standard SI notation such as ${spec.unit}.`,
        diagnostics: diag,
        expectedValue: expectedVal,
        expectedUnit: spec.unit,
        expectedUncertainty: expectedUnc,
      };
    }
  }

  // Numeric comparison & misconception diagnosis
  const diff = Math.abs(learnerInSpecUnit - expectedVal);
  if (diff <= tol) {
    diag.numericOk = true;
  } else {
    const zErr = spec.zeroError ?? 0;
    if (zErr !== 0) {
      // Check if learner forgot to correct zero error OR applied the wrong sign
      const uncorrectedVal = roundClean(expectedVal + zErr, 6);
      const wrongSignVal = roundClean(expectedVal + 2 * zErr, 6);
      if (Math.abs(learnerInSpecUnit - uncorrectedVal) <= tol) {
        diag.zeroErrorSignMistake = true;
        return {
          passed: false,
          feedback: `You entered the raw observed reading (${uncorrectedVal} ${spec.unit}) without correcting for the ${zErr > 0 ? 'positive' : 'negative'} zero error (${zErr > 0 ? '+' : ''}${zErr} ${spec.unit}). Remember: Corrected = Observed − Zero Error.`,
          diagnostics: diag,
          expectedValue: expectedVal,
          expectedUnit: spec.unit,
          expectedUncertainty: expectedUnc,
        };
      }
      if (Math.abs(learnerInSpecUnit - wrongSignVal) <= tol) {
        diag.zeroErrorSignMistake = true;
        return {
          passed: false,
          feedback: `Zero-error sign mistake: for a ${zErr > 0 ? 'positive' : 'negative'} zero error (${zErr > 0 ? '+' : ''}${zErr} ${spec.unit}), subtract the signed zero error (Corrected = Observed − Zero Error).`,
          diagnostics: diag,
          expectedValue: expectedVal,
          expectedUnit: spec.unit,
          expectedUncertainty: expectedUnc,
        };
      }
    }

    if (diag.parallaxNotLevel && Math.abs(learnerInSpecUnit - model.observedReading) <= tol) {
      return {
        passed: false,
        feedback: 'Your reading includes a parallax error! Move the eye-position slider to 0° (level with the scale/meniscus) before reading.',
        diagnostics: diag,
        expectedValue: expectedVal,
        expectedUnit: spec.unit,
        expectedUncertainty: expectedUnc,
      };
    }

    return {
      passed: false,
      feedback: `Reading ${learnerNum} ${rawUnit || spec.unit} is outside the accepted tolerance (±${tol} ${spec.unit}). Check the main scale, smallest division (${model.leastCount} ${spec.unit}), and any zero error.`,
      diagnostics: diag,
      expectedValue: expectedVal,
      expectedUnit: spec.unit,
      expectedUncertainty: expectedUnc,
    };
  }

  // Precision check (significant figures or decimal places) via math-eval-units-precision.ts
  if (
    (spec.requiredSigFigs !== undefined || spec.requiredDecimalPlaces !== undefined) &&
    (!rawUnit || rawUnit === spec.unit)
  ) {
    const prec = inspectRawNumericPrecision(rawNumStr);
    if (spec.requiredSigFigs !== undefined && prec.sigFigs !== spec.requiredSigFigs) {
      diag.precisionOk = false;
      return {
        passed: false,
        feedback: `Numeric value is right, but record it to ${spec.requiredSigFigs} significant figures (your entry "${rawNumStr}" has ${prec.sigFigs ?? 0}).`,
        diagnostics: diag,
        expectedValue: expectedVal,
        expectedUnit: spec.unit,
        expectedUncertainty: expectedUnc,
      };
    }
    if (spec.requiredDecimalPlaces !== undefined && prec.decimalPlaces !== spec.requiredDecimalPlaces) {
      diag.precisionOk = false;
      return {
        passed: false,
        feedback: `Numeric value is right, but match the instrument resolution by recording ${spec.requiredDecimalPlaces} decimal place(s) (your entry "${rawNumStr}" has ${prec.decimalPlaces}).`,
        diagnostics: diag,
        expectedValue: expectedVal,
        expectedUnit: spec.unit,
        expectedUncertainty: expectedUnc,
      };
    }
  }

  // Uncertainty check
  if (spec.requireUncertainty) {
    const uncStr = (submission.uncertaintyText ?? '').trim().replace(/^±/, '');
    if (!NUMERIC_RE.test(uncStr)) {
      diag.uncertaintyOk = false;
      return {
        passed: false,
        feedback: `Include the measurement uncertainty (± value in ${spec.unit}).`,
        diagnostics: diag,
        expectedValue: expectedVal,
        expectedUnit: spec.unit,
        expectedUncertainty: expectedUnc,
      };
    }
    const learnerUnc = Number(uncStr);
    const uncTol = Math.max(expectedUnc * 0.15, 0.005);
    if (!Number.isFinite(learnerUnc) || Math.abs(learnerUnc - expectedUnc) > uncTol) {
      diag.uncertaintyOk = false;
      return {
        passed: false,
        feedback: `Reading is right, but check the uncertainty (±${expectedUnc} ${spec.unit} under this instrument's convention).`,
        diagnostics: diag,
        expectedValue: expectedVal,
        expectedUnit: spec.unit,
        expectedUncertainty: expectedUnc,
      };
    }
  }

  return {
    passed: true,
    feedback: `Verified! Accurate simulated measurement (${expectedVal} ${spec.unit}${spec.requireUncertainty ? ` ± ${expectedUnc} ${spec.unit}` : ''}).`,
    diagnostics: diag,
    expectedValue: expectedVal,
    expectedUnit: spec.unit,
    expectedUncertainty: expectedUnc,
  };
}
