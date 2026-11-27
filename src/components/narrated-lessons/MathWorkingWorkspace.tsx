'use client';

import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Eye,
  HelpCircle,
  Info,
  Plus,
  RotateCcw,
  Trash2,
  Undo2,
  XCircle,
} from 'lucide-react';
import type { MathEvaluatorInteractiveConfig } from '@/lib/narrated-lessons/interactive-schema';
import {
  MATH_EVAL_LIMITS,
  evaluateWorkingWorkspace,
  type MathMultiStepWorkingSpec,
  type StepOperationKind,
  type StepTransitionStatus,
  type WorkingStepInput,
  type WorkspaceEvaluationResult,
} from '@/lib/math-evaluator/math-eval-engine';
import { MathPreview } from './MathPreview';

type WorkspaceConfig = Extract<MathEvaluatorInteractiveConfig, { mode: 'multi-step-working' }>;

interface KeypadKeyDef {
  label: string;
  insert: string;
  aria: string;
  cursorBack?: number;
}

const PRIMARY_KEYS: KeypadKeyDef[] = [
  { label: '+', insert: ' + ', aria: 'Insert plus' },
  { label: '−', insert: ' - ', aria: 'Insert minus' },
  { label: '×', insert: ' * ', aria: 'Insert multiply' },
  { label: '÷', insert: ' / ', aria: 'Insert divide' },
  { label: '=', insert: ' = ', aria: 'Insert equals' },
  { label: 'a/b', insert: '()/()', aria: 'Insert fraction template', cursorBack: 4 },
  { label: '(', insert: '(', aria: 'Insert opening bracket' },
  { label: ')', insert: ')', aria: 'Insert closing bracket' },
];

const LOWER_SEC_EXTRA: KeypadKeyDef[] = [
  { label: 'x', insert: 'x', aria: 'Insert variable x' },
  { label: 'y', insert: 'y', aria: 'Insert variable y' },
  { label: 'x²', insert: '^2', aria: 'Insert squared' },
  { label: 'xⁿ', insert: '^()', aria: 'Insert exponent template', cursorBack: 1 },
  { label: '√()', insert: 'sqrt()', aria: 'Insert square root template', cursorBack: 1 },
  { label: '<', insert: ' < ', aria: 'Insert less than' },
  { label: '≤', insert: ' <= ', aria: 'Insert less than or equal to' },
  { label: '>', insert: ' > ', aria: 'Insert greater than' },
  { label: '≥', insert: ' >= ', aria: 'Insert greater than or equal to' },
  { label: '≠', insert: ' != ', aria: 'Insert not equal to' },
];

const IGCSE_EXTRA: KeypadKeyDef[] = [
  { label: 'π', insert: 'pi', aria: 'Insert pi' },
  { label: '|□|', insert: 'abs()', aria: 'Insert absolute value template', cursorBack: 1 },
  { label: 'sin()', insert: 'sin()', aria: 'Insert sine function', cursorBack: 1 },
  { label: 'cos()', insert: 'cos()', aria: 'Insert cosine function', cursorBack: 1 },
  { label: 'tan()', insert: 'tan()', aria: 'Insert tangent function', cursorBack: 1 },
  { label: '∪', insert: ' U ', aria: 'Insert interval union' },
  { label: '∞', insert: 'inf', aria: 'Insert infinity' },
];

const ALEVEL_EXTRA: KeypadKeyDef[] = [
  { label: 'e', insert: 'e', aria: 'Insert Euler constant e' },
  { label: 'ln()', insert: 'ln()', aria: 'Insert natural logarithm', cursorBack: 1 },
  { label: 'log₁₀()', insert: 'log10()', aria: 'Insert base-10 logarithm', cursorBack: 1 },
  { label: '+ C', insert: ' + C', aria: 'Insert constant of integration plus C' },
  { label: "f'(x)=", insert: "f'(x) = ", aria: 'Insert derivative prefix' },
];

export function getKeypadForProfile(
  profile: 'primary' | 'lower-secondary' | 'igcse' | 'as-a-level',
): KeypadKeyDef[] {
  if (profile === 'primary') return PRIMARY_KEYS;
  if (profile === 'lower-secondary') return [...PRIMARY_KEYS, ...LOWER_SEC_EXTRA];
  if (profile === 'igcse') return [...PRIMARY_KEYS, ...LOWER_SEC_EXTRA, ...IGCSE_EXTRA];
  return [...PRIMARY_KEYS, ...LOWER_SEC_EXTRA, ...IGCSE_EXTRA, ...ALEVEL_EXTRA];
}

