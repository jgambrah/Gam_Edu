'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, addDoc, serverTimestamp, setDoc, doc, deleteDoc, query, where, orderBy, updateDoc } from 'firebase/firestore'; 
import { createNewUser } from '@/app/actions/create-user'; 
import { sendSchoolCredentialsEmail } from '@/lib/email';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Building2, Trash2, ArrowRight, UserPlus, Check, Zap } from 'lucide-react'; 
import { Label } from '@/components/ui/label';

type School = { id: string; name: string; plan: string; createdAt: any; aiCredits?: number };
type Lead = { id: string; schoolName: string; contactName: string; email: string; phone: string; status: string; };

export default function SuperAdminPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [schools, setSchools] = useState<School[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);

  // New state for managing credits
  const [creditSchool, setCreditSchool] = useState<School | null>(null);
  const [creditAmount, setCreditAmount] = useState(1000);
  const [updatingCredits, setUpdatingCredits] = useState(false);

  // Form State
  const [schoolName, setSchoolName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null); 

  const loadData = useCallback(async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      // 1. Fetch Schools
      const schoolSnap = await getDocs(collection(firestore, 'schools'));
      setSchools(schoolSnap.docs.map(d => ({ id: d.id, ...d.data() })) as School[]);

      // 2. Fetch Pending Leads
      const leadsQ = query(collection(firestore, 'leads'), where('status', '==', 'pending'));
      const leadSnap = await getDocs(leadsQ);
      setLeads(leadSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Lead[]);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [firestore]);

  useEffect(() => { loadData(); }, [loadData]);
  
  // Set credit amount when opening dialog
  useEffect(() => {
    if (creditSchool) {
      setCreditAmount(creditSchool.aiCredits || 1000);
    }
  }, [creditSchool]);


  // --- POPULATE FUNCTION ---
  const populateFromLead = (lead: Lead) => {
      setSchoolName(lead.schoolName);
      setAdminName(lead.contactName);
      setAdminEmail(lead.email);
      setSelectedLeadId(lead.id); // Mark this lead as being processed
      toast({ title: "Form Filled", description: `Data populated from ${lead.schoolName}` });
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    setCreating(true);

    try {
      // A. Create School
      const schoolRef = await addDoc(collection(firestore, 'schools'), {
        name: schoolName,
        plan: 'Trial', 
        status: 'active',
        createdAt: serverTimestamp(),
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 
        isActive: true,
        aiCredits: 1000,
      });

      const newSchoolId = schoolRef.id;

      // B. Create User
      const password = "password123"; 
      const result = await createNewUser(
        adminEmail, password, 'Director', 
        { firstName: adminName, lastName: 'Admin' }, newSchoolId 
      );

      if ('error' in result) throw new Error(result.error);

      // C. Update Profile
      await setDoc(doc(firestore, 'staff', result.uid), {
        uid: result.uid, email: adminEmail, role: 'Director', firstName: adminName, lastName: 'Admin',
        schoolId: newSchoolId, createdAt: serverTimestamp()
      });

      // D. Send Email
      await sendSchoolCredentialsEmail(adminEmail, adminName, schoolName, password);

      // E. CLOSE THE LEAD (If we used one)
      if (selectedLeadId) {
          await updateDoc(doc(firestore, 'leads', selectedLeadId), { status: 'approved' });
      }

      toast({ title: "Success!", description: `Created ${schoolName}` });
      
      // Reset
      setSchoolName(''); setAdminEmail(''); setAdminName(''); setSelectedLeadId(null);
      loadData();

    } catch (error: any) {
      toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
      setCreating(false);
    }
  };

  const confirmDelete = async () => {
    if (!schoolToDelete || !firestore) return;
    setIsDeleting(true);
    try {
        await deleteDoc(doc(firestore, 'schools', schoolToDelete.id));
        toast({ title: "Deleted", description: "School removed." });
        setSchoolToDelete(null);
        loadData();
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Delete Failed", description: error.message });
    } finally {
        setIsDeleting(false);
    }
  };

  // New function to update credits
  const handleUpdateCredits = async () => {
    if (!creditSchool || !firestore) return;
    setUpdatingCredits(true);
    try {
        await updateDoc(doc(firestore, 'schools', creditSchool.id), {
            aiCredits: creditAmount
        });
        toast({ title: "Credits Updated", description: `${creditSchool.name} now has ${creditAmount} credits.` });
        setCreditSchool(null);
        loadData(); 
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    } finally {
        setUpdatingCredits(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold flex items-center gap-2 text-slate-800">
        <Building2 className="h-8 w-8 text-blue-600"/> CEO Command Center
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* LEFT: CREATE FORM */}
          <Card className="border-t-4 border-t-blue-600 shadow-md h-fit">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5"/> Create New School</CardTitle>
                <CardDescription>Manually enter details or select a lead from the list.</CardDescription>
            </CardHeader>
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
                <Button disabled={creating} className="w-full bg-blue-600 hover:bg-blue-700">
                    {creating ? <Loader2 className="animate-spin mr-2"/> : "Generate School Portal"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">Credentials will be emailed automatically.</p>
              </form>
            </CardContent>
          </Card>

          {/* RIGHT: PENDING LEADS */}
          <Card className="border-t-4 border-t-orange-500 shadow-md h-fit">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5"/> Incoming Requests</CardTitle>
                <CardDescription>Leads from your public website form.</CardDescription>
            </CardHeader>
            <CardContent>
                {leads.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                        No pending leads found.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {leads.map(lead => (
                            <div key={lead.id} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition-all">
                                <div>
                                    <p className="font-bold text-sm">{lead.schoolName}</p>
                                    <p className="text-xs text-muted-foreground">{lead.contactName} • {lead.email}</p>
                                </div>
                                <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => populateFromLead(lead)}>
                                    Use This <ArrowRight className="ml-1 h-3 w-3"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
          </Card>
      </div>

      {/* SCHOOL LIST */}
      <Card>
        <CardHeader><CardTitle>Active Schools ({schools.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? <Loader2 className="animate-spin"/> : (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>School Name</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schools.map(s => (
                        <TableRow key={s.id}>
                            <TableCell className="font-bold">{s.name}</TableCell>
                            <TableCell><span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{s.plan}</span></TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 font-mono text-xs bg-slate-100 p-1 rounded w-fit">
                                    <Zap className="h-3 w-3 text-orange-500"/>
                                    {s.aiCredits || 0}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="sm" onClick={() => { setCreditSchool(s); setCreditAmount(s.aiCredits || 0); }}>
                                    <Zap className="h-4 w-4 text-orange-500"/>
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => setSchoolToDelete(s)}
                                >
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* DELETE DIALOG */}
      <Dialog open={!!schoolToDelete} onOpenChange={(open) => !open && setSchoolToDelete(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-red-600">Delete School?</DialogTitle>
                <DialogDescription>
                    This will remove <strong>{schoolToDelete?.name}</strong> from the system. This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setSchoolToDelete(null)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Delete"}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* MANAGE CREDITS DIALOG */}
      <Dialog open={!!creditSchool} onOpenChange={(open) => !open && setCreditSchool(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Manage AI Credits</DialogTitle>
                <DialogDescription>Set or refill the AI credit balance for <strong>{creditSchool?.name}</strong>.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setCreditAmount(prev => prev + 500)}>+500</Button>
                    <Button variant="outline" onClick={() => setCreditAmount(prev => prev + 1000)}>+1k</Button>
                    <Button variant="outline" onClick={() => setCreditAmount(5000)}>Reset to 5k</Button>
                </div>
                 <div>
                    <Label>Credit Amount</Label>
                    <Input type="number" value={creditAmount} onChange={e => setCreditAmount(Number(e.target.value))} />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setCreditSchool(null)}>Cancel</Button>
                <Button onClick={handleUpdateCredits} disabled={updatingCredits} className="bg-purple-600 hover:bg-purple-700">
                    {updatingCredits ? <Loader2 className="animate-spin mr-2"/> : "Save Balance"}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
