
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'; // Imported DialogDescription
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, GraduationCap, WifiOff, AlertCircle } from 'lucide-react';

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
  
  // Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState("Initializing..."); // Detailed status text
  
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

  // --- 1. SAFETY TIMEOUT (Stops the infinite rolling) ---
  useEffect(() => {
      const timer = setTimeout(() => {
          if (isLoading) {
              console.warn("Force stopping spinner due to timeout.");
              setIsLoading(false);
              setLoadingStatus("Timed out. Database may be empty or unreachable.");
          }
      }, 8000); // 8 seconds max wait time

      return () => clearTimeout(timer);
  }, [isLoading]);

  // --- 2. FETCH LOGIC ---
  const fetchData = useCallback(async () => {
    // Step 1: Check Auth
    if (isUserLoading) {
        setLoadingStatus("Waiting for login...");
        return;
    }

    if (!user || !firestore) {
        setIsLoading(false);
        setLoadingStatus("Not connected to system.");
        return;
    }

    setIsLoading(true);
    setLoadingStatus("Connecting to database...");
    
    try {
        // Step 2: Fetch Classes
        setLoadingStatus("Loading Classes...");
        let classList: Class[] = [];
        try {
            const classSnap = await getDocs(collection(firestore, 'classes'));
            classList = classSnap.docs.map((d: any) => ({ id: d.id, name: d.data().name }));
            setClasses(classList);
        } catch (e) {
            console.warn("Classes fetch issue:", e);
        }

        // Step 3: Fetch Students
        setLoadingStatus("Loading Students...");
        const studentSnap = await getDocs(collection(firestore, 'students'));
        
        if (studentSnap.empty) {
            setLoadingStatus("Collection empty. Creating Test Student...");
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
            setStatusMessage("Created Test Student. Refreshing...");
            // Recursive call to fetch the new student
            const retrySnap = await getDocs(collection(firestore, 'students'));
            const retryList = retrySnap.docs.map((d: any) => ({ id: d.id, ...d.data() })) as Student[];
            setStudents(retryList);
        } else {
            const studentList = studentSnap.docs.map((d: any) => ({ 
                id: d.id, 
                ...d.data() 
            })) as Student[];
            setStudents(studentList);
        }

        setLoadingStatus("Ready");

    } catch (err: any) {
        console.error("Fetch Error:", err);
        setLoadingStatus(`Error: ${err.message}`);
        toast({ variant: 'destructive', title: "Error", description: err.message });
    } finally {
        setIsLoading(false);
    }
  }, [user, isUserLoading, firestore, toast]);

  // Trigger Fetch
  useEffect(() => {
      fetchData();
  }, [fetchData]); // Simplified dependency

  // --- 3. FORM ACTIONS ---
  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const email = formData.get('email') as string;

      try {
          const result = await createNewUser(email, "password123", 'Student', { firstName, lastName });
          if ('error' in result) throw new Error(result.error);

          await setDoc(doc(firestore, 'students', result.uid), {
              uid: result.uid,
              firstName,
              lastName,
              email,
              classId: selectedClassId,
              gender: selectedGender,
              dateOfBirth: formData.get('dateOfBirth'),
              address: formData.get('address'),
              enrollmentStatus: 'Active',
              createdAt: serverTimestamp()
          });

          toast({ title: "Success", description: "Student added." });
          setIsAddOpen(false);
          fetchData(); 

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
            classId: selectedClassId,
            gender: selectedGender,
            dateOfBirth: formData.get('dateOfBirth'),
            address: formData.get('address')
        });

        toast({ title: "Updated", description: "Student saved." });
        setEditingStudent(null);
        fetchData();
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
                    {/* Debugging Status Text */}
                    Status: <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{loadingStatus}</span>
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
                        {classes.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="py-12 flex flex-col items-center gap-3 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500"/>
                    <p className="text-sm font-medium">{loadingStatus}</p>
                </div>
            ) : status.startsWith("Error") ? (
                <div className="py-10 text-center text-red-500 border border-red-200 bg-red-50 rounded-lg">
                    <Activity className="h-8 w-8 mx-auto mb-2"/>
                    <p>{loadingStatus}</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg flex flex-col items-center gap-2">
                    <AlertCircle className="h-10 w-10 text-slate-300" />
                    <p>No students found.</p>
                    <p className="text-xs text-slate-400">Click "Add Student" to get started.</p>
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

      {/* ADD MODAL - Fixed DialogDescription Warning */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>Enter the student's details below to create their account.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input name="firstName" required placeholder="First Name"/>
                    <Input name="lastName" required placeholder="Last Name"/>
                </div>
                <Input name="email" type="email" required placeholder="Email"/>
                
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

      {/* EDIT MODAL - Fixed DialogDescription Warning */}
      <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Edit Student Details</DialogTitle>
                <DialogDescription>Update the student's information below.</DialogDescription>
            </DialogHeader>
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

