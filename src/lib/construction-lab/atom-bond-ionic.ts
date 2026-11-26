/**
 * GAM EDU — Step 4E Pure Scientific Module 2: Ionic Bonding (Electron Transfer & Empirical Ratios)
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies.
 * Supports up to 6 ions per activity (covering NaCl [2], MgO [2], MgCl2 [3], CaCl2 [3], Al2O3 [5], Mg3N2 [5]).
 * Enforces:
 * - Supported cation and anion species with scientifically valid charges
 * - Electron transfer conservation (electrons lost by cations === electrons gained by anions)
 * - Total charge neutrality (sum of ion charges === 0)
 * - Simplest whole-number empirical formula ratio (rejects Na2Cl2 / Mg2O2 when required)
 * - Explicit framing as extended ionic lattice composition (never isolated ionic molecules)
 */

import { getElementBySymbol } from './atom-bond-atomic';

export const IONIC_LIMITS = {
  maxTotalIons: 6,
  maxCations: 3,
  maxAnions: 3,
} as const;

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export function formatEmpiricalFormula(
  cationSymbol: string,
  cationCount: number,
  anionSymbol: string,
  anionCount: number,
): string {
  const subs: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  };
  const sub = (n: number) => (n <= 1 ? '' : String(n).split('').map((c) => subs[c] ?? c).join(''));
  return `${cationSymbol}${sub(cationCount)}${anionSymbol}${sub(anionCount)}`;
}

export interface IonicEvaluationInput {
  cationElement: string;
  anionElement: string;
  targetCationCount: number;
  targetAnionCount: number;
  targetCationCharge: number; // +1..+3
  targetAnionCharge: number;  // -3..-1
  /** Learner-selected ion counts */
  cationCount: number;
  anionCount: number;
  /** Learner-transferred electrons from cations to anions */
  electronsTransferred: number;
  requireSimplestRatio?: boolean;
}

export interface IonicEvaluationResult {
  passed: boolean;
  feedback: string;
  formulaBuilt: string;
  electronsNeededToLose: number;
  electronsNeededToGain: number;
  netCharge: number;
  cationOuterAfter: number;
  anionOuterAfter: number;
}

export function evaluateIonicBonding(input: IonicEvaluationInput): IonicEvaluationResult {
  const cat = getElementBySymbol(input.cationElement);
  const an = getElementBySymbol(input.anionElement);
  const formulaBuilt = formatEmpiricalFormula(
    input.cationElement,
    input.cationCount,
    input.anionElement,
    input.anionCount,
  );

  const electronsNeededToLose = input.cationCount * input.targetCationCharge;
  const electronsNeededToGain = input.anionCount * Math.abs(input.targetAnionCharge);
  const netCharge = input.cationCount * input.targetCationCharge + input.anionCount * input.targetAnionCharge;

  // Dot-and-cross outer-shell electron count per ion after transfer
  const lostPerCation = input.cationCount > 0 ? input.electronsTransferred / input.cationCount : 0;
  const gainedPerAnion = input.anionCount > 0 ? input.electronsTransferred / input.anionCount : 0;
  const cationOuterAfter = cat ? Math.max(0, cat.valenceElectrons - lostPerCation) : 0;
  const anionOuterAfter = an ? an.valenceElectrons + gainedPerAnion : 0;

  const base = {
    formulaBuilt,
    electronsNeededToLose,
    electronsNeededToGain,
    netCharge,
    cationOuterAfter,
    anionOuterAfter,
  };

  if (!cat || !an) {
    return { ...base, passed: false, feedback: 'Unsupported cation or anion element.' };
  }

  if (input.cationCount < 1 || input.anionCount < 1 || input.cationCount + input.anionCount > IONIC_LIMITS.maxTotalIons) {
    return {
      ...base,
      passed: false,
      feedback: `Choose at least 1 ${cat.symbol} and 1 ${an.symbol} atom (up to ${IONIC_LIMITS.maxTotalIons} ions in total).`,
    };
  }

  // 1. Check charge neutrality
  if (netCharge !== 0) {
    return {
      ...base,
      passed: false,
      feedback: `Total charge is not balanced yet: ${input.cationCount} × (${cat.symbol}${input.targetCationCharge}+) + ${input.anionCount} × (${an.symbol}${Math.abs(input.targetAnionCharge)}−) gives net charge ${netCharge > 0 ? `+${netCharge}` : netCharge}. Adjust the ion ratio so total positive charge equals total negative charge.`,
    };
  }

  // 2. Reject electrically neutral but non-simplest ratio when simplest ratio is required
  const requireSimplest = input.requireSimplestRatio !== false;
  const g = gcd(input.cationCount, input.anionCount);
  if (requireSimplest && g > 1) {
    const simpleFormula = formatEmpiricalFormula(
      cat.symbol,
      input.cationCount / g,
      an.symbol,
      input.anionCount / g,
    );
    return {
      ...base,
      passed: false,
      feedback: `${formulaBuilt} is electrically neutral, but ionic formulae must be written in their simplest whole-number empirical ratio. Divide by ${g} to get ${simpleFormula}.`,
    };
  }

  // 3. Check exact electron transfer conservation
  if (input.electronsTransferred !== electronsNeededToLose) {
    return {
      ...base,
      passed: false,
      feedback: `Your ion ratio (${formulaBuilt}) is balanced, but ${input.electronsTransferred} electron(s) have been transferred instead of ${electronsNeededToLose}. Each ${cat.symbol} atom must transfer ${input.targetCationCharge} outer electron(s) so every ${an.symbol} atom completes its outer shell.`,
    };
  }

  // 4. Verify counts match target
  if (input.cationCount !== input.targetCationCount || input.anionCount !== input.targetAnionCount) {
    return {
      ...base,
      passed: false,
      feedback: `Check your empirical ratio: expected ${formatEmpiricalFormula(cat.symbol, input.targetCationCount, an.symbol, input.targetAnionCount)}.`,
    };
  }

  return {
    ...base,
    passed: true,
    feedback: `Verified: ${input.electronsTransferred} outer electron(s) transferred from ${input.cationCount} ${cat.symbol} atom(s) to ${input.anionCount} ${an.symbol} atom(s), forming ${input.cationCount} ${cat.symbol}${input.targetCationCharge > 1 ? input.targetCationCharge : ''}⁺ and ${input.anionCount} ${an.symbol}${Math.abs(input.targetAnionCharge) > 1 ? Math.abs(input.targetAnionCharge) : ''}⁻ ions (empirical formula ${formulaBuilt} representing an extended ionic lattice, not an isolated molecule).`,
  };
}
