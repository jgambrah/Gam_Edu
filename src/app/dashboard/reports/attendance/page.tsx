'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { collection, query, where, getDocs, writeBatch, doc, Timestamp } from 'firebase/firestore'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Printer, BarChart as BarChartIcon, Calendar as CalendarIcon, Loader2, TrendingUp, Users, AlertCircle, Clock, Trash2, Search, Settings2, ShieldAlert, AlertTriangle } from 'lucide-react';
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
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const STATUS_COLORS: Record<string, string> = {
    'Present': '#22c55e',
    'Late': '#eab308',
    'Absent': '#ef4444',
    'Excused': '#94a3b8',
};

// --- SUB-COMPONENT: ATTENDANCE MANAGER DIALOG ---
function AttendanceManagerDialog({ classes, schoolId, onRefresh }: { classes: any[], schoolId: string, onRefresh: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [recordsToDelete, setRecordsToDelete] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleFindRecords = async () => {
        if (!firestore || !schoolId || !selectedClassId || !selectedDate) {
            toast({ variant: 'destructive', title: "Selection Required", description: "Please select a class and a date." });
            return;
        }
        
        setIsLoading(true);
        try {
            const q = query(
                collection(firestore, 'attendance'),
                where('schoolId', '==', schoolId),
                where('classId', '==', selectedClassId),
                where('date', '==', Timestamp.fromDate(startOfDay(selectedDate)))
            );
            
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                toast({ title: "No Records Found", description: "No attendance was taken on this date for this class." });
                setRecordsToDelete([]);
            } else {
                const ids = snapshot.docs.map(doc => doc.id);
                setRecordsToDelete(ids);
                toast({ title: "Records Located", description: `Found ${ids.length} records ready for maintenance.` });
            }
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Search Failed", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!firestore || recordsToDelete.length === 0) return;
        
        setIsDeleting(true);
        try {
            const batch = writeBatch(firestore);
            recordsToDelete.forEach(id => {
                batch.delete(doc(firestore, 'attendance', id));
            });

            await batch.commit();
            
            toast({ 
                title: "Maintenance Complete", 
                description: `Successfully deleted ${recordsToDelete.length} records. Any associated billing must be reversed manually in Financials.` 
            });
            
            setRecordsToDelete([]);
            onRefresh();
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Execution Failed", description: error.message });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800">
                    <Trash2 className="h-4 w-4" /> Manage Records
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Attendance Maintenance</DialogTitle>
                    <DialogDescription>
                        Use this tool to bulk-delete attendance logs mistakenly recorded on wrong dates.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Target Class</Label>
                        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                            <SelectTrigger className="bg-white"><SelectValue placeholder="Choose Class" /></SelectTrigger>
                            <SelectContent>
                                {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Error Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(selectedDate, "PPP")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {recordsToDelete.length > 0 && (
                        <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="font-bold">System Warning</AlertTitle>
                            <AlertDescription className="text-xs">
                                Found <strong>{recordsToDelete.length}</strong> records for {classes.find(c => c.id === selectedClassId)?.name} on {format(selectedDate, 'PPP')}. 
                                Deleting these is permanent and will not automatically refund generated bills.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter className="gap-2 flex-col sm:flex-row">
                    {recordsToDelete.length > 0 ? (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full sm:w-auto">
                                    {isDeleting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Trash2 className="mr-2 h-4 w-4"/>}
                                    Delete {recordsToDelete.length} Records
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2rem] border-4 border-slate-900">
                                <AlertDialogHeader>
                                    <div className="mx-auto bg-red-100 p-4 rounded-full w-fit mb-2">
                                        <AlertTriangle className="h-8 w-8 text-red-600" />
                                    </div>
                                    <AlertDialogTitle className="text-center text-2xl font-black uppercase italic">Permanent Deletion</AlertDialogTitle>
                                    <AlertDialogDescription className="text-center font-bold">
                                        Are you absolutely sure? This will erase these attendance logs from the student's history and terminal reports forever.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="sm:justify-center gap-4 pt-4">
                                    <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-black rounded-xl font-black uppercase tracking-widest px-8">
                                        Yes, Delete Records
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    ) : (
                        <Button onClick={handleFindRecords} disabled={isLoading || !selectedClassId} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin mr-2"/> : <Search className="mr-2 h-4 w-4 mr-2"/>}
                            Find Records
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

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
    const { data: rawAttendance, isLoading: isLoadingAttendance, forceRefetch } = useCollection(attendanceQuery);
    
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
            total,
            present: counts.Present,
            absent: counts.Absent,
            late: counts.Late,
            excused: counts.Excused,
            rate: Math.round(rate)
        };

        const pie = Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .filter(v => v.value > 0);

        // Daily trend
        const dailyGroups: Record<string, { 
            date: string, 
            rawDate: Date, 
            Present: number, 
            Absent: number,
            Late: number,
            Excused: number
        }> = {};

        filtered.forEach(r => {
            const dateStr = format(r.dateObj, 'MMM dd');
            if (!dailyGroups[dateStr]) {
                dailyGroups[dateStr] = { 
                    date: dateStr, 
                    rawDate: startOfDay(r.dateObj), 
                    Present: 0, 
                    Absent: 0,
                    Late: 0,
                    Excused: 0
                };
            }
            const s = r.status as 'Present' | 'Absent' | 'Late' | 'Excused';
            if (dailyGroups[dateStr][s] !== undefined) {
                dailyGroups[dateStr][s]++;
            }
        });

        const trend = Object.values(dailyGroups)
            .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

        return { filteredData: filtered, summaryStats: summary, trendData: trend, pieData: pie };
    }, [rawAttendance, students, classes, dateRange, selectedClassId, searchStudentTerm]);

    if (isSchoolLoading || isRoleLoading || isLoadingAttendance || isLoadingStudents) {
        return (
            <div className="p-10 flex justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary"/>
            </div>
        );
    }

    if (!canAccess) return null;

    return (
        <div className="space-y-6 p-6">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <BarChartIcon className="text-indigo-600"/> Attendance Insights
                    </h1>
                    <p className="text-muted-foreground">Monitor participation trends and student consistency.</p>
                </div>
                <div className="flex items-center gap-2">
                    {isAdmin && schoolId && (
                        <AttendanceManagerDialog 
                            classes={classes || []} 
                            schoolId={schoolId} 
                            onRefresh={forceRefetch}
                        />
                    )}
                    <Button onClick={() => window.print()} variant="outline">
                        <Printer className="mr-2 h-4 w-4"/> Print Report
                    </Button>
                </div>
            </div>

            {/* FILTERS */}
            <Card className="print:hidden shadow-sm">
                <CardHeader className="pb-3 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <Settings2 className="h-4 w-4 text-slate-400"/>
                        <p className="text-xs font-bold uppercase text-slate-500 tracking-widest">Filter Parameters</p>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4 items-end pt-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase">Period</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className={cn("w-full md:w-[260px] justify-start text-left font-normal border-2 h-11")}>
                                    <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                                    {dateRange?.from 
                                        ? dateRange.to 
                                            ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> 
                                            : format(dateRange.from, "LLL dd, y") 
                                        : <span>Pick a date range</span>
                                    }
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
                            <SelectTrigger className="w-full md:w-[200px] border-2 h-11">
                                <SelectValue placeholder="All Classes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                {classes?.map((c: any) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 flex-1 min-w-[250px]">
                        <Label className="text-xs font-bold text-slate-500 uppercase">Search Student</Label>
                        <StudentSearchInput 
                            value={searchStudentTerm} 
                            onChange={setSearchStudentTerm} 
                            className="h-11 border-2" 
                        />
                    </div>
                </CardContent>
            </Card>

            {summaryStats && (
                <>
                    {/* SUMMARY STAT CARDS */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-l-4 border-l-indigo-500 shadow-sm overflow-hidden group">
                            <CardContent className="pt-6 relative">
                                <TrendingUp className="absolute -right-2 -bottom-2 h-16 w-16 text-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Attendance Rate</p>
                                        <p className="text-3xl font-black text-indigo-600">{summaryStats.rate}%</p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-indigo-100" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-red-500 shadow-sm overflow-hidden group">
                            <CardContent className="pt-6 relative">
                                <AlertCircle className="absolute -right-2 -bottom-2 h-16 w-16 text-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Total Absences</p>
                                        <p className="text-3xl font-black text-red-600">{summaryStats.absent}</p>
                                    </div>
                                    <AlertCircle className="h-8 w-8 text-red-100" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-yellow-500 shadow-sm overflow-hidden group">
                            <CardContent className="pt-6 relative">
                                <Clock className="absolute -right-2 -bottom-2 h-16 w-16 text-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Late Arrivals</p>
                                        <p className="text-3xl font-black text-yellow-600">{summaryStats.late}</p>
                                    </div>
                                    <Clock className="h-8 w-8 text-yellow-100" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-blue-500 shadow-sm overflow-hidden group">
                            <CardContent className="pt-6 relative">
                                <Users className="absolute -right-2 -bottom-2 h-16 w-16 text-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex items-center justify-between relative z-10">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Total Records</p>
                                        <p className="text-3xl font-black text-blue-600">{summaryStats.total}</p>
                                    </div>
                                    <Users className="h-8 w-8 text-blue-100" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* DAILY TREND BAR CHART */}
                    <Card className="shadow-sm border-none ring-1 ring-slate-200 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 pb-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-base font-black text-slate-800 uppercase tracking-tighter flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-indigo-600"/> Participation Trends
                                    </p>
                                    <p className="text-xs text-muted-foreground font-medium">Daily status distribution for the selected period.</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="h-[320px] pt-6">
                            {trendData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart 
                                        data={trendData} 
                                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                                        barCategoryGap="20%"
                                        barGap={2}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis 
                                            dataKey="date" 
                                            fontSize={10} 
                                            tickLine={false} 
                                            axisLine={false}
                                            tick={{ fill: '#94a3b8', fontWeight: 'bold' }}
                                        />
                                        <YAxis 
                                            fontSize={10} 
                                            tickLine={false} 
                                            axisLine={false}
                                            tick={{ fill: '#94a3b8', fontWeight: 'bold' }}
                                            allowDecimals={false}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                borderRadius: '12px', 
                                                border: 'none', 
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }} 
                                        />
                                        <Legend 
                                            verticalAlign="top" 
                                            align="right" 
                                            iconType="circle"
                                            iconSize={8}
                                            wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingBottom: '12px', textTransform: 'uppercase' }}
                                        />
                                        <Bar dataKey="Present" name="Present" fill="#22c55e" radius={[3, 3, 0, 0]} maxBarSize={24} />
                                        <Bar dataKey="Absent" name="Absent" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={24} />
                                        <Bar dataKey="Late" name="Late" fill="#eab308" radius={[3, 3, 0, 0]} maxBarSize={24} />
                                        <Bar dataKey="Excused" name="Excused" fill="#94a3b8" radius={[3, 3, 0, 0]} maxBarSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">
                                    No data available for the selected period.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* PIE CHART + DETAILED TABLE */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                        {/* PIE CHART */}
                        <Card className="lg:col-span-2 shadow-sm border-none ring-1 ring-slate-200">
                            <CardHeader className="bg-slate-50/50 pb-4">
                                <p className="font-black text-base text-slate-800 uppercase tracking-tighter">Status Distribution</p>
                                <p className="text-xs text-muted-foreground font-medium">Proportional breakdown of all logs.</p>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie 
                                            data={pieData} 
                                            dataKey="value" 
                                            nameKey="name" 
                                            cx="50%" 
                                            cy="50%" 
                                            innerRadius={55}
                                            outerRadius={85} 
                                            paddingAngle={4}
                                        >
                                            {pieData.map((entry: any, index: number) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={STATUS_COLORS[entry.name] || '#8884d8'} 
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                borderRadius: '12px', 
                                                border: 'none', 
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* DETAILED TABLE */}
                        <Card className="lg:col-span-3 shadow-sm border-none ring-1 ring-slate-200">
                            <CardHeader className="bg-slate-50/50 pb-4">
                                <p className="font-black text-base text-slate-800 uppercase tracking-tighter">
                                    Audit Logs 
                                    <span className="ml-2 text-xs font-bold text-indigo-600">
                                        ({filteredData.length} records)
                                    </span>
                                </p>
                                <p className="text-xs text-muted-foreground font-medium">Detailed inspection of individual records.</p>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="max-h-[420px] overflow-y-auto">
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-white z-10 border-b">
                                            <TableRow>
                                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Student</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Class</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Date</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredData.map((record: any) => (
                                                <TableRow key={record.id} className="hover:bg-slate-50/50">
                                                    <TableCell>
                                                        <div className="font-bold text-slate-800 text-sm">
                                                            {record.student?.firstName} {record.student?.lastName}
                                                        </div>
                                                        <div className="text-[10px] font-mono font-bold text-slate-400">
                                                            {formatStudentId(record.student)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-xs font-bold text-slate-600 uppercase">{record.className}</TableCell>
                                                    <TableCell className="text-xs font-medium text-slate-500">
                                                        {format(record.dateObj, 'PPP')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant="outline"
                                                            className="text-[9px] font-black uppercase tracking-widest"
                                                            style={{ 
                                                                backgroundColor: `${STATUS_COLORS[record.status]}18`, 
                                                                color: STATUS_COLORS[record.status],
                                                                borderColor: `${STATUS_COLORS[record.status]}40`,
                                                            }}
                                                        >
                                                            {record.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {filteredData.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic text-sm">
                                                        No records found for the active filters.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}

            {/* EMPTY STATE */}
            {!summaryStats && (
                <Card className="border-dashed border-4 bg-slate-50/50">
                    <CardContent className="py-24 text-center">
                        <div className="bg-white p-6 rounded-full w-fit mx-auto mb-6 shadow-sm border-2">
                            <BarChartIcon className="h-12 w-12 text-slate-200" />
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No attendance data found</p>
                        <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
                            Adjust your class, student, or date range filters to generate a report.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
