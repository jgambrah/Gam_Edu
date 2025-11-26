
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

const generateProblemsSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  numQuestions: z.coerce.number().min(1).max(10),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  gradeLevel: z.string().min(1, 'Please specify a grade level.'),
});

type GenerateProblemsFormData = z.infer<typeof generateProblemsSchema>;
type Subject = 'Math' | 'Science' | 'ELA Grammar';

export function AiProblemGenerator({ subject, setOpen }: { subject: Subject; setOpen: (open: boolean) => void }) {
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedProblems, setGeneratedProblems] = useState<GeneratePracticeProblemsOutput | null>(null);
  const [classIdToSave, setClassIdToSave] = useState('');

  const { data: classes } = useCollection<Class>(useMemoFirebase(() => collection(firestore, 'classes'), [firestore]));

  const form = useForm<GenerateProblemsFormData>({
    resolver: zodResolver(generateProblemsSchema),
    defaultValues: {
      topic: '',
      numQuestions: 5,
      difficulty: 'Easy',
      gradeLevel: 'Grade 9',
    },
  });

  async function onGenerate(values: GenerateProblemsFormData) {
    setIsGenerating(true);
    setGeneratedProblems(null);
    toast({ title: 'Generating Problems...', description: 'Please wait while the AI creates questions.' });

    try {
      // The AI flow might not explicitly use gradeLevel, but it's good practice for context
      const result = await generatePracticeProblems({ ...values, subject });
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
    if (!generatedProblems || !classIdToSave) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select a class before saving.'});
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
        const { topic, difficulty } = form.getValues();

        generatedProblems.problems.forEach(problem => {
            const problemRef = doc(collection(firestore, collectionName));
            let data: any = {
                ...problem,
                topic,
                difficulty,
                classId: classIdToSave,
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onGenerate)} className="space-y-4 p-4 border rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField control={form.control} name="topic" render={({ field }) => (
              <FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g., Algebra" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="difficulty" render={({ field }) => (
                <FormItem><FormLabel>Difficulty</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent></Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="numQuestions" render={({ field }) => (
              <FormItem><FormLabel># of Questions</FormLabel><FormControl><Input type="number" min={1} max={10} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="gradeLevel" render={({ field }) => (
                <FormItem><FormLabel>Target Grade Level</FormLabel><FormControl><Input placeholder="e.g., Grade 9" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </div>
          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            Generate Problems
          </Button>
        </form>
      </Form>

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
                <FormLabel>Assign to Class</FormLabel>
                <Select onValueChange={setClassIdToSave} value={classIdToSave}>
                    <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                    <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
            </div>
            <Button onClick={onSave} disabled={isSaving || !classIdToSave}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Problems
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
