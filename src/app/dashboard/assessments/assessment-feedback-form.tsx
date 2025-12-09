
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
import { collection, query, where, addDoc, serverTimestamp, getDocs, updateDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { assessmentFeedbackSchema } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { useRole } from '@/context/role-context';
import type { Class, Student } from '@/lib/types';

// Define Subject Type locally if not in types
type Subject = { id: string; name: string; code?: string };

export function AssessmentFeedbackForm({ classId, classes: propClasses }: { classId?: string; classes: Class[] }) {
    const { user } = useAuth();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [students, setStudents] = useState<Student[]>([]);
  
    // 1. FETCH REAL SUBJECTS FROM FIRESTORE
    const subjectsQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'subjects'), orderBy('name')) : null, 
    [firestore]);
    const { data: subjects, isLoading: isLoadingSubjects } = useCollection<Subject>(subjectsQuery);

    const form = useForm<z.infer<typeof assessmentFeedbackSchema>>({
      resolver: zodResolver(assessmentFeedbackSchema),
      // FIX: Provide explicit default values for ALL fields to prevent "uncontrolled to controlled" error
      defaultValues: {
        academicYear: MOCK_ACADEMIC_YEARS[0],
        term: MOCK_TERMS[0],
        assessmentType: 'Quiz',
        teacherId: user?.uid || '',
        classId: classId || '',
        assessmentName: '',
        studentId: '',
        subjectId: '',
        score: 0,
        maxScore: 100,
        feedback: '',
        // assessmentDate is optional/undefined initially, handled by Popover
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
        // 1. Check connections BEFORE starting the loader
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'System Error', description: 'Database connection not ready. Please refresh.' });
            return;
        }

        setIsSubmitting(true);
    
        try {
            // 2. Check for existing grade (Requires Index)
            const q = query(
                collection(firestore, 'assessments'),
                where('studentId', '==', values.studentId),
                where('assessmentName', '==', values.assessmentName)
            );
            
            const querySnapshot = await getDocs(q);

            // Find Subject Name safely
            const subjectName = subjects?.find(s => s.id === values.subjectId)?.name || 'General';

            const dataToSave = {
                ...values,
                subject: subjectName, 
                teacherId: values.teacherId || user.uid,
                createdAt: serverTimestamp(),
            };

            if (!querySnapshot.empty) {
                // Update existing
                const docToUpdate = querySnapshot.docs[0];
                await updateDoc(docToUpdate.ref, dataToSave);
                toast({ title: 'Success', description: 'Grade updated successfully.' });
            } else {
                // Add new
                await addDoc(collection(firestore, 'assessments'), dataToSave);
                toast({ title: 'Success', description: 'Grade saved successfully.' });
            }
    
            // Reset form but keep context (Class/Subject) so you can add the next student easily
            form.reset({
                ...values,
                score: 0,
                feedback: '',
                // Don't reset studentId so they can pick the next one, or reset it if you prefer
                studentId: '', 
            });

        } catch (error: any) {
          console.error("Error saving assessment feedback:", error);
          
          // Check for Missing Index Error specifically
          if (error.message.includes('requires an index')) {
              toast({ variant: 'destructive', title: 'System Setup Required', description: 'An Admin needs to create the database index. Check console.' });
          } else {
              toast({ variant: 'destructive', title: 'Error', description: error.message });
          }
        } finally {
          // 3. ALWAYS stop the loader
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
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedClassId}>
                            <FormControl><SelectTrigger><SelectValue placeholder={students.length > 0 ? "Select Student" : "No students found"} /></SelectTrigger></FormControl>
                            <SelectContent>
                                {students?.map(s => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
                
                 {/* UPDATED SUBJECT FIELD */}
                 <FormField control={form.control} name="subjectId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingSubjects}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {subjects?.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                                {subjects?.length === 0 && <SelectItem value="none" disabled>No subjects created yet</SelectItem>}
                            </SelectContent>
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
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                 <FormField control={form.control} name="maxScore" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Max Score (Optional)</FormLabel>
                        <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
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
