/**
 * GAM EDU — Step 5E-C Pure Module: Bounded Exact Linear Simultaneous Equations (2×2 and 3×3)
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies, zero eval().
 * Uses exact BigInt rational arithmetic (`BigRat`) Reduced Row Echelon Form (RREF)
 * Gaussian elimination — ZERO floating-point tolerance hacks.
 *
 * Supports:
 * - 2×2 and 3×3 linear systems over Q (exact integer, decimal, and fractional coefficients)
 * - Exact classification: `'unique'`, `'no-solution'` (inconsistent), `'infinitely-many'` (dependent)
 * - Independent substitution back into all original equations to certify solutions
 * - Substitution / elimination working lines + assignment (`x = 2, y = -1/3`) or tuple (`(2, -1/3)`) input
 */

import { EvalOpBudget, MathEvalLimitError } from './math-eval-limits';
import { parseEvalExpr, type EvalAstNode } from './math-eval-parser';
import {
  RAT_ONE,
  RAT_ZERO,
  decimalStringToBigRat,
  ratAdd,
  ratDiv,
  ratEq,
  ratMul,
  ratNeg,
  ratSub,
  type BigRat,
} from './math-eval-exact';
import { splitEquation } from './math-eval-domain-solutions';

export const LINEAR_SYSTEM_LIMITS = {
  minVariables: 2,
  maxVariables: 3,
  minEquations: 2,
  maxEquations: 3,
  maxWorkingLines: 12,
} as const;

export type LinearSystemClassification = 'unique' | 'no-solution' | 'infinitely-many';

export interface LinearEquationRow {
  /** Coefficients aligned with `variables` order */
  coeffs: BigRat[];
  /** Right-hand side constant `b` in `a_1 x_1 + ... + a_k x_k = b` */
  rhs: BigRat;
}

export interface LinearSystemSolveResult {
  classification: LinearSystemClassification;
  rank: number;
  nullity: number;
  /** Present when classification === 'unique' */
  solution?: Record<string, BigRat>;
}

export interface MathSimultaneousLinearSpec {
  mode: 'simultaneous-linear';
  variables: string[];
  equations: string[];
  /** Optional explicit expected classification (cross-checked against exact solver!) */
  expectedClassification?: LinearSystemClassification;
}

interface AffineForm {
  coeffs: BigRat[];
  constant: BigRat;
}

function zeroAffine(n: number): AffineForm {
  return { coeffs: Array.from({ length: n }, () => RAT_ZERO), constant: RAT_ZERO };
}

function formatBigRat(r: BigRat): string {
  return r.d === BigInt(1) ? r.n.toString() : `${r.n.toString()}/${r.d.toString()}`;
}

/**
 * Extracts an exact affine form `c_0 * v_0 + ... + c_{k-1} * v_{k-1} + constant`
 * from an AST node. Rejects any non-linear term (e.g. `x^2`, `x*y`, `1/x`, `sin(x)`).
 */
