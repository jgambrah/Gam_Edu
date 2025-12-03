
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, onSnapshot } from 'firebase/firestore';
import { createNewUser } from '@/app/actions/create-user';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, GraduationCap, Database, AlertCircle, Bug } from 'lucide-react';
import { UserRole, ALL_ROLES } from '@/lib/types';


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
};

export default function StaffManagementV2() {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { toast } = useToast();

  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Reset loading state when modals open/close
  useEffect(() => {
    if (isAddOpen || editingStaff) {
        setIsSubmitting(false);
    }
  }, [isAddOpen, editingStaff]);

  // --- 1. FETCH LOGIC (Simplified) ---
  const fetchStaff = useCallback(async () => {
    if (!firestore) return; // Don't wait for user, just firestore

    setIsLoading(true);
    console.log("🔄 Fetching Staff List...");

    try {
        // Basic collection reference (No queries, No sorts)
        const staffCollection = collection(firestore, 'staff');
        const snapshot = await getDocs(staffCollection);
        
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as StaffMember[];

        console.log(`✅ Found ${data.length} staff members.`);
        setStaff(data);
    } catch (err: any) {
        console.error("Fetch Error:", err);
        toast({ variant: 'destructive', title: "Error", description: "Failed to load staff list." });
    } finally {
        setIsLoading(false);
    }
  }, [firestore, toast]);

  // Load on mount
  useEffect(() => {
      if (firestore) {
          fetchStaff();
      }
  }, [firestore, fetchStaff]);

  // --- 2. ADD STAFF LOGIC ---
  const handleAddStaff = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting) return; 
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
          const result = await createNewUser(email, password, role, { firstName, lastName });
          if ('error' in result) throw new Error(result.error);

          // B. Create Firestore Doc
          await setDoc(doc(firestore, 'staff', result.uid), {
              uid: result.uid,
              firstName,
              lastName,
              email,
              role,
              phone,
              gender,
              address,
              createdAt: serverTimestamp()
          });

          toast({ title: "Success", description: `${firstName} added.` });
          setIsAddOpen(false);
          await fetchStaff(); 

      } catch (error: any) {
          toast({ variant: 'destructive', title: "Error", description: error.message });
      } finally {
          setIsSubmitting(false);
      }
  };

  // --- 3. UPDATE STAFF LOGIC ---
  const handleUpdateStaff = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!editingStaff || isSubmitting) return;
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
          
          await updateDoc(staffRef, {
              firstName,
              lastName,
              phone,
              role,
              gender,
              address
          });

          toast({ title: "Updated", description: "Staff details saved successfully." });
          setEditingStaff(null); 
          await fetchStaff(); 

      } catch (error: any) {
          console.error("Update Error:", error);
          toast({ variant: 'destructive', title: "Error", description: "Failed to update staff." });
      } finally {
          setIsSubmitting(false);
      }
  };

  // --- 4. DELETE LOGIC ---
  const handleDelete = async (id: string) => {
      if(!confirm("Delete this staff profile?")) return;
      try {
          await deleteDoc(doc(firestore, 'staff', id));
          toast({ title: "Deleted" });
          fetchStaff(); 
      } catch (e) {
          toast({ variant: 'destructive', title: "Error", description: "Delete failed" });
      }
  };

  // Client-side filtering
  const filteredStaff = staff.filter(s => 
    (s.firstName + ' ' + s.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <Card className="border-t-4 border-t-blue-600 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Users className="h-6 w-6 text-blue-600"/> Staff Management V2
                </CardTitle>
                <CardDescription>Manage teachers and administrators.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={fetchStaff}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}/> Refresh
                </Button>
                <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="h-4 w-4 mr-2"/> Add Staff
                </Button>
            </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search staff..." 
                    className="pl-8 max-w-sm" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="py-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500"/></div>
            ) : filteredStaff.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    No staff found in database.
                </div>
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
                                            <Button variant="ghost" size="sm" onClick={() => setEditingStaff(s)}>
                                                <Edit className="h-4 w-4 text-blue-600"/>
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500"/>
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
