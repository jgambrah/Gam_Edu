/**
 * GAM EDU — Step 5A Pure Module 6: Unified Mathematical Evaluator Engine
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies, zero eval().
 * Strict Verification Integrity:
 * - Numerical agreement NEVER produces `exact-equivalent` or `symbolic-domain-equivalent`.
 * - Correctness is ALWAYS evaluated BEFORE misconception rules.
 * - Exact rational & exact unit conversions have ZERO hidden 1e-9 float tolerances.
 * - Arbitrary constant of integration C is verified via `d/dC !== 0` (independent of x).
 */

export * from './math-eval-limits';
export * from './math-eval-parser';
export * from './math-eval-exact';
export * from './math-eval-domain-solutions';
export * from './math-eval-units-precision';
export * from './math-eval-step-verifier';
export * from './math-eval-marking';

import { EvalOpBudget, MATH_EVAL_LIMITS, MathEvalLimitError } from './math-eval-limits';
import { parseEvalExpr, type EvalAstNode } from './math-eval-parser';
import {
  RAT_ZERO,
  astToRationalPoly,
  checkBoundedNumericAgreement,
  checkSymbolicEquivalence,
  differentiateAst,
  evalAstNumeric,
  hasCollectedLikeTermsAst,
  isDecimalLiteralAst,
  isExpandedPolynomialAst,
  isFullyFactoredFormAst,
  isReducedFractionAst,
  isSimplifiedFractionAst,
  isSimplifiedSurdAst,
  polyDegree,
  polyIsZero,
  ratDiv,
  ratEq,
  ratToNumber,
  roundBigRatToDecimalPlaces,
  roundBigRatToSigFigs,
  type BigRat,
} from './math-eval-exact';
import {
  allRealsIntervalUnion,
  areExcludedSetsEqual,
  areIntervalUnionsEqual,
  exactRootEqual,
  exactRootToNumber,
  extractExpressionDomain,
  intersectIntervalUnions,
  isIntervalUnionSubset,
  parseEndpoint,
  parseExactRoot,
  parseExcludedValuesSet,
  parseIntervalOrInequality,
  splitEquation,
  subtractPointFromUnion,
  testCandidateAgainstOriginalEquation,
  type EquationClass,
  type ExactInterval,
  type ExactRoot,
} from './math-eval-domain-solutions';
import {
  DIM_NONE,
  convertExactRatToUnit,
  convertToBaseSI,
  dimensionsEqual,
  inspectRawNumericPrecision,
  parseUnitExpression,
} from './math-eval-units-precision';

import {
  verifyWorkingChain,
  type StepOperationKind,
  type WorkingChainResult,
  type WorkingStepInput,
  type WorkspaceProblemKind,
} from './math-eval-step-verifier';
import {
  evaluateMarkingScheme,
  type MarkingEvaluationResult,
  type MarkingSchemeDef,
} from './math-eval-marking';

export type MathEvaluatorMode =
  | 'numeric-quantity'
  | 'algebraic-expression'
  | 'equation-solution'
  | 'inequality-interval'
  | 'calculus-check'
  | 'multi-step-working';

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
  expression: string;
  unit?: string;
  domainInput?: string;
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
    allowedUnits?: string[];
    temperatureMode?: 'absolute' | 'difference';
  };
  misconceptionChecks?: MathMisconceptionRule[];
}

export interface MathDomainRestrictions {
  requireLearnerDomain?: boolean;
  expectedExcluded?: string[];
  expectedDomainInterval?: string;
  variableAssumptions?: Record<string, 'real' | 'positive' | 'nonzero' | 'integer'>;
}

export interface MathAlgebraicExpressionSpec {
  mode: 'algebraic-expression';
  variables: string[];
  sourceExpr?: string;
  expectedExpr: string;
  requiredForm?:
  | 'any-equivalent'
  | 'expanded-polynomial'
  | 'collected-like-terms'
  | 'factored-form'
  | 'simplified-fraction'
  | 'simplified-surd';
  domainRestrictions?: MathDomainRestrictions;
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
  requireConstantOfIntegration?: boolean;
  requireAbsInLog?: boolean;
  domainRestrictions?: MathDomainRestrictions;
}

export interface WorkedSolutionStepDef {
  math: string;
  note: string;
  operation?: StepOperationKind;
  domainNote?: string;
  rejectedExtraneous?: string[];
  unit?: string;
}

export interface WorkedSolutionDef {
  methodLabel: string;
  steps: WorkedSolutionStepDef[];
}

export type WorkspaceLearningMode = 'guided' | 'independent' | 'exam-practice';

export interface MathMultiStepWorkingSpec {
  mode: 'multi-step-working';
  learningMode: WorkspaceLearningMode;
  problemKind: WorkspaceProblemKind;
  variables: string[];
  initialStatement: string;
  initialUnit?: string;
  keypadProfile?: 'primary' | 'lower-secondary' | 'igcse' | 'as-a-level';
  domainRestrictions?: MathDomainRestrictions;
  finalGoal:
    | MathNumericQuantitySpec
    | MathAlgebraicExpressionSpec
    | MathEquationSolutionSpec
    | MathInequalityIntervalSpec
    | MathCalculusCheckSpec;
  maxWorkingSteps?: number;
  markingScheme?: MarkingSchemeDef;
  workedSolutions: WorkedSolutionDef[];
}

export type MathEvaluatorSpec =
  | MathNumericQuantitySpec
  | MathAlgebraicExpressionSpec
  | MathEquationSolutionSpec
  | MathInequalityIntervalSpec
  | MathCalculusCheckSpec
  | MathMultiStepWorkingSpec;

