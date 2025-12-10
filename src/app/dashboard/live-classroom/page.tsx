
'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { Video, Users, Send, MessageSquare, BookOpen, Calendar, RefreshCw, AlertCircle, Plus, Clock } from 'lucide-react';
import { format } from 'date-fns';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Class } from '@/lib/types';

// IMPORT THE VIDEO ENGINE WE JUST BUILT
import LiveRoom from '@/components/dashboard/live-classroom/live-room';

// --- SUB-COMPONENT: Chat Window ---
function ChatWindow({ roomId }: { roomId: string }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const messagesQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'active_classes', roomId, 'messages'), orderBy('createdAt', 'asc')) : null,
        [firestore, roomId]
    );
    const { data: messages, isLoading } = useCollection<any>(messagesQuery);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            await addDoc(collection(firestore, 'active_classes', roomId, 'messages'), {
                text: newMessage,
                senderName: user.displayName || user.email?.split('@')[0] || 'User',
                senderId: user.uid,
                createdAt: serverTimestamp()
            });
            setNewMessage('');
        } catch (error) {
            console.error("Chat error:", error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg border shadow-sm">
            <div className="p-3 border-b bg-slate-50 font-semibold text-slate-700 flex items-center gap-2">
                <MessageSquare className="h-4 w-4"/> Live Chat
            </div>
            
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {isLoading && <p className="text-xs text-muted-foreground text-center">Loading chat...</p>}
                    {!isLoading && messages?.length === 0 && (
                        <p className="text-xs text-slate-400 text-center italic mt-10">No messages yet. Say hello!</p>
                    )}
                    {messages?.map((msg: any) => {
                        const isMe = msg.senderId === user?.uid;
                        return (
                            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] rounded-lg p-2 text-sm ${isMe ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 px-1">
                                    {isMe ? 'You' : msg.senderName}
                                </span>
                            </div>
                        )
                    })}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <form onSubmit={handleSend} className="p-3 border-t flex gap-2">
                <Input 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type a message..." 
                    className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
}

// --- SUB-COMPONENT: Schedule Class Dialog ---
function ScheduleDialog({ open, setOpen, classes }: { open: boolean, setOpen: (o: boolean) => void, classes: Class[] | undefined }) {
    const firestore = useFirestore();
    const [selectedClassId, setSelectedClassId] = useState('');
    const [topic, setTopic] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSchedule = async () => {
        if (!selectedClassId || !topic || !date || !time) return;
        setLoading(true);
        try {
            // Update the class document with the next session info
            const classRef = doc(firestore, 'classes', selectedClassId);
            await updateDoc(classRef, {
                nextSession: {
                    topic,
                    dateTime: `${date}T${time}`,
                    isLive: false // Not live yet, just scheduled
                }
            });
            setOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Schedule Live Session</DialogTitle>
                    <DialogDescription>Set a time for your next class.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Select Class</Label>
                        <select 
                            className="w-full p-2 border rounded-md"
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                        >
                            <option value="">-- Choose Class --</option>
                            {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Topic</Label>
                        <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Algebra Review" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Time</Label>
                            <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
                        </div>
                    </div>
                    <Button onClick={handleSchedule} disabled={loading} className="w-full">
                        {loading ? "Scheduling..." : "Schedule Class"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- MAIN PAGE ---
export default function LiveClassroomPage() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const isTeacher = role === 'Teacher' || role === 'Administrator' || role === 'Director';

  // 1. Fetch User's Classes
  const classesQuery = useMemoFirebase(() => {
      if (!firestore || !user) return null;
      // In production, Teachers filter by teacherId, Students by enrollment
      return query(collection(firestore, 'classes'));
  }, [firestore, user]);

  const { data: classes, isLoading: classesLoading } = useCollection<Class>(classesQuery);

  const handleJoin = async (cls: Class) => {
      setSelectedClass(cls);
      setIsLive(true);
      
      // If Teacher starts, mark as Live in DB
      if (isTeacher && firestore) {
          try {
            await updateDoc(doc(firestore, 'classes', cls.id), {
                'nextSession.isLive': true
            });
          } catch(e) { console.log("Could not update status", e); }
      }
  };

  const handleLeave = async () => {
      // If Teacher leaves, mark as Not Live
      if (isTeacher && firestore && selectedClass) {
          try {
            await updateDoc(doc(firestore, 'classes', selectedClass.id), {
                'nextSession.isLive': false
            });
          } catch(e) { console.log("Could not update status", e); }
      }
      setIsLive(false);
      setSelectedClass(null);
      window.location.reload();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] gap-4 p-4">
        
        {/* HEADER */}
        {!isLive && (
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shrink-0">
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <Video className="h-8 w-8"/> Live Classroom
                        </CardTitle>
                        <CardDescription className="text-blue-100">
                            {isTeacher 
                                ? "Manage and conduct live sessions." 
                                : "Join your scheduled classes."}
                        </CardDescription>
                    </div>
                    {isTeacher && (
                        <Button onClick={() => setIsScheduleOpen(true)} variant="secondary" className="text-blue-700 font-bold">
                            <Plus className="mr-2 h-4 w-4"/> Schedule Class
                        </Button>
                    )}
                </CardHeader>
            </Card>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex flex-1 gap-4 overflow-hidden min-h-0">
            
            {/* LEFT SIDEBAR: CLASS LIST */}
            {!isLive && (
                <Card className="w-full md:w-1/3 lg:w-1/4 flex flex-col h-full">
                    <CardHeader className="pb-2 flex flex-row justify-between items-center">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-slate-500"/> Classes
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => window.location.reload()} title="Refresh List">
                            <RefreshCw className="h-4 w-4"/>
                        </Button>
                    </CardHeader>
                    <ScrollArea className="flex-1 px-4">
                        <div className="space-y-3 pb-4">
                            {classesLoading && (
                                <>
                                    <Skeleton className="h-20 w-full"/>
                                    <Skeleton className="h-20 w-full"/>
                                </>
                            )}
                            
                            {/* EMPTY STATE */}
                            {!classesLoading && (!classes || classes.length === 0) && (
                                <div className="text-center py-8 px-2 border-2 border-dashed rounded-lg">
                                    <AlertCircle className="mx-auto h-8 w-8 text-slate-300 mb-2"/>
                                    <p className="text-sm font-medium text-slate-500">No classes found.</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {isTeacher ? "Go to Academics to create a class." : "No classes assigned."}
                                    </p>
                                </div>
                            )}

                            {/* CLASS LIST */}
                            {classes?.map((cls: any) => {
                                const session = cls.nextSession || {};
                                const isSessionLive = session.isLive === true;
                                
                                return (
                                    <div 
                                        key={cls.id} 
                                        className={`p-4 rounded-lg border transition-all ${isSessionLive ? 'border-red-400 bg-red-50' : 'hover:border-blue-500 hover:bg-blue-50'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-700">{cls.name}</h3>
                                            {isSessionLive && <Badge className="bg-red-500 animate-pulse">LIVE NOW</Badge>}
                                        </div>
                                        
                                        {/* Scheduled Session Info */}
                                        <div className="text-xs text-muted-foreground mb-3 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-3 w-3"/>
                                                <span>{session.dateTime ? new Date(session.dateTime).toLocaleString() : 'No session scheduled'}</span>
                                            </div>
                                            {session.topic && <p className="font-medium text-slate-600">Topic: {session.topic}</p>}
                                        </div>

                                        {/* ACTION BUTTON (Always Visible Now) */}
                                        <Button 
                                            className={`w-full ${isSessionLive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`} 
                                            onClick={() => handleJoin(cls)}
                                        >
                                            {isSessionLive ? "Join Live Stream" : (isTeacher ? "Start Class" : "Enter Room")}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </Card>
            )}

            {/* RIGHT SIDE: STAGE (or Placeholder) */}
            <div className="flex-1 flex flex-col h-full min-h-0 bg-white rounded-lg border shadow-sm overflow-hidden">
                {isLive && selectedClass ? (
                    <div className="flex flex-col lg:flex-row h-full">
                        
                        {/* 1. VIDEO AREA */}
                        <div className="flex-1 flex flex-col p-2 bg-slate-900 overflow-hidden">
                            <div className="flex justify-between items-center bg-slate-800 p-2 rounded mb-2 text-white">
                                <h2 className="font-bold flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"/>
                                    {selectedClass.name}
                                </h2>
                                <Button variant="destructive" size="sm" onClick={handleLeave}>
                                    Leave Class
                                </Button>
                            </div>

                            {/* VIDEO ENGINE */}
                            <div className="flex-1 min-h-0">
                                <LiveRoom 
                                    roomId={selectedClass.id} 
                                    isHost={isTeacher} 
                                />
                            </div>
                        </div>

                        {/* 2. CHAT AREA */}
                        <div className="w-full lg:w-80 h-1/3 lg:h-full border-l">
                            <ChatWindow roomId={selectedClass.id} />
                        </div>

                    </div>
                ) : (
                    /* EMPTY STATE (When no class selected) */
                    <div className="flex flex-1 items-center justify-center bg-slate-50 m-4 rounded-xl border-2 border-dashed">
                        <div className="text-center text-slate-400">
                            <Video className="h-16 w-16 mx-auto mb-4 opacity-50"/>
                            <h3 className="text-xl font-bold text-slate-600">Welcome to the Classroom</h3>
                            <p className="text-md mt-2 max-w-md mx-auto">
                                {isTeacher 
                                    ? "Schedule a class using the button above, or click 'Start Class' on any card to begin immediately." 
                                    : "Check the list on the left for live sessions or upcoming classes."}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* MODAL */}
        <ScheduleDialog 
            open={isScheduleOpen} 
            setOpen={setIsScheduleOpen} 
            classes={classes} 
        />
    </div>
  );
}
