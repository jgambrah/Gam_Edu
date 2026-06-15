
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where } from 'firebase/firestore'; 
import { behavioralRecordSchema, Student } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useCurrentSchool } from '@/hooks/use-current-school'; 


export function BehavioralRecordForm() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { schoolId } = useCurrentSchool();
  const [open, setOpen] = useState(false);

  const studentsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    return query(collection(firestore!, 'students'), where('schoolId', '==', schoolId));
  }, [firestore, schoolId]);
  
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);

  const sortedStudents = useMemo(() => {
    if (!students) return [];
    return [...students].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [students]);

  const form = useForm<z.infer<typeof behavioralRecordSchema>>({
    resolver: zodResolver(behavioralRecordSchema),
    defaultValues: {
      incidentType: 'Teacher Note',
      actionTaken: '',
      description: '',
      recordedById: user?.uid,
    },
  });

  async function onSubmit(values: z.infer<typeof behavioralRecordSchema>) {
    if (!user || !schoolId || !firestore) {
        toast({
            variant: "destructive",
            title: "Cannot Save",
            description: "User or School information is not available. Please try refreshing the page.",
        });
        return;
    }
    
    setIsSubmitting(true);

    try {
      const student = sortedStudents.find(s => s.uid === values.studentId);
      const studentName = student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';

      await addDoc(collection(firestore!, 'behavioral_records'), {
        ...values,
        studentName: studentName,
        recordedById: user.uid,
        createdAt: new Date(),
        schoolId: schoolId,
      });
      toast({ title: 'Success', description: 'Behavioral record logged.' });
      form.reset();
    } catch (error) {
      console.error('Error logging incident:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not log incident.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  const getStudentName = (studentId: string) => {
    const student = sortedStudents.find(s => s.uid === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Select student';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Behavioral Incident</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Student</FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                disabled={isLoadingStudents}
                                className={cn(
                                    "justify-between",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {isLoadingStudents ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading students...
                                  </>
                                ) : field.value ? (
                                  getStudentName(field.value)
                                ) : (
                                  "Select student"
                                )}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search student..." />
                                <CommandList>
                                <CommandEmpty>
                                  {isLoadingStudents ? 'Loading...' : 'No student found.'}
                                </CommandEmpty>
                                <CommandGroup>
                                    {sortedStudents.map((student) => (
                                    <CommandItem
                                        value={`${student.firstName} ${student.lastName}`}
                                        key={student.uid}
                                        onSelect={() => {
                                          form.setValue("studentId", student.uid);
                                          setOpen(false);
                                        }}
                                    >
                                        {student.firstName} {student.lastName}
                                        {process.env.NODE_ENV === 'development' && (
                                          <span className="ml-2 text-xs text-muted-foreground">
                                            ({student.schoolId?.slice(0, 8)})
                                          </span>
                                        )}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                                </CommandList>
                            </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        {process.env.NODE_ENV === 'development' && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Showing {sortedStudents.length} students for school: {schoolId?.slice(0, 8)}
                          </p>
                        )}
                        </FormItem>
                    )}
                />
                 <FormField control={form.control} name="incidentType" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Incident Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Infraction">Infraction</SelectItem>
                                <SelectItem value="Positive Behavior">Positive Behavior</SelectItem>
                                <SelectItem value="Counseling Note">Counseling Note</SelectItem>
                                <SelectItem value="Disciplinary Action">Disciplinary Action</SelectItem>
                                <SelectItem value="Teacher Note">Teacher Note</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Date of Incident</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
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
                )}/>
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                    <FormLabel>Description of Event</FormLabel>
                    <FormControl><Textarea placeholder="Provide a factual description of the event..." {...field} rows={4} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="actionTaken" render={({ field }) => (
                <FormItem>
                    <FormLabel>Action Taken (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="Describe any follow-up actions..." {...field} rows={3} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <Button type="submit" disabled={isSubmitting || !user || !schoolId}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Log Incident
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
