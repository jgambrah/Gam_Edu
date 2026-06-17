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
import { Checkbox } from '@/components/ui/checkbox';
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
  caWeight: z.coerce.number().min(0).max(100).optional(),
  examWeight: z.coerce.number().min(0).max(100).optional(),
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
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2 pl-0 hover:bg-transparent hover:text-indigo-600 font-bold text-xs uppercase tracking-wider text-slate-500">
                    <ArrowLeft className="h-4 w-4" /> Back to Classes
                </Button>
            </div>

            {/* Premium Header Banner */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-750 via-indigo-600 to-teal-500 p-8 md:p-10 text-white shadow-2xl border border-indigo-400/20">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-teal-400/10 blur-2xl" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-100 backdrop-blur-md">
                            <GraduationCap className="h-3 w-3" /> Class Profile
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight italic uppercase leading-none">
                            {selectedClass.name}
                        </h1>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs font-bold text-indigo-100 uppercase">
                            <span className="flex items-center gap-1.5"><User className="h-3 w-3 text-teal-300" /> Form Tutor: {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned'}</span>
                            <span className="h-3 w-px bg-indigo-450/40"></span>
                            <span className="flex items-center gap-1.5"><Badge variant="outline" className="text-[10px] border-white/20 text-white font-black uppercase bg-white/5">{selectedClass.teachingModel || 'Subject Teacher'}</Badge></span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 shrink-0">
                        <Badge variant="outline" className="bg-white/10 text-white border-white/15 px-3 py-1.5 rounded-xl flex items-center gap-2 font-black text-xs">
                            <Users className="h-3.5 w-3.5 text-teal-300" /> {stats.total} / {selectedClass.capacity || 0} Capacity
                        </Badge>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-100 border-blue-400/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-xs">
                            <Mars className="h-3.5 w-3.5 text-blue-300" /> {stats.males} Boys
                        </Badge>
                        <Badge variant="outline" className="bg-pink-500/10 text-pink-100 border-pink-400/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-xs">
                            <Venus className="h-3.5 w-3.5 text-pink-300" /> {stats.females} Girls
                        </Badge>
                    </div>
                </div>
            </div>

            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardContent className="p-0">
                    <Tabs defaultValue="roster" className="w-full">
                        <div className="px-8 bg-slate-900 border-b border-slate-800">
                            <TabsList className="bg-transparent h-14 p-0 gap-8">
                                <TabsTrigger value="roster" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-white text-slate-400 rounded-none shadow-none bg-transparent font-bold h-full">
                                    <Users className="h-4 w-4 mr-2 text-indigo-400" /> Student Roster
                                </TabsTrigger>
                                <TabsTrigger value="attendance" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-white text-slate-400 rounded-none shadow-none bg-transparent font-bold h-full">
                                    <CalendarCheck className="h-4 w-4 mr-2 text-indigo-400" /> Daily Attendance
                                </TabsTrigger>
                                <TabsTrigger value="timetable" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-white text-slate-400 rounded-none shadow-none bg-transparent font-bold h-full">
                                    <Clock className="h-4 w-4 mr-2 text-indigo-400" /> Timetable
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="roster" className="p-8 m-0 bg-slate-50/20">
                            <div className="rounded-[2rem] border bg-white overflow-hidden shadow-sm">
                                <Table>
                                    <TableHeader className="bg-slate-50/50 border-b">
                                        <TableRow>
                                            <TableHead className="pl-8 font-black text-[10px] uppercase text-slate-400 tracking-wider">Student</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase text-slate-400 tracking-wider">Gender</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase text-slate-400 tracking-wider">Email</TableHead>
                                            <TableHead className="pr-8 text-right font-black text-[10px] uppercase text-slate-400 tracking-wider">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {classStudents.map(student => (
                                            <TableRow key={student.uid} className="hover:bg-indigo-50/10 transition-colors">
                                                <TableCell className="pl-8 py-4"><StudentDisplay student={student} variant="list" showAvatar /></TableCell>
                                                <TableCell className="py-4">
                                                    <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full", student.gender === 'Male' ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-pink-50 text-pink-700 border-pink-200")}>
                                                        {student.gender || 'N/A'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-500 font-semibold text-sm py-4">{student.email || 'N/A'}</TableCell>
                                                <TableCell className="pr-8 text-right py-4">
                                                    <Button variant="outline" size="sm" className="h-8 rounded-xl border-slate-200 font-bold text-xs uppercase text-slate-600" asChild>
                                                        <a href={`/dashboard/students-v3?search=${student.firstName}`}>View Profile</a>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {classStudents.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-16 text-slate-400 font-bold uppercase text-xs tracking-wider">No active students assigned to this class.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="attendance" className="p-8 m-0 bg-slate-50/20">
                            <DailyAttendanceSheet classId={selectedClass.id} />
                        </TabsContent>

                        <TabsContent value="timetable" className="p-8 m-0 bg-slate-50/20">
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
  const [hasCustomWeights, setHasCustomWeights] = useState(false);

  const canManageClasses = role === 'Director' || role === 'Administrator' || role === 'Secretary';
  const canListStaff = ['Administrator', 'Director', 'Accountant', 'Secretary', 'Receptionist'].includes(role || '');
  const isStaff = !isRoleLoading && (
    role === 'Teacher' || role === 'Administrator' || 
    role === 'Director' || role === 'Accountant' ||
    role === 'Secretary' || role === 'Receptionist'
  );

  const form = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    defaultValues: { name: '', description: '', teacherId: '', capacity: 30, teachingModel: 'SubjectTeacher', homeRoomId: '', caWeight: undefined, examWeight: undefined },
  });

  // Handle Edit Click
  const handleEditClick = (e: React.MouseEvent, c: Class) => {
      e.stopPropagation(); // Don't open detail view
      setEditingClass(c);
      const isCustom = c.caWeight !== undefined && c.caWeight !== null;
      setHasCustomWeights(isCustom);
      form.reset({
          name: c.name,
          description: c.description || '',
          teacherId: c.teacherId || '',
          capacity: c.capacity || 30,
          homeRoomId: c.homeRoomId || '',
          teachingModel: c.teachingModel || 'SubjectTeacher',
          caWeight: c.caWeight ?? undefined,
          examWeight: c.examWeight ?? undefined,
      });
      setIsDialogOpen(true);
  };

  // Handle Create Click
  const handleCreateClick = () => {
      setEditingClass(null);
      setHasCustomWeights(false);
      form.reset({ name: '', description: '', teacherId: '', capacity: 30, teachingModel: 'SubjectTeacher', homeRoomId: '', caWeight: undefined, examWeight: undefined });
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
            caWeight: hasCustomWeights && values.caWeight !== undefined ? values.caWeight : null,
            examWeight: hasCustomWeights && values.examWeight !== undefined ? values.examWeight : null,
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
    <div className="space-y-8">
      {/* Premium Gradient Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-755 via-indigo-600 to-teal-500 p-8 md:p-12 text-white shadow-2xl border border-indigo-400/20">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-teal-400/10 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-100 backdrop-blur-md">
              <GraduationCap className="h-3 w-3" /> Academic Infrastructure
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight italic uppercase leading-none">
              Class <span className="text-teal-200">Management</span>
            </h1>
            <p className="max-w-md text-sm font-medium text-indigo-50">
              {role === 'Teacher' ? 'Showing classes assigned to you.' : 'View, create, and manage academic classes for your school.'}
            </p>
          </div>
          
          {canManageClasses && schoolId && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-black uppercase tracking-wider shadow-lg transition-all hover:scale-102 active:scale-98 border-none" onClick={handleCreateClick}>
                  <PlusCircle className="mr-2 h-4 w-4 text-indigo-600" /> Create Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-slate-900 border-2">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black uppercase italic text-slate-800">{editingClass ? 'Edit Class' : 'Create Class'}</DialogTitle>
                  <DialogDescription className="text-xs font-bold text-slate-400 uppercase mt-0.5">
                    Configure details for the class cohort.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem className="space-y-1.5"><FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Class Name</FormLabel><FormControl><Input placeholder="e.g. BS 3" {...field} className="h-12 border-2 rounded-xl bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500 font-medium transition-colors" /></FormControl><FormMessage/></FormItem>
                        )}/>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="teachingModel" render={({ field }) => (
                                <FormItem className="space-y-1.5"><FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Teaching Model</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger className="h-12 border-2 rounded-xl bg-slate-50"><SelectValue placeholder="Model"/></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="ClassTeacher">Class Teacher (Nursery-BS3)</SelectItem>
                                            <SelectItem value="SubjectTeacher">Subject Teacher (BS4+)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="homeRoomId" render={({ field }) => (
                                <FormItem className="space-y-1.5"><FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Primary Room</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger className="h-12 border-2 rounded-xl bg-slate-50"><SelectValue placeholder="Select Room..."/></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {rooms?.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}/>
                        </div>

                        <FormField control={form.control} name="teacherId" render={({ field }) => (
                            <FormItem className="space-y-1.5"><FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Primary Teacher (Form Tutor)</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger className="h-12 border-2 rounded-xl bg-slate-50"><SelectValue placeholder="Select teacher..."/></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="unassigned">None (Unassigned)</SelectItem>
                                        {teachers?.map(t => <SelectItem key={t.uid} value={t.uid}>{t.firstName} {t.lastName}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="capacity" render={({ field }) => (
                            <FormItem className="space-y-1.5"><FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Target Capacity</FormLabel><FormControl><Input type="number" {...field} className="h-12 border-2 rounded-xl bg-slate-50 focus:ring-indigo-500 focus:border-indigo-500 font-bold transition-colors" /></FormControl><FormMessage/></FormItem>
                        )}/>

                        <div className="flex items-center space-x-2 py-2">
                            <Checkbox 
                                id="custom-weights-toggle"
                                checked={hasCustomWeights} 
                                onCheckedChange={(checked) => {
                                    const isChecked = !!checked;
                                    setHasCustomWeights(isChecked);
                                    if (isChecked) {
                                        form.setValue('caWeight', 30);
                                        form.setValue('examWeight', 70);
                                    } else {
                                        form.setValue('caWeight', undefined);
                                        form.setValue('examWeight', undefined);
                                    }
                                }}
                                className="h-5 w-5 rounded-md border-2"
                            />
                            <label htmlFor="custom-weights-toggle" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
                                Override School Assessment Weights
                            </label>
                        </div>

                        {hasCustomWeights && (
                            <div className="grid grid-cols-2 gap-4 border-2 p-4 rounded-2xl bg-slate-50 animate-in fade-in duration-200">
                                <FormField control={form.control} name="caWeight" render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">CA Weight (%)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                min={0} 
                                                max={100} 
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                                    form.setValue('caWeight', val);
                                                    form.setValue('examWeight', 100 - val);
                                                }}
                                                className="h-11 border-2 rounded-xl bg-white font-bold text-center"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="examWeight" render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Exam Weight (%)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                min={0} 
                                                max={100} 
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                                    form.setValue('examWeight', val);
                                                    form.setValue('caWeight', 100 - val);
                                                }}
                                                className="h-11 border-2 rounded-xl bg-white font-bold text-center"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                            </div>
                        )}

                        <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg shadow-indigo-100 transition-all duration-200" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : (editingClass ? "Save Changes" : "Create Class")}
                        </Button>
                    </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
        <CardHeader className="bg-slate-900 text-white pb-6 pt-8 px-8">
          <CardTitle className="text-xl font-black uppercase tracking-tight">School Classes</CardTitle>
          <CardDescription className="text-xs font-bold text-slate-400 uppercase mt-0.5">
            Active school classrooms and capacity registers
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 bg-slate-50/20">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={`skeleton-${i}`} className="rounded-3xl border-none shadow-md p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </Card>
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
                      className="cursor-pointer border-none shadow-xl bg-white rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                      onClick={() => setSelectedClassId(c.id)}
                  >
                    <div>
                      <CardHeader className="relative pb-4 pt-6 px-6">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-xl font-black text-slate-800 uppercase tracking-tight leading-tight">{c.name}</CardTitle>
                            <div className="flex items-center gap-1 relative z-10">
                                {canManageClasses && (
                                    <>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-650 hover:bg-indigo-50/50 rounded-lg" onClick={(e) => handleEditClick(e, c)}>
                                          <Edit className="h-4 w-4"/>
                                      </Button>
                                      
                                      <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-650 hover:bg-red-50/50 rounded-lg" onClick={(e) => e.stopPropagation()}>
                                                  <Trash2 className="h-4 w-4"/>
                                              </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent className="rounded-[2.5rem] border-2 border-slate-900">
                                              <AlertDialogHeader>
                                                  <AlertDialogTitle className="text-lg font-black uppercase italic text-slate-800">Delete Class: {c.name}?</AlertDialogTitle>
                                                  <AlertDialogDescription className="text-xs font-bold text-slate-400 uppercase mt-0.5">
                                                      Are you sure you want to permanently delete this class? This will not delete students but they will lose their class assignment.
                                                  </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                  <AlertDialogCancel className="rounded-xl font-bold uppercase text-xs tracking-wider">Cancel</AlertDialogCancel>
                                                  <AlertDialogAction onClick={() => handleDeleteClass(c.id)} className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase text-xs tracking-wider">Delete Class</AlertDialogAction>
                                              </AlertDialogFooter>
                                          </AlertDialogContent>
                                      </AlertDialog>
                                    </>
                                )}
                                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-550 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <Badge variant="outline" className="text-[9px] uppercase font-black tracking-wide text-slate-450 bg-slate-50 border-slate-200">
                              {c.teachingModel === 'ClassTeacher' ? 'Class Teacher' : 'Subject Teacher'}
                          </Badge>
                          {(c.caWeight !== undefined && c.caWeight !== null && c.examWeight !== undefined && c.examWeight !== null) && (
                            <Badge className="text-[9px] font-black tracking-wide bg-indigo-50 text-indigo-700 border-indigo-100 uppercase">
                                {c.caWeight}/{c.examWeight} Split
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm text-slate-500 px-6 pb-6">
                        {/* Roster capacity progress bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
                            <span>Capacity</span>
                            <span className="font-black text-slate-800">{classStudents.length} / {c.capacity || 30}</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-650 transition-all"
                              style={{ width: `${Math.min(100, (classStudents.length / (c.capacity || 30)) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2.5 pt-1">
                          <div className="flex items-center gap-2.5">
                              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 shrink-0"><User className="h-4 w-4"/></div>
                              <span className="font-bold text-slate-700 text-xs">Tutor: <span className="font-semibold text-slate-500">{classTeacher ? `${classTeacher.firstName} ${classTeacher.lastName}` : 'Not Assigned'}</span></span>
                          </div>
                          <div className="flex items-center gap-2.5">
                              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 shrink-0"><Home className="h-4 w-4"/></div>
                              <span className="font-bold text-slate-700 text-xs">Room: <span className="font-semibold text-slate-500">{rooms?.find(r => r.id === c.homeRoomId)?.name || 'Not Set'}</span></span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                    <CardFooter className="bg-slate-50 border-t py-3.5 px-6 text-[10px] font-black text-indigo-650 uppercase tracking-wider transition-colors group-hover:bg-indigo-50/20">
                        View Class Workspace
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-4 border-dashed">
              <p className="text-sm font-bold text-slate-450 uppercase tracking-widest">No classes found.</p>
              {canManageClasses && <p className="text-xs font-semibold text-slate-400 mt-1 uppercase">Click "Create Class" to add your first classroom.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
