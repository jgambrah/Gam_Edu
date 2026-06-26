'use client';

import { useState, useEffect } from 'react';
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { Assignment, StudentSubmission } from '@/lib/types';
import { useCurrentSchool } from '@/hooks/use-current-school';
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
  const { schoolId } = useCurrentSchool();
  const [isExpanded, setExpanded] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  
  const submissionsQuery = useMemoFirebase(() => 
    (firestore && schoolId) ? query(collection(firestore!, 'submissions'), where('assignmentId', '==', assignment.id), where('schoolId', '==', schoolId)) : null, 
    [firestore, schoolId, assignment.id]
  );
  const { data: submissions, isLoading } = useCollection<StudentSubmission>(submissionsQuery);

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
                    Due: {assignment.dueDate ? (typeof (assignment.dueDate as any).toDate === 'function' ? format((assignment.dueDate as any).toDate(), 'PPP') : format(new Date(assignment.dueDate), 'PPP')) : 'N/A'} | Grading: {assignment.gradingType}
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
                      <TableCell>{sub.submittedAt ? (typeof (sub.submittedAt as any).toDate === 'function' ? format((sub.submittedAt as any).toDate(), 'PPp') : format(new Date(sub.submittedAt), 'PPp')) : 'N/A'}</TableCell>
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
