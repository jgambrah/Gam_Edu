'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Loader2, Utensils, Bus, Check, Search } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { format, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useCallback } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { type Student, type AttendanceRecord, type Class } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { useRole } from '@/context/role-context';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { StudentDisplay } from '@/components/student-display';
import { billMultipleStudents } from '@/lib/billing';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { notifyParents } from '@/app/actions/notifications';
import { sendSchoolWhatsApp } from '@/app/actions/whatsapp';

const attendanceRecordSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  studentName: z.string(), 
  status: z.enum(['Present', 'Absent', 'Late', 'Excused']),
  notes: z.string().optional(),
  classId: z.string(),
  usesBusService: z.string().optional(),
  usesCanteen: z.string().optional(), 
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
    const { schoolId } = useCurrentSchool();
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [studentsLoaded, setStudentsLoaded] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [selectedClassId, setSelectedClassId] = useState<string>(propClassId || '');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    
    const [billingProgress, setBillingProgress] = useState<string | null>(null);

    const classesQuery = useMemoFirebase(() => {
        if (!user || !firestore || !schoolId) return null;
        let q = query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
        if (role === 'Teacher') {
          q = query(q, where('teacherId', '==', user.uid));
        }
        return q;
    }, [firestore, user, role, schoolId]);
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

    const form = useForm<AttendanceFormData>({
        resolver: zodResolver(attendanceFormSchema),
        defaultValues: { records: [] },
    });

    const { fields, replace } = useFieldArray({
        control: form.control,
        name: "records",
    });

    const handleLoadStudents = useCallback(async () => {
        if (!selectedClassId || !firestore || !schoolId) return;
        setIsLoading(true);
        setStudentsLoaded(false);

        try {
            const studentQuery = query(
                collection(firestore, 'students'), 
                where('schoolId', '==', schoolId),
                where('classId', '==', selectedClassId),
                where('enrollmentStatus', '==', 'Active') 
            );
            const studentSnapshot = await getDocs(studentQuery);
            
            const studentList = studentSnapshot.docs
                .map(doc => ({ ...doc.data(), uid: doc.id, id: doc.id })) as Student[];
            
            setStudents(studentList);

            if (studentList.length === 0) {
                toast({ title: 'No Active Students', description: 'No active students found in this class.' });
                replace([]);
                setStudentsLoaded(true);
                setIsLoading(false);
                return;
            }

            const attendanceQuery = query(
                collection(firestore, 'attendance'),
                where('schoolId', '==', schoolId),
                where('classId', '==', selectedClassId),
                where('date', '==', startOfDay(selectedDate))
            );
            const attendanceSnapshot = await getDocs(attendanceQuery);
            const existingRecords = attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AttendanceRecord[];

            const formRecords = studentList.map(student => {
                const existingRecord = existingRecords.find(r => r.studentId === student.uid);
                const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
                
                return {
                    id: existingRecord?.id,
                    studentId: student.uid,
                    studentName: studentName,
                    classId: selectedClassId,
                    status: (existingRecord?.status || 'Present') as "Present" | "Absent" | "Late" | "Excused",
                    notes: existingRecord?.notes || '',
                    usesBusService: String(student.usesBusService || false),
                    usesCanteen: String(student.usesCanteen !== false),
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
    }, [selectedClassId, selectedDate, firestore, toast, replace, schoolId]);

    useEffect(() => {
        if (selectedClassId) handleLoadStudents();
    }, [selectedClassId, selectedDate, handleLoadStudents]);
    
    async function onSubmit(data: AttendanceFormData) {
        if (!firestore || !schoolId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Cannot proceed without school context.' });
            return;
        }
        setIsLoading(true);
        setBillingProgress("Saving attendance...");
        
        try {
            const batch = writeBatch(firestore);
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            
            data.records.forEach(record => {
                const deterministicId = `att-${schoolId}-${selectedClassId}-${record.studentId}-${dateStr}`;
                const recordRef = doc(firestore, 'attendance', deterministicId);
                const { usesBusService, usesCanteen, id, ...dataToSave } = record; 
                
                batch.set(recordRef, {
                    ...dataToSave,
                    date: startOfDay(selectedDate),
                    schoolId: schoolId,
                    updatedAt: serverTimestamp(),
                    updatedBy: user?.uid
                }, { merge: true });
            });

            await batch.commit();

            // Notify parents via Push asynchronously
            const gradedStudentIds = data.records.map(r => r.studentId);
            notifyParents(
                gradedStudentIds,
                "Daily Attendance Recorded 📅",
                "Your child's attendance for today has been updated. Tap to view details.",
                "/dashboard/my-attendance"
            ).catch(err => console.error("Notification failed:", err));

            // --- AUTOMATED WHATSAPP ALERTS (Fire and forget) ---
            const alertRecords = data.records.filter(r => r.status === 'Absent' || r.status === 'Late');
            
            if (alertRecords.length > 0) {
                const alertedStudentIds = alertRecords.map(r => r.studentId);
                
                // Chunk IDs into groups of 30 to respect Firestore query limits
                const chunks: string[][] = [];
                for (let i = 0; i < alertedStudentIds.length; i += 30) {
                    chunks.push(alertedStudentIds.slice(i, i + 30));
                }

                // Execute queries in parallel
                const parentResults = await Promise.all(chunks.map(chunk => 
                    getDocs(query(
                        collection(firestore, 'parents'), 
                        where('schoolId', '==', schoolId), 
                        where('studentIds', 'array-contains-any', chunk)
                    ))
                ));
                
                // Flatten and deduplicate parents
                const parentsMap = new Map();
                parentResults.forEach(snap => {
                    snap.docs.forEach(d => parentsMap.set(d.id, d.data()));
                });
                
                parentsMap.forEach(parent => {
                    if (!parent.phone) return;

                    const childAlerts = alertRecords.filter(r => parent.studentIds?.includes(r.studentId));
                    
                    childAlerts.forEach(alert => {
                        const timeStr = format(new Date(), 'h:mm a');
                        const message = alert.status === 'Absent' 
                            ? `🚨 *GAM Edu Alert*\n\nDear Parent, please be informed that your ward, *${alert.studentName}*, was marked *ABSENT* today at ${timeStr}. Please contact the school if you are unaware of this.`
                            : `⚠️ *GAM Edu Alert*\n\nDear Parent, please be informed that your ward, *${alert.studentName}*, arrived *LATE* to school today at ${timeStr}.`;

                        sendSchoolWhatsApp(schoolId, parent.phone, message).catch(err => console.error("WhatsApp Send Failed:", err));
                    });
                });
            }

            toast({ title: 'Attendance Saved!', description: 'Now processing financial records...' });

            const studentsToBill = data.records
                .filter(r => r.status === 'Present' || r.status === 'Late')
                .map(r => students.find(s => s.uid === r.studentId))
                .filter((s): s is Student => s !== undefined);

            if (studentsToBill.length > 0) {
                const billingResult = await billMultipleStudents(
                    firestore,
                    studentsToBill,
                    selectedDate,
                    schoolId,
                    (current, total, name) => {
                        setBillingProgress(`Billing: ${current}/${total} (${name})`);
                    }
                );
                
                toast({
                    title: 'Daily Billing Complete',
                    description: `✅ ${billingResult.successful} billed. ❌ ${billingResult.failed} failed. Total today: GH₵${billingResult.totalBilled.toFixed(2)}`
                });
            } else {
                toast({ title: 'Billing Skipped', description: 'No students were marked as present or late.'});
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsLoading(false);
            setBillingProgress(null);
        }
    }

    return (
        <Card className="border-none shadow-none bg-transparent h-full flex flex-col relative">
            <CardHeader className="px-0 flex-shrink-0">
                <CardTitle>Daily Attendance & Billing</CardTitle>
                <CardDescription>
                    Only active students are listed. Marking 'Present' or 'Late' automatically generates bills for active subscribers.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0 flex-1 flex flex-col pb-0">
                <div className="flex flex-col md:flex-row gap-4 mb-6 flex-shrink-0">
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

                {studentsLoaded && (
                    <div className="relative w-full md:max-w-sm mb-4 flex-shrink-0">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search student name..." 
                            className="pl-9 bg-white" 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}

                {isLoading && !studentsLoaded && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}

                {studentsLoaded && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 relative">
                            <div className="space-y-3 overflow-y-auto flex-1 pb-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                                {fields.map((field, index) => {
                                    const student = students.find(s => s.uid === field.studentId);
                                    const currentStatus = form.watch(`records.${index}.status`);
                                    
                                    const canteenMode = (student as any)?.canteenBillingMode || 'Daily';
                                    const transportMode = (student as any)?.transportBillingModel || 'Daily';
                                    
                                    const willBillCanteen = (currentStatus === 'Present' || currentStatus === 'Late') && (student?.usesCanteen !== false) && canteenMode === 'Daily';
                                    const willBillBus = (currentStatus === 'Present' || currentStatus === 'Late') && student?.usesBusService && transportMode === 'Daily';

                                    const isVisible = !searchTerm || field.studentName.toLowerCase().includes(searchTerm.toLowerCase());

                                    if (!isVisible) return null;

                                    return (
                                    <Card key={field.id} className={`p-4 transition-colors border shadow-sm ${currentStatus === 'Absent' ? 'bg-red-50/50 border-red-100' : 'bg-white'}`}>
                                        <input type="hidden" {...form.register(`records.${index}.id`)} />
                                        <input type="hidden" {...form.register(`records.${index}.studentId`)} defaultValue={field.studentId} />
                                        <input type="hidden" {...form.register(`records.${index}.classId`)} defaultValue={field.classId} />
                                        
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                                            <div className="lg:col-span-1">
                                                {student && <StudentDisplay student={student} variant="list" />}
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {willBillCanteen && (
                                                        <Badge variant="outline" className="bg-orange-50 text-orange-700 text-[10px] border-orange-200">
                                                            <Utensils className="h-3 w-3 mr-1"/> Bill Canteen
                                                        </Badge>
                                                    )}
                                                    {willBillBus && (
                                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[10px] border-blue-200">
                                                            <Bus className="h-3 w-3 mr-1"/> Bill Bus
                                                        </Badge>
                                                    )}
                                                    {currentStatus === 'Absent' && (
                                                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">No charges</span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="lg:col-span-2">
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
                                                            <div className={`flex items-center space-x-2 border-2 px-3 py-2 rounded-xl cursor-pointer ${formField.value === 'Present' ? 'border-green-500 bg-green-50' : 'bg-white border-slate-200'}`}>
                                                                <RadioGroupItem value="Present" id={`p-${index}`}/><Label htmlFor={`p-${index}`} className="cursor-pointer font-bold text-green-700">Present</Label>
                                                            </div>
                                                            <div className={`flex items-center space-x-2 border-2 px-3 py-2 rounded-xl cursor-pointer ${formField.value === 'Late' ? 'border-orange-500 bg-orange-50' : 'bg-white border-slate-200'}`}>
                                                                <RadioGroupItem value="Late" id={`l-${index}`}/><Label htmlFor={`l-${index}`} className="cursor-pointer font-bold text-orange-600">Late</Label>
                                                            </div>
                                                            <div className={`flex items-center space-x-2 border-2 px-3 py-2 rounded-xl cursor-pointer ${formField.value === 'Absent' ? 'border-red-500 bg-red-50' : 'bg-white border-slate-200'}`}>
                                                                <RadioGroupItem value="Absent" id={`a-${index}`}/><Label htmlFor={`a-${index}`} className="cursor-pointer font-bold text-red-600">Absent</Label>
                                                            </div>
                                                            <div className={`flex items-center space-x-2 border-2 px-3 py-2 rounded-xl cursor-pointer ${formField.value === 'Excused' ? 'border-slate-500 bg-slate-100' : 'bg-white border-slate-200'}`}>
                                                                <RadioGroupItem value="Excused" id={`e-${index}`}/><Label htmlFor={`e-${index}`} className="cursor-pointer font-bold text-slate-500">Excused</Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </FormControl></FormItem>
                                                )}
                                            />
                                            </div>

                                            <div className="lg:col-span-1">
                                            <FormField
                                                control={form.control}
                                                name={`records.${index}.notes`}
                                                render={({ field: formField }) => (
                                                    <FormItem className="space-y-0"><FormControl><Input placeholder="Optional notes..." {...formField} className="bg-white border-slate-200" /></FormControl></FormItem>
                                                )}
                                            />
                                            </div>
                                        </div>
                                    </Card>
                                );
                                })}
                                {fields.length > 0 && <div className="h-28" />}
                            </div>
                        </form>
                    </Form>
                )}

                {studentsLoaded && fields.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 z-[9999] px-6 pb-6 pt-3 bg-white border-t shadow-[0_-4px_12px_rgba(0,0,0,0.12)]">
                        <div className="max-w-4xl mx-auto">
                            {billingProgress && (
                                <div className="text-sm text-indigo-600 font-bold text-center mb-2 animate-pulse">
                                    {billingProgress}
                                </div>
                            )}
                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-md"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? <Loader2 className="mr-2 h-4 w-6 animate-spin"/>
                                    : <Check className="mr-2 h-4 w-6"/>
                                }
                                Confirm Attendance & Notify Parents
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
