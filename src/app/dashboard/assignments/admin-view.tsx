'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Assignment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AssignmentSubmissionsList } from './assignment-submissions-list';

export default function AdminAssignmentsView() {
  const firestore = useFirestore();

  const assignmentsQuery = useMemoFirebase(
    () => query(collection(firestore, 'assignments')),
    [firestore]
  );
  const { data: assignments, isLoading } = useCollection<Assignment>(assignmentsQuery);
  const sortedAssignments = assignments?.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>A global view of all assignments across the school.</CardDescription>
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
                <AssignmentSubmissionsList key={assignment.id} assignment={assignment} readOnly />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No assignments have been created in the system yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
