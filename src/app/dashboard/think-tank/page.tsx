'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, where, setDoc, increment, getDoc, getDocs, onSnapshot, limit } from 'firebase/firestore';
import { isSameDay } from 'date-fns';
import { BrainCircuit, Loader2, PlusCircle, Lightbulb, Clock, CheckCircle2, ChevronRight, MessageSquare, Search, AlertTriangle, ShieldCheck, Wand2, Trash2, Activity, Users, Trophy } from 'lucide-react';
import { getAuth } from 'firebase/auth';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import confetti from 'canvas-confetti';

// Custom Components
import { ParadoxCard, DebateArena } from '@/components/academics/think-tank-components';

// Types and AI Functions
import type { Paradox, DebateTopic, Student } from '@/lib/types';
import { generateDailyParadox, generateDebateTopic, generateDetectiveCase } from '@/ai/flows/think-tank'; 
import { awardActivityXP } from '@/lib/achievement-utils';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { formatDate } from 'date-fns';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCurrentSchool } from '@/hooks/use-current-school';

const TARGET_GROUPS = ['Novice (Basic 1-3)', 'Apprentice (Basic 4-6)', 'Scholar (JHS)', 'Master (SHS)'];

// Helper to map student class
const getStudentGroup = (className: string = '') => {
    const name = className.toLowerCase();
    if (name.includes('bs1') || name.includes('bs2') || name.includes('bs3')) return 'Novice (Basic 1-3)';
    if (name.includes('bs4') || name.includes('bs5') || name.includes('bs6')) return 'Apprentice (Basic 4-6)';
    if (name.includes('jhs')) return 'Scholar (JHS)';
    if (name.includes('shs')) return 'Master (SHS)';
    return 'Scholar (JHS)'; 
};

