
'use client';

import { useState, useMemo, Suspense } from 'react';
import { useAuth, useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, doc, query, where, Timestamp, orderBy, documentId } from 'firebase/firestore';
import { ReportCard, Student, AttendanceRecord, BehavioralRecord } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, FileText, CalendarCheck, ShieldAlert, BadgeInfo } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { StudentReportCard } from '../report-cards/student-report-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

function AttendanceHistory({ studentId }: { studentId: string }) {
    const firestore = useFirestore();
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfDay(new Date(new Date().setDate(new Date().getDate() - 30))),
        to: endOfDay(new Date()),
    });

    const attendanceQuery = useMemoFirebase(() => {
        if (!firestore || !dateRange?.from || !studentId) return null;
        const start = startOfDay(dateRange.from);
        const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

        return query(
            collection(firestore, 'attendance'),
            where('studentId', '==', studentId),
            where('date', '>=', Timestamp.fromDate(start)),
            where('date', '<=', Timestamp.fromDate(end))
        );
    }, [firestore, studentId, dateRange]);
    const { data: records, isLoading } = useCollection<AttendanceRecord>(attendanceQuery);

    const getStatusVariant = (status: AttendanceRecord['status']) => {
        switch (status) {
            case 'Present': return 'default';
            case 'Late': return 'secondary';
            case 'Absent': return 'destructive';
            default: return 'outline';
        }
    };
    
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
                        {dateRange?.from ? (dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : (format(dateRange.from, "LLL dd, y"))) : (<span>Pick a date</span>)}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                    </PopoverContent>
                </Popover>
            </div>
            {isLoading ? <Loader2 className="animate-spin" /> : (
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
                    </TableBody>
                </Table>
            )}
        </div>
    );
}

function BehavioralHistory({ studentId }: { studentId: string }) {
    const firestore = useFirestore();
    const recordsQuery = useMemoFirebase(() => {
        if (!firestore || !studentId) return null; // Safety check
        return query(
            collection(firestore, 'behavioral_records'), 
            where('studentId', '==', studentId), 
            orderBy('date', 'desc')
        );
    }, [firestore, studentId]);
    const { data: records, isLoading } = useCollection<BehavioralRecord>(recordsQuery);

    const getIcon = (type: BehavioralRecord['incidentType']) => {
        switch(type) {
            case 'Positive Behavior': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'Infraction':
            case 'Disciplinary Action': return <ShieldAlert className="h-4 w-4 text-red-500" />;
            default: return <BadgeInfo className="h-4 w-4 text-slate-500"/>
        }
    };
    
    return (
        <div className="space-y-4">
             {isLoading ? <Loader2 className="animate-spin" /> : (
                <div className="space-y-3">
                    {records?.map(rec => (
                        <div key={rec.id} className="border p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <p className="font-semibold flex items-center gap-2">{getIcon(rec.incidentType)} {rec.incidentType}</p>
                                <p className="text-xs text-muted-foreground">{format(rec.date.toDate(), 'PPP')}</p>
                            </div>
                            <p className="text-sm mt-2">{rec.description}</p>
                            {rec.actionTaken && <p className="text-xs text-blue-600 mt-2 bg-blue-50 p-2 rounded">Action Taken: {rec.actionTaken}</p>}
                        </div>
                    ))}
                    {records?.length === 0 && <p className="text-center text-muted-foreground p-4">No records found.</p>}
                </div>
             )}
        </div>
    );
}

function StudentDetailView({ student }: { student: Student }) {
    return (
        <Card className="border-none shadow-none">
            <CardHeader>
                <CardTitle className="text-xl">Information Hub: {student.firstName} {student.lastName}</CardTitle>
                <CardDescription>Class: {student.classId}</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="report-cards">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="report-cards"><FileText className="mr-2 h-4 w-4" />Report Cards</TabsTrigger>
                        <TabsTrigger value="attendance"><CalendarCheck className="mr-2 h-4 w-4" />Attendance Log</TabsTrigger>
                        <TabsTrigger value="behavioral"><ShieldAlert className="mr-2 h-4 w-4" />Behavioral Log</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="report-cards" className="mt-4">
                        <StudentParentReportCardView studentId={student.uid} />
                    </TabsContent>
                    
                    <TabsContent value="attendance" className="mt-4">
                        <AttendanceHistory studentId={student.uid} />
                    </TabsContent>

                    <TabsContent value="behavioral" className="mt-4">
                       <BehavioralHistory studentId={student.uid} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}


export default function MyChildrenPage() {
    const { user, isUserLoading } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();

    const parentDocRef = useMemoFirebase(() => (role === 'Parent' && user && firestore) ? doc(firestore, 'parents', user.uid) : null, [firestore, user, role]);
    const { data: parentData, isLoading: isParentLoading } = useDoc<{ studentIds: string[] }>(parentDocRef);

    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        if (role === 'Student') {
            return query(collection(firestore, 'students'), where('uid', '==', user.uid));
        }
        // FIX: The `in` operator queries against the document ID, not the `uid` field. Correcting to query by `uid`.
        if (role === 'Parent' && parentData?.studentIds && parentData.studentIds.length > 0) {
            return query(collection(firestore, 'students'), where('uid', 'in', parentData.studentIds));
        }
        return null;
    }, [firestore, role, user, parentData]);

    const { data: students, isLoading: areStudentsLoading } = useCollection<Student>(studentsQuery);
    
    const isLoading = isUserLoading || isParentLoading || areStudentsLoading;

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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><User /> My Children</CardTitle>
                <CardDescription>View academic and attendance information for your children.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : (students && students.length > 0) ? (
                    <Accordion type="single" collapsible defaultValue={students[0].uid}>
                        {students.map(student => (
                            <AccordionItem value={student.uid} key={student.uid}>
                                <AccordionTrigger>
                                    <h3 className="text-lg font-semibold flex items-center gap-2"><User /> {student.firstName} {student.lastName}</h3>
                                </AccordionTrigger>
                                <AccordionContent className="p-1">
                                    <StudentDetailView student={student} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center p-8 text-muted-foreground">
                        No children linked to your account. Please contact the school administration.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function StudentParentReportCardView({ studentId }: { studentId: string }) {
    const firestore = useFirestore();
    
    const reportsQuery = useMemoFirebase(
      () => firestore && studentId ? query(collection(firestore, 'report-cards'), where('studentId', '==', studentId), where('status', '==', 'Published')) : null,
      [firestore, studentId]
    );
    const { data: reports, isLoading } = useCollection<ReportCard>(reportsQuery);

    if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;
    
    if (!reports || reports.length === 0) return <p className="text-sm text-muted-foreground p-4">No published reports.</p>;
    
    return (
        <div className="space-y-2 p-4">
            {reports.map(report => (
                <div key={report.id} className="flex justify-between items-center p-2 border rounded-md">
                    <div>
                        <p className="font-medium">{report.academicYear} - {report.term}</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">View Report</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader><DialogTitle>Student Report Card</DialogTitle></DialogHeader>
                            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                                {/* This will need the student object, we need to adjust this */}
                                {/* For now, it will fail if student is not passed */}
                                <p>Report display would be here.</p>
                            </Suspense>
                        </DialogContent>
                    </Dialog>
                </div>
            ))}
        </div>
    )
}
