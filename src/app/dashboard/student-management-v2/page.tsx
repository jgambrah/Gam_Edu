
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { createNewUser } from '@/app/actions/create-user';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, GraduationCap, WifiOff } from 'lucide-react';

// --- TYPE DEFINITIONS ---
type Student = {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  classId: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
};

type Class = {
    id: string;
    name: string;
};

export default function StudentsManagementV2() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useAuth();
  const { toast } = useToast();

  // Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  // UI State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  // Form State (for Select inputs which are tricky with FormData)
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  // Reset states when modals open/close
  useEffect(() => {
    if (isAddOpen) {
        setIsSubmitting(false);
        setSelectedClassId('');
        setSelectedGender('');
    }
    if (editingStudent) {
        setIsSubmitting(false);
        setSelectedClassId(editingStudent.classId || '');
        setSelectedGender(editingStudent.gender || '');
    }
  }, [isAddOpen, editingStudent]);

  // --- 1. FETCH LOGIC (Robust) ---
  const fetchData = useCallback(async () => {
    if (isUserLoading) return;
    if (!user || !firestore) {
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    setIsError(false);
    console.log("🔄 Fetching Data...");

    try {
        // 1. Fetch Classes (Wrapped in try/catch so it doesn't break the page if empty)
        let classList: Class[] = [];
        try {
            const classSnap = await getDocs(collection(firestore, 'classes'));
            classList = classSnap.docs.map((d: any) => ({ id: d.id, name: d.data().name }));
            setClasses(classList);
        } catch (e) {
            console.warn("⚠️ Could not load classes (collection might be missing):", e);
            // We don't stop execution here; we continue to fetch students
        }

        // 2. Fetch Students
        const studentSnap = await getDocs(collection(firestore, 'students'));
        const studentList = studentSnap.docs.map((d: any) => ({ 
            id: d.id, 
            ...d.data() 
        })) as Student[];

        console.log(`✅ Found ${studentList.length} students.`);
        setStudents(studentList);

    } catch (err: any) {
        console.error("❌ Critical Fetch Error:", err);
        setIsError(true);
        if (err.code !== 'permission-denied') {
             toast({ 
                variant: 'destructive', 
                title: "Connection Error", 
                description: "Failed to load student list." 
            });
        }
    } finally {
        setIsLoading(false);
    }
  }, [user, isUserLoading, firestore, toast]);

  // --- 2. TRIGGER LOAD ---
  useEffect(() => {
      if (!isUserLoading) {
          fetchData();
      }
  }, [isUserLoading, fetchData]);

  // --- 3. FORM ACTIONS ---
  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const email = formData.get('email') as string;
      const dateOfBirth = formData.get('dateOfBirth') as string;
      const address = formData.get('address') as string;
      const password = "password123";

      try {
          // Create Auth User
          const result = await createNewUser(email, password, 'Student', { firstName, lastName });
          if ('error' in result) throw new Error(result.error);

          // Create Firestore Document
          await setDoc(doc(firestore, 'students', result.uid), {
              uid: result.uid,
              firstName: firstName,
              lastName: lastName,
              email: email,
              classId: selectedClassId, // Use state
              gender: selectedGender,   // Use state
              dateOfBirth,
              address,
              enrollmentStatus: 'Active',
              createdAt: serverTimestamp()
          });

          toast({ title: "Success", description: "Student added." });
          setIsAddOpen(false);
          await fetchData(); 

      } catch (error: any) {
          toast({ variant: 'destructive', title: "Error", description: error.message });
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleUpdateStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStudent || isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
        const studentRef = doc(firestore, 'students', editingStudent.id);
        await updateDoc(studentRef, {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            classId: selectedClassId, // Use state
            gender: selectedGender,   // Use state
            dateOfBirth: formData.get('dateOfBirth'),
            address: formData.get('address')
        });

        toast({ title: "Updated", description: "Student saved." });
        setEditingStudent(null);
        await fetchData();
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- 4. DELETE ---
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student profile?")) return;
    try {
        await deleteDoc(doc(firestore, 'students', id));
        toast({ title: "Deleted" });
        fetchData();
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    }
  };

  // Filter Logic
  const filteredStudents = students.filter(s => 
    ((s.firstName + ' ' + s.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (classFilter === 'all' || s.classId === classFilter)
  );

  return (
    <div className="space-y-6 p-6">
      {/* HEADER CARD */}
      <Card className="border-t-4 border-t-green-600 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-green-600"/> Student Management V2
                </CardTitle>
                <CardDescription>View, add, edit, and manage all students.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={fetchData} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}/> Refresh
                </Button>
                <Button onClick={() => setIsAddOpen(true)} className="bg-green-600 hover:bg-green-700">
                    <UserPlus className="h-4 w-4 mr-2"/> Add Student
                </Button>
            </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name or email..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger className="w-full sm:w-[280px]"><SelectValue placeholder="Filter by Class" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {classes.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* LIST STATES */}
            {isLoading ? (
                <div className="py-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-green-500"/></div>
            ) : isError ? (
                <div className="py-10 text-center border-2 border-red-100 bg-red-50 rounded-lg">
                    <WifiOff className="h-10 w-10 text-red-400 mx-auto mb-2"/>
                    <p className="text-red-600 font-semibold">Connection Error</p>
                    <p className="text-xs text-red-500 mt-1">Database not responding. Check your connection.</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    No students found.
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Class</TableHead><TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                                    <TableCell>{s.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {classes.find(c => c.id === s.classId)?.name || 'Unassigned'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => setEditingStudent(s)}>
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
            <DialogHeader><DialogTitle>Add New Student</DialogTitle></DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4 mt-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>First Name *</Label><Input name="firstName" required placeholder="John"/></div>
                    <div className="space-y-2"><Label>Last Name *</Label><Input name="lastName" required placeholder="Smith"/></div>
                </div>
                <div className="space-y-2"><Label>Email *</Label><Input name="email" type="email" required placeholder="john.smith@school.com"/></div>
                
                {/* FIXED: Using State for Select */}
                <div className="space-y-2">
                    <Label>Class</Label>
                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                        <SelectTrigger><SelectValue placeholder="Assign a class" /></SelectTrigger>
                        <SelectContent>
                            {classes.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Date of Birth</Label><Input name="dateOfBirth" type="date" /></div>
                    <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select value={selectedGender} onValueChange={setSelectedGender}>
                            <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                            <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2"><Label>Address</Label><Input name="address" placeholder="123 School Lane"/></div>
                <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Create Student Account"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-2">Default password: password123</p>
                </div>
            </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader><DialogTitle>Edit Student Details</DialogTitle></DialogHeader>
            {editingStudent && (
                <form onSubmit={handleUpdateStudent} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>First Name</Label><Input name="firstName" defaultValue={editingStudent.firstName} required /></div>
                        <div className="space-y-2"><Label>Last Name</Label><Input name="lastName" defaultValue={editingStudent.lastName} required /></div>
                    </div>
                     <div className="space-y-2"><Label>Email</Label><Input value={editingStudent.email} disabled className="bg-slate-100" /></div>
                    
                    {/* FIXED: Using State for Select */}
                    <div className="space-y-2">
                        <Label>Class</Label>
                        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                            <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                            <SelectContent>
                                {classes.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Date of Birth</Label><Input name="dateOfBirth" type="date" defaultValue={editingStudent.dateOfBirth} /></div>
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select value={selectedGender} onValueChange={setSelectedGender}>
                                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2"><Label>Address</Label><Input name="address" defaultValue={editingStudent.address} /></div>
                    <div className="pt-2">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
