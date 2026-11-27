/**
 * GAM EDU — Step 5A Pure Module 5: Full 7-Component SI Dimensional Units & Precision/Sig-Fig Model
 *
 * Dimensional vector: [M, L, T, I, Θ, N, J]
 *   M = Mass (kg), L = Length (m), T = Time (s), I = Current (A),
 *   Θ = Thermodynamic Temperature (K), N = Amount (mol), J = Luminous Intensity (cd)
 *
 * Uses EXACT BigInt rational scale factors for all rational SI/metric/time/volume/temp conversions
 * (zero hidden 1e-9 float tolerances!). Irrational conversions (deg <-> rad) are explicitly flagged
 * `exactScale: null` so they never falsely claim exact rational equivalence.
 */

import { MATH_EVAL_LIMITS, MathEvalLimitError } from './math-eval-limits';
import {
  RAT_ONE,
  RAT_ZERO,
  makeRat,
  ratAdd,
  ratDiv,
  ratMul,
  ratPowInt,
  ratSub,
  type BigRat,
} from './math-eval-exact';

export type DimVec = readonly [number, number, number, number, number, number, number];
export const DIM_NONE: DimVec = [0, 0, 0, 0, 0, 0, 0];

const B1 = BigInt(1);

interface UnitAtomDef {
  dim: DimVec;
  scale: number;
  exactScale: BigRat | null; // null only for irrational scale (deg -> pi/180 rad)
  exactOffsetK?: BigRat; // 27315/100 for standalone °C
  allowPrefix?: boolean;
}

const SI_PREFIXES: Record<string, { num: number; rat: BigRat }> = {
  n: { num: 1e-9, rat: makeRat(B1, BigInt('1000000000')) },
  u: { num: 1e-6, rat: makeRat(B1, BigInt('1000000')) },
  'µ': { num: 1e-6, rat: makeRat(B1, BigInt('1000000')) },
  μ: { num: 1e-6, rat: makeRat(B1, BigInt('1000000')) },
  m: { num: 1e-3, rat: makeRat(B1, BigInt(1000)) },
  c: { num: 1e-2, rat: makeRat(B1, BigInt(100)) },
  d: { num: 1e-1, rat: makeRat(B1, BigInt(10)) },
  k: { num: 1e3, rat: makeRat(BigInt(1000), B1) },
  M: { num: 1e6, rat: makeRat(BigInt('1000000'), B1) },
  G: { num: 1e9, rat: makeRat(BigInt('1000000000'), B1) },
};

const OFFSET_CELSIUS_K: BigRat = makeRat(BigInt(27315), BigInt(100));

const BASE_UNITS: Record<string, UnitAtomDef> = {
  g: { dim: [1, 0, 0, 0, 0, 0, 0], scale: 1e-3, exactScale: makeRat(B1, BigInt(1000)), allowPrefix: true },
  m: { dim: [0, 1, 0, 0, 0, 0, 0], scale: 1, exactScale: RAT_ONE, allowPrefix: true },
  s: { dim: [0, 0, 1, 0, 0, 0, 0], scale: 1, exactScale: RAT_ONE, allowPrefix: true },
  A: { dim: [0, 0, 0, 1, 0, 0, 0], scale: 1, exactScale: RAT_ONE, allowPrefix: true },
  K: { dim: [0, 0, 0, 0, 1, 0, 0], scale: 1, exactScale: RAT_ONE, allowPrefix: false },
  mol: { dim: [0, 0, 0, 0, 0, 1, 0], scale: 1, exactScale: RAT_ONE, allowPrefix: true },
  cd: { dim: [0, 0, 0, 0, 0, 0, 1], scale: 1, exactScale: RAT_ONE, allowPrefix: true },

  min: { dim: [0, 0, 1, 0, 0, 0, 0], scale: 60, exactScale: makeRat(BigInt(60), B1) },
  h: { dim: [0, 0, 1, 0, 0, 0, 0], scale: 3600, exactScale: makeRat(BigInt(3600), B1) },
  hr: { dim: [0, 0, 1, 0, 0, 0, 0], scale: 3600, exactScale: makeRat(BigInt(3600), B1) },
  L: { dim: [0, 3, 0, 0, 0, 0, 0], scale: 1e-3, exactScale: makeRat(B1, BigInt(1000)), allowPrefix: true },
  l: { dim: [0, 3, 0, 0, 0, 0, 0], scale: 1e-3, exactScale: makeRat(B1, BigInt(1000)), allowPrefix: true },
  '°C': { dim: [0, 0, 0, 0, 1, 0, 0], scale: 1, exactScale: RAT_ONE, exactOffsetK: OFFSET_CELSIUS_K },
  '%': { dim: DIM_NONE, scale: 0.01, exactScale: makeRat(B1, BigInt(100)) },
  rad: { dim: DIM_NONE, scale: 1, exactScale: RAT_ONE },
  deg: { dim: DIM_NONE, scale: Math.PI / 180, exactScale: null },
  '°': { dim: DIM_NONE, scale: Math.PI / 180, exactScale: null },

  N: { dim: [1, 1, -2, 0, 0, 0, 0], scale: 1, exactScale: RAT_ONE, allowPrefix: true },
  J: { dim: [1, 2, -2, 0, 0, 0, 0], scale: 1, exactScale: RAT_ONE, allowPrefix: true },
  W: { dim: [1, 2, -3, 0, 0, 0, 0], scale: 1, exactScale: RAT_ONE, allowPrefix: true },
  Pa: { dim: [1, -1, -2, 0, 0, 0, 0], scale: 1, exactScale: RAT_ONE, allowPrefix: true },
  Hz: { dim: [0, 0, -1, 0, 0, 0, 0], scale: 1, exactScale: RAT_ONE, allowPrefix: true },
  C: { dim: [0, 0, 1, 1, 0, 0, 0], scale: 1, exactScale: RAT_ONE, allowPrefix: true },
  V: { dim: [1, 2, -3, -1, 0, 0, 0], scale: 1, exactScale: RAT_ONE, allowPrefix: true },
  ohm: { dim: [1, 2, -3, -2, 0, 0, 0], scale: 1, exactScale: RAT_ONE, allowPrefix: true },
  'Ω': { dim: [1, 2, -3, -2, 0, 0, 0], scale: 1, exactScale: RAT_ONE, allowPrefix: true },
};

