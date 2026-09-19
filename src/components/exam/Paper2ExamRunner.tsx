'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lightbulb,
  Award,
  Loader2,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CurriculumQuestionSet } from '@/lib/global-curriculum-types';
import { MathRenderer } from '@/components/curriculum/MathRenderer';
import { ActiveExamHeaderDisclaimer } from './ExamDisclaimerNotice';

// Universal defensive normalization helper - prevents 'subQuestions.find is not a function' in production
export function toSafeArray<T = any>(val: any): T[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'object') return Object.values(val);
  return [];
}

interface Props {
  questionSet?: CurriculumQuestionSet;
  exam?: any;
  schoolId?: string;
  currentSchoolId?: string;
  studentId?: string;
  user?: any;
  studentAnswers?: any;
  onBack: () => void;
  onComplete?: (results: any) => void;
}

export function Paper2ExamRunner({
  questionSet,
  exam,
  schoolId,
  currentSchoolId,
  studentId,
  user,
  studentAnswers: initialAnswers,
  onBack,
  onComplete
}: Props) {
  const activeExam = exam || questionSet || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [partAnswers, setPartAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [gradingResults, setGradingResults] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gradingError, setGradingError] = useState<string | null>(null);
  const [showPartHints, setShowPartHints] = useState<Record<string, boolean>>({});
  const [examFinished, setExamFinished] = useState(false);

  // 1. Defensively normalize top-level questions list
  const rawQuestions = activeExam?.paper2?.questions ?? activeExam?.questions;
  const questionsList = toSafeArray(rawQuestions);

  const currentQuestion = questionsList[currentIndex] || questionsList[0] || {};
  const currentQuestionId = String(currentQuestion?.id || currentQuestion?.questionNumber || currentIndex + 1);

  // 2. Defensively normalize subQuestions / parts for active question
  const rawSubQuestions = currentQuestion?.subQuestions ?? currentQuestion?.parts;
  const subQuestionsList = toSafeArray(rawSubQuestions);

  const totalQuestions = questionsList.length || 1;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isSubmitted = !!submittedQuestions[currentQuestionId];

  // Resolve exam year
  const examYear = (activeExam as any)?.year
    ? Number((activeExam as any).year)
    : (() => {
        const m = (activeExam?.title || '').match(/\b(19\d{2}|20\d{2})\b/);
        return m ? parseInt(m[1], 10) : null;
      })();

  // Toggle pedagogical hint
  const toggleHint = (partKey: string) => {
    setShowPartHints(prev => ({ ...prev, [partKey]: !prev[partKey] }));
  };

  // Submit Paper 2 answers for AI evaluation
  const handleSubmitForAIEvaluation = async () => {
    try {
      setIsSubmitting(true);
      setGradingError(null);

      // 1. Defensively normalize questions list
      const rawQuestions = activeExam?.paper2?.questions ?? activeExam?.questions;
      const questionsList = toSafeArray(rawQuestions);

      if (questionsList.length === 0) {
        throw new Error('No Paper 2 questions found in this exam variant.');
      }

      // 2. Build flattened answer items safely regardless of how studentAnswers is stored
      const formattedAnswers: Array<{
        questionNumber: string;
        subId: string;
        partLabel?: string;
        partKey?: string;
        prompt: string;
        studentText: string;
        maxMarks: number;
        workedSolution: string;
      }> = [];

      const effectiveAnswers = initialAnswers || partAnswers;

      if (Array.isArray(effectiveAnswers)) {
        effectiveAnswers.forEach((ans: any) => {
          const targetQ = questionsList.find(
            (q: any) => String(q?.questionNumber || q?.id) === String(ans?.questionNumber || ans?.id)
          );
          // DEFENSIVE FIX FOR i.iM: normalize subQuestions to array before calling .find()
          const subList = toSafeArray(targetQ?.subQuestions ?? targetQ?.parts);
          const targetSub = subList.find(
            (s: any) => String(s?.subId || s?.partLabel || s?.partId) === String(ans?.subId || ans?.partLabel)
          );

          if (targetSub) {
            formattedAnswers.push({
              questionNumber: String(ans.questionNumber || targetQ?.questionNumber || '1'),
              subId: String(ans.subId || targetSub.subId || '(a)'),
              partLabel: String(targetSub.partLabel || targetSub.subId || ans.subId),
              partKey: String(ans.partKey || `${ans.questionNumber}_${ans.subId}`),
              prompt: targetSub.prompt || '',
              studentText: ans.studentText || ans.text || '',
              maxMarks: Number(targetSub.maxMarks || targetSub.marks) || 5,
              workedSolution: targetSub.workedSolution || targetSub.modelAnswer || ''
            });
          }
        });
      } else if (effectiveAnswers && typeof effectiveAnswers === 'object') {
        // Determine if effectiveAnswers is a nested map: { [qNum]: { [subId]: text } }
        const isNested = Object.values(effectiveAnswers).some(
          v => v && typeof v === 'object' && !Array.isArray(v)
        );

        if (isNested) {
          Object.entries(effectiveAnswers).forEach(([qNum, subMap]: [string, any]) => {
            const targetQ = questionsList.find(
              (q: any) => String(q?.questionNumber || q?.id) === String(qNum)
            );
            // DEFENSIVE FIX FOR i.iM: normalize subQuestions
            const subList = toSafeArray(targetQ?.subQuestions ?? targetQ?.parts);

            if (subMap && typeof subMap === 'object') {
              Object.entries(subMap).forEach(([subId, val]: [string, any]) => {
                const targetSub = subList.find(
                  (s: any) => String(s?.subId || s?.partLabel || s?.partId) === String(subId)
                );

                const text = typeof val === 'string' ? val : val?.text || val?.value || '';
                if (text.trim().length > 0) {
                  formattedAnswers.push({
                    questionNumber: String(qNum),
                    subId: String(subId),
                    partLabel: String(targetSub?.partLabel || subId),
                    partKey: `${qNum}_${subId}`,
                    prompt: targetSub?.prompt || '',
                    studentText: text,
                    maxMarks: Number(targetSub?.maxMarks || targetSub?.marks) || 5,
                    workedSolution: targetSub?.workedSolution || targetSub?.modelAnswer || ''
                  });
                }
              });
            }
          });
        } else {
          // Flat map: partAnswers from active question
          if (subQuestionsList.length > 0) {
            subQuestionsList.forEach((sub: any, subIdx: number) => {
              const subId = String(sub?.subId || sub?.partLabel || sub?.partId || `(${String.fromCharCode(97 + subIdx)})`);
              const partKey = `${currentQuestionId}_p${subIdx}`;
              const text = (effectiveAnswers as any)[partKey] || (effectiveAnswers as any)[subId] || '';

              if (text.trim().length > 0) {
                formattedAnswers.push({
                  questionNumber: String(currentQuestion?.questionNumber || currentIndex + 1),
                  subId,
                  partLabel: String(sub?.partLabel || subId),
                  partKey,
                  prompt: String(sub?.prompt || ''),
                  studentText: text,
                  maxMarks: Number(sub?.maxMarks || sub?.marks) || 5,
                  workedSolution: String(sub?.workedSolution || sub?.modelAnswer || '')
                });
              }
            });
          } else {
            const mainKey = `${currentQuestionId}_main`;
            const text = (effectiveAnswers as any)[mainKey] || (effectiveAnswers as any)['(a)'] || '';

            if (text.trim().length > 0) {
              formattedAnswers.push({
                questionNumber: String(currentQuestion?.questionNumber || currentIndex + 1),
                subId: '(a)',
                partLabel: '(a)',
                partKey: mainKey,
                prompt: String(currentQuestion?.prompt || ''),
                studentText: text,
                maxMarks: Number(currentQuestion?.totalMarks || currentQuestion?.points) || 15,
                workedSolution: String(currentQuestion?.workedSolution || currentQuestion?.modelAnswer || '')
              });
            }
          }
        }
      }

      if (formattedAnswers.length === 0) {
        throw new Error('Please write an answer for at least one question before submitting.');
      }

      // 3. Post to evaluation endpoint
      const response = await fetch('/api/grade-paper2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: currentSchoolId || schoolId || user?.schoolId || 'demo-school',
          examId: activeExam.id || activeExam.variantId || (examYear ? `paper_${examYear}_variant` : 'paper_2020_variant'),
          answers: formattedAnswers
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402 || data.code === 'INSUFFICIENT_SCHOOL_CREDITS') {
          throw new Error(data.error || 'Your school has run out of AI credits. Please contact your administrator.');
        }
        throw new Error(data.error || `Evaluation failed with status ${response.status}`);
      }

      // 4. Update state safely using toSafeArray
      const newResults = toSafeArray(data.results);
      setGradingResults(prev => [...prev, ...newResults]);
      setSubmittedQuestions(prev => ({ ...prev, [currentQuestionId]: true }));

      // Confetti celebration
      try {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}

    } catch (err: any) {
      console.error('Grading execution failed:', err);
      setGradingError(err.message || 'Failed to complete evaluation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Backwards-compatible alias
  const handleGradePaper2Submission = handleSubmitForAIEvaluation;

  const handleNext = () => {
    if (isLastQuestion) {
      setExamFinished(true);
      if (onComplete) onComplete(gradingResults);
    } else {
      setCurrentIndex(prev => prev + 1);
      setGradingError(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setGradingError(null);
    }
  };

  // Completed State View
  if (examFinished) {
    const allResults = toSafeArray(gradingResults);
    const totalAwarded = allResults.reduce((sum, r) => sum + (r.evaluation?.awardedMarks ?? 0), 0);
    const totalMax = allResults.reduce((sum, r) => sum + (r.evaluation?.maxMarks ?? 5), 0) || 1;
    const overallPct = Math.round((totalAwarded / totalMax) * 100);

    return (
      <div className="space-y-4 animate-in zoom-in-95 duration-300">
        <ActiveExamHeaderDisclaimer year={examYear} />
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 pl-0 hover:bg-transparent cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Curriculum Modules
          </Button>
          <span className="text-xs text-slate-400">
            Completed: <strong className="text-amber-300">{activeExam.title}</strong>
          </span>
        </div>

        <Card className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
          <div className="max-w-lg mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-3 py-0.5 uppercase tracking-wider">
                Paper 2 Theory Examination Completed
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {overallPct >= 70 ? 'Outstanding Mathematical Derivation!' : 'Theory Session Evaluated'}
              </h2>
              <p className="text-xs text-slate-400">
                You were awarded <strong className="text-amber-400">{totalAwarded}</strong> out of{' '}
                <strong className="text-white">{totalMax} total marks</strong> ({overallPct}%) across evaluated questions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Marks Awarded</span>
                <span className="text-2xl font-black text-amber-400">{totalAwarded} / {totalMax}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Accuracy Index</span>
                <span className="text-2xl font-black text-white">{overallPct}%</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setExamFinished(false);
                  setCurrentIndex(0);
                }}
                className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Review Paper 2 Rubrics
              </Button>
              <Button
                onClick={onBack}
                className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-amber-600/30 cursor-pointer"
              >
                Back to Exam Series Catalog
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <ActiveExamHeaderDisclaimer year={examYear} />

      {/* Top Breadcrumb & Stepper Info */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 pl-0 hover:bg-transparent cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Curriculum Modules
        </Button>
        <span className="text-xs text-slate-400">
          Module: <strong className="text-amber-300">{activeExam.title}</strong>
        </span>
      </div>

      {/* Main Examination Workstation */}
      <Card className="rounded-[32px] bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden text-white">
        {/* Workstation Header */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 border-b border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Paper 2 Theory Question {currentIndex + 1} of {totalQuestions}</span>
              </Badge>
              <Badge className="bg-slate-800/80 text-slate-400 border border-slate-700/60 text-xs">
                [{currentQuestion?.totalMarks || currentQuestion?.points || 15} Marks Total]
              </Badge>
            </div>

            {/* Submission Status Indicator */}
            <div>
              {isSubmitted ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>AI Graded & Solutions Unlocked</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-full">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Official Solution Locked Until Submission</span>
                </span>
              )}
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {currentQuestion?.title || `Question ${currentIndex + 1}`}
          </h3>

          {currentQuestion?.prompt && currentQuestion.prompt !== 'Answer all parts of this question:' && (
            <div className="text-sm text-slate-300 mt-2">
              <MathRenderer content={currentQuestion.prompt} />
            </div>
          )}
        </div>

        {/* Question Body */}
        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Error Banner */}
          {gradingError && (
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-3 animate-in shake">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block font-bold">Grading Aborted:</strong>
                <span>{gradingError}</span>
              </div>
            </div>
          )}

          {/* Sub-Question Parts - Normalized via toSafeArray */}
          <div className="space-y-8">
            {toSafeArray(currentQuestion?.subQuestions || currentQuestion?.parts).map((sub: any, subIdx: number) => {
              const subId = String(sub?.subId || sub?.partLabel || sub?.partId || `(${String.fromCharCode(97 + subIdx)})`);
              const partKey = `${currentQuestionId}_p${subIdx}`;
              const isHintShown = !!showPartHints[partKey];
              const currentVal = partAnswers[partKey] || partAnswers[subId] || '';
              const subMarks = Number(sub?.maxMarks || sub?.marks) || 5;

              return (
                <div
                  key={sub?.subId || subIdx}
                  className={cn(
                    'p-5 sm:p-6 rounded-2xl border transition-all space-y-4',
                    isSubmitted
                      ? 'bg-slate-900/60 border-slate-800'
                      : 'bg-slate-950/80 border-slate-800/80 shadow-md'
                  )}
                >
                  {/* Part Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center border border-amber-500/30">
                        {sub.partLabel || subId}
                      </span>
                      <span className="text-sm font-bold text-white">
                        Sub-Question Part {sub.partLabel || subId}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                      [{subMarks} Marks]
                    </span>
                  </div>

                  {/* Part Prompt */}
                  <div className="text-sm text-slate-200 leading-relaxed pl-1">
                    <MathRenderer content={sub.prompt || ''} />
                  </div>

                  {/* Sub-part diagram (if any) */}
                  {sub.diagramSvg && (
                    <div
                      className="my-3 p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-center overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: sub.diagramSvg }}
                    />
                  )}

                  {/* Student Answer Textarea (Locked after submit) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Your Working Steps, Formula & Final Derivation:</span>
                      {isSubmitted && (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Working Locked Post-Submission
                        </span>
                      )}
                    </div>
                    <Textarea
                      disabled={isSubmitted || isSubmitting}
                      value={currentVal}
                      onChange={e => setPartAnswers(prev => ({ ...prev, [partKey]: e.target.value }))}
                      placeholder="Write out your intermediate steps, formula substitutions, or final answer here..."
                      className={cn(
                        'rounded-2xl min-h-[90px] text-xs font-mono transition-all',
                        isSubmitted
                          ? 'bg-slate-950/90 border-slate-800 text-slate-300 opacity-90 cursor-not-allowed'
                          : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-amber-500 placeholder:text-slate-600'
                      )}
                    />
                  </div>

                  {/* Hint Toggle (Available before submission) */}
                  {sub.hint && !isSubmitted && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => toggleHint(partKey)}
                        className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>{isHintShown ? 'Hide Pedagogical Hint' : 'Need a hint for this part?'}</span>
                      </button>
                      {isHintShown && (
                        <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed animate-in fade-in">
                          💡 <strong>Hint {sub.partLabel || subId}:</strong> <MathRenderer content={sub.hint} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Container for Each Sub-Question Gating & AI Breakdown */}
                  <div className="mt-4 border-t border-slate-800/80 pt-4">
                    {!isSubmitted ? (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs text-slate-400">
                        <Lock className="w-4 h-4 text-amber-400 shrink-0"/>
                        <span>Official Worked Solution and Scoring Rubric are locked until your answers are submitted for AI evaluation.</span>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        {/* 1. AI Evaluation Score & Step Breakdown */}
                        {(() => {
                          const evalItem = toSafeArray(gradingResults).find(
                            (r: any) =>
                              (String(r.questionNumber) === String(currentQuestion?.questionNumber || currentIndex + 1) || String(r.questionNumber) === String(currentIndex + 1)) &&
                              (String(r.subId) === String(subId) || String(r.partLabel) === String(subId) || String(r.partKey) === String(partKey))
                          );

                          if (!evalItem) return null;

                          return (
                            <div className="p-4 rounded-xl bg-slate-900/90 border border-sky-500/30 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-sky-400 text-sm flex items-center gap-1.5">
                                  <Sparkles className="w-4 h-4 text-sky-400" />
                                  <span>AI Score Breakdown</span>
                                </span>
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                                  Score: {evalItem.evaluation?.awardedMarks ?? 0} / {evalItem.evaluation?.maxMarks ?? subMarks} Marks
                                </span>
                              </div>

                              <div className="space-y-2">
                                {toSafeArray(evalItem.evaluation?.breakdown).map((step: any, sIdx: number) => (
                                  <div key={sIdx} className="text-xs flex items-start justify-between gap-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/40">
                                    <div>
                                      <span className="text-slate-200 font-medium">{step.step}</span>
                                      {step.feedback && <p className="text-amber-400/90 mt-0.5 text-[11px]">{step.feedback}</p>}
                                    </div>
                                    <span className="text-slate-300 whitespace-nowrap font-mono font-semibold">
                                      {step.awarded} / {step.max}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {evalItem.evaluation?.constructiveFeedback && (
                                <div className="text-xs text-slate-300 bg-sky-950/40 p-3 rounded-lg border border-sky-800/40 leading-relaxed">
                                  <strong className="text-sky-400 block mb-0.5">Examiner Note:</strong>
                                  {evalItem.evaluation.constructiveFeedback}
                                </div>
                              )}
                            </div>
                          );
                        })()}

                        {/* 2. Unlocked Step-by-Step Official Worked Solution */}
                        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                            <CheckCircle2 className="w-4 h-4 shrink-0"/>
                            <span>Official Model Solution & Marking Rubric</span>
                          </div>

                          {sub.modelAnswer && (
                            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-emerald-500/20 text-xs">
                              <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">Target Value / Model Answer:</span>
                              <div className="text-slate-100 font-bold">
                                <MathRenderer content={sub.modelAnswer} />
                              </div>
                            </div>
                          )}

                          <div className="text-xs text-slate-300 leading-relaxed pt-1">
                            <MathRenderer content={sub.workedSolution || sub.modelAnswer || 'Follow standard derivation steps.'} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Grading Loading Skeleton */}
          {isSubmitting && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-2xl space-y-4 animate-pulse">
              <div className="flex items-center gap-3 text-amber-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-bold">
                  AI Examiner evaluating methodology, algebraic derivations & accuracy...
                </span>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-slate-800" />
                <Skeleton className="h-4 w-1/2 bg-slate-800" />
                <Skeleton className="h-16 w-full bg-slate-800 rounded-xl" />
              </div>
            </div>
          )}

          {/* Action Navigation & Submit Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0 || isSubmitting}
              className="text-xs border-slate-800 bg-slate-900 text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
            >
              Previous Question
            </Button>

            <div className="flex items-center gap-3">
              {!isSubmitted ? (
                <Button
                  onClick={handleSubmitForAIEvaluation}
                  disabled={isSubmitting}
                  className="h-11 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Grading Submission...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit for AI Evaluation (2 Credits)</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="h-11 px-8 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{isLastQuestion ? 'Complete Examination' : 'Next Theory Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Named alias for cross-module compatibility
export const TheoryExamViewer = Paper2ExamRunner;
