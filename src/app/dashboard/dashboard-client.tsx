
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { 
  GraduationCap, Users, School, Banknote, Loader2, 
  PlusCircle, PenSquare, FileText, BookOpen, Calendar,
  ClipboardCheck, TrendingUp, Bell, Bus,
  CreditCard, DollarSign, Receipt, Package, Award,
  MessageSquare, Clock, AlertCircle, CheckCircle2,
  UserCheck, BookMarked, Briefcase, BarChart3, Activity, Landmark, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow, isThisMonth, startOfMonth, subMonths } from 'date-fns';
import { FinancialRecord, AccountsPayableRecord } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { StudentDisplay } from '@/components/student-display';
import { useCurrentSchool } from '@/hooks/use-current-school';


// Simple Stat Card Component
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  link, 
  isLoading,
  badge,
  trend 
}: { 
  title: string; 
  value: number | string; 
  icon: React.ElementType; 
  link: string;
  isLoading: boolean;
  badge?: string;
  trend?: { value: number; isPositive: boolean };
}) {
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
                  {trend.value !== 0 ? (
                    <>
                      {trend.isPositive ? '↑' : '↓'} {trend.value}% from last month
                    </>
                  ) : (
                    'No change'
                  )}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

// Quick Action Button
function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  link, 
  variant = "outline" 
}: { 
  title: string; 
  description?: string; 
  icon: React.ElementType; 
  link: string;
  variant?: "outline" | "default" | "secondary";
}) {
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
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// Recent Activity Item
function ActivityItem({ 
  title, 
  description, 
  time, 
  icon: Icon,
  iconColor = "text-blue-600"
}: { 
  title: string; 
  description: string; 
  time: string;
  icon: React.ElementType;
  iconColor?: string;
}) {
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

// The Enhanced Dashboard
export default function DashboardClient() {
  const { user, isUserLoading } = useUser();
  const { role, profile, loading: isRoleLoading } = useRole();
  const firestore = useFirestore();
  const { schoolId, loading: isSchoolLoading } = useCurrentSchool();

  // --- 1. GLOBAL LOADING GATE ---
  // Do not run ANY queries until we know who the user is and what school they belong to.
  if (isUserLoading || isRoleLoading || isSchoolLoading) {
      return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <span className="ml-3 text-muted-foreground">Loading your workspace...</span>
        </div>
      );
  }

  // --- 2. MISSING DATA GATE ---
  if (!schoolId) {
      return (
        <div className="p-8 text-center border-2 border-dashed border-red-200 bg-red-50 rounded-lg">
            <h2 className="text-xl font-bold text-red-700">Account Setup Incomplete</h2>
            <p className="text-red-600 mt-2">
                We could not link your account to a school. Please contact support or your administrator.
            </p>
            <p className="text-xs text-muted-foreground mt-4">Debug: UID: {user?.uid}</p>
        </div>
      );
  }

  // --- 3. SAFE QUERIES (Only run now that schoolId is guaranteed) ---
  const isAdminOrDirector = role === 'Administrator' || role === 'Director';
  const isTeacher = role === 'Teacher';
  const isStudent = role === 'Student';
  const isParent = role === 'Parent';
  const isFinance = role === 'Accountant';
  const isLibrarian = role === 'Librarian';
  const isStaffUser = isAdminOrDirector || isTeacher || isFinance || isLibrarian || ['Cook', 'Transport Staff'].includes(role || '');
  const isSuperAdmin = user?.uid === 'gZxe3nMbGcQhNgEzkwEZwDBnkFR2';
  
  // --- SAFE DATA FETCHING ---
  const studentsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    return query(collection(firestore, 'students'), where('schoolId', '==', schoolId));
  }, [firestore, schoolId]);
  const { data: students, isLoading: studentsLoading } = useCollection(studentsQuery);

  const staffQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    return query(collection(firestore, 'staff'), where('schoolId', '==', schoolId));
  }, [firestore, schoolId]);
  const { data: staff, isLoading: staffLoading } = useCollection(staffQuery);

  const classesQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    return query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
  }, [firestore, schoolId]);
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
  
  const leaveRequestsQuery = useMemoFirebase(() => {
    if (!firestore || !isStaffUser || !schoolId) return null;
    return query(collection(firestore, 'leaveRequests'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'), limit(5));
  }, [firestore, isStaffUser, schoolId]);
  const { data: leaveRequests, isLoading: leaveLoading } = useCollection(leaveRequestsQuery);
  
  const libraryItemsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    return query(collection(firestore, 'library'), where('schoolId', '==', schoolId));
  }, [firestore, schoolId]);
  const { data: libraryItems, isLoading: libraryLoading } = useCollection(libraryItemsQuery);

  // SAFE FINANCE QUERIES
  const financialRecordsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId || !(isFinance || isAdminOrDirector)) return null;
    return query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'));
  }, [firestore, isFinance, isAdminOrDirector, schoolId]);
  const { data: financialRecords, isLoading: paymentsLoading } = useCollection<FinancialRecord>(financialRecordsQuery);
  
  const accountsPayableQuery = useMemoFirebase(() => {
    if (!firestore || !(isFinance || isAdminOrDirector)) return null;

    if (isSuperAdmin) {
      return query(collection(firestore, 'accountsPayable'), orderBy('createdAt', 'desc'));
    }

    if (schoolId) {
      return query(collection(firestore, 'accountsPayable'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'));
    }

    return null;
  }, [firestore, isFinance, isAdminOrDirector, schoolId, isSuperAdmin]);
  const { data: accountsPayable, isLoading: payablesLoading } = useCollection<AccountsPayableRecord>(accountsPayableQuery);


  // FIXED LOADING LOGIC
  let isLoading = isUserLoading || isRoleLoading || isSchoolLoading;

  if (!isLoading && schoolId) {
    if (isAdminOrDirector) {
      isLoading = studentsLoading || staffLoading || classesLoading || paymentsLoading;
    } else if (isTeacher) {
      isLoading = classesLoading || assignmentsLoading;
    } else if (isStudent) {
      isLoading = classesLoading || assignmentsLoading || announcementsLoading;
    } else if (isFinance) {
      isLoading = paymentsLoading || payablesLoading;
    } else if (isLibrarian) {
      isLoading = libraryLoading;
    }
  }


  // --- STATS CALCULATIONS ---
  const stats = useMemo(() => {
    const pendingLeave = leaveRequests?.filter(l => l.status === 'Pending').length || 0;
    const todayAssignments = assignments?.filter(a => {
      const dueDate = a.dueDate?.toDate?.();
      const today = new Date();
      return dueDate && dueDate.toDateString() === today.toDateString();
    }).length || 0;
    const totalBooks = libraryItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
    const availableBooks = libraryItems?.reduce((sum, item) => item.status === 'Available' ? sum + (item.quantity || 0) : sum, 0) || 0;
    const overdueBooks = libraryItems?.filter(l => l.status === 'Borrowed' && l.dueDate?.toDate?.() < new Date()).length || 0;
    
    // Student Growth Calculation
    const newStudentsThisMonth = students?.filter(s => {
        // @ts-ignore
        const createdAt = s.createdAt?.toDate();
        return createdAt && isThisMonth(createdAt);
    }).length || 0;

    const previousTotal = students?.filter(s => {
        // @ts-ignore
        const createdAt = s.createdAt?.toDate();
        return createdAt && createdAt < startOfMonth(new Date());
    }).length || 0;

    let studentTrend = 0;
    if (previousTotal > 0) {
        studentTrend = parseFloat(((newStudentsThisMonth / previousTotal) * 100).toFixed(1));
    } else if (newStudentsThisMonth > 0) {
        studentTrend = 100; // If started from 0, it's 100% growth
    }

    return {
      pendingLeave,
      todayAssignments,
      totalBooks,
      availableBooks,
      overdueBooks,
      studentTrend
    };
  }, [leaveRequests, assignments, libraryItems, students]);

  // --- LIVE ACTIVITY FEED ---
  const recentActivity = useMemo(() => {
    const activities = [];
    if (students) {
        // @ts-ignore
        activities.push(...students.map(s => ({
            type: 'New Student',
            title: 'New Student Enrolled',
            description: `${s.firstName} ${s.lastName}`,
            time: s.createdAt,
            icon: UserCheck,
            iconColor: 'text-green-600'
        })));
    }
    if (leaveRequests) {
        activities.push(...leaveRequests.map(r => ({
            type: 'Leave Request',
            title: `Leave Request from ${r.staffName}`,
            description: `${r.leaveType} for reason: ${r.reason.substring(0,30)}...`,
            time: r.createdAt,
            icon: Calendar,
            iconColor: 'text-blue-600'
        })));
    }
    if (announcements) {
        activities.push(...announcements.map(a => ({
            type: 'Announcement',
            title: 'New Announcement Posted',
            description: a.title,
            time: a.publishedAt,
            icon: Bell,
            iconColor: 'text-purple-600'
        })));
    }
    if (financialRecords) {
        activities.push(...financialRecords.map(p => ({
            type: 'Payment',
            title: 'Payment Received',
            description: `GH₵${(p.amountPaid || 0).toFixed(2)} from ${p.studentName} for ${p.type}`,
            time: p.createdAt, 
            icon: CheckCircle2,
            iconColor: 'text-emerald-600'
        })));
    }
    
    // @ts-ignore
    return activities.sort((a,b) => (b.time?.seconds || 0) - (a.time?.seconds || 0)).slice(0, 5);

  }, [students, leaveRequests, announcements, financialRecords]);

  const enrollmentData = useMemo(() => {
    if (!classes || !students) return [];
    return classes.map(c => ({
      name: c.name,
      // @ts-ignore
      students: students.filter(s => s.classId === c.id).length
    })).sort((a, b) => b.students - a.students);
  }, [classes, students]);

  const staffByRole = useMemo(() => {
    if (!staff) return [];
    const roles = staff.reduce((acc, s) => {
      // @ts-ignore
      acc[s.role] = (acc[s.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(roles).map(([name, value]) => ({ name, value }));
  }, [staff]);
  
  // --- NEW: FINANCIAL STATS ---
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

    // Combine data for chart
    const allDays = new Set([...Object.keys(revenueByDay), ...Object.keys(expensesByDay)]);
    const chartData = Array.from(allDays).sort().map(day => ({
        month: day,
        revenue: revenueByDay[day] || 0,
        expenses: expensesByDay[day] || 0,
    }));

    return { monthlyRevenue, pendingPayments, monthlyExpenses, outstandingInvoices, chartData };
  }, [financialRecords, accountsPayable]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Role-based dashboard content
  const renderDashboardByRole = () => {
    // ADMIN/DIRECTOR DASHBOARD
    if (isAdminOrDirector) {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Students" 
              value={students?.length || 0} 
              icon={GraduationCap} 
              link="/dashboard/students-v3"
              isLoading={isLoading}
              trend={{ value: stats.studentTrend, isPositive: stats.studentTrend >= 0 }}
            />
            <StatCard 
              title="Total Staff" 
              value={staff?.length || 0} 
              icon={Users}
              link="/dashboard/staff-management-v2"
              isLoading={isLoading}
            />
            <StatCard 
              title="Active Classes" 
              value={classes?.length || 0} 
              icon={School}
              link="/dashboard/academics"
              isLoading={isLoading}
            />
            <StatCard 
              title="Pending Leave" 
              value={stats.pendingLeave} 
              icon={ClipboardCheck}
              link="/dashboard/hr/leave-management"
              isLoading={isLoading}
              badge={stats.pendingLeave > 0 ? "Action Required" : undefined}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Perform common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <QuickActionCard 
                  title="Add Student" 
                  description="Enroll a new student"
                  icon={GraduationCap} 
                  link="/dashboard/students-v3"
                />
                <QuickActionCard 
                  title="Add Staff Member" 
                  description="Hire new staff"
                  icon={Users} 
                  link="/dashboard/staff-management-v2"
                />
                <QuickActionCard 
                  title="Post Announcement" 
                  description="Share news with community"
                  icon={Bell} 
                  link="/dashboard/announcements"
                />
                <QuickActionCard 
                  title="Manage Finances" 
                  description="View financial reports"
                  icon={Banknote} 
                  link="/dashboard/finance/accounting"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Enrollment Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="animate-spin"/>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={enrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                        {enrollmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="animate-spin"/>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={staffByRole}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {staffByRole.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates across the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  {recentActivity.length === 0 && <p className="text-sm text-muted-foreground">No recent activities.</p>}
                  {recentActivity.map((item, index) => (
                      <ActivityItem 
                        key={index}
                        title={item.title}
                        description={item.description}
                        // @ts-ignore
                        time={item.time ? formatDistanceToNow(item.time.toDate(), { addSuffix: true }) : 'Just now'}
                        icon={item.icon}
                        iconColor={item.iconColor}
                      />
                  ))}
              </CardContent>
            </Card>
          </div>
        </>
      );
    }

    // TEACHER DASHBOARD
    if (isTeacher) {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="My Classes" 
              // @ts-ignore
              value={classes?.filter(c => c.teacherId === user?.uid).length || 0} 
              icon={School} 
              link="/dashboard/academics"
              isLoading={isLoading}
            />
            <StatCard 
              title="My Students" 
              // @ts-ignore
              value={students?.filter(s => classes?.find(c => c.id === s.classId && c.teacherId === user?.uid)).length || 0} 
              icon={GraduationCap}
              link="/dashboard/students-v3"
              isLoading={isLoading}
            />
            <StatCard 
              title="Active Assignments" 
              // @ts-ignore
              value={assignments?.filter(a => a.teacherId === user?.uid).length || 0} 
              icon={FileText}
              link="/dashboard/assignments"
              isLoading={isLoading}
            />
            <StatCard 
              title="Due Today" 
              value={stats.todayAssignments} 
              icon={Clock}
              link="/dashboard/assignments"
              isLoading={isLoading}
              badge={stats.todayAssignments > 0 ? "Urgent" : undefined}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your teaching activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <QuickActionCard 
                  title="Create Assignment" 
                  description="Add new homework or task"
                  icon={FilePen} 
                  link="/dashboard/assignments"
                />
                <QuickActionCard 
                  title="Mark Attendance" 
                  description="Record student attendance"
                  icon={ClipboardCheck} 
                  link="/dashboard/attendance"
                />
                <QuickActionCard 
                  title="Grade Submissions" 
                  description="Review student work"
                  icon={Award} 
                  link="/dashboard/assignments"
                />
                 <QuickActionCard 
                  title="Lesson Planning" 
                  description="Create and view lesson plans"
                  icon={BookOpen} 
                  link="/dashboard/lesson-planning"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>My Classes Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="animate-spin"/>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    {/* @ts-ignore */}
                    <BarChart data={enrollmentData.filter(e => classes?.find(c => c.name === e.name && c.teacherId === user?.uid))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      {/* @ts-ignore */}
                      <Bar dataKey="students" radius={[4, 4, 0, 0]}>
                        {enrollmentData.filter(e => classes?.find(c => c.name === e.name && c.teacherId === user?.uid)).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      );
    }

    // STUDENT DASHBOARD
    if (isStudent) {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="My Assignments" 
              // @ts-ignore
              value={assignments?.filter(a => a.classId === profile?.classId).length || 0} 
              icon={FileText} 
              link="/dashboard/assignments"
              isLoading={isLoading}
            />
            <StatCard 
              title="Due This Week" 
              // @ts-ignore
              value={assignments?.filter(a => {
                const dueDate = a.dueDate?.toDate?.();
                const weekFromNow = new Date();
                weekFromNow.setDate(weekFromNow.getDate() + 7);
                return dueDate && dueDate <= weekFromNow;
              }).length || 0} 
              icon={Clock}
              link="/dashboard/assignments"
              isLoading={isLoading}
              badge="Upcoming"
            />
            <StatCard 
              title="My Class" 
              // @ts-ignore
              value={classes?.find(c => c.id === profile?.classId)?.name || "N/A"} 
              icon={School}
              link="/dashboard/academics"
              isLoading={isLoading}
            />
            <StatCard 
              title="Report Card" 
              value={"View"} 
              icon={TrendingUp}
              link="/dashboard/report-cards"
              isLoading={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Hub</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <QuickActionCard 
                  title="My Assignments" 
                  description="View and submit work"
                  icon={FileText} 
                  link="/dashboard/assignments"
                />
                <QuickActionCard 
                  title="Learning Materials" 
                  description="Access course content"
                  icon={BookOpen} 
                  link="/dashboard/academics/learning-materials"
                />
                <QuickActionCard 
                  title="My Grades" 
                  description="Check your report card"
                  icon={Award} 
                  link="/dashboard/report-cards"
                />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                {announcementsLoading ? <Loader2 className="animate-spin"/> : (
                  (announcements || []).slice(0, 3).map(a => (
                    <ActivityItem 
                      key={a.id}
                      title={a.title}
                      description={a.content.substring(0, 100) + '...'}
                      // @ts-ignore
                      time={a.publishedAt?.toDate().toLocaleDateString()}
                      icon={Bell}
                      iconColor='text-purple-600'
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      );
    }
    
    // PARENT DASHBOARD
    if (isParent) {
      // @ts-ignore
      const myStudents = students?.filter(s => profile?.studentIds?.includes(s.uid)) || [];
      
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>My Children</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myStudents.map(student => (
                    <Link href="/dashboard/my-children" key={student.uid}>
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                        <StudentDisplay student={student} variant="list" showAvatar />
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                  {myStudents.length === 0 && <p className="text-muted-foreground">No children linked to this account.</p>}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader><CardTitle>Recent Announcements</CardTitle></CardHeader>
                <CardContent>
                  {announcements?.slice(0, 3).map(a => (
                     <ActivityItem 
                      key={a.id}
                      title={a.title}
                      description={a.content.substring(0, 100) + '...'}
                      // @ts-ignore
                      time={a.publishedAt?.toDate().toLocaleDateString()}
                      icon={Bell}
                      iconColor='text-purple-600'
                    />
                  ))}
                </CardContent>
            </Card>
          </div>
           <div className="space-y-6">
              <Card>
                  <CardHeader>
                      <CardTitle>Student Bills</CardTitle>
                      <CardDescription>View financial records for your children.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                      {myStudents.map(student => (
                          <Link href="/dashboard/my-bills" key={student.uid}>
                              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                                  <span className="font-medium text-sm">{student.firstName} {student.lastName}'s Bills</span>
                                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              </div>
                          </Link>
                      ))}
                      {myStudents.length === 0 && <p className="text-muted-foreground text-sm">No children linked.</p>}
                  </CardContent>
              </Card>
           </div>
        </div>
      )
    }

    // FINANCE STAFF DASHBOARD
    if (isFinance) {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Monthly Revenue" 
              value={`GH₵ ${financeStats.monthlyRevenue.toFixed(2)}`}
              icon={DollarSign} 
              link="/dashboard/finance/accounting"
              isLoading={isLoading}
              trend={{ value: 12.3, isPositive: true }}
            />
            <StatCard 
              title="Pending Student Payments" 
              value={financeStats.pendingPayments} 
              icon={CreditCard}
              link="/dashboard/accounts"
              isLoading={isLoading}
              badge={financeStats.pendingPayments > 0 ? "Action Required" : undefined}
            />
            <StatCard 
              title="Expenses This Month" 
              value={`GH₵ ${financeStats.monthlyExpenses.toFixed(2)}`} 
              icon={Receipt}
              link="/dashboard/finance/accounting"
              isLoading={isLoading}
            />
            <StatCard 
              title="Outstanding Vendor Bills" 
              value={financeStats.outstandingInvoices}
              icon={FileText}
              link="/dashboard/finance/procurement"
              isLoading={isLoading}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Financial management tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <QuickActionCard 
                  title="Record Payment" 
                  description="Process student fee payment"
                  icon={CreditCard} 
                  link="/dashboard/accounts"
                />
                <QuickActionCard 
                  title="Pay Vendor Bill" 
                  description="Process accounts payable"
                  icon={Landmark} 
                  link="/dashboard/finance/accounting"
                />
                <QuickActionCard 
                  title="Manage Payroll" 
                  description="Process staff salaries"
                  icon={Banknote} 
                  link="/dashboard/finance/payroll"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Cash Flow This Month</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financeStats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#22c55e" name="Revenue" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.filter(a => a.type === 'Payment').slice(0,3).map((item, index) => (
                <ActivityItem 
                  key={index}
                  title={item.title}
                  description={item.description}
                   // @ts-ignore
                  time={item.time ? formatDistanceToNow(item.time.toDate(), { addSuffix: true }) : 'Just now'}
                  icon={item.icon}
                  iconColor={item.iconColor}
                />
              ))}
            </CardContent>
          </Card>
        </>
      );
    }

    // LIBRARIAN DASHBOARD
    if (isLibrarian) {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Items" 
              value={stats.totalBooks} 
              icon={BookMarked} 
              link="/dashboard/library"
              isLoading={isLoading}
            />
            <StatCard 
              title="Available" 
              value={stats.availableBooks} 
              icon={CheckCircle2}
              link="/dashboard/library"
              isLoading={isLoading}
            />
            <StatCard 
              title="Currently Borrowed" 
               // @ts-ignore
              value={libraryItems?.filter(l => l.status === 'Borrowed').reduce((acc, item) => acc + item.quantity, 0) || 0} 
              icon={BookOpen}
              link="/dashboard/library"
              isLoading={isLoading}
            />
            <StatCard 
              title="Overdue" 
              value={0} // Placeholder
              icon={AlertCircle}
              link="/dashboard/library"
              isLoading={isLoading}
              badge={stats.overdueBooks > 0 ? "Action Required" : undefined}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Library management tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <QuickActionCard 
                  title="Add Book" 
                  description="Register new book"
                  icon={PlusCircle} 
                  link="/dashboard/library"
                />
                <QuickActionCard 
                  title="Issue Book" 
                  description="Lend to student"
                  icon={BookOpen} 
                  link="/dashboard/library"
                />
                <QuickActionCard 
                  title="Receive Book" 
                  description="Check-in returned book"
                  icon={Package} 
                  link="/dashboard/library"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ActivityItem 
                    title="Book Borrowed"
                    description="'The Great Gatsby' by Student A"
                    time="1 hour ago"
                    icon={BookOpen}
                    iconColor="text-blue-600"
                />
                 <ActivityItem 
                    title="Book Returned"
                    description="'1984' by Student B"
                    time="3 hours ago"
                    icon={CheckCircle2}
                    iconColor="text-green-600"
                />
              </CardContent>
            </Card>
          </div>
        </>
      );
    }
    
    // DEFAULT/FALLBACK DASHBOARD
    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome to CampusConnect</CardTitle>
                <CardDescription>Your role-specific dashboard is loading or you have a custom role.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Use the navigation on the left to explore the app.</p>
            </CardContent>
        </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {profile?.firstName || user?.displayName || 'User'}!</h1>
        <p className="text-muted-foreground">Here's a quick overview of your school.</p>
      </div>
      {renderDashboardByRole()}
    </div>
  );
}
