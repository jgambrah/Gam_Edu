'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Plus,
  RotateCcw,
  Trash2,
  Undo2,
  XCircle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import {
  evaluateCircuit,
  GATE_ARITY,
  generateTruthTable,
  gradeCircuit,
  validateCircuit,
  type CircuitGradeResult,
  type CircuitGradingMode,
  type LogicCircuitNetlist,
  type LogicGateNode,
  type LogicGateOp,
} from '@/lib/boolean-logic/circuit-engine';
import {
  getCh10ActivityForSlide,
  toNetlist,
  type Ch10BooleanActivity,
} from '@/lib/narrated-lessons/ch10-boolean-activities';

interface BooleanCircuitLabProps {
  lessonId: string;
  slideId?: string;
}

const GATE_OPS: LogicGateOp[] = ['NOT', 'AND', 'OR', 'NAND', 'NOR', 'XOR'];

interface PositionedNode {
  id: string;
  kind: 'input' | 'gate';
  op?: LogicGateOp;
  inputs: string[];
  col: number;
  x: number;
  y: number;
}

/**
 * Deterministic left-to-right layered layout for combinational logic circuits.
 */
function layoutCircuit(netlist: LogicCircuitNetlist): {
  nodes: PositionedNode[];
  nodeMap: Map<string, PositionedNode>;
  width: number;
  height: number;
} {
  const depth = new Map<string, number>();
  for (const inp of netlist.inputs) depth.set(inp, 0);

  const gateMap = new Map(netlist.gates.map((g) => [g.id, g]));
  const computeDepth = (id: string, seen = new Set<string>()): number => {
    if (depth.has(id)) return depth.get(id)!;
    if (seen.has(id)) return 1;
    seen.add(id);
    const g = gateMap.get(id);
    if (!g) return 0;
    const d = Math.max(0, ...g.inputs.map((src) => computeDepth(src, new Set(seen)))) + 1;
    depth.set(id, d);
    return d;
  };

  for (const g of netlist.gates) computeDepth(g.id);

  const columns = new Map<number, Array<{ id: string; kind: 'input' | 'gate'; op?: LogicGateOp; inputs: string[] }>>();
  for (const inp of netlist.inputs) {
    const arr = columns.get(0) ?? [];
    arr.push({ id: inp, kind: 'input', inputs: [] });
    columns.set(0, arr);
  }
  for (const g of netlist.gates) {
    const col = depth.get(g.id) ?? 1;
    const arr = columns.get(col) ?? [];
    arr.push({ id: g.id, kind: 'gate', op: g.op, inputs: g.inputs });
    columns.set(col, arr);
  }

  const maxCol = Math.max(1, ...Array.from(columns.keys()));
  const colSpacing = 175;
  const rowSpacing = 84;
  const maxRows = Math.max(2, ...Array.from(columns.values()).map((c) => c.length));
  const width = Math.max(520, (maxCol + 1) * colSpacing + 120);
  const height = Math.max(210, maxRows * rowSpacing + 60);

  const nodes: PositionedNode[] = [];
  const nodeMap = new Map<string, PositionedNode>();

  for (let col = 0; col <= maxCol; col++) {
    const items = columns.get(col) ?? [];
    const totalH = (items.length - 1) * rowSpacing;
    const startY = height / 2 - totalH / 2;
    items.forEach((item, idx) => {
      const node: PositionedNode = {
        ...item,
        col,
        x: 68 + col * colSpacing,
        y: startY + idx * rowSpacing,
      };
      nodes.push(node);
      nodeMap.set(node.id, node);
    });
  }

  return { nodes, nodeMap, width, height };
}

