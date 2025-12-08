'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, where, doc, updateDoc, limit, getDocs } from 'firebase/firestore';
import { 
  MessageCircle, Search, Send, Plus, User, MoreVertical, Phone, Video, Loader2 
} from 'lucide-react';
import { format } from 'date-fns';

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

// --- TYPES ---
interface ChatMetadata {
    id: string;
    participants: string[]; // [uid1, uid2]
    participantDetails: Record<string, { name: string, role: string }>; // Cache names
    lastMessage: string;
    lastMessageTime: any;
    unreadCount: Record<string, number>;
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
}

// --- SUB-COMPONENT: New Chat Dialog ---
function NewChatDialog({ open, setOpen, onStartChat }: { open: boolean, setOpen: (o: boolean) => void, onStartChat: (uid: string, user: SearchUser) => void }) {
    const firestore = useFirestore();
    const { role } = useRole();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchRole, setSearchRole] = useState<string>('staff'); // Default search for staff
    const [results, setResults] = useState<SearchUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Only Admin/Staff can search Students freely. Students usually contact Teachers.
    const allowedRoles = role === 'Student' ? ['staff'] : ['students', 'staff'];

    const handleSearch = async () => {
        if (!firestore) return;
        setIsSearching(true);
        try {
            // NOTE: Full text search is hard in Firestore. We fetch a limited list.
            // In a real app with thousands of users, use Algolia/Typesense.
            const collectionName = searchRole === 'staff' ? 'staff' : 'students';
            const q = query(collection(firestore, collectionName), limit(20)); // Just fetch first 20 for MVP
            const snap = await getDocs(q);
            const users = snap.docs.map(d => ({ ...d.data(), uid: d.id })) as SearchUser[];
            
            // Simple Client-side filtering
            const filtered = users.filter(u => 
                (u.firstName + ' ' + u.lastName).toLowerCase().includes(searchTerm.toLowerCase())
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
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader><DialogTitle>New Message</DialogTitle></DialogHeader>
                <div className="space-y-4 py-2">
                    <div className="flex gap-2">
                        <Select value={searchRole} onValueChange={setSearchRole}>
                            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {allowedRoles.includes('staff') && <SelectItem value="staff">Staff</SelectItem>}
                                {allowedRoles.includes('students') && <SelectItem value="students">Student</SelectItem>}
                            </SelectContent>
                        </Select>
                        <Input 
                            placeholder="Search name..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button size="icon" onClick={handleSearch} disabled={isSearching}>
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin"/> : <Search className="h-4 w-4"/>}
                        </Button>
                    </div>

                    <ScrollArea className="h-[300px]">
                        <div className="space-y-2">
                            {results.map(user => (
                                <button 
                                    key={user.uid} 
                                    onClick={() => onStartChat(user.uid, user)}
                                    className="w-full flex items-center gap-3 p-3 rounded-md hover:bg-slate-100 transition-colors border"
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                        <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                                    </div>
                                </button>
                            ))}
                            {!isSearching && results.length === 0 && <p className="text-center text-muted-foreground text-sm pt-4">Search for a user to start chatting.</p>}
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
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    
    // 1. Fetch Conversations
    const chatsQuery = useMemoFirebase(() => 
        (firestore && user) ? query(
            collection(firestore, 'direct_messages'), 
            where('participants', 'array-contains', user.uid),
            orderBy('lastMessageTime', 'desc')
        ) : null, 
    [firestore, user]);

    const { data: chats, isLoading: chatsLoading } = useCollection<ChatMetadata>(chatsQuery);

    // 2. Fetch Messages for Selected Chat
    const messagesQuery = useMemoFirebase(() => 
        (firestore && selectedChatId) ? query(
            collection(firestore, `direct_messages/${selectedChatId}/messages`),
            orderBy('createdAt', 'asc')
        ) : null,
    [firestore, selectedChatId]);

    const { data: messages, isLoading: msgsLoading } = useCollection<Message>(messagesQuery);

    const scrollRef = useRef<HTMLDivElement>(null);
    
    // Auto-scroll to bottom
    useEffect(() => {
        if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);


    // --- HANDLERS ---

    const handleSendMessage = async () => {
        if(!newMessage.trim() || !selectedChatId || !user) return;
        const text = newMessage;
        setNewMessage(''); // Optimistic clear

        try {
            // 1. Add Message
            await addDoc(collection(firestore!, `direct_messages/${selectedChatId}/messages`), {
                text,
                senderId: user.uid,
                createdAt: serverTimestamp()
            });

            // 2. Update Metadata
            await updateDoc(doc(firestore!, 'direct_messages', selectedChatId), {
                lastMessage: text,
                lastMessageTime: serverTimestamp()
            });
        } catch (e) {
            console.error("Failed to send:", e);
        }
    };

    const startNewChat = async (targetUid: string, targetUser: SearchUser) => {
        if (!user || !firestore) return;
        
        // Check if chat exists (in local list)
        const existing = chats?.find(c => c.participants.includes(targetUid));
        if (existing) {
            setSelectedChatId(existing.id);
            setIsNewChatOpen(false);
            return;
        }

        // Create new chat
        try {
            const myName = user.displayName || user.email?.split('@')[0] || 'Me';
            const docRef = await addDoc(collection(firestore, 'direct_messages'), {
                participants: [user.uid, targetUid],
                participantDetails: {
                    [user.uid]: { name: myName, role: 'User' }, // Ideally fetch real role
                    [targetUid]: { name: `${targetUser.firstName} ${targetUser.lastName}`, role: targetUser.role }
                },
                lastMessage: 'Chat started',
                lastMessageTime: serverTimestamp(),
                unreadCount: { [targetUid]: 1 }
            });
            setSelectedChatId(docRef.id);
            setIsNewChatOpen(false);
        } catch (e) {
            console.error("Error creating chat:", e);
        }
    };

    // Helper to get "The Other Person" details
    const getOtherParticipant = (chat: ChatMetadata) => {
        if (!user) return { name: 'Unknown', role: '' };
        const otherId = chat.participants.find(id => id !== user.uid);
        if (!otherId || !chat.participantDetails) return { name: 'Unknown', role: '' };
        return chat.participantDetails[otherId] || { name: 'Unknown', role: '' };
    };

    return (
        <div className="h-[calc(100vh-100px)] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 md:p-6 bg-slate-50/50">
            
            {/* LEFT SIDEBAR: CHAT LIST */}
            <Card className="md:col-span-1 flex flex-col h-full overflow-hidden border-0 shadow-md">
                <div className="p-4 border-b flex justify-between items-center bg-white">
                    <h2 className="font-bold text-lg flex items-center gap-2"><MessageCircle className="h-5 w-5 text-indigo-600"/> Messages</h2>
                    <Button size="icon" variant="ghost" onClick={() => setIsNewChatOpen(true)}><Plus className="h-5 w-5"/></Button>
                </div>
                <div className="p-2 border-b bg-white">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search chats..." className="pl-8 bg-slate-50 border-slate-100" />
                    </div>
                </div>
                <ScrollArea className="flex-1 bg-white">
                    <div className="flex flex-col">
                        {chatsLoading && <div className="p-4 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400"/></div>}
                        {!chatsLoading && chats?.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                <p className="text-sm">No messages yet.</p>
                                <Button variant="link" onClick={() => setIsNewChatOpen(true)}>Start a chat</Button>
                            </div>
                        )}
                        {chats?.map(chat => {
                            const other = getOtherParticipant(chat);
                            return (
                                <button 
                                    key={chat.id}
                                    onClick={() => setSelectedChatId(chat.id)}
                                    className={`flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 text-left ${selectedChatId === chat.id ? 'bg-indigo-50 hover:bg-indigo-50 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
                                >
                                    <Avatar>
                                        <AvatarFallback className="bg-indigo-100 text-indigo-700">{other.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-semibold text-sm truncate">{other.name}</span>
                                            {chat.lastMessageTime && <span className="text-[10px] text-slate-400">{format(chat.lastMessageTime?.toDate(), 'MMM d')}</span>}
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </ScrollArea>
            </Card>

            {/* RIGHT SIDE: CHAT WINDOW */}
            <Card className="md:col-span-2 lg:col-span-3 flex flex-col h-full border-0 shadow-md overflow-hidden">
                {selectedChatId && chats ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b bg-white flex justify-between items-center shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-green-100 text-green-700">
                                        {getOtherParticipant(chats.find(c => c.id === selectedChatId)!).name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-slate-800">{getOtherParticipant(chats.find(c => c.id === selectedChatId)!).name}</h3>
                                    <Badge variant="outline" className="text-[10px] h-5">{getOtherParticipant(chats.find(c => c.id === selectedChatId)!).role}</Badge>
                                </div>
                            </div>
                            <div className="flex gap-1 text-slate-400">
                                <Button variant="ghost" size="icon"><Phone className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon"><Video className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 bg-slate-50/50 p-4 overflow-hidden relative">
                            <div className="absolute inset-0 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                                {msgsLoading && <Loader2 className="h-8 w-8 animate-spin mx-auto mt-10 text-indigo-300"/>}
                                {messages?.map((msg) => {
                                    const isMe = msg.senderId === user?.uid;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${
                                                isMe 
                                                ? 'bg-indigo-600 text-white rounded-br-sm' 
                                                : 'bg-white text-slate-800 border rounded-bl-sm'
                                            }`}>
                                                <p>{msg.text}</p>
                                                <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                    {msg.createdAt ? format(msg.createdAt.toDate(), 'p') : '...'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t">
                            <form 
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                className="flex items-center gap-2"
                            >
                                <Input 
                                    value={newMessage} 
                                    onChange={e => setNewMessage(e.target.value)} 
                                    placeholder="Type a message..." 
                                    className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                                />
                                <Button type="submit" disabled={!newMessage.trim()} className="bg-indigo-600 hover:bg-indigo-700">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    // Empty State
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/30">
                        <MessageCircle className="h-24 w-24 mb-4 opacity-20"/>
                        <p className="text-lg font-medium text-slate-400">Select a conversation to start chatting</p>
                    </div>
                )}
            </Card>

            <NewChatDialog open={isNewChatOpen} setOpen={setIsNewChatOpen} onStartChat={startNewChat} />
        </div>
    );
}
