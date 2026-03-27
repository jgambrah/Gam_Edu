'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, getDocs, addDoc, serverTimestamp, setDoc, doc, deleteDoc, query, where, orderBy, updateDoc } from 'firebase/firestore'; 
import { createNewUser } from '@/app/actions/create-user'; 
import { sendSchoolCredentialsEmail } from '@/lib/email';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Building2, Trash2, ArrowRight, UserPlus, Zap, Crown, Clock, Video } from 'lucide-react'; 
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

type School = { id: string; name: string; plan: string; createdAt: any; aiCredits?: number };
type Lead = { id: string; schoolName: string; contactName: string; email: string; phone: string; status: string; };

// --- SUB-COMPONENT: TUTORIAL MANAGER ---
function TutorialManager() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState<'General' | 'Finance' | 'Academics' | 'Admin'>('General');
  const [loading, setLoading] = useState(false);

  const tutorialsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'tutorials'), orderBy('createdAt', 'desc')) : null, [firestore]);
  const { data: tutorials, forceRefetch } = useCollection<any>(tutorialsQuery);

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    const ytId = extractYouTubeId(videoUrl);
    if (!ytId) return toast({ variant: 'destructive', title: "Invalid URL", description: "Could not extract YouTube ID." });

    setLoading(true);
    try {
      await addDoc(collection(firestore, 'tutorials'), {
        title,
        description,
        category,
        youtubeId: ytId,
        createdAt: serverTimestamp()
      });
      toast({ title: "Tutorial Added" });
      setTitle(''); setDescription(''); setVideoUrl('');
      forceRefetch();
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Error", description: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !confirm("Delete this tutorial?")) return;
    try {
      await deleteDoc(doc(firestore, 'tutorials', id));
      toast({ title: "Deleted" });
      forceRefetch();
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Error", description: e.message });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="border-t-4 border-t-red-500 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Video className="h-5 w-5 text-red-500"/> Add New Tutorial</CardTitle>
          <CardDescription>Publish a new video guide to the Help Center.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Video Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. How to run Payroll" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={(v: any) => setCategory(v)}>
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Academics">Academics</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>YouTube URL</Label>
              <Input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} required placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            <div className="space-y-2">
              <Label>Short Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} required placeholder="What will users learn in this video?" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Plus className="mr-2 h-4 w-4"/>} Add to Library
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Existing Tutorials ({tutorials?.length || 0})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutorials?.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell className="font-bold">{t.title}</TableCell>
                  <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(t.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!tutorials || tutorials.length === 0) && (
                <TableRow><TableCell colSpan={3} className="text-center py-10 text-slate-400 italic">No tutorials in the library.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// --- MAIN PAGE ---
export default function SuperAdminPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [schools, setSchools] = useState<School[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [creditSchool, setCreditSchool] = useState<School | null>(null);
  const [creditAmount, setCreditAmount] = useState(1000);
  const [updatingCredits, setUpdatingCredits] = useState(false);

  const [planSchool, setPlanSchool] = useState<School | null>(null);
  const [newPlan, setNewPlan] = useState<'Trial' | 'Premium'>('Trial');
  const [updatingPlan, setUpdatingPlan] = useState(false);

  const [schoolName, setSchoolName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null); 

  const loadData = useCallback(async () => {
    if (!firestore) return;
    setLoading(true);
    try {
      const schoolSnap = await getDocs(collection(firestore, 'schools'));
      setSchools(schoolSnap.docs.map(d => ({ id: d.id, ...d.data() })) as School[]);

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
  
  useEffect(() => { if (creditSchool) setCreditAmount(creditSchool.aiCredits || 1000); }, [creditSchool]);
  useEffect(() => { if (planSchool) setNewPlan(planSchool.plan as 'Trial' | 'Premium'); }, [planSchool]);

  const populateFromLead = (lead: Lead) => {
      setSchoolName(lead.schoolName);
      setAdminName(lead.contactName);
      setAdminEmail(lead.email);
      setSelectedLeadId(lead.id);
      toast({ title: "Form Filled", description: `Data populated from ${lead.schoolName}` });
  };

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    setCreating(true);

    try {
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
      const password = "password123"; 
      const result = await createNewUser(
        adminEmail, password, 'Director', 
        { firstName: adminName, lastName: 'Admin' }, newSchoolId 
      );

      if ('error' in result) throw new Error(result.error);

      await setDoc(doc(firestore, 'staff', result.uid), {
        uid: result.uid, email: adminEmail, role: 'Director', firstName: adminName, lastName: 'Admin',
        schoolId: newSchoolId, createdAt: serverTimestamp()
      });

      await sendSchoolCredentialsEmail(adminEmail, adminName, schoolName, password);

      if (selectedLeadId) {
          await updateDoc(doc(firestore, 'leads', selectedLeadId), { status: 'approved' });
      }

      toast({ title: "Success!", description: `Created ${schoolName}` });
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
        toast({ title: "Deleted" });
        setSchoolToDelete(null);
        loadData();
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Delete Failed", description: error.message });
    } finally {
        setIsDeleting(false);
    }
  };

  const handleUpdateCredits = async () => {
    if (!creditSchool || !firestore) return;
    setUpdatingCredits(true);
    try {
        await updateDoc(doc(firestore, 'schools', creditSchool.id), { aiCredits: creditAmount });
        toast({ title: "Credits Updated" });
        setCreditSchool(null);
        loadData(); 
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    } finally {
        setUpdatingCredits(false);
    }
  };
  
  const handleUpdatePlan = async () => {
    if (!planSchool || !firestore) return;
    setUpdatingPlan(true);
    try {
        const schoolRef = doc(firestore, 'schools', planSchool.id);
        const updates: any = { plan: newPlan };
        if (newPlan === 'Premium') {
            updates.trialEndsAt = null;
            updates.status = 'active';
        } else {
            updates.trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
            updates.status = 'active';
        }
        await updateDoc(schoolRef, updates);
        toast({ title: "Plan Updated" });
        setPlanSchool(null);
        loadData();
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    } finally {
        setUpdatingPlan(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold flex items-center gap-2 text-slate-800">
        <Building2 className="h-8 w-8 text-blue-600"/> CEO Command Center
      </h1>

      <Tabs defaultValue="schools" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
          <TabsTrigger value="schools" className="rounded-lg px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Building2 className="h-4 w-4 mr-2"/> School Management
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="rounded-lg px-8 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Video className="h-4 w-4 mr-2"/> Video CMS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schools" className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card className="border-t-4 border-t-blue-600 shadow-md h-fit">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Plus className="h-5 w-5"/> Create New School</CardTitle>
                    <CardDescription>Manually enter details or select a lead.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateSchool} className="space-y-4">
                    <div>
                        <Label>School Name</Label>
                        <Input required value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="e.g. Galaxy Int. School" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Director Name</Label>
                            <Input required value={adminName} onChange={e => setAdminName(e.target.value)} placeholder="John" />
                        </div>
                        <div>
                            <Label>Director Email</Label>
                            <Input required type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} placeholder="admin@galaxy.com" />
                        </div>
                    </div>
                    <Button disabled={creating} className="w-full bg-blue-600 hover:bg-blue-700 h-12">
                        {creating ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : "Generate School Portal"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-t-4 border-t-orange-500 shadow-md h-fit">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5"/> Incoming Requests</CardTitle>
                    <CardDescription>Leads from the website form.</CardDescription>
                </CardHeader>
                <CardContent>
                    {leads.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground bg-slate-50 rounded-lg border border-dashed italic text-sm">
                            No pending leads found.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {leads.map(lead => (
                                <div key={lead.id} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm transition-all group">
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{lead.schoolName}</p>
                                        <p className="text-xs text-slate-400">{lead.contactName} • {lead.email}</p>
                                    </div>
                                    <Button size="sm" variant="ghost" className="text-indigo-600 hover:bg-indigo-50" onClick={() => populateFromLead(lead)}>
                                        Use <ArrowRight className="ml-1 h-3 w-3"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
              </Card>
          </div>

          <Card className="shadow-xl rounded-3xl overflow-hidden border-0 ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50 border-b"><CardTitle>Active School Directory ({schools.length})</CardTitle></CardHeader>
            <CardContent className="p-0">
              {loading ? <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div> : (
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead>School Name</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Credits</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schools.map(s => (
                            <TableRow key={s.id} className="hover:bg-slate-50 transition-colors">
                                <TableCell className="font-bold text-slate-800">{s.name}</TableCell>
                                <TableCell><Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100">{s.plan}</Badge></TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 font-mono text-xs bg-slate-100 px-2 py-1 rounded-full w-fit border border-slate-200">
                                        <Zap className="h-3 w-3 text-orange-500 fill-current"/>
                                        {s.aiCredits || 0}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => { setPlanSchool(s); setNewPlan(s.plan as any); }} title="Change Plan">
                                            <Crown className={`h-4 w-4 ${s.plan === 'Premium' ? 'text-yellow-500' : 'text-slate-400'}`}/>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => { setCreditSchool(s); setCreditAmount(s.aiCredits || 0); }} title="Adjust Credits">
                                            <Zap className="h-4 w-4 text-orange-500"/>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => setSchoolToDelete(s)}>
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
        </TabsContent>

        <TabsContent value="tutorials">
          <TutorialManager />
        </TabsContent>
      </Tabs>
      
      {/* DIALOGS */}
      <Dialog open={!!schoolToDelete} onOpenChange={(open) => !open && setSchoolToDelete(null)}>
        <DialogContent><DialogHeader><DialogTitle className="text-red-600">Delete School?</DialogTitle><DialogDescription>Remove <strong>{schoolToDelete?.name}</strong> from the system. This is permanent.</DialogDescription></DialogHeader>
            <DialogFooter><Button variant="outline" onClick={() => setSchoolToDelete(null)}>Cancel</Button><Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>{isDeleting ? <Loader2 className="animate-spin h-4 w-4"/> : "Confirm Delete"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!creditSchool} onOpenChange={(open) => !open && setCreditSchool(null)}>
         <DialogContent><DialogHeader><DialogTitle>Adjust AI Sparks</DialogTitle><DialogDescription>Modify balance for <strong>{creditSchool?.name}</strong>.</DialogDescription></DialogHeader>
            <div className="py-4 space-y-4">
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCreditAmount(prev => prev + 500)}>+500</Button>
                    <Button variant="outline" size="sm" onClick={() => setCreditAmount(prev => prev + 1000)}>+1k</Button>
                    <Button variant="outline" size="sm" onClick={() => setCreditAmount(5000)}>Set to 5k</Button>
                </div>
                 <div className="space-y-2"><Label>New Balance</Label><Input type="number" value={creditAmount} onChange={e => setCreditAmount(Number(e.target.value))} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setCreditSchool(null)}>Cancel</Button><Button onClick={handleUpdateCredits} disabled={updatingCredits} className="bg-indigo-600">{updatingCredits ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : "Save Balance"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!planSchool} onOpenChange={(open) => !open && setPlanSchool(null)}>
        <DialogContent><DialogHeader><DialogTitle>Subscription Plan</DialogTitle></DialogHeader>
            <div className="py-4 space-y-4">
                <p className="text-sm font-medium">Updating: <strong>{planSchool?.name}</strong></p>
                <div className="flex gap-4">
                    <div onClick={() => setNewPlan('Trial')} className={`flex-1 p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${newPlan === 'Trial' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-slate-100 hover:border-slate-200'}`}><Clock className="mx-auto mb-2 h-6 w-6 text-slate-400"/><h3 className="font-bold">Trial</h3></div>
                    <div onClick={() => setNewPlan('Premium')} className={`flex-1 p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${newPlan === 'Premium' ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200' : 'border-slate-100 hover:border-slate-200'}`}><Crown className="mx-auto mb-2 h-6 w-6 text-yellow-500"/><h3 className="font-bold">Premium</h3></div>
                </div>
            </div>
            <DialogFooter><Button onClick={handleUpdatePlan} disabled={updatingPlan} className="w-full h-12 bg-slate-900">{updatingPlan ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : "Apply Changes"}</Button></DialogFooter>
        </DialogContent>
    </Dialog>
    </div>
  );
}
