'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, where, setDoc, increment, getDocs, onSnapshot, limit } from 'firebase/firestore';
import { isSameDay } from 'date-fns';
import { BrainCircuit, Loader2, PlusCircle, Lightbulb, Clock, CheckCircle2, ChevronRight, MessageSquare, Search, AlertTriangle, ShieldCheck, Wand2, Trash2, Activity, Users } from 'lucide-react';
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

// Custom Components
import { ParadoxCard, DebateArena } from '@/components/academics/think-tank-components';

// Types and AI Functions
import type { Paradox, DebateTopic, Student } from '@/lib/types';
import { generateDailyParadox, generateDebateTopic, generateDetectiveCase } from '@/ai/flows/think-tank'; 
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { formatDate } from 'date-fns';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { checkAndSpendCredits } from '@/app/actions/credits';

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
    // Query last 50 submissions, filtered by schoolId
    const submissionsQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'think_tank_submissions'), where('schoolId', '==', schoolId), orderBy('timestamp', 'desc'), limit(50)) : null,
    [firestore, schoolId]);
    
    const { data: submissions, isLoading } = useCollection<any>(submissionsQuery);

    if (isLoading) return <Skeleton className="h-40 w-full" />;

    return (
        <Card>
            <CardHeader><CardTitle>Student Activity Log</CardTitle><CardDescription>Real-time tracking of critical thinking activities.</CardDescription></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Activity</TableHead><TableHead>Response</TableHead><TableHead>Time</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {submissions?.map((sub) => (
                            <TableRow key={sub.id}>
                                <TableCell className="font-medium">{sub.studentName}</TableCell>
                                <TableCell><Badge variant="outline">{sub.type}</Badge></TableCell>
                                <TableCell className="max-w-xs truncate" title={sub.response}>{sub.response}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {sub.timestamp?.toDate ? sub.timestamp.toDate().toLocaleTimeString() : 'Just now'}
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!submissions || submissions.length === 0) && <TableRow><TableCell colSpan={4} className="text-center">No activity yet.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}


// --- COMPONENT: Detective Card ---
function DetectiveCard({ caseData, onDelete, isStaff }: { caseData: any, onDelete?: () => void, isStaff: boolean }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [isSolved, setIsSolved] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleCheck = () => {
        setIsSolved(true);
        setIsCorrect(selectedOption === caseData.correctAnswer);
    };

    return (
        <Card className="border-t-4 border-t-amber-500 shadow-md">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-amber-600"/>
                        <CardTitle className="text-lg">Detective Case #{caseData.id.slice(0,4)}</CardTitle>
                    </div>
                    {isStaff && onDelete && (
                        <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4"/></Button>
                    )}
                </div>
                <CardDescription className="flex gap-2 mt-1">
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{caseData.caseType}</Badge>
                    <Badge variant="secondary">{caseData.targetGroup}</Badge>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-md border border-slate-200 relative overflow-hidden">
                     {/* "Top Secret" Watermark effect */}
                    <div className="absolute -right-4 -top-4 text-slate-100 font-black text-6xl rotate-12 select-none">CASE</div>
                    
                    <h4 className="font-bold text-slate-700 mb-2 uppercase text-xs tracking-wider">Evidence:</h4>
                    <p className="text-lg font-serif text-slate-900 leading-relaxed italic">"{caseData.scenario}"</p>
                </div>
                
                <div className="space-y-3">
                    <p className="font-medium text-slate-700">{caseData.question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {caseData.options.map((opt: string) => (
                            <Button 
                                key={opt} 
                                variant={selectedOption === opt ? "default" : "outline"}
                                className={`w-full justify-start ${selectedOption === opt ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
                                onClick={() => !isSolved && setSelectedOption(opt)}
                                disabled={isSolved}
                            >
                                {selectedOption === opt && <CheckCircle2 className="mr-2 h-4 w-4"/>}
                                {opt}
                            </Button>
                        ))}
                    </div>
                </div>

                {isSolved && (
                    <Alert className={isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
                        {isCorrect ? <ShieldCheck className="h-4 w-4 text-green-600"/> : <AlertTriangle className="h-4 w-4 text-red-600"/>}
                        <AlertTitle className={isCorrect ? "text-green-800" : "text-red-800"}>
                            {isCorrect ? "Case Solved!" : "Incorrect Analysis"}
                        </AlertTitle>
                        <AlertDescription className="text-slate-700 mt-1">
                            {caseData.explanation}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
            <CardFooter>
                {!isSolved && (
                    <Button onClick={handleCheck} disabled={!selectedOption} className="w-full bg-amber-600 hover:bg-amber-700">Analyze Evidence</Button>
                )}
            </CardFooter>
        </Card>
    );
}

// --- SUB-COMPONENT: Detective Desk Tab ---
function DetectiveDeskTab({ schoolId }: { schoolId: string | null }) {
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

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <Badge variant="outline" className="text-sm px-3 py-1 w-fit bg-amber-50 text-amber-800 border-amber-200">
                    CLEARANCE: {activeGroup.toUpperCase()}
                </Badge>
                {canManage && (
                    <Select value={adminSelectedGroup} onValueChange={(val) => { setAdminSelectedGroup(val); setSelectedCaseId(null); }}>
                        <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{TARGET_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                )}
            </div>

            {activeCase ? (
                <DetectiveCard 
                    key={activeCase.id} 
                    caseData={activeCase} 
                    isStaff={canManage}
                    onDelete={() => handleDeleteCase(activeCase.id)}
                />
            ) : (
                <Card className="text-center py-10 border-2 border-dashed h-full flex flex-col justify-center items-center bg-slate-50/50">
                    <Search className="h-12 w-12 text-slate-300 mb-2" />
                    <CardTitle>No Active Cases</CardTitle>
                    <CardDescription>The desk is clear for {activeGroup}.</CardDescription>
                </Card>
            )}
        </div>

        <div className="space-y-4">
            {canManage && (
                <Card className="bg-amber-50 border-amber-200 shadow-sm">
                    <CardContent className="p-4">
                        <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2"><PlusCircle className="h-4 w-4"/> New Investigation</h3>
                        <Button onClick={handleGenerateCase} disabled={isGenerating} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Generate Case File"}
                        </Button>
                    </CardContent>
                </Card>
            )}
            <Card className="max-h-[500px] flex flex-col">
                <CardHeader className="py-3 px-4 bg-slate-50 border-b"><CardTitle className="text-md">Case Archive</CardTitle></CardHeader>
                <CardContent className="p-0 flex-1 min-h-0">
                    <ScrollArea className="h-[300px] lg:h-[400px]">
                        <div className="flex flex-col p-2 gap-1">
                            {groupCases.length === 0 && <p className="text-xs text-center text-muted-foreground p-4">No cases found.</p>}
                            {groupCases.map((c: any) => (
                                <button 
                                    key={c.id}
                                    onClick={() => setSelectedCaseId(c.id)}
                                    className={`text-left p-3 rounded-md text-sm transition-colors border flex justify-between items-center group ${c.id === activeCase?.id ? 'bg-amber-50 border-amber-200 text-amber-900 font-medium' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
                                >
                                    <div className="truncate flex-1 pr-2">
                                        <span className="block truncate font-medium">{c.caseType}</span>
                                        <span className="text-xs text-muted-foreground truncate">{c.scenario}</span>
                                    </div>
                                    {c.id === activeCase?.id && <CheckCircle2 className="h-4 w-4 text-amber-500"/>}
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
function DailyParadoxTab({ schoolId }: { schoolId: string | null }) {
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
      await addDocumentNonBlocking(collection(firestore!, 'think_tank_submissions'), {
          studentId: user.uid,
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

  if (isLoading || isUserLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <Badge variant="secondary">Level: {activeGroup}</Badge>
                {canManage && <Select value={adminSelectedGroup} onValueChange={(val) => { setAdminSelectedGroup(val); setSelectedParadoxId(null); }}><SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{TARGET_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>}
            </div>
            {activeParadox ? (
                <ParadoxCard key={activeParadox.id} paradox={activeParadox} onComplete={() => {}} onAttempt={handleAttempt} onDelete={() => handleDeleteParadox(activeParadox.id)} isStaff={canManage}/>
            ) : (
                <Card className="text-center py-10 border-2 border-dashed"><CardTitle>No Puzzles</CardTitle><CardDescription>For {activeGroup}</CardDescription></Card>
            )}
        </div>
        <div className="space-y-4">
            {canManage && !hasPuzzleForToday && (
                <Button onClick={handleGenerateParadox} disabled={isGenerating} className="w-full bg-indigo-600">
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Generate Today's Puzzle"}
                </Button>
            )}
            <Card className="max-h-[500px] flex flex-col">
                <CardHeader className="py-3 px-4 bg-slate-50 border-b"><CardTitle className="text-md">Archive</CardTitle></CardHeader>
                <CardContent className="p-0 flex-1 min-h-0">
                    <ScrollArea className="h-[300px] lg:h-[400px]">
                        <div className="flex flex-col p-2 gap-1">
                            {groupParadoxes.map((p) => (
                                <div key={p.id} onClick={() => setSelectedParadoxId(p.id)} className={`p-3 rounded-md text-sm border flex justify-between items-center group cursor-pointer ${p.id === activeParadox?.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white'}`}>
                                    <span className="truncate flex-1">{p.question}</span>
                                    {canManage && <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 z-10" onClick={(e) => handleDeleteParadox(p.id, e)}><Trash2 className="h-3 w-3"/></Button>}
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
function DebateArenaTab({ schoolId }: { schoolId: string | null }) {
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
            <Badge variant="outline" className="text-sm px-3 py-1">Current Arena: {activeGroup}</Badge>
            {canManage && <Select value={adminSelectedGroup} onValueChange={setAdminSelectedGroup}><SelectTrigger className="w-[200px] h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent>{TARGET_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>}
        </div>
        {canManage && (
            <Card className="bg-slate-50 border-slate-200">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Generate New Debate Context</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Enter custom topic..."
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                        />
                        <Button onClick={handleAiGenerate} disabled={isGenerating || !customTopic.trim()} className="bg-purple-600 hover:bg-purple-700">
                            {isGenerating ? <Loader2 className="animate-spin h-4 w-4"/> : "Go"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )}
        {isLoading ? <Skeleton className="h-96 w-full" /> : latestTopic ? <DebateArena topic={latestTopic} /> : <Card className="text-center py-10"><CardHeader><MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-2"/><CardTitle>No Active Debate</CardTitle><CardDescription>There is no debate topic set for {activeGroup} yet.</CardDescription></CardHeader></Card>}
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function ThinkTankPage() {
  const { role } = useRole();
  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role || '');
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  if (isLoadingSchool) {
      return (
          <div className="flex h-64 w-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      );
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="border-l-4 border-l-indigo-500 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-indigo-600" />
            The Think Tank
          </CardTitle>
          <CardDescription>
            Sharpen your mind with daily logic puzzles and critical analysis.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="paradox" className="w-full">
        <TabsList className={cn("grid w-full", canManage ? "grid-cols-4" : "grid-cols-3")}>
            <TabsTrigger value="paradox">Daily Paradox</TabsTrigger>
            <TabsTrigger value="detective">Detective Desk</TabsTrigger>
            <TabsTrigger value="debate">Debate Arena</TabsTrigger>
            {canManage && <TabsTrigger value="monitor"><Activity className="mr-2 h-4 w-4"/> Activity Log</TabsTrigger>}
        </TabsList>
        <TabsContent value="paradox" className="mt-6"><DailyParadoxTab schoolId={schoolId} /></TabsContent>
        <TabsContent value="detective" className="mt-6"><DetectiveDeskTab schoolId={schoolId} /></TabsContent>
        <TabsContent value="debate" className="mt-6"><DebateArenaTab schoolId={schoolId} /></TabsContent>
        {canManage && (
            <TabsContent value="monitor" className="mt-6">
                <TeacherMonitorTab schoolId={schoolId} />
            </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
