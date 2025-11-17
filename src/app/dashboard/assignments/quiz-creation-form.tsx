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
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { collection, query, serverTimestamp, where, addDoc } from 'firebase/firestore';
import { quizSchema } from '@/lib/types';
import { Loader2, Wand2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateQuiz } from '@/ai/flows/generate-quiz-flow';

type QuizCreationFormProps = {
  setOpen: (open: boolean) => void;
};

export function QuizCreationForm({ setOpen }: QuizCreationFormProps) {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classesQuery = useMemoFirebase(
    () => user && query(collection(firestore, 'classes'), where('teacherId', '==', user.uid)),
    [firestore, user]
  );
  const { data: classes } = useCollection(classesQuery);

  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      topic: '',
      numQuestions: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof quizSchema>) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      toast({ title: 'Generating Quiz...', description: 'Please wait while the AI creates your quiz.' });
      const quizData = await generateQuiz({ topic: values.topic, numQuestions: values.numQuestions });

      await addDoc(collection(firestore, 'quizzes'), {
        ...quizData,
        classId: values.classId,
        teacherId: user.uid,
        topic: values.topic,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Quiz Created!',
        description: `The quiz "${quizData.title}" has been successfully generated.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An AI error occurred while creating the quiz.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-4 border rounded-lg mt-4 bg-accent/20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-accent-foreground" />
            <h3 className="text-lg font-semibold">Create AI-Powered Quiz</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Quiz Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The Solar System, World War II" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numQuestions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel># of Questions</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="classId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class to assign the quiz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Generate & Create Quiz
          </Button>
        </form>
      </Form>
    </div>
  );
}

    