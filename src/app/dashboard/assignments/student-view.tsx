
'use client';

import { useAuth, useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Assignment, StudentSubmission, Quiz, QuizAttempt, Student } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { AssignmentSubmissionDialog } from './assignment-submission-dialog';
import { setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { BookText, FileUp, Type, Loader2, ClipboardCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRole } from '@/context/role-context';
import { StudentDisplay } from '@/components/student-display';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';

const toDateSafe = (dateVal: any): Date => {
  if (!dateVal) return new Date();
  if (typeof dateVal.toDate === 'function') return dateVal.toDate();
  return new Date(dateVal);
};

export default function StudentAssignmentsView() {
  const { user, isUserLoading } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  const [isSubmissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // 1. Get the student's data
  const studentQuery = useMemoFirebase(() => 
    (user && firestore && schoolId) ? query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, 
    [user, firestore, schoolId]
  );
  const { data: studentData, isLoading: isStudentLoading } = useCollection<Student>(studentQuery);
  const student = studentData?.[0];
  const studentClassId = student?.classId;

  // 2. Fetch assignments for the student's class
  const assignmentsQuery = useMemoFirebase(() => 
    (studentClassId && firestore && schoolId) ? query(collection(firestore, 'assignments'), where('classId', '==', studentClassId), where('schoolId', '==', schoolId)) : null,
    [studentClassId, firestore, schoolId]
  );
  const { data: assignments, isLoading: areAssignmentsLoading } = useCollection<Assignment>(assignmentsQuery);

  // 3. Fetch quizzes for the student's class
  const quizzesQuery = useMemoFirebase(() => 
    (studentClassId && firestore && schoolId) ? query(collection(firestore, 'quizzes'), where('classId', '==', studentClassId), where('schoolId', '==', schoolId)) : null,
    [studentClassId, firestore, schoolId]
  );
  const { data: quizzes, isLoading: areQuizzesLoading } = useCollection<Quiz>(quizzesQuery);
  
  // 4. Fetch all submissions by this student
  const submissionsQuery = useMemoFirebase(() => 
    (user && firestore && schoolId) ? query(collection(firestore, 'submissions'), where('studentId', '==', user.uid), where('schoolId', '==', schoolId)) : null, 
    [user, firestore, schoolId]
  );
  const { data: submissions } = useCollection<StudentSubmission>(submissionsQuery);

  // 5. Fetch all quiz attempts by this student
  const quizAttemptsQuery = useMemoFirebase(() => 
    (user && firestore && schoolId) ? query(collection(firestore, 'quizAttempts'), where('studentId', '==', user.uid), where('schoolId', '==', schoolId)) : null, 
    [user, firestore, schoolId]
  );
  const { data: quizAttempts } = useCollection<QuizAttempt>(quizAttemptsQuery);


  // Combined loading state
  const isLoading = isUserLoading || isStudentLoading || areAssignmentsLoading || areQuizzesLoading;

  const handleFileUpload = async (assignment: Assignment) => {
    if (!user || !student || !firestore || !schoolId) return;
    
    const submission: Omit<StudentSubmission, 'id'> = {
      assignmentId: assignment.id,
      studentId: user.uid,
      studentName: `${student.firstName} ${student.lastName}`,
      submissionType: 'file',
      content: 'placeholder-file.pdf',
      submittedAt: new Date(),
      status: new Date() > toDateSafe(assignment.dueDate) ? 'Late' : 'Submitted',
      // @ts-ignore
      schoolId: schoolId,
    };
    try {
        const newDocRef = doc(collection(firestore, 'submissions'));
        await setDoc(newDocRef, submission);
        toast({ title: 'Success', description: 'File submitted.' });
    } catch(error) {
        console.error("File submission error:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not submit file.' });
    }
  };

  const openTextSubmission = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionDialogOpen(true);
  };
  
  const combinedList = useMemo(() => {
    const allItems = [
        ...(assignments || []).map(item => ({ ...item, type: 'assignment' as const })),
        ...(quizzes || []).map(item => ({...item, type: 'quiz' as const }))
    ];
    return allItems.sort((a,b) => (b.createdAt?.toDate?.() ?? 0) - (a.createdAt?.toDate?.() ?? 0));
  }, [assignments, quizzes]);

  const submissionsMap = useMemo(() => {
    if (!submissions) return new Map();
    return new Map(submissions.map(s => [s.assignmentId, s]));
  }, [submissions]);

  const attemptsMap = useMemo(() => {
    if (!quizAttempts) return new Map();
    return new Map(quizAttempts.map(a => [a.quizId, a]));
  }, [quizAttempts]);


  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                <ClipboardCheck className="h-8 w-8 text-blue-600"/> Assignments & Quizzes
            </h1>
            <p className="text-slate-500">Your upcoming tasks and performance tracker.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          ) : combinedList && combinedList.length > 0 ? (
            <div className="space-y-4">
              {combinedList.map((item) => {
                const isAssignment = item.type === 'assignment';
                let submission, quizAttempt;

                if (isAssignment) {
                    submission = submissionsMap.get(item.id);
                } else {
                    quizAttempt = attemptsMap.get(item.id);
                }

                return (
                  <Card key={item.id} className={cn("overflow-hidden border-l-4 transition-all hover:shadow-md", isAssignment ? "border-l-blue-500" : "border-l-indigo-500")}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 mb-1">
                             <Badge variant={isAssignment ? 'secondary' : 'default'} className="uppercase text-[10px] tracking-widest px-2 py-0">
                                 {item.type}
                             </Badge>
                             {isAssignment && submission && (
                                <Badge variant="outline" className={cn("text-[10px]", submission.status === 'Graded' ? 'border-green-200 text-green-700 bg-green-50' : 'border-blue-200 text-blue-700 bg-blue-50')}>
                                    {submission.status}
                                </Badge>
                             )}
                             {!isAssignment && quizAttempt && (
                                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 text-[10px]">
                                    Score: {quizAttempt.score}/{quizAttempt.total}
                                </Badge>
                             )}
                          </div>
                          <CardTitle className="text-xl text-slate-800 font-bold">{item.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1.5">
                             {isAssignment ? (
                                 <>Due: <span className="font-bold text-slate-700">{item.dueDate ? format(toDateSafe(item.dueDate), 'PPP') : 'No due date'}</span></>
                             ) : (
                                 <>Topic: <span className="font-bold text-slate-700">{(item as any).topic || 'General'}</span></>
                             )}
                           </CardDescription>
                      </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-6">
                       {isAssignment ? (
                          <>
                            <p className="text-sm text-slate-600 line-clamp-3 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                                "{item.description}"
                            </p>
                            
                            {submission ? (
                                <div className="pt-2">
                                    {submission.status === 'Graded' && (
                                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest">Final Result</h4>
                                                <span className="text-2xl font-black text-emerald-700">{submission.grade}</span>
                                            </div>
                                            {submission.teacherFeedback && (
                                                <p className="text-sm text-emerald-900 italic border-t border-emerald-200/50 pt-2">
                                                    " {submission.teacherFeedback} "
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <Button size="sm" onClick={() => handleFileUpload(item as Assignment)} className="bg-blue-600">
                                        <FileUp className="mr-2 h-4 w-4" /> Upload Work
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => openTextSubmission(item as Assignment)}>
                                        <Type className="mr-2 h-4 w-4" /> Write Response
                                    </Button>
                                </div>
                            )}
                          </>
                       ) : (
                           <div className="pt-2">
                            {quizAttempt ? (
                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Knowledge Check Result</p>
                                        <p className="text-sm text-indigo-900">You completed this quiz successfully.</p>
                                    </div>
                                    <span className="text-3xl font-black text-indigo-600">{quizAttempt.score} <span className="text-sm text-indigo-300">/ {quizAttempt.total}</span></span>
                                </div>
                            ) : (
                                <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg font-bold rounded-xl shadow-lg">
                                    <Link href={`/dashboard/assignments/quiz/${item.id}`}>
                                        Start Quiz <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            )}
                           </div>
                       )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-slate-50">
              <BookText className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-600">No tasks currently assigned.</p>
              <p className="text-sm text-slate-400">Enjoy your free time or explore the clubs!</p>
            </div>
          )}
      </div>
      
      {selectedAssignment && student && (
        <AssignmentSubmissionDialog
          isOpen={isSubmissionDialogOpen}
          setOpen={setSubmissionDialogOpen}
          assignment={selectedAssignment}
          student={student}
        />
      )}
    </div>
  );
}
