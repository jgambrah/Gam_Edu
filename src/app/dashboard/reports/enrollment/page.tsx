'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FileText, Printer, Users, Loader2, ShieldAlert } from 'lucide-react';
import { Class, Student } from '@/lib/types';
import Link from 'next/link';
import { formatStudentId } from '@/lib/student-utils';
import { useCurrentSchool } from '@/hooks/use-current-school';

const GENDER_COLORS = {
    Male: '#3b82f6', 
    Female: '#ec4899', 
    Other: '#a855f7', 
};

export default function EnrollmentReportsPage() {
    const { role, loading: isRoleLoading } = useRole();
    const router = useRouter();
    const firestore = useFirestore();
    const { schoolId, loading: isSchoolLoading } = useCurrentSchool();

    const isAdmin = ['Administrator', 'Director'].includes(role || '');
    const canAccess = isAdmin;

    useEffect(() => {
        if (!isRoleLoading && role === 'Student') {
            router.replace('/dashboard');
        }
    }, [role, isRoleLoading, router]);

    // Data Fetching (School-Aware and Guarded)
    const studentsQuery = useMemoFirebase(() => (firestore && schoolId && canAccess) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, canAccess]);
    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);

    const classesQuery = useMemoFirebase(() => (firestore && schoolId && canAccess) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, canAccess]);
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

    // Report Data Calculation
    const reportData = useMemo(() => {
        if (!students || !classes) return null;
        const totalStudents = students.length;
        const genderDistribution = students.reduce((acc, student) => {
            const gender = student.gender || 'Other';
            acc[gender] = (acc[gender] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const genderPieData = Object.entries(genderDistribution).map(([name, value]) => ({ name, value }));
        const classEnrollment = classes.map(c => {
            const studentCount = students.filter(s => s.classId === c.id).length;
            return { name: c.name, students: studentCount };
        }).sort((a,b) => b.students - a.students);
        const averageClassSize = totalStudents > 0 && classes.length > 0 ? totalStudents / classes.length : 0;
        return { totalStudents, genderPieData, classEnrollment, averageClassSize: parseFloat(averageClassSize.toFixed(1)) };
    }, [students, classes]);

    const isLoading = isSchoolLoading || isRoleLoading || isLoadingStudents || isLoadingClasses;

    if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary h-8 w-8"/></div>;

    if (!canAccess) {
        return (
            <div className="p-8 flex justify-center">
                <Card className="max-w-md w-full border-red-100 bg-red-50/50">
                    <CardHeader className="text-center">
                        <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4"><ShieldAlert className="h-8 w-8 text-red-600" /></div>
                        <CardTitle>Access Restricted</CardTitle>
                        <CardDescription>Enrollment reports are restricted to administrators.</CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-center"><Button asChild variant="outline"><Link href="/dashboard">Back to Dashboard</Link></Button></CardFooter>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="space-y-6" id="report-content">
            <div className="flex items-center justify-between print:hidden">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2"><Users /> Enrollment Reports</h1>
                    <p className="text-muted-foreground">Analyze student demographics and class sizes.</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline"><Link href="/dashboard/reports/academics">Academics</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/attendance">Attendance</Link></Button>
                    <Button onClick={() => window.print()}><Printer className="mr-2"/>Print</Button>
                </div>
            </div>

            {reportData ? (
                <>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card><CardHeader><CardTitle>Total Students</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{reportData.totalStudents}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle>Average Class Size</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{reportData.averageClassSize}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle>Total Classes</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{classes?.length || 0}</p></CardContent></Card>
                    </div>

                    <div className="grid md:grid-cols-5 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader><CardTitle>Demographics</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart><Pie data={reportData.genderPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{reportData.genderPieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={GENDER_COLORS[entry.name as keyof typeof GENDER_COLORS]} />))}</Pie><Tooltip /><Legend /></PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                         <Card className="md:col-span-3">
                            <CardHeader><CardTitle>By Class</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                     <BarChart data={reportData.classEnrollment} layout="vertical" margin={{ left: 30 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" allowDecimals={false} /><YAxis dataKey="name" type="category" width={80} /><Tooltip /><Bar dataKey="students" fill="hsl(var(--primary))" /></BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                     <Card>
                        <CardHeader><CardTitle>Student Roster</CardTitle></CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>ID</TableHead><TableHead>Class</TableHead><TableHead>Gender</TableHead></TableRow></TableHeader>
                                <TableBody>{students?.map(s => (<TableRow key={s.id}><TableCell>{s.firstName} {s.lastName}</TableCell><TableCell className="font-mono text-xs">{formatStudentId(s)}</TableCell><TableCell>{classes?.find(c => c.id === s.classId)?.name || 'N/A'}</TableCell><TableCell>{s.gender}</TableCell></TableRow>))}</TableBody>
                            </Table>
                        </CardContent>
                     </Card>
                </>
            ) : <div className="text-center py-20 bg-muted rounded-lg"><p className="text-muted-foreground">No data available.</p></div>}
        </div>
    );
}
