
'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
    Users, GraduationCap, UserCog, Megaphone, PlusCircle, ArrowRight, UserPlus, Clock, BookOpen, Calendar as CalendarIcon
} from 'lucide-react';
import { format, getDay } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Student, Staff, Class, Announcement, TimetableEntry, Subject } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

// --- STATS CARD COMPONENT ---
function StatCard({ title, value, icon: Icon, link, isLoading }: { title: string; value: number | string; icon: React.ElementType; link?: string; isLoading: boolean }) {
    const cardContent = (
        <Card className="hover:border-primary transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-8 w-20" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    );

    return link ? <Link href={link}>{cardContent}</Link> : cardContent;
}


// --- MAIN DASHBOARD PAGE ---
export default function DashboardPage() {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();

    const { data: students, isLoading: loadingStudents } = useCollection<Student>(
        useMemoFirebase(() => query(collection(firestore, 'students')), [firestore])
    );
    const { data: staff, isLoading: loadingStaff } = useCollection<Staff>(
        useMemoFirebase(() => query(collection(firestore, 'staff')), [firestore])
    );
    const { data: classes, isLoading: loadingClasses } = useCollection<Class>(
        useMemoFirebase(() => query(collection(firestore, 'classes')), [firestore])
    );
    const { data: announcements, isLoading: loadingAnnouncements } = useCollection<Announcement>(
        useMemoFirebase(() => query(collection(firestore, 'announcements_v2'), orderBy('publishedAt', 'desc'), limit(4)), [firestore])
    );

    const today = getDay(new Date()); // Sunday = 0, Monday = 1...
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[today];

    const { data: todayTimetable, isLoading: loadingTimetable } = useCollection<TimetableEntry>(
        useMemoFirebase(() => query(collection(firestore, 'timetables'), where('day', '==', todayName), orderBy('timeSlotId')), [firestore, todayName])
    );

    const { data: subjects, isLoading: loadingSubjects } = useCollection<Subject>(
        useMemoFirebase(() => query(collection(firestore, 'subjects')), [firestore])
    );


    const isLoading = loadingStudents || loadingStaff || loadingClasses || loadingAnnouncements || loadingTimetable || loadingSubjects;

    // --- Data Processing for Charts ---
    const enrollmentData = useMemo(() => {
        if (!students || !classes) return [];
        return classes.map(c => ({
            name: c.name.replace('Grade ', 'G'),
            count: students.filter(s => s.classId === c.id).length
        })).filter(c => c.count > 0);
    }, [students, classes]);

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold">Welcome back, {user?.displayName || 'Admin'}!</h1>
                <p className="text-muted-foreground">Here's a snapshot of your school today, {format(new Date(), 'eeee, MMMM d')}.</p>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Students" value={students?.length || 0} icon={GraduationCap} isLoading={isLoading} link="/dashboard/students-v3"/>
                <StatCard title="Total Staff" value={staff?.length || 0} icon={UserCog} isLoading={isLoading} link="/dashboard/staff-management-v2"/>
                <StatCard title="Active Classes" value={classes?.length || 0} icon={Users} isLoading={isLoading} link="/dashboard/academics"/>
                <StatCard title="Announcements" value={announcements?.length || 0} icon={Megaphone} isLoading={isLoading} link="/dashboard/announcements"/>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-5">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Enrollment Analytics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Enrollment by Class</CardTitle>
                            <CardDescription>A quick look at student distribution across classes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Skeleton className="h-48 w-full" /> : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={enrollmentData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                                        <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Students"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* RECENT ANNOUNCEMENTS */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Announcements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Skeleton className="h-40 w-full" /> : announcements && announcements.length > 0 ? (
                                <div className="space-y-4">
                                    {announcements.map(post => (
                                        <div key={post.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md border">
                                            <div>
                                                <p className="font-semibold text-sm">{post.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    By {post.authorName} on {post.createdAt ? format(post.createdAt.toDate(), 'PPP') : '...'}
                                                </p>
                                            </div>
                                            <Button asChild variant="ghost" size="sm">
                                                <Link href="/dashboard/announcements">View <ArrowRight className="ml-2 h-4 w-4"/></Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-center text-muted-foreground py-8">No announcements found.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-2 space-y-6">
                    {/* QUICK ACTIONS */}
                    <Card>
                        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-2">
                            <Button asChild variant="outline"><Link href="/dashboard/students-v3"><UserPlus className="mr-2 h-4 w-4"/>Add Student</Link></Button>
                            <Button asChild variant="outline"><Link href="/dashboard/staff-management-v2"><UserCog className="mr-2 h-4 w-4"/>Add Staff</Link></Button>
                            <Button asChild variant="outline"><Link href="/dashboard/announcements"><Megaphone className="mr-2 h-4 w-4"/>Post News</Link></Button>
                            <Button asChild variant="outline"><Link href="/dashboard/academics/gradebook"><PlusCircle className="mr-2 h-4 w-4"/>Enter Grades</Link></Button>
                        </CardContent>
                    </Card>

                    {/* TODAY'S SCHEDULE */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Today's Schedule</CardTitle>
                            <CardDescription>{format(new Date(), 'eeee, MMMM d')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Skeleton className="h-32 w-full"/> : todayTimetable && todayTimetable.length > 0 ? (
                                <div className="space-y-3">
                                    {todayTimetable.slice(0, 5).map(entry => (
                                        <div key={entry.id} className="flex items-center gap-4 text-sm p-2 rounded-md bg-slate-50 border">
                                            <div className="text-center w-16 px-2 py-1 bg-primary text-primary-foreground rounded">
                                                <p className="font-bold text-xs">9:00</p>
                                                <p className="text-[10px]">AM</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">{subjects?.find(s => s.id === entry.subjectId)?.name || '...'}</p>
                                                <p className="text-xs text-muted-foreground">{classes?.find(c => c.id === entry.classId)?.name || '...'}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {todayTimetable.length > 5 && <p className="text-xs text-center text-muted-foreground mt-2">+ {todayTimetable.length - 5} more</p>}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">No classes scheduled for today.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
