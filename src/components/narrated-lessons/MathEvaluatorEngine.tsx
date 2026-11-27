'use client';

import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Calculator, CheckCircle2, HelpCircle, RotateCcw, XCircle } from 'lucide-react';
import type { MathEvaluatorInteractiveConfig } from '@/lib/narrated-lessons/interactive-schema';
import { evaluateMathSubmission, type MathEvalResult } from '@/lib/math-evaluator/math-eval-engine';
import { MathPreview } from './MathPreview';

const LazyMathWorkingWorkspace = dynamic(
  () => import('./MathWorkingWorkspace').then((m) => m.MathWorkingWorkspace),
  {
    ssr: false,
    loading: () => (
      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-600">
        Loading mathematical working workspace…
      </div>
    ),
  },
);

const KEYPAD_KEYS: Array<{ label: string; insert: string; aria: string }> = [
  { label: 'x', insert: 'x', aria: 'Insert variable x' },
  { label: 'y', insert: 'y', aria: 'Insert variable y' },
  { label: '^', insert: '^', aria: 'Insert exponent power' },
  { label: '√()', insert: 'sqrt()', aria: 'Insert square root' },
  { label: '/', insert: '/', aria: 'Insert fraction slash' },
  { label: '(', insert: '(', aria: 'Insert opening bracket' },
  { label: ')', insert: ')', aria: 'Insert closing bracket' },
  { label: 'π', insert: 'π', aria: 'Insert pi' },
  { label: '|x|', insert: '|x|', aria: 'Insert absolute value' },
  { label: '≤', insert: '<=', aria: 'Insert less than or equal to' },
  { label: '≥', insert: '>=', aria: 'Insert greater than or equal to' },
  { label: '≠', insert: '!=', aria: 'Insert not equal to' },
  { label: '∞', insert: 'inf', aria: 'Insert infinity' },
  { label: '∪', insert: ' U ', aria: 'Insert set union' },
];

export function MathEvaluatorEngine({ config }: { config: MathEvaluatorInteractiveConfig }) {
  if (config.mode === 'multi-step-working') {
    return <LazyMathWorkingWorkspace config={config} />;
  }
  return <SingleAnswerMathEvaluator config={config} />;
}

