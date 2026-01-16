
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, addDoc, serverTimestamp, setDoc, doc, deleteDoc, updateDoc, query, where, orderBy } from 'firebase/firestore'; 
import { createNewUser } from '@/app/actions/create-user'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Building2, Trash2, Edit, Crown, Clock } from 'lucide-react'; 

type School = {
  id: string;
  name: string;
  plan: string;
  createdAt: any;
  trialEndsAt?: any;
};

type Lead = {
    id: string;
    schoolName: string;
    contactName: string;
    email: string;
};

export default function SuperAdminPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [schools, setSchools] = useState<School[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]); // <-- New state for leads
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [schoolToEdit, setSchoolToEdit] = useState<School | null>(null);
  const [newPlan, setNewPlan] = useState<string>('Trial');

  // Form State
  const [schoolName, setSchoolName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null); // <-- Track selected lead

  // 1. Fetch All Data (Schools & Leads)
  const fetchData = useCallback(async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      const schoolsSnap = await getDocs(query(collection(firestore, 'schools'), orderBy('createdAt', 'desc')));
      const schoolsData = schoolsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as School[];
      setSchools(schoolsData);

      const leadsSnap = await getDocs(query(collection(firestore, 'leads'), where('status', '==', 'pending'), orderBy('createdAt', 'desc')));
      const leadsData = leadsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Lead[];
      setLeads(leadsData);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [firestore]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // 2. Select a lead to pre-fill the form
  const handleSelectLead = (lead: Lead) => {
    setSchoolName(lead.schoolName);
    setAdminEmail(lead.email);
    setAdminName(lead.contactName);
    setSelectedLeadId(lead.id);
    toast({ title: "Lead Loaded", description: `${lead.schoolName} details are ready for creation.` });
  };

  // 3. Create New School Logic (Now updates lead status)
  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    setCreating(true);

    try {
      const schoolRef = await addDoc(collection(firestore, 'schools'), {
        name: schoolName,
        plan: 'Trial', 
        aiCredits: 100,
        status: 'active',
        createdAt: serverTimestamp(),
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 
        isActive: true
      });

      const newSchoolId = schoolRef.id;
      const password = "schoolAdmin123"; 
      
      const result = await createNewUser(
        adminEmail,
        password,
        'Director', 
        { firstName: adminName, lastName: 'Admin' },
        newSchoolId 
      );

      if ('error' in result) throw new Error(result.error);

      await setDoc(doc(firestore, 'staff', result.uid), {
        uid: result.uid,
        email: adminEmail,
        role: 'Director',
        firstName: adminName,
        lastName: 'Admin',
        schoolId: newSchoolId, 
        createdAt: serverTimestamp()
      });

      // --- NEW: Update Lead Status ---
      if (selectedLeadId) {
        await updateDoc(doc(firestore, 'leads', selectedLeadId), { status: 'approved' });
      }

      toast({ title: "Success!", description: `Created ${schoolName} and sent credentials.` });
      
      // Reset form
      setSchoolName('');
      setAdminEmail('');
      setAdminName('');
      setSelectedLeadId(null);
      fetchData(); // Refresh both schools and leads lists

    } catch (error: any) {
      toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
      setCreating(false);
    }
  };

  // Other handlers (update, delete) remain the same...
  const handleUpdatePlan = async () => { /* ... existing code ... */ };
  const confirmDelete = async () => { /* ... existing code ... */ };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Building2 className="h-8 w-8 text-purple-600"/> Super Admin Portal (CEO)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PENDING LEADS CARD */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Leads ({leads.length})</CardTitle>
            <CardDescription>New schools waiting for approval.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Loader2 className="animate-spin"/> : (
              <Table>
                <TableHeader><TableRow><TableHead>School Name</TableHead><TableHead>Contact</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {leads.map(lead => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.schoolName}</TableCell>
                      <TableCell>{lead.contactName}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => handleSelectLead(lead)}>
                          Use Lead
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                   {leads.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No pending leads.</TableCell></TableRow>}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
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
      </div>

      {/* SCHOOL LIST (Existing Component) */}
      <Card>
        <CardHeader><CardTitle>Registered Schools ({schools.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="animate-spin"/> : (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>School Name</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schools.map(s => (
                        <TableRow key={s.id}>
                            <TableCell className="font-bold">
                                {s.name}
                                <div className="text-xs text-muted-foreground font-mono">{s.id}</div>
                            </TableCell>
                            <TableCell>
                                {s.plan === 'Premium' ? (
                                    <span className="flex items-center gap-1 text-green-700 font-bold bg-green-100 px-2 py-1 rounded w-fit text-xs">
                                        <Crown className="h-3 w-3"/> Premium
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-orange-700 font-bold bg-orange-100 px-2 py-1 rounded w-fit text-xs">
                                        <Clock className="h-3 w-3"/> Trial
                                    </span>
                                )}
                            </TableCell>
                            <TableCell><span className="text-green-600 font-bold text-sm">Active</span></TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => {
                                            setSchoolToEdit(s);
                                            setNewPlan(s.plan);
                                        }}
                                    >
                                        <Edit className="h-4 w-4 text-blue-600"/>
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-red-500 hover:bg-red-50"
                                        onClick={() => setSchoolToDelete(s)}
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* DIALOGS (Existing components for edit/delete) */}
      <Dialog open={!!schoolToEdit} onOpenChange={(open) => !open && setSchoolToEdit(null)}>
        {/* ... Edit Dialog Content ... */}
      </Dialog>
      <Dialog open={!!schoolToDelete} onOpenChange={(open) => !open && setSchoolToDelete(null)}>
        {/* ... Delete Dialog Content ... */}
      </Dialog>
    </div>
  );
}