const STATUS_BADGE: Record<
  StepTransitionStatus,
  { label: string; tone: string }
> = {
  'exact-equivalence': { label: 'Exact equivalence', tone: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
  'symbolic-equivalence': { label: 'Symbolic equivalence', tone: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
  'valid-implication-extraneous-risk': {
    label: 'Valid implication (check candidates)',
    tone: 'border-amber-300 bg-amber-50 text-amber-950',
  },
  'lost-solution-error': { label: 'Lost solution error', tone: 'border-rose-300 bg-rose-50 text-rose-950' },
  'domain-violation-error': { label: 'Domain violation', tone: 'border-rose-300 bg-rose-50 text-rose-950' },
  'invalid-transformation': { label: 'Invalid step', tone: 'border-rose-300 bg-rose-50 text-rose-950' },
  'syntax-error': { label: 'Syntax error', tone: 'border-amber-300 bg-amber-50 text-amber-950' },
  'indeterminate-unverified': {
    label: 'Indeterminate (not marked wrong)',
    tone: 'border-slate-300 bg-slate-100 text-slate-800',
  },
};

function makeEmptyStep(defaultOp?: StepOperationKind): WorkingStepInput {
  return { math: '', operation: defaultOp };
}

export function MathWorkingWorkspace({ config }: { config: WorkspaceConfig }) {
  const maxSteps = Math.min(config.maxWorkingSteps ?? MATH_EVAL_LIMITS.maxWorkingSteps, MATH_EVAL_LIMITS.maxWorkingSteps);
  const keypadProfile = config.keypadProfile ?? config.curriculumLevel;
  const keypadKeys = getKeypadForProfile(keypadProfile);

  const [steps, setSteps] = useState<WorkingStepInput[]>([makeEmptyStep()]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [undoStack, setUndoStack] = useState<WorkingStepInput[][]>([]);
  const [evaluation, setEvaluation] = useState<WorkspaceEvaluationResult | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showWorkedSolutions, setShowWorkedSolutions] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Changing any earlier or current step immediately invalidates dependent feedback and marks
  const commitSteps = (nextSteps: WorkingStepInput[], recordUndo = true) => {
    if (recordUndo) {
      setUndoStack((prev) => {
        const snapshot = steps.map((s) => ({ ...s, rejectedExtraneous: s.rejectedExtraneous ? [...s.rejectedExtraneous] : undefined }));
        const next = [...prev, snapshot];
        return next.length > MATH_EVAL_LIMITS.maxUndoHistory ? next.slice(next.length - MATH_EVAL_LIMITS.maxUndoHistory) : next;
      });
    }
    setSteps(nextSteps);
    setEvaluation(null);
    setSubmitted(false);
  };

  const updateStep = (idx: number, patch: Partial<WorkingStepInput>) => {
    const next = steps.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    commitSteps(next);
  };

  const addStepAfter = (idx: number) => {
    if (steps.length >= maxSteps) return;
    const next = [...steps.slice(0, idx + 1), makeEmptyStep(), ...steps.slice(idx + 1)];
    commitSteps(next);
    const nextFocus = idx + 1;
    setActiveIndex(nextFocus);
    requestAnimationFrame(() => inputRefs.current[nextFocus]?.focus());
  };

  const deleteStep = (idx: number) => {
    if (steps.length <= 1) {
      commitSteps([makeEmptyStep()]);
      setActiveIndex(0);
      return;
    }
    const next = steps.filter((_, i) => i !== idx);
    commitSteps(next);
    const nextFocus = Math.max(0, Math.min(idx, next.length - 1));
    setActiveIndex(nextFocus);
    requestAnimationFrame(() => inputRefs.current[nextFocus]?.focus());
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    setSteps(prev);
    setActiveIndex((idx) => Math.min(idx, Math.max(0, prev.length - 1)));
    setEvaluation(null);
    setSubmitted(false);
  };

  const handleReset = () => {
    setUndoStack([]);
    setSteps([makeEmptyStep()]);
    setActiveIndex(0);
    setEvaluation(null);
    setSubmitted(false);
    setShowHints(false);
    setShowWorkedSolutions(false);
  };

  const insertSnippet = (snippet: string, cursorBack = 0) => {
    const idx = Math.min(activeIndex, steps.length - 1);
    const el = inputRefs.current[idx];
    const current = steps[idx]?.math ?? '';
    const start = el?.selectionStart ?? current.length;
    const end = el?.selectionEnd ?? current.length;
    const nextVal = current.slice(0, start) + snippet + current.slice(end);
    updateStep(idx, { math: nextVal });
    const nextPos = start + snippet.length - cursorBack;
    requestAnimationFrame(() => {
      if (el) {
        el.focus();
        el.setSelectionRange(nextPos, nextPos);
      }
    });
  };

  /** Explicit placeholder navigation: jumps cursor to the next empty `()` slot or closing delimiter. */
  const jumpToNextSlot = () => {
    const idx = Math.min(activeIndex, steps.length - 1);
    const el = inputRefs.current[idx];
    const current = steps[idx]?.math ?? '';
    const pos = el?.selectionStart ?? current.length;
    const emptySlot = current.indexOf('()', pos);
    const nextPos = emptySlot >= 0 ? emptySlot + 1 : Math.min(current.length, current.indexOf(')', pos) + 1 || current.length);
    requestAnimationFrame(() => {
      if (el) {
        el.focus();
        el.setSelectionRange(nextPos, nextPos);
      }
    });
  };

  const handleCheckUpToStep = (upToIndex: number) => {
    const slice = steps.slice(0, upToIndex + 1);
    const res = evaluateWorkingWorkspace(config as MathMultiStepWorkingSpec, slice);
    setEvaluation(res);
  };

  const handleSubmitFull = () => {
    const res = evaluateWorkingWorkspace(config as MathMultiStepWorkingSpec, steps);
    setEvaluation(res);
    setSubmitted(true);
  };

  const hintsAllowed =
    config.learningMode === 'guided' || (submitted && (config.learningMode === 'independent' || config.learningMode === 'exam-practice'));
  const workedSolutionAllowed = submitted || (config.learningMode === 'guided' && Boolean(evaluation?.chain.mathematicallyCorrect));

  const modeBadge =
    config.learningMode === 'guided'
      ? 'Guided Learning'
      : config.learningMode === 'independent'
        ? 'Independent Practice'
        : 'Exam Practice (Formative)';

  return (
    <section
      aria-label={config.accessibilityLabel}
      data-interactive-engine="math-evaluator"
      data-math-mode="multi-step-working"
      data-learning-mode={config.learningMode}
      data-interactive-id={config.id}
      className="mt-3 max-w-full overflow-x-hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-700">
              <Calculator className="h-3 w-3" />
              Math Workspace
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
              {modeBadge}
            </span>
            {config.subjectTag && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                {config.subjectTag}
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-sm font-extrabold text-slate-900 sm:text-base">{config.title}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{config.instructions}</p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            aria-label="Undo last edit"
            className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Undo
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset workspace"
            className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Step 0: Given Problem Statement */}
      <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-700">Given (Step 0)</span>
        <div className="mt-0.5 font-mono text-sm font-bold text-indigo-950 break-words">
          {config.promptMath ?? config.initialStatement}
          {config.initialUnit ? ` ${config.initialUnit}` : ''}
        </div>
      </div>

      {/* Working Steps List */}
      <div className="mt-3 space-y-2.5">
        {steps.map((step, idx) => {
          const stepRes = evaluation?.chain.stepResults[idx];
          const isEarliestErr = evaluation?.chain.earliestErrorIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl border p-2.5 ${
                activeIndex === idx ? 'border-indigo-300 bg-indigo-50/20' : 'border-slate-200 bg-slate-50/40'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="text-xs font-bold text-slate-700">Step {idx + 1}</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {config.problemKind === 'calculus-working' && (
                    <select
                      aria-label={`Step ${idx + 1} operation`}
                      value={step.operation ?? 'simplify'}
                      onChange={(e) => updateStep(idx, { operation: e.target.value as StepOperationKind })}
                      className="min-h-[36px] rounded-lg border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700"
                    >
                      <option value="simplify">Simplify</option>
                      <option value="differentiate">Differentiate</option>
                      <option value="integrate">Integrate</option>
                    </select>
                  )}
                  {config.learningMode === 'guided' && (
                    <button
                      type="button"
                      onClick={() => handleCheckUpToStep(idx)}
                      className="min-h-[36px] rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 text-xs font-bold text-indigo-800 hover:bg-indigo-100"
                    >
                      Check step
                    </button>
                  )}
                  {steps.length < maxSteps && (
                    <button
                      type="button"
                      onClick={() => addStepAfter(idx)}
                      aria-label={`Insert step after step ${idx + 1}`}
                      className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteStep(idx)}
                    aria-label={`Delete step ${idx + 1}`}
                    className="inline-flex min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-slate-200 bg-white text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-1.5 flex flex-wrap gap-2">
                <input
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  value={step.math}
                  onFocus={() => setActiveIndex(idx)}
                  onChange={(e) => updateStep(idx, { math: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.shiftKey) {
                      e.preventDefault();
                      handleSubmitFull();
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      if (idx === steps.length - 1 && steps.length < maxSteps) {
                        addStepAfter(idx);
                      } else {
                        inputRefs.current[idx + 1]?.focus();
                      }
                    }
                  }}
                  placeholder={`Enter working for step ${idx + 1}...`}
                  aria-label={`${config.title} step ${idx + 1} input`}
                  className="min-h-[44px] min-w-[180px] flex-1 rounded-xl border border-slate-300 bg-white px-3 font-mono text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />

                {config.problemKind === 'formula-unit' && (
                  <input
                    type="text"
                    value={step.unit ?? ''}
                    onChange={(e) => updateStep(idx, { unit: e.target.value })}
                    placeholder="Unit (e.g. m/s)"
                    aria-label={`Step ${idx + 1} unit`}
                    className="min-h-[44px] w-28 rounded-xl border border-slate-300 bg-white px-2.5 font-mono text-sm text-slate-900"
                  />
                )}
              </div>

              {/* Optional domain or extraneous rejection metadata for algebra / equation / calculus */}
              {(config.domainRestrictions?.requireLearnerDomain || config.problemKind === 'equation-solving') && (
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {config.domainRestrictions?.requireLearnerDomain && (
                    <input
                      type="text"
                      value={step.domainNote ?? ''}
                      onChange={(e) => updateStep(idx, { domainNote: e.target.value })}
                      placeholder="Domain note (e.g. x != 3)"
                      aria-label={`Step ${idx + 1} domain restriction`}
                      className="min-h-[40px] flex-1 rounded-lg border border-slate-200 bg-white px-2.5 font-mono text-xs text-slate-800"
                    />
                  )}
                  {config.problemKind === 'equation-solving' && (
                    <input
                      type="text"
                      value={(step.rejectedExtraneous ?? []).join(', ')}
                      onChange={(e) => {
                        const list = e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean);
                        updateStep(idx, { rejectedExtraneous: list.length > 0 ? list : undefined });
                      }}
                      placeholder="Rejected extraneous root(s), e.g. -1"
                      aria-label={`Step ${idx + 1} rejected extraneous roots`}
                      className="min-h-[40px] flex-1 rounded-lg border border-slate-200 bg-white px-2.5 font-mono text-xs text-slate-800"
                    />
                  )}
                </div>
              )}

              {/* Live formatted & spoken preview on the active step (never leaks answer!) */}
              {activeIndex === idx && step.math.trim() && !step.math.includes('=') && !/[<>]/.test(step.math) && (
                <MathPreview
                  expression={step.math}
                  allowedVariables={config.variables}
                  allowConstantC={config.problemKind === 'calculus-working'}
                />
              )}

              {/* Step Transition Feedback */}
              {stepRes && (
                <div
                  role="status"
                  aria-live="polite"
                  data-step-status={stepRes.status}
                  className={`mt-2 flex items-start gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium ${STATUS_BADGE[stepRes.status].tone}`}
                >
                  {stepRes.status === 'exact-equivalence' || stepRes.status === 'symbolic-equivalence' ? (
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  ) : stepRes.status === 'valid-implication-extraneous-risk' || stepRes.status === 'syntax-error' ? (
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  ) : stepRes.status === 'indeterminate-unverified' ? (
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold">
                      {STATUS_BADGE[stepRes.status].label}
                      {isEarliestErr ? ' (Earliest verifiable error)' : ''}:{' '}
                    </span>
                    <span>{stepRes.feedback}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Age-Appropriate Mathematical Keypad */}
      <div className="mt-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowKeypad((v) => !v)}
            aria-expanded={showKeypad}
            className="min-h-[44px] rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            {showKeypad ? 'Hide math keypad' : `Show math keypad (${keypadProfile})`}
          </button>
          {steps.length < maxSteps && (
            <button
              type="button"
              onClick={() => addStepAfter(steps.length - 1)}
              className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Add step
            </button>
          )}
        </div>

        {showKeypad && (
          <div
            role="group"
            aria-label="Mathematical keypad"
            className="mt-2 flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-2"
          >
            {keypadKeys.map((k) => (
              <button
                key={k.label}
                type="button"
                aria-label={k.aria}
                onClick={() => insertSnippet(k.insert, k.cursorBack ?? 0)}
                className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 bg-white px-2.5 text-sm font-bold text-slate-800 hover:bg-indigo-50"
              >
                {k.label}
              </button>
            ))}
            <button
              type="button"
              aria-label="Next template slot"
              onClick={jumpToNextSlot}
              className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 text-xs font-bold text-indigo-800 hover:bg-indigo-100"
            >
              Next slot
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Primary Submit Bar */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleSubmitFull}
          className="min-h-[44px] rounded-xl bg-indigo-600 px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {config.learningMode === 'guided' ? 'Check full working' : 'Submit working'}
        </button>
      </div>

      {/* Overall Summary & Optional Formative Mark Breakdown (only after submission or guided check) */}
      {evaluation && (submitted || config.learningMode === 'guided') && (
        <div
          role="status"
          aria-live="polite"
          data-workspace-verdict={evaluation.chain.mathematicallyCorrect ? 'correct' : 'needs-review'}
          className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-extrabold text-slate-900">
              Mathematical Working:{' '}
              {evaluation.chain.mathematicallyCorrect
                ? 'Verified Complete & Valid'
                : evaluation.chain.hasInvalidStep
                  ? `Error detected (first at Step ${(evaluation.chain.earliestErrorIndex ?? 0) + 1})`
                  : evaluation.chain.unresolvedExtraneous.length > 0
                    ? `Unresolved extraneous candidate(s): ${evaluation.chain.unresolvedExtraneous.join(', ')}`
                    : evaluation.chain.hasIndeterminateStep
                      ? 'Contains unverified step(s) — compare carefully with worked solution'
                      : 'Final answer incomplete or does not match target'}
            </span>
            {evaluation.marking && (
              <span
                data-marks-awarded={`${evaluation.marking.marksAwarded}/${evaluation.marking.maxMarks}`}
                className="rounded-full bg-indigo-100 px-2.5 py-0.5 font-extrabold text-indigo-900"
              >
                Formative Marks: {evaluation.marking.marksAwarded} / {evaluation.marking.maxMarks}
              </span>
            )}
          </div>

          <p className="text-slate-700">
            <strong>Final Answer Check:</strong> {evaluation.chain.finalAnswerResult.feedback}
          </p>

          {evaluation.marking && (
            <div className="space-y-1 border-t border-slate-200 pt-2">
              <p className="text-[11px] text-slate-500">{evaluation.marking.formativeDisclaimer}</p>
              <ul className="space-y-1">
                {evaluation.marking.markDetails.map((m) => (
                  <li key={m.markId} className="flex flex-wrap items-center gap-1.5 text-slate-800">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${
                        m.awarded ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {m.markId} ({m.points}/{m.maxPoints}
                      {m.awardedViaEcf ? ' ECF' : ''})
                    </span>
                    <span>{m.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Progressive Hints (strictly gated in independent / exam-practice modes!) */}
      {hintsAllowed && config.hints && config.hints.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowHints((v) => !v)}
            aria-expanded={showHints}
            className="inline-flex min-h-[36px] items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {showHints ? 'Hide hints' : 'Need a hint?'}
          </button>
          {showHints && (
            <ul className="mt-1.5 list-disc space-y-1 rounded-xl border border-indigo-200 bg-indigo-50/60 py-2 pl-6 pr-3 text-xs text-indigo-950">
              {config.hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Worked Model Solutions (strictly concealed until submitted or completed!) */}
      {workedSolutionAllowed && config.workedSolutions.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowWorkedSolutions((v) => !v)}
            aria-expanded={showWorkedSolutions}
            className="inline-flex min-h-[36px] items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
          >
            <Eye className="h-3.5 w-3.5" />
            {showWorkedSolutions ? 'Hide worked model solution' : 'Show worked model solution'}
          </button>
          {showWorkedSolutions && (
            <div className="mt-2 space-y-2 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs">
              {config.workedSolutions.map((ws, wi) => (
                <div key={wi}>
                  <p className="font-bold text-emerald-950">{ws.methodLabel}</p>
                  <ol className="mt-1 list-decimal space-y-1 pl-5 text-slate-800">
                    {ws.steps.map((st, si) => (
                      <li key={si}>
                        <span className="font-mono font-bold">{st.math}</span>
                        {st.domainNote ? <span className="ml-1 font-mono text-indigo-700">({st.domainNote})</span> : null}
                        <span className="ml-1.5 text-slate-600">— {st.note}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
