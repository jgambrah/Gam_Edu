/**
 * GAM EDU — Step 5A Pure Module 7: Strict Nested Discriminated Schema &
 * Authoring-Time Mathematical Self-Consistency Validator for `engine: 'math-evaluator'` (`1.0.0`).
 *
 * Enforces strict nested allowlists, ZERO string-to-boolean coercion, duplicate-variable rejection,
 * misconception-vs-expected conflict detection, and independent mathematical certification.
 */

import { EvalOpBudget, MATH_EVAL_LIMITS } from './math-eval-limits';
import { parseEvalExpr, type EvalAstNode } from './math-eval-parser';
import {
  certifyEquationAuthorConfig,
  extractExpressionDomain,
  intersectIntervalUnions,
  isIntervalUnionSubset,
  normaliseIntervalUnion,
  parseEndpoint,
  parseExactRoot,
  parseIntervalOrInequality,
  type EquationClass,
} from './math-eval-domain-solutions';
import { parseUnitExpression } from './math-eval-units-precision';
import { checkSymbolicEquivalence, differentiateAst } from './math-eval-exact';
import {
  buildAssumedDomainFromRestrictions,
  collectVarsInAst,
  solveLinearSystemExact,
  type MathDomainRestrictions,
  type MathMultiStepWorkingSpec,
} from './math-eval-engine';
import { verifyWorkingChain, type WorkingStepInput, type WorkspaceProblemKind } from './math-eval-step-verifier';

const SHARED_MATH_EVAL_KEYS = [
  'id',
  'engine',
  'schemaVersion',
  'minEngineVersion',
  'title',
  'instructions',
  'accessibilityLabel',
  'fallbackText',
  'hints',
  'persistCompletion',
  'subjectTag',
  'curriculumLevel',
  'mode',
  'promptMath',
  'prediction',
  'misconceptionChecks',
  'successExplanation',
] as const;

const NUMERIC_KEYS = new Set([
  ...SHARED_MATH_EVAL_KEYS,
  'expectedValue',
  'tolerance',
  'precisionRule',
  'requiredForm',
  'unitSpec',
]);

const ALGEBRA_KEYS = new Set([
  ...SHARED_MATH_EVAL_KEYS,
  'variables',
  'sourceExpr',
  'expectedExpr',
  'requiredForm',
  'domainRestrictions',
  'verificationPolicy',
]);

const EQUATION_KEYS = new Set([
  ...SHARED_MATH_EVAL_KEYS,
  'variable',
  'originalEquation',
  'equationClass',
  'expectedRoots',
  'solutionType',
  'requireCompleteSet',
  'extraneousCandidates',
]);

const INTERVAL_KEYS = new Set([
  ...SHARED_MATH_EVAL_KEYS,
  'variable',
  'expectedIntervals',
  'acceptedInputStyle',
]);

const CALCULUS_KEYS = new Set([
  ...SHARED_MATH_EVAL_KEYS,
  'variable',
  'calculusKind',
  'sourceExpr',
  'expectedExpr',
  'requireConstantOfIntegration',
  'requireAbsInLog',
  'domainRestrictions',
]);

const WORKSPACE_KEYS = new Set([
  ...SHARED_MATH_EVAL_KEYS,
  'learningMode',
  'problemKind',
  'variables',
  'initialStatement',
  'initialUnit',
  'keypadProfile',
  'domainRestrictions',
  'finalGoal',
  'maxWorkingSteps',
  'markingScheme',
  'workedSolutions',
]);

const SIMULTANEOUS_KEYS = new Set([
  ...SHARED_MATH_EVAL_KEYS,
  'variables',
  'equations',
  'expectedClassification',
]);

const MARKING_SCHEME_KEYS = new Set(['maxMarks', 'sharedIndependentMarks', 'strategyGroups']);
const STRATEGY_GROUP_KEYS = new Set(['id', 'label', 'marks']);
const MARK_RULE_KEYS = new Set([
  'markId',
  'type',
  'points',
  'description',
  'requiresMarkIds',
  'allowErrorCarriedForward',
  'predicate',
]);
const WORKED_SOLUTION_KEYS = new Set(['methodLabel', 'steps']);
const WORKED_STEP_KEYS = new Set(['math', 'note', 'operation', 'domainNote', 'rejectedExtraneous', 'unit']);

const VALID_LEARNING_MODES = new Set(['guided', 'independent', 'exam-practice']);
const VALID_PROBLEM_KINDS = new Set<WorkspaceProblemKind>([
  'arithmetic-numeric',
  'algebraic-simplification',
  'equation-solving',
  'inequality-solving',
  'calculus-working',
  'formula-unit',
]);
const VALID_OPERATIONS = new Set([
  'simplify',
  'rearrange',
  'factorise',
  'expand',
  'complete-square',
  'quadratic-formula',
  'substitute',
  'differentiate',
  'integrate',
  'check-candidates',
  'state-domain',
  'conclude',
]);
const VALID_MARK_TYPES = new Set(['M', 'A', 'B']);
const VALID_STEP_FORMS = new Set([
  'factored-form',
  'expanded-polynomial',
  'collected-like-terms',
  'reduced-fraction',
  'simplified-fraction',
  'simplified-surd',
  'completed-square',
]);
const VALID_PREDICATE_KINDS = new Set([
  'expression-equivalent',
  'required-form',
  'equation-equivalent',
  'certified-transition',
  'domain-restriction',
  'extraneous-rejection',
  'final-answer',
  'follow-through-step',
]);

const TOLERANCE_KEYS = new Set(['abs', 'rel']);
const PRECISION_KEYS = new Set(['kind', 'count', 'rounding']);
const UNIT_SPEC_KEYS = new Set(['expectedUnit', 'allowEquivalentUnits', 'allowedUnits', 'temperatureMode']);
const DOMAIN_KEYS = new Set(['requireLearnerDomain', 'expectedExcluded', 'expectedDomainInterval', 'variableAssumptions']);
const INTERVAL_ITEM_KEYS = new Set(['low', 'lowInclusive', 'high', 'highInclusive']);
const MISCONCEPTION_KEYS = new Set(['matchExpr', 'feedback']);
const PREDICTION_KEYS = new Set(['prompt', 'options', 'correctIndex', 'explanation']);

