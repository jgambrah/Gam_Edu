/**
 * GAM EDU — Step 5A.2 Pure Module 8: Multi-Step Mathematical Working & Transformation Verifier
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies, zero eval().
 * Reuses Step 5A.1 exact arithmetic, symbolic equivalence, domain certification,
 * equation certification, interval algebra, and SI unit conversion under a SINGLE
 * cumulative EvalOpBudget (never reset per step or per predicate).
 *
 * Explicit 8 Transition Statuses:
 *  1. `exact-equivalence`
 *  2. `symbolic-equivalence`
 *  3. `valid-implication-extraneous-risk`
 *  4. `lost-solution-error`
 *  5. `domain-violation-error`
 *  6. `invalid-transformation`
 *  7. `syntax-error`
 *  8. `indeterminate-unverified`
 */

import { EvalOpBudget, MATH_EVAL_LIMITS, MathEvalLimitError } from './math-eval-limits';
import { parseEvalExpr, type EvalAstNode } from './math-eval-parser';
import {
  RAT_ZERO,
  astToRationalPoly,
  checkSymbolicEquivalence,
  differentiateAst,
  polyDegree,
  polyIsZero,
  polySub,
  ratCmp,
  ratDiv,
  ratNeg,
  ratSub,
  type BigRat,
} from './math-eval-exact';
import {
  allRealsIntervalUnion,
  areIntervalUnionsEqual,
  deriveCompleteEquationSolutions,
  exactRootEqual,
  exactRootToNumber,
  extractExpressionDomain,
  intersectIntervalUnions,
  isIntervalUnionSubset,
  normaliseIntervalUnion,
  parseExactRoot,
  parseExcludedValuesSet,
  parseIntervalOrInequality,
  splitEquation,
  testCandidateAgainstOriginalEquation,
  type EquationClass,
  type ExactInterval,
  type ExactRoot,
} from './math-eval-domain-solutions';
import { convertToBaseSI, dimensionsEqual, parseUnitExpression } from './math-eval-units-precision';
import {
  buildAssumedDomainFromRestrictions,
  collectVarsInAst,
  evaluateMathSubmission,
  hasMultivariateDomainHazard,
  type MathDomainRestrictions,
  type MathEvalResult,
  type MathEvaluatorSpec,
} from './math-eval-engine';

export type StepTransitionStatus =
  | 'exact-equivalence'
  | 'symbolic-equivalence'
  | 'valid-implication-extraneous-risk'
  | 'lost-solution-error'
  | 'domain-violation-error'
  | 'invalid-transformation'
  | 'syntax-error'
  | 'indeterminate-unverified';

export type StepOperationKind =
  | 'simplify'
  | 'rearrange'
  | 'factorise'
  | 'expand'
  | 'complete-square'
  | 'quadratic-formula'
  | 'substitute'
  | 'differentiate'
  | 'integrate'
  | 'check-candidates'
  | 'state-domain'
  | 'conclude';

export type CandidateRejectionReason = 'substitution-mismatch' | 'domain-excluded' | 'negative-rhs';

export interface CandidateCheckInput {
  candidate: string;
  verdict: 'valid' | 'extraneous';
  reason?: CandidateRejectionReason;
  evidenceExpr?: string;
}

export interface VerifiedRejectedCandidate {
  candidate: string;
  hasVerifiedEvidence: boolean;
  failureKind: 'domain-excluded' | 'substitution-mismatch';
}

export interface WorkingStepInput {
  math: string;
  operation?: StepOperationKind;
  domainNote?: string;
  rejectedExtraneous?: string[];
  candidateChecks?: CandidateCheckInput[];
  unit?: string;
  justification?: string;
}

export interface StepVerificationItem {
  stepIndex: number; // 0-based index into learnerSteps
  rawMath: string;
  prevMath?: string;
  operation?: StepOperationKind;
  status: StepTransitionStatus;
  feedback: string;
  introducedExtraneous?: string[];
  lostSolutions?: string[];
  verifiedRejectedExtraneous?: VerifiedRejectedCandidate[];
}

export interface WorkingChainResult {
  stepResults: StepVerificationItem[];
  earliestErrorIndex: number | null;
  hasInvalidStep: boolean;
  hasIndeterminateStep: boolean;
  unresolvedExtraneous: string[];
  finalAnswerResult: MathEvalResult;
  mathematicallyCorrect: boolean;
  opsUsed: number;
  budgetExceeded: boolean;
}

export type WorkspaceProblemKind =
  | 'arithmetic-numeric'
  | 'algebraic-simplification'
  | 'equation-solving'
  | 'inequality-solving'
  | 'calculus-working'
  | 'formula-unit';

export interface WorkspaceVerificationConfig {
  problemKind: WorkspaceProblemKind;
  variables: string[];
  initialStatement: string;
  initialUnit?: string;
  domainRestrictions?: MathDomainRestrictions;
  finalGoal: Exclude<MathEvaluatorSpec, { mode: 'multi-step-working' }>;
}

const EQUATION_CLASSES_IN_ORDER: readonly EquationClass[] = [
  'linear',
  'quadratic',
  'factored-polynomial',
  'rational-linear-quadratic',
  'radical-single',
];

type CertifiedSolSet =
  | { kind: 'finite'; roots: ExactRoot[] }
  | { kind: 'all-reals' }
  | { kind: 'uncertifiable' };

function formatExactRootBrief(r: ExactRoot): string {
  if (r.kind === 'rat') {
    return r.value.d === BigInt(1) ? r.value.n.toString() : `${r.value.n}/${r.value.d}`;
  }
  const parts: string[] = [];
  for (const [rad, coef] of r.value.entries()) {
    const cStr = coef.d === BigInt(1) ? coef.n.toString() : `(${coef.n}/${coef.d})`;
    parts.push(rad === 1 ? cStr : `${cStr}*sqrt(${rad})`);
  }
  return parts.join(' + ') || '0';
}

