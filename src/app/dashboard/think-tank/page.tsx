
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, limit, addDoc, serverTimestamp, deleteDoc, doc, where, getDocs, increment } from 'firebase/firestore';
import { startOfDay, isSameDay, endOfDay, formatDate } from 'date-fns';
import { BrainCircuit, Loader2, PlusCircle, Lightbulb, Clock, CheckCircle2, ChevronRight, MessageSquare, Wand2, Trash2, Activity, Users } from 'lucide-react';
import { getAuth } from 'firebase/auth';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Custom Components
import { ParadoxCard, DebateArena } from '@/components/academics/think-tank-components';

// Types and AI Functions
import type { Paradox, DebateTopic, Student } from '@/lib/types';
import { generateDailyParadox, generateDebateTopic, runDebateTurn } from '@/ai/flows/think-tank'; 
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';


// --- CONSTANTS ---
const TARGET_GROUPS = [
    'Novice (Basic 1-3)',
    'Apprentice (Basic 4-6)',
    'Scholar (JHS)',
    'Master (SHS)'
];

// Helper to map a student's class name to a group
const getStudentGroup = (className: string = '') => {
    const name = className.toLowerCase();
    if (name.includes('bs1') || name.includes('bs2') || name.includes('bs3') || name.includes('class 1')) return 'Novice (Basic 1-3)';
    if (name.includes('bs4') || name.includes('bs5') || name.includes('bs6') || name.includes('class 4')) return 'Apprentice (Basic 4-6)';
    if (name.includes('jhs') || name.includes('bs7') || name.includes('bs8') || name.includes('bs9')) return 'Scholar (JHS)';
    if (name.includes('shs') || name.includes('grade 10')) return 'Master (SHS)';
    return 'Scholar (JHS)'; 
};

// --- SUB-COMPONENT: Teacher Monitor ---
function TeacherMonitorTab() {
    const firestore = useFirestore();
    // Query last 50 submissions
    const submissionsQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'think_tank_submissions'), orderBy('timestamp', 'desc'), limit(50)) : null,
    [firestore]);
    
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

