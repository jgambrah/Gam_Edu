'use client';
/**
 * "Students Not Billed This Term" — for the Director and the Accountant (not Administrators).
 *
 * Flags, for the current term:
 *   • every active pupil with NO Tuition Fee bill;
 *   • every NEW pupil (joined this term) with no Admission Fee bill.
 * Canteen and transport bills (attendance billing) never count as fees here, so a pupil who only has
 * canteen/transport bills is still flagged for tuition. Other fees (PTA, exam, books…) are shown for
 * information.
 *
 * Read cost: studentRoster + termBilling (both kept by the server) + the school profile = 3 reads, cached.
 * Class names are read only when the list is opened. Nothing is read per bill.
 * The list pops up by itself once a day per user while anyone is flagged; afterwards it is a card.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useFirestore, useUser } from '@/firebase';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2, UserX, Receipt } from 'lucide-react';
import { readOnceCached } from '@/lib/firestore-once';
import { currentTermFromProfile, type TermStamp } from '@/lib/term';

type Flagged = {
    id: string; name: string; classId: string; studentId: string;
    isNew: boolean; noTuition: boolean; noAdmission: boolean; otherFees: number;
};
type Filter = 'all' | 'tuition' | 'new';

const TEN_MIN = 10 * 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;
const isActiveStudent = (s: any) => s && s.isArchived !== true && (s.enrollmentStatus === 'Active' || !s.enrollmentStatus);
const toMs = (v: any): number => {
    if (!v) return 0;
    if (typeof v?.toMillis === 'function') return v.toMillis();
    if (typeof v?.seconds === 'number') return v.seconds * 1000;
    if (typeof v?._seconds === 'number') return v._seconds * 1000;
    const t = new Date(v).getTime();
    return Number.isFinite(t) ? t : 0;
};

export function UnbilledStudentsPanel({ schoolId }: { schoolId?: string | null }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const [term, setTerm] = useState<TermStamp | null>(null);
    const [list, setList] = useState<Flagged[] | null>(null);
    const [state, setState] = useState<'loading' | 'ready' | 'preparing' | 'noterm' | 'toolarge' | 'error'>('loading');
    const [open, setOpen] = useState(false);
    const [classNames, setClassNames] = useState<Record<string, string>>({});
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<Filter>('all');

    const load = useCallback(async (force = false) => {
        if (!firestore || !schoolId) return;
        try {
            const [profileArr, rosterArr, billingArr] = await Promise.all([
                readOnceCached(`unbilled:profile:${schoolId}`, async () => {
                    const s = await getDoc(doc(firestore, 'schools', schoolId));
                    let p: any = s.exists() ? s.data() : null;
                    if (!currentTermFromProfile(p)) {
                        const st = await getDoc(doc(firestore, 'schoolSettings', schoolId));
                        // School Settings holds the term (and maybe the start date) for some schools.
                        p = { ...(p || {}), ...(st.exists() ? st.data() : {}) };
                    }
                    return [p];
                }, { ttlMs: TEN_MIN, force }),
                readOnceCached(`unbilled:roster:${schoolId}`, async () => { const s = await getDoc(doc(firestore, 'studentRoster', schoolId)); return [s.exists() ? s.data() : null]; }, { ttlMs: TEN_MIN, force }),
                readOnceCached(`unbilled:billing:${schoolId}`, async () => { const s = await getDoc(doc(firestore, 'termBilling', schoolId)); return [s.exists() ? s.data() : null]; }, { ttlMs: TEN_MIN, force }),
            ]);
            const profile: any = profileArr[0];
            const roster: any = rosterArr[0];
            const billing: any = billingArr[0];
            const stamp = currentTermFromProfile(profile);
            setTerm(stamp);
            if (!stamp) { setState('noterm'); return; }
            if (!roster?.students) { setState(roster?.tooLarge ? 'toolarge' : 'preparing'); return; }
            // Until the server has counted every existing bill once (by fee kind), the tally would be incomplete.
            if (!billing?.rebuiltAt || billing?.v !== 2) { setState('preparing'); return; }

            // "New this term": joined on/after the term start date (School Profile), else within the last 120 days.
            const termStartMs = toMs(profile?.termStartDate);
            const newSince = termStartMs || (Date.now() - 120 * DAY);

            const fees: Record<string, { t?: number; a?: number; o?: number }> = billing.termFees?.[stamp.termId] || {};
            const out: Flagged[] = [];
            Object.entries(roster.students as Record<string, any>).forEach(([id, s]) => {
                if (!isActiveStudent(s)) return;
                // Bills may carry any of the pupil's ids (doc id, login uid, student/admission number).
                const keys = Array.from(new Set([id, s.uid, s.studentId, s.admissionNo, s.admissionNumber].filter(Boolean).map(String)));
                let t = 0, a = 0, o = 0;
                keys.forEach(k => { const f = fees[k]; if (f) { t += Number(f.t) || 0; a += Number(f.a) || 0; o += Number(f.o) || 0; } });
                const joinedMs = toMs(s.admissionDate) || toMs(s.enrollmentDate) || toMs(s.createdAt);
                const isNew = s.isImported !== true && joinedMs > 0 && joinedMs >= newSince;
                const noTuition = t <= 0;
                const noAdmission = isNew && a <= 0;
                if (!noTuition && !noAdmission) return;
                out.push({
                    id, name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Unnamed pupil', classId: s.classId || '',
                    studentId: s.studentId || s.admissionNo || '', isNew, noTuition, noAdmission, otherFees: o,
                });
            });
            out.sort((x, y) => x.classId.localeCompare(y.classId) || x.name.localeCompare(y.name));
            setList(out);
            setState('ready');
        } catch (e) {
            console.warn('Unbilled check failed:', e);
            setState('error');
        }
    }, [firestore, schoolId]);

    useEffect(() => { load(); }, [load]);

    // Pop up by itself once a day per user (per school and term) while someone is flagged.
    useEffect(() => {
        if (state !== 'ready' || !list?.length || !term || !user) return;
        const key = `unbilledPopup:${schoolId}:${term.termId}:${user.uid}`;
        const today = new Date().toISOString().slice(0, 10);
        try {
            if (localStorage.getItem(key) === today) return;
            localStorage.setItem(key, today);
        } catch { /* storage unavailable: still show it */ }
        setOpen(true);
    }, [state, list, term, user, schoolId]);

    // Class names only when the list is opened (one small read, cached).
    useEffect(() => {
        if (!open || !firestore || !schoolId || Object.keys(classNames).length) return;
        readOnceCached(`unbilled:classes:${schoolId}`, async () => {
            const snap = await getDocs(query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)));
            return snap.docs.map(d => ({ id: d.id, name: (d.data() as any).name || d.id }));
        }, { ttlMs: TEN_MIN }).then(rows => setClassNames(Object.fromEntries(rows.map((r: any) => [r.id, r.name])))).catch(() => undefined);
    }, [open, firestore, schoolId, classNames]);

    const counts = useMemo(() => ({
        tuition: (list || []).filter(s => s.noTuition).length,
        newNoAdmission: (list || []).filter(s => s.noAdmission).length,
        newPupils: (list || []).filter(s => s.isNew).length,
    }), [list]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return (list || [])
            .filter(s => filter === 'all' || (filter === 'tuition' ? s.noTuition : s.isNew))
            .filter(s => !q || s.name.toLowerCase().includes(q) || (classNames[s.classId] || '').toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q));
    }, [list, search, classNames, filter]);

    if (!schoolId) return null;
    const count = list?.length || 0;
    const termName = term ? `${term.term} ${term.academicYear}` : 'this term';

    let line: string;
    if (state === 'loading') line = 'Checking…';
    else if (state === 'preparing') line = 'Being prepared — available after the next full finance update.';
    else if (state === 'noterm') line = 'Set the current academic year and term in School Profile to use this check.';
    else if (state === 'toolarge') line = 'Not available for a school this large yet.';
    else if (state === 'error') line = 'Could not check right now.';
    else if (count === 0) line = `Every active pupil has a Tuition bill for ${termName}, and every new pupil an Admission Fee.`;
    else {
        const parts: string[] = [];
        if (counts.tuition) parts.push(`${counts.tuition} with no Tuition bill`);
        if (counts.newNoAdmission) parts.push(`${counts.newNoAdmission} new pupil${counts.newNoAdmission === 1 ? '' : 's'} with no Admission Fee`);
        line = `${parts.join(' · ')} (${termName}).`;
    }

    return (
        <>
            <Card className={`p-4 rounded-2xl border ${count ? 'border-rose-300 bg-rose-50/60' : 'border-slate-100 bg-white'} flex items-center justify-between gap-3`}>
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl ${count ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                        {state === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserX className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800">Students Not Billed This Term</p>
                        <p className="text-xs text-slate-500">{line}</p>
                    </div>
                </div>
                {count > 0 && <Button size="sm" onClick={() => setOpen(true)}>View</Button>}
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[680px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Pupils missing fees for {termName}</DialogTitle>
                        <DialogDescription>
                            Every active pupil should have a <strong>Tuition Fee</strong> bill this term, and every new pupil an{' '}
                            <strong>Admission Fee</strong> too. Canteen and transport bills do not count as fees here.
                            Bill them in Student Billing, or mark them withdrawn if they have left.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-wrap gap-1.5">
                        {([['all', `All (${count})`], ['tuition', `No Tuition (${counts.tuition})`], ['new', `New pupils (${counts.newPupils})`]] as [Filter, string][]).map(([f, label]) => (
                            <button key={f} type="button" onClick={() => setFilter(f)}
                                className={`text-xs rounded-full px-3 py-1 border ${filter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}>
                                {label}
                            </button>
                        ))}
                    </div>
                    <Input placeholder="Search name, class or ID…" value={search} onChange={e => setSearch(e.target.value)} className="h-9" />
                    <div className="rounded-xl border divide-y max-h-[45vh] overflow-y-auto">
                        {filtered.map(s => (
                            <div key={s.id} className="px-3 py-2 text-sm flex flex-wrap items-center justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="font-medium text-slate-800">
                                        {s.name}{s.studentId ? <span className="text-slate-400 font-normal"> · {s.studentId}</span> : null}
                                        {s.isNew && <span className="ml-2 text-[10px] font-bold uppercase rounded-full bg-blue-100 text-blue-700 px-1.5 py-0.5">New</span>}
                                    </div>
                                    <div className="text-xs text-slate-500">{classNames[s.classId] || (s.classId ? '…' : 'No class')}{s.otherFees > 0 ? ` · ${s.otherFees} other fee bill${s.otherFees === 1 ? '' : 's'}` : ''}</div>
                                </div>
                                <div className="flex gap-1">
                                    {s.noTuition && <span className="text-[11px] font-semibold rounded-full bg-rose-100 text-rose-700 px-2 py-0.5">No Tuition</span>}
                                    {s.noAdmission && <span className="text-[11px] font-semibold rounded-full bg-amber-100 text-amber-800 px-2 py-0.5">No Admission Fee</span>}
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && <p className="p-4 text-center text-sm text-slate-500">No matches.</p>}
                    </div>
                    <p className="text-[11px] text-slate-500">
                        &quot;New&quot; = joined on or after the term start date in School Profile (or in the last 120 days if no start date is set).
                        Pupils brought in by data migration are not treated as new.
                    </p>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => load(true)}>Check again</Button>
                        <Button variant="outline" onClick={() => setOpen(false)}>Later</Button>
                        <Button asChild><Link href="/dashboard/accounts"><Receipt className="h-4 w-4 mr-1" />Go to Student Billing</Link></Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
