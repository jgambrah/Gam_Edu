'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { cn } from '@/lib/utils';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, where, limit } from 'firebase/firestore';
import { format } from 'date-fns';
import { 
  Megaphone, Plus, Trash2, Loader2, Calendar, User, AlertCircle, Wand2, Users,
  Sparkles, Clock, CheckCircle2, Bell, ShieldAlert, BookOpen
} from 'lucide-react';
import { SectionHeroBanner } from '@/components/common/SectionHeroBanner';

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
  const { role, profile, loading: isRoleLoading } = useRole();
  const { toast } = useToast();
  const { schoolId, loading: schoolLoading } = useCurrentSchool();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pageSize, setPageSize] = useState(30);
  const [search, setSearch] = useState('');
  const [audienceFilter, setAudienceFilter] = useState<'All' | Audience>('All');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Important'>('All');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const canManage = role ? ['Administrator', 'Director'].includes(role) : false;
  const schoolName = profile?.schoolName || '';

  // Posts are addressed to Everybody / Staff / Students / Parents. A signed-in role must be mapped to that
  // group (before, "Parent" was compared with "Parents", so parents, pupils and staff only saw "Everybody" posts).
  const myAudience: Audience | null = role === 'Parent' ? 'Parents' : role === 'Student' ? 'Students' : role ? 'Staff' : null;

  const announcementsQuery = useMemoFirebase(() => {
      if (!firestore || !schoolId) return null;
      const base = [where('schoolId', '==', schoolId)] as any[];
      if (!canManage && myAudience) base.push(where('audience', 'array-contains-any', ['Everybody', myAudience]));
      // Newest first, a page at a time (it used to read every post ever made and keep them live).
      return query(collection(firestore, 'announcements_v2'), ...base, orderBy('publishedAt', 'desc'), limit(pageSize));
  }, [firestore, schoolId, canManage, myAudience, pageSize]);

  const { data: announcements, isLoading } = useCollection<Announcement>(announcementsQuery);

  const handleDelete = async (id: string) => {
      try {
          await deleteDoc(doc(firestore!, 'announcements_v2', id));
          toast({ title: "Deleted", description: "Announcement removed." });
      } catch (e: any) {
          toast({ variant: 'destructive', title: "Error", description: "Failed to delete." });
      }
  };

  const postDate = (p: any): Date | null => {
      const v = p.publishedAt || p.createdAt;
      if (!v) return null;
      const d = v.toDate ? v.toDate() : v.seconds ? new Date(v.seconds * 1000) : new Date(v);
      return isNaN(d.getTime()) ? null : d;
  };

  const filtered = useMemo(() => {
      const q = search.trim().toLowerCase();
      return (announcements || []).filter(p =>
          (audienceFilter === 'All' || (p.audience || []).includes(audienceFilter)) &&
          (priorityFilter === 'All' || p.priority === 'Urgent' || p.priority === 'High') &&
          (!q || `${p.title} ${p.content} ${p.authorName}`.toLowerCase().includes(q)));
  }, [announcements, search, audienceFilter, priorityFilter]);

  // Group by month for easy scanning
  const groups = useMemo(() => {
      const out: { label: string; posts: Announcement[] }[] = [];
      filtered.forEach(p => {
          const d = postDate(p);
          const label = d ? format(d, 'MMMM yyyy') : 'Undated';
          if (!out.length || out[out.length - 1].label !== label) out.push({ label, posts: [] });
          out[out.length - 1].posts.push(p);
      });
      return out;
  }, [filtered]);

  const stats = useMemo(() => {
      const list = announcements || [];
      const thirty = Date.now() - 30 * 86400000;
      return {
          shown: list.length,
          last30: list.filter(p => (postDate(p)?.getTime() || 0) >= thirty).length,
          important: list.filter(p => p.priority === 'Urgent' || p.priority === 'High').length,
          latest: list[0] ? postDate(list[0]) : null,
      };
  }, [announcements]);

  const priorityStyle = (p: string) =>
      p === 'Urgent' ? { stripe: 'border-l-rose-500', badge: 'bg-rose-100 text-rose-800' }
      : p === 'High' ? { stripe: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-800' }
      : { stripe: 'border-l-indigo-300', badge: 'bg-slate-100 text-slate-600' };
  const audienceColor: Record<string, string> = {
      Everybody: 'bg-indigo-50 text-indigo-700', Staff: 'bg-purple-50 text-purple-700',
      Students: 'bg-teal-50 text-teal-700', Parents: 'bg-orange-50 text-orange-700',
  };

  const pageLoading = (isLoading && !announcements) || isRoleLoading || schoolLoading;
  const hasMore = (announcements?.length || 0) >= pageSize;

  return (
    <div className="space-y-5 p-4 sm:p-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-indigo-600">{schoolName ? `${schoolName} · ` : ''}Noticeboard</p>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Announcements</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                  {canManage ? 'Post notices to everybody, staff, students or parents.' : 'Notices from the school.'}
              </p>
          </div>
          {canManage && schoolId && (
              <Button onClick={() => setIsFormOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 font-black text-xs rounded-xl h-10 px-4 gap-1.5 w-fit">
                  <Plus className="h-4 w-4" /> New announcement
              </Button>
          )}
      </div>

      {/* Summary (managers) */}
      {canManage && !pageLoading && (announcements?.length || 0) > 0 && (
          <div className="grid grid-cols-3 gap-3">
              {[
                  { label: 'Last 30 days', value: stats.last30, sub: 'posts' },
                  { label: 'Urgent / high', value: stats.important, sub: `of ${stats.shown} shown` },
                  { label: 'Latest post', value: stats.latest ? format(stats.latest, 'd MMM') : '—', sub: stats.latest ? format(stats.latest, 'yyyy') : '' },
              ].map(x => (
                  <div key={x.label} className="p-4 bg-white border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{x.label}</p>
                      <p className="text-xl font-black text-slate-800 mt-1">{x.value}</p>
                      <p className="text-[10px] font-bold text-slate-500">{x.sub}</p>
                  </div>
              ))}
          </div>
      )}

      {/* Filters */}
      {!pageLoading && (announcements?.length || 0) > 0 && (
          <div className="flex flex-col sm:flex-row gap-2">
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notices…" className="rounded-xl h-10 text-sm sm:max-w-xs" />
              <div className="flex gap-1 overflow-x-auto p-1 bg-slate-100 rounded-xl">
                  {(['All', 'Everybody', 'Parents', 'Students', 'Staff'] as const).map(a => (
                      <button key={a} onClick={() => setAudienceFilter(a)}
                          className={cn("shrink-0 px-3 py-1.5 text-[11px] font-black rounded-lg", audienceFilter === a ? "bg-white text-indigo-700 shadow" : "text-slate-500")}>
                          {a}
                      </button>
                  ))}
              </div>
              <button onClick={() => setPriorityFilter(priorityFilter === 'All' ? 'Important' : 'All')}
                  className={cn("shrink-0 px-3 py-2 text-[11px] font-black rounded-xl border", priorityFilter === 'Important' ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-white border-slate-200 text-slate-500")}>
                  Urgent / high only
              </button>
          </div>
      )}

      {/* Feed */}
      {pageLoading ? (
          <div className="flex flex-col items-center py-24 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-xs font-bold text-slate-400">Loading notices…</p>
          </div>
      ) : (!announcements || announcements.length === 0) ? (
          <div className="text-center py-16 border border-dashed rounded-3xl bg-white">
              <Megaphone className="h-8 w-8 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-black text-slate-700">No announcements yet</p>
              {canManage && (
                  <Button onClick={() => setIsFormOpen(true)} className="mt-4 bg-indigo-600 hover:bg-indigo-700 font-black text-xs rounded-xl">Post the first one</Button>
              )}
          </div>
      ) : filtered.length === 0 ? (
          <p className="text-center text-xs font-bold text-slate-400 py-10">No notices match your search or filters.</p>
      ) : (
          <div className="space-y-6">
              {groups.map(g => (
                  <section key={g.label} className="space-y-3">
                      <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-1">{g.label}</h2>
                      {g.posts.map(post => {
                          const st = priorityStyle(post.priority);
                          const d = postDate(post);
                          const long = (post.content || '').length > 280 || (post.content || '').split('\n').length > 4;
                          const open = !!expanded[post.id];
                          return (
                              <Card key={post.id} className={cn("rounded-2xl border border-slate-100 border-l-4 bg-white shadow-sm", st.stripe)}>
                                  <CardContent className="p-5 space-y-3">
                                      <div className="flex items-start justify-between gap-3">
                                          <div className="min-w-0 space-y-1">
                                              <div className="flex flex-wrap items-center gap-2">
                                                  {post.priority !== 'Normal' && <Badge className={cn("border-none text-[9px] font-black uppercase", st.badge)}>{post.priority}</Badge>}
                                                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1"><Calendar className="h-3 w-3" />{d ? format(d, 'EEE d MMM yyyy, h:mm a') : '—'}</span>
                                              </div>
                                              <h3 className="text-base font-black text-slate-900 leading-snug">{post.title}</h3>
                                          </div>
                                          {canManage && (
                                              <AlertDialog>
                                                  <AlertDialogTrigger asChild>
                                                      <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl h-8 w-8 shrink-0">
                                                          <Trash2 className="h-4 w-4" />
                                                      </Button>
                                                  </AlertDialogTrigger>
                                                  <AlertDialogContent className="rounded-3xl">
                                                      <AlertDialogHeader>
                                                          <AlertDialogTitle>Delete this announcement?</AlertDialogTitle>
                                                          <AlertDialogDescription>"{post.title}" will be removed from everyone's portal.</AlertDialogDescription>
                                                      </AlertDialogHeader>
                                                      <AlertDialogFooter>
                                                          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                                          <AlertDialogAction onClick={() => handleDelete(post.id)} className="bg-red-600 hover:bg-red-700 rounded-xl">Delete</AlertDialogAction>
                                                      </AlertDialogFooter>
                                                  </AlertDialogContent>
                                              </AlertDialog>
                                          )}
                                      </div>

                                      <p className={cn("text-sm text-slate-600 leading-relaxed whitespace-pre-wrap", long && !open && "line-clamp-4")}>{post.content}</p>
                                      {long && (
                                          <button onClick={() => setExpanded(e => ({ ...e, [post.id]: !open }))} className="text-[11px] font-black text-indigo-700">
                                              {open ? 'Show less' : 'Read more'}
                                          </button>
                                      )}

                                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                                          <div className="flex items-center gap-2">
                                              <Avatar className="h-7 w-7">
                                                  <AvatarFallback className="bg-indigo-100 text-indigo-700 font-black text-[11px]">{post.authorName?.charAt(0)}</AvatarFallback>
                                              </Avatar>
                                              <span className="text-xs font-bold text-slate-700">{post.authorName}</span>
                                              <span className="text-[10px] font-semibold text-slate-400">{post.authorRole}</span>
                                          </div>
                                          <div className="flex flex-wrap gap-1">
                                              {(post.audience || []).map(aud => (
                                                  <Badge key={aud} className={cn("border-none text-[9px] font-black uppercase rounded-md", audienceColor[aud] || 'bg-slate-100 text-slate-600')}>{aud === 'Everybody' ? 'Everyone' : aud}</Badge>
                                              ))}
                                          </div>
                                      </div>
                                  </CardContent>
                              </Card>
                          );
                      })}
                  </section>
              ))}
              {hasMore && (
                  <div className="text-center">
                      <Button variant="outline" onClick={() => setPageSize(n => n + 30)} className="rounded-xl font-bold text-xs">Show older notices</Button>
                  </div>
              )}
          </div>
      )}

      {schoolId && <PostAnnouncementForm open={isFormOpen} setOpen={setIsFormOpen} schoolId={schoolId}/>}
    </div>
  );
}