function stripCalculusLabel(raw: string): { expr: string; detectedOp?: 'differentiate' | 'integrate' } {
  const t = raw.trim();
  if (/^(?:f'\s*\([a-zA-Z]\)|y'|d[a-zA-Z]\s*\/\s*d[a-zA-Z])\s*=/i.test(t)) {
    return { expr: t.replace(/^[^=]+=/, '').trim(), detectedOp: 'differentiate' };
  }
  if (/^(?:F\s*\([a-zA-Z]\)|I)\s*=/i.test(t)) {
    return { expr: t.replace(/^[^=]+=/, '').trim(), detectedOp: 'integrate' };
  }
  if (/^(?:f\s*\([a-zA-Z]\)|g\s*\([a-zA-Z]\)|y)\s*=/i.test(t)) {
    return { expr: t.replace(/^[^=]+=/, '').trim() };
  }
  return { expr: t };
}

function stripNamedResultPrefix(raw: string): string {
  const t = raw.trim();
  // Allows formula substitution lines like "v = 25" or "A = 120" while preserving equations when needed
  const m = t.match(/^[a-zA-Z]\s*=\s*(.+)$/);
  return m ? m[1].trim() : t;
}

/** Certifies the exact real solution set of a univariate equation or explicit root disjunction (e.g. "x = 2 or x = -1"). */
export function certifyEquationStepSolutions(
  rawEq: string,
  variable: string,
  budget: EvalOpBudget,
): CertifiedSolSet {
  const trimmed = rawEq.trim();
  if (!trimmed) return { kind: 'uncertifiable' };

  // Handle explicit disjunction / root list: "x = 2 or x = -1", "x = 2, -1", "x = 2, x = -1"
  if (/\bor\b|,/i.test(trimmed)) {
    const parts = trimmed
      .replace(/^\{|\}$/g, '')
      .split(/,|\bor\b/i)
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length >= 1 && parts.length <= MATH_EVAL_LIMITS.maxCandidateRoots) {
      const roots: ExactRoot[] = [];
      let allParsed = true;
      for (const p of parts) {
        const cleaned = p.replace(new RegExp(`^${variable}\\s*=\\s*`), '').trim();
        const r = parseExactRoot(cleaned, budget);
        if (!r) {
          allParsed = false;
          break;
        }
        if (!roots.some((existing) => exactRootEqual(existing, r))) roots.push(r);
      }
      if (allParsed && roots.length > 0) {
        return { kind: 'finite', roots };
      }
    }
  }

  if (!trimmed.includes('=')) {
    // Bare root literal (e.g. final step "2")
    const r = parseExactRoot(trimmed, budget);
    if (r) return { kind: 'finite', roots: [r] };
    return { kind: 'uncertifiable' };
  }

  for (const cls of EQUATION_CLASSES_IN_ORDER) {
    budget.tick();
    try {
      const derived = deriveCompleteEquationSolutions(trimmed, variable, cls, budget);
      if (derived.status === 'finite') return { kind: 'finite', roots: derived.roots };
      if (derived.status === 'all-reals') return { kind: 'all-reals' };
    } catch (e) {
      if (e instanceof MathEvalLimitError && e.code === 'LIMIT_EXCEEDED') throw e;
      // Try next equation class
    }
  }
  return { kind: 'uncertifiable' };
}

/** Solves a single linear inequality `lhs op rhs` into an exact 1D interval using BigRat (handles sign reversal!). */
function solveSingleLinearInequality(
  lhsStr: string,
  op: '<' | '<=' | '>' | '>=',
  rhsStr: string,
  variable: string,
  budget: EvalOpBudget,
): ExactInterval[] | null {
  try {
    const lAst = parseEvalExpr(lhsStr, { allowedVariables: [variable] }).ast;
    const rAst = parseEvalExpr(rhsStr, { allowedVariables: [variable] }).ast;
    const lRp = astToRationalPoly(lAst, budget);
    const rRp = astToRationalPoly(rAst, budget);
    if (!lRp || !rRp || polyDegree(lRp.den) > 0 || polyDegree(rRp.den) > 0) return null;

    // Normalize to (a*x + b) op 0  where diff = lhs - rhs
    const lDen = lRp.den.get('')!;
    const rDen = rRp.den.get('')!;
    const diff = polySub(
      new Map(Array.from(lRp.num.entries()).map(([k, v]) => [k, ratDiv(v, lDen)])),
      new Map(Array.from(rRp.num.entries()).map(([k, v]) => [k, ratDiv(v, rDen)])),
      budget,
    );
    if (polyDegree(diff) > 1) return null;

    const a = diff.get(`${variable}^1`) ?? diff.get(variable) ?? RAT_ZERO;
    const b = diff.get('') ?? RAT_ZERO;
    const cmpA = ratCmp(a, RAT_ZERO);
    const inclusive = op === '<=' || op === '>=';

    if (cmpA === 0) {
      // Constant inequality: b op 0
      const cmpB = ratCmp(b, RAT_ZERO);
      const holds =
        op === '<' ? cmpB < 0 : op === '<=' ? cmpB <= 0 : op === '>' ? cmpB > 0 : cmpB >= 0;
      return holds ? allRealsIntervalUnion() : [];
    }

    // Solve a*x + b op 0  =>  a*x op -b
    // If a > 0: x op (-b/a). If a < 0: flip inequality!
    const bound = ratDiv(ratNeg(b), a);
    const isLess = op === '<' || op === '<=';
    const effectiveLess = cmpA > 0 ? isLess : !isLess;

    if (effectiveLess) {
      return normaliseIntervalUnion([
        { low: { kind: 'neg-inf' }, lowInclusive: false, high: { kind: 'rat', value: bound }, highInclusive: inclusive },
      ]);
    }
    return normaliseIntervalUnion([
      { low: { kind: 'rat', value: bound }, lowInclusive: inclusive, high: { kind: 'pos-inf' }, highInclusive: false },
    ]);
  } catch (e) {
    if (e instanceof MathEvalLimitError && e.code === 'LIMIT_EXCEEDED') throw e;
    return null;
  }
}

