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
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { Assignment, studentSubmissionSchema, StudentSubmission } from '@/lib/types';
import { Loader2, FileUp } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';

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
  const {user} = useUser();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const form = useForm<z.infer<typeof studentSubmissionSchema>>({
    resolver: zodResolver(studentSubmissionSchema),
    defaultValues: {
      content: '',
    },
  });

  useEffect(() => {
    if (assignment?.questions && assignment.questions.length > 0) {
      setAnswers(new Array(assignment.questions.length).fill(''));
      form.setValue('content', 'inline-answers');
    } else {
      setAnswers([]);
      form.setValue('content', '');
    }
  }, [assignment, form]);

  useEffect(() => {
    if (!isOpen || !assignment || !assignment.timeLimit || assignment.timeLimit <= 0 || !assignment.questions || assignment.questions.length === 0) {
      setTimeLeft(null);
      return;
    }

    const assignmentTimeLimitSec = assignment.timeLimit * 60;
    const storageKey = `assignment-start-${assignment.id}`;
    
    let startTimeStr = localStorage.getItem(storageKey);
    if (!startTimeStr) {
      startTimeStr = String(Date.now());
      localStorage.setItem(storageKey, startTimeStr);
    }
    
    const startTime = Number(startTimeStr);
    
    const updateTimer = () => {
      const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, assignmentTimeLimitSec - elapsedSec);
      setTimeLeft(remaining);
      return remaining;
    };

    const initialRemaining = updateTimer();
    if (initialRemaining <= 0) {
      return; // Already expired
    }

    const interval = setInterval(() => {
      const remaining = updateTimer();
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, assignment]);

  useEffect(() => {
    if (isOpen && timeLeft === 0 && !isSubmitting && assignment?.questions && assignment.questions.length > 0) {
      toast({
        title: "Time is up!",
        description: "Your answers have been frozen and auto-submitted.",
      });
      performSubmit(answers);
    }
  }, [isOpen, timeLeft, isSubmitting]);

  async function performSubmit(answersArray: string[]) {
    if(!user || !student || !firestore || !schoolId) return;
    setIsSubmitting(true);
    try {
      const finalContent = assignment.questions && assignment.questions.length > 0 
        ? JSON.stringify(answersArray)
        : form.getValues('content');

      const submission: Omit<StudentSubmission, 'id'> = {
        assignmentId: assignment.id,
        studentId: user.uid,
        studentName: `${student.firstName} ${student.lastName}`,
        submissionType: 'text',
        content: finalContent,
        submittedAt: new Date(),
        status: new Date() > (typeof (assignment.dueDate as any).toDate === 'function' ? (assignment.dueDate as any).toDate() : new Date(assignment.dueDate)) ? 'Late' : 'Submitted',
        // @ts-ignore
        schoolId: schoolId,
      };

      await addDoc(collection(firestore!, 'submissions'), submission);
      
      toast({
        title: 'Submission Successful',
        description: 'Your answers have been submitted.',
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

  async function onSubmit(values: z.infer<typeof studentSubmissionSchema>) {
    if (assignment.questions && assignment.questions.length > 0) {
      const emptyIndex = answers.findIndex(ans => !ans || !ans.trim());
      if (emptyIndex !== -1) {
        toast({
          variant: 'destructive',
          title: 'Incomplete Answers',
          description: `Please answer question ${emptyIndex + 1} before submitting.`,
        });
        return;
      }
    }
    await performSubmit(answers);
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit: {assignment.title}</DialogTitle>
          <DialogDescription>
            {assignment.questions && assignment.questions.length > 0
              ? "Complete all the questions below to submit your assignment."
              : "Type your answer in the text box below."}
          </DialogDescription>
        </DialogHeader>

        {/* Time Limit Countdown Bar */}
        {isOpen && assignment.timeLimit && assignment.timeLimit > 0 && timeLeft !== null && (
          <div className={cn(
            "flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-300",
            timeLeft < 60 
              ? "bg-rose-50 border-rose-200 text-rose-700 animate-pulse font-bold" 
              : "bg-amber-50 border-amber-200 text-amber-700 font-medium"
          )}>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "h-2 w-2 rounded-full bg-current",
                timeLeft < 60 ? "animate-ping" : "animate-pulse"
              )} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {timeLeft < 60 ? "CRITICAL TIME REMAINING!" : "ASSIGNMENT TIMER"}
              </span>
            </div>
            <span className="text-sm font-black font-mono leading-none tracking-tight">
              {formatTime(timeLeft)}
            </span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {assignment.questions && assignment.questions.length > 0 ? (
              <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 py-1">
                {assignment.questions.map((q, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                    <p className="text-xs font-bold text-slate-800 leading-normal">
                      <span className="text-indigo-600 font-extrabold mr-1.5">{idx + 1}.</span> {q.questionText}
                    </p>

                    {q.type === 'mcq' ? (
                      <RadioGroup
                        onValueChange={(val) => {
                          const updated = [...answers];
                          updated[idx] = val;
                          setAnswers(updated);
                        }}
                        value={answers[idx]}
                        className="space-y-2.5 pl-3"
                      >
                        {q.options?.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center space-x-2">
                            <RadioGroupItem value={opt} id={`q${idx}-o${oIdx}`} />
                            <Label htmlFor={`q${idx}-o${oIdx}`} className="text-xs font-semibold text-slate-600 cursor-pointer">
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <div className="pl-3">
                        <Textarea
                          placeholder="Type your answer for this question..."
                          value={answers[idx] || ''}
                          onChange={(e) => {
                            const updated = [...answers];
                            updated[idx] = e.target.value;
                            setAnswers(updated);
                          }}
                          rows={3}
                          className="rounded-xl border border-slate-200 bg-white h-20 text-xs font-semibold"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {(assignment as any).questionsFile && (
                  <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                        <FileUp className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{(assignment as any).questionsFile.fileName}</p>
                        <p className="text-[10px] text-slate-400 font-bold font-mono">{(assignment as any).questionsFile.fileSize}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const file = (assignment as any).questionsFile;
                        if (file.fileData === 'simulated-storage-url-placeholder') {
                          toast({
                            title: 'Downloading File (Simulated)',
                            description: `Downloading ${file.fileName} from simulated cloud storage.`,
                          });
                          toast({
                            title: 'Download Successful',
                            description: `${file.fileName} has been downloaded.`,
                          });
                        } else {
                          const link = document.createElement('a');
                          link.href = file.fileData;
                          link.setAttribute('download', file.fileName);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }
                      }}
                      className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs h-9 px-3 rounded-xl transition"
                    >
                      Download Sheet
                    </Button>
                  </div>
                )}

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
              </div>
            )}
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
