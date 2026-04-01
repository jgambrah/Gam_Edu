'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, where, deleteField } from 'firebase/firestore';
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, HeartHandshake, Filter, UserCheck } from 'lucide-react';
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
    parentId?: string;
    schoolId?: string;
};

// --- MAIN PAGE COMPONENT ---
export default function ParentsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId: adminSchoolId, loading: isLoadingSchoolId } = useCurrentSchool();

  const [parents, setParents] = useState<ParentMember[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<ParentMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Controlled selection state
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [showOnlyUnlinked, setShowOnlyUnlinked] = useState(false);

  const toggleStudentSelection = (uid: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  // --- 1. FETCH DATA ---
  const loadData = useCallback(async () => {
    if (!firestore || !adminSchoolId) return;
    
    setIsLoadingData(true);
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
        console.error("Load Data Error:", err);
        toast({ variant: 'destructive', title: "Error", description: "Failed to load school data." });
    } finally {
        setIsLoadingData(false);
    }
  }, [firestore, adminSchoolId, toast]);

  useEffect(() => {
      if(adminSchoolId) loadData();
  }, [loadData, adminSchoolId]);

  useEffect(() => {
    if (isAddOpen) {
        setIsSubmitting(false);
        setStudentSearch('');
        setShowOnlyUnlinked(true);
        setSelectedStudentIds([]);
    }
  }, [isAddOpen]);

  useEffect(() => {
    if (editingParent) {
        setIsSubmitting(false);
        setStudentSearch('');
        setShowOnlyUnlinked(true);
        setSelectedStudentIds(editingParent.studentIds || []);
    }
  }, [editingParent]);
  
  // --- 2. ADD PARENT ---
  const handleAddParent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting || !firestore || !adminSchoolId) return; 
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const values = Object.fromEntries(formData.entries()) as any;
      const studentIds = selectedStudentIds;
      const password = "password123";

      try {
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

          for (const studentId of studentIds) {
            const studentRef = doc(firestore, 'students', studentId);
            await updateDoc(studentRef, { parentId: result.uid });
          }

          toast({ title: "Success", description: "Parent created and linked successfully." });
          setIsAddOpen(false);
          loadData();

      } catch (error: any) {
          console.error("Error adding parent:", error);
          toast({ variant: 'destructive', title: "Error creating parent", description: error.message });
      } finally {
          setIsSubmitting(false);
      }
  };

  // --- 3. UPDATE PARENT ---
  const handleUpdateParent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingParent || isSubmitting || !firestore || !adminSchoolId) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries()) as any;
    const studentIds = selectedStudentIds;

    try {
        const parentRef = doc(firestore, 'parents', editingParent.id);
        await updateDoc(parentRef, { 
            firstName: values.firstName,
            lastName: values.lastName,
            phone: values.phone,
            address: values.address,
            studentIds, 
            updatedAt: serverTimestamp() 
        });

        const oldStudentIds = editingParent.studentIds || [];
        const studentsToUnlink = oldStudentIds.filter(id => !studentIds.includes(id));
        const studentsToLink = studentIds.filter(id => !oldStudentIds.includes(id));

        for (const studentId of studentsToUnlink) {
            const studentRef = doc(firestore, 'students', studentId);
            await updateDoc(studentRef, { parentId: deleteField() }); 
        }
        for (const studentId of studentsToLink) {
            const studentRef = doc(firestore, 'students', studentId);
            await updateDoc(studentRef, { parentId: editingParent.uid });
        }

        toast({ title: "Updated", description: "Parent details saved." });
        setEditingParent(null);
        loadData();

    } catch (error: any) {
        console.error("Error updating parent:", error);
        toast({ variant: 'destructive', title: "Error updating parent", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- 4. DELETE PARENT ---
  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'parents', id));
        toast({ title: "Deleted", description: "Parent profile removed." });
        loadData();
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    }
  };

  const filteredParents = useMemo(() => parents.filter(p => searchStudent(p, searchTerm)), [parents, searchTerm]);
  
  const filteredStudentsForModal = useMemo(() => {
      let list = students.filter(s => searchStudent(s, studentSearch));
      if (showOnlyUnlinked) {
          list = list.filter(s => !s.parentId || selectedStudentIds.includes(s.uid) || (editingParent && s.parentId === editingParent.uid));
      }
      return list;
  }, [students, studentSearch, showOnlyUnlinked, editingParent, selectedStudentIds]);

  const overallLoading = isLoadingSchoolId || isLoadingData;

  return (
    <div className="space-y-6 p-6">
      <Card className="border-t-4 border-t-pink-500 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <HeartHandshake className="h-6 w-6 text-pink-500"/> Parent Management
                </CardTitle>
                <CardDescription>
                    {adminSchoolId ? `Total Parents: ${parents.length}` : "Loading School Data..."}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={loadData} disabled={overallLoading || !adminSchoolId}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${overallLoading ? 'animate-spin' : ''}`}/> Refresh
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
              placeholder="Search parents by name or email..."
            />

            {overallLoading ? (
                <div className="py-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-pink-500"/></div>
            ) : filteredParents.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    {adminSchoolId ? "No parents found for this school." : "Loading..."}
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Linked Students</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredParents.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.firstName} {p.lastName}</TableCell>
                                    <TableCell>{p.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-bold">
                                            {p.studentIds?.length || 0} Students
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => setEditingParent(p)}><Edit className="h-4 w-4 text-blue-600"/></Button>
                                            
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4"/></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Remove Parent Profile?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete the profile for <strong>{p.firstName} {p.lastName}</strong>? This will unlink all associated students.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-red-600 hover:bg-red-700">Delete Profile</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Add New Parent</DialogTitle></DialogHeader>
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
                
                <div className="space-y-3 pt-2 border-t mt-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-indigo-600 font-bold">
                            Link Students
                            {selectedStudentIds.length > 0 && (
                                <span className="ml-2 text-xs font-normal text-pink-600">({selectedStudentIds.length} selected)</span>
                            )}
                        </Label>
                        <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                            <Checkbox 
                                id="unlinked-only-add" 
                                checked={showOnlyUnlinked} 
                                onCheckedChange={(v) => setShowOnlyUnlinked(!!v)} 
                            />
                            <Label htmlFor="unlinked-only-add" className="text-xs cursor-pointer text-indigo-700 font-black uppercase tracking-tighter">Only Unlinked</Label>
                        </div>
                    </div>
                    <StudentSearchInput value={studentSearch} onChange={setStudentSearch} placeholder="Search students to link..." />
                    <div className="max-h-48 overflow-y-auto space-y-1 rounded-xl border-2 p-2 mt-2 bg-slate-50/50">
                        {filteredStudentsForModal.length > 0 ? (
                            filteredStudentsForModal.map(s => (
                                <div
                                    key={s.id}
                                    className="flex items-center justify-between p-2.5 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                                    onClick={() => toggleStudentSelection(s.uid)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id={`add-${s.id}`}
                                            checked={selectedStudentIds.includes(s.uid)}
                                            onCheckedChange={() => toggleStudentSelection(s.uid)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="flex flex-col">
                                            <Label htmlFor={`add-${s.id}`} className="cursor-pointer font-bold text-slate-700">{s.firstName} {s.lastName}</Label>
                                            <span className="text-[10px] text-slate-400 font-mono">ID: {s.uid.slice(0,8)}</span>
                                        </div>
                                    </div>
                                    {s.parentId ? (
                                        <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-500 border-slate-200">Linked</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-[10px] bg-orange-50 text-orange-600 border-orange-200 font-bold uppercase tracking-widest">Unlinked</Badge>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center flex flex-col items-center gap-2 opacity-40">
                                <Search className="h-8 w-8 text-slate-300" />
                                <p className="text-xs font-bold uppercase tracking-widest">No matching students</p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="pt-4 border-t"><Button type="submit" className="w-full h-12 text-lg font-bold bg-pink-500 hover:bg-pink-600" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Create Parent Account"}</Button></DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={!!editingParent} onOpenChange={(open) => !open && setEditingParent(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Edit Parent Details</DialogTitle></DialogHeader>
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

                     <div className="space-y-3 pt-2 border-t mt-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-indigo-600 font-bold">
                                Linked Students
                                {selectedStudentIds.length > 0 && (
                                    <span className="ml-2 text-xs font-normal text-pink-600">({selectedStudentIds.length} selected)</span>
                                )}
                            </Label>
                            <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                <Checkbox 
                                    id="unlinked-only-edit" 
                                    checked={showOnlyUnlinked} 
                                    onCheckedChange={(v) => setShowOnlyUnlinked(!!v)} 
                                />
                                <Label htmlFor="unlinked-only-edit" className="text-xs cursor-pointer text-indigo-700 font-black uppercase tracking-tighter">Only Unlinked</Label>
                            </div>
                        </div>
                        <StudentSearchInput value={studentSearch} onChange={setStudentSearch} placeholder="Search students to link..." />
                        <div className="max-h-48 overflow-y-auto space-y-1 rounded-xl border-2 p-2 mt-2 bg-slate-50/50">
                            {filteredStudentsForModal.length > 0 ? (
                                filteredStudentsForModal.map(s => (
                                    <div
                                        key={s.id}
                                        className="flex items-center justify-between p-2.5 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                                        onClick={() => toggleStudentSelection(s.uid)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox 
                                                id={`edit-${s.id}`} 
                                                checked={selectedStudentIds.includes(s.uid)}
                                                onCheckedChange={() => toggleStudentSelection(s.uid)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <div className="flex flex-col">
                                                <Label htmlFor={`edit-${s.id}`} className="cursor-pointer font-bold text-slate-700">{s.firstName} {s.lastName}</Label>
                                                <span className="text-[10px] text-slate-400 font-mono">ID: {s.uid.slice(0,8)}</span>
                                            </div>
                                        </div>
                                        {s.parentId ? (
                                            <Badge variant="outline" className={cn("text-[10px]", s.parentId === editingParent.uid ? "bg-green-100 text-green-700 border-green-200" : "bg-slate-100 text-slate-500 border-slate-200")}>
                                                {s.parentId === editingParent.uid ? "Assigned Here" : "Linked Elsewhere"}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px] bg-orange-50 text-orange-600 border-orange-200 font-bold uppercase tracking-widest">Unlinked</Badge>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center opacity-40">
                                    <p className="text-xs font-bold uppercase tracking-widest">No matching students</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="pt-4 border-t"><Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Save Changes"}</Button></DialogFooter>
                </form>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
