'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import type {
  LessonNotesPackage,
  LessonStage,
  WorkedQuestion,
} from '@/lib/narrated-lessons/notes-types';

const NOTES_PROGRESS_KEY_PREFIX = 'gamedu_narrated_lesson_notes_progress_v1_';

interface NotesProgress {
  understoodIds: string[];
}

function questionTypeMeta(type: string): { label: string; className: string } {
  switch (type.toLowerCase()) {
    case 'trap':
      return {
        label: 'Watch Out · Trap',
        className: 'bg-amber-100 text-amber-900 border-amber-200',
      };
    case 'apply':
      return {
        label: 'Apply',
        className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      };
    case 'why':
      return {
        label: 'Why?',
        className: 'bg-purple-100 text-purple-800 border-purple-200',
      };
    case 'understand':
      return {
        label: 'Understand',
        className: 'bg-teal-100 text-teal-800 border-teal-200',
      };
    case 'recall':
    default:
      return {
        label: 'Recall',
        className: 'bg-sky-100 text-sky-800 border-sky-200',
      };
  }
}

export function LessonNotesAndQuestions({
  notes,
  stage,
  onChangeStage,
  onJumpToSlide,
  validSlideIds,
}: {
  notes: LessonNotesPackage;
  stage: Exclude<LessonStage, 'listen'>;
  onChangeStage: (next: LessonStage) => void;
  onJumpToSlide?: (slideId: string) => void;
  validSlideIds?: Set<string>;
}) {
  const [notesTab, setNotesTab] = useState<'summaries' | 'full'>('summaries');
  const [selectedExemplar, setSelectedExemplar] = useState<string>('ALL');
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [hintOpenIds, setHintOpenIds] = useState<Record<string, boolean>>({});
  const [understoodSet, setUnderstoodSet] = useState<Set<string>>(() => new Set());

  // Load saved understood progress for this lesson
  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTES_PROGRESS_KEY_PREFIX + notes.lessonId);
      if (raw) {
        const parsed = JSON.parse(raw) as NotesProgress;
        if (Array.isArray(parsed.understoodIds)) {
          setUnderstoodSet(new Set(parsed.understoodIds));
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [notes.lessonId]);

  const toggleUnderstood = (qId: string) => {
    setUnderstoodSet((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      try {
        localStorage.setItem(
          NOTES_PROGRESS_KEY_PREFIX + notes.lessonId,
          JSON.stringify({ understoodIds: Array.from(next) }),
        );
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const totalQuestions = useMemo(
    () => notes.questionSeries.reduce((sum, g) => sum + g.questions.length, 0),
    [notes.questionSeries],
  );

  const visibleGroups = useMemo(() => {
    if (selectedExemplar === 'ALL') return notes.questionSeries;
    return notes.questionSeries.filter((g) => g.exemplarId === selectedExemplar);
  }, [notes.questionSeries, selectedExemplar]);

  const sectionTitleById = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of notes.sectionSummaries) {
      map.set(s.sectionId, s.title);
    }
    return map;
  }, [notes.sectionSummaries]);

  if (stage === 'notes') {
    return (
      <div className="space-y-5">
        {/* Notes Hero */}
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-600 to-teal-700 p-5 text-white shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                <FileText className="h-3.5 w-3.5" />
                Study Notes
              </span>
              <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">{notes.title}</h2>
              {notes.indicatorIds && notes.indicatorIds.length > 0 && (
                <p className="mt-1 text-xs text-sky-100">
                  NaCCA Indicators: {notes.indicatorIds.join(' · ')}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onChangeStage('questions')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-sky-800 shadow-sm transition hover:bg-sky-50"
            >
              Practice {totalQuestions} Questions
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Sub-view switcher: Quick Summaries vs Comprehensive Notes */}
          <div className="mt-4 inline-flex rounded-xl bg-white/15 p-1 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => setNotesTab('summaries')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                notesTab === 'summaries'
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Quick Section Summaries ({notes.sectionSummaries.length})
            </button>
            <button
              type="button"
              onClick={() => setNotesTab('full')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                notesTab === 'full'
                  ? 'bg-white text-sky-900 shadow-xs'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Comprehensive Notes ({notes.comprehensiveNotes.length})
            </button>
          </div>
        </div>

        {/* Section Summaries View */}
        {notesTab === 'summaries' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {notes.sectionSummaries.map((sec, idx) => (
              <section
                key={sec.sectionId}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-extrabold text-sky-800">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900">{sec.title}</h3>
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                  {sec.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {/* Comprehensive Notes View */}
        {notesTab === 'full' && (
          <div className="space-y-4">
            {notes.comprehensiveNotes.map((block) => {
              const secTitle = sectionTitleById.get(block.sectionId);
              return (
                <article
                  key={block.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      {secTitle && (
                        <p className="text-[11px] font-bold uppercase tracking-wide text-sky-700">
                          {secTitle}
                        </p>
                      )}
                      <h3 className="mt-0.5 text-base font-extrabold text-slate-900 sm:text-lg">
                        {block.heading}
                      </h3>
                    </div>
                    {block.enrichment && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-800">
                        <Sparkles className="h-3 w-3" />
                        Extra Science
                      </span>
                    )}
                  </div>

                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                    {block.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>

                  {/* Optional Example Table (e.g. Observation Table on n7) */}
                  {block.exampleTable &&
                    block.exampleTable.columns.length > 0 &&
                    block.exampleTable.rows.length > 0 && (
                      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-left text-xs sm:text-sm">
                            <thead>
                              <tr className="bg-slate-100 text-slate-800">
                                {block.exampleTable.columns.map((col, ci) => (
                                  <th
                                    key={ci}
                                    className="border-b border-slate-200 px-3 py-2.5 font-bold"
                                  >
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                              {block.exampleTable.rows.map((row, ri) => (
                                <tr key={ri}>
                                  {row.map((cell, ci) => (
                                    <td
                                      key={ci}
                                      className={`px-3 py-2.5 align-top ${
                                        ci === 0
                                          ? 'font-semibold text-slate-900 bg-slate-50/70'
                                          : 'text-slate-700'
                                      }`}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {block.exampleTable.caption && (
                          <p className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-[11px] italic text-slate-600">
                            {block.exampleTable.caption}
                          </p>
                        )}
                      </div>
                    )}

                  {/* Key Terms */}
                  {block.keyTerms && block.keyTerms.length > 0 && (
                    <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50/70 p-3.5">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-sky-800">
                        Key Terms
                      </p>
                      <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                        {block.keyTerms.map((kt) => (
                          <div
                            key={kt.term}
                            className="rounded-lg bg-white px-3 py-2 text-xs shadow-2xs"
                          >
                            <dt className="font-extrabold capitalize text-slate-900">{kt.term}</dt>
                            <dd className="mt-0.5 text-slate-600">{kt.meaning}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom CTA into Question Series */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5">
          <div>
            <h3 className="text-sm font-extrabold text-emerald-950">
              Ready to test yourself with worked examples?
            </h3>
            <p className="mt-0.5 text-xs text-emerald-800">
              Try {totalQuestions} teacher-explained questions with hints, memory tricks, and common
              exam traps.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {notesTab === 'summaries' && (
              <button
                type="button"
                onClick={() => {
                  setNotesTab('full');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs font-bold text-emerald-900 hover:bg-emerald-50"
              >
                Read Full Notes First
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onChangeStage('questions');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-extrabold text-white shadow-xs hover:bg-emerald-800"
            >
              Open Question Series
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // QUESTION SERIES VIEW
  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-600 to-sky-700 p-5 text-white shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
              <HelpCircle className="h-3.5 w-3.5" />
              Worked Question Series
            </span>
            <h2 className="mt-2 text-xl font-extrabold sm:text-2xl">{notes.title}</h2>
            <p className="mt-1 text-xs text-indigo-100">
              Try each question in your head first, peek at the hint if stuck, then reveal the
              teacher&apos;s explanation and memory trick.
            </p>
          </div>
          <div className="rounded-xl bg-white/15 px-4 py-2.5 text-center backdrop-blur-xs">
            <div className="text-lg font-extrabold">
              {understoodSet.size} / {totalQuestions}
            </div>
            <div className="text-[11px] font-semibold text-indigo-100">Understood</div>
          </div>
        </div>

        {/* Exemplar filter pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedExemplar('ALL')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              selectedExemplar === 'ALL'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            All Exemplars ({totalQuestions})
          </button>
          {notes.questionSeries.map((grp) => {
            const doneCount = grp.questions.filter((q) => understoodSet.has(q.id)).length;
            return (
              <button
                key={grp.exemplarId}
                type="button"
                onClick={() => setSelectedExemplar(grp.exemplarId)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  selectedExemplar === grp.exemplarId
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {grp.exemplarId} ({doneCount}/{grp.questions.length})
              </button>
            );
          })}
        </div>
      </div>

      {/* Exemplar Groups */}
      {visibleGroups.map((group) => (
        <section key={group.exemplarId} className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-100/90 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-xs font-extrabold text-white">
                  {group.exemplarId}
                </span>
                {group.indicatorId && (
                  <span className="rounded-md bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600">
                    {group.indicatorId}
                  </span>
                )}
                <h3 className="text-sm font-extrabold text-slate-900">{group.exemplarText}</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {group.questions.length} worked questions
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {group.questions.map((q) => (
              <WorkedQuestionCard
                key={q.id}
                question={q}
                revealed={Boolean(revealedIds[q.id])}
                hintOpen={Boolean(hintOpenIds[q.id])}
                understood={understoodSet.has(q.id)}
                onToggleReveal={() =>
                  setRevealedIds((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                }
                onToggleHint={() =>
                  setHintOpenIds((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                }
                onToggleUnderstood={() => toggleUnderstood(q.id)}
                onJumpToSlide={
                  q.misconceptionRef &&
                  onJumpToSlide &&
                  (!validSlideIds || validSlideIds.has(q.misconceptionRef))
                    ? () => onJumpToSlide(q.misconceptionRef!)
                    : undefined
                }
              />
            ))}
          </div>
        </section>
      ))}

      {/* Back to Notes / Listen footer */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            onChangeStage('notes');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <FileText className="h-4 w-4" />
          Back to Study Notes
        </button>
        <button
          type="button"
          onClick={() => {
            onChangeStage('listen');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-xs font-bold text-sky-800 hover:bg-sky-100"
        >
          <BookOpen className="h-4 w-4" />
          Return to Narrated Lesson
        </button>
      </div>
    </div>
  );
}

function WorkedQuestionCard({
  question,
  revealed,
  hintOpen,
  understood,
  onToggleReveal,
  onToggleHint,
  onToggleUnderstood,
  onJumpToSlide,
}: {
  question: WorkedQuestion;
  revealed: boolean;
  hintOpen: boolean;
  understood: boolean;
  onToggleReveal: () => void;
  onToggleHint: () => void;
  onToggleUnderstood: () => void;
  onJumpToSlide?: () => void;
}) {
  const badge = questionTypeMeta(question.type);

  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-2xs transition sm:p-5 ${
        understood ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
      }`}
    >
      {/* Top badges */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-xs font-extrabold text-slate-500">{question.id}</span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.className}`}
          >
            {badge.label}
          </span>
          {question.enrichment && (
            <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-800">
              <Sparkles className="h-3 w-3" />
              Extra
            </span>
          )}
          {question.assessmentMode?.startsWith('teacher-checked') && (
            <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-800">
              {question.assessmentMode === 'teacher-checked-drawing'
                ? 'Drawing · Teacher Check'
                : question.assessmentMode === 'teacher-checked-model'
                  ? 'Model · Teacher Check'
                  : 'Activity · Teacher Check'}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleUnderstood}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
            understood
              ? 'bg-emerald-700 text-white'
              : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {understood ? 'Understood' : 'Mark Understood'}
        </button>
      </div>

      {/* Question Prompt */}
      <p className="mt-2.5 text-sm font-bold leading-relaxed text-slate-900 sm:text-base">
        {question.prompt}
      </p>

      {/* Action Buttons: Hint + Reveal Answer */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {question.tryFirstHint && (
          <button
            type="button"
            onClick={onToggleHint}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
          >
            <Lightbulb className="h-3.5 w-3.5" />
            {hintOpen ? 'Hide Hint' : 'Try-First Hint'}
            {hintOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
        <button
          type="button"
          onClick={onToggleReveal}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
            revealed
              ? 'border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
              : 'bg-sky-700 text-white shadow-2xs hover:bg-sky-800'
          }`}
        >
          {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {revealed ? 'Hide Answer' : 'Show Answer & Teacher Explanation'}
        </button>
      </div>

      {/* Hint Drawer */}
      {hintOpen && question.tryFirstHint && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 text-xs leading-relaxed text-amber-950">
          <strong>Hint:</strong> {question.tryFirstHint}
        </div>
      )}

      {/* Revealed Teacher Walkthrough */}
      {revealed && (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          {/* Model Answer */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-emerald-800">
              Model Answer
            </p>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-emerald-950">
              {question.answer}
            </p>
          </div>

          {/* Drawing / Activity Self-Check Criteria */}
          {question.checkCriteria && question.checkCriteria.length > 0 && (
            <div className="rounded-xl border border-teal-200 bg-teal-50/70 p-3.5">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-teal-800">
                {question.assessmentMode === 'teacher-checked-drawing'
                  ? 'Drawing Checklist (Show Your Teacher)'
                  : question.assessmentMode === 'teacher-checked-model'
                    ? 'Model Checklist (Show Your Teacher)'
                    : 'Activity Checklist (Show Your Teacher)'}
              </p>
              <ul className="mt-1.5 space-y-1 text-xs leading-relaxed text-teal-950">
                {question.checkCriteria.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Teacher Explanation */}
          {question.teacherExplanation && question.teacherExplanation.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-600">
                Teacher Explanation
              </p>
              <div className="mt-1.5 space-y-1.5 text-xs leading-relaxed text-slate-800 sm:text-sm">
                {question.teacherExplanation.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* Memory Aid & Common Confusion side-by-side on desktop */}
          <div className="grid gap-3 sm:grid-cols-2">
            {question.memoryAid && (
              <div className="rounded-xl border border-sky-200 bg-sky-50/80 p-3">
                <p className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wide text-sky-800">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Memory Trick
                </p>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-sky-950">
                  {question.memoryAid}
                </p>
              </div>
            )}

            {question.commonConfusion && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3">
                <p className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wide text-amber-900">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Common Confusion
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-950">
                  {question.commonConfusion}
                </p>
                {onJumpToSlide && question.misconceptionRef && (
                  <button
                    type="button"
                    onClick={onJumpToSlide}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-900 underline hover:text-amber-700"
                  >
                    Review Slide {question.misconceptionRef.toUpperCase()} in lesson →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