function GateSymbol({ op, active }: { op: LogicGateOp; active: boolean }) {
  const fill = active ? '#ecfdf5' : '#ffffff';
  const stroke = active ? '#059669' : '#334155';
  const hasBubble = op === 'NOT' || op === 'NAND' || op === 'NOR';

  return (
    <g>
      {op === 'NOT' && (
        <polygon points="-24,-18 16,0 -24,18" fill={fill} stroke={stroke} strokeWidth={2.2} strokeLinejoin="round" />
      )}
      {(op === 'AND' || op === 'NAND') && (
        <path
          d="M -26,-20 L -2,-20 A 20,20 0 0,1 -2,20 L -26,20 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      )}
      {(op === 'OR' || op === 'NOR') && (
        <path
          d="M -26,-20 Q -14,0 -26,20 L -6,20 Q 14,18 22,0 Q 14,-18 -6,-20 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      )}
      {op === 'XOR' && (
        <>
          <path
            d="M -32,-20 Q -20,0 -32,20"
            fill="none"
            stroke={stroke}
            strokeWidth={2.2}
            strokeLinecap="round"
          />
          <path
            d="M -24,-20 Q -12,0 -24,20 L -4,20 Q 16,18 24,0 Q 16,-18 -4,-20 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
        </>
      )}
      {hasBubble && (
        <circle
          cx={op === 'NOT' ? 21 : 23}
          cy={0}
          r={4.5}
          fill={fill}
          stroke={stroke}
          strokeWidth={2.2}
        />
      )}
      <text
        x={op === 'NOT' ? -8 : -4}
        y={4}
        textAnchor="middle"
        fontSize={10}
        fontWeight={800}
        fill="#0f172a"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {op}
      </text>
    </g>
  );
}

export function BooleanCircuitLab({ lessonId, slideId }: BooleanCircuitLabProps) {
  const activity: Ch10BooleanActivity | null = useMemo(
    () => getCh10ActivityForSlide(lessonId, slideId),
    [lessonId, slideId],
  );

  const [open, setOpen] = useState(false);
  const [labMode, setLabMode] = useState<'explore' | 'build'>('explore');
  const [gradingMode, setGradingMode] = useState<CircuitGradingMode>('functional-equivalence');
  const [zoom, setZoom] = useState<number>(100);
  const [inputVals, setInputVals] = useState<Record<string, 0 | 1>>({});

  // Builder state
  const [builderGates, setBuilderGates] = useState<LogicGateNode[]>([]);
  const [builderOutput, setBuilderOutput] = useState<string>('Y');
  const [history, setHistory] = useState<Array<{ gates: LogicGateNode[]; output: string }>>([]);
  const [newGateOp, setNewGateOp] = useState<LogicGateOp>('AND');
  const [newGateId, setNewGateId] = useState<string>('D');
  const [newPin1, setNewPin1] = useState<string>('A');
  const [newPin2, setNewPin2] = useState<string>('B');
  const [gradeResult, setGradeResult] = useState<CircuitGradeResult | null>(null);

  // Reset per slide
  useEffect(() => {
    if (!activity) return;
    const initInputs: Record<string, 0 | 1> = {};
    for (const inp of activity.inputs) initInputs[inp] = 0;
    setInputVals(initInputs);
    setBuilderGates([]);
    setBuilderOutput(activity.output);
    setHistory([]);
    setNewGateId(activity.gates.length === 1 ? activity.output : 'D');
    setNewPin1(activity.inputs[0] ?? 'A');
    setNewPin2(activity.inputs[1] ?? activity.inputs[0] ?? 'A');
    setGradeResult(null);
  }, [activity?.id]);

  if (!activity) return null;

  const targetNetlist = toNetlist(activity);
  const activeNetlist: LogicCircuitNetlist =
    labMode === 'explore'
      ? targetNetlist
      : { inputs: activity.inputs, gates: builderGates, output: builderOutput };

  const validation = validateCircuit(activeNetlist);
  const evalResult = evaluateCircuit(activeNetlist, inputVals);
  const truthTable = generateTruthTable(activeNetlist);
  const layout = layoutCircuit(activeNetlist);

  // Compute fan-out counts so we can draw junction dots on split wires
  const fanOutCounts = new Map<string, number>();
  for (const g of activeNetlist.gates) {
    for (const src of g.inputs) {
      fanOutCounts.set(src, (fanOutCounts.get(src) ?? 0) + 1);
    }
  }

  const availableSignals = [...activity.inputs, ...builderGates.map((g) => g.id)];

  const toggleInput = (inp: string) => {
    setInputVals((prev) => ({ ...prev, [inp]: prev[inp] ? 0 : 1 }));
  };

  const pushHistory = () => {
    setHistory((prev) => [...prev.slice(-19), { gates: builderGates, output: builderOutput }]);
  };

  const handleAddGate = () => {
    const cleanId = newGateId.trim().toUpperCase();
    if (!cleanId) return;
    pushHistory();
    const arity = GATE_ARITY[newGateOp];
    const pins = arity === 1 ? [newPin1] : [newPin1, newPin2];
    const nextGates = [...builderGates, { id: cleanId, op: newGateOp, inputs: pins }];
    setBuilderGates(nextGates);
    if (cleanId === activity.output || nextGates.length === 1) {
      setBuilderOutput(cleanId);
    }
    // Suggest next signal label
    const used = new Set([...activity.inputs, ...nextGates.map((g) => g.id)]);
    const candidates = ['D', 'E', 'F', 'G', 'H', activity.output];
    const nextLabel = candidates.find((c) => !used.has(c)) ?? `G${nextGates.length + 1}`;
    setNewGateId(nextLabel);
    setGradeResult(null);
  };

  const handleDeleteGate = (gateId: string) => {
    pushHistory();
    setBuilderGates((prev) => prev.filter((g) => g.id !== gateId));
    setGradeResult(null);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setBuilderGates(prev.gates);
    setBuilderOutput(prev.output);
    setGradeResult(null);
  };

  const handleResetBuilder = () => {
    pushHistory();
    setBuilderGates([]);
    setBuilderOutput(activity.output);
    setGradeResult(null);
  };

  const handleGrade = () => {
    const res = gradeCircuit(activeNetlist, targetNetlist, gradingMode);
    setGradeResult(res);
  };

  const accessibleDescription = `Logic circuit with inputs ${activeNetlist.inputs.join(', ')}, ${activeNetlist.gates.length} gate(s): ${activeNetlist.gates.map((g) => `${g.id} = ${g.op}(${g.inputs.join(', ')})`).join('; ')}, output ${activeNetlist.output}.`;

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 px-4 py-3 text-left text-white transition hover:from-emerald-900 hover:to-slate-800"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
            <Cpu className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-extrabold tracking-tight">
                Interactive Logic Circuit Lab
              </span>
              <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
                {activity.title}
              </span>
            </div>
            <p className="truncate text-[11px] text-emerald-100/80">
              Toggle inputs (0/1), trace live wires &amp; truth tables, or build &amp; grade your own circuit
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold text-emerald-100">
          {open ? 'Hide Lab' : 'Open Lab'}
          {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </span>
      </button>

      {open && (
        <div className="space-y-4 p-4">
          {/* Mode Switcher + Zoom */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="inline-flex rounded-xl bg-slate-100 p-1" role="tablist" aria-label="Circuit Lab Mode">
              <button
                type="button"
                role="tab"
                aria-selected={labMode === 'explore'}
                onClick={() => {
                  setLabMode('explore');
                  setGradeResult(null);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  labMode === 'explore'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Explore Worked Circuit
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={labMode === 'build'}
                onClick={() => setLabMode('build')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  labMode === 'build'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Build &amp; Check Circuit
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(75, z - 25))}
                aria-label="Zoom out circuit diagram"
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[3rem] text-center text-xs font-bold text-slate-600">{zoom}%</span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(150, z + 25))}
                aria-label="Zoom in circuit diagram"
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Input Toggles */}
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Inputs:
            </span>
            {activity.inputs.map((inp) => {
              const val = inputVals[inp] ?? 0;
              return (
                <button
                  key={inp}
                  type="button"
                  role="switch"
                  aria-checked={val === 1}
                  aria-label={`Toggle input ${inp}, currently ${val}`}
                  onClick={() => toggleInput(inp)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-extrabold transition focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                    val === 1
                      ? 'border-emerald-500 bg-emerald-600 text-white shadow-xs'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{inp}</span>
                  <span className="rounded bg-black/15 px-1.5 py-0.5 font-mono">{val}</span>
                </button>
              );
            })}
            {evalResult.ok && (
              <div className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold">
                <span className="text-slate-500">Output {activeNetlist.output}:</span>
                <span
                  className={`rounded px-2 py-0.5 font-mono ${
                    evalResult.output === 1
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {evalResult.output}
                </span>
              </div>
            )}
          </div>

          {/* Builder Controls */}
          {labMode === 'build' && (
            <div className="space-y-3 rounded-xl border border-indigo-200 bg-indigo-50/60 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold text-indigo-950">
                  Construct the circuit for <span className="underline">{activity.title}</span> (inputs:{' '}
                  {activity.inputs.join(', ')} → output: {activity.output})
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={history.length === 0}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <Undo2 className="h-3 w-3" /> Undo
                  </button>
                  <button
                    type="button"
                    onClick={handleResetBuilder}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <RotateCcw className="h-3 w-3" /> Reset
                  </button>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                <label className="text-[11px] font-bold text-slate-700">
                  Gate Type
                  <select
                    value={newGateOp}
                    onChange={(e) => setNewGateOp(e.target.value as LogicGateOp)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold"
                  >
                    {GATE_OPS.map((op) => (
                      <option key={op} value={op}>
                        {op} ({GATE_ARITY[op]} in)
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-[11px] font-bold text-slate-700">
                  Output Label
                  <input
                    type="text"
                    value={newGateId}
                    onChange={(e) => setNewGateId(e.target.value)}
                    placeholder="e.g. D or Y"
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-mono font-bold"
                  />
                </label>

                <label className="text-[11px] font-bold text-slate-700">
                  Input Pin 1
                  <select
                    value={newPin1}
                    onChange={(e) => setNewPin1(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-mono font-semibold"
                  >
                    {availableSignals.map((sig) => (
                      <option key={sig} value={sig}>
                        {sig}
                      </option>
                    ))}
                  </select>
                </label>

                {GATE_ARITY[newGateOp] === 2 ? (
                  <label className="text-[11px] font-bold text-slate-700">
                    Input Pin 2
                    <select
                      value={newPin2}
                      onChange={(e) => setNewPin2(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-mono font-semibold"
                    >
                      {availableSignals.map((sig) => (
                        <option key={sig} value={sig}>
                          {sig}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <div className="flex items-end text-[11px] text-slate-500 pb-2">NOT takes 1 input</div>
                )}

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddGate}
                    className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Gate
                  </button>
                </div>
              </div>

              {builderGates.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {builderGates.map((g) => (
                    <span
                      key={g.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white px-2.5 py-1 text-[11px] font-mono font-bold text-slate-800"
                    >
                      {g.id} = {g.op}({g.inputs.join(', ')})
                      <button
                        type="button"
                        onClick={() => handleDeleteGate(g.id)}
                        aria-label={`Remove gate ${g.id}`}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <label className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    Final Output:
                    <select
                      value={builderOutput}
                      onChange={(e) => setBuilderOutput(e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-mono font-bold"
                    >
                      {availableSignals.map((sig) => (
                        <option key={sig} value={sig}>
                          {sig}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              {/* Grading Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-indigo-200/80 pt-2.5">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-700">
                  <span>Grading Mode:</span>
                  <button
                    type="button"
                    onClick={() => setGradingMode('functional-equivalence')}
                    className={`rounded-lg px-2.5 py-1 transition ${
                      gradingMode === 'functional-equivalence'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Functional Equivalence
                  </button>
                  <button
                    type="button"
                    onClick={() => setGradingMode('specified-gate-structure')}
                    className={`rounded-lg px-2.5 py-1 transition ${
                      gradingMode === 'specified-gate-structure'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Specified-Expression Exam Mode
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleGrade}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-extrabold text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Check Circuit
                </button>
              </div>

              {gradeResult && (
                <div
                  className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-xs font-semibold ${
                    gradeResult.passed
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border-rose-300 bg-rose-50 text-rose-900'
                  }`}
                >
                  {gradeResult.passed ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                  )}
                  <span>{gradeResult.message}</span>
                </div>
              )}
            </div>
          )}

          {/* Validation Errors (Cycles / Missing Inputs / Multiple Drivers / Invalid Arity) */}
          {!validation.ok && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
              {validation.errors.map((err, idx) => (
                <p key={idx}>• {err}</p>
              ))}
            </div>
          )}

          {/* Responsive Wired Circuit SVG */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/70 p-2">
            <p className="sr-only">{accessibleDescription}</p>
            <svg
              role="img"
              aria-label={accessibleDescription}
              viewBox={`0 0 ${layout.width} ${layout.height}`}
              style={{ width: `${zoom}%`, minWidth: '300px' }}
              className="mx-auto h-auto"
            >
              {/* Continuous orthogonal wires with junction dots */}
              {layout.nodes
                .filter((n) => n.kind === 'gate')
                .map((gateNode) =>
                  gateNode.inputs.map((srcId, pinIdx) => {
                    const srcNode = layout.nodeMap.get(srcId);
                    if (!srcNode) return null;
                    const x1 = srcNode.kind === 'input' ? srcNode.x + 22 : srcNode.x + 28;
                    const y1 = srcNode.y;
                    const pinOffset = gateNode.inputs.length === 1 ? 0 : pinIdx === 0 ? -10 : 10;
                    const x2 = gateNode.x - 26;
                    const y2 = gateNode.y + pinOffset;
                    const midX = x1 + (x2 - x1) * 0.45 + (pinIdx === 0 ? -6 : 6);
                    const val = evalResult.values[srcId] ?? 0;
                    const stroke = val === 1 ? '#059669' : '#64748b';
                    const isSplit = (fanOutCounts.get(srcId) ?? 0) > 1;

                    return (
                      <g key={`${gateNode.id}-${pinIdx}-${srcId}`}>
                        <path
                          d={`M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`}
                          fill="none"
                          stroke={stroke}
                          strokeWidth={val === 1 ? 2.6 : 2}
                          strokeLinejoin="round"
                        />
                        {isSplit && <circle cx={midX} cy={y1} r={3.5} fill={stroke} />}
                      </g>
                    );
                  }),
                )}

              {/* Nodes (Inputs + Gates) */}
              {layout.nodes.map((node) => {
                const val = evalResult.values[node.id] ?? 0;
                const active = val === 1;
                if (node.kind === 'input') {
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      onClick={() => toggleInput(node.id)}
                      className="cursor-pointer"
                    >
                      <rect
                        x={-22}
                        y={-16}
                        width={44}
                        height={32}
                        rx={8}
                        fill={active ? '#059669' : '#ffffff'}
                        stroke={active ? '#047857' : '#334155'}
                        strokeWidth={2}
                      />
                      <text
                        x={0}
                        y={-1}
                        textAnchor="middle"
                        fontSize={11}
                        fontWeight={800}
                        fill={active ? '#ffffff' : '#0f172a'}
                      >
                        {node.id}
                      </text>
                      <text
                        x={0}
                        y={11}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight={700}
                        fill={active ? '#d1fae5' : '#64748b'}
                      >
                        {val}
                      </text>
                    </g>
                  );
                }

                const isOutput = node.id === activeNetlist.output;
                return (
                  <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                    <GateSymbol op={node.op!} active={active} />
                    {/* Intermediate / Output signal pill */}
                    <line
                      x1={27}
                      y1={0}
                      x2={isOutput ? 62 : 42}
                      y2={0}
                      stroke={active ? '#059669' : '#64748b'}
                      strokeWidth={active ? 2.6 : 2}
                    />
                    <rect
                      x={isOutput ? 62 : 30}
                      y={isOutput ? -15 : -29}
                      width={isOutput ? 44 : 36}
                      height={isOutput ? 30 : 18}
                      rx={6}
                      fill={isOutput ? (active ? '#059669' : '#1e293b') : active ? '#d1fae5' : '#f1f5f9'}
                      stroke={active ? '#059669' : '#94a3b8'}
                      strokeWidth={1.4}
                    />
                    <text
                      x={isOutput ? 84 : 48}
                      y={isOutput ? 4 : -17}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={800}
                      fill={isOutput ? '#ffffff' : active ? '#065f46' : '#334155'}
                    >
                      {node.id}={val}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Live Truth Table with Active Row Highlighted */}
          {truthTable.ok && (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                  <tr>
                    {truthTable.columns.map((col) => (
                      <th
                        key={col}
                        className={`px-3 py-2 text-center font-mono ${
                          col === activeNetlist.output ? 'bg-emerald-100/80 text-emerald-900' : ''
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {truthTable.rows.map((row, idx) => {
                    const isActive = activeNetlist.inputs.every(
                      (inp) => row.values[inp] === (inputVals[inp] ?? 0),
                    );
                    return (
                      <tr
                        key={idx}
                        onClick={() => {
                          const next: Record<string, 0 | 1> = {};
                          for (const inp of activeNetlist.inputs) next[inp] = row.values[inp];
                          setInputVals(next);
                        }}
                        className={`cursor-pointer transition ${
                          isActive
                            ? 'bg-emerald-50 font-extrabold text-emerald-950 ring-1 ring-inset ring-emerald-400'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {truthTable.columns.map((col) => (
                          <td
                            key={col}
                            className={`px-3 py-1.5 text-center font-mono ${
                              col === activeNetlist.output ? 'font-extrabold' : ''
                            }`}
                          >
                            {row.values[col]}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
