
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { collection, getDocs, doc, setDoc, serverTimestamp, query, where, getDoc } from 'firebase/firestore';
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
import { UserPlus, Loader2, Search, RefreshCw, GraduationCap, Edit } from 'lucide-react';

type Student = {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  grade?: string;
  schoolId?: string;
  gender?: string;
};

export default function StudentManagementPage() {
  const { user } = useAuth(); // Logged in Director/Admin
  const firestore = useFirestore();
  const { toast } = useToast();

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminSchoolId, setAdminSchoolId] = useState<string | null>(null); // CRITICAL: Your School Key
  
  // Modal & Form States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // --- 1. INITIALIZATION: FIND YOUR SCHOOL ---
  useEffect(() => {
    const fetchAdminProfile = async () => {
        if (!user || !firestore) return;
        try {
            // We look at YOUR staff profile to see which school you belong to
            const staffDoc = await getDoc(doc(firestore, 'staff', user.uid));
            
            if (staffDoc.exists()) {
                const data = staffDoc.data();
                if (data.schoolId) {
                    console.log("🏫 School Found:", data.schoolId);
                    setAdminSchoolId(data.schoolId);
                } else {
                    console.warn("⚠️ You are not linked to any school. Contact the CEO.");
                }
            }
        } catch (error) {
            console.error("Error fetching admin profile:", error);
        }
    };
    fetchAdminProfile();
  }, [user, firestore]);

  // --- 2. FETCH STUDENTS (FILTERED BY SCHOOL) ---
  const fetchStudents = useCallback(async () => {
    if (!firestore || !adminSchoolId) return; // Wait until we know the school
    
    setIsLoading(true);
    try {
        const studentCollection = collection(firestore, 'students');
        
        // 🔥 THE MAGIC FILTER: Only get students for THIS school
        const q = query(studentCollection, where('schoolId', '==', adminSchoolId));
        
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Student[];

        setStudents(data);
    } catch (err: any) {
        console.error(err);
        toast({ variant: 'destructive', title: "Error", description: "Failed to load students." });
    } finally {
        setIsLoading(false);
    }
  }, [firestore, adminSchoolId, toast]);

  // Trigger fetch when schoolId is found
  useEffect(() => {
      if(adminSchoolId) fetchStudents();
  }, [fetchStudents, adminSchoolId]);

  // --- 3. CREATE NEW STUDENT ---
  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting || !adminSchoolId) return;
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const email = formData.get('email') as string;
      const grade = formData.get('grade') as string;
      const gender = formData.get('gender') as string;
      const password = "password123"; 

      try {
          // A. Create Auth User (Link to School in 'users' collection)
          const result = await createNewUser(
              email, 
              password, 
              'Student', 
              { firstName, lastName },
              adminSchoolId // <--- PASSING THE KEY
            );
            
          if ('error' in result) throw new Error(result.error);

          // B. Create Firestore Doc (Link to School in 'students' collection)
          await setDoc(doc(firestore, 'students', result.uid), {
              uid: result.uid,
              firstName,
              lastName,
              email,
              grade,
              gender,
              schoolId: adminSchoolId, // <--- STAMPING THE DOC
              createdAt: serverTimestamp()
          });

          toast({ title: "Success", description: `Student ${firstName} enrolled.` });
          setIsAddOpen(false);
          fetchStudents(); 

      } catch (error: any) {
          toast({ variant: 'destructive', title: "Error", description: error.message });
      } finally {
          setIsSubmitting(false);
      }
  };

  // Client Filter
  const filteredStudents = students.filter(s => 
    ((s.firstName || '') + ' ' + (s.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6 p-6">
      <Card className="border-t-4 border-t-blue-600 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-blue-600"/> Student Management
                </CardTitle>
                <CardDescription>
                    {adminSchoolId ? `Total Students: ${students.length}` : "Loading School Data..."}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={fetchStudents} disabled={isLoading || !adminSchoolId}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}/> Refresh
                </Button>
                <Button 
                    onClick={() => setIsAddOpen(true)} 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!adminSchoolId}
                >
                    <UserPlus className="h-4 w-4 mr-2"/> Add Student
                </Button>
            </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
            <div className="flex gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search students..." 
                        className="pl-8 max-w-sm" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="py-10 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-500"/></div>
            ) : filteredStudents.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    {adminSchoolId ? "No students found. Add one to get started." : "Loading..."}
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-medium">{s.firstName} {s.lastName}</TableCell>
                                    <TableCell>{s.email}</TableCell>
                                    <TableCell><Badge variant="secondary">{s.grade || 'N/A'}</Badge></TableCell>
                                    <TableCell>{s.gender || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm"><Edit className="h-4 w-4 text-blue-600"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </CardContent>
      </Card>

      {/* ADD STUDENT MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader><DialogTitle>Enrol New Student</DialogTitle></DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>First Name</Label><Input name="firstName" required placeholder="John"/></div>
                    <div className="space-y-2"><Label>Last Name</Label><Input name="lastName" required placeholder="Doe"/></div>
                </div>
                
                <div className="space-y-2"><Label>Email</Label><Input name="email" type="email" required placeholder="student@school.com"/></div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Grade / Class</Label>
                        <Select name="grade">
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Grade 1">Grade 1</SelectItem>
                                <SelectItem value="Grade 2">Grade 2</SelectItem>
                                <SelectItem value="Grade 3">Grade 3</SelectItem>
                                <SelectItem value="JHS 1">JHS 1</SelectItem>
                                <SelectItem value="JHS 2">JHS 2</SelectItem>
                                <SelectItem value="JHS 3">JHS 3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select name="gender">
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Create Student Account"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-2">Default password: password123</p>
                </div>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
