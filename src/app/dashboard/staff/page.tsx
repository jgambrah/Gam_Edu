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
  FormDescription,
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
import { useAuth, useFirestore } from '@/firebase'; 
import { collection, doc, deleteDoc, updateDoc, setDoc, getDocs, serverTimestamp } from 'firebase/firestore'; 
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useCallback } from 'react';
import { Loader2, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { createNewUser } from '@/app/actions/create-user';
import { useRole } from '@/context/role-context';

// --- SCHEMAS ---
const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
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

// --- COMPONENTS ---

function EditStaffForm({ staff, setOpen, onSuccess }: { staff: StaffData, setOpen: (open: boolean) => void, onSuccess: () => void }) {
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
      dateOfBirth: staff.dateOfBirth,
      gender: staff.gender,
      nationality: staff.nationality,
      address: staff.address,
    },
  });

  async function onEditSubmit(values: z.infer<typeof editFormSchema>) {
    setIsSubmitting(true);
    try {
      const staffRef = doc(firestore, 'staff', staff.id);
      await updateDoc(staffRef, values);
      toast({ title: 'Success', description: 'Updated successfully.' });
      onSuccess();
      setOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
            <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
        </div>
        <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
        <FormField control={form.control} name="role" render={({ field }) => (
            <FormItem><FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                    <SelectContent>{ALL_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
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
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
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
          toast({ title: 'Deleted', description: 'Staff member removed.'});
          forceRefetch();
      } catch(error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete.' });
      }
    }
  
    if (isLoading) return <div className="space-y-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>;
  
    return (
      <>
      <Card>
        <CardHeader>
          <CardTitle>Existing Staff</CardTitle>
          <CardDescription>Total Staff: {staff?.length || 0}</CardDescription>
          <div className="flex justify-end"><Button variant="outline" size="sm" onClick={forceRefetch}><RefreshCw className="h-4 w-4 mr-2"/> Refresh</Button></div>
        </CardHeader>
        <CardContent>
          {staff && staff.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  {canManage && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.firstName} {s.lastName}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.role}</TableCell>
                    {canManage && (
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => setEditingStaff(s)}><Edit className="h-4 w-4" /></Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Delete Staff?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(s.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No staff members found.</div>
          )}
        </CardContent>
      </Card>
      {editingStaff && (
          <Dialog open={!!editingStaff} onOpenChange={(open) => !open && setEditingStaff(null)}>
              <DialogContent><DialogHeader><DialogTitle>Edit Staff</DialogTitle></DialogHeader>
                  <EditStaffForm staff={editingStaff} setOpen={() => setEditingStaff(null)} onSuccess={forceRefetch} />
              </DialogContent>
          </Dialog>
      )}
      </>
    );
  }

function StaffPageContent() {
  const firestore = useFirestore();
  const { user } = useAuth(); 
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- DIRECT DATA FETCHING STATE ---
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const fetchStaff = useCallback(async () => {
    if (!firestore || !user) return;
    
    setIsLoadingData(true);
    try {
        // Direct fetch - bypasses listeners
        const querySnapshot = await getDocs(collection(firestore, 'staff'));
        const staffList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StaffData));
        setStaff(staffList);
    } catch (error: any) {
        console.error("Error loading staff:", error);
        toast({ variant: "destructive", title: "Load Error", description: error.message });
    } finally {
        setIsLoadingData(false);
    }
  }, [firestore, user, toast]);

  // Load on mount
  useEffect(() => {
      fetchStaff();
  }, [fetchStaff]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', phone: '', password: 'password123', role: 'Teacher',
    },
  });

  const firstName = form.watch('firstName');
  const lastName = form.watch('lastName');

  useEffect(() => {
    if (firstName && lastName) {
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

      if ('error' in result) throw new Error(result.error);
      
      await setDoc(doc(firestore, 'staff', result.uid), {
        uid: result.uid,
        ...values,
        createdAt: serverTimestamp()
      });

      toast({ title: 'Staff Added', description: `${values.firstName} ${values.lastName} added.` });
      await fetchStaff(); // Refresh list
      form.reset();
      
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Staff Management</CardTitle>
          <CardDescription>Add new staff members.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="staff@sunnyside.com" {...field} readOnly /></FormControl><FormMessage /></FormItem>
                    )}/>
                   <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="role" render={({ field }) => (
                      <FormItem><FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                          <SelectContent>{ALL_ROLES.map((role) => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )}/>
                  <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem><FormLabel>Default Password</FormLabel><FormControl><Input type="password" {...field} readOnly /></FormControl><FormMessage /></FormItem>
                    )}/>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Staff
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <StaffList staff={staff} isLoading={isLoadingData} forceRefetch={fetchStaff} />
    </div>
  );
}


export default function StaffPage() {
    return (
        <StaffPageContent />
    )
}