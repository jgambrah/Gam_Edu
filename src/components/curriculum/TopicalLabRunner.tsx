'use client';

import React, { useState, useMemo } from 'react';
import {
  TopicalLabDocument,
  TopicalLabLevelKey,
  TopicalPracticeDifficulty,
  TopicalPracticeQuestion,
  WorkedExample
} from '@/lib/topical-lab-types';
import { MathRenderer } from './MathRenderer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  Layers,
  GraduationCap,
  RotateCcw,
  Target,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { awardActivityXP, triggerStudentBadgeEvent } from '@/lib/achievement-utils';
import { useFirestore } from '@/firebase';

interface TopicalLabRunnerProps {
  topicDoc: TopicalLabDocument;
  studentId?: string;
  initialLevel?: TopicalLabLevelKey;
  onBack: () => void;
}

const LEVEL_META: Record<TopicalLabLevelKey, { label: string; sub: string; badgeColor: string }> = {
  jhs1: {
    label: 'JHS 1',
    sub: 'Foundations & Terminology',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  },
  jhs2: {
    label: 'JHS 2',
    sub: 'Core Applications & Sharing',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  },
  jhs3: {
    label: 'JHS 3',
    sub: 'Advanced Rates & Exam Drills',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  }
};

export function TopicalLabRunner({
  topicDoc,
  studentId,
  initialLevel = 'jhs1',
  onBack
}: TopicalLabRunnerProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  // Tier level state: jhs1 | jhs2 | jhs3
  const [activeLevel, setActiveLevel] = useState<TopicalLabLevelKey>(initialLevel);

  // Active workspace tab: 'notes' | 'examples' | 'practice' | 'exam'
  const [activeTab, setActiveTab] = useState<'notes' | 'examples' | 'practice' | 'exam'>('notes');

  // Practice pool difficulty: low | medium | hard
  const [difficulty, setDifficulty] = useState<TopicalPracticeDifficulty>('low');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());

  // Current level data
  const currentLevelData = useMemo(() => {
    return (
      topicDoc.levels?.[activeLevel] || {
        levelTitle: `${activeLevel.toUpperCase()} Practice`,
        summary: '',
        notes: 'No concept notes available for this level yet.',
        workedExamples: [],
        practicePool: { low: [], medium: [], hard: [] }
      }
    );
  }, [topicDoc, activeLevel]);

  // Current question pool based on active difficulty
  const currentPool: TopicalPracticeQuestion[] = useMemo(() => {
    return currentLevelData.practicePool?.[difficulty] || [];
  }, [currentLevelData, difficulty]);

  const activeQuestion: TopicalPracticeQuestion | undefined = currentPool[activeQuestionIndex];

  // Reset question state when changing difficulty or level
  const handleDifficultyChange = (diff: TopicalPracticeDifficulty) => {
    setDifficulty(diff);
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleLevelChange = (lvl: TopicalLabLevelKey) => {
    setActiveLevel(lvl);
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
    setShowSolution(false);
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < currentPool.length - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setIsCorrect(false);
      setShowHint(false);
      setShowSolution(false);
    }
  };

  const handlePrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex((prev) => prev - 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setIsCorrect(false);
      setShowHint(false);
      setShowSolution(false);
    }
  };

  const handleCheckAnswer = async () => {
    if (!activeQuestion || !selectedOption) return;

    const correct = selectedOption.trim() === activeQuestion.correctAnswer.trim();
    setIsCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });

      setSolvedIds((prev) => new Set([...prev, activeQuestion.id]));

      // Award XP
      if (firestore && studentId) {
        try {
          const xp = activeQuestion.points * 10;
          await awardActivityXP(firestore, studentId, xp, 'Topical Lab Drill', 'stem_explorer');
          await triggerStudentBadgeEvent(firestore, studentId, { type: 'STEM_CHALLENGE_COMPLETED' });
        } catch (e) {
          console.warn('[TopicalLabRunner] Failed to record XP:', e);
        }
      }

      toast({
        title: 'Correct! 🎯',
        description: `+${activeQuestion.points * 10} XP earned for mastering this concept!`
      });
    } else {
      toast({
        title: 'Not quite right 🤔',
        description: 'Review the hint or step-by-step solution to understand the derivation.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ================= TOP NAV & LAB HEADER ================= */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="h-8 px-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span>All Topical Labs</span>
              </Button>

              <Badge variant="outline" className="text-[11px] font-bold border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                {topicDoc.badge || 'Strand Mastery'}
              </Badge>

              <Badge variant="outline" className="text-[11px] font-semibold border-slate-700 bg-slate-800/80 text-slate-300">
                {topicDoc.subject} • {topicDoc.tier}
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {topicDoc.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              {topicDoc.description}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto bg-slate-950/60 border border-slate-800/80 px-4 py-3 rounded-2xl">
            <div className="text-center px-2">
              <div className="text-lg font-black text-indigo-400">
                {topicDoc.totalPracticeQuestions || 27}
              </div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Practice Qs
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-lg font-black text-emerald-400">3 Tiers</div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                JHS 1 - 3
              </div>
            </div>
          </div>
        </div>

        {/* TIERED LEVEL SELECTOR (JHS 1, JHS 2, JHS 3) */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Select Learning Level:</span>
          </div>

          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
            {(['jhs1', 'jhs2', 'jhs3'] as TopicalLabLevelKey[]).map((lvl) => {
              const meta = LEVEL_META[lvl];
              const isActive = activeLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleLevelChange(lvl)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 border cursor-pointer flex flex-col items-center justify-center text-center',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border-indigo-400/40 shadow-lg shadow-indigo-600/30 scale-102'
                      : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border-slate-800'
                  )}
                >
                  <span className="text-sm font-black">{meta.label}</span>
                  <span className="text-[10px] opacity-75 font-normal hidden sm:inline">
                    {meta.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= WORKSPACE TABS ================= */}
      <Tabs
        value={activeTab}
        onValueChange={(val: any) => setActiveTab(val)}
        className="w-full space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
          <TabsList className="bg-slate-950/80 p-1 border border-slate-800 rounded-xl h-auto flex flex-wrap">
            <TabsTrigger
              value="notes"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1. Concept Notes & Rules</span>
            </TabsTrigger>
            <TabsTrigger
              value="examples"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>2. Worked Examples ({currentLevelData.workedExamples?.length || 0})</span>
            </TabsTrigger>
            <TabsTrigger
              value="practice"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>3. Graded Practice Pools</span>
            </TabsTrigger>
            {topicDoc.linkedExamQuestions && topicDoc.linkedExamQuestions.length > 0 && (
              <TabsTrigger
                value="exam"
                className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>BECE Exam Links ({topicDoc.linkedExamQuestions.length})</span>
              </TabsTrigger>
            )}
          </TabsList>

          <div className="text-xs font-semibold text-slate-400 px-3">
            Active: <span className="text-indigo-300 font-bold">{currentLevelData.levelTitle}</span>
          </div>
        </div>

        {/* ================= TAB 1: CONCEPT NOTES ================= */}
        <TabsContent value="notes" className="space-y-4 focus-visible:outline-none">
          <Card className="bg-slate-900/60 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="space-y-6">
              {currentLevelData.summary && (
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Focus Summary:</strong>
                    {currentLevelData.summary}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <MathRenderer
                  content={currentLevelData.notes}
                  className="prose-invert max-w-none text-slate-200"
                />
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-end">
                <Button
                  onClick={() => setActiveTab('examples')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  <span>Next: Explore Worked Examples</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ================= TAB 2: WORKED EXAMPLES ================= */}
        <TabsContent value="examples" className="space-y-4 focus-visible:outline-none">
          {(!currentLevelData.workedExamples || currentLevelData.workedExamples.length === 0) ? (
            <Card className="bg-slate-900/40 border-dashed border-slate-800 p-12 text-center rounded-3xl">
              <p className="text-sm text-slate-400">No worked examples added for this level yet.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {currentLevelData.workedExamples.map((example: WorkedExample, idx: number) => (
                <Card
                  key={example.id || idx}
                  className="bg-slate-900/70 border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-300 font-black text-xs flex items-center justify-center border border-indigo-500/30">
                        #{idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-white">{example.title}</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] text-indigo-300 border-indigo-500/30">
                      Step-by-Step Walkthrough
                    </Badge>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Problem:
                    </span>
                    <MathRenderer content={example.problem} className="text-slate-100 font-medium" />
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Derivation Steps:
                    </span>
                    <ol className="space-y-2.5 pl-2">
                      {example.steps.map((step: string, stepIdx: number) => (
                        <li key={stepIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {stepIdx + 1}
                          </span>
                          <div className="flex-1">
                            <MathRenderer content={step} />
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 mt-4 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Final Result:</span>
                    <MathRenderer content={example.finalAnswer} className="text-sm font-black text-white" />
                  </div>
                </Card>
              ))}

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setActiveTab('practice')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  <span>Ready to Practice: Open Graded Pools</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ================= TAB 3: GRADED PRACTICE POOLS ================= */}
        <TabsContent value="practice" className="space-y-5 focus-visible:outline-none">
          {/* Difficulty Tier Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Difficulty:</span>
              <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800 gap-1">
                {(['low', 'medium', 'hard'] as TopicalPracticeDifficulty[]).map((d) => {
                  const count = currentLevelData.practicePool?.[d]?.length || 0;
                  const isActive = difficulty === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDifficultyChange(d)}
                      className={cn(
                        'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 capitalize',
                        isActive
                          ? d === 'low'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : d === 'medium'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-purple-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200'
                      )}
                    >
                      <span>{d}</span>
                      <span className="text-[10px] opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Question {currentPool.length > 0 ? activeQuestionIndex + 1 : 0} of {currentPool.length}
            </div>
          </div>

          {/* Active Question Workstation */}
          {!activeQuestion ? (
            <Card className="bg-slate-900/40 border-dashed border-slate-800 p-12 text-center rounded-3xl">
              <p className="text-sm text-slate-400">
                No practice questions in the <strong className="capitalize">{difficulty}</strong> pool for this level yet.
              </p>
            </Card>
          ) : (
            <Card className="bg-slate-900/80 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-wider capitalize',
                      difficulty === 'low'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : difficulty === 'medium'
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    )}
                  >
                    {difficulty} Difficulty
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Question #{activeQuestionIndex + 1}
                  </span>
                </div>

                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                  +{activeQuestion.points * 10} XP
                </span>
              </div>

              {/* Prompt */}
              <div className="text-sm sm:text-base text-white font-medium leading-relaxed">
                <MathRenderer content={activeQuestion.prompt} />
              </div>

              {/* Diagram if available */}
              {activeQuestion.diagramSvg && (
                <div
                  className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex justify-center"
                  dangerouslySetInnerHTML={{ __html: activeQuestion.diagramSvg }}
                />
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeQuestion.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === opt;
                  const isOptionCorrect = opt.trim() === activeQuestion.correctAnswer.trim();

                  let optClass = 'bg-slate-950/60 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850/70 text-slate-200';
                  if (isAnswerSubmitted) {
                    if (isOptionCorrect) {
                      optClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected && !isOptionCorrect) {
                      optClass = 'bg-rose-950/40 border-rose-500 text-rose-300 font-medium';
                    }
                  } else if (isSelected) {
                    optClass = 'bg-indigo-950/40 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/30 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => {
                        if (!isAnswerSubmitted) setSelectedOption(opt);
                      }}
                      className={cn(
                        'p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer',
                        optClass
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <MathRenderer content={opt} />
                      </div>

                      {isAnswerSubmitted && isOptionCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !isOptionCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHint((prev) => !prev)}
                    className="h-8 text-xs bg-slate-950 border-slate-800 text-slate-300 hover:text-white rounded-xl cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5 mr-1 text-amber-400" />
                    <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                  </Button>

                  {isAnswerSubmitted && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSolution((prev) => !prev)}
                      className="h-8 text-xs bg-slate-950 border-slate-800 text-slate-300 hover:text-white rounded-xl cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                      <span>{showSolution ? 'Hide Solution' : 'View Worked Derivation'}</span>
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!isAnswerSubmitted ? (
                    <Button
                      onClick={handleCheckAnswer}
                      disabled={!selectedOption}
                      className="h-9 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50"
                    >
                      <span>Submit Answer</span>
                      <CheckCircle2 className="w-4 h-4 ml-1.5" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      disabled={activeQuestionIndex >= currentPool.length - 1}
                      className="h-9 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Hint Drawer */}
              {showHint && activeQuestion.hint && (
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-xs sm:text-sm animate-in fade-in">
                  <strong className="block text-amber-300 mb-1 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" /> Strategic Hint:
                  </strong>
                  <MathRenderer content={activeQuestion.hint} />
                </div>
              )}

              {/* Worked Solution Drawer */}
              {showSolution && activeQuestion.workedSolution && (
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-200 text-xs sm:text-sm animate-in fade-in space-y-2">
                  <strong className="block text-indigo-300 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" /> Detailed Step-by-Step Derivation:
                  </strong>
                  <MathRenderer content={activeQuestion.workedSolution} />
                </div>
              )}

              {/* Stepper Footer */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevQuestion}
                  disabled={activeQuestionIndex === 0}
                  className="h-8 text-xs text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>

                <div className="flex items-center gap-1.5">
                  {currentPool.map((q, idx) => {
                    const isDone = solvedIds.has(q.id);
                    const isCurr = idx === activeQuestionIndex;
                    return (
                      <button
                        key={q.id || idx}
                        type="button"
                        onClick={() => {
                          setActiveQuestionIndex(idx);
                          setSelectedOption(null);
                          setIsAnswerSubmitted(false);
                          setIsCorrect(false);
                          setShowHint(false);
                          setShowSolution(false);
                        }}
                        className={cn(
                          'w-2.5 h-2.5 rounded-full transition-all cursor-pointer',
                          isCurr
                            ? 'bg-indigo-400 w-5'
                            : isDone
                            ? 'bg-emerald-500'
                            : 'bg-slate-700 hover:bg-slate-500'
                        )}
                        title={`Question ${idx + 1}`}
                      />
                    );
                  })}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextQuestion}
                  disabled={activeQuestionIndex >= currentPool.length - 1}
                  className="h-8 text-xs text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* ================= TAB 4: LINKED BECE EXAM QUESTIONS ================= */}
        {topicDoc.linkedExamQuestions && topicDoc.linkedExamQuestions.length > 0 && (
          <TabsContent value="exam" className="space-y-4 focus-visible:outline-none">
            <Card className="bg-slate-900/60 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Historical BECE Past Examination Linkages
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  These official past exam questions directly test the competencies learned in this topic lab.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {topicDoc.linkedExamQuestions.map((eq, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/20 text-[10px]">
                        BECE {eq.year} • Paper {eq.paper} (Q{eq.questionNumber})
                      </Badge>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {eq.setId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 italic">
                      "{eq.promptSnippet}"
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