function astToAffine(
  node: EvalAstNode,
  varIndex: ReadonlyMap<string, number>,
  nVars: number,
  budget: EvalOpBudget,
): AffineForm {
  budget.tick();
  switch (node.type) {
    case 'number':
      return {
        coeffs: Array.from({ length: nVars }, () => RAT_ZERO),
        constant: decimalStringToBigRat(node.raw),
      };
    case 'var': {
      const idx = varIndex.get(node.name);
      if (idx === undefined) {
        throw new MathEvalLimitError('UNSUPPORTED', `Unexpected variable "${node.name}" in linear system.`);
      }
      const coeffs = Array.from({ length: nVars }, () => RAT_ZERO);
      coeffs[idx] = RAT_ONE;
      return { coeffs, constant: RAT_ZERO };
    }
    case 'unary': {
      const inner = astToAffine(node.arg, varIndex, nVars, budget);
      if (node.op === '+') return inner;
      return {
        coeffs: inner.coeffs.map(ratNeg),
        constant: ratNeg(inner.constant),
      };
    }
    case 'binary': {
      const L = astToAffine(node.left, varIndex, nVars, budget);
      const R = astToAffine(node.right, varIndex, nVars, budget);
      if (node.op === '+') {
        return {
          coeffs: L.coeffs.map((c, i) => ratAdd(c, R.coeffs[i])),
          constant: ratAdd(L.constant, R.constant),
        };
      }
      if (node.op === '-') {
        return {
          coeffs: L.coeffs.map((c, i) => ratSub(c, R.coeffs[i])),
          constant: ratSub(L.constant, R.constant),
        };
      }
      if (node.op === '*') {
        const lIsConst = L.coeffs.every((c) => c.n === BigInt(0));
        const rIsConst = R.coeffs.every((c) => c.n === BigInt(0));
        if (lIsConst) {
          return {
            coeffs: R.coeffs.map((c) => ratMul(L.constant, c)),
            constant: ratMul(L.constant, R.constant),
          };
        }
        if (rIsConst) {
          return {
            coeffs: L.coeffs.map((c) => ratMul(c, R.constant)),
            constant: ratMul(L.constant, R.constant),
          };
        }
        throw new MathEvalLimitError('UNSUPPORTED', 'Non-linear product of variables is outside bounded linear simultaneous equations.');
      }
      if (node.op === '/') {
        const rIsConst = R.coeffs.every((c) => c.n === BigInt(0));
        if (!rIsConst) {
          throw new MathEvalLimitError('UNSUPPORTED', 'Division by a variable expression is non-linear.');
        }
        if (R.constant.n === BigInt(0)) {
          throw new MathEvalLimitError('UNSUPPORTED', 'Division by zero in linear equation.');
        }
        return {
          coeffs: L.coeffs.map((c) => ratDiv(c, R.constant)),
          constant: ratDiv(L.constant, R.constant),
        };
      }
      if (node.op === '^') {
        const lIsConst = L.coeffs.every((c) => c.n === BigInt(0));
        const rIsConst = R.coeffs.every((c) => c.n === BigInt(0));
        if (rIsConst && ratEq(R.constant, RAT_ONE)) return L;
        if (rIsConst && ratEq(R.constant, RAT_ZERO) && !(lIsConst && L.constant.n === BigInt(0))) {
          return { coeffs: zeroAffine(nVars).coeffs, constant: RAT_ONE };
        }
        throw new MathEvalLimitError('UNSUPPORTED', 'Non-linear exponent in linear simultaneous equation.');
      }
      throw new MathEvalLimitError('UNSUPPORTED', 'Unsupported operator in linear equation.');
    }
    default:
      throw new MathEvalLimitError('UNSUPPORTED', 'Transcendental or non-linear expression is not supported in linear simultaneous equations.');
  }
}

/**
 * Parses a single linear equation string (e.g. `2x + 3y = 7`) into exact `BigRat` row form.
 */
export function extractLinearEquationRow(
  equation: string,
  variables: readonly string[],
  budget: EvalOpBudget = new EvalOpBudget(),
): LinearEquationRow {
  const split = splitEquation(equation);
  if (!split) {
    throw new MathEvalLimitError('SYNTAX_ERROR', `Expected an equation containing "=" (got "${equation}").`);
  }
  const varIndex = new Map<string, number>();
  variables.forEach((v, i) => varIndex.set(v, i));

  const lhsParsed = parseEvalExpr(split.lhs, { allowedVariables: [...variables] });
  const rhsParsed = parseEvalExpr(split.rhs, { allowedVariables: [...variables] });
  const L = astToAffine(lhsParsed.ast, varIndex, variables.length, budget);
  const R = astToAffine(rhsParsed.ast, varIndex, variables.length, budget);

  // L - R = 0 => (L.coeffs - R.coeffs) . x = R.constant - L.constant
  return {
    coeffs: L.coeffs.map((c, i) => ratSub(c, R.coeffs[i])),
    rhs: ratSub(R.constant, L.constant),
  };
}

