'use client';

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, doc, writeBatch, serverTimestamp, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GraduationCap, ArrowRight, CheckCircle2, AlertTriangle, Users, BookOpen, Info, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { StudentDisplay } from '@/components/student-display';
import { Student, Class } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { TimelineService } from '@/lib/timeline-service';
import { SectionHeroBanner } from '@/components/common/SectionHeroBanner';

/**
 * @fileOverview Class Promotion & Graduation Engine
 * Allows administrators to move students from one class to another or graduate them in bulk.
 * Replaced native confirm() with Titan-Grade confirmation modal.
 */
export default function PromotionPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const { schoolId, loading: schoolLoading } = useCurrentSchool();
  const { toast } = useToast();

  const [sourceClassId, setSourceClassId] = useState<string>('');
  const [destinationClassId, setDestinationClassId] = useState<string>('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Custom Confirmation State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(true);

  const canAccess = ['Administrator', 'Director'].includes(role || '');

  // 1. Fetch Classes for the current school
  const classesQuery = useMemoFirebase(() => 
    (firestore && schoolId && canAccess) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null,
  [firestore, schoolId, canAccess]);
  const { data: classes, isLoading: loadingClasses } = useCollection<Class>(classesQuery);

  // 2. Fetch Active Students in the selected Source Class
  const studentsQuery = useMemoFirebase(() => 
    (firestore && schoolId && sourceClassId) ? query(
        collection(firestore, 'students'), 
        where('schoolId', '==', schoolId),
        where('classId', '==', sourceClassId),
        where('enrollmentStatus', '==', 'Active')
    ) : null,
  [firestore, schoolId, sourceClassId]);
  const { data: students, isLoading: loadingStudents } = useCollection<Student>(studentsQuery);

  // 3. Fetch Active Students in Destination Class to alert on occupancy collisions
  const destStudentsQuery = useMemoFirebase(() => 
    (firestore && schoolId && destinationClassId && destinationClassId !== 'GRADUATE') ? query(
        collection(firestore, 'students'), 
        where('schoolId', '==', schoolId),
        where('classId', '==', destinationClassId),
        where('enrollmentStatus', '==', 'Active')
    ) : null,
  [firestore, schoolId, destinationClassId]);
  const { data: destStudents } = useCollection<Student>(destStudentsQuery);

  // Auto-select all students when the class list is loaded or changed
  useEffect(() => {
    if (students) {
      setSelectedStudentIds(students.map(s => s.uid));
    } else {
      setSelectedStudentIds([]);
    }
  }, [students]);

  const handleToggleStudent = (uid: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  const handleSelectAll = () => {
    if (!students) return;
    if (selectedStudentIds.length === students.length) setSelectedStudentIds([]);
    else setSelectedStudentIds(students.map(s => s.uid));
  };

  // STEP A: Trigger the Dialog
  const triggerPromotion = () => {
    if (!firestore || !schoolId || !sourceClassId || !destinationClassId) return;
    
    const studentsToMove = students?.filter(s => selectedStudentIds.includes(s.uid)) || [];
    if (studentsToMove.length === 0) {
        toast({ variant: 'destructive', title: "No Selection", description: "Please select at least one student to process." });
        return;
    }

    setIsConfirmOpen(true);
  };

  // STEP B: The Actual Database Action
  const executePromotion = async () => {
    if (!firestore || !schoolId || !sourceClassId || !destinationClassId) return;
    
    const studentsToMove = students?.filter(s => selectedStudentIds.includes(s.uid)) || [];
    
    setIsProcessing(true);
    try {
        let academicYear = '';
        let term = '';
        try {
            const settingsSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId));
            if (settingsSnap.exists()) {
                academicYear = settingsSnap.data().academicYear || '';
                term = settingsSnap.data().term || '';
            }
        } catch (e) {
            console.error("Failed to fetch settings:", e);
        }

        const batch = writeBatch(firestore);
        let count = 0;

        const sourceClassName = classes?.find(c => c.id === sourceClassId)?.name || 'Class';
        const destClassName = destinationClassId === 'GRADUATE' ? 'Graduated' : (classes?.find(c => c.id === destinationClassId)?.name || 'Class');

        studentsToMove.forEach(student => {
            const studentRef = doc(firestore, 'students', student.uid);
            
            if (destinationClassId === 'GRADUATE') {
                // Graduation Logic: Mark status and archive
                batch.update(studentRef, {
                    enrollmentStatus: 'Graduated',
                    previousClassId: sourceClassId,
                    updatedAt: serverTimestamp()
                });

                // Add timeline event
                TimelineService.logEventBatch(firestore, batch, {
                    studentId: student.uid,
                    title: "Graduation 🎓",
                    description: `Graduated from school. Completed studies from Class ${sourceClassName}.`,
                    category: 'graduation',
                    classId: sourceClassId,
                    className: sourceClassName,
                    schoolId,
                    recordedBy: 'Cohort Transition Engine',
                    recordedById: 'system',
                    academicYear,
                    term,
                    date: new Date()
                });
            } else {
                // Promotion Logic: Update class assignment
                batch.update(studentRef, {
                    classId: destinationClassId,
                    previousClassId: sourceClassId, 
                    updatedAt: serverTimestamp()
                });

                // Add timeline event
                TimelineService.logEventBatch(firestore, batch, {
                    studentId: student.uid,
                    title: "Class Promotion",
                    description: `Promoted from Class ${sourceClassName} to Class ${destClassName}.`,
                    category: 'promotion',
                    classId: destinationClassId,
                    className: destClassName,
                    schoolId,
                    recordedBy: 'Cohort Transition Engine',
                    recordedById: 'system',
                    academicYear,
                    term,
                    date: new Date()
                });
            }
            count++;
        });

        await batch.commit();

        // Notify parents asynchronously
        try {
            const { notifyParents } = await import('@/app/actions/notifications');
            const studentIds = studentsToMove.map(s => s.uid);
            if (destinationClassId === 'GRADUATE') {
                await notifyParents(
                    studentIds,
                    "Student Graduation 🎓",
                    "Your child has officially graduated and transition milestones have been updated.",
                    "/dashboard/my-children"
                );
            } else {
                await notifyParents(
                    studentIds,
                    "Class Promotion 🎉",
                    `Your child has been promoted to Class ${destClassName}.`,
                    "/dashboard/my-children"
                );
            }
        } catch (e) {
            console.error("Failed to notify parents of promotion:", e);
        }
        
        toast({ 
            title: "Batch Complete!", 
            description: destinationClassId === 'GRADUATE' 
                ? `Successfully graduated ${count} students.` 
                : `Successfully moved ${count} students to their next class.` 
        });
        
        // Clear state
        setSourceClassId('');
        setDestinationClassId('');
        setSelectedStudentIds([]);
        setIsConfirmOpen(false);
        
    } catch (error: any) {
        console.error("Promotion Error:", error);
        toast({ variant: 'destructive', title: "Process Failed", description: error.message || "An error occurred during the transfer." });
    } finally {
        setIsProcessing(false);
    }
  };

  if (!canAccess && !schoolLoading) {
    return (
        <div className="p-8 flex justify-center">
            <Card className="max-w-md w-full border-red-100 bg-red-50/50">
                <CardHeader className="text-center">
                    <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4 text-red-600">
                        <AlertTriangle size={32} />
                    </div>
                    <CardTitle>Access Restricted</CardTitle>
                    <CardDescription>Only Administrators and Directors can access the promotion engine.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
  }

  const studentsToMoveCount = students?.filter(s => selectedStudentIds.includes(s.uid)).length || 0;

  return (
    <div className="space-y-6">
      {/* Standardized Institutional Hero Banner */}
      <SectionHeroBanner
        className="mb-6 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800/80 rounded-2xl"
        eyebrow="COHORT TRANSITION ENGINE"
        title="End of Year Transfer"
        subtitle="Bulk promote class rosters, retain cohorts, or graduate final-year students into the alumni database."
        icon={GraduationCap}
        badge={{
          label: "Transition Engine",
          variant: "info",
        }}
        breadcrumbs={[
          { label: 'Director Suite' },
          { label: 'Academic Administration', href: '/dashboard' },
          { label: 'End of Year Transfer' },
        ]}
        stats={
          sourceClassId ? [
            { 
              label: 'Source Cohort', 
              value: classes?.find(c => c.id === sourceClassId)?.name || 'Selected' 
            },
            { 
              label: 'Selected Roster', 
              value: `${studentsToMoveCount} of ${students?.length || 0}` 
            },
            {
              label: 'Target Action',
              value: destinationClassId === 'GRADUATE' ? 'Graduation' : destinationClassId ? 'Promotion' : 'Pending',
              change: destinationClassId === 'GRADUATE' ? 'Alumni Archive' : destinationClassId ? 'Cohort Advance' : undefined,
              changeType: 'positive',
            }
          ] : [
            { label: 'System Mode', value: 'Bulk Transfer' },
            { label: 'Target Scope', value: 'Class Rosters' },
            { label: 'Alumni Pipeline', value: 'Graduation Ready' },
          ]
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-xs font-bold text-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACADEMIC TRANSITION ACTIVE</span>
            </div>
            {studentsToMoveCount > 0 && (
              <Badge className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-xl">
                {studentsToMoveCount} Selected
              </Badge>
            )}
          </div>
        }
      />

      {/* --- PROMOTION PROTOCOL & STEP-BY-STEP GUIDELINES --- */}
      <Card className="border border-indigo-100/90 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 shadow-md rounded-2xl overflow-hidden">
        <div 
          onClick={() => setIsGuideOpen(!isGuideOpen)}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-indigo-50/40 transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black uppercase tracking-wide text-slate-900">
                  Standard Academic Promotion Protocol & Golden Rules
                </h3>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] font-bold px-2 py-0.5">
                  CRITICAL PROCESS
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Always promote top-down (start with the graduating class) and uncheck repeating students to avoid class collisions.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 gap-1 shrink-0">
            {isGuideOpen ? (
              <>
                <span>Hide Guide</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Show Guide</span>
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {isGuideOpen && (
          <CardContent className="pt-0 pb-6 px-6 border-t border-indigo-100/60 mt-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              
              {/* Pillar 1: Top-Down Waterfall */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                  <span>Start from the Top (Waterfall)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Always start with your final/graduating class</strong> (e.g. JHS 3 / SHS 3 / Class 6). Transfer them to <span className="text-amber-700 font-bold">🎓 Final Graduation (Alumni)</span>.
                </p>
                <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 border border-slate-200/60">
                  <strong className="text-slate-800">Why?</strong> Vacating the highest class first ensures that classroom is completely empty before you move the next cohort up into it.
                </div>
              </div>

              {/* Pillar 2: Cascade Downwards */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                  <span>Cascade Downward One-by-One</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Move the next highest class up (e.g. <strong>JHS 2 ➔ JHS 3</strong>), then <strong>JHS 1 ➔ JHS 2</strong>, working all the way down to your entry class (e.g. <strong>KG ➔ Class 1</strong>).
                </p>
                <div className="p-2.5 bg-rose-50 rounded-lg text-[11px] text-rose-800 border border-rose-200/60">
                  <strong className="text-rose-900">Never Move Bottom-Up:</strong> If you move Class 1 to Class 2 before moving Class 2 out, both cohorts will mix together in Class 2 and cannot be automatically unbundled!
                </div>
              </div>

              {/* Pillar 3: Repeating Students */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-700 font-black text-xs uppercase tracking-wider">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                  <span>Retaining Repeating Students</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All students are checked by default. <strong>Uncheck the box</strong> next to any student who is repeating/retained in the roster below.
                </p>
                <div className="p-2.5 bg-emerald-50 rounded-lg text-[11px] text-emerald-800 border border-emerald-200/60">
                  <strong className="text-emerald-900">Visual Verification:</strong> Unchecked students will display <span className="font-bold text-slate-600">RETAIN (STAY)</span> and will safely remain in their current class.
                </div>
              </div>

            </div>

            {/* Quick Flow Sequence Bar */}
            <div className="mt-4 p-3.5 bg-slate-900 text-white rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-indigo-200">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Recommended Sequence Flow:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-amber-300">1. JHS 3 ➔ Graduate</span>
                <span className="text-slate-500 font-bold">➔</span>
                <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-indigo-200">2. JHS 2 ➔ JHS 3</span>
                <span className="text-slate-500 font-bold">➔</span>
                <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-indigo-200">3. JHS 1 ➔ JHS 2</span>
                <span className="text-slate-500 font-bold">➔</span>
                <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700 text-emerald-300">4. Class 6 ➔ JHS 1</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CONFIGURATION PANEL */}
        <Card className="lg:col-span-1 h-fit border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-slate-900 text-white pb-6 pt-8 px-8">
            <CardTitle className="text-lg font-black uppercase tracking-tight">1. Setup Transfer</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-400 uppercase mt-0.5">Define source and target classes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Current Class (From)</Label>
              <Select value={sourceClassId} onValueChange={setSourceClassId} disabled={isProcessing}>
                <SelectTrigger className="bg-slate-50 border-2 rounded-xl h-12 transition-all focus:border-indigo-500">
                  <SelectValue placeholder="Select current class" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.sort((a,b) => a.name.localeCompare(b.name)).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center py-2">
              <div className="bg-indigo-50 p-2.5 rounded-full border border-indigo-100">
                <ArrowRight className="text-indigo-500 rotate-90 lg:rotate-0 h-5 w-5" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Next Class (To)</Label>
              <Select value={destinationClassId} onValueChange={setDestinationClassId} disabled={!sourceClassId || isProcessing}>
                <SelectTrigger className="bg-slate-50 border-2 rounded-xl h-12 border-indigo-200 transition-all focus:border-indigo-500">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GRADUATE" className="text-amber-600 font-bold">🎓 Final Graduation (Alumni)</SelectItem>
                  <Separator className="my-1" />
                  {classes?.filter(c => c.id !== sourceClassId).sort((a,b) => a.name.localeCompare(b.name)).map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {destinationClassId === 'GRADUATE' && (
              <Alert className="bg-amber-50 border-amber-200 rounded-2xl animate-in slide-in-from-top-2">
                <GraduationCap className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 text-xs font-semibold">
                  Students will be archived as <strong>Graduated</strong>. They will stop being billed and move to the alumni directory.
                </AlertDescription>
              </Alert>
            )}

            {destinationClassId && destinationClassId !== 'GRADUATE' && destStudents && destStudents.length > 0 && (
              <Alert className="bg-amber-50 border-amber-300 rounded-2xl animate-in slide-in-from-top-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <AlertDescription className="text-amber-900 text-xs space-y-1">
                  <p className="font-bold">
                    ⚠️ Destination Class Currently Occupied ({destStudents.length} active student{destStudents.length > 1 ? 's' : ''})
                  </p>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    <strong>{classes?.find(c => c.id === destinationClassId)?.name}</strong> already has students in it! Have you already promoted or graduated them? If not, promoting now will mix both cohorts into the same class. Always promote top-down!
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="p-8 pt-0">
            <Button 
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all"
              disabled={!sourceClassId || !destinationClassId || selectedStudentIds.length === 0 || isProcessing}
              onClick={triggerPromotion}
            >
              {isProcessing ? <Loader2 className="animate-spin mr-2"/> : <CheckCircle2 className="mr-2 h-5 w-5"/>}
              Complete Transfer
            </Button>
          </CardFooter>
        </Card>

        {/* ROSTER PANEL */}
        <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-slate-900 text-white pb-6 pt-8 px-8">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight">2. Review Class Roster</CardTitle>
                <CardDescription className="text-slate-400 font-bold text-xs uppercase mt-0.5">
                  {students ? `Found ${students.length} Active Students` : "Select a source class to load students"}
                </CardDescription>
              </div>
              {students && students.length > 0 && (
                <div className="flex items-center gap-4 bg-white/5 rounded-2xl px-4 py-2 border border-white/10">
                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{selectedStudentIds.length} Checked</p>
                    <button onClick={handleSelectAll} className="text-[10px] font-black text-white hover:text-indigo-300 underline uppercase tracking-widest transition-colors">Toggle All</button>
                </div>
              )}
            </div>
          </CardHeader>

          {/* Repeating Student Instruction Strip */}
          <div className="bg-amber-50/90 border-b border-amber-200/80 px-8 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-950 font-medium">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Repeating / Retained Students:</strong> Simply <strong>uncheck the box</strong> next to their name. Unchecked students show <span className="font-bold text-slate-700">RETAIN (STAY)</span> and will NOT be moved.
              </span>
            </div>
            {students && students.length > 0 && (
              <span className="text-[11px] font-black uppercase text-amber-900 shrink-0">
                {selectedStudentIds.length} Promoting • {students.length - selectedStudentIds.length} Retaining
              </span>
            )}
          </div>

          <CardContent className="p-0 bg-slate-50/30 min-h-[400px]">
            {loadingStudents ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
                <p className="text-[10px] uppercase font-black tracking-widest">Scanning School Directory...</p>
              </div>
            ) : !sourceClassId ? (
              <div className="flex flex-col items-center justify-center py-32 text-slate-300">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-10" />
                <p className="font-black text-xs uppercase tracking-widest">Select Source to Populate</p>
              </div>
            ) : students?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 opacity-20 text-orange-500" />
                <p className="font-bold text-sm">No active students found in this class.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-slate-50/50 border-b">
                    <TableRow>
                        <TableHead className="w-[60px] pl-6"></TableHead>
                        <TableHead className="font-black text-[10px] uppercase text-slate-400 tracking-widest">Student</TableHead>
                        <TableHead className="text-right pr-8 font-black text-[10px] uppercase text-slate-400 tracking-widest">Outcome</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {students?.map(s => {
                        const isChecked = selectedStudentIds.includes(s.uid);
                        return (
                        <TableRow key={s.uid} className={cn("transition-all border-b", !isChecked ? "opacity-45 grayscale bg-slate-50/10" : "hover:bg-indigo-50/20 bg-white")}>
                            <TableCell className="pl-6 py-4">
                            <Checkbox 
                                checked={isChecked}
                                onCheckedChange={() => handleToggleStudent(s.uid)}
                                className="h-5 w-5 rounded-md border-2"
                            />
                            </TableCell>
                            <TableCell className="py-4">
                            <StudentDisplay student={s} variant="list" showAvatar />
                            </TableCell>
                            <TableCell className="text-right pr-8 py-4">
                            {isChecked ? (
                              destinationClassId === 'GRADUATE' ? (
                                <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-black text-[9px] uppercase tracking-wider px-2.5 py-1">
                                    🎓 GRADUATE
                                </Badge>
                              ) : (
                                <Badge className="bg-teal-50 text-teal-700 border-teal-200 font-black text-[9px] uppercase tracking-wider px-2.5 py-1">
                                    PROMOTE
                                </Badge>
                              )
                            ) : (
                                <Badge variant="outline" className="text-slate-400 font-bold text-[9px] uppercase italic">RETAIN (STAY)</Badge>
                            )}
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
      </div>

      {/* --- TITAN-GRADE CONFIRMATION MODAL --- */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border-2 border-slate-900 space-y-6 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 border-2 border-indigo-100">
              <AlertTriangle size={40} className="animate-pulse" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-black uppercase italic text-black">
                  Confirm <span className="text-indigo-600">{destinationClassId === 'GRADUATE' ? 'Graduation' : 'Promotion'}</span>
              </h2>
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Source Cohort:</span>
                  <span className="font-bold text-slate-900">{classes?.find(c => c.id === sourceClassId)?.name}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Destination:</span>
                  <span className="font-bold text-indigo-600">{destinationClassId === 'GRADUATE' ? 'Graduation (Alumni)' : classes?.find(c => c.id === destinationClassId)?.name}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-emerald-700 font-semibold">
                  <span>{destinationClassId === 'GRADUATE' ? 'Graduating' : 'Promoting'}:</span>
                  <span className="font-bold text-emerald-800">{studentsToMoveCount} Student{studentsToMoveCount > 1 ? 's' : ''}</span>
                </div>
                {students && students.length > studentsToMoveCount && (
                  <div className="flex justify-between items-center text-amber-700 font-semibold">
                    <span>Retaining (Repeating):</span>
                    <span className="font-bold text-amber-800">{students.length - studentsToMoveCount} Student{students.length - studentsToMoveCount > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {destinationClassId !== 'GRADUATE' && destStudents && destStudents.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-900">
                  <p className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    Caution: Destination Class Has {destStudents.length} Students
                  </p>
                  <p className="text-[11px] mt-0.5 text-amber-800 leading-snug">
                    Confirm that existing students in {classes?.find(c => c.id === destinationClassId)?.name} have already been moved out before proceeding.
                  </p>
                </div>
              )}

              <p className="text-[11px] font-bold text-slate-400 uppercase mt-2 leading-relaxed">
                This batch operation will update student enrollment records immediately.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 py-4 font-black text-slate-400 uppercase text-xs tracking-widest hover:text-black transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={executePromotion}
                disabled={isProcessing}
                className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 hover:bg-black transition-all disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : "Yes, Transfer Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
