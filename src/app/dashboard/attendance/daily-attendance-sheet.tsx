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
import { CalendarIcon, Loader2, Utensils, Bus, Check, Search, Clock, X, FileText, AlertCircle, Sparkles } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { format, startOfDay } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useCallback, useMemo } from 'react';
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
    const [hasExistingRecords, setHasExistingRecords] = useState(false);

    const canOverwrite = role === 'Director' || role === 'Administrator';
    const isLocked = hasExistingRecords && !canOverwrite;

    const classesQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId) return null;
        return query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId]);
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

    const timetableQuery = useMemoFirebase(() => 
      (firestore && schoolId && role === 'Teacher')
        ? query(collection(firestore, 'timetables'), where('schoolId', '==', schoolId)) 
        : null, 
    [firestore, schoolId, role]);
    const { data: timetable } = useCollection<any>(timetableQuery);

    const visibleClasses = useMemo(() => {
        if (!classes) return [];
        if (role !== 'Teacher') return classes;
        const subjectClassIds = timetable?.filter((t: any) => t.teacherId === user?.uid).map((t: any) => t.classId) || [];
        return classes.filter((c: any) => c.teacherId === user?.uid || subjectClassIds.includes(c.id));
    }, [classes, timetable, role, user?.uid]);

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

            setHasExistingRecords(existingRecords.length > 0);

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
        if (selectedClassId && !isLoadingClasses) {
            if (role === 'Teacher') {
                const isAuthorized = visibleClasses.some((c: any) => c.id === selectedClassId);
                if (!isAuthorized) {
                    toast({
                        variant: 'destructive',
                        title: 'Access Restricted',
                        description: 'You do not have access to this class roster.'
                    });
                    setSelectedClassId(visibleClasses[0]?.id || '');
                    return;
                }
            }
            handleLoadStudents();
        }
    }, [selectedClassId, selectedDate, handleLoadStudents, role, visibleClasses, isLoadingClasses, toast]);
    
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

                // Overwrite / Marking correction: delete canteen and transport bills if changed to Absent or Excused
                if (record.status === 'Absent' || record.status === 'Excused') {
                    const canteenBillId = `canteen-${record.studentId}-${dateStr}`;
                    const transportBillId = `transport-${record.studentId}-${dateStr}`;
                    batch.delete(doc(firestore, 'financialRecords', canteenBillId));
                    batch.delete(doc(firestore, 'financialRecords', transportBillId));
                }
            });

            await batch.commit();
            setHasExistingRecords(true);

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

    const records = form.watch("records") || [];
    
    const billingBusCount = records.filter((r) => {
        const student = students.find(s => s.uid === r.studentId);
        const transportMode = (student as any)?.transportBillingModel || 'Daily';
        return (r.status === 'Present' || r.status === 'Late') && student?.usesBusService && transportMode === 'Daily';
    }).length;

    const billingCanteenCount = records.filter((r) => {
        const student = students.find(s => s.uid === r.studentId);
        const canteenMode = (student as any)?.canteenBillingMode || 'Daily';
        return (r.status === 'Present' || r.status === 'Late') && (student?.usesCanteen !== false) && canteenMode === 'Daily';
    }).length;

    return (
        <Card className="border-none shadow-none bg-transparent h-full flex flex-col relative">
            <CardHeader className="px-0 flex-shrink-0">
                <CardTitle className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-teal-600 animate-pulse" />
                    Daily Attendance Cockpit
                </CardTitle>
                <CardDescription className="text-slate-500">
                    Only active students are listed. Marking 'Present' or 'Late' automatically schedules charges for active subscribers.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0 flex-1 flex flex-col pb-0">
                <div className="flex flex-col md:flex-row gap-4 mb-6 flex-shrink-0 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-slate-100 shadow-sm">
                    {!propClassId && (
                        <div className="flex-1">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Select Class</Label>
                            <Select onValueChange={setSelectedClassId} value={selectedClassId} disabled={isLoadingClasses}>
                                <SelectTrigger className="bg-white border-slate-200/80 rounded-xl h-11 focus:ring-teal-500">
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-150">
                                    {visibleClasses?.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div className="flex-1">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Select Roster Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={'outline'} className={cn('w-full h-11 justify-start text-left font-normal bg-white border-slate-200/80 rounded-xl hover:bg-slate-50 transition-all', !selectedDate && 'text-muted-foreground')}>
                                    <CalendarIcon className="mr-2 h-4 w-4 text-teal-600" />
                                    {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border border-slate-150 rounded-2xl shadow-lg">
                                <Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} initialFocus className="rounded-2xl" />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {studentsLoaded && hasExistingRecords && (
                    isLocked ? (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
                            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-rose-800">Attendance Sheet Locked</h4>
                                <p className="text-xs text-rose-650 mt-0.5">
                                    Attendance has already been marked for this date. Standard teachers are locked from making modifications. Please contact the Administrator or the Director to request changes.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
                            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-amber-800">Overwrite Mode Enabled</h4>
                                <p className="text-xs text-amber-650 mt-0.5">
                                    Attendance has already been marked for this date. As an Administrator or Director, you are permitted to overwrite the existing entries.
                                </p>
                            </div>
                        </div>
                    )
                )}

                {studentsLoaded && (
                    <div className="relative w-full md:max-w-sm mb-6 flex-shrink-0">
                        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <Input 
                            placeholder="Filter student roster by name..." 
                            className="pl-10 pr-4 bg-white border-slate-200/80 rounded-xl h-11 shadow-sm focus-visible:ring-teal-500" 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}

                {isLoading && !studentsLoaded && (
                    <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                        <span className="text-sm font-medium animate-pulse text-slate-500">Retrieving student roster...</span>
                    </div>
                )}

                {studentsLoaded && (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 relative">
                            <div className="space-y-4 overflow-y-auto flex-1 pb-4 pr-1" style={{ maxHeight: 'calc(100vh - 280px)' }}>
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
                                    <Card key={field.id} className={cn(
                                        "p-4 transition-all duration-300 border shadow-sm rounded-2xl hover:shadow-md hover:border-slate-300/60",
                                        currentStatus === 'Absent' ? 'bg-rose-50/20 border-rose-100' : 
                                        currentStatus === 'Present' ? 'bg-emerald-50/10 border-emerald-100/60' : 
                                        currentStatus === 'Late' ? 'bg-amber-50/15 border-amber-100/60' : 'bg-white'
                                    )}>
                                        <input type="hidden" {...form.register(`records.${index}.id`)} />
                                        <input type="hidden" {...form.register(`records.${index}.studentId`)} defaultValue={field.studentId} />
                                        <input type="hidden" {...form.register(`records.${index}.classId`)} defaultValue={field.classId} />
                                        
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                                            <div className="lg:col-span-1">
                                                {student && <StudentDisplay student={student} variant="list" />}
                                                <div className="flex flex-wrap gap-1.5 mt-2.5">
                                                    {willBillCanteen && (
                                                        <Badge variant="outline" className="bg-orange-50 text-orange-700 text-[10px] font-bold border-orange-200 rounded-lg flex items-center py-0.5 px-2">
                                                            <Utensils className="h-3 w-3 mr-1 text-orange-600"/> Bill Canteen
                                                        </Badge>
                                                    )}
                                                    {willBillBus && (
                                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[10px] font-bold border-blue-200 rounded-lg flex items-center py-0.5 px-2">
                                                            <Bus className="h-3 w-3 mr-1 text-blue-600"/> Bill Bus
                                                        </Badge>
                                                    )}
                                                    {currentStatus === 'Absent' && (
                                                        <Badge variant="secondary" className="bg-rose-50 text-rose-600 text-[10px] font-extrabold border border-rose-100 rounded-lg py-0.5 px-2 uppercase tracking-wide">
                                                            No charges
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="lg:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`records.${index}.status`}
                                                render={({ field: formField }) => (
                                                    <FormItem className="space-y-0">
                                                        <FormControl>
                                                            <RadioGroup 
                                                                onValueChange={formField.onChange} 
                                                                defaultValue={formField.value} 
                                                                value={formField.value}
                                                                className="flex flex-wrap gap-2.5"
                                                                disabled={isLocked}
                                                            >
                                                                <div 
                                                                    onClick={() => !isLocked && formField.onChange('Present')}
                                                                    className={cn(
                                                                        "flex items-center space-x-2 border-2 px-3.5 py-1.5 rounded-full select-none shadow-sm transition-all duration-200",
                                                                        isLocked ? "cursor-not-allowed opacity-65" : "cursor-pointer hover:border-slate-300 hover:bg-slate-50",
                                                                        formField.value === 'Present' 
                                                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold ring-2 ring-emerald-500/20 shadow-emerald-100' 
                                                                            : 'bg-white border-slate-200 text-slate-500'
                                                                    )}
                                                                >
                                                                    <RadioGroupItem value="Present" id={`p-${index}`} className="sr-only" />
                                                                    <Check className={cn("h-3.5 w-3.5 mr-1 transition-all duration-200", formField.value === 'Present' ? "scale-100 opacity-100" : "scale-0 opacity-0 w-0 mr-0")} />
                                                                    <span className="text-xs">Present</span>
                                                                </div>
                                                                
                                                                <div 
                                                                    onClick={() => !isLocked && formField.onChange('Late')}
                                                                    className={cn(
                                                                        "flex items-center space-x-2 border-2 px-3.5 py-1.5 rounded-full select-none shadow-sm transition-all duration-200",
                                                                        isLocked ? "cursor-not-allowed opacity-65" : "cursor-pointer hover:border-slate-300 hover:bg-slate-50",
                                                                        formField.value === 'Late' 
                                                                            ? 'border-amber-500 bg-amber-50 text-amber-700 font-bold ring-2 ring-amber-500/20 shadow-amber-100' 
                                                                            : 'bg-white border-slate-200 text-slate-500'
                                                                    )}
                                                                >
                                                                    <RadioGroupItem value="Late" id={`l-${index}`} className="sr-only" />
                                                                    <Clock className={cn("h-3.5 w-3.5 mr-1 transition-all duration-200", formField.value === 'Late' ? "scale-100 opacity-100" : "scale-0 opacity-0 w-0 mr-0")} />
                                                                    <span className="text-xs">Late</span>
                                                                </div>

                                                                <div 
                                                                    onClick={() => !isLocked && formField.onChange('Absent')}
                                                                    className={cn(
                                                                        "flex items-center space-x-2 border-2 px-3.5 py-1.5 rounded-full select-none shadow-sm transition-all duration-200",
                                                                        isLocked ? "cursor-not-allowed opacity-65" : "cursor-pointer hover:border-slate-300 hover:bg-slate-50",
                                                                        formField.value === 'Absent' 
                                                                            ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold ring-2 ring-rose-500/20 shadow-rose-100' 
                                                                            : 'bg-white border-slate-200 text-slate-500'
                                                                    )}
                                                                >
                                                                    <RadioGroupItem value="Absent" id={`a-${index}`} className="sr-only" />
                                                                    <X className={cn("h-3.5 w-3.5 mr-1 transition-all duration-200", formField.value === 'Absent' ? "scale-100 opacity-100" : "scale-0 opacity-0 w-0 mr-0")} />
                                                                    <span className="text-xs">Absent</span>
                                                                </div>

                                                                <div 
                                                                    onClick={() => !isLocked && formField.onChange('Excused')}
                                                                    className={cn(
                                                                        "flex items-center space-x-2 border-2 px-3.5 py-1.5 rounded-full select-none shadow-sm transition-all duration-200",
                                                                        isLocked ? "cursor-not-allowed opacity-65" : "cursor-pointer hover:border-slate-300 hover:bg-slate-50",
                                                                        formField.value === 'Excused' 
                                                                            ? 'border-slate-500 bg-slate-100 text-slate-700 font-bold ring-2 ring-slate-400/20 shadow-slate-100' 
                                                                            : 'bg-white border-slate-200 text-slate-500'
                                                                    )}
                                                                >
                                                                    <RadioGroupItem value="Excused" id={`e-${index}`} className="sr-only" />
                                                                    <FileText className={cn("h-3.5 w-3.5 mr-1 transition-all duration-200", formField.value === 'Excused' ? "scale-100 opacity-100" : "scale-0 opacity-0 w-0 mr-0")} />
                                                                    <span className="text-xs">Excused</span>
                                                                </div>
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            </div>

                                            <div className="lg:col-span-1">
                                            <FormField
                                                control={form.control}
                                                name={`records.${index}.notes`}
                                                render={({ field: formField }) => (
                                                    <FormItem className="space-y-0">
                                                        <FormControl>
                                                            <Input 
                                                                placeholder="Add optional notes..." 
                                                                {...formField} 
                                                                className="bg-white border-slate-200 rounded-xl h-10 shadow-inner focus-visible:ring-teal-500 text-xs" 
                                                                disabled={isLocked}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            </div>
                                        </div>
                                    </Card>
                                    );
                                })}
                                {fields.length > 0 && <div className="h-32" />}
                            </div>
                        </form>
                    </Form>
                )}

                {studentsLoaded && fields.length > 0 && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[50] w-[calc(100%-2rem)] max-w-4xl px-6 py-4 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.4)] flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex flex-wrap items-center gap-3 text-[11px]">
                            <div className="flex items-center gap-1.5 text-slate-300 bg-slate-800/85 px-3 py-1.5 rounded-lg border border-slate-700/50">
                                <span className="font-semibold text-slate-400">Total Students:</span>
                                <span className="text-white font-bold">{records.length}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/45 px-3 py-1.5 rounded-lg border border-emerald-800/30">
                                <span className="font-semibold text-emerald-300">Present/Late:</span>
                                <span className="font-bold">{records.filter(r => r.status === 'Present' || r.status === 'Late').length}</span>
                            </div>
                            {billingCanteenCount > 0 && (
                                <div className="flex items-center gap-1.5 text-orange-400 bg-orange-950/45 px-3 py-1.5 rounded-lg border border-orange-800/30">
                                    <Utensils className="h-3 w-3 text-orange-400" />
                                    <span className="font-semibold text-orange-300">Canteen Bills:</span>
                                    <span className="font-bold">{billingCanteenCount}</span>
                                </div>
                            )}
                            {billingBusCount > 0 && (
                                <div className="flex items-center gap-1.5 text-sky-400 bg-sky-950/45 px-3 py-1.5 rounded-lg border border-sky-800/30">
                                    <Bus className="h-3 w-3 text-sky-400" />
                                    <span className="font-semibold text-sky-300">Bus Bills:</span>
                                    <span className="font-bold">{billingBusCount}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3.5 w-full md:w-auto shrink-0 justify-end">
                            {billingProgress && (
                                <span className="text-xs text-indigo-300 font-semibold animate-pulse max-w-[200px] truncate">
                                    {billingProgress}
                                </span>
                            )}
                            <Button
                                onClick={form.handleSubmit(onSubmit)}
                                className="w-full md:w-auto h-11 px-6 font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg shadow-teal-950/20 transition-all duration-200 hover:shadow-teal-500/20 active:scale-[0.98]"
                                disabled={isLoading || isLocked}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-2 h-4 w-4"/>
                                        Save & Process Attendance
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
