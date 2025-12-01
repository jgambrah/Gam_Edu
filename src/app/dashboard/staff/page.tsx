
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
// IMPORT onSnapshot for Real-Time updates & addDoc for debugging
import { collection, doc, deleteDoc, updateDoc, setDoc, onSnapshot, serverTimestamp, addDoc, getDocs } from 'firebase/firestore'; 
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState, useCallback } from 'react';
import { Loader2, Edit, Trash2, RefreshCw, ShieldCheck, Database, AlertCircle, CheckCircle2 } from 'lucide-react';
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
      // Add other defaults as needed
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
         <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Changes</Button>
      </form>
    </Form>
  )
}

function StaffList({ staff, isLoading }: { staff: StaffData[] | null, isLoading: boolean }) {
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [editingStaff, setEditingStaff] = useState<StaffData | null>(null);
    const canManage = role === 'Director' || role === 'Administrator';
  
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
          <CardTitle>Existing Staff</CardTitle>
          <CardDescription>Total Staff Found: {staff?.length || 0}</CardDescription>
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
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No staff found in database.
            </div>
          )}
        </CardContent>
      </Card>
      {editingStaff && (
          <Dialog open={!!editingStaff} onOpenChange={(open) => !open && setEditingStaff(null)}>
              <DialogContent><DialogHeader><DialogTitle>Edit Staff</DialogTitle></DialogHeader>
                  <EditStaffForm staff={editingStaff} setOpen={() => setEditingStaff(null)} onSuccess={() => {}} />
              </DialogContent>
          </Dialog>
      )}
      </>
    );
  }

// --- MAIN PAGE CONTENT ---
function StaffPageContent() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useAuth(); 
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- DIAGNOSTIC STATE ---
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // REAL-TIME LISTENER
  useEffect(() => {
    if (isUserLoading) return;
    if (!user || !firestore) {
        setIsLoadingData(false);
        return;
    }
    
    setIsLoadingData(true);
    console.log("🔄 Listening to 'staff' collection...");

    const q = collection(firestore, 'staff');

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const staffList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StaffData));
        console.log(`✅ Listener Active. Found ${staffList.length} staff.`);
        setStaff(staffList);
        setIsLoadingData(false);
    }, (error) => {
        console.error("❌ Listener Error:", error);
        toast({ variant: "destructive", title: "Database Access Error", description: error.message });
        setIsLoadingData(false);
    });

    return () => unsubscribe();
  }, [firestore, user, isUserLoading, toast]);

  // DEBUG HELPER: Add Dummy Data
  const addDebugUser = async () => {
      try {
          await addDoc(collection(firestore, 'staff'), {
              firstName: "Debug",
              lastName: "User",
              email: "debug@test.com",
              role: "Teacher",
              createdAt: serverTimestamp()
          });
          toast({ title: "Debug User Added", description: "Check if it appears in the list below." });
      } catch (e: any) {
          toast({ variant: "destructive", title: "Failed to Add", description: e.message });
      }
  };

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
      
      {/* --- SYSTEM CHECK CARD (Remove after fixing) --- */}
      <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
              <CardTitle className="text-blue-800 flex items-center gap-2 text-sm">
                  <ShieldCheck className="h-4 w-4"/> System Check
              </CardTitle>
          </CardHeader>
          <CardContent className="text-xs font-mono text-blue-900 space-y-1">
              <div><strong>Connected to Project:</strong> {firestore?.app.options.projectId}</div>
              <div><strong>User Authenticated:</strong> {user ? "YES" : "NO"}</div>
              <div><strong>Current List Count:</strong> {staff.length}</div>
              
              <Button onClick={addDebugUser} size="sm" variant="outline" className="mt-2 bg-white border-blue-300 text-blue-700 hover:bg-blue-100">
                  <Database className="h-3 w-3 mr-2"/> Force Add Test Staff (Debug)
              </Button>
          </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Staff</CardTitle>
          <CardDescription>Create account and assign role.</CardDescription>
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
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Staff
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <StaffList staff={staff} isLoading={isLoadingData} />
    </div>
  );
}

export default function StaffPage() {
    return (
        <StaffPageContent />
    )
}
