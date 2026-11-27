/**
 * GAM EDU — Step 5A Pure Module 3: Exact Rational, Polynomial, Rational-Function,
 * Quadratic Surd, Bounded Symbolic Calculus & Deterministic Numeric Sampling Engine
 *
 * Pure TypeScript, zero React/DOM dependencies, zero eval().
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
  n: bigint; // numerator
  d: bigint; // denominator > 0, gcd(|n|, d) === 1
}

export function bigAbs(a: bigint): bigint {
  return a < BigInt(0) ? -a : a;
}

export function bigGcd(a: bigint, b: bigint): bigint {
  let x = bigAbs(a);
  let y = bigAbs(b);
  while (y !== BigInt(0)) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x === BigInt(0) ? BigInt(1) : x;
}

export function makeRat(n: bigint, d: bigint = BigInt(1)): BigRat {
  if (d === BigInt(0)) throw new MathEvalLimitError('UNSUPPORTED', 'Division by zero in exact arithmetic.');
  if (n === BigInt(0)) return { n: BigInt(0), d: BigInt(1) };
  let num = n;
  let den = d;
  if (den < BigInt(0)) {
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

export const RAT_ZERO: BigRat = { n: BigInt(0), d: BigInt(1) };
export const RAT_ONE: BigRat = { n: BigInt(1), d: BigInt(1) };

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
  if (b.n === BigInt(0)) throw new MathEvalLimitError('UNSUPPORTED', 'Division by zero.');
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
    if (a.n === BigInt(0)) throw new MathEvalLimitError('UNSUPPORTED', '0^0 is indeterminate.');
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

/** Exact conversion of a decimal or scientific-notation literal string (e.g. "-9.995", "3.00e8") to BigRat. */
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
    return makeRat(signed * BigInt('1' + '0'.repeat(netExp)), BigInt(1));
  }
  return makeRat(signed, BigInt('1' + '0'.repeat(-netExp)));
}

/** Exact BigInt decimal rounding without binary floating-point errors (`9.995` to 2 d.p. half-up === `10.00`). */
export function roundBigRatToDecimalPlaces(
  val: BigRat,
  dp: number,
  mode: 'half-up' | 'half-even' = 'half-up',
): { roundedRat: BigRat; formatted: string } {
  const factor = BigInt('1' + '0'.repeat(Math.max(0, dp)));
  const scaled = ratMul(val, { n: factor, d: BigInt(1) });
  const neg = scaled.n < BigInt(0);
  const absN = bigAbs(scaled.n);
  const q = absN / scaled.d;
  const rem = absN % scaled.d;
  const twiceRem = rem * BigInt(2);

  let roundedAbs = q;
  if (twiceRem > scaled.d) {
    roundedAbs = q + BigInt(1);
  } else if (twiceRem === scaled.d) {
    if (mode === 'half-up') {
      roundedAbs = q + BigInt(1); // ties away from zero
    } else if (q % BigInt(2) === BigInt(1)) {
      roundedAbs = q + BigInt(1); // half-to-even
    }
  }

  const finalInt = neg && roundedAbs !== BigInt(0) ? -roundedAbs : roundedAbs;
  const roundedRat = makeRat(finalInt, factor);

  // Format with exact dp digits
  const strAbs = roundedAbs.toString().padStart(dp + 1, '0');
  const formatted =
    dp === 0
      ? `${finalInt < BigInt(0) ? '-' : ''}${strAbs}`
      : `${finalInt < BigInt(0) ? '-' : ''}${strAbs.slice(0, -dp)}.${strAbs.slice(-dp)}`;
  return { roundedRat, formatted };
}

/** Exact BigRat rounding to `sf` significant figures (`half-up` or `half-even`). */
export function roundBigRatToSigFigs(
  val: BigRat,
  sf: number,
  mode: 'half-up' | 'half-even' = 'half-up',
): { roundedRat: BigRat; orderOfMagnitude: number } {
  if (val.n === BigInt(0)) return { roundedRat: RAT_ZERO, orderOfMagnitude: 0 };
  const approx = Math.abs(ratToNumber(val));
  const mag = Math.floor(Math.log10(approx));
  const dp = sf - 1 - mag;
  if (dp >= 0) {
    const { roundedRat } = roundBigRatToDecimalPlaces(val, dp, mode);
    return { roundedRat, orderOfMagnitude: mag };
  }
  const shift = BigInt('1' + '0'.repeat(-dp));
  const shifted = ratDiv(val, { n: shift, d: BigInt(1) });
  const { roundedRat } = roundBigRatToDecimalPlaces(shifted, 0, mode);
  return { roundedRat: ratMul(roundedRat, { n: shift, d: BigInt(1) }), orderOfMagnitude: mag };
}

