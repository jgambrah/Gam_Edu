

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
import { collection, query, where, getDocs, writeBatch, doc, getDoc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { attendanceRecordSchema, type Student, type AttendanceRecord, type Class } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useRole } from '@/context/role-context';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

const attendanceFormSchema = z.object({
    records: z.array(attendanceRecordSchema)
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
        defaultValues: {
            records: [],
        },
    });

    const { fields, replace } = useFieldArray({
        control: form.control,
        name: "records",
    });

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
                toast({ title: 'No Students', description: 'No students found in the selected class.' });
                replace([]);
                setStudentsLoaded(true);
                setIsLoading(false);
                return;
            }

            const attendanceQuery = query(
                collection(firestore, 'attendance'),
                where('classId', '==', selectedClassId),
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
                    classId: selectedClassId,
                    date: startOfDay(selectedDate),
                    status: existingRecord?.status || 'Present',
                    notes: existingRecord?.notes || '',
                    usesBusService: student.usesBusService || false,
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

    // Automatically load students if classId is passed as a prop or when date changes for a pre-selected class
    useEffect(() => {
        if (selectedClassId) {
            handleLoadStudents();
        }
    }, [selectedClassId, selectedDate, handleLoadStudents]);
    
    async function onSubmit(data: AttendanceFormData) {
        if (!firestore) return;
        setIsLoading(true);
        
        const attendanceBatch = writeBatch(firestore);
        data.records.forEach(record => {
            const recordRef = record.id ? doc(firestore, 'attendance', record.id) : doc(collection(firestore, 'attendance'));
            const { studentName, id, ...dataToSave } = record as any; // Exclude client-side fields
            attendanceBatch.set(recordRef, dataToSave, { merge: true });
        });

        try {
            await attendanceBatch.commit();
            toast({ title: 'Success', description: 'Attendance has been saved successfully.' });

            // --- CANTEEN & TRANSPORT BILLING LOGIC (ROBUST FIX) ---
            const canteenSettingsSnap = await getDoc(doc(firestore, 'schoolSettings', 'canteen'));
            const transportSettingsSnap = await getDoc(doc(firestore, 'schoolSettings', 'transport'));
            const canteenRate = canteenSettingsSnap.exists() ? canteenSettingsSnap.data().dailyRate : 0;
            const transportRate = transportSettingsSnap.exists() ? transportSettingsSnap.data().dailyRate : 0;
            
            const presentStudents = data.records.filter(r => r.status === 'Present' || r.status === 'Late');

            if (presentStudents.length > 0 && (canteenRate > 0 || transportRate > 0)) {
                toast({ title: 'Processing Daily Fees...', description: 'Applying canteen and transport charges.' });
            
                // Use a loop of transactions for robustness
                for (const record of presentStudents) {
                    const year = getYear(record.date);
                    const month = getMonth(record.date) + 1;
                    const period = `${year}-${String(month).padStart(2, '0')}`;
            
                    // Canteen Billing Transaction
                    if (canteenRate > 0) {
                        const canteenRecordId = `canteen-${record.studentId}-${period}`;
                        const financialRecordRef = doc(firestore, 'financialRecords', canteenRecordId);
                        
                        await runTransaction(firestore, async (transaction) => {
                            const frDoc = await transaction.get(financialRecordRef);
                            if (!frDoc.exists()) {
                                transaction.set(financialRecordRef, {
                                    billedAmount: canteenRate,
                                    studentId: record.studentId,
                                    studentName: record.studentName,
                                    classId: record.classId,
                                    type: 'Canteen Fee',
                                    description: `Canteen Bill for ${period}`,
                                    status: 'Unpaid',
                                    dueDate: new Date(year, month, 0),
                                    createdAt: serverTimestamp(),
                                    amountPaid: 0,
                                });
                            } else {
                                const newAmount = (frDoc.data().billedAmount || 0) + canteenRate;
                                transaction.update(financialRecordRef, { billedAmount: newAmount });
                            }
                        });
                    }

                    // Transport Billing Transaction
                    if (transportRate > 0 && record.usesBusService) {
                        const transportRecordId = `transport-${record.studentId}-${period}`;
                        const financialRecordRef = doc(firestore, 'financialRecords', transportRecordId);

                         await runTransaction(firestore, async (transaction) => {
                            const frDoc = await transaction.get(financialRecordRef);
                            if (!frDoc.exists()) {
                                transaction.set(financialRecordRef, {
                                    billedAmount: transportRate,
                                    studentId: record.studentId,
                                    studentName: record.studentName,
                                    classId: record.classId,
                                    type: 'Transport Fee',
                                    description: `Transport Bill for ${period}`,
                                    status: 'Unpaid',
                                    dueDate: new Date(year, month, 0),
                                    createdAt: serverTimestamp(),
                                    amountPaid: 0,
                                });
                            } else {
                                const newAmount = (frDoc.data().billedAmount || 0) + transportRate;
                                transaction.update(financialRecordRef, { billedAmount: newAmount });
                            }
                        });
                    }
                }
                 toast({ title: 'Auto-Billing Complete', description: `Daily fees have been applied successfully.` });
            }

             data.records.forEach(record => {
                if (record.status === 'Absent' || record.status === 'Late') {
                    console.log(`Placeholder: Sending notification to parent of ${record.studentName} for being ${record.status}.`);
                }
            });

        } catch (serverError) {
             const permissionError = new FirestorePermissionError({
                path: 'attendance or financialRecords', 
                operation: 'write',
                requestResourceData: data.records,
            });
            errorEmitter.emit('permission-error', permissionError);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Take Daily Attendance</CardTitle>
                <CardDescription>Select a class and date, then load the roster to mark attendance.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {!propClassId && ( // Only show class selector if not embedded in a specific class context
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
                    {!propClassId && ( // Only show manual load button on standalone page
                        <div className="flex items-end">
                            <Button onClick={handleLoadStudents} disabled={isLoading || !selectedClassId}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Load Students
                            </Button>
                        </div>
                    )}
                </div>

                {isLoading && !studentsLoaded && (
                    <div className="flex justify-center p-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                )}

                {studentsLoaded && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                             <ScrollArea className="h-72 w-full pr-4">
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
