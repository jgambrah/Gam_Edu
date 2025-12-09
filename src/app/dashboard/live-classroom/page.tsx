
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, where, doc, updateDoc, onSnapshot, limit } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getApp } from 'firebase/app';
import { 
  Video, Mic, MicOff, VideoOff, MessageSquare, Send, 
  Sparkles, MonitorPlay, Bot, Calendar as CalendarIcon, 
  Clock, ChevronLeft, ChevronRight, Presentation, ScreenShare, 
  LayoutGrid, Maximize, Circle, Square, Save, Users, Mic2, Hand, Smile, X, MoreHorizontal, PhoneOff
} from 'lucide-react';
import { generateLivePollAction, explainConceptAction } from '@/ai/flows/live-classroom';
import { format } from 'date-fns';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- TYPES ---
type Lecture = {
    id: string;
    title: string;
    description?: string;
    targetGroup?: string; 
    scheduledFor?: any; 
    teacherName: string;
    teacherId: string;
    status: 'scheduled' | 'live' | 'ended';
    createdAt: any;
    slides?: string[]; 
    currentSlide?: number; 
    isPresentationMode?: boolean; 
};

type ChatMessage = {
    id: string;
    senderName: string;
    senderId: string;
    text: string;
    isPoll?: boolean;
    pollData?: any;
    createdAt: any;
};

type Reaction = {
    id: string;
    emoji: string;
    senderId: string;
    createdAt: any;
};

// --- SUB-COMPONENT: Audio Visualizer ---
const MicVisualizer = ({ stream }: { stream: MediaStream | null }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        if (!stream || !canvasRef.current) return;
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 64;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext("2d");

        const draw = () => {
            if(!canvasCtx) return;
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                canvasCtx.fillStyle = `rgb(74, 222, 128)`; // Green-400
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 2;
            }
        };
        draw();
        return () => {
            if(animationRef.current) cancelAnimationFrame(animationRef.current);
            if(audioContext.state !== 'closed') audioContext.close();
        };
    }, [stream]);

    return <canvas ref={canvasRef} width="40" height="20" />;
};

// --- COMPONENT: Schedule Class Dialog ---
function ScheduleClassDialog({ open, setOpen }: { open: boolean, setOpen: (v: boolean) => void }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetGroup, setTargetGroup] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');

    const handleSchedule = async () => {
        if (!user || !title || !scheduledDate || !scheduledTime) {
            toast({ variant: 'destructive', title: "Missing Fields", description: "Please fill in all required fields." });
            return;
        }
        setIsSubmitting(true);
        try {
            const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
            await addDoc(collection(firestore!, 'lectures'), {
                title, description, targetGroup: targetGroup || 'General',
                scheduledFor: scheduledDateTime, teacherName: user.displayName || user.email?.split('@')[0],
                teacherId: user.uid, status: 'scheduled', createdAt: serverTimestamp(),
                slides: [], currentSlide: 0, isPresentationMode: false
            });
            toast({ title: "Class Scheduled" });
            setOpen(false); setTitle(''); setDescription(''); setTargetGroup('');
        } catch (e: any) { toast({ variant: 'destructive', title: "Error", description: e.message }); } 
        finally { setIsSubmitting(false); }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader><DialogTitle>Schedule a Class</DialogTitle><DialogDescription>Set up a future live session.</DialogDescription></DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2"><Label>Topic *</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
                    <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Target Audience</Label><Input value={targetGroup} onChange={e => setTargetGroup(e.target.value)} /></div>
                        <div className="space-y-2"><Label>Date *</Label><Input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} /></div>
                    </div>
                    <div className="space-y-2"><Label>Time *</Label><Input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} /></div>
                </div>
                <DialogFooter><Button onClick={handleSchedule} disabled={isSubmitting} className="w-full">{isSubmitting ? <Loader2 className="mr-2 animate-spin"/> : "Schedule"}</Button></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- COMPONENT: ACTIVE CLASSROOM (THE ZOOM ROOM) ---
