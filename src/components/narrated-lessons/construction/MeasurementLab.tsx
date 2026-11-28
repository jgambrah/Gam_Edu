'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Gauge,
  HelpCircle,
  RotateCcw,
  Ruler,
  Scale,
  Timer,
  XCircle,
} from 'lucide-react';
import type { MeasurementLabConstructionConfig } from '@/lib/narrated-lessons/interactive-schema';
import {
  computeInstrumentModel,
  evaluateMeasurementSubmission,
  roundClean,
  type MeasurementEvalResult,
} from '@/lib/construction-lab/measurement-engine';

export function MeasurementLab({ config }: { config: MeasurementLabConstructionConfig }) {
  const [sliderValue, setSliderValue] = useState<number>(config.initialAlignmentOffset ?? 0);
  const [eyeOffsetDeg, setEyeOffsetDeg] = useState<number>(config.initialEyeOffsetDeg ?? 0);
  const [tareApplied, setTareApplied] = useState<boolean>(false);
  const [selectedRangeIndex, setSelectedRangeIndex] = useState<number>(config.activeRangeIndex ?? 0);
  const [inspectingZeroError, setInspectingZeroError] = useState<boolean>(false);
  const [recordedTrials, setRecordedTrials] = useState<number[]>([]);
  const [stopwatchStep, setStopwatchStep] = useState<number>(0);

  const [valueText, setValueText] = useState<string>('');
  const [unitText, setUnitText] = useState<string>(config.requireUnit ? '' : config.unit);
  const [uncertaintyText, setUncertaintyText] = useState<string>('');
  const [result, setResult] = useState<MeasurementEvalResult | null>(null);
  const [showHints, setShowHints] = useState<boolean>(false);

  const [predictionChoice, setPredictionChoice] = useState<number | null>(null);
  const [predictionChecked, setPredictionChecked] = useState<boolean>(false);

  const [useNonVisual, setUseNonVisual] = useState<boolean>(false);
  const [nonVisualChoice, setNonVisualChoice] = useState<number | null>(null);
  const [nonVisualChecked, setNonVisualChecked] = useState<boolean>(false);

  const isGuided = config.learningMode !== 'practice';

  const model = useMemo(
    () =>
      computeInstrumentModel(config, {
        sliderValue,
        eyeOffsetDeg,
        tareApplied,
        selectedRangeIndex,
        inspectingZeroError,
        completedTrialCount: recordedTrials.length,
      }),
    [config, sliderValue, eyeOffsetDeg, tareApplied, selectedRangeIndex, inspectingZeroError, recordedTrials.length],
  );

  // Invalidate stale feedback whenever learner alters instrument state or inputs
  const clearStale = () => setResult(null);

  const handleReset = () => {
    setSliderValue(config.initialAlignmentOffset ?? 0);
    setEyeOffsetDeg(config.initialEyeOffsetDeg ?? 0);
    setTareApplied(false);
    setSelectedRangeIndex(config.activeRangeIndex ?? 0);
    setInspectingZeroError(false);
    setRecordedTrials([]);
    setStopwatchStep(0);
    setValueText('');
    setUnitText(config.requireUnit ? '' : config.unit);
    setUncertaintyText('');
    setResult(null);
    setNonVisualChoice(null);
    setNonVisualChecked(false);
  };

  const handleCheck = () => {
    setResult(
      evaluateMeasurementSubmission(
        config,
        { valueText, unitText, uncertaintyText },
        {
          sliderValue,
          eyeOffsetDeg,
          tareApplied,
          selectedRangeIndex,
          inspectingZeroError,
          completedTrialCount: recordedTrials.length,
        },
      ),
    );
  };

  const handleRecordTrial = () => {
    const trials = config.repeatedTrials ?? [config.trueValue];
    if (stopwatchStep >= trials.length) return;
    clearStale();
    setRecordedTrials((prev) => [...prev, trials[stopwatchStep]]);
    setStopwatchStep((s) => s + 1);
  };

  const span = Math.max(1e-9, model.activeMaxRange - config.minValue);
  const clampedPct = Math.max(0, Math.min(100, ((model.observedReading - config.minValue) / span) * 100));
  const physicalPct = Math.max(0, Math.min(100, ((model.physicalReading - config.minValue) / span) * 100));

  // Derive instrument-specific tick counts (never fixed 11-mark placeholder)
  const totalDivs = Math.max(4, Math.round(span / Math.max(1e-9, model.activeScaleDivision)));
  const minorTickCount = Math.min(totalDivs, 60);
  const majorInterval = minorTickCount >= 40 ? 10 : minorTickCount >= 20 ? 5 : 2;

  return (
    <section
      aria-label={config.accessibilityLabel}
      data-interactive-engine="construction-lab"
      data-lab-kind="measurement-lab"
      data-instrument={config.instrument}
      data-interactive-id={config.id}
      className="mt-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm sm:p-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-teal-800">
              {config.instrument === 'balance' ? (
                <Scale className="h-3 w-3" />
              ) : config.instrument === 'stopwatch' ? (
                <Timer className="h-3 w-3" />
              ) : config.instrument === 'ammeter' || config.instrument === 'voltmeter' ? (
                <Gauge className="h-3 w-3" />
              ) : (
                <Ruler className="h-3 w-3" />
              )}
              Virtual {config.instrument.replace('-', ' ')}
            </span>
            {config.subjectTag && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                {config.subjectTag}
              </span>
            )}
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
              Simulated ({isGuided ? 'Guided' : 'Independent practice'})
            </span>
            {config.instrument === 'measuring-cylinder' && config.meniscusType === 'convex' && (
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                Virtual mercury demonstration only
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-sm font-extrabold text-slate-900 sm:text-base">{config.title}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{config.instructions}</p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset measurement instrument"
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

      {/* Non-Visual Equivalent Toggle */}
      {config.nonVisualQuestion && (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2 text-xs">
          <span className="font-semibold text-indigo-900">
            Prefer a non-visual text-only equivalent question?
          </span>
          <button
            type="button"
            onClick={() => setUseNonVisual((v) => !v)}
            className="min-h-[44px] rounded-lg border border-indigo-300 bg-white px-3 py-1 font-bold text-indigo-800 hover:bg-indigo-50"
          >
            {useNonVisual ? 'Switch to visual instrument' : 'Use non-visual question'}
          </button>
        </div>
      )}

      {useNonVisual && config.nonVisualQuestion ? (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
          <p className="font-bold text-slate-900">{config.nonVisualQuestion.prompt}</p>
          <div className="mt-2 space-y-1.5">
            {config.nonVisualQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                aria-pressed={nonVisualChoice === idx}
                onClick={() => {
                  setNonVisualChoice(idx);
                  setNonVisualChecked(true);
                }}
                className={`flex min-h-[44px] w-full items-center rounded-lg border px-3 py-2 text-left font-semibold ${
                  nonVisualChoice === idx
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950'
                    : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          {nonVisualChecked && (
            <div role="status" aria-live="polite" className="mt-2.5 font-semibold text-slate-800">
              {nonVisualChoice === config.nonVisualQuestion.correctIndex
                ? 'Correct! '
                : 'Not quite — review the scale resolution and zero-error rule. '}
              {config.nonVisualQuestion.explanation ?? ''}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Interactive Graduated SVG Instrument Stage */}
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-600">
              <span>
                Range: {config.minValue}–{model.activeMaxRange} {config.unit} · Least count: {model.leastCount} {config.unit}
              </span>
              {config.objectLabel && (
                <span className="rounded bg-white px-2 py-0.5 text-slate-700 shadow-sm">
                  Sample: {config.objectLabel}
                </span>
              )}
            </div>

            {model.overRange && (
              <div
                role="alert"
                className="mb-2 flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-800"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                OVER-RANGE: Needle pinned past {model.activeMaxRange} {config.unit}. Select a higher scale range!
              </div>
            )}

            {config.displayMode === 'digital' ? (
              <div className="mx-auto flex max-w-xs flex-col items-center rounded-xl border-2 border-slate-700 bg-slate-900 px-5 py-4 text-center font-mono text-emerald-400">
                <span className="text-[10px] uppercase tracking-widest text-slate-400">
                  Digital {config.instrument}
                </span>
                <span className="mt-1 text-3xl font-extrabold" data-testid="digital-readout">
                  {model.overRange
                    ? 'OL (OVER)'
                    : `${model.quantisedReading.toFixed(
                        Math.max(0, Math.min(3, Math.ceil(-Math.log10(model.leastCount + 1e-12)))),
                      )} ${config.unit}`}
                </span>
              </div>
            ) : (
              <svg
                viewBox="0 0 360 150"
                role="img"
                aria-label={`Interactive graduated ${config.instrument} scale`}
                data-observed-model={String(model.observedReading)}
                className="h-auto w-full max-w-xl motion-reduce:transition-none"
              >
                <rect x="4" y="4" width="352" height="142" rx="10" fill="#ffffff" stroke="#cbd5e1" />

                {/* 1. RULER (actual instrument graduations + movable object alignment) */}
                {config.instrument === 'ruler' && (
                  <g data-testid="svg-ruler">
                    <rect
                      x={24 + (sliderValue / span) * 312}
                      y="24"
                      width={Math.max(4, ((model.physicalReading - config.minValue - sliderValue) / span) * 312)}
                      height="24"
                      rx="3"
                      fill="#2563eb"
                      opacity="0.85"
                    />
                    <rect x="24" y="54" width="312" height="36" rx="3" fill="#fef9c3" stroke="#ca8a04" />
                    {Array.from({ length: minorTickCount + 1 }).map((_, idx) => {
                      const x = 24 + (idx / minorTickCount) * 312;
                      const isMajor = idx % majorInterval === 0;
                      const val = roundClean(config.minValue + (idx / minorTickCount) * span, 2);
                      return (
                        <g key={idx}>
                          <line
                            x1={x}
                            y1="54"
                            x2={x}
                            y2={isMajor ? '74' : '64'}
                            stroke="#0f172a"
                            strokeWidth={isMajor ? '1.5' : '0.8'}
                          />
                          {isMajor && (
                            <text x={x} y="86" textAnchor="middle" fontSize="8" fill="#0f172a">
                              {val}
                            </text>
                          )}
                        </g>
                      );
                    })}
                    <text x="180" y="114" textAnchor="middle" fontSize="9.5" fill="#475569">
                      Ruler Scale ({config.unit}){config.enableParallax ? ` · Simplified parallax eye: ${eyeOffsetDeg}°` : ''}
                    </text>
                  </g>
                )}

                {/* 2. THERMOMETER (bulb + graduated vertical/horizontal stem) */}
                {config.instrument === 'thermometer' && (
                  <g data-testid="svg-thermometer">
                    <circle cx="34" cy="64" r="14" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
                    <rect x="46" y="56" width="290" height="16" rx="8" fill="#f1f5f9" stroke="#64748b" />
                    <rect
                      x="46"
                      y="59"
                      width={Math.max(4, (clampedPct / 100) * 284)}
                      height="10"
                      rx="4"
                      fill="#ef4444"
                    />
                    {Array.from({ length: minorTickCount + 1 }).map((_, idx) => {
                      const x = 46 + (idx / minorTickCount) * 284;
                      const isMajor = idx % majorInterval === 0;
                      const val = roundClean(config.minValue + (idx / minorTickCount) * span, 1);
                      return (
                        <g key={idx}>
                          <line
                            x1={x}
                            y1="74"
                            x2={x}
                            y2={isMajor ? '88' : '81'}
                            stroke="#0f172a"
                            strokeWidth={isMajor ? '1.3' : '0.7'}
                          />
                          {isMajor && (
                            <text x={x} y="100" textAnchor="middle" fontSize="8" fill="#0f172a">
                              {val}
                            </text>
                          )}
                        </g>
                      );
                    })}
                    <text x="180" y="124" textAnchor="middle" fontSize="9.5" fill="#475569">
                      Liquid-in-Glass Thermometer ({config.unit})
                    </text>
                  </g>
                )}

                {/* 3. VERNIER CALLIPERS (actual main-scale & vernier-scale graduations, positioned vernier zero & coinciding mark) */}
                {config.instrument === 'vernier-callipers' && model.vernier && (() => {
                  const mStep = config.mainScaleStep ?? 1;
                  const vDivs = config.vernierDivisions ?? 10;
                  const windowStart = Math.floor(model.vernier.vernierZeroPos) - 3;
                  const pxPerUnit = 18;
                  const toX = (u: number) => 40 + (u - windowStart) * pxPerUnit;
                  const vernierZeroX = toX(model.vernier.vernierZeroPos);
                  const vernierStep = mStep * (1 - 1 / vDivs); // e.g. 0.9 mm per vernier division
                  return (
                    <g data-testid="svg-vernier" data-vernier-zero-x={vernierZeroX.toFixed(2)} data-aligned-div={model.vernier.alignedDivision}>
                      {/* Main scale */}
                      <rect x="18" y="20" width="324" height="34" rx="2" fill="#e2e8f0" stroke="#475569" />
                      {Array.from({ length: 18 }).map((_, i) => {
                        const u = windowStart + i * mStep;
                        const x = toX(u);
                        if (x < 22 || x > 338) return null;
                        const isMajor = u % 5 === 0;
                        return (
                          <g key={i}>
                            <line
                              x1={x}
                              y1={isMajor ? '34' : '42'}
                              x2={x}
                              y2="54"
                              stroke="#0f172a"
                              strokeWidth={isMajor ? '1.4' : '0.9'}
                            />
                            {isMajor && (
                              <text x={x} y="31" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#0f172a">
                                {u}
                              </text>
                            )}
                          </g>
                        );
                      })}
                      {/* Vernier sliding scale */}
                      <rect x={Math.max(18, vernierZeroX - 8)} y="55" width={vDivs * vernierStep * pxPerUnit + 16} height="34" rx="2" fill="#dbeafe" stroke="#1d4ed8" />
                      {Array.from({ length: vDivs + 1 }).map((_, j) => {
                        const vx = vernierZeroX + j * vernierStep * pxPerUnit;
                        if (vx < 20 || vx > 340) return null;
                        const isCoinciding = j === model.vernier!.alignedDivision;
                        return (
                          <g key={j}>
                            <line
                              x1={vx}
                              y1="55"
                              x2={vx}
                              y2={j % 5 === 0 ? '74' : '67'}
                              stroke={isCoinciding && isGuided ? '#dc2626' : '#1e3a8a'}
                              strokeWidth={isCoinciding && isGuided ? '1.8' : '1'}
                            />
                            {(j === 0 || j === vDivs || j === 5) && (
                              <text x={vx} y="84" textAnchor="middle" fontSize="7.5" fill="#1e3a8a">
                                {j}
                              </text>
                            )}
                          </g>
                        );
                      })}
                      <text x="180" y="112" textAnchor="middle" fontSize="9.5" fill="#334155">
                        {inspectingZeroError
                          ? 'Jaws closed — inspect vernier 0 relative to main 0'
                          : isGuided
                            ? `Guided view: Main = ${model.vernier.mainScaleReading} ${config.unit}, coinciding vernier mark = ${model.vernier.alignedDivision} (LC ${model.vernier.leastCount})`
                            : `Read main scale before vernier 0 + coinciding vernier division (LC = ${model.vernier.leastCount} ${config.unit})`}
                      </text>
                    </g>
                  );
                })()}

                {/* 4. MICROMETER SCREW GAUGE (graduated sleeve with whole & 0.5 mm marks + graduated rotating thimble) */}
                {config.instrument === 'micrometer' && model.micrometer && (() => {
                  const tDivs = config.thimbleDivisions ?? 50;
                  const pitch = config.pitchMm ?? 0.5;
                  const sleeveStart = Math.max(0, model.micrometer.sleeveWholeMm - 4);
                  const thimbleEdgeX = 200;
                  const pxPerMm = 26;
                  return (
                    <g data-testid="svg-micrometer" data-thimble-div={model.micrometer.thimbleDivision}>
                      {/* Sleeve */}
                      <rect x="24" y="34" width={thimbleEdgeX - 24} height="56" rx="3" fill="#e2e8f0" stroke="#334155" />
                      <line x1="24" y1="62" x2={thimbleEdgeX} y2="62" stroke="#0f172a" strokeWidth="1.5" />
                      {Array.from({ length: 7 }).map((_, i) => {
                        const mm = sleeveStart + i;
                        const x = 36 + i * pxPerMm;
                        if (x > thimbleEdgeX - 4) return null;
                        const halfX = x + pxPerMm * 0.5;
                        return (
                          <g key={i}>
                            <line x1={x} y1="42" x2={x} y2="62" stroke="#0f172a" strokeWidth="1.3" />
                            <text x={x} y="39" textAnchor="middle" fontSize="8" fill="#0f172a">
                              {mm}
                            </text>
                            {(config.hasHalfMmSleeve ?? pitch === 0.5) && halfX <= thimbleEdgeX - 2 && (
                              <line x1={halfX} y1="62" x2={halfX} y2="76" stroke="#0f172a" strokeWidth="1.1" />
                            )}
                          </g>
                        );
                      })}
                      {/* Graduated rotating thimble */}
                      <rect x={thimbleEdgeX} y="20" width="124" height="84" rx="5" fill="#fef3c7" stroke="#b45309" />
                      {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
                        const mark = ((model.micrometer!.thimbleDivision + offset) % tDivs + tDivs) % tDivs;
                        const y = 62 - offset * 10;
                        const isMajor = mark % 5 === 0;
                        return (
                          <g key={offset}>
                            <line
                              x1={thimbleEdgeX}
                              y1={y}
                              x2={thimbleEdgeX + (isMajor ? 22 : 12)}
                              y2={y}
                              stroke={offset === 0 ? '#dc2626' : '#78350f'}
                              strokeWidth={offset === 0 ? '1.8' : '1'}
                            />
                            {(isMajor || offset === 0) && (
                              <text x={thimbleEdgeX + 28} y={y + 3} fontSize="8.5" fontWeight={offset === 0 ? 'bold' : 'normal'} fill="#78350f">
                                {mark}
                              </text>
                            )}
                          </g>
                        );
                      })}
                      <text x="180" y="124" textAnchor="middle" fontSize="9.5" fill="#334155">
                        {inspectingZeroError
                          ? `Anvil closed — datum aligns with thimble mark ${model.micrometer.thimbleDivision}`
                          : isGuided
                            ? `Guided view: Sleeve = ${model.micrometer.sleeveReadingMm} mm${model.micrometer.hasHalfMmVisible ? ' (0.5 mm visible)' : ''} · Thimble = ${model.micrometer.thimbleDivision}`
                            : `Read sleeve (pitch ${pitch} mm) + thimble mark at datum line (LC = ${model.micrometer.leastCountMm} mm)`}
                      </text>
                    </g>
                  );
                })()}

                {/* 5. MEASURING CYLINDER (graduated ticks, physical meniscus distinct from apparent parallax line) */}
                {config.instrument === 'measuring-cylinder' && (() => {
                  const physY = 122 - (physicalPct / 100) * 96;
                  const appY = 122 - (clampedPct / 100) * 96;
                  const curve =
                    config.meniscusType === 'convex'
                      ? `M 136 ${physY + 6} Q 180 ${physY - 6} 224 ${physY + 6}`
                      : config.meniscusType === 'flat'
                        ? `M 136 ${physY} L 224 ${physY}`
                        : `M 136 ${physY - 6} Q 180 ${physY + 6} 224 ${physY - 6}`;
                  const cylTicks = Math.min(totalDivs, 40);
                  const cylMajor = cylTicks >= 20 ? 5 : 2;
                  return (
                    <g data-testid="svg-cylinder" data-phys-y={physY.toFixed(2)} data-app-y={appY.toFixed(2)}>
                      <rect x="135" y="18" width="90" height="106" rx="3" fill="#f8fafc" stroke="#475569" strokeWidth="1.6" />
                      <path
                        d={`${curve} L 224 123 L 136 123 Z`}
                        fill={config.meniscusType === 'convex' ? '#94a3b8' : '#38bdf8'}
                        opacity="0.65"
                      />
                      <path d={curve} fill="none" stroke="#0369a1" strokeWidth="2" />
                      {Array.from({ length: cylTicks + 1 }).map((_, idx) => {
                        const y = 122 - (idx / cylTicks) * 96;
                        const isMajor = idx % cylMajor === 0;
                        const val = roundClean(config.minValue + (idx / cylTicks) * span, 1);
                        return (
                          <g key={idx}>
                            <line
                              x1="135"
                              y1={y}
                              x2={isMajor ? '151' : '144'}
                              y2={y}
                              stroke="#0f172a"
                              strokeWidth={isMajor ? '1.2' : '0.7'}
                            />
                            {isMajor && (
                              <text x="129" y={y + 3} textAnchor="end" fontSize="7.5" fill="#0f172a">
                                {val}
                              </text>
                            )}
                          </g>
                        );
                      })}
                      {/* Apparent eye-line vs physical level */}
                      <line x1="226" y1={appY} x2="274" y2={physY - eyeOffsetDeg * 0.7} stroke="#dc2626" strokeDasharray="3 2" />
                      <text x="296" y="42" textAnchor="middle" fontSize="8.5" fontWeight="bold" fill="#0f172a">
                        {config.liquidName ?? 'Liquid'}
                      </text>
                      <text x="296" y="56" textAnchor="middle" fontSize="8" fill="#475569">
                        Meniscus: {config.meniscusType ?? 'concave'}
                      </text>
                      <text x="296" y="72" textAnchor="middle" fontSize="8" fill="#dc2626">
                        Eye: {eyeOffsetDeg > 0 ? `+${eyeOffsetDeg}°` : `${eyeOffsetDeg}°`}
                      </text>
                      <text x="296" y="86" textAnchor="middle" fontSize="7.5" fill="#64748b">
                        (Simplified parallax model)
                      </text>
                    </g>
                  );
                })()}

                {/* 6. ANALOGUE AMMETER & VOLTMETER (actual intermediate arc graduations + needle angle) */}
                {(config.instrument === 'ammeter' || config.instrument === 'voltmeter') && (() => {
                  const needlePct = model.overRange ? 104 : clampedPct;
                  const angleRad = Math.PI - (needlePct / 100) * Math.PI;
                  const nx = 180 + Math.cos(angleRad) * 82;
                  const ny = 114 - Math.sin(angleRad) * 82;
                  const arcTicks = Math.min(totalDivs, 30);
                  const arcMajor = arcTicks >= 20 ? 5 : 2;
                  return (
                    <g data-testid="svg-meter" data-needle-deg={((angleRad * 180) / Math.PI).toFixed(1)}>
                      <path d="M 74 114 A 106 94 0 0 1 286 114" fill="none" stroke="#334155" strokeWidth="1.8" />
                      {Array.from({ length: arcTicks + 1 }).map((_, idx) => {
                        const a = Math.PI - (idx / arcTicks) * Math.PI;
                        const isMajor = idx % arcMajor === 0;
                        const rOuter = 106;
                        const rInner = isMajor ? 92 : 98;
                        const x1 = 180 + Math.cos(a) * rOuter;
                        const y1 = 114 - Math.sin(a) * rOuter;
                        const x2 = 180 + Math.cos(a) * rInner;
                        const y2 = 114 - Math.sin(a) * rInner;
                        const lx = 180 + Math.cos(a) * 78;
                        const ly = 114 - Math.sin(a) * 78;
                        const val = roundClean(config.minValue + (idx / arcTicks) * span, 2);
                        return (
                          <g key={idx}>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0f172a" strokeWidth={isMajor ? '1.4' : '0.8'} />
                            {isMajor && (
                              <text x={lx} y={ly + 3} textAnchor="middle" fontSize="7.5" fill="#334155">
                                {val}
                              </text>
                            )}
                          </g>
                        );
                      })}
                      <line x1="180" y1="114" x2={nx} y2={ny} stroke="#dc2626" strokeWidth="2.4" />
                      <circle cx="180" cy="114" r="5" fill="#0f172a" />
                      <text x="180" y="96" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a">
                        {config.instrument === 'ammeter' ? 'A' : 'V'}
                      </text>
                    </g>
                  );
                })()}

                {/* 7. ANALOGUE BALANCE & STOPWATCH */}
                {(config.instrument === 'balance' || config.instrument === 'stopwatch') && (() => {
                  const angleRad = -Math.PI / 2 + (clampedPct / 100) * Math.PI * 1.8;
                  const nx = 180 + Math.cos(angleRad) * 44;
                  const ny = 74 + Math.sin(angleRad) * 44;
                  return (
                    <g data-testid={`svg-${config.instrument}`}>
                      <circle cx="180" cy="74" r="52" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
                      {Array.from({ length: 12 }).map((_, idx) => {
                        const a = -Math.PI / 2 + (idx / 12) * Math.PI * 2;
                        const x1 = 180 + Math.cos(a) * 52;
                        const y1 = 74 + Math.sin(a) * 52;
                        const x2 = 180 + Math.cos(a) * 44;
                        const y2 = 74 + Math.sin(a) * 44;
                        return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0f172a" strokeWidth="1.3" />;
                      })}
                      <line x1="180" y1="74" x2={nx} y2={ny} stroke="#dc2626" strokeWidth="2.2" />
                      <circle cx="180" cy="74" r="4" fill="#0f172a" />
                      <text x="180" y="138" textAnchor="middle" fontSize="9.5" fill="#475569">
                        {config.instrument === 'balance' ? 'Analogue Mass Balance (g/kg, not weight N)' : 'Analogue Stopwatch (s)'}
                      </text>
                    </g>
                  );
                })()}
              </svg>
            )}

            {/* Instrument Interactive Manipulation Controls */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {config.initialAlignmentOffset !== undefined && (
                <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
                  <span className="font-bold text-slate-700">Align offset ({sliderValue} {config.unit}):</span>
                  <button
                    type="button"
                    onClick={() => {
                      clearStale();
                      setSliderValue((v) => roundClean(v - model.activeScaleDivision, 4));
                    }}
                    className="min-h-[44px] rounded border border-slate-300 px-2 font-bold"
                  >
                    −Step
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearStale();
                      setSliderValue(0);
                    }}
                    className="min-h-[44px] rounded bg-slate-100 px-2 font-bold text-slate-800 hover:bg-slate-200"
                  >
                    Align to 0
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearStale();
                      setSliderValue((v) => roundClean(v + model.activeScaleDivision, 4));
                    }}
                    className="min-h-[44px] rounded border border-slate-300 px-2 font-bold"
                  >
                    +Step
                  </button>
                </div>
              )}

              {(config.zeroError ?? 0) !== 0 && (
                <button
                  type="button"
                  aria-pressed={inspectingZeroError}
                  onClick={() => {
                    clearStale();
                    setInspectingZeroError((v) => !v);
                  }}
                  className={`min-h-[44px] rounded-lg border px-3 py-1.5 font-bold ${
                    inspectingZeroError
                      ? 'border-amber-600 bg-amber-100 text-amber-950'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {inspectingZeroError ? 'Measure object' : 'Check Zero Error (close jaws)'}
                </button>
              )}

              {config.instrument === 'balance' && (config.initialTareOffset ?? 0) !== 0 && (
                <button
                  type="button"
                  aria-pressed={tareApplied}
                  onClick={() => {
                    clearStale();
                    setTareApplied((v) => !v);
                  }}
                  className={`min-h-[44px] rounded-lg border px-3 py-1.5 font-bold ${
                    tareApplied
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tareApplied ? 'Tare Applied (0.0)' : 'Press Tare / Zero'}
                </button>
              )}

              {config.scaleRanges && config.scaleRanges.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold text-slate-700">Scale range:</span>
                  {config.scaleRanges.map((r, idx) => (
                    <button
                      key={r}
                      type="button"
                      aria-pressed={selectedRangeIndex === idx}
                      onClick={() => {
                        clearStale();
                        setSelectedRangeIndex(idx);
                      }}
                      className={`min-h-[44px] rounded-lg border px-2.5 py-1 font-bold ${
                        selectedRangeIndex === idx
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950'
                          : 'border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      0–{r} {config.unit}
                    </button>
                  ))}
                </div>
              )}

              {config.enableParallax && (
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  <label htmlFor={`${config.id}-eye`} className="font-bold text-slate-700">
                    Eye level ({eyeOffsetDeg}°):
                  </label>
                  <button
                    type="button"
                    aria-label="Lower eye position by 5 degrees"
                    onClick={() => {
                      clearStale();
                      setEyeOffsetDeg((d) => Math.max(-30, d - 5));
                    }}
                    className="min-h-[44px] rounded border border-slate-300 px-2 font-bold"
                  >
                    −5°
                  </button>
                  <input
                    id={`${config.id}-eye`}
                    type="range"
                    min={-30}
                    max={30}
                    step={5}
                    value={eyeOffsetDeg}
                    onChange={(e) => {
                      clearStale();
                      setEyeOffsetDeg(Number(e.target.value));
                    }}
                    className="w-24"
                  />
                  <button
                    type="button"
                    aria-label="Raise eye position by 5 degrees"
                    onClick={() => {
                      clearStale();
                      setEyeOffsetDeg((d) => Math.min(30, d + 5));
                    }}
                    className="min-h-[44px] rounded border border-slate-300 px-2 font-bold"
                  >
                    +5°
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      clearStale();
                      setEyeOffsetDeg(0);
                    }}
                    className="min-h-[44px] rounded bg-slate-100 px-2 font-bold text-slate-800 hover:bg-slate-200"
                  >
                    Level (0°)
                  </button>
                </div>
              )}

              {config.repeatedTrials && config.repeatedTrials.length >= 2 && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={stopwatchStep >= config.repeatedTrials.length}
                    onClick={handleRecordTrial}
                    className="min-h-[44px] rounded-lg bg-teal-700 px-3 py-1.5 font-bold text-white hover:bg-teal-800 disabled:opacity-40"
                  >
                    Record Trial {Math.min(stopwatchStep + 1, config.repeatedTrials.length)}/{config.repeatedTrials.length}
                  </button>
                  {recordedTrials.length > 0 && (
                    <span className="font-mono text-slate-700">
                      Trials: {recordedTrials.map((t) => `${t} ${config.unit}`).join(', ')}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Learner Recording Form */}
          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
            <div>
              <label htmlFor={`${config.id}-val`} className="block font-bold text-slate-700">
                {config.repeatedTrials ? 'Mean Measurement' : 'Corrected Reading'}
              </label>
              <input
                id={`${config.id}-val`}
                type="text"
                inputMode="decimal"
                value={valueText}
                onChange={(e) => {
                  clearStale();
                  setValueText(e.target.value);
                }}
                placeholder="e.g. 12.4"
                className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            <div>
              <label htmlFor={`${config.id}-unit`} className="block font-bold text-slate-700">
                Unit {config.requireUnit ? '(required)' : ''}
              </label>
              <input
                id={`${config.id}-unit`}
                type="text"
                value={unitText}
                onChange={(e) => {
                  clearStale();
                  setUnitText(e.target.value);
                }}
                placeholder={config.unit}
                className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
            {config.requireUncertainty && (
              <div>
                <label htmlFor={`${config.id}-unc`} className="block font-bold text-slate-700">
                  Uncertainty (± {config.unit})
                </label>
                <input
                  id={`${config.id}-unc`}
                  type="text"
                  inputMode="decimal"
                  value={uncertaintyText}
                  onChange={(e) => {
                    clearStale();
                    setUncertaintyText(e.target.value);
                  }}
                  placeholder="e.g. 0.05"
                  className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCheck}
              className="min-h-[44px] rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
            >
              Check Measurement
            </button>
            {config.hints && config.hints.length > 0 && isGuided && (
              <button
                type="button"
                onClick={() => setShowHints((s) => !s)}
                className="inline-flex min-h-[44px] items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                {showHints ? 'Hide hints' : 'Show hints'}
              </button>
            )}
          </div>

          {showHints && config.hints && isGuided && (
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
        </>
      )}
    </section>
  );
}
