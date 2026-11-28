'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Database,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Terminal,
  XCircle,
} from 'lucide-react';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import type { CodePlaygroundInteractiveConfig } from '@/lib/narrated-lessons/interactive-schema';
import {
  getWorkshopActivitiesForLesson,
  type InlineWorkshopActivity,
} from '@/lib/narrated-lessons/ch11-workshop-activities';
import { getCh10ActivitiesForLesson } from '@/lib/narrated-lessons/ch10-boolean-activities';
import { runPseudocode } from '@/lib/pseudocode-runner';
import { outputMatches, preparePython, runPython } from '@/lib/python-runner';
import { executeIgcseSql, type SqlExecutionResult } from '@/lib/sql-practice/igcse-sql-engine';
import { storedSchoolFor } from '@/lib/session-school';

type PlaygroundMode = 'pseudocode' | 'python' | 'sql';

interface InlineCodePlaygroundProps {
  lesson: NarratedLesson;
  slideId?: string;
  interactiveConfig?: CodePlaygroundInteractiveConfig;
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

function starterForSandbox(lesson: NarratedLesson, mode: PlaygroundMode): { code: string; stdin: string } {
  const id = (lesson.lessonId || '').toLowerCase();
  if (mode === 'sql') {
    if (id.includes('boolean-logic')) {
      return {
        code: '-- Enrichment only (isolated Sensors table: id, a, b)\nSELECT id\nFROM Sensors\nWHERE a = 1 AND b = 1\nORDER BY id;',
        stdin: '',
      };
    }
    if (id.includes('scenarios-b')) {
      return {
        code: 'SELECT Product, PricePesewas, Quantity\nFROM Sales;',
        stdin: '',
      };
    }
    if (id.includes('databases-b')) {
      return {
        code: 'SELECT ItemName, Price\nFROM Stock\nWHERE Quantity < 6\nORDER BY Price DESC;',
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

function starterForActivity(activity: InlineWorkshopActivity, mode: PlaygroundMode): { code: string; stdin: string } {
  const sampleStdin = activity.publicTests[0]?.stdin ?? '';
  if (mode === 'python') {
    return { code: activity.pythonStarter ?? '# Write your Python solution here.\n', stdin: sampleStdin };
  }
  if (mode === 'pseudocode') {
    return {
      code: activity.pseudocodeStarter ?? '// Write your Cambridge 0478 pseudocode here.\n',
      stdin: sampleStdin,
    };
  }
  return { code: activity.sqlStarter ?? '-- Write your SELECT query here.\nSELECT ', stdin: '' };
}

export interface InlineCodeDraftScope {
  userId?: string | null;
  schoolId?: string | null;
}

/**
 * Resolves isolated browser storage for student programming drafts (zero Firestore writes):
 * - Authenticated user: `localStorage` scoped strictly by `schoolId` + `userId` so
 *   students on shared school computers never see another student's drafts.
 * - Unauthenticated / public preview: tab-scoped `sessionStorage` (cleared when tab closes),
 *   never written to shared `localStorage`.
 */
export function resolveInlineCodeDraftStorage(
  lessonId: string,
  activityId: string,
  mode: PlaygroundMode,
  explicitScope?: InlineCodeDraftScope
): { storage: Storage | null; key: string; scopedToUser: boolean } {
  let uid = explicitScope?.userId ?? null;
  let schoolId = explicitScope?.schoolId ?? null;

  if (typeof window !== 'undefined') {
    if (!uid) {
      try {
        uid = window.sessionStorage.getItem('gam_cached_uid');
      } catch {
        uid = null;
      }
    }
    if (uid && !schoolId) {
      schoolId = storedSchoolFor(uid);
    }
    if (uid) {
      return {
        storage: window.localStorage,
        key: `gam:inline-code:v2:${schoolId || 'unassigned'}:${uid}:${lessonId}:${activityId}:${mode}`,
        scopedToUser: true,
      };
    }
    return {
      storage: window.sessionStorage,
      key: `gam:inline-code:v2:session:${lessonId}:${activityId}:${mode}`,
      scopedToUser: false,
    };
  }

  return {
    storage: null,
    key: `gam:inline-code:v2:session:${lessonId}:${activityId}:${mode}`,
    scopedToUser: false,
  };
}

export function InlineCodePlayground({ lesson, slideId, interactiveConfig }: InlineCodePlaygroundProps) {
  const enabled = useMemo(
    () => Boolean(interactiveConfig) || isComputerScienceLesson(lesson),
    [interactiveConfig, lesson]
  );
  const lessonActivities = useMemo<InlineWorkshopActivity[]>(() => {
    if (interactiveConfig) {
      return [
        {
          id: interactiveConfig.id,
          lessonId: lesson.lessonId,
          afterSlideId: slideId ?? 's01',
          title: interactiveConfig.title,
          task: interactiveConfig.instructions,
          languages: interactiveConfig.languages,
          pythonStarter: interactiveConfig.pythonStarter ?? '',
          pseudocodeStarter: interactiveConfig.pseudocodeStarter ?? '',
          sqlStarter: interactiveConfig.sqlStarter ?? '',
          publicTests: interactiveConfig.publicTests ?? [],
        },
      ];
    }
    const ch11 = getWorkshopActivitiesForLesson(lesson.lessonId);
    const ch10: InlineWorkshopActivity[] = getCh10ActivitiesForLesson(lesson.lessonId).map((a) => ({
      id: a.id,
      lessonId: a.lessonId,
      afterSlideId: a.afterSlideId,
      title: a.title,
      task: a.task,
      languages: ['pseudocode', 'python', 'sql'],
      pythonStarter: a.pythonStarter,
      pseudocodeStarter: a.pseudocodeStarter,
      sqlStarter: a.sqlStarter,
      publicTests: [a.publicSample],
    }));
    return [...ch11, ...ch10];
  }, [interactiveConfig, lesson.lessonId, slideId]);
  const slideActivities = useMemo(
    () => (slideId ? lessonActivities.filter((a) => a.afterSlideId === slideId) : []),
    [lessonActivities, slideId]
  );

  const initialMode = useMemo<PlaygroundMode>(
    () => interactiveConfig?.languages[0] ?? defaultModeForLesson(lesson),
    [interactiveConfig, lesson]
  );
  const [open, setOpen] = useState(Boolean(interactiveConfig));
  const [activeActivityId, setActiveActivityId] = useState<string>(interactiveConfig?.id ?? 'sandbox');
  const [mode, setMode] = useState<PlaygroundMode>(initialMode);
  const [code, setCode] = useState<string>(() => starterForSandbox(lesson, initialMode).code);
  const [stdinText, setStdinText] = useState<string>(() => starterForSandbox(lesson, initialMode).stdin);
  const [running, setRunning] = useState(false);
  const [pyStatus, setPyStatus] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle');
  const [textOutput, setTextOutput] = useState<string[]>([]);
  const [sqlResult, setSqlResult] = useState<SqlExecutionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [checkBanner, setCheckBanner] = useState<{ passed: boolean; message: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const activeActivity = useMemo(
    () => lessonActivities.find((a) => a.id === activeActivityId) ?? null,
    [lessonActivities, activeActivityId]
  );

  // When navigating onto a slide with a mapped workshop activity, select it automatically
  useEffect(() => {
    if (slideActivities.length > 0) {
      const target = slideActivities[0];
      const nextMode: PlaygroundMode = target.languages.includes('python')
        ? 'python'
        : target.languages[0] ?? initialMode;
      setActiveActivityId(target.id);
      setMode(nextMode);
    }
  }, [slideId, slideActivities, initialMode]);

  // Load saved draft or starter whenever activity or mode changes
  useEffect(() => {
    const starter = activeActivity
      ? starterForActivity(activeActivity, mode)
      : starterForSandbox(lesson, mode);
    let saved: string | null = null;
    try {
      const target = resolveInlineCodeDraftStorage(lesson.lessonId, activeActivityId, mode);
      saved = target.storage ? target.storage.getItem(target.key) : null;
    } catch {
      // ignore storage errors
    }
    setCode(saved ?? starter.code);
    setStdinText(starter.stdin);
    setTextOutput([]);
    setSqlResult(null);
    setErrorMsg(null);
    setCheckBanner(null);
    setConfirmReset(false);
  }, [lesson, activeActivity, activeActivityId, mode]);

  // Pre-warm Pyodide Web Worker as soon as the learner opens Python mode
  useEffect(() => {
    if (!open || mode !== 'python') return;
    if (pyStatus === 'ready' || pyStatus === 'loading') return;
    let alive = true;
    setPyStatus('loading');
    preparePython()
      .then(() => {
        if (alive) setPyStatus('ready');
      })
      .catch(() => {
        if (alive) setPyStatus('failed');
      });
    return () => {
      alive = false;
    };
  }, [open, mode, pyStatus]);

  // Persist learner draft scoped to student + school (or tab-only sessionStorage if anonymous)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const target = resolveInlineCodeDraftStorage(lesson.lessonId, activeActivityId, mode);
        target.storage?.setItem(target.key, code);
      } catch {
        // ignore storage errors
      }
    }, 400);
    return () => clearTimeout(t);
  }, [lesson.lessonId, activeActivityId, mode, code]);

  if (!enabled) return null;

  const availableModes: PlaygroundMode[] = activeActivity
    ? activeActivity.languages
    : ['pseudocode', 'python', 'sql'];

  const handleSelectActivity = (actId: string) => {
    setActiveActivityId(actId);
    const found = lessonActivities.find((a) => a.id === actId);
    if (found) {
      if (!found.languages.includes(mode)) {
        setMode(found.languages[0]);
      }
    }
  };

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setTextOutput([]);
    setSqlResult(null);
    setErrorMsg(null);
    setCheckBanner(null);

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
        setPyStatus((prev) => (prev === 'ready' ? 'ready' : 'loading'));
        const res = await runPython(code, {
          stdin: stdinText,
          strictInput: true,
          timeoutMs: 10000,
        });
        if (res.ok) {
          setPyStatus('ready');
          const lines = res.output ? res.output.split('\n') : [];
          setTextOutput(lines.length > 0 ? lines : ['(Program finished with no output)']);
        } else {
          if (/could not start|failed to load|too long to load/i.test(res.error || '')) {
            setPyStatus('failed');
          } else {
            setPyStatus('ready');
          }
          setErrorMsg(res.error || 'Python execution error.');
        }
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unexpected execution error.');
    } finally {
      setRunning(false);
    }
  };

  const handleCheck = async () => {
    if (!activeActivity || running) return;
    if (mode === 'pseudocode') {
      await handleRun();
      setCheckBanner({
        passed: false,
        message:
          activeActivity.pseudocodeNote ||
          'Pseudocode runs live for testing, and is marked by teacher review (Python sample stdout tests are not applied blindly to pseudocode).',
      });
      return;
    }

    setRunning(true);
    setTextOutput([]);
    setSqlResult(null);
    setErrorMsg(null);
    setCheckBanner(null);

    try {
      if (mode === 'sql') {
        const res = executeIgcseSql(code);
        if (!res.ok) {
          setErrorMsg(res.error || 'SQL syntax error.');
          return;
        }
        setSqlResult(res);
        if (activeActivity.expectedSqlRows) {
          const actual = JSON.stringify(res.rows);
          const expected = JSON.stringify(activeActivity.expectedSqlRows);
          if (actual === expected) {
            setCheckBanner({ passed: true, message: 'Sample SQL check passed!' });
          } else {
            setCheckBanner({
              passed: false,
              message: `Returned ${res.rows.length} row(s), which did not match the expected result yet. Check your SELECT/WHERE clause.`,
            });
          }
        }
        return;
      }

      // Python check against visible publicTests
      const tests = activeActivity.publicTests;
      if (!tests.length) {
        await handleRun();
        return;
      }
      for (let idx = 0; idx < tests.length; idx++) {
        const t = tests[idx];
        const res = await runPython(code, {
          stdin: t.stdin,
          strictInput: true,
          timeoutMs: 10000,
        });
        if (!res.ok) {
          setErrorMsg(res.error || 'Runtime error during sample check.');
          setCheckBanner({ passed: false, message: `Sample test ${idx + 1} raised an error.` });
          return;
        }
        const lines = res.output ? res.output.split('\n') : [];
        setTextOutput(lines);
        if (!outputMatches(res.output, t.expectedStdout)) {
          setCheckBanner({
            passed: false,
            message: `Sample test ${idx + 1} failed. Expected "${t.expectedStdout}", got "${res.output.trim()}".`,
          });
          return;
        }
      }
      setCheckBanner({
        passed: true,
        message: `Passed all ${tests.length} public sample test(s)!`,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Check failed.');
    } finally {
      setRunning(false);
    }
  };

  const handleConfirmedReset = () => {
    const s = activeActivity
      ? starterForActivity(activeActivity, mode)
      : starterForSandbox(lesson, mode);
    setCode(s.code);
    setStdinText(s.stdin);
    setTextOutput([]);
    setSqlResult(null);
    setErrorMsg(null);
    setCheckBanner(null);
    setConfirmReset(false);
    try {
      const target = resolveInlineCodeDraftStorage(lesson.lessonId, activeActivityId, mode);
      target.storage?.removeItem(target.key);
    } catch {
      // ignore
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
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
            {mode === 'sql' ? <Database className="h-4 w-4" /> : <Terminal className="h-4 w-4" />}
          </span>
          <span className="text-xs font-extrabold text-white">
            {slideActivities.length > 0
              ? `Workshop Activity: ${slideActivities[0].title}`
              : 'Try It Live — Run Pseudocode, Python & SQL right here'}
          </span>
          {slideActivities.length > 0 && (
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              {slideActivities.length} task{slideActivities.length > 1 ? 's' : ''} for this slide
            </span>
          )}
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 shrink-0">
          {open ? 'Hide' : 'Open Runner'}
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {open && (
        <div className="border-t border-slate-800 p-3.5 space-y-3">
          {/* Workshop Index (when lesson has mapped activities) */}
          {lessonActivities.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                Workshop:
              </span>
              {lessonActivities.map((act) => {
                const isSlideMatch = slideId && act.afterSlideId === slideId;
                const isSelected = activeActivityId === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => handleSelectActivity(act.id)}
                    className={`rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                      isSelected
                        ? 'bg-sky-700 text-white'
                        : isSlideMatch
                          ? 'border border-emerald-500/50 bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/50'
                          : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {act.title} ({act.afterSlideId})
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => handleSelectActivity('sandbox')}
                className={`rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                  activeActivityId === 'sandbox'
                    ? 'bg-sky-700 text-white'
                    : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Free Sandbox
              </button>
            </div>
          )}

          {/* Active Activity Instructions & Public Sample */}
          {activeActivity && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-white">{activeActivity.title}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  Mapped to slide {activeActivity.afterSlideId}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{activeActivity.task}</p>
              {activeActivity.publicTests.length > 0 && (
                <div className="mt-1.5 grid gap-2 sm:grid-cols-2 text-[11px] font-mono">
                  <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
                    <span className="block text-[10px] font-sans font-bold text-slate-400">Sample Input</span>
                    <pre className="whitespace-pre-wrap text-sky-300">{activeActivity.publicTests[0].stdin}</pre>
                  </div>
                  <div className="rounded-lg bg-slate-950/80 p-2 border border-slate-800">
                    <span className="block text-[10px] font-sans font-bold text-slate-400">Expected Output</span>
                    <pre className="whitespace-pre-wrap text-emerald-300">{activeActivity.publicTests[0].expectedStdout}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode Tabs + Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex rounded-xl border border-slate-800 bg-slate-900 p-0.5">
              {availableModes.map((tabId) => (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => setMode(tabId)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                    mode === tabId
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tabId === 'pseudocode' ? 'Pseudocode' : tabId === 'python' ? 'Python 3' : 'SQL'}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
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
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-950/60 px-2 py-0.5 text-[11px] text-amber-200">
                  Reset code?
                  <button
                    type="button"
                    onClick={handleConfirmedReset}
                    className="font-bold text-amber-300 underline hover:text-white"
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                </span>
              )}
              {mode === 'python' && pyStatus === 'loading' && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 px-2 py-1 text-[11px] font-semibold text-amber-200">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading Python 3...
                </span>
              )}
              {mode === 'python' && pyStatus === 'ready' && (
                <span className="hidden sm:inline-flex items-center rounded-lg bg-emerald-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-300">
                  Python 3 ready
                </span>
              )}
              <button
                type="button"
                onClick={handleRun}
                disabled={running}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                {running ? (mode === 'python' && pyStatus === 'loading' ? 'Loading Python...' : 'Running...') : 'Run'}
              </button>
              {activeActivity && (
                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={running}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-sky-700 px-3 py-1 text-xs font-bold text-white hover:bg-sky-500 disabled:opacity-60"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Check
                </button>
              )}
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
                ? 'SELECT SUM(Quantity) FROM Sales;'
                : mode === 'python'
                  ? 'print("Hello IGCSE!")'
                  : 'OUTPUT "Hello IGCSE!"'
            }
          />

          {/* Program Input */}
          {mode !== 'sql' && (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-400">
                Program Input (one value per line for {mode === 'pseudocode' ? 'INPUT' : 'input()'}):
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
              Isolated tables: <code className="text-sky-300">Sales</code> (Product, PricePesewas, Quantity),{' '}
              <code className="text-sky-300">Sensors</code> (id, a, b),{' '}
              <code className="text-sky-300">Stock</code>, <code className="text-sky-300">Equipment</code>,{' '}
              <code className="text-sky-300">Weather</code> (read-only).
            </p>
          )}

          {/* Check Feedback */}
          {checkBanner && (
            <div
              className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-xs font-medium ${
                checkBanner.passed
                  ? 'border-emerald-500/40 bg-emerald-950/50 text-emerald-200'
                  : 'border-amber-500/40 bg-amber-950/50 text-amber-200'
              }`}
            >
              {checkBanner.passed ? (
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
              ) : (
                <XCircle className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
              )}
              <span>{checkBanner.message}</span>
            </div>
          )}

          {/* Error Display */}
          {errorMsg && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-950/50 px-3 py-2 font-mono text-xs text-rose-200">
              {errorMsg}
            </div>
          )}

          {/* Text Output */}
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