export interface ParsedUnit {
  canonicalRaw: string;
  dim: DimVec;
  scale: number;
  exactScale: BigRat | null;
  offsetK: number;
  exactOffsetK: BigRat;
  isCompound: boolean;
}

function lookupUnitAtom(sym: string): UnitAtomDef | null {
  if (Object.prototype.hasOwnProperty.call(BASE_UNITS, sym)) {
    return BASE_UNITS[sym];
  }
  if (sym.length >= 2) {
    const pfx = sym[0];
    const base = sym.slice(1);
    if (
      Object.prototype.hasOwnProperty.call(SI_PREFIXES, pfx) &&
      Object.prototype.hasOwnProperty.call(BASE_UNITS, base) &&
      BASE_UNITS[base].allowPrefix
    ) {
      const def = BASE_UNITS[base];
      const pDef = SI_PREFIXES[pfx];
      return {
        dim: def.dim,
        scale: def.scale * pDef.num,
        exactScale: def.exactScale ? ratMul(def.exactScale, pDef.rat) : null,
      };
    }
  }
  return null;
}

export function parseUnitExpression(raw: string): ParsedUnit {
  const cleaned = raw
    .trim()
    .replace(/[\u2212\u2013]/g, '-')
    .replace(/\u00B2/g, '^2')
    .replace(/\u00B3/g, '^3')
    .replace(/\u207B\u00B9/g, '^-1')
    .replace(/\u207B\u00B2/g, '^-2')
    .replace(/\u207B\u00B3/g, '^-3')
    .replace(/·|⋅|\*/g, ' ')
    .replace(/\s+/g, ' ');

  if (!cleaned) {
    return {
      canonicalRaw: '',
      dim: DIM_NONE,
      scale: 1,
      exactScale: RAT_ONE,
      offsetK: 0,
      exactOffsetK: RAT_ZERO,
      isCompound: false,
    };
  }

  const slashParts = cleaned.split('/');
  if (slashParts.length > 2) {
    throw new MathEvalLimitError(
      'AMBIGUOUS_NOTATION',
      `Ambiguous compound unit "${raw}" with multiple "/". Use exponents such as m/s^2 or m s^-2.`,
    );
  }

  const dim = [0, 0, 0, 0, 0, 0, 0];
  let scale = 1;
  let exactScale: BigRat | null = RAT_ONE;
  let totalAtoms = 0;
  let exactOffsetK: BigRat = RAT_ZERO;

  const processSide = (side: string, sign: 1 | -1) => {
    const tokens = side.trim().split(/\s+/).filter(Boolean);
    for (const tok of tokens) {
      totalAtoms += 1;
      if (totalAtoms > MATH_EVAL_LIMITS.maxUnitTokens) {
        throw new MathEvalLimitError('LIMIT_EXCEEDED', `Unit expression exceeds ${MATH_EVAL_LIMITS.maxUnitTokens} tokens.`);
      }
      const m = /^([a-zA-Z°%Ωµμ]+)(?:\^(-?\d+))?$/.exec(tok);
      if (!m) {
        throw new MathEvalLimitError('UNSUPPORTED', `Unrecognised unit token "${tok}" in "${raw}".`);
      }
      const atom = lookupUnitAtom(m[1]);
      if (!atom) {
        throw new MathEvalLimitError('UNSUPPORTED', `Unsupported unit "${m[1]}".`);
      }
      const exp = (m[2] ? Number(m[2]) : 1) * sign;
      if (!Number.isInteger(exp) || Math.abs(exp) > 4) {
        throw new MathEvalLimitError('LIMIT_EXCEEDED', `Unit exponent "${exp}" out of bounds.`);
      }
      for (let i = 0; i < 7; i++) dim[i] += atom.dim[i] * exp;
      scale *= Math.pow(atom.scale, exp);
      if (exactScale && atom.exactScale) {
        exactScale = ratMul(exactScale, ratPowInt(atom.exactScale, exp));
      } else {
        exactScale = null;
      }
      if (atom.exactOffsetK) exactOffsetK = atom.exactOffsetK;
    }
  };

  processSide(slashParts[0], 1);
  if (slashParts.length === 2) {
    if (!slashParts[1].trim()) {
      throw new MathEvalLimitError('SYNTAX_ERROR', `Missing denominator unit after "/" in "${raw}".`);
    }
    processSide(slashParts[1], -1);
  }

  const isCompound = totalAtoms > 1 || slashParts.length > 1;
  if (isCompound && exactOffsetK.n !== BigInt(0)) {
    exactOffsetK = RAT_ZERO;
  }

  return {
    canonicalRaw: cleaned,
    dim: dim as unknown as DimVec,
    scale,
    exactScale,
    offsetK: Number(exactOffsetK.n) / Number(exactOffsetK.d),
    exactOffsetK,
    isCompound,
  };
}

