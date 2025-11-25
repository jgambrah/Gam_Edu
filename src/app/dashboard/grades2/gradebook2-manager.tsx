
'use client';

import { Suspense, useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, User, PlusCircle } from 'lucide-react';
import { StudentGradesView } from './student-grades-view';
import { Assessment } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AssessmentFeedbackForm } from '../assessments/assessment-feedback-form';

type Student = { uid: string; firstName: string; lastName: string; classId: string; id: string; };

// Helper to calculate overall grade for a student
function calculateStudentGrade(studentId: string, assessments: Assessment[]) {
    const studentAssessments = assessments.filter(a => a.studentId === studentId && a.score != null && a.maxScore != null && a.maxScore > 0);
    if (studentAssessments.length === 0) {
      return { finalGrade: 'N/A', percentage: 0 };
    }
  
    const totalScore = studentAssessments.reduce((acc, a) => acc + a.score!, 0);
    const maxScore = studentAssessments.reduce((acc, a) => acc + a.maxScore!, 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  
    let finalGrade = 'N/A';
    if (percentage >= 90) finalGrade = 'A';
    else if (percentage >= 80) finalGrade = 'B';
    else if (percentage >= 70) finalGrade = 'C';
    else if (percentage >= 60) finalGrade = 'D';
    else if (percentage >= 0) finalGrade = 'F';
    
    return { finalGrade, percentage: parseFloat(percentage.toFixed(1)) };
}


function StudentGradesDetail({ student, assessments }: { student: Student; assessments: Assessment[] }) {
    const studentAssessments = assessments.filter(a => a.studentId === student.uid && a.score != null && a.maxScore != null);

    return (
        <div className="space-y-4 p-4 bg-muted/50 rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Assessment Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {studentAssessments.length > 0 ? studentAssessments.map(a => (
                        <TableRow key={a.id}>
                            <TableCell>{a.assessmentName}</TableCell>
                            <TableCell>{a.assessmentType}</TableCell>
                            <TableCell className="text-right">{a.score}/{a.maxScore}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">No assessments recorded for this student.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

export default function Gradebook2Manager() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  
  const teacherClassesQuery = useMemoFirebase(
    () => user && (role === 'Administrator' || role === 'Director') ? collection(firestore, 'classes') : query(collection(firestore, 'classes'), where('teacherId', '==', user?.uid || '')),
    [firestore, user, role]
  );
  const { data: teacherClasses, isLoading: isLoadingClasses } = useCollection(teacherClassesQuery);

  const studentsQuery = useMemoFirebase(
    () => selectedClassId ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId)) : null,
    [firestore, selectedClassId]
  );
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);
  
  const assessmentsQuery = useMemoFirebase(() => {
    if (!selectedClassId) return null;
    return query(
        collection(firestore, 'assessments'),
        where('classId', '==', selectedClassId)
    );
  }, [firestore, selectedClassId]);
  const { data: assessments, isLoading: isLoadingAssessments } = useCollection<Assessment>(assessmentsQuery);

  const isLoading = isLoadingClasses || (selectedClassId && (isLoadingStudents || isLoadingAssessments));

  const toggleForm = (formName: string) => {
    setActiveForm(activeForm === formName ? null : formName);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <CardTitle className="flex items-center gap-2"><TrendingUp /> Gradebook</CardTitle>
                    <CardDescription>Select a class to view student grades and performance.</CardDescription>
                </div>
                <Button variant={activeForm === 'grade' ? 'default' : 'outline'} onClick={() => toggleForm('grade')} disabled={!selectedClassId}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Grade Entry
                </Button>
            </div>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedClassId} disabled={isLoadingClasses}>
            <SelectTrigger className="w-full md:w-1/3"><SelectValue placeholder="Select a class" /></SelectTrigger>
            <SelectContent>{teacherClasses?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>

      {activeForm === 'grade' && selectedClassId && <AssessmentFeedbackForm classId={selectedClassId} />}
      
      {selectedClassId && (
        <Card>
            <CardHeader>
                <CardTitle>Student Grades</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div> :
                students && students.length > 0 && assessments ? (
                <Accordion type="single" collapsible>
                    {students.map(student => {
                        const { finalGrade, percentage } = calculateStudentGrade(student.uid, assessments);
                        return (
                            <AccordionItem value={student.uid} key={student.uid}>
                                <AccordionTrigger>
                                    <div className='flex justify-between items-center w-full pr-4'>
                                        <span className="flex items-center gap-2"><User className="h-4 w-4"/>{student.firstName} {student.lastName}</span>
                                        <Badge variant={percentage > 0 ? "default" : "secondary"}>
                                            Overall: {finalGrade} ({percentage}%)
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <StudentGradesDetail student={student} assessments={assessments}/>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
                ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {isLoadingStudents ? 'Loading students...' : 'No students or assessments found for this class.'}
                    </p>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
