
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

  // --- 1. FETCH LOGIC (FIXED - No useCallback, direct function) ---
  const fetchData = async () => {
    console.log('🔄 Fetch triggered');
    
    if (!user || !firestore) {
      console.log('⏳ Waiting for auth/firestore...');
      setIsLoading(false);
      setLoadingStatus("Waiting for authentication...");
      return;
    }

    setIsLoading(true);
    setLoadingStatus("Loading data...");
    
    try {
      console.log('📚 Fetching classes...');
      const classSnap = await getDocs(collection(firestore, 'classes'));
      const classList: Class[] = classSnap.docs.map((d) => ({ 
        id: d.id, 
        name: d.data().name || d.id 
      }));
      console.log(`✅ Loaded ${classList.length} classes`);
      setClasses(classList);

      console.log('👥 Fetching students...');
      const studentSnap = await getDocs(collection(firestore, 'students'));
      const studentList = studentSnap.docs.map((d) => ({ 
        id: d.id, 
        ...d.data() 
      })) as Student[];
      console.log(`✅ Loaded ${studentList.length} students`);
      setStudents(studentList);
      
      setLoadingStatus("Ready");

    } catch (err: any) {
      console.error('❌ Fetch Error:', err);
      setLoadingStatus("Error loading data");
      toast({ 
        variant: 'destructive', 
        title: "Error Loading Data", 
        description: err.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- INITIAL LOAD (FIXED - Only runs once when user/firestore ready) ---
  useEffect(() => {
    if (user && firestore) {
      console.log('✅ User and Firestore ready, fetching data...');
      fetchData();
    } else {
      console.log('⏳ Still waiting for user/firestore...');
      setIsLoading(false);
      setLoadingStatus("Not logged in");
    }
  }, [user, firestore]); // Only depend on user and firestore

  // Manual refresh function
  const handleManualRefresh = () => {
    console.log('🔄 Manual refresh clicked');
    fetchData();
  };

  // --- FORM ACTIONS ---
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const dateOfBirth = formData.get('dateOfBirth') as string;
    const address = formData.get('address') as string;

    setIsSubmitting(true);
    
    try {
      console.log('🎓 Creating student account...');
      const result = await createNewUser(email, "password123", 'Student', { firstName, lastName });
      
      if ('error' in result) {
        throw new Error(result.error);
      }

      console.log('💾 Saving student to Firestore...');
      await setDoc(doc(firestore, 'students', result.uid), {
        uid: result.uid,
        firstName,
        lastName,
        email,
        classId: selectedClassId,
        gender: selectedGender,
        dateOfBirth,
        address,
        enrollmentStatus: 'Active',
        createdAt: serverTimestamp()
      });

      toast({ 
        title: "Success", 
        description: `${firstName} ${lastName} added successfully.` 
      });
      
      setIsAddOpen(false);
      
      // Reload data
      fetchData();

    } catch (error: any) {
      console.error('❌ Error adding student:', error);
      toast({ 
        variant: 'destructive', 
        title: "Error", 
        description: error.message 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || isSubmitting) return;
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const dateOfBirth = formData.get('dateOfBirth') as string;
    const address = formData.get('address') as string;

    setIsSubmitting(true);

    try {
      console.log('💾 Updating student...');
      const studentRef = doc(firestore, 'students', editingStudent.id);
      
      await updateDoc(studentRef, {
        firstName,
        lastName,
        classId: selectedClassId,
        gender: selectedGender,
        dateOfBirth,
        address
      });

      toast({ title: "Updated", description: "Student details saved." });
      
      setEditingStudent(null);
      
      // Reload data
      fetchData();

    } catch (error: any) {
      console.error('❌ Error updating student:', error);
      toast({ 
        variant: 'destructive', 
        title: "Error", 
        description: error.message 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student profile? This cannot be undone.")) return;
    
    try {
      console.log('🗑️ Deleting student...');
      await deleteDoc(doc(firestore, 'students', id));
      toast({ title: "Deleted", description: "Student removed." });
      
      // Reload data
      fetchData();

    } catch (e: any) {
      console.error('❌ Error deleting student:', e);
      toast({ 
        variant: 'destructive', 
        title: "Error", 
        description: e.message 
      });
    }
  };

  const filteredStudents = students.filter(s => {
    const nameMatch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const classMatch = classFilter === 'all' || s.classId === classFilter;
    
    return (nameMatch || emailMatch) && classMatch;
  });
  
  if (!user && !isUserLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access student management.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="border-t-4 border-t-green-600">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-green-600" /> Student Management
            </CardTitle>
            <CardDescription>
              {students.length} students • {classes.length} classes • Status: <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{loadingStatus}</span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleManualRefresh} 
              disabled={isLoading}
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                resetForm();
                setIsAddOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <UserPlus className="h-4 w-4 mr-2" /> Add Student
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Filter by Class" />
              </SelectTrigger>
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
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
              <p className="text-sm font-medium">{loadingStatus}</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg flex flex-col items-center gap-2">
              <AlertCircle className="h-10 w-10 text-slate-300" />
              <p className="font-medium">No students found</p>
              <p className="text-xs text-slate-400">
                {searchTerm || classFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Click "Add Student" to get started'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {classes.find(c => c.id === s.classId)?.name || 'Unassigned'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              resetForm();
                              loadStudentForEdit(s);
                            }}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
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
      
      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input name="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input name="lastName" required />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Email *</Label>
                <Input name="email" type="email" required />
            </div>
            <div className="space-y-2">
                <Label>Class</Label>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger><SelectValue placeholder="Assign class" /></SelectTrigger>
                  <SelectContent>
                    {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input name="dateOfBirth" type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={selectedGender} onValueChange={setSelectedGender}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Address</Label>
                <Input name="address" />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Create'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* EDIT DIALOG */}
      <Dialog open={!!editingStudent} onOpenChange={open => !open && setEditingStudent(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Student</DialogTitle></DialogHeader>
          {editingStudent && (
            <form onSubmit={handleUpdateStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input name="firstName" defaultValue={editingStudent.firstName} required />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input name="lastName" defaultValue={editingStudent.lastName} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={editingStudent.email} disabled className="bg-slate-100" />
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input name="dateOfBirth" type="date" defaultValue={editingStudent.dateOfBirth} />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={selectedGender} onValueChange={setSelectedGender}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input name="address" defaultValue={editingStudent.address} />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Save Changes'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}