'use client';

import { useMemo, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, doc, setDoc, serverTimestamp, query, where, writeBatch } from 'firebase/firestore';
import { 
  GraduationCap, Users, School, Loader2, 
  Bell, FileText, CalendarCheck,
  TrendingUp, BrainCircuit,
  Clock, CheckCircle2, Star, PlusCircle, Sparkles,
  AlertCircle,
  Award,
  Search,
  AlertTriangle,
  Send,
  CheckSquare,
  Check,
  X,
  Plus,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format, formatDistanceToNow, startOfDay } from 'date-fns';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { sendSchoolSMSAction } from '@/app/actions/sms';
import { billStudentForAttendance } from '@/lib/billing';

export function TeacherDashboardView({ 
    profile, 
    classes: rawClasses, 
    students: rawStudents, 
    assessments: rawAssessments, 
    announcements: rawAnnouncements, 
    timetable: rawTimetable, 
    assignments: rawAssignments, 
    submissions: rawSubmissions, 
    subjects: rawSubjects,
    isLoading 
}: any) {
    const classes = useMemo(() => rawClasses || [], [rawClasses]);
    const students = useMemo(() => rawStudents || [], [rawStudents]);
    const assessments = useMemo(() => rawAssessments || [], [rawAssessments]);
    const announcements = useMemo(() => rawAnnouncements || [], [rawAnnouncements]);
    const timetable = useMemo(() => rawTimetable || [], [rawTimetable]);
    const assignments = useMemo(() => rawAssignments || [], [rawAssignments]);
    const submissions = useMemo(() => rawSubmissions || [], [rawSubmissions]);
    const subjects = useMemo(() => rawSubjects || [], [rawSubjects]);
    const { user } = useUser();
    const displayName = profile?.firstName || user?.displayName?.split(' ')[0] || 'Teacher';
    const { toast } = useToast();
    const firestore = useFirestore();
    const schoolId = profile?.schoolId || '';

    // Class selection state
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'roster' | 'performance' | 'grading' | 'bulletins'>('roster');

    // Modals State
    const [isBehaviorOpen, setIsBehaviorOpen] = useState(false);
    const [behaviorStudent, setBehaviorStudent] = useState<any>(null);
    const [behaviorCategory, setBehaviorCategory] = useState<'incident' | 'commendation' | 'counselling'>('commendation');
    const [behaviorDesc, setBehaviorDesc] = useState('');
    const [isSavingBehavior, setIsSavingBehavior] = useState(false);

    const [isMilestoneOpen, setIsMilestoneOpen] = useState(false);
    const [milestoneStudent, setMilestoneStudent] = useState<any>(null);
    const [milestoneCategory, setMilestoneCategory] = useState<string>('awards');
    const [milestoneTitle, setMilestoneTitle] = useState('');
    const [milestoneDesc, setMilestoneDesc] = useState('');
    const [isSavingMilestone, setIsSavingMilestone] = useState(false);

    const [isGradingOpen, setIsGradingOpen] = useState(false);
    const [gradingSub, setGradingSub] = useState<any>(null);
    const [gradingScore, setGradingScore] = useState('');
    const [gradingFeedback, setGradingFeedback] = useState('');
    const [isSavingGrade, setIsSavingGrade] = useState(false);

    // AI Form state (Existing Copilot)
    const [aiTopic, setAiTopic] = useState('');
    const [aiSubject, setAiSubject] = useState('');
    const [aiGrade, setAiGrade] = useState('');
    const [isDrafting, setIsDrafting] = useState(false);
    const [togglingAttendanceId, setTogglingAttendanceId] = useState<string>('');

    // Lesson Status Map state
    const [lessonStatusMap, setLessonStatusMap] = useState<Record<string, 'Upcoming' | 'Ongoing' | 'Completed'>>({});

    // Sync selected class with classes data
    const activeClassId = selectedClassId || classes?.[0]?.id || '';
    const activeClass = classes?.find((c: any) => c.id === activeClassId);

    // Calculations
    const classStudents = useMemo(() => {
        if (!students || !activeClassId) return [];
        return students.filter((s: any) => s.classId === activeClassId);
    }, [students, activeClassId]);

    const classAttendanceQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !activeClassId || !user) return null;
        return query(
            collection(firestore, 'attendance'),
            where('schoolId', '==', schoolId),
            where('classId', '==', activeClassId)
        );
    }, [firestore, schoolId, activeClassId, user]);

    const { data: attendanceDocs } = useCollection(classAttendanceQuery);

    const studentAttendanceRates = useMemo(() => {
        const rates: Record<string, number> = {};
        classStudents.forEach((s: any) => {
            const studentLogs = attendanceDocs?.filter((a: any) => a.studentId === s.uid) || [];
            const totalDays = studentLogs.length;
            if (totalDays > 0) {
                const presentDays = studentLogs.filter((a: any) => a.status === 'Present' || a.status === 'Late').length;
                rates[s.uid] = Math.round((presentDays / totalDays) * 100);
            } else {
                rates[s.uid] = 95; // Default fallback if no records yet
            }
        });
        return rates;
    }, [classStudents, attendanceDocs]);

    const classAssessments = useMemo(() => {
        if (!assessments || !activeClassId) return [];
        return assessments.filter((a: any) => a.classId === activeClassId);
    }, [assessments, activeClassId]);

    // Timetable Filter for Today
    const todayName = useMemo(() => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date().getDay()];
    }, []);

    const todayLessons = useMemo(() => {
        if (!timetable || !user?.uid) return [];
        return timetable
            .filter((t: any) => (t.teacherId === user?.uid || t.teacher?.uid === user?.uid) && t.day === todayName)
            .sort((a: any, b: any) => (a.startTime || '').localeCompare(b.startTime || ''));
    }, [timetable, user?.uid, todayName]);

    const getLessonStatus = (slotId: string, start: string, end: string) => {
        if (lessonStatusMap[slotId]) return lessonStatusMap[slotId];
        if (!start || !end) return 'Upcoming';
        const now = new Date();
        const curVal = now.getHours() * 60 + now.getMinutes();
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const startVal = sh * 60 + sm;
        const endVal = eh * 60 + em;
        if (curVal < startVal) return 'Upcoming';
        if (curVal >= startVal && curVal <= endVal) return 'Ongoing';
        return 'Completed';
    };

    const classAttendanceAvg = useMemo(() => {
        if (classStudents.length === 0) return 95;
        const total = classStudents.reduce((sum: number, s: any) => sum + (studentAttendanceRates[s.uid] || 95), 0);
        return Math.round(total / classStudents.length);
    }, [classStudents, studentAttendanceRates]);

    const classAvgPct = useMemo(() => {
        if (classAssessments.length === 0) return 0;
        let totalPct = 0;
        let count = 0;
        classAssessments.forEach((a: any) => {
            const score = Number(a.score) || 0;
            const max = Number(a.maxScore) || 100;
            if (max > 0) {
                totalPct += (score / max) * 100;
                count++;
            }
        });
        return count > 0 ? Math.round(totalPct / count) : 0;
    }, [classAssessments]);

    // Student performance details
    const studentPerformance = useMemo(() => {
        const performance: Record<string, { name: string; totalPct: number; count: number; uid: string }> = {};
        classStudents.forEach((s: any) => {
            performance[s.uid] = { name: `${s.firstName || ''} ${s.lastName || ''}`, totalPct: 0, count: 0, uid: s.uid };
        });
        classAssessments.forEach((a: any) => {
            if (performance[a.studentId]) {
                const score = Number(a.score) || 0;
                const max = Number(a.maxScore) || 100;
                if (max > 0) {
                    performance[a.studentId].totalPct += (score / max) * 100;
                    performance[a.studentId].count++;
                }
            }
        });
        return Object.values(performance).map(p => {
            const average = p.count > 0 ? Math.round(p.totalPct / p.count) : 0;
            return {
                ...p,
                average,
                gradedCount: p.count
            };
        });
    }, [classStudents, classAssessments]);

    const subjectAverages = useMemo(() => {
        const averages: Record<string, { totalPct: number; count: number }> = {};
        classAssessments.forEach((a: any) => {
            const score = Number(a.score) || 0;
            const max = Number(a.maxScore) || 100;
            const matchedSub = subjects?.find((s: any) => s.id === a.subjectId);
            const subjName = a.subjectName || matchedSub?.name || a.subjectId || 'General';
            if (max > 0) {
                if (!averages[subjName]) {
                    averages[subjName] = { totalPct: 0, count: 0 };
                }
                averages[subjName].totalPct += (score / max) * 100;
                averages[subjName].count++;
            }
        });
        return Object.entries(averages).map(([name, data]) => ({
            name,
            average: Math.round(data.totalPct / data.count),
            count: data.count
        }));
    }, [classAssessments, subjects]);

    const topPerformers = useMemo(() => {
        return [...studentPerformance]
            .filter(p => p.gradedCount > 0)
            .sort((a, b) => b.average - a.average)
            .slice(0, 3);
    }, [studentPerformance]);

    const strugglingStudents = useMemo(() => {
        return [...studentPerformance]
            .filter(p => p.gradedCount > 0 && p.average < 50)
            .sort((a, b) => a.average - b.average);
    }, [studentPerformance]);

    const chronicAbsentees = useMemo(() => {
        return classStudents.filter((s: any) => (studentAttendanceRates[s.uid] || 95) < 85);
    }, [classStudents, studentAttendanceRates]);

    const awaitingGradingCount = useMemo(() => {
        if (!submissions || !students) return 0;
        const myStudentIds = new Set(students.map((s: any) => s.uid));
        return submissions.filter((sub: any) => myStudentIds.has(sub.studentId) && !sub.graded).length;
    }, [submissions, students]);

    const activeSubmissions = useMemo(() => {
        if (!submissions || !students) return [];
        const myStudentIds = new Set(classStudents.map((s: any) => s.uid));
        return submissions.filter((sub: any) => myStudentIds.has(sub.studentId));
    }, [submissions, classStudents]);

    // Save Handlers
    const handleSaveBehavior = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!behaviorDesc || !behaviorStudent || !firestore) return;
        setIsSavingBehavior(true);
        try {
            await addDoc(collection(firestore, 'behavioral_records'), {
                studentId: behaviorStudent.uid,
                studentName: `${behaviorStudent.firstName} ${behaviorStudent.lastName}`,
                category: behaviorCategory,
                description: behaviorDesc,
                loggedBy: user?.uid,
                teacherName: displayName,
                date: new Date().toISOString(),
                createdAt: serverTimestamp(),
                schoolId
            });
            toast({ title: "Behavior Logged", description: `Recorded ${behaviorCategory} for ${behaviorStudent.firstName}.` });
            setIsBehaviorOpen(false);
            setBehaviorDesc('');
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message || 'Failed to save behavior.' });
        } finally {
            setIsSavingBehavior(false);
        }
    };

    const handleSaveMilestone = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!milestoneTitle || !milestoneDesc || !milestoneStudent || !firestore) return;
        setIsSavingMilestone(true);
        try {
            const { TimelineService } = await import('@/lib/timeline-service');
            await TimelineService.logEvent(firestore, {
                studentId: milestoneStudent.uid,
                title: milestoneTitle,
                description: milestoneDesc,
                category: milestoneCategory as any,
                schoolId,
                recordedBy: displayName,
                recordedById: user?.uid
            });
            toast({ title: "Milestone Logged! ✨", description: "Parent notified successfully." });
            setIsMilestoneOpen(false);
            setMilestoneTitle('');
            setMilestoneDesc('');
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message || 'Failed to log timeline milestone.' });
        } finally {
            setIsSavingMilestone(false);
        }
    };

    const handleSaveGrade = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gradingSub || !firestore) return;
        setIsSavingGrade(true);
        try {
            const subRef = doc(firestore, 'submissions', gradingSub.id);
            await setDoc(subRef, {
                score: Number(gradingScore),
                feedback: gradingFeedback,
                graded: true,
                gradedAt: serverTimestamp(),
                gradedBy: user?.uid
            }, { merge: true });
            toast({ title: "Grade Submitted", description: "Score and feedback updated." });
            setIsGradingOpen(false);
            setGradingScore('');
            setGradingFeedback('');
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message || 'Failed to update grade.' });
        } finally {
            setIsSavingGrade(false);
        }
    };

    const handleStartLesson = (slotId: string, subjectName: string) => {
        setLessonStatusMap(prev => ({ ...prev, [slotId]: 'Ongoing' }));
        toast({ title: "Lesson Started! 📖", description: `Now teaching ${subjectName}. Attendance sheet open.` });
    };

    const handleCompleteLesson = (slotId: string, subjectName: string) => {
        setLessonStatusMap(prev => ({ ...prev, [slotId]: 'Completed' }));
        toast({ title: "Lesson Completed! ✅", description: `Finished teaching ${subjectName}.` });
    };

    const handleCreateAiLessonPlanDraft = (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiTopic) {
            toast({ variant: 'destructive', title: "Topic required", description: "Please enter a topic to plan." });
            return;
        }
        setIsDrafting(true);
        try {
            const draft = {
                topic: aiTopic,
                subject: aiSubject,
                grade: aiGrade || activeClass?.name || '',
                date: new Date().toISOString()
            };
            sessionStorage.setItem('ai_lesson_draft', JSON.stringify(draft));
            toast({ title: "Lesson Draft Prepared", description: "Redirecting to Lesson Planner..." });
            setTimeout(() => {
                window.location.href = '/dashboard/lesson-planning';
            }, 1000);
        } catch (err) {
            console.error(err);
            setIsDrafting(false);
        }
    };

    const handleSendSmsToParent = async (student: any) => {
        if (!student.parentPhone) {
            toast({ variant: 'destructive', title: "SMS Error", description: "No parent phone number registered for this student." });
            return;
        }
        const text = `Hello parent, this is from ${student.firstName}'s class teacher. We wanted to touch base regarding their classroom performance and engagement. Please contact us when free.`;
        toast({ title: "Sending SMS...", description: "Connecting to SMS Gateway" });
        try {
            const idToken = await user?.getIdToken();
            const res = await sendSchoolSMSAction(student.schoolId || schoolId, student.parentPhone, text, idToken);
            if (res.success) {
                toast({ title: "SMS Sent", description: `Message delivered to ${student.firstName}'s parent.` });
            } else {
                toast({ variant: 'destructive', title: "SMS Failed", description: res.error || "Could not deliver message." });
            }
        } catch (err: any) {
            toast({ variant: 'destructive', title: "Error", description: err.message || "Failed to trigger SMS." });
        }
    };

    const handleToggleAttendance = async (student: any) => {
        if (!firestore || !schoolId || !activeClassId) return;
        const dateStr = format(new Date(), 'yyyy-MM-dd');
        const deterministicId = `att-${schoolId}-${activeClassId}-${student.uid}-${dateStr}`;
        setTogglingAttendanceId(student.uid);
        try {
            const docRef = doc(firestore, 'attendance', deterministicId);
            
            // Find existing record today
            const existingLog = attendanceDocs?.find((a: any) => {
                if (!a.date) return false;
                let logDate = a.date.toDate ? a.date.toDate() : new Date(a.date);
                return a.studentId === student.uid && format(logDate, 'yyyy-MM-dd') === dateStr;
            });

            const isPresent = existingLog && (existingLog.status === 'Present' || existingLog.status === 'Late');
            const newStatus = isPresent ? 'Absent' : 'Present';
            const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim();

            await setDoc(docRef, {
                studentId: student.uid,
                studentName,
                classId: activeClassId,
                status: newStatus,
                date: startOfDay(new Date()),
                schoolId: schoolId,
                updatedAt: serverTimestamp(),
                updatedBy: user?.uid
            }, { merge: true });

            if (newStatus === 'Absent') {
                const canteenBillId = `canteen-${student.uid}-${dateStr}`;
                const transportBillId = `transport-${student.uid}-${dateStr}`;
                const batch = writeBatch(firestore);
                batch.delete(doc(firestore, 'financialRecords', canteenBillId));
                batch.delete(doc(firestore, 'financialRecords', transportBillId));
                await batch.commit();
            } else {
                await billStudentForAttendance(firestore, student, new Date(), schoolId);
            }

            toast({ 
                title: `Attendance Updated`, 
                description: `${studentName} marked as ${newStatus} for today.` 
            });
        } catch (err: any) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Error', description: err.message || 'Failed to update attendance.' });
        } finally {
            setTogglingAttendanceId('');
        }
    };

    const exportClassPerformance = () => {
        if (studentPerformance.length === 0) return;
        const csvContent = "data:text/csv;charset=utf-8,Student Name,Graded Assessments,Average Score (%)\n"
            + studentPerformance.map(p => `"${p.name}",${p.gradedCount},${p.average}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${activeClass?.name || 'Class'}_performance.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Visual Hero Mesh Banner */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-violet-900 via-indigo-950 to-slate-900 text-white p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-violet-800/20">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <GraduationCap className="h-48 w-48 transform rotate-12 text-violet-300" />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                                Teacher Workspace
                            </span>
                            <span className="text-[10px] text-slate-400">•</span>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                Live Console
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic leading-tight text-white">
                            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">{displayName.toUpperCase()}</span>! 👋
                        </h1>
                        <p className="text-slate-300 text-xs md:text-sm font-semibold max-w-xl">
                            Empowering classroom instruction. Manage student attendance, review assignments, grade projects, and log student achievements from a single portal.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-between">
                        <div className="flex gap-2">
                            <Button asChild className="bg-violet-700 hover:bg-violet-650 text-white font-black rounded-2xl text-xs uppercase h-11 px-6 shadow-lg shadow-violet-900/30 border-none">
                                <Link href="/dashboard/attendance">Take Attendance</Link>
                            </Button>
                            <Button asChild variant="outline" className="border-white/10 bg-transparent hover:bg-white/10 text-white hover:text-white font-black rounded-2xl text-xs uppercase h-11 px-5">
                                <Link href="/dashboard/academics/gradebook/manual-entry">Manual Grade Entry</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Summary Cards Grid */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
                <Card className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Classes Assigned</p>
                        <h4 className="text-2xl font-black text-slate-800">{classes?.length || 0} Classes</h4>
                    </div>
                </Card>
                <Card className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Lessons Today</p>
                        <h4 className="text-2xl font-black text-slate-800">{todayLessons.length} Periods</h4>
                    </div>
                </Card>
                <Card className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Pending Grading</p>
                        <h4 className={cn("text-2xl font-black", awaitingGradingCount > 0 ? "text-amber-600" : "text-slate-800")}>{awaitingGradingCount} Submissions</h4>
                    </div>
                </Card>
                <Card className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Attendance Rate</p>
                        <h4 className="text-2xl font-black text-emerald-600">{classAttendanceAvg}%</h4>
                    </div>
                </Card>
                <Card className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Interventions Needed</p>
                        <h4 className={cn("text-2xl font-black", (strugglingStudents.length + chronicAbsentees.length) > 0 ? "text-rose-600" : "text-slate-800")}>
                            {strugglingStudents.length + chronicAbsentees.length} Students
                        </h4>
                    </div>
                </Card>
            </div>

            {/* Timetable / Today's Schedule Section */}
            <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div className="space-y-0.5">
                        <h3 className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                            <Clock className="w-5 h-5 text-indigo-500" /> Today's Timetable Schedule ({todayName})
                        </h3>
                        <p className="text-xs text-slate-400 font-bold uppercase">Dynamic periods & active lesson tracking</p>
                    </div>
                </div>

                {todayLessons.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-3">
                        {todayLessons.map((lesson: any) => {
                            const status = getLessonStatus(lesson.id, lesson.startTime, lesson.endTime);
                            return (
                                <div key={lesson.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between gap-3 relative overflow-hidden group hover:scale-[1.01] hover:border-indigo-200 transition-all duration-200">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <Badge className={cn("border-none text-[8px] font-black tracking-wider px-2 py-0.5 rounded-full uppercase",
                                                status === 'Completed' ? "bg-blue-100 text-blue-800" :
                                                status === 'Ongoing' ? "bg-amber-100 text-amber-800 animate-pulse" :
                                                "bg-emerald-100 text-emerald-800"
                                            )}>
                                                {status}
                                            </Badge>
                                            <span className="text-[10px] text-slate-400 font-bold font-mono">{lesson.startTime} - {lesson.endTime}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm text-slate-800 uppercase tracking-tight">{lesson.subjectName || lesson.subjectId}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Classroom: {lesson.classId} {lesson.roomName ? `(${lesson.roomName})` : ''}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 pt-2 border-t border-slate-200/50">
                                        {status !== 'Completed' ? (
                                            <>
                                                {status !== 'Ongoing' ? (
                                                    <Button size="sm" onClick={() => handleStartLesson(lesson.id, lesson.subjectName || lesson.subjectId)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-8 text-[10px] uppercase">
                                                        Start Lesson
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" onClick={() => handleCompleteLesson(lesson.id, lesson.subjectName || lesson.subjectId)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-8 text-[10px] uppercase">
                                                        Complete
                                                    </Button>
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full text-center py-1 text-[10px] font-black text-slate-400 uppercase flex items-center justify-center gap-1">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Lesson Finished
                                            </div>
                                        )}
                                        <Button asChild size="sm" variant="outline" className="rounded-xl h-8 px-2.5">
                                            <Link href="/dashboard/lesson-planning" title="Lesson Planner">
                                                <FileText className="w-3.5 h-3.5 text-slate-500" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <CalendarCheck className="w-8 h-8 text-slate-450 mx-auto mb-2" />
                        <p className="text-xs font-black text-slate-500 uppercase">No periods scheduled for today ({todayName})</p>
                    </div>
                )}
            </Card>

            {/* Classrooms Selector Scrollbar */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Active Classroom</h3>
                    {classes && classes.length > 0 && (
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight bg-slate-100 px-2.5 py-1 rounded-full">
                            {classes.length} Classrooms
                        </span>
                    )}
                </div>
                {classes && classes.length > 0 ? (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                        {classes.map((c: any) => {
                            const isActive = c.id === activeClassId;
                            const studentCount = students?.filter((s: any) => s.classId === c.id).length || 0;
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => setSelectedClassId(c.id)}
                                    className={cn(
                                        "px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider border-2 transition-all flex items-center gap-3 shadow-sm whitespace-nowrap",
                                        isActive
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-indigo-100/40"
                                            : "bg-white text-slate-600 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/10"
                                    )}
                                >
                                    <span>{c.name}</span>
                                    <span className={cn(
                                        "text-[9px] font-black px-2 py-0.5 rounded-full",
                                        isActive ? "bg-indigo-500 text-indigo-100" : "bg-slate-100 text-slate-500"
                                    )}>
                                        {studentCount} Students
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-white border border-dashed rounded-[2rem] border-slate-200">
                        <School className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-black text-slate-500 uppercase">No classrooms assigned to this school</p>
                    </div>
                )}
            </div>

            {/* Dynamic KPI Gauges and Stats Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="hover:shadow-md transition-all border-l-4 border-l-violet-500 overflow-hidden relative rounded-[2rem]">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Class Roll Call</p>
                                <h3 className="text-3xl font-black text-slate-900">
                                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-200" /> : classStudents.length}
                                </h3>
                                <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Active enrollments in {activeClass?.name || 'Class'}</p>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-violet-50 text-violet-600 shadow-inner">
                                <Users className="h-5.5 w-5.5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all border-l-4 border-l-indigo-500 overflow-hidden relative rounded-[2rem]">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1 relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Class Assessment Average</p>
                            <h3 className="text-3xl font-black text-slate-900">
                                {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-200" /> : `${classAvgPct}%`}
                            </h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Across {classAssessments.length} assessment logs</p>
                        </div>
                        <div className="relative flex items-center justify-center w-16 h-16 shrink-0 z-10">
                            <svg className="absolute w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="26" stroke="#e2e8f0" strokeWidth="4.5" fill="transparent" />
                                <circle cx="32" cy="32" r="26" stroke="#6366f1" strokeWidth="4.5" fill="transparent"
                                        strokeDasharray={163.36}
                                        strokeDashoffset={163.36 - (163.36 * classAvgPct) / 100}
                                        strokeLinecap="round" />
                            </svg>
                            <TrendingUp className="h-5 w-5 text-indigo-600 relative z-10" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all border-l-4 border-l-emerald-500 overflow-hidden relative rounded-[2rem]">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1 relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Class Attendance Pulse</p>
                            <h3 className="text-3xl font-black text-slate-900">
                                {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-slate-200" /> : `${classAttendanceAvg}%`}
                            </h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-tight">Average daily attendance rate</p>
                        </div>
                        <div className="relative flex items-center justify-center w-16 h-16 shrink-0 z-10">
                            <svg className="absolute w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="26" stroke="#e2e8f0" strokeWidth="4.5" fill="transparent" />
                                <circle cx="32" cy="32" r="26" stroke="#10b981" strokeWidth="4.5" fill="transparent"
                                        strokeDasharray={163.36}
                                        strokeDashoffset={163.36 - (163.36 * classAttendanceAvg) / 100}
                                        strokeLinecap="round" />
                            </svg>
                            <CalendarCheck className="h-5 w-5 text-emerald-600 relative z-10" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* Left side: Advisory tabs and content */}
                <div className="lg:col-span-3 space-y-6">
                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                        {/* Tab Selector */}
                        <div className="flex gap-4 border-b border-slate-100 pb-4 mb-6 overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setActiveTab('roster')}
                                className={cn(
                                    "pb-1 border-b-2 font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 whitespace-nowrap",
                                    activeTab === 'roster'
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-slate-400 hover:text-slate-655"
                                )}
                            >
                                <Users className="h-4 w-4" />
                                Classroom Roster
                            </button>
                            <button
                                onClick={() => setActiveTab('performance')}
                                className={cn(
                                    "pb-1 border-b-2 font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 whitespace-nowrap",
                                    activeTab === 'performance'
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-slate-400 hover:text-slate-655"
                                )}
                            >
                                <TrendingUp className="h-4 w-4" />
                                Performance Analytics
                            </button>
                            <button
                                onClick={() => setActiveTab('grading')}
                                className={cn(
                                    "pb-1 border-b-2 font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 whitespace-nowrap",
                                    activeTab === 'grading'
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-slate-400 hover:text-slate-655"
                                )}
                            >
                                <CheckSquare className="h-4 w-4" />
                                Grading Console
                            </button>
                            <button
                                onClick={() => setActiveTab('bulletins')}
                                className={cn(
                                    "pb-1 border-b-2 font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center gap-2 whitespace-nowrap",
                                    activeTab === 'bulletins'
                                        ? "border-indigo-600 text-indigo-600"
                                        : "border-transparent text-slate-400 hover:text-slate-655"
                                )}
                            >
                                <Bell className="h-4 w-4" />
                                Bulletins
                            </button>
                        </div>

                        {/* Roster Tab */}
                        {activeTab === 'roster' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">Class Roster List</h4>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Showing {classStudents.length} Students
                                    </span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider pl-1 text-slate-400">
                                    💡 Quick check: click the circle beside a student to mark Present/Absent for today.
                                </p>
                                
                                {classStudents.length > 0 ? (
                                    <div className="space-y-3">
                                        {classStudents.map((s: any) => {
                                            const initials = `${s.firstName?.[0] || ''}${s.lastName?.[0] || ''}`.toUpperCase();
                                            const rate = studentAttendanceRates[s.uid] || 95;
                                            return (
                                                <div key={s.uid} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:scale-[1.01] hover:bg-white hover:border-indigo-100 transition-all duration-200">
                                                    <div className="flex items-center gap-3">
                                                        {(() => {
                                                            const todayStr = format(new Date(), 'yyyy-MM-dd');
                                                            const todayLog = attendanceDocs?.find((a: any) => {
                                                                if (!a.date) return false;
                                                                let logDate = a.date.toDate ? a.date.toDate() : new Date(a.date);
                                                                return a.studentId === s.uid && format(logDate, 'yyyy-MM-dd') === todayStr;
                                                            });
                                                            const status = todayLog?.status;
                                                            const isToggling = togglingAttendanceId === s.uid;

                                                            let btnStyles = "border-2 border-dashed border-slate-300 text-slate-350 hover:bg-emerald-50 hover:text-emerald-500 hover:border-emerald-500";
                                                            let icon = <Plus className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />;
                                                            let tooltip = "Mark Present";

                                                            if (isToggling) {
                                                                btnStyles = "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed";
                                                                icon = <Loader2 className="h-3.5 w-3.5 animate-spin" />;
                                                                tooltip = "Updating...";
                                                            } else if (status === 'Present') {
                                                                btnStyles = "bg-emerald-500 border-emerald-500 text-white hover:bg-rose-500 hover:border-rose-500";
                                                                icon = (
                                                                    <>
                                                                        <Check className="h-3.5 w-3.5 group-hover:hidden" />
                                                                        <X className="h-3.5 w-3.5 hidden group-hover:block" />
                                                                    </>
                                                                );
                                                                tooltip = "Mark Absent";
                                                            } else if (status === 'Absent') {
                                                                btnStyles = "bg-rose-500 border-rose-500 text-white hover:bg-emerald-500 hover:border-emerald-500";
                                                                icon = (
                                                                    <>
                                                                        <X className="h-3.5 w-3.5 group-hover:hidden" />
                                                                        <Check className="h-3.5 w-3.5 hidden group-hover:block" />
                                                                    </>
                                                                );
                                                                tooltip = "Mark Present";
                                                            } else if (status === 'Late') {
                                                                btnStyles = "bg-amber-500 border-amber-500 text-white hover:bg-rose-500 hover:border-rose-500";
                                                                icon = (
                                                                    <>
                                                                        <Clock className="h-3.5 w-3.5 group-hover:hidden" />
                                                                        <X className="h-3.5 w-3.5 hidden group-hover:block" />
                                                                    </>
                                                                );
                                                                tooltip = "Mark Absent";
                                                            } else if (status === 'Excused') {
                                                                btnStyles = "bg-sky-500 border-sky-500 text-white hover:bg-rose-500 hover:border-rose-500";
                                                                icon = (
                                                                    <>
                                                                        <Info className="h-3.5 w-3.5 group-hover:hidden" />
                                                                        <X className="h-3.5 w-3.5 hidden group-hover:block" />
                                                                    </>
                                                                );
                                                                tooltip = "Mark Present";
                                                            }

                                                            return (
                                                                <button
                                                                    onClick={() => !isToggling && handleToggleAttendance(s)}
                                                                    disabled={isToggling}
                                                                    title={tooltip}
                                                                    className={cn(
                                                                        "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shrink-0 group",
                                                                        btnStyles
                                                                    )}
                                                                >
                                                                    {icon}
                                                                </button>
                                                            );
                                                        })()}
                                                        <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs border border-indigo-200 shrink-0">
                                                            {initials || 'ST'}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">
                                                                {s.firstName} {s.lastName}
                                                            </p>
                                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                                Parent: {s.parentPhone || 'No Phone'} {s.house ? `• House: ${s.house}` : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Badge className={cn(
                                                            "border-none text-[8px] font-black tracking-wider px-2 py-0.5 rounded-full uppercase",
                                                            rate >= 90 ? "bg-emerald-100 text-emerald-800" :
                                                            rate >= 80 ? "bg-amber-100 text-amber-800" :
                                                            "bg-rose-105 text-rose-800"
                                                        )}>
                                                            {rate}% Attend
                                                        </Badge>
                                                        
                                                        {/* Log Behavior Trigger */}
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="h-8 rounded-xl text-[9px] font-black uppercase tracking-wider border-slate-200 text-slate-600 hover:bg-indigo-50/20 hover:text-indigo-650"
                                                            onClick={() => {
                                                                setBehaviorStudent(s);
                                                                setIsBehaviorOpen(true);
                                                            }}
                                                        >
                                                            Behavior
                                                        </Button>

                                                        {/* Log Milestone Trigger */}
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline" 
                                                            className="h-8 rounded-xl text-[9px] font-black uppercase tracking-wider border-slate-200 text-slate-600 hover:bg-emerald-50/20 hover:text-emerald-650"
                                                            onClick={() => {
                                                                setMilestoneStudent(s);
                                                                setIsMilestoneOpen(true);
                                                            }}
                                                        >
                                                            + Milestone
                                                        </Button>

                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost" 
                                                            className="h-8 w-8 text-slate-400 hover:text-indigo-600 rounded-xl"
                                                            onClick={() => handleSendSmsToParent(s)}
                                                            title="Send parent SMS"
                                                        >
                                                            <Send className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-slate-50 border border-dashed rounded-[2rem]">
                                        <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">No students registered in this class</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Performance Tab */}
                        {activeTab === 'performance' && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">Subject-wise Score Averages</h4>
                                    <Button size="sm" onClick={exportClassPerformance} className="bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100/50 rounded-lg text-[9px] font-black uppercase">
                                        Export CSV
                                    </Button>
                                </div>

                                {subjectAverages.length > 0 ? (
                                    <div className="h-64">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={subjectAverages}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                                                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                                                <Tooltip contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0' }} />
                                                <Bar dataKey="average" fill="#6366f1" radius={[8, 8, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="p-6 text-center bg-slate-50 border border-dashed rounded-xl text-slate-400 italic text-xs uppercase tracking-widest font-black">
                                        No graded subject logs found
                                    </div>
                                )}

                                {/* Top Performers and Struggling Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    {/* Top Performers */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-1.5 text-amber-600 border-b pb-1.5">
                                            <Award className="h-4 w-4" />
                                            <h5 className="font-black text-xs uppercase tracking-wider">Top Class Performers</h5>
                                        </div>
                                        {topPerformers.length > 0 ? (
                                            <div className="space-y-2">
                                                {topPerformers.map((p: any, idx: number) => (
                                                    <div key={p.uid} className="flex items-center justify-between p-3 bg-amber-50/30 border border-amber-100 rounded-xl">
                                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                                            <span className="text-amber-500 font-black text-sm">
                                                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                                                            </span>
                                                            {p.name}
                                                        </span>
                                                        <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{p.average}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[10px] text-slate-450 italic uppercase font-black tracking-widest">No stats loaded</p>
                                        )}
                                    </div>

                                    {/* Support Needed */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-1.5 text-rose-600 border-b pb-1.5">
                                            <AlertTriangle className="h-4 w-4" />
                                            <h5 className="font-black text-xs uppercase tracking-wider">Academic Intervention</h5>
                                        </div>
                                        {strugglingStudents.length > 0 ? (
                                            <div className="space-y-2">
                                                {strugglingStudents.map((p: any) => (
                                                    <div key={p.uid} className="flex items-center justify-between p-3 bg-rose-50/30 border border-rose-100 rounded-xl">
                                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                                            <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                                                            {p.name}
                                                        </span>
                                                        <span className="text-xs font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">{p.average}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-emerald-50/30 border border-emerald-100 rounded-xl text-center">
                                                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">All students above passing mark</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Grading Tab */}
                        {activeTab === 'grading' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="border-b border-slate-100 pb-3 mb-2 flex justify-between items-center">
                                    <h4 className="font-black text-sm uppercase tracking-tight text-slate-800 font-black">Grading Console</h4>
                                    <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase">
                                        {awaitingGradingCount} Pending Grade
                                    </span>
                                </div>
                                {activeSubmissions.length > 0 ? (
                                    <div className="space-y-3">
                                        {activeSubmissions.map((sub: any) => (
                                            <div key={sub.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-4">
                                                <div>
                                                    <h5 className="font-black text-xs text-slate-850 uppercase">{sub.assignmentTitle || 'Assignment Task'}</h5>
                                                    <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase">Student ID: {sub.studentId.slice(0, 8)} • SubDate: {sub.submittedAt?.toDate ? format(sub.submittedAt.toDate(), 'dd MMM hh:mm a') : 'Recently'}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {sub.graded ? (
                                                        <Badge className="bg-indigo-50 text-indigo-700 border-none font-black text-[9px] px-2.5 py-0.5">
                                                            Score: {sub.score}
                                                        </Badge>
                                                    ) : (
                                                        <Button 
                                                            size="sm" 
                                                            onClick={() => {
                                                                setGradingSub(sub);
                                                                setIsGradingOpen(true);
                                                            }}
                                                            className="bg-amber-500 hover:bg-amber-600 text-white font-black text-[9px] uppercase tracking-wider rounded-xl h-8 border-none"
                                                        >
                                                            Grade
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-slate-50 border border-dashed rounded-[2rem] text-slate-400 font-bold text-xs uppercase tracking-widest">
                                        No quiz submissions tracked in this class
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Bulletins Tab */}
                        {activeTab === 'bulletins' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <div className="border-b border-slate-100 pb-3 mb-2">
                                    <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">School Bulletins</h4>
                                </div>
                                {announcements && announcements.length > 0 ? (
                                    <div className="space-y-4">
                                        {announcements.map((a: any) => (
                                            <div key={a.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <h5 className="font-black text-xs uppercase tracking-tight text-slate-800">{a.title}</h5>
                                                    <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">{a.audience || 'Everybody'}</span>
                                                </div>
                                                <p className="text-xs text-slate-550 font-medium leading-relaxed whitespace-pre-wrap">{a.content}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase pt-1 border-t border-slate-200/40">
                                                    Posted {a.publishedAt?.toDate ? formatDistanceToNow(a.publishedAt.toDate(), { addSuffix: true }) : 'Just now'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-400 italic text-xs uppercase tracking-widest font-black">No announcements posted</div>
                                )}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right side: AI planner copilot and Quick Shortcuts */}
                <div className="lg:col-span-2 space-y-6">
                    {/* AI Insights & Assistant Widget */}
                    <Card className="rounded-[2.5rem] bg-slate-900 border-none shadow-xl overflow-hidden text-white p-6 relative">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                            <BrainCircuit className="h-32 w-32 text-emerald-400" />
                        </div>
                        
                        <div className="space-y-1 mb-5">
                            <CardTitle className="text-lg font-black text-emerald-400 flex items-center gap-2 uppercase italic tracking-tight">
                                <BrainCircuit className="h-5 w-5" /> AI Teaching Assistant
                            </CardTitle>
                            <p className="text-slate-450 font-bold uppercase text-[9px] tracking-widest">
                                Risk predictions, curriculum pacing, & review recommendations
                            </p>
                        </div>

                        {/* Dynamic AI Insights Feed */}
                        <div className="space-y-3 text-xs mb-6 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
                            {strugglingStudents.length > 0 ? (
                                <p className="text-red-400 font-bold flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                                    <span>Academic Risk: {strugglingStudents.map(p => p.name).join(', ')} average score is below passing (50%). Recommend intervention.</span>
                                </p>
                            ) : (
                                <p className="text-emerald-400 font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>All students scored above passing grade average.</span>
                                </p>
                            )}

                            {chronicAbsentees.length > 0 ? (
                                <p className="text-amber-400 font-bold flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                                    <span>Attendance Alert: {chronicAbsentees.map((s: any) => s.firstName).join(', ')} falls below 85% attendance.</span>
                                </p>
                            ) : (
                                <p className="text-emerald-400 font-semibold flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Daily attendance pulse remains healthy (&gt;90%).</span>
                                </p>
                            )}

                            <p className="text-slate-300 flex items-start gap-2 border-t border-slate-800 pt-2 mt-2">
                                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <span>Pacing Check: Math syllabus is 2 days behind target schedule. Revision topics recommended: long division, simple fractions.</span>
                            </p>
                        </div>

                        <form onSubmit={handleCreateAiLessonPlanDraft} className="space-y-4 relative z-10 border-t border-slate-800 pt-4">
                            <h4 className="text-[10px] font-black uppercase text-slate-350 tracking-widest mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-emerald-400"/> AI Draft Lesson planner</h4>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Lesson Topic</label>
                                <Input 
                                    placeholder="e.g. Photosynthesis, Fractions introduction" 
                                    value={aiTopic}
                                    onChange={(e: any) => setAiTopic(e.target.value)}
                                    className="bg-white/5 border-white/10 focus:border-emerald-500 text-white rounded-xl placeholder:text-slate-500 text-xs h-10"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Subject</label>
                                    <Input 
                                        placeholder="e.g. Science, Maths" 
                                        value={aiSubject}
                                        onChange={(e: any) => setAiSubject(e.target.value)}
                                        className="bg-white/5 border-white/10 focus:border-emerald-500 text-white rounded-xl placeholder:text-slate-500 text-xs h-10"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Target Class</label>
                                    <Input 
                                        placeholder="e.g. Grade 5, Nursery 2" 
                                        value={aiGrade}
                                        onChange={(e: any) => setAiGrade(e.target.value)}
                                        className="bg-white/5 border-white/10 focus:border-emerald-500 text-white rounded-xl placeholder:text-slate-500 text-xs h-10"
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isDrafting}
                                className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-lg transition-transform active:scale-95 text-xs uppercase tracking-wider mt-2 flex items-center justify-center gap-2 border-none"
                            >
                                {isDrafting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 fill-current" />}
                                Draft AI Lesson Plan
                            </Button>
                        </form>
                    </Card>

                    {/* Quick Links Console */}
                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-6">
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-4">Quick Link Shortcuts</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/dashboard/attendance" className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-150 hover:bg-indigo-50/20 transition-all flex flex-col items-center text-center gap-1.5 group">
                                <CalendarCheck className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Attendance</span>
                            </Link>
                            <Link href="/dashboard/academics/gradebook/manual-entry" className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-150 hover:bg-indigo-50/20 transition-all flex flex-col items-center text-center gap-1.5 group">
                                <TrendingUp className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Gradebook</span>
                            </Link>
                            <Link href="/dashboard/lesson-planning" className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-150 hover:bg-indigo-50/20 transition-all flex flex-col items-center text-center gap-1.5 group">
                                <FileText className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Lesson Plans</span>
                            </Link>
                            <Link href="/dashboard/assignments" className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-150 hover:bg-indigo-50/20 transition-all flex flex-col items-center text-center gap-1.5 group">
                                <PlusCircle className="h-6 w-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Quizzes</span>
                            </Link>
                        </div>
                    </Card>

                    {/* Private Performance Card */}
                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-gradient-to-br from-indigo-50 to-indigo-100/30 p-6">
                        <div className="space-y-1 mb-4">
                            <h4 className="font-black text-xs uppercase tracking-widest text-indigo-700 flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-indigo-500 fill-indigo-500" /> Private Performance Metrics
                            </h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">Self-evaluation metrics for evaluation</p>
                        </div>
                        <div className="space-y-3.5 text-xs text-slate-700 font-semibold">
                            <div className="flex justify-between items-center">
                                <span>Lessons Completed</span>
                                <span className="font-black text-indigo-700">{todayLessons.filter((l: any) => getLessonStatus(l.id, l.startTime, l.endTime) === 'Completed').length} Today</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Curriculum Progress</span>
                                <span className="font-black text-indigo-700">84% covered</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Attendance Submission Rate</span>
                                <span className="font-black text-indigo-700">98% submissions</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Grading Turnaround Rate</span>
                                <span className="font-black text-indigo-700">24 hours avg</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Modal Overlay: Log Student Behavior */}
            {isBehaviorOpen && behaviorStudent && (
                <>
                    <div onClick={() => setIsBehaviorOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45 animate-in fade-in duration-200" />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl z-50 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <div>
                                <h3 className="font-black text-base uppercase text-slate-800">Log Student Behavior</h3>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">Record incident or commendation for {behaviorStudent.firstName}</p>
                            </div>
                            <button onClick={() => setIsBehaviorOpen(false)} className="text-slate-450 hover:text-slate-655 font-black text-lg">×</button>
                        </div>
                        <form onSubmit={handleSaveBehavior} className="space-y-4 text-sm font-semibold">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Category</label>
                                <select 
                                    value={behaviorCategory} 
                                    onChange={(e: any) => setBehaviorCategory(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 h-10 px-3 rounded-xl font-black text-slate-700 outline-none"
                                >
                                    <option value="commendation">Commendation (Positive) 🌟</option>
                                    <option value="incident">Behavioral Incident (Negative) ⚠️</option>
                                    <option value="counselling">Recommend Counselling 🩺</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Description</label>
                                <textarea 
                                    rows={4}
                                    placeholder="Enter details of the behavioral record..."
                                    value={behaviorDesc}
                                    onChange={(e: any) => setBehaviorDesc(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none font-bold text-slate-750 text-xs placeholder:text-slate-400"
                                />
                            </div>
                            <Button type="submit" disabled={isSavingBehavior} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl h-11 uppercase text-xs tracking-wider border-none">
                                {isSavingBehavior ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Record"}
                            </Button>
                        </form>
                    </div>
                </>
            )}

            {/* Modal Overlay: Log Timeline Milestone */}
            {isMilestoneOpen && milestoneStudent && (
                <>
                    <div onClick={() => setIsMilestoneOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45 animate-in fade-in duration-200" />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl z-50 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <div>
                                <h3 className="font-black text-base uppercase text-slate-800">Log Journey Milestone</h3>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">Timeline event for {milestoneStudent.firstName}</p>
                            </div>
                            <button onClick={() => setIsMilestoneOpen(false)} className="text-slate-450 hover:text-slate-655 font-black text-lg">×</button>
                        </div>
                        <form onSubmit={handleSaveMilestone} className="space-y-4 text-sm font-semibold">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Milestone Category</label>
                                <select 
                                    value={milestoneCategory} 
                                    onChange={(e: any) => setMilestoneCategory(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 h-10 px-3 rounded-xl font-black text-slate-700 outline-none"
                                >
                                    <option value="awards">Awards & Honours 🏆</option>
                                    <option value="leadership">Leadership Appointment 🎖️</option>
                                    <option value="activity">Competition Participation 🎯</option>
                                    <option value="project">Outstanding Project 🎨</option>
                                    <option value="certificate">Certificates & Badges 🎓</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Milestone Title</label>
                                <Input 
                                    placeholder="e.g. Spelling Bee Winner, Class Prefect"
                                    value={milestoneTitle}
                                    onChange={(e: any) => setMilestoneTitle(e.target.value)}
                                    className="bg-slate-50 border-slate-200 text-slate-700 rounded-xl text-xs h-10"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Description</label>
                                <textarea 
                                    rows={3}
                                    placeholder="Enter details of the student's special achievement..."
                                    value={milestoneDesc}
                                    onChange={(e: any) => setMilestoneDesc(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none font-bold text-slate-750 text-xs placeholder:text-slate-400"
                                />
                            </div>
                            <Button type="submit" disabled={isSavingMilestone} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl h-11 uppercase text-xs tracking-wider border-none">
                                {isSavingMilestone ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Log Milestone"}
                            </Button>
                        </form>
                    </div>
                </>
            )}

            {/* Modal Overlay: Submit Assignment Score */}
            {isGradingOpen && gradingSub && (
                <>
                    <div onClick={() => setIsGradingOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45 animate-in fade-in duration-200" />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-2xl z-50 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <div>
                                <h3 className="font-black text-base uppercase text-slate-800">Grade Assignment Submission</h3>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">{gradingSub.assignmentTitle || 'Grading submission'}</p>
                            </div>
                            <button onClick={() => setIsGradingOpen(false)} className="text-slate-450 hover:text-slate-655 font-black text-lg">×</button>
                        </div>
                        <form onSubmit={handleSaveGrade} className="space-y-4 text-sm font-semibold">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Enter Score</label>
                                <Input 
                                    type="number"
                                    placeholder="Score (e.g. 85)"
                                    value={gradingScore}
                                    onChange={(e: any) => setGradingScore(e.target.value)}
                                    className="bg-slate-50 border-slate-200 text-slate-700 rounded-xl text-xs h-10"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Feedback Remarks</label>
                                <textarea 
                                    rows={3}
                                    placeholder="Enter grading remarks..."
                                    value={gradingFeedback}
                                    onChange={(e: any) => setGradingFeedback(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none font-bold text-slate-750 text-xs placeholder:text-slate-400"
                                />
                            </div>
                            <Button type="submit" disabled={isSavingGrade} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl h-11 uppercase text-xs tracking-wider border-none">
                                {isSavingGrade ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Submit Grade"}
                            </Button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
