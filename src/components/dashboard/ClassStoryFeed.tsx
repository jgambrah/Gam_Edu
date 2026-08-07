'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { ClassStoryPost, ClassStoryComment, Student } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Tag, Sparkles, Award, Camera, Image as ImageIcon, Video, Send, Loader2, Pin, UserCheck } from 'lucide-react';
import { StudentDisplay } from '@/components/student-display';
import { format } from 'date-fns';

interface ClassStoryFeedProps {
  schoolId: string;
  classId?: string;
  studentIdFilter?: string; // Optional ward filter for parent portal
  userRole?: string;
}

const CATEGORY_STYLES: Record<string, { label: string; color: string }> = {
  Activity: { label: 'Class Activity', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  Achievement: { label: 'Student Achievement', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  Project: { label: 'Science / Art Project', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  'Field Trip': { label: 'Field Trip & Excursion', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Kudos: { label: 'Academic Kudos', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  Announcements: { label: 'Class Bulletin', color: 'bg-sky-50 text-sky-700 border-sky-200' },
};

function StoryCard({ story, students }: { story: ClassStoryPost; students: Student[] }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [commentInput, setCommentInput] = useState('');
  const [showComments, setShowComments] = useState(false);

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

  return (
    <Card className="rounded-[2.5rem] border border-slate-100 shadow-xl bg-white overflow-hidden hover:shadow-2xl transition-all duration-300">
      <CardHeader className="p-6 pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-indigo-50/20">
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
                <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">{story.authorName}</h3>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-full">
                  {story.authorRole || 'Faculty'}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {story.className || 'Whole School'} • {postTimeDisplay}
              </p>
            </div>
          </div>
          <Badge className={`border font-black text-[10px] uppercase px-3 py-1 rounded-full ${categoryInfo.color}`}>
            {categoryInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-5">
        {/* Title & Caption */}
        <div className="space-y-2">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">{story.title}</h2>
          <p className="text-xs text-slate-700 font-medium leading-relaxed whitespace-pre-line">{story.content}</p>
        </div>

        {/* Media Gallery */}
        {story.mediaUrls && story.mediaUrls.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {story.mediaUrls.map((url, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group aspect-video">
                <img
                  src={url}
                  alt={`Story photo ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
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
                  <div key={c.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-150 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800">{c.authorName}</span>
                      <span className="text-[9px] font-bold uppercase text-slate-400">Parent / Faculty</span>
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
    </Card>
  );
}

export function ClassStoryFeed({ schoolId, classId, studentIdFilter }: ClassStoryFeedProps) {
  const firestore = useFirestore();

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

    if (classId && classId !== 'ALL_SCHOOL') {
      list = list.filter(s => s.classId === classId || s.classId === 'ALL_SCHOOL');
    }

    if (studentIdFilter) {
      list = list.filter(s => s.taggedStudentIds && s.taggedStudentIds.includes(studentIdFilter));
    }

    // Sort newest first
    return list.sort((a, b) => {
      const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : (a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0);
      const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : (b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0);
      return timeB - timeA;
    });
  }, [rawStories, classId, studentIdFilter]);

  if (isLoading) {
    return (
      <div className="text-center p-12 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Class Stories Feed...</p>
      </div>
    );
  }

  if (filteredStories.length === 0) {
    return (
      <Card className="rounded-[2.5rem] border border-slate-100 shadow-md bg-white p-12 text-center space-y-3">
        <Camera className="h-12 w-12 text-slate-300 mx-auto" />
        <CardTitle className="text-base font-black uppercase text-slate-700 tracking-tight">No Class Stories Published Yet</CardTitle>
        <CardDescription className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Teachers and faculty will post photos, projects, and achievement updates here soon!
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {filteredStories.map(story => (
        <StoryCard key={story.id} story={story} students={students || []} />
      ))}
    </div>
  );
}
