
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo, useEffect } from 'react';
import { collection, query, serverTimestamp, where, addDoc } from 'firebase/firestore';
import { BlockMath, InlineMath } from 'react-katex';

function MathText({ text }: { text: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span>{text}</span>;
  }

  if (!text) return null;

  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const formula = part.slice(2, -2).trim();
          return (
            <div key={index} className="my-2 overflow-x-auto text-center py-2 px-3 bg-slate-50 border border-slate-100 rounded-xl">
              <BlockMath math={formula} />
            </div>
          );
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1).trim();
          return (
            <span key={index} className="inline-block px-1">
              <InlineMath math={formula} />
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
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

  const subjectsQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore!, 'subjects'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]
  );
  const { data: subjects } = useCollection<any>(subjectsQuery);

  const form = useForm<z.infer<typeof quizSchema>>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      topic: '',
      numQuestions: 5,
      classId: '',
      questionType: 'mcq',
      dueDate: '',
      context: '',
      gradeLevel: '',
      timeLimit: 0,
      startDate: '',
      gradable: false,
      subjectId: '',
      assessmentType: 'Class Exercise (CA)',
    },
  });

  async function onSubmit(values: z.infer<typeof quizSchema>) {
    if (!user || !schoolId || !firestore) return;
    setIsSubmitting(true);
    try {
      toast({ title: 'Generating Quiz...', description: 'Please wait while the AI creates your quiz.' });
      const quizData = await generateQuiz({
        topic: values.topic,
        numQuestions: values.numQuestions,
        questionType: values.questionType,
        additionalInstructions: values.context,
        forGradeLevel: values.gradeLevel,
        schoolId: schoolId,
      });
      
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
          title: 'Generation Failed',
          description: error.message || 'An AI or network error occurred while generating the quiz.',
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
                  <p className="text-xs font-bold text-slate-700 leading-normal"><MathText text={q.questionText} /></p>
                </div>
                {q.type === 'written' ? (
                  <div className="pl-5 space-y-2">
                    <div className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-[10px] text-slate-400 font-bold uppercase tracking-wider italic">
                      [ Student writes text response here ]
                    </div>
                    <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/20 text-emerald-850 text-[10px] font-semibold">
                      <span className="font-extrabold uppercase text-[8px] text-emerald-600 block mb-0.5 tracking-wider">Reference Sample Correct Answer:</span>
                      <MathText text={q.correctAnswer} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5">
                    {q.options?.map((opt: string, oIdx: number) => {
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
                          <span className="mr-1 font-bold">{String.fromCharCode(65 + oIdx)}.</span> <MathText text={opt} />
                          {isCorrect && <span className="ml-1.5 text-[8px] bg-emerald-600 text-white font-extrabold uppercase px-1 py-0.5 rounded">Correct</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
                {q.explanation && (
                  <p className="text-[9px] text-slate-400 font-bold pl-5 leading-normal italic">
                    Explanation: <MathText text={q.explanation} />
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
                  dueDate: formValues.dueDate,
                  context: formValues.context || '',
                  forGradeLevel: formValues.gradeLevel,
                  timeLimit: formValues.timeLimit ? Number(formValues.timeLimit) : 0,
                  startDate: formValues.startDate || '',
                  gradable: formValues.gradable || false,
                  subjectId: formValues.subjectId || '',
                  assessmentType: formValues.assessmentType || 'Class Exercise (CA)',
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
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs uppercase"
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
                <Select 
                  onValueChange={(val) => {
                    field.onChange(val);
                    const selectedClass = classes.find(c => c.id === val);
                    if (selectedClass) {
                      form.setValue('gradeLevel', selectedClass.name);
                    }
                  }} 
                  defaultValue={field.value}
                >
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

          <FormField
            control={form.control}
            name="gradeLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Grade / Class Study Level</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., BS 3, Grade 4, Nursery 2" 
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
            name="questionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Question Format</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || 'mcq'}>
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all h-11 text-xs font-medium">
                      <SelectValue placeholder="Select question format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    <SelectItem value="mcq" className="text-xs font-medium focus:bg-purple-50 focus:text-purple-950 rounded-lg m-1">
                      Multiple Choice Questions (MCQ)
                    </SelectItem>
                    <SelectItem value="written" className="text-xs font-medium focus:bg-purple-50 focus:text-purple-950 rounded-lg m-1">
                      Written / Short Answer Questions
                    </SelectItem>
                    <SelectItem value="mixed" className="text-xs font-medium focus:bg-purple-50 focus:text-purple-950 rounded-lg m-1">
                      Mixed Format (MCQ & Short Answer)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Submission Due Date</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
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
            name="timeLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Quiz Time Limit (Minutes - Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 15, 30 (Leave blank or set to 0 for no time limit)" 
                    className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all h-11 text-xs font-medium"
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-[10px] text-slate-400">
                  Students will see a countdown timer once they open the quiz. When time expires, their answers are frozen and auto-submitted.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Scheduled Start Date & Time (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="datetime-local" 
                    className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all h-11 text-xs font-medium"
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-[10px] text-slate-400">
                  If set, students will not be able to view, open, or begin answering this quiz until the scheduled date and time.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gradable"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Gradable Quiz (Save to Gradebook)</FormLabel>
                <Select
                  onValueChange={(val) => {
                    const isGradable = val === 'true';
                    field.onChange(isGradable);
                  }}
                  value={field.value ? 'true' : 'false'}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all h-11 text-xs font-medium">
                      <SelectValue placeholder="No - Do not record in Gradebook" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                    <SelectItem value="false" className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">No — Keep separate from Gradebook records</SelectItem>
                    <SelectItem value="true" className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">Yes — Automatically record scores in Gradebook</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-[10px] text-slate-400">
                  Toggling this allows student marks to be pushed to the academic gradebook registry when submitted.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('gradable') === true && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-50/20 border border-purple-100/50 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-purple-750">Select Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all h-11 text-xs font-medium">
                          <SelectValue placeholder="Select target subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                        {subjects?.map((sub: any) => (
                          <SelectItem key={sub.id} value={sub.id} className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assessmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-purple-750">Gradebook Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || 'Class Exercise (CA)'}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all h-11 text-xs font-medium">
                          <SelectValue placeholder="Select Gradebook category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                        {['Class Exercise (CA)', 'Homework (CA)', 'Project (CA)', 'Mid-Term (CA)', 'End of Term Exam (Exam)'].map(cat => (
                          <SelectItem key={cat} value={cat} className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <FormField
            control={form.control}
            name="context"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Teacher's Custom Context / Topic Blueprint (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide specific details of what the class has covered, curriculum codes, target areas, or exact subtopics to focus on..." 
                    className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500 transition-all min-h-[90px] text-xs font-medium placeholder:text-slate-400/80"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs tracking-wide shadow-lg shadow-purple-100 transition-all active:scale-[0.98]"
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
