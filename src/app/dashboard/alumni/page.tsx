
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, UserCheck, PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Student, graduateStudentSchema, editAlumniSchema, AlumniDetails } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

// --- Form for Graduating a student ---
function GraduateStudentForm({ setOpen, students }: { setOpen: (open: boolean) => void, students: Student[] }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof graduateStudentSchema>>({
    resolver: zodResolver(graduateStudentSchema),
    defaultValues: {
      graduationYear: new Date().getFullYear(),
    },
  });

  async function onSubmit(values: z.infer<typeof graduateStudentSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      const studentRef = doc(firestore, 'students', values.studentId);
      await updateDocumentNonBlocking(studentRef, {
        enrollmentStatus: 'Graduated',
        graduationYear: values.graduationYear,
        classId: '',
        alumniDetails: {
            currentOccupation: '',
            employer: '',
            mentorshipWillingness: false,
        }
      });
      toast({
        title: 'Student Graduated',
        description: 'The student has been moved to the alumni directory.',
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error graduating student:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while graduating the student.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="studentId" render={({ field }) => (
          <FormItem>
            <FormLabel>Active Student</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a student to graduate" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {students.map(s => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="graduationYear" render={({ field }) => (
          <FormItem>
            <FormLabel>Graduation Year</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Graduate Student
        </Button>
      </form>
    </Form>
  );
}

// --- Form for Editing Alumni Details ---
function EditAlumniDetailsForm({ setOpen, alumnus }: { setOpen: (open: boolean) => void, alumnus: Student }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const form = useForm<AlumniDetails>({
      resolver: zodResolver(editAlumniSchema),
      defaultValues: {
        currentOccupation: alumnus.alumniDetails?.currentOccupation || '',
        employer: alumnus.alumniDetails?.employer || '',
        mentorshipWillingness: alumnus.alumniDetails?.mentorshipWillingness || false,
      },
    });
  
    async function onSubmit(values: AlumniDetails) {
      if (!firestore) return;
      setIsSubmitting(true);
      try {
        const studentRef = doc(firestore, 'students', alumnus.uid);
        await updateDocumentNonBlocking(studentRef, {
          alumniDetails: values,
        });
        toast({
          title: 'Alumni Details Updated',
        });
        form.reset();
        setOpen(false);
      } catch (error) {
        console.error('Error updating alumni details:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An error occurred while updating details.',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="currentOccupation" render={({ field }) => (
            <FormItem><FormLabel>Current Occupation</FormLabel><FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="employer" render={({ field }) => (
            <FormItem><FormLabel>Employer</FormLabel><FormControl><Input placeholder="e.g., Google" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="mentorshipWillingness" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              <div className="space-y-1 leading-none"><FormLabel>Willing to be a mentor</FormLabel></div>
            </FormItem>
          )} />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save Changes
          </Button>
        </form>
      </Form>
    );
  }

// --- Main Alumni Page ---
export default function AlumniPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const [isGraduateFormOpen, setGraduateFormOpen] = useState(false);
  const [editingAlumnus, setEditingAlumnus] = useState<Student | null>(null);

  const studentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'students');
  }, [firestore]);
  const { data: students, isLoading } = useCollection<Student>(studentsQuery);
  
  const activeStudents = useMemo(() => students?.filter(s => s.enrollmentStatus !== 'Graduated') || [], [students]);
  const alumni = useMemo(() => students?.filter(s => s.enrollmentStatus === 'Graduated') || [], [students]);
  
  if (!['Administrator', 'Director'].includes(role)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>This module is only accessible to Administrators and Directors.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><UserCheck />Alumni Tracking</h1>
          <p className="text-muted-foreground">Manage the directory of graduated students.</p>
        </div>
        <Dialog open={isGraduateFormOpen} onOpenChange={setGraduateFormOpen}>
            <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Graduate a Student</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>Graduate an Active Student</DialogTitle><DialogDescription>Select a student to move them to the alumni directory.</DialogDescription></DialogHeader>
                <GraduateStudentForm setOpen={setGraduateFormOpen} students={activeStudents} />
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle>Alumni Directory</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <div className='flex justify-center p-8'><Loader2 className="h-8 w-8 animate-spin" /></div> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alumnus Name</TableHead>
                  <TableHead>Graduation Year</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead>Mentor?</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alumni.map(alumnus => (
                  <TableRow key={alumnus.uid}>
                    <TableCell className="font-medium">{alumnus.firstName} {alumnus.lastName}</TableCell>
                    <TableCell>{alumnus.graduationYear}</TableCell>
                    <TableCell>
                      <Link href={`mailto:${alumnus.email}`} className="text-blue-600 hover:underline">{alumnus.email}</Link>
                    </TableCell>
                    <TableCell>{alumnus.alumniDetails?.currentOccupation} at {alumnus.alumniDetails?.employer}</TableCell>
                    <TableCell>
                      <Badge variant={alumnus.alumniDetails?.mentorshipWillingness ? 'default' : 'secondary'}>
                        {alumnus.alumniDetails?.mentorshipWillingness ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setEditingAlumnus(alumnus)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {editingAlumnus && (
        <Dialog open={!!editingAlumnus} onOpenChange={(open) => !open && setEditingAlumnus(null)}>
            <DialogContent>
                <DialogHeader><DialogTitle>Edit Alumni Details</DialogTitle><DialogDescription>Update post-graduation information for {editingAlumnus.firstName}.</DialogDescription></DialogHeader>
                <EditAlumniDetailsForm setOpen={(open) => !open && setEditingAlumnus(null)} alumnus={editingAlumnus} />
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
