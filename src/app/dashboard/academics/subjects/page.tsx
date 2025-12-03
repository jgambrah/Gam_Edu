
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, BookCopy, Edit, Trash2, RefreshCw, Database } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { updateDocumentNonBlocking, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

// --- TYPES ---
type Staff = {
    uid: string;
    firstName: string;
    lastName: string;
};

type Subject = {
    id: string;
    name: string;
    teacherIds: string[];
};

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required.'),
  teacherIds: z.array(z.string()).default([]),
});

// --- FORM COMPONENT ---
function SubjectForm({
  setOpen,
  allTeachers,
  initialData,
}: {
  setOpen: (open: boolean) => void;
  allTeachers: Staff[];
  initialData?: Subject;
}) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof subjectSchema>>({
    resolver: zodResolver(subjectSchema),
    defaultValues: initialData || { name: '', teacherIds: [] },
  });

  async function onSubmit(values: z.infer<typeof subjectSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      if (initialData) {
        const subjectRef = doc(firestore, 'subjects', initialData.id);
        await updateDocumentNonBlocking(subjectRef, values);
        toast({ title: 'Success', description: 'Subject updated successfully.' });
      } else {
        await addDocumentNonBlocking(collection(firestore, 'subjects'), values);
        toast({ title: 'Success', description: 'New subject has been created.' });
      }
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
  const { user } = useAuth();
  const { toast } = useToast();

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined);
  const [isInitializing, setIsInitializing] = useState(false); // NEW STATE
  
  const canManage = role === 'Director' || role === 'Administrator';

  // Query
  const subjectsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'subjects'));
  }, [user, firestore]);
  
  const { data: subjects, isLoading: isLoadingSubjects } = useCollection<Subject>(subjectsQuery);

  // Fetch Teachers
  const teachersQuery = useMemoFirebase(() => {
    if (!user || !firestore || !canManage) return null;
    return query(collection(firestore, 'staff'), where('role', '==', 'Teacher'));
  }, [user, firestore, canManage]);
  const { data: teachers, isLoading: isLoadingTeachers } = useCollection<Staff>(teachersQuery);

  const isLoading = isLoadingSubjects || (canManage && isLoadingTeachers);

  // --- NEW: Force Initialize ---
  const handleForceInitialize = async () => {
      if (!firestore) return;
      setIsInitializing(true);
      try {
          await addDoc(collection(firestore, 'subjects'), {
              name: "General Science (Test)",
              teacherIds: [],
              createdAt: serverTimestamp()
          });
          toast({ title: "Success", description: "Test subject created. List should update." });
      } catch (e: any) {
          toast({ variant: 'destructive', title: "Error", description: e.message });
      } finally {
          setIsInitializing(false);
      }
  };

  const handleDelete = async (id: string) => {
      if(!confirm("Delete this subject?")) return;
      if(!firestore) return;
      try {
          deleteDocumentNonBlocking(doc(firestore, 'subjects', id));
          toast({ title: "Deleted" });
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

  const sortedSubjects = useMemo(() => {
    if (!subjects) return [];
    return [...subjects].sort((a,b) => a.name.localeCompare(b.name));
  }, [subjects]);

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
             {/* INIT BUTTON: Show if empty */}
             {(subjects?.length === 0 && !isLoading) && (
                <Button variant="destructive" onClick={handleForceInitialize} disabled={isInitializing}>
                    {isInitializing ? <Loader2 className="h-4 w-4 animate-spin"/> : <Database className="h-4 w-4 mr-2"/>}
                    Init DB
                </Button>
             )}
             <Button onClick={() => handleOpenDialog()} disabled={isLoading}>
                <PlusCircle className="mr-2 h-4 w-4" /> New Subject
             </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-500"/></div>
          ) : sortedSubjects.length === 0 ? (
             <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                 <p>No subjects created yet.</p>
                 <p className="text-xs mt-2">Click <strong>"Init DB"</strong> if this is your first time.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedSubjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-all">
                  <div>
                    <p className="font-bold text-lg text-slate-800">{subject.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {subject.teacherIds?.length || 0} teachers assigned
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(subject)}>
                        <Edit className="h-4 w-4 text-blue-600"/>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(subject.id)}>
                        <Trash2 className="h-4 w-4 text-red-600"/>
                    </Button>
                  </div>
                </div>
              ))}
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
            allTeachers={teachers || []}
            initialData={editingSubject}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
