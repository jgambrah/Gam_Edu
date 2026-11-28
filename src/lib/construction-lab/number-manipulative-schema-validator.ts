/**
 * GAM EDU — Step 5F Strict Discriminated Schema Validator for `labKind: 'number-manipulative'`
 * (`construction-lab` `1.7.0`).
 *
 * Pure TypeScript, zero React/DOM dependencies.
 */

import {
  NUMBER_MANIPULATIVE_LIMITS,
  VALID_GHANA_DENOM_IDS,
} from './number-manipulative-engine';

const VALID_MODES = new Set([
  'counting-ten-frame',
  'number-bonds',
  'base-ten-place-value',
  'number-line',
  'arrays-grouping',
  'fractions-decimals',
  'ghana-money',
  'analogue-clock',
  'patterns',
]);

const SHARED_KEYS = [
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
  'curriculumLevel',
  'mode',
] as const;

const MODE_KEYS: Record<string, ReadonlySet<string>> = {
  'counting-ten-frame': new Set([...SHARED_KEYS, 'frameCount', 'targetCount', 'initialCount', 'twoColorSplit']),
  'number-bonds': new Set([...SHARED_KEYS, 'whole', 'knownParts', 'missingRole', 'expectedValue', 'maxValue']),
  'base-ten-place-value': new Set([...SHARED_KEYS, 'maxPlace', 'targetNumber', 'initialBlocks', 'requireCanonical']),
  'number-line': new Set([...SHARED_KEYS, 'min', 'max', 'step', 'startValue', 'targetValue', 'jumpSizes']),
  'arrays-grouping': new Set([...SHARED_KEYS, 'taskKind', 'targetTotal', 'divisorOrFactor', 'requireExactOrder', 'expectedRows', 'expectedCols']),
  'fractions-decimals': new Set([
    ...SHARED_KEYS,
    'representation',
    'targetNumerator',
    'targetDenominator',
    'initialDenominator',
    'allowDenominatorChange',
    'requireExactDenominator',
    'targetHundredths',
  ]),
  'ghana-money': new Set([...SHARED_KEYS, 'taskKind', 'allowedDenomIds', 'targetPesewas', 'costPesewas', 'paidPesewas']),
  'analogue-clock': new Set([...SHARED_KEYS, 'taskKind', 'startHours', 'startMinutes', 'targetHours', 'targetMinutes', 'minuteStep', 'use24Hour']),
  'patterns': new Set([...SHARED_KEYS, 'patternKind', 'givenSequence', 'expectedNext', 'palette']),
};

