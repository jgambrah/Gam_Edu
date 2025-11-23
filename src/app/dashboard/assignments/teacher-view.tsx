'use client';

import { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Assignment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AssignmentCreationForm } from './assignment-creation-form';
import { AssignmentSubmissionsList } from './assignment-submissions-list';
import { QuizCreationForm } from './quiz-creation-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeacherAssignmentsView() {
  const firestore = useFirestore();
  const { user } = useAuth();
  const [isAssignmentFormOpen, setAssignmentFormOpen] = useState(false);
  const [isQuizFormOpen, setQuizFormOpen] = useState(false);

  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !firestore) return;

    const assignmentsQuery = query(collection(firestore, 'assignments'), where('teacherId', '==', user.uid));
    const unsubscribe = onSnapshot(assignmentsQuery, (snapshot) => {
        const fetchedAssignments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment));
        setAssignments(fetchedAssignments);
        setIsLoading(false);
    }, (error) => {
        console.error("Failed to fetch assignments:", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, firestore]);

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
            <div className="text-center py-10">
                <p className="text-muted-foreground">Quiz management coming soon.</p>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
