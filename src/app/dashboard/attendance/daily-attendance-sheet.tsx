'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Loader2, Utensils, Bus, Check, Search, Clock, X, FileText, AlertCircle, Sparkles, CheckCheck, RotateCcw, UtensilsCrossed } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { format, startOfDay, differenceInDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, getDocs, getDoc, writeBatch, doc, serverTimestamp, Timestamp, setDoc } from 'firebase/firestore';
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
import { logAuditEvent } from '@/lib/audit';
import { triggerStudentBadgeEvent } from '@/lib/achievement-utils';

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

import { useOfflineSync } from '@/hooks/use-offline-sync';

export function DailyAttendanceSheet({ classId: propClassId }: { classId?: string }) {
    const { saveOfflineAttendance, isOnline } = useOfflineSync();
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
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingData, setPendingData] = useState<AttendanceFormData | null>(null);

    const canOverwrite = useMemo(() => {
        const lowerRole = role?.toLowerCase();
        if (lowerRole === 'director' || lowerRole === 'administrator' || lowerRole === 'admin') return true;
        if (lowerRole === 'teacher' || lowerRole === 'accountant') {
            const daysDiff = differenceInDays(startOfDay(new Date()), startOfDay(selectedDate));
            return daysDiff <= 8;
        }
        return false;
    }, [role, selectedDate]);
    const isLocked = hasExistingRecords && !canOverwrite;

    const classesQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId) return null;
        return query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId]);
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

    const timetableQuery = useMemoFirebase(() => 
      (firestore && schoolId && role?.toLowerCase() === 'teacher')
        ? query(collection(firestore, 'timetables'), where('schoolId', '==', schoolId)) 
        : null, 
    [firestore, schoolId, role]);
    const { data: timetable } = useCollection<any>(timetableQuery);

    const visibleClasses = useMemo(() => {
        if (!classes) return [];
        if (role?.toLowerCase() !== 'teacher') return classes;
        const subjectClassIds = timetable?.filter((t: any) => t.teacherId === user?.uid).map((t: any) => t.classId) || [];
        const assigned = classes.filter((c: any) => c.teacherId === user?.uid || subjectClassIds.includes(c.id));
        // If accessing a specific class or if assigned list is empty, return all school classes
        return (propClassId || assigned.length === 0) ? classes : assigned;
    }, [classes, timetable, role, user?.uid, propClassId]);

    const form = useForm<AttendanceFormData>({
        resolver: zodResolver(attendanceFormSchema),
        defaultValues: { records: [] },
    });

    const { fields, replace } = useFieldArray({
        control: form.control,
        name: "records",
    });

    const [canteenSyncedMeals, setCanteenSyncedMeals] = useState<number | null>(null);
    const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

    const handleLoadStudents = useCallback(async () => {
        if (!selectedClassId || !firestore || !schoolId) return;
        setIsLoading(true);
        setStudentsLoaded(false);
        setCanteenSyncedMeals(null);

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

            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const aggDocId = `${schoolId}_${selectedClassId}_${dateStr}`;
            const aggDocRef = doc(firestore, 'attendance', aggDocId);
            const aggDocSnap = await getDoc(aggDocRef);

            let existingRecordsMap: Record<string, { status: string; notes?: string }> = {};
            let foundExisting = false;

            if (aggDocSnap.exists()) {
                const aggData = aggDocSnap.data();
                if (aggData && aggData.studentsMap) {
                    existingRecordsMap = aggData.studentsMap;
                    foundExisting = true;
                    if (typeof aggData.canteenMealsCount === 'number') {
                        setCanteenSyncedMeals(aggData.canteenMealsCount);
                    }
                }
            }

            if (!foundExisting) {
                const attendanceQuery = query(
                    collection(firestore, 'attendance'),
                    where('schoolId', '==', schoolId),
                    where('classId', '==', selectedClassId),
                    where('date', '==', startOfDay(selectedDate))
                );
                const attendanceSnapshot = await getDocs(attendanceQuery);
                const existingDocs = attendanceSnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter((r: any) => r.isArchived !== true) as AttendanceRecord[];

                if (existingDocs.length > 0) {
                    foundExisting = true;
                    existingDocs.forEach((r: any) => {
                        if (r.studentId) {
                            existingRecordsMap[r.studentId] = {
                                status: r.status,
                                notes: r.notes || ''
                            };
                        }
                    });
                }
            }

            // Check if there is an in-progress local session draft for this class & date
            const draftKey = `attendance_draft_${schoolId}_${selectedClassId}_${dateStr}`;
            let draftRecordsMap: Record<string, { status: string; notes?: string }> | null = null;
            try {
                if (typeof window !== 'undefined') {
                    const savedDraft = sessionStorage.getItem(draftKey);
                    if (savedDraft) {
                        draftRecordsMap = JSON.parse(savedDraft);
                    }
                }
            } catch (e) {
                console.error("Failed to read draft from sessionStorage", e);
            }

            setHasExistingRecords(foundExisting);

            const formRecords = studentList.map(student => {
                const savedStatus = draftRecordsMap?.[student.uid]?.status || existingRecordsMap[student.uid]?.status || 'Present';
                const savedNotes = draftRecordsMap?.[student.uid]?.notes ?? existingRecordsMap[student.uid]?.notes ?? '';
                const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
                
                return {
                    id: undefined,
                    studentId: student.uid,
                    studentName: studentName,
                    classId: selectedClassId,
                    status: savedStatus as "Present" | "Absent" | "Late" | "Excused",
                    notes: savedNotes,
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
            if (role?.toLowerCase() === 'teacher') {
                const isAuthorized = propClassId ? true : visibleClasses.some((c: any) => c.id === selectedClassId);
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

        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        if (!isOnline || (typeof navigator !== 'undefined' && !navigator.onLine)) {
            saveOfflineAttendance({
                schoolId,
                classId: selectedClassId,
                dateStr,
                records: data.records.map(r => ({
                    studentId: r.studentId,
                    studentName: r.studentName,
                    status: r.status,
                    notes: r.notes
                }))
            });
            setIsLoading(false);
            setBillingProgress(null);
            return;
        }

        setIsLoading(true);
        setBillingProgress("Saving attendance...");
        
        try {
            const batch = writeBatch(firestore);
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            
            // 1. Prepare aggregated metrics & student map
            const studentsMap: Record<string, any> = {};
            let presentCount = 0;
            let absentCount = 0;
            let lateCount = 0;
            let excusedCount = 0;
            let canteenMealsCount = 0;

            data.records.forEach(record => {
                const student = students.find(s => s.uid === record.studentId);
                const isPresentOrLate = record.status === 'Present' || record.status === 'Late';
                const isCanteenEligible = isPresentOrLate && (student?.usesCanteen !== false);

                if (record.status === 'Present') presentCount++;
                else if (record.status === 'Absent') absentCount++;
                else if (record.status === 'Late') lateCount++;
                else if (record.status === 'Excused') excusedCount++;

                if (isCanteenEligible) canteenMealsCount++;

                studentsMap[record.studentId] = {
                    studentId: record.studentId,
                    studentName: record.studentName,
                    status: record.status,
                    notes: record.notes || '',
                    usesBusService: String(student?.usesBusService || false),
                    usesCanteen: String(student?.usesCanteen !== false),
                    canteenEligible: isCanteenEligible
                };

                // Dual-write individual document for backward compatibility with existing reporting/parent portals
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

            // 2. Primary aggregated attendance document: attendance/${schoolId}_${classId}_${dateStr}
            const aggDocId = `${schoolId}_${selectedClassId}_${dateStr}`;
            const aggDocRef = doc(firestore, 'attendance', aggDocId);
            const className = visibleClasses?.find((c: any) => c.id === selectedClassId)?.name || selectedClassId;

            batch.set(aggDocRef, {
                id: aggDocId,
                schoolId,
                classId: selectedClassId,
                className,
                date: startOfDay(selectedDate),
                dateStr,
                totalStudents: data.records.length,
                presentCount,
                absentCount,
                lateCount,
                excusedCount,
                canteenMealsCount,
                studentsMap,
                updatedAt: serverTimestamp(),
                updatedBy: user?.uid
            }, { merge: true });

            // 3. Centralized Canteen Headcount Handoff: canteen_headcounts/${schoolId}_${dateStr}
            const canteenDocId = `${schoolId}_${dateStr}`;
            const canteenDocRef = doc(firestore, 'canteen_headcounts', canteenDocId);
            batch.set(canteenDocRef, {
                schoolId,
                date: dateStr,
                updatedAt: serverTimestamp(),
                [`classes.${selectedClassId}`]: {
                    classId: selectedClassId,
                    className,
                    totalEnrolled: data.records.length,
                    presentCount: presentCount + lateCount,
                    canteenEligibleCount: canteenMealsCount,
                    updatedBy: user?.uid || 'teacher',
                    updatedAt: new Date()
                }
            }, { merge: true });

            await batch.commit();
            setHasExistingRecords(true);
            setCanteenSyncedMeals(canteenMealsCount);
            setLastSavedTime(format(new Date(), 'h:mm a'));

            // Clear in-progress session draft on successful commit
            try {
                if (typeof window !== 'undefined') {
                    const draftKey = `attendance_draft_${schoolId}_${selectedClassId}_${dateStr}`;
                    sessionStorage.removeItem(draftKey);
                }
            } catch (e) {
                console.error("Failed to remove draft from sessionStorage", e);
            }

            // Trigger gamification badge updates (0 extra reads)
            data.records.forEach(record => {
                if (record.status === 'Present') {
                    triggerStudentBadgeEvent(firestore, record.studentId, { type: 'ATTENDANCE_PRESENT' });
                } else if (record.status === 'Absent' || record.status === 'Late') {
                    triggerStudentBadgeEvent(firestore, record.studentId, { type: 'ATTENDANCE_TARDY' });
                }
            });

            try {
                await logAuditEvent({
                    firestore,
                    schoolId,
                    userName: user?.displayName || user?.email || 'Staff Member',
                    action: 'STUDENT_ATTENDANCE_TAKEN',
                    details: `Class: ${className} | Date: ${dateStr} | Summary - Present: ${presentCount}, Absent: ${absentCount}, Late: ${lateCount}, Excused: ${excusedCount} | Canteen Meals: ${canteenMealsCount}`,
                    userId: user?.uid
                });
            } catch (auditErr) {
                console.error("Failed to log attendance audit event:", auditErr);
            }

            // Notify parents via Push asynchronously
            const gradedStudentIds = data.records.map(r => r.studentId);
            notifyParents(
                gradedStudentIds,
                "Daily Attendance Recorded 📅",
                "Your child's attendance for today has been updated. Tap to view details.",
                "/dashboard/my-attendance"
            ).catch(err => console.error("Notification failed:", err));

            // --- ABSENCE NOTIFICATION QUEUE & DEDUPLICATED WHATSAPP ALERTS ---
            const alertRecords = data.records.filter(r => r.status === 'Absent' || r.status === 'Late');
            
            if (alertRecords.length > 0) {
                const alertedStudentIds = alertRecords.map(r => r.studentId);
                
                // Chunk IDs into groups of 30 to respect Firestore query limits
                const chunks: string[][] = [];
                for (let i = 0; i < alertedStudentIds.length; i += 30) {
                    chunks.push(alertedStudentIds.slice(i, i + 30));
                }

                // Execute queries in parallel to find parents
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

                // Deduplicated queue write & WhatsApp dispatch
                for (const alert of alertRecords) {
                    const queueDocId = `absent_${schoolId}_${alert.studentId}_${dateStr}`;
                    const queueDocRef = doc(firestore, 'notification_queue', queueDocId);
                    
                    try {
                        const existingQueueDoc = await getDoc(queueDocRef);
                        const alreadyAlerted = existingQueueDoc.exists();

                        // Find parent contact
                        let matchedParentId: string | null = null;
                        let matchedParentPhone: string | null = null;
                        for (const [parentId, parentData] of parentsMap.entries()) {
                            if (parentData.studentIds?.includes(alert.studentId)) {
                                matchedParentId = parentId;
                                matchedParentPhone = parentData.phone || null;
                                break;
                            }
                        }

                        // Write/upsert to notification_queue
                        await setDoc(queueDocRef, {
                            schoolId,
                            date: dateStr,
                            studentId: alert.studentId,
                            studentName: alert.studentName,
                            classId: selectedClassId,
                            className,
                            status: alert.status,
                            queueStatus: alreadyAlerted ? (existingQueueDoc.data()?.queueStatus || "sent") : "pending",
                            parentId: matchedParentId,
                            parentContact: matchedParentPhone,
                            type: "ABSENCE_ALERT",
                            createdAt: serverTimestamp(),
                            queuedBy: user?.uid || 'teacher'
                        }, { merge: true });

                        // Send WhatsApp only if NOT already alerted today (Duplicate prevention)
                        if (!alreadyAlerted && matchedParentPhone) {
                            const timeStr = format(new Date(), 'h:mm a');
                            const message = alert.status === 'Absent' 
                                ? `🚨 *GAM Edu Alert*\n\nDear Parent, please be informed that your ward, *${alert.studentName}*, was marked *ABSENT* today at ${timeStr}. Please contact the school if you are unaware of this.`
                                : `⚠️ *GAM Edu Alert*\n\nDear Parent, please be informed that your ward, *${alert.studentName}*, arrived *LATE* to school today at ${timeStr}.`;

                            sendSchoolWhatsApp(schoolId, matchedParentPhone, message)
                                .then(async () => {
                                    await setDoc(queueDocRef, { queueStatus: "sent", sentAt: serverTimestamp() }, { merge: true });
                                })
                                .catch(async (err) => {
                                    console.error("WhatsApp Send Failed:", err);
                                    await setDoc(queueDocRef, { queueStatus: "failed", error: String(err) }, { merge: true });
                                });
                        }
                    } catch (queueErr) {
                        console.error("Error writing to notification_queue:", queueErr);
                    }
                }
            }

            toast({ title: 'Attendance Saved!', description: 'Now processing financial records...' });

            const studentsToBill = data.records
                .filter(r => r.status === 'Present' || r.status === 'Late')
                .map(r => students.find(s => s.uid === r.studentId))
                .filter((s): s is Student => s !== undefined);

            if (studentsToBill.length > 0) {
                try {
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
                        title: 'Attendance Saved 📅',
                        description: `Attendance updated successfully. ${billingResult.successful} billed for daily services. Canteen headcount synced (${canteenMealsCount} meals).`
                    });
                } catch (billingErr: any) {
                    console.error("Billing post-processing failed:", billingErr);
                    toast({
                        title: 'Attendance Saved 📅',
                        description: `Student attendance status updated. Canteen headcount synced (${canteenMealsCount} meals).`
                    });
                }
            } else {
                toast({ 
                    title: 'Attendance Saved 📅', 
                    description: `Attendance status updated successfully. Canteen headcount synced (${canteenMealsCount} meals).` 
                });
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsLoading(false);
            setBillingProgress(null);
        }
    }

    const handlePreSubmit = (data: AttendanceFormData) => {
        setPendingData(data);
        setIsConfirmOpen(true);
    };

    const handleConfirmSubmit = () => {
        if (pendingData) {
            onSubmit(pendingData);
            setIsConfirmOpen(false);
            setPendingData(null);
        }
    };

    const records = form.watch("records") || [];
    
    // Live summary counts
    const totalEnrolledCount = students.length;
    const presentCount = records.filter(r => r.status === 'Present').length;
    const lateCount = records.filter(r => r.status === 'Late').length;
    const absentCount = records.filter(r => r.status === 'Absent').length;
    const excusedCount = records.filter(r => r.status === 'Excused').length;
    const unmarkedCount = records.filter(r => !r.status).length;
    const totalPresentAndLate = presentCount + lateCount;

    // Save in-progress draft to sessionStorage whenever records change
    useEffect(() => {
        if (!selectedClassId || !selectedDate || !schoolId || !studentsLoaded || records.length === 0) return;
        try {
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            const draftKey = `attendance_draft_${schoolId}_${selectedClassId}_${dateStr}`;
            const draftMap: Record<string, { status: string; notes?: string }> = {};
            records.forEach(r => {
                draftMap[r.studentId] = {
                    status: r.status,
                    notes: r.notes || ''
                };
            });
            sessionStorage.setItem(draftKey, JSON.stringify(draftMap));
        } catch (e) {
            // ignore sessionStorage quota or private browsing errors
        }
    }, [records, selectedClassId, selectedDate, schoolId, studentsLoaded]);

    const handleMarkAllPresent = useCallback(() => {
        if (isLocked) return;
        const currentRecords = form.getValues('records') || [];
        const updated = currentRecords.map(r => ({
            ...r,
            status: 'Present' as const
        }));
        replace(updated);
        toast({
            title: "All Marked Present ✅",
            description: `Set all ${currentRecords.length} active students to 'Present'.`
        });
    }, [isLocked, form, replace, toast]);

    const handleResetAll = useCallback(() => {
        if (isLocked) return;
        const currentRecords = form.getValues('records') || [];
        const updated = currentRecords.map(r => ({
            ...r,
            status: 'Present' as const,
            notes: ''
        }));
        replace(updated);
        toast({
            title: "Roster Reset",
            description: "Reset status for all students."
        });
    }, [isLocked, form, replace, toast]);

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
                                    Attendance has already been marked for this date. Standard teachers are locked from making modifications after 8 days. Please contact the Administrator or the Director to request changes.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
                            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-amber-800">Overwrite Mode Enabled</h4>
                                <p className="text-xs text-amber-650 mt-0.5">
                                    Attendance has already been marked for this date. {role?.toLowerCase() === 'teacher' ? 'As a Teacher, you are allowed an 8-day grace period to correct/overwrite your entries.' : 'As an Administrator or Director, you are permitted to overwrite the existing entries.'}
                                </p>
                            </div>
                        </div>
                    )
                )}

                {studentsLoaded && (
                    <div className="space-y-4 mb-6 flex-shrink-0">
                        {/* Live Summary Counter Widget */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Enrolled</span>
                                    <span className="text-2xl font-black text-slate-800">{totalEnrolledCount}</span>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-slate-200/60 flex items-center justify-center text-slate-600 font-black">
                                    {totalEnrolledCount}
                                </div>
                            </div>
                            <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-2xl p-3.5 flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">Present / Late</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-2xl font-black text-emerald-700">{totalPresentAndLate}</span>
                                        {lateCount > 0 && <span className="text-xs font-semibold text-amber-600">({lateCount} late)</span>}
                                    </div>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                                    <Check className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="bg-rose-50/60 border border-rose-200/70 rounded-2xl p-3.5 flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block">Absent</span>
                                    <span className="text-2xl font-black text-rose-700">{absentCount}</span>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 font-bold">
                                    <X className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="bg-sky-50/60 border border-sky-200/70 rounded-2xl p-3.5 flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block">Unmarked</span>
                                    <span className="text-2xl font-black text-sky-700">{unmarkedCount}</span>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 font-bold">
                                    <Clock className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        {/* Operational Bar: Search, Mark All Present Toggle, and Canteen Synced Badge */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-slate-200/70 shadow-sm">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                <Input 
                                    placeholder="Filter student roster by name..." 
                                    className="pl-10 pr-4 bg-slate-50/50 border-slate-200/80 rounded-xl h-10 shadow-none focus-visible:ring-teal-500 text-xs" 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                {canteenSyncedMeals !== null && (
                                    <Badge className="bg-orange-100/80 text-orange-800 border-orange-200 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-none">
                                        <UtensilsCrossed className="h-3.5 w-3.5 text-orange-600" />
                                        <span>Canteen Headcount Synced ({canteenSyncedMeals} Meals)</span>
                                    </Badge>
                                )}
                                
                                <Button
                                    type="button"
                                    onClick={handleMarkAllPresent}
                                    disabled={isLocked}
                                    variant="outline"
                                    className="h-10 px-4 rounded-xl border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                                >
                                    <CheckCheck className="h-4 w-4 text-emerald-600" />
                                    Mark All Present
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleResetAll}
                                    disabled={isLocked}
                                    variant="ghost"
                                    className="h-10 px-3 rounded-xl text-slate-500 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5"
                                    title="Reset roll call"
                                >
                                    <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                                    Reset
                                </Button>
                            </div>
                        </div>
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
                        <form onSubmit={form.handleSubmit(handlePreSubmit)} className="flex flex-col flex-1 relative">
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
                                onClick={form.handleSubmit(handlePreSubmit)}
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
                {isConfirmOpen && (
                    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                        <AlertDialogContent className="rounded-2xl max-w-md border border-slate-150 bg-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-slate-800 font-extrabold text-lg flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-teal-600" />
                                    Confirm Attendance Submission
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-500 text-sm leading-relaxed mt-2">
                                    You are about to record student attendance and process daily billing for canteen and bus services.
                                    <br /><br />
                                    <span className="font-semibold text-rose-600">Please review carefully:</span> You cannot modify or undo this sheet after <span className="font-bold">8 days</span>. Only a Director or Administrator can request modifications after the grace period.
                                    <br /><br />
                                    Are you sure you want to proceed and save this register?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
                                <AlertDialogCancel className="rounded-xl font-bold border-slate-200">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={handleConfirmSubmit}
                                    className="rounded-xl font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-md hover:shadow-lg active:scale-95 border-0"
                                >
                                    Confirm & Submit
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </CardContent>
        </Card>
    );
}
