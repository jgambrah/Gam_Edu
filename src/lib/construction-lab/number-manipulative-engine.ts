/**
 * GAM EDU — Step 5F Pure TypeScript Engine: Primary Number Manipulatives (CPA)
 * (`construction-lab`, `labKind: 'number-manipulative'`, `engineVersion: '1.7.0'`)
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies, zero eval().
 * Exact integer & integer-rational arithmetic throughout — ZERO floating-point drift
 * in fractions, decimal place value, or Ghanaian currency (integer pesewas).
 */

export const NUMBER_MANIPULATIVE_LIMITS = {
  maxTenFrameCount: 20,
  maxBaseTenBlocksPerPlace: 30,
  maxNumberLineSpan: 200,
  maxArrayDim: 12,
  maxGroups: 12,
  maxFractionDenominator: 24,
  maxCoinsOrNotesTotal: 30,
  maxPatternLength: 16,
} as const;

export type NumberManipulativeMode =
  | 'counting-ten-frame'
  | 'number-bonds'
  | 'base-ten-place-value'
  | 'number-line'
  | 'arrays-grouping'
  | 'fractions-decimals'
  | 'ghana-money'
  | 'analogue-clock'
  | 'patterns';

/* ========================================================================== */
/* 1. EXACT INTEGER RATIONAL HELPER (FRACTIONS)                               */
/* ========================================================================== */

export function intGcd(a: number, b: number): number {
  let x = Math.abs(Math.trunc(a));
  let y = Math.abs(Math.trunc(b));
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x === 0 ? 1 : x;
}

export interface ExactFraction {
  n: number;
  d: number;
}

export function reduceFraction(n: number, d: number): ExactFraction {
  if (!Number.isInteger(n) || !Number.isInteger(d) || d <= 0) {
    throw new Error('Fraction numerator must be integer and denominator must be positive integer.');
  }
  if (n === 0) return { n: 0, d: 1 };
  const g = intGcd(n, d);
  return { n: n / g, d: d / g };
}

export function areFractionsEquivalent(a: ExactFraction, b: ExactFraction): boolean {
  if (a.d <= 0 || b.d <= 0) return false;
  return a.n * b.d === b.n * a.d;
}

export function improperToMixed(n: number, d: number): { whole: number; remNum: number; den: number } {
  const red = reduceFraction(n, d);
  const whole = Math.trunc(red.n / red.d);
  const remNum = Math.abs(red.n % red.d);
  return { whole, remNum, den: red.d };
}

/* ========================================================================== */
/* 2. GHANAIAN CURRENCY (EXACT INTEGER PESEWAS — BANK OF GHANA)               */
/* ========================================================================== */

export interface GhanaCurrencyDenom {
  id: string;
  label: string;
  pesewas: number;
  kind: 'coin' | 'note';
}

export const GHANA_DENOMINATIONS: readonly GhanaCurrencyDenom[] = [
  { id: '1p', label: '1 Gp', pesewas: 1, kind: 'coin' },
  { id: '5p', label: '5 Gp', pesewas: 5, kind: 'coin' },
  { id: '10p', label: '10 Gp', pesewas: 10, kind: 'coin' },
  { id: '20p', label: '20 Gp', pesewas: 20, kind: 'coin' },
  { id: '50p', label: '50 Gp', pesewas: 50, kind: 'coin' },
  { id: '1c', label: 'GH₵1', pesewas: 100, kind: 'coin' },
  { id: '2c', label: 'GH₵2', pesewas: 200, kind: 'coin' },
  { id: '5c', label: 'GH₵5', pesewas: 500, kind: 'note' },
  { id: '10c', label: 'GH₵10', pesewas: 1000, kind: 'note' },
  { id: '20c', label: 'GH₵20', pesewas: 2000, kind: 'note' },
  { id: '50c', label: 'GH₵50', pesewas: 5000, kind: 'note' },
  { id: '100c', label: 'GH₵100', pesewas: 10000, kind: 'note' },
  { id: '200c', label: 'GH₵200', pesewas: 20000, kind: 'note' },
] as const;

