
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { generatePracticeProblems, GeneratePracticeProblemsOutput } from '@/ai/flows/generate-practice-problems-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Class } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { getAuth } from 'firebase/auth';

type Subject = 'Math' | 'Science' | 'ELA Grammar';

export function AiProblemGenerator({ subject, setOpen }: { subject: Subject; setOpen: (open: boolean) => void }) {
  const { user: hookUser } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedProblems, setGeneratedProblems] = useState<GeneratePracticeProblemsOutput | null>(null);
  
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [numQuestions, setNumQuestions] = useState(5);
  const [classId, setClassId] = useState('');

  const { data: classes } = useCollection<Class>(useMemoFirebase(() => collection(firestore, 'classes'), [firestore]));

  async function onGenerate() {
    if (!topic) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter a topic.' });
        return;
    }
    setIsGenerating(true);
    setGeneratedProblems(null);
    toast({ title: 'Generating Problems...', description: 'Please wait while the AI creates questions.' });

    try {
      const result = await generatePracticeProblems({
        subject,
        topic,
        numQuestions,
        difficulty,
      });
      setGeneratedProblems(result);
      toast({ title: 'Problems Generated!', description: 'Review the questions and select a class to save.' });
    } catch (error) {
      console.error('Error generating problems:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'An AI error occurred while creating the problems.' });
    } finally {
      setIsGenerating(false);
    }
  }

  async function onSave() {
    const auth = getAuth();
    const currentUser = auth.currentUser || hookUser;

    if (!generatedProblems) {
        toast({ variant: 'destructive', title: 'Error', description: 'No problems have been generated.' });
        return;
    }
    if (!classId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a class before saving.'});
        return;
    }
    if (!currentUser) {
        toast({ variant: 'destructive', title: 'Logged Out', description: 'You seem to be logged out. Please refresh the page.' });
        return;
    }
    setIsSaving(true);
    
    const collectionNameMap = {
        'Math': 'math_problems',
        'Science': 'science_problems',
        'ELA Grammar': 'ela_grammar_drills',
    };
    const collectionName = collectionNameMap[subject];
    const problemsCollection = collection(firestore, collectionName);

    const batch = writeBatch(firestore);

    generatedProblems.problems.forEach(problem => {
        const problemRef = doc(problemsCollection);
        let data: any = {
            ...problem,
            topic,
            difficulty,
            classId: classId,
        };
        if (subject === 'ELA Grammar') {
            data.type = 'MCQ';
            data.question_prompt = problem.question_text;
        }
        batch.set(problemRef, data);
    });
    
    batch.commit()
      .then(() => {
        toast({ title: 'Success!', description: `${generatedProblems.problems.length} problems have been saved.`});
        setOpen(false);
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: problemsCollection.path,
            operation: 'create', // Batch write is a 'write' operation which includes create
            requestResourceData: generatedProblems.problems,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSaving(false);
      });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4 p-4 border rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Topic</Label>
              <Input placeholder="e.g., Algebra" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select onValueChange={(val: 'Easy' | 'Medium' | 'Hard') => setDifficulty(val)} value={difficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label># of Questions</Label>
              <Input type="number" min={1} max={10} value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} />
            </div>
             <div className="space-y-2">
              <Label>Assign to Class</Label>
              <Select onValueChange={setClassId} value={classId}>
                  <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                  <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <Button type="button" onClick={onGenerate} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate Problems
          </Button>
      </div>

        {generatedProblems && generatedProblems.problems.length > 0 && (
            <Card className="bg-muted/50">
            <CardHeader>
                <CardTitle>Generated Problems</CardTitle>
                <CardDescription>Review the generated questions. Select a class and click "Save Problems" to add them to the problem bank.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ScrollArea className="h-60 w-full pr-4">
                    <Accordion type="single" collapsible className="w-full">
                        {generatedProblems.problems.map((p, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>Question {index + 1}: {p.question_text}</AccordionTrigger>
                            <AccordionContent>
                            <ul className="space-y-2 list-disc pl-5">
                                {p.options.map((opt, i) => (
                                <li key={i} className={opt === p.correct_answer ? 'font-semibold text-green-600' : ''}>
                                    {opt}
                                </li>
                                ))}
                            </ul>
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                </ScrollArea>
                <Button onClick={onSave} disabled={isSaving || !classId}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Problems
                </Button>
            </CardContent>
            </Card>
        )}
    </div>
  );
}
