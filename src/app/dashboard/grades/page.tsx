
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Assessment } from '@/lib/types';

// Mock student and assessment data until backend functions are fully implemented
type Student = {
  uid: string;
  firstName: string;
  lastName: string;
  classId: string;
};

// This function would ideally live in a separate utility/service file
function calculateStudentGradeForClass(studentId: string, assessments: Assessment[]) {
  const studentAssessments = assessments.filter(a => a.studentId === studentId && a.score !== undefined && a.maxScore !== undefined);
  if (studentAssessments.length === 0) {
    return { finalGrade: 'N/A', percentage: 0, remarks: 'No graded work' };
  }

  const totalScore = studentAssessments.reduce((acc, a) => acc + a.score!, 0);
  const maxScore = studentAssessments.reduce((acc, a) => acc + a.maxScore!, 0);
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

  let finalGrade = 'N/A';
  if (percentage >= 90) finalGrade = 'A';
  else if (percentage >= 80) finalGrade = 'B';
  else if (percentage >= 70) finalGrade = 'C';
  else if (percentage >= 60) finalGrade = 'D';
  else if (percentage > 0) finalGrade = 'F';
  
  return { finalGrade, percentage: parseFloat(percentage.toFixed(1)), remarks: '' };
}

function GradebookContent() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // 1. Fetch classes based on user role
  const classesQuery = useMemoFirebase(() => {
    if (!user) return null;
    if (role === 'Administrator' || role === 'Director') {
      return collection(firestore, 'classes');
    }
    if (role === 'Teacher') {
      return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
    }
    return null;
  }, [firestore, user, role]);
  const { data: classes, isLoading: isLoadingClasses } = useCollection(classesQuery);

  // 2. Fetch students for the selected class
  const studentsQuery = useMemoFirebase(
    () => selectedClassId ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId)) : null,
    [firestore, selectedClassId]
  );
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);

  // 3. Fetch all assessments for the selected class
  const assessmentsQuery = useMemoFirebase(
    () => selectedClassId ? query(collection(firestore, 'assessments'), where('classId', '==', selectedClassId)) : null,
    [firestore, selectedClassId]
  );
  const { data: assessments, isLoading: isLoadingAssessments } = useCollection<Assessment>(assessmentsQuery);

  // 4. Process data for the table
  const uniqueAssessmentNames = useMemo(() => {
    if (!assessments) return [];
    return [...new Set(assessments.map(a => a.assessmentName))];
  }, [assessments]);

  const gradebookData = useMemo(() => {
    if (!students || !assessments) return [];
    return students.map(student => {
      const grades = uniqueAssessmentNames.reduce((acc, name) => {
        const assessment = assessments.find(a => a.studentId === student.uid && a.assessmentName === name);
        acc[name] = assessment && assessment.score !== undefined ? `${assessment.score}/${assessment.maxScore}` : 'N/A';
        return acc;
      }, {} as Record<string, string>);
      
      const { finalGrade, percentage } = calculateStudentGradeForClass(student.uid, assessments);

      return {
        studentId: student.uid,
        studentName: `${student.firstName} ${student.lastName}`,
        grades,
        finalGrade: `${finalGrade} (${percentage}%)`,
      };
    });
  }, [students, assessments, uniqueAssessmentNames]);
  
  const isLoading = isLoadingClasses || isLoadingStudents || isLoadingAssessments;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gradebook</h1>
          <p className="text-muted-foreground">View student performance for a selected class.</p>
        </div>
        <div className="flex gap-2">
            <Button asChild variant="outline">
                <Link href="/dashboard/assessments">Enter Grades</Link>
            </Button>
            <Button asChild disabled>
                <Link href="#">Manage Report Cards</Link>
            </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="w-full md:w-1/3">
            <Select onValueChange={setSelectedClassId} disabled={isLoadingClasses}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class to view gradebook" />
              </SelectTrigger>
              <SelectContent>
                {classes?.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && selectedClassId && <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div>}

          {!isLoading && selectedClassId && gradebookData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  {uniqueAssessmentNames.map(name => (
                    <TableHead key={name} className="text-center">{name}</TableHead>
                  ))}
                  <TableHead className="text-right">Final Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradebookData.map(row => (
                  <TableRow key={row.studentId}>
                    <TableCell className="font-medium">{row.studentName}</TableCell>
                    {uniqueAssessmentNames.map(name => (
                      <TableCell key={name} className="text-center">{row.grades[name]}</TableCell>
                    ))}
                    <TableCell className="text-right font-medium">{row.finalGrade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            !isLoading && selectedClassId && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No student or assessment data found for this class.</p>
              </div>
            )
          )}
           {!selectedClassId && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">Please select a class to view the gradebook.</p>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}


export default function GradesPage() {
  const { role } = useRole();

  const canAccess = role === 'Teacher' || role === 'Administrator' || role === 'Director';

  if (!canAccess) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>This feature is available only to Teachers, Administrators, and Directors.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return <GradebookContent />;
}
