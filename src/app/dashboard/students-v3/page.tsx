'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  addDoc,
  runTransaction,
  query, 
  where
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createNewUser } from '@/app/actions/create-user';
import { useCurrentSchool } from '@/hooks/use-current-school'; 

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
import { UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, GraduationCap, WifiOff, Database, Bug, Bus, Utensils, MessageSquare, Camera, Upload } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { Student, Class, UserRole } from '@/lib/types';
import { MigrateStudentIds } from './migrate-student-ids';
import { StudentSearchInput } from '@/components/student-search';
import { StudentDisplay } from '@/components/student-display';
import { searchStudent, formatStudentId, generateNextStudentId } from '@/lib/student-utils';
import { sendSMSAction } from '@/app/actions/sms';


export default function StudentsV3Page() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const { schoolId: adminSchoolId, loading: isLoadingSchool } = useCurrentSchool();

  // Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("Initializing...");
  
  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');

  // Form State (Subscription Focused)
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [usesBus, setUsesBus] = useState(false);
  const [billingModel, setBillingModel] = useState<'Daily' | 'Termly'>('Daily');
  const [canteenBillingMode, setCanteenBillingMode] = useState<'Daily' | 'Termly' | 'None'>('Daily');

  // Reset form state when opening modals
  useEffect(() => {
    if (isAddOpen) { 
        setIsSubmitting(false); 
        setSelectedClassId(''); 
        setSelectedGender(''); 
        setSelectedPhoto(null);
        setUsesBus(false);
        setBillingModel('Daily');
        setCanteenBillingMode('Daily');
    }
    if (editingStudent) { 
        setIsSubmitting(false); 
        setSelectedClassId(editingStudent.classId || ''); 
        setSelectedGender(editingStudent.gender || ''); 
        setSelectedPhoto(null);
        setUsesBus(editingStudent.usesBusService || false);
        setBillingModel(editingStudent.transportBillingModel || 'Daily');
        setCanteenBillingMode(editingStudent.canteenBillingMode || (editingStudent.usesCanteen === false ? 'None' : 'Daily'));
    }
  }, [isAddOpen, editingStudent]);


  // --- 1. DIRECT DATA FETCH ---
  const loadData = useCallback(async () => {
    if (isUserLoading || !firestore || !adminSchoolId) return;
    
    if (!user) {
        setIsLoading(false);
        setStatusMsg("Not Connected");
        return;
    }

    setIsLoading(true);
    setStatusMsg("Fetching Data...");

    try {
        const classQuery = query(collection(firestore, 'classes'), where('schoolId', '==', adminSchoolId));
        const classSnap = await getDocs(classQuery);
        const classList = classSnap.docs.map(d => ({ id: d.id, name: d.data().name || "Unknown" })) as Class[];
        setClasses(classList);

        const studentQuery = query(collection(firestore, 'students'), where('schoolId', '==', adminSchoolId));
        const studentSnap = await getDocs(studentQuery);
        
        const studentList = studentSnap.docs.map(d => ({ 
            id: d.id, 
            ...d.data() 
        })) as Student[];
        setStudents(studentList);
        
        setStatusMsg("Ready");
    } catch (err: any) {
        console.error("Load Error:", err);
        setStatusMsg("Error loading data");
        toast({ variant: 'destructive', title: "Error", description: "Could not fetch student database." });
    } finally {
        setIsLoading(false);
    }
  }, [user, isUserLoading, firestore, toast, adminSchoolId]);

  useEffect(() => {
      loadData();
  }, [loadData]);
  
  // --- UPLOAD HELPER ---
  const uploadProfilePhoto = async (studentUid: string, file: File): Promise<string | null> => {
    if (!adminSchoolId) return null;
    const storage = getStorage();
    const photoRef = ref(storage, `schools/${adminSchoolId}/students/${studentUid}/profile_pic`);
    
    try {
        setIsUploadingPhoto(true);
        const snapshot = await uploadBytes(photoRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return url;
    } catch (error) {
        console.error("Photo upload failed:", error);
        toast({ variant: 'destructive', title: "Upload Failed", description: "Could not save profile picture." });
        return null;
    } finally {
        setIsUploadingPhoto(false);
    }
  };

  // --- ADD STUDENT LOGIC ---
  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (!adminSchoolId) {
          toast({ variant: 'destructive', title: "System Error", description: "School context missing." });
          return;
      }

      if (isSubmitting) return;
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const values = Object.fromEntries(formData.entries());
      const firstName = values.firstName as string;
      const lastName = values.lastName as string;
      const email = values.email as string;
      const password = "password123"; 

      try {
          const result = await createNewUser(
              email, 
              password, 
              'Student', 
              { firstName, lastName },
              adminSchoolId 
            );
            
          if ('error' in result) throw new Error(result.error);

          let photoURL = null;
          if (selectedPhoto) {
              photoURL = await uploadProfilePhoto(result.uid, selectedPhoto);
          }

          const newStudentId = await generateNextStudentId(firestore!, adminSchoolId);
          
          await setDoc(doc(firestore!, 'students', result.uid), {
              uid: result.uid,
              studentId: newStudentId, 
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              classId: selectedClassId,
              gender: selectedGender,
              dateOfBirth: values.dateOfBirth,
              address: values.address,
              usesBusService: usesBus,
              transportBillingModel: usesBus ? billingModel : null,
              canteenBillingMode: canteenBillingMode,
              usesCanteen: canteenBillingMode !== 'None',
              photoURL: photoURL,
              enrollmentStatus: 'Active',
              createdAt: serverTimestamp(),
              schoolId: adminSchoolId
          });

          toast({ title: "Success", description: `Student ${firstName} enrolled. ID: ${newStudentId}.` });
          setIsAddOpen(false);
          loadData(); 

      } catch (error: any) {
          console.error(error);
          toast({ variant: 'destructive', title: "Error", description: error.message });
      } finally {
          setIsSubmitting(false);
      }
  };

  // --- UPDATE STUDENT ---
  const handleUpdateStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingStudent || isSubmitting || !firestore) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    try {
        let photoURL = editingStudent.photoURL || null;
        if (selectedPhoto) {
            photoURL = await uploadProfilePhoto(editingStudent.uid, selectedPhoto) || photoURL;
        }

        const studentRef = doc(firestore, 'students', editingStudent.id);
        await updateDoc(studentRef, {
            firstName: values.firstName,
            lastName: values.lastName,
            classId: selectedClassId,
            gender: selectedGender,
            dateOfBirth: values.dateOfBirth,
            address: values.address,
            usesBusService: usesBus,
            transportBillingModel: usesBus ? billingModel : null,
            canteenBillingMode: canteenBillingMode,
            usesCanteen: canteenBillingMode !== 'None',
            photoURL: photoURL,
        });

        toast({ title: "Updated", description: "Student profile saved." });
        setEditingStudent(null);
        loadData();
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- DELETE STUDENT ---
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

  const handleSendBill = async (student: Student) => {
    // This is a placeholder for bill reminder logic
    toast({ title: "Feature coming soon", description: "Direct SMS reminders are being integrated." });
  };
  
  const filteredStudents = students.filter(s => {
    const term = searchTerm.toLowerCase().trim();
    let matchesClass = classFilter === 'all' || s.classId === classFilter;
    if (classFilter === 'unassigned') matchesClass = !s.classId;
    const matchesSearch = searchStudent(s, term);
    return matchesSearch && matchesClass;
  });

  const overallLoading = isLoadingSchool || isLoading;

  return (
    <div className="space-y-6 p-6">
      
      <Card className="border-t-4 border-t-green-600 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-green-600"/> Students
                </CardTitle>
                <CardDescription>
                    {adminSchoolId ? `Found: ${students.length} | Showing: ${filteredStudents.length}` : "Loading School Data..."}
                </CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={loadData} disabled={overallLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}/> Refresh
                </Button>
                
                <Button onClick={() => setIsAddOpen(true)} className="bg-green-600 hover:bg-green-700">
                    <UserPlus className="h-4 w-4 mr-2"/> Add Student
                </Button>
            </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <StudentSearchInput 
                  value={searchTerm} 
                  onChange={setSearchTerm} 
                  className="flex-grow"
                />
                <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger className="w-full sm:w-[280px]"><SelectValue placeholder="Filter by Class" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="unassigned" className="text-orange-600 font-bold">Unassigned Students</SelectItem>
                        {classes.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {overallLoading ? (
                <div className="py-12 flex flex-col items-center gap-3 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500"/>
                    <p>{statusMsg}</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50 flex flex-col items-center gap-2">
                    <WifiOff className="h-10 w-10 text-slate-300" />
                    <p className="font-medium">No students found.</p>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Services</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell>
                                        <StudentDisplay student={s} variant="list" showAvatar />
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">
                                        {formatStudentId(s)}
                                    </TableCell>
                                    <TableCell>{s.email}</TableCell>
                                    <TableCell>
                                        {s.classId ? (
                                            <Badge variant="secondary">{classes.find(c => c.id === s.classId)?.name || 'N/A'}</Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 font-bold italic">Needs Class</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {s.canteenBillingMode !== 'None' && <Utensils className="h-4 w-4 text-orange-500" title={`Canteen: ${s.canteenBillingMode}`}/>}
                                            {s.usesBusService && <Bus className="h-4 w-4 text-blue-500" title={`Bus Subscriber (${s.transportBillingModel})`} />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="outline" size="sm" onClick={() => handleSendBill(s)}>
                                                <MessageSquare className="h-4 w-4" />
                                            </Button>
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

      <MigrateStudentIds />

      {/* ADD MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Enrol New Student</DialogTitle><DialogDescription>Enter basic details and subscription preferences.</DialogDescription></DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4 mt-2">
                 <div className="flex flex-col items-center gap-4 py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <div className="relative h-24 w-24 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                        {selectedPhoto ? (
                            <img src={URL.createObjectURL(selectedPhoto)} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                            <Camera className="h-8 w-8 text-slate-300" />
                        )}
                    </div>
                    <div className="flex flex-col items-center">
                        <Label htmlFor="photo-upload" className="cursor-pointer bg-white border px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-2">
                            <Upload className="h-3 w-3"/> Select Profile Photo
                        </Label>
                        <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedPhoto(e.target.files?.[0] || null)} />
                        <p className="text-[10px] text-slate-400 mt-2">JPG or PNG, max 2MB.</p>
                    </div>
                 </div>

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
                
                <div className="space-y-4 p-4 border rounded-xl bg-slate-50">
                    <h4 className="text-sm font-bold text-slate-700">Services & Subscriptions</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Canteen Mode */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Utensils className="h-4 w-4 text-orange-500"/> Canteen Billing Mode</Label>
                            <Select value={canteenBillingMode} onValueChange={(val: any) => setCanteenBillingMode(val)}>
                                <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Daily">Daily (Attendance-based)</SelectItem>
                                    <SelectItem value="Termly">Termly (Flat Fee)</SelectItem>
                                    <SelectItem value="None">None (Self-Catered)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Transport Toggle */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Bus className="h-4 w-4 text-blue-500"/> Bus Subscription</Label>
                            <div className="flex items-center space-x-2 h-10">
                                <Checkbox id="usesBusService" checked={usesBus} onCheckedChange={(v) => setUsesBus(!!v)} />
                                <Label htmlFor="usesBusService" className="cursor-pointer font-medium text-slate-600">Uses School Bus</Label>
                            </div>
                        </div>
                    </div>

                    {usesBus && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 border-t pt-4">
                            <div className="space-y-2">
                                <Label>Bus Billing Model</Label>
                                <Select value={billingModel} onValueChange={(val: any) => setBillingModel(val)}>
                                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Daily">Daily (Attendance-based)</SelectItem>
                                        <SelectItem value="Termly">Termly (Fixed Fee)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-slate-500">Specific route and stop assignment is handled in the <strong>Transport module</strong>.</p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold" disabled={isSubmitting || isUploadingPhoto}>
                        {isSubmitting || isUploadingPhoto ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> {isUploadingPhoto ? "Uploading Photo..." : "Saving..."}</>
                        ) : "Enrol Student"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Edit Student Profile</DialogTitle></DialogHeader>
            {editingStudent && (
                <form onSubmit={handleUpdateStudent} className="space-y-4 mt-2">
                    <div className="flex flex-col items-center gap-4 py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <div className="relative h-24 w-24 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                            {selectedPhoto ? (
                                <img src={URL.createObjectURL(selectedPhoto)} alt="Preview" className="h-full w-full object-cover" />
                            ) : editingStudent.photoURL ? (
                                <img src={editingStudent.photoURL} alt="Current" className="h-full w-full object-cover" />
                            ) : (
                                <Camera className="h-8 w-8 text-slate-300" />
                            )}
                        </div>
                        <div className="flex flex-col items-center">
                            <Label htmlFor="photo-upload-edit" className="cursor-pointer bg-white border px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-2">
                                <Upload className="h-3 w-3"/> Change Profile Photo
                            </Label>
                            <Input id="photo-upload-edit" type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedPhoto(e.target.files?.[0] || null)} />
                        </div>
                    </div>

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
                                {(classes || []).map(c => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
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
                    
                    <div className="space-y-4 p-4 border rounded-xl bg-slate-50">
                        <h4 className="text-sm font-bold text-slate-700">Services & Subscriptions</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Utensils className="h-4 w-4 text-orange-500"/> Canteen Billing Mode</Label>
                                <Select value={canteenBillingMode} onValueChange={(val: any) => setCanteenBillingMode(val)}>
                                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Daily">Daily (Attendance-based)</SelectItem>
                                        <SelectItem value="Termly">Termly (Flat Fee)</SelectItem>
                                        <SelectItem value="None">None (Self-Catered)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Bus className="h-4 w-4 text-blue-500"/> Bus Subscription</Label>
                                <div className="flex items-center space-x-2 h-10">
                                    <Checkbox id="editUsesBusService" checked={usesBus} onCheckedChange={(v) => setUsesBus(!!v)} />
                                    <Label htmlFor="editUsesBusService" className="cursor-pointer font-medium text-slate-600">Uses School Bus</Label>
                                </div>
                            </div>
                        </div>

                        {usesBus && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 border-t pt-4">
                                <div className="space-y-2">
                                    <Label>Bus Billing Model</Label>
                                    <Select value={billingModel} onValueChange={(val: any) => setBillingModel(val)}>
                                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Daily">Daily (Attendance-based)</SelectItem>
                                            <SelectItem value="Termly">Termly (Fixed Fee)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting || isUploadingPhoto}>
                            {isSubmitting || isUploadingPhoto ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</>
                            ) : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
