
'use client';

import { Suspense, useState, useMemo } from 'react';
import { useUser, useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { Student, AttendanceRecord, BehavioralRecord } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, CalendarCheck, ShieldAlert, BadgeInfo, CheckCircle2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useRole } from '@/context/role-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StudentDisplay } from '@/components/student-display';

function AttendanceHistory({ studentId }: { studentId: string }) {
    const firestore = useFirestore();
    const { role } = useRole();
    const { user } = useUser();
    
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfDay(new Date(new Date().setDate(new Date().getDate() - 30))),
        to: endOfDay(new Date()),
    });

    const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role || '');
    const isTargetStudent = user?.uid === studentId;
    const hasPermission = isStaff || isTargetStudent;

    const attendanceQuery = useMemoFirebase(() => {
        if (!firestore || !dateRange?.from || !studentId || !hasPermission) return null;
        
        const start = Timestamp.fromDate(startOfDay(dateRange.from));
        const end = dateRange.to ? Timestamp.fromDate(endOfDay(dateRange.to)) : Timestamp.fromDate(endOfDay(dateRange.from));

        return query(
            collection(firestore, 'attendance'),
            where('studentId', '==', studentId),
            where('date', '>=', start),
            where('date', '<=', end)
        );
    }, [firestore, studentId, dateRange, hasPermission]);
    
    const { data: records, isLoading } = useCollection<AttendanceRecord>(attendanceQuery);

    const getStatusVariant = (status: AttendanceRecord['status']) => {
        switch (status) {
            case 'Present': return 'default';
            case 'Late': return 'secondary';
            case 'Absent': return 'destructive';
            default: return 'outline';
        }
    };
    
    if (!hasPermission) return null;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn("w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
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
            {isLoading ? <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div> : (
                <Table>
                    <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Notes</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {records?.sort((a,b) => b.date.toDate().getTime() - a.date.toDate().getTime()).map(rec => (
                            <TableRow key={rec.id}>
                                <TableCell>{format(rec.date.toDate(), 'PPP')}</TableCell>
                                <TableCell><Badge variant={getStatusVariant(rec.status)}>{rec.status}</Badge></TableCell>
                                <TableCell>{rec.notes || '-'}</TableCell>
                            </TableRow>
                        ))}
                        {(!records || records.length === 0) && (
                            <TableRow><TableCell colSpan={3} className="text-center p-4 text-muted-foreground italic">No attendance records found for this period.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}

function BehavioralHistory({ studentId }: { studentId: string }) {
    const firestore = useFirestore();
    const { role } = useRole();
    const { user } = useUser();

    const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role || '');
    const isTargetStudent = user?.uid === studentId;
    const hasPermission = isStaff || isTargetStudent;

    const recordsQuery = useMemoFirebase(() => {
        if (!firestore || !studentId || !hasPermission) return null;
        return query(
            collection(firestore, 'behavioral_records'), 
            where('studentId', '==', studentId), 
            orderBy('date', 'desc')
        );
    }, [firestore, studentId, hasPermission]);
    const { data: records, isLoading } = useCollection<BehavioralRecord>(recordsQuery);

    const getIcon = (type: BehavioralRecord['incidentType']) => {
        switch(type) {
            case 'Positive Behavior': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'Infraction':
            case 'Disciplinary Action': return <ShieldAlert className="h-4 w-4 text-red-500" />;
            default: return <BadgeInfo className="h-4 w-4 text-slate-500"/>
        }
    };
    
    if (!hasPermission) return null;

    return (
        <div className="space-y-4">
             {isLoading ? <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div> : (
                <div className="space-y-3">
                    {records?.map(rec => (
                        <div key={rec.id} className="border p-4 rounded-lg bg-white shadow-sm">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold flex items-center gap-2">{getIcon(rec.incidentType)} {rec.incidentType}</p>
                                <p className="text-xs text-muted-foreground">{format(rec.date.toDate(), 'PPP')}</p>
                            </div>
                            <p className="text-sm mt-2">{rec.description}</p>
                            {rec.actionTaken && <p className="text-xs text-blue-600 mt-2 bg-blue-50 p-2 rounded">Action Taken: {rec.actionTaken}</p>}
                        </div>
                    ))}
                    {(!records || records.length === 0) && <p className="text-center text-muted-foreground p-8 italic">No behavioral records found.</p>}
                </div>
             )}
        </div>
    );
}

function StudentDetailView({ student }: { student: Student }) {
    const studentId = student.id || student.uid;

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0">
                <CardTitle className="text-xl">Information Hub: {student.firstName} {student.lastName}</CardTitle>
                <CardDescription>Class ID: {student.classId}</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <Tabs defaultValue="attendance">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="attendance"><CalendarCheck className="mr-2 h-4 w-4" />Attendance Log</TabsTrigger>
                        <TabsTrigger value="behavioral"><ShieldAlert className="mr-2 h-4 w-4" />Behavioral Log</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="attendance" className="mt-4">
                        <AttendanceHistory studentId={studentId} />
                    </TabsContent>

                    <TabsContent value="behavioral" className="mt-4">
                       <BehavioralHistory studentId={studentId} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
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
            <div className="flex items-center p-4 border-b">
                <Loader2 className="h-5 w-5 animate-spin"/>
                <span className="ml-2 text-muted-foreground">Loading child...</span>
            </div>
        );
    }
    
    if (!student) {
        return (
             <div className="p-4 border-b text-red-500 bg-red-50 rounded-md my-2">
                <ShieldAlert className="h-4 w-4 inline mr-2" />
                <span>Student record ({studentUid}) could not be found.</span>
            </div>
        );
    }

    return (
        <AccordionItem value={studentUid} key={studentUid} className="border rounded-lg mb-2 px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline">
                <StudentDisplay student={student} variant="list" showAvatar/>
            </AccordionTrigger>
            <AccordionContent className="pt-2 border-t">
                <StudentDetailView student={student} />
            </AccordionContent>
        </AccordionItem>
    );
}

function MyChildrenPageContent() {
    const { user, isUserLoading } = useUser();
    const { role, isRoleLoading } = useRole();
    const firestore = useFirestore();

    const parentDocRef = useMemoFirebase(() => (role === 'Parent' && user && firestore) ? doc(firestore, 'parents', user.uid) : null, [firestore, user?.uid, role]);
    const { data: parentData, isLoading: isParentLoading } = useDoc<{ studentIds?: string[] }>(parentDocRef);
    
    const { data: studentForStudentRole, isLoading: isStudentLoading } = useCollection<Student>(
        useMemoFirebase(() => (role === 'Student' && user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user?.uid, role])
    );
    
    const studentIds = useMemo(() => parentData?.studentIds || [], [parentData?.studentIds?.join(',')]);
    
    const isLoading = isUserLoading || isRoleLoading || isParentLoading || isStudentLoading;

    if (isLoading) {
        return (
          <Card className="min-h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </Card>
        );
    }

    if (role !== 'Parent' && role !== 'Student') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>This page is for parents and students only.</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    if (role === 'Student') {
        const student = studentForStudentRole?.[0];
        if (!student) {
            return (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        Your student profile could not be loaded.
                    </CardContent>
                </Card>
            );
        }
        return <StudentDetailView student={student} />
    }

    if (role === 'Parent') {
        if (!studentIds || studentIds.length === 0) {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold"><User className="text-primary" /> My Children</CardTitle>
                        <CardDescription>Select a child to view their academic and behavioral logs.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        No children linked to your account.
                    </CardContent>
                </Card>
            );
        }
        
        return (
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold"><User className="text-primary" /> My Children</CardTitle>
                    <CardDescription>Select a child to view their academic and behavioral logs.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible defaultValue={studentIds[0]}>
                        {studentIds.map(uid => (
                            <StudentAccordionItem key={uid} studentUid={uid} />
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        );
    }

    // Default fallback
    return <p>An unexpected error occurred.</p>;
}

export default function MyChildrenPage() {
    return (
      <Suspense fallback={<Loader2 className="mx-auto my-8 h-16 w-16 animate-spin" />}>
        <MyChildrenPageContent />
      </Suspense>
    );
}
