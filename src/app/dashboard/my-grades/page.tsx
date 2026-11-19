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
import { Loader2, BookOpen, ChevronDown, FileText, TrendingUp, TrendingDown, Minus, Award } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
    resolveMockSeriesFromAssessment,
    isMidTermReportScopeAssessment,
    resolveMidTermSlot,
    computeMidTermSubjectScore,
    computeBeceAggregate,
    getSeriesGradeFromScore,
    isJhsOrBeceClass,
    formatSeriesLabelFromId,
    type AcademicSeriesId,
} from '@/lib/academic-series';

/**
 * Live Grades for pupils and parents: scoped cleanly by Term AND Assessment Series
 * (End of Term, Mid-Term, Mock 1, Mock 2, ...), so Mock and Mid-Term marks never pollute End-of-Term averages,
 * and parents/students can inspect raw scores (`score / maxScore`), weighted CA/Exam breakdowns, and BECE aggregates.
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

const band = (p: number) =>
    p >= 80 ? { label: 'Excellent', cls: 'bg-emerald-100 text-emerald-800', bar: 'bg-emerald-500', advice: 'Doing very well. Keep encouraging this effort.' }
    : p >= 70 ? { label: 'Very good', cls: 'bg-teal-100 text-teal-800', bar: 'bg-teal-500', advice: 'Strong work. A little extra practice can lift it further.' }
    : p >= 60 ? { label: 'Good', cls: 'bg-sky-100 text-sky-800', bar: 'bg-sky-500', advice: 'Solid. Regular revision at home will help it grow.' }
    : p >= 50 ? { label: 'Pass', cls: 'bg-amber-100 text-amber-800', bar: 'bg-amber-500', advice: 'Passing, but needs more practice. Ask the teacher what to revise.' }
    : { label: 'Needs support', cls: 'bg-rose-100 text-rose-800', bar: 'bg-rose-500', advice: 'Below 50%. Please speak with the class teacher about extra support.' };

function seriesOfAssessment(a: any): { id: AcademicSeriesId; label: string } {
    const mock = resolveMockSeriesFromAssessment(a);
    if (mock) return { id: mock.id, label: mock.label };
    if (isMidTermReportScopeAssessment(a)) return { id: 'mid_term', label: 'Mid-Term' };
    return { id: 'end_of_term', label: 'End of Term' };
}

function computeEndOfTermSubjectPreview(items: any[], caWeight: number, examWeight: number): { ca: number | null; exam: number | null; total: number } {
    const num = (v: any, d: number) => { const n = Number(v); return isFinite(n) ? n : d; };
    const typeOf = (a: any) => String(a.assessmentType || '').toLowerCase();
    const isTerminalExam = (a: any) => { const t = typeOf(a); return !t.includes('mid') && (t.includes('exam') || t.includes('term')); };

    const exams = items.filter(isTerminalExam);
    const caItems = items.filter(a => !isTerminalExam(a));

    const groups: Record<string, { s: number[]; m: number[] }> = {};
    caItems.forEach(a => {
        const c = `${a.assessmentType || ''} ${a.assessmentName || ''}`.toLowerCase();
        const kind = c.includes('mid') ? 'mid'
            : (c.includes('proj') || c.includes('group') || c.includes('practical')) ? 'project'
            : (c.includes('home') || c.includes('hw')) ? 'hw'
            : 'test';
        if (!groups[kind]) groups[kind] = { s: [], m: [] };
        groups[kind].s.push(num(a.score, 0));
        groups[kind].m.push(num(a.maxScore, 100) || 100);
    });

    const mean = (xs: number[]) => xs.reduce((x, y) => x + y, 0) / xs.length;
    let caScore = 0, caMax = 0;
    Object.values(groups).forEach(g => { caScore += mean(g.s); caMax += mean(g.m); });
    const hasCa = caMax > 0;
    const rawCA = hasCa ? Math.min((caScore / caMax) * caWeight, caWeight) : 0;

    const exScore = exams.reduce((sum, a) => sum + num(a.score, 0), 0);
    const exMax = exams.reduce((sum, a) => sum + (num(a.maxScore, 100) || 100), 0);
    const hasExam = exams.length > 0 && exMax > 0;
    const rawExam = hasExam ? Math.min((exScore / exMax) * examWeight, examWeight) : 0;

    // If only CA has been entered so far (no terminal exam yet), show live percentage out of CA max so pupil isn't shown 27% for 27/30 CA!
    if (hasCa && !hasExam) {
        const liveCaPct = Math.round((caScore / caMax) * 100);
        return { ca: Math.round(rawCA), exam: null, total: liveCaPct };
    }
    if (!hasCa && hasExam) {
        const liveExPct = caWeight === 0 ? Math.round((exScore / exMax) * 100) : Math.round(rawExam);
        return { ca: null, exam: Math.round(rawExam), total: liveExPct };
    }
    const ca = Math.round(rawCA);
    const exam = Math.round(rawExam);
    return { ca, exam, total: Math.min(100, ca + exam) };
}

export default function MyGradesPage() {
    const { user } = useUser();
    const { role, profile } = useRole();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const firestore = useFirestore();

    const [selectedChildId, setSelectedChildId] = useState<string>('');
    const [selectedTermId, setSelectedTermId] = useState<string>('');
    const [selectedSeriesId, setSelectedSeriesId] = useState<AcademicSeriesId | ''>('');
    const [openSubject, setOpenSubject] = useState<string | null>(null);

    const parentStudentIds: string[] = useMemo(() => {
        const ids = profile?.studentIds || profile?.student_ids || profile?.students || profile?.childrenIds || profile?.linkedStudentIds || profile?.linked_students || profile?.studentIDs || [];
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
    const markKey = activeChild?.uid || activeChildId;

    // The pupil's own marks, newest first
    const marksQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !markKey) return null;
        return query(collection(firestore, 'assessments'), where('schoolId', '==', schoolId), where('studentId', '==', markKey), orderBy('createdAt', 'desc'), limit(300));
    }, [firestore, schoolId, markKey]);
    const { data: marks, isLoading: loadingMarks } = useCollection<any>(marksQuery);

    const { data: schoolProfile } = useDoc<any>(useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]));
    const { data: schoolSettings } = useDoc<any>(useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]));
    const classId = activeChild?.classId || '';
    const { data: classDoc } = useDoc<any>(useMemoFirebase(() => (firestore && classId) ? doc(firestore, 'classes', classId) : null, [firestore, classId]));
    const { data: subjectsList } = useCollection<any>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));
    const currentTermId = currentTermFromProfile(schoolSettings || schoolProfile)?.termId || '';

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
                return {
                    termId,
                    label: st ? `${st.term} ${st.academicYear}` : 'Term not recorded',
                    short: st ? `${st.term.replace(' Term', '')} ${st.academicYear}` : 'Unknown',
                    list,
                };
            })
            .sort((a, b) => (a.termId === 'unknown' ? -1 : b.termId === 'unknown' ? 1 : compareTermIds(a.termId, b.termId)));
    }, [marks]);

    useEffect(() => { setSelectedTermId(''); setSelectedSeriesId(''); setOpenSubject(null); }, [markKey]);
    const termId = selectedTermId
        || (terms.some(t => t.termId === currentTermId) ? currentTermId : (terms.filter(t => t.termId !== 'unknown').slice(-1)[0]?.termId || terms[0]?.termId || ''));
    const term = terms.find(t => t.termId === termId) || null;

    // Discover which Assessment Series exist inside the selected term (End of Term, Mid-Term, Mock 1, Mock 2, ...)
    const seriesTabs = useMemo(() => {
        if (!term) return [];
        const map = new Map<AcademicSeriesId, { id: AcademicSeriesId; label: string; items: any[]; latestMs: number }>();
        term.list.forEach((a: any) => {
            const s = seriesOfAssessment(a);
            const ms = toDate(a.updatedAt || a.assessmentDate || a.createdAt)?.getTime() || 0;
            const cur = map.get(s.id) || { id: s.id, label: s.label, items: [], latestMs: 0 };
            cur.items.push(a);
            if (ms > cur.latestMs) cur.latestMs = ms;
            map.set(s.id, cur);
        });
        const orderRank = (id: AcademicSeriesId) => {
            if (id === 'end_of_term') return 1;
            if (id === 'mid_term') return 2;
            const m = id.match(/^mock_(\d+)$/);
            return m ? 10 + parseInt(m[1], 10) : 50;
        };
        return Array.from(map.values()).sort((a, b) => orderRank(a.id) - orderRank(b.id));
    }, [term]);

    // Default series: whichever series received the most recent mark in this term (so newly posted Mid-Term / Mock 2 opens immediately!)
    const activeSeriesId: AcademicSeriesId = useMemo(() => {
        if (selectedSeriesId && seriesTabs.some(s => s.id === selectedSeriesId)) {
            return selectedSeriesId;
        }
        if (seriesTabs.length === 0) return 'end_of_term';
        const newest = [...seriesTabs].sort((a, b) => b.latestMs - a.latestMs)[0];
        return newest.id;
    }, [selectedSeriesId, seriesTabs]);

    const activeSeriesBucket = seriesTabs.find(s => s.id === activeSeriesId) || null;
    const isMockActive = activeSeriesId.startsWith('mock_');
    const isMidTermActive = activeSeriesId === 'mid_term';

    const caWeight = isMidTermActive && typeof classDoc?.midTermCaWeight === 'number'
        ? classDoc.midTermCaWeight
        : (typeof classDoc?.caWeight === 'number' ? classDoc.caWeight : (typeof schoolSettings?.caWeight === 'number' ? schoolSettings.caWeight : 30));
    const examWeight = isMidTermActive && typeof classDoc?.midTermExamWeight === 'number'
        ? classDoc.midTermExamWeight
        : (typeof classDoc?.examWeight === 'number' ? classDoc.examWeight : (typeof schoolSettings?.examWeight === 'number' ? schoolSettings.examWeight : 70));

    const { data: classAverages } = useDoc<any>(useMemoFirebase(
        () => (firestore && schoolId && classId && termId && termId !== 'unknown' && activeSeriesId === 'end_of_term')
            ? doc(firestore, 'classAverages', `${schoolId}__${termId}__${classId}`)
            : null,
        [firestore, schoolId, classId, termId, activeSeriesId]
    ));

    const subjectName = (a: any) => subjectsList?.find((s: any) => s.id === a.subjectId)?.name || a.subjectName || 'Subject';

    const subjectRows = useMemo(() => {
        if (!activeSeriesBucket) return [];
        const by = new Map<string, any[]>();
        activeSeriesBucket.items.forEach(a => {
            const n = subjectName(a);
            if (!by.has(n)) by.set(n, []);
            by.get(n)!.push(a);
        });
        const classBy: Record<string, number> = {};
        if (activeSeriesId === 'end_of_term') {
            Object.entries(classAverages?.subjects || {}).forEach(([sid, v]: any) => {
                if (!(Number(v?.c) > 0)) return;
                const n = subjectsList?.find((s: any) => s.id === sid)?.name || v.name || sid;
                classBy[n] = Math.round(Number(v.s) / Number(v.c));
            });
        }

        return Array.from(by.entries()).map(([name, list]) => {
            let avg = 0;
            let caDisplay: string | null = null;
            let exDisplay: string | null = null;

            if (isMockActive) {
                const obt = list.reduce((s, a) => s + (Number(a.score) || 0), 0);
                const max = list.reduce((s, a) => s + (Number(a.maxScore) || 100), 0);
                avg = max > 0 ? Math.min(100, Math.round((obt / max) * 100)) : 0;
                exDisplay = `Raw ${Math.round(obt * 10) / 10}/${Math.round(max * 10) / 10}`;
            } else if (isMidTermActive) {
                const res = computeMidTermSubjectScore({
                    studentItems: list,
                    classSubjectItems: list,
                    caWeight,
                    examWeight,
                });
                const hasExamOnly = list.every(a => resolveMidTermSlot(a) === 'exam');
                const hasCaOnly = list.every(a => resolveMidTermSlot(a) !== 'exam');
                if (res && !hasCaOnly) {
                    avg = res.total;
                    if (!res.isSingleExamOnly && !hasExamOnly) {
                        caDisplay = `CA ${res.ca}/${caWeight}`;
                        exDisplay = `Exam ${res.exam}/${examWeight}`;
                    } else if (res.rawDisplay) {
                        exDisplay = `Raw ${res.rawDisplay}`;
                    }
                } else {
                    // Only Mid-Term CA entered so far (before Mid-Term Exam is written)
                    avg = Math.round(list.reduce((s, a) => s + (pctOf(a) as number), 0) / list.length);
                    caDisplay = `CA ${avg}% (in progress)`;
                }
            } else {
                const res = computeEndOfTermSubjectPreview(list, caWeight, examWeight);
                avg = res.total;
                caDisplay = res.ca !== null ? `CA ${res.ca}/${caWeight}` : null;
                exDisplay = res.exam !== null ? `Exam ${res.exam}/${examWeight}` : null;
            }

            const gradeInfo = getSeriesGradeFromScore(avg, {
                isMock: isMockActive,
                className: classDoc?.name,
                schoolGradingSystem: schoolSettings?.gradingSystem || null,
            });

            const sorted = [...list].sort((x, y) => (toDate(y.assessmentDate || y.createdAt)?.getTime() || 0) - (toDate(x.assessmentDate || x.createdAt)?.getTime() || 0));
            return {
                name,
                avg,
                caDisplay,
                exDisplay,
                grade: gradeInfo.grade,
                isBeceGrade: gradeInfo.isBeceGrade,
                classAvg: classBy[name] ?? null,
                list: sorted,
            };
        }).sort((a, b) => b.avg - a.avg);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSeriesBucket, activeSeriesId, isMockActive, isMidTermActive, caWeight, examWeight, classAverages, subjectsList, classDoc?.name, schoolSettings?.gradingSystem]);

    const seriesOverallAvg = subjectRows.length > 0
        ? Math.round(subjectRows.reduce((s, r) => s + r.avg, 0) / subjectRows.length)
        : 0;

    const beceSummary = useMemo(() => {
        if (!isMockActive || !isJhsOrBeceClass(classDoc?.name) || subjectRows.length === 0) return null;
        return computeBeceAggregate(subjectRows.map(r => ({ subjectName: r.name, score: r.avg })));
    }, [isMockActive, classDoc?.name, subjectRows]);

    const classOverall = activeSeriesId === 'end_of_term' && Number(classAverages?.totals?.c) > 0
        ? Math.round(Number(classAverages.totals.s) / Number(classAverages.totals.c))
        : null;
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
                    <p className="text-xs text-slate-500 font-medium mt-1">Live raw marks &amp; subject scores separated cleanly by End of Term, Mid-Term, and Mock Exams.</p>
                </div>
                <Button asChild variant="outline" size="sm" className="rounded-xl font-bold text-xs w-fit">
                    <Link href="/dashboard/my-reports"><FileText className="h-4 w-4 mr-1.5" /> Official Report Cards</Link>
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
                    <button key={t.termId} onClick={() => { setSelectedTermId(t.termId); setSelectedSeriesId(''); setOpenSubject(null); }}
                        className={cn("shrink-0 px-3.5 py-2 rounded-xl border text-left transition-all",
                            t.termId === termId ? "bg-indigo-50 border-indigo-300" : "bg-white border-slate-200 hover:border-indigo-200")}>
                        <span className="block text-[11px] font-black text-slate-800">{t.short}{t.termId === currentTermId ? ' · now' : ''}</span>
                        <span className="block text-[10px] font-bold text-slate-500">{t.list.length} raw mark{t.list.length === 1 ? '' : 's'}</span>
                    </button>
                ))}
            </div>

            {/* Assessment Series Switcher (End of Term / Mid-Term / Mock 1 / Mock 2 ...) */}
            {seriesTabs.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">Assessment Series:</span>
                    {seriesTabs.map(s => {
                        const isActive = s.id === activeSeriesId;
                        const activeColor = s.id.startsWith('mock_')
                            ? 'bg-amber-600 text-white border-amber-600'
                            : s.id === 'mid_term'
                                ? 'bg-teal-600 text-white border-teal-600'
                                : 'bg-indigo-600 text-white border-indigo-600';
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => { setSelectedSeriesId(s.id); setOpenSubject(null); }}
                                className={cn(
                                    "px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5",
                                    isActive ? `${activeColor} shadow-xs` : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                )}
                            >
                                <span>{s.label}</span>
                                <span className={cn(
                                    "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                                    isActive ? "bg-white/20 text-white" : "bg-white text-slate-500 border border-slate-200"
                                )}>
                                    {s.items.length}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {term && activeSeriesBucket && (
            <>
            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Card className="rounded-2xl border border-slate-100 bg-white"><CardContent className="p-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{activeSeriesBucket.label} Average</p>
                    <p className="text-2xl font-black text-slate-900">{seriesOverallAvg}%</p>
                    <Badge className={cn("border-none text-[9px] font-black uppercase mt-1", band(seriesOverallAvg).cls)}>{band(seriesOverallAvg).label}</Badge>
                </CardContent></Card>

                {beceSummary && beceSummary.aggregate !== null ? (
                    <Card className="rounded-2xl border border-amber-200 bg-amber-50/40"><CardContent className="p-4">
                        <p className="text-[9px] font-black text-amber-800 uppercase tracking-widest flex items-center gap-1"><Award className="h-3 w-3" /> BECE Aggregate</p>
                        <p className="text-2xl font-black text-amber-950">{beceSummary.aggregate}</p>
                        <p className="text-[10px] font-bold text-amber-800 mt-1">
                            {beceSummary.isCompleteSix ? '4 Core + Best 2 Electives' : `${beceSummary.subjectsUsed}/6 subjects graded so far`}
                        </p>
                    </CardContent></Card>
                ) : (
                    <Card className="rounded-2xl border border-slate-100 bg-white"><CardContent className="p-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Class average</p>
                        <p className="text-2xl font-black text-slate-900">{classOverall !== null ? `${classOverall}%` : '—'}</p>
                        <p className="text-[10px] font-bold text-slate-500 mt-1">
                            {classOverall !== null ? (seriesOverallAvg >= classOverall ? `${seriesOverallAvg - classOverall} points above` : `${classOverall - seriesOverallAvg} points below`) : 'Shown on official report card'}
                        </p>
                    </CardContent></Card>
                )}

                <Card className="rounded-2xl border border-slate-100 bg-white"><CardContent className="p-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Subjects Graded</p>
                    <p className="text-2xl font-black text-slate-900">{subjectRows.length}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">{activeSeriesBucket.label} · {term.short}</p>
                </CardContent></Card>

                <Card className="rounded-2xl border border-slate-100 bg-white"><CardContent className="p-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Raw Marks Recorded</p>
                    <p className="text-2xl font-black text-slate-900">{activeSeriesBucket.items.length}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">Tap any subject below to inspect</p>
                </CardContent></Card>
            </div>

            {(best || weakest) && (
                <p className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
                    {best ? <>Strongest in {activeSeriesBucket.label}: <b>{best.name}</b> ({best.avg}%). </> : null}
                    {weakest && weakest.name !== best?.name ? <>Needs most attention: <b>{weakest.name}</b> ({weakest.avg}%).</> : null}
                </p>
            )}

            {/* Subjects */}
            <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-black uppercase tracking-wider text-slate-800">
                        {activeSeriesBucket.label} Subjects · {term.label}
                    </CardTitle>
                    <CardDescription className="text-[11px]">
                        Tap any subject to see every raw mark (`score / maxScore`) and teacher remark recorded for {activeSeriesBucket.label}.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {subjectRows.map(row => {
                        const b = band(row.avg);
                        const open = openSubject === row.name;
                        const detailParts = [
                            row.caDisplay,
                            row.exDisplay,
                            row.classAvg !== null ? `Class ${row.classAvg}%` : null,
                        ].filter(Boolean);

                        return (
                            <div key={row.name} className="border-t border-slate-100">
                                <button onClick={() => setOpenSubject(open ? null : row.name)} className="w-full text-left px-5 py-4 hover:bg-slate-50/60 transition-colors">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-black text-slate-800 truncate">{row.name}</p>
                                            <p className="text-[10px] font-bold text-slate-500">
                                                {detailParts.join(' · ') || activeSeriesBucket.label}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2.5 shrink-0">
                                            <Badge variant="outline" className="text-[10px] font-black border-slate-200 text-slate-700">
                                                {row.isBeceGrade ? `BECE ${row.grade}` : `Grade ${row.grade}`}
                                            </Badge>
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
                                            const sTag = formatSeriesLabelFromId(activeSeriesId);
                                            return (
                                                <div key={a.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-100">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="text-xs font-bold text-slate-800">{a.assessmentName || a.assessmentType || 'Assessment'}</p>
                                                            <Badge variant="outline" className="text-[9px] font-black uppercase px-1.5 py-0 border-slate-200 text-slate-600">
                                                                {sTag}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-[10px] text-slate-500">{d ? format(d, 'd MMM yyyy') : ''}{a.assessmentName && a.assessmentType && a.assessmentName !== a.assessmentType ? ` · ${a.assessmentType}` : ''}</p>
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
