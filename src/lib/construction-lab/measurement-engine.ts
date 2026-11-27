/**
 * GAM EDU — Step 5C Pure TypeScript Engine: Virtual Measuring Instruments
 * (`construction-lab`, `labKind: 'measurement-lab'`, `engineVersion: '1.4.0'`)
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies, zero eval().
 * Reuses `math-eval-units-precision.ts` for exact SI unit parsing, dimensional
 * compatibility, unit conversion, significant figures, and decimal places.
 *
 * Scientific Close-Out Guarantees:
 * - Explicitly distinguishes: trueValue, rawObservedReading, quantisedReading,
 *   correctedReading, reportedMeasurement, leastCount, and measurementUncertainty.
 * - Supports explicit taskKind (`read-observed`, `determine-zero-error`,
 *   `calculate-corrected`, `select-range`, `apply-tare-and-measure`, `repeated-mean`).
 * - Active manipulation (`sliderValue` / jaw / thimble / object alignment, eyeOffsetDeg,
 *   tareApplied, selectedRangeIndex, inspectingZeroError) feeds directly into the model
 *   and grading validity checks (over-range, unaligned jaws, untared balance, incomplete trials).
 * - Signed negative zero errors on vernier & micrometer never clamp to 0 (proper wraparound).
 * - Preserves significant-figure checks across unit conversions, distinguishes absolute vs
 *   differential temperatures, rejects zero/negative required uncertainties, and uses
 *   scale-aware uncertainty tolerances.
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

export type MeasurementTaskKind =
  | 'read-observed'
  | 'determine-zero-error'
  | 'calculate-corrected'
  | 'select-range'
  | 'apply-tare-and-measure'
  | 'repeated-mean';

export const MEASUREMENT_LAB_LIMITS = {
  maxAnalogueDivisions: 500,
  maxDigitalDivisions: 100000,
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
  taskKind?: MeasurementTaskKind;
  /** True if thermometer task measures a temperature difference (Δ°C == ΔK) rather than absolute temperature */
  isTemperatureDifference?: boolean;
  unit: string;
  minValue: number;
  maxValue: number;
  scaleDivision: number;
  leastCount: number;
  trueValue: number;
  /** Signed zero error in `unit` (positive = reads too high at zero; corrected = observed - zeroError). */
  zeroError?: number;
  /** Optional object alignment offset for ruler / jaw positioning exercises (0 = properly aligned). */
  initialAlignmentOffset?: number;
  /** Vernier callipers specifics */
  mainScaleStep?: number;
  vernierDivisions?: number;
  /** Micrometer screw gauge specifics (internal unit strictly mm) */
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
  /** When true, half-range uncertainty is floored at half-least-count; otherwise pure (max-min)/2 is used. */
  enforceMinHalfLeastCount?: boolean;
  requireUncertainty?: boolean;
  requireUnit?: boolean;
  requiredSigFigs?: number;
  requiredDecimalPlaces?: number;
  tolerance?: number;
  objectLabel?: string;
  nonVisualQuestion?: NonVisualMeasurementQuestion;
}

export interface MeasurementInteractiveState {
  /** Bounded instrument manipulation offset (e.g. ruler/jaw alignment offset in `unit`, 0 = aligned with sample) */
  sliderValue: number;
  /** Eye vertical/horizontal offset angle in degrees (-30..+30; 0 = level, no parallax) */
  eyeOffsetDeg: number;
  /** Whether balance tare has been applied */
  tareApplied: boolean;
  /** Selected range index for ammeter / voltmeter */
  selectedRangeIndex: number;
  /** Whether learner is inspecting closed-jaws zero error */
  inspectingZeroError: boolean;
  /** Number of repeated trials the learner has recorded in the UI */
  completedTrialCount: number;
}

export interface VernierBreakdown {
  mainScaleReading: number;
  alignedDivision: number;
  leastCount: number;
  observedReading: number;
  /** True when inspecting a negative zero error (vernier 0 sits left of main 0) */
  isNegativeZeroView: boolean;
  /** Exact graphical vernier-zero coordinate in `unit` (may be negative for negative zero error!) */
  vernierZeroPos: number;
}

