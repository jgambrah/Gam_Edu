
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, addDoc, updateDoc, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, BookCopy } from 'lucide-react';
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
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allTeachers.map((teacher) => (
                  <FormField
                    key={teacher.uid}
                    control={form.control}
                    name="teacherIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={teacher.uid}
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
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
                          <FormLabel className="font-normal">{teacher.firstName} {teacher.lastName}</FormLabel>
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

export default function SubjectsPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const { user } = useAuth();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined);

  const canManage = role === 'Director' || role === 'Administrator';

  const subjectsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'subjects') : null, [firestore]);
  const { data: subjects, isLoading: isLoadingSubjects } = useCollection<Subject>(subjectsQuery);

  const teachersQuery = useMemoFirebase(() => (firestore && user) ? query(collection(firestore, 'staff'), where('role', '==', 'Teacher')) : null, [firestore, user]);
  const { data: teachers, isLoading: isLoadingTeachers } = useCollection<Staff>(teachersQuery);

  const handleOpenDialog = (subject?: Subject) => {
    setEditingSubject(subject);
    setFormOpen(true);
  };
  
  const handleCloseDialog = () => {
    setFormOpen(false);
    setEditingSubject(undefined);
  };
  
  const onSubjectChange = () => {
      // No longer needed due to real-time updates
  }

  const getTeacherNames = (teacherIds: string[]) => {
    if (!teachers) return 'Loading...';
    return teacherIds.map(id => teachers.find(t => t.uid === id)?.firstName).filter(Boolean).join(', ') || 'None Assigned';
  };

  if (!canManage) {
    return (
      <Card>
        <CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This page is restricted to Administrators and Directors.</CardDescription></CardHeader>
      </Card>
    );
  }

  const isLoading = isLoadingSubjects || isLoadingTeachers;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><BookCopy /> Subject Management</CardTitle>
            <CardDescription>Create academic subjects and assign qualified teachers.</CardDescription>
          </div>
          <Button onClick={() => handleOpenDialog()} disabled={isLoadingTeachers}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Subject
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="border rounded-lg">
              {subjects?.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                  <div>
                    <p className="font-semibold">{subject.name}</p>
                    <p className="text-sm text-muted-foreground">{subject.teacherIds.length} teacher(s) assigned</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(subject)}>
                    Manage
                  </Button>
                </div>
              ))}
              {subjects?.length === 0 && <p className="text-center text-muted-foreground p-8">No subjects created yet.</p>}
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
