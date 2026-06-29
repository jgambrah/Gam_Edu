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
import { doc, updateDoc, setDoc, collection, serverTimestamp, getDoc } from 'firebase/firestore';
import { Assignment, gradeSubmissionSchema, StudentSubmission } from '@/lib/types';
import { Loader2, FileUp } from 'lucide-react';
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
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      const submissionRef = doc(firestore!, 'submissions', submission.id);
      await updateDoc(submissionRef, {
        ...values,
        status: 'Graded',
      });
      
      // Auto Gradebook integration entry!
      if (assignment.gradable && assignment.subjectId) {
        let term = 'First Term';
        let academicYear = '2024-2025';
        try {
          const settingsSnap = await getDoc(doc(firestore, 'schoolSettings', (assignment as any).schoolId));
          if (settingsSnap.exists()) {
            const settingsData = settingsSnap.data();
            if (settingsData.term) term = settingsData.term;
            if (settingsData.academicYear) academicYear = settingsData.academicYear;
          }
        } catch (err) {
          console.error("Error fetching schoolSettings:", err);
        }

        const scoreVal = Number(values.grade);
        const assessmentRef = doc(collection(firestore, 'assessments'));
        await setDoc(assessmentRef, {
          studentId: submission.studentId,
          studentName: submission.studentName,
          classId: assignment.classId,
          subjectId: assignment.subjectId,
          schoolId: (assignment as any).schoolId,
          teacherId: assignment.teacherId || '',
          term: term,
          academicYear: academicYear,
          assessmentType: assignment.assessmentType || 'Homework (CA)',
          score: isNaN(scoreVal) ? 0 : scoreVal,
          maxScore: 100, // default max score basis
          teacherRemark: values.teacherFeedback || "",
          createdAt: serverTimestamp(),
          assessmentDate: serverTimestamp(),
          assignmentId: assignment.id,
          submissionId: submission.id
        });
      }

      // TODO: Implement parent notification
      console.log(`Notification: Assignment graded for ${submission.studentName}`);

      toast({
        title: 'Submission Graded',
        description: `The submission from ${submission.studentName} has been graded and recorded in the gradebook.`,
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

        {/* Display student's submission answer content */}
        <div className="my-4 p-4 rounded-xl bg-slate-50 border border-slate-100 max-h-[300px] overflow-y-auto space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">Submitted Work / Answers</h4>
          {submission.submissionType === 'file' ? (
            <div className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-2xl gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                  <FileUp className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{submission.content}</p>
                  <p className="text-[9px] text-slate-400 font-bold">Uploaded File Response</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast({
                    title: 'Downloading Submission (Simulated)',
                    description: `Downloading ${submission.content} from school records.`,
                  });
                }}
                className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs h-9 px-3 rounded-xl transition"
              >
                Download File
              </Button>
            </div>
          ) : assignment.questions && assignment.questions.length > 0 ? (
            <div className="space-y-4">
              {(() => {
                try {
                  const answers = JSON.parse(submission.content);
                  return assignment.questions.map((q, idx) => (
                    <div key={idx} className="space-y-1.5 border-b pb-2.5 last:border-0 last:pb-0">
                      <p className="text-xs font-bold text-slate-700">{idx + 1}. {q.questionText}</p>
                      <p className="text-xs font-semibold text-slate-650 pl-4 bg-white py-1.5 px-3 rounded-lg border border-slate-100 block">
                        <span className="text-[10px] font-bold text-indigo-500 uppercase mr-1">Answer:</span> {answers[idx] || '(No Answer)'}
                      </p>
                      {q.correctAnswer && (
                        <p className="text-[10px] text-emerald-600 font-bold pl-4 mt-0.5">
                          Reference Correct: {q.correctAnswer}
                        </p>
                      )}
                    </div>
                  ));
                } catch {
                  return <p className="text-xs font-medium text-slate-700 whitespace-pre-wrap">{submission.content}</p>;
                }
              })()}
            </div>
          ) : (
            <p className="text-xs font-medium text-slate-700 whitespace-pre-wrap">{submission.content}</p>
          )}
        </div>

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
