'use client';

import { useAuth, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { Quiz, QuizAttempt } from '@/lib/types';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRole } from '@/context/role-context';

export default function QuizPage() {
  const { quizId } = useParams();
  const router = useRouter();
  const { role } = useRole();
  const firestore = useFirestore();
  const { user } = useAuth();
  const { toast } = useToast();

  const quizRef = useMemoFirebase(() => doc(firestore, 'quizzes', quizId as string), [firestore, quizId]);
  const { data: quiz, isLoading } = useDoc<Quiz>(quizRef);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    let currentScore = 0;
    quiz?.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        currentScore++;
      }
    });

    setScore(currentScore);
    setSubmitted(true);
    
    if (user && quiz) {
        const attemptData: Omit<QuizAttempt, 'id'> = {
            quizId: quiz.id,
            studentId: user.uid,
            score: currentScore,
            total: quiz.questions.length,
            completedAt: serverTimestamp()
        };
        await addDoc(collection(firestore, `quizzes/${quiz.id}/attempts`), attemptData);
    }


    toast({
      title: 'Quiz Submitted!',
      description: `You scored ${currentScore} out of ${quiz?.questions.length}.`,
    });
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  if (!quiz) {
    return <div>Quiz not found.</div>;
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">{quiz.title}</CardTitle>
        <CardDescription>Topic: {quiz.topic}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {quiz.questions.map((q, index) => (
          <div key={index} className={cn("p-4 rounded-lg border", submitted && (answers[index] === q.correctAnswer ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'))}>
            <p className="font-semibold mb-4">
              {index + 1}. {q.questionText}
            </p>
            <RadioGroup
              onValueChange={(value) => handleAnswerChange(index, value)}
              disabled={submitted}
            >
              {q.options.map((option, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`q${index}-o${i}`} />
                  <Label htmlFor={`q${index}-o${i}`} className={cn(submitted && option === q.correctAnswer && 'text-green-700 font-bold')}>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {submitted && answers[index] !== q.correctAnswer && (
                <p className="text-sm text-red-600 mt-2">Correct Answer: {q.correctAnswer}</p>
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {submitted ? (
            <>
                <p className="text-2xl font-bold">Your Score: {score} / {quiz.questions.length}</p>
                <Button onClick={() => router.push(`/dashboard/assignments?role=${role}`)}>Back to Assignments</Button>
            </>
        ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting || Object.keys(answers).length !== quiz.questions.length}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Submit Quiz
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