export interface WorkspaceEvaluationResult {
  chain: WorkingChainResult;
  marking: MarkingEvaluationResult | null;
  totalOpsUsed: number;
  budgetExceeded: boolean;
}

/**
 * Evaluates a Step 5A.2 multi-step mathematical working submission under a SINGLE
 * cumulative EvalOpBudget across all transitions, domain checks, final-answer verification,
 * and all marking strategies.
 */
export function evaluateWorkingWorkspace(
  spec: MathMultiStepWorkingSpec,
  learnerSteps: WorkingStepInput[],
): WorkspaceEvaluationResult {
  const cumulativeBudget = new EvalOpBudget(MATH_EVAL_LIMITS.maxTotalWorkspaceOps);
  const chain = verifyWorkingChain(
    {
      problemKind: spec.problemKind,
      variables: spec.variables,
      initialStatement: spec.initialStatement,
      initialUnit: spec.initialUnit,
      domainRestrictions: spec.domainRestrictions,
      finalGoal: spec.finalGoal,
    },
    learnerSteps,
    cumulativeBudget,
  );

  const marking = spec.markingScheme
    ? evaluateMarkingScheme(
        spec.markingScheme,
        {
          problemKind: spec.problemKind,
          variables: spec.variables,
          initialStatement: spec.initialStatement,
          initialUnit: spec.initialUnit,
          domainRestrictions: spec.domainRestrictions,
          finalGoal: spec.finalGoal,
        },
        learnerSteps,
        chain,
        cumulativeBudget,
      )
    : null;

  return {
    chain,
    marking,
    totalOpsUsed: cumulativeBudget.used,
    budgetExceeded: chain.budgetExceeded || Boolean(marking?.budgetExceeded),
  };
}

function parseExactNumberOrRat(raw: string, budget: EvalOpBudget): BigRat | null {
  try {
    const parsed = parseEvalExpr(raw, { allowedVariables: [] });
    const rp = astToRationalPoly(parsed.ast, budget);
    if (!rp || rp.num.size > 1 || rp.den.size !== 1 || !rp.den.has('')) return null;
    return ratDiv(rp.num.get('') ?? RAT_ZERO, rp.den.get('')!);
  } catch {
    return null;
  }
}

export function collectVarsInAst(node: EvalAstNode, out: Set<string>): void {
  if (node.type === 'var') {
    out.add(node.name);
    return;
  }
  if (node.type === 'unary' || node.type === 'call') {
    collectVarsInAst(node.arg, out);
    return;
  }
  if (node.type === 'binary') {
    collectVarsInAst(node.left, out);
    collectVarsInAst(node.right, out);
  }
}

/** Detects domain-sensitive constructs (variable denominators, negative powers, logs, sqrt, tan) in multivariate expressions. */
export function hasMultivariateDomainHazard(node: EvalAstNode, budget: EvalOpBudget): boolean {
  const usesAnyVar = (n: EvalAstNode): boolean => {
    if (n.type === 'var') return true;
    if (n.type === 'unary' || n.type === 'call') return usesAnyVar(n.arg);
    if (n.type === 'binary') return usesAnyVar(n.left) || usesAnyVar(n.right);
    return false;
  };
  const walk = (n: EvalAstNode): boolean => {
    budget.tick();
    if (n.type === 'binary' && n.op === '/' && usesAnyVar(n.right)) return true;
    if (n.type === 'binary' && n.op === '^' && usesAnyVar(n.left) && n.right.type === 'unary' && n.right.op === '-') return true;
    if (n.type === 'call' && (n.name === 'ln' || n.name === 'log10' || n.name === 'sqrt' || n.name === 'tan') && usesAnyVar(n.arg)) return true;
    if (n.type === 'unary' || n.type === 'call') return walk(n.arg);
    if (n.type === 'binary') return walk(n.left) || walk(n.right);
    return false;
  };
  return walk(node);
}

/** Builds the explicit author-assumed domain for a univariate spec from domainRestrictions. */
export function buildAssumedDomainFromRestrictions(
  restrictions: MathDomainRestrictions | undefined,
  variable: string,
  budget: EvalOpBudget,
): ExactInterval[] {
  let dom = allRealsIntervalUnion();
  const assumption = restrictions?.variableAssumptions?.[variable];
  if (assumption === 'positive') {
    dom = intersectIntervalUnions(dom, [
      { low: { kind: 'rat', value: RAT_ZERO }, lowInclusive: false, high: { kind: 'pos-inf' }, highInclusive: false },
    ]);
  } else if (assumption === 'nonzero') {
    dom = subtractPointFromUnion(dom, RAT_ZERO);
  }
  if (restrictions?.expectedDomainInterval) {
    const iv = parseIntervalOrInequality(restrictions.expectedDomainInterval, variable);
    dom = intersectIntervalUnions(dom, iv);
  }
  if (restrictions?.expectedExcluded && restrictions.expectedExcluded.length > 0) {
    for (const ex of restrictions.expectedExcluded) {
      const parsedEx = parseExactRoot(ex, budget);
      if (parsedEx && parsedEx.kind === 'rat') {
        dom = subtractPointFromUnion(dom, parsedEx.value);
      }
    }
  }
  return dom;
}

function buildAssumedDomain(
  spec: MathAlgebraicExpressionSpec,
  variable: string,
  budget: EvalOpBudget,
): ExactInterval[] {
  return buildAssumedDomainFromRestrictions(spec.domainRestrictions, variable, budget);
}

