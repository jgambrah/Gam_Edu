
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  addDoc 
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
import { UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, GraduationCap, WifiOff, Bug } from 'lucide-react';

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

export default function StudentsV3Page() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useAuth();
  const { toast } = useToast();

  // --- STATE ---
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  
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
    if (isAddOpen) { setIsSubmitting(false); setSelectedClassId(''); setSelectedGender(''); }
    if (editingStudent) { setIsSubmitting(false); setSelectedClassId(editingStudent.classId || ''); setSelectedGender(editingStudent.gender || ''); }
  }, [isAddOpen, editingStudent]);


  // --- 1. DIRECT DATA FETCH ---
  const loadData = useCallback(async () => {
    if (isUserLoading || !user || !firestore) {
        setIsLoading(false);
        return;
    }

    setIsLoading(true);

    try {
        const [classSnap, studentSnap] = await Promise.all([
            getDocs(collection(firestore, 'classes')),
            getDocs(collection(firestore, 'students'))
        ]);

        const classList = classSnap.docs.map(d => ({ id: d.id, name: d.data().name || "Unknown" })) as Class[];
        setClasses(classList);

        const studentList = studentSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Student[];
        setStudents(studentList);
        
    } catch (err: any) {
        console.error("Load Error:", err);
        toast({ variant: 'destructive', title: "Error", description: err.message });
    } finally {
        setIsLoading(false);
    }
  }, [user, isUserLoading, firestore, toast]);

  // Trigger load on mount
  useEffect(() => {
      loadData();
  }, [loadData]);


  // --- 2. DEBUGGING TOOL (CONSOLE ONLY) ---
  const debugDatabase = async () => {
      console.log("--- STARTING DEBUG ---");
      if (!firestore) {
          toast({ variant: 'destructive', title: "Debug Error", description: "Firestore not initialized."});
          return;
      }
      try {
          // Check Classes
          console.log("🔎 Checking 'classes' collection...");
          const classSnap = await getDocs(collection(firestore, 'classes'));
          console.log(`Result: Found ${classSnap.size} class documents.`);
          
          if (classSnap.empty) {
              console.warn("⚠️ 'classes' collection is empty! Dropdown will be empty.");
          } else {
              classSnap.docs.forEach(d => console.log("Class Doc:", d.id, d.data()));
          }
          toast({ title: "Debug", description: `Found ${classSnap.size} classes. Check console for details.` });
          
      } catch (e: any) {
          console.error("Debug Error:", e);
          toast({ variant: 'destructive', title: "Debug Failed", description: e.message });
      }
  };


  // --- FORM ACTIONS ---
  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const email = formData.get('email') as string;

      try {
          const result = await createNewUser(email, "password123", 'Student', { 
              firstName: firstName, 
              lastName: lastName 
          });
          
          if ('error' in result) throw new Error(result.error);

          await setDoc(doc(firestore, 'students', result.uid), {
              uid: result.uid,
              firstName: firstName,
              lastName: lastName,
              email: email,
              classId: selectedClassId,
              gender: selectedGender,
              dateOfBirth: formData.get('dateOfBirth'),
              address: formData.get('address'),
              enrollmentStatus: 'Active',
              createdAt: serverTimestamp()
          });

          toast({ title: "Success", description: "Student added." });
          setIsAddOpen(false);
          await loadData(); 

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
        await loadData(); 
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
        toast({ title: "Deleted", description: "Profile removed." });
        await loadData(); 
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    }
  };

  const filteredStudents = students.filter(s => {
    const first = (s.firstName || '').toLowerCase();
    const last = (s.lastName || '').toLowerCase();
    const email = (s.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    const sClassId = s.classId || 'unassigned';

    const matchesSearch = first.includes(term) || last.includes(term) || email.includes(term);
    const matchesClass = classFilter === 'all' || sClassId === classFilter;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 p-6">
      
      <Card className="border-t-4 border-t-purple-600 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-purple-600"/> Student Roster V3
                </CardTitle>
                <CardDescription>
                    Found: {students.length} | Showing: {filteredStudents.length}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={loadData} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}/> Refresh
                </Button>
                
                <Button variant="secondary" onClick={debugDatabase} className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200">
                    <Bug className="h-4 w-4 mr-2"/> Check Data
                </Button>
                
                <Button onClick={() => setIsAddOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="h-4 w-4 mr-2"/> Add Student
                </Button>
            </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
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
                    <SelectTrigger className="w-full sm:w-[280px]"><SelectValue placeholder="Filter by Class" /></SelectTrigger>
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
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500"/>
                    <p>Loading data...</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50 flex flex-col items-center gap-2">
                    <WifiOff className="h-10 w-10 text-slate-300" />
                    <p>No students visible.</p>
                    {students.length > 0 && <p className="text-xs text-orange-600">Data is loaded ({students.length}), but filters are hiding them.</p>}
                    {students.length === 0 && <p className="text-xs text-slate-400">Database is empty.</p>}
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Class</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
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
        <DialogContent className="sm:max-w-[600px]"><DialogHeader><DialogTitle>Add New Student</DialogTitle></DialogHeader>
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
        <DialogContent className="sm:max-w-[600px]"><DialogHeader><DialogTitle>Edit Student Details</DialogTitle></DialogHeader>
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

    