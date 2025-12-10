
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, where, onSnapshot } from 'firebase/firestore';
import { Video, Users, Send, MessageSquare, BookOpen, Calendar } from 'lucide-react';
import { format } from 'date-fns';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Class } from '@/lib/types';

// IMPORT THE VIDEO ENGINE WE JUST BUILT
import LiveRoom from '@/components/dashboard/live-classroom/live-room';

// --- SUB-COMPONENT: Chat Window ---
function ChatWindow({ roomId }: { roomId: string }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // 1. Listen to Messages for this specific Room
    const messagesQuery = useMemoFirebase(
        () => firestore ? query(collection(firestore, 'active_classes', roomId, 'messages'), orderBy('createdAt', 'asc')) : null,
        [firestore, roomId]
    );
    const { data: messages, isLoading } = useCollection<any>(messagesQuery);

    // Auto-scroll to bottom
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
                    {messages?.map((msg) => {
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

// --- MAIN PAGE ---
export default function LiveClassroomPage() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isLive, setIsLive] = useState(false);

  const isTeacher = role === 'Teacher' || role === 'Administrator' || role === 'Director';

  // 1. Fetch User's Classes
  const classesQuery = useMemoFirebase(() => {
      if (!firestore || !user) return null;
      if (isTeacher) {
          // Teachers see all classes (or filter by teacherId if you prefer)
          return query(collection(firestore, 'classes'));
      } else {
          // Students see their assigned class
          // Note: In a real app, fetch student profile first to get classId. 
          // For now, we fetch all classes for simplicity in this demo:
          return query(collection(firestore, 'classes'));
      }
  }, [firestore, user, isTeacher]);

  const { data: classes, isLoading: classesLoading } = useCollection<any>(classesQuery);

  const handleJoin = (cls: Class) => {
      setSelectedClass(cls);
      // In a real app, you might check if a meeting exists in DB first
      setIsLive(true); 
  };

  const handleLeave = () => {
      setIsLive(false);
      setSelectedClass(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-4">
        
        {/* HEADER */}
        {!isLive && (
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Video className="h-8 w-8"/> Live Classroom
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                        {isTeacher 
                            ? "Select a class from the list below to start a live session." 
                            : "Join your scheduled classes for live lectures."}
                    </CardDescription>
                </CardHeader>
            </Card>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex flex-1 gap-4 overflow-hidden">
            
            {/* LEFT SIDEBAR: CLASS LIST (Hidden if live to save space, or keep it if you want) */}
            {!isLive && (
                <Card className="w-full md:w-1/3 lg:w-1/4 flex flex-col h-full">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-slate-500"/> Your Classes
                        </CardTitle>
                    </CardHeader>
                    <ScrollArea className="flex-1 px-4">
                        <div className="space-y-3 pb-4">
                            {classesLoading && <Skeleton className="h-20 w-full"/>}
                            {classes?.map((cls) => (
                                <div 
                                    key={cls.id} 
                                    className="p-4 rounded-lg border hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group"
                                    onClick={() => setSelectedClass(cls)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-700 group-hover:text-blue-700">{cls.name}</h3>
                                        <Badge variant="outline" className="bg-white">{cls.subject || 'General'}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3"/>
                                        <span>Next: Today, 10:00 AM</span>
                                    </div>
                                    {selectedClass?.id === cls.id && (
                                        <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700" onClick={() => handleJoin(cls)}>
                                            {isTeacher ? "Start Class" : "Join Class"}
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>
            )}

            {/* RIGHT SIDE: STAGE */}
            <div className="flex-1 flex flex-col h-full min-h-0">
                {isLive && selectedClass ? (
                    <div className="flex flex-col lg:flex-row h-full gap-4">
                        
                        {/* 1. VIDEO AREA (Takes up most space) */}
                        <div className="flex-1 flex flex-col gap-2">
                            <div className="flex justify-between items-center bg-white p-3 rounded-lg border shadow-sm">
                                <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"/>
                                    {selectedClass.name} <span className="text-slate-400 font-normal">| Live Session</span>
                                </h2>
                                <Button variant="outline" size="sm" onClick={handleLeave} className="text-red-600 hover:bg-red-50 border-red-200">
                                    Leave Class
                                </Button>
                            </div>

                            {/* THE VIDEO ENGINE */}
                            <LiveRoom 
                                roomId={selectedClass.id} 
                                isHost={isTeacher} 
                            />
                        </div>

                        {/* 2. CHAT AREA (Sidebar on large screens) */}
                        <div className="w-full lg:w-80 h-1/3 lg:h-full">
                            <ChatWindow roomId={selectedClass.id} />
                        </div>

                    </div>
                ) : (
                    /* EMPTY STATE (When no class selected) */
                    <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50 border-2 border-dashed rounded-xl m-4">
                        <div className="text-center text-slate-400">
                            <Users className="h-16 w-16 mx-auto mb-4 opacity-50"/>
                            <p className="text-lg font-medium">Select a class to enter the classroom</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
