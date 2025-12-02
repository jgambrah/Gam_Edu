
'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { FileText, Printer, BarChart as BarChartIcon, Calendar as CalendarIcon, Users, Loader2 } from 'lucide-react';
import { Class, AttendanceRecord, Student } from '@/lib/types';
import Link from 'next/link';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

const COLORS = {
    Present: '#22c55e',
    Absent: '#ef4444',
    Late: '#f97316',
    Excused: '#64748b'
};

export default function AttendanceReportsPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { user } = useUser();
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: addDays(new Date(), -30),
        to: new Date(),
      });
    const [selectedClassId, setSelectedClassId] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const canAccess = ['Administrator', 'Director', 'Teacher'].includes(role);

    // --- DATA FETCHING ---
    const classesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        if (role === 'Administrator' || role === 'Director') {
            return collection(firestore, 'classes');
        }
        if (role === 'Teacher') {
            return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
        }
        return null;
    }, [firestore, user, role]);
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

    const attendanceQuery = useMemoFirebase(() => {
        if (!firestore || !dateRange?.from || !dateRange?.to) return null;
        return query(
            collection(firestore, 'attendance'),
            where('date', '>=', dateRange.from),
            where('date', '<=', dateRange.to)
        );
    }, [firestore, dateRange]);
    const { data: attendanceRecords, isLoading: isLoadingAttendance } = useCollection<AttendanceRecord>(attendanceQuery);
    
    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(useMemoFirebase(() => firestore ? collection(firestore, 'students') : null, [firestore]));

    const isLoading = isLoadingClasses || isLoadingAttendance || isLoadingStudents;

    // --- DATA PROCESSING & FILTERING ---
    const filteredData = useMemo(() => {
        if (!attendanceRecords) return [];
        let data = attendanceRecords;

        if (selectedClassId !== 'all') {
            data = data.filter(record => record.classId === selectedClassId);
        }
        if (selectedStatus !== 'all') {
            data = data.filter(record => record.status === selectedStatus);
        }
        
        // Add student names to the records
        return data.map(record => {
            const student = students?.find(s => s.uid === record.studentId);
            return {
                ...record,
                studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
            }
        });

    }, [attendanceRecords, selectedClassId, selectedStatus, students]);

    const summaryData = useMemo(() => {
        const totalRecords = filteredData.length;
        if (totalRecords === 0) {
            return {
                attendanceRate: 0,
                totalAbsences: 0,
                totalLate: 0,
                pieData: []
            };
        }

        const statusCounts = filteredData.reduce((acc, record) => {
            acc[record.status] = (acc[record.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const totalPresentOrExcused = (statusCounts['Present'] || 0) + (statusCounts['Excused'] || 0);
        const attendanceRate = (totalPresentOrExcused / totalRecords) * 100;
        
        const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

        return {
            attendanceRate: parseFloat(attendanceRate.toFixed(1)),
            totalAbsences: statusCounts['Absent'] || 0,
            totalLate: statusCounts['Late'] || 0,
            pieData,
        };

    }, [filteredData]);
    

    if (!canAccess) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>This module is restricted to Administrators, Directors, and Teachers.</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    return (
        <div className="space-y-6" id="report-content">
            <div className="flex items-center justify-between print:hidden">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2"><BarChartIcon /> Attendance Reports</h1>
                    <p className="text-muted-foreground">Analyze student attendance patterns and trends.</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline"><Link href="/dashboard/reports/academics">Academics</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/enrollment">Enrollment</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/financials">Financials</Link></Button>
                    <Button onClick={() => window.print()}><Printer className="mr-2"/>Print</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>Select a date range, class, and status to generate a report.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn("w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                            dateRange.to ? (
                                <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                            ) : (
                            <span>Pick a date</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                        </PopoverContent>
                    </Popover>
                    <Select onValueChange={setSelectedClassId} defaultValue="all" disabled={isLoadingClasses}>
                        <SelectTrigger className="w-[280px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select onValueChange={setSelectedStatus} defaultValue="all">
                        <SelectTrigger className="w-[280px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="Present">Present</SelectItem>
                            <SelectItem value="Absent">Absent</SelectItem>
                            <SelectItem value="Late">Late</SelectItem>
                            <SelectItem value="Excused">Excused</SelectItem>
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {isLoading ? <div className="py-20 flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                <>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader><CardTitle>Overall Attendance Rate</CardTitle></CardHeader>
                            <CardContent><p className="text-3xl font-bold">{summaryData.attendanceRate}%</p></CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Total Absences</CardTitle></CardHeader>
                            <CardContent><p className="text-3xl font-bold">{summaryData.totalAbsences}</p></CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Total Late Arrivals</CardTitle></CardHeader>
                            <CardContent><p className="text-3xl font-bold">{summaryData.totalLate}</p></CardContent>
                        </Card>
                    </div>
                    
                    <div className="grid md:grid-cols-5 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader><CardTitle>Attendance by Status</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={summaryData.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                            {summaryData.pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-3">
                            <CardHeader><CardTitle>Detailed Log</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Class</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Notes</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredData.map(record => (
                                            <TableRow key={record.id}>
                                                <TableCell>{record.studentName}</TableCell>
                                                <TableCell>{classes?.find(c => c.id === record.classId)?.name}</TableCell>
                                                <TableCell>{format(record.date.toDate(), 'PPP')}</TableCell>
                                                <TableCell>
                                                    <Badge style={{ backgroundColor: COLORS[record.status as keyof typeof COLORS], color: 'white' }}>
                                                        {record.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{record.notes}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {filteredData.length === 0 && <p className="text-center text-muted-foreground p-8">No records match the selected filters.</p>}
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}

            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print\\:hidden {
                        display: none;
                    }
                    #report-content, #report-content * {
                        visibility: visible;
                    }
                    #report-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
