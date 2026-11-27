'use client';

import React, { useMemo, useRef, useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Dices,
  HelpCircle,
  RefreshCw,
  RotateCcw,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import type { DataStatsLabConstructionConfig } from '@/lib/narrated-lessons/interactive-schema';
import {
  DATA_STATS_LIMITS,
  buildCumulativeFrequency,
  buildHistogramModel,
  computeBoxPlotModel,
  computeDescriptiveStats,
  computeDotPlotModel,
  computeGroupedStats,
  computePieChartModel,
  computeScatterRegression,
  computeTheoreticalProbability,
  createSeededRng,
  evaluateDataStatsAnswer,
  expandFrequencyTable,
  roundClean,
  runProbabilityBatch,
  type DataStatsEvalResult,
  type QuartileConvention,
} from '@/lib/construction-lab/data-stats-engine';

export function DataStatsLab({ config }: { config: DataStatsLabConstructionConfig }) {
  // Mode 1: Probability experiment state (stateful PRNG that advances across trials!)
  const initialSeed = config.mode === 'probability-experiment' ? (config.seed ?? 20260504) : 20260504;
  const [seed, setSeed] = useState<number>(initialSeed);
  const rngRef = useRef<() => number>(createSeededRng(initialSeed));
  const [totalTrials, setTotalTrials] = useState<number>(0);
  const [eventHits, setEventHits] = useState<number>(0);
  const [outcomeCounts, setOutcomeCounts] = useState<Record<string, number>>({});
  const [lastDraw, setLastDraw] = useState<string[]>([]);

  // Mode 2 & 4: Outlier toggle & quartile convention
  const [includeOutlier, setIncludeOutlier] = useState<boolean>(false);
  const [quartileConv, setQuartileConv] = useState<QuartileConvention>(
    config.mode === 'descriptive-stats' || config.mode === 'data-visualisation'
      ? (config.quartileConvention ?? 'tukey-exclusive')
      : 'tukey-exclusive',
  );

  // Assessment state
  const [answerText, setAnswerText] = useState<string>('');
  const [result, setResult] = useState<DataStatsEvalResult | null>(null);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [predictionChoice, setPredictionChoice] = useState<number | null>(null);
  const [predictionChecked, setPredictionChecked] = useState<boolean>(false);

  const handleRunTrials = (count: number) => {
    if (config.mode !== 'probability-experiment') return;
    const remainingBudget = DATA_STATS_LIMITS.maxTrialsTotal - totalTrials;
    const toRun = Math.min(count, remainingBudget);
    if (toRun <= 0) return;

    const batch = runProbabilityBatch(config, toRun, rngRef.current);
    setTotalTrials((t) => t + batch.totalTrials);
    setEventHits((h) => h + batch.eventHits);
    setOutcomeCounts((prev) => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(batch.outcomeCounts)) {
        next[k] = (next[k] ?? 0) + v;
      }
      return next;
    });
    if (batch.recentTrials.length > 0) {
      setLastDraw(batch.recentTrials[batch.recentTrials.length - 1].drawnIds);
    }
  };

  const handleReset = (newSeed?: number) => {
    const s = newSeed ?? initialSeed;
    setSeed(s);
    rngRef.current = createSeededRng(s);
    setTotalTrials(0);
    setEventHits(0);
    setOutcomeCounts({});
    setLastDraw([]);
    setIncludeOutlier(false);
    setAnswerText('');
    setResult(null);
  };

  const descValues = useMemo(() => {
    if (config.mode !== 'descriptive-stats') return [];
    const base = config.frequencyTable
      ? expandFrequencyTable(config.frequencyTable)
      : (config.data ?? []);
    return includeOutlier && config.outlierCandidate !== undefined
      ? [...base, config.outlierCandidate]
      : base;
  }, [config, includeOutlier]);

  const descStats = useMemo(() => {
    if (config.mode !== 'descriptive-stats') return null;
    return config.groupedTable
      ? computeGroupedStats(config.groupedTable, quartileConv)
      : computeDescriptiveStats(descValues, quartileConv);
  }, [config, descValues, quartileConv]);

  const scatterReg = useMemo(() => {
    if (config.mode !== 'scatter-regression') return null;
    const pts =
      includeOutlier && config.outlierPoint
        ? [...config.points, config.outlierPoint]
        : config.points;
    return computeScatterRegression(pts);
  }, [config, includeOutlier]);

  const theoreticalProb = useMemo(
    () => (config.mode === 'probability-experiment' ? computeTheoreticalProbability(config) : null),
    [config],
  );

  const handleCheck = () => {
    setResult(
      evaluateDataStatsAnswer(
        config,
        answerText,
        config.mode === 'descriptive-stats' && !config.groupedTable ? descValues : undefined,
        includeOutlier,
        config.mode === 'probability-experiment' ? { totalTrials, eventHits } : undefined,
      ),
    );
  };

  return (
    <section
      aria-label={config.accessibilityLabel}
      data-interactive-engine="construction-lab"
      data-lab-kind="data-stats-lab"
      data-stats-mode={config.mode}
      data-interactive-id={config.id}
      className="mt-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-violet-800">
              {config.mode === 'probability-experiment' ? (
                <Dices className="h-3 w-3" />
              ) : config.mode === 'scatter-regression' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <BarChart3 className="h-3 w-3" />
              )}
              Probability &amp; Statistics
            </span>
            {config.subjectTag && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                {config.subjectTag}
              </span>
            )}
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
              {config.learningMode === 'practice' ? 'Independent practice' : 'Guided discovery'}
            </span>
          </div>
          <h3 className="mt-1.5 text-sm font-extrabold text-slate-900 sm:text-base">{config.title}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{config.instructions}</p>
        </div>

        <button
          type="button"
          onClick={() => handleReset()}
          aria-label="Reset probability and statistics lab"
          className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Optional Prediction */}
      {config.prediction && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs">
          <p className="font-bold text-amber-950">Predict first: {config.prediction.prompt}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {config.prediction.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                aria-pressed={predictionChoice === idx}
                onClick={() => {
                  setPredictionChoice(idx);
                  setPredictionChecked(true);
                }}
                className={`min-h-[44px] rounded-lg border px-3 py-1.5 font-semibold ${
                  predictionChoice === idx
                    ? 'border-amber-600 bg-amber-100 text-amber-950'
                    : 'border-amber-200 bg-white text-slate-800 hover:bg-amber-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {predictionChecked && (
            <p className="mt-2 font-medium text-amber-900" role="status">
              {predictionChoice === config.prediction.correctIndex ? 'Great prediction! ' : 'Good hypothesis — '}
              {config.prediction.explanation}
            </p>
          )}
        </div>
      )}

      {/* MODE 1: PROBABILITY EXPERIMENT */}
      {config.mode === 'probability-experiment' && (
        <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-slate-800">
              Target event: {config.targetEvent.description} (Seed #{seed} ·{' '}
              {config.withReplacement === false ? 'Without replacement' : 'With replacement'})
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleRunTrials(1)}
                className="min-h-[44px] rounded-lg bg-violet-600 px-3 py-1.5 font-bold text-white hover:bg-violet-700"
              >
                Run 1 Trial
              </button>
              <button
                type="button"
                onClick={() => handleRunTrials(20)}
                className="min-h-[44px] rounded-lg bg-violet-100 px-3 py-1.5 font-bold text-violet-900 hover:bg-violet-200"
              >
                +20 Trials
              </button>
              <button
                type="button"
                onClick={() => handleRunTrials(100)}
                className="min-h-[44px] rounded-lg bg-violet-100 px-3 py-1.5 font-bold text-violet-900 hover:bg-violet-200"
              >
                +100 Trials
              </button>
              <button
                type="button"
                onClick={() => handleReset(seed + 17)}
                className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Fresh Seed
              </button>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-2.5">
              <p className="text-[11px] text-slate-500">Total Trials</p>
              <p className="text-lg font-extrabold text-slate-900" data-testid="prob-total-trials">
                {totalTrials}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-2.5">
              <p className="text-[11px] text-slate-500">Experimental Relative Frequency</p>
              <p className="text-lg font-extrabold text-violet-800" data-testid="prob-exp-freq">
                {totalTrials > 0 ? `${eventHits}/${totalTrials} (${roundClean(eventHits / totalTrials, 3)})` : '—'}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-2.5">
              <p className="text-[11px] text-slate-500">Latest Draw</p>
              <p className="text-sm font-bold text-slate-800">
                {lastDraw.length > 0 ? lastDraw.join(' → ') : 'Click Run 1 Trial'}
              </p>
            </div>
          </div>

          {/* Accessible Outcomes Table */}
          <table className="w-full border-collapse rounded-lg bg-white text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="p-2">Outcome</th>
                <th className="p-2">Observed Count</th>
                <th className="p-2">Relative Frequency</th>
              </tr>
            </thead>
            <tbody>
              {config.outcomes.map((o) => {
                const c = outcomeCounts[o.id] ?? 0;
                const denom = Math.max(1, totalTrials * (config.drawsPerTrial ?? 1));
                return (
                  <tr key={o.id} className="border-b border-slate-100">
                    <td className="p-2 font-bold text-slate-800">{o.label}</td>
                    <td className="p-2 font-mono">{c}</td>
                    <td className="p-2 font-mono">{totalTrials > 0 ? roundClean(c / denom, 3) : '0'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {config.learningMode !== 'practice' && theoreticalProb !== null && totalTrials >= 20 && (
            <p className="text-[11px] text-slate-600">
              Note: Experimental relative frequency approaches the theoretical probability as trials grow, but random variation means they rarely match identically.
            </p>
          )}
        </div>
      )}

      {/* MODE 2: DESCRIPTIVE STATISTICS */}
      {config.mode === 'descriptive-stats' && descStats && (
        <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-slate-800">
              {descStats.isGroupedEstimate
                ? `Grouped Frequency Table (n = ${descStats.n} — statistics are class-midpoint estimates)`
                : `Exact Dataset (n = ${descStats.n})`}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {config.outlierCandidate !== undefined && (
                <button
                  type="button"
                  aria-pressed={includeOutlier}
                  onClick={() => {
                    setIncludeOutlier((v) => !v);
                    setResult(null);
                  }}
                  className={`min-h-[44px] rounded-lg border px-3 py-1 font-bold ${
                    includeOutlier
                      ? 'border-rose-500 bg-rose-50 text-rose-800'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  {includeOutlier
                    ? `Outlier (${config.outlierCandidate}) Included`
                    : `Toggle Outlier (${config.outlierCandidate})`}
                </button>
              )}
              {!config.groupedTable && (
                <select
                  aria-label="Quartile convention"
                  value={quartileConv}
                  onChange={(e) => setQuartileConv(e.target.value as QuartileConvention)}
                  className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700"
                >
                  <option value="tukey-exclusive">Quartiles: Tukey Exclusive</option>
                  <option value="tukey-inclusive">Quartiles: Tukey Inclusive</option>
                  <option value="linear-interpolation">Quartiles: Linear Interpolation</option>
                </select>
              )}
            </div>
          </div>

          {config.groupedTable ? (
            <table className="w-full border-collapse bg-white text-left text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="p-2">Class Interval</th>
                  <th className="p-2">Midpoint</th>
                  <th className="p-2">Frequency</th>
                </tr>
              </thead>
              <tbody>
                {config.groupedTable.map((r, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="p-2 font-mono">
                      {r.lower} ≤ x &lt; {r.upper}
                    </td>
                    <td className="p-2 font-mono">{roundClean((r.lower + r.upper) / 2, 2)}</td>
                    <td className="p-2 font-mono font-bold">{r.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white p-2.5 font-mono text-slate-800">
              Sorted values: {([...descValues].sort((a, b) => a - b)).join(', ')}
            </div>
          )}
        </div>
      )}

      {/* MODE 3: DATA VISUALISATION */}
      {config.mode === 'data-visualisation' && (
        <div className="mt-3 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
          {(config.chartKind === 'histogram' ||
            config.chartKind === 'frequency-polygon' ||
            config.chartKind === 'cumulative-frequency') &&
            config.groupedTable && (() => {
              const bins = buildHistogramModel(config.groupedTable);
              const cumPts = buildCumulativeFrequency(config.groupedTable);
              const minX = bins[0].lower;
              const maxX = bins[bins.length - 1].upper;
              const maxFD = Math.max(...bins.map((b) => b.frequencyDensity), 1e-6);
              const maxCum = cumPts[cumPts.length - 1]?.cumulativeFrequency ?? 1;
              return (
                <>
                  <svg
                    viewBox="0 0 360 150"
                    role="img"
                    aria-label={`${config.chartKind} chart`}
                    className="h-auto w-full max-w-xl"
                  >
                    <rect x="4" y="4" width="352" height="142" rx="8" fill="#ffffff" stroke="#cbd5e1" />
                    <line x1="42" y1="18" x2="42" y2="120" stroke="#334155" strokeWidth="1.4" />
                    <line x1="42" y1="120" x2="340" y2="120" stroke="#334155" strokeWidth="1.4" />
                    {config.chartKind === 'histogram' &&
                      bins.map((b, i) => {
                        const x1 = 42 + ((b.lower - minX) / Math.max(1e-9, maxX - minX)) * 290;
                        const x2 = 42 + ((b.upper - minX) / Math.max(1e-9, maxX - minX)) * 290;
                        const h = (b.frequencyDensity / maxFD) * 94;
                        return (
                          <g key={i} data-testid={`hist-bin-${i}`} data-fd={b.frequencyDensity}>
                            <rect
                              x={x1}
                              y={120 - h}
                              width={Math.max(2, x2 - x1)}
                              height={h}
                              fill="#6366f1"
                              opacity="0.78"
                              stroke="#312e81"
                            />
                            <text x={(x1 + x2) / 2} y="133" textAnchor="middle" fontSize="8" fill="#334155">
                              {b.lower}–{b.upper}
                            </text>
                          </g>
                        );
                      })}
                    {config.chartKind === 'frequency-polygon' && (
                      <g data-testid="svg-freq-polygon">
                        <polyline
                          data-testid="freq-polygon-line"
                          fill="none"
                          stroke="#7c3aed"
                          strokeWidth="2.2"
                          points={bins
                            .map((b) => {
                              const x = 42 + ((b.midpoint - minX) / Math.max(1e-9, maxX - minX)) * 290;
                              const y = 120 - (b.frequencyDensity / maxFD) * 94;
                              return `${x.toFixed(1)},${y.toFixed(1)}`;
                            })
                            .join(' ')}
                        />
                        {bins.map((b, i) => {
                          const x = 42 + ((b.midpoint - minX) / Math.max(1e-9, maxX - minX)) * 290;
                          const y = 120 - (b.frequencyDensity / maxFD) * 94;
                          return <circle key={i} data-testid={`fp-pt-${i}`} cx={x} cy={y} r="3.5" fill="#7c3aed" />;
                        })}
                      </g>
                    )}
                    {config.chartKind === 'cumulative-frequency' && (
                      <polyline
                        data-testid="cum-freq-line"
                        fill="none"
                        stroke="#0f766e"
                        strokeWidth="2.2"
                        points={cumPts
                          .map((p) => {
                            const x = 42 + ((p.x - minX) / Math.max(1e-9, maxX - minX)) * 290;
                            const y = 120 - (p.cumulativeFrequency / Math.max(1, maxCum)) * 94;
                            return `${x.toFixed(1)},${y.toFixed(1)}`;
                          })
                          .join(' ')}
                      />
                    )}
                    <text x="190" y="143" textAnchor="middle" fontSize="8.5" fill="#475569">
                      {config.chartKind === 'histogram'
                        ? 'Continuous Histogram (Y = Frequency Density; Area = Frequency)'
                        : config.chartKind === 'frequency-polygon'
                          ? 'Frequency Polygon (Midpoints · Y = Frequency Density)'
                          : config.xLabel ?? 'Class Upper Bound'}
                    </text>
                  </svg>
                  <table className="w-full border-collapse bg-white text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600">
                        <th className="p-2">Class</th>
                        <th className="p-2">Width</th>
                        <th className="p-2">Frequency</th>
                        <th className="p-2">Freq. Density</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bins.map((b, i) => (
                        <tr key={i} className="border-b border-slate-100">
                          <td className="p-2 font-mono">{b.lower}–{b.upper}</td>
                          <td className="p-2 font-mono">{b.classWidth}</td>
                          <td className="p-2 font-mono">{b.frequency}</td>
                          <td className="p-2 font-mono font-bold">{b.frequencyDensity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              );
            })()}

          {/* GENUINE BAR CHART */}
          {config.chartKind === 'bar' && config.categories && (() => {
            const maxF = Math.max(...config.categories.map((c) => c.frequency), 1);
            return (
              <svg viewBox="0 0 360 140" role="img" aria-label="Categorical bar chart" data-testid="svg-bar" className="h-auto w-full max-w-xl">
                <rect x="4" y="4" width="352" height="132" rx="8" fill="#ffffff" stroke="#cbd5e1" />
                {config.categories.map((cat, idx) => {
                  const bw = 280 / config.categories!.length;
                  const x = 44 + idx * bw + 6;
                  const h = (cat.frequency / maxF) * 86;
                  return (
                    <g key={cat.label}>
                      <rect x={x} y={110 - h} width={Math.max(12, bw - 12)} height={h} rx="3" fill="#0d9488" />
                      <text x={x + Math.max(12, bw - 12) / 2} y="124" textAnchor="middle" fontSize="8" fill="#0f172a">{cat.label}</text>
                      <text x={x + Math.max(12, bw - 12) / 2} y={106 - h} textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f172a">{cat.frequency}</text>
                    </g>
                  );
                })}
              </svg>
            );
          })()}

          {/* GENUINE PICTOGRAM WITH REPEATED SYMBOLS & VISIBLE KEY */}
          {config.chartKind === 'pictogram' && config.categories && (() => {
            const unit = config.pictogramUnit && config.pictogramUnit > 0 ? config.pictogramUnit : 1;
            return (
              <div className="space-y-2" data-testid="svg-pictogram">
                <p className="font-bold text-slate-700">Key: ● = {unit} unit{unit === 1 ? '' : 's'} (◐ = {roundClean(unit / 2, 2)})</p>
                <div className="space-y-1.5 rounded-lg border border-slate-200 bg-white p-2.5">
                  {config.categories.map((cat) => {
                    const exactSymbols = cat.frequency / unit;
                    const fullCount = Math.floor(exactSymbols);
                    const hasHalf = exactSymbols - fullCount >= 0.25;
                    return (
                      <div key={cat.label} className="flex items-center gap-2" data-picto-row={cat.label} data-full-symbols={fullCount}>
                        <span className="w-24 font-bold text-slate-800">{cat.label}</span>
                        <div className="flex flex-wrap items-center gap-1" aria-label={`${cat.label}: ${cat.frequency}`}>
                          {Array.from({ length: Math.min(fullCount, 20) }).map((_, i) => (
                            <span key={i} className="inline-block h-4 w-4 rounded-full bg-emerald-600" aria-hidden="true" />
                          ))}
                          {hasHalf && (
                            <span className="inline-block h-4 w-2 rounded-l-full bg-emerald-600" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* GENUINE PIE CHART WITH CIRCULAR SECTORS & PERCENTAGE LEGEND */}
          {config.chartKind === 'pie' && config.categories && (() => {
            const sectors = computePieChartModel(config.categories);
            if (!sectors) return <p className="text-rose-700">Pie chart undefined (all-zero total).</p>;
            const cx = 96;
            const cy = 72;
            const r = 56;
            const polar = (deg: number) => {
              const rad = ((deg - 90) * Math.PI) / 180;
              return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
            };
            return (
              <div className="flex flex-wrap items-center gap-4">
                <svg viewBox="0 0 192 144" role="img" aria-label="Pie chart" data-testid="svg-pie" className="h-36 w-48">
                  {sectors.map((s, idx) => {
                    if (s.frequency <= 0) return null;
                    if (s.isFullCircle) {
                      return <circle key={idx} data-testid={`pie-sector-${idx}`} cx={cx} cy={cy} r={r} fill={s.color} />;
                    }
                    const p1 = polar(s.startAngleDeg);
                    const p2 = polar(s.endAngleDeg);
                    const largeArc = s.endAngleDeg - s.startAngleDeg > 180 ? 1 : 0;
                    const d = `M ${cx} ${cy} L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} Z`;
                    return (
                      <path
                        key={idx}
                        data-testid={`pie-sector-${idx}`}
                        data-angle-deg={roundClean(s.endAngleDeg - s.startAngleDeg, 2)}
                        d={d}
                        fill={s.color}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </svg>
                <ul className="space-y-1 text-[11px]">
                  {sectors.map((s) => (
                    <li key={s.label} className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: s.color }} />
                      <span className="font-bold text-slate-800">{s.label}:</span>
                      <span className="font-mono text-slate-600">{s.frequency} ({s.percentage}%)</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}

          {/* GENUINE DOT PLOT WITH GRADUATED AXIS & STACKED DOTS */}
          {config.chartKind === 'dot-plot' && config.rawValues && (() => {
            const stacks = computeDotPlotModel(config.rawValues);
            const lo = stacks[0]?.value ?? 0;
            const hi = stacks[stacks.length - 1]?.value ?? 1;
            const toX = (v: number) => (hi === lo ? 180 : 36 + ((v - lo) / (hi - lo)) * 288);
            return (
              <svg viewBox="0 0 360 120" role="img" aria-label="Dot plot" data-testid="svg-dot-plot" className="h-auto w-full max-w-xl">
                <rect x="4" y="4" width="352" height="112" rx="8" fill="#ffffff" stroke="#cbd5e1" />
                <line x1="28" y1="92" x2="332" y2="92" stroke="#334155" strokeWidth="1.4" />
                {stacks.map((st) => {
                  const x = toX(st.value);
                  return (
                    <g key={st.value} data-dot-value={st.value} data-dot-stack={st.count}>
                      {Array.from({ length: Math.min(st.count, 10) }).map((_, k) => (
                        <circle key={k} cx={x} cy={82 - k * 8} r="3.5" fill="#2563eb" />
                      ))}
                      <text x={x} y="106" textAnchor="middle" fontSize="8" fill="#0f172a">{st.value}</text>
                    </g>
                  );
                })}
              </svg>
            );
          })()}

          {/* GENUINE BOX PLOT WITH MIN-MAX & TUKEY 1.5-IQR WHISKERS + OUTLIERS */}
          {config.chartKind === 'box-plot' && config.rawValues && (() => {
            const bp = computeBoxPlotModel(config.rawValues, quartileConv, config.whiskerConvention ?? 'min-max');
            if (!bp) return null;
            const lo = bp.min;
            const hi = bp.max;
            const toX = (v: number) => (bp.isConstant ? 180 : 36 + ((v - lo) / (hi - lo)) * 288);
            return (
              <div className="space-y-1.5">
                <svg viewBox="0 0 360 116" role="img" aria-label="Box plot diagram" data-testid="svg-box-plot" className="h-auto w-full max-w-xl">
                  <rect x="4" y="4" width="352" height="108" rx="8" fill="#ffffff" stroke="#cbd5e1" />
                  <line x1="36" y1="92" x2="324" y2="92" stroke="#64748b" strokeWidth="1" />
                  <line x1={toX(bp.lowerWhisker)} y1="50" x2={toX(bp.q1)} y2="50" stroke="#334155" strokeWidth="1.8" />
                  <line x1={toX(bp.q3)} y1="50" x2={toX(bp.upperWhisker)} y2="50" stroke="#334155" strokeWidth="1.8" />
                  <rect x={toX(bp.q1)} y="32" width={Math.max(2, toX(bp.q3) - toX(bp.q1))} height="36" fill="#c7d2fe" stroke="#3730a3" strokeWidth="1.8" />
                  <line x1={toX(bp.median)} y1="32" x2={toX(bp.median)} y2="68" stroke="#dc2626" strokeWidth="2.2" />
                  {bp.outliers.map((o, idx) => (
                    <circle key={idx} data-testid="boxplot-outlier" data-outlier-val={o} cx={toX(o)} cy="50" r="4" fill="#dc2626" />
                  ))}
                  <text x={toX(lo)} y="104" textAnchor="middle" fontSize="8">{lo}</text>
                  <text x={toX(bp.median)} y="104" textAnchor="middle" fontSize="8" fontWeight="bold">Med={bp.median}</text>
                  <text x={toX(hi)} y="104" textAnchor="middle" fontSize="8">{hi}</text>
                </svg>
                <p className="text-[11px] text-slate-600">
                  Box-plot convention: {bp.quartileConvention} · Whiskers: {bp.whiskerConvention}
                  {bp.outliers.length > 0 ? ` · Outliers outside 1.5×IQR fences: ${bp.outliers.join(', ')}` : ''}.
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* MODE 4: SCATTERPLOT & LINEAR REGRESSION */}
      {config.mode === 'scatter-regression' && scatterReg && (() => {
        const pts =
          includeOutlier && config.outlierPoint
            ? [...config.points, config.outlierPoint]
            : config.points;
        const xs = pts.map((p) => p.x);
        const ys = pts.map((p) => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const toX = (x: number) => 42 + ((x - minX) / Math.max(1e-9, maxX - minX)) * 290;
        const toY = (y: number) => 118 - ((y - minY) / Math.max(1e-9, maxY - minY)) * 94;
        return (
          <div className="mt-3 space-y-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-800">{scatterReg.correlationLabel}</span>
              {config.allowOutlierToggle && config.outlierPoint && (
                <button
                  type="button"
                  aria-pressed={includeOutlier}
                  onClick={() => {
                    setIncludeOutlier((v) => !v);
                    setResult(null);
                  }}
                  className={`min-h-[44px] rounded-lg border px-3 py-1 font-bold ${
                    includeOutlier
                      ? 'border-rose-500 bg-rose-50 text-rose-800'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  {includeOutlier ? 'Remove Outlier Point' : 'Add Outlier Point'}
                </button>
              )}
            </div>
            <svg viewBox="0 0 360 144" role="img" aria-label={`Scatterplot of ${config.yLabel} against ${config.xLabel}`} className="h-auto w-full max-w-xl">
              <rect x="4" y="4" width="352" height="136" rx="8" fill="#ffffff" stroke="#cbd5e1" />
              <line x1="42" y1="18" x2="42" y2="118" stroke="#334155" strokeWidth="1.3" />
              <line x1="42" y1="118" x2="338" y2="118" stroke="#334155" strokeWidth="1.3" />
              {!scatterReg.isDegenerate && scatterReg.slope !== null && scatterReg.intercept !== null && (
                <line
                  x1={toX(minX)}
                  y1={toY(scatterReg.slope * minX + scatterReg.intercept)}
                  x2={toX(maxX)}
                  y2={toY(scatterReg.slope * maxX + scatterReg.intercept)}
                  stroke="#dc2626"
                  strokeWidth="1.8"
                  strokeDasharray="4 2"
                />
              )}
              {pts.map((p, idx) => (
                <circle key={idx} cx={toX(p.x)} cy={toY(p.y)} r="4" fill="#2563eb" />
              ))}
              <text x="190" y="135" textAnchor="middle" fontSize="8.5" fill="#475569">
                {config.xLabel} vs {config.yLabel} (Correlation does not imply causation)
              </text>
            </svg>
            {config.predictX !== undefined && (
              <p className="text-[11px] font-medium text-slate-700">
                Prediction target x = {config.predictX}{' '}
                {scatterReg.predict(config.predictX).isExtrapolation
                  ? '(Extrapolation outside observed range — interpret cautiously!)'
                  : '(Interpolation within observed range)'}
              </p>
            )}
          </div>
        );
      })()}

      {/* Learner Answer Form */}
      <div className="mt-3 flex flex-wrap items-end gap-2 text-xs">
        <div className="min-w-[180px] flex-1">
          <label htmlFor={`${config.id}-ans`} className="block font-bold text-slate-700">
            Your Answer (decimal or fraction)
          </label>
          <input
            id={`${config.id}-ans`}
            type="text"
            value={answerText}
            onChange={(e) => {
              setAnswerText(e.target.value);
              setResult(null);
            }}
            placeholder="e.g. 0.25 or 1/4"
            className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <button
          type="button"
          onClick={handleCheck}
          className="min-h-[44px] rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700"
        >
          Check Answer
        </button>
        {config.hints && config.hints.length > 0 && (
          <button
            type="button"
            onClick={() => setShowHints((s) => !s)}
            className="inline-flex min-h-[44px] items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {showHints ? 'Hide hints' : 'Show hints'}
          </button>
        )}
      </div>

      {showHints && config.hints && (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-600">
          {config.hints.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}

      {result && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-3 flex items-start gap-2 rounded-xl border p-3 text-xs font-semibold ${
            result.passed
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
              : 'border-rose-300 bg-rose-50 text-rose-900'
          }`}
        >
          {result.passed ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          )}
          <div>
            <p>{result.feedback}</p>
            {result.passed && config.successExplanation && (
              <p className="mt-1 font-normal text-emerald-800">{config.successExplanation}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
