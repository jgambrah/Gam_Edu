

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
import { format, startOfDay, getYear, getMonth } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, FirestorePermissionError, errorEmitter } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc, getDoc, serverTimestamp, runTransaction, increment } from 'firebase/firestore';
import { attendanceRecordSchema, type Student, type AttendanceRecord, type Class } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useRole } from '@/context/role-context';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const attendanceFormSchema = z.object({
    records: z.array(attendanceRecordSchema),
});

type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

type DailyAttendanceSheetProps = {
    classId?: string; // Optional prop to pre-select a class
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

            // Check existing attendance for today
            const attendanceQuery = query(
                collection(firestore, 'attendance'),
                where('classId', '==', selectedClassId),
                where('date', '==', startOfDay(selectedDate))
            );
            const attendanceSnapshot = await getDocs(attendanceQuery);
            const existingRecords = attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AttendanceRecord[];

            const formRecords = studentList.map(student => {
                const existingRecord = existingRecords.find(r => r.studentId === student.uid);
                
                // DEBUG: Check if bus data is coming from DB
                // console.log(`Loaded ${student.firstName}: Bus=${student.usesBusService}`);

                return {
                    id: existingRecord?.id,
                    studentId: student.uid,
                    studentName: `${student.firstName} ${student.lastName}`,
                    classId: selectedClassId,
                    date: startOfDay(selectedDate),
                    status: existingRecord?.status || 'Present',
                    notes: existingRecord?.notes || '',
                    // Force boolean true/false
                    usesBusService: student.usesBusService === true, 
                };
            });

            replace(formRecords as any);
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
    
    // --- SUBMIT & BILLING LOGIC ---
    async function onSubmit(data: AttendanceFormData) {
        if (!firestore) return;
        setIsLoading(true);
        
        const batch = writeBatch(firestore);
        
        // 1. Save Attendance
        data.records.forEach(record => {
            const recordRef = record.id ? doc(firestore, 'attendance', record.id) : doc(collection(firestore, 'attendance'));
            // Remove helper fields before saving to attendance collection
            const { usesBusService, id, ...dataToSave } = record as any; 
            batch.set(recordRef, dataToSave, { merge: true });
        });

        try {
            await batch.commit();
            toast({ title: 'Success', description: 'Attendance saved.' });

            // 2. Get Financial Settings
            let canteenRate = 0;
            let transportRate = 0;
            try {
                const canteenSnap = await getDoc(doc(firestore, 'schoolSettings', 'canteen'));
                if (canteenSnap.exists()) canteenRate = Number(canteenSnap.data().dailyRate) || 0;

                const transportSnap = await getDoc(doc(firestore, 'schoolSettings', 'transport'));
                if (transportSnap.exists()) transportRate = Number(transportSnap.data().dailyRate) || 0;
            } catch (e) {
                console.warn("Settings Check Failed:", e);
            }

            console.log(`💰 Billing Rates: Canteen=${canteenRate}, Transport=${transportRate}`);

            // 3. Calculate Billing
            const presentStudents = data.records.filter(r => r.status === 'Present' || r.status === 'Late');
            let billingBatch = writeBatch(firestore);
            let billsCount = 0;
            
            // Date Formatting for IDs
            const year = getYear(selectedDate);
            const month = getMonth(selectedDate) + 1;
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const period = `${year}-${String(month).padStart(2, '0')}`;

            for (const record of presentStudents) {
                const r = record as any; // Access custom fields
                
                // ROBUST CHECK: Convert string "true" or boolean true to boolean
                const usesBus = String(r.usesBusService) === "true";

                console.log(`Processing ${r.studentName}: Bus=${usesBus}, Rate=${transportRate}`);

                // A. Canteen Billing
                if (canteenRate > 0) {
                    const canteenRecordId = `canteen-${r.studentId}-${dateStr}`;
                    const ref = doc(firestore, 'financialRecords', canteenRecordId);
                    
                    billingBatch.set(ref, {
                        amount: canteenRate,
                        studentId: r.studentId,
                        studentName: r.studentName || "Unknown",
                        classId: r.classId,
                        type: 'Canteen Fee',
                        description: `Lunch for ${format(selectedDate, 'PPP')}`,
                        status: 'Unpaid',
                        dueDate: selectedDate,
                        createdAt: serverTimestamp()
                    }, { merge: true });
                    billsCount++;
                }

                // B. Transport Billing
                if (transportRate > 0 && usesBus) {
                    console.log(` -> Creating Transport Bill for ${r.studentName}`);
                    const transportRecordId = `transport-${r.studentId}-${dateStr}`;
                    const ref = doc(firestore, 'financialRecords', transportRecordId);
                    
                    billingBatch.set(ref, {
                        amount: transportRate,
                        studentId: r.studentId,
                        studentName: r.studentName || "Unknown",
                        classId: r.classId,
                        type: 'Transport Fee',
                        description: `Bus Ride for ${format(selectedDate, 'PPP')}`,
                        status: 'Unpaid',
                        dueDate: selectedDate,
                        createdAt: serverTimestamp()
                    }, { merge: true });
                    billsCount++;
                }
            }
            
            if (billsCount > 0) {
                await billingBatch.commit();
                toast({ title: 'Billing Updated', description: `Applied ${billsCount} fee records.` });
            } else {
                console.log("No bills generated. Check Rates > 0 and Student Bus Status.");
            }

        } catch (error: any) {
            console.error("Submit Error:", error);
            toast({ variant: 'destructive', title: 'Error', description: error.message });
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
                    {!propClassId && (
                        <div className="flex items-end">
                            <Button onClick={handleLoadStudents} disabled={isLoading || !selectedClassId}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Load Students
                            </Button>
                        </div>
                    )}
                </div>

                {isLoading && !studentsLoaded && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}

                {studentsLoaded && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                             <ScrollArea className="h-72 w-full pr-4">
                                <div className="space-y-4">
                                    {fields.map((field, index) => (
                                        <Card key={field.id} className="p-4">
                                            
                                            {/* CRITICAL: Hidden inputs to persist data through form submit */}
                                            <input type="hidden" {...form.register(`records.${index}.studentName`)} value={field.studentName} />
                                            <input type="hidden" {...form.register(`records.${index}.studentId`)} value={field.studentId} />
                                            <input type="hidden" {...form.register(`records.${index}.classId`)} value={field.classId} />
                                            
                                            {/* --- THE FIX: FORCE STRING 'true'/'false' --- */}
                                            <input 
                                                type="hidden" 
                                                {...form.register(`records.${index}.usesBusService`)} 
                                                value={(field as any).usesBusService ? "true" : "false"} 
                                            />

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                                <div className="flex flex-col">
                                                    <p className="font-medium">{field.studentName}</p>
                                                    {/* Visual check: If this badge shows, data is correct */}
                                                    {(field as any).usesBusService && (
                                                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit font-semibold">
                                                            Bus User
                                                        </span>
                                                    )}
                                                </div>
                                                
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

