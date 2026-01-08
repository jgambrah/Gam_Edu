
'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { createNewUser } from '@/app/actions/create-user'; // We reuse your action!
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Building2 } from 'lucide-react';

type School = {
  id: string;
  name: string;
  plan: string;
  createdAt: any;
};

export default function SuperAdminPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

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
      // Step A: Create the School Document FIRST
      const schoolRef = await addDoc(collection(firestore, 'schools'), {
        name: schoolName,
        plan: 'Standard', // Default plan
        createdAt: serverTimestamp(),
        isActive: true
      });

      const newSchoolId = schoolRef.id;

      // Step B: Create the School Director (Admin) User
      // We pass the newSchoolId to link them!
      const password = "schoolAdmin123"; // Default password
      
      const result = await createNewUser(
        adminEmail,
        password,
        'Director', // Top role for the school
        { firstName: adminName, lastName: 'Admin' },
        newSchoolId // <--- PASSING THE SCHOOL ID HERE
      );

      if ('error' in result) throw new Error(result.error);

      // Step C: Ensure the Director is in the 'staff' collection of that school
      await setDoc(doc(firestore, 'staff', result.uid), {
        uid: result.uid,
        email: adminEmail,
        role: 'Director',
        firstName: adminName,
        lastName: 'Admin',
        schoolId: newSchoolId, // LINKED!
        createdAt: serverTimestamp()
      });

      toast({ title: "Success!", description: `Created ${schoolName} with Admin: ${adminEmail}` });
      
      // Reset Form
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schools.map(s => (
                        <TableRow key={s.id}>
                            <TableCell className="font-bold">{s.name}</TableCell>
                            <TableCell className="font-mono text-xs">{s.id}</TableCell>
                            <TableCell>{s.plan}</TableCell>
                            <TableCell><span className="text-green-600 font-bold">Active</span></TableCell>
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