export interface MicrometerBreakdown {
  sleeveWholeMm: number;
  hasHalfMmVisible: boolean;
  sleeveReadingMm: number;
  /** Graduated thimble division (0..thimbleDivisions-1) aligned with datum line (wraps for negative zero error) */
  thimbleDivision: number;
  leastCountMm: number;
  observedMm: number;
  isNegativeZeroView: boolean;
}

export interface InstrumentModelOutput {
  trueValue: number;
  zeroError: number;
  alignmentOffset: number;
  parallaxShift: number;
  tareOffset: number;
  /** Physical liquid/sample level before apparent parallax shift */
  physicalReading: number;
  /** Raw observed reading including zero error, tare offset, alignment, and apparent parallax */
  observedReading: number;
  /** Quantised reading snapped to active instrument resolution */
  quantisedReading: number;
  /** Corrected reading after removing signed zero error and tare */
  correctedReading: number;
  /** Active resolution derived from selected range (electrical) or vernier/micrometer/scale */
  leastCount: number;
  activeScaleDivision: number;
  expectedUncertainty: number;
  activeMaxRange: number;
  /** True when trueValue + zeroError exceeds the currently selected electrical range */
  overRange: boolean;
  vernier?: VernierBreakdown;
  micrometer?: MicrometerBreakdown;
}

export function roundClean(v: number, decimals = 6): number {
  const f = Math.pow(10, decimals);
  return Math.round((v + Number.EPSILON) * f) / f;
}

export function computeDerivedLeastCount(
  spec: MeasurementLabSpec,
  selectedRangeIndex?: number,
): number {
  if (spec.instrument === 'vernier-callipers' && spec.mainScaleStep && spec.vernierDivisions) {
    return roundClean(spec.mainScaleStep / spec.vernierDivisions, 6);
  }
  if (spec.instrument === 'micrometer' && spec.pitchMm && spec.thimbleDivisions) {
    return roundClean(spec.pitchMm / spec.thimbleDivisions, 6);
  }
  if (
    (spec.instrument === 'ammeter' || spec.instrument === 'voltmeter') &&
    spec.scaleRanges &&
    spec.scaleRanges.length > 0
  ) {
    const idx = selectedRangeIndex ?? spec.activeRangeIndex ?? 0;
    const activeRange = spec.scaleRanges[idx] ?? spec.maxValue;
    const baseRange = spec.scaleRanges[spec.activeRangeIndex ?? 0] ?? spec.maxValue;
    if (baseRange > 0) {
      return roundClean(spec.leastCount * (activeRange / baseRange), 6);
    }
  }
  return spec.leastCount;
}

export function computeExpectedUncertainty(
  spec: MeasurementLabSpec,
  readings?: ReadonlyArray<number>,
  selectedRangeIndex?: number,
): number {
  const lc = computeDerivedLeastCount(spec, selectedRangeIndex);
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
      return roundClean(
        spec.enforceMinHalfLeastCount ? Math.max(spread, lc / 2) : spread,
        6,
      );
    }
    return roundClean(lc / 2, 6);
  }
  return roundClean(lc / 2, 6);
}

/**
 * Computes the exact deterministic physical/graphical instrument model so that
 * rendered SVG graduations (vernier alignment, micrometer sleeve+thimble wraparound,
 * meniscus height, electrical needle angle) agree identically with the grading model.
 */
