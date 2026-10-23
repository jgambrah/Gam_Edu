'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { LoginDetailsCard } from '@/components/auth/LoginDetailsCard';
import { NewAccountPasswordDialog, type NewAccountCredentials } from '@/components/auth/NewAccountPasswordDialog';
import { makeFriendlyPassword } from '@/lib/friendly-password';
import Link from 'next/link';
import { useAuth, useFirestore } from '@/firebase';
import { collection, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, where, deleteField } from 'firebase/firestore';
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
import { Users, UserPlus, Trash2, Loader2, Search, RefreshCw, Edit, HeartHandshake, Filter, UserCheck, KeyRound, Zap, RotateCcw, Sparkles, PackageCheck, ExternalLink } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { StudentSearchInput } from '@/components/student-search';
import { searchStudent } from '@/lib/student-utils';
import { useDashboardSummary } from '@/hooks/use-dashboard-summary';
import { SectionHeroBanner } from '@/components/common/SectionHeroBanner';

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

export interface ParentDirectorySnapshotDoc {
  id: string;
  schoolId: string;
  updatedAt: string;
  parentCount: number;
  parents: ParentMember[];
  students: Student[];
}

const slimStudent = (s: any): Student => {
  const out: any = { id: s.id, uid: s.uid || s.id, firstName: s.firstName || '', lastName: s.lastName || '' };
  ['classId', 'parentId', 'enrollmentStatus', 'studentId', 'isArchived', 'schoolId'].forEach(k => { if (s[k] !== undefined && s[k] !== null) out[k] = s[k]; });
  return out as Student;
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
  const [activeSnapshot, setActiveSnapshot] = useState<ParentDirectorySnapshotDoc | null>(null);
  const [isCompilingSnapshot, setIsCompilingSnapshot] = useState(false);

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  // Shown right after an account is created: give the temporary password now, or note where to get it later.
  const [newAccount, setNewAccount] = useState<NewAccountCredentials | null>(null);
  const [editingParent, setEditingParent] = useState<ParentMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password Reset State
  const [resetPasswordUser, setResetPasswordUser] = useState<any>(null);
  const [newTempPassword, setNewTempPassword] = useState('');
  const [loginDetailsTick, setLoginDetailsTick] = useState(0);
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

  // --- RECOMPILE 1-READ SNAPSHOT (SWEEPS RAW COLLECTIONS ONCE AND SAVES CONSOLIDATED DOCUMENT) ---
  const handleRecompileParentSnapshot = useCallback(async () => {
    if (!firestore || !adminSchoolId) return;
    
    setIsCompilingSnapshot(true);
    setIsLoadingParents(true);
    try {
        const parentQuery = query(collection(firestore, 'parents'), where('schoolId', '==', adminSchoolId));
        const studentQuery = query(collection(firestore, 'students'), where('schoolId', '==', adminSchoolId));

        const [parentSnap, studentSnap] = await Promise.all([
            getDocs(parentQuery),
            getDocs(studentQuery)
        ]);

        const parentList = parentSnap.docs.map(d => ({ id: d.id, ...d.data() })) as ParentMember[];
        // Only the fields this page needs (the snapshot used to copy whole pupil records, health notes included).
        const studentList = studentSnap.docs.map(d => slimStudent({ id: d.id, ...d.data() }));

        const snapshotDocId = adminSchoolId;
        const snapshotPayload: ParentDirectorySnapshotDoc = {
          id: snapshotDocId,
          schoolId: adminSchoolId,
          updatedAt: new Date().toISOString(),
          parentCount: parentList.length,
          parents: parentList,
          students: studentList
        };

        const snapRef = doc(firestore, 'parent_directory_snapshots', snapshotDocId);
        try {
          await setDoc(snapRef, snapshotPayload, { merge: true });
          toast({ 
            title: "1-Read Snapshot Compiled & Saved 📦", 
            description: `Consolidated ${parentList.length} parent profiles into 1 document for future instant, 1-read loads.` 
          });
        } catch (cacheErr) {
          console.warn("Parent snapshot cache write notice (live data will be used):", cacheErr);
          toast({ 
            title: "Parent Profiles Loaded 📦", 
            description: `Loaded ${parentList.length} parent profiles directly from database.` 
          });
        }

        setParents(parentList);
        setStudents(studentList);
        setActiveSnapshot(snapshotPayload);
        setHasLoadedParents(true);
    } catch (err: any) {
        console.error("Recompile Parent Snapshot Error:", err);
        toast({ variant: 'destructive', title: "Loading Failed", description: err.message || "Failed to load parent profiles." });
    } finally {
        setIsCompilingSnapshot(false);
        setIsLoadingParents(false);
    }
  }, [firestore, adminSchoolId, toast]);

  // --- ON-DEMAND 1-READ DATA FETCHING ---
  const loadParentData = useCallback(async () => {
    if (!firestore || !adminSchoolId) return;
    
    setIsLoadingParents(true);
    try {
        const snapDocId = adminSchoolId;
        const snapRef = doc(firestore, 'parent_directory_snapshots', snapDocId);
        const snap = await getDoc(snapRef); // EXACTLY 1 FIRESTORE READ!

        if (snap.exists()) {
          const data = snap.data() as ParentDirectorySnapshotDoc;
          setParents(data.parents || []);
          setStudents(data.students || []);
          setActiveSnapshot(data);
          setHasLoadedParents(true);
          toast({ 
            title: "1-Read Parent Profiles Loaded! 📦", 
            description: `Retrieved ${data.parents?.length || 0} parent accounts in a single document read.` 
          });
        } else {
          // Snapshot not compiled yet: compile once and save
          await handleRecompileParentSnapshot();
        }
    } catch (err: any) {
        console.error("Snapshot Load Error:", err);
        try {
          await handleRecompileParentSnapshot();
        } catch (fallbackErr: any) {
          toast({ variant: 'destructive', title: "Error", description: "Failed to load parent profiles." });
        }
    } finally {
        setIsLoadingParents(false);
    }
  }, [firestore, adminSchoolId, toast, handleRecompileParentSnapshot]);

  const loadData = handleRecompileParentSnapshot;

  const resetToOnDemand = useCallback(() => {
    setParents([]);
    setStudents([]);
    setActiveSnapshot(null);
    setHasLoadedParents(false);
    toast({ title: "Switched to On-Demand Mode", description: "Parent records unloaded from memory to eliminate reads." });
  }, [toast]);

  // Open the directory straight away (one read of the saved list; it is rebuilt only when it does not exist).
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const searchParam = params.get('search');
      if (searchParam) setSearchTerm(searchParam);
    }
    if (adminSchoolId && firestore && !hasLoadedParents && !isLoadingParents) loadParentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminSchoolId, firestore]);

  // After a change, update the list on screen and the saved directory (1 write) instead of re-reading every
  // parent and pupil of the school (it used to re-read ~400 records after each save).
  const applyLocal = useCallback(async (nextParents: ParentMember[], nextStudents: Student[]) => {
    setParents(nextParents);
    setStudents(nextStudents);
    if (!firestore || !adminSchoolId) return;
    const payload: ParentDirectorySnapshotDoc = {
      id: adminSchoolId, schoolId: adminSchoolId, updatedAt: new Date().toISOString(),
      parentCount: nextParents.length, parents: nextParents, students: nextStudents.map(slimStudent),
    };
    setActiveSnapshot(payload);
    try { await setDoc(doc(firestore, 'parent_directory_snapshots', adminSchoolId), payload); }
    catch (err) { console.warn('Parent directory save notice:', err); }
  }, [firestore, adminSchoolId]);

  // The pupil record to update for a selected id (ids in the list are uids; the record id can differ).
  const studentDocId = (sid: string) => (students.find(s => s.uid === sid || s.id === sid) as any)?.id || sid;

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
      // Easy temporary password (e.g. "mango4827"), different for every parent; the school can look it up
      // again any time from the key button until the parent chooses their own.
      const password = makeFriendlyPassword();

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
            await updateDoc(doc(firestore, 'students', studentDocId(studentId)), { parentId: result.uid });
          }

          toast({ title: "Success", description: "Parent created and linked." });
          setNewAccount({ name: `${values.firstName || ''} ${values.lastName || ''}`.trim(), email: values.email, password, whereLater: 'Parent Directory' });
          setIsAddOpen(false);
          await applyLocal(
            [{ id: result.uid, uid: result.uid, title: values.title || '', firstName: values.firstName, lastName: values.lastName, email: values.email, phone: values.phone, address: values.address, studentIds, schoolId: adminSchoolId } as any, ...parents],
            students.map(s => studentIds.includes(s.uid) ? { ...s, parentId: result.uid } : s)
          );

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

        const parentUid = editingParent.uid || editingParent.id;
        // Unlinking clears the pupil's parent only if it still points to THIS parent (a pupil linked to the
        // other parent keeps that link; before, it was wiped).
        for (const studentId of studentsToUnlink) {
            const st = students.find(s => s.uid === studentId || s.id === studentId);
            if (st && st.parentId && st.parentId !== parentUid) continue;
            await updateDoc(doc(firestore, 'students', studentDocId(studentId)), { parentId: deleteField() });
        }
        for (const studentId of studentsToLink) {
            await updateDoc(doc(firestore, 'students', studentDocId(studentId)), { parentId: parentUid });
        }

        toast({ title: "Updated", description: "Parent details saved." });
        setEditingParent(null);
        await applyLocal(
          parents.map(p => p.id === editingParent.id ? { ...p, title: values.title || '', firstName: values.firstName, lastName: values.lastName, phone: values.phone, address: values.address, studentIds } : p),
          students.map(s => studentsToLink.includes(s.uid) ? { ...s, parentId: parentUid }
            : (studentsToUnlink.includes(s.uid) && (!s.parentId || s.parentId === parentUid)) ? { ...s, parentId: undefined } : s)
        );

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
        const p = parents.find(x => x.id === id);
        const parentUid = (p as any)?.uid || id;
        await deleteDoc(doc(firestore, 'parents', id));
        // Clear the link on that parent's pupils (before, they kept pointing to a parent that no longer exists).
        const linked = students.filter(s => s.parentId === parentUid);
        for (const s of linked) {
            try { await updateDoc(doc(firestore, 'students', (s as any).id || s.uid), { parentId: deleteField() }); } catch (err) { console.warn('Unlink notice:', err); }
        }
        toast({ title: "Deleted", description: "Parent profile removed." });
        await applyLocal(parents.filter(x => x.id !== id), students.map(s => s.parentId === parentUid ? { ...s, parentId: undefined } : s));
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    }
  };

  const [parentFilter, setParentFilter] = useState<'all' | 'kids' | 'nochild' | 'nophone'>('all');
  const activeKidsOf = useCallback((p: ParentMember) => (p.studentIds || [])
    .map((sid: string) => students.find(s => s.uid === sid || s.id === sid))
    .filter((s: any) => !!s && s.enrollmentStatus !== 'Inactive' && s.enrollmentStatus !== 'Graduated' && s.isArchived !== true), [students]);
  const directoryStats = useMemo(() => {
    const active = students.filter((s: any) => (!s.enrollmentStatus || s.enrollmentStatus === 'Active') && s.isArchived !== true);
    const linkedIds = new Set<string>();
    parents.forEach(p => (p.studentIds || []).forEach((id: string) => linkedIds.add(id)));
    const isLinked = (s: any) => !!s.parentId || linkedIds.has(s.uid) || linkedIds.has(s.id);
    return {
      activeChildren: active.length,
      linkedChildren: active.filter(isLinked).length,
      childrenNoParent: active.filter(s => !isLinked(s)).length,
      parentsNoChild: parents.filter(p => activeKidsOf(p).length === 0).length,
      parentsNoPhone: parents.filter(p => !String((p as any).phone || '').trim()).length,
    };
  }, [parents, students, activeKidsOf]);
  const filteredParents = useMemo(() => parents
    .filter(p => {
      const q = searchTerm.trim().toLowerCase();
      return !q || searchStudent(p as any, searchTerm) || String((p as any).phone || '').includes(q) || String(p.email || '').toLowerCase().includes(q);
    })
    .filter(p => parentFilter === 'nochild' ? activeKidsOf(p).length === 0
      : parentFilter === 'nophone' ? !String((p as any).phone || '').trim()
      : parentFilter === 'kids' ? activeKidsOf(p).length > 0 : true)
    .sort((a, b) => `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)),
    [parents, searchTerm, parentFilter, activeKidsOf]);
  
  const filteredStudentsForModal = useMemo(() => {
      let list = students.filter(s => s.enrollmentStatus !== 'Inactive' && searchStudent(s as any, studentSearch));
      if (showOnlyUnlinked) {
          list = list.filter(s => !s.parentId || selectedStudentIds.includes(s.uid) || (editingParent && s.parentId === editingParent.uid));
      }
      return list;
  }, [students, studentSearch, showOnlyUnlinked, editingParent, selectedStudentIds]);

  const overallLoading = isLoadingSchoolId;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-indigo-600">Family Relations</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Parents</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Parent accounts, their contact details and the children linked to them.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRecompileParentSnapshot} disabled={isLoadingParents || isCompilingSnapshot}
            className="rounded-xl h-10 text-xs font-bold" title="Reads every parent and pupil again (use if a change made elsewhere is missing)">
            <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5", (isLoadingParents || isCompilingSnapshot) && "animate-spin")} /> Refresh list
          </Button>
          {canManage && (
            <Button onClick={() => setIsAddOpen(true)} disabled={!adminSchoolId || !hasLoadedParents}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl h-10 px-4 gap-1.5">
              <UserPlus className="h-4 w-4" /> Add parent
            </Button>
          )}
        </div>
      </div>

      {/* Figures that need action */}
      {hasLoadedParents && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { key: 'all', label: 'Parent accounts', value: parents.length, sub: 'in the directory' },
            { key: 'kids', label: 'Children linked', value: directoryStats.linkedChildren, sub: `of ${directoryStats.activeChildren} active pupils` },
            { key: 'nochild', label: 'Parents with no child', value: directoryStats.parentsNoChild, sub: 'link or remove', warn: directoryStats.parentsNoChild > 0 },
            { key: 'nophone', label: 'No phone number', value: directoryStats.parentsNoPhone, sub: 'cannot get SMS', warn: directoryStats.parentsNoPhone > 0 },
          ].map(x => (
            <button key={x.key} onClick={() => setParentFilter(x.key as any)}
              className={cn("text-left p-4 rounded-2xl border bg-white transition-all",
                parentFilter === x.key ? "border-indigo-400 ring-2 ring-indigo-100" : "border-slate-100 hover:border-indigo-200")}>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{x.label}</p>
              <p className={cn("text-2xl font-black mt-1", x.warn ? "text-amber-600" : "text-slate-900")}>{x.value}</p>
              <p className="text-[10px] font-bold text-slate-500">{x.sub}</p>
            </button>
          ))}
        </div>
      )}
      {hasLoadedParents && directoryStats.childrenNoParent > 0 && (
        <p className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
          {directoryStats.childrenNoParent} active pupil{directoryStats.childrenNoParent === 1 ? ' has' : 's have'} no parent linked, so nobody can see {directoryStats.childrenNoParent === 1 ? 'their' : 'their'} portal or receive messages about them.
          {canManage ? ' Use “Add parent” (or edit a parent) and tick them.' : ''}
        </p>
      )}

      {/* Main Card */}
      <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm flex-grow">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <StudentSearchInput
                value={searchTerm}
                onChange={(val) => setSearchTerm(val)}
                className="pl-10 h-10 border-slate-200 focus-visible:ring-indigo-500 rounded-xl"
                placeholder="Search by parent name, email or phone…"
              />
            </div>
            <span className="text-[11px] text-slate-500 font-semibold">
              {hasLoadedParents ? `${filteredParents.length} of ${parents.length} shown` : ''}
              {activeSnapshot?.updatedAt ? ` · list updated ${new Date(activeSnapshot.updatedAt).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : ''}
            </span>
          </div>

          {isLoadingParents ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 bg-slate-50 border border-dashed rounded-2xl">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-2"/>
              <p className="text-xs font-bold">Loading parents…</p>
            </div>
          ) : !hasLoadedParents ? (
            <div className="py-16 text-center border border-dashed rounded-2xl bg-slate-50 space-y-3">
              <p className="text-sm font-semibold text-slate-600">The parent list could not be loaded.</p>
              <Button onClick={loadParentData} className="rounded-xl text-xs font-bold">Try again</Button>
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
                    <TableHead className="font-bold text-slate-700 h-12 hidden md:table-cell">Email (login)</TableHead>
                    <TableHead className="font-bold text-slate-700 h-12">Linked Students</TableHead>
                    <TableHead className="text-right font-bold text-slate-700 h-12 px-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParents.map((p) => (
                    <TableRow key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-bold border border-indigo-100/50 text-sm group-hover:scale-105 transition-transform">
                            {p.firstName?.charAt(0) || '?'}{p.lastName?.charAt(0) || ''}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{p.title ? `${p.title} ` : ''}{p.firstName} {p.lastName}</div>
                            {p.phone ? <div className="text-[11px] text-slate-500 font-medium">{p.phone}</div> : <div className="text-[10px] text-amber-600 font-bold">No phone number</div>}
                            <div className="text-[10px] text-slate-400 md:hidden">{p.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-slate-600 text-sm font-medium hidden md:table-cell">{p.email}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <Badge variant="secondary" className="font-bold text-xs bg-slate-100 text-slate-700 border border-slate-200/50 rounded-md px-2 py-0.5">
                            {p.studentIds?.filter((sid: string) => {
                              const foundStudent = students.find(s => s.uid === sid || s.id === sid);
                              return foundStudent && foundStudent.enrollmentStatus !== 'Inactive';
                            }).length || 0} {(p.studentIds || []).length === 1 ? 'child' : 'children'}
                          </Badge>
                          {(() => {
                            const activeWards = (p.studentIds || [])
                              .map((sid: string) => students.find(s => s.uid === sid || s.id === sid))
                              .filter((s): s is Student => !!s && s.enrollmentStatus !== 'Inactive');
                            
                            if (activeWards.length === 0) return null;
                            return (
                              <div className="flex flex-wrap gap-1 mt-0.5 max-w-[240px]">
                                {activeWards.map(w => (
                                  <Link
                                    key={w.id || w.uid}
                                    href={`/dashboard/students-v3?search=${encodeURIComponent(`${w.firstName} ${w.lastName}`.trim())}`}
                                    target="_blank"
                                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100/80 transition-colors"
                                    title={`Trace ${w.firstName} ${w.lastName} in Student Directory`}
                                  >
                                    <span>{w.firstName} {w.lastName}</span>
                                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                                  </Link>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4 px-6">
                        <div className="flex justify-end gap-1.5">
                          {canManage && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => { setNewTempPassword(makeFriendlyPassword()); setResetPasswordUser(p); }} title="Reset Password" className="h-8.5 w-8.5 p-0 hover:bg-amber-50 hover:text-amber-600 rounded-lg">
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
                                <span className="ml-2 text-xs font-normal text-indigo-600">({selectedStudentIds.length} selected)</span>
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

                <DialogFooter className="pt-4 border-t"><Button type="submit" className="w-full h-12 text-base font-bold bg-slate-900 hover:bg-slate-800 text-white" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Create Parent Account"}</Button></DialogFooter>
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
                                    <span className="ml-2 text-xs font-normal text-indigo-600">({selectedStudentIds.length} selected)</span>
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
      <NewAccountPasswordDialog credentials={newAccount} onClose={() => setNewAccount(null)} />
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
                  <LoginDetailsCard
                      uid={resetPasswordUser?.uid || resetPasswordUser?.id}
                      name={`${resetPasswordUser?.firstName || ''} ${resetPasswordUser?.lastName || ''}`.trim()}
                      email={resetPasswordUser?.email}
                      refreshKey={loginDetailsTick}
                  />
                  <div className="space-y-2">
                      <Label>New temporary password (only if they forgot it)</Label>
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
                              toast({ title: "Password Reset", description: `New temporary password: ${(res as any).password || newTempPassword}`, duration: 30000 });
                              setLoginDetailsTick(t => t + 1);
                              setNewTempPassword(makeFriendlyPassword());
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
