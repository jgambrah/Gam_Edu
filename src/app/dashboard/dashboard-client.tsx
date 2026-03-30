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
  XCircle, AlertCircle, Bus as BusIcon, Route as RouteIcon, MapPin, Navigation
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, startOfDay } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Route, Bus, Student } from '@/lib/types';

function StatCard({ title, value, icon: Icon, link, isLoading, color = "text-indigo-600" }: any) {
  return (
    <Link href={link || "#"}>
      <Card className="hover:shadow-md transition-all cursor-pointer group border-l-4 border-l-indigo-500">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{title}</p>
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-200" /> : <h3 className="text-3xl font-black text-slate-900">{value}</h3>}
            </div>
            <div className={cn("p-3 rounded-2xl bg-slate-50 group-hover:scale-110 transition-transform", color)}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function TransportStaffDashboard({ profile, routes, buses, students, announcements, isLoading }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Staff';

    const busSubscribers = useMemo(() => {
        return students?.filter((s: any) => s.usesBusService === true).length || 0;
    }, [students]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Transport Portal: {displayName} 🚌</h1>
                <p className="text-muted-foreground">Manage school bus operations and student transport safety.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="Active Routes" value={routes?.length || 0} icon={RouteIcon} link="/dashboard/transport" isLoading={isLoading} color="text-blue-600" />
                <StatCard title="Fleet Status" value={`${buses?.length || 0} Buses`} icon={BusIcon} link="/dashboard/transport" isLoading={isLoading} color="text-indigo-600" />
                <StatCard title="Bus Subscribers" value={busSubscribers} icon={Users} link="/dashboard/transport" isLoading={isLoading} color="text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-t-4 border-t-blue-500">
                    <CardHeader><CardTitle>Route Operations</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/dashboard/transport" className="p-4 border rounded-2xl hover:bg-slate-50 flex items-center gap-3 transition-all group">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Navigation className="h-5 w-5"/></div>
                            <span className="font-bold text-sm">Manage Routes</span>
                        </Link>
                        <Link href="/dashboard/transport" className="p-4 border rounded-2xl hover:bg-slate-50 flex items-center gap-3 transition-all group">
                            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><MapPin className="h-5 w-5"/></div>
                            <span className="font-bold text-sm">Stop Assignments</span>
                        </Link>
                        <Link href="/dashboard/attendance/staff" className="p-4 border rounded-2xl hover:bg-slate-50 flex items-center gap-3 transition-all group">
                            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><CalendarCheck className="h-5 w-5"/></div>
                            <span className="font-bold text-sm">My Attendance</span>
                        </Link>
                        <Link href="/dashboard/leave-management" className="p-4 border rounded-2xl hover:bg-slate-50 flex items-center gap-3 transition-all group">
                            <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Clock className="h-5 w-5"/></div>
                            <span className="font-bold text-sm">My Leave</span>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-t-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Megaphone className="h-5 w-5 text-blue-600"/> Latest Announcements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                            </div>
                        ) : announcements && announcements.length > 0 ? (
                            announcements.map((ann: any) => (
                                <div key={ann.id} className="border-b last:border-0 pb-3 last:pb-0">
                                    <p className="font-semibold text-sm text-slate-800">{ann.title}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{ann.publishedAt ? format(ann.publishedAt.toDate(), 'PPP') : 'Just now'}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-10 text-muted-foreground italic text-sm">No recent announcements.</p>
                        )}
                        <Button variant="outline" className="w-full text-xs font-bold" asChild>
                            <Link href="/dashboard/announcements">View All</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function AccountantDashboard({ profile, students, classes, records, tills, announcements, isLoading }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Accountant';

    // Financial Metrics
    const stats = useMemo(() => {
        if (!records) return { totalOutstanding: 0, todayRevenue: 0, revenueByType: [] };
        
        const today = startOfDay(new Date());
        let outstanding = 0;
        let todayRev = 0;
        const types: Record<string, number> = {};

        records.forEach((r: any) => {
            const billed = r.billedAmount || 0;
            const paid = r.amountPaid || 0;
            const waiver = r.waiverAmount || 0;
            outstanding += (billed - paid - waiver);

            // Check if paid today
            if (r.lastPaymentDate) {
                const payDate = r.lastPaymentDate.toDate ? r.lastPaymentDate.toDate() : new Date(r.lastPaymentDate);
                if (startOfDay(payDate).getTime() === today.getTime()) {
                    // Simplified tracking
                }
            }

            if (paid > 0) {
                const type = r.type || 'Other';
                types[type] = (types[type] || 0) + paid;
            }
        });

        const revenueByType = Object.entries(types).map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        return { totalOutstanding: outstanding, todayRevenue: todayRev, revenueByType };
    }, [records]);

    const activeTill = useMemo(() => {
        return tills?.find((t: any) => t.status === 'Open');
    }, [tills]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Finance Portal: {displayName} 💳</h1>
                    <p className="text-muted-foreground">Manage school accounts, billing, and daily collections.</p>
                </div>
                {activeTill ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-2 rounded-xl flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        TILL OPEN: GH₵{activeTill.currentBalance?.toFixed(2) || '0.00'}
                    </Badge>
                ) : (
                    <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 px-4 py-2 rounded-xl flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        TILL CLOSED
                    </Badge>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Outstanding Fees" value={`GH₵${stats.totalOutstanding.toLocaleString()}`} icon={AlertCircle} link="/dashboard/accounts" isLoading={isLoading} color="text-rose-600" />
                <StatCard title="Active Students" value={students?.length || 0} icon={Users} link="/dashboard/students-v3" isLoading={isLoading} color="text-blue-600" />
                <StatCard title="Classes" value={classes?.length || 0} icon={School} link="/dashboard/academics" isLoading={isLoading} color="text-indigo-600" />
                <StatCard title="Cash in Till" value={`GH₵${activeTill?.currentBalance?.toFixed(2) || '0.00'}`} icon={Wallet} link="/dashboard/accounts/cash-till" isLoading={isLoading} color="text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-emerald-600"/> Revenue Distribution
                        </CardTitle>
                        <CardDescription>Breakdown of collected payments by category.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {stats.revenueByType.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.revenueByType} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" fontSize={10} width={100} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        formatter={(val: number) => [`GH₵${val.toLocaleString()}`, 'Amount']}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {stats.revenueByType.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 italic">No revenue data recorded yet.</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Accounting Tasks</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/dashboard/accounts" className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 border transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Banknote className="h-4 w-4"/></div>
                                <span className="text-sm font-bold">Student Billing</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform"/>
                        </Link>
                        <Link href="/dashboard/finance/bulk-payments" className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 border transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><HandCoins className="h-4 w-4"/></div>
                                <span className="text-sm font-bold">Bulk Receipts</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform"/>
                        </Link>
                        <Link href="/dashboard/accounts/cash-till" className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 border transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Wallet className="h-4 w-4"/></div>
                                <span className="text-sm font-bold">Manage My Till</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform"/>
                        </Link>
                        <Link href="/dashboard/payroll/staff-config" className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 border transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Calculator className="h-4 w-4"/></div>
                                <span className="text-sm font-bold">Payroll Config</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform"/>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function AdminDashboard({ profile, students, staff, classes, announcements, isLoading }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Administrator';

    const enrollmentData = useMemo(() => {
        if (!classes || !students) return [];
        return classes.map((c: any) => ({
            name: c.name,
            students: students.filter((s: any) => s.classId === c.id).length
        })).sort((a: any, b: any) => b.students - a.students).slice(0, 6);
    }, [classes, students]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1 mb-2">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">System Overview: {displayName} 🏢</h1>
                <p className="text-muted-foreground">Real-time metrics for your school administration.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Students" value={students?.length || 0} icon={GraduationCap} link="/dashboard/students-v3" isLoading={isLoading} />
                <StatCard title="Total Staff" value={staff?.length || 0} icon={Users} link="/dashboard/staff-management-v2" isLoading={isLoading} />
                <StatCard title="Active Classes" value={classes?.length || 0} icon={School} link="/dashboard/academics" isLoading={isLoading} />
                <StatCard title="News" value={announcements?.length || 0} icon={Megaphone} link="/dashboard/announcements" isLoading={isLoading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <Link href="/dashboard/students-v3" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg"><GraduationCap className="h-4 w-4 text-green-600"/></div>
                                <span className="text-sm font-semibold">Enroll Student</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300"/>
                        </Link>
                        <Link href="/dashboard/staff-management-v2" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg"><Users className="h-4 w-4 text-purple-600"/></div>
                                <span className="text-sm font-semibold">Add New Staff</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300"/>
                        </Link>
                        <Link href="/dashboard/announcements" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg"><Bell className="h-4 w-4 text-blue-600"/></div>
                                <span className="text-sm font-semibold">Post News</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300"/>
                        </Link>
                        <Link href="/dashboard/accounts" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg"><Banknote className="h-4 w-4 text-emerald-600"/></div>
                                <span className="text-sm font-semibold">Financial Ledger</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300"/>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Enrollment By Class</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={enrollmentData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
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
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome back, {displayName}! 🍎</h1>
                <p className="text-muted-foreground">Manage your classroom and track student progress.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard title="My Classes" value={classes?.length || 0} icon={School} link="/dashboard/academics" isLoading={isLoading} />
                <StatCard title="Upcoming Tasks" value="--" icon={CalendarCheck} link="/dashboard/assignments" isLoading={isLoading} color="text-emerald-600" />
                <StatCard title="News" value="--" icon={Megaphone} link="/dashboard/announcements" isLoading={isLoading} color="text-blue-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-t-4 border-t-indigo-500">
                    <CardHeader><CardTitle>Instructional Tools</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/dashboard/lesson-planning" className="p-4 border rounded-2xl hover:bg-slate-50 flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><FileText className="h-5 w-5"/></div>
                            <span className="font-bold text-sm">Lesson Planning</span>
                        </Link>
                        <Link href="/dashboard/assignments" className="p-4 border rounded-2xl hover:bg-slate-50 flex items-center gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><PlusCircle className="h-5 w-5"/></div>
                            <span className="font-bold text-sm">Create Quiz</span>
                        </Link>
                        <Link href="/dashboard/academics/gradebook/manual-entry" className="p-4 border rounded-2xl hover:bg-slate-50 flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><TrendingUp className="h-5 w-5"/></div>
                            <span className="font-bold text-sm">Gradebook</span>
                        </Link>
                        <Link href="/dashboard/attendance" className="p-4 border rounded-2xl hover:bg-slate-50 flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><CalendarCheck className="h-5 w-5"/></div>
                            <span className="font-bold text-sm">Take Attendance</span>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-t-purple-500">
                    <CardHeader><CardTitle>AI Support</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4 p-4 bg-purple-50 rounded-2xl border border-purple-100 items-start">
                            <div className="bg-white p-3 rounded-xl text-purple-600 shadow-sm"><BrainCircuit className="h-6 w-6"/></div>
                            <div>
                                <h4 className="font-bold text-purple-900">Need a Lesson Idea?</h4>
                                <p className="text-sm text-purple-700 mt-1">Use the AI Assistant in Lesson Planning to generate objectives and activities instantly.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ParentDashboard({ profile, children, financials, announcements, isLoading }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Parent';

    const totalOutstanding = useMemo(() => {
        if (!financials) return 0;
        return financials.reduce((sum: number, r: any) => {
            if (r.status === 'Pending Reversal' || r.status === 'Rejected Reversal') return sum;
            const balance = (r.billedAmount || 0) - (r.amountPaid || 0) - (r.waiverAmount || 0);
            return sum + Math.max(0, balance);
        }, 0);
    }, [financials]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Parent Portal: {displayName} 👋</h1>
                <p className="text-muted-foreground">Monitor your children's academic and financial status.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="My Children" value={children?.length || 0} icon={Users} link="/dashboard/my-children" isLoading={isLoading} color="text-blue-600" />
                <StatCard title="Total Outstanding" value={`GH₵${totalOutstanding.toFixed(2)}`} icon={Banknote} link="/dashboard/my-bills" isLoading={isLoading} color="text-red-600" />
                <StatCard title="Live Grades" value="View All" icon={TrendingUp} link="/dashboard/my-grades" isLoading={isLoading} color="text-indigo-600" />
                <StatCard title="Report Cards" value="View All" icon={FileText} link="/dashboard/my-reports" isLoading={isLoading} color="text-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Users className="h-5 w-5 text-indigo-600"/> My Children
                        </CardTitle>
                        <CardDescription>Quick links to financial statements.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-16 w-full rounded-xl" />
                                <Skeleton className="h-16 w-full rounded-xl" />
                            </div>
                        ) : children && children.length > 0 ? (
                            children.map((child: any) => (
                                <Link key={child.uid} href={`/dashboard/my-bills`} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 border transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold uppercase">
                                            {child.firstName?.[0]}{child.lastName?.[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{child.firstName} {child.lastName}</p>
                                            <p className="text-xs text-slate-500 uppercase font-bold">{child.classId || 'No Class'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">View Bills</span>
                                        <ChevronRight className="h-4 w-4 text-slate-300"/>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-center py-10 text-muted-foreground italic text-sm">No children linked to your account.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Megaphone className="h-5 w-5 text-blue-600"/> Recent Announcements
                        </CardTitle>
                        <CardDescription>Stay updated with school news.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                            </div>
                        ) : announcements && announcements.length > 0 ? (
                            announcements.map((ann: any) => (
                                <div key={ann.id} className="border-b last:border-0 pb-3 last:pb-0">
                                    <p className="font-semibold text-sm text-slate-800">{ann.title}</p>
                                    <p className="text-xs text-slate-500 line-clamp-1 mt-1">{ann.content}</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{ann.publishedAt ? format(ann.publishedAt.toDate(), 'PPP') : 'Just now'}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center py-10 text-muted-foreground italic text-sm">No recent announcements.</p>
                        )}
                        <Button variant="outline" className="w-full text-xs font-bold" asChild>
                            <Link href="/dashboard/announcements">View All Announcements</Link>
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
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">HELLO, {displayName.toUpperCase()}! 👋</h1>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Your Educational Hub</p>
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
                        <CardTitle className="text-2xl font-black flex items-center gap-3"><Clock className="h-6 w-6"/> My Portal</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link href="/dashboard/my-grades" className="p-6 bg-slate-50 rounded-3xl border hover:border-indigo-500 transition-all group">
                            <TrendingUp className="h-8 w-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform"/>
                            <p className="font-black text-slate-800 uppercase text-sm tracking-tight">Live Grades</p>
                        </Link>
                        <Link href="/dashboard/my-reports" className="p-6 bg-slate-50 rounded-3xl border hover:border-indigo-500 transition-all group">
                            <FileText className="h-8 w-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform"/>
                            <p className="font-black text-slate-800 uppercase text-sm tracking-tight">Term Reports</p>
                        </Link>
                        <Link href="/dashboard/my-bills" className="p-6 bg-slate-50 rounded-3xl border hover:border-indigo-500 transition-all group">
                            <Banknote className="h-8 w-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform"/>
                            <p className="font-black text-slate-800 uppercase text-sm tracking-tight">Fees & Bills</p>
                        </Link>
                        <Link href="/dashboard/assignments" className="p-6 bg-slate-50 rounded-3xl border hover:border-indigo-500 transition-all group">
                            <CalendarCheck className="h-8 w-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform"/>
                            <p className="font-black text-slate-800 uppercase text-sm tracking-tight">My Tasks</p>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                    <CardHeader className="p-8">
                        <CardTitle className="text-2xl font-black flex items-center gap-3 text-emerald-400"><Sparkles /> AI Study Partner</CardTitle>
                        <CardDescription className="text-slate-400 font-bold">Stuck on homework? Ask Dr. Gam!</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="flex flex-col items-center text-center gap-6">
                            <div className="bg-white/10 p-6 rounded-full animate-pulse"><BrainCircuit className="h-12 w-12 text-emerald-400"/></div>
                            <Button asChild className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-lg rounded-2xl shadow-lg">
                                <Link href="/dashboard/study-club">START CHAT SESSION</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ClubCard({ title, path, icon: Icon, color }: any) {
    return (
        <Link href={path} className={cn("p-8 rounded-[2.5rem] shadow-xl hover:scale-105 active:scale-95 transition-all text-white flex flex-col items-center justify-center gap-4", color)}>
            <Icon className="h-12 w-12" />
            <span className="font-black tracking-widest text-lg">{title}</span>
        </Link>
    );
}

export default function DashboardClient() {
  const { role, profile, loading: roleLoading } = useRole();
  const firestore = useFirestore();
  const { schoolId, loading: schoolLoading } = useCurrentSchool();

  const isStaff = ['Administrator', 'Director', 'Teacher', 'Accountant', 'Transport Staff'].includes(role || '');
  const isParent = role === 'Parent';
  const isAccountant = role === 'Accountant';
  const isTransportStaff = role === 'Transport Staff';
  const canListStaff = ['Administrator', 'Director', 'Accountant'].includes(role || '');

  const studentsQuery = useMemoFirebase(() => 
    (firestore && schoolId && isStaff) 
        ? query(
            collection(firestore, 'students'), 
            where('schoolId', '==', schoolId),
            where('enrollmentStatus', '==', 'Active') // <--- THE FIX
        ) 
        : null, 
  [firestore, schoolId, isStaff]);
  const { data: students, isLoading: loadingStudents } = useCollection<Student>(studentsQuery);

  const staffQuery = useMemoFirebase(() => (firestore && schoolId && canListStaff) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, canListStaff]);
  const { data: staff, isLoading: loadingStaff } = useCollection(staffQuery);

  const classesQuery = useMemoFirebase(() => (firestore && schoolId && isStaff) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isStaff]);
  const { data: classes, isLoading: loadingClasses } = useCollection(classesQuery);

  // Accountant Specific Queries
  const recordsQuery = useMemoFirebase(() => (firestore && schoolId && isAccountant) ? query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isAccountant]);
  const { data: records, isLoading: loadingRecords } = useCollection(recordsQuery);

  const tillsQuery = useMemoFirebase(() => (firestore && schoolId && isAccountant) ? query(collection(firestore, 'tills'), where('schoolId', '==', schoolId), where('accountantId', '==', profile?.uid)) : null, [firestore, schoolId, isAccountant, profile?.uid]);
  const { data: tills, isLoading: loadingTills } = useCollection(tillsQuery);

  // Transport Specific Queries
  const routesQuery = useMemoFirebase(() => (firestore && schoolId && isTransportStaff) ? query(collection(firestore, 'routes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isTransportStaff]);
  const { data: routes, isLoading: loadingRoutes } = useCollection<Route>(routesQuery);

  const busesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'buses'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: buses, isLoading: loadingBuses } = useCollection<Bus>(busesQuery);

  const parentStudentsQuery = useMemoFirebase(() => 
    (firestore && schoolId && isParent && profile?.studentIds?.length) 
      ? query(collection(firestore, 'students'), where('uid', 'in', profile.studentIds), where('enrollmentStatus', '==', 'Active')) 
      : null, 
  [firestore, schoolId, isParent, profile?.studentIds]);
  const { data: parentStudents, isLoading: loadingParentStudents } = useCollection(parentStudentsQuery);

  const parentFinancialsQuery = useMemoFirebase(() => 
    (firestore && schoolId && isParent && profile?.studentIds?.length) 
      ? query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId), where('studentId', 'in', profile.studentIds)) 
      : null, 
  [firestore, schoolId, isParent, profile?.studentIds]);
  const { data: parentFinancials, isLoading: loadingParentFinancials } = useCollection(parentFinancialsQuery);

  const annQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId || !role) return null;
    let q = query(collection(firestore, 'announcements_v2'), where('schoolId', '==', schoolId), orderBy('publishedAt', 'desc'), limit(5));
    if (!isStaff && role) {
        q = query(q, where('audience', 'array-contains-any', ['Everybody', role]));
    }
    return q;
  }, [firestore, schoolId, role, isStaff]);
  const { data: announcements, isLoading: loadingAnnouncements } = useCollection(annQuery);

  const isLoading = roleLoading || schoolLoading || (isStaff && (loadingStudents || loadingStaff || loadingClasses)) || (isParent && (loadingParentStudents || loadingParentFinancials)) || (isAccountant && (loadingRecords || loadingTills)) || (isTransportStaff && (loadingRoutes || loadingBuses));

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
  }

  if (role === 'Administrator' || role === 'Director') {
    return <AdminDashboard profile={profile} students={students} staff={staff} classes={classes} announcements={announcements} isLoading={isLoading} />;
  }

  if (role === 'Accountant') {
    return <AccountantDashboard profile={profile} students={students} classes={classes} records={records} tills={tills} announcements={announcements} isLoading={isLoading} />;
  }

  if (role === 'Transport Staff') {
    return <TransportStaffDashboard profile={profile} routes={routes} buses={buses} students={students} announcements={announcements} isLoading={isLoading} />;
  }

  if (role === 'Teacher') {
    return <TeacherDashboard profile={profile} classes={classes} isLoading={isLoading} />;
  }

  if (role === 'Parent') {
    return <ParentDashboard profile={profile} children={parentStudents} financials={parentFinancials} announcements={announcements} isLoading={isLoading} />;
  }

  return <StudentDashboard profile={profile} />;
}
