'use client';

import { useMemo, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, limit, documentId } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2, CalendarCheck, Info, CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Personal attendance history for Students and Parents.
 */
export default function MyAttendancePage() {
    const { user } = useUser();
    const { role, profile, loading: roleLoading } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    
    const [selectedChildId, setSelectedChildId] = useState<string>('');

    // 1. Collect linked student IDs from profile fallbacks
    const parentStudentDocIds = useMemo(() => {
        if (!profile) return [];
        return (
            profile.studentIds ||
            profile.student_ids ||
            profile.students ||
            profile.linkedStudentIds ||
            profile.childrenIds ||
            []
        );
    }, [profile]);

    // 2. Fetch student documents to get Names and verify UIDs
    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !role) return null;

        if (role === 'Student' && user) {
            return query(
                collection(firestore, 'students'),
                where('uid', '==', user.uid),
                where('schoolId', '==', schoolId)
            );
        }

        if (role === 'Parent' && parentStudentDocIds.length > 0) {
            // Firestore "in" query is limited to 10 items
            const slice = parentStudentDocIds.slice(0, 10);
            return query(
                collection(firestore, 'students'),
                where(documentId(), 'in', slice),
                where('schoolId', '==', schoolId)
            );
        }

        return null;
    }, [firestore, schoolId, role, user?.uid, parentStudentDocIds]);

    const { data: students, isLoading: studentsLoading } = useCollection<any>(studentsQuery);

    // 3. Extract active student UID for current display
    const activeChildId = useMemo(() => {
        if (role === 'Student') return user?.uid || '';
        return selectedChildId || parentStudentDocIds[0] || '';
    }, [role, user?.uid, selectedChildId, parentStudentDocIds]);

    const activeChild = useMemo(() => {
        if (!students || !activeChildId) return null;
        return students.find((s: any) => s.id === activeChildId || s.uid === activeChildId) || null;
    }, [students, activeChildId]);

    // 4. Fetch attendance logs for selected child
    const attendanceQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !activeChildId) return null;

        return query(
            collection(firestore, 'attendance'),
            where('schoolId', '==', schoolId),
            where('studentId', '==', activeChildId),
            limit(100)
        );
    }, [firestore, schoolId, activeChildId]);

    const { data: attendance, isLoading: attendanceLoading } = useCollection<any>(attendanceQuery);

    // 5. Sort newest-first in memory
    const sortedAttendance = useMemo(() => {
        if (!attendance) return [];
        return [...attendance].sort((a, b) => {
            const dateA = a.date?.toDate ? a.date.toDate().getTime() : 0;
            const dateB = b.date?.toDate ? b.date.toDate().getTime() : 0;
            return dateB - dateA;
        });
    }, [attendance]);

    // 6. Stats calculation
    const attendanceStats = useMemo(() => {
        if (sortedAttendance.length === 0) {
            return {
                total: 0,
                present: 0,
                absent: 0,
                late: 0,
                rate: activeChild?.attendanceRate || 100
            };
        }
        const total = sortedAttendance.length;
        const present = sortedAttendance.filter((a: any) => a.status === 'Present').length;
        const late = sortedAttendance.filter((a: any) => a.status === 'Late').length;
        const absent = sortedAttendance.filter((a: any) => a.status === 'Absent').length;
        const rate = Math.round(((present + late) / total) * 100);
        return { total, present, absent, late, rate };
    }, [sortedAttendance, activeChild]);

    const isActuallyLoading =
        schoolLoading ||
        roleLoading ||
        (role === 'Parent' && parentStudentDocIds.length > 0 && !students) ||
        (activeChildId && attendanceLoading && !attendance);

    if (isActuallyLoading) {
        return (
            <div className="p-10 flex justify-center">
                <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present': return 'bg-emerald-500';
            case 'Absent':  return 'bg-rose-500';
            case 'Late':    return 'bg-orange-500';
            default:        return 'bg-slate-500';
        }
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Present': return 'bg-emerald-100 text-emerald-800';
            case 'Absent':  return 'bg-rose-100 text-rose-800';
            case 'Late':    return 'bg-orange-100 text-orange-800';
            default:        return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Header Banner */}
            <div className="relative p-8 xl:p-10 rounded-[2rem] text-white border-b-8 border-black/10 overflow-hidden shadow-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 border-purple-500/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.06),_rgba(255,255,255,0))] pointer-events-none" />
                <div className="space-y-3 relative z-10 max-w-xl">
                    <span className="text-[9px] font-black tracking-[0.25em] px-3.5 py-1.5 rounded-full uppercase bg-purple-500/20 text-purple-300">
                        Attendance Control
                    </span>
                    <h2 className="text-2.5xl xl:text-3.5xl font-black tracking-tight uppercase italic mt-2">
                        {role === 'Parent' ? "Ward Attendance" : "My Attendance"}
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        Monitor ward daily attendance percentages, late marks, and historical classroom participation logs.
                    </p>
                </div>
                <div className="hidden xl:flex p-5 bg-white/5 border border-white/10 rounded-[1.5rem] relative z-10 shrink-0">
                    <CalendarCheck className="h-10 w-10 text-white opacity-80" />
                </div>
            </div>

            {/* Child Selector Tabs (Parents with multiple students) */}
            {role === 'Parent' && students && students.length > 1 && (
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Child</Label>
                    <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl border w-fit">
                        {students.map((st: any) => {
                            const targetId = st.id || st.uid;
                            return (
                                <button
                                    key={targetId}
                                    onClick={() => setSelectedChildId(targetId)}
                                    className={cn(
                                        "px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300",
                                        activeChildId === targetId
                                            ? "bg-white text-indigo-600 shadow-md scale-[1.02]"
                                            : "text-slate-500 hover:text-slate-900"
                                    )}
                                >
                                    {st.firstName} {st.lastName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Analytics Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Circular attendance gauge */}
                <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8 flex flex-col justify-between">
                    <div>
                        <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">Attendance Pulse</CardTitle>
                        <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Overall attendance score this term</CardDescription>
                    </div>

                    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl gap-4 my-6">
                        <div className="relative flex items-center justify-center w-32 h-32">
                            <svg className="absolute w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                                <circle cx="64" cy="64" r="56" stroke="#8b5cf6" strokeWidth="8" fill="transparent"
                                        strokeDasharray={351.85}
                                        strokeDashoffset={351.85 - (351.85 * attendanceStats.rate) / 100}
                                        strokeLinecap="round" />
                            </svg>
                            <span className="text-3xl font-black text-slate-800 relative z-10">{attendanceStats.rate}%</span>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800 font-black text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                            {attendanceStats.rate >= 90 ? "Excellent standing" : attendanceStats.rate >= 80 ? "Satisfactory" : "Attention Required"}
                        </Badge>
                    </div>
                    
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed text-center">
                        Maintained above the school's target threshold (90%)
                    </p>
                </Card>

                {/* Right side: Summary Indicators and Log Feed */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stat Breakdown Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm flex items-center gap-4 hover:scale-[1.02] transition-transform">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="h-5 w-5"/></div>
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Present</p>
                                <p className="text-xl font-black text-slate-850">{attendanceStats.present} Days</p>
                            </div>
                        </div>
                        <div className="p-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm flex items-center gap-4 hover:scale-[1.02] transition-transform">
                            <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Clock className="h-5 w-5"/></div>
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Late</p>
                                <p className="text-xl font-black text-slate-850">{attendanceStats.late} Days</p>
                            </div>
                        </div>
                        <div className="p-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm flex items-center gap-4 hover:scale-[1.02] transition-transform">
                            <div className="p-3 bg-rose-50 text-rose-500 rounded-xl"><XCircle className="h-5 w-5"/></div>
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Absent</p>
                                <p className="text-xl font-black text-slate-850">{attendanceStats.absent} Days</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Feed Log */}
                    <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b p-8">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">
                                History Logs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {sortedAttendance.length === 0 ? (
                                <div className="p-20 text-center flex flex-col items-center gap-3 opacity-20">
                                    <CalendarCheck size={48} className="text-slate-400" />
                                    <p className="font-black uppercase tracking-widest text-xs">No participation records found</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="bg-slate-50/30">
                                        <TableRow>
                                            <TableHead className="font-black text-[10px] pl-8 py-5 uppercase tracking-widest">Date</TableHead>
                                            <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                                            <TableHead className="font-black text-[10px] pr-8 uppercase tracking-widest">Notes & Justifications</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedAttendance.map(record => (
                                            <TableRow key={record.id} className="hover:bg-slate-50/50 transition-colors h-16">
                                                <TableCell className="pl-8 font-black text-slate-700 text-sm">
                                                    {record.date?.toDate ? format(record.date.toDate(), 'PPP') : 'Unknown Date'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={cn(
                                                        "border-none font-black text-[9px] tracking-wider px-3 py-1 rounded-full uppercase text-white shadow-sm shrink-0",
                                                        getStatusColor(record.status)
                                                    )}>
                                                        {record.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="pr-8 text-xs text-slate-500 italic font-medium">
                                                    {record.notes ? `"${record.notes}"` : '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 py-4 border-t flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <Info className="h-4 w-4 text-purple-500" />
                            <span>Logs are compiled by school administration and class teachers.</span>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
