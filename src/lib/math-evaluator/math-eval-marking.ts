/**
 * GAM EDU — Step 5A.2 Pure Module 9: Declarative Formative Marking-Scheme Engine
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies, zero Firestore writes.
 * Evaluates optional author-defined M (Method), A (Accuracy), B (Independent), and
 * authorised ECF (Error-Carried-Forward) marking rules under the SAME cumulative
 * EvalOpBudget used by `verifyWorkingChain` (never reset per predicate).
 *
 * Key Integrity Guarantees:
 * - Mathematical equivalence alone NEVER satisfies a `required-form` or factored-form
 *   method predicate (e.g. `x^2 - x - 2 = 0` cannot earn a factorisation mark for `(x - 2)(x + 1) = 0`).
 * - Copying an expected intermediate expression into otherwise invalid working does NOT
 *   earn a method mark when `requireValidTransition` is true (default for M marks).
 * - ECF is awarded ONLY when explicitly authorised (`allowErrorCarriedForward: true`),
 *   only when the follow-through transition is mathematically valid from the prior line
 *   AND achieves the intended milestone, and NEVER bypasses prerequisite `requiresMarkIds`.
 * - Shared independent marks + `max(...)` across mutually exclusive `strategyGroups`
 *   guarantees ZERO duplicate marks and never exceeds `maxMarks`.
 */

import { EvalOpBudget, MathEvalLimitError } from './math-eval-limits';
import { parseEvalExpr } from './math-eval-parser';
import {
  checkSymbolicEquivalence,
  hasCollectedLikeTermsAst,
  isExpandedPolynomialAst,
  isFullyFactoredFormAst,
  isReducedFractionAst,
  isSimplifiedFractionAst,
  isSimplifiedSurdAst,
  type BigRat,
} from './math-eval-exact';
import {
  areExcludedSetsEqual,
  areIntervalUnionsEqual,
  exactRootEqual,
  parseExactRoot,
  parseExcludedValuesSet,
  parseIntervalOrInequality,
  splitEquation,
} from './math-eval-domain-solutions';
import {
  certifyEquationStepSolutions,
  isCompletedSquareForm,
  type StepOperationKind,
  type StepTransitionStatus,
  type WorkingChainResult,
  type WorkingStepInput,
  type WorkspaceVerificationConfig,
} from './math-eval-step-verifier';

export type MarkCategory = 'M' | 'A' | 'B';

export type RequiredStepForm =
  | 'factored-form'
  | 'expanded-polynomial'
  | 'collected-like-terms'
  | 'reduced-fraction'
  | 'simplified-fraction'
  | 'simplified-surd'
  | 'completed-square';

export type MarkPredicate =
  | {
      kind: 'expression-equivalent';
      targetExpr: string;
      requireValidTransition?: boolean;
    }
  | {
      kind: 'required-form';
      targetExpr: string;
      form: RequiredStepForm;
      requireValidTransition?: boolean;
    }
  | {
      kind: 'equation-equivalent';
      targetEquation: string;
      requiredForm?: 'factored-form' | 'completed-square' | 'expanded-polynomial';
      requireValidTransition?: boolean;
    }
  | {
      kind: 'certified-transition';
      expectedStatus?: StepTransitionStatus;
      expectedOperation?: StepOperationKind;
    }
  | {
      kind: 'domain-restriction';
      expectedExcluded?: string[];
      expectedDomainInterval?: string;
    }
  | {
      kind: 'extraneous-rejection';
      expectedRejected: string[];
    }
  | {
      kind: 'final-answer';
      requireValidWorking?: boolean;
    }
  | {
      kind: 'follow-through-step';
      /** Requires a valid transition (exact/symbolic equivalence) on a step at or after earliest error, reaching an isolated root/value. */
      requireIsolatedFinalVariable?: boolean;
    };

export interface MarkRuleDef {
  markId: string;
  type: MarkCategory;
  points: number;
  description: string;
  requiresMarkIds?: string[];
  allowErrorCarriedForward?: boolean;
  predicate: MarkPredicate;
}

export interface MarkingStrategyGroupDef {
  id: string;
  label: string;
  marks: MarkRuleDef[];
}

export interface MarkingSchemeDef {
  maxMarks: number;
  sharedIndependentMarks?: MarkRuleDef[];
  strategyGroups: MarkingStrategyGroupDef[];
}