/** Certifies an inequality or interval step (supports linear, compound `a < 2x - 1 <= b`, and interval notation). */
export function certifyInequalityStepIntervals(
  raw: string,
  variable: string,
  budget: EvalOpBudget,
): ExactInterval[] | null {
  const norm = raw
    .trim()
    .replace(/\u2264/g, '<=')
    .replace(/\u2265/g, '>=')
    .replace(/[\u2212\u2013]/g, '-')
    .replace(/\u221E/g, 'inf')
    .replace(/\u222A/g, ' U ');

  // 1. Try direct interval/simple inequality parser first
  try {
    return parseIntervalOrInequality(norm, variable, 'either');
  } catch {
    // Fall through to linear & compound linear inequality solver
  }

  // 2. Compound linear inequality: expr1 op1 expr2 op2 expr3
  const compMatch = norm.match(/^(.+?)\s*(<=|>=|<|>)\s*(.+?)\s*(<=|>=|<|>)\s*(.+)$/);
  if (compMatch) {
    const [, e1, op1, e2, op2, e3] = compMatch;
    const iv1 = solveSingleLinearInequality(e1, op1 as '<' | '<=' | '>' | '>=', e2, variable, budget);
    const iv2 = solveSingleLinearInequality(e2, op2 as '<' | '<=' | '>' | '>=', e3, variable, budget);
    if (iv1 && iv2) return intersectIntervalUnions(iv1, iv2);
    return null;
  }

  // 3. Single linear inequality: expr1 op expr2
  const singleMatch = norm.match(/^(.+?)\s*(<=|>=|<|>)\s*(.+)$/);
  if (singleMatch) {
    const [, e1, op, e2] = singleMatch;
    return solveSingleLinearInequality(e1, op as '<' | '<=' | '>' | '>=', e2, variable, budget);
  }

  return null;
}

/** Syntactic detector for completed-square form: `a*(x + p)^2 + q` or `(x + p)^2 = k` or `(x + p)^2 + q = 0`. Consumes shared cumulative budget. */
export function isCompletedSquareForm(raw: string, variable: string, sharedBudget?: EvalOpBudget): boolean {
  const budget = sharedBudget ?? new EvalOpBudget();
  const norm = raw.trim().replace(/[\u2212\u2013]/g, '-');
  const checkExpr = (exprStr: string): boolean => {
    try {
      const ast = parseEvalExpr(exprStr, { allowedVariables: [variable] }).ast;
      let hasLinearSquare = false;
      let hasBareLinearTerm = false;

      const isLinearInVar = (n: EvalAstNode): boolean => {
        budget.tick();
        const v = new Set<string>();
        collectVarsInAst(n, v);
        if (!v.has(variable)) return false;
        const rp = astToRationalPoly(n, budget);
        return rp !== null && polyDegree(rp.den) === 0 && polyDegree(rp.num) === 1;
      };

      const walkTopAdd = (n: EvalAstNode) => {
        if (n.type === 'binary' && (n.op === '+' || n.op === '-')) {
          walkTopAdd(n.left);
          walkTopAdd(n.right);
          return;
        }
        if (n.type === 'unary') {
          walkTopAdd(n.arg);
          return;
        }
        // Check if term is `c * (ax+b)^2` or `(ax+b)^2`
        const checkPow2 = (p: EvalAstNode): boolean =>
          p.type === 'binary' &&
          p.op === '^' &&
          p.right.type === 'number' &&
          p.right.value === 2 &&
          p.left.type === 'binary' &&
          (p.left.op === '+' || p.left.op === '-') &&
          isLinearInVar(p.left);

        if (checkPow2(n)) {
          hasLinearSquare = true;
          return;
        }
        if (
          n.type === 'binary' &&
          (n.op === '*' || n.op === '/') &&
          (checkPow2(n.left) || checkPow2(n.right))
        ) {
          hasLinearSquare = true;
          return;
        }
        const termVars = new Set<string>();
        collectVarsInAst(n, termVars);
        if (termVars.has(variable)) hasBareLinearTerm = true;
      };

      walkTopAdd(ast);
      return hasLinearSquare && !hasBareLinearTerm;
    } catch (e) {
      if (e instanceof MathEvalLimitError && e.code === 'LIMIT_EXCEEDED') throw e;
      return false;
    }
  };

  if (norm.includes('=')) {
    const { lhs, rhs } = splitEquation(norm);
    return checkExpr(lhs) || checkExpr(rhs);
  }
  return checkExpr(norm);
}

function isRootSubset(sub: ExactRoot[], sup: ExactRoot[]): boolean {
  return sub.every((r) => sup.some((s) => exactRootEqual(r, s)));
}

function parseExactNumberVal(raw: string, budget: EvalOpBudget): BigRat | null {
  try {
    const ast = parseEvalExpr(raw, { allowedVariables: [] }).ast;
    const rp = astToRationalPoly(ast, budget);
    if (!rp || rp.num.size > 1 || rp.den.size !== 1 || !rp.den.has('')) return null;
    return ratDiv(rp.num.get('') ?? RAT_ZERO, rp.den.get('')!);
  } catch {
    return null;
  }
}

/**
 * Verifies a complete multi-step learner working chain using a SINGLE cumulative EvalOpBudget.
 */
