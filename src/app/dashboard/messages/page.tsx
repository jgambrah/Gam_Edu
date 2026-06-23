'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { 
    collection, query, orderBy, addDoc, serverTimestamp, where, doc, updateDoc, 
    limit, getDocs, arrayUnion, arrayRemove, deleteDoc, increment 
} from 'firebase/firestore'; 
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { 
    MessageCircle, Search, Send, Plus, User, MoreVertical, Phone, Video, 
    Loader2, ArrowLeft, CheckCheck, BookOpen, GraduationCap, Users, HeartHandshake, X,
    Paperclip, Mic, MicOff, Play, Pause, Smile, CornerUpLeft, Edit3, Trash2, Check, Download, Music,
    FileText, Forward, Megaphone, Sparkles, CheckCircle2, AlertCircle, Shield
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { moderateMessageAction } from '@/app/actions/moderation-actions';

// --- TYPES ---
interface ChatMetadata {
    id: string;
    participants: string[];
    participantDetails: Record<string, { name: string, role: string, photoURL?: string }>;
    lastMessage: string;
    lastMessageTime: any;
    unreadCount: Record<string, number>;
    schoolId: string;
    isGroup?: boolean;
    groupName?: string;
    groupDescription?: string;
    groupCreatedBy?: string;
    groupAvatar?: string;
    typingState?: Record<string, boolean>;
    isAnnouncementChannel?: boolean;
}
interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: any;
    type?: 'text' | 'image' | 'video' | 'file' | 'audio';
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    reactions?: Record<string, string[]>; // emoji -> user uids
    edited?: boolean;
    isDeleted?: boolean;
    replyTo?: {
        messageId: string;
        text: string;
        senderName: string;
    };
    status?: 'sent' | 'delivered' | 'read';
    deletedFor?: string[];
    flagged?: boolean;
    flagType?: 'safe' | 'romantic' | 'abusive' | 'privacy_violation' | 'harmful';
    flagExplanation?: string;
    educationalMessage?: string;
}
interface SearchUser {
    uid: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    photoURL?: string;
}

// --- HELPERS ---
function formatChatTime(timestamp: any): string {
    if (!timestamp) return '';
    try {
        const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
        if (isToday(date)) return format(date, 'HH:mm');
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'dd MMM');
    } catch { return ''; }
}

