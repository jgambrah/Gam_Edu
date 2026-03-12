
'use client';

import { AppLogo } from '@/components/icons/app-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { Assessment, ReportCardComment, ReportCard, Subject } from '@/lib/types';
import { collection, query, where, doc } from 'firebase/firestore';
import { useMemo, useState, useEffect } from 'react';
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

    // FETCH BRANDING FROM PUBLIC PATH (accessible to all)
    const schoolProfileRef = useMemoFirebase(
      () => (firestore && schoolId ? doc(firestore, 'schoolSettings', schoolId) : null),
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
        <CardContent className="p-8">
            {/* PROFESSIONAL LETTERHEAD */}
            <div className="flex items-center justify-between border-b-4 border-double border-slate-800 pb-6 mb-6">
                <div className="w-32 h-32 flex-shrink-0 flex items-center justify-center">
                    {schoolProfile?.logoUrl ? (
                        <img 
                            src={schoolProfile.logoUrl} 
                            alt="School Logo" 
                            className="max-w-full max-h-full object-contain"
                            crossOrigin="anonymous" 
                        />
                    ) : (
                        <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 text-xs text-center">No Logo</div>
                    )}
                </div>

                <div className="flex-1 text-center px-4">
                    <h1 className="text-4xl font-black uppercase tracking-widest text-black">{schoolProfile?.name || "SCHOOL NAME"}</h1>
                    {schoolProfile?.motto && <p className="text-sm italic text-slate-600 mt-1">"{schoolProfile.motto}"</p>}
                    <p className="text-sm font-bold mt-2 text-black">{schoolProfile?.address || ""}</p>
                    <p className="text-sm font-bold text-black">{schoolProfile?.phone || ""} | {schoolProfile?.email || ""}</p>
                </div>

                <div className="w-32 flex-shrink-0"></div>
            </div>

            <h2 className="text-2xl font-bold text-center mt-6 bg-slate-100 py-2 border border-slate-300 uppercase text-black">Terminal Report</h2>

            <div className="grid grid-cols-2 gap-4 my-8 text-sm border-2 p-4 font-medium text-black bg-slate-50/50">
                <p><span className='font-bold'>Student Name:</span> {student.firstName} {student.lastName}</p>
                <p><span className='font-bold'>Class:</span> {student.classId}</p>
                <p><span className='font-bold'>Term:</span> {term}</p>
                <p><span className='font-bold'>Academic Year:</span> {year}</p>
            </div>

            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-100 border-slate-800">
                        <TableHead className="text-black font-bold">Subject</TableHead>
                        <TableHead className="text-center text-black font-bold">Final Score (%)</TableHead>
                        <TableHead className="text-center text-black font-bold">Grade</TableHead>
                        <TableHead className="text-black font-bold">Teacher's Comment</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reportCardData.map(data => (
                        <TableRow key={data.subject} className="border-slate-200">
                            <TableCell className="font-bold text-black">{data.subject}</TableCell>
                            <TableCell className="text-center text-black">{data.percentage > 0 ? data.percentage : 'N/A'}</TableCell>
                            <TableCell className="text-center font-bold text-black">{data.finalGrade}</TableCell>
                            <TableCell className="text-sm text-slate-600 italic">{data.comment}</TableCell>
                        </TableRow>
                    ))}
                    {reportCardData.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-4 italic">No subjects or grades found for this term.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Separator className="my-8 bg-slate-800" />

            <div className="grid grid-cols-2 gap-8">
                <Card className="border-2 border-slate-200 shadow-none">
                    <CardHeader className="py-3 bg-slate-50 border-b"><CardTitle className="text-sm uppercase font-bold text-slate-600">Overall Performance</CardTitle></CardHeader>
                    <CardContent className="text-center py-6">
                        <p className="text-5xl font-black text-black">{overall.finalGrade}</p>
                        <p className="text-slate-500 font-bold mt-1">({overall.percentage}%)</p>
                    </CardContent>
                </Card>
                <Card className="border-2 border-slate-200 shadow-none">
                    <CardHeader className="py-3 bg-slate-50 border-b"><CardTitle className="text-sm uppercase font-bold text-slate-600">General Remarks</CardTitle></CardHeader>
                    <CardContent className="py-6">
                        <p className="text-sm text-slate-600 italic">"Keep up the hard work and focus on areas requiring improvement."</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-around pt-20">
                <div className="text-center w-48">
                    <div className="border-b-2 border-black mb-2"></div>
                    <p className="text-xs font-bold uppercase text-black">Class Teacher</p>
                </div>
                <div className="text-center w-48">
                    <div className="border-b-2 border-black mb-2"></div>
                    <p className="text-xs font-bold uppercase text-black">Head of School</p>
                </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-8 print:hidden">
            <Button onClick={() => window.print()} className="bg-black text-white hover:bg-slate-800">
                <Printer className="mr-2 h-4 w-4" /> Print Report
            </Button>
        </CardFooter>
      </Card>
    );
}
