
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import { collection, doc, query, where } from 'firebase/firestore';
import { Loader2, PlusCircle, User, Users, Ratio, Building } from 'lucide-react';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';
import { useRole } from '@/context/role-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const classFormSchema = z.object({
  name: z.string().min(1, { message: 'Class name is required.' }),
  description: z.string().optional(),
  teacherId: z.string().optional(),
  capacity: z.coerce.number().min(1, { message: 'Capacity must be at least 1.' }),
});

type ClassData = {
  id: string;
  name: string;
  description?: string;
  teacherId?: string;
  studentIds?: string[];
  capacity?: number;
};

type Teacher = {
    uid: string;
    firstName: string;
    lastName: string;
};

type Student = {
    id: string;
    classId: string;
    gender: 'Male' | 'Female' | 'Other';
    firstName: string;
    lastName: string;
}

function CreateClassForm({ setOpen, teachers }: { setOpen: (open: boolean) => void; teachers: Teacher[] }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof classFormSchema>>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      name: '',
      description: '',
      teacherId: '',
      capacity: 30,
    },
  });

  async function onSubmit(values: z.infer<typeof classFormSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      const classId = values.name.toLowerCase().replace(/\s+/g, '-');
      const classData = {
        name: values.name,
        description: values.description,
        teacherId: values.teacherId || '',
        studentIds: [],
        capacity: values.capacity,
      };
      await setDocumentNonBlocking(doc(firestore, 'classes', classId), classData, { merge: true });

      toast({
        title: 'Class Created',
        description: `The class "${values.name}" has been successfully created.`,
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while creating the class.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Grade 10 - Section A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of the class." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacherId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assign Teacher (Optional)</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {teachers.map(t => <SelectItem key={t.uid} value={t.uid}>{t.firstName} {t.lastName}</SelectItem>)}
                    </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Class Capacity</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Class
        </Button>
      </form>
    </Form>
  );
}

function ManageClassDialog({ classData, teachers, students, setOpen }: { classData: ClassData, teachers: Teacher[], students: Student[], setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        defaultValues: {
            teacherId: classData.teacherId || '',
            capacity: classData.capacity || 30,
        }
    });

    const enrolledStudents = students.filter(s => s.classId === classData.id);

    async function onUpdate(values: { teacherId: string; capacity: number; }) {
        setIsSubmitting(true);
        try {
            await updateDocumentNonBlocking(doc(firestore, 'classes', classData.id), values);
            toast({ title: "Success", description: "Class details have been updated."});
            setOpen(false);
        } catch (error) {
            console.error("Error updating class", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not update class details."});
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Manage: {classData.name}</DialogTitle>
                <DialogDescription>Update teacher assignment, capacity, and view enrolled students.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onUpdate)} className="space-y-6">
                    <FormField control={form.control} name="teacherId" render={({ field }) => (
                        <FormItem><FormLabel>Class Teacher</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger></FormControl><SelectContent>{teachers.map(t => <SelectItem key={t.uid} value={t.uid}>{t.firstName} {t.lastName}</SelectItem>)}</SelectContent></Select></FormItem>
                    )}/>
                    <FormField control={form.control} name="capacity" render={({ field }) => (
                        <FormItem><FormLabel>Class Capacity</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                    )}/>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Save Changes</Button>
                </form>
            </Form>
            <Separator />
            <div>
                <h4 className="font-semibold mb-2">Enrolled Students ({enrolledStudents.length})</h4>
                <div className="max-h-48 overflow-y-auto pr-2">
                    {enrolledStudents.length > 0 ? (
                        <ul className="list-disc pl-5">
                            {enrolledStudents.map(s => <li key={s.id}>{s.firstName} {s.lastName}</li>)}
                        </ul>
                    ) : <p className="text-sm text-muted-foreground">No students are enrolled in this class.</p>}
                </div>
            </div>
        </DialogContent>
    )
}

export default function AcademicsPageContent() {
  const { role } = useRole();
  const firestore = useFirestore();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState<string | null>(null);

  const classesCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'classes') : null, [firestore]);
  const { data: classes, isLoading: isLoadingClasses } = useCollection<ClassData>(classesCollectionRef);
  
  const teachersQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'staff'), where('role', '==', 'Teacher')) : null, [firestore]);
  const { data: teachers, isLoading: isLoadingTeachers } = useCollection<Teacher>(teachersQuery);

  const studentsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'students') : null, [firestore]);
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);


  const canManageClasses = role === 'Director' || role === 'Administrator';
  const isLoading = isLoadingClasses || isLoadingTeachers || isLoadingStudents;

  const classStats = useMemo(() => {
    if (!classes || !students || !teachers) return {};
    return classes.reduce((acc, c) => {
        const enrolledStudents = students.filter(s => c.studentIds?.includes(s.id));
        const maleCount = enrolledStudents.filter(s => s.gender === 'Male').length;
        const femaleCount = enrolledStudents.filter(s => s.gender === 'Female').length;
        const teacher = teachers.find(t => t.uid === c.teacherId);
        
        acc[c.id] = {
            studentCount: c.studentIds?.length || 0,
            genderRatio: `M: ${maleCount} / F: ${femaleCount}`,
            teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Not Assigned',
        };
        return acc;
    }, {} as Record<string, { studentCount: number; genderRatio: string; teacherName: string; }>);
  }, [classes, students, teachers]);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Class Management</CardTitle>
            <CardDescription>
              View, create, and manage academic classes.
            </CardDescription>
          </div>
          {canManageClasses && (
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Class</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to add a new class to the system.
                  </DialogDescription>
                </DialogHeader>
                <CreateClassForm setOpen={setCreateDialogOpen} teachers={teachers || []} />
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i}><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full mt-2" /></CardContent></Card>
              ))}
            </div>
          ) : classes && classes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((c) => (
                <Card key={c.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{c.name}</CardTitle>
                    <CardDescription>{c.description || 'No description available.'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Users className="h-4 w-4"/><span>{classStats[c.id]?.studentCount || 0} / {c.capacity || 0} Students</span></div>
                    <div className="flex items-center gap-2"><User className="h-4 w-4"/><span>{classStats[c.id]?.teacherName || 'Not Assigned'}</span></div>
                    <div className="flex items-center gap-2"><Ratio className="h-4 w-4"/><span>{classStats[c.id]?.genderRatio}</span></div>
                  </CardContent>
                  {canManageClasses && (
                    <CardFooter>
                        <Dialog open={manageDialogOpen === c.id} onOpenChange={(isOpen) => setManageDialogOpen(isOpen ? c.id : null)}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full">Manage Class</Button>
                            </DialogTrigger>
                            <ManageClassDialog classData={c} teachers={teachers || []} students={students || []} setOpen={(isOpen) => setManageDialogOpen(isOpen ? c.id : null)} />
                        </Dialog>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No classes have been created yet.</p>
              {canManageClasses && <p className='text-sm text-muted-foreground'>Click "Create Class" to get started.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
