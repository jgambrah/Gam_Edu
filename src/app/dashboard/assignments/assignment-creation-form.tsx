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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { collection, query, serverTimestamp, where, addDoc } from 'firebase/firestore';
import { assignmentSchema } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type AssignmentCreationFormProps = {
  setOpen: (open: boolean) => void;
};

export function AssignmentCreationForm({ setOpen }: AssignmentCreationFormProps) {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const classesQuery = useMemoFirebase(
    () => user && query(collection(firestore, 'classes'), where('teacherId', '==', user.uid)),
    [firestore, user]
  );
  const { data: classes } = useCollection(classesQuery);

  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      gradingType: 'points',
    },
  });

  async function onSubmit(values: z.infer<typeof assignmentSchema>) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'assignments'), {
        ...values,
        teacherId: user.uid,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Assignment Created',
        description: `The assignment "${values.title}" has been successfully created.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while creating the assignment.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-4 border rounded-lg">
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Algebra Worksheet" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description / Instructions</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide detailed instructions for the assignment." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
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
            <FormField
                control={form.control}
                name="gradingType"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Grading Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a grading method" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="points">Points</SelectItem>
                        <SelectItem value="letter">Letter Grade</SelectItem>
                        <SelectItem value="pass_fail">Pass/Fail</SelectItem>
                        <SelectItem value="standards">Standards-based</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Assignment
        </Button>
      </form>
    </Form>
    </div>
  );
}

    