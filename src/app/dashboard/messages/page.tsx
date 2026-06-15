'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, where, doc, updateDoc, limit, getDocs } from 'firebase/firestore'; 
import { 
  MessageCircle, Search, Send, Plus, User, MoreVertical, Phone, Video, 
  Loader2, ArrowLeft, CheckCheck, BookOpen, GraduationCap, Users, HeartHandshake, X
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

            const filtered = users.filter(u => 
                ((u.firstName || '') + ' ' + (u.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
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

            const filtered = users.filter(u => 
                ((u.firstName || '') + ' ' + (u.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
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

            const filtered = users.filter(u => 
                !chat.participants.includes(u.uid) && 
                (((u.firstName || '') + ' ' + (u.lastName || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
                 (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
            );
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
                    <button onClick={handleLeave} className="text-xs font-black text-red-500 hover:text-red-700 flex items-center gap-1.5 uppercase tracking-tight bg-red-50 px-3.5 py-2 rounded-xl border border-red-100 hover:bg-red-100/40 transition-colors">
                        Leave Group
                    </button>
                    <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
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

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedChatId || !user || isSending) return;
        const text = newMessage;
        setNewMessage('');
        setIsSending(true);
        try {
            await addDoc(collection(firestore!, `direct_messages/${selectedChatId}/messages`), {
                text, senderId: user.uid, createdAt: serverTimestamp()
            });
            await updateDoc(doc(firestore!, 'direct_messages', selectedChatId), {
                lastMessage: text, lastMessageTime: serverTimestamp()
            });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Send Failed', description: e.message });
        } finally {
            setIsSending(false);
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

    // Group messages by date for date separators
    const groupedMessages = messages?.reduce((groups: Record<string, Message[]>, msg) => {
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
        <div className="h-[calc(100vh-80px)] flex gap-0 bg-slate-100 overflow-hidden rounded-2xl shadow-2xl border border-slate-200/50">

            {/* ── SIDEBAR: CONVERSATION LIST ── */}
            <div className={cn(
                "w-full md:w-[320px] lg:w-[360px] shrink-0 flex flex-col bg-white border-r border-slate-100",
                selectedChatId && "hidden md:flex"
            )}>
                {/* Sidebar Header */}
                <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Messages</h1>
                            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                {chats?.length || 0} conversation{chats?.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsNewGroupOpen(true)}
                                disabled={!schoolId}
                                title="Create Group Chat"
                                className="h-9 w-9 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                <Users className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setIsNewChatOpen(true)}
                                disabled={!schoolId}
                                title="New Conversation"
                                className="h-9 w-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input
                            placeholder="Search conversations..."
                            value={chatFilter}
                            onChange={e => setChatFilter(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 placeholder:text-slate-400 transition-all"
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
                        <div className="p-2 space-y-0.5">
                            {filteredChats?.map(chat => {
                                const other = getOtherParticipant(chat);
                                const isActive = selectedChatId === chat.id;
                                const isGroup = chat.isGroup;
                                const chatName = isGroup ? (chat.groupName || 'Unnamed Group') : other.name;
                                const chatRole = isGroup ? `${chat.participants.length} members` : other.role;
                                const gradient = getAvatarGradient(chatName);

                                return (
                                    <button
                                        key={chat.id}
                                        onClick={() => setSelectedChatId(chat.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-3.5 rounded-xl transition-all text-left group",
                                            isActive
                                                ? "bg-indigo-50 border border-indigo-100"
                                                : "hover:bg-slate-50 border border-transparent"
                                        )}
                                    >
                                        {/* Avatar */}
                                        <div className="relative shrink-0">
                                            <div className={cn(
                                                "h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-base bg-gradient-to-br shadow-sm overflow-hidden",
                                                gradient
                                            )}>
                                                {isGroup ? (
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
                                            {!isGroup && (
                                                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline justify-between gap-1">
                                                <span className={cn(
                                                    "font-semibold text-sm truncate",
                                                    isActive ? "text-indigo-900" : "text-slate-800"
                                                )}>
                                                    {chatName}
                                                </span>
                                                <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                                                    {formatChatTime(chat.lastMessageTime)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between gap-1 mt-0.5">
                                                <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>
                                                <span className={cn(
                                                    "text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
                                                    isGroup ? "bg-indigo-100 text-indigo-700 border-indigo-200" : getRoleColor(other.role)
                                                )}>
                                                    {isGroup ? "Group" : other.role}
                                                </span>
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
                "flex-1 flex flex-col min-w-0",
                !selectedChatId && "hidden md:flex"
            )}>
                {selectedChatId && activeChat && otherMember ? (
                    <>
                        {/* Chat Header */}
                        <div 
                            onClick={() => activeChat.isGroup && setIsGroupDetailsOpen(true)}
                            className={cn(
                                "h-[72px] px-5 flex items-center justify-between bg-white border-b border-slate-100 shrink-0",
                                activeChat.isGroup && "cursor-pointer hover:bg-slate-50 transition-colors"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <button
                                    className="md:hidden h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors mr-1"
                                    onClick={(e) => { e.stopPropagation(); setSelectedChatId(null); }}
                                >
                                    <ArrowLeft className="h-4 w-4 text-slate-600" />
                                </button>
                                <div className={cn(
                                    "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br shadow-sm overflow-hidden shrink-0",
                                    getAvatarGradient(activeChat.isGroup ? (activeChat.groupName || 'Group') : otherMember.name)
                                )}>
                                    {activeChat.isGroup ? (
                                        activeChat.groupAvatar ? (
                                            <img src={activeChat.groupAvatar} className="h-10 w-10 object-cover" alt="" />
                                        ) : (
                                            <Users className="h-4.5 w-4.5 text-white" />
                                        )
                                    ) : (
                                        otherMember.photoURL
                                            ? <img src={otherMember.photoURL} className="h-10 w-10 object-cover" alt="" />
                                            : otherMember.name.charAt(0)
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-slate-900 text-sm leading-none truncate">
                                        {activeChat.isGroup ? activeChat.groupName : otherMember.name}
                                    </h3>
                                    {activeChat.isGroup ? (
                                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                                            {activeChat.participants.length} Members · View Info
                                        </p>
                                    ) : (
                                        <div className={cn(
                                            "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border mt-1",
                                            getRoleColor(otherMember.role)
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
                                        <button className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                            <Phone className="h-4 w-4" />
                                        </button>
                                        <button className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                            <Video className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                                <button 
                                    onClick={() => activeChat.isGroup ? setIsGroupDetailsOpen(true) : null}
                                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto px-5 py-4 space-y-1"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(226 232 240 / 0.6) 1px, transparent 0)`,
                                backgroundSize: '24px 24px',
                                backgroundColor: '#f8fafc'
                            }}
                        >
                            {msgsLoading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
                                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading messages</p>
                                </div>
                            ) : messages?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3">
                                    <div className="h-16 w-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
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
                                        <div key={dateKey}>
                                            {/* Date separator */}
                                            <div className="flex items-center gap-3 py-3">
                                                <div className="flex-1 h-px bg-slate-200" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-full">
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
                                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 border border-slate-200/50 px-3 py-1 rounded-full uppercase tracking-wider text-center">
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
                                                            className={cn(
                                                                "flex items-end gap-2",
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

                                                            {/* Bubble */}
                                                            <div className={cn(
                                                                "max-w-[65%] px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                                                                isMe
                                                                    ? "bg-indigo-600 text-white rounded-2xl rounded-br-sm"
                                                                    : "bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-bl-sm",
                                                                !isLastInGroup && isMe && "rounded-br-2xl rounded-tr-sm",
                                                                !isLastInGroup && !isMe && "rounded-bl-2xl rounded-tl-sm",
                                                            )}>
                                                                {!isMe && activeChat.isGroup && isFirstInGroup && (
                                                                    <p className="text-[10px] font-black text-indigo-600 mb-1 leading-none uppercase tracking-tight">
                                                                        {activeChat.participantDetails?.[msg.senderId]?.name || 'Member'}
                                                                    </p>
                                                                )}
                                                                <p className="break-words">{msg.text}</p>
                                                                {isLastInGroup && (
                                                                    <div className={cn(
                                                                        "text-[9px] mt-1.5 flex items-center gap-1",
                                                                        isMe ? "text-indigo-200 justify-end" : "text-slate-400"
                                                                    )}>
                                                                        {msg.createdAt
                                                                            ? format(msg.createdAt.toDate(), 'HH:mm')
                                                                            : <span className="italic">Sending...</span>
                                                                        }
                                                                        {isMe && <CheckCheck className="h-3 w-3" />}
                                                                    </div>
                                                                )}
                                                            </div>
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
                        <div className="px-5 py-4 bg-white border-t border-slate-100 shrink-0">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                className="flex items-center gap-3"
                            >
                                <div className="flex-1 relative">
                                    <input
                                        ref={inputRef}
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        placeholder={activeChat.isGroup ? `Message ${activeChat.groupName}...` : `Message ${otherMember.name}...`}
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 placeholder:text-slate-400 transition-all pr-4"
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
                                    className="h-12 w-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-md shadow-indigo-200/50 transition-all hover:scale-105 active:scale-95 shrink-0"
                                >
                                    {isSending
                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                        : <Send className="h-4 w-4" />
                                    }
                                </button>
                            </form>
                            <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">
                                Press Enter to send · Shift+Enter for new line
                            </p>
                        </div>
                    </>
                ) : (
                    /* Empty state when no chat selected */
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-slate-50/50">
                        <div
                            className="h-24 w-24 rounded-3xl flex items-center justify-center shadow-xl"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                        >
                            <MessageCircle className="h-11 w-11 text-white" />
                        </div>
                        <div className="text-center space-y-2 max-w-xs">
                            <h2 className="text-xl font-black text-slate-700 tracking-tight">Your Messages</h2>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Select a conversation from the sidebar, or start a new one with a teacher or classmate.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsNewChatOpen(true)}
                            disabled={!schoolId}
                            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4" />
                            New Conversation
                        </button>
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
        </div>
    );
}
