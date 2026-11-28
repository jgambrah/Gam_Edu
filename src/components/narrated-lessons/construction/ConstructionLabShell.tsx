'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  HelpCircle,
  RotateCcw,
  Undo2,
  Wrench,
  X,
  XCircle,
} from 'lucide-react';
import type { ConstructionPredictionDef } from '@/lib/narrated-lessons/interactive-schema';

export interface ConstructionFeedbackState {
  passed: boolean;
  /** Optional 3-tier tone: 'verified' (green), 'unverified' (amber informational — never green!), 'error' (rose). */
  tone?: 'verified' | 'unverified' | 'error';
  message: string;
}

export interface ConstructionLabShellProps {
  id: string;
  labKind: string;
  title: string;
  instructions: string;
  accessibilityLabel: string;
  subjectTag?: string;
  modelNote?: string;
  hints?: string[];
  prediction?: ConstructionPredictionDef;
  canUndo: boolean;
  onUndo: () => void;
  onReset: () => void;
  onCheck: () => void;
  checkLabel?: string;
  feedback?: ConstructionFeedbackState | null;
  /**
   * Optional Explore Further drawer/panel callback (Refinement 3).
   * Disabled automatically when omitted or when `disableExploreFurther` is true (e.g. mastery/exam checks).
   */
  exploreFurtherTitle?: string;
  disableExploreFurther?: boolean;
  /** Marks formal assessment mode: disables Explore Further, hides hints, and hides prediction scaffolding. */
  isAssessment?: boolean;
  renderExploreFurther?: (onClose: () => void) => React.ReactNode;
  children: React.ReactNode;
}

/**
 * Thin Shared Construction Laboratory Shell (Step 4D + PCV-1 Refinement 3).
 *
 * Provides uniform Brilliant.org-style discovery framing (Understand -> Predict -> Construct ->
 * Test -> Observe -> Explain -> Refine), keyboard-accessible Undo/Reset/Check controls,
 * colour-independent aria-live feedback, hints, isolated Explore Further sandbox, and zero Firestore writes.
 */
