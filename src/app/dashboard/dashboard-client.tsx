
'use client';

import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, School, Banknote, Loader2 } from 'lucide-react';
import Link from 'next/link';

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

    // Fetch data for stats
    const { data: students, isLoading: studentsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'students') : null, [firestore]));
    const { data: staff, isLoading: staffLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'staff') : null, [firestore]));
    const { data: classes, isLoading: classesLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'classes') : null, [firestore]));

    const isLoading = isUserLoading || isRoleLoading || studentsLoading || staffLoading || classesLoading;

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
            {/* You can add more dashboard components here in the future */}
        </div>
    );
}
