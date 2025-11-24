
'use client';

import { useState } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ElaGrammarDrill, Student } from '@/lib/types';

export function GrammarPractice() {
  const firestore = useFirestore();
  const { user } = useAuth();

  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(() => user ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user])
  );
  const studentClassId = studentData?.[0]?.classId;
  
  const drillsQuery = useMemoFirebase(() => 
    studentClassId ? query(collection(firestore, 'ela_grammar_drills'), where('classId', '==', studentClassId)) : null,
    [firestore, studentClassId]
  );
  const { data: drills, isLoading } = useCollection<ElaGrammarDrill>(drillsQuery);
  
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleCheckAnswer = () => {
    if (!selectedAnswer) {
      toast({ variant: 'destructive', title: 'No Answer Selected', description: 'Please choose an option before checking.' });
      return;
    }
    const correct = selectedAnswer === currentDrill.correct_answer;
    setIsCorrect(correct);
    toast({
      title: correct ? 'Correct!' : 'Not Quite',
      description: correct ? 'Great job!' : `The correct answer was "${currentDrill.correct_answer}"`,
      variant: correct ? 'default' : 'destructive',
    });
  };

  const handleNext = () => {
    if (!drills) return;
    setIsCorrect(null);
    setSelectedAnswer(null);
    setCurrentDrillIndex((prev) => (prev + 1) % drills.length);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Grammar & Mechanics Drills</CardTitle>
          <CardDescription>Loading grammar exercises...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!drills || drills.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Grammar & Mechanics Drills</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <p className="text-muted-foreground">No grammar drills are available for your class yet.</p>
        </CardContent>
      </Card>
    );
  }

  const currentDrill = drills[currentDrillIndex];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grammar & Mechanics Drills</CardTitle>
        <CardDescription>Topic: {currentDrill.topic}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-semibold">{currentDrill.question_prompt}</p>
        <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer || ''} disabled={isCorrect !== null} className="space-y-2">
          {currentDrill.options?.map((option, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center space-x-3 space-y-0 rounded-md border p-4", 
                isCorrect !== null && option === currentDrill.correct_answer && 'border-green-500 bg-green-50',
                isCorrect === false && selectedAnswer === option && 'border-red-500 bg-red-50'
              )}
            >
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="font-normal w-full">{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        {isCorrect === null ? (
          <Button onClick={handleCheckAnswer}>Check Answer</Button>
        ) : (
          <Button onClick={handleNext}>Next Question</Button>
        )}
      </CardFooter>
    </Card>
  );
}
