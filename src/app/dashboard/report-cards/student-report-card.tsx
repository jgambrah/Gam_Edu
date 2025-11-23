
'use client';

import { AppLogo } from '@/components/icons/app-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { MOCK_ACADEMIC_YEARS, MOCK_SUBJECTS, MOCK_TERMS } from '@/lib/data';
import { Assessment, ReportCardComment } from '@/lib/types';
import { collection, query, where } from 'firebase/firestore';
import { useState, useMemo } from 'react';

type Student = { uid: string; firstName: string; lastName: string; classId: string; id: string; };

// This is a mock function. A real implementation would be more complex.
function calculateStudentGradeForSubject(studentId: string, subjectId: string, assessments: Assessment[]) {
    const subjectAssessments = assessments.filter(a => a.studentId === studentId && a.subjectId === subjectId && a.score !== undefined && a.maxScore !== undefined);
    if (subjectAssessments.length === 0) return { finalGrade: 'N/A', percentage: 0 };
  
    const totalScore = subjectAssessments.reduce((acc, a) => acc + a.score!, 0);
    const maxScore = subjectAssessments.reduce((acc, a) => acc + a.maxScore!, 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  
    let finalGrade = 'N/A';
    if (percentage >= 90) finalGrade = 'A';
    else if (percentage >= 80) finalGrade = 'B';
    else if (percentage >= 70) finalGrade = 'C';
    else if (percentage >= 60) finalGrade = 'D';
    else if (percentage > 0) finalGrade = 'F';
    
    return { finalGrade, percentage: parseFloat(percentage.toFixed(1)) };
}

export function StudentReportCard({ student }: { student: Student }) {
    const firestore = useFirestore();
    const [selectedTerm, setSelectedTerm] = useState(MOCK_TERMS[0]);
    const [selectedYear, setSelectedYear] = useState(MOCK_ACADEMIC_YEARS[0]);

    // Fetch all assessments for the student
    const assessmentsQuery = useMemoFirebase(
      () => student ? query(collection(firestore, 'assessments'), where('studentId', '==', student.uid)) : null,
      [firestore, student]
    );
    const { data: assessments } = useCollection<Assessment>(assessmentsQuery);

    const reportCardId = `${student.uid}-${selectedYear}-${selectedTerm}`;
    const commentsQuery = useMemoFirebase(
      () => query(collection(firestore, `report-cards/${reportCardId}/comments`)),
      [firestore, reportCardId]
    );
    const { data: comments } = useCollection<ReportCardComment>(commentsQuery);

    const reportCardData = useMemo(() => {
        if (!assessments) return [];
        return MOCK_SUBJECTS.map(subject => {
            const { finalGrade, percentage } = calculateStudentGradeForSubject(student.uid, subject.id, assessments);
            const comment = comments?.find(c => c.subjectId === subject.id)?.comment || '';
            return {
                subject: subject.name,
                finalGrade,
                percentage,
                comment,
            }
        });
    }, [assessments, comments, student.uid]);

    const overall = useMemo(() => {
        const validGrades = reportCardData.filter(d => d.percentage > 0);
        if (validGrades.length === 0) return { finalGrade: 'N/A', percentage: 0 };
        const totalPercentage = validGrades.reduce((acc, d) => acc + d.percentage, 0);
        const overallPercentage = totalPercentage / validGrades.length;

        let finalGrade = 'N/A';
        if (overallPercentage >= 90) finalGrade = 'A';
        else if (overallPercentage >= 80) finalGrade = 'B';
        else if (overallPercentage >= 70) finalGrade = 'C';
        else if (overallPercentage >= 60) finalGrade = 'D';
        else if (overallPercentage > 0) finalGrade = 'F';

        return { finalGrade, percentage: parseFloat(overallPercentage.toFixed(1)) };
    }, [reportCardData]);
  
    return (
      <Card className="w-full max-w-4xl mx-auto print:shadow-none print:border-none">
        <CardHeader className="text-center print:text-left">
            <div className='flex items-center justify-center print:justify-start gap-4'>
                <AppLogo className="h-12 w-12 text-primary" />
                <div>
                    <CardTitle className="text-3xl">SunnySide High School</CardTitle>
                    <p className="text-muted-foreground">Student Report Card - {selectedYear}</p>
                </div>
            </div>
            <Separator className="my-4"/>
            <div className='text-left text-sm'>
                <p><span className='font-semibold'>Student Name:</span> {student.firstName} {student.lastName}</p>
                <p><span className='font-semibold'>Class:</span> {student.classId}</p>
                <p><span className='font-semibold'>Term:</span> {selectedTerm}</p>
            </div>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-center">Final Score (%)</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                        <TableHead>Teacher's Comment</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportCardData.map(data => (
                        <TableRow key={data.subject}>
                            <TableCell className="font-medium">{data.subject}</TableCell>
                            <TableCell className="text-center">{data.percentage > 0 ? data.percentage : 'N/A'}</TableCell>
                            <TableCell className="text-center font-semibold">{data.finalGrade}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{data.comment}</TableCell>
                        </TableRow>
                    ))}
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
                    <CardHeader><CardTitle>General Comments</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">No general comments for this term.</p>
                    </CardContent>
                </Card>
            </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-8 pt-8 print:block">
            <div className="flex justify-around pt-16">
                <div className="text-center">
                    <Separator className="mb-2" />
                    <p className="text-sm font-semibold">Class Teacher</p>
                </div>
                <div className="text-center">
                    <Separator className="mb-2" />
                    <p className="text-sm font-semibold">Head of School</p>
                </div>
            </div>
            <div className="flex justify-end print:hidden">
                <Button onClick={() => window.print()}>Print Report</Button>
            </div>
        </CardFooter>
      </Card>
    );
  }
  

    