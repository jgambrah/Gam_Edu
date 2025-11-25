'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, BookOpen, Percent, TrendingUp } from 'lucide-react';
import { Assessment, Class, Student, Subject, TimetableEntry } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

// --- Grade Calculation Utilities ---
function calculateStudentSubjectAverage(studentId: string, subjectId: string, assessments: Assessment[]) {
  const relevantAssessments = assessments.filter(a => 
    a.studentId === studentId && 
    a.subjectId === subjectId && 
    typeof a.score === 'number' && 
    typeof a.maxScore === 'number' &&
    a.maxScore > 0
  );

  if (relevantAssessments.length === 0) return null;

  const totalScore = relevantAssessments.reduce((sum, a) => sum + a.score!, 0);
  const totalMaxScore = relevantAssessments.reduce((sum, a) => sum + a.maxScore!, 0);

  return totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
}

function calculateClassSubjectAverage(students: Student[], subjectId: string, assessments: Assessment[]) {
    const studentAverages = students
        .map(student => calculateStudentSubjectAverage(student.uid, subjectId, assessments))
        .filter(avg => avg !== null) as number[];

    if (studentAverages.length === 0) return 'N/A';
    
    const classAverage = studentAverages.reduce((sum, avg) => sum + avg, 0) / studentAverages.length;
    return `${classAverage.toFixed(1)}%`;
}

// --- Subject-Specific Gradebook Component ---
function SubjectGradebook({ subject, students, assessments }: { subject: Subject; students: Student[]; assessments: Assessment[] }) {
    const subjectAssessments = useMemo(() => {
        return [...new Set(assessments.filter(a => a.subjectId === subject.id).map(a => a.assessmentName))];
    }, [assessments, subject.id]);

    const studentGrades = useMemo(() => {
        return students.map(student => {
            const grades: Record<string, string> = {};
            subjectAssessments.forEach(assessmentName => {
                const assessment = assessments.find(a => 
                    a.studentId === student.uid && 
                    a.subjectId === subject.id && 
                    a.assessmentName === assessmentName
                );
                grades[assessmentName] = (assessment && typeof assessment.score === 'number') 
                    ? `${assessment.score}/${assessment.maxScore}` 
                    : 'N/A';
            });

            const overallAverage = calculateStudentSubjectAverage(student.uid, subject.id, assessments);

            return {
                studentId: student.uid,
                studentName: `${student.firstName} ${student.lastName}`,
                grades,
                overall: overallAverage !== null ? `${overallAverage.toFixed(1)}%` : 'N/A',
            };
        });
    }, [students, assessments, subject.id, subjectAssessments]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> {subject.name}</CardTitle>
                <CardDescription>
                    Class Average for this subject: <strong>{calculateClassSubjectAverage(students, subject.id, assessments)}</strong>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student Name</TableHead>
                            {subjectAssessments.map(name => <TableHead key={name} className="text-center">{name}</TableHead>)}
                            <TableHead className="text-right font-bold">Overall</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentGrades.map(row => (
                            <TableRow key={row.studentId}>
                                <TableCell className="font-medium">{row.studentName}</TableCell>
                                {subjectAssessments.map(name => <TableCell key={name} className="text-center">{row.grades[name]}</TableCell>)}
                                <TableCell className="text-right font-bold">{row.overall}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// --- Main Page Component ---
export default function Gradebook2Page() {
    const { role, user } = useRole();
    const firestore = useFirestore();
    const [selectedClassId, setSelectedClassId] = useState('');

    const canAccess = ['Teacher', 'Administrator', 'Director'].includes(role);

    // Fetch classes based on role
    const classesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        if (role === 'Teacher') return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
        return collection(firestore, 'classes');
    }, [firestore, user, role]);
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

    // Fetch data for the selected class
    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(
        useMemoFirebase(() => selectedClassId ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId)) : null, [firestore, selectedClassId])
    );
    const { data: assessments, isLoading: isLoadingAssessments } = useCollection<Assessment>(
        useMemoFirebase(() => selectedClassId ? query(collection(firestore, 'assessments'), where('classId', '==', selectedClassId)) : null, [firestore, selectedClassId])
    );
    const { data: timetableEntries } = useCollection<TimetableEntry>(
        useMemoFirebase(() => selectedClassId ? query(collection(firestore, 'timetables'), where('classId', '==', selectedClassId)) : null, [firestore, selectedClassId])
    );
    const { data: allSubjects } = useCollection<Subject>(
        useMemoFirebase(() => collection(firestore, 'subjects'), [firestore])
    );
    
    // Determine subjects taught in the selected class from the timetable
    const subjectsInClass = useMemo(() => {
        if (!timetableEntries || !allSubjects) return [];
        const subjectIds = [...new Set(timetableEntries.map(entry => entry.subjectId))];
        return allSubjects.filter(subject => subjectIds.includes(subject.id));
    }, [timetableEntries, allSubjects]);

    const isLoadingData = isLoadingStudents || isLoadingAssessments;

    if (!canAccess) {
        return <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This feature is for Teachers and Administrators only.</CardDescription></CardHeader></Card>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Gradebook v2</CardTitle>
                    <CardDescription>Select a class to view student grades organized by subject.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full md:w-1/3">
                        <Select onValueChange={setSelectedClassId} value={selectedClassId} disabled={isLoadingClasses}>
                            <SelectTrigger><SelectValue placeholder="Select a class..." /></SelectTrigger>
                            <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {selectedClassId && (
                isLoadingData ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : students && subjectsInClass.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {subjectsInClass.map(subject => (
                            <AccordionItem value={subject.id} key={subject.id} className="border-none">
                                <SubjectGradebook subject={subject} students={students} assessments={assessments || []} />
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <Card>
                        <CardContent className="py-20 text-center">
                            <p className="text-muted-foreground">No students or subjects found for this class.</p>
                        </CardContent>
                    </Card>
                )
            )}
        </div>
    );
}
