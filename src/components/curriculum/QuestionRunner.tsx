'use client';

import React, { useState } from 'react';
import {
  Compass,
  ShieldAlert,
  Check,
  Layers,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  Lightbulb,
  BookOpen,
  Award,
  HelpCircle,
  Clock,
  Eye,
  EyeOff,
  FileText,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn, ensureArray } from '@/lib/utils';
import {
  CurriculumQuestionSet,
  CurriculumQuestion,
  StructuredQuestionPart
} from '@/lib/global-curriculum-types';
import { recordQuizAttempt } from '@/lib/services/curriculumService';
import { useFirestore } from '@/firebase';
import { completeStudentAssignment } from '@/lib/services/assignmentService';
import { MathRenderer } from './MathRenderer';
import { ActiveExamHeaderDisclaimer } from '@/components/exam/ExamDisclaimerNotice';
import { Paper2ExamRunner } from '@/components/exam/Paper2ExamRunner';

interface QuestionRunnerProps {
  questionSet: CurriculumQuestionSet | null;
  topicTitle: string;
  gradeTier: string;
  levelId: string;
  subjectId: string;
  topicId: string;
  tenantId?: string;
  studentId?: string;
  assignmentId?: string;
  onBack: () => void;
  onProceedToPaper2?: () => void;
}

