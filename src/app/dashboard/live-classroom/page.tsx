'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, where, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getApp } from 'firebase/app';
import { 
  Video, Mic, MicOff, VideoOff, MessageSquare, Send, 
  Users, Sparkles, Hand, LayoutGrid, MonitorPlay, Bot, 
  Calendar as CalendarIcon, Clock, Upload, ChevronLeft, ChevronRight, Presentation, ScreenShare,
  Maximize, Circle, Square, Download, Save 
} from 'lucide-react';
import { generateLivePollAction, explainConceptAction } from '@/ai/flows/live-classroom';
import { format } from 'date-fns';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Class, Student } from '@/lib/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// --- TYPES ---
type Lecture = {
    id: string;
    title: string;
    description?: string;
    classId?: string; 
    className?: string; 
    scheduledFor?: any; 
    teacherName: string;
    teacherId: string;
    status: 'scheduled' | 'live' | 'ended';
    createdAt: any;
    
    // Slide Features
    slides?: string[]; // Array of Image URLs
    currentSlide?: number; // Index of active slide
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

// --- SUB-COMPONENT: Audio Visualizer (The "Vibrating" Mic) ---
const MicVisualizer = ({ stream }: { stream: MediaStream | null }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        if (!stream || !canvasRef.current) return;

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext("2d");

        const draw = () => {
            if(!canvasCtx) return;
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw bars
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                
                // Color based on volume intensity
                const g = barHeight + (25 * (i / bufferLength));
                canvasCtx.fillStyle = `rgb(50, ${g + 100}, 50)`;
                
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        };

        draw();

        return () => {
            if(animationRef.current) cancelAnimationFrame(animationRef.current);
            audioContext.close();
        };
    }, [stream]);

    return <canvas ref={canvasRef} width="60" height="30" className="opacity-80" />;
};

