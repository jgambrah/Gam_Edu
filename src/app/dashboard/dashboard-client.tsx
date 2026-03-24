'use client';

import { useMemo, useState, useEffect } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, limit, doc, documentId } from 'firebase/firestore';
import { 
  GraduationCap, Users, School, Banknote, Loader2, 
  PlusCircle, FilePen, BookOpen, Calendar,
  ClipboardCheck, Bell, FileText,
  CreditCard, DollarSign, Receipt, Package, Award,
  Clock, CheckCircle2, UserCheck, BookMarked, Landmark, ChevronRight, Megaphone, CalendarCheck,
  TrendingUp, Sparkles, FolderKanban, HeartHandshake, User as UserIcon,
  BrainCircuit, Sigma, FlaskConical, BookOpenCheck, Code, ShoppingBag, Wallet, Calculator, ArrowUpRight,
  AlertCircle, Book, Library, History, MapPin, Bus as BusIcon, Route as RouteIcon, Info, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { STAFF_ROLES, LibraryItem, Bus, Route } from '@/lib/types';
import { cn } from '@/lib/utils';
import { StudentDisplay } from '@/components/student-display';

// ... (StatCard, QuickActionCard, ActivityItem components) ...

function AdminDashboard({ profile, students, staff, classes, announcements, isStaffUser, isLoading }: any) {
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Administrator';

    const enrollmentData = useMemo(() => {
        if (!classes || !students) return [];
        return classes.map((c: any) => ({
            name: c.name,
            students: students.filter((s: any) => s.classId === c.id).length
        })).sort((a: any, b: any) => b.students - a.students);
    }, [classes, students]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-1 mb-2">
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">System Overview: {displayName} 🏢</h1>
                <p className="text-muted-foreground">Real-time metrics for your school administration.</p>
            </div>

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
                        <Link href="/dashboard/students-v3" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg"><GraduationCap className="h-4 w-4 text-green-600"/></div>
                                <span className="text-sm font-semibold">Enroll Student</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300"/>
                        </Link>
                        <Link href="/dashboard/staff-management-v2" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg"><Users className="h-4 w-4 text-purple-600"/></div>
                                <span className="text-sm font-semibold">Add New Staff</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300"/>
                        </Link>
                        <Link href="/dashboard/announcements" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg"><Bell className="h-4 w-4 text-blue-600"/></div>
                                <span className="text-sm font-semibold">Post News</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300"/>
                        </Link>
                        <Link href="/dashboard/finance/accounting" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg"><Banknote className="h-4 w-4 text-emerald-600"/></div>
                                <span className="text-sm font-semibold">Financial Ledger</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300"/>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Enrollment By Class</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={enrollmentData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                                <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// ... (DashboardClient component) ...
