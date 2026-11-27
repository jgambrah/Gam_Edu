/**
 * GAM EDU — Step 5A Pure Module 6: Unified Mathematical Evaluator Engine
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies, zero eval().
 * Explicitly distinguishes 8 verdict classes so syntax errors, unsupported notation,
 * wrong form, wrong units/precision, and bounded numerical agreement are NEVER conflated
 * with exact symbolic mastery or incorrect mathematical reasoning.
 */

export * from './math-eval-limits';
export * from './math-eval-parser';
export * from './math-eval-exact';
export * from './math-eval-domain-solutions';
export * from './math-eval-units-precision';

import { EvalOpBudget, MATH_EVAL_LIMITS, MathEvalLimitError } from './math-eval-limits';
import { parseEvalExpr, type EvalAstNode } from './math-eval-parser';
import {
  RAT_ZERO,
  astToExactSurd,
  astToRationalPoly,
  checkBoundedNumericAgreement,
  decimalStringToBigRat,
  differentiateAst,
  evalAstNumeric,
  hasCollectedLikeTermsAst,
  isExpandedPolynomialAst,
  isFactoredFormAst,
  isReducedFractionAst,
  isSimplifiedSurdAst,
  ratDiv,
  ratEq,
  ratToNumber,
  rationalPolyEqual,
  roundBigRatToDecimalPlaces,
  roundBigRatToSigFigs,
  surdEqual,
  type BigRat,
} from './math-eval-exact';
import {
  areIntervalUnionsEqual,
  extractOriginalDomain,
  parseEndpoint,
  parseIntervalOrInequality,
  splitEquation,
  testCandidateAgainstOriginalEquation,
  type EquationClass,
  type ExactInterval,
} from './math-eval-domain-solutions';
import {
  DIM_NONE,
  convertToBaseSI,
  dimensionsEqual,
  inspectRawNumericPrecision,
  parseUnitExpression,
} from './math-eval-units-precision';

export type MathEvaluatorMode =
  | 'numeric-quantity'
  | 'algebraic-expression'
  | 'equation-solution'
  | 'inequality-interval'
  | 'calculus-check';

export type MathEvalVerdict =
  | 'exact-equivalent'
  | 'symbolic-domain-equivalent'
  | 'bounded-numeric-match'
  | 'wrong-form'
  | 'wrong-unit-or-precision'
  | 'incorrect'
  | 'syntax-error'
  | 'unsupported-or-indeterminate';

export interface MathEvalResult {
  passed: boolean;
  verdict: MathEvalVerdict;
  feedback: string;
  opsUsed: number;
}

export interface MathEvalSubmission {
  /** Primary expression / numeric / interval input */
  expression: string;
  /** Optional unit string (for numeric-quantity) */
  unit?: string;
  /** Optional learner-entered domain restriction (e.g. "x != 3" or "x > 2") */
  domainInput?: string;
  /** Optional comma/semicolon-separated roots or special token "empty" / "all reals" (for equation-solution) */
  rootsInput?: string;
}

export interface MathMisconceptionRule {
  matchExpr: string;
  feedback: string;
}

export interface MathNumericQuantitySpec {
  mode: 'numeric-quantity';
  expectedValue: string;
  tolerance?: { abs?: number; rel?: number };
  precisionRule?: {
    kind: 'exact' | 'sig-figs' | 'decimal-places';
    count?: number;
    rounding?: 'half-up' | 'half-even';
  };
  requiredForm?: 'any' | 'reduced-fraction' | 'decimal' | 'scientific';
  unitSpec?: {
    expectedUnit: string;
    allowEquivalentUnits?: boolean;
    /** Optional allowlist of conventional unit strings (e.g. ['J', 'kJ'] to disallow 'N m' for energy) */
    allowedUnits?: string[];
    temperatureMode?: 'absolute' | 'difference';
  };
  misconceptionChecks?: MathMisconceptionRule[];
}

export interface MathAlgebraicExpressionSpec {
  mode: 'algebraic-expression';
  variables: string[];
  /** Optional original un-simplified source expression (used to preserve cancelled domain restrictions!) */
  sourceExpr?: string;
  expectedExpr: string;
  requiredForm?:
    | 'any-equivalent'
    | 'expanded-polynomial'
    | 'collected-like-terms'
    | 'factored-form'
    | 'simplified-fraction'
    | 'simplified-surd';
  domainRestrictions?: {
    requireLearnerDomain?: boolean;
    expectedExcluded?: string[];
    expectedDomainInterval?: string;
    variableAssumptions?: Record<string, 'real' | 'positive' | 'nonzero' | 'integer'>;
  };
  verificationPolicy?: 'exact-only' | 'exact-or-symbolic' | 'allow-bounded-numeric';
  misconceptionChecks?: MathMisconceptionRule[];
}

