'use client';

import React, { useMemo, useState } from 'react';
import { AlertTriangle, Zap } from 'lucide-react';
import type { ElectricalCircuitConstructionConfig } from '@/lib/narrated-lessons/interactive-schema';
import {
  evaluateDcCircuitGoal,
  solveDcCircuit,
} from '@/lib/construction-lab/dc-circuit-engine';
import { CONSTRUCTION_LAB_LIMITS } from '@/lib/construction-lab/construction-schema-validator';
import { ConstructionLabShell } from './ConstructionLabShell';

export function ElectricalCircuitLab({ config }: { config: ElectricalCircuitConstructionConfig }) {
  const initialSelection = useMemo(() => {
    const rec: Record<string, string> = {};
    for (const s of config.slots) rec[s.id] = s.initialComponentId;
    return rec;
  }, [config.slots]);

  const [selection, setSelection] = useState<Record<string, string>>(initialSelection);
  const [history, setHistory] = useState<Array<Record<string, string>>>([]);
  const [checked, setChecked] = useState(false);

  const solve = useMemo(
    () => solveDcCircuit(config.topology, config.supplyVoltageV, config.slots, config.palette, selection),
    [config.palette, config.slots, config.supplyVoltageV, config.topology, selection],
  );

  const goalEval = useMemo(
    () => (config.goal ? evaluateDcCircuitGoal(solve, config.goal) : null),
    [config.goal, solve],
  );

  const updateSlot = (slotId: string, componentId: string) => {
    if (selection[slotId] === componentId) return;
    setHistory((h) => [...h.slice(-(CONSTRUCTION_LAB_LIMITS.maxUndoHistory - 1)), selection]);
    setSelection((prev) => ({ ...prev, [slotId]: componentId }));
    setChecked(false);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setSelection(prev);
    setChecked(false);
  };

  const handleReset = () => {
    setHistory([]);
    setSelection(initialSelection);
    setChecked(false);
  };

  const mainReadings = solve.slotReadings.filter((s) => s.position === 'main');
  const branchAReadings = solve.slotReadings.filter((s) => s.position === 'branch-a');
  const branchBReadings = solve.slotReadings.filter((s) => s.position === 'branch-b');
  const probeReadings = solve.slotReadings.filter((s) => s.position === 'voltmeter-probe');

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Physics'}
      modelNote={
        config.modelNote ??
        'Simplified ohmic DC model: lamps are modelled with constant resistance (real filament resistance rises with temperature), and lamp brightness is a qualitative indicator based on calculated power (P = V × I). Safe virtual experimentation only.'
      }
      hints={config.hints}
      prediction={config.prediction}
      canUndo={history.length > 0}
      onUndo={handleUndo}
      onReset={handleReset}
      onCheck={() => setChecked(true)}
      checkLabel="Test & check circuit"
      feedback={
        checked
          ? goalEval
            ? {
                passed: goalEval.passed,
                message: goalEval.passed && config.successExplanation ? config.successExplanation : goalEval.feedback,
              }
            : {
                passed: !solve.hasShortCircuit && !solve.hasMeterMisconnection,
                message:
                  solve.diagnostics[0] ??
                  `Circuit running normally at ${solve.totalCurrentA?.toFixed(2) ?? '0.00'} A.`,
              }
          : null
      }
    >
      {config.isMisconceptionActivity && (
        <div className="mb-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950">
          Troubleshooting challenge: the starting circuit intentionally contains a wiring fault or misconception for you to diagnose and fix.
        </div>
      )}

      {/* Explicit Topology Schematic (matches solver's exact main / Branch A / Branch B / probe model) */}
      <div className="rounded-xl border border-slate-200 bg-slate-900 p-3 text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider text-sky-300">
          <span className="inline-flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            {config.supplyVoltageV} V DC Supply · Topology: {config.topology}
          </span>
          <span data-circuit-status={solve.status} className="rounded bg-slate-800 px-2 py-0.5 text-amber-200">
            {solve.status === 'short-circuit'
              ? 'SHORT CIRCUIT (PROTECTED)'
              : solve.status === 'open-main'
                ? 'OPEN CIRCUIT (0.00 A)'
                : `CLOSED · I_total = ${solve.totalCurrentA?.toFixed(2)} A`}
          </span>
        </div>

        {/* Visual Topology Diagram */}
        <div className="mt-2.5 space-y-2 text-xs">
          <div className="rounded-lg border border-sky-500/40 bg-slate-800/80 p-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
              Main Loop (Series with {config.supplyVoltageV} V Supply)
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="rounded bg-amber-500/20 px-2 py-1 font-mono font-bold text-amber-200">
                + {config.supplyVoltageV}V −
              </span>
              {mainReadings.map((r) => (
                <React.Fragment key={r.slotId}>
                  <span className="text-slate-400">──</span>
                  <span
                    className={`rounded border px-2 py-1 font-mono font-bold ${
                      r.lampBrightness === 'bright'
                        ? 'border-amber-400 bg-amber-400/25 text-amber-100'
                        : r.lampBrightness === 'normal'
                          ? 'border-yellow-400 bg-yellow-400/20 text-yellow-100'
                          : r.lampBrightness === 'dim'
                            ? 'border-amber-700 bg-amber-900/40 text-amber-200'
                            : 'border-slate-600 bg-slate-700 text-white'
                    }`}
                  >
                    {r.label}: {r.component.label}
                    {r.lampBrightness && ` [${r.lampBrightness}]`}
                    {r.component.kind === 'ammeter' && r.currentA !== null && ` (${r.currentA.toFixed(2)} A)`}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {(branchAReadings.length > 0 || branchBReadings.length > 0) && (
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-emerald-500/40 bg-slate-800/80 p-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Parallel Branch A {solve.branchAOpen ? '(OPEN · 0.00 A)' : solve.branchACurrentA !== null ? `(${solve.branchACurrentA.toFixed(2)} A)` : ''}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {branchAReadings.map((r) => (
                    <span
                      key={r.slotId}
                      className="rounded border border-emerald-600/60 bg-slate-700 px-2 py-1 font-mono font-bold text-white"
                    >
                      {r.label}: {r.component.label}
                      {r.lampBrightness && ` [${r.lampBrightness}]`}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border border-violet-500/40 bg-slate-800/80 p-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
                  Parallel Branch B {solve.branchBOpen ? '(OPEN · 0.00 A)' : solve.branchBCurrentA !== null ? `(${solve.branchBCurrentA.toFixed(2)} A)` : ''}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {branchBReadings.map((r) => (
                    <span
                      key={r.slotId}
                      className="rounded border border-violet-600/60 bg-slate-700 px-2 py-1 font-mono font-bold text-white"
                    >
                      {r.label}: {r.component.label}
                      {r.lampBrightness && ` [${r.lampBrightness}]`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {probeReadings.length > 0 && (
            <div className="rounded-lg border border-amber-500/40 bg-slate-800/80 p-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Parallel Probe Slot
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {probeReadings.map((r) => (
                  <span key={r.slotId} className="rounded bg-slate-700 px-2 py-1 font-mono font-bold text-amber-200">
                    {r.label}: {r.component.label}
                    {r.component.kind === 'voltmeter' && r.voltageV !== null && ` (${r.voltageV.toFixed(2)} V)`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Safety & Meter Diagnostics */}
      {solve.diagnostics.length > 0 && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-3 flex items-start gap-2 rounded-xl border p-3 text-xs font-semibold ${
            solve.hasShortCircuit || solve.hasMeterMisconnection
              ? 'border-rose-300 bg-rose-50 text-rose-950'
              : 'border-amber-200 bg-amber-50 text-amber-950'
          }`}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{solve.diagnostics.join(' ')}</span>
        </div>
      )}

      {/* Keyboard & Mobile Slot Component Selectors (zero drag-and-drop) */}
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {config.slots.map((slot) => {
          const reading = solve.slotReadings.find((r) => r.slotId === slot.id);
          return (
            <div key={slot.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
              <label htmlFor={`dc-slot-${config.id}-${slot.id}`} className="block text-xs font-bold text-slate-800">
                {slot.label} <span className="font-normal text-slate-500">({slot.position})</span>
              </label>
              <select
                id={`dc-slot-${config.id}-${slot.id}`}
                disabled={Boolean(slot.locked)}
                value={selection[slot.id] ?? slot.initialComponentId}
                onChange={(e) => updateSlot(slot.id, e.target.value)}
                className="mt-1 min-h-[44px] w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 disabled:bg-slate-100"
              >
                {config.palette.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                    {opt.resistanceOhm !== undefined ? ` (${opt.resistanceOhm} Ω)` : ''}
                  </option>
                ))}
              </select>
              {reading && reading.voltageV !== null && reading.currentA !== null && reading.powerW !== null && (
                <p className="mt-1 font-mono text-[11px] text-slate-600">
                  I = {reading.currentA.toFixed(2)} A · V = {reading.voltageV.toFixed(2)} V · P = {reading.powerW.toFixed(2)} W
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Readouts */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-2 text-center">
          <p className="text-[10px] font-bold uppercase text-slate-500">Equivalent R</p>
          <p className="font-mono text-sm font-extrabold text-slate-900">
            {solve.equivalentResistanceOhm === null ? 'Open' : `${solve.equivalentResistanceOhm.toFixed(2)} Ω`}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-2 text-center">
          <p className="text-[10px] font-bold uppercase text-slate-500">Total Current</p>
          <p className="font-mono text-sm font-extrabold text-slate-900">
            {solve.totalCurrentA === null ? 'Protected' : `${solve.totalCurrentA.toFixed(2)} A`}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-2 text-center">
          <p className="text-[10px] font-bold uppercase text-slate-500">Voltmeter Probe</p>
          <p className="font-mono text-sm font-extrabold text-slate-900">
            {solve.voltmeterProbeV === null ? '—' : `${solve.voltmeterProbeV.toFixed(2)} V`}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-2 text-center">
          <p className="text-[10px] font-bold uppercase text-slate-500">Goal</p>
          <p className="truncate text-[11px] font-bold text-indigo-700" title={config.goal?.description}>
            {config.goal ? config.goal.description : 'Explore freely'}
          </p>
        </div>
      </div>
    </ConstructionLabShell>
  );
}
