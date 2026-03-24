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
import { FileText, Printer, BarChart as BarChartIcon, Calendar as CalendarIcon, Loader2, ShieldAlert, TrendingUp, Users, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { StudentSearchInput } from '@/components/student-search';
import { Label } from '@/components/ui/label';
import { formatStudentId } from '@/lib/student-utils';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
    'Present': '#22c55e',
    'Late': '#eab308',
    'Absent': '#ef4444',
    'Excused': '#94a3b8',
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
    const [searchStudentTerm, setSearchStudentTerm] = useState('');

    const isAdmin = ['Administrator', 'Director'].includes(role || '');
    const isTeacher = role === 'Teacher';
    const canAccess = !isRoleLoading && (isAdmin || isTeacher);

    useEffect(() => {
        if (!isRoleLoading && (role === 'Student' || role === 'Parent')) {
            router.replace('/dashboard');
        }
    }, [role, isRoleLoading, router]);

    const classesQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || isRoleLoading || !canAccess) return null;
        return query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, isRoleLoading, canAccess]);
    const { data: classes } = useCollection(classesQuery);

    const attendanceQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || isRoleLoading || !canAccess) return null;
        return query(collection(firestore, 'attendance'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, isRoleLoading, canAccess]);
    const { data: rawAttendance, isLoading: isLoadingAttendance } = useCollection(attendanceQuery);
    
    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || isRoleLoading || !canAccess) return null;
        return query(collection(firestore, 'students'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId, isRoleLoading, canAccess]);
    const { data: students, isLoading: isLoadingStudents } = useCollection(studentsQuery);

    const { filteredData, summaryStats, trendData, pieData } = useMemo(() => {
        if (!rawAttendance || !students || !classes || !dateRange?.from) {
            return { filteredData: [], summaryStats: null, trendData: [], pieData: [] };
        }

        const studentMap = new Map(students.map(s => [s.uid || s.id, s]));
        const classMap = new Map(classes.map(c => [c.id, c.name]));
        const fromDate = startOfDay(dateRange.from);
        const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

        const filtered = rawAttendance
            .filter(record => {
                const recordDate = record.date?.toDate ? record.date.toDate() : new Date(record.date);
                if (recordDate < fromDate || recordDate > toDate) return false;
                if (selectedClassId !== 'all' && record.classId !== selectedClassId) return false;
                if (searchStudentTerm.trim()) {
                    const student = studentMap.get(record.studentId);
                    if (!student) return false;
                    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
                    if (!fullName.includes(searchStudentTerm.toLowerCase().trim())) return false;
                }
                return true;
            })
            .map(record => ({
                ...record,
                dateObj: record.date?.toDate ? record.date.toDate() : new Date(record.date),
                student: studentMap.get(record.studentId),
                className: classMap.get(record.classId) || 'Unknown Class'
            }))
            .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

        const counts = { Present: 0, Absent: 0, Late: 0, Excused: 0 };
        filtered.forEach(r => { 
            const statusKey = r.status as keyof typeof counts;
            if (counts.hasOwnProperty(statusKey)) counts[statusKey]++;
        });
        
        const total = filtered.length;
        const rate = total > 0 ? ((counts.Present + counts.Late) / total) * 100 : 0;

        const summary = {
            total, present: counts.Present, absent: counts.Absent, late: counts.Late, excused: counts.Excused, rate: Math.round(rate)
        };

        const pie = Object.entries(counts).map(([name, value]) => ({ name, value })).filter(v => v.value > 0);

        const dailyGroups: Record<string, { date: string, rawDate: Date, present: number, absent: number }> = {};
        filtered.forEach(r => {
            const dateStr = format(r.dateObj, 'MMM dd');
            if (!dailyGroups[dateStr]) {
                dailyGroups[dateStr] = { date: dateStr, rawDate: startOfDay(r.dateObj), present: 0, absent: 0 };
            }
            if (r.status === 'Present' || r.status === 'Late') dailyGroups[dateStr].present++;
            if (r.status === 'Absent') dailyGroups[dateStr].absent++;
        });

        const trend = Object.values(dailyGroups).sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

        return { filteredData: filtered, summaryStats: summary, trendData: trend, pieData: pie };
    }, [rawAttendance, students, classes, dateRange, selectedClassId, searchStudentTerm]);

    if (isSchoolLoading || isRoleLoading || isLoadingAttendance || isLoadingStudents) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>;

    if (!canAccess) return null;

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2"><BarChartIcon className="text-indigo-600"/> Attendance Insights</h1>
                    <p className="text-muted-foreground">Monitor participation trends and student consistency.</p>
                </div>
                <Button onClick={() => window.print()} variant="outline"><Printer className="mr-2 h-4 w-4"/> Print Report</Button>
            </div>

            <Card className="print:hidden">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase text-slate-500">Filter Parameters</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-4 items-end">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase">Period</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full md:w-[260px] justify-start text-left font-normal border-2 h-11")}>
                                <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                                {dateRange?.from ? (dateRange.to ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> : format(dateRange.from, "LLL dd, y")) : <span>Pick a date range</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase">Class</Label>
                        <Select onValueChange={setSelectedClassId} value={selectedClassId}>
                            <SelectTrigger className="w-full md:w-[200px] border-2 h-11"><SelectValue placeholder="All Classes" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                {classes?.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 flex-1 min-w-[250px]">
                        <Label className="text-xs font-bold text-slate-500 uppercase">Search Student</Label>
                        <StudentSearchInput value={searchStudentTerm} onChange={setSearchStudentTerm} className="h-11 border-2" />
                    </div>
                </CardContent>
            </Card>

            {summaryStats && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-indigo-500"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-slate-500 uppercase">Rate</p><p className="text-3xl font-black text-indigo-600">{summaryStats.rate}%</p></div><TrendingUp className="h-8 w-8 text-indigo-100" /></div></CardContent></Card>
                    <Card className="border-l-4 border-l-red-500"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-slate-500 uppercase">Absences</p><p className="text-3xl font-black text-red-600">{summaryStats.absent}</p></div><AlertCircle className="h-8 w-8 text-red-100" /></div></CardContent></Card>
                    <Card className="border-l-4 border-l-yellow-500"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-slate-500 uppercase">Lates</p><p className="text-3xl font-black text-yellow-600">{summaryStats.late}</p></div><Clock className="h-8 w-8 text-yellow-100" /></div></CardContent></Card>
                    <Card className="border-l-4 border-l-blue-500"><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-slate-500 uppercase">Total</p><p className="text-3xl font-black text-blue-600">{summaryStats.total}</p></div><Users className="h-8 w-8 text-blue-100" /></div></CardContent></Card>
                </div>
            )}
        </div>
    );
}
