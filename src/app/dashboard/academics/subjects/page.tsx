
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, BookCopy, Edit, Trash2, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Subject, Staff } from '@/lib/types';

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required.'),
  teacherIds: z.array(z.string()).default([]),
});

// --- FORM COMPONENT ---
function SubjectForm({
  setOpen,
  allTeachers,
  initialData,
  onSuccess
}: {
  setOpen: (open: boolean) => void;
  allTeachers: Staff[];
  initialData?: Subject;
  onSuccess: () => void;
}) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof subjectSchema>>({
    resolver: zodResolver(subjectSchema),
    defaultValues: initialData || { name: '', teacherIds: [] },
  });

  async function onSubmit(values: z.infer<typeof subjectSchema>) {
    setIsSubmitting(true);
    try {
      if (initialData) {
        // Update existing subject
        const subjectRef = doc(firestore, 'subjects', initialData.id);
        await updateDoc(subjectRef, values);
        toast({ title: 'Success', description: 'Subject updated successfully.' });
      } else {
        // Create new subject
        await addDoc(collection(firestore, 'subjects'), values);
        toast({ title: 'Success', description: 'New subject has been created.' });
      }
      onSuccess();
      setOpen(false);
    } catch (error) {
      console.error('Error saving subject:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save subject.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Name</FormLabel>
              <FormControl><Input placeholder="e.g., Biology" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacherIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Assign Teachers</FormLabel>
                <FormDescription>Select all teachers qualified to teach this subject.</FormDescription>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto border p-2 rounded-md">
                {allTeachers.length === 0 && <p className="text-sm text-muted-foreground text-center">No teachers found.</p>}
                {allTeachers.map((teacher) => (
                  <FormField
                    key={teacher.uid}
                    control={form.control}
                    name="teacherIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={teacher.uid}
                          className="flex flex-row items-center space-x-3 space-y-0 py-2"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(teacher.uid)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), teacher.uid])
                                  : field.onChange(field.value?.filter((value) => value !== teacher.uid));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer w-full">
                             {teacher.firstName} {teacher.lastName}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Save Changes' : 'Create Subject'}
        </Button>
      </form>
    </Form>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function SubjectsPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const { user, isUserLoading } = useAuth();
  const { toast } = useToast();

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined);
  
  // Data State
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const canManage = role === 'Director' || role === 'Administrator';

  // --- ROBUST FETCH LOGIC ---
  const fetchData = useCallback(async () => {
      if(!user || !firestore) return;
      setIsLoading(true);
      try {
          // 1. Fetch Subjects
          const subSnap = await getDocs(collection(firestore, 'subjects'));
          const subList = subSnap.docs.map(d => ({ id: d.id, ...d.data() } as Subject));
          // Sort alphabetically
          setSubjects(subList.sort((a,b) => a.name.localeCompare(b.name)));

          // 2. Fetch Teachers (Only if Admin)
          if (canManage) {
              // Try simple query first to avoid index issues
              const staffSnap = await getDocs(collection(firestore, 'staff'));
              const teacherList = staffSnap.docs
                  .map(d => ({ uid: d.id, ...d.data() } as Staff))
                  .filter(s => s.role === 'Teacher');
              setTeachers(teacherList);
          }

      } catch (e: any) {
          toast({ variant: 'destructive', title: "Error", description: e.message });
      } finally {
          setIsLoading(false);
      }
  }, [user, firestore, canManage, toast]);

  useEffect(() => {
      if(!isUserLoading && user) {
          fetchData();
      }
  }, [isUserLoading, user, fetchData]);

  const handleDelete = async (id: string) => {
      if(!confirm("Delete this subject?")) return;
      try {
          await deleteDoc(doc(firestore, 'subjects', id));
          toast({ title: "Deleted" });
          fetchData();
      } catch (e) {
          toast({ variant: 'destructive', title: "Error", description: "Failed to delete." });
      }
  }

  const handleOpenDialog = (subject?: Subject) => {
    setEditingSubject(subject);
    setFormOpen(true);
  };
  
  const handleCloseDialog = () => {
    setFormOpen(false);
    setEditingSubject(undefined);
  };

  if (!canManage) {
    return (
      <Card>
        <CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>Restricted area.</CardDescription></CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="border-t-4 border-t-purple-600 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><BookCopy /> Subject Management</CardTitle>
            <CardDescription>Create academic subjects and assign qualified teachers.</CardDescription>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" onClick={fetchData} disabled={isLoading}><RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin':''}`}/> Refresh</Button>
             <Button onClick={() => handleOpenDialog()} disabled={isLoading}>
                <PlusCircle className="mr-2 h-4 w-4" /> New Subject
             </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-500"/></div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all">
                  <div>
                    <p className="font-bold text-lg text-slate-800">{subject.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {subject.teacherIds?.length || 0} teachers assigned
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(subject)}>
                        <Edit className="h-4 w-4 text-blue-600"/>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(subject.id)}>
                        <Trash2 className="h-4 w-4 text-red-600"/>
                    </Button>
                  </div>
                </div>
              ))}
              {subjects.length === 0 && <p className="text-center text-muted-foreground p-8">No subjects created yet.</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubject ? 'Edit Subject' : 'Create New Subject'}</DialogTitle>
          </DialogHeader>
          <SubjectForm
            setOpen={handleCloseDialog}
            allTeachers={teachers}
            initialData={editingSubject}
            onSuccess={fetchData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
