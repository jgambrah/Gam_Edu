
'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  GraduationCap, Users, School, Banknote, Loader2, 
  PlusCircle, PenSquare, FilePen 
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

// Simple Stat Card Component
function StatCard({ title, value, icon: Icon, link, isLoading }: { title: string; value: number | string; icon: React.ElementType; link: string, isLoading: boolean }) {
    return (
        <Link href={link}>
            <Card className="hover:bg-accent hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                        <div className="text-2xl font-bold">{value}</div>
                    )}
                </CardContent>
            </Card>
        </Link>
    )
}

// The new Dashboard Home Page
export default function DashboardClient() {
    const { user, isUserLoading } = useUser();
    const { role, profile, loading: isRoleLoading } = useRole();
    const firestore = useFirestore();

    // Data Fetching
    const { data: students, isLoading: studentsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'students') : null, [firestore]));
    const { data: staff, isLoading: staffLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'staff') : null, [firestore]));
    const { data: classes, isLoading: classesLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'classes') : null, [firestore]));
    
    const isLoading = isUserLoading || isRoleLoading || studentsLoading || staffLoading || classesLoading;
    const isAdminOrDirector = role === 'Administrator' || role === 'Director';

    const enrollmentData = useMemo(() => {
        if (!classes || !students) return [];
        return classes.map(c => ({
            name: c.name,
            students: students.filter(s => s.classId === c.id).length
        })).sort((a,b) => b.students - a.students);
    }, [classes, students]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Welcome, {profile?.firstName || user?.displayName || 'User'}!</h1>
                <p className="text-muted-foreground">Here's a quick overview of your school.</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="Total Students" 
                    value={students?.length || 0} 
                    icon={GraduationCap} 
                    link="/dashboard/students-v3"
                    isLoading={isLoading}
                />
                <StatCard 
                    title="Total Staff" 
                    value={staff?.length || 0} 
                    icon={Users}
                    link="/dashboard/staff-management-v2"
                    isLoading={isLoading}
                />
                <StatCard 
                    title="Classes" 
                    value={classes?.length || 0} 
                    icon={School}
                    link="/dashboard/academics"
                    isLoading={isLoading}
                />
                 <StatCard 
                    title="Billing" 
                    value="View" 
                    icon={Banknote}
                    link="/dashboard/accounts"
                    isLoading={isLoading}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {isAdminOrDirector && (
                     <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Perform common tasks with one click.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <Button asChild variant="outline"><Link href="/dashboard/students-v3"><GraduationCap className="mr-2 h-4 w-4"/> Add Student</Link></Button>
                            <Button asChild variant="outline"><Link href="/dashboard/staff-management-v2"><Users className="mr-2 h-4 w-4"/> Add Staff</Link></Button>
                            <Button asChild variant="outline"><Link href="/dashboard/announcements"><PenSquare className="mr-2 h-4 w-4"/>Post News</Link></Button>
                            <Button asChild variant="outline"><Link href="/dashboard/finance/accounting"><Banknote className="mr-2 h-4 w-4"/>Visit Finance</Link></Button>
                        </CardContent>
                    </Card>
                )}

                <Card className={isAdminOrDirector ? "lg:col-span-2" : "lg:col-span-3"}>
                    <CardHeader>
                        <CardTitle>Enrollment by Class</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {isLoading ? <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin"/></div> : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={enrollmentData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
