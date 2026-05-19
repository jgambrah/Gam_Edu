'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { UserRole, STAFF_ROLES } from '@/lib/types';
import { createNewUser } from '@/app/actions/create-user';
import { adminResetUserPassword } from '@/app/actions/admin-reset-password';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  UserCog, UserPlus, Trash2, Loader2, Search,
  RefreshCw, Edit, Globe, GraduationCap, Heart, FileText, Save, KeyRound
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// ─── types ────────────────────────────────────────────────────────────────────
type StaffMember = {
  id: string;       // Firestore document ID (matches Auth UID)
  uid?: string;     
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

// ═════════════════════════════════════════════════════════════════════════════
export default function StaffManagementPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId: adminSchoolId, loading: isLoadingSchoolId } = useCurrentSchool();

  // ── state ──────────────────────────────────────────────────────────────────
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password Reset State
  const [resetPasswordUser, setResetPasswordUser] = useState<any>(null);
  const [newTempPassword, setNewTempPassword] = useState('password123');
  const [isResetting, setIsResetting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('Teacher');

  // Controlled state for edit modal (Select & Switch don't use native form fields well with FormData)
  const [editRole, setEditRole] = useState<UserRole>('Teacher');
  const [editShowOnWebsite, setEditShowOnWebsite] = useState(false);

  // ── data loading ───────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!firestore || !adminSchoolId) return;
    setIsLoadingData(true);
    try {
      const snap = await getDocs(
        query(
          collection(firestore, 'staff'),
          where('schoolId', '==', adminSchoolId),
          where('role', 'in', STAFF_ROLES)
        )
      );
      // Map docs — always ensure showOnWebsite is handled
      const data = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as StaffMember[];
      setStaff(data);
    } catch (err: any) {
      console.error('Error loading staff:', err);
      toast({ variant: 'destructive', title: 'Error loading staff', description: err.message });
    } finally {
      setIsLoadingData(false);
    }
  }, [firestore, adminSchoolId, toast]);

  useEffect(() => {
    if (adminSchoolId) loadData();
  }, [loadData, adminSchoolId]);

  // reset add-modal state
  useEffect(() => {
    if (isAddOpen) {
      setIsSubmitting(false);
      setNewStaffRole('Teacher');
    }
  }, [isAddOpen]);

  // sync edit-modal state
  useEffect(() => {
    if (editingStaff) {
      setIsSubmitting(false);
      setEditRole(editingStaff.role);
      setEditShowOnWebsite(!!editingStaff.showOnWebsite);
    }
  }, [editingStaff]);

  // ── add staff ──────────────────────────────────────────────────────────────
  const handleAddStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting || !firestore || !adminSchoolId) return;
    setIsSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const firstName = fd.get('firstName') as string;
    const lastName  = fd.get('lastName')  as string;
    const email     = fd.get('email')     as string;

    try {
      const result = await createNewUser(email, 'password123', newStaffRole, { firstName, lastName }, adminSchoolId);
      if ('error' in result) throw new Error(result.error);

      toast({ title: 'Staff added', description: `${firstName} ${lastName} has been created.` });
      setIsAddOpen(false);
      loadData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── update staff ───────────────────────────────────────────────────────────
  const handleUpdateStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStaff || isSubmitting || !firestore) return;
    setIsSubmitting(true);

    const fd            = new FormData(e.currentTarget);
    const firstName     = fd.get('firstName')     as string;
    const lastName      = fd.get('lastName')      as string;
    const publicPhotoUrl = fd.get('publicPhotoUrl') as string;
    const publicBio     = fd.get('publicBio')     as string;
    const qualifications = fd.get('qualifications') as string;
    const interests     = fd.get('interests')     as string;

    try {
      const staffRef = doc(firestore, 'staff', editingStaff.id);
      const updateData = {
        firstName,
        lastName,
        role: editRole,
        showOnWebsite: editShowOnWebsite,
        publicPhotoUrl: publicPhotoUrl || '',
        publicBio:      publicBio      || '',
        qualifications: qualifications || '',
        interests:      interests      || '',
        updatedAt: serverTimestamp(),
      };

      // 1. Update the staff document
      await updateDoc(staffRef, updateData);

      // 2. Sync role to users mapping (using UID stored in the staff doc)
      const targetUid = editingStaff.uid || editingStaff.id;
      if (targetUid) {
        try {
          await updateDoc(doc(firestore, 'users', targetUid), { role: editRole });
        } catch (userErr) {
          console.warn('Could not sync role to users collection:', userErr);
        }
      }

      // 3. Update local state directly so the UI reflects changes instantly
      setStaff(prev =>
        prev.map(m =>
          m.id === editingStaff.id
            ? {
                ...m,
                firstName,
                lastName,
                role: editRole,
                showOnWebsite: editShowOnWebsite,
                publicPhotoUrl,
                publicBio,
                qualifications,
                interests,
              }
            : m
        )
      );

      toast({ title: 'Saved', description: `${firstName}'s details have been updated.` });
      setEditingStaff(null);
    } catch (error: any) {
      console.error('Update error:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update staff member.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── delete staff ───────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!firestore || !confirm('Delete this staff member? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(firestore, 'staff', id));
      setStaff(prev => prev.filter(m => m.id !== id));
      toast({ title: 'Deleted', description: 'Staff member removed.' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  };

  // ── filters ────────────────────────────────────────────────────────────────
  const filteredStaff = useMemo(() => {
    return staff.filter(s =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staff, searchTerm]);

  const overallLoading = isLoadingSchoolId || isLoadingData;

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 p-6">
      <Card className="border-t-4 border-t-purple-500 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <UserCog className="h-6 w-6 text-purple-500" /> Staff Management
            </CardTitle>
            <CardDescription>
              {adminSchoolId
                ? `Total Staff: ${staff.length} · Public Profiles: ${staff.filter(s => s.showOnWebsite).length}`
                : 'Loading school data…'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadData} disabled={overallLoading || !adminSchoolId}>
              <RefreshCw className={cn('h-4 w-4 mr-2', overallLoading && 'animate-spin')} /> Refresh
            </Button>
            <Button onClick={() => setIsAddOpen(true)} className="bg-purple-600 hover:bg-purple-700" disabled={!adminSchoolId}>
              <UserPlus className="h-4 w-4 mr-2" /> Add Staff
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email…"
              className="pl-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {overallLoading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground border-2 border-dashed rounded-lg">
              {adminSchoolId ? 'No staff found matching your search.' : 'Loading…'}
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Public Profile</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map(member => (
                    <TableRow key={member.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-semibold">{member.firstName} {member.lastName}</TableCell>
                      <TableCell className="text-slate-500">{member.email}</TableCell>
                      <TableCell><Badge variant="secondary" className="font-bold">{member.role}</Badge></TableCell>
                      <TableCell>
                        {member.showOnWebsite ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase text-[9px] font-black tracking-widest">
                            Live
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-slate-50 text-slate-400 uppercase text-[9px] font-black tracking-widest">
                            Private
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setResetPasswordUser(member)} title="Reset Password">
                              <KeyRound className="h-4 w-4 text-orange-500"/>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditingStaff(member)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* ── ADD MODAL ─────────────────────────────────────────────────────────── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add New Staff Member</DialogTitle></DialogHeader>
          <form onSubmit={handleAddStaff} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>First Name</Label><Input name="firstName" required placeholder="Jane" /></div>
              <div className="space-y-2"><Label>Last Name</Label><Input name="lastName" required placeholder="Doe" /></div>
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input name="email" type="email" required placeholder="staff@school.com" />
            </div>
            <div className="space-y-2">
              <Label>Role Assignment</Label>
              <Select value={newStaffRole} onValueChange={v => setNewStaffRole(v as UserRole)}>
                <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                <SelectContent>{STAFF_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-lg font-bold" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="mr-2 h-4 w-4"/>}
                Create Staff Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── EDIT MODAL ────────────────────────────────────────────────────────── */}
      <Dialog open={!!editingStaff} onOpenChange={open => !open && setEditingStaff(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Staff Member</DialogTitle></DialogHeader>

          {editingStaff && (
            <form onSubmit={handleUpdateStaff} className="mt-4">
              <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Internal Info</TabsTrigger>
                  <TabsTrigger value="public" className="gap-2">
                    <Globe className="h-3 w-3" /> Public Profile
                  </TabsTrigger>
                </TabsList>

                {/* ── basic tab ── */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input name="firstName" defaultValue={editingStaff.firstName} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input name="lastName" defaultValue={editingStaff.lastName} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={editingStaff.email} disabled className="bg-slate-100 cursor-not-allowed" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Email is used for authentication and cannot be changed.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>System Role</Label>
                    <Select value={editRole} onValueChange={v => setEditRole(v as UserRole)}>
                      <SelectTrigger className="border-2"><SelectValue /></SelectTrigger>
                      <SelectContent>{STAFF_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                {/* ── public profile tab ── */}
                <TabsContent value="public" className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="space-y-0.5">
                      <Label className="text-indigo-900 font-black uppercase text-[10px] tracking-widest">Show on Microsite</Label>
                      <p className="text-xs text-indigo-600 font-medium">
                        {editShowOnWebsite
                          ? 'This member is currently listed on your public website.'
                          : 'This member is hidden from the public website.'}
                      </p>
                    </div>
                    <Switch checked={editShowOnWebsite} onCheckedChange={setEditShowOnWebsite} />
                  </div>

                  <div className={cn("space-y-4 pt-2 transition-all", !editShowOnWebsite && "opacity-40")}>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Globe className="h-3 w-3" /> Public Photo URL</Label>
                      <Input name="publicPhotoUrl" defaultValue={editingStaff.publicPhotoUrl} placeholder="https://…" />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><GraduationCap className="h-3 w-3" /> Qualifications</Label>
                      <Input name="qualifications" defaultValue={editingStaff.qualifications} placeholder="e.g. B.Ed Mathematics, M.Sc Education" />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Heart className="h-3 w-3" /> Interests & Skills</Label>
                      <Input name="interests" defaultValue={editingStaff.interests} placeholder="e.g. Robotics, Football, Chess" />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><FileText className="h-3 w-3" /> Public Biography</Label>
                      <Textarea name="publicBio" defaultValue={editingStaff.publicBio} rows={4}
                        placeholder="A brief introduction for prospective parents…" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="pt-6 border-t mt-6">
                <Button type="button" variant="ghost" onClick={() => setEditingStaff(null)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-[140px] bg-purple-600 hover:bg-purple-700 h-12 font-bold">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4"/>}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* PASSWORD RESET DIALOG */}
      <Dialog open={!!resetPasswordUser} onOpenChange={(open) => !open && setResetPasswordUser(null)}>
          <DialogContent className="sm:max-w-md">
              <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                      Set a temporary password for <strong>{resetPasswordUser?.firstName} {resetPasswordUser?.lastName}</strong>. 
                      They will be forced to change it upon their next login.
                  </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                  <div className="space-y-2">
                      <Label>Temporary Password</Label>
                      <Input 
                          type="text" 
                          value={newTempPassword} 
                          onChange={e => setNewTempPassword(e.target.value)} 
                          minLength={6}
                      />
                  </div>
                  <Button 
                      onClick={async () => {
                          if (!resetPasswordUser || newTempPassword.length < 6) return;
                          setIsResetting(true);
                          
                          const res = await adminResetUserPassword(resetPasswordUser.uid, newTempPassword, 'staff');
                          
                          if (res.success) {
                              toast({ title: "Password Reset", description: `New password is: ${newTempPassword}` });
                              setResetPasswordUser(null);
                          } else {
                              toast({ variant: 'destructive', title: "Error", description: res.error });
                          }
                          setIsResetting(false);
                      }} 
                      disabled={isResetting || newTempPassword.length < 6} 
                      className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                      {isResetting ? <Loader2 className="animate-spin mr-2"/> : <KeyRound className="mr-2 h-4 w-4"/>}
                      Force Password Reset
                  </Button>
              </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}
