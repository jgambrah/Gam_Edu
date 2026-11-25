'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  Table2,
  Trophy,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CH9_TABLES, executeIgcseSql, type SqlExecutionResult } from '@/lib/sql-practice/igcse-sql-engine';
import {
  CH9_SQL_MISSIONS,
  checkCh9SqlMission,
  type Ch9SqlMission,
  type Ch9SqlPart,
} from '@/lib/sql-practice/ch9-sql-missions';

const STORAGE_KEY = 'gam:sql-lab:ch9:completed:v1';

export default function SqlLabPage() {
  const [selectedPart, setSelectedPart] = useState<Ch9SqlPart>('a');
  const [activeMissionId, setActiveMissionId] = useState<string>(CH9_SQL_MISSIONS[0].id);
  const [sql, setSql] = useState<string>(CH9_SQL_MISSIONS[0].starterSql);
  const [activeTable, setActiveTable] = useState<'Stock' | 'Equipment' | 'Weather'>('Stock');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<SqlExecutionResult | null>(null);
  const [feedback, setFeedback] = useState<{ passed: boolean; text: string } | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // Load saved progress & optional URL query params (?part=a|b|transfer or ?mission=...)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCompletedIds(parsed);
      }
    } catch {
      // ignore storage errors
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const missionParam = params.get('mission');
      const partParam = params.get('part') as Ch9SqlPart | null;
      if (missionParam) {
        const found = CH9_SQL_MISSIONS.find((m) => m.id === missionParam);
        if (found) {
          setSelectedPart(found.part);
          setActiveMissionId(found.id);
          setSql(found.starterSql);
          setActiveTable(found.table);
          return;
        }
      }
      if (partParam && (partParam === 'a' || partParam === 'b' || partParam === 'transfer')) {
        const firstInPart = CH9_SQL_MISSIONS.find((m) => m.part === partParam);
        if (firstInPart) {
          setSelectedPart(partParam);
          setActiveMissionId(firstInPart.id);
          setSql(firstInPart.starterSql);
          setActiveTable(firstInPart.table);
        }
      }
    } catch {
      // ignore URL parse errors
    }
  }, []);

  const activeMission: Ch9SqlMission = useMemo(
    () => CH9_SQL_MISSIONS.find((m) => m.id === activeMissionId) ?? CH9_SQL_MISSIONS[0],
    [activeMissionId]
  );

  const partMissions = useMemo(
    () => CH9_SQL_MISSIONS.filter((m) => m.part === selectedPart),
    [selectedPart]
  );

  const selectMission = (mission: Ch9SqlMission) => {
    setActiveMissionId(mission.id);
    setSelectedPart(mission.part);
    setSql(mission.starterSql);
    setActiveTable(mission.table);
    setShowHint(false);
    setResult(null);
    setFeedback(null);
  };

  const handlePartChange = (part: string) => {
    const p = part as Ch9SqlPart;
    setSelectedPart(p);
    const first = CH9_SQL_MISSIONS.find((m) => m.part === p);
    if (first) selectMission(first);
  };

  const handleRunAndCheck = () => {
    const check = checkCh9SqlMission(activeMission, sql);
    setResult(check.result);
    setFeedback({ passed: check.passed, text: check.feedback });

    if (check.passed) {
      if (!completedIds.includes(activeMission.id)) {
        const next = [...completedIds, activeMission.id];
        setCompletedIds(next);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
      }
      confetti({ particleCount: 90, spread: 65, origin: { y: 0.65 }, colors: ['#34d399', '#38bdf8', '#c084fc'] });
    }
  };

  const handleRunSandboxOnly = () => {
    const res = executeIgcseSql(sql);
    setResult(res);
    setFeedback(
      res.ok
        ? { passed: false, text: `Sandbox run returned ${res.rows.length} row(s). Click "Run & Check" to verify against the task.` }
        : { passed: false, text: res.error || 'SQL syntax error.' }
    );
  };

  const tableDef = CH9_TABLES[activeTable];
  const totalMarks = CH9_SQL_MISSIONS.reduce((sum, m) => sum + m.marks, 0);
  const earnedMarks = CH9_SQL_MISSIONS.filter((m) => completedIds.includes(m.id)).reduce((sum, m) => sum + m.marks, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 space-y-5">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-emerald-950/50 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                IGCSE SQL Practice Lab
              </h1>
              <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Cambridge 0478 · Chapter 9
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Write real SQL queries on the Stock, Equipment &amp; Weather tables and get instant feedback.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2">
            <Trophy className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">
              {completedIds.length}/{CH9_SQL_MISSIONS.length} tasks · {earnedMarks}/{totalMarks} marks
            </span>
          </div>
          <Link
            href="/dashboard/cambridge-lessons"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-sky-300 hover:bg-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Cambridge Lessons
          </Link>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT SIDEBAR: Mission Selector */}
        <Card className="lg:col-span-4 border-slate-800 bg-slate-900/70 text-slate-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Practice Tasks
            </CardTitle>
            <Tabs value={selectedPart} onValueChange={handlePartChange} className="mt-2">
              <TabsList className="grid grid-cols-3 bg-slate-950 border border-slate-800">
                <TabsTrigger value="a" className="text-xs font-bold data-[state=active]:bg-sky-600 data-[state=active]:text-white">
                  Part A (3)
                </TabsTrigger>
                <TabsTrigger value="b" className="text-xs font-bold data-[state=active]:bg-violet-600 data-[state=active]:text-white">
                  Part B (10)
                </TabsTrigger>
                <TabsTrigger value="transfer" className="text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                  Transfer (3)
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[540px] overflow-y-auto pr-2">
            {partMissions.map((m) => {
              const done = completedIds.includes(m.id);
              const isCurrent = m.id === activeMission.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => selectMission(m)}
                  className={`w-full text-left rounded-xl border p-3 transition-all ${
                    isCurrent
                      ? 'border-emerald-400 bg-emerald-950/40 shadow-md'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white leading-snug">{m.title}</span>
                    {done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400 shrink-0">
                        {m.marks}m
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{m.prompt}</p>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* RIGHT PANEL: Active Task, SQL Editor, Live Output & Table Inspector */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Task Card */}
          <Card className="border-slate-800 bg-slate-900/70 text-slate-100">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-sky-500/15 text-sky-300 border border-sky-500/30">
                    {activeMission.partLabel}
                  </Badge>
                  <Badge variant="outline" className="border-amber-500/40 text-amber-300">
                    Table: {activeMission.table}
                  </Badge>
                </div>
                <span className="text-xs font-bold text-slate-400">{activeMission.marks} marks</span>
              </div>
              <CardTitle className="text-lg font-extrabold text-white mt-1">
                {activeMission.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-200 leading-relaxed">{activeMission.prompt}</p>

              {/* SQL Editor */}
              <div className="rounded-xl border border-slate-700 bg-slate-950 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-3 py-2">
                  <span className="text-[11px] font-mono text-slate-400">SQL Query Editor (Ctrl+Enter to Run &amp; Check)</span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-slate-300 hover:text-white"
                      onClick={() => setShowHint((h) => !h)}
                    >
                      <HelpCircle className="mr-1 h-3.5 w-3.5 text-amber-400" />
                      {showHint ? 'Hide Hint' : 'Hint'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs text-slate-300 hover:text-white"
                      onClick={() => {
                        setSql(activeMission.starterSql);
                        setResult(null);
                        setFeedback(null);
                      }}
                    >
                      <RotateCcw className="mr-1 h-3.5 w-3.5" />
                      Reset
                    </Button>
                  </div>
                </div>
                <textarea
                  value={sql}
                  onChange={(e) => setSql(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault();
                      handleRunAndCheck();
                    }
                  }}
                  rows={5}
                  spellCheck={false}
                  aria-label="SQL query editor"
                  className="w-full resize-y bg-slate-950 p-3.5 font-mono text-sm text-emerald-200 placeholder:text-slate-600 focus:outline-none"
                  placeholder="SELECT ItemName, Price FROM Stock;"
                />
              </div>

              {showHint && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 px-3.5 py-2.5 text-xs text-amber-200">
                  <strong className="text-amber-300">Hint:</strong> {activeMission.hint}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  type="button"
                  onClick={handleRunAndCheck}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  <Play className="mr-1.5 h-4 w-4 fill-current" />
                  Run &amp; Check
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRunSandboxOnly}
                  className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
                >
                  <Sparkles className="mr-1.5 h-4 w-4 text-sky-400" />
                  Run Query Only
                </Button>
              </div>

              {/* Feedback Banner */}
              {feedback && (
                <div
                  className={`flex items-start gap-2.5 rounded-xl border p-3 text-xs sm:text-sm font-medium ${
                    feedback.passed
                      ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200'
                      : 'border-rose-500/40 bg-rose-950/40 text-rose-200'
                  }`}
                >
                  {feedback.passed ? (
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 mt-0.5 shrink-0 text-rose-400" />
                  )}
                  <span>{feedback.text}</span>
                </div>
              )}

              {/* Query Result Table */}
              {result && result.ok && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                  <div className="border-b border-slate-800 bg-slate-900/70 px-3 py-1.5 text-[11px] font-bold text-slate-400">
                    Query Result ({result.rows.length} row{result.rows.length === 1 ? '' : 's'})
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-slate-900/90 text-sky-300">
                        <tr>
                          {result.columns.map((col, idx) => (
                            <th key={`${col}-${idx}`} className="px-3 py-2 border-b border-slate-800">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.length === 0 ? (
                          <tr>
                            <td colSpan={result.columns.length} className="px-3 py-3 text-slate-500 italic">
                              (0 rows returned)
                            </td>
                          </tr>
                        ) : (
                          result.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-slate-900 odd:bg-slate-950 even:bg-slate-900/30">
                              {row.map((val, cIdx) => (
                                <td key={cIdx} className="px-3 py-2 text-slate-200">
                                  {val === null ? <span className="text-slate-500 italic">NULL</span> : String(val)}
                                </td>
                              ))}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Live Database Schema & Fixture Viewer */}
          <Card className="border-slate-800 bg-slate-900/70 text-slate-100">
            <CardHeader className="pb-2 flex flex-row flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Table2 className="h-4 w-4 text-sky-400" />
                <CardTitle className="text-sm font-bold text-white">Database Tables (Live Reference)</CardTitle>
              </div>
              <div className="flex items-center gap-1.5">
                {(['Stock', 'Equipment', 'Weather'] as const).map((tbl) => (
                  <button
                    key={tbl}
                    type="button"
                    onClick={() => setActiveTable(tbl)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                      activeTable === tbl
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tbl}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <span>
                  Primary Key: <strong className="text-amber-300 font-mono">{tableDef.primaryKey.join(', ')}</strong>
                </span>
                <span>·</span>
                <span>
                  Fields: {tableDef.columns.length} · Records: {tableDef.rows.length}
                </span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-900/90">
                    <tr>
                      {tableDef.columns.map((col) => (
                        <th key={col.name} className="px-3 py-2 border-b border-slate-800">
                          <div className="text-sky-300 font-bold">{col.name}</div>
                          <div className="text-[10px] text-slate-500 font-normal">{col.type}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableDef.rows.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-900 odd:bg-slate-950 even:bg-slate-900/30">
                        {tableDef.columns.map((col) => {
                          const v = row[col.name];
                          return (
                            <td key={col.name} className="px-3 py-1.5 text-slate-200">
                              {col.type === 'BOOLEAN' ? (v === 1 ? '1 (TRUE)' : '0 (FALSE)') : String(v)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
