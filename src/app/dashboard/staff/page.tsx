
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
import { collection, doc, deleteDoc, updateDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'; 
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Loader2, Edit, Trash2, RefreshCw, UserPlus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { createNewUser } from '@/app/actions/create-user';
import { useRole } from '@/context/role-context';

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
    },
  });

  async function onEditSubmit(values: z.infer<typeof editFormSchema>) {
    setIsSubmitting(true);
    try {
      const staffRef = doc(firestore, 'staff', staff.id);
      await updateDoc(staffRef, values);
      toast({ title: 'Success', description: 'Updated successfully.' });
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
         <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes
        </Button>
      </form>
    </Form>
  )
}

function StaffList({ staff, isLoading }: { staff: StaffData[] | null, isLoading: boolean }) {
    const { user } = useAuth(); // We use Auth user here to determine if they can see actions, actual role logic can be added if needed
    const firestore = useFirestore();
    const { toast } = useToast();
    const [editingStaff, setEditingStaff] = useState<StaffData | null>(null);
    
    // Simple check: If logged in, show actions (since this page is protected by RoleGuard anyway)
    const canManage = !!user; 
  
    const handleDelete = async (staffId: string) => {
      try {
          await deleteDoc(doc(firestore, 'staff', staffId));
          toast({ title: 'Deleted', description: 'Staff member removed.'});
      } catch(error) {
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete.' });
      }
    }
  
    if (isLoading) return <div className="space-y-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>;
  
    return (
      <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle>Existing Staff</CardTitle>
                <CardDescription>Total Staff: {staff?.length || 0}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {staff && staff.length > 0 ? (
            <div className="rounded-md border">
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
                    <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                            {s.role}
                        </span>
                    </TableCell>
                    {canManage && (
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => setEditingStaff(s)}><Edit className="h-4 w-4 text-blue-500" /></Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button></AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Delete Staff?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(s.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No staff members found.</div>
          )}
        </CardContent>
      </Card>
      {editingStaff && (
          <Dialog open={!!editingStaff} onOpenChange={(open) => !open && setEditingStaff(null)}>
              <DialogContent><DialogHeader><DialogTitle>Edit Staff</DialogTitle></DialogHeader>
                  <EditStaffForm staff={editingStaff} setOpen={() => setEditingStaff(null)} />
              </DialogContent>
          </Dialog>
      )}
      </>
    );
  }

function StaffPageContent() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useAuth(); 
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [staff, setStaff] = useState<StaffData[]>([]);
  // Start loading only if we don't have data yet
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- STABILIZED LISTENER ---
  useEffect(() => {
    // 1. Safety Checks
    if (isUserLoading || !user || !firestore) return;

    // 2. Only show loading spinner if we have NO data yet. 
    // This prevents "flickering" if the user object updates slightly.
    if (staff.length === 0) setIsLoadingData(true);

    console.log("🔄 Connecting to Staff Collection...");

    const q = collection(firestore, 'staff');

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const staffList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StaffData));
        
        console.log(`✅ DATA RECEIVED: ${staffList.length} staff members.`);
        
        setStaff(staffList);
        setIsLoadingData(false); // Stop loading immediately
    }, (error) => {
        console.error("❌ Listener Error:", error);
        // Only show toast if it's a real permission error, not a navigation cancellation
        if (error.code === 'permission-denied') {
             toast({ variant: "destructive", title: "Access Denied", description: "Check Firestore Rules." });
        }
        setIsLoadingData(false);
    });

    return () => unsubscribe();
    
    // IMPORTANT: We remove 'staff.length' dependency so it doesn't loop
    // We rely on firestore/user stability
  }, [firestore, user?.uid, isUserLoading]); // Only re-run if UID changes, not the whole user object

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', password: 'password123', role: 'Teacher', },
  });

  const firstName = form.watch('firstName');
  const lastName = form.watch('lastName');

  useEffect(() => {
    if (firstName && lastName) {
      const cleanFirstName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanLastName = lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const email = `${cleanFirstName}${cleanLastName}@sunnyside.com`;
      form.setValue('email', email);
    } else { form.setValue('email', ''); }
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
          <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5"/> Staff Management</CardTitle>
          <CardDescription>Add new staff members and assign them roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} readOnly /></FormControl><FormMessage /></FormItem>)}/>
                  <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>)}/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField control={form.control} name="role" render={({ field }) => (
                      <FormItem><FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                          <SelectContent>{ALL_ROLES.map((role) => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent>
                        </Select><FormMessage /></FormItem>
                    )}/>
                  <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Default Password</FormLabel><FormControl><Input type="password" {...field} readOnly /></FormControl><FormMessage /></FormItem>)}/>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Staff Member
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Force re-render when staff length changes to ensure UI updates */}
      <StaffList key={staff.length} staff={staff} isLoading={isLoadingData} />
    </div>
  );
}

export default function StaffPage() {
    return (
        <StaffPageContent />
    )
}
