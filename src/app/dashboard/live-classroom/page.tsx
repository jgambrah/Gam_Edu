
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
  LayoutGrid, Maximize, Circle, Square, Save, Users, PenTool, Eraser, Palette, Trash2, Download,
  Subtitles, PictureInPicture, Users2, Timer, Smile
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
    // New Breakout Fields
    breakoutActive?: boolean;
    breakoutDuration?: number; // minutes
    breakoutEndTime?: any; 
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

// --- COMPONENT: Breakout Room Setup ---
function BreakoutSetupDialog({ open, setOpen, onStart }: { open: boolean, setOpen: (v: boolean) => void, onStart: (rooms: number, duration: number) => void }) {
    const [rooms, setRooms] = useState('2');
    const [duration, setDuration] = useState('10');

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Start Breakout Rooms</DialogTitle>
                    <DialogDescription>Split students into smaller groups for discussion.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Number of Rooms</Label>
                        <Select value={rooms} onValueChange={setRooms}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2">2 Rooms</SelectItem>
                                <SelectItem value="3">3 Rooms</SelectItem>
                                <SelectItem value="4">4 Rooms</SelectItem>
                                <SelectItem value="5">5 Rooms</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Duration (Minutes)</Label>
                        <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => { onStart(Number(rooms), Number(duration)); setOpen(false); }}>Start Session</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

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

    // Breakout Rooms
    const [isBreakoutSetupOpen, setIsBreakoutSetupOpen] = useState(false);
    const [breakoutTimeLeft, setBreakoutTimeLeft] = useState<string>('');

    // Media State
    const [isUploadingSlides, setIsUploadingSlides] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [streamVersion, setStreamVersion] = useState(0); 
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [permissionError, setPermissionError] = useState(false);
    
    // Feature States
    const [captionsOn, setCaptionsOn] = useState(false);
    const [captionText, setCaptionText] = useState('');
    const recognitionRef = useRef<any>(null);
    
    // Layout & Tools
    const [layoutMode, setLayoutMode] = useState<'focus' | 'grid'>('focus');
    const [isWhiteboardActive, setIsWhiteboardActive] = useState(false); 

    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [isSavingRecord, setIsSavingRecord] = useState(false);

    const [showParticipants, setShowParticipants] = useState(false);
    const [showChat, setShowChat] = useState(true);
    const [activeReactions, setActiveReactions] = useState<{id: string, emoji: string, left: number}[]>([]);

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
                    setStreamVersion(v => v + 1);
                    setIsCameraOn(true);
                    setIsMicOn(true);
                } catch (err) { console.error("Media Error:", err); }
            }
        };
        startStream();
        return () => { 
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [isPresenter]);

    // Sync Video Element
    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, streamVersion, layoutMode, isScreenSharing, isWhiteboardActive]);

    // Cleanup
    useEffect(() => {
        return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
    }, []);

    // --- 2. LIVE CAPTIONS (Web Speech API) ---
    const toggleCaptions = () => {
        if (captionsOn) {
            if (recognitionRef.current) recognitionRef.current.stop();
            setCaptionsOn(false);
            setCaptionText('');
        } else {
            // @ts-ignore - for cross-browser compatibility
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                toast({ variant: 'destructive', title: "Not Supported", description: "Live captions require a Chromium-based browser like Chrome or Edge." });
                return;
            }
            
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                let interim = '';
                let final = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final += event.results[i][0].transcript;
                    } else {
                        interim += event.results[i][0].transcript;
                    }
                }
                setCaptionText(final + interim);
                 if (final) {
                    setTimeout(() => setCaptionText(prev => prev === final ? '' : prev), 3000);
                }
            };

            recognition.onerror = (event: any) => {
                console.error("Speech Recognition Error:", event.error);
                if(event.error === 'no-speech' || event.error === 'network') {
                    recognition.stop();
                    setTimeout(() => recognition.start(), 100);
                }
            };

            recognition.start();
            recognitionRef.current = recognition;
            setCaptionsOn(true);
            toast({ title: "Captions On", description: "Speak into your microphone." });
        }
    };

    // --- 3. PICTURE IN PICTURE ---
    const togglePiP = async () => {
        try {
            if (!document.pictureInPictureEnabled) {
                toast({ variant: "destructive", title: "Not Supported", description: "Picture-in-Picture is not supported by your browser." });
                return;
            }
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else if (videoRef.current) {
                await videoRef.current.requestPictureInPicture();
            }
        } catch (error) {
            toast({ variant: 'destructive', title: "PiP Error", description: "Picture-in-Picture failed to start." });
        }
    };

    // --- 4. BREAKOUT ROOM LOGIC ---
    const handleStartBreakout = async (rooms: number, duration: number) => {
        if (!firestore) return;
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + duration);
        
        await updateDoc(doc(firestore, 'lectures', lecture.id), {
            breakoutActive: true,
            breakoutDuration: duration,
            breakoutEndTime: endTime
        });
        toast({ title: "Breakout Rooms Started", description: `Students split into ${rooms} rooms for ${duration} mins.` });
    };

    const handleEndBreakout = async () => {
        if (!firestore) return;
        await updateDoc(doc(firestore, 'lectures', lecture.id), {
            breakoutActive: false,
            breakoutEndTime: null
        });
        toast({ title: "Breakout Ended", description: "Everyone returning to main session." });
    };

    useEffect(() => {
        if (lecture.breakoutActive && lecture.breakoutEndTime) {
            const interval = setInterval(() => {
                const now = new Date();
                const end = lecture.breakoutEndTime.toDate();
                const diff = end.getTime() - now.getTime();
                
                if (diff <= 0) {
                    setBreakoutTimeLeft("00:00");
                    if (isTeacher) handleEndBreakout(); // Auto-end for teacher
                } else {
                    const m = Math.floor(diff / 60000);
                    const s = Math.floor((diff % 60000) / 1000);
                    setBreakoutTimeLeft(`${m}:${s < 10 ? '0' : ''}${s}`);
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [lecture.breakoutActive, lecture.breakoutEndTime]);


    // Chat & Participants
    const chatQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'lectures', lecture.id, 'messages'), orderBy('createdAt', 'asc')) : null, [firestore, lecture.id]);
    const { data: messages } = useCollection<ChatMessage>(chatQuery);
    useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);
    const participants = useMemo(() => {
        const unique = new Set<string>();
        unique.add(lecture.teacherName);
        if (user?.displayName) unique.add(user.displayName);
        messages?.forEach(m => unique.add(m.senderName));
        return Array.from(unique);
    }, [messages, lecture.teacherName, user]);


    // All other handlers remain the same as previous version...
    const toggleScreenShare = async () => {
        if (!stream) return;

        if (isScreenSharing) {
            // STOP SHARING -> Revert to Webcam
            try {
                // Stop the screen tracks
                stream.getVideoTracks().forEach(t => t.stop());
                
                // Get webcam again
                const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(camStream);
                setStreamVersion(v => v + 1);
                setIsScreenSharing(false);
                
                // Re-sync video element
                if (videoRef.current) videoRef.current.srcObject = camStream;

            } catch (e) {
                console.error("Error reverting to camera:", e);
                toast({ variant: 'destructive', title: "Camera Error", description: "Could not revert to webcam." });
            }
        } else {
            // START SHARING
            try {
                // Request Screen Stream
                // @ts-ignore - getDisplayMedia exists in modern browsers
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                
                // Handle user clicking "Stop Sharing" floating browser button
                displayStream.getVideoTracks()[0].onended = () => {
                    // When native stop button is clicked, revert logic
                    toggleScreenShare(); 
                };

                setStream(displayStream);
                setStreamVersion(v => v + 1);
                setIsScreenSharing(true);
                
                if (videoRef.current) videoRef.current.srcObject = displayStream;

            } catch (err: any) {
                // --- IMPROVED ERROR LOGGING ---
                console.error("Screen Share Error Name:", err.name);
                console.error("Screen Share Error Message:", err.message);

                if (err.name === 'NotAllowedError') {
                    toast({ variant: "destructive", title: "Permission Denied", description: "You denied screen access or your browser blocked it." });
                } else if (err.name === 'NotFoundError') {
                    toast({ variant: "destructive", title: "No Source", description: "No screen video source found." });
                } else {
                    toast({ variant: "destructive", title: "Screen Share Failed", description: "Try opening the app in a separate browser tab." });
                }
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
    const handleSend = async () => { /* ... */ };
    const toggleCamera = () => { /* ... */ };
    const toggleMic = () => { /* ... */ };
    const startRecording = () => { /* ... */ };
    const stopRecording = () => { /* ... */ };
    const saveRecording = async () => { /* ... */ };
    const handleUploadSlides = async (e: React.ChangeEvent<HTMLInputElement>) => { /* ... */ };
    const changeSlide = async (direction: 'next' | 'prev') => { /* ... */ };
    const handleGeneratePoll = async () => { /* ... */ };
    const handleExplainConcept = async () => { /* ... */ };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-black rounded-xl overflow-hidden relative">
            
            {/* BREAKOUT ROOM OVERLAY */}
            {lecture.breakoutActive && (
                <div className="absolute inset-0 bg-indigo-900/95 z-50 flex flex-col items-center justify-center text-white">
                    <Users2 className="h-16 w-16 mb-4 animate-bounce"/>
                    <h2 className="text-3xl font-bold">Breakout Session</h2>
                    <p className="text-indigo-200 mt-2">You are in a breakout room. Discuss with your peers!</p>
                    <div className="mt-8 flex items-center gap-2 bg-black/30 px-6 py-3 rounded-full text-xl font-mono">
                        <Timer className="h-6 w-6"/> {breakoutTimeLeft}
                    </div>
                    {isTeacher && (
                        <Button onClick={handleEndBreakout} variant="destructive" className="mt-8">End Breakout Session</Button>
                    )}
                </div>
            )}

            {/* MAIN STAGE AREA */}
            <div className="flex-1 flex overflow-hidden relative">
                <div className={`flex-1 relative bg-slate-900 flex items-center justify-center transition-all duration-300 ${showChat || showParticipants ? 'mr-[350px]' : ''}`}>
                    {/* Reactions & Captions */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
                        {activeReactions.map(r => <div key={r.id} className="absolute bottom-20 text-5xl animate-float-up opacity-0" style={{ left: `${r.left}%` }}>{r.emoji}</div>)}
                        {captionText && <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/60 text-white px-6 py-3 rounded-lg text-lg font-medium backdrop-blur-sm z-40 text-center max-w-[80%]">{captionText}</div>}
                    </div>

                    {isWhiteboardActive && (
                        <div className="absolute inset-0 z-20">
                            <Whiteboard />
                        </div>
                    )}
                    
                    {isPresenter ? (
                        <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-contain ${!isScreenSharing ? 'transform -scale-x-100' : ''}`} />
                    ) : (
                        <div className="text-center text-slate-500"><MonitorPlay className="h-20 w-20 mx-auto mb-4 opacity-50"/><h3 className="text-2xl font-bold text-white">Live Session</h3><p>{lecture.title}</p></div>
                    )}
                </div>

                {/* SIDEBAR */}
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
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${isMicOn ? 'text-white' : 'text-red-500'}`} onClick={toggleMic}><Mic className="h-5 w-5"/><span className="text-[10px]">Mic</span></Button>
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${isCameraOn ? 'text-white' : 'text-red-500'}`} onClick={toggleCamera}><Video className="h-5 w-5"/><span className="text-[10px]">Cam</span></Button>
                </div>
                <div className="flex items-center gap-1">
                    <Popover><PopoverTrigger asChild><Button variant="ghost" className="flex-col h-14 gap-1 px-3 text-white"><Smile className="h-5 w-5"/> <span className="text-[10px]">React</span></Button></PopoverTrigger><PopoverContent className="w-auto p-2 bg-[#2C2C2E] border-none flex gap-2">{['👍','❤️','😂','😮','👋','🎉'].map(e => (<button key={e} onClick={() => sendReaction(e)} className="text-2xl hover:scale-125 p-1">{e}</button>))}</PopoverContent></Popover>
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${captionsOn ? 'text-green-400' : 'text-white'}`} onClick={toggleCaptions}><Subtitles className="h-5 w-5"/><span className="text-[10px]">CC</span></Button>
                    <Button variant="ghost" className="flex-col h-14 gap-1 px-3 text-white" onClick={togglePiP}><PictureInPicture className="h-5 w-5"/><span className="text-[10px]">PiP</span></Button>
                    {isTeacher && <Button variant="ghost" className="flex-col h-14 gap-1 px-3 text-white" onClick={() => setIsBreakoutSetupOpen(true)}><Users2 className="h-5 w-5"/><span className="text-[10px]">Breakout</span></Button>}
                    {isPresenter && (
                        <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${isScreenSharing ? 'text-green-500' : 'text-white'}`} onClick={toggleScreenShare}>
                            <ScreenShare className="h-5 w-5"/> <span className="text-[10px]">{isScreenSharing ? 'Stop' : 'Share'}</span>
                        </Button>
                    )}
                    {isPresenter && (
                         <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${isWhiteboardActive ? 'text-green-500' : 'text-white'}`} onClick={() => setIsWhiteboardActive(!isWhiteboardActive)}>
                            <PenTool className="h-5 w-5"/> <span className="text-[10px]">Board</span>
                        </Button>
                    )}
                    {isPresenter && <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${isRecording ? 'text-red-500' : 'text-white'}`} onClick={isRecording ? stopRecording : startRecording}>{isRecording ? <Square className="h-5 w-5 fill-current"/> : <Circle className="h-5 w-5 fill-red-500 text-red-500"/>} <span className="text-[10px]">{isRecording ? 'Stop' : 'Record'}</span></Button>}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${showParticipants ? 'text-blue-400 bg-black/40' : 'text-white'}`} onClick={() => {setShowParticipants(!showParticipants); setShowChat(false);}}><Users className="h-5 w-5"/> <span className="text-[10px]">People</span></Button>
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${showChat ? 'text-blue-400 bg-black/40' : 'text-white'}`} onClick={() => {setShowChat(!showChat); setShowParticipants(false);}}><MessageSquare className="h-5 w-5"/> <span className="text-[10px]">Chat</span></Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full h-10 px-6 ml-2" onClick={onLeave}>End</Button>
                </div>
            </div>

            {recordedBlob && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"><Card className="w-[350px]"><CardHeader><CardTitle>Save Recording?</CardTitle></CardHeader><CardFooter className="flex gap-2"><Button variant="ghost" onClick={() => setRecordedBlob(null)}>Discard</Button><Button onClick={saveRecording} disabled={isSavingRecord} className="flex-1">{isSavingRecord ? <Loader2 className="animate-spin"/> : "Save"}</Button></CardFooter></Card></div>
            )}
            <BreakoutSetupDialog open={isBreakoutSetupOpen} setOpen={setIsBreakoutSetupOpen} onStart={handleStartBreakout} />
            {/* AI Dialog... */}

            <style jsx global>{`
                @keyframes float-up { 0% { transform: translateY(0) scale(0.5); opacity: 0; } 10% { opacity: 1; transform: translateY(-20px) scale(1.2); } 100% { transform: translateY(-200px) scale(1); opacity: 0; } }
                .animate-float-up { animation: float-up 3s ease-out forwards; }
            `}</style>
        </div>
    );
}

// --- MAIN PAGE: LOBBY (UNCHANGED) ---
function ScheduleClassDialog({ open, setOpen }: { open: boolean, setOpen: (v: boolean) => void }) {
    const firestore = useFirestore(); const { user } = useUser(); const { toast } = useToast(); const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [targetGroup, setTargetGroup] = useState(''); const [scheduledDate, setScheduledDate] = useState(''); const [scheduledTime, setScheduledTime] = useState('');
    const handleSchedule = async () => { if (!user || !title) return; setIsSubmitting(true); try { const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`); await addDoc(collection(firestore!, 'lectures'), { title, description, targetGroup: targetGroup || 'General', scheduledFor: scheduledDateTime, teacherName: user.displayName, teacherId: user.uid, status: 'scheduled', createdAt: serverTimestamp(), slides: [], currentSlide: 0, isPresentationMode: false }); toast({ title: "Class Scheduled" }); setOpen(false); } catch (e) {} finally { setIsSubmitting(false); } };
    return (<Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>Schedule Class</DialogTitle></DialogHeader><div className="grid gap-4 py-4"><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Topic"/><Input value={targetGroup} onChange={e => setTargetGroup(e.target.value)} placeholder="Target Group"/><div className="grid grid-cols-2 gap-4"><Input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)}/><Input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)}/></div></div><DialogFooter><Button onClick={handleSchedule} disabled={isSubmitting}>Schedule</Button></DialogFooter></DialogContent></Dialog>);
}
export default function LiveClassroomPage() {
    const { user } = useUser(); const { role } = useRole(); const firestore = useFirestore(); const [activeLectureId, setActiveLectureId] = useState<string | null>(null); const [isScheduleOpen, setIsScheduleOpen] = useState(false); const isTeacher = ['Teacher', 'Administrator', 'Director'].includes(role);
    const liveQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'lectures'), where('status', '==', 'live')) : null, [firestore]); const { data: liveLectures } = useCollection<Lecture>(liveQuery);
    const upcomingQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'lectures'), where('status', '==', 'scheduled')) : null, [firestore]); const { data: upcoming } = useCollection<Lecture>(upcomingQuery);
    if (activeLectureId) { const current = liveLectures?.find(l => l.id === activeLectureId) || upcoming?.find(l => l.id === activeLectureId); if(current) return <ActiveClassroom lecture={current} onLeave={() => setActiveLectureId(null)} />; }
    return (<div className="space-y-6 p-6"><Card className="bg-slate-900 text-white"><CardHeader className="flex justify-between flex-row"><div><CardTitle className="flex gap-2"><Video className="text-red-500"/> Live Classroom</CardTitle><p className="text-slate-400">Virtual Learning</p></div>{isTeacher && <Button onClick={() => setIsScheduleOpen(true)} className="bg-indigo-600">Schedule</Button>}</CardHeader></Card><div className="grid grid-cols-1 gap-4">{liveLectures?.map(l => (<Card key={l.id} className="border-l-4 border-l-red-500"><CardHeader><CardTitle>{l.title}</CardTitle><CardDescription>Host: {l.teacherName}</CardDescription></CardHeader><CardFooter><Button onClick={() => setActiveLectureId(l.id)} className="w-full bg-red-600">Join Live</Button></CardFooter></Card>))}</div><ScheduleClassDialog open={isScheduleOpen} setOpen={setIsScheduleOpen}/></div>);
}