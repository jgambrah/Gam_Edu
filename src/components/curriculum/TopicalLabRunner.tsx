'use client';

import React, { useState, useMemo } from 'react';
import {
  TopicalLabDocument,
  TopicalLabLevelKey,
  TopicalPracticeDifficulty,
  TopicalPracticeQuestion,
  WorkedExample
} from '@/lib/topical-lab-types';
import { CurriculumQuestionSet } from '@/lib/global-curriculum-types';
import { MathRenderer } from './MathRenderer';
import { QuestionRunner } from './QuestionRunner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Lightbulb,
  Award,
  Sparkles,
  GraduationCap,
  Target,
  ExternalLink,
  Layers,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { awardActivityXP, triggerStudentBadgeEvent } from '@/lib/achievement-utils';
import { useFirestore } from '@/firebase';

interface TopicalLabRunnerProps {
  topicDoc: TopicalLabDocument;
  studentId?: string;
  tenantId?: string;
  initialLevel?: TopicalLabLevelKey;
  onBack: () => void;
  onNavigateToSet?: (setId: string) => void;
}

const LEVEL_META: Record<string, { label: string; shortLabel: string; sub: string }> = {
  b7: {
    label: 'Basic 7 (JHS 1)',
    shortLabel: 'B7 (JHS 1)',
    sub: 'Foundations & Core Rules'
  },
  b8: {
    label: 'Basic 8 (JHS 2)',
    shortLabel: 'B8 (JHS 2)',
    sub: 'Applications & Direct Proportions'
  },
  b9: {
    label: 'Basic 9 (JHS 3)',
    shortLabel: 'B9 (JHS 3)',
    sub: 'Inverse Proportions & Advanced Rates'
  },
  jhs1: {
    label: 'Basic 7 (JHS 1)',
    shortLabel: 'B7 (JHS 1)',
    sub: 'Foundations & Core Rules'
  },
  jhs2: {
    label: 'Basic 8 (JHS 2)',
    shortLabel: 'B8 (JHS 2)',
    sub: 'Applications & Direct Proportions'
  },
  jhs3: {
    label: 'Basic 9 (JHS 3)',
    shortLabel: 'B9 (JHS 3)',
    sub: 'Inverse Proportions & Advanced Rates'
  }
};