export function ConstructionLabShell({
  id,
  labKind,
  title,
  instructions,
  accessibilityLabel,
  subjectTag,
  modelNote,
  hints,
  prediction,
  canUndo,
  onUndo,
  onReset,
  onCheck,
  checkLabel = 'Check construction',
  feedback,
  exploreFurtherTitle = 'Explore Further',
  disableExploreFurther = false,
  isAssessment = false,
  renderExploreFurther,
  children,
}: ConstructionLabShellProps) {
  const [predPick, setPredPick] = useState<number | null>(null);
  const [predChecked, setPredChecked] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreTriggerRef = useRef<HTMLButtonElement | null>(null);
  const exploreCloseRef = useRef<HTMLButtonElement | null>(null);

  const canExploreFurther = Boolean(renderExploreFurther) && !disableExploreFurther && !isAssessment;
  const effectivePrediction = isAssessment ? undefined : prediction;
  const effectiveHints = isAssessment ? undefined : hints;

  useEffect(() => {
    if (!exploreOpen) return;
    exploreCloseRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExploreOpen(false);
        setTimeout(() => exploreTriggerRef.current?.focus(), 0);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [exploreOpen]);

  const closeExplore = () => {
    setExploreOpen(false);
    setTimeout(() => exploreTriggerRef.current?.focus(), 0);
  };

  const predCorrect = Boolean(effectivePrediction && predChecked && predPick === effectivePrediction.correctIndex);
  const resolvedTone: 'verified' | 'unverified' | 'error' | null = feedback
    ? feedback.tone ?? (feedback.passed ? 'verified' : 'error')
    : null;

  return (
    <section
      aria-label={accessibilityLabel}
      data-interactive-engine="construction-lab"
      data-construction-lab-kind={labKind}
      data-interactive-id={id}
      className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-700">
              <Wrench className="h-3 w-3" />
              Construction Lab
            </span>
            {subjectTag && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                {subjectTag}
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              Practice exploration (not graded mastery)
            </span>
          </div>
          <h3 className="mt-1.5 text-sm font-extrabold text-slate-900 sm:text-base">{title}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{instructions}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            aria-label="Undo last change"
            className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition motion-reduce:transition-none hover:bg-slate-100 disabled:opacity-40"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Undo
          </button>
          <button
            type="button"
            onClick={() => {
              setPredPick(null);
              setPredChecked(false);
              onReset();
            }}
            aria-label="Reset construction"
            className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition motion-reduce:transition-none hover:bg-slate-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Optional Non-Blocking Prediction-Before-Construction Prompt */}
      {effectivePrediction && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs">
          <p className="font-extrabold uppercase tracking-wide text-amber-800">
            Predict before constructing (optional)
          </p>
          <p className="mt-1 font-semibold text-slate-900">{effectivePrediction.prompt}</p>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {effectivePrediction.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                aria-pressed={predPick === idx}
                onClick={() => {
                  setPredPick(idx);
                  setPredChecked(false);
                }}
                className={`min-h-[44px] rounded-lg border px-3 py-1.5 text-left text-xs font-bold transition motion-reduce:transition-none ${
                  predPick === idx
                    ? 'border-amber-600 bg-amber-200/80 text-slate-950'
                    : 'border-amber-200 bg-white text-slate-800 hover:bg-amber-100/60'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={predPick === null}
              onClick={() => setPredChecked(true)}
              className="min-h-[36px] rounded-lg bg-amber-600 px-3 py-1 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-40"
            >
              Check prediction
            </button>
            {predChecked && (
              <span
                role="status"
                aria-live="polite"
                className={`font-semibold ${predCorrect ? 'text-emerald-800' : 'text-rose-800'}`}
              >
                {predCorrect ? 'Spot on! ' : 'Good hypothesis — '}
                {effectivePrediction.explanation}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Domain-Specific Construction Workbench */}
      <div className="mt-3">{children}</div>

      {/* Action Bar & Colour-Independent Status Feedback */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCheck}
          className="min-h-[44px] rounded-xl bg-indigo-600 px-4 py-2 text-xs font-extrabold text-white shadow-xs transition motion-reduce:transition-none hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {checkLabel}
        </button>
        {canExploreFurther && (
          <button
            ref={exploreTriggerRef}
            type="button"
            aria-expanded={exploreOpen}
            onClick={() => setExploreOpen((prev) => !prev)}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-sky-300 bg-sky-50 px-3.5 py-2 text-xs font-extrabold text-sky-900 transition motion-reduce:transition-none hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <Compass className="h-3.5 w-3.5" />
            {exploreOpen ? 'Close Explore Further' : exploreFurtherTitle}
          </button>
        )}
      </div>

      {feedback && resolvedTone && (
        <div
          role="status"
          aria-live="polite"
          data-construction-feedback={
            resolvedTone === 'verified'
              ? 'passed'
              : resolvedTone === 'unverified'
                ? 'unverified'
                : 'needs-work'
          }
          className={`mt-3 flex items-start gap-2 rounded-xl border p-3 text-xs font-semibold ${
            resolvedTone === 'verified'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
              : resolvedTone === 'unverified'
                ? 'border-amber-300 bg-amber-50 text-amber-950'
                : 'border-rose-300 bg-rose-50 text-rose-950'
          }`}
        >
          {resolvedTone === 'verified' ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          ) : resolvedTone === 'unverified' ? (
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>
            {resolvedTone === 'verified'
              ? 'Verified: '
              : resolvedTone === 'unverified'
                ? 'Unverified construction: '
                : 'Keep refining: '}
            {feedback.message}
          </span>
        </div>
      )}

      {/* Isolated Explore Further Sandbox Panel (0 Firestore writes; closing restores main exercise untouched) */}
      {canExploreFurther && exploreOpen && renderExploreFurther && (
        <div
          role="region"
          aria-label={`${exploreFurtherTitle} sandbox`}
          data-explore-further-panel="open"
          className="mt-4 rounded-2xl border-2 border-sky-300 bg-sky-50/40 p-3 sm:p-4"
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-sky-200 pb-2">
            <div className="flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-sky-700" />
              <span className="text-xs font-extrabold uppercase tracking-wide text-sky-900">
                {exploreFurtherTitle} — Isolated Sandbox (Press Esc to Return)
              </span>
            </div>
            <button
              ref={exploreCloseRef}
              type="button"
              onClick={closeExplore}
              aria-label="Return to exercise"
              className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-sky-300 bg-white px-2.5 py-1 text-xs font-bold text-sky-900 hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <X className="h-3.5 w-3.5" />
              Return to exercise
            </button>
          </div>
          {renderExploreFurther(closeExplore)}
        </div>
      )}

      {/* Model Note & Hints */}
      {modelNote && (
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          <strong>Model note:</strong> {modelNote}
        </p>
      )}
      {effectiveHints && effectiveHints.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowHints((v) => !v)}
            aria-expanded={showHints}
            className="inline-flex min-h-[24px] items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {showHints ? 'Hide hint' : 'Need a hint?'}
          </button>
          {showHints && (
            <ul className="mt-1.5 list-disc space-y-1 rounded-xl border border-indigo-200 bg-indigo-50/60 py-2 pl-6 pr-3 text-xs text-indigo-950">
              {effectiveHints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
