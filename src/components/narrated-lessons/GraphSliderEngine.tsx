'use client';

import React, { useEffect, useId, useMemo, useState } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  LineChart,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  Table as TableIcon,
} from 'lucide-react';
import type {
  GraphCurveDef,
  GraphSliderInteractiveConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import { evaluateMathAst, tryParseMathExpr, type MathAstNode } from '@/lib/narrated-lessons/math-expr';
import {
  buildStepSeriesPoints,
  evaluateGraphChallengeCheck,
  sampleFormulaCurve,
  type GraphPoint,
} from '@/lib/narrated-lessons/graph-sampler';

export interface GraphSliderEngineProps {
  config: GraphSliderInteractiveConfig;
}

const SVG_W = 640;
const SVG_H = 360;
const PAD = { top: 22, right: 24, bottom: 48, left: 60 };
const PLOT_W = SVG_W - PAD.left - PAD.right;
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

function buildInitialSliders(config: GraphSliderInteractiveConfig): Record<string, number> {
  const init: Record<string, number> = {};
  for (const s of config.sliders ?? []) {
    init[s.id] = s.defaultValue;
  }
  return init;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

function formatNum(v: number, precision = 2): string {
  if (!Number.isFinite(v)) return 'undefined';
  const rounded = Math.abs(v) < 1e-10 ? 0 : v;
  return rounded.toFixed(precision);
}

function dashForStyle(style?: GraphCurveDef['style']): string | undefined {
  if (style === 'dashed') return '8 5';
  if (style === 'dotted') return '2 5';
  return undefined;
}

function buildTicks(min: number, max: number, count = 5): number[] {
  const ticks: number[] = [];
  for (let i = 0; i <= count; i++) {
    ticks.push(min + ((max - min) * i) / count);
  }
  return ticks;
}

function interpolateSeriesY(points: readonly GraphPoint[], x: number, kind: 'piecewise' | 'step'): number {
  if (points.length === 0) return Number.NaN;
  if (x < points[0].x || x > points[points.length - 1].x) return Number.NaN;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if (x >= p1.x && x <= p2.x) {
      if (kind === 'step') return p1.y;
      const dx = p2.x - p1.x;
      if (dx === 0) return p2.y;
      return p1.y + ((x - p1.x) / dx) * (p2.y - p1.y);
    }
  }
  return points[points.length - 1].y;
}

/**
 * Reusable Cross-Subject Graph & Slider Discovery Engine (Step 4A).
 *
 * - Driven 100% by validated `GraphSliderInteractiveConfig` JSON.
 * - Zero eval(), zero external charting libraries, zero Firestore writes.
 * - Parses all expressions once via `useMemo` and evaluates bounded ASTs on slider updates.
 * - Supports formula curves, reference curves, discontinuity segmentation, projectile landing
 *   bisection, piecewise segments, step-line waveforms, live accessible coordinate inspection,
 *   Predict -> Experiment -> Observe -> Compare -> Explain -> Apply discovery flow, and compound challenges.
 */
export function GraphSliderEngine({ config }: GraphSliderEngineProps) {
  const clipId = useId().replace(/:/g, '');
  const xVar = config.xVar ?? 'x';
  const samples = config.samples ?? 160;

  const [sliderValues, setSliderValues] = useState<Record<string, number>>(() => buildInitialSliders(config));
  const [traceX, setTraceX] = useState<number>(() => 0.5 * (config.axes.xMin + config.axes.xMax));
  const [showTable, setShowTable] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(null);
  const [predictionChecked, setPredictionChecked] = useState(false);

  useEffect(() => {
    setSliderValues(buildInitialSliders(config));
    setTraceX(0.5 * (config.axes.xMin + config.axes.xMax));
    setShowTable(false);
    setShowHints(false);
    setSelectedPrediction(null);
    setPredictionChecked(false);
  }, [config]);

  // Parse all mathematical expressions ONCE per config
  const parsedCurves = useMemo(() => {
    const allowedVars = [xVar, ...(config.sliders ?? []).map((s) => s.id)];
    return config.curves.map((curve) => {
      const kind = curve.kind ?? 'formula';
      if (kind === 'formula' && curve.expr) {
        const res = tryParseMathExpr(curve.expr, allowedVars);
        return { curve, kind, ast: res.ok ? res.parsed.ast : null };
      }
      return { curve, kind, ast: null as MathAstNode | null };
    });
  }, [config.curves, config.sliders, xVar]);

  const parsedReadouts = useMemo(() => {
    const allowedVars = (config.sliders ?? []).map((s) => s.id);
    return (config.readouts ?? []).map((r) => {
      const res = tryParseMathExpr(r.expr, allowedVars);
      return { readout: r, ast: res.ok ? res.parsed.ast : null };
    });
  }, [config.readouts, config.sliders]);

  // Evaluate readouts
  const readoutResults = useMemo(() => {
    const map: Record<string, number> = {};
    for (const { readout, ast } of parsedReadouts) {
      map[readout.id] = ast ? evaluateMathAst(ast, sliderValues) : Number.NaN;
    }
    return map;
  }, [parsedReadouts, sliderValues]);

  // Sample all curves for SVG rendering
  const renderedCurves = useMemo(() => {
    const { xMin, xMax, yMin, yMax } = config.axes;
    const toSvgX = (x: number) => PAD.left + ((x - xMin) / (xMax - xMin)) * PLOT_W;
    const toSvgY = (y: number) => PAD.top + (1 - (y - yMin) / (yMax - yMin)) * PLOT_H;

    return parsedCurves.map(({ curve, kind, ast }) => {
      let segments: GraphPoint[][] = [];
      let landingX: number | undefined;

      if (kind === 'formula' && ast) {
        const res = sampleFormulaCurve(ast, sliderValues, {
          xVar,
          xMin,
          xMax,
          yMin,
          yMax,
          samples,
          domainMin: curve.domainMin,
          domainMax: curve.domainMax,
          stopAtYZero: curve.stopAtYZero,
        });
        segments = res.segments;
        landingX = res.landingX;
      } else if (kind === 'piecewise' && curve.points) {
        segments = [curve.points];
      } else if (kind === 'step' && curve.points) {
        segments = [buildStepSeriesPoints(curve.points)];
      }

      const paths = segments
        .filter((seg) => seg.length >= 2)
        .map((seg) =>
          seg
            .map((pt, idx) => `${idx === 0 ? 'M' : 'L'}${toSvgX(pt.x).toFixed(2)},${toSvgY(pt.y).toFixed(2)}`)
            .join(' ')
        );

      return { curve, kind, ast, paths, landingX };
    });
  }, [config.axes, parsedCurves, samples, sliderValues, xVar]);

  // Evaluate coordinates at live traceX
  const traceReadouts = useMemo(() => {
    return parsedCurves.map(({ curve, kind, ast }) => {
      let y = Number.NaN;
      if (kind === 'formula' && ast) {
        const inDomain =
          (curve.domainMin === undefined || traceX >= curve.domainMin) &&
          (curve.domainMax === undefined || traceX <= curve.domainMax);
        if (inDomain) {
          y = evaluateMathAst(ast, { ...sliderValues, [xVar]: traceX });
        }
      } else if ((kind === 'piecewise' || kind === 'step') && curve.points) {
        y = interpolateSeriesY(curve.points, traceX, kind);
      }
      return { curve, y };
    });
  }, [parsedCurves, sliderValues, traceX, xVar]);

  // Evaluate discovery challenges
  const challengeStatuses = useMemo(() => {
    return (config.challenges ?? []).map((ch) => ({
      challenge: ch,
      passed: evaluateGraphChallengeCheck(ch.check, sliderValues, readoutResults),
    }));
  }, [config.challenges, readoutResults, sliderValues]);

  const { xMin, xMax, yMin, yMax } = config.axes;
  const toSvgX = (x: number) => PAD.left + ((x - xMin) / (xMax - xMin)) * PLOT_W;
  const toSvgY = (y: number) => PAD.top + (1 - (y - yMin) / (yMax - yMin)) * PLOT_H;
  const xTicks = useMemo(() => buildTicks(xMin, xMax, 5), [xMin, xMax]);
  const yTicks = useMemo(() => buildTicks(yMin, yMax, 4), [yMin, yMax]);
  const traceStep = (xMax - xMin) / 40;

  const updateSlider = (id: string, next: number, min: number, max: number) => {
    const clamped = clamp(Number(next.toFixed(6)), min, max);
    setSliderValues((prev) => ({ ...prev, [id]: clamped }));
  };

  const handleReset = () => {
    setSliderValues(buildInitialSliders(config));
    setTraceX(0.5 * (xMin + xMax));
  };

  const tableSampleXs = useMemo(() => buildTicks(xMin, xMax, 5), [xMin, xMax]);

  return (
    <section
      aria-label={config.accessibilityLabel}
      data-interactive-engine="graph-slider"
      data-interactive-id={config.id}
      className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-sky-700">
              <LineChart className="h-3 w-3" />
              Graph &amp; Slider Lab
            </span>
            {config.subjectTag && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                {config.subjectTag}
              </span>
            )}
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

      {/* Optional Predict-Before-Experiment Prompt (never blocks access to graph) */}
      {config.prediction && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-950">
          <p className="font-bold">Predict first: {config.prediction.prompt}</p>
          <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
            {config.prediction.options.map((opt, idx) => {
              const selected = selectedPrediction === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setSelectedPrediction(idx);
                    setPredictionChecked(false);
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
              disabled={selectedPrediction === null}
              onClick={() => setPredictionChecked(true)}
              className="rounded-lg bg-amber-600 px-3 py-1 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-40"
            >
              Check prediction
            </button>
            {predictionChecked && selectedPrediction !== null && (
              <span className="font-semibold text-slate-900">
                {selectedPrediction === config.prediction.correctIndex ? 'Spot on! ' : 'Good hypothesis — now test it below! '}
                {config.prediction.explanation}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Responsive SVG Graph */}
      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 p-2">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          role="img"
          aria-label={`${config.title} graph of ${config.axes.yLabel} against ${config.axes.xLabel}`}
          className="h-auto w-full select-none"
        >
          <defs>
            <clipPath id={`plot-clip-${clipId}`}>
              <rect x={PAD.left} y={PAD.top} width={PLOT_W} height={PLOT_H} />
            </clipPath>
          </defs>

          {/* Background plot area */}
          <rect x={PAD.left} y={PAD.top} width={PLOT_W} height={PLOT_H} fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />

          {/* Gridlines & Axis Ticks */}
          {xTicks.map((t, i) => {
            const sx = toSvgX(t);
            return (
              <g key={`xt-${i}`}>
                <line x1={sx} y1={PAD.top} x2={sx} y2={PAD.top + PLOT_H} stroke="#e2e8f0" strokeWidth="1" />
                <text x={sx} y={PAD.top + PLOT_H + 16} textAnchor="middle" fontSize="11" fill="#475569">
                  {Number(t.toFixed(2))}
                </text>
              </g>
            );
          })}
          {yTicks.map((t, i) => {
            const sy = toSvgY(t);
            return (
              <g key={`yt-${i}`}>
                <line x1={PAD.left} y1={sy} x2={PAD.left + PLOT_W} y2={sy} stroke="#e2e8f0" strokeWidth="1" />
                <text x={PAD.left - 8} y={sy + 4} textAnchor="end" fontSize="11" fill="#475569">
                  {Number(t.toFixed(2))}
                </text>
              </g>
            );
          })}

          {/* Zero Axes if visible inside viewport */}
          {xMin < 0 && xMax > 0 && (
            <line x1={toSvgX(0)} y1={PAD.top} x2={toSvgX(0)} y2={PAD.top + PLOT_H} stroke="#64748b" strokeWidth="1.5" />
          )}
          {yMin < 0 && yMax > 0 && (
            <line x1={PAD.left} y1={toSvgY(0)} x2={PAD.left + PLOT_W} y2={toSvgY(0)} stroke="#64748b" strokeWidth="1.5" />
          )}

          {/* Clipped Curves & Trace Markers */}
          <g clipPath={`url(#plot-clip-${clipId})`}>
            {renderedCurves.map(({ curve, paths }) =>
              paths.map((d, segIdx) => (
                <path
                  key={`${curve.id}-${segIdx}`}
                  d={d}
                  fill="none"
                  stroke={curve.color}
                  strokeWidth={curve.isReference ? 2 : 3}
                  strokeDasharray={dashForStyle(curve.style ?? (curve.isReference ? 'dashed' : 'solid'))}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={curve.isReference ? 0.75 : 1}
                />
              ))
            )}

            {/* Vertical trace guideline */}
            <line
              x1={toSvgX(traceX)}
              y1={PAD.top}
              x2={toSvgX(traceX)}
              y2={PAD.top + PLOT_H}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            {traceReadouts.map(({ curve, y }) =>
              Number.isFinite(y) ? (
                <circle
                  key={`trace-${curve.id}`}
                  cx={toSvgX(traceX)}
                  cy={toSvgY(y)}
                  r={4.5}
                  fill={curve.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ) : null
            )}
          </g>

          {/* Axis Labels */}
          <text x={PAD.left + PLOT_W / 2} y={SVG_H - 8} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e293b">
            {config.axes.xLabel}
            {config.axes.xUnit ? ` (${config.axes.xUnit})` : ''}
          </text>
          <text
            x={16}
            y={PAD.top + PLOT_H / 2}
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill="#1e293b"
            transform={`rotate(-90 16 ${PAD.top + PLOT_H / 2})`}
          >
            {config.axes.yLabel}
            {config.axes.yUnit ? ` (${config.axes.yUnit})` : ''}
          </text>
        </svg>

        {/* Accessible Curve Legend (color + line-style label) */}
        <div className="mt-2 flex flex-wrap items-center gap-3 px-2 text-xs text-slate-700">
          {config.curves.map((c) => {
            const style = c.style ?? (c.isReference ? 'dashed' : 'solid');
            return (
              <span key={c.id} className="inline-flex items-center gap-1.5 font-medium">
                <svg width="22" height="8" aria-hidden="true">
                  <line
                    x1="0"
                    y1="4"
                    x2="22"
                    y2="4"
                    stroke={c.color}
                    strokeWidth="3"
                    strokeDasharray={dashForStyle(style)}
                  />
                </svg>
                <span>
                  {c.label}
                  {c.isReference ? ' (reference)' : ''}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Accessible Coordinate Inspector (Keyboard + Touch) */}
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor={`trace-${clipId}`} className="font-bold text-slate-800">
            Inspect point at {config.axes.xLabel}: {formatNum(traceX, 2)}
            {config.axes.xUnit ? ` ${config.axes.xUnit}` : ''}
          </label>
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            aria-expanded={showTable}
            className="inline-flex items-center gap-1 font-semibold text-sky-700 hover:underline"
          >
            <TableIcon className="h-3.5 w-3.5" />
            {showTable ? 'Hide data table' : 'Show data table'}
          </button>
        </div>
        <input
          id={`trace-${clipId}`}
          type="range"
          min={xMin}
          max={xMax}
          step={traceStep}
          value={traceX}
          onChange={(e) => setTraceX(Number(e.target.value))}
          aria-label={`Inspect ${config.axes.xLabel} coordinate`}
          className="mt-1.5 h-2 w-full cursor-pointer accent-slate-600"
        />
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-slate-700">
          {traceReadouts.map(({ curve, y }) => (
            <span key={curve.id}>
              <strong>{curve.label}:</strong> {formatNum(y, 2)}
              {Number.isFinite(y) && config.axes.yUnit ? ` ${config.axes.yUnit}` : ''}
            </span>
          ))}
        </div>

        {showTable && (
          <div className="mt-2.5 overflow-x-auto">
            <table className="w-full border-collapse text-left text-[11px]">
              <thead>
                <tr className="border-b border-slate-300 text-slate-600">
                  <th className="py-1 pr-3 font-bold">
                    {config.axes.xLabel}
                    {config.axes.xUnit ? ` (${config.axes.xUnit})` : ''}
                  </th>
                  {config.curves.map((c) => (
                    <th key={c.id} className="py-1 pr-3 font-bold">
                      {c.label}
                      {config.axes.yUnit ? ` (${config.axes.yUnit})` : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableSampleXs.map((tx, idx) => (
                  <tr key={idx} className="border-b border-slate-200/70">
                    <td className="py-1 pr-3 font-mono">{formatNum(tx, 2)}</td>
                    {parsedCurves.map(({ curve, kind, ast }) => {
                      let ty = Number.NaN;
                      if (kind === 'formula' && ast) {
                        ty = evaluateMathAst(ast, { ...sliderValues, [xVar]: tx });
                      } else if ((kind === 'piecewise' || kind === 'step') && curve.points) {
                        ty = interpolateSeriesY(curve.points, tx, kind);
                      }
                      return (
                        <td key={curve.id} className="py-1 pr-3 font-mono">
                          {formatNum(ty, 2)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Parameter Sliders */}
      {config.sliders && config.sliders.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {config.sliders.map((s) => {
            const val = sliderValues[s.id] ?? s.defaultValue;
            const unitSuffix = s.unit ? ` ${s.unit}` : '';
            return (
              <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor={`slider-${clipId}-${s.id}`} className="text-xs font-bold text-slate-800">
                    {s.label}
                  </label>
                  <span className="rounded-md bg-sky-50 px-2 py-0.5 font-mono text-xs font-extrabold text-sky-900">
                    {val}
                    {unitSuffix}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Decrease ${s.label}`}
                    onClick={() => updateSlider(s.id, val - s.step, s.min, s.max)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <input
                    id={`slider-${clipId}-${s.id}`}
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={val}
                    aria-valuetext={`${val}${unitSuffix}`}
                    onChange={(e) => updateSlider(s.id, Number(e.target.value), s.min, s.max)}
                    className="h-2 flex-1 cursor-pointer accent-sky-600"
                  />
                  <button
                    type="button"
                    aria-label={`Increase ${s.label}`}
                    onClick={() => updateSlider(s.id, val + s.step, s.min, s.max)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                {s.presets && s.presets.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.presets.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => updateSlider(s.id, p, s.min, s.max)}
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold transition ${
                          Math.abs(val - p) < 1e-6
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {p}
                        {s.unit ?? ''}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Computed Readout Cards */}
      {config.readouts && config.readouts.length > 0 && (
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {config.readouts.map((r) => {
            const val = readoutResults[r.id];
            return (
              <div
                key={r.id}
                data-readout-id={r.id}
                className="rounded-xl border border-indigo-200 bg-indigo-50/50 px-3.5 py-2.5"
              >
                <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-700">
                  {r.label}
                </p>
                <p className="mt-0.5 font-mono text-lg font-extrabold text-slate-900">
                  {formatNum(val, r.precision ?? 2)}
                  {Number.isFinite(val) && r.unit ? ` ${r.unit}` : ''}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Discovery Challenges */}
      {challengeStatuses.length > 0 && (
        <div className="mt-3 space-y-2">
          {challengeStatuses.map(({ challenge, passed }) => (
            <div
              key={challenge.id}
              role="status"
              aria-live="polite"
              data-challenge-id={challenge.id}
              data-challenge-passed={passed ? 'true' : 'false'}
              className={`rounded-xl border-2 p-3 text-xs transition ${
                passed
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
                  : 'border-slate-200 bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {passed ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                )}
                <div className="min-w-0">
                  <p className="font-bold">Discovery Challenge: {challenge.prompt}</p>
                  {passed ? (
                    <p className="mt-1 font-semibold text-emerald-900">{challenge.successText}</p>
                  ) : (
                    challenge.hintText && <p className="mt-1 text-slate-600">{challenge.hintText}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Model Assumptions & Optional Hints */}
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
    </section>
  );
}
