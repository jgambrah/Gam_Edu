
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, ChevronRight, TrendingUp } from 'lucide-react';
import { Assessment, Class, Student } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

// --- Utility function to calculate grades ---
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

// --- Dialog to show individual student's scores ---
function StudentGradesDetailDialog({ student, assessments }: { student: Student; assessments: Assessment[] }) {
    const studentAssessments = assessments.filter(a => a.studentId === student.uid && a.score != null && a.maxScore != null);

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Grades for {student.firstName} {student.lastName}</DialogTitle>
                <DialogDescription>A detailed breakdown of all recorded assessments.</DialogDescription>
            </DialogHeader>
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
        </DialogContent>
    );
}

// --- Main Page Component ---
function GradebookContent() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // 1. Fetch classes based on user role
  const classesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    if (role === 'Administrator' || role === 'Director') {
      return collection(firestore, 'classes');
    }
    if (role === 'Teacher') {
      return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
    }
    return null;
  }, [firestore, user, role]);
  const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

  // 2. Fetch students for the selected class
  const studentsQuery = useMemoFirebase(
    () => (selectedClassId && firestore) ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId)) : null,
    [firestore, selectedClassId]
  );
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);

  // 3. Fetch all assessments for the selected class
  const assessmentsQuery = useMemoFirebase(
    () => (selectedClassId && firestore) ? query(collection(firestore, 'assessments'), where('classId', '==', selectedClassId)) : null,
    [firestore, selectedClassId]
  );
  const { data: assessments, isLoading: isLoadingAssessments } = useCollection<Assessment>(assessmentsQuery);

  // 4. Memoize the calculated data for display
  const studentPerformanceData = useMemo(() => {
    if (!students || !assessments) return [];
    return students.map(student => {
      const { finalGrade, percentage } = calculateStudentGrade(student.uid, assessments);
      return {
        ...student,
        overallGrade: finalGrade,
        overallPercentage: percentage,
      };
    });
  }, [students, assessments]);
  
  const isLoading = isLoadingClasses || (selectedClassId && (isLoadingStudents || isLoadingAssessments));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp /> Student Performance Summary</CardTitle>
            <CardDescription>Select a class to view the overall academic performance of its students.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="w-full md:w-1/3">
                <Select onValueChange={setSelectedClassId} disabled={isLoadingClasses}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a class to view performance" />
                </SelectTrigger>
                <SelectContent>
                    {classes?.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name || c.id}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Class Roster</CardTitle></CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="space-y-2">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            ) : selectedClassId && studentPerformanceData.length > 0 ? (
                <div className="border rounded-md">
                    {studentPerformanceData.map(student => (
                        <Dialog key={student.id}>
                            <DialogTrigger asChild>
                                <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer">
                                    <span className="font-medium">{student.firstName} {student.lastName}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold text-lg">{student.overallGrade} ({student.overallPercentage}%)</span>
                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>
                            </DialogTrigger>
                            {assessments && <StudentGradesDetailDialog student={student} assessments={assessments} />}
                        </Dialog>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">
                    {selectedClassId ? "No student data found for this class." : "Please select a class to view student performance."}
                    </p>
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
