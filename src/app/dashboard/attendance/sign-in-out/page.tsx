
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRole } from '@/context/role-context';
import { Switch } from '@/components/ui/switch';
import { Student } from '@/lib/types';
import { startOfDay } from 'date-fns';

const signInOurFormSchema = z.object({
  studentId: z.string().min(1, 'Please select a student.'),
  status: z.enum(['Tardy', 'Dismissed-Early']),
  reason: z.string().min(1, 'A reason is required.'),
  isExcused: z.boolean().default(false),
});

export default function SignInOurConsole() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { role } = useRole();

  const studentsQuery = useMemoFirebase(() => collection(firestore, 'students'), [firestore]);
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);

  const form = useForm<z.infer<typeof signInOurFormSchema>>({
    resolver: zodResolver(signInOurFormSchema),
    defaultValues: {
      status: 'Tardy',
      reason: '',
      isExcused: false,
    },
  });

  async function onSubmit(values: z.infer<typeof signInOurFormSchema>) {
    if (!user) return;
    setIsSubmitting(true);
    try {
        const student = students?.find(s => s.uid === values.studentId);
        if (!student) throw new Error("Student not found");

        const logData = {
            studentId: values.studentId,
            classId: student.classId,
            date: startOfDay(new Date()),
            status: values.status,
            reason: values.reason,
            isExcused: values.isExcused,
            timeOfEvent: serverTimestamp(),
            recordedByUserId: user.uid,
            notificationSent: false,
        };
        await addDocumentNonBlocking(collection(firestore, 'student_attendance_logs'), logData);

      toast({
        title: 'Log Submitted',
        description: `The ${values.status} event for ${student.firstName} has been recorded.`,
      });
      form.reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'An error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!['Administrator', 'Director'].includes(role)) {
    return (
        <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This console is for administrative staff only.</CardDescription></CardHeader></Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Student Sign-In/Out Console</CardTitle>
            <CardDescription>Log students arriving late or leaving early.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Student</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingStudents}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Search and select a student..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {students?.map((s) => (
                                <SelectItem key={s.uid} value={s.uid}>
                                {s.firstName} {s.lastName}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Tardy">Arriving Late (Tardy)</SelectItem>
                                <SelectItem value="Dismissed-Early">Leaving Early (Dismissed)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormControl><Input placeholder="e.g., Doctor's appointment" {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="isExcused"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Excused Event</FormLabel>
                            <FormDescription>
                                Mark this if the event is officially excused (e.g., with a doctor's note).
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                />


                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Log Event
                </Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}

    