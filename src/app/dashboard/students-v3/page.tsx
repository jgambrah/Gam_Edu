'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { logAuditEvent } from '@/lib/audit';
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
  where,
  deleteField
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createNewUser } from '@/app/actions/create-user';
import { adminResetUserPassword } from '@/app/actions/admin-reset-password';
import { useCurrentSchool } from '@/hooks/use-current-school'; 
import { cn } from '@/lib/utils';
import { useRole } from '@/context/role-context';

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
import { UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, GraduationCap, WifiOff, Database, Bug, Bus, Utensils, MessageSquare, Camera, Upload, Archive, RotateCcw, Filter, AlertTriangle, Lock, KeyRound } from 'lucide-react';
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
  const { role, profile } = useRole();
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

  // Password Reset State
  const [resetPasswordUser, setResetPasswordUser] = useState<any>(null);
  const [newTempPassword, setNewTempPassword] = useState('password123');
  const [isResetting, setIsResetting] = useState(false);

  // Custom Confirmation Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [archiveTask, setArchiveTask] = useState<{ id: string, currentStatus: string } | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'Active' | 'Inactive' | 'All'>('Active');

  // Form State (Subscription Focused)
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [usesBus, setUsesBus] = useState(false);
  const [billingModel, setBillingModel] = useState<'Daily' | 'Termly'>('Daily');
  const [canteenBillingMode, setCanteenBillingMode] = useState<'Daily' | 'Termly' | 'None'>('Daily');

  // --- PERMISSIONS ---
  const schoolSettingsQuery = useMemoFirebase(
      () => (firestore && adminSchoolId) ? doc(firestore, 'schoolSettings', adminSchoolId) : null,
      [firestore, adminSchoolId]
  );
  const { data: schoolSettings } = useDoc<any>(schoolSettingsQuery as any);

  const canManage = useMemo(() => {
    if (!role) return false;
    return role === 'Director' || role === 'Administrator';
  }, [role]);

  const isSecretary = role === 'Secretary';

  const canEditBillingToggles = useMemo(() => {
      if (!role) return false;
      return role === 'Director' || role === 'Accountant' || (role === 'Administrator' && schoolSettings?.allowAdminBillingToggles === true);
  }, [role, schoolSettings]);

  // --- DATA FETCHING ---
  const loadData = useCallback(async () => {
    if (isUserLoading || !firestore || !adminSchoolId) return;
    
    setIsLoading(true);
    setStatusMsg("Fetching Data...");

    try {
        const classQuery = query(collection(firestore, 'classes'), where('schoolId', '==', adminSchoolId));
        const classSnap = await getDocs(classQuery);
        const classList = classSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Class[];
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
  }, [firestore, adminSchoolId, isUserLoading, toast]);

  useEffect(() => {
      if (adminSchoolId) loadData();
  }, [loadData, adminSchoolId]);
  
  // --- RESET LOGIC ---
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
  }, [isAddOpen]);

  useEffect(() => {
    if (editingStudent) {
        setIsSubmitting(false);
        setSelectedClassId(editingStudent.classId || '');
        setSelectedGender(editingStudent.gender || '');
        setSelectedPhoto(null);
        setUsesBus(editingStudent.usesBusService === true);
        setBillingModel(editingStudent.transportBillingModel || 'Daily');
        setCanteenBillingMode(editingStudent.canteenBillingMode || 'Daily');
    }
  }, [editingStudent]);

  const photoPreviewUrl = useMemo(() => {
    if (selectedPhoto) return URL.createObjectURL(selectedPhoto);
    return null;
  }, [selectedPhoto]);

  useEffect(() => {
    return () => {
        if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl);
    };
  }, [photoPreviewUrl]);

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
        return null;
    } finally {
        setIsUploadingPhoto(false);
    }
  };

  // --- ACTIONS ---
  const triggerArchive = (studentId: string, currentStatus: string = 'Active') => {
    setArchiveTask({ id: studentId, currentStatus });
    setIsConfirmOpen(true);
  };

  const executeArchive = async () => {
    if (!archiveTask || !firestore || !adminSchoolId) return;
    
    setIsSubmitting(true);
    const { id, currentStatus } = archiveTask;
    const isCurrentlyActive = currentStatus === 'Active' || !currentStatus;
    const newStatus = isCurrentlyActive ? 'Inactive' : 'Active';

    const studentObj = students.find(s => s.id === id);
    const studentName = studentObj ? `${studentObj.firstName} ${studentObj.lastName}` : `Student (UID: ${id})`;

    try {
        await updateDoc(doc(firestore, 'students', id), {
            enrollmentStatus: newStatus,
            updatedAt: serverTimestamp()
        });

        await logAuditEvent({
            firestore,
            schoolId: adminSchoolId,
            userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
            action: newStatus === 'Inactive' ? 'ARCHIVE_STUDENT' : 'RESTORE_STUDENT',
            details: `${newStatus === 'Inactive' ? 'Archived' : 'Restored'} student ${studentName}`
        });

        toast({ title: "Status Updated", description: `Student is now ${newStatus}.` });
        loadData();
    } catch (error: any) {
        console.error(error);
        toast({ variant: 'destructive', title: "Error", description: "Failed to update status." });
    } finally {
        setIsSubmitting(false);
        setIsConfirmOpen(false);
        setArchiveTask(null);
    }
  };

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!adminSchoolId || isSubmitting) return;
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const values = Object.fromEntries(formData.entries());
      const firstName = (values.firstName as string) || '';
      const lastName = (values.lastName as string) || '';
      const email = (values.email as string) || '';

      try {
          const result = await createNewUser(email, "password123", 'Student', { firstName, lastName }, adminSchoolId);
          if ('error' in result) throw new Error(result.error);

          let photoURL = null;
          if (selectedPhoto) {
              photoURL = await uploadProfilePhoto(result.uid, selectedPhoto);
          }

          const newStudentId = await generateNextStudentId(firestore!, adminSchoolId);
          
          await setDoc(doc(firestore!, 'students', result.uid), {
              uid: result.uid,
              studentId: newStudentId, 
              firstName,
              lastName,
              email,
              role: 'Student',
              classId: selectedClassId || null,
              gender: selectedGender || null,
              dateOfBirth: (values.dateOfBirth as string) || null,
              address: (values.address as string) || null,
              usesBusService: usesBus,
              transportBillingModel: usesBus ? billingModel : null,
              canteenBillingMode: canteenBillingMode || 'Daily',
              usesCanteen: canteenBillingMode !== 'None',
              photoURL: photoURL || null,
              enrollmentStatus: 'Active',
              createdAt: serverTimestamp(),
              schoolId: adminSchoolId
          });

          await logAuditEvent({
              firestore: firestore!,
              schoolId: adminSchoolId,
              userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
              action: 'ADD_STUDENT',
              details: `Enrolled new student ${firstName} ${lastName} with Student ID ${newStudentId}`
          });

          toast({ title: "Success", description: `Student ${firstName} enrolled. ID: ${newStudentId}.` });
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
        let photoURL = editingStudent.photoURL || null;
        if (selectedPhoto) {
            photoURL = await uploadProfilePhoto(editingStudent.uid, selectedPhoto) || photoURL;
        }

        const studentRef = doc(firestore, 'students', editingStudent.id);
        
        // Build base update object
        const updateData: any = {
            firstName: (values.firstName as string) || editingStudent.firstName,
            lastName: (values.lastName as string) || editingStudent.lastName,
            classId: selectedClassId || null,
            gender: selectedGender || null,
            dateOfBirth: (values.dateOfBirth as string) || null,
            address: (values.address as string) || null,
            photoURL: photoURL || null,
            role: 'Student',
            updatedAt: serverTimestamp()
        };

        // Only update billing fields if the user has permission
        if (canEditBillingToggles) {
            updateData.usesBusService = usesBus;
            updateData.transportBillingModel = usesBus ? billingModel : null;
            updateData.canteenBillingMode = canteenBillingMode || 'Daily';
            updateData.usesCanteen = canteenBillingMode !== 'None';
        }

        await updateDoc(studentRef, updateData);

        await logAuditEvent({
            firestore,
            schoolId: adminSchoolId,
            userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
            action: 'UPDATE_STUDENT',
            details: `Updated student profile details for ${updateData.firstName} ${updateData.lastName}`
        });

        toast({ title: "Updated", description: "Student profile saved." });
        setEditingStudent(null);
        loadData();
    } catch (error: any) {
        console.error(error);
        toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
        const term = searchTerm.toLowerCase().trim();
        const currentStatus = s.enrollmentStatus || 'Active';
        const matchesStatus = statusFilter === 'All' ? true : currentStatus === statusFilter;
        let matchesClass = classFilter === 'all' || s.classId === classFilter;
        if (classFilter === 'unassigned') matchesClass = !s.classId;
        const matchesSearch = searchStudent(s, term);
        return matchesStatus && matchesSearch && matchesClass;
    });
  }, [students, searchTerm, classFilter, statusFilter]);

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
                    <RefreshCw className={cn("h-4 w-4 mr-2", overallLoading && "animate-spin")}/> Refresh
                </Button>
                {canManage && (
                    <Button onClick={() => setIsAddOpen(true)} className="bg-green-600 hover:bg-green-700" disabled={!adminSchoolId}>
                        <UserPlus className="h-4 w-4 mr-2"/> Add Student
                    </Button>
                )}
            </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <StudentSearchInput 
                  value={searchTerm} 
                  onChange={setSearchTerm} 
                  className="flex-grow"
                />
                
                <div className="flex gap-2 w-full md:w-auto">
                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-full md:w-[200px] border-2"><SelectValue placeholder="All Classes" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            <SelectItem value="unassigned" className="text-orange-600 font-bold">Unassigned</SelectItem>
                            {classes.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                        <SelectTrigger className="w-full md:w-[160px] border-2"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active Only</SelectItem>
                            <SelectItem value="Inactive">Archived Only</SelectItem>
                            <SelectItem value="All">Show All</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
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
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50">
                                <TableHead>Student</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Student ID</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Services</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((s) => {
                                const currentStatus = s.enrollmentStatus || 'Active';
                                const isInactive = currentStatus === 'Inactive';
                                return (
                                    <TableRow key={s.id} className={cn(isInactive && "bg-slate-50/80 grayscale opacity-70")}>
                                        <TableCell>
                                            <StudentDisplay student={s} variant="list" showAvatar />
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={isInactive ? "secondary" : "default"} className={cn(isInactive ? "bg-slate-200 text-slate-600" : "bg-green-100 text-green-700")}>
                                                {currentStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {formatStudentId(s)}
                                        </TableCell>
                                        <TableCell>
                                            {s.classId ? (
                                                <Badge variant="secondary">{classes.find(c => c.id === s.classId)?.name || 'N/A'}</Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 font-bold italic">Needs Class</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {s.canteenBillingMode !== 'None' && <span title={`Canteen: ${s.canteenBillingMode}`}><Utensils className="h-4 w-4 text-orange-500"/></span>}
                                                {s.usesBusService && <span title={`Bus Subscriber (${s.transportBillingModel})`}><Bus className="h-4 w-4 text-blue-500" /></span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {canManage && (
                                                    <>
                                                        <Button variant="ghost" size="sm" onClick={() => setResetPasswordUser(s)} title="Reset Password">
                                                            <KeyRound className="h-4 w-4 text-orange-500"/>
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => toast({ title: "Opening direct SMS...", description: "Feature being integrated." })} title="Send Bill Reminder">
                                                            <MessageSquare className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => setEditingStudent(s)}><Edit className="h-4 w-4 text-blue-600"/></Button>
                                                        
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            type="button"
                                                            onClick={() => triggerArchive(s.id, s.enrollmentStatus)}
                                                            className={cn(isInactive ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" : "text-slate-400 hover:text-red-600 hover:bg-red-50")}
                                                            title={isInactive ? "Restore Student" : "Archive Student"}
                                                        >
                                                            {isInactive ? <RotateCcw className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                                                        </Button>
                                                    </>
                                                )}
                                                {isSecretary && (
                                                    <Button variant="ghost" size="sm" onClick={() => setEditingStudent(s)} className="text-indigo-600">
                                                        <Search className="h-4 w-4 mr-2" /> View Details
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </CardContent>
      </Card>

      <MigrateStudentIds />

      {/* ENROLLMENT MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Enrol New Student</DialogTitle></DialogHeader>
            <form onSubmit={handleAddStudent} className="space-y-4 mt-2">
                 <div className="flex flex-col items-center gap-4 py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <div className="relative h-24 w-24 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                        {photoPreviewUrl ? (
                            <img src={photoPreviewUrl} alt="Preview" className="h-full w-full object-cover" />
                        ) : (
                            <Camera className="h-8 w-8 text-slate-300" />
                        )}
                    </div>
                    <div className="flex flex-col items-center">
                        <Label htmlFor="photo-upload" className="cursor-pointer bg-white border px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm">
                            <Upload className="h-3 w-3"/> Select Profile Photo
                        </Label>
                        <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedPhoto(e.target.files?.[0] || null)} />
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
                            {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
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
                
                {canEditBillingToggles ? (
                    <div className="space-y-4 p-4 border rounded-xl bg-slate-50">
                        <h4 className="font-bold text-sm text-slate-700">Services & Subscriptions</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Utensils className="h-4 w-4 text-orange-500"/> Canteen Mode</Label>
                                <Select value={canteenBillingMode} onValueChange={(val: any) => setCanteenBillingMode(val)}>
                                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Daily">Daily</SelectItem>
                                        <SelectItem value="Termly">Termly</SelectItem>
                                        <SelectItem value="None">None</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Bus className="h-4 w-4 text-blue-500"/> Bus Subscription</Label>
                                <div className="flex items-center space-x-2 h-10">
                                    <Checkbox id="usesBusService" checked={usesBus} onCheckedChange={(v) => setUsesBus(!!v)} />
                                    <Label htmlFor="usesBusService" className="cursor-pointer font-medium text-slate-600">Uses School Bus</Label>
                                </div>
                            </div>
                        </div>
                        {usesBus && (
                            <div className="space-y-2 animate-in fade-in border-t pt-4">
                                <Label>Bus Billing Model</Label>
                                <Select value={billingModel} onValueChange={(val: any) => setBillingModel(val)}>
                                    <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="Daily">Daily</SelectItem><SelectItem value="Termly">Termly</SelectItem></SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-4 bg-slate-50 border rounded-xl flex items-center gap-3 opacity-60">
                        <Lock className="h-4 w-4 text-slate-400" />
                        <p className="text-xs text-slate-500 font-medium italic">Service toggles are locked by administration.</p>
                    </div>
                )}

                <DialogFooter>
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold" disabled={isSubmitting || isUploadingPhoto}>
                        {isSubmitting || isUploadingPhoto ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Enrol Student"}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      {/* EDIT/VIEW MODAL */}
      <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{canManage ? 'Edit Student Profile' : 'Student Profile'}</DialogTitle></DialogHeader>
            {editingStudent && (
                <form onSubmit={handleUpdateStudent} className="space-y-4 mt-2">
                    <div className="flex flex-col items-center gap-4 py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <div className="relative h-24 w-24 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                            {photoPreviewUrl ? (
                                <img src={photoPreviewUrl} alt="Preview" className="h-full w-full object-cover" />
                            ) : editingStudent.photoURL ? (
                                <img src={editingStudent.photoURL} alt="Current" className="h-full w-full object-cover" />
                            ) : (
                                <Camera className="h-8 w-8 text-slate-300" />
                            )}
                        </div>
                        {!isSecretary && (
                            <div className="flex flex-col items-center">
                                <Label htmlFor="photo-upload-edit" className="cursor-pointer bg-white border px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm">
                                    <Upload className="h-3 w-3"/> Change Profile Photo
                                </Label>
                                <input id="photo-upload-edit" type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedPhoto(e.target.files?.[0] || null)} />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>First Name</Label><Input name="firstName" defaultValue={editingStudent.firstName} required disabled={isSecretary} /></div>
                        <div className="space-y-2"><Label>Last Name</Label><Input name="lastName" defaultValue={editingStudent.lastName} required disabled={isSecretary} /></div>
                    </div>
                     <div className="space-y-2"><Label>Email</Label><Input value={editingStudent.email} disabled className="bg-slate-100 cursor-not-allowed" /></div>
                    <div className="space-y-2">
                        <Label>Class</Label>
                        <Select value={selectedClassId} onValueChange={setSelectedClassId} disabled={isSecretary}>
                            <SelectTrigger><SelectValue placeholder="Class" /></SelectTrigger>
                            <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Date of Birth</Label><Input name="dateOfBirth" type="date" defaultValue={editingStudent.dateOfBirth} disabled={isSecretary} /></div>
                        <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select value={selectedGender} onValueChange={setSelectedGender} disabled={isSecretary}>
                                <SelectTrigger><SelectValue placeholder="Gender"/></SelectTrigger>
                                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2"><Label>Address</Label><Input name="address" defaultValue={editingStudent.address} disabled={isSecretary} /></div>
                    
                    {canEditBillingToggles ? (
                        <div className="space-y-4 p-4 border rounded-xl bg-slate-50">
                            <h4 className="font-bold text-sm text-slate-700">Services & Subscriptions</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Utensils className="h-4 w-4 text-orange-500"/> Canteen Mode</Label>
                                    <Select value={canteenBillingMode} onValueChange={(val: any) => setCanteenBillingMode(val)}>
                                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Daily">Daily</SelectItem>
                                            <SelectItem value="Termly">Termly</SelectItem>
                                            <SelectItem value="None">None</SelectItem>
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
                                <div className="space-y-2 animate-in fade-in border-t pt-4">
                                    <Label>Bus Billing Model</Label>
                                    <Select value={billingModel} onValueChange={(val: any) => setBillingModel(val)}>
                                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                        <SelectContent><SelectItem value="Daily">Daily</SelectItem><SelectItem value="Termly">Termly</SelectItem></SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 bg-slate-50 border rounded-xl flex items-center gap-3 opacity-60">
                            <Lock className="h-4 w-4 text-slate-400" />
                            <p className="text-xs text-slate-500 font-medium italic">Service details are read-only.</p>
                        </div>
                    )}

                    <DialogFooter className="pt-4 border-t mt-6">
                        {canManage ? (
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold" disabled={isSubmitting || isUploadingPhoto}>
                                {isSubmitting || isUploadingPhoto ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Save Changes"}
                            </Button>
                        ) : (
                            <Button type="button" variant="outline" className="w-full h-12" onClick={() => setEditingStudent(null)}>Close Profile</Button>
                        )}
                    </DialogFooter>
                </form>
            )}
        </DialogContent>
      </Dialog>

      {/* PASSWORD RESET DIALOG */}
      <Dialog open={!!resetPasswordUser} onOpenChange={(open) => !open && setResetPasswordUser(null)}>
          <DialogContent className="sm:max-w-md">
              <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                      Set a temporary password for <strong>{resetPasswordUser?.firstName} {resetPasswordUser?.lastName}</strong>. 
                      They will be forced to change it upon their next login.
                  </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                  <div className="space-y-2">
                      <Label>Temporary Password</Label>
                      <Input 
                          type="text" 
                          value={newTempPassword} 
                          onChange={e => setNewTempPassword(e.target.value)} 
                          minLength={6}
                      />
                  </div>
                  <Button 
                      onClick={async () => {
                          if (!resetPasswordUser || newTempPassword.length < 6) return;
                          setIsResetting(true);
                          
                          const res = await adminResetUserPassword(resetPasswordUser.uid, newTempPassword, 'students');
                          
                          if (res.success) {
                              toast({ title: "Password Reset", description: `New password is: ${newTempPassword}` });
                              setResetPasswordUser(null);
                              setNewTempPassword('password123'); // Reset for next use
                          } else {
                              toast({ variant: 'destructive', title: "Error", description: res.error });
                          }
                          setIsResetting(false);
                      }} 
                      disabled={isResetting || newTempPassword.length < 6} 
                      className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                      {isResetting ? <Loader2 className="animate-spin mr-2"/> : <KeyRound className="mr-2 h-4 w-4"/>}
                      Force Password Reset
                  </Button>
              </div>
          </DialogContent>
      </Dialog>

      {/* --- TITAN-GRADE CONFIRMATION MODAL --- */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border-4 border-slate-900 space-y-6 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600 border-2 border-red-100">
              <AlertTriangle size={40} className="animate-pulse" />
            </div>
            
            <div>
              <h2 className="text-2xl font-black uppercase italic text-black">
                  Confirm <span className="text-red-600">{archiveTask?.currentStatus === 'Inactive' ? 'Restore' : 'Archive'}</span>
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase mt-2 leading-relaxed">
                {archiveTask?.currentStatus === 'Inactive' 
                  ? "Are you sure you want to restore this student? They will reappear in active lists and be subject to billing."
                  : "Are you sure you want to decommission this record? This student will be removed from active lists and billing immediately."}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => { setIsConfirmOpen(false); setArchiveTask(null); }}
                className="flex-1 py-4 font-black text-slate-400 uppercase text-xs tracking-widest hover:text-black transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={executeArchive}
                disabled={isSubmitting}
                className="flex-[2] bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-100 hover:bg-black transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Confirm Action"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
