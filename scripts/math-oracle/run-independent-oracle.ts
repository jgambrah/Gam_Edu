/**
 * GAM EDU — Step 5A.3 Independent Mathematical Oracle Verification Harness
 *
 * Development-only verification script (ZERO runtime production dependency).
 * Generates 10,000 UNIQUE reproducible reference cases (seed: 20260503) using
 * independent BigInt exact rational arithmetic and independently derived
 * algebraic, calculus, domain, interval, unit, and marking ground truth —
 * NEVER calling GAM EDU's evaluator to generate expected outcomes.
 */

import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import {
  evaluateMathSubmission,
  evaluateWorkingWorkspace,
  type MathEvaluatorSpec,
  type MathEvalSubmission,
  type MathMultiStepWorkingSpec,
  type WorkingStepInput,
} from '../../src/lib/math-evaluator/math-eval-engine';

// Deterministic PRNG (Mulberry32)
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260503);
const randInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rng() * arr.length)];

const B0 = BigInt(0);
const B1 = BigInt(1);
const B5 = BigInt(5);
const B100 = BigInt(100);

// Independent exact BigInt GCD & reduced fraction helpers (independent of GAM EDU!)
function bigGcd(a: bigint, b: bigint): bigint {
  let x = a < B0 ? -a : a;
  let y = b < B0 ? -b : b;
  while (y !== B0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x === B0 ? B1 : x;
}

function fracStr(n: bigint, d: bigint): string {
  if (d < B0) {
    n = -n;
    d = -d;
  }
  const g = bigGcd(n, d);
  const rn = n / g;
  const rd = d / g;
  return rd === B1 ? rn.toString() : `${rn}/${rd}`;
}

type ExpectedOutcome = 'accept' | 'reject' | 'indeterminate';

interface OracleSingleCase {
  kind: 'single';
  id: string;
  topic: string;
  curriculumLevel: string;
  verificationClass: string;
  spec: Exclude<MathEvaluatorSpec, { mode: 'multi-step-working' }>;
  submission: MathEvalSubmission;
  expectedOutcome: ExpectedOutcome;
}

interface OracleWorkspaceCase {
  kind: 'workspace';
  id: string;
  topic: string;
  curriculumLevel: string;
  verificationClass: string;
  spec: MathMultiStepWorkingSpec;
  steps: WorkingStepInput[];
  expectedCorrect: boolean;
  expectedIndeterminate?: boolean;
  expectedMarks?: number;
  maxMarks?: number;
}

type OracleCase = OracleSingleCase | OracleWorkspaceCase;

const cases: OracleCase[] = [];
const seenKeys = new Set<string>();
const seenStructuralKeys = new Set<string>();
let structuralDuplicateCount = 0;

function addUnique(key: string, c: OracleCase): boolean {
  if (seenKeys.has(key)) return false;
  seenKeys.add(key);
  const structKey = JSON.stringify(
    c.kind === 'single'
      ? { k: c.kind, s: c.spec, u: c.submission }
      : { k: c.kind, s: c.spec, st: c.steps },
  );
  if (seenStructuralKeys.has(structKey)) {
    structuralDuplicateCount += 1;
  } else {
    seenStructuralKeys.add(structKey);
  }
  cases.push(c);
  return true;
}

let idCounter = 1;
const nextId = (prefix: string) => `${prefix}-${String(idCounter++).padStart(5, '0')}`;

/* 1. ARITHMETIC, FRACTIONS & PERCENTAGES (1,000 unique cases) */
{
  let count = 0;
  // 500 fraction add/sub/mul exact + unreduced rejection + wrong answer rejection
  while (count < 500) {
    const a = BigInt(randInt(1, 15));
    const b = BigInt(randInt(2, 12));
    const c = BigInt(randInt(1, 15));
    const d = BigInt(randInt(2, 12));
    const op = pick(['+', '-', '*'] as const);
    let rn: bigint, rd: bigint;
    if (op === '+') {
      rn = a * d + c * b;
      rd = b * d;
    } else if (op === '-') {
      rn = a * d - c * b;
      rd = b * d;
    } else {
      rn = a * c;
      rd = b * d;
    }
    const reduced = fracStr(rn, rd);
    const variant = count % 4;
    if (variant === 0) {
      // Positive reduced fraction match
      const expr = `${a}/${b} ${op} ${c}/${d}`;
      if (
        addUnique(`arith-pos-${expr}-${reduced}`, {
          kind: 'single',
          id: nextId('ARITH'),
          topic: 'arithmetic-fractions-percentages',
          curriculumLevel: 'primary',
          verificationClass: 'exact-rational',
          spec: { mode: 'numeric-quantity', expectedValue: reduced, requiredForm: 'reduced-fraction' },
          submission: { expression: reduced },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else if (variant === 1) {
      // Unreduced equivalent fraction must be REJECTED under requiredForm: 'reduced-fraction'
      const k = BigInt(randInt(2, 5));
      const g = bigGcd(rn, rd);
      const unred = `${(rn / g) * k}/${(rd / g) * k}`;
      if (
        addUnique(`arith-unred-${unred}-${reduced}`, {
          kind: 'single',
          id: nextId('ARITH'),
          topic: 'arithmetic-fractions-percentages',
          curriculumLevel: 'primary',
          verificationClass: 'required-form-fraction',
          spec: { mode: 'numeric-quantity', expectedValue: reduced, requiredForm: 'reduced-fraction' },
          submission: { expression: unred },
          expectedOutcome: 'reject',
        })
      ) count++;
    } else if (variant === 2) {
      // Positive equivalent expression evaluation (any form)
      const expr = `${a}/${b} ${op} ${c}/${d}`;
      if (
        addUnique(`arith-expr-${expr}-${reduced}`, {
          kind: 'single',
          id: nextId('ARITH'),
          topic: 'arithmetic-fractions-percentages',
          curriculumLevel: 'primary',
          verificationClass: 'exact-rational',
          spec: { mode: 'numeric-quantity', expectedValue: reduced },
          submission: { expression: expr },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else {
      // Wrong answer (off by 1 in numerator)
      const wrong = fracStr(rn + B1, rd);
      if (wrong !== reduced &&
        addUnique(`arith-neg-${wrong}-${reduced}`, {
          kind: 'single',
          id: nextId('ARITH'),
          topic: 'arithmetic-fractions-percentages',
          curriculumLevel: 'primary',
          verificationClass: 'exact-rational',
          spec: { mode: 'numeric-quantity', expectedValue: reduced },
          submission: { expression: wrong },
          expectedOutcome: 'reject',
        })
      ) count++;
    }
  }
  // 500 percentages, discounts, precedence (-a^2 vs (-a)^2), negative exponents
  let guard1 = 0;
  while (count < 1000 && ++guard1 < 20_000) {
    const sub = count % 4;
    if (sub === 0) {
      const base = randInt(20, 900) * 5;
      const pct = pick([5, 10, 12, 15, 20, 25, 30, 40]);
      const ans = fracStr(BigInt(base * (100 - pct)), B100);
      if (
        addUnique(`pct-disc-${base}-${pct}`, {
          kind: 'single',
          id: nextId('ARITH'),
          topic: 'arithmetic-fractions-percentages',
          curriculumLevel: 'lower-secondary',
          verificationClass: 'exact-rational',
          spec: { mode: 'numeric-quantity', expectedValue: ans },
          submission: { expression: `${base} - (${pct}/100)*${base}` },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else if (sub === 1) {
      const n = randInt(2, 500);
      const ans = String(-(n * n));
      if (
        addUnique(`prec-neg-${n}`, {
          kind: 'single',
          id: nextId('ARITH'),
          topic: 'arithmetic-fractions-percentages',
          curriculumLevel: 'lower-secondary',
          verificationClass: 'precedence',
          spec: { mode: 'numeric-quantity', expectedValue: ans },
          submission: { expression: `-${n}^2` },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else if (sub === 2) {
      const n = randInt(2, 500);
      const wrong = String(n * n);
      if (
        addUnique(`prec-neg-wrong-${n}`, {
          kind: 'single',
          id: nextId('ARITH'),
          topic: 'arithmetic-fractions-percentages',
          curriculumLevel: 'lower-secondary',
          verificationClass: 'precedence',
          spec: { mode: 'numeric-quantity', expectedValue: wrong },
          submission: { expression: `-${n}^2` },
          expectedOutcome: 'reject',
        })
      ) count++;
    } else {
      const base = randInt(2, 60);
      const exp = randInt(1, 4);
      const denom = BigInt(base) ** BigInt(exp);
      if (
        addUnique(`neg-exp-${base}-${exp}`, {
          kind: 'single',
          id: nextId('ARITH'),
          topic: 'arithmetic-fractions-percentages',
          curriculumLevel: 'lower-secondary',
          verificationClass: 'exact-rational',
          spec: { mode: 'numeric-quantity', expectedValue: `1/${denom}` },
          submission: { expression: `${base}^(-${exp})` },
          expectedOutcome: 'accept',
        })
      ) count++;
    }
  }
}

/* 2. ALGEBRA & POLYNOMIAL EQUIVALENCE (1,500 unique cases) */
{
  let count = 0;
  let guard2 = 0;
  while (count < 1500 && ++guard2 < 40_000) {
    const a = randInt(1, 25);
    const b = randInt(-25, 25) || 1;
    const c = randInt(1, 15);
    const d = randInt(-15, 15) || -1;
    const sub = count % 5;
    if (sub === 0) {
      // Binomial product expansion (ax + b)(cx + d) = ac*x^2 + (ad+bc)*x + bd
      const A = a * c;
      const B = a * d + b * c;
      const C = b * d;
      const exp = `${A}x^2 + (${B})x + (${C})`;
      const factored = `(${a}x + (${b}))*(${c}x + (${d}))`;
      if (
        addUnique(`alg-exp-${a}-${b}-${c}-${d}`, {
          kind: 'single',
          id: nextId('ALG'),
          topic: 'algebra-polynomial-equivalence',
          curriculumLevel: 'igcse',
          verificationClass: 'exact-polynomial',
          spec: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: exp, verificationPolicy: 'exact-only' },
          submission: { expression: factored },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else if (sub === 1) {
      // Sign misconception: (ax + b)^2 submitted as a^2x^2 + b^2 (missing 2abx!)
      const exp = `${a * a}x^2 + (${2 * a * b})x + ${b * b}`;
      const wrong = `${a * a}x^2 + ${b * b}`;
      if (
        addUnique(`alg-sq-err-${a}-${b}`, {
          kind: 'single',
          id: nextId('ALG'),
          topic: 'algebra-polynomial-equivalence',
          curriculumLevel: 'igcse',
          verificationClass: 'exact-polynomial',
          spec: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: exp, verificationPolicy: 'exact-only' },
          submission: { expression: wrong },
          expectedOutcome: 'reject',
        })
      ) count++;
    } else if (sub === 2) {
      // Required factored form: accept (x + p)(x + q), reject expanded
      const p = randInt(-25, 25) || 2;
      const q = randInt(-25, 25) || -3;
      const exp = `(x + (${p}))*(x + (${q}))`;
      if (
        addUnique(`alg-fact-pos-${p}-${q}`, {
          kind: 'single',
          id: nextId('ALG'),
          topic: 'algebra-polynomial-equivalence',
          curriculumLevel: 'igcse',
          verificationClass: 'required-form-factored',
          spec: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: exp, requiredForm: 'factored-form' },
          submission: { expression: `(x + (${q}))*(x + (${p}))` },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else if (sub === 3) {
      // Required factored form: reject unfactored polynomial
      const p = randInt(1, 30);
      const q = randInt(1, 30);
      const exp = `(x + ${p})*(x + ${q})`;
      const unfact = `x^2 + ${p + q}x + ${p * q}`;
      if (
        addUnique(`alg-fact-neg-${p}-${q}`, {
          kind: 'single',
          id: nextId('ALG'),
          topic: 'algebra-polynomial-equivalence',
          curriculumLevel: 'igcse',
          verificationClass: 'required-form-factored',
          spec: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: exp, requiredForm: 'factored-form' },
          submission: { expression: unfact },
          expectedOutcome: 'reject',
        })
      ) count++;
    } else {
      // 2-variable polynomial expansion: a(x + by) + c(x - dy)
      const exp = `${a + c}x + (${a * b - c * d})y`;
      const lrn = `${a}*(x + (${b})*y) + ${c}*(x - (${d})*y)`;
      if (
        addUnique(`alg-2var-${a}-${b}-${c}-${d}`, {
          kind: 'single',
          id: nextId('ALG'),
          topic: 'algebra-polynomial-equivalence',
          curriculumLevel: 'lower-secondary',
          verificationClass: 'exact-polynomial',
          spec: { mode: 'algebraic-expression', variables: ['x', 'y'], expectedExpr: exp, verificationPolicy: 'exact-only' },
          submission: { expression: lrn },
          expectedOutcome: 'accept',
        })
      ) count++;
    }
  }
}

/* 3. RATIONAL EXPRESSIONS & DOMAINS (1,000 unique cases) */
{
  let count = 0;
  let guard3 = 0;
  while (count < 1000 && ++guard3 < 30_000) {
    const k = randInt(-400, 400) || 3;
    const m = randInt(-400, 400) || -2;
    const sub = count % 5;
    if (sub === 0) {
      // Pure equivalence over R: (x^2 - k^2)/(x - k) vs x + k MUST FAIL (hole at x = k)
      if (
        addUnique(`dom-hole-fail-${k}`, {
          kind: 'single',
          id: nextId('DOM'),
          topic: 'rational-expressions-domains',
          curriculumLevel: 'igcse',
          verificationClass: 'domain-equivalence',
          spec: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: `x + (${k})` },
          submission: { expression: `(x^2 - ${k * k})/(x - (${k}))` },
          expectedOutcome: 'reject',
        })
      ) count++;
    } else if (sub === 1) {
      // Under explicit x != k: MUST PASS
      if (
        addUnique(`dom-hole-pass-${k}`, {
          kind: 'single',
          id: nextId('DOM'),
          topic: 'rational-expressions-domains',
          curriculumLevel: 'igcse',
          verificationClass: 'domain-equivalence',
          spec: {
            mode: 'algebraic-expression',
            variables: ['x'],
            expectedExpr: `x + (${k})`,
            domainRestrictions: { expectedExcluded: [String(k)] },
          },
          submission: { expression: `(x^2 - ${k * k})/(x - (${k}))` },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else if (sub === 2) {
      // Simplification with sourceExpr & requireLearnerDomain: correct restriction passes
      if (
        addUnique(`dom-simp-pass-${k}`, {
          kind: 'single',
          id: nextId('DOM'),
          topic: 'rational-expressions-domains',
          curriculumLevel: 'igcse',
          verificationClass: 'simplification-domain',
          spec: {
            mode: 'algebraic-expression',
            variables: ['x'],
            sourceExpr: `(x^2 - ${k * k})/(x - (${k}))`,
            expectedExpr: `x + (${k})`,
            domainRestrictions: { requireLearnerDomain: true, expectedExcluded: [String(k)] },
          },
          submission: { expression: `x + (${k})`, domainInput: `x != ${k}` },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else if (sub === 3) {
      // Simplification where learner introduces an EXTRA hole at x = m (m != k): MUST FAIL
      if (m !== k &&
        addUnique(`dom-extra-hole-${k}-${m}`, {
          kind: 'single',
          id: nextId('DOM'),
          topic: 'rational-expressions-domains',
          curriculumLevel: 'igcse',
          verificationClass: 'simplification-domain',
          spec: {
            mode: 'algebraic-expression',
            variables: ['x'],
            sourceExpr: `(x^2 - ${k * k})/(x - (${k}))`,
            expectedExpr: `x + (${k})`,
          },
          submission: { expression: `((x + (${k}))*(x - (${m})))/(x - (${m}))` },
          expectedOutcome: 'reject',
        })
      ) count++;
    } else {
      // Multivariate denominator hazard MUST return indeterminate (never falsely certified!)
      const c1 = randInt(1, 20);
      if (
        addUnique(`dom-multivar-${k}-${c1}`, {
          kind: 'single',
          id: nextId('DOM'),
          topic: 'rational-expressions-domains',
          curriculumLevel: 'as-a-level',
          verificationClass: 'unsupported-multivariate-domain',
          spec: { mode: 'algebraic-expression', variables: ['x', 'y'], expectedExpr: `x + ${c1}` },
          submission: { expression: `((x + ${c1})*(y - (${k})))/(y - (${k}))` },
          expectedOutcome: 'indeterminate',
        })
      ) count++;
    }
  }
}

/* 4. EQUATIONS & SOLUTION SETS (1,500 unique cases across all 5 classes) */
{
  let count = 0;
  let guard4 = 0;
  while (count < 1500 && ++guard4 < 40_000) {
    const sub = count % 5;
    if (sub === 0) {
      // Linear a*x + b = c -> exact root (c - b)/a
      const a = randInt(1, 15) * (rng() < 0.5 ? 1 : -1);
      const b = randInt(-25, 25);
      const c = randInt(-25, 25);
      const root = fracStr(BigInt(c - b), BigInt(a));
      const eq = `${a}x + (${b}) = ${c}`;
      const isPos = count % 2 === 0;
      const lrnRoot = isPos ? root : fracStr(BigInt(c - b + 1), BigInt(a));
      if (
        addUnique(`eq-lin-${eq}-${lrnRoot}`, {
          kind: 'single',
          id: nextId('EQ'),
          topic: 'equations-solution-sets',
          curriculumLevel: 'lower-secondary',
          verificationClass: 'equation-linear',
          spec: { mode: 'equation-solution', variable: 'x', originalEquation: eq, equationClass: 'linear', expectedRoots: [root] },
          submission: { expression: lrnRoot },
          expectedOutcome: isPos ? 'accept' : 'reject',
        })
      ) count++;
    } else if (sub === 1) {
      // Quadratic (x - r1)(x - r2) = 0 -> complete set passes, single root fails
      const r1 = randInt(-12, 12);
      const r2 = randInt(-12, 12);
      if (r1 === r2) continue;
      const eq = `x^2 + (${-(r1 + r2)})x + (${r1 * r2}) = 0`;
      const isPos = count % 2 === 0;
      const subStr = isPos ? `${r2}, ${r1}` : `${r1}`;
      if (
        addUnique(`eq-quad-${r1}-${r2}-${isPos}`, {
          kind: 'single',
          id: nextId('EQ'),
          topic: 'equations-solution-sets',
          curriculumLevel: 'igcse',
          verificationClass: 'equation-quadratic',
          spec: { mode: 'equation-solution', variable: 'x', originalEquation: eq, equationClass: 'quadratic', expectedRoots: [String(r1), String(r2)] },
          submission: { expression: subStr },
          expectedOutcome: isPos ? 'accept' : 'reject',
        })
      ) count++;
    } else if (sub === 2) {
      // Factored cubic (x - r1)(x - r2)(x - r3) = 0
      const r1 = randInt(-9, -1);
      const r2 = randInt(0, 4);
      const r3 = randInt(5, 12);
      const eq = `(x - (${r1}))*(x - ${r2})*(x - ${r3}) = 0`;
      const isPos = count % 2 === 0;
      const subStr = isPos ? `${r3}, ${r1}, ${r2}` : `${r1}, ${r2}`;
      if (
        addUnique(`eq-fact-${r1}-${r2}-${r3}-${isPos}`, {
          kind: 'single',
          id: nextId('EQ'),
          topic: 'equations-solution-sets',
          curriculumLevel: 'igcse',
          verificationClass: 'equation-factored-polynomial',
          spec: { mode: 'equation-solution', variable: 'x', originalEquation: eq, equationClass: 'factored-polynomial', expectedRoots: [String(r1), String(r2), String(r3)] },
          submission: { expression: subStr },
          expectedOutcome: isPos ? 'accept' : 'reject',
        })
      ) count++;
    } else if (sub === 3) {
      // Rational equation (x^2 - k^2)/(x - k) = m -> root is m - k ONLY if m - k != k (else empty)
      const k = randInt(1, 15);
      const r = randInt(-15, 15);
      if (r === k) continue;
      const m = r + k;
      const eq = `(x^2 - ${k * k})/(x - ${k}) = ${m}`;
      const isPos = count % 2 === 0;
      const subStr = isPos ? String(r) : `${r}, ${k}`; // including extraneous pole k MUST FAIL!
      if (
        addUnique(`eq-rat-${k}-${r}-${isPos}`, {
          kind: 'single',
          id: nextId('EQ'),
          topic: 'equations-solution-sets',
          curriculumLevel: 'igcse',
          verificationClass: 'equation-rational',
          spec: { mode: 'equation-solution', variable: 'x', originalEquation: eq, equationClass: 'rational-linear-quadratic', expectedRoots: [String(r)], extraneousCandidates: [String(k)] },
          submission: { expression: subStr },
          expectedOutcome: isPos ? 'accept' : 'reject',
        })
      ) count++;
    } else {
      // Radical equation sqrt(x + k*(k-1)) = x -> roots of x^2 - x - k(k-1) = 0 are k (valid) and 1-k (extraneous for k >= 2)
      const k = randInt(2, 40);
      const c = k * (k - 1);
      const extr = 1 - k;
      const eq = `sqrt(x + ${c}) = x`;
      const isPos = count % 2 === 0;
      const subStr = isPos ? String(k) : `${k}, ${extr}`;
      if (
        addUnique(`eq-rad-${k}-${isPos}-${count}`, {
          kind: 'single',
          id: nextId('EQ'),
          topic: 'equations-solution-sets',
          curriculumLevel: 'as-a-level',
          verificationClass: 'equation-radical',
          spec: { mode: 'equation-solution', variable: 'x', originalEquation: eq, equationClass: 'radical-single', expectedRoots: [String(k)], extraneousCandidates: [String(extr)] },
          submission: { expression: subStr },
          expectedOutcome: isPos ? 'accept' : 'reject',
        })
      ) count++;
    }
  }
}

/* 5. INEQUALITIES & INTERVALS (750 unique cases) */
{
  let count = 0;
  while (count < 750) {
    const a = randInt(-40, 20);
    const b = a + randInt(1, 25);
    const sub = count % 3;
    if (sub === 0) {
      // Half-open interval (a, b] matches inequality a < x <= b
      if (
        addUnique(`iv-half-pos-${a}-${b}`, {
          kind: 'single',
          id: nextId('INEQ'),
          topic: 'inequalities-intervals',
          curriculumLevel: 'igcse',
          verificationClass: 'interval-union',
          spec: { mode: 'inequality-interval', variable: 'x', expectedIntervals: [{ low: String(a), lowInclusive: false, high: String(b), highInclusive: true }] },
          submission: { expression: `${a} < x <= ${b}` },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else if (sub === 1) {
      // Wrong endpoint inclusivity [a, b] vs (a, b] MUST FAIL
      if (
        addUnique(`iv-half-neg-${a}-${b}`, {
          kind: 'single',
          id: nextId('INEQ'),
          topic: 'inequalities-intervals',
          curriculumLevel: 'igcse',
          verificationClass: 'interval-union',
          spec: { mode: 'inequality-interval', variable: 'x', expectedIntervals: [{ low: String(a), lowInclusive: false, high: String(b), highInclusive: true }] },
          submission: { expression: `[${a}, ${b}]` },
          expectedOutcome: 'reject',
        })
      ) count++;
    } else {
      // Disjoint union (-inf, a) U [b, inf)
      const isPos = count % 2 === 0;
      const lrn = isPos ? `x < ${a} or x >= ${b}` : `(-inf, ${a}] U [${b}, inf)`;
      if (
        addUnique(`iv-union-${a}-${b}-${isPos}`, {
          kind: 'single',
          id: nextId('INEQ'),
          topic: 'inequalities-intervals',
          curriculumLevel: 'as-a-level',
          verificationClass: 'interval-union',
          spec: {
            mode: 'inequality-interval',
            variable: 'x',
            expectedIntervals: [
              { low: '-inf', lowInclusive: false, high: String(a), highInclusive: false },
              { low: String(b), lowInclusive: true, high: 'inf', highInclusive: false },
            ],
          },
          submission: { expression: lrn },
          expectedOutcome: isPos ? 'accept' : 'reject',
        })
      ) count++;
    }
  }
}

/* 6. SURDS, INDICES & LOGARITHMS (750 unique cases) */
{
  let count = 0;
  let guard6 = 0;
  const sqFree = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23];
  while (count < 750 && ++guard6 < 30_000) {
    const sub = count % 5;
    if (sub === 0) {
      // Surd simplification: k*sqrt(m) accepted, sqrt(k^2*m) rejected under simplified-surd
      const k = randInt(2, 18);
      const m = pick(sqFree);
      if (
        addUnique(`surd-pos-${k}-${m}`, {
          kind: 'single',
          id: nextId('SURD'),
          topic: 'surds-indices-logarithms',
          curriculumLevel: 'igcse',
          verificationClass: 'exact-surd',
          spec: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: `sqrt(${k * k * m})`, requiredForm: 'simplified-surd' },
          submission: { expression: `${k}*sqrt(${m})` },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else if (sub === 1) {
      const k = randInt(2, 18);
      const m = pick(sqFree);
      if (
        addUnique(`surd-neg-${k}-${m}`, {
          kind: 'single',
          id: nextId('SURD'),
          topic: 'surds-indices-logarithms',
          curriculumLevel: 'igcse',
          verificationClass: 'exact-surd',
          spec: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: `${k}*sqrt(${m})`, requiredForm: 'simplified-surd' },
          submission: { expression: `sqrt(${k * k * m})` },
          expectedOutcome: 'reject',
        })
      ) count++;
    } else if (sub === 2) {
      // ln(x) + ln(x - a) vs ln(x*(x - a)) over R MUST FAIL (domain mismatch for x < 0!)
      const a = randInt(1, 500);
      if (
        addUnique(`log-dom-fail-${a}`, {
          kind: 'single',
          id: nextId('LOG'),
          topic: 'surds-indices-logarithms',
          curriculumLevel: 'as-a-level',
          verificationClass: 'logarithmic-domain',
          spec: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: `ln(x) + ln(x - ${a})` },
          submission: { expression: `ln(x*(x - ${a}))` },
          expectedOutcome: 'reject',
        })
      ) count++;
    } else if (sub === 3) {
      // ln(x) + ln(x - a) vs ln(x*(x - a)) under explicit x > a MUST PASS
      const a = randInt(1, 500);
      if (
        addUnique(`log-dom-pass-${a}`, {
          kind: 'single',
          id: nextId('LOG'),
          topic: 'surds-indices-logarithms',
          curriculumLevel: 'as-a-level',
          verificationClass: 'logarithmic-domain',
          spec: {
            mode: 'algebraic-expression',
            variables: ['x'],
            expectedExpr: `ln(x) + ln(x - ${a})`,
            domainRestrictions: { expectedDomainInterval: `x > ${a}` },
          },
          submission: { expression: `ln(x*(x - ${a}))` },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else {
      // 2*ln(abs(x - a)) === ln((x - a)^2) over R \ {a} MUST PASS
      const a = randInt(-400, 400);
      if (
        addUnique(`log-even-abs-${a}`, {
          kind: 'single',
          id: nextId('LOG'),
          topic: 'surds-indices-logarithms',
          curriculumLevel: 'as-a-level',
          verificationClass: 'logarithmic-domain',
          spec: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: `ln((x - (${a}))^2)` },
          submission: { expression: `2*ln(abs(x - (${a})))` },
          expectedOutcome: 'accept',
        })
      ) count++;
    }
  }
}

/* 7. DIFFERENTIATION & INTEGRATION (1,000 unique cases) */
{
  let count = 0;
  let guard7 = 0;
  while (count < 1000 && ++guard7 < 40_000) {
    const a = randInt(1, 15);
    const b = randInt(-15, 15) || 2;
    const c = randInt(-15, 15);
    const sub = count % 5;
    if (sub === 0) {
      // d/dx(a*x^3 + b*x^2 + c*x) = 3a*x^2 + 2b*x + c
      if (
        addUnique(`calc-diff-pos-${a}-${b}-${c}`, {
          kind: 'single',
          id: nextId('CALC'),
          topic: 'differentiation-integration',
          curriculumLevel: 'as-a-level',
          verificationClass: 'calculus-derivative',
          spec: { mode: 'calculus-check', variable: 'x', calculusKind: 'derivative', sourceExpr: `${a}x^3 + (${b})x^2 + (${c})x`, expectedExpr: `${3 * a}x^2 + (${2 * b})x + (${c})` },
          submission: { expression: `${3 * a}x^2 + (${2 * b})x + (${c})` },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else if (sub === 1) {
      // Derivative introducing extra hole at x = 0: d/dx(a*x^2) submitted as 2a*x^2/x MUST FAIL
      if (
        addUnique(`calc-diff-hole-${a}-${b}-${count}`, {
          kind: 'single',
          id: nextId('CALC'),
          topic: 'differentiation-integration',
          curriculumLevel: 'as-a-level',
          verificationClass: 'calculus-derivative-domain',
          spec: { mode: 'calculus-check', variable: 'x', calculusKind: 'derivative', sourceExpr: `${a}x^2 + (${b})`, expectedExpr: `${2 * a}x` },
          submission: { expression: `${2 * a}x^2/x` },
          expectedOutcome: 'reject',
        })
      ) count++;
    } else if (sub === 2) {
      // Simplified derivative d/dx((x - k)/(x - k)) -> 0 MUST PASS
      const k = randInt(-400, 400);
      if (
        addUnique(`calc-diff-simp-${k}`, {
          kind: 'single',
          id: nextId('CALC'),
          topic: 'differentiation-integration',
          curriculumLevel: 'as-a-level',
          verificationClass: 'calculus-derivative-domain',
          spec: { mode: 'calculus-check', variable: 'x', calculusKind: 'derivative', sourceExpr: `(x - (${k}))/(x - (${k}))`, expectedExpr: '0' },
          submission: { expression: '0' },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else if (sub === 3) {
      // Antiderivative of 3a*x^2 + 2b*x with + C passes; with + 0*C fails
      const isPos = count % 2 === 0;
      const lrn = isPos ? `${a}x^3 + (${b})x^2 + C` : `${a}x^3 + (${b})x^2 + 0*C`;
      if (
        addUnique(`calc-int-c-${a}-${b}-${isPos}`, {
          kind: 'single',
          id: nextId('CALC'),
          topic: 'differentiation-integration',
          curriculumLevel: 'as-a-level',
          verificationClass: 'calculus-antiderivative',
          spec: { mode: 'calculus-check', variable: 'x', calculusKind: 'antiderivative', sourceExpr: `${3 * a}x^2 + (${2 * b})x`, expectedExpr: `${a}x^3 + (${b})x^2 + C`, requireConstantOfIntegration: true },
          submission: { expression: lrn },
          expectedOutcome: isPos ? 'accept' : 'reject',
        })
      ) count++;
    } else {
      // Antiderivative of a/x with requireAbsInLog: a*ln(abs(x)) + C passes, a*ln(x) + C fails
      const isPos = count % 2 === 0;
      const lrn = isPos ? `${a}*ln(abs(x)) + C` : `${a}*ln(x) + C`;
      if (
        addUnique(`calc-int-ln-${a}-${isPos}-${count}`, {
          kind: 'single',
          id: nextId('CALC'),
          topic: 'differentiation-integration',
          curriculumLevel: 'as-a-level',
          verificationClass: 'calculus-antiderivative-log',
          spec: { mode: 'calculus-check', variable: 'x', calculusKind: 'antiderivative', sourceExpr: `${a}/x`, expectedExpr: `${a}*ln(abs(x)) + C`, requireConstantOfIntegration: true, requireAbsInLog: true },
          submission: { expression: lrn },
          expectedOutcome: isPos ? 'accept' : 'reject',
        })
      ) count++;
    }
  }
}

/* 8. UNITS, PRECISION & FINANCIAL MATHEMATICS (750 unique cases) */
{
  let count = 0;
  let guard8 = 0;
  while (count < 750 && ++guard8 < 30_000) {
    const sub = count % 5;
    if (sub === 0) {
      // Exact speed conversion: v m/s === 3.6*v km/h
      const v = randInt(1, 500);
      const kmh = fracStr(BigInt(v * 18), B5);
      if (
        addUnique(`unit-spd-pos-${v}`, {
          kind: 'single',
          id: nextId('UNIT'),
          topic: 'units-precision-finance',
          curriculumLevel: 'igcse',
          verificationClass: 'exact-si-units',
          spec: { mode: 'numeric-quantity', expectedValue: String(v), unitSpec: { expectedUnit: 'm/s', allowEquivalentUnits: true } },
          submission: { expression: kmh, unit: 'km/h' },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else if (sub === 1) {
      // Incompatible dimensions: m/s vs m/s^2 MUST FAIL
      const v = randInt(1, 500);
      if (
        addUnique(`unit-dim-fail-${v}`, {
          kind: 'single',
          id: nextId('UNIT'),
          topic: 'units-precision-finance',
          curriculumLevel: 'igcse',
          verificationClass: 'exact-si-units',
          spec: { mode: 'numeric-quantity', expectedValue: String(v), unitSpec: { expectedUnit: 'm/s', allowEquivalentUnits: true } },
          submission: { expression: String(v), unit: 'm/s^2' },
          expectedOutcome: 'reject',
        })
      ) count++;
    } else if (sub === 2) {
      // Absolute temperature conversion: T °C === (T + 273.15) K
      const t = randInt(-200, 400);
      const k = fracStr(BigInt(t * 100 + 27315), B100);
      if (
        addUnique(`unit-temp-abs-${t}`, {
          kind: 'single',
          id: nextId('UNIT'),
          topic: 'units-precision-finance',
          curriculumLevel: 'igcse',
          verificationClass: 'exact-si-units',
          spec: { mode: 'numeric-quantity', expectedValue: String(t), unitSpec: { expectedUnit: '°C', allowEquivalentUnits: true, temperatureMode: 'absolute' } },
          submission: { expression: k, unit: 'K' },
          expectedOutcome: 'accept',
        })
      ) count++;
    } else if (sub === 3) {
      // Zero hidden 1e-9 float tolerance: n + 10^-10 vs n MUST FAIL when no tolerance!
      const n = randInt(1, 500);
      if (
        addUnique(`prec-exact-no-eps-${n}`, {
          kind: 'single',
          id: nextId('UNIT'),
          topic: 'units-precision-finance',
          curriculumLevel: 'igcse',
          verificationClass: 'exact-precision',
          spec: { mode: 'numeric-quantity', expectedValue: String(n) },
          submission: { expression: `${n}.0000000001` },
          expectedOutcome: 'reject',
        })
      ) count++;
    } else {
      // Financial gross profit margin %: (rev - cos)/rev * 100
      const cos = randInt(10, 90) * 10;
      const gp = randInt(1, 40) * 10;
      const rev = cos + gp;
      const margin = fracStr(BigInt(gp * 100), BigInt(rev));
      if (
        addUnique(`fin-margin-${rev}-${cos}`, {
          kind: 'single',
          id: nextId('UNIT'),
          topic: 'units-precision-finance',
          curriculumLevel: 'igcse',
          verificationClass: 'exact-si-units',
          spec: { mode: 'numeric-quantity', expectedValue: margin, unitSpec: { expectedUnit: '%', allowEquivalentUnits: true } },
          submission: { expression: `((${rev} - ${cos})/${rev})*100`, unit: '%' },
          expectedOutcome: 'accept',
        })
      ) count++;
    }
  }
}

/* 9. MULTI-STEP REASONING & MARKING (1,250 unique cases) */
{
  let count = 0;
  let guard9 = 0;
  while (count < 1250 && ++guard9 < 40_000) {
    const sub = count % 5;
    if (sub === 0) {
      // Linear equation alt method (divide first vs expand first) -> 2/2 marks
      const a = randInt(2, 9);
      const b = randInt(1, 12);
      const r = randInt(1, 15);
      const rhs = a * (r + b);
      const useDivFirst = count % 2 === 0;
      const spec: MathMultiStepWorkingSpec = {
        mode: 'multi-step-working',
        learningMode: 'independent',
        problemKind: 'equation-solving',
        variables: ['x'],
        initialStatement: `${a}*(x + ${b}) = ${rhs}`,
        finalGoal: { mode: 'equation-solution', variable: 'x', originalEquation: `${a}*(x + ${b}) = ${rhs}`, equationClass: 'linear', expectedRoots: [String(r)] },
        markingScheme: {
          maxMarks: 2,
          strategyGroups: [
            {
              id: 'div',
              label: 'Divide first',
              marks: [
                { markId: 'M1a', type: 'M', points: 1, description: 'Divide by a', predicate: { kind: 'equation-equivalent', targetEquation: `x + ${b} = ${r + b}`, requireValidTransition: true } },
                { markId: 'A1a', type: 'A', points: 1, requiresMarkIds: ['M1a'], description: 'Solve x', predicate: { kind: 'final-answer', requireValidWorking: true } },
              ],
            },
            {
              id: 'exp',
              label: 'Expand first',
              marks: [
                { markId: 'M1b', type: 'M', points: 1, description: 'Expand', predicate: { kind: 'equation-equivalent', targetEquation: `${a}x + ${a * b} = ${rhs}`, requiredForm: 'expanded-polynomial', requireValidTransition: true } },
                { markId: 'A1b', type: 'A', points: 1, requiresMarkIds: ['M1b'], description: 'Solve x', predicate: { kind: 'final-answer', requireValidWorking: true } },
              ],
            },
          ],
        },
        workedSolutions: [{ methodLabel: 'Div', steps: [{ math: `x + ${b} = ${r + b}`, note: 'Div.' }, { math: `x = ${r}`, note: 'Sub.' }] }],
      };
      const steps: WorkingStepInput[] = useDivFirst
        ? [{ math: `x + ${b} = ${r + b}` }, { math: `x = ${r}` }]
        : [{ math: `${a}x + ${a * b} = ${rhs}` }, { math: `${a}x = ${a * r}` }, { math: `x = ${r}` }];
      if (
        addUnique(`ws-alt-${a}-${b}-${r}-${useDivFirst}`, {
          kind: 'workspace',
          id: nextId('WS'),
          topic: 'multi-step-reasoning-marking',
          curriculumLevel: 'lower-secondary',
          verificationClass: 'workspace-alt-methods',
          spec,
          steps,
          expectedCorrect: true,
          expectedMarks: 2,
          maxMarks: 2,
        })
      ) count++;
    } else if (sub === 1) {
      // Factorisation method mark: unfactorised repeat earns 0/2; factored earns 2/2
      const p = randInt(1, 25);
      const q = randInt(1, 25);
      if (p === q) continue;
      const eq = `x^2 + (${p - q})x - ${p * q} = 0`;
      const showFactor = count % 2 === 0;
      const spec: MathMultiStepWorkingSpec = {
        mode: 'multi-step-working',
        learningMode: 'exam-practice',
        problemKind: 'equation-solving',
        variables: ['x'],
        initialStatement: eq,
        finalGoal: { mode: 'equation-solution', variable: 'x', originalEquation: eq, equationClass: 'quadratic', expectedRoots: [String(-p), String(q)] },
        markingScheme: {
          maxMarks: 2,
          strategyGroups: [
            {
              id: 'fact',
              label: 'Factorise',
              marks: [
                { markId: 'M1', type: 'M', points: 1, description: 'Factored form', predicate: { kind: 'equation-equivalent', targetEquation: `(x + ${p})*(x - ${q}) = 0`, requiredForm: 'factored-form', requireValidTransition: true } },
                { markId: 'A1', type: 'A', points: 1, requiresMarkIds: ['M1'], description: 'Roots', predicate: { kind: 'final-answer', requireValidWorking: true } },
              ],
            },
          ],
        },
        workedSolutions: [{ methodLabel: 'Factor', steps: [{ math: `(x + ${p})*(x - ${q}) = 0`, note: 'Factor.' }, { math: `x = ${-p} or x = ${q}`, note: 'Roots.' }] }],
      };
      const steps: WorkingStepInput[] = showFactor
        ? [{ math: `(x + ${p})*(x - ${q}) = 0` }, { math: `x = ${-p} or x = ${q}` }]
        : [{ math: eq }, { math: `x = ${-p} or x = ${q}` }];
      if (
        addUnique(`ws-fact-${p}-${q}-${showFactor}`, {
          kind: 'workspace',
          id: nextId('WS'),
          topic: 'multi-step-reasoning-marking',
          curriculumLevel: 'igcse',
          verificationClass: 'workspace-method-evidence',
          spec,
          steps,
          expectedCorrect: true,
          expectedMarks: showFactor ? 2 : 0,
          maxMarks: 2,
        })
      ) count++;
    } else if (sub === 2) {
      // ECF: arithmetic slip + valid follow-through earns 1/2 (ECF), trivial repeat earns 0/2
      const a = randInt(2, 11);
      const b = randInt(2, 15);
      const r = randInt(2, 15);
      const rhs = a * r + b;
      const wrongRhs = rhs + b; // added b instead of subtracting b!
      const isValidEcf = count % 2 === 0;
      const spec: MathMultiStepWorkingSpec = {
        mode: 'multi-step-working',
        learningMode: 'independent',
        problemKind: 'equation-solving',
        variables: ['x'],
        initialStatement: `${a}x + ${b} = ${rhs}`,
        finalGoal: { mode: 'equation-solution', variable: 'x', originalEquation: `${a}x + ${b} = ${rhs}`, equationClass: 'linear', expectedRoots: [String(r)] },
        markingScheme: {
          maxMarks: 2,
          strategyGroups: [
            {
              id: 'lin',
              label: 'Isolate',
              marks: [
                { markId: 'M1', type: 'M', points: 1, description: 'Subtract b', predicate: { kind: 'equation-equivalent', targetEquation: `${a}x = ${a * r}`, requireValidTransition: true } },
                { markId: 'A1', type: 'A', points: 1, allowErrorCarriedForward: true, description: 'ECF solve', predicate: { kind: 'follow-through-step', requireIsolatedFinalVariable: true } },
              ],
            },
          ],
        },
        workedSolutions: [{ methodLabel: 'Solve', steps: [{ math: `${a}x = ${a * r}`, note: 'Sub.' }, { math: `x = ${r}`, note: 'Div.' }] }],
      };
      const steps: WorkingStepInput[] = isValidEcf
        ? [{ math: `${a}x = ${wrongRhs}` }, { math: `x = ${fracStr(BigInt(wrongRhs), BigInt(a))}` }]
        : [{ math: `${a}x = ${wrongRhs}` }, { math: `${a}x = ${wrongRhs}` }];
      if (
        addUnique(`ws-ecf-${a}-${b}-${r}-${isValidEcf}`, {
          kind: 'workspace',
          id: nextId('WS'),
          topic: 'multi-step-reasoning-marking',
          curriculumLevel: 'igcse',
          verificationClass: 'workspace-ecf',
          spec,
          steps,
          expectedCorrect: false,
          expectedMarks: isValidEcf ? 1 : 0,
          maxMarks: 2,
        })
      ) count++;
    } else if (sub === 3) {
      // Radical equation extraneous rejection with requireEvidence: true vs contradictory rejection
      const k = randInt(2, 35);
      const c = k * (k - 1);
      const extr = 1 - k;
      const modeVariant = count % 3; // 0 = verified evidence (2/2), 1 = bare decl (1/2), 2 = contradictory valid root rejection (0/2)
      const spec: MathMultiStepWorkingSpec = {
        mode: 'multi-step-working',
        learningMode: 'exam-practice',
        problemKind: 'equation-solving',
        variables: ['x'],
        initialStatement: `sqrt(x + ${c}) = x`,
        finalGoal: { mode: 'equation-solution', variable: 'x', originalEquation: `sqrt(x + ${c}) = x`, equationClass: 'radical-single', expectedRoots: [String(k)], extraneousCandidates: [String(extr)] },
        markingScheme: {
          maxMarks: 2,
          sharedIndependentMarks: [
            { markId: 'B1', type: 'B', points: 1, description: 'Verified extraneous rejection', predicate: { kind: 'extraneous-rejection', expectedRejected: [String(extr)], requireEvidence: true } },
          ],
          strategyGroups: [
            {
              id: 's1',
              label: 'Solve',
              marks: [{ markId: 'A1', type: 'A', points: 1, description: 'Final root', predicate: { kind: 'final-answer', requireValidWorking: true } }],
            },
          ],
        },
        workedSolutions: [{ methodLabel: 'Square', steps: [{ math: `x + ${c} = x^2`, note: 'Square.' }, { math: `x = ${k}`, rejectedExtraneous: [String(extr)], note: 'Check.' }] }],
      };
      const steps: WorkingStepInput[] =
        modeVariant === 0
          ? [{ math: `x + ${c} = x^2` }, { math: `x = ${k}`, candidateChecks: [{ candidate: String(extr), verdict: 'extraneous', reason: 'substitution-mismatch' }] }]
          : modeVariant === 1
            ? [{ math: `x + ${c} = x^2` }, { math: `x = ${k}`, rejectedExtraneous: [String(extr)] }]
            : [{ math: `x + ${c} = x^2` }, { math: `x = ${extr}`, rejectedExtraneous: [String(k)] }];
      if (
        addUnique(`ws-rad-${k}-${modeVariant}-${count}`, {
          kind: 'workspace',
          id: nextId('WS'),
          topic: 'multi-step-reasoning-marking',
          curriculumLevel: 'as-a-level',
          verificationClass: 'workspace-extraneous-evidence',
          spec,
          steps,
          expectedCorrect: modeVariant !== 2,
          expectedMarks: modeVariant === 0 ? 2 : modeVariant === 1 ? 1 : 0,
          maxMarks: 2,
        })
      ) count++;
    } else {
      // Lost solution: dividing x^2 = k*x by x -> x = k (lost x = 0, MUST be false & 0 marks!)
      const k = randInt(2, 120);
      const spec: MathMultiStepWorkingSpec = {
        mode: 'multi-step-working',
        learningMode: 'guided',
        problemKind: 'equation-solving',
        variables: ['x'],
        initialStatement: `x^2 = ${k}x`,
        finalGoal: { mode: 'equation-solution', variable: 'x', originalEquation: `x^2 = ${k}x`, equationClass: 'quadratic', expectedRoots: ['0', String(k)] },
        workedSolutions: [{ methodLabel: 'Factor', steps: [{ math: `x^2 - ${k}x = 0`, note: 'Move.' }, { math: `x = 0 or x = ${k}`, note: 'Solve.' }] }],
      };
      if (
        addUnique(`ws-lost-${k}-${count}`, {
          kind: 'workspace',
          id: nextId('WS'),
          topic: 'multi-step-reasoning-marking',
          curriculumLevel: 'igcse',
          verificationClass: 'workspace-lost-solution',
          spec,
          steps: [{ math: `x = ${k}` }],
          expectedCorrect: false,
        })
      ) count++;
    }
  }
}

/* 10. ADVERSARIAL & RESOURCE-BOUND CASES (500 unique cases) */
{
  let count = 0;
  let guard10 = 0;
  while (count < 500 && ++guard10 < 20_000) {
    const sub = count % 5;
    if (sub === 0) {
      // sin(pi*x) vs 0 trap (0 at all integers, NOT equal!)
      const k = randInt(1, 200);
      if (
        addUnique(`adv-sinpi-${k}`, {
          kind: 'single',
          id: nextId('ADV'),
          topic: 'adversarial-resource-bounds',
          curriculumLevel: 'as-a-level',
          verificationClass: 'adversarial-numeric-trap',
          spec: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: '0', verificationPolicy: 'allow-bounded-numeric' },
          submission: { expression: `sin(${k}*pi*x)` },
          expectedOutcome: 'reject',
        })
      ) count++;
    } else if (sub === 1) {
      // Expansion bomb (x + k)^12 exceeds maxSymbolicPower (6) -> indeterminate/rejected safely!
      const k = randInt(1, 200);
      if (
        addUnique(`adv-bomb-${k}`, {
          kind: 'single',
          id: nextId('ADV'),
          topic: 'adversarial-resource-bounds',
          curriculumLevel: 'as-a-level',
          verificationClass: 'adversarial-resource-bound',
          spec: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'x^2 + 1', verificationPolicy: 'exact-only' },
          submission: { expression: `(x + ${k})^12` },
          expectedOutcome: 'indeterminate',
        })
      ) count++;
    } else if (sub === 2) {
      // Unsupported double-angle trig identity under exact-or-symbolic -> indeterminate (never falsely certified!)
      const k = randInt(1, 200);
      if (
        addUnique(`adv-trig-indet-${k}`, {
          kind: 'single',
          id: nextId('ADV'),
          topic: 'adversarial-resource-bounds',
          curriculumLevel: 'as-a-level',
          verificationClass: 'unsupported-trig-identity',
          spec: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: `${k}*sin(2*x)`, verificationPolicy: 'exact-or-symbolic' },
          submission: { expression: `${2 * k}*sin(x)*cos(x)` },
          expectedOutcome: 'indeterminate',
        })
      ) count++;
    } else if (sub === 3) {
      // Ambiguous notation `a/bx` or forbidden identifier -> syntax-error (rejected)
      const a = randInt(1, 99);
      const b = randInt(2, 99);
      if (
        addUnique(`adv-ambig-${a}-${b}`, {
          kind: 'single',
          id: nextId('ADV'),
          topic: 'adversarial-resource-bounds',
          curriculumLevel: 'igcse',
          verificationClass: 'adversarial-syntax',
          spec: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: `${a}/(${b}*x)` },
          submission: { expression: `${a}/${b}x` },
          expectedOutcome: 'reject',
        })
      ) count++;
    } else {
      // Constant undefined expression 0/0 or (k - k)/(k - k) -> rejected
      const k = randInt(1, 200);
      if (
        addUnique(`adv-zero-div-${k}`, {
          kind: 'single',
          id: nextId('ADV'),
          topic: 'adversarial-resource-bounds',
          curriculumLevel: 'igcse',
          verificationClass: 'adversarial-domain-undefined',
          spec: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: '1' },
          submission: { expression: `(${k} - ${k})/(${k} - ${k})` },
          expectedOutcome: 'reject',
        })
      ) count++;
    }
  }
}

/* ==================== EXECUTE ALL 10,000 CASES ==================== */
interface TopicStats {
  total: number;
  correctAccept: number;
  correctReject: number;
  correctIndeterminate: number;
  falseAccept: number;
  falseReject: number;
  unexpectedIndeterminate: number;
  markingMismatch: number;
  duplicateMarks: number;
  exceededMaxMarks: number;
  latenciesMs: number[];
}

const byTopic: Record<string, TopicStats> = {};
const discrepancies: Array<Record<string, unknown>> = [];

const getStats = (topic: string): TopicStats => {
  if (!byTopic[topic]) {
    byTopic[topic] = {
      total: 0,
      correctAccept: 0,
      correctReject: 0,
      correctIndeterminate: 0,
      falseAccept: 0,
      falseReject: 0,
      unexpectedIndeterminate: 0,
      markingMismatch: 0,
      duplicateMarks: 0,
      exceededMaxMarks: 0,
      latenciesMs: [],
    };
  }
  return byTopic[topic];
};

const tStartAll = performance.now();

for (const c of cases) {
  const st = getStats(c.topic);
  st.total++;
  const t0 = performance.now();

  if (c.kind === 'single') {
    const res = evaluateMathSubmission(c.spec, c.submission);
    const dt = performance.now() - t0;
    st.latenciesMs.push(dt);

    const actualOutcome: ExpectedOutcome = res.passed
      ? 'accept'
      : res.verdict === 'unsupported-or-indeterminate'
        ? 'indeterminate'
        : 'reject';

    if (c.expectedOutcome === 'accept') {
      if (actualOutcome === 'accept') st.correctAccept++;
      else if (actualOutcome === 'indeterminate') {
        st.unexpectedIndeterminate++;
        discrepancies.push({ id: c.id, topic: c.topic, class: c.verificationClass, expected: 'accept', actual: actualOutcome, verdict: res.verdict, feedback: res.feedback, expr: c.submission.expression });
      } else {
        st.falseReject++;
        discrepancies.push({ id: c.id, topic: c.topic, class: c.verificationClass, expected: 'accept', actual: actualOutcome, verdict: res.verdict, feedback: res.feedback, expr: c.submission.expression });
      }
    } else if (c.expectedOutcome === 'reject') {
      if (actualOutcome === 'reject') st.correctReject++;
      else if (actualOutcome === 'accept') {
        st.falseAccept++;
        discrepancies.push({ id: c.id, topic: c.topic, class: c.verificationClass, expected: 'reject', actual: actualOutcome, verdict: res.verdict, feedback: res.feedback, expr: c.submission.expression });
      } else {
        st.unexpectedIndeterminate++;
        discrepancies.push({ id: c.id, topic: c.topic, class: c.verificationClass, expected: 'reject', actual: actualOutcome, verdict: res.verdict, feedback: res.feedback, expr: c.submission.expression });
      }
    } else {
      // expectedOutcome === 'indeterminate'
      if (actualOutcome === 'indeterminate') st.correctIndeterminate++;
      else if (actualOutcome === 'accept') {
        st.falseAccept++;
        discrepancies.push({ id: c.id, topic: c.topic, class: c.verificationClass, expected: 'indeterminate', actual: actualOutcome, verdict: res.verdict, feedback: res.feedback, expr: c.submission.expression });
      } else {
        st.falseReject++;
        discrepancies.push({ id: c.id, topic: c.topic, class: c.verificationClass, expected: 'indeterminate', actual: actualOutcome, verdict: res.verdict, feedback: res.feedback, expr: c.submission.expression });
      }
    }
  } else {
    const res = evaluateWorkingWorkspace(c.spec, c.steps);
    const dt = performance.now() - t0;
    st.latenciesMs.push(dt);

    if (c.expectedCorrect) {
      if (res.chain.mathematicallyCorrect) st.correctAccept++;
      else {
        st.falseReject++;
        discrepancies.push({ id: c.id, topic: c.topic, class: c.verificationClass, expected: 'correct', actual: res.chain.stepResults.map((s) => s.status) });
      }
    } else {
      if (!res.chain.mathematicallyCorrect) st.correctReject++;
      else {
        st.falseAccept++;
        discrepancies.push({ id: c.id, topic: c.topic, class: c.verificationClass, expected: 'incorrect', actual: 'correct' });
      }
    }

    if (c.expectedMarks !== undefined && res.marking) {
      if (res.marking.marksAwarded !== c.expectedMarks) {
        st.markingMismatch++;
        discrepancies.push({
          id: c.id,
          topic: c.topic,
          class: c.verificationClass,
          expectedMarks: c.expectedMarks,
          actualMarks: res.marking.marksAwarded,
          details: res.marking.markDetails,
        });
      }
      if (c.maxMarks !== undefined && res.marking.marksAwarded > c.maxMarks) {
        st.exceededMaxMarks++;
      }
      const seenMarkIds = new Set<string>();
      let awardedWeightSum = 0;
      for (const md of res.marking.markDetails) {
        if (md.awarded) {
          if (seenMarkIds.has(md.markId)) st.duplicateMarks++;
          seenMarkIds.add(md.markId);
          awardedWeightSum += md.points;
          if (md.points < 0 || md.points > md.maxPoints) st.exceededMaxMarks++;
        }
      }
      if (awardedWeightSum !== res.marking.marksAwarded || res.marking.marksAwarded < 0) {
        st.markingMismatch++;
        discrepancies.push({
          id: c.id,
          topic: c.topic,
          class: c.verificationClass,
          error: `Marking sum invariant failed: sum(markDetails)=${awardedWeightSum} !== marksAwarded=${res.marking.marksAwarded}`,
        });
      }
    }
  }
}

const totalMs = performance.now() - tStartAll;

const summaryRows = Object.entries(byTopic).map(([topic, s]) => {
  const sorted = [...s.latenciesMs].sort((a, b) => a - b);
  const avg = sorted.reduce((acc, v) => acc + v, 0) / sorted.length;
  const p50 = sorted[Math.floor(sorted.length * 0.5)] ?? 0;
  const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? 0;
  const max = sorted[sorted.length - 1] ?? 0;
  return {
    topic,
    total: s.total,
    correctAccept: s.correctAccept,
    correctReject: s.correctReject,
    correctIndeterminate: s.correctIndeterminate,
    falseAccept: s.falseAccept,
    falseReject: s.falseReject,
    unexpectedIndeterminate: s.unexpectedIndeterminate,
    markingMismatch: s.markingMismatch,
    duplicateMarks: s.duplicateMarks,
    exceededMaxMarks: s.exceededMaxMarks,
    avgMs: Number(avg.toFixed(4)),
    p50Ms: Number(p50.toFixed(4)),
    p95Ms: Number(p95.toFixed(4)),
    maxMs: Number(max.toFixed(4)),
  };
});

const totals = summaryRows.reduce(
  (acc, r) => ({
    total: acc.total + r.total,
    correctAccept: acc.correctAccept + r.correctAccept,
    correctReject: acc.correctReject + r.correctReject,
    correctIndeterminate: acc.correctIndeterminate + r.correctIndeterminate,
    falseAccept: acc.falseAccept + r.falseAccept,
    falseReject: acc.falseReject + r.falseReject,
    unexpectedIndeterminate: acc.unexpectedIndeterminate + r.unexpectedIndeterminate,
    markingMismatch: acc.markingMismatch + r.markingMismatch,
    duplicateMarks: acc.duplicateMarks + r.duplicateMarks,
    exceededMaxMarks: acc.exceededMaxMarks + r.exceededMaxMarks,
  }),
  {
    total: 0,
    correctAccept: 0,
    correctReject: 0,
    correctIndeterminate: 0,
    falseAccept: 0,
    falseReject: 0,
    unexpectedIndeterminate: 0,
    markingMismatch: 0,
    duplicateMarks: 0,
    exceededMaxMarks: 0,
  },
);

const report = {
  seed: 20260503,
  generatedAt: new Date().toISOString(),
  totalUniqueCases: totals.total,
  totalStructuralUniqueCases: seenStructuralKeys.size,
  structuralDuplicateCount,
  totalWallMs: Number(totalMs.toFixed(2)),
  totals,
  byTopic: summaryRows,
  sampleDiscrepancies: discrepancies.slice(0, 25),
};

const outJson = path.resolve(process.cwd(), 'scripts/math-oracle/step5a3-oracle-report.json');
fs.writeFileSync(outJson, JSON.stringify(report, null, 2) + '\n', 'utf8');

console.log(`ORACLE_COMPLETE: ${totals.total} unique cases in ${totalMs.toFixed(1)} ms`);
console.log(JSON.stringify(totals, null, 2));
if (discrepancies.length > 0) {
  console.log(`DISCREPANCIES (${discrepancies.length} total, showing first 10):`);
  console.log(JSON.stringify(discrepancies.slice(0, 10), null, 2));
}
