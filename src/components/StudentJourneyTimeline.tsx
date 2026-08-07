'use client';

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, addDoc, doc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, Search, Filter, Plus, FileText, Image, Download, Loader2, 
  GraduationCap, Award, ShieldAlert, Sparkles, BookOpen, Star, 
  MapPin, HeartHandshake, User, Users, Lock, Milestone, Briefcase, FileBadge,
  Share2, QrCode, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { TimelineCategory, TimelineService } from '@/lib/timeline-service';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const CATEGORY_META: Record<TimelineCategory, { label: string, color: string, bg: string, border: string, icon: any }> = {
  admission: { label: 'Admission & Intake', color: 'text-emerald-700 dark:text-emerald-450', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-100 dark:border-emerald-900/30', icon: GraduationCap },
  promotion: { label: 'Promotion', color: 'text-indigo-755 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/20', border: 'border-indigo-100 dark:border-indigo-900/30', icon: Milestone },
  academic: { label: 'Academic Performance', color: 'text-blue-700 dark:text-blue-450', bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-100 dark:border-blue-900/30', icon: BookOpen },
  awards: { label: 'Awards & Honours', color: 'text-amber-700 dark:text-amber-450', bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-100 dark:border-amber-900/30', icon: Award },
  leadership: { label: 'Leadership Roles', color: 'text-purple-700 dark:text-purple-450', bg: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-purple-100 dark:border-purple-900/30', icon: Star },
  activity: { label: 'Co-Curricular Activities', color: 'text-pink-700 dark:text-pink-450', bg: 'bg-pink-50 dark:bg-pink-950/20', border: 'border-pink-100 dark:border-pink-900/30', icon: Sparkles },
  project: { label: 'Projects & Practicals', color: 'text-cyan-700 dark:text-cyan-450', bg: 'bg-cyan-50 dark:bg-cyan-950/20', border: 'border-cyan-100 dark:border-cyan-900/30', icon: Briefcase },
  attendance: { label: 'Attendance Milestone', color: 'text-slate-700 dark:text-slate-405', bg: 'bg-slate-50 dark:bg-slate-950/20', border: 'border-slate-100 dark:border-slate-900/30', icon: Calendar },
  behavior: { label: 'Behaviour & Discipline', color: 'text-orange-700 dark:text-orange-450', bg: 'bg-orange-50 dark:bg-orange-950/20', border: 'border-orange-100 dark:border-orange-900/30', icon: ShieldAlert },
  health: { label: 'Health & Welfare', color: 'text-rose-700 dark:text-rose-450', bg: 'bg-rose-50 dark:bg-rose-950/20', border: 'border-rose-100 dark:border-rose-900/30', icon: HeartHandshake },
  meeting: { label: 'Parent-Teacher Meet', color: 'text-teal-700 dark:text-teal-450', bg: 'bg-teal-50 dark:bg-teal-950/20', border: 'border-teal-100 dark:border-teal-900/30', icon: Users },
  financial: { label: 'Financial / Scholarship', color: 'text-violet-700 dark:text-violet-450', bg: 'bg-violet-50 dark:bg-violet-950/20', border: 'border-violet-100 dark:border-violet-900/30', icon: Award },
  certificate: { label: 'Certificates & Badges', color: 'text-yellow-700 dark:text-yellow-450', bg: 'bg-yellow-50 dark:bg-yellow-950/20', border: 'border-yellow-100 dark:border-yellow-900/30', icon: FileBadge },
  graduation: { label: 'Graduation Day', color: 'text-indigo-800 dark:text-indigo-350', bg: 'bg-indigo-100/50 dark:bg-indigo-950/30', border: 'border-indigo-200 dark:border-indigo-900/40', icon: GraduationCap }
};

export function StudentJourneyTimeline({ studentId }: { studentId: string }) {
  const { user } = useUser();
  const { role, profile } = useRole();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [termFilter, setTermFilter] = useState<string>('all');

  const [activeTab, setActiveTab] = useState<'timeline' | 'portfolio'>('timeline');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Manual Logger State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TimelineCategory>('awards');
  const [eventDate, setEventDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [academicYear, setAcademicYear] = useState(MOCK_ACADEMIC_YEARS[4] || '2024-2025');
  const [term, setTerm] = useState(MOCK_TERMS[0] || 'First Term');

  // Roles & Permissions
  const canAddEvent = useMemo(() => {
    if (!role) return false;
    const roleStr = role as string;
    return roleStr === 'Director' || roleStr === 'Administrator' || roleStr === 'Teacher' || roleStr === 'Nurse' || roleStr === 'Doctor';
  }, [role]);

  // Determine allowed categories for the active user's role
  const allowedCategories = useMemo(() => {
    const all = Object.keys(CATEGORY_META) as TimelineCategory[];
    const roleStr = role as string;
    if (roleStr === 'Teacher') {
      // Teachers cannot access Health or Financial categories
      return all.filter(c => c !== 'health' && c !== 'financial');
    }
    if (['Nurse', 'Doctor', 'Warden', 'Boarding Staff'].includes(roleStr || '')) {
      // Health / Boarding Staff can read health logs
      return ['health', 'admission', 'promotion', 'attendance', 'behavior', 'meeting'];
    }
    return all;
  }, [role]);

  // Set default form category if role restricts the default 'awards'
  useEffect(() => {
    const roleStr = role as string;
    if (roleStr === 'Nurse' || roleStr === 'Doctor') {
      setCategory('health');
    } else if (roleStr === 'Teacher') {
      setCategory('academic');
    } else {
      setCategory('awards');
    }
  }, [role]);

  // Fetch Timeline Events (Client-side Query)
  const timelineQuery = useMemoFirebase(() => {
    if (!firestore || !studentId) return null;
    const timelineRef = collection(firestore, 'students', studentId, 'timeline');
    return query(timelineRef);
  }, [firestore, studentId]);

  const { data: manualEvents, isLoading: isLoadingManual } = useCollection<any>(timelineQuery);

  const assessmentsQuery = useMemoFirebase(() => {
    if (!firestore || !studentId) return null;
    return query(collection(firestore, 'assessments'), where('studentId', '==', studentId));
  }, [firestore, studentId]);
  const { data: assessmentsData, isLoading: isLoadingAssessments } = useCollection<any>(assessmentsQuery);

  const behaviorQuery = useMemoFirebase(() => {
    if (!firestore || !studentId) return null;
    return query(collection(firestore, 'behavioral_records'), where('studentId', '==', studentId));
  }, [firestore, studentId]);
  const { data: behaviorData, isLoading: isLoadingBehavior } = useCollection<any>(behaviorQuery);

  const stickersQuery = useMemoFirebase(() => {
    if (!firestore || !studentId) return null;
    return query(collection(firestore, 'junior_stickers'), where('userId', '==', studentId));
  }, [firestore, studentId]);
  const { data: stickersData, isLoading: isLoadingStickers } = useCollection<any>(stickersQuery);

  const isLoading = isLoadingManual || isLoadingAssessments || isLoadingBehavior || isLoadingStickers;

  const rawEvents = useMemo(() => {
    const list: any[] = [];

    // 1. Add manually logged timeline events
    if (manualEvents) {
      list.push(...manualEvents);
    }

    // 2. Add derived academic events from assessments
    if (assessmentsData) {
      assessmentsData.forEach((item: any) => {
        // Prevent duplicate logs if already manually recorded or logged via gradebook
        const hasDuplicate = manualEvents?.some((me: any) => 
          me.metadata?.assessmentId === item.id || 
          (me.category === 'academic' && me.title === `Graded: ${item.assessmentType}` && me.metadata?.subjectId === item.subjectId && Math.abs((me.metadata?.score || 0) - (item.score || 0)) < 0.01)
        );
        if (!hasDuplicate) {
          list.push({
            id: `assessment_${item.id}`,
            studentId,
            title: `Graded: ${item.assessmentType}`,
            description: `Scored ${item.score}/${item.maxScore} in ${item.subjectName || 'Subject'}.${item.teacherRemark ? ' Remark: "' + item.teacherRemark + '"' : ''}`,
            category: 'academic',
            academicYear: item.academicYear || '',
            term: item.term || '',
            classId: item.classId || null,
            className: item.className || null,
            recordedBy: item.teacherName || 'Teacher',
            recordedById: item.teacherId || 'system',
            date: item.createdAt || item.assessmentDate || new Date(),
            schoolId: item.schoolId,
            isDerived: true
          });
        }
      });
    }

    // 3. Add derived behavior events from behavioral_records
    if (behaviorData) {
      behaviorData.forEach((item: any) => {
        const hasDuplicate = manualEvents?.some((me: any) => me.metadata?.behaviorId === item.id);
        if (!hasDuplicate) {
          list.push({
            id: `behavior_${item.id}`,
            studentId,
            title: `Behaviour: ${item.incidentType || 'Record'}`,
            description: `${item.description || 'Behavior record logged'}.${item.actionTaken ? ' Action taken: ' + item.actionTaken : ''}`,
            category: 'behavior',
            academicYear: item.academicYear || '',
            term: item.term || '',
            classId: item.classId || null,
            className: item.className || null,
            recordedBy: item.recordedBy || 'Staff',
            recordedById: item.recordedById || 'system',
            date: item.createdAt || new Date(),
            schoolId: item.schoolId,
            isDerived: true
          });
        }
      });
    }

    // 4. Add derived certificates/stickers from junior_stickers
    if (stickersData) {
      stickersData.forEach((item: any) => {
        list.push({
          id: `sticker_${item.id}`,
          studentId,
          title: `Earned Badge: ${item.emoji || '🏆'} ${item.name || 'Achievement Badge'}`,
          description: `${item.description || 'Awarded a new digital sticker badge!'}`,
          category: 'certificate',
          academicYear: item.academicYear || '',
          term: item.term || '',
          classId: item.classId || null,
          className: item.className || null,
          recordedBy: item.teacherName || 'Teacher',
          recordedById: item.teacherId || 'system',
          date: item.earnedAt || new Date(),
          schoolId: item.schoolId,
          isDerived: true
        });
      });
    }

    return list;
  }, [manualEvents, assessmentsData, behaviorData, stickersData, studentId]);

  // Dynamic filter application (including secure role-based restrictions)
  const filteredEvents = useMemo(() => {
    if (!rawEvents) return [];

    return rawEvents
      .filter((ev: any) => {
        // 1. Role-based category enforcement
        if (!allowedCategories.includes(ev.category)) return false;

        // 2. Category selection filter
        if (categoryFilter !== 'all' && ev.category !== categoryFilter) return false;

        // 3. Academic Year selection filter
        if (yearFilter !== 'all' && ev.academicYear !== yearFilter) return false;

        // 4. Term selection filter
        if (termFilter !== 'all' && ev.term !== termFilter) return false;

        // 5. Keyword search filter
        if (searchTerm.trim() !== '') {
          const matchTerm = searchTerm.toLowerCase();
          const matchesTitle = ev.title?.toLowerCase().includes(matchTerm);
          const matchesDesc = ev.description?.toLowerCase().includes(matchTerm);
          return matchesTitle || matchesDesc;
        }

        return true;
      })
      .sort((a, b) => {
        const da = a.date?.toDate ? a.date.toDate().getTime() : new Date(a.date).getTime();
        const db = b.date?.toDate ? b.date.toDate().getTime() : new Date(b.date).getTime();
        return db - da; // Descending order (newest first)
      });
  }, [rawEvents, categoryFilter, yearFilter, termFilter, searchTerm, allowedCategories]);

  // File Upload Helper
  const uploadAttachments = async (eventId: string, files: FileList): Promise<string[]> => {
    if (!schoolId) return [];
    const storage = getStorage();
    const urls: string[] = [];

    setUploadingFiles(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileRef = ref(storage, `schools/${schoolId}/students/${studentId}/timeline/${eventId}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(snapshot.ref);
        urls.push(url);
      }
      return urls;
    } catch (e) {
      console.error('File upload failed:', e);
      toast({ variant: 'destructive', title: 'Upload Failed', description: 'One or more files could not be uploaded.' });
      return [];
    } finally {
      setUploadingFiles(false);
    }
  };

  // Submit Handler
  const handleAddTimelineEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !schoolId || !user || isSubmitting) return;

    if (!title.trim() || !description.trim()) {
      toast({ variant: 'destructive', title: 'Required Fields', description: 'Please complete all required fields.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const eventId = doc(collection(firestore, 'students', studentId, 'timeline')).id;
      
      let attachmentUrls: string[] = [];
      if (selectedFiles && selectedFiles.length > 0) {
        attachmentUrls = await uploadAttachments(eventId, selectedFiles);
      }

      await TimelineService.logEvent(firestore, {
        studentId,
        title,
        description,
        category,
        academicYear,
        term,
        schoolId,
        recordedBy: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user.displayName || 'Staff'),
        recordedById: user.uid,
        attachments: attachmentUrls,
        date: new Date(eventDate)
      });

      toast({ title: 'Milestone Added! ✨', description: 'The student timeline has been updated and parents notified.' });
      setIsAddOpen(false);

      // Reset Form State
      setTitle('');
      setDescription('');
      setSelectedFiles(null);
    } catch (error: any) {
      console.error('Save event failed:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to save timeline event.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEventIcon = (category: TimelineCategory) => {
    const Meta = CATEGORY_META[category] || CATEGORY_META.awards;
    const IconComponent = Meta.icon;
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Primary 2-Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-slate-100 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-inner">
        <div className="flex p-1 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-1">
          <button
            onClick={() => setActiveTab('timeline')}
            className={cn(
              "px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-2",
              activeTab === 'timeline'
                ? "bg-indigo-600 text-white shadow-md font-black scale-[1.02]"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Milestone className="h-4 w-4" />
            <span>📜 Journey Activity Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={cn(
              "px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-2",
              activeTab === 'portfolio'
                ? "bg-indigo-600 text-white shadow-md font-black scale-[1.02]"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <Award className="h-4 w-4" />
            <span>🎓 Certified Portfolio & Badges</span>
          </button>
        </div>

        {activeTab === 'portfolio' && (
          <Button
            onClick={() => setIsShareModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase px-4 py-2.5 rounded-2xl shadow-md gap-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Public Link & QR Code</span>
          </Button>
        )}
      </div>

      {activeTab === 'portfolio' ? (
        /* PORTFOLIO & MICRO-CREDENTIAL SHOWCASE TAB */
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white border border-indigo-500/20 shadow-xl flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                Verified Micro-Credentials
              </span>
              <h2 className="text-xl font-black uppercase italic tracking-tight">Lifetime Digital Portfolio Showcase</h2>
              <p className="text-xs text-slate-300 font-medium">
                Granular skill competencies, verified digital badges, and practical project artifacts.
              </p>
            </div>
            <div className="hidden sm:block p-4 bg-white/5 border border-white/10 rounded-2xl">
              <Award className="h-10 w-10 text-amber-400" />
            </div>
          </div>

          {/* Skill Competency Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['STEM', 'Literacy', 'Arts', 'Sports', 'Leadership', 'Character'].map(skillCat => (
              <Card key={skillCat} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex justify-between items-center text-xs font-extrabold">
                  <span className="uppercase text-slate-700 dark:text-slate-200">{skillCat} Competency</span>
                  <Badge variant="outline" className="text-indigo-600 font-black text-[9px] border-indigo-200">
                    Verified Level
                  </Badge>
                </div>
                <Progress value={75} className="h-2.5 bg-slate-100 dark:bg-slate-800" />
                <p className="text-[10px] font-bold text-slate-400 text-right">Mastery Progress: 75%</p>
              </Card>
            ))}
          </div>

          {/* Micro-Credentials Grid */}
          <Card className="rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 bg-white dark:bg-slate-900">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <CardTitle className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  Earned Digital Badges & Micro-Credentials
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 font-medium mt-0.5">
                  Verified achievements minted from quizzes, Class Stories, and faculty endorsements.
                </CardDescription>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BADGE_CATALOG.slice(0, 6).map(badge => (
                <div key={badge.id} className="p-4 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 rounded-2xl text-indigo-600 shrink-0">
                    <Award className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{badge.title}</h4>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{badge.description}</p>
                    <span className="inline-block text-[9px] font-black uppercase text-amber-600 tracking-wider pt-1">
                      +{badge.xpAward} XP Awarded
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        /* JOURNEY ACTIVITY FEED TAB */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Search and Filters Deck */}
          <div className="bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search timeline by title or keywords..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {canAddEvent && (
                  <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-10 shadow-md">
                    <Plus className="h-4.5 w-4.5 mr-2" /> Log Milestone
                  </Button>
                )}
              </div>
            </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100/50 dark:border-slate-850">
          <div className="space-y-1">
            <Label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Milestone Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-white rounded-xl h-10 border-slate-200 dark:border-slate-800"><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Categories</SelectItem>
                {allowedCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{CATEGORY_META[cat as TimelineCategory]?.label || cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Academic Year</Label>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="bg-white rounded-xl h-10 border-slate-200 dark:border-slate-800"><SelectValue placeholder="All Years" /></SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Years</SelectItem>
                {MOCK_ACADEMIC_YEARS.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] font-black uppercase tracking-wider text-slate-400">School Term</Label>
            <Select value={termFilter} onValueChange={setTermFilter}>
              <SelectTrigger className="bg-white rounded-xl h-10 border-slate-200 dark:border-slate-800"><SelectValue placeholder="All Terms" /></SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Terms</SelectItem>
                {MOCK_TERMS.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Vertical Chronological Timeline */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-650" />
          <p className="text-xs uppercase font-bold tracking-wider animate-pulse">Assembling Portfolio timeline...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="py-20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl text-center bg-white flex flex-col items-center gap-3.5">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full text-slate-350">
            <Milestone size={32} />
          </div>
          <div>
            <p className="font-extrabold text-slate-800 dark:text-slate-200">No Milestones Logged</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">Milestone records will automatically populate when academic records, promotions, or behavior reports are generated.</p>
          </div>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200/80 dark:border-slate-800 space-y-8 ml-4 mr-1 py-2">
          {filteredEvents.map((ev, index) => {
            const Meta = CATEGORY_META[ev.category as TimelineCategory] || CATEGORY_META.awards;
            const displayDate = ev.date?.toDate ? ev.date.toDate() : new Date(ev.date);
            const isImage = (url: string) => /\.(jpeg|jpg|gif|png|webp)/i.test(url);

            return (
              <div key={ev.id} className="relative group animate-in fade-in slide-in-from-left-4 duration-300">
                {/* Timeline Node Point */}
                <div className={cn(
                  "absolute -left-[37px] sm:-left-[45px] top-1.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 shadow-md group-hover:scale-110 transition-transform duration-200",
                  Meta.bg, Meta.color
                )}>
                  {getEventIcon(ev.category)}
                </div>

                {/* Event Card */}
                <Card className={cn(
                  "border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group-hover:border-slate-350 dark:group-hover:border-slate-700 bg-white",
                  Meta.border
                )}>
                  <div className="bg-slate-50/50 dark:bg-slate-900/10 px-5 py-3 border-b border-slate-100/50 dark:border-slate-850 flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={cn("font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md", Meta.bg, Meta.color, Meta.border)}>
                        {Meta.label}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {ev.academicYear} {ev.term ? `• ${ev.term}` : ''}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {format(displayDate, 'PPP')}
                    </span>
                  </div>

                  <CardContent className="p-5 space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-900 dark:text-slate-150 text-base sm:text-lg tracking-tight">
                        {ev.title}
                      </h4>
                      <p className="text-sm text-slate-650 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                        {ev.description}
                      </p>
                    </div>

                    {/* Attachments & Previews */}
                    {ev.attachments && ev.attachments.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Attachments</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {ev.attachments.map((url: string, fileIdx: number) => (
                            <div key={fileIdx} className="group/file relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 p-2 text-center overflow-hidden hover:border-slate-350 transition-colors">
                              {isImage(url) ? (
                                <div className="h-24 w-full rounded-lg overflow-hidden bg-white mb-2 relative">
                                  <img src={url} alt="Attachment" className="h-full w-full object-cover" />
                                  <a href={url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/file:opacity-100 flex items-center justify-center text-white transition-opacity">
                                    <Download size={18} />
                                  </a>
                                </div>
                              ) : (
                                <div className="h-24 w-full rounded-lg bg-white border border-dashed flex flex-col items-center justify-center gap-1.5 text-slate-400 mb-2 relative">
                                  <FileText size={24} className="text-slate-400" />
                                  <span className="text-[10px] font-bold max-w-[80px] truncate text-slate-500">File Attachment</span>
                                  <a href={url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/file:opacity-100 flex items-center justify-center text-white transition-opacity rounded-lg">
                                    <Download size={18} />
                                  </a>
                                </div>
                              )}
                              <a href={url} download target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-wider">
                                Download <Download size={10} />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata Footer */}
                    <div className="flex items-center justify-between border-t border-slate-100/50 dark:border-slate-850 pt-3 mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Logged By: {ev.recordedBy}</span>
                      {ev.className && <span>Class: {ev.className}</span>}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )}

      {/* MANUALLY LOG NEW EVENT DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
              <Plus className="text-emerald-600" /> Log Journey Milestone
            </DialogTitle>
            <DialogDescription>Create a custom timeline event for this student.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTimelineEvent} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Milestone Title *</Label>
              <Input 
                placeholder="e.g. Winner of National Math Olympiad" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required
                className="bg-white border border-slate-200 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700">Event Description *</Label>
              <Input 
                placeholder="Details, scores, remarks, or observations..." 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                required
                className="bg-white border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Milestone Category *</Label>
                <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                  <SelectTrigger className="bg-white border border-slate-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {allowedCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{CATEGORY_META[cat as TimelineCategory]?.label || cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Event Date *</Label>
                <Input 
                  type="date" 
                  value={eventDate} 
                  onChange={e => setEventDate(e.target.value)} 
                  required
                  className="bg-white border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Academic Year</Label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger className="bg-white border border-slate-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {MOCK_ACADEMIC_YEARS.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Term</Label>
                <Select value={term} onValueChange={setTerm}>
                  <SelectTrigger className="bg-white border border-slate-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {MOCK_TERMS.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                Upload Attachments <span className="text-[10px] text-slate-400 font-medium">(Optional)</span>
              </Label>
              <div className="border-2 border-dashed border-slate-200 hover:border-slate-350 rounded-2xl p-4 bg-slate-50/50 text-center relative cursor-pointer">
                <Input 
                  type="file" 
                  multiple 
                  onChange={e => setSelectedFiles(e.target.files)} 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center gap-1.5 text-slate-400">
                  <Image size={24} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">Select Files (Images or PDF)</span>
                  {selectedFiles && selectedFiles.length > 0 ? (
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 rounded px-2 py-0.5">
                      {selectedFiles.length} file(s) selected
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-450 uppercase tracking-wide">Drop or Browse</span>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t mt-4">
              <Button type="button" variant="outline" className="rounded-xl border border-slate-200 text-slate-600 font-bold" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting || uploadingFiles} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md">
                {isSubmitting || uploadingFiles ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                Log Milestone
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Public Share & QR Code Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="max-w-md p-6 bg-white rounded-3xl space-y-4 text-center">
          <DialogHeader>
            <DialogTitle className="text-base font-black uppercase tracking-tight text-slate-900 flex items-center justify-center gap-2">
              <Share2 className="h-5 w-5 text-indigo-600" /> Share Student Digital Portfolio
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <p className="text-xs text-slate-600 font-medium">
              Anyone with this verified public link can view certified micro-credentials, skill badges, and project artifacts.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center gap-3">
              <QrCode className="h-28 w-28 text-indigo-600" />
              <p className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                Official Verification QR Code
              </p>
            </div>

            <div className="p-3 bg-slate-100 rounded-xl font-mono text-[11px] text-slate-700 truncate border border-slate-200">
              {typeof window !== 'undefined' ? `${window.location.origin}/p/${studentId}` : `/p/${studentId}`}
            </div>

            <Button
              onClick={() => {
                const url = `${window.location.origin}/p/${studentId}`;
                navigator.clipboard.writeText(url);
                toast({ title: 'Portfolio link copied to clipboard! 📋' });
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase rounded-xl h-11"
            >
              Copy Public Verification Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
