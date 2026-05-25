'use client';

import { useMemo } from 'react';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

  if (role === 'Administrator' || role === 'Director') {
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
