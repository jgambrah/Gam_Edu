'use client';

import React, { useState } from 'react';
import type { NumberManipulativeConstructionConfig } from '@/lib/narrated-lessons/interactive-schema';
import {
  GHANA_DENOM_BY_ID,
  NUMBER_MANIPULATIVE_LIMITS,
  computeClockHandAngles,
  evaluateAnalogueClock,
  evaluateArraysGrouping,
  evaluateBaseTen,
  evaluateBaseTenValue,
  evaluateFractionsDecimals,
  evaluateGhanaMoney,
  evaluateNumberBond,
  evaluateNumberLine,
  evaluatePattern,
  evaluateTenFrame,
  formatGhanaPesewas,
  formatTime12h,
  formatTime24h,
  regroupBaseTen,
  sumGhanaCountsPesewas,
  type BaseTenState,
} from '@/lib/construction-lab/number-manipulative-engine';
import { ConstructionLabShell } from './ConstructionLabShell';

type Feedback = { passed: boolean; message: string } | null;

const PRIMARY_BTN =
  'min-h-[48px] min-w-[48px] rounded-xl px-3.5 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600';

/* ========================================================================== */
/* 1. COUNTING & TEN FRAMES (1:1, SINGLE & DOUBLE TEN FRAMES, MAKE-10)        */
/* ========================================================================== */

