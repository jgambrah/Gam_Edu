'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Undo2,
  Wrench,
  XCircle,
} from 'lucide-react';
import type { ConstructionPredictionDef } from '@/lib/narrated-lessons/interactive-schema';

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
  feedback?: { passed: boolean; message: string } | null;
  children: React.ReactNode;
}

/**
 * Thin Shared Construction Laboratory Shell (Step 4D).
 *
 * Provides uniform Brilliant.org-style discovery framing (Understand -> Predict -> Construct ->
 * Test -> Observe -> Explain -> Refine), keyboard-accessible Undo/Reset/Check controls,
 * colour-independent aria-live feedback, hints, and zero Firestore writes.
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
  children,
}: ConstructionLabShellProps) {
  const [predPick, setPredPick] = useState<number | null>(null);
  const [predChecked, setPredChecked] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const predCorrect = Boolean(prediction && predChecked && predPick === prediction.correctIndex);

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
      {prediction && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs">
          <p className="font-extrabold uppercase tracking-wide text-amber-800">
            Predict before constructing (optional)
          </p>
          <p className="mt-1 font-semibold text-slate-900">{prediction.prompt}</p>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {prediction.options.map((opt, idx) => (
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
                {prediction.explanation}
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
      </div>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          data-construction-feedback={feedback.passed ? 'passed' : 'needs-work'}
          className={`mt-3 flex items-start gap-2 rounded-xl border p-3 text-xs font-semibold ${
            feedback.passed
              ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
              : 'border-rose-300 bg-rose-50 text-rose-950'
          }`}
        >
          {feedback.passed ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>
            {feedback.passed ? 'Verified: ' : 'Keep refining: '}
            {feedback.message}
          </span>
        </div>
      )}

      {/* Model Note & Hints */}
      {modelNote && (
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          <strong>Model note:</strong> {modelNote}
        </p>
      )}
      {hints && hints.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowHints((v) => !v)}
            aria-expanded={showHints}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {showHints ? 'Hide hint' : 'Need a hint?'}
          </button>
          {showHints && (
            <ul className="mt-1.5 list-disc space-y-1 rounded-xl border border-indigo-200 bg-indigo-50/60 py-2 pl-6 pr-3 text-xs text-indigo-950">
              {hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
