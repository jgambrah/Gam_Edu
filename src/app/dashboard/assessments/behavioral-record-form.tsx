
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
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where } from 'firebase/firestore'; 
import { behavioralRecordSchema, Student } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useCurrentSchool } from '@/hooks/use-current-school'; 


export function BehavioralRecordForm() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { schoolId } = useCurrentSchool();

  const studentsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    return query(collection(firestore, 'students'), where('schoolId', '==', schoolId));
  }, [firestore, schoolId]);
  
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);

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
    if (!user || !schoolId) {
        toast({
            variant: "destructive",
            title: "Cannot Save",
            description: "User or School information is not available. Please try refreshing the page.",
        });
        return;
    }
    
    setIsSubmitting(true);

    try {
      await addDoc(collection(firestore, 'behavioral_records'), {
        ...values,
        recordedById: user.uid,
        createdAt: serverTimestamp(),
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
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "justify-between",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value
                                    ? students?.find(
                                        (student) => student.uid === field.value
                                    )?.firstName + ' ' + students?.find(
                                        (student) => student.uid === field.value
                                    )?.lastName
                                    : "Select student"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder="Search student..." />
                                <CommandList>
                                <CommandEmpty>No student found.</CommandEmpty>
                                <CommandGroup>
                                    {students?.map((student) => (
                                    <CommandItem
                                        value={`${student.firstName} ${student.lastName}`}
                                        key={student.uid}
                                        onSelect={() => {
                                        form.setValue("studentId", student.uid)
                                        }}
                                    >
                                        {student.firstName} {student.lastName}
                                    </CommandItem>
                                    ))}
                                </CommandGroup>
                                </CommandList>
                            </Command>
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Log Incident
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
