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
import { Textarea } from '@/components/ui/textarea';
import { useAuth, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { Assignment, studentSubmissionSchema, StudentSubmission } from '@/lib/types';
import { Loader2 } from 'lucide-react';

type AssignmentSubmissionDialogProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  assignment: Assignment;
  student: any;
};

export function AssignmentSubmissionDialog({
  isOpen,
  setOpen,
  assignment,
  student
}: AssignmentSubmissionDialogProps) {
  const firestore = useFirestore();
  const {user} = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof studentSubmissionSchema>>({
    resolver: zodResolver(studentSubmissionSchema),
    defaultValues: {
      content: '',
    },
  });

  async function onSubmit(values: z.infer<typeof studentSubmissionSchema>) {
    if(!user || !student) return;
    setIsSubmitting(true);
    try {
      const submission: Omit<StudentSubmission, 'id'> = {
        assignmentId: assignment.id,
        studentId: user.uid,
        studentName: `${student.firstName} ${student.lastName}`,
        submissionType: 'text',
        content: values.content,
        submittedAt: new Date(),
        status: new Date() > new Date(assignment.dueDate.toDate()) ? 'Late' : 'Submitted',
      };

      await addDoc(collection(firestore, `assignments/${assignment.id}/submissions`), submission);
      
      toast({
        title: 'Submission Successful',
        description: 'Your text answer has been submitted.',
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while submitting your answer.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit: {assignment.title}</DialogTitle>
          <DialogDescription>
            Type your answer in the text box below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Answer</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type your answer here..." {...field} rows={10} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Answer
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
