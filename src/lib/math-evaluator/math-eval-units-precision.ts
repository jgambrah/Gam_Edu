/**
 * GAM EDU — Step 5A Pure Module 5: Full 7-Component SI Dimensional Units & Precision/Sig-Fig Model
 *
 * Dimensional vector: [M, L, T, I, Θ, N, J]
 *   M = Mass (kg)
 *   L = Length (m)
 *   T = Time (s)
 *   I = Electric Current (A)
 *   Θ = Thermodynamic Temperature (K)
 *   N = Amount of Substance (mol)
 *   J = Luminous Intensity (cd)
 *
 * Explicitly separates:
 * - Dimensional compatibility vs conventional unit choice (e.g. J vs N·m)
 * - Absolute temperature offset (25 °C === 298.15 K) vs temperature difference (Δ25 °C === Δ25 K)
 * - Affine temperature offsets are NEVER applied to compound units!
 */

import { MATH_EVAL_LIMITS, MathEvalLimitError } from './math-eval-limits';

export type DimVec = readonly [number, number, number, number, number, number, number];

export const DIM_NONE: DimVec = [0, 0, 0, 0, 0, 0, 0];

interface UnitAtomDef {
  dim: DimVec;
  scale: number; // multiplier to base SI
  offsetK?: number; // only for °C when temperatureMode === 'absolute'
  allowPrefix?: boolean;
}

const SI_PREFIXES: Record<string, number> = {
  n: 1e-9,
  u: 1e-6,
  'µ': 1e-6,
  μ: 1e-6,
  m: 1e-3,
  c: 1e-2,
  d: 1e-1,
  k: 1e3,
  M: 1e6,
  G: 1e9,
};

const BASE_UNITS: Record<string, UnitAtomDef> = {
  // 7 SI base units
  g: { dim: [1, 0, 0, 0, 0, 0, 0], scale: 1e-3, allowPrefix: true }, // kg = 1
  m: { dim: [0, 1, 0, 0, 0, 0, 0], scale: 1, allowPrefix: true },
  s: { dim: [0, 0, 1, 0, 0, 0, 0], scale: 1, allowPrefix: true },
  A: { dim: [0, 0, 0, 1, 0, 0, 0], scale: 1, allowPrefix: true },
  K: { dim: [0, 0, 0, 0, 1, 0, 0], scale: 1, allowPrefix: false },
  mol: { dim: [0, 0, 0, 0, 0, 1, 0], scale: 1, allowPrefix: true },
  cd: { dim: [0, 0, 0, 0, 0, 0, 1], scale: 1, allowPrefix: true },

  // Common non-SI time / volume / temp / angle / dimensionless
  min: { dim: [0, 0, 1, 0, 0, 0, 0], scale: 60 },
  h: { dim: [0, 0, 1, 0, 0, 0, 0], scale: 3600 },
  hr: { dim: [0, 0, 1, 0, 0, 0, 0], scale: 3600 },
  L: { dim: [0, 3, 0, 0, 0, 0, 0], scale: 1e-3, allowPrefix: true },
  l: { dim: [0, 3, 0, 0, 0, 0, 0], scale: 1e-3, allowPrefix: true },
  '°C': { dim: [0, 0, 0, 0, 1, 0, 0], scale: 1, offsetK: 273.15 },
  C_deg: { dim: [0, 0, 0, 0, 1, 0, 0], scale: 1, offsetK: 273.15 },
  '%': { dim: DIM_NONE, scale: 0.01 },
  rad: { dim: DIM_NONE, scale: 1 },
  deg: { dim: DIM_NONE, scale: Math.PI / 180 },
  '°': { dim: DIM_NONE, scale: Math.PI / 180 },

  // Derived SI units
  N: { dim: [1, 1, -2, 0, 0, 0, 0], scale: 1, allowPrefix: true },
  J: { dim: [1, 2, -2, 0, 0, 0, 0], scale: 1, allowPrefix: true },
  W: { dim: [1, 2, -3, 0, 0, 0, 0], scale: 1, allowPrefix: true },
  Pa: { dim: [1, -1, -2, 0, 0, 0, 0], scale: 1, allowPrefix: true },
  Hz: { dim: [0, 0, -1, 0, 0, 0, 0], scale: 1, allowPrefix: true },
  C: { dim: [0, 0, 1, 1, 0, 0, 0], scale: 1, allowPrefix: true },
  V: { dim: [1, 2, -3, -1, 0, 0, 0], scale: 1, allowPrefix: true },
  ohm: { dim: [1, 2, -3, -2, 0, 0, 0], scale: 1, allowPrefix: true },
  'Ω': { dim: [1, 2, -3, -2, 0, 0, 0], scale: 1, allowPrefix: true },
};