export interface MathEquationSolutionSpec {
  mode: 'equation-solution';
  variable: string;
  originalEquation: string;
  equationClass: EquationClass;
  expectedRoots: string[];
  solutionType?: 'finite-set' | 'empty-set' | 'all-reals';
  requireCompleteSet?: boolean;
  extraneousCandidates?: string[];
}

export interface MathInequalityIntervalSpec {
  mode: 'inequality-interval';
  variable: string;
  expectedIntervals: Array<{
    low: string;
    lowInclusive: boolean;
    high: string;
    highInclusive: boolean;
  }>;
  acceptedInputStyle?: 'inequality' | 'interval' | 'either';
}

export interface MathCalculusCheckSpec {
  mode: 'calculus-check';
  variable: string;
  calculusKind: 'derivative' | 'antiderivative';
  sourceExpr: string;
  expectedExpr: string;
  /** True when general indefinite integral `+ C` is required; false accepts a particular antiderivative */
  requireConstantOfIntegration?: boolean;
  /** Optional: allow both ln|x| and ln(x) on positive domains, or require ln|x| */
  requireAbsInLog?: boolean;
}

export type MathEvaluatorSpec =
  | MathNumericQuantitySpec
  | MathAlgebraicExpressionSpec
  | MathEquationSolutionSpec
  | MathInequalityIntervalSpec
  | MathCalculusCheckSpec;

function parseExactNumberOrRat(raw: string, budget: EvalOpBudget): BigRat | null {
  try {
    const parsed = parseEvalExpr(raw, { allowedVariables: [] });
    const rp = astToRationalPoly(parsed.ast, budget);
    if (!rp || rp.num.size > 1 || rp.den.size !== 1 || !rp.den.has('')) return null;
    const num = rp.num.get('') ?? RAT_ZERO;
    const den = rp.den.get('')!;
    return ratDiv(num, den);
  } catch {
    return null;
  }
}

function checkUnitCompatibility(
  learnerVal: number,
  learnerUnitRaw: string,
  expectedVal: number,
  unitSpec: NonNullable<MathNumericQuantitySpec['unitSpec']>,
): { ok: boolean; convertedLearnerVal: number; convertedExpectedVal: number; message?: string } {
  const expUnit = parseUnitExpression(unitSpec.expectedUnit);
  const lrnUnit = parseUnitExpression(learnerUnitRaw);

  if (!dimensionsEqual(lrnUnit.dim, expUnit.dim)) {
    return {
      ok: false,
      convertedLearnerVal: learnerVal,
      convertedExpectedVal: expectedVal,
      message: `Unit dimension mismatch: "${learnerUnitRaw || '(none)'}" is not dimensionally compatible with "${unitSpec.expectedUnit}".`,
    };
  }

  // Conventional unit allowlist (e.g. distinguish J vs N m even though dimensions match!)
  if (unitSpec.allowedUnits && unitSpec.allowedUnits.length > 0) {
    const normLrn = lrnUnit.canonicalRaw;
    const allowedNorms = unitSpec.allowedUnits.map((u) => parseUnitExpression(u).canonicalRaw);
    if (!allowedNorms.includes(normLrn)) {
      return {
        ok: false,
        convertedLearnerVal: learnerVal,
        convertedExpectedVal: expectedVal,
        message: `Dimensionally compatible, but conventional unit required is one of: ${unitSpec.allowedUnits.join(', ')} (got "${learnerUnitRaw}").`,
      };
    }
  } else if (unitSpec.allowEquivalentUnits === false && lrnUnit.canonicalRaw !== expUnit.canonicalRaw) {
    return {
      ok: false,
      convertedLearnerVal: learnerVal,
      convertedExpectedVal: expectedVal,
      message: `Please express your answer in "${unitSpec.expectedUnit}" (got "${learnerUnitRaw}").`,
    };
  }

  const tMode = unitSpec.temperatureMode ?? 'difference';
  return {
    ok: true,
    convertedLearnerVal: convertToBaseSI(learnerVal, lrnUnit, tMode),
    convertedExpectedVal: convertToBaseSI(expectedVal, expUnit, tMode),
  };
}

