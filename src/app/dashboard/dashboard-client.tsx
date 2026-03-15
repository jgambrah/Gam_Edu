
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, limit, doc } from 'firebase/firestore';
import { 
  GraduationCap, Users, School, Banknote, Loader2, 
  PlusCircle, FilePen, BookOpen, Calendar,
  ClipboardCheck, Bell, FileText,
  CreditCard, DollarSign, Receipt, Package, Award,
  Clock, CheckCircle2, UserCheck, BookMarked, Landmark, ChevronRight, Megaphone, CalendarCheck,
  TrendingUp, Sparkles, FolderKanban, HeartHandshake, User as UserIcon,
  BrainCircuit, Sigma, FlaskConical, BookOpenCheck, Code, ShoppingBag, Wallet, Calculator, ArrowUpRight,
  AlertCircle, Book
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { STAFF_ROLES } from '@/lib/types';

// --- Reusable Components ---

function StatCard({ title, value, icon: Icon, link, isLoading, badge, trend, colorClass = "text-muted-foreground" }: any) {
  return (
    <Link href={link}>
      <Card className="hover:bg-accent hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
            <Icon className={`h-4 w-4 ${colorClass}`} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <div className="space-y-1">
              <div className="text-2xl font-bold">{value}</div>
              {trend && (
                <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function QuickActionCard({ title, description, icon: Icon, link }: any) {
  return (
    <Link href={link}>
      <Card className="hover:bg-accent hover:shadow-md transition-all cursor-pointer h-full border-none shadow-none bg-slate-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-white p-3 shadow-sm border">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{title}</h3>
              {description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function ActivityItem({ title, description, time, icon: Icon, iconColor = "text-blue-600" }: any) {
  return (
    <div className="flex items-start gap-4 pb-4 last:pb-0">
      <div className={`rounded-full p-2 bg-secondary ${iconColor}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

// --- ACCOUNTANT DASHBOARD COMPONENT ---
function AccountantDashboard({ profile, schoolId, financialRecords }: { profile: any, schoolId: string, financialRecords: any[] | null }) {
  const { user } = useUser();
  const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Accountant';

  const stats = useMemo(() => {
    if (!financialRecords) return { totalRevenue: 0, totalOutstanding: 0, debtorCount: 0, byType: [] as any[] };
    
    let paid = 0;
    let outstanding = 0;
    const debtorIds = new Set();
    const typeTotals: Record<string, number> = {};

    financialRecords.forEach(r => {
      paid += (r.amountPaid || 0);
      const balance = (r.billedAmount || 0) - (r.amountPaid || 0) - (r.waiverAmount || 0);
      if (balance > 0.01) {
        outstanding += balance;
        debtorIds.add(r.studentId);
      }
      // Group revenue by type
      const type = r.type || 'Other';
      typeTotals[type] = (typeTotals[type] || 0) + (r.amountPaid || 0);
    });

    return {
      totalRevenue: paid,
      totalOutstanding: outstanding,
      debtorCount: debtorIds.size,
      byType: Object.entries(typeTotals).map(([name, value]) => ({ name, value })).filter(i => i.value > 0)
    };
  }, [financialRecords]);

  const recentCollections = useMemo(() => {
    if (!financialRecords) return [];
    return [...financialRecords]
      .filter(r => (r.amountPaid || 0) > 0)
      .sort((a, b) => (b.lastPaymentDate?.seconds || 0) - (a.lastPaymentDate?.seconds || 0))
      .slice(0, 5);
  }, [financialRecords]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Financial Hub: {displayName} 💰</h1>
        <p className="text-muted-foreground">Manage billings, payments, and payroll.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={`GH₵${stats.totalRevenue.toLocaleString()}`} icon={Landmark} link="/dashboard/reports/financials" colorClass="text-emerald-600" />
        <StatCard title="Outstanding Fees" value={`GH₵${stats.totalOutstanding.toLocaleString()}`} icon={AlertCircle} link="/dashboard/accounts" colorClass="text-red-600" />
        <StatCard title="Active Debtors" value={stats.debtorCount} icon={Users} link="/dashboard/accounts" colorClass="text-orange-600" />
        <StatCard title="Pending Records" value={financialRecords?.length || 0} icon={FileText} link="/dashboard/accounts" colorClass="text-blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ArrowUpRight className="text-emerald-500 h-5 w-5"/> Revenue Distribution</CardTitle>
            <CardDescription>Breakdown of collections by fee category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {stats.byType.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byType}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground italic">No revenue recorded yet.</div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-lg">Quick Finance Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/accounts" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg"><DollarSign className="h-4 w-4 text-emerald-600"/></div>
                    <span className="text-sm font-semibold">Record Payment</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/accounts/cash-till" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><Wallet className="h-4 w-4 text-blue-600"/></div>
                    <span className="text-sm font-semibold">My Cash Till</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/finance/payroll" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg"><Calculator className="h-4 w-4 text-purple-600"/></div>
                    <span className="text-sm font-semibold">Run Payroll</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/finance/accounting" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg"><Book className="h-4 w-4 text-slate-600"/></div>
                    <span className="text-sm font-semibold">General Ledger</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Collections</CardTitle>
          <CardDescription>The latest fees processed for your school.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCollections.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{record.studentName}</p>
                    <p className="text-xs text-muted-foreground">{record.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-700">+GH₵{record.amountPaid.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-400">
                    {record.lastPaymentDate ? formatDistanceToNow(record.lastPaymentDate.toDate(), { addSuffix: true }) : ''}
                  </p>
                </div>
              </div>
            ))}
            {recentCollections.length === 0 && <p className="text-center py-6 text-muted-foreground italic">No recent collections found.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- STUDENT DASHBOARD COMPONENT ---
function StudentDashboard({ profile, schoolId }: { profile: any, schoolId: string }) {
  const firestore = useFirestore();
  const { user } = useUser();

  // 1. Fetch Student Data
  const studentQuery = useMemoFirebase(() => (firestore && user && schoolId) ? query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, [firestore, user, schoolId]);
  const { data: studentData, isLoading: loadingStudent } = useCollection<any>(studentQuery);
  const student = studentData?.[0];

  const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Learner';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Hello, {displayName}! 👋</h1>
        <p className="text-muted-foreground">Ready for a great day of learning?</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="My Class" value={student?.classId || 'Not Assigned'} icon={School} link="/dashboard/timetable" colorClass="text-blue-600" />
        <StatCard title="My Grades" value="View All" icon={TrendingUp} link="/dashboard/my-grades" colorClass="text-emerald-600" />
        <StatCard title="Assignments" value="View Tasks" icon={ClipboardCheck} link="/dashboard/assignments" colorClass="text-orange-600" />
        <StatCard title="Materials" value="Browse" icon={FolderKanban} link="/dashboard/academics/learning-materials" colorClass="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="text-yellow-500 h-5 w-5"/> Learning Hub</CardTitle>
            <CardDescription>Quick access to your academic clubs and activities.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuickActionCard title="Maths Club" description="Practice problems and climb the leaderboard." icon={Sigma} link="/dashboard/maths-club-v2" />
                <QuickActionCard title="Science Lab" description="Explore facts and AI-led lessons." icon={FlaskConical} link="/dashboard/science-club-v2" />
                <QuickActionCard title="ELA Club" description="Grammar, reading, and writing challenges." icon={BookOpenCheck} link="/dashboard/ela-club" />
                <QuickActionCard title="Coding Club" description="Learn to build with blocks and Python." icon={Code} link="/dashboard/coding-club" />
             </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-lg">My Portal</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/timetable" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><Calendar className="h-4 w-4 text-blue-600"/></div>
                    <span className="text-sm font-semibold">Weekly Timetable</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/study-club" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg"><BrainCircuit className="h-4 w-4 text-purple-600"/></div>
                    <span className="text-sm font-semibold">Dr. Gam AI Tutor</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/my-reports" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg"><FileText className="h-4 w-4 text-emerald-600"/></div>
                    <span className="text-sm font-semibold">Official Report Cards</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- PARENT DASHBOARD COMPONENT ---
function ParentDashboard({ profile, schoolId }: { profile: any, schoolId: string }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const studentIds = profile?.studentIds || [];

  // 1. Fetch Children Data
  const studentsQuery = useMemoFirebase(() => (firestore && studentIds.length > 0 && schoolId) ? query(collection(firestore, 'students'), where('uid', 'in', studentIds), where('schoolId', '==', schoolId)) : null, [firestore, studentIds.join(','), schoolId]);
  const { data: children, isLoading: loadingChildren } = useCollection<any>(studentsQuery);

  // 2. Fetch Financial Records for all children
  const financialQuery = useMemoFirebase(() => (firestore && studentIds.length > 0 && schoolId) ? query(collection(firestore, 'financialRecords'), where('studentId', 'in', studentIds), where('schoolId', '==', schoolId)) : null, [firestore, studentIds.join(','), schoolId]);
  const { data: finances, isLoading: loadingFinances } = useCollection<any>(financialQuery);

  const totalBalance = useMemo(() => {
    if (!finances) return 0;
    return finances.reduce((sum, rec) => {
      const balance = (rec.billedAmount || 0) - (rec.amountPaid || 0) - (rec.waiverAmount || 0);
      return sum + balance;
    }, 0);
  }, [finances]);

  const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Parent';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome, {displayName}! 🏡</h1>
        <p className="text-muted-foreground">Keep track of your children's school activities and fees.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="My Children" value={studentIds.length} icon={Users} link="/dashboard/my-children" colorClass="text-blue-600" />
        <StatCard title="Total Outstanding" value={`GH₵${totalBalance.toFixed(2)}`} icon={Landmark} link="/dashboard/my-bills" colorClass={totalBalance > 0 ? "text-red-600" : "text-emerald-600"} badge={totalBalance > 0 ? "Due" : "Paid"} />
        <StatCard title="Latest News" value="View Announcements" icon={Megaphone} link="/dashboard/announcements" colorClass="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><GraduationCap className="text-indigo-600 h-5 w-5"/> My Children</CardTitle>
            <CardDescription>Quick summary of your children's status.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingChildren ? <Loader2 className="animate-spin mx-auto h-8 w-8"/> : children && children.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {children.map((child: any) => {
                  const childBalance = finances?.filter(f => f.studentId === child.uid).reduce((sum, rec) => sum + (rec.billedAmount - (rec.amountPaid || 0) - (rec.waiverAmount || 0)), 0) || 0;
                  return (
                    <Card key={child.uid} className="bg-slate-50 border-slate-100">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {child.firstName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{child.firstName} {child.lastName}</p>
                            <p className="text-xs text-muted-foreground">{child.classId || 'Class Pending'}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t pt-3">
                          <span className="text-slate-500">Fees Balance:</span>
                          <span className={`font-bold ${childBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>GH₵{childBalance.toFixed(2)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground italic">No children linked to your account. Please contact the administrator.</div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Fast Navigation</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/my-bills" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg"><CreditCard className="h-4 w-4 text-indigo-600"/></div>
                    <span className="text-sm font-semibold">Pay School Fees</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/my-reports" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg"><FileText className="h-4 w-4 text-emerald-600"/></div>
                    <span className="text-sm font-semibold">View Report Cards</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/my-children" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><CalendarCheck className="h-4 w-4 text-blue-600"/></div>
                    <span className="text-sm font-semibold">Attendance Logs</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- TEACHER DASHBOARD COMPONENT ---
function TeacherDashboard({ profile }: { profile: any }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();

  const teacherClassesQuery = useMemoFirebase(() => (firestore && user && schoolId) ? query(collection(firestore, 'classes'), where('teacherId', '==', user.uid), where('schoolId', '==', schoolId)) : null, [firestore, user, schoolId]);
  const { data: teacherClasses, isLoading: loadingClasses } = useCollection<any>(teacherClassesQuery);

  const teacherClassIds = useMemo(() => teacherClasses?.map((c: any) => c.id) || [], [teacherClasses]);
  const studentsQuery = useMemoFirebase(() => (firestore && schoolId && teacherClassIds.length > 0) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('classId', 'in', teacherClassIds)) : null, [firestore, teacherClassIds.join(','), schoolId]);
  const { data: students, isLoading: loadingStudents } = useCollection<any>(studentsQuery);

  const assignmentsQuery = useMemoFirebase(() => (firestore && user && schoolId) ? query(collection(firestore, 'assignments'), where('teacherId', '==', user.uid), where('schoolId', '==', schoolId), orderBy('dueDate', 'asc'), limit(5)) : null, [firestore, user, schoolId]);
  const { data: assignments, isLoading: loadingAssignments } = useCollection<any>(assignmentsQuery);

  const isLoading = loadingClasses || loadingStudents || loadingAssignments;
  const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Teacher';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome back, {displayName}! 🍎</h1>
        <p className="text-muted-foreground">Manage your classes, assignments, and student progress.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="My Students" value={students?.length ?? 0} icon={Users} link="/dashboard/students-v3" isLoading={isLoading} />
        <StatCard title="My Classes" value={teacherClasses?.length ?? 0} icon={School} link="/dashboard/academics" isLoading={isLoading} />
        <StatCard title="Assignments Due" value={assignments?.filter(a => new Date((a as any).dueDate.toDate()) > new Date()).length ?? 0} icon={ClipboardCheck} link="/dashboard/assignments" isLoading={isLoading} />
        <StatCard title="Announcements" value={"View"} icon={Megaphone} link="/dashboard/announcements" isLoading={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/assignments" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><FilePen className="h-4 w-4 text-blue-600"/></div>
                    <span className="text-sm font-semibold">New Assignment</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/attendance" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg"><CalendarCheck className="h-4 w-4 text-green-600"/></div>
                    <span className="text-sm font-semibold">Take Attendance</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/academics/gradebook" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg"><BookOpen className="h-4 w-4 text-amber-600"/></div>
                    <span className="text-sm font-semibold">Enter Grades</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Upcoming Deadlines</CardTitle></CardHeader>
          <CardContent>
            {loadingAssignments ? <p>Loading...</p> : assignments && assignments.length > 0 ? (
              <ul className="space-y-3">
                {assignments.map((a:any) => (
                  <li key={a.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-md">
                    <div>
                      <p className="font-semibold text-sm">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{(teacherClasses as any)?.find((c: any) => c.id === a.classId)?.name || 'Unknown Class'}</p>
                    </div>
                    <Badge variant={new Date(a.dueDate.toDate()) < new Date() ? "destructive" : "secondary"}>
                      Due {formatDistanceToNow(a.dueDate.toDate(), { addSuffix: true })}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : <p className="text-center text-sm text-muted-foreground py-4">No upcoming deadlines.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function DashboardClient() {
  const { user, isUserLoading } = useUser();
  const { role, profile, loading: isRoleLoading } = useRole();
  const firestore = useFirestore();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const isAdminOrDirector = role === 'Administrator' || role === 'Director';
  const isTeacher = role === 'Teacher';
  const isStudent = role === 'Student';
  const isParent = role === 'Parent';
  const isFinance = role === 'Accountant';
  const isLibrarian = role === 'Librarian';
  const isStaffUser = isAdminOrDirector || isTeacher || isFinance || isLibrarian;

  const studentsQuery = useMemoFirebase(() => (firestore && schoolId && isStaffUser) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isStaffUser]);
  const { data: students, isLoading: studentsLoading } = useCollection<any>(studentsQuery);

  const staffQuery = useMemoFirebase(() => (firestore && schoolId && isAdminOrDirector) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId), where('role', 'in', STAFF_ROLES)) : null, [firestore, schoolId, isAdminOrDirector]);
  const { data: staff, isLoading: staffLoading } = useCollection<any>(staffQuery);

  const classesQuery = useMemoFirebase(() => (firestore && schoolId && isStaffUser) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isStaffUser]);
  const { data: classes, isLoading: classesLoading } = useCollection<any>(classesQuery);
  
  const assignmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore || !schoolId) return null;
    let q = query(collection(firestore, 'assignments'), where('schoolId', '==', schoolId));
    if(isTeacher) q = query(q, where('teacherId', '==', user.uid));
    return q;
  }, [firestore, user, isTeacher, schoolId]);
  const { data: assignments, isLoading: assignmentsLoading } = useCollection<any>(assignmentsQuery);

  const announcementsQuery = useMemoFirebase(() => {
    if(!firestore || !schoolId) return null;
    return query(collection(firestore, 'announcements_v2'), where('schoolId', '==', schoolId), orderBy('publishedAt', 'desc'), limit(5))
  }, [firestore, schoolId]);
  const { data: announcements, isLoading: announcementsLoading } = useCollection<any>(announcementsQuery);
  
  const leaveRequestsQuery = useMemoFirebase(() => (firestore && isStaffUser && schoolId) ? query(collection(firestore, 'leaveRequests'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'), limit(5)) : null, [firestore, isStaffUser, schoolId]);
  const { data: leaveRequests, isLoading: leaveLoading } = useCollection<any>(leaveRequestsQuery);
  
  const financialRecordsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId || !(isFinance || isAdminOrDirector)) return null;
    return query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'));
  }, [firestore, isFinance, isAdminOrDirector, schoolId]);
  const { data: financialRecords, isLoading: paymentsLoading } = useCollection<any>(financialRecordsQuery);
  
  const recentActivity = useMemo(() => {
    const activities: any[] = [];
    if (students) activities.push(...students.map(s => ({ id: `student-${(s as any).id}`, type: 'Student', title: 'New Student', description: `${(s as any).firstName} ${(s as any).lastName}`, time: (s as any).createdAt, icon: UserCheck, iconColor: 'text-green-600' })));
    if (announcements) activities.push(...announcements.map((a: any) => ({ id: `announcement-${a.id}`, type: 'News', title: 'Announcement', description: a.title, time: a.publishedAt, icon: Bell, iconColor: 'text-purple-600' })));
    if (financialRecords) activities.push(...financialRecords.map((p: any) => ({ id: `payment-${p.id}`, type: 'Payment', title: 'Payment', description: `GH₵${p.amountPaid}`, time: p.createdAt, icon: CheckCircle2, iconColor: 'text-emerald-600' })));
    
    return activities.sort((a,b) => (b.time?.seconds || 0) - (a.time?.seconds || 0)).slice(0, 5);
  }, [students, announcements, financialRecords]);

  const enrollmentData = useMemo(() => {
    if (!classes || !students) return [];
    return classes.map(c => ({
      name: (c as any).name,
      students: students.filter(s => (s as any).classId === (c as any).id).length
    })).sort((a, b) => b.students - a.students);
  }, [classes, students]);

  const isLoading = studentsLoading || staffLoading || classesLoading || leaveLoading || announcementsLoading || assignmentsLoading;
  
  if (isUserLoading || isRoleLoading || isLoadingSchool) {
      return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <span className="ml-3 text-muted-foreground">Loading your workspace...</span>
        </div>
      );
  }

  if (isTeacher) return <TeacherDashboard profile={profile} />;
  if (isStudent) return <StudentDashboard profile={profile} schoolId={schoolId!} />;
  if (isParent) return <ParentDashboard profile={profile} schoolId={schoolId!} />;
  if (isFinance) return <AccountantDashboard profile={profile} schoolId={schoolId!} financialRecords={financialRecords} />;

  if (isAdminOrDirector) {
      const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Administrator';
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
                <Link href="/dashboard/finance/accounting" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {recentActivity.map((item) => (
                        <ActivityItem key={item.id} {...item} time={item.time ? formatDistanceToNow(item.time.toDate(), { addSuffix: true }) : ''} />
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Latest Announcements</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {announcements?.slice(0, 3).map((a: any) => (
                        <div key={a.id} className="p-3 bg-slate-50 rounded-lg border">
                            <p className="font-bold text-sm">{a.title}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{a.content}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
          </div>
        </div>
      );
  }

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome, {profile?.firstName || 'User'}!</h1>
        <Card>
            <CardHeader><CardTitle>Dashboard</CardTitle></CardHeader>
            <CardContent><p>Select an option from the menu to begin.</p></CardContent>
        </Card>
    </div>
  );
}
