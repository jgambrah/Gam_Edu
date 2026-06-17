'use client';

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GraduationCap, ArrowRight, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { StudentDisplay } from '@/components/student-display';
import { Student, Class } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

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
        const batch = writeBatch(firestore);
        let count = 0;

        studentsToMove.forEach(student => {
            const studentRef = doc(firestore, 'students', student.uid);
            
            if (destinationClassId === 'GRADUATE') {
                // Graduation Logic: Mark status and archive
                batch.update(studentRef, {
                    enrollmentStatus: 'Graduated',
                    previousClassId: sourceClassId,
                    updatedAt: serverTimestamp()
                });
            } else {
                // Promotion Logic: Update class assignment
                batch.update(studentRef, {
                    classId: destinationClassId,
                    previousClassId: sourceClassId, 
                    updatedAt: serverTimestamp()
                });
            }
            count++;
        });

        await batch.commit();
        
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
    <div className="space-y-8">
      {/* Premium Gradient Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-700 via-indigo-600 to-teal-500 p-8 md:p-12 text-white shadow-2xl border border-indigo-400/20">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-teal-400/10 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-100 backdrop-blur-md">
              <GraduationCap className="h-3 w-3" /> Cohort Transition Engine
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight italic uppercase">
              End of Year <span className="text-teal-200">Transfer</span>
            </h1>
            <p className="max-w-md text-sm font-medium text-indigo-50">
              Bulk promote class rosters, retain cohorts, or graduate final-year students into the alumni database.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
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
                <GraduationCap className="h-4 w-4 text-amber-650" />
                <AlertDescription className="text-amber-800 text-xs font-semibold">
                  Students will be archived as <strong>Graduated</strong>. They will stop being billed and move to the alumni directory.
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
          <CardContent className="p-0 bg-slate-50/30 min-h-[400px]">
            {loadingStudents ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-650" />
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
                                <Badge className="bg-amber-50 text-amber-700 border-amber-250 font-black text-[9px] uppercase tracking-wider px-2.5 py-1">
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
            
            <div>
              <h2 className="text-2xl font-black uppercase italic text-black">
                  Confirm <span className="text-indigo-655">{destinationClassId === 'GRADUATE' ? 'Graduation' : 'Promotion'}</span>
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase mt-2 leading-relaxed">
                Are you sure you want to process {studentsToMoveCount} students? This batch operation will update the school records immediately.
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
