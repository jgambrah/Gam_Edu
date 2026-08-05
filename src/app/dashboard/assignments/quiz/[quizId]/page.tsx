'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { Quiz, QuizAttempt } from '@/lib/types';
import { doc, collection, addDoc, serverTimestamp, setDoc, getDoc, query, where } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, CheckCircle, AlertCircle, Sparkles, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';
import { triggerStudentBadgeEvent } from '@/lib/achievement-utils';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { BlockMath, InlineMath } from 'react-katex';

function MathText({ text }: { text: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span>{text}</span>;
  }

  if (!text) return null;

  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const formula = part.slice(2, -2).trim();
          return (
            <div key={index} className="my-2 overflow-x-auto text-center py-2 px-3 bg-slate-50 border border-slate-100 rounded-xl">
              <BlockMath math={formula} />
            </div>
          );
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1).trim();
          return (
            <span key={index} className="inline-block px-1">
              <InlineMath math={formula} />
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export default function QuizPage() {
  const { quizId } = useParams();
  const router = useRouter();
  const { role } = useRole();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  const quizRef = useMemoFirebase(() => (firestore && quizId) ? doc(firestore, 'quizzes', quizId as string) : null, [firestore, quizId]);
  const { data: quiz, isLoading } = useDoc<Quiz>(quizRef);

  const studentQuery = useMemoFirebase(() => 
    (user && firestore && schoolId) ? query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, 
    [user, firestore, schoolId]
  );
  const { data: studentData } = useCollection<any>(studentQuery);
  const student = studentData?.[0];

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timeUntilStart, setTimeUntilStart] = useState<number | null>(null);

  useEffect(() => {
    if (!quiz || !quiz.startDate) return;
    const start = new Date(quiz.startDate).getTime();
    
    const update = () => {
      const diff = Math.max(0, Math.floor((start - Date.now()) / 1000));
      setTimeUntilStart(diff);
      return diff;
    };

    const initial = update();
    if (initial <= 0) return;

    const timer = setInterval(() => {
      const remaining = update();
      if (remaining <= 0) {
        clearInterval(timer);
        window.location.reload();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz]);

  useEffect(() => {
    if (!quiz || submitted || !quiz.timeLimit || quiz.timeLimit <= 0) return;

    const quizTimeLimitSec = quiz.timeLimit * 60;
    const storageKey = `quiz-start-${quiz.id}`;
    
    let startTimeStr = localStorage.getItem(storageKey);
    if (!startTimeStr) {
      startTimeStr = String(Date.now());
      localStorage.setItem(storageKey, startTimeStr);
    }
    
    const startTime = Number(startTimeStr);
    
    const updateTimer = () => {
      const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, quizTimeLimitSec - elapsedSec);
      setTimeLeft(remaining);
      return remaining;
    };

    const initialRemaining = updateTimer();
    if (initialRemaining <= 0) {
      return; // Already expired, will auto-submit below
    }

    const interval = setInterval(() => {
      const remaining = updateTimer();
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz, submitted]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted && !isSubmitting && quiz) {
      toast({
        title: "Time is up!",
        description: "Your answers have been frozen and auto-submitted.",
      });
      handleSubmit();
    }
  }, [timeLeft, submitted, isSubmitting, quiz]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = async () => {
    if (!user || !quiz || !schoolId || !firestore) return;
    setIsSubmitting(true);

    let currentScore = 0;
    quiz.questions.forEach((q, index) => {
      const studentAns = (answers[index] || '').trim().toLowerCase();
      const correctAns = (q.correctAnswer || '').trim().toLowerCase();
      
      const isCorrect = q.type === 'written'
        ? (studentAns === correctAns || (correctAns.includes(studentAns) && studentAns.length > 2))
        : (answers[index] === q.correctAnswer);

      if (isCorrect) {
        currentScore++;
      }
    });

    setScore(currentScore);
    setSubmitted(true);
    
    try {
        const attemptData = {
            quizId: quiz.id,
            studentId: user.uid,
            score: currentScore,
            total: quiz.questions.length,
            completedAt: serverTimestamp(),
            schoolId: schoolId,
        };
        await addDoc(collection(firestore, 'quizAttempts'), attemptData);

        // Trigger gamification badge updates (0 extra reads)
        const quizPct = quiz.questions.length > 0 ? Math.round((currentScore / quiz.questions.length) * 100) : 0;
        triggerStudentBadgeEvent(firestore, student?.id || user.uid, {
            type: 'QUIZ_SUBMITTED',
            quizScorePercent: quizPct
        });

        // Auto Gradebook integration entry!
        if ((quiz as any).gradable && (quiz as any).subjectId) {
          let term = 'First Term';
          let academicYear = '2024-2025';
          try {
            const settingsSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId));
            if (settingsSnap.exists()) {
              const settingsData = settingsSnap.data();
              if (settingsData.term) term = settingsData.term;
              if (settingsData.academicYear) academicYear = settingsData.academicYear;
            }
          } catch (err) {
            console.error("Error fetching schoolSettings:", err);
          }

          const studentName = student ? `${student.firstName} ${student.lastName}`.trim() : user.displayName || 'Student';
          const maxScoreBasis = 100;
          const pctScore = quiz.questions.length > 0 ? Math.round((currentScore / quiz.questions.length) * 100) : 0;

          const assessmentRef = doc(collection(firestore, 'assessments'));
          await setDoc(assessmentRef, {
            studentId: user.uid,
            studentName: studentName,
            classId: quiz.classId,
            subjectId: (quiz as any).subjectId,
            schoolId: schoolId,
            teacherId: quiz.teacherId || '',
            term: term,
            academicYear: academicYear,
            assessmentType: (quiz as any).assessmentType || 'Class Exercise (CA)',
            score: pctScore, 
            maxScore: maxScoreBasis,
            teacherRemark: `AI Quiz completed: ${currentScore}/${quiz.questions.length} questions correct.`,
            createdAt: serverTimestamp(),
            assessmentDate: serverTimestamp(),
            quizId: quiz.id
          });
        }

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        toast({
          title: 'Quiz Submitted!',
          description: `You scored ${currentScore} out of ${quiz.questions.length}.`,
        });
    } catch (e) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save your attempt.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 text-slate-450">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-650" />
        <span className="text-xs font-bold uppercase tracking-widest animate-pulse">Loading Quiz Canvas...</span>
      </div>
    );
  }

  if (!quiz) {
    return (
        <div className="p-8 max-w-md mx-auto mt-20">
            <Card className="border border-slate-150 p-6 text-center rounded-2xl shadow-md">
                <CardHeader>
                  <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-2" />
                  <CardTitle className="text-slate-800 font-extrabold text-base">Quiz Not Found</CardTitle>
                  <CardDescription className="text-xs text-slate-400">The requested assessment could not be located in this school registry.</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <Button onClick={() => router.back()} className="w-full bg-slate-900 hover:bg-slate-800 rounded-xl h-10 font-bold text-xs text-white">Go Back</Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  // Scheduled Start Date Countdown Lock
  if (quiz.startDate && new Date() < new Date(quiz.startDate) && timeUntilStart !== null && timeUntilStart > 0) {
    const days = Math.floor(timeUntilStart / 86400);
    const hours = Math.floor((timeUntilStart % 86400) / 3600);
    const minutes = Math.floor((timeUntilStart % 3600) / 60);
    const seconds = timeUntilStart % 60;

    return (
      <div className="p-8 max-w-lg mx-auto mt-20">
        <Card className="border border-slate-150 p-8 text-center rounded-[2.5rem] shadow-xl bg-white space-y-6">
          <CardHeader>
            <div className="mx-auto bg-amber-50 text-amber-600 p-4 rounded-full inline-block animate-pulse">
              <Clock className="h-10 w-10 text-amber-600" />
            </div>
            <CardTitle className="text-slate-800 font-black text-xl uppercase tracking-tight mt-4">Quiz is Scheduled</CardTitle>
            <CardDescription className="text-xs text-slate-500 font-medium">
              This assessment is locked by the teacher. It will be available starting on:
              <span className="block font-bold text-slate-700 mt-1 text-sm">{format(new Date(quiz.startDate), 'PPp')}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-4 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono">
              <div className="text-center">
                <span className="text-xl font-black text-slate-800 block">{days}</span>
                <span className="text-[10px] uppercase font-bold text-slate-450">Days</span>
              </div>
              <div className="text-center">
                <span className="text-xl font-black text-slate-800 block">{hours}</span>
                <span className="text-[10px] uppercase font-bold text-slate-450">Hours</span>
              </div>
              <div className="text-center">
                <span className="text-xl font-black text-slate-800 block">{minutes}</span>
                <span className="text-[10px] uppercase font-bold text-slate-450">Mins</span>
              </div>
              <div className="text-center">
                <span className="text-xl font-black text-slate-800 block">{seconds}</span>
                <span className="text-[10px] uppercase font-bold text-slate-450">Secs</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.back()} className="w-full bg-slate-900 hover:bg-slate-800 rounded-xl h-12 font-bold text-xs text-white uppercase tracking-wider">
              Go Back to Workspace
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Return button */}
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-2 hover:bg-slate-100 font-bold text-xs text-slate-600 rounded-xl px-4 py-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workspace
      </Button>

      {/* Live Answer Completion Progress */}
      {!submitted && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Answer Progress</span>
            <span>{answeredCount} / {totalQuestions} answered ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-150 h-2.5 rounded-full overflow-hidden border border-slate-200/30 shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-350 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Quiz Timer Countdown Bar */}
      {quiz.timeLimit && quiz.timeLimit > 0 && timeLeft !== null && !submitted && (
        <div className={cn(
          "sticky top-4 z-40 flex items-center justify-between px-6 py-4 rounded-2xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4",
          timeLeft < 60 
            ? "bg-rose-50/95 border-rose-200 text-rose-700 font-bold" 
            : "bg-amber-50/95 border-amber-200 text-amber-700 font-medium"
        )}>
          <div className="flex items-center gap-2">
            <span className={cn(
              "h-2.5 w-2.5 rounded-full bg-current",
              timeLeft < 60 ? "animate-ping" : "animate-pulse"
            )} />
            <span className="text-xs font-bold uppercase tracking-wider">
              {timeLeft < 60 ? "CRITICAL TIME REMAINING!" : "QUIZ PROGRESS TIMER"}
            </span>
          </div>
          <span className="text-lg font-black font-mono leading-none tracking-tight">
            {formatTime(timeLeft)}
          </span>
        </div>
      )}

      <Card className="shadow-xl rounded-[2.5rem] overflow-hidden border border-slate-100 bg-white">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50/20 border-b border-slate-100 py-6 px-8">
          <div className="flex justify-between items-start gap-4">
            <div>
                <CardTitle className="text-2xl font-black text-slate-800 uppercase tracking-tight">{quiz.title}</CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium">Assessment Topic: {quiz.topic}</CardDescription>
            </div>
            <Badge variant="outline" className="bg-white border-slate-200/80 text-slate-650 font-bold px-3 py-1 rounded-full uppercase text-[10px]">
              {quiz.forGradeLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pt-8 px-8">
          {quiz.questions.map((q, index) => {
            const studentAns = (answers[index] || '').trim().toLowerCase();
            const correctAns = (q.correctAnswer || '').trim().toLowerCase();
            const isCorrect = q.type === 'written'
              ? (studentAns === correctAns || (correctAns.includes(studentAns) && studentAns.length > 2))
              : (answers[index] === q.correctAnswer);

            return (
              <div key={index} className={cn("p-6 rounded-2xl border-2 transition-all duration-300 shadow-sm", 
                  submitted 
                  ? (isCorrect ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20')
                  : 'border-slate-100 hover:border-indigo-200'
              )}>
                <p className="font-extrabold text-slate-800 text-base mb-6 leading-snug">
                  {index + 1}. <MathText text={q.questionText} />
                </p>
                
                {q.type === 'written' ? (
                  <div className="space-y-4">
                    {!submitted ? (
                      <Input
                        disabled={submitted}
                        placeholder="Type your answer here..."
                        value={answers[index] || ''}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className="rounded-xl border-2 border-slate-200/80 bg-white hover:bg-slate-50/20 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-12 text-xs font-semibold"
                      />
                    ) : (
                      <div className="space-y-3">
                        <Input
                          disabled
                          value={answers[index] || '(No Answer)'}
                          className="rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-500 h-12 text-xs font-bold"
                        />
                        <div className="p-4 bg-emerald-50/40 border border-emerald-150 rounded-2xl text-xs space-y-1.5 shadow-sm">
                          <span className="font-extrabold text-emerald-600 block uppercase text-[10px] tracking-wider">Correct Reference Answer:</span>
                          <span className="font-bold text-emerald-850 leading-relaxed block"><MathText text={q.correctAnswer} /></span>
                        </div>
                        {q.explanation && (
                          <p className="text-[10px] text-slate-400 font-bold leading-normal italic pl-2">
                            Explanation: <MathText text={q.explanation} />
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <RadioGroup
                      onValueChange={(value) => handleAnswerChange(index, value)}
                      disabled={submitted}
                      value={answers[index]}
                      className="space-y-3"
                    >
                      {q.options?.map((option, i) => {
                        const isSelected = answers[index] === option;
                        const isCorrectAnswer = option === q.correctAnswer;
                        
                        let optionStyles = "bg-white border-slate-200/80 text-slate-700 hover:border-slate-350 hover:bg-slate-55 hover:bg-slate-50";
                        
                        if (submitted) {
                          if (isCorrectAnswer) {
                            optionStyles = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/10";
                          } else if (isSelected) {
                            optionStyles = "border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-500/10";
                          } else {
                            optionStyles = "border-slate-150 bg-slate-50/50 text-slate-400 opacity-60";
                          }
                        } else if (isSelected) {
                          optionStyles = "border-indigo-500 bg-indigo-50/50 text-indigo-950 font-bold ring-2 ring-indigo-500/10 shadow-indigo-100/50";
                        }

                        return (
                          <div 
                            key={i} 
                            onClick={() => !submitted && handleAnswerChange(index, option)}
                            className={cn(
                              "flex items-center space-x-3.5 p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer select-none shadow-sm", 
                              optionStyles
                            )}
                          >
                            <RadioGroupItem value={option} id={`q${index}-o${i}`} className="sr-only" />
                            <div className={cn(
                              "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                              isSelected 
                                ? (submitted 
                                    ? (isCorrectAnswer ? "border-emerald-650 bg-emerald-650 text-white" : "border-rose-650 bg-rose-650 text-white")
                                    : "border-indigo-650 bg-indigo-650 text-white"
                                  )
                                : "border-slate-300 bg-white"
                            )}>
                              {isSelected && (
                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                              )}
                            </div>
                            <Label htmlFor={`q${index}-o${i}`} className="flex-grow cursor-pointer font-bold text-xs leading-none">
                              <MathText text={option} />
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                    
                    {submitted && !isCorrect && (
                        <div className="mt-4 p-3 bg-white border border-rose-100 rounded-xl text-xs text-rose-650 font-semibold italic flex items-center gap-1.5 shadow-sm">
                          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                          <span><span className="font-extrabold text-rose-700">Correct Option:</span> <MathText text={q.correctAnswer} /></span>
                        </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </CardContent>
        <CardFooter className="flex flex-col gap-6 py-8 px-8 bg-slate-50 border-t border-slate-100">
          {submitted ? (
              <div className="text-center space-y-4 w-full">
                  <div className="inline-block p-6 rounded-[2rem] bg-white shadow-xl border-4 border-indigo-100 mb-2">
                    <p className="text-3xl font-black text-indigo-600 font-mono">{score} <span className="text-sm text-indigo-400">/ {quiz.questions.length}</span></p>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 flex items-center justify-center gap-1.5">
                    <Sparkles className="h-5 w-5 text-indigo-600 animate-spin" /> Mission Completed!
                  </h3>
                  <Button onClick={() => router.push(`/dashboard/assignments`)} size="lg" className="px-12 bg-indigo-650 hover:bg-indigo-700 rounded-full h-14 text-sm font-bold text-white shadow-md">
                    Return to Assignments Feed
                  </Button>
              </div>
          ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting} 
                className="w-full h-14 bg-indigo-650 hover:bg-indigo-700 text-sm font-bold rounded-xl shadow-lg text-white"
              >
                  {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Submitting answers...</> : "Submit My Assessment Answers"}
              </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
