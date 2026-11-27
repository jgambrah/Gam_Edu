/**
 * GAM EDU — Step 5A Pure Module 4: Domain Restrictions, Equation Solution-Set Completeness
 * & Exact Interval-Union Verification
 *
 * Pure TypeScript, zero React/DOM dependencies.
 */

import {
  EvalOpBudget,
  MATH_EVAL_LIMITS,
  MathEvalLimitError,
} from './math-eval-limits';
import { parseEvalExpr, type EvalAstNode } from './math-eval-parser';
import {
  RAT_ZERO,
  astToRationalPoly,
  evalAstNumeric,
  polyDegree,
  polySub,
  ratCmp,
  ratDiv,
  ratEq,
  ratNeg,
  ratToNumber,
  type BigRat,
  type PolyMap,
} from './math-eval-exact';

/* ========================================================================== */
/* 1. EXACT INTERVAL-UNION ENGINE                                             */
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

/**
 * Normalises a list of intervals into canonical sorted disjoint form.
 * CRITICAL RULES:
 * - Infinity endpoints MUST NEVER be inclusive (throws SYNTAX_ERROR).
 * - `(2, 2)` or `high < low` -> empty (dropped).
 * - `[2, 2]` -> singleton interval (preserved).
 * - `(0, 1) U (1, 2)` -> DOES NOT merge (both exclude 1!).
 * - `(0, 1] U (1, 2)` -> MERGES into `(0, 2)`.
 * - `[0, 1] U [1, 2]` -> MERGES into `[0, 2]`.
 */
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
    if (c > 0) continue; // empty
    if (c === 0 && !(iv.lowInclusive && iv.highInclusive)) continue; // (a, a), [a, a), (a, a] are empty!
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
    // Overlap strictly (cur.low < prev.high) OR touch with at least one inclusive endpoint!
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

