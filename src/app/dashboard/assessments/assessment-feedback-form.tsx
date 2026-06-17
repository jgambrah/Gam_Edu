'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch, serverTimestamp, query, where } from 'firebase/firestore';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Calculator, CalendarIcon } from 'lucide-react';
import { Class, Student } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// --- SCHEMA ---
const assessmentSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  assessmentType: z.enum([
    'Class Exercise (CA)', 
    'Homework (CA)', 
    'Project (CA)', 
    'Mid-Term (CA)', 
    'End of Term Exam (Exam)'
  ]),
  maxScore: z.coerce.number().min(1, "Max score must be at least 1"),
  assessmentName: z.string().min(3, "Assessment Name/Topic is required."),
  assessmentDate: z.date({ required_error: "A date for the assessment is required."}),
});

export function AssessmentFeedbackForm({ classId, classes, academicYear, term, onSuccess }: { classId: string, classes: Class[], academicYear: string, term: string, onSuccess: () => void }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scores, setScores] = useState<Record<string, string>>({}); 

  // Fetch Students & Subjects
  const studentsQuery = useMemoFirebase(() => 
    (firestore && classId && schoolId) ? query(
      collection(firestore, 'students'), 
      where('classId', '==', classId), 
      where('schoolId', '==', schoolId),
      where('enrollmentStatus', '==', 'Active')
    ) : null,
  [firestore, classId, schoolId]);
  const { data: students, isLoading: loadingStudents } = useCollection<Student>(studentsQuery);

  const subjectsQuery = useMemoFirebase(() => firestore && schoolId ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: subjects } = useCollection<any>(subjectsQuery);

  const form = useForm<z.infer<typeof assessmentSchema>>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      maxScore: 100,
      assessmentDate: new Date(),
      assessmentName: '',
    }
  });

  const currentMax = form.watch('maxScore');

  const handleScoreChange = (studentId: string, value: string) => {
    if (value !== '' && Number(value) > currentMax) return; 
    setScores(prev => ({ ...prev, [studentId]: value }));
  };

  const onSubmit = async (values: z.infer<typeof assessmentSchema>) => {
    if (!firestore || !user || !schoolId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Authentication or school context is missing.' });
        return;
    }
    
    const validScores = Object.entries(scores).filter(([_, score]) => score !== '' && !isNaN(Number(score)));
    if (validScores.length === 0) {
      toast({ variant: 'destructive', title: "No Scores Entered", description: "Please enter scores for at least one student." });
      return;
    }

    setIsSubmitting(true);
    try {
      const batch = writeBatch(firestore);
      const subjectName = subjects?.find(s => s.id === values.subjectId)?.name || 'Unknown Subject';

      validScores.forEach(([studentId, scoreVal]) => {
        const ref = doc(collection(firestore, 'assessments'));
        const score = parseFloat(scoreVal);
        
        batch.set(ref, {
          ...values,
          academicYear,
          term,        
          studentId,
          score,
          subjectName, 
          teacherId: user.uid,
          classId: classId,
          createdAt: serverTimestamp(),
          gradedAt: serverTimestamp(),
          schoolId: schoolId,
        });
      });

      await batch.commit();
      toast({ title: "Scores Logged", description: `Saved ${validScores.length} grades successfully.` });
      setScores({}); 
      form.reset({ maxScore: 100, assessmentName: '', assessmentDate: new Date() });
      onSuccess(); 
    } catch (e: any) {
      console.error(e);
      toast({ variant: 'destructive', title: "Error", description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          
          <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="assessmentName" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold dark:text-slate-300">Assessment Name/Topic *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Fraction Homework 1" {...field} className="bg-white dark:bg-slate-950 border-slate-200 focus:border-violet-500 rounded-lg h-9" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="assessmentDate" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-slate-700 font-semibold dark:text-slate-300">Assessment Date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'} className={cn('pl-3 text-left font-normal bg-white dark:bg-slate-950 border-slate-200 focus:border-violet-500 rounded-lg h-9',!field.value && 'text-muted-foreground')}>
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-slate-500" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="subjectId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold dark:text-slate-300">Subject *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-slate-955 border-slate-200 focus:border-violet-500 rounded-lg h-9">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subjects?.map(s => <SelectItem key={s.id} value={s.id} className="cursor-pointer">{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage/>
                </FormItem>
              )}/>
              <FormField control={form.control} name="assessmentType" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold dark:text-slate-300">Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white dark:bg-slate-955 border-slate-200 focus:border-violet-500 rounded-lg h-9">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Class Exercise (CA)">Class Exercise (CA)</SelectItem>
                      <SelectItem value="Homework (CA)">Homework (CA)</SelectItem>
                      <SelectItem value="Project (CA)">Project (CA)</SelectItem>
                      <SelectItem value="Mid-Term (CA)">Mid-Term (CA)</SelectItem>
                      <Separator />
                      <SelectItem value="End of Term Exam (Exam)">End of Term Exam (Exam)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage/>
                </FormItem>
              )}/>
              <FormField control={form.control} name="maxScore" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold dark:text-slate-300">Max Possible Score *</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} className="bg-white dark:bg-slate-955 border-slate-200 focus:border-violet-500 rounded-lg h-9 font-bold font-mono" />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>
            </div>
          </div>

          <div className="border rounded-2xl overflow-hidden max-h-[300px] overflow-y-auto shadow-inner bg-white dark:bg-slate-950">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b">
                <TableRow>
                  <TableHead className="font-extrabold text-xs">Student Name</TableHead>
                  <TableHead className="w-[180px] font-extrabold text-xs">Score (Out of {currentMax})</TableHead>
                  <TableHead className="w-[120px] text-right font-extrabold text-xs">Weighted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingStudents ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      <Loader2 className="animate-spin h-5 w-5 mx-auto text-purple-600"/>
                    </TableCell>
                  </TableRow>
                ) : !students || students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-slate-400 italic text-xs">
                      No active students found in this class.
                    </TableCell>
                  </TableRow>
                ) : students.map(student => {
                  const raw = parseFloat(scores[student.uid] || '0');
                  const percentage = currentMax > 0 ? (raw / currentMax) * 100 : 0;
                  
                  return (
                    <TableRow key={student.uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <TableCell className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <Input 
                            type="number" 
                            min="0"
                            max={currentMax}
                            value={scores[student.uid] || ''}
                            onChange={(e) => handleScoreChange(student.uid, e.target.value)}
                            className="pr-12 font-bold font-mono h-8 text-xs border-slate-200 rounded-lg"
                          />
                          <span className="absolute right-2.5 top-2 text-[9px] text-slate-400 font-bold uppercase">/ {currentMax}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-slate-400 font-mono text-xs font-bold">
                        {raw > 0 ? `${percentage.toFixed(1)}%` : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin"/>
            ) : (
              <>
                <Save className="h-4.5 w-4.5"/> Save Class Grades
              </>
            )}
          </Button>

        </form>
      </Form>
    </div>
  );
}
