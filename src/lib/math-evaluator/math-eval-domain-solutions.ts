/**
 * GAM EDU — Step 5A Pure Module 4: Parsed Domain Constraints, Independent Complete
 * Equation Certification, Exact Root Comparison & Exact Interval-Union Engine
 *
 * Pure TypeScript, zero React/DOM dependencies, ES2017-clean BigInt.
 */

import {
  EvalOpBudget,
  MATH_EVAL_LIMITS,
  MathEvalLimitError,
} from './math-eval-limits';
import { parseEvalExpr, type EvalAstNode } from './math-eval-parser';
import {
  RAT_ONE,
  RAT_ZERO,
  astToExactSurd,
  astToRationalPoly,
  evalAstNumeric,
  extractSquareFactor,
  makeRat,
  polyDegree,
  polyIsZero,
  polyMul,
  polySub,
  ratCmp,
  ratDiv,
  ratEq,
  ratNeg,
  ratToNumber,
  surdEqual,
  type BigRat,
  type PolyMap,
  type SurdSum,
} from './math-eval-exact';

const B0 = BigInt(0);
const B1 = BigInt(1);
const B2 = BigInt(2);
const B4 = BigInt(4);

/* ========================================================================== */
/* 1. EXACT ROOT REPRESENTATION (ZERO 1e-6 / 1e-5 FLOATING-POINT MERGING!)    */
/* ========================================================================== */

export type ExactRoot =
  | { kind: 'rat'; value: BigRat }
  | { kind: 'surd'; value: SurdSum };

export function parseExactRoot(raw: string, budget: EvalOpBudget): ExactRoot | null {
  const ast = parseEvalExpr(raw, { allowedVariables: [] }).ast;
  const rp = astToRationalPoly(ast, budget);
  if (rp && rp.num.size <= 1 && rp.den.size === 1 && rp.den.has('')) {
    const num = rp.num.get('') ?? RAT_ZERO;
    const den = rp.den.get('')!;
    return { kind: 'rat', value: ratDiv(num, den) };
  }
  const surd = astToExactSurd(ast, budget);
  if (surd) {
    if (surd.size === 0) return { kind: 'rat', value: RAT_ZERO };
    if (surd.size === 1 && surd.has(1)) return { kind: 'rat', value: surd.get(1)! };
    return { kind: 'surd', value: surd };
  }
  return null;
}

export function exactRootEqual(a: ExactRoot, b: ExactRoot): boolean {
  if (a.kind === 'rat' && b.kind === 'rat') return ratEq(a.value, b.value);
  if (a.kind === 'surd' && b.kind === 'surd') return surdEqual(a.value, b.value);
  return false;
}

export function exactRootToNumber(r: ExactRoot): number {
  if (r.kind === 'rat') return ratToNumber(r.value);
  let sum = 0;
  for (const [d, c] of r.value.entries()) {
    sum += ratToNumber(c) * Math.sqrt(d);
  }
  return sum;
}

/* ========================================================================== */
/* 2. EXACT INTERVAL-UNION ENGINE                                             */
/* ========================================================================== */

export type ExactEndpoint = { kind: 'neg-inf' } | { kind: 'pos-inf' } | { kind: 'rat'; value: BigRat };

export interface ExactInterval {
  low: ExactEndpoint;
  lowInclusive: boolean;
  high: ExactEndpoint;
  highInclusive: boolean;
}

function cmpEndpoint(a: ExactEndpoint, b: ExactEndpoint): -1 | 0 | 1 {
  if (a.kind === b.kind) {
    if (a.kind === 'rat' && b.kind === 'rat') return ratCmp(a.value, b.value);
    return 0;
  }
  if (a.kind === 'neg-inf' || b.kind === 'pos-inf') return -1;
  return 1;
}

export function parseEndpoint(raw: string): ExactEndpoint {
  const s = raw.trim().toLowerCase().replace(/^\+/, '').replace(/∞/g, 'inf');
  if (s === '-inf' || s === '-infinity') return { kind: 'neg-inf' };
  if (s === 'inf' || s === 'infinity') return { kind: 'pos-inf' };
  const parsed = parseEvalExpr(s, { allowedVariables: [] });
  const budget = new EvalOpBudget();
  const rp = astToRationalPoly(parsed.ast, budget);
  if (!rp || rp.num.size > 1 || rp.den.size !== 1 || !rp.den.has('')) {
    throw new MathEvalLimitError('SYNTAX_ERROR', `Interval endpoint "${raw}" must be an exact number or ±inf.`);
  }
  const num = rp.num.get('') ?? RAT_ZERO;
  const den = rp.den.get('')!;
  return { kind: 'rat', value: ratDiv(num, den) };
}

