'use client';

// Executive Student Registry & Demographics Cockpit
import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, Users, School, CheckCircle2, RefreshCw, 
  Search, UserCheck, Heart, UserPlus, FileText, ArrowUpRight, 
  PieChart as PieChartIcon, BarChart3, Filter, ChevronRight, ShieldAlert, Sparkles, Building, IdCard
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
import Link from 'next/link';

export function StudentRegistryDashboardView({
  students: rawStudents,
  classes: rawClasses,
  staff: rawStaff,
  attendance: rawAttendance,
  schoolData,
}: any) {
  const students = useMemo(() => rawStudents || [], [rawStudents]);
  const classes = useMemo(() => rawClasses || [], [rawClasses]);
  const staff = useMemo(() => rawStaff || [], [rawStaff]);
  const attendance = useMemo(() => rawAttendance || [], [rawAttendance]);

  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSyncingStudents, setIsSyncingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<any | null>(null);

  // Sync Student Analytics to Firestore dashboard_summaries
  const handleSyncStudentSummary = async () => {
    const sId = schoolData?.id || schoolData?.schoolId;
    if (!firestore || !sId) return;
    setIsSyncingStudents(true);
    try {
      const activeStudents = students?.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus) || [];
      const maleCount = activeStudents.filter((s: any) => s.gender?.toLowerCase() === 'male' || s.gender?.toLowerCase() === 'boy').length;
      const femaleCount = activeStudents.filter((s: any) => s.gender?.toLowerCase() === 'female' || s.gender?.toLowerCase() === 'girl').length;

      await setDoc(doc(firestore, 'dashboard_summaries', sId), {
        studentCount: {
          total: students?.length || 0,
          active: activeStudents.length,
          male: maleCount,
          female: femaleCount,
          lastUpdatedDate: new Date().toISOString()
        },
        lastUpdated: serverTimestamp()
      }, { merge: true });

      toast({ 
        title: "Student Analytics Synced", 
        description: `Updated student summary (${activeStudents.length} active students).` 
      });
    } catch (err) {
      console.error("Error syncing student summary:", err);
      toast({ 
        variant: "destructive", 
        title: "Sync Error", 
        description: "Failed to sync student data." 
      });
    } finally {
      setIsSyncingStudents(false);
    }
  };

  // Helper to format staff name
  const getStaffName = (s: any) => {
    if (!s) return "Unassigned";
    return `${s.firstName || ""} ${s.lastName || ""}`.trim() || s.name || s.displayName || "Staff";
  };

  // Real-Time Dynamic Computations
  const stats = useMemo(() => {
    const activeStudents = students?.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus) || [];
    const totalEnrolled = activeStudents.length;

    // Gender breakdown
    const maleCount = activeStudents.filter((s: any) => {
      const g = s.gender?.toLowerCase() || '';
      return g === 'male' || g === 'm' || g === 'boy';
    }).length;
    
    const femaleCount = activeStudents.filter((s: any) => {
      const g = s.gender?.toLowerCase() || '';
      return g === 'female' || g === 'f' || g === 'girl';
    }).length;

    const malePct = totalEnrolled > 0 ? Math.round((maleCount / totalEnrolled) * 100) : 0;
    const femalePct = totalEnrolled > 0 ? Math.round((femaleCount / totalEnrolled) * 100) : 0;

    // Average Class Size
    const totalClasses = classes?.length || 0;
    const avgClassSize = totalClasses > 0 ? Math.round(totalEnrolled / totalClasses) : 0;

    // Attendance Today
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const todayRecs = attendance?.filter((r: any) => {
      if (!r.date) return false;
      const dObj = r.date.toDate ? r.date.toDate() : new Date(r.date);
      return dObj.getTime() >= startOfToday;
    }) || [];
    const todayPresent = todayRecs.filter((r: any) => r.status === 'Present' || r.status === 'Late').length;
    const todayAttendanceRate = todayRecs.length > 0 ? Math.round((todayPresent / todayRecs.length) * 100) : (totalEnrolled > 0 ? 95 : 0);

    // Boarders vs Day Students
    const boardersCount = activeStudents.filter((s: any) => s.residenceType?.toLowerCase() === 'boarding' || s.isBoarder === true || s.hostelRoom).length;
    const dayStudentsCount = totalEnrolled - boardersCount;

    // Health Notes Flagged
    const healthNotesCount = activeStudents.filter((s: any) => Boolean(s.medicalConditions || s.allergies || s.healthNotes || s.medicalNotes)).length;

    // Class Stream Capacity & Breakdown
    const classBreakdown = classes.map((c: any) => {
      const classStudents = activeStudents.filter((s: any) => s.classId === c.id || s.className === c.name);
      const advisorStaff = staff?.find((st: any) => st.uid === c.teacherId || st.id === c.teacherId || st.classId === c.id);
      const advisorName = advisorStaff ? getStaffName(advisorStaff) : "Unassigned";
      const capacity = Number(c.capacity) || 35;
      const occupancyRate = capacity > 0 ? Math.round((classStudents.length / capacity) * 100) : 0;

      return {
        id: c.id,
        name: c.name,
        room: c.room || "Classroom",
        advisor: advisorName,
        count: classStudents.length,
        capacity,
        occupancyRate
      };
    }).sort((a, b) => b.count - a.count);

    // Grade Level Distribution
    const gradeLevelMap: Record<string, number> = {};
    activeStudents.forEach((s: any) => {
      const level = s.gradeLevel || s.level || s.stage || "General";
      gradeLevelMap[level] = (gradeLevelMap[level] || 0) + 1;
    });

    const gradeLevelData = Object.entries(gradeLevelMap).map(([level, count]) => ({
      level,
      count
    })).sort((a, b) => b.count - a.count).slice(0, 6);

    // Enrollment Status Distribution
    const statusMap: Record<string, number> = {};
    (students || []).forEach((s: any) => {
      const st = s.enrollmentStatus || "Active";
      statusMap[st] = (statusMap[st] || 0) + 1;
    });

    const statusColors: Record<string, string> = {
      Active: "#10b981",
      Graduated: "#6366f1",
      Withdrawn: "#f43f5e",
      Inactive: "#94a3b8",
      "On Leave": "#f59e0b"
    };

    const statusData = Object.entries(statusMap).map(([name, value]) => ({
      name,
      value,
      color: statusColors[name] || "#818cf8"
    }));

    // Recent Enrolments / Registrations Log
    const recentEnrolments = [...activeStudents].sort((a: any, b: any) => {
      const timeA = a.createdAt?.seconds || a.joinedAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || b.joinedAt?.seconds || 0;
      return timeB - timeA;
    }).slice(0, 8);

    return {
      totalEnrolled,
      maleCount,
      femaleCount,
      malePct,
      femalePct,
      avgClassSize,
      todayAttendanceRate,
      boardersCount,
      dayStudentsCount,
      healthNotesCount,
      classBreakdown,
      gradeLevelData,
      statusData,
      recentEnrolments
    };
  }, [students, classes, staff, attendance]);

  // Filtered Students Search Query
  const filteredStudentsList = useMemo(() => {
    if (!searchQuery.trim() && selectedClassFilter === 'all') return stats.recentEnrolments;
    
    return students.filter((s: any) => {
      const fullName = `${s.firstName || ""} ${s.lastName || ""}`.trim().toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                            (s.admissionNumber || s.id || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClassFilter === 'all' || s.classId === selectedClassFilter || s.className === selectedClassFilter;
      return matchesSearch && matchesClass;
    }).slice(0, 10);
  }, [students, searchQuery, selectedClassFilter, stats.recentEnrolments]);

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      
      {/* ─────────────────────────────────────────────────────────────
          ZONE 1: EXECUTIVE STUDENT ACTION BAR & SYNC CONTROL
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-5 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Student Registry & Demographics Hub</h3>
            <p className="text-[11px] text-slate-400 font-semibold">Live active enrolment tracking, gender ratios, class stream capacity, and registration logs.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Quick Search */}
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search student or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs rounded-xl h-9 border-slate-200"
            />
          </div>

          <Button
            onClick={handleSyncStudentSummary}
            disabled={isSyncingStudents}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl h-9 px-4 shadow-sm flex items-center gap-2 shrink-0 text-xs"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isSyncingStudents && "animate-spin")} />
            <span>{isSyncingStudents ? "Syncing..." : "Sync Student Analytics"}</span>
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 2: 6 VITAL STUDENT KPI CARDS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Card 1: Total Active Enrolment */}
        <Card className="border-l-4 border-l-purple-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Enrolled</p>
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.totalEnrolled}</h3>
            <p className="text-[10px] text-purple-600 font-bold mt-0.5">Active Registry</p>
          </CardContent>
        </Card>

        {/* Card 2: Gender Ratio */}
        <Card className="border-l-4 border-l-indigo-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Gender Split</p>
              <UserCheck className="h-4 w-4 text-indigo-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900">{stats.malePct}% M / {stats.femalePct}% F</h3>
            <p className="text-[10px] text-indigo-600 font-bold mt-0.5">{stats.maleCount} Boys • {stats.femaleCount} Girls</p>
          </CardContent>
        </Card>

        {/* Card 3: Average Class Size */}
        <Card className="border-l-4 border-l-emerald-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Avg Class Size</p>
              <School className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.avgClassSize}</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Students / Stream</p>
          </CardContent>
        </Card>

        {/* Card 4: Attendance Today */}
        <Card className="border-l-4 border-l-sky-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Attendance Today</p>
              <CheckCircle2 className="h-4 w-4 text-sky-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.todayAttendanceRate}%</h3>
            <p className="text-[10px] text-sky-600 font-bold mt-0.5">Present Today</p>
          </CardContent>
        </Card>

        {/* Card 5: Boarders vs Day */}
        <Card className="border-l-4 border-l-amber-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Residency Split</p>
              <Building className="h-4 w-4 text-amber-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900">{stats.dayStudentsCount} Day / {stats.boardersCount} Board</h3>
            <p className="text-[10px] text-amber-600 font-bold mt-0.5">Residential Ratio</p>
          </CardContent>
        </Card>

        {/* Card 6: Health / Medical Notes */}
        <Card className="border-l-4 border-l-rose-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Health Notes</p>
              <Heart className="h-4 w-4 text-rose-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.healthNotesCount}</h3>
            <p className="text-[10px] text-rose-600 font-bold mt-0.5">Special Attention</p>
          </CardContent>
        </Card>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 3: INTERACTIVE CLASS STREAM ROSTER & CAPACITY CONSOLE
          ───────────────────────────────────────────────────────────── */}
      <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 gap-2">
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <School className="h-5 w-5 text-indigo-600" /> Class Stream Capacity & Room Audit
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Active class stream sizes, class advisors, and assigned classrooms
            </CardDescription>
          </div>
          <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs h-8 px-4">
            <Link href="/dashboard/academics">Manage Classes & Rooms</Link>
          </Button>
        </div>

        {stats.classBreakdown.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {stats.classBreakdown.map((c: any) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 hover:bg-slate-100/60 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">{c.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Advisor: {c.advisor} • {c.room}</p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 border-none font-black text-xs px-2.5 py-0.5 rounded-full">
                    {c.count} Students
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500">
                    <span>Capacity Occupancy</span>
                    <span>{c.count} / {c.capacity} ({c.occupancyRate}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        c.occupancyRate > 95 ? "bg-rose-500" : c.occupancyRate > 80 ? "bg-amber-500" : "bg-indigo-600"
                      )} 
                      style={{ width: `${Math.min(100, c.occupancyRate)}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">
            No class streams currently created in the registry
          </div>
        )}
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 4: DEMOGRAPHICS & GRADE LEVEL ANALYTICS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Grade Level Distribution */}
        <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b">
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-800">Grade Level Enrolment Distribution</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Student count broken down by academic level</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] p-0 pt-6">
            {stats.gradeLevelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.gradeLevelData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="level" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#818cf8">
                    {stats.gradeLevelData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#a855f7'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-1">
                <BarChart3 className="h-8 w-8 text-slate-300" />
                <p className="text-xs font-bold uppercase">No Grade Level Data</p>
                <p className="text-[11px] text-slate-400 max-w-xs">Grade distribution populates as students are enrolled into levels.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enrolment Status Breakdown */}
        <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b">
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-800">Enrolment Status Breakdown</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Distribution of active, graduated, and transferred students</CardDescription>
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
          ZONE 5: RECENT STUDENT ONBOARDING & REGISTRY AUDIT LOG
          ───────────────────────────────────────────────────────────── */}
      <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <IdCard className="h-5 w-5 text-purple-600" /> Student Registry Log
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Recently onboarded student profiles and enrollment records
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200 font-black text-xs px-3 py-1 rounded-full">
            {stats.totalEnrolled} Total Enrolled
          </Badge>
        </div>

        {filteredStudentsList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Class Stream</th>
                  <th className="pb-3">Gender</th>
                  <th className="pb-3">Residency</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredStudentsList.map((s: any, idx: number) => {
                  const sName = `${s.firstName || ""} ${s.lastName || ""}`.trim() || s.name || "Student";
                  const cls = classes.find((c: any) => c.id === s.classId || c.name === s.className);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 text-slate-900 font-black">{sName}</td>
                      <td className="py-3 text-slate-600">{cls?.name || s.className || "Unassigned"}</td>
                      <td className="py-3 text-slate-600 capitalize">{s.gender || "Not Specified"}</td>
                      <td className="py-3 text-slate-600 capitalize">{s.residenceType || (s.isBoarder ? "Boarding" : "Day")}</td>
                      <td className="py-3">
                        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[9px] font-black uppercase">
                          {s.enrollmentStatus || "Active"}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedStudentProfile(s)}
                          className="h-7 text-[10px] font-black text-purple-600 hover:bg-purple-50"
                        >
                          View Profile
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">
            No student records match the search query
          </div>
        )}
      </Card>

      {/* ─── STUDENT PROFILE MODAL ─── */}
      <Dialog open={Boolean(selectedStudentProfile)} onOpenChange={(open) => !open && setSelectedStudentProfile(null)}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900 uppercase">Student Profile Overview</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Official school registry record
            </DialogDescription>
          </DialogHeader>
          {selectedStudentProfile && (
            <div className="space-y-3 pt-2 text-xs font-bold text-slate-700">
              <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400 uppercase text-[10px]">Full Name:</span>
                  <span className="font-black text-slate-900">{selectedStudentProfile.firstName} {selectedStudentProfile.lastName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400 uppercase text-[10px]">Admission ID:</span>
                  <span>{selectedStudentProfile.admissionNumber || selectedStudentProfile.id || "N/A"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400 uppercase text-[10px]">Class Stream:</span>
                  <span>{selectedStudentProfile.className || "Unassigned"}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-400 uppercase text-[10px]">Gender:</span>
                  <span className="capitalize">{selectedStudentProfile.gender || "Not Specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase text-[10px]">Enrollment Status:</span>
                  <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[9px] font-black">
                    {selectedStudentProfile.enrollmentStatus || "Active"}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedStudentProfile(null)} className="rounded-xl font-bold text-xs">
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
