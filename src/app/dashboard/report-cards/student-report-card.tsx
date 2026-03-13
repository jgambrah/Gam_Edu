'use client';

import { AppLogo } from '@/components/icons/app-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { Assessment, ReportCardComment, ReportCard, Subject } from '@/lib/types';
import { collection, query, where, doc } from 'firebase/firestore';
import { useMemo } from 'react';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Skeleton } from '@/components/ui/skeleton';

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

export function StudentReportCard({ student, term, year }: { student: Student, term: string, year: string }) {
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

    const schoolProfileRef = useMemoFirebase(
      () => (firestore && schoolId ? doc(firestore, 'schools', schoolId) : null),
      [firestore, schoolId]
    );
    const { data: schoolProfile, isLoading: isLoadingProfile } = useDoc(schoolProfileRef);
    
    const subjectsQuery = useMemoFirebase(
        () => (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, 
        [firestore, schoolId]
    );
    const { data: subjects, isLoading: isLoadingSubjects } = useCollection<Subject>(subjectsQuery);

    // Fetch all assessments for the student for the specific term and year
    const assessmentsQuery = useMemoFirebase(
      () => student ? query(
          collection(firestore, 'assessments'), 
          where('studentId', '==', student.uid),
          where('academicYear', '==', year),
          where('term', '==', term)
        ) : null,
      [firestore, student, year, term]
    );
    const { data: assessments, isLoading: isLoadingAssessments } = useCollection<Assessment>(assessmentsQuery);

    const reportCardId = `${student.uid}-${year}-${term}`;
    const commentsQuery = useMemoFirebase(
      () => query(collection(firestore, `report-cards/${reportCardId}/comments`)),
      [firestore, reportCardId]
    );
    const { data: comments, isLoading: isLoadingComments } = useCollection<ReportCardComment>(commentsQuery);

    const reportCardData = useMemo(() => {
        if (!assessments || !subjects) return [];
        return subjects.map(subject => {
            const { finalGrade, percentage } = calculateStudentGradeForSubject(student.uid, subject.id, assessments);
            const comment = comments?.find(c => c.subjectId === subject.id)?.comment || '';
            return {
                subject: subject.name,
                finalGrade,
                percentage,
                comment,
            }
        });
    }, [assessments, comments, student.uid, subjects]);

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
    
    const isLoading = isLoadingSchool || isLoadingProfile || isLoadingSubjects || isLoadingAssessments || isLoadingComments;

    if (isLoading) {
        return (
            <div className="space-y-4 p-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        );
    }
  
    return (
      <Card className="w-full max-w-4xl mx-auto print:shadow-none print:border-none">
        <CardHeader className="text-center print:text-left">
            <div className='flex items-center justify-center print:justify-start gap-4'>
                <AppLogo className="h-12 w-12 text-primary" />
                <div>
                    <CardTitle className="text-3xl">{schoolProfile?.name || 'School Name Not Set'}</CardTitle>
                    <p className="text-muted-foreground">Student Report Card - {year}</p>
                </div>
            </div>
            <Separator className="my-4"/>
            <div className='text-left text-sm'>
                <p><span className='font-semibold'>Student Name:</span> {student.firstName} {student.lastName}</p>
                <p><span className='font-semibold'>Class:</span> {student.classId}</p>
                <p><span className='font-semibold'>Term:</span> {term}</p>
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
                    {reportCardData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-4">No subjects or grades found for this term.</TableCell>
                        </TableRow>
                    )}
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
