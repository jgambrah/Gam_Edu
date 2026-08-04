'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, doc, serverTimestamp, updateDoc, where, limit, getDocs } from 'firebase/firestore';
import { ForumThread, ForumReply } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, MessageSquare, ArrowLeft, Bot, Shield, Send, RefreshCw, Activity, ChevronRight, GraduationCap, Users, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { validateContentSafety, generateAIModeratorComment } from '@/ai/flows/forum-moderator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getAuth } from 'firebase/auth';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ParentForum from '@/components/community/parent-forum';

// --- Create Thread Form (Academic Forum) ---
function CreateThreadForm({ setOpen, forceRefetch, schoolId }: { setOpen: (open: boolean) => void; forceRefetch: () => void; schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [aiModerator, setAiModerator] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore) return;
        
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            toast({ variant: 'destructive', title: 'Auth Error', description: 'User not found. Please refresh.' });
            return;
        }
        
        if (!title.trim() || !content.trim()) {
             toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill in title and content.' });
             return;
        }

        setIsSubmitting(true);
        
        try {
            if (aiModerator) {
                try {
                    const { isSafe, reason } = await validateContentSafety({ content: `${title} ${content}` });
                    if (!isSafe) {
                        toast({ variant: 'destructive', title: 'Content Flagged', description: reason || 'Inappropriate content detected.' });
                        setIsSubmitting(false);
                        return;
                    }
                } catch (aiError) {
                    console.error("AI Check Failed (Skipping):", aiError);
                }
            }

            await addDoc(collection(firestore, 'forumThreads'), {
                title,
                content,
                createdBy: { 
                    uid: currentUser.uid, 
                    name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Anonymous' 
                },
                createdAt: serverTimestamp(),
                aiModeratorEnabled: aiModerator,
                replyCount: 0,
                lastReplyAt: serverTimestamp(),
                schoolId: schoolId,
            });
            
            toast({ title: 'Success', description: 'Academic thread posted successfully.' });
            forceRefetch();
            setOpen(false); 
            
        } catch (e: any) {
            console.error("Firestore Error:", e);
            toast({ variant: 'destructive', title: 'Database Error', description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Academic Question / Topic Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Help with BS8 Integrated Science Homework"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="content">Details & Explanation</Label>
                <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required placeholder="Describe the question or problem you need help with..."/>
            </div>
             <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/50">
                <Switch id="ai-moderator" checked={aiModerator} onCheckedChange={setAiModerator} />
                <div className="flex flex-col">
                    <Label htmlFor="ai-moderator">AI Copilot & Homework Tutor</Label>
                    <span className="text-xs text-muted-foreground">AI will provide hints & guidance if no teacher/student replies immediately.</span>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-cyan-600 hover:bg-cyan-700 font-bold">
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...</> : "Post Academic Question"}
                </Button>
            </DialogFooter>
        </form>
    );
}

