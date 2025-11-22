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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
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

function ParentList() {
  const firestore = useFirestore();
  const parentsCollectionRef = useMemoFirebase(() => collection(firestore, 'parents'), [firestore]);
  const { data: parents, isLoading } = useCollection(parentsCollectionRef);

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
    <Card>
      <CardHeader>
        <CardTitle>Parent List</CardTitle>
        <CardDescription>A list of all parents in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parents?.map((parent) => (
              <TableRow key={parent.id}>
                <TableCell>{parent.firstName}</TableCell>
                <TableCell>{parent.lastName}</TableCell>
                <TableCell>{parent.email}</TableCell>
                <TableCell>{parent.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ParentsPageContent() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');

  const studentsCollectionRef = useMemoFirebase(() => collection(firestore, 'students'), [firestore]);
  const { data: students } = useCollection(studentsCollectionRef);

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
      const result = await createNewUser(values.email, values.password);

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

      <ParentList />
    </div>
  );
}

export default function ParentsPage() {
    return (
        <ParentsPageContent />
    )
}