export function verifyWorkingChain(
  config: WorkspaceVerificationConfig,
  learnerSteps: WorkingStepInput[],
  sharedBudget?: EvalOpBudget,
): WorkingChainResult {
  const budget = sharedBudget ?? new EvalOpBudget(MATH_EVAL_LIMITS.maxTotalWorkspaceOps);
  const stepResults: StepVerificationItem[] = [];
  let earliestErrorIndex: number | null = null;
  let hasInvalidStep = false;
  let hasIndeterminateStep = false;
  let budgetExceeded = false;

  const activeVar = config.variables.length >= 1 ? config.variables[0] : 'x';
  const posVars = new Set<string>();
  for (const [vk, vv] of Object.entries(config.domainRestrictions?.variableAssumptions ?? {})) {
    if (vv === 'positive') posVars.add(vk);
  }

  // Track original constraints & outstanding extraneous-root obligations across the chain
  let origDom: ExactInterval[] | null = null;
  let origEqSols: CertifiedSolSet | null = null;
  let origLhsAst: EvalAstNode | null = null;
  let origRhsAst: EvalAstNode | null = null;
  const outstandingExtraneous: ExactRoot[] = [];

  try {
    if (config.problemKind === 'equation-solving') {
      origEqSols = certifyEquationStepSolutions(config.initialStatement, activeVar, budget);
      if (config.initialStatement.includes('=')) {
        try {
          const { lhs, rhs } = splitEquation(config.initialStatement);
          origLhsAst = parseEvalExpr(lhs, { allowedVariables: [activeVar] }).ast;
          origRhsAst = parseEvalExpr(rhs, { allowedVariables: [activeVar] }).ast;
        } catch {
          // ignore if unparseable as single equation
        }
      }
    } else if (config.problemKind === 'algebraic-simplification' && config.variables.length === 1) {
      const initAst = parseEvalExpr(config.initialStatement, { allowedVariables: config.variables }).ast;
      const natInit = extractExpressionDomain(initAst, activeVar, budget);
      if (natInit.certifiable) {
        const assumpDom = buildAssumedDomainFromRestrictions(config.domainRestrictions, activeVar, budget);
        origDom = intersectIntervalUnions(natInit.domain, assumpDom);
      }
    }

    const cappedSteps = learnerSteps.slice(0, MATH_EVAL_LIMITS.maxWorkingSteps);
    let prevMath = config.initialStatement;
    let prevUnit = config.initialUnit;

    for (let i = 0; i < cappedSteps.length; i++) {
      budget.tick();
      const step = cappedSteps[i];
      const currRaw = (step.math ?? '').trim();
      const stepPrevMath = prevMath;
      const resultLenBefore = stepResults.length;

      if (!currRaw) {
        stepResults.push({
          stepIndex: i,
          rawMath: currRaw,
          prevMath: stepPrevMath,
          operation: step.operation,
          status: 'syntax-error',
          feedback: `Step ${i + 1} is empty. Enter a mathematical expression, equation, or conclusion.`,
        });
        if (earliestErrorIndex === null) earliestErrorIndex = i;
        hasInvalidStep = true;
        continue;
      }

      // Independently verify declared extraneous rejections & structured candidateChecks against the original equation!
      // Reject contradictory attempts to reject genuine valid solutions, and NEVER clear obligations on unverified claims.
      const verifiedRejects: VerifiedRejectedCandidate[] = [];
      let contradictoryRejectionRoot: string | null = null;
      const declaredRejects: Array<{ raw: string; reason?: CandidateRejectionReason }> = [];
      if (step.rejectedExtraneous) {
        for (const r of step.rejectedExtraneous) declaredRejects.push({ raw: r });
      }
      if (step.candidateChecks) {
        for (const cc of step.candidateChecks) {
          if (cc.verdict === 'extraneous') {
            const existing = declaredRejects.find((d) => d.raw === cc.candidate);
            if (existing) existing.reason = cc.reason;
            else declaredRejects.push({ raw: cc.candidate, reason: cc.reason });
          }
        }
      }

      if (declaredRejects.length > 0 && config.problemKind === 'equation-solving') {
        const origFinite = origEqSols && origEqSols.kind === 'finite' ? origEqSols.roots : null;
        for (const decl of declaredRejects) {
          const parsedRej = parseExactRoot(decl.raw, budget);
          if (!parsedRej) continue;
          // 1. Contradiction check: cannot reject a genuine valid solution of the original equation!
          if (origFinite && origFinite.some((validRoot) => exactRootEqual(validRoot, parsedRej))) {
            contradictoryRejectionRoot = formatExactRootBrief(parsedRej);
            break;
          }
          // 2. Independently confirm candidate fails the original equation (domain error or LHS != RHS)
          if (origLhsAst && origRhsAst) {
            const chk = testCandidateAgainstOriginalEquation(
              origLhsAst,
              origRhsAst,
              activeVar,
              exactRootToNumber(parsedRej),
              budget,
            );
            if (!chk.satisfies) {
              const failureKind: 'domain-excluded' | 'substitution-mismatch' = chk.domainError
                ? 'domain-excluded'
                : 'substitution-mismatch';
              const reasonMatches =
                decl.reason !== undefined &&
                ((failureKind === 'domain-excluded' && decl.reason === 'domain-excluded') ||
                  (failureKind === 'substitution-mismatch' &&
                    (decl.reason === 'substitution-mismatch' || decl.reason === 'negative-rhs')));
              verifiedRejects.push({
                candidate: formatExactRootBrief(parsedRej),
                hasVerifiedEvidence: reasonMatches,
                failureKind,
              });
              const idx = outstandingExtraneous.findIndex((r) => exactRootEqual(r, parsedRej));
              if (idx >= 0) outstandingExtraneous.splice(idx, 1);
            }
          }
        }
      }

      if (contradictoryRejectionRoot !== null) {
        stepResults.push({
          stepIndex: i,
          rawMath: currRaw,
          prevMath: stepPrevMath,
          operation: step.operation,
          status: 'lost-solution-error',
          lostSolutions: [contradictoryRejectionRoot],
          feedback: `Contradictory candidate rejection: ${activeVar} = ${contradictoryRejectionRoot} IS a genuine solution of the original equation and cannot be rejected as extraneous.`,
        });
        if (earliestErrorIndex === null) earliestErrorIndex = i;
        hasInvalidStep = true;
        prevMath = currRaw;
        continue;
      }

      const attachStepMeta = () => {
        if (stepResults.length > resultLenBefore) {
          const last = stepResults[stepResults.length - 1];
          last.prevMath = stepPrevMath;
          if (verifiedRejects.length > 0) {
            last.verifiedRejectedExtraneous = verifiedRejects;
          }
        }
      };

      try {
      // 1. CALCULUS WORKING SEMANTICS (differentiate / integrate operations)
      if (config.problemKind === 'calculus-working') {
        const prevClean = stripCalculusLabel(prevMath);
        const currClean = stripCalculusLabel(currRaw);
        const op = step.operation ?? currClean.detectedOp ?? 'simplify';

        if (op === 'differentiate') {
          try {
            const srcAst = parseEvalExpr(prevClean.expr, { allowedVariables: [activeVar] }).ast;
            const derivedAst = differentiateAst(srcAst, activeVar, budget);
            const currAst = parseEvalExpr(currClean.expr, { allowedVariables: [activeVar] }).ast;
            const sym = checkSymbolicEquivalence(derivedAst, currAst, budget, posVars);

            if (sym === 'exact' || sym === 'symbolic') {
              const natSrc = extractExpressionDomain(srcAst, activeVar, budget);
              const natDer = extractExpressionDomain(derivedAst, activeVar, budget);
              const natCurr = extractExpressionDomain(currAst, activeVar, budget);
              const assumpDom = buildAssumedDomainFromRestrictions(config.domainRestrictions, activeVar, budget);
              if (!natSrc.certifiable || !natDer.certifiable || !natCurr.certifiable) {
                stepResults.push({
                  stepIndex: i,
                  rawMath: currRaw,
                  operation: op,
                  status: 'indeterminate-unverified',
                  feedback: 'Derivative domain could not be certified automatically for this class.',
                });
                hasIndeterminateStep = true;
              } else {
                const reqDiffDom = intersectIntervalUnions(intersectIntervalUnions(natSrc.domain, natDer.domain), assumpDom);
                if (!isIntervalUnionSubset(reqDiffDom, natCurr.domain)) {
                  stepResults.push({
                    stepIndex: i,
                    rawMath: currRaw,
                    operation: op,
                    status: 'domain-violation-error',
                    feedback: 'Your derivative introduces an additional undefined point within the differentiation domain.',
                  });
                  if (earliestErrorIndex === null) earliestErrorIndex = i;
                  hasInvalidStep = true;
                } else {
                  stepResults.push({
                    stepIndex: i,
                    rawMath: currRaw,
                    operation: op,
                    status: sym === 'exact' ? 'exact-equivalence' : 'symbolic-equivalence',
                    feedback: 'Valid differentiation step verified symbolically.',
                  });
                }
              }
            } else if (sym === 'unsupported') {
              stepResults.push({
                stepIndex: i,
                rawMath: currRaw,
                operation: op,
                status: 'indeterminate-unverified',
                feedback: 'This differentiation step lies outside supported symbolic rules and was not marked wrong.',
              });
              hasIndeterminateStep = true;
            } else {
              stepResults.push({
                stepIndex: i,
                rawMath: currRaw,
                operation: op,
                status: 'invalid-transformation',
                feedback: 'Check your differentiation rules (power, product, quotient, chain rule; trig in radians).',
              });
              if (earliestErrorIndex === null) earliestErrorIndex = i;
              hasInvalidStep = true;
            }
            prevMath = currRaw;
            continue;
          } catch (e) {
            if (e instanceof MathEvalLimitError && e.code === 'LIMIT_EXCEEDED') throw e;
            stepResults.push({
              stepIndex: i,
              rawMath: currRaw,
              operation: op,
              status: 'syntax-error',
              feedback: e instanceof Error ? e.message : 'Syntax error in differentiation step.',
            });
            if (earliestErrorIndex === null) earliestErrorIndex = i;
            hasInvalidStep = true;
            continue;
          }
        }

        if (op === 'integrate') {
          try {
            const srcAst = parseEvalExpr(prevClean.expr, { allowedVariables: [activeVar] }).ast;
            const currAst = parseEvalExpr(currClean.expr, { allowedVariables: [activeVar], allowConstantC: true }).ast;
            const dCurr = differentiateAst(currAst, activeVar, budget);
            const sym = checkSymbolicEquivalence(dCurr, srcAst, budget, posVars);

            if (sym === 'exact' || sym === 'symbolic') {
              const natInt = extractExpressionDomain(srcAst, activeVar, budget);
              const natCurr = extractExpressionDomain(currAst, activeVar, budget);
              const natDer = extractExpressionDomain(dCurr, activeVar, budget);
              const assumpDom = buildAssumedDomainFromRestrictions(config.domainRestrictions, activeVar, budget);
              if (!natInt.certifiable || !natCurr.certifiable || !natDer.certifiable) {
                stepResults.push({
                  stepIndex: i,
                  rawMath: currRaw,
                  operation: op,
                  status: 'indeterminate-unverified',
                  feedback: 'Antiderivative domain could not be certified automatically.',
                });
                hasIndeterminateStep = true;
              } else {
                const reqIntDom = intersectIntervalUnions(natInt.domain, assumpDom);
                if (!isIntervalUnionSubset(reqIntDom, natCurr.domain) || !isIntervalUnionSubset(reqIntDom, natDer.domain)) {
                  stepResults.push({
                    stepIndex: i,
                    rawMath: currRaw,
                    operation: op,
                    status: 'domain-violation-error',
                    feedback: 'Your antiderivative introduces an undefined or non-differentiable point within the integration domain.',
                  });
                  if (earliestErrorIndex === null) earliestErrorIndex = i;
                  hasInvalidStep = true;
                } else {
                  stepResults.push({
                    stepIndex: i,
                    rawMath: currRaw,
                    operation: op,
                    status: sym === 'exact' ? 'exact-equivalence' : 'symbolic-equivalence',
                    feedback: 'Valid integration step verified via exact symbolic differentiation.',
                  });
                }
              }
            } else if (sym === 'unsupported') {
              stepResults.push({
                stepIndex: i,
                rawMath: currRaw,
                operation: op,
                status: 'indeterminate-unverified',
                feedback: 'This integration step lies outside supported symbolic rules and was not marked wrong.',
              });
              hasIndeterminateStep = true;
            } else {
              stepResults.push({
                stepIndex: i,
                rawMath: currRaw,
                operation: op,
                status: 'invalid-transformation',
                feedback: `Differentiating Step ${i + 1} does not recover the previous integrand.`,
              });
              if (earliestErrorIndex === null) earliestErrorIndex = i;
              hasInvalidStep = true;
            }
            prevMath = currRaw;
            continue;
          } catch (e) {
            if (e instanceof MathEvalLimitError && e.code === 'LIMIT_EXCEEDED') throw e;
            stepResults.push({
              stepIndex: i,
              rawMath: currRaw,
              operation: op,
              status: 'syntax-error',
              feedback: e instanceof Error ? e.message : 'Syntax error in integration step.',
            });
            if (earliestErrorIndex === null) earliestErrorIndex = i;
            hasInvalidStep = true;
            continue;
          }
        }
        // Otherwise fall through to algebraic simplification on stripped calculus expressions
        prevMath = prevClean.expr;
      }

      // 2. EQUATION SOLVING TRANSITIONS (solution-set comparison + extraneous/lost solution tracking)
      if (config.problemKind === 'equation-solving') {
        const prevSols = certifyEquationStepSolutions(prevMath, activeVar, budget);
        const currSols = certifyEquationStepSolutions(currRaw, activeVar, budget);

        if (prevSols.kind === 'uncertifiable' || currSols.kind === 'uncertifiable') {
          // Check syntax first so malformed input gets syntax-error rather than indeterminate
          try {
            if (currRaw.includes('=')) {
              const { lhs, rhs } = splitEquation(currRaw);
              parseEvalExpr(lhs, { allowedVariables: config.variables });
              parseEvalExpr(rhs, { allowedVariables: config.variables });
            } else if (!/\bor\b|,/i.test(currRaw)) {
              parseEvalExpr(currRaw, { allowedVariables: config.variables });
            }
            stepResults.push({
              stepIndex: i,
              rawMath: currRaw,
              operation: step.operation,
              status: 'indeterminate-unverified',
              feedback: 'This transformation lies outside bounded equation certification and is marked indeterminate (not wrong).',
            });
            hasIndeterminateStep = true;
            prevMath = currRaw;
          } catch (e) {
            stepResults.push({
              stepIndex: i,
              rawMath: currRaw,
              operation: step.operation,
              status: 'syntax-error',
              feedback: e instanceof Error ? e.message : 'Syntax error in equation step.',
            });
            if (earliestErrorIndex === null) earliestErrorIndex = i;
            hasInvalidStep = true;
          }
          continue;
        }

        if (prevSols.kind === 'all-reals' && currSols.kind === 'all-reals') {
          stepResults.push({
            stepIndex: i,
            rawMath: currRaw,
            operation: step.operation,
            status: 'exact-equivalence',
            feedback: 'Equivalent identity step verified.',
          });
          prevMath = currRaw;
          continue;
        }

        if (prevSols.kind === 'finite' && currSols.kind === 'finite') {
          const prevInCurr = isRootSubset(prevSols.roots, currSols.roots);
          const currInPrev = isRootSubset(currSols.roots, prevSols.roots);

          if (prevInCurr && currInPrev) {
            stepResults.push({
              stepIndex: i,
              rawMath: currRaw,
              operation: step.operation,
              status: 'exact-equivalence',
              feedback: 'Equivalent equation step (solution set preserved).',
            });
          } else if (prevInCurr && !currInPrev) {
            // One-way implication: e.g. squaring both sides introduces extraneous candidate(s)
            const added = currSols.roots.filter((r) => !prevSols.roots.some((p) => exactRootEqual(p, r)));
            for (const extra of added) {
              if (!outstandingExtraneous.some((o) => exactRootEqual(o, extra))) {
                outstandingExtraneous.push(extra);
              }
            }
            stepResults.push({
              stepIndex: i,
              rawMath: currRaw,
              operation: step.operation,
              status: 'valid-implication-extraneous-risk',
              introducedExtraneous: added.map(formatExactRootBrief),
              feedback:
                'Valid one-way implication (e.g. squaring or multiplying by a variable expression). Remember to test candidate solutions in the original equation and reject extraneous roots.',
            });
          } else if (!prevInCurr && currInPrev) {
            // Subset: either learner legitimately rejected extraneous roots against the original equation,
            // OR learner lost a genuine valid root (e.g. divided x^2 = 3x by x -> lost x = 0)!
            const dropped = prevSols.roots.filter((r) => !currSols.roots.some((c) => exactRootEqual(c, r)));
            const origFiniteRoots = origEqSols !== null && origEqSols.kind === 'finite' ? origEqSols.roots : null;
            const allDroppedAreExtraneousToOriginal =
              origFiniteRoots !== null &&
              dropped.every((d) => !origFiniteRoots.some((or) => exactRootEqual(or, d)));

            if (allDroppedAreExtraneousToOriginal && dropped.length > 0) {
              // Legitimate candidate check removing extraneous root(s)!
              for (const d of dropped) {
                const idx = outstandingExtraneous.findIndex((o) => exactRootEqual(o, d));
                if (idx >= 0) outstandingExtraneous.splice(idx, 1);
              }
              stepResults.push({
                stepIndex: i,
                rawMath: currRaw,
                operation: step.operation ?? 'check-candidates',
                status: 'exact-equivalence',
                feedback: 'Valid candidate verification: extraneous solution(s) rejected against the original equation.',
              });
            } else {
              stepResults.push({
                stepIndex: i,
                rawMath: currRaw,
                operation: step.operation,
                status: 'lost-solution-error',
                lostSolutions: dropped.map(formatExactRootBrief),
                feedback: `Lost solution detected: this step eliminates valid solution(s) (${dropped.map(formatExactRootBrief).join(', ')}). Avoid dividing both sides by a variable expression that could be zero.`,
              });
              if (earliestErrorIndex === null) earliestErrorIndex = i;
              hasInvalidStep = true;
            }
          } else {
            stepResults.push({
              stepIndex: i,
              rawMath: currRaw,
              operation: step.operation,
              status: 'invalid-transformation',
              feedback: 'This equation step does not follow from the previous line. Check signs, distribution, and arithmetic.',
            });
            if (earliestErrorIndex === null) earliestErrorIndex = i;
            hasInvalidStep = true;
          }
          prevMath = currRaw;
          continue;
        }

        stepResults.push({
          stepIndex: i,
          rawMath: currRaw,
          operation: step.operation,
          status: 'invalid-transformation',
          feedback: 'This equation step changes the solution set incompatibly.',
        });
        if (earliestErrorIndex === null) earliestErrorIndex = i;
        hasInvalidStep = true;
        prevMath = currRaw;
        continue;
      }

      // 3. INEQUALITY SOLVING TRANSITIONS (exact interval-union comparison, catches sign reversal!)
      if (config.problemKind === 'inequality-solving') {
        const prevIv = certifyInequalityStepIntervals(prevMath, activeVar, budget);
        const currIv = certifyInequalityStepIntervals(currRaw, activeVar, budget);
        if (!prevIv || !currIv) {
          stepResults.push({
            stepIndex: i,
            rawMath: currRaw,
            operation: step.operation,
            status: 'indeterminate-unverified',
            feedback: 'This inequality step lies outside bounded linear/interval certification (marked indeterminate).',
          });
          hasIndeterminateStep = true;
          prevMath = currRaw;
          continue;
        }
        if (areIntervalUnionsEqual(prevIv, currIv)) {
          stepResults.push({
            stepIndex: i,
            rawMath: currRaw,
            operation: step.operation,
            status: 'exact-equivalence',
            feedback: 'Equivalent inequality/interval step verified.',
          });
        } else if (isIntervalUnionSubset(prevIv, currIv)) {
          stepResults.push({
            stepIndex: i,
            rawMath: currRaw,
            operation: step.operation,
            status: 'valid-implication-extraneous-risk',
            feedback: 'This step widens the solution interval — verify all original boundary conditions.',
          });
        } else if (isIntervalUnionSubset(currIv, prevIv)) {
          stepResults.push({
            stepIndex: i,
            rawMath: currRaw,
            operation: step.operation,
            status: 'lost-solution-error',
            feedback: 'This step narrows the solution interval and loses valid solutions.',
          });
          if (earliestErrorIndex === null) earliestErrorIndex = i;
          hasInvalidStep = true;
        } else {
          stepResults.push({
            stepIndex: i,
            rawMath: currRaw,
            operation: step.operation,
            status: 'invalid-transformation',
            feedback: 'Inequality solution set changed. Remember to reverse the inequality sign when multiplying or dividing by a negative number.',
          });
          if (earliestErrorIndex === null) earliestErrorIndex = i;
          hasInvalidStep = true;
        }
        prevMath = currRaw;
        continue;
      }

      // 4. ARITHMETIC / FORMULA-UNIT / ALGEBRAIC EXPRESSION TRANSITIONS
      try {
        const prevExprStr =
          config.problemKind === 'formula-unit' || config.problemKind === 'arithmetic-numeric'
            ? stripNamedResultPrefix(prevMath)
            : config.problemKind === 'calculus-working'
              ? stripCalculusLabel(prevMath).expr
              : prevMath;
        const currExprStr =
          config.problemKind === 'formula-unit' || config.problemKind === 'arithmetic-numeric'
            ? stripNamedResultPrefix(currRaw)
            : config.problemKind === 'calculus-working'
              ? stripCalculusLabel(currRaw).expr
              : currRaw;

        // Unit conversion check when both previous and current steps carry units
        if (config.problemKind === 'formula-unit' && (prevUnit || step.unit)) {
          const prevVal = parseExactNumberVal(prevExprStr, budget);
          const currVal = parseExactNumberVal(currExprStr, budget);
          if (prevVal && currVal && prevUnit && step.unit) {
            const pU = parseUnitExpression(prevUnit);
            const cU = parseUnitExpression(step.unit);
            if (!dimensionsEqual(pU.dim, cU.dim)) {
              stepResults.push({
                stepIndex: i,
                rawMath: currRaw,
                operation: step.operation,
                status: 'invalid-transformation',
                feedback: `Incompatible unit dimensions between "${prevUnit}" and "${step.unit}".`,
              });
              if (earliestErrorIndex === null) earliestErrorIndex = i;
              hasInvalidStep = true;
              prevMath = currRaw;
              prevUnit = step.unit;
              continue;
            }
            const pSI = convertToBaseSI(Number(prevVal.n) / Number(prevVal.d), pU, 'absolute');
            const cSI = convertToBaseSI(Number(currVal.n) / Number(currVal.d), cU, 'absolute');
            if (Math.abs(pSI - cSI) <= 1e-9 * Math.max(1, Math.abs(pSI))) {
              stepResults.push({
                stepIndex: i,
                rawMath: currRaw,
                operation: step.operation,
                status: 'exact-equivalence',
                feedback: `Valid unit conversion (${prevUnit} → ${step.unit}) verified.`,
              });
            } else {
              stepResults.push({
                stepIndex: i,
                rawMath: currRaw,
                operation: step.operation,
                status: 'invalid-transformation',
                feedback: `Unit conversion value mismatch between ${prevExprStr} ${prevUnit} and ${currExprStr} ${step.unit}.`,
              });
              if (earliestErrorIndex === null) earliestErrorIndex = i;
              hasInvalidStep = true;
            }
            prevMath = currRaw;
            prevUnit = step.unit;
            continue;
          }
        }

        const allowC = config.problemKind === 'calculus-working';
        const prevAst = parseEvalExpr(prevExprStr, { allowedVariables: config.variables, allowConstantC: allowC }).ast;
        const currAst = parseEvalExpr(currExprStr, { allowedVariables: config.variables, allowConstantC: allowC }).ast;

        const usedVars = new Set<string>();
        collectVarsInAst(prevAst, usedVars);
        collectVarsInAst(currAst, usedVars);

        if (usedVars.size > 1 && (hasMultivariateDomainHazard(prevAst, budget) || hasMultivariateDomainHazard(currAst, budget))) {
          stepResults.push({
            stepIndex: i,
            rawMath: currRaw,
            operation: step.operation,
            status: 'indeterminate-unverified',
            feedback: 'Multivariate rational/log/radical domain transitions cannot be certified automatically.',
          });
          hasIndeterminateStep = true;
          prevMath = currRaw;
          continue;
        }

        const sym = checkSymbolicEquivalence(prevAst, currAst, budget, posVars);
        if (sym === 'exact' || sym === 'symbolic') {
          // Verify domain preservation for univariate expressions
          if (usedVars.size === 1) {
            const v = Array.from(usedVars)[0];
            const natPrev = extractExpressionDomain(prevAst, v, budget);
            const natCurr = extractExpressionDomain(currAst, v, budget);
            if (!natPrev.certifiable || !natCurr.certifiable) {
              stepResults.push({
                stepIndex: i,
                rawMath: currRaw,
                operation: step.operation,
                status: 'indeterminate-unverified',
                feedback: 'Domain preservation could not be certified automatically for this expression class.',
              });
              hasIndeterminateStep = true;
              prevMath = currRaw;
              continue;
            }
            const assumpDom = buildAssumedDomainFromRestrictions(config.domainRestrictions, v, budget);
            const reqDom = origDom ?? intersectIntervalUnions(natPrev.domain, assumpDom);
            if (!isIntervalUnionSubset(reqDom, natCurr.domain)) {
              stepResults.push({
                stepIndex: i,
                rawMath: currRaw,
                operation: step.operation,
                status: 'domain-violation-error',
                feedback: 'This step introduces an additional undefined point within the required real domain.',
              });
              if (earliestErrorIndex === null) earliestErrorIndex = i;
              hasInvalidStep = true;
              prevMath = currRaw;
              continue;
            }
          }
          stepResults.push({
            stepIndex: i,
            rawMath: currRaw,
            operation: step.operation,
            status: sym === 'exact' ? 'exact-equivalence' : 'symbolic-equivalence',
            feedback:
              sym === 'exact'
                ? 'Valid exact algebraic equivalence step verified.'
                : 'Valid symbolic equivalence step verified within the supported domain.',
          });
        } else if (sym === 'unsupported') {
          stepResults.push({
            stepIndex: i,
            rawMath: currRaw,
            operation: step.operation,
            status: 'indeterminate-unverified',
            feedback: 'This transformation lies outside supported symbolic rules and was not marked wrong.',
          });
          hasIndeterminateStep = true;
        } else {
          stepResults.push({
            stepIndex: i,
            rawMath: currRaw,
            operation: step.operation,
            status: 'invalid-transformation',
            feedback: `Step ${i + 1} is not mathematically equivalent to the previous step. Check arithmetic, signs, and operations.`,
          });
          if (earliestErrorIndex === null) earliestErrorIndex = i;
          hasInvalidStep = true;
        }
        prevMath = currRaw;
        if (step.unit) prevUnit = step.unit;
      } catch (e) {
        if (e instanceof MathEvalLimitError && e.code === 'LIMIT_EXCEEDED') throw e;
        stepResults.push({
          stepIndex: i,
          rawMath: currRaw,
          operation: step.operation,
          status: 'syntax-error',
          feedback: e instanceof Error ? e.message : 'Syntax error in working step.',
        });
        if (earliestErrorIndex === null) earliestErrorIndex = i;
        hasInvalidStep = true;
      }
      } finally {
        attachStepMeta();
      }
    }
  } catch (e) {
    if (e instanceof MathEvalLimitError && e.code === 'LIMIT_EXCEEDED') {
      budgetExceeded = true;
      hasIndeterminateStep = true;
      stepResults.push({
        stepIndex: stepResults.length,
        rawMath: '',
        status: 'indeterminate-unverified',
        feedback: 'Cumulative workspace verification operation budget exceeded; remaining steps marked indeterminate.',
      });
    } else {
      throw e;
    }
  }

  // Independently verify the final step against config.finalGoal (never hidden by earlier steps!)
  const lastStep = learnerSteps[learnerSteps.length - 1];
  const lastRaw = lastStep ? lastStep.math.trim() : '';
  const lastExprForGoal =
    config.problemKind === 'calculus-working'
      ? stripCalculusLabel(lastRaw).expr
      : config.problemKind === 'formula-unit' || config.problemKind === 'arithmetic-numeric'
        ? stripNamedResultPrefix(lastRaw)
        : lastRaw;

  // Gather any domain note stated across the working chain (most recent non-empty domainNote)
  let statedDomain: string | undefined;
  for (let i = learnerSteps.length - 1; i >= 0; i--) {
    if (learnerSteps[i].domainNote?.trim()) {
      statedDomain = learnerSteps[i].domainNote!.trim();
      break;
    }
  }

  let finalAnswerResult: MathEvalResult;
  if (budgetExceeded) {
    finalAnswerResult = {
      passed: false,
      verdict: 'unsupported-or-indeterminate',
      feedback: 'Verification budget exceeded before final-answer evaluation completed.',
      opsUsed: budget.used,
    };
  } else {
    finalAnswerResult = evaluateMathSubmission(
      config.finalGoal,
      {
        expression: lastExprForGoal,
        unit: lastStep?.unit || undefined,
        domainInput: statedDomain,
        rootsInput: config.finalGoal.mode === 'equation-solution' ? lastRaw : undefined,
      },
      budget,
    );
    if (finalAnswerResult.verdict === 'unsupported-or-indeterminate' && budget.used >= budget.maxOps) {
      budgetExceeded = true;
    }
  }

  const unresolvedExtraneous = outstandingExtraneous.map(formatExactRootBrief);
  const mathematicallyCorrect =
    !budgetExceeded &&
    !hasInvalidStep &&
    !hasIndeterminateStep &&
    unresolvedExtraneous.length === 0 &&
    finalAnswerResult.passed;

  return {
    stepResults,
    earliestErrorIndex,
    hasInvalidStep,
    hasIndeterminateStep,
    unresolvedExtraneous,
    finalAnswerResult,
    mathematicallyCorrect,
    opsUsed: budget.used,
    budgetExceeded,
  };
}
