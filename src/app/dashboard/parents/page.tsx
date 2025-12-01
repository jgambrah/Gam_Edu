
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
  } from '@/components/ui/alert-dialog';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useMemo } from 'react';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { createNewUser } from '@/app/actions/create-user';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  phone: z.string().optional(),
  address: z.string().optional(),
  studentIds: z.array(z.string()).optional(),
});

const editFormSchema = formSchema.omit({ password: true, email: true });

type ParentData = z.infer<typeof formSchema> & { id: string; uid: string; };

function EditParentForm({ parent, students, setOpen }: { parent: ParentData, students: any[] | null, setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [studentSearchTerm, setStudentSearchTerm] = useState('');

    const form = useForm<z.infer<typeof editFormSchema>>({
      resolver: zodResolver(editFormSchema),
      defaultValues: {
        firstName: parent.firstName,
        lastName: parent.lastName,
        phone: parent.phone || '',
        address: parent.address || '',
        studentIds: parent.studentIds || [],
      },
    });

    const filteredStudents = useMemo(() => {
        if (!students) return [];
        return students.filter(student =>
          `${student.firstName} ${student.lastName}`.toLowerCase().includes(studentSearchTerm.toLowerCase())
        );
      }, [students, studentSearchTerm]);
  
    async function onEditSubmit(values: z.infer<typeof editFormSchema>) {
      setIsSubmitting(true);
      try {
        const parentRef = doc(firestore, 'parents', parent.uid);
        await updateDoc(parentRef, values);
        toast({ title: 'Success', description: 'Parent details updated successfully.' });
        setOpen(false);
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update parent details.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          </div>
          <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )}/>
          <FormField control={form.control} name="address" render={({ field }) => (
            <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )}/>
          <FormField
            control={form.control}
            name="studentIds"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Link Students</FormLabel>
                </div>
                <div className="space-y-4">
                  <Input placeholder="Search for a student..." value={studentSearchTerm} onChange={(e) => setStudentSearchTerm(e.target.value)} className="mb-4"/>
                  <div className="max-h-40 overflow-y-auto space-y-2 rounded-md border p-4">
                    {filteredStudents.map((student) => (
                      <FormField key={student.id} control={form.control} name="studentIds"
                        render={({ field }) => (
                            <FormItem key={student.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl><Checkbox checked={field.value?.includes(student.id)}
                                onCheckedChange={(checked) => {
                                return checked
                                    ? field.onChange([...(field.value || []), student.id])
                                    : field.onChange(field.value?.filter((value) => value !== student.id));
                                }}
                            /></FormControl>
                            <FormLabel className="font-normal">{student.firstName} {student.lastName}</FormLabel>
                            </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </Form>
    )
}

function ParentList({ parents, students, isLoading, forceRefetch }: { parents: ParentData[] | null; students: any[] | null, isLoading: boolean; forceRefetch: () => void; }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [editingParent, setEditingParent] = useState<ParentData | null>(null);
  
    const handleDelete = async (parentUid: string) => {
      try {
          await deleteDoc(doc(firestore, 'parents', parentUid));
          toast({ title: 'Success', description: 'Parent has been deleted.'});
          forceRefetch();
      } catch(error) {
          console.error(error);
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete parent.' });
      }
    }
  
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }
  
    return (
      <>
      <Card>
        <CardHeader>
          <CardTitle>Parent List</CardTitle>
          <CardDescription>A list of all parents in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {parents && parents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parents.map((parent) => (
                  <TableRow key={parent.id}>
                    <TableCell>{parent.firstName}</TableCell>
                    <TableCell>{parent.lastName}</TableCell>
                    <TableCell>{parent.email}</TableCell>
                    <TableCell>{parent.phone}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setEditingParent(parent)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action will delete the parent's profile from the database. It will not delete their login account. This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(parent.uid)}>Confirm Delete</AlertDialogAction></AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="text-center py-8 text-muted-foreground">
                No parents found. Add your first parent above.
            </div>
          )}
        </CardContent>
      </Card>
      {editingParent && (
          <Dialog open={!!editingParent} onOpenChange={(open) => { if (!open) { setEditingParent(null); forceRefetch(); }}}>
              <DialogContent>
                  <DialogHeader><DialogTitle>Edit Parent: {editingParent.firstName} {editingParent.lastName}</DialogTitle></DialogHeader>
                  <EditParentForm parent={editingParent} students={students} setOpen={() => { setEditingParent(null); forceRefetch(); }} />
              </DialogContent>
          </Dialog>
      )}
      </>
    );
  }

function ParentsPageContent() {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  
  const parentsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'parents');
  }, [firestore, user]);
  const { data: parents, isLoading: isParentsLoading, error: parentsError, forceRefetch } = useCollection<ParentData>(parentsCollectionRef);

  const studentsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'students');
  }, [firestore, user]);
  const { data: students, isLoading: isStudentsLoading, error: studentsError } = useCollection(studentsCollectionRef);

  useEffect(() => {
    if (parentsError) {
        console.error("Error loading parents:", parentsError);
        toast({ variant: "destructive", title: "Load Error", description: "Could not load parent list." });
    }
    if (studentsError) {
        console.error("Error loading students:", studentsError);
        toast({ variant: "destructive", title: "Load Error", description: "Could not load student list for linking." });
    }
  }, [parentsError, studentsError, toast]);

  const isLoading = isParentsLoading || isStudentsLoading;

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(student =>
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(studentSearchTerm.toLowerCase())
    );
  }, [students, studentSearchTerm]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: 'password123',
      phone: '',
      address: '',
      studentIds: [],
    },
  });

  const firstName = form.watch('firstName');
  const lastName = form.watch('lastName');

  useEffect(() => {
    if (firstName || lastName) {
      const email = `${firstName.toLowerCase().replace(/\s/g, '')}${lastName.toLowerCase().replace(/\s/g, '')}@sunnyside-parent.com`;
      form.setValue('email', email);
    } else {
      form.setValue('email', '');
    }
  }, [firstName, lastName, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await createNewUser(values.email, values.password, 'Parent', { firstName: values.firstName, lastName: values.lastName });

      if ('error' in result) {
        throw new Error(result.error);
      }

      const { uid } = result;

      const parentData = {
        uid: uid,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        studentIds: values.studentIds || [],
      };

      await setDocumentNonBlocking(doc(firestore, 'parents', uid), parentData, { merge: true });

      toast({
        title: 'Parent Added',
        description: `${values.email} has been added as a parent.`,
      });
      forceRefetch();
      form.reset();
    } catch (error: any) {
      let errorMessage = 'An error occurred while adding the parent.';
      if (error.message.includes('EMAIL_EXISTS')) {
        errorMessage = 'This email is already in use by another account.';
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      console.error('Error adding parent:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Parent Management</CardTitle>
          <CardDescription>Add new parents and link them to students.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="parent@sunnyside-parent.com" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, Anytown USA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentIds"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Link Students</FormLabel>
                      <CardDescription>Select the students associated with this parent.</CardDescription>
                    </div>
                    <div className="space-y-4">
                      <Input
                        placeholder="Search for a student..."
                        value={studentSearchTerm}
                        onChange={(e) => setStudentSearchTerm(e.target.value)}
                        className="mb-4"
                      />
                      <div className="max-h-60 overflow-y-auto space-y-2 rounded-md border p-4">
                        {filteredStudents.map((student) => (
                          <FormField
                            key={student.id}
                            control={form.control}
                            name="studentIds"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={student.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(student.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), student.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== student.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {student.firstName} {student.lastName}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Parent
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ParentList parents={parents} students={students} isLoading={isLoading} forceRefetch={forceRefetch} />
    </div>
  );
}

export default function ParentsPage() {
    return (
        <ParentsPageContent />
    )
}

    