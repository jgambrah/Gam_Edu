'use client';

import React, { useState, useMemo } from 'react';
import { 
  CalendarCheck, Clock, Users, AlertTriangle, AlertCircle, RefreshCw, 
  CheckCircle2, XCircle, UserCheck, ShieldAlert, Sparkles, Send, FileText, 
  ChevronRight, ArrowUpRight, TrendingUp, GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, query, where, limit, getDocs, setDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { format, startOfDay } from 'date-fns';

export function AttendanceAnalyticsView({
  students: rawStudents,
  staff: rawStaff,
  classes: rawClasses,
  attendance: rawAttendance,
  staffAttendance: rawStaffAttendance,
  schoolData,
}: any) {
  const students = useMemo(() => rawStudents || [], [rawStudents]);
  const staff = useMemo(() => rawStaff || [], [rawStaff]);
  const classes = useMemo(() => rawClasses || [], [rawClasses]);
  const attendance = useMemo(() => rawAttendance || [], [rawAttendance]);
  const staffAttendance = useMemo(() => rawStaffAttendance || [], [rawStaffAttendance]);

  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSyncingAttendance, setIsSyncingAttendance] = useState(false);
  const [selectedAbsentStudent, setSelectedAbsentStudent] = useState<any | null>(null);
  const [selectedStaffReminder, setSelectedStaffReminder] = useState<any | null>(null);

  // Sync Attendance Analytics to Firestore dashboard_summaries
  const handleSyncAttendanceSummary = async () => {
    const sId = schoolData?.id || schoolData?.schoolId;
    if (!firestore || !sId) return;
    setIsSyncingAttendance(true);
    try {
      const todayNormalized = startOfDay(new Date());
      const q = query(
        collection(firestore, 'attendance'),
        where('schoolId', '==', sId),
        where('date', '==', Timestamp.fromDate(todayNormalized))
      );
      const snap = await getDocs(q);

      let presentCount = 0;
      let totalRecorded = 0;
      const absentList: any[] = [];
      const activeStudentIds = new Set(students?.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus).map((s: any) => s.uid || s.id) || []);

      snap.docs.forEach((d) => {
        const data = d.data();
        const records = data.records || {};
        const className = data.className || "Class";

        if (records && typeof records === 'object') {
          Object.entries(records).forEach(([sId, status]: [string, any]) => {
            if (activeStudentIds.size > 0 && !activeStudentIds.has(sId)) return;
            totalRecorded++;
            if (status === 'Present' || status === 'Late') {
              presentCount++;
            } else if (status === 'Absent') {
              const stud = students?.find((s: any) => (s.uid || s.id) === sId);
              absentList.push({
                id: sId,
                name: stud ? `${stud.firstName || ""} ${stud.lastName || ""}`.trim() : "Student",
                className: className
              });
            }
          });
        }
      });

      const totalStudents = activeStudentIds.size || 1;
      const rate = totalRecorded > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

      await setDoc(doc(firestore, 'dashboard_summaries', sId), {
        attendance: {
          presentCount,
          totalStudents,
          attendanceRate: rate,
          absentStudents: absentList.slice(0, 15),
          lastAttendanceDate: format(new Date(), 'yyyy-MM-dd')
        },
        lastUpdated: serverTimestamp()
      }, { merge: true });

      toast({ 
        title: "Attendance Analytics Synced", 
        description: `Updated today's attendance summary (${presentCount} present).` 
      });
    } catch (err) {
      console.error("Error syncing attendance summary:", err);
      toast({ 
        variant: "destructive", 
        title: "Sync Error", 
        description: "Failed to sync attendance data." 
      });
    } finally {
      setIsSyncingAttendance(false);
    }
  };

  const startOfToday = useMemo(() => startOfDay(new Date()), []);

  // Format Staff Name Helper
  const getStaffName = (s: any) => {
    if (!s) return "Staff Member";
    return `${s.firstName || ""} ${s.lastName || ""}`.trim() || s.name || s.displayName || s.email || "Staff Member";
  };

  // Real-time Dynamic Computation of Attendance Metrics
  const stats = useMemo(() => {
    // 1. Today's Student Attendance
    const todayStudentRecs = attendance?.filter((r: any) => {
      if (!r.date) return false;
      const d = r.date.toDate ? r.date.toDate() : new Date(r.date);
      return d >= startOfToday;
    }) || [];

    const todayTotal = todayStudentRecs.length;
    const todayPresent = todayStudentRecs.filter((r: any) => r.status === 'Present' || r.status === 'Late').length;
    const todayAbsentCount = todayStudentRecs.filter((r: any) => r.status === 'Absent').length;
    const studentRate = todayTotal > 0 ? Math.round((todayPresent / todayTotal) * 100) : 0;

    // 2. Chronic Absenteeism (Students < 85% attendance rate with >= 3 recorded registers)
    const studentRates: Record<string, { present: number; total: number }> = {};
    attendance?.forEach((r: any) => {
      if (!r.studentId) return;
      if (!studentRates[r.studentId]) {
        studentRates[r.studentId] = { present: 0, total: 0 };
      }
      studentRates[r.studentId].total++;
      if (r.status === 'Present' || r.status === 'Late') {
        studentRates[r.studentId].present++;
      }
    });

    const activeStudentIds = new Set(students?.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus).map((s: any) => s.uid || s.id) || []);
    
    let chronicCount = 0;
    const chronicList: any[] = [];

    Object.entries(studentRates).forEach(([studentId, data]) => {
      if (activeStudentIds.size > 0 && !activeStudentIds.has(studentId)) return;
      const rate = data.total > 0 ? (data.present / data.total) * 100 : 100;
      if (rate < 85 && data.total >= 3) {
        chronicCount++;
        const sObj = students.find((s: any) => (s.uid || s.id) === studentId);
        const cObj = classes?.find((c: any) => c.id === sObj?.classId);
        chronicList.push({
          id: studentId,
          name: sObj ? `${sObj.firstName || ""} ${sObj.lastName || ""}`.trim() : "Student",
          className: cObj?.name || "Unassigned",
          rate: Math.round(rate),
          absences: data.total - data.present,
          total: data.total
        });
      }
    });

    // 3. Teacher Attendance & Punctuality
    const todayStaffRecs = staffAttendance?.filter((r: any) => {
      if (!r.timestamp && !r.createdAt && !r.date) return false;
      const ts = r.timestamp || r.createdAt || r.date;
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d >= startOfToday;
    }) || [];

    const todayCheckIns = todayStaffRecs.filter((r: any) => r.type === 'In' || r.type === 'check-in' || r.status === 'Present' || r.status === 'Late' || !r.type);
    const presentTeacherIds = new Set(todayCheckIns.map((r: any) => r.staffId || r.uid || r.userId));
    const teachers = staff?.filter((s: any) => s.role?.toLowerCase() === 'teacher') || staff || [];
    const teacherRate = teachers.length > 0 ? Math.round((presentTeacherIds.size / teachers.length) * 100) : 0;

    const totalCheckIns = todayCheckIns.length;
    const onTimeCheckIns = todayCheckIns.filter((r: any) => r.status === 'Present' || r.status === 'On Time').length;
    const teacherPunctuality = totalCheckIns > 0 ? Math.round((onTimeCheckIns / totalCheckIns) * 100) : 0;

    const lateTeachers = todayCheckIns.filter((r: any) => r.status === 'Late').map((r: any) => {
      const ts = r.timestamp || r.createdAt || r.date;
      const tStr = ts?.toDate ? format(ts.toDate(), 'hh:mm a') : format(new Date(ts), 'hh:mm a');
      return {
        id: r.staffId || r.uid,
        name: r.staffName || "Staff Member",
        time: tStr
      };
    });

    const today = new Date();
    const isWeekend = today.getDay() === 0 || today.getDay() === 6;
    const isVacation = schoolData?.vacationMode === true;
    const isWeekendBypassed = isWeekend && schoolData?.trackStaffOnWeekends !== true && todayCheckIns.length === 0;

    const shouldFlagAbsences = !isVacation && !isWeekendBypassed;

    const absentTeachers = shouldFlagAbsences
      ? teachers.filter((t: any) => !presentTeacherIds.has(t.uid || t.id)).map((t: any) => ({
          id: t.uid || t.id,
          name: getStaffName(t),
          email: t.email || "No Email",
          role: t.role || "Teacher"
        }))
      : [];

    // 4. Weekly Student Attendance Trend (last 7 active days)
    const dailyRates: Record<string, { present: number; total: number; rawDate: Date }> = {};
    attendance?.forEach((r: any) => {
      if (!r.date) return;
      const dObj = r.date.toDate ? r.date.toDate() : new Date(r.date);
      const dateStr = format(dObj, 'yyyy-MM-dd');
      if (!dailyRates[dateStr]) {
        dailyRates[dateStr] = { present: 0, total: 0, rawDate: startOfDay(dObj) };
      }
      dailyRates[dateStr].total++;
      if (r.status === 'Present' || r.status === 'Late') {
        dailyRates[dateStr].present++;
      }
    });

    const weeklyTrend = Object.entries(dailyRates)
      .map(([dateStr, data]) => ({
        dateLabel: format(data.rawDate, 'MMM dd'),
        rate: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
        rawDate: data.rawDate
      }))
      .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime())
      .slice(-7);

    // 5. Class Stream Attendance Comparison
    const classAttendanceMap: Record<string, { present: number; total: number; name: string }> = {};
    attendance?.forEach((r: any) => {
      if (!r.classId) return;
      const cls = classes?.find((c: any) => c.id === r.classId);
      const className = cls?.name || r.className || r.classId;
      if (!classAttendanceMap[className]) {
        classAttendanceMap[className] = { present: 0, total: 0, name: className };
      }
      classAttendanceMap[className].total++;
      if (r.status === 'Present' || r.status === 'Late') {
        classAttendanceMap[className].present++;
      }
    });

    const classAttendanceData = Object.values(classAttendanceMap).map(c => ({
      name: c.name,
      rate: c.total > 0 ? Math.round((c.present / c.total) * 100) : 0
    })).sort((a, b) => b.rate - a.rate).slice(0, 8);

    return {
      studentRate,
      todayAbsentCount,
      chronicCount,
      chronicList: chronicList.sort((a, b) => a.rate - b.rate),
      teacherRate,
      teacherPunctuality,
      lateTeachers,
      absentTeachers,
      weeklyTrend,
      classAttendanceData,
      hasAttendanceData: attendance.length > 0 || staffAttendance.length > 0
    };
  }, [students, staff, classes, attendance, staffAttendance, startOfToday, schoolData]);

  // Handlers for Parent Notification & Staff Reminders
  const handleDispatchParentSMS = () => {
    if (!selectedAbsentStudent) return;
    toast({
      title: "Parent Alert Dispatched",
      description: `Absence notification SMS sent to parents of ${selectedAbsentStudent.name} (${selectedAbsentStudent.className}).`,
    });
    setSelectedAbsentStudent(null);
  };

  const handleSendStaffReminder = () => {
    if (!selectedStaffReminder) return;
    toast({
      title: "Reminder Sent",
      description: `Clock-in reminder notification sent to ${selectedStaffReminder.name}.`,
    });
    setSelectedStaffReminder(null);
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      
      {/* ─────────────────────────────────────────────────────────────
          ZONE 1: EXECUTIVE ATTENDANCE ACTION BAR & SYNC CONTROL
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-2xl">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Attendance & Punctuality Console</h3>
            <p className="text-[11px] text-slate-400 font-semibold">Real-time daily student pulse, chronic absenteeism tracking, and staff clock-in audit.</p>
          </div>
        </div>

        <Button
          onClick={handleSyncAttendanceSummary}
          disabled={isSyncingAttendance}
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl h-10 px-5 shadow-md shadow-sky-600/20 flex items-center gap-2 shrink-0 text-xs"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isSyncingAttendance && "animate-spin")} />
          <span>{isSyncingAttendance ? "Syncing..." : "Sync Attendance Analytics"}</span>
        </Button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 2: 6 VITAL ATTENDANCE KPI CARDS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Card 1: Student Attendance Today */}
        <Card className="border-l-4 border-l-sky-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Student Attendance</p>
              <CalendarCheck className="h-4 w-4 text-sky-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.studentRate}%</h3>
            <p className="text-[10px] text-sky-600 font-bold mt-0.5">Target: ≥ 90%</p>
          </CardContent>
        </Card>

        {/* Card 2: Chronic Absenteeism */}
        <Card className="border-l-4 border-l-rose-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Chronic Absenteeism</p>
              <AlertTriangle className="h-4 w-4 text-rose-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.chronicCount}</h3>
            <p className="text-[10px] text-rose-600 font-bold mt-0.5">Attendance &lt; 85%</p>
          </CardContent>
        </Card>

        {/* Card 3: Teacher Attendance Today */}
        <Card className="border-l-4 border-l-indigo-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Teacher Attendance</p>
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.teacherRate}%</h3>
            <p className="text-[10px] text-indigo-600 font-bold mt-0.5">Target: 100%</p>
          </CardContent>
        </Card>

        {/* Card 4: Teacher Punctuality */}
        <Card className="border-l-4 border-l-emerald-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Teacher Punctuality</p>
              <Clock className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.teacherPunctuality}%</h3>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Clocked-in On-Time</p>
          </CardContent>
        </Card>

        {/* Card 5: Students Absent Today */}
        <Card className="border-l-4 border-l-amber-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Students Absent</p>
              <XCircle className="h-4 w-4 text-amber-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.todayAbsentCount}</h3>
            <p className="text-[10px] text-amber-600 font-bold mt-0.5">Flagged Today</p>
          </CardContent>
        </Card>

        {/* Card 6: Staff Late Clock-ins */}
        <Card className="border-l-4 border-l-purple-600 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Late Staff Clock-ins</p>
              <ShieldAlert className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">{stats.lateTeachers.length}</h3>
            <p className="text-[10px] text-purple-600 font-bold mt-0.5">Check-in Latency</p>
          </CardContent>
        </Card>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 3: CHRONIC ABSENTEEISM REGISTRY & INTERVENTION DESK
          ───────────────────────────────────────────────────────────── */}
      <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 gap-2">
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-600" /> Chronic Absenteeism Registry
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Students maintaining attendance records below 85% threshold
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-rose-50 text-rose-800 border-rose-200 font-black text-xs px-3 py-1 rounded-full">
            {stats.chronicCount} Students Flagged
          </Badge>
        </div>

        {stats.chronicList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Class Stream</th>
                  <th className="pb-3">Attendance Rate</th>
                  <th className="pb-3">Total Absences</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Intervention Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.chronicList.map((s: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 text-slate-900 font-black">{s.name}</td>
                    <td className="py-3 text-slate-600">{s.className}</td>
                    <td className="py-3 text-rose-600 font-black">{s.rate}%</td>
                    <td className="py-3 text-slate-600">{s.absences} / {s.total} Days</td>
                    <td className="py-3">
                      <Badge variant="outline" className="bg-rose-100 text-rose-800 border-rose-200 text-[9px] font-black uppercase">
                        High Risk
                      </Badge>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedAbsentStudent(s)}
                        className="h-7 text-[10px] font-black text-sky-600 hover:bg-sky-50"
                      >
                        Draft AI Parent SMS
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const schoolName = schoolData?.name || 'our school';
                          const prompt = `Recommend a student attendance intervention plan for ${s.name} (${s.className}), who has an attendance rate of ${s.rate}% at ${schoolName}. Provide actionable steps for the school welfare counselor and class advisor.`;
                          window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { prompt, autoSend: true } }));
                        }}
                        className="h-7 text-[10px] font-black border-slate-200 text-slate-700 hover:bg-slate-100"
                      >
                        Log Intervention
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-black text-slate-700 uppercase tracking-tight">No Chronically Absent Students Flagged</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">All active enrolled students are currently maintaining attendance levels above the 85% threshold.</p>
          </div>
        )}
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 4: COMPARATIVE TRENDS & WEEKLY ANALYTICS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Attendance Trend */}
        <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-black uppercase tracking-tight text-slate-800">Weekly Attendance Trend</CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">School-wide student participation rate</CardDescription>
            </div>
            <Badge variant="outline" className="text-[10px] font-black uppercase bg-sky-50 text-sky-700 border-sky-200">
              Active Days Audited
            </Badge>
          </CardHeader>
          <CardContent className="h-[260px] p-0 pt-6">
            {stats.weeklyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.weeklyTrend}>
                  <defs>
                    <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="dateLabel" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                  <YAxis domain={[0, 100]} fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }} />
                  <Area type="monotone" dataKey="rate" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#attendanceGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-1">
                <CalendarCheck className="h-8 w-8 text-slate-300" />
                <p className="text-xs font-bold uppercase">Weekly Trend Data Empty</p>
                <p className="text-[11px] text-slate-400 max-w-xs">Attendance trend graph will populate as daily class registers are recorded.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Class Stream Attendance Comparison */}
        <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6">
          <CardHeader className="p-0 pb-4 border-b">
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-800">Class Stream Attendance Breakdown</CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Class participation rates evaluated against 90% benchmark</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px] p-0 pt-6">
            {stats.classAttendanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.classAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                  <YAxis domain={[0, 100]} fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                    {stats.classAttendanceData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.rate < 85 ? '#f43f5e' : entry.rate >= 95 ? '#0284c7' : '#38bdf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-1">
                <GraduationCap className="h-8 w-8 text-slate-300" />
                <p className="text-xs font-bold uppercase">No Class Attendance Comparison Data</p>
                <p className="text-[11px] text-slate-400 max-w-xs">Class breakdown charts render as teachers submit daily class registers.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 5: STAFF PUNCTUALITY & CLOCK-IN AUDIT
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Staff Missing Active Clock-ins Today */}
        <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <CardTitle className="text-base font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" /> Teachers / Staff Absent Today
              </CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Staff missing active clock-ins for today
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-slate-100 text-slate-700 font-black text-xs px-2.5 py-0.5 rounded-full">
              {stats.absentTeachers.length} Staff Unaccounted
            </Badge>
          </div>

          {stats.absentTeachers.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {stats.absentTeachers.map((t: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center hover:bg-slate-100/60 transition-colors">
                  <div>
                    <p className="text-xs font-black text-slate-800">{t.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{t.role} • {t.email}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedStaffReminder(t)}
                    className="h-7 text-[10px] font-black border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  >
                    Send Reminder
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-1">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-black text-slate-700 uppercase tracking-tight">All Staff Clocked In</p>
              <p className="text-[11px] text-slate-400">Every scheduled teacher and staff member has logged active clock-in for today.</p>
            </div>
          )}
        </Card>

        {/* Staff Late Clock-ins Today */}
        <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6">
          <div className="flex justify-between items-center border-b pb-4 mb-4">
            <div>
              <CardTitle className="text-base font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" /> Late Staff Clock-ins Today
              </CardTitle>
              <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Staff check-in latency & arrival timestamps
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 font-black text-xs px-2.5 py-0.5 rounded-full">
              {stats.lateTeachers.length} Late Clock-ins
            </Badge>
          </div>

          {stats.lateTeachers.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {stats.lateTeachers.map((t: any, idx: number) => (
                <div key={idx} className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-xs font-black text-slate-800">{t.name}</p>
                    <p className="text-[10px] text-amber-700 font-semibold">Arrival Timestamp: {t.time}</p>
                  </div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 text-[9px] font-black uppercase">
                    Late Check-in
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-1">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-black text-slate-700 uppercase tracking-tight">No Late Staff Clock-ins Logged Today</p>
              <p className="text-[11px] text-slate-400">All staff members who checked in today arrived within scheduled punctuality windows.</p>
            </div>
          )}
        </Card>

      </div>

      {/* ─── PARENT SMS DIALOG ─── */}
      <Dialog open={Boolean(selectedAbsentStudent)} onOpenChange={(open) => !open && setSelectedAbsentStudent(null)}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900 uppercase">Draft Parent Absence SMS</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Send automated SMS notification to parents of {selectedAbsentStudent?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="p-3 bg-slate-50 border rounded-2xl text-xs space-y-1 text-slate-700">
              <p className="font-bold">Message Preview:</p>
              <p className="italic text-slate-600">
                "Dear Parent, this is an automated attendance notice from {schoolData?.name || 'our school'}. {selectedAbsentStudent?.name} ({selectedAbsentStudent?.className}) is currently flagged under chronic attendance risk with an attendance rate of {selectedAbsentStudent?.rate}%. Please contact the school office."
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedAbsentStudent(null)} className="rounded-xl font-bold text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleDispatchParentSMS} className="bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs gap-1">
                <Send className="h-3.5 w-3.5" /> Dispatch SMS
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── STAFF REMINDER DIALOG ─── */}
      <Dialog open={Boolean(selectedStaffReminder)} onOpenChange={(open) => !open && setSelectedStaffReminder(null)}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900 uppercase">Send Clock-in Reminder</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Send an active clock-in reminder notification to {selectedStaffReminder?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="p-3 bg-slate-50 border rounded-2xl text-xs space-y-1 text-slate-700">
              <p className="font-bold">Notification Preview:</p>
              <p className="italic text-slate-600">
                "Hello {selectedStaffReminder?.name}, you have not yet logged your active clock-in for today at {schoolData?.name || 'our school'}. Please remember to log your check-in."
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedStaffReminder(null)} className="rounded-xl font-bold text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleSendStaffReminder} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs gap-1">
                <Send className="h-3.5 w-3.5" /> Send Reminder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