function TenFrameWorkbench({ config }: { config: Extract<NumberManipulativeConstructionConfig, { mode: 'counting-ten-frame' }> }) {
  const cap = config.frameCount * 10;
  const initCells = () =>
    Array.from({ length: cap }, (_, i) => (i < (config.initialCount ?? 0) ? 1 : 0)) as Array<0 | 1 | 2>;
  const [cells, setCells] = useState<Array<0 | 1 | 2>>(initCells);
  const [activeColor, setActiveColor] = useState<1 | 2>(1);
  const [history, setHistory] = useState<Array<Array<0 | 1 | 2>>>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const toggleCell = (idx: number) => {
    setHistory((h) => [...h.slice(-24), cells]);
    setCells((prev) => prev.map((v, i) => (i === idx ? (v === 0 ? activeColor : 0) : v)));
    setFeedback(null);
  };

  const c1 = cells.filter((v) => v === 1).length;
  const c2 = cells.filter((v) => v === 2).length;

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Primary Maths · Ten Frame'}
      modelNote={config.modelNote}
      hints={config.hints}
      prediction={config.prediction}
      canUndo={history.length > 0}
      onUndo={() => {
        const prev = history[history.length - 1];
        if (prev) {
          setCells(prev);
          setHistory((h) => h.slice(0, -1));
          setFeedback(null);
        }
      }}
      onReset={() => {
        setCells(initCells());
        setHistory([]);
        setFeedback(null);
      }}
      onCheck={() => {
        const res = evaluateTenFrame(config, c1, c2);
        setFeedback({ passed: res.passed, message: res.feedback });
      }}
      feedback={feedback}
    >
      <div className="space-y-3">
        {config.twoColorSplit && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={activeColor === 1}
              onClick={() => setActiveColor(1)}
              className={`${PRIMARY_BTN} ${activeColor === 1 ? 'bg-sky-700 text-white' : 'border border-slate-300 bg-white text-slate-800'}`}
            >
              Blue Counter ({c1})
            </button>
            <button
              type="button"
              aria-pressed={activeColor === 2}
              onClick={() => setActiveColor(2)}
              className={`${PRIMARY_BTN} ${activeColor === 2 ? 'bg-amber-800 text-white' : 'border border-slate-300 bg-white text-slate-800'}`}
            >
              Amber Counter ({c2})
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: config.frameCount }).map((_, frameIdx) => (
            <div
              key={frameIdx}
              className="grid grid-cols-5 gap-1.5 rounded-2xl border-2 border-slate-400 bg-slate-50 p-2"
              role="group"
              aria-label={`Ten frame ${frameIdx + 1}`}
            >
              {Array.from({ length: 10 }).map((__, slot) => {
                const idx = frameIdx * 10 + slot;
                const val = cells[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    aria-pressed={val !== 0}
                    aria-label={`Ten frame cell ${idx + 1} ${val === 0 ? 'empty' : val === 1 ? 'blue counter' : 'amber counter'}`}
                    onClick={() => toggleCell(idx)}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-300 bg-white hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
                  >
                    {val === 1 && <span className="h-8 w-8 rounded-full bg-sky-700" aria-hidden="true" />}
                    {val === 2 && <span className="h-8 w-8 rounded-full bg-amber-700" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <p className="text-sm font-bold text-slate-800">
          Total counters: <span className="text-sky-800">{c1 + c2}</span>
          {config.twoColorSplit ? ` (${c1} blue + ${c2} amber)` : ''}
        </p>
      </div>
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* 2. NUMBER BONDS (PART-PART-WHOLE)                                          */
/* ========================================================================== */

function NumberBondsWorkbench({ config }: { config: Extract<NumberManipulativeConstructionConfig, { mode: 'number-bonds' }> }) {
  const [val, setVal] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const updateVal = (next: number) => {
    const clamped = Math.max(0, Math.min(config.maxValue ?? 1000, next));
    setHistory((h) => [...h.slice(-24), val]);
    setVal(clamped);
    setFeedback(null);
  };

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Primary Maths · Number Bonds'}
      hints={config.hints}
      canUndo={history.length > 0}
      onUndo={() => {
        const prev = history[history.length - 1];
        if (prev !== undefined) {
          setVal(prev);
          setHistory((h) => h.slice(0, -1));
          setFeedback(null);
        }
      }}
      onReset={() => {
        setVal(0);
        setHistory([]);
        setFeedback(null);
      }}
      onCheck={() => {
        const res = evaluateNumberBond(config, val);
        setFeedback({ passed: res.passed, message: res.feedback });
      }}
      feedback={feedback}
    >
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex h-16 w-24 flex-col items-center justify-center rounded-2xl border-2 border-indigo-700 bg-white font-extrabold text-indigo-900">
            <span className="text-[10px] uppercase text-slate-600">Whole</span>
            <span className="text-lg">{config.missingRole === 'whole' ? val : config.whole}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {config.knownParts.map((p, idx) => (
              <div
                key={idx}
                className="flex h-14 w-20 flex-col items-center justify-center rounded-2xl border-2 border-sky-700 bg-white font-bold text-sky-900"
              >
                <span className="text-[10px] uppercase text-slate-600">Part {idx + 1}</span>
                <span className="text-base">{p}</span>
              </div>
            ))}
            {config.missingRole === 'part' && (
              <div className="flex h-14 w-24 flex-col items-center justify-center rounded-2xl border-2 border-emerald-700 bg-emerald-50 font-extrabold text-emerald-900">
                <span className="text-[10px] uppercase text-emerald-800">Missing Part</span>
                <span className="text-base">{val}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => updateVal(val - 1)} className={`${PRIMARY_BTN} border border-slate-300 bg-white text-slate-800`}>
            −1
          </button>
          <button type="button" onClick={() => updateVal(val + 1)} className={`${PRIMARY_BTN} bg-sky-700 text-white`}>
            +1
          </button>
          <button type="button" onClick={() => updateVal(val + 5)} className={`${PRIMARY_BTN} bg-indigo-700 text-white`}>
            +5
          </button>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
            Value:
            <input
              type="number"
              aria-label="Number bond value"
              value={val}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isInteger(n)) updateVal(n);
              }}
              className="min-h-[48px] w-24 rounded-xl border border-slate-300 bg-white px-3 text-base font-bold"
            />
          </label>
        </div>
      </div>
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* 3. BASE-TEN BLOCKS & PLACE VALUE (WITH BIDIRECTIONAL REGROUPING)           */
/* ========================================================================== */

function BaseTenWorkbench({ config }: { config: Extract<NumberManipulativeConstructionConfig, { mode: 'base-ten-place-value' }> }) {
  const initState = (): BaseTenState => ({
    thousands: config.initialBlocks?.thousands ?? 0,
    hundreds: config.initialBlocks?.hundreds ?? 0,
    tens: config.initialBlocks?.tens ?? 0,
    ones: config.initialBlocks?.ones ?? 0,
  });
  const [blocks, setBlocks] = useState<BaseTenState>(initState);
  const [history, setHistory] = useState<BaseTenState[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const commit = (next: BaseTenState) => {
    setHistory((h) => [...h.slice(-24), blocks]);
    setBlocks(next);
    setFeedback(null);
  };

  const adjust = (place: keyof BaseTenState, delta: number) => {
    const nextVal = Math.max(0, Math.min(NUMBER_MANIPULATIVE_LIMITS.maxBaseTenBlocksPerPlace, blocks[place] + delta));
    commit({ ...blocks, [place]: nextVal });
  };

  const doRegroup = (op: Parameters<typeof regroupBaseTen>[1]) => {
    const next = regroupBaseTen(blocks, op);
    if (next) commit(next);
  };

  const cols: Array<{ key: keyof BaseTenState; label: string; color: string }> = [
    ...(config.maxPlace === 'thousands' ? [{ key: 'thousands' as const, label: 'Thousands (1000)', color: 'bg-purple-700' }] : []),
    ...(config.maxPlace === 'hundreds' || config.maxPlace === 'thousands'
      ? [{ key: 'hundreds' as const, label: 'Hundreds (100)', color: 'bg-indigo-700' }]
      : []),
    { key: 'tens', label: 'Tens (10)', color: 'bg-sky-700' },
    { key: 'ones', label: 'Ones (1)', color: 'bg-emerald-700' },
  ];

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Primary Maths · Place Value'}
      hints={config.hints}
      canUndo={history.length > 0}
      onUndo={() => {
        const prev = history[history.length - 1];
        if (prev) {
          setBlocks(prev);
          setHistory((h) => h.slice(0, -1));
          setFeedback(null);
        }
      }}
      onReset={() => {
        setBlocks(initState());
        setHistory([]);
        setFeedback(null);
      }}
      onCheck={() => {
        const res = evaluateBaseTen(config, blocks);
        setFeedback({ passed: res.passed, message: res.feedback });
      }}
      feedback={feedback}
    >
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cols.map((col) => (
            <div key={col.key} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-extrabold text-slate-800">{col.label}</p>
              <p className="mt-1 text-2xl font-black text-slate-900">{blocks[col.key]}</p>
              <div className="mt-2 flex flex-wrap gap-1 min-h-[24px]" aria-hidden="true">
                {Array.from({ length: Math.min(blocks[col.key], 15) }).map((_, i) => (
                  <span key={i} className={`inline-block h-3 w-3 rounded-sm ${col.color}`} />
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  aria-label={`Remove 1 ${col.key}`}
                  onClick={() => adjust(col.key, -1)}
                  className={`${PRIMARY_BTN} border border-slate-300 bg-white text-slate-800`}
                >
                  −
                </button>
                <button
                  type="button"
                  aria-label={`Add 1 ${col.key}`}
                  onClick={() => adjust(col.key, 1)}
                  className={`${PRIMARY_BTN} ${col.color} text-white`}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={blocks.ones < 10}
            onClick={() => doRegroup('ones-to-ten')}
            className={`${PRIMARY_BTN} border border-sky-300 bg-sky-50 text-sky-900 disabled:opacity-40`}
          >
            Exchange 10 Ones → 1 Ten
          </button>
          <button
            type="button"
            disabled={blocks.tens < 1}
            onClick={() => doRegroup('ten-to-ones')}
            className={`${PRIMARY_BTN} border border-emerald-300 bg-emerald-50 text-emerald-900 disabled:opacity-40`}
          >
            Exchange 1 Ten → 10 Ones
          </button>
          {(config.maxPlace === 'hundreds' || config.maxPlace === 'thousands') && (
            <>
              <button
                type="button"
                disabled={blocks.tens < 10}
                onClick={() => doRegroup('tens-to-hundred')}
                className={`${PRIMARY_BTN} border border-indigo-300 bg-indigo-50 text-indigo-900 disabled:opacity-40`}
              >
                Exchange 10 Tens → 1 Hundred
              </button>
              <button
                type="button"
                disabled={blocks.hundreds < 1}
                onClick={() => doRegroup('hundred-to-tens')}
                className={`${PRIMARY_BTN} border border-indigo-300 bg-white text-indigo-900 disabled:opacity-40`}
              >
                Exchange 1 Hundred → 10 Tens
              </button>
            </>
          )}
        </div>
        <p className="text-sm font-bold text-slate-800">
          Current total value: <span className="text-indigo-800">{evaluateBaseTenValue(blocks)}</span>
        </p>
      </div>
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* 4. PROPORTIONAL NUMBER LINE                                                */
/* ========================================================================== */

function NumberLineWorkbench({ config }: { config: Extract<NumberManipulativeConstructionConfig, { mode: 'number-line' }> }) {
  const [pos, setPos] = useState<number>(config.startValue);
  const [history, setHistory] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const jumps = config.jumpSizes ?? [config.step, config.step * 5];
  const jump = (delta: number) => {
    const next = Math.max(config.min, Math.min(config.max, Number((pos + delta).toFixed(4))));
    setHistory((h) => [...h.slice(-24), pos]);
    setPos(next);
    setFeedback(null);
  };

  const span = Math.max(1, config.max - config.min);
  const toX = (v: number) => 28 + ((v - config.min) / span) * 444;
  const ticks: number[] = [];
  const tickStep = Math.max(config.step, Math.ceil(span / 12));
  for (let v = config.min; v <= config.max + 1e-6; v += tickStep) {
    ticks.push(Number(v.toFixed(2)));
  }

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Primary Maths · Number Line'}
      hints={config.hints}
      canUndo={history.length > 0}
      onUndo={() => {
        const prev = history[history.length - 1];
        if (prev !== undefined) {
          setPos(prev);
          setHistory((h) => h.slice(0, -1));
          setFeedback(null);
        }
      }}
      onReset={() => {
        setPos(config.startValue);
        setHistory([]);
        setFeedback(null);
      }}
      onCheck={() => {
        const res = evaluateNumberLine(config, pos);
        setFeedback({ passed: res.passed, message: res.feedback });
      }}
      feedback={feedback}
    >
      <div className="space-y-3">
        <svg viewBox="0 0 500 96" className="w-full rounded-xl border border-slate-200 bg-white" role="img" aria-label={`Proportional number line from ${config.min} to ${config.max}, currently at ${pos}`}>
          <line x1={28} y1={52} x2={472} y2={52} stroke="#334155" strokeWidth={2.5} />
          {ticks.map((t) => (
            <g key={t}>
              <line x1={toX(t)} y1={44} x2={toX(t)} y2={60} stroke="#475569" strokeWidth={1.5} />
              <text x={toX(t)} y={76} textAnchor="middle" fontSize="11" fill="#334155">
                {t}
              </text>
            </g>
          ))}
          <circle cx={toX(config.startValue)} cy={52} r={5} fill="#64748b" />
          <circle cx={toX(pos)} cy={52} r={8} fill="#0369a1" stroke="#ffffff" strokeWidth={2} />
          <text x={toX(pos)} y={30} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0369a1">
            {pos}
          </text>
        </svg>
        <div className="flex flex-wrap gap-2">
          {jumps.map((j) => (
            <React.Fragment key={j}>
              <button type="button" onClick={() => jump(-j)} className={`${PRIMARY_BTN} border border-slate-300 bg-white text-slate-800`}>
                −{j}
              </button>
              <button type="button" onClick={() => jump(j)} className={`${PRIMARY_BTN} bg-sky-700 text-white`}>
                +{j}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* 5. MULTIPLICATION ARRAYS, EQUAL GROUPING & DIVISION WITH REMAINDERS        */
/* ========================================================================== */

function ArraysGroupingWorkbench({ config }: { config: Extract<NumberManipulativeConstructionConfig, { mode: 'arrays-grouping' }> }) {
  const [rows, setRows] = useState<number>(config.taskKind === 'division-remainder' ? (config.divisorOrFactor ?? 3) : 2);
  const [cols, setCols] = useState<number>(2);
  const [remainder, setRemainder] = useState<number>(0);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const isDiv = config.taskKind === 'division-remainder';
  const total = rows * cols + (isDiv ? remainder : 0);

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Primary Maths · Arrays & Division'}
      hints={config.hints}
      canUndo={false}
      onUndo={() => undefined}
      onReset={() => {
        setRows(isDiv ? (config.divisorOrFactor ?? 3) : 2);
        setCols(2);
        setRemainder(0);
        setFeedback(null);
      }}
      onCheck={() => {
        const res = evaluateArraysGrouping(
          config,
          config.taskKind === 'multiplication-array'
            ? { rows, cols }
            : { groups: rows, groupSize: cols, remainder },
        );
        setFeedback({ passed: res.passed, message: res.feedback });
      }}
      feedback={feedback}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-800">
          {!isDiv && (
            <label className="flex items-center gap-2">
              {config.taskKind === 'multiplication-array' ? 'Rows:' : 'Groups:'}
              <input
                type="number"
                min={1}
                max={NUMBER_MANIPULATIVE_LIMITS.maxArrayDim}
                aria-label={config.taskKind === 'multiplication-array' ? 'Array rows' : 'Number of groups'}
                value={rows}
                onChange={(e) => {
                  setRows(Math.max(1, Math.min(12, Number(e.target.value) || 1)));
                  setFeedback(null);
                }}
                className="min-h-[48px] w-20 rounded-xl border border-slate-300 bg-white px-2 text-base"
              />
            </label>
          )}
          <label className="flex items-center gap-2">
            {isDiv ? 'Quotient (per group):' : config.taskKind === 'multiplication-array' ? 'Columns:' : 'Items per group:'}
            <input
              type="number"
              min={0}
              max={24}
              aria-label={isDiv ? 'Quotient per group' : 'Array columns'}
              value={cols}
              onChange={(e) => {
                setCols(Math.max(0, Math.min(24, Number(e.target.value) || 0)));
                setFeedback(null);
              }}
              className="min-h-[48px] w-20 rounded-xl border border-slate-300 bg-white px-2 text-base"
            />
          </label>
          {isDiv && (
            <label className="flex items-center gap-2">
              Remainder:
              <input
                type="number"
                min={0}
                max={12}
                aria-label="Division remainder"
                value={remainder}
                onChange={(e) => {
                  setRemainder(Math.max(0, Math.min(12, Number(e.target.value) || 0)));
                  setFeedback(null);
                }}
                className="min-h-[48px] w-20 rounded-xl border border-slate-300 bg-white px-2 text-base"
              />
            </label>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="space-y-1.5" aria-hidden="true">
            {Array.from({ length: Math.min(rows, 10) }).map((_, r) => (
              <div key={r} className="flex flex-wrap gap-1.5">
                {Array.from({ length: Math.min(cols, 12) }).map((__, c) => (
                  <span key={c} className="inline-block h-5 w-5 rounded-full bg-indigo-700" />
                ))}
              </div>
            ))}
          </div>
          {isDiv && remainder > 0 && (
            <div className="mt-2 flex items-center gap-1.5 border-t border-slate-200 pt-2">
              <span className="text-xs font-bold text-amber-900">Remainder:</span>
              {Array.from({ length: remainder }).map((_, i) => (
                <span key={i} className="inline-block h-5 w-5 rounded-full bg-amber-700" />
              ))}
            </div>
          )}
          <p className="mt-2 text-xs font-bold text-slate-800">
            {isDiv
              ? `${rows} groups × ${cols} + ${remainder} remainder = ${total}`
              : `${rows} × ${cols} = ${total}`}
          </p>
        </div>
      </div>
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* 6. FRACTIONS (BARS/CIRCLES) & DECIMAL PLACE VALUE                          */
/* ========================================================================== */

function FractionsDecimalsWorkbench({ config }: { config: Extract<NumberManipulativeConstructionConfig, { mode: 'fractions-decimals' }> }) {
  const [den, setDen] = useState<number>(config.initialDenominator ?? config.targetDenominator ?? 4);
  const [num, setNum] = useState<number>(0);
  const [ones, setOnes] = useState<number>(0);
  const [tenths, setTenths] = useState<number>(0);
  const [hundredths, setHundredths] = useState<number>(0);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const isDec = config.representation === 'decimal-place-value';
  const decTotal = ones * 100 + tenths * 10 + hundredths;

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? (isDec ? 'Primary Maths · Decimal Place Value' : 'Primary Maths · Fractions')}
      hints={config.hints}
      canUndo={false}
      onUndo={() => undefined}
      onReset={() => {
        setDen(config.initialDenominator ?? config.targetDenominator ?? 4);
        setNum(0);
        setOnes(0);
        setTenths(0);
        setHundredths(0);
        setFeedback(null);
      }}
      onCheck={() => {
        const res = evaluateFractionsDecimals(
          config,
          isDec ? { ones, tenths, hundredths } : { numerator: num, denominator: den },
        );
        setFeedback({ passed: res.passed, message: res.feedback });
      }}
      feedback={feedback}
    >
      {isDec ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Ones (1)', val: ones, set: setOnes, color: 'bg-indigo-700' },
              { label: 'Tenths (0.1)', val: tenths, set: setTenths, color: 'bg-sky-700' },
              { label: 'Hundredths (0.01)', val: hundredths, set: setHundredths, color: 'bg-emerald-700' },
            ].map((col) => (
              <div key={col.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-bold text-slate-800">{col.label}</p>
                <p className="text-2xl font-black text-slate-900">{col.val}</p>
                <div className="mt-2 flex gap-2">
                  <button type="button" aria-label={`Decrease ${col.label}`} onClick={() => { col.set(Math.max(0, col.val - 1)); setFeedback(null); }} className={`${PRIMARY_BTN} border border-slate-300 bg-white text-slate-800`}>
                    −
                  </button>
                  <button type="button" aria-label={`Increase ${col.label}`} onClick={() => { col.set(Math.min(9, col.val + 1)); setFeedback(null); }} className={`${PRIMARY_BTN} ${col.color} text-white`}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm font-bold text-slate-800">
            Decimal value: <span className="font-mono text-indigo-800">{Math.floor(decTotal / 100)}.{String(decTotal % 100).padStart(2, '0')}</span>
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => { setNum(Math.max(0, num - 1)); setFeedback(null); }} className={`${PRIMARY_BTN} border border-slate-300 bg-white text-slate-800`}>
              −1 Part
            </button>
            <button type="button" onClick={() => { setNum(Math.min(den * 3, num + 1)); setFeedback(null); }} className={`${PRIMARY_BTN} bg-sky-700 text-white`}>
              +1 Part
            </button>
            {config.allowDenominatorChange && (
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800">
                Denominator:
                <select
                  aria-label="Fraction denominator"
                  value={den}
                  onChange={(e) => {
                    setDen(Number(e.target.value));
                    setFeedback(null);
                  }}
                  className="min-h-[48px] rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold"
                >
                  {[2, 3, 4, 5, 6, 8, 10, 12].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <div className="flex flex-wrap gap-1 rounded-xl border border-slate-300 bg-slate-50 p-2" role="img" aria-label={`Fraction bar showing ${num}/${den}`}>
            {Array.from({ length: Math.max(den, Math.ceil(num / den) * den) }).map((_, i) => (
              <div
                key={i}
                className={`h-10 flex-1 min-w-[20px] rounded border ${i < num ? 'border-sky-800 bg-sky-700' : 'border-slate-300 bg-white'}`}
              />
            ))}
          </div>
          <p className="text-sm font-bold text-slate-800">
            Shaded fraction: <span className="font-mono text-sky-800">{num}/{den}</span>
            {num > den ? ` (mixed: ${Math.floor(num / den)} ${num % den}/${den})` : ''}
          </p>
        </div>
      )}
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* 7. GHANAIAN MONEY (EXACT INTEGER PESEWAS — GH₵ & Gp)                       */
/* ========================================================================== */

function GhanaMoneyWorkbench({ config }: { config: Extract<NumberManipulativeConstructionConfig, { mode: 'ghana-money' }> }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<Array<Record<string, number>>>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const adjust = (id: string, delta: number) => {
    const cur = counts[id] ?? 0;
    const nextQty = Math.max(0, cur + delta);
    const totalPieces = Object.values(counts).reduce((a, b) => a + b, 0) - cur + nextQty;
    if (totalPieces > NUMBER_MANIPULATIVE_LIMITS.maxCoinsOrNotesTotal) return;
    setHistory((h) => [...h.slice(-24), counts]);
    setCounts({ ...counts, [id]: nextQty });
    setFeedback(null);
  };

  const totalP = sumGhanaCountsPesewas(counts);

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Primary Maths · Ghanaian Currency (GH₵ / Gp)'}
      hints={config.hints}
      canUndo={history.length > 0}
      onUndo={() => {
        const prev = history[history.length - 1];
        if (prev) {
          setCounts(prev);
          setHistory((h) => h.slice(0, -1));
          setFeedback(null);
        }
      }}
      onReset={() => {
        setCounts({});
        setHistory([]);
        setFeedback(null);
      }}
      onCheck={() => {
        const res = evaluateGhanaMoney(config, counts);
        setFeedback({ passed: res.passed, message: res.feedback });
      }}
      feedback={feedback}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {config.allowedDenomIds.map((id) => {
            const denom = GHANA_DENOM_BY_ID.get(id);
            if (!denom) return null;
            const qty = counts[id] ?? 0;
            return (
              <div key={id} className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-2">
                <button
                  type="button"
                  aria-label={`Remove ${denom.label}`}
                  onClick={() => adjust(id, -1)}
                  disabled={qty === 0}
                  className={`${PRIMARY_BTN} border border-slate-300 bg-white text-slate-800 disabled:opacity-40`}
                >
                  −
                </button>
                <div className="min-w-[68px] text-center">
                  <p className="text-xs font-extrabold text-slate-900">{denom.label}</p>
                  <p className="text-[11px] font-semibold text-slate-600">×{qty}</p>
                </div>
                <button
                  type="button"
                  aria-label={`Add ${denom.label}`}
                  onClick={() => adjust(id, 1)}
                  className={`${PRIMARY_BTN} ${denom.kind === 'note' ? 'bg-emerald-700' : 'bg-amber-800'} text-white`}
                >
                  +
                </button>
              </div>
            );
          })}
        </div>
        <p className="text-sm font-bold text-slate-800">
          Tray total: <span className="font-mono text-emerald-800">{formatGhanaPesewas(totalP)}</span>
        </p>
      </div>
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* 8. ANALOGUE CLOCK (CONTINUOUS HOUR-HAND MOTION + 12H / 24H)                */
/* ========================================================================== */

function AnalogueClockWorkbench({ config }: { config: Extract<NumberManipulativeConstructionConfig, { mode: 'analogue-clock' }> }) {
  const initTotal = config.startHours * 60 + config.startMinutes;
  const [totalMins, setTotalMins] = useState<number>(initTotal);
  const [history, setHistory] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const step = config.minuteStep ?? 5;
  const shift = (delta: number) => {
    setHistory((h) => [...h.slice(-24), totalMins]);
    setTotalMins((((totalMins + delta) % 1440) + 1440) % 1440);
    setFeedback(null);
  };

  const h24 = Math.floor(totalMins / 60);
  const min = totalMins % 60;
  const { hourAngleDeg, minuteAngleDeg } = computeClockHandAngles(h24, min);
  const cx = 110;
  const cy = 110;
  const hrRad = ((hourAngleDeg - 90) * Math.PI) / 180;
  const minRad = ((minuteAngleDeg - 90) * Math.PI) / 180;

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Primary Maths · Time & Clocks'}
      hints={config.hints}
      canUndo={history.length > 0}
      onUndo={() => {
        const prev = history[history.length - 1];
        if (prev !== undefined) {
          setTotalMins(prev);
          setHistory((h) => h.slice(0, -1));
          setFeedback(null);
        }
      }}
      onReset={() => {
        setTotalMins(initTotal);
        setHistory([]);
        setFeedback(null);
      }}
      onCheck={() => {
        const res = evaluateAnalogueClock(config, totalMins);
        setFeedback({ passed: res.passed, message: res.feedback });
      }}
      feedback={feedback}
    >
      <div className="grid gap-4 sm:grid-cols-[220px_1fr] items-center">
        <svg viewBox="0 0 220 220" className="h-[220px] w-[220px] rounded-full border border-slate-200 bg-white" role="img" aria-label={`Analogue clock showing ${config.use24Hour ? formatTime24h(totalMins) : formatTime12h(totalMins)}`}>
          <circle cx={cx} cy={cy} r={96} fill="#f8fafc" stroke="#334155" strokeWidth={3} />
          {Array.from({ length: 12 }).map((_, i) => {
            const num = i === 0 ? 12 : i;
            const a = ((i * 30 - 90) * Math.PI) / 180;
            return (
              <text key={num} x={cx + 76 * Math.cos(a)} y={cy + 76 * Math.sin(a) + 4} textAnchor="middle" fontSize="13" fontWeight="bold" fill="#0f172a">
                {num}
              </text>
            );
          })}
          {/* Continuous hour hand */}
          <line x1={cx} y1={cy} x2={cx + 52 * Math.cos(hrRad)} y2={cy + 52 * Math.sin(hrRad)} stroke="#1e293b" strokeWidth={5} strokeLinecap="round" />
          {/* Minute hand */}
          <line x1={cx} y1={cy} x2={cx + 72 * Math.cos(minRad)} y2={cy + 72 * Math.sin(minRad)} stroke="#0369a1" strokeWidth={3} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={5} fill="#0f172a" />
        </svg>
        <div className="space-y-3">
          <p className="text-base font-extrabold text-slate-900">
            Digital readout:{' '}
            <span className="font-mono text-sky-800">
              {config.use24Hour ? formatTime24h(totalMins) : formatTime12h(totalMins)}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => shift(-60)} className={`${PRIMARY_BTN} border border-slate-300 bg-white text-slate-800`}>
              −1 hr
            </button>
            <button type="button" onClick={() => shift(60)} className={`${PRIMARY_BTN} bg-indigo-700 text-white`}>
              +1 hr
            </button>
            <button type="button" onClick={() => shift(-step)} className={`${PRIMARY_BTN} border border-slate-300 bg-white text-slate-800`}>
              −{step} min
            </button>
            <button type="button" onClick={() => shift(step)} className={`${PRIMARY_BTN} bg-sky-700 text-white`}>
              +{step} min
            </button>
          </div>
        </div>
      </div>
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* 9. REPEATING & GROWING PATTERNS                                            */
/* ========================================================================== */

function PatternsWorkbench({ config }: { config: Extract<NumberManipulativeConstructionConfig, { mode: 'patterns' }> }) {
  const [nextTerms, setNextTerms] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const pushTerm = (tok: string) => {
    if (nextTerms.length >= config.expectedNext.length) return;
    setNextTerms((prev) => [...prev, tok]);
    setFeedback(null);
  };

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Primary Maths · Patterns'}
      hints={config.hints}
      canUndo={nextTerms.length > 0}
      onUndo={() => {
        setNextTerms((prev) => prev.slice(0, -1));
        setFeedback(null);
      }}
      onReset={() => {
        setNextTerms([]);
        setFeedback(null);
      }}
      onCheck={() => {
        const res = evaluatePattern(config, nextTerms);
        setFeedback({ passed: res.passed, message: res.feedback });
      }}
      feedback={feedback}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {config.givenSequence.map((tok, i) => (
            <span key={`g-${i}`} className="flex h-12 min-w-[48px] items-center justify-center rounded-xl border border-slate-300 bg-white px-3 text-sm font-extrabold text-slate-900">
              {tok}
            </span>
          ))}
          {config.expectedNext.map((_, i) => (
            <span
              key={`n-${i}`}
              className={`flex h-12 min-w-[48px] items-center justify-center rounded-xl border-2 px-3 text-sm font-extrabold ${
                nextTerms[i] ? 'border-sky-700 bg-sky-50 text-sky-900' : 'border-dashed border-slate-400 bg-white text-slate-500'
              }`}
            >
              {nextTerms[i] ?? '?'}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {config.palette.map((tok) => (
            <button
              key={tok}
              type="button"
              onClick={() => pushTerm(tok)}
              disabled={nextTerms.length >= config.expectedNext.length}
              className={`${PRIMARY_BTN} bg-sky-700 text-white disabled:opacity-40`}
            >
              {tok}
            </button>
          ))}
        </div>
      </div>
    </ConstructionLabShell>
  );
}

/* ========================================================================== */
/* MAIN EXPORT                                                                */
/* ========================================================================== */

export function NumberManipulativeLab({ config }: { config: NumberManipulativeConstructionConfig }) {
  switch (config.mode) {
    case 'counting-ten-frame':
      return <TenFrameWorkbench config={config} />;
    case 'number-bonds':
      return <NumberBondsWorkbench config={config} />;
    case 'base-ten-place-value':
      return <BaseTenWorkbench config={config} />;
    case 'number-line':
      return <NumberLineWorkbench config={config} />;
    case 'arrays-grouping':
      return <ArraysGroupingWorkbench config={config} />;
    case 'fractions-decimals':
      return <FractionsDecimalsWorkbench config={config} />;
    case 'ghana-money':
      return <GhanaMoneyWorkbench config={config} />;
    case 'analogue-clock':
      return <AnalogueClockWorkbench config={config} />;
    case 'patterns':
      return <PatternsWorkbench config={config} />;
  }
}
