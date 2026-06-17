
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
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { collection, query, serverTimestamp, where, addDoc } from 'firebase/firestore';
import { quizSchema } from '@/lib/types';
import { Loader2, Wand2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateQuiz } from '@/ai/flows/generate-quiz-flow';
import { useCurrentSchool } from '@/hooks/use-current-school';
import type { Class } from '@/lib/types';
import { errorEmitter, FirestorePermissionError } from '@/firebase';

export function QuizCreationForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classesQuery = useMemoFirebase(
    () => (user && schoolId && firestore) ? query(collection(firestore!, 'classes'), where('teacherId', '==', user.uid), where('schoolId', '==', schoolId)) : null,
    [firestore, user, schoolId]
  );
  const { data: classes } = useCollection<Class>(classesQuery);

  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      topic: '',
      numQuestions: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof quizSchema>) {
    if (!user || !schoolId || !firestore) return;
    setIsSubmitting(true);
    try {
      toast({ title: 'Generating Quiz...', description: 'Please wait while the AI creates your quiz.' });
      const quizData = await generateQuiz({ topic: values.topic, numQuestions: values.numQuestions, forGradeLevel: 'Grade 9' });
      
      const quizzesCollection = collection(firestore!, 'quizzes');
      const dataToSave = {
        ...quizData,
        classId: values.classId,
        teacherId: user.uid,
        schoolId: schoolId,
        topic: values.topic,
        createdAt: serverTimestamp(),
      };

      await addDoc(quizzesCollection, dataToSave);

      toast({
        title: 'Quiz Created!',
        description: `The quiz "${quizData.title}" has been successfully generated.`,
      });
      form.reset();
      setOpen(false);
    } catch (error: any) {
      if (error.name === 'FirebaseError' && error.code === 'permission-denied') {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: 'quizzes',
          operation: 'create',
          requestResourceData: form.getValues(),
        }));
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An AI or network error occurred while creating the quiz.',
        });
      }
      console.error('Error creating quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Quiz Topic / Theme</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., The Solar System, World War II, Photosynthesis" 
                      className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all h-11 text-xs font-medium"
                      {...field} 
                    />
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
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">No. of Questions</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={10} 
                      className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all h-11 text-xs font-medium"
                      {...field} 
                    />
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
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Assign to Class</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all h-11 text-xs font-medium">
                      <SelectValue placeholder="Select a class to assign the quiz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    {classes?.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs font-medium focus:bg-purple-50 focus:text-purple-950 rounded-lg m-1">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-650 to-purple-650 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs tracking-wide shadow-lg shadow-purple-100 transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Generating AI Assessment...</>
            ) : (
              <><Wand2 className="mr-2 h-4 w-4 text-white" /> Generate & Dispatch Quiz</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
