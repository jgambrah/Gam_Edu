
'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FileText, Printer, Users } from 'lucide-react';
import { Class, Student } from '@/lib/types';
import Link from 'next/link';
import { formatStudentId } from '@/lib/student-utils';

const GENDER_COLORS = {
    Male: '#3b82f6', // blue-500
    Female: '#ec4899', // pink-500
    Other: '#a855f7', // purple-500
};

export default function EnrollmentReportsPage() {
    const { role } = useRole();
    const firestore = useFirestore();

    const canAccess = ['Administrator', 'Director'].includes(role);

    // Data Fetching
    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(useMemoFirebase(() => firestore ? collection(firestore, 'students') : null, [firestore]));
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(useMemoFirebase(() => firestore ? collection(firestore, 'classes') : null, [firestore]));

    // Report Data Calculation
    const reportData = useMemo(() => {
        if (!students || !classes) {
            return null;
        }

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
        
        return {
            totalStudents,
            genderPieData,
            classEnrollment,
            averageClassSize: parseFloat(averageClassSize.toFixed(1)),
        };

    }, [students, classes]);


    if (!canAccess) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>This module is restricted to Administrators and Directors.</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    const isLoading = isLoadingStudents || isLoadingClasses;

    return (
        <div className="space-y-6" id="report-content">
            <div className="flex items-center justify-between print:hidden">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2"><Users /> Enrollment Reports</h1>
                    <p className="text-muted-foreground">Analyze student enrollment data and demographics.</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline"><Link href="/dashboard/reports/academics">Academics</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/attendance">Attendance</Link></Button>
                    <Button asChild variant="outline"><Link href="#">Financials</Link></Button>
                    <Button onClick={() => window.print()}><Printer className="mr-2"/>Print</Button>
                </div>
            </div>

            {isLoading ? <p>Loading report data...</p> : reportData ? (
                <>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader><CardTitle>Total Students</CardTitle></CardHeader>
                            <CardContent><p className="text-3xl font-bold">{reportData.totalStudents}</p></CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Average Class Size</CardTitle></CardHeader>
                            <CardContent><p className="text-3xl font-bold">{reportData.averageClassSize}</p></CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Total Classes</CardTitle></CardHeader>
                            <CardContent><p className="text-3xl font-bold">{classes?.length || 0}</p></CardContent>
                        </Card>
                    </div>

                    <div className="grid md:grid-cols-5 gap-6">
                        <Card className="md:col-span-2">
                            <CardHeader><CardTitle>Gender Distribution</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={reportData.genderPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                            {reportData.genderPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={GENDER_COLORS[entry.name as keyof typeof GENDER_COLORS]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                         <Card className="md:col-span-3">
                            <CardHeader><CardTitle>Enrollment by Class</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                     <BarChart data={reportData.classEnrollment} layout="vertical" margin={{ left: 30 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" allowDecimals={false} />
                                        <YAxis dataKey="name" type="category" width={80} />
                                        <Tooltip />
                                        <Bar dataKey="students" fill="hsl(var(--primary))" name="Number of Students" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                     <Card>
                        <CardHeader><CardTitle>Student Roster</CardTitle></CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader><TableRow><TableHead>First Name</TableHead><TableHead>Last Name</TableHead><TableHead>Student ID</TableHead><TableHead>Class</TableHead><TableHead>Gender</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {students?.map(s => (
                                        <TableRow key={s.id}>
                                            <TableCell>{s.firstName}</TableCell>
                                            <TableCell>{s.lastName}</TableCell>
                                            <TableCell className="font-mono text-xs">{formatStudentId(s)}</TableCell>
                                            <TableCell>{classes?.find(c => c.id === s.classId)?.name || 'N/A'}</TableCell>
                                            <TableCell>{s.gender}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                     </Card>
                </>
            ) : <p>No data available to generate reports.</p>}

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
