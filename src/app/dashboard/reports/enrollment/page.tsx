'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { 
    Users, Printer, Loader2, ShieldAlert, TrendingUp, AlertTriangle, 
    BookOpen, Search, Sparkles, ChevronRight, Briefcase, GraduationCap, 
    Percent, HelpCircle, UserCheck, BarChart2, CheckCircle2, Award, FileText, Info 
} from 'lucide-react';
import { Class, Student, Staff } from '@/lib/types';
import Link from 'next/link';
import { formatStudentId } from '@/lib/student-utils';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';

const GENDER_COLORS = {
    Male: '#3b82f6', 
    Female: '#ec4899', 
    Other: '#a855f7', 
};

const ROLE_COLORS = [
    '#6366f1', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#3b82f6', // Blue
    '#ec4899', // Pink
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#ef4444', // Red
];

export default function EnrollmentReportsPage() {
    const { role, loading: isRoleLoading } = useRole();
    const router = useRouter();
    const firestore = useFirestore();
    const { schoolId, loading: isSchoolLoading } = useCurrentSchool();

    // Search and tab states
    const [activeTab, setActiveTab] = useState<string>('students');
    const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');
    const [staffSearchQuery, setStaffSearchQuery] = useState<string>('');

    const canAccess = ['Administrator', 'Director', 'Secretary'].includes(role || '');

    useEffect(() => {
        if (!isRoleLoading && (role === 'Student' || role === 'Parent')) {
            router.replace('/dashboard');
        }
    }, [role, isRoleLoading, router]);

    // Data Fetching
    const studentsQuery = useMemoFirebase(() => (firestore && schoolId && canAccess) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, canAccess]);
    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);

    const classesQuery = useMemoFirebase(() => (firestore && schoolId && canAccess) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, canAccess]);
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

    const staffQuery = useMemoFirebase(() => (firestore && schoolId && canAccess) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, canAccess]);
    const { data: staff, isLoading: isLoadingStaff } = useCollection<Staff>(staffQuery);

    // Fetch School Settings for Print Layout Header
    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    // Report Data Calculations & Aggregations
    const reportData = useMemo(() => {
        if (!students || !classes || !staff) return null;
        
        const activeStudents = students.filter(s => s.enrollmentStatus !== 'Inactive');
        const totalStudents = activeStudents.length;
        const totalStaff = staff.length;
        const totalClasses = classes.length;

        // Student gender breakdown
        const genderDistribution = activeStudents.reduce((acc, student) => {
            const gender = student.gender || 'Other';
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const studentGenderPieData = Object.entries(genderDistribution).map(([name, value]) => ({ name, value }));

        // Staff role breakdown
        const staffRolesDistribution = staff.reduce((acc, s) => {
            const r = s.role || 'Other';
            acc[r] = (acc[r] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const staffRolesPieData = Object.entries(staffRolesDistribution)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // Class enrollment, capacity, and utilization rate
        const classEnrollment = classes.map(c => {
            const studentCount = activeStudents.filter(s => s.classId === c.id).length;
            const cap = c.capacity || 0;
            const utilization = cap > 0 ? (studentCount / cap) * 100 : 0;
            return { 
                id: c.id,
                name: c.name, 
                students: studentCount, 
                capacity: cap,
                utilization: parseFloat(utilization.toFixed(1))
            };
        }).sort((a,b) => b.students - a.students);

        const averageClassSize = totalStudents > 0 && totalClasses > 0 ? totalStudents / totalClasses : 0;

        // Staffing metrics
        const teachersCount = staff.filter(s => s.role === 'Teacher').length;
        const studentToStaffRatio = totalStaff > 0 ? totalStudents / totalStaff : 0;
        const studentToTeacherRatio = teachersCount > 0 ? totalStudents / teachersCount : 0;

        // Overall Classroom Capacity Utilization
        let totalCapacity = 0;
        let occupiedSeats = 0;
        classes.forEach(c => {
            if (c.capacity && c.capacity > 0) {
                totalCapacity += c.capacity;
                const studentCount = activeStudents.filter(s => s.classId === c.id).length;
                occupiedSeats += studentCount;
            }
        });
        const capacityUtilization = totalCapacity > 0 ? (occupiedSeats / totalCapacity) * 100 : 0;

        // Managerial Recommendations and Warnings
        const criticalCapacities: Array<{ className: string; students: number; capacity: number; utilization: number }> = [];
        const underUtilized: Array<{ className: string; students: number; capacity: number; utilization: number }> = [];

        classEnrollment.forEach(c => {
            if (c.capacity > 0) {
                if (c.utilization >= 90) {
                    criticalCapacities.push({ className: c.name, students: c.students, capacity: c.capacity, utilization: c.utilization });
                } else if (c.utilization < 40) {
                    underUtilized.push({ className: c.name, students: c.students, capacity: c.capacity, utilization: c.utilization });
                }
            }
        });

        return { 
            totalStudents, 
            totalStaff,
            totalClasses,
            studentGenderPieData, 
            staffRolesPieData,
            classEnrollment, 
            averageClassSize: parseFloat(averageClassSize.toFixed(1)),
            teachersCount,
            studentToStaffRatio: parseFloat(studentToStaffRatio.toFixed(1)),
            studentToTeacherRatio: parseFloat(studentToTeacherRatio.toFixed(1)),
            capacityUtilization: parseFloat(capacityUtilization.toFixed(1)),
            criticalCapacities,
            underUtilized
        };
    }, [students, classes, staff]);

    // Student list search filter
    const filteredStudents = useMemo(() => {
        if (!students) return [];
        return students
            .filter(s => s.enrollmentStatus !== 'Inactive')
            .filter(s => {
                const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
                const classObj = classes?.find(c => c.id === s.classId);
                const className = (classObj?.name || 'N/A').toLowerCase();
                return fullName.includes(studentSearchQuery.toLowerCase()) || 
                       className.includes(studentSearchQuery.toLowerCase());
            });
    }, [students, classes, studentSearchQuery]);

    // Staff list search filter
    const filteredStaff = useMemo(() => {
        if (!staff) return [];
        return staff.filter(s => {
            const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
            const roleName = (s.role || '').toLowerCase();
            return fullName.includes(staffSearchQuery.toLowerCase()) || 
                   roleName.includes(staffSearchQuery.toLowerCase());
        });
    }, [staff, staffSearchQuery]);

    const isLoading = isSchoolLoading || isRoleLoading || isLoadingStudents || isLoadingClasses || isLoadingStaff;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-sm font-medium">Assembling institutional records...</p>
            </div>
        );
    }

    if (!canAccess) {
        return (
            <div className="p-8 flex justify-center">
                <Card className="max-w-md w-full border-red-100 bg-red-50/50 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                            <ShieldAlert className="h-8 w-8 text-red-600" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-800">Access Restricted</CardTitle>
                        <CardDescription>Enrollment and HR demographics are reserved for authorized administrative staff.</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center">
                        <Button asChild variant="outline" className="border-slate-200 shadow-sm">
                            <Link href="/dashboard">Return to Dashboard</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="space-y-6 pb-12" id="report-content">

            {/* PRINT COMPATIBLE LETTERHEAD */}
            <div className="hidden print:flex flex-col items-center border-b border-slate-300 pb-4 mb-6 text-center">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{schoolProfile?.schoolName || 'INSTITUTIONAL DIRECTORY'}</h1>
                <p className="text-xs text-slate-500 mt-1">
                    {schoolProfile?.address || ''} 
                    {schoolProfile?.phone ? ` | Tel: ${schoolProfile.phone}` : ''} 
                    {schoolProfile?.email ? ` | Email: ${schoolProfile.email}` : ''}
                </p>
                <div className="mt-4 border-t pt-4 w-full flex justify-between text-xs font-semibold text-slate-600">
                    <span>REPORT: INSTITUTIONAL ENROLLMENT & HR DEMOGRAPHICS</span>
                    <span>STUDENTS: {reportData?.totalStudents} | CLASSES: {reportData?.totalClasses} | STAFF: {reportData?.totalStaff}</span>
                </div>
            </div>

            {/* SCREEN-ONLY TOP HEADER */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 rounded-2xl text-white shadow-xl">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
                        <Users className="h-8 w-8 text-indigo-200 animate-pulse" /> 
                        Enrollment & HR reports
                    </h1>
                    <p className="text-indigo-100 text-sm font-medium">
                        Analyze student demographics, classroom capacities, and staff allocation stats to drive enrollment policy.
                    </p>
                </div>
                <div className="flex gap-2 self-stretch md:self-auto justify-end">
                    <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Link href="/dashboard/reports/academics">Academics</Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <Link href="/dashboard/reports/attendance">Attendance</Link>
                    </Button>
                    <Button onClick={() => window.print()} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md border-0">
                        <Printer className="mr-2 h-4 w-4"/>Print Record
                    </Button>
                </div>
            </div>

            {reportData ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <div className="flex justify-between items-center print:hidden border-b pb-2">
                        <TabsList className="bg-slate-100 p-1 rounded-xl">
                            <TabsTrigger value="students" className="rounded-lg font-bold text-xs uppercase px-4 py-2">Students Enrollment</TabsTrigger>
                            <TabsTrigger value="staff" className="rounded-lg font-bold text-xs uppercase px-4 py-2">Staff & HR Stats</TabsTrigger>
                            <TabsTrigger value="managerial" className="rounded-lg font-bold text-xs uppercase px-4 py-2 flex items-center gap-1">
                                <Award className="h-3.5 w-3.5 text-indigo-500" /> Executive Analysis
                            </TabsTrigger>
                        </TabsList>
                        <Badge className="bg-indigo-600 font-bold hidden md:inline-flex">
                            Directory: {reportData.totalStudents} Students / {reportData.totalStaff} Staff
                        </Badge>
                    </div>

                    {/* ========================================================================= */}
                    {/* STUDENTS TAB                                                              */}
                    {/* ========================================================================= */}
                    <TabsContent value="students" className="space-y-6 outline-none">
                        
                        {/* STATS STRIP */}
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                            <Card className="border border-slate-200/80 bg-gradient-to-br from-blue-50 to-blue-100/30 shadow-sm relative overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <Users className="absolute -right-2 -bottom-2 h-16 w-16 text-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Students</p>
                                            <p className="text-3xl font-black text-blue-700">{reportData.totalStudents}</p>
                                        </div>
                                        <Users className="h-8 w-8 text-blue-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200/80 bg-gradient-to-br from-indigo-50 to-indigo-100/30 shadow-sm overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <BookOpen className="absolute -right-2 -bottom-2 h-16 w-16 text-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Total Classes</p>
                                            <p className="text-3xl font-black text-indigo-700">{reportData.totalClasses}</p>
                                        </div>
                                        <BookOpen className="h-8 w-8 text-indigo-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200/80 bg-gradient-to-br from-emerald-50 to-emerald-100/30 shadow-sm overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <GraduationCap className="absolute -right-2 -bottom-2 h-16 w-16 text-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Average Class Size</p>
                                            <p className="text-3xl font-black text-emerald-700">{reportData.averageClassSize}</p>
                                        </div>
                                        <GraduationCap className="h-8 w-8 text-emerald-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200/80 bg-gradient-to-br from-purple-50 to-purple-100/30 shadow-sm overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <Percent className="absolute -right-2 -bottom-2 h-16 w-16 text-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Capacity Util.</p>
                                            <p className="text-3xl font-black text-purple-700">{reportData.capacityUtilization}%</p>
                                        </div>
                                        <Percent className="h-8 w-8 text-purple-300" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* CHARTS ROW */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            
                            {/* GENDER PIE */}
                            <Card className="lg:col-span-2 border border-slate-200/80 shadow-sm">
                                <CardHeader className="pb-0 bg-slate-50/50 border-b">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                                        <Users className="h-4 w-4 text-indigo-500" /> Demographics Breakdown
                                    </CardTitle>
                                    <CardDescription>Student gender ratios inside the database.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[260px] flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={reportData.studentGenderPieData} 
                                                dataKey="value" 
                                                nameKey="name" 
                                                cx="50%" 
                                                cy="50%" 
                                                innerRadius={50}
                                                outerRadius={75} 
                                                paddingAngle={4}
                                            >
                                                {reportData.studentGenderPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[entry.name as keyof typeof GENDER_COLORS] || '#a855f7'} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(v) => [`${v} Students`, 'Total']} />
                                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* CLASS ENROLLMENT BAR */}
                            <Card className="lg:col-span-3 border border-slate-200/80 shadow-sm">
                                <CardHeader className="pb-0 bg-slate-50/50 border-b">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                                        <BarChart2 className="h-4 w-4 text-indigo-500" /> Sizing by Classroom
                                    </CardTitle>
                                    <CardDescription>Class enrollment distributions ranked highest to lowest.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[260px] pt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={reportData.classEnrollment} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                                            <Tooltip formatter={(v) => [`${v} Students`, 'Enrollment']} />
                                            <Bar dataKey="students" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Students Count">
                                                {reportData.classEnrollment.map((entry, index) => {
                                                    const color = entry.students >= (entry.capacity * 0.9) && entry.capacity > 0 ? '#ef4444' : '#4f46e5';
                                                    return <Cell key={`cell-${index}`} fill={color} />;
                                                })}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* STUDENT ROSTER LIST */}
                        <Card className="border border-slate-200/80 shadow-sm">
                            <CardHeader className="pb-3 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-50/50">
                                <div>
                                    <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
                                        <FileText className="h-5 w-5 text-indigo-500" /> Student Enrollment Registry
                                    </CardTitle>
                                    <CardDescription>Comprehensive searchable index of active school registrations.</CardDescription>
                                </div>
                                <div className="relative w-full sm:w-60 print:hidden">
                                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                    <Input
                                        placeholder="Search student or class name..."
                                        value={studentSearchQuery}
                                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                                        className="pl-8 h-9 text-xs bg-white border-2"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Official ID</TableHead>
                                            <TableHead>Assigned Class</TableHead>
                                            <TableHead>Gender</TableHead>
                                            <TableHead className="text-right">Billing status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStudents.map(s => (
                                            <TableRow key={s.id} className="hover:bg-slate-50 transition-colors">
                                                <TableCell className="font-bold text-slate-700">{s.firstName} {s.lastName}</TableCell>
                                                <TableCell className="font-mono text-xs font-semibold text-slate-500">{formatStudentId(s)}</TableCell>
                                                <TableCell className="font-semibold text-slate-600">
                                                    {classes?.find(c => c.id === s.classId)?.name || <span className="text-rose-500 italic font-medium">Unassigned</span>}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn(
                                                        "text-[10px] font-bold",
                                                        s.gender === 'Male' ? "border-blue-200 bg-blue-50 text-blue-700" :
                                                        s.gender === 'Female' ? "border-pink-200 bg-pink-50 text-pink-700" :
                                                        "border-purple-200 bg-purple-50 text-purple-700"
                                                    )}>
                                                        {s.gender || 'Other'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredStudents.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-10 text-slate-400 italic text-sm">
                                                    No student registrations matched the query criteria.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ========================================================================= */}
                    {/* STAFF TAB                                                                 */}
                    {/* ========================================================================= */}
                    <TabsContent value="staff" className="space-y-6 outline-none">
                        
                        {/* STATS STRIP */}
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                            <Card className="border border-slate-200/80 bg-gradient-to-br from-indigo-50 to-indigo-100/30 shadow-sm relative overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <Briefcase className="absolute -right-2 -bottom-2 h-16 w-16 text-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Total HR staff</p>
                                            <p className="text-3xl font-black text-indigo-700">{reportData.totalStaff}</p>
                                        </div>
                                        <Briefcase className="h-8 w-8 text-indigo-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200/80 bg-gradient-to-br from-blue-50 to-blue-100/30 shadow-sm overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <GraduationCap className="absolute -right-2 -bottom-2 h-16 w-16 text-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Teaching Staff</p>
                                            <p className="text-3xl font-black text-blue-700">{reportData.teachersCount}</p>
                                        </div>
                                        <GraduationCap className="h-8 w-8 text-blue-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200/80 bg-gradient-to-br from-emerald-50 to-emerald-100/30 shadow-sm overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <UserCheck className="absolute -right-2 -bottom-2 h-16 w-16 text-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Student-to-Teacher Ratio</p>
                                            <p className="text-3xl font-black text-emerald-700">{reportData.studentToTeacherRatio}:1</p>
                                        </div>
                                        <UserCheck className="h-8 w-8 text-emerald-300" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-200/80 bg-gradient-to-br from-amber-50 to-amber-100/30 shadow-sm overflow-hidden group">
                                <CardContent className="pt-6 relative">
                                    <Users className="absolute -right-2 -bottom-2 h-16 w-16 text-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center justify-between relative z-10">
                                        <div>
                                            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Student-to-Staff Ratio</p>
                                            <p className="text-3xl font-black text-amber-700">{reportData.studentToStaffRatio}:1</p>
                                        </div>
                                        <Users className="h-8 w-8 text-amber-300" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* CHARTS CONTAINER */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            
                            {/* STAFF ROLES PIE */}
                            <Card className="lg:col-span-2 border border-slate-200/80 shadow-sm">
                                <CardHeader className="pb-0 bg-slate-50/50 border-b">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                                        <Briefcase className="h-4 w-4 text-indigo-500" /> Staff Roles Breakdown
                                    </CardTitle>
                                    <CardDescription>Human resource allocation by role tier.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[260px] flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie 
                                                data={reportData.staffRolesPieData} 
                                                dataKey="value" 
                                                nameKey="name" 
                                                cx="50%" 
                                                cy="50%" 
                                                innerRadius={50}
                                                outerRadius={75} 
                                                paddingAngle={4}
                                            >
                                                {reportData.staffRolesPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(v) => [`${v} Members`, 'Count']} />
                                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* STAFF DISTRIBUTION BAR */}
                            <Card className="lg:col-span-3 border border-slate-200/80 shadow-sm">
                                <CardHeader className="pb-0 bg-slate-50/50 border-b">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                                        <BarChart2 className="h-4 w-4 text-indigo-500" /> Role Count Comparisons
                                    </CardTitle>
                                    <CardDescription>Quantities of contract staff registered in the workspace.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[260px] pt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={reportData.staffRolesPieData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 600, fill: '#64748b' }} />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                                            <Tooltip formatter={(v) => [`${v} Staff`, 'Allocation']} />
                                            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} name="Count">
                                                {reportData.staffRolesPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* STAFF ROSTER LIST */}
                        <Card className="border border-slate-200/80 shadow-sm">
                            <CardHeader className="pb-3 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-slate-50/50">
                                <div>
                                    <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-700">
                                        <Briefcase className="h-5 w-5 text-indigo-500" /> School Staff Directory
                                    </CardTitle>
                                    <CardDescription>Index of active academic, operations, and leadership contract holders.</CardDescription>
                                </div>
                                <div className="relative w-full sm:w-60 print:hidden">
                                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                    <Input
                                        placeholder="Search staff by name or role..."
                                        value={staffSearchQuery}
                                        onChange={(e) => setStaffSearchQuery(e.target.value)}
                                        className="pl-8 h-9 text-xs bg-white border-2"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Staff Name</TableHead>
                                            <TableHead>Assigned Role</TableHead>
                                            <TableHead>Email Contact</TableHead>
                                            <TableHead className="text-right font-black">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredStaff.map(s => (
                                            <TableRow key={s.uid} className="hover:bg-slate-50 transition-colors">
                                                <TableCell className="font-bold text-slate-700">{s.firstName} {s.lastName}</TableCell>
                                                <TableCell>
                                                    <Badge className="bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-100 text-[10px] uppercase">
                                                        {s.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-slate-500">{s.email}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Active</Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {filteredStaff.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-10 text-slate-400 italic text-sm">
                                                    No contract staff records matched the query.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* ========================================================================= */}
                    {/* EXECUTIVE ANALYSIS TAB                                                    */}
                    {/* ========================================================================= */}
                    <TabsContent value="managerial" className="space-y-6 outline-none">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            
                            {/* CLASSROOM CAPACITY WARNINGS */}
                            <Card className="border border-slate-200/80 shadow-sm flex flex-col justify-between">
                                <CardHeader className="bg-rose-50/50 border-b border-rose-100 pb-3">
                                    <CardTitle className="text-sm font-bold text-rose-700 flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-rose-500" /> Capacity Critical Indicators (&gt;= 90%)
                                    </CardTitle>
                                    <CardDescription className="text-rose-600">Classes approaching or exceeding student registration caps.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 overflow-y-auto max-h-[300px] divide-y">
                                    {reportData.criticalCapacities.map(c => (
                                        <div key={c.className} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center gap-3">
                                            <div>
                                                <p className="font-bold text-sm text-slate-800">{c.className}</p>
                                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                                    Allocated: <strong>{c.students}</strong> / Capacity: <strong>{c.capacity}</strong> seats
                                                </p>
                                            </div>
                                            <div>
                                                <Badge variant="destructive" className="font-black">{c.utilization}% Full</Badge>
                                            </div>
                                        </div>
                                    ))}
                                    {reportData.criticalCapacities.length === 0 && (
                                        <div className="text-center py-16 text-slate-400 text-xs font-semibold">
                                            🎉 Excellent. No classes are currently exceeding safe registration limits.
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="py-3 px-4 border-t bg-slate-50/50 text-[10px] font-semibold text-slate-500 flex items-center gap-1.5">
                                    <Info className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Action: Pause new entries or divide sections for highlighted classes.
                                </CardFooter>
                            </Card>

                            {/* CLASSROOM CONSOLIDATION RECOMMENDATIONS */}
                            <Card className="border border-slate-200/80 shadow-sm flex flex-col justify-between">
                                <CardHeader className="bg-amber-50/50 border-b border-amber-100 pb-3">
                                    <CardTitle className="text-sm font-bold text-amber-700 flex items-center gap-2">
                                        <HelpCircle className="h-5 w-5 text-amber-500" /> Sizing Optimisation Advice (&lt; 40%)
                                    </CardTitle>
                                    <CardDescription className="text-amber-600">Rooms with low enrollment indicating possible resource consolidation.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 overflow-y-auto max-h-[300px] divide-y">
                                    {reportData.underUtilized.map(c => (
                                        <div key={c.className} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center gap-3">
                                            <div>
                                                <p className="font-bold text-sm text-slate-800">{c.className}</p>
                                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                                    Allocated: <strong>{c.students}</strong> / Capacity: <strong>{c.capacity}</strong> seats
                                                </p>
                                            </div>
                                            <div>
                                                <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-black">{c.utilization}% Full</Badge>
                                            </div>
                                        </div>
                                    ))}
                                    {reportData.underUtilized.length === 0 && (
                                        <div className="text-center py-16 text-slate-400 text-xs font-semibold">
                                            🎉 Efficient allocation. All classes are populated above 40%.
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="py-3 px-4 border-t bg-slate-50/50 text-[10px] font-semibold text-slate-500 flex items-center gap-1.5">
                                    <Info className="h-3.5 w-3.5 text-indigo-500 shrink-0" /> Action: Consider merged lesson formats or promotion to populating classes.
                                </CardFooter>
                            </Card>
                        </div>

                        {/* EXECUTIVE SUMMARY INSIGHTS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* RATIOS ANALYSIS CARD */}
                            <Card className="border border-slate-200/80 shadow-sm relative overflow-hidden">
                                <CardHeader className="pb-2 bg-slate-50/50 border-b">
                                    <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <TrendingUp className="h-4.5 w-4.5 text-indigo-500" /> Student-Teacher Sizing
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">Students per Teacher</span>
                                        <strong className="text-slate-800 text-sm font-bold">{reportData.studentToTeacherRatio}</strong>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">Students per Staff</span>
                                        <strong className="text-slate-800 text-sm font-bold">{reportData.studentToStaffRatio}</strong>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <p className="text-[10px] text-slate-400 leading-normal">
                                            Standard benchmarks target student-teacher ratios between 15:1 and 25:1. Current ratio stands at <strong>{reportData.studentToTeacherRatio}:1</strong>.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* CLASSROOM EFFICIENCY */}
                            <Card className="border border-slate-200/80 shadow-sm relative overflow-hidden">
                                <CardHeader className="pb-2 bg-slate-50/50 border-b">
                                    <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <Percent className="h-4.5 w-4.5 text-indigo-500" /> Seat Utilisation Rate
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">Class Capacity Utilization</span>
                                        <strong className="text-slate-800 text-sm font-bold">{reportData.capacityUtilization}%</strong>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">Average Students per Room</span>
                                        <strong className="text-slate-800 text-sm font-bold">{reportData.averageClassSize}</strong>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <p className="text-[10px] text-slate-400 leading-normal">
                                            A seat utilization of <strong>{reportData.capacityUtilization}%</strong> indicates your school classrooms are populated efficiently.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* RESOURCE PLANNING CARD */}
                            <Card className="border border-slate-200/80 shadow-sm relative overflow-hidden">
                                <CardHeader className="pb-2 bg-slate-50/50 border-b">
                                    <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <CheckCircle2 className="h-4.5 w-4.5 text-indigo-500" /> HR Sizing Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">Total Active Classes</span>
                                        <strong className="text-slate-800 text-sm font-bold">{reportData.totalClasses}</strong>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">Contract Teachers</span>
                                        <strong className="text-slate-800 text-sm font-bold">{reportData.teachersCount}</strong>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <p className="text-[10px] text-slate-400 leading-normal">
                                            A balanced ratio between registered classes ({reportData.totalClasses}) and teachers ({reportData.teachersCount}) avoids staffing strains.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            ) : (
                <div className="text-center py-20 bg-slate-100 rounded-xl border border-slate-200">
                    <p className="text-slate-500 font-medium">No demographics or enrollment data posted in the system database.</p>
                </div>
            )}
        </div>
    );
}
