'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, where, deleteField } from 'firebase/firestore';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Users, UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, HeartHandshake, Filter, UserCheck, KeyRound, Zap, RotateCcw, Sparkles } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { StudentSearchInput } from '@/components/student-search';
import { searchStudent } from '@/lib/student-utils';
import { useDashboardSummary } from '@/hooks/use-dashboard-summary';

// --- TYPE DEFINITIONS ---
type ParentMember = {
  id: string;
  uid: string;
  title?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  studentIds?: string[];
  schoolId?: string;
};

type Student = {
    id: string;
    uid: string;
    firstName: string;
    lastName: string;
    parentId?: string;
    schoolId?: string;
    enrollmentStatus?: 'Active' | 'Graduated' | 'Inactive';
};

// --- MAIN PAGE COMPONENT ---
export default function ParentsPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { role } = useRole();
  const { schoolId: adminSchoolId, loading: isLoadingSchoolId } = useCurrentSchool();
  const { summary: dashboardSummary } = useDashboardSummary(adminSchoolId);

  const [parents, setParents] = useState<ParentMember[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  // On-Demand Parent Loading State
  const [hasLoadedParents, setHasLoadedParents] = useState(false);
  const [isLoadingParents, setIsLoadingParents] = useState(false);

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<ParentMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password Reset State
  const [resetPasswordUser, setResetPasswordUser] = useState<any>(null);
  const [newTempPassword, setNewTempPassword] = useState('password123');
  const [isResetting, setIsResetting] = useState(false);

  // ✅ Controlled selection state
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [showOnlyUnlinked, setShowOnlyUnlinked] = useState(false);

  // Permissions
  const isSecretary = role === 'Secretary';
  const canManage = role === 'Director' || role === 'Administrator';

  const toggleStudentSelection = (uid: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  // --- 1. ON-DEMAND DATA FETCHING ---
  const loadParentData = useCallback(async () => {
    if (!firestore || !adminSchoolId) return;
    
    setIsLoadingParents(true);
    try {
        const parentQuery = query(collection(firestore, 'parents'), where('schoolId', '==', adminSchoolId));
        const studentQuery = query(collection(firestore, 'students'), where('schoolId', '==', adminSchoolId));

        const [parentSnap, studentSnap] = await Promise.all([
            getDocs(parentQuery),
            getDocs(studentQuery)
        ]);

        const parentList = parentSnap.docs.map(d => ({ id: d.id, ...d.data() })) as ParentMember[];
        const studentList = studentSnap.docs.map(d => ({ id: d.id, ...d.data() })) as Student[];

        setParents(parentList);
        setStudents(studentList);
        setHasLoadedParents(true);
        toast({ title: "Directory Loaded", description: `Loaded ${parentList.length} parent profiles on-demand.` });
    } catch (err: any) {
        console.error("Load Data Error:", err);
        toast({ variant: 'destructive', title: "Error", description: "Failed to load parent profiles." });
    } finally {
        setIsLoadingParents(false);
    }
  }, [firestore, adminSchoolId, toast]);

  const loadData = loadParentData;

  const resetToOnDemand = useCallback(() => {
    setParents([]);
    setStudents([]);
    setHasLoadedParents(false);
    toast({ title: "Switched to On-Demand Mode", description: "Parent records unloaded from memory to eliminate reads." });
  }, [toast]);

  useEffect(() => {
    if (isAddOpen) {
        setIsSubmitting(false);
        setStudentSearch('');
        setShowOnlyUnlinked(true);
        setSelectedStudentIds([]);
    }
  }, [isAddOpen]);

  useEffect(() => {
    if (editingParent) {
        setIsSubmitting(false);
        setStudentSearch('');
        setShowOnlyUnlinked(true);
        setSelectedStudentIds(editingParent.studentIds || []);
    }
  }, [editingParent]);
  
  // --- 2. ADD PARENT ---
  const handleAddParent = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isSubmitting || !firestore || !adminSchoolId) return; 
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const values = Object.fromEntries(formData.entries()) as any;
      const studentIds = selectedStudentIds;
      const password = "password123";

      try {
          const idToken = await auth?.currentUser?.getIdToken();
          const result = await createNewUser(values.email, password, 'Parent', { firstName: values.firstName, lastName: values.lastName }, adminSchoolId, idToken);
          if ('error' in result) throw new Error(result.error);

          await setDoc(doc(firestore, 'parents', result.uid), {
              uid: result.uid,
              title: values.title || '',
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              role: 'Parent',
              phone: values.phone,
              address: values.address,
              studentIds: studentIds,
              schoolId: adminSchoolId, 
              createdAt: serverTimestamp()
          });

          for (const studentId of studentIds) {
            const studentRef = doc(firestore, 'students', studentId);
            await updateDoc(studentRef, { parentId: result.uid });
          }

          toast({ title: "Success", description: "Parent created and linked successfully." });
          setIsAddOpen(false);
          loadData();

      } catch (error: any) {
          console.error("Error adding parent:", error);
          toast({ variant: 'destructive', title: "Error creating parent", description: error.message });
      } finally {
          setIsSubmitting(false);
      }
  };

  // --- 3. UPDATE PARENT ---
  const handleUpdateParent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingParent || isSubmitting || !firestore || !adminSchoolId) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries()) as any;
    const studentIds = selectedStudentIds;

    try {
        const parentRef = doc(firestore, 'parents', editingParent.id);
        await updateDoc(parentRef, { 
            title: values.title || '',
            firstName: values.firstName,
            lastName: values.lastName,
            role: 'Parent',
            phone: values.phone,
            address: values.address,
            studentIds, 
            updatedAt: serverTimestamp() 
        });

        const oldStudentIds = editingParent.studentIds || [];
        const studentsToUnlink = oldStudentIds.filter(id => !studentIds.includes(id));
        const studentsToLink = studentIds.filter(id => !oldStudentIds.includes(id));

        for (const studentId of studentsToUnlink) {
            const studentRef = doc(firestore, 'students', studentId);
            await updateDoc(studentRef, { parentId: deleteField() }); 
        }
        for (const studentId of studentsToLink) {
            const studentRef = doc(firestore, 'students', studentId);
            await updateDoc(studentRef, { parentId: editingParent.uid });
        }

        toast({ title: "Updated", description: "Parent details saved." });
        setEditingParent(null);
        loadData();

    } catch (error: any) {
        console.error("Error updating parent:", error);
        toast({ variant: 'destructive', title: "Error updating parent", description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- 4. DELETE PARENT ---
  const handleDelete = async (id: string) => {
    if (!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'parents', id));
        toast({ title: "Deleted", description: "Parent profile removed." });
        loadData();
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    }
  };

  const filteredParents = useMemo(() => parents.filter(p => searchStudent(p as any, searchTerm)), [parents, searchTerm]);
  
  const filteredStudentsForModal = useMemo(() => {
      let list = students.filter(s => s.enrollmentStatus !== 'Inactive' && searchStudent(s as any, studentSearch));
      if (showOnlyUnlinked) {
          list = list.filter(s => !s.parentId || selectedStudentIds.includes(s.uid) || (editingParent && s.parentId === editingParent.uid));
      }
      return list;
  }, [students, studentSearch, showOnlyUnlinked, editingParent, selectedStudentIds]);

  const overallLoading = isLoadingSchoolId;

  return (
    <div className="space-y-8 p-6">
      {/* Premium Rose/Pink Gradient Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 p-8 md:p-10 text-white shadow-xl shadow-pink-100/50 dark:shadow-none">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
              <Users className="h-3.5 w-3.5 text-pink-200" /> Family Relations
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">Parent Profiles</h1>
            <p className="mt-2 text-pink-100/90 max-w-xl text-sm leading-relaxed">
              Manage school-parent relationships, configure student assignments, and maintain directory profiles.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {hasLoadedParents ? (
              <>
                <Button variant="outline" onClick={loadParentData} disabled={isLoadingParents} className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white rounded-xl h-11">
                  <RefreshCw className={cn("h-4 w-4 mr-2", isLoadingParents && "animate-spin")}/> Refresh
                </Button>
                <Button variant="outline" onClick={resetToOnDemand} className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white rounded-xl h-11 text-xs font-semibold">
                  <RotateCcw className="h-4 w-4 mr-2"/> Switch to On-Demand
                </Button>
              </>
            ) : (
              <Button onClick={loadParentData} disabled={isLoadingParents} className="bg-white text-pink-700 hover:bg-pink-50 hover:text-pink-850 font-bold px-5 h-11 rounded-xl shadow-lg border border-pink-100 gap-2 cursor-pointer">
                {isLoadingParents ? <Loader2 className="h-4 w-4 animate-spin"/> : <Zap className="h-4 w-4 text-pink-600"/>}
                <span>Generate Parent List</span>
              </Button>
            )}
            {canManage && (
              <Button onClick={() => { if (!hasLoadedParents) loadParentData(); setIsAddOpen(true); }} className="bg-white text-pink-700 hover:bg-pink-50 hover:text-pink-850 font-bold px-5 h-11 rounded-xl shadow-lg border border-pink-100" disabled={!adminSchoolId}>
                <UserPlus className="h-4.5 w-4.5 mr-2"/> Add Parent Profile
              </Button>
            )}
          </div>
        </div>

        {/* Dynamic Metric Badges */}
        {adminSchoolId && (
          <div className="relative z-10 mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
            <div className="rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/5">
              <span className="text-[10px] text-pink-200 uppercase tracking-widest font-black">Linked Guardians</span>
              <div className="text-xl font-bold mt-0.5">
                {hasLoadedParents ? `${parents.length} Accounts` : 'On-Demand'}
              </div>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/5">
              <span className="text-[10px] text-pink-200 uppercase tracking-widest font-black">Associated Children</span>
              <div className="text-xl font-bold mt-0.5">
                {hasLoadedParents ? `${students.filter(s => s.parentId).length} Students Linked` : 'On-Demand'}
              </div>
            </div>
            <div className="ml-auto hidden lg:flex items-center gap-2 rounded-xl bg-black/20 px-3.5 py-2 border border-white/10 text-xs text-pink-100">
              <Zap className={cn("h-3.5 w-3.5", hasLoadedParents ? "text-pink-300" : "text-amber-300")} />
              <span>{hasLoadedParents ? "Full Directory In Memory" : "0 Upfront Firestore Reads Active"}</span>
            </div>
          </div>
        )}

        {/* Decorative glows */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      </div>
      
      {/* Main Card */}
      <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-6 space-y-6">
          {/* On-Demand Mode Bar when parents are loaded */}
          {hasLoadedParents && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-pink-50/90 via-rose-50/50 to-slate-50 border border-pink-200/70 rounded-2xl text-xs text-pink-950">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-pink-600 text-white font-bold shadow-xs shrink-0">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-bold text-pink-950">Active Parent Directory Mode</span>
                  <span className="text-pink-700 ml-2">({filteredParents.length} of {parents.length} profiles showing)</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={loadParentData}
                  disabled={isLoadingParents}
                  className="h-8 text-xs font-semibold rounded-lg border-pink-300 text-pink-800 hover:bg-pink-100/60"
                >
                  <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5 text-pink-600", isLoadingParents && "animate-spin")} /> Refresh
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetToOnDemand}
                  className="h-8 text-xs font-semibold rounded-lg border-pink-300 text-pink-800 hover:bg-pink-100/60"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5 text-pink-600" /> Switch to On-Demand
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm flex-grow">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <StudentSearchInput 
                value={searchTerm} 
                onChange={(val) => {
                  setSearchTerm(val);
                  if (!hasLoadedParents && val.trim().length >= 3) {
                    loadParentData();
                  }
                }} 
                className="pl-10 h-10 border-slate-200 focus-visible:ring-pink-500 rounded-xl"
                placeholder="Search parents by name or email..."
              />
            </div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              {hasLoadedParents ? `${filteredParents.length} Records` : 'On-Demand'}
            </span>
          </div>

          {isLoadingParents ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 bg-slate-50 border border-dashed rounded-2xl">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500 mb-2"/>
              <p className="text-xs uppercase font-bold tracking-wider font-mono">Loading Parent Directory On Demand...</p>
            </div>
          ) : !hasLoadedParents ? (
            <div className="py-16 px-6 text-center border-2 border-dashed border-pink-200/80 rounded-3xl bg-gradient-to-b from-pink-50/50 via-slate-50/30 to-white flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto shadow-xs my-4">
              <div className="h-16 w-16 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-inner">
                <HeartHandshake className="h-8 w-8 text-pink-600 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-pink-800 text-xs font-bold uppercase tracking-wider mb-1">
                  ⚡ Cost-Saving Architecture
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Parent Profiles Generated On-Demand</h3>
                <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                  To prevent automatic Firestore read spikes upon page open, parent records and linked student relationships are loaded only when requested.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button 
                  onClick={loadParentData}
                  disabled={isLoadingParents}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl h-11 px-7 shadow-md hover:shadow-lg transition-all gap-2 cursor-pointer text-sm"
                >
                  <Zap className="h-4 w-4" />
                  Generate Parent List
                </Button>
                {searchTerm.trim().length > 0 && (
                  <Button 
                    variant="outline"
                    onClick={loadParentData}
                    className="rounded-xl h-11 px-4 border-slate-200 hover:bg-slate-50"
                  >
                    Search Directory for "{searchTerm.trim()}"
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-100 w-full">
                <span>⚡ 0 upfront Firestore reads</span>
                <span>•</span>
                <span>Associated child linkages</span>
                <span>•</span>
                <span>Contact information & credentials</span>
              </div>
            </div>
          ) : filteredParents.length === 0 ? (
            <div className="py-16 text-center text-slate-400 border border-dashed rounded-2xl bg-slate-50 flex flex-col items-center gap-3">
              <Search className="h-8 w-8 text-slate-300" />
              <div>
                <p className="font-semibold text-slate-700">No parent profiles found</p>
                <p className="text-xs text-slate-400 mt-1">Try modifying your search or add a new parent.</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700 h-12">Parent Guardian</TableHead>
                    <TableHead className="font-bold text-slate-700 h-12">Email Address</TableHead>
                    <TableHead className="font-bold text-slate-700 h-12">Linked Students</TableHead>
                    <TableHead className="text-right font-bold text-slate-700 h-12 px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParents.map((p) => (
                    <TableRow key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600 font-bold border border-pink-100/50 text-sm group-hover:scale-105 transition-transform">
                            {p.firstName?.charAt(0) || '?'}{p.lastName?.charAt(0) || ''}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{p.title ? `${p.title} ` : ''}{p.firstName} {p.lastName}</div>
                            {p.phone && <div className="text-[10px] text-slate-400 font-medium">{p.phone}</div>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-slate-600 text-sm font-medium">{p.email}</TableCell>
                      <TableCell className="py-4">
                        <Badge variant="secondary" className="font-bold text-xs bg-slate-100 text-slate-700 border border-slate-200/50 rounded-md px-2 py-0.5">
                          {p.studentIds?.filter((sid: string) => {
                            const foundStudent = students.find(s => s.uid === sid);
                            return foundStudent && foundStudent.enrollmentStatus !== 'Inactive';
                          }).length || 0} Students
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-4 px-6">
                        <div className="flex justify-end gap-1.5">
                          {canManage && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => setResetPasswordUser(p)} title="Reset Password" className="h-8.5 w-8.5 p-0 hover:bg-amber-50 hover:text-amber-600 rounded-lg">
                                <KeyRound className="h-4.5 w-4.5 text-amber-500"/>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setEditingParent(p)} className="h-8.5 w-8.5 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
                                <Edit className="h-4.5 w-4.5"/>
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8.5 w-8.5 p-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg">
                                    <Trash2 className="h-4.5 w-4.5"/>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-3xl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-lg font-bold text-slate-800">Remove Parent Profile?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-500 text-sm">
                                      Are you sure you want to delete the profile for <strong>{p.title ? `${p.title} ` : ''}{p.firstName} {p.lastName}</strong>? This will unlink all associated students.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="gap-2">
                                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-rose-600 hover:bg-rose-700 rounded-xl font-bold">Delete Profile</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                          {isSecretary && (
                            <Button variant="ghost" size="sm" onClick={() => setEditingParent(p)} className="text-indigo-600 hover:bg-indigo-50 rounded-lg">
                              <Search className="h-4 w-4 mr-2" /> View Details
                            </Button>
                          )}
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Add New Parent</DialogTitle></DialogHeader>
            <form onSubmit={handleAddParent} className="space-y-4 mt-4">
                 <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2 col-span-1">
                      <Label>Title</Label>
                      <select name="title" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-2">
                        <option value="">None</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Prof.">Prof.</option>
                        <option value="Rev.">Rev.</option>
                        <option value="Hon.">Hon.</option>
                      </select>
                    </div>
                    <div className="space-y-2 col-span-1.5"><Label>First Name *</Label><Input name="firstName" required placeholder="Jane"/></div>
                    <div className="space-y-2 col-span-1.5"><Label>Last Name *</Label><Input name="lastName" required placeholder="Doe"/></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2"><Label>Email *</Label><Input name="email" type="email" required placeholder="jane.doe@example.com"/></div>
                     <div className="space-y-2"><Label>Phone</Label><Input name="phone" placeholder="024-xxx-xxxx"/></div>
                </div>
                <div className="space-y-2"><Label>Address</Label><Input name="address" placeholder="Residential Address" /></div>
                
                <div className="space-y-3 pt-2 border-t mt-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-indigo-600 font-bold">
                            Link Students
                            {selectedStudentIds.length > 0 && (
                                <span className="ml-2 text-xs font-normal text-pink-600">({selectedStudentIds.length} selected)</span>
                            )}
                        </Label>
                        <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                            <Checkbox 
                                id="unlinked-only-add" 
                                checked={showOnlyUnlinked} 
                                onCheckedChange={(v) => setShowOnlyUnlinked(!!v)} 
                            />
                            <Label htmlFor="unlinked-only-add" className="text-xs cursor-pointer text-indigo-700 font-black uppercase tracking-tighter">Only Unlinked</Label>
                        </div>
                    </div>
                    <StudentSearchInput value={studentSearch} onChange={setStudentSearch} placeholder="Search students to link..." />
                    <div className="max-h-48 overflow-y-auto space-y-1 rounded-xl border-2 p-2 mt-2 bg-slate-50/50">
                        {filteredStudentsForModal.length > 0 ? (
                            filteredStudentsForModal.map(s => (
                                <div
                                    key={s.id}
                                    className="flex items-center justify-between p-2.5 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                                    onClick={() => toggleStudentSelection(s.uid)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id={`add-${s.id}`}
                                            checked={selectedStudentIds.includes(s.uid)}
                                            onCheckedChange={() => toggleStudentSelection(s.uid)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="flex flex-col">
                                            <Label htmlFor={`add-${s.id}`} className="cursor-pointer font-bold text-slate-700">{s.firstName} {s.lastName}</Label>
                                            <span className="text-[10px] text-slate-400 font-mono">ID: {s.uid.slice(0,8)}</span>
                                        </div>
                                    </div>
                                    {s.parentId ? (
                                        <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-500 border-slate-200">Linked</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-[10px] bg-orange-50 text-orange-600 border-orange-200 font-bold uppercase tracking-widest">Unlinked</Badge>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="py-10 text-center flex flex-col items-center gap-2 opacity-40">
                                <Search className="h-8 w-8 text-slate-300" />
                                <p className="text-xs font-bold uppercase tracking-widest">No matching students</p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="pt-4 border-t"><Button type="submit" className="w-full h-12 text-lg font-bold bg-pink-500 hover:bg-pink-600" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Create Parent Account"}</Button></DialogFooter>
            </form>
        </DialogContent>
      </Dialog>

      {/* EDIT/VIEW MODAL */}
      <Dialog open={!!editingParent} onOpenChange={(open) => !open && setEditingParent(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{canManage ? 'Edit Parent Details' : 'Parent Profile'}</DialogTitle></DialogHeader>
            {editingParent && (
                <form onSubmit={handleUpdateParent} className="space-y-4 mt-4">
                    <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2 col-span-1">
                            <Label>Title</Label>
                            <select name="title" defaultValue={editingParent.title || ''} disabled={isSecretary} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-2">
                                <option value="">None</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Ms.">Ms.</option>
                                <option value="Dr.">Dr.</option>
                                <option value="Prof.">Prof.</option>
                                <option value="Rev.">Rev.</option>
                                <option value="Hon.">Hon.</option>
                            </select>
                        </div>
                        <div className="space-y-2 col-span-1.5">
                            <Label>First Name</Label>
                            <Input name="firstName" defaultValue={editingParent.firstName} required disabled={isSecretary} />
                        </div>
                        <div className="space-y-2 col-span-1.5">
                            <Label>Last Name</Label>
                            <Input name="lastName" defaultValue={editingParent.lastName} required disabled={isSecretary} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={editingParent.email} disabled className="bg-slate-100 cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input name="phone" defaultValue={editingParent.phone} disabled={isSecretary} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Address</Label>
                        <Input name="address" defaultValue={editingParent.address} disabled={isSecretary} />
                    </div>

                     <div className="space-y-3 pt-2 border-t mt-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-indigo-600 font-bold">
                                Linked Students
                                {selectedStudentIds.length > 0 && (
                                    <span className="ml-2 text-xs font-normal text-pink-600">({selectedStudentIds.length} selected)</span>
                                )}
                            </Label>
                            {!isSecretary && (
                                <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                    <Checkbox 
                                        id="unlinked-only-edit" 
                                        checked={showOnlyUnlinked} 
                                        onCheckedChange={(v) => setShowOnlyUnlinked(!!v)} 
                                    />
                                    <Label htmlFor="unlinked-only-edit" className="text-xs cursor-pointer text-indigo-700 font-black uppercase tracking-tighter">Only Unlinked</Label>
                                </div>
                            )}
                        </div>
                        
                        {!isSecretary && <StudentSearchInput value={studentSearch} onChange={setStudentSearch} placeholder="Search students to link..." />}
                        
                        <div className="max-h-48 overflow-y-auto space-y-1 rounded-xl border-2 p-2 mt-2 bg-slate-50/50">
                            {filteredStudentsForModal.length > 0 ? (
                                filteredStudentsForModal.map(s => {
                                    const isAttached = selectedStudentIds.includes(s.uid);
                                    if (isSecretary && !isAttached) return null;

                                    return (
                                        <div
                                            key={s.id}
                                            className={cn(
                                                "flex items-center justify-between p-2.5 rounded-lg border transition-all",
                                                isSecretary ? "bg-white border-slate-100" : "hover:bg-white border-transparent hover:border-slate-200 cursor-pointer"
                                            )}
                                            onClick={() => !isSecretary && toggleStudentSelection(s.uid)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                {!isSecretary && (
                                                    <Checkbox 
                                                        id={`edit-${s.id}`} 
                                                        checked={isAttached}
                                                        onCheckedChange={() => toggleStudentSelection(s.uid)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                )}
                                                <div className="flex flex-col">
                                                    <Label htmlFor={`edit-${s.id}`} className="font-bold text-slate-700">{s.firstName} {s.lastName}</Label>
                                                    <span className="text-[10px] text-slate-400 font-mono">ID: {s.uid.slice(0,8)}</span>
                                                </div>
                                            </div>
                                            {s.parentId ? (
                                                <Badge variant="outline" className={cn("text-[10px]", s.parentId === editingParent.uid ? "bg-green-100 text-green-700 border-green-200" : "bg-slate-100 text-slate-500 border-slate-200")}>
                                                    {s.parentId === editingParent.uid ? "Assigned Here" : "Linked Elsewhere"}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-[10px] bg-orange-50 text-orange-600 border-orange-200 font-bold uppercase tracking-widest">Unlinked</Badge>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-10 text-center opacity-40">
                                    <p className="text-xs font-bold uppercase tracking-widest">No matching students</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="pt-4 border-t mt-6">
                        {canManage ? (
                            <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Save Changes"}</Button>
                        ) : (
                            <Button type="button" variant="outline" className="w-full h-12" onClick={() => setEditingParent(null)}>Close Profile</Button>
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
                      Set a temporary password for <strong>{resetPasswordUser?.title ? `${resetPasswordUser.title} ` : ''}{resetPasswordUser?.firstName} {resetPasswordUser?.lastName}</strong>.  
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
                          
                          const idToken = await auth?.currentUser?.getIdToken();
                          const res = await adminResetUserPassword(resetPasswordUser.uid, newTempPassword, 'parents', idToken);
                          
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
    </div>
  );
}
