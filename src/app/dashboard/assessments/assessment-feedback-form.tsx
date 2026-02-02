'use client';

import { useState, useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

// --- SCHEMA (Updated with required fields) ---
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
    (firestore && classId) ? query(collection(firestore, 'students'), where('classId', '==', classId)) : null,
  [firestore, classId]);
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
    if (Number(value) > currentMax) return; 
    setScores(prev => ({ ...prev, [studentId]: value }));
  };

  const onSubmit = async (values: z.infer<typeof assessmentSchema>) => {
    if (!firestore || !user || !schoolId) {
        toast({ variant: 'destructive', title: 'Error', description: 'Authentication or school context is missing.' });
        return;
    }
    
    const validScores = Object.entries(scores).filter(([_, score]) => score !== '' && !isNaN(Number(score)));
    if (validScores.length === 0) {
      toast({ variant: 'destructive', title: "No Scores", description: "Please enter scores for at least one student." });
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
          schoolId: schoolId, // SAAS: Stamp with schoolId
        });
      });

      await batch.commit();
      toast({ title: "Success", description: `Saved ${validScores.length} grades successfully.` });
      setScores({}); 
      form.reset({ maxScore: 100, assessmentName: '', assessmentDate: new Date() });
      onSuccess(); // Trigger refetch in parent
    } catch (e: any) {
      console.error(e);
      toast({ variant: 'destructive', title: "Error", description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-600 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600"/> Enter Class Grades for {academicYear} - {term}
        </CardTitle>
      </CardHeader>
      <CardContent>
         <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-4 p-4 bg-slate-50 rounded-lg border">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="assessmentName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assessment Name/Topic *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., End of Term Exam" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="assessmentDate" render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Assessment Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={'outline'} className={cn('pl-3 text-left font-normal bg-white',!field.value && 'text-muted-foreground')}>
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
                    )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="subjectId" render={({ field }) => (
                        <FormItem><FormLabel>Subject *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger className="bg-white border-slate-300"><SelectValue placeholder="Select Subject" /></SelectTrigger></FormControl>
                                <SelectContent>{subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                            </Select><FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="assessmentType" render={({ field }) => (
                        <FormItem><FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger className="bg-white border-slate-300"><SelectValue placeholder="Type" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Class Exercise (CA)">Class Exercise (CA)</SelectItem>
                                <SelectItem value="Homework (CA)">Homework (CA)</SelectItem>
                                <SelectItem value="Project (CA)">Project (CA)</SelectItem>
                                <SelectItem value="Mid-Term (CA)">Mid-Term (CA)</SelectItem>
                                <Separator />
                                <SelectItem value="End of Term Exam (Exam)">End of Term Exam (50%)</SelectItem>
                            </SelectContent>
                        </Select><FormMessage/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="maxScore" render={({ field }) => (
                        <FormItem><FormLabel>Max Possible Score *</FormLabel>
                        <FormControl><Input type="number" {...field} className="bg-white border-slate-300 font-bold" /></FormControl><FormMessage/></FormItem>
                    )}/>
                </div>
            </div>

            <div className="border rounded-md max-h-[500px] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-100">
                            <TableHead>Student Name</TableHead>
                            <TableHead className="w-[200px]">Score (Out of {currentMax})</TableHead>
                            <TableHead className="w-[150px] text-right">Weighted Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loadingStudents ? (
                            <TableRow><TableCell colSpan={3} className="text-center"><Loader2 className="animate-spin h-6 w-6 mx-auto"/></TableCell></TableRow>
                        ) : students?.map(student => {
                            const raw = parseFloat(scores[student.uid] || '0');
                            const percentage = (raw / currentMax) * 100;
                            
                            return (
                            <TableRow key={student.uid}>
                                <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                                <TableCell>
                                    <div className="relative">
                                        <Input 
                                            type="number" 
                                            value={scores[student.uid] || ''}
                                            onChange={(e) => handleScoreChange(student.uid, e.target.value)}
                                            className="pr-12 font-mono"
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">/ {currentMax}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground font-mono text-xs">
                                    {raw > 0 ? `${percentage.toFixed(1)}%` : '-'}
                                </TableCell>
                            </TableRow>
                        )})}
                    </TableBody>
                </Table>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <Save className="mr-2 h-5 w-5"/>}
                Save Grades
            </Button>

         </form>
         </Form>
      </CardContent>
    </Card>
  );
}
    
