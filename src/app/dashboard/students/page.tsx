
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useMemo } from 'react';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { createNewUser } from '@/app/actions/create-user';
import { useRole } from '@/context/role-context';

const studentFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
  classId: z.string().min(1, { message: 'Please select a class.'}),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
});

const editStudentFormSchema = studentFormSchema.omit({ password: true, email: true });

type StudentData = z.infer<typeof studentFormSchema> & { id: string; uid: string };

function EditStudentForm({ student, classes, setOpen }: { student: StudentData, classes: any[] | null, setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const form = useForm<z.infer<typeof editStudentFormSchema>>({
      resolver: zodResolver(editStudentFormSchema),
      defaultValues: {
        firstName: student.firstName,
        lastName: student.lastName,
        classId: student.classId,
        dateOfBirth: student.dateOfBirth || '',
        gender: student.gender || '',
        address: student.address || '',
      },
    });
  
    async function onEditSubmit(values: z.infer<typeof editStudentFormSchema>) {
      setIsSubmitting(true);
      try {
        const studentRef = doc(firestore, 'students', student.id);
        await updateDoc(studentRef, values);
        toast({ title: 'Success', description: 'Student details updated successfully.' });
        setOpen(false);
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update student details.' });
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
            <FormField control={form.control} name="classId" render={({ field }) => (
                <FormItem><FormLabel>Class</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger></FormControl>
                    <SelectContent>{classes?.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name || c.id}</SelectItem>))}</SelectContent>
                </Select><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                    <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem><FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a gender" /></SelectTrigger></FormControl><SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )}/>
            </div>
            <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </Form>
    )
  }

function StudentList({ students, classes, isLoading, searchTerm, classFilter, forceRefetch }: { students: StudentData[] | null, classes: any[] | null, isLoading: boolean, searchTerm: string, classFilter: string, forceRefetch: () => void }) {
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);

  const canManage = role === 'Director' || role === 'Administrator';

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(student => {
        const nameMatch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        const classMatch = classFilter === 'all' || student.classId === classFilter;
        return nameMatch && classMatch;
    });
  }, [students, searchTerm, classFilter]);

  const handleDelete = async (studentId: string) => {
    try {
        await deleteDoc(doc(firestore, 'students', studentId));
        toast({ title: 'Success', description: 'Student has been deleted.'});
        forceRefetch();
    } catch(error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete student.' });
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
    {filteredStudents.length > 0 ? (
      <Table>
          <TableHeader>
          <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Class</TableHead>
              {canManage && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
          </TableHeader>
          <TableBody>
          {filteredStudents.map((student) => (
              <TableRow key={student.id}>
              <TableCell>{student.firstName}</TableCell>
              <TableCell>{student.lastName}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{classes?.find(c => c.id === student.classId)?.name || classes?.find(c => c.id === student.classId)?.id || student.classId}</TableCell>
              {canManage && (
                  <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setEditingStudent(student)}><Edit className="h-4 w-4" /></Button>
                      <AlertDialog>
                          <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action will delete the student's profile from the database. It will not delete their login account. This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                              <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(student.id)}>Confirm Delete</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
                  </TableCell>
              )}
              </TableRow>
          ))}
          </TableBody>
      </Table>
    ) : (
      <div className="text-center py-8 text-muted-foreground">
        {searchTerm || classFilter !== 'all' 
          ? 'No students match your search criteria.' 
          : 'No students found. Add your first student above.'}
      </div>
    )}
    {editingStudent && (
        <Dialog open={!!editingStudent} onOpenChange={(open) => { if (!open) { setEditingStudent(null); forceRefetch(); }}}>
            <DialogContent>
                <DialogHeader><DialogTitle>Edit Student: {editingStudent.firstName} {editingStudent.lastName}</DialogTitle></DialogHeader>
                <EditStudentForm student={editingStudent} classes={classes} setOpen={() => { setEditingStudent(null); forceRefetch(); }} />
            </DialogContent>
        </Dialog>
    )}
    </>
  );
}

function StudentsPageContent() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  
  const classesCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'classes') : null, [firestore]);
  const { data: classes } = useCollection<{id: string, name: string}>(classesCollectionRef);
  
  const studentsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'students') : null, [firestore]);
  const { data: students, isLoading, forceRefetch } = useCollection<StudentData>(studentsCollectionRef);

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: 'password123',
      classId: '',
      dateOfBirth: '',
      gender: '',
      address: '',
    },
  });

  const firstName = form.watch('firstName');
  const lastName = form.watch('lastName');

  useEffect(() => {
    if (firstName && lastName) {
      // Clean names for email - remove special characters
      const cleanFirstName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanLastName = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = `${cleanFirstName}${cleanLastName}@sunnyside-student.com`;
      form.setValue('email', email);
    } else {
        form.setValue('email', '');
    }
  }, [firstName, lastName, form]);

  async function onSubmit(values: z.infer<typeof studentFormSchema>) {
    setIsSubmitting(true);
    try {
      const result = await createNewUser(values.email, values.password, 'Student', { firstName: values.firstName, lastName: values.lastName });

      if ('error' in result) {
        throw new Error(result.error);
      }
      
      toast({
        title: 'Student Added Successfully',
        description: `${values.firstName} ${values.lastName} has been added. Login: ${values.email} / ${values.password}`,
        duration: 8000,
      });
      
      // The createNewUser function already handles Firestore creation
      // so we just need to refetch the data.
      setTimeout(() => {
        forceRefetch();
      }, 500);
      
      form.reset();
    } catch (error: any) {
      console.error('❌ Error adding student:', error);
      toast({
        variant: 'destructive',
        title: 'Error Adding Student',
        description: error.message || 'An error occurred while adding the student.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Student</CardTitle>
          <CardDescription>Enroll a new student and assign them to a class.</CardDescription>
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
                        <Input placeholder="John" {...field} />
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
                        <Input placeholder="Doe" {...field} />
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
                      <Input placeholder="student@sunnyside-student.com" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Default Password</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a class to assign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes?.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name || c.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender (Optional)</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Student
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>A list of all students in the system.</CardDescription>
          <div className="pt-4 flex gap-4">
            <Input 
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                            {c.name || c.id}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
            <StudentList students={students} classes={classes} isLoading={isLoading} searchTerm={searchTerm} classFilter={classFilter} forceRefetch={forceRefetch} />
        </CardContent>
      </Card>
    </div>
  );
}


export default function StudentsPage() {
    return (
        <StudentsPageContent />
    )
}
