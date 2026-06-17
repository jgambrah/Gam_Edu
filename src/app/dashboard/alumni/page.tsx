
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
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
import { z } from 'zod';
import { useCurrentSchool } from '@/hooks/use-current-school';

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Active Student</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 border-2 rounded-xl bg-slate-50 focus:ring-amber-500 focus:border-amber-500 transition-colors">
                    <SelectValue placeholder="Select a student to graduate" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {students.map(s => (
                    <SelectItem 
                      key={s.uid || s.id} 
                      value={s.uid || s.id || ''}
                    >
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
          name="graduationYear"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Graduation Year</FormLabel>
              <FormControl>
                <Input type="number" {...field} className="h-12 border-2 rounded-xl bg-slate-50 focus:ring-amber-500 focus:border-amber-500 font-bold transition-colors" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-amber-100 transition-all duration-200">
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
        const studentRef = doc(firestore, 'students', alumnus.uid || alumnus.id);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <FormField control={form.control} name="currentOccupation" render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Current Occupation</FormLabel>
              <FormControl><Input placeholder="e.g., Software Engineer" {...field} className="h-12 border-2 rounded-xl bg-slate-50 focus:ring-amber-500 focus:border-amber-500 font-medium transition-colors" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="employer" render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Employer</FormLabel>
              <FormControl><Input placeholder="e.g., Google" {...field} className="h-12 border-2 rounded-xl bg-slate-50 focus:ring-amber-500 focus:border-amber-500 font-medium transition-colors" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
           <FormField control={form.control} name="mentorshipWillingness" render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-2xl border-2 p-4 bg-slate-50 transition-colors hover:bg-slate-100/50">
              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-5 w-5 rounded-md border-2" /></FormControl>
              <div className="space-y-0.5 leading-none">
                <FormLabel className="text-sm font-bold text-slate-700">Willing to be a mentor</FormLabel>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-wide">Available for student mentorship events</p>
              </div>
            </FormItem>
          )} />
          <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black uppercase tracking-wider shadow-lg shadow-amber-100 transition-all duration-200">
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
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const studentsQuery = useMemoFirebase(() => 
    (schoolId && firestore) ? query(collection(firestore!, 'students'), where('schoolId', '==', schoolId)) : null,
  [firestore, schoolId]);

  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);
  
  const activeStudents = useMemo(() => students?.filter(s => s.enrollmentStatus !== 'Graduated') || [], [students]);
  const alumni = useMemo(() => students?.filter(s => s.enrollmentStatus === 'Graduated') || [], [students]);
  
  const isLoading = isLoadingSchool || isLoadingStudents;

  if (!role || !['Administrator', 'Director'].includes(role)) {
    return (
      <Card className="border-t-4 border-t-red-500 shadow-xl rounded-[2rem] bg-red-50/50">
        <CardHeader className="text-center p-8">
          <CardTitle className="text-xl font-black uppercase tracking-tight text-red-650">Access Denied</CardTitle>
          <CardDescription className="text-xs font-bold uppercase text-red-400 mt-1">This module is only accessible to Administrators and Directors.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Premium Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-500 p-8 md:p-12 text-white shadow-2xl border border-amber-400/20">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-yellow-400/10 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-yellow-100 backdrop-blur-md">
              <UserCheck className="h-3 w-3" /> Graduate Network
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight italic uppercase">
              Alumni <span className="text-yellow-200">Tracking</span>
            </h1>
            <p className="max-w-md text-sm font-medium text-amber-50">
              Manage the directory of graduated students, celebrate milestones, and trace mentorship initiatives.
            </p>
          </div>
          
          <Dialog open={isGraduateFormOpen} onOpenChange={setGraduateFormOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 rounded-2xl bg-white text-amber-700 hover:bg-yellow-50 font-black uppercase tracking-wider shadow-lg transition-all hover:scale-102 active:scale-98 border-none">
                <PlusCircle className="mr-2 h-4 w-4 text-amber-600" /> Graduate a Student
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] border-slate-900 border-2 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-black uppercase italic text-slate-800">Graduate Active Student</DialogTitle>
                <DialogDescription className="text-xs font-bold text-slate-400 uppercase">
                  Select an active student to transition them into the alumni network.
                </DialogDescription>
              </DialogHeader>
              <GraduateStudentForm setOpen={setGraduateFormOpen} students={activeStudents} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Graduated</p>
              <h3 className="text-3xl font-black text-slate-800">{alumni.length}</h3>
              <p className="text-xs font-medium text-slate-500">Registered alumni</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
              <UserCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Mentorship Willingness</p>
              <h3 className="text-3xl font-black text-slate-800">
                {alumni.filter(a => a.alumniDetails?.mentorshipWillingness).length}
              </h3>
              <p className="text-xs font-medium text-slate-500">Volunteering as mentors</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Cohort Years</p>
              <h3 className="text-3xl font-black text-slate-800">
                {Array.from(new Set(alumni.map(a => a.graduationYear).filter(Boolean))).length}
              </h3>
              <p className="text-xs font-medium text-slate-500">Distinct graduation classes</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A5.998 5.998 0 0 1 1.75 4.505a48.067 48.067 0 0 1 20.5 0A5.998 5.998 0 0 1 22.25 9.33a50.57 50.57 0 0 0-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M12 13.489v6.904M12 21v-7.511" />
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Directory Section */}
      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="bg-slate-900 text-white pb-6 pt-8 px-8 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black uppercase tracking-tight">Alumni Directory</CardTitle>
            <CardDescription className="text-slate-400 font-bold text-xs uppercase mt-1">
              Graduates directory and employment database
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-slate-50/20">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              <p className="text-xs font-black uppercase text-slate-400">Loading Directory...</p>
            </div>
          ) : alumni.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-bold uppercase text-xs tracking-wider">
              No alumni records found. Graduate active students to begin.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50 border-b">
                  <TableRow>
                    <TableHead className="pl-8 font-black text-[10px] uppercase text-slate-400 tracking-wider">Alumnus Name</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-slate-400 tracking-wider">Graduation Year</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-slate-400 tracking-wider">Contact</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-slate-400 tracking-wider">Current Status</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-slate-400 tracking-wider">Mentorship</TableHead>
                    <TableHead className="pr-8 text-right font-black text-[10px] uppercase text-slate-400 tracking-wider">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alumni.map(alumnus => (
                    <TableRow key={alumnus.uid || alumnus.id} className="hover:bg-amber-50/10 transition-colors">
                      <TableCell className="pl-8 py-4 font-bold text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-black text-sm uppercase border border-amber-200 shrink-0">
                            {alumnus.firstName[0]}{alumnus.lastName[0]}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-800 leading-tight">{alumnus.firstName} {alumnus.lastName}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">ID: {alumnus.id || 'N/A'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 font-black text-slate-700 font-mono text-sm">
                        {alumnus.graduationYear || 'N/A'}
                      </TableCell>
                      <TableCell className="py-4">
                        {alumnus.email ? (
                          <a href={`mailto:${alumnus.email}`} className="text-amber-600 hover:text-amber-700 font-semibold hover:underline text-sm flex items-center gap-1.5 w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            {alumnus.email}
                          </a>
                        ) : (
                          <span className="text-slate-400 text-sm">No email</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-sm font-medium text-slate-600">
                        {alumnus.alumniDetails?.currentOccupation && alumnus.alumniDetails?.employer ? (
                          <div className="space-y-0.5">
                            <span className="block text-slate-800 font-bold leading-tight">{alumnus.alumniDetails.currentOccupation}</span>
                            <span className="block text-xs text-slate-400 font-medium">at {alumnus.alumniDetails.employer}</span>
                          </div>
                        ) : alumnus.alumniDetails?.currentOccupation ? (
                          <span className="text-slate-800 font-bold leading-tight">{alumnus.alumniDetails.currentOccupation}</span>
                        ) : (
                          <span className="text-slate-400 italic">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        {alumnus.alumniDetails?.mentorshipWillingness ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 uppercase tracking-wider border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Mentor
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider border border-slate-200">
                            No
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="pr-8 py-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingAlumnus(alumnus)}
                          className="h-8 rounded-xl border-slate-200 hover:bg-slate-50 font-bold text-xs uppercase text-slate-600 transition-colors"
                        >
                          Edit Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {editingAlumnus && (
        <Dialog open={!!editingAlumnus} onOpenChange={(open) => !open && setEditingAlumnus(null)}>
            <DialogContent className="rounded-[2.5rem] border-slate-900 border-2 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black uppercase italic text-slate-800">Edit Alumni Details</DialogTitle>
                  <DialogDescription className="text-xs font-bold text-slate-400 uppercase">
                    Update employment and mentorship profile details for {editingAlumnus.firstName}.
                  </DialogDescription>
                </DialogHeader>
                <EditAlumniDetailsForm setOpen={(open) => !open && setEditingAlumnus(null)} alumnus={editingAlumnus} />
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
