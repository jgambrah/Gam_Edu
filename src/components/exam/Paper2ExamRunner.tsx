'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
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
  AlignLeft,
  Columns,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
  const [selectedObjectiveOptions, setSelectedObjectiveOptions] = useState<Record<string, string>>({});
  const [isSplitView, setIsSplitView] = useState(true);
  const [isPassageModalOpen, setIsPassageModalOpen] = useState(false);
  const [passageFontSize, setPassageFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isExamFocusMode, setIsExamFocusMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Distraction-free Focus Mode keyboard shortcut (ESC to exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExamFocusMode) {
        setIsExamFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExamFocusMode]);

  // Draft autosave and local persistence
  const examDraftKey = `gam_exam_draft_${activeExam?.id || 'paper2'}_${currentIndex}`;
  useEffect(() => {
    try {
      const saved = localStorage.getItem(examDraftKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setPartAnswers(prev => ({ ...parsed, ...prev }));
        }
      }
    } catch (e) {}
  }, [currentIndex, examDraftKey]);

  useEffect(() => {
    if (Object.keys(partAnswers).length === 0) return;
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(examDraftKey, JSON.stringify(partAnswers));
        setSaveStatus('saved');
      } catch (e) {}
    }, 600);
    return () => clearTimeout(timer);
  }, [partAnswers, examDraftKey]);

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

  // 1. Defensively normalize top-level questions list (checking BOTH tasks and questions)
  const rawQuestions = 
    activeExam?.tasks ??
    activeExam?.questions ?? 
    activeExam?.paper2?.tasks ??
    activeExam?.paper2?.questions ?? 
    activeExam?.paper2?.sections?.sectionA_essay?.questions ??
    activeExam?.practicePool?.low;
  
  let questionsList = toSafeArray(rawQuestions);

  // If questionsList is empty, also check nested levels (e.g. B7 foundation practicePool or tasks)
  if (questionsList.length === 0 && (activeExam as any)?.levels?.b7) {
    const b7 = (activeExam as any).levels.b7;
    questionsList = toSafeArray(b7.practicePool?.low || b7.tasks || b7.questions);
  }

  // Fallback: If questions are in nested sections (e.g. partA_composition, partB_comprehension, partC_literature)
  if (questionsList.length === 0 && (activeExam?.paper2?.sections || (activeExam as any)?.sections)) {
    const s = activeExam?.paper2?.sections || (activeExam as any)?.sections;
    const secA = toSafeArray(
      s.sectionA_essay?.questions ||
      s.sectionA_essay?.tasks ||
      s.partA_composition?.questions ||
      s.partA_writing?.questions ||
      s.sectionA?.questions ||
      s.sectionA?.tasks
    );

    let secB: any[] = [];
    if (Array.isArray(s.sectionB_comprehension?.questions)) {
      secB = s.sectionB_comprehension.questions;
    } else if (Array.isArray(s.partB_comprehension?.questions)) {
      secB = [{
        number: 4,
        questionNumber: "4",
        section: s.partB_comprehension.title || "Part B: Reading Comprehension",
        title: s.partB_comprehension.title || "Question 4: Reading Comprehension",
        instructions: s.partB_comprehension.instructions,
        passageText: s.partB_comprehension.passageText,
        subQuestions: s.partB_comprehension.questions,
        points: 30
      }];
    } else if (s.partB_comprehension?.passageText) {
      secB = [s.partB_comprehension];
    } else {
      secB = toSafeArray(s.sectionB?.questions || s.sectionB?.tasks);
    }

    let secC: any[] = [];
    if (Array.isArray(s.partC_literature?.questions)) {
      secC = s.partC_literature.questions.map((q: any, idx: number) => ({
        number: 5 + idx,
        questionNumber: q.questionNumber || `5${String.fromCharCode(97 + idx)}`,
        section: s.partC_literature.title || "Part C: Literature in English",
        title: q.sectionTitle || q.title || `Question 5${String.fromCharCode(97 + idx)}: Literature in English`,
        textTitle: q.sectionTitle || q.title,
        contextExtract: q.contextExtract || q.passageText,
        passageText: q.contextExtract || q.passageText,
        subQuestions: q.subItems || q.subQuestions || q.questions,
        points: q.points || 2
      }));
    } else {
      secC = toSafeArray(s.sectionC_literature?.questions || s.sectionC_literature?.tasks || s.sectionC?.questions || s.sectionC?.tasks);
    }

    questionsList = [...secA, ...secB, ...secC];
  }

  const currentQuestion = questionsList[currentIndex] || questionsList[0] || {};
  const currentQuestionId = String(currentQuestion?.id || currentQuestion?.questionNumber || currentIndex + 1);

  // Active question item inspection: distinguish Objective vs Theory
  const isObjective =
    currentQuestion?.section === "objective" ||
    currentQuestion?.type === "multiple_choice" ||
    currentQuestion?.format === "multiple_choice" ||
    (Array.isArray(currentQuestion?.options) && currentQuestion.options.length > 0);

  // 2. Defensively normalize subQuestions / parts for active question
  const rawSubQuestions =
    currentQuestion?.subQuestions ??
    currentQuestion?.parts ??
    currentQuestion?.subItems ??
    currentQuestion?.items ??
    currentQuestion?.tasks;

  const subQuestionsList = toSafeArray(rawSubQuestions).map((sub: any, subIdx: number) => {
    const rawLabel =
      sub?.subQuestion ||
      sub?.partLabel ||
      sub?.label ||
      sub?.partId ||
      sub?.subId ||
      `(${String.fromCharCode(97 + subIdx)})`;

    const cleanLabel = String(rawLabel).trim();
    const prompt =
      sub?.prompt ||
      sub?.question ||
      sub?.task ||
      sub?.text ||
      sub?.title ||
      '';

    const workedSolution =
      sub?.workedSolution ||
      sub?.modelAnswer ||
      sub?.answer ||
      sub?.solution ||
      '';

    const maxMarks = Number(sub?.maxMarks || sub?.marks || sub?.points) || 5;

    return {
      ...sub,
      subId: String(sub?.subId || sub?.id || cleanLabel || `part_${subIdx + 1}`),
      partLabel: cleanLabel,
      prompt,
      workedSolution,
      modelAnswer: workedSolution,
      maxMarks,
      marks: maxMarks
    };
  });

  // Auto-derive flippable theory topics (Questions 51 to 60)
  const flippableTopics = React.useMemo(() => {
    if (Array.isArray((activeExam as any)?.theoryTopicList) && (activeExam as any).theoryTopicList.length > 0) {
      return (activeExam as any).theoryTopicList;
    }
    return questionsList
      .map((q: any, idx: number) => ({ q, qIdx: idx }))
      .filter(({ q }: any) => q.section === 'theory' || q.format === 'structured_essay' || (!q.options && q.section !== 'objective'))
      .map(({ q, qIdx }: any, tIdx: number) => ({
        id: q.id || `theory_${qIdx + 1}`,
        questionNumber: q.questionNumber || (qIdx + 1),
        theoryIndex: q.theoryIndex || (tIdx + 1),
        title: q.title || `Topic ${tIdx + 1}`,
        category: q.category || 'Structured Essay',
        shortSummary: q.shortSummary || ''
      }));
  }, [activeExam, questionsList]);
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

  // Defensive extraction of whether current question is comprehension or language
  const isComprehensionQuestion = 
    currentQuestion?.number === 4 ||
    currentQuestion?.questionNumber === "4" ||
    (currentQuestion?.section && currentQuestion.section.toLowerCase().includes('comprehension')) ||
    (currentQuestion?.title && currentQuestion.title.toLowerCase().includes('comprehension'));

  // Context-aware language subject detection
  const isLanguageSubject = Boolean(
    isComprehensionQuestion ||
    (currentQuestion?.section && (
      currentQuestion.section.toLowerCase().includes('comprehension') ||
      currentQuestion.section.toLowerCase().includes('composition') ||
      currentQuestion.section.toLowerCase().includes('english') ||
      currentQuestion.section.toLowerCase().includes('literature')
    )) ||
    (activeExam?.subject && (
      activeExam.subject.toLowerCase().includes('english') ||
      activeExam.subject.toLowerCase().includes('language')
    )) ||
    (activeExam?.title && activeExam.title.toLowerCase().includes('english'))
  );

  // Calibrated mark distribution summing to exactly 30 marks for Comprehension (3+3+4+4+4+4+8 = 30)
  const defaultComprehensionMarks = [3, 3, 4, 4, 4, 4, 8];
  const calculateSubMarks = (sub: any, subIdx: number): number => {
    if (isComprehensionQuestion && subQuestionsList.length === 7) {
      return defaultComprehensionMarks[subIdx];
    }
    return Number(sub?.maxMarks || sub?.marks) || (isComprehensionQuestion ? Math.round(30 / subQuestionsList.length) : 5);
  };

  // Helper to extract Roman-numeral items (I., II., III., IV.) for questions (e) and (f)
  const extractNumberedItems = (prompt: string): { num: string; label: string }[] => {
    const regex = /(?:^|\n)\s*(I{1,3}|IV|V)\.\s*([^;\n]+)/g;
    const matches: { num: string; label: string }[] = [];
    let m;
    while ((m = regex.exec(prompt)) !== null) {
      matches.push({ num: m[1], label: m[2].replace(/[;\.]/g, '').trim() });
    }
    return matches;
  };

  // Helper to parse partitioned answers (I., II., etc.) from partAnswers string
  const parsePartitionedAnswers = (val: string, items: { num: string; label: string }[]): Record<string, string> => {
    const result: Record<string, string> = {};
    items.forEach(it => { result[it.num] = ''; });
    if (!val) return result;
    
    items.forEach(it => {
      const r = new RegExp(`(?:^|\\n)\\s*${it.num}\\.\\s*(?:[A-Za-z0-9_\\.\\s]+[:\\s]*)?([^\\n]+)`, 'i');
      const match = val.match(r);
      if (match) {
        result[it.num] = match[1].trim();
      }
    });

    const hasAny = Object.values(result).some(v => v.length > 0);
    if (!hasAny && val.trim()) {
      const lines = val.split('\n').filter(Boolean);
      items.forEach((it, idx) => {
        if (lines[idx]) {
          result[it.num] = lines[idx].replace(/^[IivV\.\d\)]+\s*/, '').trim();
        }
      });
    }
    return result;
  };

  // Helper to parse summary sentences 1 & 2 for question (g)
  const parseSummarySentences = (val: string): { s1: string; s2: string } => {
    if (!val) return { s1: '', s2: '' };
    const lines = val.split('\n').map(l => l.trim()).filter(Boolean);
    let s1 = '';
    let s2 = '';
    if (lines.length >= 2) {
      s1 = lines[0].replace(/^[1-2IivVabcde\.\)\s]+/, '').trim();
      s2 = lines[1].replace(/^[1-2IivVabcde\.\)\s]+/, '').trim();
    } else if (lines.length === 1) {
      s1 = lines[0].replace(/^[1-2IivVabcde\.\)\s]+/, '').trim();
    }
    return { s1, s2 };
  };

  const countWords = (text: string): number => text.trim().split(/\s+/).filter(Boolean).length;

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
              prompt: String(sub?.prompt || sub?.question || ''),
              studentText: text,
              maxMarks: calculateSubMarks(sub, subIdx),
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
  const questionMarks = Number(currentQuestion?.marks || currentQuestion?.totalMarks || currentQuestion?.points) || (isObjective ? 1 : (hasSubParts ? 15 : 30));
  const questionCategory = currentQuestion?.category || currentQuestion?.partLabel || (isObjective ? 'Objective Multiple Choice' : (hasSubParts ? 'Structured Theory' : 'Essay Composition'));
  const questionPrompt = currentQuestion?.prompt || currentQuestion?.title || '';
  const questionModelAnswer = currentQuestion?.modelAnswer || currentQuestion?.workedSolution || '';

  const passageText =
    currentQuestion?.passageText ||
    currentQuestion?.passage ||
    currentQuestion?.contextExtract ||
    currentQuestion?.extract ||
    (isComprehensionQuestion ? (
      (activeExam as any)?.paper2?.sections?.partB_comprehension?.passageText ||
      (activeExam as any)?.sections?.partB_comprehension?.passageText ||
      (activeExam as any)?.partB_comprehension?.passageText
    ) : '') ||
    (typeof questionPrompt === 'string' && questionPrompt.includes('**Question:**')
      ? questionPrompt.split('**Question:**')[0].trim()
      : '') ||
    (typeof questionPrompt === 'string' && questionPrompt.includes('Extract:')
      ? questionPrompt.split('Extract:')[1]?.split('**Question:**')[0]?.trim() || ''
      : '') ||
    '';

  const passageTitle =
    currentQuestion?.passageTitle ||
    currentQuestion?.textTitle ||
    currentQuestion?.sectionTitle ||
    (isComprehensionQuestion
      ? ((activeExam as any)?.paper2?.sections?.partB_comprehension?.title ||
         (activeExam as any)?.sections?.partB_comprehension?.title ||
         'Reading Comprehension Passage')
      : (currentQuestion?.section?.toLowerCase().includes('literature')
          ? 'Literature Context Extract'
          : 'Reading Passage / Reference Material'));

  const questionInstructions =
    currentQuestion?.instructions ||
    currentQuestion?.guidance ||
    (activeExam as any)?.sections?.partB_comprehension?.instructions ||
    (activeExam as any)?.paper2?.sections?.partB_comprehension?.instructions ||
    '';

  // Enhanced reading passage renderer with unclipped controls, paragraph indicators & high contrast
  const renderPassageCard = (isFullWidth = false) => {
    if (!passageText) return null;

    const wordCount = passageText.trim().split(/\s+/).filter(Boolean).length;
    const estMinutes = Math.max(1, Math.ceil(wordCount / 130));
    const paragraphs = passageText
      .split(/\n\s*\n/)
      .map((p: string) => p.trim())
      .filter(Boolean);

    return (
      <div className={cn(
        "rounded-3xl bg-slate-950/95 border border-amber-500/30 p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-4 transition-all",
        isFullWidth ? "w-full" : "w-full"
      )}>
        {/* Row 1: Title, Icon & Reading Stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-sm">
              <BookOpen className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-bold text-amber-300 tracking-tight block truncate">
                {passageTitle}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Official Reference Material
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge className="bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono px-2.5 py-1">
              📖 ~{wordCount} Words • ~{estMinutes} Min Read
            </Badge>
          </div>
        </div>

        {/* Row 2: Control Toolbar (Text Sizing, Split Mode, Popout) - Generously spaced & unclipped */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-900/90 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-1 hidden sm:inline">Text Size:</span>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setPassageFontSize('sm')}
                className={cn("px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer", passageFontSize === 'sm' ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200")}
                title="Small text size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setPassageFontSize('base')}
                className={cn("px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer", passageFontSize === 'base' ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200")}
                title="Normal text size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setPassageFontSize('lg')}
                className={cn("px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer", passageFontSize === 'lg' ? "bg-amber-500 text-slate-950 shadow" : "text-slate-400 hover:text-slate-200")}
                title="Large text size"
              >
                A+
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Split View Toggle (Desktop Only) */}
            <button
              type="button"
              onClick={() => setIsSplitView(prev => !prev)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all cursor-pointer shadow-sm"
              title={isSplitView ? "Switch to Stacked View" : "Switch to Side-by-Side Split View"}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{isSplitView ? "Stacked" : "Side-by-Side"}</span>
            </button>
            {/* Modal Popout */}
            <button
              type="button"
              onClick={() => setIsPassageModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all cursor-pointer shadow-sm text-xs font-semibold"
              title="Pop out in full overlay"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Overlay</span>
            </button>
          </div>
        </div>

        {/* High-Contrast Instructions Card */}
        {questionInstructions && (
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-slate-100 leading-relaxed font-normal shadow-md">
            <strong className="text-amber-300 font-bold block mb-1">📋 WAEC Instructions:</strong>
            <span className="text-slate-200">{questionInstructions}</span>
          </div>
        )}

        {/* Paragraph-Indexed Passage Text with High Contrast & Independent Scroll */}
        <div className={cn(
          "text-slate-100 leading-relaxed custom-scrollbar overflow-y-auto select-text space-y-4 pr-1",
          isExamFocusMode ? "max-h-[calc(100vh-18rem)]" : isSplitView ? "max-h-[calc(100vh-14rem)]" : "max-h-[32rem]",
          passageFontSize === 'sm' ? "text-xs sm:text-sm leading-relaxed" : (passageFontSize === 'lg' ? "text-base sm:text-lg leading-loose" : "text-sm sm:text-base leading-relaxed")
        )}>
          {paragraphs.length > 1 ? (
            paragraphs.map((para: string, pIdx: number) => (
              <div key={pIdx} className="flex gap-3 group items-start">
                <span className="text-[11px] font-mono font-bold text-amber-400/80 select-none pt-0.5 shrink-0 group-hover:text-amber-300 transition-colors">
                  ¶ {pIdx + 1}
                </span>
                <div className="text-slate-100 leading-relaxed text-left flex-1 font-sans">
                  <MathRenderer content={para} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-100 leading-relaxed whitespace-pre-line border-l-2 border-amber-500/40 pl-4 py-1">
              <MathRenderer content={passageText} />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Specialized rendering for each sub-question item with constraints detection
  const renderSubQuestionItem = (sub: any, subIdx: number) => {
    const subId = String(sub?.subId || sub?.partLabel || sub?.partId || `(${String.fromCharCode(97 + subIdx)})`);
    const partKey = `${currentQuestionId}_p${subIdx}`;
    const isHintShown = !!showPartHints[partKey];
    const currentVal = partAnswers[partKey] || partAnswers[subId] || '';
    const subMarks = calculateSubMarks(sub, subIdx);
    const promptText = String(sub.prompt || sub.question || sub.title || '');

    // Specialized constraints detection
    const isSummary = (sub.partLabel && sub.partLabel.includes('g')) || promptText.toLowerCase().includes('eight words') || promptText.toLowerCase().includes('two concise sentences');
    const numberedItems = extractNumberedItems(promptText);
    const isMultiPart = !isSummary && numberedItems.length >= 2;
    const isVocabulary = isMultiPart && (promptText.toLowerCase().includes('words') || promptText.toLowerCase().includes('means the same') || (sub.partLabel && sub.partLabel.includes('f')));

    // Summary state values
    const { s1: summaryS1, s2: summaryS2 } = parseSummarySentences(currentVal);
    const s1Count = countWords(summaryS1);
    const s2Count = countWords(summaryS2);

    // Partitioned state values
    const partitionedVals = isMultiPart ? parsePartitionedAnswers(currentVal, numberedItems) : {};

    return (
      <div
        key={sub?.subId || subIdx}
        className={cn(
          'p-5 sm:p-6 rounded-3xl border transition-all space-y-5',
          isSubmitted
            ? 'bg-slate-900/60 border-slate-800'
            : 'bg-slate-950/90 border-slate-800/90 shadow-xl'
        )}
      >
        {/* Part Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-black text-xs flex items-center justify-center border border-amber-500/30">
              {sub.partLabel ? (sub.partLabel.startsWith('(') ? sub.partLabel : `(${sub.partLabel})`) : subId}
            </span>
            <span className="text-sm font-bold text-white">
              {currentQuestion?.questionNumber 
                ? `Question ${currentQuestion.questionNumber} ${sub.partLabel ? (sub.partLabel.startsWith('(') ? sub.partLabel : `(${sub.partLabel})`) : ''}`
                : `Sub-Question Part ${sub.partLabel || subId}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {passageText && !isSplitView && (
              <button
                type="button"
                onClick={() => setIsPassageModalOpen(true)}
                className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 px-2.5 py-1 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                title="Open reading passage overlay"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Refer to Passage</span>
              </button>
            )}
            <span className="text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full font-mono">
              [{subMarks} Marks]
            </span>
          </div>
        </div>

        {/* Part Prompt with High Contrast */}
        <div className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed pl-1 whitespace-pre-line bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
          <MathRenderer content={promptText.replace(/\\n/g, '\n')} />
        </div>

        {/* Sub-part diagram (if any) */}
        {sub.diagramSvg && (
          <div
            className="my-3 p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-center overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: sub.diagramSvg }}
          />
        )}

        {/* Specialized Input: Summary Question (Sentence 1 & Sentence 2 with Live Word Counters) */}
        {isSummary ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>WAEC Constraint: Exactly two sentences, NOT MORE THAN EIGHT WORDS EACH.</span>
              </span>
            </div>

            {/* Sentence 1 */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">First Sentence (Point 1):</span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold transition-all border",
                  s1Count === 0
                    ? "bg-slate-800 text-slate-400 border-slate-700"
                    : s1Count <= 8
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-rose-500/25 text-rose-300 border-rose-500/50 animate-pulse font-black"
                )}>
                  {s1Count === 0 ? "0 / 8 words" : s1Count <= 8 ? `✓ ${s1Count} / 8 words` : `⚠️ ${s1Count} / 8 words (+${s1Count - 8} over limit!)`}
                </span>
              </div>
              <Input
                disabled={isSubmitted || isSubmitting}
                value={summaryS1}
                onChange={e => {
                  const s1 = e.target.value;
                  const combined = (s1.trim() || summaryS2.trim()) ? `1. ${s1.trim()}\n2. ${summaryS2.trim()}` : '';
                  setPartAnswers(prev => ({ ...prev, [partKey]: combined }));
                }}
                placeholder="First summary sentence (max 8 words)..."
                className="bg-slate-950 border-slate-800 text-slate-100 rounded-xl text-xs sm:text-sm h-11"
              />
            </div>

            {/* Sentence 2 */}
            <div className="space-y-1.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Second Sentence (Point 2):</span>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold transition-all border",
                  s2Count === 0
                    ? "bg-slate-800 text-slate-400 border-slate-700"
                    : s2Count <= 8
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-rose-500/25 text-rose-300 border-rose-500/50 animate-pulse font-black"
                )}>
                  {s2Count === 0 ? "0 / 8 words" : s2Count <= 8 ? `✓ ${s2Count} / 8 words` : `⚠️ ${s2Count} / 8 words (+${s2Count - 8} over limit!)`}
                </span>
              </div>
              <Input
                disabled={isSubmitted || isSubmitting}
                value={summaryS2}
                onChange={e => {
                  const s2 = e.target.value;
                  const combined = (summaryS1.trim() || s2.trim()) ? `1. ${summaryS1.trim()}\n2. ${s2.trim()}` : '';
                  setPartAnswers(prev => ({ ...prev, [partKey]: combined }));
                }}
                placeholder="Second summary sentence (max 8 words)..."
                className="bg-slate-950 border-slate-800 text-slate-100 rounded-xl text-xs sm:text-sm h-11"
              />
            </div>
          </div>
        ) : isMultiPart ? (
          /* Specialized Input: Partitioned Sub-Inputs (I, II, III, IV) */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>{isVocabulary ? "Provide a replacement synonym or equivalent phrase for each word:" : "Explain the meaning of each expression as used in the passage:"}</span>
              <span className="text-[11px] text-amber-400 font-mono font-semibold">{numberedItems.length} Parts</span>
            </div>

            <div className={cn(
              "gap-3",
              isVocabulary ? "grid grid-cols-1 sm:grid-cols-2" : "space-y-3"
            )}>
              {numberedItems.map((item: { num: string; label: string }) => {
                const val = partitionedVals[item.num] || '';
                return (
                  <div key={item.num} className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 font-mono font-bold text-xs px-2.5 py-0.5">
                        {item.num}
                      </Badge>
                      <span className="text-slate-100 font-semibold text-xs sm:text-sm">
                        {item.label}
                      </span>
                    </div>
                    <Input
                      disabled={isSubmitted || isSubmitting}
                      value={val}
                      onChange={e => {
                        const updatedVals = { ...partitionedVals, [item.num]: e.target.value };
                        const combined = numberedItems
                          .filter(it => updatedVals[it.num]?.trim())
                          .map(it => `${it.num}. ${it.label}: ${updatedVals[it.num]?.trim()}`)
                          .join('\n');
                        setPartAnswers(prev => ({ ...prev, [partKey]: combined }));
                      }}
                      placeholder={isVocabulary ? `Synonym for "${item.label}"...` : `Meaning of "${item.label}"...`}
                      className="bg-slate-950 border-slate-800 text-slate-100 rounded-xl text-xs sm:text-sm h-11"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Standard Language / STEM Textarea */
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{isLanguageSubject ? "Provide your answer in full sentences:" : "Your Working Steps, Formula or Explanation:"}</span>
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
              placeholder={isLanguageSubject ? "Type your answer here in clear, grammatical sentences..." : "Write out your answer, steps, formula, or derivation here..."}
              className={cn(
                'rounded-2xl min-h-[95px] text-xs sm:text-sm font-sans transition-all',
                isSubmitted
                  ? 'bg-slate-950/90 border-slate-800 text-slate-300 opacity-90 cursor-not-allowed'
                  : 'bg-slate-900 border-slate-800 text-slate-100 focus:border-amber-500 placeholder:text-slate-600'
              )}
            />
          </div>
        )}

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

        {/* Sub-question AI Feedback and Model Solution (Post-submission only) */}
        {isSubmitted && (
          <div className="mt-4 border-t border-slate-800/80 pt-4 space-y-4 animate-in fade-in duration-300">
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
                <MathRenderer content={sub.workedSolution || sub.modelAnswer || (isLanguageSubject ? 'Refer to official marking scheme.' : 'Follow official derivation steps.')} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  let subPromptText = questionPrompt;
  if (typeof questionPrompt === 'string' && questionPrompt.includes('**Question:**')) {
    subPromptText = questionPrompt.split('**Question:**')[1].trim();
  }

  // Get AI evaluation for standalone essay if submitted
  const standaloneEval = toSafeArray(gradingResults).find(
    (r: any) =>
      (String(r.questionNumber) === String(currentQuestion?.questionNumber || currentIndex + 1) || String(r.questionNumber) === String(currentIndex + 1)) &&
      (String(r.subId) === 'main' || String(r.partKey) === mainKey)
  );

  return (
    <div className={cn(
      "space-y-4 animate-in fade-in duration-300",
      isExamFocusMode && "fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-slate-950 p-4 sm:p-6 flex flex-col space-y-3"
    )}>
      <ActiveExamHeaderDisclaimer year={examYear} />

      {/* Top Breadcrumb & Stepper Info / Focus Mode Header */}
      <div className="flex items-center justify-between shrink-0">
        {isExamFocusMode ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExamFocusMode(false)}
            className="text-xs bg-slate-900 border-slate-700 text-slate-200 hover:text-white flex items-center gap-1.5 cursor-pointer rounded-xl px-3 py-1.5 shadow-sm"
          >
            <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Exit Focus Mode (Esc)</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 pl-0 hover:bg-transparent cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Curriculum Modules
          </Button>
        )}
        <div className="flex items-center gap-3">
          {isExamFocusMode && (
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-[11px] font-mono px-2.5 py-0.5 hidden sm:inline-flex">
              🎯 Distraction-Free CBE Mode
            </Badge>
          )}
          <span className="text-xs text-slate-400">
            Module: <strong className="text-amber-300">{activeExam.title || 'Paper 2 Written Examination'}</strong>
          </span>
        </div>
      </div>

      {/* Main Examination Workstation */}
      <Card className={cn("rounded-[32px] bg-slate-900/90 border border-slate-800 shadow-2xl overflow-hidden text-white transition-all", isExamFocusMode && "flex-1 flex flex-col overflow-hidden min-h-0")}>
        {/* Workstation Header */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 border-b border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              {isObjective ? (
                <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold px-3 py-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Paper 1 Objective Question {currentIndex + 1} of {totalQuestions}</span>
                </Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Paper 2 Written Question {currentIndex + 1} of {totalQuestions}</span>
                </Badge>
              )}
              <Badge className="bg-slate-800/80 text-slate-300 border border-slate-700/60 text-xs">
                {questionCategory}
              </Badge>
              <Badge className="bg-amber-950/60 text-amber-300 border border-amber-600/40 text-xs font-bold">
                [{questionMarks} Marks]
              </Badge>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Autosave Draft Indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-300 shadow-inner">
                {saveStatus === 'saving' ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span className="text-slate-400">Saving draft...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Draft saved</span>
                  </>
                )}
              </div>

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

              {/* Focus / Exam Mode Toggle Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsExamFocusMode(prev => !prev)}
                className={cn(
                  "text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer shadow-sm px-3 py-1.5",
                  isExamFocusMode
                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-amber-500/20"
                    : "bg-slate-950/90 text-slate-200 border-slate-700 hover:border-amber-400/60 hover:text-amber-300"
                )}
                title={isExamFocusMode ? "Exit Fullscreen Focus Mode (Esc)" : "Expand to Distraction-Free CBE Exam Mode"}
              >
                {isExamFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isExamFocusMode ? "Exit Focus" : "Focus Mode"}</span>
              </Button>

              {/* Submission Status Indicator */}
              <div>
                {isObjective ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-3 py-1 rounded-full shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Objective Mode • Instant Selection</span>
                  </span>
                ) : isSubmitted ? (
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
        <CardContent className={cn("p-6 sm:p-8 space-y-8", isExamFocusMode && "flex-1 overflow-hidden min-h-0 flex flex-col p-4 sm:p-6 space-y-4")}>
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
          {/* CASE 0: OBJECTIVE MULTIPLE-CHOICE QUESTION (QUESTIONS 1 TO 50)           */}
          {/* ========================================================================= */}
          {isObjective ? (
            <div className="space-y-6">
              {/* Context / Reading Passage */}
              {passageText && (
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Reading Passage / Context:</span>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line border-l-2 border-cyan-500/30 pl-3">
                    <MathRenderer content={passageText} />
                  </div>
                </div>
              )}

              {/* Question Prompt Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  Question {currentIndex + 1}
                </span>
                <div className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                  <MathRenderer content={subPromptText || currentQuestion?.prompt} />
                </div>
              </div>

              {/* Multiple Choice Options List */}
              <div className="grid grid-cols-1 gap-3">
                {toSafeArray(currentQuestion?.options).map((opt: string, optIdx: number) => {
                  const optLetter = String.fromCharCode(65 + optIdx);
                  const selectedOpt = partAnswers[mainKey] || selectedObjectiveOptions[currentQuestionId];
                  const isSelected = selectedOpt === opt;
                  const isVerified = !!submittedQuestions[currentQuestionId];
                  const isCorrectAnswer = opt === currentQuestion?.correctAnswer;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => {
                        if (isVerified) return;
                        setSelectedObjectiveOptions(prev => ({ ...prev, [currentQuestionId]: opt }));
                        setPartAnswers(prev => ({ ...prev, [mainKey]: opt, [currentQuestionId]: opt }));
                      }}
                      className={cn(
                        "w-full p-4 sm:p-5 rounded-2xl text-left transition-all flex items-start gap-3.5 border cursor-pointer",
                        isSelected
                          ? isVerified
                            ? isCorrectAnswer
                              ? "bg-emerald-950/70 border-emerald-500 text-white shadow-lg shadow-emerald-950/40"
                              : "bg-rose-950/70 border-rose-500 text-white shadow-lg shadow-rose-950/40"
                            : "bg-cyan-950/60 border-cyan-500/60 text-white shadow-lg shadow-cyan-950/40"
                          : isVerified && isCorrectAnswer
                          ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-200"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
                      )}
                    >
                      <span className={cn(
                        "w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shrink-0 border mt-0.5",
                        isSelected
                          ? "bg-cyan-500 text-slate-950 border-cyan-400"
                          : "bg-slate-900 text-slate-400 border-slate-700"
                      )}>
                        {optLetter}
                      </span>
                      <span className="text-sm font-medium leading-relaxed flex-1">
                        <MathRenderer content={opt} />
                      </span>
                      {isSelected && (
                        <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Hint Box */}
              {currentQuestion?.hint && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => toggleHint(currentQuestionId)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showPartHints[currentQuestionId] ? 'Hide Pedagogical Hint' : 'Need a hint for this drill?'}</span>
                  </button>
                  {showPartHints[currentQuestionId] && (
                    <div className="mt-2 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed animate-in fade-in">
                      💡 <strong>Hint:</strong> <MathRenderer content={currentQuestion.hint} />
                    </div>
                  )}
                </div>
              )}

              {/* Solution Box */}
              {currentQuestion?.workedSolution && (submittedQuestions[currentQuestionId] || showModelAnswer[currentQuestionId]) && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      ✓ Correct Answer: {currentQuestion.correctAnswer}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <MathRenderer content={currentQuestion.workedSolution} />
                  </div>
                </div>
              )}
            </div>
          ) : !hasSubParts ? (
            <div className="space-y-6">
              {/* Top Carousel Navigation Bar: Flip Directly to Any Theory Topic */}
              {flippableTopics.length > 0 && (
                <div className="bg-slate-950/80 border border-amber-500/20 p-4 rounded-3xl space-y-2 mb-2 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-1">
                    <span className="flex items-center gap-2 text-amber-400">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Section B: Theory Writing Tasks (Flip Directly to Any Topic)</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
                      {flippableTopics.length} Flippable Topics
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {flippableTopics.map((topic: any) => {
                      const isCurrent = currentIndex === (topic.questionNumber - 1);
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => {
                            setCurrentIndex(topic.questionNumber - 1);
                          }}
                          className={cn(
                            "px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 shrink-0 border",
                            isCurrent
                              ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-400/50 shadow-lg shadow-amber-600/30 scale-[1.02]"
                              : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
                          )}
                        >
                          <span className={cn(
                            "w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0",
                            isCurrent ? "bg-white text-amber-700" : "bg-slate-800 text-slate-400"
                          )}>
                            {topic.theoryIndex}
                          </span>
                          <div className="text-left">
                            <div className="leading-tight">{topic.title}</div>
                            {topic.category && (
                              <span className={cn("text-[9px] block font-normal opacity-75", isCurrent ? "text-amber-200" : "text-slate-500")}>
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

              
              {/* Guidance Scaffold (Address Architecture, Salutation, Caption & Sign-off Rules) */}
              {currentQuestion?.guidanceScaffold && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-500/20 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-amber-400" />
                      <span>Interactive Writing Scaffold & Architectural Guidance</span>
                    </span>
                    {currentQuestion.guidanceScaffold.letterType && (
                      <Badge className="bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                        {currentQuestion.guidanceScaffold.letterType.toUpperCase().replace('_', ' ')}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* 1. Address Scaffold */}
                    {currentQuestion.guidanceScaffold.senderAddress && (
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                        <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider text-amber-400">
                          📍 Sender Address Architecture
                        </span>
                        <div className="text-[11px] text-slate-300 space-y-0.5 font-mono">
                          <div>Style: <strong className="text-white capitalize">{currentQuestion.guidanceScaffold.senderAddress.recommendedStyle}</strong> ({currentQuestion.guidanceScaffold.senderAddress.recommendedPunctuation} punctuation)</div>
                          {currentQuestion.guidanceScaffold.senderAddress.allowedDatingFormats && (
                            <div>Dating Rule: <span className="text-emerald-400">{currentQuestion.guidanceScaffold.senderAddress.allowedDatingFormats.join(' or ')}</span></div>
                          )}
                          {currentQuestion.guidanceScaffold.senderAddress.prohibitedDatingFormats && (
                            <div className="text-rose-400 text-[10px]">Banned: {currentQuestion.guidanceScaffold.senderAddress.prohibitedDatingFormats.join(', ')}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 2. Salutation & Subscription Guide */}
                    {currentQuestion.guidanceScaffold.salutationGuide && (
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                        <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider text-amber-400">
                          🤝 Salutation & Subscription Guide
                        </span>
                        <div className="text-[11px] text-slate-300 space-y-0.5 font-mono">
                          <div>Recommended: <span className="text-emerald-400 font-bold">{currentQuestion.guidanceScaffold.salutationGuide.recommendedSalutation}</span></div>
                          {currentQuestion.guidanceScaffold.salutationGuide.bannedSalutations && (
                            <div className="text-rose-400 text-[10px]">Banned: {currentQuestion.guidanceScaffold.salutationGuide.bannedSalutations.join(', ')}</div>
                          )}
                        </div>
                      </div>
                    )}
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
            passageText && isSplitView ? (
              <div className={cn(
                "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start",
                isExamFocusMode && "h-full min-h-0 overflow-hidden"
              )}>
                {/* Left Column: Sticky Reading Passage Panel (5 cols) */}
                <div className={cn(
                  "hidden lg:block lg:col-span-5 space-y-4 pr-1 custom-scrollbar",
                  isExamFocusMode
                    ? "h-full overflow-y-auto"
                    : "lg:sticky lg:top-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
                )}>
                  {renderPassageCard(false)}
                </div>

                {/* Right Column: Structured Sub-Questions (7 cols) */}
                <div className={cn(
                  "lg:col-span-7 space-y-6",
                  isExamFocusMode && "h-full overflow-y-auto custom-scrollbar pr-2"
                )}>
                  {/* On Mobile / Tablet, show passage at top of questions */}
                  <div className="lg:hidden">
                    {renderPassageCard(true)}
                  </div>
                  {subQuestionsList.map((sub: any, subIdx: number) => renderSubQuestionItem(sub, subIdx))}

                  {/* Consolidated Protocol Notice */}
                  {!isSubmitted && (
                    <div className="p-4 sm:p-5 rounded-3xl bg-slate-950/80 border border-amber-500/20 flex items-center gap-3.5 text-xs text-slate-300 shadow-lg">
                      <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                        <Lock className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-bold text-amber-300 text-xs sm:text-sm block">WAEC Chief Examiner Protocol:</span>
                        <span className="text-slate-400 text-xs leading-relaxed">
                          Official model answers, scoring rubrics, and step-by-step AI evaluations are locked until you submit your complete answers.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {passageText && renderPassageCard(true)}
                {subQuestionsList.map((sub: any, subIdx: number) => renderSubQuestionItem(sub, subIdx))}

                {/* Consolidated Protocol Notice */}
                {!isSubmitted && (
                  <div className="p-4 sm:p-5 rounded-3xl bg-slate-950/80 border border-amber-500/20 flex items-center gap-3.5 text-xs text-slate-300 shadow-lg">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-bold text-amber-300 text-xs sm:text-sm block">WAEC Chief Examiner Protocol:</span>
                      <span className="text-slate-400 text-xs leading-relaxed">
                        Official model answers, scoring rubrics, and step-by-step AI evaluations are locked until you submit your complete answers.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
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
              {isObjective ? (
                <>
                  {!submittedQuestions[currentQuestionId] ? (
                    <Button
                      onClick={() => {
                        setSubmittedQuestions(prev => ({ ...prev, [currentQuestionId]: true }));
                      }}
                      disabled={!partAnswers[mainKey] && !selectedObjectiveOptions[currentQuestionId]}
                      className="h-11 px-6 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>Check Answer</span>
                    </Button>
                  ) : null}
                  <Button
                    onClick={handleNext}
                    className="h-11 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>{isLastQuestion ? 'Complete Lab' : 'Next Question'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </>
              ) : !isSubmitted ? (
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
        
          {/* Floating Sticky Quick-Reference Passage Pill (Only shown on mobile or when not in side-by-side view) */}
          {passageText && hasSubParts && (!isSplitView) && (
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setIsPassageModalOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold rounded-full px-5 py-3 shadow-2xl flex items-center gap-2.5 border border-amber-300/40 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
                title="Click to view reference passage overlay"
              >
                <BookOpen className="w-4 h-4 text-white" />
                <span className="text-xs tracking-wider uppercase font-black">Refer to Passage</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>
          )}

          {/* Quick-Reference Passage Modal / Drawer Overlay */}
          {isPassageModalOpen && passageText && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
              <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
                {/* Modal Header */}
                <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {passageTitle}
                      </h4>
                      <p className="text-[11px] text-amber-400 font-mono">
                        Quick Reference Overlay • Scrollable
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Font size toggle */}
                    <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-xl p-1 gap-1">
                      <button
                        type="button"
                        onClick={() => setPassageFontSize('sm')}
                        className={cn("px-2 py-0.5 text-xs font-bold rounded-lg transition-colors", passageFontSize === 'sm' ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white")}
                      >A-</button>
                      <button
                        type="button"
                        onClick={() => setPassageFontSize('base')}
                        className={cn("px-2 py-0.5 text-xs font-bold rounded-lg transition-colors", passageFontSize === 'base' ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white")}
                      >A</button>
                      <button
                        type="button"
                        onClick={() => setPassageFontSize('lg')}
                        className={cn("px-2 py-0.5 text-xs font-bold rounded-lg transition-colors", passageFontSize === 'lg' ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white")}
                      >A+</button>
                    </div>
                    {/* Close button */}
                    <button
                      type="button"
                      onClick={() => setIsPassageModalOpen(false)}
                      className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {/* Modal Content */}
                <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                  {questionInstructions && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed font-medium">
                      📋 <strong>Instructions:</strong> {questionInstructions}
                    </div>
                  )}
                  <div className={cn(
                    "text-slate-200 leading-relaxed whitespace-pre-line select-text",
                    passageFontSize === 'sm' ? "text-xs sm:text-sm" : (passageFontSize === 'lg' ? "text-base sm:text-lg" : "text-sm sm:text-base")
                  )}>
                    <MathRenderer content={passageText} />
                  </div>
                </div>
                {/* Modal Footer */}
                <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setIsPassageModalOpen(false)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2 rounded-xl text-xs cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    Close & Back to Question Answers
                  </Button>
                </div>
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

// Named alias for cross-module compatibility
export const TheoryExamViewer = Paper2ExamRunner;
