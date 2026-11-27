'use client';

import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  HelpCircle,
  Layers,
  RotateCcw,
  Undo2,
  XCircle,
} from 'lucide-react';
import type { SortClassifyInteractiveConfig } from '@/lib/narrated-lessons/interactive-schema';
import {
  evaluateCategoryBins,
  evaluateClozeTiles,
  evaluateOrderSequence,
  evaluatePairMatching,
  type SortClassifyEvalResult,
} from '@/lib/sort-classify/sort-classify-engine';

export function SortClassifyEngine({ config }: { config: SortClassifyInteractiveConfig }) {
  // Mode 1: Category Bins state
  const [binAssignments, setBinAssignments] = useState<Record<string, string[]>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    config.mode === 'category-bins' ? config.items[0]?.id ?? null : null,
  );

  // Mode 2: Pair Matching state
  const [pairs, setPairs] = useState<Array<{ leftId: string; rightId: string }>>([]);
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(
    config.mode === 'pair-matching' ? config.leftItems[0]?.id ?? null : null,
  );

  // Mode 3: Cloze Tiles state
  const [blanksFilled, setBlanksFilled] = useState<Record<string, string | null>>({});
  const [selectedBlankId, setSelectedBlankId] = useState<string | null>(
    config.mode === 'cloze-tiles' ? config.blanks[0]?.id ?? null : null,
  );

  // Mode 4: Order Sequence state
  const [orderIds, setOrderIds] = useState<string[]>(
    config.mode === 'order-sequence' ? config.items.map((it) => it.id) : [],
  );

  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<SortClassifyEvalResult | null>(null);
  const [showHints, setShowHints] = useState(false);

  const snapshot = () =>
    JSON.stringify({ binAssignments, pairs, blanksFilled, orderIds });

  const pushHistory = () => {
    setHistory((h) => [...h.slice(-24), snapshot()]);
    setResult(null);
  };

  const handleUndo = () => {
    const prev = history[history.length - 1];
    if (!prev) return;
    const parsed = JSON.parse(prev) as {
      binAssignments: Record<string, string[]>;
      pairs: Array<{ leftId: string; rightId: string }>;
      blanksFilled: Record<string, string | null>;
      orderIds: string[];
    };
    setBinAssignments(parsed.binAssignments);
    setPairs(parsed.pairs);
    setBlanksFilled(parsed.blanksFilled);
    setOrderIds(parsed.orderIds);
    setHistory((h) => h.slice(0, -1));
    setResult(null);
  };

  const handleReset = () => {
    setBinAssignments({});
    setPairs([]);
    setBlanksFilled({});
    setOrderIds(config.mode === 'order-sequence' ? config.items.map((it) => it.id) : []);
    setHistory([]);
    setResult(null);
  };

  const handleCheck = () => {
    if (config.mode === 'category-bins') {
      setResult(evaluateCategoryBins(config, binAssignments));
    } else if (config.mode === 'pair-matching') {
      setResult(evaluatePairMatching(config, pairs));
    } else if (config.mode === 'cloze-tiles') {
      setResult(evaluateClozeTiles(config, blanksFilled));
    } else {
      setResult(evaluateOrderSequence(config, orderIds));
    }
  };

  const toggleItemInBin = (itemId: string, binId: string) => {
    if (config.mode !== 'category-bins') return;
    pushHistory();
    setBinAssignments((prev) => {
      const cur = prev[itemId] ?? [];
      if (config.allowMultipleBinsPerItem) {
        const next = cur.includes(binId) ? cur.filter((b) => b !== binId) : [...cur, binId];
        return { ...prev, [itemId]: next };
      }
      return { ...prev, [itemId]: cur[0] === binId ? [] : [binId] };
    });
  };

  const togglePair = (leftId: string, rightId: string) => {
    if (config.mode !== 'pair-matching') return;
    pushHistory();
    setPairs((prev) => {
      const exists = prev.some((p) => p.leftId === leftId && p.rightId === rightId);
      if (exists) return prev.filter((p) => !(p.leftId === leftId && p.rightId === rightId));
      if (config.allowManyToMany) return [...prev, { leftId, rightId }];
      return [...prev.filter((p) => p.leftId !== leftId && p.rightId !== rightId), { leftId, rightId }];
    });
  };

  const assignTokenToBlank = (blankId: string, tokenId: string) => {
    if (config.mode !== 'cloze-tiles') return;
    pushHistory();
    setBlanksFilled((prev) => {
      const next = { ...prev };
      if (!config.reusableTokens) {
        for (const k of Object.keys(next)) {
          if (next[k] === tokenId) next[k] = null;
        }
      }
      next[blankId] = next[blankId] === tokenId ? null : tokenId;
      return next;
    });
  };

  const moveOrderItem = (idx: number, delta: -1 | 1) => {
    const target = idx + delta;
    if (target < 0 || target >= orderIds.length) return;
    pushHistory();
    setOrderIds((prev) => {
      const copy = [...prev];
      const tmp = copy[idx];
      copy[idx] = copy[target];
      copy[target] = tmp;
      return copy;
    });
  };

  return (
    <section
      aria-label={config.accessibilityLabel}
      data-interactive-engine="sort-classify"
      data-sort-mode={config.mode}
      data-interactive-id={config.id}
      className="mt-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-700">
              <Layers className="h-3 w-3" />
              Sort &amp; Classify
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

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={history.length === 0}
            onClick={handleUndo}
            aria-label="Undo last change"
            className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Undo
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset activity"
            className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* MODE 1: CATEGORY BINS */}
      {config.mode === 'category-bins' && (
        <div className="mt-3 space-y-3 text-xs">
          <p className="font-bold text-slate-700">
            1. Select an item, then choose its target category
            {config.allowMultipleBinsPerItem ? ' (overlapping sets enabled — select all sets it belongs to)' : ''}:
          </p>
          <div className="flex flex-wrap gap-2">
            {config.items.map((item) => {
              const assigned = binAssignments[item.id] ?? [];
              const diag = result?.itemDiagnostics[item.id];
              const isSel = selectedItemId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSel}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`min-h-[44px] rounded-xl border px-3 py-1.5 font-bold transition ${
                    isSel
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-300'
                      : diag === 'correct'
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                        : diag === 'incorrect'
                          ? 'border-rose-400 bg-rose-50 text-rose-900'
                          : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                  {assigned.length > 0 && (
                    <span className="ml-1.5 rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] text-indigo-800">
                      {assigned.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {config.bins.map((bin) => {
              const itemsInBin = config.items.filter((it) => (binAssignments[it.id] ?? []).includes(bin.id));
              return (
                <div key={bin.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-extrabold text-slate-900">{bin.label}</p>
                      {bin.description && <p className="text-[11px] text-slate-500">{bin.description}</p>}
                    </div>
                    <button
                      type="button"
                      disabled={!selectedItemId}
                      onClick={() => selectedItemId && toggleItemInBin(selectedItemId, bin.id)}
                      aria-label={`Assign selected item to ${bin.label}`}
                      className="min-h-[44px] rounded-lg bg-indigo-600 px-3 text-[11px] font-bold text-white hover:bg-indigo-700 disabled:opacity-40"
                    >
                      {selectedItemId && (binAssignments[selectedItemId] ?? []).includes(bin.id)
                        ? 'Remove'
                        : 'Place here'}
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {itemsInBin.length === 0 ? (
                      <span className="text-[11px] italic text-slate-400">No items placed yet</span>
                    ) : (
                      itemsInBin.map((it) => (
                        <span
                          key={it.id}
                          className="rounded-lg border border-indigo-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-800"
                        >
                          {it.label}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: PAIR MATCHING */}
      {config.mode === 'pair-matching' && (
        <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
          <div className="space-y-2">
            <p className="font-bold text-slate-700">1. Select Left Item:</p>
            {config.leftItems.map((l) => {
              const linked = pairs.filter((p) => p.leftId === l.id).length;
              return (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={selectedLeftId === l.id}
                  onClick={() => setSelectedLeftId(l.id)}
                  className={`flex min-h-[44px] w-full items-center justify-between rounded-xl border px-3 py-2 text-left font-bold ${
                    selectedLeftId === l.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950'
                      : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{l.label}</span>
                  {linked > 0 && (
                    <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] text-indigo-800">
                      {linked} linked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="space-y-2">
            <p className="font-bold text-slate-700">
              2. Link to Right Target{config.allowManyToMany ? ' (many-to-many enabled)' : ''}:
            </p>
            {config.rightItems.map((r) => {
              const isLinkedToSel = Boolean(
                selectedLeftId && pairs.some((p) => p.leftId === selectedLeftId && p.rightId === r.id),
              );
              return (
                <button
                  key={r.id}
                  type="button"
                  disabled={!selectedLeftId}
                  onClick={() => selectedLeftId && togglePair(selectedLeftId, r.id)}
                  aria-label={`Link to ${r.label}`}
                  className={`flex min-h-[44px] w-full items-center justify-between rounded-xl border px-3 py-2 text-left font-bold ${
                    isLinkedToSel
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                      : 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span>{r.label}</span>
                  <span className="text-[11px]">{isLinkedToSel ? 'Linked ✓' : 'Link'}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 3: CLOZE TILES */}
      {config.mode === 'cloze-tiles' && (
        <div className="mt-3 space-y-3 text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-900">
            {config.template.split(/(\{\{[^}]+\}\})/g).map((seg, i) => {
              const m = /^\{\{([^}]+)\}\}$/.exec(seg);
              if (!m) return <span key={i}>{seg}</span>;
              const blankId = m[1];
              const tokId = blanksFilled[blankId];
              const tokLabel = config.tokens.find((t) => t.id === tokId)?.label;
              const isSel = selectedBlankId === blankId;
              return (
                <button
                  key={blankId}
                  type="button"
                  aria-label={`Select blank ${blankId}`}
                  onClick={() => setSelectedBlankId(blankId)}
                  className={`mx-1 inline-flex min-h-[36px] items-center rounded-lg border px-2.5 py-0.5 text-xs font-extrabold ${
                    isSel
                      ? 'border-indigo-600 bg-indigo-100 text-indigo-950'
                      : tokLabel
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                        : 'border-dashed border-slate-400 bg-white text-slate-500'
                  }`}
                >
                  {tokLabel ?? `[ ${blankId} ]`}
                </button>
              );
            })}
          </div>
          <div>
            <p className="font-bold text-slate-700">
              Token Bank{config.reusableTokens ? ' (tokens may be reused)' : ' (each token used once)'}:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {config.tokens.map((tok) => (
                <button
                  key={tok.id}
                  type="button"
                  disabled={!selectedBlankId}
                  onClick={() => selectedBlankId && assignTokenToBlank(selectedBlankId, tok.id)}
                  className="min-h-[44px] rounded-xl border border-indigo-200 bg-white px-3 py-1.5 font-bold text-indigo-900 hover:bg-indigo-50 disabled:opacity-40"
                >
                  {tok.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: ORDER SEQUENCE */}
      {config.mode === 'order-sequence' && (
        <div className="mt-3 space-y-2 text-xs">
          {orderIds.map((id, idx) => {
            const item = config.items.find((it) => it.id === id);
            if (!item) return null;
            return (
              <div
                key={id}
                className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5"
              >
                <span className="font-bold text-slate-900">
                  {idx + 1}. {item.label}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    aria-label={`Move ${item.label} up`}
                    onClick={() => moveOrderItem(idx, -1)}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === orderIds.length - 1}
                    aria-label={`Move ${item.label} down`}
                    onClick={() => moveOrderItem(idx, 1)}
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Bar */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCheck}
          className="min-h-[44px] rounded-xl bg-indigo-600 px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Check classification
        </button>
      </div>

      {/* Colour-Independent Feedback */}
      {result && (
        <div
          role="status"
          aria-live="polite"
          data-sort-feedback={result.passed ? 'passed' : 'needs-work'}
          className={`mt-3 flex items-start gap-2 rounded-xl border p-3 text-xs font-semibold ${
            result.passed
              ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
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
