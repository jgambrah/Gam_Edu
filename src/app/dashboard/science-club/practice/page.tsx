

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser, useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, where, serverTimestamp, addDoc, doc, setDoc, increment } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { ScienceProblem, Student } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

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
  
  const problemCollection = version === '4' ? 'science_problems_v4' : 'science_problems';

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
  const { data: problems, isLoading } = useCollection<ScienceProblem>(problemsQuery);

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
    if (!problems) return;
    if (!user || !firestore) {
        toast({ variant: 'destructive', title: "Authentication Error", description: "You must be logged in to submit."});
        return;
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
    
    const leaderboardRef = doc(firestore, 'science_leaderboard', user.uid);
    const leaderboardData = {
        userId: user.uid,
        userName: user.displayName || user.email || 'Anonymous',
        profilePictureUrl: user.photoURL || '',
        total_correct_answers: increment(correctCount),
        total_quizzes_completed: increment(1)
    };

    const resultsCollection = collection(firestore, 'science_results');

    // Perform writes and catch potential errors to emit a contextual error.
    try {
        await Promise.all([
            setDoc(leaderboardRef, leaderboardData, { merge: true }),
            addDoc(resultsCollection, resultData)
        ]);

        setScore(finalScore);
        setIsFinished(true);
        toast({ title: 'Practice Complete!', description: `You scored ${finalScore.toFixed(1)}/10.`});
    } catch (serverError) {
        // Create and emit a detailed error for the listener
        const permissionError = new FirestorePermissionError({
            path: `science_leaderboard/${user.uid} or science_results`,
            operation: 'write', // Covers both set and add
            requestResourceData: { leaderboard: leaderboardData, result: resultData },
        });
        errorEmitter.emit('permission-error', permissionError);
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
                 <Button onClick={() => router.push('/dashboard/science-club')} className="w-full">Back to Science Club</Button>
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Science Practice: {topic} ({difficulty})</CardTitle>
        <Progress value={progress} className="mt-2" />
        <CardDescription>Question {currentQuestionIndex + 1} of {problems.length}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="font-semibold text-lg">{currentProblem.question_text}</p>
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
