
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ForumThread, ForumReply } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, MessageSquare, ArrowLeft, Bot, Shield, Send } from 'lucide-react';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { validateContentSafety, generateAIModeratorComment } from '@/ai/flows/forum-moderator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getAuth } from 'firebase/auth';

// --- Create Thread Form (Fixed Auth) ---
function CreateThreadForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { user: hookUser } = useAuth(); // Renamed to avoid confusion
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [aiModerator, setAiModerator] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // FIX: Get user directly from Firebase SDK (Bypasses React State lag)
        const auth = getAuth();
        const currentUser = auth.currentUser || hookUser;
        
        if (!currentUser) {
            toast({ variant: 'destructive', title: 'Auth Error', description: 'Browser session not found. Please refresh.' });
            return;
        }
        
        if (!title.trim() || !content.trim()) {
             toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill in title and content.' });
             return;
        }

        setIsSubmitting(true);
        
        try {
            // 1. Safety Check (Wrapped to prevent blocking)
            if (aiModerator) {
                try {
                    const { isSafe, reason } = await validateContentSafety({ content: `${title} ${content}` });
                    if (!isSafe) {
                        toast({ variant: 'destructive', title: 'Content Flagged', description: reason || 'Inappropriate content detected.' });
                        setIsSubmitting(false);
                        return;
                    }
                } catch (aiError) {
                    console.error("AI Check Warning:", aiError);
                    // Continue anyway if AI service is down
                }
            }

            // 2. Save to Firestore using currentUser
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
            });
            
            toast({ title: 'Success', description: 'Thread posted successfully.' });
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
    const { user } = useAuth();
    const { toast } = useToast();
    const [reply, setReply] = useState('');
    const [isReplying, setIsReplying] = useState(false);

    const repliesQuery = useMemoFirebase(() => query(collection(firestore, `forumThreads/${thread.id}/replies`), orderBy('createdAt', 'asc')), [firestore, thread.id]);
    const { data: replies, isLoading } = useCollection<ForumReply>(repliesQuery);

    const handlePostReply = async () => {
        if (!user || !reply.trim()) return;
        setIsReplying(true);

        try {
            const { isSafe, reason } = await validateContentSafety({ content: reply });
            if (!isSafe) {
                toast({ variant: 'destructive', title: 'Inappropriate Content Detected', description: reason });
                setIsReplying(false);
                return;
            }
            
            const replyData = {
                threadId: thread.id,
                author: { uid: user.uid, name: user.displayName || user.email },
                content: reply,
                createdAt: serverTimestamp(),
            };
            await addDoc(collection(firestore, `forumThreads/${thread.id}/replies`), replyData);

            await updateDoc(doc(firestore, 'forumThreads', thread.id), {
                replyCount: (thread.replyCount || 0) + 1,
                lastReplyAt: serverTimestamp(),
            });

            setReply('');
        } catch (e: any) {
             toast({ variant: 'destructive', title: 'Error', description: e.message });
        } finally {
            setIsReplying(false);
        }
    };

    return (
        <Card className="flex flex-col h-[80vh]">
            <CardHeader className="border-b">
                <Button variant="ghost" onClick={onBack} className="mb-2"><ArrowLeft className="mr-2"/> Back to All Threads</Button>
                <CardTitle>{thread.title}</CardTitle>
                <CardDescription>
                    Posted by {thread.createdBy.name} on {thread.createdAt ? format(thread.createdAt.toDate(), 'PPP') : ''}
                    {thread.aiModeratorEnabled && <Badge variant="secondary" className="ml-2"><Shield className="mr-1 h-3 w-3"/> AI Moderated</Badge>}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                 <div className="p-4 bg-muted rounded-md">{thread.content}</div>
                {isLoading ? <Loader2 className="mx-auto my-8 h-8 w-8 animate-spin" /> : replies?.map(r => (
                    <div key={r.id} className={`flex gap-3 ${r.author.uid === user?.uid ? 'justify-end' : ''}`}>
                         {r.isAIMessage && <Bot className="h-6 w-6 text-primary flex-shrink-0"/>}
                        <div className={`max-w-[70%] p-3 rounded-lg ${r.isAIMessage ? 'bg-blue-50 border border-blue-200' : r.author.uid === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <p className="text-sm">{r.content}</p>
                            <p className="text-xs mt-1 opacity-70">{r.author.name} • {r.createdAt ? format(r.createdAt.toDate(), 'p') : ''}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter className="border-t p-4">
                 <div className="flex w-full items-center gap-2">
                    <Input placeholder="Type your reply..." value={reply} onChange={e => setReply(e.target.value)} disabled={isReplying} />
                    <Button onClick={handlePostReply} disabled={isReplying || !reply.trim()}>
                        {isReplying ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

// --- Main Page ---
export default function ForumPage() {
    const firestore = useFirestore();
    const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
    const [isCreateOpen, setCreateOpen] = useState(false);
  
    const threadsQuery = useMemoFirebase(() => query(collection(firestore, 'forumThreads'), orderBy('lastReplyAt', 'desc')), [firestore]);
    const { data: threads, isLoading } = useCollection<ForumThread>(threadsQuery);

    if (selectedThread) {
        return <ThreadView thread={selectedThread} onBack={() => setSelectedThread(null)} />;
    }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2"><MessageSquare/> Discussion Forum</CardTitle>
                <CardDescription>Ask questions, share ideas, and collaborate with others.</CardDescription>
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                    <Button><Plus className="mr-2"/> Create Thread</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Start a New Discussion</DialogTitle>
                        <DialogDescription>What's on your mind?</DialogDescription>
                    </DialogHeader>
                    <CreateThreadForm setOpen={setCreateOpen} />
                </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader><TableRow><TableHead>Topic</TableHead><TableHead>Author</TableHead><TableHead>Replies</TableHead><TableHead>Last Activity</TableHead></TableRow></TableHeader>
                <TableBody>
                    {isLoading ? <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin"/></TableCell></TableRow> 
                    : threads?.map(thread => (
                        <TableRow key={thread.id} onClick={() => setSelectedThread(thread)} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">{thread.title}</TableCell>
                            <TableCell>{thread.createdBy.name}</TableCell>
                            <TableCell>{thread.replyCount || 0}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{thread.lastReplyAt ? format(thread.lastReplyAt.toDate(), 'PPP p') : (thread.createdAt ? format(thread.createdAt.toDate(), 'PPP p') : 'N/A')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
