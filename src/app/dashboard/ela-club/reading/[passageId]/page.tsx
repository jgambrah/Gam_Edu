

'use client';

import { Suspense, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { ElaReadingPassage } from '@/lib/types';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

function ReadingTestComponent() {
    const { passageId } = useParams();
    const router = useRouter();
    const firestore = useFirestore();
    const { user } = useAuth();
    const { toast } = useToast();

    const passageRef = useMemoFirebase(() => doc(firestore, 'ela_reading_passages', passageId as string), [firestore, passageId]);
    const { data: passage, isLoading } = useDoc<ElaReadingPassage>(passageRef);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswerChange = (questionIndex: number, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const handleNext = () => {
        if (passage && currentQuestionIndex < passage.question_set.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handleSubmit = async () => {
        if (!passage || !user) return;
    
        let correctCount = 0;
        passage.question_set.forEach((q, index) => {
          if (answers[index]?.trim().toLowerCase() === q.correct_answer_key.trim().toLowerCase()) {
            correctCount++;
          }
        });
    
        const finalScore = (correctCount / passage.question_set.length) * 100;
        setScore(finalScore);
        setIsFinished(true);
    
        // TODO: Save submission/result to Firestore
        // await addDoc(collection(firestore, 'ela_submissions'), { ... });
    
        toast({ title: 'Test Complete!', description: `You scored ${finalScore.toFixed(0)}%.` });
      };

    if (isLoading) return <Loader2 className="mx-auto my-8 h-8 w-8 animate-spin" />;
    if (!passage) return <p>Reading passage not found.</p>;

    const currentQuestion = passage.question_set[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / passage.question_set.length) * 100;

    return (
        <div className="grid md:grid-cols-2 gap-6">
             <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>{passage.title}</CardTitle>
                    <CardDescription>Reading Level: {passage.reading_level}</CardDescription>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none max-h-[60vh] overflow-y-auto">
                    {passage.passage_text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </CardContent>
            </Card>

            <Card className="md:col-span-1">
                {isFinished ? (
                     <CardContent className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-2xl font-bold">Test Complete!</h2>
                        <p className="text-5xl font-bold my-4">{score.toFixed(0)}%</p>
                        <p>You answered {score / 100 * passage.question_set.length} out of {passage.question_set.length} questions correctly.</p>
                        <Button onClick={() => router.push('/dashboard/ela-club')} className="mt-6">Back to ELA Club</Button>
                    </CardContent>
                ) : (
                    <>
                        <CardHeader>
                            <CardTitle>Question {currentQuestionIndex + 1} of {passage.question_set.length}</CardTitle>
                            <Progress value={progress} className="mt-2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="font-semibold">{currentQuestion.question}</p>
                            {currentQuestion.type === 'MCQ' ? (
                                <RadioGroup onValueChange={(value) => handleAnswerChange(currentQuestionIndex, value)} value={answers[currentQuestionIndex] || ''}>
                                    {currentQuestion.options?.map((option, i) => (
                                        <div key={i} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${i}`} />
                                            <Label htmlFor={`q${currentQuestionIndex}-o${i}`}>{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            ) : (
                                <Textarea 
                                    placeholder="Type your answer here..."
                                    value={answers[currentQuestionIndex] || ''}
                                    onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
                                />
                            )}
                        </CardContent>
                        <CardFooter>
                            {currentQuestionIndex < passage.question_set.length - 1 ? (
                                <Button onClick={handleNext} disabled={!answers[currentQuestionIndex]}>Next Question</Button>
                            ) : (
                                <Button onClick={handleSubmit} disabled={!answers[currentQuestionIndex]}>Finish Test</Button>
                            )}
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
}

export default function ReadingPassagePage() {
    return (
      <Suspense fallback={<Loader2 className="mx-auto my-8 h-16 w-16 animate-spin" />}>
        <ReadingTestComponent />
      </Suspense>
    );
}