const VALID_LEVELS = new Set(['primary', 'lower-secondary', 'igcse', 'as-a-level']);
const VALID_EQ_CLASSES = new Set<EquationClass>([
  'linear',
  'quadratic',
  'factored-polynomial',
  'rational-linear-quadratic',
  'radical-single',
]);
const VALID_NUMERIC_FORMS = new Set(['any', 'reduced-fraction', 'decimal', 'scientific']);
const VALID_ALGEBRA_FORMS = new Set([
  'any-equivalent',
  'expanded-polynomial',
  'collected-like-terms',
  'factored-form',
  'simplified-fraction',
  'simplified-surd',
]);
const VALID_ASSUMPTIONS = new Set(['real', 'positive', 'nonzero', 'integer']);
const VALID_VERIFY_POLICIES = new Set(['exact-only', 'exact-or-symbolic', 'allow-bounded-numeric']);
const VALID_SOL_TYPES = new Set(['finite-set', 'empty-set', 'all-reals']);
const VALID_INPUT_STYLES = new Set(['inequality', 'interval', 'either']);

function checkAllowed(rec: Record<string, unknown>, allowed: ReadonlySet<string>, ctx: string, errors: string[]) {
  for (const k of Object.keys(rec)) {
    if (!allowed.has(k)) errors.push(`Unknown field "${k}" in ${ctx}.`);
  }
}

function isPlainObj(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === 'object' && !Array.isArray(v);
}

function isFiniteNonNeg(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0;
}

