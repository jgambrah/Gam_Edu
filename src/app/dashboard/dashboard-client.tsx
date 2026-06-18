'use client';

import { useMemo, useState, useTransition, useCallback } from 'react';
import { useUser, useFirestore, useMemoFirebase, useDoc, useCollection } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, limit, doc, setDoc, serverTimestamp, getDocs } from 'firebase/firestore';
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
  Search,
  AlertTriangle,
  Send,
  BookOpen,
  Utensils,
  ChefHat,
  Trash2,
  ClipboardList,
  CheckSquare,
  Plus,
  Wrench,
  User,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateSchoolExecutiveBriefingAction } from '@/app/actions/insights-ai';
import { format, startOfDay, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Route, Bus, Stop, Student, Assessment } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { sendSchoolSMSAction } from '@/app/actions/sms';
import { StudentDisplay } from '@/components/student-display';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

function AdminDashboard({
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
}: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'staff' | 'financials' | 'system'>('overview');
  const [isAuditorOpen, setIsAuditorOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  const { user } = useUser();
  const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Administrator';

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

    let current = 0;
    let age30 = 0;
    let age60 = 0;
    let age90 = 0;

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

  const banners = useMemo(() => {
    const bannerMap = {
      overview: {
        gradient: "from-indigo-900 via-indigo-950 to-slate-900 border-indigo-500/20",
        title: "Administrative Operations Control",
        description: "Unified analytics dashboard compiling attendance, active student registration, and general school operations.",
        badge: "Operations Dashboard",
        badgeColor: "bg-indigo-500/20 text-indigo-300",
        icon: LayoutTemplate,
      },
      students: {
        gradient: "from-purple-900 via-purple-950 to-indigo-950 border-purple-500/20",
        title: "Student Registry & Classes",
        description: "Review active classes distribution, class sizes, room assignments, and student onboarding.",
        badge: "Student Dynamics",
        badgeColor: "bg-purple-500/20 text-purple-300",
        icon: GraduationCap,
      },
      staff: {
        gradient: "from-blue-900 via-blue-950 to-indigo-950 border-blue-500/20",
        title: "Staffing & Faculty Control",
        description: "View teacher directory, roles allocations, performance appraisal reviews, and ratios.",
        badge: "Staff Intelligence",
        badgeColor: "bg-blue-500/20 text-blue-300",
        icon: Users,
      },
      financials: {
        gradient: "from-emerald-950 via-slate-900 to-indigo-950 border-emerald-500/20",
        title: "Tuition Fees & Payments Ledger",
        description: "Billed tuition pipeline, collections progress, receivable aging, and accounting summaries.",
        badge: "Financial Health",
        badgeColor: "bg-emerald-500/20 text-emerald-300",
        icon: Banknote,
      },
      system: {
        gradient: "from-slate-900 via-slate-950 to-indigo-950 border-slate-700/20",
        title: "Notice Board & System Control",
        description: "Global broadcasts, public website visibility slug checks, and security event logs audit.",
        badge: "System Operations",
        badgeColor: "bg-amber-500/20 text-amber-300",
        icon: Megaphone,
      }
    };
    return bannerMap[activeTab];
  }, [activeTab]);

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
            <span className="text-[9px] font-black tracking-[0.25em] bg-indigo-500/10 text-indigo-600 px-3.5 py-1.5 rounded-full uppercase">Administrator Suite</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Operations <span className="text-indigo-600">Console</span></h1>
        </div>
        
        {/* Navigation & Controls */}
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          {/* Custom Tab Bar */}
          <div className="flex p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-inner">
            {(['overview', 'students', 'staff', 'financials', 'system'] as const).map((tab) => {
              if (tab === 'financials' && !hasFinanceAccess) return null;
              return (
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
              );
            })}
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
      <div className={cn("relative p-8 xl:p-10 rounded-[2rem] text-white border-b-8 border-black/10 overflow-hidden shadow-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border bg-gradient-to-r transition-all duration-500", banners.gradient)}>
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
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Stat Cards Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <DirectorStatCard 
                title="Active Student Body" 
                value={activeStudents.length} 
                icon={GraduationCap} 
                link="/dashboard/students-v3" 
                isLoading={isLoading}
                subtitle={`${attendanceRate}% Present Today`} 
                color="text-indigo-600"
                glowColor="rgba(99, 102, 241, 0.08)"
              />
              <DirectorStatCard 
                title="Faculty & Staff" 
                value={totalStaff} 
                icon={Users} 
                link="/dashboard/staff-management-v2" 
                isLoading={isLoading}
                color="text-purple-600"
                subtitle={`Student-Teacher Ratio: ${studentTeacherRatio}:1`} 
                glowColor="rgba(168, 85, 247, 0.08)"
              />
              <DirectorStatCard 
                title="Revenue Health" 
                value={hasFinanceAccess ? `${financials.collectionRate}%` : "Restricted"} 
                icon={Banknote} 
                link={hasFinanceAccess ? "/dashboard/accounts" : "#"} 
                isLoading={isLoading}
                color="text-emerald-600"
                subtitle={hasFinanceAccess ? "Collection Target" : "Operational Finance"} 
                glowColor="rgba(16, 185, 129, 0.08)"
              />
              <DirectorStatCard 
                title="Live Bulletins" 
                value={announcementsCount} 
                icon={Megaphone} 
                link="/dashboard/announcements" 
                isLoading={isLoading}
                color="text-amber-500"
                subtitle="Broadcast Notices" 
                glowColor="rgba(245, 158, 11, 0.08)"
              />
            </div>

            {/* Operations Dashboard Control Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Enrollment Balance */}
              <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden flex flex-col justify-between hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.05)] transition-all duration-300">
                <CardHeader className="bg-slate-50/50 p-8 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Enrollment Dynamics</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Total active students distributed by class</CardDescription>
                    </div>
                    <Button asChild variant="ghost" size="sm" className="text-indigo-600 font-black uppercase text-[10px]">
                      <Link href="/dashboard/reports/enrollment">Full Audit <ArrowUpRight className="ml-1 h-3 w-3"/></Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="h-[320px] p-8">
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

              {/* Right Column: Quick Shortcuts */}
              <div className="flex flex-col gap-6">
                <Card className="rounded-[2.5rem] bg-indigo-950 text-white border-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] relative overflow-hidden flex-1 group">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-indigo-950 to-indigo-950 z-0" />
                  <CardHeader className="p-8 pb-4 relative z-10">
                    <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400">Operations Control</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-4 relative z-10">
                    <Link href="/dashboard/students-v3" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-350 group/item hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-xl group-hover/item:scale-105 transition-transform"><PlusCircle className="h-4 w-4 text-indigo-300"/></div>
                        <span className="text-sm font-bold uppercase tracking-tight text-white">Onboard Student</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/20 group-hover/item:translate-x-1 transition-transform"/>
                    </Link>
                    <Link href="/dashboard/academics/gradebook/manual-entry" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-350 group/item hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-xl group-hover/item:scale-105 transition-transform"><FileText className="h-4 w-4 text-orange-300"/></div>
                        <span className="text-sm font-bold uppercase tracking-tight text-white">Audit Gradebook</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/20 group-hover/item:translate-x-1 transition-transform"/>
                    </Link>
                    <Link href="/dashboard/admin/migration" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-350 group/item hover:-translate-y-0.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-xl group-hover/item:scale-105 transition-transform"><Database className="h-4 w-4 text-emerald-300"/></div>
                        <span className="text-sm font-bold uppercase tracking-tight text-white">Data Import Hub</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/20 group-hover/item:translate-x-1 transition-transform"/>
                    </Link>
                  </CardContent>
                </Card>

                {/* AI Token Balance Card */}
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
                    Each school health briefing requires 5 credits. Ask support to top up tokens.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Student statistics row */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:border-purple-200/50 transition-all duration-300">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Enrollment</p>
                  <h4 className="text-2xl font-black text-slate-800 mt-2">{activeStudents.length} Students</h4>
                  <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Official School Registry</p>
                </div>
                <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl"><GraduationCap className="h-5 w-5" /></div>
              </div>

              <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:border-emerald-200/50 transition-all duration-300">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Attendance Pulse</p>
                  <h4 className="text-2xl font-black text-slate-800 mt-2">{attendanceRate}%</h4>
                  <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Today's Present Log</p>
                </div>
                <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle2 className="h-5 w-5" /></div>
              </div>

              <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:border-amber-200/50 transition-all duration-300">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Average Class size</p>
                  <h4 className="text-2xl font-black text-slate-800 mt-2">
                    {classes?.length ? Math.round(activeStudents.length / classes.length) : 0} Students
                  </h4>
                  <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Grade Midpoint</p>
                </div>
                <div className="p-3.5 bg-amber-50 text-amber-500 rounded-2xl"><School className="h-5 w-5" /></div>
              </div>
            </div>

            {/* Class break-down lists */}
            <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Class Breakdown & Room Audit</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Review sizes and class details</CardDescription>
                </div>
                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-[10px] uppercase h-8 px-4">
                  <Link href="/dashboard/classes">Manage Classes</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {classes?.map((c: any) => {
                  const size = students?.filter((s: any) => s.classId === c.id && (s.enrollmentStatus === 'Active' || !s.enrollmentStatus)).length || 0;
                  return (
                    <div key={c.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
                      <div>
                        <p className="font-black text-slate-800 uppercase tracking-tight text-sm">{c.name}</p>
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

        {activeTab === 'staff' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Staff statistics row */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:border-purple-200/50 transition-all duration-300">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Workforce</p>
                  <h4 className="text-2xl font-black text-slate-800 mt-2">{totalStaff} Members</h4>
                  <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Official Employee Register</p>
                </div>
                <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl"><Users className="h-5 w-5" /></div>
              </div>

              <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:border-indigo-200/50 transition-all duration-300">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Student-Teacher Ratio</p>
                  <h4 className="text-2xl font-black text-slate-800 mt-2">{studentTeacherRatio}:1</h4>
                  <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Teaching Workload</p>
                </div>
                <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl"><TrendingUp className="h-5 w-5" /></div>
              </div>

              <div className="p-6 bg-white border border-slate-100/80 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:border-amber-200/50 transition-all duration-300">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Teachers</p>
                  <h4 className="text-2xl font-black text-slate-800 mt-2">
                    {staff?.filter((s: any) => s.role === 'Teacher')?.length || 0} Faculty
                  </h4>
                  <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Classroom Instructors</p>
                </div>
                <div className="p-3.5 bg-amber-50 text-amber-500 rounded-2xl"><Award className="h-5 w-5" /></div>
              </div>
            </div>

            {/* Staff list cards */}
            <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Faculty & Staff Directory</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Review workforce members and roles</CardDescription>
                </div>
                <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-[10px] uppercase h-8 px-4">
                  <Link href="/dashboard/staff-management-v2">Manage Staff</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {staff?.slice(0, 9).map((s: any) => (
                  <div key={s.id || s.uid} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
                    <div className="min-w-0 flex-1 mr-3">
                      <p className="font-black text-slate-800 uppercase tracking-tight text-sm truncate">{s.firstName || s.name} {s.lastName || ''}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{s.role || 'Staff Member'}</p>
                      {s.email && <p className="text-[9px] text-slate-400 truncate mt-1">{s.email}</p>}
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-800 border-none font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">{s.status || 'Active'}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'financials' && hasFinanceAccess && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Financial Stats Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition-all duration-300">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gross Billed Capital</p>
                <h4 className="text-xl font-black text-slate-800 mt-2">GH₵ {financials.totalBilled.toLocaleString()}</h4>
                <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Initial Target Billed</p>
              </div>
              <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest font-bold">Total Liquid Receipts</p>
                <h4 className="text-xl font-black text-slate-800 mt-2">GH₵ {financials.totalRevenue.toLocaleString()}</h4>
                <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Deposited & Cleared</p>
              </div>
              <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md hover:border-rose-200 transition-all duration-300">
                <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest font-bold">Outstanding Receivables</p>
                <h4 className="text-xl font-black text-slate-800 mt-2">GH₵ {financials.totalOutstanding.toLocaleString()}</h4>
                <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">Outstanding parental debt</p>
              </div>
              <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md hover:border-indigo-200 transition-all duration-300">
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
                <CardContent className="h-[280px] p-8">
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

        {activeTab === 'system' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Bulletin timeline */}
              <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 p-8 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Global Announcements & Noticeboard</CardTitle>
                      <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Broadcasting updates to classes, parents and teachers</CardDescription>
                    </div>
                    <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-[10px] uppercase h-8 px-4">
                      <Link href="/dashboard/announcements">Post Announcement</Link>
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

              {/* Public visibility settings & shortcuts */}
              <div className="space-y-6">
                <Card className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Web Visibility Settings</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-normal mb-6">
                    Audit school visibility slug and public portals configurations directly from dashboard profiles.
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
                  <h4 className="text-sm font-black uppercase tracking-widest text-indigo-300 mb-4">Security Logs</h4>
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
          <div 
            onClick={() => setIsAuditorOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
          />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[radial-gradient(circle_at_top_right,_rgba(30,27,75,0.4),_rgba(3,7,18,0.99))] bg-slate-950/98 backdrop-blur-2xl border-l border-indigo-500/15 shadow-2xl z-50 flex flex-col justify-between text-white animate-in slide-in-from-right duration-300">
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

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {isPending ? (
                <div className="space-y-6 py-10">
                  <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-30 animate-pulse" />
                      <Loader2 className="h-10 w-10 animate-spin text-indigo-400 relative z-10" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300 animate-pulse">Running operations diagnostic...</p>
                  </div>
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
                    <h4 className="font-black uppercase tracking-widest text-sm text-slate-200">Run Operations Health Audit</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase max-w-xs mt-2 leading-relaxed">
                      Run the executive school auditor. Generates a live analysis of financial pipelines, academic skews, workload warnings and insights.
                    </p>
                  </div>
                </div>
              )}
            </div>

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
                    {auditResult ? 'Re-run Operations Audit' : 'Run Operations Audit'}
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
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();
    const [isOpeningTill, setIsOpeningTill] = useState(false);
    const [sendingSMSStudentId, setSendingSMSStudentId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'summary' | 'debtors' | 'aging' | 'classPace'>('summary');

    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Accountant';

    const handleOpenTill = useCallback(async () => {
        if (!user || !schoolId || !firestore) return;
        setIsOpeningTill(true);
        try {
            const newTillRef = doc(collection(firestore, 'tills'));
            await setDoc(newTillRef, {
                accountantId: user.uid,
                accountantName: user.displayName || user.email,
                openingBalance: 0,
                currentBalance: 0,
                closingBalance: null,
                dateOpened: serverTimestamp(),
                dateClosed: null,
                status: 'Open',
                directorApproval: { directorId: null, directorName: null, approvedAt: null },
                schoolId: schoolId,
            });
            toast({ title: 'Success', description: 'New till opened for the day.' });
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to open till: ' + e.message });
        } finally {
            setIsOpeningTill(false);
        }
    }, [user, schoolId, firestore, toast]);

    const activeTill = useMemo(() => tills?.find((t: any) => t.status === 'Open'), [tills]);

    const stats = useMemo(() => {
        if (!records || !students) return { totalOutstanding: 0, totalRevenue: 0, outstandingTuition: 0, outstandingCanteen: 0, outstandingTransport: 0, otherDebt: 0, revenueByType: [] };
        
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
        let outstandingTuition = 0;
        let outstandingCanteen = 0;
        let outstandingTransport = 0;
        let otherDebt = 0;
        const types: Record<string, number> = {};

        activeRecords.forEach((r: any) => {
            const billed = Number(r.billedAmount) || 0;
            const paid = Number(r.amountPaid) || 0;
            const waiver = Number(r.waiverAmount) || 0;
            const balance = billed - paid - waiver;
            
            totalBilled += billed;
            totalPaid += paid;
            totalWaivers += waiver;

            if (paid > 0) {
                const type = r.type || 'Other';
                types[type] = (types[type] || 0) + paid;
            }

            if (balance > 0) {
                const typeLower = (r.type || '').toLowerCase();
                if (typeLower.includes('tuition')) outstandingTuition += balance;
                else if (typeLower.includes('canteen')) outstandingCanteen += balance;
                else if (typeLower.includes('transport')) outstandingTransport += balance;
                else otherDebt += balance;
            }
        });

        const revenueByType = Object.entries(types).map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        return { 
            totalOutstanding: totalBilled - totalPaid - totalWaivers, 
            totalRevenue: totalPaid, 
            outstandingTuition,
            outstandingCanteen,
            outstandingTransport,
            otherDebt,
            revenueByType 
        };
    }, [records, students]);

    const collectionRate = useMemo(() => {
        const total = stats.totalRevenue + stats.totalOutstanding;
        return total > 0 ? (stats.totalRevenue / total) * 105 : 100; // Match visually or default
    }, [stats]);

    const displayCollectionRate = useMemo(() => {
        const total = stats.totalRevenue + stats.totalOutstanding;
        return total > 0 ? (stats.totalRevenue / total) * 100 : 100;
    }, [stats]);

    const categoryCollections = useMemo(() => {
        if (!records || !students) return [];
        
        const activeStudents = students.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus);
        const activeStudentIds = new Set(activeStudents.map((s: any) => s.uid));
        const activeRecords = records.filter((r: any) => activeStudentIds.has(r.studentId) && r.status !== 'Pending Reversal');
        
        const categories: Record<string, { billed: number, paid: number, waived: number }> = {
            'Tuition': { billed: 0, paid: 0, waived: 0 },
            'Canteen': { billed: 0, paid: 0, waived: 0 },
            'Transport': { billed: 0, paid: 0, waived: 0 },
            'PTA Levy': { billed: 0, paid: 0, waived: 0 },
            'Other': { billed: 0, paid: 0, waived: 0 }
        };
        
        activeRecords.forEach((r: any) => {
            const type = (r.type || '').toLowerCase();
            let cat = 'Other';
            if (type.includes('tuition')) cat = 'Tuition';
            else if (type.includes('canteen')) cat = 'Canteen';
            else if (type.includes('transport')) cat = 'Transport';
            else if (type.includes('pta')) cat = 'PTA Levy';
            
            categories[cat].billed += Number(r.billedAmount) || 0;
            categories[cat].paid += Number(r.amountPaid) || 0;
            categories[cat].waived += Number(r.waiverAmount) || 0;
        });
        
        return Object.entries(categories).map(([name, statsData]) => {
            const netBilled = statsData.billed - statsData.waived;
            const rate = netBilled > 0 ? (statsData.paid / netBilled) * 100 : 100;
            return {
                name,
                billed: statsData.billed,
                paid: statsData.paid,
                waived: statsData.waived,
                outstanding: Math.max(0, netBilled - statsData.paid),
                rate
            };
        });
    }, [records, students]);

    const studentFinancials = useMemo(() => {
        if (!records || !students) return [];
        
        const activeStudents = students.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus);
        const recordsByStudent: Record<string, any[]> = {};
        records.forEach((r: any) => { 
            if (!recordsByStudent[r.studentId]) recordsByStudent[r.studentId] = []; 
            recordsByStudent[r.studentId].push(r); 
        });
        
        return activeStudents.map((student: any) => {
            const studentRecords = recordsByStudent[student.uid] || [];
            const activeRecords = studentRecords.filter((r: any) => r.status !== 'Pending Reversal');
            const totalBilled = activeRecords.reduce((acc: number, r: any) => acc + (Number(r.billedAmount) || 0), 0);
            const totalPaid = activeRecords.reduce((acc: number, r: any) => acc + (Number(r.amountPaid) || 0) + (Number(r.waiverAmount) || 0), 0);
            return { 
                student, 
                balance: totalBilled - totalPaid, 
                records: studentRecords 
            };
        }).sort((a: any, b: any) => b.balance - a.balance);
    }, [records, students]);

    const topDebtors = useMemo(() => {
        return studentFinancials
            .filter((sf: any) => sf.balance > 0.01)
            .slice(0, 5);
    }, [studentFinancials]);

    const getOldestOverdueDays = useCallback((studentRecords: any[]) => {
        const unpaidOrOverdue = studentRecords.filter(r => 
            (r.status === 'Unpaid' || r.status === 'Overdue') && 
            (r.billedAmount - (r.amountPaid || 0) - (r.waiverAmount || 0) > 0.01)
        );
        if (unpaidOrOverdue.length === 0) return 0;
        
        const oldestDueDate = unpaidOrOverdue.reduce((oldest, current) => {
            const currentD = current.dueDate?.toDate ? current.dueDate.toDate() : new Date(current.dueDate);
            const oldestD = oldest.dueDate?.toDate ? oldest.dueDate.toDate() : new Date(oldest.dueDate);
            return currentD < oldestD ? current : oldest;
        });
        
        const oldestD = oldestDueDate.dueDate?.toDate ? oldestDueDate.dueDate.toDate() : new Date(oldestDueDate.dueDate);
        const diffTime = new Date().getTime() - oldestD.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }, []);

    const handleSendOverallSMSReminder = useCallback(async (studentId: string, studentName: string, balance: number) => {
        if (!firestore || !schoolId) return;
        setSendingSMSStudentId(studentId);
        try {
            const parentQ = query(collection(firestore, 'parents'), where('schoolId', '==', schoolId), where('studentIds', 'array-contains', studentId));
            const pSnap = await getDocs(parentQ);
            if (pSnap.empty) {
                toast({ variant: 'destructive', title: "No Parent Found", description: "No parent record is linked to this student." });
                return;
            }
            const parentData = pSnap.docs[0].data();
            const phone = parentData.phone;
            if (!phone) {
                toast({ variant: 'destructive', title: "No Phone Number", description: "Parent record has no phone number." });
                return;
            }

            const msg = `Dear Parent, you have an outstanding balance of GHS ${balance.toFixed(2)} for ${studentName}. Please log in to your Parent Portal to view bills and pay online. - GAM Edu`;
            
            toast({ title: "Sending SMS Reminder...", description: `Sending to ${phone}` });
            const result = await sendSchoolSMSAction(schoolId, phone, msg);
            
            if (result.success) {
                toast({ title: "Reminder Sent!", description: "Parent has been notified successfully." });
            } else {
                throw new Error(result.error);
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Failed to send SMS", description: e.message });
        } finally {
            setSendingSMSStudentId(null);
        }
    }, [firestore, schoolId, toast]);

    const debtAgingStats = useMemo(() => {
        if (!records || !students) return { current: 0, age30: 0, age60: 0, age90: 0, total: 0 };
        
        const activeStudents = students.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus);
        const activeStudentIds = new Set(activeStudents.map((s: any) => s.uid));
        const today = startOfDay(new Date());

        let current = 0;
        let age30 = 0;
        let age60 = 0;
        let age90 = 0;

        records.forEach((r: any) => {
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
    }, [records, students]);

    const classCollectionsStats = useMemo(() => {
        if (!records || !students || !classes) return [];

        const activeStudents = students.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus);
        const studentsByClass: Record<string, any[]> = {};
        activeStudents.forEach((s: any) => {
            if (!studentsByClass[s.classId]) studentsByClass[s.classId] = [];
            studentsByClass[s.classId].push(s);
        });

        const recordsByStudent: Record<string, any[]> = {};
        records.forEach((r: any) => {
            if (!recordsByStudent[r.studentId]) recordsByStudent[r.studentId] = [];
            recordsByStudent[r.studentId].push(r);
        });

        return classes.map((c: any) => {
            const classStudents = studentsByClass[c.id] || [];
            let totalBilled = 0;
            let totalPaid = 0;
            let totalWaivers = 0;

            classStudents.forEach((s: any) => {
                const studentRecs = recordsByStudent[s.uid] || [];
                studentRecs.forEach((r: any) => {
                    if (r.status === 'Pending Reversal') return;
                    totalBilled += Number(r.billedAmount) || 0;
                    totalPaid += Number(r.amountPaid) || 0;
                    totalWaivers += Number(r.waiverAmount) || 0;
                });
            });

            const netBilled = totalBilled - totalWaivers;
            const outstanding = netBilled - totalPaid;
            const rate = netBilled > 0 ? (totalPaid / netBilled) * 100 : 100;

            return {
                classId: c.id,
                className: c.name,
                studentCount: classStudents.length,
                totalBilled,
                totalPaid,
                totalWaivers,
                outstanding: outstanding > 0 ? outstanding : 0,
                rate
            };
        }).sort((a: any, b: any) => b.rate - a.rate);
    }, [records, students, classes]);

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
                {/* Advisory Desk */}
                <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-3 mb-4">
                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Collections Advisory Desk</h3>
                        <div className="flex p-0.5 bg-slate-100 rounded-lg border">
                            {(['summary', 'debtors', 'aging', 'classPace'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "text-xs px-3 py-1 rounded-md font-semibold transition-all",
                                        activeTab === tab 
                                            ? "bg-white text-emerald-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-800"
                                    )}
                                >
                                    {tab === 'summary' ? 'Summary' :
                                     tab === 'debtors' ? 'Aged Debt' :
                                     tab === 'aging' ? 'Aging' : 'Class Pace'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === 'summary' && (
                        <div className="space-y-6 animate-in fade-in-50">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Card className="border-l-4 border-l-rose-500 bg-slate-50/20 shadow-none">
                                  <CardHeader className="p-4 pb-1 flex flex-row justify-between items-center space-y-0">
                                    <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase">Tuition Debt</CardTitle>
                                    <BookOpen className="h-4 w-4 text-rose-500" />
                                  </CardHeader>
                                  <CardContent className="p-4 pt-1">
                                    <div className="text-lg font-bold text-slate-800">GH₵{stats.outstandingTuition.toFixed(2)}</div>
                                  </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-orange-500 bg-slate-50/20 shadow-none">
                                  <CardHeader className="p-4 pb-1 flex flex-row justify-between items-center space-y-0">
                                    <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase">Canteen Debt</CardTitle>
                                    <Utensils className="h-4 w-4 text-orange-500" />
                                  </CardHeader>
                                  <CardContent className="p-4 pt-1">
                                    <div className="text-lg font-bold text-slate-800">GH₵{stats.outstandingCanteen.toFixed(2)}</div>
                                  </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-amber-500 bg-slate-50/20 shadow-none">
                                  <CardHeader className="p-4 pb-1 flex flex-row justify-between items-center space-y-0">
                                    <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase">Transport Debt</CardTitle>
                                    <BusIcon className="h-4 w-4 text-amber-500" />
                                  </CardHeader>
                                  <CardContent className="p-4 pt-1">
                                    <div className="text-lg font-bold text-slate-800">GH₵{stats.outstandingTransport.toFixed(2)}</div>
                                  </CardContent>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6 pt-6 border-t border-slate-100">
                                {/* SVG Target Collection Gauge */}
                                <div className="md:col-span-2 flex flex-col items-center justify-center text-center p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4">Overall Target Pace</h4>
                                    <div className="relative flex items-center justify-center h-32 w-32">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="52"
                                                className="stroke-slate-200 fill-none"
                                                strokeWidth="10"
                                            />
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="52"
                                                className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
                                                strokeWidth="10"
                                                strokeDasharray={2 * Math.PI * 52}
                                                strokeDashoffset={2 * Math.PI * 52 - (displayCollectionRate / 100) * (2 * Math.PI * 52)}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center justify-center">
                                            <span className="text-2xl font-black text-slate-800 font-mono">{displayCollectionRate.toFixed(1)}%</span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Collected</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 max-w-[240px]">
                                        <p className="text-[11px] font-medium text-slate-500 leading-normal">
                                            {displayCollectionRate >= 80 ? (
                                                "Excellent collection health. Continue regular cash auditing."
                                            ) : displayCollectionRate >= 55 ? (
                                                "Moderate collection health. Trigger reminders for aging accounts."
                                            ) : (
                                                "Urgent attention needed. Overall collection rate is critical."
                                            )}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Category Collections Pace */}
                                <div className="md:col-span-3 space-y-4">
                                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Fee Stream Performance</h4>
                                    <div className="space-y-3">
                                        {categoryCollections.map(cat => {
                                            const color = cat.rate >= 80 ? 'bg-emerald-500' : cat.rate >= 50 ? 'bg-amber-500' : 'bg-rose-500';
                                            const textColor = cat.rate >= 80 ? 'text-emerald-700' : cat.rate >= 50 ? 'text-amber-700' : 'text-rose-700';
                                            return (
                                                <div key={cat.name} className="space-y-1">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="font-semibold text-slate-700">{cat.name}</span>
                                                        <span className={cn("font-bold font-mono", textColor)}>{cat.rate.toFixed(1)}% ({cat.outstanding > 0 ? `GH₵${cat.outstanding.toFixed(0)} owed` : 'Settled'})</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                        <div 
                                                            className={cn("h-full transition-all duration-500", color)}
                                                            style={{ width: `${Math.min(cat.rate, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'debtors' && (
                        <div className="space-y-4 animate-in fade-in-50">
                            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <AlertTriangle className="h-4 w-4 text-rose-500" /> Actionable Aged Debt Reminders
                                </h4>
                                <p className="text-xs text-slate-500 leading-normal">
                                    The following students have the largest outstanding balances. Click the SMS button to send parent reminder messages.
                                </p>
                            </div>
                            
                            <div className="grid gap-3 max-h-[360px] overflow-y-auto pr-1">
                                {topDebtors.map(({ student, balance, records: studentRecs }: any) => {
                                    const overdueDays = getOldestOverdueDays(studentRecs);
                                    const isSending = sendingSMSStudentId === student.uid;
                                    
                                    return (
                                        <div key={student.uid} className="bg-white border hover:border-slate-350 p-3.5 rounded-xl shadow-sm hover:shadow transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="flex items-center gap-3">
                                                <StudentDisplay student={student} variant="compact" />
                                                <div className="hidden sm:block border-l pl-3 py-1">
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Oldest Aging</p>
                                                    <p className={cn("text-xs font-semibold mt-0.5", overdueDays > 30 ? "text-rose-600" : "text-slate-500")}>
                                                        {overdueDays > 0 ? `${overdueDays} Days Overdue` : "Current"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                                                <div className="text-left sm:text-right">
                                                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Outstanding</p>
                                                    <p className="text-md font-extrabold text-rose-600 font-mono">
                                                        GH₵{balance.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="h-9 px-3 text-xs text-blue-600 border-blue-200 hover:bg-blue-50/50"
                                                        asChild
                                                    >
                                                        <Link href={`/dashboard/accounts?search=${student.firstName}+${student.lastName}`}>
                                                            View Ledger
                                                        </Link>
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        className="h-9 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white animate-in fade-in"
                                                        disabled={isSending}
                                                        onClick={() => handleSendOverallSMSReminder(student.uid, `${student.firstName} ${student.lastName}`, balance)}
                                                    >
                                                        {isSending ? (
                                                            <>
                                                                <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> Sending...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Send className="h-3 w-3 mr-1.5" /> Send Reminder
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {topDebtors.length === 0 && (
                                    <div className="text-center py-10 text-muted-foreground italic text-xs">
                                        All accounts are in good standing! No outstanding debt found.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'aging' && (
                        <div className="space-y-4 animate-in fade-in-50">
                            <div className="h-5 flex rounded-lg overflow-hidden bg-slate-100 border shadow-inner">
                                {debtAgingStats.total > 0 ? (
                                    <>
                                        {debtAgingStats.current > 0 && (
                                            <div 
                                                style={{ width: `${(debtAgingStats.current / debtAgingStats.total) * 100}%` }} 
                                                className="bg-emerald-500 transition-all duration-500 hover:opacity-90"
                                                title={`Current: GH₵ ${debtAgingStats.current.toFixed(2)}`}
                                            />
                                        )}
                                        {debtAgingStats.age30 > 0 && (
                                            <div 
                                                style={{ width: `${(debtAgingStats.age30 / debtAgingStats.total) * 100}%` }} 
                                                className="bg-amber-400 transition-all duration-500 hover:opacity-90"
                                                title={`1-30 Days Overdue: GH₵ ${debtAgingStats.age30.toFixed(2)}`}
                                            />
                                        )}
                                        {debtAgingStats.age60 > 0 && (
                                            <div 
                                                style={{ width: `${(debtAgingStats.age60 / debtAgingStats.total) * 100}%` }} 
                                                className="bg-orange-500 transition-all duration-500 hover:opacity-90"
                                                title={`31-60 Days Overdue: GH₵ ${debtAgingStats.age60.toFixed(2)}`}
                                            />
                                        )}
                                        {debtAgingStats.age90 > 0 && (
                                            <div 
                                                style={{ width: `${(debtAgingStats.age90 / debtAgingStats.total) * 100}%` }} 
                                                className="bg-rose-600 transition-all duration-500 hover:opacity-90"
                                                title={`61+ Days Overdue: GH₵ ${debtAgingStats.age90.toFixed(2)}`}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full bg-slate-100 flex items-center justify-center text-xs text-muted-foreground italic">No Outstanding Debt</div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="p-3 border-l-4 border-l-emerald-500 bg-slate-50/20 shadow-none">
                                    <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Current</p>
                                    <p className="text-lg font-bold text-slate-800 mt-1">GH₵{debtAgingStats.current.toFixed(2)}</p>
                                    <p className="text-[10px] text-muted-foreground">{debtAgingStats.total > 0 ? ((debtAgingStats.current / debtAgingStats.total) * 100).toFixed(1) : 0}% of debt</p>
                                </Card>
                                <Card className="p-3 border-l-4 border-l-amber-400 bg-slate-50/20 shadow-none">
                                    <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3 text-amber-500" /> 1 - 30 Days</p>
                                    <p className="text-lg font-bold text-amber-700 mt-1">GH₵{debtAgingStats.age30.toFixed(2)}</p>
                                    <p className="text-[10px] text-muted-foreground">{debtAgingStats.total > 0 ? ((debtAgingStats.age30 / debtAgingStats.total) * 100).toFixed(1) : 0}% of debt</p>
                                </Card>
                                <Card className="p-3 border-l-4 border-l-orange-500 bg-slate-50/20 shadow-none">
                                    <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3 text-orange-500" /> 31 - 60 Days</p>
                                    <p className="text-lg font-bold text-orange-700 mt-1">GH₵{debtAgingStats.age60.toFixed(2)}</p>
                                    <p className="text-[10px] text-muted-foreground">{debtAgingStats.total > 0 ? ((debtAgingStats.age60 / debtAgingStats.total) * 100).toFixed(1) : 0}% of debt</p>
                                </Card>
                                <Card className="p-3 border-l-4 border-l-rose-600 bg-slate-50/20 shadow-none">
                                    <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><AlertCircle className="h-3 w-3 text-rose-600" /> 61+ Days</p>
                                    <p className="text-lg font-bold text-rose-700 mt-1">GH₵{debtAgingStats.age90.toFixed(2)}</p>
                                    <p className="text-[10px] text-muted-foreground">{debtAgingStats.total > 0 ? ((debtAgingStats.age90 / debtAgingStats.total) * 100).toFixed(1) : 0}% of debt</p>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'classPace' && (
                        <div className="space-y-4 animate-in fade-in-50">
                            {classCollectionsStats.length === 0 ? (
                                <p className="text-center py-10 text-muted-foreground italic text-xs">No class data found.</p>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-[380px] overflow-y-auto pr-1">
                                    {classCollectionsStats.map((stat: any) => {
                                        const progressBarColor = stat.rate >= 80 ? 'bg-emerald-500' : stat.rate >= 50 ? 'bg-amber-500' : 'bg-rose-500';
                                        const badgeColor = stat.rate >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : stat.rate >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200';
                                        
                                        return (
                                            <Card key={stat.classId} className="p-4 flex flex-col justify-between hover:border-slate-350 hover:shadow-sm transition-all duration-300 bg-slate-50/20 shadow-none border">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 text-xs">{stat.className}</h4>
                                                            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.studentCount} Students</p>
                                                        </div>
                                                        <Badge variant="outline" className={cn("font-bold text-[10px] px-2 py-0.5", badgeColor)}>
                                                            {stat.rate.toFixed(1)}%
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-1 mt-3">
                                                        <div className="flex justify-between text-[11px] font-mono text-slate-600">
                                                            <span>Billed:</span>
                                                            <span>GH₵{(stat.totalBilled - stat.totalWaivers).toFixed(0)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-[11px] font-mono text-emerald-600">
                                                            <span>Collected:</span>
                                                            <span>GH₵{stat.totalPaid.toFixed(0)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-[11px] font-mono text-rose-600">
                                                            <span>Owed:</span>
                                                            <span>GH₵{stat.outstanding.toFixed(0)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-2 border-t">
                                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                        <div 
                                                            className={cn("h-full transition-all duration-500", progressBarColor)}
                                                            style={{ width: `${Math.min(stat.rate, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                    {/* Cash Register Registry Widget */}
                    <Card className="border border-slate-200/60 rounded-2xl p-5 shadow-sm bg-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                                <Wallet className="h-4 w-4 text-slate-500" /> Cash Register Desk
                            </h3>
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                            ) : activeTill ? (
                                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold flex items-center gap-1.5 py-0.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" /> Open
                                </Badge>
                            ) : (
                                <Badge variant="destructive" className="font-extrabold py-0.5">Closed</Badge>
                            )}
                        </div>
                        
                        {activeTill ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                                    <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wide">Cash Balance in Till</p>
                                    <p className="text-2xl font-black text-emerald-800 tracking-tight mt-1">
                                        GH₵{activeTill.currentBalance?.toFixed(2) || "0.00"}
                                    </p>
                                    <p className="text-[9px] text-slate-500 mt-2 font-medium">
                                        Session ID: #{activeTill.id.substring(0, 8).toUpperCase()}
                                    </p>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    You are authorized to log cash payments from students. Receipts will link to this register desk.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl flex items-start gap-2.5">
                                    <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5 animate-pulse" />
                                    <div>
                                        <p className="text-xs font-bold text-rose-800">Closed Registry</p>
                                        <p className="text-[11px] text-rose-600/90 mt-0.5 leading-normal">
                                            You must open a cash till session before accepting any Cash payments from student bill ledgers.
                                        </p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Open registry initiates the digital cashier till tracking for correct payment reconciliation.
                                </p>
                            </div>
                        )}
                        
                        <div className="mt-6 pt-4 border-t flex flex-col gap-2">
                            {activeTill ? (
                                <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-xs">
                                    <Link href="/dashboard/accounts/cash-till" className="flex items-center justify-center gap-2 cursor-pointer">
                                        Open Till Dashboard <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleOpenTill} 
                                    disabled={isOpeningTill}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 text-xs"
                                >
                                    {isOpeningTill ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Activating Register...
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="mr-2 h-4 w-4" /> Open Active Till
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </Card>

                    {/* Finance Actions Card */}
                    <Card className="rounded-2xl border border-slate-200/60 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-6 pb-4 border-b">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Finance Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-3">
                            <Link href="/dashboard/accounts" className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-xl"><PlusCircle className="h-4 w-4 text-blue-600"/></div>
                                    <span className="text-sm font-black uppercase tracking-tight text-slate-700">Billing & Ledgers</span>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-350 group-hover:translate-x-1 transition-transform"/>
                            </Link>
                            <Link href="/dashboard/finance/bulk-payments" className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-100 rounded-xl"><HandCoins className="h-4 w-4 text-emerald-600"/></div>
                                    <span className="text-sm font-black uppercase tracking-tight text-slate-700">Bulk Daily Receipts</span>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-350 group-hover:translate-x-1 transition-transform"/>
                            </Link>
                            <Link href="/dashboard/accounts/cash-till" className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-xl"><Wallet className="h-4 w-4 text-indigo-600"/></div>
                                    <span className="text-sm font-black uppercase tracking-tight text-slate-700">Close Daily Till</span>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-slate-350 group-hover:translate-x-1 transition-transform"/>
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

// =========================================================================
// A. COOK DASHBOARD
// =========================================================================
function CookDashboard({ profile, announcements, leaveRequests, announcementsLoading, isLoadingLeaves }: any) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'menu' | 'inventory' | 'meals' | 'portal'>('portal');

    // Menu Planner
    const menuQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'cafeteria_menus'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: menuItems } = useCollection<any>(menuQuery);

    // Kitchen Inventory
    const inventoryQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'kitchen_inventory'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: inventoryItems } = useCollection<any>(inventoryQuery);

    // Daily Meal Logs
    const mealLogsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'meal_logs'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: mealLogs } = useCollection<any>(mealLogsQuery);

    const sortedMealLogs = useMemo(() => {
        return mealLogs ? [...mealLogs].sort((a, b) => (b.recordedAt?.seconds || 0) - (a.recordedAt?.seconds || 0)) : [];
    }, [mealLogs]);

    // Forms State
    const [menuForm, setMenuForm] = useState({ dayOfWeek: 'Monday', mealType: 'Lunch', mealName: '', description: '', notes: '' });
    const [invForm, setInvForm] = useState({ name: '', quantity: 0, unit: 'kg', category: 'Dry Goods', status: 'In Stock' });
    const [mealLogForm, setMealLogForm] = useState({ mealName: '', servingsPrepared: 100, rating: 5, notes: '' });
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveMenu = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !schoolId) return;
        setIsSaving(true);
        const docId = `${schoolId}-${menuForm.dayOfWeek}-${menuForm.mealType}`.toLowerCase();
        try {
            await setDoc(doc(firestore, 'cafeteria_menus', docId), {
                ...menuForm,
                schoolId,
                updatedAt: serverTimestamp()
            });
            toast({ title: 'Menu Saved', description: `Cafeteria menu updated for ${menuForm.dayOfWeek} ${menuForm.mealType}.` });
            setMenuForm({ ...menuForm, mealName: '', description: '', notes: '' });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update menu.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveInventory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !schoolId || !invForm.name) return;
        setIsSaving(true);
        const docId = `${schoolId}-${invForm.name.replace(/\s+/g, '-').toLowerCase()}`;
        try {
            await setDoc(doc(firestore, 'kitchen_inventory', docId), {
                ...invForm,
                quantity: Number(invForm.quantity),
                schoolId,
                updatedAt: serverTimestamp()
            });
            toast({ title: 'Inventory Item Saved', description: `${invForm.name} saved successfully.` });
            setInvForm({ name: '', quantity: 0, unit: 'kg', category: 'Dry Goods', status: 'In Stock' });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save inventory.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveMealLog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !schoolId || !mealLogForm.mealName) return;
        setIsSaving(true);
        const docId = `meallog-${Date.now()}`;
        try {
            await setDoc(doc(firestore, 'meal_logs', docId), {
                ...mealLogForm,
                servingsPrepared: Number(mealLogForm.servingsPrepared),
                schoolId,
                recordedAt: serverTimestamp()
            });
            toast({ title: 'Meal Log Saved', description: `Logged preparation of ${mealLogForm.mealName}.` });
            setMealLogForm({ mealName: '', servingsPrepared: 100, rating: 5, notes: '' });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save meal log.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAdjustInventory = async (item: any, delta: number) => {
        if (!firestore) return;
        const newQty = Math.max(0, (item.quantity || 0) + delta);
        let status = 'In Stock';
        if (newQty === 0) status = 'Out of Stock';
        else if (newQty < 10) status = 'Low Stock';

        try {
            await setDoc(doc(firestore, 'kitchen_inventory', item.id), {
                ...item,
                quantity: newQty,
                status,
                updatedAt: serverTimestamp()
            }, { merge: true });
            toast({ title: 'Inventory Updated', description: `${item.name} quantity updated to ${newQty}.` });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to adjust quantity.' });
        }
    };

    const activeMenuForDay = (day: string, type: string) => {
        return menuItems?.find((m: any) => m.dayOfWeek === day && m.mealType === type);
    };

    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Chef';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Visual Hero Mesh Banner */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-amber-600 via-orange-700 to-slate-900 text-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-orange-500/20">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <ChefHat className="h-48 w-48 transform rotate-12 text-amber-200" />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                Kitchen Cockpit
                            </span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest">
                                Cafeteria Panel
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-tight text-white">
                            Chef <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-200">{displayName.toUpperCase()}</span>'s Portal 👋
                        </h1>
                        <p className="text-slate-200 text-xs md:text-sm font-semibold max-w-xl">
                            Prepare today's menu, audit pantry supplies, and log meal metrics for student wellness.
                        </p>
                    </div>
                </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                <button onClick={() => setActiveTab('portal')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'portal' ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-600 border-slate-100 hover:border-amber-200")}>General Portal</button>
                <button onClick={() => setActiveTab('menu')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'menu' ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-600 border-slate-100 hover:border-amber-200")}>Weekly Menu Planner</button>
                <button onClick={() => setActiveTab('inventory')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'inventory' ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-600 border-slate-100 hover:border-amber-200")}>Kitchen Inventory</button>
                <button onClick={() => setActiveTab('meals')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'meals' ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-600 border-slate-100 hover:border-amber-200")}>Daily Meal Logs</button>
            </div>

            {/* STATS STRIP */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-[2rem] border-none shadow-md bg-white hover:shadow-lg transition-all relative overflow-hidden">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pantry Stock Items</p>
                            <h3 className="text-3xl font-black text-slate-900">{inventoryItems?.length || 0} Listed</h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Active supplies in kitchen stores</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-650 shadow-inner">
                            <Database className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-none shadow-md bg-white hover:shadow-lg transition-all relative overflow-hidden">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Low Stock Alerts</p>
                            <h3 className="text-3xl font-black text-red-650">
                                {inventoryItems?.filter((i: any) => i.status === 'Low Stock' || i.status === 'Out of Stock').length || 0} Alerts
                            </h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Supplies that need replenishment</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-650 shadow-inner">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-none shadow-md bg-white hover:shadow-lg transition-all relative overflow-hidden">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Today's Meal Preparation</p>
                            <h3 className="text-3xl font-black text-emerald-650">
                                {sortedMealLogs?.filter((m: any) => {
                                    if (!m.recordedAt) return false;
                                    const d = m.recordedAt.toDate();
                                    return d.toDateString() === new Date().toDateString();
                                }).length || 0} Logged
                            </h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Meals checked in today</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-650 shadow-inner">
                            <Utensils className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'portal' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-8 border-b">
                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Support Resources</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick links for daily HR tasks.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-3">
                            <QuickActionCard title="My Attendance Records" description="View and log attendance punch records" icon={CalendarCheck} link="/dashboard/attendance/staff" />
                            <QuickActionCard title="Request Leave/Time Off" description="Request holidays or medical leaves" icon={FileText} link="/dashboard/hr/leave-management" />
                            <QuickActionCard title="Chat Channels" description="Chat with other school members and cooks" icon={MessageSquare} link="/dashboard/messages" />
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-amber-400">School Bulletins</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            {announcementsLoading && <div className="flex justify-center py-6"><Loader2 className="animate-spin text-amber-400" /></div>}
                            {!announcementsLoading && announcements?.length === 0 && (
                                <p className="text-sm text-slate-500 italic uppercase font-black tracking-widest text-center py-10">No recent announcements.</p>
                            )}
                            {announcements?.slice(0, 3).map((a: any) => (
                                <ActivityItem key={a.id} title={a.title} description={a.content} time={a.publishedAt ? formatDistanceToNow(a.publishedAt.toDate(), { addSuffix: true }) : 'Just now'} icon={Bell} iconColor="text-amber-400" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === 'menu' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Weekly Schedule Display */}
                    <div className="xl:col-span-2 space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Weekly Menu Board</h3>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                            const bfast = activeMenuForDay(day, 'Breakfast');
                            const lunch = activeMenuForDay(day, 'Lunch');
                            return (
                                <Card key={day} className="rounded-3xl border-2 border-slate-50 bg-white hover:border-amber-200 transition-all p-6">
                                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                                        <h4 className="font-black text-slate-800 uppercase text-sm tracking-wider">{day}</h4>
                                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase">Scheduled Meals</span>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">🍳 Breakfast</div>
                                            {bfast ? (
                                                <div>
                                                    <h5 className="font-extrabold text-slate-800 uppercase text-xs">{bfast.mealName}</h5>
                                                    <p className="text-[11px] text-slate-500 mt-1">{bfast.description || 'No description provided.'}</p>
                                                </div>
                                            ) : (
                                                <p className="text-[10px] text-slate-400 italic">No breakfast scheduled.</p>
                                            )}
                                        </div>
                                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">🍲 Lunch</div>
                                            {lunch ? (
                                                <div>
                                                    <h5 className="font-extrabold text-slate-800 uppercase text-xs">{lunch.mealName}</h5>
                                                    <p className="text-[11px] text-slate-500 mt-1">{lunch.description || 'No description provided.'}</p>
                                                </div>
                                            ) : (
                                                <p className="text-[10px] text-slate-400 italic">No lunch scheduled.</p>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Menu Form */}
                    <Card className="rounded-3xl border-none shadow-lg bg-white p-6 h-fit">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Schedule Meal</h4>
                        <form onSubmit={handleSaveMenu} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Day of Week</label>
                                <select value={menuForm.dayOfWeek} onChange={e => setMenuForm({...menuForm, dayOfWeek: e.target.value})} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Meal Type</label>
                                <select value={menuForm.mealType} onChange={e => setMenuForm({...menuForm, mealType: e.target.value})} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
                                    {['Breakfast', 'Lunch'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Meal Name</label>
                                <Input value={menuForm.mealName} onChange={e => setMenuForm({...menuForm, mealName: e.target.value})} placeholder="e.g. Oatmeal & Fruits" required className="h-11 rounded-xl" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Description</label>
                                <textarea value={menuForm.description} onChange={e => setMenuForm({...menuForm, description: e.target.value})} placeholder="Describe ingredients or allergens..." className="w-full h-20 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold" />
                            </div>
                            <Button type="submit" disabled={isSaving} className="w-full bg-amber-600 hover:bg-amber-700 h-11 rounded-xl text-xs font-black uppercase">
                                {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />} Save Menu Plan
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {activeTab === 'inventory' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Inventory Table Grid */}
                    <div className="xl:col-span-2 space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Kitchen Store Inventory</h3>
                        {inventoryItems && inventoryItems.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-4">
                                {inventoryItems.map((item: any) => (
                                    <Card key={item.id} className="rounded-2xl border bg-white p-5 hover:shadow-sm transition-all flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">{item.category}</span>
                                                <h4 className="font-extrabold text-slate-800 uppercase text-xs">{item.name}</h4>
                                            </div>
                                            <Badge className={cn("text-[9px] font-black px-2 py-0.5 rounded-full border-none",
                                                item.status === 'In Stock' ? "bg-emerald-100 text-emerald-800" :
                                                item.status === 'Low Stock' ? "bg-amber-100 text-amber-800 animate-pulse" :
                                                "bg-rose-100 text-rose-800 animate-bounce"
                                            )}>{item.status}</Badge>
                                        </div>
                                        <div className="flex items-center justify-between mt-6 pt-3 border-t">
                                            <div className="text-sm font-black text-slate-900">
                                                {item.quantity} <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.unit}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleAdjustInventory(item, -1)} className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center">-</button>
                                                <button onClick={() => handleAdjustInventory(item, 1)} className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center">+</button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                                <Database className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs font-black uppercase text-slate-400">No inventory items listed. Start adding pantry supplies.</p>
                            </div>
                        )}
                    </div>

                    {/* Inventory Item Form */}
                    <Card className="rounded-3xl border-none shadow-lg bg-white p-6 h-fit">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Add Pantry Item</h4>
                        <form onSubmit={handleSaveInventory} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Item Name</label>
                                <Input value={invForm.name} onChange={e => setInvForm({...invForm, name: e.target.value})} placeholder="e.g. Rice, Vegetable Oil" required className="h-11 rounded-xl" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Quantity</label>
                                    <Input type="number" value={invForm.quantity} onChange={e => setInvForm({...invForm, quantity: Number(e.target.value)})} required className="h-11 rounded-xl" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Unit</label>
                                    <select value={invForm.unit} onChange={e => setInvForm({...invForm, unit: e.target.value})} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
                                        {['kg', 'liters', 'bags', 'cartons', 'packets', 'pieces'].map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Category</label>
                                <select value={invForm.category} onChange={e => setInvForm({...invForm, category: e.target.value})} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
                                    {['Dry Goods', 'Fresh Produce', 'Dairy', 'Meat', 'Condiments', 'Beverages'].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <Button type="submit" disabled={isSaving} className="w-full bg-amber-600 hover:bg-amber-700 h-11 rounded-xl text-xs font-black uppercase">
                                {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />} Save Pantry Item
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {activeTab === 'meals' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Logged Meals History */}
                    <div className="xl:col-span-2 space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Kitchen Preparation Logs</h3>
                        {sortedMealLogs && sortedMealLogs.length > 0 ? (
                            <div className="space-y-3">
                                {sortedMealLogs.map((log: any) => (
                                    <Card key={log.id} className="rounded-2xl border bg-white p-5 hover:shadow-sm transition-all flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-extrabold text-slate-800 uppercase text-xs">{log.mealName}</h4>
                                                <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">{log.servingsPrepared} Servings</span>
                                            </div>
                                            {log.notes && <p className="text-[11px] text-slate-500 italic">"{log.notes}"</p>}
                                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mt-1">
                                                {log.recordedAt?.toDate ? formatDistanceToNow(log.recordedAt.toDate(), { addSuffix: true }) : 'Just now'}
                                            </span>
                                        </div>
                                        <div className="flex gap-0.5 text-amber-500">
                                            {Array.from({ length: log.rating || 5 }).map((_, i) => (
                                                <Star key={i} className="h-4.5 w-4.5 fill-current" />
                                            ))}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                                <Utensils className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs font-black uppercase text-slate-400">No meal logs recorded. Enter meal logs to keep records.</p>
                            </div>
                        )}
                    </div>

                    {/* Meal Logging Form */}
                    <Card className="rounded-3xl border-none shadow-lg bg-white p-6 h-fit">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Log Daily Servings</h4>
                        <form onSubmit={handleSaveMealLog} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Meal Name</label>
                                <Input value={mealLogForm.mealName} onChange={e => setMealLogForm({...mealLogForm, mealName: e.target.value})} placeholder="e.g. Jollof Rice & Grilled Chicken" required className="h-11 rounded-xl" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Servings Prepared</label>
                                <Input type="number" value={mealLogForm.servingsPrepared} onChange={e => setMealLogForm({...mealLogForm, servingsPrepared: Number(e.target.value)})} required className="h-11 rounded-xl" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Rating/Feedback Level</label>
                                <select value={mealLogForm.rating} onChange={e => setMealLogForm({...mealLogForm, rating: Number(e.target.value)})} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
                                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Observations/Remarks</label>
                                <textarea value={mealLogForm.notes} onChange={e => setMealLogForm({...mealLogForm, notes: e.target.value})} placeholder="Allergies noticed, leftovers count..." className="w-full h-20 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold" />
                            </div>
                            <Button type="submit" disabled={isSaving} className="w-full bg-amber-600 hover:bg-amber-700 h-11 rounded-xl text-xs font-black uppercase">
                                {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />} Complete Log Entry
                            </Button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}

// =========================================================================
// B. CLEANER DASHBOARD
// =========================================================================
function CleanerDashboard({ profile, announcements, leaveRequests, announcementsLoading, isLoadingLeaves }: any) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'checklist' | 'issues' | 'logs' | 'portal'>('portal');

    // Checklist tasks for today
    const cleaningTasksQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'cleaning_tasks'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: cleaningTasks } = useCollection<any>(cleaningTasksQuery);

    // Deep clean sanitation logs
    const sanitationQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'sanitation_logs'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: sanitationLogs } = useCollection<any>(sanitationQuery);

    const sortedSanitationLogs = useMemo(() => {
        return sanitationLogs ? [...sanitationLogs].sort((a, b) => (b.recordedAt?.seconds || 0) - (a.recordedAt?.seconds || 0)) : [];
    }, [sanitationLogs]);

    // Safety and maintenance reports
    const issuesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'cleaning_issues'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: cleaningIssues } = useCollection<any>(issuesQuery);

    const sortedIssues = useMemo(() => {
        return cleaningIssues ? [...cleaningIssues].sort((a, b) => (b.reportedAt?.seconds || 0) - (a.reportedAt?.seconds || 0)) : [];
    }, [cleaningIssues]);

    // Forms State
    const [issueForm, setIssueForm] = useState({ title: '', description: '', area: 'Washrooms', urgency: 'Medium' });
    const [sanLogForm, setSanLogForm] = useState({ area: 'Washrooms', productsUsed: 'Bleach, Pine Gel', notes: '' });
    const [isSaving, setIsSaving] = useState(false);

    // Preset cleaning checklist items
    const areas = ['Classrooms A-E', 'Classrooms F-J', 'Student Washrooms', 'Staff Washrooms', 'Library', 'Assembly Hall', 'School Grounds'];

    const getDailyTaskStatus = (area: string) => {
        const todayStr = new Date().toDateString();
        const found = cleaningTasks?.find((t: any) => t.area === area && t.dateStr === todayStr);
        return found?.status || 'Pending';
    };

    const handleToggleChecklist = async (area: string) => {
        if (!firestore || !schoolId || !user) return;
        const todayStr = new Date().toDateString();
        const docId = `${schoolId}-${area.replace(/\s+/g, '-').toLowerCase()}-${todayStr.replace(/\s+/g, '-')}`.toLowerCase();
        const currentStatus = getDailyTaskStatus(area);
        const nextStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';

        try {
            await setDoc(doc(firestore, 'cleaning_tasks', docId), {
                area,
                dateStr: todayStr,
                status: nextStatus,
                completedBy: displayName,
                completedAt: serverTimestamp(),
                schoolId
            });
            toast({ title: 'Checklist Updated', description: `${area} marked as ${nextStatus}.` });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update checklist.' });
        }
    };

    const handleSaveIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !schoolId || !issueForm.title) return;
        setIsSaving(true);
        const docId = `issue-${Date.now()}`;
        try {
            await setDoc(doc(firestore, 'cleaning_issues', docId), {
                ...issueForm,
                status: 'Open',
                reportedBy: displayName,
                reportedAt: serverTimestamp(),
                schoolId
            });
            toast({ title: 'Issue Reported', description: 'Administrative staff has been notified.' });
            setIssueForm({ title: '', description: '', area: 'Washrooms', urgency: 'Medium' });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to report issue.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveSanitationLog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !schoolId) return;
        setIsSaving(true);
        const docId = `sanlog-${Date.now()}`;
        try {
            await setDoc(doc(firestore, 'sanitation_logs', docId), {
                ...sanLogForm,
                cleanerName: displayName,
                recordedAt: serverTimestamp(),
                schoolId
            });
            toast({ title: 'Sanitation Record Saved', description: 'Sanitation activity logged.' });
            setSanLogForm({ area: 'Washrooms', productsUsed: 'Bleach, Pine Gel', notes: '' });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save log.' });
        } finally {
            setIsSaving(false);
        }
    };

    const totalCompletedToday = areas.filter(a => getDailyTaskStatus(a) === 'Completed').length;
    const progressPercent = Math.round((totalCompletedToday / areas.length) * 100);

    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Cleaner';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Visual Hero Mesh Banner */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-800 to-slate-900 text-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-teal-500/20">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <ClipboardList className="h-48 w-48 transform rotate-12 text-teal-200" />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                Sanitation Dashboard
                            </span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[10px] font-black text-teal-300 uppercase tracking-widest">
                                Campus Clean
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-tight text-white">
                            Sanitation Portal: <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-200">{displayName.toUpperCase()}</span> 👋
                        </h1>
                        <p className="text-slate-200 text-xs md:text-sm font-semibold max-w-xl">
                            Track daily area compliance checklists, report maintenance faults, and log sanitation rounds.
                        </p>
                    </div>
                </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                <button onClick={() => setActiveTab('portal')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'portal' ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-600 border-slate-100 hover:border-teal-200")}>General Portal</button>
                <button onClick={() => setActiveTab('checklist')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'checklist' ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-600 border-slate-100 hover:border-teal-200")}>Daily Checklist</button>
                <button onClick={() => setActiveTab('issues')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'issues' ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-600 border-slate-100 hover:border-teal-200")}>Issue Reporter</button>
                <button onClick={() => setActiveTab('logs')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'logs' ? "bg-teal-600 text-white border-teal-600" : "bg-white text-slate-600 border-slate-100 hover:border-teal-200")}>Deep Clean Logs</button>
            </div>

            {/* STATS STRIP */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-[2rem] border-none shadow-md bg-white hover:shadow-lg transition-all relative overflow-hidden">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex-1 mr-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Checklist Progress</p>
                            <h3 className="text-3xl font-black text-slate-900">{totalCompletedToday} / {areas.length}</h3>
                            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                                <div className="bg-teal-600 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                            </div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-teal-50 text-teal-650 shadow-inner">
                            <CheckSquare className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-none shadow-md bg-white hover:shadow-lg transition-all relative overflow-hidden">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reported Maintenance Faults</p>
                            <h3 className="text-3xl font-black text-amber-650">
                                {sortedIssues?.filter((i: any) => i.status === 'Open').length || 0} Open
                            </h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Active plumbing/safety issues logged</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-650 shadow-inner">
                            <Wrench className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-none shadow-md bg-white hover:shadow-lg transition-all relative overflow-hidden">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deep Sanitations Logged</p>
                            <h3 className="text-3xl font-black text-emerald-650">{sanitationLogs?.length || 0} Records</h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Sanitizing records with chemical tags</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-650 shadow-inner">
                            <Sparkles className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'portal' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-8 border-b">
                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Support Resources</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick links for daily HR tasks.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-3">
                            <QuickActionCard title="My Attendance Records" description="View and log attendance punch records" icon={CalendarCheck} link="/dashboard/attendance/staff" />
                            <QuickActionCard title="Request Leave/Time Off" description="Request holidays or medical leaves" icon={FileText} link="/dashboard/hr/leave-management" />
                            <QuickActionCard title="Chat Channels" description="Chat with other school members and staff" icon={MessageSquare} link="/dashboard/messages" />
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-teal-400">School Bulletins</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            {announcementsLoading && <div className="flex justify-center py-6"><Loader2 className="animate-spin text-teal-400" /></div>}
                            {!announcementsLoading && announcements?.length === 0 && (
                                <p className="text-sm text-slate-500 italic uppercase font-black tracking-widest text-center py-10">No recent announcements.</p>
                            )}
                            {announcements?.slice(0, 3).map((a: any) => (
                                <ActivityItem key={a.id} title={a.title} description={a.content} time={a.publishedAt ? formatDistanceToNow(a.publishedAt.toDate(), { addSuffix: true }) : 'Just now'} icon={Bell} iconColor="text-teal-400" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === 'checklist' && (
                <div className="space-y-4 max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Daily Cleaning Checklists</h3>
                        <Badge className="bg-teal-50 border-teal-150 text-teal-800 text-[10px] font-black uppercase tracking-tight py-1 px-3.5 rounded-full">Active Today</Badge>
                    </div>
                    {areas.map((area) => {
                        const status = getDailyTaskStatus(area);
                        const isDone = status === 'Completed';
                        return (
                            <Card key={area} className="rounded-2xl border bg-white p-5 hover:border-teal-200 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleToggleChecklist(area)} className={cn("h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                        isDone ? "bg-teal-600 border-teal-600 text-white" : "border-slate-300 hover:border-teal-400 bg-white"
                                    )}>
                                        {isDone && <CheckSquare className="h-4 w-4" />}
                                    </button>
                                    <div>
                                        <h4 className={cn("font-bold uppercase text-xs", isDone ? "text-slate-400 line-through" : "text-slate-800")}>{area}</h4>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider mt-0.5">{isDone ? `Marked complete today` : 'Pending clean inspection'}</span>
                                    </div>
                                </div>
                                <span className={cn("text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full",
                                    isDone ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                                )}>{status}</span>
                            </Card>
                        );
                    })}
                </div>
            )}

            {activeTab === 'issues' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Logged Issues Feed */}
                    <div className="xl:col-span-2 space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Reported Maintenance Logs</h3>
                        {sortedIssues && sortedIssues.length > 0 ? (
                            <div className="space-y-3">
                                {sortedIssues.map((issue: any) => (
                                    <Card key={issue.id} className="rounded-2xl border bg-white p-5 hover:shadow-sm transition-all flex justify-between items-start">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h4 className="font-extrabold text-slate-800 uppercase text-xs">{issue.title}</h4>
                                                <Badge className="bg-slate-100 hover:bg-slate-100 border-none text-slate-600 text-[8px] font-black uppercase rounded-full">{issue.area}</Badge>
                                                <Badge className={cn("text-[8px] font-black px-2 py-0.5 rounded-full border-none",
                                                    issue.urgency === 'High' ? "bg-rose-100 text-rose-800 animate-pulse" :
                                                    issue.urgency === 'Medium' ? "bg-amber-100 text-amber-800" :
                                                    "bg-blue-100 text-blue-800"
                                                )}>{issue.urgency}</Badge>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1">"{issue.description}"</p>
                                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mt-1">
                                                Reported by {issue.reportedBy} • {issue.reportedAt?.toDate ? formatDistanceToNow(issue.reportedAt.toDate(), { addSuffix: true }) : 'Just now'}
                                            </span>
                                        </div>
                                        <Badge className={cn("text-[10px] font-black uppercase px-2.5 py-1 rounded-full",
                                            issue.status === 'Open' ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                                        )}>{issue.status}</Badge>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                                <Wrench className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs font-black uppercase text-slate-400">No issues reported. Use form to log maintenance faults.</p>
                            </div>
                        )}
                    </div>

                    {/* Issue Form */}
                    <Card className="rounded-3xl border-none shadow-lg bg-white p-6 h-fit">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Report Campus Fault</h4>
                        <form onSubmit={handleSaveIssue} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Short Title</label>
                                <Input value={issueForm.title} onChange={e => setIssueForm({...issueForm, title: e.target.value})} placeholder="e.g. Broken pipe, Leaking sink" required className="h-11 rounded-xl" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Urgency Level</label>
                                <select value={issueForm.urgency} onChange={e => setIssueForm({...issueForm, urgency: e.target.value})} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
                                    {['Low', 'Medium', 'High'].map(u => <option key={u} value={u}>{u} Priority</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Campus Area</label>
                                <select value={issueForm.area} onChange={e => setIssueForm({...issueForm, area: e.target.value})} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
                                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Problem Description</label>
                                <textarea value={issueForm.description} onChange={e => setIssueForm({...issueForm, description: e.target.value})} placeholder="Give location details, what is malfunctioning..." required className="w-full h-24 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold" />
                            </div>
                            <Button type="submit" disabled={isSaving} className="w-full bg-teal-600 hover:bg-teal-700 h-11 rounded-xl text-xs font-black uppercase">
                                {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <AlertTriangle className="h-4 w-4 mr-2" />} Submit Incident Report
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Sanitation history list */}
                    <div className="xl:col-span-2 space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Campus Deep Clean Register</h3>
                        {sortedSanitationLogs && sortedSanitationLogs.length > 0 ? (
                            <div className="space-y-3">
                                {sortedSanitationLogs.map((log: any) => (
                                    <Card key={log.id} className="rounded-2xl border bg-white p-5 hover:shadow-sm transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-extrabold text-slate-800 uppercase text-xs">{log.area}</h4>
                                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Products: {log.productsUsed}</p>
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">
                                                {log.recordedAt?.toDate ? formatDistanceToNow(log.recordedAt.toDate(), { addSuffix: true }) : 'Just now'}
                                            </span>
                                        </div>
                                        {log.notes && <p className="text-[11px] text-slate-500 italic mt-3 border-l-2 border-teal-500 pl-3">"{log.notes}"</p>}
                                        <div className="text-[9px] font-black uppercase text-slate-400 mt-2 text-right">Signed: {log.cleanerName}</div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                                <Sparkles className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs font-black uppercase text-slate-400">No deep cleaning sanitation logs recorded yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Sanitation logging form */}
                    <Card className="rounded-3xl border-none shadow-lg bg-white p-6 h-fit">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Record Deep Cleaning</h4>
                        <form onSubmit={handleSaveSanitationLog} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Clean Area</label>
                                <select value={sanLogForm.area} onChange={e => setSanLogForm({...sanLogForm, area: e.target.value})} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
                                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Products / Chemicals Used</label>
                                <Input value={sanLogForm.productsUsed} onChange={e => setSanLogForm({...sanLogForm, productsUsed: e.target.value})} placeholder="e.g. Chlorine, Bleach, Degreaser" required className="h-11 rounded-xl" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Sanitation Notes</label>
                                <textarea value={sanLogForm.notes} onChange={e => setSanLogForm({...sanLogForm, notes: e.target.value})} placeholder="Dusted high areas, sanitized desk handles, scrubbed tiles..." className="w-full h-24 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold" />
                            </div>
                            <Button type="submit" disabled={isSaving} className="w-full bg-teal-600 hover:bg-teal-700 h-11 rounded-xl text-xs font-black uppercase">
                                {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />} Log Sanitation Complete
                            </Button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}

// =========================================================================
// C. TRANSPORT STAFF DASHBOARD
// =========================================================================
function TransportDashboard({ profile, announcements, leaveRequests, announcementsLoading, isLoadingLeaves }: any) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'routes' | 'manifest' | 'logs' | 'portal'>('portal');

    // Fetch buses
    const busesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'buses'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: buses } = useCollection<Bus>(busesQuery);

    // Fetch routes
    const routesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'routes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: routes } = useCollection<Route>(routesQuery);

    // Fetch students
    const studentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: students } = useCollection<any>(studentsQuery);

    // Fetch vehicle daily logs
    const vehicleLogsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'vehicle_logs'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: vehicleLogs } = useCollection<any>(vehicleLogsQuery);

    const sortedVehicleLogs = useMemo(() => {
        return vehicleLogs ? [...vehicleLogs].sort((a, b) => (b.recordedAt?.seconds || 0) - (a.recordedAt?.seconds || 0)) : [];
    }, [vehicleLogs]);

    const activeRoute = useMemo(() => {
        return routes?.find(r => r.driverId === user?.uid) || routes?.[0];
    }, [routes, user?.uid]);

    const activeBus = useMemo(() => {
        if (!activeRoute) return null;
        return buses?.find(b => b.id === activeRoute.busId);
    }, [activeRoute, buses]);

    // Odometer & Fuel form state
    const [vehForm, setVehForm] = useState({ odometerReading: 12000, fuelAdded: 0, cost: 0, maintenanceNotes: '' });
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveVehicleLog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !schoolId || !activeBus) {
            toast({ variant: 'destructive', title: 'Error', description: 'No active bus assigned to log activity.' });
            return;
        }
        setIsSaving(true);
        const docId = `vehlog-${Date.now()}`;
        try {
            await setDoc(doc(firestore, 'vehicle_logs', docId), {
                ...vehForm,
                odometerReading: Number(vehForm.odometerReading),
                fuelAdded: Number(vehForm.fuelAdded),
                cost: Number(vehForm.cost),
                busId: activeBus.id,
                busName: activeBus.name,
                driverName: displayName,
                recordedAt: serverTimestamp(),
                schoolId
            });
            toast({ title: 'Vehicle Activity Logged', description: 'Log saved successfully.' });
            setVehForm({ odometerReading: vehForm.odometerReading + 20, fuelAdded: 0, cost: 0, maintenanceNotes: '' });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save vehicle log.' });
        } finally {
            setIsSaving(false);
        }
    };

    const studentsOnStop = (stop: Stop) => {
        return students?.filter(s => stop.assignedStudentIds?.includes(s.uid)) || [];
    };

    const totalStudentsOnRoute = useMemo(() => {
        if (!activeRoute) return 0;
        return activeRoute.stops?.reduce((sum, stop) => sum + (stop.assignedStudentIds?.length || 0), 0) || 0;
    }, [activeRoute]);

    const occupancyRate = useMemo(() => {
        if (!activeBus?.capacity || !totalStudentsOnRoute) return 0;
        return Math.round((totalStudentsOnRoute / activeBus.capacity) * 100);
    }, [activeBus, totalStudentsOnRoute]);

    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Driver';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Visual Hero Mesh Banner */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-800 to-slate-900 text-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-violet-500/20">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <BusIcon className="h-48 w-48 transform rotate-12 text-violet-200" />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                Transport Pilot
                            </span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[10px] font-black text-violet-300 uppercase tracking-widest">
                                Routes Console
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-tight text-white">
                            Fleet Terminal: <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-200">{displayName.toUpperCase()}</span> 👋
                        </h1>
                        <p className="text-slate-200 text-xs md:text-sm font-semibold max-w-xl">
                            Track assigned bus stops, check off student passenger logs, and input vehicle mileage logs.
                        </p>
                    </div>
                </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                <button onClick={() => setActiveTab('portal')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'portal' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-100 hover:border-indigo-200")}>General Portal</button>
                <button onClick={() => setActiveTab('routes')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'routes' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-100 hover:border-indigo-200")}>My Stops & Route</button>
                <button onClick={() => setActiveTab('manifest')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'manifest' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-100 hover:border-indigo-200")}>Rider Manifest</button>
                <button onClick={() => setActiveTab('logs')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'logs' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-100 hover:border-indigo-200")}>Fuel & Mileage Logs</button>
            </div>

            {/* STATS STRIP */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-[2rem] border-none shadow-md bg-white hover:shadow-lg transition-all relative overflow-hidden">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Route Assigned</p>
                            <h3 className="text-3xl font-black text-slate-900">{activeRoute?.name || 'No Route'}</h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">{activeRoute?.stops?.length || 0} scheduled route stops</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-650 shadow-inner">
                            <RouteIcon className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-none shadow-md bg-white hover:shadow-lg transition-all relative overflow-hidden">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bus Vehicle assigned</p>
                            <h3 className="text-3xl font-black text-violet-650">{activeBus?.name || 'Unassigned'}</h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Capacity: {activeBus?.capacity || 0} seat registers</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-violet-50 text-violet-650 shadow-inner">
                            <BusIcon className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-none shadow-md bg-white hover:shadow-lg transition-all relative overflow-hidden">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rider Capacity Load</p>
                            <h3 className="text-3xl font-black text-emerald-650">{totalStudentsOnRoute} Passengers</h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Occupancy at {occupancyRate}% seat limit</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-650 shadow-inner">
                            <Users className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'portal' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-8 border-b">
                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Support Resources</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick links for daily HR tasks.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-3">
                            <QuickActionCard title="My Attendance Records" description="View and log attendance punch records" icon={CalendarCheck} link="/dashboard/attendance/staff" />
                            <QuickActionCard title="Request Leave/Time Off" description="Request holidays or medical leaves" icon={FileText} link="/dashboard/hr/leave-management" />
                            <QuickActionCard title="Chat Channels" description="Chat with other school members and drivers" icon={MessageSquare} link="/dashboard/messages" />
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400">School Bulletins</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            {announcementsLoading && <div className="flex justify-center py-6"><Loader2 className="animate-spin text-indigo-400" /></div>}
                            {!announcementsLoading && announcements?.length === 0 && (
                                <p className="text-sm text-slate-500 italic uppercase font-black tracking-widest text-center py-10">No recent announcements.</p>
                            )}
                            {announcements?.slice(0, 3).map((a: any) => (
                                <ActivityItem key={a.id} title={a.title} description={a.content} time={a.publishedAt ? formatDistanceToNow(a.publishedAt.toDate(), { addSuffix: true }) : 'Just now'} icon={Bell} iconColor="text-indigo-400" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === 'routes' && (
                <div className="max-w-4xl mx-auto space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Route Stops Timeline</h3>
                    {activeRoute?.stops && activeRoute.stops.length > 0 ? (
                        <div className="relative border-l-2 border-indigo-200 ml-4 pl-6 space-y-6">
                            {activeRoute.stops.sort((a: any, b: any) => a.order - b.order).map((stop: Stop, idx: number) => {
                                const stopRiders = studentsOnStop(stop);
                                return (
                                    <div key={stop.id || idx} className="relative">
                                        {/* Dot */}
                                        <div className="absolute -left-10 top-1 h-8 w-8 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center font-bold text-indigo-600 text-xs shadow-sm">
                                            {stop.order}
                                        </div>
                                        <Card className="rounded-2xl border bg-white p-5 hover:border-indigo-200 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-extrabold text-slate-800 uppercase text-xs">{stop.name}</h4>
                                                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {stop.address}
                                                    </p>
                                                </div>
                                                <Badge className="bg-indigo-50 border-none text-indigo-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">{stopRiders.length} Students</Badge>
                                            </div>
                                            {stopRiders.length > 0 && (
                                                <div className="border-t mt-3 pt-3 space-y-2">
                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Students boarding here:</div>
                                                    <div className="grid md:grid-cols-2 gap-2">
                                                        {stopRiders.map(s => (
                                                            <div key={s.uid} className="flex justify-between items-center p-2 bg-slate-50 border border-slate-100 rounded-xl">
                                                                <div>
                                                                    <div className="font-extrabold text-slate-700 text-[11px] uppercase">{s.firstName} {s.lastName}</div>
                                                                    <div className="text-[9px] font-bold text-indigo-500 uppercase">{s.classId || 'No Class'}</div>
                                                                </div>
                                                                <span className="text-[9px] font-mono text-slate-400 font-bold">{s.parentPhone || 'No Phone'}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                            <RouteIcon className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs font-black uppercase text-slate-400">No stops assigned to your route driver ID.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'manifest' && (
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Passenger Rider Manifest</h3>
                        <Badge className="bg-indigo-50 text-indigo-700 border-none text-[10px] font-black uppercase px-3 py-1 rounded-full">{totalStudentsOnRoute} Total riders</Badge>
                    </div>
                    <Card className="rounded-[2rem] border bg-white overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-black uppercase text-[10px] tracking-wider py-4 pl-6">Student Rider</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-wider py-4">Assigned Stop</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-wider py-4">Classroom</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-wider py-4 pr-6 text-right">Emergency Contact</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeRoute?.stops?.flatMap((stop: Stop) => 
                                    studentsOnStop(stop).map((student) => (
                                        <TableRow key={student.uid} className="hover:bg-slate-50/50">
                                            <TableCell className="font-extrabold text-slate-800 uppercase text-xs py-3.5 pl-6">{student.firstName} {student.lastName}</TableCell>
                                            <TableCell className="font-bold text-indigo-650 uppercase text-xs py-3.5">{stop.name}</TableCell>
                                            <TableCell className="font-bold text-slate-500 uppercase text-xs py-3.5">{student.classId || 'N/A'}</TableCell>
                                            <TableCell className="font-mono text-slate-700 text-xs py-3.5 pr-6 text-right font-bold">{student.parentPhone || 'No registered contact'}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                                {totalStudentsOnRoute === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-12 text-slate-400 italic text-xs uppercase font-bold tracking-wider">No passenger student riders assigned to route stops.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Log History */}
                    <div className="xl:col-span-2 space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Fleet Operations Activity Logs</h3>
                        {sortedVehicleLogs && sortedVehicleLogs.length > 0 ? (
                            <div className="space-y-3">
                                {sortedVehicleLogs.map((log: any) => (
                                    <Card key={log.id} className="rounded-2xl border bg-white p-5 hover:shadow-sm transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-extrabold text-slate-800 uppercase text-xs">{log.busName} Odometer Log</h4>
                                                <p className="text-[11px] text-indigo-600 font-bold uppercase mt-1">Odometer: {log.odometerReading} km</p>
                                            </div>
                                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">
                                                {log.recordedAt?.toDate ? formatDistanceToNow(log.recordedAt.toDate(), { addSuffix: true }) : 'Just now'}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-xs">
                                            <div>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Fuel Volume</span>
                                                <span className="font-bold text-slate-800">{log.fuelAdded} Liters</span>
                                            </div>
                                            <div>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Refuel Cost</span>
                                                <span className="font-bold text-emerald-650">GH₵{log.cost?.toFixed(2) || '0.00'}</span>
                                            </div>
                                        </div>
                                        {log.maintenanceNotes && <p className="text-[11px] text-slate-500 italic mt-3 border-l-2 border-violet-500 pl-3">"{log.maintenanceNotes}"</p>}
                                        <div className="text-[9px] font-black uppercase text-slate-400 mt-2 text-right">Driver Sign: {log.driverName}</div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                                <BusIcon className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs font-black uppercase text-slate-400">No vehicle activity logs recorded. Input fuel & odometer logs.</p>
                            </div>
                        )}
                    </div>

                    {/* Logging Form */}
                    <Card className="rounded-3xl border-none shadow-lg bg-white p-6 h-fit">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Record Bus Activity</h4>
                        <form onSubmit={handleSaveVehicleLog} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Assigned Vehicle</label>
                                <Input value={activeBus ? `${activeBus.name} (${activeBus.capacity} seats)` : 'No active vehicle assigned'} disabled className="h-11 rounded-xl bg-slate-50 text-slate-500 font-bold" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Odometer Mileage (km)</label>
                                <Input type="number" value={vehForm.odometerReading} onChange={e => setVehForm({...vehForm, odometerReading: Number(e.target.value)})} required className="h-11 rounded-xl font-mono font-bold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Fuel Added (Liters)</label>
                                    <Input type="number" value={vehForm.fuelAdded} onChange={e => setVehForm({...vehForm, fuelAdded: Number(e.target.value)})} required className="h-11 rounded-xl font-mono font-bold" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Cost (GH₵)</label>
                                    <Input type="number" value={vehForm.cost} onChange={e => setVehForm({...vehForm, cost: Number(e.target.value)})} required className="h-11 rounded-xl font-mono font-bold" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Maintenance Remarks / Defects</label>
                                <textarea value={vehForm.maintenanceNotes} onChange={e => setVehForm({...vehForm, maintenanceNotes: e.target.value})} placeholder="Engine noise, brake squeaking, low tire pressure..." className="w-full h-24 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold" />
                            </div>
                            <Button type="submit" disabled={isSaving || !activeBus} className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl text-xs font-black uppercase">
                                {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />} Log Vehicle Status
                            </Button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}

// =========================================================================
// D. SECURITY OFFICER DASHBOARD
// =========================================================================
function SecurityDashboard({ profile, announcements, leaveRequests, announcementsLoading, isLoadingLeaves }: any) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'visitors' | 'gate' | 'incidents' | 'portal'>('portal');

    // Fetch visitors logs
    const visitorQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'visitor_logs'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: visitorLogs } = useCollection<any>(visitorQuery);

    const activeVisitors = useMemo(() => {
        return visitorLogs ? visitorLogs.filter((v: any) => v.status === 'Checked In') : [];
    }, [visitorLogs]);

    const sortedVisitorLogs = useMemo(() => {
        return visitorLogs ? [...visitorLogs].sort((a, b) => (b.timeIn?.seconds || 0) - (a.timeIn?.seconds || 0)) : [];
    }, [visitorLogs]);

    // Fetch gate logs
    const gateQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'gate_logs'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: gateLogs } = useCollection<any>(gateQuery);

    const sortedGateLogs = useMemo(() => {
        return gateLogs ? [...gateLogs].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)) : [];
    }, [gateLogs]);

    // Fetch incidents
    const incidentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'security_incidents'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: incidents } = useCollection<any>(incidentsQuery);

    const sortedIncidents = useMemo(() => {
        return incidents ? [...incidents].sort((a, b) => (b.reportedAt?.seconds || 0) - (a.reportedAt?.seconds || 0)) : [];
    }, [incidents]);

    // Forms State
    const [visitorForm, setVisitorForm] = useState({ visitorName: '', phone: '', hostName: '', purpose: '', badgeNumber: '' });
    const [gateForm, setGateForm] = useState({ type: 'Entry', vehiclePlate: '', driverName: '', occupantCount: 1, notes: '' });
    const [incidentForm, setIncidentForm] = useState({ title: '', description: '', location: '', urgency: 'Medium' });
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveVisitor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !schoolId || !visitorForm.visitorName) return;
        setIsSaving(true);
        const docId = `visitor-${Date.now()}`;
        try {
            await setDoc(doc(firestore, 'visitor_logs', docId), {
                ...visitorForm,
                timeIn: serverTimestamp(),
                timeOut: null,
                status: 'Checked In',
                schoolId
            });
            toast({ title: 'Visitor Registered', description: `Checked in ${visitorForm.visitorName}.` });
            setVisitorForm({ visitorName: '', phone: '', hostName: '', purpose: '', badgeNumber: '' });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to check in visitor.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCheckOutVisitor = async (visitor: any) => {
        if (!firestore) return;
        try {
            await setDoc(doc(firestore, 'visitor_logs', visitor.id), {
                ...visitor,
                status: 'Checked Out',
                timeOut: serverTimestamp()
            }, { merge: true });
            toast({ title: 'Visitor Checked Out', description: `${visitor.visitorName} has departed.` });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to check out visitor.' });
        }
    };

    const handleSaveGate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !schoolId) return;
        setIsSaving(true);
        const docId = `gate-${Date.now()}`;
        try {
            await setDoc(doc(firestore, 'gate_logs', docId), {
                ...gateForm,
                occupantCount: Number(gateForm.occupantCount),
                timestamp: serverTimestamp(),
                schoolId
            });
            toast({ title: 'Gate Entry Logged', description: `Plate: ${gateForm.vehiclePlate} logged.` });
            setGateForm({ type: 'Entry', vehiclePlate: '', driverName: '', occupantCount: 1, notes: '' });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to record gate activity.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveIncident = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !schoolId || !incidentForm.title) return;
        setIsSaving(true);
        const docId = `secincident-${Date.now()}`;
        try {
            await setDoc(doc(firestore, 'security_incidents', docId), {
                ...incidentForm,
                status: 'Open',
                reportedBy: displayName,
                reportedAt: serverTimestamp(),
                schoolId
            });
            toast({ title: 'Incident Logged', description: 'Security alert sent to director/admin desk.' });
            setIncidentForm({ title: '', description: '', location: '', urgency: 'Medium' });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to submit incident.' });
        } finally {
            setIsSaving(false);
        }
    };

    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Officer';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Visual Hero Mesh Banner */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-rose-950 text-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-rose-500/20">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <UserCheck className="h-48 w-48 transform rotate-12 text-slate-200" />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-slate-500/20 text-slate-300 border border-slate-500/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                Safety & Gate Desk
                            </span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest animate-pulse">
                                Gate Watch Active
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-tight text-white">
                            Security Deck: <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-rose-300">{displayName.toUpperCase()}</span> 👋
                        </h1>
                        <p className="text-slate-200 text-xs md:text-sm font-semibold max-w-xl">
                            Track guest visitor registers, log commercial and private vehicles, and submit safety incident folders.
                        </p>
                    </div>
                </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                <button onClick={() => setActiveTab('portal')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'portal' ? "bg-slate-850 text-white border-slate-850" : "bg-white text-slate-600 border-slate-100 hover:border-rose-200")}>General Portal</button>
                <button onClick={() => setActiveTab('visitors')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'visitors' ? "bg-slate-850 text-white border-slate-850" : "bg-white text-slate-600 border-slate-100 hover:border-rose-200")}>Visitor Register</button>
                <button onClick={() => setActiveTab('gate')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'gate' ? "bg-slate-850 text-white border-slate-850" : "bg-white text-slate-600 border-slate-100 hover:border-rose-200")}>Gate Vehicle Logs</button>
                <button onClick={() => setActiveTab('incidents')} className={cn("px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all shadow-sm whitespace-nowrap", activeTab === 'incidents' ? "bg-slate-850 text-white border-slate-850" : "bg-white text-slate-600 border-slate-100 hover:border-rose-200")}>Incidents & Safety Logs</button>
            </div>

            {/* STATS STRIP */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="rounded-[2rem] border-none shadow-md bg-white hover:shadow-lg transition-all relative overflow-hidden">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Checked-In Guests</p>
                            <h3 className="text-3xl font-black text-slate-900">{activeVisitors.length} Visitors</h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Guests currently inside campus</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-50 text-slate-650 shadow-inner">
                            <UserCheck className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-none shadow-md bg-white hover:shadow-lg transition-all relative overflow-hidden">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gate Pass Activity</p>
                            <h3 className="text-3xl font-black text-rose-650">
                                {sortedGateLogs?.filter((g: any) => {
                                    if (!g.timestamp) return false;
                                    return g.timestamp.toDate().toDateString() === new Date().toDateString();
                                }).length || 0} Logged
                            </h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Vehicles logged today</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-650 shadow-inner">
                            <Clock className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="rounded-[2rem] border-none shadow-md bg-white hover:shadow-lg transition-all relative overflow-hidden">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Security Incident Audits</p>
                            <h3 className="text-3xl font-black text-rose-800">
                                {sortedIncidents?.filter((i: any) => i.status === 'Open').length || 0} Open Alerts
                            </h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Incidents requiring supervision</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-red-50 text-red-650 shadow-inner">
                            <ShieldAlert className="h-6 w-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'portal' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-8 border-b">
                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Support Resources</CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick links for daily HR tasks.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-3">
                            <QuickActionCard title="My Attendance Records" description="View and log attendance punch records" icon={CalendarCheck} link="/dashboard/attendance/staff" />
                            <QuickActionCard title="Request Leave/Time Off" description="Request holidays or medical leaves" icon={FileText} link="/dashboard/hr/leave-management" />
                            <QuickActionCard title="Chat Channels" description="Chat with other school members and security team" icon={MessageSquare} link="/dashboard/messages" />
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-rose-400">School Bulletins</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            {announcementsLoading && <div className="flex justify-center py-6"><Loader2 className="animate-spin text-rose-400" /></div>}
                            {!announcementsLoading && announcements?.length === 0 && (
                                <p className="text-sm text-slate-500 italic uppercase font-black tracking-widest text-center py-10">No recent announcements.</p>
                            )}
                            {announcements?.slice(0, 3).map((a: any) => (
                                <ActivityItem key={a.id} title={a.title} description={a.content} time={a.publishedAt ? formatDistanceToNow(a.publishedAt.toDate(), { addSuffix: true }) : 'Just now'} icon={Bell} iconColor="text-rose-400" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}

            {activeTab === 'visitors' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Visitor log */}
                    <div className="xl:col-span-2 space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Register of Campus Visitors</h3>
                        {sortedVisitorLogs && sortedVisitorLogs.length > 0 ? (
                            <div className="space-y-3">
                                {sortedVisitorLogs.map((visitor: any) => {
                                    const isInside = visitor.status === 'Checked In';
                                    return (
                                        <Card key={visitor.id} className="rounded-2xl border bg-white p-5 hover:shadow-sm transition-all flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-extrabold text-slate-800 uppercase text-xs">{visitor.visitorName}</h4>
                                                    <Badge className="bg-slate-100 hover:bg-slate-100 border-none text-slate-600 text-[8px] font-black uppercase rounded-full">Badge #{visitor.badgeNumber || 'N/A'}</Badge>
                                                    <Badge className={cn("text-[8px] font-black px-2 py-0.5 rounded-full border-none",
                                                        isInside ? "bg-rose-100 text-rose-800 animate-pulse" : "bg-slate-100 text-slate-600"
                                                    )}>{visitor.status}</Badge>
                                                </div>
                                                <p className="text-[11px] text-slate-500 font-bold uppercase mt-1">Host: {visitor.hostName} • Purpose: {visitor.purpose}</p>
                                                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mt-1">
                                                    In: {visitor.timeIn?.toDate ? format(visitor.timeIn.toDate(), 'PPP p') : 'Just now'}
                                                    {!isInside && visitor.timeOut?.toDate && ` • Out: ${format(visitor.timeOut.toDate(), 'p')}`}
                                                </span>
                                            </div>
                                            {isInside && (
                                                <Button onClick={() => handleCheckOutVisitor(visitor)} size="sm" className="bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[10px] rounded-xl">Check Out</Button>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                                <UserCheck className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs font-black uppercase text-slate-400">No visitors logged today. Enter new visitor details.</p>
                            </div>
                        )}
                    </div>

                    {/* Visitor Form */}
                    <Card className="rounded-3xl border-none shadow-lg bg-white p-6 h-fit">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Guest Check-In Form</h4>
                        <form onSubmit={handleSaveVisitor} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Visitor Full Name</label>
                                <Input value={visitorForm.visitorName} onChange={e => setVisitorForm({...visitorForm, visitorName: e.target.value})} placeholder="e.g. John Doe" required className="h-11 rounded-xl" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Phone Number</label>
                                <Input value={visitorForm.phone} onChange={e => setVisitorForm({...visitorForm, phone: e.target.value})} placeholder="e.g. +233 24 000 0000" required className="h-11 rounded-xl" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Staff Host</label>
                                <Input value={visitorForm.hostName} onChange={e => setVisitorForm({...visitorForm, hostName: e.target.value})} placeholder="e.g. Mr. Anim (Head Teacher)" required className="h-11 rounded-xl" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Purpose of Visit</label>
                                <Input value={visitorForm.purpose} onChange={e => setVisitorForm({...visitorForm, purpose: e.target.value})} placeholder="e.g. Fees discussion, Pick up child" required className="h-11 rounded-xl" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Badge Number Allocated</label>
                                <Input value={visitorForm.badgeNumber} onChange={e => setVisitorForm({...visitorForm, badgeNumber: e.target.value})} placeholder="e.g. SEC-045" required className="h-11 rounded-xl" />
                            </div>
                            <Button type="submit" disabled={isSaving} className="w-full bg-slate-800 hover:bg-slate-700 h-11 rounded-xl text-xs font-black uppercase">
                                {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />} Authorize Check-In
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {activeTab === 'gate' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Gate log timeline */}
                    <div className="xl:col-span-2 space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Gate Passage Activity Logs</h3>
                        {sortedGateLogs && sortedGateLogs.length > 0 ? (
                            <div className="space-y-3">
                                {sortedGateLogs.map((log: any) => (
                                    <Card key={log.id} className="rounded-2xl border bg-white p-5 hover:shadow-sm transition-all flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-extrabold text-slate-800 uppercase text-xs">{log.vehiclePlate} ({log.driverName || 'No driver name'})</h4>
                                                <Badge className={cn("text-[8px] font-black px-2 py-0.5 rounded-full border-none",
                                                    log.type === 'Entry' ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                                                )}>{log.type}</Badge>
                                                <Badge className="bg-slate-100 hover:bg-slate-100 border-none text-slate-500 text-[8px] font-black rounded-full">{log.occupantCount} Occupants</Badge>
                                            </div>
                                            {log.notes && <p className="text-[11px] text-slate-500 italic">"Notes: {log.notes}"</p>}
                                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mt-1">
                                                {log.timestamp?.toDate ? format(log.timestamp.toDate(), 'PPP p') : 'Just now'}
                                            </span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                                <Clock className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs font-black uppercase text-slate-400">No gate activity registered. Track vehicles here.</p>
                            </div>
                        )}
                    </div>

                    {/* Gate log Form */}
                    <Card className="rounded-3xl border-none shadow-lg bg-white p-6 h-fit">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Gate Passage Record</h4>
                        <form onSubmit={handleSaveGate} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Passage Type</label>
                                <select value={gateForm.type} onChange={e => setGateForm({...gateForm, type: e.target.value})} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
                                    {['Entry', 'Exit'].map(t => <option key={t} value={t}>{t} Passage</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Vehicle Plate Number</label>
                                <Input value={gateForm.vehiclePlate} onChange={e => setGateForm({...gateForm, vehiclePlate: e.target.value.toUpperCase()})} placeholder="e.g. GR-2420-25" required className="h-11 rounded-xl font-mono font-bold" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Driver Name / Company</label>
                                <Input value={gateForm.driverName} onChange={e => setGateForm({...gateForm, driverName: e.target.value})} placeholder="e.g. Kwesi Manu (Taxi)" required className="h-11 rounded-xl" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Occupants Count</label>
                                <Input type="number" value={gateForm.occupantCount} onChange={e => setGateForm({...gateForm, occupantCount: Number(e.target.value)})} required className="h-11 rounded-xl" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Gate Notes</label>
                                <textarea value={gateForm.notes} onChange={e => setGateForm({...gateForm, notes: e.target.value})} placeholder="Delivering stationery, parent drop-off, etc..." className="w-full h-20 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold" />
                            </div>
                            <Button type="submit" disabled={isSaving} className="w-full bg-slate-800 hover:bg-slate-700 h-11 rounded-xl text-xs font-black uppercase">
                                {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />} Log Gate Entry/Exit
                            </Button>
                        </form>
                    </Card>
                </div>
            )}

            {activeTab === 'incidents' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Incident reports */}
                    <div className="xl:col-span-2 space-y-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Active Safety Incident Register</h3>
                        {sortedIncidents && sortedIncidents.length > 0 ? (
                            <div className="space-y-3">
                                {sortedIncidents.map((incident: any) => (
                                    <Card key={incident.id} className="rounded-2xl border bg-white p-5 hover:shadow-sm transition-all flex justify-between items-start">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h4 className="font-extrabold text-slate-800 uppercase text-xs">{incident.title}</h4>
                                                <Badge className="bg-slate-100 hover:bg-slate-100 border-none text-slate-650 text-[8px] font-black uppercase rounded-full">Loc: {incident.location}</Badge>
                                                <Badge className={cn("text-[8px] font-black px-2 py-0.5 rounded-full border-none",
                                                    incident.urgency === 'Critical' ? "bg-rose-650 text-white animate-bounce" :
                                                    incident.urgency === 'High' ? "bg-rose-100 text-rose-800 animate-pulse" :
                                                    incident.urgency === 'Medium' ? "bg-amber-100 text-amber-800" :
                                                    "bg-blue-100 text-blue-800"
                                                )}>{incident.urgency}</Badge>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1">"{incident.description}"</p>
                                            <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mt-1">
                                                Logged by {incident.reportedBy} • {incident.reportedAt?.toDate ? formatDistanceToNow(incident.reportedAt.toDate(), { addSuffix: true }) : 'Just now'}
                                            </span>
                                        </div>
                                        <Badge className={cn("text-[10px] font-black uppercase px-2.5 py-1 rounded-full",
                                            incident.status === 'Open' ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
                                        )}>{incident.status}</Badge>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
                                <ShieldAlert className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs font-black uppercase text-slate-400">No security incidents logged. All systems safe.</p>
                            </div>
                        )}
                    </div>

                    {/* Incident Report Form */}
                    <Card className="rounded-3xl border-none shadow-lg bg-white p-6 h-fit">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Log Security Incident</h4>
                        <form onSubmit={handleSaveIncident} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Incident Headline</label>
                                <Input value={incidentForm.title} onChange={e => setIncidentForm({...incidentForm, title: e.target.value})} placeholder="e.g. Suspicious vehicle, Gate lock issue" required className="h-11 rounded-xl" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Urgency Level</label>
                                <select value={incidentForm.urgency} onChange={e => setIncidentForm({...incidentForm, urgency: e.target.value})} className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
                                    {['Low', 'Medium', 'High', 'Critical'].map(u => <option key={u} value={u}>{u} Severity</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Area / Location</label>
                                <Input value={incidentForm.location} onChange={e => setIncidentForm({...incidentForm, location: e.target.value})} placeholder="e.g. Main Gate, Back Playground" required className="h-11 rounded-xl" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Incident Details</label>
                                <textarea value={incidentForm.description} onChange={e => setIncidentForm({...incidentForm, description: e.target.value})} placeholder="Provide timelines, witnesses, suspects description, license plates..." required className="w-full h-24 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold" />
                            </div>
                            <Button type="submit" disabled={isSaving} className="w-full bg-rose-650 hover:bg-rose-700 text-white h-11 rounded-xl text-xs font-black uppercase tracking-wide">
                                {isSaving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <ShieldAlert className="h-4 w-4 mr-2" />} Dispatch Security Log
                            </Button>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}

// =========================================================================
// E. SUPPORT STAFF DASHBOARD ROUTER (Verified compile-ready)
// =========================================================================
function SupportStaffDashboard({ role, profile, leaveRequests, announcements, isLoading, announcementsLoading }: any) {
    if (role === 'Cook') {
        return <CookDashboard profile={profile} announcements={announcements} leaveRequests={leaveRequests} announcementsLoading={announcementsLoading} isLoadingLeaves={isLoading} />;
    }
    if (role === 'Cleaner') {
        return <CleanerDashboard profile={profile} announcements={announcements} leaveRequests={leaveRequests} announcementsLoading={announcementsLoading} isLoadingLeaves={isLoading} />;
    }
    if (role === 'Transport Staff') {
        return <TransportDashboard profile={profile} announcements={announcements} leaveRequests={leaveRequests} announcementsLoading={announcementsLoading} isLoadingLeaves={isLoading} />;
    }
    if (role === 'Security Officer') {
        return <SecurityDashboard profile={profile} announcements={announcements} leaveRequests={leaveRequests} announcementsLoading={announcementsLoading} isLoadingLeaves={isLoading} />;
    }

    // Default Support Portal fallback (for other support roles)
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

function TeacherDashboard({ profile, classes, students, assessments, announcements, isLoading }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Teacher';
    const { toast } = useToast();
    
    // Class selection state
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'roster' | 'performance' | 'bulletins'>('roster');
    
    // AI Form state
    const [aiTopic, setAiTopic] = useState('');
    const [aiSubject, setAiSubject] = useState('');
    const [aiGrade, setAiGrade] = useState('');
    const [isDrafting, setIsDrafting] = useState(false);

    // Sync selected class with classes data
    const activeClassId = selectedClassId || classes?.[0]?.id || '';
    const activeClass = classes?.find((c: any) => c.id === activeClassId);

    // Calculations
    const classStudents = useMemo(() => {
        if (!students || !activeClassId) return [];
        return students.filter((s: any) => s.classId === activeClassId);
    }, [students, activeClassId]);

    const classAssessments = useMemo(() => {
        if (!assessments || !activeClassId) return [];
        return assessments.filter((a: any) => a.classId === activeClassId);
    }, [assessments, activeClassId]);

    const classAttendanceAvg = useMemo(() => {
        if (classStudents.length === 0) return 95;
        const total = classStudents.reduce((sum: number, s: any) => sum + (Number(s.attendanceRate) || 95), 0);
        return Math.round(total / classStudents.length);
    }, [classStudents]);

    const classAvgPct = useMemo(() => {
        if (classAssessments.length === 0) return 0;
        let totalPct = 0;
        let count = 0;
        classAssessments.forEach((a: any) => {
            const score = Number(a.score) || 0;
            const max = Number(a.maxScore) || 100;
            if (max > 0) {
                totalPct += (score / max) * 100;
                count++;
            }
        });
        return count > 0 ? Math.round(totalPct / count) : 0;
    }, [classAssessments]);

    // Student performance details: score average for each student in the selected class
    const studentPerformance = useMemo(() => {
        const performance: Record<string, { name: string; totalPct: number; count: number; uid: string }> = {};
        
        classStudents.forEach((s: any) => {
            performance[s.uid] = { name: `${s.firstName || ''} ${s.lastName || ''}`, totalPct: 0, count: 0, uid: s.uid };
        });

        classAssessments.forEach((a: any) => {
            if (performance[a.studentId]) {
                const score = Number(a.score) || 0;
                const max = Number(a.maxScore) || 100;
                if (max > 0) {
                    performance[a.studentId].totalPct += (score / max) * 100;
                    performance[a.studentId].count++;
                }
            }
        });

        return Object.values(performance).map(p => {
            const average = p.count > 0 ? Math.round(p.totalPct / p.count) : 0;
            return {
                ...p,
                average,
                gradedCount: p.count
            };
        });
    }, [classStudents, classAssessments]);

    // Subject breakdown
    const subjectAverages = useMemo(() => {
        const averages: Record<string, { totalPct: number; count: number }> = {};
        classAssessments.forEach((a: any) => {
            const score = Number(a.score) || 0;
            const max = Number(a.maxScore) || 100;
            const subjName = a.subjectName || 'General';
            if (max > 0) {
                if (!averages[subjName]) {
                    averages[subjName] = { totalPct: 0, count: 0 };
                }
                averages[subjName].totalPct += (score / max) * 100;
                averages[subjName].count++;
            }
        });

        return Object.entries(averages).map(([name, data]) => ({
            name,
            average: Math.round(data.totalPct / data.count),
            count: data.count
        }));
    }, [classAssessments]);

    // Top performers & students needing support
    const topPerformers = useMemo(() => {
        return [...studentPerformance]
            .filter(p => p.gradedCount > 0)
            .sort((a, b) => b.average - a.average)
            .slice(0, 3);
    }, [studentPerformance]);

    const strugglingStudents = useMemo(() => {
        return [...studentPerformance]
            .filter(p => p.gradedCount > 0 && p.average < 50)
            .sort((a, b) => a.average - b.average);
    }, [studentPerformance]);

    const handleCreateAiLessonPlanDraft = (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiTopic) {
            toast({ variant: 'destructive', title: "Topic required", description: "Please enter a topic to plan." });
            return;
        }
        setIsDrafting(true);
        try {
            const draft = {
                topic: aiTopic,
                subject: aiSubject,
                grade: aiGrade || activeClass?.name || '',
                date: new Date().toISOString()
            };
            sessionStorage.setItem('ai_lesson_draft', JSON.stringify(draft));
            toast({ title: "Lesson Draft Prepared", description: "Redirecting to Lesson Planner..." });
            setTimeout(() => {
                window.location.href = '/dashboard/lesson-planning';
            }, 1000);
        } catch (err) {
            console.error(err);
            setIsDrafting(false);
        }
    };

    const handleSendSmsToParent = async (student: any) => {
        if (!student.parentPhone) {
            toast({ variant: 'destructive', title: "SMS Error", description: "No parent phone number registered for this student." });
            return;
        }
        const text = `Hello parent, this is from ${student.firstName}'s class teacher. We wanted to touch base regarding their classroom performance and engagement. Please contact us when free.`;
        toast({ title: "Sending SMS...", description: "Connecting to SMS Gateway" });
        try {
            const res = await sendSchoolSMSAction(student.parentPhone, text, student.schoolId);
            if (res.success) {
                toast({ title: "SMS Sent", description: `Message delivered to ${student.firstName}'s parent.` });
            } else {
                toast({ variant: 'destructive', title: "SMS Failed", description: res.error || "Could not deliver message." });
            }
        } catch (err: any) {
            toast({ variant: 'destructive', title: "Error", description: err.message || "Failed to trigger SMS." });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Visual Hero Mesh Banner */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-violet-900 via-indigo-950 to-slate-900 text-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-violet-800/20">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <GraduationCap className="h-48 w-48 transform rotate-12 text-violet-300" />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                Academic Console
                            </span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                Term Portal Active
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-tight text-white">
                            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">{displayName.toUpperCase()}</span>! 👋
                        </h1>
                        <p className="text-slate-300 text-xs md:text-sm font-semibold max-w-xl">
                            Empowering classroom leaders. Review active rosters, track student grading averages, and utilize AI planning copilots.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-between">
                        <div className="flex gap-2">
                            <Button asChild className="bg-violet-600 hover:bg-violet-500 text-white font-black rounded-2xl text-xs uppercase h-11 px-6 shadow-lg shadow-violet-900/30">
                                <Link href="/dashboard/attendance">Take Attendance</Link>
                            </Button>
                            <Button asChild variant="outline" className="border-white/10 hover:bg-white/10 text-white font-black rounded-2xl text-xs uppercase h-11 px-5">
                                <Link href="/dashboard/academics/gradebook/manual-entry">Manual Grade Entry</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Classrooms Selector Scrollbar */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Active Classroom</h3>
                    {classes && classes.length > 0 && (
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight bg-slate-100 px-2.5 py-1 rounded-full">
                            {classes.length} Classrooms
                        </span>
                    )}
                </div>
                {classes && classes.length > 0 ? (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                        {classes.map((c: any) => {
                            const isActive = c.id === activeClassId;
                            const studentCount = students?.filter((s: any) => s.classId === c.id).length || 0;
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedClassId(c.id)}
                                    className={cn(
                                        "px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all flex items-center gap-3 shadow-sm whitespace-nowrap",
                                        isActive
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-100/40"
                                            : "bg-white text-slate-600 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/10"
                                    )}
                                >
                                    <span>{c.name}</span>
                                    <span className={cn(
                                        "text-[9px] font-black px-2 py-0.5 rounded-full",
                                        isActive ? "bg-indigo-500 text-indigo-100" : "bg-slate-100 text-slate-500"
                                    )}>
                                        {studentCount} Students
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-white border border-dashed rounded-[2rem] border-slate-200">
                        <School className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-black text-slate-500 uppercase">No classrooms assigned to this school</p>
                    </div>
                )}
            </div>

            {/* Dynamic KPI Gauges and Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Size */}
                <Card className="hover:shadow-md transition-all border-l-4 border-l-violet-500 overflow-hidden relative rounded-[2rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Class Roll Call</p>
                                <h3 className="text-3xl font-black text-slate-900">
                                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-200" /> : classStudents.length}
                                </h3>
                                <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Active enrollments in {activeClass?.name || 'Class'}</p>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-violet-50 text-violet-600 shadow-inner">
                                <Users className="h-5.5 w-5.5" />
                            </div>
                        </div>
                        <Users className="absolute -right-4 -bottom-4 h-24 w-24 text-slate-55 opacity-[0.03]" />
                    </CardContent>
                </Card>

                {/* Academic Average Gauge */}
                <Card className="hover:shadow-md transition-all border-l-4 border-l-indigo-500 overflow-hidden relative rounded-[2rem]">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1 relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Class Assessment Average</p>
                            <h3 className="text-3xl font-black text-slate-900">
                                {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-200" /> : `${classAvgPct}%`}
                            </h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Across {classAssessments.length} assessment logs</p>
                        </div>
                        <div className="relative flex items-center justify-center w-16 h-16 shrink-0 z-10">
                            <svg className="absolute w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="26" stroke="#e2e8f0" strokeWidth="4.5" fill="transparent" />
                                <circle cx="32" cy="32" r="26" stroke="#6366f1" strokeWidth="4.5" fill="transparent"
                                        strokeDasharray={163.36}
                                        strokeDashoffset={163.36 - (163.36 * classAvgPct) / 100}
                                        strokeLinecap="round" />
                            </svg>
                            <TrendingUp className="h-5 w-5 text-indigo-600 relative z-10" />
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance Average Gauge */}
                <Card className="hover:shadow-md transition-all border-l-4 border-l-emerald-500 overflow-hidden relative rounded-[2rem]">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1 relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Class Attendance Pulse</p>
                            <h3 className="text-3xl font-black text-slate-900">
                                {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-200" /> : `${classAttendanceAvg}%`}
                            </h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Average daily attendance rate</p>
                        </div>
                        <div className="relative flex items-center justify-center w-16 h-16 shrink-0 z-10">
                            <svg className="absolute w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="26" stroke="#e2e8f0" strokeWidth="4.5" fill="transparent" />
                                <circle cx="32" cy="32" r="26" stroke="#10b981" strokeWidth="4.5" fill="transparent"
                                        strokeDasharray={163.36}
                                        strokeDashoffset={163.36 - (163.36 * classAttendanceAvg) / 100}
                                        strokeLinecap="round" />
                            </svg>
                            <CalendarCheck className="h-5 w-5 text-emerald-600 relative z-10" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* Left side: Advisory tabs and content */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                        {/* Tab Selector */}
                        <div className="flex gap-4 border-b border-slate-100 pb-4 mb-6">
                            <button
                                onClick={() => setActiveTab('roster')}
                                className={cn(
                                    "pb-1 border-b-2 font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2",
                                    activeTab === 'roster'
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <Users className="h-4 w-4" />
                                Classroom Roster
                            </button>
                            <button
                                onClick={() => setActiveTab('performance')}
                                className={cn(
                                    "pb-1 border-b-2 font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2",
                                    activeTab === 'performance'
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <TrendingUp className="h-4 w-4" />
                                Performance Analytics
                            </button>
                            <button
                                onClick={() => setActiveTab('bulletins')}
                                className={cn(
                                    "pb-1 border-b-2 font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2",
                                    activeTab === 'bulletins'
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <Bell className="h-4 w-4" />
                                BulletinsNotice
                            </button>
                        </div>

                        {/* Roster Tab */}
                        {activeTab === 'roster' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">Class Roster List</h4>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Showing {classStudents.length} Students
                                    </span>
                                </div>
                                
                                {classStudents.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {classStudents.map((s: any) => {
                                            const initials = `${s.firstName?.[0] || ''}${s.lastName?.[0] || ''}`.toUpperCase();
                                            const rate = Number(s.attendanceRate) || 95;
                                            return (
                                                <div key={s.uid} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 hover:scale-[1.01] hover:bg-white hover:border-indigo-100 transition-all duration-200">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs border border-indigo-200 shrink-0">
                                                            {initials || 'ST'}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">
                                                                {s.firstName} {s.lastName}
                                                            </p>
                                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                                Parent: {s.parentPhone || 'No Phone'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={cn(
                                                            "border-none text-[8px] font-black tracking-wider px-2 py-0.5 rounded-full uppercase",
                                                            rate >= 90 ? "bg-emerald-100 text-emerald-800" :
                                                            rate >= 80 ? "bg-amber-100 text-amber-800" :
                                                            "bg-rose-100 text-rose-800"
                                                        )}>
                                                            {rate}% Attend
                                                        </Badge>
                                                        
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost" 
                                                            className="h-8 w-8 text-slate-400 hover:text-indigo-600 rounded-xl"
                                                            onClick={() => handleSendSmsToParent(s)}
                                                            title="Send parent SMS"
                                                        >
                                                            <Send className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-slate-50 border border-dashed rounded-[2rem]">
                                        <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">No students registered in this class</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Performance Tab */}
                        {activeTab === 'performance' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                {/* Subject Averages */}
                                <div className="space-y-3">
                                    <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">Subject-wise Score Averages</h4>
                                    {subjectAverages.length > 0 ? (
                                        <div className="space-y-3">
                                            {subjectAverages.map((sub: any) => (
                                                <div key={sub.name} className="space-y-1 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                                                    <div className="flex justify-between items-center text-xs font-black uppercase text-slate-700">
                                                        <span>{sub.name}</span>
                                                        <span>{sub.average}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                                        <div 
                                                            className={cn(
                                                                "h-full rounded-full transition-all duration-500",
                                                                sub.average >= 75 ? "bg-emerald-500" :
                                                                sub.average >= 50 ? "bg-indigo-500" :
                                                                "bg-rose-500"
                                                            )}
                                                            style={{ width: `${sub.average}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase font-black">Based on {sub.count} grading entries</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center bg-slate-50 border border-dashed rounded-xl text-slate-400 italic text-xs uppercase tracking-widest font-black">
                                            No graded subject logs found
                                        </div>
                                    )}
                                </div>

                                {/* Top Performers and Struggling Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    {/* Top Performers */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-1.5 text-amber-600 border-b pb-1.5">
                                            <Award className="h-4 w-4" />
                                            <h5 className="font-black text-xs uppercase tracking-wider">Top Class Performers</h5>
                                        </div>
                                        {topPerformers.length > 0 ? (
                                            <div className="space-y-2">
                                                {topPerformers.map((p: any, idx: number) => (
                                                    <div key={p.uid} className="flex items-center justify-between p-3 bg-amber-50/30 border border-amber-100 rounded-xl">
                                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                                            <span className="text-amber-500 font-black text-sm">
                                                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                                                            </span>
                                                            {p.name}
                                                        </span>
                                                        <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{p.average}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[10px] text-slate-400 italic uppercase font-black tracking-widest">No stats loaded</p>
                                        )}
                                    </div>

                                    {/* Support Needed */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-1.5 text-rose-600 border-b pb-1.5">
                                            <AlertTriangle className="h-4 w-4" />
                                            <h5 className="font-black text-xs uppercase tracking-wider">Academic Intervention</h5>
                                        </div>
                                        {strugglingStudents.length > 0 ? (
                                            <div className="space-y-2">
                                                {strugglingStudents.map((p: any) => (
                                                    <div key={p.uid} className="flex items-center justify-between p-3 bg-rose-50/30 border border-rose-100 rounded-xl">
                                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                                            <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                                                            {p.name}
                                                        </span>
                                                        <span className="text-xs font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">{p.average}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-emerald-50/30 border border-emerald-100 rounded-xl text-center">
                                                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">All students above passing mark</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notices Tab */}
                        {activeTab === 'bulletins' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="border-b border-slate-100 pb-3 mb-2">
                                    <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">School Bulletins</h4>
                                </div>
                                {announcements && announcements.length > 0 ? (
                                    <div className="space-y-4">
                                        {announcements.map((a: any) => (
                                            <div key={a.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <h5 className="font-black text-xs uppercase tracking-tight text-slate-800">{a.title}</h5>
                                                    <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">{a.audience || 'Everybody'}</span>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed whitespace-pre-wrap">{a.content}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase pt-1 border-t border-slate-200/40">
                                                    Posted {a.publishedAt?.toDate ? formatDistanceToNow(a.publishedAt.toDate(), { addSuffix: true }) : 'Just now'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-400 italic text-xs uppercase tracking-widest font-black">No announcements posted</div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right side: AI planner copilot and Quick Shortcuts */}
                <div className="lg:col-span-2 space-y-6">
                    {/* AI Copilot Widget */}
                    <Card className="rounded-[2.5rem] bg-slate-900 border-none shadow-xl overflow-hidden text-white p-6 relative">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                            <BrainCircuit className="h-32 w-32 text-emerald-400" />
                        </div>
                        
                        <div className="space-y-1 mb-5">
                            <CardTitle className="text-lg font-black text-emerald-400 flex items-center gap-2 uppercase italic tracking-tight">
                                <BrainCircuit className="h-5 w-5" /> AI Lesson Copilot
                            </CardTitle>
                            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                                Draft topic notes & syllabus guides dynamically
                            </p>
                        </div>

                        <form onSubmit={handleCreateAiLessonPlanDraft} className="space-y-4 relative z-10">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Lesson Topic</label>
                                <Input 
                                    placeholder="e.g. Photosynthesis, Fractions introduction" 
                                    value={aiTopic}
                                    onChange={(e: any) => setAiTopic(e.target.value)}
                                    className="bg-white/5 border-white/10 focus:border-emerald-500 text-white rounded-xl placeholder:text-slate-500 text-xs h-10"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Subject</label>
                                    <Input 
                                        placeholder="e.g. Science, Maths" 
                                        value={aiSubject}
                                        onChange={(e: any) => setAiSubject(e.target.value)}
                                        className="bg-white/5 border-white/10 focus:border-emerald-500 text-white rounded-xl placeholder:text-slate-500 text-xs h-10"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Target Class</label>
                                    <Input 
                                        placeholder="e.g. Grade 5, Nursery 2" 
                                        value={aiGrade}
                                        onChange={(e: any) => setAiGrade(e.target.value)}
                                        className="bg-white/5 border-white/10 focus:border-emerald-500 text-white rounded-xl placeholder:text-slate-500 text-xs h-10"
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isDrafting}
                                className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-slate-955 font-black rounded-xl shadow-lg transition-transform active:scale-95 text-xs uppercase tracking-wider mt-2 flex items-center justify-center gap-2"
                            >
                                {isDrafting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 fill-current" />}
                                Draft AI Lesson Plan
                            </Button>
                        </form>
                    </Card>

                    {/* Quick Links Console */}
                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Quick Link Shortcuts</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/dashboard/attendance" className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-150 hover:bg-indigo-50/20 transition-all flex flex-col items-center text-center gap-1.5 group">
                                <CalendarCheck className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Attendance</span>
                            </Link>
                            <Link href="/dashboard/academics/gradebook/manual-entry" className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-150 hover:bg-indigo-50/20 transition-all flex flex-col items-center text-center gap-1.5 group">
                                <TrendingUp className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Gradebook</span>
                            </Link>
                            <Link href="/dashboard/lesson-planning" className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-150 hover:bg-indigo-50/20 transition-all flex flex-col items-center text-center gap-1.5 group">
                                <FileText className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Lesson Plans</span>
                            </Link>
                            <Link href="/dashboard/assignments" className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-150 hover:bg-indigo-50/20 transition-all flex flex-col items-center text-center gap-1.5 group">
                                <PlusCircle className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Quizzes</span>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ParentDashboard({ 
  profile, 
  children, 
  financials, 
  announcements, 
  isLoading, 
  schoolSettings,
  stickers,
  assessments,
  attendance,
  subjects,
  selectedChildId,
  setSelectedChildId,
  classAssessments
}: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Parent';
    const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'financials' | 'notices'>('overview');

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

    const activeChildId = selectedChildId || children?.[0]?.uid || '';
    const activeChild = children?.find((c: any) => c.uid === activeChildId);

    const activeChildStickers = useMemo(() => {
        if (!stickers || !activeChildId) return [];
        return stickers.filter((s: any) => s.userId === activeChildId);
    }, [stickers, activeChildId]);

    const activeChildAssessments = useMemo(() => {
        if (!assessments || !activeChildId) return [];
        const filtered = assessments.filter((a: any) => a.studentId === activeChildId);
        return [...filtered].sort((a: any, b: any) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
            return dateB - dateA;
        });
    }, [assessments, activeChildId]);

    const activeChildAttendance = useMemo(() => {
        if (!attendance || !activeChildId) return [];
        const filtered = attendance.filter((a: any) => a.studentId === activeChildId);
        return [...filtered].sort((a: any, b: any) => {
            const dateA = a.date?.toDate ? a.date.toDate().getTime() : 0;
            const dateB = b.date?.toDate ? b.date.toDate().getTime() : 0;
            return dateB - dateA;
        });
    }, [attendance, activeChildId]);

    const attendanceStats = useMemo(() => {
        if (activeChildAttendance.length === 0) {
            return {
                total: 0,
                present: 0,
                absent: 0,
                late: 0,
                rate: activeChild?.attendanceRate || 95
            };
        }
        const total = activeChildAttendance.length;
        const present = activeChildAttendance.filter((a: any) => a.status === 'Present').length;
        const late = activeChildAttendance.filter((a: any) => a.status === 'Late').length;
        const absent = activeChildAttendance.filter((a: any) => a.status === 'Absent').length;
        const rate = Math.round(((present + late) / total) * 100);
        return { total, present, absent, late, rate };
    }, [activeChildAttendance, activeChild]);

    const classSubjectAverages = useMemo(() => {
        if (!classAssessments) return {};
        const averages: Record<string, { totalPct: number; count: number }> = {};
        classAssessments.forEach((a: any) => {
            const score = Number(a.score) || 0;
            const max = Number(a.maxScore) || 100;
            if (max > 0) {
                const pct = (score / max) * 100;
                const sub = subjects?.find((s: any) => s.id === a.subjectId);
                const subName = sub?.name || a.subjectName || 'Other';
                if (!averages[subName]) {
                    averages[subName] = { totalPct: 0, count: 0 };
                }
                averages[subName].totalPct += pct;
                averages[subName].count++;
            }
        });
        const result: Record<string, number> = {};
        Object.entries(averages).forEach(([name, data]) => {
            result[name] = Math.round(data.totalPct / data.count);
        });
        return result;
    }, [classAssessments, subjects]);

    const subjectAverages = useMemo(() => {
        const averages: Record<string, { totalPct: number; count: number; name: string }> = {};
        activeChildAssessments.forEach((a: any) => {
            const score = Number(a.score) || 0;
            const max = Number(a.maxScore) || 100;
            if (max > 0) {
                const pct = (score / max) * 100;
                const sub = subjects?.find((s: any) => s.id === a.subjectId);
                const subName = sub?.name || a.subjectName || 'Other';
                if (!averages[subName]) {
                    averages[subName] = { totalPct: 0, count: 0, name: subName };
                }
                averages[subName].totalPct += pct;
                averages[subName].count++;
            }
        });
        return Object.values(averages).map(avg => {
            const childAvg = Math.round(avg.totalPct / avg.count);
            const classAvg = classSubjectAverages[avg.name] || 0;
            return {
                name: avg.name,
                average: childAvg,
                classAverage: classAvg
            };
        });
    }, [activeChildAssessments, subjects, classSubjectAverages]);

    const banners = {
      overview: {
        gradient: "from-indigo-900 via-indigo-950 to-slate-900 border-indigo-500/20",
        title: "Family Operations Control",
        description: "Unified overview of your children's enrollment details, attendance rates, billing metrics, and alerts.",
        badge: "Parent Portal Overview",
        badgeColor: "bg-indigo-500/20 text-indigo-300",
        icon: LayoutTemplate,
      },
      academics: {
        gradient: "from-purple-900 via-purple-950 to-indigo-950 border-purple-500/20",
        title: "Academic Progress & Rewards",
        description: "Track your child's badges, milestones, and earned stickers from Nursery Bloom and junior learning clubs.",
        badge: "Student Achievements",
        badgeColor: "bg-purple-500/20 text-purple-300",
        icon: Award,
      },
      financials: {
        gradient: "from-emerald-950 via-slate-900 to-indigo-950 border-emerald-500/20",
        title: "Family Fees & Accounts Ledger",
        description: "Comprehensive list of term billings, payments made, waivers granted, and current ledger balances.",
        badge: "Financial Overview",
        badgeColor: "bg-emerald-500/20 text-emerald-300",
        icon: Banknote,
      },
      notices: {
        gradient: "from-slate-900 via-slate-950 to-indigo-950 border-slate-700/20",
        title: "School Bulletins & Announcements",
        description: "Stay informed with official notices, administrative circulars, and event logs broadcasted from school leadership.",
        badge: "School Notice Board",
        badgeColor: "bg-amber-500/20 text-amber-300",
        icon: Megaphone,
      }
    };

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
        <div className="space-y-8 animate-in fade-in duration-500 relative pb-16">
            {/* Header bar */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black tracking-[0.25em] bg-indigo-500/10 text-indigo-600 px-3.5 py-1.5 rounded-full uppercase">Parent Suite</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Parent <span className="text-indigo-600">Portal</span></h1>
                </div>
                
                {/* Navigation & Controls */}
                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                    {/* Custom Tab Bar */}
                    <div className="flex p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-inner">
                        {(['overview', 'academics', 'financials', 'notices'] as const).map((tab) => (
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
                </div>
            </div>

            {/* Colorful Gradient Banner Header */}
            <div className={cn("relative p-8 xl:p-10 rounded-[2rem] text-white border-b-8 border-black/10 overflow-hidden shadow-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border bg-gradient-to-r transition-all duration-500", banners[activeTab].gradient)}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.06),_rgba(255,255,255,0))] pointer-events-none" />
                <div className="space-y-3 relative z-10 max-w-xl">
                    <span className={cn("text-[9px] font-black tracking-[0.25em] px-3.5 py-1.5 rounded-full uppercase", banners[activeTab].badgeColor)}>
                        {banners[activeTab].badge}
                    </span>
                    <h2 className="text-2.5xl xl:text-3.5xl font-black tracking-tight uppercase italic mt-2">{banners[activeTab].title}</h2>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{banners[activeTab].description}</p>
                </div>
                <div className="hidden xl:flex p-5 bg-white/5 border border-white/10 rounded-[1.5rem] relative z-10 shrink-0">
                    {(() => {
                        const IconComponent = banners[activeTab].icon;
                        return <IconComponent className="h-10 w-10 text-white opacity-80" />;
                    })()}
                </div>
            </div>

            {/* Main Tabs Container */}
            <div className="mt-8">
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Stat Cards Grid */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <DirectorStatCard 
                                title="Children Enrolled" 
                                value={children?.length || 0} 
                                icon={Users} 
                                link="/dashboard/my-children" 
                                isLoading={isLoading}
                                color="text-indigo-600"
                                glowColor="rgba(99, 102, 241, 0.08)"
                            />
                            <DirectorStatCard 
                                title="Fees Outstanding" 
                                value={`GH₵ ${totalOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} 
                                icon={Banknote} 
                                link="/dashboard/my-bills" 
                                isLoading={isLoading}
                                color="text-rose-600"
                                glowColor="rgba(244, 63, 94, 0.08)"
                            />
                            <DirectorStatCard 
                                title="Earned Stickers" 
                                value={stickers?.length || 0} 
                                icon={Award} 
                                link="#"
                                isLoading={isLoading}
                                color="text-purple-600"
                                glowColor="rgba(168, 85, 247, 0.08)"
                                subtitle="Total Badges Earned"
                            />
                            <DirectorStatCard 
                                title="Bulletins" 
                                value={announcements?.length || 0} 
                                icon={Megaphone} 
                                link="#"
                                isLoading={isLoading}
                                color="text-amber-500"
                                glowColor="rgba(245, 158, 11, 0.08)"
                                subtitle="Notice Board Alerts"
                            />
                        </div>

                        {/* Operations Control Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Family Registry */}
                            <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden flex flex-col justify-between hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.05)] transition-all duration-300">
                                <CardHeader className="bg-slate-50/50 p-8 border-b">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">My Family Registry</CardTitle>
                                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Children profile overview and class assignments</CardDescription>
                                        </div>
                                        <Button asChild variant="ghost" size="sm" className="text-indigo-600 font-black uppercase text-[10px]">
                                            <Link href="/dashboard/my-children">Full Registry <ArrowUpRight className="ml-1 h-3 w-3"/></Link>
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-4">
                                    {children?.map((child: any) => {
                                        const attendancePercent = child.attendanceRate || 95;
                                        return (
                                            <div key={child.uid} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50/60 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all group duration-300">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                                        {child.firstName?.[0]}{child.lastName?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 uppercase tracking-tight">{child.firstName} {child.lastName}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{child.classId || 'Unassigned Class'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    {/* Circular Attendance Metric */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative flex items-center justify-center w-10 h-10">
                                                            <svg className="absolute w-full h-full transform -rotate-90">
                                                                <circle cx="20" cy="20" r="16" stroke="#e2e8f0" strokeWidth="3" fill="transparent" />
                                                                <circle cx="20" cy="20" r="16" stroke="#6366f1" strokeWidth="3" fill="transparent"
                                                                        strokeDasharray={100.53}
                                                                        strokeDashoffset={100.53 - (100.53 * attendancePercent) / 100}
                                                                        strokeLinecap="round" />
                                                            </svg>
                                                            <span className="text-[9px] font-black text-slate-700 relative z-10">{attendancePercent}%</span>
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider hidden sm:inline">Attendance</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={() => {
                                                        setSelectedChildId(child.uid);
                                                        setActiveTab('academics');
                                                    }} className="text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:bg-indigo-50 rounded-xl px-4 py-2 flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                                                        View Stats <ChevronRight className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {(!children || children.length === 0) && (
                                        <p className="text-center py-8 text-xs text-slate-400 italic font-black uppercase tracking-widest">No enrolled children registered under your profile.</p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Right Column: Actions and Alerts */}
                            <div className="flex flex-col gap-6">
                                <Card className="rounded-[2.5rem] bg-indigo-950 text-white border-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] relative overflow-hidden flex-1 group">
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-indigo-950 to-indigo-950 z-0" />
                                    <CardHeader className="p-8 pb-4 relative z-10">
                                        <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-indigo-400">Parent Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0 space-y-4 relative z-10">
                                        <Link href="/dashboard/my-bills" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-350 group/item hover:-translate-y-0.5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-rose-500/25 rounded-xl group-hover/item:scale-105 transition-transform"><Wallet className="h-4 w-4 text-rose-300"/></div>
                                                <span className="text-sm font-bold uppercase tracking-tight text-white">Pay School Fees</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-white/25 group-hover/item:translate-x-1 transition-transform"/>
                                        </Link>
                                        <Link href="/dashboard/my-grades" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-350 group/item hover:-translate-y-0.5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-500/25 rounded-xl group-hover/item:scale-105 transition-transform"><FileText className="h-4 w-4 text-indigo-300"/></div>
                                                <span className="text-sm font-bold uppercase tracking-tight text-white">Review Grades</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-white/25 group-hover/item:translate-x-1 transition-transform"/>
                                        </Link>
                                        <Link href="/dashboard/messages" className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-350 group/item hover:-translate-y-0.5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-500/25 rounded-xl group-hover/item:scale-105 transition-transform"><MessageSquare className="h-4 w-4 text-emerald-300"/></div>
                                                <span className="text-sm font-bold uppercase tracking-tight text-white">Contact School</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-white/25 group-hover/item:translate-x-1 transition-transform"/>
                                        </Link>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white/95 backdrop-blur-md p-8 hover:shadow-[0_20px_40px_-5px_rgba(99,102,241,0.05)] transition-all duration-350">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Tuition Due Date</p>
                                            <h4 className="text-base font-black text-slate-800 mt-1">Check Fee Deadlines</h4>
                                        </div>
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                            <Clock className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-normal leading-relaxed mt-4">
                                        Please ensure all outstanding balances are cleared before the end of the term to avoid account lockout issues.
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'academics' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Selector for which child to display */}
                        {children && children.length > 1 && (
                            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl border w-fit">
                                {children.map((child: any) => (
                                    <button
                                        key={child.uid}
                                        onClick={() => setSelectedChildId(child.uid)}
                                        className={cn(
                                            "px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300",
                                            activeChildId === child.uid
                                                ? "bg-white text-indigo-600 shadow-md scale-[1.02]"
                                                : "text-slate-500 hover:text-slate-900"
                                        )}
                                    >
                                        {child.firstName} {child.lastName}
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeChild ? (
                            <div className="space-y-8">
                                {/* Grid for Grades, Attendance & Details */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column: Grades & Performance */}
                                    <div className="lg:col-span-2 space-y-8">
                                        {/* Subject Averages Summary Card */}
                                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                                                        <TrendingUp className="h-5 w-5 text-indigo-600" /> Subject Average Tracker
                                                    </CardTitle>
                                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Average grade achieved by subject this term</CardDescription>
                                                </div>
                                            </div>

                                            {subjectAverages.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {subjectAverages.map((sub: any) => (
                                                        <div key={sub.name} className="p-5 bg-slate-50/60 border border-slate-100 rounded-[1.5rem] space-y-3 relative hover:scale-[1.02] transition-all duration-300">
                                                            <div className="flex justify-between items-start">
                                                                <span className="text-xs font-black text-slate-800 uppercase tracking-tight truncate max-w-[140px]" title={sub.name}>{sub.name}</span>
                                                                <div className="flex flex-col items-end gap-0.5">
                                                                    <span className={cn(
                                                                        "text-sm font-black uppercase italic tracking-wider",
                                                                        sub.average >= 50 ? "text-emerald-600" : "text-rose-600"
                                                                    )}>{sub.average}%</span>
                                                                    {sub.classAverage > 0 && (
                                                                        <span className={cn(
                                                                            "text-[9px] font-black uppercase tracking-tight",
                                                                            sub.average >= sub.classAverage ? "text-emerald-500" : "text-rose-500"
                                                                        )}>
                                                                            {sub.average >= sub.classAverage ? `+${sub.average - sub.classAverage}% Above Class` : `${sub.average - sub.classAverage}% Below Class`}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="space-y-1.5">
                                                                {/* Child Progress Bar */}
                                                                <div className="space-y-1">
                                                                    <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                                        <span>Student</span>
                                                                    </div>
                                                                    <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
                                                                        <div 
                                                                            className={cn("h-full rounded-full transition-all duration-500", sub.average >= 50 ? "bg-emerald-500" : "bg-rose-500")}
                                                                            style={{ width: `${sub.average}%` }}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Class Average Progress Bar */}
                                                                {sub.classAverage > 0 && (
                                                                    <div className="space-y-1">
                                                                        <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                                            <span>Class Average ({sub.classAverage}%)</span>
                                                                        </div>
                                                                        <div className="h-1.5 w-full bg-slate-200/30 rounded-full overflow-hidden">
                                                                            <div 
                                                                                className="h-full rounded-full bg-slate-400"
                                                                                style={{ width: `${sub.classAverage}%` }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center py-6 text-slate-400 italic font-black uppercase tracking-widest">No assessment data to compute subject averages.</p>
                                            )}
                                        </Card>

                                        {/* Detailed Assessments Feed Card */}
                                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Grade Log & Assessments</CardTitle>
                                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Recent assessments returned by class teachers</CardDescription>
                                                </div>
                                                <Button asChild size="sm" variant="ghost" className="text-indigo-600 font-black uppercase text-[10px] tracking-wider">
                                                    <Link href="/dashboard/my-grades">View Full Report <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Link>
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                {activeChildAssessments.length > 0 ? (
                                                    activeChildAssessments.slice(0, 5).map((a: any) => {
                                                        const score = Number(a.score) || 0;
                                                        const max = Number(a.maxScore) || 100;
                                                        const pct = max > 0 ? Math.round((score / max) * 100) : 0;
                                                        const sub = subjects?.find((s: any) => s.id === a.subjectId);
                                                        const subName = sub?.name || a.subjectName || 'General';
                                                        const dateStr = a.assessmentDate?.toDate ? format(a.assessmentDate.toDate(), 'PPP') : 'Recently';

                                                        return (
                                                            <div key={a.id || a.uid} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:scale-[1.01] transition-transform duration-300">
                                                                <div className="space-y-1 min-w-0 flex-1">
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight truncate max-w-[180px]">{subName}</span>
                                                                        <Badge variant="secondary" className="bg-slate-200 text-slate-700 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">{a.assessmentType || 'Test'}</Badge>
                                                                    </div>
                                                                    <p className="text-[9px] text-slate-400 font-bold uppercase">Posted on: {dateStr}</p>
                                                                    {a.teacherRemark && <p className="text-xs text-slate-500 italic mt-1 leading-normal">"{a.teacherRemark}"</p>}
                                                                </div>
                                                                
                                                                <div className="flex items-center gap-4 shrink-0 sm:text-right">
                                                                    <div className="space-y-0.5">
                                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Score</p>
                                                                        <p className="text-sm font-black text-slate-800">{score} / {max}</p>
                                                                    </div>
                                                                    <Badge className={cn(
                                                                        "border-none font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider",
                                                                        pct >= 50 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                                                                    )}>
                                                                        {pct}%
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="text-center py-10 bg-slate-50 border border-dashed rounded-[2rem]">
                                                        <BookOpenCheck className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">No assessments logged</p>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Right Column: Attendance Diagnostics */}
                                    <div className="space-y-8">
                                        {/* Attendance Overview Card */}
                                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Attendance Pulse</CardTitle>
                                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Live ward attendance logs overview</CardDescription>
                                                </div>
                                                <CalendarCheck className="h-6 w-6 text-indigo-600" />
                                            </div>

                                            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl gap-4">
                                                <div className="relative flex items-center justify-center w-24 h-24">
                                                    <svg className="absolute w-full h-full transform -rotate-90">
                                                        <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                                                        <circle cx="48" cy="48" r="40" stroke="#6366f1" strokeWidth="6" fill="transparent"
                                                                strokeDasharray={251.32}
                                                                strokeDashoffset={251.32 - (251.32 * attendanceStats.rate) / 100}
                                                                strokeLinecap="round" />
                                                    </svg>
                                                    <span className="text-2xl font-black text-slate-800 relative z-10">{attendanceStats.rate}%</span>
                                                </div>

                                                <div className="grid grid-cols-3 gap-2 w-full text-center mt-2 border-t border-slate-200/50 pt-4">
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase">Present</p>
                                                        <p className="text-sm font-black text-emerald-600">{attendanceStats.present}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase">Late</p>
                                                        <p className="text-sm font-black text-orange-500">{attendanceStats.late}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase">Absent</p>
                                                        <p className="text-sm font-black text-rose-500">{attendanceStats.absent}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Recent Attendance Logs Feed */}
                                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                            <div className="flex items-center justify-between mb-6">
                                                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Attendance Log</CardTitle>
                                                <Button asChild size="sm" variant="ghost" className="text-indigo-600 font-black uppercase text-[10px] tracking-wider p-0 h-auto">
                                                    <Link href="/dashboard/my-attendance">Full Logs <ArrowUpRight className="ml-1 h-3 w-3" /></Link>
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                {activeChildAttendance.length > 0 ? (
                                                    activeChildAttendance.slice(0, 4).map((att: any) => {
                                                        const dateStr = att.date?.toDate ? format(att.date.toDate(), 'PPP') : 'Unknown Date';
                                                        const status = att.status || 'Present';
                                                        return (
                                                            <div key={att.id || att.uid} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-150 hover:bg-indigo-50/5 transition-all duration-300">
                                                                <div className="space-y-0.5">
                                                                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{dateStr}</p>
                                                                    {att.notes && <p className="text-[10px] text-slate-400 italic">"{att.notes}"</p>}
                                                                </div>
                                                                <Badge className={cn(
                                                                    "border-none font-black text-[8px] tracking-wider px-2 py-0.5 rounded-full uppercase shadow-sm shrink-0 text-white",
                                                                    status === 'Present' ? "bg-emerald-500" :
                                                                    status === 'Late' ? "bg-orange-500" :
                                                                    "bg-rose-500"
                                                                )}>
                                                                    {status}
                                                                </Badge>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="text-center py-8 bg-slate-50 border border-dashed rounded-[2rem]">
                                                        <CalendarCheck className="h-6 w-6 text-slate-300 mx-auto mb-1" />
                                                        <p className="text-[10px] font-black text-slate-400 uppercase">No logs registered</p>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                {/* Sticker Showcase Badge Cabinet */}
                                <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Badge Showcase</CardTitle>
                                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Stickers earned through nursery blooms and game zones</CardDescription>
                                        </div>
                                        <Award className="h-6 w-6 text-purple-600" />
                                    </div>

                                    {activeChildStickers.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {activeChildStickers.map((st: any) => (
                                                <div key={st.id || st.uid} className="flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center group hover:scale-[1.03] hover:bg-indigo-50/20 hover:border-indigo-100 transition-all duration-300 relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                                    <div className="text-3xl mb-2.5 filter drop-shadow-md group-hover:scale-110 transition-transform">{st.emoji || '🎓'}</div>
                                                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight truncate w-full px-1">{st.name || 'Mastery Badge'}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{st.category || 'General'}</p>
                                                    <p className="text-[8px] text-slate-400 mt-3 font-medium uppercase tracking-normal">
                                                        {st.earnedAt?.toDate ? formatDistanceToNow(st.earnedAt.toDate(), { addSuffix: true }) : 'Recently'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200/80">
                                            <div className="p-4 bg-white rounded-full w-fit mx-auto mb-4 border border-slate-100 shadow-sm text-slate-300">
                                                <Award className="h-8 w-8" />
                                            </div>
                                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">No badges earned yet</p>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-center py-12 text-xs font-black uppercase">No active children found to load diagnostics.</p>
                        )}
                    </div>
                )}

                {activeTab === 'financials' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Detailed Invoices ledger card */}
                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Tuition Invoice Ledger</CardTitle>
                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Tuition statements, waivers and receipts breakdown</CardDescription>
                                </div>
                                <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs uppercase h-11 px-5 shadow-lg shadow-rose-100/50">
                                    <Link href="/dashboard/my-bills">Pay Tuition Fees</Link>
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {financials && financials.length > 0 ? (
                                    financials.map((record: any) => {
                                        const student = children?.find((c: any) => c.uid === record.studentId);
                                        const studentName = student ? `${student.firstName} ${student.lastName}` : 'Student';
                                        const billed = Number(record.billedAmount) || 0;
                                        const paid = Number(record.amountPaid) || 0;
                                        const waiver = Number(record.waiverAmount) || 0;
                                        const balance = billed - paid - waiver;
                                        const status = record.status || (balance <= 0 ? 'Paid' : paid > 0 ? 'Partially Paid' : 'Unpaid');
                                        const dueDateStr = record.dueDate?.toDate ? format(record.dueDate.toDate(), 'PPP') : 'N/A';

                                        return (
                                            <div key={record.id || record.uid} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 hover:scale-[1.01] transition-transform duration-300">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{record.type || 'School Fee'}</span>
                                                        <span className="text-[10px] text-slate-300 font-bold">•</span>
                                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{studentName}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Due Date: {dueDateStr}</p>
                                                    {record.description && <p className="text-xs text-slate-500 font-medium pt-1 italic">{record.description}</p>}
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-6 xl:text-right">
                                                    <div className="space-y-0.5">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Billed</p>
                                                        <p className="text-sm font-black text-slate-800">GH₵ {billed.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Paid</p>
                                                        <p className="text-sm font-black text-emerald-600">GH₵ {paid.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                                    </div>
                                                    {waiver > 0 && (
                                                        <div className="space-y-0.5">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Waiver</p>
                                                            <p className="text-sm font-black text-indigo-500">GH₵ {waiver.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                                        </div>
                                                    )}
                                                    <div className="space-y-0.5">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Balance</p>
                                                        <p className={cn("text-sm font-black", balance > 0 ? "text-rose-600" : "text-slate-800")}>
                                                            GH₵ {balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                                        </p>
                                                    </div>
                                                    <Badge className={cn(
                                                        "border-none font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider shrink-0",
                                                        status === 'Paid' ? "bg-emerald-100 text-emerald-800" :
                                                        status === 'Partially Paid' ? "bg-amber-100 text-amber-800" :
                                                        "bg-rose-100 text-rose-800"
                                                    )}>
                                                        {status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-12 text-slate-400 italic text-xs uppercase tracking-widest font-black">No billing history found.</div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'notices' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Timelines announcements */}
                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                            <CardHeader className="p-0 mb-6">
                                <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">School Bulletins Broadcasts</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Official announcements released from school administration</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 space-y-6">
                                {announcements && announcements.length > 0 ? (
                                    announcements.map((a: any) => (
                                        <div key={a.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 hover:scale-[1.01] transition-transform duration-300">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">{a.title}</h4>
                                                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">{a.audience || 'Everybody'}</span>
                                            </div>
                                            <p className="text-xs font-medium leading-relaxed text-slate-500 whitespace-pre-wrap">{a.content}</p>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Posted {a.publishedAt?.toDate ? formatDistanceToNow(a.publishedAt.toDate(), { addSuffix: true }) : 'Just now'}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-slate-400 italic text-xs uppercase tracking-widest font-black">No announcements broadcasted yet.</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

function StudentDashboard({ profile }: any) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const { role, loading: isRoleLoading } = useRole();
    const { toast } = useToast();

    // 1. Fetch class details to get Class Name
    const classDocRef = useMemoFirebase(() => {
        if (!firestore || !schoolId || !profile?.classId) return null;
        return doc(firestore, 'classes', profile.classId);
    }, [firestore, schoolId, profile?.classId]);
    const { data: classData } = useDoc<any>(classDocRef);
    const className = classData?.name || 'Classroom';

    // 2. Fetch student's assessments for overall average grade
    const assessmentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !user?.uid) return null;
        return query(
            collection(firestore, 'assessments'),
            where('schoolId', '==', schoolId),
            where('studentId', '==', user.uid)
        );
    }, [firestore, schoolId, user?.uid]);
    const { data: studentAssessments, isLoading: loadingAssessments } = useCollection<any>(assessmentsQuery);

    // 3. Fetch student's attendance records
    const attendanceQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !user?.uid) return null;
        return query(
            collection(firestore, 'attendance'),
            where('schoolId', '==', schoolId),
            where('studentId', '==', user.uid)
        );
    }, [firestore, schoolId, user?.uid]);
    const { data: studentAttendance, isLoading: loadingAttendance } = useCollection<any>(attendanceQuery);

    // 4. Fetch assignments for student's class
    const assignmentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !profile?.classId) return null;
        return query(
            collection(firestore, 'assignments'),
            where('schoolId', '==', schoolId),
            where('classId', '==', profile.classId)
        );
    }, [firestore, schoolId, profile?.classId]);
    const { data: classAssignments, isLoading: loadingAssignments } = useCollection<any>(assignmentsQuery);

    // 5. Fetch student's homework submissions
    const submissionsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !user?.uid) return null;
        return query(
            collection(firestore, 'submissions'),
            where('schoolId', '==', schoolId),
            where('studentId', '==', user.uid)
        );
    }, [firestore, schoolId, user?.uid]);
    const { data: studentSubmissions } = useCollection<any>(submissionsQuery);

    // 6. Fetch quizzes for student's class
    const quizzesQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !profile?.classId) return null;
        return query(
            collection(firestore, 'quizzes'),
            where('schoolId', '==', schoolId),
            where('classId', '==', profile.classId)
        );
    }, [firestore, schoolId, profile?.classId]);
    const { data: classQuizzes, isLoading: loadingQuizzes } = useCollection<any>(quizzesQuery);

    // 7. Fetch student's quiz attempts
    const quizAttemptsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !user?.uid) return null;
        return query(
            collection(firestore, 'quizAttempts'),
            where('schoolId', '==', schoolId),
            where('studentId', '==', user.uid)
        );
    }, [firestore, schoolId, user?.uid]);
    const { data: studentQuizAttempts } = useCollection<any>(quizAttemptsQuery);

    // 8. Fetch student's bills
    const billsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !user?.uid) return null;
        return query(
            collection(firestore, 'financialRecords'),
            where('schoolId', '==', schoolId),
            where('studentId', '==', user.uid)
        );
    }, [firestore, schoolId, user?.uid]);
    const { data: studentBills, isLoading: loadingBills } = useCollection<any>(billsQuery);

    // 9. Fetch announcements
    const annQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId) return null;
        return query(
            collection(firestore, 'announcements_v2'),
            where('schoolId', '==', schoolId),
            where('audience', 'array-contains-any', ['Everybody', 'Student'])
        );
    }, [firestore, schoolId]);
    const { data: announcements, isLoading: loadingAnnouncements } = useCollection<any>(annQuery);

    // In-memory sorting and statistics computations
    const sortedAssessments = useMemo(() => {
        if (!studentAssessments) return [];
        return [...studentAssessments].sort((a: any, b: any) => {
            const dateA = a.createdAt?.toDate?.()?.getTime() || a.assessmentDate?.toDate?.()?.getTime() || 0;
            const dateB = b.createdAt?.toDate?.()?.getTime() || b.assessmentDate?.toDate?.()?.getTime() || 0;
            return dateB - dateA;
        });
    }, [studentAssessments]);

    const sortedAnnouncements = useMemo(() => {
        if (!announcements) return [];
        return [...announcements].sort((a: any, b: any) => {
            const dateA = a.publishedAt?.toDate?.()?.getTime() || 0;
            const dateB = b.publishedAt?.toDate?.()?.getTime() || 0;
            return dateB - dateA;
        }).slice(0, 3);
    }, [announcements]);

    const { overallAvg, averageGradeLetter } = useMemo(() => {
        if (!studentAssessments || studentAssessments.length === 0) {
            return { overallAvg: 0, averageGradeLetter: '—' };
        }
        const total = studentAssessments.reduce((sum: number, a: any) => sum + (a.score || 0), 0);
        const max = studentAssessments.reduce((sum: number, a: any) => sum + (a.maxScore || 100), 0);
        const avg = max > 0 ? Math.round((total / max) * 100) : 0;

        let letter = 'F';
        if (avg >= 90) letter = 'A+';
        else if (avg >= 80) letter = 'A';
        else if (avg >= 70) letter = 'B';
        else if (avg >= 60) letter = 'C';
        else if (avg >= 50) letter = 'D';
        else letter = 'E';

        return { overallAvg: avg, averageGradeLetter: letter };
    }, [studentAssessments]);

    const attendanceRate = useMemo(() => {
        if (!studentAttendance || studentAttendance.length === 0) return 100;
        const present = studentAttendance.filter((r: any) => r.status === 'Present' || r.status === 'Late').length;
        return Math.round((present / studentAttendance.length) * 100);
    }, [studentAttendance]);

    const submissionsMap = useMemo(() => {
        if (!studentSubmissions) return new Map();
        return new Map(studentSubmissions.map((s: any) => [s.assignmentId, s]));
    }, [studentSubmissions]);

    const attemptsMap = useMemo(() => {
        if (!studentQuizAttempts) return new Map();
        return new Map(studentQuizAttempts.map((a: any) => [a.quizId, a]));
    }, [studentQuizAttempts]);

    const pendingTasks = useMemo(() => {
        const tasks: any[] = [];
        if (classAssignments) {
            classAssignments.forEach((a: any) => {
                if (!submissionsMap.has(a.id)) {
                    tasks.push({
                        id: a.id,
                        title: a.title,
                        description: a.description,
                        dueDate: a.dueDate,
                        type: 'Assignment',
                        color: 'border-l-blue-500'
                    });
                }
            });
        }
        if (classQuizzes) {
            classQuizzes.forEach((q: any) => {
                if (!attemptsMap.has(q.id)) {
                    tasks.push({
                        id: q.id,
                        title: q.title,
                        description: `Topic: ${q.topic || 'General Check'}`,
                        dueDate: null,
                        type: 'Quiz',
                        color: 'border-l-purple-500'
                    });
                }
            });
        }
        return tasks;
    }, [classAssignments, classQuizzes, submissionsMap, attemptsMap]);

    const outstandingBalance = useMemo(() => {
        if (!studentBills || studentBills.length === 0) return 0;
        return studentBills.reduce((sum: number, b: any) => {
            if (b.status === 'Paid') return sum;
            const due = (b.billedAmount || 0) - (b.amountPaid || 0) - (b.waiverAmount || 0);
            return sum + Math.max(0, due);
        }, 0);
    }, [studentBills]);

    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Member';

    // Premium Skeleton Loading View
    if (schoolLoading || isRoleLoading || loadingAssessments || loadingAttendance || loadingAssignments || loadingQuizzes || loadingBills || loadingAnnouncements) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-48 w-full rounded-[2.5rem] bg-slate-200" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="h-28 rounded-2xl bg-slate-200" />
                    <div className="h-28 rounded-2xl bg-slate-200" />
                    <div className="h-28 rounded-2xl bg-slate-200" />
                    <div className="h-28 rounded-2xl bg-slate-200" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-64 rounded-3xl bg-slate-200" />
                        <div className="h-64 rounded-3xl bg-slate-200" />
                    </div>
                    <div className="space-y-6">
                        <div className="h-48 rounded-3xl bg-slate-200" />
                        <div className="h-64 rounded-3xl bg-slate-200" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* 1. Header Welcome Banner */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-8 md:p-12 text-white shadow-2xl border border-white/10 group">
                <div className="absolute right-[-40px] bottom-[-40px] opacity-10 text-white transition-transform duration-700 group-hover:scale-110 pointer-events-none">
                    <GraduationCap className="h-60 w-60" />
                </div>
                <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-black uppercase tracking-widest text-indigo-250 backdrop-blur-md border border-white/5">
                            <Sparkles className="h-3 w-3 text-indigo-400" /> Student Cockpit
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2 uppercase italic leading-none">
                            HELLO, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">{displayName}!</span> 👋
                        </h1>
                        <p className="text-slate-300 text-sm font-medium max-w-xl">
                            Welcome back to your dashboard. Review pending homework, check your latest assessment grades, or talk to your AI companion!
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 shrink-0 bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-md">
                        <div className="text-center px-4 border-r border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block mb-0.5">My Class</span>
                            <span className="text-base font-black text-white">{className}</span>
                        </div>
                        <div className="text-center px-4 border-r border-white/10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-0.5">Attendance</span>
                            <span className="text-base font-black text-white">{attendanceRate}%</span>
                        </div>
                        <div className="text-center px-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 block mb-0.5">Academic Avg</span>
                            <span className="text-base font-black text-white">{overallAvg}% ({averageGradeLetter})</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. KPI Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Academic Grade" 
                    value={`${overallAvg}% (${averageGradeLetter})`} 
                    icon={Award} 
                    link="/dashboard/my-grades" 
                    isLoading={false} 
                    color="text-amber-500" 
                    subtitle={`Based on ${studentAssessments?.length || 0} marks`}
                />
                <StatCard 
                    title="Pending Tasks" 
                    value={`${pendingTasks.length} Pending`} 
                    icon={Clock} 
                    link="/dashboard/assignments" 
                    isLoading={false} 
                    color="text-rose-500" 
                    subtitle="Homeworks & Quizzes due"
                />
                <StatCard 
                    title="Attendance Health" 
                    value={`${attendanceRate}%`} 
                    icon={CalendarCheck} 
                    link="/dashboard/my-attendance" 
                    isLoading={false} 
                    color="text-emerald-500" 
                    subtitle="Of school days logged"
                />
                <StatCard 
                    title="Account Statement" 
                    value={outstandingBalance === 0 ? "Good Standing" : `GH₵ ${outstandingBalance.toLocaleString()}`} 
                    icon={Banknote} 
                    link="/dashboard/my-bills" 
                    isLoading={false} 
                    color="text-indigo-500" 
                    subtitle={outstandingBalance === 0 ? "All fees paid" : "Outstanding balance"}
                />
            </div>

            {/* 3. Main Split Columns Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Learning Desk (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Pending Homework Feed */}
                    <Card className="rounded-[2.2rem] border border-slate-100 shadow-md bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-50 bg-slate-50/15 p-6 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-indigo-650" /> Pending Homework & Quizzes
                                </CardTitle>
                                <CardDescription className="text-slate-400">Tasks requiring your attention or response submission.</CardDescription>
                            </div>
                            <Button asChild variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 font-bold text-xs rounded-xl">
                                <Link href="/dashboard/assignments" className="flex items-center gap-1">View All <ChevronRight className="h-4 w-4"/></Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {pendingTasks.length > 0 ? (
                                pendingTasks.slice(0, 3).map((task: any) => (
                                    <div 
                                        key={task.id} 
                                        className={cn(
                                            "p-4 border-2 border-slate-50 hover:border-slate-100 bg-white rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all hover:shadow-sm border-l-4", 
                                            task.color
                                        )}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge className={cn("text-[9px] font-black uppercase tracking-wider py-0.5 px-2 rounded-lg", task.type === 'Quiz' ? "bg-purple-50 text-purple-755 border border-purple-100 hover:bg-purple-50" : "bg-blue-50 text-blue-755 border border-blue-100 hover:bg-blue-50")}>
                                                    {task.type}
                                                </Badge>
                                                {task.dueDate && (
                                                    <span className="text-[10px] text-slate-400 font-bold">
                                                        Due: {format(new Date(task.dueDate), 'MMM dd')}
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-extrabold text-slate-800 text-sm">{task.title}</h4>
                                            <p className="text-xs text-slate-550 line-clamp-1">{task.description}</p>
                                        </div>
                                        <Button asChild size="sm" className={cn("rounded-xl text-xs font-bold shrink-0 self-start sm:self-center", task.type === 'Quiz' ? "bg-purple-650 hover:bg-purple-750 text-white" : "bg-blue-650 hover:bg-blue-750 text-white")}>
                                            <Link href={task.type === 'Quiz' ? `/dashboard/assignments/quiz/${task.id}` : "/dashboard/assignments"}>
                                                {task.type === 'Quiz' ? 'Start Quiz' : 'Submit Work'} <ChevronRight className="ml-1 h-3.5 w-3.5"/>
                                            </Link>
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2.5 stroke-[1.2]" />
                                    <p className="text-xs font-black uppercase text-slate-400">All tasks submitted! Excellent work! 🎉</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Grades Ledger */}
                    <Card className="rounded-[2.2rem] border border-slate-100 shadow-md bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-50 bg-slate-50/15 p-6">
                            <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-indigo-650" /> Recent Grades & Marks
                            </CardTitle>
                            <CardDescription className="text-slate-400">Your latest assessment scores and teacher remarks.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {sortedAssessments.length > 0 ? (
                                <div className="space-y-3">
                                    {sortedAssessments.slice(0, 3).map((a: any, idx: number) => (
                                        <div 
                                            key={a.id || idx} 
                                            className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-all border border-transparent hover:border-slate-100"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                        {a.createdAt?.toDate ? format(a.createdAt.toDate(), 'MMM dd, yyyy') : 'Recently'}
                                                    </span>
                                                    <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">• {a.assessmentType || 'Class Exercise'}</span>
                                                </div>
                                                <h4 className="font-extrabold text-slate-805 text-sm uppercase">{a.subjectName || 'Exercise'}</h4>
                                                <p className="text-xs text-slate-500 italic">"{a.teacherRemark || 'No remark entered.'}"</p>
                                            </div>
                                            <Badge className={cn(
                                                "font-black text-xs py-1 px-3.5 rounded-full shrink-0 self-start sm:self-center",
                                                (a.score / (a.maxScore || 100)) >= 0.8 ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" :
                                                (a.score / (a.maxScore || 100)) >= 0.5 ? "bg-indigo-50 text-indigo-755 hover:bg-indigo-55" :
                                                "bg-rose-50 border border-rose-250 text-rose-700 hover:bg-rose-50"
                                            )}>
                                                Score: {a.score} / {a.maxScore}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-slate-50/50 border border-dashed border-slate-250 rounded-2xl">
                                    <TrendingUp className="h-10 w-10 text-slate-300 mx-auto mb-2.5 stroke-[1.2]" />
                                    <p className="text-xs font-black uppercase text-slate-400">No graded assessments recorded yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Study Desk Sidebar (1/3 width) */}
                <div className="space-y-8">
                    {/* Dr. Gam AI Study Buddy */}
                    <Card className="rounded-[2.2rem] border-none shadow-2xl bg-slate-955 text-white overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-slate-900 to-purple-950/20" />
                        <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
                        <div className="absolute top-[-20%] left-[-20%] w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <CardContent className="p-8 relative z-10 flex flex-col items-center text-center gap-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                                <div className="relative bg-white/5 p-6 rounded-full border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-300">
                                    <BrainCircuit className="h-12 w-12 text-emerald-400"/>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-100 uppercase italic tracking-tight">AI Study Companion</h3>
                                <p className="text-slate-400 text-xs font-semibold leading-relaxed uppercase tracking-wider max-w-[210px] mx-auto">
                                    Got questions about math, science, literacy, or coding? Chat with Dr. Gam now!
                                </p>
                            </div>
                            <Button asChild className="w-full h-12 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all border border-emerald-300/30">
                                <Link href="/dashboard/study-club" className="flex items-center justify-center gap-2">
                                    TALK TO DR. GAM <ChevronRight className="h-4 w-4"/>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Interactive Learning Clubs */}
                    <Card className="rounded-[2.2rem] border border-slate-100 shadow-md bg-white p-6 space-y-4">
                        <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Learning Arena</h4>
                            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-tight mt-0.5">Interactive Study Clubs</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/dashboard/maths-club-v2" className="p-4 bg-orange-50/50 hover:bg-orange-50 border border-orange-100 rounded-2xl text-center transition-all hover:-translate-y-0.5 active:scale-95 group">
                                <Sigma className="h-7 w-7 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform"/>
                                <span className="font-black text-[10px] tracking-widest text-orange-700 block uppercase">Maths</span>
                            </Link>
                            <Link href="/dashboard/science-club-v2" className="p-4 bg-teal-50/50 hover:bg-teal-50 border border-teal-100 rounded-2xl text-center transition-all hover:-translate-y-0.5 active:scale-95 group">
                                <FlaskConical className="h-7 w-7 text-teal-500 mx-auto mb-2 group-hover:scale-110 transition-transform"/>
                                <span className="font-black text-[10px] tracking-widest text-teal-700 block uppercase">Science</span>
                            </Link>
                            <Link href="/dashboard/ela-club" className="p-4 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-2xl text-center transition-all hover:-translate-y-0.5 active:scale-95 group">
                                <BookOpenCheck className="h-7 w-7 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform"/>
                                <span className="font-black text-[10px] tracking-widest text-indigo-700 block uppercase">Literacy</span>
                            </Link>
                            <Link href="/dashboard/coding-club" className="p-4 bg-purple-50/50 hover:bg-purple-50 border border-purple-100 rounded-2xl text-center transition-all hover:-translate-y-0.5 active:scale-95 group">
                                <Code className="h-7 w-7 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform"/>
                                <span className="font-black text-[10px] tracking-widest text-purple-700 block uppercase">Coding</span>
                            </Link>
                        </div>
                    </Card>

                    {/* Timeline Notices bulletin */}
                    <Card className="rounded-[2.2rem] border border-slate-100 shadow-md bg-white overflow-hidden">
                        <CardHeader className="border-b border-slate-50 bg-slate-50/15 p-6">
                            <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Notice Board</CardTitle>
                            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-tight mt-0.5">School Announcements</h3>
                        </CardHeader>
                        <CardContent className="p-6">
                            {sortedAnnouncements.length > 0 ? (
                                <div className="space-y-4">
                                    {sortedAnnouncements.map((ann: any, idx: number) => (
                                        <div key={ann.id || idx} className="flex gap-3 text-xs">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-650 shrink-0 mt-1.5 animate-pulse"></div>
                                            <div className="space-y-0.5 min-w-0 flex-1">
                                                <h4 className="font-bold text-slate-800 truncate uppercase">{ann.title}</h4>
                                                <p className="text-slate-500 line-clamp-2 leading-relaxed">{ann.content}</p>
                                                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider mt-1">
                                                    {ann.publishedAt?.toDate ? formatDistanceToNow(ann.publishedAt.toDate(), { addSuffix: true }) : 'Recently'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-slate-400 italic text-xs">
                                    No announcements available.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
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

  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const parentStudentIds = useMemo(() => profile?.studentIds || [], [profile]);
  const parentChildren = useMemo(() => students?.filter(s => parentStudentIds.includes(s.uid)) || [], [students, parentStudentIds]);
  const parentFinancials = useMemo(() => records?.filter(r => parentStudentIds.includes(r.studentId)) || [], [records, parentStudentIds]);

  const activeChildId = selectedChildId || parentChildren?.[0]?.uid || '';
  const activeChild = useMemo(() => parentChildren?.find(c => c.uid === activeChildId), [parentChildren, activeChildId]);
  const activeClassId = activeChild?.classId || '';

  const parentStickersQuery = useMemoFirebase(() => {
    if (!firestore || parentStudentIds.length === 0) return null;
    return query(collection(firestore, 'junior_stickers'), where('userId', 'in', parentStudentIds));
  }, [firestore, parentStudentIds]);
  const { data: parentStickers, isLoading: loadingStickers } = useCollection(parentStickersQuery);

  const parentAssessmentsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId || !isParent || parentStudentIds.length === 0) return null;
    return query(
      collection(firestore, 'assessments'),
      where('schoolId', '==', schoolId),
      where('studentId', 'in', parentStudentIds),
      limit(100)
    );
  }, [firestore, schoolId, isParent, parentStudentIds]);
  const { data: parentAssessments, isLoading: loadingParentAssessments } = useCollection(parentAssessmentsQuery);

  const parentAttendanceQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId || !isParent || parentStudentIds.length === 0) return null;
    return query(
      collection(firestore, 'attendance'),
      where('schoolId', '==', schoolId),
      where('studentId', 'in', parentStudentIds),
      limit(100)
    );
  }, [firestore, schoolId, isParent, parentStudentIds]);
  const { data: parentAttendance, isLoading: loadingAttendance } = useCollection(parentAttendanceQuery);

  const subjectsQuery = useMemoFirebase(() => 
    (firestore && schoolId && isParent) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null,
  [firestore, schoolId, isParent]);
  const { data: subjects } = useCollection(subjectsQuery);

  const classAssessmentsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId || !isParent || !activeClassId) return null;
    return query(
      collection(firestore, 'assessments'),
      where('schoolId', '==', schoolId),
      where('classId', '==', activeClassId),
      limit(250)
    );
  }, [firestore, schoolId, isParent, activeClassId]);
  const { data: classAssessments } = useCollection<Assessment>(classAssessmentsQuery);

  const assessmentsQuery = useMemoFirebase(() => (firestore && schoolId && (role === 'Director' || role === 'Teacher')) ? query(collection(firestore, 'assessments'), where('schoolId', '==', schoolId), limit(150)) : null, [firestore, schoolId, role]);
  const { data: recentAssessments, isLoading: loadingAssessments } = useCollection(assessmentsQuery);

  const timetableQuery = useMemoFirebase(() => 
    (firestore && schoolId && role === 'Teacher')
      ? query(collection(firestore, 'timetables'), where('schoolId', '==', schoolId)) 
      : null, 
  [firestore, schoolId, role]);
  const { data: timetable, isLoading: loadingTimetable } = useCollection(timetableQuery);

  const teacherClasses = useMemo(() => {
    if (!classes) return [];
    if (role !== 'Teacher') return classes;
    const subjectClassIds = timetable?.filter((t: any) => t.teacherId === user?.uid).map((t: any) => t.classId) || [];
    return classes.filter((c: any) => c.teacherId === user?.uid || subjectClassIds.includes(c.id));
  }, [classes, timetable, role, user?.uid]);

  const teacherStudents = useMemo(() => {
    if (!students) return [];
    if (role !== 'Teacher') return students;
    const visibleClassIds = teacherClasses.map((c: any) => c.id);
    return students.filter((s: any) => s.classId && visibleClassIds.includes(s.classId));
  }, [students, teacherClasses, role]);

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
    return <AdminDashboard profile={profile} students={students} staff={staff} classes={classes} announcements={announcements} isLoading={loadingStudents || loadingStaff || loadingClasses} schoolData={schoolData} hasFinanceAccess={hasFinanceAccess} financialRecords={records} attendance={attendance} schoolId={schoolId} />;
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
    return <SupportStaffDashboard role={role} profile={profile} leaveRequests={leaveRequests} announcements={announcements} isLoading={loadingLeaves} announcementsLoading={loadingAnnouncements} />;
  }

  if (role === 'Teacher') {
    return <TeacherDashboard profile={profile} classes={teacherClasses} students={teacherStudents} assessments={recentAssessments} announcements={announcements} isLoading={loadingClasses || loadingStudents || loadingAssessments || loadingTimetable} />;
  }

  if (role === 'Parent') {
    return <ParentDashboard 
      profile={profile} 
      children={parentChildren} 
      financials={parentFinancials} 
      announcements={announcements} 
      isLoading={loadingStudents || loadingRecords || loadingStickers || loadingParentAssessments || loadingAttendance} 
      schoolSettings={schoolSettings} 
      stickers={parentStickers} 
      assessments={parentAssessments} 
      attendance={parentAttendance} 
      subjects={subjects}
      selectedChildId={selectedChildId}
      setSelectedChildId={setSelectedChildId}
      classAssessments={classAssessments}
    />;
  }

  return <StudentDashboard profile={profile} />;
}
