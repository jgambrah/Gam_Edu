
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
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { collection, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { lessonPlanSchema } from '@/lib/types';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useRole } from '@/context/role-context';

type LessonPlanFormProps = {
  setOpen: (open: boolean) => void;
};

type ClassData = { id: string; name: string };

export function LessonPlanForm({ setOpen }: LessonPlanFormProps) {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { role } = useRole();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof lessonPlanSchema>>({
    resolver: zodResolver(lessonPlanSchema),
    defaultValues: {
      topic: '',
      objectives: '',
      activities: '',
      materials: '',
      notes: '',
    },
  });

  const classesQuery = useMemoFirebase(() => {
    if (!user) return null;
    if (role === 'Teacher') {
      return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
    }
    if (role === 'Administrator' || role === 'Director') {
      return collection(firestore, 'classes');
    }
    return null;
  }, [firestore, user, role]);

  const { data: classes } = useCollection<ClassData>(classesQuery);

  async function onSubmit(values: z.infer<typeof lessonPlanSchema>) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'lesson-plans'), {
        ...values,
        teacherId: user.uid,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Lesson Plan Saved',
        description: `Your plan for "${values.topic}" has been saved.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error creating lesson plan:', error);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="classId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
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
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Lesson Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
              <FormLabel>Lesson Topic</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Introduction to Photosynthesis" {...field} />
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
              <FormLabel>Learning Objectives</FormLabel>
              <FormControl>
                <Textarea placeholder="What will students be able to do by the end of the lesson?" {...field} />
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
              <FormLabel>Activities & Tasks</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the planned activities, discussions, and assignments." {...field} />
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
              <FormLabel>Materials & Resources</FormLabel>
              <FormControl>
                <Textarea placeholder="List all textbooks, worksheets, videos, links, etc." {...field} />
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
              <FormLabel>Private Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Notes on differentiation, reminders, or reflections for yourself." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Lesson Plan
        </Button>
      </form>
    </Form>
  );
}