export function computeInstrumentModel(
  spec: MeasurementLabSpec,
  state?: Partial<MeasurementInteractiveState>,
): InstrumentModelOutput {
  const zeroError = spec.zeroError ?? 0;
  const activeRangeIdx = state?.selectedRangeIndex ?? spec.activeRangeIndex ?? 0;
  const lc = computeDerivedLeastCount(spec, activeRangeIdx);
  const activeMaxRange =
    spec.scaleRanges && spec.scaleRanges[activeRangeIdx] !== undefined
      ? spec.scaleRanges[activeRangeIdx]
      : spec.maxValue;
  const baseRange =
    spec.scaleRanges && spec.scaleRanges[spec.activeRangeIndex ?? 0] !== undefined
      ? spec.scaleRanges[spec.activeRangeIndex ?? 0]
      : spec.maxValue;
  const activeScaleDivision =
    spec.scaleRanges && baseRange > 0
      ? roundClean(spec.scaleDivision * (activeMaxRange / baseRange), 6)
      : spec.scaleDivision;

  const eyeDeg = spec.enableParallax ? (state?.eyeOffsetDeg ?? spec.initialEyeOffsetDeg ?? 0) : 0;
  const alignmentOffset = roundClean(state?.sliderValue ?? spec.initialAlignmentOffset ?? 0, 6);

  // Simplified educational parallax model (physical liquid level kept distinct from apparent shift)
  const parallaxScale =
    spec.instrument === 'measuring-cylinder' || spec.instrument === 'thermometer'
      ? -0.04 * activeScaleDivision * eyeDeg
      : spec.instrument === 'ruler' || spec.instrument === 'ammeter' || spec.instrument === 'voltmeter'
        ? 0.03 * activeScaleDivision * eyeDeg
        : 0;
  const parallaxShift = roundClean(parallaxScale, 4);

  const tareOffset =
    spec.instrument === 'balance' && !(state?.tareApplied ?? false)
      ? (spec.initialTareOffset ?? 0)
      : 0;

  const baseReading = state?.inspectingZeroError ? 0 : spec.trueValue;
  const physicalReading = roundClean(baseReading + zeroError + tareOffset + alignmentOffset, 6);
  const rawObserved = roundClean(physicalReading + parallaxShift, 6);
  const quantisedReading = roundClean(Math.round(rawObserved / lc) * lc, 6);
  const corrected = roundClean(rawObserved - zeroError - tareOffset - alignmentOffset, 6);
  const overRange =
    (spec.instrument === 'ammeter' || spec.instrument === 'voltmeter') &&
    !state?.inspectingZeroError &&
    physicalReading > activeMaxRange + 1e-9;

  let vernier: VernierBreakdown | undefined;
  if (spec.instrument === 'vernier-callipers') {
    const mainStep = spec.mainScaleStep ?? 1;
    const vDivs = spec.vernierDivisions ?? 10;
    // Do NOT clamp negative zero-error graphical readings to 0!
    const totalSubSteps = Math.round(rawObserved / lc);
    const isNegativeZeroView = totalSubSteps < 0;
    const mainSteps = Math.floor(totalSubSteps / vDivs);
    const alignedDivision = ((totalSubSteps % vDivs) + vDivs) % vDivs;
    const mainScaleReading = roundClean(mainSteps * mainStep, 6);
    vernier = {
      mainScaleReading,
      alignedDivision,
      leastCount: lc,
      observedReading: roundClean(totalSubSteps * lc, 6),
      isNegativeZeroView,
      vernierZeroPos: roundClean(totalSubSteps * lc, 6),
    };
  }

  let micrometer: MicrometerBreakdown | undefined;
  if (spec.instrument === 'micrometer') {
    const pitch = spec.pitchMm ?? 0.5;
    const tDivs = spec.thimbleDivisions ?? 50;
    // Proper signed wraparound on the thimble for negative zero error (e.g. -0.03 mm -> division 47)
    const totalTicks = Math.round(rawObserved / lc);
    const isNegativeZeroView = totalTicks < 0;
    const fullPitches = Math.floor(totalTicks / tDivs);
    const thimbleDivision = ((totalTicks % tDivs) + tDivs) % tDivs;
    const sleeveReadingMm = roundClean(fullPitches * pitch, 6);
    const sleeveWholeMm = Math.floor(sleeveReadingMm + 1e-9);
    const hasHalfMmVisible =
      !isNegativeZeroView &&
      (spec.hasHalfMmSleeve ?? pitch === 0.5) &&
      sleeveReadingMm - sleeveWholeMm >= 0.49;
    micrometer = {
      sleeveWholeMm,
      hasHalfMmVisible,
      sleeveReadingMm,
      thimbleDivision,
      leastCountMm: lc,
      observedMm: roundClean(totalTicks * lc, 6),
      isNegativeZeroView,
    };
  }

  return {
    trueValue: spec.trueValue,
    zeroError,
    alignmentOffset,
    parallaxShift,
    tareOffset,
    physicalReading,
    observedReading: rawObserved,
    quantisedReading,
    correctedReading: corrected,
    leastCount: lc,
    activeScaleDivision,
    expectedUncertainty: computeExpectedUncertainty(spec, undefined, activeRangeIdx),
    activeMaxRange,
    overRange,
    vernier,
    micrometer,
  };
}

export interface MeasurementSubmission {
  valueText: string;
  unitText?: string;
  uncertaintyText?: string;
}