export function normaliseIntervalUnion(rawIntervals: ExactInterval[]): ExactInterval[] {
  const valid: ExactInterval[] = [];
  for (const iv of rawIntervals) {
    if ((iv.low.kind === 'neg-inf' || iv.low.kind === 'pos-inf') && iv.lowInclusive) {
      throw new MathEvalLimitError('SYNTAX_ERROR', 'Infinity endpoints cannot be inclusive (use "(" or ")").');
    }
    if ((iv.high.kind === 'neg-inf' || iv.high.kind === 'pos-inf') && iv.highInclusive) {
      throw new MathEvalLimitError('SYNTAX_ERROR', 'Infinity endpoints cannot be inclusive (use "(" or ")").');
    }
    const c = cmpEndpoint(iv.low, iv.high);
    if (c > 0) continue;
    if (c === 0 && !(iv.lowInclusive && iv.highInclusive)) continue;
    valid.push({ ...iv });
  }

  valid.sort((a, b) => {
    const c = cmpEndpoint(a.low, b.low);
    if (c !== 0) return c;
    if (a.lowInclusive !== b.lowInclusive) return a.lowInclusive ? -1 : 1;
    return cmpEndpoint(a.high, b.high);
  });

  const merged: ExactInterval[] = [];
  for (const cur of valid) {
    if (merged.length === 0) {
      merged.push(cur);
      continue;
    }
    const prev = merged[merged.length - 1];
    const cmp = cmpEndpoint(cur.low, prev.high);
    if (cmp < 0 || (cmp === 0 && (prev.highInclusive || cur.lowInclusive))) {
      const highCmp = cmpEndpoint(cur.high, prev.high);
      if (highCmp > 0) {
        prev.high = cur.high;
        prev.highInclusive = cur.highInclusive;
      } else if (highCmp === 0) {
        prev.highInclusive = prev.highInclusive || cur.highInclusive;
      }
    } else {
      merged.push(cur);
    }
  }
  return merged;
}

export function areIntervalUnionsEqual(a: ExactInterval[], b: ExactInterval[]): boolean {
  const na = normaliseIntervalUnion(a);
  const nb = normaliseIntervalUnion(b);
  if (na.length !== nb.length) return false;
  for (let i = 0; i < na.length; i++) {
    if (
      cmpEndpoint(na[i].low, nb[i].low) !== 0 ||
      cmpEndpoint(na[i].high, nb[i].high) !== 0 ||
      na[i].lowInclusive !== nb[i].lowInclusive ||
      na[i].highInclusive !== nb[i].highInclusive
    ) {
      return false;
    }
  }
  return true;
}

export function allRealsIntervalUnion(): ExactInterval[] {
  return [{ low: { kind: 'neg-inf' }, lowInclusive: false, high: { kind: 'pos-inf' }, highInclusive: false }];
}

function intersectTwoIntervals(a: ExactInterval, b: ExactInterval): ExactInterval | null {
  const lowCmp = cmpEndpoint(a.low, b.low);
  let low: ExactEndpoint;
  let lowInclusive: boolean;
  if (lowCmp > 0) {
    low = a.low;
    lowInclusive = a.lowInclusive;
  } else if (lowCmp < 0) {
    low = b.low;
    lowInclusive = b.lowInclusive;
  } else {
    low = a.low;
    lowInclusive = a.lowInclusive && b.lowInclusive;
  }

  const highCmp = cmpEndpoint(a.high, b.high);
  let high: ExactEndpoint;
  let highInclusive: boolean;
  if (highCmp < 0) {
    high = a.high;
    highInclusive = a.highInclusive;
  } else if (highCmp > 0) {
    high = b.high;
    highInclusive = b.highInclusive;
  } else {
    high = a.high;
    highInclusive = a.highInclusive && b.highInclusive;
  }

  const lh = cmpEndpoint(low, high);
  if (lh > 0) return null;
  if (lh === 0 && !(lowInclusive && highInclusive)) return null;
  return { low, lowInclusive, high, highInclusive };
}

export function intersectIntervalUnions(a: ExactInterval[], b: ExactInterval[]): ExactInterval[] {
  const na = normaliseIntervalUnion(a);
  const nb = normaliseIntervalUnion(b);
  const out: ExactInterval[] = [];
  for (const ia of na) {
    for (const ib of nb) {
      const inter = intersectTwoIntervals(ia, ib);
      if (inter) out.push(inter);
    }
  }
  return normaliseIntervalUnion(out);
}

export function subtractPointFromUnion(union: ExactInterval[], pt: BigRat): ExactInterval[] {
  const p: ExactEndpoint = { kind: 'rat', value: pt };
  const complement: ExactInterval[] = [
    { low: { kind: 'neg-inf' }, lowInclusive: false, high: p, highInclusive: false },
    { low: p, lowInclusive: false, high: { kind: 'pos-inf' }, highInclusive: false },
  ];
  return intersectIntervalUnions(union, complement);
}

