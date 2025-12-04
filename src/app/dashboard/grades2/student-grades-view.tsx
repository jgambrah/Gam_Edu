
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { Assessment, FinancialRecord } from '@/lib/types';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

type Student = { uid: string; firstName: string; lastName: string; classId: string; id: string; };

export function StudentGradesView({ student, term, year, financialRecords }: { student: Student, term: string, year: string, financialRecords: FinancialRecord[] }) {
    const firestore = useFirestore();

    const assessmentsQuery = useMemoFirebase(
      () => student ? query(collection(firestore, 'assessments'), where('studentId', '==', student.uid), where('term', '==', term), where('academicYear', '==', year)) : null,
      [firestore, student, term, year]
    );
    const { data: assessments } = useCollection<Assessment>(assessmentsQuery);

    const overall = useMemo(() => {
        if (!assessments || assessments.length === 0) return { finalGrade: 'N/A', percentage: 0 };
        const totalScore = assessments.reduce((acc, a) => acc + (a.score || 0), 0);
        const maxScore = assessments.reduce((acc, a) => acc + (a.maxScore || 0), 0);
        const overallPercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

        let finalGrade = 'N/A';
        if (overallPercentage >= 90) finalGrade = 'A';
        else if (overallPercentage >= 80) finalGrade = 'B';
        else if (overallPercentage >= 70) finalGrade = 'C';
        else if (overallPercentage >= 60) finalGrade = 'D';
        else if (overallPercentage > 0) finalGrade = 'F';

        return { finalGrade, percentage: parseFloat(overallPercentage.toFixed(1)) };
    }, [assessments]);
  
    return (
      <Card className="w-full max-w-4xl mx-auto print:shadow-none print:border-none">
        <CardHeader className="text-center print:text-left">
            <CardTitle className="text-3xl">Student Grade Summary</CardTitle>
            <CardDescription>{year} - {term}</CardDescription>
            <Separator className="my-4"/>
            <div className='text-left text-sm'>
                <p><span className='font-semibold'>Student Name:</span> {student.firstName} {student.lastName}</p>
                <p><span className='font-semibold'>Class:</span> {student.classId}</p>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Assessment</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assessments?.map(assessment => (
                        <TableRow key={assessment.id}>
                            <TableCell className="font-medium">{assessment.assessmentName}</TableCell>
                            <TableCell>{assessment.assessmentType}</TableCell>
                            <TableCell>{assessment.subjectId}</TableCell>
                            <TableCell className="text-right">{assessment.score} / {assessment.maxScore}</TableCell>
                        </TableRow>
                    ))}
                     {(!assessments || assessments.length === 0) && <TableRow><TableCell colSpan={4} className="text-center h-24">No assessments recorded for this period.</TableCell></TableRow>}
                </TableBody>
            </Table>
            <Separator className="my-6" />
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardHeader><CardTitle>Overall Summary</CardTitle></CardHeader>
                    <CardContent className="text-center">
                        <p className="text-5xl font-bold">{overall.finalGrade}</p>
                        <p className="text-muted-foreground">({overall.percentage}%)</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Teacher Comments</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">No general comments for this term.</p>
                    </CardContent>
                </Card>
            </div>
        </CardContent>
        <CardFooter className="flex justify-end print:hidden">
            <Button onClick={() => window.print()}>Print Report</Button>
        </CardFooter>
      </Card>
    );
  }