export interface MeasurementEvalResult {
  passed: boolean;
  feedback: string;
  diagnostics: {
    numericOk: boolean;
    unitOk: boolean;
    precisionOk: boolean;
    uncertaintyOk: boolean;
    stateValid: boolean;
    overRange: boolean;
    zeroErrorSignMistake: boolean;
    massWeightConfusion: boolean;
    parallaxNotLevel: boolean;
    incompleteTrials: boolean;
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
  const taskKind: MeasurementTaskKind =
    spec.taskKind ??
    (spec.repeatedTrials && spec.repeatedTrials.length >= 2
      ? 'repeated-mean'
      : (spec.zeroError ?? 0) !== 0
        ? 'calculate-corrected'
        : spec.instrument === 'balance' && (spec.initialTareOffset ?? 0) !== 0
          ? 'apply-tare-and-measure'
          : 'calculate-corrected');

  const expectedVal =
    taskKind === 'repeated-mean' && spec.repeatedTrials && spec.repeatedTrials.length >= 2
      ? roundClean(
          spec.repeatedTrials.reduce((a, b) => a + b, 0) / spec.repeatedTrials.length,
          6,
        )
      : taskKind === 'determine-zero-error'
        ? roundClean(spec.zeroError ?? 0, 6)
        : taskKind === 'read-observed'
          ? roundClean(spec.trueValue + (spec.zeroError ?? 0), 6)
          : spec.trueValue;

  const activeRangeIdx = state?.selectedRangeIndex ?? spec.activeRangeIndex ?? 0;
  const expectedUnc = computeExpectedUncertainty(spec, spec.repeatedTrials, activeRangeIdx);
  const tol = spec.tolerance ?? Math.max(model.leastCount * 0.5001, 1e-6);

  const diag = {
    numericOk: false,
    unitOk: true,
    precisionOk: true,
    uncertaintyOk: true,
    stateValid: true,
    overRange: model.overRange,
    zeroErrorSignMistake: false,
    massWeightConfusion: false,
    parallaxNotLevel: Boolean(spec.enableParallax && Math.abs(state?.eyeOffsetDeg ?? 0) > 1),
    incompleteTrials: false,
  };

  // Validate instrument state before accepting any measurement!
  if (model.overRange) {
    diag.stateValid = false;
    return {
      passed: false,
      feedback: `Over-range! The reading exceeds the selected 0–${model.activeMaxRange} ${spec.unit} range. Select a higher range before recording.`,
      diagnostics: diag,
      expectedValue: expectedVal,
      expectedUnit: spec.unit,
      expectedUncertainty: expectedUnc,
    };
  }

  if (Math.abs(model.alignmentOffset) > model.leastCount * 0.5 && taskKind !== 'determine-zero-error') {
    diag.stateValid = false;
    return {
      passed: false,
      feedback: 'Instrument alignment is off-zero! Align the sample/jaws to 0 offset before recording your measurement.',
      diagnostics: diag,
      expectedValue: expectedVal,
      expectedUnit: spec.unit,
      expectedUncertainty: expectedUnc,
    };
  }

  if (
    taskKind === 'apply-tare-and-measure' &&
    spec.instrument === 'balance' &&
    (spec.initialTareOffset ?? 0) !== 0 &&
    state?.tareApplied === false
  ) {
    diag.stateValid = false;
    return {
      passed: false,
      feedback: 'Press Tare / Zero to zero out the empty container before recording the sample mass.',
      diagnostics: diag,
      expectedValue: expectedVal,
      expectedUnit: spec.unit,
      expectedUncertainty: expectedUnc,
    };
  }

  if (
    taskKind === 'repeated-mean' &&
    spec.repeatedTrials &&
    state?.completedTrialCount !== undefined &&
    state.completedTrialCount < spec.repeatedTrials.length
  ) {
    diag.stateValid = false;
    diag.incompleteTrials = true;
    return {
      passed: false,
      feedback: `Complete all ${spec.repeatedTrials.length} repeated trials (${state.completedTrialCount}/${spec.repeatedTrials.length} recorded) before submitting the mean.`,
      diagnostics: diag,
      expectedValue: expectedVal,
      expectedUnit: spec.unit,
      expectedUncertainty: expectedUnc,
    };
  }

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

  let usedAlternativeUnit = false;
  if (rawUnit) {
    try {
      const learnerUnitParsed = parseUnitExpression(rawUnit);
      if (!dimensionsEqual(learnerUnitParsed.dim, expectedUnitParsed.dim)) {
        diag.unitOk = false;
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
      usedAlternativeUnit = rawUnit !== spec.unit;
      // Distinguish absolute temperature (°C <-> K with 273.15 offset) vs temperature difference (Δ°C == ΔK)
      if (spec.isTemperatureDifference && spec.instrument === 'thermometer') {
        learnerInSpecUnit = roundClean(
          (learnerNum * learnerUnitParsed.scale) / expectedUnitParsed.scale,
          6,
        );
      } else {
        const learnerBase = convertToBaseSI(learnerNum, learnerUnitParsed);
        learnerInSpecUnit = roundClean(
          (learnerBase - expectedUnitParsed.offsetK) / expectedUnitParsed.scale,
          6,
        );
      }
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
    if (zErr !== 0 && taskKind === 'calculate-corrected') {
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
        feedback: 'Your reading includes a parallax error! Move the eye-position control to 0° (level with the scale/meniscus) before reading.',
        diagnostics: diag,
        expectedValue: expectedVal,
        expectedUnit: spec.unit,
        expectedUncertainty: expectedUnc,
      };
    }

    return {
      passed: false,
      feedback: `Reading ${learnerNum} ${rawUnit || spec.unit} is outside the accepted tolerance (±${tol} ${spec.unit}). Check the scale graduations, least count (${model.leastCount} ${spec.unit}), and any zero error.`,
      diagnostics: diag,
      expectedValue: expectedVal,
      expectedUnit: spec.unit,
      expectedUncertainty: expectedUnc,
    };
  }

  // Precision checks — significant figures ALWAYS checked (even across unit conversions!)
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
  if (spec.requiredDecimalPlaces !== undefined) {
    // Decimal places apply in the reporting unit; if alternative unit used, adjust by power of 10 scale shift
    let targetDp = spec.requiredDecimalPlaces;
    if (usedAlternativeUnit && rawUnit) {
      const learnerUnitParsed = parseUnitExpression(rawUnit);
      const ratio = learnerUnitParsed.scale / expectedUnitParsed.scale;
      const logShift = Math.round(Math.log10(ratio));
      if (Math.abs(Math.pow(10, logShift) - ratio) < 1e-6) {
        targetDp = Math.max(0, spec.requiredDecimalPlaces + logShift);
      }
    }
    if (prec.decimalPlaces !== targetDp) {
      diag.precisionOk = false;
      return {
        passed: false,
        feedback: `Numeric value is right, but match the instrument resolution by recording ${targetDp} decimal place(s) in ${rawUnit || spec.unit} (your entry "${rawNumStr}" has ${prec.decimalPlaces}).`,
        diagnostics: diag,
        expectedValue: expectedVal,
        expectedUnit: spec.unit,
        expectedUncertainty: expectedUnc,
      };
    }
  }

  // Uncertainty check — reject negative or zero when positive uncertainty is required, scale-aware tolerance
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
    if (!Number.isFinite(learnerUnc) || learnerUnc < 0) {
      diag.uncertaintyOk = false;
      return {
        passed: false,
        feedback: 'Measurement uncertainty must be a non-negative number.',
        diagnostics: diag,
        expectedValue: expectedVal,
        expectedUnit: spec.unit,
        expectedUncertainty: expectedUnc,
      };
    }
    if (expectedUnc > 0 && learnerUnc === 0) {
      diag.uncertaintyOk = false;
      return {
        passed: false,
        feedback: `Measurement uncertainty cannot be zero when instrument/experimental uncertainty is ±${expectedUnc} ${spec.unit}.`,
        diagnostics: diag,
        expectedValue: expectedVal,
        expectedUnit: spec.unit,
        expectedUncertainty: expectedUnc,
      };
    }
    const uncTol = Math.max(expectedUnc * 0.1, model.leastCount * 0.05);
    if (Math.abs(learnerUnc - expectedUnc) > uncTol) {
      diag.uncertaintyOk = false;
      return {
        passed: false,
        feedback: `Reading is right, but check the uncertainty (±${expectedUnc} ${spec.unit} under the ${spec.uncertaintyConvention ?? 'configured'} convention).`,
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
