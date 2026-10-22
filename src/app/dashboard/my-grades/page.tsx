'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { currentTermFromProfile, termStampOfRecord, compareTermIds, stampFromTermId } from '@/lib/term';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, orderBy, limit, documentId, doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, ChevronDown, FileText, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

/**
 * Live Grades for pupils and parents: one term at a time.
 * Reads the pupil's own marks (newest 300) once per child, groups them by term, and compares each subject
 * with the class average from the server-kept classAverages document (no classmates' marks are read).
 */

const toDate = (d: any): Date | null => {
    if (!d) return null;
    const x = d instanceof Date ? d : typeof d.toDate === 'function' ? d.toDate() : d.seconds ? new Date(d.seconds * 1000) : new Date(d);
    return isNaN(x.getTime()) ? null : x;
};

const pctOf = (a: any) => {
    const max = Number(a.maxScore) || 0;
    return max > 0 ? Math.max(0, Math.min(100, (Number(a.score) || 0) / max * 100)) : null;
};

// Grade bands (the old page called every subject "Excelling", even 59%).
const band = (p: number) =>
    p >= 80 ? { label: 'Excellent', cls: 'bg-emerald-100 text-emerald-800', bar: 'bg-emerald-500', advice: 'Doing very well. Keep encouraging this effort.' }
    : p >= 70 ? { label: 'Very good', cls: 'bg-teal-100 text-teal-800', bar: 'bg-teal-500', advice: 'Strong work. A little extra practice can lift it further.' }
    : p >= 60 ? { label: 'Good', cls: 'bg-sky-100 text-sky-800', bar: 'bg-sky-500', advice: 'Solid. Regular revision at home will help it grow.' }
    : p >= 50 ? { label: 'Pass', cls: 'bg-amber-100 text-amber-800', bar: 'bg-amber-500', advice: 'Passing, but needs more practice. Ask the teacher what to revise.' }
    : { label: 'Needs support', cls: 'bg-rose-100 text-rose-800', bar: 'bg-rose-500', advice: 'Below 50%. Please speak with the class teacher about extra support.' };

const isExam = (a: any) => /exam|mid|mock|end of term|terminal/i.test(String(a.assessmentType || a.type || ''));