export interface AwardedMarkDetail {
  markId: string;
  type: MarkCategory;
  points: number;
  maxPoints: number;
  awarded: boolean;
  awardedViaEcf: boolean;
  matchedStepIndex: number | null;
  reason: string;
}

export interface MarkingEvaluationResult {
  marksAwarded: number;
  maxMarks: number;
  selectedStrategyId: string | null;
  selectedStrategyLabel: string | null;
  markDetails: AwardedMarkDetail[];
  budgetExceeded: boolean;
  formativeDisclaimer: string;
}

const VALID_TRANSITION_STATUSES: ReadonlySet<StepTransitionStatus> = new Set([
  'exact-equivalence',
  'symbolic-equivalence',
  'valid-implication-extraneous-risk',
]);

function checkSyntacticForm(
  rawExpr: string,
  targetExpr: string,
  form: RequiredStepForm,
  variables: string[],
  budget: EvalOpBudget,
): boolean {
  const v0 = variables[0] ?? 'x';
  if (form === 'completed-square') {
    return isCompletedSquareForm(rawExpr, v0);
  }
  const ast = parseEvalExpr(rawExpr, { allowedVariables: variables }).ast;
  if (form === 'factored-form') return isFullyFactoredFormAst(ast, variables, budget);
  if (form === 'expanded-polynomial') return isExpandedPolynomialAst(ast);
  if (form === 'collected-like-terms') return hasCollectedLikeTermsAst(ast, budget);
  if (form === 'reduced-fraction') return isReducedFractionAst(ast);
  if (form === 'simplified-surd') return isSimplifiedSurdAst(ast);
  if (form === 'simplified-fraction') {
    const expAst = parseEvalExpr(targetExpr, { allowedVariables: variables }).ast;
    return isSimplifiedFractionAst(ast, expAst, budget);
  }
  return false;
}

