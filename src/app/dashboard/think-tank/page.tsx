
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRole } from '@/context/role-context';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, addDoc, serverTimestamp, getDocs, where } from 'firebase/firestore';
import { startOfDay, endOfDay } from 'date-fns';
import { BrainCircuit, Loader2, PlusCircle, Lightbulb } from 'lucide-react';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Custom Components
import { ParadoxCard, DebateArena } from '@/components/academics/think-tank-components';

// Types and AI Functions
import type { Paradox, DebateTopic, DebateMessage } from '@/lib/types';
import { generateDailyParadox } from '@/ai/flows/think-tank';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

// --- SUB-COMPONENT: Daily Paradox Tab ---
function DailyParadoxTab() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);

  const canManage = role === 'Teacher' || role === 'Administrator' || role === 'Director';

  const paradoxQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    return query(
        collection(firestore, 'think_tank_paradoxes'),
        where('createdAt', '>=', todayStart),
        where('createdAt', '<=', todayEnd),
        orderBy('createdAt', 'desc'),
        limit(1)
    );
  }, [firestore]);

  const { data: paradoxes, isLoading, forceRefetch } = useCollection<Paradox>(paradoxQuery);
  
  const paradox = useMemo(() => paradoxes?.[0], [paradoxes]);


  const handleGenerateParadox = async () => {
    if (!user || !firestore) return;
    setIsGenerating(true);
    toast({ title: "Thinking...", description: "Generating a new paradox for today." });
    
    try {
        const result = await generateDailyParadox({ grade: 'Grade 9' });
        const newParadoxData = {
            ...result,
            createdAt: serverTimestamp(),
        };
        await addDoc(collection(firestore, 'think_tank_paradoxes'), newParadoxData);
        
        toast({ title: "Success!", description: "Today's paradox has been created." });
        forceRefetch();

    } catch(e) {
        console.error(e);
        toast({ variant: 'destructive', title: "AI Error", description: "Could not generate paradox." });
    } finally {
        setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <div>
      {paradox ? (
        <ParadoxCard paradox={paradox} onComplete={() => forceRefetch()} />
      ) : (
        <Card className="text-center py-10">
          <CardHeader>
            <Lightbulb className="mx-auto h-12 w-12 text-yellow-400" />
            <CardTitle>No Paradox for Today</CardTitle>
            <CardDescription>A new logic puzzle has not been generated yet.</CardDescription>
          </CardHeader>
          <CardContent>
            {canManage && (
              <Button onClick={handleGenerateParadox} disabled={isGenerating}>
                {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Generate Daily Paradox
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// --- SUB-COMPONENT: Debate Arena Tab ---
function DebateArenaTab() {
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [newTopic, setNewTopic] = useState('');
  const [newContext, setNewContext] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canManage = role === 'Teacher' || role === 'Administrator' || role === 'Director';

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
          forceRefetch(); // Force a refetch to show the new topic
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            The Think Tank
          </CardTitle>
          <CardDescription>
            Sharpen your mind with daily logic puzzles and structured debates.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="paradox" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="paradox">Daily Paradox</TabsTrigger>
          <TabsTrigger value="debate">Debate Arena</TabsTrigger>
        </TabsList>
        <TabsContent value="paradox">
          <DailyParadoxTab />
        </TabsContent>
        <TabsContent value="debate">
          <DebateArenaTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
