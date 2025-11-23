'use client';

import { useState, useEffect } from 'react';
import {
  useFirestore,
} from '@/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Assignment, StudentSubmission } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, Download, Eye, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { GradeSubmissionDialog } from './grade-submission-dialog';

type AssignmentSubmissionsListProps = {
  assignment: Assignment;
  readOnly?: boolean;
};

export function AssignmentSubmissionsList({ assignment, readOnly = false }: AssignmentSubmissionsListProps) {
  const firestore = useFirestore();
  const [isExpanded, setExpanded] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  
  const [submissions, setSubmissions] = useState<StudentSubmission[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firestore) return;
    const submissionsQuery = query(collection(firestore, `assignments/${assignment.id}/submissions`));
    const unsubscribe = onSnapshot(submissionsQuery, (snapshot) => {
        setSubmissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudentSubmission)));
        setIsLoading(false);
    });
    return () => unsubscribe();
  }, [firestore, assignment.id]);


  const handleGradeClick = (submission: StudentSubmission) => {
    setSelectedSubmission(submission);
    setIsGrading(true);
  };
  
  const getStatusVariant = (status: StudentSubmission['status']) => {
    switch (status) {
      case 'Graded':
        return 'default';
      case 'Submitted':
        return 'secondary';
      case 'Late':
        return 'destructive';
      default:
        return 'outline';
    }
  };


  return (
    <>
      <Card>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>{assignment.title}</CardTitle>
                    <CardDescription>
                    Due: {format(new Date(assignment.dueDate.toDate()), 'PPP')} | Grading: {assignment.gradingType}
                    </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setExpanded(!isExpanded)}>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </Button>
            </div>
        </CardHeader>

        {isExpanded && (
          <CardContent>
            <h4 className="font-semibold mb-2">Submissions</h4>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : submissions && submissions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>{sub.studentName}</TableCell>
                      <TableCell><Badge variant={getStatusVariant(sub.status)}>{sub.status}</Badge></TableCell>
                      <TableCell>{format(new Date(sub.submittedAt.toDate()), 'PPp')}</TableCell>
                      <TableCell className="space-x-2">
                        {sub.submissionType === 'file' ? (
                            <Button variant="outline" size="icon" disabled>
                                <Download className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button variant="outline" size="icon" disabled>
                                <Eye className="h-4 w-4" />
                            </Button>
                        )}
                        {!readOnly && sub.status !== 'Graded' && (
                          <Button size="sm" onClick={() => handleGradeClick(sub)}>
                            Grade
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">No submissions yet.</p>
            )}
          </CardContent>
        )}
      </Card>
      {selectedSubmission && (
        <GradeSubmissionDialog
          isOpen={isGrading}
          setOpen={setIsGrading}
          submission={selectedSubmission}
          assignment={assignment}
        />
      )}
    </>
  );
}
