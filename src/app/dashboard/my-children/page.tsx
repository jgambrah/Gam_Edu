'use client';

import { Suspense, useState, useMemo } from 'react';
import { useUser, useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { Student, AttendanceRecord, BehavioralRecord } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, CalendarCheck, ShieldAlert, BadgeInfo, CheckCircle2, Users, Calendar as CalendarIcon } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useRole } from '@/context/role-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { format, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StudentDisplay } from '@/components/student-display';

const toDateSafe = (d: any): Date => {
  if (!d) return new Date();
  if (typeof d.toDate === 'function') return d.toDate();
  if (d instanceof Date) return d;
  if (d.seconds) return new Date(d.seconds * 1000);
  return new Date(d);
};
import { useCurrentSchool } from '@/hooks/use-current-school';

function AttendanceHistory({ studentId }: { studentId: string }) {
    const firestore = useFirestore();
    const { role, profile, loading: isRoleLoading } = useRole();
    const { user } = useUser();
    const { schoolId } = useCurrentSchool();
    
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfDay(new Date(new Date().setDate(new Date().getDate() - 30))),
        to: endOfDay(new Date()),
    });

    const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role || '');
    const isTargetStudent = user?.uid === studentId;
    const isParent = role === 'Parent';
    
    const parentStudentIds = useMemo(() => {
        return (
            profile?.studentIds || 
            profile?.student_ids || 
            profile?.students || 
            profile?.linkedStudentIds ||
            []
        );
    }, [profile]);

    const hasPermission = isStaff || isTargetStudent || (isParent && parentStudentIds.includes(studentId));

    const attendanceQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !studentId || !hasPermission || isRoleLoading) return null;
        
        // Remove complex filters from the DB query to avoid index errors for now
        return query(
            collection(firestore, 'attendance'),
            where('schoolId', '==', schoolId),
            where('studentId', '==', studentId)
        );
    }, [firestore, schoolId, studentId, hasPermission, isRoleLoading]);
    
    const { data: rawRecords, isLoading } = useCollection<AttendanceRecord>(attendanceQuery);

    const filteredAndSortedRecords = useMemo(() => {
        if (!rawRecords) return [];
        
        let filtered = [...rawRecords];
        
        if (dateRange?.from) {
            const start = startOfDay(dateRange.from).getTime();
            const end = dateRange.to ? endOfDay(dateRange.to).getTime() : endOfDay(dateRange.from).getTime();
            
            filtered = filtered.filter(r => {
                const d = r.date?.toDate ? r.date.toDate().getTime() : 0;
                return d >= start && d <= end;
            });
        }

        return filtered.sort((a,b) => {
            const da = a.date?.toDate ? a.date.toDate().getTime() : 0;
            const db = b.date?.toDate ? b.date.toDate().getTime() : 0;
            return db - da;
        });
    }, [rawRecords, dateRange]);

    const getStatusVariant = (status: AttendanceRecord['status']) => {
        switch (status) {
            case 'Present': return 'default';
            case 'Late': return 'secondary';
            case 'Absent': return 'destructive';
            default: return 'outline';
        }
    };
    
    if (!hasPermission && !isRoleLoading) return null;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn("w-full sm:w-[300px] justify-start text-left font-normal border-2", !dateRange && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : (format(dateRange.from, "LLL dd, y"))) : (<span>Filter by Date</span>)}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                    </PopoverContent>
                </Popover>
            </div>
            {isLoading ? <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div> : (
                <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Notes</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedRecords.map(rec => (
                                <TableRow key={rec.id}>
                                    <TableCell className="font-medium">{rec.date?.toDate ? format(rec.date.toDate(), 'PPP') : 'N/A'}</TableCell>
                                    <TableCell><Badge variant={getStatusVariant(rec.status)}>{rec.status}</Badge></TableCell>
                                    <TableCell className="text-slate-500 text-xs italic">{rec.notes || '-'}</TableCell>
                                </TableRow>
                            ))}
                            {filteredAndSortedRecords.length === 0 && (
                                <TableRow><TableCell colSpan={3} className="text-center py-12 text-muted-foreground italic">No attendance records found for this period.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}

function BehavioralHistory({ studentId }: { studentId: string }) {
    const firestore = useFirestore();
    const { role, profile, loading: isRoleLoading } = useRole();
    const { user } = useUser();
    const { schoolId } = useCurrentSchool();

    const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role || '');
    const isTargetStudent = user?.uid === studentId;
    const isParent = role === 'Parent';

    const parentStudentIds = useMemo(() => {
        return (
            profile?.studentIds || 
            profile?.student_ids || 
            profile?.students || 
            profile?.linkedStudentIds ||
            []
        );
    }, [profile]);

    const hasPermission = isStaff || isTargetStudent || (isParent && parentStudentIds.includes(studentId));

    const recordsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !studentId || !hasPermission || isRoleLoading) return null;
        return query(
            collection(firestore, 'behavioral_records'), 
            where('schoolId', '==', schoolId),
            where('studentId', '==', studentId), 
            orderBy('date', 'desc')
        );
    }, [firestore, schoolId, studentId, hasPermission, isRoleLoading]);
    const { data: records, isLoading } = useCollection<BehavioralRecord>(recordsQuery);

    const getIcon = (type: BehavioralRecord['incidentType']) => {
        switch(type) {
            case 'Positive Behavior': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'Infraction':
            case 'Disciplinary Action': return <ShieldAlert className="h-4 w-4 text-red-500" />;
            default: return <BadgeInfo className="h-4 w-4 text-slate-500"/>
        }
    };
    
    if (!hasPermission && !isRoleLoading) return null;

    return (
        <div className="space-y-4">
             {isLoading ? <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div> : (
                <div className="space-y-3">
                    {records?.map(rec => (
                        <Card key={rec.id} className="border shadow-sm bg-white overflow-hidden">
                            <CardHeader className="bg-slate-50 py-3 flex flex-row justify-between items-center">
                                <div className="flex items-center gap-2">
                                    {getIcon(rec.incidentType)}
                                    <span className="font-bold text-slate-800 text-sm">{rec.incidentType}</span>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-slate-400">
                                    {rec.date ? format(toDateSafe(rec.date), 'PPP') : 'N/A'}
                                </span>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-sm text-slate-700 leading-relaxed">{rec.description}</p>
                                {rec.actionTaken && (
                                    <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 flex items-start gap-2">
                                        <BadgeInfo className="h-4 w-4 shrink-0 mt-0.5 text-blue-500"/>
                                        <p><strong>Action Taken:</strong> {rec.actionTaken}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    {(!records || records.length === 0) && (
                        <div className="text-center py-16 text-muted-foreground bg-slate-50 rounded-2xl border-2 border-dashed">
                            <p className="italic">No behavioral records logged for this child.</p>
                        </div>
                    )}
                </div>
             )}
        </div>
    );
}

function StudentDetailView({ student }: { student: Student }) {
    const studentId = student.id || student.uid;

    return (
        <div className="space-y-6">
            <Tabs defaultValue="attendance" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl">
                    <TabsTrigger value="attendance" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <CalendarCheck className="mr-2 h-4 w-4" /> Attendance Log
                    </TabsTrigger>
                    <TabsTrigger value="behavioral" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <ShieldAlert className="mr-2 h-4 w-4" /> Behavioral Log
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="attendance" className="mt-6">
                    <AttendanceHistory studentId={studentId} />
                </TabsContent>

                <TabsContent value="behavioral" className="mt-6">
                   <BehavioralHistory studentId={studentId} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function StudentAccordionItem({ studentUid }: { studentUid: string }) {
    const firestore = useFirestore();
    
    const studentDocRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'students', studentUid) : null,
        [firestore, studentUid]
    );
    
    const { data: student, isLoading } = useDoc<Student>(studentDocRef);

    if (isLoading) {
        return (
            <div className="flex items-center p-6 border-b">
                <Loader2 className="h-5 w-5 animate-spin text-primary"/>
                <span className="ml-3 text-sm font-medium text-slate-500">Synchronizing child profile...</span>
            </div>
        );
    }
    
    if (!student || student.enrollmentStatus === 'Inactive') {
        return null;
    }

    return (
        <AccordionItem value={studentUid} key={studentUid} className="border rounded-2xl mb-4 overflow-hidden shadow-sm bg-white">
            <AccordionTrigger className="hover:no-underline px-6 py-5 hover:bg-slate-50 transition-all">
                <StudentDisplay student={student} variant="list" showAvatar/>
            </AccordionTrigger>
            <AccordionContent className="p-6 bg-slate-50/30 border-t">
                <StudentDetailView student={student} />
            </AccordionContent>
        </AccordionItem>
    );
}

function MyChildrenPageContent() {
    const { user, isUserLoading } = useUser();
    const { role, profile, loading: isRoleLoading } = useRole();
    const firestore = useFirestore();

    const studentIds = useMemo(() => {
        return (
            profile?.studentIds || 
            profile?.student_ids || 
            profile?.students || 
            profile?.childrenIds || 
            profile?.linkedStudentIds || 
            []
        );
    }, [profile]);
    
    const { data: studentForStudentRole, isLoading: isStudentLoading } = useCollection<Student>(
        useMemoFirebase(() => (role === 'Student' && user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user?.uid, role])
    );
    
    const isLoading = isUserLoading || isRoleLoading || isStudentLoading;

    if (isLoading) {
        return (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        );
    }

    if (role !== 'Parent' && role !== 'Student') {
        return (
            <Card className="max-w-md mx-auto">
                <CardHeader className="text-center">
                    <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-2" />
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>This information is only available to parents and students.</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    if (role === 'Student') {
        const student = studentForStudentRole?.[0];
        if (!student) {
            return (
                <div className="p-12 text-center border-2 border-dashed rounded-3xl bg-slate-50">
                    <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Your student profile could not be loaded.</p>
                </div>
            );
        }
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white p-6 rounded-3xl border-2 border-indigo-50 shadow-xl">
                    <StudentDetailView student={student} />
                </div>
            </div>
        );
    }

    if (role === 'Parent') {
        if (!studentIds || studentIds.length === 0) {
            return (
                <div className="p-12 text-center border-2 border-dashed rounded-3xl bg-slate-50 max-w-2xl mx-auto mt-10">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-slate-800">No Children Linked</h3>
                    <p className="text-slate-500 mt-2">We couldn't find any students associated with your parent account.</p>
                    <p className="text-sm text-indigo-600 mt-4 font-bold">Please contact the school office to verify your account link.</p>
                </div>
            );
        }
        
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                        <Users className="text-indigo-600 h-8 w-8" /> My Children
                    </h1>
                    <p className="text-slate-500">Quick access to attendance and conduct reports.</p>
                </div>

                <Accordion type="single" collapsible defaultValue={studentIds[0]} className="w-full">
                    {studentIds.map((uid: string) => (
                        <StudentAccordionItem key={uid} studentUid={uid} />
                    ))}
                </Accordion>
            </div>
        );
    }

    return null;
}

export default function MyChildrenPage() {
    return (
      <div className="p-4 md:p-6 pb-20">
        <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
            <MyChildrenPageContent />
        </Suspense>
      </div>
    );
}
