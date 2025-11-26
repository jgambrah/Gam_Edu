
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MathProblem, Student } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

function QuizComponent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic');
  const difficulty = searchParams.get('difficulty');

  const firestore = useFirestore();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(() => user ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user])
  );
  const studentClassId = studentData?.[0]?.classId;

  const problemsQuery = useMemoFirebase(
    () => (topic && difficulty)
      ? query(
          collection(firestore, 'math_problems'),
          where('topic', '==', topic),
          where('difficulty', '==', difficulty),
          // Not filtering by classId to allow access to all problems of a topic
        )
      : null,
    [firestore, topic, difficulty]
  );
  const { data: problems, isLoading } = useCollection<MathProblem>(problemsQuery);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (problems && problems.length > 0) {
      setStartTime(new Date());
    }
  }, [problems]);

  const handleAnswerChange = (questionIndex: number, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleNext = () => {
    if (problems && currentQuestionIndex < problems.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!problems || !user || !startTime) return;
    setIsSubmitting(true);

    let correctCount = 0;
    problems.forEach((p, index) => {
      // Use == for loose comparison as answer can be string or number
      if (answers[index] == p.correct_answer) {
        correctCount++;
      }
    });

    const finalScore = (correctCount / problems.length) * 10;
    const timeTaken = Math.round((new Date().getTime() - startTime.getTime()) / 1000);

    setScore(finalScore);
    setIsFinished(true);

    try {
        await addDoc(collection(firestore, 'user_results'), {
            userId: user.uid,
            topic,
            difficulty,
            score: finalScore,
            time_taken_seconds: timeTaken,
            date_completed: serverTimestamp(),
            correct_count: correctCount,
        });
        toast({ title: 'Practice Complete!', description: `You scored ${finalScore.toFixed(1)}/10.`});
    } catch (error) {
        console.error("Error saving results: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save your results.'});
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
            <CardHeader><CardTitle>Practice Complete!</CardTitle></CardHeader>
            <CardContent className="text-center">
                <p className="text-4xl font-bold">Your score: {score.toFixed(1)} / 10</p>
                <p>You got {Math.round(score / 10 * problems.length)} out of {problems.length} questions correct.</p>
            </CardContent>
            <CardFooter>
                 <Button onClick={() => window.location.reload()} className="w-full">Try Another Practice</Button>
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
        <RadioGroup onValueChange={(value) => handleAnswerChange(currentQuestionIndex, value)}>
          {currentProblem.options?.map((option, i) => (
            <div key={i} className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value={String(option)} id={`q${currentQuestionIndex}-o${i}`} />
              <Label htmlFor={`q${currentQuestionIndex}-o${i}`} className="font-normal">{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
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
