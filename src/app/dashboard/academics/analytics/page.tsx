'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter
} from 'recharts';
import { 
  Loader2, BrainCircuit, TrendingUp, AlertTriangle, Users, BookOpen, CheckCircle, Search, Sparkles, Wand2, Calendar, Award, ChevronRight, GraduationCap, RefreshCw
} from 'lucide-react';
import { generateLearningInsights } from '@/ai/flows/learning-analytics';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { checkAndSpendCredits } from '@/app/actions/credits';
import { useRole } from '@/context/role-context';
import { useRouter } from 'next/navigation';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Class, Student, Assessment, AttendanceRecord } from '@/lib/types';
import CreditBalance from '@/components/CreditBalance';

const LOADING_PHASES = [
  "Gathering student enrollment profiles...",
  "Retrieving academic continuous assessments...",
  "Compiling attendance ledger histories...",
  "Evaluating attendance-grade correlation ratios...",
  "Identifying silent struggles and outliers...",
  "Generating targeted pedagogical action strategies..."
];

export default function LearningAnalyticsPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const { schoolId, loading: schoolLoading } = useCurrentSchool();
  
  const schoolRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
  const { data: schoolData } = useDoc<any>(schoolRef);
  const { role, loading: isRoleLoading } = useRole();
  const router = useRouter();
  
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);
  const [loadingPhaseIndex, setLoadingPhaseIndex] = useState(0);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  const isAdmin = ['Administrator', 'Director'].includes(role || '');
  const isTeacher = role === 'Teacher';
  const canAccess = !isRoleLoading && (isAdmin || isTeacher);

  // Cycle loading phrases during AI generation
  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingPhaseIndex(prev => (prev + 1) % LOADING_PHASES.length);
      }, 2500);
    } else {
      setLoadingPhaseIndex(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // --- ACCESS GUARD ---
  useEffect(() => {
    if (!isRoleLoading && role === 'Student') {
      router.replace('/dashboard');
    }
  }, [role, isRoleLoading, router]);

  // 1. Fetch Classes for the current school
  const classesQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId || isRoleLoading || !canAccess) return null;
    return query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
  }, [firestore, schoolId, isRoleLoading, canAccess]);
  const { data: classes, isLoading: classesLoading } = useCollection<Class>(classesQuery);

  const timetableQuery = useMemoFirebase(() => 
    (firestore && schoolId && role === 'Teacher')
      ? query(collection(firestore, 'timetables'), where('schoolId', '==', schoolId)) 
      : null, 
  [firestore, schoolId, role]);
  const { data: timetable } = useCollection<any>(timetableQuery);

  const visibleClasses = useMemo(() => {
    if (!classes) return [];
    if (role !== 'Teacher') return classes;
    const subjectClassIds = timetable?.filter((t: any) => t.teacherId === user?.uid).map((t: any) => t.classId) || [];
    return classes.filter((c: any) => c.teacherId === user?.uid || subjectClassIds.includes(c.id));
  }, [classes, timetable, role, user?.uid]);

  // Class access guard
  useEffect(() => {
    if (selectedClassId && !classesLoading) {
      if (role === 'Teacher') {
        const isAuthorized = visibleClasses.some((c: any) => c.id === selectedClassId);
        if (!isAuthorized) {
          toast({
            variant: 'destructive',
            title: 'Access Restricted',
            description: 'You do not have access to this class analytics.'
          });
          setSelectedClassId(visibleClasses[0]?.id || '');
        }
      }
    }
  }, [selectedClassId, role, visibleClasses, classesLoading, toast]);

  // 2. Fetch Data (Dependent on selected Class)
  const studentsQuery = useMemoFirebase(() => {
    if (!firestore || !selectedClassId || !schoolId || isRoleLoading || !canAccess) return null;
    return query(collection(firestore, 'students'), where('classId', '==', selectedClassId), where('schoolId', '==', schoolId));
  }, [firestore, selectedClassId, schoolId, isRoleLoading, canAccess]);
  const { data: students, isLoading: studentsLoading } = useCollection<Student>(studentsQuery);

  const assessmentsQuery = useMemoFirebase(() => {
    if (!firestore || !selectedClassId || !schoolId || isRoleLoading || !canAccess) return null;
    return query(collection(firestore, 'assessments'), where('classId', '==', selectedClassId), where('schoolId', '==', schoolId));
  }, [firestore, selectedClassId, schoolId, isRoleLoading, canAccess]);
  const { data: assessments, isLoading: assessmentsLoading } = useCollection<Assessment>(assessmentsQuery);

  const attendanceQuery = useMemoFirebase(() => {
    if (!firestore || !selectedClassId || !schoolId || isRoleLoading || !canAccess) return null;
    return query(collection(firestore, 'attendance'), where('classId', '==', selectedClassId), where('schoolId', '==', schoolId));
  }, [firestore, selectedClassId, schoolId, isRoleLoading, canAccess]);
  const { data: attendance, isLoading: attendanceLoading } = useCollection<AttendanceRecord>(attendanceQuery);

  const isLoading = schoolLoading || isRoleLoading || classesLoading || (selectedClassId && (studentsLoading || assessmentsLoading || attendanceLoading));

  // --- DATA AGGREGATION ENGINE ---
  const { studentStats, scatterData, classMetrics } = useMemo(() => {
    if (!students || !assessments || !attendance || students.length === 0) {
      return { studentStats: [], scatterData: [], classMetrics: { size: 0, averageGrade: 0, averageAttendance: 0, safetyRate: 0 } };
    }

    const stats = students.map(student => {
        const myAssessments = assessments.filter(a => a.studentId === student.uid);
        const totalScore = myAssessments.reduce((sum, a) => sum + (a.score || 0), 0);
        const maxScore = myAssessments.reduce((sum, a) => sum + (a.maxScore || 100), 0);
        const gradeAvg = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

        const myAttendance = attendance.filter(a => a.studentId === student.uid);
        const presentCount = myAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
        const totalDays = myAttendance.length;
        const attendanceRate = totalDays > 0 ? (presentCount / totalDays) * 100 : 0;

        return {
            uid: student.uid,
            name: `${student.firstName} ${student.lastName}`,
            studentName: `${student.firstName} ${student.lastName}`,
            attendanceRate: Math.round(attendanceRate),
            averageGrade: Math.round(gradeAvg),
            missedAssessments: 0
        };
    });

    const sortedStats = [...stats].sort((a,b) => b.averageGrade - a.averageGrade);
    const scatter = stats.map(s => ({
        x: s.attendanceRate,
        y: s.averageGrade,
        name: s.name,
        z: 1
    }));

    // Calculate overall class aggregates
    const overallGrade = stats.reduce((sum, s) => sum + s.averageGrade, 0) / stats.length;
    const overallAttendance = stats.reduce((sum, s) => sum + s.attendanceRate, 0) / stats.length;
    const passingCount = stats.filter(s => s.averageGrade >= 50).length;
    const safetyRate = (passingCount / stats.length) * 100;

    return { 
      studentStats: sortedStats, 
      scatterData: scatter,
      classMetrics: {
        size: stats.length,
        averageGrade: overallGrade,
        averageAttendance: overallAttendance,
        safetyRate
      }
    };
  }, [students, assessments, attendance]);

  // Filter roster by search input
  const filteredStudentStats = useMemo(() => {
    if (!studentStats) return [];
    return studentStats.filter(s => 
      s.name.toLowerCase().includes(studentSearchQuery.toLowerCase())
    );
  }, [studentStats, studentSearchQuery]);

  const handleRunAiAnalysis = async () => {
      if (studentStats.length === 0 || !schoolId) return;
      setIsAnalyzing(true);
      try {
          const creditResult = await checkAndSpendCredits(schoolId, 10);
          if (!creditResult.success) {
              toast({ variant: 'destructive', title: "Insufficient Credits", description: creditResult.error });
              setIsAnalyzing(false);
              return;
          }
          const result = await generateLearningInsights({ classData: studentStats, schoolId });
          if (result.success) {
              setAiReport(result.data);
              toast({ title: "Analysis Complete! 📊", description: "Successfully updated learning diagnostic report." });
          } else {
              toast({ variant: 'destructive', title: "Insight Engine Failed", description: result.error });
          }
      } catch (e: any) {
          console.error(e);
          toast({ variant: 'destructive', title: "Error", description: e.message || "Failed to generate report." });
      } finally {
          setIsAnalyzing(false);
      }
  };

  if (isRoleLoading) {
      return (
        <div className="p-16 flex flex-col items-center justify-center text-slate-450 gap-3">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
          <p className="font-semibold text-sm">Validating credentials...</p>
        </div>
      );
  }

  if (role === 'Student' || role === 'Parent') {
    return (
      <div className="p-8 text-center bg-rose-50 border border-rose-250 text-rose-700 rounded-3xl font-semibold m-6">
        Access Denied. Only staff and administrators can view class-wide learning analytics dashboards.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
        {/* Premium Gradient Header Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-12 shadow-2xl border border-white/10 group">
            <div className="absolute right-[-40px] bottom-[-40px] opacity-10 text-white transition-transform duration-700 group-hover:scale-110 pointer-events-none">
                <BrainCircuit className="h-60 w-60 animate-pulse" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
                        Learning Analytics Engine
                    </h1>
                    <p className="text-indigo-200 text-lg max-w-2xl font-light leading-relaxed">
                        Identify silent struggles, evaluate student performance-attendance correlations, and run AI predictive classroom diagnostic diagnostics.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    {(role as string) !== 'Student' && (role as string) !== 'Parent' && (
                        <CreditBalance />
                    )}
                </div>
            </div>
        </div>

        {/* Control Toolbar */}
        <Card className="border border-slate-100 shadow-md rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-50 bg-slate-50/25 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle className="text-lg font-black text-slate-800">Target Classroom</CardTitle>
                    <CardDescription className="text-slate-400">Select a class to compile statistics and run AI diagnostics.</CardDescription>
                </div>
                <div className="w-full sm:w-[280px]">
                    <Select value={selectedClassId} onValueChange={(val) => { setSelectedClassId(val); setAiReport(null); }}>
                        <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm font-semibold">
                            <SelectValue placeholder="Select Class to Analyze" />
                        </SelectTrigger>
                        <SelectContent>
                            {visibleClasses?.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
        </Card>

        {selectedClassId && isLoading && (
             <div className="flex flex-col items-center justify-center py-24 text-slate-450 gap-3 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600"/>
                <p className="font-semibold text-sm">Compiling learning matrix datasets...</p>
            </div>
        )}

        {selectedClassId && !isLoading && (
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Statistics Context Widgets */}
                {studentStats.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white p-6 relative group hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-slate-450 uppercase tracking-wider">Class Size</p>
                                    <p className="text-3xl font-black text-slate-800 mt-1">{classMetrics.size}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">Active Roster Size</p>
                                </div>
                                <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                                    <Users className="h-6 w-6" />
                                </div>
                            </div>
                        </Card>

                        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white p-6 relative group hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-slate-450 uppercase tracking-wider">Grade Average</p>
                                    <p className="text-3xl font-black text-indigo-700 mt-1">{classMetrics.averageGrade.toFixed(1)}%</p>
                                    <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${classMetrics.averageGrade}%` }}></div>
                                    </div>
                                </div>
                                <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                            </div>
                        </Card>

                        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white p-6 relative group hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-slate-450 uppercase tracking-wider">Avg Attendance</p>
                                    <p className="text-3xl font-black text-emerald-700 mt-1">{classMetrics.averageAttendance.toFixed(1)}%</p>
                                    <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${classMetrics.averageAttendance}%` }}></div>
                                    </div>
                                </div>
                                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl">
                                    <Calendar className="h-6 w-6" />
                                </div>
                            </div>
                        </Card>

                        <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white p-6 relative group hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-slate-450 uppercase tracking-wider">Academic Safety</p>
                                    <p className="text-3xl font-black text-teal-700 mt-1">{classMetrics.safetyRate.toFixed(1)}%</p>
                                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">Ratio of Passing Students</p>
                                </div>
                                <div className="bg-teal-50 text-teal-650 p-3 rounded-2xl">
                                    <CheckCircle className="h-6 w-6" />
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Interactive Chart Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border border-slate-100 shadow-md rounded-[2rem] overflow-hidden bg-white">
                        <CardHeader className="p-6 border-b border-slate-50 bg-white">
                            <CardTitle className="text-base font-black text-slate-800">Correlation Matrix: Attendance vs. Performance</CardTitle>
                            <CardDescription className="text-slate-400">Plot visual correlations. Red indicates scoring threshold &lt; 50%.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[320px] pt-6 px-4 pb-4">
                            {scatterData.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                  <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -10 }}>
                                      <CartesianGrid strokeDasharray="3 3" className="stroke-slate-100" />
                                      <XAxis type="number" dataKey="x" name="Attendance" unit="%" domain={[0, 100]} className="text-[10px] font-mono" />
                                      <YAxis type="number" dataKey="y" name="Grade" unit="%" domain={[0, 100]} className="text-[10px] font-mono" />
                                      <Tooltip 
                                          cursor={{ strokeDasharray: '3 3' }} 
                                          content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                              const data = payload[0].payload;
                                              return (
                                                <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-white/10 space-y-1">
                                                  <p className="font-black border-b border-white/10 pb-1">{data.name}</p>
                                                  <p>Attendance: <span className="font-bold text-indigo-300">{data.x}%</span></p>
                                                  <p>Avg Grade: <span className="font-bold text-indigo-300">{data.y}%</span></p>
                                                </div>
                                              );
                                            }
                                            return null;
                                          }}
                                      />
                                      <Scatter name="Students" data={scatterData}>
                                          {scatterData.map((entry, index) => (
                                              <Cell 
                                                key={`cell-${index}`} 
                                                fill={entry.y < 50 ? '#f43f5e' : (entry.y >= 80 ? '#10b981' : '#6366f1')} 
                                                className="cursor-pointer stroke-white hover:scale-125 transition-transform duration-200"
                                                r={6}
                                              />
                                          ))}
                                      </Scatter>
                                  </ScatterChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="flex h-full items-center justify-center text-slate-400 italic text-sm">No data to plot correlation</div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-100 shadow-md rounded-[2rem] overflow-hidden bg-white">
                        <CardHeader className="p-6 border-b border-slate-50 bg-white">
                            <CardTitle className="text-base font-black text-slate-800">Roster Score Distribution</CardTitle>
                            <CardDescription className="text-slate-400">Overall class average percentages (top 10 performers).</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[320px] pt-6 px-4 pb-4">
                            {studentStats.length > 0 ? (
                              <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={studentStats.slice(0, 10)} layout="vertical" margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                                      <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-slate-100" />
                                      <XAxis type="number" domain={[0, 100]} hide />
                                      <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                      <Tooltip
                                        cursor={{ fill: 'rgba(99,102,241,0.04)' }}
                                        content={({ active, payload }) => {
                                          if (active && payload && payload.length) {
                                            return (
                                              <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg text-xs space-y-0.5">
                                                <p className="font-bold">{payload[0].payload.name}</p>
                                                <p>Average: <span className="font-black text-indigo-300">{payload[0].value}%</span></p>
                                              </div>
                                            );
                                          }
                                          return null;
                                        }}
                                      />
                                      <Bar dataKey="averageGrade" name="Avg Grade %" radius={[0, 8, 8, 0]} barSize={12}>
                                          {studentStats.slice(0, 10).map((entry, index) => (
                                              <Cell key={`cell-${index}`} fill={entry.averageGrade < 50 ? '#f43f5e' : '#6366f1'} />
                                          ))}
                                      </Bar>
                                  </BarChart>
                              </ResponsiveContainer>
                            ) : (
                              <div className="flex h-full items-center justify-center text-slate-400 italic text-sm">No data to calculate score distribution</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* AI Diagnostics Engine Panel */}
                <Card className="border border-purple-150 bg-gradient-to-br from-purple-50/40 via-white to-purple-50/10 rounded-[2.2rem] overflow-hidden shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-purple-100 bg-purple-50/20 p-6 flex-wrap gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-purple-800 font-black text-lg">
                                <BrainCircuit className="h-5 w-5 text-purple-650 animate-pulse"/> AI Insight Engine
                            </CardTitle>
                            <CardDescription className="text-purple-950/50">Run algorithmic diagnostics to discover hidden struggles and generate teaching adjustments.</CardDescription>
                        </div>
                        <Button 
                          onClick={handleRunAiAnalysis} 
                          disabled={isAnalyzing || studentStats.length === 0}
                          className="bg-purple-700 hover:bg-purple-800 font-bold rounded-xl text-white shadow shadow-purple-200 transition-all h-10 px-6"
                        >
                            {isAnalyzing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Run Class Diagnostics (-10 Credits)
                              </>
                            )}
                        </Button>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                        {isAnalyzing && (
                          <div className="flex flex-col items-center justify-center py-16 space-y-4">
                              <div className="relative">
                                  <div className="h-16 w-16 rounded-full border-4 border-purple-100 border-t-purple-650 animate-spin"></div>
                                  <BrainCircuit className="h-6 w-6 text-purple-650 absolute top-5 left-5 animate-pulse" />
                              </div>
                              <div className="text-center space-y-1">
                                  <p className="text-purple-850 font-black text-sm transition-all duration-300">
                                      {LOADING_PHASES[loadingPhaseIndex]}
                                  </p>
                                  <p className="text-xs text-slate-400 font-semibold">Running predictive models. Fetching recommendations.</p>
                              </div>
                          </div>
                        )}

                        {!isAnalyzing && aiReport && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                {/* At-Risk Students Grid */}
                                <div>
                                    <h3 className="font-black text-rose-700 flex items-center gap-2 mb-4 text-base">
                                        <AlertTriangle className="h-5 w-5 text-rose-600"/> At-Risk Roster Anomalies
                                    </h3>
                                    {aiReport.atRiskStudents && aiReport.atRiskStudents.length > 0 ? (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          {aiReport.atRiskStudents.map((risk: any, i: number) => {
                                            const isHigh = risk.riskLevel === 'High';
                                            return (
                                              <div 
                                                key={i} 
                                                className={`p-5 rounded-2xl border bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden ${
                                                  isHigh ? 'border-rose-100 hover:border-rose-200' : 'border-amber-100 hover:border-amber-200'
                                                }`}
                                              >
                                                  {/* Alert strip accent */}
                                                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${isHigh ? 'bg-rose-500' : 'bg-amber-400'}`}></div>
                                                  
                                                  <div className="space-y-2 mt-1">
                                                      <div className="flex items-center justify-between">
                                                          <span className="font-black text-slate-800 text-sm">{risk.studentName}</span>
                                                          <Badge className={isHigh ? 'bg-rose-50 border-rose-200 text-rose-700 font-black text-[10px] hover:bg-rose-50' : 'bg-amber-50 border-amber-200 text-amber-800 font-black text-[10px] hover:bg-amber-50'}>
                                                              {risk.riskLevel} Risk
                                                          </Badge>
                                                      </div>
                                                      <p className="text-xs text-rose-750 font-bold leading-relaxed">
                                                          <span className="font-extrabold">Trigger:</span> {risk.reason}
                                                      </p>
                                                  </div>
                                                  
                                                  <div className="bg-slate-50 p-3 rounded-xl mt-4 border border-slate-100/60">
                                                      <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                                                          <span className="font-extrabold text-slate-900 block mb-0.5">💡 Suggested Intervention:</span> 
                                                          {risk.intervention}
                                                      </p>
                                                  </div>

                                                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                                                      <Button
                                                          variant="outline"
                                                          size="sm"
                                                          onClick={() => {
                                                              const schoolName = schoolData?.name || 'our school';
                                                              const prompt = `Draft a supportive and professional parent notification message for student ${risk.studentName}, who has been flagged with an Academic/Attendance Risk. Trigger Reason: ${risk.reason}. Suggested Intervention: ${risk.intervention}. Please write the message on behalf of the school "${schoolName}" (do NOT use "GAM Edu", which is the software app name). The message should communicate the situation constructively and propose a discussion to help the student improve.`;
                                                              window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { prompt, autoSend: true } }));
                                                          }}
                                                          className="h-7 text-[10px] font-black uppercase tracking-wider px-2.5 rounded-lg border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 transition-all flex items-center gap-1 shadow-sm flex-1 justify-center whitespace-nowrap"
                                                      >
                                                          <Sparkles className="w-3 h-3 text-purple-500 animate-pulse" />
                                                          Draft AI parent notification text
                                                      </Button>
                                                      <Button
                                                          variant="outline"
                                                          size="sm"
                                                          onClick={() => {
                                                              const prompt = `Recommend specific academic remediation tasks and support plans for student ${risk.studentName}. Trigger Reason: ${risk.reason}. Suggested Intervention: ${risk.intervention}. Please provide concrete, actionable study plans, topics to review, or exercises to practice.`;
                                                              window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: { prompt, autoSend: true } }));
                                                          }}
                                                          className="h-7 text-[10px] font-black uppercase tracking-wider px-2.5 rounded-lg border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all flex items-center gap-1 shadow-sm flex-1 justify-center whitespace-nowrap"
                                                      >
                                                          <Wand2 className="w-3 h-3 text-emerald-500 animate-pulse" />
                                                          Recommend remediation tasks
                                                      </Button>
                                                  </div>
                                              </div>
                                            );
                                          })}
                                      </div>
                                    ) : (
                                      <div className="p-8 text-center text-slate-500 italic bg-white rounded-2xl border border-slate-100 shadow-sm text-sm">
                                          No students flagged as at-risk. Roster health is solid! 🎉
                                      </div>
                                    )}
                                </div>

                                {/* Class Trends & Strategy Tabs */}
                                <div className="border border-purple-100 bg-white rounded-2xl overflow-hidden shadow-sm">
                                    <Tabs defaultValue="trends" className="w-full">
                                        <div className="px-6 pt-1 border-b border-purple-50 bg-purple-50/10">
                                            <TabsList className="bg-transparent h-10 p-0 gap-6">
                                                <TabsTrigger 
                                                    value="trends" 
                                                    className="data-[state=active]:border-b-2 data-[state=active]:border-purple-700 rounded-none shadow-none bg-transparent hover:text-purple-900 text-slate-400 font-black px-0 pb-2.5 text-xs uppercase tracking-wider"
                                                >
                                                    Attendance & Performance Trends
                                                </TabsTrigger>
                                                <TabsTrigger 
                                                    value="strategy" 
                                                    className="data-[state=active]:border-b-2 data-[state=active]:border-purple-700 rounded-none shadow-none bg-transparent hover:text-purple-900 text-slate-400 font-black px-0 pb-2.5 text-xs uppercase tracking-wider"
                                                >
                                                    Pedagogical Strategy Adjustments
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <TabsContent value="trends" className="mt-0 p-5 bg-white">
                                            <div className="prose prose-sm prose-purple max-w-none">
                                                <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                                                    {aiReport.classTrends}
                                                </p>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="strategy" className="mt-0 p-5 bg-white">
                                            <div className="prose prose-sm prose-purple max-w-none">
                                                <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                                                    {aiReport.teachingStrategy}
                                                </p>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        )}

                        {!isAnalyzing && !aiReport && (
                          <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 gap-2">
                              <RefreshCw className="h-8 w-8 text-purple-300" />
                              <p className="text-sm font-semibold text-purple-900/40">Diagnostics Engine Idle</p>
                              <p className="text-xs text-slate-450 max-w-xs">Click the diagnostic analysis trigger above to parse metrics datasets and generate recommendations.</p>
                          </div>
                        )}
                    </CardContent>
                </Card>

                {/* Searchable Class Roster Summary Grid */}
                <Card className="border border-slate-100 shadow-md rounded-[2rem] overflow-hidden bg-white">
                    <CardHeader className="py-5 px-6 border-b border-slate-50 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-base font-black text-slate-800">Class Roster Summary</CardTitle>
                            <CardDescription className="text-slate-400">Total list of active students and computed metrics</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-[260px]">
                            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <Input 
                              placeholder="Search by student name..." 
                              value={studentSearchQuery}
                              onChange={e => setStudentSearchQuery(e.target.value)}
                              className="pl-10 h-10 rounded-xl border border-slate-200 focus-visible:ring-indigo-500 shadow-sm text-sm"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/70 hover:bg-slate-50/70 border-b border-slate-100">
                                    <TableHead className="font-bold text-slate-700 pl-6">Student Name</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-center">Computed Avg Grade</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-center">Attendance Rate</TableHead>
                                    <TableHead className="font-bold text-slate-700 text-right pr-6">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudentStats.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10 italic text-slate-400">
                                            No matching students found in this roster.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredStudentStats.map((student, index) => {
                                        const isPassing = student.averageGrade >= 50;
                                        const isGoodAttendance = student.attendanceRate >= 85;
                                        
                                        // Initials extraction
                                        const parts = student.name.split(' ');
                                        const initials = `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase();

                                        return (
                                            <TableRow key={student.uid || index} className="hover:bg-slate-50/30 transition-colors border-b border-slate-100 last:border-0">
                                                <TableCell className="font-semibold text-slate-800 pl-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 text-xs font-black border border-slate-200 shadow-sm">
                                                            {initials}
                                                        </div>
                                                        <span>{student.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className={`font-black text-[11px] py-1 px-2.5 rounded-full ${
                                                        student.averageGrade >= 80 ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' :
                                                        student.averageGrade >= 50 ? 'bg-indigo-50 text-indigo-755 hover:bg-indigo-55' :
                                                        'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-50'
                                                    }`}>
                                                        {student.averageGrade}%
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className={`font-bold text-[10px] py-1 px-2.5 rounded-full ${
                                                        isGoodAttendance ? 'bg-emerald-50 border-emerald-250 text-emerald-700' : 'bg-amber-50 border-amber-250 text-amber-800'
                                                    }`}>
                                                        {student.attendanceRate}%
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6 font-semibold text-slate-500 text-xs">
                                                    <span className="flex items-center justify-end gap-1.5">
                                                        <span className={`h-2 w-2 rounded-full ${isPassing ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                        {isPassing ? 'Healthy' : 'Needs Support'}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        )}

        {!selectedClassId && (
            <div className="p-20 text-center text-slate-450 border-4 border-dashed rounded-[2.5rem] bg-slate-50/50 flex flex-col items-center justify-center gap-4 m-6 border-slate-200">
                <div className="bg-white p-5 rounded-full shadow-md">
                    <BrainCircuit className="h-12 w-12 text-indigo-400 animate-pulse" />
                </div>
                <div>
                    <p className="text-lg font-black text-slate-700">Analytics Workspace Idle</p>
                    <p className="text-sm text-slate-400 mt-1 max-w-sm">Please select a Target Class in the select toolbar above to fetch learning matrix data.</p>
                </div>
            </div>
        )}
    </div>
  );
}
