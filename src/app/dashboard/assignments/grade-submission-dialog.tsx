'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { Assignment, gradeSubmissionSchema, StudentSubmission } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type GradeSubmissionDialogProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  submission: StudentSubmission;
  assignment: Assignment;
};

export function GradeSubmissionDialog({
  isOpen,
  setOpen,
  submission,
  assignment,
}: GradeSubmissionDialogProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof gradeSubmissionSchema>>({
    resolver: zodResolver(gradeSubmissionSchema),
    defaultValues: {
      grade: submission.grade || '',
      teacherFeedback: submission.teacherFeedback || '',
    },
  });

  async function onSubmit(values: z.infer<typeof gradeSubmissionSchema>) {
    setIsSubmitting(true);
    try {
      const submissionRef = doc(firestore, `assignments/${assignment.id}/submissions`, submission.id);
      await updateDoc(submissionRef, {
        ...values,
        status: 'Graded',
      });
      
      // TODO: Implement parent notification
      console.log(`Notification: Assignment graded for ${submission.studentName}`);

      toast({
        title: 'Submission Graded',
        description: `The submission from ${submission.studentName} has been graded.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error grading submission:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while grading.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderGradeInput = () => {
    switch(assignment.gradingType) {
        case 'points':
            return <Input type="number" placeholder="e.g., 85" />;
        case 'letter':
            return (
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a grade" />
                    </SelectTrigger>
                    <SelectContent>
                        {['A', 'B', 'C', 'D', 'F'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                </Select>
            );
        case 'pass_fail':
             return (
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select outcome" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pass">Pass</SelectItem>
                        <SelectItem value="Fail">Fail</SelectItem>
                    </SelectContent>
                </Select>
            );
        default:
            return <Input placeholder="Enter grade" />;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grade Submission: {submission.studentName}</DialogTitle>
          <DialogDescription>
            Assignment: {assignment.title}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <FormControl>
                    {assignment.gradingType === 'letter' || assignment.gradingType === 'pass_fail' ? (
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder={`Select a ${assignment.gradingType === 'letter' ? 'grade' : 'status'}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {assignment.gradingType === 'letter' && ['A', 'B', 'C', 'D', 'F'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                {assignment.gradingType === 'pass_fail' && ['Pass', 'Fail'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input placeholder="e.g. 85" {...field} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teacherFeedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Provide constructive feedback..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Grade
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
