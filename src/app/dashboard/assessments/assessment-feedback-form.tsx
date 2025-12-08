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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp, getDocs, updateDoc, onSnapshot } from 'firebase/firestore';
import { assessmentFeedbackSchema } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MOCK_ACADEMIC_YEARS, MOCK_SUBJECTS, MOCK_TERMS } from '@/lib/data';
import { useRole } from '@/context/role-context';
import type { Class, Student } from '@/lib/types';


export function AssessmentFeedbackForm({ classId, classes: propClasses }: { classId?: string; classes: Class[] }) {
    const { user } = useAuth();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [students, setStudents] = useState<Student[]>([]);
  
    const form = useForm<z.infer<typeof assessmentFeedbackSchema>>({
      resolver: zodResolver(assessmentFeedbackSchema),
      defaultValues: {
        academicYear: MOCK_ACADEMIC_YEARS[0],
        term: MOCK_TERMS[0],
        assessmentType: 'Quiz',
        teacherId: user?.uid,
        classId: classId || '',
      },
    });

    const selectedClassId = form.watch('classId');

    // Effect to set the classId from props
    useEffect(() => {
        if (classId) {
            form.setValue('classId', classId);
        }
    }, [classId, form]);

    useEffect(() => {
        if (!selectedClassId || !firestore) {
            setStudents([]);
            return;
        };

        const studentsQuery = query(collection(firestore, 'students'), where('classId', '==', selectedClassId));
        const unsubscribe = onSnapshot(studentsQuery, (snapshot) => {
            setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student)));
        });

        return () => unsubscribe();
    }, [selectedClassId, firestore]);
  
  
    async function onSubmit(values: z.infer<typeof assessmentFeedbackSchema>) {
        setIsSubmitting(true);
        if (!user || !firestore) return;
    
        try {
            const querySnapshot = await getDocs(query(
                collection(firestore, 'assessments'),
                where('studentId', '==', values.studentId),
                where('assessmentName', '==', values.assessmentName)
            ));

            const dataToSave = {
                ...values,
                teacherId: values.teacherId || user.uid,
                createdAt: serverTimestamp(),
            };

            if (!querySnapshot.empty) {
                // Update existing document
                const docToUpdate = querySnapshot.docs[0];
                await updateDoc(docToUpdate.ref, dataToSave);
                toast({ title: 'Success', description: 'Assessment feedback updated.' });
            } else {
                // Add new document
                await addDoc(collection(firestore, 'assessments'), dataToSave);
                toast({ title: 'Success', description: 'Assessment feedback saved.' });
            }
    
          form.reset();
        } catch (error) {
          console.error("Error saving assessment feedback:", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not save feedback.' });
        } finally {
          setIsSubmitting(false);
        }
    }
  
    return (
      <Card>
        <CardHeader>
            <CardTitle>Continuous Assessment Entry</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="academicYear" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="term" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term/Semester</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{MOCK_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                {!classId && (
                    <FormField control={form.control} name="classId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Class</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger></FormControl>
                                <SelectContent>{propClasses?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="studentId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Student</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedClassId}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a student" /></SelectTrigger></FormControl>
                            <SelectContent>{students?.map(s => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="subjectId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger></FormControl>
                            <SelectContent>{MOCK_SUBJECTS.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="assessmentName" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Assessment Name</FormLabel>
                        <FormControl><Input placeholder="e.g., Mid-Term Exam" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="assessmentType" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Assessment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Quiz">Quiz</SelectItem>
                                <SelectItem value="Assignment">Assignment</SelectItem>
                                <SelectItem value="Activity">Activity</SelectItem>
                                <SelectItem value="Exam">Exam</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormField control={form.control} name="assessmentDate" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Assessment Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="score" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Score (Optional)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="maxScore" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Max Score (Optional)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
              </div>

              <FormField control={form.control} name="feedback" render={({ field }) => (
                <FormItem>
                    <FormLabel>Feedback / Comments</FormLabel>
                    <FormControl><Textarea placeholder="Provide qualitative feedback..." {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Entry
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
}
