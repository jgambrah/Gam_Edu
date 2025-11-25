
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
import { useState, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, AlertCircle } from 'lucide-react';
import { generateQuiz, GenerateQuizOutput } from '@/ai/flows/generate-quiz-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { useRole } from '@/context/role-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Class } from '@/lib/types';
import { errorEmitter, FirestorePermissionError } from '@/firebase';

const generateQuizSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters long."),
  numQuestions: z.coerce.number().min(1).max(10),
  forGradeLevel: z.string().min(1, "Grade level is required."),
  additionalInstructions: z.string().optional(),
});

type GenerateQuizFormData = z.infer<typeof generateQuizSchema>;

export function AiQuizGenerator() {
  const { user, isUserLoading } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<GenerateQuizOutput | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  
  const classesQuery = useMemoFirebase(() => {
    if (!user) {
      return null;
    }
    
    if (role === 'Administrator' || role === 'Director') {
      return collection(firestore, 'classes');
    }
    
    if (role === 'Teacher') {
      return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
    }
    
    return null;
  }, [firestore, user, role]);
  
  const { data: classes, isLoading: classesLoading, error: classesError } = useCollection<Class>(classesQuery);

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

  function onAssign() {
    if (!generatedQuiz) {
      toast({ variant: 'destructive', title: 'Error', description: 'No quiz to assign. Please generate a quiz first.' });
      return;
    }
    
    if (!selectedClassId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a class to assign the quiz to.' });
      return;
    }
    
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to assign a quiz.' });
      return;
    }
    
    setIsAssigning(true);

    const quizData = {
      ...generatedQuiz,
      classId: selectedClassId,
      teacherId: user.uid,
      topic: form.getValues('topic'),
      forGradeLevel: form.getValues('forGradeLevel'),
      createdAt: serverTimestamp(),
    };
    
    const quizzesCollection = collection(firestore, 'quizzes');

    addDoc(quizzesCollection, quizData)
      .then((docRef) => {
        toast({ 
          title: 'Success!', 
          description: `Quiz "${generatedQuiz.title}" has been assigned to the class.` 
        });
        
        // Reset state
        setGeneratedQuiz(null);
        setSelectedClassId('');
        form.reset();
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
            path: quizzesCollection.path,
            operation: 'create',
            requestResourceData: quizData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsAssigning(false);
      });
  }

  if (isUserLoading) {
    return (
        <Card>
            <CardHeader><CardTitle>AI-Powered Quiz Generator</CardTitle></CardHeader>
            <CardContent><Loader2 className="mx-auto h-8 w-8 animate-spin" /></CardContent>
        </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You must be logged in to use the AI Quiz Generator. Please log in and try again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
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
                      <p className="mt-4 text-sm text-muted-foreground">
                        <span className="font-semibold">Explanation:</span> {q.explanation}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="border-t pt-4 space-y-4">
                {classesLoading && (
                  <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertDescription>Loading classes...</AlertDescription>
                  </Alert>
                )}
                
                {!classesLoading && (!classes || classes.length === 0) && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No classes found. Please create a class first or check if you're assigned to any classes.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="flex items-end gap-4">
                  <div className="flex-grow">
                    <Label htmlFor="class-select">Assign to Class</Label>
                    <Select 
                      onValueChange={(value) => {
                        setSelectedClassId(value);
                      }} 
                      value={selectedClassId}
                      disabled={classesLoading || !classes || classes.length === 0}
                    >
                      <SelectTrigger id="class-select">
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes?.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name || c.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!classesLoading && classes && classes.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {classes.length} class(es) available
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={() => onAssign()} 
                    disabled={isAssigning || !selectedClassId || classesLoading}
                  >
                    {isAssigning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save and Assign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
