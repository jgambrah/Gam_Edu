/**
 * GAM EDU — Step 5C Strict Discriminated Schema Validator for `labKind: 'measurement-lab'`
 * (`construction-lab` `1.4.0`).
 *
 * Pure TypeScript, zero React/DOM dependencies.
 * Rejects impossible or internally inconsistent instrument configurations at authoring/publish time.
 */

import {
  INSTRUMENT_DIMENSIONS,
  MEASUREMENT_LAB_LIMITS,
  type MeasurementInstrumentKind,
} from './measurement-engine';
import {
  dimensionsEqual,
  parseUnitExpression,
} from '@/lib/math-evaluator/math-eval-units-precision';

const VALID_INSTRUMENTS = new Set<MeasurementInstrumentKind>([
  'ruler',
  'vernier-callipers',
  'micrometer',
  'measuring-cylinder',
  'thermometer',
  'balance',
  'stopwatch',
  'ammeter',
  'voltmeter',
]);

const VALID_LEVELS = new Set(['primary', 'lower-secondary', 'igcse', 'as-a-level']);
const VALID_DISPLAY_MODES = new Set(['analogue', 'digital']);
const VALID_MENISCUS = new Set(['concave', 'convex', 'flat']);
const VALID_UNCERTAINTY = new Set([
  'half-least-count',
  'one-least-count',
  'half-range',
  'reaction-time',
]);

const MEASUREMENT_LAB_ALLOWED_KEYS = new Set([
  'id',
  'engine',
  'schemaVersion',
  'minEngineVersion',
  'title',
  'instructions',
  'accessibilityLabel',
  'fallbackText',
  'hints',
  'persistCompletion',
  'labKind',
  'subjectTag',
  'modelNote',
  'prediction',
  'successExplanation',
  'instrument',
  'curriculumLevel',
  'learningMode',
  'displayMode',
  'unit',
  'minValue',
  'maxValue',
  'scaleDivision',
  'leastCount',
  'trueValue',
  'zeroError',
  'mainScaleStep',
  'vernierDivisions',
  'pitchMm',
  'thimbleDivisions',
  'hasHalfMmSleeve',
  'meniscusType',
  'liquidName',
  'initialTareOffset',
  'reactionTimeUncertainty',
  'scaleRanges',
  'activeRangeIndex',
  'enableParallax',
  'initialEyeOffsetDeg',
  'repeatedTrials',
  'uncertaintyConvention',
  'requireUncertainty',
  'requireUnit',
  'requiredSigFigs',
  'requiredDecimalPlaces',
  'tolerance',
  'objectLabel',
  'nonVisualQuestion',
]);

const NON_VISUAL_KEYS = new Set(['prompt', 'options', 'correctIndex', 'explanation']);

