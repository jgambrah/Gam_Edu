
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, ScatterChart, Scatter, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Loader2, BrainCircuit, TrendingUp, AlertTriangle, 
  Users, BookOpen, CheckCircle 
} from 'lucide-react';
import { generateLearningInsights } from '@/ai/flows/learning-analytics';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { checkAndSpendCredits } from '@/app/actions/credits';
import { useRole } from '@/context/role-context';
import { useRouter } from 'next/navigation';

// UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Class, Student, Assessment, AttendanceRecord } from '@/lib/types';

export default function LearningAnalyticsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId, loading: schoolLoading } = useCurrentSchool();
  const { role, loading: roleLoading } = useRole();
  const router = useRouter();
  
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  const isAdmin = ['Administrator', 'Director'].includes(role || '');
  const isTeacher = role === 'Teacher';
  const canAccess = !roleLoading && (isAdmin || isTeacher);

  // --- ACCESS GUARD ---
  useEffect(() => {
    if (!roleLoading && role === 'Student') {
      router.replace('/dashboard');
    }
  }, [role, roleLoading, router]);

  // 1. Fetch Classes for the current school
  const classesQuery = useMemoFirebase(() => (firestore && schoolId && canAccess) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, canAccess]);
  const { data: classes, isLoading: classesLoading } = useCollection<Class>(classesQuery);

  // 2. Fetch Data (Dependent on selected Class)
  const studentsQuery = useMemoFirebase(() => 
    (firestore && selectedClassId && schoolId && canAccess) ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId), where('schoolId', '==', schoolId)) : null, 
  [firestore, selectedClassId, schoolId, canAccess]);
  const { data: students, isLoading: studentsLoading } = useCollection<Student>(studentsQuery);

  const assessmentsQuery = useMemoFirebase(() => 
    (firestore && selectedClassId && schoolId && canAccess) ? query(collection(firestore, 'assessments'), where('classId', '==', selectedClassId), where('schoolId', '==', schoolId)) : null, 
  [firestore, selectedClassId, schoolId, canAccess]);
  const { data: assessments, isLoading: assessmentsLoading } = useCollection<Assessment>(assessmentsQuery);

  const attendanceQuery = useMemoFirebase(() => 
    (firestore && selectedClassId && schoolId && canAccess) ? query(collection(firestore, 'attendance'), where('classId', '==', selectedClassId), where('schoolId', '==', schoolId)) : null, 
  [firestore, selectedClassId, schoolId, canAccess]);
  const { data: attendance, isLoading: attendanceLoading } = useCollection<AttendanceRecord>(attendanceQuery);

  const isLoading = schoolLoading || roleLoading || classesLoading || (selectedClassId && (studentsLoading || assessmentsLoading || attendanceLoading));

  // --- DATA AGGREGATION ENGINE ---
  const { studentStats, scatterData } = useMemo(() => {
    if (!students || !assessments || !attendance) return { studentStats: [], scatterData: [] };

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

    return { studentStats: sortedStats, scatterData: scatter };
  }, [students, assessments, attendance]);

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
              toast({ title: "Analysis Complete" });
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsAnalyzing(false);
      }
  };

  if (roleLoading) {
      return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>;
  }

  if (role === 'Student') {
    return (
      <div className="p-6">
        <Card>
            <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>This analytics dashboard is for staff only.</CardDescription>
            </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2 text-slate-800">
                    <TrendingUp className="text-indigo-600"/> Learning Analytics
                </h1>
                <p className="text-muted-foreground">Data-driven insights into student performance.</p>
            </div>
            <div className="w-[250px]">
                <Select value={selectedClassId} onValueChange={(val) => { setSelectedClassId(val); setAiReport(null); }}>
                    <SelectTrigger><SelectValue placeholder="Select Class to Analyze" /></SelectTrigger>
                    <SelectContent>
                        {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>

        {selectedClassId && isLoading && (
             <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
                <Loader2 className="h-12 w-12 animate-spin mb-4 opacity-50"/>
                <p>Loading analytics data...</p>
            </div>
        )}

        {selectedClassId && !isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Correlation: Attendance vs Performance</CardTitle>
                        <CardDescription>Are absences affecting grades?</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" dataKey="x" name="Attendance" unit="%" domain={[0, 100]} />
                                <YAxis type="number" dataKey="y" name="Grade" unit="%" domain={[0, 100]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Students" data={scatterData}>
                                    {scatterData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.y < 50 ? '#ef4444' : (entry.y >= 80 ? '#22c55e' : '#3b82f6')} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Performance Distribution</CardTitle>
                        <CardDescription>Overall class average percentages.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={studentStats.slice(0, 10)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} />
                                <Tooltip />
                                <Bar dataKey="averageGrade" name="Avg Grade %" radius={[0, 4, 4, 0]}>
                                    {studentStats.slice(0, 10).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.averageGrade < 50 ? '#ef4444' : '#6366f1'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-indigo-200 bg-indigo-50/30">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-indigo-700">
                                <BrainCircuit className="h-6 w-6"/> AI Insight Engine
                            </CardTitle>
                            <CardDescription>Let AI analyze the data to find at-risk students.</CardDescription>
                        </div>
                        <Button onClick={handleRunAiAnalysis} disabled={isAnalyzing || studentStats.length === 0}>
                            {isAnalyzing ? "Analyzing..." : "Run Analysis (-10 Credits)"}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {aiReport && (
                            <div className="space-y-6 animate-in fade-in">
                                <div>
                                    <h3 className="font-bold text-red-600 flex items-center gap-2 mb-3">
                                        <AlertTriangle className="h-5 w-5"/> At-Risk Students
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {aiReport.atRiskStudents.map((risk: any, i: number) => (
                                            <div key={i} className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                                                <span className="font-bold text-slate-800">{risk.studentName}</span>
                                                <p className="text-xs text-red-600 mt-1">Why: {risk.reason}</p>
                                                <p className="text-xs text-slate-600 mt-2">💡 Fix: {risk.intervention}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        )}
    </div>
  );
}
