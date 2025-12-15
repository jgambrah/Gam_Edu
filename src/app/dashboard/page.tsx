
'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
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
import SystemRepair from '@/components/SystemRepair'; // Ensure this exists from previous step!

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
    const firestore = useFirestore();

    // --- QUERIES ---
    // We use safe optional chaining (?) to prevent crashes if firestore is null
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

    // --- RENDER ---
    return (
        <div className="p-6 space-y-6">
            
            {/* 1. HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">School Dashboard</h1>
                    <p className="text-muted-foreground">
                        {user ? `Welcome, ${user.email}` : 'Connecting...'}
                    </p>
                </div>
                
                {/* REPAIR TOOL BUTTON (Kept here so you can access it) */}
                <div className="w-full md:w-auto">
                    <SystemRepair />
                </div>
            </div>

            {/* 2. STATS ROW */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Students" value={students?.length || 0} icon={GraduationCap} isLoading={loadingStudents} />
                <StatCard title="Staff" value={staff?.length || 0} icon={UserCog} isLoading={loadingStaff} />
                <StatCard title="Classes" value={classes?.length || 0} icon={Users} isLoading={loadingClasses} />
                <StatCard title="News" value={announcements?.length || 0} icon={Megaphone} isLoading={loadingAnnouncements} />
            </div>

            {/* 3. MAIN CONTENT GRID */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                
                {/* LEFT: SCHEDULE */}
                <div className="col-span-4">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Today's Schedule ({todayName})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loadingTimetable ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            ) : todayTimetable && todayTimetable.length > 0 ? (
                                <div className="space-y-2">
                                    {todayTimetable.map((t: any) => (
                                        <div key={t.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                                    {t.startTime || '00:00'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{t.subject || 'No Subject'}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {classes?.find((c: any) => c.id === t.classId)?.name || 'Class'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                    <CalendarIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500">No classes scheduled for today.</p>
                                    <p className="text-xs text-slate-400 mt-1">Use the "Data Injector" above to create dummy data.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT: DEBUG INFO (Remove later) */}
                <div className="col-span-3">
                    <Card>
                        <CardHeader><CardTitle>System Status</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-xs font-mono">
                            <div className="flex justify-between border-b pb-1">
                                <span>User ID:</span>
                                <span className="text-slate-500 truncate w-32 text-right">{user?.uid || 'None'}</span>
                            </div>
                            <div className="flex justify-between border-b pb-1">
                                <span>Firestore:</span>
                                <span className={firestore ? "text-green-600" : "text-red-600"}>
                                    {firestore ? "Active" : "Missing"}
                                </span>
                            </div>
                            <div className="flex justify-between border-b pb-1">
                                <span>Students Data:</span>
                                <span>{students ? `${students.length} found` : 'Loading...'}</span>
                            </div>
                            
                            {/* Empty State Prompt */}
                            {(!students || students.length === 0) && (
                                <div className="bg-yellow-50 p-3 rounded text-yellow-800 mt-4">
                                    <strong>Database Empty?</strong>
                                    <p>Use the blue <b>"Populate Dashboard Data"</b> button in the Repair Tool to add sample students and classes.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
    