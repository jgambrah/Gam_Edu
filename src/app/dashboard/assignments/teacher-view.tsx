
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Assignment, Quiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AssignmentCreationForm } from './assignment-creation-form';
import { AssignmentSubmissionsList } from './assignment-submissions-list';
import { QuizCreationForm } from './quiz-creation-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { useCurrentSchool } from '@/hooks/use-current-school';

function QuizList() {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { schoolId } = useCurrentSchool();

  const quizzesQuery = useMemoFirebase(
    () => (user && schoolId) ? query(collection(firestore, 'quizzes'), where('teacherId', '==', user.uid), where('schoolId', '==', schoolId)) : null,
    [firestore, user, schoolId]
  );
  const { data: quizzes, isLoading } = useCollection<Quiz>(quizzesQuery);
  const sortedQuizzes = quizzes?.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

  const { data: classes } = useCollection<{id: string, name: string}>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));

  const getClassName = (classId: string) => {
    return classes?.find(c => c.id === classId)?.name || classId;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedQuizzes && sortedQuizzes.length > 0 ? (
        sortedQuizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>
                Topic: {quiz.topic} | Assigned to: {getClassName(quiz.classId)} on {format(quiz.createdAt.toDate(), 'PPP')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{quiz.questions.length} questions</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">You haven't created any quizzes yet.</p>
        </div>
      )}
    </div>
  );
}


export default function TeacherAssignmentsView() {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { schoolId } = useCurrentSchool();
  const [isAssignmentFormOpen, setAssignmentFormOpen] = useState(false);
  const [isQuizFormOpen, setQuizFormOpen] = useState(false);

  const assignmentsQuery = useMemoFirebase(
    () => (user && schoolId) ? query(collection(firestore, 'assignments'), where('teacherId', '==', user.uid), where('schoolId', '==', schoolId)) : null,
    [user, firestore, schoolId]
  );
  const { data: assignments, isLoading } = useCollection<Assignment>(assignmentsQuery);

  const sortedAssignments = assignments?.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Assignments & Quizzes</CardTitle>
            <CardDescription>Create, manage, and grade assignments and quizzes for your classes.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setAssignmentFormOpen(!isAssignmentFormOpen)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {isAssignmentFormOpen ? 'Close Form' : 'Create Assignment'}
            </Button>
            <Button onClick={() => setQuizFormOpen(!isQuizFormOpen)} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              {isQuizFormOpen ? 'Close Form' : 'Create Quiz'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAssignmentFormOpen && <AssignmentCreationForm setOpen={setAssignmentFormOpen} />}
          {isQuizFormOpen && <QuizCreationForm setOpen={setQuizFormOpen} />}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Your Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : sortedAssignments && sortedAssignments.length > 0 ? (
                <div className="space-y-4">
                  {sortedAssignments.map((assignment) => (
                    <AssignmentSubmissionsList key={assignment.id} assignment={assignment} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">You haven't created any assignments yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="quizzes">
           <Card>
            <CardHeader>
              <CardTitle>Your Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <QuizList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
