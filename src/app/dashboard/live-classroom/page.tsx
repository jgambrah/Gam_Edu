'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, where, doc, updateDoc } from 'firebase/firestore';
import { 
  Video, Mic, MicOff, VideoOff, MessageSquare, Send, 
  Users, Sparkles, Hand, LayoutGrid, MonitorPlay, Bot 
} from 'lucide-react';
import { generateLivePollAction, explainConceptAction } from '@/ai/flows/live-classroom';

// UI
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// --- TYPES ---
type Lecture = {
    id: string;
    title: string;
    teacherName: string;
    teacherId: string;
    status: 'live' | 'ended';
    createdAt: any;
};

type ChatMessage = {
    id: string;
    senderName: string;
    senderId: string;
    text: string;
    isPoll?: boolean; // If it's a teacher's poll
    pollData?: any;
    createdAt: any;
};

// --- SUB-COMPONENT: ACTIVE CLASSROOM ---

function PollMessage({ pollData }: { pollData: any }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-bold mb-2">📊 Live Poll: {pollData.question}</h4>
            <RadioGroup value={selectedOption} onValueChange={setSelectedOption} disabled={isSubmitted}>
                {pollData.options.map((opt: string, i: number) => (
                    <div key={i} className={cn("flex items-center space-x-2 p-2 rounded-md", isSubmitted && opt === pollData.correctOption && "bg-green-100")}>
                        <RadioGroupItem value={opt} id={`poll-opt-${i}`} />
                        <Label htmlFor={`poll-opt-${i}`} className="font-normal">{opt}</Label>
                    </div>
                ))}
            </RadioGroup>
            <Button onClick={() => setIsSubmitted(true)} disabled={!selectedOption || isSubmitted} size="sm" className="mt-4">
                Submit Vote
            </Button>
        </div>
    );
}

