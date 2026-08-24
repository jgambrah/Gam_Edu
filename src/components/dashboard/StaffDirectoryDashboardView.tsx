'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, UserCheck, Clock, Award, TrendingUp, RefreshCw, 
  Search, ShieldCheck, Mail, Phone, Calendar, Briefcase, 
  CheckCircle2, AlertCircle, BarChart3, PieChart as PieChartIcon, 
  Filter, ChevronRight, IdCard, Building2, GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, query, where, limit, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { format, startOfDay } from 'date-fns';
import Link from 'next/link';

export function StaffDirectoryDashboardView({
  staff = [],
  staffAttendance = [],
  classes = [],
  students = [],
  schoolData,
  performanceReviews = [],
  leaveRequests = [],
}: any) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSyncingStaff, setIsSyncingStaff] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedStaffProfile, setSelectedStaffProfile] = useState<any | null>(null);

  // Sync Staff Analytics to Firestore dashboard_summaries
  const handleSyncStaffSummary = async () => {
    const sId = schoolData?.id || schoolData?.schoolId;
    if (!firestore || !sId) return;
    setIsSyncingStaff(true);
    try {
      const activeStaff = staff?.filter((s: any) => s.status === 'Active' || !s.status) || [];
      const teachersCount = activeStaff.filter((s: any) => s.role?.toLowerCase() === 'teacher' || s.role?.toLowerCase() === 'faculty').length;
      const adminCount = activeStaff.length - teachersCount;

      await setDoc(doc(firestore, 'dashboard_summaries', sId), {
        staff: {
          totalStaff: staff?.length || 0,
          activeStaff: activeStaff.length,
          teachersCount,
          adminCount,
          lastUpdatedDate: new Date().toISOString()
        },
        lastUpdated: serverTimestamp()
      }, { merge: true });

      toast({ 
        title: "Staff Analytics Synced", 
        description: `Updated workforce summary (${activeStaff.length} active staff members).` 
      });
    } catch (err) {
      console.error("Error syncing staff summary:", err);
      toast({ 
        variant: "destructive", 
        title: "Sync Error", 
        description: "Failed to sync staff data." 
      });
    } finally {
      setIsSyncingStaff(false);
    }
  };

  const startOfToday = useMemo(() => startOfDay(new Date()), []);

  // Format Staff Name Helper
  const getStaffName = (s: any) => {
    if (!s) return "Staff Member";
    return `${s.firstName || ""} ${s.lastName || ""}`.trim() || s.name || s.displayName || s.email || "Staff Member";
  };

  // Real-Time Dynamic Computations for Staff Dashboard
  const stats = useMemo(() => {
    const activeStaff = staff?.filter((s: any) => s.status === 'Active' || !s.status) || [];
    const totalStaffCount = activeStaff.length;

    // Active Students & Student-Teacher Ratio
    const activeStudents = students?.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus) || [];
    const teachersList = activeStaff.filter((s: any) => {
      const r = s.role?.toLowerCase() || '';
      return r === 'teacher' || r === 'faculty' || r === 'instructor' || r === 'educator';
    });
    const teachersCount = teachersList.length || 1;
    const studentTeacherRatio = Math.round(activeStudents.length / teachersCount);

    // Today's Staff Attendance & Punctuality
    const todayStaffRecs = staffAttendance?.filter((r: any) => {
      if (!r.timestamp && !r.createdAt && !r.date) return false;
      const ts = r.timestamp || r.createdAt || r.date;
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d >= startOfToday;
    }) || [];

    const todayCheckIns = todayStaffRecs.filter((r: any) => r.type === 'In' || r.type === 'check-in' || r.status === 'Present' || r.status === 'Late' || !r.type);
    const presentTeacherIds = new Set(todayCheckIns.map((r: any) => r.staffId || r.uid || r.userId));
    const staffAttendanceRate = totalStaffCount > 0 ? Math.round((presentTeacherIds.size / totalStaffCount) * 100) : 0;

    const totalCheckIns = todayCheckIns.length;
    const onTimeCheckIns = todayCheckIns.filter((r: any) => r.status === 'Present' || r.status === 'On Time').length;
    const teacherPunctuality = totalCheckIns > 0 ? Math.round((onTimeCheckIns / totalCheckIns) * 100) : 0;

    // Faculty vs Administrative Split
    const adminCount = totalStaffCount - teachersList.length;

    // Pending Leave Requests
    const pendingLeavesCount = leaveRequests?.filter((l: any) => l.status === 'Pending' || l.status === 'Under Review').length || 0;

    // Department / Role Allocation Breakdown
    const roleMap: Record<string, { count: number; present: number; name: string }> = {};
    activeStaff.forEach((s: any) => {
      const roleName = s.role || "Staff Member";
      if (!roleMap[roleName]) {
        roleMap[roleName] = { count: 0, present: 0, name: roleName };
      }
      roleMap[roleName].count++;
      const sId = s.uid || s.id;
      if (sId && presentTeacherIds.has(sId)) {
        roleMap[roleName].present++;
      }
    });

    const roleBreakdown = Object.values(roleMap).map(r => ({
      name: r.name,
      count: r.count,
      present: r.present,
      rate: r.count > 0 ? Math.round((r.present / r.count) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Department Headcount Data for BarChart
    const deptData = roleBreakdown.slice(0, 6).map(r => ({
      department: r.name,
      count: r.count
    }));

    // Employment Status Data for PieChart
    const statusMap: Record<string, number> = {};
    (staff || []).forEach((s: any) => {
      const st = s.status || "Active";
      statusMap[st] = (statusMap[st] || 0) + 1;
    });

    const statusColors: Record<string, string> = {
      Active: "#10b981",
      "On Leave": "#f59e0b",
      Suspended: "#f43f5e",
      Terminated: "#64748b",
      Probation: "#8b5cf6"
    };

    const statusData = Object.entries(statusMap).map(([name, value]) => ({
      name,
      value,
      color: statusColors[name] || "#6366f1"
    }));

    // Staff Roster Directory with Today's Clock-in Time
    const staffRoster = activeStaff.map((s: any) => {
      const sId = s.uid || s.id;
      const checkInRecord = todayCheckIns.find((r: any) => (r.staffId || r.uid || r.userId) === sId);
      let clockInTime = "Not Checked In";
      if (checkInRecord) {
        const ts = checkInRecord.timestamp || checkInRecord.createdAt || checkInRecord.date;
        clockInTime = ts?.toDate ? format(ts.toDate(), 'hh:mm a') : format(new Date(ts), 'hh:mm a');
      }

      return {
        id: sId,
        name: getStaffName(s),
        email: s.email || "No Email",
        phone: s.phone || s.phoneNumber || "No Phone",
        role: s.role || "Staff Member",
        status: s.status || "Active",
        clockInTime,
        isCheckedIn: Boolean(checkInRecord),
        isLate: checkInRecord?.status === 'Late'
      };
    });

    return {
      totalStaffCount,
      teachersCount,
      adminCount,
      studentTeacherRatio,
      staffAttendanceRate,
      teacherPunctuality,
      pendingLeavesCount,
      roleBreakdown,
      deptData,
      statusData,
      staffRoster
    };
  }, [staff, staffAttendance, classes, students, leaveRequests, startOfToday]);

  // Filtered Staff Roster Search
  const filteredStaffList = useMemo(() => {
    return stats.staffRoster.filter((s: any) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRoleFilter === 'all' || s.role.toLowerCase() === selectedRoleFilter.toLowerCase();
      return matchesSearch && matchesRole;
    });
  }, [stats.staffRoster, searchQuery, selectedRoleFilter]);

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      
      {/* ─────────────────────────────────────────────────────────────
          ZONE 1: EXECUTIVE STAFF ACTION BAR & SYNC CONTROL
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-5 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Faculty & Workforce Intelligence Cockpit</h3>
            <p className="text-[11px] text-slate-400 font-semibold">Real-time active staff counts, student-teacher ratio, clock-in audits, and role allocations.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Quick Search */}
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search staff or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs rounded-xl h-9 border-slate-200"
            />
          </div>

          <Button
            onClick={handleSyncStaffSummary}
            disabled={isSyncingStaff}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl h-9 px-4 shadow-sm flex items-center gap-2 shrink-0 text-xs"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isSyncingStaff && "animate-spin")} />
            <span>{isSyncingStaff ? "Syncing..." : "Sync Staff Analytics"}</span>
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 2: 6 VITAL STAFF KPI CARDS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Card 1: Active Workforce */}
        <Card className="border-l-4 border-l-indigo-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Staff</p>
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.totalStaffCount}</h3>
            <p className="text-[10px] text-indigo-600 font-bold mt-0.5">Total Workforce</p>
          </CardContent>
        </Card>

        {/* Card 2: Student-Teacher Ratio */}
        <Card className="border-l-4 border-l-purple-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Student:Teacher</p>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.studentTeacherRatio}:1</h3>
            <p className="text-[10px] text-purple-600 font-bold mt-0.5">Teaching Workload</p>
          </CardContent>
        </Card>

        {/* Card 3: Teacher Punctuality Today */}
        <Card className="border-l-4 border-l-emerald-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Punctuality</p>
              <Clock className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.teacherPunctuality}%</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">On-Time Clock-in</p>
          </CardContent>
        </Card>

        {/* Card 4: Faculty vs Admin Split */}
        <Card className="border-l-4 border-l-sky-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Workforce Split</p>
              <Briefcase className="h-4 w-4 text-sky-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900">{stats.teachersCount} T / {stats.adminCount} A</h3>
            <p className="text-[10px] text-sky-600 font-bold mt-0.5">Teachers vs Admin</p>
          </CardContent>
        </Card>

        {/* Card 5: Staff Attendance Today */}
        <Card className="border-l-4 border-l-amber-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Staff Present</p>
              <UserCheck className="h-4 w-4 text-amber-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.staffAttendanceRate}%</h3>
            <p className="text-[10px] text-amber-600 font-bold mt-0.5">Today's Check-ins</p>
          </CardContent>
        </Card>

        {/* Card 6: Pending Leave Requests */}
        <Card className="border-l-4 border-l-rose-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Leave Requests</p>
              <Calendar className="h-4 w-4 text-rose-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.pendingLeavesCount}</h3>
            <p className="text-[10px] text-rose-600 font-bold mt-0.5">Pending Review</p>
          </CardContent>
        </Card>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 3: DEPARTMENT & ROLE ALLOCATION CONSOLE
          ───────────────────────────────────────────────────────────── */}
      <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 gap-2">
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" /> Role & Department Allocation Console
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Staff headcounts and active clock-in status broken down by role
            </CardDescription>
          </div>
          <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs h-8 px-4">
            <Link href="/dashboard/staff-management-v2">Manage Staff Roles</Link>
          </Button>
        </div>

        {stats.roleBreakdown.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.roleBreakdown.map((r: any, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:bg-slate-100/60 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">{r.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{r.present} / {r.count} Checked-In</p>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-800 border-none font-black text-xs px-2.5 py-0.5 rounded-full">
                    {r.count} Staff
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Active Presence</span>
                    <span>{r.rate}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-indigo-600 transition-all duration-500" 
                      style={{ width: `${Math.min(100, r.rate)}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">
            No staff roles currently defined in directory
          </div>
        )}
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 4: WORKLOAD & ROLE ANALYTICS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Headcount BarChart */}
        <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b">
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-800">Department Headcount Distribution</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Employee allocation across school roles</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] p-0 pt-6">
            {stats.deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.deptData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="department" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#6366f1">
                    {stats.deptData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-1">
                <BarChart3 className="h-8 w-8 text-slate-300" />
                <p className="text-xs font-bold uppercase">No Department Data</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employment Status Breakdown */}
        <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b">
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-800">Employment Status Breakdown</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Distribution of active, on leave, and probation staff</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] p-0 pt-6 flex items-center justify-between gap-4">
            {stats.statusData.length > 0 ? (
              <>
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                      >
                        {stats.statusData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-2 pr-4">
                  {stats.statusData.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-slate-700">{item.name}</span>
                      </div>
                      <span className="text-slate-900 font-black">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-1">
                <PieChartIcon className="h-8 w-8 text-slate-300" />
                <p className="text-xs font-bold uppercase">No Status Data Available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 5: FACULTY DIRECTORY & CLOCK-IN AUDIT LOG
          ───────────────────────────────────────────────────────────── */}
      <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <IdCard className="h-5 w-5 text-indigo-600" /> Staff Directory & Attendance Audit
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Active workforce roster and today's clock-in timestamps
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-indigo-50 text-indigo-800 border-indigo-200 font-black text-xs px-3 py-1 rounded-full">
            {stats.totalStaffCount} Total Staff
          </Badge>
        </div>

        {filteredStaffList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="pb-3">Staff Name</th>
                  <th className="pb-3">Role / Position</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Today's Clock-In</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStaffList.map((s: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 text-slate-900 font-black">{s.name}</td>
                    <td className="py-3 text-slate-600">{s.role}</td>
                    <td className="py-3 text-slate-500">{s.email}</td>
                    <td className="py-3">
                      {s.isCheckedIn ? (
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-black uppercase",
                          s.isLate ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        )}>
                          {s.clockInTime} {s.isLate ? "(Late)" : ""}
                        </Badge>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-medium italic">Not Checked In</span>
                      )}
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[9px] font-black uppercase">
                        {s.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedStaffProfile(s)}
                        className="h-7 text-[10px] font-black text-indigo-600 hover:bg-indigo-50"
                      >
                        View Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">
            No staff members match the search query
          </div>
        )}
      </Card>

      {/* ─── STAFF PROFILE MODAL ─── */}
      <Dialog open={Boolean(selectedStaffProfile)} onOpenChange={(open) => !open && setSelectedStaffProfile(null)}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900 uppercase">Staff Member Details</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Official employee record
            </DialogDescription>
          </DialogHeader>
          {selectedStaffProfile && (
            <div className="space-y-3 pt-2 text-xs font-bold text-slate-700">
              <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400 uppercase text-[10px]">Full Name:</span>
                  <span className="font-black text-slate-900">{selectedStaffProfile.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400 uppercase text-[10px]">Role / Position:</span>
                  <span>{selectedStaffProfile.role}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400 uppercase text-[10px]">Email Address:</span>
                  <span>{selectedStaffProfile.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400 uppercase text-[10px]">Today's Check-in:</span>
                  <span>{selectedStaffProfile.clockInTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase text-[10px]">Status:</span>
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[9px] font-black">
                    {selectedStaffProfile.status}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedStaffProfile(null)} className="rounded-xl font-bold text-xs">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