function isFiniteNum(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

export function validateMeasurementLabConfig(
  obj: Record<string, unknown>,
  errors: string[],
): void {
  for (const key of Object.keys(obj)) {
    if (!MEASUREMENT_LAB_ALLOWED_KEYS.has(key)) {
      errors.push(`Unknown field "${key}" in construction-lab(measurement-lab).`);
    }
  }

  const inst = obj.instrument as MeasurementInstrumentKind;
  if (typeof inst !== 'string' || !VALID_INSTRUMENTS.has(inst)) {
    errors.push(
      'measurement-lab "instrument" must be one of ruler, vernier-callipers, micrometer, measuring-cylinder, thermometer, balance, stopwatch, ammeter, voltmeter.',
    );
    return;
  }

  if (typeof obj.curriculumLevel !== 'string' || !VALID_LEVELS.has(obj.curriculumLevel)) {
    errors.push('measurement-lab "curriculumLevel" must be primary, lower-secondary, igcse, or as-a-level.');
  }

  if (obj.learningMode !== undefined && obj.learningMode !== 'guided' && obj.learningMode !== 'practice') {
    errors.push('measurement-lab "learningMode" must be "guided" or "practice".');
  }

  if (obj.displayMode !== undefined && (typeof obj.displayMode !== 'string' || !VALID_DISPLAY_MODES.has(obj.displayMode))) {
    errors.push('measurement-lab "displayMode" must be "analogue" or "digital".');
  }

  // Unit compatibility check via math-eval-units-precision.ts
  if (typeof obj.unit !== 'string' || !obj.unit.trim()) {
    errors.push('measurement-lab "unit" must be a non-empty SI unit string.');
  } else {
    try {
      const parsed = parseUnitExpression(obj.unit);
      if (!dimensionsEqual(parsed.dim, INSTRUMENT_DIMENSIONS[inst])) {
        errors.push(
          `measurement-lab unit "${obj.unit}" is dimensionally incompatible with instrument "${inst}".`,
        );
      }
    } catch {
      errors.push(`measurement-lab unit "${obj.unit}" is not a recognised SI unit.`);
    }
  }

  // Range, division, least count, trueValue
  const minVal = obj.minValue;
  const maxVal = obj.maxValue;
  const div = obj.scaleDivision;
  const lc = obj.leastCount;
  const trueVal = obj.trueValue;

  if (!isFiniteNum(minVal) || !isFiniteNum(maxVal) || maxVal <= minVal) {
    errors.push('measurement-lab requires finite minValue < maxValue.');
  }
  if (!isFiniteNum(div) || div <= 0) {
    errors.push('measurement-lab requires finite scaleDivision > 0.');
  }
  if (!isFiniteNum(lc) || lc <= 0) {
    errors.push('measurement-lab requires finite leastCount > 0.');
  }
  if (isFiniteNum(minVal) && isFiniteNum(maxVal) && isFiniteNum(div) && div > 0) {
    const numDivs = (maxVal - minVal) / div;
    const maxAllowedDivs =
      obj.displayMode === 'digital' ? 100000 : MEASUREMENT_LAB_LIMITS.maxDivisions;
    if (numDivs < MEASUREMENT_LAB_LIMITS.minDivisions || numDivs > maxAllowedDivs) {
      errors.push(
        `measurement-lab scale divisions count (${numDivs.toFixed(1)}) must be between ${MEASUREMENT_LAB_LIMITS.minDivisions} and ${maxAllowedDivs}.`,
      );
    }
  }
  if (isFiniteNum(lc) && isFiniteNum(div) && lc > div + 1e-9) {
    errors.push('measurement-lab leastCount cannot exceed scaleDivision.');
  }
  if (!isFiniteNum(trueVal)) {
    errors.push('measurement-lab requires finite trueValue.');
  } else if (isFiniteNum(minVal) && isFiniteNum(maxVal) && (trueVal < minVal || trueVal > maxVal)) {
    errors.push(`measurement-lab trueValue (${trueVal}) must lie within [minValue, maxValue] (${minVal}..${maxVal}).`);
  }

  // Zero-error bounds & reading feasibility
  const zErr = obj.zeroError ?? 0;
  if (!isFiniteNum(zErr)) {
    errors.push('measurement-lab zeroError must be a finite number.');
  } else if (isFiniteNum(minVal) && isFiniteNum(maxVal)) {
    const span = maxVal - minVal;
    if (Math.abs(zErr) > span * 0.2) {
      errors.push(`measurement-lab |zeroError| (${Math.abs(zErr)}) exceeds 20% of instrument range.`);
    }
    if (isFiniteNum(trueVal)) {
      const obs = trueVal + zErr;
      if (obs < minVal - span * 0.05 || obs > maxVal + span * 0.05) {
        errors.push(`measurement-lab observed reading (${obs}) is outside feasible instrument scale.`);
      }
    }
  }

  // Instrument-specific graphical/numerical consistency
  if (inst === 'vernier-callipers') {
    const mStep = obj.mainScaleStep ?? 1;
    const vDivs = obj.vernierDivisions ?? 10;
    if (!isFiniteNum(mStep) || mStep <= 0) {
      errors.push('vernier-callipers mainScaleStep must be > 0.');
    }
    if (!isFiniteNum(vDivs) || !Number.isInteger(vDivs) || vDivs < 5 || vDivs > 50) {
      errors.push('vernier-callipers vernierDivisions must be an integer between 5 and 50.');
    }
    if (isFiniteNum(mStep) && isFiniteNum(vDivs) && isFiniteNum(lc)) {
      const derived = mStep / vDivs;
      if (Math.abs(derived - lc) > 1e-5) {
        errors.push(
          `vernier-callipers leastCount (${lc}) does not match mainScaleStep/vernierDivisions (${derived}).`,
        );
      }
    }
  }

  if (inst === 'micrometer') {
    const pitch = obj.pitchMm ?? 0.5;
    const tDivs = obj.thimbleDivisions ?? 50;
    if (!isFiniteNum(pitch) || (Math.abs(pitch - 0.5) > 1e-6 && Math.abs(pitch - 1) > 1e-6)) {
      errors.push('micrometer pitchMm must be 0.5 or 1.');
    }
    if (!isFiniteNum(tDivs) || !Number.isInteger(tDivs) || (tDivs !== 50 && tDivs !== 100)) {
      errors.push('micrometer thimbleDivisions must be 50 or 100.');
    }
    if (isFiniteNum(pitch) && isFiniteNum(tDivs) && isFiniteNum(lc)) {
      const derived = pitch / tDivs;
      if (Math.abs(derived - lc) > 1e-5) {
        errors.push(`micrometer leastCount (${lc}) does not match pitchMm/thimbleDivisions (${derived}).`);
      }
    }
  }

  if (inst === 'measuring-cylinder' && obj.meniscusType !== undefined) {
    if (typeof obj.meniscusType !== 'string' || !VALID_MENISCUS.has(obj.meniscusType)) {
      errors.push('measuring-cylinder meniscusType must be "concave", "convex", or "flat".');
    }
  }

  if (inst === 'ammeter' || inst === 'voltmeter') {
    if (obj.scaleRanges !== undefined) {
      if (
        !Array.isArray(obj.scaleRanges) ||
        obj.scaleRanges.length === 0 ||
        obj.scaleRanges.length > MEASUREMENT_LAB_LIMITS.maxScaleRanges ||
        obj.scaleRanges.some((r) => !isFiniteNum(r) || r <= 0)
      ) {
        errors.push(`${inst} scaleRanges must be 1..${MEASUREMENT_LAB_LIMITS.maxScaleRanges} positive numbers.`);
      } else {
        const idx = obj.activeRangeIndex ?? 0;
        if (typeof idx !== 'number' || !Number.isInteger(idx) || idx < 0 || idx >= obj.scaleRanges.length) {
          errors.push(`${inst} activeRangeIndex must be a valid index into scaleRanges.`);
        } else if (isFiniteNum(trueVal) && trueVal > obj.scaleRanges[idx]) {
          errors.push(`${inst} trueValue (${trueVal}) exceeds active scaleRange (${obj.scaleRanges[idx]}).`);
        }
      }
    }
  }

  if (obj.repeatedTrials !== undefined) {
    if (
      !Array.isArray(obj.repeatedTrials) ||
      obj.repeatedTrials.length < 2 ||
      obj.repeatedTrials.length > MEASUREMENT_LAB_LIMITS.maxRepeatedTrials ||
      obj.repeatedTrials.some((v) => !isFiniteNum(v))
    ) {
      errors.push(`measurement-lab repeatedTrials must contain 2..${MEASUREMENT_LAB_LIMITS.maxRepeatedTrials} finite numbers.`);
    } else if (isFiniteNum(minVal) && isFiniteNum(maxVal)) {
      for (const t of obj.repeatedTrials) {
        if (t < minVal || t > maxVal) {
          errors.push(`measurement-lab repeatedTrials value (${t}) lies outside [${minVal}, ${maxVal}].`);
        }
      }
    }
  }

  if (obj.uncertaintyConvention !== undefined) {
    if (typeof obj.uncertaintyConvention !== 'string' || !VALID_UNCERTAINTY.has(obj.uncertaintyConvention)) {
      errors.push('measurement-lab uncertaintyConvention must be half-least-count, one-least-count, half-range, or reaction-time.');
    }
  }

  if (obj.requireUncertainty !== undefined && typeof obj.requireUncertainty !== 'boolean') {
    errors.push('measurement-lab requireUncertainty must be a strict boolean.');
  }
  if (obj.requireUnit !== undefined && typeof obj.requireUnit !== 'boolean') {
    errors.push('measurement-lab requireUnit must be a strict boolean.');
  }
  if (obj.enableParallax !== undefined && typeof obj.enableParallax !== 'boolean') {
    errors.push('measurement-lab enableParallax must be a strict boolean.');
  }
  if (obj.initialEyeOffsetDeg !== undefined) {
    if (
      !isFiniteNum(obj.initialEyeOffsetDeg) ||
      Math.abs(obj.initialEyeOffsetDeg) > MEASUREMENT_LAB_LIMITS.maxEyeOffsetDeg
    ) {
      errors.push(`measurement-lab initialEyeOffsetDeg must be within -${MEASUREMENT_LAB_LIMITS.maxEyeOffsetDeg}..+${MEASUREMENT_LAB_LIMITS.maxEyeOffsetDeg}.`);
    }
  }

  if (obj.requiredSigFigs !== undefined) {
    if (!isFiniteNum(obj.requiredSigFigs) || !Number.isInteger(obj.requiredSigFigs) || obj.requiredSigFigs < 1 || obj.requiredSigFigs > 6) {
      errors.push('measurement-lab requiredSigFigs must be an integer 1..6.');
    }
  }
  if (obj.requiredDecimalPlaces !== undefined) {
    if (!isFiniteNum(obj.requiredDecimalPlaces) || !Number.isInteger(obj.requiredDecimalPlaces) || obj.requiredDecimalPlaces < 0 || obj.requiredDecimalPlaces > 4) {
      errors.push('measurement-lab requiredDecimalPlaces must be an integer 0..4.');
    }
  }
  if (obj.tolerance !== undefined && (!isFiniteNum(obj.tolerance) || obj.tolerance <= 0)) {
    errors.push('measurement-lab tolerance must be a positive finite number.');
  }

  if (obj.nonVisualQuestion !== undefined) {
    const nvq = obj.nonVisualQuestion;
    if (!nvq || typeof nvq !== 'object' || Array.isArray(nvq)) {
      errors.push('measurement-lab nonVisualQuestion must be an object.');
    } else {
      const rec = nvq as Record<string, unknown>;
      for (const k of Object.keys(rec)) {
        if (!NON_VISUAL_KEYS.has(k)) errors.push(`Unknown field "${k}" in nonVisualQuestion.`);
      }
      if (typeof rec.prompt !== 'string' || rec.prompt.trim().length < 4) {
        errors.push('nonVisualQuestion.prompt must be a non-empty string.');
      }
      if (!Array.isArray(rec.options) || rec.options.length < 2 || rec.options.length > 4) {
        errors.push('nonVisualQuestion.options must contain 2..4 string options.');
      } else if (
        typeof rec.correctIndex !== 'number' ||
        !Number.isInteger(rec.correctIndex) ||
        rec.correctIndex < 0 ||
        rec.correctIndex >= rec.options.length
      ) {
        errors.push('nonVisualQuestion.correctIndex must be a valid index into options.');
      }
    }
  }
}
