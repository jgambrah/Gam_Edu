'use client';

import { useAuth, useFirestore, useUser } from '@/firebase';
import { collection, query, where, doc, onSnapshot } from 'firebase/firestore';
import { Assignment, StudentSubmission, Quiz, QuizAttempt, Student } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { AssignmentSubmissionDialog } from './assignment-submission-dialog';
import { setDoc } from 'firebase/firestore';
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

  const [student, setStudent] = useState<Student | null>(null);
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[] | null>(null);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !firestore) return;

    const studentQuery = query(collection(firestore, 'students'), where('uid', '==', user.uid));
    const unsubscribeStudent = onSnapshot(studentQuery, (snapshot) => {
        if (!snapshot.empty) {
            const studentData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Student;
            setStudent(studentData);
        } else {
            setIsLoading(false);
        }
    });

    return () => unsubscribeStudent();
  }, [user, firestore]);

  useEffect(() => {
    if (!student || !firestore) return;

    const assignmentsQuery = query(collection(firestore, 'assignments'), where('classId', '==', student.classId));
    const unsubscribeAssignments = onSnapshot(assignmentsQuery, snapshot => {
        setAssignments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment)));
    });

    const quizzesQuery = query(collection(firestore, 'quizzes'), where('classId', '==', student.classId));
    const unsubscribeQuizzes = onSnapshot(quizzesQuery, snapshot => {
        setQuizzes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz)));
    });

    const submissionsQuery = query(collection(firestore, 'submissions'), where('studentId', '==', student.uid));
    const unsubscribeSubmissions = onSnapshot(submissionsQuery, snapshot => {
        setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudentSubmission)));
    });

    const quizAttemptsQuery = query(collection(firestore, 'quizAttempts'), where('studentId', '==', student.uid));
    const unsubscribeQuizAttempts = onSnapshot(quizAttemptsQuery, snapshot => {
        setQuizAttempts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizAttempt)));
        setIsLoading(false);
    });

    return () => {
        unsubscribeAssignments();
        unsubscribeQuizzes();
        unsubscribeSubmissions();
        unsubscribeQuizAttempts();
    }
  }, [student, firestore]);


  const handleFileUpload = async (assignment: Assignment) => {
    if (!user || !student || !firestore) return;
    
    // This is a placeholder for file upload logic.
    // In a real app, you would use Firebase Storage.
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
  
  const combinedList = [
    ...(assignments || []).map(item => ({ ...item, type: 'assignment' })),
    ...(quizzes || []).map(item => ({...item, type: 'quiz' }))
  ].sort((a,b) => b.createdAt.toDate() - a.createdAt.toDate());

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
