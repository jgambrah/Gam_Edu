'use client';

import { useAuth, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit, where, onSnapshot } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format, getDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { Users, GraduationCap, UserCog, Megaphone, Calendar as CalendarIcon } from 'lucide-react';
import SystemRepair from '@/components/SystemRepair'; // Import the tool temporarily
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
    const { user } = useAuth();
    const firestore = useFirestore();
    const [loading, setLoading] = useState(true);
    
    // Local State for Data
    const [stats, setStats] = useState({ students: 0, staff: 0, classes: 0 });
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [todayTimetable, setTodayTimetable] = useState<any[]>([]);

    useEffect(() => {
        if (!firestore) return;

        setLoading(true);

        // 1. STATS LISTENERS
        const unsubStudents = onSnapshot(collection(firestore, 'students'), snap => 
            setStats(prev => ({ ...prev, students: snap.size })));
        
        const unsubStaff = onSnapshot(collection(firestore, 'staff'), snap => 
            setStats(prev => ({ ...prev, staff: snap.size })));

        const unsubClasses = onSnapshot(collection(firestore, 'classes'), snap => 
            setStats(prev => ({ ...prev, classes: snap.size })));

        // 2. ANNOUNCEMENTS
        const qAnnounce = query(collection(firestore, 'announcements_v2'), orderBy('publishedAt', 'desc'), limit(4));
        const unsubAnnounce = onSnapshot(qAnnounce, snap => {
            setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        // 3. TIMETABLE (Requires Index: day + timeSlotId)
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = days[getDay(new Date())];
        
        const qTimetable = query(
            collection(firestore, 'timetables'), 
            where('day', '==', todayName), 
            orderBy('timeSlotId') 
        );
        
        const unsubTimetable = onSnapshot(qTimetable, 
            (snap) => {
                setTodayTimetable(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                setLoading(false);
            },
            (error) => {
                console.error("Timetable Error (Check Indexes!):", error);
                setLoading(false); 
            }
        );

        return () => {
            unsubStudents(); unsubStaff(); unsubClasses(); unsubAnnounce(); unsubTimetable();
        };
    }, [firestore]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                {/* REMOVE THIS COMPONENT AFTER RUNNING ONCE */}
                <SystemRepair />
            </div>

            {/* STATS */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <GraduationCap className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-10"/> : stats.students}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
                        <UserCog className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-10"/> : stats.staff}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-10"/> : stats.classes}</div>
                    </CardContent>
                </Card>
            </div>

            {/* TIMETABLE SECTION */}
            <Card>
                <CardHeader>
                    <CardTitle>Today's Schedule ({format(new Date(), 'eeee')})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? <Skeleton className="h-20 w-full"/> : todayTimetable.length > 0 ? (
                        <div className="space-y-2">
                            {todayTimetable.map(t => (
                                <div key={t.id} className="p-3 border rounded-md flex justify-between items-center bg-slate-50">
                                    <span className="font-bold text-indigo-700">{t.startTime} - {t.endTime}</span>
                                    <span>{t.subject}</span>
                                    <span className="text-xs text-gray-500 bg-white px-2 py-1 border rounded">{t.classId}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500 flex flex-col items-center">
                            <CalendarIcon className="h-8 w-8 mb-2 opacity-20"/>
                            No classes scheduled for today.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