export interface ParsedUnit {
  canonicalRaw: string;
  dim: DimVec;
  scale: number;
  offsetK: number; // non-zero ONLY for standalone °C (never compound units!)
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
      return { dim: def.dim, scale: def.scale * SI_PREFIXES[pfx] };
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
    return { canonicalRaw: '', dim: DIM_NONE, scale: 1, offsetK: 0, isCompound: false };
  }

  // Reject multiple `/` (ambiguous compound denominator like m/s/s)
  const slashParts = cleaned.split('/');
  if (slashParts.length > 2) {
    throw new MathEvalLimitError(
      'AMBIGUOUS_NOTATION',
      `Ambiguous compound unit "${raw}" with multiple "/". Use exponents such as m/s^2 or m s^-2.`,
    );
  }

  const dim = [0, 0, 0, 0, 0, 0, 0];
  let scale = 1;
  let totalAtoms = 0;
  let offsetK = 0;

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
      if (atom.offsetK) offsetK = atom.offsetK;
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
  // NEVER apply affine temperature offsets to compound units!
  if (isCompound && offsetK !== 0) {
    offsetK = 0;
  }

  return {
    canonicalRaw: cleaned,
    dim: dim as unknown as DimVec,
    scale,
    offsetK,
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

/* ========================================================================== */
/* SIGNIFICANT FIGURES & DECIMAL PLACES (FROM RAW LEARNER STRING!)            */
/* ========================================================================== */

export interface PrecisionInspection {
  sigFigs: number | null;
  ambiguousTrailingZeros: boolean;
  decimalPlaces: number;
  isScientific: boolean;
}

/** Analyses a raw numeric string (e.g. "0.0450", "12.00", "3.00e8", "1200") preserving exact written precision. */
export function inspectRawNumericPrecision(rawInput: string): PrecisionInspection {
  const s = rawInput
    .trim()
    .replace(/[\u2212\u2013]/g, '-')
    .replace(/^\+/, '')
    .replace(/\s*\*\s*10\^([+-]?\d+)$/, 'e$1')
    .replace(/\s*×\s*10\^([+-]?\d+)$/, 'e$1');

  const m = /^-?(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/.exec(s);
  if (!m || (m[1] === '' && (!m[2] || m[2] === ''))) {
    return { sigFigs: null, ambiguousTrailingZeros: false, decimalPlaces: 0, isScientific: false };
  }

  const intPart = m[1] || '0';
  const fracPart = m[2] ?? '';
  const hasDecimal = s.includes('.');
  const isScientific = /[eE]/.test(s);
  const decimalPlaces = hasDecimal ? fracPart.length : 0;

  const combined = intPart + fracPart;
  // Zero-valued answers (e.g. "0", "0.00"): significant digits after first zero or 1
  if (/^0+$/.test(combined)) {
    return {
      sigFigs: hasDecimal ? Math.max(1, fracPart.length) : 1,
      ambiguousTrailingZeros: false,
      decimalPlaces,
      isScientific,
    };
  }

  // Strip leading zeros
  const strippedLeading = combined.replace(/^0+/, '');
  if (!hasDecimal && /0+$/.test(strippedLeading)) {
    // Ambiguous integer trailing zeros (e.g. "1200"): count non-trailing digits and flag ambiguity
    const minSf = strippedLeading.replace(/0+$/, '').length;
    return {
      sigFigs: minSf,
      ambiguousTrailingZeros: true,
      decimalPlaces: 0,
      isScientific,
    };
  }

  return {
    sigFigs: strippedLeading.length,
    ambiguousTrailingZeros: false,
    decimalPlaces,
    isScientific,
  };
}
