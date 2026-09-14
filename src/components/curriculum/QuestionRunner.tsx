'use client';

import React, { useState, useMemo } from 'react';
import {
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
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  CurriculumQuestionSet,
  CurriculumQuestion
} from '@/lib/global-curriculum-types';
import { recordQuizAttempt } from '@/lib/services/curriculumService';

interface QuestionRunnerProps {
  questionSet: CurriculumQuestionSet | null;
  topicTitle: string;
  gradeTier: string;
  levelId: string;
  subjectId: string;
  topicId: string;
  tenantId?: string;
  studentId?: string;
  onBack: () => void;
}

export function QuestionRunner({
  questionSet,
  topicTitle,
  gradeTier,
  levelId,
  subjectId,
  topicId,
  tenantId,
  studentId,
  onBack
}: QuestionRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answersLog, setAnswersLog] = useState<
    { questionId: string; selected: string; correct: string; isCorrect: boolean; points: number }[]
  >([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSuccess, setRecordSuccess] = useState(false);

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

  const questions: CurriculumQuestion[] = questionSet.questions;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const isCurrentCorrect = selectedOption === currentQuestion.correctAnswer;

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
        questionId: currentQuestion.id,
        selected: selectedOption,
        correct: currentQuestion.correctAnswer,
        isCorrect,
        points: isCorrect ? currentQuestion.points : 0
      }
    ]);
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      // Calculate final score
      const finalAnswers = [
        ...answersLog
      ];
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
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Accuracy</span>
                <span className="text-xl font-black text-emerald-400">{percentage}%</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Correct</span>
                <span className="text-xl font-black text-white">{correctCount}/{totalQuestions}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Points Earned</span>
                <span className="text-xl font-black text-indigo-400">+{totalScore}</span>
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
              <Button
                onClick={onBack}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                Next Curriculum Topic
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
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
              {questionSet.variantType === 'past_paper_variant' && (
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
                  WAEC / BECE Variant
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400">
                +{currentQuestion.points} Points
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
          {/* Prompt */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
              TOPIC CHALLENGE • {currentQuestion.id.toUpperCase()}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQuestion.prompt}
            </h3>
          </div>

          {/* Multiple Choice Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQuestion.options.map((option, idx) => {
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
                    <span className="text-sm font-medium">{option}</span>
                  </div>

                  {isVerified && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  {isVerified && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-400" />
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
                  💡 <strong>Hint:</strong> {currentQuestion.hint}
                </div>
              )}
            </div>
          )}

          {/* Worked Solution (In-Memory, Zero Network Reads) */}
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
                  <p className="text-xs leading-relaxed opacity-90">
                    {isCurrentCorrect
                      ? `Excellent! You solved this question correctly and earned +${currentQuestion.points} points.`
                      : `The expected correct answer is: "${currentQuestion.correctAnswer}". Review the derivation below.`}
                  </p>
                </div>
              </div>

              {/* Step-by-Step Worked Solution */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                  STEP-BY-STEP WORKED DERIVATION
                </span>
                <p className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                  {currentQuestion.workedSolution}
                </p>
              </div>
            </div>
          )}

          {/* Actions Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <span className="text-xs text-slate-500">
              {isVerified
                ? isLastQuestion
                  ? 'Final question completed'
                  : 'Ready for next question'
                : 'Select an option to verify'}
            </span>

            {!isVerified ? (
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
