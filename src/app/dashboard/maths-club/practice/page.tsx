
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser, useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, where, serverTimestamp, addDoc, doc, setDoc, increment } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { MathProblem, Student } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { awardActivityXP, triggerStudentBadgeEvent } from '@/lib/achievement-utils';
import confetti from 'canvas-confetti';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';


// HELPER: Strips all "noise" from AI or Manual LaTeX inputs
const cleanLatex = (formula: string = "") => {
  if (!formula) return "";
  return formula
    .replace(/\$\$/g, '')      // Remove $$
    .replace(/\$/g, '')        // Remove $
    .replace(/\\\[/g, '')      // Remove \[
    .replace(/\\\]/g, '')      // Remove \]
    .replace(/\\begin\{equation\}/g, '') // Remove equation blocks
    .replace(/\\end\{equation\}/g, '')
    .trim();
};

function SafeMath({ formula, block = true }: { formula: string, block?: boolean }) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-10 w-full animate-pulse bg-slate-800/50 rounded" />;

  const cleaned = cleanLatex(formula);

  try {
    return block ? (
      <div className="math-container py-4 overflow-x-auto">
        <BlockMath math={cleaned} />
      </div>
    ) : (
      <InlineMath math={cleaned} />
    );
  } catch (error) {
    console.error("LaTeX Error:", error);
    return <code className="text-red-500">{formula}</code>;
  }
}

function QuizComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = searchParams.get('topic');
  const difficulty = searchParams.get('difficulty');
  const version = searchParams.get('version'); // To know which collection to query

  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user])
  );
  const studentClassId = studentData?.[0]?.classId;

  const problemCollection = version === '4' ? 'science_problems_v4' : 'math_problems';

  const problemsQuery = useMemoFirebase(
    () => (topic && difficulty && firestore)
      ? query(
          collection(firestore, problemCollection),
          where('topic', '==', topic),
          where('difficulty', '==', difficulty),
        )
      : null,
    [firestore, topic, difficulty, problemCollection]
  );
  const { data: problems, isLoading } = useCollection<MathProblem>(problemsQuery);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (problems && problems.length > 0 && !startTime) {
      setStartTime(new Date());
    }
  }, [problems, startTime]);

  const handleAnswerChange = (questionIndex: number, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleNext = () => {
    if (problems && currentQuestionIndex < problems.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!problems) {
        console.error("Submission Failed: No problems loaded.");
        return;
    }
    if (!user || !firestore) {
        alert("Error: You seem to be logged out. Please refresh.");
        return;
    }
    if (!startTime) {
        console.warn("Timer missing, using fallback.");
    }
    
    setIsSubmitting(true);

    let correctCount = 0;
    problems.forEach((p, index) => {
      if (answers[index] == p.correct_answer) {
        correctCount++;
      }
    });

    const finalScore = (correctCount / problems.length) * 10;
    
    const safeStartTime = startTime || new Date(); 
    const timeTaken = Math.round((new Date().getTime() - safeStartTime.getTime()) / 1000);
    
    const resultData = { 
        userId: user.uid,
        topic,
        difficulty,
        score: finalScore,
        time_taken_seconds: timeTaken,
        date_completed: serverTimestamp(),
        correct_count: correctCount,
    };
    
    const leaderboardRef = doc(firestore, 'global_leaderboard', user.uid);
    const leaderboardData = {
        userId: user.uid,
        userName: user.displayName || user.email || 'Anonymous', // Ensure userName is never null
        profilePictureUrl: user.photoURL || '',
        total_correct_answers: increment(correctCount),
        total_quizzes_completed: increment(1)
    };


    const { data: studentRecord } = useCollection<Student>(
        useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [user, firestore])
    );

    try {
        await setDoc(leaderboardRef, leaderboardData, { merge: true });
        await addDoc(resultsCollection, resultData);

        const targetStudentId = studentRecord && studentRecord[0]?.id ? studentRecord[0].id : user.uid;
        const pointsAwarded = Math.max(30, Math.round(correctCount * 10));

        await awardActivityXP(firestore, targetStudentId, pointsAwarded, 'Maths Practice Matrix', 'stem_explorer');
        await triggerStudentBadgeEvent(firestore, targetStudentId, { type: 'STEM_CHALLENGE_COMPLETED' });

        setScore(finalScore);
        setIsFinished(true);
        confetti({ particleCount: 120, spread: 70, colors: ['#10b981', '#6366f1'] });
        toast({ title: 'Quantum Simulation Complete! 📐', description: `Scored ${finalScore.toFixed(0)}/10! +${pointsAwarded} XP saved to your profile.`});

    } catch (serverError) {
        console.error("Submission Error:", serverError);
        const permissionError = new FirestorePermissionError({
            path: `user_results or global_leaderboard`,
            operation: 'create',
            requestResourceData: { resultData, leaderboardData },
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Submission Error', description: 'Could not save your results. Check permissions and try again.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading || isUserLoading) {
    return <Loader2 className="mx-auto my-8 h-8 w-8 animate-spin" />;
  }

  if (!problems || problems.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No practice problems found for this topic and difficulty.</p>;
  }

  const currentProblem = problems[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / problems.length) * 100;

  if (isFinished) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Practice Review: {topic}</CardTitle>
                <CardDescription>You scored {score.toFixed(1)} / 10. Review your answers below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {problems.map((p, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = userAnswer == p.correct_answer;
                    return (
                        <div key={p.id} className={cn("p-4 rounded-lg border", isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200')}>
                            <p className="font-semibold mb-2">{index + 1}. {p.question_text}</p>
                            <div className="space-y-2 mb-3">
                                {(p.options || []).map((option, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        {userAnswer == option ? (
                                            isCorrect ? <CheckCircle2 className="h-4 w-4 text-green-600"/> : <XCircle className="h-4 w-4 text-red-600"/>
                                        ) : (
                                            <div className="w-4 h-4" />
                                        )}
                                        <p className={cn("text-sm", userAnswer == option && !isCorrect && "line-through text-muted-foreground")}>{option}</p>
                                    </div>
                                ))}
                            </div>
                            {!isCorrect && (
                                <p className="text-sm font-semibold text-green-700">Correct Answer: {p.correct_answer}</p>
                            )}
                            {p.explanation && (
                                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-black/10">
                                    <span className="font-semibold">Explanation:</span> {p.explanation}
                                </p>
                            )}
                        </div>
                    )
                })}
            </CardContent>
            <CardFooter>
                 <Button onClick={() => router.push('/dashboard/maths-club-v2')} className="w-full">Back to Maths Club</Button>
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maths Practice: {topic} ({difficulty})</CardTitle>
        <Progress value={progress} className="mt-2" />
        <CardDescription>Question {currentQuestionIndex + 1} of {problems.length}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="font-semibold text-lg">{currentProblem.question_text}</p>
        
        {(currentProblem as any).latexFormula && (
            <div className="bg-slate-900 p-8 rounded-[32px] shadow-2xl border-t-8 border-emerald-500 my-6">
                <div className="text-4xl text-emerald-400 flex justify-center items-center">
                    <SafeMath formula={(currentProblem as any).latexFormula} />
                </div>
                <div className="mt-4 text-center">
                    <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                        Neural Math Engine Active
                    </p>
                </div>
            </div>
        )}

        <RadioGroup onValueChange={(value) => handleAnswerChange(currentQuestionIndex, value)} value={String(answers[currentQuestionIndex] || '')}>
          {(currentProblem.options || []).map((option, i) => (
            <div key={i} className="flex items-center space-x-3">
              <RadioGroupItem value={String(option)} id={`q${currentQuestionIndex}-o${i}`} />
              <Label htmlFor={`q${currentQuestionIndex}-o${i}`} className="font-normal">{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
        </Button>
        {currentQuestionIndex < problems.length - 1 ? (
          <Button onClick={handleNext} disabled={answers[currentQuestionIndex] === undefined}>Next Question</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting || answers[currentQuestionIndex] === undefined}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
            Finish & See Score
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default function PracticePage() {
    return (
        <Suspense fallback={<Loader2 className="mx-auto my-8 h-16 w-16 animate-spin"/>}>
            <QuizComponent />
        </Suspense>
    )
}
