'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, query, where, addDoc, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, BookCopy, Edit, Trash2, RefreshCw, UserCheck, BookOpen, Save, Layers, Microscope, Sparkles, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Class, Subject } from '@/lib/types';

// --- TYPES ---
type Staff = {
    uid: string;
    id: string; 
    firstName: string;
    lastName: string;
    role: string;
};

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required.'),
  teacherIds: z.array(z.string()).default([]),
  weeklyPeriods: z.coerce.number().min(1, "Weekly periods must be at least 1"),
  requiresLab: z.boolean().default(false),
  targetClasses: z.array(z.string()).default([]),
});

// --- FORM COMPONENT ---
function SubjectForm({
  setOpen,
  allTeachers,
  classes,
  initialData,
  onSuccess,
  schoolId
}: {
  setOpen: (open: boolean) => void;
  allTeachers: Staff[];
  classes: Class[];
  initialData?: Subject;
  onSuccess: () => void;
  schoolId: string;
}) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Explicitly define default fields
  const form = useForm<z.infer<typeof subjectSchema>>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: initialData?.name || '',
      teacherIds: initialData?.teacherIds || [],
      weeklyPeriods: initialData?.weeklyPeriods ?? 3,
      requiresLab: initialData?.requiresLab ?? false,
      targetClasses: initialData?.targetClasses || [],
    },
  });

  async function onSubmit(values: z.infer<typeof subjectSchema>) {
    if (!firestore || !schoolId) return;
    setIsSubmitting(true);
    try {
      if (initialData) {
        const subjectRef = doc(firestore, 'subjects', initialData.id);
        await updateDoc(subjectRef, values);
        toast({ title: 'Success', description: 'Subject updated successfully.' });
      } else {
        await addDoc(collection(firestore, 'subjects'), {
            ...values,
            schoolId: schoolId,
            createdAt: serverTimestamp()
        });
        toast({ title: 'Success', description: 'New subject has been created.' });
      }
      onSuccess(); 
      setOpen(false);
    } catch (error: any) {
      console.error('Error saving subject:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Could not save subject.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Chemistry" {...field} className="bg-white border-slate-200 rounded-xl h-11 focus-visible:ring-indigo-500" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="weeklyPeriods"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-400">Periods per Week</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="bg-white border-slate-200 rounded-xl h-11 focus-visible:ring-indigo-500" />
                </FormControl>
                <FormDescription className="text-[10px] text-slate-400">Standard is 3-5 periods.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
            control={form.control}
            name="requiresLab"
            render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-slate-200 p-4 bg-slate-50/50 shadow-sm">
                <div className="space-y-0.5">
                    <FormLabel className="text-sm font-extrabold text-slate-800">Requires Specialized Lab Space?</FormLabel>
                    <FormDescription className="text-[11px] text-slate-400">Flags this course for science, ICT, or technical labs instead of general homerooms.</FormDescription>
                </div>
                <FormControl>
                    <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-teal-600"
                    />
                </FormControl>
            </FormItem>
            )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="teacherIds"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <div className="mb-2">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-400">Qualified Teachers</FormLabel>
                    <FormDescription className="text-[10px] text-slate-400">Select instructors authorized to teach this subject.</FormDescription>
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 bg-slate-50/50 rounded-2xl">
                    {allTeachers.map((teacher) => {
                        const isChecked = field.value?.includes(teacher.uid);
                        return (
                            <div 
                                key={teacher.uid}
                                onClick={() => {
                                    if (isChecked) {
                                        field.onChange(field.value.filter((v: string) => v !== teacher.uid));
                                    } else {
                                        field.onChange([...(field.value || []), teacher.uid]);
                                    }
                                }}
                                className={cn(
                                    "flex items-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer select-none transition-all duration-200 shadow-sm",
                                    isChecked 
                                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/10" 
                                        : "bg-white border-slate-200/60 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                                )}
                            >
                                <Checkbox checked={isChecked} className="sr-only" />
                                <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-[8px] uppercase shrink-0">
                                    {teacher.firstName[0]}{teacher.lastName[0]}
                                </div>
                                <span className="text-[11px] font-bold truncate">{teacher.firstName} {teacher.lastName}</span>
                            </div>
                        );
                    })}
                    {allTeachers.length === 0 && (
                        <div className="text-center py-8 text-slate-400 text-xs font-semibold uppercase">No teachers registered yet</div>
                    )}
                </div>
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="targetClasses"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <div className="mb-2">
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-400">Applicable Classes</FormLabel>
                    <FormDescription className="text-[10px] text-slate-400">Select classes that will study this subject.</FormDescription>
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 bg-slate-50/50 rounded-2xl">
                    {classes.map((cls) => {
                        const isChecked = field.value?.includes(cls.id);
                        return (
                            <div 
                                key={cls.id}
                                onClick={() => {
                                    if (isChecked) {
                                        field.onChange(field.value.filter((v: string) => v !== cls.id));
                                    } else {
                                        field.onChange([...(field.value || []), cls.id]);
                                    }
                                }}
                                className={cn(
                                    "flex items-center gap-2 p-2.5 rounded-xl border-2 cursor-pointer select-none transition-all duration-200 shadow-sm",
                                    isChecked 
                                        ? "bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-500/10" 
                                        : "bg-white border-slate-200/60 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                                )}
                            >
                                <Checkbox checked={isChecked} className="sr-only" />
                                <span className="text-[11px] font-bold truncate">{cls.name}</span>
                            </div>
                        );
                    })}
                    {classes.length === 0 && (
                        <div className="text-center py-8 text-slate-400 text-xs font-semibold uppercase">No classes registered yet</div>
                    )}
                </div>
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-bold bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-[0.98]">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4"/>}
          {initialData ? 'Save Subject Changes' : 'Register Subject'}
        </Button>
      </form>
    </Form>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function SubjectsPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
  const [refetchKey, setRefetchKey] = useState(0);

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined);
  
  const canManage = role === 'Director' || role === 'Administrator';

  const forceRefetch = useCallback(() => setRefetchKey(prev => prev + 1), []);

  const subjectsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    return query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId));
  }, [firestore, refetchKey, schoolId]);
  const { data: subjects, isLoading: isLoadingSubjects } = useCollection<Subject>(subjectsQuery);

  const teachersQuery = useMemoFirebase(() => {
    if (!firestore || !canManage || !schoolId) return null;
    return query(collection(firestore, 'staff'), where('role', '==', 'Teacher'), where('schoolId', '==', schoolId));
  }, [firestore, canManage, refetchKey, schoolId]);
  const { data: teachers, isLoading: isLoadingTeachers } = useCollection<Staff>(teachersQuery);

  const classesQuery = useMemoFirebase(() => 
    (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, 
    [firestore, schoolId]
  );
  const { data: classes } = useCollection<Class>(classesQuery);

  const isLoading = isLoadingSchool || isLoadingSubjects || (canManage && isLoadingTeachers);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject? It will affect all existing timetable assignments.")) {
      return;
    }
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'subjects', id));
      toast({ title: 'Subject Deleted', description: 'The subject has been successfully removed from curriculum.' });
      forceRefetch();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleOpenDialog = (subject?: Subject) => {
    setEditingSubject(subject);
    setFormOpen(true);
  };
  
  const handleCloseDialog = () => {
    setFormOpen(false);
    setEditingSubject(undefined);
  };
  
  const sortedSubjects = useMemo(() => {
    if (!subjects) return [];
    return [...subjects].sort((a,b) => a.name.localeCompare(b.name));
  }, [subjects]);

  const totalSubjects = subjects?.length || 0;
  const totalPeriods = subjects?.reduce((acc, s) => acc + (s.weeklyPeriods || 0), 0) || 0;
  const labSubjectsCount = subjects?.filter(s => s.requiresLab).length || 0;
  const unassignedCount = subjects?.filter(s => !s.teacherIds || s.teacherIds.length === 0).length || 0;

  const getSubjectIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('math') || n.includes('arith') || n.includes('calc')) return <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />;
    if (n.includes('science') || n.includes('bio') || n.includes('chem') || n.includes('phys') || n.includes('lab') || n.includes('scie')) return <Microscope className="h-5 w-5 text-emerald-500" />;
    if (n.includes('eng') || n.includes('read') || n.includes('lit') || n.includes('lang') || n.includes('write') || n.includes('french') || n.includes('hist')) return <BookOpen className="h-5 w-5 text-indigo-500" />;
    if (n.includes('ict') || n.includes('comp') || n.includes('tech') || n.includes('code')) return <Layers className="h-5 w-5 text-sky-500" />;
    return <BookCopy className="h-5 w-5 text-purple-500" />;
  };

  if (!canManage && !isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh] p-6">
        <Card className="max-w-md w-full border-2 border-red-100 bg-red-50/20 text-center rounded-2xl p-6 shadow-sm">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <CardTitle className="text-red-700 font-extrabold text-lg">Access Denied</CardTitle>
          <CardDescription className="text-red-600/80 font-medium text-xs mt-1">Only curriculum administrators are authorized to manage subjects.</CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      
      {/* Premium Header Gradient Banner */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-700 via-purple-600 to-fuchsia-600 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 text-indigo-200 shrink-0">
                <BookOpen className="h-6 w-6 text-white" />
              </span>
              <Badge className="bg-white/15 text-white font-extrabold uppercase text-[10px] border-none px-2.5 py-0.5 rounded-full tracking-widest">
                Academic Curriculum
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase italic">Curriculum Subject Catalog</h1>
            <p className="text-slate-200 text-sm font-medium mt-1 max-w-xl">
              Register courses, allocate weekly instructional periods, and assign qualified educators for AI-driven timetable scheduling.
            </p>
          </div>
          
          <div className="flex gap-3 shrink-0 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={forceRefetch} 
              className="bg-white/10 hover:bg-white/20 text-white border-white/10 rounded-2xl font-bold h-12 px-5 backdrop-blur-md transition-all duration-200 w-full md:w-auto"
            >
               <RefreshCw className={cn("h-4 w-4 mr-2 text-white", isLoading && "animate-spin")}/> Sync Database
            </Button>
            {canManage && (
              <Button 
                onClick={() => handleOpenDialog()} 
                disabled={isLoading || !schoolId} 
                className="bg-white hover:bg-slate-50 text-indigo-950 hover:text-indigo-900 h-12 px-6 rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98] w-full md:w-auto"
              >
                  <PlusCircle className="mr-2 h-4 w-4 text-indigo-700" /> Register Subject
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Courses</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><BookCopy className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800 font-mono leading-none">{totalSubjects}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Registered subject codes</p>
          </div>
        </Card>

        <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Weekly Periods</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Layers className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800 font-mono leading-none">{totalPeriods}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Instructional hours weekly</p>
          </div>
        </Card>

        <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Lab Required</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Microscope className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800 font-mono leading-none">{labSubjectsCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Requiring special facilities</p>
          </div>
        </Card>

        <Card className={cn(
          "border transition-all duration-300 rounded-2xl p-5 hover:shadow-md backdrop-blur-sm shadow-sm",
          unassignedCount > 0 
            ? "border-rose-100 bg-rose-50/20 text-rose-700" 
            : "border-slate-100 bg-white/70 text-slate-700"
        )}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-extrabold">Unassigned Courses</span>
            <div className={cn(
              "p-2 rounded-xl",
              unassignedCount > 0 ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-600"
            )}><UserCheck className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className={cn("text-2xl font-black font-mono leading-none", unassignedCount > 0 ? "text-rose-600 animate-pulse" : "text-slate-800")}>{unassignedCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Subjects without teachers</p>
          </div>
        </Card>
      </div>

      {/* Main Grid View */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600"/>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">Loading Academic Curriculum...</p>
        </div>
      ) : sortedSubjects.length === 0 ? (
         <Card className="border border-dashed border-slate-200 bg-white/70 backdrop-blur-sm rounded-[2rem] p-16 text-center">
             <BookCopy className="h-16 w-16 mx-auto mb-4 text-slate-350 stroke-[1.2]" />
             <h3 className="font-black text-lg text-slate-700 uppercase">Catalog is Empty</h3>
             <p className="text-xs text-slate-455 mt-1.5">No subjects registered yet. Create one to design your curriculum plan.</p>
         </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSubjects.map((subject) => {
            const hasNoTeacher = !subject.teacherIds || subject.teacherIds.length === 0;
            const targetClasses = subject.targetClasses || [];
            const teacherIds = subject.teacherIds || [];
            return (
              <Card 
                key={subject.id} 
                className={cn(
                  "border bg-white/90 backdrop-blur-sm shadow-sm overflow-hidden rounded-2xl flex flex-col group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300/80",
                  hasNoTeacher ? "border-amber-200 bg-amber-50/5" : "border-slate-100"
                )}
              >
                <div className="p-6 flex-1 flex flex-col">
                  
                  {/* Top Header Row */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200/50 shadow-sm shrink-0">
                        {getSubjectIcon(subject.name)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-800 text-base leading-snug uppercase tracking-tight">{subject.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="outline" className="text-[9px] font-bold uppercase bg-slate-50 border-slate-200 text-slate-600 rounded-lg px-2 py-0.5">
                            {subject.weeklyPeriods || 3} Periods/Week
                          </Badge>
                          {subject.requiresLab && (
                            <Badge variant="outline" className="text-[9px] font-bold uppercase bg-teal-50 border-teal-200/50 text-teal-700 rounded-lg px-2 py-0.5 flex items-center">
                              <Microscope className="h-2.5 w-2.5 mr-1 text-teal-600"/> Lab req
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {canManage && (
                      <div className="flex opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenDialog(subject)} 
                          className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(subject.id)} 
                          className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Applicable Classes */}
                  <div className="mt-2 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Applicable Cohorts</span>
                    <div className="flex flex-wrap gap-1">
                      {targetClasses.length > 0 ? (
                        targetClasses.map(cid => {
                          const classObj = classes?.find(c => c.id === cid);
                          return (
                            <Badge key={cid} variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] font-bold py-0.5 px-2 rounded-lg border border-slate-200/30">
                              {classObj ? classObj.name : 'Unknown Class'}
                            </Badge>
                          );
                        })
                      ) : (
                        <span className="text-[10px] italic text-slate-400 font-semibold">All student cohorts eligible</span>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-4 border-t border-dashed border-slate-150" />

                  {/* Faculty Allocation */}
                  <div className="mt-auto pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                      <UserCheck className="h-3.5 w-3.5 text-slate-400" /> Faculty Allocation
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {teacherIds.length > 0 ? (
                        teacherIds.map(tid => {
                          const teacher = teachers?.find(t => t.uid === tid);
                          return (
                            <div key={tid} className="flex items-center gap-2 bg-slate-50 border border-slate-150/40 rounded-xl p-1.5">
                              <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-[8px] uppercase shrink-0">
                                {teacher ? `${teacher.firstName[0]}${teacher.lastName[0]}` : 'TBA'}
                              </div>
                              <span className="text-[11px] font-bold text-slate-650 truncate">
                                {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Assigned Instructor'}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex items-center gap-2 bg-amber-50/50 border border-amber-200/50 text-amber-700 rounded-xl p-2.5 animate-pulse">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">Unassigned Course</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Curricular Register Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-xl rounded-3xl border border-slate-150 max-h-[90vh] overflow-y-auto p-6 shadow-xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                {editingSubject ? 'Modify Course details' : 'Register New Course'}
            </DialogTitle>
          </DialogHeader>
          {schoolId && (
            <SubjectForm
                setOpen={handleCloseDialog}
                allTeachers={teachers || []}
                classes={classes || []}
                initialData={editingSubject}
                onSuccess={forceRefetch}
                schoolId={schoolId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
