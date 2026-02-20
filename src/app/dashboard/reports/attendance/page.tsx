'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useAuth } from '@/firebase'; 
import { collection, query, where, Timestamp, orderBy } from 'firebase/firestore'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FileText, Printer, BarChart as BarChartIcon, Calendar as CalendarIcon, Loader2, AlertCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useCurrentSchool } from '@/hooks/use-current-school';

const COLORS = {
    Present: '#22c55e',
    Absent: '#ef4444',
    Late: '#f97316',
    Excused: '#64748b'
};

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
    const canAccess = isAdmin || isTeacher;

    // 1. Fetch Classes (School-Aware)
    const classesQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !canAccess) return null;
        return query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, canAccess]);
    const { data: classes, isLoading: isLoadingClasses } = useCollection(classesQuery);

    // 2. Fetch Attendance (School-Aware)
    const attendanceQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !canAccess) return null;
        return query(
            collection(firestore, 'attendance'),
            where('schoolId', '==', schoolId)
        );
    }, [firestore, schoolId, canAccess]);
    const { data: rawAttendance, isLoading: isLoadingAttendance } = useCollection(attendanceQuery);
    
    // 3. Fetch Students (For Names)
    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !canAccess) return null;
        return query(collection(firestore, 'students'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, canAccess]);
    const { data: students, isLoading: isLoadingStudents } = useCollection(studentsQuery);

    useEffect(() => {
        if (!isRoleLoading && role === 'Student') {
            router.replace('/dashboard');
        }
    }, [role, isRoleLoading, router]);

    // --- DATA PROCESSING ---
    const filteredData = useMemo(() => {
        if (!rawAttendance || !students || !classes) return [];
        if (!dateRange?.from) return [];

        const studentMap = new Map(students.map(s => [s.id, s]));
        const classMap = new Map(classes.map(c => [c.id, c.name]));

        const fromStr = format(dateRange.from, 'yyyy-MM-dd');
        const toStr = dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : fromStr;

        return rawAttendance
            .filter(record => {
                if (!record.date) return false;
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

    const summaryData = useMemo(() => {
        const total = filteredData.length;
        if (total === 0) return { rate: 0, absent: 0, late: 0, pie: [] };
        const counts: any = {};
        filteredData.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
        const rate = ((counts['Present'] || 0) + (counts['Excused'] || 0)) / total * 100;
        const pie = Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
        return { rate: rate.toFixed(1), absent: counts['Absent'] || 0, late: counts['Late'] || 0, pie };
    }, [filteredData]);

    const isLoading = isSchoolLoading || isRoleLoading || isLoadingClasses || isLoadingAttendance || isLoadingStudents;

    if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary h-8 w-8"/></div>;

    if (!canAccess) {
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

                    <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                        <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Present">Present</SelectItem>
                            <SelectItem value="Absent">Absent</SelectItem>
                            <SelectItem value="Late">Late</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Attendance Rate</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{summaryData.rate}%</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Absences</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{summaryData.absent}</div></CardContent></Card>
                    <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Late Arrivals</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-orange-600">{summaryData.late}</div></CardContent></Card>
                </div>

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
                                {filteredData.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8">No records found for this period.</TableCell></TableRow>}
                                {filteredData.map((record: any) => (
                                    <TableRow key={record.id}>
                                        <TableCell>
                                            <div className="font-medium">{record.student?.firstName} {record.student?.lastName}</div>
                                            <div className="text-xs text-muted-foreground">{record.student?.email}</div>
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
        </div>
    );
}
