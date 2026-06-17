'use client';

import { useMemo, useState, useTransition } from 'react';
import { useUser, useFirestore, useMemoFirebase, useDoc, useCollection } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, limit, doc } from 'firebase/firestore';
import { 
  GraduationCap, Users, School, Banknote, Loader2, 
  Bell, FileText, ChevronRight, Megaphone, CalendarCheck,
  TrendingUp, BrainCircuit, Sigma, FlaskConical, BookOpenCheck, Code,
  Clock, CheckCircle2, Star, PlusCircle, Sparkles, Wallet, HandCoins, Receipt, Calculator, ArrowUpRight,
  XCircle, AlertCircle, Bus as BusIcon, Route as RouteIcon, MapPin, Navigation, Globe, ShieldAlert,
  ArrowDownRight,
  Activity,
  Database,
  Award,
  MessageSquare,
  MessageCircle,
  UserCheck,
  LayoutTemplate,
  CalendarDays,
  PenLine,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateSchoolExecutiveBriefingAction } from '@/app/actions/insights-ai';
import { format, startOfDay, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Route, Bus, Student } from '@/lib/types';

function StatCard({ title, value, icon: Icon, link, isLoading, color = "text-indigo-600", subtitle }: any) {
  return (
    <Link href={link || "#"}>
      <Card className="hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-indigo-500 overflow-hidden relative">
        <CardContent className="p-6">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-200" /> : <h3 className="text-2xl font-black text-slate-900">{value}</h3>}
              {subtitle && <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">{subtitle}</p>}
            </div>
            <div className={cn("p-3 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform shadow-inner", color)}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <Icon className="absolute -right-4 -bottom-4 h-24 w-24 text-slate-50 opacity-[0.03] group-hover:rotate-12 transition-transform" />
        </CardContent>
      </Card>
    </Link>
  );
}

function QuickActionCard({ title, description, icon: Icon, link }: any) {
  return (
    <Link href={link}>
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border-2 border-slate-50 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
        <div className="p-3 bg-indigo-100 rounded-xl group-hover:scale-110 transition-transform">
          <Icon className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <ArrowUpRight className="ml-auto h-4 w-4 text-slate-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>
    </Link>
  );
}

function ActivityItem({ title, description, time, icon: Icon, iconColor }: any) {
  return (
    <div className="flex gap-4">
      <div className={cn("p-2 rounded-xl bg-slate-50 h-fit", iconColor)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="space-y-1 min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-800 truncate">{title}</p>
        <p className="text-xs text-slate-500 line-clamp-2">{description}</p>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{time}</p>
      </div>
    </div>
  );
}

function AdminDashboard({ profile, students, staff, classes, announcements, isLoading, schoolData, hasFinanceAccess, financialRecords, attendance }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Administrator';

    const pulseStats = useMemo(() => {
        if (!attendance || !financialRecords || !students) return { attendanceRate: 0, collectionRate: 0 };
        
        // 1. Today's Attendance Pulse
        const today = startOfDay(new Date());
        const todayRecords = attendance.filter((r: any) => {
            const d = r.date?.toDate ? r.date.toDate() : new Date(r.date);
            return startOfDay(d).getTime() === today.getTime();
        });
        const present = todayRecords.filter((r: any) => r.status === 'Present' || r.status === 'Late').length;
        
        // Filter for ACTIVE Students only
        const activeStudents = students.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus);
        const totalExpected = activeStudents.length || 1;
        const attendanceRate = Math.round((present / totalExpected) * 100);

        // 2. Unified Collection Pulse (Matches Student Billing Page)
        const activeStudentIds = new Set(activeStudents.map((s: any) => s.uid));
        const activeRecords = financialRecords.filter((r: any) => 
            activeStudentIds.has(r.studentId) && 
            r.status !== 'Pending Reversal'
        );

        let totalPaid = 0;
        let totalBilled = 0;
        let totalWaivers = 0;

        activeRecords.forEach((r: any) => {
            const billed = Number(r.billedAmount) || 0;
            const paid = Number(r.amountPaid) || 0;
            const waiver = Number(r.waiverAmount) || 0;
            totalBilled += billed;
            totalPaid += paid;
            totalWaivers += waiver;
        });

        const collectionRate = totalBilled > 0 ? Math.round((totalPaid / (totalBilled - totalWaivers)) * 100) : 0;

        return { attendanceRate, collectionRate };
    }, [attendance, financialRecords, students]);

    const enrollmentData = useMemo(() => {
        if (!classes || !students) return [];
        return classes.map((c: any) => ({
            name: c.name,
            students: students.filter((s: any) => s.classId === c.id && (s.enrollmentStatus === 'Active' || !s.enrollmentStatus)).length
        })).sort((a: any, b: any) => b.students - a.students).slice(0, 6);
    }, [classes, students]);

    const publicUrl = typeof window !== 'undefined' && schoolData?.slug
        ? `${window.location.origin}/s/${schoolData.slug}`
        : null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Institutional <span className="text-indigo-600">Pulse</span></h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Greetings, {displayName}! Here is your school's live metrics.</p>
                </div>
                <div className="flex gap-2">
                    {publicUrl && (
                        <Link href={publicUrl} target="_blank">
                            <Button variant="outline" className="bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl h-10 shadow-sm hover:bg-slate-50">
                                <Globe className="mr-2 h-4 w-4"/> Public Site
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Active Students" 
                    value={students?.filter((s:any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus).length || 0} 
                    icon={GraduationCap} 
                    link="/dashboard/students-v3" 
                    isLoading={isLoading}
                    subtitle={`${pulseStats.attendanceRate}% Present Today`} 
                />
                <StatCard 
                    title="Faculty & Staff" 
                    value={staff?.length || 0} 
                    icon={Users} 
                    link="/dashboard/staff-management-v2" 
                    isLoading={isLoading}
                    color="text-purple-600"
                    subtitle="Institutional Workforce" 
                />
                <StatCard 
                    title="Revenue Health" 
                    value={`${pulseStats.collectionRate}%`} 
                    icon={Banknote} 
                    link="/dashboard/accounts" 
                    isLoading={isLoading}
                    color="text-emerald-600"
                    subtitle="Collection Target" 
                />
                <StatCard 
                    title="School Buzz" 
                    value={announcements?.length || 0} 
                    icon={Megaphone} 
                    link="/dashboard/announcements" 
                    isLoading={isLoading}
                    color="text-orange-500"
                    subtitle="Live Notices" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-2xl rounded-[2.5rem] border-none bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50/50 p-8 border-b">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Enrollment Dynamics</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Students distributed by class</CardDescription>
                            </div>
                            <Button asChild variant="ghost" size="sm" className="text-indigo-600 font-black uppercase text-[10px]">
                                <Link href="/dashboard/reports/enrollment">Full Audit <ArrowUpRight className="ml-1 h-3 w-3"/></Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="h-[350px] p-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={enrollmentData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                                <YAxis hide />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="students" radius={[10, 10, 0, 0]}>
                                    {enrollmentData.map((entry: any, index: number) => (
                                        <Cell 
                                          key={`cell-${index}`} 
                                          fill="#4f46e5" 
                                          fillOpacity={1 - (index * 0.1)} 
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] bg-indigo-900 text-white border-none shadow-xl">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400">Operations Control</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-4">
                            <Link href="/dashboard/students-v3" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/20 rounded-xl"><PlusCircle className="h-4 w-4 text-indigo-300"/></div>
                                    <span className="text-sm font-bold uppercase tracking-tight text-white">Onboard Student</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-white/20 group-hover:translate-x-1 transition-transform"/>
                            </Link>
                            <Link href="/dashboard/academics/gradebook/manual-entry" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-500/20 rounded-xl"><FileText className="h-4 w-4 text-orange-300"/></div>
                                    <span className="text-sm font-bold uppercase tracking-tight text-white">Audit Gradebook</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-white/20 group-hover:translate-x-1 transition-transform"/>
                            </Link>
                            <Link href="/dashboard/admin/migration" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/20 rounded-xl"><Database className="h-4 w-4 text-emerald-300"/></div>
                                    <span className="text-sm font-bold uppercase tracking-tight text-white">Data Import Hub</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-white/20 group-hover:translate-x-1 transition-transform"/>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] shadow-xl border-none bg-white">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">System Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-4">
                             {announcements?.slice(0, 2).map((ann: any) => (
                                <div key={ann.id} className="flex gap-4">
                                    <div className="w-1 h-10 bg-indigo-600 rounded-full shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-black text-slate-800 truncate uppercase tracking-tight">{ann.title}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{ann.publishedAt ? format(ann.publishedAt.toDate(), 'PPP') : 'Just now'}</p>
                                    </div>
                                </div>
                             ))}
                             <Button asChild variant="outline" className="w-full h-10 rounded-xl border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                                 <Link href="/dashboard/audit-log">View System Audit</Link>
                             </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Helper functions for AI markdown parsing
function parseBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="text-white font-extrabold">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function parseMarkdownToReact(text: string) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('###')) {
      return <h4 key={i} className="text-sm font-black uppercase text-indigo-400 mt-4 mb-2 tracking-wide">{trimmed.replace(/###/g, '').trim()}</h4>;
    }
    if (trimmed.startsWith('##')) {
      return <h3 key={i} className="text-base font-black uppercase text-white mt-5 mb-3 tracking-widest border-b border-indigo-900 pb-1">{trimmed.replace(/##/g, '').trim()}</h3>;
    }
    if (trimmed.startsWith('#')) {
      return <h2 key={i} className="text-lg font-black uppercase text-indigo-300 mt-6 mb-4 tracking-widest border-b border-indigo-800 pb-1">{trimmed.replace(/#/g, '').trim()}</h2>;
    }
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const content = trimmed.substring(1).trim();
      return (
        <li key={i} className="text-xs text-slate-300 leading-relaxed list-disc ml-5 mb-2 font-medium">
          {parseBoldText(content)}
        </li>
      );
    }
    if (trimmed === '') {
      return <div key={i} className="h-2" />;
    }
    return <p key={i} className="text-xs text-slate-300 leading-relaxed mb-3 font-medium">{parseBoldText(trimmed)}</p>;
  });
}


function DirectorStatCard({ title, value, icon: Icon, link, isLoading, color = "text-indigo-600", subtitle, glowColor = "rgba(99, 102, 241, 0.05)" }: any) {
  return (
    <Link href={link || "#"}>
      <Card className="hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.07),0_15px_30px_-10px_rgba(99,102,241,0.05)] hover:border-indigo-100/50 border border-slate-100 bg-white/95 backdrop-blur-md transition-all duration-300 cursor-pointer group rounded-[2rem] overflow-hidden relative hover:-translate-y-1 active:scale-[0.99]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-slate-200" />
              ) : (
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
              )}
              {subtitle && <p className="text-[9px] font-black text-slate-500 mt-2 uppercase tracking-wide">{subtitle}</p>}
            </div>
            <div className={cn("p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-inner", color)} style={{ backgroundColor: glowColor }}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          {/* Subtle background glow circle */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-[0.04] transition-transform duration-500 group-hover:scale-125" style={{ backgroundColor: 'currentColor' }} />
        </CardContent>
      </Card>
    </Link>
  );
}

function DirectorDashboard({
  profile,
  students,
  staff,
  classes,
  announcements,
  isLoading,
  schoolData,
  hasFinanceAccess,
  financialRecords,
  attendance,
  schoolId,
  recentAssessments,
}: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'financials' | 'general'>('overview');
  const [isAuditorOpen, setIsAuditorOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  const displayName = profile?.firstName || 'Director';

  const academicTidbits = useMemo(() => {
    if (!recentAssessments || recentAssessments.length === 0) {
      return { avgScore: 82, passingRate: 88, topSubject: "Mathematics", totalAssessments: 0 };
    }
    let totalPct = 0;
    let count = 0;
    let passingCount = 0;
    const subjects: Record<string, { total: number; count: number }> = {};

    recentAssessments.forEach((a: any) => {
      const score = Number(a.score) || 0;
      const max = Number(a.maxScore) || 100;
      if (max > 0) {
        const pct = (score / max) * 100;
        totalPct += pct;
        count++;
        if (pct >= 50) passingCount++;
        
        if (a.subjectName) {
          if (!subjects[a.subjectName]) subjects[a.subjectName] = { total: 0, count: 0 };
          subjects[a.subjectName].total += pct;
          subjects[a.subjectName].count++;
        }
      }
    });

    const avgScore = count > 0 ? Math.round(totalPct / count) : 82;
    const passingRate = count > 0 ? Math.round((passingCount / count) * 100) : 88;
    const passingRateCapped = Math.min(passingRate, 100);

    let topSubject = "Mathematics";
    let bestAvg = 0;
    Object.entries(subjects).forEach(([sub, data]) => {
      const avg = data.total / data.count;
      if (avg > bestAvg) {
        bestAvg = avg;
        topSubject = sub;
      }
    });

    return {
      avgScore,
      passingRate: passingRateCapped,
      topSubject,
      totalAssessments: count
    };
  }, [recentAssessments]);

  const banners = useMemo(() => {
    const bannerMap = {
      overview: {
        gradient: "from-indigo-900 via-indigo-950 to-slate-900 border-indigo-500/20",
        title: "Executive Director Cockpit",
        description: "Unified analytics dashboard compiling attendance, active student registration, and gross financials.",
        badge: "Overview Hub",
        badgeColor: "bg-indigo-500/20 text-indigo-300",
        icon: LayoutTemplate,
      },
      academics: {
        gradient: "from-purple-900 via-purple-950 to-indigo-950 border-purple-500/20",
        title: "Academic Intelligence Hub",
        description: "Class sizes skew, teacher staffing ratio distributions, and student score variance analytics.",
        badge: "Academics Pulse",
        badgeColor: "bg-purple-500/20 text-purple-300",
        icon: GraduationCap,
      },
      financials: {
        gradient: "from-emerald-950 via-slate-900 to-indigo-950 border-emerald-500/20",
        title: "Capital Liquid Ledger",
        description: "Billed tuition fees pipeline, cleared cash collections, outstanding receivables debt, and accounting shortcuts.",
        badge: "Financial Health",
        badgeColor: "bg-emerald-500/20 text-emerald-300",
        icon: Banknote,
      },
      general: {
        gradient: "from-slate-900 via-slate-950 to-indigo-950 border-slate-700/20",
        title: "General Noticeboard & Audits",
        description: "Institutional announcement timeline logs, public website status check, and system audit trails.",
        badge: "Noticeboard Buzz",
        badgeColor: "bg-amber-500/20 text-amber-300",
        icon: Megaphone,
      }
    };
    return bannerMap[activeTab];
  }, [activeTab]);

  const activeStudents = useMemo(() => {
    return students?.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus) || [];
  }, [students]);

  const attendanceRate = useMemo(() => {
    if (!attendance || activeStudents.length === 0) return 0;
    const today = startOfDay(new Date());
    const todayRecords = attendance.filter((r: any) => {
      const d = r.date?.toDate ? r.date.toDate() : new Date(r.date);
      return startOfDay(d).getTime() === today.getTime();
    });
    const present = todayRecords.filter((r: any) => r.status === 'Present' || r.status === 'Late').length;
    return Math.round((present / activeStudents.length) * 100);
  }, [attendance, activeStudents]);

  const totalStaff = staff?.length || 0;

  const studentTeacherRatio = useMemo(() => {
    const teachers = staff?.filter((s: any) => s.role === 'Teacher')?.length || 0;
    if (teachers === 0) return activeStudents.length;
    return parseFloat((activeStudents.length / teachers).toFixed(1));
  }, [activeStudents, staff]);

  const financials = useMemo(() => {
    if (!financialRecords || activeStudents.length === 0) return { totalOutstanding: 0, totalRevenue: 0, collectionRate: 0, totalBilled: 0, revenueByType: [] };
    
    const activeStudentIds = new Set(activeStudents.map((s: any) => s.uid));
    const activeRecords = financialRecords.filter((r: any) => 
      activeStudentIds.has(r.studentId) && 
      r.status !== 'Pending Reversal'
    );

    let totalBilled = 0;
    let totalPaid = 0;
    let totalWaivers = 0;
    const types: Record<string, number> = {};

    activeRecords.forEach((r: any) => {
      const billed = Number(r.billedAmount) || 0;
      const paid = Number(r.amountPaid) || 0;
      const waiver = Number(r.waiverAmount) || 0;
      
      totalBilled += billed;
      totalPaid += paid;
      totalWaivers += waiver;

      if (paid > 0) {
        const type = r.type || 'Other';
        types[type] = (types[type] || 0) + paid;
      }
    });

    const collectionRate = totalBilled > 0 ? Math.round((totalPaid / (totalBilled - totalWaivers)) * 100) : 0;
    const totalOutstanding = totalBilled - totalPaid - totalWaivers;

    const revenueByType = Object.entries(types).map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return { 
      totalOutstanding, 
      totalRevenue: totalPaid, 
      totalBilled,
      collectionRate, 
      revenueByType 
    };
  }, [financialRecords, activeStudents]);

  const debtAgingStats = useMemo(() => {
    if (!financialRecords || !activeStudents || activeStudents.length === 0) {
      return { current: 0, age30: 0, age60: 0, age90: 0, total: 0 };
    }
    
    const activeStudentIds = new Set(activeStudents.map((s: any) => s.uid));
    const today = startOfDay(new Date());

    let current = 0; // Due date in the future or today
    let age30 = 0;   // Overdue 1-30 days
    let age60 = 0;   // Overdue 31-60 days
    let age90 = 0;   // Overdue 61+ days

    financialRecords.forEach((r: any) => {
      if (!activeStudentIds.has(r.studentId) || r.status === 'Pending Reversal') return;
      
      const billed = Number(r.billedAmount) || 0;
      const paid = Number(r.amountPaid) || 0;
      const waiver = Number(r.waiverAmount) || 0;
      const balance = billed - paid - waiver;

      if (balance <= 0.01) return;

      const dueDate = r.dueDate?.toDate ? r.dueDate.toDate() : new Date(r.dueDate);
      const diffTime = today.getTime() - startOfDay(dueDate).getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        current += balance;
      } else if (diffDays <= 30) {
        age30 += balance;
      } else if (diffDays <= 60) {
        age60 += balance;
      } else {
        age90 += balance;
      }
    });

    const total = current + age30 + age60 + age90;
    return { current, age30, age60, age90, total };
  }, [financialRecords, activeStudents]);

  const classSizes = useMemo(() => {
    if (!classes || !students) return [];
    return classes.map((c: any) => ({
      name: c.name,
      students: students.filter((s: any) => s.classId === c.id && (s.enrollmentStatus === 'Active' || !s.enrollmentStatus)).length
    })).sort((a: any, b: any) => b.students - a.students).slice(0, 6);
  }, [classes, students]);

  const announcementsCount = announcements?.length || 0;

  const handleRunAudit = () => {
    setIsAuditorOpen(true);
    setAuditError(null);
    startTransition(async () => {
      try {
        const statsPayload = {
          totalStudents: activeStudents.length,
          attendanceRateToday: attendanceRate,
          totalStaff,
          financials: {
            totalOutstanding: financials.totalOutstanding,
            totalRevenue: financials.totalRevenue,
            collectionRate: financials.collectionRate,
            revenueByType: financials.revenueByType,
          },
          classSizes: classSizes,
          announcementsCount,
        };
        const res = await generateSchoolExecutiveBriefingAction(
          schoolId,
          schoolData?.name || "Our School",
          statsPayload
        );
        if (res.success && res.text) {
          setAuditResult(res.text);
        } else {
          setAuditError(res.error || "Failed to generate AI executive briefing.");
        }
      } catch (err: any) {
        setAuditError(err.message || "An unexpected error occurred.");
      }
    });
  };

  const publicUrl = typeof window !== 'undefined' && schoolData?.slug
    ? `${window.location.origin}/s/${schoolData.slug}`
    : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative pb-16">
      {/* Header bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black tracking-[0.25em] bg-indigo-500/10 text-indigo-600 px-3.5 py-1.5 rounded-full uppercase">Director Suite</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Executive <span className="text-indigo-600">Console</span></h1>
        </div>
        
        {/* Navigation & Controls */}
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Custom Silicon Valley Tab Bar */}
          <div className="flex p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-inner">
            {(['overview', 'academics', 'financials', 'general'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300",
                  activeTab === tab 
                    ? "bg-white text-indigo-600 shadow-md font-black scale-[1.02]"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* AI Auditor Trigger Button */}
          <Button 
            onClick={handleRunAudit}
            className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-black rounded-2xl h-11 px-6 shadow-lg shadow-indigo-200/50 flex items-center gap-2 group transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <Sparkles className="h-4 w-4 animate-pulse group-hover:rotate-12 transition-transform" />
            <span className="text-xs uppercase tracking-wider">AI Auditor</span>
          </Button>
        </div>
      </div>

      {/* Colorful Gradient Banner Header */}
      <div className={cn("relative p-8 xl:p-10 rounded-[2rem] text-white border-b-8 border-black/10 overflow-hidden shadow-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-gradient-to-r border", banners.gradient)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.06),_rgba(255,255,255,0))] pointer-events-none" />
        <div className="space-y-3 relative z-10 max-w-xl">
          <span className={cn("text-[9px] font-black tracking-[0.25em] px-3.5 py-1.5 rounded-full uppercase", banners.badgeColor)}>
            {banners.badge}
          </span>
          <h2 className="text-2.5xl xl:text-3.5xl font-black tracking-tight uppercase italic mt-2">{banners.title}</h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">{banners.description}</p>
        </div>
        <div className="hidden xl:flex p-5 bg-white/5 border border-white/10 rounded-[1.5rem] relative z-10 shrink-0">
          <banners.icon className="h-10 w-10 text-white opacity-80" />
        </div>
      </div>

      {/* Main Tabs Container */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <DirectorStatCard 
                title="Enrolled Student Body" 
                value={activeStudents.length} 
                icon={GraduationCap} 
                link="/dashboard/students-v3" 
                isLoading={isLoading}
                subtitle={`${attendanceRate}% Present Today`} 
                color="text-indigo-600"
                glowColor="rgba(99, 102, 241, 0.08)"
              />
              <DirectorStatCard 
                title="Institutional Faculty" 
                value={totalStaff} 
                icon={Users} 
                link="/dashboard/staff-management-v2" 
                isLoading={isLoading}
                color="text-purple-600"
                subtitle={`Student-Teacher Ratio: ${studentTeacherRatio}:1`} 
                glowColor="rgba(168, 85, 247, 0.08)"
              />
              <DirectorStatCard 
                title="Capital Collection" 
                value={`GH₵ ${Math.round(financials.totalRevenue).toLocaleString()}`} 
                icon={Banknote} 
                link="/dashboard/accounts" 
                isLoading={isLoading}
                color="text-emerald-600"
                subtitle={`${financials.collectionRate}% of Outstanding Bills`} 
                glowColor="rgba(16, 185, 129, 0.08)"
              />
              <DirectorStatCard 
                title="Notice Board & Buzz" 
                value={announcementsCount} 
                icon={Megaphone} 
                link="/dashboard/announcements" 
                isLoading={isLoading}
                color="text-amber-500"
                subtitle="Active Communications" 
                glowColor="rgba(245, 158, 11, 0.08)"
              />
            </div>

            {/* Visual Executive Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Liquidity Ring Chart Card */}
              <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03),0_10px_20px_-10px_rgba(0,0,0,0.02)] bg-white/95 backdrop-blur-md overflow-hidden flex flex-col justify-between hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.05)] transition-all duration-300">
                <CardHeader className="bg-slate-50/50 p-8 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Fee Pipeline & Recovery Status</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Billed Capital Distribution</CardDescription>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 border-none font-black text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                      Collection Efficiency: {financials.collectionRate}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8 flex-1 flex flex-col justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Total Billed Fees</p>
                        <h4 className="text-2.5xl font-black text-slate-800">GH₵ {financials.totalBilled.toLocaleString()}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100/50">
                          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Receipted</p>
                          <p className="text-base font-black text-emerald-800">GH₵ {financials.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-100/50">
                          <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest mb-1">Outstanding</p>
                          <p className="text-base font-black text-rose-800">GH₵ {financials.totalOutstanding.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress visual representation */}
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-[2.25rem] border border-slate-100/80 shadow-inner">
                      <div className="relative w-44 h-44 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          {/* Background ring */}
                          <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="9" fill="transparent" />
                          {/* Inner glowing stroke helper */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            stroke="#10b981" 
                            strokeWidth="9" 
                            fill="transparent" 
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={2 * Math.PI * 40 * (1 - financials.collectionRate / 100)}
                            strokeLinecap="round"
                            opacity={0.15}
                            className="blur-[2px]"
                          />
                          {/* Actual progress stroke */}
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            stroke="url(#progressRingGrad)" 
                            strokeWidth="9" 
                            fill="transparent" 
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={2 * Math.PI * 40 * (1 - financials.collectionRate / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                          <defs>
                            <linearGradient id="progressRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-black text-slate-900 tracking-tighter">{financials.collectionRate}%</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Liquidated</span>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight text-center mt-5 leading-relaxed">
                        GH₵ {financials.totalOutstanding.toLocaleString()} remains outstanding in parental balances.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Shortcuts Panel */}
              <div className="flex flex-col gap-6">
                <Card className="rounded-[2.5rem] bg-indigo-950 text-white border-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] relative overflow-hidden flex-1 group">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-indigo-950 to-indigo-950 z-0" />
                  <CardHeader className="p-8 pb-4 relative z-10">
                    <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400">Director Command Bar</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-4 relative z-10">
                    <Link href="/dashboard/finance/budget" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-350 group/item hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-xl group-hover/item:scale-105 transition-transform"><Calculator className="h-4 w-4 text-indigo-300"/></div>
                        <span className="text-sm font-bold uppercase tracking-tight text-white">Budget & Variance Analysis</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/20 group-hover/item:translate-x-1 transition-transform"/>
                    </Link>
                    <Link href="/dashboard/finance/payroll" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-350 group/item hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-xl group-hover/item:scale-105 transition-transform"><Wallet className="h-4 w-4 text-emerald-300"/></div>
                        <span className="text-sm font-bold uppercase tracking-tight text-white">Payroll Administration</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/20 group-hover/item:translate-x-1 transition-transform"/>
                    </Link>
                    <Link href="/dashboard/staff/performance" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-350 group/item hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-xl group-hover/item:scale-105 transition-transform"><Award className="h-4 w-4 text-purple-300"/></div>
                        <span className="text-sm font-bold uppercase tracking-tight text-white">Staff Appraisal & Reviews</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/20 group-hover/item:translate-x-1 transition-transform"/>
                    </Link>
                    <Link href="/dashboard/announcements" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-350 group/item hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-xl group-hover/item:scale-105 transition-transform"><Megaphone className="h-4 w-4 text-amber-300"/></div>
                        <span className="text-sm font-bold uppercase tracking-tight text-white">Global Noticeboard</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/20 group-hover/item:translate-x-1 transition-transform"/>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white/95 backdrop-blur-md p-8 hover:shadow-[0_20px_40px_-5px_rgba(168,85,247,0.05)] transition-all duration-350">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">AI Operations Balance</p>
                      <h4 className="text-lg font-black text-slate-800 mt-1">{schoolData?.aiCredits || 0} Credits Left</h4>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                      <BrainCircuit className="h-5 w-5 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-normal leading-relaxed mt-3">
                    Each health briefing requires 5 credits. Talk to support to purchase additional tokens.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'academics' && (
          <div className="space-y-8 animate-in fade-in duration-350">
            {/* Academic Performance Tidbits */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:border-purple-200/50 hover:-translate-y-0.5 transition-all duration-300">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Core Grade Average</p>
                  <h4 className="text-2xl font-black text-slate-800 mt-2">{academicTidbits.avgScore}%</h4>
                  <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Assessment Midpoint</p>
                </div>
                <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl"><TrendingUp className="h-5 w-5 animate-pulse" /></div>
              </div>

              <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:border-emerald-200/50 hover:-translate-y-0.5 transition-all duration-300">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Passing Rate Threshold</p>
                  <h4 className="text-2xl font-black text-slate-800 mt-2">{academicTidbits.passingRate}%</h4>
                  <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Scores &ge; 50% Target</p>
                </div>
                <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle2 className="h-5 w-5" /></div>
              </div>

              <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:border-amber-200/50 hover:-translate-y-0.5 transition-all duration-300">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Top Subject Index</p>
                  <h4 className="text-lg font-black text-slate-800 mt-2 truncate max-w-[150px]">{academicTidbits.topSubject}</h4>
                  <p className="text-[9px] font-bold text-slate-500 mt-2.5 uppercase">Highest Scoring Stream</p>
                </div>
                <div className="p-3.5 bg-amber-50 text-amber-500 rounded-2xl"><Award className="h-5 w-5" /></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Enrollment Distribution */}
              <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-8 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Enrollment Balance Index</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Total active students by class</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[380px] p-8">
                  {classSizes.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={classSizes} barSize={40}>
                        <defs>
                          <linearGradient id="classSizesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.25} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#64748b', fontWeight: 'bold'}} />
                        <YAxis tickLine={false} axisLine={false} tick={{fill: '#64748b', fontWeight: 'bold'}} fontSize={10} />
                        <Tooltip 
                          cursor={{fill: 'rgba(99, 102, 241, 0.02)'}}
                          contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12)' }}
                        />
                        <Bar dataKey="students" fill="url(#classSizesGrad)" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 italic text-xs uppercase tracking-widest font-black">No student registration data found.</div>
                  )}
                </CardContent>
              </Card>

              {/* Ratios and balance stats */}
              <div className="space-y-6">
                <Card className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] hover:shadow-xl transition-shadow duration-300">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Staffing Ratios</CardTitle>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Teachers</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">
                          {staff?.filter((s: any) => s.role === 'Teacher')?.length || 0}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Users className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student-to-Teacher Ratio</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">{studentTeacherRatio}:1</p>
                      </div>
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Class size</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">
                          {classes?.length ? Math.round(activeStudents.length / classes.length) : 0} Students
                        </p>
                      </div>
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <School className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Quick Academic Actions */}
                <Card className="rounded-[2.5rem] bg-indigo-900 text-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border-none">
                  <h4 className="text-sm font-black uppercase tracking-widest text-indigo-300 mb-4">Academic Controls</h4>
                  <div className="space-y-3">
                    <Link href="/dashboard/classes" className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 hover:translate-x-1 transition-all text-xs font-bold uppercase tracking-wider">
                      <span>Manage Grade Structure</span>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                    <Link href="/dashboard/students-v3" className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 hover:translate-x-1 transition-all text-xs font-bold uppercase tracking-wider">
                      <span>Student Registers</span>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </Link>
                  </div>
                </Card>
              </div>
            </div>

            {/* Class break-down lists */}
            <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
              <h3 className="text-base font-black uppercase tracking-tight text-slate-800 mb-6">Class Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {classes?.map((c: any) => {
                  const size = students?.filter((s: any) => s.classId === c.id && (s.enrollmentStatus === 'Active' || !s.enrollmentStatus)).length || 0;
                  return (
                    <div key={c.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
                      <div>
                        <p className="font-black text-slate-800 uppercase tracking-tight text-slate-800 text-sm">{c.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{c.room || 'No Room Assigned'}</p>
                      </div>
                      <Badge className="bg-indigo-100 text-indigo-800 border-none font-black text-xs px-3 py-1 rounded-full">{size} Students</Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="space-y-8">
            {/* Financial Stats Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-300">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gross Billed Capital</p>
                <h4 className="text-xl font-black text-slate-800 mt-2">GH₵ {financials.totalBilled.toLocaleString()}</h4>
                <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Initial Target Billed</p>
              </div>
              <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-300">
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest font-bold">Total Liquid Receipts</p>
                <h4 className="text-xl font-black text-slate-800 mt-2">GH₵ {financials.totalRevenue.toLocaleString()}</h4>
                <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Deposited & Cleared</p>
              </div>
              <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-300">
                <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest font-bold">Outstanding Receivables</p>
                <h4 className="text-xl font-black text-slate-800 mt-2">GH₵ {financials.totalOutstanding.toLocaleString()}</h4>
                <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Outstanding parental debt</p>
              </div>
              <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-300">
                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest font-bold">Collection Recovery</p>
                <h4 className="text-xl font-black text-slate-800 mt-2">{financials.collectionRate}%</h4>
                <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Recovery efficiency</p>
              </div>
            </div>

            {/* Financial Analysis Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Fee breakdown list and graph */}
              <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-8 border-b">
                  <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600"/> Revenue Collections by Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] p-8">
                  {financials.revenueByType.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financials.revenueByType} layout="vertical" margin={{ left: 20 }}>
                        <defs>
                          <linearGradient id="revenueByTypeGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                          </linearGradient>
                        </defs>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" fontSize={10} width={100} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontWeight: 'bold'}} />
                        <Tooltip 
                          cursor={{fill: 'rgba(99, 102, 241, 0.02)'}}
                          formatter={(val: number) => [`GH₵ ${val.toLocaleString()}`, 'Amount']}
                          contentStyle={{ borderRadius: '20px', border: 'none', backgroundColor: '#fff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12)' }}
                        />
                        <Bar dataKey="value" fill="url(#revenueByTypeGrad)" radius={[0, 10, 10, 0]} barSize={22} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 italic text-xs uppercase tracking-widest font-black">No revenue entries detected.</div>
                  )}
                </CardContent>
              </Card>

              {/* Financial shortcuts */}
              <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Financial Controls</h3>
                <div className="space-y-4">
                  <Link href="/dashboard/finance/budget" className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all duration-300 group hover:translate-x-1">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-105 transition-transform"><Calculator className="h-4 w-4" /></div>
                    <div>
                      <p className="text-xs font-black uppercase text-slate-800 tracking-tight">Ledger Budgets</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Define and audit annual budgets</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/finance/payroll" className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-200 transition-all duration-300 group hover:translate-x-1">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform"><Wallet className="h-4 w-4" /></div>
                    <div>
                      <p className="text-xs font-black uppercase text-slate-800 tracking-tight">Staff Payroll</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Review current payroll runs</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/accounts" className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-purple-200 transition-all duration-300 group hover:translate-x-1">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-105 transition-transform"><Banknote className="h-4 w-4" /></div>
                    <div>
                      <p className="text-xs font-black uppercase text-slate-800 tracking-tight">Accounts Ledger</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Audit student payments and invoices</p>
                    </div>
                  </Link>
                </div>
              </Card>
            </div>

            {/* Receivables Debt Aging Analysis Card */}
            <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8 hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.05)] transition-all duration-300">
              <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-600" /> Receivables Debt Aging Analysis
                  </CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                    Outstanding parental balances aged by payment due date
                  </CardDescription>
                </div>
                {debtAgingStats.total > 0 && (
                  <Badge className="bg-rose-100 text-rose-800 border-none font-black text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    Total Arrears: GH₵ {Math.round(debtAgingStats.total).toLocaleString()}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                {/* Segmented aging bar */}
                <div className="h-6 flex rounded-xl overflow-hidden bg-slate-100 border shadow-inner">
                  {debtAgingStats.total > 0 ? (
                    <>
                      {debtAgingStats.current > 0 && (
                        <div 
                          style={{ width: `${(debtAgingStats.current / debtAgingStats.total) * 100}%` }} 
                          className="bg-emerald-500 transition-all duration-500 hover:opacity-90 cursor-pointer"
                          title={`Current: GH₵ ${debtAgingStats.current.toFixed(2)}`}
                        />
                      )}
                      {debtAgingStats.age30 > 0 && (
                        <div 
                          style={{ width: `${(debtAgingStats.age30 / debtAgingStats.total) * 100}%` }} 
                          className="bg-amber-400 transition-all duration-500 hover:opacity-90 cursor-pointer"
                          title={`1-30 Days: GH₵ ${debtAgingStats.age30.toFixed(2)}`}
                        />
                      )}
                      {debtAgingStats.age60 > 0 && (
                        <div 
                          style={{ width: `${(debtAgingStats.age60 / debtAgingStats.total) * 100}%` }} 
                          className="bg-orange-500 transition-all duration-500 hover:opacity-90 cursor-pointer"
                          title={`31-60 Days: GH₵ ${debtAgingStats.age60.toFixed(2)}`}
                        />
                      )}
                      {debtAgingStats.age90 > 0 && (
                        <div 
                          style={{ width: `${(debtAgingStats.age90 / debtAgingStats.total) * 100}%` }} 
                          className="bg-rose-600 transition-all duration-500 hover:opacity-90 cursor-pointer"
                          title={`61+ Days: GH₵ ${debtAgingStats.age90.toFixed(2)}`}
                        />
                      )}
                    </>
                  ) : (
                    <div className="w-full bg-slate-50 flex items-center justify-center text-xs text-slate-400 italic font-black uppercase tracking-widest">No Outstanding Debt</div>
                  )}
                </div>

                {/* Grid metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="p-5 border-l-4 border-l-emerald-500 bg-slate-50/50 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Current
                    </p>
                    <p className="text-xl font-black text-slate-800 mt-2">
                      GH₵ {debtAgingStats.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                      {debtAgingStats.total > 0 ? ((debtAgingStats.current / debtAgingStats.total) * 100).toFixed(1) : 0}% of total
                    </p>
                  </div>

                  <div className="p-5 border-l-4 border-l-amber-400 bg-slate-50/50 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-500" /> 1-30 Days
                    </p>
                    <p className="text-xl font-black text-amber-600 mt-2">
                      GH₵ {debtAgingStats.age30.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                      {debtAgingStats.total > 0 ? ((debtAgingStats.age30 / debtAgingStats.total) * 100).toFixed(1) : 0}% of total
                    </p>
                  </div>

                  <div className="p-5 border-l-4 border-l-orange-500 bg-slate-50/50 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-orange-500" /> 31-60 Days
                    </p>
                    <p className="text-xl font-black text-orange-600 mt-2">
                      GH₵ {debtAgingStats.age60.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                      {debtAgingStats.total > 0 ? ((debtAgingStats.age60 / debtAgingStats.total) * 100).toFixed(1) : 0}% of total
                    </p>
                  </div>

                  <div className="p-5 border-l-4 border-l-rose-600 bg-slate-50/50 rounded-2xl hover:scale-[1.02] transition-transform duration-300">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-rose-500" /> 61+ Days
                    </p>
                    <p className="text-xl font-black text-rose-600 mt-2">
                      GH₵ {debtAgingStats.age90.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">
                      {debtAgingStats.total > 0 ? ((debtAgingStats.age90 / debtAgingStats.total) * 100).toFixed(1) : 0}% of total
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Bulletin timeline */}
              <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-8 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Global Announcements & Noticeboard</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Recent broadcasts sent to school audience</CardDescription>
                    </div>
                    <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-[10px] uppercase h-8 px-4">
                      <Link href="/dashboard/announcements">Post Bulletin</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {announcements && announcements.length > 0 ? (
                    announcements.slice(0, 4).map((a: any) => (
                      <div key={a.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:scale-[1.01] transition-transform duration-300">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">{a.title}</h4>
                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">{a.audience || 'Everybody'}</span>
                        </div>
                        <p className="text-xs font-medium leading-relaxed text-slate-500 line-clamp-3">{a.content}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider pt-1">{a.publishedAt ? format(a.publishedAt.toDate(), 'PPP') : 'Just now'}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400 italic text-xs uppercase tracking-widest font-black">No announcements posted yet.</div>
                  )}
                </CardContent>
              </Card>

              {/* Public visibility settings */}
              <div className="space-y-6">
                <Card className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Web Visibility</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-normal mb-6">
                    Your school's public website is live. Parents can read public bulletins and register new candidates.
                  </p>
                  {publicUrl ? (
                    <Link href={publicUrl} target="_blank" className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all font-black text-xs uppercase text-indigo-600 hover:translate-x-1">
                      <span>Visit School Site</span>
                      <Globe className="h-4 w-4" />
                    </Link>
                  ) : (
                    <div className="p-4 bg-slate-50 text-slate-400 text-center rounded-2xl italic text-xs font-black uppercase">Web Slug Not Configured</div>
                  )}
                </Card>

                <Card className="rounded-[2.5rem] bg-slate-900 text-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border-none">
                  <h4 className="text-sm font-black uppercase tracking-widest text-indigo-300 mb-4">Security & Logs</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium mb-6">
                    Review administrative access rights and security tokens assigned to school staff.
                  </p>
                  <Button asChild variant="outline" className="w-full border-white/10 hover:bg-white/10 text-white font-black text-xs uppercase rounded-xl h-11">
                    <Link href="/dashboard/audit-log">View Security logs</Link>
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI School Auditor Sidebar Drawer Panel */}
      {isAuditorOpen && (
        <>
          {/* Backdrop blur overlay */}
          <div 
            onClick={() => setIsAuditorOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          />
          
          {/* Main Slide-in Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[radial-gradient(circle_at_top_right,_rgba(30,27,75,0.4),_rgba(3,7,18,0.99))] bg-slate-950/98 backdrop-blur-2xl border-l border-indigo-500/15 shadow-2xl z-50 flex flex-col justify-between text-white animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-8 border-b border-indigo-950/50 bg-slate-950/40 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BrainCircuit className="h-4 w-4 text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">AI School Auditor</span>
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Executive School Audit</h3>
              </div>
              <button 
                onClick={() => setIsAuditorOpen(false)}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable audit content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {isPending ? (
                <div className="space-y-6 py-10">
                  <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-30 animate-pulse" />
                      <Loader2 className="h-10 w-10 animate-spin text-indigo-400 relative z-10" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300 animate-pulse">Running diagnostics...</p>
                  </div>
                  
                  {/* Glowing custom loading skeletons */}
                  <div className="space-y-3">
                    <div className="h-4 bg-indigo-950/40 rounded-full animate-pulse w-3/4" />
                    <div className="h-3 bg-indigo-950/30 rounded-full animate-pulse w-5/6" />
                    <div className="h-3 bg-indigo-950/20 rounded-full animate-pulse w-2/3" />
                  </div>
                  <div className="space-y-3 pt-6">
                    <div className="h-4 bg-indigo-950/40 rounded-full animate-pulse w-1/2" />
                    <div className="h-3 bg-indigo-950/30 rounded-full animate-pulse w-5/6" />
                    <div className="h-3 bg-indigo-950/20 rounded-full animate-pulse w-3/4" />
                  </div>
                </div>
              ) : auditError ? (
                <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-900/50 text-rose-200 text-xs font-bold uppercase tracking-tight leading-relaxed">
                  <AlertCircle className="h-5 w-5 text-rose-500 mb-2" />
                  {auditError}
                </div>
              ) : auditResult ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/30 text-[10px] font-bold text-indigo-300 uppercase tracking-widest flex items-center justify-between mb-4">
                    <span>Audit complete • Model: Gemini 3 Flash</span>
                    <Badge className="bg-indigo-900/60 text-indigo-200 border-none text-[8px] tracking-widest px-2 py-0.5">5 CREDITS SPENT</Badge>
                  </div>
                  <div className="space-y-2 font-medium">
                    {parseMarkdownToReact(auditResult)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 flex flex-col items-center justify-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-10 animate-pulse" />
                    <div className="relative bg-slate-900 p-6 rounded-full border border-indigo-950"><Sparkles className="h-10 w-10 text-indigo-400" /></div>
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-sm text-slate-200">Generate School health Audit</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase max-w-xs mt-2 leading-relaxed">
                      Run the executive school auditor. Generates a live analysis of financial pipelines, academic skews, and warnings.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Button drawer action */}
            <div className="p-8 border-t border-indigo-950/50 bg-slate-950/60">
              <Button 
                onClick={handleRunAudit}
                disabled={isPending}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black rounded-2xl h-14 shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-wider"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing school metrics...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {auditResult ? 'Re-run Executive Audit' : 'Generate executive Audit'}
                  </>
                )}
              </Button>
              <div className="text-center mt-3 text-[10px] font-bold text-slate-500 uppercase">
                Costs 5 credits • Current Credits: {schoolData?.aiCredits || 0}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SecretaryDashboard({ profile, students, announcements, isLoading }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Secretary';

    const activeStudentsCount = useMemo(() => {
        return students?.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus).length || 0;
    }, [students]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1 mb-2">
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Administrative <span className="text-blue-600">Command</span></h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Greetings, {displayName}! Managing school documentation and logistics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <StatCard title="Active Students" value={activeStudentsCount} icon={GraduationCap} link="/dashboard/students-v3" isLoading={isLoading} />
                <StatCard title="Live Notices" value={announcements?.length || 0} icon={Megaphone} link="/dashboard/announcements" isLoading={isLoading} color="text-orange-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b p-8">
                        <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">General Admin Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-3">
                        <QuickActionCard title="Post Announcement" description="Send news to parents and students" icon={Megaphone} link="/dashboard/announcements" />
                        <QuickActionCard title="Manage Students" description="Review profiles and IDs" icon={Users} link="/dashboard/students-v3" />
                        <QuickActionCard title="Communication Hub" description="Send bulk SMS or WhatsApp alerts" icon={MessageCircle} link="/dashboard/communication/sms" />
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400">Institutional Bulletin</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                        {announcements?.slice(0, 4).map((a: any) => (
                            <ActivityItem 
                                key={a.id}
                                title={a.title}
                                description={a.content}
                                time={a.publishedAt ? formatDistanceToNow(a.publishedAt.toDate(), { addSuffix: true }) : 'Just now'}
                                icon={Megaphone}
                                iconColor="text-indigo-400"
                            />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ReceptionistDashboard({ profile, announcements, attendance, students, isLoading }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Receptionist';

    const todayAttendance = useMemo(() => {
        if (!attendance || !students) return 0;
        const today = startOfDay(new Date());
        const presentCount = attendance.filter((r: any) => {
            const d = r.date?.toDate ? r.date.toDate() : new Date(r.date);
            return startOfDay(d).getTime() === today.getTime() && (r.status === 'Present' || r.status === 'Late');
        }).length;
        return presentCount;
    }, [attendance, students]);

    const activeStudentsCount = useMemo(() => {
        return students?.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus).length || 0;
    }, [students]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1 mb-2">
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Front Desk <span className="text-orange-500">Hub</span></h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Greetings, {displayName}! Welcoming the school community.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="Students Present" 
                    value={todayAttendance} 
                    icon={CheckCircle2} 
                    link="/dashboard/attendance" 
                    isLoading={isLoading} 
                    color="text-emerald-600" 
                    subtitle={`of ${activeStudentsCount} Active`}
                />
                <StatCard title="Today's Notices" value={announcements?.length || 0} icon={Megaphone} link="/dashboard/announcements" isLoading={isLoading} color="text-blue-600" />
                <StatCard title="Staff Directory" value="Active" icon={Users} link="/dashboard/staff-management-v2" isLoading={isLoading} color="text-purple-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b p-8">
                        <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Front Desk Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-3">
                        <QuickActionCard title="Global Search" description="Find students, staff, or parents" icon={Search} link="/dashboard" />
                        <QuickActionCard title="Take Attendance" description="Record daily student arrival" icon={CalendarCheck} link="/dashboard/attendance" />
                        <QuickActionCard title="Staff Clock-In" description="Record staff daily arrival" icon={UserCheck} link="/dashboard/attendance/staff" />
                        <QuickActionCard title="View Calendar" description="Check daily school events" icon={CalendarDays} link="/dashboard/calendar" />
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-orange-400">Live School Buzz</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                        {announcements?.slice(0, 4).map((a: any) => (
                            <ActivityItem 
                                key={a.id}
                                title={a.title}
                                description={a.content}
                                time={a.publishedAt ? formatDistanceToNow(a.publishedAt.toDate(), { addSuffix: true }) : 'Just now'}
                                icon={Megaphone}
                                iconColor="text-orange-400"
                            />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function AccountantDashboard({ profile, students, classes, records, tills, announcements, isLoading }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Accountant';

    const stats = useMemo(() => {
        if (!records || !students) return { totalOutstanding: 0, totalRevenue: 0, revenueByType: [] };
        
        // Unified Logic: Filter by Active Students and ignore Pending Reversals
        const activeStudents = students.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus);
        const activeStudentIds = new Set(activeStudents.map((s: any) => s.uid));
        const activeRecords = records.filter((r: any) => 
            activeStudentIds.has(r.studentId) && 
            r.status !== 'Pending Reversal'
        );

        let totalBilled = 0;
        let totalPaid = 0;
        let totalWaivers = 0;
        const types: Record<string, number> = {};

        activeRecords.forEach((r: any) => {
            const billed = Number(r.billedAmount) || 0;
            const paid = Number(r.amountPaid) || 0;
            const waiver = Number(r.waiverAmount) || 0;
            
            totalBilled += billed;
            totalPaid += paid;
            totalWaivers += waiver;

            if (paid > 0) {
                const type = r.type || 'Other';
                types[type] = (types[type] || 0) + paid;
            }
        });

        const revenueByType = Object.entries(types).map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        return { 
            totalOutstanding: totalBilled - totalPaid - totalWaivers, 
            totalRevenue: totalPaid, 
            revenueByType 
        };
    }, [records, students]);

    const activeTill = useMemo(() => tills?.find((t: any) => t.status === 'Open'), [tills]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Financial <span className="text-emerald-600">Command</span></h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Greetings, {displayName}! Tracking school liquidity.</p>
                </div>
                {activeTill && (
                    <Badge className="bg-emerald-600 text-white px-6 py-2 rounded-2xl flex items-center gap-3 shadow-xl shadow-emerald-200 animate-in slide-in-from-right-10">
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                        <span className="font-black text-xs uppercase tracking-widest">Live Till: GH₵{activeTill.currentBalance?.toFixed(2)}</span>
                    </Badge>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Outstanding Debt" value={`GH₵${Math.round(stats.totalOutstanding).toLocaleString()}`} icon={AlertCircle} link="/dashboard/accounts" isLoading={isLoading} color="text-rose-600" />
                <StatCard title="Total Collections" value={`GH₵${Math.round(stats.totalRevenue).toLocaleString()}`} icon={CheckCircle2} link="/dashboard/reports/financials" isLoading={isLoading} color="text-emerald-600" />
                <StatCard title="Active Students" value={students?.filter((s:any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus).length || 0} icon={Users} link="/dashboard/students-v3" isLoading={isLoading} color="text-blue-600" />
                <StatCard title="Payment Vouchers" value="--" icon={Receipt} link="/dashboard/finance/payment-vouchers" isLoading={isLoading} color="text-indigo-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-2xl rounded-[2.5rem] border-none bg-slate-900 text-white overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-400"/> Collection Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] p-8 pt-4">
                        {stats.revenueByType.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.revenueByType} layout="vertical" margin={{ left: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" fontSize={10} width={100} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                        formatter={(val: number) => [`GH₵${val.toLocaleString()}`, 'Amount']}
                                        contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                                        {stats.revenueByType.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4'][index % 5]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500 italic uppercase text-[10px] font-black tracking-[0.3em]">No collections detected</div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-8 pb-4 border-b">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Finance Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-3">
                            <Link href="/dashboard/finance/bulk-payments" className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-50 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-xl"><HandCoins className="h-4 w-4 text-emerald-600"/></div>
                                    <span className="text-sm font-black uppercase tracking-tight text-slate-700">Bulk Daily Receipts</span>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform"/>
                            </Link>
                            <Link href="/dashboard/accounts/cash-till" className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-50 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-xl"><Wallet className="h-4 w-4 text-indigo-600"/></div>
                                    <span className="text-sm font-black uppercase tracking-tight text-slate-700">Close Daily Till</span>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform"/>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function TransportStaffDashboard({ profile, routes, buses, students, announcements, isLoading }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Member';

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Transport <span className="text-indigo-600">Command</span></h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Greetings, {displayName}! Managing the morning rush.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Active Routes" value={routes?.length || 0} icon={RouteIcon} link="/dashboard/transport" isLoading={isLoading} color="text-indigo-600" />
                <StatCard title="Total Buses" value={buses?.length || 0} icon={BusIcon} link="/dashboard/transport" isLoading={isLoading} color="text-blue-600" />
                <StatCard title="Bus Students" value={students?.filter((s:any) => s.usesBusService).length || 0} icon={Users} link="/dashboard/transport" isLoading={isLoading} color="text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                    <CardHeader className="bg-indigo-600 text-white p-8">
                        <CardTitle className="text-xl font-black flex items-center gap-3 uppercase italic tracking-tight">Fleet Status</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-3">
                         {routes?.map((route: any) => {
                             const bus = buses?.find((b: any) => b.id === route.busId);
                             const studentCount = route.stops?.reduce((sum: number, stop: any) => sum + (stop.assignedStudentIds?.length || 0), 0) || 0;
                             return (
                                <div key={route.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-indigo-100 transition-all">
                                    <div>
                                        <p className="font-black text-slate-800 uppercase tracking-tight">{route.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{bus?.name || 'No Bus'}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline" className="bg-white">{studentCount} Students</Badge>
                                    </div>
                                </div>
                             )
                         })}
                         <Button asChild variant="ghost" className="w-full mt-4 text-indigo-600 font-black uppercase text-[10px]">
                             <Link href="/dashboard/transport">Manage All Routes</Link>
                         </Button>
                    </CardContent>
                </Card>

                 <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                    <CardHeader className="p-8">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tight text-indigo-400">Logistics Notices</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-4">
                         {announcements?.slice(0, 2).map((ann: any) => (
                             <div key={ann.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                 <h4 className="font-black text-xs uppercase tracking-tight text-white">{ann.title}</h4>
                                 <p className="text-[10px] font-medium leading-relaxed opacity-60 line-clamp-2">{ann.content}</p>
                             </div>
                         ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function SupportStaffDashboard({ profile, leaveRequests, announcements, isLoading, announcementsLoading }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Member';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1 mb-2">
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">Support <span className="text-indigo-600">Portal</span></h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Greetings, {displayName}! Your workplace companion.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                    title="My Leave Requests" 
                    value={leaveRequests?.length || 0} 
                    icon={FileText} 
                    link="/dashboard/hr/leave-management"
                    isLoading={isLoading}
                />
                <StatCard 
                    title="Attendance Status" 
                    value="Clock In/Out" 
                    icon={CalendarCheck} 
                    link="/dashboard/attendance/staff"
                    isLoading={isLoading}
                    color="text-emerald-600"
                />
                <StatCard 
                    title="Recent Announcements" 
                    value={announcements?.length || 0} 
                    icon={Megaphone}
                    link="/dashboard/announcements"
                    isLoading={isLoading}
                    color="text-orange-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50/50 p-8 border-b">
                        <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Welcome to your Portal</CardTitle>
                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick actions for your daily tasks.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-3">
                        <QuickActionCard 
                            title="Staff Clock In/Out" 
                            description="Record your daily arrival and departure"
                            icon={CalendarCheck} 
                            link="/dashboard/attendance/staff"
                        />
                        <QuickActionCard 
                            title="Request Time Off" 
                            description="Submit a new leave request to HR"
                            icon={CalendarCheck} 
                            link="/dashboard/hr/leave-management"
                        />
                        <QuickActionCard 
                            title="Read Announcements" 
                            description="Check the latest school news"
                            icon={Megaphone} 
                            link="/dashboard/announcements"
                        />
                        <QuickActionCard 
                            title="Messages" 
                            description="Contact administration or other staff"
                            icon={MessageSquare} 
                            link="/dashboard/messages"
                        />
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400">School Noticeboard</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                        {announcementsLoading ? (
                            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-400" /></div>
                        ) : null}
                        {!announcementsLoading && announcements?.length === 0 && (
                            <p className="text-sm text-slate-500 italic uppercase font-black tracking-widest text-center py-10">No recent announcements.</p>
                        )}
                        {announcements?.slice(0, 4).map((a: any) => (
                            <ActivityItem 
                                key={a.id}
                                title={a.title}
                                description={a.content}
                                time={a.publishedAt ? formatDistanceToNow(a.publishedAt.toDate(), { addSuffix: true }) : 'Just now'}
                                icon={Bell}
                                iconColor="text-indigo-400"
                            />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function TeacherDashboard({ profile, classes, isLoading }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Teacher';

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Academic <span className="text-indigo-600">Commander</span></h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Greetings, {displayName}! Empowering your students today.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Assigned Classes" value={classes?.length || 0} icon={School} link="/dashboard/academics" isLoading={isLoading} />
                <StatCard title="Pending Grading" value="--" icon={FileText} link="/dashboard/assignments" isLoading={isLoading} color="text-orange-500" />
                <StatCard title="Lesson Progress" value="65%" icon={Activity} link="/dashboard/lesson-planning" isLoading={isLoading} color="text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                    <CardHeader className="bg-indigo-600 text-white p-8">
                        <CardTitle className="text-xl font-black flex items-center gap-3 uppercase italic tracking-tight">Instructional Console</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/dashboard/attendance" className="p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group">
                            <CalendarCheck className="h-8 w-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform"/>
                            <p className="font-black text-slate-800 uppercase text-xs tracking-tight text-slate-800">Take Attendance</p>
                        </Link>
                        <Link href="/dashboard/lesson-planning" className="p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group">
                            <FileText className="h-8 w-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform"/>
                            <p className="font-black text-slate-800 uppercase text-xs tracking-tight text-slate-800">Lesson Planning</p>
                        </Link>
                        <Link href="/dashboard/academics/gradebook/manual-entry" className="p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group">
                            <TrendingUp className="h-8 w-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform"/>
                            <p className="font-black text-slate-800 uppercase text-xs tracking-tight text-slate-800">Grade Records</p>
                        </Link>
                        <Link href="/dashboard/assignments" className="p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group">
                            <PlusCircle className="h-8 w-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform"/>
                            <p className="font-black text-slate-800 uppercase text-xs tracking-tight text-slate-800">Create Quiz</p>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] bg-slate-900 border-none shadow-xl overflow-hidden text-white">
                    <CardHeader className="p-8">
                        <CardTitle className="text-xl font-black text-emerald-400 flex items-center gap-3 uppercase italic tracking-tight"><BrainCircuit /> Teacher AI Partner</CardTitle>
                        <CardDescription className="text-slate-400 font-bold">Instantly generate high-quality instructional content.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 flex flex-col gap-6">
                        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Strategy Insight</p>
                            <p className="text-sm font-medium leading-relaxed italic opacity-80">"Your Grade 5 class is struggling with 'Atoms'. Use the AI in Lesson Planning to create a hands-on activity."</p>
                        </div>
                        <Button asChild className="h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-xl">
                            <Link href="/dashboard/lesson-planning">OPEN AI ASSISTANT</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ParentDashboard({ profile, children, financials, announcements, isLoading, schoolSettings }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Parent';

    const totalOutstanding = useMemo(() => {
        if (!financials) return 0;
        return financials.reduce((sum: number, r: any) => {
            if (r.status === 'Pending Reversal' || r.status === 'Rejected Reversal') return sum;
            const balance = (Number(r.billedAmount) || 0) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0);
            return sum + Math.max(0, balance);
        }, 0);
    }, [financials]);

    const numberOfChildren = profile?.studentIds?.length || 1;
    const baseThreshold = Number(schoolSettings?.debtorLockThreshold) || 0;
    const maxAllowedDebt = baseThreshold * numberOfChildren;
    const isLockedOut = schoolSettings?.autoLockDebtors === true && totalOutstanding > maxAllowedDebt;

    if (isLockedOut) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-in zoom-in">
                <div className="bg-red-100 p-6 rounded-full mb-6">
                    <ShieldAlert className="h-16 w-16 text-red-600" />
                </div>
                <h1 className="text-3xl font-black text-slate-800 mb-2">Account Restricted</h1>
                <p className="text-lg text-slate-600 max-w-md mb-8 font-medium leading-relaxed">
                    Academic features have been temporarily restricted because your family's outstanding balance exceeds the allowed limit for your {numberOfChildren} enrolled {numberOfChildren === 1 ? 'child' : 'children'}.
                </p>
                <Card className="w-full max-w-sm border-none shadow-2xl rounded-[3rem] overflow-hidden">
                    <CardHeader className="bg-rose-600 text-white p-6 pb-4">
                        <CardTitle className="text-sm font-black uppercase tracking-widest opacity-60">Current Debt</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="text-4xl font-black text-slate-900 mb-6">GH₵ {totalOutstanding.toFixed(2)}</div>
                        <Button asChild className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-xl">
                            <Link href="/dashboard/my-bills">Pay Now to Restore Access</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Parent <span className="text-indigo-600">Portal</span></h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Greetings, {displayName}! Monitoring your children's journey.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Children Enrolled" value={children?.length || 0} icon={Users} link="/dashboard/my-children" isLoading={isLoading} color="text-blue-600" />
                <StatCard title="Fees Outstanding" value={`GH₵${totalOutstanding.toFixed(2)}`} icon={Banknote} link="/dashboard/my-bills" isLoading={isLoading} color="text-rose-600" />
                <StatCard title="Latest Grades" value="View All" icon={TrendingUp} link="/dashboard/my-grades" isLoading={isLoading} color="text-indigo-600" />
                <StatCard title="Certificates" value="--" icon={Award} link="/dashboard/my-reports" isLoading={isLoading} color="text-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                    <CardHeader className="p-8 border-b bg-slate-50/50">
                        <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-3"><Users className="text-indigo-600 h-5 w-5"/> My Family</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-3">
                        {children?.map((child: any) => (
                            <Link key={child.uid} href={`/dashboard/my-bills`} className="flex items-center justify-between p-5 rounded-2xl bg-white border-2 border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                        {child.firstName?.[0]}{child.lastName?.[0]}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-800 uppercase tracking-tight text-slate-800">{child.firstName} {child.lastName}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{child.classId || 'Unassigned'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="text-[9px] font-black bg-white border-slate-200 text-slate-800">92% Attendance</Badge>
                                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform"/>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                    <CardHeader className="p-8">
                        <CardTitle className="text-xl font-black uppercase italic tracking-tight text-indigo-400">School Bulletins</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-4">
                         {announcements?.slice(0, 3).map((ann: any) => (
                             <div key={ann.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                 <h4 className="font-black text-xs uppercase tracking-tight text-white">{ann.title}</h4>
                                 <p className="text-[10px] font-medium leading-relaxed opacity-60 line-clamp-2">{ann.content}</p>
                             </div>
                         ))}
                         <Button asChild variant="ghost" className="w-full text-indigo-400 font-black uppercase text-[10px] tracking-[0.2em] mt-2 text-white">
                             <Link href="/dashboard/announcements">VIEW FULL NOTICEBOARD</Link>
                         </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StudentDashboard({ profile }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Member';

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">HELLO, <span className="text-indigo-600">{displayName.toUpperCase()}!</span> 👋</h1>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Master of your learning destiny</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ClubCard title="MATHS" path="/dashboard/maths-club-v2" icon={Sigma} color="bg-orange-500" />
                <ClubCard title="SCIENCE" path="/dashboard/science-club-v2" icon={FlaskConical} color="bg-teal-500" />
                <ClubCard title="LITERACY" path="/dashboard/ela-club" icon={BookOpenCheck} color="bg-indigo-500" />
                <ClubCard title="CODING" path="/dashboard/coding-club" icon={Code} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                    <CardHeader className="bg-indigo-600 text-white p-8">
                        <CardTitle className="text-2xl font-black flex items-center gap-3 uppercase italic tracking-tight"><Clock className="h-6 w-6"/> My Portal</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid grid-cols-2 gap-4">
                        <Link href="/dashboard/my-grades" className="p-6 bg-slate-50 rounded-3xl border-2 border-transparent hover:border-indigo-500 transition-all group text-center">
                            <TrendingUp className="h-10 w-10 text-indigo-600 mx-auto mb-3 group-hover:scale-110 transition-transform"/>
                            <p className="font-black text-slate-800 uppercase text-xs tracking-widest text-slate-800">Live Grades</p>
                        </Link>
                        <Link href="/dashboard/my-reports" className="p-6 bg-slate-50 rounded-3xl border-2 border-transparent hover:border-indigo-500 transition-all group text-center">
                            <FileText className="h-10 w-10 text-indigo-600 mx-auto mb-3 group-hover:scale-110 transition-transform"/>
                            <p className="font-black text-slate-800 uppercase text-xs tracking-widest text-slate-800">Reports</p>
                        </Link>
                        <Link href="/dashboard/my-bills" className="p-6 bg-slate-50 rounded-3xl border-2 border-transparent hover:border-indigo-500 transition-all group text-center">
                            <Banknote className="h-10 w-10 text-indigo-600 mx-auto mb-3 group-hover:scale-110 transition-transform"/>
                            <p className="font-black text-slate-800 uppercase text-xs tracking-widest text-slate-800">Fees</p>
                        </Link>
                        <Link href="/dashboard/assignments" className="p-6 bg-slate-50 rounded-3xl border-2 border-transparent hover:border-indigo-500 transition-all group text-center">
                            <CalendarCheck className="h-10 w-10 text-indigo-600 mx-auto mb-3 group-hover:scale-110 transition-transform"/>
                            <p className="font-black text-slate-800 uppercase text-xs tracking-widest text-slate-800">My Tasks</p>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                    <CardHeader className="p-8">
                        <CardTitle className="text-2xl font-black flex items-center gap-3 text-emerald-400 uppercase italic tracking-tight"><Sparkles /> AI Study Buddy</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 flex flex-col items-center text-center gap-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse" />
                            <div className="relative bg-white/10 p-8 rounded-full border border-white/20"><BrainCircuit className="h-16 w-16 text-emerald-400"/></div>
                        </div>
                        <p className="text-slate-400 font-bold max-w-xs uppercase text-xs tracking-widest">Unlock your potential. Ask any academic question now.</p>
                        <Button asChild className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-lg rounded-[1.5rem] shadow-xl">
                            <Link href="/dashboard/study-club">TALK TO DR. GAM</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ClubCard({ title, path, icon: Icon, color }: any) {
    return (
        <Link href={path} className={cn("p-10 rounded-[3rem] shadow-xl hover:scale-105 active:scale-95 transition-all text-white flex flex-col items-center justify-center gap-6 border-b-8 border-black/10", color)}>
            <Icon className="h-14 w-14" />
            <span className="font-black tracking-[0.2em] text-sm">{title}</span>
        </Link>
    );
}

export default function DashboardClient() {
  const { role, profile, loading: roleLoading } = useRole();
  const firestore = useFirestore();
  const { user } = useUser();
  const { schoolId, loading: schoolLoading } = useCurrentSchool();

  const isStaff = ['Administrator', 'Director', 'Teacher', 'Accountant', 'Transport Staff', 'Librarian', 'Cook', 'Transport Staff', 'Cleaner', 'Security Officer', 'Secretary', 'Receptionist'].includes(role || '');
  const isParent = role === 'Parent';
  const isAccountant = role === 'Accountant';
  const isTransportStaff = role === 'Transport Staff';
  const isSecretary = role === 'Secretary';
  const isReceptionist = role === 'Receptionist';
  const isAdmin = ['Administrator', 'Director'].includes(role || '');
  const canListStaff = ['Administrator', 'Director', 'Accountant', 'Receptionist'].includes(role || '');
  const isSupportStaff = role === 'Cleaner' || role === 'Security Officer' || role === 'Cook' || role === 'Transport Staff';

  // Core Data Queries
  const schoolRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
  const { data: schoolData } = useDoc<any>(schoolRef);

  const schoolSettingsRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
  const { data: schoolSettings } = useDoc<any>(schoolSettingsRef);

  const studentsQuery = useMemoFirebase(() => (firestore && schoolId && (isStaff || isParent)) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isStaff, isParent]);
  const { data: students, isLoading: loadingStudents } = useCollection<Student>(studentsQuery);

  const staffQuery = useMemoFirebase(() => (firestore && schoolId && canListStaff) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, canListStaff]);
  const { data: staff, isLoading: loadingStaff } = useCollection(staffQuery);

  const classesQuery = useMemoFirebase(() => (firestore && schoolId && isStaff && !isSupportStaff && !isSecretary && !isReceptionist) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isStaff, isSupportStaff, isSecretary, isReceptionist]);
  const { data: classes, isLoading: loadingClasses } = useCollection(classesQuery);

  const recordsQuery = useMemoFirebase(() => (firestore && schoolId && (isAccountant || isAdmin || isParent)) ? query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isAccountant, isAdmin, isParent]);
  const { data: records, isLoading: loadingRecords } = useCollection(recordsQuery);

  const tillsQuery = useMemoFirebase(() => (firestore && schoolId && isAccountant) ? query(collection(firestore, 'tills'), where('schoolId', '==', schoolId), where('accountantId', '==', profile?.uid)) : null, [firestore, schoolId, isAccountant, profile?.uid]);
  const { data: tills, isLoading: loadingTills } = useCollection(tillsQuery);

  const attendanceQuery = useMemoFirebase(() => (firestore && schoolId && (isAdmin || isReceptionist || isSecretary)) ? query(collection(firestore, 'attendance'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isAdmin, isReceptionist, isSecretary]);
  const { data: attendance } = useCollection(attendanceQuery);

  const routesQuery = useMemoFirebase(() => (firestore && schoolId && isTransportStaff) ? query(collection(firestore, 'routes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isTransportStaff]);
  const { data: routes } = useCollection<Route>(routesQuery);

  const busesQuery = useMemoFirebase(() => (firestore && schoolId && isTransportStaff) ? query(collection(firestore, 'buses'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isTransportStaff]);
  const { data: buses } = useCollection<Bus>(busesQuery);

  const leaveQuery = useMemoFirebase(() => (firestore && user && schoolId && (isSupportStaff || isSecretary)) ? query(collection(firestore, 'leaveRequests'), where('schoolId', '==', schoolId), where('staffId', '==', user.uid)) : null, [firestore, user, schoolId, isSupportStaff, isSecretary]);
  const { data: leaveRequests, isLoading: loadingLeaves } = useCollection(leaveQuery);

  const parentStudentIds = useMemo(() => profile?.studentIds || [], [profile]);
  const parentChildren = useMemo(() => students?.filter(s => parentStudentIds.includes(s.uid)) || [], [students, parentStudentIds]);
  const parentFinancials = useMemo(() => records?.filter(r => parentStudentIds.includes(r.studentId)) || [], [records, parentStudentIds]);

  const assessmentsQuery = useMemoFirebase(() => (firestore && schoolId && role === 'Director') ? query(collection(firestore, 'assessments'), where('schoolId', '==', schoolId), limit(150)) : null, [firestore, schoolId, role]);
  const { data: recentAssessments } = useCollection(assessmentsQuery);

  const annQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId || !role) return null;
    let q = query(collection(firestore, 'announcements_v2'), where('schoolId', '==', schoolId), orderBy('publishedAt', 'desc'), limit(5));
    if (!isStaff && role) {
        q = query(q, where('audience', 'array-contains-any', ['Everybody', role]));
    }
    return q;
  }, [firestore, schoolId, role, isStaff]);
  const { data: announcements, isLoading: loadingAnnouncements } = useCollection(annQuery);

  const hasFinanceAccess = 
    role === 'Director' || 
    role === 'Accountant' || 
    (role === 'Administrator' && schoolSettings?.allowAdminFinanceAccess !== false) ||
    user?.email === 'jamesgambrah@gmail.com';

  const isLoading = roleLoading || schoolLoading;

  if (isLoading) {
    return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /></div>;
  }

  if (role === 'Director') {
    return <DirectorDashboard profile={profile} students={students} staff={staff} classes={classes} announcements={announcements} isLoading={loadingStudents || loadingStaff || loadingClasses} schoolData={schoolData} hasFinanceAccess={hasFinanceAccess} financialRecords={records} attendance={attendance} schoolId={schoolId} recentAssessments={recentAssessments} />;
  }

  if (role === 'Administrator') {
    return <AdminDashboard profile={profile} students={students} staff={staff} classes={classes} announcements={announcements} isLoading={loadingStudents || loadingStaff || loadingClasses} schoolData={schoolData} hasFinanceAccess={hasFinanceAccess} financialRecords={records} attendance={attendance} />;
  }

  if (role === 'Secretary') {
    return <SecretaryDashboard profile={profile} students={students} announcements={announcements} isLoading={loadingStudents} />;
  }

  if (role === 'Receptionist') {
    return <ReceptionistDashboard profile={profile} announcements={announcements} attendance={attendance} students={students} isLoading={loadingAnnouncements || loadingStudents} />;
  }

  if (role === 'Accountant') {
    return <AccountantDashboard profile={profile} students={students} classes={classes} records={records} tills={tills} announcements={announcements} isLoading={loadingStudents || loadingRecords || loadingTills} />;
  }

  if (isSupportStaff) {
    return <SupportStaffDashboard profile={profile} leaveRequests={leaveRequests} announcements={announcements} isLoading={loadingLeaves} announcementsLoading={loadingAnnouncements} />;
  }

  if (role === 'Teacher') {
    return <TeacherDashboard profile={profile} classes={classes} isLoading={loadingClasses} />;
  }

  if (role === 'Parent') {
    return <ParentDashboard profile={profile} children={parentChildren} financials={parentFinancials} announcements={announcements} isLoading={loadingStudents || loadingRecords} schoolSettings={schoolSettings} />;
  }

  return <StudentDashboard profile={profile} />;
}
