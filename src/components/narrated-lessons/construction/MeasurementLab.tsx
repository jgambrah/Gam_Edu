'use client';

import React, { useMemo, useState } from 'react';
import {
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

  const model = useMemo(
    () =>
      computeInstrumentModel(config, {
        eyeOffsetDeg,
        tareApplied,
        selectedRangeIndex,
        inspectingZeroError,
      }),
    [config, eyeOffsetDeg, tareApplied, selectedRangeIndex, inspectingZeroError],
  );

  const handleReset = () => {
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
        { eyeOffsetDeg, tareApplied, selectedRangeIndex, inspectingZeroError },
      ),
    );
  };

  const handleRecordTrial = () => {
    const trials = config.repeatedTrials ?? [config.trueValue];
    if (stopwatchStep >= trials.length) return;
    setRecordedTrials((prev) => [...prev, trials[stopwatchStep]]);
    setStopwatchStep((s) => s + 1);
  };

  const pct = Math.max(
    0,
    Math.min(
      100,
      ((model.observedReading - config.minValue) /
        Math.max(1e-9, model.activeMaxRange - config.minValue)) *
        100,
    ),
  );

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
              Simulated instrument ({config.learningMode === 'practice' ? 'Independent practice' : 'Guided'})
            </span>
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

      {/* Accessible Non-Visual Equivalent Assessment Toggle */}
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
          {/* Interactive SVG Instrument Stage (does NOT reveal expected answer in aria-label) */}
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

            {config.displayMode === 'digital' ? (
              <div className="mx-auto flex max-w-xs flex-col items-center rounded-xl border-2 border-slate-700 bg-slate-900 px-5 py-4 text-center font-mono text-emerald-400">
                <span className="text-[10px] uppercase tracking-widest text-slate-400">
                  Digital {config.instrument}
                </span>
                <span className="mt-1 text-3xl font-extrabold" data-testid="digital-readout">
                  {model.observedReading.toFixed(
                    Math.max(0, Math.min(3, Math.ceil(-Math.log10(model.leastCount + 1e-12)))),
                  )}{' '}
                  {config.unit}
                </span>
              </div>
            ) : (
              <svg
                viewBox="0 0 360 130"
                role="img"
                aria-label={`Interactive ${config.instrument} scale diagram`}
                className="h-auto w-full max-w-xl motion-reduce:transition-none"
              >
                <rect x="4" y="4" width="352" height="122" rx="10" fill="#ffffff" stroke="#cbd5e1" />

                {/* RULER / THERMOMETER / LINEAR SCALE */}
                {(config.instrument === 'ruler' ||
                  config.instrument === 'thermometer' ||
                  config.instrument === 'balance' ||
                  config.instrument === 'stopwatch') && (
                  <g>
                    <rect x="24" y="54" width="312" height="28" rx="4" fill="#fef9c3" stroke="#ca8a04" />
                    <rect
                      x="24"
                      y="26"
                      width={Math.max(4, (pct / 100) * 312)}
                      height="20"
                      rx="3"
                      fill={config.instrument === 'thermometer' ? '#ef4444' : '#3b82f6'}
                      opacity="0.85"
                    />
                    {Array.from({ length: 11 }).map((_, idx) => {
                      const x = 24 + idx * 31.2;
                      const lbl = roundClean(
                        config.minValue + (idx / 10) * (model.activeMaxRange - config.minValue),
                        2,
                      );
                      return (
                        <g key={idx}>
                          <line x1={x} y1="54" x2={x} y2="70" stroke="#0f172a" strokeWidth="1.5" />
                          <text x={x} y="96" textAnchor="middle" fontSize="9" fill="#334155">
                            {lbl}
                          </text>
                        </g>
                      );
                    })}
                    <text x="180" y="116" textAnchor="middle" fontSize="10" fill="#475569">
                      Scale ({config.unit}){inspectingZeroError ? ' — Closed / Zero Check' : ''}
                    </text>
                  </g>
                )}

                {/* VERNIER CALLIPERS */}
                {config.instrument === 'vernier-callipers' && model.vernier && (
                  <g>
                    <rect x="20" y="24" width="320" height="32" rx="3" fill="#e2e8f0" stroke="#475569" />
                    {Array.from({ length: 11 }).map((_, idx) => {
                      const x = 30 + idx * 28;
                      return (
                        <g key={idx}>
                          <line x1={x} y1="38" x2={x} y2="56" stroke="#0f172a" strokeWidth="1.4" />
                          <text x={x} y="34" textAnchor="middle" fontSize="9" fill="#0f172a">
                            {roundClean(model.vernier!.mainScaleReading + (idx - 2) * (config.mainScaleStep ?? 1), 1)}
                          </text>
                        </g>
                      );
                    })}
                    <rect x="86" y="58" width="170" height="30" rx="3" fill="#dbeafe" stroke="#1d4ed8" />
                    <text x="171" y="76" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e3a8a">
                      Main: {model.vernier.mainScaleReading} {config.unit} · Aligned div: {model.vernier.alignedDivision}
                    </text>
                    <text x="180" y="112" textAnchor="middle" fontSize="10" fill="#475569">
                      {inspectingZeroError
                        ? `Jaws closed — Zero error: ${model.zeroError >= 0 ? '+' : ''}${model.zeroError} ${config.unit}`
                        : `Vernier LC = ${model.vernier.leastCount} ${config.unit}`}
                    </text>
                  </g>
                )}

                {/* MICROMETER SCREW GAUGE */}
                {config.instrument === 'micrometer' && model.micrometer && (
                  <g>
                    <rect x="24" y="34" width="165" height="44" rx="4" fill="#e2e8f0" stroke="#334155" />
                    <line x1="24" y1="56" x2="189" y2="56" stroke="#0f172a" strokeWidth="1.5" />
                    <text x="106" y="28" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">
                      Sleeve: {model.micrometer.sleeveReadingMm} mm {model.micrometer.hasHalfMmVisible ? '(+0.5 visible)' : ''}
                    </text>
                    <rect x="189" y="22" width="130" height="68" rx="6" fill="#fef3c7" stroke="#b45309" />
                    <line x1="189" y1="56" x2="215" y2="56" stroke="#b45309" strokeWidth="2" />
                    <text x="256" y="60" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#78350f">
                      Thimble: {model.micrometer.thimbleDivision}
                    </text>
                    <text x="180" y="112" textAnchor="middle" fontSize="10" fill="#475569">
                      {inspectingZeroError
                        ? `Anvil closed — Zero error: ${model.zeroError >= 0 ? '+' : ''}${model.zeroError} mm`
                        : `Pitch = ${config.pitchMm ?? 0.5} mm · LC = ${model.micrometer.leastCountMm} mm`}
                    </text>
                  </g>
                )}

                {/* MEASURING CYLINDER WITH CONCAVE/CONVEX MENISCUS */}
                {config.instrument === 'measuring-cylinder' && (
                  <g>
                    <rect x="135" y="16" width="90" height="96" rx="4" fill="#f8fafc" stroke="#475569" strokeWidth="1.8" />
                    {(() => {
                      const liquidTop = 104 - (pct / 100) * 76;
                      const curve =
                        config.meniscusType === 'convex'
                          ? `M 136 ${liquidTop + 5} Q 180 ${liquidTop - 6} 224 ${liquidTop + 5}`
                          : config.meniscusType === 'flat'
                            ? `M 136 ${liquidTop} L 224 ${liquidTop}`
                            : `M 136 ${liquidTop - 5} Q 180 ${liquidTop + 6} 224 ${liquidTop - 5}`;
                      return (
                        <>
                          <path
                            d={`${curve} L 224 111 L 136 111 Z`}
                            fill={config.meniscusType === 'convex' ? '#94a3b8' : '#38bdf8'}
                            opacity="0.7"
                          />
                          <path d={curve} fill="none" stroke="#0369a1" strokeWidth="2" />
                          <line x1="230" y1={liquidTop} x2="270" y2={liquidTop - eyeOffsetDeg * 0.6} stroke="#dc2626" strokeDasharray="3 2" />
                        </>
                      );
                    })()}
                    <text x="72" y="58" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">
                      {config.liquidName ?? 'Liquid'}
                    </text>
                    <text x="72" y="72" textAnchor="middle" fontSize="9" fill="#475569">
                      Meniscus: {config.meniscusType ?? 'concave'}
                    </text>
                    <text x="298" y="64" textAnchor="middle" fontSize="9" fill="#475569">
                      Eye: {eyeOffsetDeg > 0 ? `+${eyeOffsetDeg}° (high)` : eyeOffsetDeg < 0 ? `${eyeOffsetDeg}° (low)` : '0° (level)'}
                    </text>
                  </g>
                )}

                {/* ANALOGUE AMMETER / VOLTMETER */}
                {(config.instrument === 'ammeter' || config.instrument === 'voltmeter') && (
                  <g>
                    <path d="M 70 102 A 110 86 0 0 1 290 102" fill="none" stroke="#334155" strokeWidth="2" />
                    {(() => {
                      const angleRad = Math.PI - (pct / 100) * Math.PI;
                      const nx = 180 + Math.cos(angleRad) * 76;
                      const ny = 102 - Math.sin(angleRad) * 76;
                      return <line x1="180" y1="102" x2={nx} y2={ny} stroke="#dc2626" strokeWidth="2.5" />;
                    })()}
                    <circle cx="180" cy="102" r="5" fill="#0f172a" />
                    <text x="180" y="74" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                      {config.instrument === 'ammeter' ? 'A' : 'V'}
                    </text>
                    <text x="70" y="116" textAnchor="middle" fontSize="9" fill="#334155">
                      {config.minValue}
                    </text>
                    <text x="290" y="116" textAnchor="middle" fontSize="9" fill="#334155">
                      {model.activeMaxRange} {config.unit}
                    </text>
                  </g>
                )}
              </svg>
            )}

            {/* Instrument Interactive Controls */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              {(config.zeroError ?? 0) !== 0 && (
                <button
                  type="button"
                  aria-pressed={inspectingZeroError}
                  onClick={() => setInspectingZeroError((v) => !v)}
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
                  onClick={() => setTareApplied((v) => !v)}
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
                      onClick={() => setSelectedRangeIndex(idx)}
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
                    onClick={() => setEyeOffsetDeg((d) => Math.max(-30, d - 5))}
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
                    onChange={(e) => setEyeOffsetDeg(Number(e.target.value))}
                    className="w-24"
                  />
                  <button
                    type="button"
                    aria-label="Raise eye position by 5 degrees"
                    onClick={() => setEyeOffsetDeg((d) => Math.min(30, d + 5))}
                    className="min-h-[44px] rounded border border-slate-300 px-2 font-bold"
                  >
                    +5°
                  </button>
                  <button
                    type="button"
                    onClick={() => setEyeOffsetDeg(0)}
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
                    className="min-h-[44px] rounded-lg bg-teal-600 px-3 py-1.5 font-bold text-white hover:bg-teal-700 disabled:opacity-40"
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
                onChange={(e) => setValueText(e.target.value)}
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
                onChange={(e) => setUnitText(e.target.value)}
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
                  onChange={(e) => setUncertaintyText(e.target.value)}
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
            {config.hints && config.hints.length > 0 && (
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
        </>
      )}
    </section>
  );
}
