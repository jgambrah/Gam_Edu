
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/role-context';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase'; // Use useUser
import { collection, query, orderBy, limit, addDoc, serverTimestamp, where, deleteDoc, doc } from 'firebase/firestore';
import { startOfDay, isSameDay } from 'date-fns';
import { BrainCircuit, Loader2, PlusCircle, Lightbulb, Clock, CheckCircle2, ChevronRight, Trash2 } from 'lucide-react';
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


// Custom Components
import { ParadoxCard, DebateArena } from '@/components/academics/think-tank-components';

// Types and AI Functions
import type { Paradox, DebateTopic, Student } from '@/lib/types';
import { generateDailyParadox, runDebateTurn } from '@/ai/flows/think-tank';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from '@/lib/utils';


const TARGET_GROUPS = [
    'Novice (Basic 1-3)',
    'Apprentice (Basic 4-6)',
    'Scholar (JHS)',
    'Master (SHS)'
];

// Helper to map a student's class name to a group
const getStudentGroup = (className: string = '') => {
    const name = className.toLowerCase();
    if (name.includes('bs1') || name.includes('bs2') || name.includes('bs3') || name.includes('class 1') || name.includes('class 2') || name.includes('class 3')) return 'Novice (Basic 1-3)';
    if (name.includes('bs4') || name.includes('bs5') || name.includes('bs6') || name.includes('class 4')) return 'Apprentice (Basic 4-6)';
    if (name.includes('jhs') || name.includes('bs7') || name.includes('bs8') || name.includes('bs9')) return 'Scholar (JHS)';
    if (name.includes('shs') || name.includes('grade 10')) return 'Master (SHS)';
    return 'Scholar (JHS)'; // Default fallback
};