// --- COMPONENT: Teacher Monitor ---
function TeacherMonitorTab({ schoolId }: { schoolId: string | null }) {
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('All');

    // Query last 100 submissions, filtered by schoolId
    const submissionsQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'think_tank_submissions'), where('schoolId', '==', schoolId), orderBy('timestamp', 'desc'), limit(100)) : null,
    [firestore, schoolId]);
    
    const { data: submissions, isLoading } = useCollection<any>(submissionsQuery);

    const filteredSubmissions = useMemo(() => {
        if (!submissions) return [];
        return submissions.filter((sub: any) => {
            const matchesSearch = sub.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || sub.response?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGroup = selectedGroup === 'All' || sub.type === selectedGroup;
            return matchesSearch && matchesGroup;
        });
    }, [submissions, searchTerm, selectedGroup]);

    if (isLoading) return <div className="space-y-4"><Skeleton className="h-10 w-full bg-slate-900" /><Skeleton className="h-40 w-full bg-slate-900" /></div>;

    return (
        <Card className="bg-slate-950 border border-slate-900 rounded-[2rem] shadow-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-900 pb-4">
                <CardTitle className="text-white font-black text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-400" /> Student Activity Monitor
                </CardTitle>
                <CardDescription className="text-slate-400">Track and review critical thinking logs in real time.</CardDescription>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
                        <Input 
                            placeholder="Search by student name or response..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-slate-900 border-slate-800 text-white rounded-xl h-10 text-xs focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                        <SelectTrigger className="w-[160px] h-10 bg-slate-900 border-slate-800 text-slate-350 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-950 border-slate-900 text-slate-350">
                            <SelectItem value="All">All Activities</SelectItem>
                            <SelectItem value="Paradox">Paradoxes</SelectItem>
                            <SelectItem value="Detective Case">Detective Cases</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="rounded-2xl border border-slate-900 overflow-hidden bg-slate-900/30">
                    <Table>
                        <TableHeader className="bg-slate-950 border-b border-slate-900">
                            <TableRow className="border-b border-slate-900 hover:bg-slate-950/80">
                                <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Student</TableHead>
                                <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Activity</TableHead>
                                <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Response / Answer</TableHead>
                                <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Submitted Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSubmissions.map((sub: any) => (
                                <TableRow key={sub.id} className="border-b border-slate-900 hover:bg-slate-900/40 text-slate-300">
                                    <TableCell className="font-bold text-white text-xs">{sub.studentName}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("text-[9px] py-0.5 px-2 font-bold", 
                                            sub.type === 'Paradox' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        )}>
                                            {sub.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate text-xs" title={sub.response}>{sub.response}</TableCell>
                                    <TableCell className="text-[10px] text-slate-500">
                                        {sub.timestamp?.toDate ? sub.timestamp.toDate().toLocaleTimeString() : 'Just now'}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredSubmissions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-slate-500 py-8 text-xs italic">No matching activities logged.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

// --- COMPONENT: Detective Card ---
function DetectiveCard({ caseData, onDelete, isStaff, onSolve }: { caseData: any, onDelete?: () => void, isStaff: boolean, onSolve?: (points: number, id: string) => void }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    
    const [selectedOption, setSelectedOption] = useState('');
    const [isSolved, setIsSolved] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleCheck = async () => {
        setIsSolved(true);
        const correct = selectedOption === caseData.correctAnswer;
        setIsCorrect(correct);
        if (correct && onSolve) {
            onSolve(20, caseData.id); // 20 points for case
        }
        
        if (user && firestore && schoolId) {
            try {
                await addDoc(collection(firestore, 'think_tank_submissions'), {
                    studentId: user.uid,
                    userId: user.uid, // Align with firestore.rules security check!
                    studentName: user.displayName || user.email,
                    type: 'Detective Case',
                    activityId: caseData.id,
                    response: `Selected Option: "${selectedOption}" (${correct ? 'Correct' : 'Incorrect'})`,
                    timestamp: serverTimestamp(),
                    schoolId: schoolId,
                });
                if (correct) {
                    await awardActivityXP(firestore, user.uid, 25, 'Think Tank Case', 'stem_explorer');
                }
            } catch(e) { console.error("Failed to add case submission:", e); }
        }
    };

    return (
        <Card className="border border-slate-900 bg-slate-950/80 backdrop-blur-md rounded-[2rem] shadow-2xl relative overflow-hidden transition-all duration-300">
            {/* Glow highlight */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <CardHeader className="border-b border-slate-900 pb-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-amber-400 animate-pulse"/>
                        <CardTitle className="text-lg text-white font-black">Detective Desk File</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">{caseData.caseType}</Badge>
                        {isStaff && onDelete && (
                            <Button variant="ghost" size="sm" onClick={onDelete} className="text-rose-400 hover:text-rose-350 hover:bg-slate-900/60 rounded-xl"><Trash2 className="h-4 w-4"/></Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-900 relative overflow-hidden shadow-inner">
                    {/* Confidential Watermark */}
                    <div className="absolute right-4 top-2 text-slate-800 font-serif font-black text-5xl rotate-12 select-none opacity-20">TOP SECRET</div>
                    
                    <h4 className="font-extrabold text-slate-500 mb-2 uppercase text-[10px] tracking-widest">Case Scenario & Evidence:</h4>
                    <p className="text-md font-serif text-slate-100 leading-relaxed italic">"{caseData.scenario}"</p>
                </div>
                
                <div className="space-y-3">
                    <p className="font-bold text-slate-350 text-sm">{caseData.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {caseData.options.map((opt: string) => {
                            const isSelected = selectedOption === opt;
                            return (
                                <Button 
                                    key={opt} 
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start rounded-xl h-11 text-xs border-slate-800 transition-all font-semibold break-all whitespace-normal text-left",
                                        isSelected 
                                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-600 border-amber-500 shadow-lg' 
                                        : 'bg-slate-900 hover:bg-slate-850 text-slate-200'
                                    )}
                                    onClick={() => !isSolved && setSelectedOption(opt)}
                                    disabled={isSolved}
                                >
                                    {isSelected && <CheckCircle2 className="mr-2 h-4 w-4 text-slate-950 shrink-0"/>}
                                    {opt}
                                </Button>
                            );
                        })}
                    </div>
                </div>

                {isSolved && (
                    <Alert className={cn("rounded-2xl border animate-in slide-in-from-bottom duration-300", 
                        isCorrect ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-300" : "bg-rose-950/20 border-rose-900/30 text-rose-350"
                    )}>
                        {isCorrect ? <ShieldCheck className="h-5 w-5 text-emerald-400"/> : <AlertTriangle className="h-5 w-5 text-rose-455"/>}
                        <AlertTitle className="font-bold text-sm">
                            {isCorrect ? "Case Solved!" : "Incorrect Analysis"}
                        </AlertTitle>
                        <AlertDescription className="text-slate-300 mt-2 leading-relaxed text-xs">
                            {caseData.explanation}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter className="border-t border-slate-900 pt-4">
                {!isSolved && (
                    <Button onClick={handleCheck} disabled={!selectedOption} className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl shadow-lg active:scale-95 text-xs">
                        Analyze Evidence File
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

// --- SUB-COMPONENT: Detective Desk Tab ---
function DetectiveDeskTab({ schoolId, onSolve }: { schoolId: string | null; onSolve?: (points: number, id: string) => void }) {
  const { user } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [adminSelectedGroup, setAdminSelectedGroup] = useState(TARGET_GROUPS[2]); 
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role || '');

  // 1. Get Student Info
  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(() => (role === 'Student' && user && schoolId) ? query(collection(firestore!, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, [role, user, schoolId])
  );

  // 2. Determine Group
  const activeGroup = useMemo(() => {
      if (canManage) return adminSelectedGroup; 
      if (studentData && studentData[0]) return getStudentGroup(studentData[0].classId); 
      return 'Scholar (JHS)';
  }, [canManage, adminSelectedGroup, studentData]);

  // 3. Query Cases
  const casesQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    return query(collection(firestore, 'think_tank_detective_cases'), where('schoolId', '==', schoolId), limit(50));
  }, [firestore, schoolId]);

  const { data: allCases, isLoading, forceRefetch } = useCollection<any>(casesQuery);
  
  const groupCases = useMemo(() => {
      if (!allCases) return [];
      const sorted = allCases.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      return sorted.filter((c: any) => c.targetGroup === activeGroup);
  }, [allCases, activeGroup]);
  
  const activeCase = useMemo(() => {
      if (!groupCases.length) return null;
      return selectedCaseId ? groupCases.find((c: any) => c.id === selectedCaseId) : groupCases[0];
  }, [groupCases, selectedCaseId]);

  const handleGenerateCase = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser || user;
    if (!currentUser || !schoolId) return;
    setIsGenerating(true);
    toast({ title: "Investigating...", description: "Gathering evidence for a new case." });
    
    try {
        const result = await generateDetectiveCase({ targetGroup: activeGroup, schoolId });
        const docRef = await addDoc(collection(firestore!, 'think_tank_detective_cases'), {
            ...result, createdAt: serverTimestamp(), createdBy: currentUser.uid, schoolId: schoolId
        });
        toast({ title: "Case File Opened", description: "New investigation ready." });
        setSelectedCaseId(docRef.id);
        forceRefetch();
    } catch(e: any) { toast({ variant: 'destructive', title: "Error", description: e.message }); } 
    finally { setIsGenerating(false); }
  };

  const handleDeleteCase = async (id: string) => {
    if(!firestore) return;
    try {
        await deleteDoc(doc(firestore, 'think_tank_detective_cases', id));
        toast({ title: "Case Closed", description: "File deleted." });
        if (selectedCaseId === id) setSelectedCaseId(null);
        forceRefetch();
    } catch (e) { toast({ variant: 'destructive', title: "Error" }); }
  };

  if (isLoading) return <Skeleton className="h-64 w-full bg-slate-900" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-3 py-1 w-fit font-bold uppercase tracking-wider">
                    CLEARANCE: {activeGroup.toUpperCase()}
                </Badge>
                {canManage && (
                    <Select value={adminSelectedGroup} onValueChange={(val) => { setAdminSelectedGroup(val); setSelectedCaseId(null); }}>
                        <SelectTrigger className="w-[180px] h-8 text-xs bg-slate-900 border-slate-800 text-slate-300 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-950 border-slate-900 text-slate-300">{TARGET_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                )}
            </div>

            {activeCase ? (
                <DetectiveCard 
                    key={activeCase.id} 
                    caseData={activeCase} 
                    isStaff={canManage}
                    onDelete={() => handleDeleteCase(activeCase.id)}
                    onSolve={onSolve}
                />
            ) : (
                <Card className="text-center py-12 border-2 border-dashed border-slate-800 h-full flex flex-col justify-center items-center bg-slate-950/20 rounded-3xl">
                    <Search className="h-12 w-12 text-slate-700 mb-2 animate-bounce" />
                    <CardTitle className="text-white font-bold text-md">No Active Cases</CardTitle>
                    <CardDescription className="text-slate-500 mt-1">The desk is currently clear for {activeGroup}.</CardDescription>
                </Card>
            )}
        </div>

        <div className="space-y-4">
            {canManage && (
                <Card className="bg-amber-500/5 border border-amber-500/10 shadow-sm rounded-3xl">
                    <CardContent className="p-4">
                        <h3 className="font-extrabold text-amber-455 text-amber-400 text-xs mb-2 flex items-center gap-2"><PlusCircle className="h-4.5 w-4.5"/> New Investigation</h3>
                        <Button onClick={handleGenerateCase} disabled={isGenerating} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl h-10 text-xs shadow-md">
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Generate Case File"}
                        </Button>
                    </CardContent>
                </Card>
            )}
            <Card className="max-h-[500px] flex flex-col bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
                <CardHeader className="py-3 px-4 bg-slate-900/60 border-b border-slate-900"><CardTitle className="text-sm text-white font-black">Case File Archive</CardTitle></CardHeader>
                <CardContent className="p-0 flex-1 min-h-0">
                    <ScrollArea className="h-[300px] lg:h-[400px]">
                        <div className="flex flex-col p-2 gap-1.5">
                            {groupCases.length === 0 && <p className="text-xs text-center text-slate-600 p-6 italic">No archived cases found.</p>}
                            {groupCases.map((c: any) => (
                                <button 
                                    key={c.id}
                                    onClick={() => setSelectedCaseId(c.id)}
                                    className={`text-left p-3.5 rounded-2xl text-xs transition-all border flex justify-between items-center gap-2 group ${c.id === activeCase?.id ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold shadow-md' : 'bg-slate-900/30 border-transparent hover:bg-slate-900/60 hover:border-slate-800 text-slate-400 hover:text-slate-200'}`}
                                >
                                    <div className="truncate flex-1">
                                        <span className="block truncate font-bold text-slate-200 group-hover:text-amber-400 transition-colors">{c.caseType}</span>
                                        <span className="text-[10px] text-slate-500 truncate block mt-0.5">{c.scenario}</span>
                                    </div>
                                    {c.id === activeCase?.id && <CheckCircle2 className="h-4.5 w-4.5 text-amber-400 shrink-0"/>}
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

// --- SUB-COMPONENT: Daily Paradox Tab ---
function DailyParadoxTab({ schoolId, onSolve }: { schoolId: string | null; onSolve?: (points: number, id: string) => void }) {
  const { user, isUserLoading } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [adminSelectedGroup, setAdminSelectedGroup] = useState(TARGET_GROUPS[2]); 
  const [selectedParadoxId, setSelectedParadoxId] = useState<string | null>(null);

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role || '');

  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(() => (role === 'Student' && user && schoolId) ? query(collection(firestore!, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, [role, user, schoolId])
  );

  const activeGroup = useMemo(() => {
      if (canManage) return adminSelectedGroup; 
      if (studentData && studentData[0]) return getStudentGroup(studentData[0].classId); 
      return 'Scholar (JHS)';
  }, [canManage, adminSelectedGroup, studentData]);

  const paradoxQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    return query(collection(firestore, 'think_tank_paradoxes'), where('schoolId', '==', schoolId), limit(50));
  }, [firestore, schoolId]);

  const { data: allParadoxes, isLoading, forceRefetch } = useCollection<Paradox>(paradoxQuery);
  
  const groupParadoxes = useMemo(() => {
      if (!allParadoxes) return [];
      const sorted = allParadoxes.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      return sorted.filter(p => p.targetGroup === activeGroup);
  }, [allParadoxes, activeGroup]);
  
  const activeParadox = useMemo(() => {
      if (!groupParadoxes.length) return null;
      return selectedParadoxId ? groupParadoxes.find(p => p.id === selectedParadoxId) : groupParadoxes[0];
  }, [groupParadoxes, selectedParadoxId]);

  const hasPuzzleForToday = useMemo(() => {
      if (!groupParadoxes.length) return false;
      const newest = groupParadoxes[0];
      if (!newest.createdAt) return false; 
      const puzzleDate = newest.createdAt.toDate ? newest.createdAt.toDate() : new Date(newest.createdAt.seconds * 1000);
      return isSameDay(puzzleDate, new Date());
  }, [groupParadoxes]);
  
    const handleAttempt = async (answer: string) => {
      if (!user || canManage || !schoolId) return; 
      
      if (onSolve && activeParadox?.id) {
          onSolve(10, activeParadox.id); // 10 points
      }

      await addDocumentNonBlocking(collection(firestore!, 'think_tank_submissions'), {
          studentId: user.uid,
          userId: user.uid, // Align with firestore.rules check
          studentName: user.displayName || user.email,
          type: 'Paradox',
          activityId: activeParadox?.id,
          response: answer,
          timestamp: serverTimestamp(),
          schoolId: schoolId,
      });
  };

  const handleDeleteParadox = async (id: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!firestore) {
          toast({ variant: 'destructive', title: "Error", description: "Database connection not ready." });
          return;
      }
      try {
          await deleteDoc(doc(firestore, 'think_tank_paradoxes', id));
          toast({ title: "Deleted", description: "Puzzle removed." });
          if (selectedParadoxId === id) setSelectedParadoxId(null);
          forceRefetch();
      } catch (e: any) {
          console.error("Delete failed:", e);
          toast({ variant: 'destructive', title: "Error", description: "Could not delete. Check console permissions." });
      }
  };

  const handleGenerateParadox = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser || user;
    if (!currentUser || !schoolId) return;
    setIsGenerating(true);
    try {
        const result = await generateDailyParadox({ targetGroup: activeGroup, schoolId });
        if (!result) throw new Error("AI returned no data");
        const docRef = await addDoc(collection(firestore!, 'think_tank_paradoxes'), {
            ...result, createdAt: serverTimestamp(), createdBy: currentUser.uid, schoolId: schoolId
        });
        toast({ title: "Success!" });
        setSelectedParadoxId(docRef.id);
        forceRefetch();
    } catch(e: any) { toast({ variant: 'destructive', title: "AI Error", description: e.message }); } 
    finally { setIsGenerating(false); }
  };

  if (isLoading || isUserLoading) return <Skeleton className="h-64 w-full bg-slate-900" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-3 py-1 font-bold">LEVEL: {activeGroup.toUpperCase()}</Badge>
                {canManage && <Select value={adminSelectedGroup} onValueChange={(val) => { setAdminSelectedGroup(val); setSelectedParadoxId(null); }}><SelectTrigger className="w-[180px] h-8 text-xs bg-slate-900 border-slate-800 text-slate-350 rounded-xl"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-950 border-slate-900 text-slate-350">{TARGET_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>}
            </div>
            {activeParadox ? (
                <ParadoxCard key={activeParadox.id} paradox={activeParadox} onComplete={() => {}} onAttempt={handleAttempt} onDelete={() => handleDeleteParadox(activeParadox.id)} isStaff={canManage}/>
            ) : (
                <Card className="text-center py-12 border-2 border-dashed border-slate-800 bg-slate-950/20 rounded-3xl"><CardTitle className="text-white font-bold text-md">No Paradox Puzzles Available</CardTitle><CardDescription className="text-slate-500 mt-1">For {activeGroup}</CardDescription></Card>
            )}
        </div>
        <div className="space-y-4">
            {canManage && !hasPuzzleForToday && (
                <Button onClick={handleGenerateParadox} disabled={isGenerating} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-11 text-xs shadow-lg">
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Generate Today's Puzzle"}
                </Button>
            )}
            <Card className="max-h-[500px] flex flex-col bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
                <CardHeader className="py-3 px-4 bg-slate-900/60 border-b border-slate-900"><CardTitle className="text-sm text-white font-black">Paradox Archive</CardTitle></CardHeader>
                <CardContent className="p-0 flex-1 min-h-0">
                    <ScrollArea className="h-[300px] lg:h-[400px]">
                        <div className="flex flex-col p-2 gap-1.5">
                            {groupParadoxes.length === 0 && <p className="text-xs text-center text-slate-650 p-6 italic">No archived paradoxes.</p>}
                            {groupParadoxes.map((p) => (
                                <div key={p.id} onClick={() => setSelectedParadoxId(p.id)} className={`p-3.5 rounded-2xl text-xs border flex justify-between items-center cursor-pointer transition-all ${p.id === activeParadox?.id ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold shadow-md' : 'bg-slate-900/30 border-transparent hover:bg-slate-900/60 hover:border-slate-800 text-slate-400 hover:text-slate-200'}`}>
                                    <span className="truncate flex-1 pr-2">{p.question}</span>
                                    {canManage && <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-400 hover:text-rose-350 hover:bg-rose-500/10 rounded-xl" onClick={(e) => handleDeleteParadox(p.id, e)}><Trash2 className="h-3.5 w-3.5"/></Button>}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

// --- SUB-COMPONENT: Debate Arena Tab ---
function DebateArenaTab({ schoolId, onSolve }: { schoolId: string | null; onSolve?: (points: number, id: string) => void }) {
  const { user } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [adminSelectedGroup, setAdminSelectedGroup] = useState(TARGET_GROUPS[2]);
  const [customTopic, setCustomTopic] = useState('');
  
  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role || '');
  
  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(() => (role === 'Student' && user && schoolId) ? query(collection(firestore!, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, [role, user, schoolId])
  );
  
  const activeGroup = useMemo(() => {
      if (canManage) return adminSelectedGroup;
      if (studentData && studentData[0]) return getStudentGroup(studentData[0].classId);
      return 'Scholar (JHS)';
  }, [canManage, adminSelectedGroup, studentData]);
  
  const topicsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'think_tank_debates'), where('schoolId', '==', schoolId), limit(50)) : null, [firestore, schoolId]);
  const { data: allTopics, isLoading, forceRefetch } = useCollection<DebateTopic>(topicsQuery);
  
  const latestTopic = useMemo(() => {
      if (!allTopics || allTopics.length === 0) return null;
      const groupTopics = allTopics
        .filter(t => t.targetGroup === activeGroup)
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      
      return groupTopics[0];
  }, [allTopics, activeGroup]);

  const handleAiGenerate = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser || user;
      if (!currentUser || !schoolId) return;

      if (!customTopic.trim()) {
        toast({ title: "Topic Required", description: "Please enter a topic to generate a debate context.", variant: "destructive" });
        return;
      }

      setIsGenerating(true);
      try {
          const result = await generateDebateTopic({ 
              targetGroup: activeGroup, 
              schoolId,
              topic: customTopic
          });
          await addDoc(collection(firestore!, 'think_tank_debates'), { ...result, createdAt: serverTimestamp(), createdBy: currentUser.uid, schoolId: schoolId });
          toast({ title: "AI Generated Debate Context!" });
          forceRefetch();
          setCustomTopic('');
      } catch(e: any) {
          toast({ variant: 'destructive', title: "AI Error", description: e.message });
      } finally {
          setIsGenerating(false);
      }
  };
  
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-3 py-1 font-bold">Arena: {activeGroup}</Badge>
            {canManage && <Select value={adminSelectedGroup} onValueChange={setAdminSelectedGroup}><SelectTrigger className="w-[200px] h-8 text-xs bg-slate-900 border-slate-800 text-slate-300 rounded-xl"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-950 border-slate-900 text-slate-350">{TARGET_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>}
        </div>
        {canManage && (
            <Card className="bg-slate-900/30 border border-slate-900 rounded-2xl">
                <CardHeader className="pb-2"><CardTitle className="text-white text-xs font-black">Generate Debate Subject Blueprint</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Enter custom topic details..."
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                            className="bg-slate-950 border-slate-850 text-white rounded-xl text-xs"
                        />
                        <Button onClick={handleAiGenerate} disabled={isGenerating || !customTopic.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 text-xs font-bold shrink-0">
                            {isGenerating ? <Loader2 className="animate-spin h-4 w-4"/> : "Generate"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )}
        {isLoading ? (
            <Skeleton className="h-96 w-full bg-slate-900 rounded-[2.5rem] animate-pulse" />
        ) : latestTopic ? (
            <DebateArena topic={latestTopic} onSolve={onSolve} />
        ) : (
            <Card className="text-center py-12 border-2 border-dashed border-slate-850 bg-slate-950/20 rounded-3xl">
                <CardHeader>
                    <MessageSquare className="mx-auto h-12 w-12 text-slate-700 mb-2 animate-pulse"/>
                    <CardTitle className="text-white font-bold text-md">No Active Debate</CardTitle>
                    <CardDescription className="text-slate-500 mt-1">There is no debate topic set for {activeGroup} yet.</CardDescription>
                </CardHeader>
            </Card>
        )}
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function ThinkTankPage() {
  const { role } = useRole();
  const { user } = useUser();
  const firestore = useFirestore();
  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role || '');
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const [solvedActivities, setSolvedActivities] = useState<string[]>([]);
  const [logicPoints, setLogicPoints] = useState(0);

  // Load progress
  useEffect(() => {
    if (!user || !firestore) return;
    const fetchProgress = async () => {
        try {
            const progressRef = doc(firestore, 'student_progress', user.uid);
            const snap = await getDoc(progressRef);
            if (snap.exists()) {
                const data = snap.data();
                if (data.thinkTankCompleted) setSolvedActivities(data.thinkTankCompleted);
                if (data.thinkTankScore) setLogicPoints(data.thinkTankScore);
            }
        } catch (e) {
            console.error("Failed to load think tank progress:", e);
        }
    };
    fetchProgress();
  }, [user, firestore]);

  // Solver points callback
  const handleSolve = async (points: number, activityId: string) => {
    if (!user || !firestore || canManage) return;
    if (solvedActivities.includes(activityId)) return; // No duplicate scoring

    const nextSolved = [...solvedActivities, activityId];
    const nextPoints = logicPoints + points;

    setSolvedActivities(nextSolved);
    setLogicPoints(nextPoints);

    try {
        const progressRef = doc(firestore, 'student_progress', user.uid);
        await setDoc(progressRef, {
            thinkTankCompleted: nextSolved,
            thinkTankScore: nextPoints
        }, { merge: true });
        
        confetti({ particleCount: 120, spread: 60, colors: ['#6366f1', '#a855f7', '#ec4899'] });
    } catch (e) {
        console.error("Failed to save progress:", e);
    }
  };

  const nextMilestone = logicPoints < 30 ? 30 : logicPoints < 100 ? 100 : logicPoints < 200 ? 200 : 300;
  const currentThreshold = logicPoints < 30 ? 0 : logicPoints < 100 ? 30 : logicPoints < 200 ? 100 : 200;
  const xpPercentage = Math.min(100, Math.round(((logicPoints - currentThreshold) / (nextMilestone - currentThreshold)) * 100)) || 0;

  const sleuthRank = logicPoints < 30 
    ? "Mentalist Novice 🧠" 
    : logicPoints < 100 
      ? "Logic Sleuth 🕵️" 
      : logicPoints < 200 
        ? "Paradox Master 🌀" 
        : "Grandmaster Thinker 👑";

  if (isLoadingSchool) {
      return (
          <div className="flex h-64 w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
      );
  }

  return (
    <div className="space-y-6 p-6 min-h-screen bg-slate-950 text-slate-100 relative rounded-3xl border border-slate-900 shadow-2xl overflow-hidden flex flex-col">
      {/* Decorative backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <BrainCircuit className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                The Think Tank
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Sharpen your mind with daily logic paradoxes, debate modules, and investigative deductive cases.
              </p>
            </div>
          </div>
      </div>

      {/* --- TOP BAR: GAMIFICATION --- */}
      {!canManage && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-xl gap-4 shrink-0 mx-1 mt-1 relative z-10">
            <div className="flex items-center gap-3">
                 <div className="bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-full"><Trophy className="h-5 w-5 text-indigo-400" /></div>
                 <div>
                     <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Cognitive Rank</div>
                     <div className="text-sm font-bold text-white flex items-center gap-2">
                         {sleuthRank}
                         <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] py-0.5 font-mono">{logicPoints} Logic XP</Badge>
                     </div>
                 </div>
            </div>
            <div className="flex-grow max-w-lg mx-0 sm:mx-8 w-full sm:w-auto">
                 <div className="flex justify-between text-[10px] mb-1">
                     <span className="font-bold uppercase tracking-wider text-slate-450 text-slate-450">Next Rank Progress</span>
                     <span className="font-bold text-indigo-400">{xpPercentage}% ({logicPoints}/{nextMilestone} XP)</span>
                 </div>
                 <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-900">
                     <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${xpPercentage}%` }}></div>
                 </div>
            </div>
          </div>
      )}

      <Tabs defaultValue="paradox" className="w-full flex-1 flex flex-col min-h-0 relative z-10">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 p-1 bg-slate-900 border border-slate-800 rounded-2xl shrink-0">
            <TabsTrigger value="paradox" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20">Daily Paradox</TabsTrigger>
            <TabsTrigger value="detective" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20">Detective Desk</TabsTrigger>
            <TabsTrigger value="debate" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20">Debate Arena</TabsTrigger>
            {canManage && <TabsTrigger value="monitor" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20"><Activity className="mr-2 h-4 w-4"/> Activity Log</TabsTrigger>}
        </TabsList>
        <TabsContent value="paradox" className="mt-6 flex-1"><DailyParadoxTab schoolId={schoolId} onSolve={handleSolve} /></TabsContent>
        <TabsContent value="detective" className="mt-6 flex-1"><DetectiveDeskTab schoolId={schoolId} onSolve={handleSolve} /></TabsContent>
        <TabsContent value="debate" className="mt-6 flex-1"><DebateArenaTab schoolId={schoolId} onSolve={handleSolve} /></TabsContent>
        {canManage && (
            <TabsContent value="monitor" className="mt-6 flex-1">
                <TeacherMonitorTab schoolId={schoolId} />
            </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
