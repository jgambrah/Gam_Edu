
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
  LayoutGrid, Maximize, Circle, Square, Save, Users, Mic2, Hand, Smile, X, MoreHorizontal, PhoneOff,
  Subtitles, PictureInPicture, Users2, Timer, PenTool, Eraser, Download, Trash2
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


    // Other handlers
    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            // Stop Sharing -> Revert to Webcam
            try {
                const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                // Stop the previous screen tracks before setting the new stream
                stream?.getTracks().forEach(t => t.stop());
                setStream(camStream);
                setIsScreenSharing(false);
            } catch (e) {
                console.error("Error reverting to camera:", e);
                toast({ variant: 'destructive', title: "Camera Error", description: "Could not revert to webcam." });
            }
        } else {
            // Start Sharing
            try {
                // @ts-ignore
                const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                displayStream.getVideoTracks()[0].onended = () => {
                    toggleScreenShare(); // Revert back when browser "Stop" is clicked
                };
                // Stop old camera tracks before starting new ones
                stream?.getTracks().forEach(t => t.stop());
                setStream(displayStream);
                setIsScreenSharing(true);
            } catch (err: any) {
                if (err.name === 'NotAllowedError') {
                    const message = err.message.includes("by user") ? "You cancelled the screen share request." : "Permission to share screen was denied by your browser or OS.";
                    toast({ variant: "destructive", title: "Permission Denied", description: message });
                } else {
                    toast({ variant: "destructive", title: "Screen Share Failed", description: "Could not start screen sharing." });
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
    const handleSend = async () => {
        if(!msgText.trim() || !user) return;
        await addDoc(collection(firestore!, 'lectures', lecture.id, 'messages'), { text: msgText, senderName: user.displayName, senderId: user.uid, createdAt: serverTimestamp() });
        setMsgText('');
    };
    const toggleCamera = () => { if (stream) { const track = stream.getVideoTracks()[0]; if(track) { track.enabled = !track.enabled; setIsCameraOn(track.enabled); } } };
    const toggleMic = () => { if (stream) { const track = stream.getAudioTracks()[0]; if(track) { track.enabled = !track.enabled; setIsMicOn(track.enabled); } } };
    const startRecording = () => {
        if (!stream) return;
        chunksRef.current = [];
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
        recorder.onstop = () => { setRecordedBlob(new Blob(chunksRef.current, { type: 'video/webm' })); };
        recorder.start(); setIsRecording(true); mediaRecorderRef.current = recorder;
    };
    const stopRecording = () => { if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.stop(); setIsRecording(false); } };
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
                uploadedBy: user.uid, createdAt: serverTimestamp(), type: 'Video', resources: [{ id: Date.now().toString(), title: 'Watch Session', type: 'Video', url: downloadUrl }]
            });
            toast({ title: "Saved to Library!" }); setRecordedBlob(null);
        } catch (e: any) { toast({ variant: 'destructive', title: "Error", description: e.message }); }
        finally { setIsSavingRecord(false); }
    };
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
                    <Popover><PopoverTrigger asChild><Button variant="ghost" className="flex-col h-14 gap-1 px-3 text-white hover:bg-white/10"><Smile className="h-5 w-5"/> <span className="text-[10px]">React</span></Button></PopoverTrigger><PopoverContent className="w-auto p-2 bg-[#2C2C2E] border-none flex gap-2">{['👍','❤️','😂','😮','👋','🎉'].map(e => (<button key={e} onClick={() => sendReaction(e)} className="text-2xl hover:scale-125 p-1">{e}</button>))}</PopoverContent></Popover>
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${captionsOn ? 'text-green-400' : 'text-white'} hover:bg-white/10`} onClick={toggleCaptions}><Subtitles className="h-5 w-5"/><span className="text-[10px]">CC</span></Button>
                    <Button variant="ghost" className="flex-col h-14 gap-1 px-3 text-white hover:bg-white/10" onClick={togglePiP}><PictureInPicture className="h-5 w-5"/><span className="text-[10px]">PiP</span></Button>
                    {isTeacher && <Button variant="ghost" className="flex-col h-14 gap-1 px-3 text-white hover:bg-white/10" onClick={() => setIsBreakoutSetupOpen(true)}><Users2 className="h-5 w-5"/><span className="text-[10px]">Breakout</span></Button>}
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
                    {isPresenter && <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${isRecording ? 'text-red-500' : 'text-white'} hover:bg-white/10`} onClick={isRecording ? stopRecording : startRecording}>{isRecording ? <Square className="h-5 w-5 fill-current"/> : <Circle className="h-5 w-5 fill-red-500 text-red-500"/>} <span className="text-[10px]">{isRecording ? 'Stop' : 'Record'}</span></Button>}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${showParticipants ? 'text-blue-400 bg-black/40' : 'text-white'} hover:bg-white/10`} onClick={() => {setShowParticipants(!showParticipants); setShowChat(false);}}><Users className="h-5 w-5"/> <span className="text-[10px]">People</span></Button>
                    <Button variant="ghost" className={`flex-col h-14 gap-1 px-3 ${showChat ? 'text-blue-400 bg-black/40' : 'text-white'} hover:bg-white/10`} onClick={() => {setShowChat(!showChat); setShowParticipants(false);}}><MessageSquare className="h-5 w-5"/> <span className="text-[10px]">Chat</span></Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full h-10 px-6 ml-2" onClick={onLeave}>End</Button>
                </div>
            </div>

            {recordedBlob && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50"><Card className="w-[350px] border-slate-700 bg-slate-900 text-white shadow-2xl"><CardHeader><CardTitle>Save Recording?</CardTitle></CardHeader><CardFooter className="flex justify-between gap-2"><Button variant="ghost" onClick={() => setRecordedBlob(null)}>Discard</Button><Button onClick={saveRecording} disabled={isSavingRecord} className="bg-emerald-600 flex-1">{isSavingRecord ? <Loader2 className="animate-spin"/> : "Save"}</Button></CardFooter></Card></div>
            )}
            <BreakoutSetupDialog open={isBreakoutSetupOpen} setOpen={setIsBreakoutSetupOpen} onStart={handleStartBreakout} />
            <Dialog open={isAiOpen} onOpenChange={(v) => { setIsAiOpen(v); setAiResponse(null); }}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{isTeacher ? "Teacher Co-Pilot" : "AI Assistant"}</DialogTitle></DialogHeader>
                    {!aiResponse ? (
                        <div className="space-y-4">
                            <Input value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Topic..."/>
                            <Button className="w-full" onClick={isTeacher ? handleGeneratePoll : handleExplainConcept} disabled={isProcessingAi}>
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
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    
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
    
    // Client-side Sort
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
        // Try to find in live first, then upcoming (in case it just switched)
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

                {/* LIVE TAB */}
                <TabsContent value="live" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {liveLectures?.length === 0 && <p className="text-muted-foreground col-span-full text-center py-8">No live classes at the moment.</p>}
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

                {/* UPCOMING TAB */}
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


    