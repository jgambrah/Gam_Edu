
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, where, doc, updateDoc, limit, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getApp } from 'firebase/app';
import { 
  Video, Mic, MicOff, VideoOff, MessageSquare, Send, 
  Sparkles, MonitorPlay, Bot, Calendar as CalendarIcon, 
  Clock, ChevronLeft, ChevronRight, Presentation, ScreenShare, 
  LayoutGrid, Maximize, Circle, Square, Save, Users, PenTool, Eraser, Trash2, Download, Smile, X, Subtitles, PictureInPicture, Users2, Timer
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Types
import type { Lecture, ChatMessage, Class } from '@/lib/types';

// --- SUB-COMPONENT: Audio Visualizer (Fixed) ---
const MicVisualizer = ({ stream }: { stream: MediaStream | null }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const audioContextRef = useRef<AudioContext | null>(null);

    useEffect(() => {
        if (!stream || !canvasRef.current) return;
        
        // 1. Validate Audio Track
        if (stream.getAudioTracks().length === 0) {
            console.warn("Visualizer: No audio tracks in stream");
            return;
        }

        // 2. Initialize Audio Context (Handle browser prefixes)
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioContextRef.current = ctx;

        // 3. Force Resume (Fixes "flat line" issue in Chrome/Edge)
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64; // Keep small for chunky bars
        const source = ctx.createMediaStreamSource(stream);
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext("2d");

        const draw = () => {
            if (!canvasCtx) return;
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            // Clear canvas
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 1.5; // Sensitivity adj

                // Dynamic Color: Green (Quiet) -> Yellow -> Red (Loud)
                const r = barHeight + (25 * (i / bufferLength));
                const g = 250 * (i / bufferLength);
                const b = 50;
                
                canvasCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 2;
            }
        };

        draw();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, [stream]);

    return (
        <div className="bg-black/30 p-1 rounded border border-white/10">
            <canvas ref={canvasRef} width="60" height="30" className="block" />
        </div>
    );
};

// --- SUB-COMPONENT: Interactive Whiteboard ---
const Whiteboard = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [lineWidth, setLineWidth] = useState(3);
    const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size to match parent
        canvas.width = canvas.parentElement?.clientWidth || 800;
        canvas.height = canvas.parentElement?.clientHeight || 600;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctxRef.current = ctx;
            // Set white background initially
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Handle resize
        const handleResize = () => {
            if (canvas.parentElement) {
                const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
                if (ctx && imageData) ctx.putImageData(imageData, 0, 0);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const startDrawing = (e: React.MouseEvent) => {
        if (!ctxRef.current) return;
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing || !ctxRef.current) return;
        ctxRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
        ctxRef.current.lineWidth = tool === 'eraser' ? 20 : lineWidth;
        ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctxRef.current.stroke();
    };

    const stopDrawing = () => {
        if (!ctxRef.current) return;
        ctxRef.current.closePath();
        setIsDrawing(false);
    };

    const clearBoard = () => {
        if (!canvasRef.current || !ctxRef.current) return;
        ctxRef.current.fillStyle = "white";
        ctxRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const downloadBoard = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `whiteboard-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <div className="relative w-full h-full bg-white group">
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="cursor-crosshair w-full h-full block"
            />
            
            {/* FLOATING TOOLBOX */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 shadow-xl border p-2 rounded-full flex items-center gap-3 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button 
                    variant={tool === 'pen' ? "default" : "ghost"} 
                    size="icon" 
                    className="rounded-full w-8 h-8"
                    onClick={() => setTool('pen')}
                >
                    <PenTool className="h-4 w-4"/>
                </Button>
                
                {/* Color Pickers */}
                <div className="flex gap-1 border-l border-r px-2">
                    {['#000000', '#EF4444', '#3B82F6', '#10B981'].map((c) => (
                        <button
                            key={c}
                            className={`w-6 h-6 rounded-full border-2 ${color === c && tool === 'pen' ? 'border-indigo-600 scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                            onClick={() => { setColor(c); setTool('pen'); }}
                        />
                    ))}
                </div>

                <Button 
                    variant={tool === 'eraser' ? "default" : "ghost"} 
                    size="icon" 
                    className="rounded-full w-8 h-8"
                    onClick={() => setTool('eraser')}
                >
                    <Eraser className="h-4 w-4"/>
                </Button>

                <div className="w-px h-4 bg-slate-200"></div>

                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 text-red-500 hover:bg-red-50" onClick={clearBoard}>
                    <Trash2 className="h-4 w-4"/>
                </Button>
                
                <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 text-slate-600" onClick={downloadBoard}>
                    <Download className="h-4 w-4"/>
                </Button>
            </div>
        </div>
    );
};