/** Parses learner interval notation `(-inf, -2) U [5, inf)` OR inequality notation `x < -2 or x >= 5`, `-3 <= x < 4`, `empty`, `all reals`. */
export function parseIntervalOrInequality(raw: string, variable: string): ExactInterval[] {
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

  // Split by union `U` or `or`
  const parts = trimmed.split(/\s+(?:U|u|or)\s+|∪/).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0 || parts.length > MATH_EVAL_LIMITS.maxIntervals) {
    throw new MathEvalLimitError('LIMIT_EXCEEDED', `Expected 1..${MATH_EVAL_LIMITS.maxIntervals} interval components.`);
  }

  const out: ExactInterval[] = [];
  for (const part of parts) {
    // 1. Interval syntax: [a, b) or (a, b]
    const ivMatch = /^([(\[])\s*([^,]+)\s*,\s*([^)\]]+)\s*([)\]])$/.exec(part);
    if (ivMatch) {
      out.push({
        low: parseEndpoint(ivMatch[2]),
        lowInclusive: ivMatch[1] === '[',
        high: parseEndpoint(ivMatch[3]),
        highInclusive: ivMatch[4] === ']',
      });
      continue;
    }

    // 2. Chained inequality: a <= x < b
    const chainMatch = /^(.+?)\s*(<=|<)\s*([a-zA-Z])\s*(<=|<)\s*(.+)$/.exec(part);
    if (chainMatch) {
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

    // 3. Single inequality: x <= 5, x > 2, 5 >= x
    const singleVarLeft = /^([a-zA-Z])\s*(<=|>=|<|>|=)\s*(.+)$/.exec(part);
    if (singleVarLeft) {
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
/* 2. DOMAIN EXTRACTION (PRESERVING ORIGINAL RESTRICTIONS)                    */
/* ========================================================================== */

export interface ExtractedDomain {
  certifiable: boolean;
  excludedRats: BigRat[];
  /** For univariate inequalities from ln/sqrt (e.g. x > 2), exact allowed interval */
  restrictedInterval?: ExactInterval;
  reason?: string;
}

/** Extracts exact rational roots of a univariate linear or quadratic polynomial. */
export function solveUnivariatePolyExact(
  poly: PolyMap,
  variable: string,
): { status: 'finite'; roots: BigRat[]; hasIrrational: boolean; numericRoots: number[] } | { status: 'identity' } | { status: 'unsupported' } {
  // Check polynomial is purely in `variable`
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
    return c0.n === BigInt(0) ? { status: 'identity' } : { status: 'finite', roots: [], hasIrrational: false, numericRoots: [] };
  }
  if (deg === 1) {
    const r = ratDiv(ratNeg(c0), c1);
    return { status: 'finite', roots: [r], hasIrrational: false, numericRoots: [ratToNumber(r)] };
  }
  if (deg === 2) {
    const a = ratToNumber(c2);
    const b = ratToNumber(c1);
    const c = ratToNumber(c0);
    const disc = b * b - 4 * a * c;
    if (disc < -1e-12) return { status: 'finite', roots: [], hasIrrational: false, numericRoots: [] };
    if (Math.abs(disc) <= 1e-12) {
      const r = ratDiv(ratNeg(c1), { n: c2.n * BigInt(2), d: c2.d });
      return { status: 'finite', roots: [r], hasIrrational: false, numericRoots: [ratToNumber(r)] };
    }
    const sqrtD = Math.sqrt(disc);
    const r1 = (-b - sqrtD) / (2 * a);
    const r2 = (-b + sqrtD) / (2 * a);
    // Check if discriminant is a perfect rational square
    const numDisc = c1.n * c1.n * c2.d * c0.d - BigInt(4) * c2.n * c0.n * c1.d * c1.d;
    const denDisc = c1.d * c1.d * c2.d * c0.d;
    if (numDisc >= BigInt(0)) {
      const sn = BigInt(Math.round(Math.sqrt(Number(numDisc))));
      const sd = BigInt(Math.round(Math.sqrt(Number(denDisc))));
      if (sn * sn === numDisc && sd * sd === denDisc) {
        const twoA = { n: c2.n * BigInt(2), d: c2.d };
        const discSqrtRat = { n: sn, d: sd };
        const q1 = ratDiv(ratNeg({ n: c1.n * sd + sn * c1.d, d: c1.d * sd }), twoA);
        const q2 = ratDiv({ n: -c1.n * sd + sn * c1.d, d: c1.d * sd }, twoA);
        return { status: 'finite', roots: [q1, q2], hasIrrational: false, numericRoots: [ratToNumber(q1), ratToNumber(q2)] };
      }
    }
    return { status: 'finite', roots: [], hasIrrational: true, numericRoots: [r1, r2].sort((x, y) => x - y) };
  }
  return { status: 'unsupported' };
}

/** Walks the ORIGINAL AST (before cancellation!) to extract denominator poles, log > 0, and sqrt >= 0 restrictions. */
export function extractOriginalDomain(node: EvalAstNode, variable: string, budget: EvalOpBudget): ExtractedDomain {
  const excluded: BigRat[] = [];
  let certifiable = true;
  let restrictedInterval: ExactInterval | undefined;

  const intersectLow = (low: BigRat, inclusive: boolean) => {
    const next: ExactInterval = {
      low: { kind: 'rat', value: low },
      lowInclusive: inclusive,
      high: { kind: 'pos-inf' },
      highInclusive: false,
    };
    if (!restrictedInterval) {
      restrictedInterval = next;
    } else if (restrictedInterval.low.kind === 'rat') {
      const c = ratCmp(low, restrictedInterval.low.value);
      if (c > 0) {
        restrictedInterval.low = { kind: 'rat', value: low };
        restrictedInterval.lowInclusive = inclusive;
      } else if (c === 0) {
        restrictedInterval.lowInclusive = restrictedInterval.lowInclusive && inclusive;
      }
    }
  };

  const walk = (n: EvalAstNode) => {
    budget.tick();
    if (n.type === 'binary' && n.op === '/') {
      const denRp = astToRationalPoly(n.right, budget);
      if (!denRp) {
        certifiable = false;
      } else {
        const solved = solveUnivariatePolyExact(denRp.num, variable);
        if (solved.status === 'unsupported') certifiable = false;
        else if (solved.status === 'finite') {
          for (const r of solved.roots) {
            if (!excluded.some((e) => ratEq(e, r))) excluded.push(r);
          }
        }
      }
    }
    if (n.type === 'call' && (n.name === 'ln' || n.name === 'log10' || n.name === 'sqrt')) {
      const argRp = astToRationalPoly(n.arg, budget);
      if (argRp && polyDegree(argRp.num) === 1 && argRp.den.size === 1 && argRp.den.has('')) {
        const c1 = argRp.num.get(`${variable}^1`) ?? RAT_ZERO;
        const c0 = argRp.num.get('') ?? RAT_ZERO;
        if (c1.n > BigInt(0)) {
          const bound = ratDiv(ratNeg(c0), c1);
          intersectLow(bound, n.name === 'sqrt');
        }
      }
    }
    if (n.type === 'unary') walk(n.arg);
    else if (n.type === 'call') walk(n.arg);
    else if (n.type === 'binary') {
      walk(n.left);
      walk(n.right);
    }
  };

  walk(node);
  return { certifiable, excludedRats: excluded, restrictedInterval };
}

/* ========================================================================== */
/* 3. EQUATION SOLUTION-SET VERIFICATION (AGAINST ORIGINAL EQUATION!)         */
/* ========================================================================== */

export type EquationClass =
  | 'linear'
  | 'quadratic'
  | 'factored-polynomial'
  | 'rational-linear-quadratic'
  | 'radical-single';

export interface EquationEvalResult {
  passed: boolean;
  verdict: 'exact-equivalent' | 'incorrect' | 'syntax-error' | 'unsupported-or-indeterminate';
  feedback: string;
  extraneousDetected?: string[];
  missingCount?: number;
}

export function splitEquation(eq: string): { lhs: string; rhs: string } {
  const parts = eq.split('=');
  if (parts.length !== 2 || !parts[0].trim() || !parts[1].trim()) {
    throw new MathEvalLimitError('SYNTAX_ERROR', 'Equation must contain exactly one "=" separating LHS and RHS.');
  }
  return { lhs: parts[0].trim(), rhs: parts[1].trim() };
}

/** Independently verifies a numeric/exact candidate root against the ORIGINAL equation (preserving all domain restrictions!). */
export function testCandidateAgainstOriginalEquation(
  lhsAst: EvalAstNode,
  rhsAst: EvalAstNode,
  variable: string,
  candidateVal: number,
  budget: EvalOpBudget,
): { satisfies: boolean; domainError: boolean } {
  const lv = evalAstNumeric(lhsAst, { [variable]: candidateVal }, budget);
  const rv = evalAstNumeric(rhsAst, { [variable]: candidateVal }, budget);
  if (lv === null || rv === null) {
    return { satisfies: false, domainError: true };
  }
  const scale = Math.max(1, Math.abs(lv), Math.abs(rv));
  return { satisfies: Math.abs(lv - rv) <= 1e-6 * scale, domainError: false };
}

/** Authoring-time certification: verifies declared expectedRoots against originalEquation & certifies completeness for linear/quadratic! */
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
    const { lhs, rhs } = splitEquation(originalEquation);
    const lParsed = parseEvalExpr(lhs, { allowedVariables: [variable] });
    const rParsed = parseEvalExpr(rhs, { allowedVariables: [variable] });

    // For linear / quadratic polynomial equations, independently derive the complete solution set!
    if (equationClass === 'linear' || equationClass === 'quadratic') {
      const lRp = astToRationalPoly(lParsed.ast, budget);
      const rRp = astToRationalPoly(rParsed.ast, budget);
      if (!lRp || !rRp) {
        errors.push(`Equation "${originalEquation}" is not a valid ${equationClass} polynomial.`);
        return errors;
      }
      const diff = polySub(lRp.num, rRp.num, budget);
      const solved = solveUnivariatePolyExact(diff, variable);
      if (solved.status === 'identity') {
        if (solutionType !== 'all-reals') {
          errors.push(`Equation "${originalEquation}" is an identity (all reals), but solutionType is "${solutionType}".`);
        }
        return errors;
      }
      if (solved.status === 'finite') {
        if (solutionType === 'empty-set' && solved.numericRoots.length > 0) {
          errors.push(`Equation "${originalEquation}" has real root(s), conflicting with solutionType "empty-set".`);
        } else if (solutionType === 'finite-set' && solved.numericRoots.length !== expectedRoots.length) {
          errors.push(
            `Author expectedRoots count (${expectedRoots.length}) does not match independently derived complete root count (${solved.numericRoots.length}) for "${originalEquation}".`,
          );
        }
      }
    }

    // Verify EVERY declared expectedRoot actually satisfies the ORIGINAL equation!
    for (const rStr of expectedRoots) {
      const rAst = parseEvalExpr(rStr, { allowedVariables: [] }).ast;
      const rVal = evalAstNumeric(rAst, {}, budget);
      if (rVal === null) {
        errors.push(`Declared expectedRoot "${rStr}" is not a finite real value.`);
        continue;
      }
      const check = testCandidateAgainstOriginalEquation(lParsed.ast, rParsed.ast, variable, rVal, budget);
      if (!check.satisfies) {
        errors.push(
          `Declared expectedRoot "${rStr}" fails the original equation "${originalEquation}"${check.domainError ? ' (domain violation)' : ''}.`,
        );
      }
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : 'Invalid equation configuration.');
  }
  return errors;
}
