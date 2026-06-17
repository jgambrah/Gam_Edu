
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
import { Loader2, Plus, MessageSquare, ArrowLeft, Bot, Shield, Send, RefreshCw, Activity, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { validateContentSafety, generateAIModeratorComment } from '@/ai/flows/forum-moderator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getAuth } from 'firebase/auth';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// --- Create Thread Form ---
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
                schoolId: schoolId, // SAAS STAMP
            });
            
            toast({ title: 'Success', description: 'Thread posted successfully.' });
            forceRefetch(); // Trigger a data refresh on the main page
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
                <Label htmlFor="title">Thread Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Help with Science Homework"/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required placeholder="Write your question or discussion topic here..."/>
            </div>
             <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/50">
                <Switch id="ai-moderator" checked={aiModerator} onCheckedChange={setAiModerator} />
                <div className="flex flex-col">
                    <Label htmlFor="ai-moderator">AI Moderator</Label>
                    <span className="text-xs text-muted-foreground">Automatically flag inappropriate replies.</span>
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...</> : "Post Thread"}
                </Button>
            </DialogFooter>
        </form>
    );
}


// --- Thread View ---
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
                author: { uid: 'ai-moderator', name: 'AI Moderator' },
                content: result.comment,
                createdAt: serverTimestamp(),
                isAIMessage: true
            });
            
            await updateDoc(doc(firestore, 'forumThreads', thread.id), {
                replyCount: (thread.replyCount || 0) + 2,
                lastReplyAt: serverTimestamp(),
            });

        } catch(aiError) {
            console.error("Failed to generate or post AI moderator comment:", aiError);
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
        <Card className="flex flex-col h-[calc(100vh-120px)] border border-slate-100/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white/95 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50/50 p-6 xl:p-8 border-b border-slate-100 flex flex-col justify-between items-start gap-4">
                <Button 
                    variant="ghost" 
                    onClick={onBack} 
                    className="h-8 pl-1 pr-3 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 rounded-xl flex items-center gap-1.5 transition-all group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform"/> Back to Threads
                </Button>
                <div className="space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            Posted by {thread.createdBy.name} • {formatThreadDate(thread.createdAt)}
                        </span>
                        {thread.aiModeratorEnabled && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-none font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Shield className="h-3 w-3" /> Moderated
                            </Badge>
                        )}
                    </div>
                    <CardTitle className="text-xl font-black uppercase italic tracking-tight text-slate-800">{thread.title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-6 xl:p-8 space-y-6 bg-slate-50/20">
                 {/* Thread OP Post */}
                 <div className="p-6 bg-indigo-50/40 border border-indigo-100/50 rounded-3xl relative overflow-hidden shadow-sm">
                    <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                    <p className="text-slate-700 leading-relaxed text-sm font-medium whitespace-pre-wrap relative z-10">{thread.content}</p>
                 </div>
                 
                 <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100" /></div>
                    <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.2em]"><span className="bg-slate-50/50 px-3 text-slate-400">Activity Replies</span></div>
                 </div>

                {isLoading ? (
                    <div className="flex flex-col items-center py-12 text-slate-400 gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Loading activity...</p>
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
                                            <AvatarFallback className={cn("font-black text-xs text-white", isAI ? 'bg-blue-600' : 'bg-slate-500')}>
                                                {isAI ? 'AI' : r.author.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn(
                                        "max-w-[75%] p-4 rounded-3xl text-sm leading-relaxed",
                                        isAI ? 'bg-slate-900 border border-indigo-500/20 text-indigo-100 rounded-tl-none shadow-md font-medium' : 
                                        isSelf ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none shadow-md shadow-indigo-100 font-medium' : 
                                        'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm font-medium'
                                    )}>
                                        <p className={cn("font-black text-[10px] uppercase tracking-wider mb-1", isSelf ? 'text-indigo-200' : 'text-slate-400')}>
                                            {isAI ? 'AI Copilot' : r.author.name}
                                        </p>
                                        <p className="text-xs leading-relaxed">{r.content}</p>
                                        <p className={cn("text-[8px] font-bold uppercase mt-2 text-right opacity-60", isSelf ? 'text-indigo-300' : 'text-slate-400')}>
                                            {r.createdAt ? format(r.createdAt.toDate(), 'p') : 'Just now'}
                                        </p>
                                    </div>
                                    {isSelf && (
                                        <Avatar className="h-8 w-8 shrink-0 mt-0.5 border">
                                            <AvatarFallback className="bg-indigo-600 text-white font-black text-xs">
                                                {r.author.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
            <CardFooter className="border-t border-slate-100 p-6 bg-white">
                 <div className="flex w-full items-center gap-3 bg-slate-50 border rounded-2xl p-1.5 shadow-inner">
                    <Input 
                        placeholder="Write a message reply..." 
                        value={reply} 
                        onChange={e => setReply(e.target.value)} 
                        disabled={isReplying} 
                        onKeyDown={e => e.key === 'Enter' && handlePostReply()}
                        className="border-0 bg-transparent focus-visible:ring-0 text-xs font-semibold placeholder:text-slate-400 flex-1 h-9"
                    />
                    <Button 
                        onClick={handlePostReply} 
                        disabled={isReplying || !reply.trim()}
                        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl h-9 px-4 font-black text-xs uppercase tracking-wider shadow border-none shrink-0"
                    >
                        {isReplying ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-3.5 w-3.5"/>}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

// --- Main Page (Fixed Logic) ---
export default function ForumPage() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser(); 
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

    const forumStats = useMemo(() => {
        if (!threads) return { totalThreads: 0, totalReplies: 0, activeModeratedCount: 0 };
        const totalThreads = threads.length;
        const totalReplies = threads.reduce((acc, t) => acc + (t.replyCount || 0), 0);
        const activeModeratedCount = threads.filter(t => t.aiModeratorEnabled).length;
        return { totalThreads, totalReplies, activeModeratedCount };
    }, [threads]);

    if (selectedThread) {
        return <ThreadView thread={selectedThread} onBack={() => setSelectedThread(null)} />;
    }

    return (
        <div className="space-y-8 p-6 max-w-5xl mx-auto pb-16">
            {/* PREMIUM Gradient Banner Header */}
            <div className="relative p-8 xl:p-10 rounded-[2.5rem] text-white overflow-hidden shadow-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-gradient-to-r from-cyan-900 via-slate-900 to-indigo-950 border border-cyan-500/20 border-b-8 border-black/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.06),_rgba(255,255,255,0))] pointer-events-none" />
                <div className="space-y-3 relative z-10 max-w-xl">
                    <span className="text-[9px] font-black tracking-[0.25em] px-3.5 py-1.5 rounded-full uppercase bg-cyan-500/20 text-cyan-300">
                        Institutional Forum
                    </span>
                    <h1 className="text-2.5xl xl:text-3.5xl font-black tracking-tight uppercase italic mt-2">Discussion Forum</h1>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        Ask questions, brainstorm topics, and collaborate with classmates and teachers under AI safety moderation.
                    </p>
                </div>
                <div className="flex gap-4 items-center relative z-10 shrink-0">
                    <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button 
                                disabled={!schoolId} 
                                className="bg-white hover:bg-slate-50 text-slate-900 font-black text-xs uppercase tracking-wider rounded-2xl h-11 px-6 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border-none"
                            >
                                <Plus className="mr-2 h-4 w-4 text-cyan-600"/> Create Thread
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 bg-white/95 backdrop-blur-md max-w-md">
                            <DialogHeader className="mb-4">
                                <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-cyan-600" /> Start Discussion
                                </DialogTitle>
                                <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                                    Define your topic and engage the school community.
                                </DialogDescription>
                            </DialogHeader>
                            {schoolId && <CreateThreadForm setOpen={setCreateOpen} forceRefetch={forceRefetch} schoolId={schoolId} />}
                        </DialogContent>
                    </Dialog>
                    <div className="hidden xl:flex p-5 bg-white/5 border border-white/10 rounded-[1.5rem]">
                        <MessageSquare className="h-10 w-10 text-white opacity-80" />
                    </div>
                </div>
            </div>

            {/* QUICK METRICS DECK */}
            {!isLoading && threads.length > 0 && (
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Threads</p>
                            <h4 className="text-2xl font-black text-slate-800 mt-2">{forumStats.totalThreads}</h4>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Total discussions logged</p>
                        </div>
                        <div className="p-3.5 bg-cyan-50 text-cyan-600 rounded-2xl"><MessageSquare className="h-5 w-5" /></div>
                    </div>

                    <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Replies</p>
                            <h4 className="text-2xl font-black text-indigo-600 mt-2">{forumStats.totalReplies}</h4>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Aggregated engagement replies</p>
                        </div>
                        <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl"><Activity className="h-5 w-5 animate-pulse" /></div>
                    </div>

                    <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Moderation</p>
                            <h4 className="text-2xl font-black text-emerald-600 mt-2">{forumStats.activeModeratedCount}</h4>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Threads managed by Copilot</p>
                        </div>
                        <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl"><Shield className="h-5 w-5" /></div>
                    </div>
                </div>
            )}

            {/* DISCUSSION FEED */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex flex-col items-center py-24 text-muted-foreground gap-3">
                        <Loader2 className="h-10 w-10 animate-spin text-cyan-600"/>
                        <p className="text-xs uppercase font-black tracking-widest text-slate-400">Loading discussion threads...</p>
                    </div>
                ) : threads.length === 0 ? (
                    <div className="text-center py-20 border border-slate-100 rounded-[2.5rem] bg-white shadow-sm flex flex-col items-center">
                        <div className="bg-slate-50 p-6 rounded-full w-fit mx-auto mb-4 border shadow-inner text-slate-300">
                            <MessageSquare className="h-8 w-8" />
                        </div>
                        <p className="text-lg font-black text-slate-800 uppercase tracking-tight">No discussions found</p>
                        <p className="text-xs text-slate-400 font-bold uppercase mt-1">Be the first to create a topic and ask a question.</p>
                        <Button onClick={() => setCreateOpen(true)} className="mt-6 bg-cyan-600 hover:bg-cyan-700 font-black text-xs uppercase tracking-wider rounded-xl h-10 px-5 shadow-md">
                            Start a thread
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {threads.map(thread => (
                            <Card 
                                key={thread.id} 
                                onClick={() => setSelectedThread(thread)} 
                                className="border-0 border-l-8 border-l-cyan-600 rounded-[2rem] bg-white/95 backdrop-blur-md shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_-12px_rgba(6,182,212,0.05)] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden p-6 xl:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                            >
                                <div className="space-y-2 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {thread.aiModeratorEnabled && (
                                            <Badge className="bg-emerald-50 text-emerald-700 border-none font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                                                <Shield className="h-3 w-3" /> Moderated
                                            </Badge>
                                        )}
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                            {safeFormatDate(thread.lastReplyAt || thread.createdAt)}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 uppercase italic tracking-tight hover:text-cyan-600 transition-colors truncate">
                                        {thread.title}
                                    </h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                        Started by {thread.createdBy?.name || 'Anonymous'}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="px-4 py-2 bg-slate-50 border rounded-2xl flex flex-col items-center justify-center min-w-[70px]">
                                        <span className="text-xl font-black text-slate-800">{thread.replyCount || 0}</span>
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Replies</span>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-300" />
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