export function isIntervalUnionSubset(sub: ExactInterval[], sup: ExactInterval[]): boolean {
  const nSub = normaliseIntervalUnion(sub);
  return areIntervalUnionsEqual(intersectIntervalUnions(nSub, sup), nSub);
}

export function parseIntervalOrInequality(
  raw: string,
  variable: string,
  acceptedStyle: 'inequality' | 'interval' | 'either' = 'either',
): ExactInterval[] {
  const trimmed = raw
    .trim()
    .replace(/[\u2212\u2013]/g, '-')
    .replace(/\u2264/g, '<=')
    .replace(/\u2265/g, '>=')
    .replace(/\u221E/g, 'inf')
    .replace(/\u222A/g, ' U ');

  const lower = trimmed.toLowerCase();
  if (lower === 'empty' || lower === 'none' || lower === 'no solution' || lower === '∅' || lower === '{}') {
    return [];
  }
  if (lower === 'all reals' || lower === 'all real numbers' || lower === 'r' || lower === 'ℝ' || lower === '(-inf, inf)') {
    return [{ low: { kind: 'neg-inf' }, lowInclusive: false, high: { kind: 'pos-inf' }, highInclusive: false }];
  }

  const parts = trimmed.split(/\s+(?:U|u|or)\s+|∪/).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0 || parts.length > MATH_EVAL_LIMITS.maxIntervals) {
    throw new MathEvalLimitError('LIMIT_EXCEEDED', `Expected 1..${MATH_EVAL_LIMITS.maxIntervals} interval components.`);
  }

  const out: ExactInterval[] = [];
  for (const part of parts) {
    const ivMatch = /^([(\[])\s*([^,]+)\s*,\s*([^)\]]+)\s*([)\]])$/.exec(part);
    if (ivMatch) {
      if (acceptedStyle === 'inequality') {
        throw new MathEvalLimitError('SYNTAX_ERROR', 'Use inequality notation (e.g. x < 2) rather than interval notation.');
      }
      out.push({
        low: parseEndpoint(ivMatch[2]),
        lowInclusive: ivMatch[1] === '[',
        high: parseEndpoint(ivMatch[3]),
        highInclusive: ivMatch[4] === ']',
      });
      continue;
    }

    const chainMatch = /^(.+?)\s*(<=|<)\s*([a-zA-Z])\s*(<=|<)\s*(.+)$/.exec(part);
    if (chainMatch) {
      if (acceptedStyle === 'interval') {
        throw new MathEvalLimitError('SYNTAX_ERROR', 'Use interval notation (e.g. [-3, 4)) rather than inequality notation.');
      }
      if (chainMatch[3] !== variable) {
        throw new MathEvalLimitError('SYNTAX_ERROR', `Expected variable "${variable}", found "${chainMatch[3]}".`);
      }
      out.push({
        low: parseEndpoint(chainMatch[1]),
        lowInclusive: chainMatch[2] === '<=',
        high: parseEndpoint(chainMatch[5]),
        highInclusive: chainMatch[4] === '<=',
      });
      continue;
    }

    const singleVarLeft = /^([a-zA-Z])\s*(<=|>=|<|>|=)\s*(.+)$/.exec(part);
    if (singleVarLeft) {
      if (acceptedStyle === 'interval') {
        throw new MathEvalLimitError('SYNTAX_ERROR', 'Use interval notation (e.g. (-inf, 5]) rather than inequality notation.');
      }
      if (singleVarLeft[1] !== variable) {
        throw new MathEvalLimitError('SYNTAX_ERROR', `Expected variable "${variable}", found "${singleVarLeft[1]}".`);
      }
      const op = singleVarLeft[2];
      const ep = parseEndpoint(singleVarLeft[3]);
      if (op === '=') {
        out.push({ low: ep, lowInclusive: true, high: ep, highInclusive: true });
      } else if (op === '<' || op === '<=') {
        out.push({ low: { kind: 'neg-inf' }, lowInclusive: false, high: ep, highInclusive: op === '<=' });
      } else {
        out.push({ low: ep, lowInclusive: op === '>=', high: { kind: 'pos-inf' }, highInclusive: false });
      }
      continue;
    }

    throw new MathEvalLimitError('SYNTAX_ERROR', `Could not parse interval or inequality component "${part}".`);
  }

  return normaliseIntervalUnion(out);
}

/* ========================================================================== */
/* 3. PARSED MATHEMATICAL DOMAIN CONSTRAINTS (NO SUBSTRING MATCHING!)         */
/* ========================================================================== */

/**
 * Parses learner excluded-value statements such as `x != 3`, `x ≠ 3, x ≠ 4`, `x != 3 and x != -2`
 * into a canonical exact BigRat set (rejecting malformed or contradictory entries).
 */
