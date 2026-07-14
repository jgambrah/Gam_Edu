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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, GraduationCap, WifiOff, Database, Bug, Bus, Utensils, MessageSquare, Camera, Upload, Archive, RotateCcw, Filter, AlertTriangle, Lock, KeyRound, Home, Milestone, Printer } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { Student, Class, UserRole } from '@/lib/types';
import { MigrateStudentIds } from './migrate-student-ids';
import { StudentSearchInput } from '@/components/student-search';
import { StudentDisplay } from '@/components/student-display';
import { searchStudent, formatStudentId, generateNextStudentId } from '@/lib/student-utils';
import { sendSMSAction } from '@/app/actions/sms';
import { TimelineService } from '@/lib/timeline-service';
import { StudentJourneyTimeline } from '@/components/StudentJourneyTimeline';


export default function StudentsV3Page() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { role, profile, loading: isRoleLoading } = useRole();
  const { toast } = useToast();
  const { schoolId: adminSchoolId, loading: isLoadingSchool } = useCurrentSchool();

  // Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [hostelAllocations, setHostelAllocations] = useState<any[]>([]);
  const [parentMap, setParentMap] = useState<Record<string, any>>({});
  
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
  const [statusFilter, setStatusFilter] = useState<string>('Active');

  // Print Dialog States
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [printClassId, setPrintClassId] = useState('all');
  const [printStatus, setPrintStatus] = useState('Active');

  // Form State (Subscription Focused)
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [usesBus, setUsesBus] = useState(false);
  const [billingModel, setBillingModel] = useState<'Daily' | 'Termly'>('Daily');
  const [canteenBillingMode, setCanteenBillingMode] = useState<'Daily' | 'Termly' | 'None'>('Daily');
  const [selectedStatus, setSelectedStatus] = useState<string>('Active');
  const [isSponsored, setIsSponsored] = useState(false);
  const [selectedSponsorId, setSelectedSponsorId] = useState('');
  const [sponsorName, setSponsorName] = useState('');

  // --- PERMISSIONS ---
  const schoolSettingsQuery = useMemoFirebase(
      () => (firestore && adminSchoolId) ? doc(firestore, 'schoolSettings', adminSchoolId) : null,
      [firestore, adminSchoolId]
  );
  const { data: schoolSettings } = useDoc<any>(schoolSettingsQuery as any);

  const sponsorsQuery = useMemoFirebase(
      () => (firestore && adminSchoolId) ? query(collection(firestore, 'sponsors'), where('schoolId', '==', adminSchoolId)) : null,
      [firestore, adminSchoolId]
  );
  const { data: sponsorsList } = useCollection<any>(sponsorsQuery);

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

        const allocationQuery = query(
            collection(firestore, 'hostel_allocations'),
            where('schoolId', '==', adminSchoolId),
            where('status', '==', 'Active')
        );
        const allocationSnap = await getDocs(allocationQuery);
        const allocationList = allocationSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setHostelAllocations(allocationList);

        const parentQuery = query(collection(firestore, 'parents'), where('schoolId', '==', adminSchoolId));
        const parentSnap = await getDocs(parentQuery);
        const parentList = parentSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const pMap: Record<string, any> = {};
        parentList.forEach((p: any) => {
            if (p.studentIds && Array.isArray(p.studentIds)) {
                p.studentIds.forEach((sid: string) => {
                    pMap[sid] = p;
                });
            }
        });
        setParentMap(pMap);
        
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
        setIsSponsored(false);
        setSelectedSponsorId('');
        setSponsorName('');
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
        setSelectedStatus(editingStudent.enrollmentStatus || 'Active');
        setIsSponsored(editingStudent.isSponsored === true);
        setSelectedSponsorId(editingStudent.sponsorId || '');
        setSponsorName(editingStudent.sponsorName || '');
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
    if (!archiveTask || !firestore || !adminSchoolId || !user) return;
    
    setIsSubmitting(true);
    const { id, currentStatus } = archiveTask;
    const isCurrentlyActive = currentStatus === 'Active' || !currentStatus;
    const newStatus = isCurrentlyActive ? 'Inactive' : 'Active';

    const studentObj = students.find(s => s.id === id);
    const studentName = studentObj ? `${studentObj.firstName} ${studentObj.lastName}` : `Student (UID: ${id})`;

    try {
        const token = await user.getIdToken();
        const res = await fetch('/api/students/status-change', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ studentId: id, newStatus })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update status');

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
        toast({ variant: 'destructive', title: "Error", description: error.message || "Failed to update status." });
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
          const sponsorObj = sponsorsList?.find(sp => sp.id === selectedSponsorId);
          const finalSponsorName = isSponsored ? (sponsorObj?.name || null) : null;
          
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
              isSponsored: isSponsored,
              sponsorId: isSponsored ? selectedSponsorId : null,
              sponsorName: finalSponsorName,
              photoURL: photoURL || null,
              enrollmentStatus: 'Active',
              createdAt: serverTimestamp(),
              schoolId: adminSchoolId,
              bloodGroup: (values.bloodGroup as string) || null,
              chronicIllnesses: (values.chronicIllnesses as string) || null,
              allergies: (values.allergies as string) || null,
              healthNotes: (values.healthNotes as string) || null
          });

          try {
              await TimelineService.logEvent(firestore!, {
                  studentId: result.uid,
                  title: "Admitted & Enrolled",
                  description: `Officially admitted to the school registry and placed in class ${classes.find(c => c.id === selectedClassId)?.name || 'Unassigned'}.`,
                  category: 'admission',
                  classId: selectedClassId || null,
                  className: classes.find(c => c.id === selectedClassId)?.name || null,
                  schoolId: adminSchoolId,
                  recordedBy: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || 'System'),
                  recordedById: user?.uid || 'system',
                  academicYear: schoolSettings?.academicYear || '',
                  term: schoolSettings?.term || '',
                  date: new Date()
              });
          } catch (err) {
              console.error("Failed to log timeline event for enrollment:", err);
          }

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
    if (!editingStudent || isSubmitting || !firestore || !user) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());

    try {
        let photoURL = editingStudent.photoURL || null;
        if (selectedPhoto) {
            photoURL = await uploadProfilePhoto(editingStudent.uid, selectedPhoto) || photoURL;
        }

        // Call status-change API if status changed
        const statusChanged = selectedStatus !== (editingStudent.enrollmentStatus || 'Active');
        if (statusChanged) {
            const token = await user.getIdToken();
            const statusRes = await fetch('/api/students/status-change', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ studentId: editingStudent.id, newStatus: selectedStatus })
            });
            const statusData = await statusRes.json();
            if (!statusRes.ok) throw new Error(statusData.error || 'Failed to update status');
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
            bloodGroup: (values.bloodGroup as string) || null,
            chronicIllnesses: (values.chronicIllnesses as string) || null,
            allergies: (values.allergies as string) || null,
            healthNotes: (values.healthNotes as string) || null,
            updatedAt: serverTimestamp()
        };

        // Only update billing fields if the user has permission
        if (canEditBillingToggles) {
            const sponsorObj = sponsorsList?.find(sp => sp.id === selectedSponsorId);
            const finalSponsorName = isSponsored ? (sponsorObj?.name || null) : null;

            updateData.usesBusService = usesBus;
            updateData.transportBillingModel = usesBus ? billingModel : null;
            updateData.canteenBillingMode = canteenBillingMode || 'Daily';
            updateData.usesCanteen = canteenBillingMode !== 'None';
            updateData.isSponsored = isSponsored;
            updateData.sponsorId = isSponsored ? selectedSponsorId : null;
            updateData.sponsorName = finalSponsorName;
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

  const printedStudents = useMemo(() => {
    return students.filter(s => {
      const currentStatus = s.enrollmentStatus || 'Active';
      const matchesStatus = printStatus === 'All' ? true : currentStatus === printStatus;
      const matchesClass = printClassId === 'all' ? true : s.classId === printClassId;
      return matchesStatus && matchesClass;
    }).sort((a, b) => {
      const aName = `${a.firstName || ''} ${a.lastName || ''}`.trim();
      const bName = `${b.firstName || ''} ${b.lastName || ''}`.trim();
      return aName.localeCompare(bName);
    });
  }, [students, printClassId, printStatus]);

  const overallLoading = isLoadingSchool || isLoading;
  const isAuthorized = role === 'Director' || role === 'Administrator' || role === 'Secretary' || role === 'Receptionist';

  if (isUserLoading || isLoadingSchool || isRoleLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="p-6">
        <Card className="border-red-200/50 shadow-md">
          <CardHeader className="bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-400">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>This student directory is restricted to Directors, Administrators, Secretaries, and Receptionists.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Executive Emerald/Green Gradient Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 p-8 md:p-10 text-white shadow-xl shadow-emerald-100/50 dark:shadow-none">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
              <GraduationCap className="h-3.5 w-3.5 text-emerald-200" /> Academic Registry
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">Student Directory</h1>
            <p className="mt-2 text-emerald-100/90 max-w-xl text-sm leading-relaxed">
              Maintain the central student database, classes distribution tracking, parent relationship configurations, and service billing flags.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button variant="outline" onClick={loadData} disabled={overallLoading} className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white rounded-xl h-11">
              <RefreshCw className={cn("h-4 w-4 mr-2", overallLoading && "animate-spin")}/> Refresh
            </Button>
            <Button onClick={() => setIsPrintDialogOpen(true)} className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white font-bold px-5 h-11 rounded-xl shadow-md border-0" disabled={!adminSchoolId}>
              <Printer className="h-4.5 w-4.5 mr-2"/> Print Class List
            </Button>
            {canManage && (
              <Button onClick={() => setIsAddOpen(true)} className="bg-white text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 font-bold px-5 h-11 rounded-xl shadow-lg border border-emerald-100" disabled={!adminSchoolId}>
                <UserPlus className="h-4.5 w-4.5 mr-2"/> Enroll Student
              </Button>
            )}
          </div>
        </div>

        {/* Dynamic Metric Badges */}
        {adminSchoolId && (
          <div className="relative z-10 mt-8 flex flex-wrap gap-4 border-t border-white/10 pt-6">
            <div className="rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/5">
              <span className="text-[10px] text-emerald-200 uppercase tracking-widest font-black">Registered Students</span>
              <div className="text-xl font-bold mt-0.5">{students.length} Total</div>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/5">
              <span className="text-[10px] text-emerald-200 uppercase tracking-widest font-black">Active Cohorts</span>
              <div className="text-xl font-bold mt-0.5">{students.filter(s => s.enrollmentStatus === 'Active' || !s.enrollmentStatus).length} Enrolled</div>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/5">
              <span className="text-[10px] text-emerald-200 uppercase tracking-widest font-black">Pending Placement</span>
              <div className="text-xl font-bold mt-0.5 text-amber-200">{students.filter(s => !s.classId).length} Needs Class</div>
            </div>
          </div>
        )}

        {/* Decorative glows */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      </div>
      
      {/* Main card */}
      <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <StudentSearchInput 
                  value={searchTerm} 
                  onChange={setSearchTerm} 
                  className="flex-grow w-full md:max-w-md border-slate-200 focus:ring-emerald-500 rounded-xl"
                />
                
                <div className="flex flex-wrap gap-2 w-full md:w-auto items-center justify-end">
                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-full md:w-[180px] h-10 border-slate-200 rounded-xl"><SelectValue placeholder="All Classes" /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Classes</SelectItem>
                            <SelectItem value="unassigned" className="text-orange-600 font-bold">Unassigned</SelectItem>
                            {classes.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                        <SelectTrigger className="w-full md:w-[150px] h-10 border-slate-200 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="Active">Active Only</SelectItem>
                            <SelectItem value="Inactive">Archived Only</SelectItem>
                            <SelectItem value="Suspended">Suspended Only</SelectItem>
                            <SelectItem value="Withdrawn">Withdrawn Only</SelectItem>
                            <SelectItem value="Graduated">Graduated Only</SelectItem>
                            <SelectItem value="All">Show All</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {overallLoading ? (
                <div className="py-16 flex flex-col items-center gap-3 text-slate-400 bg-slate-50 border border-dashed rounded-2xl">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600"/>
                    <p className="text-xs uppercase font-bold tracking-wider">{statusMsg}</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="py-16 text-center text-slate-400 border border-dashed rounded-2xl bg-slate-50 flex flex-col items-center gap-3">
                    <WifiOff className="h-10 w-10 text-slate-300" />
                    <div>
                        <p className="font-semibold text-slate-700">No students found</p>
                        <p className="text-xs text-slate-400 mt-1">Try modifying your filter options or add a student.</p>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700 h-12">Student Profile</TableHead>
                                <TableHead className="font-bold text-slate-700 h-12">Enrollment Status</TableHead>
                                <TableHead className="font-bold text-slate-700 h-12">Student ID</TableHead>
                                <TableHead className="font-bold text-slate-700 h-12">Assigned Class</TableHead>
                                <TableHead className="font-bold text-slate-700 h-12">Housing Details</TableHead>
                                <TableHead className="font-bold text-slate-700 h-12">Subscribed Services</TableHead>
                                <TableHead className="text-right font-bold text-slate-700 h-12 px-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.map((s) => {
                                const currentStatus = s.enrollmentStatus || 'Active';
                                const isInactive = currentStatus === 'Inactive';
                                return (
                                    <TableRow key={s.id} className={cn("hover:bg-slate-50/30 transition-colors group", isInactive && "bg-slate-50/50 grayscale opacity-70")}>
                                        <TableCell className="py-4">
                                            <StudentDisplay student={s} variant="list" showAvatar />
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge 
                                                variant="outline"
                                                className={cn(
                                                    "font-bold text-xs rounded-md px-2 py-0.5",
                                                    currentStatus === 'Active' && "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-100",
                                                    currentStatus === 'Inactive' && "bg-slate-100 text-slate-600 border border-slate-200",
                                                    currentStatus === 'Suspended' && "bg-amber-50 text-amber-700 border border-amber-200",
                                                    currentStatus === 'Withdrawn' && "bg-rose-50 text-rose-700 border-rose-200",
                                                    currentStatus === 'Graduated' && "bg-blue-50 text-blue-700 border-blue-200"
                                                )}
                                            >
                                                {currentStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs py-4 text-slate-600 font-medium">
                                            {formatStudentId(s)}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex flex-col gap-1.5 items-start">
                                                {s.classId ? (
                                                    <Badge variant="secondary" className="font-semibold bg-slate-100 text-slate-700 border border-slate-200/50 rounded">{classes.find(c => c.id === s.classId)?.name || 'N/A'}</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-200 bg-amber-50 font-black tracking-wider uppercase">Unplaced</Badge>
                                                )}
                                                {s.isSponsored && (
                                                    <Badge variant="outline" className="font-black text-[9px] uppercase tracking-wider bg-indigo-50 border-indigo-200 text-indigo-700">
                                                        Sponsor: {s.sponsorName || 'NGO'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-xs">
                                            {(() => {
                                                const alloc = hostelAllocations.find(a => a.studentId === s.id);
                                                if (alloc) {
                                                    return (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-bold text-[12px] text-slate-800">{alloc.blockName}</span>
                                                            <span className="text-[11px] text-slate-500 font-medium">Room {alloc.roomNumber} (Bed {alloc.bedIdentifier})</span>
                                                        </div>
                                                    );
                                                }
                                                return <span className="text-xs text-slate-400 font-normal italic">Not Boarded</span>;
                                            })()}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex gap-2.5">
                                                {s.canteenBillingMode !== 'None' ? (
                                                    <span title={`Canteen: ${s.canteenBillingMode}`} className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                                                        <Utensils className="h-3.5 w-3.5"/>
                                                    </span>
                                                ) : null}
                                                {s.usesBusService ? (
                                                    <span title={`Bus Service: ${s.transportBillingModel}`} className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                                                        <Bus className="h-3.5 w-3.5" />
                                                    </span>
                                                ) : null}
                                                {s.canteenBillingMode === 'None' && !s.usesBusService && (
                                                    <span className="text-xs text-slate-400 font-medium italic">None</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right py-4 px-6">
                                            <div className="flex justify-end gap-1.5">
                                                {canManage && (
                                                    <>
                                                        <Button variant="ghost" size="sm" onClick={() => setResetPasswordUser(s)} title="Reset Password" className="h-8.5 w-8.5 p-0 hover:bg-amber-50 hover:text-amber-600 rounded-lg">
                                                            <KeyRound className="h-4.5 w-4.5 text-amber-500"/>
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => toast({ title: "Opening direct SMS...", description: "Feature being integrated." })} title="Send Bill Reminder" className="h-8.5 w-8.5 p-0 hover:bg-slate-100 rounded-lg">
                                                            <MessageSquare className="h-4.5 w-4.5 text-slate-500" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => setEditingStudent(s)} className="h-8.5 w-8.5 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
                                                            <Edit className="h-4.5 w-4.5"/>
                                                        </Button>
                                                        
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            type="button"
                                                            onClick={() => triggerArchive(s.id, s.enrollmentStatus)}
                                                            className={cn("h-8.5 w-8.5 p-0 rounded-lg", isInactive ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50")}
                                                            title={isInactive ? "Restore Student" : "Archive Student"}
                                                        >
                                                            {isInactive ? <RotateCcw className="h-4.5 w-4.5" /> : <Archive className="h-4.5 w-4.5" />}
                                                        </Button>
                                                    </>
                                                )}
                                                {isSecretary && (
                                                    <Button variant="ghost" size="sm" onClick={() => setEditingStudent(s)} className="text-indigo-600 hover:bg-indigo-50">
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
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Blood Group</Label>
                        <Select name="bloodGroup">
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Chronic Illnesses / Conditions</Label>
                        <Input name="chronicIllnesses" placeholder="e.g. Asthma, Diabetes" />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Allergies</Label>
                        <Input name="allergies" placeholder="e.g. Peanuts, Penicillin, Dust" />
                    </div>
                    <div className="space-y-2">
                        <Label>Other Health Notes / Issues</Label>
                        <Input name="healthNotes" placeholder="e.g. Wears glasses, ADHD" />
                    </div>
                </div>
                
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
                        <div className="space-y-2 border-t pt-4">
                            <Label className="flex items-center gap-2 font-bold text-slate-700">NGO / Third-Party Sponsorship</Label>
                            <div className="flex items-center space-x-2 h-10 mt-1">
                                <Checkbox id="isSponsored" checked={isSponsored} onCheckedChange={(v) => setIsSponsored(!!v)} />
                                <Label htmlFor="isSponsored" className="cursor-pointer font-semibold text-slate-655">Fees Paid by NGO / Sponsor</Label>
                            </div>
                            {isSponsored && (
                                <div className="space-y-1.5 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <Label className="text-xs font-bold text-slate-500">Select Sponsor / NGO *</Label>
                                    {sponsorsList && sponsorsList.length > 0 ? (
                                        <Select value={selectedSponsorId} onValueChange={setSelectedSponsorId}>
                                            <SelectTrigger className="bg-white"><SelectValue placeholder="Choose a registered sponsor" /></SelectTrigger>
                                            <SelectContent>
                                                {sponsorsList.map((sp: any) => (
                                                    <SelectItem key={sp.id} value={sp.id}>{sp.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="p-3 bg-amber-50 text-amber-700 text-xs border border-amber-200 rounded-lg flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 shrink-0" />
                                            <span>No sponsors registered in the registry. Go to Accounts &gt; Sponsors to create one.</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{canManage ? 'Edit Student Profile' : 'Student Profile'}</DialogTitle></DialogHeader>
            {editingStudent && (
                <Tabs defaultValue="profile" className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl">
                        <TabsTrigger value="profile" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <GraduationCap className="h-4 w-4 mr-2" /> Profile Details
                        </TabsTrigger>
                        <TabsTrigger value="timeline" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <Milestone className="h-4 w-4 mr-2" /> Journey Timeline
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="profile" className="mt-4">
                        <form onSubmit={handleUpdateStudent} className="space-y-4">
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label>Email</Label><Input value={editingStudent.email} disabled className="bg-slate-100 cursor-not-allowed" /></div>
                                <div className="space-y-2">
                                    <Label>Enrollment Status</Label>
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus} disabled={isSecretary}>
                                        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                            <SelectItem value="Suspended">Suspended</SelectItem>
                                            <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                                            <SelectItem value="Graduated">Graduated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Blood Group</Label>
                                    <Select name="bloodGroup" defaultValue={editingStudent.bloodGroup || editingStudent.medical?.bloodGroup || ''} disabled={isSecretary}>
                                        <SelectTrigger className="bg-white">
                                            <SelectValue placeholder="Select blood group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A+">A+</SelectItem>
                                            <SelectItem value="A-">A-</SelectItem>
                                            <SelectItem value="B+">B+</SelectItem>
                                            <SelectItem value="B-">B-</SelectItem>
                                            <SelectItem value="AB+">AB+</SelectItem>
                                            <SelectItem value="AB-">AB-</SelectItem>
                                            <SelectItem value="O+">O+</SelectItem>
                                            <SelectItem value="O-">O-</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Chronic Illnesses / Conditions</Label>
                                    <Input name="chronicIllnesses" placeholder="e.g. Asthma, Diabetes" defaultValue={editingStudent.chronicIllnesses || editingStudent.medical?.conditions || ''} disabled={isSecretary} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Allergies</Label>
                                    <Input name="allergies" placeholder="e.g. Peanuts, Penicillin, Dust" defaultValue={editingStudent.allergies || editingStudent.medical?.allergies || ''} disabled={isSecretary} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Other Health Notes / Issues</Label>
                                    <Input name="healthNotes" placeholder="e.g. Wears glasses, ADHD" defaultValue={editingStudent.healthNotes || ''} disabled={isSecretary} />
                                </div>
                            </div>

                            {/* Boarding & Housing Details (Read-only Profile section) */}
                            {(() => {
                                const alloc = hostelAllocations.find(a => a.studentId === editingStudent.id);
                                if (alloc) {
                                    return (
                                        <div className="p-4 border rounded-2xl bg-indigo-50/30 border-indigo-100 space-y-2.5 shadow-sm">
                                            <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                                                <Home className="h-4 w-4" /> Boarding & Housing Allocation
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div>
                                                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Hostel Block</span>
                                                    <span className="font-semibold text-slate-800 text-[13px]">{alloc.blockName}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Room & Bed</span>
                                                    <span className="font-semibold text-slate-800 text-[13px]">Room {alloc.roomNumber} (Bed {alloc.bedIdentifier})</span>
                                                </div>
                                                <div className="col-span-2 border-t border-indigo-100/50 pt-2 mt-1">
                                                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Check-in Date</span>
                                                    <span className="font-semibold text-slate-800">
                                                        {alloc.checkInDate?.toDate ? alloc.checkInDate.toDate().toLocaleDateString() : new Date(alloc.checkInDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                            
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
                                    <div className="space-y-2 border-t pt-4">
                                        <Label className="flex items-center gap-2 font-bold text-slate-700">NGO / Third-Party Sponsorship</Label>
                                        <div className="flex items-center space-x-2 h-10 mt-1">
                                            <Checkbox id="editIsSponsored" checked={isSponsored} onCheckedChange={(v) => setIsSponsored(!!v)} />
                                            <Label htmlFor="editIsSponsored" className="cursor-pointer font-semibold text-slate-655">Fees Paid by NGO / Sponsor</Label>
                                        </div>
                                        {isSponsored && (
                                            <div className="space-y-1.5 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                                <Label className="text-xs font-bold text-slate-500">Select Sponsor / NGO *</Label>
                                                {sponsorsList && sponsorsList.length > 0 ? (
                                                    <Select value={selectedSponsorId} onValueChange={setSelectedSponsorId}>
                                                        <SelectTrigger className="bg-white"><SelectValue placeholder="Choose a registered sponsor" /></SelectTrigger>
                                                        <SelectContent>
                                                            {sponsorsList.map((sp: any) => (
                                                                <SelectItem key={sp.id} value={sp.id}>{sp.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <div className="p-3 bg-amber-50 text-amber-700 text-xs border border-amber-200 rounded-lg flex items-center gap-2">
                                                        <AlertTriangle className="h-4 w-4 shrink-0" />
                                                        <span>No sponsors registered in the registry. Go to Accounts &gt; Sponsors to create one.</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
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
                    </TabsContent>
                    
                    <TabsContent value="timeline" className="mt-4">
                        <StudentJourneyTimeline studentId={editingStudent.id} />
                    </TabsContent>
                </Tabs>
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

      {/* ==================== PRINT CLASS ROSTER DIALOG ==================== */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <Printer className="h-5 w-5 text-emerald-600" /> Print Class Roster
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Configure parameters to export or print a student list in PDF format.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Class Group</Label>
              <Select value={printClassId} onValueChange={setPrintClassId}>
                <SelectTrigger className="w-full h-11 border-slate-200 rounded-xl focus:ring-emerald-500">
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">Whole School (All Classes)</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase">Enrollment Status</Label>
              <Select value={printStatus} onValueChange={setPrintStatus}>
                <SelectTrigger className="w-full h-11 border-slate-200 rounded-xl focus:ring-emerald-500">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="All">All Cohorts (Active & Inactive)</SelectItem>
                  <SelectItem value="Active">Active Enrolled</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setIsPrintDialogOpen(false)}
              className="rounded-xl font-bold border-slate-200 shadow-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsPrintDialogOpen(false);
                setTimeout(() => {
                  // Build the HTML for the roster
                  const schoolName = schoolSettings?.name || schoolSettings?.schoolName || 'School Name';
                  const motto = schoolSettings?.motto || '';
                  const contactParts = [
                    schoolSettings?.address,
                    schoolSettings?.phone ? `Tel: ${schoolSettings.phone}` : '',
                    schoolSettings?.email ? `Email: ${schoolSettings.email}` : '',
                  ].filter(Boolean).join('  |  ');
                  const selectedClass = printClassId === 'all' ? 'Whole School \u2014 All Classes' : classes.find((c: any) => c.id === printClassId)?.name || 'Unassigned';
                  const statusLabel = printStatus === 'All' ? 'All Cohorts' : printStatus;
                  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

                  const rows = printedStudents.map((s: any, idx: number) => {
                    const studentClass = classes.find((c: any) => c.id === s.classId)?.name || 'Unassigned';
                    const guardian = parentMap[s.uid] || parentMap[s.id];
                    const guardianName = guardian ? `${guardian.firstName || ''} ${guardian.lastName || ''}`.trim() || '\u2014' : '\u2014';
                    const guardianPhone = guardian?.phone || '\u2014';
                    const bg = idx % 2 === 0 ? '#fff' : '#f8fafc';
                    return `<tr style="background:${bg};page-break-inside:avoid">
                      <td style="padding:4px 6px;border:1px solid #cbd5e1;text-align:center;font-weight:700;color:#64748b">${idx + 1}</td>
                      <td style="padding:4px 6px;border:1px solid #cbd5e1;font-family:monospace;font-size:7.5pt">${formatStudentId(s)}</td>
                      <td style="padding:4px 6px;border:1px solid #cbd5e1;font-weight:600">${`${s.firstName || ''} ${s.lastName || ''}`.trim()}</td>
                      <td style="padding:4px 6px;border:1px solid #cbd5e1;text-align:center;text-transform:capitalize">${s.gender || '\u2014'}</td>
                      <td style="padding:4px 6px;border:1px solid #cbd5e1;font-weight:500">${studentClass}</td>
                      <td style="padding:4px 6px;border:1px solid #cbd5e1">${guardianName}</td>
                      <td style="padding:4px 6px;border:1px solid #cbd5e1;font-family:monospace;font-size:7.5pt">${guardianPhone}</td>
                    </tr>`;
                  }).join('');

                  const html = `<!DOCTYPE html>
<html><head><title>Student Roster - ${schoolName}</title>
<style>
  @page { size: A4 portrait; margin: 18mm 15mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 9pt; color: #000; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  thead { display: table-header-group; }
  tr { page-break-inside: avoid; }
</style>
</head><body>
  <div style="border-bottom:2.5px solid #111;padding-bottom:10px;margin-bottom:12px;text-align:center">
    <h1 style="font-size:16pt;font-weight:900;letter-spacing:0.04em;text-transform:uppercase;color:#111;margin:0">${schoolName}</h1>
    ${motto ? `<p style="font-size:8pt;font-style:italic;color:#444;margin:3px 0 0;letter-spacing:0.05em;text-transform:uppercase">&ldquo;${motto}&rdquo;</p>` : ''}
    <p style="font-size:8pt;color:#555;margin:4px 0 0">${contactParts}</p>
  </div>
  <div style="text-align:center;margin-bottom:8px">
    <h2 style="font-size:11pt;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:#222;margin:0">Official Student Roster</h2>
  </div>
  <div style="display:flex;justify-content:space-between;font-size:7.5pt;color:#444;background:#f1f5f9;padding:5px 8px;border-radius:3px;margin-bottom:10px;border:1px solid #cbd5e1">
    <span><strong>Class:</strong>&nbsp;${selectedClass}</span>
    <span><strong>Total Students:</strong>&nbsp;${printedStudents.length}</span>
    <span><strong>Status:</strong>&nbsp;${statusLabel}</span>
    <span><strong>Printed:</strong>&nbsp;${dateStr}</span>
  </div>
  <table style="width:100%;border-collapse:collapse;font-size:8pt;table-layout:fixed">
    <colgroup><col style="width:4%"><col style="width:12%"><col style="width:22%"><col style="width:7%"><col style="width:13%"><col style="width:22%"><col style="width:20%"></colgroup>
    <thead>
      <tr style="background:#1e293b;color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact">
        <th style="padding:5px 6px;border:1px solid #334155;font-weight:700;text-align:center;font-size:7pt;text-transform:uppercase;letter-spacing:0.04em">#</th>
        <th style="padding:5px 6px;border:1px solid #334155;font-weight:700;text-align:left;font-size:7pt;text-transform:uppercase;letter-spacing:0.04em">Student ID</th>
        <th style="padding:5px 6px;border:1px solid #334155;font-weight:700;text-align:left;font-size:7pt;text-transform:uppercase;letter-spacing:0.04em">Full Name</th>
        <th style="padding:5px 6px;border:1px solid #334155;font-weight:700;text-align:center;font-size:7pt;text-transform:uppercase;letter-spacing:0.04em">Gender</th>
        <th style="padding:5px 6px;border:1px solid #334155;font-weight:700;text-align:left;font-size:7pt;text-transform:uppercase;letter-spacing:0.04em">Class</th>
        <th style="padding:5px 6px;border:1px solid #334155;font-weight:700;text-align:left;font-size:7pt;text-transform:uppercase;letter-spacing:0.04em">Guardian Name</th>
        <th style="padding:5px 6px;border:1px solid #334155;font-weight:700;text-align:left;font-size:7pt;text-transform:uppercase;letter-spacing:0.04em">Guardian Contact</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="7" style="padding:14px;text-align:center;color:#64748b;font-style:italic;border:1px solid #cbd5e1">No students found.</td></tr>'}
    </tbody>
  </table>
  <div style="margin-top:6px;text-align:right;font-size:7.5pt;color:#475569">Total records: <strong>${printedStudents.length}</strong> student${printedStudents.length !== 1 ? 's' : ''}</div>
  <div style="margin-top:28px;padding-top:14px;border-top:1px solid #cbd5e1;display:flex;justify-content:space-between;align-items:flex-end">
    <div style="display:flex;flex-direction:column;gap:4px;min-width:200px">
      <span style="font-size:7.5pt;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Prepared &amp; Verified By</span>
      <div style="height:1px;width:200px;background:#94a3b8;margin-top:32px"></div>
      <span style="font-size:7pt;color:#64748b">Name &amp; Signature / Date</span>
    </div>
    <div style="display:flex;flex-direction:column;gap:4px;min-width:200px;align-items:flex-end">
      <span style="font-size:7.5pt;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Authorised By (Head of School)</span>
      <div style="height:1px;width:200px;background:#94a3b8;margin-top:32px"></div>
      <span style="font-size:7pt;color:#64748b">Name &amp; Signature / Date</span>
    </div>
  </div>
  <div style="margin-top:10px;text-align:center;font-size:7pt;color:#94a3b8;letter-spacing:0.04em">
    This is an official document of ${schoolName}. Unauthorised reproduction is prohibited.
  </div>
</body></html>`;

                  const printWin = window.open('', '_blank', 'width=800,height=600');
                  if (printWin) {
                    printWin.document.write(html);
                    printWin.document.close();
                    printWin.focus();
                    setTimeout(() => { printWin.print(); }, 400);
                  }
                }, 300);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg border-0"
            >
              Print PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