export function QuestionRunner({
  questionSet: rawQuestionSet,
  topicTitle,
  gradeTier,
  levelId,
  subjectId,
  topicId,
  tenantId,
  studentId,
  assignmentId,
  onBack,
  onProceedToPaper2
}: QuestionRunnerProps) {
  const firestore = useFirestore();
  const effectiveAssignmentId = assignmentId || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('assignmentId') : null);

  // Defensive normalization: resolve questions if nested in paper1 or paper2
  const questionSet: CurriculumQuestionSet | null = React.useMemo(() => {
    if (!rawQuestionSet) return null;
    if (Array.isArray(rawQuestionSet.questions) && rawQuestionSet.questions.length > 0) return rawQuestionSet;
    const p1Q = (rawQuestionSet as any).paper1?.questions;
    const p2Q = (rawQuestionSet as any).paper2?.questions;
    const isP2 = (rawQuestionSet as any).paperType === 2 || (rawQuestionSet.id && rawQuestionSet.id.includes('_p2'));
    const chosen = isP2 ? (p2Q || p1Q) : (p1Q || p2Q);
    if (Array.isArray(chosen) && chosen.length > 0) {
      return {
        ...rawQuestionSet,
        questions: chosen,
        totalQuestions: rawQuestionSet.totalQuestions || chosen.length
      };
    }
    return rawQuestionSet;
  }, [rawQuestionSet]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // MCQ State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Structured Essay State (per sub-question part)
  const [partAnswers, setPartAnswers] = useState<Record<string, string>>({});
  const [revealedParts, setRevealedParts] = useState<Record<string, boolean>>({});
  const [showPartHints, setShowPartHints] = useState<Record<string, boolean>>({});

  const [answersLog, setAnswersLog] = useState<
    { questionId: string; selected: string; correct: string; isCorrect: boolean; points: number }[]
  >([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSuccess, setRecordSuccess] = useState(false);

  // --- REAL-TIME LIVE COUNTDOWN TIMER ---
  const examDurationMinutes = (questionSet as any)?.durationMinutes || 45;
  const initialDurationSeconds = examDurationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(initialDurationSeconds);
  const [timeElapsed, setTimeElapsed] = useState(0);

  React.useEffect(() => {
    if (isComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsComplete(true);
          return 0;
        }
        return prev - 1;
      });
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete]);

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs}h ${remMins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fallback / Empty State if no question set is seeded for this topic
  if (!questionSet || !questionSet.questions || questionSet.questions.length === 0) {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
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
            Selected Node: <strong className="text-indigo-300">{topicTitle}</strong>
          </span>
        </div>

        <Card className="bg-slate-900/90 border border-slate-800 rounded-3xl p-10 text-center shadow-2xl">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-2">
              <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 text-xs px-3 py-0.5">
                {gradeTier}
              </Badge>
              <h3 className="text-xl font-bold text-white">
                Curriculum modules for this topic are being synchronized.
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standardized practice sets for &ldquo;{topicTitle}&rdquo; are currently being aligned with national WAEC/BECE syllabus benchmarks. Please check back shortly or explore neighboring syllabus modules.
              </p>
            </div>
            <div className="pt-4">
              <Button
                onClick={onBack}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Browse Other Modules
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Defensively resolve question pool checking both tasks and questions
  const allQuestionItems: CurriculumQuestion[] = (Array.isArray(questionSet.questions) && questionSet.questions.length > 0)
    ? questionSet.questions
    : (Array.isArray((questionSet as any).tasks) && (questionSet as any).tasks.length > 0
      ? (questionSet as any).tasks
      : []);

  // Check if question set has objective multiple choice drills
  const hasObjectiveQuestions = allQuestionItems.some((q: any) =>
    q.section === 'objective' ||
    q.type === 'multiple_choice' ||
    q.format === 'multiple_choice' ||
    (Array.isArray(q.options) && q.options.length > 0)
  );

  // Delegate Paper 2 Structured Theory sessions to dedicated Paper2ExamRunner
  // ONLY if all questions are structured essays OR paperType === 2, but NOT if there are objective questions!
  const isPaper2Exam = !hasObjectiveQuestions && (
    questionSet.format === 'structured_essay' ||
    (questionSet as any).paperType === 2 ||
    (questionSet.id && (questionSet.id.includes('_p2') || questionSet.id.includes('paper2')))
  );

  if (isPaper2Exam) {
    return (
      <Paper2ExamRunner
        questionSet={questionSet}
        schoolId={tenantId}
        studentId={studentId}
        assignmentId={assignmentId}
        onBack={onBack}
      />
    );
  }

  const questions: CurriculumQuestion[] = allQuestionItems;
  const currentQuestion = questions[currentIndex];
  const currentQuestionId = String(
    currentQuestion?.id ||
    (currentQuestion?.number ? `q${String(currentQuestion.number).padStart(2, '0')}` : `q${String(currentIndex + 1).padStart(2, '0')}`)
  );
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Detect whether this question is an objective multiple-choice question
  const isObjective =
    currentQuestion?.section === "objective" ||
    currentQuestion?.type === "multiple_choice" ||
    currentQuestion?.format === "multiple_choice" ||
    (Array.isArray(currentQuestion?.options) && currentQuestion.options.length > 0);

  // Detect whether this question is a Structured Essay with sub-parts or standalone written essay
  const isStructuredEssay = !isObjective && (
    currentQuestion?.section === "theory" ||
    currentQuestion?.format === "structured_essay" ||
    currentQuestion?.type === "structured_essay" ||
    (Array.isArray(currentQuestion?.parts) && currentQuestion.parts.length > 0) ||
    (!currentQuestion?.options || currentQuestion.options.length === 0)
  );

  const parts: StructuredQuestionPart[] = currentQuestion.parts || [];

  const isCurrentCorrect = selectedOption === currentQuestion.correctAnswer;

  // Handler for MCQ Verification
  const handleVerify = () => {
    if (!selectedOption) return;
    setIsVerified(true);

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    setAnswersLog((prev) => [
      ...prev,
      {
        questionId: currentQuestionId,
        selected: selectedOption,
        correct: currentQuestion.correctAnswer || '',
        isCorrect,
        points: isCorrect ? currentQuestion.points : 0
      }
    ]);
  };

  // Toggle reveal for a specific sub-part
  const togglePartSolution = (partKey: string) => {
    setRevealedParts((prev) => ({
      ...prev,
      [partKey]: !prev[partKey]
    }));
  };

  // Toggle hint for a specific sub-part
  const togglePartHint = (partKey: string) => {
    setShowPartHints((prev) => ({
      ...prev,
      [partKey]: !prev[partKey]
    }));
  };

  // Reveal all solutions for the current structured essay question
  const revealAllPartSolutions = () => {
    const next: Record<string, boolean> = {};
    parts.forEach((_, idx) => {
      next[`${currentQuestionId}_p${idx}`] = true;
    });
    setRevealedParts((prev) => ({ ...prev, ...next }));
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      // Calculate final score
      const finalAnswers = [...answersLog];
      const totalScore = finalAnswers.reduce((acc, curr) => acc + curr.points, 0);
      const maxScore = questions.reduce((acc, curr) => acc + curr.points, 0);
      const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

      setIsComplete(true);

      // Trigger celebration
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 }
      });

      // Persist results strictly to tenant's isolated path if tenantId and studentId exist
      if (tenantId && studentId) {
        setIsRecording(true);
        try {
          const answerMap: Record<string, string> = {};
          finalAnswers.forEach((a) => {
            answerMap[a.questionId] = a.selected;
          });

          await recordQuizAttempt(tenantId, studentId, {
            setId: questionSet.id,
            levelId: levelId as any,
            subjectId,
            topicId,
            answers: answerMap,
            score: totalScore,
            maxScore,
            percentage,
            status: 'completed',
            startedAt: new Date().toISOString()
          });
          setRecordSuccess(true);

          if (effectiveAssignmentId && firestore) {
            try {
              await completeStudentAssignment(firestore, {
                schoolId: tenantId,
                assignmentId: effectiveAssignmentId,
                studentUid: studentId,
                score: totalScore,
                maxScore,
                answers: answerMap
              });
            } catch (assignErr) {
              console.warn('[QuestionRunner] Assignment completion logging failed:', assignErr);
            }
          }
        } catch (err) {
          console.error('[QuestionRunner] Error recording attempt:', err);
        } finally {
          setIsRecording(false);
        }
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsVerified(false);
      setShowHint(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsVerified(false);
    setShowHint(false);
    setPartAnswers({});
    setRevealedParts({});
    setShowPartHints({});
    setAnswersLog([]);
    setIsComplete(false);
    setRecordSuccess(false);
  };

  // Completion Screen
  if (isComplete) {
    const totalScore = answersLog.reduce((acc, curr) => acc + curr.points, 0);
    const maxScore = questions.reduce((acc, curr) => acc + curr.points, 0);
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const correctCount = answersLog.filter((a) => a.isCorrect).length;

    return (
      <div className="space-y-4 animate-in zoom-in-95 duration-300">
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
            Completed: <strong className="text-indigo-300">{questionSet.title}</strong>
          </span>
        </div>

        <Card className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
          <div className="max-w-lg mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/10">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-0.5">
                PRACTICE SET COMPLETED
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {percentage >= 70 ? 'Outstanding Mastery!' : 'Good Effort! Keep Practicing'}
              </h2>
              <p className="text-xs text-slate-400">
                You scored <strong className="text-emerald-400">{totalScore}</strong> out of{' '}
                <strong className="text-white">{maxScore} points</strong> ({correctCount} of {totalQuestions} correct).
              </p>
            </div>

            {/* Score Pill Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Accuracy</span>
                <span className="text-lg sm:text-xl font-black text-emerald-400">{percentage}%</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Correct</span>
                <span className="text-lg sm:text-xl font-black text-white">{correctCount}/{totalQuestions}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Time Used</span>
                <span className="text-lg sm:text-xl font-black text-cyan-400">{formatCountdown(timeElapsed)}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Points Earned</span>
                <span className="text-lg sm:text-xl font-black text-indigo-400">+{totalScore}</span>
              </div>
            </div>

            {recordSuccess && (
              <p className="text-xs text-emerald-400 font-medium flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Attempt record saved securely to student profile.
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleRestart}
                className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Practice Again
              </Button>
              {onProceedToPaper2 ? (
                <Button
                  onClick={onProceedToPaper2}
                  className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-black px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] border border-amber-400/40"
                >
                  <FileText className="w-4 h-4" />
                  <span>Proceed to Paper 2 (Theory)</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={onBack}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Next Curriculum Topic
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Extract or resolve exam year if available
  const examYear = questionSet?.year 
    ? Number(questionSet.year) 
    : (() => {
        const m = (questionSet?.title || '').match(/\b(19\d{2}|20\d{2})\b/);
        return m ? parseInt(m[1], 10) : null;
      })();

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <ActiveExamHeaderDisclaimer year={examYear} />
      {/* Top Header / Breadcrumb */}
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
          Module: <strong className="text-indigo-300">{questionSet.title}</strong>
        </span>
      </div>

      {/* Main Runner Card */}
      <Card className="rounded-[32px] bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden text-white">
        {/* Card Header & Stepper Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 p-6 sm:p-8 border-b border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-600 text-white font-bold text-xs px-2.5 py-0.5">
                Question {currentIndex + 1} of {totalQuestions}
              </Badge>
              <Badge variant="outline" className="border-slate-700 text-slate-300 text-xs">
                {gradeTier}
              </Badge>
              {isStructuredEssay ? (
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px]">
                  Paper 2 Structured Theory
                </Badge>
              ) : (
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-[10px]">
                  Objective Test (Paper 1)
                </Badge>
              )}
              {questionSet.variantType === 'past_paper_variant' && (
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
                  WAEC / BECE Variant
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Real-time Countdown Timer Badge */}
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-mono font-black transition-all shadow-inner",
                timeLeft <= 60 
                  ? "bg-red-500/25 border-red-500/60 text-red-300 animate-pulse shadow-red-500/20" 
                  : timeLeft <= 300 
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-300" 
                  : "bg-slate-950/90 border-cyan-500/40 text-cyan-300 shadow-slate-950"
              )}>
                <Clock className={cn("w-3.5 h-3.5", timeLeft <= 60 ? "text-red-400 animate-spin" : "text-cyan-400")} />
                <span>{timeLeft <= 0 ? 'Time Expired' : formatCountdown(timeLeft)}</span>
              </div>
              <span className="text-xs font-bold text-indigo-400">
                +{currentQuestion.totalMarks || currentQuestion.points} Marks
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-1.5 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <CardContent className="p-6 sm:p-10 space-y-6">
          {/* Question Title & Header Prompt */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                {isStructuredEssay
                  ? `THEORY SECTION • ${currentQuestionId.toUpperCase()}`
                  : `OBJECTIVE CHALLENGE • ${currentQuestionId.toUpperCase()}`}
              </span>
              {currentQuestion.totalMarks && (
                <Badge variant="secondary" className="bg-slate-800 text-indigo-300 text-xs font-semibold">
                  [{currentQuestion.totalMarks} Total Marks]
                </Badge>
              )}
            </div>

            {/* Reading Comprehension Passage (Passage Comes First) */}
            {(() => {
              const qNum = currentQuestion.number ?? (currentIndex + 1);
              const secA = (questionSet as any)?.sectionA_comprehension;
              
              let passageTitle = currentQuestion.passageTitle;
              let passageText = currentQuestion.passageText;

              if (!passageText && secA) {
                if (qNum <= 6 && secA.passage1?.text) {
                  passageTitle = passageTitle || secA.passage1.passageTitle || 'Passage I';
                  passageText = secA.passage1.text;
                } else if (qNum > 6 && qNum <= 11 && secA.passage2?.text) {
                  passageTitle = passageTitle || secA.passage2.passageTitle || 'Passage II';
                  passageText = secA.passage2.text;
                }
              }

              if (!passageText) return null;

              return (
                <div className="my-4 rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-indigo-950/50 via-slate-900/90 to-slate-950 p-5 sm:p-7 shadow-2xl backdrop-blur-sm transition-all duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-400 shadow-sm">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
                          Reading Comprehension Passage
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                          {passageTitle || 'Passage'}
                        </h4>
                      </div>
                    </div>
                    <Badge className="bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                      Read Passage First
                    </Badge>
                  </div>

                  <div className="max-h-[380px] overflow-y-auto pr-3 text-slate-100 text-sm sm:text-base leading-relaxed sm:leading-loose whitespace-pre-line font-serif bg-slate-950/70 p-4 sm:p-6 rounded-xl border border-slate-800/80 shadow-inner selection:bg-indigo-500/30">
                    {passageText}
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-indigo-300/80 font-medium">
                    <span>↓</span>
                    <span>Read the passage above carefully, then answer the question below</span>
                    <span>↓</span>
                  </div>
                </div>
              );
            })()}

            {currentQuestion.title && (
              <h3 className="text-lg sm:text-xl font-black text-white">
                {currentQuestion.title}
              </h3>
            )}

            {currentQuestion.prompt && (
              <div className="text-sm sm:text-base text-slate-200 leading-relaxed">
                <MathRenderer content={currentQuestion.prompt} />
              </div>
            )}

            {/* SVG Diagram Rendering (Geometry, Venn Diagrams, Coordinate Planes) */}
            {currentQuestion.diagramSvg && (
              <div className="my-5 p-5 sm:p-7 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl flex flex-col items-center justify-center overflow-x-auto">
                <div
                  className="w-full max-w-lg flex justify-center [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:rounded-xl [&>svg]:drop-shadow-md"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.diagramSvg }}
                />
                <span className="text-[11px] text-slate-500 font-mono mt-3 tracking-wider uppercase font-semibold">
                  Figure Illustration • {currentQuestion.title || `Question ${currentIndex + 1}`}
                </span>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* 1. STRUCTURED ESSAY MODE (Paper 2)                          */}
          {/* ============================================================ */}
          {isStructuredEssay ? (
            <div className="space-y-6 pt-2">
              {/* Top Carousel Navigation Bar: Flip Directly to Any Theory Topic */}
              {Array.isArray((questionSet as any)?.theoryTopicList) && (questionSet as any).theoryTopicList.length > 0 && (
                <div className="bg-slate-950/80 border border-indigo-500/20 p-4 rounded-3xl space-y-2 mb-2 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-1">
                    <span className="flex items-center gap-2 text-indigo-400">
                      <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                      <span>Section B: Interactive Theory Writing Tasks (Flip Directly to Any Topic)</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                      {(questionSet as any).theoryTopicList.length} Flippable Topics
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {(questionSet as any).theoryTopicList.map((topic: any) => {
                      const isCurrent = currentIndex === (topic.questionNumber - 1);
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => {
                            setCurrentIndex(topic.questionNumber - 1);
                            setSelectedOption(null);
                            setIsSubmitted(false);
                          }}
                          className={cn(
                            "px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 border",
                            isCurrent
                              ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-400/50 shadow-lg shadow-indigo-600/30 scale-[1.02]"
                              : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                          )}
                        >
                          <span className={cn(
                            "w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0",
                            isCurrent ? "bg-white text-indigo-700" : "bg-slate-800 text-slate-400"
                          )}>
                            {topic.theoryIndex}
                          </span>
                          <div className="text-left">
                            <div className="leading-tight">{topic.title}</div>
                            {topic.category && (
                              <span className={cn("text-[9px] block font-normal opacity-75", isCurrent ? "text-indigo-200" : "text-slate-500")}>
                                {topic.category}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {parts.length > 0 ? (
                parts.map((part, pIdx) => {
                  const partKey = `${currentQuestionId}_p${pIdx}`;
                  const isRevealed = !!revealedParts[partKey];
                  const isHintShown = !!showPartHints[partKey];
                  const currentVal = partAnswers[partKey] || '';

                  return (
                    <div
                      key={pIdx}
                      className="p-5 sm:p-6 rounded-3xl bg-slate-950/70 border border-slate-800 space-y-4 shadow-lg hover:border-slate-700 transition-colors"
                    >
                      {/* Sub-question Header */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-mono font-black text-sm flex items-center justify-center">
                            {part.partLabel}
                          </span>
                          <span className="text-xs font-semibold text-slate-300">
                            Sub-Question Part {part.partLabel}
                          </span>
                        </div>
                        <Badge className="bg-indigo-950 text-indigo-300 border-indigo-700/50 text-xs px-2.5 py-0.5 font-bold">
                          [{part.marks} Marks]
                        </Badge>
                      </div>

                      {/* Sub-question Prompt with LaTeX */}
                      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-sm text-slate-100 leading-relaxed whitespace-pre-line">
                        <MathRenderer content={(part.prompt || '').replace(/\\n/g, '\n')} />
                      </div>

                      {/* Sub-part Specific Diagram (if any) */}
                      {part.diagramSvg && (
                        <div className="my-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex justify-center overflow-x-auto">
                          <div
                            className="max-w-md [&>svg]:max-w-full [&>svg]:h-auto"
                            dangerouslySetInnerHTML={{ __html: part.diagramSvg }}
                          />
                        </div>
                      )}

                      {/* Student Working / Answer Draft Area */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Your Derivation / Working Notes (Draft):</span>
                        </label>
                        <Textarea
                          value={currentVal}
                          onChange={(e) =>
                            setPartAnswers((prev) => ({
                              ...prev,
                              [partKey]: e.target.value
                            }))
                          }
                          placeholder="Write out your intermediate steps, formula, or final answer here..."
                          className="bg-slate-900 border-slate-800 text-slate-200 placeholder:text-slate-600 rounded-2xl min-h-[70px] text-xs font-mono focus:border-indigo-500"
                        />
                      </div>

                      {/* Hint & Solution Toggles */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                        {part.hint ? (
                          <button
                            type="button"
                            onClick={() => togglePartHint(partKey)}
                            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>{isHintShown ? 'Hide Pedagogical Hint' : 'Need a hint for this part?'}</span>
                          </button>
                        ) : <div />}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => togglePartSolution(partKey)}
                          className={cn(
                            'text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5',
                            isRevealed
                              ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/60'
                              : 'border-slate-700 bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white'
                          )}
                        >
                          {isRevealed ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hide Solution & Rubric</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Reveal Solution & Rubric</span>
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Part Hint Box */}
                      {isHintShown && part.hint && (
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed animate-in fade-in">
                          💡 <strong>Hint {part.partLabel}:</strong> <MathRenderer content={part.hint} />
                        </div>
                      )}

                      {/* Step-by-Step Marking Scheme & Derivation Box */}
                      {isRevealed && (
                        <div className="space-y-3 pt-3 border-t border-slate-800 animate-in fade-in duration-200">
                          {/* Model Answer Pill */}
                          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">
                                OFFICIAL TARGET VALUE / MODEL ANSWER:
                              </span>
                              <div className="text-xs font-bold text-white">
                                <MathRenderer content={part.modelAnswer} />
                              </div>
                            </div>
                          </div>

                          {/* Worked Marking Derivation */}
                          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                                STEP-BY-STEP MARKING SCHEME & RUBRIC • [{part.marks} MARKS]
                              </span>
                            </div>
                            <div className="text-xs text-slate-200 leading-relaxed">
                              <MathRenderer content={part.workedSolution} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                (() => {
                  const standaloneKey = `${currentQuestionId}_essay`;
                  const currentVal = partAnswers[standaloneKey] || partAnswers[currentQuestionId] || '';
                  const isRevealed = !!revealedParts[standaloneKey];
                  const isHintShown = !!showPartHints[standaloneKey];
                  const wordCount = currentVal.trim() ? currentVal.trim().split(/\s+/).filter(Boolean).length : 0;
                  const charCount = currentVal.length;
                  const marks = currentQuestion.totalMarks || currentQuestion.points || 30;

                                    const scaffold = (currentQuestion as any).guidanceScaffold;
                  const rubric = (currentQuestion as any).rubric;
                  const wordLimit = (currentQuestion as any).wordCountLimit || { min: 180, target: 250, max: 320 };
                  const wordStatus = wordCount < wordLimit.min ? 'under' : wordCount > wordLimit.max ? 'over' : 'optimal';

                  return (
                    <div className="p-5 sm:p-7 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-5 shadow-2xl backdrop-blur-md">
                      {/* Essay Task Top Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2.5">
                          <span className="w-9 h-9 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-mono font-black text-base flex items-center justify-center">
                            ✍️
                          </span>
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              <span>{(currentQuestion as any).title || (currentQuestion as any).category || 'Written Essay Composition'}</span>
                              {(currentQuestion as any).theoryIndex && (
                                <Badge variant="outline" className="border-indigo-500/30 text-indigo-300 bg-indigo-500/10 text-[10px]">
                                  Topic {(currentQuestion as any).theoryIndex} of 10
                                </Badge>
                              )}
                            </div>
                            {(currentQuestion as any).shortSummary && (
                              <p className="text-[11px] text-slate-400 max-w-xl">
                                {(currentQuestion as any).shortSummary}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={cn(
                            "text-xs px-3 py-1 font-semibold",
                            wordStatus === 'optimal'
                              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                              : wordStatus === 'under'
                              ? "bg-amber-950/60 border-amber-500/40 text-amber-300"
                              : "bg-rose-950/60 border-rose-500/40 text-rose-300"
                          )}>
                            Target: ~{wordLimit.target} Words ({wordLimit.min}–{wordLimit.max})
                          </Badge>
                          <Badge className="bg-indigo-950 text-indigo-300 border-indigo-700/50 text-xs px-3 py-1 font-bold">
                            [{marks} Marks • WAEC Standard]
                          </Badge>
                        </div>
                      </div>

                      {/* Interactive Guidance Scaffold Panel (When Present) */}
                      {scaffold && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-4">
                          <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                            <span className="flex items-center gap-2">
                              <Compass className="w-4 h-4 text-indigo-400" />
                              <span>Interactive Writing Scaffold & Architectural Guidance</span>
                            </span>
                            <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-[10px]">
                              {scaffold.letterType.toUpperCase().replace('_', ' ')}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            {/* 1. Address Scaffold */}
                            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                              <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider text-indigo-400">
                                📍 Sender Address Architecture
                              </span>
                              <div className="text-[11px] text-slate-300 space-y-0.5 font-mono">
                                <div>Style: <strong className="text-white capitalize">{scaffold.senderAddress.recommendedStyle}</strong> ({scaffold.senderAddress.recommendedPunctuation} punctuation)</div>
                                {scaffold.senderAddress.allowedDatingFormats && (
                                  <div>Dating Rule: <span className="text-emerald-400">{scaffold.senderAddress.allowedDatingFormats.join(' or ')}</span></div>
                                )}
                                {scaffold.senderAddress.prohibitedDatingFormats && (
                                  <div className="text-rose-400 text-[10px]">Banned: {scaffold.senderAddress.prohibitedDatingFormats.join(', ')}</div>
                                )}
                              </div>
                            </div>

                            {/* 2. Salutation & Caption Scaffold */}
                            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                              <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider text-indigo-400">
                                📜 Salutation & Subject Heading
                              </span>
                              <div className="text-[11px] text-slate-300 space-y-0.5">
                                <div>Salutation: <strong className="text-emerald-300 font-mono">{scaffold.salutationGuide.recommendedSalutation}</strong></div>
                                {scaffold.captionGuide?.isRequired ? (
                                  <div>Caption: <span className="font-mono text-cyan-300 font-bold">{scaffold.captionGuide.modelCaption}</span></div>
                                ) : (
                                  <div className="text-slate-500 italic">No subject heading required for friendly informal letters</div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Inside Address Warning if Required */}
                          {scaffold.insideAddress?.isRequired && (
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
                              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <div className="text-[11px] leading-relaxed">
                                <strong>Formal Recipient Address Required:</strong> Left-hand margin below date. {scaffold.insideAddress.formatContaminationPenaltyWarning}
                              </div>
                            </div>
                          )}

                          {/* 3. 4-Paragraph Body Flow */}
                          {scaffold.bodyGuidance?.paragraphPrompts && (
                            <div className="space-y-2 pt-1 border-t border-slate-800">
                              <span className="font-bold text-slate-300 text-[11px] uppercase tracking-wider block">
                                📑 4-Paragraph Structural Roadmap:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                {scaffold.bodyGuidance.paragraphPrompts.map((p: any) => (
                                  <div key={p.paragraphIndex} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                                    <div className="font-bold text-indigo-300 flex items-center justify-between">
                                      <span>Paragraph {p.paragraphIndex}:</span>
                                      <span className="text-[10px] text-slate-400 font-mono capitalize">{p.role.replace(/_/g, ' ')}</span>
                                    </div>
                                    <p className="text-slate-200 leading-snug">{p.guidingQuestion}</p>
                                    {p.transitionHints && (
                                      <div className="text-[10px] text-slate-400 italic">
                                        Transitions: "{p.transitionHints[0]}"
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 4. Sign-Off Guide */}
                          {scaffold.signOffGuide && (
                            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <span className="text-indigo-400 font-bold uppercase tracking-wider mr-2">Valediction:</span>
                                <strong className="text-emerald-300 font-mono">{scaffold.signOffGuide.subscription}</strong>
                              </div>
                              <div className="text-slate-400 italic">
                                {scaffold.signOffGuide.coOccurrenceConstraint}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Essay Working / Answer Workspace */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="font-semibold flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Write your complete essay or written answer:</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-mono px-2.5 py-0.5 rounded-lg border text-[11px] font-bold transition-colors",
                              wordCount >= wordLimit.min && wordCount <= wordLimit.max
                                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                                : wordCount < wordLimit.min
                                ? "bg-amber-950/60 border-amber-500/40 text-amber-300"
                                : "bg-rose-950/60 border-rose-500/40 text-rose-300"
                            )}>
                              {wordCount} / {wordLimit.target} Words {wordCount < wordLimit.min && `(${wordLimit.min - wordCount} to min)`}
                            </span>
                            <span className="font-mono text-slate-500 text-[10px]">
                              {charCount} chars
                            </span>
                          </div>
                        </div>
                        <Textarea
                          value={currentVal}
                          onChange={(e) =>
                            setPartAnswers((prev) => ({
                              ...prev,
                              [standaloneKey]: e.target.value
                            }))
                          }
                          placeholder="Write out your complete essay composition, paragraphs, arguments, or solution here..."
                          className="bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-600 rounded-2xl min-h-[220px] text-xs font-sans leading-relaxed focus:border-indigo-500"
                        />
                      </div>

                      {/* Hint & Solution Toggles */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                        {currentQuestion.hint ? (
                          <button
                            type="button"
                            onClick={() => togglePartHint(standaloneKey)}
                            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>{isHintShown ? 'Hide Pedagogical Hint' : 'Need an essay writing tip?'}</span>
                          </button>
                        ) : <div />}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => togglePartSolution(standaloneKey)}
                          className={cn(
                            'text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5',
                            isRevealed
                              ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/60'
                              : 'border-slate-700 bg-slate-850 text-slate-300 hover:bg-slate-800 hover:text-white'
                          )}
                        >
                          {isRevealed ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hide Model Solution & Rubric</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Reveal Model Solution & Rubric</span>
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Hint Box */}
                      {isHintShown && currentQuestion.hint && (
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed animate-in fade-in">
                          💡 <strong>Guidance:</strong> <MathRenderer content={currentQuestion.hint} />
                        </div>
                      )}

                      {/* Step-by-Step Marking Scheme Box */}
                      {isRevealed && (
                        <div className="space-y-3 pt-3 border-t border-slate-800 animate-in fade-in duration-200">
                          {(currentQuestion as any).modelAnswer && (
                            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2.5">
                              <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-emerald-400 block uppercase tracking-wider">
                                  OFFICIAL MODEL ESSAY / BENCHMARK:
                                </span>
                                <div className="text-xs font-bold text-white whitespace-pre-line">
                                  <MathRenderer content={(currentQuestion as any).modelAnswer} />
                                </div>
                              </div>
                            </div>
                          )}

                          {rubric && rubric.criteria && (
                            <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-3">
                              <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                                🏆 WAEC 4-TIER MARKING RUBRIC BREAKDOWN • [{rubric.totalMarks || 30} TOTAL MARKS]
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                {Object.entries(rubric.criteria).map(([critKey, critVal]: [string, any]) => (
                                  <div key={critKey} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                                    <div className="flex items-center justify-between font-bold text-white">
                                      <span className="capitalize">{critVal.displayName || critKey}</span>
                                      <Badge className="bg-indigo-600/20 text-indigo-300 text-[10px]">
                                        {critVal.maxMarks} Marks
                                      </Badge>
                                    </div>
                                    {critVal.scoringGuidelines && (
                                      <ul className="text-[11px] text-slate-300 list-disc list-inside space-y-0.5">
                                        {critVal.scoringGuidelines.map((g: string, gi: number) => (
                                          <li key={gi}>{g}</li>
                                        ))}
                                      </ul>
                                    )}
                                    {critVal.diagnosticChecklist && (
                                      <div className="pt-1 text-[10px] text-emerald-400">
                                        ✓ Checklist: {critVal.diagnosticChecklist.join(' • ')}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {currentQuestion.workedSolution && (
                            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                              <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                                STEP-BY-STEP MARKING RUBRIC • [{marks} MARKS]
                              </span>
                              <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                                <MathRenderer content={currentQuestion.workedSolution} />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()
              )}

              {/* Reveal All Helper (only if parts exist) */}
              {parts.length > 0 && (
                <div className="flex justify-end pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={revealAllPartSolutions}
                    className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-950/30 cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Reveal All Marking Rubrics for this Question
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* ============================================================ */
            /* 2. STANDARD MULTIPLE CHOICE MODE (Paper 1)                   */
            /* ============================================================ */
            <>
              {/* Multiple Choice Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQuestion.options &&
                  currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    const isCorrectOption = option === currentQuestion.correctAnswer;

                    let cardStyle =
                      'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850';

                    if (isSelected && !isVerified) {
                      cardStyle = 'bg-indigo-950/60 border-indigo-500 text-white shadow-lg shadow-indigo-500/10';
                    } else if (isVerified) {
                      if (isCorrectOption) {
                        cardStyle = 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold shadow-md shadow-emerald-500/20';
                      } else if (isSelected && !isCorrectOption) {
                        cardStyle = 'bg-rose-950/70 border-rose-500 text-rose-300 shadow-md shadow-rose-500/20';
                      } else {
                        cardStyle = 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isVerified}
                        onClick={() => setSelectedOption(option)}
                        className={cn(
                          'p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer disabled:cursor-default',
                          cardStyle
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              'w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono transition-colors',
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-400'
                            )}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <div className="text-sm font-medium">
                            <MathRenderer content={option} />
                          </div>
                        </div>

                        {isVerified && isCorrectOption && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        )}
                        {isVerified && isSelected && !isCorrectOption && (
                          <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
              </div>

              {/* Hint Accordion/Trigger */}
              {!isVerified && currentQuestion.hint && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowHint((prev) => !prev)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Pedagogical Hint' : 'Need a hint?'}</span>
                  </button>
                  {showHint && (
                    <div className="mt-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed animate-in fade-in">
                      💡 <strong>Hint:</strong> <MathRenderer content={currentQuestion.hint} />
                    </div>
                  )}
                </div>
              )}

              {/* Worked Solution */}
              {isVerified && (
                <div className="space-y-3 pt-3 border-t border-slate-800 animate-in fade-in duration-300">
                  <div
                    className={cn(
                      'p-4 rounded-2xl border flex items-start gap-3',
                      isCurrentCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    )}
                  >
                    {isCurrentCorrect ? (
                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-rose-400" />
                    )}
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm">
                        {isCurrentCorrect ? 'Correct Derivation!' : 'Correction Required'}
                      </h4>
                      <div className="text-xs leading-relaxed opacity-90">
                        {isCurrentCorrect
                          ? `Excellent! You solved this question correctly and earned +${currentQuestion.points} points.`
                          : (
                            <div>
                              <span>The expected correct answer is: </span>
                              <strong className="text-white">
                                <MathRenderer content={currentQuestion.correctAnswer || ''} />
                              </strong>
                              <span>. Review the derivation below.</span>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>

                  {/* Step-by-Step Worked Solution */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                      STEP-BY-STEP WORKED DERIVATION
                    </span>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      <MathRenderer content={currentQuestion.workedSolution || ''} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Actions Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <span className="text-xs text-slate-500">
              {isStructuredEssay
                ? `Structured Theory Question ${currentIndex + 1} of ${totalQuestions}`
                : isVerified
                ? isLastQuestion
                  ? 'Final question completed'
                  : 'Ready for next question'
                : 'Select an option to verify'}
            </span>

            {isStructuredEssay ? (
              <Button
                onClick={handleNext}
                className="h-11 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{isLastQuestion ? 'Complete Theory Exam' : 'Next Theory Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : !isVerified ? (
              <Button
                onClick={handleVerify}
                disabled={!selectedOption}
                className="h-11 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Verify Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="h-11 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{isLastQuestion ? 'Complete Practice Set' : 'Next Question'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
