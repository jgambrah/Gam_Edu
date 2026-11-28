'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Eye,
  EyeOff,
  HelpCircle,
  Link2,
  Maximize2,
  RotateCcw,
  Target,
  X,
  XCircle,
} from 'lucide-react';
import type {
  DiagramHotspotItemDef,
  DiagramHotspotsInteractiveConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import { lessonMediaUrl } from '@/lib/narrated-lessons/types';

export interface DiagramHotspotsEngineProps {
  config: DiagramHotspotsInteractiveConfig;
  lessonId?: string;
}

function resolveDiagramSrc(src: string, lessonId?: string): string {
  if (src.startsWith('/') || src.startsWith('https://')) return src;
  return lessonId ? lessonMediaUrl(lessonId, src) : src;
}

/**
 * Reusable Cross-Subject Diagram & Hotspots Engine (Step 4C).
 *
 * - Driven 100% by validated `DiagramHotspotsInteractiveConfig` JSON.
 * - Renders point & rectangular hotspots positioned strictly relative to the actual rendered image.
 * - Supports Explore Mode (free + guided order + progressive disclosure + related-structure highlighting)
 *   and Identify Mode (formative challenges with strict answer concealment before submission).
 * - 44x44px touch-friendly targets, keyboard-accessible label list, Enlarge modal with Escape &
 *   focus restoration, respects `prefers-reduced-motion`, 0 Firestore writes.
 */
export function DiagramHotspotsEngine({ config, lessonId }: DiagramHotspotsEngineProps) {
  const hotspots = config.hotspots;
  const hasIdentify = Boolean(config.identifyPrompts && config.identifyPrompts.length > 0);
  const guidedIds = useMemo(
    () => (config.guidedOrder && config.guidedOrder.length > 0 ? config.guidedOrder : hotspots.map((h) => h.id)),
    [config.guidedOrder, hotspots]
  );

  const [mode, setMode] = useState<'explore' | 'identify'>(() =>
    config.defaultMode === 'identify' && hasIdentify ? 'identify' : 'explore'
  );
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    config.progressiveDisclosure ? null : guidedIds[0] ?? hotspots[0]?.id ?? null
  );
  const [showMarkers, setShowMarkers] = useState<boolean>(() => !config.progressiveDisclosure);
  const [visitedIds, setVisitedIds] = useState<Set<string>>(() =>
    config.progressiveDisclosure || !hotspots[0] ? new Set() : new Set([guidedIds[0] ?? hotspots[0].id])
  );
  const [showHints, setShowHints] = useState(false);

  // Identify mode state
  const [promptIdx, setPromptIdx] = useState(0);
  const [pickedHotspotId, setPickedHotspotId] = useState<string | null>(null);
  const [identifyChecked, setIdentifyChecked] = useState(false);
  const [useNonVisual, setUseNonVisual] = useState(false);
  const [pickedNonVisualIdx, setPickedNonVisualIdx] = useState<number | null>(null);

  // Enlarge modal + focus restoration
  const [enlarged, setEnlarged] = useState(false);
  const enlargeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const startId = config.progressiveDisclosure ? null : guidedIds[0] ?? hotspots[0]?.id ?? null;
    setMode(config.defaultMode === 'identify' && hasIdentify ? 'identify' : 'explore');
    setSelectedId(startId);
    setShowMarkers(!config.progressiveDisclosure);
    setVisitedIds(startId ? new Set([startId]) : new Set());
    setShowHints(false);
    setPromptIdx(0);
    setPickedHotspotId(null);
    setIdentifyChecked(false);
    setUseNonVisual(false);
    setPickedNonVisualIdx(null);
    setEnlarged(false);
  }, [config, guidedIds, hasIdentify, hotspots]);

  useEffect(() => {
    if (!enlarged) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEnlarged(false);
        enlargeBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enlarged]);

  const hotspotById = useMemo(() => {
    const map = new Map<string, DiagramHotspotItemDef>();
    for (const h of hotspots) map.set(h.id, h);
    return map;
  }, [hotspots]);

  const selectedHotspot = selectedId ? hotspotById.get(selectedId) ?? null : null;
  const linkedSet = useMemo(
    () => new Set(mode === 'explore' && selectedHotspot?.linkedHotspotIds ? selectedHotspot.linkedHotspotIds : []),
    [mode, selectedHotspot]
  );

  const currentPrompt = config.identifyPrompts?.[promptIdx] ?? null;
  const activeNonVisual = Boolean(useNonVisual && currentPrompt?.nonVisualQuestion);
  const isIdentifyCorrect = Boolean(
    identifyChecked &&
      currentPrompt &&
      (activeNonVisual
        ? pickedNonVisualIdx === currentPrompt.nonVisualQuestion?.correctIndex
        : pickedHotspotId === currentPrompt.targetHotspotId)
  );

  const selectHotspot = (id: string) => {
    if (mode === 'identify') {
      setPickedHotspotId(id);
      setIdentifyChecked(false);
      return;
    }
    setSelectedId(id);
    setShowMarkers(true);
    setVisitedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const guidedPos = selectedId ? guidedIds.indexOf(selectedId) : -1;
  const handleGuidedStep = (delta: -1 | 1) => {
    const nextIdx =
      guidedPos === -1
        ? 0
        : Math.max(0, Math.min(guidedIds.length - 1, guidedPos + delta));
    selectHotspot(guidedIds[nextIdx]);
  };

  const handleReset = () => {
    const startId = config.progressiveDisclosure ? null : guidedIds[0] ?? hotspots[0]?.id ?? null;
    setSelectedId(startId);
    setShowMarkers(!config.progressiveDisclosure);
    setVisitedIds(startId ? new Set([startId]) : new Set());
    setPromptIdx(0);
    setPickedHotspotId(null);
    setIdentifyChecked(false);
    setUseNonVisual(false);
    setPickedNonVisualIdx(null);
  };

  const resolvedSrc = resolveDiagramSrc(config.diagram.src, lessonId);

  // Answer concealment: in Identify mode before checking, NEVER leak structure labels, captions, or descriptive altText!
  const concealLabels = mode === 'identify' && !identifyChecked;
  const activeAltText = concealLabels
    ? config.diagram.identifyAltText ?? 'Unlabelled interactive diagram with numbered regions for identification'
    : config.diagram.altText;

  const renderOverlayMarkers = (inModal = false) => {
    if (!showMarkers && mode === 'explore') return null;

    return hotspots.map((h, idx) => {
      const isSelected = mode === 'explore' ? selectedId === h.id : pickedHotspotId === h.id;
      const isLinked = linkedSet.has(h.id);
      const isTargetRevealed = Boolean(
        mode === 'identify' && identifyChecked && currentPrompt?.targetHotspotId === h.id
      );
      const isRect = typeof h.widthPct === 'number' && typeof h.heightPct === 'number';
      const accessibleName = concealLabels ? `Region ${idx + 1}` : `${idx + 1}. ${h.label}`;

      if (isRect) {
        return (
          <button
            key={`${inModal ? 'm-' : ''}${h.id}`}
            type="button"
            aria-label={accessibleName}
            aria-pressed={isSelected}
            onClick={() => selectHotspot(h.id)}
            style={{
              left: `${h.xPct}%`,
              top: `${h.yPct}%`,
              width: `${h.widthPct}%`,
              height: `${h.heightPct}%`,
            }}
            className={`absolute rounded-lg border-3 transition motion-reduce:transition-none focus:outline-none focus:ring-2 focus:ring-sky-400 ${
              isTargetRevealed
                ? 'border-emerald-500 bg-emerald-400/25'
                : isSelected
                  ? 'border-amber-500 bg-amber-400/25 shadow-[0_0_0_2px_#0f172a]'
                  : isLinked
                    ? 'border-dashed border-emerald-500 bg-emerald-400/15'
                    : 'border-sky-600/80 bg-sky-400/10 hover:bg-sky-400/20'
            }`}
          >
            <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-[11px] font-extrabold text-white shadow">
              {idx + 1}
            </span>
          </button>
        );
      }

      // Point hotspot: 44x44px touch target centered at (xPct, yPct)
      return (
        <button
          key={`${inModal ? 'm-' : ''}${h.id}`}
          type="button"
          aria-label={accessibleName}
          aria-pressed={isSelected}
          onClick={() => selectHotspot(h.id)}
          style={{ left: `${h.xPct}%`, top: `${h.yPct}%` }}
          className="group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400"
        >
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-extrabold shadow-md transition motion-reduce:transition-none ${
              isTargetRevealed
                ? 'border-white bg-emerald-700 text-white ring-2 ring-emerald-900'
                : isSelected
                  ? 'scale-110 border-slate-950 bg-amber-400 text-slate-950 ring-2 ring-white'
                  : isLinked
                    ? 'border-white bg-emerald-700 text-white ring-2 ring-emerald-950'
                    : 'border-white bg-sky-700 text-white ring-2 ring-slate-900/70 group-hover:bg-sky-800'
            }`}
          >
            {idx + 1}
          </span>
        </button>
      );
    });
  };

  return (
    <section
      aria-label={config.accessibilityLabel}
      data-interactive-engine="diagram-hotspots"
      data-interactive-id={config.id}
      className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-teal-700">
              <Compass className="h-3 w-3" />
              Diagram Explorer
            </span>
            {config.subjectTag && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                {config.subjectTag}
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
              Visited: {visitedIds.size}/{hotspots.length} (exploration only)
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
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Mode Switcher & Progressive Disclosure Toggle */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold">
          <button
            type="button"
            aria-pressed={mode === 'explore'}
            onClick={() => {
              setMode('explore');
              setIdentifyChecked(false);
            }}
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 transition ${
              mode === 'explore' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-700 hover:bg-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            Explore
          </button>
          {hasIdentify && (
            <button
              type="button"
              aria-pressed={mode === 'identify'}
              onClick={() => {
                setMode('identify');
                setShowMarkers(true);
                setPickedHotspotId(null);
                setIdentifyChecked(false);
              }}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 transition ${
                mode === 'identify' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-700 hover:bg-white'
              }`}
            >
              <Target className="h-3.5 w-3.5" />
              Identify Challenge ({config.identifyPrompts!.length})
            </button>
          )}
        </div>

        {mode === 'explore' && (
          <button
            type="button"
            aria-pressed={showMarkers}
            onClick={() => setShowMarkers((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {showMarkers ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showMarkers ? 'Observe clean diagram' : 'Reveal hotspot markers'}
          </button>
        )}
      </div>

      {/* Identify Mode Prompt Banner (strict answer concealment until checked) */}
      {mode === 'identify' && currentPrompt && (
        <div
          data-identify-prompt-id={currentPrompt.id}
          className="mt-3 rounded-xl border-2 border-amber-300 bg-amber-50/80 p-3.5 text-xs text-amber-950"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-extrabold uppercase tracking-wide text-amber-800">
              Identify {promptIdx + 1} of {config.identifyPrompts!.length}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {currentPrompt.nonVisualQuestion && (
                <button
                  type="button"
                  aria-pressed={activeNonVisual}
                  onClick={() => {
                    setUseNonVisual((v) => !v);
                    setIdentifyChecked(false);
                    setPickedNonVisualIdx(null);
                    setPickedHotspotId(null);
                  }}
                  className="rounded-lg border border-amber-400 bg-white px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-100"
                >
                  {activeNonVisual ? 'Switch to diagram selection' : 'Text-only equivalent (nonvisual)'}
                </button>
              )}
              {currentPrompt.hintText && !identifyChecked && !activeNonVisual && (
                <span className="text-[11px] font-medium text-amber-900">
                  Hint: {currentPrompt.hintText}
                </span>
              )}
            </div>
          </div>

          {activeNonVisual && currentPrompt.nonVisualQuestion ? (
            <div data-nonvisual-question="true" className="mt-2">
              <p className="text-sm font-bold text-slate-950">{currentPrompt.nonVisualQuestion.prompt}</p>
              <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {currentPrompt.nonVisualQuestion.options.map((opt, oIdx) => {
                  const isPicked = pickedNonVisualIdx === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      aria-pressed={isPicked}
                      onClick={() => {
                        setPickedNonVisualIdx(oIdx);
                        setIdentifyChecked(false);
                      }}
                      className={`rounded-lg border px-3 py-2 text-left text-xs font-bold transition motion-reduce:transition-none ${
                        isPicked
                          ? 'border-amber-600 bg-amber-200/80 text-slate-950'
                          : 'border-amber-200 bg-white text-slate-800 hover:bg-amber-100/60'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm font-bold text-slate-950">{currentPrompt.prompt}</p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={activeNonVisual ? pickedNonVisualIdx === null : !pickedHotspotId}
              onClick={() => setIdentifyChecked(true)}
              className="rounded-lg bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-40"
            >
              {activeNonVisual ? 'Check answer' : 'Check selection'}
            </button>
            {identifyChecked && !isIdentifyCorrect && (
              <button
                type="button"
                onClick={() => {
                  setPickedHotspotId(null);
                  setPickedNonVisualIdx(null);
                  setIdentifyChecked(false);
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Try again
              </button>
            )}
            {identifyChecked && promptIdx + 1 < config.identifyPrompts!.length && (
              <button
                type="button"
                onClick={() => {
                  setPromptIdx((i) => i + 1);
                  setPickedHotspotId(null);
                  setPickedNonVisualIdx(null);
                  setIdentifyChecked(false);
                }}
                className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-800"
              >
                Next question
              </button>
            )}
          </div>

          {identifyChecked && (
            <div
              role="status"
              aria-live="polite"
              className={`mt-2.5 flex items-start gap-2 rounded-lg border p-2.5 font-semibold ${
                isIdentifyCorrect
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                  : 'border-rose-300 bg-rose-50 text-rose-950'
              }`}
            >
              {isIdentifyCorrect ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              )}
              <span>
                {isIdentifyCorrect ? 'Correct! ' : 'Not quite. '}
                {activeNonVisual && currentPrompt.nonVisualQuestion?.explanation
                  ? currentPrompt.nonVisualQuestion.explanation
                  : currentPrompt.explanation}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Image-Relative Diagram Stage (hotspots positioned strictly relative to rendered image) */}
      <figure className="mt-3 rounded-xl border border-slate-200 bg-slate-100 p-2 text-center">
        <div className="relative inline-block max-w-full overflow-hidden rounded-lg bg-white">
          <img
            src={resolvedSrc}
            alt={activeAltText}
            loading="eager"
            className="block max-h-[420px] w-auto max-w-full object-contain"
          />
          {renderOverlayMarkers(false)}
          <button
            ref={enlargeBtnRef}
            type="button"
            onClick={() => setEnlarged(true)}
            aria-label="Enlarge interactive diagram"
            className="absolute right-2 top-2 z-20 inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-slate-900"
          >
            <Maximize2 className="h-3 w-3" />
            Enlarge
          </button>
        </div>
        {config.diagram.caption && !concealLabels && (
          <figcaption className="mt-1.5 text-[11px] text-slate-600">
            {config.diagram.caption}
          </figcaption>
        )}
      </figure>

      {/* Accessible Label / Region Selector List (Keyboard + Dense Diagram Mobile Fallback) */}
      <div className="mt-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {concealLabels
            ? 'Select a numbered region (accessible list)'
            : 'Structures on this diagram (select to inspect)'}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {hotspots.map((h, idx) => {
            const isSelected = mode === 'explore' ? selectedId === h.id : pickedHotspotId === h.id;
            const isLinked = linkedSet.has(h.id);
            return (
              <button
                key={`list-${h.id}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => selectHotspot(h.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition ${
                  isSelected
                    ? 'border-amber-500 bg-amber-100 text-amber-950'
                    : isLinked
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span className="font-mono text-[11px]">{idx + 1}.</span>
                <span>{concealLabels ? `Region ${idx + 1}` : h.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explore Mode Detail Panel + Guided Navigation */}
      {mode === 'explore' && (
        <div className="mt-3 rounded-xl border-2 border-teal-200 bg-teal-50/40 p-4">
          {selectedHotspot ? (
            <div role="status" aria-live="polite" data-selected-hotspot-id={selectedHotspot.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-extrabold text-slate-950 sm:text-base">
                  {selectedHotspot.label}
                </h4>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={guidedPos <= 0}
                    onClick={() => handleGuidedStep(-1)}
                    className="inline-flex items-center gap-0.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Prev Part
                  </button>
                  <button
                    type="button"
                    disabled={guidedPos >= guidedIds.length - 1}
                    onClick={() => handleGuidedStep(1)}
                    className="inline-flex items-center gap-0.5 rounded-lg bg-teal-700 px-2.5 py-1 text-xs font-bold text-white hover:bg-teal-800 disabled:opacity-40"
                  >
                    Next Part
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-slate-800 sm:text-sm">
                {selectedHotspot.summary}
              </p>

              {selectedHotspot.equation && (
                <div
                  data-hotspot-equation="true"
                  className="mt-2.5 overflow-x-auto rounded-lg border border-slate-300 bg-slate-900 px-3 py-2 font-mono text-xs font-bold text-amber-200"
                >
                  {selectedHotspot.equation}
                </div>
              )}

              <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                {selectedHotspot.functionText && (
                  <div className="rounded-lg border border-sky-200 bg-sky-50/70 p-2.5 text-xs">
                    <span className="font-bold text-sky-900">Function: </span>
                    <span className="text-sky-950">{selectedHotspot.functionText}</span>
                  </div>
                )}
                {selectedHotspot.structureToFunction && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs">
                    <span className="font-bold text-emerald-900">How structure supports function: </span>
                    <span className="text-emerald-950">{selectedHotspot.structureToFunction}</span>
                  </div>
                )}
              </div>

              {selectedHotspot.linkedHotspotIds && selectedHotspot.linkedHotspotIds.length > 0 && (
                <div className="mt-2.5 rounded-lg border border-emerald-200 bg-white p-2.5 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5 font-bold text-emerald-900">
                    <Link2 className="h-3.5 w-3.5" />
                    Connected structures:
                    {selectedHotspot.linkedHotspotIds.map((lid) => (
                      <button
                        key={lid}
                        type="button"
                        onClick={() => selectHotspot(lid)}
                        className="min-h-[24px] rounded bg-emerald-100 px-2 py-1 text-[11px] font-bold text-emerald-900 hover:bg-emerald-200"
                      >
                        {hotspotById.get(lid)?.label ?? lid}
                      </button>
                    ))}
                  </div>
                  {selectedHotspot.relationshipExplanation && (
                    <p className="mt-1 text-slate-700">{selectedHotspot.relationshipExplanation}</p>
                  )}
                </div>
              )}

              {selectedHotspot.commonMisconception && (
                <div className="mt-2.5 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-950">
                  <span className="font-bold">Watch out: </span>
                  {selectedHotspot.commonMisconception}
                </div>
              )}

              {selectedHotspot.discoveryPrompt && (
                <p className="mt-2 text-xs font-semibold text-teal-900">
                  Think about it: {selectedHotspot.discoveryPrompt}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
              <span>Observe the diagram first, then reveal markers or click Start Guided Tour.</span>
              <button
                type="button"
                onClick={() => handleGuidedStep(1)}
                className="rounded-lg bg-teal-700 px-3 py-1.5 font-bold text-white hover:bg-teal-800"
              >
                Start Guided Tour
              </button>
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
            className="inline-flex min-h-[24px] items-center gap-1 text-xs font-semibold text-sky-700 hover:underline"
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

      {/* Enlarged Lightbox Modal */}
      {enlarged && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged interactive diagram"
          onClick={() => {
            setEnlarged(false);
            enlargeBtnRef.current?.focus();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92vh] max-w-5xl overflow-auto rounded-2xl bg-white p-4 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => {
                setEnlarged(false);
                enlargeBtnRef.current?.focus();
              }}
              aria-label="Close enlarged diagram"
              className="absolute right-3 top-3 z-30 inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white"
            >
              <X className="h-3.5 w-3.5" />
              Close
            </button>
            <div className="relative inline-block max-w-full">
              <img
                src={resolvedSrc}
                alt={activeAltText}
                className="block max-h-[80vh] w-auto max-w-full object-contain"
              />
              {renderOverlayMarkers(true)}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
