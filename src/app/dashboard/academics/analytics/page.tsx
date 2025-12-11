
'use client';

import { useState, useMemo } from 'react';
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
  
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);

  // 1. Fetch Classes
  const classesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'classes')) : null, [firestore]);
  const { data: classes } = useCollection<Class>(classesQuery);

  // 2. Fetch Data (Dependent on selected Class)
  const studentsQuery = useMemoFirebase(() => 
    (firestore && selectedClassId) ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId)) : null, 
  [firestore, selectedClassId]);
  const { data: students } = useCollection<Student>(studentsQuery);

  const assessmentsQuery = useMemoFirebase(() => 
    (firestore && selectedClassId) ? query(collection(firestore, 'assessments'), where('classId', '==', selectedClassId)) : null, 
  [firestore, selectedClassId]);
  const { data: assessments } = useCollection<Assessment>(assessmentsQuery);

  const attendanceQuery = useMemoFirebase(() => 
    (firestore && selectedClassId) ? query(collection(firestore, 'attendance'), where('classId', '==', selectedClassId)) : null, 
  [firestore, selectedClassId]);
  const { data: attendance } = useCollection<AttendanceRecord>(attendanceQuery);

  // --- DATA AGGREGATION ENGINE ---
  const { studentStats, classAverages, scatterData } = useMemo(() => {
    if (!students || !assessments || !attendance) return { studentStats: [], classAverages: [], scatterData: [] };

    const stats = students.map(student => {
        // A. Calculate Grades
        const myAssessments = assessments.filter(a => a.studentId === student.uid);
        const totalScore = myAssessments.reduce((sum, a) => sum + (a.score || 0), 0);
        const maxScore = myAssessments.reduce((sum, a) => sum + (a.maxScore || 100), 0);
        const gradeAvg = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

        // B. Calculate Attendance
        const myAttendance = attendance.filter(a => a.studentId === student.uid);
        const presentCount = myAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
        const totalDays = myAttendance.length;
        const attendanceRate = totalDays > 0 ? (presentCount / totalDays) * 100 : 0;

        return {
            name: `${student.firstName} ${student.lastName}`,
            attendanceRate: Math.round(attendanceRate),
            averageGrade: Math.round(gradeAvg),
            missedAssessments: 0 // logic to calc missed
        };
    });

    // Sort by Grade for charts
    const sortedStats = [...stats].sort((a,b) => b.averageGrade - a.averageGrade);

    // Prepare Scatter Data
    const scatter = stats.map(s => ({
        x: s.attendanceRate,
        y: s.averageGrade,
        name: s.name,
        z: 1 // bubble size
    }));

    return { studentStats: sortedStats, classAverages: [], scatterData: scatter };
  }, [students, assessments, attendance]);

  // --- AI HANDLER ---
  const handleRunAiAnalysis = async () => {
      if (studentStats.length === 0) return;
      setIsAnalyzing(true);
      try {
          // Send simplified data to save tokens
          const result = await generateLearningInsights({ classData: studentStats });
          if (result.success) {
              setAiReport(result.data);
              toast({ title: "Analysis Complete", description: "Insights generated successfully." });
          } else {
              toast({ variant: 'destructive', title: "AI Error", description: result.error });
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsAnalyzing(false);
      }
  };

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

        {selectedClassId && students && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                
                {/* 1. SCATTER PLOT: ATTENDANCE VS GRADES */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Correlation: Attendance vs Performance</CardTitle>
                        <CardDescription>Are absences affecting grades?</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" dataKey="x" name="Attendance" unit="%" domain={[0, 100]} label={{ value: 'Attendance %', position: 'insideBottom', offset: -10 }} />
                                <YAxis type="number" dataKey="y" name="Grade" unit="%" domain={[0, 100]} label={{ value: 'Avg Grade %', angle: -90, position: 'insideLeft' }} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Students" data={scatterData} fill="#8884d8">
                                    {scatterData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.y < 50 ? '#ef4444' : (entry.y >= 80 ? '#22c55e' : '#3b82f6')} />
                                    ))}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* 2. BAR CHART: CLASS RANKING */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Performance Distribution</CardTitle>
                        <CardDescription>Overall class average percentages.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={studentStats.slice(0, 10)} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
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

                {/* 3. AI INSIGHT ENGINE */}
                <Card className="lg:col-span-2 border-indigo-200 bg-indigo-50/30">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-indigo-700">
                                <BrainCircuit className="h-6 w-6"/> AI Insight Engine
                            </CardTitle>
                            <CardDescription>Let AI analyze the data to find at-risk students and suggest strategies.</CardDescription>
                        </div>
                        <Button onClick={handleRunAiAnalysis} disabled={isAnalyzing || studentStats.length === 0} className="bg-indigo-600 hover:bg-indigo-700">
                            {isAnalyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Analyzing...</> : "Run Analysis"}
                        </Button>
                    </CardHeader>
                    
                    <CardContent>
                        {!aiReport && !isAnalyzing && (
                            <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-indigo-200 rounded-lg">
                                Click "Run Analysis" to generate insights.
                            </div>
                        )}

                        {aiReport && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                                
                                {/* AT RISK SECTION */}
                                <div>
                                    <h3 className="font-bold text-red-600 flex items-center gap-2 mb-3">
                                        <AlertTriangle className="h-5 w-5"/> At-Risk Students
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {aiReport.atRiskStudents.map((risk: any, i: number) => (
                                            <div key={i} className="bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-bold text-slate-800">{risk.studentName}</span>
                                                    <Badge variant={risk.riskLevel === 'High' ? 'destructive' : 'secondary'}>{risk.riskLevel} Risk</Badge>
                                                </div>
                                                <p className="text-xs text-red-600 mt-1 font-medium">Why: {risk.reason}</p>
                                                <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded">💡 Fix: {risk.intervention}</p>
                                            </div>
                                        ))}
                                        {aiReport.atRiskStudents.length === 0 && <p className="text-green-600 text-sm">No students identified as high risk.</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* TRENDS */}
                                    <div className="bg-white p-4 rounded-lg border border-indigo-100">
                                        <h3 className="font-bold text-indigo-700 flex items-center gap-2 mb-2">
                                            <TrendingUp className="h-4 w-4"/> Class Trends
                                        </h3>
                                        <p className="text-sm text-slate-700 leading-relaxed">{aiReport.classTrends}</p>
                                    </div>

                                    {/* STRATEGY */}
                                    <div className="bg-white p-4 rounded-lg border border-emerald-100">
                                        <h3 className="font-bold text-emerald-700 flex items-center gap-2 mb-2">
                                            <BookOpen className="h-4 w-4"/> Teaching Strategy
                                        </h3>
                                        <p className="text-sm text-slate-700 leading-relaxed">{aiReport.teachingStrategy}</p>
                                    </div>
                                </div>

                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        )}

        {!selectedClassId && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
                <Users className="h-16 w-16 mb-4 opacity-50"/>
                <p>Select a class above to begin analysis.</p>
            </div>
        )}
    </div>
  );
}

    