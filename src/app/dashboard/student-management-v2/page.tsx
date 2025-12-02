
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, addDoc } from 'firebase/firestore'; // Added addDoc
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
import { UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, GraduationCap, WifiOff, Activity } from 'lucide-react';

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

  // Data
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("Initializing..."); // <--- DEBUG STATUS
  
  // UI State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  
  // Form State
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  // Reset logic
  useEffect(() => {
    if (isAddOpen) { setIsSubmitting(false); setSelectedClassId(''); setSelectedGender(''); }
    if (editingStudent) { setIsSubmitting(false); setSelectedClassId(editingStudent.classId || ''); setSelectedGender(editingStudent.gender || ''); }
  }, [isAddOpen, editingStudent]);

  // --- 1. SELF-HEALING FETCH LOGIC ---
  const fetchData = useCallback(async () => {
    setStatus("Checking Auth...");
    if (isUserLoading) return;

    if (!user) {
        setStatus("Error: Not Logged In");
        setIsLoading(false);
        return;
    }
    if (!firestore) {
        setStatus("Error: Database Not Connected");
        setIsLoading(false);
        return;
    }

    setIsLoading(true);
    
    try {
        // 1. Fetch Classes (Independent)
        setStatus("Loading Classes...");
        console.log("Fetching classes...");
        const classSnap = await getDocs(collection(firestore, 'classes'));
        const classList = classSnap.docs.map((d: any) => ({ id: d.id, name: d.data().name }));
        setClasses(classList);
        console.log(`Classes loaded: ${classList.length}`);

        // 2. Fetch Students
        setStatus("Loading Students...");
        console.log("Fetching students...");
        const studentSnap = await getDocs(collection(firestore, 'students'));
        
        if (studentSnap.empty) {
            setStatus("Collection empty. Creating Test Student...");
            // AUTO-FIX: Create a dummy student if none exist
            await addDoc(collection(firestore, 'students'), {
                firstName: "Test",
                lastName: "Student",
                email: "test.student@school.com",
                classId: "",
                enrollmentStatus: "Active",
                createdAt: serverTimestamp(),
                uid: "test-uid-" + Date.now() 
            });
            setStatus("Created Test Student. Refreshing...");
            // Recursive call to fetch the new student
            const retrySnap = await getDocs(collection(firestore, 'students'));
            const retryList = retrySnap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as Student[];
            setStudents(retryList);
        } else {
            const studentList = studentSnap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as Student[];
            setStudents(studentList);
        }

        setStatus("Ready");
    } catch (err: any) {
        console.error("Fetch Error:", err);
        setStatus(`Error: ${err.message}`);
        toast({ variant: 'destructive', title: "Error", description: err.message });
    } finally {
        setIsLoading(false);
    }
  }, [user, isUserLoading, firestore, toast]);

  useEffect(() => {
      if (!isUserLoading) fetchData();
  }, [isUserLoading, fetchData]);

  // --- ADD STUDENT ---
  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      setStatus("Creating User...");
      
      const formData = new FormData(e.currentTarget);
      const values = Object.fromEntries(formData.entries()) as any;

      try {
          const result = await createNewUser(values.email, "password123", 'Student', { firstName: values.firstName, lastName: values.lastName });
          if ('error' in result) throw new Error(result.error);

          setStatus("Saving to Database...");
          await setDoc(doc(firestore, 'students', result.uid), {
              uid: result.uid,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              classId: selectedClassId,
              gender: selectedGender,
              dateOfBirth: values.dateOfBirth,
              address: values.address,
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

  // --- UPDATE STUDENT ---
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
            classId: selectedClassId,
            gender: selectedGender,
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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete profile?")) return;
    try {
        await deleteDoc(doc(firestore, 'students', id));
        toast({ title: "Deleted" });
        fetchData();
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    }
  };

  const filteredStudents = students.filter(s => 
    ((s.firstName + ' ' + s.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (classFilter === 'all' || s.classId === classFilter)
  );

  return (
    <div className="space-y-6 p-6">
      <Card className="border-t-4 border-t-green-600 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-green-600"/> Student Management
                </CardTitle>
                <CardDescription>
                    Status: <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{status}</span>
                </CardDescription>
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
                <Input placeholder="Search..." className="max-w-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter Class" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="py-10 flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500"/>
                    <p>{status}</p>
                </div>
            ) : status.startsWith("Error") ? (
                <div className="py-10 text-center text-red-500 border border-red-200 bg-red-50 rounded-lg">
                    <Activity className="h-8 w-8 mx-auto mb-2"/>
                    <p>{status}</p>
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
                                    <TableCell><Badge variant="secondary">{classes.find(c => c.id === s.classId)?.name || 'Unassigned'}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => setEditingStudent(s)}><Edit className="h-4 w-4 text-blue-600"/></Button>
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
            <DialogHeader><DialogTitle>Add Student</DialogTitle></DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input name="firstName" required placeholder="First Name"/>
                    <Input name="lastName" required placeholder="Last Name"/>
                </div>
                <Input name="email" type="email" required placeholder="Email"/>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                    <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                    <SelectContent>
                        {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-4">
                    <Input name="dateOfBirth" type="date" />
                    <Select value={selectedGender} onValueChange={setSelectedGender}>
                        <SelectTrigger><SelectValue placeholder="Gender"/></SelectTrigger>
                        <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                    </Select>
                </div>
                <Input name="address" placeholder="Address"/>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Create"}
                </Button>
            </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader><DialogTitle>Edit Student</DialogTitle></DialogHeader>
            {editingStudent && (
                <form onSubmit={handleUpdateStudent} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input name="firstName" defaultValue={editingStudent.firstName} required />
                        <Input name="lastName" defaultValue={editingStudent.lastName} required />
                    </div>
                    <Input value={editingStudent.email} disabled className="bg-slate-100" />
                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                        <SelectTrigger><SelectValue placeholder="Class" /></SelectTrigger>
                        <SelectContent>
                            {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <div className="grid grid-cols-2 gap-4">
                        <Input name="dateOfBirth" type="date" defaultValue={editingStudent.dateOfBirth} />
                        <Select value={selectedGender} onValueChange={setSelectedGender}>
                            <SelectTrigger><SelectValue placeholder="Gender"/></SelectTrigger>
                            <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <Input name="address" defaultValue={editingStudent.address} />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Save Changes"}
                    </Button>
                </form>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