// --- COMPONENT: Schedule Class Dialog ---
function ScheduleClassDialog({ open, setOpen, classes }: { open: boolean, setOpen: (v: boolean) => void, classes: Class[] }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [classId, setClassId] = useState(''); // Changed from targetGroup
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');

    const handleSchedule = async () => {
        if (!user || !title || !scheduledDate || !scheduledTime || !classId) {
            toast({ variant: 'destructive', title: "Missing Fields", description: "Please fill in all required fields." });
            return;
        }
        setIsSubmitting(true);
        try {
            const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
            await addDoc(collection(firestore!, 'lectures'), {
                title,
                description,
                classId: classId,
                scheduledFor: scheduledDateTime,
                teacherName: user.displayName || user.email?.split('@')[0],
                teacherId: user.uid,
                status: 'scheduled',
                createdAt: serverTimestamp(),
                slides: [],
                currentSlide: 0,
                isPresentationMode: false
            });
            toast({ title: "Class Scheduled" });
            setOpen(false);
            setTitle(''); setDescription(''); setClassId('');
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Schedule a New Live Class</DialogTitle>
                    <DialogDescription>Set up a future live session for a specific class.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Topic / Title *</Label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="classId">Target Class *</Label>
                        <Select value={classId} onValueChange={setClassId}>
                            <SelectTrigger><SelectValue placeholder="Select a class"/></SelectTrigger>
                            <SelectContent>
                                {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input id="date" type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="time">Time *</Label>
                            <Input id="time" type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSchedule} disabled={isSubmitting} className="w-full">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Schedule Class"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- COMPONENT: ACTIVE CLASSROOM ---
function ActiveClassroom({ lecture, onLeave }: { lecture: Lecture, onLeave: () => void }) {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [msgText, setMsgText] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // AI Tools
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [aiInput, setAiInput] = useState('');
    const [aiResponse, setAiResponse] = useState<any>(null);
    const [isProcessingAi, setIsProcessingAi] = useState(false);

    // Media
    const [isUploadingSlides, setIsUploadingSlides] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [streamVersion, setStreamVersion] = useState(0); 
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [permissionError, setPermissionError] = useState(false);

    // Tools & Layout
    const [layoutMode, setLayoutMode] = useState<'focus' | 'grid'>('focus');
    const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
    const [captionsOn, setCaptionsOn] = useState(false);
    
    // Recording
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [isSavingRecord, setIsSavingRecord] = useState(false);

    // UI State
    const [showParticipants, setShowParticipants] = useState(false);
    const [showChat, setShowChat] = useState(true);
    const [activeReactions, setActiveReactions] = useState<{id: string, emoji: string, left: number}[]>([]);

    const isTeacher = role === 'Teacher' || role === 'Administrator' || role === 'Director';
    const isPresenter = user?.uid === lecture.teacherId; 

    // 1. Initialize Camera
    useEffect(() => {
        let localStream: MediaStream | null = null;
        const startStream = async () => {
            if (isPresenter || layoutMode === 'grid') {
                try {
                    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                    setStream(localStream);
                    setStreamVersion(v => v + 1);
                    setIsCameraOn(true);
                    setIsMicOn(true);
                } catch (err) {
                    console.error("Error accessing media:", err);
                    setPermissionError(true);
                }
            }
        };
        startStream();
        return () => { if (localStream) localStream.getTracks().forEach(track => track.stop()); };
    }, [isPresenter, layoutMode]);

    // 2. Sync Video Element
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, streamVersion, layoutMode, isScreenSharing, isWhiteboardActive]);

    // 3. Chat Query
    const chatQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'lectures', lecture.id, 'messages'), orderBy('createdAt', 'asc')) : null, 
    [firestore, lecture.id]);
    const { data: messages } = useCollection<ChatMessage>(chatQuery);

    // 4. Reactions Listener
    useEffect(() => {
        if (!firestore) return;
        const q = query(collection(firestore, 'lectures', lecture.id, 'reactions'), orderBy('createdAt', 'desc'), limit(1));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = change.doc.data();
                    const id = Math.random().toString();
                    const left = Math.floor(Math.random() * 80) + 10; 
                    setActiveReactions(prev => [...prev, { id, emoji: data.emoji, left }]);
                    setTimeout(() => setActiveReactions(prev => prev.filter(r => r.id !== id)), 3000);
                }
            });
        });
        return () => unsubscribe();
    }, [firestore, lecture.id]);

    useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

    const participants = useMemo(() => {
        const unique = new Set<string>();
        unique.add(lecture.teacherName);
        if (user?.displayName) unique.add(user.displayName);
        messages?.forEach(m => unique.add(m.senderName));
        return Array.from(unique);
    }, [messages, lecture.teacherName, user]);


    // --- HANDLERS ---
    const toggleScreenShare = async () => {
        if (!stream) return;

        if (isScreenSharing) {
            // STOP SHARING -> Revert to Webcam
            try {
                stream.getVideoTracks().forEach(t => t.stop());
                
                const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(camStream);
                setStreamVersion(v => v + 1);
                setIsScreenSharing(false);
                
                if (videoRef.current) videoRef.current.srcObject = camStream;

            } catch (e) {
                console.error("Error reverting to camera", e);
            }
        } else {
            // START SHARING
            try {
                // @ts-ignore
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
                
                // Handle user clicking "Stop Sharing" in browser UI (floating bar)
                displayStream.getVideoTracks()[0].onended = () => {
                    toggleScreenShare(); // Revert logic
                };

                setStream(displayStream);
                setStreamVersion(v => v + 1);
                setIsScreenSharing(true);
                
                if (videoRef.current) videoRef.current.srcObject = displayStream;

            } catch (err: any) {
                if (err.name === 'NotAllowedError') {
                    return; 
                }
                console.error("Screen Share Failed:", err);
                toast({ variant: "destructive", title: "Error", description: "Screen share failed." });
            }
        }
    };
    
    const togglePiP = async () => {
        if (!videoRef.current) return;
        if (document.pictureInPictureElement) {
            try {
                await document.exitPictureInPicture();
            } catch (error) {
                console.error("Error exiting PiP mode:", error);
            }
        } else {
            try {
                await videoRef.current.requestPictureInPicture();
            } catch (error) {
                console.error("Error entering PiP mode:", error);
            }
        }
    };

    const sendReaction = async (emoji: string) => {
        if (!firestore) return;
        const id = Math.random().toString();
        setActiveReactions(prev => [...prev, { id, emoji, left: 50 }]);
        setTimeout(() => setActiveReactions(prev => prev.filter(r => r.id !== id)), 3000);
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

    const toggleCamera = () => { if (stream) { const track = stream.getVideoTracks()[0]; if(track) { track.enabled = !track.enabled; setIsCameraOn(track.enabled); } } };
    const toggleMic = () => { if (stream) { const track = stream.getAudioTracks()[0]; if(track) { track.enabled = !track.enabled; setIsMicOn(track.enabled); } } };
    const startRecording = () => { /* ... */ };
    const stopRecording = () => { /* ... */ };
    const saveRecording = () => { /* ... */ };
    const handleUploadSlides = (e: React.ChangeEvent<HTMLInputElement>) => { /* ... */ };
    const changeSlide = (direction: 'next' | 'prev') => { /* ... */ };

    const handleGeneratePoll = async () => {
        if(!aiInput.trim()) return;
        setIsProcessingAi(true);
        try {
            const res = await generateLivePollAction(aiInput);
            if(res.success) {
                await addDoc(collection(firestore!, 'lectures', lecture.id, 'messages'), {
                    text: "Quick Poll: " + res.data.question, senderName: "AI Co-Pilot", senderId: "ai", isPoll: true, pollData: res.data, createdAt: serverTimestamp()
                });
                toast({ title: "Poll Posted" }); setIsAiOpen(false); setAiInput('');
            }
        } catch(e) { toast({ variant: 'destructive', title: "Error" }); } finally { setIsProcessingAi(false); }
    };
    const handleExplainConcept = async () => {
        if(!aiInput.trim()) return;
        setIsProcessingAi(true);
        try {
            const res = await explainConceptAction(aiInput);
            if(res.success) { setAiResponse(res.data); }
        } catch(e) { toast({ variant: 'destructive', title: "Error" }); } finally { setIsProcessingAi(false); }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-black rounded-xl overflow-hidden relative">
            <div className="flex-1 flex overflow-hidden relative">
                <div className={`flex-1 relative bg-slate-900 flex items-center justify-center transition-all duration-300 ${showChat || showParticipants ? 'mr-[350px]' : ''}`}>
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
                        {activeReactions.map(r => <div key={r.id} className="absolute bottom-20 text-5xl animate-float-up opacity-0" style={{ left: `${r.left}%` }}>{r.emoji}</div>)}
                    </div>

                    {isWhiteboardActive && (
                        <div className="absolute inset-0 z-20"><Whiteboard /></div>
                    )}
                    
                    {isPresenter ? (
                        <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-contain ${!isScreenSharing ? 'transform -scale-x-100' : ''}`} />
                    ) : (
                        <div className="text-center text-slate-500"><MonitorPlay className="h-20 w-20 mx-auto mb-4 opacity-50"/><h3 className="text-2xl font-bold text-white">Live Session</h3><p>{lecture.title}</p></div>
                    )}
                </div>

                {(showChat || showParticipants) && (
                    <div className="w-[350px] bg-white border-l flex flex-col absolute right-0 top-0 bottom-0 z-20">
                        <div className="flex border-b">
                            <button onClick={() => {setShowChat(true); setShowParticipants(false);}} className={`flex-1 py-3 text-sm font-medium ${showChat ? 'text-indigo-600 border-b-2' : 'text-slate-500'}`}>Chat</button>
                            <button onClick={() => {setShowChat(false); setShowParticipants(true);}} className={`flex-1 py-3 text-sm font-medium ${showParticipants ? 'text-indigo-600 border-b-2' : 'text-slate-500'}`}>People ({participants.length})</button>
                        </div>
                        {showChat && (
                            <><div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>{messages?.map(msg => (<div key={msg.id} className={`flex flex-col ${msg.senderId === user?.uid ? 'items-end' : 'items-start'}`}><div className={`max-w-[90%] p-3 rounded-lg text-sm ${msg.isPoll ? 'bg-indigo-50 border-indigo-200 w-full' : msg.senderId === user?.uid ? 'bg-indigo-600 text-white' : 'bg-white border'}`}><p className="text-xs opacity-70 mb-1 font-bold">{msg.senderName}</p><p>{msg.text}</p></div></div>))}</div><div className="p-3 border-t flex gap-2"><Input value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Chat..." onKeyDown={e => e.key === 'Enter' && handleSend()}/><Button size="icon" onClick={handleSend}><Send className="h-4 w-4"/></Button></div></>
                        )}
                        {showParticipants && (
                             <div className="flex-1 overflow-y-auto p-2">{participants.map((p, i) => (<div key={i} className="flex items-center gap-3 p-2 rounded-md"><Avatar className="h-8 w-8"><AvatarFallback>{p.charAt(0)}</AvatarFallback></Avatar><span className="text-sm font-medium">{p}</span></div>))}</div>
                        )}
                    </div>
                )}
            </div>

            {/* BOTTOM TOOLBAR */}
            <div className="h-16 bg-[#1C1C1E] flex items-center justify-between px-4 shrink-0 z-30">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${isMicOn ? 'text-white' : 'text-red-500'}`} onClick={toggleMic} disabled={!stream}><Mic className="h-5 w-5"/><span className="text-[10px]">Mic</span></Button>
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${isCameraOn ? 'text-white' : 'text-red-500'}`} onClick={toggleCamera} disabled={!stream}><Video className="h-5 w-5"/><span className="text-[10px]">Cam</span></Button>
                    <div className="w-px h-8 bg-white/10 mx-2"/>
                    {isMicOn && stream && <MicVisualizer stream={stream} />}
                </div>
                <div className="flex items-center gap-1">
                    <Popover><PopoverTrigger asChild><Button variant="ghost" className="flex-col h-14 gap-1 px-3 text-white hover:bg-white/10"><Smile className="h-5 w-5"/> <span className="text-[10px]">React</span></Button></PopoverTrigger><PopoverContent className="w-auto p-2 bg-[#2C2C2E] border-none flex gap-2">{['👍','❤️','😂','😮','👋','🎉'].map(e => (<button key={e} onClick={() => sendReaction(e)} className="text-2xl hover:scale-125 p-1">{e}</button>))}</PopoverContent></Popover>
                    <Button variant="ghost" className="flex-col h-14 gap-1 px-3 text-white hover:bg-white/10" onClick={togglePiP}><PictureInPicture className="h-5 w-5"/><span className="text-[10px]">PiP</span></Button>
                    {isPresenter && (
                        <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${isScreenSharing ? 'text-green-500' : 'text-white'} hover:bg-white/10`} onClick={toggleScreenShare}>
                            <ScreenShare className="h-5 w-5"/> <span className="text-[10px]">{isScreenSharing ? 'Stop' : 'Share'}</span>
                        </Button>
                    )}
                    {isPresenter && (
                         <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${isWhiteboardActive ? 'text-green-500' : 'text-white'} hover:bg-white/10`} onClick={() => setIsWhiteboardActive(!isWhiteboardActive)}>
                            <PenTool className="h-5 w-5"/> <span className="text-[10px]">Board</span>
                        </Button>
                    )}
                    <Button variant="ghost" className="flex-col h-14 gap-1 px-3 text-indigo-400 hover:bg-white/10" onClick={() => setIsAiOpen(true)}>
                         <Sparkles className="h-5 w-5"/> <span className="text-[10px]">{isTeacher ? 'Co-Pilot' : 'AI Help'}</span>
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${showParticipants ? 'text-blue-400 bg-black/40' : 'text-white'} hover:bg-white/10`} onClick={() => {setShowParticipants(!showParticipants); setShowChat(false);}}><Users className="h-5 w-5"/> <span className="text-[10px]">People</span></Button>
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${showChat ? 'text-blue-400 bg-black/40' : 'text-white'} hover:bg-white/10`} onClick={() => {setShowChat(!showChat); setShowParticipants(false);}}><MessageSquare className="h-5 w-5"/> <span className="text-[10px]">Chat</span></Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full h-10 px-6 ml-2" onClick={onLeave}>End</Button>
                </div>
            </div>

            {/* AI Assistant / Co-Pilot Modal */}
            <Dialog open={isAiOpen} onOpenChange={(v) => { setIsAiOpen(v); setAiResponse(null); setAiInput(''); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isTeacher ? "Teacher Co-Pilot" : "Personal Tutor"}</DialogTitle>
                    </DialogHeader>
                    
                    {!aiResponse ? (
                        <div className="space-y-4">
                            <Label>{isTeacher ? "What topic are you teaching?" : "What concept is confusing you?"}</Label>
                            <Input value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder={isTeacher ? "e.g. Gravity" : "e.g. Inertia"} />
                            <Button className="w-full" onClick={isTeacher ? handleGeneratePoll : handleExplainConcept} disabled={isProcessingAi}>
                                {isProcessingAi ? <Loader2 className="animate-spin"/> : (isTeacher ? "Generate Quiz" : "Explain to Me")}
                            </Button>
                        </div>
                    ) : (
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

             <style jsx global>{`
                @keyframes float-up { 0% { transform: translateY(0) scale(0.5); opacity: 0; } 10% { opacity: 1; transform: translateY(-20px) scale(1.2); } 100% { transform: translateY(-200px) scale(1); opacity: 0; } }
                .animate-float-up { animation: float-up 3s ease-out forwards; }
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
    
    const isTeacherOrAdmin = ['Teacher', 'Administrator', 'Director'].includes(role || '');
    
    const { data: studentData } = useCollection<Student>(
        useMemoFirebase(() => (role === 'Student' && user) ? query(collection(firestore!, 'students'), where('uid', '==', user.uid)) : null, [role, user, firestore])
    );
    const studentClassId = studentData?.[0]?.classId;

    // Queries
    const lecturesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null; 
        return query(collection(firestore, 'lectures'), orderBy('createdAt', 'desc'));
    }, [firestore, user]);

    const { data: allLectures } = useCollection<Lecture>(lecturesQuery);

    const { data: classes } = useCollection<Class>(useMemoFirebase(() => firestore ? collection(firestore, 'classes') : null, [firestore]));

    const filteredLectures = useMemo(() => {
        if (isTeacherOrAdmin || !allLectures) return allLectures || [];
        // Student view: only show lectures for their class
        return allLectures.filter(l => l.classId === studentClassId);
    }, [allLectures, isTeacherOrAdmin, studentClassId]);

    const liveLectures = filteredLectures.filter(l => l.status === 'live');
    const upcomingLectures = filteredLectures.filter(l => l.status === 'scheduled').sort((a,b) => (a.scheduledFor?.seconds || 0) - (b.scheduledFor?.seconds || 0));

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

    if (activeLectureId) {
        const currentLecture = liveLectures.find(l => l.id === activeLectureId) || upcomingLectures.find(l => l.id === activeLectureId);
        if(currentLecture) return <ActiveClassroom lecture={currentLecture} onLeave={isTeacherOrAdmin ? handleEndLecture : () => setActiveLectureId(null)} />;
    }

    return (
        <div className="space-y-6 p-6">
            <Card className="bg-slate-900 text-white">
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Video className="text-red-500"/> Live Classroom</CardTitle>
                        <p className="text-slate-400">Interactive virtual learning environment.</p>
                    </div>
                    {isTeacherOrAdmin && (
                        <Button onClick={() => setIsScheduleOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <CalendarIcon className="mr-2 h-4 w-4"/> Schedule Class
                        </Button>
                    )}
                </CardHeader>
            </Card>
            <Tabs defaultValue="live" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="live">Live Now ({liveLectures.length})</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming ({upcomingLectures.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="live" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {liveLectures.length === 0 && <p className="text-muted-foreground col-span-full text-center py-8">No live classes at the moment.</p>}
                        {liveLectures.map(l => (
                            <Card key={l.id} className="border-l-4 border-l-red-500 shadow-sm animate-pulse">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-200">LIVE</Badge>
                                        <Badge variant="outline">{classes?.find(c => c.id === l.classId)?.name || 'N/A'}</Badge>
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
                        {upcomingLectures.length === 0 && <p className="text-muted-foreground text-center py-8">No classes scheduled.</p>}
                        {upcomingLectures.map(l => (
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
                                            <span>{classes?.find(c => c.id === l.classId)?.name || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                {isTeacherOrAdmin ? (
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
            <ScheduleClassDialog open={isScheduleOpen} setOpen={setIsScheduleOpen} classes={classes || []} />
        </div>
    );
}
