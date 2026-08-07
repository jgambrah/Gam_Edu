'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { ClassStoryPost, ClassStoryComment, Student } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Heart, MessageCircle, Share2, Tag, Sparkles, Award, Camera, Image as ImageIcon, Video, Send, Loader2, Pin, UserCheck, Trash2, Building, Sparkle, BookOpen, Play, Maximize2, Pencil, X, Plus } from 'lucide-react';
import { StudentDisplay } from '@/components/student-display';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ClassStoryFeedProps {
  schoolId: string;
  classId?: string;
  studentIdFilter?: string; // Optional ward filter for parent portal
  userRole?: string;
}

const CATEGORY_STYLES: Record<string, { label: string; color: string }> = {
  'Science Project': { label: '🧪 Science Project', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  'Art & Craft': { label: '🎨 Art & Craft', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  'Sports & Fitness': { label: '⚽ Sports & Fitness', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'Academic Kudos': { label: '🏆 Academic Kudos', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  'Field Trip': { label: '🚌 Field Trip & Excursion', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  'Class Activity': { label: '🌟 Class Activity', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  'Class Bulletin': { label: '📢 Class Bulletin', color: 'bg-slate-100 text-slate-700 border-slate-200' },
};
function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', 'data:video/'];
  const lower = url.toLowerCase();
  if (videoExtensions.some(ext => lower.includes(ext))) return true;
  if (lower.includes('youtube.com') || lower.includes('youtu.be') || lower.includes('vimeo.com')) return true;
  return false;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const regExp = /vimeo\.com\/(?:video\/)?([0-9]+)/;
  const match = url.match(regExp);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

function MediaElement({ url, onOpenImage }: { url: string; onOpenImage: (url: string) => void }) {
  const isVideo = isVideoUrl(url);

  if (isVideo) {
    const ytEmbed = getYouTubeEmbedUrl(url);
    if (ytEmbed) {
      return (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video w-full shadow-md">
          <iframe src={ytEmbed} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      );
    }
    const vimeoEmbed = getVimeoEmbedUrl(url);
    if (vimeoEmbed) {
      return (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video w-full shadow-md">
          <iframe src={vimeoEmbed} className="w-full h-full border-0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        </div>
      );
    }

    return (
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 aspect-video w-full shadow-md">
        <video src={url} controls className="w-full h-full object-cover rounded-2xl" preload="metadata" />
      </div>
    );
  }

  return (
    <div
      onClick={() => onOpenImage(url)}
      className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group aspect-video cursor-pointer shadow-md"
    >
      <img
        src={url}
        alt="Class Story Moment"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
        <div className="p-2.5 bg-black/60 rounded-full backdrop-blur-md">
          <Maximize2 className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function StoryCard({ story, students, userRole }: { story: ClassStoryPost; students: Student[]; userRole?: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [commentInput, setCommentInput] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Edit / Delete State
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTitle, setEditTitle] = useState(story.title);
  const [editContent, setEditContent] = useState(story.content);
  const [editCategory, setEditCategory] = useState<any>(story.category);
  const [editMediaUrls, setEditMediaUrls] = useState<string[]>(story.mediaUrls || []);
  const [editMediaInput, setEditMediaInput] = useState('');

  const canManageStory = useMemo(() => {
    if (!user) return false;
    return user.uid === story.authorId || userRole === 'Admin' || userRole === 'SuperAdmin' || userRole === 'Teacher';
  }, [user, story.authorId, userRole]);

  const handleDeleteStory = async () => {
    if (!firestore || !story.id) return;
    if (!window.confirm('Are you sure you want to pull down/delete this class story?')) return;

    setIsDeleting(true);
    try {
      await deleteDoc(doc(firestore, 'class_stories', story.id));
      toast({ title: 'Class Story pulled down successfully. 🗑️' });
    } catch (err) {
      console.error('Error deleting story:', err);
      toast({ title: 'Failed to pull down story.', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim() || !firestore || !story.id) {
      toast({ title: 'Please provide both title and content.', variant: 'destructive' });
      return;
    }

    try {
      const finalMedia = [...editMediaUrls];
      if (editMediaInput.trim() && !finalMedia.includes(editMediaInput.trim())) {
        finalMedia.push(editMediaInput.trim());
      }

      await updateDoc(doc(firestore, 'class_stories', story.id), {
        title: editTitle.trim(),
        content: editContent.trim(),
        category: editCategory,
        mediaUrls: finalMedia,
      });

      setIsEditing(false);
      toast({ title: 'Class Story updated successfully! ✨' });
    } catch (err) {
      console.error('Error updating story:', err);
      toast({ title: 'Failed to update story.', variant: 'destructive' });
    }
  };

  // Fetch story comments subcollection
  const commentsQuery = useMemoFirebase(
    () => (firestore && story.id ? query(collection(firestore, 'class_stories', story.id, 'comments')) : null),
    [firestore, story.id]
  );
  const { data: comments } = useCollection<ClassStoryComment>(commentsQuery);

  const isLiked = useMemo(() => {
    if (!user || !story.likes) return false;
    return story.likes.includes(user.uid);
  }, [user, story.likes]);

  const likesCount = story.likes ? story.likes.length : 0;

  const handleToggleLike = async () => {
    if (!firestore || !user || !story.id) return;
    const storyRef = doc(firestore, 'class_stories', story.id);
    try {
      if (isLiked) {
        await updateDoc(storyRef, { likes: arrayRemove(user.uid) });
      } else {
        await updateDoc(storyRef, { likes: arrayUnion(user.uid) });
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !firestore || !user || !story.id) return;

    try {
      await addDocumentNonBlocking(collection(firestore, 'class_stories', story.id, 'comments'), {
        storyId: story.id,
        schoolId: story.schoolId,
        authorId: user.uid,
        authorName: user.displayName || 'Parent',
        authorRole: 'Parent',
        authorAvatar: user.photoURL || '',
        content: commentInput.trim(),
        createdAt: serverTimestamp()
      });

      // Update story comment count
      await updateDoc(doc(firestore, 'class_stories', story.id), {
        commentsCount: (story.commentsCount || 0) + 1
      });

      setCommentInput('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const categoryInfo = CATEGORY_STYLES[story.category] || CATEGORY_STYLES.Activity;

  // Format timestamp
  const postTimeDisplay = useMemo(() => {
    if (!story.createdAt) return 'Just now';
    let dt: Date | null = null;
    if (story.createdAt?.toDate) dt = story.createdAt.toDate();
    else if (story.createdAt?.seconds) dt = new Date(story.createdAt.seconds * 1000);
    else if (story.createdAt instanceof Date) dt = story.createdAt;

    return dt ? format(dt, 'dd MMM yyyy, hh:mm a') : 'Recently';
  }, [story.createdAt]);

  const taggedStudents = useMemo(() => {
    if (!story.taggedStudentIds || !students) return [];
    return students.filter(s => story.taggedStudentIds?.includes(s.uid || s.id));
  }, [story.taggedStudentIds, students]);

  const handleDeleteComment = async (commentId: string) => {
    if (!firestore || !story.id || !commentId) return;
    try {
      await deleteDoc(doc(firestore, 'class_stories', story.id, 'comments', commentId));
      await updateDoc(doc(firestore, 'class_stories', story.id), {
        commentsCount: Math.max(0, (story.commentsCount || 1) - 1)
      });
    } catch (err) {
      console.error('Error moderating comment:', err);
    }
  };

  const allMedia = useMemo(() => {
    const list = [...(story.mediaUrls || [])];
    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    const matches = (story.content || '').match(urlRegex) || [];
    matches.forEach(m => {
      const clean = m.replace(/[.,;!?)]+$/, '');
      if (!list.includes(clean)) list.push(clean);
    });
    return list;
  }, [story.mediaUrls, story.content]);

  return (
    <Card className="rounded-[2.5rem] border border-slate-100 shadow-xl bg-white overflow-hidden hover:shadow-2xl transition-all duration-300">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-indigo-200 shadow-sm">
              <AvatarImage src={story.authorAvatar} />
              <AvatarFallback className="bg-indigo-600 text-white font-extrabold text-xs">
                {story.authorName ? story.authorName.slice(0, 2).toUpperCase() : 'FC'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white tracking-tight">{story.authorName}</h3>
                <Badge variant="outline" className="bg-indigo-500/20 text-indigo-100 border-indigo-400 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-full">
                  {story.authorRole || 'Faculty'}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-300 font-bold uppercase tracking-wider mt-0.5">
                {story.className || 'Whole School'} • {postTimeDisplay}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`border font-black text-[10px] uppercase px-3 py-1 rounded-full ${categoryInfo.color}`}>
              {categoryInfo.label}
            </Badge>

            {canManageStory && (
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10 ml-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-7 w-7 p-0 text-slate-300 hover:text-white hover:bg-white/20 rounded-lg"
                  title="Edit Story"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteStory}
                  disabled={isDeleting}
                  className="h-7 w-7 p-0 text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 rounded-lg"
                  title="Pull Down / Delete Story"
                >
                  {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Title & Caption */}
        <div className="space-y-2">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">{story.title}</h2>
          <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line">{story.content}</p>
        </div>

        {/* Media Gallery (Uploaded + Auto-Extracted Video/Image URLs) */}
        {allMedia.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {allMedia.map((url, idx) => (
              <MediaElement key={idx} url={url} onOpenImage={setSelectedImage} />
            ))}
          </div>
        )}

        {/* Tagged Student Achievers */}
        {taggedStudents.length > 0 && (
          <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-150 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-900 font-black text-[10px] uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Recognized Student Achievers</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {taggedStudents.map(student => (
                <div key={student.uid || student.id} className="bg-white p-1.5 px-3 rounded-xl border border-amber-200 shadow-sm flex items-center gap-2">
                  <StudentDisplay student={student} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interaction Bar */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <div className="flex gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleLike}
              className={`rounded-xl text-xs font-black uppercase px-3 gap-1.5 ${
                isLiked ? 'text-rose-600 bg-rose-50 hover:bg-rose-100' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(prev => !prev)}
              className="rounded-xl text-xs font-black uppercase px-3 text-slate-500 hover:text-slate-900 hover:bg-slate-100 gap-1.5"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{comments?.length || story.commentsCount || 0} Comments</span>
            </Button>
          </div>
        </div>

        {/* Comments Sub-Section */}
        {showComments && (
          <div className="pt-3 border-t border-slate-100 space-y-4">
            <form onSubmit={handleAddComment} className="flex gap-2">
              <Input
                placeholder="Write an encouraging comment for the class..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="h-10 rounded-xl border-2 text-xs bg-slate-50"
              />
              <Button type="submit" className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase rounded-xl">
                <Send className="h-4 w-4" />
              </Button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {comments && comments.length > 0 ? (
                comments.map(c => (
                  <div key={c.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-150 text-xs space-y-1 relative group">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800">{c.authorName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase text-slate-400">Parent / Faculty</span>
                        {(user?.uid === c.authorId || user?.uid === story.authorId) && (
                          <Trash2
                            className="h-3.5 w-3.5 text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
                            onClick={() => handleDeleteComment(c.id)}
                            title="Moderate / Delete comment"
                          />
                        )}
                      </div>
                    </div>
                    <p className="text-slate-600 font-medium">{c.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-400 italic font-medium">No comments yet. Be the first to encourage the class!</p>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Image Lightbox Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-2 bg-slate-950 border-slate-800 rounded-3xl overflow-hidden flex items-center justify-center">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Class Moment Full View"
              className="max-h-[85vh] w-auto object-contain rounded-2xl mx-auto shadow-2xl"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Story Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-xl p-6 bg-white rounded-3xl space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase text-slate-900 tracking-tight">Edit Class Story</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Category Tag</label>
              <Select value={editCategory} onValueChange={(val: any) => setEditCategory(val)}>
                <SelectTrigger className="h-10 rounded-xl border-2 font-bold text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_STYLES).map(([catKey, catVal]) => (
                    <SelectItem key={catKey} value={catKey}>{catVal.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Story Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-10 rounded-xl border-2 text-xs font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Story Content / Details</label>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                className="rounded-xl border-2 text-xs font-medium resize-none p-3"
              />
            </div>

            <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <label className="text-xs font-black uppercase text-slate-600 tracking-wider">Photo / Video Attachments</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Paste YouTube or photo URL..."
                  value={editMediaInput}
                  onChange={(e) => setEditMediaInput(e.target.value)}
                  className="h-9 rounded-lg border-2 text-xs bg-white"
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (editMediaInput.trim()) {
                      setEditMediaUrls(prev => [...prev, editMediaInput.trim()]);
                      setEditMediaInput('');
                    }
                  }}
                  variant="outline"
                  className="h-9 px-3 text-xs font-extrabold uppercase border-2"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add
                </Button>
              </div>

              {editMediaUrls.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {editMediaUrls.map((url, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-white border text-[10px] font-bold py-1 px-2 rounded-lg flex items-center gap-1">
                      <span className="truncate max-w-[120px]">Media #{idx + 1}</span>
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-rose-600"
                        onClick={() => setEditMediaUrls(prev => prev.filter((_, i) => i !== idx))}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl text-xs font-extrabold uppercase">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl text-xs font-extrabold uppercase bg-indigo-600 hover:bg-indigo-700 text-white">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export function ClassStoryFeed({ schoolId, classId, studentIdFilter, userRole }: ClassStoryFeedProps) {
  const { role: contextRole } = useRole();
  const effectiveRole = userRole || contextRole || undefined;
  const firestore = useFirestore();
  const [feedFilter, setFeedFilter] = useState<'all' | 'ward' | 'class' | 'school'>('all');

  const storiesQuery = useMemoFirebase(
    () => (firestore && schoolId ? query(collection(firestore, 'class_stories'), where('schoolId', '==', schoolId)) : null),
    [firestore, schoolId]
  );
  const { data: rawStories, isLoading } = useCollection<ClassStoryPost>(storiesQuery);

  const studentsQuery = useMemoFirebase(
    () => (firestore && schoolId ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null),
    [firestore, schoolId]
  );
  const { data: students } = useCollection<Student>(studentsQuery);

  const filteredStories = useMemo(() => {
    if (!rawStories) return [];
    let list = [...rawStories];

    if (feedFilter === 'ward' && studentIdFilter) {
      list = list.filter(s => s.taggedStudentIds && s.taggedStudentIds.includes(studentIdFilter));
    } else if (feedFilter === 'class' && classId && classId !== 'ALL_SCHOOL') {
      list = list.filter(s => s.classId === classId);
    } else if (feedFilter === 'school') {
      list = list.filter(s => s.classId === 'ALL_SCHOOL');
    } else if (classId && classId !== 'ALL_SCHOOL') {
      list = list.filter(s => s.classId === classId || s.classId === 'ALL_SCHOOL');
    }

    return list.sort((a, b) => {
      const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0);
      const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0);
      return timeB - timeA;
    });
  }, [rawStories, classId, studentIdFilter, feedFilter]);

  if (isLoading) {
    return (
      <div className="text-center p-12 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Class Stories Feed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-100/90 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-inner">
        <button
          onClick={() => setFeedFilter('all')}
          className={cn(
            "px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-200",
            feedFilter === 'all' ? "bg-white text-indigo-600 shadow-sm font-black scale-[1.02]" : "text-slate-500 hover:text-slate-900"
          )}
        >
          🎨 All Stories
        </button>
        {studentIdFilter && (
          <button
            onClick={() => setFeedFilter('ward')}
            className={cn(
              "px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-200",
              feedFilter === 'ward' ? "bg-white text-indigo-600 shadow-sm font-black scale-[1.02]" : "text-slate-500 hover:text-slate-900"
            )}
          >
            🌟 My Ward Highlights
          </button>
        )}
        <button
          onClick={() => setFeedFilter('class')}
          className={cn(
            "px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-200",
            feedFilter === 'class' ? "bg-white text-indigo-600 shadow-sm font-black scale-[1.02]" : "text-slate-500 hover:text-slate-900"
          )}
        >
          📚 Class Feed
        </button>
        <button
          onClick={() => setFeedFilter('school')}
          className={cn(
            "px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-200",
            feedFilter === 'school' ? "bg-white text-indigo-600 shadow-sm font-black scale-[1.02]" : "text-slate-500 hover:text-slate-900"
          )}
        >
          🏛️ School Community
        </button>
      </div>

      {filteredStories.length > 0 ? (
        filteredStories.map(story => (
          <StoryCard key={story.id} story={story} students={students || []} userRole={effectiveRole} />
        ))
      ) : (
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-md bg-white p-12 text-center space-y-3">
          <Camera className="h-12 w-12 text-slate-300 mx-auto" />
          <CardTitle className="text-base font-black uppercase text-slate-700 tracking-tight">No Class Stories Found</CardTitle>
          <CardDescription className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            {feedFilter === 'ward'
              ? "No specific stories tagged for your ward in this view yet."
              : "Teachers and faculty will post photos, projects, and achievement updates here soon!"}
          </CardDescription>
        </Card>
      )}
    </div>
  );
}
