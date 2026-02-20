
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { collection, query, where } from 'firebase/firestore'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Printer, BarChart as BarChartIcon, Calendar as CalendarIcon, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useCurrentSchool } from '@/hooks/use-current-school';

export default function AttendanceReportsPage() {
    const { role, loading: isRoleLoading } = useRole();
    const router = useRouter();
    const firestore = useFirestore();
    const { schoolId, loading: isSchoolLoading } = useCurrentSchool();

    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfDay(new Date(new Date().setDate(new Date().getDate() - 30))),
        to: endOfDay(new Date()),
    });
    const [selectedClassId, setSelectedClassId] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const isAdmin = ['Administrator', 'Director'].includes(role || '');
    const isTeacher = role === 'Teacher';
    const canAccess = !isRoleLoading && (isAdmin || isTeacher);

    useEffect(() => {
        if (!isRoleLoading && role === 'Student') {
            router.replace('/dashboard');
        }
    }, [role, isRoleLoading, router]);

    // 1. Fetch Classes (Guarded)
    const classesQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !canAccess) return null;
        return query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, canAccess]);
    const { data: classes, isLoading: isLoadingClasses } = useCollection(classesQuery);

    // 2. Fetch Attendance (Guarded)
    const attendanceQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !canAccess) return null;
        return query(collection(firestore, 'attendance'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, canAccess]);
    const { data: rawAttendance, isLoading: isLoadingAttendance } = useCollection(attendanceQuery);
    
    // 3. Fetch Students (Guarded)
    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !canAccess) return null;
        return query(collection(firestore, 'students'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, canAccess]);
    const { data: students, isLoading: isLoadingStudents } = useCollection(studentsQuery);

    const filteredData = useMemo(() => {
        if (!rawAttendance || !students || !classes || !dateRange?.from) return [];
        const studentMap = new Map(students.map(s => [s.id, s]));
        const classMap = new Map(classes.map(c => [c.id, c.name]));
        const fromStr = format(dateRange.from, 'yyyy-MM-dd');
        const toStr = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : fromStr;

        return rawAttendance
            .filter(record => {
                const recordDateObj = record.date.toDate ? record.date.toDate() : new Date(record.date);
                const recordDateStr = format(recordDateObj, 'yyyy-MM-dd');
                if (recordDateStr < fromStr || recordDateStr > toStr) return false;
                if (selectedClassId !== 'all' && record.classId !== selectedClassId) return false;
                if (selectedStatus !== 'all' && record.status !== selectedStatus) return false;
                return true;
            })
            .map(record => ({
                ...record,
                student: studentMap.get(record.studentId),
                className: classMap.get(record.classId) || 'Unknown Class'
            }))
            .sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));
    }, [rawAttendance, students, classes, dateRange, selectedClassId, selectedStatus]);

    const isLoading = isSchoolLoading || isRoleLoading || isLoadingClasses || isLoadingAttendance || isLoadingStudents;

    if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>;

    if (role === 'Student') {
        return (
            <div className="p-8 flex justify-center">
                <Card className="max-w-md w-full border-red-100 bg-red-50/50">
                    <CardHeader className="text-center">
                        <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4"><ShieldAlert className="h-8 w-8 text-red-600" /></div>
                        <CardTitle>Access Restricted</CardTitle>
                        <CardDescription>Attendance reports are for staff only.</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center"><Button asChild variant="outline"><Link href="/dashboard">Back to Dashboard</Link></Button></CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold flex gap-2"><BarChartIcon/> Attendance Report</h1>
                <Button onClick={() => window.print()}><Printer className="mr-2 h-4 w-4"/> Print Report</Button>
            </div>

            <Card>
                <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-[260px] justify-start text-left font-normal")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (dateRange.to ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> : format(dateRange.from, "LLL dd, y")) : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                        </PopoverContent>
                    </Popover>

                    <Select onValueChange={setSelectedClassId} value={selectedClassId}>
                        <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Classes" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            {classes?.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Detailed Logs</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((record: any) => (
                                <TableRow key={record.id}>
                                    <TableCell>
                                        <div className="font-medium">{record.student?.firstName} {record.student?.lastName}</div>
                                    </TableCell>
                                    <TableCell>{record.className}</TableCell>
                                    <TableCell>{format(record.date.toDate(), 'PPP')}</TableCell>
                                    <TableCell><Badge variant={record.status === 'Present' ? 'default' : 'destructive'}>{record.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
