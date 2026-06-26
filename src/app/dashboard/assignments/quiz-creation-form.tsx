
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
import { useState, useMemo } from 'react';
import { collection, query, serverTimestamp, where, addDoc } from 'firebase/firestore';
import { quizSchema } from '@/lib/types';
import { Loader2, Wand2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateQuiz } from '@/ai/flows/generate-quiz-flow';
import { useCurrentSchool } from '@/hooks/use-current-school';
import type { Class } from '@/lib/types';
import { errorEmitter, FirestorePermissionError } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function QuizCreationForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewQuiz, setPreviewQuiz] = useState<any | null>(null);
  const [formValues, setFormValues] = useState<any | null>(null);

  const classesQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore!, 'classes'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]
  );
  const { data: allSchoolClasses } = useCollection<Class>(classesQuery);

  const timetableQuery = useMemoFirebase(() => 
    (firestore && schoolId)
      ? query(collection(firestore!, 'timetables'), where('schoolId', '==', schoolId)) 
      : null, 
    [firestore, schoolId]);
  const { data: timetable } = useCollection<any>(timetableQuery);

  const classes = useMemo(() => {
    if (!allSchoolClasses) return [];
    const subjectClassIds = timetable?.filter((t: any) => t.teacherId === user?.uid).map((t: any) => t.classId) || [];
    return allSchoolClasses.filter((c: any) => c.teacherId === user?.uid || subjectClassIds.includes(c.id));
  }, [allSchoolClasses, timetable, user?.uid]);

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
      
      setPreviewQuiz(quizData);
      setFormValues(values);
      toast({
        title: 'Quiz Generated!',
        description: 'Review the questions below before dispatching.',
      });
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
          description: 'An AI or network error occurred while generating the quiz.',
        });
      }
      console.error('Error generating quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (previewQuiz) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm uppercase">{previewQuiz.title}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Topic: {formValues?.topic}</p>
            </div>
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-none uppercase text-[9px] rounded-lg px-2.5">
              {previewQuiz.questions?.length || 0} Questions
            </Badge>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            {previewQuiz.questions?.map((q: any, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-black text-purple-650 mt-0.5">{idx + 1}.</span>
                  <p className="text-xs font-bold text-slate-700 leading-normal">{q.questionText}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
                  {q.options.map((opt: string, oIdx: number) => {
                    const isCorrect = opt === q.correctAnswer;
                    return (
                      <div 
                        key={oIdx} 
                        className={cn(
                          "p-2.5 rounded-lg text-[10px] font-semibold transition-all border",
                          isCorrect 
                            ? "bg-emerald-50 border-emerald-250 text-emerald-800 font-bold" 
                            : "bg-white border-slate-150 text-slate-500"
                        )}
                      >
                        <span className="mr-1 font-bold">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                        {isCorrect && <span className="ml-1.5 text-[8px] bg-emerald-600 text-white font-extrabold uppercase px-1 py-0.5 rounded">Correct</span>}
                      </div>
                    );
                  })}
                </div>
                {q.explanation && (
                  <p className="text-[9px] text-slate-400 font-bold pl-5 leading-normal italic">
                    Explanation: {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            type="button"
            variant="outline" 
            onClick={() => {
              setPreviewQuiz(null);
              setFormValues(null);
            }}
            className="flex-1 h-11 rounded-xl border-2 border-slate-200 text-slate-500 font-bold text-xs uppercase"
            disabled={isSubmitting}
          >
            Cancel / Edit
          </Button>
          <Button 
            type="button"
            onClick={async () => {
              if (!user || !schoolId || !firestore) return;
              setIsSubmitting(true);
              try {
                const quizzesCollection = collection(firestore!, 'quizzes');
                const dataToSave = {
                  ...previewQuiz,
                  classId: formValues.classId,
                  teacherId: user.uid,
                  schoolId: schoolId,
                  topic: formValues.topic,
                  createdAt: serverTimestamp(),
                };
                await addDoc(quizzesCollection, dataToSave);
                toast({
                  title: 'Quiz Dispatched!',
                  description: `The quiz "${previewQuiz.title}" has been successfully dispatched to the students.`,
                });
                setPreviewQuiz(null);
                setFormValues(null);
                form.reset();
                setOpen(false);
              } catch (error: any) {
                console.error('Error saving quiz:', error);
                toast({
                  variant: 'destructive',
                  title: 'Error',
                  description: 'Failed to dispatch quiz. Please try again.',
                });
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs uppercase"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Dispatch to Students"}
          </Button>
        </div>
      </div>
    );
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
              <><Wand2 className="mr-2 h-4 w-4 text-white" /> Generate & Review Quiz</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
