'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  Play, Pause, Headphones, HelpCircle, Volume2, 
  Search, Compass, PenLine, ClipboardList, FileText, 
  Video, Sparkles, BookOpenCheck, ChevronRight, CheckCircle2,
  Clock, ArrowLeft, RotateCcw, Bookmark, Star, BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Live Dynamic Subject Resolver from courseId
const getSubjectName = (courseId: string) => {
  if (!courseId) return "General";
  const id = courseId.toLowerCase();
  if (id.includes("science")) return "Integrated Science";
  if (id.includes("math")) return "Mathematics";
  if (id.includes("english")) return "English Language";
  if (id.includes("social")) return "Social Studies";
  if (id.includes("ict") || id.includes("computing")) return "Information Technology";
  // Fallback: capitalize words after stripping prefix (e.g. "bs7-")
  const clean = id.replace(/^[a-z0-9]+-/, "");
  return clean.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

export default function StudentLearningResourcesView({ studentClass, dbMaterials = [] }: { studentClass: string; dbMaterials?: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("All Subjects");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});

  // Audio player state
  const [activeAudio, setActiveAudio] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [audioVolume, setAudioVolume] = useState<number>(85);

  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [quizQuestionIdx, setQuizQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // Note Reader State
  const [activeNote, setActiveNote] = useState<any>(null);
  const [readerTheme, setReaderTheme] = useState<'paper' | 'white' | 'dark'>('paper');
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [readerFontFamily, setReaderFontFamily] = useState<'serif' | 'sans'>('serif');

  // Video embed state
  const [activeVideo, setActiveVideo] = useState<any>(null);

  // Simulated player tick
  useEffect(() => {
    let interval: any;
    if (isPlaying && activeAudio) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const parts = activeAudio.durationOrSize.split(':');
          const maxSec = parts.length === 2 ? parseInt(parts[0]) * 60 + parseInt(parts[1]) : 180;
          if (prev >= maxSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeAudio]);

  const formatAudioTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Compile resources from live dbMaterials
  const combinedResources = useMemo(() => {
    const cleanString = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const classKey = studentClass ? cleanString(studentClass) : '';
    const list: any[] = [];

    (dbMaterials || []).forEach((mat) => {
      // Filter by student class if possible (if courseId starts with classKey)
      const courseId = mat.courseId || '';
      const cleanCourseId = cleanString(courseId);
      if (classKey && cleanCourseId && !cleanCourseId.startsWith(classKey)) {
        return; // skip materials not matching student's class level
      }

      const subject = getSubjectName(mat.courseId);

      // 1. Notes -> Lesson Notes
      if (mat.content && mat.content.trim()) {
        list.push({
          id: `db-note-${mat.id}`,
          category: "Lesson Notes",
          title: mat.topicTitle,
          subjectName: subject,
          type: "Notes",
          description: `Strand: ${mat.strand || 'General'} - ${mat.subStrand || ''}`,
          durationOrSize: "12 min read",
          content: mat.content
        });
      }

      // 2. Videos -> Educational Videos
      if (mat.videoLinks && Array.isArray(mat.videoLinks)) {
        mat.videoLinks.forEach((vid: any, idx: number) => {
          list.push({
            id: `db-vid-${mat.id}-${idx}`,
            category: "Educational Videos",
            title: vid.title || mat.topicTitle,
            subjectName: subject,
            type: "Video",
            description: `YouTube course video linked under ${mat.topicTitle}.`,
            durationOrSize: "Online Video",
            url: vid.url
          });
        });
      }

      // 3. Attachments -> Auto-sorted categories
      if (mat.attachments && Array.isArray(mat.attachments)) {
        mat.attachments.forEach((att: any, idx: number) => {
          const name = att.name.toLowerCase();
          const category = att.category || "";
          
          if (category === "Audio Lesson" || name.includes('audio') || name.endsWith('.mp3') || name.endsWith('.wav') || name.endsWith('.m4a')) {
            // Audio Lesson
            list.push({
              id: `db-aud-${mat.id}-${idx}`,
              category: "Audio Lessons",
              title: att.name,
              subjectName: subject,
              type: "Audio Lesson",
              description: `Podcast/audio lesson for topic: ${mat.topicTitle}`,
              durationOrSize: "Audio",
              audioUrl: att.url
            });
          } else if (category === "Worksheet" || name.includes('worksheet') || name.includes('ws') || name.includes('practice') || name.includes('exercise')) {
            // Worksheet
            list.push({
              id: `db-ws-${mat.id}-${idx}`,
              category: "Worksheets",
              title: att.name,
              subjectName: subject,
              type: "Worksheet",
              description: `Practice exercise sheet for ${mat.topicTitle}`,
              durationOrSize: "Downloadable",
              url: att.url
            });
          } else if (category === "Revision Guide" || name.includes('guide') || name.includes('revision') || name.includes('summary') || name.includes('roadmap')) {
            // Revision Guide
            list.push({
              id: `db-rev-${mat.id}-${idx}`,
              category: "Revision Guides",
              title: att.name,
              subjectName: subject,
              type: "Revision Guide",
              description: `Exam roadmap summary sheet for: ${mat.topicTitle}`,
              durationOrSize: "Revision Guide",
              url: att.url
            });
          } else if (category === "Interactive Material" || name.includes('sim') || name.includes('sandbox') || name.includes('interactive') || name.includes('game')) {
            // Interactive Material
            list.push({
              id: `db-int-${mat.id}-${idx}`,
              category: "Interactive Learning Materials",
              title: att.name,
              subjectName: subject,
              type: "Interactive Tool",
              description: `Interactive sandbox tool for: ${mat.topicTitle}`,
              durationOrSize: "Launch Sim",
              url: att.url
            });
          } else {
            // Fallback: PDF Documents or Worksheets based on extension or category tag
            const isPdf = category === "PDF Document" || name.endsWith('.pdf') || (att.type && att.type.toUpperCase() === 'PDF');
            list.push({
              id: isPdf ? `db-pdf-${mat.id}-${idx}` : `db-ws-${mat.id}-${idx}`,
              category: isPdf ? "PDF Documents" : "Worksheets",
              title: att.name,
              subjectName: subject,
              type: isPdf ? "PDF Document" : "Study Document",
              description: `Material file attachment for: ${mat.topicTitle}`,
              durationOrSize: "Download",
              url: att.url
            });
          }
        });
      }

      // 4. Questions -> Past Questions
      if (mat.practiceQuestions && Array.isArray(mat.practiceQuestions) && mat.practiceQuestions.length > 0) {
        list.push({
          id: `db-quiz-${mat.id}`,
          category: "Past Questions",
          title: `Practice Quiz: ${mat.topicTitle}`,
          subjectName: subject,
          type: "Mock Quiz",
          description: `Revision exercises for ${mat.topicTitle}.`,
          durationOrSize: `${mat.practiceQuestions.length} Questions`,
          questions: mat.practiceQuestions
        });
      }
    });

    return list;
  }, [dbMaterials, studentClass]);

  // Subject list
  const subjectsList = useMemo(() => {
    const set = new Set<string>();
    combinedResources.forEach(r => set.add(r.subjectName));
    return ["All Subjects", ...Array.from(set)];
  }, [combinedResources]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "Lesson Notes": 0,
      "Worksheets": 0,
      "PDF Documents": 0,
      "Educational Videos": 0,
      "Audio Lessons": 0,
      "Interactive Learning Materials": 0,
      "Past Questions": 0,
      "Revision Guides": 0
    };
    combinedResources.forEach(r => {
      if (counts[r.category] !== undefined) {
        counts[r.category]++;
      }
    });
    return counts;
  }, [combinedResources]);

  // Category details
  const categoriesList = [
    { name: "Lesson Notes", icon: PenLine, color: "from-blue-500 to-indigo-500", bg: "bg-blue-50/40 border-blue-100", textColor: "text-blue-700" },
    { name: "Worksheets", icon: ClipboardList, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50/40 border-emerald-100", textColor: "text-emerald-700" },
    { name: "PDF Documents", icon: FileText, color: "from-rose-500 to-pink-500", bg: "bg-rose-50/40 border-rose-100", textColor: "text-rose-700" },
    { name: "Educational Videos", icon: Video, color: "from-purple-500 to-indigo-500", bg: "bg-purple-50/40 border-purple-100", textColor: "text-purple-700" },
    { name: "Audio Lessons", icon: Headphones, color: "from-cyan-500 to-sky-500", bg: "bg-cyan-50/40 border-cyan-100", textColor: "text-cyan-700" },
    { name: "Interactive Learning Materials", icon: Sparkles, color: "from-amber-500 to-orange-500", bg: "bg-amber-50/40 border-amber-100", textColor: "text-amber-700" },
    { name: "Past Questions", icon: HelpCircle, color: "from-violet-500 to-fuchsia-500", bg: "bg-violet-50/40 border-violet-100", textColor: "text-violet-700" },
    { name: "Revision Guides", icon: BookOpenCheck, color: "from-teal-500 to-emerald-500", bg: "bg-teal-50/40 border-teal-100", textColor: "text-teal-700" }
  ];

  // Filtering
  const filteredResources = useMemo(() => {
    if (!selectedCategory) return [];
    return combinedResources.filter(r => {
      const matchCat = r.category === selectedCategory;
      const matchSubj = selectedSubject === "All Subjects" || r.subjectName === selectedSubject;
      const matchQuery = !searchQuery || 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSubj && matchQuery;
    });
  }, [combinedResources, selectedCategory, selectedSubject, searchQuery]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleLike = (id: string) => {
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const cleanUrl = url.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
      return `https://www.youtube.com/embed/${cleanUrl}`;
    }
    const m = cleanUrl.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/);
    if (m && m[2].length === 11) {
      return `https://www.youtube.com/embed/${m[2]}`;
    }
    return null;
  };

  const handleStartQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setQuizQuestionIdx(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizSubmitted(false);
    setQuizFinished(false);
  };

  const handleSelectOption = (opt: string) => {
    if (quizSubmitted) return;
    setSelectedOption(opt);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || quizSubmitted) return;
    
    const currentQ = activeQuiz.questions[quizQuestionIdx];
    const isCorrect = selectedOption.trim() === currentQ.correctAnswer.trim();
    if (isCorrect) {
      setQuizScore((prev: number) => prev + 1);
    }
    setQuizSubmitted(true);
  };

  const handleNextQuestion = () => {
    const nextIdx = quizQuestionIdx + 1;
    if (nextIdx < activeQuiz.questions.length) {
      setQuizQuestionIdx(nextIdx);
      setSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Selection View */}
      {!selectedCategory ? (
        <>
          {/* Header Card */}
          <Card className="rounded-[2.2rem] border border-slate-100 shadow-md bg-white overflow-hidden animate-in fade-in duration-300">
            <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex flex-row items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl text-indigo-650 animate-pulse">
                <Compass className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight italic">Student Learning Resources Hub</CardTitle>
                <CardDescription className="text-slate-400">Access curriculum lesson notes, video libraries, past questions, and revision guides.</CardDescription>
              </div>
            </CardHeader>
          </Card>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {categoriesList.map((cat, idx) => {
              const CatIcon = cat.icon;
              const count = categoryCounts[cat.name] || 0;
              return (
                <div 
                  key={idx}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setSelectedSubject("All Subjects");
                    setSearchQuery("");
                  }}
                  className="group cursor-pointer p-6 rounded-[2rem] border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between h-44"
                >
                  <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl opacity-[0.03] group-hover:opacity-[0.06] transition-opacity rounded-full -mr-6 -mt-6" />
                  <div className={cn("p-3 rounded-2xl w-max bg-gradient-to-br text-white shadow-sm", cat.color)}>
                    <CatIcon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 mt-4">
                    <h3 className="font-extrabold text-slate-805 text-sm tracking-tight leading-tight group-hover:text-indigo-655 transition-colors">{cat.name}</h3>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {count} {count === 1 ? 'material' : 'materials'} available
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        // Category Detail View
        <div className="space-y-6">
          {/* Top navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCategory(null);
                setActiveAudio(null);
                setActiveQuiz(null);
                setActiveNote(null);
                setActiveVideo(null);
              }}
              className="rounded-xl font-black text-xs uppercase text-slate-700 bg-white shadow-sm border-slate-200 w-max"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Hub
            </Button>
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Compass className="h-5 w-5 text-indigo-650" /> {selectedCategory}
            </h2>
          </div>

          {/* Inline Media Players & Reader Panes */}
          {activeNote && (
            <Card className="rounded-[2.2rem] border border-slate-100 shadow-md bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-250">
              <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex flex-row items-center justify-between flex-wrap gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-indigo-650 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
                    {activeNote.subjectName}
                  </span>
                  <CardTitle className="text-md font-extrabold text-slate-850">{activeNote.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Font Style */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setReaderFontFamily(prev => prev === 'serif' ? 'sans' : 'serif')}
                    className="h-8 text-xs font-bold rounded-lg border border-slate-150"
                  >
                    {readerFontFamily === 'serif' ? 'Sans-serif' : 'Serif'}
                  </Button>
                  {/* Font Size decrease */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      if (readerFontSize === 'xl') setReaderFontSize('lg');
                      else if (readerFontSize === 'lg') setReaderFontSize('base');
                      else if (readerFontSize === 'base') setReaderFontSize('sm');
                    }}
                    className="h-8 w-8 text-xs font-bold rounded-lg border border-slate-150 p-0"
                  >
                    A-
                  </Button>
                  {/* Font Size increase */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      if (readerFontSize === 'sm') setReaderFontSize('base');
                      else if (readerFontSize === 'base') setReaderFontSize('lg');
                      else if (readerFontSize === 'lg') setReaderFontSize('xl');
                    }}
                    className="h-8 w-8 text-xs font-bold rounded-lg border border-slate-150 p-0"
                  >
                    A+
                  </Button>
                  {/* Theme Switcher */}
                  <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                    {['paper', 'white', 'dark'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setReaderTheme(t as any)}
                        className={cn(
                          "h-6 px-2.5 text-[10px] font-bold rounded-md uppercase",
                          readerTheme === t ? "bg-white text-indigo-700 shadow-xs" : "text-slate-500"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className={cn(
                "p-8 prose prose-indigo max-w-none transition-all duration-300",
                readerTheme === 'paper' ? 'bg-amber-50/10 text-slate-805 font-serif' :
                readerTheme === 'white' ? 'bg-white text-slate-850 font-sans' : 'bg-slate-900 text-slate-100 font-sans',
                readerFontSize === 'sm' ? 'text-xs leading-relaxed' :
                readerFontSize === 'base' ? 'text-sm leading-relaxed' :
                readerFontSize === 'lg' ? 'text-base leading-relaxed' : 'text-lg leading-relaxed'
              )}>
                <div 
                  className={cn(readerFontFamily === 'serif' ? 'font-serif' : 'font-sans')} 
                  dangerouslySetInnerHTML={{ __html: activeNote.content }} 
                />
                <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setActiveNote(null)} className="text-xs font-black uppercase text-slate-500">Close Reader</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeVideo && (
            <Card className="rounded-[2.2rem] border border-slate-100 shadow-md bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-250">
              <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-md">
                    {activeVideo.subjectName} • Video Lesson
                  </span>
                  <CardTitle className="text-md font-extrabold text-slate-855">{activeVideo.title}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveVideo(null)} className="text-xs font-black uppercase text-slate-500">Close Player</Button>
              </CardHeader>
              <CardContent className="p-6 bg-slate-950 flex justify-center">
                {getEmbedUrl(activeVideo.url) ? (
                  <iframe 
                    src={getEmbedUrl(activeVideo.url) || ''} 
                    className="w-full aspect-video rounded-2xl max-w-3xl border border-white/5" 
                    allowFullScreen 
                    title={activeVideo.title}
                  />
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-400 italic">
                    <Video className="h-10 w-10 text-slate-500 mb-2 stroke-[1.2]" />
                    <p className="text-xs uppercase font-black tracking-wider">Invalid video link format</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeAudio && (
            <Card className="rounded-[2.2rem] border border-slate-100 shadow-md bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-250">
              <CardContent className="p-6 md:p-8 bg-gradient-to-r from-slate-900 to-indigo-950 text-white relative">
                <div className="absolute top-4 right-4">
                  <Button variant="ghost" onClick={() => { setActiveAudio(null); setIsPlaying(false); }} className="text-white/60 hover:text-white text-xs font-black uppercase">
                    Close Player
                  </Button>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Vinyl Icon */}
                  <div className={cn(
                    "h-20 w-20 rounded-full bg-slate-800 border-4 border-slate-700/50 shadow-lg flex items-center justify-center shrink-0 relative overflow-hidden",
                    isPlaying ? "animate-spin" : ""
                  )}>
                    <div className="h-6 w-6 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                      <Headphones className="h-3 w-3 text-indigo-400" />
                    </div>
                  </div>

                  {/* Player controls */}
                  <div className="flex-1 space-y-3 min-w-0 w-full">
                    <div>
                      <span className="text-[9px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                        {activeAudio.subjectName} • Audio Lesson
                      </span>
                      <h4 className="font-extrabold text-white text-sm truncate mt-1">{activeAudio.title}</h4>
                    </div>

                    {/* Progress Slider */}
                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span>{formatAudioTime(currentTime)}</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative cursor-pointer">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all" 
                          style={{ width: `${(currentTime / (parseInt(activeAudio.durationOrSize.split(':')[0]) * 60 + parseInt(activeAudio.durationOrSize.split(':')[1]))) * 100}%` }}
                        />
                      </div>
                      <span>{activeAudio.durationOrSize}</span>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center gap-4 pt-1">
                      <Button 
                        size="icon" 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="h-10 w-10 rounded-full bg-white text-slate-900 hover:bg-slate-100 shadow-md shrink-0"
                      >
                        {isPlaying ? <Pause className="h-4 w-4 text-slate-900" /> : <Play className="h-4 w-4 fill-slate-900 text-slate-900" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setCurrentTime(0)}
                        className="text-white/60 hover:text-white"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      
                      {/* Volume Slider */}
                      <div className="flex items-center gap-2 text-white/60 ml-auto max-w-32">
                        <Volume2 className="h-4 w-4 shrink-0" />
                        <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{ width: `${audioVolume}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeQuiz && (
            <Card className="rounded-[2.2rem] border border-slate-100 shadow-md bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-250">
              <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-indigo-650 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">
                    {activeQuiz.subjectName} • Live Revision Quiz
                  </span>
                  <CardTitle className="text-md font-extrabold text-slate-855">{activeQuiz.title}</CardTitle>
                </div>
                <Button variant="ghost" onClick={() => setActiveQuiz(null)} className="text-xs font-black uppercase text-slate-500">
                  Cancel Quiz
                </Button>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                {!quizFinished ? (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span>Question {quizQuestionIdx + 1} of {activeQuiz.questions.length}</span>
                      <span>Score: {quizScore} / {activeQuiz.questions.length}</span>
                    </div>

                    {/* Question text */}
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="font-extrabold text-slate-800 text-sm leading-relaxed">
                        {activeQuiz.questions[quizQuestionIdx].question}
                      </p>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 gap-3">
                      {activeQuiz.questions[quizQuestionIdx].options.map((opt: string, oIdx: number) => {
                        const isSelected = selectedOption === opt;
                        const isCorrectOpt = opt.trim() === activeQuiz.questions[quizQuestionIdx].correctAnswer.trim();
                        
                        let optStyle = "border-slate-200 bg-white hover:border-indigo-400";
                        if (quizSubmitted) {
                          if (isCorrectOpt) {
                            optStyle = "border-emerald-500 bg-emerald-50 text-emerald-800";
                          } else if (isSelected) {
                            optStyle = "border-rose-500 bg-rose-50 text-rose-800";
                          } else {
                            optStyle = "border-slate-100 bg-slate-50/50 opacity-60";
                          }
                        } else if (isSelected) {
                          optStyle = "border-indigo-500 bg-indigo-50/20 text-indigo-700";
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleSelectOption(opt)}
                            className={cn(
                              "p-4 border-2 text-left rounded-2xl text-xs font-semibold transition-all flex items-center justify-between",
                              optStyle
                            )}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrectOpt && (
                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-md uppercase">Correct</span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Actions footer */}
                    <div className="flex justify-end gap-3 pt-3 border-t">
                      {!quizSubmitted ? (
                        <Button 
                          onClick={handleSubmitAnswer} 
                          disabled={selectedOption === null}
                          className="rounded-xl text-xs font-black uppercase bg-indigo-650 hover:bg-indigo-755 text-white"
                        >
                          Submit Answer
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleNextQuestion}
                          className="rounded-xl text-xs font-black uppercase bg-indigo-650 hover:bg-indigo-755 text-white"
                        >
                          {quizQuestionIdx + 1 === activeQuiz.questions.length ? 'Finish Quiz' : 'Next Question'}
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  // Quiz Results summary
                  <div className="text-center py-8 space-y-4">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto stroke-[1.2]" />
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 text-lg">Quiz Completed!</h4>
                      <p className="text-xs text-slate-550">You successfully finished the practice questionnaire.</p>
                    </div>
                    <div className="inline-block p-4 bg-slate-50 border border-slate-100 rounded-3xl">
                      <span className="text-2xl font-black text-slate-800">{quizScore} / {activeQuiz.questions.length}</span>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase mt-0.5">Final Score ({Math.round((quizScore / activeQuiz.questions.length) * 100)}%)</span>
                    </div>
                    <div className="flex justify-center gap-3 pt-4">
                      <Button onClick={() => handleStartQuiz(activeQuiz)} className="rounded-xl text-xs font-black uppercase bg-slate-150 hover:bg-slate-200 text-slate-700">
                        Retake Quiz
                      </Button>
                      <Button onClick={() => setActiveQuiz(null)} className="rounded-xl text-xs font-black uppercase bg-indigo-650 hover:bg-indigo-755 text-white">
                        Exit Quiz
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Filters card */}
          <Card className="rounded-[2.2rem] border border-slate-100 shadow-md bg-white overflow-hidden">
            <CardContent className="p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Scrollable Subject Filter Chips */}
              <div className="flex gap-2 w-full overflow-x-auto pb-2 md:pb-0 scrollbar-none flex-wrap">
                {subjectsList.map((subject, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSubject(subject)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-black rounded-lg uppercase tracking-wider transition-all duration-300 border",
                      selectedSubject === subject 
                        ? "bg-slate-900 text-white border-slate-900 animate-in zoom-in-95 duration-150" 
                        : "bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100"
                    )}
                  >
                    {subject}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:max-w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="text" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search resources..." 
                  className="pl-9 pr-4 h-9 rounded-xl border-slate-200 text-xs font-semibold"
                />
              </div>
            </CardContent>
          </Card>

          {/* Resources List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.length > 0 ? (
              filteredResources.map((res, idx) => {
                const isBookmarked = bookmarkedIds.includes(res.id);
                const likeCount = likes[res.id] || 0;
                
                return (
                  <Card key={res.id || idx} className="rounded-[2rem] border border-slate-100 shadow-xs bg-white overflow-hidden flex flex-col justify-between hover:shadow-sm transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <CardHeader className="p-5 border-b border-slate-50/50 bg-slate-50/5 flex flex-row items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-indigo-50 hover:bg-indigo-50 text-indigo-755 font-black text-[9px] uppercase px-2 py-0.5 rounded-lg border-0">
                            {res.subjectName}
                          </Badge>
                          <span className="text-[9px] text-slate-400 font-extrabold uppercase">{res.type}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-800 text-sm leading-snug">{res.title}</h4>
                        {res.description && <p className="text-[11px] text-slate-550 leading-relaxed">{res.description}</p>}
                      </div>
                      
                      {/* Bookmark button */}
                      <button 
                        onClick={() => toggleBookmark(res.id)}
                        className={cn("p-1.5 rounded-lg border transition-colors", isBookmarked ? "bg-amber-50 text-amber-500 border-amber-200" : "text-slate-400 border-slate-100 hover:bg-slate-50")}
                      >
                        <Bookmark className={cn("h-4 w-4", isBookmarked ? "fill-amber-500" : "")} />
                      </button>
                    </CardHeader>
                    
                    <CardContent className="p-5 bg-slate-50/20 flex items-center justify-between gap-4">
                      {/* Micro-interaction Upvote/Like */}
                      <button 
                        onClick={() => handleLike(res.id)}
                        className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-500 hover:text-rose-500 bg-white border border-slate-100 px-2.5 py-1 rounded-lg transition-colors shadow-xs"
                      >
                        <Star className="h-3.5 w-3.5 fill-current" /> Upvote ({likeCount})
                      </button>

                      <span className="text-[10px] text-slate-400 font-bold font-mono">{res.durationOrSize}</span>

                      {/* Action buttons */}
                      {res.category === "Lesson Notes" && (
                        <Button 
                          onClick={() => { setActiveNote(res); setActiveAudio(null); setActiveVideo(null); setActiveQuiz(null); }}
                          className="rounded-xl text-xs font-black uppercase bg-indigo-650 hover:bg-indigo-755 text-white"
                        >
                          Read Note
                        </Button>
                      )}
                      
                      {res.category === "Educational Videos" && (
                        <Button 
                          onClick={() => { setActiveVideo(res); setActiveAudio(null); setActiveNote(null); setActiveQuiz(null); }}
                          className="rounded-xl text-xs font-black uppercase bg-indigo-650 hover:bg-indigo-755 text-white"
                        >
                          Play Video
                        </Button>
                      )}

                      {res.category === "Audio Lessons" && (
                        <Button 
                          onClick={() => { setActiveAudio(res); setIsPlaying(true); setActiveNote(null); setActiveVideo(null); setActiveQuiz(null); }}
                          className="rounded-xl text-xs font-black uppercase bg-indigo-650 hover:bg-indigo-755 text-white animate-pulse"
                        >
                          Listen Now
                        </Button>
                      )}

                      {res.category === "Past Questions" && (
                        <Button 
                          onClick={() => { handleStartQuiz(res); setActiveAudio(null); setActiveNote(null); setActiveVideo(null); }}
                          className="rounded-xl text-xs font-black uppercase bg-indigo-650 hover:bg-indigo-755 text-white"
                        >
                          Start Quiz
                        </Button>
                      )}

                      {res.category !== "Lesson Notes" && res.category !== "Educational Videos" && res.category !== "Audio Lessons" && res.category !== "Past Questions" && (
                        <Button asChild className="rounded-xl text-xs font-black uppercase bg-indigo-650 hover:bg-indigo-755 text-white">
                          <a href={res.url || "#"} target="_blank" rel="noopener noreferrer">
                            {res.category === "Interactive Learning Materials" ? 'Launch Sim' : 'View Document'}
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl">
                <Compass className="h-10 w-10 text-slate-300 mx-auto mb-2.5 stroke-[1.2]" />
                <p className="text-xs font-black uppercase text-slate-400">No resources found matching filters</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