/* ========================================================================== */
/* 2. EXACT MULTIVARIATE POLYNOMIALS & RATIONAL FUNCTIONS                     */
/* ========================================================================== */

/** Canonical monomial key: e.g. "" for constant, "x^2*y^1" sorted alphabetically */
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
    if (c.n === BigInt(0)) continue;
    const deg = parseMonoKey(k).reduce((acc, [, e]) => acc + e, 0);
    if (deg > max) max = deg;
  }
  return max;
}

export function polyConst(c: BigRat): PolyMap {
  const m = new Map<string, BigRat>();
  if (c.n !== BigInt(0)) m.set('', c);
  return m;
}

export function polyVar(v: string): PolyMap {
  const m = new Map<string, BigRat>();
  m.set(`${v}^1`, RAT_ONE);
  return m;
}

export function polyIsZero(p: PolyMap): boolean {
  for (const c of p.values()) {
    if (c.n !== BigInt(0)) return false;
  }
  return true;
}

export function polyAdd(a: PolyMap, b: PolyMap, budget: EvalOpBudget): PolyMap {
  const res = new Map(a);
  for (const [k, c] of b.entries()) {
    budget.tick();
    const cur = res.get(k);
    const next = cur ? ratAdd(cur, c) : c;
    if (next.n === BigInt(0)) res.delete(k);
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
      if (next.n === BigInt(0)) res.delete(key);
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

/** Converts an AST to an exact RationalPoly `num / den` if purely rational/polynomial; returns null otherwise. */
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
        // Exponent must be a constant integer
        if (R.den.size !== 1 || !R.den.has('') || R.num.size > 1 || (R.num.size === 1 && !R.num.has(''))) {
          return null;
        }
        const expRat = R.num.get('') ?? RAT_ZERO;
        if (expRat.d !== BigInt(1)) return null;
        const expNum = Number(expRat.n);
        // Constant numeric base (degree 0): allow up to maxNumericExponentAbs (e.g. 2^3^2 = 512)!
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
          return {
            num: polyPow(L.den, -expNum, budget),
            den: polyPow(L.num, -expNum, budget),
          };
        }
        return {
          num: polyPow(L.num, expNum, budget),
          den: polyPow(L.den, expNum, budget),
        };
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

/* ========================================================================== */
/* 3. EXACT QUADRATIC SURD CANONICALISER (a + b√d)                            */
/* ========================================================================== */

/** Maps square-free radicand d >= 1 (d=1 is rational part) -> exact BigRat coefficient */
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
    if (next.n === BigInt(0)) res.delete(d);
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
      if (next.n === BigInt(0)) res.delete(inside);
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
    if (r.n !== BigInt(0)) m.set(1, r);
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
    if (r.n < BigInt(0)) throw new MathEvalLimitError('UNSUPPORTED', 'Square root of a negative number is not real.');
    if (r.n === BigInt(0)) return new Map();
    // sqrt(p/q) = sqrt(p*q)/q
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
      // Support division by rational or single surd c*sqrt(d)
      if (R.size === 0) throw new MathEvalLimitError('UNSUPPORTED', 'Division by zero.');
      if (R.size === 1) {
        const [[d, c]] = Array.from(R.entries());
        // 1 / (c * sqrt(d)) = sqrt(d) / (c * d)
        const inv: SurdSum = new Map([[d, ratDiv(RAT_ONE, ratMul(c, makeRat(BigInt(d))))]]);
        return surdMul(L, inv);
      }
      return null;
    }
    if (node.op === '^') {
      if (R.size > 1 || (R.size === 1 && !R.has(1))) return null;
      const exp = R.get(1) ?? RAT_ZERO;
      if (exp.d === BigInt(1)) {
        const e = Number(exp.n);
        if (e < 0 || e > 4) return null;
        let res: SurdSum = new Map([[1, RAT_ONE]]);
        for (let k = 0; k < e; k++) res = surdMul(res, L);
        return res;
      }
      // Support rational^(1/2)
      if (exp.n === BigInt(1) && exp.d === BigInt(2)) {
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
/* 4. BOUNDED SYMBOLIC DIFFERENTIATION (RADIANS FOR TRIG)                     */
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
        // Product rule: u'v + uv'
        return {
          type: 'binary',
          op: '+',
          left: { type: 'binary', op: '*', left: du, right: v },
          right: { type: 'binary', op: '*', left: u, right: dv },
        };
      }
      if (node.op === '/') {
        // Quotient rule: (u'v - uv') / v^2
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
        // Power rule when exponent is constant w.r.t. variable: v * u^(v-1) * u'
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
        // Exponential rule e^v: e^v * v'
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
        // Handles both ln(g) and ln|g| (ln(abs(g))) -> g'/g WITHOUT differentiating abs()!
        const inner = g.type === 'call' && g.name === 'abs' ? g.arg : g;
        const dInner = differentiateAst(inner, variable, budget);
        return { type: 'binary', op: '/', left: dInner, right: inner };
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
        // sec^2(g) * g' = g' / cos(g)^2
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
/* 5. ANSWER FORM CHECKERS (SEPARATE FROM EQUIVALENCE)                        */
/* ========================================================================== */

export function isExpandedPolynomialAst(node: EvalAstNode): boolean {
  // Rejects unexpanded products containing sums like 2(x+3) or (x+1)^2
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
  // Count additive terms in the AST vs canonical polynomial term count
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

export function isFactoredFormAst(node: EvalAstNode): boolean {
  // Top-level must be a product (or power of a binomial/factor) — not an unfactored top-level sum
  if (node.type === 'unary') return isFactoredFormAst(node.arg);
  if (node.type === 'binary' && (node.op === '*' || node.op === '^')) return true;
  return false;
}

export function isReducedFractionAst(node: EvalAstNode): boolean {
  const core = node.type === 'unary' ? node.arg : node;
  if (core.type === 'number') return /^\d+$/.test(core.raw); // integer is already reduced
  if (core.type === 'binary' && core.op === '/' && core.left.type === 'number' && core.right.type === 'number') {
    if (!/^\d+$/.test(core.left.raw) || !/^\d+$/.test(core.right.raw)) return false;
    const p = BigInt(core.left.raw);
    const q = BigInt(core.right.raw);
    return q > BigInt(1) && bigGcd(p, q) === BigInt(1);
  }
  return false;
}

export function isSimplifiedSurdAst(node: EvalAstNode): boolean {
  // Every sqrt(n) must have square-free integer n > 1, and no duplicate radicands in sums
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
      if (outside > 1) {
        ok = false;
        return;
      }
      if (seenRadicands.has(n.arg.value)) {
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
/* 6. BOUNDED DETERMINISTIC NUMERIC EVALUATION (NEVER UNIVERSAL PROOF!)       */
/* ========================================================================== */

/** Deterministic irrational/prime-offset sampling points to defeat integer traps like sin(pi*x) === 0! */
const DETERMINISTIC_SAMPLES = [
  0.3719, 1.41421, 2.71828, -0.61803, 3.14159 / 2 + 0.13, 4.23607, -1.73205, 0.86602,
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
        case 'abs':
          res = Math.abs(a);
          break;
        case 'sqrt':
          if (a < -1e-12) return null;
          res = Math.sqrt(Math.max(0, a));
          break;
        case 'cbrt':
          res = Math.cbrt(a);
          break;
        case 'sin':
          res = Math.sin(a);
          break;
        case 'cos':
          res = Math.cos(a);
          break;
        case 'tan':
          if (Math.abs(Math.cos(a)) < 1e-9) return null;
          res = Math.tan(a);
          break;
        case 'ln':
          if (a <= 1e-12) return null;
          res = Math.log(a);
          break;
        case 'log10':
          if (a <= 1e-12) return null;
          res = Math.log10(a);
          break;
        case 'exp':
          if (a > 50) return null;
          res = Math.exp(a);
          break;
      }
      return Number.isFinite(res) ? res : null;
    }
    case 'binary': {
      const l = evalAstNumeric(node.left, env, budget);
      const r = evalAstNumeric(node.right, env, budget);
      if (l === null || r === null) return null;
      let res: number;
      switch (node.op) {
        case '+':
          res = l + r;
          break;
        case '-':
          res = l - r;
          break;
        case '*':
          res = l * r;
          break;
        case '/':
          if (Math.abs(r) < 1e-12) return null;
          res = l / r;
          break;
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
    if (Math.abs(va - vb) > tol * scale) {
      return { agreed: false, validSamples };
    }
    validSamples += 1;
  }
  return { agreed: validSamples >= 4, validSamples };
}
