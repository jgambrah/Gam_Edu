'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { dailyAttendanceFormSchema, AttendanceRecord } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type Student = { uid: string; firstName: string; lastName: string; };

async function getStudentsByClass(classId: string, firestore: any): Promise<Student[]> {
    const studentsQuery = query(collection(firestore, 'students'), where('classId', '==', classId));
    const snapshot = await getDocs(studentsQuery);
    return snapshot.docs.map(doc => ({ uid: doc.data().uid, firstName: doc.data().firstName, lastName: doc.data().lastName }));
}

async function getAttendanceForClassOnDate(classId: string, date: Date, firestore: any): Promise<AttendanceRecord[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const attendanceQuery = query(
        collection(firestore, 'attendance'),
        where('classId', '==', classId),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay)
    );
    const snapshot = await getDocs(attendanceQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
}

export function DailyAttendanceSheet() {
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  
  const classesQuery = useMemoFirebase(() => collection(firestore, 'classes'), [firestore]);
  const { data: classes } = useCollection(classesQuery);
  
  const form = useForm<z.infer<typeof dailyAttendanceFormSchema>>({
    resolver: zodResolver(dailyAttendanceFormSchema),
    defaultValues: {
      date: new Date(),
      records: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: 'records',
  });

  const handleLoadStudents = async () => {
    const { classId, date } = form.getValues();
    if (!classId || !date) {
        toast({ variant: 'destructive', title: 'Selection Required', description: 'Please select a class and a date.' });
        return;
    }
    setIsLoadingStudents(true);
    setStudentsLoaded(false);
    
    try {
        const studentList = await getStudentsByClass(classId, firestore);
        const existingRecords = await getAttendanceForClassOnDate(classId, date, firestore);
        
        const attendanceData = studentList.map(student => {
            const existingRecord = existingRecords.find(rec => rec.studentId === student.uid);
            return {
                studentId: student.uid,
                studentName: `${student.firstName} ${student.lastName}`,
                status: existingRecord?.status || 'Present',
                notes: existingRecord?.notes || ''
            };
        });
        
        replace(attendanceData);
        setStudentsLoaded(true);

    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load students.'});
    } finally {
        setIsLoadingStudents(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof dailyAttendanceFormSchema>) => {
    setIsSubmitting(true);
    const { classId, date, records } = values;

    try {
        const batch = writeBatch(firestore);
        const existingRecords = await getAttendanceForClassOnDate(classId, date, firestore);

        records.forEach(record => {
            const existing = existingRecords.find(er => er.studentId === record.studentId);
            const recordData = {
                studentId: record.studentId,
                classId,
                date,
                status: record.status,
                notes: record.notes,
                markedBy: role,
            };

            if (existing?.id) {
                // Update existing record
                const docRef = doc(firestore, 'attendance', existing.id);
                batch.update(docRef, recordData);
            } else {
                // Create new record
                const docRef = doc(collection(firestore, 'attendance'));
                batch.set(docRef, recordData);
            }

            if (record.status === 'Absent' || record.status === 'Late') {
                console.log(`NOTIFICATION: Parent of ${record.studentName} to be notified of ${record.status} status.`);
            }
        });
        
        await batch.commit();
        toast({ title: 'Success!', description: 'Attendance has been saved.'});

    } catch(e) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to save attendance records.'});
    } finally {
        setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6 grid md:grid-cols-3 gap-4 items-end">
            <FormField control={form.control} name="classId" render={({ field }) => (
                <FormItem><FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger></FormControl>
                        <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                </FormItem>
            )}/>
             <FormField control={form.control} name="date" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Date</FormLabel>
                <Popover><PopoverTrigger asChild><FormControl>
                    <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent></Popover></FormItem>
             )}/>
             <Button type="button" onClick={handleLoadStudents} disabled={isLoadingStudents}>
                {isLoadingStudents ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                Load Students
             </Button>
          </CardContent>
        </Card>
        
        {studentsLoaded && (
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <Card key={field.id}>
                        <CardContent className="pt-6 grid md:grid-cols-3 gap-6 items-center">
                            <p className="font-medium">{field.studentName}</p>
                            <FormField control={form.control} name={`records.${index}.status`} render={({ field }) => (
                                <FormItem><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Present" /></FormControl><FormLabel className="font-normal">Present</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Absent" /></FormControl><FormLabel className="font-normal">Absent</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Late" /></FormControl><FormLabel className="font-normal">Late</FormLabel></FormItem>
                                    <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Excused" /></FormControl><FormLabel className="font-normal">Excused</FormLabel></FormItem>
                                </RadioGroup></FormControl></FormItem>
                            )}/>
                            <FormField control={form.control} name={`records.${index}.notes`} render={({ field }) => (
                                <FormItem><FormControl><Input placeholder="Optional notes..." {...field} /></FormControl></FormItem>
                            )}/>
                        </CardContent>
                    </Card>
                ))}
                <Button type="submit" disabled={isSubmitting} className="w-full">
                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Submit Attendance
                </Button>
            </div>
        )}
      </form>
    </Form>
  );
}
