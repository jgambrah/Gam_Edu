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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Printer, BarChart2, Users, Loader2, ShieldAlert } from 'lucide-react';
import { Class, Subject, Student, Assessment } from '@/lib/types';
import Link from 'next/link';
import { useUser } from '@/firebase/provider';
import { useCurrentSchool } from '@/hooks/use-current-school';

const getGradeForScore = (score: number): 'A' | 'B' | 'C' | 'D' | 'F' | 'N/A' => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    if (score > 0) return 'F';
    return 'N/A';
};

export default function AcademicReportsPage() {
    const { role, loading: isRoleLoading } = useRole();
    const router = useRouter();
    const firestore = useFirestore();
    const { user } = useUser();
    const { schoolId, loading: isSchoolLoading } = useCurrentSchool();
    
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

    const isAdmin = ['Administrator', 'Director'].includes(role || '');
    const isTeacher = role === 'Teacher';
    const canAccess = isAdmin || isTeacher;

    useEffect(() => {
        if (!isRoleLoading && role === 'Student') {
            router.replace('/dashboard');
        }
    }, [role, isRoleLoading, router]);

    // Data Fetching with schoolId and role guard
    const classesQuery = useMemoFirebase(() => {
        if (!user || !firestore || !schoolId || !canAccess) return null;
        let q = query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
        if (role === 'Teacher') {
            q = query(q, where('teacherId', '==', user.uid));
        }
        return q;
    }, [firestore, user, role, schoolId, canAccess]);

    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

    const subjectsQuery = useMemoFirebase(() => (firestore && schoolId && canAccess) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, canAccess]);
    const { data: subjects, isLoading: isLoadingSubjects } = useCollection<Subject>(subjectsQuery);

    const studentsQuery = useMemoFirebase(() => (firestore && selectedClassId && schoolId && canAccess) ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId), where('schoolId', '==', schoolId)) : null, [firestore, selectedClassId, schoolId, canAccess]);
    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);

    const assessmentsQuery = useMemoFirebase(() => (firestore && selectedClassId && selectedSubjectId && schoolId && canAccess) ? query(collection(firestore, 'assessments'), where('schoolId', '==', schoolId), where('classId', '==', selectedClassId), where('subjectId', '==', selectedSubjectId)) : null, [firestore, selectedClassId, selectedSubjectId, schoolId, canAccess]);
    const { data: assessments, isLoading: isLoadingAssessments } = useCollection<Assessment>(assessmentsQuery);

    // Report Data Calculation
    const reportData = useMemo(() => {
        if (!students || !assessments || students.length === 0) return null;

        const studentAverages = students.map(student => {
            const studentAssessments = assessments.filter(a => a.studentId === student.uid && a.score != null && a.maxScore != null);
            if (studentAssessments.length === 0) return { studentName: `${student.firstName} ${student.lastName}`, average: 0 };
            const totalScore = studentAssessments.reduce((sum, a) => sum + a.score!, 0);
            const totalMaxScore = studentAssessments.reduce((sum, a) => sum + a.maxScore!, 0);
            const average = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
            return { studentName: `${student.firstName} ${student.lastName}`, average: parseFloat(average.toFixed(2)) };
        });

        const validAverages = studentAverages.filter(s => s.average > 0);
        const classAverage = validAverages.length > 0 ? validAverages.reduce((sum, s) => sum + s.average, 0) / validAverages.length : 0;
        const gradeDistribution = studentAverages.reduce((acc, curr) => {
            const grade = getGradeForScore(curr.average);
            if (grade !== 'N/A') acc[grade] = (acc[grade] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return { studentAverages, classAverage: parseFloat(classAverage.toFixed(2)), chartData: Object.entries(gradeDistribution).map(([name, count]) => ({ name, count })) };
    }, [students, assessments]);

    const isLoading = isSchoolLoading || isRoleLoading || isLoadingClasses || isLoadingSubjects;

    if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary h-8 w-8"/></div>;

    if (!canAccess) {
        return (
            <div className="p-8 flex justify-center">
                <Card className="max-w-md w-full border-red-100 bg-red-50/50">
                    <CardHeader className="text-center">
                        <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4"><ShieldAlert className="h-8 w-8 text-red-600" /></div>
                        <CardTitle>Access Restricted</CardTitle>
                        <CardDescription>Academic reports are for staff only.</CardDescription>
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
                    <h1 className="text-3xl font-bold flex items-center gap-2"><FileText /> Academic Reports</h1>
                    <p className="text-muted-foreground">Analyze student performance and grade distributions.</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline"><Link href="/dashboard/reports/enrollment">Enrollment</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/attendance">Attendance</Link></Button>
                    <Button onClick={() => window.print()}><Printer className="mr-2"/>Print</Button>
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
                <CardContent className="flex gap-4">
                    <Select onValueChange={setSelectedClassId} disabled={isLoadingClasses}>
                        <SelectTrigger className="w-[280px]"><SelectValue placeholder="Select a Class" /></SelectTrigger>
                        <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select onValueChange={setSelectedSubjectId} disabled={!selectedClassId || isLoadingSubjects}>
                        <SelectTrigger className="w-[280px]"><SelectValue placeholder="Select a Subject" /></SelectTrigger>
                        <SelectContent>{subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                </CardContent>
            </Card>
            
            {!selectedClassId || !selectedSubjectId ? (
                <div className="text-center py-20 bg-muted rounded-lg"><p className="text-muted-foreground">Please select a class and subject to view the report.</p></div>
            ) : isLoadingStudents || isLoadingAssessments ? (
                 <div className="text-center py-20 bg-muted rounded-lg"><p className="text-muted-foreground">Loading report data...</p></div>
            ) : reportData ? (
                <div className="grid md:grid-cols-5 gap-6">
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BarChart2/> Overview</CardTitle>
                            <CardDescription>Class Average: <span className="font-bold text-primary">{reportData.classAverage}%</span></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={reportData.chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Legend /><Bar dataKey="count" fill="hsl(var(--primary))" name="Number of Students" /></BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-2">
                        <CardHeader><CardTitle>Student Scores</CardTitle></CardHeader>
                        <CardContent>
                            <Table><TableHeader><TableRow><TableHead>Student Name</TableHead><TableHead className="text-right">Average (%)</TableHead></TableRow></TableHeader>
                                <TableBody>{reportData.studentAverages.map(s => (<TableRow key={s.studentName}><TableCell>{s.studentName}</TableCell><TableCell className="text-right">{s.average > 0 ? s.average : 'N/A'}</TableCell></TableRow>))}</TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="text-center py-20 bg-muted rounded-lg"><p className="text-muted-foreground">No assessment data available for this selection.</p></div>
            )}
        </div>
    );
}