function getRoleColor(role: string): string {
    const r = (role || '').toLowerCase();
    if (r.includes('teacher') || r.includes('staff')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (r.includes('admin') || r.includes('director')) return 'bg-violet-100 text-violet-700 border-violet-200';
    if (r.includes('student')) return 'bg-sky-100 text-sky-700 border-sky-200';
    if (r.includes('parent')) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
}

function getRoleIcon(role: string) {
    const r = (role || '').toLowerCase();
    if (r.includes('teacher')) return <BookOpen className="h-3 w-3" />;
    if (r.includes('student')) return <GraduationCap className="h-3 w-3" />;
    if (r.includes('parent')) return <HeartHandshake className="h-3 w-3" />;
    return <Users className="h-3 w-3" />;
}

function getAvatarGradient(name: string): string {
    const gradients = [
        'from-violet-500 to-indigo-600',
        'from-emerald-500 to-teal-600',
        'from-rose-500 to-pink-600',
        'from-amber-500 to-orange-600',
        'from-sky-500 to-blue-600',
        'from-fuchsia-500 to-purple-600',
    ];
    const index = (name.charCodeAt(0) || 0) % gradients.length;
    return gradients[index];
}

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

// --- NEW CHAT DIALOG ---
function NewChatDialog({ open, setOpen, onStartChat, schoolId }: {
    open: boolean;
    setOpen: (o: boolean) => void;
    onStartChat: (uid: string, user: SearchUser) => void;
    schoolId: string;
}) {
    const firestore = useFirestore();
    const { role } = useRole();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchRole, setSearchRole] = useState<string>('staff');
    const [results, setResults] = useState<SearchUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Determine allowed search categories based on current user role
    const searchCategories = useMemo(() => {
        // Staff/Admins can message everyone
        if (['Administrator', 'Director', 'Teacher', 'Accountant', 'Librarian'].includes(role || '')) {
            return [
                { id: 'staff', label: 'Staff' },
                { id: 'students', label: 'Students' },
                { id: 'parents', label: 'Parents' }
            ];
        }
        // Students and Parents can only search for Staff/Teachers for security/privacy
        return [{ id: 'staff', label: 'Staff' }];
    }, [role]);

    // Ensure searchRole is valid when searchCategories change
    useEffect(() => {
        if (!searchCategories.find(cat => cat.id === searchRole)) {
            setSearchRole(searchCategories[0].id);
        }
    }, [searchCategories, searchRole]);

    const handleSearch = async () => {
        if (!firestore || !schoolId) return;
        setIsSearching(true);
        try {
            const collectionName = searchRole; // 'staff', 'students', or 'parents'
            const q = query(collection(firestore, collectionName), where('schoolId', '==', schoolId), limit(50));
            const snap = await getDocs(q);
            const users = snap.docs.map(d => {
                const data = d.data();
                let effectiveRole = data.role;
                if (!effectiveRole) {
                    if (searchRole === 'students') effectiveRole = 'Student';
                    if (searchRole === 'parents') effectiveRole = 'Parent';
                    if (searchRole === 'staff') effectiveRole = 'Staff';
                }
                return { 
                    ...data, 
                    uid: d.id,
                    role: effectiveRole || 'Member',
                    photoURL: data.photoURL || null
                };
            }) as SearchUser[];

            const filtered = users.filter(u => {
                if (searchRole === 'students' && (u as any).enrollmentStatus === 'Inactive') return false;
                return ((u.firstName || '') + ' ' + (u.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
            });
            setResults(filtered);
        } catch (e) { 
            console.error("Messaging Search Error:", e); 
        } finally { 
            setIsSearching(false); 
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 pb-8">
                    <DialogTitle className="text-white text-xl font-bold tracking-tight">New Conversation</DialogTitle>
                    <p className="text-indigo-200 text-xs mt-1">Connect with someone in your school community</p>
                </div>

                {/* Search bar overlapping header */}
                <div className="px-5 -mt-4">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-100 flex items-center gap-2 p-1.5">
                        <Select value={searchRole} onValueChange={setSearchRole}>
                            <SelectTrigger className="w-[110px] border-0 bg-slate-50 rounded-lg h-9 text-xs font-bold text-slate-600 focus:ring-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {searchCategories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="w-px h-6 bg-slate-200" />
                        <Input
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="border-0 bg-transparent focus-visible:ring-0 text-sm placeholder:text-slate-400 flex-1 h-9"
                        />
                        <Button size="sm" onClick={handleSearch} disabled={isSearching}
                            className="bg-indigo-600 hover:bg-indigo-700 rounded-lg h-9 px-3 shrink-0">
                            {isSearching ? <Loader2 className="h-3.5 w-3.5 animate-spin"/> : <Search className="h-3.5 w-3.5"/>}
                        </Button>
                    </div>
                </div>

                {/* Results */}
                <div className="px-5 pb-5 mt-3">
                    <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/50 max-h-[340px] overflow-y-auto">
                        {results.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {results.map(user => (
                                    <button
                                        key={user.uid}
                                        onClick={() => onStartChat(user.uid, user)}
                                        className="w-full flex items-center gap-3 p-3.5 hover:bg-white transition-colors text-left group"
                                    >
                                        <div className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br shrink-0 shadow-sm",
                                            getAvatarGradient(`${user.firstName}${user.lastName}`)
                                        )}>
                                            {user.photoURL 
                                                ? <img src={user.photoURL} className="h-10 w-10 rounded-full object-cover" alt="" />
                                                : (user.firstName?.[0] || 'U')
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm text-slate-800 truncate">
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1",
                                            getRoleColor(user.role)
                                        )}>
                                            {getRoleIcon(user.role)}
                                            {user.role}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-300 gap-3">
                                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                                    <User className="h-6 w-6 text-slate-300"/>
                                </div>
                                <p className="text-xs font-medium text-slate-400 text-center px-4">
                                    {isSearching ? 'Searching...' : 'Search to find someone at your school'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- NEW GROUP DIALOG ---
function NewGroupDialog({ open, setOpen, onCreateGroup, schoolId }: {
    open: boolean;
    setOpen: (o: boolean) => void;
    onCreateGroup: (name: string, description: string, members: SearchUser[]) => Promise<void>;
    schoolId: string;
}) {
    const firestore = useFirestore();
    const { role } = useRole();
    const { toast } = useToast();
    
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchRole, setSearchRole] = useState<'students' | 'staff'>('students');
    const [results, setResults] = useState<SearchUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<SearchUser[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setGroupName('');
            setGroupDescription('');
            setSearchTerm('');
            setResults([]);
            setSelectedMembers([]);
        }
    }, [open]);

    const handleSearch = async () => {
        if (!firestore || !schoolId) return;
        setIsSearching(true);
        try {
            const collectionName = searchRole;
            const q = query(collection(firestore, collectionName), where('schoolId', '==', schoolId), limit(50));
            const snap = await getDocs(q);
            const users = snap.docs.map(d => {
                const data = d.data();
                let effectiveRole = data.role;
                if (!effectiveRole) {
                    if (searchRole === 'students') effectiveRole = 'Student';
                    if (searchRole === 'staff') effectiveRole = 'Staff';
                }
                return { 
                    ...data, 
                    uid: d.id,
                    role: effectiveRole || 'Member',
                    photoURL: data.photoURL || null
                };
            }) as SearchUser[];

            const filtered = users.filter(u => {
                if (searchRole === 'students' && (u as any).enrollmentStatus === 'Inactive') return false;
                return ((u.firstName || '') + ' ' + (u.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.email || '').toLowerCase().includes(searchTerm.toLowerCase());
            });
            setResults(filtered);
        } catch (e) {
            console.error("Group Search Error:", e);
        } finally {
            setIsSearching(false);
        }
    };

    const toggleMember = (member: SearchUser) => {
        setSelectedMembers(prev => {
            const exists = prev.find(m => m.uid === member.uid);
            if (exists) {
                return prev.filter(m => m.uid !== member.uid);
            } else {
                return [...prev, member];
            }
        });
    };

    const handleCreate = async () => {
        if (!groupName.trim()) {
            toast({ variant: 'destructive', title: 'Validation Error', description: 'Group name is required.' });
            return;
        }
        if (selectedMembers.length === 0) {
            toast({ variant: 'destructive', title: 'Validation Error', description: 'Select at least one group member.' });
            return;
        }
        setIsSubmitting(true);
        try {
            await onCreateGroup(groupName, groupDescription, selectedMembers);
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Group Creation Failed', description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-6 pb-8">
                    <DialogTitle className="text-white text-xl font-bold tracking-tight">Create Group Chat</DialogTitle>
                    <p className="text-violet-200 text-xs mt-1">Start a group conversation with your school community</p>
                </div>

                <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Group Name</label>
                            <Input
                                placeholder="e.g. Science Club, Class Study Group..."
                                value={groupName}
                                onChange={e => setGroupName(e.target.value)}
                                className="h-11 rounded-xl border-2 bg-slate-50 focus-visible:ring-indigo-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Group Description (Optional)</label>
                            <Input
                                placeholder="What is this group about?"
                                value={groupDescription}
                                onChange={e => setGroupDescription(e.target.value)}
                                className="h-11 rounded-xl border-2 bg-slate-50 focus-visible:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {selectedMembers.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400">Selected Members ({selectedMembers.length})</label>
                            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-dashed">
                                {selectedMembers.map(member => (
                                    <Badge key={member.uid} variant="secondary" className="pl-1.5 pr-1 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-1">
                                        <span className="text-xs">{member.firstName} {member.lastName}</span>
                                        <button onClick={() => toggleMember(member)} className="text-indigo-400 hover:text-indigo-600">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Search and Add Members</label>
                        <div className="bg-white rounded-xl border-2 flex items-center gap-2 p-1">
                            <Select value={searchRole} onValueChange={(v: any) => setSearchRole(v)}>
                                <SelectTrigger className="w-[100px] border-0 bg-slate-50 rounded-lg h-9 text-xs font-bold text-slate-600 focus:ring-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="students">Students</SelectItem>
                                    <SelectItem value="staff">Staff/Teachers</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="w-px h-6 bg-slate-200" />
                            <Input
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="border-0 bg-transparent focus-visible:ring-0 text-sm placeholder:text-slate-400 flex-1 h-9"
                            />
                            <Button size="sm" onClick={handleSearch} disabled={isSearching}
                                className="bg-indigo-600 hover:bg-indigo-700 rounded-lg h-9 px-3 shrink-0">
                                {isSearching ? <Loader2 className="h-3.5 w-3.5 animate-spin"/> : <Search className="h-3.5 w-3.5"/>}
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50/50 max-h-[160px] overflow-y-auto">
                        {results.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {results.map(member => {
                                    const isSelected = selectedMembers.some(m => m.uid === member.uid);
                                    return (
                                        <button
                                            type="button"
                                            key={member.uid}
                                            onClick={() => toggleMember(member)}
                                            className={cn(
                                                "w-full flex items-center justify-between p-3 hover:bg-white transition-colors text-left",
                                                isSelected && "bg-indigo-50/40"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs bg-gradient-to-br shrink-0 shadow-sm",
                                                    getAvatarGradient(`${member.firstName}${member.lastName}`)
                                                )}>
                                                    {member.photoURL 
                                                        ? <img src={member.photoURL} className="h-8 w-8 rounded-full object-cover" alt="" />
                                                        : (member.firstName?.[0] || 'U')
                                                    }
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm text-slate-800 truncate">
                                                        {member.firstName} {member.lastName}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 truncate">{member.email}</p>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1",
                                                getRoleColor(member.role)
                                            )}>
                                                {getRoleIcon(member.role)}
                                                {member.role}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-slate-400 text-xs">
                                {isSearching ? 'Searching...' : 'Search above to find classmates or teachers.'}
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting} className="rounded-xl">
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={isSubmitting || !groupName.trim() || selectedMembers.length === 0}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 font-bold">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Create Group'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- GROUP DETAILS DIALOG ---
function GroupDetailsDialog({ open, setOpen, chat, currentUser, onUpdateGroup, onLeaveGroup }: {
    open: boolean;
    setOpen: (o: boolean) => void;
    chat: ChatMetadata | null;
    currentUser: any;
    onUpdateGroup: (chatId: string, updates: any) => Promise<void>;
    onLeaveGroup: (chatId: string) => Promise<void>;
}) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchRole, setSearchRole] = useState<'students' | 'staff'>('students');
    const [results, setResults] = useState<SearchUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (chat && open) {
            setGroupName(chat.groupName || '');
            setGroupDescription(chat.groupDescription || '');
            setIsEditing(false);
            setIsAddingMember(false);
            setResults([]);
        }
    }, [chat, open]);

    if (!chat) return null;

    const isAdmin = chat.groupCreatedBy === currentUser?.uid;

    const handleSaveInfo = async () => {
        if (!groupName.trim()) return;
        setIsSaving(true);
        try {
            await onUpdateGroup(chat.id, {
                groupName: groupName.trim(),
                groupDescription: groupDescription.trim()
            });
            setIsEditing(false);
            toast({ title: 'Group Updated', description: 'Group settings successfully saved.' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Update Failed', description: e.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSearch = async () => {
        if (!firestore || !chat.schoolId) return;
        setIsSearching(true);
        try {
            const q = query(collection(firestore, searchRole), where('schoolId', '==', chat.schoolId), limit(50));
            const snap = await getDocs(q);
            const users = snap.docs.map(d => ({
                ...d.data(),
                uid: d.id,
                role: d.data().role || (searchRole === 'students' ? 'Student' : 'Staff')
            })) as SearchUser[];

            const filtered = users.filter(u => {
                if (searchRole === 'students' && (u as any).enrollmentStatus === 'Inactive') return false;
                return !chat.participants.includes(u.uid) && 
                (((u.firstName || '') + ' ' + (u.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
                 (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()));
            });
            setResults(filtered);
        } catch (e) {
            console.error("Search Group Add Member Error:", e);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddMember = async (newMember: SearchUser) => {
        try {
            const updatedParticipants = [...chat.participants, newMember.uid];
            const updatedDetails = {
                ...chat.participantDetails,
                [newMember.uid]: {
                    name: `${newMember.firstName || ''} ${newMember.lastName || ''}`.trim(),
                    role: newMember.role || 'Member',
                    photoURL: newMember.photoURL || null
                }
            };
            await onUpdateGroup(chat.id, {
                participants: updatedParticipants,
                participantDetails: updatedDetails,
                lastMessage: `${currentUser.displayName || 'Admin'} added ${newMember.firstName} to the group`,
                lastMessageTime: serverTimestamp()
            });
            toast({ title: 'Member Added', description: `${newMember.firstName} has been added to the group.` });
            setResults(prev => prev.filter(r => r.uid !== newMember.uid));
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Add Member Failed', description: e.message });
        }
    };

    const handleRemoveMember = async (memberUid: string, name: string) => {
        try {
            const updatedParticipants = chat.participants.filter(id => id !== memberUid);
            const updatedDetails = { ...chat.participantDetails };
            delete updatedDetails[memberUid];
            
            await onUpdateGroup(chat.id, {
                participants: updatedParticipants,
                participantDetails: updatedDetails,
                lastMessage: `${currentUser.displayName || 'Admin'} removed ${name} from the group`,
                lastMessageTime: serverTimestamp()
            });
            toast({ title: 'Member Removed', description: `${name} has been removed.` });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Remove Failed', description: e.message });
        }
    };

    const handleLeave = async () => {
        try {
            await onLeaveGroup(chat.id);
            setOpen(false);
            toast({ title: 'Left Group', description: `You have left ${chat.groupName}.` });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Leave Group Failed', description: e.message });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 pb-8 text-white relative">
                    <DialogTitle className="text-xl font-bold tracking-tight">Group Info</DialogTitle>
                    <p className="text-indigo-200 text-xs mt-1">Created by {chat.participantDetails[chat.groupCreatedBy || '']?.name || 'School Admin'}</p>
                </div>

                <div className="p-6 space-y-5 max-h-[50vh] overflow-y-auto">
                    <div className="space-y-3">
                        {isEditing ? (
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Group Name</label>
                                    <Input value={groupName} onChange={e => setGroupName(e.target.value)} className="rounded-xl border-2" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase text-slate-400">Description</label>
                                    <Input value={groupDescription} onChange={e => setGroupDescription(e.target.value)} className="rounded-xl border-2" />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving} className="rounded-lg">Cancel</Button>
                                    <Button size="sm" onClick={handleSaveInfo} disabled={isSaving} className="bg-indigo-600 text-white rounded-lg">Save</Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-black text-slate-800 leading-tight truncate">{chat.groupName}</h2>
                                    {isAdmin && (
                                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="text-indigo-600 hover:text-indigo-800 text-xs font-bold">
                                            Edit Info
                                        </Button>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-1 italic">{chat.groupDescription || 'No description provided.'}</p>
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-slate-100" />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                Group Members ({chat.participants.length})
                            </label>
                            {isAdmin && (
                                <Button size="sm" onClick={() => setIsAddingMember(!isAddingMember)} variant="outline" className="h-8 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50">
                                    {isAddingMember ? 'Hide Search' : '+ Add Member'}
                                </Button>
                            )}
                        </div>

                        {isAddingMember && (
                            <div className="space-y-3 p-3 bg-slate-50 rounded-xl border-2 border-dashed">
                                <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border">
                                    <Select value={searchRole} onValueChange={(v: any) => setSearchRole(v)}>
                                        <SelectTrigger className="w-[85px] border-0 bg-slate-50 rounded-md h-8 text-[11px] font-bold text-slate-500 focus:ring-0">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="students">Students</SelectItem>
                                            <SelectItem value="staff">Staff</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        placeholder="Add member name..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                        className="border-0 bg-transparent focus-visible:ring-0 text-xs placeholder:text-slate-400 flex-1 h-8"
                                    />
                                    <Button size="sm" onClick={handleSearch} disabled={isSearching} className="bg-indigo-600 text-white rounded-md h-8 px-2.5">
                                        {isSearching ? <Loader2 className="h-3 w-3 animate-spin"/> : <Search className="h-3 w-3"/>}
                                    </Button>
                                </div>

                                {results.length > 0 && (
                                    <div className="divide-y divide-slate-100 max-h-[120px] overflow-y-auto bg-white rounded-lg border">
                                        {results.map(user => (
                                            <div key={user.uid} className="flex items-center justify-between p-2">
                                                <span className="text-xs font-semibold text-slate-700 truncate">{user.firstName} {user.lastName}</span>
                                                <Button size="sm" onClick={() => handleAddMember(user)} className="bg-emerald-600 hover:bg-emerald-700 h-6 px-2 text-[10px] text-white rounded-md">
                                                    Add
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-2 max-h-[180px] overflow-y-auto">
                            {chat.participants.map(uid => {
                                const details = chat.participantDetails[uid] || { name: 'Member', role: 'Student' };
                                const isSelf = uid === currentUser?.uid;
                                const isCreator = uid === chat.groupCreatedBy;

                                return (
                                    <div key={uid} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className={cn(
                                                "h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br shrink-0",
                                                getAvatarGradient(details.name)
                                            )}>
                                                {details.photoURL 
                                                    ? <img src={details.photoURL} className="h-7 w-7 rounded-full object-cover" alt="" />
                                                    : details.name.charAt(0)
                                                }
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-xs font-semibold text-slate-800 truncate block">
                                                    {details.name} {isSelf && <span className="text-slate-400 font-normal italic">(You)</span>}
                                                </span>
                                                <span className="text-[9px] text-slate-400 capitalize">{details.role}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {isCreator && (
                                                <span className="text-[9px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full px-1.5 py-0.5 uppercase tracking-wide">
                                                    Admin
                                                </span>
                                            )}
                                            {isAdmin && !isSelf && (
                                                <button onClick={() => handleRemoveMember(uid, details.name)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 text-[10px] font-bold">
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 px-6 py-4 flex justify-between border-t items-center">
                    {!chat.isAnnouncementChannel ? (
                        <button onClick={handleLeave} className="text-xs font-black text-red-500 hover:text-red-700 flex items-center gap-1.5 uppercase tracking-tight bg-red-50 px-3.5 py-2 rounded-xl border border-red-100 hover:bg-red-100/40 transition-colors">
                            Leave Group
                        </button>
                    ) : (
                        <div />
                    )}
                    <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- AUDIO PLAYER ---
function AudioMessagePlayer({ url }: { url: string }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);

    useEffect(() => {
        const audio = new Audio(url);
        audioRef.current = audio;

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onLoadedMetadata = () => setDuration(audio.duration || 0);
        const onEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.pause();
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
        };
    }, [url]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.error("Audio play error", e));
            setIsPlaying(true);
        }
    };

    const handleSpeedChange = () => {
        const rates = [1, 1.5, 2];
        const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
        setPlaybackRate(rates[nextIndex]);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/50 max-w-[280px] text-slate-800 shadow-sm animate-in fade-in duration-150">
            <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={togglePlay}
                className="h-8 w-8 rounded-full bg-white hover:bg-slate-100 text-indigo-600 flex items-center justify-center p-0 shadow border border-slate-100 shrink-0"
            >
                {isPlaying ? <Pause className="h-3.5 w-3.5 fill-indigo-600 text-indigo-600" /> : <Play className="h-3.5 w-3.5 fill-indigo-600 text-indigo-600 ml-0.5" />}
            </Button>
            <div className="flex-1 min-w-0">
                <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-indigo-600 transition-all duration-100" 
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                </div>
                <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
            <button
                type="button"
                onClick={handleSpeedChange}
                className="text-[10px] font-black bg-white border border-slate-200 hover:bg-slate-50 px-1.5 py-0.5 rounded-lg text-slate-600 shrink-0 font-mono shadow-sm"
            >
                {playbackRate}x
            </button>
        </div>
    );
}

// --- AUDIO PLAYING helper ---
function playNotificationSound() {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    try {
        const audioCtx = new AudioContextClass();
        const playTone = (freq: number, start: number, duration: number) => {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);
            
            gainNode.gain.setValueAtTime(0, start);
            gainNode.gain.linearRampToValueAtTime(0.2, start + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration);
            
            osc.start(start);
            osc.stop(start + duration);
        };
        
        const now = audioCtx.currentTime;
        playTone(830.61, now, 0.15); // G#5
        playTone(1046.50, now + 0.08, 0.25); // C6
    } catch (e) {
        console.error("Failed to play notification sound:", e);
    }
}

// --- MAIN PAGE ---
export default function MessagesPage() {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
    const { toast } = useToast();

    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
    const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [chatFilter, setChatFilter] = useState('');

    // Replying, Editing, Reactions
    const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

    // Forwarding, Self Deletions, Input Emoji Picker
    const [forwardingMessage, setForwardingMessage] = useState<Message | null>(null);
    const [isForwardOpen, setIsForwardOpen] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [deletingMessage, setDeletingMessage] = useState<Message | null>(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [revealedMessageIds, setRevealedMessageIds] = useState<Record<string, boolean>>({});

    // Media & File sharing
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Audio recording
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recordingIntervalRef = useRef<any>(null);

    // Broadcast states
    const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [broadcastProgress, setBroadcastProgress] = useState(0);
    const [broadcastTotal, setBroadcastTotal] = useState(0);
    const [broadcastCurrent, setBroadcastCurrent] = useState(0);
    const [broadcastStatusText, setBroadcastStatusText] = useState('');
    const [broadcastLogs, setBroadcastLogs] = useState<string[]>([]);
    const [isBroadcastCompleted, setIsBroadcastCompleted] = useState(false);

    const chatsQuery = useMemoFirebase(() =>
        (firestore && user && schoolId) ? query(
            collection(firestore, 'direct_messages'),
            where('schoolId', '==', schoolId),
            where('participants', 'array-contains', user.uid),
            orderBy('lastMessageTime', 'desc')
        ) : null,
    [firestore, user, schoolId]);

    const { data: chats, isLoading: chatsLoading } = useCollection<ChatMetadata>(chatsQuery);

    const messagesQuery = useMemoFirebase(() =>
        (firestore && selectedChatId) ? query(
            collection(firestore, `direct_messages/${selectedChatId}/messages`),
            orderBy('createdAt', 'asc')
        ) : null,
    [firestore, selectedChatId]);

    const { data: messages, isLoading: msgsLoading } = useCollection<Message>(messagesQuery);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Focus input when chat is selected
    useEffect(() => {
        if (selectedChatId && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [selectedChatId]);

    const prevChatsRef = useRef<ChatMetadata[] | null>(null);

    // Calculate total unread messages count
    const totalUnreadCount = useMemo(() => {
        if (!chats || !user) return 0;
        return chats.reduce((acc, chat) => {
            return acc + (chat.unreadCount?.[user.uid] || 0);
        }, 0);
    }, [chats, user]);

    const isAuthorizedSender = useMemo(() => {
        return ['Administrator', 'Director', 'Teacher', 'Accountant', 'Librarian'].includes(role || '');
    }, [role]);

    // Announcements Channel Auto-init and Auto-join
    useEffect(() => {
        if (!firestore || !schoolId || !user || chatsLoading) return;

        const announcementChat = chats?.find(c => c.isAnnouncementChannel === true);

        if (!announcementChat) {
            if (isAuthorizedSender) {
                const myName = user.displayName || user.email?.split('@')[0] || 'Admin';
                const createAnnouncements = async () => {
                    try {
                        const docRef = await addDoc(collection(firestore, 'direct_messages'), {
                            participants: [user.uid],
                            participantDetails: {
                                [user.uid]: {
                                    name: myName,
                                    role: role || 'Staff',
                                    photoURL: user.photoURL || null
                                }
                            },
                            isAnnouncementChannel: true,
                            isGroup: true,
                            groupName: "School Announcements",
                            groupDescription: "Official announcements and updates from the school administration",
                            groupCreatedBy: user.uid,
                            lastMessage: "Announcement channel initialized",
                            lastMessageTime: serverTimestamp(),
                            unreadCount: { [user.uid]: 0 },
                            schoolId
                        });

                        await addDoc(collection(firestore, `direct_messages/${docRef.id}/messages`), {
                            text: "Welcome to the School Announcements channel! Only administrators can post here.",
                            senderId: 'system',
                            createdAt: serverTimestamp()
                        });
                    } catch (e) {
                        console.error("Failed to create Announcements channel:", e);
                    }
                };
                createAnnouncements();
            }
        } else {
            // Channel exists, check if user is in participants list
            if (!announcementChat.participants.includes(user.uid)) {
                const myName = user.displayName || user.email?.split('@')[0] || 'User';
                const joinAnnouncements = async () => {
                    try {
                        const chatRef = doc(firestore, 'direct_messages', announcementChat.id);
                        await updateDoc(chatRef, {
                            participants: arrayUnion(user.uid),
                            [`participantDetails.${user.uid}`]: {
                                name: myName,
                                role: role || 'Member',
                                photoURL: user.photoURL || null
                            },
                            [`unreadCount.${user.uid}`]: 0
                        });
                    } catch (e) {
                        console.error("Failed to join Announcements channel:", e);
                    }
                };
                joinAnnouncements();
            }
        }
    }, [firestore, schoolId, user, chats, chatsLoading, isAuthorizedSender, role]);

    // Request Notification permission on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }, []);

    // Tab title updater
    useEffect(() => {
        if (typeof document === 'undefined') return;
        const originalTitle = "Messages | GAM Edu";
        if (totalUnreadCount > 0) {
            document.title = `(${totalUnreadCount}) New Messages | GAM Edu`;
        } else {
            document.title = originalTitle;
        }
        return () => {
            document.title = originalTitle;
        };
    }, [totalUnreadCount]);

    // Real-time notification trigger when chats update
    useEffect(() => {
        if (!chats || !user) return;

        if (!prevChatsRef.current) {
            prevChatsRef.current = chats;
            return;
        }

        chats.forEach(chat => {
            const prevChat = prevChatsRef.current?.find(c => c.id === chat.id);
            if (chat.lastMessageTime && (!prevChat || !prevChat.lastMessageTime || chat.lastMessageTime.seconds > prevChat.lastMessageTime.seconds)) {
                const myUnread = chat.unreadCount?.[user.uid] || 0;
                const prevUnread = prevChat?.unreadCount?.[user.uid] || 0;

                const isNewIncomingMessage = myUnread > prevUnread || (selectedChatId === chat.id && document.hidden && chat.lastMessage !== prevChat?.lastMessage);

                if (isNewIncomingMessage) {
                    playNotificationSound();

                    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                        const otherDetails = Object.values(chat.participantDetails || {}).find(p => p.name !== user.displayName);
                        const senderName = chat.isGroup ? (chat.groupName || 'Group') : (otherDetails?.name || 'Someone');
                        
                        const notification = new Notification(senderName, {
                            body: chat.lastMessage,
                            icon: chat.isGroup ? chat.groupAvatar : (otherDetails?.photoURL || '/favicon.ico'),
                            tag: chat.id
                        });

                        notification.onclick = () => {
                            window.focus();
                            setSelectedChatId(chat.id);
                            notification.close();
                        };
                    }
                }
            }
        });

        prevChatsRef.current = chats;
    }, [chats, user, selectedChatId]);

    const handleCreateGroup = async (name: string, description: string, members: SearchUser[]) => {
        if (!user || !firestore || !schoolId) return;
        try {
            const myName = user.displayName || user.email?.split('@')[0] || 'Me';
            const participantIds = [user.uid, ...members.map(m => m.uid)];
            const participantDetails: Record<string, { name: string, role: string, photoURL?: string }> = {
                [user.uid]: { name: myName, role: role || 'Member', photoURL: user.photoURL || undefined }
            };
            members.forEach(m => {
                participantDetails[m.uid] = {
                    name: `${m.firstName || ''} ${m.lastName || ''}`.trim() || 'User',
                    role: m.role || 'Member',
                    photoURL: m.photoURL || undefined
                };
            });

            const docRef = await addDoc(collection(firestore, 'direct_messages'), {
                participants: participantIds,
                participantDetails,
                lastMessage: `Group created by ${myName}`,
                lastMessageTime: serverTimestamp(),
                unreadCount: participantIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {}),
                schoolId,
                isGroup: true,
                groupName: name,
                groupDescription: description,
                groupCreatedBy: user.uid
            });

            await addDoc(collection(firestore, `direct_messages/${docRef.id}/messages`), {
                text: `${myName} created group "${name}"`,
                senderId: 'system',
                createdAt: serverTimestamp()
            });

            setSelectedChatId(docRef.id);
            setIsNewGroupOpen(false);
            toast({ title: 'Group Created', description: `Group "${name}" has been created successfully.` });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
            throw e;
        }
    };

    const handleUpdateGroup = async (chatId: string, updates: any) => {
        if (!firestore) return;
        try {
            await updateDoc(doc(firestore, 'direct_messages', chatId), updates);
            if (updates.lastMessage) {
                await addDoc(collection(firestore, `direct_messages/${chatId}/messages`), {
                    text: updates.lastMessage,
                    senderId: 'system',
                    createdAt: serverTimestamp()
                });
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Update Error', description: e.message });
            throw e;
        }
    };

    const handleLeaveGroup = async (chatId: string) => {
        if (!user || !firestore) return;
        try {
            const chat = chats?.find(c => c.id === chatId);
            if (!chat) return;

            const myName = user.displayName || user.email?.split('@')[0] || 'Me';
            const updatedParticipants = chat.participants.filter(id => id !== user.uid);
            const updatedDetails = { ...chat.participantDetails };
            delete updatedDetails[user.uid];

            await updateDoc(doc(firestore, 'direct_messages', chatId), {
                participants: updatedParticipants,
                participantDetails: updatedDetails,
                lastMessage: `${myName} left the group`,
                lastMessageTime: serverTimestamp()
            });

            await addDoc(collection(firestore, `direct_messages/${chatId}/messages`), {
                text: `${myName} left the group`,
                senderId: 'system',
                createdAt: serverTimestamp()
            });

            setSelectedChatId(null);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error leaving group', description: e.message });
            throw e;
        }
    };

    // Typing state management
    useEffect(() => {
        if (!selectedChatId || !user || !firestore) return;
        const chatRef = doc(firestore, 'direct_messages', selectedChatId);
        
        if (newMessage.trim().length > 0) {
            updateDoc(chatRef, {
                [`typingState.${user.uid}`]: true
            }).catch(e => console.error(e));
        } else {
            updateDoc(chatRef, {
                [`typingState.${user.uid}`]: false
            }).catch(e => console.error(e));
        }

        const timer = setTimeout(() => {
            if (newMessage.trim().length > 0) {
                updateDoc(chatRef, {
                    [`typingState.${user.uid}`]: false
                }).catch(e => console.error(e));
            }
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [newMessage, selectedChatId, user, firestore]);

    // Read receipts management
    useEffect(() => {
        if (!selectedChatId || !user || !firestore || !messages || messages.length === 0) return;

        // Reset unread count for me
        const chatRef = doc(firestore, 'direct_messages', selectedChatId);
        updateDoc(chatRef, {
            [`unreadCount.${user.uid}`]: 0
        }).catch(e => console.error(e));

        // Mark incoming messages as read
        const unreadMsgs = messages.filter(msg => msg.senderId !== user.uid && msg.status !== 'read');
        if (unreadMsgs.length > 0) {
            unreadMsgs.forEach(msg => {
                updateDoc(doc(firestore, `direct_messages/${selectedChatId}/messages`, msg.id), {
                    status: 'read'
                }).catch(e => console.error(e));
            });
        }
    }, [selectedChatId, messages, user, firestore]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedChatId || !user || isSending) return;
        const text = newMessage;
        setNewMessage('');
        setIsSending(true);
        try {
            // Call AI moderation safety service
            let moderation = { flagged: false, flagType: 'safe' as const, explanation: '', educationalMessage: '' };
            try {
                moderation = await moderateMessageAction(text) as any;
            } catch (e) {
                console.error("AI Moderation API error, failing safe:", e);
            }

            const messageData: any = {
                text,
                senderId: user.uid,
                createdAt: serverTimestamp(),
                type: 'text',
                status: 'sent',
                flagged: moderation.flagged || false,
                flagType: moderation.flagType || 'safe',
                flagExplanation: moderation.explanation || '',
                educationalMessage: moderation.educationalMessage || ''
            };

            if (replyingToMessage) {
                const senderDetails = activeChat?.participantDetails?.[replyingToMessage.senderId];
                const senderName = replyingToMessage.senderId === user.uid ? 'You' : (senderDetails?.name || 'Member');
                messageData.replyTo = {
                    messageId: replyingToMessage.id,
                    text: replyingToMessage.isDeleted ? 'This message was deleted' : replyingToMessage.text,
                    senderName
                };
                setReplyingToMessage(null);
            }

            await addDoc(collection(firestore!, `direct_messages/${selectedChatId}/messages`), messageData);
            
            const chatRef = doc(firestore!, 'direct_messages', selectedChatId);
            const otherParticipants = activeChat?.participants.filter(id => id !== user.uid) || [];
            
            const unreadUpdates: Record<string, any> = {};
            otherParticipants.forEach(id => {
                const currentUnread = activeChat?.unreadCount?.[id] || 0;
                unreadUpdates[`unreadCount.${id}`] = currentUnread + 1;
            });

            await updateDoc(chatRef, {
                lastMessage: moderation.flagged ? `⚠️ [Flagged: ${moderation.flagType}]` : text,
                lastMessageTime: serverTimestamp(),
                ...unreadUpdates
            });

            if (moderation.flagged) {
                toast({
                    variant: 'destructive',
                    title: 'Message Flagged by AI Safety',
                    description: moderation.educationalMessage || 'This content violates safety guidelines.'
                });
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Send Failed', description: e.message });
        } finally {
            setIsSending(false);
        }
    };

    const handleSendFileMessage = async (fileUrl: string, fileName: string, fileSize: number, fileType: 'image' | 'video' | 'file') => {
        if (!selectedChatId || !user || !firestore) return;
        try {
            const messageData: any = {
                text: fileType === 'image' ? '📷 Photo' : fileType === 'video' ? '🎥 Video' : '📄 Document',
                senderId: user.uid,
                createdAt: serverTimestamp(),
                type: fileType,
                fileUrl,
                fileName,
                fileSize,
                status: 'sent'
            };
            await addDoc(collection(firestore, `direct_messages/${selectedChatId}/messages`), messageData);
            
            const chatRef = doc(firestore, 'direct_messages', selectedChatId);
            const otherParticipants = activeChat?.participants.filter(id => id !== user.uid) || [];
            
            const unreadUpdates: Record<string, any> = {};
            otherParticipants.forEach(id => {
                const currentUnread = activeChat?.unreadCount?.[id] || 0;
                unreadUpdates[`unreadCount.${id}`] = currentUnread + 1;
            });

            await updateDoc(chatRef, {
                lastMessage: messageData.text,
                lastMessageTime: serverTimestamp(),
                ...unreadUpdates
            });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Upload Failed', description: e.message });
        }
    };

    const handleSendAudioMessage = async (audioUrl: string) => {
        if (!selectedChatId || !user || !firestore) return;
        try {
            const messageData: any = {
                text: '🎤 Voice message',
                senderId: user.uid,
                createdAt: serverTimestamp(),
                type: 'audio',
                fileUrl: audioUrl,
                status: 'sent'
            };
            await addDoc(collection(firestore, `direct_messages/${selectedChatId}/messages`), messageData);
            
            const chatRef = doc(firestore, 'direct_messages', selectedChatId);
            const otherParticipants = activeChat?.participants.filter(id => id !== user.uid) || [];
            
            const unreadUpdates: Record<string, any> = {};
            otherParticipants.forEach(id => {
                const currentUnread = activeChat?.unreadCount?.[id] || 0;
                unreadUpdates[`unreadCount.${id}`] = currentUnread + 1;
            });

            await updateDoc(chatRef, {
                lastMessage: '🎤 Voice message',
                lastMessageTime: serverTimestamp(),
                ...unreadUpdates
            });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Audio Upload Failed', description: e.message });
        }
    };

    const handleDeleteMessageEveryone = async (messageId: string) => {
        if (!selectedChatId || !firestore) return;
        try {
            await updateDoc(doc(firestore, `direct_messages/${selectedChatId}/messages`, messageId), {
                isDeleted: true,
                text: 'This message was deleted'
            });
            toast({ title: 'Deleted', description: 'Message deleted for everyone.' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Delete Failed', description: e.message });
        }
    };

    const handleDeleteMessageForMe = async (messageId: string) => {
        if (!selectedChatId || !firestore || !user) return;
        try {
            await updateDoc(doc(firestore, `direct_messages/${selectedChatId}/messages`, messageId), {
                deletedFor: arrayUnion(user.uid)
            });
            toast({ title: 'Deleted', description: 'Message deleted for you.' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Delete Failed', description: e.message });
        }
    };

    const handleForwardMessage = async (msg: Message, targetChatId: string) => {
        if (!firestore || !user) return;
        try {
            const messageData: any = {
                text: msg.text || '',
                senderId: user.uid,
                createdAt: serverTimestamp(),
                status: 'sent'
            };
            if (msg.type) messageData.type = msg.type;
            if (msg.fileUrl) messageData.fileUrl = msg.fileUrl;
            if (msg.fileName) messageData.fileName = msg.fileName;
            if (msg.fileSize) messageData.fileSize = msg.fileSize;

            if (msg.flagged) {
                messageData.flagged = msg.flagged;
                messageData.flagType = msg.flagType;
                messageData.flagExplanation = msg.flagExplanation;
                messageData.educationalMessage = msg.educationalMessage;
            }

            await addDoc(collection(firestore, `direct_messages/${targetChatId}/messages`), messageData);

            const chatRef = doc(firestore, 'direct_messages', targetChatId);
            const targetChat = chats?.find(c => c.id === targetChatId);
            const otherParticipants = targetChat?.participants.filter(id => id !== user.uid) || [];
            
            const unreadUpdates: Record<string, any> = {};
            otherParticipants.forEach(id => {
                const currentUnread = targetChat?.unreadCount?.[id] || 0;
                unreadUpdates[`unreadCount.${id}`] = currentUnread + 1;
            });

            await updateDoc(chatRef, {
                lastMessage: msg.flagged 
                    ? `⚠️ [Flagged: ${msg.flagType}]` 
                    : (msg.type && msg.type !== 'text' 
                        ? `Forwarded ${msg.type === 'image' ? 'Photo 📷' : msg.type === 'video' ? 'Video 🎥' : msg.type === 'audio' ? 'Voice note 🎤' : 'Document 📄'}` 
                        : msg.text),
                lastMessageTime: serverTimestamp(),
                ...unreadUpdates
            });

            toast({ title: 'Forwarded', description: 'Message forwarded successfully.' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Forward Failed', description: e.message });
        }
    };

    const handleEditMessage = async (messageId: string, newText: string) => {
        if (!newText.trim() || !selectedChatId || !firestore) return;
        try {
            // Call AI moderation safety service on edit
            let moderation = { flagged: false, flagType: 'safe' as const, explanation: '', educationalMessage: '' };
            try {
                moderation = await moderateMessageAction(newText) as any;
            } catch (e) {
                console.error("AI Moderation API error on edit, failing safe:", e);
            }

            await updateDoc(doc(firestore, `direct_messages/${selectedChatId}/messages`, messageId), {
                text: newText.trim(),
                edited: true,
                flagged: moderation.flagged || false,
                flagType: moderation.flagType || 'safe',
                flagExplanation: moderation.explanation || '',
                educationalMessage: moderation.educationalMessage || ''
            });

            setEditingMessageId(null);
            setEditText('');

            if (moderation.flagged) {
                toast({
                    variant: 'destructive',
                    title: 'Message Flagged by AI Safety',
                    description: moderation.educationalMessage || 'This content violates safety guidelines.'
                });
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Edit Failed', description: e.message });
        }
    };

    const handleReactToMessage = async (messageId: string, emoji: string) => {
        if (!selectedChatId || !user || !firestore) return;
        try {
            const msgRef = doc(firestore, `direct_messages/${selectedChatId}/messages`, messageId);
            const targetMsg = messages?.find(m => m.id === messageId);
            if (targetMsg) {
                const currentUsers = targetMsg.reactions?.[emoji] || [];
                if (currentUsers.includes(user.uid)) {
                    await updateDoc(msgRef, {
                        [`reactions.${emoji}`]: arrayRemove(user.uid)
                    });
                } else {
                    await updateDoc(msgRef, {
                        [`reactions.${emoji}`]: arrayUnion(user.uid)
                    });
                }
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Reaction Failed', description: e.message });
        }
    };

    const startRecording = async () => {
        if (typeof window === 'undefined' || !navigator.mediaDevices) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            recordingIntervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Mic Access Error', description: 'Could not access your microphone.' });
        }
    };

    const stopRecording = async (shouldSend: boolean) => {
        if (!mediaRecorderRef.current || !isRecording) return;
        
        clearInterval(recordingIntervalRef.current);
        setIsRecording(false);

        const recorder = mediaRecorderRef.current;
        
        return new Promise<void>((resolve) => {
            recorder.onstop = async () => {
                recorder.stream.getTracks().forEach(track => track.stop());

                if (shouldSend && audioChunksRef.current.length > 0) {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    try {
                        setIsSending(true);
                        const storage = getStorage();
                        const fileName = `voice_note_${Date.now()}.webm`;
                        const fileRef = ref(storage, `schools/${schoolId}/chats/${selectedChatId}/${fileName}`);
                        
                        const uploadTask = uploadBytesResumable(fileRef, audioBlob);
                        uploadTask.on('state_changed', 
                            (snapshot) => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                setUploadProgress(progress);
                            }, 
                            (error) => {
                                toast({ variant: 'destructive', title: 'Audio Upload Error', description: error.message });
                                setIsSending(false);
                            }, 
                            async () => {
                                const url = await getDownloadURL(uploadTask.snapshot.ref);
                                await handleSendAudioMessage(url);
                                setIsSending(false);
                            }
                        );
                    } catch (e: any) {
                        toast({ variant: 'destructive', title: 'Upload Failed', description: e.message });
                        setIsSending(false);
                    }
                }
                
                mediaRecorderRef.current = null;
                audioChunksRef.current = [];
                resolve();
            };

            recorder.stop();
        });
    };

    const handleUploadAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedChatId || !schoolId) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const storage = getStorage();
            const fileName = `${Date.now()}_${file.name}`;
            const fileRef = ref(storage, `schools/${schoolId}/chats/${selectedChatId}/${fileName}`);
            
            let fileType: 'image' | 'video' | 'file' = 'file';
            if (file.type.startsWith('image/')) fileType = 'image';
            else if (file.type.startsWith('video/')) fileType = 'video';

            const uploadTask = uploadBytesResumable(fileRef, file);
            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(Math.round(progress));
                }, 
                (error) => {
                    toast({ variant: 'destructive', title: 'Upload Failed', description: error.message });
                    setIsUploading(false);
                }, 
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    await handleSendFileMessage(url, file.name, file.size, fileType);
                    setIsUploading(false);
                    toast({ title: 'Attachment Sent', description: `Successfully uploaded ${file.name}` });
                }
            );
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Upload Error', description: error.message });
            setIsUploading(false);
        }
    };

    const startNewChat = async (targetUid: string, targetUser: SearchUser) => {
        if (!user || !firestore || !schoolId) return;
        const existing = chats?.find(c => c.participants.includes(targetUid));
        if (existing) { setSelectedChatId(existing.id); setIsNewChatOpen(false); return; }
        try {
            const myName = user.displayName || user.email?.split('@')[0] || 'Me';
            const targetName = `${targetUser.firstName || ''} ${targetUser.lastName || ''}`.trim() || 'User';
            const docRef = await addDoc(collection(firestore, 'direct_messages'), {
                participants: [user.uid, targetUid],
                participantDetails: {
                    [user.uid]: { name: myName, role: role || 'Member', photoURL: user.photoURL || null },
                    [targetUid]: { name: targetName, role: targetUser.role || 'Member', photoURL: targetUser.photoURL || null }
                },
                lastMessage: 'Conversation started',
                lastMessageTime: serverTimestamp(),
                unreadCount: { [targetUid]: 0, [user.uid]: 0 },
                schoolId,
            });
            setSelectedChatId(docRef.id);
            setIsNewChatOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        }
    };

    const getOtherParticipant = (chat: ChatMetadata) => {
        if (!user) return { name: 'Unknown', role: '', photoURL: '' };
        const otherId = chat.participants.find(id => id !== user.uid);
        if (!otherId || !chat.participantDetails) return { name: 'Unknown', role: '', photoURL: '' };
        return chat.participantDetails[otherId] || { name: 'Unknown', role: '', photoURL: '' };
    };

    const filteredChats = chats?.filter(chat => {
        if (!chatFilter) return true;
        const other = getOtherParticipant(chat);
        return other.name.toLowerCase().includes(chatFilter.toLowerCase());
    });

    const isLoading = chatsLoading || isLoadingSchool;
    const activeChat = chats?.find(c => c.id === selectedChatId);
    const otherMember = activeChat ? getOtherParticipant(activeChat) : null;

    const typingUsers = useMemo(() => {
        if (!activeChat?.typingState || !user) return [];
        return Object.entries(activeChat.typingState)
            .filter(([uid, isTyping]) => isTyping && uid !== user.uid)
            .map(([uid]) => activeChat.participantDetails?.[uid]?.name || 'Someone');
    }, [activeChat, user]);
    const isAnyoneTyping = typingUsers.length > 0;

    const visibleMessages = useMemo(() => {
        if (!messages || !user) return [];
        return messages.filter(msg => !msg.deletedFor?.includes(user.uid));
    }, [messages, user]);

    // Group messages by date for date separators
    const groupedMessages = visibleMessages.reduce((groups: Record<string, Message[]>, msg) => {
        try {
            const date = msg.createdAt?.toDate ? msg.createdAt.toDate() : new Date();
            const key = format(date, 'yyyy-MM-dd');
            if (!groups[key]) groups[key] = [];
            groups[key].push(msg);
        } catch { 
            const key = 'unknown';
            if (!groups[key]) groups[key] = [];
            groups[key].push(msg);
        }
        return groups;
    }, {});

    return (
        <div className="h-[calc(100vh-100px)] flex gap-0 bg-slate-50/80 backdrop-blur-md overflow-hidden rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] border border-slate-200/40">

            {/* ── SIDEBAR: CONVERSATION LIST ── */}
            <div className={cn(
                "w-full md:w-[320px] lg:w-[360px] shrink-0 flex flex-col bg-white/95 backdrop-blur-md border-r border-slate-150/60",
                selectedChatId && "hidden md:flex"
            )}>
                {/* Sidebar Header */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-150/60 bg-slate-50/20">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-lg font-black text-slate-800 uppercase italic tracking-tight flex items-center gap-1.5">
                                <MessageCircle className="h-5 w-5 text-indigo-600 animate-pulse" />
                                Messages
                            </h1>
                            <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase bg-slate-100 px-2.5 py-0.5 rounded-md mt-1.5 inline-block border border-slate-200/20">
                                {chats?.length || 0} Conversation{chats?.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {isAuthorizedSender && (
                                <button
                                    onClick={() => setIsBroadcastOpen(true)}
                                    disabled={!schoolId}
                                    title="Send Broadcast Message"
                                    className="h-9 w-9 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border border-rose-100"
                                >
                                    <Megaphone className="h-4 w-4" />
                                </button>
                            )}
                            <button
                                onClick={() => setIsNewGroupOpen(true)}
                                disabled={!schoolId}
                                title="Create Group Chat"
                                className="h-9 w-9 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border border-indigo-100"
                            >
                                <Users className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setIsNewChatOpen(true)}
                                disabled={!schoolId}
                                title="New Conversation"
                                className="h-9 w-9 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-805 text-white flex items-center justify-center shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border-none"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input
                            placeholder="Search conversations..."
                            value={chatFilter}
                            onChange={e => setChatFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-300 placeholder:text-slate-400 transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col gap-3 p-4">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                                    <div className="h-12 w-12 rounded-full bg-slate-100 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3.5 bg-slate-100 rounded-full w-3/4" />
                                        <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredChats?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 px-8 text-center">
                            <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                                <MessageCircle className="h-7 w-7 text-slate-300" />
                            </div>
                            <p className="font-bold text-slate-500 text-sm">No conversations yet</p>
                            <p className="text-xs text-slate-400 mt-1 mb-4">Start a chat with a teacher or classmate</p>
                            <button
                                onClick={() => setIsNewChatOpen(true)}
                                disabled={!schoolId}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
                            >
                                <Plus className="h-3 w-3" /> New Conversation
                            </button>
                        </div>
                    ) : (
                        <div className="p-3 space-y-1">
                            {filteredChats?.map(chat => {
                                const other = getOtherParticipant(chat);
                                const isActive = selectedChatId === chat.id;
                                const isGroup = chat.isGroup;
                                const chatName = isGroup ? (chat.groupName || 'Unnamed Group') : other.name;
                                const chatRole = isGroup ? `${chat.participants.length} members` : other.role;
                                const gradient = getAvatarGradient(chatName);

                                const unreadCount = chat.unreadCount?.[user?.uid || ''] || 0;

                                return (
                                    <button
                                        key={chat.id}
                                        onClick={() => setSelectedChatId(chat.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-4 rounded-[1.25rem] transition-all duration-300 text-left relative group/item overflow-hidden",
                                            isActive
                                                ? "bg-gradient-to-r from-indigo-50/60 to-violet-50/40 border border-indigo-100/60 shadow-sm"
                                                : "hover:bg-slate-50/80 border border-transparent hover:translate-x-1"
                                        )}
                                    >
                                        {/* Left Accent indicator for active */}
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-r-md" />
                                        )}

                                        {/* Avatar */}
                                        <div className="relative shrink-0">
                                            <div className={cn(
                                                "h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-base bg-gradient-to-br shadow-sm overflow-hidden transition-transform duration-300 group-hover/item:scale-105",
                                                chat.isAnnouncementChannel ? "from-pink-500 via-rose-500 to-red-600" : gradient
                                            )}>
                                                {chat.isAnnouncementChannel ? (
                                                    <Megaphone className="h-5 w-5 text-white animate-pulse" />
                                                ) : isGroup ? (
                                                    chat.groupAvatar ? (
                                                        <img src={chat.groupAvatar} className="h-12 w-12 object-cover" alt="" />
                                                    ) : (
                                                        <Users className="h-5 w-5 text-white" />
                                                    )
                                                ) : (
                                                    other.photoURL
                                                        ? <img src={other.photoURL} className="h-12 w-12 object-cover" alt="" />
                                                        : other.name.charAt(0)
                                                )}
                                            </div>
                                            {!isGroup && !chat.isAnnouncementChannel && (
                                                <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline justify-between gap-1">
                                                <span className={cn(
                                                    "font-bold text-xs truncate uppercase tracking-tight",
                                                    isActive ? "text-indigo-950" : "text-slate-700"
                                                )}>
                                                    {chatName}
                                                </span>
                                                <span className="text-[9px] text-slate-400 shrink-0 font-bold uppercase tracking-wider">
                                                    {formatChatTime(chat.lastMessageTime)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-1 mt-1">
                                                <p className={cn("text-xs truncate flex-1 font-medium", unreadCount > 0 ? "text-slate-900 font-bold" : "text-slate-400")}>
                                                    {chat.lastMessage}
                                                </p>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {unreadCount > 0 && (
                                                        <span className="text-[9px] font-black h-4.5 min-w-[18px] px-1 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-sm shadow-rose-200 animate-pulse shrink-0">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                    <span className={cn(
                                                        "text-[8px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider shrink-0",
                                                        chat.isAnnouncementChannel
                                                            ? "bg-rose-50 text-rose-700 border-rose-100"
                                                            : isGroup 
                                                                ? "bg-indigo-50 text-indigo-700 border-indigo-100" 
                                                                : getRoleColor(other.role).replace('-100', '-50').replace('-200', '-100')
                                                    )}>
                                                        {chat.isAnnouncementChannel ? "Broadcast" : isGroup ? "Group" : other.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ── MAIN: CHAT WINDOW ── */}
            <div className={cn(
                "flex-1 flex flex-col min-w-0 bg-transparent",
                !selectedChatId && "hidden md:flex"
            )}>
                {selectedChatId && activeChat && otherMember ? (
                    <>
                        {/* Chat Header */}
                        <div 
                            onClick={() => activeChat.isGroup && setIsGroupDetailsOpen(true)}
                            className={cn(
                                "h-20 px-6 flex items-center justify-between border-b border-slate-150/60 sticky top-0 backdrop-blur-xl bg-white/80 z-20 shrink-0 shadow-sm",
                                activeChat.isGroup && "cursor-pointer hover:bg-white/95 transition-colors"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <button
                                    className="md:hidden h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors mr-1 border border-slate-200"
                                    onClick={(e) => { e.stopPropagation(); setSelectedChatId(null); }}
                                >
                                    <ArrowLeft className="h-4 w-4 text-slate-600" />
                                </button>
                                <div className={cn(
                                    "h-11 w-11 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br shadow-sm overflow-hidden shrink-0 border border-white",
                                    activeChat.isAnnouncementChannel ? "from-pink-500 via-rose-500 to-red-600" : getAvatarGradient(activeChat.isGroup ? (activeChat.groupName || 'Group') : otherMember.name)
                                )}>
                                    {activeChat.isAnnouncementChannel ? (
                                        <Megaphone className="h-4.5 w-4.5 text-white" />
                                    ) : activeChat.isGroup ? (
                                        activeChat.groupAvatar ? (
                                            <img src={activeChat.groupAvatar} className="h-11 w-11 object-cover" alt="" />
                                        ) : (
                                            <Users className="h-4.5 w-4.5 text-white" />
                                        )
                                    ) : (
                                        otherMember.photoURL
                                            ? <img src={otherMember.photoURL} className="h-11 w-11 object-cover" alt="" />
                                            : otherMember.name.charAt(0)
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-black text-slate-800 text-sm leading-tight uppercase italic tracking-tight">
                                        {activeChat.isGroup ? activeChat.groupName : otherMember.name}
                                    </h3>
                                    {isAnyoneTyping ? (
                                        <p className="text-[9px] text-emerald-600 font-black tracking-wider uppercase mt-1 animate-pulse italic">
                                            {typingUsers.join(', ')} typing...
                                        </p>
                                    ) : activeChat.isAnnouncementChannel ? (
                                        <p className="text-[8px] text-rose-500 font-black mt-1 uppercase tracking-widest bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md inline-block">
                                            Broadcast Channel · Read-Only
                                        </p>
                                    ) : activeChat.isGroup ? (
                                        <p className="text-[8px] text-indigo-600 font-black mt-1 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md inline-block">
                                            {activeChat.participants.length} Members · View Info
                                        </p>
                                    ) : (
                                        <div className={cn(
                                            "inline-flex items-center gap-1 text-[8px] font-black px-2 py-0.5 rounded-md border mt-1 uppercase tracking-wider",
                                            getRoleColor(otherMember.role).replace('-100', '-50').replace('-200', '-100')
                                        )}>
                                            {getRoleIcon(otherMember.role)}
                                            {otherMember.role}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                {!activeChat.isGroup && (
                                    <>
                                        <button className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                            <Phone className="h-4.5 w-4.5" />
                                        </button>
                                        <button className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                            <Video className="h-4.5 w-4.5" />
                                        </button>
                                    </>
                                )}
                                <button 
                                    onClick={() => activeChat.isGroup ? setIsGroupDetailsOpen(true) : null}
                                    className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                >
                                    <MoreVertical className="h-4.5 w-4.5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto px-6 py-6 space-y-1 relative"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(226 232 240 / 0.8) 1px, transparent 0)`,
                                backgroundSize: '20px 20px',
                                backgroundColor: '#fafbfc'
                            }}
                        >
                            {/* Ambient gradient blur layers */}
                            <div className="absolute top-[20%] left-[10%] w-[250px] h-[250px] rounded-full bg-indigo-200/10 blur-3xl pointer-events-none" />
                            <div className="absolute bottom-[30%] right-[10%] w-[300px] h-[300px] rounded-full bg-violet-200/10 blur-3xl pointer-events-none" />

                            {/* Premium Chat Welcome/Safety Banner */}
                            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-700 text-white shadow-md relative overflow-hidden flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300 z-10 border border-white/10">
                                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
                                <div className="absolute left-1/3 bottom-0 w-16 h-16 bg-white/5 rounded-full blur-lg pointer-events-none" />
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner border border-white/10">
                                        <Sparkles className="h-5 w-5 animate-pulse text-indigo-200" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-wider italic leading-none flex items-center gap-1">
                                            CampusConnect SafeChat
                                        </h4>
                                        <p className="text-[10px] text-indigo-100 font-medium mt-1.5 max-w-[320px] md:max-w-[450px] leading-relaxed">
                                            Keep conversations safe, educational, and respectful. Active AI Safety moderation monitors and flags abusive/romantic language.
                                        </p>
                                    </div>
                                </div>
                                <div className="shrink-0 relative z-10 flex items-center gap-1.5 text-[9px] font-black uppercase bg-emerald-500/20 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-emerald-400/30 text-emerald-200 leading-none">
                                    <Shield className="h-3 w-3 text-emerald-400" />
                                    AI Moderated
                                </div>
                            </div>

                            {msgsLoading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading messages</p>
                                </div>
                            ) : messages?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3">
                                    <div className="h-16 w-16 rounded-2xl bg-white shadow-sm border border-slate-150 flex items-center justify-center">
                                        <MessageCircle className="h-7 w-7 text-slate-300" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-400">No messages yet</p>
                                    <p className="text-xs text-slate-400">Say hello to {otherMember.name}!</p>
                                </div>
                            ) : (
                                groupedMessages && Object.entries(groupedMessages).map(([dateKey, dayMessages]) => {
                                    let dateLabel = '';
                                    try {
                                        const d = new Date(dateKey);
                                        dateLabel = isToday(d) ? 'Today' : isYesterday(d) ? 'Yesterday' : format(d, 'MMMM d, yyyy');
                                    } catch { dateLabel = dateKey; }

                                    return (
                                        <div key={dateKey} className="relative z-10">
                                            {/* Date separator */}
                                            <div className="flex items-center gap-3 py-3">
                                                <div className="flex-1 h-px bg-slate-200" />
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200/40">
                                                    {dateLabel}
                                                </span>
                                                <div className="flex-1 h-px bg-slate-200" />
                                            </div>

                                            {/* Messages for this day */}
                                            <div className="space-y-1">
                                                {dayMessages.map((msg, idx) => {
                                                    const isSystem = msg.senderId === 'system';
                                                    if (isSystem) {
                                                        return (
                                                            <div key={msg.id} className="flex justify-center my-2">
                                                                <span className="text-[9px] font-black text-slate-400 bg-slate-100 border border-slate-200/50 px-3 py-1 rounded-full uppercase tracking-wider text-center">
                                                                    {msg.text}
                                                                </span>
                                                            </div>
                                                        );
                                                    }

                                                    const isMe = msg.senderId === user?.uid;
                                                    const prevMsg = idx > 0 ? dayMessages[idx - 1] : null;
                                                    const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId;
                                                    const nextMsg = dayMessages[idx + 1];
                                                    const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;

                                                    return (
                                                        <div
                                                            key={msg.id}
                                                            onMouseEnter={() => setHoveredMessageId(msg.id)}
                                                            onMouseLeave={() => setHoveredMessageId(null)}
                                                            className={cn(
                                                                "flex items-end gap-2 relative group",
                                                                isMe ? "justify-end" : "justify-start",
                                                                isFirstInGroup ? "mt-3" : "mt-0.5"
                                                            )}
                                                        >
                                                            {/* Other person avatar */}
                                                            {!isMe && (
                                                                <div className="shrink-0 mb-0.5">
                                                                    {isLastInGroup ? (
                                                                        <div className={cn(
                                                                            "h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br shadow-sm overflow-hidden",
                                                                            getAvatarGradient(activeChat.isGroup ? (activeChat.participantDetails?.[msg.senderId]?.name || 'Member') : otherMember.name)
                                                                        )}>
                                                                            {activeChat.isGroup ? (
                                                                                activeChat.participantDetails?.[msg.senderId]?.photoURL ? (
                                                                                    <img src={activeChat.participantDetails[msg.senderId].photoURL} className="h-7 w-7 object-cover" alt="" />
                                                                                ) : (
                                                                                    (activeChat.participantDetails?.[msg.senderId]?.name || 'Member').charAt(0)
                                                                                )
                                                                            ) : (
                                                                                otherMember.photoURL
                                                                                    ? <img src={otherMember.photoURL} className="h-7 w-7 object-cover" alt="" />
                                                                                    : otherMember.name.charAt(0)
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="h-7 w-7" />
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Bubble Wrapper */}
                                                            <div className="flex flex-col max-w-[65%] animate-in fade-in slide-in-from-bottom-2 duration-200 zoom-in-95">
                                                                {/* Bubble */}
                                                                <div className={cn(
                                                                    "px-4 py-2.5 text-xs leading-relaxed shadow-sm font-semibold",
                                                                    isMe
                                                                        ? "bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-md shadow-indigo-100/20 border border-indigo-500/10 rounded-2xl rounded-br-sm"
                                                                        : "bg-white/95 text-slate-800 border border-slate-150/70 shadow-[0_4px_12px_rgba(0,0,0,0.015)] rounded-2xl rounded-bl-sm",
                                                                    !isLastInGroup && isMe && "rounded-br-2xl rounded-tr-sm",
                                                                    !isLastInGroup && !isMe && "rounded-bl-2xl rounded-tl-sm",
                                                                )}>
                                                                    {!isMe && activeChat.isGroup && isFirstInGroup && (
                                                                        <p className="text-[9px] font-black text-indigo-600 mb-1 leading-none uppercase tracking-tight">
                                                                            {activeChat.participantDetails?.[msg.senderId]?.name || 'Member'}
                                                                        </p>
                                                                    )}

                                                                    {/* Quoted Message */}
                                                                    {msg.replyTo && !msg.isDeleted && (
                                                                        <div className={cn(
                                                                            "border-l-4 rounded px-3 py-1.5 mb-2 text-[11px] flex flex-col gap-0.5 max-w-full truncate bg-black/10 backdrop-blur-sm",
                                                                            isMe ? "border-indigo-300 text-indigo-100" : "border-indigo-600 text-slate-600"
                                                                        )}>
                                                                            <span className="font-bold text-[9px] uppercase tracking-wider opacity-90">{msg.replyTo.senderName}</span>
                                                                            <span className="opacity-80 truncate">{msg.replyTo.text}</span>
                                                                        </div>
                                                                    )}

                                                                    {/* Main Message Content */}
                                                                    {msg.isDeleted ? (
                                                                        <p className="italic text-xs flex items-center gap-1.5 opacity-70">
                                                                            <span>🚫 This message was deleted</span>
                                                                        </p>
                                                                    ) : editingMessageId === msg.id ? (
                                                                        <div className="space-y-2 py-1 min-w-[200px]">
                                                                            <Input
                                                                                value={editText}
                                                                                onChange={e => setEditText(e.target.value)}
                                                                                className={cn(
                                                                                    "h-8 text-xs rounded-lg border-2 focus-visible:ring-1",
                                                                                    isMe ? "bg-indigo-700 text-white border-indigo-500 focus-visible:ring-white" : "bg-slate-50 text-slate-800 border-slate-200 focus-visible:ring-indigo-500"
                                                                                )}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter') handleEditMessage(msg.id, editText);
                                                                                    if (e.key === 'Escape') setEditingMessageId(null);
                                                                                }}
                                                                            />
                                                                            <div className="flex gap-1.5 justify-end">
                                                                                <Button 
                                                                                    size="sm" 
                                                                                    variant="ghost" 
                                                                                    onClick={() => setEditingMessageId(null)}
                                                                                    className={cn("h-6 px-2 text-[10px] rounded", isMe ? "text-indigo-200 hover:text-white hover:bg-indigo-700" : "text-slate-500 hover:bg-slate-100")}
                                                                                >
                                                                                    Cancel
                                                                                </Button>
                                                                                <Button 
                                                                                    size="sm" 
                                                                                    onClick={() => handleEditMessage(msg.id, editText)}
                                                                                    className={cn("h-6 px-2 text-[10px] rounded font-bold", isMe ? "bg-white text-indigo-600 hover:bg-slate-100" : "bg-indigo-600 text-white hover:bg-indigo-700")}
                                                                                >
                                                                                    Save
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    ) : msg.type === 'image' ? (
                                                                        <div className="space-y-1.5 py-0.5">
                                                                            <div className="relative rounded-lg overflow-hidden border border-black/5 bg-slate-50/10 max-w-[260px]">
                                                                                <img src={msg.fileUrl} className="max-h-[200px] w-full object-cover rounded-lg" alt={msg.fileName || "Attachment"} />
                                                                                <a 
                                                                                    href={msg.fileUrl} 
                                                                                    target="_blank" 
                                                                                    rel="noopener noreferrer"
                                                                                    className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 rounded-lg"
                                                                                >
                                                                                    <Download className="h-4 w-4" /> Download
                                                                                </a>
                                                                            </div>
                                                                            {msg.fileName && <p className="text-[10px] font-bold opacity-85 truncate max-w-[260px]">{msg.fileName}</p>}
                                                                        </div>
                                                                    ) : msg.type === 'video' ? (
                                                                        <div className="space-y-1.5 py-0.5">
                                                                            <video src={msg.fileUrl} controls className="max-h-[200px] w-full rounded-lg border border-black/5 max-w-[260px]" />
                                                                            {msg.fileName && <p className="text-[10px] font-bold opacity-85 truncate max-w-[260px]">{msg.fileName}</p>}
                                                                        </div>
                                                                    ) : msg.type === 'audio' ? (
                                                                        <div className="py-0.5">
                                                                            <AudioMessagePlayer url={msg.fileUrl || ''} />
                                                                        </div>
                                                                    ) : msg.type === 'file' ? (
                                                                        <div className={cn(
                                                                            "flex items-center gap-3 p-2.5 rounded-xl border max-w-[260px]",
                                                                            isMe ? "bg-indigo-700 border-indigo-500 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                                                                        )}>
                                                                            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                                                                                <FileText className="h-5 w-5 text-indigo-600" />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="text-xs font-semibold truncate leading-tight">{msg.fileName || 'Document'}</p>
                                                                                {msg.fileSize && (
                                                                                    <p className="text-[9px] opacity-70 mt-0.5">
                                                                                        {(msg.fileSize / 1024).toFixed(0)} KB
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            <a
                                                                                href={msg.fileUrl}
                                                                                download={msg.fileName}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className={cn(
                                                                                    "h-8 w-8 rounded-lg flex items-center justify-center transition-colors shrink-0",
                                                                                    isMe ? "hover:bg-indigo-800 text-indigo-200 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                                                                                )}
                                                                            >
                                                                                <Download className="h-4 w-4" />
                                                                            </a>
                                                                        </div>
                                                                    ) : (
                                                                        msg.flagged ? (
                                                                            isMe ? (
                                                                                <div className="space-y-1.5">
                                                                                    <p className="break-words whitespace-pre-wrap">{msg.text}</p>
                                                                                    <div className="flex items-start gap-1.5 p-2 rounded-xl border bg-amber-950/40 border-amber-500/30 text-amber-200 text-[10px] max-w-[260px] text-left">
                                                                                        <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                                                                                        <div className="flex-1">
                                                                                            <span className="font-extrabold uppercase block text-[9px] tracking-wide text-amber-300">Flagged: {msg.flagType}</span>
                                                                                            {msg.educationalMessage && <p className="font-normal opacity-90 leading-tight mt-0.5">{msg.educationalMessage}</p>}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                !revealedMessageIds[msg.id] ? (
                                                                                    <div className="p-3.5 rounded-xl border border-rose-150 bg-rose-50/95 text-rose-800 space-y-2.5 max-w-[260px] animate-in fade-in duration-200 text-left">
                                                                                        <div className="flex items-start gap-2">
                                                                                            <Shield className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                                                                                            <div className="space-y-0.5">
                                                                                                <p className="text-[10px] font-black uppercase tracking-wider text-rose-700">Safety Flag: {msg.flagType}</p>
                                                                                                <p className="text-[10px] leading-tight text-rose-600 font-medium">This message was flagged by the Campus AI Safety Assistant.</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <Button
                                                                                            size="sm"
                                                                                            variant="outline"
                                                                                            onClick={() => setRevealedMessageIds(prev => ({ ...prev, [msg.id]: true }))}
                                                                                            className="w-full bg-white hover:bg-rose-100/50 text-rose-700 border-rose-200 h-7 text-[10px] font-bold rounded-lg transition-all"
                                                                                        >
                                                                                            Reveal message
                                                                                        </Button>
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="space-y-1.5 text-left">
                                                                                        <p className="break-words whitespace-pre-wrap">{msg.text}</p>
                                                                                        <div className="flex items-start gap-1.5 p-2 rounded-xl border bg-rose-50/40 border-rose-150 text-rose-800 text-[10px] max-w-[260px]">
                                                                                            <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                                                                                            <div className="flex-1">
                                                                                                <span className="font-extrabold uppercase block text-[9px] tracking-wide text-rose-700">Safety Flagged: {msg.flagType}</span>
                                                                                                {msg.flagExplanation && <p className="font-normal text-rose-600 leading-tight mt-0.5">{msg.flagExplanation}</p>}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            )
                                                                        ) : (
                                                                            <p className="break-words whitespace-pre-wrap">{msg.text}</p>
                                                                        )
                                                                    )}

                                                                    {/* Message Metadata */}
                                                                    <div className={cn(
                                                                        "text-[8px] font-bold mt-1.5 flex items-center gap-1.5 uppercase",
                                                                        isMe ? "text-indigo-200 justify-end" : "text-slate-400"
                                                                    )}>
                                                                        {msg.edited && !msg.isDeleted && <span className="font-bold italic opacity-75">edited</span>}
                                                                        {msg.createdAt
                                                                            ? format(msg.createdAt.toDate(), 'HH:mm')
                                                                            : <span className="italic text-[8px]">Sending...</span>
                                                                        }
                                                                        {isMe && !msg.isDeleted && (
                                                                            msg.status === 'read' ? (
                                                                                <CheckCheck className="h-3 w-3 text-sky-300" />
                                                                            ) : msg.status === 'delivered' ? (
                                                                                <CheckCheck className="h-3 w-3 text-slate-300" />
                                                                            ) : (
                                                                                <Check className="h-3 w-3 text-slate-300" />
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Reactions Badge Tray */}
                                                                {msg.reactions && Object.entries(msg.reactions).some(([_, uids]) => uids.length > 0) && (
                                                                    <div className={cn(
                                                                        "flex flex-wrap gap-1 mt-1",
                                                                        isMe ? "justify-end" : "justify-start"
                                                                    )}>
                                                                        {Object.entries(msg.reactions)
                                                                            .filter(([_, uids]) => uids.length > 0)
                                                                            .map(([emoji, uids]) => {
                                                                                const hasReacted = uids.includes(user?.uid || '');
                                                                                return (
                                                                                    <button
                                                                                        key={emoji}
                                                                                        onClick={() => handleReactToMessage(msg.id, emoji)}
                                                                                        className={cn(
                                                                                            "inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border shadow-sm transition-all hover:scale-105 active:scale-95",
                                                                                            hasReacted
                                                                                                ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                                                                                                : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                                                                                        )}
                                                                                        title={uids.map(uid => activeChat.participantDetails?.[uid]?.name || 'Someone').join(', ')}
                                                                                    >
                                                                                        <span>{emoji}</span>
                                                                                        <span>{uids.length}</span>
                                                                                    </button>
                                                                                );
                                                                            })}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Actions / Reactions overlay on Hover */}
                                                            {hoveredMessageId === msg.id && !msg.isDeleted && (
                                                                <div className={cn(
                                                                    "flex items-center gap-1.5 backdrop-blur-md bg-white/90 border border-slate-100/85 shadow-lg rounded-full px-2 py-1 z-15 animate-in fade-in zoom-in-95 duration-150 mx-1 mb-1 shrink-0",
                                                                    isMe ? "order-first" : "order-last"
                                                                )}>
                                                                    {/* Reactions Tray */}
                                                                    <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-100">
                                                                        {EMOJI_LIST.map(emoji => {
                                                                            const uids = msg.reactions && msg.reactions[emoji] ? msg.reactions[emoji] : [];
                                                                            const hasReacted = uids.includes(user?.uid || '');
                                                                            return (
                                                                                <button
                                                                                    key={emoji}
                                                                                    onClick={() => handleReactToMessage(msg.id, emoji)}
                                                                                    className={cn(
                                                                                        "h-6 w-6 rounded-full flex items-center justify-center text-sm hover:bg-slate-100/50 transition-all hover:scale-130 active:scale-95",
                                                                                        hasReacted && "bg-indigo-50/50"
                                                                                    )}
                                                                                >
                                                                                    {emoji}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    {/* General Actions */}
                                                                    <div className="flex items-center gap-0.5">
                                                                        <button
                                                                            onClick={() => setReplyingToMessage(msg)}
                                                                            className="h-6 w-6 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                                                                            title="Reply"
                                                                        >
                                                                            <CornerUpLeft className="h-3.5 w-3.5" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setForwardingMessage(msg);
                                                                                setIsForwardOpen(true);
                                                                            }}
                                                                            className="h-6 w-6 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                                                                            title="Forward"
                                                                        >
                                                                            <Forward className="h-3.5 w-3.5" />
                                                                        </button>
                                                                        {isMe && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    setEditingMessageId(msg.id);
                                                                                    setEditText(msg.text);
                                                                                }}
                                                                                className="h-6 w-6 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                                                                                title="Edit"
                                                                            >
                                                                                <Edit3 className="h-3.5 w-3.5" />
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            onClick={() => {
                                                                                setDeletingMessage(msg);
                                                                                setIsDeleteConfirmOpen(true);
                                                                            }}
                                                                            className="h-6 w-6 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                                                                            title="Delete"
                                                                        >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="px-6 py-4 bg-transparent shrink-0 relative z-20">
                            {activeChat.isAnnouncementChannel && !isAuthorizedSender ? (
                                <div className="bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-4.5 flex items-center justify-center gap-2.5 text-slate-400 font-bold text-xs uppercase tracking-wider shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] mx-2 text-center">
                                    <Megaphone className="h-4 w-4 text-indigo-500 animate-bounce shrink-0" />
                                    Only school administrators can post announcements to this channel.
                                </div>
                            ) : (
                                <div className="bg-white/95 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-150/70 rounded-[2rem] p-2 mx-2">
                                    {isEmojiPickerOpen && (
                                        <div className="absolute bottom-[88px] left-8 bg-white/95 backdrop-blur-lg border border-slate-150 shadow-2xl rounded-2xl p-3 z-30 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-[320px]">
                                            <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-100">
                                                <span className="text-[10px] font-black uppercase text-slate-400">Quick Emojis</span>
                                                <button type="button" onClick={() => setIsEmojiPickerOpen(false)} className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-6 gap-2">
                                                {['😀', '😂', '😍', '👍', '❤️', '🎉', '🔥', '🙏', '👏', '💡', '✨', '🚀', '😭', '😎', '🤔', '👀', '💯', '✔️'].map(emoji => (
                                                    <button
                                                        key={emoji}
                                                        type="button"
                                                        onClick={() => {
                                                            setNewMessage(prev => prev + emoji);
                                                            if (inputRef.current) inputRef.current.focus();
                                                        }}
                                                        className="h-10 w-10 flex items-center justify-center text-xl hover:bg-slate-50 rounded-xl active:scale-90 transition-transform"
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {replyingToMessage && (
                                        <div className="flex items-center justify-between bg-indigo-50/50 border-l-4 border-indigo-500 px-4 py-2.5 rounded-xl mb-2.5 mx-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                                                    Replying to {replyingToMessage.senderId === user?.uid ? 'yourself' : (activeChat?.participantDetails?.[replyingToMessage.senderId]?.name || 'Member')}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate mt-0.5">
                                                    {replyingToMessage.isDeleted ? 'This message was deleted' : replyingToMessage.text}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => setReplyingToMessage(null)} 
                                                className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    )}

                                    {isUploading && (
                                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 mb-2.5 mx-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-indigo-600 shrink-0" />
                                            <div className="flex-1">
                                                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                                                    <span>Uploading file...</span>
                                                    <span>{uploadProgress}%</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {isRecording ? (
                                        <div className="flex items-center justify-between bg-rose-500/10 border border-rose-100 rounded-[2.5rem] px-5 py-2.5 w-full animate-in fade-in duration-300">
                                            <div className="flex items-center gap-3">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">Recording Voice Note</span>
                                                <span className="text-[10px] font-black font-mono bg-rose-600 text-white px-2.5 py-0.5 rounded-full shadow-sm shadow-rose-200">
                                                    {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => stopRecording(false)}
                                                    className="h-8 w-8 rounded-full hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                                                    title="Cancel recording"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => stopRecording(true)}
                                                    className="h-8 w-8 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-200 transition-all hover:scale-110 active:scale-95"
                                                    title="Send Voice Note"
                                                >
                                                    <Send className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <form
                                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                            className="flex items-center gap-1.5"
                                        >
                                            <div className="relative shrink-0">
                                                <input
                                                    type="file"
                                                    id="chat-file-upload"
                                                    onChange={handleUploadAttachment}
                                                    className="hidden"
                                                    accept="image/*,video/*,application/pdf,text/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                                                />
                                                <label
                                                    htmlFor="chat-file-upload"
                                                    className="h-9 w-9 rounded-full bg-slate-50 border border-slate-150 hover:bg-slate-100 hover:text-indigo-600 text-slate-500 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                                    title="Attach file"
                                                >
                                                    <Paperclip className="h-4 w-4" />
                                                </label>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                                                className={cn(
                                                    "h-9 w-9 rounded-full border flex items-center justify-center transition-all hover:scale-105 active:scale-95 shrink-0",
                                                    isEmojiPickerOpen 
                                                        ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm" 
                                                        : "bg-slate-50 border-slate-155 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                                                )}
                                                title="Emojis"
                                            >
                                                <Smile className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={startRecording}
                                                className="h-9 w-9 rounded-full bg-slate-50 border border-slate-155 hover:bg-slate-100 hover:text-rose-600 text-slate-500 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shrink-0"
                                                title="Record Voice Note"
                                            >
                                                <Mic className="h-4 w-4" />
                                            </button>

                                            <div className="flex-1 relative">
                                                <input
                                                    ref={inputRef}
                                                    value={newMessage}
                                                    onChange={e => setNewMessage(e.target.value)}
                                                    placeholder={activeChat.isGroup ? `Message ${activeChat.groupName}...` : `Message ${otherMember.name}...`}
                                                    className="w-full px-4.5 py-2.5 bg-slate-50/50 border border-slate-150 focus:bg-white rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-400 placeholder:text-slate-400 transition-all font-semibold"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleSendMessage();
                                                        }
                                                    }}
                                                />
                                            </div>
                                            
                                            <button
                                                type="submit"
                                                disabled={!newMessage.trim() || isSending}
                                                className="h-9 w-9 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-200 disabled:to-slate-200 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-md shadow-indigo-200/50 transition-all hover:scale-105 active:scale-95 shrink-0"
                                            >
                                                {isSending
                                                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    : <Send className="h-3.5 w-3.5" />
                                                }
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* Empty state when no chat selected */
                    <div className="flex-1 flex flex-col items-center justify-center bg-[#fafbfc] relative overflow-hidden px-8"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(226 232 240 / 0.8) 1px, transparent 0)`,
                            backgroundSize: '20px 20px',
                        }}
                    >
                        {/* Soft decorative visual mesh blobs */}
                        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-100/20 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-violet-100/20 blur-3xl pointer-events-none" />

                        <div className="max-w-md w-full bg-white border border-slate-150 rounded-[2.5rem] shadow-xl p-8 text-center space-y-6 relative z-10 overflow-hidden">
                            {/* Decorative background accent */}
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                            
                            <div
                                className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg mx-auto hover:rotate-12 transition-transform duration-300"
                                style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                            >
                                <MessageCircle className="h-7 w-7 text-white" />
                            </div>
                            
                            <div className="space-y-2">
                                <span className="text-[9px] font-black tracking-[0.2em] text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">
                                    Campus Connect Messaging
                                </span>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-3">School Community Chat</h2>
                                <p className="text-xs text-slate-400 font-bold leading-relaxed max-w-xs mx-auto">
                                    Select any active conversation on the left, or launch a direct thread to talk with classmates, parents, and school staff.
                                </p>
                            </div>

                            {/* Safety Notice Banner */}
                            <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-3 text-left">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                    <Shield className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-extrabold text-slate-700 uppercase leading-none">Safety Assistant Active</p>
                                    <p className="text-[9px] text-slate-400 font-semibold mt-1 leading-tight">
                                        Messages are moderated automatically to prevent inappropriate content and protect students.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsNewChatOpen(true)}
                                disabled={!schoolId}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                                Start New Conversation
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {schoolId && (
                <NewChatDialog
                    open={isNewChatOpen}
                    setOpen={setIsNewChatOpen}
                    onStartChat={startNewChat}
                    schoolId={schoolId}
                />
            )}

            {schoolId && (
                <NewGroupDialog
                    open={isNewGroupOpen}
                    setOpen={setIsNewGroupOpen}
                    onCreateGroup={handleCreateGroup}
                    schoolId={schoolId}
                />
            )}

            {activeChat && (
                <GroupDetailsDialog
                    open={isGroupDetailsOpen}
                    setOpen={setIsGroupDetailsOpen}
                    chat={activeChat}
                    currentUser={user}
                    onUpdateGroup={handleUpdateGroup}
                    onLeaveGroup={handleLeaveGroup}
                />
            )}

            <ForwardMessageDialog
                open={isForwardOpen}
                setOpen={setIsForwardOpen}
                chats={chats}
                forwardingMessage={forwardingMessage}
                onForward={handleForwardMessage}
                user={user}
            />

            <DeleteConfirmDialog
                open={isDeleteConfirmOpen}
                setOpen={setIsDeleteConfirmOpen}
                deletingMessage={deletingMessage}
                onDeleteForMe={handleDeleteMessageForMe}
                onDeleteForEveryone={handleDeleteMessageEveryone}
                user={user}
            />

            {schoolId && (
                <BroadcastDialog
                    open={isBroadcastOpen}
                    setOpen={setIsBroadcastOpen}
                    schoolId={schoolId}
                    currentUser={user}
                    role={role || 'Staff'}
                    onStartBroadcast={async (recipients, subject, text, fileUrl, fileName, fileSize, fileType) => {
                        if (!firestore || !user || !schoolId || recipients.length === 0) return;
                        setIsBroadcastOpen(false);
                        setIsBroadcasting(true);
                        setBroadcastTotal(recipients.length);
                        setBroadcastCurrent(0);
                        setBroadcastProgress(0);
                        setBroadcastStatusText("Querying active chats...");
                        setBroadcastLogs(["[INFO] Initiating bulk broadcast transmission...", `[INFO] Targeting ${recipients.length} recipients.`]);

                        try {
                            // 1. Get all active 1-to-1 chats for current user to avoid loops querying firestore
                            const q = query(
                                collection(firestore, 'direct_messages'),
                                where('schoolId', '==', schoolId),
                                where('participants', 'array-contains', user.uid)
                            );
                            const snap = await getDocs(q);
                            const chatsList = snap.docs
                                .map(d => ({ id: d.id, ...d.data() }))
                                .filter((c: any) => !c.isGroup && !c.isAnnouncementChannel && c.participants?.length === 2);

                            setBroadcastLogs(prev => [...prev, `[INFO] Cached active school chats.`]);

                            // 2. Loop through recipients and deliver individual messages
                            for (let i = 0; i < recipients.length; i++) {
                                const recipient = recipients[i];
                                const recipientId = recipient.uid;
                                
                                setBroadcastCurrent(i + 1);
                                setBroadcastProgress(Math.round(((i + 1) / recipients.length) * 100));
                                setBroadcastStatusText(`Sending to ${recipient.firstName} ${recipient.lastName}...`);

                                // Skip self just in case
                                if (recipientId === user.uid) {
                                    setBroadcastLogs(prev => [...prev, `[SKIP] Cannot send message to yourself.`]);
                                    continue;
                                }

                                try {
                                    let chatId = '';
                                    const existingChat = chatsList.find((c: any) => c.participants.includes(recipientId));

                                    if (existingChat) {
                                        chatId = existingChat.id;
                                    } else {
                                        // Create new chat
                                        const recipientName = `${recipient.firstName || ''} ${recipient.lastName || ''}`.trim() || 'User';
                                        const myName = user.displayName || user.email?.split('@')[0] || 'Admin';
                                        const newChatRef = await addDoc(collection(firestore, 'direct_messages'), {
                                            participants: [user.uid, recipientId],
                                            participantDetails: {
                                                [user.uid]: { name: myName, role: role || 'Staff', photoURL: user.photoURL || null },
                                                [recipientId]: { name: recipientName, role: recipient.role || 'Member', photoURL: recipient.photoURL || null }
                                            },
                                            lastMessage: 'Broadcast message',
                                            lastMessageTime: serverTimestamp(),
                                            unreadCount: { [recipientId]: 0, [user.uid]: 0 },
                                            schoolId
                                        });
                                        chatId = newChatRef.id;
                                    }

                                    // Construct the formatted message
                                    const finalMsgText = text.trim() 
                                        ? (subject.trim() ? `📢 **${subject.trim()}**\n\n${text.trim()}` : text.trim())
                                        : (fileUrl ? '📄 Attachment' : 'Broadcast Message');

                                    // Send the message
                                    const messageData: any = {
                                        text: finalMsgText,
                                        senderId: user.uid,
                                        createdAt: serverTimestamp(),
                                        type: fileType || 'text',
                                        status: 'sent'
                                    };
                                    if (fileUrl) {
                                        messageData.fileUrl = fileUrl;
                                        messageData.fileName = fileName;
                                        messageData.fileSize = fileSize;
                                    }

                                    await addDoc(collection(firestore, `direct_messages/${chatId}/messages`), messageData);

                                    // Update chat document metadata
                                    const chatRef = doc(firestore, 'direct_messages', chatId);
                                    
                                    // Fetch current unread count for recipient or use 0
                                    const currentUnread = (existingChat as any)?.unreadCount?.[recipientId] || 0;
                                    
                                    await updateDoc(chatRef, {
                                        lastMessage: messageData.text,
                                        lastMessageTime: serverTimestamp(),
                                        [`unreadCount.${recipientId}`]: currentUnread + 1
                                    });

                                    setBroadcastLogs(prev => [...prev, `[SUCCESS] Delivered to ${recipient.firstName} ${recipient.lastName}`]);
                                } catch (err: any) {
                                    setBroadcastLogs(prev => [...prev, `[ERROR] Failed for ${recipient.firstName}: ${err.message}`]);
                                }
                            }

                            toast({ title: 'Broadcast Sent', description: `Successfully broadcasted to ${recipients.length} recipients.` });
                        } catch (err: any) {
                            console.error("Broadcast transmission error:", err);
                            setBroadcastLogs(prev => [...prev, `[FATAL] Transmission failed: ${err.message}`]);
                            toast({ variant: 'destructive', title: 'Broadcast Failed', description: err.message });
                        } finally {
                            setIsBroadcastCompleted(true);
                            setBroadcastStatusText("Broadcast complete.");
                            setBroadcastLogs(prev => [...prev, "[INFO] Transmission sequence finished."]);
                        }
                    }}
                />
            )}

            {isBroadcasting && (
                <BroadcastingProgressDialog
                    open={isBroadcasting}
                    total={broadcastTotal}
                    current={broadcastCurrent}
                    progress={broadcastProgress}
                    statusText={broadcastStatusText}
                    logs={broadcastLogs}
                    isCompleted={isBroadcastCompleted}
                    onClose={() => {
                        setIsBroadcasting(false);
                        setIsBroadcastCompleted(false);
                    }}
                />
            )}
        </div>
    );
}

// --- FORWARD MESSAGE DIALOG ---
function ForwardMessageDialog({ open, setOpen, chats, forwardingMessage, onForward, user }: {
    open: boolean;
    setOpen: (o: boolean) => void;
    chats: ChatMetadata[] | null | undefined;
    forwardingMessage: Message | null;
    onForward: (msg: Message, targetChatId: string) => Promise<void>;
    user: any;
}) {
    const [searchTerm, setSearchTerm] = useState('');

    if (!forwardingMessage) return null;

    const filteredChats = chats?.filter(chat => {
        if (chat.isGroup) {
            return chat.groupName?.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
            const other = chat.participantDetails && Object.entries(chat.participantDetails)
                .find(([uid]) => uid !== user?.uid)?.[1];
            return other?.name.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    const handleSelectChat = async (chatId: string) => {
        await onForward(forwardingMessage, chatId);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-5 text-white">
                    <DialogTitle className="text-lg font-bold tracking-tight">Forward Message</DialogTitle>
                    <p className="text-indigo-200 text-xs mt-1">Select a conversation to forward this message to</p>
                </div>
                <div className="px-4 pt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 h-10 bg-slate-50 border-2 rounded-xl focus-visible:ring-indigo-500 text-sm"
                        />
                    </div>
                </div>
                <div className="p-4 max-h-[300px] overflow-y-auto space-y-1">
                    {filteredChats && filteredChats.length > 0 ? (
                        filteredChats.map(chat => {
                            const isGroup = chat.isGroup;
                            let chatName = 'Chat';
                            let chatAvatar = '';
                            if (isGroup) {
                                chatName = chat.groupName || 'Unnamed Group';
                                chatAvatar = chat.groupAvatar || '';
                            } else {
                                const other = chat.participantDetails && Object.entries(chat.participantDetails)
                                    .find(([uid]) => uid !== user?.uid)?.[1];
                                chatName = other?.name || 'User';
                                chatAvatar = other?.photoURL || '';
                            }

                            return (
                                <button
                                    key={chat.id}
                                    onClick={() => handleSelectChat(chat.id)}
                                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-slate-100"
                                >
                                    <div className={cn(
                                        "h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br shadow-sm overflow-hidden shrink-0",
                                        getAvatarGradient(chatName)
                                    )}>
                                        {chatAvatar ? (
                                            <img src={chatAvatar} className="h-9 w-9 object-cover" alt="" />
                                        ) : (
                                            chatName.charAt(0)
                                        )}
                                    </div>
                                    <span className="font-semibold text-sm text-slate-800 truncate">{chatName}</span>
                                </button>
                            );
                        })
                    ) : (
                        <p className="text-center text-xs text-slate-400 py-8">No chats found</p>
                    )}
                </div>
                <div className="bg-slate-50 px-4 py-3 flex justify-end border-t border-slate-100">
                    <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl h-9 text-xs">
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- DELETE CONFIRM DIALOG ---
function DeleteConfirmDialog({ open, setOpen, deletingMessage, onDeleteForMe, onDeleteForEveryone, user }: {
    open: boolean;
    setOpen: (o: boolean) => void;
    deletingMessage: Message | null;
    onDeleteForMe: (messageId: string) => Promise<void>;
    onDeleteForEveryone: (messageId: string) => Promise<void>;
    user: any;
}) {
    if (!deletingMessage) return null;

    const isMyMessage = deletingMessage.senderId === user?.uid;

    const handleDeleteForMe = async () => {
        await onDeleteForMe(deletingMessage.id);
        setOpen(false);
    };

    const handleDeleteForEveryone = async () => {
        await onDeleteForEveryone(deletingMessage.id);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[360px] p-5 rounded-2xl border-0 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-slate-800 text-base font-bold">Delete message?</DialogTitle>
                </DialogHeader>
                <p className="text-xs text-slate-500 leading-relaxed mt-2">
                    {isMyMessage 
                        ? 'Would you like to delete this message for yourself, or delete it for everyone in the conversation?'
                        : 'Are you sure you want to delete this message for yourself? Other participants will still be able to see it.'
                    }
                </p>
                <div className="flex flex-col gap-2 mt-4">
                    {isMyMessage && (
                        <Button
                            onClick={handleDeleteForEveryone}
                            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold h-10 shadow-sm"
                        >
                            Delete for Everyone
                        </Button>
                    )}
                    <Button
                        onClick={handleDeleteForMe}
                        variant="outline"
                        className="w-full text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold h-10 border border-slate-200"
                    >
                        Delete for Me
                    </Button>
                    <Button
                        onClick={() => setOpen(false)}
                        variant="ghost"
                        className="w-full text-slate-500 hover:bg-slate-50 rounded-xl text-xs font-bold h-10"
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- BROADCAST DIALOG ---
interface BroadcastRecipient {
    uid: string;
    firstName: string;
    lastName: string;
    role: string;
    photoURL?: string;
}

const BROADCAST_TEMPLATES = [
    {
        title: "Weather Alert",
        subject: "Urgent: Inclement Weather Advisory",
        text: "Dear School Community, due to predicted inclement weather, school operations will be suspended tomorrow. Classes will resume online via the student portals. Please stay safe.",
        badgeColor: "bg-amber-50 text-amber-700 border-amber-200"
    },
    {
        title: "Exam Schedule",
        subject: "Academic Update: Final Examinations Timetable",
        text: "Dear Students and Parents, the official timetable for the upcoming End-of-Term Examinations has been published. Please review the schedules on the Academic Dashboard. Best of luck to all candidates.",
        badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200"
    },
    {
        title: "Fees Announcement",
        subject: "Financial Notice: Term Fee Statements",
        text: "Dear Parents, Term fee statements have been updated on the financial dashboard. We kindly request all payments be finalized by the due date. For receivables queries, contact our accountant office.",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    {
        title: "General Notice",
        subject: "School Update: General Announcement",
        text: "Dear School Community, we would like to share general updates regarding our upcoming events and administrative changes. Please check the attachment and calendar for details.",
        badgeColor: "bg-rose-50 text-rose-700 border-rose-200"
    }
];

function BroadcastDialog({ open, setOpen, schoolId, currentUser, role, onStartBroadcast }: {
    open: boolean;
    setOpen: (o: boolean) => void;
    schoolId: string;
    currentUser: any;
    role: string;
    onStartBroadcast: (
        recipients: BroadcastRecipient[],
        subject: string,
        text: string,
        fileUrl?: string,
        fileName?: string,
        fileSize?: number,
        fileType?: 'image' | 'video' | 'file'
    ) => Promise<void>;
}) {
    const firestore = useFirestore();
    const { toast } = useToast();

    const [targetType, setTargetType] = useState<'students' | 'staff' | 'parents' | 'custom'>('students');
    const [broadcastSubject, setBroadcastSubject] = useState('');
    const [broadcastText, setBroadcastText] = useState('');
    
    // Custom selection states
    const [customSearchRole, setCustomSearchRole] = useState<'students' | 'staff' | 'parents'>('students');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<BroadcastRecipient[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedRecipients, setSelectedRecipients] = useState<BroadcastRecipient[]>([]);

    // Estimates counts
    const [estimateCounts, setEstimateCounts] = useState<Record<string, number>>({
        students: 0,
        staff: 0,
        parents: 0
    });
    const [isLoadingEstimates, setIsLoadingEstimates] = useState(false);

    // AI Polishing states
    const [isPolishing, setIsPolishing] = useState(false);

    // File selection
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Load estimates on open
    const fetchCounts = async () => {
        if (!firestore || !schoolId) return;
        setIsLoadingEstimates(true);
        try {
            const studentsSnap = await getDocs(query(collection(firestore, 'students'), where('schoolId', '==', schoolId)));
            const staffSnap = await getDocs(query(collection(firestore, 'staff'), where('schoolId', '==', schoolId)));
            const parentsSnap = await getDocs(query(collection(firestore, 'parents'), where('schoolId', '==', schoolId)));
            
            setEstimateCounts({
                students: studentsSnap.docs.filter(d => d.id !== currentUser?.uid && d.data().enrollmentStatus !== 'Inactive').length,
                staff: staffSnap.docs.filter(d => d.id !== currentUser?.uid).length,
                parents: parentsSnap.docs.filter(d => d.id !== currentUser?.uid).length
            });
        } catch (err) {
            console.error("Failed to estimate recipient counts:", err);
        } finally {
            setIsLoadingEstimates(false);
        }
    };

    // Reset state on open
    useEffect(() => {
        if (open) {
            setTargetType('students');
            setBroadcastSubject('');
            setBroadcastText('');
            setCustomSearchRole('students');
            setSearchTerm('');
            setSearchResults([]);
            setSelectedRecipients([]);
            setSelectedFile(null);
            setIsUploadingFile(false);
            setUploadProgress(0);
            fetchCounts();
        }
    }, [open, firestore, schoolId]);

    const handleSearch = async () => {
        if (!firestore || !schoolId) return;
        setIsSearching(true);
        try {
            const q = query(collection(firestore, customSearchRole), where('schoolId', '==', schoolId), limit(50));
            const snap = await getDocs(q);
            const users = snap.docs.map(d => {
                const data = d.data();
                let effectiveRole = data.role;
                if (!effectiveRole) {
                    if (customSearchRole === 'students') effectiveRole = 'Student';
                    if (customSearchRole === 'parents') effectiveRole = 'Parent';
                    if (customSearchRole === 'staff') effectiveRole = 'Staff';
                }
                return {
                    ...data,
                    uid: d.id,
                    role: effectiveRole || 'Member'
                };
            }) as BroadcastRecipient[];

            const filtered = users.filter(u => {
                if (customSearchRole === 'students' && (u as any).enrollmentStatus === 'Inactive') return false;
                return ((u.firstName || '') + ' ' + (u.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase());
            });
            setSearchResults(filtered.filter(u => u.uid !== currentUser?.uid));
        } catch (e) {
            console.error("Search broadcast error:", e);
        } finally {
            setIsSearching(false);
        }
    };

    const toggleRecipient = (recipient: BroadcastRecipient) => {
        setSelectedRecipients(prev => {
            const exists = prev.find(r => r.uid === recipient.uid);
            if (exists) {
                return prev.filter(r => r.uid !== recipient.uid);
            } else {
                return [...prev, recipient];
            }
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleAIPolish = (tone: 'professional' | 'urgent' | 'empathetic') => {
        if (!broadcastText.trim()) {
            toast({ title: 'AI Assistant', description: 'Please type some text first to polish.' });
            return;
        }
        setIsPolishing(true);
        setTimeout(() => {
            let polished = broadcastText;
            // Clean standard prefix if already polished
            let cleanedText = broadcastText.replace(/^Dear School Community,\n\nWe would like to formally announce: /, '');
            cleanedText = cleanedText.replace(/\n\nThank you for your continued cooperation\.\n\nWarm regards,\nSchool Administration$/, '');
            cleanedText = cleanedText.replace(/^🚨 URGENT NOTICE:\n\n/, '');
            cleanedText = cleanedText.replace(/\n\nAction Required: Please read the details above immediately and reply if necessary\.$/, '');
            cleanedText = cleanedText.replace(/^Dear Families,\n\nWe understand the importance of clear communication in our school community\. We want to share that: /, '');
            cleanedText = cleanedText.replace(/\n\nWe appreciate your support and are here to help if you have any questions\.\n\nBest wishes\.$/, '');

            if (tone === 'professional') {
                polished = `Dear School Community,\n\nWe would like to formally announce: ${cleanedText}\n\nThank you for your continued cooperation.\n\nWarm regards,\nSchool Administration`;
            } else if (tone === 'urgent') {
                polished = `🚨 URGENT NOTICE:\n\n${cleanedText}\n\nAction Required: Please read the details above immediately and reply if necessary.`;
            } else if (tone === 'empathetic') {
                polished = `Dear Families,\n\nWe understand the importance of clear communication in our school community. We want to share that: ${cleanedText}\n\nWe appreciate your support and are here to help if you have any questions.\n\nBest wishes.`;
            }
            setBroadcastText(polished);
            setIsPolishing(false);
            toast({ title: 'AI Tone Polish Applied', description: `Polished message to an ${tone} tone.` });
        }, 600);
    };

    const handleSend = async () => {
        if (!broadcastText.trim() && !selectedFile) {
            toast({ variant: 'destructive', title: 'Empty Message', description: 'Please enter a message or select a file.' });
            return;
        }

        let recipientsList: BroadcastRecipient[] = [];

        if (targetType === 'custom') {
            recipientsList = selectedRecipients;
            if (recipientsList.length === 0) {
                toast({ variant: 'destructive', title: 'No Recipients Selected', description: 'Please select at least one recipient.' });
                return;
            }
        } else {
            setIsUploadingFile(true);
            try {
                const q = query(collection(firestore!, targetType), where('schoolId', '==', schoolId));
                const snap = await getDocs(q);
                recipientsList = snap.docs.map(d => {
                    const data = d.data();
                    let rRole = data.role;
                    if (!rRole) {
                        if (targetType === 'students') rRole = 'Student';
                        if (targetType === 'parents') rRole = 'Parent';
                        if (targetType === 'staff') rRole = 'Staff';
                    }
                    return {
                        uid: d.id,
                        firstName: data.firstName || '',
                        lastName: data.lastName || '',
                        role: rRole || 'Member',
                        photoURL: data.photoURL || undefined,
                        enrollmentStatus: data.enrollmentStatus
                    };
                }).filter(u => u.uid !== currentUser?.uid && !(targetType === 'students' && u.enrollmentStatus === 'Inactive'));
            } catch (err: any) {
                toast({ variant: 'destructive', title: 'Target Query Failed', description: err.message });
                setIsUploadingFile(false);
                return;
            }
            setIsUploadingFile(false);
        }

        if (recipientsList.length === 0) {
            toast({ variant: 'destructive', title: 'Target list empty', description: 'No recipients found for this selection.' });
            return;
        }

        let fileUrl = '';
        let fileType: 'image' | 'video' | 'file' | undefined = undefined;

        if (selectedFile) {
            setIsUploadingFile(true);
            setUploadProgress(0);
            try {
                const storage = getStorage();
                const path = `schools/${schoolId}/broadcasts/${Date.now()}_${selectedFile.name}`;
                const fileRef = ref(storage, path);
                
                if (selectedFile.type.startsWith('image/')) fileType = 'image';
                else if (selectedFile.type.startsWith('video/')) fileType = 'video';
                else fileType = 'file';

                const uploadTask = uploadBytesResumable(fileRef, selectedFile);
                
                await new Promise<void>((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setUploadProgress(Math.round(progress));
                        },
                        (error) => reject(error),
                        async () => {
                            fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
                            resolve();
                        }
                    );
                });
            } catch (err: any) {
                toast({ variant: 'destructive', title: 'File upload failed', description: err.message });
                setIsUploadingFile(false);
                return;
            }
            setIsUploadingFile(false);
        }

        await onStartBroadcast(
            recipientsList,
            broadcastSubject.trim(),
            broadcastText.trim(),
            fileUrl || undefined,
            selectedFile?.name || undefined,
            selectedFile?.size || undefined,
            fileType
        );
    };

    const activeRecipientsCount = targetType === 'custom' 
        ? selectedRecipients.length 
        : (estimateCounts[targetType] || 0);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[840px] p-0 overflow-hidden rounded-[2rem] border-0 shadow-2xl bg-white font-sans">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 p-6 text-white relative overflow-hidden border-b border-rose-100/10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_rgba(255,255,255,0))] pointer-events-none" />
                    <DialogTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
                        <Megaphone className="h-5 w-5 animate-pulse shrink-0" />
                        Send Bulk Broadcast Notice
                    </DialogTitle>
                    <p className="text-rose-100 text-xs font-semibold mt-1 max-w-xl">
                        Delivers individual 1-to-1 inbox messages directly to the selected target group. Recipients will see it as a direct message.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row h-[560px] bg-white divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    {/* LEFT PANEL: Target Selection */}
                    <div className="w-full md:w-[340px] shrink-0 bg-slate-50/50 p-6 flex flex-col overflow-y-auto">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3.5 block">Select Target Segment</label>
                        
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {/* All Students */}
                            <button
                                type="button"
                                onClick={() => setTargetType('students')}
                                className={cn(
                                    "p-3 rounded-2xl border flex flex-col text-left justify-between h-[88px] transition-all hover:scale-102 active:scale-98",
                                    targetType === 'students'
                                        ? "bg-gradient-to-br from-indigo-500 to-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-100/35"
                                        : "bg-white border-slate-200/60 text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <GraduationCap className={cn("h-5 w-5", targetType === 'students' ? "text-white" : "text-indigo-500")} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wide opacity-80">Students</p>
                                    <p className="text-xs font-bold leading-none mt-0.5">
                                        {isLoadingEstimates ? '...' : `${estimateCounts.students} active`}
                                    </p>
                                </div>
                            </button>

                            {/* All Staff */}
                            <button
                                type="button"
                                onClick={() => setTargetType('staff')}
                                className={cn(
                                    "p-3 rounded-2xl border flex flex-col text-left justify-between h-[88px] transition-all hover:scale-102 active:scale-98",
                                    targetType === 'staff'
                                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-500 text-white shadow-md shadow-emerald-100/35"
                                        : "bg-white border-slate-200/60 text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <BookOpen className={cn("h-5 w-5", targetType === 'staff' ? "text-white" : "text-emerald-500")} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wide opacity-80">Staff & Teachers</p>
                                    <p className="text-xs font-bold leading-none mt-0.5">
                                        {isLoadingEstimates ? '...' : `${estimateCounts.staff} active`}
                                    </p>
                                </div>
                            </button>

                            {/* All Parents */}
                            <button
                                type="button"
                                onClick={() => setTargetType('parents')}
                                className={cn(
                                    "p-3 rounded-2xl border flex flex-col text-left justify-between h-[88px] transition-all hover:scale-102 active:scale-98",
                                    targetType === 'parents'
                                        ? "bg-gradient-to-br from-amber-500 to-orange-600 border-amber-500 text-white shadow-md shadow-amber-100/35"
                                        : "bg-white border-slate-200/60 text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <HeartHandshake className={cn("h-5 w-5", targetType === 'parents' ? "text-white" : "text-amber-500")} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wide opacity-80">Parents</p>
                                    <p className="text-xs font-bold leading-none mt-0.5">
                                        {isLoadingEstimates ? '...' : `${estimateCounts.parents} active`}
                                    </p>
                                </div>
                            </button>

                            {/* Custom Selection */}
                            <button
                                type="button"
                                onClick={() => setTargetType('custom')}
                                className={cn(
                                    "p-3 rounded-2xl border flex flex-col text-left justify-between h-[88px] transition-all hover:scale-102 active:scale-98",
                                    targetType === 'custom'
                                        ? "bg-gradient-to-br from-rose-500 to-pink-600 border-rose-500 text-white shadow-md shadow-rose-100/35"
                                        : "bg-white border-slate-200/60 text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <Users className={cn("h-5 w-5", targetType === 'custom' ? "text-white" : "text-rose-500")} />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wide opacity-80">Custom</p>
                                    <p className="text-xs font-bold leading-none mt-0.5">
                                        {selectedRecipients.length} selected
                                    </p>
                                </div>
                            </button>
                        </div>

                        {/* CUSTOM SELECTION MODULE */}
                        {targetType === 'custom' && (
                            <div className="flex-1 flex flex-col min-h-0 bg-white border border-slate-150/80 rounded-2xl p-4.5 space-y-3.5 animate-in fade-in duration-200 shadow-sm">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Custom Recipient Selector</span>
                                
                                {/* Inner subtabs */}
                                <div className="grid grid-cols-3 gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-100 animate-in fade-in duration-200">
                                    {(['students', 'staff', 'parents'] as const).map(roleKey => (
                                        <button
                                            key={roleKey}
                                            type="button"
                                            onClick={() => { setCustomSearchRole(roleKey); setSearchResults([]); }}
                                            className={cn(
                                                "py-1.5 text-[9px] font-black uppercase tracking-wider rounded-md transition-all text-center border border-transparent",
                                                customSearchRole === roleKey
                                                    ? "bg-white text-rose-600 shadow-sm border-slate-200/50 font-black"
                                                    : "text-slate-500 hover:text-slate-800"
                                            )}
                                        >
                                            {roleKey === 'staff' ? 'Staff' : roleKey}
                                        </button>
                                    ))}
                                </div>

                                {/* Search box */}
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-150/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-500/10 transition-all">
                                    <Input
                                        placeholder={`Search ${customSearchRole}...`}
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                        className="border-0 bg-transparent focus-visible:ring-0 text-xs placeholder:text-slate-400 p-0 h-6"
                                    />
                                    <button onClick={handleSearch} disabled={isSearching} className="h-6 w-6 rounded-lg bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-transform active:scale-90 shrink-0">
                                        {isSearching ? <Loader2 className="h-3 w-3 animate-spin"/> : <Search className="h-3 w-3"/>}
                                    </button>
                                </div>

                                {/* Selected badge list */}
                                {selectedRecipients.length > 0 && (
                                    <div className="flex flex-wrap gap-1 p-1.5 bg-slate-50/50 border border-slate-100 rounded-lg max-h-[88px] overflow-y-auto shrink-0 animate-in fade-in">
                                        {selectedRecipients.map(r => (
                                            <Badge key={r.uid} variant="secondary" className="pl-1.5 pr-1 py-0.5 rounded-md bg-rose-50 border-rose-100 text-rose-700 font-bold text-[9px] flex items-center gap-1">
                                                <span>{r.firstName} {r.lastName.charAt(0)}.</span>
                                                <button onClick={() => toggleRecipient(r)} className="text-rose-400 hover:text-rose-600 shrink-0">
                                                    <X className="h-2.5 w-2.5" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {/* Search result list */}
                                <div className="flex-1 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50 bg-white">
                                    {searchResults.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center p-4 text-center text-slate-350 gap-1.5">
                                            <Search className="h-5 w-5 opacity-40 text-slate-400" />
                                            <p className="text-[10px] font-bold text-slate-400">Search results will list here</p>
                                        </div>
                                    ) : (
                                        searchResults.map(user => {
                                            const isSelected = selectedRecipients.some(r => r.uid === user.uid);
                                            return (
                                                <div key={user.uid} className="flex items-center justify-between p-2 hover:bg-slate-50 transition-colors">
                                                    <div className="min-w-0 pr-2">
                                                        <p className="text-xs font-bold text-slate-700 truncate leading-tight">{user.firstName} {user.lastName}</p>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">{user.role}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleRecipient(user)}
                                                        className={cn(
                                                            "h-6 px-2.5 text-[9px] font-black uppercase tracking-wider rounded-lg text-white transition-all hover:scale-105 active:scale-95",
                                                            isSelected ? "bg-rose-500 hover:bg-rose-600 shadow-md shadow-rose-100" : "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100"
                                                        )}
                                                    >
                                                        {isSelected ? 'Remove' : 'Add'}
                                                    </button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT PANEL: Content Composer */}
                    <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
                        {/* Title Subject */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Notice Title / Subject (Optional)</label>
                            <Input
                                placeholder="e.g. Inclement Weather Closure Announcement..."
                                value={broadcastSubject}
                                onChange={e => setBroadcastSubject(e.target.value)}
                                className="h-10 rounded-xl border-slate-200 text-xs font-semibold focus-visible:ring-rose-500/25 focus-visible:ring-2 focus-visible:border-rose-400"
                            />
                        </div>

                        {/* Templates */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Quick Templates</label>
                            <div className="flex flex-wrap gap-1.5">
                                {BROADCAST_TEMPLATES.map(tpl => (
                                    <button
                                        key={tpl.title}
                                        type="button"
                                        onClick={() => {
                                            setBroadcastSubject(tpl.subject);
                                            setBroadcastText(tpl.text);
                                        }}
                                        className={cn(
                                            "px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95",
                                            tpl.badgeColor
                                        )}
                                    >
                                        {tpl.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message Body */}
                        <div className="space-y-1.5 flex-1 flex flex-col min-h-[140px]">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Message Content</label>
                                
                                {/* AI Polishing Chips */}
                                <div className="flex items-center gap-1">
                                    <span className="text-[9px] font-black text-rose-500 flex items-center gap-0.5 uppercase tracking-wider mr-1">
                                        <Sparkles className="h-3 w-3 animate-pulse" />
                                        AI Refiner:
                                    </span>
                                    {isPolishing ? (
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Polishing...</span>
                                    ) : (
                                        (['professional', 'urgent', 'empathetic'] as const).map(tone => (
                                            <button
                                                key={tone}
                                                type="button"
                                                onClick={() => handleAIPolish(tone)}
                                                className="px-2 py-0.5 text-[8px] font-bold border border-slate-200/80 hover:border-indigo-300 hover:text-indigo-600 bg-white rounded-md text-slate-500 capitalize transition-all hover:scale-102"
                                            >
                                                {tone}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                            <textarea
                                placeholder="Type your announcement contents here..."
                                value={broadcastText}
                                onChange={e => setBroadcastText(e.target.value)}
                                className="w-full flex-1 p-3.5 rounded-xl border border-slate-200 bg-slate-50/30 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/15 focus:border-rose-400 focus:bg-white transition-all resize-none leading-relaxed"
                            />
                        </div>

                        {/* Attachment */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Media Attachment (Optional)</label>
                            {selectedFile ? (
                                <div className="flex items-center justify-between bg-rose-50/30 border border-rose-100 rounded-xl p-3 animate-in fade-in duration-200">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                                            <FileText className="h-4.5 w-4.5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-slate-800 truncate leading-tight">{selectedFile.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedFile(null)} className="h-7 w-7 rounded-full hover:bg-slate-200/50 flex items-center justify-center text-slate-400 hover:text-slate-650 transition-colors">
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-3.5 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-350 transition-all relative cursor-pointer">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="text-center space-y-0.5 text-slate-400">
                                        <Paperclip className="h-4.5 w-4.5 mx-auto text-slate-450 hover:scale-110 duration-200" />
                                        <p className="text-[10px] font-bold text-slate-500">Drag/Select Attachment</p>
                                        <p className="text-[8px] text-slate-400">Images, Videos, PDFs, docs up to 50MB</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* File Uploading Progress Indicator */}
                        {isUploadingFile && (
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-3 animate-in fade-in duration-200">
                                <Loader2 className="h-4 w-4 animate-spin text-rose-500 shrink-0" />
                                <div className="flex-1">
                                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase mb-1">
                                        <span>Uploading attachment...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-500 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100 shrink-0">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                        {activeRecipientsCount > 0 
                            ? `📢 Sending to ${activeRecipientsCount} recipient${activeRecipientsCount !== 1 ? 's' : ''}`
                            : 'No target selected'
                        }
                    </span>
                    
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={isUploadingFile} className="rounded-xl h-10 px-4 text-xs font-bold border-slate-200 text-slate-500 hover:bg-slate-100">
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSend} 
                            disabled={isUploadingFile || (!broadcastText.trim() && !selectedFile) || activeRecipientsCount === 0}
                            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl h-10 px-5 font-bold text-xs uppercase tracking-wider shadow-md shadow-rose-100 hover:scale-103 active:scale-97 transition-all flex items-center gap-1.5 border-none"
                        >
                            <Send className="h-3.5 w-3.5" /> Send Broadcast
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- BROADCASTING PROGRESS DIALOG ---
function BroadcastingProgressDialog({ open, total, current, progress, statusText, logs, isCompleted, onClose }: {
    open: boolean;
    total: number;
    current: number;
    progress: number;
    statusText: string;
    logs: string[];
    isCompleted: boolean;
    onClose: () => void;
}) {
    const logEndRef = useRef<HTMLDivElement | null>(null);

    // Auto scroll the logs feed
    useEffect(() => {
        if (logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    // SVG Circular Progress Constants
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <Dialog open={open} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-[460px] p-6 rounded-3xl border-0 shadow-2xl bg-slate-950 text-white text-center font-sans">
                
                {/* SVG circular progress ring */}
                <div className="relative h-28 w-28 mx-auto flex items-center justify-center mt-3">
                    <svg className="h-full w-full rotate-270 transform">
                        <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            stroke="currentColor"
                            strokeWidth="6"
                            className="text-slate-800"
                            fill="transparent"
                        />
                        <circle
                            cx="56"
                            cy="56"
                            r={radius}
                            stroke="url(#progress-gradient)"
                            strokeWidth="6"
                            className="transition-all duration-300"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f43f5e" />
                                <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                        </defs>
                    </svg>
                    
                    <div className="absolute flex flex-col items-center justify-center">
                        {isCompleted ? (
                            <CheckCircle2 className="h-8 w-8 text-emerald-400 animate-in zoom-in-50 duration-300" />
                        ) : (
                            <span className="text-lg font-black text-white font-mono leading-none">{progress}%</span>
                        )}
                    </div>
                </div>

                <div className="space-y-1.5 mt-2">
                    <DialogTitle className="text-white text-base font-black uppercase tracking-tight">
                        {isCompleted ? 'Transmission Completed' : 'Sending Broadcast Notice'}
                    </DialogTitle>
                    <p className="text-slate-450 text-[10px] font-black uppercase tracking-widest font-mono">
                        Recipient {current} of {total}
                    </p>
                </div>

                {/* Real-time Logger Console */}
                <div className="bg-black/60 border border-slate-900 rounded-2xl p-4 h-[150px] overflow-y-auto text-left font-mono text-[9px] leading-relaxed text-slate-300 space-y-1 shadow-inner select-none mt-2">
                    {logs.map((log, index) => {
                        const isError = log.includes('[ERROR]') || log.includes('[FATAL]');
                        const isSuccess = log.includes('[SUCCESS]');
                        const isSkip = log.includes('[SKIP]');
                        return (
                            <div key={index} className={cn(
                                "flex items-start gap-1.5",
                                isError ? "text-rose-400" : isSuccess ? "text-emerald-400" : isSkip ? "text-amber-400" : "text-slate-400"
                            )}>
                                <span className="opacity-70">[{index + 1}]</span>
                                <span className="break-all">{log}</span>
                            </div>
                        );
                    })}
                    <div ref={logEndRef} />
                </div>

                <p className={cn(
                    "text-xs font-bold italic mt-3 animate-pulse uppercase tracking-wider leading-none",
                    isCompleted ? "text-emerald-400" : "text-slate-400"
                )}>
                    {statusText}
                </p>

                {/* Bottom Trigger button on complete */}
                {isCompleted && (
                    <div className="pt-2">
                        <Button 
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-xs uppercase tracking-widest rounded-xl py-3 shadow-md shadow-rose-950/20 active:scale-97 hover:scale-102 transition-all duration-200 border-none h-11"
                        >
                            Dismiss Dashboard
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
