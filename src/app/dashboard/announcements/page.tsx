'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { 
  Megaphone, Plus, Trash2, Loader2, Calendar, User, AlertCircle, Wand2
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateAnnouncement } from '@/ai/flows/generate-announcement-flow';

// --- TYPE DEFINITION ---
type Announcement = {
  id: string;
  title: string;
  content: string;
  priority: 'Normal' | 'High' | 'Urgent';
  authorName: string;
  authorRole: string;
  postedBy: string;
  createdAt: any;
};

// --- COMPONENT: Post Announcement Form ---
function PostAnnouncementForm({ 
    open, 
    setOpen 
}: { 
    open: boolean, 
    setOpen: (o: boolean) => void 
}) {
    const firestore = useFirestore();
    const { user } = useUser(); // Get full user object for name/photo
    const { role } = useRole();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [priority, setPriority] = useState('Normal');
    const [aiKeyPoints, setAiKeyPoints] = useState('');

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
            await addDoc(collection(firestore, 'announcements'), {
                title,
                content,
                priority,
                authorName: user?.displayName || 'Administrator',
                authorRole: role,
                postedBy: user?.uid,
                createdAt: serverTimestamp()
            });

            toast({ title: 'Success', description: 'Announcement posted.' });
            setOpen(false);
            setTitle('');
            setContent('');
            setPriority('Normal');
            setAiKeyPoints('');
        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Post New Announcement</DialogTitle>
                    <DialogDescription>Share news with the entire school.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    {/* AI Assistant Side */}
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Wand2 className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold">AI Assistant</h3>
                        </div>
                        <div className="space-y-2">
                            <Label>Key Points</Label>
                            <Textarea
                                placeholder="e.g., - Sports day postponed from Oct 20 to Nov 5
- Reason: heavy rain forecast
- Events and times are the same"
                                value={aiKeyPoints}
                                onChange={e => setAiKeyPoints(e.target.value)}
                                className="h-32"
                            />
                        </div>
                        <Button onClick={handleGenerateWithAI} disabled={isGenerating || !aiKeyPoints.trim()} className="w-full">
                            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin"/> : "Generate Announcement"}
                        </Button>
                    </div>

                    {/* Form Side */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input 
                                placeholder="AI will generate this, or you can type it." 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea 
                                placeholder="AI will generate this, or you can write your own." 
                                className="h-32"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Priority Level</Label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Normal">Normal</SelectItem>
                                    <SelectItem value="High">High Importance</SelectItem>
                                    <SelectItem value="Urgent">Urgent / Emergency</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Post Announcement"}
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- MAIN PAGE ---
export default function AnnouncementsPage() {
  const firestore = useFirestore();
  const { role, isRoleLoading } = useRole();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const canManage = ['Administrator', 'Director'].includes(role);

  // 1. FETCH ANNOUNCEMENTS (Ordered by newest first)
  const announcementsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'announcements'), orderBy('createdAt', 'desc')) : null,
    [firestore]
  );
  const { data: announcements, isLoading } = useCollection<Announcement>(announcementsQuery);

  const handleDelete = async (id: string) => {
      if (!confirm("Delete this announcement?")) return;
      try {
          await deleteDoc(doc(firestore, 'announcements', id));
          toast({ title: "Deleted", description: "Announcement removed." });
      } catch (e: any) {
          toast({ variant: 'destructive', title: "Error", description: "Failed to delete." });
      }
  };

  // Helper for Priority Badge Color
  const getPriorityColor = (p: string) => {
      switch(p) {
          case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
          case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
          default: return 'bg-blue-100 text-blue-800 border-blue-200';
      }
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                <Megaphone className="h-8 w-8 text-blue-600"/> School Announcements
            </h1>
            <p className="text-slate-500">Latest news and updates from the administration.</p>
        </div>
        
        {/* Only Admins/Directors see the Add Button */}
        {canManage && (
            <Button onClick={() => setIsFormOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-md">
                <Plus className="mr-2 h-4 w-4"/> Post Announcement
            </Button>
        )}
      </div>

      {/* CONTENT AREA */}
      {isLoading || isRoleLoading ? (
          <div className="flex flex-col items-center py-20 text-muted-foreground gap-2">
              <Loader2 className="h-10 w-10 animate-spin text-blue-500"/>
              <p>Loading updates...</p>
          </div>
      ) : (!announcements || announcements.length === 0) ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl bg-slate-50">
              <div className="bg-white p-4 rounded-full w-fit mx-auto mb-4 shadow-sm">
                  <Megaphone className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-lg font-medium text-slate-600">No announcements yet.</p>
              <p className="text-sm text-slate-400">Check back later for school updates.</p>
              {canManage && (
                  <Button variant="link" onClick={() => setIsFormOpen(true)} className="mt-2 text-blue-600">
                      Create the first post
                  </Button>
              )}
          </div>
      ) : (
          <div className="space-y-6">
              {announcements.map((post) => (
                  <Card key={post.id} className={`border-l-4 shadow-sm transition-all hover:shadow-md ${post.priority === 'Urgent' ? 'border-l-red-500' : post.priority === 'High' ? 'border-l-orange-500' : 'border-l-blue-500'}`}>
                      <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                      <Badge variant="outline" className={getPriorityColor(post.priority)}>
                                          {post.priority}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                          <Calendar className="h-3 w-3"/> 
                                          {post.createdAt ? format(post.createdAt.seconds * 1000, 'PPP p') : 'Just now'}
                                      </span>
                                  </div>
                                  <CardTitle className="text-xl text-slate-800">{post.title}</CardTitle>
                              </div>
                              
                              {/* Delete Button (Only for Admins) */}
                              {canManage && (
                                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(post.id)}>
                                      <Trash2 className="h-4 w-4"/>
                                  </Button>
                              )}
                          </div>
                      </CardHeader>
                      
                      <CardContent className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                          {post.content}
                      </CardContent>

                      <CardFooter className="pt-3 border-t bg-slate-50/50 flex items-center gap-3">
                          <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                                  {post.authorName?.charAt(0)}
                              </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-700">{post.authorName}</span>
                              <span className="text-xs text-slate-400">{post.authorRole}</span>
                          </div>
                      </CardFooter>
                  </Card>
              ))}
          </div>
      )}

      {/* MODAL */}
      <PostAnnouncementForm open={isFormOpen} setOpen={setIsFormOpen} />

    </div>
  );
}
