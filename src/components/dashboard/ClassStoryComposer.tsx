'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Class, Student } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Camera, Sparkles, Tag, Plus, X, Image as ImageIcon, Video, Loader2, Award } from 'lucide-react';
import { StudentDisplay } from '@/components/student-display';

interface ClassStoryComposerProps {
  schoolId: string;
  classes: Class[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStoryCreated?: () => void;
}

const CATEGORIES = [
  { id: 'Science Project', label: '🧪 Science Project', icon: Camera, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'Art & Craft', label: '🎨 Art & Craft', icon: ImageIcon, color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { id: 'Sports & Fitness', label: '⚽ Sports & Fitness', icon: Sparkles, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'Academic Kudos', label: '🏆 Academic Kudos', icon: Award, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'Field Trip', label: '🚌 Field Trip & Excursion', icon: Tag, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'Class Activity', label: '🌟 Class Activity', icon: Sparkles, color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'Class Bulletin', label: '📢 Class Bulletin', icon: Video, color: 'bg-slate-100 text-slate-700 border-slate-200' },
] as const;

export function ClassStoryComposer({ schoolId, classes, open, onOpenChange, onStoryCreated }: ClassStoryComposerProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [classId, setClassId] = useState<string>('ALL_SCHOOL');
  const [category, setCategory] = useState<typeof CATEGORIES[number]['id']>('Activity');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [taggedStudentIds, setTaggedStudentIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch students for tagging
  const studentsQuery = useMemoFirebase(
    () => (firestore && schoolId ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null),
    [firestore, schoolId]
  );
  const { data: students } = useCollection<Student>(studentsQuery);

  const availableStudents = useMemo(() => {
    if (!students) return [];
    if (classId === 'ALL_SCHOOL') return students;
    return students.filter(s => s.classId === classId);
  }, [students, classId]);

  const handleAddMedia = () => {
    if (mediaUrlInput.trim()) {
      setMediaUrls(prev => [...prev, mediaUrlInput.trim()]);
      setMediaUrlInput('');
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  const toggleTagStudent = (studentId: string) => {
    setTaggedStudentIds(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ title: 'Please provide both a title and story description.', variant: 'destructive' });
      return;
    }

    if (!firestore || !user || !schoolId) return;

    setIsSubmitting(true);
    try {
      const selectedClass = classes.find(c => c.id === classId);
      const className = classId === 'ALL_SCHOOL' ? 'Whole School Community' : selectedClass?.name || 'Class';

      await addDocumentNonBlocking(collection(firestore, 'class_stories'), {
        schoolId,
        classId,
        className,
        authorId: user.uid,
        authorName: user.displayName || 'Faculty Educator',
        authorRole: 'Teacher',
        authorAvatar: user.photoURL || '',
        title: title.trim(),
        content: content.trim(),
        category,
        mediaUrls,
        taggedStudentIds,
        likes: [],
        commentsCount: 0,
        createdAt: serverTimestamp()
      });

      toast({ title: 'Class Story published successfully! 🎉' });
      setTitle('');
      setContent('');
      setMediaUrls([]);
      setTaggedStudentIds([]);
      onOpenChange(false);
      if (onStoryCreated) onStoryCreated();
    } catch (err) {
      console.error('Error publishing story:', err);
      toast({ title: 'Failed to publish story.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-6 border-none shadow-2xl bg-white">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-900">Publish Class Story</DialogTitle>
              <DialogDescription className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Share learning moments, photos & achievements with parents</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Target Audience & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Select Class Target</label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger className="h-11 rounded-2xl border-2 font-bold text-xs">
                  <SelectValue placeholder="Target Class..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL_SCHOOL">🌟 Whole School Community</SelectItem>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Category Tag</label>
              <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                <SelectTrigger className="h-11 rounded-2xl border-2 font-bold text-xs">
                  <SelectValue placeholder="Category..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Story Title & Content */}
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Story Title</label>
              <Input
                placeholder="e.g. Grade 4 Science Fair & Experiment Highlights! 🔬"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-11 rounded-2xl border-2 text-xs font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Story Caption / Details</label>
              <Textarea
                placeholder="Describe the activity, learning goals, or celebrate what the students accomplished today..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="rounded-2xl border-2 text-xs font-medium resize-none p-3"
              />
            </div>
          </div>

          {/* Media Links / Photos */}
          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-150">
            <label className="text-xs font-black uppercase text-slate-600 tracking-wider flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-indigo-600" /> Photo & Video Links
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Paste image or video URL (https://...)"
                value={mediaUrlInput}
                onChange={(e) => setMediaUrlInput(e.target.value)}
                className="h-10 rounded-xl border-2 text-xs bg-white"
              />
              <Button type="button" onClick={handleAddMedia} variant="outline" className="h-10 px-4 rounded-xl font-extrabold text-xs uppercase border-2">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {mediaUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {mediaUrls.map((url, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold py-1 px-3 rounded-xl flex items-center gap-1.5 shadow-sm">
                    <span>Media #{idx + 1}</span>
                    <X className="h-3 w-3 cursor-pointer text-slate-400 hover:text-rose-500" onClick={() => handleRemoveMedia(idx)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Tag Students */}
          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-150">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase text-slate-600 tracking-wider flex items-center gap-2">
                <Tag className="h-4 w-4 text-amber-600" /> Tag Student Achievers ({taggedStudentIds.length} tagged)
              </label>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {availableStudents.map(student => {
                const isTagged = taggedStudentIds.includes(student.uid || student.id);
                return (
                  <div
                    key={student.uid || student.id}
                    onClick={() => toggleTagStudent(student.uid || student.id)}
                    className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-colors ${
                      isTagged ? 'bg-indigo-50/80 border-indigo-300 text-indigo-900 font-bold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <StudentDisplay student={student} variant="compact" />
                    <Badge className={isTagged ? 'bg-indigo-600 text-white text-[9px] uppercase' : 'bg-slate-100 text-slate-500 text-[9px] uppercase'}>
                      {isTagged ? 'Tagged' : 'Tag'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-2xl font-black uppercase tracking-tight text-white shadow-lg shadow-indigo-100"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Publish Class Story ✨'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
