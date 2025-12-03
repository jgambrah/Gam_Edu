'use client';

import { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  addDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
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
import { UserPlus, Trash2, Loader2, Search, Edit, GraduationCap, Database, AlertCircle } from 'lucide-react';

// --- TYPES ---
type Student = {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  classId: string;
  gender?: string;
  address?: string;
  dateOfBirth?: string;
  enrollmentStatus?: string;
};

type Class = {
    id: string;
    name: string;
};

export default function StudentsPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useAuth();
  const { toast } = useToast();

  // --- STATE ---
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  // Form State
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  // Reset form state when opening modals
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

  // --- 1. REAL-TIME DATA LISTENERS (The Robust Fix) ---
  useEffect(() => {
    // Wait for auth check to finish
    if (isUserLoading) return;

    // If not logged in or no DB, stop loading
    if (!user || !firestore) {
        setIsLoading(false);
        return;
    }

    setIsLoading(true);

    // Listener 1: Classes
    const unsubClasses = onSnapshot(
        collection(firestore, 'classes'),
        (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, name: d.data().name }));
            setClasses(list);
        },
        (error) => console.warn("Classes Error:", error) // Non-critical, don't block students
    );

    // Listener 2: Students
    const unsubStudents = onSnapshot(
        collection(firestore, 'students'),
        (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Student[];
            setStudents(list);
            setIsLoading(false); // Stop spinner as soon as we connect
        },
        (error) => {
            console.error("Students Error:", error);
            toast({ variant: 'destructive', title: "Connection Error", description: error.message });
            setIsLoading(false);
        }
    );

    // Cleanup
    return () => {
        unsubClasses();
        unsubStudents();
    };
  }, [user, isUserLoading, firestore, toast]);

  // --- 2. FORCE INITIALIZE (For Missing Collections) ---
  const handleForceInitialize = async () => {
      if (!firestore) return;
      setIsInitializing(true);
      try {
          // Create Test Class
          const classRef = await addDoc(collection(firestore, 'classes'), {
              name: "Grade 1 (Test)",
              createdAt: serverTimestamp()
          });
          
          // Create Test Student
          await addDoc(collection(firestore, 'students'), {
              firstName: "Test",
              lastName: "Student",
              email: `test${Date.now()}@school.com`,
              classId: classRef.id,
              enrollmentStatus: 'Active',
              createdAt: serverTimestamp(),
              uid: "test-uid-" + Date.now()
          });

          toast({ title: "Success", description: "Database initialized. List should update." });
      } catch (e: any) {
          toast({ variant: 'destructive', title: "Error", description: e.message });
      } finally {
          setIsInitializing(false);
      }
  };

  // --- 3. ADD STUDENT ---
  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const values = Object.fromEntries(formData.entries()) as any;
      const password = "password123"; // Default password

      try {
          // 1. Create Auth Account
          const result = await createNewUser(values.email, password, 'Student', { 
              firstName: values.firstName, 
              lastName: values.lastName 
          });
          
          if ('error' in result) throw new Error(result.error);

          // 2. Save to Firestore
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

          toast({ title: "Success", description: "Student added successfully." });
          setIsAddOpen(false);
      } catch (error: any) {
          toast({ variant: 'destructive', title: "Error", description: error.message });
      } finally {
          setIsSubmitting(false);
      }
  };

  // --- 4. UPDATE STUDENT ---
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

        toast({ title: "Updated", description: "Student details saved." });
        setEditingStudent(null);
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- 5. DELETE STUDENT ---
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student profile?")) return;
    try {
        await deleteDoc(doc(firestore, 'students', id));
        toast({ title: "Deleted", description: "Profile removed." });
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
      
      <Card className="border-t-4 border-t-blue-600 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-blue-600"/> Students
                </CardTitle>
                <CardDescription>Manage student records and enrollment.</CardDescription>
            </div>
            <div className="flex gap-2">
                {/* INIT BUTTON: Only show if list is empty and not loading */}
                {(students.length === 0 && !isLoading) && (
                    <Button variant="destructive" onClick={handleForceInitialize} disabled={isInitializing}>
                        {isInitializing ? <Loader2 className="h-4 w-4 animate-spin"/> : <Database className="h-4 w-4 mr-2"/>}
                        Force Initialize DB
                    </Button>
                )}
                
                <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <UserPlus className="h-4 w-4 mr-2"/> Add Student
                </Button>
            </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
            {/* FILTERS */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search name or email..." 
                        className="pl-8" 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                    />
                </div>
                <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger className="w-full sm:w-[250px]"><SelectValue placeholder="Filter Class" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {classes.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* DATA TABLE */}
            {isLoading ? (
                <div className="py-12 flex flex-col items-center gap-3 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500"/>
                    <p>Connecting to database...</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50 flex flex-col items-center gap-2">
                    <AlertCircle className="h-10 w-10 text-slate-300" />
                    <p>No students found.</p>
                    <p className="text-xs text-slate-400">If this is your first time, click <strong>"Force Initialize DB"</strong>.</p>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                                    <TableCell>{s.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {classes.find(c => c.id === s.classId)?.name || 'Unassigned'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={s.enrollmentStatus === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-gray-100 text-gray-800'}>
                                            {s.enrollmentStatus || 'Active'}
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

      {/* ADD STUDENT DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>Enter the student's information to create an account.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4 mt-2">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>First Name *</Label><Input name="firstName" required placeholder="John"/></div>
                    <div className="space-y-2"><Label>Last Name *</Label><Input name="lastName" required placeholder="Smith"/></div>
                </div>
                <div className="space-y-2"><Label>Email *</Label><Input name="email" type="email" required placeholder="john.smith@school.com"/></div>
                
                <div className="space-y-2">
                    <Label>Class</Label>
                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                        <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
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
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Create Account"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-2">Default password is <strong>password123</strong></p>
                </div>
            </form>
        </DialogContent>
      </Dialog>

      {/* EDIT STUDENT DIALOG */}
      <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogDescription>Update student profile information.</DialogDescription>
            </DialogHeader>
            {editingStudent && (
                <form onSubmit={handleUpdateStudent} className="space-y-4 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>First Name</Label><Input name="firstName" defaultValue={editingStudent.firstName} required /></div>
                        <div className="space-y-2"><Label>Last Name</Label><Input name="lastName" defaultValue={editingStudent.lastName} required /></div>
                    </div>
                    <div className="space-y-2"><Label>Email</Label><Input value={editingStudent.email} disabled className="bg-slate-100" /></div>
                    
                    <div className="space-y-2">
                        <Label>Class</Label>
                        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                            <SelectTrigger><SelectValue placeholder="Class" /></SelectTrigger>
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
                                <SelectTrigger><SelectValue placeholder="Gender"/></SelectTrigger>
                                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2"><Label>Address</Label><Input name="address" defaultValue={editingStudent.address} /></div>
                    <div className="pt-2">
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
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