function evaluateRulePredicate(
  rule: MarkRuleDef,
  config: WorkspaceVerificationConfig,
  steps: WorkingStepInput[],
  chain: WorkingChainResult,
  budget: EvalOpBudget,
): { matched: boolean; viaEcf: boolean; stepIndex: number | null; reason: string } {
  budget.tick();
  const pred = rule.predicate;
  const activeVar = config.variables[0] ?? 'x';
  const posVars = new Set<string>();
  for (const [vk, vv] of Object.entries(config.domainRestrictions?.variableAssumptions ?? {})) {
    if (vv === 'positive') posVars.add(vk);
  }

  const isStepTransitionValid = (idx: number): boolean => {
    const sr = chain.stepResults[idx];
    return Boolean(sr && VALID_TRANSITION_STATUSES.has(sr.status));
  };

  if (pred.kind === 'final-answer') {
    if (pred.requireValidWorking && chain.hasInvalidStep) {
      return { matched: false, viaEcf: false, stepIndex: null, reason: 'Final answer requires error-free working.' };
    }
    if (chain.finalAnswerResult.passed) {
      return {
        matched: true,
        viaEcf: false,
        stepIndex: Math.max(0, steps.length - 1),
        reason: 'Final answer independently verified.',
      };
    }
    return { matched: false, viaEcf: false, stepIndex: null, reason: 'Final answer did not match required target.' };
  }

  if (pred.kind === 'domain-restriction') {
    for (let i = 0; i < steps.length; i++) {
      const note = (steps[i].domainNote ?? '').trim();
      if (!note) continue;
      let ok = true;
      if (pred.expectedExcluded && pred.expectedExcluded.length > 0) {
        const expSet: BigRat[] = [];
        for (const ex of pred.expectedExcluded) {
          const pr = parseExactRoot(ex, budget);
          if (pr && pr.kind === 'rat') expSet.push(pr.value);
        }
        try {
          const lrnSet = parseExcludedValuesSet(note, activeVar, budget);
          if (!areExcludedSetsEqual(expSet, lrnSet)) ok = false;
        } catch {
          ok = false;
        }
      }
      if (ok && pred.expectedDomainInterval) {
        try {
          const expIv = parseIntervalOrInequality(pred.expectedDomainInterval, activeVar);
          const lrnIv = parseIntervalOrInequality(note, activeVar);
          if (!areIntervalUnionsEqual(expIv, lrnIv)) ok = false;
        } catch {
          ok = false;
        }
      }
      if (ok) {
        return { matched: true, viaEcf: false, stepIndex: i, reason: 'Required domain restriction explicitly stated.' };
      }
    }
    return { matched: false, viaEcf: false, stepIndex: null, reason: 'Required domain restriction not stated accurately.' };
  }

  if (pred.kind === 'extraneous-rejection') {
    const expectedRoots = pred.expectedRejected
      .map((r) => parseExactRoot(r, budget))
      .filter((r): r is NonNullable<typeof r> => r !== null);
    for (let i = 0; i < steps.length; i++) {
      const rejList = steps[i].rejectedExtraneous ?? [];
      if (rejList.length === 0) continue;
      const lrnRoots = rejList
        .map((r) => parseExactRoot(r, budget))
        .filter((r): r is NonNullable<typeof r> => r !== null);
      const allFound = expectedRoots.every((er) => lrnRoots.some((lr) => exactRootEqual(er, lr)));
      if (allFound) {
        return { matched: true, viaEcf: false, stepIndex: i, reason: 'Extraneous candidate(s) explicitly verified and rejected.' };
      }
    }
    return { matched: false, viaEcf: false, stepIndex: null, reason: 'Extraneous candidate(s) not explicitly rejected.' };
  }

  if (pred.kind === 'certified-transition') {
    for (let i = 0; i < chain.stepResults.length; i++) {
      const sr = chain.stepResults[i];
      if (pred.expectedStatus && sr.status !== pred.expectedStatus) continue;
      if (pred.expectedOperation && sr.operation !== pred.expectedOperation) continue;
      if (!pred.expectedStatus && !VALID_TRANSITION_STATUSES.has(sr.status)) continue;
      return { matched: true, viaEcf: false, stepIndex: i, reason: `Verified transition (${sr.status}) on Step ${i + 1}.` };
    }
    return { matched: false, viaEcf: false, stepIndex: null, reason: 'Required certified transformation step not demonstrated.' };
  }

  if (pred.kind === 'follow-through-step') {
    if (!rule.allowErrorCarriedForward) {
      return { matched: false, viaEcf: false, stepIndex: null, reason: 'ECF not authorised on this rule.' };
    }
    // Look for a valid algebraic/equation follow-through step strictly AFTER the earliest error!
    if (chain.earliestErrorIndex === null) {
      // No error occurred: normal valid final/follow-through step qualifies directly
      if (chain.finalAnswerResult.passed) {
        return { matched: true, viaEcf: false, stepIndex: Math.max(0, steps.length - 1), reason: 'Milestone achieved without error.' };
      }
      return { matched: false, viaEcf: false, stepIndex: null, reason: 'Follow-through milestone not reached.' };
    }
    for (let i = chain.earliestErrorIndex + 1; i < chain.stepResults.length; i++) {
      const sr = chain.stepResults[i];
      if (sr.status !== 'exact-equivalence' && sr.status !== 'symbolic-equivalence') continue;
      if (pred.requireIsolatedFinalVariable) {
        const isolatedRe = new RegExp(`^${activeVar}\\s*=\\s*[^=${activeVar}]+$`);
        if (!isolatedRe.test(steps[i].math.trim())) continue;
      }
      return {
        matched: true,
        viaEcf: true,
        stepIndex: i,
        reason: `Valid Error-Carried-Forward (ECF) follow-through verified on Step ${i + 1} after earlier slip on Step ${chain.earliestErrorIndex + 1}.`,
      };
    }
    return { matched: false, viaEcf: false, stepIndex: null, reason: 'No valid follow-through step demonstrated after earlier error.' };
  }

  if (pred.kind === 'expression-equivalent' || pred.kind === 'required-form') {
    const requireValid = pred.requireValidTransition ?? rule.type === 'M';
    const targetAst = parseEvalExpr(pred.targetExpr, { allowedVariables: config.variables }).ast;
    for (let i = 0; i < steps.length; i++) {
      if (requireValid && !isStepTransitionValid(i)) continue;
      const raw = steps[i].math.trim();
      if (!raw || raw.includes('=')) continue;
      try {
        const sAst = parseEvalExpr(raw, { allowedVariables: config.variables }).ast;
        const eq = checkSymbolicEquivalence(sAst, targetAst, budget, posVars);
        if (eq !== 'exact' && eq !== 'symbolic') continue;
        if (pred.kind === 'required-form') {
          if (!checkSyntacticForm(raw, pred.targetExpr, pred.form, config.variables, budget)) continue;
        }
        return {
          matched: true,
          viaEcf: false,
          stepIndex: i,
          reason:
            pred.kind === 'required-form'
              ? `Demonstrated required ${pred.form} milestone on Step ${i + 1}.`
              : `Demonstrated equivalent expression milestone on Step ${i + 1}.`,
        };
      } catch {
        continue;
      }
    }
    return {
      matched: false,
      viaEcf: false,
      stepIndex: null,
      reason:
        pred.kind === 'required-form'
          ? `Required form (${pred.form}) milestone not demonstrated in valid working.`
          : 'Required intermediate expression not demonstrated in valid working.',
    };
  }

  if (pred.kind === 'equation-equivalent') {
    const requireValid = pred.requireValidTransition ?? rule.type === 'M';
    const targetSols = certifyEquationStepSolutions(pred.targetEquation, activeVar, budget);
    if (targetSols.kind !== 'finite') {
      return { matched: false, viaEcf: false, stepIndex: null, reason: 'Target equation could not be certified.' };
    }
    for (let i = 0; i < steps.length; i++) {
      if (requireValid && !isStepTransitionValid(i)) continue;
      const raw = steps[i].math.trim();
      if (!raw.includes('=')) continue;
      const stepSols = certifyEquationStepSolutions(raw, activeVar, budget);
      if (stepSols.kind !== 'finite') continue;
      const sameRoots =
        stepSols.roots.length === targetSols.roots.length &&
        stepSols.roots.every((r) => targetSols.roots.some((t) => exactRootEqual(r, t)));
      if (!sameRoots) continue;

      // CRITICAL: Equivalence alone NEVER earns a method mark when requiredForm is set!
      if (pred.requiredForm) {
        if (raw.split('=').length !== 2) continue;
        const { lhs, rhs } = splitEquation(raw);
        let formOk = false;
        if (pred.requiredForm === 'completed-square') {
          formOk = isCompletedSquareForm(raw, activeVar);
        } else if (pred.requiredForm === 'factored-form') {
          // One side must be 0 and the other side must be genuinely factored (e.g. (x-2)(x+1) = 0)!
          const rhsZero = rhs.trim() === '0';
          const lhsZero = lhs.trim() === '0';
          const nonZeroSide = rhsZero ? lhs : lhsZero ? rhs : null;
          if (nonZeroSide) {
            try {
              const nzAst = parseEvalExpr(nonZeroSide, { allowedVariables: config.variables }).ast;
              formOk = isFullyFactoredFormAst(nzAst, config.variables, budget);
            } catch {
              formOk = false;
            }
          }
        } else if (pred.requiredForm === 'expanded-polynomial') {
          try {
            formOk =
              isExpandedPolynomialAst(parseEvalExpr(lhs, { allowedVariables: config.variables }).ast) &&
              isExpandedPolynomialAst(parseEvalExpr(rhs, { allowedVariables: config.variables }).ast);
          } catch {
            formOk = false;
          }
        }
        if (!formOk) continue;
      }

      return {
        matched: true,
        viaEcf: false,
        stepIndex: i,
        reason: pred.requiredForm
          ? `Demonstrated ${pred.requiredForm} equation milestone on Step ${i + 1}.`
          : `Demonstrated equivalent equation milestone on Step ${i + 1}.`,
      };
    }
    return {
      matched: false,
      viaEcf: false,
      stepIndex: null,
      reason: pred.requiredForm
        ? `Required equation form (${pred.requiredForm}) milestone not demonstrated.`
        : 'Required intermediate equation milestone not demonstrated.',
    };
  }

  return { matched: false, viaEcf: false, stepIndex: null, reason: 'Unsupported marking predicate.' };
}