export const VALID_GHANA_DENOM_IDS = new Set(GHANA_DENOMINATIONS.map((d) => d.id));
export const GHANA_DENOM_BY_ID = new Map(GHANA_DENOMINATIONS.map((d) => [d.id, d]));

export function formatGhanaPesewas(pesewas: number): string {
  const p = Math.trunc(pesewas);
  const sign = p < 0 ? '-' : '';
  const abs = Math.abs(p);
  if (abs < 100) return `${sign}${abs} Gp`;
  const cedis = Math.floor(abs / 100);
  const rem = abs % 100;
  return `${sign}GH₵${cedis}.${String(rem).padStart(2, '0')}`;
}

export function sumGhanaCountsPesewas(counts: Readonly<Record<string, number>>): number {
  let total = 0;
  for (const [id, qty] of Object.entries(counts)) {
    const denom = GHANA_DENOM_BY_ID.get(id);
    if (!denom || !Number.isInteger(qty) || qty < 0) continue;
    total += denom.pesewas * qty;
  }
  return total;
}

/** Exact DP minimum coin/note count for a given allowed denomination subset & target pesewas. */
export function computeMinimumGhanaPieces(
  targetPesewas: number,
  allowedDenomIds: readonly string[],
): number | null {
  if (!Number.isInteger(targetPesewas) || targetPesewas < 0) return null;
  if (targetPesewas === 0) return 0;
  const vals = allowedDenomIds
    .map((id) => GHANA_DENOM_BY_ID.get(id)?.pesewas)
    .filter((v): v is number => typeof v === 'number' && v > 0);
  if (vals.length === 0) return null;
  // Scale down by GCD of vals and target for fast bounded DP even on large GH₵ amounts
  const g = vals.reduce((acc, v) => intGcd(acc, v), targetPesewas);
  const scaledTarget = targetPesewas / g;
  const scaledVals = vals.map((v) => v / g);
  if (scaledTarget > 100_000) return null; // ~1.3M operations worst case; a GH₵200 target in 1 Gp pieces is 20,000
  const INF = 1e9;
  const dp = new Int32Array(scaledTarget + 1).fill(INF);
  dp[0] = 0;
  for (let amt = 1; amt <= scaledTarget; amt++) {
    for (const v of scaledVals) {
      if (v <= amt && dp[amt - v] + 1 < dp[amt]) {
        dp[amt] = dp[amt - v] + 1;
      }
    }
  }
  return dp[scaledTarget] >= INF ? null : dp[scaledTarget];
}

/* ========================================================================== */
/* 3. ANALOGUE CLOCK (CONTINUOUS HOUR-HAND KINEMATICS)                        */
/* ========================================================================== */

export interface ClockAngles {
  /** Exact continuous hour hand angle in degrees clockwise from 12 o'clock: ((h % 12) + m / 60) * 30 */
  hourAngleDeg: number;
  /** Exact minute hand angle in degrees clockwise from 12 o'clock: m * 6 */
  minuteAngleDeg: number;
}

export function computeClockHandAngles(hours: number, minutes: number): ClockAngles {
  const normMin = ((Math.trunc(minutes) % 60) + 60) % 60;
  const normHr12 = ((Math.trunc(hours) % 12) + 12) % 12;
  return {
    hourAngleDeg: Number(((normHr12 + normMin / 60) * 30).toFixed(4)),
    minuteAngleDeg: normMin * 6,
  };
}

