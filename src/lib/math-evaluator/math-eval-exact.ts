/**
 * GAM EDU — Step 5A Pure Module 3: Exact Rational, Polynomial, Rational-Function,
 * Quadratic Surd, Bounded Symbolic Equivalence, Symbolic Calculus & Opt-In Numeric Sampling
 *
 * Pure TypeScript, zero React/DOM dependencies, zero eval(), ES2017-clean BigInt.
 *
 * Negative-number rounding convention (explicitly documented):
 * - `'half-up'`: rounds ties (exact .5) AWAY from zero (`-2.5 -> -3`, `2.5 -> 3`, `9.995 -> 10.00`).
 * - `'half-even'`: rounds ties (exact .5) to the nearest EVEN digit (`2.5 -> 2`, `3.5 -> 4`, `-2.5 -> -2`).
 */

import {
  EvalOpBudget,
  MATH_EVAL_LIMITS,
  MathEvalLimitError,
  assertBigIntWithinLimit,
} from './math-eval-limits';
import { type EvalAstNode } from './math-eval-parser';

/* ========================================================================== */
/* 1. EXACT BIGINT RATIONAL ARITHMETIC (Q)                                    */
/* ========================================================================== */

export interface BigRat {
  n: bigint;
  d: bigint; // > 0, gcd(|n|, d) === 1
}

const B0 = BigInt(0);
const B1 = BigInt(1);
const B2 = BigInt(2);

export function bigAbs(a: bigint): bigint {
  return a < B0 ? -a : a;
}