export function parseExcludedValuesSet(raw: string, variable: string, budget: EvalOpBudget): BigRat[] {
  const norm = raw.trim().replace(/\u2260/g, '!=').replace(/[\u2212\u2013]/g, '-');
  if (!norm) return [];
  const clauses = norm.split(/,|;|\band\b/i).map((c) => c.trim()).filter(Boolean);
  const out: BigRat[] = [];
  for (const clause of clauses) {
    const m = /^([a-zA-Z])\s*!=\s*(.+)$/.exec(clause);
    if (!m) {
      throw new MathEvalLimitError('SYNTAX_ERROR', `Invalid domain exclusion "${clause}". Write e.g. ${variable} != 3.`);
    }
    if (m[1] !== variable) {
      throw new MathEvalLimitError('SYNTAX_ERROR', `Domain exclusion variable "${m[1]}" does not match "${variable}".`);
    }
    const root = parseExactRoot(m[2], budget);
    if (!root || root.kind !== 'rat') {
      throw new MathEvalLimitError('SYNTAX_ERROR', `Excluded value "${m[2]}" must be an exact rational number.`);
    }
    if (!out.some((r) => ratEq(r, root.value))) out.push(root.value);
  }
  return out;
}

export function areExcludedSetsEqual(a: BigRat[], b: BigRat[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((ra) => b.some((rb) => ratEq(ra, rb)));
}

export interface ExtractedDomain {
  certifiable: boolean;
  domain: ExactInterval[];
  excludedRats: BigRat[];
  restrictedInterval?: ExactInterval;
}

export function solveUnivariatePolyExact(
  poly: PolyMap,
  variable: string,
):
  | { status: 'finite'; roots: ExactRoot[] }
  | { status: 'identity' }
  | { status: 'unsupported' } {
  for (const k of poly.keys()) {
    if (!k) continue;
    const parts = k.split('*');
    if (parts.some((p) => !p.startsWith(`${variable}^`))) return { status: 'unsupported' };
  }
  const deg = polyDegree(poly);
  const c0 = poly.get('') ?? RAT_ZERO;
  const c1 = poly.get(`${variable}^1`) ?? RAT_ZERO;
  const c2 = poly.get(`${variable}^2`) ?? RAT_ZERO;

  if (deg === 0) {
    return c0.n === B0 ? { status: 'identity' } : { status: 'finite', roots: [] };
  }
  if (deg === 1) {
    return { status: 'finite', roots: [{ kind: 'rat', value: ratDiv(ratNeg(c0), c1) }] };
  }
  if (deg === 2) {
    // Exact BigRat discriminant: D = c1^2 - 4*c2*c0
    const disc = makeRat(
      c1.n * c1.n * c2.d * c0.d - B4 * c2.n * c0.n * c1.d * c1.d,
      c1.d * c1.d * c2.d * c0.d,
    );
    if (disc.n < B0) return { status: 'finite', roots: [] };
    const twoA = makeRat(c2.n * B2, c2.d);
    if (disc.n === B0) {
      return { status: 'finite', roots: [{ kind: 'rat', value: ratDiv(ratNeg(c1), twoA) }] };
    }
    // Check if disc = p/q has exact integer sqrt(p*q)/q -> exact rational or exact quadratic surd!
    const prod = Number(disc.n * disc.d);
    if (!Number.isSafeInteger(prod) || prod > MATH_EVAL_LIMITS.maxSurdRadicand) {
      return { status: 'unsupported' };
    }
    const { outside, inside } = extractSquareFactor(prod);
    const sqrtCoeff = makeRat(BigInt(outside), disc.d);
    const negBOver2A = ratDiv(ratNeg(c1), twoA);
    const surdOver2A = ratDiv(sqrtCoeff, twoA);
    if (inside === 1) {
      const r1 = makeRat(negBOver2A.n * surdOver2A.d - surdOver2A.n * negBOver2A.d, negBOver2A.d * surdOver2A.d);
      const r2 = makeRat(negBOver2A.n * surdOver2A.d + surdOver2A.n * negBOver2A.d, negBOver2A.d * surdOver2A.d);
      return { status: 'finite', roots: [{ kind: 'rat', value: r1 }, { kind: 'rat', value: r2 }] };
    }
    const s1: SurdSum = new Map();
    if (negBOver2A.n !== B0) s1.set(1, negBOver2A);
    s1.set(inside, ratNeg(surdOver2A));
    const s2: SurdSum = new Map();
    if (negBOver2A.n !== B0) s2.set(1, negBOver2A);
    s2.set(inside, surdOver2A);
    return { status: 'finite', roots: [{ kind: 'surd', value: s1 }, { kind: 'surd', value: s2 }] };
  }
  return { status: 'unsupported' };
}

/**
 * Walks the ORIGINAL un-simplified AST (preserving nested denominators like `1/(1/x)`,
 * removable discontinuities like `x^2/x`, and log/sqrt positivity domains like `ln(x(x-2))`
 * and `ln(x^2)`) to compute the exact canonical 1D real natural domain `ExactInterval[]`.
 *
 * Sets `certifiable = false` whenever a denominator, negative power, log, or sqrt argument
 * lies outside the supported univariate degree 0..2 rational-root / abs classes.
 */
export function extractOriginalDomain(node: EvalAstNode, variable: string, budget: EvalOpBudget): ExtractedDomain {
  const excluded: BigRat[] = [];
  let certifiable = true;
  let domain: ExactInterval[] = allRealsIntervalUnion();

  const excludeZeroPoly = (poly: PolyMap) => {
    const solved = solveUnivariatePolyExact(poly, variable);
    if (solved.status === 'unsupported') {
      certifiable = false;
      return;
    }
    if (solved.status === 'identity') {
      // Constant zero denominator (e.g. 0/0 or 1/(x-x)) -> undefined everywhere!
      domain = [];
      return;
    }
    for (const r of solved.roots) {
      if (r.kind === 'rat') {
        if (!excluded.some((e) => ratEq(e, r.value))) excluded.push(r.value);
        domain = subtractPointFromUnion(domain, r.value);
      } else {
        certifiable = false;
      }
    }
  };

  const applyPositivityConstraint = (argNode: EvalAstNode, strict: boolean) => {
    // Handle abs(u): sqrt(abs(u)) is always >= 0; ln(abs(u)) requires u != 0
    if (argNode.type === 'call' && argNode.name === 'abs') {
      if (!strict) return;
      let innerRp = null;
      try {
        innerRp = astToRationalPoly(argNode.arg, budget);
      } catch {
        domain = [];
        return;
      }
      if (!innerRp || innerRp.den.size !== 1 || !innerRp.den.has('')) {
        certifiable = false;
        return;
      }
      excludeZeroPoly(innerRp.num);
      return;
    }

    let argRp = null;
    try {
      argRp = astToRationalPoly(argNode, budget);
    } catch {
      domain = [];
      return;
    }
    if (!argRp || argRp.den.size !== 1 || !argRp.den.has('')) {
      certifiable = false;
      return;
    }

    // Normalise by positive/negative constant denominator sign
    const denConst = argRp.den.get('')!;
    const poly = new Map<string, BigRat>();
    for (const [k, c] of argRp.num.entries()) {
      poly.set(k, ratDiv(c, denConst));
    }

    // Ensure purely univariate in `variable`
    for (const k of poly.keys()) {
      if (!k) continue;
      const parts = k.split('*');
      if (parts.some((p) => !p.startsWith(`${variable}^`))) {
        certifiable = false;
        return;
      }
    }

    const deg = polyDegree(poly);
    const c0 = poly.get('') ?? RAT_ZERO;
    const c1 = poly.get(`${variable}^1`) ?? RAT_ZERO;
    const c2 = poly.get(`${variable}^2`) ?? RAT_ZERO;

    if (deg === 0) {
      const ok = strict ? c0.n > B0 : c0.n >= B0;
      if (!ok) domain = [];
      return;
    }

    if (deg === 1) {
      const root = ratDiv(ratNeg(c0), c1);
      const ep: ExactEndpoint = { kind: 'rat', value: root };
      const iv: ExactInterval =
        c1.n > B0
          ? { low: ep, lowInclusive: !strict, high: { kind: 'pos-inf' }, highInclusive: false }
          : { low: { kind: 'neg-inf' }, lowInclusive: false, high: ep, highInclusive: !strict };
      domain = intersectIntervalUnions(domain, [iv]);
      return;
    }

    if (deg === 2) {
      const solved = solveUnivariatePolyExact(poly, variable);
      if (solved.status !== 'finite') {
        certifiable = false;
        return;
      }
      if (solved.roots.some((r) => r.kind !== 'rat')) {
        certifiable = false;
        return;
      }
      const ratRoots = (solved.roots as Array<{ kind: 'rat'; value: BigRat }>)
        .map((r) => r.value)
        .sort((a, b) => ratCmp(a, b));

      if (ratRoots.length === 0) {
        // No real roots -> always same sign as c2
        if (c2.n < B0) domain = [];
        return;
      }
      if (ratRoots.length === 1) {
        // Double root r (e.g. x^2 -> r = 0):
        const r = ratRoots[0];
        if (c2.n > B0) {
          if (strict) {
            if (!excluded.some((e) => ratEq(e, r))) excluded.push(r);
            domain = subtractPointFromUnion(domain, r);
          }
          // non-strict (e.g. sqrt(x^2)): valid for all R
        } else {
          if (strict) {
            domain = [];
          } else {
            const ep: ExactEndpoint = { kind: 'rat', value: r };
            domain = intersectIntervalUnions(domain, [{ low: ep, lowInclusive: true, high: ep, highInclusive: true }]);
          }
        }
        return;
      }
      // Two distinct rational roots r1 < r2 (e.g. x(x-2) -> r1=0, r2=2)
      const ep1: ExactEndpoint = { kind: 'rat', value: ratRoots[0] };
      const ep2: ExactEndpoint = { kind: 'rat', value: ratRoots[1] };
      const posSet: ExactInterval[] =
        c2.n > B0
          ? [
              { low: { kind: 'neg-inf' }, lowInclusive: false, high: ep1, highInclusive: !strict },
              { low: ep2, lowInclusive: !strict, high: { kind: 'pos-inf' }, highInclusive: false },
            ]
          : [{ low: ep1, lowInclusive: !strict, high: ep2, highInclusive: !strict }];
      domain = intersectIntervalUnions(domain, posSet);
      return;
    }

    certifiable = false;
  };

  const walk = (n: EvalAstNode) => {
    budget.tick();
    if (n.type === 'binary' && n.op === '/') {
      if (n.right.type === 'call' && n.right.name === 'abs') {
        try {
          const innerRp = astToRationalPoly(n.right.arg, budget);
          if (!innerRp || innerRp.den.size !== 1 || !innerRp.den.has('')) certifiable = false;
          else excludeZeroPoly(innerRp.num);
        } catch {
          domain = [];
        }
      } else {
        try {
          const denRp = astToRationalPoly(n.right, budget);
          if (!denRp) certifiable = false;
          else excludeZeroPoly(denRp.num);
        } catch {
          // Division by zero inside denominator itself (e.g. 1/(1/0)) -> undefined
          domain = [];
        }
      }
    }
    if (n.type === 'binary' && n.op === '^') {
      // Negative integer exponent u^(-k) has same domain restriction u != 0 as 1/u^k
      try {
        const expRp = astToRationalPoly(n.right, budget);
        if (expRp && expRp.den.size === 1 && expRp.den.has('') && expRp.num.size === 1 && expRp.num.has('')) {
          const expRat = ratDiv(expRp.num.get('')!, expRp.den.get('')!);
          if (expRat.d === B1 && expRat.n < B0) {
            const baseRp = astToRationalPoly(n.left, budget);
            if (!baseRp) certifiable = false;
            else excludeZeroPoly(baseRp.num);
          }
        }
      } catch {
        domain = [];
      }
    }
    if (n.type === 'call' && (n.name === 'ln' || n.name === 'log10' || n.name === 'sqrt')) {
      applyPositivityConstraint(n.arg, n.name !== 'sqrt');
    }
    if (n.type === 'call' && n.name === 'tan') {
      // tan(u) has infinitely many periodic poles -> not representable as a finite interval union
      certifiable = false;
    }
    if (n.type === 'unary') walk(n.arg);
    else if (n.type === 'call') walk(n.arg);
    else if (n.type === 'binary') {
      walk(n.left);
      walk(n.right);
    }
  };

  walk(node);
  return {
    certifiable,
    domain: normaliseIntervalUnion(domain),
    excludedRats: excluded,
    restrictedInterval: domain.length === 1 ? domain[0] : undefined,
  };
}

export const extractExpressionDomain = extractOriginalDomain;

/* ========================================================================== */
/* 4. INDEPENDENT COMPLETE EQUATION CERTIFICATION (ALL 5 CLASSES!)            */
/* ========================================================================== */

export type EquationClass =
  | 'linear'
  | 'quadratic'
  | 'factored-polynomial'
  | 'rational-linear-quadratic'
  | 'radical-single';

export function splitEquation(eq: string): { lhs: string; rhs: string } {
  const parts = eq.split('=');
  if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
    throw new MathEvalLimitError('SYNTAX_ERROR', 'Equation must contain exactly one "=" separating LHS and RHS.');
  }
  return { lhs: parts[0].trim(), rhs: parts[1].trim() };
}