function SingleAnswerMathEvaluator({
  config,
}: {
  config: Exclude<MathEvaluatorInteractiveConfig, { mode: 'multi-step-working' }>;
}) {
  const [expr, setExpr] = useState('');
  const [unit, setUnit] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [result, setResult] = useState<MathEvalResult | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const allowedVars =
    config.mode === 'algebraic-expression'
      ? config.variables
      : config.mode === 'equation-solution' || config.mode === 'inequality-interval' || config.mode === 'calculus-check'
        ? [config.variable]
        : [];

  const showPreview =
    config.mode === 'numeric-quantity' ||
    config.mode === 'algebraic-expression' ||
    config.mode === 'calculus-check';

  const insertAtCursor = (snippet: string) => {
    const el = inputRef.current;
    if (!el) {
      setExpr((prev) => prev + snippet);
      return;
    }
    const start = el.selectionStart ?? expr.length;
    const end = el.selectionEnd ?? expr.length;
    const next = expr.slice(0, start) + snippet + expr.slice(end);
    setExpr(next);
    setResult(null);
    const cursorPos = snippet.endsWith('()') ? start + snippet.length - 1 : start + snippet.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const backspaceAtCursor = () => {
    const el = inputRef.current;
    if (!el) {
      setExpr((prev) => prev.slice(0, -1));
      return;
    }
    const start = el.selectionStart ?? expr.length;
    const end = el.selectionEnd ?? expr.length;
    if (start !== end) {
      setExpr(expr.slice(0, start) + expr.slice(end));
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start, start);
      });
    } else if (start > 0) {
      setExpr(expr.slice(0, start - 1) + expr.slice(start));
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start - 1, start - 1);
      });
    }
    setResult(null);
  };

  const handleCheck = () => {
    const res = evaluateMathSubmission(config, {
      expression: expr,
      unit: unit || undefined,
      domainInput: domainInput || undefined,
      rootsInput: config.mode === 'equation-solution' ? expr : undefined,
    });
    setResult(res);
  };

  const handleReset = () => {
    setExpr('');
    setUnit('');
    setDomainInput('');
    setResult(null);
  };

  const placeholder =
    config.mode === 'equation-solution'
      ? `e.g. 2, 3 (or "no solution")`
      : config.mode === 'inequality-interval'
        ? `e.g. (-inf, -2) U [5, inf) or x < -2 or x >= 5`
        : config.mode === 'calculus-check' && config.calculusKind === 'antiderivative' && config.requireConstantOfIntegration
          ? `e.g. x^4 - x^2 + C`
          : `Enter your mathematical answer...`;

  return (
    <section
      aria-label={config.accessibilityLabel}
      data-interactive-engine="math-evaluator"
      data-math-mode={config.mode}
      data-interactive-id={config.id}
      className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-700">
              <Calculator className="h-3 w-3" />
              Math Evaluator
            </span>
            {config.subjectTag && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                {config.subjectTag}
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              Practice exploration (not graded mastery)
            </span>
          </div>
          <h3 className="mt-1.5 text-sm font-extrabold text-slate-900 sm:text-base">{config.title}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{config.instructions}</p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          aria-label="Reset answer"
          className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {config.promptMath && (
        <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-2 text-sm font-bold text-indigo-950">
          {config.promptMath}
        </div>
      )}

      {/* Primary Answer Row */}
      <div className="mt-3 flex flex-wrap items-end gap-2">
        <label className="min-w-[200px] flex-1 text-xs font-bold text-slate-700">
          <span>Your answer</span>
          <input
            ref={inputRef}
            type="text"
            value={expr}
            onChange={(e) => {
              setExpr(e.target.value);
              setResult(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCheck();
              }
            }}
            placeholder={placeholder}
            aria-label={`${config.title} answer input`}
            className="mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-mono text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        {config.mode === 'numeric-quantity' && config.unitSpec && (
          <label className="w-28 text-xs font-bold text-slate-700">
            <span>Unit</span>
            <input
              type="text"
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
                setResult(null);
              }}
              placeholder="e.g. m/s"
              aria-label={`${config.title} unit input`}
              className="mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-mono text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>
        )}
      </div>

      {(config.mode === 'algebraic-expression' || config.mode === 'calculus-check') &&
        config.domainRestrictions?.requireLearnerDomain && (
        <label className="mt-2 block text-xs font-bold text-slate-700">
          <span>Domain restriction (e.g. x != 3 or x &gt; 2)</span>
          <input
            type="text"
            value={domainInput}
            onChange={(e) => {
              setDomainInput(e.target.value);
              setResult(null);
            }}
            placeholder="e.g. x != 3"
            aria-label={`${config.title} domain restriction input`}
            className="mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-mono text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </label>
      )}

      {/* Zero-dependency AST live formatted preview */}
      {showPreview && (
        <MathPreview
          expression={expr}
          allowedVariables={allowedVars}
          allowConstantC={config.mode === 'calculus-check' && config.calculusKind === 'antiderivative'}
        />
      )}

      {/* Accessible Collapsible Math Keypad */}
      <div className="mt-2">
        <button
          type="button"
          onClick={() => setShowKeypad((v) => !v)}
          aria-expanded={showKeypad}
          className="min-h-[44px] rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          {showKeypad ? 'Hide math keypad' : 'Show math keypad'}
        </button>
        {showKeypad && (
          <div className="mt-2 flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-2">
            {KEYPAD_KEYS.map((k) => (
              <button
                key={k.label}
                type="button"
                aria-label={k.aria}
                onClick={() => insertAtCursor(k.insert)}
                className="min-h-[44px] min-w-[44px] rounded-lg border border-slate-300 bg-white px-2.5 text-sm font-bold text-slate-800 hover:bg-indigo-50"
              >
                {k.label}
              </button>
            ))}
            <button
              type="button"
              aria-label="Backspace"
              onClick={backspaceAtCursor}
              className="min-h-[44px] min-w-[44px] rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-800 hover:bg-rose-100"
            >
              ⌫
            </button>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCheck}
          className="min-h-[44px] rounded-xl bg-indigo-600 px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Check answer
        </button>
      </div>

      {/* Colour-Independent 8-Verdict Diagnostic Feedback */}
      {result && (
        <div
          role="status"
          aria-live="polite"
          data-math-verdict={result.verdict}
          className={`mt-3 flex items-start gap-2 rounded-xl border p-3 text-xs font-semibold ${
            result.passed
              ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
              : result.verdict === 'syntax-error' || result.verdict === 'unsupported-or-indeterminate'
                ? 'border-amber-300 bg-amber-50 text-amber-950'
                : 'border-rose-300 bg-rose-50 text-rose-950'
          }`}
        >
          {result.passed ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>
            {result.feedback}
            {result.passed && config.successExplanation ? ` ${config.successExplanation}` : ''}
          </span>
        </div>
      )}

      {/* Progressive Hints */}
      {config.hints && config.hints.length > 0 && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowHints((v) => !v)}
            aria-expanded={showHints}
            className="inline-flex min-h-[36px] items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {showHints ? 'Hide hint' : 'Need a hint?'}
          </button>
          {showHints && (
            <ul className="mt-1.5 list-disc space-y-1 rounded-xl border border-indigo-200 bg-indigo-50/60 py-2 pl-6 pr-3 text-xs text-indigo-950">
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
