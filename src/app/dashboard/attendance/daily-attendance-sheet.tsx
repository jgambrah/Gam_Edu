
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle }from '@/components/ui/card';
import { CalendarIcon, Loader2, Utensils, Bus, Check } from 'lucide-react'; // Added Icons
import { cn } from '@/lib/utils';
import { format, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useCallback } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc, getDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { type Student, type AttendanceRecord, type Class, type Parent } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useRole } from '@/context/role-context';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { StudentDisplay } from '@/components/student-display';

// Schema matches your data structure
const attendanceRecordSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  studentName: z.string(), 
  status: z.enum(['Present', 'Absent', 'Late', 'Excused']),
  notes: z.string().optional(),
  classId: z.string(),
  usesBusService: z.string().optional(),
  usesCanteen: z.string().optional(), // Added Canteen Flag
});

const attendanceFormSchema = z.object({
    records: z.array(attendanceRecordSchema)
});

type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

export function DailyAttendanceSheet({ classId: propClassId }: { classId?: string }) {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [studentsLoaded, setStudentsLoaded] = useState(false);
    
    const [selectedClassId, setSelectedClassId] = useState<string>(propClassId || '');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Fetch Classes
    const classesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        if (role === 'Teacher') return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
        return collection(firestore, 'classes');
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
        if (!selectedClassId || !firestore) return;
        setIsLoading(true);
        setStudentsLoaded(false);

        try {
            const studentQuery = query(collection(firestore, 'students'), where('classId', '==', selectedClassId));
            const studentSnapshot = await getDocs(studentQuery);
            const studentList = studentSnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id, id: doc.id })) as Student[];
            setStudents(studentList);

            if (studentList.length === 0) {
                toast({ title: 'No Students', description: 'No students found in this class.' });
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
                    status: (existingRecord?.status || 'Present') as "Present" | "Absent" | "Late" | "Excused",
                    notes: existingRecord?.notes || '',
                    usesBusService: student.usesBusService ? "true" : "false",
                    usesCanteen: student.usesCanteen !== false ? "true" : "false",
                };
            });

            replace(formRecords);
            setStudentsLoaded(true);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load data.' });
        } finally {
            setIsLoading(false);
        }
    }, [selectedClassId, selectedDate, firestore, toast, replace]);

    useEffect(() => {
        if (selectedClassId) handleLoadStudents();
    }, [selectedClassId, selectedDate, handleLoadStudents]);
    
    // --- SUBMIT & BILLING ---
    async function onSubmit(data: AttendanceFormData) {
        if (!firestore) return;
        setIsLoading(true);
        
        const batch = writeBatch(firestore);
        
        // 1. Save Attendance
        data.records.forEach(record => {
            const recordRef = record.id ? doc(firestore, 'attendance', record.id) : doc(collection(firestore, 'attendance'));
            const { usesBusService, usesCanteen, id, ...dataToSave } = record; 
            
            batch.set(recordRef, {
                ...dataToSave,
                date: startOfDay(selectedDate)
            }, { merge: true });
        });

        // 2. Billing and Notifications
        try {
            // Get Rates
            const canteenSnap = await getDoc(doc(firestore, 'schoolSettings', 'canteen'));
            const transportSnap = await getDoc(doc(firestore, 'schoolSettings', 'transport'));
            const canteenRate = canteenSnap.exists() ? Number(canteenSnap.data().dailyRate) : 0;
            const transportRate = transportSnap.exists() ? Number(transportSnap.data().dailyRate) : 0;
            
            const parentsSnap = await getDocs(collection(firestore, 'parents'));
            const allParents = parentsSnap.docs.map(d => ({ ...d.data(), id: d.id })) as (Parent & {id: string})[];

            let billsCount = 0;
            let absenceNotificationsCount = 0;
            const dateStr = format(selectedDate, 'yyyy-MM-dd');

            const studentDocs = await getDocs(query(collection(firestore, 'students'), where('classId', '==', selectedClassId)));
            const studentMap = new Map(studentDocs.docs.map(d => [d.id, d.data() as Student]));

            for (const record of data.records) {
                
                const studentInfo = studentMap.get(record.studentId);
                if (!studentInfo) continue;
                
                if (record.status === 'Present' || record.status === 'Late') {
                    
                    if (canteenRate > 0 && studentInfo.usesCanteen !== false) {
                        const billRef = doc(firestore, 'financialRecords', `canteen-${record.studentId}-${dateStr}`);
                        batch.set(billRef, {
                            studentId: record.studentId,
                            studentName: record.studentName,
                            classId: record.classId,
                            type: 'Canteen Fee',
                            description: `Lunch for ${dateStr}`,
                            billedAmount: canteenRate,
                            amountPaid: 0,
                            status: 'Unpaid',
                            dueDate: selectedDate,
                            createdAt: serverTimestamp()
                        }, { merge: true });
                        billsCount++;
                    }

                    if (transportRate > 0 && studentInfo.usesBusService) {
                        const billRef = doc(firestore, 'financialRecords', `transport-${record.studentId}-${dateStr}`);
                        batch.set(billRef, {
                            studentId: record.studentId,
                            studentName: record.studentName,
                            classId: record.classId,
                            type: 'Transport Fee',
                            description: `Bus Ride for ${dateStr}`,
                            billedAmount: transportRate,
                            amountPaid: 0,
                            status: 'Unpaid',
                            dueDate: selectedDate,
                            createdAt: serverTimestamp()
                        }, { merge: true });
                        billsCount++;
                    }
                }

                if (record.status === 'Absent') {
                    const parentsToNotify = allParents.filter(p => p.studentIds?.includes(record.studentId));

                    for (const parent of parentsToNotify) {
                         const notificationRef = doc(collection(firestore, 'notifications'));
                         batch.set(notificationRef, {
                            userId: parent.id,
                            title: "Student Absence Notification",
                            message: `Dear Parent, please be advised that ${record.studentName} was marked absent from school today, ${format(selectedDate, 'PPP')}. If this is unexpected, please contact the school office.`,
                            read: false,
                            createdAt: serverTimestamp()
                         });
                         absenceNotificationsCount++;
                    }
                }
            }

            await batch.commit();
            toast({ title: 'Success', description: `Attendance saved. ${billsCount} bills generated. ${absenceNotificationsCount} absence notifications sent.` });

        } catch (error: any) {
            console.error("Billing/Notification Error:", error);
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Take Daily Attendance</CardTitle>
                <CardDescription>Marking 'Present' automatically generates Canteen bills (and Transport bills for subscribers).</CardDescription>
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
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setDate(d)} initialFocus /></PopoverContent>
                        </Popover>
                    </div>
                </div>

                {isLoading && !studentsLoaded && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}

                {studentsLoaded && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                             <ScrollArea className="h-[500px] w-full pr-4">
                                <div className="space-y-4">
                                    {fields.map((field, index) => {
                                        const student = students.find(s => s.uid === field.studentId);
                                        const currentStatus = form.watch(`records.${index}.status`);
                                        const willBillCanteen = (currentStatus === 'Present' || currentStatus === 'Late') && student?.usesCanteen !== false;
                                        const willBillBus = (currentStatus === 'Present' || currentStatus === 'Late') && student?.usesBusService;

                                        return (
                                        <Card key={field.id} className={`p-4 transition-colors ${currentStatus === 'Absent' ? 'bg-red-50' : 'bg-white'}`}>
                                            <input type="hidden" {...form.register(`records.${index}.studentId`)} defaultValue={field.studentId} />
                                            <input type="hidden" {...form.register(`records.${index}.classId`)} defaultValue={field.classId} />
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                                <div className="md:col-span-1">
                                                    {student && <StudentDisplay student={student} variant="list" />}
                                                    <div className="flex gap-2 mt-1">
                                                        {willBillCanteen && (
                                                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-[10px] gap-1 border-orange-200">
                                                                <Utensils className="h-3 w-3"/> Billed
                                                            </Badge>
                                                        )}
                                                        {willBillBus && (
                                                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[10px] gap-1 border-blue-200">
                                                                <Bus className="h-3 w-3"/> Billed
                                                            </Badge>
                                                        )}
                                                        {currentStatus === 'Absent' && (
                                                            <span className="text-xs text-red-500 font-medium">No charges applied</span>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="md:col-span-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`records.${index}.status`}
                                                    render={({ field: formField }) => (
                                                        <FormItem className="space-y-0"><FormControl>
                                                            <RadioGroup 
                                                                onValueChange={formField.onChange} 
                                                                defaultValue={formField.value} 
                                                                className="flex flex-wrap gap-2"
                                                            >
                                                                <div className="flex items-center space-x-2 border p-2 rounded bg-white">
                                                                    <RadioGroupItem value="Present" id={`p-${index}`}/><Label htmlFor={`p-${index}`} className="cursor-pointer text-green-700">Present</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2 border p-2 rounded bg-white">
                                                                    <RadioGroupItem value="Late" id={`l-${index}`}/><Label htmlFor={`l-${index}`} className="cursor-pointer text-orange-600">Late</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2 border p-2 rounded bg-white">
                                                                    <RadioGroupItem value="Absent" id={`a-${index}`}/><Label htmlFor={`a-${index}`} className="cursor-pointer text-red-600">Absent</Label>
                                                                </div>
                                                                <div className="flex items-center space-x-2 border p-2 rounded bg-white">
                                                                    <RadioGroupItem value="Excused" id={`e-${index}`}/><Label htmlFor={`e-${index}`} className="cursor-pointer text-slate-500">Excused</Label>
                                                                </div>
                                                            </RadioGroup>
                                                        </FormControl></FormItem>
                                                    )}
                                                />
                                                </div>

                                                <div className="md:col-span-1">
                                                <FormField
                                                    control={form.control}
                                                    name={`records.${index}.notes`}
                                                    render={({ field: formField }) => (
                                                        <FormItem className="space-y-0"><FormControl><Input placeholder="Notes..." {...formField} className="bg-white" /></FormControl></FormItem>
                                                    )}
                                                />
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                    })}
                                </div>
                             </ScrollArea>
                            {fields.length > 0 && (
                                <div className="pt-4 border-t mt-4">
                                    <Button type="submit" className="w-full h-12 text-lg font-bold bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <Check className="mr-2 h-5 w-5"/>}
                                        Confirm Attendance & Generate Bills
                                    </Button>
                                </div>
                            )}
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    );
}