export function testCandidateAgainstOriginalEquation(
  lhsAst: EvalAstNode,
  rhsAst: EvalAstNode,
  variable: string,
  candidateVal: number,
  budget: EvalOpBudget,
): { satisfies: boolean; domainError: boolean } {
  const lv = evalAstNumeric(lhsAst, { [variable]: candidateVal }, budget);
  const rv = evalAstNumeric(rhsAst, { [variable]: candidateVal }, budget);
  if (lv === null || rv === null) return { satisfies: false, domainError: true };
  const scale = Math.max(1, Math.abs(lv), Math.abs(rv));
  return { satisfies: Math.abs(lv - rv) <= 1e-9 * scale, domainError: false };
}

function addDistinctRoot(list: ExactRoot[], root: ExactRoot): void {
  if (!list.some((r) => exactRootEqual(r, root))) list.push(root);
}

/** Independently derives the complete distinct solution set for ALL 5 bounded equation classes. */
export function deriveCompleteEquationSolutions(
  originalEquation: string,
  variable: string,
  equationClass: EquationClass,
  budget: EvalOpBudget,
):
  | { status: 'finite'; roots: ExactRoot[] }
  | { status: 'all-reals' }
  | { status: 'restricted-identity'; excludedRats: BigRat[] }
  | { status: 'invalid-class'; reason: string } {
  const { lhs, rhs } = splitEquation(originalEquation);
  const lAst = parseEvalExpr(lhs, { allowedVariables: [variable] }).ast;
  const rAst = parseEvalExpr(rhs, { allowedVariables: [variable] }).ast;

  const lDom = extractOriginalDomain(lAst, variable, budget);
  const rDom = extractOriginalDomain(rAst, variable, budget);
  const allExcluded: BigRat[] = [...lDom.excludedRats];
  for (const e of rDom.excludedRats) {
    if (!allExcluded.some((x) => ratEq(x, e))) allExcluded.push(e);
  }

  if (equationClass === 'linear' || equationClass === 'quadratic') {
    const lRp = astToRationalPoly(lAst, budget);
    const rRp = astToRationalPoly(rAst, budget);
    if (!lRp || !rRp || polyDegree(lRp.den) > 0 || polyDegree(rRp.den) > 0 || allExcluded.length > 0) {
      return {
        status: 'invalid-class',
        reason: `Equation "${originalEquation}" contains a variable denominator and cannot be declared as "${equationClass}".`,
      };
    }
    const diff = polySub(polyMul(lRp.num, rRp.den, budget), polyMul(rRp.num, lRp.den, budget), budget);
    const deg = polyDegree(diff);
    if (equationClass === 'linear' && deg > 1) {
      return { status: 'invalid-class', reason: `Equation "${originalEquation}" has degree ${deg} (exceeds linear).` };
    }
    if (equationClass === 'quadratic' && deg > 2) {
      return { status: 'invalid-class', reason: `Equation "${originalEquation}" has degree ${deg} (exceeds quadratic).` };
    }
    const solved = solveUnivariatePolyExact(diff, variable);
    if (solved.status === 'identity') return { status: 'all-reals' };
    if (solved.status === 'unsupported') return { status: 'invalid-class', reason: 'Could not derive exact roots.' };
    return { status: 'finite', roots: solved.roots };
  }

  if (equationClass === 'factored-polynomial') {
    const rRp = astToRationalPoly(rAst, budget);
    if (!rRp || !polyIsZero(rRp.num) || allExcluded.length > 0) {
      return { status: 'invalid-class', reason: 'factored-polynomial requires RHS = 0 and purely polynomial factors.' };
    }
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
    collect(lAst);
    const roots: ExactRoot[] = [];
    for (const f of factors) {
      const fRp = astToRationalPoly(f, budget);
      if (!fRp || polyDegree(fRp.den) > 0) return { status: 'invalid-class', reason: 'Non-polynomial factor.' };
      const solved = solveUnivariatePolyExact(fRp.num, variable);
      if (solved.status === 'unsupported') {
        return { status: 'invalid-class', reason: 'Factor degree exceeds quadratic in factored-polynomial.' };
      }
      if (solved.status === 'identity') return { status: 'all-reals' };
      for (const r of solved.roots) addDistinctRoot(roots, r);
    }
    return { status: 'finite', roots };
  }

  if (equationClass === 'rational-linear-quadratic') {
    if (!lDom.certifiable || !rDom.certifiable) {
      return { status: 'invalid-class', reason: 'Denominator domain is not certifiable.' };
    }
    const lRp = astToRationalPoly(lAst, budget);
    const rRp = astToRationalPoly(rAst, budget);
    if (!lRp || !rRp) return { status: 'invalid-class', reason: 'Not a rational algebraic equation.' };
    const diff = polySub(polyMul(lRp.num, rRp.den, budget), polyMul(rRp.num, lRp.den, budget), budget);
    const solved = solveUnivariatePolyExact(diff, variable);
    if (solved.status === 'unsupported') {
      return { status: 'invalid-class', reason: 'Cleared numerator exceeds quadratic degree.' };
    }
    if (solved.status === 'identity') {
      return allExcluded.length > 0
        ? { status: 'restricted-identity', excludedRats: allExcluded }
        : { status: 'all-reals' };
    }
    const filtered = solved.roots.filter(
      (r) => !(r.kind === 'rat' && allExcluded.some((ex) => ratEq(ex, r.value))),
    );
    return { status: 'finite', roots: filtered };
  }

  // radical-single: isolate sqrt(A) = B (or B = sqrt(A)) with polynomial A, B -> square A - B^2 = 0 and filter!
  let radArg: EvalAstNode | null = null;
  let otherSide: EvalAstNode | null = null;
  if (lAst.type === 'call' && lAst.name === 'sqrt') {
    radArg = lAst.arg;
    otherSide = rAst;
  } else if (rAst.type === 'call' && rAst.name === 'sqrt') {
    radArg = rAst.arg;
    otherSide = lAst;
  }
  if (!radArg || !otherSide) {
    return { status: 'invalid-class', reason: 'radical-single requires isolated sqrt(A) = B form.' };
  }
  const aRp = astToRationalPoly(radArg, budget);
  const bRp = astToRationalPoly(otherSide, budget);
  if (!aRp || !bRp || polyDegree(aRp.den) > 0 || polyDegree(bRp.den) > 0) {
    return { status: 'invalid-class', reason: 'radical-single requires polynomial radicand and right-hand side.' };
  }
  const bSq = polyMul(bRp.num, bRp.num, budget);
  const diff = polySub(aRp.num, bSq, budget);
  const solved = solveUnivariatePolyExact(diff, variable);
  if (solved.status !== 'finite') {
    return { status: 'invalid-class', reason: 'Squared radical equation exceeds quadratic degree or is degenerate.' };
  }
  const validRoots = solved.roots.filter((r) => {
    const val = exactRootToNumber(r);
    return testCandidateAgainstOriginalEquation(lAst, rAst, variable, val, budget).satisfies;
  });
  return { status: 'finite', roots: validRoots };
}

