

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  addDoc,
  runTransaction
} from 'firebase/firestore';
import { createNewUser } from '@/app/actions/create-user';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, GraduationCap, WifiOff, Database, Bug, Bus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { Student, Class } from '@/lib/types';
import { MigrateStudentIds } from './migrate-student-ids';

// --- ROBUST ID GENERATION ---
async function generateNextStudentId(firestore: any): Promise<string> {
  const counterRef = doc(firestore, 'counters', 'students');
  
  const newIdNumber = await runTransaction(firestore, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    if (!counterDoc.exists()) {
      transaction.set(counterRef, { currentId: 1 });
      return 1;
    }
    const newId = (counterDoc.data().currentId || 0) + 1;
    transaction.update(counterRef, { currentId: newId });
    return newId;
  });
  
  const year = new Date().getFullYear();
  const paddedNumber = String(newIdNumber).padStart(4, '0');
  
  return `SS-${year}-${paddedNumber}`;
}

export default function StudentsV3Page() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedGender, setSelectedGender] = useState('');

  useEffect(() => {
    if (isAddOpen || editingStudent) {
        setIsSubmitting(false);
        setSelectedClassId(editingStudent?.classId || ''); 
        setSelectedGender(editingStudent?.gender || ''); 
    }
  }, [isAddOpen, editingStudent]);

  const loadData = useCallback(async () => {
    if (isUserLoading || !firestore) return;
    setIsLoading(true);

    try {
        const [classSnap, studentSnap] = await Promise.all([
            getDocs(collection(firestore, 'classes')),
            getDocs(collection(firestore, 'students'))
        ]);
        const classList = classSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Class[];
        const studentList = studentSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Student[];
        setClasses(classList);
        setStudents(studentList);
    } catch (err: any) {
        toast({ variant: 'destructive', title: "Error", description: "Could not load data." });
    } finally {
        setIsLoading(false);
    }
  }, [user, isUserLoading, firestore, toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting || !firestore) return;
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const values = Object.fromEntries(formData.entries());

      try {
          const newStudentId = await generateNextStudentId(firestore);

          const result = await createNewUser(values.email as string, "password123", 'Student', { 
              firstName: values.firstName as string, 
              lastName: values.lastName as string 
          });
          if ('error' in result) throw new Error(result.error);

          await setDoc(doc(firestore, 'students', result.uid), {
              uid: result.uid,
              studentId: newStudentId,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              classId: selectedClassId,
              gender: selectedGender,
              dateOfBirth: values.dateOfBirth,
              address: values.address,
              usesBusService: values.usesBusService === 'on',
              enrollmentStatus: 'Active',
              createdAt: serverTimestamp()
          });

          toast({ title: "Success", description: `Student added with ID: ${newStudentId}.` });
          setIsAddOpen(false);
          loadData();

      } catch (error: any) {
          toast({ variant: 'destructive', title: "Error", description: error.message });
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleUpdateStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStudent || isSubmitting || !firestore) return;
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    try {
        const studentRef = doc(firestore, 'students', editingStudent.id);
        await updateDoc(studentRef, {
            firstName: values.firstName,
            lastName: values.lastName,
            classId: selectedClassId,
            gender: selectedGender,
            dateOfBirth: values.dateOfBirth,
            address: values.address,
            usesBusService: values.usesBusService === 'on',
        });

        toast({ title: "Updated", description: "Student details saved." });
        setEditingStudent(null);
        loadData();
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!firestore || !confirm("Delete this student profile?")) return;
    try {
        await deleteDoc(doc(firestore, 'students', id));
        toast({ title: "Deleted", description: "Profile removed." });
        loadData();
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    }
  };
  
  const formatStudentIdDisplay = (student: Student): string => {
    if (student.studentId && /^SS-\d{4}-\d{4}$/.test(student.studentId)) {
        return student.studentId;
    }
    return 'ID Pending';
  };

  const filteredStudents = students.filter(s => {
    const first = (s.firstName || '').toLowerCase();
    const last = (s.lastName || '').toLowerCase();
    const email = (s.email || '').toLowerCase();
    const studentId = (s.studentId || '').toLowerCase();
    
    const term = searchTerm.toLowerCase().trim();
    const sClassId = s.classId || 'unassigned';

    const matchesSearch = term === '' || first.includes(term) || last.includes(term) || email.includes(term) || studentId.includes(term);
    const matchesClass = classFilter === 'all' || sClassId === classFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 p-6">
      
      <MigrateStudentIds />

      <Card className="border-t-4 border-t-green-600 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-green-600"/> Students
                </CardTitle>
                <CardDescription>
                    Found: {students.length} | Showing: {filteredStudents.length}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={loadData} disabled={isLoading}>
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
                    <Input 
                        placeholder="Search name, email, or student ID..." 
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
                    <Loader2 className="h-8 w-8 animate-spin text-green-500"/>
                    <p>Loading data...</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50 flex flex-col items-center gap-2">
                    <WifiOff className="h-10 w-10 text-slate-300" />
                    <p className="font-medium">No students visible.</p>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead>Student ID</TableHead><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Class</TableHead><TableHead>Services</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-mono text-xs">{formatStudentIdDisplay(s)}</TableCell>
                                    <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                                    <TableCell>{s.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {classes.find(c => c.id === s.classId)?.name || 'Unassigned'}
                                        </Badge>
                                    </TableCell>
                                     <TableCell>
                                        {s.usesBusService && <Bus className="h-4 w-4 text-muted-foreground" title="Uses Bus Service" />}
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

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px]"><DialogHeader><DialogTitle>Add New Student</DialogTitle><DialogDescription>Enter student details.</DialogDescription></DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4 mt-2">
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
                            {classes.map(c => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
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
                <div className="flex items-center space-x-2">
                    <Checkbox id="usesBusService" name="usesBusService" />
                    <Label htmlFor="usesBusService">This student uses the bus service</Label>
                </div>
                <DialogFooter>
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Create Account"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent className="sm:max-w-[600px]"><DialogHeader><DialogTitle>Edit Student Details</DialogTitle><DialogDescription>Modify the student's profile.</DialogDescription></DialogHeader>
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
                                {classes.map(c => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
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
                    <div className="flex items-center space-x-2">
                        <Checkbox id="editUsesBusService" name="usesBusService" defaultChecked={editingStudent.usesBusService} />
                        <Label htmlFor="editUsesBusService">This student uses the bus service</Label>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
