
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { collection, query, where, writeBatch, getDocs, doc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { attendanceFormSchema, Student, AttendanceRecord, ATTENDANCE_STATUSES } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRole } from '@/context/role-context';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

type ClassData = { id: string; name: string; };

export function DailyAttendanceSheet() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { role } = useRole();
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Data Fetching ---
  const classesQuery = useMemoFirebase(() => {
    if (!user) return null;
    if (role === 'Teacher') {
      return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
    }
    // For Admin/Director, fetch all classes
    return query(collection(firestore, 'classes'));
  }, [firestore, user, role]);
  const { data: classes, isLoading: isLoadingClasses } = useCollection<ClassData>(classesQuery);

  // --- Form Setup ---
  const form = useForm<z.infer<typeof attendanceFormSchema>>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      date: new Date(),
      students: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: 'students',
  });

  const selectedClassId = form.watch('classId');
  const selectedDate = form.watch('date');

  // --- Functions ---
  const loadStudentsForClass = async () => {
    if (!selectedClassId || !selectedDate) {
      toast({ variant: 'destructive', title: 'Selection Required', description: 'Please select a class and a date.' });
      return;
    }
    setIsLoadingStudents(true);
    try {
      // Fetch students for the class
      const studentsQuery = query(collection(firestore, 'students'), where('classId', '==', selectedClassId));
      const studentsSnapshot = await getDocs(studentsQuery);
      const studentList = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Student[];
      
      if(studentList.length === 0) {
        toast({ title: 'No Students', description: 'No students found for the selected class.'});
        replace([]);
        return;
      }

      // Fetch existing attendance records for that day
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
      const attendanceQuery = query(
        collection(firestore, 'attendance'),
        where('classId', '==', selectedClassId),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay))
      );
      const attendanceSnapshot = await getDocs(attendanceQuery);
      const existingRecords = attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AttendanceRecord[];

      // Populate form array
      const formStudents = studentList.map(student => {
        const existingRecord = existingRecords.find(rec => rec.studentId === student.uid);
        return {
          studentId: student.uid,
          name: `${student.firstName} ${student.lastName}`,
          status: existingRecord?.status || 'Present',
          notes: existingRecord?.notes || '',
          recordId: existingRecord?.id, // Keep track of existing record ID
        };
      });
      replace(formStudents);

    } catch (error) {
      console.error("Error loading students:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load students.' });
    } finally {
      setIsLoadingStudents(false);
    }
  };

  async function onSubmit(values: z.infer<typeof attendanceFormSchema>) {
    if (!user) return;
    setIsSubmitting(true);
    try {
        const batch = writeBatch(firestore);
        values.students.forEach((student: any) => {
            const recordData = {
                studentId: student.studentId,
                classId: values.classId,
                date: values.date,
                status: student.status,
                notes: student.notes,
                markedBy: user.uid,
            };

            // If recordId exists, update it. Otherwise, create a new doc.
            const docRef = student.recordId 
                ? doc(firestore, 'attendance', student.recordId)
                : doc(collection(firestore, 'attendance'));
            
            batch.set(docRef, recordData, { merge: true });

            if (student.status === 'Absent' || student.status === 'Late') {
              console.log(`PARENT NOTIFICATION: Student ${student.name} was ${student.status}.`);
              // In a real app, this would trigger a Cloud Function for email/SMS.
            }
        });
        await batch.commit();
        toast({ title: 'Success', description: 'Attendance has been saved successfully.' });
    } catch (error) {
        console.error("Error saving attendance:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save attendance records.' });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <FormField control={form.control} name="classId" render={({ field }) => (
                <FormItem><FormLabel>Class</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingClasses}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger></FormControl>
                    <SelectContent>{classes?.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                </Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                <Button variant={'outline'} className={cn('pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>
                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover><FormMessage /></FormItem>
            )}/>
            <Button type="button" onClick={loadStudentsForClass} disabled={!selectedClassId || !selectedDate || isLoadingStudents}>
              {isLoadingStudents ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Users className="mr-2 h-4 w-4"/>}
              Load Students
            </Button>
        </div>
        
        {fields.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Attendance Sheet</CardTitle><CardDescription>Mark the status for each student.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-3 border rounded-md">
                  <span className="font-medium">{(field as any).name}</span>
                  <FormField control={form.control} name={`students.${index}.status`} render={({ field }) => (
                    <FormItem><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                      {ATTENDANCE_STATUSES.map(status => (
                        <FormItem key={status} className="flex items-center space-x-2 space-y-0">
                          <FormControl><RadioGroupItem value={status} /></FormControl>
                          <FormLabel className="font-normal">{status}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup></FormControl></FormItem>
                  )}/>
                   <FormField control={form.control} name={`students.${index}.notes`} render={({ field }) => (
                    <FormItem><FormControl><Input placeholder="Optional notes..." {...field} /></FormControl></FormItem>
                  )}/>
                </div>
              ))}
               <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Attendance
                </Button>
            </CardContent>
          </Card>
        )}
      </form>
    </Form>
  );
}

    