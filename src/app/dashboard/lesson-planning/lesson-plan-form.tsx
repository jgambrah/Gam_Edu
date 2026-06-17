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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { lessonPlanSchema, LessonPlan } from '@/lib/types';
import { CalendarIcon, Loader2, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { generateLessonIdeasAction } from '@/app/actions/generate-lesson-ideas';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { checkAndSpendCredits } from '@/app/actions/credits';

type ClassData = { id: string; name: string };

type LessonPlanFormProps = {
  setOpen: (open: boolean) => void;
  classes: ClassData[];
  planId?: string;
  initialData?: LessonPlan;
};

export function LessonPlanForm({ setOpen, classes, planId, initialData }: LessonPlanFormProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper to safely parse Firestore Timestamp or date formats
  const toDateSafe = (d: any): Date | undefined => {
    if (!d) return undefined;
    if (typeof d.toDate === 'function') return d.toDate();
    if (d instanceof Date) return d;
    if (d.seconds) return new Date(d.seconds * 1000);
    return new Date(d);
  };

  const form = useForm<z.infer<typeof lessonPlanSchema>>({
    resolver: zodResolver(lessonPlanSchema),
    defaultValues: {
      classId: initialData?.classId || '',
      date: initialData?.date ? (toDateSafe(initialData.date) || new Date()) : undefined,
      topic: initialData?.topic || '',
      objectives: initialData?.objectives || '',
      activities: initialData?.activities || '',
      materials: initialData?.materials || '',
      notes: initialData?.notes || '',
    },
  });

  const topicValue = form.watch('topic');

  const handleAskAI = async () => {
    if (!topicValue) {
      toast({ variant: 'destructive', title: 'Topic Required', description: 'Please enter a topic before using the AI assistant.' });
      return;
    }
    if (!schoolId) {
      toast({ variant: 'destructive', title: 'Error', description: 'School ID not found.' });
      return;
    }

    // --- CREDIT CHECK ---
    const creditResult = await checkAndSpendCredits(schoolId, 3); // Cost: 3 credits
    if (!creditResult.success) {
      toast({ variant: 'destructive', title: 'Insufficient AI Credits', description: creditResult.error || 'Please upgrade your plan.' });
      return;
    }
    // --- END CREDIT CHECK ---

    setIsGenerating(true);
    toast({ title: 'AI is thinking...', description: 'Generating lesson ideas for your topic.' });
    try {
      const result = await generateLessonIdeasAction(topicValue);
      if (result.success && result.data) {
        form.setValue('objectives', result.data.objectives, { shouldValidate: true });
        form.setValue('activities', result.data.activities, { shouldValidate: true });
        form.setValue('materials', result.data.materials, { shouldValidate: true });
        toast({ title: 'Success!', description: 'AI has populated the lesson plan fields.' });
      } else {
        throw new Error(result.error || 'Unknown AI error');
      }
    } catch (error: any) {
      console.error("AI Error:", error);
      toast({ variant: 'destructive', title: 'AI Error', description: error.message || 'Could not generate lesson ideas.' });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(values: z.infer<typeof lessonPlanSchema>) {
    if (!user || !schoolId || !firestore) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (planId) {
        // Edit Mode
        const docRef = doc(firestore, 'lesson-plans', planId);
        await updateDoc(docRef, {
          ...values,
          date: values.date,
          updatedAt: new Date(),
        });
        toast({
          title: 'Lesson Plan Updated',
          description: `Your plan for "${values.topic}" has been updated.`,
        });
      } else {
        // Create Mode
        await addDoc(collection(firestore, 'lesson-plans'), {
          ...values,
          teacherId: user.uid,
          schoolId: schoolId,
          createdAt: new Date(),
          date: values.date,
        });
        toast({
          title: 'Lesson Plan Saved',
          description: `Your plan for "${values.topic}" has been saved.`,
        });
      }
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error saving lesson plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while saving the lesson plan.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ScrollArea className="h-[450px] w-full pr-4">
          <div className="space-y-5 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-semibold dark:text-slate-300">Class</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-lg transition-all">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classes?.map((c) => (
                          <SelectItem key={c.id} value={c.id} className="cursor-pointer">
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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-slate-700 font-semibold dark:text-slate-300">Lesson Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'pl-3 text-left font-normal border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-lg transition-all',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-slate-500" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center mb-1">
                    <FormLabel className="text-slate-700 font-semibold dark:text-slate-300">Lesson Topic</FormLabel>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAskAI} 
                      disabled={isGenerating || !topicValue}
                      className="bg-violet-50 hover:bg-violet-100 border-violet-200 text-violet-700 dark:bg-violet-950/30 dark:border-violet-800/50 dark:text-violet-400 font-semibold text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all shadow-sm active:scale-95"
                    >
                      {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-600"/> : <Wand2 className="h-3.5 w-3.5 text-violet-600" />}
                      Ask AI (-3 Credits)
                    </Button>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Introduction to Photosynthesis" 
                      {...field} 
                      className="border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-lg transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold dark:text-slate-300">Learning Objectives</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What will students be able to do by the end of the lesson? (Start with action verbs)" 
                      {...field} 
                      className="min-h-24 border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-lg transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold dark:text-slate-300">Activities & Tasks</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the planned activities, discussions, and assignments." 
                      {...field} 
                      className="min-h-24 border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-lg transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="materials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold dark:text-slate-300">Materials & Resources</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List all textbooks, worksheets, videos, links, etc." 
                      {...field} 
                      className="min-h-24 border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-lg transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold dark:text-slate-300">Private Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Notes on differentiation, reminders, or reflections for yourself." 
                      {...field} 
                      className="min-h-20 border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-lg transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            planId ? "Update Lesson Plan" : "Save Lesson Plan"
          )}
        </Button>
      </form>
    </Form>
  );
}