// --- Thread View (Academic Forum) ---
function ThreadView({ thread, onBack }: { thread: ForumThread, onBack: () => void }) {
    const firestore = useFirestore();
    const { user: hookUser } = useUser();
    const { toast } = useToast();
    const [reply, setReply] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    const repliesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, `forumThreads/${thread.id}/replies`), orderBy('createdAt', 'asc')) : null, [firestore, thread.id]);
    const { data: replies, isLoading } = useCollection<ForumReply>(repliesQuery);

    const handlePostReply = async () => {
        if (!firestore) return;
        const auth = getAuth();
        const currentUser = auth.currentUser || hookUser;

        if (!currentUser) {
             toast({ variant: 'destructive', title: 'Error', description: 'You seem to be logged out. Refresh the page.' });
             return;
        }

        if (!reply.trim()) return;
        
        setIsReplying(true);

        try {
            if (thread.aiModeratorEnabled) {
                try {
                    const { isSafe, reason } = await validateContentSafety({ content: reply });
                    if (!isSafe) {
                        toast({ variant: 'destructive', title: 'Content Flagged', description: reason });
                        setIsReplying(false);
                        return;
                    }
                } catch (aiError) {
                    console.warn("AI Safety Check skipped due to error:", aiError);
                }
            }
            
            await addDoc(collection(firestore, `forumThreads/${thread.id}/replies`), {
                threadId: thread.id,
                author: { 
                    uid: currentUser.uid, 
                    name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User' 
                },
                content: reply,
                createdAt: serverTimestamp(),
                isAIMessage: false
            });

            const threadRef = doc(firestore, 'forumThreads', thread.id);
            await updateDoc(threadRef, {
                replyCount: (thread.replyCount || 0) + 1,
                lastReplyAt: serverTimestamp(),
            });

            toast({ title: "Reply Posted" });
            const postedReply = reply;
            setReply(''); 
            
            if (thread.aiModeratorEnabled) {
                generateAndPostAIComment(postedReply);
            }

        } catch (e: any) {
             console.error(e);
             toast({ variant: 'destructive', title: 'Error', description: e.message || "Could not post reply." });
        } finally {
            setIsReplying(false);
        }
    };
    
    const generateAndPostAIComment = async (lastUserReply: string) => {
        if (!firestore) return;
        
        const previousRepliesText = (replies || [])
            .map(r => `${r.author.name}: ${r.content}`)
            .join('\n');
            
        try {
            const result = await generateAIModeratorComment({
                threadTitle: thread.title,
                threadContent: thread.content,
                previousReplies: `${previousRepliesText}\n${hookUser?.displayName || 'User'}: ${lastUserReply}`,
            });

            await addDoc(collection(firestore, `forumThreads/${thread.id}/replies`), {
                threadId: thread.id,
                author: { uid: 'ai-moderator', name: 'AI Tutor Copilot' },
                content: result.comment,
                createdAt: serverTimestamp(),
                isAIMessage: true
            });
            
            await updateDoc(doc(firestore, 'forumThreads', thread.id), {
                replyCount: (thread.replyCount || 0) + 2,
                lastReplyAt: serverTimestamp(),
            });

        } catch(aiError) {
            console.error("Failed to generate AI tutor comment:", aiError);
        }
    };

    const formatThreadDate = (date: any) => {
        if (!date) return '';
        try {
            if (date.toDate) return format(date.toDate(), 'PPP p');
            return format(new Date(date), 'PPP p');
        } catch(e) {
            return '';
        }
    };

    return (
        <Card className="flex flex-col h-[calc(100vh-120px)] border border-slate-100/80 shadow-xl bg-white/95 rounded-[2.5rem] overflow-hidden font-sans">
            <CardHeader className="bg-slate-50/50 p-6 xl:p-8 border-b border-slate-100 flex flex-col justify-between items-start gap-4">
                <Button 
                    variant="ghost" 
                    onClick={onBack} 
                    className="h-8 pl-1 pr-3 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 rounded-xl flex items-center gap-1.5 transition-all"
                >
                    <ArrowLeft className="h-4 w-4"/> Back to Academic Threads
                </Button>
                <div className="space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Asked by {thread.createdBy.name} • {formatThreadDate(thread.createdAt)}
                        </span>
                        {thread.aiModeratorEnabled && (
                            <Badge className="bg-cyan-50 text-cyan-800 border-none font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Bot className="h-3 w-3 text-cyan-600" /> AI Tutor Active
                            </Badge>
                        )}
                    </div>
                    <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-800">{thread.title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 xl:p-8 space-y-6 bg-slate-50/20">
                 <div className="p-6 bg-cyan-50/40 border border-cyan-100 rounded-3xl relative overflow-hidden shadow-sm">
                    <p className="text-slate-700 leading-relaxed text-sm font-medium whitespace-pre-wrap">{thread.content}</p>
                 </div>
                 
                 <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100" /></div>
                    <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.2em]"><span className="bg-slate-50/50 px-3 text-slate-400">Discussion & AI Hints</span></div>
                 </div>

                {isLoading ? (
                    <div className="flex flex-col items-center py-12 text-slate-400 gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Loading discussion...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {replies?.map(r => {
                            const isSelf = r.author.uid === hookUser?.uid;
                            const isAI = r.isAIMessage;
                            return (
                                <div key={r.id} className={cn("flex gap-3", isSelf ? 'justify-end' : '')}>
                                    {!isSelf && (
                                        <Avatar className="h-8 w-8 shrink-0 mt-0.5 border">
                                            <AvatarFallback className={cn("font-black text-xs text-white", isAI ? 'bg-cyan-600' : 'bg-slate-500')}>
                                                {isAI ? 'AI' : r.author.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn(
                                        "max-w-[75%] p-4 rounded-3xl text-sm leading-relaxed",
                                        isAI ? 'bg-slate-900 border border-cyan-500/30 text-cyan-100 rounded-tl-none shadow-md font-medium' : 
                                        isSelf ? 'bg-cyan-700 text-white rounded-tr-none shadow-md font-medium' : 
                                        'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm font-medium'
                                    )}>
                                        <p className={cn("font-black text-[10px] uppercase tracking-wider mb-1", isSelf ? 'text-cyan-200' : 'text-slate-400')}>
                                            {isAI ? '🤖 AI Homework Copilot' : r.author.name}
                                        </p>
                                        <p className="text-xs leading-relaxed">{r.content}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
            <CardFooter className="border-t border-slate-100 p-6 bg-white">
                 <div className="flex w-full items-center gap-3 bg-slate-50 border rounded-2xl p-1.5">
                    <Input 
                        placeholder="Write an answer or hint..." 
                        value={reply} 
                        onChange={e => setReply(e.target.value)} 
                        disabled={isReplying} 
                        onKeyDown={e => e.key === 'Enter' && handlePostReply()}
                        className="border-0 bg-transparent text-xs font-semibold flex-1 h-9"
                    />
                    <Button 
                        onClick={handlePostReply} 
                        disabled={isReplying || !reply.trim()}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl h-9 px-4 font-black text-xs uppercase"
                    >
                        {isReplying ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-3.5 w-3.5"/>}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

// --- Main Unified Institutional Forum Page ---
export default function ForumPage() {
    const [forumTab, setForumTab] = useState<'academic' | 'parent_community'>('academic');

    const firestore = useFirestore();
    const { user, isUserLoading } = useUser(); 
    const { role } = useRole();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
    const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
    const [isCreateOpen, setCreateOpen] = useState(false);
  
    const threadsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId) return null;
        return query(collection(firestore, 'forumThreads'), where('schoolId', '==', schoolId));
    }, [firestore, schoolId]);

    const { data: rawThreads, isLoading: isDataLoading, forceRefetch } = useCollection<ForumThread>(threadsQuery);

    const threads = useMemo(() => {
        if (!rawThreads) return [];
        return [...rawThreads].sort((a, b) => {
            const timeA = a.lastReplyAt?.seconds || a.createdAt?.seconds || 0;
            const timeB = b.lastReplyAt?.seconds || b.createdAt?.seconds || 0;
            return timeB - timeA;
        });
    }, [rawThreads]);

    const safeFormatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        try {
            if (typeof timestamp.toDate === 'function') {
                return format(timestamp.toDate(), 'PPP p');
            }
            if (timestamp instanceof Date) {
                return format(timestamp, 'PPP p');
            }
            return 'Invalid Date';
        } catch (e) {
            return 'N/A';
        }
    };

    const isLoading = isUserLoading || isDataLoading || isLoadingSchool;
    const currentUserRole: 'parent' | 'teacher' | 'admin' = 
      role === 'admin' || role === 'super_admin' ? 'admin' : role === 'teacher' ? 'teacher' : 'parent';

    if (selectedThread && forumTab === 'academic') {
        return <ThreadView thread={selectedThread} onBack={() => setSelectedThread(null)} />;
    }

    return (
        <div className="space-y-6 p-6 max-w-5xl mx-auto pb-16 font-sans">
            
            {/* Top Forum Selector Tabs: Academic Student Forum vs Parent Community Hub */}
            <div className="flex border-b border-slate-200 gap-4">
                <button
                    onClick={() => setForumTab('academic')}
                    className={`pb-3 px-5 text-sm font-black transition-all border-b-4 flex items-center space-x-2 cursor-pointer ${
                        forumTab === 'academic'
                            ? 'border-cyan-600 text-cyan-700'
                            : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                    <GraduationCap className="w-5 h-5 text-cyan-600" />
                    <span>Academic & Homework Q&A Forum (With AI Copilot)</span>
                </button>

                <button
                    onClick={() => setForumTab('parent_community')}
                    className={`pb-3 px-5 text-sm font-black transition-all border-b-4 flex items-center space-x-2 cursor-pointer ${
                        forumTab === 'parent_community'
                            ? 'border-teal-600 text-teal-700'
                            : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                >
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Parent Community & Idea Hub (AI & Staff Moderated)</span>
                </button>
            </div>

            {/* TAB 1: Academic & Homework Forum */}
            {forumTab === 'academic' && (
                <div className="space-y-6">
                    {/* Header Banner */}
                    <div className="relative p-8 rounded-[2.5rem] text-white overflow-hidden shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/20">
                        <div className="space-y-2">
                            <span className="text-[9px] font-black tracking-widest px-3 py-1 rounded-full uppercase bg-cyan-500/20 text-cyan-300">
                                Student & Teacher Q&A
                            </span>
                            <h1 className="text-2xl font-black uppercase italic">Academic Q&A & AI Homework Copilot</h1>
                            <p className="text-xs text-slate-300 max-w-lg">
                                Ask homework questions or discuss topics. Teachers, classmates, and our AI Homework Copilot assist students 24/7!
                            </p>
                        </div>

                        <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    disabled={!schoolId} 
                                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase rounded-2xl h-11 px-5 shadow-lg border-none shrink-0"
                                >
                                    <Plus className="mr-2 h-4 w-4"/> Ask Academic Question
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-3xl p-6 bg-white max-w-md">
                                <DialogHeader className="mb-2">
                                    <DialogTitle className="text-lg font-black uppercase text-slate-800 flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-cyan-600" /> Ask Question
                                    </DialogTitle>
                                    <DialogDescription className="text-xs font-semibold text-slate-500">
                                        Ask for help with homework, subjects, or exam prep.
                                    </DialogDescription>
                                </DialogHeader>
                                {schoolId && <CreateThreadForm setOpen={setCreateOpen} forceRefetch={forceRefetch} schoolId={schoolId} />}
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* DISCUSSION FEED */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex flex-col items-center py-16 text-slate-400 gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-cyan-600"/>
                                <p className="text-xs uppercase font-black tracking-widest">Loading academic threads...</p>
                            </div>
                        ) : threads.length === 0 ? (
                            <div className="text-center py-16 border border-slate-200 rounded-3xl bg-white shadow-xs space-y-3">
                                <GraduationCap className="h-10 w-10 text-cyan-600 mx-auto" />
                                <h4 className="text-base font-extrabold text-slate-800">No Academic Questions Yet</h4>
                                <p className="text-xs text-slate-500">Be the first student or teacher to ask an academic question!</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {threads.map(thread => (
                                    <Card 
                                        key={thread.id} 
                                        onClick={() => setSelectedThread(thread)} 
                                        className="border border-slate-200 border-l-8 border-l-cyan-600 rounded-3xl bg-white shadow-xs hover:shadow-md transition-all cursor-pointer p-6 flex justify-between items-center"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                {thread.aiModeratorEnabled && (
                                                    <span className="bg-cyan-100 text-cyan-800 text-[10px] font-extrabold px-2 py-0.5 rounded font-mono flex items-center space-x-1">
                                                        <Bot className="w-3 h-3 text-cyan-600" />
                                                        <span>AI Homework Copilot</span>
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {safeFormatDate(thread.lastReplyAt || thread.createdAt)}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-extrabold text-slate-900">{thread.title}</h3>
                                            <p className="text-xs text-slate-500 font-medium">Asked by {thread.createdBy?.name || 'Student'}</p>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-xl">
                                                {thread.replyCount || 0} Replies
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-slate-300" />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: Parent Community & Idea Hub */}
            {forumTab === 'parent_community' && (
                <ParentForum 
                    schoolId={schoolId || 'default-school'}
                    currentUser={{
                        id: user?.uid || 'guest-user',
                        name: user?.displayName || user?.email?.split('@')[0] || 'School Parent',
                        role: currentUserRole
                    }}
                />
            )}
        </div>
    );
}
