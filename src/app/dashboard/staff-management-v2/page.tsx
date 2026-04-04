
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, where, getDoc, deleteField } from 'firebase/firestore';
import { UserRole, STAFF_ROLES } from '@/lib/types';
import { createNewUser } from '@/app/actions/create-user';
import { useCurrentSchool } from '@/hooks/use-current-school'; 
import { cn } from '@/lib/utils';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserCog, UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, Globe, GraduationCap, Heart, FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { StudentSearchInput } from '@/components/student-search';
import { searchStudent } from '@/lib/student-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// --- TYPE DEFINITIONS ---
type StaffMember = {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  publicPhotoUrl?: string;
  publicBio?: string;
  qualifications?: string;
  interests?: string;
  showOnWebsite?: boolean;
};

// --- MAIN PAGE COMPONENT ---
export default function StaffManagementPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId: adminSchoolId, loading: isLoadingSchoolId } = useCurrentSchool();

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('Teacher');
  
  // Edit State (Controlled for components that don't play well with FormData)
  const [editRole, setEditRole] = useState<UserRole>('Teacher');
  const [editShowOnWebsite, setEditShowOnWebsite] = useState(false);

  // --- DATA FETCHING ---
  const loadData = useCallback(async () => {
    if (!firestore || !adminSchoolId) return;
    
    setIsLoadingData(true);
    try {
      const q = query(
        collection(firestore, 'staff'), 
        where('schoolId', '==', adminSchoolId),
        where('role', 'in', STAFF_ROLES)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as StaffMember[];
      setStaff(data);
    } catch (err: any) {
      console.error("Error loading staff data:", err);
      toast({ variant: 'destructive', title: "Error", description: err.message });
    } finally {
      setIsLoadingData(false);
    }
  }, [firestore, adminSchoolId, toast]);

  useEffect(() => {
    if (adminSchoolId) {
      loadData();
    }
  }, [loadData, adminSchoolId]);


  // Reset form state when Add modal opens
  useEffect(() => {
    if (isAddOpen) {
      setIsSubmitting(false);
      setNewStaffRole('Teacher');
    }
  }, [isAddOpen]);

  // Sync edit state when modal opens
  useEffect(() => {
    if (editingStaff) {
        setIsSubmitting(false);
        setEditRole(editingStaff.role);
        setEditShowOnWebsite(!!editingStaff.showOnWebsite);
    }
  }, [editingStaff]);

  // --- ADD STAFF ---
  const handleAddStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !firestore || !adminSchoolId) return;
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());
    const firstName = (values.firstName as string) || '';
    const lastName = (values.lastName as string) || '';
    const email = (values.email as string) || '';
    const password = "password123";

    try {
      const result = await createNewUser(
        email, 
        password, 
        newStaffRole, 
        { firstName, lastName },
        adminSchoolId
      );
      
      if ('error' in result) throw new Error(result.error);

      toast({ title: "Success", description: `Staff member ${firstName} added.` });
      setIsAddOpen(false);
      loadData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UPDATE STAFF ---
  const handleUpdateStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStaff || isSubmitting || !firestore) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    
    // Captured from state because Select/Switch don't use standard native form fields
    const role = editRole;
    const showOnWebsite = editShowOnWebsite;
    
    // Public profile fields
    const publicPhotoUrl = formData.get('publicPhotoUrl') as string;
    const publicBio = formData.get('publicBio') as string;
    const qualifications = formData.get('qualifications') as string;
    const interests = formData.get('interests') as string;

    try {
        const staffRef = doc(firestore, 'staff', editingStaff.id);
        await updateDoc(staffRef, { 
            firstName, 
            lastName, 
            role,
            showOnWebsite,
            publicPhotoUrl,
            publicBio,
            qualifications,
            interests,
            updatedAt: serverTimestamp()
        });
        
        // Also update user record role mapping
        const userRef = doc(firestore, 'users', editingStaff.id);
        await updateDoc(userRef, { role });

        toast({ title: "Updated", description: `${firstName}'s details have been saved.` });
        setEditingStaff(null);
        loadData();
    } catch (error: any) {
        console.error("Update Error:", error);
        toast({ variant: 'destructive', title: "Error", description: "Failed to update staff member." });
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- DELETE STAFF ---
  const handleDelete = async (id: string) => {
    if (!firestore || !confirm("Delete this staff member? This action cannot be undone.")) return;
    try {
      await deleteDoc(doc(firestore, 'staff', id));
      toast({ title: "Deleted", description: "Staff member removed." });
      loadData();
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Error", description: e.message });
    }
  };

  const filteredStaff = staff.filter(s =>
    ((s.firstName || '') + ' ' + (s.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const overallLoading = isLoadingSchoolId || isLoadingData;

  return (
    <div className="space-y-6 p-6">
      <Card className="border-t-4 border-t-purple-500 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <UserCog className="h-6 w-6 text-purple-500"/> Staff Management
                </CardTitle>
                <CardDescription>
                    {adminSchoolId ? `Total Staff: ${staff.length}` : "Loading School Data..."}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                 <Button variant="outline" onClick={loadData} disabled={overallLoading || !adminSchoolId}>
                    <RefreshCw className={cn("h-4 w-4 mr-2", overallLoading && "animate-spin")}/> Refresh
                </Button>
                <Button onClick={() => setIsAddOpen(true)} className="bg-purple-600 hover:bg-purple-700" disabled={!adminSchoolId}>
                    <UserPlus className="h-4 w-4 mr-2"/> Add Staff
                </Button>
            </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-8" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {overallLoading ? (
            <div className="py-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-500"/></div>
          ) : filteredStaff.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                {adminSchoolId ? "No staff found for this school." : "Loading..."}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.firstName} {member.lastName}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell><Badge variant="secondary">{member.role}</Badge></TableCell>
                      <TableCell>
                        {member.showOnWebsite ? (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Public</Badge>
                        ) : (
                            <Badge variant="outline" className="bg-slate-50 text-slate-400">Private</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                           <Button variant="ghost" size="sm" onClick={() => setEditingStaff(member)}><Edit className="h-4 w-4 text-blue-600"/></Button>
                           <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ADD MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Add New Staff Member</DialogTitle></DialogHeader>
            <form onSubmit={handleAddStaff} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>First Name</Label><Input name="firstName" required placeholder="John"/></div>
                    <div className="space-y-2"><Label>Last Name</Label><Input name="lastName" required placeholder="Doe"/></div>
                </div>
                <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" required placeholder="staff@school.com"/></div>
                <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={newStaffRole} onValueChange={(value) => setNewStaffRole(value as UserRole)}>
                        <SelectTrigger><SelectValue placeholder="Assign a role" /></SelectTrigger>
                        <SelectContent>{STAFF_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Create Staff Account"}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
      
      {/* EDIT MODAL */}
      <Dialog open={!!editingStaff} onOpenChange={(open) => !open && setEditingStaff(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Edit Staff Member</DialogTitle></DialogHeader>
            {editingStaff && (
                <form onSubmit={handleUpdateStaff} className="mt-4">
                    <Tabs defaultValue="basic" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger value="public" className="gap-2">
                                <Globe className="h-3 w-3" /> Public Profile
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>First Name</Label><Input name="firstName" defaultValue={editingStaff.firstName} required /></div>
                                <div className="space-y-2"><Label>Last Name</Label><Input name="lastName" defaultValue={editingStaff.lastName} required /></div>
                            </div>
                            <div className="space-y-2"><Label>Email</Label><Input value={editingStaff.email} disabled className="bg-slate-100" /></div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Select value={editRole} onValueChange={(v: any) => setEditRole(v)}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>{STAFF_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        <TabsContent value="public" className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <div className="space-y-0.5">
                                    <Label className="text-indigo-900">Show on Website</Label>
                                    <p className="text-xs text-indigo-600">Make this profile visible on the public microsite.</p>
                                </div>
                                <Switch 
                                    checked={editShowOnWebsite} 
                                    onCheckedChange={setEditShowOnWebsite} 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Globe className="h-3 w-3"/> Public Photo URL</Label>
                                <Input name="publicPhotoUrl" defaultValue={editingStaff.publicPhotoUrl} placeholder="https://..." />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><GraduationCap className="h-3 w-3"/> Qualifications</Label>
                                <Input name="qualifications" defaultValue={editingStaff.qualifications} placeholder="e.g. B.Ed Mathematics, M.Sc Education" />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Heart className="h-3 w-3"/> Interests & Skills</Label>
                                <Input name="interests" defaultValue={editingStaff.interests} placeholder="e.g. Chess, Robotics, Football (Comma separated)" />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><FileText className="h-3 w-3"/> Public Biography</Label>
                                <Textarea name="publicBio" defaultValue={editingStaff.publicBio} placeholder="Tell parents about this staff member's experience and passion..." rows={4} />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="pt-6 border-t mt-6">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Save Changes"}</Button>
                    </DialogFooter>
                </form>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
