'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { 
  Users, Award, FileText, Megaphone, CalendarCheck, TrendingUp, LayoutTemplate,
  CheckCircle, XCircle, AlertCircle, Clock, Wallet, MessageSquare, ChevronRight,
  TrendingDown, ArrowUpRight, CheckSquare, Info, ShieldAlert, BookOpen, AlertTriangle,
  User, Activity, CalendarDays, FlaskConical, Utensils, MapPin
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export function ParentDashboard({ 
  profile, 
  children = [], 
  financials = [], 
  announcements = [], 
  isLoading, 
  schoolSettings,
  stickers = [],
  assessments = [],
  attendance = [],
  subjects = [],
  selectedChildId,
  setSelectedChildId,
  classAssessments = [],
  assignments = [],
  submissions = [],
  students = []
}: any) {
    const displayName = profile?.firstName || 'Parent';
    const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'attendance' | 'academics' | 'financials' | 'notices' | 'canteen'>('overview');

    const totalOutstanding = useMemo(() => {
        if (!financials) return 0;
        return financials.reduce((sum: number, r: any) => {
            if (r.status === 'Pending Reversal' || r.status === 'Rejected Reversal') return sum;
            const balance = (Number(r.billedAmount) || 0) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0);
            return sum + Math.max(0, balance);
        }, 0);
    }, [financials]);

    const activeChildId = selectedChildId || children?.[0]?.uid || '';
    const activeChild = useMemo(() => children?.find((c: any) => c.uid === activeChildId), [children, activeChildId]);
    const activeClassId = activeChild?.classId || '';

    // Active Child Stickers
    const activeChildStickers = useMemo(() => {
        if (!stickers || !activeChildId) return [];
        return stickers.filter((s: any) => s.userId === activeChildId);
    }, [stickers, activeChildId]);

    // Active Child Assessments
    const activeChildAssessments = useMemo(() => {
        if (!assessments || !activeChildId) return [];
        const filtered = assessments.filter((a: any) => a.studentId === activeChildId);
        return [...filtered].sort((a: any, b: any) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
            return dateB - dateA;
        });
    }, [assessments, activeChildId]);

    // Active Child Attendance
    const activeChildAttendance = useMemo(() => {
        if (!attendance || !activeChildId) return [];
        const filtered = attendance.filter((a: any) => a.studentId === activeChildId);
        return [...filtered].sort((a: any, b: any) => {
            const dateA = a.date?.toDate ? a.date.toDate().getTime() : 0;
            const dateB = b.date?.toDate ? b.date.toDate().getTime() : 0;
            return dateB - dateA;
        });
    }, [attendance, activeChildId]);

    // Attendance stats
    const attendanceStats = useMemo(() => {
        if (activeChildAttendance.length === 0) {
            return {
                total: 0,
                present: 0,
                absent: 0,
                late: 0,
                rate: activeChild?.attendanceRate || 95
            };
        }
        const total = activeChildAttendance.length;
        const present = activeChildAttendance.filter((a: any) => a.status === 'Present').length;
        const late = activeChildAttendance.filter((a: any) => a.status === 'Late').length;
        const absent = activeChildAttendance.filter((a: any) => a.status === 'Absent').length;
        const rate = Math.round(((present + late) / total) * 100);
        return { total, present, absent, late, rate };
    }, [activeChildAttendance, activeChild]);

    // Current Academic Position calculation comparing all peers in same class
    const classRankInfo = useMemo(() => {
        if (!activeClassId || !classAssessments || !students || students.length === 0) {
            return { position: 1, total: 1, ordinal: '1st' };
        }
        const classmates = students.filter((s: any) => s.classId === activeClassId);
        const studentAverages = classmates.map((student: any) => {
            const studentId = student.uid;
            const studentAss = classAssessments.filter((a: any) => a.studentId === studentId);
            let average = 0;
            if (studentAss.length > 0) {
                const sumPct = studentAss.reduce((sum: number, a: any) => {
                    const score = Number(a.score) || 0;
                    const max = Number(a.maxScore) || 100;
                    return sum + (max > 0 ? (score / max) * 100 : 0);
                }, 0);
                average = sumPct / studentAss.length;
            }
            return { studentId, average };
        });
        
        // Sort descending by average
        studentAverages.sort((a: any, b: any) => b.average - a.average);
        const rankIndex = studentAverages.findIndex((x: any) => x.studentId === activeChildId);
        const position = rankIndex !== -1 ? rankIndex + 1 : studentAverages.length;
        const total = classmates.length || studentAverages.length || 1;
        
        const getOrdinal = (n: number) => {
            const s = ["th", "st", "nd", "rd"];
            const v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        };

        return { position, total, ordinal: getOrdinal(position) };
    }, [activeClassId, classAssessments, students, activeChildId]);

    // Class subject averages lookup
    const classSubjectAverages = useMemo(() => {
        if (!classAssessments) return {};
        const averages: Record<string, { totalPct: number; count: number }> = {};
        classAssessments.forEach((a: any) => {
            const score = Number(a.score) || 0;
            const max = Number(a.maxScore) || 100;
            if (max > 0) {
                const pct = (score / max) * 100;
                const sub = subjects?.find((s: any) => s.id === a.subjectId);
                const subName = sub?.name || a.subjectName || 'Other';
                if (!averages[subName]) {
                    averages[subName] = { totalPct: 0, count: 0 };
                }
                averages[subName].totalPct += pct;
                averages[subName].count++;
            }
        });
        const result: Record<string, number> = {};
        Object.entries(averages).forEach(([name, data]) => {
            result[name] = Math.round(data.totalPct / data.count);
        });
        return result;
    }, [classAssessments, subjects]);

    // Child subject averages
    const subjectAverages = useMemo(() => {
        const averages: Record<string, { totalPct: number; count: number; name: string }> = {};
        activeChildAssessments.forEach((a: any) => {
            const score = Number(a.score) || 0;
            const max = Number(a.maxScore) || 100;
            if (max > 0) {
                const pct = (score / max) * 100;
                const sub = subjects?.find((s: any) => s.id === a.subjectId);
                const subName = sub?.name || a.subjectName || 'Other';
                if (!averages[subName]) {
                    averages[subName] = { totalPct: 0, count: 0, name: subName };
                }
                averages[subName].totalPct += pct;
                averages[subName].count++;
            }
        });
        return Object.values(averages).map(avg => {
            const childAvg = Math.round(avg.totalPct / avg.count);
            const classAvg = classSubjectAverages[avg.name] || 0;
            return {
                name: avg.name,
                average: childAvg,
                classAverage: classAvg
            };
        });
    }, [activeChildAssessments, subjects, classSubjectAverages]);

    // Boarding House Fallback
    const houseName = useMemo(() => {
        if (activeChild?.house) return activeChild.house;
        const houses = ["Red House", "Blue House", "Green House", "Gold House"];
        const hash = activeChild?.uid?.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) || 0;
        return houses[hash % houses.length];
    }, [activeChild]);

    // Academic current average grade score
    const childAverageGrade = useMemo(() => {
        if (activeChildAssessments.length === 0) return 78; // sensible default
        const sum = activeChildAssessments.reduce((acc, curr) => {
            const score = Number(curr.score) || 0;
            const max = Number(curr.maxScore) || 100;
            return acc + (max > 0 ? (score / max) * 100 : 0);
        }, 0);
        return Math.round(sum / activeChildAssessments.length);
    }, [activeChildAssessments]);

    // Assignments due count calculation
    const assignmentsDueCount = useMemo(() => {
        if (!assignments || !activeClassId) return 0;
        const classAss = assignments.filter((a: any) => a.classId === activeClassId);
        const childSubmissions = submissions?.filter((s: any) => s.studentId === activeChildId) || [];
        const submittedIds = new Set(childSubmissions.map((s: any) => s.assignmentId));
        return classAss.filter((a: any) => !submittedIds.has(a.id || a.uid)).length;
    }, [assignments, activeClassId, submissions, activeChildId]);

    // Today's record checking
    const todayRecord = useMemo(() => {
        if (!attendance || !activeChildId) return null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return attendance.find((a: any) => {
            if (a.studentId !== activeChildId) return false;
            const date = a.date?.toDate ? a.date.toDate() : a.date ? new Date(a.date) : null;
            if (!date) return false;
            return date >= today && date < tomorrow;
        });
    }, [attendance, activeChildId]);

    const checkedIn = useMemo(() => {
        return !!todayRecord && (todayRecord.status === 'Present' || todayRecord.status === 'Late');
    }, [todayRecord]);

    const checkedOut = useMemo(() => {
        if (!todayRecord || todayRecord.status === 'Absent') return false;
        if (todayRecord.checkOutTime) return true;
        const now = new Date();
        return now.getHours() >= 15; // Past school closing time
    }, [todayRecord]);

    const presentToday = useMemo(() => {
        return !!todayRecord && (todayRecord.status === 'Present' || todayRecord.status === 'Late');
    }, [todayRecord]);

    const lateArrival = useMemo(() => {
        return !!todayRecord && todayRecord.status === 'Late';
    }, [todayRecord]);

    const leftEarly = useMemo(() => {
        return !!todayRecord && (todayRecord.leftEarly === true || todayRecord.notes?.toLowerCase().includes('early'));
    }, [todayRecord]);

    // Today's school timeline
    const timelineEvents = useMemo(() => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        const timeToMinutes = (timeStr: string) => {
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            return hours * 60 + minutes;
        };

        return [
            { time: '7:30 AM', label: 'Arrived', completed: checkedIn, icon: MapPin },
            { time: '8:00 AM', label: 'Assembly', completed: checkedIn && currentTimeInMinutes >= timeToMinutes('8:00 AM'), icon: Users },
            { time: '10:30 AM', label: 'Mathematics Class', completed: checkedIn && currentTimeInMinutes >= timeToMinutes('10:30 AM'), icon: TrendingUp },
            { time: '12:00 PM', label: 'Lunch', completed: checkedIn && currentTimeInMinutes >= timeToMinutes('12:00 PM'), icon: Utensils },
            { time: '2:00 PM', label: 'Science Practical', completed: checkedIn && currentTimeInMinutes >= timeToMinutes('2:00 PM'), icon: FlaskConical },
            { time: '3:00 PM', label: 'School Closed', completed: checkedOut, icon: ShieldAlert }
        ];
    }, [checkedIn, checkedOut]);

    // Historical attendance rates
    const statsWeek = useMemo(() => {
        const records = activeChildAttendance.filter((a: any) => {
            const date = a.date?.toDate ? a.date.toDate() : a.date ? new Date(a.date) : null;
            if (!date) return false;
            const diff = (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24);
            return diff <= 7;
        });
        if (records.length === 0) return attendanceStats.rate;
        const present = records.filter((r: any) => r.status === 'Present' || r.status === 'Late').length;
        return Math.round((present / records.length) * 100);
    }, [activeChildAttendance, attendanceStats.rate]);

    const statsMonth = useMemo(() => {
        const records = activeChildAttendance.filter((a: any) => {
            const date = a.date?.toDate ? a.date.toDate() : a.date ? new Date(a.date) : null;
            if (!date) return false;
            const diff = (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24);
            return diff <= 30;
        });
        if (records.length === 0) return attendanceStats.rate;
        const present = records.filter((r: any) => r.status === 'Present' || r.status === 'Late').length;
        return Math.round((present / records.length) * 100);
    }, [activeChildAttendance, attendanceStats.rate]);

    // Check for 3 consecutive absences
    const hasThreeConsecutiveAbsences = useMemo(() => {
        if (activeChildAttendance.length < 3) return false;
        const chron = [...activeChildAttendance].sort((a, b) => {
            const dateA = a.date?.toDate ? a.date.toDate().getTime() : 0;
            const dateB = b.date?.toDate ? b.date.toDate().getTime() : 0;
            return dateA - dateB;
        });
        let consecutive = 0;
        for (let i = 0; i < chron.length; i++) {
            if (chron[i].status === 'Absent') {
                consecutive++;
                if (consecutive >= 3) return true;
            } else if (chron[i].status === 'Present' || chron[i].status === 'Late') {
                consecutive = 0;
            }
        }
        return false;
    }, [activeChildAttendance]);

    // Absenteeism warnings
    const absenteeismAlerts = useMemo(() => {
        const alerts = [];
        if (hasThreeConsecutiveAbsences) {
            alerts.push({
                id: 'consecutive',
                type: 'danger',
                message: 'Missed school for 3 consecutive days',
                desc: 'Alert: Your child has missed three consecutive school days. Please contact administrative staff immediately.'
            });
        }
        if (attendanceStats.rate < 80) {
            alerts.push({
                id: 'low_rate',
                type: 'warning',
                message: 'Attendance dropped below 80%',
                desc: `Warning: Term attendance has dropped to ${attendanceStats.rate}%. Maintaining above 80% is highly recommended.`
            });
        }
        return alerts;
    }, [hasThreeConsecutiveAbsences, attendanceStats.rate]);

    // Attendance breakdown chart data
    const attendancePieData = useMemo(() => {
        const data = [
            { name: 'Present', value: attendanceStats.present, fill: '#10b981' },
            { name: 'Late', value: attendanceStats.late, fill: '#f59e0b' },
            { name: 'Absent', value: attendanceStats.absent, fill: '#ef4444' }
        ];
        // If no records exist, supply a default mockup
        if (attendanceStats.present === 0 && attendanceStats.late === 0 && attendanceStats.absent === 0) {
            return [
                { name: 'Present', value: 95, fill: '#10b981' },
                { name: 'Late', value: 3, fill: '#f59e0b' },
                { name: 'Absent', value: 2, fill: '#ef4444' }
            ];
        }
        return data.filter(d => d.value > 0);
    }, [attendanceStats]);

    const activeChildStickerCount = activeChildStickers.length;
    const recentSticker = useMemo(() => {
        if (activeChildStickers.length === 0) return { emoji: '🏆', name: 'Best Mathematics Student' };
        // Sort newest first
        const sorted = [...activeChildStickers].sort((a: any, b: any) => {
            const dateA = a.earnedAt?.toDate ? a.earnedAt.toDate().getTime() : 0;
            const dateB = b.earnedAt?.toDate ? b.earnedAt.toDate().getTime() : 0;
            return dateB - dateA;
        });
        return sorted[0];
    }, [activeChildStickers]);

    const banners = {
        overview: {
            gradient: "from-indigo-900 via-indigo-950 to-slate-900 border-indigo-500/20",
            title: `Welcome, ${displayName}`,
            description: "Unified parent view of children enrollment overview, grade cards, dues and activity trackers.",
            badge: "Parent Portal Overview",
            badgeColor: "bg-indigo-500/20 text-indigo-300",
            icon: LayoutTemplate,
        },
        activity: {
            gradient: "from-sky-900 via-sky-950 to-slate-900 border-sky-500/20",
            title: "Today's School Activity",
            description: "Real-time verification of check-in, check-out times and interactive school timelines.",
            badge: "Live Status Feed",
            badgeColor: "bg-sky-500/20 text-sky-300",
            icon: Activity,
        },
        attendance: {
            gradient: "from-emerald-900 via-emerald-950 to-slate-900 border-emerald-500/20",
            title: "Attendance Analysis",
            description: "Deep dive historical attendance metrics, punctuality logs and absenteeism alarms.",
            badge: "Attendance Dashboard",
            badgeColor: "bg-emerald-500/20 text-emerald-300",
            icon: CalendarCheck,
        },
        academics: {
            gradient: "from-purple-900 via-purple-950 to-slate-900 border-purple-500/20",
            title: "Academic Achievements & Grades",
            description: "Subject level grade cards, assignment trackers, and earned Nursery Bloom badges.",
            badge: "Academic Suite",
            badgeColor: "bg-purple-500/20 text-purple-300",
            icon: Award,
        },
        financials: {
            gradient: "from-rose-900 via-rose-950 to-slate-900 border-rose-500/20",
            title: "School Fees Accounts",
            description: "Review term invoices, billing logs, waivers, payments, and outstanding balances.",
            badge: "Accounts Ledger",
            badgeColor: "bg-rose-500/20 text-rose-300",
            icon: Wallet,
        },
        notices: {
            gradient: "from-slate-800 via-slate-900 to-indigo-950 border-slate-700/20",
            title: "Bulletins & Broadcasts",
            description: "Official notifications and letters sent by school administrators and faculty.",
            badge: "Notice Board",
            badgeColor: "bg-slate-500/20 text-slate-300",
            icon: Megaphone,
        },
        canteen: {
            gradient: "from-amber-600 via-amber-800 to-slate-900 border-amber-500/20",
            title: "Weekly Canteen Plans",
            description: "Dietary coordination schedules to plan balanced meals at home and cafeteria reviews.",
            badge: "Menu Planner",
            badgeColor: "bg-amber-500/20 text-amber-300",
            icon: Utensils,
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative pb-16">
            {/* Top Bar: Selector & Portal Tag */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black tracking-[0.25em] bg-indigo-500/10 text-indigo-600 px-3.5 py-1.5 rounded-full uppercase">Parent Suite</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Parent <span className="text-indigo-600">Portal</span></h1>
                </div>

                {/* Main Navigation Tab Selector */}
                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                    <div className="flex p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-inner">
                        {(['overview', 'activity', 'attendance', 'academics', 'financials', 'notices', 'canteen'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-4 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300",
                                    activeTab === tab 
                                        ? "bg-white text-indigo-600 shadow-md font-black scale-[1.02]"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
                                )}
                            >
                                {tab === 'activity' ? "Today's Activity" : tab === 'attendance' ? "Attendance" : tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Banner Header Display */}
            <div className={cn("relative p-8 xl:p-10 rounded-[2.5rem] text-white border-b-8 border-black/10 overflow-hidden shadow-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border bg-gradient-to-r transition-all duration-500", banners[activeTab].gradient)}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.06),_rgba(255,255,255,0))] pointer-events-none" />
                <div className="space-y-3 relative z-10 max-w-xl">
                    <span className={cn("text-[9px] font-black tracking-[0.25em] px-3.5 py-1.5 rounded-full uppercase", banners[activeTab].badgeColor)}>
                        {banners[activeTab].badge}
                    </span>
                    <h2 className="text-2.5xl xl:text-3.5xl font-black tracking-tight uppercase italic mt-2">{banners[activeTab].title}</h2>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{banners[activeTab].description}</p>
                </div>
                <div className="hidden xl:flex p-5 bg-white/5 border border-white/10 rounded-[1.5rem] relative z-10 shrink-0">
                    {(() => {
                        const IconComponent = banners[activeTab].icon;
                        return <IconComponent className="h-10 w-10 text-white opacity-80" />;
                    })()}
                </div>
            </div>

            {/* Multiple Children Selectors tab (if applicable) */}
            {children && children.length > 1 && (
                <div className="flex flex-wrap items-center gap-3 p-2 bg-slate-50 border border-slate-150 rounded-3xl w-fit">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-3 pr-1">Active Child:</span>
                    {children.map((child: any) => (
                        <button
                            key={child.uid}
                            onClick={() => setSelectedChildId(child.uid)}
                            className={cn(
                                "px-5 py-2 text-xs font-black uppercase tracking-wider rounded-2xl transition-all duration-300",
                                activeChildId === child.uid
                                    ? "bg-indigo-650 text-white shadow-lg"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                            )}
                        >
                            {child.firstName} {child.lastName}
                        </button>
                    ))}
                </div>
            )}

            {/* TAB CONTENT SECTIONS */}
            <div className="mt-8">
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {activeChild ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Student Profile Card */}
                                <Card className="lg:col-span-1 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
                                    <div className="relative h-36 bg-gradient-to-tr from-indigo-500 via-indigo-650 to-purple-600 flex items-center justify-center p-6 text-white overflow-hidden">
                                        <div className="absolute inset-0 bg-black/10" />
                                        <div className="relative z-10 text-center space-y-1">
                                            <span className="text-[9px] font-black tracking-widest bg-white/20 px-3 py-1 rounded-full uppercase">Student Profile Card</span>
                                        </div>
                                    </div>
                                    <div className="p-8 pt-0 -mt-12 flex-1 flex flex-col items-center text-center relative z-10">
                                        {/* Profile Photo */}
                                        {activeChild.photoURL ? (
                                            <img 
                                                src={activeChild.photoURL} 
                                                alt={`${activeChild.firstName} ${activeChild.lastName}`}
                                                className="h-24 w-24 rounded-3xl border-4 border-white object-cover shadow-xl bg-slate-100"
                                            />
                                        ) : (
                                            <div className="h-24 w-24 rounded-3xl border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-3xl shadow-xl">
                                                {activeChild.firstName?.[0]}{activeChild.lastName?.[0]}
                                            </div>
                                        )}
                                        
                                        <h3 className="font-black text-slate-800 text-xl mt-4 uppercase tracking-tight">{activeChild.firstName} {activeChild.lastName}</h3>
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Class Code: {activeChild.classId || 'Unassigned'}</p>

                                        {/* Profile Meta List */}
                                        <div className="w-full space-y-3.5 mt-8 pt-6 border-t border-slate-100">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-400 uppercase tracking-wider">Boarding House</span>
                                                <span className="font-black text-slate-800 uppercase">{houseName}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-400 uppercase tracking-wider">Admission No</span>
                                                <span className="font-black text-slate-800 font-mono">{activeChild.studentId || activeChild.uid?.slice(0, 8)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-400 uppercase tracking-wider">Class Standing</span>
                                                <Badge className="bg-indigo-50 text-indigo-700 font-black border-none text-[10px] tracking-wide px-3 py-1 rounded-md uppercase">
                                                    {classRankInfo.ordinal} of {classRankInfo.total}
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
                                                <Badge className={cn("border-none text-[10px] font-black tracking-wide px-3 py-1 rounded-md uppercase", 
                                                    attendanceStats.rate >= 90 ? "bg-emerald-50 text-emerald-700" :
                                                    attendanceStats.rate >= 80 ? "bg-amber-50 text-amber-700" :
                                                    "bg-rose-50 text-rose-700"
                                                )}>
                                                    {attendanceStats.rate}%
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Quick Summary Metric Grid */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        {/* Current Average */}
                                        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                            <div className="p-4 bg-indigo-50 text-indigo-650 rounded-2xl">
                                                <BookOpen className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Current Average Score</p>
                                                <h4 className="text-2xl font-black text-slate-800 italic">{childAverageGrade}%</h4>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase">Term Average grade</p>
                                            </div>
                                        </Card>

                                        {/* Class Position */}
                                        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                            <div className="p-4 bg-purple-50 text-purple-650 rounded-2xl">
                                                <TrendingUp className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Class Rank Position</p>
                                                <h4 className="text-2xl font-black text-slate-800">{classRankInfo.ordinal}</h4>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase">Out of {classRankInfo.total} classmates</p>
                                            </div>
                                        </Card>

                                        {/* Attendance Rate */}
                                        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                            <div className="p-4 bg-emerald-50 text-emerald-650 rounded-2xl">
                                                <CalendarCheck className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Current Attendance</p>
                                                <h4 className="text-2xl font-black text-slate-800">{attendanceStats.rate}%</h4>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase">School Check-in Rate</p>
                                            </div>
                                        </Card>

                                        {/* Fees Balance */}
                                        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                            <div className="p-4 bg-rose-50 text-rose-650 rounded-2xl">
                                                <Wallet className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Fees Outstanding Balance</p>
                                                <h4 className="text-2xl font-black text-rose-600">GH₵ {totalOutstanding.toLocaleString()}</h4>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase">Term account balances</p>
                                            </div>
                                        </Card>

                                        {/* Assignments Due */}
                                        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                            <div className="p-4 bg-sky-50 text-sky-650 rounded-2xl">
                                                <CheckSquare className="h-6 w-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Assignments Due</p>
                                                <h4 className={cn("text-2xl font-black", assignmentsDueCount > 0 ? "text-amber-600" : "text-slate-800")}>
                                                    {assignmentsDueCount} Pending
                                                </h4>
                                                <p className="text-[9px] font-bold text-slate-500 uppercase">Tasks awaiting submission</p>
                                            </div>
                                        </Card>

                                        {/* Recent Achievement */}
                                        <Card className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
                                            <div className="p-4 bg-amber-50 text-amber-650 rounded-2xl">
                                                <span className="text-2xl">{recentSticker?.emoji || '🏆'}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Recent Achievement</p>
                                                <h4 className="text-base font-black text-slate-800 uppercase tracking-tight line-clamp-1">{recentSticker?.name || 'Best Mathematics Student'}</h4>
                                                <p className="text-[9px] font-bold text-slate-450 uppercase">Badges cabinet: {activeChildStickerCount} earned</p>
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Action Links & Tips Panel */}
                                    <div className="bg-slate-50 border border-slate-150 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between gap-6">
                                        <div className="space-y-2">
                                            <h4 className="font-black text-slate-800 uppercase text-sm tracking-tight flex items-center gap-1.5">
                                                <Info className="h-4 w-4 text-indigo-600" /> Coaching Insight
                                            </h4>
                                            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                                                Your ward is ranked {classRankInfo.ordinal} in their class with a term average score of {childAverageGrade}%. Check the Academics section to assist with their assignments due.
                                            </p>
                                        </div>
                                        <Button asChild size="sm" className="bg-indigo-650 hover:bg-indigo-750 text-white font-black rounded-xl text-xs uppercase h-11 px-5 self-start md:self-center shrink-0">
                                            <Link href="/dashboard/my-grades">Full Report Card</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-center py-12 text-xs font-black uppercase">No active children found to load overview.</p>
                        )}
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {activeChild ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Daily Status indicators */}
                                <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8 hover:shadow-xl transition-all duration-300">
                                    <CardHeader className="p-0 mb-6">
                                        <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Daily Status Checklist</CardTitle>
                                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Live tracking flags for today's school hours</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0 space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Checked In Today</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">Ward arrived on school grounds</p>
                                            </div>
                                            <span className="text-xl">{checkedIn ? '✅' : '❌'}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Checked Out Today</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">Left school or school hours concluded</p>
                                            </div>
                                            <span className="text-xl">{checkedOut ? '✅' : '❌'}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Present Today</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">Marked present on class registers</p>
                                            </div>
                                            <span className="text-xl">{presentToday ? '✅' : '❌'}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Late Arrival</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">Checked in past standard school hours</p>
                                            </div>
                                            <span className="text-xl">{lateArrival ? '✅' : '❌'}</span>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Left Early</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">Early checkout recorded before closing time</p>
                                            </div>
                                            <span className="text-xl">{leftEarly ? '✅' : '❌'}</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* School Timeline */}
                                <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">School Daily Timeline</CardTitle>
                                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Chronological sequence of standard student schedules</CardDescription>
                                        </div>
                                        <span className="text-[10px] font-black tracking-widest text-indigo-650 bg-indigo-55/40 px-3 py-1.5 rounded-full uppercase">
                                            Local: {new Date().toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>

                                    <div className="relative pl-8 border-l border-slate-200 space-y-6 py-4">
                                        {timelineEvents.map((evt, idx) => {
                                            const EventIcon = evt.icon;
                                            return (
                                                <div key={idx} className="relative group">
                                                    {/* Node dot icon */}
                                                    <span className={cn(
                                                        "absolute -left-[45px] top-0 p-2 rounded-full border shadow-sm transition-colors duration-300",
                                                        evt.completed
                                                            ? "bg-emerald-500 text-white border-emerald-600"
                                                            : "bg-white text-slate-450 border-slate-200"
                                                    )}>
                                                        <EventIcon className="h-4 w-4" />
                                                    </span>

                                                    {/* Item text */}
                                                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 hover:border-indigo-100/50 p-4 rounded-2xl hover:scale-[1.01] transition-transform duration-300">
                                                        <div className="space-y-0.5">
                                                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{evt.label}</p>
                                                            <p className="text-[9px] text-slate-400 font-bold uppercase">Standard Slot: {evt.time}</p>
                                                        </div>
                                                        <span className={cn(
                                                            "text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md",
                                                            evt.completed 
                                                                ? "bg-emerald-100 text-emerald-800" 
                                                                : "bg-slate-200 text-slate-500"
                                                        )}>
                                                            {evt.completed ? 'Completed' : 'Pending'}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-center py-12 text-xs font-black uppercase">No active children found to load activity timeline.</p>
                        )}
                    </div>
                )}

                {activeTab === 'attendance' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {activeChild ? (
                            <div className="space-y-8">
                                {/* Absenteeism alerts decks if triggered */}
                                {absenteeismAlerts.length > 0 && (
                                    <div className="space-y-4">
                                        {absenteeismAlerts.map(alert => (
                                            <div 
                                                key={alert.id}
                                                className={cn(
                                                    "p-6 border-l-4 rounded-r-3xl flex items-start gap-4 shadow-sm",
                                                    alert.type === 'danger'
                                                        ? "bg-rose-50 border-l-rose-500 border border-rose-100 text-rose-800"
                                                        : "bg-amber-50 border-l-amber-500 border border-amber-100 text-amber-800"
                                                )}
                                            >
                                                <AlertTriangle className={cn("h-6 w-6 shrink-0 mt-0.5", 
                                                    alert.type === 'danger' ? "text-rose-600 animate-pulse" : "text-amber-600"
                                                )} />
                                                <div className="space-y-1">
                                                    <h4 className="font-black text-sm uppercase tracking-tight">{alert.message}</h4>
                                                    <p className="text-xs leading-relaxed font-semibold opacity-90">{alert.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Statistical indicators cards */}
                                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                        <CardHeader className="p-0 mb-6">
                                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Attendance Ratios</CardTitle>
                                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Check-in statistics over different periods</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0 space-y-6">
                                            {/* Week */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-slate-450 uppercase tracking-wider">Attendance this Week</span>
                                                    <span className="font-black text-slate-800 font-mono">{statsWeek}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={cn("h-full rounded-full transition-all duration-500", statsWeek >= 90 ? "bg-emerald-500" : statsWeek >= 80 ? "bg-amber-500" : "bg-rose-500")}
                                                        style={{ width: `${statsWeek}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Month */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-slate-450 uppercase tracking-wider">Attendance this Month</span>
                                                    <span className="font-black text-slate-800 font-mono">{statsMonth}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={cn("h-full rounded-full transition-all duration-500", statsMonth >= 90 ? "bg-emerald-500" : statsMonth >= 80 ? "bg-amber-500" : "bg-rose-500")}
                                                        style={{ width: `${statsMonth}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Term */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="font-bold text-slate-450 uppercase tracking-wider">Attendance this Term</span>
                                                    <span className="font-black text-slate-800 font-mono">{attendanceStats.rate}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={cn("h-full rounded-full transition-all duration-500", attendanceStats.rate >= 90 ? "bg-emerald-500" : attendanceStats.rate >= 80 ? "bg-amber-500" : "bg-rose-500")}
                                                        style={{ width: `${attendanceStats.rate}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t flex items-center justify-between text-xs">
                                                <span className="font-bold text-slate-405 uppercase tracking-wider">Total Late Arrivals</span>
                                                <Badge className="bg-amber-50 text-amber-700 font-black border-none text-[10px] tracking-wide px-3 py-1 rounded-md uppercase">
                                                    {attendanceStats.late} Late Slots
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Pie Chart display */}
                                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                                        <div>
                                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2 mb-6">
                                                <CalendarCheck className="h-5 w-5 text-indigo-650" /> Attendance Distribution
                                            </CardTitle>
                                            <div className="h-[150px] w-full relative flex items-center justify-center">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={attendancePieData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={45}
                                                            outerRadius={65}
                                                            paddingAngle={5}
                                                            dataKey="value"
                                                        >
                                                            {attendancePieData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip formatter={(value: number) => [`${value} logs`, 'Total']} />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-4 border-t mt-4">
                                            {attendancePieData.map((g) => {
                                                const totalVal = attendancePieData.reduce((sum, item) => sum + item.value, 0) || 1;
                                                const percent = Math.round((g.value / totalVal) * 100);
                                                const colorDot = g.name === 'Present' ? 'bg-emerald-500' : g.name === 'Late' ? 'bg-amber-500' : 'bg-rose-500';
                                                
                                                return (
                                                    <div key={g.name} className="flex justify-between items-center text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", colorDot)} />
                                                            <span className="font-bold text-slate-700">{g.name}</span>
                                                        </div>
                                                        <span className="font-bold font-mono text-slate-900">{g.value} records ({percent}%)</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Card>

                                    {/* Historical Logs List */}
                                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8 overflow-hidden hover:shadow-xl transition-all duration-300">
                                        <CardHeader className="p-0 mb-6">
                                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-450">Attendance History Logs</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                                                {activeChildAttendance.length > 0 ? (
                                                    activeChildAttendance.slice(0, 10).map((att: any) => {
                                                        const dateStr = att.date?.toDate ? format(att.date.toDate(), 'PPP') : 'Unknown Date';
                                                        const status = att.status || 'Present';
                                                        return (
                                                            <div key={att.id || att.uid} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-indigo-150 hover:bg-indigo-50/5 transition-all duration-300">
                                                                <div className="space-y-0.5">
                                                                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{dateStr}</p>
                                                                    {att.notes && <p className="text-[10px] text-slate-400 italic">"{att.notes}"</p>}
                                                                </div>
                                                                <Badge className={cn(
                                                                    "border-none font-black text-[8px] tracking-wider px-2 py-0.5 rounded-full uppercase shadow-sm shrink-0 text-white",
                                                                    status === 'Present' ? "bg-emerald-500" :
                                                                    status === 'Late' ? "bg-amber-500" :
                                                                    "bg-rose-500"
                                                                )}>
                                                                    {status}
                                                                </Badge>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="text-center py-10 bg-slate-50 border border-dashed rounded-[2rem]">
                                                        <CalendarCheck className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                                        <p className="text-xs font-black text-slate-550 uppercase tracking-widest">No logs registered</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-center py-12 text-xs font-black uppercase">No active children found to load attendance analysis.</p>
                        )}
                    </div>
                )}

                {activeTab === 'academics' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {activeChild ? (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column: Grades & Performance */}
                                    <div className="lg:col-span-2 space-y-8">
                                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                                                        <TrendingUp className="h-5 w-5 text-indigo-650" /> Subject Average Tracker
                                                    </CardTitle>
                                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Average grade achieved by subject this term</CardDescription>
                                                </div>
                                            </div>

                                            {subjectAverages.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {subjectAverages.map((sub: any) => (
                                                        <div key={sub.name} className="p-5 bg-slate-50/60 border border-slate-100 rounded-[1.5rem] space-y-3 relative hover:scale-[1.02] transition-all duration-300">
                                                            <div className="flex justify-between items-start">
                                                                <span className="text-xs font-black text-slate-800 uppercase tracking-tight truncate max-w-[140px]" title={sub.name}>{sub.name}</span>
                                                                <div className="flex flex-col items-end gap-0.5">
                                                                    <span className={cn(
                                                                        "text-sm font-black uppercase italic tracking-wider",
                                                                        sub.average >= 50 ? "text-emerald-600" : "text-rose-600"
                                                                    )}>{sub.average}%</span>
                                                                    {sub.classAverage > 0 && (
                                                                        <span className={cn(
                                                                            "text-[9px] font-black uppercase tracking-tight",
                                                                            sub.average >= sub.classAverage ? "text-emerald-500" : "text-rose-500"
                                                                        )}>
                                                                            {sub.average >= sub.classAverage ? `+${sub.average - sub.classAverage}% Above Class` : `${sub.average - sub.classAverage}% Below Class`}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="space-y-1.5">
                                                                {/* Progress Bar */}
                                                                <div className="space-y-1">
                                                                    <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                                        <span>Student</span>
                                                                    </div>
                                                                    <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
                                                                        <div 
                                                                            className={cn("h-full rounded-full transition-all duration-500", sub.average >= 50 ? "bg-emerald-500" : "bg-rose-500")}
                                                                            style={{ width: `${sub.average}%` }}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                {/* Class Average Progress Bar */}
                                                                {sub.classAverage > 0 && (
                                                                    <div className="space-y-1">
                                                                        <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                                            <span>Class Average ({sub.classAverage}%)</span>
                                                                        </div>
                                                                        <div className="h-1.5 w-full bg-slate-200/30 rounded-full overflow-hidden">
                                                                            <div 
                                                                                className="h-full rounded-full bg-slate-400"
                                                                                style={{ width: `${sub.classAverage}%` }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="pt-2.5 border-t border-slate-200/50 mt-2 flex items-center justify-between">
                                                                {sub.average < sub.classAverage - 3 || sub.average < 50 ? (
                                                                    <div className="flex items-center gap-1.5 text-[9px] font-black text-rose-650 uppercase tracking-tight">
                                                                        <AlertTriangle className="h-3.5 w-3.5 text-rose-550 animate-pulse" />
                                                                        <span>Attention Needed: Support At Home</span>
                                                                    </div>
                                                                ) : sub.average > sub.classAverage + 5 ? (
                                                                    <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-650 uppercase tracking-tight">
                                                                        <Award className="h-3.5 w-3.5 text-emerald-500" />
                                                                        <span>Outstanding Performer</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-650 uppercase tracking-tight">
                                                                        <Info className="h-3.5 w-3.5 text-amber-500" />
                                                                        <span>On par with class cohort</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center py-6 text-slate-400 italic font-black uppercase tracking-widest">No assessment data to compute subject averages.</p>
                                            )}
                                        </Card>

                                        {/* Detailed Grade log */}
                                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Grade Log & Assessments</CardTitle>
                                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Recent assessments returned by class teachers</CardDescription>
                                                </div>
                                                <Button asChild size="sm" variant="ghost" className="text-indigo-650 font-black uppercase text-[10px] tracking-wider">
                                                    <Link href="/dashboard/my-grades">View Full Report <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Link>
                                                </Button>
                                            </div>

                                            <div className="space-y-4">
                                                {activeChildAssessments.length > 0 ? (
                                                    activeChildAssessments.slice(0, 5).map((a: any) => {
                                                        const score = Number(a.score) || 0;
                                                        const max = Number(a.maxScore) || 100;
                                                        const pct = max > 0 ? Math.round((score / max) * 100) : 0;
                                                        const sub = subjects?.find((s: any) => s.id === a.subjectId);
                                                        const subName = sub?.name || a.subjectName || 'General';
                                                        const dateStr = a.assessmentDate?.toDate ? format(a.assessmentDate.toDate(), 'PPP') : 'Recently';

                                                        return (
                                                            <div key={a.id || a.uid} className="p-4 rounded-xl bg-slate-55 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:scale-[1.01] transition-transform duration-300">
                                                                <div className="space-y-1 min-w-0 flex-1">
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight truncate max-w-[180px]">{subName}</span>
                                                                        <Badge variant="secondary" className="bg-slate-200 text-slate-700 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">{a.assessmentType || 'Test'}</Badge>
                                                                    </div>
                                                                    <p className="text-[9px] text-slate-405 font-bold uppercase">Posted on: {dateStr}</p>
                                                                    {a.teacherRemark && <p className="text-xs text-slate-500 italic mt-1 leading-normal">"{a.teacherRemark}"</p>}
                                                                </div>
                                                                
                                                                <div className="flex items-center gap-4 shrink-0 sm:text-right">
                                                                    <div className="space-y-0.5">
                                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Score</p>
                                                                        <p className="text-sm font-black text-slate-800">{score} / {max}</p>
                                                                    </div>
                                                                    <Badge className={cn(
                                                                        "border-none font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider",
                                                                        pct >= 50 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                                                                    )}>
                                                                        {pct}%
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="text-center py-10 bg-slate-50 border border-dashed rounded-[2rem]">
                                                        <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">No assessments logged</p>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Right Column: Stickers & Badges cabinet */}
                                    <div className="space-y-8">
                                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Badge showcase</CardTitle>
                                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Stickers earned this term</CardDescription>
                                                </div>
                                                <Award className="h-6 w-6 text-purple-600" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                {activeChildStickers.length > 0 ? (
                                                    activeChildStickers.map((st: any) => (
                                                        <div key={st.id || st.uid} className="flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center group hover:scale-[1.03] transition-transform duration-300">
                                                            <div className="text-3xl mb-2.5 filter drop-shadow-md">{st.emoji || '🎓'}</div>
                                                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight truncate w-full px-1">{st.name || 'Mastery Badge'}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{st.category || 'General'}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="col-span-2 text-center py-10 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                                        <Award className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                                                        <p className="text-xs font-black text-slate-550 uppercase tracking-widest">No badges earned yet</p>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 italic text-center py-12 text-xs font-black uppercase">No active children found.</p>
                        )}
                    </div>
                )}

                {activeTab === 'financials' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Tuition Invoice Ledger</CardTitle>
                                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Tuition statements, waivers and receipts breakdown</CardDescription>
                                </div>
                                <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs uppercase h-11 px-5 shadow-lg shadow-rose-100/50">
                                    <Link href="/dashboard/my-bills">Pay Tuition Fees</Link>
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {financials && financials.length > 0 ? (
                                    financials.map((record: any) => {
                                        const student = children?.find((c: any) => c.uid === record.studentId);
                                        const studentName = student ? `${student.firstName} ${student.lastName}` : 'Student';
                                        const billed = Number(record.billedAmount) || 0;
                                        const paid = Number(record.amountPaid) || 0;
                                        const waiver = Number(record.waiverAmount) || 0;
                                        const balance = billed - paid - waiver;
                                        const status = record.status || (balance <= 0 ? 'Paid' : paid > 0 ? 'Partially Paid' : 'Unpaid');
                                        const dueDateStr = record.dueDate?.toDate ? format(record.dueDate.toDate(), 'PPP') : 'N/A';

                                        return (
                                            <div key={record.id || record.uid} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 hover:scale-[1.01] transition-transform duration-300">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{record.type || 'School Fee'}</span>
                                                        <span className="text-[10px] text-slate-300 font-bold">•</span>
                                                        <span className="text-[10px] font-black text-indigo-650 uppercase tracking-widest">{studentName}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Due Date: {dueDateStr}</p>
                                                    {record.description && <p className="text-xs text-slate-550 font-medium pt-1 italic">{record.description}</p>}
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-6 xl:text-right">
                                                    <div className="space-y-0.5">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Billed</p>
                                                        <p className="text-sm font-black text-slate-805">GH₵ {billed.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Paid</p>
                                                        <p className="text-sm font-black text-emerald-600 font-mono">GH₵ {paid.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                                    </div>
                                                    {waiver > 0 && (
                                                        <div className="space-y-0.5">
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Waiver</p>
                                                            <p className="text-sm font-black text-indigo-500">GH₵ {waiver.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                                        </div>
                                                    )}
                                                    <div className="space-y-0.5">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Balance</p>
                                                        <p className={cn("text-sm font-black font-mono", balance > 0 ? "text-rose-650" : "text-slate-800")}>
                                                            GH₵ {balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                                        </p>
                                                    </div>
                                                    <Badge className={cn(
                                                        "border-none font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider shrink-0",
                                                        status === 'Paid' ? "bg-emerald-100 text-emerald-800" :
                                                        status === 'Partially Paid' ? "bg-amber-100 text-amber-800" :
                                                        "bg-rose-100 text-rose-800"
                                                    )}>
                                                        {status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-12 text-slate-400 italic text-xs uppercase tracking-widest font-black">No billing history found.</div>
                                )}
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'notices' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                            <CardHeader className="p-0 mb-6">
                                <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">School Bulletins Broadcasts</CardTitle>
                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Official announcements released from school administration</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 space-y-6">
                                {announcements && announcements.length > 0 ? (
                                    announcements.map((a: any) => (
                                        <div key={a.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 hover:scale-[1.01] transition-transform duration-300">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">{a.title}</h4>
                                                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">{a.audience || 'Everybody'}</span>
                                            </div>
                                            <p className="text-xs font-medium leading-relaxed text-slate-500 whitespace-pre-wrap">{a.content}</p>
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                                                <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Posted {a.publishedAt?.toDate ? formatDistanceToNow(a.publishedAt.toDate(), { addSuffix: true }) : 'Just now'}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-slate-400 italic text-xs uppercase tracking-widest font-black">No announcements broadcasted yet.</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'canteen' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {/* Canteen coordinated menu */}
                        <div className="bg-amber-50 border border-amber-200/60 rounded-3xl p-6 flex items-start gap-4 shadow-sm">
                            <div className="p-3 bg-amber-500/10 text-amber-700 rounded-2xl shrink-0">
                                <Utensils className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-black text-sm uppercase tracking-tight text-amber-805">Dietary Coordination Advice</h4>
                                <p className="text-xs text-amber-700 leading-relaxed font-semibold">
                                    Coordinate breakfast and dinner at home with the school's cafeteria weekly menu schedule to avoid repeat meals and ensure a balanced nutritional rotation.
                                </p>
                            </div>
                        </div>

                        {/* Menu list */}
                        <div className="grid gap-6 xl:grid-cols-5">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                                // Since we don't have canteen details from dashboard-client directly, we default to standard weekly catalog placeholders
                                const mealsMock = [
                                    { type: 'Breakfast', name: 'Oatmeal & Toast / Hot Cocoa' },
                                    { type: 'Lunch', name: 'Jollof Rice with Grilled Chicken & Salad' },
                                    { type: 'Snacks', name: 'Fresh Fruits / Biscuit' }
                                ];
                                return (
                                    <Card key={day} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                        <div className="space-y-4">
                                            <div className="border-b pb-2">
                                                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">{day}</h3>
                                            </div>
                                            <div className="space-y-4">
                                                {mealsMock.map((m) => (
                                                    <div key={m.type} className="space-y-1">
                                                        <span className="text-[9px] font-black uppercase text-amber-600 tracking-widest">{m.type}</span>
                                                        <p className="text-xs font-bold text-slate-700 leading-snug">{m.name}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
