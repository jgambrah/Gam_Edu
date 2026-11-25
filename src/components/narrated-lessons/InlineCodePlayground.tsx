'use client';

import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Code2,
  Database,
  Loader2,
  Play,
  RotateCcw,
  Terminal,
} from 'lucide-react';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import { runPseudocode } from '@/lib/pseudocode-runner';
import { runPython } from '@/lib/python-runner';
import { executeIgcseSql, type SqlExecutionResult } from '@/lib/sql-practice/igcse-sql-engine';

type PlaygroundMode = 'pseudocode' | 'python' | 'sql';

interface InlineCodePlaygroundProps {
  lesson: NarratedLesson;
}

function isComputerScienceLesson(lesson: NarratedLesson): boolean {
  const id = (lesson.lessonId || '').toLowerCase();
  const subject = (lesson.meta?.subject || '').toLowerCase();
  const topic = (lesson.meta?.topic || '').toLowerCase();
  return (
    subject.includes('computer science') ||
    id.includes('-cs-') ||
    topic.includes('programming') ||
    topic.includes('algorithm') ||
    topic.includes('database')
  );
}

function defaultModeForLesson(lesson: NarratedLesson): PlaygroundMode {
  const id = (lesson.lessonId || '').toLowerCase();
  const topic = (lesson.meta?.topic || '').toLowerCase();
  if (id.includes('database') || topic.includes('database')) return 'sql';
  return 'pseudocode';
}

function starterFor(lesson: NarratedLesson, mode: PlaygroundMode): { code: string; stdin: string } {
  const id = (lesson.lessonId || '').toLowerCase();
  if (mode === 'sql') {
    if (id.includes('databases-b')) {
      return {
        code: "SELECT ItemName, Price\nFROM Stock\nWHERE Quantity < 6\nORDER BY Price DESC;",
        stdin: '',
      };
    }
    return {
      code: 'SELECT ItemName, Price\nFROM Stock;',
      stdin: '',
    };
  }

  if (mode === 'python') {
    if (id.includes('programming-2')) {
      return {
        code: 'mark = int(input())\nif mark >= 50:\n    print("Pass")\nelse:\n    print("Retry")',
        stdin: '72',
      };
    }
    if (id.includes('programming-3')) {
      return {
        code: 'def area(w, h):\n    return w * h\n\nscores = [78, 92, 85]\nprint("Area:", area(6, 4))\nprint("Top score:", max(scores))',
        stdin: '',
      };
    }
    return {
      code: 'price = float(input())\nqty = int(input())\ntotal = price * qty\nprint("Total =", total)',
      stdin: '4.5\n3',
    };
  }

  // Cambridge IGCSE 0478 Pseudocode starters
  if (id.includes('programming-2')) {
    return {
      code: 'DECLARE Mark : INTEGER\nINPUT Mark\nIF Mark >= 50 THEN\n  OUTPUT "Pass"\nELSE\n  OUTPUT "Retry"\nENDIF',
      stdin: '72',
    };
  }
  if (id.includes('programming-3')) {
    return {
      code: 'FUNCTION Area(W : REAL, H : REAL) RETURNS REAL\n  RETURN W * H\nENDFUNCTION\n\nDECLARE Scores : ARRAY[1:3] OF INTEGER\nScores[1] ← 78\nScores[2] ← 92\nScores[3] ← 85\nOUTPUT "Area:", Area(6, 4)\nOUTPUT "Score[2]:", Scores[2]',
      stdin: '',
    };
  }
  return {
    code: 'DECLARE Price, Total : REAL\nDECLARE Qty : INTEGER\nINPUT Price\nINPUT Qty\nTotal ← Price * Qty\nOUTPUT "Total =", Total',
    stdin: '4.5\n3',
  };
}