// --- SUB-COMPONENT: Daily Paradox Tab (Updated with List Delete) ---
function DailyParadoxTab() {
  const { user, isUserLoading } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [adminSelectedGroup, setAdminSelectedGroup] = useState(TARGET_GROUPS[2]); // Default JHS
  const [selectedParadoxId, setSelectedParadoxId] = useState<string | null>(null);

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role);

  // 1. Get Student Info (to know their class)
  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(() => (role === 'Student' && user) ? query(collection(firestore!, 'students'), where('uid', '==', user.uid)) : null, [role, user, firestore])
  );

  // 2. Query: Fetch ALL recent puzzles
  const paradoxQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
        collection(firestore, 'think_tank_paradoxes'),
        limit(50) 
    );
  }, [firestore]);

  const { data: allParadoxes, isLoading, forceRefetch } = useCollection<Paradox>(paradoxQuery);
  
  // 3. Determine Group
  const activeGroup = useMemo(() => {
      if (canManage) return adminSelectedGroup; 
      if (studentData && studentData[0]) return getStudentGroup(studentData[0].classId); 
      return 'Scholar (JHS)';
  }, [canManage, adminSelectedGroup, studentData]);

  // 4. Filter Client-Side
  const groupParadoxes = useMemo(() => {
      if (!allParadoxes) return [];
      const sorted = allParadoxes.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      return sorted.filter(p => p.targetGroup === activeGroup);
  }, [allParadoxes, activeGroup]);
  
  // 5. Active Puzzle
  const activeParadox = useMemo(() => {
      if (!groupParadoxes || groupParadoxes.length === 0) return null;
      if (selectedParadoxId) {
          return groupParadoxes.find(p => p.id === selectedParadoxId) || groupParadoxes[0];
      }
      return groupParadoxes[0];
  }, [groupParadoxes, selectedParadoxId]);

  // 6. Check Today
  const hasPuzzleForToday = useMemo(() => {
      if (!groupParadoxes || groupParadoxes.length === 0) return false;
      const newest = groupParadoxes[0];
      if (!newest.createdAt) return false; 
      const puzzleDate = newest.createdAt.toDate ? newest.createdAt.toDate() : new Date(newest.createdAt.seconds * 1000);
      return isSameDay(puzzleDate, new Date());
  }, [groupParadoxes]);

  // --- DELETE HANDLER ---
  const handleDeleteParadox = async (id: string, e?: React.MouseEvent) => {
      // Prevent clicking the row when clicking delete
      if (e) e.stopPropagation();

      console.log("Attempting to delete:", id);
      
      if (!firestore) {
          toast({ variant: 'destructive', title: "Error", description: "Database connection not ready." });
          return;
      }

      if (!confirm("Are you sure you want to delete this puzzle?")) return;
      
      try {
          await deleteDoc(doc(firestore, 'think_tank_paradoxes', id));
          toast({ title: "Deleted", description: "Puzzle removed." });
          
          // If we deleted the active one, reset selection
          if (selectedParadoxId === id) setSelectedParadoxId(null);
          
          forceRefetch();
      } catch (e: any) {
          console.error("Delete failed:", e);
          toast({ variant: 'destructive', title: "Error", description: "Could not delete. Check console permissions." });
      }
  };

  const handleGenerateParadox = async () => {
    // ... (Your existing generate logic here) ...
    // COPY THE SAME LOGIC FROM THE PREVIOUS STEP
    const auth = getAuth();
    const currentUser = auth.currentUser || user;

    if (!currentUser) return;
    
    setIsGenerating(true);
    toast({ title: "Thinking...", description: `Generating logic for ${activeGroup}...` });
    
    try {
        const result = await generateDailyParadox({ targetGroup: activeGroup });
        if (!result) throw new Error("AI returned no data");

        const docRef = await addDoc(collection(firestore!, 'think_tank_paradoxes'), {
            ...result,
            createdAt: serverTimestamp(),
            createdBy: currentUser.uid
        });
        
        toast({ title: "Success!", description: "New paradox created." });
        setSelectedParadoxId(docRef.id);
        forceRefetch();

    } catch(e: any) {
        console.error(e);
        toast({ variant: 'destructive', title: "AI Error", description: e.message });
    } finally {
        setIsGenerating(false);
    }
  };

  if (isLoading || isUserLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: THE ACTIVE PUZZLE */}
        <div className="lg:col-span-2">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <Badge variant="secondary" className="text-sm px-3 py-1 w-fit">Level: {activeGroup}</Badge>
                {canManage && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">View/Generate for:</span>
                        <Select value={adminSelectedGroup} onValueChange={(val) => { setAdminSelectedGroup(val); setSelectedParadoxId(null); }}>
                            <SelectTrigger className="w-[180px] h-8 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>{TARGET_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {activeParadox ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                         <Badge variant="outline" className="mb-2">
                            {activeParadox.createdAt?.toDate ? formatDate(activeParadox.createdAt.toDate()) : "New"}
                         </Badge>
                    </div>
                    
                    <ParadoxCard 
                        key={activeParadox.id} 
                        paradox={activeParadox} 
                        onComplete={() => {}}
                        isStaff={canManage}
                        onDelete={() => handleDeleteParadox(activeParadox.id)}
                    />
                </div>
            ) : (
                <Card className="text-center py-10 border-2 border-dashed h-full flex flex-col justify-center items-center">
                    <Lightbulb className="h-12 w-12 text-slate-300 mb-2" />
                    <CardTitle>No Puzzles for {activeGroup}</CardTitle>
                    <CardDescription>The archives are empty for this level.</CardDescription>
                </Card>
            )}
        </div>

        {/* RIGHT: PUZZLE LIST / GENERATOR */}
        <div className="space-y-4">
            
            {/* Generate Button */}
            {canManage && !hasPuzzleForToday && (
                <Card className="bg-indigo-50 border-indigo-200 shadow-sm">
                    <CardContent className="p-4">
                        <h3 className="font-bold text-indigo-700 mb-2 flex items-center gap-2"><PlusCircle className="h-4 w-4"/> Daily Task</h3>
                        <p className="text-xs text-indigo-600 mb-3">Generate today's puzzle for <strong>{activeGroup}</strong>.</p>
                        <Button onClick={handleGenerateParadox} disabled={isGenerating} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Generate Now"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Archive List */}
            <Card className="max-h-[500px] flex flex-col">
                <CardHeader className="py-3 px-4 bg-slate-50 border-b">
                    <CardTitle className="text-md flex items-center gap-2"><Clock className="h-4 w-4"/> {activeGroup} Archive</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-0">
                    <ScrollArea className="h-[300px] lg:h-[400px]">
                        <div className="flex flex-col p-2 gap-1">
                            {groupParadoxes.length === 0 && <p className="text-xs text-center text-muted-foreground p-4">No history.</p>}
                            {groupParadoxes.map((p) => {
                                const isSelected = p.id === activeParadox?.id;
                                return (
                                    <div 
                                        key={p.id}
                                        onClick={() => setSelectedParadoxId(p.id)}
                                        className={`p-3 rounded-md text-sm transition-colors border flex justify-between items-center group cursor-pointer ${isSelected ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
                                    >
                                        <div className="truncate flex-1 pr-2">
                                            <span className="block truncate">{p.question}</span>
                                            <span className="text-xs opacity-70">{p.createdAt?.toDate ? formatDate(p.createdAt.toDate()) : "Just now"}</span>
                                        </div>
                                        
                                        {/* DIRECT DELETE BUTTON IN LIST */}
                                        {canManage && (
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6 text-red-400 hover:text-red-600 hover:bg-red-50 z-10"
                                                onClick={(e) => handleDeleteParadox(p.id, e)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        )}
                                        
                                        {!canManage && isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-500"/>}
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
// Helper for dates
function formatDate(date: Date) {
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

// Helper for colors
function getDifficultyColor(diff: string) {
    if(diff === 'Easy') return 'bg-green-100 text-green-700 hover:bg-green-100';
    if(diff === 'Medium') return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
    return 'bg-red-100 text-red-700 hover:bg-red-100';
}

// --- SUB-COMPONENT: Debate Arena Tab (Unchanged but included for completeness) ---
function DebateArenaTab() {
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [newTopic, setNewTopic] = useState('');
  const [newContext, setNewContext] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role);

  const topicsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'think_tank_debates'), orderBy('createdAt', 'desc'), limit(1)) : null,
    [firestore]
  );
  const { data: topics, isLoading, forceRefetch } = useCollection<DebateTopic>(topicsQuery);
  const latestTopic = topics?.[0];

  const handleSetTopic = async () => {
      if (!newTopic.trim()) {
          toast({ variant: 'destructive', title: 'Topic required' });
          return;
      }
      setIsSubmitting(true);
      try {
          await addDocumentNonBlocking(collection(firestore, 'think_tank_debates'), {
              topic: newTopic,
              context: newContext,
              createdAt: serverTimestamp(),
          });
          toast({ title: 'New Debate Topic Set!' });
          setNewTopic('');
          setNewContext('');
          forceRefetch();
      } catch (e) {
          console.error(e);
          toast({ variant: 'destructive', title: 'Error setting topic' });
      } finally {
          setIsSubmitting(false);
      }
  };
  
  return (
    <div className="space-y-6">
        {canManage && (
            <Card>
                <CardHeader>
                    <CardTitle>Set New Debate Topic</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input 
                        placeholder="New topic (e.g., 'Should school uniforms be mandatory?')" 
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                    />
                    <Textarea 
                        placeholder="Provide brief context for the debate (optional)"
                        value={newContext}
                        onChange={(e) => setNewContext(e.target.value)}
                    />
                    <Button onClick={handleSetTopic} disabled={isSubmitting || !newTopic.trim()}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Set Topic
                    </Button>
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
                    <CardTitle>No Active Debate</CardTitle>
                    <CardDescription>A teacher or administrator needs to set a topic to begin.</CardDescription>
                </CardHeader>
            </Card>
        )}
    </div>
  );
}


// --- MAIN PAGE ---
export default function ThinkTankPage() {
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
        </TabsList>
        <TabsContent value="paradox" className="mt-6">
          <DailyParadoxTab />
        </TabsContent>
        <TabsContent value="debate" className="mt-6">
          <DebateArenaTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