export function formatTime12h(totalMinutes: number): string {
  const m = ((Math.trunc(totalMinutes) % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const min = m % 60;
  const period = h24 < 12 ? 'AM' : 'PM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(min).padStart(2, '0')} ${period}`;
}

export function formatTime24h(totalMinutes: number): string {
  const m = ((Math.trunc(totalMinutes) % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h24).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

/* ========================================================================== */
/* 4. BASE-TEN PLACE VALUE (CANONICAL & NON-CANONICAL REGROUPING)             */
/* ========================================================================== */

export interface BaseTenState {
  thousands: number;
  hundreds: number;
  tens: number;
  ones: number;
}

export function evaluateBaseTenValue(s: BaseTenState): number {
  return s.thousands * 1000 + s.hundreds * 100 + s.tens * 10 + s.ones;
}

export function isBaseTenCanonical(s: BaseTenState): boolean {
  return (
    s.ones >= 0 &&
    s.ones <= 9 &&
    s.tens >= 0 &&
    s.tens <= 9 &&
    s.hundreds >= 0 &&
    s.hundreds <= 9 &&
    s.thousands >= 0
  );
}

export function regroupBaseTen(
  s: BaseTenState,
  op: 'ones-to-ten' | 'ten-to-ones' | 'tens-to-hundred' | 'hundred-to-tens' | 'hundreds-to-thousand' | 'thousand-to-hundreds',
): BaseTenState | null {
  const next = { ...s };
  if (op === 'ones-to-ten') {
    if (next.ones < 10) return null;
    next.ones -= 10;
    next.tens += 1;
    return next;
  }
  if (op === 'ten-to-ones') {
    if (next.tens < 1 || next.ones + 10 > NUMBER_MANIPULATIVE_LIMITS.maxBaseTenBlocksPerPlace) return null;
    next.tens -= 1;
    next.ones += 10;
    return next;
  }
  if (op === 'tens-to-hundred') {
    if (next.tens < 10) return null;
    next.tens -= 10;
    next.hundreds += 1;
    return next;
  }
  if (op === 'hundred-to-tens') {
    if (next.hundreds < 1 || next.tens + 10 > NUMBER_MANIPULATIVE_LIMITS.maxBaseTenBlocksPerPlace) return null;
    next.hundreds -= 1;
    next.tens += 10;
    return next;
  }
  if (op === 'hundreds-to-thousand') {
    if (next.hundreds < 10) return null;
    next.hundreds -= 10;
    next.thousands += 1;
    return next;
  }
  if (next.thousands < 1 || next.hundreds + 10 > NUMBER_MANIPULATIVE_LIMITS.maxBaseTenBlocksPerPlace) return null;
  next.thousands -= 1;
  next.hundreds += 10;
  return next;
}

/* ========================================================================== */
/* 5. DISCRIMINATED SPEC UNION & DETERMINISTIC EVALUATORS                     */
/* ========================================================================== */

export interface CountingTenFrameSpec {
  mode: 'counting-ten-frame';
  frameCount: 1 | 2;
  targetCount: number;
  initialCount?: number;
  twoColorSplit?: { firstColorTarget: number; secondColorTarget: number };
}

export interface NumberBondsSpec {
  mode: 'number-bonds';
  whole: number;
  knownParts: number[];
  missingRole: 'whole' | 'part';
  expectedValue: number;
  maxValue?: number;
}

export interface BaseTenPlaceValueSpec {
  mode: 'base-ten-place-value';
  maxPlace: 'tens' | 'hundreds' | 'thousands';
  targetNumber: number;
  initialBlocks?: Partial<BaseTenState>;
  requireCanonical?: boolean;
}

export interface NumberLineSpec {
  mode: 'number-line';
  min: number;
  max: number;
  step: number;
  startValue: number;
  targetValue: number;
  jumpSizes?: number[];
}

export interface ArraysGroupingSpec {
  mode: 'arrays-grouping';
  taskKind: 'multiplication-array' | 'equal-grouping' | 'division-remainder';
  targetTotal: number;
  /** For multiplication-array: required rows/cols (commutative unless ordered=true). For division: divisor. */
  divisorOrFactor?: number;
  requireExactOrder?: boolean;
  expectedRows?: number;
  expectedCols?: number;
}

export interface FractionsDecimalsSpec {
  mode: 'fractions-decimals';
  representation: 'fraction-bar' | 'fraction-circle' | 'decimal-place-value';
  /** For fraction modes: exact target numerator/denominator (equivalent fractions accepted unless exactDenominator=true) */
  targetNumerator?: number;
  targetDenominator?: number;
  initialDenominator?: number;
  allowDenominatorChange?: boolean;
  requireExactDenominator?: boolean;
  /** For decimal-place-value: exact target value in integer hundredths (e.g. 235 = 2.35) */
  targetHundredths?: number;
}

export interface GhanaMoneySpec {
  mode: 'ghana-money';
  taskKind: 'exact-amount' | 'make-change' | 'minimum-coins';
  allowedDenomIds: string[];
  targetPesewas?: number;
  costPesewas?: number;
  paidPesewas?: number;
}

export interface AnalogueClockSpec {
  mode: 'analogue-clock';
  taskKind: 'set-time' | 'elapsed-time';
  startHours: number;
  startMinutes: number;
  targetHours: number;
  targetMinutes: number;
  minuteStep?: 1 | 5 | 15;
  use24Hour?: boolean;
}

export interface PatternsSpec {
  mode: 'patterns';
  patternKind: 'repeating' | 'growing';
  givenSequence: string[];
  expectedNext: string[];
  palette: string[];
}

export type NumberManipulativeSpec =
  | CountingTenFrameSpec
  | NumberBondsSpec
  | BaseTenPlaceValueSpec
  | NumberLineSpec
  | ArraysGroupingSpec
  | FractionsDecimalsSpec
  | GhanaMoneySpec
  | AnalogueClockSpec
  | PatternsSpec;

export interface ManipulativeEvalResult {
  passed: boolean;
  feedback: string;
}

/** Audit CP3: evaluators must fail closed on negative, fractional, non-finite or out-of-range learner state. */
const isWhole = (n: unknown): n is number => typeof n === 'number' && Number.isSafeInteger(n) && n >= 0;
const invalidInput = (what: string): ManipulativeEvalResult => ({
  passed: false,
  feedback: `${what} must be whole numbers (0 or greater) within the allowed range.`,
});

export function evaluateTenFrame(
  spec: CountingTenFrameSpec,
  firstCount: number,
  secondCount = 0,
): ManipulativeEvalResult {
  if (!isWhole(firstCount) || !isWhole(secondCount)) return invalidInput('Counter counts');
  const capacity = Math.min(NUMBER_MANIPULATIVE_LIMITS.maxTenFrameCount, (spec.frameCount ?? 2) * 10);
  if (firstCount + secondCount > capacity) {
    return { passed: false, feedback: `This ten frame holds at most ${capacity} counters.` };
  }
  const total = firstCount + secondCount;
  if (spec.twoColorSplit) {
    const { firstColorTarget, secondColorTarget } = spec.twoColorSplit;
    const sumTarget = firstColorTarget + secondColorTarget;
    if (
      total === sumTarget &&
      ((firstCount === firstColorTarget && secondCount === secondColorTarget) ||
        (firstCount === secondColorTarget && secondCount === firstColorTarget))
    ) {
      return {
        passed: true,
        feedback: `Well done! ${firstCount} + ${secondCount} = ${total} on the ten frame.`,
      };
    }
    return {
      passed: false,
      feedback: `You placed ${firstCount} blue and ${secondCount} amber counters (total ${total}). Build ${firstColorTarget} + ${secondColorTarget} = ${sumTarget}.`,
    };
  }
  if (total === spec.targetCount) {
    return { passed: true, feedback: `Great counting! You built exactly ${spec.targetCount}.` };
  }
  return {
    passed: false,
    feedback: `You have ${total} counter${total === 1 ? '' : 's'}. Target is ${spec.targetCount}.`,
  };
}

export function evaluateNumberBond(spec: NumberBondsSpec, learnerValue: number): ManipulativeEvalResult {
  if (!Number.isInteger(learnerValue) || learnerValue < 0) {
    return { passed: false, feedback: 'Enter a whole number (0 or greater).' };
  }
  if (learnerValue === spec.expectedValue) {
    const sumDesc =
      spec.missingRole === 'whole'
        ? `${spec.knownParts.join(' + ')} = ${learnerValue}`
        : `${spec.knownParts.join(' + ')} + ${learnerValue} = ${spec.whole}`;
    return { passed: true, feedback: `Spot on! Number bond verified: ${sumDesc}.` };
  }
  return {
    passed: false,
    feedback: `Not quite — check how the parts add up to make the whole (${spec.missingRole === 'whole' ? `add ${spec.knownParts.join(' + ')}` : `parts must sum to ${spec.whole}`}).`,
  };
}

export function evaluateBaseTen(spec: BaseTenPlaceValueSpec, state: BaseTenState): ManipulativeEvalResult {
  const maxBlocks = NUMBER_MANIPULATIVE_LIMITS.maxBaseTenBlocksPerPlace;
  for (const v of [state.thousands, state.hundreds, state.tens, state.ones]) {
    if (!isWhole(v) || v > maxBlocks) return invalidInput(`Block counts (at most ${maxBlocks} per place)`);
  }
  const val = evaluateBaseTenValue(state);
  if (val !== spec.targetNumber) {
    return {
      passed: false,
      feedback: `Your blocks currently show ${val} (${state.thousands} thousands, ${state.hundreds} hundreds, ${state.tens} tens, ${state.ones} ones). Target is ${spec.targetNumber}.`,
    };
  }
  if (spec.requireCanonical && !isBaseTenCanonical(state)) {
    return {
      passed: false,
      feedback: `Your total is ${val}, which is right! Now regroup (exchange 10 smaller blocks for 1 larger block) so each column has 0–9 blocks.`,
    };
  }
  return {
    passed: true,
    feedback: isBaseTenCanonical(state)
      ? `Verified! ${val} represented in canonical base-ten form.`
      : `Verified! Equivalent non-canonical base-ten regrouping of ${val} accepted!`,
  };
}

export function evaluateNumberLine(spec: NumberLineSpec, currentValue: number): ManipulativeEvalResult {
  if (Math.abs(currentValue - spec.targetValue) < 1e-9) {
    return {
      passed: true,
      feedback: `Spot on! You landed on ${spec.targetValue} on the number line.`,
    };
  }
  return {
    passed: false,
    feedback: `You are currently at ${currentValue}. Move along the number line to land on ${spec.targetValue}.`,
  };
}

export function evaluateArraysGrouping(
  spec: ArraysGroupingSpec,
  input: { rows?: number; cols?: number; groups?: number; groupSize?: number; remainder?: number },
): ManipulativeEvalResult {
  for (const v of [input.rows, input.cols, input.groups, input.groupSize, input.remainder]) {
    if (v !== undefined && !isWhole(v)) return invalidInput('Rows, columns, groups, group sizes and remainders');
  }
  if (spec.taskKind === 'multiplication-array') {
    const r = input.rows ?? 0;
    const c = input.cols ?? 0;
    const prod = r * c;
    if (spec.expectedRows !== undefined && spec.expectedCols !== undefined) {
      const exact = r === spec.expectedRows && c === spec.expectedCols;
      const comm = r === spec.expectedCols && c === spec.expectedRows;
      if (exact || (!spec.requireExactOrder && comm)) {
        return { passed: true, feedback: `Verified! Your ${r} × ${c} array shows ${prod} counters.` };
      }
      return {
        passed: false,
        feedback: `Your array is ${r} × ${c} = ${prod}. Build a ${spec.expectedRows} × ${spec.expectedCols} array (${spec.expectedRows * spec.expectedCols}).`,
      };
    }
    if (prod === spec.targetTotal && r >= 1 && c >= 1) {
      return { passed: true, feedback: `Verified! ${r} × ${c} = ${prod}.` };
    }
    return { passed: false, feedback: `Your array has ${r} × ${c} = ${prod} counters. Target total is ${spec.targetTotal}.` };
  }

  if (spec.taskKind === 'equal-grouping') {
    const g = input.groups ?? 0;
    const gs = input.groupSize ?? 0;
    const d = spec.divisorOrFactor;
    if (g * gs === spec.targetTotal && (!d || g === d || gs === d)) {
      return { passed: true, feedback: `Verified! ${g} equal groups of ${gs} make ${spec.targetTotal}.` };
    }
    return {
      passed: false,
      feedback: `${g} groups of ${gs} makes ${g * gs}. Share ${spec.targetTotal} equally${d ? ` using ${d}` : ''}.`,
    };
  }

  // division-remainder: dividend = divisor * quotient + remainder, 0 <= remainder < divisor
  const divisor = spec.divisorOrFactor ?? 1;
  const q = input.groupSize ?? 0;
  const rem = input.remainder ?? 0;
  if (rem < 0 || rem >= divisor) {
    return {
      passed: false,
      feedback: `Remainder (${rem}) must be less than the divisor (${divisor}). You can make another full group!`,
    };
  }
  if (divisor * q + rem === spec.targetTotal) {
    return {
      passed: true,
      feedback: `Verified! ${spec.targetTotal} ÷ ${divisor} = ${q} remainder ${rem} (${divisor} × ${q} + ${rem} = ${spec.targetTotal}).`,
    };
  }
  return {
    passed: false,
    feedback: `${divisor} × ${q} + ${rem} = ${divisor * q + rem}, not ${spec.targetTotal}. Adjust the quotient and remainder.`,
  };
}

export function evaluateFractionsDecimals(
  spec: FractionsDecimalsSpec,
  input: { numerator?: number; denominator?: number; ones?: number; tenths?: number; hundredths?: number },
): ManipulativeEvalResult {
  if (spec.representation === 'decimal-place-value') {
    const o = input.ones ?? 0;
    const t = input.tenths ?? 0;
    const h = input.hundredths ?? 0;
    for (const v of [o, t, h]) {
      if (!isWhole(v) || v > NUMBER_MANIPULATIVE_LIMITS.maxBaseTenBlocksPerPlace) {
        return invalidInput(`Place-value counts (at most ${NUMBER_MANIPULATIVE_LIMITS.maxBaseTenBlocksPerPlace} per place)`);
      }
    }
    const totalHundredths = o * 100 + t * 10 + h;
    const target = spec.targetHundredths ?? 0;
    const fmt = (val: number) => `${Math.floor(val / 100)}.${String(val % 100).padStart(2, '0')}`;
    if (totalHundredths === target) {
      return { passed: true, feedback: `Verified! Your decimal place-value mat shows ${fmt(totalHundredths)}.` };
    }
    return {
      passed: false,
      feedback: `Your mat shows ${fmt(totalHundredths)} (${o} ones, ${t} tenths, ${h} hundredths). Target is ${fmt(target)}.`,
    };
  }

  const n = input.numerator ?? 0;
  const d = input.denominator ?? 1;
  const tn = spec.targetNumerator ?? 0;
  const td = spec.targetDenominator ?? 1;
  if (!Number.isSafeInteger(d) || d <= 0) return { passed: false, feedback: 'Denominator must be a positive whole number.' };
  if (!isWhole(n)) return invalidInput('The numerator');

  if (areFractionsEquivalent({ n, d }, { n: tn, d: td })) {
    if (spec.requireExactDenominator && d !== td) {
      return {
        passed: false,
        feedback: `${n}/${d} is equivalent to ${tn}/${td}, but this task asks for denominator ${td}.`,
      };
    }
    const mixedNote =
      n > d
        ? ` (mixed number: ${Math.floor(n / d)} ${n % d}/${d})`
        : '';
    return {
      passed: true,
      feedback: `Verified! ${n}/${d} equals ${tn}/${td}${mixedNote}.`,
    };
  }
  return {
    passed: false,
    feedback: `You shaded ${n}/${d}, which is not equivalent to ${tn}/${td}.`,
  };
}

export function evaluateGhanaMoney(
  spec: GhanaMoneySpec,
  counts: Readonly<Record<string, number>>,
): ManipulativeEvalResult {
  // Audit CP3: only task-approved denominations, with whole non-negative counts, may be graded.
  const allowed = spec.allowedDenomIds && spec.allowedDenomIds.length > 0 ? new Set(spec.allowedDenomIds) : null;
  for (const [id, qty] of Object.entries(counts)) {
    if (!VALID_GHANA_DENOM_IDS.has(id)) return { passed: false, feedback: `"${id}" is not a Ghana coin or note.` };
    if (!isWhole(qty)) return invalidInput('Coin and note counts');
    if (qty > 0 && allowed && !allowed.has(id)) {
      return { passed: false, feedback: `${GHANA_DENOM_BY_ID.get(id)!.label} is not one of the coins/notes allowed in this task.` };
    }
  }
  const totalP = sumGhanaCountsPesewas(counts);
  const pieceCount = Object.values(counts).reduce((a, b) => a + (Number.isInteger(b) && b > 0 ? b : 0), 0);
  const expectedP =
    spec.taskKind === 'make-change'
      ? (spec.paidPesewas ?? 0) - (spec.costPesewas ?? 0)
      : (spec.targetPesewas ?? 0);

  if (totalP !== expectedP) {
    return {
      passed: false,
      feedback: `Your tray totals ${formatGhanaPesewas(totalP)}. Target ${spec.taskKind === 'make-change' ? 'change' : 'amount'} is ${formatGhanaPesewas(expectedP)}.`,
    };
  }

  if (spec.taskKind === 'minimum-coins') {
    const minPieces = computeMinimumGhanaPieces(expectedP, spec.allowedDenomIds);
    if (minPieces === null) {
      // Fail closed: if minimality cannot be established, never claim the learner used the minimum.
      return { passed: false, feedback: 'The minimum number of coins/notes cannot be verified for this task, so it cannot be marked correct.' };
    }
    if (pieceCount > minPieces) {
      return {
        passed: false,
        feedback: `Your total ${formatGhanaPesewas(totalP)} is right, using ${pieceCount} pieces — try using fewer coins/notes (minimum possible is ${minPieces})!`,
      };
    }
    return {
      passed: true,
      feedback: `Verified! ${formatGhanaPesewas(totalP)} made with the minimum ${pieceCount} Ghanaian coin(s)/note(s).`,
    };
  }

  return {
    passed: true,
    feedback: `Verified! ${formatGhanaPesewas(totalP)} (${pieceCount} piece${pieceCount === 1 ? '' : 's'}).`,
  };
}

export function evaluateAnalogueClock(
  spec: AnalogueClockSpec,
  learnerTotalMinutes: number,
): ManipulativeEvalResult {
  const targetMod = spec.use24Hour ? 1440 : 720;
  const targetMins = ((spec.targetHours * 60 + spec.targetMinutes) % targetMod + targetMod) % targetMod;
  const learnerMins = ((Math.trunc(learnerTotalMinutes) % targetMod) + targetMod) % targetMod;
  if (learnerMins === targetMins) {
    const display = spec.use24Hour ? formatTime24h(learnerTotalMinutes) : formatTime12h(learnerTotalMinutes);
    return { passed: true, feedback: `Spot on! Clock set accurately to ${display}.` };
  }
  const currentDisplay = spec.use24Hour ? formatTime24h(learnerTotalMinutes) : formatTime12h(learnerTotalMinutes);
  return {
    passed: false,
    feedback: `The clock currently reads ${currentDisplay}. Adjust the hands to the target time.`,
  };
}

export function evaluatePattern(spec: PatternsSpec, learnerNext: readonly string[]): ManipulativeEvalResult {
  if (learnerNext.length !== spec.expectedNext.length) {
    return {
      passed: false,
      feedback: `Add ${spec.expectedNext.length} next term${spec.expectedNext.length === 1 ? '' : 's'} to continue the pattern (currently ${learnerNext.length}).`,
    };
  }
  const allMatch = spec.expectedNext.every((exp, i) => learnerNext[i] === exp);
  if (allMatch) {
    return {
      passed: true,
      feedback: `Verified! Pattern continued accurately: ${[...spec.givenSequence, ...learnerNext].join(', ')}.`,
    };
  }
  return {
    passed: false,
    feedback: `Check the ${spec.patternKind} rule carefully and try again.`,
  };
}
