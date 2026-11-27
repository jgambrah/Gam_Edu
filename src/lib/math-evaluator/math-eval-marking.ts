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
      /** When true, learner must provide verified substitution/domain evidence (`candidateChecks`), not merely declare the number. */
      requireEvidence?: boolean;
    }
  | {
      kind: 'final-answer';
      requireValidWorking?: boolean;
    }
  | {
      kind: 'follow-through-step';
      /** Requires a valid transition (exact/symbolic equivalence) on a step after an eligible earlier error, reaching an isolated root/value without trivial repetition. */
      requireIsolatedFinalVariable?: boolean;
      /** Error statuses eligible for ECF (default: ['invalid-transformation'], excluding lost-solution & domain-violation errors). */
      eligibleErrorStatuses?: StepTransitionStatus[];
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

function normStepText(raw?: string): string {
  return (raw ?? '').replace(/\s+/g, '').replace(/[\u2212\u2013]/g, '-').toLowerCase();
}

function checkSyntacticForm(
  rawExpr: string,
  targetExpr: string,
  form: RequiredStepForm,
  variables: string[],
  budget: EvalOpBudget,
): boolean {
  const v0 = variables[0] ?? 'x';
  if (form === 'completed-square') {
    return isCompletedSquareForm(rawExpr, v0, budget);
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
    for (let i = 0; i < chain.stepResults.length; i++) {
      const sr = chain.stepResults[i];
      // Never award rejection mark on a step that contradicted a valid root
      if (sr.status === 'lost-solution-error') continue;
      const verifiedList = sr.verifiedRejectedExtraneous ?? [];
      if (verifiedList.length === 0) continue;
      const eligible = pred.requireEvidence ? verifiedList.filter((v) => v.hasVerifiedEvidence) : verifiedList;
      if (eligible.length === 0) continue;
      const lrnRoots = eligible
        .map((v) => parseExactRoot(v.candidate, budget))
        .filter((r): r is NonNullable<typeof r> => r !== null);
      const allFound = expectedRoots.every((er) => lrnRoots.some((lr) => exactRootEqual(er, lr)));
      if (allFound) {
        return {
          matched: true,
          viaEcf: false,
          stepIndex: i,
          reason: pred.requireEvidence
            ? 'Extraneous candidate(s) rejected with verified substitution/domain evidence.'
            : 'Extraneous candidate(s) independently verified invalid against the original equation and rejected.',
        };
      }
    }
    return {
      matched: false,
      viaEcf: false,
      stepIndex: null,
      reason: pred.requireEvidence
        ? 'Extraneous candidate rejection requires verified substitution or domain evidence.'
        : 'Extraneous candidate(s) not validly rejected against the original equation.',
    };
  }

  if (pred.kind === 'certified-transition') {
    for (let i = 0; i < chain.stepResults.length; i++) {
      const sr = chain.stepResults[i];
      if (pred.expectedStatus && sr.status !== pred.expectedStatus) continue;
      if (!pred.expectedStatus && !VALID_TRANSITION_STATUSES.has(sr.status)) continue;

      // Reject trivial no-op repetition of the previous line
      if (sr.prevMath && normStepText(sr.rawMath) === normStepText(sr.prevMath)) continue;

      // Verify actual mathematical operation evidence (NEVER trust dropdown label alone!)
      if (pred.expectedOperation) {
        if (pred.expectedOperation === 'differentiate' || pred.expectedOperation === 'integrate') {
          if (sr.operation !== pred.expectedOperation || !VALID_TRANSITION_STATUSES.has(sr.status)) continue;
        } else if (pred.expectedOperation === 'check-candidates') {
          if ((sr.verifiedRejectedExtraneous ?? []).length === 0) continue;
        } else if (pred.expectedOperation === 'complete-square') {
          if (!isCompletedSquareForm(sr.rawMath, activeVar, budget)) continue;
        } else if (pred.expectedOperation === 'factorise') {
          const exprToCheck = sr.rawMath.includes('=') && sr.rawMath.split('=').length === 2
            ? (splitEquation(sr.rawMath).rhs.trim() === '0' ? splitEquation(sr.rawMath).lhs : splitEquation(sr.rawMath).rhs)
            : sr.rawMath;
          try {
            const ast = parseEvalExpr(exprToCheck, { allowedVariables: config.variables }).ast;
            if (!isFullyFactoredFormAst(ast, config.variables, budget)) continue;
          } catch (e) {
            if (e instanceof MathEvalLimitError && e.code === 'LIMIT_EXCEEDED') throw e;
            continue;
          }
        } else if (pred.expectedOperation === 'expand') {
          const exprToCheck = sr.rawMath.includes('=') && sr.rawMath.split('=').length === 2
            ? splitEquation(sr.rawMath).lhs
            : sr.rawMath;
          try {
            const ast = parseEvalExpr(exprToCheck, { allowedVariables: config.variables }).ast;
            if (!isExpandedPolynomialAst(ast)) continue;
          } catch (e) {
            if (e instanceof MathEvalLimitError && e.code === 'LIMIT_EXCEEDED') throw e;
            continue;
          }
        } else if (sr.operation !== pred.expectedOperation) {
          continue;
        }
      }
      return { matched: true, viaEcf: false, stepIndex: i, reason: `Verified transition (${sr.status}) on Step ${i + 1}.` };
    }
    return { matched: false, viaEcf: false, stepIndex: null, reason: 'Required certified transformation step not demonstrated.' };
  }

  if (pred.kind === 'follow-through-step') {
    if (!rule.allowErrorCarriedForward) {
      return { matched: false, viaEcf: false, stepIndex: null, reason: 'ECF not authorised on this rule.' };
    }
    if (chain.earliestErrorIndex === null) {
      if (chain.finalAnswerResult.passed) {
        return { matched: true, viaEcf: false, stepIndex: Math.max(0, steps.length - 1), reason: 'Milestone achieved without error.' };
      }
      return { matched: false, viaEcf: false, stepIndex: null, reason: 'Follow-through milestone not reached.' };
    }

    // Only allow ECF after eligible error categories (default: arithmetic/algebraic slip `invalid-transformation`,
    // explicitly excluding fundamentally invalid operations like lost-solution or domain-violation errors!)
    const eligibleErrs = new Set<StepTransitionStatus>(
      pred.eligibleErrorStatuses ?? ['invalid-transformation'],
    );
    const earliestStatus = chain.stepResults[chain.earliestErrorIndex]?.status;
    if (!earliestStatus || !eligibleErrs.has(earliestStatus)) {
      return {
        matched: false,
        viaEcf: false,
        stepIndex: null,
        reason: `ECF not eligible after "${earliestStatus ?? 'unknown'}" error on Step ${chain.earliestErrorIndex + 1}.`,
      };
    }

    for (let i = chain.earliestErrorIndex + 1; i < chain.stepResults.length; i++) {
      const sr = chain.stepResults[i];
      if (sr.status !== 'exact-equivalence' && sr.status !== 'symbolic-equivalence') continue;
      // Reject trivial repetition of the erroneous line (must make genuine mathematical progress!)
      if (sr.prevMath && normStepText(sr.rawMath) === normStepText(sr.prevMath)) continue;
      if (pred.requireIsolatedFinalVariable) {
        const isolatedRe = new RegExp(`^${activeVar}\\s*=\\s*[^=${activeVar}]+$`);
        if (!isolatedRe.test(steps[i].math.trim())) continue;
      }
      return {
        matched: true,
        viaEcf: true,
        stepIndex: i,
        reason: `Valid Error-Carried-Forward (ECF) follow-through verified on Step ${i + 1} after eligible slip on Step ${chain.earliestErrorIndex + 1}.`,
      };
    }
    return { matched: false, viaEcf: false, stepIndex: null, reason: 'No valid non-trivial follow-through step demonstrated after earlier error.' };
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
          formOk = isCompletedSquareForm(raw, activeVar, budget);
        } else if (pred.requiredForm === 'factored-form') {
          // One side must be 0 and the other side must be genuinely factored (e.g. (x-2)(x+1) = 0)!
          const rhsZero = rhs.trim() === '0';
          const lhsZero = lhs.trim() === '0';
          const nonZeroSide = rhsZero ? lhs : lhsZero ? rhs : null;
          if (nonZeroSide) {
            try {
              const nzAst = parseEvalExpr(nonZeroSide, { allowedVariables: config.variables }).ast;
              formOk = isFullyFactoredFormAst(nzAst, config.variables, budget);
            } catch (e) {
              if (e instanceof MathEvalLimitError && e.code === 'LIMIT_EXCEEDED') throw e;
              formOk = false;
            }
          }
        } else if (pred.requiredForm === 'expanded-polynomial') {
          try {
            formOk =
              isExpandedPolynomialAst(parseEvalExpr(lhs, { allowedVariables: config.variables }).ast) &&
              isExpandedPolynomialAst(parseEvalExpr(rhs, { allowedVariables: config.variables }).ast);
          } catch (e) {
            if (e instanceof MathEvalLimitError && e.code === 'LIMIT_EXCEEDED') throw e;
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
