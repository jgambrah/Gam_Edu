
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
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { collection, query, serverTimestamp, where, addDoc } from 'firebase/firestore';
import { assignmentSchema } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useRole } from '@/context/role-context';

type AssignmentCreationFormProps = {
  setOpen: (open: boolean) => void;
};

export function AssignmentCreationForm({ setOpen }: AssignmentCreationFormProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { role } = useRole();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { schoolId } = useCurrentSchool();

  // 1. Fetch ALL classes for the school, regardless of role.
  const classesQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore!, 'classes'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]
  );
  const { data: allSchoolClasses } = useCollection<any>(classesQuery);

  const timetableQuery = useMemoFirebase(() => 
    (firestore && schoolId && role === 'Teacher')
      ? query(collection(firestore!, 'timetables'), where('schoolId', '==', schoolId)) 
      : null, 
  [firestore, schoolId, role]);
  const { data: timetable } = useCollection<any>(timetableQuery);

  // 2. Filter the classes on the client-side based on the role.
  const classes = useMemo(() => {
    if (!allSchoolClasses) return [];
    if (role === 'Teacher') {
      const subjectClassIds = timetable?.filter((t: any) => t.teacherId === user?.uid).map((t: any) => t.classId) || [];
      return allSchoolClasses.filter((c: any) => c.teacherId === user?.uid || subjectClassIds.includes(c.id));
    }
    // Admins/Directors see all classes
    return allSchoolClasses;
  }, [allSchoolClasses, timetable, role, user?.uid]);


  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
      gradingType: 'points',
    },
  });

  async function onSubmit(values: z.infer<typeof assignmentSchema>) {
    if (!user || !schoolId || !firestore) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore!, 'assignments'), {
        ...values,
        teacherId: user.uid,
        schoolId: schoolId, // SAAS: Stamp with schoolId
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
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="classId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Class</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-11 text-xs font-medium">
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      {classes?.map((c: any) => (
                        <SelectItem key={c.id} value={c.id} className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">
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
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Assignment Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Algebra Worksheet, Term Essay" 
                      className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-11 text-xs font-medium"
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Description / Instructions</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide detailed instructions, references, or submission expectations for the students." 
                    className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all min-h-[120px] text-xs font-medium"
                    {...field} 
                  />
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
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-medium rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-11 text-xs w-full',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a due date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border border-slate-100" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="rounded-2xl" />
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
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">Grading Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl border-slate-200 bg-white hover:bg-slate-50/50 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all h-11 text-xs font-medium">
                        <SelectValue placeholder="Select a grading method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                      <SelectItem value="points" className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">Points (e.g., 100)</SelectItem>
                      <SelectItem value="letter" className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">Letter Grade (A, B, C...)</SelectItem>
                      <SelectItem value="pass_fail" className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">Pass / Fail</SelectItem>
                      <SelectItem value="standards" className="text-xs font-medium focus:bg-indigo-50 focus:text-indigo-950 rounded-lg m-1">Standards-based</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs tracking-wide shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> Dispatching Assignment...</>
            ) : (
              'Create & Dispatch Assignment'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
    