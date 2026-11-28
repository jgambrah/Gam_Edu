'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GitBranch,
  HelpCircle,
  Maximize2,
  RefreshCw,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import type { ProcessStepperInteractiveConfig } from '@/lib/narrated-lessons/interactive-schema';
import { lessonMediaUrl } from '@/lib/narrated-lessons/types';
import {
  computeProcessStateDiff,
  deterministicPermuteIds,
  evaluateSequenceOrder,
  stepNextStage,
  stepPrevStage,
} from '@/lib/narrated-lessons/process-stepper-logic';

export interface ProcessStepperEngineProps {
  config: ProcessStepperInteractiveConfig;
  lessonId?: string;
}

function resolveVisualSrc(src: string, lessonId?: string): string {
  if (src.startsWith('/') || src.startsWith('https://')) return src;
  return lessonId ? lessonMediaUrl(lessonId, src) : src;
}

/**
 * Reusable Cross-Subject Process & Mechanism Engine (Step 4B).
 *
 * - Driven 100% by validated `ProcessStepperInteractiveConfig` JSON.
 * - Supports 3 visual presentation modes:
 *     - Mode A (`diagram`): Auto-generated linear flow or cyclic diagram.
 *     - Mode B (`stage-illustrations`): Stage-specific approved WebP/PNG illustration with Enlarge modal.
 *     - Mode C (`shared-highlight`): Shared approved illustration with declarative bounded highlight region.
 * - Tracks `stateSnapshot` diffs against previous stage with accessible textual badges (never color alone).
 * - Supports optional Predict-Next-Stage prompts and keyboard-accessible Sequencing Challenges (no drag-and-drop).
 * - Zero Firestore writes; polite screen-reader updates; respects `prefers-reduced-motion`.
 */