/** Authoring-time certification: independently derives and verifies the COMPLETE DISTINCT root set! */
export function certifyEquationAuthorConfig(
  originalEquation: string,
  variable: string,
  equationClass: EquationClass,
  expectedRoots: string[],
  solutionType: 'finite-set' | 'empty-set' | 'all-reals' = 'finite-set',
): string[] {
  const errors: string[] = [];
  const budget = new EvalOpBudget();
  try {
    // Parse & check for duplicate author roots (e.g. ["2", "2"] rejected!)
    const authorRoots: ExactRoot[] = [];
    for (const rStr of expectedRoots) {
      const parsed = parseExactRoot(rStr, budget);
      if (!parsed) {
        errors.push(`Author expectedRoot "${rStr}" must be an exact rational or supported quadratic surd.`);
        continue;
      }
      if (authorRoots.some((existing) => exactRootEqual(existing, parsed))) {
        errors.push(`Duplicate root "${rStr}" in expectedRoots — list distinct roots only.`);
      } else {
        authorRoots.push(parsed);
      }
    }
    if (errors.length > 0) return errors;

    const derived = deriveCompleteEquationSolutions(originalEquation, variable, equationClass, budget);
    if (derived.status === 'invalid-class') {
      errors.push(derived.reason);
      return errors;
    }
    if (derived.status === 'restricted-identity') {
      errors.push(
        `Equation "${originalEquation}" is a restricted-domain identity (excludes ${derived.excludedRats.length} pole(s)) and cannot be certified as solutionType "${solutionType}".`,
      );
      return errors;
    }
    if (derived.status === 'all-reals') {
      if (solutionType !== 'all-reals') {
        errors.push(`Equation "${originalEquation}" is an identity over all real numbers, conflicting with solutionType "${solutionType}".`);
      }
      return errors;
    }

    // derived.status === 'finite'
    if (solutionType === 'all-reals') {
      errors.push(`Equation "${originalEquation}" has a finite solution set, conflicting with solutionType "all-reals".`);
      return errors;
    }
    if (solutionType === 'empty-set') {
      if (derived.roots.length > 0 || authorRoots.length > 0) {
        errors.push(`Equation "${originalEquation}" has ${derived.roots.length} real root(s), conflicting with solutionType "empty-set".`);
      }
      return errors;
    }

    // Compare exact complete distinct root sets!
    const allDerivedPresent = derived.roots.every((dr) => authorRoots.some((ar) => exactRootEqual(dr, ar)));
    const allAuthorValid = authorRoots.every((ar) => derived.roots.some((dr) => exactRootEqual(ar, dr)));
    if (!allDerivedPresent || !allAuthorValid || authorRoots.length !== derived.roots.length) {
      errors.push(
        `Author expectedRoots [${expectedRoots.join(', ')}] do not match the independently certified complete distinct solution set (${derived.roots.length} root(s)) for "${originalEquation}".`,
      );
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : 'Invalid equation configuration.');
  }
  return errors;
}
