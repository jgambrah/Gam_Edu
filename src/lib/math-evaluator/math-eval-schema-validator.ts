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
  type MathDomainRestrictions,
} from './math-eval-engine';

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
    mode !== 'calculus-check'
  ) {
    errors.push(
      'math-evaluator "mode" must be numeric-quantity, algebraic-expression, equation-solution, inequality-interval, or calculus-check.',
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
