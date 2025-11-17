'use client';

import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Assignment, StudentSubmission, Quiz, QuizAttempt } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AssignmentSubmissionDialog } from './assignment-submission-dialog';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import { BookText, FileUp, Type } from 'lucide-react';
import Link from 'next/link';
import { useRole } from '@/context/role-context';

export default function StudentAssignmentsView() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isSubmissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const studentQuery = useMemoFirebase(() => user ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user]);
  const { data: studentData, isLoading: isStudentLoading } = useCollection(studentQuery);
  const student = studentData?.[0];

  const assignmentsQuery = useMemoFirebase(() => student ? query(collection(firestore, 'assignments'), where('classId', '==', student.classId)) : null, [firestore, student]);
  const { data: assignments, isLoading: areAssignmentsLoading } = useCollection<Assignment>(assignmentsQuery);

  const quizzesQuery = useMemoFirebase(() => student ? query(collection(firestore, 'quizzes'), where('classId', '==', student.classId)) : null, [firestore, student]);
  const { data: quizzes, isLoading: areQuizzesLoading } = useCollection<Quiz>(quizzesQuery);

  const submissionsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'submissions'), where('studentId', '==', user.uid)) : null, [firestore, user]);
  const { data: submissions } = useCollection<StudentSubmission>(submissionsQuery);
  
  const quizAttemptsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'quizAttempts'), where('studentId', '==', user.uid)) : null, [firestore, user]);
  const { data: quizAttempts } = useCollection<QuizAttempt>(quizAttemptsQuery);


  const handleFileUpload = (assignment: Assignment) => {
    // This is a placeholder for file upload logic.
    // In a real app, you would use Firebase Storage.
    const submission: Omit<StudentSubmission, 'id'> = {
      assignmentId: assignment.id,
      studentId: user!.uid,
      studentName: `${student.firstName} ${student.lastName}`,
      submissionType: 'file',
      content: 'placeholder-file.pdf',
      submittedAt: new Date(),
      status: new Date() > new Date(assignment.dueDate) ? 'Late' : 'Submitted',
    };
    const newDocRef = collection(firestore, `assignments/${assignment.id}/submissions`);
    setDocumentNonBlocking(newDocRef, submission, {});
    toast({ title: 'Success', description: 'File submitted.' });
  };

  const openTextSubmission = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionDialogOpen(true);
  };
  
  const combinedList = [
    ...(assignments || []).map(item => ({ ...item, type: 'assignment' })),
    ...(quizzes || []).map(item => ({...item, type: 'quiz' }))
  ].sort((a,b) => b.createdAt.toDate() - a.createdAt.toDate());

  const isLoading = isStudentLoading || areAssignmentsLoading || areQuizzesLoading;

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
                const submission = submissions?.find((s) => s.assignmentId === item.id);
                const quizAttempt = quizAttempts?.find(qa => qa.quizId === item.id);

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
                            {isAssignment ? `Due: ${format(new Date(item.dueDate), 'PPP')}` : `Topic: ${item.topic}`}
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
      {selectedAssignment && (
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

    