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
  BrainCircuit
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow, isThisMonth } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StudentDisplay } from '@/components/student-display';
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

// --- STUDENT DASHBOARD COMPONENT ---
function StudentDashboard({ profile, schoolId }: { profile: any, schoolId: string }) {
  const firestore = useFirestore();
  const { user } = useUser();

  // 1. Fetch Student Data
  const studentQuery = useMemoFirebase(() => (firestore && user && schoolId) ? query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, [firestore, user, schoolId]);
  const { data: studentData, isLoading: loadingStudent } = useCollection(studentQuery);
  const student = studentData?.[0];

  // 2. Fetch Recent Assessments
  const assessmentsQuery = useMemoFirebase(() => (firestore && user && schoolId) ? query(collection(firestore, 'assessments'), where('studentId', '==', user.uid), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'), limit(5)) : null, [firestore, user, schoolId]);
  const { data: assessments, isLoading: loadingAssessments } = useCollection<any>(assessmentsQuery);

  // 3. Fetch Class Info
  const isLoading = loadingStudent || loadingAssessments;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800">Hello, {profile?.firstName || 'Learner'}! 👋</h1>
        <p className="text-muted-foreground">Ready for a great day of learning?</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="My Class" value={student?.classId || 'Not Assigned'} icon={School} link="/dashboard/timetable" colorClass="text-blue-600" />
        <StatCard title="Recent Grade" value={assessments?.[0] ? `${assessments[0].score}/${assessments[0].maxScore}` : 'N/A'} icon={TrendingUp} link="/dashboard/my-grades" colorClass="text-emerald-600" />
        <StatCard title="Assignments" value="View Tasks" icon={ClipboardCheck} link="/dashboard/assignments" colorClass="text-orange-600" />
        <StatCard title="Materials" value="Browse" icon={FolderKanban} link="/dashboard/academics/learning-materials" colorClass="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="text-yellow-500 h-5 w-5"/> Recent Performance</CardTitle>
            <CardDescription>Your most recent scores and teacher remarks.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAssessments ? <Loader2 className="animate-spin mx-auto h-8 w-8"/> : assessments && assessments.length > 0 ? (
              <div className="space-y-4">
                {assessments.map((a: any) => (
                  <div key={a.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800">{a.subjectName}</p>
                      <p className="text-xs text-muted-foreground">{a.assessmentType}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-indigo-600">{a.score}/{a.maxScore}</p>
                      <p className="text-[10px] text-slate-400">{a.createdAt ? formatDistanceToNow(a.createdAt.toDate(), { addSuffix: true }) : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground italic">No grades recorded yet this term.</div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Quick Links</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <QuickActionCard title="My Timetable" icon={Calendar} link="/dashboard/timetable" />
            <QuickActionCard title="Study Club" icon={BrainCircuit} link="/dashboard/study-club" />
            <QuickActionCard title="Report Cards" icon={FileText} link="/dashboard/my-reports" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- PARENT DASHBOARD COMPONENT ---
function ParentDashboard({ profile, schoolId }: { profile: any, schoolId: string }) {
  const firestore = useFirestore();
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800">Welcome, {profile?.firstName || 'Parent'}! 🏡</h1>
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
            <QuickActionCard title="Pay School Fees" icon={CreditCard} link="/dashboard/my-bills" />
            <QuickActionCard title="View Report Cards" icon={FileText} link="/dashboard/my-reports" />
            <QuickActionCard title="Attendance Logs" icon={CalendarCheck} link="/dashboard/my-children" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- TEACHER DASHBOARD COMPONENT ---
function TeacherDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();

  const teacherClassesQuery = useMemoFirebase(() => (firestore && user && schoolId) ? query(collection(firestore, 'classes'), where('teacherId', '==', user.uid), where('schoolId', '==', schoolId)) : null, [firestore, user, schoolId]);
  const { data: teacherClasses, isLoading: loadingClasses } = useCollection(teacherClassesQuery);

  const teacherClassIds = useMemo(() => teacherClasses?.map((c: any) => c.id) || [], [teacherClasses]);
  const studentsQuery = useMemoFirebase(() => (firestore && schoolId && teacherClassIds.length > 0) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('classId', 'in', teacherClassIds)) : null, [firestore, teacherClassIds.join(','), schoolId]);
  const { data: students, isLoading: loadingStudents } = useCollection(studentsQuery);

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

  const isAdminOrDirector = role === 'Administrator' || role === 'Director';
  const isTeacher = role === 'Teacher';
  const isStudent = role === 'Student';
  const isParent = role === 'Parent';
  const isFinance = role === 'Accountant';
  const isLibrarian = role === 'Librarian';
  const isStaffUser = isAdminOrDirector || isTeacher || isFinance || isLibrarian;

  const studentsQuery = useMemoFirebase(() => (firestore && schoolId && isStaffUser) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isStaffUser]);
  const { data: students, isLoading: studentsLoading } = useCollection(studentsQuery);

  const staffQuery = useMemoFirebase(() => (firestore && schoolId && isAdminOrDirector) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId), where('role', 'in', STAFF_ROLES)) : null, [firestore, schoolId, isAdminOrDirector]);
  const { data: staff, isLoading: staffLoading } = useCollection(staffQuery);

  const classesQuery = useMemoFirebase(() => (firestore && schoolId && isStaffUser) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isStaffUser]);
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

  if (isTeacher) return <TeacherDashboard />;
  if (isStudent) return <StudentDashboard profile={profile} schoolId={schoolId!} />;
  if (isParent) return <ParentDashboard profile={profile} schoolId={schoolId!} />;

  if (isAdminOrDirector) {
      return (
        <div className="space-y-6">
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
                            <p className="text-xs text-muted-foreground line-clamp-2">{a.content}</p>
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
