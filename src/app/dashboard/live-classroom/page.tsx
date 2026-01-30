
'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { 
  Clapperboard, Mic, MicOff, Video, VideoOff, PhoneOff, Users, 
  Send, Maximize, Minimize, Hand, Pen, Eraser, Move, Palette, Circle, Square, MousePointer2, Settings, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Class } from '@/lib/types';
import { generateLivePollAction, explainConceptAction } from '@/ai/flows/live-classroom';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { checkAndSpendCredits } from '@/app/actions/credits';

// --- MAIN PAGE ---
export default function LiveClassroomPage() {
  const { user } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  
  const canHost = role === 'Teacher' || role === 'Administrator' || role === 'Director';
  
  // Use a query that fetches classes the teacher is assigned to, or all if admin
  const classesQuery = useMemoFirebase(() => {
    if (!firestore || !user || !schoolId) return null;
    if (canHost) {
        if (role === 'Teacher') {
            return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid), where('schoolId', '==', schoolId));
        }
        return query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
    }
    return null; 
  }, [firestore, user, role, canHost, schoolId]);

  const { data: classes } = useCollection<Class>(classesQuery);

  const handleStartSession = (classId: string) => {
    if (!firestore) return;
    const classRef = doc(firestore, 'active_classes', classId);
    setDoc(classRef, { status: 'live', teacherId: user?.uid, startedAt: serverTimestamp() }, { merge: true })
      .then(() => setActiveClassId(classId))
      .catch(e => toast({ variant: 'destructive', title: 'Error', description: 'Could not start session.'}));
  };
  
  const handleEndSession = (classId: string) => {
    if (!firestore) return;
    updateDoc(doc(firestore, 'active_classes', classId), { status: 'ended' })
      .then(() => setActiveClassId(null))
      .catch(e => toast({ variant: 'destructive', title: 'Error' }));
  };

  if (activeClassId) {
    return <ClassroomInterface classId={activeClassId} onEndSession={() => handleEndSession(activeClassId)} />;
  }

  return (
    <div className="p-6">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Live Classroom</CardTitle>
          <CardDescription>Start a real-time session for one of your classes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setActiveClassId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a class to start..." />
            </SelectTrigger>
            <SelectContent>
              {classes?.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => activeClassId && handleStartSession(activeClassId)} disabled={!activeClassId} className="w-full">
            Start Live Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


// --- CLASSROOM UI ---
function ClassroomInterface({ classId, onEndSession }: { classId: string, onEndSession: () => void }) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  return (
    <div className={cn("bg-slate-900", isFullScreen ? "fixed inset-0 z-50" : "relative rounded-xl overflow-hidden shadow-2xl border-4 border-slate-700")}>
      <div className="grid grid-cols-4 gap-4 p-4 h-[calc(100vh-100px)]">
        
        {/* Main Video */}
        <div className="col-span-3 bg-black rounded-lg relative overflow-hidden">
            <video className="w-full h-full object-cover" autoPlay muted loop playsInline poster="https://placehold.co/1280x720/000000/FFF?text=Teacher's+Feed" />
            <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded">Teacher Cam</div>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 flex flex-col gap-4">
            <div className="bg-black/30 rounded-lg flex-1 p-2">
                 <div className="grid grid-cols-2 gap-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="bg-slate-700 rounded aspect-video relative">
                             <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded">Student {i}</div>
                        </div>
                    ))}
                 </div>
            </div>
            <div className="bg-black/30 rounded-lg h-1/3">
              {/* Chat goes here */}
            </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center">
        <span className="text-white font-bold text-sm">Classroom: {classId}</span>
        <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-full border border-slate-700 shadow-lg">
            <Button variant="ghost" size="icon" className="rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => setIsMicOn(!isMicOn)}>{isMicOn ? <Mic/> : <MicOff/>}</Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => setIsCamOn(!isCamOn)}>{isCamOn ? <Video/> : <VideoOff/>}</Button>
            <Button variant="destructive" size="icon" className="rounded-full" onClick={onEndSession}><PhoneOff/></Button>
        </div>
        <div>
             <Button variant="ghost" size="icon" className="rounded-full text-white" onClick={() => setIsFullScreen(!isFullScreen)}>
                {isFullScreen ? <Minimize/> : <Maximize/>}
            </Button>
        </div>
      </div>
    </div>
  );
}
