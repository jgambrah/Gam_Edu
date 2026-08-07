'use client';

import { use, useMemo } from 'react';
import { useFirestore, useDocument, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Award, ShieldCheck, Sparkles, CheckCircle2, GraduationCap, Star, BookOpen, Briefcase, Trophy, QrCode, ExternalLink, Loader2 } from 'lucide-react';
import { BADGE_CATALOG, calculateStudentLevel } from '@/lib/achievement-utils';
import { format } from 'date-fns';

export default function PublicStudentPortfolioPage({ params }: { params: Promise<{ studentId: string }> }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.studentId;
  const firestore = useFirestore();

  // Fetch student profile document
  const studentDocRef = useMemoFirebase(
    () => (firestore && studentId ? doc(firestore, 'students', studentId) : null),
    [firestore, studentId]
  );
  const { data: student, isLoading: isStudentLoading } = useDocument<any>(studentDocRef);

  // Fetch timeline events for micro-credentials and portfolio artifacts
  const timelineQuery = useMemoFirebase(
    () => (firestore && studentId ? query(collection(firestore, 'students', studentId, 'timeline')) : null),
    [firestore, studentId]
  );
  const { data: timelineEvents, isLoading: isTimelineLoading } = useCollection<any>(timelineQuery);

  const studentName = useMemo(() => {
    if (!student) return 'Student';
    return `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.displayName || 'Student Profile';
  }, [student]);

  const earnedBadges = useMemo(() => {
    if (!student || !student.earnedBadges) return [];
    return student.earnedBadges;
  }, [student]);

  const levelInfo = useMemo(() => {
    return calculateStudentLevel(student?.xp || 0, student?.gradeLevel || 'Grade 4');
  }, [student?.xp, student?.gradeLevel]);

  // Skill progress breakdown
  const skills = useMemo(() => {
    const categories = ['STEM', 'Literacy', 'Arts', 'Sports', 'Leadership', 'Character'] as const;
    return categories.map(cat => {
      const matchingEvents = (timelineEvents || []).filter(e => e.metadata?.skillCategory === cat || e.category === 'project');
      const badgeCount = matchingEvents.length;
      const score = Math.min(100, badgeCount * 25 + 20);
      return { category: cat, score, totalBadges: badgeCount };
    });
  }, [timelineEvents]);

  if (isStudentLoading || isTimelineLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Verified Digital Portfolio...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white space-y-4 text-center">
        <ShieldCheck className="h-16 w-16 text-rose-500 opacity-60" />
        <h1 className="text-xl font-black uppercase tracking-tight">Portfolio Record Not Found</h1>
        <p className="text-xs text-slate-400 max-w-md">The requested student portfolio link may be private or incorrect.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border-b border-white/10 p-6 xl:p-12 relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <Avatar className="h-28 w-28 border-4 border-indigo-400/40 shadow-2xl bg-indigo-900">
              <AvatarImage src={student.photoURL} alt={studentName} />
              <AvatarFallback className="bg-indigo-600 text-white font-black text-2xl">
                {student.firstName?.[0]}{student.lastName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> Official Verified Portfolio
                </Badge>
                <Badge variant="outline" className="text-indigo-300 border-indigo-400/30 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                  {student.gradeLevel || 'Student'}
                </Badge>
              </div>

              <h1 className="text-3xl xl:text-4xl font-black tracking-tight uppercase italic text-white">{studentName}</h1>
              <p className="text-xs text-slate-300 font-medium">
                GAM Edu Certified Student Record • Level {levelInfo.level} ({levelInfo.title})
              </p>
            </div>
          </div>

          {/* School Seal */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 shrink-0 backdrop-blur-md">
            <GraduationCap className="h-10 w-10 text-amber-400" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">Verified Institution</p>
              <p className="text-xs font-bold text-white">{student.schoolName || 'Certified Academy'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto p-6 space-y-8 mt-6">
        {/* Skill Radar / Competencies */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Core Skill Competencies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skills.map(skill => (
              <Card key={skill.category} className="bg-slate-900/80 border-slate-800 text-white rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="uppercase tracking-wider text-slate-300">{skill.category}</span>
                  <span className="text-indigo-400 font-mono">{skill.totalBadges} Badges</span>
                </div>
                <Progress value={skill.score} className="h-2.5 bg-slate-800" />
                <p className="text-[10px] text-slate-400 font-semibold text-right">Mastery: {skill.score}%</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Verified Micro-Credentials & Digital Badges */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
            <Award className="h-4 w-4" /> Earned Micro-Credentials & Badges ({earnedBadges.length + (timelineEvents?.filter(e => e.metadata?.isMicroCredential).length || 0)})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BADGE_CATALOG.slice(0, 6).map(badge => (
              <Card key={badge.id} className="bg-slate-900/60 border-slate-800 text-white rounded-2xl p-5 flex items-start gap-4 hover:border-indigo-500/40 transition-all">
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-300 shrink-0">
                  <Award className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm tracking-tight text-white">{badge.title}</h3>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{badge.description}</p>
                  <span className="inline-block text-[9px] font-black uppercase text-amber-400 tracking-wider pt-1">
                    +{badge.xpAward} XP Awarded
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Milestones & Project Artifacts */}
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Verified Project Artifacts & Milestones
          </h2>

          <div className="space-y-3">
            {timelineEvents && timelineEvents.length > 0 ? (
              timelineEvents.slice(0, 5).map(ev => (
                <Card key={ev.id} className="bg-slate-900/40 border-slate-800 text-white rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-indigo-500/30 text-indigo-300 text-[9px] font-black uppercase px-2.5 py-0.5">
                        {ev.category}
                      </Badge>
                      <h4 className="font-bold text-sm text-slate-100">{ev.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">{ev.description}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
                    {ev.date?.seconds ? format(new Date(ev.date.seconds * 1000), 'dd MMM yyyy') : 'Recorded'}
                  </span>
                </Card>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic font-medium p-6 text-center border border-slate-800 rounded-2xl">
                No milestone artifacts recorded on public timeline yet.
              </p>
            )}
          </div>
        </div>

        {/* Footer Verification Seal */}
        <div className="pt-8 border-t border-slate-800 text-center space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Official Digital Record • Issued by GAM Edu Verified Learning Portal
          </p>
        </div>
      </div>
    </div>
  );
}