function ActiveClassroom({ lecture, onLeave }: { lecture: Lecture, onLeave: () => void }) {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [msgText, setMsgText] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // AI & Tools
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [aiInput, setAiInput] = useState('');
    const [aiResponse, setAiResponse] = useState<any>(null);
    const [isProcessingAi, setIsProcessingAi] = useState(false);

    // Media State
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    
    // UI State
    const [showParticipants, setShowParticipants] = useState(false);
    const [showChat, setShowChat] = useState(true);
    const [activeReactions, setActiveReactions] = useState<{id: string, emoji: string, left: number}[]>([]);

    // Recording
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [isSavingRecord, setIsSavingRecord] = useState(false);

    const isTeacher = role === 'Teacher' || role === 'Administrator' || role === 'Director';
    const isPresenter = user?.uid === lecture.teacherId; 

    // --- 1. INITIALIZE MEDIA ---
    useEffect(() => {
        let localStream: MediaStream | null = null;
        const startStream = async () => {
            if (isPresenter) {
                try {
                    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    setStream(localStream);
                    setIsCameraOn(true);
                    setIsMicOn(true);
                    if (videoRef.current) videoRef.current.srcObject = localStream;
                } catch (err) { console.error("Media Error:", err); }
            }
        };
        startStream();
        return () => { if (localStream) localStream.getTracks().forEach(track => track.stop()); };
    }, [isPresenter]);

    // --- 2. DATA STREAMS ---
    
    // Chat
    const chatQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'lectures', lecture.id, 'messages'), orderBy('createdAt', 'asc')) : null, 
    [firestore, lecture.id]);
    const { data: messages } = useCollection<ChatMessage>(chatQuery);

    // Reactions Listener (Real-time)
    useEffect(() => {
        if (!firestore) return;
        const q = query(collection(firestore, 'lectures', lecture.id, 'reactions'), orderBy('createdAt', 'desc'), limit(1));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = change.doc.data();
                    // Add visual reaction
                    const id = Math.random().toString();
                    const left = Math.floor(Math.random() * 80) + 10; // Random position 10-90%
                    setActiveReactions(prev => [...prev, { id, emoji: data.emoji, left }]);
                    // Remove after animation
                    setTimeout(() => {
                        setActiveReactions(prev => prev.filter(r => r.id !== id));
                    }, 3000);
                }
            });
        });
        return () => unsubscribe();
    }, [firestore, lecture.id]);

    // Auto-scroll chat
    useEffect(() => {
        if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    // Derived Participants (Mocked from Chat + Teacher)
    const participants = useMemo(() => {
        const unique = new Set<string>();
        unique.add(lecture.teacherName);
        if (user?.displayName) unique.add(user.displayName);
        messages?.forEach(m => unique.add(m.senderName));
        return Array.from(unique);
    }, [messages, lecture.teacherName, user]);


    // --- HANDLERS ---

    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            // Stop Sharing
            const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
            tracks?.forEach(t => t.stop());
            setIsScreenSharing(false);
            // Revert to Camera
            if (stream && videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } else {
            // Start Sharing
            try {
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = displayStream;
                }
                setIsScreenSharing(true);
                // Handle user clicking "Stop Sharing" in browser UI
                displayStream.getVideoTracks()[0].onended = () => {
                    setIsScreenSharing(false);
                    if (stream && videoRef.current) videoRef.current.srcObject = stream;
                };
            } catch (err) {
                console.error("Screen Share cancelled");
            }
        }
    };

    const sendReaction = async (emoji: string) => {
        if (!firestore) return;
        // Optimistic UI
        const id = Math.random().toString();
        setActiveReactions(prev => [...prev, { id, emoji, left: 50 }]);
        setTimeout(() => setActiveReactions(prev => prev.filter(r => r.id !== id)), 3000);

        // Send to DB
        await addDoc(collection(firestore, 'lectures', lecture.id, 'reactions'), {
            emoji, senderId: user?.uid, createdAt: serverTimestamp()
        });
    };

    const handleSend = async () => {
        if(!msgText.trim()) return;
        await addDoc(collection(firestore!, 'lectures', lecture.id, 'messages'), {
            text: msgText,
            senderName: user?.displayName || user?.email?.split('@')[0] || 'Guest',
            senderId: user?.uid,
            createdAt: serverTimestamp()
        });
        setMsgText('');
    };

    const toggleCamera = () => {
        if (stream) {
            const track = stream.getVideoTracks()[0];
            if(track) { track.enabled = !track.enabled; setIsCameraOn(track.enabled); }
        }
    };
    const toggleMic = () => {
        if (stream) {
            const track = stream.getAudioTracks()[0];
            if(track) { track.enabled = !track.enabled; setIsMicOn(track.enabled); }
        }
    };

    // Recording Logic (Same as before)
    const startRecording = () => {
        if (!stream) return;
        chunksRef.current = [];
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        recorder.onstop = () => { setRecordedBlob(new Blob(chunksRef.current, { type: 'video/webm' })); };
        recorder.start();
        setIsRecording(true);
        mediaRecorderRef.current = recorder;
        toast({ title: "Recording Started" });
    };
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.stop(); setIsRecording(false); }
    };
    const saveRecording = async () => {
        if (!recordedBlob || !firestore || !user) return;
        setIsSavingRecord(true);
        try {
            const app = getApp();
            const storage = getStorage(app, "gs://studio-525105839-159e4.firebasestorage.app");
            const storageRef = ref(storage, `recordings/${lecture.id}_${Date.now()}.webm`);
            await uploadBytes(storageRef, recordedBlob);
            const downloadUrl = await getDownloadURL(storageRef);
            await addDoc(collection(firestore, 'learning_materials'), {
                topicTitle: `Recording: ${lecture.title}`, description: `Live session recording`, classId: 'global', subject: 'Live Recordings',
                uploadedBy: user.uid, createdAt: serverTimestamp(), type: 'Video',
                resources: [{ id: Date.now().toString(), title: 'Watch Session', type: 'Video', url: downloadUrl }]
            });
            toast({ title: "Saved to Library!" }); setRecordedBlob(null);
        } catch (e: any) { toast({ variant: 'destructive', title: "Error", description: e.message }); }
        finally { setIsSavingRecord(false); }
    };

    // AI Handlers
    const handleGeneratePoll = async () => {
        if(!aiInput.trim()) return;
        setIsProcessingAi(true);
        try {
            const res = await generateLivePollAction(aiInput);
            if(res.success) {
                await addDoc(collection(firestore!, 'lectures', lecture.id, 'messages'), {
                    text: "Quick Poll: " + res.data.question, senderName: "AI Co-Pilot", senderId: "ai", isPoll: true, pollData: res.data, createdAt: serverTimestamp()
                });
                setIsAiOpen(false); setAiInput('');
            }
        } catch(e) {} finally { setIsProcessingAi(false); }
    };
    const handleExplain = async () => {
        if(!aiInput.trim()) return;
        setIsProcessingAi(true);
        try {
            const res = await explainConceptAction(aiInput);
            if(res.success) { setAiResponse(res.data); }
        } catch(e) {} finally { setIsProcessingAi(false); }
    };


    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-black rounded-xl overflow-hidden relative">
            
            {/* MAIN STAGE AREA */}
            <div className="flex-1 flex overflow-hidden relative">
                
                {/* VIDEO FEED */}
                <div className={`flex-1 relative bg-slate-900 flex items-center justify-center transition-all duration-300 ${showChat || showParticipants ? 'mr-[350px]' : ''}`}>
                    {/* Floating Reactions */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
                        {activeReactions.map(r => (
                            <div key={r.id} className="absolute bottom-10 text-4xl animate-float-up opacity-0" style={{ left: `${r.left}%` }}>
                                {r.emoji}
                            </div>
                        ))}
                    </div>

                    {isPresenter ? (
                        <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-contain ${!isScreenSharing ? 'transform -scale-x-100' : ''}`} />
                    ) : (
                        <div className="text-center text-slate-500">
                            <MonitorPlay className="h-20 w-20 mx-auto mb-4 opacity-50"/>
                            <h3 className="text-2xl font-bold text-white">Live Session</h3>
                            <p>{lecture.title} • {lecture.teacherName}</p>
                        </div>
                    )}
                    
                    {/* STATUS INDICATORS */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-red-600 animate-pulse text-white border-0">LIVE</Badge>
                        {isRecording && <Badge className="bg-slate-800 text-white border-red-500 border flex gap-1"><div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"/> REC</Badge>}
                    </div>
                </div>

                {/* SIDEBAR (Right) */}
                {(showChat || showParticipants) && (
                    <div className="w-[350px] bg-white border-l border-slate-200 flex flex-col absolute right-0 top-0 bottom-0 z-20 shadow-xl">
                        {/* Sidebar Tabs */}
                        <div className="flex border-b">
                            <button onClick={() => {setShowChat(true); setShowParticipants(false);}} className={`flex-1 py-3 text-sm font-medium ${showChat ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>Chat</button>
                            <button onClick={() => {setShowChat(false); setShowParticipants(true);}} className={`flex-1 py-3 text-sm font-medium ${showParticipants ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>People ({participants.length})</button>
                        </div>

                        {/* CHAT CONTENT */}
                        {showChat && (
                            <>
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
                                    {messages?.map(msg => (
                                        <div key={msg.id} className={`flex flex-col ${msg.senderId === user?.uid ? 'items-end' : 'items-start'}`}>
                                            <div className={`max-w-[90%] p-3 rounded-lg text-sm shadow-sm ${msg.isPoll ? 'bg-indigo-50 border-indigo-200 w-full' : msg.senderId === user?.uid ? 'bg-indigo-600 text-white' : 'bg-white border text-slate-800'}`}>
                                                <p className="text-xs opacity-70 mb-1 font-bold">{msg.senderName}</p>
                                                {msg.isPoll ? (
                                                    <div className="space-y-2">
                                                        <p className="font-bold text-indigo-900">{msg.text}</p>
                                                        <div className="grid grid-cols-1 gap-1">{msg.pollData.options.map((o:string,i:number)=><Button key={i} variant="outline" size="sm" className="justify-start h-auto py-1 text-xs bg-white text-black">{o}</Button>)}</div>
                                                    </div>
                                                ) : <p>{msg.text}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t bg-white">
                                    <div className="relative">
                                        <Input value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Chat..." className="pr-10" onKeyDown={e => e.key === 'Enter' && handleSend()}/>
                                        <Button size="icon" variant="ghost" className="absolute right-0 top-0 text-indigo-600" onClick={handleSend}><Send className="h-4 w-4"/></Button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* PARTICIPANTS CONTENT */}
                        {showParticipants && (
                             <div className="flex-1 overflow-y-auto p-2">
                                {participants.map((p, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-md">
                                        <Avatar className="h-8 w-8"><AvatarFallback>{p.charAt(0)}</AvatarFallback></Avatar>
                                        <span className="text-sm font-medium">{p} {p === user?.displayName && '(You)'}</span>
                                        {i === 0 && <Badge variant="secondary" className="ml-auto text-xs">Host</Badge>}
                                    </div>
                                ))}
                                {isPresenter && <Button variant="outline" className="w-full mt-4 text-red-600 border-red-200 hover:bg-red-50">Mute All</Button>}
                             </div>
                        )}
                    </div>
                )}
            </div>

            {/* BOTTOM TOOLBAR (ZOOM STYLE) */}
            <div className="h-16 bg-[#1C1C1E] flex items-center justify-between px-4 shrink-0 z-30">
                
                {/* 1. Audio/Video */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${isMicOn ? 'text-white' : 'text-red-500'}`} onClick={toggleMic}>
                         {isMicOn ? <Mic className="h-5 w-5"/> : <MicOff className="h-5 w-5"/>}
                         <span className="text-[10px]">Mute</span>
                    </Button>
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${isCameraOn ? 'text-white' : 'text-red-500'}`} onClick={toggleCamera}>
                         {isCameraOn ? <Video className="h-5 w-5"/> : <VideoOff className="h-5 w-5"/>}
                         <span className="text-[10px]">Video</span>
                    </Button>
                    <div className="w-px h-8 bg-white/10 mx-2"/>
                    {isMicOn && stream && <MicVisualizer stream={stream} />}
                </div>

                {/* 2. Center Controls */}
                <div className="flex items-center gap-1">
                    {/* Reactions */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" className="flex-col h-14 gap-1 px-3 text-white hover:bg-white/10">
                                <Smile className="h-5 w-5"/> <span className="text-[10px]">Reactions</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2 bg-[#2C2C2E] border-[#3C3C3E] flex gap-2">
                             {['👍','❤️','😂','😮','👋','🎉'].map(emoji => (
                                 <button key={emoji} onClick={() => sendReaction(emoji)} className="text-2xl hover:scale-125 transition-transform p-1">{emoji}</button>
                             ))}
                        </PopoverContent>
                    </Popover>

                    {/* Screen Share (Presenter) */}
                    {isPresenter && (
                        <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${isScreenSharing ? 'text-green-500' : 'text-white'} hover:bg-white/10`} onClick={toggleScreenShare}>
                            <ScreenShare className="h-5 w-5"/> <span className="text-[10px]">{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
                        </Button>
                    )}

                    {/* Recording (Presenter) */}
                    {isPresenter && (
                        <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${isRecording ? 'text-red-500' : 'text-white'} hover:bg-white/10`} onClick={isRecording ? stopRecording : startRecording}>
                            {isRecording ? <Square className="h-5 w-5 fill-current"/> : <Circle className="h-5 w-5 fill-red-500 text-red-500"/>}
                            <span className="text-[10px]">{isRecording ? 'Stop Rec' : 'Record'}</span>
                        </Button>
                    )}

                    {/* AI Tool */}
                    <Button variant="ghost" className="flex-col h-14 gap-1 px-3 text-indigo-400 hover:bg-white/10" onClick={() => setIsAiOpen(true)}>
                         <Sparkles className="h-5 w-5"/> <span className="text-[10px]">{isTeacher ? 'Co-Pilot' : 'AI Help'}</span>
                    </Button>
                </div>

                {/* 3. Right Controls */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${showParticipants ? 'text-blue-400 bg-black/40' : 'text-white'} hover:bg-white/10`} onClick={() => {setShowParticipants(!showParticipants); setShowChat(false);}}>
                        <Users className="h-5 w-5"/> <span className="text-[10px]">People</span>
                    </Button>
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${showChat ? 'text-blue-400 bg-black/40' : 'text-white'} hover:bg-white/10`} onClick={() => {setShowChat(!showChat); setShowParticipants(false);}}>
                        <MessageSquare className="h-5 w-5"/> <span className="text-[10px]">Chat</span>
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white px-6 ml-2" onClick={onLeave}>
                        End
                    </Button>
                </div>
            </div>

            {/* MODALS */}
            {recordedBlob && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                    <Card className="w-[350px] border-slate-700 bg-slate-900 text-white shadow-2xl">
                        <CardHeader><CardTitle>Save Recording?</CardTitle></CardHeader>
                        <CardFooter className="flex justify-between gap-2">
                            <Button variant="ghost" onClick={() => setRecordedBlob(null)}>Discard</Button>
                            <Button onClick={saveRecording} disabled={isSavingRecord} className="bg-emerald-600 flex-1">{isSavingRecord ? <Loader2 className="animate-spin mr-2"/> : "Save to Library"}</Button>
                        </CardFooter>
                    </Card>
                </div>
            )}

            <Dialog open={isAiOpen} onOpenChange={(v) => { setIsAiOpen(v); setAiResponse(null); }}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{isTeacher ? "Teacher Co-Pilot" : "AI Assistant"}</DialogTitle></DialogHeader>
                    {!aiResponse ? (
                        <div className="space-y-4">
                            <Input value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder={isTeacher ? "Topic for poll..." : "Explain concept..."} />
                            <Button className="w-full" onClick={isTeacher ? handleGeneratePoll : handleExplain} disabled={isProcessingAi}>
                                {isProcessingAi ? <Loader2 className="animate-spin"/> : "Submit"}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-slate-800">{aiResponse.definition}</p>
                            <p className="text-slate-600 italic">"{aiResponse.analogy}"</p>
                            <Button variant="outline" onClick={() => setAiResponse(null)}>Close</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

             {/* CSS Animation for Floating Emojis */}
             <style jsx global>{`
                @keyframes float-up {
                    0% { transform: translateY(0) scale(0.5); opacity: 0; }
                    10% { opacity: 1; transform: translateY(-20px) scale(1.2); }
                    100% { transform: translateY(-200px) scale(1); opacity: 0; }
                }
                .animate-float-up {
                    animation: float-up 3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

// --- MAIN PAGE: LOBBY ---
export default function LiveClassroomPage() {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    
    const [activeLectureId, setActiveLectureId] = useState<string | null>(null);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('live');

    const isTeacher = ['Teacher', 'Administrator', 'Director'].includes(role);

    // Queries
    const liveQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'lectures'), where('status', '==', 'live')) : null, [firestore]);
    const { data: liveLectures } = useCollection<Lecture>(liveQuery);

    const upcomingQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'lectures'), where('status', '==', 'scheduled')) : null, 
    [firestore]);
    
    const { data: upcomingLecturesRaw } = useCollection<Lecture>(upcomingQuery);
    
    const upcomingLectures = useMemo(() => {
        if (!upcomingLecturesRaw) return [];
        return upcomingLecturesRaw.sort((a,b) => (a.scheduledFor?.seconds || 0) - (b.scheduledFor?.seconds || 0));
    }, [upcomingLecturesRaw]);

    // Actions
    const handleStartScheduled = async (id: string) => {
        if(!firestore) return;
        await updateDoc(doc(firestore, 'lectures', id), { status: 'live' });
        setActiveLectureId(id);
    };

    const handleEndLecture = async () => {
        if(activeLectureId) {
            await updateDoc(doc(firestore!, 'lectures', activeLectureId), { status: 'ended' });
            setActiveLectureId(null);
        }
    };

    // If joined, show classroom
    if (activeLectureId) {
        const currentLecture = liveLectures?.find(l => l.id === activeLectureId) || upcomingLectures?.find(l => l.id === activeLectureId);
        if(currentLecture) return <ActiveClassroom lecture={currentLecture} onLeave={isTeacher ? handleEndLecture : () => setActiveLectureId(null)} />;
    }

    return (
        <div className="space-y-6 p-6">
            <Card className="bg-slate-900 text-white">
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Video className="text-red-500"/> Live Classroom</CardTitle>
                        <p className="text-slate-400">Interactive virtual learning environment.</p>
                    </div>
                    {isTeacher && (
                        <Button onClick={() => setIsScheduleOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <CalendarIcon className="mr-2 h-4 w-4"/> Schedule Class
                        </Button>
                    )}
                </CardHeader>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="live">Live Now ({liveLectures?.length || 0})</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming ({upcomingLectures?.length || 0})</TabsTrigger>
                </TabsList>
                <TabsContent value="live" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {liveLectures?.length === 0 && <p className="text-muted-foreground col-span-full text-center py-8">No live classes.</p>}
                        {liveLectures?.map(l => (
                            <Card key={l.id} className="border-l-4 border-l-red-500 shadow-sm animate-pulse">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-200">LIVE</Badge>
                                        <Badge variant="outline">{l.targetGroup}</Badge>
                                    </div>
                                    <CardTitle className="mt-2">{l.title}</CardTitle>
                                    <CardDescription>Host: {l.teacherName}</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button onClick={() => setActiveLectureId(l.id)} className="w-full bg-red-600 hover:bg-red-700">Join Class</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="upcoming" className="mt-6">
                     <div className="space-y-4">
                        {upcomingLectures?.length === 0 && <p className="text-muted-foreground text-center py-8">No classes scheduled.</p>}
                        {upcomingLectures?.map(l => (
                            <div key={l.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                                <div className="flex gap-4 items-center">
                                    <div className="bg-indigo-50 p-3 rounded-lg text-center min-w-[70px]">
                                        <p className="text-xs font-bold text-indigo-600 uppercase">{l.scheduledFor ? format(l.scheduledFor.toDate(), 'MMM') : 'DATE'}</p>
                                        <p className="text-xl font-bold text-slate-800">{l.scheduledFor ? format(l.scheduledFor.toDate(), 'd') : '00'}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-800">{l.title}</h4>
                                        <div className="flex gap-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3"/> {l.scheduledFor ? format(l.scheduledFor.toDate(), 'p') : 'Time'}</span>
                                            <span>•</span>
                                            <span>{l.targetGroup}</span>
                                        </div>
                                    </div>
                                </div>
                                {isTeacher ? (
                                    <Button onClick={() => handleStartScheduled(l.id)} size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                                        Start Now
                                    </Button>
                                ) : (
                                    <Button disabled variant="secondary" size="sm">Not Started</Button>
                                )}
                            </div>
                        ))}
                     </div>
                </TabsContent>
            </Tabs>
            <ScheduleClassDialog open={isScheduleOpen} setOpen={setIsScheduleOpen} />
        </div>
    );
}
