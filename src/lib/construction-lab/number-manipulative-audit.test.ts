/**
 * Audit CP3 (Step 5F): independent verification of the Primary Number Manipulatives evaluators.
 * Expected values come from first principles here (own change-making DP, own clock arithmetic), and adversarial inputs
 * (negative, fractional, NaN, out-of-range) must never be graded as a verified learner result.
 */
import { describe, expect, it } from 'vitest';
import {
  GHANA_DENOMINATIONS,
  computeClockHandAngles,
  computeMinimumGhanaPieces,
  evaluateAnalogueClock,
  evaluateArraysGrouping,
  evaluateBaseTen,
  evaluateFractionsDecimals,
  evaluateGhanaMoney,
  evaluateNumberBond,
  evaluateTenFrame,
  type GhanaMoneySpec,
  improperToMixed,
  regroupBaseTen,
  reduceFraction,
  evaluateBaseTenValue,
} from './number-manipulative-engine';

describe('Ghana money: independent exact change-making oracle', () => {
  const brute = (target: number, vals: number[]): number | null => {
    const dp = Array(target + 1).fill(Infinity); dp[0] = 0;
    for (let a = 1; a <= target; a++) for (const v of vals) if (v <= a && dp[a - v] + 1 < dp[a]) dp[a] = dp[a - v] + 1;
    return Number.isFinite(dp[target]) ? dp[target] : null;
  };
  it('denominations are the circulating Bank of Ghana set (1,5,10,20,50 pesewas; GHS 1,2 coins; 5,10,20,50,100,200 notes)', () => {
    expect(GHANA_DENOMINATIONS.map((d) => d.pesewas)).toEqual([1, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]);
  });
  it('minimum pieces equals brute force for every amount 0..2500 pesewas on the full set and on awkward subsets', () => {
    const subsets: string[][] = [GHANA_DENOMINATIONS.map((d) => d.id), ['20p', '50p', '1c'], ['5p', '20p', '50p'], ['10p', '50p', '2c'], ['1p', '1c', '5c']];
    for (const ids of subsets) {
      const vals = ids.map((id) => GHANA_DENOMINATIONS.find((d) => d.id === id)!.pesewas);
      for (let t = 0; t <= 2500; t++) expect(computeMinimumGhanaPieces(t, ids), `${t}p with ${ids}`).toBe(brute(t, vals));
    }
  });
  it('FAIL-CLOSED: when the minimum cannot be computed, a non-minimal answer must not be reported as the minimum', () => {
    // 6000 pesewas using only 1 Gp coins: minimum is 6000 pieces. The DP bound returns null; the grader must not say "minimum".
    const spec: GhanaMoneySpec = { mode: 'ghana-money', taskKind: 'minimum-coins', allowedDenomIds: ['1p', '5c'], targetPesewas: 6000 };
    // learner uses 12 x GH5 notes (=6000p)? 5c = 500p -> 12 notes = minimum is 12? with {1p,500p}: 6000 = 12*500 -> min 12.
    const minimal = evaluateGhanaMoney(spec, { '5c': 12 });
    expect(minimal.passed).toBe(true);
    const wasteful = evaluateGhanaMoney(spec, { '5c': 11, '1p': 500 }); // 5500 + 500 = 6000 with 511 pieces
    expect(wasteful.passed, 'a 511-piece answer when 12 suffices must not be accepted as the minimum').toBe(false);
  });
  it('a denomination outside the task allow-list must not be accepted', () => {
    const spec: GhanaMoneySpec = { mode: 'ghana-money', taskKind: 'minimum-coins', allowedDenomIds: ['20p', '50p', '1c'], targetPesewas: 500 };
    // 500p with allowed {20p,50p,100p} needs 5 x 1c; one GH5 note (not allowed) must not pass as "1 piece"
    expect(evaluateGhanaMoney(spec, { '5c': 1 }).passed).toBe(false);
  });
  it('make-change arithmetic', () => {
    const spec: GhanaMoneySpec = { mode: 'ghana-money', taskKind: 'make-change', allowedDenomIds: ['1c', '2c', '5c', '10c'], costPesewas: 1350, paidPesewas: 2000 };
    expect(evaluateGhanaMoney(spec, { '5c': 1, '1c': 1, '50p': 1 }).passed, 'change is GHS 6.50').toBe(false); // 50p not allowed in this task
    expect(evaluateGhanaMoney({ ...spec, allowedDenomIds: ['50p', '1c', '5c'] }, { '5c': 1, '1c': 1, '50p': 1 }).passed).toBe(true);
  });
});

describe('analogue clock: independent kinematics', () => {
  it('hand angles for known times', () => {
    expect(computeClockHandAngles(3, 0)).toEqual({ hourAngleDeg: 90, minuteAngleDeg: 0 });
    expect(computeClockHandAngles(6, 30)).toEqual({ hourAngleDeg: 195, minuteAngleDeg: 180 });
    expect(computeClockHandAngles(12, 0)).toEqual({ hourAngleDeg: 0, minuteAngleDeg: 0 });
    expect(computeClockHandAngles(9, 45)).toEqual({ hourAngleDeg: 292.5, minuteAngleDeg: 270 });
    expect(computeClockHandAngles(0, 0).hourAngleDeg).toBe(0);
  });
  it('12-hour set-time accepts 3:00 at 3:00 and 15:00 (same dial position) but not 3:05', () => {
    const spec = { mode: 'analogue-clock', taskKind: 'set-time', startHours: 12, startMinutes: 0, targetHours: 3, targetMinutes: 0 } as const;
    expect(evaluateAnalogueClock(spec, 180).passed).toBe(true);
    expect(evaluateAnalogueClock(spec, 15 * 60).passed).toBe(true);
    expect(evaluateAnalogueClock(spec, 185).passed).toBe(false);
  });
  it('24-hour mode distinguishes 03:00 from 15:00', () => {
    const spec = { mode: 'analogue-clock', taskKind: 'set-time', startHours: 0, startMinutes: 0, targetHours: 15, targetMinutes: 0, use24Hour: true } as const;
    expect(evaluateAnalogueClock(spec, 15 * 60).passed).toBe(true);
    expect(evaluateAnalogueClock(spec, 3 * 60).passed).toBe(false);
  });
});

