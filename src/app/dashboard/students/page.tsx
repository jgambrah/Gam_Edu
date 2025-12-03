
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
// 1. IMPORT onSnapshot
import { collection, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore'; 
import { createNewUser } from '@/app/actions/create-user';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, GraduationCap, Database, WifiOff } from 'lucide-react';

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

export default function StudentsManagementPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useAuth();
  const { toast } = useToast();

  // Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  
  // Loading State
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  
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


  // --- 1. NEW STRATEGY: REAL-TIME LISTENERS ---
  useEffect(() => {
    if (isUserLoading || !user || !firestore) return;

    setIsDataLoading(true);

    // A. Listen to Classes
    // Using 'onSnapshot' avoids the Promise hang issue
    const unsubClasses = onSnapshot(collection(firestore, 'classes'), 
        (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, name: d.data().name }));
            setClasses(list);
        },
        (error) => {
            console.error("Classes Listener Error:", error);
            // Do not block UI, just log
        }
    );

    // B. Listen to Students
    const unsubStudents = onSnapshot(collection(firestore, 'students'), 
        (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Student[];
            setStudents(list);
            setIsDataLoading(false); // <--- STOP SPINNER HERE
        },
        (error) => {
            console.error("Students Listener Error:", error);
            toast({ variant: 'destructive', title: "Database Error", description: error.message });
            setIsDataLoading(false); // <--- OR STOP SPINNER HERE
        }
    );

    // Cleanup listeners on unmount
    return () => {
        unsubClasses();
        unsubStudents();
    };
  }, [user, isUserLoading, firestore, toast]);


  // --- 2. FORCE INITIALIZE (Backup Plan) ---
  const handleForceInitialize = async () => {
      if (!firestore) return;
      setIsInitializing(true);
      try {
          // Create a Class
          const classRef = await addDoc(collection(firestore, 'classes'), {
              name: "JHS 1",
              createdAt: serverTimestamp()
          });
          
          // Create a Student
          await addDoc(collection(firestore, 'students'), {
              firstName: "Demo",
              lastName: "Student",
              email: "demo@school.com",
              classId: classRef.id,
              enrollmentStatus: 'Active',
              createdAt: serverTimestamp(),
              uid: "demo-" + Date.now()
          });
          toast({ title: "Initialized", description: "Dummy data created." });
      } catch (e: any) {
          toast({ variant: 'destructive', title: "Error", description: e.message });
      } finally {
          setIsInitializing(false);
      }
  };

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
          // Auth Creation
          const result = await createNewUser(email, "password123", 'Student', { firstName, lastName });
          if ('error' in result) throw new Error(result.error);

          // Firestore Creation
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
          // No need to call fetch() - onSnapshot updates automatically!

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
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student profile?")) return;
    try {
        await deleteDoc(doc(firestore, 'students', id));
        toast({ title: "Deleted" });
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
                <CardDescription>View and manage students (Real-time).</CardDescription>
            </div>
            <div className="flex gap-2">
                {/* INITIALIZE BUTTON: Visible if list is empty */}
                {(students.length === 0 && !isDataLoading) && (
                    <Button variant="destructive" onClick={handleForceInitialize} disabled={isInitializing}>
                        {isInitializing ? <Loader2 className="h-4 w-4 animate-spin"/> : <Database className="h-4 w-4 mr-2"/>}
                        Force Initialize DB
                    </Button>
                )}
                
                <Button onClick={() => setIsAddOpen(true)} className="bg-green-600 hover:bg-green-700">
                    <UserPlus className="h-4 w-4 mr-2"/> Add Student
                </Button>
            </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
            {/* NOT LOGGED IN STATE */}
            {!isUserLoading && !user && (
                 <div className="p-4 bg-red-50 text-red-800 rounded-md flex items-center gap-2">
                    <WifiOff className="h-5 w-5"/> You are not logged in. Please refresh the page.
                 </div>
            )}

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

            {isDataLoading ? (
                <div className="py-12 flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500"/>
                    <p>Connecting to database...</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50">
                    <p className="mb-2">No students found.</p>
                    <p className="text-xs">Click <strong>"Force Initialize DB"</strong> above to check connection.</p>
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
            <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>Enter student details.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4 mt-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>First Name *</Label><Input name="firstName" required placeholder="John"/></div>
                    <div className="space-y-2"><Label>Last Name *</Label><Input name="lastName" required placeholder="Smith"/></div>
                </div>
                <div className="space-y-2"><Label>Email *</Label><Input name="email" type="email" required placeholder="john.smith@school.com"/></div>
                
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
                </div>
            </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogDescription>Update student details.</DialogDescription>
            </DialogHeader>
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
                            {classes.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
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

```