export function evaluateMathSubmission(
  spec: MathEvaluatorSpec,
  submission: MathEvalSubmission,
): MathEvalResult {
  const budget = new EvalOpBudget();

  try {
    /* -------------------- MODE 1: NUMERIC QUANTITY -------------------- */
    if (spec.mode === 'numeric-quantity') {
      const rawExpr = submission.expression.trim();
      const parsed = parseEvalExpr(rawExpr, { allowedVariables: [] });
      const lrnRat = astToRationalPoly(parsed.ast, budget);
      const expRat = parseExactNumberOrRat(spec.expectedValue, budget);
      const lrnNum = evalAstNumeric(parsed.ast, {}, budget);
      const expNum = expRat ? ratToNumber(expRat) : evalAstNumeric(parseEvalExpr(spec.expectedValue).ast, {}, budget);

      if (lrnNum === null || expNum === null) {
        return { passed: false, verdict: 'unsupported-or-indeterminate', feedback: 'Value is undefined or non-finite.', opsUsed: budget.used };
      }

      // 1. Unit check (if unitSpec declared)
      let cmpLrn = lrnNum;
      let cmpExp = expNum;
      let sameUnit = true;
      if (spec.unitSpec) {
        const lrnUnitStr = (submission.unit ?? '').trim();
        const expParsedUnit = parseUnitExpression(spec.unitSpec.expectedUnit);
        const isDimensionlessAllowedEmpty =
          dimensionsEqual(expParsedUnit.dim, DIM_NONE) && spec.unitSpec.allowEquivalentUnits !== false;
        if (!lrnUnitStr && spec.unitSpec.expectedUnit.trim() !== '' && !isDimensionlessAllowedEmpty) {
          return {
            passed: false,
            verdict: 'wrong-unit-or-precision',
            feedback: `Include the required unit (expected compatible with ${spec.unitSpec.expectedUnit}).`,
            opsUsed: budget.used,
          };
        }
        const uRes = checkUnitCompatibility(lrnNum, lrnUnitStr, expNum, spec.unitSpec);
        if (!uRes.ok) {
          return {
            passed: false,
            verdict: 'wrong-unit-or-precision',
            feedback: uRes.message ?? 'Incorrect unit.',
            opsUsed: budget.used,
          };
        }
        cmpLrn = uRes.convertedLearnerVal;
        cmpExp = uRes.convertedExpectedVal;
        sameUnit =
          parseUnitExpression(lrnUnitStr).canonicalRaw === parseUnitExpression(spec.unitSpec.expectedUnit).canonicalRaw;
      }

      // 2. Value comparison (exact BigRat when possible & no tolerance, or exact rounded target, or abs/rel tolerance)
      const prec = spec.precisionRule;
      const lrnExactRat =
        lrnRat && lrnRat.num.size <= 1 && lrnRat.den.size === 1 && lrnRat.den.has('')
          ? ratDiv(lrnRat.num.get('') ?? RAT_ZERO, lrnRat.den.get('')!)
          : null;

      let valueMatched = false;
      let exactMatch = false;

      if (prec?.kind === 'decimal-places' && prec.count !== undefined && expRat && sameUnit) {
        const { roundedRat, formatted } = roundBigRatToDecimalPlaces(expRat, prec.count, prec.rounding ?? 'half-up');
        if (lrnExactRat && ratEq(lrnExactRat, roundedRat)) {
          valueMatched = true;
          exactMatch = true;
        } else {
          // Check if close to unrounded but wrong rounding!
          const closeUnrounded = Math.abs(cmpLrn - cmpExp) <= Math.pow(10, -prec.count);
          return {
            passed: false,
            verdict: closeUnrounded ? 'wrong-unit-or-precision' : 'incorrect',
            feedback: closeUnrounded
              ? `Check your rounding to ${prec.count} decimal place(s) using ${prec.rounding ?? 'half-up'} rounding.`
              : `Your value (${rawExpr}) does not match the expected rounded result.`,
            opsUsed: budget.used,
          };
        }
        // Also check written decimal places!
        const rawPrec = inspectRawNumericPrecision(rawExpr);
        if (rawPrec.decimalPlaces !== prec.count) {
          return {
            passed: false,
            verdict: 'wrong-unit-or-precision',
            feedback: `Mathematically equal to ${formatted}, but write your answer to exactly ${prec.count} decimal place(s).`,
            opsUsed: budget.used,
          };
        }
      } else if (prec?.kind === 'sig-figs' && prec.count !== undefined && expRat && sameUnit) {
        const { roundedRat } = roundBigRatToSigFigs(expRat, prec.count, prec.rounding ?? 'half-up');
        if (lrnExactRat && ratEq(lrnExactRat, roundedRat)) {
          valueMatched = true;
          exactMatch = true;
        } else {
          return {
            passed: false,
            verdict: 'incorrect',
            feedback: `Check your calculation and rounding to ${prec.count} significant figure(s).`,
            opsUsed: budget.used,
          };
        }
        const rawPrec = inspectRawNumericPrecision(rawExpr);
        if (rawPrec.ambiguousTrailingZeros) {
          return {
            passed: false,
            verdict: 'wrong-unit-or-precision',
            feedback: `Trailing zeros in "${rawExpr}" are ambiguous for ${prec.count} s.f. — use scientific notation (e.g. a × 10^n).`,
            opsUsed: budget.used,
          };
        }
        if (rawPrec.sigFigs !== prec.count) {
          return {
            passed: false,
            verdict: 'wrong-unit-or-precision',
            feedback: `Value is right, but "${rawExpr}" has ${rawPrec.sigFigs ?? '?'} significant figure(s) instead of ${prec.count} s.f.`,
            opsUsed: budget.used,
          };
        }
      } else if (spec.tolerance && (spec.tolerance.abs !== undefined || spec.tolerance.rel !== undefined)) {
        const diff = Math.abs(cmpLrn - cmpExp);
        const okAbs = spec.tolerance.abs !== undefined && diff <= spec.tolerance.abs;
        const okRel = spec.tolerance.rel !== undefined && diff <= spec.tolerance.rel * Math.max(1e-12, Math.abs(cmpExp));
        valueMatched = okAbs || okRel;
      } else if (sameUnit && lrnExactRat && expRat) {
        valueMatched = ratEq(lrnExactRat, expRat);
        exactMatch = valueMatched;
      } else {
        const scale = Math.max(1, Math.abs(cmpExp));
        valueMatched = Math.abs(cmpLrn - cmpExp) <= 1e-9 * scale;
        exactMatch = valueMatched;
      }

      if (!valueMatched) {
        return {
          passed: false,
          verdict: 'incorrect',
          feedback: `Your answer (${rawExpr}${submission.unit ? ` ${submission.unit}` : ''}) does not match the expected value.`,
          opsUsed: budget.used,
        };
      }

      // 3. Required form checks (reduced-fraction, scientific, decimal)
      if (spec.requiredForm === 'reduced-fraction' && !isReducedFractionAst(parsed.ast)) {
        return {
          passed: false,
          verdict: 'wrong-form',
          feedback: 'Your fraction is mathematically equivalent, but simplify it to its lowest (reduced) fractional form.',
          opsUsed: budget.used,
        };
      }
      if (spec.requiredForm === 'scientific' && !inspectRawNumericPrecision(rawExpr).isScientific) {
        return {
          passed: false,
          verdict: 'wrong-form',
          feedback: 'Your value is correct, but write it in standard scientific notation (e.g. 3.00 × 10^8 or 3.00e8).',
          opsUsed: budget.used,
        };
      }

      return {
        passed: true,
        verdict: exactMatch ? 'exact-equivalent' : 'bounded-numeric-match',
        feedback: exactMatch
          ? 'Exact match verified!'
          : 'Verified within the specified numerical tolerance.',
        opsUsed: budget.used,
      };
    }

    /* -------------------- MODE 2: ALGEBRAIC EXPRESSION -------------------- */
    if (spec.mode === 'algebraic-expression') {
      const lrnParsed = parseEvalExpr(submission.expression, { allowedVariables: spec.variables });
      const expParsed = parseEvalExpr(spec.expectedExpr, { allowedVariables: spec.variables });

      // Check misconception rules first for targeted diagnostics
      if (spec.misconceptionChecks) {
        for (const rule of spec.misconceptionChecks) {
          try {
            const mAst = parseEvalExpr(rule.matchExpr, { allowedVariables: spec.variables }).ast;
            const lrnRp = astToRationalPoly(lrnParsed.ast, budget);
            const mRp = astToRationalPoly(mAst, budget);
            if (lrnRp && mRp && rationalPolyEqual(lrnRp, mRp, budget)) {
              return { passed: false, verdict: 'incorrect', feedback: rule.feedback, opsUsed: budget.used };
            }
          } catch {
            // ignore non-matching misconception rule
          }
        }
      }

      // 1. Try Tier 1 Exact Verification (Rational Polynomial OR Exact Quadratic Surd)
      let matchedTier: 'exact-equivalent' | 'symbolic-domain-equivalent' | 'bounded-numeric-match' | null = null;
      const lrnRp = astToRationalPoly(lrnParsed.ast, budget);
      const expRp = astToRationalPoly(expParsed.ast, budget);

      if (lrnRp && expRp) {
        if (rationalPolyEqual(lrnRp, expRp, budget)) {
          matchedTier = 'exact-equivalent';
        }
      } else {
        const lrnSurd = astToExactSurd(lrnParsed.ast, budget);
        const expSurd = astToExactSurd(expParsed.ast, budget);
        if (lrnSurd && expSurd) {
          if (surdEqual(lrnSurd, expSurd)) {
            matchedTier = 'exact-equivalent';
          }
        }
      }

      // 2. If not exact polynomial/surd, check symbolic-domain or opt-in bounded numeric
      if (!matchedTier) {
        const policy = spec.verificationPolicy ?? 'exact-or-symbolic';
        const posVars = new Set<string>();
        for (const [v, a] of Object.entries(spec.domainRestrictions?.variableAssumptions ?? {})) {
          if (a === 'positive') posVars.add(v);
        }
        if (policy === 'exact-only') {
          return {
            passed: false,
            verdict: lrnRp && expRp ? 'incorrect' : 'unsupported-or-indeterminate',
            feedback:
              lrnRp && expRp
                ? 'Your expression is not algebraically equivalent to the target.'
                : 'Exact symbolic verification is required for this activity and could not be established for your expression.',
            opsUsed: budget.used,
          };
        }
        const numRes = checkBoundedNumericAgreement(lrnParsed.ast, expParsed.ast, spec.variables, budget, posVars);
        if (numRes.agreed) {
          matchedTier = policy === 'allow-bounded-numeric' ? 'bounded-numeric-match' : 'symbolic-domain-equivalent';
        }
      }

      if (!matchedTier) {
        return {
          passed: false,
          verdict: 'incorrect',
          feedback: 'Your expression is not mathematically equivalent to the expected result. Check signs, coefficients, and exponents.',
          opsUsed: budget.used,
        };
      }

      // 3. Domain restriction check (preserving restrictions lost by cancellation!)
      if (spec.domainRestrictions?.requireLearnerDomain) {
        const rawDom = (submission.domainInput ?? '').trim();
        if (!rawDom) {
          return {
            passed: false,
            verdict: 'wrong-form',
            feedback: 'Your simplified expression is equivalent, but you must also state the domain restriction from the original expression.',
            opsUsed: budget.used,
          };
        }
        if (spec.domainRestrictions.expectedExcluded && spec.domainRestrictions.expectedExcluded.length > 0) {
          const v = spec.variables[0];
          const normDom = rawDom.replace(/\u2260/g, '!=').replace(/\s+/g, '');
          const missing = spec.domainRestrictions.expectedExcluded.filter((ex) => {
            const target = `${v}!=${ex.replace(/\s+/g, '')}`;
            return !normDom.includes(target);
          });
          if (missing.length > 0) {
            return {
              passed: false,
              verdict: 'wrong-form',
              feedback: `Check your excluded value(s): remember the original denominator cannot be zero (e.g. ${v} ≠ ${missing[0]}).`,
              opsUsed: budget.used,
            };
          }
        }
        if (spec.domainRestrictions.expectedDomainInterval) {
          const v = spec.variables[0];
          const expIv = parseIntervalOrInequality(spec.domainRestrictions.expectedDomainInterval, v);
          const lrnIv = parseIntervalOrInequality(rawDom, v);
          if (!areIntervalUnionsEqual(expIv, lrnIv)) {
            return {
              passed: false,
              verdict: 'wrong-form',
              feedback: `Your expression is equivalent, but check the restricted domain (all original logarithms/roots must remain defined).`,
              opsUsed: budget.used,
            };
          }
        }
      } else if (spec.sourceExpr && spec.variables.length === 1) {
        // Verify source domain is certifiable when claiming exact rational equivalence
        const srcParsed = parseEvalExpr(spec.sourceExpr, { allowedVariables: spec.variables });
        const srcDom = extractOriginalDomain(srcParsed.ast, spec.variables[0], budget);
        if (!srcDom.certifiable && matchedTier === 'exact-equivalent') {
          return {
            passed: false,
            verdict: 'unsupported-or-indeterminate',
            feedback: 'Domain equivalence could not be certified for this denominator class.',
            opsUsed: budget.used,
          };
        }
      }

      // 4. Required answer form check (AFTER confirming equivalence!)
      if (spec.requiredForm === 'expanded-polynomial' && !isExpandedPolynomialAst(lrnParsed.ast)) {
        return {
          passed: false,
          verdict: 'wrong-form',
          feedback: 'Your expression is mathematically equivalent, but expand all brackets into simplified polynomial form.',
          opsUsed: budget.used,
        };
      }
      if (spec.requiredForm === 'collected-like-terms' && !hasCollectedLikeTermsAst(lrnParsed.ast, budget)) {
        return {
          passed: false,
          verdict: 'wrong-form',
          feedback: 'Your expression is mathematically equivalent, but collect and combine all like terms.',
          opsUsed: budget.used,
        };
      }
      if (spec.requiredForm === 'factored-form' && !isFactoredFormAst(lrnParsed.ast)) {
        return {
          passed: false,
          verdict: 'wrong-form',
          feedback: 'Your expression is mathematically equivalent, but write it in fully factorised form.',
          opsUsed: budget.used,
        };
      }
      if (spec.requiredForm === 'simplified-surd' && !isSimplifiedSurdAst(lrnParsed.ast)) {
        return {
          passed: false,
          verdict: 'wrong-form',
          feedback: 'Your surd value is equivalent, but extract all perfect square factors and combine like surds.',
          opsUsed: budget.used,
        };
      }

      const label =
        matchedTier === 'exact-equivalent'
          ? 'Verified: exact algebraic equivalence confirmed!'
          : matchedTier === 'symbolic-domain-equivalent'
            ? 'Verified: equivalent within the supported symbolic domain.'
            : 'Verified numerically on a bounded domain (not a universal symbolic proof).';
      return { passed: true, verdict: matchedTier, feedback: label, opsUsed: budget.used };
    }

    /* -------------------- MODE 3: EQUATION SOLUTION -------------------- */
    if (spec.mode === 'equation-solution') {
      const rawRoots = (submission.rootsInput ?? submission.expression).trim();
      const lower = rawRoots.toLowerCase();
      const solType = spec.solutionType ?? 'finite-set';

      if (solType === 'empty-set') {
        const isEmptyInput = lower === 'empty' || lower === 'no solution' || lower === 'none' || lower === '∅' || lower === '{}';
        return {
          passed: isEmptyInput,
          verdict: isEmptyInput ? 'exact-equivalent' : 'incorrect',
          feedback: isEmptyInput
            ? 'Verified: this equation has no real solution (empty set ∅).'
            : 'Check whether any real value can actually satisfy the original equation (watch for contradictions or domain violations).',
          opsUsed: budget.used,
        };
      }

      if (solType === 'all-reals') {
        const isAll = lower === 'all reals' || lower === 'all real numbers' || lower === 'r' || lower === 'ℝ' || lower === 'identity';
        return {
          passed: isAll,
          verdict: isAll ? 'exact-equivalent' : 'incorrect',
          feedback: isAll
            ? 'Verified: this equation is an identity satisfied by all permitted real numbers.'
            : 'Simplify both sides — is this equation true for every permitted value of the variable?',
          opsUsed: budget.used,
        };
      }

      const { lhs, rhs } = splitEquation(spec.originalEquation);
      const lhsAst = parseEvalExpr(lhs, { allowedVariables: [spec.variable] }).ast;
      const rhsAst = parseEvalExpr(rhs, { allowedVariables: [spec.variable] }).ast;

      const tokens = rawRoots
        .replace(/^\{|\}$/g, '')
        .split(/[,;]|\bor\b/i)
        .map((s) => s.trim().replace(new RegExp(`^${spec.variable}\\s*=\\s*`), ''))
        .filter(Boolean);

      if (tokens.length === 0) {
        return { passed: false, verdict: 'syntax-error', feedback: 'Enter at least one root value.', opsUsed: budget.used };
      }
      if (tokens.length > MATH_EVAL_LIMITS.maxCandidateRoots) {
        return {
          passed: false,
          verdict: 'syntax-error',
          feedback: `Too many candidate roots (max ${MATH_EVAL_LIMITS.maxCandidateRoots}).`,
          opsUsed: budget.used,
        };
      }

      const learnerVals: Array<{ raw: string; val: number }> = [];
      for (const tok of tokens) {
        const ast = parseEvalExpr(tok, { allowedVariables: [] }).ast;
        const val = evalAstNumeric(ast, {}, budget);
        if (val === null) {
          return { passed: false, verdict: 'syntax-error', feedback: `Invalid root "${tok}".`, opsUsed: budget.used };
        }
        // Deduplicate repeated root notation (e.g. "3, 3" -> {3})
        if (!learnerVals.some((x) => Math.abs(x.val - val) < 1e-6)) {
          learnerVals.push({ raw: tok, val });
        }
      }

      // 1. Validate EVERY candidate root against the ORIGINAL equation (catches extraneous roots!)
      for (const cand of learnerVals) {
        const check = testCandidateAgainstOriginalEquation(lhsAst, rhsAst, spec.variable, cand.val, budget);
        if (!check.satisfies) {
          const isKnownExtraneous = (spec.extraneousCandidates ?? []).some((ex) => {
            const ev = evalAstNumeric(parseEvalExpr(ex).ast, {}, budget);
            return ev !== null && Math.abs(ev - cand.val) < 1e-5;
          });
          return {
            passed: false,
            verdict: 'incorrect',
            feedback: isKnownExtraneous || check.domainError
              ? `Extraneous root detected: ${spec.variable} = ${cand.raw} does NOT satisfy the original equation (${spec.originalEquation}). Always substitute back into the original equation!`
              : `${spec.variable} = ${cand.raw} does not satisfy ${spec.originalEquation}.`,
            opsUsed: budget.used,
          };
        }
      }

      // 2. Check solution-set completeness against certified expectedRoots
      const expectedVals = spec.expectedRoots.map((r) => evalAstNumeric(parseEvalExpr(r).ast, {}, budget)!);
      const requireComplete = spec.requireCompleteSet !== false;
      const missing = expectedVals.filter((ev) => !learnerVals.some((lv) => Math.abs(lv.val - ev) < 1e-5));

      if (requireComplete && missing.length > 0) {
        return {
          passed: false,
          verdict: 'incorrect',
          feedback: `Your root(s) satisfy the equation, but the solution set is incomplete — ${missing.length} additional valid root(s) missing.`,
          opsUsed: budget.used,
        };
      }

      return {
        passed: true,
        verdict: 'exact-equivalent',
        feedback: `Verified: complete solution set confirmed against the original equation ${spec.originalEquation}.`,
        opsUsed: budget.used,
      };
    }

    /* -------------------- MODE 4: INEQUALITY & INTERVAL -------------------- */
    if (spec.mode === 'inequality-interval') {
      const expected: ExactInterval[] = spec.expectedIntervals.map((iv) => ({
        low: parseEndpoint(iv.low),
        lowInclusive: iv.lowInclusive,
        high: parseEndpoint(iv.high),
        highInclusive: iv.highInclusive,
      }));
      const learner = parseIntervalOrInequality(submission.expression, spec.variable);
      const eq = areIntervalUnionsEqual(expected, learner);
      return {
        passed: eq,
        verdict: eq ? 'exact-equivalent' : 'incorrect',
        feedback: eq
          ? 'Verified: exact solution interval set matches!'
          : 'Check your boundary values, open "(" vs closed "[" endpoints, and union components.',
        opsUsed: budget.used,
      };
    }

    /* -------------------- MODE 5: CALCULUS CHECK -------------------- */
    if (spec.mode === 'calculus-check') {
      if (spec.calculusKind === 'derivative') {
        const srcAst = parseEvalExpr(spec.sourceExpr, { allowedVariables: [spec.variable] }).ast;
        const derivedAst = differentiateAst(srcAst, spec.variable, budget);
        const lrnAst = parseEvalExpr(submission.expression, { allowedVariables: [spec.variable] }).ast;

        // Try exact rational-polynomial comparison first
        const dRp = astToRationalPoly(derivedAst, budget);
        const lRp = astToRationalPoly(lrnAst, budget);
        if (dRp && lRp) {
          const ok = rationalPolyEqual(dRp, lRp, budget);
          return {
            passed: ok,
            verdict: ok ? 'exact-equivalent' : 'incorrect',
            feedback: ok
              ? 'Verified: exact symbolic derivative confirmed!'
              : 'Check your differentiation rules (power, product, quotient, or chain rule).',
            opsUsed: budget.used,
          };
        }
        // Symbolic/trig/exp/ln comparison over valid domain (radians)
        const numRes = checkBoundedNumericAgreement(derivedAst, lrnAst, [spec.variable], budget, new Set([spec.variable]));
        return {
          passed: numRes.agreed,
          verdict: numRes.agreed ? 'symbolic-domain-equivalent' : 'incorrect',
          feedback: numRes.agreed
            ? 'Verified: derivative matches symbolic differentiation (trigonometric functions in radians).'
            : 'Check your derivative rules (remember trigonometric derivatives use radians).',
          opsUsed: budget.used,
        };
      }

      // Antiderivative verification: differentiate learner's F(x) and verify F'(x) === f(x)!
      const requireC = Boolean(spec.requireConstantOfIntegration);
      const lrnParsed = parseEvalExpr(submission.expression, {
        allowedVariables: [spec.variable],
        allowConstantC: true,
      });
      const hasC = lrnParsed.usedVariables.includes('C');
      const srcAst = parseEvalExpr(spec.sourceExpr, { allowedVariables: [spec.variable] }).ast;
      const lrnDerivAst = differentiateAst(lrnParsed.ast, spec.variable, budget);

      // Compare lrnDerivAst vs srcAst (exact rational-poly first, then bounded domain)
      let derivMatches = false;
      let exactPoly = false;
      const dRp = astToRationalPoly(lrnDerivAst, budget);
      const sRp = astToRationalPoly(srcAst, budget);
      if (dRp && sRp) {
        derivMatches = rationalPolyEqual(dRp, sRp, budget);
        exactPoly = derivMatches;
      } else {
        const numRes = checkBoundedNumericAgreement(lrnDerivAst, srcAst, [spec.variable], budget, new Set([spec.variable]));
        derivMatches = numRes.agreed;
      }

      if (!derivMatches) {
        return {
          passed: false,
          verdict: 'incorrect',
          feedback: 'Differentiating your answer does not recover the original integrand. Check powers and coefficients.',
          opsUsed: budget.used,
        };
      }

      // Check ln|x| vs ln(x) when requireAbsInLog is set
      if (spec.requireAbsInLog) {
        const containsAbs = (n: EvalAstNode): boolean => {
          if (n.type === 'call' && n.name === 'abs') return true;
          if (n.type === 'unary') return containsAbs(n.arg);
          if (n.type === 'call') return containsAbs(n.arg);
          if (n.type === 'binary') return containsAbs(n.left) || containsAbs(n.right);
          return false;
        };
        if (!containsAbs(lrnParsed.ast)) {
          return {
            passed: false,
            verdict: 'wrong-form',
            feedback: 'Your antiderivative works for x > 0, but write ln|x| (with absolute value bars) to cover all x ≠ 0.',
            opsUsed: budget.used,
          };
        }
      }

      if (requireC && !hasC) {
        return {
          passed: false,
          verdict: 'wrong-form',
          feedback: 'You found a valid particular antiderivative, but the general indefinite integral requires "+ C".',
          opsUsed: budget.used,
        };
      }

      return {
        passed: true,
        verdict: exactPoly ? 'exact-equivalent' : 'symbolic-domain-equivalent',
        feedback: requireC
          ? 'Verified: general indefinite integral confirmed via exact differentiation (including + C)!'
          : 'Verified: valid particular antiderivative confirmed via exact differentiation!',
        opsUsed: budget.used,
      };
    }

    return { passed: false, verdict: 'unsupported-or-indeterminate', feedback: 'Unsupported mode.', opsUsed: budget.used };
  } catch (err) {
    if (err instanceof MathEvalLimitError) {
      const verdict: MathEvalVerdict =
        err.code === 'UNSUPPORTED' || err.code === 'LIMIT_EXCEEDED' ? 'unsupported-or-indeterminate' : 'syntax-error';
      return { passed: false, verdict, feedback: err.message, opsUsed: budget.used };
    }
    return {
      passed: false,
      verdict: 'syntax-error',
      feedback: err instanceof Error ? err.message : 'Could not evaluate expression.',
      opsUsed: budget.used,
    };
  }
}
