'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { BooleanCircuitConstructionConfig } from '@/lib/narrated-lessons/interactive-schema';
import {
  GATE_ARITY,
  generateTruthTable,
  gradeCircuit,
  validateCircuit,
  type LogicCircuitNetlist,
  type LogicGateNode,
  type LogicGateOp,
} from '@/lib/boolean-logic/circuit-engine';
import { CONSTRUCTION_LAB_LIMITS } from '@/lib/construction-lab/construction-schema-validator';
import { ConstructionLabShell } from './ConstructionLabShell';

interface CircuitDraft {
  gates: LogicGateNode[];
  output: string;
}

/**
 * Declarative Boolean Circuit Adapter (Step 4D Domain 4).
 *
 * Reuses the existing pure `circuit-engine.ts` (validateCircuit, generateTruthTable, gradeCircuit)
 * directly with zero duplicated Boolean logic, enabling future CS lessons to author custom
 * combinational logic construction tasks purely in JSON without adding TypeScript activity files.
 */
export function DeclarativeBooleanCircuitAdapter({
  config,
}: {
  config: BooleanCircuitConstructionConfig;
}) {
  const cc = config.circuitConfig!;
  const maxGates = cc.maxGates ?? CONSTRUCTION_LAB_LIMITS.maxBooleanGates;

  const initialDraft: CircuitDraft = useMemo(
    () => ({
      gates: (cc.initialGates ?? []).map((g) => ({ id: g.id, op: g.op, inputs: [...g.inputs] })),
      output: cc.initialOutput ?? cc.inputs[0],
    }),
    [cc.initialGates, cc.initialOutput, cc.inputs],
  );

  const [draft, setDraft] = useState<CircuitDraft>(initialDraft);
  const [history, setHistory] = useState<CircuitDraft[]>([]);
  const [checked, setChecked] = useState(false);

  const pushState = (next: CircuitDraft) => {
    setHistory((h) => [...h.slice(-(CONSTRUCTION_LAB_LIMITS.maxUndoHistory - 1)), draft]);
    setDraft(next);
    setChecked(false);
  };

  const netlist: LogicCircuitNetlist = useMemo(
    () => ({ inputs: cc.inputs, gates: draft.gates, output: draft.output }),
    [cc.inputs, draft.gates, draft.output],
  );

  const validation = useMemo(() => validateCircuit(netlist), [netlist]);
  const truthTableResult = useMemo(
    () => (validation.ok ? generateTruthTable(netlist) : null),
    [netlist, validation.ok],
  );
  const truthTableRows = truthTableResult?.ok ? truthTableResult.rows : null;

  const availableSignals = useMemo(
    () => [...cc.inputs, ...draft.gates.map((g) => g.id)],
    [cc.inputs, draft.gates],
  );

  const addGate = (op: LogicGateOp) => {
    if (draft.gates.length >= maxGates) return;
    let num = draft.gates.length + 1;
    while (availableSignals.includes(`G${num}`)) num++;
    const newId = `G${num}`;
    const arity = GATE_ARITY[op];
    const defaultInputs =
      arity === 1 ? [cc.inputs[0]] : [cc.inputs[0], cc.inputs[Math.min(1, cc.inputs.length - 1)]];
    pushState({
      gates: [...draft.gates, { id: newId, op, inputs: defaultInputs }],
      output: newId,
    });
  };

  const removeGate = (id: string) => {
    const nextGates = draft.gates.filter((g) => g.id !== id);
    const nextOut = draft.output === id ? nextGates[nextGates.length - 1]?.id ?? cc.inputs[0] : draft.output;
    pushState({ gates: nextGates, output: nextOut });
  };

  const updateGateInput = (gateId: string, portIdx: number, signal: string) => {
    pushState({
      ...draft,
      gates: draft.gates.map((g) =>
        g.id === gateId ? { ...g, inputs: g.inputs.map((inp, i) => (i === portIdx ? signal : inp)) } : g,
      ),
    });
  };

  const evaluateSubmission = (): { passed: boolean; message: string } => {
    if (!validation.ok) {
      return { passed: false, message: `Circuit wiring issue: ${validation.errors.join(' ')}` };
    }
    if (cc.maxGates !== undefined && draft.gates.length > cc.maxGates) {
      return {
        passed: false,
        message: `Circuit uses ${draft.gates.length} gates, exceeding the structural limit of ${cc.maxGates} gate(s).`,
      };
    }

    if (cc.gradingMode === 'specified-gate-structure' && cc.targetNetlist) {
      const graded = gradeCircuit(netlist, cc.targetNetlist, 'specified-gate-structure');
      return {
        passed: graded.passed,
        message: graded.passed && (cc.successExplanation ?? config.successExplanation)
          ? (cc.successExplanation ?? config.successExplanation)!
          : graded.message,
      };
    }

    // Functional-equivalence grading directly against targetTruthTable via circuit-engine generateTruthTable
    if (!truthTableRows) {
      return { passed: false, message: 'Unable to evaluate truth table for current circuit.' };
    }
    for (let i = 0; i < cc.targetTruthTable.length; i++) {
      const row = truthTableRows[i];
      if (!row || row.output !== cc.targetTruthTable[i]) {
        const inputsDesc = cc.inputs.map((inp) => `${inp}=${row?.values[inp] ?? 0}`).join(', ');
        return {
          passed: false,
          message: `Output mismatch on row (${inputsDesc}): your circuit outputs ${row?.output ?? '?'} instead of ${cc.targetTruthTable[i]}.`,
        };
      }
    }
    return {
      passed: true,
      message:
        cc.successExplanation ??
        config.successExplanation ??
        'Functionally equivalent! Your logic circuit matches every row of the target truth table.',
    };
  };

  const feedback = checked ? evaluateSubmission() : null;

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Computer Science'}
      modelNote={
        config.modelNote ??
        'Combinational logic circuit graded via deterministic truth-table evaluation (circuit-engine.ts). Alternative functionally equivalent gate structures are accepted unless specified.'
      }
      hints={config.hints}
      prediction={config.prediction}
      canUndo={history.length > 0}
      onUndo={() => {
        if (history.length === 0) return;
        const prev = history[history.length - 1];
        setHistory((h) => h.slice(0, -1));
        setDraft(prev);
        setChecked(false);
      }}
      onReset={() => {
        setHistory([]);
        setDraft(initialDraft);
        setChecked(false);
      }}
      onCheck={() => setChecked(true)}
      checkLabel="Grade logic circuit"
      feedback={feedback}
    >
      {/* Gate Palette */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700">
            Add Gate ({draft.gates.length}/{maxGates}):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {cc.allowedGates.map((op) => (
              <button
                key={op}
                type="button"
                disabled={draft.gates.length >= maxGates}
                onClick={() => addGate(op)}
                className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-indigo-300 bg-white px-3 py-1.5 font-mono text-xs font-extrabold text-indigo-900 hover:bg-indigo-50 disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                {op}
              </button>
            ))}
          </div>
        </div>

        {/* Gate Wiring List (Keyboard & 360px Mobile Accessible) */}
        <div className="mt-3 space-y-2">
          {draft.gates.length === 0 ? (
            <p className="text-xs text-slate-500">No gates added yet. Add a gate above to begin wiring.</p>
          ) : (
            draft.gates.map((gate) => {
              const validSources = availableSignals.filter((s) => s !== gate.id);
              return (
                <div
                  key={gate.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5 text-xs"
                >
                  <span className="rounded bg-indigo-100 px-2 py-1 font-mono font-extrabold text-indigo-950">
                    {gate.id} = {gate.op}
                  </span>
                  {gate.inputs.map((src, portIdx) => (
                    <label key={portIdx} className="inline-flex items-center gap-1 text-slate-700">
                      <span>In {portIdx + 1}:</span>
                      <select
                        aria-label={`${gate.id} input ${portIdx + 1}`}
                        value={src}
                        onChange={(e) => updateGateInput(gate.id, portIdx, e.target.value)}
                        className="min-h-[40px] rounded border border-slate-300 bg-white px-2 py-1 font-mono text-xs font-bold"
                      >
                        {validSources.map((sig) => (
                          <option key={sig} value={sig}>
                            {sig}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                  <button
                    type="button"
                    onClick={() => removeGate(gate.id)}
                    aria-label={`Remove gate ${gate.id}`}
                    className="ml-auto inline-flex min-h-[40px] items-center gap-1 rounded border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-bold text-rose-800 hover:bg-rose-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Final Output Selector */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <label htmlFor={`bool-out-${config.id}`} className="font-bold text-slate-800">
            Final Output ({cc.outputLabel ?? 'X'}):
          </label>
          <select
            id={`bool-out-${config.id}`}
            value={draft.output}
            onChange={(e) => pushState({ ...draft, output: e.target.value })}
            className="min-h-[44px] rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs font-bold"
          >
            {availableSignals.map((sig) => (
              <option key={sig} value={sig}>
                {sig}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Truth Table Comparison */}
      {truthTableRows && (
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-center font-mono text-xs">
            <thead className="bg-slate-50 text-[11px] text-slate-600">
              <tr>
                {cc.inputs.map((inp) => (
                  <th key={inp} className="px-2 py-1.5">
                    {inp}
                  </th>
                ))}
                <th className="px-2 py-1.5">Your {cc.outputLabel ?? 'X'}</th>
                <th className="px-2 py-1.5">Target {cc.outputLabel ?? 'X'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {truthTableRows.map((row, rIdx) => {
                const target = cc.targetTruthTable[rIdx];
                const match = row.output === target;
                return (
                  <tr key={rIdx} className={match ? 'bg-emerald-50/30' : 'bg-rose-50/40'}>
                    {cc.inputs.map((inp) => (
                      <td key={inp} className="px-2 py-1.5">
                        {row.values[inp]}
                      </td>
                    ))}
                    <td className="px-2 py-1.5 font-extrabold text-slate-900">{row.output}</td>
                    <td className="px-2 py-1.5 font-extrabold text-indigo-800">
                      {target} {match ? '✓' : '✗'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </ConstructionLabShell>
  );
}