/**
 * Exact RREF Gaussian elimination over Q (`BigRat`) for 2×2 or 3×3 linear systems.
 * Independently verifies unique solutions by substituting back into all original rows.
 */
export function solveLinearSystemExact(
  equations: readonly string[],
  variables: readonly string[],
  budget: EvalOpBudget = new EvalOpBudget(),
): LinearSystemSolveResult {
  if (
    variables.length < LINEAR_SYSTEM_LIMITS.minVariables ||
    variables.length > LINEAR_SYSTEM_LIMITS.maxVariables
  ) {
    throw new MathEvalLimitError('UNSUPPORTED', `Linear systems support 2 or 3 variables (got ${variables.length}).`);
  }
  if (
    equations.length < LINEAR_SYSTEM_LIMITS.minEquations ||
    equations.length > LINEAR_SYSTEM_LIMITS.maxEquations
  ) {
    throw new MathEvalLimitError('UNSUPPORTED', `Linear systems support 2 or 3 equations (got ${equations.length}).`);
  }

  const rows = equations.map((eq) => extractLinearEquationRow(eq, variables, budget));
  const m = rows.length;
  const n = variables.length;

  // Build augmented matrix [A | b]
  const mat: BigRat[][] = rows.map((r) => [...r.coeffs, r.rhs]);

  let pivotRow = 0;
  for (let col = 0; col < n && pivotRow < m; col++) {
    budget.tick();
    let sel = -1;
    for (let r = pivotRow; r < m; r++) {
      if (mat[r][col].n !== BigInt(0)) {
        sel = r;
        break;
      }
    }
    if (sel === -1) continue;
    if (sel !== pivotRow) {
      const tmp = mat[pivotRow];
      mat[pivotRow] = mat[sel];
      mat[sel] = tmp;
    }
    // Scale pivot row so pivot becomes 1
    const pivotVal = mat[pivotRow][col];
    for (let c = col; c <= n; c++) {
      mat[pivotRow][c] = ratDiv(mat[pivotRow][c], pivotVal);
    }
    // Eliminate column in all other rows
    for (let r = 0; r < m; r++) {
      if (r === pivotRow) continue;
      const factor = mat[r][col];
      if (factor.n === BigInt(0)) continue;
      for (let c = col; c <= n; c++) {
        mat[r][c] = ratSub(mat[r][c], ratMul(factor, mat[pivotRow][c]));
      }
    }
    pivotRow++;
  }

  // Check for inconsistency: row of all zeros in A with non-zero RHS
  for (let r = 0; r < m; r++) {
    const allZero = mat[r].slice(0, n).every((c) => c.n === BigInt(0));
    if (allZero && mat[r][n].n !== BigInt(0)) {
      return { classification: 'no-solution', rank: pivotRow, nullity: n - pivotRow };
    }
  }

  if (pivotRow < n) {
    return { classification: 'infinitely-many', rank: pivotRow, nullity: n - pivotRow };
  }

  // Unique solution: extract and independently verify against original rows!
  const solution: Record<string, BigRat> = {};
  for (let i = 0; i < n; i++) {
    solution[variables[i]] = mat[i][n];
  }
  for (const row of rows) {
    let lhsVal = RAT_ZERO;
    for (let i = 0; i < n; i++) {
      lhsVal = ratAdd(lhsVal, ratMul(row.coeffs[i], solution[variables[i]]));
    }
    if (!ratEq(lhsVal, row.rhs)) {
      throw new MathEvalLimitError('UNSUPPORTED', 'Internal exact verification invariant failed.');
    }
  }

  return { classification: 'unique', rank: n, nullity: 0, solution };
}

export interface ParsedLinearSubmission {
  kind: 'no-solution' | 'infinitely-many' | 'assignments';
  values?: Record<string, BigRat>;
  workingLinesVerified?: number;
}

function evalConstantRatExpr(raw: string, budget: EvalOpBudget): BigRat {
  const parsed = parseEvalExpr(raw, { allowedVariables: [] });
  const aff = astToAffine(parsed.ast, new Map(), 0, budget);
  return aff.constant;
}

