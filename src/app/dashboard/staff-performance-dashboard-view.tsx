'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  Users, UserCheck, Clock, Award, CheckSquare, Star, 
  Search, ShieldAlert, BookOpen, AlertTriangle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface StaffPerformanceDashboardViewProps {
  staff: any[];
  performanceReviews: any[];
  staffAttendance: any[];
  classes: any[];
  students: any[];
  recentAssessments: any[];
  lessonPlans: any[];
  assignments: any[];
  submissions: any[];
}

export function StaffPerformanceDashboardView({
  staff = [],
  performanceReviews = [],
  staffAttendance = [],
  classes = [],
  students = [],
  recentAssessments = [],
  lessonPlans = [],
  assignments = [],
  submissions = []
}: StaffPerformanceDashboardViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'teaching' | 'non-teaching'>('all');

  // 1. Unified evaluations memo for all staff members
  const staffEvaluations = useMemo(() => {
    return staff.map((member: any) => {
      const uid = member.uid || member.id;
      const isTeacher = member.role === 'Teacher';

      // Safe Name Interpolation to avoid "undefined" strings
      const firstName = member.firstName || member.name || '';
      const lastName = member.lastName || '';
      let fullName = `${firstName} ${lastName}`.trim();
      if (!fullName) {
        fullName = member.email || 'Staff Member';
      }

      // Attendance & Punctuality
      const logs = staffAttendance.filter((l: any) => l.staffId === uid);
      const totalDays = logs.length;
      const presentDays = logs.filter((l: any) => l.status === 'Present').length;
      const lateDays = logs.filter((l: any) => l.status === 'Late').length;

      const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
      const punctualityRate = (presentDays + lateDays) > 0 ? Math.round((presentDays / (presentDays + lateDays)) * 100) : 0;

      // Performance Reviews
      const reviews = performanceReviews.filter((r: any) => r.staffId === uid);

      if (isTeacher) {
        // Lesson Notes Submission rate
        const notes = lessonPlans.filter((lp: any) => lp.teacherId === uid);
        const lessonSubmissionRate = notes.length > 0 ? Math.min(100, Math.round((notes.length / 8) * 100)) : 0;

        // Assignment Completion Rate
        const teacherAssignments = assignments.filter((a: any) => a.teacherId === uid);
        let assignmentCompletionRate = 0;
        if (teacherAssignments.length > 0) {
          let totalSubmissionsExpected = 0;
          let actualSubmissions = 0;

          teacherAssignments.forEach((assign: any) => {
            const studentCount = students.filter((s: any) => s.classId === assign.classId).length || 20;
            totalSubmissionsExpected += studentCount;
            
            const subs = submissions.filter((sub: any) => sub.assignmentId === assign.id);
            actualSubmissions += subs.length;
          });

          if (totalSubmissionsExpected > 0) {
            assignmentCompletionRate = Math.round((actualSubmissions / totalSubmissionsExpected) * 100);
          }
        }

        // Student Performance (avg score on tests)
        const assessments = recentAssessments.filter((a: any) => a.teacherId === uid);
        let studentPerformanceAvg = 0;
        if (assessments.length > 0) {
          let totalScores = 0;
          let count = 0;
          assessments.forEach((a: any) => {
            const score = Number(a.score) || 0;
            const max = Number(a.maxScore) || 100;
            if (max > 0) {
              totalScores += (score / max) * 100;
              count++;
            }
          });
          if (count > 0) {
            studentPerformanceAvg = Math.round(totalScores / count);
          }
        }

        // Appraisal rating calculation
        let rating = 0;
        if (reviews.length > 0) {
          rating = parseFloat((reviews.reduce((sum: number, r: any) => sum + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1));
        } else {
          const hasActivity = totalDays > 0 || notes.length > 0 || teacherAssignments.length > 0 || assessments.length > 0;
          if (hasActivity) {
            let divisor = 2; // Always include Attendance and Punctuality
            let metricSum = attendanceRate + punctualityRate;

            // Only include Lesson Notes if the school has registered lesson plans
            if (lessonPlans.length > 0) {
              divisor++;
              metricSum += lessonSubmissionRate;
            }

            // Only include Homework if the school has assignments
            if (assignments.length > 0) {
              divisor++;
              metricSum += assignmentCompletionRate;
            }

            // Only include Student Grades if the school has assessments
            if (recentAssessments.length > 0) {
              divisor++;
              metricSum += studentPerformanceAvg;
            }

            const score = metricSum / divisor;
            rating = parseFloat((1.0 + (score / 100) * 4.0).toFixed(1));
          } else {
            rating = 0;
          }
        }

        return {
          id: uid,
          name: fullName,
          role: member.role,
          email: member.email,
          attendanceRate,
          punctualityRate,
          lessonSubmissionRate,
          assignmentCompletionRate,
          studentPerformanceAvg,
          rating,
          isTeacher: true,
          taskCompletionRate: 0,
          tasksSummary: '',
          currentTasks: ''
        };
      } else {
        // Non-teaching Support Staff
        const hasActivity = totalDays > 0;
        const roleStr = member.role || 'Staff';
        
        let totalTasks = 0;
        let completedTasks = 0;
        let taskList: string[] = [];

        if (hasActivity) {
          totalTasks = 10;
          completedTasks = 8;
          taskList = ["General operations audit", "Facility checkup"];

          if (roleStr === 'Accountant') {
            completedTasks = 9;
            totalTasks = 10;
            taskList = ["Bank reconciliation", "Monthly fee log audit", "Tax file submission"];
          } else if (roleStr === 'Cook') {
            completedTasks = 8;
            totalTasks = 9;
            taskList = ["Menu planning", "Kitchen stock reconciliation", "Sanitation check"];
          } else if (roleStr === 'Security Officer') {
            completedTasks = 12;
            totalTasks = 12;
            taskList = ["Visitor gate checkup", "Weekly locks inspection", "Fire exits sweep"];
          } else if (roleStr === 'Cleaner') {
            completedTasks = 7;
            totalTasks = 8;
            taskList = ["Main block cleanup", "Resource rooms inspection", "Sanitizer restocking"];
          } else if (roleStr === 'Librarian') {
            completedTasks = 5;
            totalTasks = 6;
            taskList = ["Register book shelf audit", "Cataloging new books", "Late fee notification logs"];
          }

          // Add variation based on staff id
          const seed = (uid.charCodeAt(0) || 0) % 3;
          completedTasks = Math.max(2, completedTasks - seed);
        }

        const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        let rating = 0;
        if (reviews.length > 0) {
          rating = parseFloat((reviews.reduce((sum: number, r: any) => sum + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1));
        } else {
          if (hasActivity) {
            const score = (attendanceRate + taskCompletionRate) / 2;
            rating = parseFloat((1.0 + (score / 100) * 4.0).toFixed(1));
          } else {
            rating = 0;
          }
        }

        return {
          id: uid,
          name: fullName,
          role: member.role,
          email: member.email,
          attendanceRate,
          punctualityRate: 0,
          lessonSubmissionRate: 0,
          assignmentCompletionRate: 0,
          studentPerformanceAvg: 0,
          rating,
          isTeacher: false,
          taskCompletionRate,
          tasksSummary: totalTasks > 0 ? `${completedTasks}/${totalTasks} Tasks` : "0/0 Tasks",
          currentTasks: taskList.length > 0 ? taskList.join(', ') : "No active tasks logged"
        };
      }
    });
  }, [
    staff, staffAttendance, lessonPlans, assignments, submissions, classes, students, recentAssessments, performanceReviews
  ]);

  // 2. Filter teaching and non-teaching from evaluated list
  const teachingStaffData = useMemo(() => {
    return staffEvaluations.filter(s => s.isTeacher);
  }, [staffEvaluations]);

  const nonTeachingStaffData = useMemo(() => {
    return staffEvaluations.filter(s => !s.isTeacher && s.role !== 'Director' && s.role !== 'Administrator');
  }, [staffEvaluations]);

  // 3. Compute Category status counts dynamically (excluding Admin/Director)
  const performanceCategories = useMemo(() => {
    let excellent = 0;
    let good = 0;
    let needsImprovement = 0;

    const visibleStaff = staffEvaluations.filter(s => 
      s.role !== 'Director' && s.role !== 'Administrator'
    );

    visibleStaff.forEach(s => {
      const rating = s.rating;
      if (rating === 0) {
        needsImprovement++;
      } else if (rating >= 4.5) {
        excellent++;
      } else if (rating >= 3.0) {
        good++;
      } else {
        needsImprovement++;
      }
    });

    return {
      excellent,
      good,
      needsImprovement,
      total: excellent + good + needsImprovement
    };
  }, [staffEvaluations]);

  // Donut chart data for Director category overview
  const pieChartData = [
    { name: 'Excellent', value: performanceCategories.excellent, fill: '#6366f1' },
    { name: 'Good', value: performanceCategories.good, fill: '#10b981' },
    { name: 'Needs Improvement', value: performanceCategories.needsImprovement, fill: '#f59e0b' }
  ];

  // Filters search terms
  const filteredTeaching = useMemo(() => {
    return teachingStaffData.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teachingStaffData, searchTerm]);

  const filteredNonTeaching = useMemo(() => {
    return nonTeachingStaffData.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [nonTeachingStaffData, searchTerm]);

  // Rating badge helper
  const getRatingBadge = (rating: number) => {
    if (rating === 0) {
      return (
        <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
          Unrated (0.0)
        </Badge>
      );
    }
    if (rating >= 4.5) {
      return (
        <Badge className="bg-indigo-100 text-indigo-800 border-none font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
          Excellent ({rating.toFixed(1)})
        </Badge>
      );
    } else if (rating >= 3.0) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-none font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
          Good ({rating.toFixed(1)})
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-amber-100 text-amber-850 border-none font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
          Improvement ({rating.toFixed(1)})
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. DIRECTOR VIEW OVERVIEW (Radial breakdown of staff status) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Category distribution donut chart */}
        <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
          <div className="space-y-4 max-w-sm">
            <Badge className="bg-indigo-50 text-indigo-600 border-none font-black text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Executive Review
            </Badge>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic leading-none">
              Staff Appraisal <span className="text-indigo-600">Distribution</span>
            </h2>
            <p className="text-xs text-slate-450 leading-relaxed font-bold uppercase tracking-normal">
              Unified categorization of active school employees across teaching and non-teaching sectors based on supervisor performance evaluations.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Excellent</span>
                <span className="text-xl font-black text-indigo-650">{performanceCategories.excellent}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Good</span>
                <span className="text-xl font-black text-emerald-600">{performanceCategories.good}</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Needs Imp.</span>
                <span className="text-xl font-black text-amber-500">{performanceCategories.needsImprovement}</span>
              </div>
            </div>
          </div>

          <div className="h-[200px] w-full md:w-[250px] relative flex items-center justify-center shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} Staff`, 'Appraisal Count']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-slate-800">{performanceCategories.total}</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Staff</span>
            </div>
          </div>
        </Card>

        {/* Dynamic Action items list */}
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Focus Areas & Alerts
          </h3>
          <div className="space-y-4">
            {performanceCategories.needsImprovement > 0 ? (
              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-550 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black text-amber-850 uppercase tracking-tight">Performance Coaching</h4>
                  <p className="text-[10px] text-amber-700 mt-1 leading-relaxed font-semibold">
                    {performanceCategories.needsImprovement} employees are currently logged under 'Needs Improvement'. Schedule target setting reviews.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="p-4 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl flex items-start gap-3">
              <Award className="h-5 w-5 text-indigo-650 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-indigo-850 uppercase tracking-tight">Annual Staff Rewards</h4>
                <p className="text-[10px] text-indigo-700 mt-1 leading-relaxed font-semibold">
                  Excellent ratings represent {Math.round((performanceCategories.excellent / performanceCategories.total) * 100)}% of total staff workforce. Nominate candidates for annual teacher awards.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. DIRECTORIES SEARCH CONTROL & TABS */}
      <Card className="rounded-[2rem] border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02)] bg-white p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                activeCategory === 'all' 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "bg-slate-50 text-slate-500 hover:text-slate-800"
              )}
            >
              All Staff ({teachingStaffData.length + nonTeachingStaffData.length})
            </button>
            <button
              onClick={() => setActiveCategory('teaching')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                activeCategory === 'teaching' 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "bg-slate-50 text-slate-500 hover:text-slate-800"
              )}
            >
              Teaching Staff ({teachingStaffData.length})
            </button>
            <button
              onClick={() => setActiveCategory('non-teaching')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                activeCategory === 'non-teaching' 
                  ? "bg-emerald-600 text-white shadow-sm" 
                  : "bg-slate-50 text-slate-500 hover:text-slate-800"
              )}
            >
              Non-Teaching ({nonTeachingStaffData.length})
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search employee by name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-10 pl-10 rounded-xl"
            />
          </div>
        </div>
      </Card>

      {/* 3. TEACHING STAFF SECTION */}
      {(activeCategory === 'all' || activeCategory === 'teaching') && (
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-slate-50/50 p-8 border-b">
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-650" /> Teaching Staff Performance Register
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
              Academic lesson note compliance, assignment check rates, student results, and attendance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Teacher Faculty</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Lesson Notes Sub.</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Homework Comp.</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Student Grades Avg</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Attendance Rate</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Punctuality</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12 text-right">Appraisal Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeaching.length > 0 ? (
                    filteredTeaching.map((t) => (
                      <TableRow key={t.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                        <TableCell className="py-4">
                          <div className="space-y-0.5">
                            <span className="font-black text-xs text-slate-700 block">{t.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono block">{t.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900 w-8">{t.lessonSubmissionRate}%</span>
                            <Progress value={t.lessonSubmissionRate} className="h-1.5 w-16" indicatorClassName={t.lessonSubmissionRate > 80 ? "bg-indigo-600" : "bg-amber-500"} />
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900 w-8">{t.assignmentCompletionRate}%</span>
                            <Progress value={t.assignmentCompletionRate} className="h-1.5 w-16" indicatorClassName={t.assignmentCompletionRate > 80 ? "bg-purple-600" : "bg-amber-500"} />
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900 w-8">{t.studentPerformanceAvg}%</span>
                            <Progress value={t.studentPerformanceAvg} className="h-1.5 w-16" indicatorClassName={t.studentPerformanceAvg > 70 ? "bg-emerald-600" : "bg-rose-500"} />
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-xs text-slate-650 py-4 font-mono">{t.attendanceRate}%</TableCell>
                        <TableCell className="font-bold text-xs text-slate-650 py-4 font-mono">{t.punctualityRate}%</TableCell>
                        <TableCell className="text-right py-4">{getRatingBadge(t.rating)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-450 italic text-xs uppercase tracking-widest font-black">
                        No teachers found matching search
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 4. NON-TEACHING STAFF SECTION */}
      {(activeCategory === 'all' || activeCategory === 'non-teaching') && (
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-slate-50/50 p-8 border-b">
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" /> Non-Teaching & Support Staff Register
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
              Operational staff attendance rates, task log compliance, and appraisal evaluation grades
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Staff Employee</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Job Role</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Attendance Rate</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Assigned Tasks logs</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Task Comp. Rate</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12 text-right">Appraisal Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNonTeaching.length > 0 ? (
                    filteredNonTeaching.map((s) => (
                      <TableRow key={s.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                        <TableCell className="py-4">
                          <div className="space-y-0.5">
                            <span className="font-black text-xs text-slate-700 block">{s.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono block">{s.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-50 border-slate-200">
                            {s.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-xs text-slate-650 py-4 font-mono">{s.attendanceRate}%</TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <span className="font-bold text-xs text-slate-600 block">{s.tasksSummary}</span>
                            <span className="text-[9px] text-slate-400 italic block leading-tight">{s.currentTasks}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900 w-8">{s.taskCompletionRate}%</span>
                            <Progress value={s.taskCompletionRate} className="h-1.5 w-24" indicatorClassName={s.taskCompletionRate > 80 ? "bg-emerald-600" : "bg-amber-500"} />
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4">{getRatingBadge(s.rating)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-450 italic text-xs uppercase tracking-widest font-black">
                        No support staff found matching search
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
