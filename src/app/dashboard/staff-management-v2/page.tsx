
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useFirestore } from '@/firebase';
// UPDATED IMPORTS: Added 'query', 'where', 'getDoc'
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, where, getDoc } from 'firebase/firestore';
import { UserRole, ALL_ROLES } from '@/lib/types';
import { createNewUser } from '@/app/actions/create-user';

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
import { Users, UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, HeartHandshake } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { StudentSearchInput } from '@/components/student-search';
import { searchStudent } from '@/lib/student-utils';


// --- TYPE DEFINITIONS ---
type StaffMember = {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
  gender?: string;
  address?: string;
  schoolId?: string; // New Field
};

type Student = {
    id: string;
    uid: string;
    firstName: string;
    lastName: string;
};

// --- MAIN PAGE COMPONENT ---
export default function StaffManagementPage() {
  const { user } = useAuth(); // Logged in Director/Admin
  const firestore = useFirestore();
  const { toast } = useToast();

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminSchoolId, setAdminSchoolId] = useState<string | null>(null); // CRITICAL: Your School Key
  
  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // --- 1. INITIALIZATION: FIND YOUR SCHOOL ---
  useEffect(() => {
    const fetchAdminProfile = async () => {
        if (!user || !firestore) return;
        try {
            // We look at YOUR staff profile to see which school you belong to
            const staffDoc = await getDoc(doc(firestore, 'staff', user.uid));
            
            if (staffDoc.exists()) {
                const data = staffDoc.data();
                if (data.schoolId) {
                    console.log("🏫 School Found:", data.schoolId);
                    setAdminSchoolId(data.schoolId);
                } else {
                    console.warn("⚠️ You are not linked to any school. Contact the CEO.");
                }
            } else {
                 // Fallback for CEO or super-admin who might not be in the 'staff' collection
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                if (userDoc.exists() && userDoc.data().schoolId) {
                    setAdminSchoolId(userDoc.data().schoolId);
                } else {
                    console.warn("Could not determine school from staff or user profile.");
                }
            }
        } catch (error) {
            console.error("Error fetching admin profile:", error);
        }
    };
    fetchAdminProfile();
  }, [user, firestore]);

  // --- 2. FETCH STAFF (FILTERED BY SCHOOL) ---
  const fetchStaff = useCallback(async () => {
    if (!firestore || !adminSchoolId) return; // Wait until we know the school
    
    setIsLoading(true);
    try {
        const staffCollection = collection(firestore, 'staff');
        
        // 🔥 THE MAGIC FILTER: Only get staff belonging to THIS school
        const q = query(staffCollection, where('schoolId', '==', adminSchoolId));
        
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as StaffMember[];

        setStaff(data);
    } catch (err: any) {
        console.error(err);
        toast({ variant: 'destructive', title: "Error", description: "Failed to load staff list." });
    } finally {
        setIsLoading(false);
    }
  }, [firestore, adminSchoolId, toast]);

  // Trigger fetch when schoolId is found
  useEffect(() => {
      if(adminSchoolId) fetchStaff();
  }, [fetchStaff, adminSchoolId]);

  // --- 3. CREATE NEW STAFF LOGIC ---
  const handleAddStaff = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting || !adminSchoolId) return;
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const role = formData.get('role') as UserRole;
      const email = formData.get('email') as string;
      const phone = formData.get('phone') as string;
      const gender = formData.get('gender') as string;
      const address = formData.get('address') as string;
      const password = "password123"; 

      try {
          // A. Create Auth User
          const result = await createNewUser(
              email, 
              password, 
              role, 
              { firstName, lastName },
              adminSchoolId
            );
            
          if ('error' in result) throw new Error(result.error);

          // B. Create Firestore Doc in 'staff' collection
          await setDoc(doc(firestore, 'staff', result.uid), {
              uid: result.uid,
              firstName,
              lastName,
              email,
              role,
              phone,
              gender,
              address,
              schoolId: adminSchoolId,
              createdAt: serverTimestamp()
          });

          toast({ title: "Success", description: `${firstName} added to your school.` });
          setIsAddOpen(false);
          fetchStaff(); 

      } catch (error: any) {
          toast({ variant: 'destructive', title: "Error", description: error.message });
      } finally {
          setIsSubmitting(false);
      }
  };

  // --- 4. UPDATE STAFF LOGIC ---
  const handleUpdateStaff = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!editingStaff || isSubmitting || !firestore) return;
      setIsSubmitting(true);

      const formData = new FormData(e.currentTarget);
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const phone = formData.get('phone') as string;
      const role = formData.get('role') as string;
      const gender = formData.get('gender') as string;
      const address = formData.get('address') as string;

      try {
          const staffRef = doc(firestore, 'staff', editingStaff.id);
          
          await updateDoc(staffRef, { firstName, lastName, phone, role, gender, address });

          // Also update the generic 'users' collection if the role changed
          const userRef = doc(firestore, 'users', editingStaff.id);
          await updateDoc(userRef, { role });

          toast({ title: "Updated", description: "Staff details saved." });
          setEditingStaff(null); 
          fetchStaff();

      } catch (error: any) {
          console.error("Update Error:", error);
          toast({ variant: 'destructive', title: "Error", description: "Failed to update staff." });
      } finally {
          setIsSubmitting(false);
      }
  };

  // --- 5. DELETE LOGIC ---
  const handleDelete = async (id: string) => {
      if(!confirm("Delete this staff profile? This cannot be undone.")) return;
      try {
          // This will need an Admin SDK function to delete the Auth user eventually
          await deleteDoc(doc(firestore, 'staff', id));
          await deleteDoc(doc(firestore, 'users', id));
          toast({ title: "Deleted", description: "Staff profile removed." });
          fetchStaff(); 
      } catch (e: any) {
          toast({ variant: 'destructive', title: "Error", description: e.message });
      }
  };

  // Client-side filtering
  const filteredStaff = staff.filter(s => 
    ((s.firstName || '') + ' ' + (s.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
    (roleFilter === 'all' || s.role === roleFilter)
  );
  
  return (
    <div className="space-y-6 p-6">
      <Card className="border-t-4 border-t-purple-600 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Users className="h-6 w-6 text-purple-600"/> Staff Management
                </CardTitle>
                <CardDescription>
                    {adminSchoolId ? `Total Staff: ${staff.length}` : "Loading School Data..."}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={fetchStaff} disabled={isLoading || !adminSchoolId}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}/> Refresh
                </Button>
                <Button 
                    onClick={() => setIsAddOpen(true)} 
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!adminSchoolId}
                >
                    <UserPlus className="h-4 w-4 mr-2"/> Add Staff
                </Button>
            </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
            <div className="flex gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by name or email..." 
                        className="pl-8 max-w-sm" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by Role" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {ALL_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="py-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-purple-500"/></div>
            ) : filteredStaff.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground border-2 border-dashed rounded-lg">No staff found for this school.</div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStaff.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                                    <TableCell>{s.email}</TableCell>
                                    <TableCell>{s.phone || '-'}</TableCell>
                                    <TableCell><Badge variant="outline">{s.role}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => setEditingStaff(s)}><Edit className="h-4 w-4 text-blue-600"/></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
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
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader><DialogTitle>Add New Staff</DialogTitle></DialogHeader>
            <form onSubmit={handleAddStaff} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>First Name *</Label><Input name="firstName" required placeholder="Jane"/></div>
                    <div className="space-y-2"><Label>Last Name *</Label><Input name="lastName" required placeholder="Doe"/></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2"><Label>Email *</Label><Input name="email" type="email" required placeholder="jane@school.com"/></div>
                     <div className="space-y-2"><Label>Phone</Label><Input name="phone" placeholder="024-xxx-xxxx"/></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select name="gender">
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label>Role</Label>
                        <Select name="role" defaultValue="Teacher">
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                {ALL_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Address</Label>
                    <Input name="address" placeholder="Residential Address" />
                </div>

                <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Create Staff Account"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-2">Default password: password123</p>
                </div>
            </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={!!editingStaff} onOpenChange={(open) => !open && setEditingStaff(null)}>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader><DialogTitle>Edit Staff Member</DialogTitle></DialogHeader>
            {editingStaff && (
                <form onSubmit={handleUpdateStaff} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>First Name</Label><Input name="firstName" defaultValue={editingStaff.firstName} required /></div>
                        <div className="space-y-2"><Label>Last Name</Label><Input name="lastName" defaultValue={editingStaff.lastName} required /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Email</Label><Input value={editingStaff.email} disabled className="bg-slate-100" /></div>
                        <div className="space-y-2"><Label>Phone</Label><Input name="phone" defaultValue={editingStaff.phone} /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select name="gender" defaultValue={editingStaff.gender}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Select name="role" defaultValue={editingStaff.role}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {ALL_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Address</Label>
                        <Input name="address" defaultValue={editingStaff.address} />
                    </div>

                    <div className="pt-2">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Update Staff Details"}
                        </Button>
                    </div>
                </form>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

    