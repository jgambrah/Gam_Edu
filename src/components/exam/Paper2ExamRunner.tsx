'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Lightbulb,
  Award,
  Loader2,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CurriculumQuestionSet, StructuredQuestionPart } from '@/lib/global-curriculum-types';
import { MathRenderer } from '@/components/curriculum/MathRenderer';
import { ActiveExamHeaderDisclaimer } from './ExamDisclaimerNotice';

interface Props {
  questionSet: CurriculumQuestionSet;
  schoolId?: string;
  studentId?: string;
  onBack: () => void;
  onComplete?: (results: any) => void;
}

interface PartEvaluation {
  awardedMarks: number;
  maxMarks: number;
  breakdown: Array<{
    step: string;
    awarded: number;
    max: number;
    feedback: string;
  }>;
  constructiveFeedback: string;
}

export function Paper2ExamRunner({
  questionSet,
  schoolId,
  studentId,
  onBack,
  onComplete
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [partAnswers, setPartAnswers] = useState<Record<string, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});
  const [evaluations, setEvaluations] = useState<Record<string, PartEvaluation>>({});
  const [isGrading, setIsGrading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPartHints, setShowPartHints] = useState<Record<string, boolean>>({});
  const [unlockedSolutions, setUnlockedSolutions] = useState<Record<string, boolean>>({});
  const [examFinished, setExamFinished] = useState(false);

  const questions = questionSet.questions || [];
  const currentQuestion = questions[currentIndex] || questions[0];
  const parts: StructuredQuestionPart[] = currentQuestion?.parts || [];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isCurrentQuestionSubmitted = !!submittedQuestions[currentQuestion?.id];

  // Resolve exam year
  const examYear = (questionSet as any)?.year
    ? Number((questionSet as any).year)
    : (() => {
        const m = (questionSet.title || '').match(/\b(19\d{2}|20\d{2})\b/);
        return m ? parseInt(m[1], 10) : null;
      })();

  // Toggle hints
  const toggleHint = (partKey: string) => {
    setShowPartHints(prev => ({ ...prev, [partKey]: !prev[partKey] }));
  };

  // Toggle solution after submit
  const toggleSolution = (partKey: string) => {
    if (!isCurrentQuestionSubmitted) return;
    setUnlockedSolutions(prev => ({ ...prev, [partKey]: !prev[partKey] }));
  };

  // Submit current question parts for AI evaluation
  const handleGradeCurrentQuestion = async () => {
    if (!currentQuestion) return;
    setIsGrading(true);
    setErrorMessage(null);

    try {
      const payloadAnswers = parts.length > 0
        ? parts.map((p, pIdx) => {
            const partKey = `${currentQuestion.id}_p${pIdx}`;
            return {
              questionNumber: currentIndex + 1,
              partLabel: p.partLabel,
              partKey,
              studentText: partAnswers[partKey] || ''
            };
          })
        : [
            {
              questionNumber: currentIndex + 1,
              partLabel: '(a)',
              partKey: `${currentQuestion.id}_main`,
              studentText: partAnswers[`${currentQuestion.id}_main`] || ''
            }
          ];

      const res = await fetch('/api/grade-paper2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: schoolId || 'demo-school',
          examId: questionSet.id,
          answers: payloadAnswers
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 402 || data.code === 'INSUFFICIENT_SCHOOL_CREDITS') {
          throw new Error(data.error || 'Your school has run out of AI credits. Please contact your administrator.');
        }
        throw new Error(data.error || 'Failed to grade submission.');
      }

      // Mark this question as submitted & store evaluations
      const newEvals: Record<string, PartEvaluation> = {};
      if (Array.isArray(data.results)) {
        data.results.forEach((r: any) => {
          if (r.partKey && r.evaluation) {
            newEvals[r.partKey] = r.evaluation;
          }
        });
      }

      setEvaluations(prev => ({ ...prev, ...newEvals }));
      setSubmittedQuestions(prev => ({ ...prev, [currentQuestion.id]: true }));

      // Automatically unlock solutions for the submitted question
      const newUnlocked: Record<string, boolean> = {};
      parts.forEach((_, pIdx) => {
        newUnlocked[`${currentQuestion.id}_p${pIdx}`] = true;
      });
      newUnlocked[`${currentQuestion.id}_main`] = true;
      setUnlockedSolutions(prev => ({ ...prev, ...newUnlocked }));

      // Confetti celebration
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}

    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with AI grading service.');
    } finally {
      setIsGrading(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setExamFinished(true);
      if (onComplete) onComplete(evaluations);
    } else {
      setCurrentIndex(prev => prev + 1);
      setErrorMessage(null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setErrorMessage(null);
    }
  };

  // Completed State View
  if (examFinished) {
    const allEvals = Object.values(evaluations);
    const totalAwarded = allEvals.reduce((sum, e) => sum + (e.awardedMarks || 0), 0);
    const totalMax = allEvals.reduce((sum, e) => sum + (e.maxMarks || 0), 0) || 1;
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
            Completed: <strong className="text-amber-300">{questionSet.title}</strong>
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
          Module: <strong className="text-amber-300">{questionSet.title}</strong>
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
                [{currentQuestion?.totalMarks || 15} Marks Total]
              </Badge>
            </div>

            {/* Submission Status Indicator */}
            <div>
              {isCurrentQuestionSubmitted ? (
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
          {/* Insufficient Credit or Grading Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-3 animate-in shake">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block font-bold">Grading Aborted:</strong>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Sub-Question Parts */}
          <div className="space-y-8">
            {parts.map((part, pIdx) => {
              const partKey = `${currentQuestion.id}_p${pIdx}`;
              const isRevealed = !!unlockedSolutions[partKey];
              const isHintShown = !!showPartHints[partKey];
              const currentVal = partAnswers[partKey] || '';
              const partEval = evaluations[partKey];

              return (
                <div
                  key={partKey}
                  className={cn(
                    'p-5 sm:p-6 rounded-2xl border transition-all space-y-4',
                    isCurrentQuestionSubmitted
                      ? 'bg-slate-900/60 border-slate-800'
                      : 'bg-slate-950/80 border-slate-800/80 shadow-md'
                  )}
                >
                  {/* Part Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs flex items-center justify-center border border-amber-500/30">
                        {part.partLabel}
                      </span>
                      <span className="text-sm font-bold text-white">
                        Sub-Question Part {part.partLabel}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                      [{part.marks} Marks]
                    </span>
                  </div>

                  {/* Part Prompt */}
                  <div className="text-sm text-slate-200 leading-relaxed pl-1">
                    <MathRenderer content={part.prompt} />
                  </div>

                  {/* Sub-part diagram (if any) */}
                  {part.diagramSvg && (
                    <div
                      className="my-3 p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-center overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: part.diagramSvg }}
                    />
                  )}

                  {/* Student Answer Textarea (Locked after submit) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Your Working Steps, Formula & Final Derivation:</span>
                      {isCurrentQuestionSubmitted && (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Working Locked Post-Submission
                        </span>
                      )}
                    </div>
                    <Textarea
                      disabled={isCurrentQuestionSubmitted || isGrading}
                      value={currentVal}
                      onChange={e => setPartAnswers(prev => ({ ...prev, [partKey]: e.target.value }))}
                      placeholder="Write out your intermediate steps, formula substitutions, or final answer here..."
                      className={cn(
                        'rounded-2xl min-h-[90px] text-xs font-mono transition-all',
                        isCurrentQuestionSubmitted
                          ? 'bg-slate-950/90 border-slate-800 text-slate-300 opacity-90 cursor-not-allowed'
                          : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-amber-500 placeholder:text-slate-600'
                      )}
                    />
                  </div>

                  {/* Hint Toggle (Available before or after submission) */}
                  {part.hint && !isCurrentQuestionSubmitted && (
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
                          💡 <strong>Hint {part.partLabel}:</strong> <MathRenderer content={part.hint} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* LOCKED STATE NOTICE (Before Submission) */}
                  {!isCurrentQuestionSubmitted && (
                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Official worked solution & rubric locked until submission.</span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Step Gated</span>
                    </div>
                  )}

                  {/* POST-SUBMISSION AI EVALUATION & UNLOCKED RUBRIC */}
                  {isCurrentQuestionSubmitted && (
                    <div className="space-y-4 pt-3 border-t border-slate-800 animate-in fade-in duration-300">
                      {/* AI Examiner Score & Breakdown Card */}
                      {partEval && (
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-400" />
                              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                                AI Examiner Evaluation
                              </span>
                            </div>
                            <span className="text-sm font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-0.5 rounded-full">
                              Awarded: {partEval.awardedMarks} / {partEval.maxMarks} Marks
                            </span>
                          </div>

                          {/* Constructive Examiner Feedback */}
                          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                            <strong className="text-white block mb-1">Examiner Comments:</strong>
                            {partEval.constructiveFeedback}
                          </div>

                          {/* Method / Accuracy Steps Table */}
                          {Array.isArray(partEval.breakdown) && partEval.breakdown.length > 0 && (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] font-bold">
                                  <tr>
                                    <th className="p-2.5">Marking Step</th>
                                    <th className="p-2.5 text-center">Marks</th>
                                    <th className="p-2.5">Examiner Note</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                  {partEval.breakdown.map((stepItem, sIdx) => (
                                    <tr key={sIdx} className="bg-slate-950/50">
                                      <td className="p-2.5 font-medium text-slate-200">{stepItem.step}</td>
                                      <td className="p-2.5 text-center font-bold text-emerald-400">
                                        {stepItem.awarded} / {stepItem.max}
                                      </td>
                                      <td className="p-2.5 text-slate-400 text-[11px]">{stepItem.feedback}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Official Unlocked Worked Solution Accordion */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Official Marking Scheme & Target Derivation (Unlocked)</span>
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSolution(partKey)}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            {isRevealed ? 'Collapse' : 'Expand Details'}
                          </Button>
                        </div>

                        {isRevealed && (
                          <div className="space-y-3 animate-in fade-in">
                            {/* Target Model Answer */}
                            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">
                                  Target Value / Model Answer:
                                </span>
                                <div className="text-xs font-bold text-white">
                                  <MathRenderer content={part.modelAnswer} />
                                </div>
                              </div>
                            </div>

                            {/* Step-by-Step Derivation */}
                            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                                Chief Examiner Marking Scheme & Derivation • [{part.marks} Marks]
                              </span>
                              <div className="text-xs text-slate-200 leading-relaxed">
                                <MathRenderer content={part.workedSolution} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI Grading Loading Skeleton */}
          {isGrading && (
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
              disabled={currentIndex === 0 || isGrading}
              className="text-xs border-slate-800 bg-slate-900 text-slate-400 hover:text-white disabled:opacity-40"
            >
              Previous Question
            </Button>

            <div className="flex items-center gap-3">
              {!isCurrentQuestionSubmitted ? (
                <Button
                  onClick={handleGradeCurrentQuestion}
                  disabled={isGrading}
                  className="h-11 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGrading ? (
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