export function dimensionsEqual(a: DimVec, b: DimVec): boolean {
  for (let i = 0; i < 7; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function convertToBaseSI(
  value: number,
  unit: ParsedUnit,
  temperatureMode: 'absolute' | 'difference' = 'difference',
): number {
  if (!unit.isCompound && unit.offsetK !== 0 && temperatureMode === 'absolute') {
    return value * unit.scale + unit.offsetK;
  }
  return value * unit.scale;
}

export function convertExactRatToUnit(
  value: BigRat,
  fromUnit: ParsedUnit,
  toUnit: ParsedUnit,
  temperatureMode: 'absolute' | 'difference' = 'difference',
): BigRat | null {
  if (!fromUnit.exactScale || !toUnit.exactScale) return null;
  let siVal = ratMul(value, fromUnit.exactScale);
  if (!fromUnit.isCompound && fromUnit.exactOffsetK.n !== BigInt(0) && temperatureMode === 'absolute') {
    siVal = ratAdd(siVal, fromUnit.exactOffsetK);
  }
  if (!toUnit.isCompound && toUnit.exactOffsetK.n !== BigInt(0) && temperatureMode === 'absolute') {
    siVal = ratSub(siVal, toUnit.exactOffsetK);
  }
  return ratDiv(siVal, toUnit.exactScale);
}

/* ========================================================================== */
/* SIGNIFICANT FIGURES, DECIMAL PLACES & NORMALISED SCIENTIFIC NOTATION       */
/* ========================================================================== */

export interface PrecisionInspection {
  sigFigs: number | null;
  ambiguousTrailingZeros: boolean;
  decimalPlaces: number;
  isScientific: boolean;
  isNormalisedScientific: boolean;
}

export function inspectRawNumericPrecision(rawInput: string): PrecisionInspection {
  const s = rawInput
    .trim()
    .replace(/[\u2212\u2013]/g, '-')
    .replace(/^\+/, '')
    .replace(/\s*\*\s*10\^([+-]?\d+)$/, 'e$1')
    .replace(/\s*×\s*10\^([+-]?\d+)$/, 'e$1');

  const m = /^-?(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/.exec(s);
  if (!m || (m[1] === '' && (!m[2] || m[2] === ''))) {
    return { sigFigs: null, ambiguousTrailingZeros: false, decimalPlaces: 0, isScientific: false, isNormalisedScientific: false };
  }

  const intPart = m[1] || '0';
  const fracPart = m[2] ?? '';
  const hasDecimal = s.includes('.');
  const isScientific = /[eE]/.test(s);
  const mantissaAbs = Number(`${intPart}.${fracPart || '0'}`);
  const isNormalisedScientific = isScientific && mantissaAbs >= 1 && mantissaAbs < 10;
  const decimalPlaces = hasDecimal ? fracPart.length : 0;

  const combined = intPart + fracPart;
  if (/^0+$/.test(combined)) {
    return {
      sigFigs: hasDecimal ? Math.max(1, fracPart.length) : 1,
      ambiguousTrailingZeros: false,
      decimalPlaces,
      isScientific,
      isNormalisedScientific: false,
    };
  }

  const strippedLeading = combined.replace(/^0+/, '');
  if (!hasDecimal && /0+$/.test(strippedLeading)) {
    const minSf = strippedLeading.replace(/0+$/, '').length;
    return {
      sigFigs: minSf,
      ambiguousTrailingZeros: true,
      decimalPlaces: 0,
      isScientific,
      isNormalisedScientific,
    };
  }

  return {
    sigFigs: strippedLeading.length,
    ambiguousTrailingZeros: false,
    decimalPlaces,
    isScientific,
    isNormalisedScientific,
  };
}