export function InlineCodePlayground({ lesson }: InlineCodePlaygroundProps) {
  const enabled = useMemo(() => isComputerScienceLesson(lesson), [lesson]);
  const initialMode = useMemo(() => defaultModeForLesson(lesson), [lesson]);
  const initialStarter = useMemo(() => starterFor(lesson, initialMode), [lesson, initialMode]);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<PlaygroundMode>(initialMode);
  const [code, setCode] = useState<string>(initialStarter.code);
  const [stdinText, setStdinText] = useState<string>(initialStarter.stdin);
  const [running, setRunning] = useState(false);
  const [textOutput, setTextOutput] = useState<string[]>([]);
  const [sqlResult, setSqlResult] = useState<SqlExecutionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!enabled) return null;

  const switchMode = (nextMode: PlaygroundMode) => {
    setMode(nextMode);
    const s = starterFor(lesson, nextMode);
    setCode(s.code);
    setStdinText(s.stdin);
    setTextOutput([]);
    setSqlResult(null);
    setErrorMsg(null);
  };

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setTextOutput([]);
    setSqlResult(null);
    setErrorMsg(null);

    try {
      if (mode === 'pseudocode') {
        const res = runPseudocode(code, stdinText);
        if (res.ok) {
          setTextOutput(res.output.length > 0 ? res.output : ['(Program finished with no OUTPUT)']);
        } else {
          setErrorMsg(res.error || 'Pseudocode error.');
        }
      } else if (mode === 'sql') {
        const res = executeIgcseSql(code);
        if (res.ok) {
          setSqlResult(res);
        } else {
          setErrorMsg(res.error || 'SQL syntax error.');
        }
      } else {
        const res = await runPython(code, {
          stdin: stdinText,
          strictInput: true,
          timeoutMs: 10000,
        });
        if (res.ok) {
          const lines = res.output ? res.output.split('\n') : [];
          setTextOutput(lines.length > 0 ? lines : ['(Program finished with no output)']);
        } else {
          setErrorMsg(res.error || 'Python execution error.');
        }
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unexpected execution error.');
    } finally {
      setRunning(false);
    }
  };

  const insertArrow = () => {
    setCode((prev) => `${prev}${prev.endsWith(' ') || prev === '' ? '' : ' '}← `);
  };

  return (
    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-950 text-slate-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left transition hover:bg-slate-900"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
            {mode === 'sql' ? <Database className="h-4 w-4" /> : <Terminal className="h-4 w-4" />}
          </span>
          <div>
            <span className="text-xs font-extrabold text-white">
              Try It Live — Run Pseudocode, Python &amp; SQL right here
            </span>
            <span className="ml-2 hidden sm:inline text-[11px] text-slate-400">
              Type &amp; test code without leaving this slide
            </span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
          {open ? 'Hide' : 'Open Runner'}
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {open && (
        <div className="border-t border-slate-800 p-3.5 space-y-3">
          {/* Mode Tabs + Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900 p-0.5">
              {(
                [
                  { id: 'pseudocode', label: 'Pseudocode' },
                  { id: 'python', label: 'Python 3' },
                  { id: 'sql', label: 'SQL (Stock / Equipment)' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => switchMode(tab.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    mode === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {mode === 'pseudocode' && (
                <button
                  type="button"
                  onClick={insertArrow}
                  title="Insert Cambridge assignment arrow (or type <-)"
                  className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-mono font-bold text-sky-300 hover:bg-slate-800"
                >
                  + ←
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const s = starterFor(lesson, mode);
                  setCode(s.code);
                  setStdinText(s.stdin);
                  setTextOutput([]);
                  setSqlResult(null);
                  setErrorMsg(null);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
              >
                <RotateCcw className="h-3 w-3" />
                Example
              </button>
              <button
                type="button"
                onClick={handleRun}
                disabled={running}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                {running ? 'Running...' : 'Run'}
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleRun();
              }
            }}
            rows={6}
            spellCheck={false}
            aria-label="Inline code runner editor"
            className="w-full resize-y rounded-xl border border-slate-800 bg-slate-900/90 p-3 font-mono text-xs sm:text-sm text-emerald-200 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
            placeholder={
              mode === 'sql'
                ? 'SELECT ItemName, Price FROM Stock;'
                : mode === 'python'
                  ? 'print("Hello IGCSE!")'
                  : 'OUTPUT "Hello IGCSE!"'
            }
          />

          {/* Program Input (for Pseudocode INPUT / Python input()) */}
          {mode !== 'sql' && (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-400">
                Program Input (optional — one value per line for {mode === 'pseudocode' ? 'INPUT' : 'input()'}):
              </label>
              <textarea
                value={stdinText}
                onChange={(e) => setStdinText(e.target.value)}
                rows={2}
                spellCheck={false}
                placeholder="Type test inputs here, one per line..."
                className="w-full resize-y rounded-lg border border-slate-800 bg-slate-900/70 px-2.5 py-1.5 font-mono text-xs text-sky-200 placeholder:text-slate-600 focus:border-sky-500 focus:outline-none"
              />
            </div>
          )}

          {mode === 'sql' && (
            <p className="text-[11px] text-slate-400">
              Available tables: <code className="text-sky-300">Stock</code> (ItemID, ItemName, Colour, Quantity, Price, Ordered),{' '}
              <code className="text-sky-300">Equipment</code> (EquipmentID, EquipmentName, Quantity, Available),{' '}
              <code className="text-sky-300">Weather</code> (ReadingDate, ReadingTime, Temperature).
            </p>
          )}

          {/* Error Display */}
          {errorMsg && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-950/50 px-3 py-2 font-mono text-xs text-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Text Output (Pseudocode / Python) */}
          {textOutput.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-black/70 p-3">
              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <Code2 className="h-3 w-3 text-emerald-400" />
                Output
              </div>
              <pre className="whitespace-pre-wrap font-mono text-xs text-emerald-300">
                {textOutput.join('\n')}
              </pre>
            </div>
          )}

          {/* SQL Table Output */}
          {sqlResult && sqlResult.ok && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-black/60">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-900 text-sky-300">
                  <tr>
                    {sqlResult.columns.map((c, idx) => (
                      <th key={`${c}-${idx}`} className="border-b border-slate-800 px-3 py-1.5">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sqlResult.rows.length === 0 ? (
                    <tr>
                      <td colSpan={sqlResult.columns.length} className="px-3 py-2 text-slate-500 italic">
                        (0 rows returned)
                      </td>
                    </tr>
                  ) : (
                    sqlResult.rows.map((r, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-900">
                        {r.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3 py-1.5 text-slate-200">
                            {cell === null ? 'NULL' : String(cell)}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