export default function MyGradesPage() {
    const { user } = useUser();
    const { role, profile } = useRole();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const firestore = useFirestore();

    const [selectedChildId, setSelectedChildId] = useState<string>('');
    const [selectedTermId, setSelectedTermId] = useState<string>('');
    const [openSubject, setOpenSubject] = useState<string | null>(null);

    const parentStudentIds: string[] = useMemo(() => {
        const ids = profile?.studentIds || profile?.students || profile?.childrenIds || profile?.linkedStudentIds || [];
        return ids.slice(0, 30);
    }, [profile]);
    const parentStudentIdsStr = parentStudentIds.join(',');

    // Children (parent) or the pupil themself
    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !role) return null;
        if (role === 'Student' && user) {
            return query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('uid', '==', user.uid));
        }
        if (role === 'Parent' && parentStudentIds.length > 0) {
            return query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where(documentId(), 'in', parentStudentIds));
        }
        return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firestore, schoolId, parentStudentIdsStr, role, user?.uid]);
    const { data: students } = useCollection<any>(studentsQuery);

    const activeChildId = role === 'Student' ? (user?.uid || '') : (selectedChildId || parentStudentIds[0] || '');
    const activeChild = useMemo(() => (students || []).find((s: any) => s.id === activeChildId || s.uid === activeChildId) || null, [students, activeChildId]);
    const markKey = activeChild?.uid || activeChildId; // marks are filed under the pupil's uid

    // The pupil's own marks, newest first (one read per mark; a pupil has a few dozen per term)
    const marksQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !markKey) return null;
        return query(collection(firestore, 'assessments'), where('schoolId', '==', schoolId), where('studentId', '==', markKey), orderBy('createdAt', 'desc'), limit(300));
    }, [firestore, schoolId, markKey]);
    const { data: marks, isLoading: loadingMarks } = useCollection<any>(marksQuery);

    const { data: schoolProfile } = useDoc<any>(useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]));
    const { data: subjectsList } = useCollection<any>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));
    const currentTermId = currentTermFromProfile(schoolProfile)?.termId || '';

    // Group marks by term
    const terms = useMemo(() => {
        const map = new Map<string, any[]>();
        (marks || []).forEach((a: any) => {
            if (pctOf(a) === null) return;
            const id = termStampOfRecord(a)?.termId || 'unknown';
            if (!map.has(id)) map.set(id, []);
            map.get(id)!.push(a);
        });
        return Array.from(map.entries())
            .map(([termId, list]) => {
                const st = stampFromTermId(termId);
                const avg = Math.round(list.reduce((s, a) => s + (pctOf(a) as number), 0) / list.length);
                return { termId, label: st ? `${st.term} ${st.academicYear}` : 'Term not recorded', short: st ? `${st.term.replace(' Term', '')} ${st.academicYear}` : 'Unknown', list, avg };
            })
            .sort((a, b) => (a.termId === 'unknown' ? -1 : b.termId === 'unknown' ? 1 : compareTermIds(a.termId, b.termId)));
    }, [marks]);

    // Default: the current term if it has marks, otherwise the latest term with marks
    useEffect(() => { setSelectedTermId(''); setOpenSubject(null); }, [markKey]);
    const termId = selectedTermId
        || (terms.some(t => t.termId === currentTermId) ? currentTermId : (terms.filter(t => t.termId !== 'unknown').slice(-1)[0]?.termId || terms[0]?.termId || ''));
    const term = terms.find(t => t.termId === termId) || null;

    const classId = activeChild?.classId || '';
    const { data: classAverages } = useDoc<any>(useMemoFirebase(
        () => (firestore && schoolId && classId && termId && termId !== 'unknown') ? doc(firestore, 'classAverages', `${schoolId}__${termId}__${classId}`) : null,
        [firestore, schoolId, classId, termId]
    ));

    const subjectName = (a: any) => subjectsList?.find((s: any) => s.id === a.subjectId)?.name || a.subjectName || 'Subject';

    const subjectRows = useMemo(() => {
        if (!term) return [];
        const by = new Map<string, any[]>();
        term.list.forEach(a => { const n = subjectName(a); if (!by.has(n)) by.set(n, []); by.get(n)!.push(a); });
        const classBy: Record<string, number> = {};
        Object.entries(classAverages?.subjects || {}).forEach(([sid, v]: any) => {
            if (!(Number(v?.c) > 0)) return;
            const n = subjectsList?.find((s: any) => s.id === sid)?.name || v.name || sid;
            classBy[n] = Math.round(Number(v.s) / Number(v.c));
        });
        return Array.from(by.entries()).map(([name, list]) => {
            const avg = Math.round(list.reduce((s, a) => s + (pctOf(a) as number), 0) / list.length);
            const ca = list.filter(a => !isExam(a));
            const ex = list.filter(isExam);
            const caAvg = ca.length ? Math.round(ca.reduce((s, a) => s + (pctOf(a) as number), 0) / ca.length) : null;
            const exAvg = ex.length ? Math.round(ex.reduce((s, a) => s + (pctOf(a) as number), 0) / ex.length) : null;
            const sorted = [...list].sort((x, y) => (toDate(y.assessmentDate || y.createdAt)?.getTime() || 0) - (toDate(x.assessmentDate || x.createdAt)?.getTime() || 0));
            return { name, avg, caAvg, exAvg, classAvg: classBy[name] ?? null, list: sorted };
        }).sort((a, b) => b.avg - a.avg);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [term, classAverages, subjectsList]);

    const classOverall = Number(classAverages?.totals?.c) > 0 ? Math.round(Number(classAverages.totals.s) / Number(classAverages.totals.c)) : null;
    const prevTerm = term ? terms.filter(t => t.termId !== 'unknown' && t.termId !== term.termId && compareTermIds(t.termId, term.termId) < 0).slice(-1)[0] : null;
    const change = term && prevTerm ? term.avg - prevTerm.avg : null;
    const best = subjectRows[0];
    const weakest = subjectRows.length > 1 ? subjectRows[subjectRows.length - 1] : null;

    const loading = schoolLoading || (!!markKey && loadingMarks && !marks);

    return (
        <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-indigo-600">Grades</p>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">{role === 'Parent' ? 'Ward Grades' : 'My Grades'}</h1>
                    <p className="text-xs text-slate-500 font-medium mt-1">Marks entered by teachers during the term. The final position is on the report card.</p>
                </div>
                <Button asChild variant="outline" size="sm" className="rounded-xl font-bold text-xs w-fit">
                    <Link href="/dashboard/my-reports"><FileText className="h-4 w-4 mr-1.5" /> Report Cards</Link>
                </Button>
            </div>

            {/* Child selector */}
            {role === 'Parent' && students && students.length > 1 && (
                <div className="flex flex-wrap gap-2">
                    {students.map((st: any) => {
                        const id = st.id || st.uid;
                        const on = activeChildId === id || activeChildId === st.uid;
                        return (
                            <button key={id} onClick={() => setSelectedChildId(id)}
                                className={cn("px-4 py-2.5 text-xs font-black rounded-xl border transition-all",
                                    on ? "bg-indigo-700 text-white border-indigo-700 shadow" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300")}>
                                {st.firstName} {st.lastName}
                            </button>
                        );
                    })}
                </div>
            )}

            {loading ? (
                <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>
            ) : terms.length === 0 ? (
                <Card className="rounded-3xl border border-dashed bg-white">
                    <CardContent className="p-12 text-center space-y-2">
                        <BookOpen className="h-8 w-8 text-slate-300 mx-auto" />
                        <p className="text-sm font-black text-slate-600">No marks recorded yet</p>
                        <p className="text-xs text-slate-400">Marks appear here as soon as teachers enter them.</p>
                    </CardContent>
                </Card>
            ) : (
            <>
            {/* Term chips */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {[...terms].reverse().map(t => (
                    <button key={t.termId} onClick={() => { setSelectedTermId(t.termId); setOpenSubject(null); }}
                        className={cn("shrink-0 px-3.5 py-2 rounded-xl border text-left transition-all",
                            t.termId === termId ? "bg-indigo-50 border-indigo-300" : "bg-white border-slate-200 hover:border-indigo-200")}>
                        <span className="block text-[11px] font-black text-slate-800">{t.short}{t.termId === currentTermId ? ' · now' : ''}</span>
                        <span className="block text-[10px] font-bold text-slate-500">{t.avg}% · {t.list.length} marks</span>
                    </button>
                ))}
            </div>

            {term && (
            <>
            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Card className="rounded-2xl border border-slate-100 bg-white"><CardContent className="p-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Average · {term.short}</p>
                    <p className="text-2xl font-black text-slate-900">{term.avg}%</p>
                    <Badge className={cn("border-none text-[9px] font-black uppercase mt-1", band(term.avg).cls)}>{band(term.avg).label}</Badge>
                </CardContent></Card>
                <Card className="rounded-2xl border border-slate-100 bg-white"><CardContent className="p-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Class average</p>
                    <p className="text-2xl font-black text-slate-900">{classOverall !== null ? `${classOverall}%` : '—'}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">
                        {classOverall !== null ? (term.avg >= classOverall ? `${term.avg - classOverall} points above` : `${classOverall - term.avg} points below`) : 'Not available for this term'}
                    </p>
                </CardContent></Card>
                <Card className="rounded-2xl border border-slate-100 bg-white"><CardContent className="p-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Since last term</p>
                    <p className={cn("text-2xl font-black flex items-center gap-1", change === null ? "text-slate-400" : change > 0 ? "text-emerald-600" : change < 0 ? "text-rose-600" : "text-slate-700")}>
                        {change === null ? '—' : <>{change > 0 ? <TrendingUp className="h-5 w-5" /> : change < 0 ? <TrendingDown className="h-5 w-5" /> : <Minus className="h-5 w-5" />}{change > 0 ? '+' : ''}{change}</>}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">{prevTerm ? `vs ${prevTerm.short} (${prevTerm.avg}%)` : 'No earlier term'}</p>
                </CardContent></Card>
                <Card className="rounded-2xl border border-slate-100 bg-white"><CardContent className="p-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Marks this term</p>
                    <p className="text-2xl font-black text-slate-900">{term.list.length}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">{subjectRows.length} subject{subjectRows.length === 1 ? '' : 's'}</p>
                </CardContent></Card>
            </div>

            {(best || weakest) && (
                <p className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                    {best ? <>Strongest: <b>{best.name}</b> ({best.avg}%). </> : null}
                    {weakest && weakest.name !== best?.name ? <>Needs most attention: <b>{weakest.name}</b> ({weakest.avg}%).</> : null}
                </p>
            )}

            {/* Subjects */}
            <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-black uppercase tracking-wider text-slate-800">Subjects · {term.label}</CardTitle>
                    <CardDescription className="text-[11px]">Tap a subject to see each mark. CA = class work and tests; Exam = exam papers.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {subjectRows.map(row => {
                        const b = band(row.avg);
                        const open = openSubject === row.name;
                        return (
                            <div key={row.name} className="border-t border-slate-100">
                                <button onClick={() => setOpenSubject(open ? null : row.name)} className="w-full text-left px-5 py-4 hover:bg-slate-50/60 transition-colors">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-slate-800 truncate">{row.name}</p>
                                            <p className="text-[10px] font-bold text-slate-500">
                                                {row.caAvg !== null ? `CA ${row.caAvg}%` : 'CA —'} · {row.exAvg !== null ? `Exam ${row.exAvg}%` : 'Exam —'}
                                                {row.classAvg !== null ? ` · Class ${row.classAvg}%` : ''}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <Badge className={cn("border-none text-[9px] font-black uppercase hidden sm:inline-flex", b.cls)}>{b.label}</Badge>
                                            <span className="text-lg font-black text-slate-900 w-12 text-right">{row.avg}%</span>
                                            <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", open && "rotate-180")} />
                                        </div>
                                    </div>
                                    <div className="relative h-2 mt-2.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full", b.bar)} style={{ width: `${row.avg}%` }} />
                                        {row.classAvg !== null && <div className="absolute top-0 h-full w-0.5 bg-slate-700" style={{ left: `${row.classAvg}%` }} title={`Class average ${row.classAvg}%`} />}
                                    </div>
                                </button>
                                {open && (
                                    <div className="px-5 pb-4 space-y-2 bg-slate-50/40">
                                        <p className="text-[11px] font-semibold text-slate-600 pt-1">{b.advice}</p>
                                        {row.list.map((a: any) => {
                                            const p = Math.round(pctOf(a) as number);
                                            const d = toDate(a.assessmentDate || a.createdAt);
                                            return (
                                                <div key={a.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-100">
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-slate-800">{a.assessmentName || a.assessmentType || 'Assessment'}</p>
                                                        <p className="text-[10px] text-slate-500">{d ? format(d, 'd MMM yyyy') : ''}{a.assessmentName && a.assessmentType ? ` · ${a.assessmentType}` : ''}</p>
                                                        {a.teacherRemark ? <p className="text-[11px] text-slate-600 italic mt-0.5">“{a.teacherRemark}”</p> : null}
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-xs font-black text-slate-800">{Number(a.score) || 0} / {Number(a.maxScore) || 0}</p>
                                                        <p className={cn("text-[10px] font-black", p >= 50 ? "text-emerald-600" : "text-rose-600")}>{p}%</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            <p className="text-[10px] text-slate-400 font-semibold text-center">
                Grade bands: 80%+ Excellent · 70–79 Very good · 60–69 Good · 50–59 Pass · below 50 Needs support.
                {term.termId === 'unknown' ? ' Some marks were saved without a term, so they are grouped together here.' : ''}
            </p>
            </>
            )}
            </>
            )}
        </div>
    );
}