function validateDomainRestrictionsObject(
  rawDr: unknown,
  allowedVars: string[],
  errors: string[],
): MathDomainRestrictions | undefined {
  if (rawDr === undefined) return undefined;
  if (!isPlainObj(rawDr)) {
    errors.push('domainRestrictions must be an object.');
    return undefined;
  }
  const errCountBefore = errors.length;
  checkAllowed(rawDr, DOMAIN_KEYS, 'domainRestrictions', errors);
  if (rawDr.requireLearnerDomain !== undefined && typeof rawDr.requireLearnerDomain !== 'boolean') {
    errors.push('domainRestrictions.requireLearnerDomain must be a strict boolean.');
  }
  if (rawDr.expectedExcluded !== undefined) {
    if (!Array.isArray(rawDr.expectedExcluded) || rawDr.expectedExcluded.some((x) => typeof x !== 'string')) {
      errors.push('domainRestrictions.expectedExcluded must be an array of exact number strings.');
    } else {
      const b = new EvalOpBudget();
      for (const ex of rawDr.expectedExcluded) {
        const parsed = parseExactRoot(ex, b);
        if (!parsed || parsed.kind !== 'rat') {
          errors.push(`domainRestrictions.expectedExcluded value "${ex}" must be an exact rational number string.`);
        }
      }
    }
  }
  if (rawDr.expectedDomainInterval !== undefined) {
    if (typeof rawDr.expectedDomainInterval !== 'string' || !rawDr.expectedDomainInterval.trim()) {
      errors.push('domainRestrictions.expectedDomainInterval must be a non-empty string.');
    } else {
      try {
        parseIntervalOrInequality(rawDr.expectedDomainInterval, allowedVars[0]);
      } catch (e) {
        errors.push(`domainRestrictions.expectedDomainInterval invalid: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }
  if (rawDr.variableAssumptions !== undefined) {
    if (!isPlainObj(rawDr.variableAssumptions)) {
      errors.push('domainRestrictions.variableAssumptions must be an object.');
    } else {
      for (const [vk, vv] of Object.entries(rawDr.variableAssumptions)) {
        if (!allowedVars.includes(vk)) errors.push(`variableAssumptions references undeclared variable "${vk}".`);
        if (typeof vv !== 'string' || !VALID_ASSUMPTIONS.has(vv)) {
          errors.push(`Invalid variableAssumption "${String(vv)}" for "${vk}".`);
        }
      }
    }
  }
  if (rawDr.requireLearnerDomain === true) {
    const hasExcluded = Array.isArray(rawDr.expectedExcluded) && rawDr.expectedExcluded.length > 0;
    const hasInterval = typeof rawDr.expectedDomainInterval === 'string' && rawDr.expectedDomainInterval.trim().length > 0;
    if (!hasExcluded && !hasInterval) {
      errors.push(
        'domainRestrictions.requireLearnerDomain is true, so at least one of expectedExcluded or expectedDomainInterval must be provided.',
      );
    }
  }
  if (errors.length > errCountBefore) return undefined;
  const typed = rawDr as MathDomainRestrictions;
  // Check that author-defined assumptions themselves are not contradictory (non-empty assumed domain)
  if (allowedVars.length >= 1) {
    try {
      const b = new EvalOpBudget();
      const assumpDom = buildAssumedDomainFromRestrictions(typed, allowedVars[0], b);
      if (assumpDom.length === 0) {
        errors.push('domainRestrictions produces an empty or contradictory assumed domain.');
      }
    } catch (e) {
      errors.push(`domainRestrictions invalid: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return typed;
}

export function validateMathEvaluatorConfig(obj: Record<string, unknown>, errors: string[]): void {
  const mode = obj.mode;
  if (
    mode !== 'numeric-quantity' &&
    mode !== 'algebraic-expression' &&
    mode !== 'equation-solution' &&
    mode !== 'inequality-interval' &&
    mode !== 'calculus-check' &&
    mode !== 'multi-step-working' &&
    mode !== 'simultaneous-linear'
  ) {
    errors.push(
      'math-evaluator "mode" must be numeric-quantity, algebraic-expression, equation-solution, inequality-interval, calculus-check, multi-step-working, or simultaneous-linear.',
    );
    return;
  }

  if (typeof obj.curriculumLevel !== 'string' || !VALID_LEVELS.has(obj.curriculumLevel)) {
    errors.push('math-evaluator "curriculumLevel" must be primary, lower-secondary, igcse, or as-a-level.');
  }

  if (obj.prediction !== undefined) {
    if (!isPlainObj(obj.prediction)) {
      errors.push('math-evaluator "prediction" must be an object.');
    } else {
      checkAllowed(obj.prediction, PREDICTION_KEYS, 'prediction', errors);
      if (typeof obj.prediction.prompt !== 'string' || obj.prediction.prompt.trim().length < 4) {
        errors.push('prediction.prompt must be a non-empty string.');
      }
      if (
        !Array.isArray(obj.prediction.options) ||
        obj.prediction.options.length < 2 ||
        obj.prediction.options.length > 4 ||
        obj.prediction.options.some((o) => typeof o !== 'string' || !o.trim())
      ) {
        errors.push('prediction.options must contain 2..4 non-empty strings.');
      } else if (
        typeof obj.prediction.correctIndex !== 'number' ||
        !Number.isInteger(obj.prediction.correctIndex) ||
        obj.prediction.correctIndex < 0 ||
        obj.prediction.correctIndex >= obj.prediction.options.length
      ) {
        errors.push('prediction.correctIndex must be a valid option index.');
      }
      if (typeof obj.prediction.explanation !== 'string' || !obj.prediction.explanation.trim()) {
        errors.push('prediction.explanation must be a non-empty string.');
      }
    }
  }

  // MODE 6 (Step 5E-C): BOUNDED EXACT LINEAR SIMULTANEOUS EQUATIONS (2×2 / 3×3)
  if (mode === 'simultaneous-linear') {
    checkAllowed(obj, SIMULTANEOUS_KEYS, 'math-evaluator(simultaneous-linear)', errors);
    const vars = obj.variables;
    if (
      !Array.isArray(vars) ||
      vars.length < 2 ||
      vars.length > 3 ||
      vars.some((v) => typeof v !== 'string' || !/^[a-zA-Z]$/.test(v)) ||
      new Set(vars).size !== vars.length
    ) {
      errors.push('simultaneous-linear "variables" must be 2 or 3 distinct single-letter strings.');
      return;
    }
    const eqs = obj.equations;
    if (
      !Array.isArray(eqs) ||
      eqs.length < 2 ||
      eqs.length > 3 ||
      eqs.some((e) => typeof e !== 'string' || !e.trim())
    ) {
      errors.push('simultaneous-linear "equations" must be 2 or 3 non-empty equation strings.');
      return;
    }
    try {
      const solved = solveLinearSystemExact(eqs as string[], vars as string[]);
      if (
        obj.expectedClassification !== undefined &&
        obj.expectedClassification !== solved.classification
      ) {
        errors.push(
          `simultaneous-linear expectedClassification "${String(obj.expectedClassification)}" contradicts exact RREF solver ("${solved.classification}").`,
        );
      }
    } catch (e) {
      errors.push(`simultaneous-linear equations invalid: ${e instanceof Error ? e.message : String(e)}`);
    }
    return;
  }

  // MODE 1: NUMERIC QUANTITY
  if (mode === 'numeric-quantity') {
    checkAllowed(obj, NUMERIC_KEYS, 'math-evaluator(numeric-quantity)', errors);
    if (typeof obj.expectedValue !== 'string' || !obj.expectedValue.trim()) {
      errors.push('numeric-quantity requires a non-empty string "expectedValue".');
    } else {
      try {
        parseEvalExpr(obj.expectedValue, { allowedVariables: [] });
      } catch (e) {
        errors.push(`numeric-quantity expectedValue invalid: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    if (obj.requiredForm !== undefined && (typeof obj.requiredForm !== 'string' || !VALID_NUMERIC_FORMS.has(obj.requiredForm))) {
      errors.push('numeric-quantity requiredForm must be any, reduced-fraction, decimal, or scientific.');
    }
    if (obj.tolerance !== undefined) {
      if (!isPlainObj(obj.tolerance)) {
        errors.push('numeric-quantity tolerance must be an object.');
      } else {
        checkAllowed(obj.tolerance, TOLERANCE_KEYS, 'tolerance', errors);
        if (obj.tolerance.abs !== undefined && !isFiniteNonNeg(obj.tolerance.abs)) {
          errors.push('tolerance.abs must be a finite non-negative number.');
        }
        if (obj.tolerance.rel !== undefined && !isFiniteNonNeg(obj.tolerance.rel)) {
          errors.push('tolerance.rel must be a finite non-negative number.');
        }
      }
    }
    if (obj.precisionRule !== undefined) {
      if (!isPlainObj(obj.precisionRule)) {
        errors.push('numeric-quantity precisionRule must be an object.');
      } else {
        checkAllowed(obj.precisionRule, PRECISION_KEYS, 'precisionRule', errors);
        const pk = obj.precisionRule.kind;
        if (pk !== 'exact' && pk !== 'sig-figs' && pk !== 'decimal-places') {
          errors.push('precisionRule.kind must be exact, sig-figs, or decimal-places.');
        }
        if (pk === 'sig-figs' || pk === 'decimal-places') {
          const cnt = obj.precisionRule.count;
          if (typeof cnt !== 'number' || !Number.isInteger(cnt) || cnt < (pk === 'sig-figs' ? 1 : 0) || cnt > 12) {
            errors.push(`precisionRule.count for ${pk} must be an integer in range.`);
          }
        }
        if (
          obj.precisionRule.rounding !== undefined &&
          obj.precisionRule.rounding !== 'half-up' &&
          obj.precisionRule.rounding !== 'half-even'
        ) {
          errors.push('precisionRule.rounding must be "half-up" or "half-even".');
        }
      }
    }
    if (obj.unitSpec !== undefined) {
      if (!isPlainObj(obj.unitSpec)) {
        errors.push('numeric-quantity unitSpec must be an object.');
      } else {
        checkAllowed(obj.unitSpec, UNIT_SPEC_KEYS, 'unitSpec', errors);
        if (typeof obj.unitSpec.expectedUnit !== 'string') {
          errors.push('unitSpec.expectedUnit must be a string.');
        } else {
          try {
            const parsed = parseUnitExpression(obj.unitSpec.expectedUnit);
            if (
              (obj.unitSpec.expectedUnit.includes('°C') || obj.unitSpec.expectedUnit.trim() === 'K') &&
              !parsed.isCompound &&
              obj.unitSpec.temperatureMode !== 'absolute' &&
              obj.unitSpec.temperatureMode !== 'difference'
            ) {
              errors.push('unitSpec using standalone °C or K must declare temperatureMode ("absolute" or "difference").');
            }
          } catch (e) {
            errors.push(`unitSpec.expectedUnit invalid: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
        if (obj.unitSpec.allowEquivalentUnits !== undefined && typeof obj.unitSpec.allowEquivalentUnits !== 'boolean') {
          errors.push('unitSpec.allowEquivalentUnits must be a strict boolean.');
        }
        if (obj.unitSpec.allowedUnits !== undefined) {
          if (!Array.isArray(obj.unitSpec.allowedUnits) || obj.unitSpec.allowedUnits.some((u) => typeof u !== 'string')) {
            errors.push('unitSpec.allowedUnits must be an array of unit strings.');
          } else {
            for (const u of obj.unitSpec.allowedUnits) {
              try {
                parseUnitExpression(u);
              } catch (e) {
                errors.push(`unitSpec.allowedUnits item "${u}" invalid: ${e instanceof Error ? e.message : String(e)}`);
              }
            }
          }
        }
      }
    }
    return;
  }

  // MODE 2: ALGEBRAIC EXPRESSION
  if (mode === 'algebraic-expression') {
    checkAllowed(obj, ALGEBRA_KEYS, 'math-evaluator(algebraic-expression)', errors);
    const vars = obj.variables;
    if (
      !Array.isArray(vars) ||
      vars.length < 1 ||
      vars.length > MATH_EVAL_LIMITS.maxVariables ||
      vars.some((v) => typeof v !== 'string' || !/^[a-zA-Z]$/.test(v))
    ) {
      errors.push(`algebraic-expression "variables" must be 1..${MATH_EVAL_LIMITS.maxVariables} single-letter strings.`);
      return;
    }
    if (new Set(vars).size !== vars.length) {
      errors.push('algebraic-expression "variables" must not contain duplicates.');
      return;
    }
    if (obj.requiredForm !== undefined && (typeof obj.requiredForm !== 'string' || !VALID_ALGEBRA_FORMS.has(obj.requiredForm))) {
      errors.push('algebraic-expression requiredForm is invalid.');
    }
    if (
      obj.verificationPolicy !== undefined &&
      (typeof obj.verificationPolicy !== 'string' || !VALID_VERIFY_POLICIES.has(obj.verificationPolicy))
    ) {
      errors.push('algebraic-expression verificationPolicy must be exact-only, exact-or-symbolic, or allow-bounded-numeric.');
    }
    if (typeof obj.expectedExpr !== 'string' || !obj.expectedExpr.trim()) {
      errors.push('algebraic-expression requires non-empty string "expectedExpr".');
      return;
    }
    let expAst: EvalAstNode;
    let srcAst: EvalAstNode | null = null;
    try {
      expAst = parseEvalExpr(obj.expectedExpr, { allowedVariables: vars }).ast;
      if (obj.sourceExpr !== undefined) {
        if (typeof obj.sourceExpr !== 'string' || !obj.sourceExpr.trim()) {
          errors.push('algebraic-expression "sourceExpr" must be a non-empty string when provided.');
        } else {
          srcAst = parseEvalExpr(obj.sourceExpr, { allowedVariables: vars }).ast;
        }
      }
    } catch (e) {
      errors.push(`algebraic-expression syntax invalid: ${e instanceof Error ? e.message : String(e)}`);
      return;
    }

    const errCountBeforeDr = errors.length;
    const validatedDr = validateDomainRestrictionsObject(obj.domainRestrictions, vars, errors);

    // Authoring-time source/reference mathematical equivalence & effective-domain consistency
    if (errors.length === errCountBeforeDr) {
      const b = new EvalOpBudget();
      const posVars = new Set<string>();
      for (const [vk, vv] of Object.entries(validatedDr?.variableAssumptions ?? {})) {
        if (vv === 'positive') posVars.add(vk);
      }

      const usedVars = new Set<string>();
      collectVarsInAst(expAst, usedVars);
      if (srcAst) collectVarsInAst(srcAst, usedVars);
      const activeVar = usedVars.size === 1 ? Array.from(usedVars)[0] : vars.length === 1 ? vars[0] : null;

      if (srcAst) {
        // 1. Source and reference must not be provably inconsistent (unsupported remains indeterminate)
        const srcExpEq = checkSymbolicEquivalence(srcAst, expAst, b, posVars);
        if (srcExpEq === 'not-equal') {
          errors.push(
            `algebraic-expression sourceExpr "${obj.sourceExpr}" and expectedExpr "${obj.expectedExpr}" are not mathematically equivalent.`,
          );
        }

        // 2. For certifiable univariate expressions, verify D_req = natSrc ∩ assumpDom is non-empty
        //    and reference expression is defined throughout D_req (D_req ⊆ natExp).
        if (activeVar) {
          const natSrc = extractExpressionDomain(srcAst, activeVar, b);
          const natExp = extractExpressionDomain(expAst, activeVar, b);
          const assumpDom = buildAssumedDomainFromRestrictions(validatedDr, activeVar, b);
          if (natSrc.certifiable) {
            const requiredDom = intersectIntervalUnions(natSrc.domain, assumpDom);
            if (requiredDom.length === 0) {
              errors.push(
                'algebraic-expression required source domain under domainRestrictions is empty or contradictory.',
              );
            } else if (natExp.certifiable && !isIntervalUnionSubset(requiredDom, natExp.domain)) {
              errors.push(
                `algebraic-expression expectedExpr "${obj.expectedExpr}" introduces additional undefined points within the required source domain.`,
              );
            }
          }
        }
      } else if (activeVar) {
        // Pure equivalence task: ensure effective domain of expectedExpr under assumptions is non-empty
        const natExp = extractExpressionDomain(expAst, activeVar, b);
        if (natExp.certifiable) {
          const assumpDom = buildAssumedDomainFromRestrictions(validatedDr, activeVar, b);
          const effExpDom = intersectIntervalUnions(natExp.domain, assumpDom);
          if (effExpDom.length === 0) {
            errors.push('algebraic-expression effective reference domain under domainRestrictions is empty or contradictory.');
          }
        }
      }
    }

    // Validate misconceptionChecks & reject any rule equivalent to expectedExpr!
    if (obj.misconceptionChecks !== undefined) {
      if (!Array.isArray(obj.misconceptionChecks)) {
        errors.push('misconceptionChecks must be an array.');
      } else {
        const b = new EvalOpBudget();
        for (let i = 0; i < obj.misconceptionChecks.length; i++) {
          const item = obj.misconceptionChecks[i];
          if (!isPlainObj(item)) {
            errors.push(`misconceptionChecks[${i}] must be an object.`);
            continue;
          }
          checkAllowed(item, MISCONCEPTION_KEYS, `misconceptionChecks[${i}]`, errors);
          if (typeof item.matchExpr !== 'string' || typeof item.feedback !== 'string' || !item.feedback.trim()) {
            errors.push(`misconceptionChecks[${i}] requires string matchExpr and feedback.`);
            continue;
          }
          try {
            const mAst = parseEvalExpr(item.matchExpr, { allowedVariables: vars }).ast;
            const eq = checkSymbolicEquivalence(mAst, expAst, b);
            if (eq === 'exact' || eq === 'symbolic') {
              errors.push(`misconceptionChecks[${i}].matchExpr "${item.matchExpr}" conflicts with expectedExpr "${obj.expectedExpr}".`);
            }
          } catch (e) {
            errors.push(`misconceptionChecks[${i}].matchExpr invalid: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
      }
    }
    return;
  }

  // MODE 3: EQUATION SOLUTION
  if (mode === 'equation-solution') {
    checkAllowed(obj, EQUATION_KEYS, 'math-evaluator(equation-solution)', errors);
    if (typeof obj.variable !== 'string' || !/^[a-zA-Z]$/.test(obj.variable)) {
      errors.push('equation-solution "variable" must be a single-letter string.');
      return;
    }
    if (typeof obj.originalEquation !== 'string' || !obj.originalEquation.includes('=')) {
      errors.push('equation-solution requires "originalEquation" containing "=".');
      return;
    }
    if (typeof obj.equationClass !== 'string' || !VALID_EQ_CLASSES.has(obj.equationClass as EquationClass)) {
      errors.push('equation-solution "equationClass" is invalid.');
      return;
    }
    if (obj.solutionType !== undefined && (typeof obj.solutionType !== 'string' || !VALID_SOL_TYPES.has(obj.solutionType))) {
      errors.push('equation-solution "solutionType" must be finite-set, empty-set, or all-reals.');
      return;
    }
    if (obj.requireCompleteSet !== undefined && typeof obj.requireCompleteSet !== 'boolean') {
      errors.push('equation-solution "requireCompleteSet" must be a strict boolean.');
    }
    if (!Array.isArray(obj.expectedRoots) || obj.expectedRoots.some((r) => typeof r !== 'string')) {
      errors.push('equation-solution "expectedRoots" must be an array of root strings.');
      return;
    }
    if (
      obj.extraneousCandidates !== undefined &&
      (!Array.isArray(obj.extraneousCandidates) || obj.extraneousCandidates.some((r) => typeof r !== 'string'))
    ) {
      errors.push('equation-solution "extraneousCandidates" must be an array of strings.');
    }
    const certErrors = certifyEquationAuthorConfig(
      obj.originalEquation,
      obj.variable,
      obj.equationClass as EquationClass,
      obj.expectedRoots as string[],
      (obj.solutionType as 'finite-set' | 'empty-set' | 'all-reals' | undefined) ?? 'finite-set',
    );
    errors.push(...certErrors);
    return;
  }

  // MODE 4: INEQUALITY / INTERVAL
  if (mode === 'inequality-interval') {
    checkAllowed(obj, INTERVAL_KEYS, 'math-evaluator(inequality-interval)', errors);
    if (typeof obj.variable !== 'string' || !/^[a-zA-Z]$/.test(obj.variable)) {
      errors.push('inequality-interval "variable" must be a single-letter string.');
      return;
    }
    if (
      obj.acceptedInputStyle !== undefined &&
      (typeof obj.acceptedInputStyle !== 'string' || !VALID_INPUT_STYLES.has(obj.acceptedInputStyle))
    ) {
      errors.push('inequality-interval "acceptedInputStyle" must be inequality, interval, or either.');
    }
    const ivs = obj.expectedIntervals;
    if (!Array.isArray(ivs) || ivs.length > MATH_EVAL_LIMITS.maxIntervals) {
      errors.push(`inequality-interval "expectedIntervals" must be an array of 0..${MATH_EVAL_LIMITS.maxIntervals} intervals.`);
      return;
    }
    const parsedIvs = [];
    for (let i = 0; i < ivs.length; i++) {
      const iv = ivs[i];
      if (!isPlainObj(iv)) {
        errors.push(`expectedIntervals[${i}] must be an object.`);
        continue;
      }
      checkAllowed(iv, INTERVAL_ITEM_KEYS, `expectedIntervals[${i}]`, errors);
      if (typeof iv.low !== 'string' || typeof iv.high !== 'string') {
        errors.push(`expectedIntervals[${i}] low and high must be strings.`);
        continue;
      }
      if (typeof iv.lowInclusive !== 'boolean' || typeof iv.highInclusive !== 'boolean') {
        errors.push(`expectedIntervals[${i}] lowInclusive and highInclusive must be strict booleans (no string coercion).`);
        continue;
      }
      try {
        parsedIvs.push({
          low: parseEndpoint(iv.low),
          lowInclusive: iv.lowInclusive,
          high: parseEndpoint(iv.high),
          highInclusive: iv.highInclusive,
        });
      } catch (e) {
        errors.push(`expectedIntervals[${i}] endpoint invalid: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    if (errors.length === 0) {
      try {
        normaliseIntervalUnion(parsedIvs);
      } catch (e) {
        errors.push(`expectedIntervals invalid: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    return;
  }

  // MODE 6: MULTI-STEP WORKING WORKSPACE (Step 5A.2 — requires minEngineVersion >= 1.1.0)
  if (mode === 'multi-step-working') {
    validateMultiStepWorkingConfig(obj, errors);
    return;
  }

  // MODE 5: CALCULUS CHECK
  checkAllowed(obj, CALCULUS_KEYS, 'math-evaluator(calculus-check)', errors);
  if (typeof obj.variable !== 'string' || !/^[a-zA-Z]$/.test(obj.variable)) {
    errors.push('calculus-check "variable" must be a single-letter string.');
    return;
  }
  if (obj.calculusKind !== 'derivative' && obj.calculusKind !== 'antiderivative') {
    errors.push('calculus-check "calculusKind" must be "derivative" or "antiderivative".');
    return;
  }
  if (obj.requireConstantOfIntegration !== undefined && typeof obj.requireConstantOfIntegration !== 'boolean') {
    errors.push('calculus-check "requireConstantOfIntegration" must be a strict boolean.');
  }
  if (obj.requireAbsInLog !== undefined && typeof obj.requireAbsInLog !== 'boolean') {
    errors.push('calculus-check "requireAbsInLog" must be a strict boolean.');
  }
  if (typeof obj.sourceExpr !== 'string' || typeof obj.expectedExpr !== 'string') {
    errors.push('calculus-check requires string "sourceExpr" and "expectedExpr".');
    return;
  }
  const validatedCalcDr = validateDomainRestrictionsObject(obj.domainRestrictions, [obj.variable], errors);
  try {
    const src = parseEvalExpr(obj.sourceExpr, { allowedVariables: [obj.variable] });
    const exp = parseEvalExpr(obj.expectedExpr, { allowedVariables: [obj.variable], allowConstantC: true });
    const budget = new EvalOpBudget();
    const posVars = new Set<string>();
    if (validatedCalcDr?.variableAssumptions?.[obj.variable] === 'positive') {
      posVars.add(obj.variable);
    }
    const assumpDom = buildAssumedDomainFromRestrictions(validatedCalcDr, obj.variable, budget);
    if (obj.calculusKind === 'derivative') {
      const derived = differentiateAst(src.ast, obj.variable, budget);
      const eq = checkSymbolicEquivalence(derived, exp.ast, budget, posVars);
      if (eq !== 'exact' && eq !== 'symbolic') {
        errors.push(`calculus-check expectedExpr "${obj.expectedExpr}" does not match symbolic derivative of "${obj.sourceExpr}".`);
      } else {
        const natSrc = extractExpressionDomain(src.ast, obj.variable, budget);
        const natDerived = extractExpressionDomain(derived, obj.variable, budget);
        const natExp = extractExpressionDomain(exp.ast, obj.variable, budget);
        if (natSrc.certifiable && natDerived.certifiable) {
          const requiredDiffDom = intersectIntervalUnions(intersectIntervalUnions(natSrc.domain, natDerived.domain), assumpDom);
          if (requiredDiffDom.length === 0) {
            errors.push('calculus-check required differentiation domain is empty or contradictory.');
          } else if (natExp.certifiable && !isIntervalUnionSubset(requiredDiffDom, natExp.domain)) {
            errors.push(
              `calculus-check expectedExpr "${obj.expectedExpr}" introduces additional undefined points within the required differentiation domain.`,
            );
          }
        }
      }
    } else {
      const dExp = differentiateAst(exp.ast, obj.variable, budget);
      const eq = checkSymbolicEquivalence(dExp, src.ast, budget, posVars);
      if (eq !== 'exact' && eq !== 'symbolic') {
        errors.push(`calculus-check expectedExpr "${obj.expectedExpr}" does not differentiate back to "${obj.sourceExpr}".`);
      } else {
        const natIntegrand = extractExpressionDomain(src.ast, obj.variable, budget);
        const natExp = extractExpressionDomain(exp.ast, obj.variable, budget);
        const natExpDeriv = extractExpressionDomain(dExp, obj.variable, budget);
        if (natIntegrand.certifiable) {
          const requiredIntDom = intersectIntervalUnions(natIntegrand.domain, assumpDom);
          if (requiredIntDom.length === 0) {
            errors.push('calculus-check required integration domain is empty or contradictory.');
          } else if (
            (natExp.certifiable && !isIntervalUnionSubset(requiredIntDom, natExp.domain)) ||
            (natExpDeriv.certifiable && !isIntervalUnionSubset(requiredIntDom, natExpDeriv.domain))
          ) {
            errors.push(
              `calculus-check expectedExpr "${obj.expectedExpr}" is undefined or non-differentiable within the required integration domain.`,
            );
          }
        }
      }
    }
  } catch (e) {
    errors.push(`calculus-check expression unsupported or invalid: ${e instanceof Error ? e.message : String(e)}`);
  }
}

function validateMarkRuleList(
  rawRules: unknown,
  ctx: string,
  allowedVars: string[],
  knownIds: Set<string>,
  errors: string[],
): { rules: Array<{ markId: string; points: number; requiresMarkIds: string[] }>; totalPoints: number } {
  const rules: Array<{ markId: string; points: number; requiresMarkIds: string[] }> = [];
  let totalPoints = 0;
  if (!Array.isArray(rawRules)) {
    errors.push(`${ctx} must be an array.`);
    return { rules, totalPoints };
  }
  const localIds = new Set<string>();
  for (let i = 0; i < rawRules.length; i++) {
    const r = rawRules[i];
    if (!isPlainObj(r)) {
      errors.push(`${ctx}[${i}] must be an object.`);
      continue;
    }
    checkAllowed(r, MARK_RULE_KEYS, `${ctx}[${i}]`, errors);
    if (typeof r.markId !== 'string' || !/^[A-Za-z0-9_-]{1,24}$/.test(r.markId)) {
      errors.push(`${ctx}[${i}].markId must be a valid identifier (1..24 chars).`);
      continue;
    }
    if (localIds.has(r.markId) || knownIds.has(r.markId)) {
      errors.push(`Duplicate markId "${r.markId}" in ${ctx}[${i}].`);
      continue;
    }
    localIds.add(r.markId);

    if (typeof r.type !== 'string' || !VALID_MARK_TYPES.has(r.type)) {
      errors.push(`${ctx}[${i}].type must be M, A, or B.`);
    }
    if (typeof r.points !== 'number' || !Number.isFinite(r.points) || !Number.isInteger(r.points) || r.points < 1 || r.points > 10) {
      errors.push(`${ctx}[${i}].points must be a positive integer (1..10).`);
    } else {
      totalPoints += r.points;
    }
    if (typeof r.description !== 'string' || r.description.trim().length < 4) {
      errors.push(`${ctx}[${i}].description must be a non-empty string.`);
    }
    if (r.allowErrorCarriedForward !== undefined && typeof r.allowErrorCarriedForward !== 'boolean') {
      errors.push(`${ctx}[${i}].allowErrorCarriedForward must be a strict boolean.`);
    }
    const reqs: string[] = [];
    if (r.requiresMarkIds !== undefined) {
      if (!Array.isArray(r.requiresMarkIds) || r.requiresMarkIds.some((x) => typeof x !== 'string')) {
        errors.push(`${ctx}[${i}].requiresMarkIds must be an array of markId strings.`);
      } else {
        reqs.push(...(r.requiresMarkIds as string[]));
      }
    }

    // Validate predicate strictly
    if (!isPlainObj(r.predicate)) {
      errors.push(`${ctx}[${i}].predicate must be an object.`);
    } else {
      const p = r.predicate;
      if (typeof p.kind !== 'string' || !VALID_PREDICATE_KINDS.has(p.kind)) {
        errors.push(`${ctx}[${i}].predicate.kind "${String(p.kind)}" is unsupported.`);
      } else if (p.kind === 'expression-equivalent') {
        if (typeof p.targetExpr !== 'string' || !p.targetExpr.trim()) {
          errors.push(`${ctx}[${i}].predicate.targetExpr must be a non-empty string.`);
        } else {
          try {
            parseEvalExpr(p.targetExpr, { allowedVariables: allowedVars });
          } catch (e) {
            errors.push(`${ctx}[${i}].predicate.targetExpr invalid: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
      } else if (p.kind === 'required-form') {
        if (typeof p.targetExpr !== 'string' || !p.targetExpr.trim()) {
          errors.push(`${ctx}[${i}].predicate.targetExpr must be a non-empty string.`);
        } else {
          try {
            parseEvalExpr(p.targetExpr, { allowedVariables: allowedVars });
          } catch (e) {
            errors.push(`${ctx}[${i}].predicate.targetExpr invalid: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
        if (typeof p.form !== 'string' || !VALID_STEP_FORMS.has(p.form)) {
          errors.push(`${ctx}[${i}].predicate.form is invalid.`);
        }
      } else if (p.kind === 'equation-equivalent') {
        if (typeof p.targetEquation !== 'string' || !p.targetEquation.includes('=')) {
          errors.push(`${ctx}[${i}].predicate.targetEquation must contain "=".`);
        }
        if (
          p.requiredForm !== undefined &&
          p.requiredForm !== 'factored-form' &&
          p.requiredForm !== 'completed-square' &&
          p.requiredForm !== 'expanded-polynomial'
        ) {
          errors.push(`${ctx}[${i}].predicate.requiredForm is invalid.`);
        }
      } else if (p.kind === 'extraneous-rejection') {
        if (!Array.isArray(p.expectedRejected) || p.expectedRejected.length === 0 || p.expectedRejected.some((x) => typeof x !== 'string')) {
          errors.push(`${ctx}[${i}].predicate.expectedRejected must be a non-empty array of root strings.`);
        }
      } else if (p.kind === 'domain-restriction') {
        const hasEx = Array.isArray(p.expectedExcluded) && p.expectedExcluded.length > 0;
        const hasIv = typeof p.expectedDomainInterval === 'string' && p.expectedDomainInterval.trim().length > 0;
        if (!hasEx && !hasIv) {
          errors.push(`${ctx}[${i}].predicate(domain-restriction) requires expectedExcluded or expectedDomainInterval.`);
        }
      } else if (p.kind === 'follow-through-step') {
        if (r.allowErrorCarriedForward !== true) {
          errors.push(`${ctx}[${i}] uses follow-through-step predicate without allowErrorCarriedForward: true.`);
        }
      }
    }

    rules.push({ markId: r.markId, points: typeof r.points === 'number' ? r.points : 0, requiresMarkIds: reqs });
  }

  // Validate requiresMarkIds references & detect cycles (DFS 3-colouring)
  const allVisible = new Set<string>([...knownIds, ...localIds]);
  const depMap = new Map<string, string[]>();
  for (const r of rules) {
    depMap.set(r.markId, r.requiresMarkIds);
    for (const req of r.requiresMarkIds) {
      if (!allVisible.has(req)) {
        errors.push(`Mark "${r.markId}" in ${ctx} references unknown prerequisite "${req}".`);
      }
      if (req === r.markId) {
        errors.push(`Mark "${r.markId}" in ${ctx} cannot depend on itself.`);
      }
    }
  }

  const state = new Map<string, 0 | 1 | 2>(); // 0=unvisited, 1=visiting, 2=done
  const hasCycle = (id: string): boolean => {
    const st = state.get(id) ?? 0;
    if (st === 1) return true;
    if (st === 2) return false;
    state.set(id, 1);
    for (const dep of depMap.get(id) ?? []) {
      if (depMap.has(dep) && hasCycle(dep)) return true;
    }
    state.set(id, 2);
    return false;
  };
  for (const r of rules) {
    if (hasCycle(r.markId)) {
      errors.push(`Cyclic mark dependency detected involving "${r.markId}" in ${ctx}.`);
      break;
    }
  }

  return { rules, totalPoints };
}

function validateMultiStepWorkingConfig(obj: Record<string, unknown>, errors: string[]): void {
  checkAllowed(obj, WORKSPACE_KEYS, 'math-evaluator(multi-step-working)', errors);

  if (typeof obj.learningMode !== 'string' || !VALID_LEARNING_MODES.has(obj.learningMode)) {
    errors.push('multi-step-working "learningMode" must be guided, independent, or exam-practice.');
  }
  if (typeof obj.problemKind !== 'string' || !VALID_PROBLEM_KINDS.has(obj.problemKind as WorkspaceProblemKind)) {
    errors.push('multi-step-working "problemKind" is invalid.');
  }
  const vars = obj.variables;
  if (
    !Array.isArray(vars) ||
    vars.length > MATH_EVAL_LIMITS.maxVariables ||
    vars.some((v) => typeof v !== 'string' || !/^[a-zA-Z]$/.test(v))
  ) {
    errors.push(`multi-step-working "variables" must be 0..${MATH_EVAL_LIMITS.maxVariables} single-letter strings.`);
    return;
  }
  if (new Set(vars).size !== vars.length) {
    errors.push('multi-step-working "variables" must not contain duplicates.');
    return;
  }
  if (typeof obj.initialStatement !== 'string' || !obj.initialStatement.trim()) {
    errors.push('multi-step-working requires non-empty string "initialStatement".');
    return;
  }
  if (obj.initialUnit !== undefined) {
    if (typeof obj.initialUnit !== 'string' || !obj.initialUnit.trim()) {
      errors.push('multi-step-working "initialUnit" must be a non-empty string.');
    } else {
      try {
        parseUnitExpression(obj.initialUnit);
      } catch (e) {
        errors.push(`multi-step-working initialUnit invalid: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }
  if (obj.keypadProfile !== undefined && (typeof obj.keypadProfile !== 'string' || !VALID_LEVELS.has(obj.keypadProfile))) {
    errors.push('multi-step-working "keypadProfile" must be primary, lower-secondary, igcse, or as-a-level.');
  }
  if (obj.maxWorkingSteps !== undefined) {
    if (
      typeof obj.maxWorkingSteps !== 'number' ||
      !Number.isInteger(obj.maxWorkingSteps) ||
      obj.maxWorkingSteps < 1 ||
      obj.maxWorkingSteps > MATH_EVAL_LIMITS.maxWorkingSteps
    ) {
      errors.push(`multi-step-working "maxWorkingSteps" must be an integer 1..${MATH_EVAL_LIMITS.maxWorkingSteps}.`);
    }
  }

  validateDomainRestrictionsObject(obj.domainRestrictions, vars as string[], errors);

  // Validate nested finalGoal (must be one of the 5 Step 5A.1 modes — never recursive multi-step-working!)
  if (!isPlainObj(obj.finalGoal)) {
    errors.push('multi-step-working requires a valid "finalGoal" object.');
    return;
  }
  if (obj.finalGoal.mode === 'multi-step-working') {
    errors.push('multi-step-working "finalGoal" cannot recursively use mode "multi-step-working".');
    return;
  }
  const fgErrors: string[] = [];
  validateMathEvaluatorConfig(
    {
      ...obj.finalGoal,
      id: `${String(obj.id ?? 'ws')}_goal`,
      engine: 'math-evaluator',
      schemaVersion: 1,
      title: 'Final Goal',
      instructions: 'Final goal validation',
      accessibilityLabel: 'Final goal',
      fallbackText: 'Final goal',
      curriculumLevel: typeof obj.curriculumLevel === 'string' ? obj.curriculumLevel : 'igcse',
    },
    fgErrors,
  );
  for (const e of fgErrors) errors.push(`finalGoal: ${e}`);

  // Validate optional markingScheme
  if (obj.markingScheme !== undefined) {
    if (!isPlainObj(obj.markingScheme)) {
      errors.push('multi-step-working "markingScheme" must be an object.');
    } else {
      const ms = obj.markingScheme;
      checkAllowed(ms, MARKING_SCHEME_KEYS, 'markingScheme', errors);
      if (typeof ms.maxMarks !== 'number' || !Number.isInteger(ms.maxMarks) || ms.maxMarks < 1 || ms.maxMarks > 20) {
        errors.push('markingScheme.maxMarks must be an integer 1..20.');
      }
      const sharedIds = new Set<string>();
      let sharedPoints = 0;
      if (ms.sharedIndependentMarks !== undefined) {
        if (!Array.isArray(ms.sharedIndependentMarks) || ms.sharedIndependentMarks.length > MATH_EVAL_LIMITS.maxSharedIndependentMarks) {
          errors.push(`markingScheme.sharedIndependentMarks must be an array of at most ${MATH_EVAL_LIMITS.maxSharedIndependentMarks} rules.`);
        } else {
          const sr = validateMarkRuleList(ms.sharedIndependentMarks, 'markingScheme.sharedIndependentMarks', vars as string[], new Set(), errors);
          sharedPoints = sr.totalPoints;
          for (const r of sr.rules) sharedIds.add(r.markId);
        }
      }
      if (!Array.isArray(ms.strategyGroups) || ms.strategyGroups.length < 1 || ms.strategyGroups.length > MATH_EVAL_LIMITS.maxMarkingStrategies) {
        errors.push(`markingScheme.strategyGroups must contain 1..${MATH_EVAL_LIMITS.maxMarkingStrategies} strategies.`);
      } else {
        const stratIds = new Set<string>();
        for (let si = 0; si < ms.strategyGroups.length; si++) {
          const sg = ms.strategyGroups[si];
          if (!isPlainObj(sg)) {
            errors.push(`markingScheme.strategyGroups[${si}] must be an object.`);
            continue;
          }
          checkAllowed(sg, STRATEGY_GROUP_KEYS, `markingScheme.strategyGroups[${si}]`, errors);
          if (typeof sg.id !== 'string' || !sg.id.trim()) {
            errors.push(`markingScheme.strategyGroups[${si}].id must be a non-empty string.`);
          } else if (stratIds.has(sg.id)) {
            errors.push(`Duplicate strategy group id "${sg.id}".`);
          } else {
            stratIds.add(sg.id);
          }
          if (typeof sg.label !== 'string' || !sg.label.trim()) {
            errors.push(`markingScheme.strategyGroups[${si}].label must be a non-empty string.`);
          }
          if (!Array.isArray(sg.marks) || sg.marks.length < 1 || sg.marks.length > MATH_EVAL_LIMITS.maxMarkingRulesPerStrategy) {
            errors.push(`markingScheme.strategyGroups[${si}].marks must have 1..${MATH_EVAL_LIMITS.maxMarkingRulesPerStrategy} rules.`);
          } else {
            const sr = validateMarkRuleList(sg.marks, `markingScheme.strategyGroups[${si}].marks`, vars as string[], sharedIds, errors);
            if (typeof ms.maxMarks === 'number' && sharedPoints + sr.totalPoints > ms.maxMarks) {
              errors.push(
                `markingScheme.strategyGroups[${si}] (${sharedPoints + sr.totalPoints} pts including shared marks) exceeds maxMarks (${ms.maxMarks}).`,
              );
            }
          }
        }
      }
    }
  }

  // Validate workedSolutions (1..4 model solutions, each verified against step verifier under cumulative budget!)
  if (
    !Array.isArray(obj.workedSolutions) ||
    obj.workedSolutions.length < 1 ||
    obj.workedSolutions.length > MATH_EVAL_LIMITS.maxWorkedSolutions
  ) {
    errors.push(`multi-step-working requires 1..${MATH_EVAL_LIMITS.maxWorkedSolutions} workedSolutions.`);
    return;
  }

  const cumulativeBudget = new EvalOpBudget(MATH_EVAL_LIMITS.maxTotalWorkspaceOps);
  for (let wi = 0; wi < obj.workedSolutions.length; wi++) {
    const ws = obj.workedSolutions[wi];
    if (!isPlainObj(ws)) {
      errors.push(`workedSolutions[${wi}] must be an object.`);
      continue;
    }
    checkAllowed(ws, WORKED_SOLUTION_KEYS, `workedSolutions[${wi}]`, errors);
    if (typeof ws.methodLabel !== 'string' || !ws.methodLabel.trim()) {
      errors.push(`workedSolutions[${wi}].methodLabel must be a non-empty string.`);
    }
    if (
      !Array.isArray(ws.steps) ||
      ws.steps.length < 1 ||
      ws.steps.length > MATH_EVAL_LIMITS.maxWorkedStepsPerSolution
    ) {
      errors.push(`workedSolutions[${wi}].steps must have 1..${MATH_EVAL_LIMITS.maxWorkedStepsPerSolution} steps.`);
      continue;
    }
    const modelSteps: WorkingStepInput[] = [];
    for (let si = 0; si < ws.steps.length; si++) {
      const st = ws.steps[si];
      if (!isPlainObj(st)) {
        errors.push(`workedSolutions[${wi}].steps[${si}] must be an object.`);
        continue;
      }
      checkAllowed(st, WORKED_STEP_KEYS, `workedSolutions[${wi}].steps[${si}]`, errors);
      if (typeof st.math !== 'string' || !st.math.trim()) {
        errors.push(`workedSolutions[${wi}].steps[${si}].math must be a non-empty string.`);
      }
      if (typeof st.note !== 'string' || !st.note.trim()) {
        errors.push(`workedSolutions[${wi}].steps[${si}].note must be a non-empty string.`);
      }
      if (st.operation !== undefined && (typeof st.operation !== 'string' || !VALID_OPERATIONS.has(st.operation))) {
        errors.push(`workedSolutions[${wi}].steps[${si}].operation is invalid.`);
      }
      modelSteps.push({
        math: typeof st.math === 'string' ? st.math : '',
        operation: st.operation as WorkingStepInput['operation'],
        domainNote: typeof st.domainNote === 'string' ? st.domainNote : undefined,
        rejectedExtraneous: Array.isArray(st.rejectedExtraneous) ? (st.rejectedExtraneous as string[]) : undefined,
        unit: typeof st.unit === 'string' ? st.unit : undefined,
      });
    }

    // Verify author model solution is not provably invalid (indeterminate allowed for unsupported classes!)
    if (errors.length === 0 && modelSteps.length > 0) {
      const typedSpec = obj as unknown as MathMultiStepWorkingSpec;
      const chain = verifyWorkingChain(
        {
          problemKind: typedSpec.problemKind,
          variables: typedSpec.variables,
          initialStatement: typedSpec.initialStatement,
          initialUnit: typedSpec.initialUnit,
          domainRestrictions: typedSpec.domainRestrictions,
          finalGoal: typedSpec.finalGoal,
        },
        modelSteps,
        cumulativeBudget,
      );
      if (chain.hasInvalidStep) {
        errors.push(
          `workedSolutions[${wi}] ("${String(ws.methodLabel)}") contains a provably invalid mathematical step at index ${chain.earliestErrorIndex}.`,
        );
      }
    }
  }
}
