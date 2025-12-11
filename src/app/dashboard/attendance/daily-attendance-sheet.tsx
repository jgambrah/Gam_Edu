

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form, FormControl, FormField, FormItem, FormLabel,
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle }from '@/components/ui/card';
import { CalendarIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfDay, getYear, getMonth } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useCallback } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { type Student, type AttendanceRecord, type Class } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useRole } from '@/context/role-context';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- 1. LOCAL SCHEMA DEFINITION (FIXES DATA STRIPPING) ---
// We define this here to ensure 'usesBusService' and 'studentName' are captured
const extendedAttendanceRecordSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  studentName: z.string(), // Explicitly include this
  status: z.enum(['Present', 'Absent', 'Late', 'Excused']),
  notes: z.string().optional(),
  classId: z.string(),
  usesBusService: z.boolean().optional(), // Now a boolean
});

const attendanceFormSchema = z.object({
    records: z.array(extendedAttendanceRecordSchema)
});

type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

type DailyAttendanceSheetProps = {
    classId?: string; 
};

export function DailyAttendanceSheet({ classId: propClassId }: DailyAttendanceSheetProps) {
    const { user } = useAuth();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [studentsLoaded, setStudentsLoaded] = useState(false);
    
    const [selectedClassId, setSelectedClassId] = useState<string>(propClassId || '');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const classesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
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
        defaultValues: { records: [] },
    });

    const { fields, replace } = useFieldArray({
        control: form.control,
        name: "records",
    });

    // --- LOAD STUDENTS ---
    const handleLoadStudents = useCallback(async () => {
        if (!selectedClassId) {
            if (!propClassId) toast({ variant: 'destructive', title: 'Error', description: 'Please select a class first.' });
            return;
        }
        if (!firestore) return;
        setIsLoading(true);
        setStudentsLoaded(false);

        try {
            // 1. Get Students
            const studentQuery = query(collection(firestore, 'students'), where('classId', '==', selectedClassId));
            const studentSnapshot = await getDocs(studentQuery);
            const studentList = studentSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id, id: doc.id })) as Student[];

            if (studentList.length === 0) {
                toast({ title: 'No Students', description: 'No students found in this class.' });
                replace([]);
                setStudentsLoaded(true);
                setIsLoading(false);
                return;
            }

            // 2. Get Existing Attendance
            const attendanceQuery = query(
                collection(firestore, 'attendance'),
                where('classId', '==', selectedClassId),
                where('date', '==', startOfDay(selectedDate))
            );
            const attendanceSnapshot = await getDocs(attendanceQuery);
            const existingRecords = attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AttendanceRecord[];

            // 3. Map to Form Fields
            const formRecords = studentList.map(student => {
                const existingRecord = existingRecords.find(r => r.studentId === student.uid);
                
                return {
                    id: existingRecord?.id,
                    studentId: student.uid,
                    studentName: `${student.firstName} ${student.lastName}`,
                    classId: selectedClassId,
                    status: (existingRecord?.status || 'Present') as "Present" | "Absent" | "Late" | "Excused",
                    notes: existingRecord?.notes || '',
                    usesBusService: !!student.usesBusService,
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
    }, [selectedClassId, selectedDate, firestore, toast, replace, propClassId]);

    useEffect(() => {
        if (selectedClassId) handleLoadStudents();
    }, [selectedClassId, selectedDate, handleLoadStudents]);
    
    // --- SUBMIT & BILLING LOGIC (REVISED) ---
    async function onSubmit(data: AttendanceFormData) {
        if (!firestore) return;
        setIsLoading(true);
        
        const attendanceBatch = writeBatch(firestore);
        
        // 1. Save Attendance to Firestore
        data.records.forEach(record => {
            const recordRef = record.id ? doc(firestore, 'attendance', record.id) : doc(collection(firestore, 'attendance'));
            // Omit studentName from the stored document, it's for display
            const { studentName, ...dataToSave } = record; 
            
            attendanceBatch.set(recordRef, {
                ...dataToSave,
                date: startOfDay(selectedDate)
            }, { merge: true });
        });

        try {
            // Commit attendance first to ensure it's saved regardless of billing outcome
            await attendanceBatch.commit();
            toast({ title: 'Attendance Saved', description: 'Now processing associated bills...' });

            // 2. FETCH BILLING RATES
            let canteenRate = 0;
            let transportRate = 0;

            try {
                const canteenSnap = await getDoc(doc(firestore, 'schoolSettings', 'canteen'));
                if (canteenSnap.exists()) canteenRate = Number(canteenSnap.data().dailyRate) || 0;

                const transportSnap = await getDoc(doc(firestore, 'schoolSettings', 'transport'));
                if (transportSnap.exists()) transportRate = Number(transportSnap.data().dailyRate) || 0;
            } catch (e) {
                console.warn("Could not fetch billing rates:", e);
            }

            // 3. APPLY BILLS
            const presentStudents = data.records.filter(r => r.status === 'Present' || r.status === 'Late');
            if (presentStudents.length > 0 && (canteenRate > 0 || transportRate > 0)) {
                
                const billingBatch = writeBatch(firestore);
                let billsCount = 0;
                const dateStr = format(selectedDate, 'yyyy-MM-dd');

                for (const record of presentStudents) {
                    // Canteen Bill
                    if (canteenRate > 0) {
                        const canteenRecordId = `canteen-${record.studentId}-${dateStr}`;
                        const financialRecordRef = doc(firestore, 'financialRecords', canteenRecordId);
                        billingBatch.set(financialRecordRef, {
                            billedAmount: canteenRate,
                            studentId: record.studentId,
                            studentName: record.studentName,
                            classId: record.classId,
                            type: 'Canteen Fee',
                            description: `Lunch for ${format(selectedDate, 'PPP')}`,
                            status: 'Unpaid',
                            dueDate: selectedDate,
                            createdAt: serverTimestamp(),
                            amountPaid: 0,
                        }, { merge: true });
                        billsCount++;
                    }

                    // Transport Bill
                    if (transportRate > 0 && record.usesBusService) {
                        const transportRecordId = `transport-${record.studentId}-${dateStr}`;
                        const financialRecordRef = doc(firestore, 'financialRecords', transportRecordId);
                        billingBatch.set(financialRecordRef, {
                            billedAmount: transportRate,
                            studentId: record.studentId,
                            studentName: record.studentName,
                            classId: record.classId,
                            type: 'Transport Fee',
                            description: `Bus Ride for ${format(selectedDate, 'PPP')}`,
                            status: 'Unpaid',
                            dueDate: selectedDate,
                            createdAt: serverTimestamp(),
                             amountPaid: 0,
                        }, { merge: true });
                        billsCount++;
                    }
                }
                
                if (billsCount > 0) {
                    await billingBatch.commit();
                    toast({ title: 'Billing Complete', description: `${billsCount} financial records created/updated.` });
                }
            } else {
                 toast({ title: 'Billing Skipped', description: 'No students present or no rates set.' });
            }

        } catch (error: any) {
            console.error("Submit/Billing Error:", error);
            toast({ variant: 'destructive', title: 'Error During Billing', description: error.message || 'Could not save financial records.' });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Take Daily Attendance</CardTitle>
                <CardDescription>Select a class and date.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* DATE & CLASS SELECTION */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {!propClassId && (
                        <div className="flex-1">
                            <Label>Class</Label>
                            <Select onValueChange={setSelectedClassId} value={selectedClassId} disabled={isLoadingClasses}>
                                <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                                <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    )}
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
                </div>

                {isLoading && !studentsLoaded && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}

                {/* STUDENT LIST */}
                {studentsLoaded && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                             <ScrollArea className="h-72 w-full pr-4">
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <Card key={field.id} className="p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                                <div className="flex flex-col">
                                                    <p className="font-medium">{field.studentName}</p>
                                                    {field.usesBusService && (
                                                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit font-semibold flex items-center gap-1">
                                                            Bus User
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <FormField
                                                    control={form.control}
                                                    name={`records.${index}.status`}
                                                    render={({ field: formField }) => (
                                                        <FormItem><FormControl>
                                                            <RadioGroup onValueChange={formField.onChange} defaultValue={formField.value} className="flex flex-wrap gap-4">
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
                                                    render={({ field: formField }) => (
                                                        <FormItem><FormControl><Input placeholder="Optional notes..." {...formField} /></FormControl></FormItem>
                                                    )}
                                                />
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                             </ScrollArea>
                            {fields.length > 0 && <Button type="submit" className="mt-6 w-full" disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Submit Attendance</Button>}
                            {fields.length === 0 && <p className="text-center text-muted-foreground p-8">No students found in this class.</p>}
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    );
}
