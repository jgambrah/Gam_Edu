'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { cn } from '@/lib/utils';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, where } from 'firebase/firestore';
import { format } from 'date-fns';
import { 
  Megaphone, Plus, Trash2, Loader2, Calendar, User, AlertCircle, Wand2, Users,
  Sparkles, Clock, CheckCircle2, Bell, ShieldAlert, BookOpen
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateAnnouncement } from '@/ai/flows/generate-announcement-flow';
import { Checkbox } from '@/components/ui/checkbox';
import type { Class } from '@/lib/types';
import { useCurrentSchool } from '@/hooks/use-current-school';


// --- TYPE DEFINITION ---
type Audience = 'Everybody' | 'Staff' | 'Students' | 'Parents';

type Announcement = {
  id: string;
  title: string;
  content: string;
  priority: 'Normal' | 'High' | 'Urgent';
  authorName: string;
  authorRole: string;
  postedBy: string;
  createdAt: any;
  audience: Audience[];
  classId?: string;
  schoolId?: string; 
};

// --- COMPONENT: Post Announcement Form ---
function PostAnnouncementForm({ 
    open, 
    setOpen,
    schoolId
}: { 
    open: boolean, 
    setOpen: (o: boolean) => void,
    schoolId: string
}) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { role } = useRole();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [aiKeyPoints, setAiKeyPoints] = useState('');
    const [selectedAudience, setSelectedAudience] = useState<Audience[]>(['Everybody']);
    const [selectedClassId, setSelectedClassId] = useState<string>('all');
    
    const classesQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, 
    [firestore, schoolId]);
    const { data: classes } = useCollection<Class>(classesQuery);

    const handleAudienceChange = (audience: Audience, checked: boolean | 'indeterminate') => {
        if (checked) {
            setSelectedAudience(prev => [...prev, audience]);
        } else {
            setSelectedAudience(prev => prev.filter(a => a !== audience));
        }
    };

    const handleGenerateWithAI = async () => {
        if (!aiKeyPoints.trim()) {
            toast({ variant: 'destructive', title: 'Key Points Required', description: 'Please provide some notes for the AI.' });
            return;
        }
        setIsGenerating(true);
        toast({ title: 'AI is thinking...', description: 'Generating an announcement from your notes.' });

        try {
            const result = await generateAnnouncement({ keyPoints: aiKeyPoints });
            setTitle(result.title);
            setContent(result.content);
            toast({ title: 'Announcement Generated!', description: 'The title and content fields have been populated.' });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'AI Error', description: 'Could not generate announcement.' });
        } finally {
            setIsGenerating(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore!, 'announcements_v2'), {
                title,
                content,
                priority,
                authorName: user?.displayName || 'Administrator',
                authorRole: role,
                postedBy: user?.uid,
                audience: selectedAudience,
                classId: selectedClassId === 'all' ? null : selectedClassId,
                publishedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
                schoolId: schoolId, 
            });

            toast({ title: 'Success', description: 'Announcement posted.' });
            setOpen(false);
            setTitle('');
            setContent('');
            setPriority('Normal');
            setAiKeyPoints('');
            setSelectedAudience(['Everybody']);
            setSelectedClassId('all');
        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[780px] rounded-[2.5rem] border border-slate-100/80 shadow-2xl p-8 bg-white/95 backdrop-blur-md">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-2xl font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                        <Megaphone className="h-6 w-6 text-indigo-600" /> Post New Announcement
                    </DialogTitle>
                    <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                        Share news with the entire school or target specific classes and roles.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                    {/* AI Prompt Studio Pane */}
                    <div className="space-y-6 p-6 bg-slate-900 text-white rounded-3xl border border-indigo-500/20 shadow-xl relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-indigo-300">AI Prompt Studio</h3>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-slate-300">Key Bulletin Points</Label>
                                <Textarea
                                    placeholder="e.g.,&#10;- Sports day postponed to Nov 5&#10;- Reason: heavy rain forecasted&#10;- Target: All students and parents"
                                    value={aiKeyPoints}
                                    onChange={e => setAiKeyPoints(e.target.value)}
                                    className="h-32 bg-slate-950/80 border-slate-800 focus-visible:ring-indigo-500 text-xs text-slate-200 placeholder:text-slate-600 rounded-xl leading-relaxed resize-none"
                                />
                            </div>
                        </div>
                        <Button 
                            type="button" 
                            onClick={handleGenerateWithAI} 
                            disabled={isGenerating || !aiKeyPoints.trim()} 
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-xs uppercase tracking-wider rounded-xl py-3 shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-none mt-4 h-11 relative z-10"
                        >
                            {isGenerating ? (
                                <span className="flex items-center gap-2 justify-center"><Loader2 className="h-4 w-4 animate-spin"/> Processing...</span>
                            ) : (
                                <span className="flex items-center gap-2 justify-center"><Wand2 className="h-4 w-4" /> Drafting Draft with Copilot</span>
                            )}
                        </Button>
                    </div>

                    {/* Standard Drafting Fields */}
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Notice Title</Label>
                            <Input 
                                placeholder="e.g. Annual Sports Day Postponed" 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                required 
                                className="rounded-xl focus-visible:ring-indigo-500 text-xs font-semibold text-slate-800 border-slate-200"
                            />
                        </div>
                        
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Notice Body Content</Label>
                            <Textarea 
                                placeholder="Enter announcement body text here..." 
                                className="h-28 rounded-xl focus-visible:ring-indigo-500 text-xs font-medium text-slate-700 border-slate-200 leading-relaxed"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Priority Level</Label>
                                <Select value={priority} onValueChange={setPriority}>
                                    <SelectTrigger className="rounded-xl text-xs font-bold border-slate-200"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="Normal" className="text-xs font-semibold text-slate-700">Normal</SelectItem>
                                        <SelectItem value="High" className="text-xs font-semibold text-amber-700">High</SelectItem>
                                        <SelectItem value="Urgent" className="text-xs font-semibold text-rose-700">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Target Class</Label>
                                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                    <SelectTrigger className="rounded-xl text-xs font-bold border-slate-200"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="all" className="text-xs font-semibold">All Classes</SelectItem>
                                        {classes?.map(c => <SelectItem key={c.id} value={c.id} className="text-xs font-semibold">{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                        <div className="space-y-2 pt-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Target Audiences</Label>
                            <div className="flex flex-wrap gap-x-4 gap-y-2">
                                {['Everybody', 'Staff', 'Students', 'Parents'].map(aud => (
                                    <div key={aud} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`aud-${aud}`} 
                                            checked={selectedAudience.includes(aud as Audience)}
                                            onCheckedChange={(checked) => handleAudienceChange(aud as Audience, checked)}
                                            className="rounded-md border-slate-300 focus:ring-indigo-500 text-indigo-600"
                                        />
                                        <Label htmlFor={`aud-${aud}`} className="text-xs font-bold text-slate-600 uppercase tracking-tight cursor-pointer">{aud}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl py-3.5 shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-none mt-2 h-11" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/> Posting...</span>
                            ) : "Post Announcement"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}


// --- MAIN PAGE ---
export default function AnnouncementsPage() {
  const firestore = useFirestore();
  const { role, loading: isRoleLoading } = useRole();
  const { user } = useUser();
  const { toast } = useToast();
  const { schoolId, loading: schoolLoading } = useCurrentSchool(); 

  const [isFormOpen, setIsFormOpen] = useState(false);

  const canManage = role ? ['Administrator', 'Director'].includes(role) : false;

  const announcementsQuery = useMemoFirebase(() => {
      if (!firestore || !schoolId) return null; 
      
      const q = query(
          collection(firestore, 'announcements_v2'), 
          where('schoolId', '==', schoolId), 
          orderBy('publishedAt', 'desc')
      );
      
      if (!canManage && role) {
          return query(q, where('audience', 'array-contains-any', ['Everybody', role]));
      }
      
      return q;
  }, [firestore, schoolId, role, canManage]);
  
  const { data: announcements, isLoading } = useCollection<Announcement>(announcementsQuery);


  const handleDelete = async (id: string) => {
      try {
          await deleteDoc(doc(firestore!, 'announcements_v2', id));
          toast({ title: "Deleted", description: "Announcement removed." });
      } catch (e: any) {
          toast({ variant: 'destructive', title: "Error", description: "Failed to delete." });
      }
  };

  const getPriorityStyle = (p: string) => {
      switch(p) {
          case 'Urgent': 
              return {
                  bg: 'bg-rose-50/40 border-rose-100/80',
                  badge: 'bg-rose-100 text-rose-800 border-none font-black text-[9px] uppercase tracking-wider',
                  stripe: 'border-l-rose-500',
                  glow: 'shadow-[0_20px_50px_-12px_rgba(244,63,94,0.08)] border-rose-200/50 shadow-rose-100/10 hover:shadow-[0_30px_60px_-15px_rgba(244,63,94,0.12)]'
              };
          case 'High': 
              return {
                  bg: 'bg-amber-50/20 border-amber-100/50',
                  badge: 'bg-amber-100 text-amber-800 border-none font-black text-[9px] uppercase tracking-wider',
                  stripe: 'border-l-amber-500',
                  glow: 'shadow-[0_20px_50px_-12px_rgba(245,158,11,0.04)] border-amber-200/30 hover:shadow-[0_30px_60px_-15px_rgba(245,158,11,0.08)]'
              };
          default: 
              return {
                  bg: 'bg-white/95',
                  badge: 'bg-indigo-50 text-indigo-700 border-none font-black text-[9px] uppercase tracking-wider',
                  stripe: 'border-l-indigo-500',
                  glow: 'shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] border-slate-100/80 hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.05)]'
              };
      }
  };

  const announcementStats = useMemo(() => {
    if (!announcements) return { totalCount: 0, urgentCount: 0, everybodyPct: 0 };
    const totalCount = announcements.length;
    const urgentCount = announcements.filter(a => a.priority === 'Urgent' || a.priority === 'High').length;
    const everybodyCount = announcements.filter(a => a.audience?.includes('Everybody')).length;
    const everybodyPct = totalCount > 0 ? Math.round((everybodyCount / totalCount) * 100) : 0;
    return { totalCount, urgentCount, everybodyPct };
  }, [announcements]);

  const formatPostDate = (createdAt: any) => {
    if (!createdAt) return 'Just now';
    try {
        if (createdAt.toDate) return format(createdAt.toDate(), 'PPP p');
        if (createdAt.seconds) return format(new Date(createdAt.seconds * 1000), 'PPP p');
        return format(new Date(createdAt), 'PPP p');
    } catch (e) {
        return 'Recently';
    }
  };
  
  const pageLoading = isLoading || isRoleLoading || schoolLoading;

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto pb-16">
      
      {/* PREMIUM Tab-themed Gradient Banner Header */}
      <div className="relative p-8 xl:p-10 rounded-[2.5rem] text-white overflow-hidden shadow-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/20 border-b-8 border-black/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.06),_rgba(255,255,255,0))] pointer-events-none" />
        <div className="space-y-3 relative z-10 max-w-xl">
          <span className="text-[9px] font-black tracking-[0.25em] px-3.5 py-1.5 rounded-full uppercase bg-indigo-500/20 text-indigo-300">
            Noticeboard Suite
          </span>
          <h1 className="text-2.5xl xl:text-3.5xl font-black tracking-tight uppercase italic mt-2">Global Noticeboard</h1>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Post institutional announcements, issue urgent notifications, and coordinate target audience coverage.
          </p>
        </div>
        <div className="flex gap-4 items-center relative z-10">
            {canManage && schoolId && (
                <Button 
                    onClick={() => setIsFormOpen(true)} 
                    className="bg-white hover:bg-slate-50 text-indigo-950 font-black text-xs uppercase tracking-wider rounded-2xl h-11 px-6 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                    <Plus className="mr-2 h-4 w-4 text-indigo-600"/> Post Announcement
                </Button>
            )}
            <div className="hidden xl:flex p-5 bg-white/5 border border-white/10 rounded-[1.5rem] shrink-0">
                <Megaphone className="h-10 w-10 text-white opacity-80" />
            </div>
        </div>
      </div>

      {/* QUICK METRICS SECTION */}
      {!pageLoading && announcements && announcements.length > 0 && (
          <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Broadcast Logs</p>
                      <h4 className="text-2xl font-black text-slate-800 mt-2">{announcementStats.totalCount}</h4>
                      <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Active Noticeboard Posts</p>
                  </div>
                  <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl"><Megaphone className="h-5 w-5" /></div>
              </div>

              <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Urgent Broadcasts</p>
                      <h4 className="text-2xl font-black text-rose-600 mt-2">{announcementStats.urgentCount}</h4>
                      <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Critical notices active</p>
                  </div>
                  <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl"><AlertCircle className="h-5 w-5 animate-pulse" /></div>
              </div>

              <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">General Reach</p>
                      <h4 className="text-2xl font-black text-emerald-600 mt-2">{announcementStats.everybodyPct}%</h4>
                      <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Broadcast to Everybody</p>
                  </div>
                  <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl"><Users className="h-5 w-5" /></div>
              </div>
          </div>
      )}

      {/* CONTENT AREA */}
      {pageLoading ? (
          <div className="flex flex-col items-center py-24 text-muted-foreground gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600"/>
              <p className="text-xs uppercase font-black tracking-widest text-slate-400">Loading updates...</p>
          </div>
      ) : (!announcements || announcements.length === 0) ? (
          <div className="text-center py-20 border border-slate-100 rounded-[2.5rem] bg-white shadow-sm flex flex-col items-center">
              <div className="bg-slate-50 p-6 rounded-full w-fit mx-auto mb-4 border shadow-inner text-slate-300">
                  <Megaphone className="h-8 w-8" />
              </div>
              <p className="text-lg font-black text-slate-800 uppercase tracking-tight">No Announcements Posted</p>
              <p className="text-xs text-slate-400 font-bold uppercase mt-1">Check back later for school administrative updates.</p>
              {canManage && (
                  <Button onClick={() => setIsFormOpen(true)} className="mt-6 bg-indigo-600 hover:bg-indigo-700 font-black text-xs uppercase tracking-wider rounded-xl h-10 px-5 shadow-md">
                      Create the first post
                  </Button>
              )}
          </div>
      ) : (
          <div className="space-y-6">
              {announcements.map((post) => {
                  const style = getPriorityStyle(post.priority);
                  return (
                      <Card 
                          key={post.id} 
                          className={cn(
                              "border-0 border-l-8 rounded-[2rem] bg-white/90 backdrop-blur-md transition-all duration-300 relative overflow-hidden",
                              style.stripe,
                              style.bg,
                              style.glow,
                              post.priority === 'Urgent' ? 'animate-pulse hover:animate-none' : ''
                          )}
                      >
                          <CardHeader className="pb-3 p-6 xl:p-8">
                              <div className="flex justify-between items-start">
                                  <div className="space-y-2 flex-1">
                                      <div className="flex flex-wrap items-center gap-2.5">
                                          <Badge className={style.badge}>
                                              {post.priority}
                                          </Badge>
                                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                              <Calendar className="h-3.5 w-3.5 text-slate-400"/> 
                                              {formatPostDate(post.createdAt)}
                                          </span>
                                      </div>
                                      <CardTitle className="text-xl font-black tracking-tight text-slate-800 uppercase italic pt-1">{post.title}</CardTitle>
                                  </div>
                                  
                                  {canManage && (
                                      <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl h-9 w-9">
                                                  <Trash2 className="h-4 w-4"/>
                                              </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent className="rounded-3xl border border-slate-100 shadow-2xl">
                                              <AlertDialogHeader>
                                                  <AlertDialogTitle className="font-black text-slate-800 uppercase tracking-tight">Delete Announcement?</AlertDialogTitle>
                                                  <AlertDialogDescription className="text-slate-500 font-medium text-xs leading-relaxed">
                                                      Are you sure you want to remove the announcement "<strong>{post.title}</strong>"? This will hide it from everyone's portal permanently.
                                                  </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                  <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                                                  <AlertDialogAction onClick={() => handleDelete(post.id)} className="bg-red-600 hover:bg-red-700 rounded-xl font-bold">Delete Post</AlertDialogAction>
                                              </AlertDialogFooter>
                                          </AlertDialogContent>
                                      </AlertDialog>
                                  )}
                              </div>
                          </CardHeader>
                          
                          <CardContent className="text-slate-600 leading-relaxed text-sm font-medium px-6 xl:px-8 pb-5 whitespace-pre-wrap">
                              {post.content}
                          </CardContent>
    
                          <CardFooter className="pt-4 px-6 xl:p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm">
                                          {post.authorName?.charAt(0)}
                                      </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                      <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{post.authorName}</span>
                                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{post.authorRole}</span>
                                  </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-1">
                                  {post.audience?.map(aud => {
                                      let audColor = "bg-indigo-50 text-indigo-600";
                                      if (aud === 'Staff') audColor = "bg-purple-50 text-purple-600";
                                      if (aud === 'Students') audColor = "bg-teal-50 text-teal-600";
                                      if (aud === 'Parents') audColor = "bg-orange-50 text-orange-600";
                                      return (
                                          <Badge key={aud} className={cn("border-none text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md", audColor)}>
                                              {aud}
                                          </Badge>
                                      );
                                  })}
                              </div>
                          </CardFooter>
                      </Card>
                  );
              })}
          </div>
      )}

      {/* MODAL (Pass schoolId down) */}
      {schoolId && <PostAnnouncementForm open={isFormOpen} setOpen={setIsFormOpen} schoolId={schoolId}/>}

    </div>
  );
}
