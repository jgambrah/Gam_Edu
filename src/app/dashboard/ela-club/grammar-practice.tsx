

'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ElaGrammarDrill, Student } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRole } from '@/context/role-context';


export function GrammarPractice() {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { role } = useRole(); 

  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);
  
  const { data: studentData, isLoading: isLoadingStudent } = useCollection<Student>(
    useMemoFirebase(() => 
      (user && firestore && !isStaff) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, 
    [firestore, user, isStaff])
  );
  const studentClassId = studentData?.[0]?.classId;
  
  const drillsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    if (isStaff) {
      return query(collection(firestore, 'ela_grammar_drills'));
    }
    if (studentClassId) {
      return query(collection(firestore, 'ela_grammar_drills'), where('classId', '==', studentClassId));
    }
    return null;
  }, [firestore, isStaff, studentClassId]);

  const { data: drills, isLoading } = useCollection<ElaGrammarDrill>(drillsQuery);

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [practiceDrills, setPracticeDrills] = useState<ElaGrammarDrill[]>([]);
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const { toast } = useToast();

  const uniqueTopics = useMemo(() => {
    if (!drills) return [];
    return Array.from(new Set(drills.map(d => d.topic)));
  }, [drills]);

  const handleStartPractice = () => {
      if (!selectedTopic || !drills) return;
      const filteredDrills = drills.filter(d => d.topic === selectedTopic);
      setPracticeDrills(filteredDrills);
      setCurrentDrillIndex(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) {
      toast({ variant: 'destructive', title: 'No Answer Selected', description: 'Please choose an option before checking.' });
      return;
    }
    const currentDrill = practiceDrills[currentDrillIndex];
    const correct = selectedAnswer === currentDrill.correct_answer;
    setIsCorrect(correct);
    toast({
      title: correct ? 'Correct!' : 'Not Quite',
      description: correct ? 'Great job!' : `The correct answer was "${currentDrill.correct_answer}"`,
      variant: correct ? 'default' : 'destructive',
    });
  };

  const handleNext = () => {
    if (!practiceDrills) return;
    setIsCorrect(null);
    setSelectedAnswer(null);
    if (currentDrillIndex < practiceDrills.length - 1) {
        setCurrentDrillIndex((prev) => prev + 1);
    } else {
        // End of practice session for this topic
        toast({ title: 'Topic Complete!', description: 'You have completed all drills for this topic.'});
        setPracticeDrills([]);
    }
  };

  const isLoadingData = isLoading || (isLoadingStudent && !isStaff);

  if (practiceDrills.length > 0) {
    const currentDrill = practiceDrills[currentDrillIndex];
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
            <CardFooter className="flex justify-between">
                {isCorrect === null ? (
                <Button onClick={handleCheckAnswer}>Check Answer</Button>
                ) : (
                <Button onClick={handleNext}>
                    {currentDrillIndex === practiceDrills.length - 1 ? 'Finish' : 'Next Question'}
                </Button>
                )}
                <Button variant="ghost" onClick={() => setPracticeDrills([])}>Change Topic</Button>
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grammar & Mechanics Practice</CardTitle>
        <CardDescription>Choose a topic to start practicing.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingData ? (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : (role === 'Student' && !studentClassId) ? (
            <p className="text-center text-muted-foreground py-10">You are not assigned to a class. Please contact an administrator.</p>
        ) : uniqueTopics.length > 0 ? (
            <div className="space-y-4">
                 <Select onValueChange={setSelectedTopic}>
                    <SelectTrigger><SelectValue placeholder="Select a Topic" /></SelectTrigger>
                    <SelectContent>
                        {uniqueTopics.map(topic => (
                            <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleStartPractice} disabled={!selectedTopic} className="w-full">Start Practice</Button>
            </div>
        ) : (
             <p className="text-center text-muted-foreground py-10">No grammar drills are available for your class yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
