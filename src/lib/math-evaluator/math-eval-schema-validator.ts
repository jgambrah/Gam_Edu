/**
 * GAM EDU — Step 5A Pure Module 7: Strict Discriminated Schema & Authoring-Time
 * Mathematical Self-Consistency Validator for `engine: 'math-evaluator'` (`1.0.0`).
 *
 * Pure TypeScript, zero React/DOM dependencies.
 */

import { MATH_EVAL_LIMITS } from './math-eval-limits';
import { parseEvalExpr } from './math-eval-parser';
import {
  certifyEquationAuthorConfig,
  normaliseIntervalUnion,
  parseEndpoint,
  type EquationClass,
} from './math-eval-domain-solutions';
import { parseUnitExpression } from './math-eval-units-precision';
import { differentiateAst } from './math-eval-exact';
import { EvalOpBudget } from './math-eval-limits';

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
]);

const VALID_LEVELS = new Set(['primary', 'lower-secondary', 'igcse', 'as-a-level']);
const VALID_EQ_CLASSES = new Set<EquationClass>([
  'linear',
  'quadratic',
  'factored-polynomial',
  'rational-linear-quadratic',
  'radical-single',
]);

function checkAllowed(rec: Record<string, unknown>, allowed: ReadonlySet<string>, ctx: string, errors: string[]) {
  for (const k of Object.keys(rec)) {
    if (!allowed.has(k)) errors.push(`Unknown field "${k}" in ${ctx}.`);
  }
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
    if (obj.unitSpec !== undefined) {
      const us = obj.unitSpec as Record<string, unknown>;
      if (!us || typeof us !== 'object' || typeof us.expectedUnit !== 'string') {
        errors.push('numeric-quantity unitSpec requires string "expectedUnit".');
      } else {
        try {
          const parsed = parseUnitExpression(us.expectedUnit);
          if ((us.expectedUnit.includes('°C') || us.expectedUnit.trim() === 'K') && !parsed.isCompound && !us.temperatureMode) {
            errors.push('numeric-quantity unitSpec using standalone °C or K must declare "temperatureMode" ("absolute" or "difference").');
          }
        } catch (e) {
          errors.push(`numeric-quantity unitSpec invalid: ${e instanceof Error ? e.message : String(e)}`);
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
    if (typeof obj.expectedExpr !== 'string' || !obj.expectedExpr.trim()) {
      errors.push('algebraic-expression requires non-empty string "expectedExpr".');
      return;
    }
    try {
      parseEvalExpr(obj.expectedExpr, { allowedVariables: vars });
      if (typeof obj.sourceExpr === 'string' && obj.sourceExpr.trim()) {
        parseEvalExpr(obj.sourceExpr, { allowedVariables: vars });
      }
    } catch (e) {
      errors.push(`algebraic-expression syntax invalid: ${e instanceof Error ? e.message : String(e)}`);
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
      errors.push('equation-solution "equationClass" must be linear, quadratic, factored-polynomial, rational-linear-quadratic, or radical-single.');
      return;
    }
    if (!Array.isArray(obj.expectedRoots) || obj.expectedRoots.some((r) => typeof r !== 'string')) {
      errors.push('equation-solution "expectedRoots" must be an array of root strings.');
      return;
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
    const ivs = obj.expectedIntervals;
    if (!Array.isArray(ivs) || ivs.length > MATH_EVAL_LIMITS.maxIntervals) {
      errors.push(`inequality-interval "expectedIntervals" must be an array of 0..${MATH_EVAL_LIMITS.maxIntervals} intervals.`);
      return;
    }
    try {
      const parsed = ivs.map((iv: Record<string, unknown>) => ({
        low: parseEndpoint(String(iv.low)),
        lowInclusive: Boolean(iv.lowInclusive),
        high: parseEndpoint(String(iv.high)),
        highInclusive: Boolean(iv.highInclusive),
      }));
      normaliseIntervalUnion(parsed);
    } catch (e) {
      errors.push(`inequality-interval expectedIntervals invalid: ${e instanceof Error ? e.message : String(e)}`);
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
  if (typeof obj.sourceExpr !== 'string' || typeof obj.expectedExpr !== 'string') {
    errors.push('calculus-check requires string "sourceExpr" and "expectedExpr".');
    return;
  }
  try {
    const src = parseEvalExpr(obj.sourceExpr, { allowedVariables: [obj.variable] });
    const exp = parseEvalExpr(obj.expectedExpr, { allowedVariables: [obj.variable], allowConstantC: true });
    const budget = new EvalOpBudget();
    if (obj.calculusKind === 'derivative') {
      differentiateAst(src.ast, obj.variable, budget);
    } else {
      differentiateAst(exp.ast, obj.variable, budget);
    }
  } catch (e) {
    errors.push(`calculus-check expression unsupported or invalid: ${e instanceof Error ? e.message : String(e)}`);
  }
}
