
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, query, where, addDoc, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, BookCopy, Edit, Trash2, RefreshCw, UserCheck, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Badge } from '@/components/ui/badge';

// --- TYPES ---
type Staff = {
    uid: string;
    id: string; 
    firstName: string;
    lastName: string;
    role: string;
};

type Subject = {
    id: string;
    name: string;
    teacherIds: string[];
    schoolId?: string;
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
  onSuccess,
  schoolId
}: {
  setOpen: (open: boolean) => void;
  allTeachers: Staff[];
  initialData?: Subject;
  onSuccess: () => void;
  schoolId: string;
}) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof subjectSchema>>({
    resolver: zodResolver(subjectSchema),
    defaultValues: initialData || { name: '', teacherIds: [] },
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
                <FormLabel>Assign Subject Teachers</FormLabel>
                <FormDescription>Select all teachers qualified to teach this subject.</FormDescription>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto border p-3 rounded-xl bg-slate-50/50 shadow-inner">
                {allTeachers.length === 0 && <p className="text-sm text-muted-foreground text-center py-4 italic">No teachers found for this school.</p>}
                {allTeachers.map((teacher) => (
                  <FormField
                    key={teacher.uid}
                    control={form.control}
                    name="teacherIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={teacher.uid}
                          className="flex flex-row items-center space-x-3 space-y-0 py-2.5 hover:bg-white rounded-lg px-2 transition-colors border border-transparent hover:border-slate-200"
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
                          <FormLabel className="font-bold cursor-pointer w-full text-slate-700">
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
        <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg font-bold bg-indigo-600 hover:bg-indigo-700">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4"/>}
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

  const isLoading = isLoadingSchool || isLoadingSubjects || (canManage && isLoadingTeachers);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject? It will affect all existing timetable assignments.")) {
      return;
    }
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'subjects', id));
      toast({ title: 'Subject Deleted' });
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

  if (!canManage && !isLoading) {
    return (
      <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>Only administrators can manage subjects.</CardDescription></CardHeader></Card>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <Card className="border-t-4 border-t-indigo-600 shadow-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <BookOpen className="text-indigo-600" /> Subject Catalog
              </CardTitle>
              <CardDescription className="text-slate-500 font-medium">
                Register academic subjects and link them to qualified faculty members.
              </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={forceRefetch} className="bg-white rounded-xl border-2 font-bold h-11">
                   <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")}/> Sync
                </Button>
                <Button onClick={() => handleOpenDialog()} disabled={isLoading || !schoolId} className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 rounded-xl font-bold">
                    <PlusCircle className="mr-2 h-4 w-4" /> New Subject
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600"/>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading Academic Data...</p>
            </div>
          ) : sortedSubjects.length === 0 ? (
             <div className="text-center text-muted-foreground py-24 bg-white">
                 <BookCopy className="h-12 w-12 mx-auto mb-4 opacity-10" />
                 <p className="font-bold uppercase tracking-widest text-sm">No subjects found.</p>
                 <p className="text-xs mt-1">Start by adding subjects and assigning teachers.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y border-b">
              {sortedSubjects.map((subject) => (
                <div key={subject.id} className="p-6 bg-white hover:bg-slate-50 transition-all flex flex-col group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                        <h3 className="font-black text-xl text-slate-800 tracking-tight uppercase italic">{subject.name}</h3>
                        <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-[10px] uppercase bg-indigo-50 border-indigo-100 text-indigo-600 font-black tracking-tighter">
                                {subject.teacherIds?.length || 0} Teachers Assigned
                            </Badge>
                        </div>
                    </div>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(subject)} className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                            <Edit className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(subject.id)} className="h-8 w-8 text-slate-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-dashed">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 flex items-center gap-1">
                          <UserCheck className="h-3 w-3" /> Faculty List
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                          {subject.teacherIds?.length > 0 ? subject.teacherIds.map(tid => {
                              const teacher = teachers?.find(t => t.uid === tid);
                              return (
                                  <Badge key={tid} variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] font-bold py-0.5 px-2">
                                      {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'TBA'}
                                  </Badge>
                              );
                          }) : (
                              <span className="text-[10px] italic text-red-400 font-bold">No teachers assigned yet.</span>
                          )}
                      </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md rounded-3xl border-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
                {editingSubject ? 'Edit Subject' : 'Register New Subject'}
            </DialogTitle>
          </DialogHeader>
          {schoolId && (
            <SubjectForm
                setOpen={handleCloseDialog}
                allTeachers={teachers || []}
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