export function bigGcd(a: bigint, b: bigint): bigint {
  let x = bigAbs(a);
  let y = bigAbs(b);
  while (y !== B0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x === B0 ? B1 : x;
}

export function makeRat(n: bigint, d: bigint = B1): BigRat {
  if (d === B0) throw new MathEvalLimitError('UNSUPPORTED', 'Division by zero in exact arithmetic.');
  if (n === B0) return { n: B0, d: B1 };
  let num = n;
  let den = d;
  if (den < B0) {
    num = -num;
    den = -den;
  }
  const g = bigGcd(num, den);
  num /= g;
  den /= g;
  assertBigIntWithinLimit(num);
  assertBigIntWithinLimit(den);
  return { n: num, d: den };
}

export const RAT_ZERO: BigRat = { n: B0, d: B1 };
export const RAT_ONE: BigRat = { n: B1, d: B1 };

export function ratAdd(a: BigRat, b: BigRat): BigRat {
  return makeRat(a.n * b.d + b.n * a.d, a.d * b.d);
}
export function ratSub(a: BigRat, b: BigRat): BigRat {
  return makeRat(a.n * b.d - b.n * a.d, a.d * b.d);
}
export function ratMul(a: BigRat, b: BigRat): BigRat {
  return makeRat(a.n * b.n, a.d * b.d);
}
export function ratDiv(a: BigRat, b: BigRat): BigRat {
  if (b.n === B0) throw new MathEvalLimitError('UNSUPPORTED', 'Division by zero.');
  return makeRat(a.n * b.d, a.d * b.n);
}
export function ratNeg(a: BigRat): BigRat {
  return { n: -a.n, d: a.d };
}
export function ratEq(a: BigRat, b: BigRat): boolean {
  return a.n === b.n && a.d === b.d;
}
export function ratCmp(a: BigRat, b: BigRat): -1 | 0 | 1 {
  const lhs = a.n * b.d;
  const rhs = b.n * a.d;
  return lhs < rhs ? -1 : lhs > rhs ? 1 : 0;
}
export function ratPowInt(a: BigRat, exp: number): BigRat {
  if (!Number.isInteger(exp) || Math.abs(exp) > MATH_EVAL_LIMITS.maxNumericExponentAbs) {
    throw new MathEvalLimitError('LIMIT_EXCEEDED', `Exponent ${exp} exceeds safe exact bounds.`);
  }
  if (exp === 0) {
    if (a.n === B0) throw new MathEvalLimitError('UNSUPPORTED', '0^0 is indeterminate.');
    return RAT_ONE;
  }
  const neg = exp < 0;
  let base = neg ? ratDiv(RAT_ONE, a) : a;
  let e = Math.abs(exp);
  let res = RAT_ONE;
  while (e > 0) {
    if (e & 1) res = ratMul(res, base);
    e >>= 1;
    if (e > 0) base = ratMul(base, base);
  }
  return res;
}
export function ratToNumber(r: BigRat): number {
  return Number(r.n) / Number(r.d);
}

/** Exact conversion of a decimal or scientific-notation literal string to BigRat. */
export function decimalStringToBigRat(raw: string): BigRat {
  const s = raw.trim().replace(/^\+/, '');
  const m = /^(-?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/.exec(s);
  if (!m || (m[2] === '' && (!m[3] || m[3] === ''))) {
    throw new MathEvalLimitError('SYNTAX_ERROR', `Invalid decimal literal "${raw}".`);
  }
  const neg = m[1] === '-';
  const intPart = m[2] || '0';
  const fracPart = m[3] || '';
  const exp10 = m[4] ? Number(m[4]) : 0;
  if (!Number.isInteger(exp10) || Math.abs(exp10) > 20) {
    throw new MathEvalLimitError('LIMIT_EXCEEDED', `Scientific exponent "${exp10}" exceeds exact decimal range (±20).`);
  }
  const digits = BigInt(intPart + fracPart);
  const netExp = exp10 - fracPart.length;
  const signed = neg ? -digits : digits;
  if (netExp >= 0) {
    return makeRat(signed * BigInt('1' + '0'.repeat(netExp)), B1);
  }
  return makeRat(signed, BigInt('1' + '0'.repeat(-netExp)));
}

export function roundBigRatToDecimalPlaces(
  val: BigRat,
  dp: number,
  mode: 'half-up' | 'half-even' = 'half-up',
): { roundedRat: BigRat; formatted: string } {
  const factor = BigInt('1' + '0'.repeat(Math.max(0, dp)));
  const scaled = ratMul(val, { n: factor, d: B1 });
  const neg = scaled.n < B0;
  const absN = bigAbs(scaled.n);
  const q = absN / scaled.d;
  const rem = absN % scaled.d;
  const twiceRem = rem * B2;

  let roundedAbs = q;
  if (twiceRem > scaled.d) {
    roundedAbs = q + B1;
  } else if (twiceRem === scaled.d) {
    if (mode === 'half-up') roundedAbs = q + B1;
    else if (q % B2 === B1) roundedAbs = q + B1;
  }

  const finalInt = neg && roundedAbs !== B0 ? -roundedAbs : roundedAbs;
  const roundedRat = makeRat(finalInt, factor);
  const strAbs = roundedAbs.toString().padStart(dp + 1, '0');
  const formatted =
    dp === 0
      ? `${finalInt < B0 ? '-' : ''}${strAbs}`
      : `${finalInt < B0 ? '-' : ''}${strAbs.slice(0, -dp)}.${strAbs.slice(-dp)}`;
  return { roundedRat, formatted };
}

export function roundBigRatToSigFigs(
  val: BigRat,
  sf: number,
  mode: 'half-up' | 'half-even' = 'half-up',
): { roundedRat: BigRat; orderOfMagnitude: number } {
  if (val.n === B0) return { roundedRat: RAT_ZERO, orderOfMagnitude: 0 };
  const approx = Math.abs(ratToNumber(val));
  const mag = Math.floor(Math.log10(approx));
  const dp = sf - 1 - mag;
  if (dp >= 0) {
    const { roundedRat } = roundBigRatToDecimalPlaces(val, dp, mode);
    return { roundedRat, orderOfMagnitude: mag };
  }
  const shift = BigInt('1' + '0'.repeat(-dp));
  const shifted = ratDiv(val, { n: shift, d: B1 });
  const { roundedRat } = roundBigRatToDecimalPlaces(shifted, 0, mode);
  return { roundedRat: ratMul(roundedRat, { n: shift, d: B1 }), orderOfMagnitude: mag };
}

/* ========================================================================== */
/* 2. EXACT MULTIVARIATE POLYNOMIALS & RATIONAL FUNCTIONS                     */
/* ========================================================================== */

export type PolyMap = Map<string, BigRat>;

function parseMonoKey(key: string): Array<[string, number]> {
  if (!key) return [];
  return key.split('*').map((part) => {
    const [v, e] = part.split('^');
    return [v, Number(e)];
  });
}

function buildMonoKey(entries: Array<[string, number]>): string {
  const nonZero = entries.filter(([, e]) => e !== 0).sort((a, b) => a[0].localeCompare(b[0]));
  return nonZero.map(([v, e]) => `${v}^${e}`).join('*');
}

export function polyDegree(p: PolyMap): number {
  let max = 0;
  for (const [k, c] of p.entries()) {
    if (c.n === B0) continue;
    const deg = parseMonoKey(k).reduce((acc, [, e]) => acc + e, 0);
    if (deg > max) max = deg;
  }
  return max;
}

export function polyConst(c: BigRat): PolyMap {
  const m = new Map<string, BigRat>();
  if (c.n !== B0) m.set('', c);
  return m;
}

export function polyVar(v: string): PolyMap {
  const m = new Map<string, BigRat>();
  m.set(`${v}^1`, RAT_ONE);
  return m;
}

export function polyIsZero(p: PolyMap): boolean {
  for (const c of p.values()) {
    if (c.n !== B0) return false;
  }
  return true;
}

export function polyAdd(a: PolyMap, b: PolyMap, budget: EvalOpBudget): PolyMap {
  const res = new Map(a);
  for (const [k, c] of b.entries()) {
    budget.tick();
    const cur = res.get(k);
    const next = cur ? ratAdd(cur, c) : c;
    if (next.n === B0) res.delete(k);
    else res.set(k, next);
  }
  if (res.size > MATH_EVAL_LIMITS.maxPolyTerms) {
    throw new MathEvalLimitError('LIMIT_EXCEEDED', `Polynomial exceeded maximum term count (${MATH_EVAL_LIMITS.maxPolyTerms}).`);
  }
  return res;
}

export function polySub(a: PolyMap, b: PolyMap, budget: EvalOpBudget): PolyMap {
  const negB = new Map<string, BigRat>();
  for (const [k, c] of b.entries()) negB.set(k, ratNeg(c));
  return polyAdd(a, negB, budget);
}

export function polyMul(a: PolyMap, b: PolyMap, budget: EvalOpBudget): PolyMap {
  if (polyIsZero(a) || polyIsZero(b)) return new Map();
  if (polyDegree(a) + polyDegree(b) > MATH_EVAL_LIMITS.maxPolyDegree) {
    throw new MathEvalLimitError(
      'LIMIT_EXCEEDED',
      `Polynomial degree exceeded maximum allowed degree (${MATH_EVAL_LIMITS.maxPolyDegree}).`,
    );
  }
  const res = new Map<string, BigRat>();
  for (const [ka, ca] of a.entries()) {
    const ea = parseMonoKey(ka);
    for (const [kb, cb] of b.entries()) {
      budget.tick();
      const map = new Map<string, number>(ea);
      for (const [v, e] of parseMonoKey(kb)) map.set(v, (map.get(v) ?? 0) + e);
      const key = buildMonoKey(Array.from(map.entries()));
      const prod = ratMul(ca, cb);
      const cur = res.get(key);
      const next = cur ? ratAdd(cur, prod) : prod;
      if (next.n === B0) res.delete(key);
      else res.set(key, next);
      if (res.size > MATH_EVAL_LIMITS.maxPolyTerms) {
        throw new MathEvalLimitError('LIMIT_EXCEEDED', `Polynomial expansion exceeded ${MATH_EVAL_LIMITS.maxPolyTerms} terms.`);
      }
    }
  }
  return res;
}

export function polyPow(a: PolyMap, exp: number, budget: EvalOpBudget): PolyMap {
  if (!Number.isInteger(exp) || exp < 0 || exp > MATH_EVAL_LIMITS.maxSymbolicPower) {
    throw new MathEvalLimitError(
      'LIMIT_EXCEEDED',
      `Symbolic polynomial exponent must be an integer between 0 and ${MATH_EVAL_LIMITS.maxSymbolicPower}.`,
    );
  }
  if (exp === 0) return polyConst(RAT_ONE);
  let res = polyConst(RAT_ONE);
  let base = a;
  let e = exp;
  while (e > 0) {
    if (e & 1) res = polyMul(res, base, budget);
    e >>= 1;
    if (e > 0) base = polyMul(base, base, budget);
  }
  return res;
}

export interface RationalPoly {
  num: PolyMap;
  den: PolyMap;
}

export function astToRationalPoly(node: EvalAstNode, budget: EvalOpBudget): RationalPoly | null {
  budget.tick();
  switch (node.type) {
    case 'number':
      return { num: polyConst(decimalStringToBigRat(node.raw)), den: polyConst(RAT_ONE) };
    case 'var':
      return { num: polyVar(node.name), den: polyConst(RAT_ONE) };
    case 'const':
    case 'call':
      return null;
    case 'unary': {
      const inner = astToRationalPoly(node.arg, budget);
      if (!inner) return null;
      return node.op === '-'
        ? { num: polySub(new Map(), inner.num, budget), den: inner.den }
        : inner;
    }
    case 'binary': {
      const L = astToRationalPoly(node.left, budget);
      const R = astToRationalPoly(node.right, budget);
      if (!L || !R) return null;
      if (node.op === '+') {
        return {
          num: polyAdd(polyMul(L.num, R.den, budget), polyMul(R.num, L.den, budget), budget),
          den: polyMul(L.den, R.den, budget),
        };
      }
      if (node.op === '-') {
        return {
          num: polySub(polyMul(L.num, R.den, budget), polyMul(R.num, L.den, budget), budget),
          den: polyMul(L.den, R.den, budget),
        };
      }
      if (node.op === '*') {
        return { num: polyMul(L.num, R.num, budget), den: polyMul(L.den, R.den, budget) };
      }
      if (node.op === '/') {
        if (polyIsZero(R.num)) throw new MathEvalLimitError('UNSUPPORTED', 'Division by zero polynomial.');
        return { num: polyMul(L.num, R.den, budget), den: polyMul(L.den, R.num, budget) };
      }
      if (node.op === '^') {
        if (R.den.size !== 1 || !R.den.has('') || R.num.size > 1 || (R.num.size === 1 && !R.num.has(''))) {
          return null;
        }
        const expRat = R.num.get('') ?? RAT_ZERO;
        if (expRat.d !== B1) return null;
        const expNum = Number(expRat.n);
        const isConstBase =
          L.num.size <= 1 && (L.num.size === 0 || L.num.has('')) && L.den.size === 1 && L.den.has('');
        if (isConstBase) {
          const baseRat = ratDiv(L.num.get('') ?? RAT_ZERO, L.den.get('')!);
          return { num: polyConst(ratPowInt(baseRat, expNum)), den: polyConst(RAT_ONE) };
        }
        if (Math.abs(expNum) > MATH_EVAL_LIMITS.maxSymbolicPower) {
          throw new MathEvalLimitError(
            'LIMIT_EXCEEDED',
            `Symbolic exponent |${expNum}| exceeds safe expansion limit (${MATH_EVAL_LIMITS.maxSymbolicPower}).`,
          );
        }
        if (expNum < 0) {
          if (polyIsZero(L.num)) throw new MathEvalLimitError('UNSUPPORTED', 'Negative power of zero.');
          return { num: polyPow(L.den, -expNum, budget), den: polyPow(L.num, -expNum, budget) };
        }
        return { num: polyPow(L.num, expNum, budget), den: polyPow(L.den, expNum, budget) };
      }
      return null;
    }
  }
}

export function rationalPolyEqual(a: RationalPoly, b: RationalPoly, budget: EvalOpBudget): boolean {
  const lhs = polyMul(a.num, b.den, budget);
  const rhs = polyMul(b.num, a.den, budget);
  return polyIsZero(polySub(lhs, rhs, budget));
}

export function polyToCanonicalString(p: PolyMap): string {
  const keys = Array.from(p.keys()).sort();
  if (keys.length === 0) return '0';
  return keys
    .map((k) => {
      const c = p.get(k)!;
      const cs = c.d === B1 ? c.n.toString() : `${c.n}/${c.d}`;
      return k ? `${cs}*${k}` : cs;
    })
    .join('+');
}

/* ========================================================================== */
/* 3. EXACT QUADRATIC SURD CANONICALISER (a + b√d)                            */
/* ========================================================================== */

export type SurdSum = Map<number, BigRat>;

export function extractSquareFactor(n: number): { outside: number; inside: number } {
  if (!Number.isInteger(n) || n < 0 || n > MATH_EVAL_LIMITS.maxSurdRadicand) {
    throw new MathEvalLimitError('UNSUPPORTED', `Surd radicand ${n} is outside supported integer bounds.`);
  }
  if (n === 0) return { outside: 0, inside: 1 };
  let outside = 1;
  let inside = n;
  for (let f = 2; f * f <= inside; f++) {
    while (inside % (f * f) === 0) {
      outside *= f;
      inside /= f * f;
    }
  }
  return { outside, inside };
}

function surdAdd(a: SurdSum, b: SurdSum, sign: 1 | -1 = 1): SurdSum {
  const res = new Map(a);
  for (const [d, c] of b.entries()) {
    const delta = sign === 1 ? c : ratNeg(c);
    const cur = res.get(d);
    const next = cur ? ratAdd(cur, delta) : delta;
    if (next.n === B0) res.delete(d);
    else res.set(d, next);
  }
  return res;
}

function surdMul(a: SurdSum, b: SurdSum): SurdSum {
  const res: SurdSum = new Map();
  for (const [d1, c1] of a.entries()) {
    for (const [d2, c2] of b.entries()) {
      const { outside, inside } = extractSquareFactor(d1 * d2);
      const coeff = ratMul(ratMul(c1, c2), makeRat(BigInt(outside)));
      const cur = res.get(inside);
      const next = cur ? ratAdd(cur, coeff) : coeff;
      if (next.n === B0) res.delete(inside);
      else res.set(inside, next);
    }
  }
  return res;
}

export function astToExactSurd(node: EvalAstNode, budget: EvalOpBudget): SurdSum | null {
  budget.tick();
  if (node.type === 'number') {
    const r = decimalStringToBigRat(node.raw);
    const m: SurdSum = new Map();
    if (r.n !== B0) m.set(1, r);
    return m;
  }
  if (node.type === 'unary') {
    const inner = astToExactSurd(node.arg, budget);
    if (!inner) return null;
    if (node.op === '+') return inner;
    const neg: SurdSum = new Map();
    for (const [d, c] of inner.entries()) neg.set(d, ratNeg(c));
    return neg;
  }
  if (node.type === 'call' && node.name === 'sqrt') {
    const inner = astToExactSurd(node.arg, budget);
    if (!inner || inner.size > 1 || (inner.size === 1 && !inner.has(1))) return null;
    const r = inner.get(1) ?? RAT_ZERO;
    if (r.n < B0) throw new MathEvalLimitError('UNSUPPORTED', 'Square root of a negative number is not real.');
    if (r.n === B0) return new Map();
    const prod = Number(r.n * r.d);
    if (!Number.isSafeInteger(prod) || prod > MATH_EVAL_LIMITS.maxSurdRadicand) return null;
    const { outside, inside } = extractSquareFactor(prod);
    const m: SurdSum = new Map();
    m.set(inside, makeRat(BigInt(outside), r.d));
    return m;
  }
  if (node.type === 'binary') {
    const L = astToExactSurd(node.left, budget);
    const R = astToExactSurd(node.right, budget);
    if (!L || !R) return null;
    if (node.op === '+') return surdAdd(L, R, 1);
    if (node.op === '-') return surdAdd(L, R, -1);
    if (node.op === '*') return surdMul(L, R);
    if (node.op === '/') {
      if (R.size === 0) throw new MathEvalLimitError('UNSUPPORTED', 'Division by zero.');
      if (R.size === 1) {
        const [[d, c]] = Array.from(R.entries());
        const inv: SurdSum = new Map([[d, ratDiv(RAT_ONE, ratMul(c, makeRat(BigInt(d))))]]);
        return surdMul(L, inv);
      }
      return null;
    }
    if (node.op === '^') {
      if (R.size > 1 || (R.size === 1 && !R.has(1))) return null;
      const exp = R.get(1) ?? RAT_ZERO;
      if (exp.d === B1) {
        const e = Number(exp.n);
        if (e < 0 || e > 4) return null;
        let res: SurdSum = new Map([[1, RAT_ONE]]);
        for (let k = 0; k < e; k++) res = surdMul(res, L);
        return res;
      }
      if (exp.n === B1 && exp.d === B2) {
        return astToExactSurd({ type: 'call', name: 'sqrt', arg: node.left }, budget);
      }
    }
  }
  return null;
}

export function surdEqual(a: SurdSum, b: SurdSum): boolean {
  if (a.size !== b.size) return false;
  for (const [d, c] of a.entries()) {
    const bc = b.get(d);
    if (!bc || !ratEq(c, bc)) return false;
  }
  return true;
}

/* ========================================================================== */
/* 4. GENUINE BOUNDED SYMBOLIC EQUIVALENCE (ZERO NUMERICAL SAMPLING!)         */
/* ========================================================================== */

/**
 * Represents a finite linear combination of elementary symbolic basis atoms with
 * exact RationalPoly coefficients: e.g. `6x * [1] + 1 * [cos(x)]`.
 * Supports:
 * - Polynomial & rational expressions
 * - Elementary trig/exp/log/abs basis terms (sin, cos, tan, exp, ln, log10, abs)
 * - Logarithm product/quotient/power rules: `ln(A) + ln(B) -> ln(A*B)`, `k*ln(A) -> ln(A^k)`
 * - Square-root square rule: `sqrt(u^2) -> abs(u)` (or `u` ONLY when `u` is declared positive!)
 * - Pythagorean trig rule: `cos(u)^2 -> 1 - sin(u)^2`
 */
type SymBasisMap = Map<string, RationalPoly>;

function symAdd(a: SymBasisMap, b: SymBasisMap, sign: 1 | -1, budget: EvalOpBudget): SymBasisMap {
  const res = new Map(a);
  for (const [k, rp] of b.entries()) {
    budget.tick();
    const term = sign === 1 ? rp : { num: polySub(new Map(), rp.num, budget), den: rp.den };
    const cur = res.get(k);
    if (!cur) {
      if (!polyIsZero(term.num)) res.set(k, term);
    } else {
      const sum: RationalPoly = {
        num: polyAdd(polyMul(cur.num, term.den, budget), polyMul(term.num, cur.den, budget), budget),
        den: polyMul(cur.den, term.den, budget),
      };
      if (polyIsZero(sum.num)) res.delete(k);
      else res.set(k, sum);
    }
  }
  return res;
}

function canonicalAtomKey(node: EvalAstNode, budget: EvalOpBudget, positiveVars: Set<string>): string | null {
  budget.tick();
  const rp = astToRationalPoly(node, budget);
  if (rp && rp.den.size === 1 && rp.den.has('')) {
    const d = rp.den.get('')!;
    const scaled = new Map<string, BigRat>();
    for (const [k, v] of rp.num.entries()) scaled.set(k, ratDiv(v, d));
    return polyToCanonicalString(scaled);
  }
  if (node.type === 'call') {
    const inner = canonicalAtomKey(node.arg, budget, positiveVars);
    if (!inner) return null;
    if (node.name === 'abs' && node.arg.type === 'var' && positiveVars.has(node.arg.name)) {
      return node.arg.name;
    }
    return `${node.name}(${inner})`;
  }
  return null;
}

/** Checks if `ast` is a sum/difference of `ln(...)` terms and combines them into a single canonical `ln(prod/quot)` rational poly! */
function tryCombineLogSum(
  node: EvalAstNode,
  fnName: 'ln' | 'log10',
  budget: EvalOpBudget,
): RationalPoly | null {
  if (node.type === 'call' && node.name === fnName) {
    return astToRationalPoly(node.arg, budget);
  }
  if (node.type === 'binary' && (node.op === '+' || node.op === '-')) {
    const L = tryCombineLogSum(node.left, fnName, budget);
    const R = tryCombineLogSum(node.right, fnName, budget);
    if (!L || !R) return null;
    if (node.op === '+') {
      return { num: polyMul(L.num, R.num, budget), den: polyMul(L.den, R.den, budget) };
    }
    if (polyIsZero(R.num)) return null;
    return { num: polyMul(L.num, R.den, budget), den: polyMul(L.den, R.num, budget) };
  }
  if (node.type === 'binary' && node.op === '*' && node.left.type === 'number' && Number.isInteger(node.left.value)) {
    const k = node.left.value;
    if (k < 1 || k > 4) return null;
    const inner = tryCombineLogSum(node.right, fnName, budget);
    if (!inner) return null;
    return { num: polyPow(inner.num, k, budget), den: polyPow(inner.den, k, budget) };
  }
  return null;
}

function astToSymBasis(
  node: EvalAstNode,
  budget: EvalOpBudget,
  positiveVars: Set<string>,
): SymBasisMap | null {
  budget.tick();
  // Pure rational polynomial -> basis key "1"
  const rp = astToRationalPoly(node, budget);
  if (rp) {
    const m: SymBasisMap = new Map();
    if (!polyIsZero(rp.num)) m.set('1', rp);
    return m;
  }

  // Unary
  if (node.type === 'unary') {
    const inner = astToSymBasis(node.arg, budget, positiveVars);
    if (!inner) return null;
    return node.op === '+' ? inner : symAdd(new Map(), inner, -1, budget);
  }

  // Function call
  if (node.type === 'call') {
    // Rule: sqrt(u^2) -> abs(u) (or u if positive!)
    if (node.name === 'sqrt' && node.arg.type === 'binary' && node.arg.op === '^' && node.arg.right.type === 'number' && node.arg.right.value === 2) {
      const base = node.arg.left;
      if (base.type === 'var' && positiveVars.has(base.name)) {
        return new Map([['1', { num: polyVar(base.name), den: polyConst(RAT_ONE) }]]);
      }
      const key = canonicalAtomKey(base, budget, positiveVars);
      if (key) return new Map([[`abs(${key})`, { num: polyConst(RAT_ONE), den: polyConst(RAT_ONE) }]]);
    }
    const key = canonicalAtomKey(node, budget, positiveVars);
    if (key) {
      // If abs(x) simplified to x under positive assumption
      if (node.name === 'abs' && node.arg.type === 'var' && positiveVars.has(node.arg.name)) {
        return new Map([['1', { num: polyVar(node.arg.name), den: polyConst(RAT_ONE) }]]);
      }
      return new Map([[key, { num: polyConst(RAT_ONE), den: polyConst(RAT_ONE) }]]);
    }
    return null;
  }

  // Binary
  if (node.type === 'binary') {
    if (node.op === '+' || node.op === '-') {
      const L = astToSymBasis(node.left, budget, positiveVars);
      const R = astToSymBasis(node.right, budget, positiveVars);
      if (!L || !R) return null;
      return symAdd(L, R, node.op === '+' ? 1 : -1, budget);
    }
    if (node.op === '*') {
      const Lrp = astToRationalPoly(node.left, budget);
      const Rrp = astToRationalPoly(node.right, budget);
      if (Lrp) {
        const R = astToSymBasis(node.right, budget, positiveVars);
        if (!R) return null;
        const out: SymBasisMap = new Map();
        for (const [k, v] of R.entries()) {
          const prod = { num: polyMul(Lrp.num, v.num, budget), den: polyMul(Lrp.den, v.den, budget) };
          if (!polyIsZero(prod.num)) out.set(k, prod);
        }
        return out;
      }
      if (Rrp) {
        const L = astToSymBasis(node.left, budget, positiveVars);
        if (!L) return null;
        const out: SymBasisMap = new Map();
        for (const [k, v] of L.entries()) {
          const prod = { num: polyMul(Rrp.num, v.num, budget), den: polyMul(Rrp.den, v.den, budget) };
          if (!polyIsZero(prod.num)) out.set(k, prod);
        }
        return out;
      }
      return null;
    }
    if (node.op === '/') {
      const Rrp = astToRationalPoly(node.right, budget);
      if (Rrp && !polyIsZero(Rrp.num)) {
        const L = astToSymBasis(node.left, budget, positiveVars);
        if (!L) return null;
        const out: SymBasisMap = new Map();
        for (const [k, v] of L.entries()) {
          const quot = { num: polyMul(v.num, Rrp.den, budget), den: polyMul(v.den, Rrp.num, budget) };
          if (!polyIsZero(quot.num)) out.set(k, quot);
        }
        return out;
      }
      // Handle 1 / cos(u)^2 (from d/dx tan(u))
      const Lrp = astToRationalPoly(node.left, budget);
      if (Lrp && node.right.type === 'binary' && node.right.op === '^' && node.right.right.type === 'number' && node.right.right.value === 2) {
        const bKey = canonicalAtomKey(node.right.left, budget, positiveVars);
        if (bKey) return new Map([[`1/(${bKey})^2`, Lrp]]);
      }
      return null;
    }
    if (node.op === '^') {
      // Handle e^u -> exp(u)
      if (node.left.type === 'const' && node.left.name === 'e') {
        const inner = canonicalAtomKey(node.right, budget, positiveVars);
        if (inner) return new Map([[`exp(${inner})`, { num: polyConst(RAT_ONE), den: polyConst(RAT_ONE) }]]);
      }
      // Handle sin(u)^2 and Pythagorean identity cos(u)^2 -> 1 - sin(u)^2!
      if (node.left.type === 'call' && node.right.type === 'number' && node.right.value === 2) {
        const argKey = canonicalAtomKey(node.left.arg, budget, positiveVars);
        if (argKey) {
          if (node.left.name === 'sin') {
            return new Map([[`sin(${argKey})^2`, { num: polyConst(RAT_ONE), den: polyConst(RAT_ONE) }]]);
          }
          if (node.left.name === 'cos') {
            return new Map([
              ['1', { num: polyConst(RAT_ONE), den: polyConst(RAT_ONE) }],
              [`sin(${argKey})^2`, { num: polyConst({ n: BigInt(-1), d: B1 }), den: polyConst(RAT_ONE) }],
            ]);
          }
        }
      }
      return null;
    }
  }
  return null;
}

/**
 * Genuine bounded symbolic equivalence check (ZERO numerical sampling!).
 * Returns `'exact'`, `'symbolic'`, `'not-equal'`, or `'unsupported'`.
 */
export function checkSymbolicEquivalence(
  astA: EvalAstNode,
  astB: EvalAstNode,
  budget: EvalOpBudget,
  positiveVars: Set<string> = new Set(),
): 'exact' | 'symbolic' | 'not-equal' | 'unsupported' {
  // 1. Exact rational-polynomial check
  const rpA = astToRationalPoly(astA, budget);
  const rpB = astToRationalPoly(astB, budget);
  if (rpA && rpB) {
    return rationalPolyEqual(rpA, rpB, budget) ? 'exact' : 'not-equal';
  }

  // 2. Exact quadratic surd check
  const surdA = astToExactSurd(astA, budget);
  const surdB = astToExactSurd(astB, budget);
  if (surdA && surdB) {
    return surdEqual(surdA, surdB) ? 'exact' : 'not-equal';
  }

  // 3. Logarithm product/quotient/power rule check (ln and log10)
  for (const fn of ['ln', 'log10'] as const) {
    const logA = tryCombineLogSum(astA, fn, budget);
    const logB = tryCombineLogSum(astB, fn, budget);
    if (logA && logB) {
      return rationalPolyEqual(logA, logB, budget) ? 'symbolic' : 'not-equal';
    }
  }

  // 4. Symbolic elementary-basis linear-combination check (trig, exp, abs, sqrt(u^2), Pythagorean)
  const symA = astToSymBasis(astA, budget, positiveVars);
  const symB = astToSymBasis(astB, budget, positiveVars);
  if (symA && symB) {
    const diff = symAdd(symA, symB, -1, budget);
    return diff.size === 0 ? 'symbolic' : 'not-equal';
  }

  return 'unsupported';
}

/* ========================================================================== */
/* 5. BOUNDED SYMBOLIC DIFFERENTIATION (RADIANS FOR TRIG)                     */
/* ========================================================================== */

export function differentiateAst(node: EvalAstNode, variable: string, budget: EvalOpBudget): EvalAstNode {
  budget.tick();
  const numNode = (v: number): EvalAstNode => ({ type: 'number', raw: String(v), value: v });

  switch (node.type) {
    case 'number':
    case 'const':
      return numNode(0);
    case 'var':
      return numNode(node.name === variable ? 1 : 0);
    case 'unary':
      return { type: 'unary', op: node.op, arg: differentiateAst(node.arg, variable, budget) };
    case 'binary': {
      const u = node.left;
      const v = node.right;
      const du = differentiateAst(u, variable, budget);
      const dv = differentiateAst(v, variable, budget);
      if (node.op === '+' || node.op === '-') {
        return { type: 'binary', op: node.op, left: du, right: dv };
      }
      if (node.op === '*') {
        return {
          type: 'binary',
          op: '+',
          left: { type: 'binary', op: '*', left: du, right: v },
          right: { type: 'binary', op: '*', left: u, right: dv },
        };
      }
      if (node.op === '/') {
        return {
          type: 'binary',
          op: '/',
          left: {
            type: 'binary',
            op: '-',
            left: { type: 'binary', op: '*', left: du, right: v },
            right: { type: 'binary', op: '*', left: u, right: dv },
          },
          right: { type: 'binary', op: '^', left: v, right: numNode(2) },
        };
      }
      if (node.op === '^') {
        if (v.type === 'number') {
          return {
            type: 'binary',
            op: '*',
            left: {
              type: 'binary',
              op: '*',
              left: v,
              right: { type: 'binary', op: '^', left: u, right: numNode(v.value - 1) },
            },
            right: du,
          };
        }
        if (u.type === 'const' && u.name === 'e') {
          return { type: 'binary', op: '*', left: node, right: dv };
        }
        throw new MathEvalLimitError('UNSUPPORTED', 'Symbolic differentiation of variable^variable is not supported.');
      }
      throw new MathEvalLimitError('UNSUPPORTED', 'Unsupported binary operator in differentiation.');
    }
    case 'call': {
      const g = node.arg;
      if (node.name === 'ln') {
        const inner = g.type === 'call' && g.name === 'abs' ? g.arg : g;
        const dInner = differentiateAst(inner, variable, budget);
        if (dInner.type === 'number' && dInner.value === 0) return numNode(0);
        return { type: 'binary', op: '/', left: dInner, right: inner };
      }
      if (node.name === 'abs') {
        // Constant abs(c) differentiates to 0; abs(g(x)) is non-differentiable at g=0 -> unsupported
        const usesV = (n: EvalAstNode): boolean =>
          (n.type === 'var' && n.name === variable) ||
          (n.type === 'unary' && usesV(n.arg)) ||
          (n.type === 'call' && usesV(n.arg)) ||
          (n.type === 'binary' && (usesV(n.left) || usesV(n.right)));
        if (!usesV(g)) return numNode(0);
        throw new MathEvalLimitError('UNSUPPORTED', 'Symbolic differentiation of abs(x) is not supported.');
      }
      const dg = differentiateAst(g, variable, budget);
      if (node.name === 'sin') {
        return { type: 'binary', op: '*', left: { type: 'call', name: 'cos', arg: g }, right: dg };
      }
      if (node.name === 'cos') {
        return {
          type: 'binary',
          op: '*',
          left: { type: 'unary', op: '-', arg: { type: 'call', name: 'sin', arg: g } },
          right: dg,
        };
      }
      if (node.name === 'tan') {
        return {
          type: 'binary',
          op: '/',
          left: dg,
          right: { type: 'binary', op: '^', left: { type: 'call', name: 'cos', arg: g }, right: numNode(2) },
        };
      }
      if (node.name === 'exp') {
        return { type: 'binary', op: '*', left: node, right: dg };
      }
      if (node.name === 'sqrt') {
        return {
          type: 'binary',
          op: '/',
          left: dg,
          right: { type: 'binary', op: '*', left: numNode(2), right: node },
        };
      }
      throw new MathEvalLimitError('UNSUPPORTED', `Symbolic differentiation of "${node.name}(...)" is not supported.`);
    }
  }
}

/* ========================================================================== */
/* 6. ANSWER FORM CHECKERS (STRENGTHENED, SEPARATE FROM EQUIVALENCE)          */
/* ========================================================================== */

export function isExpandedPolynomialAst(node: EvalAstNode): boolean {
  const containsAddSub = (n: EvalAstNode): boolean => {
    if (n.type === 'binary') {
      if (n.op === '+' || n.op === '-') return true;
      return containsAddSub(n.left) || containsAddSub(n.right);
    }
    if (n.type === 'unary') return containsAddSub(n.arg);
    if (n.type === 'call') return containsAddSub(n.arg);
    return false;
  };
  const check = (n: EvalAstNode): boolean => {
    if (n.type === 'binary') {
      if (n.op === '*' && (containsAddSub(n.left) || containsAddSub(n.right))) return false;
      if (n.op === '^' && containsAddSub(n.left)) return false;
      return check(n.left) && check(n.right);
    }
    if (n.type === 'unary') return check(n.arg);
    return true;
  };
  return check(node);
}

export function hasCollectedLikeTermsAst(node: EvalAstNode, budget: EvalOpBudget): boolean {
  if (!isExpandedPolynomialAst(node)) return false;
  const terms: EvalAstNode[] = [];
  const split = (n: EvalAstNode) => {
    if (n.type === 'binary' && (n.op === '+' || n.op === '-')) {
      split(n.left);
      split(n.right);
    } else {
      terms.push(n);
    }
  };
  split(node);
  const rp = astToRationalPoly(node, budget);
  if (!rp) return true;
  return terms.length <= Math.max(1, rp.num.size);
}

/** Checks fully factorised form: top-level product/power AND no univariate quadratic factor with rational roots left unfactored (rejects `2(x^2-9)`!). */
export function isFullyFactoredFormAst(node: EvalAstNode, variables: string[], budget: EvalOpBudget): boolean {
  const core = node.type === 'unary' ? node.arg : node;
  if (core.type !== 'binary' || (core.op !== '*' && core.op !== '^')) return false;

  const factors: EvalAstNode[] = [];
  const collect = (n: EvalAstNode) => {
    if (n.type === 'binary' && n.op === '*') {
      collect(n.left);
      collect(n.right);
    } else if (n.type === 'binary' && n.op === '^') {
      collect(n.left);
    } else {
      factors.push(n);
    }
  };
  collect(core);

  if (variables.length === 1) {
    const v = variables[0];
    for (const f of factors) {
      const rp = astToRationalPoly(f, budget);
      if (!rp || rp.den.size !== 1 || !rp.den.has('')) continue;
      if (polyDegree(rp.num) === 2) {
        // Check if discriminant is a perfect rational square -> factorable over Q!
        const c2 = rp.num.get(`${v}^2`) ?? RAT_ZERO;
        const c1 = rp.num.get(`${v}^1`) ?? RAT_ZERO;
        const c0 = rp.num.get('') ?? RAT_ZERO;
        const numD = c1.n * c1.n * c2.d * c0.d - BigInt(4) * c2.n * c0.n * c1.d * c1.d;
        const denD = c1.d * c1.d * c2.d * c0.d;
        if (numD >= B0) {
          const sn = BigInt(Math.round(Math.sqrt(Number(numD))));
          const sd = BigInt(Math.round(Math.sqrt(Number(denD))));
          if (sn * sn === numD && sd * sd === denD) {
            return false; // Partially factorised (e.g. 2(x^2 - 9))!
          }
        }
      }
    }
  }
  return true;
}

export function isSimplifiedFractionAst(learnerAst: EvalAstNode, expectedAst: EvalAstNode, budget: EvalOpBudget): boolean {
  const lrnRp = astToRationalPoly(learnerAst, budget);
  const expRp = astToRationalPoly(expectedAst, budget);
  if (!lrnRp || !expRp) return false;
  // Denominator degree must not exceed expected simplified denominator degree
  return polyDegree(lrnRp.den) <= polyDegree(expRp.den);
}

export function isReducedFractionAst(node: EvalAstNode): boolean {
  const core = node.type === 'unary' ? node.arg : node;
  if (core.type === 'number') return /^\d+$/.test(core.raw);
  if (core.type === 'binary' && core.op === '/' && core.left.type === 'number' && core.right.type === 'number') {
    if (!/^\d+$/.test(core.left.raw) || !/^\d+$/.test(core.right.raw)) return false;
    const p = BigInt(core.left.raw);
    const q = BigInt(core.right.raw);
    return q > B1 && bigGcd(p, q) === B1;
  }
  return false;
}

export function isDecimalLiteralAst(node: EvalAstNode): boolean {
  const core = node.type === 'unary' ? node.arg : node;
  return core.type === 'number' && !/[eE]/.test(core.raw);
}

export function isSimplifiedSurdAst(node: EvalAstNode): boolean {
  const seenRadicands = new Set<number>();
  let ok = true;
  const walk = (n: EvalAstNode) => {
    if (!ok) return;
    if (n.type === 'call' && n.name === 'sqrt') {
      if (n.arg.type !== 'number' || !Number.isInteger(n.arg.value) || n.arg.value <= 1) {
        ok = false;
        return;
      }
      const { outside } = extractSquareFactor(n.arg.value);
      if (outside > 1 || seenRadicands.has(n.arg.value)) {
        ok = false;
        return;
      }
      seenRadicands.add(n.arg.value);
      return;
    }
    if (n.type === 'unary') walk(n.arg);
    else if (n.type === 'binary') {
      walk(n.left);
      walk(n.right);
    }
  };
  walk(node);
  return ok;
}

/* ========================================================================== */
/* 7. OPT-IN BOUNDED NUMERIC SAMPLING (NEVER EXACT / NEVER SYMBOLIC PROOF!)   */
/* ========================================================================== */

const DETERMINISTIC_SAMPLES = [
  0.3719, 1.41421, 2.71828, -0.61803, 1.70079, 4.23607, -1.73205, 0.86602,
  5.19615, -2.23606, 0.27182, 1.83928, -3.30277, 6.40312, 0.57721, -0.41421,
];

export function evalAstNumeric(
  node: EvalAstNode,
  env: Record<string, number>,
  budget: EvalOpBudget,
): number | null {
  budget.tick();
  switch (node.type) {
    case 'number':
      return node.value;
    case 'const':
      if (node.name === 'pi') return Math.PI;
      if (node.name === 'e') return Math.E;
      return Infinity;
    case 'var': {
      const v = env[node.name];
      return typeof v === 'number' && Number.isFinite(v) ? v : null;
    }
    case 'unary': {
      const a = evalAstNumeric(node.arg, env, budget);
      if (a === null) return null;
      return node.op === '-' ? -a : a;
    }
    case 'call': {
      const a = evalAstNumeric(node.arg, env, budget);
      if (a === null || !Number.isFinite(a)) return null;
      let res: number;
      switch (node.name) {
        case 'abs': res = Math.abs(a); break;
        case 'sqrt': if (a < -1e-12) return null; res = Math.sqrt(Math.max(0, a)); break;
        case 'cbrt': res = Math.cbrt(a); break;
        case 'sin': res = Math.sin(a); break;
        case 'cos': res = Math.cos(a); break;
        case 'tan': if (Math.abs(Math.cos(a)) < 1e-9) return null; res = Math.tan(a); break;
        case 'ln': if (a <= 1e-12) return null; res = Math.log(a); break;
        case 'log10': if (a <= 1e-12) return null; res = Math.log10(a); break;
        case 'exp': if (a > 50) return null; res = Math.exp(a); break;
      }
      return Number.isFinite(res) ? res : null;
    }
    case 'binary': {
      const l = evalAstNumeric(node.left, env, budget);
      const r = evalAstNumeric(node.right, env, budget);
      if (l === null || r === null) return null;
      let res: number;
      switch (node.op) {
        case '+': res = l + r; break;
        case '-': res = l - r; break;
        case '*': res = l * r; break;
        case '/': if (Math.abs(r) < 1e-12) return null; res = l / r; break;
        case '^':
          if (Math.abs(r) > MATH_EVAL_LIMITS.maxNumericExponentAbs) return null;
          if (l === 0 && r <= 0) return null;
          if (l < 0 && !Number.isInteger(r)) return null;
          res = Math.pow(l, r);
          break;
      }
      return Number.isFinite(res) ? res : null;
    }
  }
}

export function checkBoundedNumericAgreement(
  astA: EvalAstNode,
  astB: EvalAstNode,
  variables: string[],
  budget: EvalOpBudget,
  positiveOnlyVars: Set<string> = new Set(),
  tol = 1e-6,
): { agreed: boolean; validSamples: number } {
  let validSamples = 0;
  for (let i = 0; i < MATH_EVAL_LIMITS.numericSampleCount; i++) {
    const env: Record<string, number> = {};
    for (let vIdx = 0; vIdx < variables.length; vIdx++) {
      const vName = variables[vIdx];
      let val = DETERMINISTIC_SAMPLES[(i + vIdx * 5) % DETERMINISTIC_SAMPLES.length];
      if (positiveOnlyVars.has(vName)) val = Math.abs(val) + 2.13;
      env[vName] = val;
    }
    const va = evalAstNumeric(astA, env, budget);
    const vb = evalAstNumeric(astB, env, budget);
    if (va === null && vb === null) continue;
    if (va === null || vb === null) return { agreed: false, validSamples };
    const scale = Math.max(1, Math.abs(va), Math.abs(vb));
    if (Math.abs(va - vb) > tol * scale) return { agreed: false, validSamples };
    validSamples += 1;
  }
  return { agreed: validSamples >= 4, validSamples };
}