export function ProcessStepperEngine({ config, lessonId }: ProcessStepperEngineProps) {
  const stages = config.stages;
  const visualMode = config.visualMode ?? 'diagram';

  const [stageIdx, setStageIdx] = useState(0);
  const [prevStageIdx, setPrevStageIdx] = useState<number | null>(null);
  const [visitedIndices, setVisitedIndices] = useState<Set<number>>(() => new Set([0]));
  const [cycleNotice, setCycleNotice] = useState<string | null>(null);
  const [compareWithPrev, setCompareWithPrev] = useState(true);
  const [showHints, setShowHints] = useState(false);

  // Per-stage prediction state (non-blocking)
  const [predSelected, setPredSelected] = useState<Record<string, number>>({});
  const [predChecked, setPredChecked] = useState<Record<string, boolean>>({});

  // Keyboard-accessible sequencing challenge state
  const [seqOrder, setSeqOrder] = useState<string[]>(() =>
    config.sequenceChallenge ? deterministicPermuteIds(config.sequenceChallenge.stageIdsToOrder) : []
  );
  const [seqResult, setSeqResult] = useState<{ correct: boolean; matchedPositions: number; total: number } | null>(null);

  // Enlarge lightbox state for Mode B / Mode C illustrations
  const [enlargedVisual, setEnlargedVisual] = useState<{ src: string; alt: string; caption?: string } | null>(null);

  useEffect(() => {
    setStageIdx(0);
    setPrevStageIdx(null);
    setVisitedIndices(new Set([0]));
    setCycleNotice(null);
    setCompareWithPrev(true);
    setShowHints(false);
    setPredSelected({});
    setPredChecked({});
    setSeqOrder(
      config.sequenceChallenge ? deterministicPermuteIds(config.sequenceChallenge.stageIdsToOrder) : []
    );
    setSeqResult(null);
    setEnlargedVisual(null);
  }, [config]);

  useEffect(() => {
    if (!enlargedVisual) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEnlargedVisual(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enlargedVisual]);

  const currentStage = stages[stageIdx] ?? stages[0];
  const prevStage = prevStageIdx !== null ? stages[prevStageIdx] : null;

  const stateDiffRows = useMemo(() => {
    if (!currentStage?.stateSnapshot && !prevStage?.stateSnapshot) return [];
    return computeProcessStateDiff(
      compareWithPrev ? prevStage?.stateSnapshot : undefined,
      currentStage?.stateSnapshot
    );
  }, [compareWithPrev, currentStage?.stateSnapshot, prevStage?.stateSnapshot]);

  const goToStage = (targetIdx: number, notice: string | null = null) => {
    if (targetIdx < 0 || targetIdx >= stages.length) return;
    setPrevStageIdx(stageIdx);
    setStageIdx(targetIdx);
    setCycleNotice(notice);
    setVisitedIndices((prev) => {
      const next = new Set(prev);
      next.add(targetIdx);
      return next;
    });
  };

  const handleNext = () => {
    const res = stepNextStage(stageIdx, stages.length, config.mode);
    if (res.nextIndex !== stageIdx || res.wrapped) {
      goToStage(
        res.nextIndex,
        res.wrapped
          ? `Cycle restarted at Stage 1 (${stages[0].title}). Replaying the cycle shows the repeating pattern.`
          : null
      );
    }
  };

  const handlePrev = () => {
    const res = stepPrevStage(stageIdx, stages.length, config.mode);
    if (res.prevIndex !== stageIdx || res.wrapped) {
      goToStage(res.prevIndex, null);
    }
  };

  const handleReset = () => {
    setStageIdx(0);
    setPrevStageIdx(null);
    setVisitedIndices(new Set([0]));
    setCycleNotice(null);
    setPredSelected({});
    setPredChecked({});
    if (config.sequenceChallenge) {
      setSeqOrder(deterministicPermuteIds(config.sequenceChallenge.stageIdsToOrder));
      setSeqResult(null);
    }
  };

  const handleReplay = () => {
    goToStage(0, 'Replaying from Stage 1.');
  };

  const moveSeqItem = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= seqOrder.length) return;
    const next = [...seqOrder];
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    setSeqOrder(next);
    setSeqResult(null);
  };

  const stageTitleById = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of stages) map.set(s.id, s.title);
    return map;
  }, [stages]);

  const atLinearEnd = config.mode === 'linear' && stageIdx === stages.length - 1;
  const atLinearStart = config.mode === 'linear' && stageIdx === 0;

  return (
    <section
      aria-label={config.accessibilityLabel}
      data-interactive-engine="process-stepper"
      data-interactive-id={config.id}
      className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-violet-700">
              {config.mode === 'cyclic' ? <RefreshCw className="h-3 w-3" /> : <GitBranch className="h-3 w-3" />}
              {config.mode === 'cyclic' ? 'Cyclic Mechanism' : 'Process Stepper'}
            </span>
            {config.subjectTag && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                {config.subjectTag}
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
              Stage {stageIdx + 1} of {stages.length}
            </span>
          </div>
          <h3 className="mt-1.5 text-sm font-extrabold text-slate-900 sm:text-base">
            {config.title}
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
            {config.instructions}
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Mode A: Automatic Process Diagram (always visible as compact stage selector + flow overview) */}
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <span className="font-bold uppercase tracking-wider">
            {config.mode === 'cyclic' ? 'Cycle Overview (select any stage)' : 'Process Flow (select any stage)'}
          </span>
          <span>
            Visited: {visitedIndices.size}/{stages.length} (exploration only)
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Process stages">
          {stages.map((st, idx) => {
            const isActive = idx === stageIdx;
            const isVisited = visitedIndices.has(idx);
            return (
              <React.Fragment key={st.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => goToStage(idx, null)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-violet-400 ${
                    isActive
                      ? 'border-violet-600 bg-violet-600 text-white shadow-xs'
                      : isVisited
                        ? 'border-violet-200 bg-violet-50 text-violet-900 hover:bg-violet-100'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-mono text-[11px]">{idx + 1}.</span>
                  <span>{st.shortLabel || st.title}</span>
                </button>
                {idx < stages.length - 1 && (
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                )}
              </React.Fragment>
            );
          })}
          {config.mode === 'cyclic' && (
            <span className="inline-flex items-center gap-1 rounded-md bg-violet-100 px-2 py-1 text-[11px] font-bold text-violet-800">
              <RefreshCw className="h-3 w-3" />
              loops to 1
            </span>
          )}
        </div>
      </div>

      {/* Mode B (Stage-specific illustration) or Mode C (Shared illustration with declarative highlight region) */}
      {visualMode === 'stage-illustrations' && currentStage.visual && (
        <figure className="relative mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          <img
            src={resolveVisualSrc(currentStage.visual.src, lessonId)}
            alt={currentStage.visual.altText}
            loading="eager"
            className="max-h-72 w-full object-contain bg-white"
          />
          <button
            type="button"
            onClick={() =>
              setEnlargedVisual({
                src: resolveVisualSrc(currentStage.visual!.src, lessonId),
                alt: currentStage.visual!.altText,
                caption: currentStage.visual!.caption,
              })
            }
            aria-label="Enlarge stage illustration"
            className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-slate-900/75 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-slate-900"
          >
            <Maximize2 className="h-3 w-3" />
            Enlarge
          </button>
          {currentStage.visual.caption && (
            <figcaption className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-600">
              {currentStage.visual.caption}
            </figcaption>
          )}
        </figure>
      )}

      {visualMode === 'shared-highlight' && config.sharedVisual && (
        <figure className="relative mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="relative">
            <img
              src={resolveVisualSrc(config.sharedVisual.src, lessonId)}
              alt={config.sharedVisual.altText}
              loading="eager"
              className="max-h-80 w-full object-contain"
            />
            {currentStage.highlightRegion && (
              <div
                aria-label={`Highlighted region: ${currentStage.highlightRegion.label}`}
                style={{
                  left: `${currentStage.highlightRegion.xPct}%`,
                  top: `${currentStage.highlightRegion.yPct}%`,
                  width: `${currentStage.highlightRegion.widthPct}%`,
                  height: `${currentStage.highlightRegion.heightPct}%`,
                }}
                className="pointer-events-none absolute rounded-lg border-3 border-amber-500 bg-amber-400/20 shadow-sm"
              >
                <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-slate-900 px-2 py-0.5 text-[10px] font-extrabold text-amber-300">
                  {currentStage.highlightRegion.label}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() =>
                setEnlargedVisual({
                  src: resolveVisualSrc(config.sharedVisual!.src, lessonId),
                  alt: config.sharedVisual!.altText,
                  caption: config.sharedVisual!.caption,
                })
              }
              aria-label="Enlarge process diagram"
              className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-slate-900/75 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-slate-900"
            >
              <Maximize2 className="h-3 w-3" />
              Enlarge
            </button>
          </div>
          {config.sharedVisual.caption && (
            <figcaption className="border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-600">
              {config.sharedVisual.caption}
            </figcaption>
          )}
        </figure>
      )}

      {/* Active Stage Detail Card */}
      <div
        role="status"
        aria-live="polite"
        data-active-stage-id={currentStage.id}
        className="mt-3 rounded-xl border-2 border-violet-200 bg-violet-50/40 p-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-extrabold text-slate-950 sm:text-base">
            Stage {stageIdx + 1}: {currentStage.title}
          </h4>
          {atLinearEnd && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
              Final Stage Reached
            </span>
          )}
        </div>

        {cycleNotice && (
          <p className="mt-1.5 rounded-lg bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-900">
            {cycleNotice}
          </p>
        )}

        <p className="mt-2 text-xs leading-relaxed text-slate-800 sm:text-sm">
          {currentStage.summary}
        </p>

        {/* Optional Chemical / Mathematical Equation Banner */}
        {currentStage.equation && (
          <div
            data-stage-equation="true"
            tabIndex={0}
            role="region"
            aria-label="Stage equation"
            className="mt-2.5 overflow-x-auto rounded-lg border border-slate-300 bg-slate-900 px-3 py-2 font-mono text-xs font-bold text-amber-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:text-sm"
          >
            {currentStage.equation}
          </div>
        )}

        {/* Optional Structured Reaction / Mechanism Metadata (A-Level Chemistry & Biology) */}
        {currentStage.reactionMeta && (
          <div
            data-stage-reaction-meta="true"
            className="mt-2.5 grid gap-1.5 rounded-lg border border-fuchsia-200 bg-fuchsia-50/60 p-2.5 text-xs text-slate-800 sm:grid-cols-2"
          >
            {currentStage.reactionMeta.reactants && currentStage.reactionMeta.reactants.length > 0 && (
              <div>
                <span className="font-bold text-fuchsia-950">Reactants: </span>
                <span>{currentStage.reactionMeta.reactants.join(', ')}</span>
              </div>
            )}
            {currentStage.reactionMeta.intermediates && currentStage.reactionMeta.intermediates.length > 0 && (
              <div>
                <span className="font-bold text-fuchsia-950">Intermediates: </span>
                <span>{currentStage.reactionMeta.intermediates.join(', ')}</span>
              </div>
            )}
            {currentStage.reactionMeta.products && currentStage.reactionMeta.products.length > 0 && (
              <div>
                <span className="font-bold text-fuchsia-950">Products: </span>
                <span>{currentStage.reactionMeta.products.join(', ')}</span>
              </div>
            )}
            {currentStage.reactionMeta.bondsBroken && currentStage.reactionMeta.bondsBroken.length > 0 && (
              <div>
                <span className="font-bold text-rose-900">Bonds broken: </span>
                <span>{currentStage.reactionMeta.bondsBroken.join(', ')}</span>
              </div>
            )}
            {currentStage.reactionMeta.bondsFormed && currentStage.reactionMeta.bondsFormed.length > 0 && (
              <div>
                <span className="font-bold text-emerald-900">Bonds formed: </span>
                <span>{currentStage.reactionMeta.bondsFormed.join(', ')}</span>
              </div>
            )}
            {currentStage.reactionMeta.electronMovement && (
              <div className="sm:col-span-2">
                <span className="font-bold text-indigo-950">Electron-pair movement: </span>
                <span>{currentStage.reactionMeta.electronMovement}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {currentStage.startingCondition && (
            <div className="rounded-lg border border-slate-200 bg-white p-2.5 text-xs">
              <span className="font-bold text-slate-700">Starting condition: </span>
              <span className="text-slate-700">{currentStage.startingCondition}</span>
            </div>
          )}
          {currentStage.whatChanges && (
            <div className="rounded-lg border border-sky-200 bg-sky-50/70 p-2.5 text-xs">
              <span className="font-bold text-sky-900">What changes: </span>
              <span className="text-sky-950">{currentStage.whatChanges}</span>
            </div>
          )}
          {currentStage.whyItMatters && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs">
              <span className="font-bold text-emerald-900">Why it matters: </span>
              <span className="text-emerald-950">{currentStage.whyItMatters}</span>
            </div>
          )}
          {currentStage.connectionToNext && (
            <div className="rounded-lg border border-indigo-200 bg-indigo-50/70 p-2.5 text-xs">
              <span className="font-bold text-indigo-900">Connects to next: </span>
              <span className="text-indigo-950">{currentStage.connectionToNext}</span>
            </div>
          )}
        </div>

        {(currentStage.inputs?.length || currentStage.outputs?.length) && (
          <div className="mt-2.5 flex flex-wrap gap-3 text-xs">
            {currentStage.inputs && currentStage.inputs.length > 0 && (
              <div>
                <span className="font-bold text-slate-700">Inputs: </span>
                <span className="text-slate-600">{currentStage.inputs.join(', ')}</span>
              </div>
            )}
            {currentStage.outputs && currentStage.outputs.length > 0 && (
              <div>
                <span className="font-bold text-slate-700">Outputs: </span>
                <span className="text-slate-600">{currentStage.outputs.join(', ')}</span>
              </div>
            )}
          </div>
        )}

        {currentStage.commonMisconception && (
          <div className="mt-2.5 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-950">
            <span className="font-bold">Watch out (common misconception): </span>
            {currentStage.commonMisconception}
          </div>
        )}

        {/* State Snapshot & Previous-Stage Comparison */}
        {stateDiffRows.length > 0 && (
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-700">
                System State Snapshot
              </p>
              {prevStage && (
                <button
                  type="button"
                  aria-pressed={compareWithPrev}
                  onClick={() => setCompareWithPrev((v) => !v)}
                  className="text-[11px] font-bold text-violet-700 hover:underline"
                >
                  {compareWithPrev ? `Comparing with Stage ${prevStageIdx! + 1}` : 'Compare with previous stage'}
                </button>
              )}
            </div>
            <div
              tabIndex={0}
              role="region"
              aria-label="Process state comparison table"
              className="mt-2 overflow-x-auto rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] text-slate-500">
                    <th className="py-1 pr-3 font-bold">Variable / Property</th>
                    <th className="py-1 pr-3 font-bold">Current Value</th>
                    <th className="py-1 font-bold">Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stateDiffRows.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-1.5 pr-3 font-semibold text-slate-800">{row.label}</td>
                      <td className="py-1.5 pr-3 font-mono text-slate-900">
                        {row.currentValue ?? '—'}
                      </td>
                      <td className="py-1.5 text-[11px]">
                        {row.status === 'changed' && (
                          <span className="inline-flex rounded bg-amber-100 px-1.5 py-0.5 font-bold text-amber-950">
                            Changed (was {row.previousValue})
                          </span>
                        )}
                        {row.status === 'added' && (
                          <span className="inline-flex rounded bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-900">
                            New in this stage
                          </span>
                        )}
                        {row.status === 'removed' && (
                          <span className="inline-flex rounded bg-rose-100 px-1.5 py-0.5 font-bold text-rose-900">
                            Removed (was {row.previousValue})
                          </span>
                        )}
                        {row.status === 'unchanged' && (
                          <span className="text-slate-500">Unchanged</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Stage Navigation Controls */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          disabled={atLinearStart}
          onClick={handlePrev}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {atLinearEnd && (
            <button
              type="button"
              onClick={handleReplay}
              className="inline-flex items-center gap-1 rounded-xl border border-violet-300 bg-violet-50 px-3.5 py-2 text-xs font-bold text-violet-900 hover:bg-violet-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Replay
            </button>
          )}
          <button
            type="button"
            disabled={atLinearEnd}
            onClick={handleNext}
            className="inline-flex items-center gap-1 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-violet-700 disabled:opacity-40"
          >
            {config.mode === 'cyclic' && stageIdx === stages.length - 1 ? 'Next (Restart Cycle)' : 'Next Stage'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Optional Predict-Next-Stage Micro-Check (non-blocking) */}
      {currentStage.prediction && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-950">
          <p className="font-bold">Predict before advancing: {currentStage.prediction.prompt}</p>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
            {currentStage.prediction.options.map((opt, idx) => {
              const selected = predSelected[currentStage.id] === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setPredSelected((prev) => ({ ...prev, [currentStage.id]: idx }));
                    setPredChecked((prev) => ({ ...prev, [currentStage.id]: false }));
                  }}
                  className={`rounded-lg border px-2.5 py-1.5 text-left font-medium transition ${
                    selected
                      ? 'border-amber-600 bg-amber-100 text-amber-950'
                      : 'border-amber-200 bg-white text-slate-800 hover:bg-amber-50'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={predSelected[currentStage.id] === undefined}
              onClick={() => setPredChecked((prev) => ({ ...prev, [currentStage.id]: true }))}
              className="rounded-lg bg-amber-600 px-3 py-1 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-40"
            >
              Check prediction
            </button>
            {predChecked[currentStage.id] && (
              <span className="font-semibold text-slate-900">
                {predSelected[currentStage.id] === currentStage.prediction.correctIndex
                  ? 'Correct! '
                  : 'Not quite — '}
                {currentStage.prediction.explanation}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Optional Keyboard-Accessible Sequencing Challenge (zero drag-and-drop) */}
      {config.sequenceChallenge && (
        <div
          data-sequence-challenge-id={config.sequenceChallenge.id}
          className="mt-4 rounded-xl border border-sky-200 bg-sky-50/50 p-3.5 text-xs"
        >
          <div className="flex items-center gap-1.5 font-extrabold text-sky-950">
            <Sparkles className="h-4 w-4 text-sky-600" />
            Sequence Check: {config.sequenceChallenge.prompt}
          </div>
          <ol className="mt-2.5 space-y-1.5">
            {seqOrder.map((sid, idx) => (
              <li
                key={sid}
                className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
              >
                <span className="font-semibold text-slate-800">
                  <span className="mr-1.5 font-mono text-slate-500">{idx + 1}.</span>
                  {stageTitleById.get(sid) ?? sid}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    aria-label={`Move ${stageTitleById.get(sid) ?? sid} up`}
                    onClick={() => moveSeqItem(idx, -1)}
                    className="rounded border border-slate-200 bg-slate-50 p-1 text-slate-700 hover:bg-slate-100 disabled:opacity-35"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === seqOrder.length - 1}
                    aria-label={`Move ${stageTitleById.get(sid) ?? sid} down`}
                    onClick={() => moveSeqItem(idx, 1)}
                    className="rounded border border-slate-200 bg-slate-50 p-1 text-slate-700 hover:bg-slate-100 disabled:opacity-35"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setSeqResult(evaluateSequenceOrder(seqOrder, config.sequenceChallenge!.stageIdsToOrder))
              }
              className="rounded-lg bg-sky-600 px-3 py-1.5 font-bold text-white hover:bg-sky-700"
            >
              Check order
            </button>
            <button
              type="button"
              onClick={() => {
                setSeqOrder(deterministicPermuteIds(config.sequenceChallenge!.stageIdsToOrder));
                setSeqResult(null);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Retry
            </button>
          </div>
          {seqResult && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-2.5 rounded-lg border p-2.5 font-semibold ${
                seqResult.correct
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                  : 'border-rose-300 bg-rose-50 text-rose-950'
              }`}
            >
              {seqResult.correct ? (
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Correct sequence! {config.sequenceChallenge.explanation}
                </span>
              ) : (
                <span>
                  {seqResult.matchedPositions} of {seqResult.total} stages are in the right position. Adjust the order and try again.
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Model Note & Optional Hints */}
      {config.modelNote && (
        <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
          <strong>Model note:</strong> {config.modelNote}
        </p>
      )}
      {config.hints && config.hints.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowHints((v) => !v)}
            aria-expanded={showHints}
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:underline"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {showHints ? 'Hide hint' : 'Need a hint?'}
          </button>
          {showHints && (
            <ul className="mt-1.5 list-disc space-y-1 rounded-xl border border-sky-200 bg-sky-50/60 py-2 pl-6 pr-3 text-xs text-sky-950">
              {config.hints.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Enlarged Visual Lightbox Modal */}
      {enlargedVisual && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged process illustration"
          onClick={() => setEnlargedVisual(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] max-w-4xl overflow-auto rounded-2xl bg-white p-3 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setEnlargedVisual(null)}
              aria-label="Close enlarged illustration"
              className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white"
            >
              <X className="h-3.5 w-3.5" />
              Close
            </button>
            <img src={enlargedVisual.src} alt={enlargedVisual.alt} className="max-h-[78vh] w-auto object-contain" />
            {enlargedVisual.caption && (
              <p className="mt-2 text-center text-xs text-slate-600">{enlargedVisual.caption}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
