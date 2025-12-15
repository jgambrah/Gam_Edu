
'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
    Users, GraduationCap, UserCog, Megaphone, Calendar as CalendarIcon, 
    BookOpen, CheckSquare, Activity, Wallet, ShieldAlert, UserPlus
} from 'lucide-react';
import { format, getDay } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useMemo } from 'react';

// ============================================================================
// 1. SHARED COMPONENTS
// ============================================================================

function StatCard({ title, value, icon: Icon, colorClass }: any) {
    return (
        <Card className="hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className={`p-2 rounded-full ${colorClass || 'bg-slate-100'}`}>
                    <Icon className="h-4 w-4 text-slate-700" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

function WelcomeHeader({ user, role }: any) {
    return (
        <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
                Welcome back, {user?.displayName || user?.email?.split('@')[0]}. 
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                    {role}
                </span>
            </p>
        </div>
    );
}

// ============================================================================
// 2. ROLE-SPECIFIC DASHBOARDS
// ============================================================================

// --- STUDENT VIEW ---
function StudentDashboard({ user }: any) {
    return (
        <div className="space-y-6">
            <WelcomeHeader user={user} role="Student" />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="My Subjects" value="8" icon={BookOpen} colorClass="bg-blue-100" />
                <StatCard title="Assignments Pending" value="3" icon={CheckSquare} colorClass="bg-orange-100" />
                <StatCard title="Attendance" value="95%" icon={Activity} colorClass="bg-green-100" />
                <StatCard title="Upcoming Exams" value="2" icon={CalendarIcon} colorClass="bg-purple-100" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Today's Timetable</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Placeholder Data */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded border-l-4 border-blue-500">
                                <div><p className="font-bold">Mathematics</p><p className="text-xs text-muted-foreground">09:00 AM - 10:00 AM</p></div>
                                <span className="bg-white px-2 py-1 rounded text-xs border">Room 101</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded border-l-4 border-green-500">
                                <div><p className="font-bold">Science</p><p className="text-xs text-muted-foreground">10:15 AM - 11:15 AM</p></div>
                                <span className="bg-white px-2 py-1 rounded text-xs border">Lab 2</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>My Tasks</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-red-500"/>
                                <p className="text-sm">Complete Math Homework (Due Tomorrow)</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-yellow-500"/>
                                <p className="text-sm">Read Chapter 4 for English</p>
                            </div>
                        </div>
                        <Button className="w-full mt-6" variant="outline" asChild>
                            <Link href="/dashboard/assignments">View All Assignments</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- TEACHER VIEW ---
function TeacherDashboard({ user }: any) {
    return (
        <div className="space-y-6">
            <WelcomeHeader user={user} role="Teacher" />

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard title="My Classes" value="4" icon={Users} colorClass="bg-indigo-100" />
                <StatCard title="Pending Grading" value="12" icon={CheckSquare} colorClass="bg-yellow-100" />
                <StatCard title="Next Class" value="10:00 AM" icon={ClockIcon} colorClass="bg-blue-100" />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Quick Actions */}
                <Card className="col-span-1">
                    <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        <Button asChild className="w-full justify-start" variant="outline">
                            <Link href="/dashboard/attendance"><Users className="mr-2 h-4 w-4"/> Take Attendance</Link>
                        </Button>
                        <Button asChild className="w-full justify-start" variant="outline">
                            <Link href="/dashboard/academics/gradebook"><BookOpen className="mr-2 h-4 w-4"/> Gradebook</Link>
                        </Button>
                        <Button asChild className="w-full justify-start" variant="outline">
                            <Link href="/dashboard/assignments"><CheckSquare className="mr-2 h-4 w-4"/> Create Assignment</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Schedule */}
                <Card className="col-span-2">
                    <CardHeader><CardTitle>Today's Schedule</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {['Grade 5 - Math', 'Grade 6 - Science', 'JHS 1 - Physics'].map((cls, i) => (
                                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                                    <span className="font-medium">{cls}</span>
                                    <Button size="sm" variant="ghost">Start Class</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- PARENT VIEW ---
function ParentDashboard({ user }: any) {
    return (
        <div className="space-y-6">
            <WelcomeHeader user={user} role="Parent" />

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-indigo-50 border-indigo-100">
                    <CardHeader><CardTitle className="text-indigo-900">Fees & Payments</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-indigo-700">Outstanding Balance</span>
                            <span className="text-2xl font-bold text-indigo-900">$0.00</span>
                        </div>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Make Payment</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Announcements</CardTitle></CardHeader>
                    <CardContent>
                        <p className="text-sm text-slate-500 italic">No new announcements from the school.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- ADMIN DASHBOARD (The Full Version) ---
function AdminDashboard({ user, firestore }: any) {
    // Queries only run if Admin
    const { data: students, isLoading: loadingStudents } = useCollection(
        useMemoFirebase(() => firestore ? query(collection(firestore, 'students')) : null, [firestore])
    );
    const { data: staff, isLoading: loadingStaff } = useCollection(
        useMemoFirebase(() => firestore ? query(collection(firestore, 'staff')) : null, [firestore])
    );
    const { data: classes, isLoading: loadingClasses } = useCollection(
        useMemoFirebase(() => firestore ? query(collection(firestore, 'classes')) : null, [firestore])
    );
    const { data: announcements, isLoading: loadingAnnouncements } = useCollection(
        useMemoFirebase(() => firestore ? query(collection(firestore, 'announcements_v2'), orderBy('publishedAt', 'desc'), limit(4)) : null, [firestore])
    );

    // Timetable
    const today = getDay(new Date()); 
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[today];
    const { data: todayTimetable, isLoading: loadingTimetable } = useCollection(
        useMemoFirebase(
            () => firestore ? query(collection(firestore, 'timetables'), where('day', '==', todayName), orderBy('timeSlotId')) : null, 
            [firestore, todayName]
        )
    );
    const { data: subjects } = useCollection(
        useMemoFirebase(() => firestore ? query(collection(firestore, 'subjects')) : null, [firestore])
    );


    // Enrollment Chart Data
    const enrollmentData = useMemo(() => {
        if (!students || !classes) return [];
        return classes.map((c: any) => ({
            name: c.name.replace('Grade ', 'G'),
            count: students.filter((s: any) => s.classId === c.id).length
        })).filter((c: any) => c.count > 0);
    }, [students, classes]);

    return (
        <div className="space-y-6">
            <WelcomeHeader user={user} role="Administrator" />

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Students" value={students?.length || 0} icon={GraduationCap} isLoading={loadingStudents} />
                <StatCard title="Total Staff" value={staff?.length || 0} icon={UserCog} isLoading={loadingStaff} />
                <StatCard title="Active Classes" value={classes?.length || 0} icon={Users} isLoading={loadingClasses} />
                <StatCard title="News" value={announcements?.length || 0} icon={Megaphone} isLoading={loadingAnnouncements} />
            </div>

            <div className="grid gap-6 lg:grid-cols-7">
                {/* Left Column */}
                <div className="lg:col-span-4 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Enrollment by Class</CardTitle></CardHeader>
                        <CardContent>
                            {loadingStudents ? <Skeleton className="h-[250px] w-full" /> : (
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }}/>
                                            <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-3 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <Button asChild variant="outline" className="h-20 flex flex-col gap-2 hover:bg-indigo-50"><Link href="/dashboard/students-v3"><UserPlus className="h-5 w-5"/><span className="text-xs">Add Student</span></Link></Button>
                            <Button asChild variant="outline" className="h-20 flex flex-col gap-2 hover:bg-pink-50"><Link href="/dashboard/staff-management-v2"><UserCog className="h-5 w-5"/><span className="text-xs">Add Staff</span></Link></Button>
                            <Button asChild variant="outline" className="h-20 flex flex-col gap-2 hover:bg-orange-50"><Link href="/dashboard/announcements"><Megaphone className="h-5 w-5"/><span className="text-xs">Post News</span></Link></Button>
                            <Button asChild variant="outline" className="h-20 flex flex-col gap-2 hover:bg-green-50"><Link href="/dashboard/finance"><Wallet className="h-5 w-5"/><span className="text-xs">Finance</span></Link></Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Today's Schedule ({todayName})</CardTitle></CardHeader>
                        <CardContent>
                            {loadingTimetable ? <Skeleton className="h-20 w-full" /> : todayTimetable && todayTimetable.length > 0 ? (
                                <div className="space-y-2">
                                    {todayTimetable.map((t: any) => (
                                        <div key={t.id} className="p-3 border rounded bg-slate-50 flex justify-between">
                                            <span className="font-bold text-indigo-700 text-xs">{t.startTime}</span>
                                            <span className="text-sm">{t.subject}</span>
                                            <span className="text-xs text-gray-500">{classes?.find((c: any) => c.id === t.classId)?.name}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-center text-gray-500 py-4 text-sm">No classes scheduled.</p>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// 3. MAIN CONTROLLER
// ============================================================================

// Icon helper for Teacher Dashboard
function ClockIcon(props: any) { return <Clock {...props} /> } // Just alias Clock from lucide import if needed
import { Clock } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { role, loading } = useRole();

    if (loading) {
        return <div className="flex h-96 items-center justify-center"><Skeleton className="h-12 w-12 rounded-full" /></div>;
    }

    if (!user) {
        return <div className="p-8 text-center">Please log in.</div>;
    }

    // --- SMART SWITCH ---
    switch (role) {
        case 'Student':
            return <StudentDashboard user={user} />;
        
        case 'Parent':
            return <ParentDashboard user={user} />;
        
        case 'Teacher':
            return <TeacherDashboard user={user} />;
        
        case 'Admin':
        case 'Administrator':
        case 'Director':
            return <AdminDashboard user={user} firestore={firestore} />;
            
        case 'Accountant':
            return (
                <div className="space-y-6">
                    <WelcomeHeader user={user} role="Accountant" />
                    <Card><CardContent className="p-8 text-center text-gray-500">Go to the Finance Module from the sidebar.</CardContent></Card>
                </div>
            );

        default:
            // Fallback for users with no role (or 'Staff' generic)
            return (
                <div className="p-6 flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                    <div className="bg-yellow-100 p-4 rounded-full"><ShieldAlert className="h-10 w-10 text-yellow-600" /></div>
                    <h2 className="text-xl font-bold">Account Pending Setup</h2>
                    <p className="text-muted-foreground max-w-md">
                        Your account is active, but a specific role dashboard has not been configured for "<strong>{role || 'Unknown'}</strong>".
                        <br/>Please contact the administrator.
                    </p>
                </div>
            );
    }
}
