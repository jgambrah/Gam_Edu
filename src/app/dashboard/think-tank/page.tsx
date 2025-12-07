
'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase'; 
import { collection, query, orderBy, limit, addDoc, serverTimestamp, deleteDoc, doc, where } from 'firebase/firestore';
import { startOfDay, isSameDay } from 'date-fns';
import { BrainCircuit, Loader2, PlusCircle, Lightbulb, Clock, CheckCircle2, ChevronRight, Activity, Users, Trash2 } from 'lucide-react';
import { getAuth } from 'firebase/auth';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Custom Components
import { ParadoxCard, DebateArena } from '@/components/academics/think-tank-components';

// Types & AI
import type { Paradox, DebateTopic, Student } from '@/lib/types';
import { generateDailyParadox, generateDebateTopic } from '@/ai/flows/think-tank';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { formatDate } from 'date-fns';

const TARGET_GROUPS = [
    'Novice (Basic 1-3)',
    'Apprentice (Basic 4-6)',
    'Scholar (JHS)',
    'Master (SHS)'
];

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

// --- COMPONENT: Daily Paradox Tab ---
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

  // SAVE ATTEMPT
  const handleAttempt = async (answer: string) => {
      if (!user || canManage) return; // Teachers don't save progress
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
    } catch(e: any) { toast({ variant: 'destructive', title: "AI Error" }); } 
    finally { setIsGenerating(false); }
  };

  if (isLoading || isUserLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <Badge variant="secondary">Level: {activeGroup}</Badge>
                {canManage && (
                    <Select value={adminSelectedGroup} onValueChange={(val) => { setAdminSelectedGroup(val); setSelectedParadoxId(null); }}>
                        <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>{TARGET_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                )}
            </div>
            {activeParadox ? (
                <ParadoxCard 
                    key={activeParadox.id} 
                    paradox={activeParadox} 
                    onComplete={() => {}} 
                    onAttempt={handleAttempt} // <--- Sends data to DB
                    onDelete={() => handleDeleteParadox(activeParadox.id)} 
                    isStaff={canManage}
                />
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
                                <div key={p.id} onClick={() => setSelectedParadoxId(p.id)} className={`p-3 rounded-md text-sm border flex justify-between items-center cursor-pointer ${p.id === activeParadox?.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white'}`}>
                                    <span className="truncate flex-1">{p.question}</span>
                                    {canManage && <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400" onClick={(e) => handleDeleteParadox(p.id, e)}><Trash2 className="h-3 w-3"/></Button>}
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

// --- SUB-COMPONENT: Debate Arena Tab (Unchanged) ---
// Note: You can add the same tracking logic here later
function DebateArenaTab() {
    return <Card className="p-10 text-center"><p>Debate Arena Active</p></Card> 
    // (Placeholder to keep file short, use your existing DebateArenaTab code here)
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
            {/* Show Teacher Monitor if staff */}
            {canManage && <TabsTrigger value="monitor"><Activity className="mr-2 h-4 w-4"/> Activity Log</TabsTrigger>}
        </TabsList>
        <TabsContent value="paradox" className="mt-6">
          <DailyParadoxTab />
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
