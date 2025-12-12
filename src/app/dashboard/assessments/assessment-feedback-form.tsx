
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { Class, Student } from '@/lib/types';
import { useCollection, useMemoFirebase } from '@/firebase';
import { query, where } from 'firebase/firestore';

// --- SCHEMA ---
const assessmentSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  // UPDATED: Strict types to help calculation
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
  const [scores, setScores] = useState<Record<string, string>>({}); // studentId -> score

  // 1. Fetch Students in Class
  const studentsQuery = useMemoFirebase(() => 
    (firestore && classId) ? query(collection(firestore, 'students'), where('classId', '==', classId)) : null,
  [firestore, classId]);
  const { data: students, isLoading: loadingStudents } = useCollection<Student>(studentsQuery);

  // 2. Fetch Subjects
  const subjectsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'subjects') : null, [firestore]);
  const { data: subjects } = useCollection<any>(subjectsQuery);

  // Form Setup
  const form = useForm<z.infer<typeof assessmentSchema>>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      academicYear: '2024-2025',
      term: 'First Term',
      maxScore: 100
    }
  });

  // Handle Score Input
  const handleScoreChange = (studentId: string, value: string) => {
    setScores(prev => ({ ...prev, [studentId]: value }));
  };

  // Submit Batch
  const onSubmit = async (values: z.infer<typeof assessmentSchema>) => {
    if (!firestore || !user) return;
    
    // Validate that we have scores
    const validScores = Object.entries(scores).filter(([_, score]) => score !== '' && !isNaN(Number(score)));
    if (validScores.length === 0) {
      toast({ variant: 'destructive', title: "No Scores", description: "Please enter scores for at least one student." });
      return;
    }

    setIsSubmitting(true);
    try {
      const batch = writeBatch(firestore);
      
      // Find Subject Name for denormalization
      const subjectName = subjects?.find(s => s.id === values.subjectId)?.name || 'Unknown Subject';

      validScores.forEach(([studentId, scoreVal]) => {
        const ref = doc(collection(firestore, 'assessments'));
        const score = parseFloat(scoreVal);
        
        // Safety check
        if (score > values.maxScore) {
           throw new Error(`Score for student ${studentId} exceeds max score.`);
        }

        batch.set(ref, {
          ...values,
          studentId,
          score,
          subjectName, // Save name directly to fix display issues
          teacherId: user.uid,
          classId: classId,
          createdAt: serverTimestamp(),
          gradedAt: serverTimestamp()
        });
      });

      await batch.commit();
      toast({ title: "Success", description: `Saved ${validScores.length} grades successfully.` });
      setScores({}); // Reset scores
      // Don't reset form values to allow quick entry of next subject
    } catch (e: any) {
      console.error(e);
      toast({ variant: 'destructive', title: "Error", description: e.message || "Failed to save grades." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-600">
      <CardHeader>
        <CardTitle>Enter Class Grades</CardTitle>
      </CardHeader>
      <CardContent>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* CONFIGURATION ROW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Select onValueChange={(val) => form.setValue('subjectId', val)}>
                        <SelectTrigger className="bg-white"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                        <SelectContent>
                            {subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    {form.formState.errors.subjectId && <p className="text-xs text-red-500">Required</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Assessment Type</label>
                    <Select onValueChange={(val: any) => form.setValue('assessmentType', val)}>
                        <SelectTrigger className="bg-white"><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Class Exercise (CA)">Class Exercise (CA)</SelectItem>
                            <SelectItem value="Homework (CA)">Homework (CA)</SelectItem>
                            <SelectItem value="Project (CA)">Project (CA)</SelectItem>
                            <SelectItem value="Mid-Term (CA)">Mid-Term (CA)</SelectItem>
                            <SelectItem value="End of Term Exam (Exam)">End of Term Exam</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Max Score</label>
                    <Input type="number" {...form.register('maxScore')} className="bg-white" />
                </div>

                <div className="space-y-2">
                     <label className="text-sm font-medium">Topic (Optional)</label>
                     <Input {...form.register('topic')} placeholder="e.g. Algebra" className="bg-white"/>
                </div>
            </div>

            {/* STUDENTS LIST */}
            <div className="border rounded-md max-h-[500px] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-100">
                            <TableHead>Student Name</TableHead>
                            <TableHead className="w-[150px]">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loadingStudents ? (
                            <TableRow><TableCell colSpan={2} className="text-center"><Loader2 className="animate-spin h-6 w-6 mx-auto"/></TableCell></TableRow>
                        ) : students?.map(student => (
                            <TableRow key={student.uid}>
                                <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                                <TableCell>
                                    <Input 
                                        type="number" 
                                        placeholder={`/ ${form.watch('maxScore')}`}
                                        value={scores[student.uid] || ''}
                                        onChange={(e) => handleScoreChange(student.uid, e.target.value)}
                                        className={Number(scores[student.uid]) > form.watch('maxScore') ? "border-red-500 bg-red-50" : ""}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                Save Grades
            </Button>

         </form>
      </CardContent>
    </