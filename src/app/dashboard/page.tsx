
'use client';

import { useCollection, useFirestore, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
    Users, GraduationCap, UserCog, Megaphone, PlusCircle, ArrowRight, UserPlus, Calendar as CalendarIcon
} from 'lucide-react';
import { format, getDay } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Student, Staff, Class, Announcement, TimetableEntry, Subject } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

// --- STATS CARD COMPONENT ---
function StatCard({ title, value, icon: Icon, link, isLoading }: { title: string; value: number | string; icon: React.ElementType; link?: string; isLoading: boolean }) {
    const cardContent = (
        <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
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

    // 1. Students Query
    const studentsQuery = useMemo(() => 
        firestore ? query(collection(firestore, 'students')) : null, 
    [firestore]);
    const { data: students, isLoading: loadingStudents } = useCollection<Student>(studentsQuery);

    // 2. Staff Query
    const staffQuery = useMemo(() => 
        firestore ? query(collection(firestore, 'staff')) : null, 
    [firestore]);
    const { data: staff, isLoading: loadingStaff } = useCollection<Staff>(staffQuery);

    // 3. Classes Query
    const classesQuery = useMemo(() => 
        firestore ? query(collection(firestore, 'classes')) : null, 
    [firestore]);
    const { data: classes, isLoading: loadingClasses } = useCollection<Class>(classesQuery);

    // 4. Announcements Query
    const announcementsQuery = useMemo(() => 
        firestore ? query(collection(firestore, 'announcements_v2'), orderBy('publishedAt', 'desc'), limit(4)) : null, 
    [firestore]);
    const { data: announcements, isLoading: loadingAnnouncements } = useCollection<Announcement>(announcementsQuery);

    // 5. Timetable Query
    const today = getDay(new Date()); 
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[today];

    const timetableQuery = useMemo(() => 
        firestore ? query(collection(firestore, 'timetables'), where('day', '==', todayName), orderBy('timeSlotId')) : null, 
    [firestore, todayName]);
    const { data: todayTimetable, isLoading: loadingTimetable } = useCollection<TimetableEntry>(timetableQuery);

    // 6. Subjects Query
    const subjectsQuery = useMemo(() => 
        firestore ? query(collection(firestore, 'subjects')) : null, 
    [firestore]);
    const { data: subjects, isLoading: loadingSubjects } = useCollection<Subject>(subjectsQuery);


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
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {user?.displayName || 'Admin'}. Today is {format(new Date(), 'eeee, MMMM d')}.
                    </p>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Students" value={students?.length || 0} icon={GraduationCap} isLoading={loadingStudents} link="/dashboard/students-v3"/>
                <StatCard title="Total Staff" value={staff?.length || 0} icon={UserCog} isLoading={loadingStaff} link="/dashboard/staff-management-v2"/>
                <StatCard title="Active Classes" value={classes?.length || 0} icon={Users} isLoading={loadingClasses} link="/dashboard/academics"/>
                <StatCard title="Announcements" value={announcements?.length || 0} icon={Megaphone} isLoading={loadingAnnouncements} link="/dashboard/announcements"/>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-7">
                
                {/* LEFT COLUMN (Charts & News) */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Enrollment Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Enrollment by Class</CardTitle>
                            <CardDescription>Student distribution across grade levels.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingStudents || loadingClasses ? (
                                <Skeleton className="h-[250px] w-full" />
                            ) : (
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                                            <Tooltip 
                                                cursor={{fill: 'transparent'}}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Announcements List */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent News</CardTitle>
                            <Button variant="ghost" size="sm" asChild className="text-xs">
                                <Link href="/dashboard/announcements">View All</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {loadingAnnouncements ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            ) : announcements && announcements.length > 0 ? (
                                <div className="space-y-4">
                                    {announcements.map(post => (
                                        <div key={post.id} className="flex flex-col gap-1 border-b pb-3 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold text-sm line-clamp-1">{post.title}</h4>
                                                <span className="text-[10px] text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                    {post.createdAt ? format(post.createdAt.toDate(), 'MMM d') : '...'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">No recent announcements.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN (Actions & Schedule) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Quick Actions Grid */}
                    <Card>
                        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-3">
                            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                                <Link href="/dashboard/students-v3">
                                    <UserPlus className="h-5 w-5"/>
                                    <span className="text-xs">Add Student</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all">
                                <Link href="/dashboard/staff-management-v2">
                                    <UserCog className="h-5 w-5"/>
                                    <span className="text-xs">Add Staff</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all">
                                <Link href="/dashboard/announcements">
                                    <Megaphone className="h-5 w-5"/>
                                    <span className="text-xs">Post News</span>
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all">
                                <Link href="/dashboard/academics/gradebook">
                                    <PlusCircle className="h-5 w-5"/>
                                    <span className="text-xs">Grades</span>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Today's Schedule */}
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Today's Schedule</CardTitle>
                            <CardDescription className="text-xs uppercase font-bold text-indigo-600">{todayName}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingTimetable ? (
                                <div className="space-y-3">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            ) : todayTimetable && todayTimetable.length > 0 ? (
                                <div className="space-y-3">
                                    {todayTimetable.slice(0, 5).map((entry, i) => (
                                        <div key={entry.id || i} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 transition-colors border-l-2 border-transparent hover:border-indigo-500">
                                            <div className="flex flex-col items-center justify-center bg-indigo-100 text-indigo-700 rounded w-12 h-12 shrink-0">
                                                <span className="text-xs font-bold">09:00</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate">{subjects?.find(s => s.id === entry.subjectId)?.name || 'Unknown Subject'}</p>
                                                <p className="text-xs text-muted-foreground truncate">{classes?.find(c => c.id === entry.classId)?.name || 'Unknown Class'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                                    <div className="bg-slate-100 p-3 rounded-full mb-2">
                                        <CalendarIcon className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <p className="text-sm">No classes scheduled.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

    