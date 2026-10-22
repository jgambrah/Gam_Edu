'use client';

import { useMemo, useState } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { currentTermFromProfile } from '@/lib/term';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, limit, documentId, orderBy, doc, Timestamp } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, startOfMonth, getDaysInMonth, getDay } from 'date-fns';
import { Loader2, CalendarCheck, Info, CheckCircle2, Clock, XCircle, AlertTriangle, ChevronDown } from 'lucide-react';
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

    // 4. The school's current term (start date) — one read of the school profile.
    const { data: schoolProfile } = useDoc<any>(useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]));
    const term = useMemo(() => currentTermFromProfile(schoolProfile), [schoolProfile]);
    const termStart = useMemo(() => {
        const raw = schoolProfile?.termStartDate;
        const d = raw ? new Date(`${String(raw).slice(0, 10)}T00:00:00`) : null;
        return d && !isNaN(d.getTime()) ? d : null;
    }, [schoolProfile?.termStartDate]);
    const [period, setPeriod] = useState<'term' | 'recent'>('term');
    const usingTerm = period === 'term' && !!termStart;
    const periodLabel = usingTerm ? (term ? `${term.term} ${term.academicYear}` : 'This term') : 'Last 100 school days';

    // 5. Attendance for the chosen period only (this term by default).
    // Register entries are filed under the pupil's uid (which can differ from the document id).
    const attendanceKey = activeChild?.uid || activeChildId;
    const attendanceQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !attendanceKey) return null;
        return usingTerm
            ? query(collection(firestore, 'attendance'), where('schoolId', '==', schoolId), where('studentId', '==', attendanceKey),
                where('date', '>=', Timestamp.fromDate(termStart!)), orderBy('date', 'desc'), limit(150))
            : query(collection(firestore, 'attendance'), where('schoolId', '==', schoolId), where('studentId', '==', attendanceKey),
                orderBy('date', 'desc'), limit(100));
    }, [firestore, schoolId, attendanceKey, usingTerm, termStart?.getTime()]);

    const { data: attendance, isLoading: attendanceLoading } = useCollection<any>(attendanceQuery);

    const toDate = (v: any): Date | null => { const d = v?.toDate ? v.toDate() : v ? new Date(v) : null; return d && !isNaN(d.getTime()) ? d : null; };
    const sortedAttendance = useMemo(() => {
        if (!attendance) return [];
        return attendance.filter((a: any) => toDate(a.date)).sort((a: any, b: any) => toDate(b.date)!.getTime() - toDate(a.date)!.getTime());
    }, [attendance]);

    // 6. Stats (no invented figure when nothing is recorded — it used to show 100%).
    const stats = useMemo(() => {
        const total = sortedAttendance.length;
        const present = sortedAttendance.filter((a: any) => a.status === 'Present').length;
        const late = sortedAttendance.filter((a: any) => a.status === 'Late').length;
        const absent = sortedAttendance.filter((a: any) => a.status === 'Absent').length;
        const excused = sortedAttendance.filter((a: any) => a.status === 'Excused').length;
        const rate: number | null = total ? Math.round(((present + late) / total) * 100) : null;
        return { total, present, late, absent, excused, rate };
    }, [sortedAttendance]);

    const exceptions = useMemo(() => sortedAttendance.filter((a: any) => a.status && a.status !== 'Present'), [sortedAttendance]);

    // Group by month for the calendar view.
    const months = useMemo(() => {
        const map = new Map<string, { label: string; first: Date; days: Map<number, any> }>();
        sortedAttendance.forEach((a: any) => {
            const d = toDate(a.date)!;
            const key = format(d, 'yyyy-MM');
            if (!map.has(key)) map.set(key, { label: format(d, 'MMMM yyyy'), first: startOfMonth(d), days: new Map() });
            map.get(key)!.days.set(d.getDate(), a);
        });
        return Array.from(map.values());
    }, [sortedAttendance]);

    const [showList, setShowList] = useState(false);

    const isActuallyLoading =
        schoolLoading ||
        roleLoading ||
        (role === 'Parent' && parentStudentDocIds.length > 0 && !students) ||
        (activeChildId && attendanceLoading && !attendance);

    const statusStyle: Record<string, string> = {
        Present: 'bg-emerald-500 text-white',
        Late: 'bg-amber-500 text-white',
        Absent: 'bg-rose-500 text-white',
        Excused: 'bg-sky-500 text-white',
    };
    const childName = activeChild ? `${activeChild.firstName || ''} ${activeChild.lastName || ''}`.trim() : '';

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-purple-600">Attendance</p>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{role === 'Parent' ? 'Ward Attendance' : 'My Attendance'}</h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Days marked on the class register by the school.</p>
                </div>
                <div className="flex p-1 bg-slate-100 rounded-xl border w-fit">
                    {([['term', term ? 'This term' : 'This term'], ['recent', 'Last 100 days']] as const).map(([k, label]) => (
                        <button key={k} onClick={() => setPeriod(k)} disabled={k === 'term' && !termStart}
                            className={cn("px-4 py-2 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all",
                                (k === 'term' ? usingTerm : !usingTerm) ? "bg-white text-purple-700 shadow" : "text-slate-500 hover:text-slate-900 disabled:opacity-40")}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Child selector */}
            {role === 'Parent' && students && students.length > 1 && (
                <div className="flex flex-wrap gap-2">
                    {students.map((st: any) => {
                        const targetId = st.id || st.uid;
                        const on = activeChildId === targetId || activeChildId === st.uid;
                        return (
                            <button key={targetId} onClick={() => setSelectedChildId(targetId)}
                                className={cn("px-4 py-2.5 text-xs font-black rounded-xl border transition-all",
                                    on ? "bg-purple-700 text-white border-purple-700 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-purple-300")}>
                                {st.firstName} {st.lastName}
                            </button>
                        );
                    })}
                </div>
            )}

            {isActuallyLoading ? (
                <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-purple-600 h-8 w-8" /></div>
            ) : (
            <>
            {/* Summary */}
            <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
                    <div className="flex items-center gap-5">
                        <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
                            <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 128 128">
                                <circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="10" fill="transparent" />
                                <circle cx="64" cy="64" r="56" stroke={stats.rate === null ? '#e2e8f0' : stats.rate >= 90 ? '#10b981' : stats.rate >= 80 ? '#f59e0b' : '#f43f5e'} strokeWidth="10" fill="transparent"
                                    strokeDasharray={351.85} strokeDashoffset={351.85 - (351.85 * (stats.rate ?? 0)) / 100} strokeLinecap="round" />
                            </svg>
                            <span className="text-2xl font-black text-slate-800 relative">{stats.rate !== null ? `${stats.rate}%` : '—'}</span>
                        </div>
                        <div className="md:hidden">
                            <p className="text-sm font-black text-slate-800">{childName}</p>
                            <p className="text-[11px] text-slate-500 font-semibold">{periodLabel}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="hidden md:block">
                            <p className="text-base font-black text-slate-800">{childName}</p>
                            <p className="text-xs text-slate-500 font-semibold">
                                {periodLabel}{stats.total ? ` · ${stats.total} day${stats.total === 1 ? '' : 's'} recorded` : ''}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { label: 'Present', value: stats.present, icon: CheckCircle2, cls: 'text-emerald-600 bg-emerald-50' },
                                { label: 'Late', value: stats.late, icon: Clock, cls: 'text-amber-600 bg-amber-50' },
                                { label: 'Absent', value: stats.absent, icon: XCircle, cls: 'text-rose-600 bg-rose-50' },
                                { label: 'Excused', value: stats.excused, icon: Info, cls: 'text-sky-600 bg-sky-50' },
                            ].map(x => (
                                <div key={x.label} className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100">
                                    <span className={cn("p-2 rounded-xl", x.cls)}><x.icon className="h-4 w-4" /></span>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{x.label}</p>
                                        <p className="text-lg font-black text-slate-800 leading-tight">{x.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className={cn("text-[11px] font-bold",
                            stats.rate === null ? "text-slate-400" : stats.rate >= 90 ? "text-emerald-700" : stats.rate >= 80 ? "text-amber-700" : "text-rose-700")}>
                            {stats.rate === null ? 'No register entries for this period yet.'
                                : stats.rate >= 90 ? 'Above the 90% attendance target.'
                                : `Below the 90% attendance target — ${stats.absent} day${stats.absent === 1 ? '' : 's'} absent.`}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Days missed or late */}
                <Card className="lg:col-span-2 rounded-3xl border border-slate-100 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" /> Absent, late or excused
                        </CardTitle>
                        <CardDescription className="text-[11px]">{periodLabel}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {exceptions.length === 0 ? (
                            <p className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                                {stats.total ? 'Present every day recorded in this period.' : 'Nothing recorded yet.'}
                            </p>
                        ) : exceptions.map((r: any) => (
                            <div key={r.id} className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <div>
                                    <p className="text-xs font-black text-slate-800">{format(toDate(r.date)!, 'EEE d MMM yyyy')}</p>
                                    {r.notes ? <p className="text-[11px] text-slate-500 italic mt-0.5">{r.notes}</p> : null}
                                </div>
                                <Badge className={cn("border-none text-[9px] font-black uppercase tracking-wider rounded-full shrink-0", statusStyle[r.status] || 'bg-slate-500 text-white')}>{r.status}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Month calendar */}
                <Card className="lg:col-span-3 rounded-3xl border border-slate-100 shadow-sm bg-white">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                            <CalendarCheck className="h-4 w-4 text-purple-600" /> Month by month
                        </CardTitle>
                        <div className="flex flex-wrap gap-3 pt-1">
                            {Object.entries({ Present: 'bg-emerald-500', Late: 'bg-amber-500', Absent: 'bg-rose-500', Excused: 'bg-sky-500', 'Not recorded': 'bg-slate-100 border' }).map(([k, c]) => (
                                <span key={k} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500"><span className={cn("w-3 h-3 rounded", c)} />{k}</span>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {months.length === 0 && <p className="text-xs text-slate-400 font-bold text-center py-8">No register entries for this period.</p>}
                        {months.map(m => {
                            const daysInMonth = getDaysInMonth(m.first);
                            const lead = (getDay(m.first) + 6) % 7; // Monday first
                            const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
                            return (
                                <div key={m.label}>
                                    <p className="text-xs font-black text-slate-700 mb-2">{m.label}</p>
                                    <div className="grid grid-cols-7 gap-1 text-center">
                                        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => <span key={d} className="text-[9px] font-black text-slate-400">{d}</span>)}
                                        {cells.map((day, i) => {
                                            if (day === null) return <span key={`b${i}`} />;
                                            const rec = m.days.get(day);
                                            return (
                                                <span key={day} title={rec ? `${day} ${m.label}: ${rec.status}${rec.notes ? ` — ${rec.notes}` : ''}` : undefined}
                                                    className={cn("h-7 rounded-md flex items-center justify-center text-[10px] font-bold",
                                                        rec ? (statusStyle[rec.status] || 'bg-slate-400 text-white') : 'bg-slate-50 text-slate-300')}>
                                                    {day}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* Full list, folded away */}
            {sortedAttendance.length > 0 && (
                <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white overflow-hidden">
                    <button onClick={() => setShowList(v => !v)} className="w-full flex items-center justify-between p-5 text-left">
                        <span className="text-sm font-black uppercase tracking-wider text-slate-800">Every day ({sortedAttendance.length})</span>
                        <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", showList && "rotate-180")} />
                    </button>
                    {showList && (
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="font-black text-[10px] pl-6 uppercase tracking-widest">Date</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                                    <TableHead className="font-black text-[10px] pr-6 uppercase tracking-widest">Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedAttendance.map((record: any) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="pl-6 font-bold text-slate-700 text-xs">{format(toDate(record.date)!, 'EEE d MMM yyyy')}</TableCell>
                                        <TableCell><Badge className={cn("border-none text-[9px] font-black uppercase rounded-full", statusStyle[record.status] || 'bg-slate-500 text-white')}>{record.status}</Badge></TableCell>
                                        <TableCell className="pr-6 text-xs text-slate-500 italic">{record.notes || '—'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Card>
            )}
            </>
            )}
        </div>
    );
}
