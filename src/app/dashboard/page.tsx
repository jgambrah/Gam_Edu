
'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
    Users, GraduationCap, UserCog, Megaphone, PlusCircle, ArrowRight, UserPlus 
} from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Student, Staff, Class, Announcement } from '@/lib/types';


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

    const isLoading = loadingStudents || loadingStaff || loadingClasses || loadingAnnouncements;

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold">Welcome back, {user?.displayName || 'Admin'}!</h1>
                <p className="text-muted-foreground">Here's a snapshot of your school today.</p>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Total Students" 
                    value={students?.length || 0} 
                    icon={GraduationCap} 
                    isLoading={isLoading}
                    link="/dashboard/students-v3"
                />
                <StatCard 
                    title="Total Staff" 
                    value={staff?.length || 0} 
                    icon={UserCog} 
                    isLoading={isLoading}
                    link="/dashboard/staff-management-v2"
                />
                <StatCard 
                    title="Active Classes" 
                    value={classes?.length || 0} 
                    icon={Users} 
                    isLoading={isLoading}
                    link="/dashboard/academics"
                />
                <StatCard 
                    title="Announcements" 
                    value={announcements?.length || 0} 
                    icon={Megaphone} 
                    isLoading={isLoading}
                    link="/dashboard/announcements"
                />
            </div>
            
            <div className="grid gap-6 lg:grid-cols-3">
                {/* QUICK ACTIONS */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/dashboard/students-v3"><UserPlus className="mr-2 h-4 w-4"/>Add New Student</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/dashboard/staff-management-v2"><UserCog className="mr-2 h-4 w-4"/>Add New Staff</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full justify-start">
                            <Link href="/dashboard/announcements"><Megaphone className="mr-2 h-4 w-4"/>Post Announcement</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* RECENT ANNOUNCEMENTS */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Announcements</CardTitle>
                        <CardDescription>The latest updates from the school administration.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : announcements && announcements.length > 0 ? (
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
        </div>
    );
}
