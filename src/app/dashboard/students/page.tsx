
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
// FIX: Using getDocs instead of useCollection hooks
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { createNewUser } from '@/app/actions/create-user';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, GraduationCap, WifiOff, Database, Bug, Bus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

// --- TYPE DEFINITIONS ---
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
  usesBusService?: boolean;
};

type Class = {
    id: string;
    name: string;
};

export default function StudentsPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  // Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("Initializing...");
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


  // --- 1. DIRECT DATA FETCH (The Stable Fix) ---
  const loadData = useCallback(async () => {
    if (isUserLoading) return;
    
    if (!user || !firestore) {
        setIsLoading(false);
        setStatusMsg("Not Connected");
        return;
    }

    setIsLoading(true);
    setStatusMsg("Fetching Data...");

    try {
        // A. Fetch Classes
        const classSnap = await getDocs(collection(firestore, 'classes'));
        const classList = classSnap.docs.map(d => ({ id: d.id, name: d.data().name || "Unknown" })) as Class[];
        setClasses(classList);

        // B. Fetch Students
        const studentSnap = await getDocs(collection(firestore, 'students'));
        console.log(`Loaded ${studentSnap.size} students via Direct Fetch.`);
        
        const studentList = studentSnap.docs.map(d => ({ 
            id: d.id, 
            ...d.data() 
        })) as Student[];
        setStudents(studentList);
        
        setStatusMsg("Ready");
    } catch (err: any) {
        console.error("Load Error:", err);
        setStatusMsg("Error loading data");
        toast({ variant: 'destructive', title: "Error", description: err.message });
    } finally {
        setIsLoading(false);
    }
  }, [user, isUserLoading, firestore, toast]);

  // Load on mount
  useEffect(() => {
      loadData();
  }, [loadData]);

  // --- 2. DEBUGGING TOOL (CONSOLE ONLY) ---
  const debugDatabase = async () => {
      console.log("--- STARTING DEBUG ---");
      if (!firestore) {
          alert("Firestore not initialized.");
          return;
      }
      try {
          const colRef = collection(firestore, 'students'); 
          console.log("Looking in collection: 'students'");
          
          const snapshot = await getDocs(colRef);
          console.log(`Raw Snapshot Size: ${snapshot.size}`);
          
          if (snapshot.empty) {
              alert("The app connected, but the 'students' collection is empty.");
          } else {
              const rawData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
              console.log("Raw Data from DB:", rawData);
          }
      } catch (e: any) {
          console.error("Debug Error:", e);
          alert(`Read Failed: ${e.message}`);
      }
  };


  // --- 3. FORCE INITIALIZE (ALWAYS VISIBLE) ---
  const handleForceInitialize = async () => {
      if (!firestore) return;
      setIsInitializing(true);
      try {
          // 1. Create Test Class
          const classRef = await addDoc(collection(firestore, 'classes'), {
              name: "JHS 1 (Test)",
              createdAt: serverTimestamp()
          });
          
          // 2. Create Test Student
          await addDoc(collection(firestore, 'students'), {
              firstName: "Test",
              lastName: "Student",
              email: `test${Date.now()}@school.com`,
              classId: classRef.id,
              enrollmentStatus: 'Active',
              createdAt: serverTimestamp(),
              uid: "test-uid-" + Date.now()
          });

          toast({ title: "Success", description: "Dummy data created. Refreshing list..." });
          
          // 3. Reload Data immediately
          await loadData();
      } catch (e: any) {
          toast({ variant: 'destructive', title: "Error", description: e.message });
      } finally {
          setIsInitializing(false);
      }
  };

  // --- 4. ADD STUDENT ---
  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const values = Object.fromEntries(formData.entries());

      try {
          const result = await createNewUser(values.email as string, "password123", 'Student', { 
              firstName: values.firstName as string, 
              lastName: values.lastName as string 
          });
          
          if ('error' in result) throw new Error(result.error);

          await setDoc(doc(firestore, 'students', result.uid), {
              uid: result.uid,
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

          toast({ title: "Success", description: "Student added." });
          setIsAddOpen(false);
          loadData(); // Reload list manually

      } catch (error: any) {
          toast({ variant: 'destructive', title: "Error", description: error.message });
      } finally {
          setIsSubmitting(false);
      }
  };

  // --- 5. UPDATE STUDENT ---
  const handleUpdateStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStudent || isSubmitting) return;
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

        toast({ title: "Updated", description: "Student saved." });
        setEditingStudent(null);
        loadData(); // Reload list manually
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- 6. DELETE STUDENT ---
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student profile?")) return;
    try {
        await deleteDoc(doc(firestore, 'students', id));
        toast({ title: "Deleted", description: "Profile removed." });
        loadData(); // Reload list manually
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    }
  };

  // --- SAFE FILTER LOGIC ---
  const filteredStudents = students.filter(s => {
    // Safely get values (Default to empty string to prevent crashes on missing data)
    const first = (s.firstName || '').toLowerCase();
    const last = (s.lastName || '').toLowerCase();
    const email = (s.email || '').toLowerCase();
    
    const term = searchTerm.toLowerCase().trim();
    const sClassId = s.classId || 'unassigned';

    // Check Search (Match first, last, or email)
    const matchesSearch = term === '' || 
                          first.includes(term) || 
                          last.includes(term) || 
                          email.includes(term);

    // Check Class Filter
    const matchesClass = classFilter === 'all' || sClassId === classFilter;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-6 p-6">
      
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
                
                <Button variant="secondary" onClick={debugDatabase} className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200">
                    <Bug className="h-4 w-4 mr-2"/> Check Data
                </Button>

                <Button variant="destructive" onClick={handleForceInitialize} disabled={isInitializing}>
                    {isInitializing ? <Loader2 className="h-4 w-4 animate-spin"/> : <Database className="h-4 w-4 mr-2"/>}
                    Force Initialize DB
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
                    <Loader2 className="h-8 w-8 animate-spin text-green-500"/>
                    <p>Loading data...</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50 flex flex-col items-center gap-2">
                    <WifiOff className="h-10 w-10 text-slate-300" />
                    <p className="font-medium">No students visible.</p>
                    
                    {/* DEBUG INFO */}
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-left text-yellow-800 w-full max-w-xs">
                        <p><strong>Debug Stats:</strong></p>
                        <p>Total Fetched: {students.length}</p>
                        <p>Search Term: "{searchTerm}"</p>
                        <p>Class Filter: "{classFilter}"</p>
                        {students.length > 0 && <p className="mt-2">Data exists but filters are hiding it.</p>}
                    </div>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Class</TableHead><TableHead>Services</TableHead><TableHead className="text-right">Actions</TableHead>
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

      {/* ADD MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader><DialogTitle>Add New Student</DialogTitle><DialogDescription>Enter student details.</DialogDescription></DialogHeader>
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
                            {classes.length === 0 ? (
                                <SelectItem value="none" disabled>No classes found</SelectItem>
                            ) : (
                                classes.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                    {classes.length === 0 && <p className="text-xs text-red-400">No classes found in DB. Please use a Debug/Initialize button if needed.</p>}
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

      {/* EDIT MODAL */}
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
                                {(classes || []).map(c => (
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

    