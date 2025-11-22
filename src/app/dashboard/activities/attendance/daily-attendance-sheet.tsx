
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle }from '@/components/ui/card';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { attendanceRecordSchema, type Student, type AttendanceRecord, type Class } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useRole } from '@/context/role-context';
import { Label } from '@/components/ui/label';

const attendanceFormSchema = z.object({
    records: z.array(attendanceRecordSchema)
});

type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

export function DailyAttendanceSheet() {
    const { user } = useAuth();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [studentsLoaded, setStudentsLoaded] = useState(false);
    
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

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
        if (!selectedClassId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a class first.' });
            return;
        }
        setIsLoading(true);
        setStudentsLoaded(false);

        try {
            // 1. Fetch students for the class
            const studentQuery = query(collection(firestore, 'students'), where('classId', '==', selectedClassId));
            const studentSnapshot = await getDocs(studentQuery);
            const studentList = studentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Student[];

            if (studentList.length === 0) {
                toast({ title: 'No Students', description: 'No students found in the selected class.' });
                replace([]);
                setStudentsLoaded(true);
                setIsLoading(false);
                return;
            }

            // 2. Fetch existing attendance for that date
            const attendanceQuery = query(
                collection(firestore, 'student_attendance_logs'),
                where('classId', '==', selectedClassId),
                where('date', '==', startOfDay(selectedDate))
            );
            const attendanceSnapshot = await getDocs(attendanceQuery);
            const existingRecords = attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AttendanceRecord[];

            // 3. Populate form
            const formRecords = studentList.map(student => {
                const existingRecord = existingRecords.find(r => r.studentId === student.uid);
                return {
                    logId: existingRecord?.logId,
                    studentId: student.uid,
                    studentName: `${student.firstName} ${student.lastName}`,
                    classId: selectedClassId,
                    date: startOfDay(selectedDate),
                    status: existingRecord?.status || 'Present',
                    recordedByUserId: user?.uid || '',
                    notificationSent: existingRecord?.notificationSent || false,
                };
            });

            replace(formRecords);
            setStudentsLoaded(true);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load students.' });
        } finally {
            setIsLoading(false);
        }
    };
    
    async function onSubmit(data: AttendanceFormData) {
        if (!user) return;
        setIsLoading(true);
        try {
            const batch = writeBatch(firestore);
            data.records.forEach(record => {
                const recordRef = record.logId ? doc(firestore, 'student_attendance_logs', record.logId) : doc(collection(firestore, 'student_attendance_logs'));
                // Prep data, remove client-side stuff
                const { studentName, ...dataToSave } = record;
                batch.set(recordRef, { ...dataToSave, recordedByUserId: user.uid }, { merge: true });

                if ((record.status === 'Absent-Unexcused' || record.status === 'Tardy') && !record.notificationSent) {
                    console.log(`Placeholder: Triggering notification for ${studentName}`);
                    // In a real scenario, this logic would be in a Cloud Function triggered by this write.
                }
            });

            await batch.commit();
            toast({ title: 'Success', description: 'Attendance has been saved.' });

        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save attendance.' });
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Take Attendance</CardTitle>
                <CardDescription>Select a class and date, then mark any exceptions.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <Label>Class</Label>
                        <Select onValueChange={setSelectedClassId} value={selectedClassId} disabled={isLoadingClasses}>
                            <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                            <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1">
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
                        <Button onClick={handleLoadStudents} disabled={isLoading || !selectedClassId}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Load Students
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
                                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 flex-wrap">
                                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Present" /></FormControl><FormLabel className="font-normal">Present</FormLabel></FormItem>
                                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Absent-Unexcused" /></FormControl><FormLabel className="font-normal">Absent</FormLabel></FormItem>
                                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Tardy" /></FormControl><FormLabel className="font-normal">Tardy</FormLabel></FormItem>
                                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="Dismissed-Early" /></FormControl><FormLabel className="font-normal">Dismissed Early</FormLabel></FormItem>
                                                        </RadioGroup>
                                                    </FormControl></FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`records.${index}.reason`}
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
            </CardContent>
        </Card>
    );
}

    