// --- COMPONENT: Schedule Class Dialog ---
function ScheduleClassDialog({ open, setOpen, classes }: { open: boolean, setOpen: (v: boolean) => void, classes: Class[] }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetClassId, setTargetClassId] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');

    const handleSchedule = async () => {
        if (!user || !title || !scheduledDate || !scheduledTime || !targetClassId) {
            toast({ variant: 'destructive', title: "Missing Fields", description: "Please fill in all required fields." });
            return;
        }

        setIsSubmitting(true);
        try {
            const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
            const selectedClass = classes.find(c => c.id === targetClassId);

            await addDoc(collection(firestore!, 'lectures'), {
                title,
                description,
                classId: targetClassId,
                className: selectedClass?.name || 'Unknown Class',
                scheduledFor: scheduledDateTime,
                teacherName: user.displayName || user.email?.split('@')[0],
                teacherId: user.uid,
                status: 'scheduled',
                createdAt: serverTimestamp(),
                slides: [],
                currentSlide: 0,
                isPresentationMode: false
            });

            toast({ title: "Class Scheduled", description: "Your lecture has been added to the calendar." });
            setOpen(false);
            setTitle(''); setDescription(''); setTargetClassId('');
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
                    <DialogTitle>Schedule a Class</DialogTitle>
                    <DialogDescription>Set up a future live session for your students.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label>Topic / Title *</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Intro to Algebra" />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What will be covered?" />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label>Target Class *</Label>
                            <Select onValueChange={setTargetClassId}>
                                <SelectTrigger><SelectValue placeholder="Select a class"/></SelectTrigger>
                                <SelectContent>
                                    {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date *</Label>
                            <Input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Time *</Label>
                            <Input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSchedule} disabled={isSubmitting} className="w-full">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CalendarIcon className="mr-2 h-4 w-4"/>}
                        Schedule Class
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
    
    // AI Tools State
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [aiInput, setAiInput] = useState('');
    const [aiResponse, setAiResponse] = useState<any>(null);
    const [isProcessingAi, setIsProcessingAi] = useState(false);

    // Media & Slide State
    const [isUploadingSlides, setIsUploadingSlides] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [permissionError, setPermissionError] = useState(false);

    // Layout & Recording State
    const [layoutMode, setLayoutMode] = useState<'focus' | 'grid'>('focus');
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [isSavingRecord, setIsSavingRecord] = useState(false);

    const isTeacher = role === 'Teacher' || role === 'Administrator' || role === 'Director';
    const isPresenter = user?.uid === lecture.teacherId; 

    // 1. Initialize Camera
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
                } catch (err) {
                    console.error("Error accessing media:", err);
                    setPermissionError(true);
                }
            }
        };
        startStream();
        return () => { if (localStream) localStream.getTracks().forEach(track => track.stop()); };
    }, [isPresenter]);

    // 2. Recording Logic
    const startRecording = () => {
        if (!stream) return;
        chunksRef.current = [];
        // Combine video and screen if possible, for now just stream
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            setRecordedBlob(blob);
        };

        recorder.start();
        setIsRecording(true);
        mediaRecorderRef.current = recorder;
        toast({ title: "Recording Started", description: "Session is being recorded." });
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            toast({ title: "Recording Stopped", description: "You can now save the video." });
        }
    };

    const saveRecordingToLibrary = async () => {
        if (!recordedBlob || !firestore || !user) return;
        setIsSavingRecord(true);
        try {
            const app = getApp();
            const storage = getStorage(app, "gs://studio-525105839-159e4.firebasestorage.app");
            const filename = `recordings/${lecture.id}_${Date.now()}.webm`;
            const storageRef = ref(storage, filename);
            
            await uploadBytes(storageRef, recordedBlob);
            const downloadUrl = await getDownloadURL(storageRef);

            // Add to Learning Materials
            await addDoc(collection(firestore, 'learning_materials'), {
                topicTitle: `Recording: ${lecture.title}`,
                description: `Live session recording from ${new Date().toLocaleDateString()}`,
                classId: 'global', // Or match lecture targetGroup
                subject: 'Live Recordings',
                uploadedBy: user.uid,
                createdAt: serverTimestamp(),
                videoLinks: [{
                    title: 'Watch Session',
                    url: downloadUrl
                }],
                attachments: [],
                practiceQuestions: [],
            });

            toast({ title: "Saved to Library!", description: "Students can now watch this recording." });
            setRecordedBlob(null); // Clear buffer
        } catch (error: any) {
            toast({ variant: 'destructive', title: "Save Failed", description: error.message });
        } finally {
            setIsSavingRecord(false);
        }
    };

    // Chat Query
    const chatQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'lectures', lecture.id, 'messages'), orderBy('createdAt', 'asc')) : null, 
    [firestore, lecture.id]);
    const { data: messages } = useCollection<ChatMessage>(chatQuery);
    useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

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

    const toggleCamera = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) { videoTrack.enabled = !videoTrack.enabled; setIsCameraOn(videoTrack.enabled); }
        }
    };

    const toggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) { audioTrack.enabled = !audioTrack.enabled; setIsMicOn(audioTrack.enabled); }
        }
    };

    const handleUploadSlides = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setIsUploadingSlides(true);
        try {
            const app = getApp();
            const storage = getStorage(app, "gs://studio-525105839-159e4.firebasestorage.app");
            const uploadedUrls: string[] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                const storageRef = ref(storage, `lectures/${lecture.id}/slides/${Date.now()}_${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                uploadedUrls.push(url);
            }
            const lectureRef = doc(firestore!, 'lectures', lecture.id);
            await updateDoc(lectureRef, { slides: uploadedUrls, currentSlide: 0, isPresentationMode: true });
            toast({ title: "Slides Uploaded" });
        } catch (error: any) { toast({ variant: 'destructive', title: "Upload Failed", description: error.message }); } 
        finally { setIsUploadingSlides(false); }
    };

    const changeSlide = async (direction: 'next' | 'prev') => {
        if (!lecture.slides) return;
        const total = lecture.slides.length;
        const current = lecture.currentSlide || 0;
        let nextIndex = current;
        if (direction === 'next' && current < total - 1) nextIndex++;
        if (direction === 'prev' && current > 0) nextIndex--;
        if (nextIndex !== current) { await updateDoc(doc(firestore!, 'lectures', lecture.id), { currentSlide: nextIndex }); }
    };

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-100px)]">
            {/* LEFT: STAGE */}
            <div className="lg:col-span-2 flex flex-col gap-4">
                <Card className="flex-1 bg-black relative overflow-hidden flex flex-col items-center justify-center p-0 border-0">
                    
                    {/* LAYOUT MODE: GRID (Seeing Students) */}
                    {layoutMode === 'grid' && (
                        <div className="absolute inset-0 bg-slate-900 grid grid-cols-3 gap-2 p-4 z-10 overflow-y-auto">
                            {/* Teacher (Self) */}
                            <div className="bg-slate-800 rounded border border-slate-700 aspect-video flex items-center justify-center relative">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                                <span className="absolute bottom-1 left-2 text-xs text-white bg-black/50 px-1 rounded">You (Teacher)</span>
                            </div>
                            {/* Placeholder for Students (Since we don't have WebRTC Peer connections yet) */}
                            {[1,2,3,4,5].map(i => (
                                <div key={i} className="bg-slate-800 rounded border border-slate-700 aspect-video flex items-center justify-center relative">
                                    <Users className="h-8 w-8 text-slate-600"/>
                                    <span className="absolute bottom-1 left-2 text-xs text-white bg-black/50 px-1 rounded">Student {i}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* LAYOUT MODE: FOCUS (Slides/Stage) */}
                    {layoutMode === 'focus' && (
                        lecture.isPresentationMode && lecture.slides && lecture.slides.length > 0 ? (
                            <div className="relative w-full h-full bg-black flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={lecture.slides[lecture.currentSlide || 0]} alt="Slide" className="max-w-full max-h-full object-contain" />
                                {isPresenter && stream && isCameraOn && (
                                    <div className="absolute top-4 right-4 w-40 h-28 bg-black border border-slate-700 rounded-lg overflow-hidden shadow-lg z-30">
                                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                                    </div>
                                )}
                                {isPresenter && (
                                    <div className="absolute bottom-20 flex gap-4 bg-slate-900/80 p-2 rounded-lg backdrop-blur-sm border border-slate-700 z-20">
                                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => changeSlide('prev')} disabled={(lecture.currentSlide || 0) <= 0}><ChevronLeft/></Button>
                                        <span className="text-white font-mono flex items-center px-2">{(lecture.currentSlide || 0) + 1} / {lecture.slides.length}</span>
                                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => changeSlide('next')} disabled={(lecture.currentSlide || 0) >= lecture.slides.length - 1}><ChevronRight/></Button>
                                        <Button variant="destructive" size="sm" onClick={() => updateDoc(doc(firestore!, 'lectures', lecture.id), { isPresentationMode: false })}>Stop Sharing</Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-full relative">
                                {isPresenter ? (
                                    permissionError ? <div className="flex flex-col items-center justify-center h-full text-slate-500"><VideoOff className="h-16 w-16 mb-4"/><p>Camera access denied.</p></div> : 
                                    <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover transform -scale-x-100 ${!isCameraOn ? 'hidden' : ''}`} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                                        <MonitorPlay className="h-16 w-16 mb-4 opacity-50"/>
                                        <h3 className="text-xl font-semibold text-white">Live Stream Active</h3>
                                        <p className="text-sm">Instructor: {lecture.teacherName}</p>
                                    </div>
                                )}
                                {isPresenter && !isCameraOn && !permissionError && <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-500"><VideoOff className="h-16 w-16 mb-4"/><p>Camera is off</p></div>}
                                {isPresenter && !lecture.isPresentationMode && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                         <Button variant="outline" className="bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white backdrop-blur-sm" onClick={() => fileInputRef.current?.click()}>
                                            {isUploadingSlides ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Presentation className="mr-2 h-4 w-4"/>} Share Slides
                                        </Button>
                                        <input type="file" hidden multiple accept="image/*" ref={fileInputRef} onChange={handleUploadSlides} />
                                    </div>
                                )}
                            </div>
                        )
                    )}
                    
                    {/* CONTROLS OVERLAY */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-slate-900/90 p-2 rounded-full backdrop-blur-sm z-40 border border-slate-700">
                        {/* MIC & VISUALIZER */}
                        <div className="flex items-center gap-2 border-r border-slate-700 pr-2">
                            <Button variant="ghost" size="icon" className={`${isMicOn ? 'text-white' : 'text-red-500'} hover:bg-white/10`} onClick={toggleMic} disabled={!stream}>
                                {isMicOn ? <Mic className="h-5 w-5"/> : <MicOff className="h-5 w-5"/>}
                            </Button>
                            {/* NEW: Audio Visualizer */}
                            <MicVisualizer stream={isMicOn ? stream : null} />
                        </div>
                        
                        {/* CAMERA */}
                        <Button variant="ghost" size="icon" className={`${isCameraOn ? 'text-white' : 'text-red-500'} hover:bg-white/10`} onClick={toggleCamera} disabled={!stream}>
                            {isCameraOn ? <Video className="h-5 w-5"/> : <VideoOff className="h-5 w-5"/>}
                        </Button>

                        {/* RECORDING (Teacher) */}
                        {isPresenter && (
                             <Button variant="ghost" size="icon" className={`${isRecording ? 'text-red-500 animate-pulse' : 'text-white'} hover:bg-white/10`} onClick={isRecording ? stopRecording : startRecording}>
                                {isRecording ? <Square className="h-5 w-5 fill-current"/> : <Circle className="h-5 w-5 fill-red-500 text-red-500"/>}
                             </Button>
                        )}

                        {/* GRID TOGGLE */}
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setLayoutMode(layoutMode === 'focus' ? 'grid' : 'focus')}>
                             {layoutMode === 'focus' ? <LayoutGrid className="h-5 w-5"/> : <Maximize className="h-5 w-5"/>}
                        </Button>

                        {/* LEAVE */}
                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-900/20" onClick={onLeave}>Leave</Button>
                    </div>

                    {/* RECORDING SAVE DIALOG (Overlay) */}
                    {recordedBlob && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                            <Card className="w-[300px] border-slate-700 bg-slate-900 text-white">
                                <CardHeader><CardTitle>Recording Stopped</CardTitle><CardDescription className="text-slate-400">Save this session?</CardDescription></CardHeader>
                                <CardFooter className="flex justify-between">
                                    <Button variant="ghost" onClick={() => setRecordedBlob(null)}>Discard</Button>
                                    <Button onClick={saveRecordingToLibrary} disabled={isSavingRecord} className="bg-green-600 hover:bg-green-700">
                                        {isSavingRecord ? <Loader2 className="animate-spin"/> : <Save className="mr-2 h-4 w-4"/>} Save
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    )}
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

            {/* RIGHT: CHAT (Same as before) */}
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
                                        <div className="space-y-2">
                                            <p className="font-bold text-indigo-900">{msg.text}</p>
                                            <div className="grid grid-cols-1 gap-1">
                                                {msg.pollData.options.map((opt:string, i:number) => (
                                                    <Button key={i} variant="outline" size="sm" className="justify-start h-auto py-1 text-left text-xs bg-white">{opt}</Button>
                                                ))}
                                            </div>
                                        </div>
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

            {/* AI MODAL (Same as before) */}
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
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('live');

    const isTeacher = ['Teacher', 'Administrator', 'Director'].includes(role);
    
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(useMemoFirebase(() => collection(firestore, 'classes'), [firestore]));
    const { data: studentData, isLoading: isLoadingStudent } = useCollection<Student>(useMemoFirebase(() => (user && role === 'Student') ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [user, firestore, role]));
    const studentClassId = studentData?.[0]?.classId;
    
    const baseLecturesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        if (isTeacher) { 
            return collection(firestore, 'lectures');
        }
        if (role === 'Student' && studentClassId) { 
            return query(collection(firestore, 'lectures'), where('classId', '==', studentClassId));
        }
        return null; 
    }, [user, firestore, role, isTeacher, studentClassId]);

    const { data: lectures, isLoading: isLoadingLectures } = useCollection<Lecture>(baseLecturesQuery);

    const liveLectures = useMemo(() => lectures?.filter(l => l.status === 'live'), [lectures]);
    const upcomingLectures = useMemo(() => lectures?.filter(l => l.status === 'scheduled').sort((a,b) => a.scheduledFor.toDate() - b.scheduledFor.toDate()), [lectures]);


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

    if (isLoadingLectures || isLoadingClasses || isLoadingStudent) {
        return <div className="flex h-full w-full items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div>
    }

    if (activeLectureId) {
        const currentLecture = lectures?.find(l => l.id === activeLectureId);
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
                        <Button onClick={() => setIsScheduleOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={!classes || classes.length === 0}>
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
                                        <Badge variant="outline">{l.className || l.classId}</Badge>
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
                                            <span>{l.className || l.classId}</span>
                                        </div>
                                    </div>
                                </div>
                                {isTeacher && user?.uid === l.teacherId && l.status === 'scheduled' && (
                                    <Button onClick={() => handleStartScheduled(l.id)} size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                                        Start Now
                                    </Button>
                                )}
                                {role === 'Student' && <Button disabled variant="secondary" size="sm">Not Started</Button>}
                            </div>
                        ))}
                     </div>
                </TabsContent>
            </Tabs>

            {classes && <ScheduleClassDialog open={isScheduleOpen} setOpen={setIsScheduleOpen} classes={classes} />}
        </div>
    );
}
