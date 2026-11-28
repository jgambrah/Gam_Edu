'use client';

import React, { useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { EquationBalancerConstructionConfig } from '@/lib/narrated-lessons/interactive-schema';
import {
  evaluateEquationBalance,
  formatSpeciesDisplay,
  STOICHIOMETRY_LIMITS,
} from '@/lib/construction-lab/stoichiometry-engine';
import { CONSTRUCTION_LAB_LIMITS } from '@/lib/construction-lab/construction-schema-validator';
import { ConstructionLabShell } from './ConstructionLabShell';

interface CoeffState {
  reactants: number[];
  products: number[];
}

export function EquationBalancerLab({
  config,
  isSandbox = false,
}: {
  config: EquationBalancerConstructionConfig;
  isSandbox?: boolean;
}) {
  const examples = !config.isAssessment && config.examples && config.examples.length > 0 ? config.examples : null;
  const [exampleIdx, setExampleIdx] = useState<number>(0);
  const [completedExamples, setCompletedExamples] = useState<Record<number, boolean>>({});
  const activeExample = examples ? examples[Math.min(exampleIdx, examples.length - 1)] : null;

  const activeReactants = activeExample ? activeExample.reactants : config.reactants;
  const activeProducts = activeExample ? activeExample.products : config.products;
  const activeArrow = activeExample?.arrow ?? config.arrow;
  const activeRequireSimplest = activeExample?.requireSimplestRatio ?? config.requireSimplestRatio ?? true;
  const activeModelNote = activeExample?.modelNote ?? config.modelNote;
  const activeSuccessExplanation = activeExample?.successExplanation ?? config.successExplanation;

  const maxCoeff = Math.min(
    STOICHIOMETRY_LIMITS.maxCoefficientHardCap,
    activeExample?.maxCoefficient ?? config.maxCoefficient ?? 10,
  );
  const initialState: CoeffState = useMemo(
    () => ({
      reactants: activeReactants.map(() => 1),
      products: activeProducts.map(() => 1),
    }),
    [activeProducts, activeReactants],
  );

  const [state, setState] = useState<CoeffState>(initialState);
  const [history, setHistory] = useState<CoeffState[]>([]);
  const [checked, setChecked] = useState(false);

  const switchExample = (idx: number) => {
    if (!examples) return;
    const nextEx = examples[Math.min(idx, examples.length - 1)];
    setExampleIdx(idx);
    setHistory([]);
    setState({
      reactants: nextEx.reactants.map(() => 1),
      products: nextEx.products.map(() => 1),
    });
    setChecked(false);
  };

  const evaluation = useMemo(
    () =>
      evaluateEquationBalance(
        activeReactants,
        activeProducts,
        state.reactants,
        state.products,
        {
          requireSimplestRatio: activeRequireSimplest,
          maxCoefficient: maxCoeff,
        },
      ),
    [activeProducts, activeReactants, activeRequireSimplest, maxCoeff, state.products, state.reactants],
  );

  const updateCoeff = (side: 'reactants' | 'products', idx: number, delta: -1 | 1) => {
    const curr = state[side][idx];
    const nextVal = Math.max(1, Math.min(maxCoeff, curr + delta));
    if (nextVal === curr) return;
    setHistory((h) => [...h.slice(-(CONSTRUCTION_LAB_LIMITS.maxUndoHistory - 1)), state]);
    setState((prev) => ({
      ...prev,
      [side]: prev[side].map((v, i) => (i === idx ? nextVal : v)),
    }));
    setChecked(false);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setState(prev);
    setChecked(false);
  };

  const handleReset = () => {
    setHistory([]);
    setState(initialState);
    setChecked(false);
  };

  const passed = Boolean(
    evaluation.ok &&
      evaluation.isBalanced &&
      (activeRequireSimplest ? evaluation.isSimplestRatio : true),
  );

  const handleCheck = () => {
    setChecked(true);
    if (passed && examples) {
      setCompletedExamples((prev) => ({ ...prev, [exampleIdx]: true }));
    }
  };

  const arrow = activeArrow === '->' ? '→' : activeArrow ?? '→';

  const renderSpeciesCard = (side: 'reactants' | 'products', idx: number) => {
    const sp = side === 'reactants' ? activeReactants[idx] : activeProducts[idx];
    const coeff = state[side][idx] ?? 1;
    const label = formatSpeciesDisplay(sp);
    return (
      <div
        key={`${side}-${idx}`}
        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2"
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={coeff <= 1}
            onClick={() => updateCoeff(side, idx, -1)}
            aria-label={`Decrease coefficient for ${label}`}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span
            data-coeff-value={`${side}-${idx}`}
            className="min-w-[2rem] text-center font-mono text-base font-extrabold text-indigo-700"
          >
            {coeff}
          </span>
          <button
            type="button"
            disabled={coeff >= maxCoeff}
            onClick={() => updateCoeff(side, idx, 1)}
            aria-label={`Increase coefficient for ${label}`}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="font-mono text-sm font-extrabold text-slate-900">
          {label}
          {sp.state && <span className="ml-0.5 text-xs font-semibold text-slate-500">({sp.state})</span>}
        </span>
      </div>
    );
  };

  return (
    <ConstructionLabShell
      id={isSandbox ? `${config.id}-sandbox` : config.id}
      labKind={config.labKind}
      title={isSandbox ? `${config.title} (Explore Further)` : config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Chemistry'}
      modelNote={
        activeModelNote ??
        'Balance equations by adjusting whole-number coefficients only—never alter chemical subscripts. Conservation balancing does not by itself predict reaction feasibility or conditions.'
      }
      hints={config.hints}
      prediction={isSandbox ? undefined : config.prediction}
      canUndo={history.length > 0}
      onUndo={handleUndo}
      onReset={handleReset}
      onCheck={handleCheck}
      checkLabel="Check equation balance"
      feedback={
        checked
          ? {
              passed,
              tone: passed ? 'verified' : 'error',
              message: passed && activeSuccessExplanation ? activeSuccessExplanation : evaluation.feedback,
            }
          : null
      }
      disableExploreFurther={isSandbox || Boolean(config.isAssessment) || !config.exploreFurther}
      isAssessment={Boolean(config.isAssessment)}
      renderExploreFurther={
        !isSandbox && config.exploreFurther && !config.isAssessment
          ? () => <EquationBalancerLab config={config} isSandbox />
          : undefined
      }
    >
      {/* Shared Selectable Equation Bank */}
      {examples && (
        <div className="mb-3 rounded-xl border border-indigo-200 bg-indigo-50/70 p-3 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Select chemical equation example">
            {examples.map((ex, idx) => (
              <button
                key={ex.id}
                type="button"
                role="tab"
                aria-selected={exampleIdx === idx}
                onClick={() => switchExample(idx)}
                className={`min-h-[44px] rounded-lg px-3 text-xs font-bold transition ${
                  exampleIdx === idx
                    ? 'bg-indigo-700 text-white'
                    : completedExamples[idx]
                      ? 'border border-emerald-400 bg-emerald-50 text-emerald-900'
                      : 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                }`}
              >
                {ex.label} {completedExamples[idx] ? '✓' : ''}
              </button>
            ))}
          </div>
          {activeExample?.prompt && (
            <p className="text-xs font-bold text-indigo-950">{activeExample.prompt}</p>
          )}
        </div>
      )}

      {/* Equation Workbench */}
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {activeReactants.map((_, idx) => (
            <React.Fragment key={`r-${idx}`}>
              {idx > 0 && <span className="font-extrabold text-slate-500">+</span>}
              {renderSpeciesCard('reactants', idx)}
            </React.Fragment>
          ))}
          <span className="px-2 text-xl font-extrabold text-indigo-700" aria-label="yields">
            {arrow}
          </span>
          {activeProducts.map((_, idx) => (
            <React.Fragment key={`p-${idx}`}>
              {idx > 0 && <span className="font-extrabold text-slate-500">+</span>}
              {renderSpeciesCard('products', idx)}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Live Atom & Charge Conservation Table */}
      <div
        tabIndex={0}
        role="region"
        aria-label="Chemical atom conservation table"
        className="mt-3 overflow-x-auto rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-3 py-2">Element / Charge</th>
              <th className="px-3 py-2">Reactants (Left)</th>
              <th className="px-3 py-2">Products (Right)</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {evaluation.elements.map((row) => (
              <tr key={row.element}>
                <td className="px-3 py-2 font-mono font-bold text-slate-900">{row.element}</td>
                <td className="px-3 py-2 font-mono font-bold text-slate-800">
                  {row.lhs}
                  {config.showAtomVisuals && (
                    <span className="ml-1.5 inline-flex gap-0.5" aria-hidden="true">
                      {Array.from({ length: Math.min(row.lhs, 12) }).map((_, i) => (
                        <span key={i} className="inline-block h-2 w-2 rounded-full bg-sky-500" />
                      ))}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 font-mono font-bold text-slate-800">
                  {row.rhs}
                  {config.showAtomVisuals && (
                    <span className="ml-1.5 inline-flex gap-0.5" aria-hidden="true">
                      {Array.from({ length: Math.min(row.rhs, 12) }).map((_, i) => (
                        <span key={i} className="inline-block h-2 w-2 rounded-full bg-teal-500" />
                      ))}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      row.balanced ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {row.balanced ? 'Balanced' : 'Unbalanced'}
                  </span>
                </td>
              </tr>
            ))}
            {evaluation.hasIonicSpecies && (
              <tr className="bg-indigo-50/40">
                <td className="px-3 py-2 font-bold text-indigo-950">Net Electric Charge</td>
                <td className="px-3 py-2 font-mono font-bold text-indigo-950">
                  {evaluation.lhsCharge > 0 ? `+${evaluation.lhsCharge}` : evaluation.lhsCharge}
                </td>
                <td className="px-3 py-2 font-mono font-bold text-indigo-950">
                  {evaluation.rhsCharge > 0 ? `+${evaluation.rhsCharge}` : evaluation.rhsCharge}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      evaluation.isChargeBalanced ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                    }`}
                  >
                    {evaluation.isChargeBalanced ? 'Charge conserved' : 'Charge unbalanced'}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </ConstructionLabShell>
  );
}