// --- SUB-COMPONENT: Daily Paradox Tab ---
function DailyParadoxTab() {
  const { user, isUserLoading } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [adminSelectedGroup, setAdminSelectedGroup] = useState(TARGET_GROUPS[2]); 
  const [selectedParadoxId, setSelectedParadoxId] = useState<string | null>(null);

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role);

  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(() => (role === 'Student' && user) ? query(collection(firestore!, 'students'), where('uid', '==', user.uid)) : null, [role, user])
  );

  const activeGroup = useMemo(() => {
      if (canManage) return adminSelectedGroup; 
      if (studentData && studentData[0]) return getStudentGroup(studentData[0].classId); 
      return 'Scholar (JHS)';
  }, [canManage, adminSelectedGroup, studentData]);

  const paradoxQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'think_tank_paradoxes'), limit(50));
  }, [firestore]);

  const { data: allParadoxes, isLoading, forceRefetch } = useCollection<Paradox>(paradoxQuery);
  
  const groupParadoxes = useMemo(() => {
      if (!allParadoxes) return [];
      const sorted = allParadoxes.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      return sorted.filter(p => p.targetGroup === activeGroup);
  }, [allParadoxes, activeGroup]);
  
  const activeParadox = useMemo(() => {
      if (!groupParadoxes.length) return null;
      return selectedParadoxId ? groupParadoxes.find(p => p.id === selectedParadoxId) || groupParadoxes[0] : groupParadoxes[0];
  }, [groupParadoxes, selectedParadoxId]);

  const hasPuzzleForToday = useMemo(() => {
      if (!groupParadoxes.length) return false;
      const newest = groupParadoxes[0];
      if (!newest.createdAt) return false; 
      const puzzleDate = newest.createdAt.toDate ? newest.createdAt.toDate() : new Date(newest.createdAt.seconds * 1000);
      return isSameDay(puzzleDate, new Date());
  }, [groupParadoxes]);

  const handleAttempt = async (answer: string) => {
      if (!user || canManage) return; 
      await addDocumentNonBlocking(collection(firestore!, 'think_tank_submissions'), {
          studentId: user.uid,
          studentName: user.displayName || user.email,
          type: 'Paradox',
          activityId: activeParadox?.id,
          response: answer,
          timestamp: serverTimestamp()
      });
  };

  const handleDeleteParadox = async (id: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      console.log("Attempting to delete:", id);
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
    if (!currentUser) return;
    setIsGenerating(true);
    try {
        const result = await generateDailyParadox({ targetGroup: activeGroup });
        if (!result) throw new Error("AI returned no data");
        const docRef = await addDoc(collection(firestore!, 'think_tank_paradoxes'), {
            ...result, createdAt: serverTimestamp(), createdBy: currentUser.uid
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
                <Badge variant="secondary" className="text-sm px-3 py-1 w-fit">Level: {activeGroup}</Badge>
                {canManage && (
                    <Select value={adminSelectedGroup} onValueChange={(val) => { setAdminSelectedGroup(val); setSelectedParadoxId(null); }}>
                        <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{TARGET_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                )}
            </div>
            {activeParadox ? (
                <ParadoxCard key={activeParadox.id} paradox={activeParadox} onComplete={() => {}} onAttempt={handleAttempt} onDelete={() => handleDeleteParadox(activeParadox.id)} isStaff={canManage}/>
            ) : (
                <Card className="text-center py-10 border-2 border-dashed h-full flex flex-col justify-center items-center">
                    <Lightbulb className="h-12 w-12 text-slate-300 mb-2" />
                    <CardTitle>No Puzzles for {activeGroup}</CardTitle>
                    <CardDescription>The archives are empty for this level.</CardDescription>
                </Card>
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
                            {groupParadoxes.map((p) => {
                                const isSelected = p.id === activeParadox?.id;
                                return (
                                    <div 
                                        key={p.id}
                                        onClick={() => setSelectedParadoxId(p.id)}
                                        className={`p-3 rounded-md text-sm transition-colors border flex justify-between items-center group cursor-pointer ${isSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
                                    >
                                        <span className="truncate flex-1 pr-2">{p.question}</span>
                                        {canManage && <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600 hover:bg-red-50 z-10" onClick={(e) => handleDeleteParadox(p.id, e)}><Trash2 className="h-3 w-3"/></Button>}
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

// --- SUB-COMPONENT: Debate Arena Tab ---
function DebateArenaTab() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [newTopic, setNewTopic] = useState('');
  const [newContext, setNewContext] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [adminSelectedGroup, setAdminSelectedGroup] = useState(TARGET_GROUPS[2]);
  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role);

  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(() => (role === 'Student' && user) ? query(collection(firestore!, 'students'), where('uid', '==', user.uid)) : null, [role, user])
  );

  const activeGroup = useMemo(() => {
      if (canManage) return adminSelectedGroup;
      if (studentData && studentData[0]) return getStudentGroup(studentData[0].classId);
      return 'Scholar (JHS)';
  }, [canManage, adminSelectedGroup, studentData]);

  const topicsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'think_tank_debates'), limit(50)) : null,
    [firestore]
  );
  const { data: allTopics, isLoading, forceRefetch } = useCollection<DebateTopic>(topicsQuery);
  
  const latestTopic = useMemo(() => {
      if (!allTopics || allTopics.length === 0) return null;
      const groupTopics = allTopics
        .filter(t => t.targetGroup === activeGroup)
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      return groupTopics[0];
  }, [allTopics, activeGroup]);

  const handleSetTopic = async () => {
      if (!newTopic.trim()) return;
      const auth = getAuth();
      const currentUser = auth.currentUser || user;
      if (!currentUser) return;
      setIsSubmitting(true);
      try {
          await addDoc(collection(firestore!, 'think_tank_debates'), {
              topic: newTopic, context: newContext, targetGroup: activeGroup, createdAt: serverTimestamp(), createdBy: currentUser.uid
          });
          toast({ title: 'New Debate Topic Set!' });
          setNewTopic(''); setNewContext('');
          forceRefetch();
      } catch (e) { toast({ variant: 'destructive', title: 'Error' }); }
      finally { setIsSubmitting(false); }
  };

  const handleAiGenerate = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser || user;
      if (!currentUser) return;
      setIsGenerating(true);
      try {
          const result = await generateDebateTopic({ targetGroup: activeGroup });
          await addDoc(collection(firestore!, 'think_tank_debates'), {
              ...result, createdAt: serverTimestamp(), createdBy: currentUser.uid
          });
          toast({ title: "AI Generated Debate!" });
          forceRefetch();
      } catch(e: any) { toast({ variant: 'destructive', title: "AI Error", description: e.message }); } 
      finally { setIsGenerating(false); }
  };
  
  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-sm px-3 py-1">Current Arena: {activeGroup}</Badge>
            {canManage && (
                <Select value={adminSelectedGroup} onValueChange={setAdminSelectedGroup}>
                    <SelectTrigger className="w-[200px] h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{TARGET_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
            )}
        </div>
        {canManage && (
            <Card className="bg-slate-50 border-slate-200">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Set New Topic for {activeGroup}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input placeholder="Manual topic..." value={newTopic} onChange={(e) => setNewTopic(e.target.value)} className="bg-white"/>
                        <Button onClick={handleSetTopic} disabled={isSubmitting || !newTopic.trim()} size="sm">Set</Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground uppercase font-bold">OR</span>
                        <Button onClick={handleAiGenerate} disabled={isGenerating} variant="outline" size="sm" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                            {isGenerating ? <Loader2 className="mr-2 h-3 w-3 animate-spin"/> : <Wand2 className="mr-2 h-3 w-3"/>}
                            Generate with AI
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )}
        {isLoading ? (
            <Skeleton className="h-96 w-full" />
        ) : latestTopic ? (
            <DebateArena topic={latestTopic} />
        ) : (
            <Card className="text-center py-10">
                <CardHeader>
                    <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-2"/>
                    <CardTitle>No Active Debate</CardTitle>
                    <CardDescription>There is no debate topic set for {activeGroup} yet.</CardDescription>
                </CardHeader>
            </Card>
        )}
    </div>
  );
}

// --- MAIN PAGE ---
export default function ThinkTankPage() {
  const { role } = useRole();
  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role);

  return (
    <div className="space-y-6 p-6">
      <Card className="border-l-4 border-l-indigo-500 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-indigo-600" />
            The Think Tank
          </CardTitle>
          <CardDescription>
            Sharpen your mind with daily logic puzzles and structured debates.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="paradox" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="paradox">Daily Paradox</TabsTrigger>
            <TabsTrigger value="debate">Debate Arena</TabsTrigger>
            {canManage && <TabsTrigger value="monitor"><Activity className="mr-2 h-4 w-4"/> Activity Log</TabsTrigger>}
        </TabsList>
        <TabsContent value="paradox" className="mt-6">
          <DailyParadoxTab />
        </TabsContent>
        <TabsContent value="debate" className="mt-6">
          <DebateArenaTab />
        </TabsContent>
        {canManage && (
            <TabsContent value="monitor" className="mt-6">
                <TeacherMonitorTab />
            </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
