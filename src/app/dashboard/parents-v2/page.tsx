
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, query } from 'firebase/firestore';
import { UserRole, ALL_ROLES } from '@/lib/types';
import { createNewUser } from '@/app/actions/create-user';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { HeartHandshake, UserPlus, Trash2, Loader2, Search, RefreshCw, Edit } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

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
};

type Student = {
    id: string;
    uid: string;
    firstName: string;
    lastName: string;
};

// --- MAIN PAGE COMPONENT ---
export default function ParentsV2Page() {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  
  const parentsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'parents')) : null, [user, firestore]);
  const {data: parents, isLoading: isLoadingParents, forceRefetch: forceRefetchParents } = useCollection<ParentMember>(parentsQuery);

  const studentsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'students')) : null, [user, firestore]);
  const {data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<ParentMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAddOpen || editingParent) {
        setIsSubmitting(false);
    }
  }, [isAddOpen, editingParent]);
  
  const handleAddParent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const values = Object.fromEntries(formData.entries()) as any;
      const studentIds = formData.getAll('studentIds') as string[];
      const password = "password123";

      try {
          const result = await createNewUser(values.email, password, 'Parent', { firstName: values.firstName, lastName: values.lastName });
          if ('error' in result) throw new Error(result.error);

          await setDoc(doc(firestore, 'parents', result.uid), {
              uid: result.uid,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              phone: values.phone,
              address: values.address,
              studentIds: studentIds,
              createdAt: serverTimestamp()
          });

          toast({ title: "Success", description: "Parent created successfully." });
          setIsAddOpen(false);
          forceRefetchParents();

      } catch (error: any) {
          toast({ variant: 'destructive', title: "Error creating parent", description: error.message });
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleUpdateParent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingParent || isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries()) as any;
    const studentIds = formData.getAll('studentIds') as string[];

    try {
        const parentRef = doc(firestore, 'parents', editingParent.id);
        await updateDoc(parentRef, { ...values, studentIds });

        toast({ title: "Updated", description: "Parent details saved." });
        setEditingParent(null);
        forceRefetchParents();
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this parent's profile?")) return;
    try {
        await deleteDoc(doc(firestore, 'parents', id));
        toast({ title: "Deleted" });
        forceRefetchParents();
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    }
  };

  const filteredParents = (parents || []).filter(p => 
    (p.firstName + ' ' + p.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const isLoading = isLoadingParents || isLoadingStudents;

  return (
    <div className="space-y-6 p-6">
      <Card className="border-t-4 border-t-pink-500 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <HeartHandshake className="h-6 w-6 text-pink-500"/> Parent Management V2
                </CardTitle>
                <CardDescription>Manage parents and link them to their children.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={forceRefetchParents} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}/> Refresh
                </Button>
                <Button onClick={() => setIsAddOpen(true)} className="bg-pink-500 hover:bg-pink-600">
                    <UserPlus className="h-4 w-4 mr-2"/> Add Parent
                </Button>
            </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search parents..." 
                    className="pl-8 max-w-sm" 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="py-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-pink-500"/></div>
            ) : filteredParents.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground border-2 border-dashed rounded-lg">No parents found in the database.</div>
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
                     <div className="space-y-2"><Label>Phone</Label><Input name="phone" placeholder="123-456-7890"/></div>
                </div>
                <div className="space-y-2"><Label>Address</Label><Input name="address" placeholder="Residential Address" /></div>
                
                <div className="space-y-2 pt-2">
                    <Label>Link Students</Label>
                    <div className="max-h-48 overflow-y-auto space-y-2 rounded-md border p-4">
                        {(students || []).map(s => (
                            <div key={s.id} className="flex items-center space-x-2">
                                <Checkbox id={`add-${s.id}`} name="studentIds" value={s.id} />
                                <Label htmlFor={`add-${s.id}`}>{s.firstName} {s.lastName}</Label>
                            </div>
                        ))}
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
                        <div className="max-h-48 overflow-y-auto space-y-2 rounded-md border p-4">
                            {(students || []).map(s => (
                                <div key={s.id} className="flex items-center space-x-2">
                                    <Checkbox id={`edit-${s.id}`} name="studentIds" value={s.id} defaultChecked={editingParent.studentIds?.includes(s.id)} />
                                    <Label htmlFor={`edit-${s.id}`}>{s.firstName} {s.lastName}</Label>
                                </div>
                            ))}
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
