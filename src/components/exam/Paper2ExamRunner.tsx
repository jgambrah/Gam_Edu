'use client';

import React, { useState, useEffect } from 'react';
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
  RotateCcw,
  Clock,
  BookOpen,
  PenTool,
  Check,
  Eye,
  EyeOff,
  AlignLeft
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

// Universal defensive normalization helper
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
  assignmentId?: string;
  user?: any;
  studentAnswers?: any;
  onBack: () => void;
  onComplete?: (results: any) => void;
}

function formatCountdown(totalSecs: number): string {
  const clamped = Math.max(0, totalSecs);
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function Paper2ExamRunner({
  questionSet,
  exam,
  schoolId,
  currentSchoolId,
  studentId,
  assignmentId,
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
  const [showModelAnswer, setShowModelAnswer] = useState<Record<string, boolean>>({});
  const [examFinished, setExamFinished] = useState(false);

  // --- REAL-TIME LIVE COUNTDOWN TIMER (Paper 2: 75 - 105 mins standard) ---
  const examDurationMinutes = Number(activeExam?.paper2?.durationMinutes || activeExam?.durationMinutes || 75);
  const initialDurationSeconds = examDurationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(initialDurationSeconds);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (examFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [examFinished]);

  // 1. Defensively normalize top-level questions list
  const rawQuestions = 
    activeExam?.paper2?.questions ?? 
    activeExam?.questions ?? 
    activeExam?.paper2?.sections?.sectionA_essay?.questions;
  
  let questionsList = toSafeArray(rawQuestions);

  // Fallback: If questions are in nested sections (e.g. sectionA_essay, sectionB_comprehension, sectionC_literature)
  if (questionsList.length === 0 && activeExam?.paper2?.sections) {
    const s = activeExam.paper2.sections;
    const secA = toSafeArray(s.sectionA_essay?.questions || s.sectionA?.questions);
    const secB = toSafeArray(s.sectionB_comprehension?.questions || s.sectionB?.questions);
    const secC = toSafeArray(s.sectionC_literature?.questions || s.sectionC?.questions);
    questionsList = [...secA, ...secB, ...secC];
  }

  const currentQuestion = questionsList[currentIndex] || questionsList[0] || {};
  const currentQuestionId = String(currentQuestion?.id || currentQuestion?.questionNumber || currentIndex + 1);

  // 2. Defensively normalize subQuestions / parts for active question
  const rawSubQuestions = currentQuestion?.subQuestions ?? currentQuestion?.parts;
  const subQuestionsList = toSafeArray(rawSubQuestions);
  const hasSubParts = subQuestionsList.length > 0;

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

  // Main standalone essay answer key
  const mainKey = `${currentQuestionId}_main`;
  const currentEssayText = partAnswers[mainKey] || partAnswers[currentQuestionId] || '';

  // Live word & character counter helpers
  const essayWords = currentEssayText.trim() ? currentEssayText.trim().split(/\s+/).filter(Boolean).length : 0;
  const essayChars = currentEssayText.length;
  const essayParagraphs = currentEssayText.trim() ? currentEssayText.trim().split(/\n+/).filter(p => p.trim().length > 0).length : 0;

  // Toggle pedagogical hint
  const toggleHint = (partKey: string) => {
    setShowPartHints(prev => ({ ...prev, [partKey]: !prev[partKey] }));
  };

  // Toggle model answer visibility
  const toggleModelAnswer = (key: string) => {
    setShowModelAnswer(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Submit Paper 2 answers for AI evaluation
  const handleSubmitForAIEvaluation = async () => {
    try {
      setIsSubmitting(true);
      setGradingError(null);

      if (questionsList.length === 0) {
        throw new Error('No Paper 2 questions found in this exam module.');
      }

      // 1. Build flattened answer items
      const formattedAnswers: Array<{
        questionNumber: string;
        subId: string;
        partLabel?: string;
        partKey?: string;
        prompt: string;
        studentText: string;
        maxMarks: number;
        workedSolution: string;
        modelAnswer?: string;
      }> = [];

      const effectiveAnswers = initialAnswers || partAnswers;

      if (hasSubParts) {
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
              workedSolution: String(sub?.workedSolution || sub?.modelAnswer || ''),
              modelAnswer: String(sub?.modelAnswer || sub?.workedSolution || '')
            });
          }
        });
      } else {
        // Standalone Essay / Composition question
        const essayContent = currentEssayText.trim();
        if (essayContent.length > 0) {
          formattedAnswers.push({
            questionNumber: String(currentQuestion?.questionNumber || currentIndex + 1),
            subId: 'main',
            partLabel: String(currentQuestion?.partLabel || currentQuestion?.category || `Question ${currentIndex + 1}`),
            partKey: mainKey,
            prompt: String(currentQuestion?.prompt || currentQuestion?.title || ''),
            studentText: essayContent,
            maxMarks: Number(currentQuestion?.marks || currentQuestion?.totalMarks || currentQuestion?.points) || 30,
            workedSolution: String(currentQuestion?.workedSolution || currentQuestion?.modelAnswer || ''),
            modelAnswer: String(currentQuestion?.modelAnswer || currentQuestion?.workedSolution || '')
          });
        }
      }

      if (formattedAnswers.length === 0) {
        throw new Error('Please write your essay or answer in the workspace before submitting for AI review.');
      }

      // 2. Post to AI evaluation endpoint
      const response = await fetch('/api/grade-paper2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: currentSchoolId || schoolId || user?.schoolId || 'demo-school',
          examId: activeExam.id || activeExam.variantId || (examYear ? `paper_${examYear}_variant` : 'bece_paper2'),
          answers: formattedAnswers,
          assignmentId: assignmentId || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('assignmentId') : undefined),
          studentId: studentId || user?.uid || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402 || data.code === 'INSUFFICIENT_SCHOOL_CREDITS') {
          throw new Error(data.error || 'Your school has run out of AI credits. Please contact your administrator.');
        }
        throw new Error(data.error || `Evaluation failed with status ${response.status}`);
      }

      // 3. Update state safely
      const newResults = toSafeArray(data.results);
      setGradingResults(prev => {
        const filtered = prev.filter(r => !formattedAnswers.some(fa => fa.partKey === r.partKey));
        return [...filtered, ...newResults];
      });
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
      setGradingError(err.message || 'Failed to complete AI evaluation.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    const totalMax = allResults.reduce((sum, r) => sum + (r.evaluation?.maxMarks ?? 30), 0) || 1;
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
            Completed: <strong className="text-amber-300">{activeExam.title || 'Paper 2 Examination'}</strong>
          </span>
        </div>

        <Card className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
          <div className="max-w-lg mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-3 py-0.5 uppercase tracking-wider">
                Paper 2 Theory & Essay Examination Completed
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {overallPct >= 75 ? 'Outstanding WAEC Performance!' : overallPct >= 60 ? 'Commendable Mastery!' : 'Theory Session Evaluated'}
              </h2>
              <p className="text-xs text-slate-400">
                You were awarded <strong className="text-amber-400">{totalAwarded}</strong> out of{' '}
                <strong className="text-white">{totalMax} total marks</strong> ({overallPct}%) reviewed by the AI Examiner.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Marks Awarded</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400">{totalAwarded} / {totalMax}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">WAEC Grade Tier</span>
                <span className="text-xl sm:text-2xl font-black text-white">
                  {overallPct >= 80 ? 'Grade 1' : overallPct >= 70 ? 'Grade 2' : overallPct >= 60 ? 'Grade 3' : 'Pass'}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Time Used</span>
                <span className="text-xl sm:text-2xl font-black text-cyan-400">{formatCountdown(timeElapsed)}</span>
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
                Back to Exam Catalog
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Active question details
  const questionMarks = Number(currentQuestion?.marks || currentQuestion?.totalMarks || currentQuestion?.points) || (hasSubParts ? 15 : 30);
  const questionCategory = currentQuestion?.category || currentQuestion?.partLabel || (hasSubParts ? 'Structured Theory' : 'Essay Composition');
  const questionPrompt = currentQuestion?.prompt || currentQuestion?.title || '';
  const questionModelAnswer = currentQuestion?.modelAnswer || currentQuestion?.workedSolution || '';

  // Check if prompt contains a reading passage / extract (e.g. for Comprehension)
  const isComprehensionOrLiterature = questionPrompt.includes('**Question:**') || questionPrompt.includes('Extract:');
  let passageText = '';
  let subPromptText = questionPrompt;
  if (isComprehensionOrLiterature && questionPrompt.includes('**Question:**')) {
    const parts = questionPrompt.split('**Question:**');
    passageText = parts[0].trim();
    subPromptText = parts[1].trim();
  }

  // Get AI evaluation for standalone essay if submitted
  const standaloneEval = toSafeArray(gradingResults).find(
    (r: any) =>
      (String(r.questionNumber) === String(currentQuestion?.questionNumber || currentIndex + 1) || String(r.questionNumber) === String(currentIndex + 1)) &&
      (String(r.subId) === 'main' || String(r.partKey) === mainKey)
  );

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
          Module: <strong className="text-amber-300">{activeExam.title || 'Paper 2 Written Examination'}</strong>
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
                <span>Paper 2 Written Question {currentIndex + 1} of {totalQuestions}</span>
              </Badge>
              <Badge className="bg-slate-800/80 text-slate-300 border border-slate-700/60 text-xs">
                {questionCategory}
              </Badge>
              <Badge className="bg-amber-950/60 text-amber-300 border border-amber-600/40 text-xs font-bold">
                [{questionMarks} Marks]
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              {/* Countdown Timer Badge */}
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-mono font-black transition-all shadow-inner",
                timeLeft <= 300
                  ? "bg-red-500/25 border-red-500/60 text-red-300 animate-pulse shadow-red-500/20"
                  : timeLeft <= 900
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                  : "bg-slate-950/90 border-cyan-500/40 text-cyan-300 shadow-slate-950"
              )}>
                <Clock className={cn("w-3.5 h-3.5", timeLeft <= 300 ? "text-red-400 animate-spin" : "text-cyan-400")} />
                <span>{timeLeft <= 0 ? 'Time Expired' : formatCountdown(timeLeft)}</span>
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
                    <span>Official Rubric Locked Until Submission</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {currentQuestion?.title || `Question ${currentIndex + 1}`}
          </h3>
        </div>

        {/* Question Body */}
        <CardContent className="p-6 sm:p-8 space-y-8">
          {/* Error Banner */}
          {gradingError && (
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-3 animate-in shake">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block font-bold">Evaluation Note:</strong>
                <span>{gradingError}</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CASE A: STANDALONE ESSAY / COMPOSITION WRITING WORKSPACE                 */}
          {/* ========================================================================= */}
          {!hasSubParts ? (
            <div className="space-y-6">
              {/* Reading Passage / Extract Card (if present) */}
              {passageText && (
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Reading Passage / Reference Material:</span>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed max-h-72 overflow-y-auto pr-2 custom-scrollbar whitespace-pre-line border-l-2 border-amber-500/30 pl-3">
                    <MathRenderer content={passageText} />
                  </div>
                </div>
              )}

              {/* Essay Prompt Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Essay Prompt & Question:</span>
                  </span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">
                    Target: ~250 words
                  </span>
                </div>
                <div className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed pl-1">
                  <MathRenderer content={subPromptText} />
                </div>
              </div>

              {/* Dedicated Essay Writing Area */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <AlignLeft className="w-3.5 h-3.5 text-amber-400" />
                    <span>Your Essay Composition / Answer:</span>
                  </span>

                  {/* Live Word & Metrics Counter */}
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border transition-colors",
                      essayWords >= 220 
                        ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                        : essayWords >= 120
                        ? "bg-amber-950/60 border-amber-500/40 text-amber-300"
                        : "bg-slate-950 border-slate-800 text-slate-400"
                    )}>
                      {essayWords} Words {essayWords >= 220 ? '✓ (Optimal)' : '/ ~250 target'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                      {essayParagraphs} Paragraphs • {essayChars} Chars
                    </span>
                  </div>
                </div>

                {/* Large Responsive Textarea */}
                <Textarea
                  disabled={isSubmitted || isSubmitting}
                  value={currentEssayText}
                  onChange={e => setPartAnswers(prev => ({ ...prev, [mainKey]: e.target.value }))}
                  placeholder={`Write your complete composition or answer here...\n\nPlan your response clearly:\n• Heading / Layout (if letter, report, or article)\n• Introduction and clear statement of purpose\n• Body paragraphs with well-developed ideas and supporting details\n• Conclusion and final remarks`}
                  className={cn(
                    'w-full rounded-2xl min-h-[280px] sm:min-h-[340px] text-sm leading-relaxed p-4 sm:p-5 font-sans transition-all',
                    isSubmitted
                      ? 'bg-slate-950/90 border-slate-800 text-slate-300 opacity-90 cursor-not-allowed'
                      : 'bg-slate-950 border-slate-800 text-slate-100 focus:border-amber-500 placeholder:text-slate-600 focus:ring-1 focus:ring-amber-500/40'
                  )}
                />

                {isSubmitted && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Essay response submitted and evaluated by the AI Examiner.</span>
                  </div>
                )}
              </div>

              {/* Hint Toggle (Available before submission) */}
              {currentQuestion?.hint && !isSubmitted && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => toggleHint(mainKey)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showPartHints[mainKey] ? 'Hide Chief Examiner Hint' : 'Need guidance on essay structure?'}</span>
                  </button>
                  {showPartHints[mainKey] && (
                    <div className="mt-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed animate-in fade-in">
                      💡 <strong>Chief Examiner Tip:</strong> <MathRenderer content={currentQuestion.hint} />
                    </div>
                  )}
                </div>
              )}

              {/* Post-Submission AI Evaluation Card */}
              {isSubmitted && standaloneEval && (
                <div className="mt-6 space-y-4 animate-in fade-in duration-300">
                  {/* AI Examiner Score Banner */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/50 border border-amber-500/40 shadow-xl space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <span>AI Examiner Evaluation & Marks Awarded</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {standaloneEval.evaluation?.gradeBand && (
                          <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs">
                            {standaloneEval.evaluation.gradeBand}
                          </Badge>
                        )}
                        <span className="px-3 py-1 rounded-full text-sm font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                          Score: {standaloneEval.evaluation?.awardedMarks ?? 0} / {standaloneEval.evaluation?.maxMarks ?? questionMarks} Marks
                        </span>
                      </div>
                    </div>

                    {/* 4-Tier Rubric Breakdown Grid */}
                    <div className="space-y-2.5 pt-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Official WAEC 4-Tier Scoring Breakdown:
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {toSafeArray(standaloneEval.evaluation?.breakdown).map((step: any, sIdx: number) => (
                          <div
                            key={sIdx}
                            className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1 hover:border-slate-700 transition-colors"
                          >
                            <div className="flex items-center justify-between font-semibold">
                              <span className="text-slate-200">{step.step}</span>
                              <span className="font-mono text-amber-400 font-bold">
                                {step.awarded} / {step.max}
                              </span>
                            </div>
                            {step.feedback && (
                              <p className="text-slate-400 text-[11px] leading-relaxed">
                                {step.feedback}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Constructive Examiner Commentary */}
                    {standaloneEval.evaluation?.constructiveFeedback && (
                      <div className="text-xs text-slate-300 bg-slate-950/70 p-4 rounded-xl border border-slate-800 leading-relaxed space-y-1">
                        <strong className="text-amber-400 block font-bold">Chief Examiner Guidance:</strong>
                        <p>{standaloneEval.evaluation.constructiveFeedback}</p>
                      </div>
                    )}
                  </div>

                  {/* Unlocked Official Model Essay / Solution */}
                  {questionModelAnswer && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Official WAEC Chief Examiner Model Essay & Benchmark</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleModelAnswer(mainKey)}
                          className="text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 cursor-pointer flex items-center gap-1.5"
                        >
                          {showModelAnswer[mainKey] ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hide Model Essay</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Read Model Essay</span>
                            </>
                          )}
                        </Button>
                      </div>

                      {showModelAnswer[mainKey] && (
                        <div className="p-5 rounded-xl bg-slate-950/90 border border-emerald-500/20 text-xs text-slate-200 leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto custom-scrollbar animate-in fade-in">
                          <MathRenderer content={questionModelAnswer} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* ========================================================================= */
            /* CASE B: QUESTIONS WITH STRUCTURED SUB-PARTS (a, b, c, d...)               */
            /* ========================================================================= */
            <div className="space-y-8">
              {subQuestionsList.map((sub: any, subIdx: number) => {
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
                    <div className="text-sm text-slate-200 leading-relaxed pl-1 whitespace-pre-line">
                      <MathRenderer content={(sub.prompt || '').replace(/\\n/g, '\n')} />
                    </div>

                    {/* Sub-part diagram (if any) */}
                    {sub.diagramSvg && (
                      <div
                        className="my-3 p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-center overflow-x-auto"
                        dangerouslySetInnerHTML={{ __html: sub.diagramSvg }}
                      />
                    )}

                    {/* Student Answer Textarea */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Your Working Steps, Formula or Explanation:</span>
                        {isSubmitted && (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Locked Post-Submission
                          </span>
                        )}
                      </div>
                      <Textarea
                        disabled={isSubmitted || isSubmitting}
                        value={currentVal}
                        onChange={e => setPartAnswers(prev => ({ ...prev, [partKey]: e.target.value }))}
                        placeholder="Write out your answer, steps, formula, or derivation here..."
                        className={cn(
                          'rounded-2xl min-h-[95px] text-xs font-sans transition-all',
                          isSubmitted
                            ? 'bg-slate-950/90 border-slate-800 text-slate-300 opacity-90 cursor-not-allowed'
                            : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-amber-500 placeholder:text-slate-600'
                        )}
                      />
                    </div>

                    {/* Hint Toggle */}
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

                    {/* Sub-question AI Feedback and Model Solution */}
                    <div className="mt-4 border-t border-slate-800/80 pt-4">
                      {!isSubmitted ? (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs text-slate-400">
                          <Lock className="w-4 h-4 text-amber-400 shrink-0"/>
                          <span>Official Solution and Scoring Rubric are unlocked once your answers are submitted for AI evaluation.</span>
                        </div>
                      ) : (
                        <div className="space-y-4 animate-in fade-in duration-300">
                          {/* AI Evaluation Score & Step Breakdown */}
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

                          {/* Unlocked Model Solution */}
                          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                              <CheckCircle2 className="w-4 h-4 shrink-0"/>
                              <span>Official Model Solution & Marking Rubric</span>
                            </div>

                            {sub.modelAnswer && (
                              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-emerald-500/20 text-xs">
                                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">Model Answer / Benchmark:</span>
                                <div className="text-slate-100 font-bold">
                                  <MathRenderer content={sub.modelAnswer} />
                                </div>
                              </div>
                            )}

                            <div className="text-xs text-slate-300 leading-relaxed pt-1">
                              <MathRenderer content={sub.workedSolution || sub.modelAnswer || 'Follow official derivation steps.'} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* AI Grading Loading Skeleton */}
          {isSubmitting && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-2xl space-y-4 animate-pulse">
              <div className="flex items-center gap-3 text-amber-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-bold">
                  AI Examiner reviewing submission against WAEC Chief Examiner rubrics...
                </span>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-slate-800" />
                <Skeleton className="h-4 w-1/2 bg-slate-800" />
                <Skeleton className="h-20 w-full bg-slate-800 rounded-xl" />
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
                  disabled={isSubmitting || (!hasSubParts && !currentEssayText.trim())}
                  className="h-11 px-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Reviewing Submission...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit for AI Review & Marks</span>
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
