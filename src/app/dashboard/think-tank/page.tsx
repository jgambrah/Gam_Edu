
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRole } from '@/context/role-context';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase'; // Use useUser
import { collection, query, orderBy, limit, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { startOfDay, isSameDay } from 'date-fns';
import { BrainCircuit, Loader2, PlusCircle, Lightbulb, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
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
import type { Paradox, DebateTopic, Student, Class } from '@/lib/types';
import { generateDailyParadox } from '@/ai/flows/think-tank';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from '@/lib/utils';


const TARGET_GROUPS = [
    'Novice (Basic 1-3)',
    'Apprentice (Basic 4-6)',
    'Scholar (JHS)',
    'Master (SHS)'
];

// Helper to map a student's class name to a group
const getStudentGroup = (classes: Class[], classId: string | undefined) => {
    if (!classId) return 'Scholar (JHS)';
    const studentClass = classes.find(c => c.id === classId);
    const name = studentClass?.name.toLowerCase() || '';

    if (name.includes('bs1') || name.includes('bs2') || name.includes('bs3') || name.includes('class 1') || name.includes('class 2') || name.includes('class 3')) return 'Novice (Basic 1-3)';
    if (name.includes('bs4') || name.includes('bs5') || name.includes('bs6') || name.includes('class 4')) return 'Apprentice (Basic 4-6)';
    if (name.includes('jhs') || name.includes('bs7') || name.includes('bs8') || name.includes('bs9')) return 'Scholar (JHS)';
    if (name.includes('shs') || name.includes('grade 10')) return 'Master (SHS)';
    return 'Scholar (JHS)'; // Default fallback
};


// --- SUB-COMPONENT: Daily Paradox Tab ---
function DailyParadoxTab() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [adminSelectedGroup, setAdminSelectedGroup] = useState(TARGET_GROUPS[2]); // Default to JHS
  const [selectedParadoxId, setSelectedParadoxId] = useState<string | null>(null);

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role);

  // 1. Get Student Info (to know their class)
  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(() => (role === 'Student' && user) ? query(collection(firestore!, 'students'), where('uid', '==', user.uid)) : null, [role, user, firestore])
  );
  
  const { data: classes } = useCollection<Class>(
    useMemoFirebase(() => collection(firestore!, 'classes'), [firestore])
  );

  // 2. Determine Filter Group
  const activeGroup = useMemo(() => {
      if (canManage) return adminSelectedGroup; // Admins see what they select
      if (studentData && studentData[0] && classes) return getStudentGroup(classes, studentData[0].classId); // Students see their level
      return 'Scholar (JHS)'; // Fallback
  }, [canManage, adminSelectedGroup, studentData, classes]);

  // 3. Query based on Group
  const paradoxQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
        collection(firestore, 'think_tank_paradoxes'),
        where('targetGroup', '==', activeGroup), // <--- FILTER BY LEVEL
        orderBy('createdAt', 'desc'),
        limit(20)
    );
  }, [firestore, activeGroup]);

  const { data: paradoxes, isLoading, forceRefetch } = useCollection<Paradox>(paradoxQuery);
  
  // Active Paradox logic
  const activeParadox = useMemo(() => {
      if (!paradoxes || paradoxes.length === 0) return null;
      if (selectedParadoxId) return paradoxes.find(p => p.id === selectedParadoxId) || paradoxes[0];
      return paradoxes[0];
  }, [paradoxes, selectedParadoxId]);


  const handleGenerateParadox = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: "Error", description: "You must be logged in." });
        return;
    }
    setIsGenerating(true);
    try {
        const result = await generateDailyParadox({ targetGroup: adminSelectedGroup });
        
        await addDoc(collection(firestore!, 'think_tank_paradoxes'), {
            ...result,
            createdAt: serverTimestamp(),
            createdBy: user!.uid
        });
        
        toast({ title: "Generated!", description: `New puzzle for ${adminSelectedGroup}.` });
        forceRefetch();
    } catch(e: any) {
        toast({ variant: 'destructive', title: "Error", description: e.message });
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: THE ACTIVE PUZZLE */}
        <div className="lg:col-span-2">
            {/* Show which level we are viewing */}
            <div className="mb-4 flex items-center justify-between">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                    Level: {activeGroup}
                </Badge>
                {/* Admin Selector */}
                {canManage && (
                    <Select value={adminSelectedGroup} onValueChange={setAdminSelectedGroup}>
                        <SelectTrigger className="w-[200px] h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {TARGET_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                    </Select>
                )}
            </div>
            
            {isLoading ? <Skeleton className="h-64 w-full"/> : activeParadox ? (
                <ParadoxCard key={activeParadox.id} paradox={activeParadox} onComplete={() => {}} />
            ) : (
                <Card className="text-center py-10 border-2 border-dashed h-full flex flex-col justify-center items-center">
                    <p className="text-muted-foreground">No puzzles found for {activeGroup}.</p>
                    {canManage && <p className="text-xs text-indigo-500 mt-2">Use the button on the right to generate one.</p>}
                </Card>
            )}
        </div>

        {/* RIGHT: GENERATOR & ARCHIVE */}
        <div className="space-y-4">
            
            {/* Generator (Admin Only) */}
            {canManage && (
                <Card className="bg-indigo-50 border-indigo-200">
                    <CardContent className="p-4">
                        <h3 className="font-bold text-indigo-700 mb-2 flex items-center gap-2">
                            <PlusCircle className="h-4 w-4"/> Create Content
                        </h3>
                        <p className="text-xs text-indigo-600 mb-3">
                            Generate a new puzzle specifically for <strong>{adminSelectedGroup}</strong>.
                        </p>
                        <Button onClick={handleGenerateParadox} disabled={isGenerating} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Generate"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Archive List */}
            <Card className="max-h-[500px] flex flex-col">
                 <CardHeader className="py-3 px-4 bg-slate-50 border-b">
                    <CardTitle className="text-md flex items-center gap-2">
                        <Clock className="h-4 w-4"/> Puzzle Archive
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-0">
                    <ScrollArea className="h-[300px] lg:h-[400px]">
                        <div className="flex flex-col p-2 gap-1">
                            {paradoxes?.map((p) => {
                                const isSelected = p.id === activeParadox?.id;
                                return (
                                    <button 
                                        key={p.id}
                                        onClick={() => setSelectedParadoxId(p.id)}
                                        className={`text-left p-3 rounded-md text-sm transition-colors border flex justify-between items-center group ${
                                            isSelected 
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-medium' 
                                            : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                                        }`}
                                    >
                                        <div className="truncate flex-1 pr-2">
                                            <span className="block truncate">{p.question}</span>
                                            <span className="text-xs opacity-70">
                                                {p.createdAt?.toDate ? formatDate(p.createdAt.toDate()) : "Just now"}
                                            </span>
                                        </div>
                                        {isSelected && <CheckCircle2 className="h-4 w-4 text-indigo-500"/>}
                                        {!isSelected && <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-400"/>}
                                    </button>
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