describe('place value and fractions: invariants', () => {
  it('regrouping always conserves the numeric value (all 6 operations, many states)', () => {
    const ops = ['ones-to-ten', 'ten-to-ones', 'tens-to-hundred', 'hundred-to-tens', 'hundreds-to-thousand', 'thousand-to-hundreds'] as const;
    for (let th = 0; th <= 3; th++) for (let h = 0; h <= 12; h++) for (let t = 0; t <= 12; t++) for (let o = 0; o <= 12; o += 3) {
      const s = { thousands: th, hundreds: h, tens: t, ones: o };
      for (const op of ops) { const n = regroupBaseTen(s, op); if (n) expect(evaluateBaseTenValue(n), `${JSON.stringify(s)} ${op}`).toBe(evaluateBaseTenValue(s)); }
    }
  });
  it('fraction reduction and mixed numbers', () => {
    expect(reduceFraction(6, 8)).toEqual({ n: 3, d: 4 });
    expect(reduceFraction(0, 7)).toEqual({ n: 0, d: 1 });
    expect(improperToMixed(7, 3)).toEqual({ whole: 2, remNum: 1, den: 3 });
    expect(improperToMixed(8, 4)).toEqual({ whole: 2, remNum: 0, den: 1 });
  });
});

describe('INVALID INPUT must fail closed: negative / fractional / out-of-range learner states are never "Verified"', () => {
  const frame = { mode: 'counting-ten-frame', frameCount: 1, targetCount: 10 } as const;
  it('ten frame: -1 + 11 counters is not 10 counters', () => { expect(evaluateTenFrame(frame, -1, 11).passed).toBe(false); });
  it('ten frame: more counters than the frame holds is not a valid build', () => { expect(evaluateTenFrame({ ...frame, targetCount: 12 }, 12, 0).passed, 'a single ten frame cannot hold 12').toBe(false); });
  it('number bond: fractional/negative values rejected (existing guard)', () => { expect(evaluateNumberBond({ mode: 'number-bonds', whole: 10, knownParts: [4], missingRole: 'part', expectedValue: 6 }, 6.0000001).passed).toBe(false); });
  it('base-ten: negative blocks cannot cancel to a target', () => {
    expect(evaluateBaseTen({ mode: 'base-ten-place-value', maxPlace: 'tens', targetNumber: 0 }, { thousands: 0, hundreds: 0, tens: 1, ones: -10 }).passed).toBe(false);
  });
  it('arrays: negative rows x negative columns is not a 3 x 4 array', () => {
    expect(evaluateArraysGrouping({ mode: 'arrays-grouping', taskKind: 'multiplication-array', targetTotal: 12 }, { rows: -3, cols: -4 }).passed).toBe(false);
    expect(evaluateArraysGrouping({ mode: 'arrays-grouping', taskKind: 'multiplication-array', targetTotal: 6 }, { rows: 2.5, cols: 2.4 }).passed, 'fractional rows').toBe(false);
  });
  it('equal grouping: negative groups x negative size rejected', () => {
    expect(evaluateArraysGrouping({ mode: 'arrays-grouping', taskKind: 'equal-grouping', targetTotal: 12 }, { groups: -3, groupSize: -4 }).passed).toBe(false);
  });
  it('division with remainder: fractional quotient 0.5 with remainder 1 is not 3 / 4', () => {
    expect(evaluateArraysGrouping({ mode: 'arrays-grouping', taskKind: 'division-remainder', targetTotal: 3, divisorOrFactor: 4 }, { groupSize: 0.5, remainder: 1 }).passed).toBe(false);
  });
  it('decimal place value: negative or beyond-limit counts are rejected (23 tenths = 2.3 is a legitimate non-canonical regrouping, like base-ten)', () => {
    const spec = { mode: 'fractions-decimals', representation: 'decimal-place-value', targetHundredths: 230 } as const;
    expect(evaluateFractionsDecimals(spec, { ones: 3, tenths: -10, hundredths: -70 }).passed, 'negative counts').toBe(false);
    expect(evaluateFractionsDecimals(spec, { ones: 0, tenths: 0, hundredths: 230 }).passed, 'beyond per-place limit of 30').toBe(false);
    expect(evaluateFractionsDecimals(spec, { ones: 2, tenths: 3, hundredths: 0 }).passed).toBe(true);
  });
  it('fractions: a fractional numerator (0.5/1) is not accepted as one half', () => {
    const spec = { mode: 'fractions-decimals', representation: 'fraction-bar', targetNumerator: 1, targetDenominator: 2 } as const;
    expect(evaluateFractionsDecimals(spec, { numerator: 0.5, denominator: 1 }).passed).toBe(false);
    expect(evaluateFractionsDecimals(spec, { numerator: 2, denominator: 4 }).passed).toBe(true);
  });
});
