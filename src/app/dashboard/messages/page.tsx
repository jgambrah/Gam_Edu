'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, where, doc, updateDoc, limit, getDocs } from 'firebase/firestore';
import { 
  MessageCircle, Search, Send, Plus, User, MoreVertical, Phone, Video, Loader2, ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';

// --- TYPES ---
interface ChatMetadata {
    id: string;
    participants: string[];
    participantDetails: Record<string, { name: string, role: string, photoURL?: string }>;
    lastMessage: string;
    lastMessageTime: any;
    unreadCount: Record<string, number>;
    schoolId: string;
}

interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: any;
}

interface SearchUser {
    uid: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    photoURL?: string;
}

// --- SUB-COMPONENT: New Chat Dialog ---
function NewChatDialog({ open, setOpen, onStartChat, schoolId }: { open: boolean, setOpen: (o: boolean) => void, onStartChat: (uid: string, user: SearchUser) => void, schoolId: string }) {
    const firestore = useFirestore();
    const { role } = useRole();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchRole, setSearchRole] = useState<string>('staff');
    const [results, setResults] = useState<SearchUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Students can only start chats with staff. Staff can search everyone.
    const allowedRoles = role === 'Student' ? ['staff'] : ['students', 'staff'];

    const handleSearch = async () => {
        if (!firestore || !schoolId) return;
        setIsSearching(true);
        try {
            const collectionName = searchRole === 'staff' ? 'staff' : 'students';
            const q = query(collection(firestore, collectionName), where('schoolId', '==', schoolId), limit(50));
            const snap = await getDocs(q);
            const users = snap.docs.map(d => ({ ...d.data(), uid: d.id })) as SearchUser[];
            
            const filtered = users.filter(u => 
                (u.firstName + ' ' + u.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setResults(filtered);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader><DialogTitle className="text-xl font-bold">New Message</DialogTitle></DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="flex gap-2">
                        <Select value={searchRole} onValueChange={setSearchRole}>
                            <SelectTrigger className="w-[130px] rounded-xl border-2"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {allowedRoles.includes('staff') && <SelectItem value="staff">Staff</SelectItem>}
                                {allowedRoles.includes('students') && <SelectItem value="students">Student</SelectItem>}
                            </SelectContent>
                        </Select>
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Search by name..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-9 rounded-xl border-2"
                            />
                        </div>
                        <Button size="icon" onClick={handleSearch} disabled={isSearching} className="rounded-xl">
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin"/> : <Search className="h-4 w-4"/>}
                        </Button>
                    </div>

                    <ScrollArea className="h-[350px] border rounded-2xl bg-slate-50/50">
                        <div className="p-2 space-y-1">
                            {results.map(user => (
                                <button 
                                    key={user.uid} 
                                    onClick={() => onStartChat(user.uid, user)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-200"
                                >
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarImage src={user.photoURL} />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                                            {user.firstName[0]}{user.lastName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                        <p className="font-bold text-sm text-slate-800">{user.firstName} {user.lastName}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{user.role}</p>
                                    </div>
                                </button>
                            ))}
                            {!isSearching && results.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
                                    <User className="h-8 w-8 opacity-20"/>
                                    <p className="text-xs font-medium">Search for a member of your school</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}


// --- MAIN PAGE ---
export default function MessagesPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
    const { toast } = useToast();
    
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    // 1. Fetch active conversations for the user in this school
    const chatsQuery = useMemoFirebase(() => 
        (firestore && user && schoolId) ? query(
            collection(firestore, 'direct_messages'), 
            where('schoolId', '==', schoolId),
            where('participants', 'array-contains', user.uid),
            orderBy('lastMessageTime', 'desc')
        ) : null, 
    [firestore, user, schoolId]);

    const { data: chats, isLoading: chatsLoading } = useCollection<ChatMetadata>(chatsQuery);

    // 2. Fetch messages for the selected chat
    const messagesQuery = useMemoFirebase(() => 
        (firestore && selectedChatId) ? query(
            collection(firestore, `direct_messages/${selectedChatId}/messages`),
            orderBy('createdAt', 'asc')
        ) : null,
    [firestore, selectedChatId]);

    const { data: messages, isLoading: msgsLoading } = useCollection<Message>(messagesQuery);

    const scrollRef = useRef<HTMLDivElement>(null);
    
    // Auto-scroll to the bottom of the chat on new messages
    useEffect(() => {
        if(scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);


    // --- ACTION HANDLERS ---

    const handleSendMessage = async () => {
        if(!newMessage.trim() || !selectedChatId || !user || isSending) return;
        
        const text = newMessage;
        setNewMessage(''); 
        setIsSending(true);

        try {
            // 1. Add message to sub-collection
            await addDoc(collection(firestore!, `direct_messages/${selectedChatId}/messages`), {
                text,
                senderId: user.uid,
                createdAt: serverTimestamp()
            });

            // 2. Update parent conversation metadata for sorting and preview
            await updateDoc(doc(firestore!, 'direct_messages', selectedChatId), {
                lastMessage: text,
                lastMessageTime: serverTimestamp()
            });
        } catch (e: any) {
            console.error("Message Send Error:", e);
            toast({ variant: 'destructive', title: 'Send Failed', description: e.message });
        } finally {
            setIsSending(false);
        }
    };

    const startNewChat = async (targetUid: string, targetUser: SearchUser) => {
        if (!user || !firestore || !schoolId) return;
        
        // Check if we already have a conversation with this person
        const existing = chats?.find(c => c.participants.includes(targetUid));
        if (existing) {
            setSelectedChatId(existing.id);
            setIsNewChatOpen(false);
            return;
        }

        try {
            const myName = user.displayName || user.email?.split('@')[0] || 'Me';
            const targetName = `${targetUser.firstName} ${targetUser.lastName}`;
            
            const docRef = await addDoc(collection(firestore, 'direct_messages'), {
                participants: [user.uid, targetUid],
                participantDetails: {
                    [user.uid]: { name: myName, role: 'User', photoURL: user.photoURL || '' },
                    [targetUid]: { name: targetName, role: targetUser.role, photoURL: targetUser.photoURL || '' }
                },
                lastMessage: 'Chat started',
                lastMessageTime: serverTimestamp(),
                unreadCount: { [targetUid]: 0, [user.uid]: 0 },
                schoolId: schoolId,
            });
            
            setSelectedChatId(docRef.id);
            setIsNewChatOpen(false);
        } catch (e: any) {
            console.error("Error creating chat:", e);
            toast({ variant: 'destructive', title: 'Chat Error', description: 'Could not initialize conversation.' });
        }
    };

    const getOtherParticipant = (chat: ChatMetadata) => {
        if (!user) return { name: 'Unknown', role: '', photoURL: '' };
        const otherId = chat.participants.find(id => id !== user.uid);
        if (!otherId || !chat.participantDetails) return { name: 'Unknown', role: '', photoURL: '' };
        return chat.participantDetails[otherId] || { name: 'Unknown', role: '', photoURL: '' };
    };
    
    const isLoading = chatsLoading || isLoadingSchool;
    const activeChat = chats?.find(c => c.id === selectedChatId);
    const otherMember = activeChat ? getOtherParticipant(activeChat) : null;

    return (
        <div className="h-[calc(100vh-120px)] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 md:p-6">
            
            {/* CONVERSATION LIST */}
            <Card className={cn(
                "md:col-span-1 flex flex-col h-full overflow-hidden border-none shadow-xl rounded-[2rem]",
                selectedChatId && "hidden md:flex"
            )}>
                <div className="p-6 border-b flex justify-between items-center bg-white">
                    <div>
                        <h2 className="font-black text-2xl flex items-center gap-2 text-indigo-600 tracking-tighter">
                            Inbox
                        </h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Private Chats</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => setIsNewChatOpen(true)} disabled={!schoolId} className="rounded-full bg-slate-50 hover:bg-indigo-50">
                        <Plus className="h-5 w-5 text-indigo-600"/>
                    </Button>
                </div>
                
                <div className="p-4 border-b bg-white">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Filter chats..." className="pl-9 rounded-2xl bg-slate-50 border-none h-11" />
                    </div>
                </div>

                <ScrollArea className="flex-1 bg-white">
                    <div className="flex flex-col p-2 gap-1">
                        {isLoading && <div className="py-10 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-slate-300"/></div>}
                        {!isLoading && chats?.length === 0 && (
                            <div className="py-20 text-center text-muted-foreground px-6">
                                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                <p className="text-sm font-medium">No messages yet.</p>
                                <Button variant="link" onClick={() => setIsNewChatOpen(true)} disabled={!schoolId} className="text-indigo-600">Start a conversation</Button>
                            </div>
                        )}
                        {chats?.map(chat => {
                            const other = getOtherParticipant(chat);
                            const isActive = selectedChatId === chat.id;
                            return (
                                <button 
                                    key={chat.id}
                                    onClick={() => setSelectedChatId(chat.id)}
                                    className={cn(
                                        "flex items-center gap-3 p-4 rounded-2xl transition-all text-left border-2",
                                        isActive 
                                            ? "bg-indigo-50 border-indigo-100 shadow-sm" 
                                            : "bg-white border-transparent hover:bg-slate-50"
                                    )}
                                >
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                        <AvatarImage src={other.photoURL} />
                                        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{other.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-bold text-sm truncate text-slate-800">{other.name}</span>
                                            {chat.lastMessageTime && (
                                                <span className="text-[10px] font-bold text-slate-400">
                                                    {format(chat.lastMessageTime?.toDate(), 'HH:mm')}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 truncate mt-0.5">{chat.lastMessage}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </ScrollArea>
            </Card>

            {/* CHAT WINDOW */}
            <Card className={cn(
                "md:col-span-2 lg:col-span-3 flex flex-col h-full border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white",
                !selectedChatId && "hidden md:flex"
            )}>
                {selectedChatId && otherMember ? (
                    <>
                        <div className="p-5 border-b bg-white flex justify-between items-center z-10 shadow-sm">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" className="md:hidden rounded-full" onClick={() => setSelectedChatId(null)}>
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <Avatar className="h-11 w-11 border-2 border-slate-100 shadow-sm">
                                    <AvatarImage src={otherMember.photoURL} />
                                    <AvatarFallback className="bg-green-100 text-green-700 font-bold">
                                        {otherMember.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-black text-lg text-slate-800 tracking-tight leading-none mb-1">{otherMember.name}</h3>
                                    <Badge variant="outline" className="text-[10px] h-5 uppercase tracking-tighter border-slate-200">{otherMember.role}</Badge>
                                </div>
                            </div>
                            <div className="hidden sm:flex gap-2 text-slate-400">
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600"><Phone className="h-5 w-5"/></Button>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 hover:text-blue-600"><Video className="h-5 w-5"/></Button>
                                <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="h-5 w-5"/></Button>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-50/30 p-4 overflow-hidden relative">
                            <div className="absolute inset-0 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                                {msgsLoading && (
                                    <div className="flex flex-col items-center justify-center h-full gap-2 opacity-30">
                                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600"/>
                                        <p className="text-xs font-black uppercase tracking-widest">Syncing History</p>
                                    </div>
                                )}
                                {messages?.map((msg) => {
                                    const isMe = msg.senderId === user?.uid;
                                    return (
                                        <div key={msg.id} className={cn("flex", isMe ? 'justify-end' : 'justify-start')}>
                                            <div className={cn(
                                                "max-w-[75%] p-4 rounded-[1.5rem] shadow-sm text-sm leading-relaxed",
                                                isMe 
                                                    ? 'bg-indigo-600 text-white rounded-br-sm' 
                                                    : 'bg-white text-slate-800 border-2 border-slate-100 rounded-bl-sm'
                                            )}>
                                                <p>{msg.text}</p>
                                                <div className={cn(
                                                    "text-[9px] mt-2 font-bold uppercase tracking-widest flex items-center gap-1",
                                                    isMe ? 'text-indigo-200 justify-end' : 'text-slate-400'
                                                )}>
                                                    {msg.createdAt ? format(msg.createdAt.toDate(), 'p') : 'Sending...'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-6 bg-white border-t mt-auto">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                className="flex items-center gap-3"
                            >
                                <Input 
                                    value={newMessage} 
                                    onChange={e => setNewMessage(e.target.value)} 
                                    placeholder="Type your message here..." 
                                    className="flex-1 h-14 rounded-2xl bg-slate-50 border-none px-6 focus-visible:ring-2 focus-visible:ring-indigo-500 font-medium"
                                />
                                <Button type="submit" disabled={!newMessage.trim() || isSending} className="h-14 w-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg transition-transform active:scale-95">
                                    {isSending ? <Loader2 className="h-5 w-5 animate-spin"/> : <Send className="h-5 w-5" />}
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/30 gap-4">
                        <div className="p-10 rounded-full bg-white shadow-inner">
                            <MessageCircle className="h-20 w-20 text-slate-100"/>
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-xl font-black text-slate-400 uppercase tracking-tighter">Secure Terminal</p>
                            <p className="text-xs font-medium text-slate-400">Select a conversation to decrypt message stream</p>
                        </div>
                    </div>
                )}
            </Card>

            {schoolId && (
                <NewChatDialog 
                    open={isNewChatOpen} 
                    setOpen={setIsNewChatOpen} 
                    onStartChat={startNewChat} 
                    schoolId={schoolId}
                />
            )}
        </div>
    );
}