function evaluateRuleList(
  rules: MarkRuleDef[],
  priorAwardedIds: Set<string>,
  config: WorkspaceVerificationConfig,
  steps: WorkingStepInput[],
  chain: WorkingChainResult,
  budget: EvalOpBudget,
): { points: number; details: AwardedMarkDetail[]; awardedIds: Set<string> } {
  const awardedIds = new Set<string>(priorAwardedIds);
  const details: AwardedMarkDetail[] = [];
  let points = 0;

  for (const rule of rules) {
    // Prevent duplicate award of any markId
    if (awardedIds.has(rule.markId)) {
      details.push({
        markId: rule.markId,
        type: rule.type,
        points: 0,
        maxPoints: rule.points,
        awarded: false,
        awardedViaEcf: false,
        matchedStepIndex: null,
        reason: 'Duplicate mark prevented.',
      });
      continue;
    }

    // Check prerequisites (ECF NEVER bypasses required method prerequisites!)
    const missingPrereqs = (rule.requiresMarkIds ?? []).filter((req) => !awardedIds.has(req));
    if (missingPrereqs.length > 0) {
      details.push({
        markId: rule.markId,
        type: rule.type,
        points: 0,
        maxPoints: rule.points,
        awarded: false,
        awardedViaEcf: false,
        matchedStepIndex: null,
        reason: `Requires prerequisite mark(s): ${missingPrereqs.join(', ')}.`,
      });
      continue;
    }

    const res = evaluateRulePredicate(rule, config, steps, chain, budget);
    if (res.matched) {
      awardedIds.add(rule.markId);
      points += rule.points;
      details.push({
        markId: rule.markId,
        type: rule.type,
        points: rule.points,
        maxPoints: rule.points,
        awarded: true,
        awardedViaEcf: res.viaEcf,
        matchedStepIndex: res.stepIndex,
        reason: res.reason,
      });
    } else {
      details.push({
        markId: rule.markId,
        type: rule.type,
        points: 0,
        maxPoints: rule.points,
        awarded: false,
        awardedViaEcf: false,
        matchedStepIndex: null,
        reason: res.reason,
      });
    }
  }

  return { points, details, awardedIds };
}

