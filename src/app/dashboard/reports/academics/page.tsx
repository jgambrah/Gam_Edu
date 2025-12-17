

'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Printer, BarChart2, Users } from 'lucide-react';
import { Class, Subject, Student, Assessment } from '@/lib/types';
import Link from 'next/link';
import { useUser } from '@/firebase/provider';

const getGradeForScore = (score: number): 'A' | 'B' | 'C' | 'D' | 'F' | 'N/A' => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    if (score > 0) return 'F';
    return 'N/A';
};

export default function AcademicReportsPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { user } = useUser();
    const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

    const canAccess = ['Administrator', 'Director', 'Teacher'].includes(role);

    // Data Fetching
    const classesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        if (role === 'Teacher') {
            return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
        }
        return collection(firestore, 'classes');
    }, [firestore, user, role]);

    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

    const subjectsQuery = useMemoFirebase(() => collection(firestore, 'subjects'), [firestore]);
    const { data: subjects, isLoading: isLoadingSubjects } = useCollection<Subject>(subjectsQuery);

    const studentsQuery = useMemoFirebase(() => selectedClassId ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId)) : null, [firestore, selectedClassId]);
    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);

    const assessmentsQuery = useMemoFirebase(() => (selectedClassId && selectedSubjectId) ? query(collection(firestore, 'assessments'), where('classId', '==', selectedClassId), where('subjectId', '==', selectedSubjectId)) : null, [firestore, selectedClassId, selectedSubjectId]);
    const { data: assessments, isLoading: isLoadingAssessments } = useCollection<Assessment>(assessmentsQuery);

    // Report Data Calculation
    const reportData = useMemo(() => {
        if (!students || !assessments || students.length === 0) {
            return null;
        }

        const studentAverages = students.map(student => {
            const studentAssessments = assessments.filter(a => a.studentId === student.uid && a.score != null && a.maxScore != null);
            if (studentAssessments.length === 0) {
                return { studentName: `${student.firstName} ${student.lastName}`, average: 0 };
            }
            const totalScore = studentAssessments.reduce((sum, a) => sum + a.score!, 0);
            const totalMaxScore = studentAssessments.reduce((sum, a) => sum + a.maxScore!, 0);
            const average = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
            return { studentName: `${student.firstName} ${student.lastName}`, average: parseFloat(average.toFixed(2)) };
        });

        const validAverages = studentAverages.filter(s => s.average > 0);
        const classAverage = validAverages.length > 0
            ? validAverages.reduce((sum, s) => sum + s.average, 0) / validAverages.length
            : 0;

        const gradeDistribution = studentAverages.reduce((acc, curr) => {
            const grade = getGradeForScore(curr.average);
            if (grade !== 'N/A') {
                acc[grade] = (acc[grade] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(gradeDistribution).map(([name, count]) => ({ name, count }));

        return {
            studentAverages,
            classAverage: parseFloat(classAverage.toFixed(2)),
            chartData,
        };

    }, [students, assessments]);


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
                    <h1 className="text-3xl font-bold flex items-center gap-2"><FileText /> Academic Reports</h1>
                    <p className="text-muted-foreground">Analyze student performance and grade distributions.</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline"><Link href="/dashboard/reports/enrollment">Enrollment</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/attendance">Attendance</Link></Button>
                    <Button asChild variant="outline"><Link href="#">Financials</Link></Button>
                    <Button onClick={() => window.print()}><Printer className="mr-2"/>Print</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>Select a class and subject to generate a report.</CardDescription>
                </CardHeader>
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
                <div className="text-center py-20 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Please select a class and subject to view the report.</p>
                </div>
            ) : isLoadingStudents || isLoadingAssessments ? (
                 <div className="text-center py-20 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Loading report data...</p>
                </div>
            ) : reportData ? (
                <div className="grid md:grid-cols-5 gap-6">
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BarChart2/> Class Performance Overview</CardTitle>
                            <CardDescription>
                                Class Average for Selected Subject: <span className="font-bold text-primary">{reportData.classAverage}%</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={reportData.chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="hsl(var(--primary))" name="Number of Students" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Student Scores</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead className="text-right">Average Score (%)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.studentAverages.map(s => (
                                        <TableRow key={s.studentName}>
                                            <TableCell>{s.studentName}</TableCell>
                                            <TableCell className="text-right">{s.average > 0 ? s.average : 'N/A'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="text-center py-20 bg-muted rounded-lg">
                    <p className="text-muted-foreground">No assessment data available for this class and subject combination.</p>
                </div>
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
