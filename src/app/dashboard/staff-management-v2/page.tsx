
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { logAuditEvent } from '@/lib/audit';
import { collection, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, where, deleteField } from 'firebase/firestore';
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
  RefreshCw, Edit, Globe, GraduationCap, Heart, FileText, Save, KeyRound, BookOpen
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

type Subject = {
    id: string;
    name: string;
    teacherIds: string[];
};

// ═════════════════════════════════════════════════════════════════════════════
export default function StaffManagementPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { profile } = useRole();
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

  // Controlled state for edit modal
  const [editRole, setEditRole] = useState<UserRole>('Teacher');
  const [editShowOnWebsite, setEditShowOnWebsite] = useState(false);

  // ── data loading ───────────────────────────────────────────────────────────
  const subjectsQuery = useMemoFirebase(() => 
    (firestore && adminSchoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', adminSchoolId)) : null, 
    [firestore, adminSchoolId]
  );
  const { data: subjects } = useCollection<Subject>(subjectsQuery);

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

      await logAuditEvent({
        firestore,
        schoolId: adminSchoolId,
        userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
        action: 'ADD_STAFF',
        details: `Created new staff account ${firstName} ${lastName} with role ${newStaffRole}`
      });

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

      await updateDoc(staffRef, updateData);

      const targetUid = editingStaff.uid || editingStaff.id;
      if (targetUid) {
        try {
          await updateDoc(doc(firestore, 'users', targetUid), { role: editRole });
        } catch (userErr) {
          console.warn('Could not sync role to users collection:', userErr);
        }
      }

      await logAuditEvent({
        firestore,
        schoolId: adminSchoolId,
        userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
        action: 'UPDATE_STAFF',
        details: `Updated profile details and configurations for staff ${firstName} ${lastName}`
      });

      toast({ title: 'Saved', description: `${firstName}'s details have been updated.` });
      setEditingStaff(null);
      loadData();
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
    const staffObj = staff.find(m => m.id === id);
    const staffName = staffObj ? `${staffObj.firstName} ${staffObj.lastName}` : `Staff UID ${id}`;
    try {
      await deleteDoc(doc(firestore, 'staff', id));

      await logAuditEvent({
        firestore,
        schoolId: adminSchoolId,
        userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
        action: 'DELETE_STAFF',
        details: `Deleted staff account ${staffName}`
      });

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
    <div className="space-y-8 p-6">
      {/* Premium Indigo/Purple Gradient Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 p-8 md:p-10 text-white shadow-xl shadow-indigo-150/50 dark:shadow-none">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
              <UserCog className="h-3.5 w-3.5 text-purple-200" /> Administration
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">Staff Management</h1>
            <p className="mt-2 text-indigo-100/90 max-w-xl text-sm leading-relaxed">
              Manage accounts and system access configurations for administrative, academic, and operations team members.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 self-start md:self-center shrink-0">
            <Button 
              variant="outline" 
              onClick={loadData} 
              disabled={overallLoading || !adminSchoolId}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white rounded-xl h-11"
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', overallLoading && 'animate-spin')} /> Refresh
            </Button>
            <Button 
              onClick={() => setIsAddOpen(true)} 
              className="bg-white text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 font-bold px-5 h-11 rounded-xl shadow-lg border border-indigo-100" 
              disabled={!adminSchoolId}
            >
              <UserPlus className="h-4.5 w-4.5 mr-2" /> Add Staff Account
            </Button>
          </div>
        </div>

        {/* Dynamic Metric Badges */}
        {adminSchoolId && (
          <div className="relative z-10 mt-8 flex flex-wrap gap-4 border-t border-white/10 pt-6">
            <div className="rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/5">
              <span className="text-[10px] text-indigo-200 uppercase tracking-widest font-black">Total Personnel</span>
              <div className="text-xl font-bold mt-0.5">{staff.length} Active</div>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/5">
              <span className="text-[10px] text-indigo-200 uppercase tracking-widest font-black">Public Directory</span>
              <div className="text-xl font-bold mt-0.5">{staff.filter(s => s.showOnWebsite).length} Listed</div>
            </div>
          </div>
        )}
        
        {/* Glowing Accents */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Table Content container */}
      <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm flex-grow">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search staff by name or email…"
                className="pl-10 h-10 border-slate-200 rounded-xl focus-visible:ring-indigo-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{filteredStaff.length} Records</span>
          </div>

          {overallLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 bg-slate-50 border border-dashed rounded-2xl">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
              <p className="text-xs uppercase font-bold tracking-wider">Loading Personnel Directory...</p>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="py-16 text-center text-slate-400 border border-dashed rounded-2xl bg-slate-50 flex flex-col items-center gap-3">
              <Search className="h-8 w-8 text-slate-300" />
              <div>
                <p className="font-semibold text-slate-700">No personnel records found</p>
                <p className="text-xs mt-1 text-slate-400">Try adjusting your search criteria or add a new team member.</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700 h-12">Name & ID</TableHead>
                    <TableHead className="font-bold text-slate-700 h-12">System Role</TableHead>
                    <TableHead className="font-bold text-slate-700 h-12">Expertise / Classes</TableHead>
                    <TableHead className="font-bold text-slate-700 h-12">Email</TableHead>
                    <TableHead className="text-right font-bold text-slate-700 h-12 px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map(member => {
                      const mySubjects = subjects?.filter(s => s.teacherIds?.includes(member.uid || member.id)) || [];
                      return (
                        <TableRow key={member.id} className="hover:bg-slate-50/40 transition-colors group">
                            <TableCell className="py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold border border-indigo-100/50 text-sm group-hover:scale-105 transition-transform">
                                        {member.firstName?.charAt(0) || '?'}{member.lastName?.charAt(0) || ''}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800">{member.firstName} {member.lastName}</div>
                                        <div className="text-[10px] text-slate-400 font-mono tracking-wider">UID: {member.id.slice(0, 8).toUpperCase()}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="py-4">
                                <Badge variant="secondary" className="font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-100 rounded-md border border-slate-200/50 px-2 py-0.5">
                                    {member.role}
                                </Badge>
                            </TableCell>
                            <TableCell className="py-4">
                                {member.role === 'Teacher' ? (
                                    <div className="flex flex-wrap gap-1 max-w-[240px]">
                                        {mySubjects.length > 0 ? mySubjects.map(s => (
                                            <Badge key={s.id} variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-100 font-black uppercase tracking-widest px-2 py-0.5 rounded">
                                                {s.name}
                                            </Badge>
                                        )) : (
                                            <span className="text-xs text-amber-500 font-medium italic">Unassigned</span>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-xs text-slate-400 italic">N/A</span>
                                )}
                            </TableCell>
                            <TableCell className="py-4 text-slate-600 text-sm font-medium">{member.email}</TableCell>
                            <TableCell className="text-right py-4 px-6">
                                <div className="flex justify-end gap-1.5">
                                    <Button variant="ghost" size="sm" onClick={() => setResetPasswordUser(member)} title="Reset Password" className="h-8.5 w-8.5 p-0 hover:bg-amber-50 hover:text-amber-600 rounded-lg">
                                        <KeyRound className="h-4.5 w-4.5 text-amber-500"/>
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => setEditingStaff(member)} className="h-8.5 w-8.5 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
                                        <Edit className="h-4.5 w-4.5" />
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)} className="h-8.5 w-8.5 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg">
                                        <Trash2 className="h-4.5 w-4.5" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                      );
                  })}
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
                      <Input name="qualifications" defaultValue={editingStaff.qualifications} placeholder="e.g. B.Ed Mathematics" />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2"><Heart className="h-3 w-3" /> Interests & Skills</Label>
                      <Input name="interests" defaultValue={editingStaff.interests} placeholder="e.g. Robotics, Football" />
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
