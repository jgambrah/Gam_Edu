'use client';

import React, { useState, useMemo } from 'react';
import { 
  CalendarCheck, Clock, Users, AlertTriangle, AlertCircle, RefreshCw, 
  CheckCircle2, XCircle, UserCheck, ShieldAlert, Sparkles, Send, FileText, 
  ChevronRight, ArrowUpRight, TrendingUp, GraduationCap, Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { sendStudentParentSMSAction, sendStaffSMSAction } from '@/app/actions/sms';
import { generateSMSDraftAction } from '@/app/actions/sms-ai';
import { buildRows, computeStudentFlags, dailyRates, toDateStr, windowStartStr, HISTORY_DAYS, CHRONIC_RATE, ABSENT_STREAK_MIN, LATE_MIN_COUNT } from '@/lib/attendance-flags';
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
  const { user } = useUser();
  const { schoolId: currentSchoolId } = useCurrentSchool();
  const historySchoolId = currentSchoolId || schoolData?.id || schoolData?.schoolId;

  // The last 30 days of CLASS REGISTERS (one document per class per day, each holding every student's status).
  // The dashboard itself only loads today's records, which can never show who is absent or late over time.
  // Uses the existing (schoolId, dateStr) index; per-student records have no dateStr so they are not read here.
  const todayStr = toDateStr(new Date());
  const historyQuery = useMemoFirebase(() => {
    if (!firestore || !historySchoolId) return null;
    return query(
      collection(firestore, 'attendance'),
      where('schoolId', '==', historySchoolId),
      where('dateStr', '>=', windowStartStr(new Date(), HISTORY_DAYS)),
      where('dateStr', '<=', todayStr),
    );
  }, [firestore, historySchoolId, todayStr]);
  const { data: historyDocs, isLoading: isLoadingHistory, error: historyError } = useCollection<any>(historyQuery);

  // One row per student per day: the registers plus today's per-student records (e.g. biometric scans).
  const attendanceRows = useMemo(() => buildRows([...(historyDocs || []), ...attendance]), [historyDocs, attendance]);
  const flags = useMemo(() => computeStudentFlags(attendanceRows, { students, classes }), [attendanceRows, students, classes]);
  const { toast } = useToast();
  const [isSyncingAttendance, setIsSyncingAttendance] = useState(false);
  const [selectedAbsentStudent, setSelectedAbsentStudent] = useState<any | null>(null);
  const [smsKind, setSmsKind] = useState<'absence' | 'late'>('absence');
  const [smsDraft, setSmsDraft] = useState('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [selectedStaffReminder, setSelectedStaffReminder] = useState<any | null>(null);
  const [staffReminderDraft, setStaffReminderDraft] = useState('');
  const [isSendingStaffSms, setIsSendingStaffSms] = useState(false);

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
    // From the merged rows: class registers carry no studentId/status of their own and used to be counted as
    // blank records, which dragged the rate down.
    const todayStudentRecs = attendanceRows.filter((r) => r.dateStr === todayStr);

    const todayTotal = todayStudentRecs.length;
    const todayPresent = todayStudentRecs.filter((r: any) => r.status === 'Present' || r.status === 'Late').length;
    const todayAbsentCount = todayStudentRecs.filter((r: any) => r.status === 'Absent').length;
    const studentRate = todayTotal > 0 ? Math.round((todayPresent / todayTotal) * 100) : 0;

    // 2. Chronic absence / absence streaks / punctuality — computed from the last 30 days (see attendance-flags.ts)
    const chronicList = flags.absence;
    const chronicCount = flags.absence.length;

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
          phone: t.phone || t.phoneNumber || t.mobile || t.contact || t.telephone || "",
          role: t.role || "Teacher"
        }))
      : [];

    // 4. Weekly Student Attendance Trend (last 7 recorded days)
    const weeklyTrend = dailyRates(attendanceRows, 7).map(d => {
      const rawDate = new Date(`${d.dateStr}T00:00:00`);
      return { dateLabel: format(rawDate, 'MMM dd'), rate: d.rate, rawDate };
    });

    // 5. Class Stream Attendance Comparison
    const classAttendanceMap: Record<string, { present: number; total: number; name: string }> = {};
    attendanceRows.forEach((r) => {
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
      chronicList,
      teacherRate,
      teacherPunctuality,
      lateTeachers,
      absentTeachers,
      weeklyTrend,
      classAttendanceData,
      hasAttendanceData: attendanceRows.length > 0 || attendance.length > 0 || staffAttendance.length > 0
    };
  }, [students, staff, classes, attendance, attendanceRows, flags, todayStr, staffAttendance, startOfToday, schoolData]);

  // Build default SMS text for a flagged student
  const buildDefaultParentSms = (student: any, kind: 'absence' | 'late') => {
    const schoolName = schoolData?.name || 'our school';
    if (kind === 'late') {
      return `Dear Parent, this is a punctuality notice from ${schoolName}. ${student.name} (${student.className}) has arrived late ${student.lateCount} times in the last ${HISTORY_DAYS} days. Please help ensure timely arrival.`;
    }
    if (student.streak >= ABSENT_STREAK_MIN) {
      return `Dear Parent, this is an attendance notice from ${schoolName}. ${student.name} (${student.className}) has been absent for ${student.streak} consecutive school days (${student.rate}% attendance rate). Please contact the school office.`;
    }
    return `Dear Parent, this is an attendance notice from ${schoolName}. ${student.name} (${student.className}) currently has an attendance rate of ${student.rate}% (${student.absences}/${student.total} days absent). Please contact the school office.`;
  };

  const openParentSmsDialog = (student: any, kind: 'absence' | 'late' = 'absence') => {
    setSmsKind(kind);
    setSelectedAbsentStudent(student);
    setSmsDraft(buildDefaultParentSms(student, kind));
  };

  const handleGenerateAiDraft = async () => {
    if (!selectedAbsentStudent) return;
    setIsGeneratingDraft(true);
    try {
      const schoolName = schoolData?.name || 'our school';
      const topic = smsKind === 'late'
        ? `Punctuality follow-up from ${schoolName} for ${selectedAbsentStudent.name} (${selectedAbsentStudent.className}), late ${selectedAbsentStudent.lateCount} times in ${HISTORY_DAYS} days`
        : selectedAbsentStudent.streak >= ABSENT_STREAK_MIN
          ? `Urgent absence notice from ${schoolName} for ${selectedAbsentStudent.name} (${selectedAbsentStudent.className}), absent ${selectedAbsentStudent.streak} consecutive days (${selectedAbsentStudent.rate}% attendance)`
          : `Attendance notice from ${schoolName} for ${selectedAbsentStudent.name} (${selectedAbsentStudent.className}), attendance rate at ${selectedAbsentStudent.rate}% (${selectedAbsentStudent.absences} absences)`;
      const res = await generateSMSDraftAction(topic, 'formal');
      if (res.success && res.text) {
        setSmsDraft(res.text.trim());
      } else {
        toast({ variant: 'destructive', title: 'AI Draft Failed', description: res.error || 'Could not generate AI draft.' });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'AI Draft Error', description: err.message || 'Could not generate AI draft.' });
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  // Handlers for Parent Notification & Staff Reminders (real SMS gateway delivery)
  const handleDispatchParentSMS = async () => {
    if (!selectedAbsentStudent || !smsDraft.trim()) return;
    if (!historySchoolId) {
      toast({ variant: 'destructive', title: 'Missing School Context', description: 'Cannot determine school ID for SMS routing.' });
      return;
    }
    setIsSendingSms(true);
    try {
      const idToken = await user?.getIdToken();
      const res = await sendStudentParentSMSAction({
        schoolId: historySchoolId,
        studentId: selectedAbsentStudent.id,
        studentName: selectedAbsentStudent.name,
        message: smsDraft.trim(),
        type: smsKind === 'late' ? 'PUNCTUALITY_ALERT' : 'ATTENDANCE_ALERT',
        idToken,
      });
      if (res.success) {
        toast({
          title: 'Parent SMS Sent',
          description: `Delivered to parent of ${selectedAbsentStudent.name} (${res.phones?.join(', ')}).`,
        });
        setSelectedAbsentStudent(null);
      } else {
        toast({
          variant: 'destructive',
          title: 'SMS Not Sent',
          description: res.error || 'Could not deliver SMS to parent.',
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'SMS Error',
        description: err.message || 'An unexpected error occurred while sending SMS.',
      });
    } finally {
      setIsSendingSms(false);
    }
  };

  const openStaffReminderDialog = (staffMember: any) => {
    const schoolName = schoolData?.name || 'our school';
    setSelectedStaffReminder(staffMember);
    setStaffReminderDraft(`Hello ${staffMember.name}, you have not yet logged your active clock-in for today at ${schoolName}. Please remember to log your check-in.`);
  };

  const handleSendStaffReminder = async () => {
    if (!selectedStaffReminder || !staffReminderDraft.trim()) return;
    if (!historySchoolId) {
      toast({ variant: 'destructive', title: 'Missing School Context', description: 'Cannot determine school ID for SMS routing.' });
      return;
    }
    setIsSendingStaffSms(true);
    try {
      const idToken = await user?.getIdToken();
      const res = await sendStaffSMSAction({
        schoolId: historySchoolId,
        staffId: selectedStaffReminder.id,
        staffName: selectedStaffReminder.name,
        phone: selectedStaffReminder.phone,
        message: staffReminderDraft.trim(),
        type: 'STAFF_CLOCKIN_REMINDER',
        idToken,
      });
      if (res.success) {
        toast({
          title: 'Reminder SMS Sent',
          description: `Clock-in reminder delivered to ${selectedStaffReminder.name} (${res.phones?.join(', ')}).`,
        });
        setSelectedStaffReminder(null);
      } else {
        toast({
          variant: 'destructive',
          title: 'Reminder Not Sent',
          description: res.error || 'Could not deliver SMS reminder to staff member.',
        });
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'SMS Error',
        description: err.message || 'An unexpected error occurred while sending reminder.',
      });
    } finally {
      setIsSendingStaffSms(false);
    }
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
              Below {CHRONIC_RATE}% attendance, or absent {ABSENT_STREAK_MIN}+ days in a row — last {HISTORY_DAYS} days
              {isLoadingHistory ? ' · loading…' : historyError ? ' · history unavailable' : ` · ${flags.daysCovered} school day${flags.daysCovered === 1 ? '' : 's'} recorded`}
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
                  <th className="pb-3">Absences</th>
                  <th className="pb-3">Latest</th>
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
                    <td className="py-3 text-slate-600">
                      {s.streak >= ABSENT_STREAK_MIN
                        ? <span className="text-rose-600 font-black">Absent {s.streak} days running</span>
                        : s.lastAbsent ? `Last absent ${format(new Date(`${s.lastAbsent}T00:00:00`), 'MMM dd')}` : '—'}
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className={cn("text-[9px] font-black uppercase", s.severity === 'critical' ? "bg-rose-100 text-rose-800 border-rose-200" : "bg-amber-100 text-amber-800 border-amber-200")}>
                        {s.severity === 'critical' ? 'Critical' : 'High Risk'}
                      </Badge>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openParentSmsDialog(s, 'absence')}
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
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isLoadingHistory
                ? 'Loading the last 30 days of class registers…'
                : historyError
                  ? 'The attendance history could not be loaded, so nobody can be flagged right now. Please refresh; if this continues, contact support.'
                : flags.daysCovered < 3
                  ? `Only ${flags.daysCovered} day${flags.daysCovered === 1 ? '' : 's'} of class registers found in the last ${HISTORY_DAYS} days — students are rated once they have at least 3 recorded days.`
                  : `No student is below ${CHRONIC_RATE}% attendance or absent ${ABSENT_STREAK_MIN}+ days running over the last ${HISTORY_DAYS} days.`}
            </p>
          </div>
        )}
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          ZONE 3B: STUDENT PUNCTUALITY WATCH (repeated late arrivals)
          ───────────────────────────────────────────────────────────── */}
      <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 gap-2">
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" /> Punctuality Watch
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Students late {LATE_MIN_COUNT}+ times in the last {HISTORY_DAYS} days
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 font-black text-xs px-3 py-1 rounded-full">
            {flags.late.length} Student{flags.late.length === 1 ? '' : 's'} Flagged
          </Badge>
        </div>

        {flags.late.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Class Stream</th>
                  <th className="pb-3">Times Late</th>
                  <th className="pb-3">Share of Days Attended</th>
                  <th className="pb-3">Last Late</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {flags.late.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50">
                    <td className="py-3 text-slate-900 font-black">{l.name}</td>
                    <td className="py-3 text-slate-600">{l.className}</td>
                    <td className="py-3 text-amber-700 font-black">{l.lateCount}</td>
                    <td className="py-3 text-slate-600">{l.lateRate}%</td>
                    <td className="py-3 text-slate-600">{l.lastLate ? format(new Date(`${l.lastLate}T00:00:00`), 'MMM dd') : '—'}</td>
                    <td className="py-3">
                      <Badge variant="outline" className={cn("text-[9px] font-black uppercase", l.severity === 'high' ? "bg-rose-100 text-rose-800 border-rose-200" : "bg-amber-100 text-amber-800 border-amber-200")}>
                        {l.severity === 'high' ? 'Frequently Late' : 'Watch'}
                      </Badge>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openParentSmsDialog(l, 'late')}
                        className="h-7 text-[10px] font-black text-sky-600 hover:bg-sky-50"
                      >
                        Draft AI Parent SMS
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const schoolName = schoolData?.name || 'our school';
                          const prompt = `Recommend a punctuality follow-up plan for ${l.name} (${l.className}), who arrived late ${l.lateCount} times in the last ${HISTORY_DAYS} days (${l.lateRate}% of the days attended) at ${schoolName}. Suggest how the school should speak with the parents and practical steps to improve arrival time.`;
                          window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { prompt, autoSend: true } }));
                        }}
                        className="h-7 text-[10px] font-black border-slate-200 text-slate-700 hover:bg-slate-100"
                      >
                        Plan Follow-up
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-black text-slate-700 uppercase tracking-tight">No Punctuality Concerns</p>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isLoadingHistory ? 'Loading the last 30 days of class registers…' : historyError ? 'The attendance history could not be loaded, so nobody can be flagged right now. Please refresh.' : `No student has been marked late ${LATE_MIN_COUNT} or more times in the last ${HISTORY_DAYS} days.`}
            </p>
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
                    onClick={() => openStaffReminderDialog(t)}
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
      <Dialog open={Boolean(selectedAbsentStudent)} onOpenChange={(open) => !open && !isSendingSms && setSelectedAbsentStudent(null)}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900 uppercase">
              {smsKind === 'late' ? 'Send Parent Punctuality SMS' : 'Send Parent Absence SMS'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Review, edit, or regenerate with AI before sending to the parent of {selectedAbsentStudent?.name} ({selectedAbsentStudent?.className}).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600">SMS Message ({smsDraft.length} chars)</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isGeneratingDraft || isSendingSms}
                onClick={handleGenerateAiDraft}
                className="h-7 text-[10px] font-black border-sky-200 text-sky-700 hover:bg-sky-50 rounded-xl gap-1"
              >
                {isGeneratingDraft ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {isGeneratingDraft ? 'Drafting…' : 'Draft with AI'}
              </Button>
            </div>
            <Textarea
              value={smsDraft}
              onChange={(e) => setSmsDraft(e.target.value)}
              rows={4}
              disabled={isSendingSms}
              className="rounded-2xl text-xs text-slate-800 bg-slate-50 border-slate-200"
              placeholder="Write SMS message to parent…"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" disabled={isSendingSms} onClick={() => setSelectedAbsentStudent(null)} className="rounded-xl font-bold text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isSendingSms || !smsDraft.trim()}
                onClick={handleDispatchParentSMS}
                className="bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs gap-1"
              >
                {isSendingSms ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                {isSendingSms ? 'Sending…' : 'Send SMS'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── STAFF REMINDER DIALOG ─── */}
      <Dialog open={Boolean(selectedStaffReminder)} onOpenChange={(open) => !open && !isSendingStaffSms && setSelectedStaffReminder(null)}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black text-slate-900 uppercase">Send Clock-in Reminder SMS</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Send an SMS clock-in reminder to {selectedStaffReminder?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <Textarea
              value={staffReminderDraft}
              onChange={(e) => setStaffReminderDraft(e.target.value)}
              rows={3}
              disabled={isSendingStaffSms}
              className="rounded-2xl text-xs text-slate-800 bg-slate-50 border-slate-200"
              placeholder="Write reminder SMS…"
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" disabled={isSendingStaffSms} onClick={() => setSelectedStaffReminder(null)} className="rounded-xl font-bold text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isSendingStaffSms || !staffReminderDraft.trim()}
                onClick={handleSendStaffReminder}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs gap-1"
              >
                {isSendingStaffSms ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                {isSendingStaffSms ? 'Sending…' : 'Send SMS Reminder'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
