
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, writeBatch, serverTimestamp, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Calculator } from 'lucide-react';
import { Class, Student } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

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
  topic: z.string().optional(),
  academicYear: z.string(),
  term: z.string(),
});

export function AssessmentFeedbackForm({ classId, classes }: { classId: string, classes: Class[] }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scores, setScores] = useState<Record<string, string>>({}); 

  // Fetch Students & Subjects
  const studentsQuery = useMemoFirebase(() => 
    (firestore && classId) ? query(collection(firestore, 'students'), where('classId', '==', classId)) : null,
  [firestore, classId]);
  const { data: students, isLoading: loadingStudents } = useCollection<Student>(studentsQuery);

  const subjectsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'subjects') : null, [firestore]);
  const { data: subjects } = useCollection<any>(subjectsQuery);

  const form = useForm<z.infer<typeof assessmentSchema>>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      academicYear: '2024-2025',
      term: 'First Term',
      maxScore: 100 // Default max score
    }
  });

  const currentMax = form.watch('maxScore');
  const currentType = form.watch('assessmentType');

  // Handle Score Input with Validation
  const handleScoreChange = (studentId: string, value: string) => {
    // Prevent entering numbers higher than max
    if (Number(value) > currentMax) return; 
    setScores(prev => ({ ...prev, [studentId]: value }));
  };

  const onSubmit = async (values: z.infer<typeof assessmentSchema>) => {
    if (!firestore || !user) return;
    
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
          studentId,
          score,
          subjectName, 
          teacherId: user.uid,
          classId: classId,
          createdAt: serverTimestamp(),
          gradedAt: serverTimestamp()
        });
      });

      await batch.commit();
      toast({ title: "Success", description: `Saved ${validScores.length} grades successfully.` });
      setScores({}); 
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
            <Calculator className="h-5 w-5 text-blue-600"/> Enter Class Grades
        </CardTitle>
      </CardHeader>
      <CardContent>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* CONFIGURATION ROW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Subject</label>
                    <Select onValueChange={(val) => form.setValue('subjectId', val)}>
                        <SelectTrigger className="bg-white border-slate-300"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                        <SelectContent>
                            {subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {form.formState.errors.subjectId && <p className="text-xs text-red-500">Required</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Assessment Category</label>
                    <Select onValueChange={(val: any) => form.setValue('assessmentType', val)}>
                        <SelectTrigger className="bg-white border-slate-300"><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Class Exercise (CA)">Class Exercise (CA)</SelectItem>
                            <SelectItem value="Homework (CA)">Homework (CA)</SelectItem>
                            <SelectItem value="Project (CA)">Project (CA)</SelectItem>
                            <SelectItem value="Mid-Term (CA)">Mid-Term (CA)</SelectItem>
                            <Separator />
                            <SelectItem value="End of Term Exam (Exam)">End of Term Exam (50%)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Max Possible Score</label>
                    <Input type="number" {...form.register('maxScore')} className="bg-white border-slate-300 font-bold" />
                </div>

                <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700">Topic (Optional)</label>
                     <Input {...form.register('topic')} placeholder="e.g. Algebra" className="bg-white border-slate-300"/>
                </div>
            </div>

            {/* STUDENTS LIST */}
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
      </CardContent>
    </Card>
  );
}
