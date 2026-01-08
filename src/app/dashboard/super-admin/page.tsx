
'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, addDoc, serverTimestamp, setDoc, doc, deleteDoc } from 'firebase/firestore'; 
import { createNewUser } from '@/app/actions/create-user'; 
import { sendCredentialsAction } from '@/app/actions/send-credentials'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Building2, Trash2 } from 'lucide-react'; 

type School = {
  id: string;
  name: string;
  plan: string;
  createdAt: any;
  isActive: boolean;
  trialEndsAt?: any;
};

export default function SuperAdminPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [schoolName, setSchoolName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');

  // 1. Fetch All Schools
  const fetchSchools = async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(firestore, 'schools'));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as School[];
      // Sort by newest first (optional but helpful)
      setSchools(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchools(); }, [firestore]);

  // 2. Create New School Logic
  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    setCreating(true);

    try {
      // Step A: Create School Doc
      const schoolRef = await addDoc(collection(firestore, 'schools'), {
        name: schoolName,
        plan: 'Trial', 
        status: 'active',
        createdAt: serverTimestamp(),
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 
        isActive: true
      });

      const newSchoolId = schoolRef.id;

      // Step B: Create Director User
      const password = "schoolAdmin123"; 
      
      const result = await createNewUser(
        adminEmail,
        password,
        'Director', 
        { firstName: adminName, lastName: 'Admin' },
        newSchoolId 
      );

      if ('error' in result) throw new Error(result.error);

      // Step C: Update Director Profile
      await setDoc(doc(firestore, 'staff', result.uid), {
        uid: result.uid,
        email: adminEmail,
        role: 'Director',
        firstName: adminName,
        lastName: 'Admin',
        schoolId: newSchoolId, 
        createdAt: serverTimestamp()
      });

      // Step D: Send Email
      await sendCredentialsAction(adminEmail, adminName, schoolName, password);

      toast({ title: "Success!", description: `Created ${schoolName} and sent credentials.` });
      
      setSchoolName('');
      setAdminEmail('');
      setAdminName('');
      fetchSchools();

    } catch (error: any) {
      toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
      setCreating(false);
    }
  };

  // 3. DELETE SCHOOL LOGIC
  const handleDeleteSchool = async (schoolId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?\nThis cannot be undone.`)) return;
    if (!firestore) return;

    setDeletingId(schoolId);
    try {
        await deleteDoc(doc(firestore, 'schools', schoolId));
        toast({ title: "Deleted", description: `${name} has been removed.` });
        fetchSchools(); // Refresh list
    } catch (error: any) {
        console.error(error);
        toast({ variant: 'destructive', title: "Delete Failed", description: "Could not delete school." });
    } finally {
        setDeletingId(null);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Building2 className="h-8 w-8 text-purple-600"/> Super Admin Portal (CEO)
      </h1>

      {/* CREATE SCHOOL FORM */}
      <Card className="max-w-xl">
        <CardHeader><CardTitle>Onboard New School</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSchool} className="space-y-4">
            <div>
                <label className="text-sm font-medium">School Name</label>
                <Input required value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="e.g. Galaxy Int. School" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Director Name</label>
                    <Input required value={adminName} onChange={e => setAdminName(e.target.value)} placeholder="John" />
                </div>
                <div>
                    <label className="text-sm font-medium">Director Email</label>
                    <Input required type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="admin@galaxy.com" />
                </div>
            </div>
            <Button disabled={creating} className="w-full bg-purple-600 hover:bg-purple-700">
                {creating ? <Loader2 className="animate-spin mr-2"/> : <Plus className="mr-2 h-4 w-4"/>}
                Create School & Admin
            </Button>
            <p className="text-xs text-muted-foreground text-center">Default Password: schoolAdmin123</p>
          </form>
        </CardContent>
      </Card>

      {/* SCHOOL LIST */}
      <Card>
        <CardHeader><CardTitle>Registered Schools ({schools.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="animate-spin"/> : (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>School Name</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schools.map(s => (
                        <TableRow key={s.id}>
                            <TableCell className="font-bold">{s.name}</TableCell>
                            <TableCell className="font-mono text-xs text-slate-500">{s.id}</TableCell>
                            <TableCell><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{s.plan}</span></TableCell>
                            <TableCell><span className="text-green-600 font-bold text-sm">Active</span></TableCell>
                            <TableCell className="text-right">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteSchool(s.id, s.name)}
                                    disabled={deletingId === s.id}
                                >
                                    {deletingId === s.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4"/>}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
