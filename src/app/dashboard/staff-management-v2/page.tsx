
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useFirestore } from '@/firebase';
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
type ParentMember = {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  studentIds?: string[];
  schoolId?: string;
};

type Student = {
    id: string;
    uid: string;
    firstName: string;
    lastName: string;
};

// --- MAIN PAGE COMPONENT ---
export default function ParentsPage() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [parents, setParents] = useState<ParentMember[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminSchoolId, setAdminSchoolId] = useState<string | null>(null);

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<ParentMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  // --- 1. INITIALIZATION: FIND YOUR SCHOOL ---
  useEffect(() => {
    const fetchAdminProfile = async () => {
        if (!user || !firestore) return;
        try {
            // Check 'staff' collection first (Standard SaaS Admin)
            const staffDoc = await getDoc(doc(firestore, 'staff', user.uid));
            
            if (staffDoc.exists() && staffDoc.data().schoolId) {
                console.log("🏫 School Found:", staffDoc.data().schoolId);
                setAdminSchoolId(staffDoc.data().schoolId);
            } else {
                 // Fallback for CEO/SuperAdmin in 'users' collection
                const userDoc = await getDoc(doc(firestore, 'users', user.uid));
                if (userDoc.exists() && userDoc.data().schoolId) {
                    setAdminSchoolId(userDoc.data().schoolId);
                } else {
                    console.warn("Could not determine school. Please contact support.");
                }
            }
        } catch (error) { console.error("Error fetching admin profile:", error); }
    };
    fetchAdminProfile();
  }, [user, firestore]);

  // --- 2. FETCH DATA (PARENTS & STUDENTS) (FILTERED BY SCHOOL) ---
  const loadData = useCallback(async () => {
    if (!firestore || !adminSchoolId) return; 
    
    setIsLoading(true);
    try {
        const parentQuery = query(collection(firestore, 'parents'), where('schoolId', '==', adminSchoolId));
        const studentQuery = query(collection(firestore, 'students'), where('schoolId', '==', adminSchoolId));

        const [parentSnap, studentSnap] = await Promise.all([
            getDocs(parentQuery),
            getDocs(studentQuery)
        ]);

        const parentList = parentSnap.docs.map(d => ({ id: d.id, ...d.data() })) as ParentMember[];
        const studentList = studentSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Student[];

        setParents(parentList);
        setStudents(studentList);
    } catch (err: any) {
        toast({ variant: 'destructive', title: "Error", description: "Failed to load school data." });
    } finally {
        setIsLoading(false);
    }
  }, [firestore, adminSchoolId, toast]);

  useEffect(() => {
      if(adminSchoolId) loadData();
  }, [loadData, adminSchoolId]);


  // Reset form state when opening modals
  useEffect(() => {
    if (isAddOpen || editingParent) {
        setIsSubmitting(false);
        setStudentSearch('');
    }
  }, [isAddOpen, editingParent]);
  
  // --- 3. ADD PARENT ---
  const handleAddParent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting || !firestore || !adminSchoolId) return;
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const values = Object.fromEntries(formData.entries()) as any;
      const studentIds = formData.getAll('studentIds') as string[];
      const password = "password123";

      try {
          if (studentIds.length > 0) {
            const conflictQuery = query(collection(firestore, 'parents'), where('studentIds', 'array-contains-any', studentIds), where('schoolId', '==', adminSchoolId));
            const conflictSnap = await getDocs(conflictQuery);
            if (!conflictSnap.empty) throw new Error("A selected student is already linked to another parent.");
          }

          const result = await createNewUser(values.email, password, 'Parent', { firstName: values.firstName, lastName: values.lastName }, adminSchoolId);
          if ('error' in result) throw new Error(result.error);

          await setDoc(doc(firestore, 'parents', result.uid), {
              uid: result.uid,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              phone: values.phone,
              address: values.address,
              studentIds: studentIds,
              schoolId: adminSchoolId,
              createdAt: serverTimestamp()
          });

          toast({ title: "Success", description: "Parent created successfully." });
          setIsAddOpen(false);
          loadData();

      } catch (error: any) {
          toast({ variant: 'destructive', title: "Error creating parent", description: error.message });
      } finally {
          setIsSubmitting(false);
      }
  };

  // --- 4. UPDATE PARENT ---
  const handleUpdateParent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingParent || isSubmitting || !firestore || !adminSchoolId) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries()) as any;
    const studentIds = formData.getAll('studentIds') as string[];

    try {
        if (studentIds.length > 0) {
            const conflictQuery = query(collection(firestore, 'parents'), where('studentIds', 'array-contains-any', studentIds), where('schoolId', '==', adminSchoolId));
            const conflictSnap = await getDocs(conflictQuery);
            const actualConflicts = conflictSnap.docs.filter(doc => doc.id !== editingParent.id);
            if (actualConflicts.length > 0) throw new Error("A selected student is already linked to another parent.");
        }

        const parentRef = doc(firestore, 'parents', editingParent.id);
        await updateDoc(parentRef, { ...values, studentIds });

        toast({ title: "Updated", description: "Parent details saved." });
        setEditingParent(null);
        loadData();

    } catch (error: any) {
        toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- 5. DELETE PARENT ---
  const handleDelete = async (id: string) => {
    if (!firestore || !confirm("Delete this parent's profile?")) return;
    try {
        await deleteDoc(doc(firestore, 'parents', id));
        toast({ title: "Deleted" });
        loadData();
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    }
  };

  const filteredParents = parents.filter(p => searchStudent(p, searchTerm));
  const filteredStudentsForModal = students.filter(s => searchStudent(s, studentSearch));

  return (
    <div className="space-y-6 p-6">
      <Card className="border-t-4 border-t-pink-500 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <HeartHandshake className="h-6 w-6 text-pink-500"/> Parent Management
                </CardTitle>
                <CardDescription>
                    Found: {parents.length} | Showing: {filteredParents.length}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={loadData} disabled={isLoading || !adminSchoolId}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}/> Refresh
                </Button>
                <Button onClick={() => setIsAddOpen(true)} className="bg-pink-500 hover:bg-pink-600" disabled={!adminSchoolId}>
                    <UserPlus className="h-4 w-4 mr-2"/> Add Parent
                </Button>
            </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
            <StudentSearchInput 
              value={searchTerm}
              onChange={setSearchTerm}
              className="max-w-sm"
              placeholder="Search parents by name..."
            />

            {isLoading ? (
                <div className="py-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-pink-500"/></div>
            ) : filteredParents.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground border-2 border-dashed rounded-lg">No parents found.</div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Linked Students</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filteredParents.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.firstName} {p.lastName}</TableCell>
                                    <TableCell>{p.email}</TableCell>
                                    <TableCell>{p.studentIds?.length || 0}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => setEditingParent(p)}><Edit className="h-4 w-4 text-blue-600"/></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
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
        <DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Add New Parent</DialogTitle></DialogHeader>
            <form onSubmit={handleAddParent} className="space-y-4 mt-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>First Name *</Label><Input name="firstName" required placeholder="Jane"/></div>
                    <div className="space-y-2"><Label>Last Name *</Label><Input name="lastName" required placeholder="Doe"/></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2"><Label>Email *</Label><Input name="email" type="email" required placeholder="jane.doe@example.com"/></div>
                     <div className="space-y-2"><Label>Phone</Label><Input name="phone" placeholder="024-xxx-xxxx"/></div>
                </div>
                <div className="space-y-2"><Label>Address</Label><Input name="address" placeholder="Residential Address" /></div>
                
                <div className="space-y-2 pt-2">
                    <Label>Link Students</Label>
                    <StudentSearchInput value={studentSearch} onChange={setStudentSearch} />
                    <div className="max-h-48 overflow-y-auto space-y-2 rounded-md border p-4 mt-2">
                        {filteredStudentsForModal.map(s => (
                            <div key={s.id} className="flex items-center space-x-2">
                                <Checkbox id={`add-${s.id}`} name="studentIds" value={s.id} />
                                <Label htmlFor={`add-${s.id}`}>{s.firstName} {s.lastName}</Label>
                            </div>
                        ))}
                         {filteredStudentsForModal.length === 0 && <p className="text-sm text-center text-muted-foreground">No students match your search.</p>}
                    </div>
                </div>

                <DialogFooter><Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Create Parent Account"}</Button></DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={!!editingParent} onOpenChange={(open) => !open && setEditingParent(null)}>
        <DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Edit Parent Details</DialogTitle></DialogHeader>
            {editingParent && (
                <form onSubmit={handleUpdateParent} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>First Name</Label><Input name="firstName" defaultValue={editingParent.firstName} required /></div>
                        <div className="space-y-2"><Label>Last Name</Label><Input name="lastName" defaultValue={editingParent.lastName} required /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Email</Label><Input value={editingParent.email} disabled className="bg-slate-100" /></div>
                        <div className="space-y-2"><Label>Phone</Label><Input name="phone" defaultValue={editingParent.phone} /></div>
                    </div>
                    <div className="space-y-2"><Label>Address</Label><Input name="address" defaultValue={editingParent.address} /></div>

                     <div className="space-y-2 pt-2">
                        <Label>Link Students</Label>
                        <StudentSearchInput value={studentSearch} onChange={setStudentSearch} />
                        <div className="max-h-48 overflow-y-auto space-y-2 rounded-md border p-4 mt-2">
                            {filteredStudentsForModal.map(s => (
                                <div key={s.id} className="flex items-center space-x-2">
                                    <Checkbox id={`edit-${s.id}`} name="studentIds" value={s.id} defaultChecked={editingParent.studentIds?.includes(s.id)} />
                                    <Label htmlFor={`edit-${s.id}`}>{s.firstName} {s.lastName}</Label>
                                </div>
                            ))}
                             {filteredStudentsForModal.length === 0 && <p className="text-sm text-center text-muted-foreground">No students match your search.</p>}
                        </div>
                    </div>
                    <DialogFooter><Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Update Parent Details"}</Button></DialogFooter>
                </form>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
