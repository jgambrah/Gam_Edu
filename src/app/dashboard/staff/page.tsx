
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
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, deleteDoc, updateDoc, getDocs } from 'firebase/firestore'; // Added getDocs
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Loader2, Edit, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { createNewUser } from '@/app/actions/create-user';
import { useRole } from '@/context/role-context';

// --- TYPES & SCHEMAS ---
const formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phone: z.string().optional(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  role: z.enum(ALL_ROLES),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
});

type StaffData = {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
};

// --- COMPONENT: Staff List ---
function StaffList({ staff, isLoading }: { staff: StaffData[] | null, isLoading: boolean }) {
    const { role } = useRole();
    const canManage = role === 'Director' || role === 'Administrator';
  
    if (isLoading) {
      return <div className="space-y-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>;
    }
  
    return (
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
                {staff.map((staffMember) => (
                  <TableRow key={staffMember.id}>
                    <TableCell>{staffMember.firstName} {staffMember.lastName}</TableCell>
                    <TableCell>{staffMember.email}</TableCell>
                    <TableCell>{staffMember.role}</TableCell>
                    {canManage && <TableCell className="text-right">...</TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No staff members found.
            </div>
          )}
        </CardContent>
      </Card>
    );
}

// --- MAIN COMPONENT WITH DIAGNOSTICS ---
export default function StaffPageContent() {
  const firestore = useFirestore();
  const { user } = useAuth(); 
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // DIAGNOSTIC STATE
  const [manualCheckResult, setManualCheckResult] = useState<any>(null);

  // 1. Standard Fetch
  const staffCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'staff'); // Simple query, no sorting
  }, [firestore, user]);

  const { data: staff, isLoading, error } = useCollection<StaffData>(staffCollectionRef);

  // 2. Manual Diagnostic Function
  const runDiagnostics = async () => {
    if (!firestore || !user) return;
    setManualCheckResult("Running check...");
    try {
        console.log("--- STARTING MANUAL FETCH ---");
        const snap = await getDocs(collection(firestore, 'staff'));
        const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        console.log("Raw Firestore Result:", results);
        
        setManualCheckResult({
            success: true,
            count: snap.size,
            projectId: firestore.app.options.projectId,
            firstDoc: snap.size > 0 ? JSON.stringify(results[0], null, 2) : "None"
        });
    } catch (e: any) {
        console.error("Manual Fetch Error:", e);
        setManualCheckResult({
            success: false,
            error: e.message,
            code: e.code
        });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', phone: '', password: 'password123', role: 'Teacher',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
     // (Keep your existing submit logic here, simplified for brevity in this test)
     toast({ title: "Function disabled in Diagnostic Mode" });
  }

  return (
    <div className="space-y-6">
      
      {/* --- DIAGNOSTIC PANEL (Remove this later) --- */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5"/> System Diagnostics
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm font-mono">
            <div><strong>User Auth:</strong> {user ? `Logged in as ${user.email}` : <span className="text-red-500">NOT LOGGED IN</span>}</div>
            <div><strong>Firestore:</strong> {firestore ? "Initialized" : <span className="text-red-500">MISSING</span>}</div>
            <div><strong>Auto-Load Data Length:</strong> {staff ? staff.length : "Undefined"}</div>
            <div><strong>Auto-Load Error:</strong> {error ? <span className="text-red-600">{error.message}</span> : "None"}</div>
            
            <div className="pt-4">
                <Button size="sm" onClick={runDiagnostics} variant="outline" className="bg-white">Run Direct Database Check</Button>
            </div>

            {manualCheckResult && (
                <div className="mt-4 p-4 bg-white rounded border overflow-auto">
                    {manualCheckResult.success ? (
                        <>
                            <p className="text-green-600 font-bold flex gap-2"><CheckCircle2 className="h-4 w-4"/> Connection Successful</p>
                            <p><strong>Project ID:</strong> {manualCheckResult.projectId}</p>
                            <p><strong>Documents Found:</strong> {manualCheckResult.count}</p>
                            <p><strong>Sample Data:</strong></p>
                            <pre className="text-xs">{manualCheckResult.firstDoc}</pre>
                        </>
                    ) : (
                        <>
                            <p className="text-red-600 font-bold">Connection Failed</p>
                            <p>Error: {manualCheckResult.error}</p>
                            <p>Code: {manualCheckResult.code}</p>
                        </>
                    )}
                </div>
            )}
        </CardContent>
      </Card>

      {/* --- NORMAL PAGE CONTENT --- */}
      <StaffList staff={staff} isLoading={isLoading} />
    </div>
  );
}