export function TopicalLabRunner({
  topicDoc,
  studentId,
  tenantId,
  initialLevel = 'b7',
  onBack,
  onNavigateToSet
}: TopicalLabRunnerProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  // 1. Level Selector State (Basic 7, Basic 8, Basic 9)
  const [activeLevel, setActiveLevel] = useState<TopicalLabLevelKey>(initialLevel);

  // 2. Core Section Tabs State: 'notes_examples' | 'practice_labs' | 'past_exams'
  const [activeTab, setActiveTab] = useState<'notes_examples' | 'practice_labs' | 'past_exams'>('notes_examples');

  // 3. Practice Labs Difficulty Filter: 'low' | 'medium' | 'hard'
  const [difficulty, setDifficulty] = useState<TopicalPracticeDifficulty>('low');

  // State for collapsible worked examples in Tab 1
  const [expandedExampleIds, setExpandedExampleIds] = useState<Record<string, boolean>>({
    'we_0': true
  });

  // Current level data
  const currentLevelData = useMemo(() => {
    const levelKeyMap: Record<string, string[]> = {
      b7: ['b7', 'jhs1', 'basic7'],
      b8: ['b8', 'jhs2', 'basic8'],
      b9: ['b9', 'jhs3', 'basic9'],
      jhs1: ['b7', 'jhs1', 'basic7'],
      jhs2: ['b8', 'jhs2', 'basic8'],
      jhs3: ['b9', 'jhs3', 'basic9']
    };
    const possibleKeys = levelKeyMap[activeLevel] || [activeLevel];
    for (const key of possibleKeys) {
      if ((topicDoc.levels as any)?.[key]) return (topicDoc.levels as any)[key];
    }
    return {
      levelTitle: `${(LEVEL_META[activeLevel]?.label || activeLevel).toUpperCase()} Practice`,
      summary: '',
      notes: 'No concept notes available for this level yet.',
      workedExamples: [],
      practicePool: { low: [], medium: [], hard: [] }
    };
  }, [topicDoc, activeLevel]);

  // Current pool of practice questions
  const currentPool: TopicalPracticeQuestion[] = useMemo(() => {
    return currentLevelData.practicePool?.[difficulty] || [];
  }, [currentLevelData, difficulty]);

  // Adapt currentPool into CurriculumQuestionSet for QuestionRunner
  const adaptedQuestionSet: CurriculumQuestionSet = useMemo(() => {
    const diffLabel =
      difficulty === 'low'
        ? 'Foundational (Low - DOK 1)'
        : difficulty === 'medium'
        ? 'Intermediate (Medium - DOK 2)'
        : 'Advanced (Hard - DOK 3)';

    const activeMeta = LEVEL_META[activeLevel] || { label: activeLevel.toUpperCase() };

    return {
      id: `${topicDoc.id}_${activeLevel}_${difficulty}`,
      title: `${topicDoc.title} • ${activeMeta.label} [${diffLabel}]`,
      tier: topicDoc.tier,
      subject: topicDoc.subject,
      topic: topicDoc.title,
      variantType: 'standard',
      totalQuestions: currentPool.length,
      version: 1,
      format: 'multiple_choice',
      questions: currentPool.map((q) => ({
        id: q.id,
        prompt: q.prompt,
        options: q.options,
        correctAnswer: q.correctAnswer,
        hint: q.hint,
        workedSolution: q.workedSolution,
        points: q.points * 10,
        diagramSvg: q.diagramSvg
      }))
    };
  }, [topicDoc, activeLevel, difficulty, currentPool]);

  // Toggle individual worked example collapse
  const toggleExampleCollapse = (idKey: string) => {
    setExpandedExampleIds((prev) => ({
      ...prev,
      [idKey]: !prev[idKey]
    }));
  };

  const handleLevelSwitch = (lvl: TopicalLabLevelKey) => {
    setActiveLevel(lvl);
    // Expand the first example of the new level by default
    setExpandedExampleIds({ [`${lvl}_0`]: true });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ================= HEADER & LEVEL SELECTOR BAR ================= */}
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
                {topicDoc.badge || 'Strand 1: Number & Numeration'}
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
                {topicDoc.totalPracticeQuestions || 45}
              </div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Total Drills
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-lg font-black text-emerald-400">3 Levels</div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                JHS 1 - 3
              </div>
            </div>
          </div>
        </div>

        {/* LEVEL SELECTOR BAR (TOP): [ Basic 7 (JHS 1) ] | [ Basic 8 (JHS 2) ] | [ Basic 9 (JHS 3) ] */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Curriculum Level Selector:</span>
          </div>

          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
            {(['b7', 'b8', 'b9'] as const).map((lvl) => {
              const meta = LEVEL_META[lvl];
              const isActive = activeLevel === lvl || (lvl === 'b7' && activeLevel === 'jhs1') || (lvl === 'b8' && activeLevel === 'jhs2') || (lvl === 'b9' && activeLevel === 'jhs3');
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleLevelSwitch(lvl)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-200 border cursor-pointer flex flex-col items-center justify-center text-center',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border-indigo-400/50 shadow-lg shadow-indigo-600/30 scale-102'
                      : 'bg-slate-950/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 border-slate-800'
                  )}
                >
                  <span className="text-xs sm:text-sm font-black">{meta.label}</span>
                  <span className="text-[10px] opacity-75 font-normal hidden md:inline">
                    {meta.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= CORE SECTION TABS ================= */}
      <Tabs
        value={activeTab}
        onValueChange={(val: any) => setActiveTab(val)}
        className="w-full space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
          <TabsList className="bg-slate-950/80 p-1 border border-slate-800 rounded-xl h-auto flex flex-wrap">
            <TabsTrigger
              value="notes_examples"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Tab 1: 📖 Study Notes & Worked Examples</span>
            </TabsTrigger>

            <TabsTrigger
              value="practice_labs"
              className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Tab 2: 🎯 Practice Labs (Graded Drills)</span>
            </TabsTrigger>

            <TabsTrigger
              value="past_exams"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Tab 3: 📜 Past Exam Linkages</span>
              {topicDoc.linkedExamQuestions && (
                <span className="ml-1 text-[10px] opacity-80">({topicDoc.linkedExamQuestions.length})</span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="text-xs font-semibold text-slate-400 px-3">
            Active: <span className="text-indigo-300 font-bold">{currentLevelData.levelTitle}</span>
          </div>
        </div>

        {/* ================= TAB 1: STUDY NOTES & WORKED EXAMPLES ================= */}
        <TabsContent value="notes_examples" className="space-y-6 focus-visible:outline-none">
          {/* Summary Callout */}
          {currentLevelData.summary && (
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5">Focus Summary • {LEVEL_META[activeLevel].label}:</strong>
                {currentLevelData.summary}
              </div>
            </div>
          )}

          {/* Section A: Concept Notes */}
          <Card className="bg-slate-900/70 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Concept Notes & Principles</span>
              </h3>
              <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-700">
                KaTeX LaTeX Typography
              </Badge>
            </div>

            <div className="pt-2">
              <MathRenderer
                content={currentLevelData.notes}
                className="prose-invert max-w-none text-slate-200 leading-relaxed"
              />
            </div>
          </Card>

          {/* Section B: Collapsible Worked Examples */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Step-by-Step Worked Examples ({currentLevelData.workedExamples?.length || 0})</span>
              </h3>
              <span className="text-xs text-slate-400">Click any card to expand or collapse solution steps</span>
            </div>

            {(!currentLevelData.workedExamples || currentLevelData.workedExamples.length === 0) ? (
              <Card className="bg-slate-900/40 border-dashed border-slate-800 p-8 text-center rounded-3xl">
                <p className="text-xs text-slate-400">No worked examples added for {LEVEL_META[activeLevel].label} yet.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {currentLevelData.workedExamples.map((example: WorkedExample, idx: number) => {
                  const idKey = example.id || `${activeLevel}_${idx}`;
                  const isExpanded = !!expandedExampleIds[idKey];

                  return (
                    <Card
                      key={idKey}
                      className="bg-slate-900/80 border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all"
                    >
                      {/* Header with Accordion Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleExampleCollapse(idKey)}
                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-3 hover:bg-slate-850/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-300 font-black text-xs flex items-center justify-center border border-indigo-500/30 shrink-0">
                            #{idx + 1}
                          </span>
                          <div>
                            <h4 className="text-sm sm:text-base font-bold text-white">{example.title}</h4>
                            <span className="text-[11px] text-slate-400">
                              {isExpanded ? 'Click to collapse steps' : 'Click to show full step-by-step breakdown'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-[10px] text-indigo-300 border-indigo-500/30 hidden sm:inline-flex"
                          >
                            Model Solution
                          </Badge>
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>
                      </button>

                      {/* Collapsible Body */}
                      {isExpanded && (
                        <div className="px-5 sm:px-6 pb-6 pt-2 space-y-4 border-t border-slate-800/80 animate-in fade-in duration-200">
                          {/* Problem Statement */}
                          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Problem Statement:
                            </span>
                            <MathRenderer content={example.problem} className="text-slate-100 font-medium" />
                          </div>

                          {/* Steps */}
                          <div className="space-y-2 pt-1">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                              Step-by-Step Breakdown:
                            </span>
                            <ol className="space-y-2 pl-1">
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

                          {/* Highlighted Final Answer */}
                          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-400">Highlighted Final Answer:</span>
                            <MathRenderer content={example.finalAnswer} className="text-sm font-black text-white" />
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ================= TAB 2: PRACTICE LABS (GRADED DRILLS) ================= */}
        <TabsContent value="practice_labs" className="space-y-6 focus-visible:outline-none">
          {/* Difficulty Filter Pills */}
          <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Difficulty Filter:</span>
              <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800 gap-1.5">
                <button
                  type="button"
                  onClick={() => setDifficulty('low')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                    difficulty === 'low'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span>🟢 Foundational (Low - DOK 1)</span>
                  <span className="text-[10px] opacity-75">
                    ({currentLevelData.practicePool?.low?.length || 0})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDifficulty('medium')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                    difficulty === 'medium'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span>🟡 Intermediate (Medium - DOK 2)</span>
                  <span className="text-[10px] opacity-75">
                    ({currentLevelData.practicePool?.medium?.length || 0})
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDifficulty('hard')}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5',
                    difficulty === 'hard'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span>🔴 Advanced (Hard - DOK 3)</span>
                  <span className="text-[10px] opacity-75">
                    ({currentLevelData.practicePool?.hard?.length || 0})
                  </span>
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Active Tier: <strong className="text-white">{LEVEL_META[activeLevel].label}</strong> • {currentPool.length} Questions Ready
            </div>
          </div>

          {/* Interactive QuestionRunner Workstation */}
          {currentPool.length === 0 ? (
            <Card className="bg-slate-900/40 border-dashed border-slate-800 p-12 text-center rounded-3xl">
              <p className="text-sm text-slate-400">
                No practice questions in the selected pool for {LEVEL_META[activeLevel].label}.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              <QuestionRunner
                questionSet={adaptedQuestionSet}
                topicTitle={`${topicDoc.title} • ${LEVEL_META[activeLevel].label}`}
                gradeTier={topicDoc.tier}
                levelId="jhs"
                subjectId="mathematics"
                topicId={topicDoc.topicId}
                tenantId={tenantId}
                studentId={studentId}
                onBack={() => setActiveTab('notes_examples')}
              />
            </div>
          )}
        </TabsContent>

        {/* ================= TAB 3: PAST EXAM LINKAGES ================= */}
        <TabsContent value="past_exams" className="space-y-4 focus-visible:outline-none">
          <Card className="bg-slate-900/70 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Historical BECE Examination Linkages
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Official BECE past examination questions mapped directly to {topicDoc.title}.
              </p>
            </div>

            {(!topicDoc.linkedExamQuestions || topicDoc.linkedExamQuestions.length === 0) ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No linked past exam questions recorded for this topic.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {topicDoc.linkedExamQuestions.map((eq, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between gap-3 hover:border-amber-500/30 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/20 text-[11px] font-bold">
                          BECE {eq.year} • Paper {eq.paper} (Q{eq.questionNumber})
                        </Badge>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {eq.setId}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                        "{eq.promptSnippet}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/70 flex justify-end">
                      {onNavigateToSet ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onNavigateToSet(eq.setId)}
                          className="h-8 text-xs bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500 hover:text-white rounded-xl cursor-pointer"
                        >
                          <span>Open Full {eq.year} Exam Paper</span>
                          <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Available in Standard Exam Series ({eq.setId})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