/**
 * Evaluates a declarative marking scheme using the SAME cumulative EvalOpBudget.
 */
export function evaluateMarkingScheme(
  scheme: MarkingSchemeDef,
  config: WorkspaceVerificationConfig,
  steps: WorkingStepInput[],
  chain: WorkingChainResult,
  sharedBudget: EvalOpBudget,
): MarkingEvaluationResult {
  const disclaimer =
    'Formative practice mark breakdown only — not an official examination score or gradebook record.';

  if (chain.budgetExceeded) {
    return {
      marksAwarded: 0,
      maxMarks: scheme.maxMarks,
      selectedStrategyId: null,
      selectedStrategyLabel: null,
      markDetails: [],
      budgetExceeded: true,
      formativeDisclaimer: disclaimer,
    };
  }

  try {
    // 1. Evaluate shared independent marks (B marks) ONCE globally
    const sharedRes = evaluateRuleList(
      scheme.sharedIndependentMarks ?? [],
      new Set<string>(),
      config,
      steps,
      chain,
      sharedBudget,
    );

    // 2. Evaluate each mutually exclusive strategy group and pick max() (prevents double counting!)
    let bestStrategy: {
      id: string;
      label: string;
      points: number;
      details: AwardedMarkDetail[];
    } | null = null;

    for (const grp of scheme.strategyGroups) {
      sharedBudget.tick();
      const res = evaluateRuleList(grp.marks, sharedRes.awardedIds, config, steps, chain, sharedBudget);
      if (!bestStrategy || res.points > bestStrategy.points) {
        bestStrategy = { id: grp.id, label: grp.label, points: res.points, details: res.details };
      }
    }

    const combinedPoints = Math.min(scheme.maxMarks, sharedRes.points + (bestStrategy?.points ?? 0));
    const combinedDetails = [...sharedRes.details, ...(bestStrategy?.details ?? [])];

    return {
      marksAwarded: combinedPoints,
      maxMarks: scheme.maxMarks,
      selectedStrategyId: bestStrategy?.id ?? null,
      selectedStrategyLabel: bestStrategy?.label ?? null,
      markDetails: combinedDetails,
      budgetExceeded: false,
      formativeDisclaimer: disclaimer,
    };
  } catch (e) {
    if (e instanceof MathEvalLimitError && e.code === 'LIMIT_EXCEEDED') {
      return {
        marksAwarded: 0,
        maxMarks: scheme.maxMarks,
        selectedStrategyId: null,
        selectedStrategyLabel: null,
        markDetails: [],
        budgetExceeded: true,
        formativeDisclaimer: disclaimer,
      };
    }
    throw e;
  }
}
