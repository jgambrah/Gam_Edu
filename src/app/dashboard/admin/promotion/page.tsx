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

/**
 * @fileOverview Class Promotion & Graduation Engine
 * Allows administrators to move students from one class to another or graduate them in bulk.
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

  const handlePromote = async () => {
    if (!firestore || !schoolId || !sourceClassId || !destinationClassId) return;
    
    const studentsToMove = students?.filter(s => selectedStudentIds.includes(s.uid)) || [];
    if (studentsToMove.length === 0) {
        toast({ variant: 'destructive', title: "No Selection", description: "Please select at least one student to process." });
        return;
    }

    const actionText = destinationClassId === 'GRADUATE' ? 'graduate' : 'promote';
    if (!confirm(`Are you sure you want to ${actionText} ${studentsToMove.length} students?`)) return;

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
        
        // Clear state to prevent accidental double-processing
        setSourceClassId('');
        setDestinationClassId('');
        setSelectedStudentIds([]);
        
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

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-1 mb-4">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">End of Year <span className="text-indigo-600">Transfer</span></h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Promotion, Retention & Graduation Manager</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CONFIGURATION PANEL */}
        <Card className="lg:col-span-1 h-fit border-t-4 border-t-indigo-600 shadow-xl rounded-[2rem] bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase text-slate-800">1. Setup Transfer</CardTitle>
            <CardDescription className="text-xs font-medium">Define the source and target classes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Current Class (From)</Label>
              <Select value={sourceClassId} onValueChange={setSourceClassId} disabled={isProcessing}>
                <SelectTrigger className="bg-slate-50 border-2 rounded-xl h-12">
                  <SelectValue placeholder="Select current class" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.sort((a,b) => a.name.localeCompare(b.name)).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <div className="bg-indigo-50 p-2 rounded-full border border-indigo-100"><ArrowRight className="text-indigo-400 rotate-90 lg:rotate-0" /></div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-400">Next Class (To)</Label>
              <Select value={destinationClassId} onValueChange={setDestinationClassId} disabled={!sourceClassId || isProcessing}>
                <SelectTrigger className="bg-slate-50 border-2 rounded-xl h-12 border-indigo-200">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GRADUATE" className="text-indigo-600 font-bold">🎓 Final Graduation (Alumni)</SelectItem>
                  <Separator className="my-1" />
                  {classes?.filter(c => c.id !== sourceClassId).sort((a,b) => a.name.localeCompare(b.name)).map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {destinationClassId === 'GRADUATE' && (
              <Alert className="bg-indigo-50 border-indigo-200 rounded-2xl animate-in slide-in-from-top-2">
                <GraduationCap className="h-4 w-4 text-indigo-600" />
                <AlertDescription className="text-indigo-700 text-xs font-medium">
                  Students will be archived as <strong>Graduated</strong>. They will stop being billed and move to the alumni directory.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-tighter rounded-2xl shadow-lg shadow-indigo-100 disabled:opacity-50"
              disabled={!sourceClassId || !destinationClassId || selectedStudentIds.length === 0 || isProcessing}
              onClick={handlePromote}
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
                <CardDescription className="text-slate-400 font-bold text-xs uppercase mt-1">
                  {students ? `Found ${students.length} Active Students` : "Select a source class to load students"}
                </CardDescription>
              </div>
              {students && students.length > 0 && (
                <div className="flex items-center gap-3">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{selectedStudentIds.length} Checked</p>
                    <button onClick={handleSelectAll} className="text-[10px] font-black text-white hover:text-indigo-400 underline uppercase tracking-widest">Toggle All</button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-slate-50/50 min-h-[400px]">
            {loadingStudents ? (
              <div className="flex flex-col items-center justify-center h-full py-32 gap-4 text-slate-400">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
                <p className="text-[10px] uppercase font-black tracking-widest">Scanning School Directory...</p>
              </div>
            ) : !sourceClassId ? (
              <div className="flex flex-col items-center justify-center h-full py-32 text-slate-300">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-10" />
                <p className="font-bold text-sm uppercase tracking-widest">Select Source to Populate</p>
              </div>
            ) : students?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-32 text-slate-400">
                <AlertTriangle className="h-16 w-16 mx-auto mb-4 opacity-20 text-orange-500" />
                <p className="font-bold text-sm">No active students found in this class.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-white/50 border-b">
                    <TableRow>
                        <TableHead className="w-[60px]"></TableHead>
                        <TableHead className="font-black text-[10px] uppercase text-slate-400 tracking-widest">Student</TableHead>
                        <TableHead className="text-right font-black text-[10px] uppercase text-slate-400 tracking-widest">Outcome</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {students?.map(s => {
                        const isChecked = selectedStudentIds.includes(s.uid);
                        return (
                        <TableRow key={s.uid} className={cn("transition-all", !isChecked ? "opacity-40 grayscale" : "hover:bg-indigo-50/30")}>
                            <TableCell className="pl-6">
                            <Checkbox 
                                checked={isChecked}
                                onCheckedChange={() => handleToggleStudent(s.uid)}
                                className="h-5 w-5 rounded-md border-2"
                            />
                            </TableCell>
                            <TableCell>
                            <StudentDisplay student={s} variant="list" showAvatar />
                            </TableCell>
                            <TableCell className="text-right pr-6">
                            {isChecked ? (
                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-black text-[9px] uppercase">
                                    {destinationClassId === 'GRADUATE' ? 'GRADUATE' : 'PROMOTE'}
                                </Badge>
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
    </div>
  );
}