/**
 * Parses a learner's submission for a simultaneous linear system:
 * - Classification keywords: `no solution`, `inconsistent`, `infinitely many`, `dependent`, etc.
 * - Variable assignments: `x = 2, y = -1/3` (or `;` / newline separated; may include intermediate elimination/substitution lines!)
 * - Ordered coordinate tuple: `(2, -1/3)` or `(1, 2, 3)` matching `variables` order.
 */
export function parseLinearSystemSubmission(
  raw: string,
  variables: readonly string[],
  budget: EvalOpBudget = new EvalOpBudget(),
): ParsedLinearSubmission {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new MathEvalLimitError('SYNTAX_ERROR', 'Enter a solution such as "x = 2, y = 3", "(2, 3)", "no solution", or "infinitely many".');
  }
  const lower = trimmed.toLowerCase().replace(/\s+/g, ' ');
  if (
    lower === 'no solution' ||
    lower === 'no solutions' ||
    lower === 'inconsistent' ||
    lower === 'none' ||
    lower === 'empty' ||
    lower === 'empty set' ||
    lower === '∅'
  ) {
    return { kind: 'no-solution' };
  }
  if (
    lower === 'infinitely many' ||
    lower === 'infinitely many solutions' ||
    lower === 'infinite' ||
    lower === 'infinite solutions' ||
    lower === 'dependent'
  ) {
    return { kind: 'infinitely-many' };
  }

  // Tuple form: (v1, v2) or (v1, v2, v3)
  const tupleMatch = /^\(([^()]+)\)$/.exec(trimmed);
  if (tupleMatch && !trimmed.includes('=')) {
    const parts = tupleMatch[1].split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length !== variables.length) {
      throw new MathEvalLimitError(
        'SYNTAX_ERROR',
        `Ordered tuple must provide ${variables.length} values for (${variables.join(', ')}).`,
      );
    }
    const values: Record<string, BigRat> = {};
    for (let i = 0; i < variables.length; i++) {
      values[variables[i]] = evalConstantRatExpr(parts[i], budget);
    }
    return { kind: 'assignments', values };
  }

  // Split by newlines, semicolons, or commas into segments; support intermediate substitution/elimination lines
  const segments = trimmed
    .split(/[\n;,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (segments.length > LINEAR_SYSTEM_LIMITS.maxWorkingLines) {
    throw new MathEvalLimitError('LIMIT_EXCEEDED', `Too many working lines (max ${LINEAR_SYSTEM_LIMITS.maxWorkingLines}).`);
  }

  const varSet = new Set(variables);
  const values: Record<string, BigRat> = {};
  let workingLines = 0;

  for (const seg of segments) {
    const split = splitEquation(seg);
    if (!split) {
      throw new MathEvalLimitError('SYNTAX_ERROR', `Expected an equation or assignment like "${variables[0]} = 2" (got "${seg}").`);
    }
    const lhsTrim = split.lhs.trim();
    const rhsTrim = split.rhs.trim();
    if (varSet.has(lhsTrim)) {
      // Try evaluating RHS as exact constant (final assignment) vs expression in other vars (substitution step)
      try {
        values[lhsTrim] = evalConstantRatExpr(rhsTrim, budget);
      } catch {
        workingLines++;
      }
    } else if (varSet.has(rhsTrim)) {
      try {
        values[rhsTrim] = evalConstantRatExpr(lhsTrim, budget);
      } catch {
        workingLines++;
      }
    } else {
      // Intermediate elimination / substitution equation (e.g. `5x = 10` or `2(3-y) + y = 5`)
      extractLinearEquationRow(seg, variables, budget);
      workingLines++;
    }
  }

  if (Object.keys(values).length === 0) {
    throw new MathEvalLimitError(
      'SYNTAX_ERROR',
      `Include final values for all variables (${variables.join(', ')}), e.g. "${variables.map((v, i) => `${v} = ${i + 1}`).join(', ')}".`,
    );
  }

  return { kind: 'assignments', values, workingLinesVerified: workingLines };
}

export function evaluateSimultaneousLinearSystem(
  spec: MathSimultaneousLinearSpec,
  rawSubmission: string,
  budget: EvalOpBudget = new EvalOpBudget(),
): {
  passed: boolean;
  verdict: 'exact-equivalent' | 'incorrect' | 'syntax-error' | 'unsupported-or-indeterminate';
  feedback: string;
  opsUsed: number;
} {
  try {
    const solved = solveLinearSystemExact(spec.equations, spec.variables, budget);
    const parsed = parseLinearSystemSubmission(rawSubmission, spec.variables, budget);

    if (solved.classification === 'no-solution') {
      if (parsed.kind === 'no-solution') {
        return {
          passed: true,
          verdict: 'exact-equivalent',
          feedback: 'Verified: the linear system is inconsistent and has no solution.',
          opsUsed: budget.used,
        };
      }
      return {
        passed: false,
        verdict: 'incorrect',
        feedback: 'This linear system is inconsistent (parallel/contradictory equations) and has no solution.',
        opsUsed: budget.used,
      };
    }

    if (solved.classification === 'infinitely-many') {
      if (parsed.kind === 'infinitely-many') {
        return {
          passed: true,
          verdict: 'exact-equivalent',
          feedback: 'Verified: the linear system is dependent and has infinitely many solutions.',
          opsUsed: budget.used,
        };
      }
      return {
        passed: false,
        verdict: 'incorrect',
        feedback: 'This linear system is dependent (equations are redundant) and has infinitely many solutions.',
        opsUsed: budget.used,
      };
    }

    // Unique solution expected
    const expected = solved.solution!;
    if (parsed.kind !== 'assignments' || !parsed.values) {
      return {
        passed: false,
        verdict: 'incorrect',
        feedback: `This system has a unique solution for (${spec.variables.join(', ')}).`,
        opsUsed: budget.used,
      };
    }

    const missing = spec.variables.filter((v) => parsed.values![v] === undefined);
    if (missing.length > 0) {
      return {
        passed: false,
        verdict: 'incorrect',
        feedback: `Incomplete solution: missing value(s) for ${missing.join(', ')}.`,
        opsUsed: budget.used,
      };
    }

    const allMatch = spec.variables.every((v) => ratEq(parsed.values![v], expected[v]));
    if (allMatch) {
      const summary = spec.variables.map((v) => `${v} = ${formatBigRat(expected[v])}`).join(', ');
      return {
        passed: true,
        verdict: 'exact-equivalent',
        feedback: `Verified! Exact solution ${summary} satisfies all ${spec.equations.length} equations.`,
        opsUsed: budget.used,
      };
    }

    // Detect swapped values for 2-variable systems
    if (
      spec.variables.length === 2 &&
      ratEq(parsed.values[spec.variables[0]], expected[spec.variables[1]]) &&
      ratEq(parsed.values[spec.variables[1]], expected[spec.variables[0]])
    ) {
      return {
        passed: false,
        verdict: 'incorrect',
        feedback: `Check your variable labels: your values for ${spec.variables[0]} and ${spec.variables[1]} are swapped.`,
        opsUsed: budget.used,
      };
    }

    return {
      passed: false,
      verdict: 'incorrect',
      feedback: 'Your values do not satisfy all equations in the system. Substitute them back into each equation to check.',
      opsUsed: budget.used,
    };
  } catch (err) {
    if (err instanceof MathEvalLimitError) {
      const verdict = err.code === 'UNSUPPORTED' || err.code === 'LIMIT_EXCEEDED' ? 'unsupported-or-indeterminate' : 'syntax-error';
      return { passed: false, verdict, feedback: err.message, opsUsed: budget.used };
    }
    return {
      passed: false,
      verdict: 'syntax-error',
      feedback: err instanceof Error ? err.message : 'Could not evaluate simultaneous equations.',
      opsUsed: budget.used,
    };
  }
}