export function validateNumberManipulativeConfig(obj: Record<string, unknown>, errors: string[]): void {
  const mode = obj.mode;
  if (typeof mode !== 'string' || !VALID_MODES.has(mode)) {
    errors.push(`number-manipulative "mode" is invalid: "${String(mode)}".`);
    return;
  }

  const allowed = MODE_KEYS[mode];
  for (const k of Object.keys(obj)) {
    if (!allowed.has(k)) {
      errors.push(`Unknown field "${k}" in number-manipulative(${mode}).`);
    }
  }

  if (mode === 'counting-ten-frame') {
    if (obj.frameCount !== 1 && obj.frameCount !== 2) {
      errors.push('counting-ten-frame "frameCount" must be 1 or 2.');
    }
    const maxCap = obj.frameCount === 2 ? 20 : 10;
    if (typeof obj.targetCount !== 'number' || !Number.isInteger(obj.targetCount) || obj.targetCount < 0 || obj.targetCount > maxCap) {
      errors.push(`counting-ten-frame "targetCount" must be an integer in 0..${maxCap}.`);
    }
    return;
  }

  if (mode === 'number-bonds') {
    if (typeof obj.whole !== 'number' || !Number.isInteger(obj.whole) || obj.whole < 1 || obj.whole > 1000) {
      errors.push('number-bonds "whole" must be an integer in 1..1000.');
    }
    if (!Array.isArray(obj.knownParts) || obj.knownParts.length < 1 || obj.knownParts.some((n) => typeof n !== 'number' || !Number.isInteger(n) || n < 0)) {
      errors.push('number-bonds "knownParts" must be a non-empty array of non-negative integers.');
    }
    if (obj.missingRole !== 'whole' && obj.missingRole !== 'part') {
      errors.push('number-bonds "missingRole" must be "whole" or "part".');
    }
    if (typeof obj.expectedValue !== 'number' || !Number.isInteger(obj.expectedValue) || obj.expectedValue < 0) {
      errors.push('number-bonds "expectedValue" must be a non-negative integer.');
    }
    return;
  }

  if (mode === 'base-ten-place-value') {
    if (obj.maxPlace !== 'tens' && obj.maxPlace !== 'hundreds' && obj.maxPlace !== 'thousands') {
      errors.push('base-ten-place-value "maxPlace" must be "tens", "hundreds", or "thousands".');
    }
    if (typeof obj.targetNumber !== 'number' || !Number.isInteger(obj.targetNumber) || obj.targetNumber < 0 || obj.targetNumber > 9999) {
      errors.push('base-ten-place-value "targetNumber" must be an integer in 0..9999.');
    }
    return;
  }

  if (mode === 'number-line') {
    if (
      typeof obj.min !== 'number' ||
      typeof obj.max !== 'number' ||
      typeof obj.step !== 'number' ||
      typeof obj.startValue !== 'number' ||
      typeof obj.targetValue !== 'number' ||
      obj.max <= obj.min ||
      obj.step <= 0 ||
      obj.max - obj.min > NUMBER_MANIPULATIVE_LIMITS.maxNumberLineSpan
    ) {
      errors.push(`number-line requires valid min < max (span <= ${NUMBER_MANIPULATIVE_LIMITS.maxNumberLineSpan}), step > 0, startValue, and targetValue.`);
    }
    return;
  }

  if (mode === 'arrays-grouping') {
    if (obj.taskKind !== 'multiplication-array' && obj.taskKind !== 'equal-grouping' && obj.taskKind !== 'division-remainder') {
      errors.push('arrays-grouping "taskKind" must be multiplication-array, equal-grouping, or division-remainder.');
    }
    if (typeof obj.targetTotal !== 'number' || !Number.isInteger(obj.targetTotal) || obj.targetTotal < 1 || obj.targetTotal > 144) {
      errors.push('arrays-grouping "targetTotal" must be an integer in 1..144.');
    }
    if (obj.taskKind === 'division-remainder' && (typeof obj.divisorOrFactor !== 'number' || !Number.isInteger(obj.divisorOrFactor) || obj.divisorOrFactor < 2 || obj.divisorOrFactor > 12)) {
      errors.push('division-remainder requires integer divisorOrFactor in 2..12.');
    }
    return;
  }

  if (mode === 'fractions-decimals') {
    if (obj.representation !== 'fraction-bar' && obj.representation !== 'fraction-circle' && obj.representation !== 'decimal-place-value') {
      errors.push('fractions-decimals "representation" must be fraction-bar, fraction-circle, or decimal-place-value.');
      return;
    }
    if (obj.representation === 'decimal-place-value') {
      if (typeof obj.targetHundredths !== 'number' || !Number.isInteger(obj.targetHundredths) || obj.targetHundredths < 0 || obj.targetHundredths > 999) {
        errors.push('decimal-place-value requires integer targetHundredths in 0..999.');
      }
    } else {
      if (
        typeof obj.targetNumerator !== 'number' ||
        !Number.isInteger(obj.targetNumerator) ||
        obj.targetNumerator < 0 ||
        typeof obj.targetDenominator !== 'number' ||
        !Number.isInteger(obj.targetDenominator) ||
        obj.targetDenominator < 1 ||
        obj.targetDenominator > NUMBER_MANIPULATIVE_LIMITS.maxFractionDenominator
      ) {
        errors.push(`fraction mode requires integer targetNumerator >= 0 and targetDenominator in 1..${NUMBER_MANIPULATIVE_LIMITS.maxFractionDenominator}.`);
      }
    }
    return;
  }

  if (mode === 'ghana-money') {
    if (obj.taskKind !== 'exact-amount' && obj.taskKind !== 'make-change' && obj.taskKind !== 'minimum-coins') {
      errors.push('ghana-money "taskKind" must be exact-amount, make-change, or minimum-coins.');
    }
    if (
      !Array.isArray(obj.allowedDenomIds) ||
      obj.allowedDenomIds.length === 0 ||
      obj.allowedDenomIds.some((id) => typeof id !== 'string' || !VALID_GHANA_DENOM_IDS.has(id))
    ) {
      errors.push('ghana-money "allowedDenomIds" must contain legitimate Bank of Ghana denomination IDs only.');
    }
    if (obj.taskKind === 'make-change') {
      if (
        typeof obj.costPesewas !== 'number' ||
        !Number.isInteger(obj.costPesewas) ||
        typeof obj.paidPesewas !== 'number' ||
        !Number.isInteger(obj.paidPesewas) ||
        obj.paidPesewas < obj.costPesewas
      ) {
        errors.push('ghana-money make-change requires integer paidPesewas >= costPesewas.');
      }
    } else if (typeof obj.targetPesewas !== 'number' || !Number.isInteger(obj.targetPesewas) || obj.targetPesewas <= 0) {
      errors.push('ghana-money requires positive integer targetPesewas.');
    }
    return;
  }

  if (mode === 'analogue-clock') {
    if (obj.taskKind !== 'set-time' && obj.taskKind !== 'elapsed-time') {
      errors.push('analogue-clock "taskKind" must be set-time or elapsed-time.');
    }
    for (const [k, max] of [
      ['startHours', 23],
      ['startMinutes', 59],
      ['targetHours', 23],
      ['targetMinutes', 59],
    ] as const) {
      const v = obj[k];
      if (typeof v !== 'number' || !Number.isInteger(v) || v < 0 || v > max) {
        errors.push(`analogue-clock "${k}" must be an integer in 0..${max}.`);
      }
    }
    return;
  }

  if (mode === 'patterns') {
    if (obj.patternKind !== 'repeating' && obj.patternKind !== 'growing') {
      errors.push('patterns "patternKind" must be repeating or growing.');
    }
    if (
      !Array.isArray(obj.givenSequence) ||
      obj.givenSequence.length < 2 ||
      obj.givenSequence.length > NUMBER_MANIPULATIVE_LIMITS.maxPatternLength ||
      !Array.isArray(obj.expectedNext) ||
      obj.expectedNext.length < 1 ||
      !Array.isArray(obj.palette) ||
      obj.palette.length < 2
    ) {
      errors.push('patterns requires givenSequence (>=2), expectedNext (>=1), and palette (>=2).');
    }
  }
}
