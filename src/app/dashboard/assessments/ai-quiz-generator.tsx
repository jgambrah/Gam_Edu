
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
import { collection, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { generateQuiz, GenerateQuizOutput } from '@/ai/flows/generate-quiz-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { useRole } from '@/context/role-context';
import type { Class } from '@/lib/types';

const generateQuizSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  numQuestions: z.coerce.number().min(1).max(10),
  forGradeLevel: z.string().min(1, "Grade level is required."),
  additionalInstructions: z.string().optional(),
});

type GenerateQuizFormData = z.infer<typeof generateQuizSchema>;

export function AiQuizGenerator() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<GenerateQuizOutput | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  
  const classesQuery = useMemoFirebase(
    () => user && (role === 'Administrator' || role === 'Director') 
      ? collection(firestore, 'classes') 
      : query(collection(firestore, 'classes'), where('teacherId', '==', user?.uid || '')),
    [firestore, user, role]
  );
  const { data: classes } = useCollection<Class>(classesQuery);


  const form = useForm<GenerateQuizFormData>({
    resolver: zodResolver(generateQuizSchema),
    defaultValues: {
      topic: '',
      numQuestions: 5,
      forGradeLevel: 'Grade 5',
      additionalInstructions: '',
    },
  });

  async function onGenerate(values: GenerateQuizFormData) {
    setIsGenerating(true);
    setGeneratedQuiz(null);
    toast({ title: 'Generating Quiz...', description: 'Please wait while the AI creates your quiz.' });

    try {
      const result = await generateQuiz(values);
      setGeneratedQuiz(result);
      toast({ title: 'Quiz Generated!', description: 'Review the questions below before assigning.' });
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'An AI error occurred while creating the quiz.' });
    } finally {
      setIsGenerating(false);
    }
  }

  async function onAssign() {
    if (!generatedQuiz || !selectedClassId || !user) return;
    setIsAssigning(true);

    try {
        await addDoc(collection(firestore, 'quizzes'), {
            ...generatedQuiz,
            classId: selectedClassId,
            teacherId: user.uid,
            topic: form.getValues('topic'),
            forGradeLevel: form.getValues('forGradeLevel'),
            createdAt: serverTimestamp(),
        });
        toast({ title: 'Success!', description: `Quiz "${generatedQuiz.title}" has been assigned.` });
        setGeneratedQuiz(null);
        setSelectedClassId('');
        form.reset();
    } catch(error) {
        console.error("Error assigning quiz:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not assign quiz.' });
    } finally {
        setIsAssigning(false);
    }

  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-accent-foreground" />
            AI-Powered Quiz Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onGenerate)} className="space-y-6 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField control={form.control} name="topic" render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Topic</FormLabel>
                  <FormControl><Input placeholder="e.g., The Solar System" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="numQuestions" render={({ field }) => (
                <FormItem>
                  <FormLabel># of Questions</FormLabel>
                  <FormControl><Input type="number" min={1} max={10} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="forGradeLevel" render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade Level</FormLabel>
                  <FormControl><Input placeholder="e.g., Grade 5" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="additionalInstructions" render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Instructions (Optional)</FormLabel>
                  <FormControl><Textarea placeholder="e.g., Focus on the inner planets." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate Quiz
            </Button>
          </form>
        </Form>

        {generatedQuiz && (
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle>{generatedQuiz.title}</CardTitle>
                    <CardDescription>Review the generated quiz below. Assign it to a class when you are ready.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                        {generatedQuiz.questions.map((q, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>Question {index + 1}: {q.questionText}</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-2 list-disc pl-5">
                                        {q.options.map((opt, i) => (
                                            <li key={i} className={opt === q.correctAnswer ? 'font-semibold text-green-600' : ''}>
                                                {opt}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="mt-4 text-sm text-muted-foreground"><span className="font-semibold">Explanation:</span> {q.explanation}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    <div className="flex items-end gap-4 pt-4 border-t">
                        <div className="flex-grow">
                            <Label>Assign to Class</Label>
                            <Select onValueChange={setSelectedClassId} value={selectedClassId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={onAssign} disabled={isAssigning || !selectedClassId}>
                            {isAssigning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Save and Assign
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )}
      </CardContent>
    </Card>
  );
}
