'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
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
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';

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

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = async () => {
    if (!user || !quiz || !schoolId || !firestore) return;
    setIsSubmitting(true);

    let currentScore = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
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
            schoolId: schoolId, // SAAS Stamp
        };
        // Save to root-level collection for easier "My Attempts" queries
        await addDoc(collection(firestore, 'quizAttempts'), attemptData);

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

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (!quiz) {
    return (
        <div className="p-8 text-center">
            <Card>
                <CardHeader><CardTitle>Quiz Not Found</CardTitle></CardHeader>
                <CardContent><Button onClick={() => router.back()}>Go Back</Button></CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <Loader2 className="mr-2 h-4 w-4 rotate-180" /> Back
      </Button>
      <Card className="shadow-xl">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-3xl font-bold">{quiz.title}</CardTitle>
                <CardDescription>Topic: {quiz.topic}</CardDescription>
            </div>
            <Badge variant="outline" className="bg-white">{quiz.forGradeLevel}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          {quiz.questions.map((q, index) => (
            <div key={index} className={cn("p-6 rounded-2xl border-2 transition-all", 
                submitted 
                ? (answers[index] === q.correctAnswer ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
                : 'border-slate-100 hover:border-indigo-200'
            )}>
              <p className="font-bold text-lg mb-6 text-slate-800">
                {index + 1}. {q.questionText}
              </p>
              <RadioGroup
                onValueChange={(value) => handleAnswerChange(index, value)}
                disabled={submitted}
                className="space-y-3"
              >
                {q.options.map((option, i) => (
                  <div key={i} className={cn("flex items-center space-x-3 p-3 rounded-xl border transition-colors", 
                    answers[index] === option ? "bg-white border-indigo-500" : "bg-white/50 border-transparent"
                  )}>
                    <RadioGroupItem value={option} id={`q${index}-o${i}`} />
                    <Label htmlFor={`q${index}-o${i}`} className={cn("flex-grow cursor-pointer font-medium", 
                        submitted && option === q.correctAnswer && 'text-green-700 font-bold'
                    )}>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {submitted && answers[index] !== q.correctAnswer && (
                  <div className="mt-4 p-3 bg-white/80 rounded-lg text-sm text-red-600 border border-red-100 italic">
                    <span className="font-bold">Correct Answer:</span> {q.correctAnswer}
                  </div>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col gap-6 py-8 bg-slate-50 border-t">
          {submitted ? (
              <div className="text-center space-y-4 w-full">
                  <div className="inline-block p-6 rounded-full bg-white shadow-lg border-4 border-indigo-100 mb-2">
                    <p className="text-4xl font-black text-indigo-600">{score} / {quiz.questions.length}</p>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Mission Accomplished!</h3>
                  <Button onClick={() => router.push(`/dashboard/assignments`)} size="lg" className="px-12 bg-indigo-600 hover:bg-indigo-700 rounded-full h-14 text-lg font-bold">
                    Back to Assignments
                  </Button>
              </div>
          ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting || Object.keys(answers).length !== quiz.questions.length} className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-xl font-bold rounded-2xl shadow-lg">
                  {isSubmitting ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Submitting...</> : "Submit My Answers"}
              </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
