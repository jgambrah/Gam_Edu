
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, limit, doc } from 'firebase/firestore';
import { 
  GraduationCap, Users, School, Banknote, Loader2, 
  PlusCircle, FilePen, BookOpen, Calendar,
  ClipboardCheck, Bell, FileText,
  CreditCard, DollarSign, Receipt, Package, Award,
  Clock, CheckCircle2, UserCheck, BookMarked, Landmark, ChevronRight, Megaphone, CalendarCheck,
  TrendingUp, Sparkles, FolderKanban, HeartHandshake, User as UserIcon,
  BrainCircuit, Sigma, FlaskConical, BookOpenCheck, Code, ShoppingBag, Wallet, Calculator, ArrowUpRight,
  AlertCircle, Book, Library, History, MapPin, Bus as BusIcon, Route as RouteIcon, Info
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
            <div className="h-8 flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
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
      <Card className="hover:bg-accent hover:shadow-md transition-all cursor-pointer h-full border-none shadow-none bg-slate-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-white p-3 shadow-sm border">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">{title}</h3>
              {description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>}
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

// --- TRANSPORT DASHBOARD COMPONENT ---
function TransportDashboard({ profile, schoolId, buses, routes, students }: { profile: any, schoolId: string, buses: Bus[] | null, routes: Route[] | null, students: any[] | null }) {
  const { user } = useUser();
  const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Officer';

  const stats = useMemo(() => {
    const totalBuses = buses?.length || 0;
    const totalRoutes = routes?.length || 0;
    const busStudents = students?.filter(s => s.usesBusService === true) || [];
    const subscriberCount = busStudents.length;

    // Calculate utilization for each route
    const utilizationData = routes?.map(route => {
      const bus = buses?.find(b => b.id === route.busId);
      const capacity = bus?.capacity || 1;
      const assignedCount = route.stops?.reduce((sum, stop) => sum + (stop.assignedStudentIds?.length || 0), 0) || 0;
      return {
        name: route.name,
        assigned: assignedCount,
        capacity: capacity,
        percentage: Math.round((assignedCount / capacity) * 100)
      };
    }) || [];

    const totalCapacity = buses?.reduce((sum, b) => sum + (b.capacity || 0), 0) || 0;
    const overallUtilization = totalCapacity > 0 ? Math.round((subscriberCount / totalCapacity) * 100) : 0;

    return { totalBuses, totalRoutes, subscriberCount, utilizationData, overallUtilization };
  }, [buses, routes, students]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Transport Control: {displayName} 🚌</h1>
        <p className="text-muted-foreground">Manage school fleet, routes, and student logistics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Routes" value={stats.totalRoutes} icon={RouteIcon} link="/dashboard/transport" colorClass="text-indigo-600" />
        <StatCard title="Total Fleet" value={stats.totalBuses} icon={BusIcon} link="/dashboard/transport" colorClass="text-blue-600" />
        <StatCard title="Bus Subscribers" value={stats.subscriberCount} icon={Users} link="/dashboard/transport" colorClass="text-emerald-600" />
        <StatCard title="Fleet Utilization" value={`${stats.overallUtilization}%`} icon={TrendingUp} link="/dashboard/transport" colorClass={stats.overallUtilization > 90 ? "text-red-600" : "text-indigo-600"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ArrowUpRight className="text-indigo-500 h-5 w-5"/> Route Utilization</CardTitle>
            <CardDescription>Occupancy levels across all active routes.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {stats.utilizationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.utilizationData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} unit="%" />
                  <Tooltip />
                  <Bar dataKey="percentage" name="Occupancy %" radius={[4, 4, 0, 0]}>
                    {stats.utilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.percentage > 90 ? '#ef4444' : '#6366f1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground italic">No route data defined yet.</div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-lg">Logistics Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/transport" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg"><MapPin className="h-4 w-4 text-indigo-600"/></div>
                    <span className="text-sm font-semibold">Manage Routes</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/transport" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><BusIcon className="h-4 w-4 text-blue-600"/></div>
                    <span className="text-sm font-semibold">Update Fleet</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/transport" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg"><UserCheck className="h-4 w-4 text-emerald-600"/></div>
                    <span className="text-sm font-semibold">Assign Students</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fleet Status Board</CardTitle>
          <CardDescription>Current route assignments and resource status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {routes?.map((route) => {
              const bus = buses?.find(b => b.id === route.busId);
              const assignedCount = route.stops?.reduce((sum, stop) => sum + (stop.assignedStudentIds?.length || 0), 0) || 0;
              const isNearCapacity = bus && assignedCount >= bus.capacity;

              return (
                <div key={route.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-full", isNearCapacity ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600")}>
                      <BusIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{route.name}</p>
                      <p className="text-xs text-muted-foreground">{bus?.name || 'No Bus'} • {assignedCount} Students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={isNearCapacity ? "destructive" : "secondary"} className="text-[10px]">
                      {isNearCapacity ? 'FULL' : 'ACTIVE'}
                    </Badge>
                  </div>
                </div>
              );
            })}
            {(!routes || routes.length === 0) && <p className="text-center py-6 text-muted-foreground italic">No routes registered.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- LIBRARIAN DASHBOARD COMPONENT ---
function LibrarianDashboard({ profile, schoolId }: { profile: any, schoolId: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Librarian';

  const libraryQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'library'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: libraryItems, isLoading: loadingLibrary } = useCollection<LibraryItem>(libraryQuery);

  const stats = useMemo(() => {
    if (!libraryItems) return { total: 0, available: 0, borrowed: 0, overdue: 0, byStatus: [] as any[] };
    
    const total = libraryItems.length;
    const available = libraryItems.filter(i => i.status === 'Available').length;
    const borrowed = libraryItems.filter(i => i.status === 'Borrowed' || i.status === 'Pending Return').length;
    const overdue = libraryItems.filter(i => i.status === 'Borrowed' && i.dueDate && new Date(i.dueDate.toDate()) < new Date()).length;

    return {
      total,
      available,
      borrowed,
      overdue,
      byStatus: [
        { name: 'Available', value: available },
        { name: 'Borrowed', value: borrowed },
        { name: 'Overdue', value: overdue }
      ].filter(i => i.value > 0)
    };
  }, [libraryItems]);

  const recentActivity = useMemo(() => {
    if (!libraryItems) return [];
    return [...libraryItems]
      .filter(i => i.status === 'Requested' || i.status === 'Pending Return' || i.status === 'Borrowed')
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      .slice(0, 5);
  }, [libraryItems]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Library Portal: {displayName} 📚</h1>
        <p className="text-muted-foreground">Manage the school catalog, lending, and student requests.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Books" value={stats.total} icon={Book} link="/dashboard/library" colorClass="text-blue-600" isLoading={loadingLibrary} />
        <StatCard title="Available" value={stats.available} icon={CheckCircle2} link="/dashboard/library" colorClass="text-emerald-600" isLoading={loadingLibrary} />
        <StatCard title="Borrowed" value={stats.borrowed} icon={History} link="/dashboard/library" colorClass="text-orange-600" isLoading={loadingLibrary} />
        <StatCard title="Overdue" value={stats.overdue} icon={AlertCircle} link="/dashboard/library" colorClass="text-red-600" isLoading={loadingLibrary} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="text-blue-500 h-5 w-5"/> Lending Statistics</CardTitle>
            <CardDescription>Visual breakdown of your current library status.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {stats.byStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.byStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground italic">No library records found.</div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-lg">Librarian Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/library" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><BookMarked className="h-4 w-4 text-blue-600"/></div>
                    <span className="text-sm font-semibold">Library Catalog</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/library" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg"><History className="h-4 w-4 text-orange-600"/></div>
                    <span className="text-sm font-semibold">Borrowing Requests</span>
                </div>
                <Badge className="bg-orange-500">{libraryItems?.filter(i => i.status === 'Requested').length || 0}</Badge>
            </Link>
            <Link href="/dashboard/academics/learning-materials" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg"><FolderKanban className="h-4 w-4 text-purple-600"/></div>
                    <span className="text-sm font-semibold">Course Materials</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Lending Activity</CardTitle>
          <CardDescription>Track new requests and returns.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${item.status === 'Requested' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.currentHolderName || 'Anonymous'} • {item.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">
                    {item.createdAt ? formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true }) : ''}
                  </p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="text-center py-6 text-muted-foreground italic">No recent borrowing activity.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- ACCOUNTANT DASHBOARD COMPONENT ---
function AccountantDashboard({ profile, schoolId, financialRecords }: { profile: any, schoolId: string, financialRecords: any[] | null }) {
  const { user } = useUser();
  const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Accountant';

  const stats = useMemo(() => {
    if (!financialRecords) return { totalRevenue: 0, totalOutstanding: 0, debtorCount: 0, byType: [] as any[] };
    
    let paid = 0;
    let outstanding = 0;
    const debtorIds = new Set();
    const typeTotals: Record<string, number> = {};

    financialRecords.forEach(r => {
      paid += (r.amountPaid || 0);
      const balance = (r.billedAmount || 0) - (r.amountPaid || 0) - (r.waiverAmount || 0);
      if (balance > 0.01) {
        outstanding += balance;
        debtorIds.add(r.studentId);
      }
      // Group revenue by type
      const type = r.type || 'Other';
      typeTotals[type] = (typeTotals[type] || 0) + (r.amountPaid || 0);
    });

    return {
      totalRevenue: paid,
      totalOutstanding: outstanding,
      debtorCount: debtorIds.size,
      byType: Object.entries(typeTotals).map(([name, value]) => ({ name, value })).filter(i => i.value > 0)
    };
  }, [financialRecords]);

  const recentCollections = useMemo(() => {
    if (!financialRecords) return [];
    return [...financialRecords]
      .filter(r => (r.amountPaid || 0) > 0)
      .sort((a, b) => (b.lastPaymentDate?.seconds || 0) - (a.lastPaymentDate?.seconds || 0))
      .slice(0, 5);
  }, [financialRecords]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Financial Hub: {displayName} 💰</h1>
        <p className="text-muted-foreground">Manage billings, payments, and payroll.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={`GH₵${stats.totalRevenue.toLocaleString()}`} icon={Landmark} link="/dashboard/reports/financials" colorClass="text-emerald-600" />
        <StatCard title="Outstanding Fees" value={`GH₵${stats.totalOutstanding.toLocaleString()}`} icon={AlertCircle} link="/dashboard/accounts" colorClass="text-red-600" />
        <StatCard title="Active Debtors" value={stats.debtorCount} icon={Users} link="/dashboard/accounts" colorClass="text-orange-600" />
        <StatCard title="Pending Records" value={financialRecords?.length || 0} icon={FileText} link="/dashboard/accounts" colorClass="text-blue-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ArrowUpRight className="text-emerald-500 h-5 w-5"/> Revenue Distribution</CardTitle>
            <CardDescription>Breakdown of collections by fee category.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {stats.byType.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byType}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground italic">No revenue recorded yet.</div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-lg">Quick Finance Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/accounts" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg"><DollarSign className="h-4 w-4 text-emerald-600"/></div>
                    <span className="text-sm font-semibold">Record Payment</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/accounts/cash-till" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><Wallet className="h-4 w-4 text-blue-600"/></div>
                    <span className="text-sm font-semibold">My Cash Till</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/finance/payroll" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg"><Calculator className="h-4 w-4 text-purple-600"/></div>
                    <span className="text-sm font-semibold">Run Payroll</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/finance/accounting" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg"><Book className="h-4 w-4 text-slate-600"/></div>
                    <span className="text-sm font-semibold">General Ledger</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Collections</CardTitle>
          <CardDescription>The latest fees processed for your school.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCollections.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{record.studentName}</p>
                    <p className="text-xs text-muted-foreground">{record.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-700">+GH₵{record.amountPaid.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-400">
                    {record.lastPaymentDate ? formatDistanceToNow(record.lastPaymentDate.toDate(), { addSuffix: true }) : ''}
                  </p>
                </div>
              </div>
            ))}
            {recentCollections.length === 0 && <p className="text-center py-6 text-muted-foreground italic">No recent collections found.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- STUDENT DASHBOARD COMPONENT ---
function StudentDashboard({ profile, schoolId }: { profile: any, schoolId: string }) {
  const firestore = useFirestore();
  const { user } = useUser();

  // 1. Fetch Student Data
  const studentQuery = useMemoFirebase(() => (firestore && user && schoolId) ? query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, [firestore, user, schoolId]);
  const { data: studentData, isLoading: loadingStudent } = useCollection<any>(studentQuery);
  const student = studentData?.[0];

  const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Learner';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Hello, {displayName}! 👋</h1>
        <p className="text-muted-foreground">Ready for a great day of learning?</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="My Class" value={student?.classId || 'Not Assigned'} icon={School} link="/dashboard/timetable" colorClass="text-blue-600" />
        <StatCard title="My Grades" value="View All" icon={TrendingUp} link="/dashboard/my-grades" colorClass="text-emerald-600" />
        <StatCard title="Assignments" value="View Tasks" icon={ClipboardCheck} link="/dashboard/assignments" colorClass="text-orange-600" />
        <StatCard title="Materials" value="Browse" icon={FolderKanban} link="/dashboard/academics/learning-materials" colorClass="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="text-yellow-500 h-5 w-5"/> Learning Hub</CardTitle>
            <CardDescription>Quick access to your academic clubs and activities.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuickActionCard title="Maths Club" description="Practice problems and climb the leaderboard." icon={Sigma} link="/dashboard/maths-club-v2" />
                <QuickActionCard title="Science Lab" description="Explore facts and AI-led lessons." icon={FlaskConical} link="/dashboard/science-club-v2" />
                <QuickActionCard title="ELA Club" description="Grammar, reading, and writing challenges." icon={BookOpenCheck} link="/dashboard/ela-club" />
                <QuickActionCard title="Coding Club" description="Learn to build with blocks and Python." icon={Code} link="/dashboard/coding-club" />
             </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-lg">My Portal</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/timetable" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><Calendar className="h-4 w-4 text-blue-600"/></div>
                    <span className="text-sm font-semibold">Weekly Timetable</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/study-club" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg"><BrainCircuit className="h-4 w-4 text-purple-600"/></div>
                    <span className="text-sm font-semibold">Dr. Gam AI Tutor</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/my-reports" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg"><FileText className="h-4 w-4 text-emerald-600"/></div>
                    <span className="text-sm font-semibold">Official Report Cards</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- PARENT DASHBOARD ---
function ParentDashboard({ profile, schoolId, students, financialRecords, announcements, isLoading, announcementsLoading }: { profile: any, schoolId: string, students: any[] | null, financialRecords: any[] | null, announcements: any[] | null, isLoading: boolean, announcementsLoading: boolean }) {
  const { user } = useUser();
  const myStudentIds = profile?.studentIds || profile?.students || profile?.childrenIds || profile?.linkedStudentIds || [];
  
  const myStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(s => myStudentIds.includes(s.uid));
  }, [students, myStudentIds]);

  const activeBills = useMemo(() => {
    if (!financialRecords) return [];
    return financialRecords.filter((r: any) => 
        myStudentIds.includes(r.studentId) && 
        r.status !== 'Pending Reversal' && 
        r.status !== 'Rejected Reversal'
    );
  }, [financialRecords, myStudentIds]);
  
  const totalBilled = activeBills.reduce((acc: number, r: any) => acc + r.billedAmount, 0);
  const totalPaid = activeBills.reduce((acc: number, r: any) => acc + (r.amountPaid || 0) + (r.waiverAmount || 0), 0);
  const totalOutstanding = totalBilled - totalPaid;

  const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Parent';

  return (
    <>
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome, {displayName}! 🏡</h1>
        <p className="text-muted-foreground">Keep track of your children's school activities and fees.</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard 
          title="My Children" 
          value={myStudents.length} 
          icon={Users} 
          link="/dashboard/my-children"
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Outstanding" 
          value={`GH₵ ${totalOutstanding.toFixed(2)}`} 
          icon={DollarSign}
          link="/dashboard/my-bills"
          isLoading={isLoading}
          badge={totalOutstanding > 0 ? "Action Required" : undefined}
          colorClass={totalOutstanding > 0 ? "text-red-600" : "text-emerald-600"}
        />
        <StatCard 
          title="Live Grades" 
          value="View Now" 
          icon={Award}
          link="/dashboard/my-grades"
          isLoading={isLoading}
        />
        <StatCard 
          title="Report Cards" 
          value="Download" 
          icon={FileText}
          link="/dashboard/my-reports"
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE: CHILDREN LIST */}
        <div className="lg:col-span-2 space-y-6">
           <Card>
              <CardHeader>
                  <CardTitle>My Children</CardTitle>
                  <CardDescription>
                    {isLoading 
                      ? "Loading children's profiles..." 
                      : `You have ${myStudents.length} child${myStudents.length !== 1 ? 'ren' : ''} enrolled.`
                    }
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading && <div className="flex justify-center py-4"><Loader2 className="animate-spin"/></div>}
                
                {!isLoading && myStudents.length === 0 && myStudentIds.length === 0 && (
                    <p className="text-muted-foreground p-4 bg-slate-50 rounded-lg text-center border-2 border-dashed">
                        No children linked to your account. Please contact the administrator.
                    </p>
                )}

                {!isLoading && myStudents.length === 0 && myStudentIds.length > 0 && (
                    <p className="text-muted-foreground p-4 text-center text-sm italic">
                        Synchronizing children's profiles...
                    </p>
                )}

                {!isLoading && myStudents.map((student: any) => (
                  <Link href="/dashboard/my-children" key={student.uid}>
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors mb-2">
                      <StudentDisplay student={student} variant="list" showAvatar />
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </CardContent>
          </Card>
          
          <Card>
              <CardHeader><CardTitle>Recent Announcements</CardTitle></CardHeader>
              <CardContent>
                {announcementsLoading ? <div className="flex justify-center p-4"><Loader2 className="animate-spin h-6 w-6"/></div> : null}
                {!announcementsLoading && (!announcements || announcements.length === 0) && (
                    <p className="text-muted-foreground text-center py-4">No recent announcements.</p>
                )}
                {announcements?.slice(0, 3).map((a: any) => (
                   <ActivityItem 
                    key={a.id}
                    title={a.title}
                    description={a.content.substring(0, 100) + '...'}
                    time={a.publishedAt ? formatDistanceToNow(a.publishedAt.toDate(), { addSuffix: true }) : ''}
                    icon={Megaphone}
                    iconColor='text-purple-600'
                  />
                ))}
              </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDE: BILLS SUMMARY */}
         <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Student Bills</CardTitle>
                    <CardDescription>
                      {isLoading 
                        ? "Loading children's records..." 
                        : `Financial records for ${myStudents.length} child${myStudents.length !== 1 ? 'ren' : ''}.`
                      }
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {myStudents.map((student: any) => {
                        const studentBills = activeBills.filter((b:any) => b.studentId === student.uid);
                        const sBilled = studentBills.reduce((acc: number, r: any) => acc + r.billedAmount, 0);
                        const sPaid = studentBills.reduce((acc: number, r: any) => acc + (r.amountPaid || 0) + (r.waiverAmount || 0), 0);
                        const sBalance = sBilled - sPaid;

                        return (
                            <Link href="/dashboard/my-bills" key={student.uid}>
                                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 mb-2">
                                    <span className="font-medium text-sm">{student.firstName}'s Account</span>
                                    <span className={`font-bold ${sBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        GH₵{sBalance.toFixed(2)}
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                    {myStudents.length === 0 && !isLoading && <p className="text-muted-foreground text-sm text-center py-4">No children linked.</p>}
                </CardContent>
            </Card>
         </div>
      </div>
    </>
  );
}

// --- TEACHER DASHBOARD COMPONENT ---
function TeacherDashboard({ profile }: { profile: any }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();

  const teacherClassesQuery = useMemoFirebase(() => (firestore && user && schoolId) ? query(collection(firestore, 'classes'), where('teacherId', '==', user.uid), where('schoolId', '==', schoolId)) : null, [firestore, user, schoolId]);
  const { data: teacherClasses, isLoading: loadingClasses } = useCollection<any>(teacherClassesQuery);

  const teacherClassIds = useMemo(() => teacherClasses?.map((c: any) => c.id) || [], [teacherClasses]);
  const studentsQuery = useMemoFirebase(() => (firestore && schoolId && teacherClassIds.length > 0) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('classId', 'in', teacherClassIds)) : null, [firestore, teacherClassIds.join(','), schoolId]);
  const { data: students, isLoading: loadingStudents } = useCollection<any>(studentsQuery);

  const assignmentsQuery = useMemoFirebase(() => (firestore && user && schoolId) ? query(collection(firestore, 'assignments'), where('teacherId', '==', user.uid), where('schoolId', '==', schoolId), orderBy('dueDate', 'asc'), limit(5)) : null, [firestore, user, schoolId]);
  const { data: assignments, isLoading: loadingAssignments } = useCollection<any>(assignmentsQuery);

  const isLoading = loadingClasses || loadingStudents || loadingAssignments;
  const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Teacher';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome back, {displayName}! 🍎</h1>
        <p className="text-muted-foreground">Manage your classes, assignments, and student progress.</p>
      </div>

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
            <Link href="/dashboard/assignments" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><FilePen className="h-4 w-4 text-blue-600"/></div>
                    <span className="text-sm font-semibold">New Assignment</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/attendance" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg"><CalendarCheck className="h-4 w-4 text-green-600"/></div>
                    <span className="text-sm font-semibold">Take Attendance</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
            <Link href="/dashboard/academics/gradebook" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border transition-all">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg"><BookOpen className="h-4 w-4 text-amber-600"/></div>
                    <span className="text-sm font-semibold">Enter Grades</span>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300"/>
            </Link>
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
  const isTransport = role === 'Transport Staff';
  const isStaffUser = isAdminOrDirector || isTeacher || isFinance || isLibrarian || isTransport;

  const parentStudentIds = useMemo(() => profile?.studentIds || profile?.students || profile?.childrenIds || profile?.linkedStudentIds || [], [profile]);
  const parentStudentIdsStr = parentStudentIds.join(',');

  const studentsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    if (isStaffUser) return query(collection(firestore, 'students'), where('schoolId', '==', schoolId));
    if (isParent && !isRoleLoading && parentStudentIds.length > 0) {
        return query(collection(firestore, 'students'), where('uid', 'in', parentStudentIds));
    }
    return null;
  }, [firestore, schoolId, isStaffUser, isParent, isRoleLoading, parentStudentIdsStr]);
  const { data: students, isLoading: studentsLoading } = useCollection<any>(studentsQuery);

  const staffQuery = useMemoFirebase(() => (firestore && schoolId && isAdminOrDirector) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId), where('role', 'in', STAFF_ROLES)) : null, [firestore, schoolId, isAdminOrDirector]);
  const { data: staff, isLoading: staffLoading } = useCollection<any>(staffQuery);

  const classesQuery = useMemoFirebase(() => (firestore && schoolId && isStaffUser) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isStaffUser]);
  const { data: classes, isLoading: classesLoading } = useCollection<any>(classesQuery);
  
  const assignmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore || !schoolId) return null;
    let q = query(collection(firestore, 'assignments'), where('schoolId', '==', schoolId));
    if(isTeacher) q = query(q, where('teacherId', '==', user.uid));
    return q;
  }, [firestore, user, isTeacher, schoolId]);
  const { data: assignments, isLoading: assignmentsLoading } = useCollection<any>(assignmentsQuery);

  const announcementsQuery = useMemoFirebase(() => {
    if(!firestore || !schoolId) return null;
    return query(collection(firestore, 'announcements_v2'), where('schoolId', '==', schoolId), orderBy('publishedAt', 'desc'), limit(5))
  }, [firestore, schoolId]);
  const { data: announcements, isLoading: announcementsLoading } = useCollection<any>(announcementsQuery);
  
  const leaveRequestsQuery = useMemoFirebase(() => (firestore && isStaffUser && schoolId) ? query(collection(firestore, 'leaveRequests'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'), limit(5)) : null, [firestore, isStaffUser, schoolId]);
  const { data: leaveRequests, isLoading: leaveLoading } = useCollection<any>(leaveRequestsQuery);
  
  const financialRecordsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    if (isFinance || isAdminOrDirector) return query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc'));
    if (isParent && !isRoleLoading && parentStudentIds.length > 0) {
        return query(collection(firestore, 'financialRecords'), where('studentId', 'in', parentStudentIds), orderBy('createdAt', 'desc'));
    }
    return null;
  }, [firestore, isFinance, isAdminOrDirector, isParent, isRoleLoading, schoolId, parentStudentIdsStr]);
  const { data: financialRecords, isLoading: paymentsLoading } = useCollection<any>(financialRecordsQuery);

  // Transport Specific Queries
  const busesQuery = useMemoFirebase(() => (firestore && schoolId && (isTransport || isAdminOrDirector)) ? query(collection(firestore, 'buses'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isTransport, isAdminOrDirector]);
  const { data: buses, isLoading: busesLoading } = useCollection<Bus>(busesQuery);

  const routesQuery = useMemoFirebase(() => (firestore && schoolId && (isTransport || isAdminOrDirector)) ? query(collection(firestore, 'routes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isTransport, isAdminOrDirector]);
  const { data: routes, isLoading: routesLoading } = useCollection<Route>(routesQuery);
  
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

  const isLoading = studentsLoading || staffLoading || classesLoading || leaveLoading || announcementsLoading || assignmentsLoading || busesLoading || routesLoading || paymentsLoading;
  
  if (isUserLoading || isRoleLoading || isLoadingSchool) {
      return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <span className="ml-3 text-muted-foreground">Loading your workspace...</span>
        </div>
      );
  }

  if (isTeacher) return <TeacherDashboard profile={profile} />;
  if (isStudent) return <StudentDashboard profile={profile} schoolId={schoolId!} />;
  if (isParent) return <ParentDashboard profile={profile} schoolId={schoolId!} students={students} financialRecords={financialRecords} announcements={announcements} isLoading={studentsLoading || paymentsLoading} announcementsLoading={announcementsLoading} />;
  if (isFinance) return <AccountantDashboard profile={profile} schoolId={schoolId!} financialRecords={financialRecords} />;
  if (isLibrarian) return <LibrarianDashboard profile={profile} schoolId={schoolId!} />;
  if (isTransport) return <TransportDashboard profile={profile} schoolId={schoolId!} buses={buses} routes={routes} students={students} />;

  if (isAdminOrDirector) {
      const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Administrator';
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
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{a.content}</p>
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
