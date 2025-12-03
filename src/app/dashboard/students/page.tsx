
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
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
import { UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, GraduationCap, AlertCircle } from 'lucide-react';

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

export default function StudentsPage() {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { toast } = useToast();

  // Ref to track if we've already fetched
  const hasFetched = useRef(false);
  const isInitialMount = useRef(true);

  // Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  
  // Loading State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');

  // Reset form
  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setSelectedClassId('');
    setSelectedGender('');
    setDateOfBirth('');
    setAddress('');
  };

  // Load form with student data for editing
  const loadStudentForEdit = (student: Student) => {
    setFirstName(student.firstName);
    setLastName(student.lastName);
    setEmail(student.email);
    setSelectedClassId(student.classId || '');
    setSelectedGender(student.gender || '');
    setDateOfBirth(student.dateOfBirth || '');
    setAddress(student.address || '');
    setEditingStudent(student);
  };

  // --- FETCH DATA (NEW APPROACH - Direct, simple, no dependencies) ---
  const loadData = async () => {
    if (!firestore) {
      console.log('⏳ Firestore not ready');
      return;
    }

    console.log('📊 Loading data...');
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch Classes
      console.log('📚 Fetching classes...');
      const classesSnapshot = await getDocs(collection(firestore, 'classes'));
      const classesData: Class[] = [];
      
      classesSnapshot.forEach((doc) => {
        classesData.push({
          id: doc.id,
          name: doc.data().name || doc.id
        });
      });
      
      console.log(`✅ Loaded ${classesData.length} classes`);
      setClasses(classesData);

      // Fetch Students
      console.log('👥 Fetching students...');
      const studentsSnapshot = await getDocs(collection(firestore, 'students'));
      const studentsData: Student[] = [];
      
      studentsSnapshot.forEach((doc) => {
        studentsData.push({
          id: doc.id,
          uid: doc.data().uid || doc.id,
          firstName: doc.data().firstName || '',
          lastName: doc.data().lastName || '',
          email: doc.data().email || '',
          classId: doc.data().classId || '',
          dateOfBirth: doc.data().dateOfBirth || '',
          gender: doc.data().gender || '',
          address: doc.data().address || ''
        });
      });
      
      console.log(`✅ Loaded ${studentsData.length} students`);
      setStudents(studentsData);

    } catch (err: any) {
      console.error('❌ Error loading data:', err);
      setError(err.message);
      toast({ 
        variant: 'destructive', 
        title: "Error Loading Data", 
        description: err.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- INITIAL LOAD (Only once when firestore is ready) ---
  useEffect(() => {
    if (isInitialMount.current && firestore && !hasFetched.current) {
      console.log('🚀 Initial load triggered');
      hasFetched.current = true;
      isInitialMount.current = false;
      loadData();
    }
  }, [firestore]);

  // Manual refresh
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    loadData();
  };

  // --- ADD STUDENT ---
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
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
      resetForm();
      
      // Reload data
      loadData();

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

  // --- UPDATE STUDENT ---
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || isSubmitting) return;
    
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
      resetForm();
      
      // Reload data
      loadData();

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

  // --- DELETE STUDENT ---
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student profile? This cannot be undone.")) return;
    
    try {
      console.log('🗑️ Deleting student...');
      await deleteDoc(doc(firestore, 'students', id));
      toast({ title: "Deleted", description: "Student removed." });
      
      // Reload data
      loadData();

    } catch (e: any) {
      console.error('❌ Error deleting student:', e);
      toast({ 
        variant: 'destructive', 
        title: "Error", 
        description: e.message 
      });
    }
  };

  // Filter students
  const filteredStudents = students.filter(s => {
    const nameMatch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const classMatch = classFilter === 'all' || s.classId === classFilter;
    
    return (nameMatch || emailMatch) && classMatch;
  });

  // If not logged in
  if (!user) {
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
      <Card className="border-t-4 border-t-green-600 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-green-600"/> Student Management
            </CardTitle>
            <CardDescription>
              {students.length} student{students.length !== 1 ? 's' : ''} enrolled
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={isLoading}
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}/> 
              Refresh
            </Button>
            <Button 
              onClick={() => {
                resetForm();
                setIsAddOpen(true);
              }} 
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <UserPlus className="h-4 w-4 mr-2"/> Add Student
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search and Filter */}
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

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Content Area */}
          {isLoading ? (
            <div className="py-12 flex flex-col items-center gap-3 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
              <Loader2 className="h-8 w-8 animate-spin text-green-500"/>
              <p className="text-sm font-medium">Loading students...</p>
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
                  {filteredStudents.map((s) => (
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
                            onClick={() => loadStudentForEdit(s)}
                          >
                            <Edit className="h-4 w-4 text-blue-600"/>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(s.id)}
                          >
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
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Enter the student's details below to create their account.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input 
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required 
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input 
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required 
                  placeholder="Smith"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input 
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email" 
                required 
                placeholder="john.smith@school.com"
              />
            </div>
            
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
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input 
                  value={dateOfBirth}
                  onChange={e => setDateOfBirth(e.target.value)}
                  type="date" 
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                  <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Address</Label>
              <Input 
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="123 School Lane"
              />
            </div>
            
            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : null}
                {isSubmitting ? "Creating..." : "Create Student Account"}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">Default password: password123</p>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={!!editingStudent} onOpenChange={(open) => {
        if (!open) {
          setEditingStudent(null);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Student Details</DialogTitle>
            <DialogDescription>Update the student's information below.</DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <form onSubmit={handleUpdateStudent} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input 
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input 
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} disabled className="bg-slate-100" />
              </div>
              
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
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input 
                    value={dateOfBirth}
                    onChange={e => setDateOfBirth(e.target.value)}
                    type="date" 
                  />
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
                <Input 
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="123 School Lane"
                />
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : null}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
