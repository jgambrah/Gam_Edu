'use client';
/**
 * "Students Not Billed This Term" — for the Director and the Accountant (not Administrators).
 *
 * Lists active pupils (including newly enrolled ones) who have no school-fee bill for the current term.
 * Canteen and transport bills do not count as school fees.
 *
 * Read cost: 2 documents (studentRoster + termBilling, both kept by the server) plus the school's current
 * term (1–2 reads, cached). Class names are read only when the list is opened. Nothing is read per bill.
 * The list pops up by itself once a day per user while anyone is unbilled; afterwards it is a card.
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
import { fetchCurrentTermStamp } from '@/lib/billing';
import { readOnceCached } from '@/lib/firestore-once';
import type { TermStamp } from '@/lib/term';

type Unbilled = { id: string; name: string; classId: string; studentId: string };

const TEN_MIN = 10 * 60 * 1000;
const isActiveStudent = (s: any) => s && s.isArchived !== true && (s.enrollmentStatus === 'Active' || !s.enrollmentStatus);

export function UnbilledStudentsPanel({ schoolId }: { schoolId?: string | null }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const [term, setTerm] = useState<TermStamp | null>(null);
    const [list, setList] = useState<Unbilled[] | null>(null);
    const [state, setState] = useState<'loading' | 'ready' | 'preparing' | 'noterm' | 'toolarge' | 'error'>('loading');
    const [open, setOpen] = useState(false);
    const [classNames, setClassNames] = useState<Record<string, string>>({});
    const [search, setSearch] = useState('');

    const load = useCallback(async (force = false) => {
        if (!firestore || !schoolId) return;
        try {
            const [stampArr, rosterArr, billingArr] = await Promise.all([
                readOnceCached(`unbilled:term:${schoolId}`, async () => [await fetchCurrentTermStamp(firestore, schoolId)], { ttlMs: TEN_MIN, force }),
                readOnceCached(`unbilled:roster:${schoolId}`, async () => { const s = await getDoc(doc(firestore, 'studentRoster', schoolId)); return [s.exists() ? s.data() : null]; }, { ttlMs: TEN_MIN, force }),
                readOnceCached(`unbilled:billing:${schoolId}`, async () => { const s = await getDoc(doc(firestore, 'termBilling', schoolId)); return [s.exists() ? s.data() : null]; }, { ttlMs: TEN_MIN, force }),
            ]);
            const stamp = (stampArr[0] || null) as TermStamp | null;
            const roster: any = rosterArr[0];
            const billing: any = billingArr[0];
            setTerm(stamp);
            if (!stamp) { setState('noterm'); return; }
            if (!roster?.students) { setState(roster?.tooLarge ? 'toolarge' : 'preparing'); return; }
            // Until the server has counted every existing bill once, the tally would be incomplete.
            if (!billing?.rebuiltAt) { setState('preparing'); return; }
            const billed: Record<string, number> = billing.terms?.[stamp.termId] || {};
            const has = (k: any) => !!k && Number(billed[String(k)] || 0) > 0;
            const out: Unbilled[] = [];
            Object.entries(roster.students as Record<string, any>).forEach(([id, s]) => {
                if (!isActiveStudent(s)) return;
                if ([id, s.uid, s.studentId, s.admissionNo, s.admissionNumber].some(has)) return;
                out.push({ id, name: `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Unnamed pupil', classId: s.classId || '', studentId: s.studentId || s.admissionNo || '' });
            });
            out.sort((a, b) => a.classId.localeCompare(b.classId) || a.name.localeCompare(b.name));
            setList(out);
            setState('ready');
        } catch (e) {
            console.warn('Unbilled check failed:', e);
            setState('error');
        }
    }, [firestore, schoolId]);

    useEffect(() => { load(); }, [load]);

    // Pop up by itself once a day per user (per school and term) while someone is unbilled.
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

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return list || [];
        return (list || []).filter(s => s.name.toLowerCase().includes(q) || (classNames[s.classId] || '').toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q));
    }, [list, search, classNames]);

    const byClass = useMemo(() => {
        const m = new Map<string, number>();
        (list || []).forEach(s => m.set(s.classId, (m.get(s.classId) || 0) + 1));
        return Array.from(m.entries());
    }, [list]);

    if (!schoolId) return null;
    const count = list?.length || 0;
    const termName = term ? `${term.term} ${term.academicYear}` : 'this term';

    let line: string;
    if (state === 'loading') line = 'Checking…';
    else if (state === 'preparing') line = 'Being prepared — available after the next full finance update.';
    else if (state === 'noterm') line = 'Set the current academic year and term in School Profile to use this check.';
    else if (state === 'toolarge') line = 'Not available for a school this large yet.';
    else if (state === 'error') line = 'Could not check right now.';
    else line = count === 0 ? `Every active pupil has a school-fee bill for ${termName}.` : `${count} active pupil${count === 1 ? ' has' : 's have'} no school-fee bill for ${termName}.`;

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
                <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{count} pupil{count === 1 ? '' : 's'} not billed for {termName}</DialogTitle>
                        <DialogDescription>
                            These active pupils — including any newly enrolled — have no school-fee bill this term (canteen and
                            transport bills are not counted). Bill them in Student Billing, or mark them withdrawn if they have left.
                        </DialogDescription>
                    </DialogHeader>
                    {byClass.length > 1 && (
                        <div className="flex flex-wrap gap-1.5">
                            {byClass.map(([cid, n]) => (
                                <span key={cid || 'none'} className="text-[11px] rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{classNames[cid] || (cid ? 'Class' : 'No class')}: {n}</span>
                            ))}
                        </div>
                    )}
                    <Input placeholder="Search name, class or ID…" value={search} onChange={e => setSearch(e.target.value)} className="h-9" />
                    <div className="rounded-xl border divide-y max-h-[45vh] overflow-y-auto">
                        {filtered.map(s => (
                            <div key={s.id} className="px-3 py-2 text-sm flex justify-between gap-2">
                                <span className="font-medium text-slate-800">{s.name}{s.studentId ? <span className="text-slate-400 font-normal"> · {s.studentId}</span> : null}</span>
                                <span className="text-slate-500 text-xs">{classNames[s.classId] || (s.classId ? '…' : 'No class')}</span>
                            </div>
                        ))}
                        {filtered.length === 0 && <p className="p-4 text-center text-sm text-slate-500">No matches.</p>}
                    </div>
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
