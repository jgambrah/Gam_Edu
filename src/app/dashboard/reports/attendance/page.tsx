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
    'Present': '#22c55e', // green-500
    'Late': '#eab308',    // yellow-500
    'Absent': '#ef4444',  // red-500
    'Excused': '#94a3b8', // slate-400
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

    // --- DATA TRANSFORMATION ---
    const { filteredData, summaryStats, trendData, pieData } = useMemo(() => {
        if (!rawAttendance || !students || !classes || !dateRange?.from) {
            return { filteredData: [], summaryStats: null, trendData: [], pieData: [] };
        }

        const studentMap = new Map(students.map(s => [s.uid || s.id, s]));
        const classMap = new Map(classes.map(c => [c.id, c.name]));
        const fromDate = startOfDay(dateRange.from);
        const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

        // A. Filter & Enriched Data
        const filtered = rawAttendance
            .filter(record => {
                const recordDate = record.date?.toDate ? record.date.toDate() : new Date(record.date);
                if (recordDate < fromDate || recordDate > toDate) return false;
                if (selectedClassId !== 'all' && record.classId !== selectedClassId) return false;
                
                // Student Name Filter
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

        // B. Summary Stats
        const counts = { Present: 0, Absent: 0, Late: 0, Excused: 0 };
        filtered.forEach(r => { counts[r.status as keyof typeof counts] = (counts[r.status as keyof typeof counts] || 0) + 1; });
        
        const total = filtered.length;
        const rate = total > 0 ? ((counts.Present + counts.Late) / total) * 100 : 0;

        const summary = {
            total,
            present: counts.Present,
            absent: counts.Absent,
            late: counts.Late,
            excused: counts.Excused,
            rate: Math.round(rate)
        };

        // C. Pie Data
        const pie = Object.entries(counts).map(([name, value]) => ({ name, value })).filter(v => v.value > 0);

        // D. Trend Data (Group by Date)
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2"><BarChartIcon className="text-indigo-600"/> Attendance Insights</h1>
                    <p className="text-muted-foreground">Monitor participation trends and student consistency.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => window.print()} variant="outline"><Printer className="mr-2 h-4 w-4"/> Print Report</Button>
                </div>
            </div>

            {/* FILTERS */}
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
                        <StudentSearchInput 
                            value={searchStudentTerm} 
                            onChange={setSearchStudentTerm} 
                            className="h-11 border-2"
                            placeholder="Find a student..."
                        />
                    </div>
                </CardContent>
            </Card>

            {summaryStats && (
                <>
                    {/* KEY METRIC CARDS */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div><p className="text-xs font-bold text-slate-500 uppercase">Attendance Rate</p><p className="text-3xl font-black text-indigo-600">{summaryStats.rate}%</p></div>
                                    <TrendingUp className="h-8 w-8 text-indigo-100" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-red-500 shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div><p className="text-xs font-bold text-slate-500 uppercase">Total Absences</p><p className="text-3xl font-black text-red-600">{summaryStats.absent}</p></div>
                                    <AlertCircle className="h-8 w-8 text-red-100" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-yellow-500 shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div><p className="text-xs font-bold text-slate-500 uppercase">Total Lates</p><p className="text-3xl font-black text-yellow-600">{summaryStats.late}</p></div>
                                    <Clock className="h-8 w-8 text-yellow-100" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-blue-500 shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div><p className="text-xs font-bold text-slate-500 uppercase">Total Logs</p><p className="text-3xl font-black text-blue-600">{summaryStats.total}</p></div>
                                    <Users className="h-8 w-8 text-blue-100" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* CHARTS */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Daily Trend Chart */}
                        <Card className="lg:col-span-2 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-indigo-600"/> Daily Attendance Trend
                                </CardTitle>
                                <CardDescription>Tracking Present vs. Absent counts chronologically.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                {trendData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} />
                                            <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                            <Legend verticalAlign="top" align="right" iconType="circle" />
                                            <Line type="monotone" dataKey="present" name="Present/Late" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e' }} activeDot={{ r: 6 }} />
                                            <Line type="monotone" dataKey="absent" name="Absent" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#ef4444' }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground italic">Insufficient data for trend line.</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status Distribution */}
                        <Card shadow-sm>
                            <CardHeader>
                                <CardTitle className="text-base font-bold">Status Distribution</CardTitle>
                                <CardDescription>Proportional breakdown of attendance.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                {pieData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#cbd5e1'} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-muted-foreground italic">No data to display.</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}

            {/* DETAILED LOGS */}
            <Card className="shadow-sm">
                <CardHeader className="bg-slate-50/50 border-b">
                    <CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5 text-slate-400"/> Detailed Attendance Logs</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead>Student</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="print:hidden">Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? filteredData.map((record: any) => (
                                <TableRow key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="font-semibold text-slate-800">{record.student?.firstName} {record.student?.lastName}</div>
                                        <div className="text-[10px] font-mono text-slate-400">{formatStudentId(record.student)}</div>
                                    </TableCell>
                                    <TableCell>{record.className}</TableCell>
                                    <TableCell className="text-sm">{format(record.dateObj, 'PPP')}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant="outline" 
                                            style={{ 
                                                backgroundColor: `${STATUS_COLORS[record.status]}15`, 
                                                color: STATUS_COLORS[record.status],
                                                borderColor: `${STATUS_COLORS[record.status]}30`
                                            }}
                                            className="font-bold"
                                        >
                                            {record.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-500 italic max-w-[200px] truncate print:hidden">
                                        {record.notes || '-'}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                                        No attendance records found for this period.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
