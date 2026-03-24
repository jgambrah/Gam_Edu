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
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useFirestore, useMemoFirebase, useUser, errorEmitter, FirestorePermissionError, useCollection } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import React, { useState, useMemo } from 'react';
import { collection, doc, query, where, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, PlusCircle, User, Users, BookOpen, UserCircle, Trash2, ArrowLeft, CalendarCheck, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRole } from '@/context/role-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DailyAttendanceSheet } from '../attendance/daily-attendance-sheet';
import { Subject, TimetableEntry, Student, Class } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TimetableDisplay } from '../timetable/timetable-display';
import { StudentDisplay } from '@/components/student-display';
import { Badge } from '@/components/ui/badge';

const createClassSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  description: z.string().optional(),
  teacherId: z.string().min(1, "A teacher must be assigned"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
});

function ClassDetailView({ 
    selectedClass, 
    onBack, 
    students, 
    timetable, 
    subjects, 
    teachers 
}: { 
    selectedClass: Class, 
    onBack: () => void, 
    students: Student[], 
    timetable: TimetableEntry[], 
    subjects: Subject[], 
    teachers: any[] 
}) {
    const classStudents = useMemo(() => students.filter(s => s.classId === selectedClass.id), [students, selectedClass.id]);
    const classTimetable = useMemo(() => timetable.filter(t => t.classId === selectedClass.id), [timetable, selectedClass.id]);
    const teacher = useMemo(() => teachers.find(t => t.uid === selectedClass.teacherId), [teachers, selectedClass.teacherId]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2 pl-0 hover:bg-transparent hover:text-indigo-600">
                    <ArrowLeft className="h-4 w-4" /> Back to Classes
                </Button>
                <div className="flex gap-2">
                    <Badge variant="outline" className="bg-white px-3 py-1 border-2">
                        Class Capacity: {classStudents.length} / {selectedClass.capacity || 0}
                    </Badge>
                </div>
            </div>

            <Card className="border-t-4 border-t-indigo-600 shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">{selectedClass.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                                <User className="h-3 w-3" /> Form Teacher: {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned'}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 border-t">
                    <Tabs defaultValue="attendance" className="w-full">
                        <div className="px-6 bg-slate-50/50 border-b">
                            <TabsList className="bg-transparent h-12 p-0 gap-6">
                                <TabsTrigger value="roster" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none shadow-none bg-transparent">
                                    <Users className="h-4 w-4 mr-2" /> Student Roster
                                </TabsTrigger>
                                <TabsTrigger value="attendance" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none shadow-none bg-transparent">
                                    <CalendarCheck className="h-4 w-4 mr-2" /> Daily Attendance
                                </TabsTrigger>
                                <TabsTrigger value="timetable" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none shadow-none bg-transparent">
                                    <Clock className="h-4 w-4 mr-2" /> Timetable
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="roster" className="p-6 m-0">
                            <div className="rounded-xl border bg-white overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead>Student</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {classStudents.map(student => (
                                            <TableRow key={student.uid}>
                                                <TableCell><StudentDisplay student={student} variant="list" showAvatar /></TableCell>
                                                <TableCell className="text-slate-500 text-xs">{student.email}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <a href={`/dashboard/students-v3?search=${student.firstName}`}>View Profile</a>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {classStudents.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-12 text-muted-foreground italic">No students assigned to this class.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="attendance" className="p-6 m-0">
                            <DailyAttendanceSheet classId={selectedClass.id} />
                        </TabsContent>

                        <TabsContent value="timetable" className="p-6 m-0">
                            <TimetableDisplay 
                                timetable={classTimetable}
                                subjects={subjects}
                                teachers={teachers}
                                rooms={[]} 
                                timeSlots={[]} 
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AcademicsPageContent() {
  const { role, loading: isRoleLoading } = useRole();
  const firestore = useFirestore();
  const { user } = useUser();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
  const { toast } = useToast();
  
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManageClasses = role === 'Director' || role === 'Administrator';
  const isStaff = !isRoleLoading && (
    role === 'Teacher' || role === 'Administrator' || 
    role === 'Director' || role === 'Accountant'
  );

  const form = useForm<z.infer<typeof createClassSchema>>({
    resolver: zodResolver(createClassSchema),
    defaultValues: { name: '', description: '', teacherId: '', capacity: 30 },
  });

  // Queries
  const classesQuery = useMemoFirebase(() => {
    if (!firestore || !user || !schoolId || !isStaff) return null;
    let q = query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
    if (role === 'Teacher') {
      q = query(q, where('teacherId', '==', user.uid));
    }
    return q;
  }, [firestore, user, role, schoolId, isStaff]);
  const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);
  
  const teachersQuery = useMemoFirebase(() => 
    (firestore && schoolId && isStaff)
      ? query(collection(firestore, 'staff'), where('role', '==', 'Teacher'), where('schoolId', '==', schoolId)) 
      : null, 
  [firestore, schoolId, isStaff]);
  const { data: teachers, isLoading: isLoadingTeachers } = useCollection(teachersQuery);

  const studentsQuery = useMemoFirebase(() => 
    (firestore && schoolId && isStaff)
      ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) 
      : null, 
  [firestore, schoolId, isStaff]);
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);

  const timetableQuery = useMemoFirebase(() => 
    (firestore && schoolId && isStaff)
      ? query(collection(firestore, 'timetables'), where('schoolId', '==', schoolId)) 
      : null, 
  [firestore, schoolId, isStaff]);
  const { data: timetable, isLoading: isLoadingTimetable } = useCollection<TimetableEntry>(timetableQuery);

  const subjectsQuery = useMemoFirebase(() => 
    (firestore && schoolId && isStaff)
      ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) 
      : null, 
  [firestore, schoolId, isStaff]);
  const { data: subjects, isLoading: isLoadingSubjects } = useCollection<Subject>(subjectsQuery);

  const onCreateSubmit = async (values: z.infer<typeof createClassSchema>) => {
    if (!firestore || !schoolId) return;
    setIsSubmitting(true);
    try {
        await addDoc(collection(firestore, 'classes'), {
            ...values,
            schoolId,
            createdAt: serverTimestamp(),
        });
        toast({ title: "Class Created", description: `"${values.name}" has been added.` });
        setCreateDialogOpen(false);
        form.reset();
    } catch (e) {
        toast({ variant: 'destructive', title: "Error", description: "Failed to create class." });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isRoleLoading && !isStaff) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>Only school staff can access the class management portal.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isLoading = isLoadingSchool || isRoleLoading || isLoadingClasses || isLoadingTeachers || isLoadingStudents || isLoadingTimetable || isLoadingSubjects;

  if (selectedClass) {
      return (
          <ClassDetailView 
            selectedClass={selectedClass} 
            onBack={() => setSelectedClass(null)} 
            students={students || []}
            timetable={timetable || []}
            subjects={subjects || []}
            teachers={teachers || []}
          />
      );
  }

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-indigo-600 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Class Management</CardTitle>
            <CardDescription>
              {role === 'Teacher' ? 'Showing classes assigned to you.' : 'View, create, and manage academic classes for your school.'}
            </CardDescription>
          </div>
          {canManageClasses && schoolId && (
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create a New Class</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to add a new class to the system.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onCreateSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Class Name</FormLabel><FormControl><Input placeholder="e.g. BS 3" {...field}/></FormControl><FormMessage/></FormItem>
                        )}/>
                        <FormField control={form.control} name="teacherId" render={({ field }) => (
                            <FormItem><FormLabel>Assign Teacher</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select teacher..."/></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {teachers?.map(t => <SelectItem key={t.uid} value={t.uid}>{t.firstName} {t.lastName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="capacity" render={({ field }) => (
                            <FormItem><FormLabel>Target Capacity</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>
                        )}/>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : "Create Class"}
                        </Button>
                    </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={`skeleton-${i}`}><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full mt-2" /></CardContent></Card>
              ))}
            </div>
          ) : classes && classes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((c) => (
                <Card 
                    key={c.id} 
                    className="cursor-pointer hover:border-indigo-500 hover:ring-2 hover:ring-indigo-100 transition-all h-full group"
                    onClick={() => setSelectedClass(c)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-xl font-bold text-slate-800">{c.name}</CardTitle>
                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1" />
                    </div>
                    <CardDescription className="line-clamp-1">{c.description || 'No description available.'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><Users className="h-4 w-4"/></div>
                        <span className="font-medium text-slate-700">{students?.filter(s => s.classId === c.id).length || 0} / {c.capacity || 0} Enrolled</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><User className="h-4 w-4"/></div>
                        <span className="font-medium text-slate-700">Teacher: {teachers?.find(t => t.uid === c.teacherId) ? `${teachers.find(t => t.uid === c.teacherId)?.firstName} ${teachers.find(t => t.uid === c.teacherId)?.lastName}` : 'Not Assigned'}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50/50 border-t py-3 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                      View Dashboard
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed">
              <p className="text-lg font-medium text-slate-600">No classes found.</p>
              {canManageClasses && <p className="text-sm text-slate-400">Click "Create Class" to add your first classroom.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}