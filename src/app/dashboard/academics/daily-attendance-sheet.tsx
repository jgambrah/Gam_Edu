
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { attendanceRecordSchema, type Student, type AttendanceRecord } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const attendanceFormSchema = z.object({
    records: z.array(attendanceRecordSchema)
});

type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

export function DailyAttendanceSheet({ classId }: { classId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [studentsLoaded, setStudentsLoaded] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const form = useForm<AttendanceFormData>({
        resolver: zodResolver(attendanceFormSchema),
        defaultValues: {
            records: [],
        },
    });

    const { fields, replace } = useFieldArray({
        control: form.control,
        name: "records",
    });

    const handleLoadStudents = async () => {
        if (!classId) return;
        setIsLoading(true);
        setStudentsLoaded(false);

        try {
            const studentQuery = query(collection(firestore, 'students'), where('classId', '==', classId));
            const studentSnapshot = await getDocs(studentQuery);
            const studentList = studentSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id, id: doc.id })) as Student[];

            if (studentList.length === 0) {
                toast({ title: 'No Students', description: 'No students found in this class.' });
                replace([]);
                setStudentsLoaded(true);
                setIsLoading(false);
                return;
            }

            const attendanceQuery = query(
                collection(firestore, 'attendance'),
                where('classId', '==', classId),
                where('date', '==', startOfDay(selectedDate))
            );
            const attendanceSnapshot = await getDocs(attendanceQuery);
            const existingRecords = attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AttendanceRecord[];

            const formRecords = studentList.map(student => {
                const existingRecord = existingRecords.find(r => r.studentId === student.uid);
                return {
                    id: existingRecord?.id,
                    studentId: student.uid,
                    studentName: `${student.firstName} ${student.lastName}`,
                    classId: classId,
                    date: startOfDay(selectedDate),
                    status: existingRecord?.status || 'Present',
                    notes: existingRecord?.notes || ''
                };
            });

            replace(formRecords);
            setStudentsLoaded(true);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load student data.' });
        } finally {
            setIsLoading(false);
        }
    };
    
    async function onSubmit(data: AttendanceFormData) {
        if (!firestore) return;
        setIsLoading(true);
        try {
            const batch = writeBatch(firestore);
            data.records.forEach(record => {
                const recordRef = record.id ? doc(firestore, 'attendance', record.id) : doc(collection(firestore, 'attendance'));
                const { studentName, id, ...dataToSave } = record;
                batch.set(recordRef, dataToSave, { merge: true });

                if (record.status === 'Absent' || record.status === 'Late') {
                    console.log(`Placeholder: Sending notification to parent of ${record.studentName} for being ${record.status}.`);
                }
            });

            await batch.commit();
            toast({ title: 'Success', description: 'Attendance has been saved successfully.' });

        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'An error occurred while saving attendance.' });
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div>
                    <Label>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !selectedDate && 'text-muted-foreground')}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} initialFocus /></PopoverContent>
                    </Popover>
                </div>
                <div className="flex items-end">
                    <Button onClick={handleLoadStudents} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Load Roster
                    </Button>
                </div>
            </div>

            {studentsLoaded && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                         <div className="space-y-4">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                        <p className="font-medium">{field.studentName}</p>
                                        <FormField
                                            control={form.control}
                                            name={`records.${index}.status`}
                                            render={({ field }) => (
                                                <FormItem><FormControl>
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-4">
                                                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Present" /></FormControl><FormLabel className="font-normal">Present</FormLabel></FormItem>
                                                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Absent" /></FormControl><FormLabel className="font-normal">Absent</FormLabel></FormItem>
                                                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Late" /></FormControl><FormLabel className="font-normal">Late</FormLabel></FormItem>
                                                        <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Excused" /></FormControl><FormLabel className="font-normal">Excused</FormLabel></FormItem>
                                                    </RadioGroup>
                                                </FormControl></FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`records.${index}.notes`}
                                            render={({ field }) => (
                                                <FormItem><FormControl><Input placeholder="Optional notes..." {...field} /></FormControl></FormItem>
                                            )}
                                        />
                                    </div>
                                </Card>
                            ))}
                        </div>
                        {fields.length > 0 && <Button type="submit" className="mt-6 w-full" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Submit Attendance</Button>}
                    </form>
                </Form>
            )}
        </div>
    );
}
