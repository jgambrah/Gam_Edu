
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { generatePracticeProblems, GeneratePracticeProblemsOutput } from '@/ai/flows/generate-practice-problems-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Class } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';

type Subject = 'Math' | 'Science' | 'ELA Grammar';

export function AiProblemGenerator({ subject, setOpen }: { subject: Subject; setOpen: (open: boolean) => void }) {
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedProblems, setGeneratedProblems] = useState<GeneratePracticeProblemsOutput | null>(null);
  
  // State for form inputs
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [numQuestions, setNumQuestions] = useState(5);
  const [gradeLevel, setGradeLevel] = useState('Grade 9');
  
  // State for saving
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
    if (!generatedProblems || !classId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a class before saving.'});
        return;
    }
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to save.' });
        return;
    }
    setIsSaving(true);
    
    const collectionNameMap = {
        'Math': 'math_problems',
        'Science': 'science_problems',
        'ELA Grammar': 'ela_grammar_drills',
    };
    const collectionName = collectionNameMap[subject];

    try {
        const batch = writeBatch(firestore);

        generatedProblems.problems.forEach(problem => {
            const problemRef = doc(collection(firestore, collectionName));
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
        
        await batch.commit();
        toast({ title: 'Success!', description: `${generatedProblems.problems.length} problems have been saved.`});
        setOpen(false);

    } catch (e) {
        console.error("Error saving problems:", e);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save the generated problems.' });
    } finally {
        setIsSaving(false);
    }
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
              <Label>Target Grade Level</Label>
              <Input placeholder="e.g., Grade 9" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} />
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
                <div className="space-y-2">
                    <Label>Assign to Class</Label>
                    <Select onValueChange={setClassId} value={classId}>
                        <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                        <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
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
