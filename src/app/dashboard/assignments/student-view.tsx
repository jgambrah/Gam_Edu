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
import { BookText, FileUp, Type, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRole } from '@/context/role-context';

export default function StudentAssignmentsView() {
  const { user, isUserLoading } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isSubmissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // 1. Get the student's data to find their classId
  const studentQuery = useMemoFirebase(() => 
    (user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, 
    [user, firestore]
  );
  const { data: studentData, isLoading: isStudentLoading } = useCollection<Student>(studentQuery);
  const student = useMemo(() => studentData?.[0], [studentData]);
  const studentClassId = student?.classId;

  // 2. Fetch assignments for the student's class
  const assignmentsQuery = useMemoFirebase(() => 
    (studentClassId && firestore) ? query(collection(firestore, 'assignments'), where('classId', '==', studentClassId)) : null,
    [studentClassId, firestore]
  );
  const { data: assignments, isLoading: areAssignmentsLoading } = useCollection<Assignment>(assignmentsQuery);

  // 3. Fetch quizzes for the student's class
  const quizzesQuery = useMemoFirebase(() => 
    (studentClassId && firestore) ? query(collection(firestore, 'quizzes'), where('classId', '==', studentClassId)) : null,
    [studentClassId, firestore]
  );
  const { data: quizzes, isLoading: areQuizzesLoading } = useCollection<Quiz>(quizzesQuery);
  
  // 4. Fetch all submissions by this student
  const submissionsQuery = useMemoFirebase(() => 
    (user && firestore) ? query(collection(firestore, 'submissions'), where('studentId', '==', user.uid)) : null, 
    [user, firestore]
  );
  const { data: submissions, isLoading: areSubmissionsLoading } = useCollection<StudentSubmission>(submissionsQuery);

  // 5. Fetch all quiz attempts by this student
  const quizAttemptsQuery = useMemoFirebase(() => 
    (user && firestore) ? query(collection(firestore, 'quizAttempts'), where('studentId', '==', user.uid)) : null, 
    [user, firestore]
  );
  const { data: quizAttempts, isLoading: areAttemptsLoading } = useCollection<QuizAttempt>(quizAttemptsQuery);


  // Combined loading state
  const isLoading = isUserLoading || isStudentLoading || areAssignmentsLoading || areQuizzesLoading || areSubmissionsLoading || areAttemptsLoading;

  const handleFileUpload = async (assignment: Assignment) => {
    if (!user || !student || !firestore) return;
    
    // This is a placeholder for file upload logic.
    const submission: Omit<StudentSubmission, 'id'> = {
      assignmentId: assignment.id,
      studentId: user.uid,
      studentName: `${student.firstName} ${student.lastName}`,
      submissionType: 'file',
      content: 'placeholder-file.pdf',
      submittedAt: new Date(),
      status: new Date() > new Date(assignment.dueDate.toDate()) ? 'Late' : 'Submitted',
    };
    try {
        const newDocRef = doc(collection(firestore, `assignments/${assignment.id}/submissions`));
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
    return allItems.sort((a,b) => b.createdAt.toDate() - a.createdAt.toDate());
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Assignments & Quizzes</CardTitle>
          <CardDescription>View upcoming assignments, submit your work, and take quizzes.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
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
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                             {isAssignment ? <BookText className="h-5 w-5 text-primary"/> : '❓'}
                            {item.title}
                          </CardTitle>
                          <CardDescription>
                            {isAssignment ? `Due: ${format(new Date(item.dueDate.toDate()), 'PPP')}` : `Topic: ${item.topic}`}
                          </CardDescription>
                        </div>
                         <Badge variant={isAssignment ? 'secondary' : 'default'}>{item.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {isAssignment ? (
                          <>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            {submission ? (
                                <div>
                                    <p className="text-sm font-semibold">Status: {submission.status} on {format(submission.submittedAt.toDate(), 'PPP p')}</p>
                                    {submission.status === 'Graded' && (
                                        <div className="mt-2 p-4 bg-muted rounded-md">
                                            <h4 className="font-semibold">Grade: {submission.grade}</h4>
                                            {submission.teacherFeedback && <p className="text-sm mt-1">Feedback: {submission.teacherFeedback}</p>}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm font-semibold">Status: Not Submitted</p>
                                    <div className="flex gap-2 mt-2">
                                        <Button size="sm" onClick={() => handleFileUpload(item as Assignment)}>
                                            <FileUp className="mr-2 h-4 w-4" /> Upload File
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => openTextSubmission(item as Assignment)}>
                                            <Type className="mr-2 h-4 w-4" /> Type Answer
                                        </Button>
                                    </div>
                                </div>
                            )}
                          </>
                       ) : (
                           <>
                            {quizAttempt ? (
                                <p className="font-semibold">You scored {quizAttempt.score} / {quizAttempt.total}</p>
                            ) : (
                                <Button asChild>
                                    <Link href={`/dashboard/assignments/quiz/${item.id}?role=${role}`}>Take Quiz</Link>
                                </Button>
                            )}
                           </>
                       )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No assignments or quizzes found for your class.</p>
            </div>
          )}
        </CardContent>
      </Card>
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
