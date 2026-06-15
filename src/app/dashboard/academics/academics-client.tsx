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
import { collection, doc, query, where, updateDoc, deleteDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Loader2, PlusCircle, User, Users, BookOpen, UserCircle, Trash2, ArrowLeft, CalendarCheck, Clock, ShieldCheck, ChevronRight, Edit, Baby, Venus, Mars, Home, GraduationCap } from 'lucide-react';
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
import { Subject, TimetableEntry, Student, Class, Room } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TimetableDisplay } from '../timetable/timetable-display';
import { StudentDisplay } from '@/components/student-display';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  description: z.string().optional(),
  teacherId: z.string().optional(),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  homeRoomId: z.string().optional(),
  teachingModel: z.enum(['ClassTeacher', 'SubjectTeacher']).default('SubjectTeacher'),
});

function ClassDetailView({ 
    selectedClass, 
    onBack, 
    students, 
    timetable, 
    subjects, 
    teachers,
    currentUserProfile 
}: { 
    selectedClass: Class, 
    onBack: () => void, 
    students: Student[], 
    timetable: TimetableEntry[], 
    subjects: Subject[], 
    teachers: any[],
    currentUserProfile: any
}) {
    // Filter for ACTIVE students in memory to handle legacy records with undefined status
    const classStudents = useMemo(() => {
        return students.filter(s => 
            s.classId === selectedClass.id && 
            (s.enrollmentStatus === 'Active' || !s.enrollmentStatus)
        );
    }, [students, selectedClass.id]);

    const classTimetable = useMemo(() => timetable.filter(t => t.classId === selectedClass.id), [timetable, selectedClass.id]);
    
    // Gender Statistics
    const stats = useMemo(() => {
        const males = classStudents.filter(s => s.gender === 'Male').length;
        const females = classStudents.filter(s => s.gender === 'Female').length;
        return { males, females, total: classStudents.length };
    }, [classStudents]);

    // Resolve teacher name (check list or current profile)
    const teacher = useMemo(() => {
        const found = teachers?.find(t => t.uid === selectedClass.teacherId);
        if (found) return found;
        if (currentUserProfile && selectedClass.teacherId === currentUserProfile.uid) {
            return currentUserProfile;
        }
        return null;
    }, [teachers, selectedClass.teacherId, currentUserProfile]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2 pl-0 hover:bg-transparent hover:text-indigo-600">
                    <ArrowLeft className="h-4 w-4" /> Back to Classes
                </Button>
                <div className="flex gap-2">
                    <Badge variant="outline" className="bg-white px-3 py-1 border-2 flex items-center gap-2">
                        <Users className="h-3 w-3" /> {stats.total} / {selectedClass.capacity || 0}
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1">
                        <Mars className="h-3 w-3" /> {stats.males} Boys
                    </Badge>
                    <Badge variant="secondary" className="bg-pink-50 text-pink-700 border-pink-100 flex items-center gap-1">
                        <Venus className="h-3 w-3" /> {stats.females} Girls
                    </Badge>
                </div>
            </div>

            <Card className="border-t-4 border-t-indigo-600 shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight">{selectedClass.name}</CardTitle>
                            <div className="flex flex-wrap gap-4 mt-2">
                                <CardDescription className="flex items-center gap-2">
                                    <User className="h-3 w-3" /> Form Teacher: {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned'}
                                </CardDescription>
                                <CardDescription className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[10px] font-black uppercase">{selectedClass.teachingModel || 'Subject Teacher'}</Badge>
                                </CardDescription>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 border-t">
                    <Tabs defaultValue="roster" className="w-full">
                        <div className="px-6 bg-slate-50/50 border-b">
                            <TabsList className="bg-transparent h-12 p-0 gap-6">
                                <TabsTrigger value="roster" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none shadow-none bg-transparent font-bold">
                                    <Users className="h-4 w-4 mr-2" /> Student Roster
                                </TabsTrigger>
                                <TabsTrigger value="attendance" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none shadow-none bg-transparent font-bold">
                                    <CalendarCheck className="h-4 w-4 mr-2" /> Daily Attendance
                                </TabsTrigger>
                                <TabsTrigger value="timetable" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none shadow-none bg-transparent font-bold">
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
                                            <TableHead>Gender</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {classStudents.map(student => (
                                            <TableRow key={student.uid}>
                                                <TableCell><StudentDisplay student={student} variant="list" showAvatar /></TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn("text-[10px] font-bold uppercase", student.gender === 'Male' ? "text-blue-600" : "text-pink-600")}>
                                                        {student.gender || 'N/A'}
                                                    </Badge>
                                                </TableCell>
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
                                                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">No active students assigned to this class.</TableCell>
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
                                teachers={teachers && teachers.length > 0 ? teachers : (teacher ? [teacher] : [])}
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
  const { role, profile, loading: isRoleLoading } = useRole();
  const firestore = useFirestore();
  const { user } = useUser();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
  const { toast } = useToast();
  
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManageClasses = role === 'Director' || role === 'Administrator' || role === 'Secretary';
  const canListStaff = ['Administrator', 'Director', 'Accountant', 'Secretary', 'Receptionist'].includes(role || '');
  const isStaff = !isRoleLoading && (
    role === 'Teacher' || role === 'Administrator' || 
    role === 'Director' || role === 'Accountant' ||
    role === 'Secretary' || role === 'Receptionist'
  );

  const form = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    defaultValues: { name: '', description: '', teacherId: '', capacity: 30, teachingModel: 'SubjectTeacher', homeRoomId: '' },
  });

  // Handle Edit Click
  const handleEditClick = (e: React.MouseEvent, c: Class) => {
      e.stopPropagation(); // Don't open detail view
      setEditingClass(c);
      form.reset({
          name: c.name,
          description: c.description || '',
          teacherId: c.teacherId || '',
          capacity: c.capacity || 30,
          homeRoomId: c.homeRoomId || '',
          teachingModel: c.teachingModel || 'SubjectTeacher'
      });
      setIsDialogOpen(true);
  };

  // Handle Create Click
  const handleCreateClick = () => {
      setEditingClass(null);
      form.reset({ name: '', description: '', teacherId: '', capacity: 30, teachingModel: 'SubjectTeacher', homeRoomId: '' });
      setIsDialogOpen(true);
  };

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
  
  // Guard teachers query to prevent permission errors
  const teachersQuery = useMemoFirebase(() => 
    (firestore && schoolId && canListStaff)
      ? query(collection(firestore, 'staff'), where('role', '==', 'Teacher'), where('schoolId', '==', schoolId)) 
      : null, 
  [firestore, schoolId, canListStaff]);
  const { data: teachers, isLoading: isLoadingTeachers } = useCollection(teachersQuery);

  const roomsQuery = useMemoFirebase(() => 
    (firestore && schoolId) ? query(collection(firestore, 'rooms'), where('schoolId', '==', schoolId)) : null,
  [firestore, schoolId]);
  const { data: rooms } = useCollection<Room>(roomsQuery);

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

  const onSubmit = async (values: z.infer<typeof classSchema>) => {
    if (!firestore || !schoolId) return;
    setIsSubmitting(true);
    try {
        // Normalize undefined fields to null for Firestore
        const normalizedValues = {
            name: values.name,
            description: values.description || null,
            teacherId: values.teacherId === 'unassigned' ? null : (values.teacherId || null),
            capacity: values.capacity,
            homeRoomId: values.homeRoomId || null,
            teachingModel: values.teachingModel,
        };

        if (editingClass) {
            updateDocumentNonBlocking(doc(firestore, 'classes', editingClass.id), {
                ...normalizedValues,
                updatedAt: serverTimestamp(),
            });
            toast({ title: "Class Updated", description: `"${values.name}" has been modified.` });
        } else {
            await addDoc(collection(firestore, 'classes'), {
                ...normalizedValues,
                schoolId,
                createdAt: serverTimestamp(),
            });
            toast({ title: "Class Created", description: `"${values.name}" has been added.` });
        }
        setIsDialogOpen(false);
        form.reset();
    } catch (e) {
        toast({ variant: 'destructive', title: "Error", description: "Failed to save class." });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async (id: string) => {
      try {
          await deleteDoc(doc(firestore!, 'classes', id));
          toast({ title: "Class Deleted" });
      } catch (e) {
          toast({ variant: "destructive", title: "Delete Failed" });
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

  const isLoading = isLoadingSchool || isRoleLoading || isLoadingClasses || (canListStaff && isLoadingTeachers) || isLoadingStudents || isLoadingTimetable || isLoadingSubjects;

  const selectedClass = useMemo(() => {
      return classes?.find(c => c.id === selectedClassId) || null;
  }, [classes, selectedClassId]);

  if (selectedClass) {
      return (
          <ClassDetailView 
            selectedClass={selectedClass} 
            onBack={() => setSelectedClassId(null)} 
            students={students || []}
            timetable={timetable || []}
            subjects={subjects || []}
            teachers={teachers || []}
            currentUserProfile={profile}
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleCreateClick}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingClass ? 'Edit Class' : 'Create a New Class'}</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to {editingClass ? 'modify the' : 'add a new'} class.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Class Name</FormLabel><FormControl><Input placeholder="e.g. BS 3" {...field}/></FormControl><FormMessage/></FormItem>
                        )}/>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="teachingModel" render={({ field }) => (
                                <FormItem><FormLabel>Teaching Model</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Model"/></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="ClassTeacher">Class Teacher (Nursery-BS3)</SelectItem>
                                            <SelectItem value="SubjectTeacher">Subject Teacher (BS4+)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="homeRoomId" render={({ field }) => (
                                <FormItem><FormLabel>Primary Room</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select Room..."/></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {rooms?.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}/>
                        </div>

                        <FormField control={form.control} name="teacherId" render={({ field }) => (
                            <FormItem><FormLabel>Primary Teacher (Form Tutor)</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select teacher..."/></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="unassigned">None (Unassigned)</SelectItem>
                                        {teachers?.map(t => <SelectItem key={t.uid} value={t.uid}>{t.firstName} {t.lastName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="capacity" render={({ field }) => (
                            <FormItem><FormLabel>Target Capacity</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>
                        )}/>
                        <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : (editingClass ? "Save Changes" : "Create Class")}
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
              {classes.map((c) => {
                const classTeacher = teachers?.find(t => t.uid === c.teacherId) || 
                                   (profile && c.teacherId === profile.uid ? profile : null);
                
                const classStudents = students?.filter(s => 
                    s.classId === c.id && 
                    (s.enrollmentStatus === 'Active' || !s.enrollmentStatus)
                ) || [];

                return (
                  <Card 
                      key={c.id} 
                      className="cursor-pointer hover:border-indigo-500 hover:ring-2 hover:ring-indigo-100 transition-all h-full group"
                      onClick={() => setSelectedClassId(c.id)}
                  >
                    <CardHeader className="relative">
                      <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-bold text-slate-800">{c.name}</CardTitle>
                          <div className="flex items-center gap-1">
                              {canManageClasses && (
                                  <>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={(e) => handleEditClick(e, c)}>
                                        <Edit className="h-4 w-4"/>
                                    </Button>
                                    
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={(e) => e.stopPropagation()}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Class: {c.name}?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to permanently delete this class? This will not delete students but they will lose their class assignment.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteClass(c.id)} className="bg-red-600 hover:bg-red-700">Delete Class</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                              )}
                              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transition-transform group-hover:translate-x-1" />
                          </div>
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-[9px] uppercase font-bold text-slate-400">
                            {c.teachingModel === 'ClassTeacher' ? 'Class Teacher Model' : 'Subject Teacher Model'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600"><Users className="h-4 w-4"/></div>
                          <span className="font-medium text-slate-700">{classStudents.length} / {c.capacity || 0} Enrolled</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><User className="h-4 w-4"/></div>
                          <span className="font-medium text-slate-700">Teacher: {classTeacher ? `${classTeacher.firstName} ${classTeacher.lastName}` : 'Not Assigned'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Home className="h-4 w-4"/></div>
                          <span className="font-medium text-slate-700">Homeroom: {rooms?.find(r => r.id === c.homeRoomId)?.name || 'Not Set'}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 border-t py-3 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                        View Dashboard
                    </CardFooter>
                  </Card>
                );
              })}
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
