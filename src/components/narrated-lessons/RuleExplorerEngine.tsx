'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, HelpCircle, RotateCcw, SlidersHorizontal, XCircle } from 'lucide-react';
import {
  evaluateDeclarativeRule,
  type RuleExplorerInteractiveConfig,
} from '@/lib/narrated-lessons/interactive-schema';

export interface RuleExplorerEngineProps {
  config: RuleExplorerInteractiveConfig;
}

function buildInitialValues(config: RuleExplorerInteractiveConfig): Record<string, boolean> {
  const init: Record<string, boolean> = {};
  for (const inp of config.inputs) {
    init[inp.id] = Boolean(inp.defaultValue);
  }
  return init;
}

/**
 * Reusable Cross-Subject Declarative Rule Explorer Engine (Step 3).
 *
 * Driven 100% by validated `RuleExplorerInteractiveConfig` JSON from CDN:
 * - Zero subject-specific or lesson-specific branches.
 * - Zero eval() / arbitrary JS — evaluates safe bounded ASTs via evaluateDeclarativeRule.
 * - Zero Firestore writes — pure client-side ephemeral state.
 * - Accessible: keyboard operable buttons with aria-pressed, visible text + icons,
 *   and polite live region output announcements.
 */
export function RuleExplorerEngine({ config }: RuleExplorerEngineProps) {
  const [values, setValues] = useState<Record<string, boolean>>(() => buildInitialValues(config));
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    setValues(buildInitialValues(config));
    setShowHints(false);
  }, [config]);

  const outcome = useMemo(() => {
    try {
      return { ok: true as const, result: evaluateDeclarativeRule(config.rule, values) };
    } catch {
      return { ok: false as const, result: false };
    }
  }, [config.rule, values]);

  const toggleInput = (id: string) => {
    setValues((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReset = () => {
    setValues(buildInitialValues(config));
  };

  const showBinary = Boolean(config.output.showBinaryValues);

  return (
    <section
      aria-label={config.accessibilityLabel}
      data-interactive-engine="rule-explorer"
      data-interactive-id={config.id}
      className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-700">
              <SlidersHorizontal className="h-3 w-3" />
              Interactive Explorer
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

      {/* Interactive Condition Toggles */}
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {config.inputs.map((inp) => {
          const active = Boolean(values[inp.id]);
          const stateText = active ? inp.trueText || 'YES' : inp.falseText || 'NO';
          return (
            <button
              key={inp.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggleInput(inp.id)}
              className={`flex min-h-[52px] w-full items-center justify-between gap-3 rounded-xl border-2 px-3.5 py-2.5 text-left transition focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                active
                  ? 'border-emerald-500 bg-emerald-50/80 text-emerald-950'
                  : 'border-slate-200 bg-slate-50/70 text-slate-800 hover:border-slate-300'
              }`}
            >
              <span className="text-xs font-bold leading-snug sm:text-sm">{inp.label}</span>
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${
                  active
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                {stateText}
                {showBinary && <span className="ml-0.5 font-mono">({active ? '1' : '0'})</span>}
              </span>
            </button>
          );
        })}
      </div>

      {/* Live Outcome Banner */}
      <div
        role="status"
        aria-live="polite"
        className={`mt-4 rounded-xl border-2 p-3.5 transition ${
          !outcome.ok
            ? 'border-amber-300 bg-amber-50 text-amber-950'
            : outcome.result
              ? 'border-emerald-400 bg-emerald-50 text-emerald-950'
              : 'border-rose-300 bg-rose-50/80 text-rose-950'
        }`}
      >
        {!outcome.ok ? (
          <p className="text-xs font-semibold">
            {config.fallbackText}
          </p>
        ) : (
          <div className="flex items-start gap-2.5">
            {outcome.result ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-extrabold">
                  {outcome.result ? config.output.trueLabel : config.output.falseLabel}
                </span>
                {showBinary && (
                  <span className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-xs font-bold text-slate-800">
                    Output = {outcome.result ? '1' : '0'}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs leading-relaxed">
                {outcome.result ? config.output.explanationTrue : config.output.explanationFalse}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Optional Progressive Hints */}
      {config.hints && config.hints.length > 0 && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowHints((v) => !v)}
            aria-expanded={showHints}
            className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {showHints ? 'Hide hint' : 'Need a hint?'}
          </button>
          {showHints && (
            <ul className="mt-2 list-disc space-y-1 rounded-xl border border-sky-200 bg-sky-50/60 py-2.5 pl-6 pr-3 text-xs text-sky-950">
              {config.hints.map((hint, idx) => (
                <li key={idx}>{hint}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