/** Verifies specifically that every ln(...) node referencing `variable` wraps `abs(...)` (not merely `abs()` elsewhere!). */
function hasAbsInsideLnOfVar(node: EvalAstNode, variable: string): boolean {
  let foundLnOfVar = false;
  let allWrapAbs = true;
  const usesVar = (n: EvalAstNode): boolean => {
    if (n.type === 'var') return n.name === variable;
    if (n.type === 'unary') return usesVar(n.arg);
    if (n.type === 'call') return usesVar(n.arg);
    if (n.type === 'binary') return usesVar(n.left) || usesVar(n.right);
    return false;
  };
  const walk = (n: EvalAstNode) => {
    if (n.type === 'call' && n.name === 'ln' && usesVar(n.arg)) {
      foundLnOfVar = true;
      if (!(n.arg.type === 'call' && n.arg.name === 'abs')) {
        allWrapAbs = false;
      }
      return;
    }
    if (n.type === 'unary') walk(n.arg);
    else if (n.type === 'call') walk(n.arg);
    else if (n.type === 'binary') {
      walk(n.left);
      walk(n.right);
    }
  };
  walk(node);
  return foundLnOfVar && allWrapAbs;
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
      const lrnExactRat = parseExactNumberOrRat(rawExpr, budget);
      const expExactRat = parseExactNumberOrRat(spec.expectedValue, budget);
      const lrnNum = evalAstNumeric(parsed.ast, {}, budget);
      const expNum = expExactRat
        ? ratToNumber(expExactRat)
        : evalAstNumeric(parseEvalExpr(spec.expectedValue).ast, {}, budget);

      if (lrnNum === null || expNum === null) {
        return { passed: false, verdict: 'unsupported-or-indeterminate', feedback: 'Value is undefined or non-finite.', opsUsed: budget.used };
      }

      // 1. Unit check & exact target conversion into LEARNER'S accepted unit!
      let targetRatInLearnerUnit: BigRat | null = expExactRat;
      let cmpLrnSI = lrnNum;
      let cmpExpSI = expNum;
      let unitConversionIsExact = true;

      if (spec.unitSpec) {
        const lrnUnitStr = (submission.unit ?? '').trim();
        const expUnit = parseUnitExpression(spec.unitSpec.expectedUnit);
        const isDimensionlessAllowedEmpty =
          dimensionsEqual(expUnit.dim, DIM_NONE) && spec.unitSpec.allowEquivalentUnits !== false;
        if (!lrnUnitStr && spec.unitSpec.expectedUnit.trim() !== '' && !isDimensionlessAllowedEmpty) {
          return {
            passed: false,
            verdict: 'wrong-unit-or-precision',
            feedback: `Include the required unit (expected compatible with ${spec.unitSpec.expectedUnit}).`,
            opsUsed: budget.used,
          };
        }
        const lrnUnit = parseUnitExpression(lrnUnitStr);
        if (!dimensionsEqual(lrnUnit.dim, expUnit.dim)) {
          return {
            passed: false,
            verdict: 'wrong-unit-or-precision',
            feedback: `Unit dimension mismatch: "${lrnUnitStr || '(none)'}" is not dimensionally compatible with "${spec.unitSpec.expectedUnit}".`,
            opsUsed: budget.used,
          };
        }
        if (spec.unitSpec.allowedUnits && spec.unitSpec.allowedUnits.length > 0) {
          const allowedNorms = spec.unitSpec.allowedUnits.map((u) => parseUnitExpression(u).canonicalRaw);
          if (!allowedNorms.includes(lrnUnit.canonicalRaw)) {
            return {
              passed: false,
              verdict: 'wrong-unit-or-precision',
              feedback: `Dimensionally compatible, but conventional unit required is one of: ${spec.unitSpec.allowedUnits.join(', ')} (got "${lrnUnitStr}").`,
              opsUsed: budget.used,
            };
          }
        } else if (spec.unitSpec.allowEquivalentUnits === false && lrnUnit.canonicalRaw !== expUnit.canonicalRaw) {
          return {
            passed: false,
            verdict: 'wrong-unit-or-precision',
            feedback: `Please express your answer in "${spec.unitSpec.expectedUnit}" (got "${lrnUnitStr}").`,
            opsUsed: budget.used,
          };
        }

        const tMode = spec.unitSpec.temperatureMode ?? 'difference';
        cmpLrnSI = convertToBaseSI(lrnNum, lrnUnit, tMode);
        cmpExpSI = convertToBaseSI(expNum, expUnit, tMode);
        if (expExactRat) {
          targetRatInLearnerUnit = convertExactRatToUnit(expExactRat, expUnit, lrnUnit, tMode);
          unitConversionIsExact = targetRatInLearnerUnit !== null;
        } else {
          targetRatInLearnerUnit = null;
          unitConversionIsExact = false;
        }
      }

      // 2. Value & precision comparison (NO hidden 1e-9 tolerance!)
      const prec = spec.precisionRule;
      let valueMatched = false;
      let isExact = false;

      if (prec?.kind === 'decimal-places' && prec.count !== undefined && targetRatInLearnerUnit) {
        const { roundedRat, formatted } = roundBigRatToDecimalPlaces(
          targetRatInLearnerUnit,
          prec.count,
          prec.rounding ?? 'half-up',
        );
        if (lrnExactRat && ratEq(lrnExactRat, roundedRat)) {
          valueMatched = true;
          isExact = unitConversionIsExact;
        } else {
          const closeUnrounded = Math.abs(lrnNum - ratToNumber(targetRatInLearnerUnit)) <= Math.pow(10, -prec.count);
          return {
            passed: false,
            verdict: closeUnrounded ? 'wrong-unit-or-precision' : 'incorrect',
            feedback: closeUnrounded
              ? `Check your rounding to ${prec.count} decimal place(s) using ${prec.rounding ?? 'half-up'} rounding.`
              : `Your value (${rawExpr}) does not match the expected rounded result.`,
            opsUsed: budget.used,
          };
        }
        const rawPrec = inspectRawNumericPrecision(rawExpr);
        if (rawPrec.decimalPlaces !== prec.count) {
          return {
            passed: false,
            verdict: 'wrong-unit-or-precision',
            feedback: `Mathematically equal to ${formatted}, but write your answer to exactly ${prec.count} decimal place(s).`,
            opsUsed: budget.used,
          };
        }
      } else if (prec?.kind === 'sig-figs' && prec.count !== undefined && targetRatInLearnerUnit) {
        const { roundedRat } = roundBigRatToSigFigs(targetRatInLearnerUnit, prec.count, prec.rounding ?? 'half-up');
        if (lrnExactRat && ratEq(lrnExactRat, roundedRat)) {
          valueMatched = true;
          isExact = unitConversionIsExact;
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
            feedback: `Trailing zeros in "${rawExpr}" are ambiguous for ${prec.count} s.f. — use normalised scientific notation (e.g. a × 10^n).`,
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
        const diff = Math.abs(cmpLrnSI - cmpExpSI);
        const okAbs = spec.tolerance.abs !== undefined && diff <= spec.tolerance.abs;
        // Relative tolerance near zero: if expected === 0, relative tolerance only matches exact 0 unless abs is also supplied
        const okRel =
          spec.tolerance.rel !== undefined &&
          (cmpExpSI === 0 ? diff === 0 : diff <= spec.tolerance.rel * Math.abs(cmpExpSI));
        valueMatched = okAbs || okRel;
        isExact = false; // Explicitly NEVER label tolerance-based matches as exact!
      } else if (lrnExactRat && targetRatInLearnerUnit) {
        // Pure EXACT rational comparison (zero hidden tolerance: 1.0000000001 !== 1!)
        valueMatched = ratEq(lrnExactRat, targetRatInLearnerUnit);
        isExact = valueMatched;
      } else {
        return {
          passed: false,
          verdict: 'unsupported-or-indeterminate',
          feedback: 'Irrational numeric quantity requires an explicit authoring tolerance.',
          opsUsed: budget.used,
        };
      }

      if (!valueMatched) {
        return {
          passed: false,
          verdict: 'incorrect',
          feedback: `Your answer (${rawExpr}${submission.unit ? ` ${submission.unit}` : ''}) does not match the expected value.`,
          opsUsed: budget.used,
        };
      }

      // 3. Required form checks
      if (spec.requiredForm === 'reduced-fraction' && !isReducedFractionAst(parsed.ast)) {
        return {
          passed: false,
          verdict: 'wrong-form',
          feedback: 'Your fraction is mathematically equivalent, but simplify it to its lowest (reduced) fractional form.',
          opsUsed: budget.used,
        };
      }
      if (spec.requiredForm === 'decimal' && !isDecimalLiteralAst(parsed.ast)) {
        return {
          passed: false,
          verdict: 'wrong-form',
          feedback: 'Your value is mathematically equivalent, but write it in decimal form (not as a fraction or scientific notation).',
          opsUsed: budget.used,
        };
      }
      if (spec.requiredForm === 'scientific' && !inspectRawNumericPrecision(rawExpr).isNormalisedScientific) {
        return {
          passed: false,
          verdict: 'wrong-form',
          feedback: 'Your value is correct, but write it in normalised scientific notation a × 10^n with 1 ≤ |a| < 10 (e.g. 3.00e8).',
          opsUsed: budget.used,
        };
      }

      return {
        passed: true,
        verdict: isExact ? 'exact-equivalent' : 'bounded-numeric-match',
        feedback: isExact
          ? 'Exact match verified!'
          : 'Verified within the specified numerical tolerance (approximate numerical match).',
        opsUsed: budget.used,
      };
    }

    /* -------------------- MODE 2: ALGEBRAIC EXPRESSION -------------------- */
    if (spec.mode === 'algebraic-expression') {
      const lrnParsed = parseEvalExpr(submission.expression, { allowedVariables: spec.variables });
      const expParsed = parseEvalExpr(spec.expectedExpr, { allowedVariables: spec.variables });
      const srcParsed = spec.sourceExpr
        ? parseEvalExpr(spec.sourceExpr, { allowedVariables: spec.variables })
        : null;

      const usedVars = new Set<string>();
      collectVarsInAst(lrnParsed.ast, usedVars);
      collectVarsInAst(expParsed.ast, usedVars);
      if (srcParsed) collectVarsInAst(srcParsed.ast, usedVars);
      const activeVar = usedVars.size === 1 ? Array.from(usedVars)[0] : spec.variables.length === 1 ? spec.variables[0] : null;

      // 0. Pre-check constant/univariate undefined expressions (e.g. 0/0, ln(-1)) & multivariate domain hazards
      if (usedVars.size === 0) {
        const natLrn = extractExpressionDomain(lrnParsed.ast, '__const', budget);
        if (natLrn.domain.length === 0) {
          return {
            passed: false,
            verdict: 'incorrect',
            feedback: 'Your expression is undefined (for example, division by zero or invalid logarithm/root domain).',
            opsUsed: budget.used,
          };
        }
      } else if (usedVars.size > 1) {
        if (
          hasMultivariateDomainHazard(lrnParsed.ast, budget) ||
          hasMultivariateDomainHazard(expParsed.ast, budget) ||
          (srcParsed && hasMultivariateDomainHazard(srcParsed.ast, budget))
        ) {
          return {
            passed: false,
            verdict: 'unsupported-or-indeterminate',
            feedback: 'Multivariate rational, logarithmic, or radical domain certification is unsupported.',
            opsUsed: budget.used,
          };
        }
      } else if (activeVar) {
        const natLrnPre = extractExpressionDomain(lrnParsed.ast, activeVar, budget);
        if (natLrnPre.certifiable && natLrnPre.domain.length === 0) {
          return {
            passed: false,
            verdict: 'incorrect',
            feedback: 'Your expression is undefined everywhere on the real numbers (check division by zero or invalid domain).',
            opsUsed: budget.used,
          };
        }
      }

      const posVars = new Set<string>();
      for (const [v, a] of Object.entries(spec.domainRestrictions?.variableAssumptions ?? {})) {
        if (a === 'positive') posVars.add(v);
      }

      // 1. Verify mathematical equivalence FIRST (before misconception checks!)
      const symResult = checkSymbolicEquivalence(lrnParsed.ast, expParsed.ast, budget, posVars);
      const policy = spec.verificationPolicy ?? 'exact-or-symbolic';
      let matchedTier: 'exact-equivalent' | 'symbolic-domain-equivalent' | 'bounded-numeric-match' | null = null;

      if (symResult === 'exact') {
        matchedTier = 'exact-equivalent';
      } else if (symResult === 'symbolic') {
        if (policy === 'exact-only') {
          return {
            passed: false,
            verdict: 'unsupported-or-indeterminate',
            feedback: 'This expression requires symbolic domain rules, which are disabled under the exact-only verification policy.',
            opsUsed: budget.used,
          };
        }
        matchedTier = 'symbolic-domain-equivalent';
      } else if (symResult === 'unsupported') {
        // ONLY allow numerical sampling when explicitly authorised by `allow-bounded-numeric`!
        if (policy === 'allow-bounded-numeric') {
          const numRes = checkBoundedNumericAgreement(lrnParsed.ast, expParsed.ast, spec.variables, budget, posVars);
          if (numRes.agreed) {
            matchedTier = 'bounded-numeric-match';
          }
        } else {
          return {
            passed: false,
            verdict: 'unsupported-or-indeterminate',
            feedback: 'This expression lies outside the supported exact/symbolic equivalence rules and cannot be certified automatically.',
            opsUsed: budget.used,
          };
        }
      }

      // 2. If NOT equivalent, check misconception rules for targeted diagnostic feedback
      if (!matchedTier) {
        if (spec.misconceptionChecks) {
          for (const rule of spec.misconceptionChecks) {
            try {
              const mAst = parseEvalExpr(rule.matchExpr, { allowedVariables: spec.variables }).ast;
              const mRes = checkSymbolicEquivalence(lrnParsed.ast, mAst, budget, posVars);
              if (mRes === 'exact' || mRes === 'symbolic') {
                return { passed: false, verdict: 'incorrect', feedback: rule.feedback, opsUsed: budget.used };
              }
            } catch {
              // ignore non-matching rule
            }
          }
        }
        return {
          passed: false,
          verdict: 'incorrect',
          feedback: 'Your expression is not mathematically equivalent to the expected result. Check signs, coefficients, and exponents.',
          opsUsed: budget.used,
        };
      }

      // 3. Rigorous Domain Verification Model (compares source, expected, learner, and assumed domains!)
      if (activeVar) {
        const v = activeVar;
        const natExp = extractExpressionDomain(expParsed.ast, v, budget);
        const natLrn = extractExpressionDomain(lrnParsed.ast, v, budget);
        const natSrc = srcParsed ? extractExpressionDomain(srcParsed.ast, v, budget) : null;

        if (!natExp.certifiable || !natLrn.certifiable || (natSrc && !natSrc.certifiable)) {
          return {
            passed: false,
            verdict: 'unsupported-or-indeterminate',
            feedback: 'Domain equivalence could not be certified for this expression class.',
            opsUsed: budget.used,
          };
        }

        const assumpDom = buildAssumedDomain(spec, v, budget);

        if (natSrc) {
          // Simplification task:
          // 1. Required source domain D_req = natSrc ∩ assumpDom must be non-empty.
          // 2. Author's reference expression must be defined throughout D_req (D_req ⊆ natExp).
          // 3. Learner may broaden natural domain (e.g. (x^2-9)/(x-3) -> x+3),
          //    provided original restrictions are preserved when required, and MUST NOT introduce
          //    any new undefined points inside D_req (D_req ⊆ natLrn).
          const requiredDom = intersectIntervalUnions(natSrc.domain, assumpDom);
          if (requiredDom.length === 0) {
            return {
              passed: false,
              verdict: 'unsupported-or-indeterminate',
              feedback: 'The required source domain under the specified assumptions is empty or contradictory.',
              opsUsed: budget.used,
            };
          }
          if (!isIntervalUnionSubset(requiredDom, natExp.domain)) {
            return {
              passed: false,
              verdict: 'unsupported-or-indeterminate',
              feedback: 'The reference expression is not defined throughout the required source domain.',
              opsUsed: budget.used,
            };
          }
          if (!isIntervalUnionSubset(requiredDom, natLrn.domain)) {
            return {
              passed: false,
              verdict: 'incorrect',
              feedback:
                'Your expression introduces an additional undefined point (removable discontinuity or invalid domain restriction) within the required domain.',
              opsUsed: budget.used,
            };
          }
        } else {
          // Pure expression equivalence task: effective domains under explicit assumptions MUST match and be non-empty!
          const effExpDom = intersectIntervalUnions(natExp.domain, assumpDom);
          const effLrnDom = intersectIntervalUnions(natLrn.domain, assumpDom);
          if (effExpDom.length === 0) {
            return {
              passed: false,
              verdict: 'unsupported-or-indeterminate',
              feedback: 'The effective reference domain under the specified assumptions is empty or contradictory.',
              opsUsed: budget.used,
            };
          }
          if (!areIntervalUnionsEqual(effExpDom, effLrnDom)) {
            return {
              passed: false,
              verdict: 'incorrect',
              feedback:
                'These expressions agree algebraically where both are defined, but they do NOT have the same real domain (check denominators, logarithms, or roots).',
              opsUsed: budget.used,
            };
          }
        }
      }

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
        const v = spec.variables[0];
        if (spec.domainRestrictions.expectedExcluded && spec.domainRestrictions.expectedExcluded.length > 0) {
          const expectedSet: BigRat[] = [];
          for (const ex of spec.domainRestrictions.expectedExcluded) {
            const parsedEx = parseExactRoot(ex, budget);
            if (parsedEx && parsedEx.kind === 'rat') expectedSet.push(parsedEx.value);
          }
          const learnerSet = parseExcludedValuesSet(rawDom, v, budget);
          if (!areExcludedSetsEqual(expectedSet, learnerSet)) {
            return {
              passed: false,
              verdict: 'wrong-form',
              feedback: `Check your excluded value(s): state the exact set of values where the original expression is undefined (no missing or extra exclusions).`,
              opsUsed: budget.used,
            };
          }
        }
        if (spec.domainRestrictions.expectedDomainInterval) {
          const expIv = parseIntervalOrInequality(spec.domainRestrictions.expectedDomainInterval, v);
          const lrnIv = parseIntervalOrInequality(rawDom, v);
          if (!areIntervalUnionsEqual(expIv, lrnIv)) {
            return {
              passed: false,
              verdict: 'wrong-form',
              feedback: 'Your expression is equivalent, but check the exact restricted domain interval.',
              opsUsed: budget.used,
            };
          }
        }
      }

      // 4. Required answer form checks (AFTER confirming equivalence!)
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
      if (spec.requiredForm === 'factored-form' && !isFullyFactoredFormAst(lrnParsed.ast, spec.variables, budget)) {
        return {
          passed: false,
          verdict: 'wrong-form',
          feedback: 'Your expression is mathematically equivalent, but factorise it completely (check for remaining quadratic factors).',
          opsUsed: budget.used,
        };
      }
      if (spec.requiredForm === 'simplified-fraction' && !isSimplifiedFractionAst(lrnParsed.ast, expParsed.ast, budget)) {
        return {
          passed: false,
          verdict: 'wrong-form',
          feedback: 'Your rational expression is equivalent, but cancel common factors to simplify the fraction.',
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
            : 'Check whether any real value can actually satisfy the original equation.',
          opsUsed: budget.used,
        };
      }

      if (solType === 'all-reals') {
        const isAll = lower === 'all reals' || lower === 'all real numbers' || lower === 'r' || lower === 'ℝ' || lower === 'identity';
        return {
          passed: isAll,
          verdict: isAll ? 'exact-equivalent' : 'incorrect',
          feedback: isAll
            ? 'Verified: this equation is an identity over all real numbers.'
            : 'Simplify both sides — is this equation true for every real number?',
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
        return { passed: false, verdict: 'syntax-error', feedback: `Too many candidate roots (max ${MATH_EVAL_LIMITS.maxCandidateRoots}).`, opsUsed: budget.used };
      }

      // Exact root parsing & deduplication (ZERO 1e-6 merging!)
      const learnerRoots: Array<{ raw: string; exact: ExactRoot }> = [];
      for (const tok of tokens) {
        const exact = parseExactRoot(tok, budget);
        if (!exact) {
          return { passed: false, verdict: 'syntax-error', feedback: `Root "${tok}" must be an exact rational or supported surd.`, opsUsed: budget.used };
        }
        if (!learnerRoots.some((x) => exactRootEqual(x.exact, exact))) {
          learnerRoots.push({ raw: tok, exact });
        }
      }

      // 1. Validate EVERY candidate root against the ORIGINAL equation
      const expectedExactRoots: ExactRoot[] = spec.expectedRoots.map((r) => parseExactRoot(r, budget)!);
      for (const cand of learnerRoots) {
        const matchesCertified = expectedExactRoots.some((er) => exactRootEqual(er, cand.exact));
        if (!matchesCertified) {
          const check = testCandidateAgainstOriginalEquation(lhsAst, rhsAst, spec.variable, exactRootToNumber(cand.exact), budget);
          const isKnownExtraneous = (spec.extraneousCandidates ?? []).some((ex) => {
            const exRoot = parseExactRoot(ex, budget);
            return exRoot !== null && exactRootEqual(exRoot, cand.exact);
          });
          return {
            passed: false,
            verdict: 'incorrect',
            feedback:
              isKnownExtraneous || check.domainError
                ? `Extraneous root detected: ${spec.variable} = ${cand.raw} does NOT satisfy the original equation (${spec.originalEquation}).`
                : `${spec.variable} = ${cand.raw} does not satisfy ${spec.originalEquation}.`,
            opsUsed: budget.used,
          };
        }
      }

      // 2. Check completeness using exactRootEqual (ZERO 1e-5 tolerance!)
      const requireComplete = spec.requireCompleteSet !== false;
      const missing = expectedExactRoots.filter((er) => !learnerRoots.some((lr) => exactRootEqual(lr.exact, er)));

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
        feedback: requireComplete
          ? `Verified: complete solution set confirmed against the original equation ${spec.originalEquation}.`
          : `Verified: your submitted root(s) satisfy the original equation ${spec.originalEquation}.`,
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
      const learner = parseIntervalOrInequality(
        submission.expression,
        spec.variable,
        spec.acceptedInputStyle ?? 'either',
      );
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
      const assumpDom = buildAssumedDomainFromRestrictions(spec.domainRestrictions, spec.variable, budget);
      const posVars = new Set<string>();
      if (spec.domainRestrictions?.variableAssumptions?.[spec.variable] === 'positive') {
        posVars.add(spec.variable);
      }

      if (spec.calculusKind === 'derivative') {
        const srcAst = parseEvalExpr(spec.sourceExpr, { allowedVariables: [spec.variable] }).ast;
        const derivedAst = differentiateAst(srcAst, spec.variable, budget);
        const lrnAst = parseEvalExpr(submission.expression, { allowedVariables: [spec.variable] }).ast;

        // Genuine symbolic comparison ONLY (NEVER numerical sampling claiming symbolic!)
        const sym = checkSymbolicEquivalence(derivedAst, lrnAst, budget, posVars);
        if (sym === 'exact' || sym === 'symbolic') {
          // Distinguish:
          // - D_src: natural domain of source expression f(x)
          // - D_deriv = D_src ∩ nat(f'(x)): domain where derivative exists
          // - D_req = D_deriv ∩ D_assump: required differentiation domain
          // - D_lrn = nat(learner): learner's derivative natural domain
          // Accept simplified derivative (e.g. d/dx(x/x) -> 0) when D_req ⊆ D_lrn,
          // while rejecting derivatives that introduce extra undefined points (e.g. d/dx(x^2) -> 2x^2/x)!
          const natSrc = extractExpressionDomain(srcAst, spec.variable, budget);
          const natDerived = extractExpressionDomain(derivedAst, spec.variable, budget);
          const natLrn = extractExpressionDomain(lrnAst, spec.variable, budget);
          if (!natSrc.certifiable || !natDerived.certifiable || !natLrn.certifiable) {
            return {
              passed: false,
              verdict: 'unsupported-or-indeterminate',
              feedback: 'Derivative domain equivalence could not be certified for this expression class.',
              opsUsed: budget.used,
            };
          }
          const derivDomain = intersectIntervalUnions(natSrc.domain, natDerived.domain);
          const requiredDiffDom = intersectIntervalUnions(derivDomain, assumpDom);
          if (requiredDiffDom.length === 0) {
            return {
              passed: false,
              verdict: 'unsupported-or-indeterminate',
              feedback: 'The required differentiation domain under the specified assumptions is empty or contradictory.',
              opsUsed: budget.used,
            };
          }
          if (!isIntervalUnionSubset(requiredDiffDom, natLrn.domain)) {
            return {
              passed: false,
              verdict: 'incorrect',
              feedback:
                'Your derivative is algebraically similar where defined, but introduces an additional undefined point within the required differentiation domain.',
              opsUsed: budget.used,
            };
          }

          // Preserve explicit learner-declared domain restrictions when required by the task
          if (spec.domainRestrictions?.requireLearnerDomain) {
            const rawDom = (submission.domainInput ?? '').trim();
            if (!rawDom) {
              return {
                passed: false,
                verdict: 'wrong-form',
                feedback: 'Your simplified derivative is correct, but you must also state the domain restriction where the derivative exists.',
                opsUsed: budget.used,
              };
            }
            if (spec.domainRestrictions.expectedExcluded && spec.domainRestrictions.expectedExcluded.length > 0) {
              const expectedSet: BigRat[] = [];
              for (const ex of spec.domainRestrictions.expectedExcluded) {
                const parsedEx = parseExactRoot(ex, budget);
                if (parsedEx && parsedEx.kind === 'rat') expectedSet.push(parsedEx.value);
              }
              const learnerSet = parseExcludedValuesSet(rawDom, spec.variable, budget);
              if (!areExcludedSetsEqual(expectedSet, learnerSet)) {
                return {
                  passed: false,
                  verdict: 'wrong-form',
                  feedback: 'Check your excluded value(s): state the exact set of values where the original function or derivative is undefined.',
                  opsUsed: budget.used,
                };
              }
            }
            if (spec.domainRestrictions.expectedDomainInterval) {
              const expIv = parseIntervalOrInequality(spec.domainRestrictions.expectedDomainInterval, spec.variable);
              const lrnIv = parseIntervalOrInequality(rawDom, spec.variable);
              if (!areIntervalUnionsEqual(expIv, lrnIv)) {
                return {
                  passed: false,
                  verdict: 'wrong-form',
                  feedback: 'Your derivative is correct, but check the exact domain interval where the derivative exists.',
                  opsUsed: budget.used,
                };
              }
            }
          }

          return {
            passed: true,
            verdict: sym === 'exact' ? 'exact-equivalent' : 'symbolic-domain-equivalent',
            feedback:
              sym === 'exact'
                ? 'Verified: exact symbolic derivative confirmed!'
                : 'Verified: symbolic derivative confirmed (trigonometric functions in radians).',
            opsUsed: budget.used,
          };
        }
        if (sym === 'unsupported') {
          return {
            passed: false,
            verdict: 'unsupported-or-indeterminate',
            feedback: 'This derivative form cannot be certified symbolically within supported rules.',
            opsUsed: budget.used,
          };
        }
        return {
          passed: false,
          verdict: 'incorrect',
          feedback: 'Check your differentiation rules (power, product, quotient, or chain rule; trig uses radians).',
          opsUsed: budget.used,
        };
      }

      // Antiderivative verification via exact differentiation of learner's F(x).
      // Limitation note (Step 5A.1): On disconnected domains such as R \ {0} (e.g. integral of 1/x = ln|x| + C),
      // the true general antiderivative allows independent constants on each connected component;
      // Step 5A.1 intentionally verifies the standard school/A-level single-constant `+ C` representation.
      const requireC = Boolean(spec.requireConstantOfIntegration);
      const lrnParsed = parseEvalExpr(submission.expression, {
        allowedVariables: [spec.variable],
        allowConstantC: true,
      });
      const srcAst = parseEvalExpr(spec.sourceExpr, { allowedVariables: [spec.variable] }).ast;
      const lrnDerivX = differentiateAst(lrnParsed.ast, spec.variable, budget);

      // Step 1: Verify d/dx(F) === sourceExpr symbolically!
      // Note: if learner wrote x^2 + C*x, d/dx = 2x + C !== 2x -> fails immediately!
      const sym = checkSymbolicEquivalence(lrnDerivX, srcAst, budget, posVars);
      if (sym === 'unsupported') {
        return {
          passed: false,
          verdict: 'unsupported-or-indeterminate',
          feedback: 'This antiderivative cannot be certified symbolically within supported rules.',
          opsUsed: budget.used,
        };
      }
      if (sym === 'not-equal') {
        return {
          passed: false,
          verdict: 'incorrect',
          feedback: 'Differentiating your answer with respect to ' + spec.variable + ' does not recover the original integrand.',
          opsUsed: budget.used,
        };
      }

      // Step 2: Check ln|x| specifically on ln(abs(x)) when requireAbsInLog is set
      if (spec.requireAbsInLog && !hasAbsInsideLnOfVar(lrnParsed.ast, spec.variable)) {
        return {
          passed: false,
          verdict: 'wrong-form',
          feedback: `Your antiderivative works for ${spec.variable} > 0, but write ln|${spec.variable}| (with absolute value bars inside ln) to cover all ${spec.variable} ≠ 0.`,
          opsUsed: budget.used,
        };
      }

      // Step 2b: Verify BOTH natural domain AND differentiability domain of learner's antiderivative
      // cover the required integration domain D_int = natIntegrand ∩ assumpDom!
      const natIntegrand = extractExpressionDomain(srcAst, spec.variable, budget);
      const natAnti = extractExpressionDomain(lrnParsed.ast, spec.variable, budget);
      const natLrnDeriv = extractExpressionDomain(lrnDerivX, spec.variable, budget);
      if (!natIntegrand.certifiable || !natAnti.certifiable || !natLrnDeriv.certifiable) {
        return {
          passed: false,
          verdict: 'unsupported-or-indeterminate',
          feedback: 'Antiderivative domain equivalence could not be certified for this expression class.',
          opsUsed: budget.used,
        };
      }
      const requiredIntDom = intersectIntervalUnions(natIntegrand.domain, assumpDom);
      if (requiredIntDom.length === 0) {
        return {
          passed: false,
          verdict: 'unsupported-or-indeterminate',
          feedback: 'The required integration domain under the specified assumptions is empty or contradictory.',
          opsUsed: budget.used,
        };
      }
      if (
        natAnti.domain.length === 0 ||
        !isIntervalUnionSubset(requiredIntDom, natAnti.domain) ||
        !isIntervalUnionSubset(requiredIntDom, natLrnDeriv.domain)
      ) {
        return {
          passed: false,
          verdict: 'incorrect',
          feedback:
            'Your antiderivative introduces an undefined or non-differentiable point within the required integration domain.',
          opsUsed: budget.used,
        };
      }

      // Step 3: Verify arbitrary constant of integration C via exact d/dC(F) === non-zero constant!
      // Rejects x^2+7 (d/dC=0), x^2+0C (d/dC=0), x^2+C-C (d/dC=0); accepts x^2+C (d/dC=1) and x^2+2C (d/dC=2)!
      if (requireC) {
        const dFdC = differentiateAst(lrnParsed.ast, 'C', budget);
        const dFdCRp = astToRationalPoly(dFdC, budget);
        const isValidNonZeroConst =
          dFdCRp !== null &&
          !polyIsZero(dFdCRp.num) &&
          polyDegree(dFdCRp.num) === 0 &&
          polyDegree(dFdCRp.den) === 0;
        if (!isValidNonZeroConst) {
          return {
            passed: false,
            verdict: 'wrong-form',
            feedback: 'You found a particular antiderivative, but the general indefinite integral requires a meaningful arbitrary constant "+ C" (not 0C or C − C).',
            opsUsed: budget.used,
          };
        }
      }

      return {
        passed: true,
        verdict: sym === 'exact' ? 'exact-equivalent' : 'symbolic-domain-equivalent',
        feedback: requireC
          ? 'Verified: general indefinite integral confirmed via exact symbolic differentiation (including valid arbitrary constant C)!'
          : 'Verified: valid particular antiderivative confirmed via exact symbolic differentiation!',
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
