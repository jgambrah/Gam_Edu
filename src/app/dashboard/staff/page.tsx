
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { ALL_ROLES, UserRole } from '@/lib/types';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useMemo } from 'react';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { createNewUser } from '@/app/actions/create-user';
import { useRole } from '@/context/role-context';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  phone: z.string().optional(),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
  role: z.enum(ALL_ROLES),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
});

const editFormSchema = formSchema.omit({ password: true, email: true });

type StaffData = {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  address?: string;
};

function EditStaffForm({ staff, setOpen }: { staff: StaffData, setOpen: (open: boolean) => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      firstName: staff.firstName,
      lastName: staff.lastName,
      phone: staff.phone || '',
      role: staff.role,
      dateOfBirth: staff.dateOfBirth || '',
      gender: staff.gender || '',
      nationality: staff.nationality || '',
      address: staff.address || '',
    },
  });

  async function onEditSubmit(values: z.infer<typeof editFormSchema>) {
    setIsSubmitting(true);
    try {
      const staffRef = doc(firestore, 'staff', staff.id);
      await updateDoc(staffRef, values);
      toast({ title: 'Success', description: 'Staff details updated successfully.' });
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update staff details.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <FormField control={form.control} name="role" render={({ field }) => (
            <FormItem><FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                    <SelectContent>{ALL_ROLES.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent>
                </Select>
            <FormMessage /></FormItem>
        )}/>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem><FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a gender"/></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                <FormMessage /></FormItem>
            )}/>
        </div>
        <FormField control={form.control} name="nationality" render={({ field }) => (
            <FormItem><FormLabel>Nationality</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
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

function StaffList({ staff, isLoading, forceRefetch }: { staff: StaffData[] | null, isLoading: boolean, forceRefetch: () => void }) {
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [editingStaff, setEditingStaff] = useState<StaffData | null>(null);

  const canManage = role === 'Director' || role === 'Administrator';

  const handleDelete = async (staffId: string) => {
    try {
        await deleteDoc(doc(firestore, 'staff', staffId));
        toast({ title: 'Success', description: 'Staff member has been deleted.'});
        forceRefetch();
    } catch(error) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete staff member.' });
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
        <CardTitle>Existing Staff</CardTitle>
        <CardDescription>A list of all staff members in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        {staff && staff.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                {canManage && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((staffMember) => (
                <TableRow key={staffMember.id}>
                  <TableCell>{staffMember.firstName}</TableCell>
                  <TableCell>{staffMember.lastName}</TableCell>
                  <TableCell>{staffMember.email}</TableCell>
                  <TableCell>{staffMember.role}</TableCell>
                  {canManage && (
                      <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => setEditingStaff(staffMember)}>
                              <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                              <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>
                                          This action will delete the staff member's profile from the database. It will not delete their login account. This cannot be undone.
                                      </AlertDialogDescription></AlertDialogHeader>
                                  <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(staffMember.id)}>Confirm Delete</AlertDialogAction></AlertDialogFooter>
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
            No staff members found. Add your first staff member above.
          </div>
        )}
      </CardContent>
    </Card>

    {editingStaff && (
        <Dialog open={!!editingStaff} onOpenChange={(open) => { if (!open) { setEditingStaff(null); forceRefetch(); }}}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Staff: {editingStaff.firstName} {editingStaff.lastName}</DialogTitle>
                </DialogHeader>
                <EditStaffForm staff={editingStaff} setOpen={() => { setEditingStaff(null); forceRefetch(); }} />
            </DialogContent>
        </Dialog>
    )}
    </>
  );
}

function StaffPageContent() {
  const firestore = useFirestore();
  const { user } = useAuth(); // Import useAuth to get user
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const staffCollectionRef = useMemoFirebase(() => (firestore && user) ? collection(firestore, 'staff') : null, [firestore, user]);
  const { data: staff, isLoading, forceRefetch } = useCollection<StaffData>(staffCollectionRef);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: 'password123',
      role: 'Teacher',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      address: '',
    },
  });

  const firstName = form.watch('firstName');
  const lastName = form.watch('lastName');

  // Generate email automatically
  useEffect(() => {
    if (firstName && lastName) {
      // Clean and format names for email
      const cleanFirstName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanLastName = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = `${cleanFirstName}${cleanLastName}@sunnyside.com`;
      form.setValue('email', email);
    } else {
        form.setValue('email', '');
    }
  }, [firstName, lastName, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await createNewUser(values.email, values.password, values.role, { firstName: values.firstName, lastName: values.lastName });

      if ('error' in result) {
        throw new Error(result.error);
      }
      
      toast({
        title: 'Staff Added Successfully',
        description: `${values.firstName} ${values.lastName} has been added. Login: ${values.email} / ${values.password}`,
        duration: 8000,
      });
      
      setTimeout(() => {
        forceRefetch();
      }, 500);
      
      form.reset();
      
    } catch (error: any) {
      console.error('Error adding staff:', error);
      toast({
        variant: 'destructive',
        title: 'Error Adding Staff',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Staff Management</CardTitle>
          <CardDescription>Add new staff members and assign them roles.</CardDescription>
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
                      <Input placeholder="staff@sunnyside.com" {...field} readOnly />
                    </FormControl>
                    <FormDescription>
                      Auto-generated based on first and last name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. American" {...field} />
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} readOnly />
                    </FormControl>
                    <FormDescription>
                      This is the default password for the new staff member. They should change it after first login.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ALL_ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Staff Member
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <StaffList staff={staff} isLoading={isLoading} forceRefetch={forceRefetch} />
    </div>
  );
}


export default function StaffPage() {
    return (
        <StaffPageContent />
    )
}