function ActiveClassroom({ lecture, onLeave }: { lecture: Lecture, onLeave: () => void }) {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [msgText, setMsgText] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // AI Tools State
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [aiInput, setAiInput] = useState('');
    const [aiResponse, setAiResponse] = useState<any>(null);
    const [isProcessingAi, setIsProcessingAi] = useState(false);

    const isTeacher = role === 'Teacher' || role === 'Administrator';

    // 1. Fetch Chat
    const chatQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'lectures', lecture.id, 'messages'), orderBy('createdAt', 'asc')) : null, 
    [firestore, lecture.id]);
    const { data: messages } = useCollection<ChatMessage>(chatQuery);

    // Auto-scroll chat
    useEffect(() => {
        if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    // Send Message
    const handleSend = async () => {
        if(!msgText.trim()) return;
        await addDoc(collection(firestore!, 'lectures', lecture.id, 'messages'), {
            text: msgText,
            senderName: user?.displayName || user?.email?.split('@')[0],
            senderId: user?.uid,
            createdAt: serverTimestamp()
        });
        setMsgText('');
    };

    // --- TEACHER AI TOOL: Generate Poll ---
    const handleGeneratePoll = async () => {
        if(!aiInput.trim()) return;
        setIsProcessingAi(true);
        try {
            const res = await generateLivePollAction(aiInput);
            if(res.success) {
                // Post Poll to Chat
                await addDoc(collection(firestore!, 'lectures', lecture.id, 'messages'), {
                    text: "Quick Poll: " + res.data.question,
                    senderName: "AI Co-Pilot",
                    senderId: "ai",
                    isPoll: true,
                    pollData: res.data,
                    createdAt: serverTimestamp()
                });
                toast({ title: "Poll Posted", description: "Students can now see the question." });
                setIsAiOpen(false);
                setAiInput('');
            }
        } catch(e) { toast({ variant: 'destructive', title: "Error" }); }
        finally { setIsProcessingAi(false); }
    };

    // --- STUDENT AI TOOL: Explain Concept ---
    const handleExplainConcept = async () => {
        if(!aiInput.trim()) return;
        setIsProcessingAi(true);
        try {
            const res = await explainConceptAction(aiInput);
            if(res.success) {
                setAiResponse(res.data);
            }
        } catch(e) { toast({ variant: 'destructive', title: "Error" }); }
        finally { setIsProcessingAi(false); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-100px)]">
            {/* LEFT: VIDEO STAGE */}
            <div className="lg:col-span-2 flex flex-col gap-4">
                <Card className="flex-1 bg-black relative overflow-hidden flex items-center justify-center">
                    {/* Placeholder Video Feed */}
                    <div className="text-center text-slate-500">
                        <MonitorPlay className="h-16 w-16 mx-auto mb-4 opacity-50"/>
                        <h3 className="text-xl font-semibold text-white">Live Stream Active</h3>
                        <p>Camera and Screen Share would appear here.</p>
                    </div>
                    
                    {/* Controls Overlay */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-slate-900/80 p-2 rounded-full backdrop-blur-sm">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20"><Mic className="h-5 w-5"/></Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20"><Video className="h-5 w-5"/></Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/20" onClick={onLeave}>Leave</Button>
                    </div>
                </Card>
                
                {/* AI TOOL BAR */}
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                        {isTeacher ? <><Sparkles className="text-indigo-600"/> Teacher Co-Pilot</> : <><Bot className="text-emerald-600"/> AI Assistant</>}
                    </h3>
                    <Button size="sm" onClick={() => setIsAiOpen(true)} className={isTeacher ? "bg-indigo-600" : "bg-emerald-600"}>
                        {isTeacher ? "Generate Poll" : "Ask for Help"}
                    </Button>
                </div>
            </div>

            {/* RIGHT: CHAT */}
            <Card className="flex flex-col h-full">
                <CardHeader className="py-3 px-4 border-b">
                    <CardTitle className="text-md flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Class Chat</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden relative">
                    <div className="absolute inset-0 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                        {messages?.map(msg => (
                            <div key={msg.id} className={`flex flex-col ${msg.senderId === user?.uid ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.isPoll ? 'bg-indigo-50 border-indigo-200 w-full' : msg.senderId === user?.uid ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                                    <p className="text-xs opacity-70 mb-1 font-bold">{msg.senderName}</p>
                                    
                                    {msg.isPoll ? (
                                        <PollMessage pollData={msg.pollData} />
                                    ) : (
                                        <p>{msg.text}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <div className="p-3 border-t bg-slate-50 flex gap-2">
                    <Input value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Type a message..." onKeyDown={e => e.key === 'Enter' && handleSend()}/>
                    <Button size="icon" onClick={handleSend}><Send className="h-4 w-4"/></Button>
                </div>
            </Card>

            {/* AI MODAL */}
            <Dialog open={isAiOpen} onOpenChange={(v) => { setIsAiOpen(v); setAiResponse(null); setAiInput(''); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isTeacher ? "Classroom Co-Pilot" : "Personal Tutor"}</DialogTitle>
                    </DialogHeader>
                    
                    {!aiResponse ? (
                        <div className="space-y-4">
                            <Label>{isTeacher ? "What topic are you teaching right now?" : "What concept is confusing you?"}</Label>
                            <Input value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder={isTeacher ? "e.g. Gravity" : "e.g. What does 'inertia' mean?"} />
                            <Button className="w-full" onClick={isTeacher ? handleGeneratePoll : handleExplainConcept} disabled={isProcessingAi}>
                                {isProcessingAi ? <Loader2 className="animate-spin"/> : (isTeacher ? "Generate Quiz" : "Explain to Me")}
                            </Button>
                        </div>
                    ) : (
                        // STUDENT EXPLANATION VIEW
                        <div className="space-y-4">
                            <div className="bg-emerald-50 p-4 rounded-md border border-emerald-100">
                                <h4 className="font-bold text-emerald-800 text-sm uppercase mb-2">Definition</h4>
                                <p className="text-slate-800">{aiResponse.definition}</p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-md border border-amber-100">
                                <h4 className="font-bold text-amber-800 text-sm uppercase mb-2">Analogy</h4>
                                <p className="text-slate-800 italic">"{aiResponse.analogy}"</p>
                            </div>
                            <Button variant="outline" onClick={() => setAiResponse(null)} className="w-full">Ask Another</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

// --- MAIN PAGE: LOBBY ---
export default function LiveClassroomPage() {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [activeLectureId, setActiveLectureId] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');

    const isTeacher = ['Teacher', 'Administrator', 'Director'].includes(role);

    // Fetch Live Lectures
    const lecturesQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'lectures'), where('status', '==', 'live'), orderBy('createdAt', 'desc')) : null
    , [firestore]);
    const { data: lectures, isLoading } = useCollection<Lecture>(lecturesQuery);

    const handleStartLecture = async () => {
        if(!newTitle.trim() || !user) return;
        const docRef = await addDoc(collection(firestore!, 'lectures'), {
            title: newTitle,
            teacherName: user.displayName || user.email?.split('@')[0],
            teacherId: user.uid,
            status: 'live',
            createdAt: serverTimestamp()
        });
        setActiveLectureId(docRef.id);
    };

    const handleEndLecture = async () => {
        if(activeLectureId) {
            await updateDoc(doc(firestore!, 'lectures', activeLectureId), { status: 'ended' });
            setActiveLectureId(null);
        }
    };

    // If joined, show classroom
    if (activeLectureId && lectures) {
        const currentLecture = lectures.find(l => l.id === activeLectureId);
        if(currentLecture) return <ActiveClassroom lecture={currentLecture} onLeave={isTeacher ? handleEndLecture : () => setActiveLectureId(null)} />;
    }

    return (
        <div className="space-y-6 p-6">
            <Card className="bg-slate-900 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Video className="text-red-500"/> Live Classroom</CardTitle>
                    <p className="text-slate-400">Join virtual sessions or start your own.</p>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LECTURE LIST */}
                <Card>
                    <CardHeader><CardTitle>Active Sessions</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {isLoading && <Loader2 className="animate-spin"/>}
                        {lectures?.length === 0 && <p className="text-muted-foreground text-center py-8">No live classes right now.</p>}
                        {lectures?.map(l => (
                            <div key={l.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                                <div>
                                    <h4 className="font-bold text-slate-800">{l.title}</h4>
                                    <p className="text-sm text-slate-500">Host: {l.teacherName}</p>
                                </div>
                                <Button onClick={() => setActiveLectureId(l.id)} className="bg-red-600 hover:bg-red-700">Join Live</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* TEACHER CONTROLS */}
                {isTeacher && (
                    <Card>
                        <CardHeader><CardTitle>Start a Class</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Topic / Title</Label>
                                <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Biology 101: Cells"/>
                            </div>
                            <Button onClick={handleStartLecture} disabled={!newTitle} className="w-full">
                                <Video className="mr-2 h-4 w-4"/> Go Live
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
