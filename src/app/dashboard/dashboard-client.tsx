
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { 
  GraduationCap, Users, School, Banknote, Loader2, 
  PlusCircle, FilePen, BookOpen, Calendar,
  ClipboardCheck, Bell, FileText,
  CreditCard, DollarSign, Receipt, Package, Award,
  Clock, CheckCircle2, UserCheck, BookMarked, Landmark, ChevronRight, Megaphone, CalendarCheck
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow, isThisMonth } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentDisplay } from '@/components/student-display';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { STAFF_ROLES } from '@/lib/types'; // Import STAFF_ROLES

// --- Reusable Components ---

function StatCard({ title, value, icon: Icon, link, isLoading, badge, trend }: any) {
  return (
    <Link href={link}>
      <Card className="hover:bg-accent hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
            <Icon className="h-4 w-4 text-muted-foreground" />
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
      <Card className="hover:bg-accent hover:shadow-md transition-all cursor-pointer h-full">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{title}</h3>
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
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


// --- NEW TEACHER DASHBOARD COMPONENT ---
function TeacherDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();

  // 1. Fetch teacher's classes
  const teacherClassesQuery = useMemoFirebase(() => (firestore && user && schoolId) ? query(collection(firestore, 'classes'), where('teacherId', '==', user.uid), where('schoolId', '==', schoolId)) : null, [firestore, user, schoolId]);
  const { data: teacherClasses, isLoading: loadingClasses } = useCollection(teacherClassesQuery);

  // 2. Fetch students in those classes
  const teacherClassIds = useMemo(() => teacherClasses?.map((c: any) => c.id) || [], [teacherClasses]);
  const studentsQuery = useMemoFirebase(() => (firestore && schoolId && teacherClassIds.length > 0) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('classId', 'in', teacherClassIds)) : null, [firestore, teacherClassIds.join(','), schoolId]);
  const { data: students, isLoading: loadingStudents } = useCollection(studentsQuery);

  // 3. Fetch upcoming assignments
  const assignmentsQuery = useMemoFirebase(() => (firestore && user && schoolId) ? query(collection(firestore, 'assignments'), where('teacherId', '==', user.uid), where('schoolId', '==', schoolId), orderBy('dueDate', 'asc'), limit(5)) : null, [firestore, user, schoolId]);
  const { data: assignments, isLoading: loadingAssignments } = useCollection(assignmentsQuery);

  const isLoading = loadingClasses || loadingStudents || loadingAssignments;

  return (
    <div className="space-y-6">
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
            <QuickActionCard title="New Assignment" icon={FilePen} link="/dashboard/assignments" />
            <QuickActionCard title="Take Attendance" icon={CalendarCheck} link="/dashboard/attendance" />
            <QuickActionCard title="Enter Grades" icon={BookOpen} link="/dashboard/academics/gradebook" />
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

  // Role checks
  const isAdminOrDirector = role === 'Administrator' || role === 'Director';
  const isTeacher = role === 'Teacher';
  const isStudent = role === 'Student';
  const isParent = role === 'Parent';
  const isFinance = role === 'Accountant';
  const isLibrarian = role === 'Librarian';
  const isStaffUser = isAdminOrDirector || isTeacher || isFinance || isLibrarian;

  // --- 1. HOOKS: DATA FETCHING (All hooks are now at the top level) ---
  
  const studentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: students, isLoading: studentsLoading } = useCollection(studentsQuery);

  const staffQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId), where('role', 'in', STAFF_ROLES)) : null, [firestore, schoolId]);
  const { data: staff, isLoading: staffLoading } = useCollection(staffQuery);

  const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: classes, isLoading: classesLoading } = useCollection(classesQuery);
  
  const assignmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore || !schoolId) return null;
    let q = query(collection(firestore, 'assignments'), where('schoolId', '==', schoolId));
    if(isTeacher) q = query(q, where('teacherId', '==', user.uid));
    return q;
  }, [firestore, user, isTeacher, schoolId]);
  const { data: assignments, isLoading: assignmentsLoading } = useCollection(assignmentsQuery);

  const announcementsQuery = useMemoFirebase(() => {
    if(!firestore || !schoolId) return null;
    return query(collection(firestore, 'announcements_v2'), where('schoolId', '==', schoolId), orderBy('publishedAt', 'desc'), limit(5))
  }, [firestore, schoolId]);
  const { data: announcements, isLoading: announcementsLoading } = useCollection(announcementsQuery);
  
  const leaveRequestsQuery = useMemoFirebase(() => (firestore && isStaffUser && schoolId) ? query(collection(firestore, 'leaveRequests'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'), limit(5)) : null, [firestore, isStaffUser, schoolId]);
  const { data: leaveRequests, isLoading: leaveLoading } = useCollection(leaveRequestsQuery);
  
  const libraryItemsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'library')) : null, [firestore]);
  const { data: libraryItems, isLoading: libraryLoading } = useCollection(libraryItemsQuery);

  const financialRecordsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId || !(isFinance || isAdminOrDirector)) return null;
    return query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'));
  }, [firestore, isFinance, isAdminOrDirector, schoolId]);
  const { data: financialRecords, isLoading: paymentsLoading } = useCollection<any>(financialRecordsQuery);
  
  const accountsPayableQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId || !(isFinance || isAdminOrDirector)) return null;
    return query(collection(firestore, 'accountsPayable'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'));
  }, [firestore, isFinance, isAdminOrDirector, schoolId]);
  const { data: accountsPayable, isLoading: payablesLoading } = useCollection<any>(accountsPayableQuery);


  // --- 2. HOOKS: DATA PROCESSING ---

  const recentActivity = useMemo(() => {
    const activities = [];
    if (students) activities.push(...students.map(s => ({ type: 'Student', title: 'New Student', description: `${(s as any).firstName} ${(s as any).lastName}`, time: (s as any).createdAt, icon: UserCheck, iconColor: 'text-green-600' })));
    if (announcements) activities.push(...announcements.map(a => ({ type: 'News', title: 'Announcement', description: (a as any).title, time: (a as any).publishedAt, icon: Bell, iconColor: 'text-purple-600' })));
    if (financialRecords) activities.push(...financialRecords.map(p => ({ type: 'Payment', title: 'Payment', description: `GH₵${p.amountPaid}`, time: p.createdAt, icon: CheckCircle2, iconColor: 'text-emerald-600' })));
    
    return activities.sort((a,b) => (b.time?.seconds || 0) - (a.time?.seconds || 0)).slice(0, 5);
  }, [students, announcements, financialRecords]);

  const stats = useMemo(() => {
    const pendingLeave = leaveRequests?.filter(l => (l as any).status === 'Pending').length || 0;
    const todayAssignments = assignments?.filter(a => {
      const dueDate = (a as any).dueDate?.toDate?.();
      const today = new Date();
      return dueDate && dueDate.toDateString() === today.toDateString();
    }).length || 0;
    const totalBooks = libraryItems?.reduce((sum, item) => sum + ((item as any).quantity || 0), 0) || 0;
    const availableBooks = libraryItems?.reduce((sum, item) => (item as any).status === 'Available' ? sum + ((item as any).quantity || 0) : sum, 0) || 0;
    const overdueBooks = libraryItems?.filter(l => (l as any).status === 'Borrowed' && (l as any).dueDate?.toDate?.() < new Date()).length || 0;
    
    return {
      pendingLeave,
      todayAssignments,
      totalBooks,
      availableBooks,
      overdueBooks
    };
  }, [leaveRequests, assignments, libraryItems]);

  const enrollmentData = useMemo(() => {
    if (!classes || !students) return [];
    return classes.map(c => ({
      name: (c as any).name,
      students: students.filter(s => (s as any).classId === (c as any).id).length
    })).sort((a, b) => b.students - a.students);
  }, [classes, students]);

  const staffByRole = useMemo(() => {
    if (!staff) return [];
    const roles = staff.reduce((acc, s) => {
      acc[(s as any).role] = (acc[(s as any).role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(roles).map(([name, value]) => ({ name, value }));
  }, [staff]);
  
  const financeStats = useMemo(() => {
    if (!financialRecords || !accountsPayable) return { monthlyRevenue: 0, pendingPayments: 0, monthlyExpenses: 0, outstandingInvoices: 0, chartData: [] };
    
    let monthlyRevenue = 0;
    let monthlyExpenses = 0;
    const revenueByDay: Record<string, number> = {};
    const expensesByDay: Record<string, number> = {};

    financialRecords.forEach(rec => {
        if (rec.createdAt && isThisMonth(rec.createdAt.toDate())) {
            monthlyRevenue += (rec.amountPaid || 0);
            const day = format(rec.createdAt.toDate(), 'MMM dd');
            revenueByDay[day] = (revenueByDay[day] || 0) + (rec.amountPaid || 0);
        }
    });

    accountsPayable.forEach(bill => {
        if (bill.paidAt && isThisMonth(bill.paidAt.toDate())) {
            monthlyExpenses += bill.amount;
            const day = format(bill.paidAt.toDate(), 'MMM dd');
            expensesByDay[day] = (expensesByDay[day] || 0) + bill.amount;
        }
    });
    
    const pendingPayments = financialRecords.filter(r => r.status === 'Unpaid' || r.status === 'Overdue').length;
    const outstandingInvoices = accountsPayable.filter(b => b.status === 'Unpaid').length;

    const allDays = new Set([...Object.keys(revenueByDay), ...Object.keys(expensesByDay)]);
    const chartData = Array.from(allDays).sort().map(day => ({
        month: day,
        revenue: revenueByDay[day] || 0,
        expenses: expensesByDay[day] || 0,
    }));

    return { monthlyRevenue, pendingPayments, monthlyExpenses, outstandingInvoices, chartData };
  }, [financialRecords, accountsPayable]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // --- 3. LOADING & GUARD CLAUSES (Moved after hooks) ---

  const isLoading = studentsLoading || staffLoading || classesLoading || leaveLoading || announcementsLoading || assignmentsLoading;
  
  if (isUserLoading || isRoleLoading || isLoadingSchool) {
      return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <span className="ml-3 text-muted-foreground">Loading your workspace...</span>
        </div>
      );
  }

  if (!schoolId && role !== 'Director') { 
      if (user?.email !== 'jamesgambrah@gmail.com') {
        return (
            <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg">
                <h2 className="text-xl font-bold text-red-700">Account Configuration Error</h2>
                <p className="text-red-600">Your account is not linked to a valid school ID.</p>
            </div>
        );
      }
  }

  // --- 4. RENDER BY ROLE ---

  if (isTeacher) {
    return <TeacherDashboard />;
  }

  if (isAdminOrDirector) {
      return (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Students" value={students?.length || 0} icon={GraduationCap} link="/dashboard/students-v3" isLoading={isLoading} />
            <StatCard title="Total Staff" value={staff?.length || 0} icon={Users} link="/dashboard/staff-management-v2" isLoading={isLoading} />
            <StatCard title="Active Classes" value={classes?.length || 0} icon={School} link="/dashboard/academics" isLoading={isLoading} />
            <StatCard title="Pending Leave" value={stats.pendingLeave} icon={ClipboardCheck} link="/dashboard/hr/leave-management" isLoading={isLoading} badge={stats.pendingLeave > 0 ? "Action" : undefined} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <QuickActionCard title="Add Student" icon={GraduationCap} link="/dashboard/students-v3" />
                <QuickActionCard title="Add Staff" icon={Users} link="/dashboard/staff-management-v2" />
                <QuickActionCard title="Post News" icon={Bell} link="/dashboard/announcements" />
                <QuickActionCard title="Finance" icon={Banknote} link="/dashboard/finance/accounting" />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Enrollment</CardTitle></CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="students" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
              <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                  {recentActivity.map((item, index) => (
                      <ActivityItem key={index} {...item} time={item.time ? formatDistanceToNow(item.time.toDate(), { addSuffix: true }) : ''} />
                  ))}
              </CardContent>
          </Card>
        </div>
      );
  }

  // --- DEFAULT RENDER (Students/Parents/etc.) ---
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
