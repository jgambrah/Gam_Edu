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
import { Loader2, ArrowLeft, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
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
            schoolId: schoolId,
        };
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
          {quiz.questions.map((q, index) => (
            <div key={index} className={cn("p-6 rounded-2xl border-2 transition-all duration-300 shadow-sm", 
                submitted 
                ? (answers[index] === q.correctAnswer ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20')
                : 'border-slate-100 hover:border-indigo-200'
            )}>
              <p className="font-extrabold text-slate-800 text-base mb-6 leading-snug">
                {index + 1}. {q.questionText}
              </p>
              
              <RadioGroup
                onValueChange={(value) => handleAnswerChange(index, value)}
                disabled={submitted}
                value={answers[index]}
                className="space-y-3"
              >
                {q.options.map((option, i) => {
                  const isSelected = answers[index] === option;
                  const isCorrectAnswer = option === q.correctAnswer;
                  
                  let optionStyles = "bg-white border-slate-200/80 text-slate-700 hover:border-slate-350 hover:bg-slate-50";
                  
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
                        {option}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
              
              {submitted && answers[index] !== q.correctAnswer && (
                  <div className="mt-4 p-3 bg-white border border-rose-100 rounded-xl text-xs text-rose-600 font-medium italic flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-rose-500" />
                    <span><span className="font-extrabold text-rose-700">Correct Option:</span> {q.correctAnswer}</span>
                  </div>
              )}
            </div>
          ))}
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
                disabled={isSubmitting || Object.keys(answers).length !== quiz.questions.length} 
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
