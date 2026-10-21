'use client';
/**
 * "Fee Changes to Review" (Director) and "Director's Queries" (Accountant).
 *
 * Every bill change made by anyone other than the Director is recorded by the server in financeReviews
 * (functions/src/finance-review.ts). The Director marks each one OK or queries it; the accountant answers
 * queries here. Nothing is loaded until the card is opened — the card itself costs 1 read (a COUNT).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, where, getDocs, getCountFromServer, doc, updateDoc, serverTimestamp, limit, writeBatch } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldAlert, CheckCircle2, MessageSquareWarning, FileWarning } from 'lucide-react';

type Review = {
    id: string; schoolId: string; recordId: string; studentId: string; studentName: string; billType: string; description: string;
    kind: string; risk: 'high' | 'normal'; changes: Record<string, { from: any; to: any }>; amountPaidAtEdit: number; reason: string;
    editedBy: string; editedByName: string; editedByRole: string; at: any; status: string;
    directorNote?: string; response?: string; resolvedByName?: string;
};

const KIND_LABEL: Record<string, string> = {
    reduced: 'Amount reduced', increased: 'Amount increased', details: 'Details changed', moved: 'Moved to another student', deleted: 'Bill deleted', reversed: 'Payment reversed',
    expense: 'Expense paid out', salary: 'Salary set-up changed', payroll: 'Payroll run',
    cancelled: 'Canteen/transport cancelled',
};
const MONEY_OUT = new Set(['expense', 'salary', 'payroll', 'cancelled']);
const FIELD_LABEL: Record<string, string> = { billedAmount: 'Amount (GH₵)', type: 'Fee type', description: 'Description', studentId: 'Student', termId: 'Term', academicYear: 'Academic year', term: 'Term', bill: 'Bill', receipt: 'Receipt',
    expense: 'Expense', basicSalary: 'Basic salary', allowances: 'Allowances', deductions: 'Deductions', bankAccount: 'Bank account', payroll: 'Payroll', cancelled: 'Cancelled' };
const when = (v: any) => { const ms = v?.toMillis?.() ?? (v?.seconds ? v.seconds * 1000 : 0); return ms ? new Date(ms).toLocaleString() : ''; };

export function FeeChangeReviewPanel({ schoolId, mode }: { schoolId?: string | null; mode: 'director' | 'accountant' }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [count, setCount] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<Review[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [busyId, setBusyId] = useState<string | null>(null);

    const baseQuery = useCallback(() => {
        if (!firestore || !schoolId || !user) return null;
        const col = collection(firestore, 'financeReviews');
        return mode === 'director'
            ? query(col, where('schoolId', '==', schoolId), where('status', 'in', ['pending', 'answered']))
            : query(col, where('schoolId', '==', schoolId), where('editedBy', '==', user.uid), where('status', '==', 'queried'));
    }, [firestore, schoolId, user, mode]);

    const refreshCount = useCallback(async () => {
        const q = baseQuery();
        if (!q) return;
        try { setCount((await getCountFromServer(q)).data().count); } catch { setCount(null); }
    }, [baseQuery]);
    useEffect(() => { refreshCount(); }, [refreshCount]);

    const loadItems = useCallback(async () => {
        const q = baseQuery();
        if (!q) return;
        setLoading(true);
        try {
            const snap = await getDocs(query(q, limit(200)));
            const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Review[];
            list.sort((a, b) => (b.risk === 'high' ? 1 : 0) - (a.risk === 'high' ? 1 : 0) || ((b.at?.seconds || 0) - (a.at?.seconds || 0)));
            setItems(list);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Could not load', description: e?.message });
        } finally { setLoading(false); }
    }, [baseQuery, toast]);

    const act = async (r: Review, status: 'ok' | 'queried' | 'answered') => {
        if (!firestore || !user) return;
        const note = (notes[r.id] || '').trim();
        if ((status === 'queried' || status === 'answered') && note.length < 3) {
            toast({ variant: 'destructive', title: status === 'queried' ? 'Add your question' : 'Add your answer' });
            return;
        }
        setBusyId(r.id);
        try {
            const name = user.displayName || user.email || 'Staff';
            const patch: any = status === 'answered'
                ? { status, response: note, respondedAt: serverTimestamp() }
                : { status, directorNote: note || null, resolvedBy: user.uid, resolvedByName: name, resolvedAt: serverTimestamp() };
            await updateDoc(doc(firestore, 'financeReviews', r.id), patch);
            setItems(prev => (prev || []).filter(x => x.id !== r.id));
            setCount(c => (c ? c - 1 : 0));
            toast({ title: status === 'ok' ? 'Marked OK' : status === 'queried' ? 'Query sent to the accountant' : 'Answer sent to the Director' });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Not saved', description: e?.code === 'permission-denied' ? 'You cannot review your own change.' : e?.message });
        } finally { setBusyId(null); }
    };

    // Director: mark every item currently shown as OK in one go (normal-risk only unless includeHigh).
    const [bulkBusy, setBulkBusy] = useState(false);
    const markAllOk = async (includeHigh: boolean) => {
        if (!firestore || !user || !items?.length) return;
        const targets = items.filter(r => r.editedBy !== user.uid && (includeHigh || r.risk !== 'high'));
        if (!targets.length) return;
        if (typeof window !== 'undefined' && !window.confirm(`Mark ${targets.length} item${targets.length === 1 ? '' : 's'} as OK?`)) return;
        setBulkBusy(true);
        try {
            const name = user.displayName || user.email || 'Director';
            for (let i = 0; i < targets.length; i += 400) {
                const batch = writeBatch(firestore);
                targets.slice(i, i + 400).forEach(r => batch.update(doc(firestore, 'financeReviews', r.id), {
                    status: 'ok', directorNote: null, resolvedBy: user.uid, resolvedByName: name, resolvedAt: serverTimestamp(),
                }));
                await batch.commit();
            }
            const done = new Set(targets.map(t => t.id));
            setItems(prev => (prev || []).filter(x => !done.has(x.id)));
            setCount(c => Math.max(0, (c || 0) - targets.length));
            toast({ title: `${targets.length} marked OK` });
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Not saved', description: e?.message });
        } finally { setBulkBusy(false); }
    };

    const highCount = useMemo(() => (items || []).filter(i => i.risk === 'high').length, [items]);
    if (!schoolId) return null;

    const title = mode === 'director' ? 'Fee & Expense Changes to Review' : "Director's Queries on Your Changes";
    return (
        <>
            <Card className={`p-4 rounded-2xl border ${count ? 'border-amber-300 bg-amber-50/60' : 'border-slate-100 bg-white'} flex items-center justify-between gap-3`}>
                <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl ${count ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                        {mode === 'director' ? <ShieldAlert className="h-5 w-5" /> : <MessageSquareWarning className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800">{title}</p>
                        <p className="text-xs text-slate-500">
                            {count === null ? '—' : count === 0
                                ? (mode === 'director' ? 'No bill changes waiting for you.' : 'No open queries.')
                                : mode === 'director' ? `${count} change${count === 1 ? '' : 's'} (bills, expenses, salaries) made by staff waiting for your review.` : `${count} quer${count === 1 ? 'y' : 'ies'} from the Director to answer.`}
                        </p>
                    </div>
                </div>
                <Button size="sm" variant={count ? 'default' : 'outline'} onClick={() => { setOpen(true); loadItems(); }}>Open</Button>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[760px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {mode === 'director'
                                ? 'Every change to what a family owes, every expense voucher, salary change and payroll run made by anyone other than you is recorded by the server — it cannot be hidden from this list. Mark each one OK, or query it and the staff member must answer.'
                                : 'The Director has questions about these changes. Please explain each one.'}
                            {highCount > 0 && <span className="block mt-1 text-rose-700 font-semibold">{highCount} marked high-risk (amount lowered after payment, bill moved or deleted, payment reversed, large or over-budget expense, pay raised or bank account changed).</span>}
                        </DialogDescription>
                    </DialogHeader>
                    {mode === 'director' && !!items?.length && (
                        <div className="flex flex-wrap gap-2 justify-end">
                            <Button size="sm" variant="outline" disabled={bulkBusy} onClick={() => markAllOk(false)}>
                                {bulkBusy ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle2 className="h-4 w-4 mr-1" />}Mark all normal-risk OK
                            </Button>
                            {highCount > 0 && (
                                <Button size="sm" variant="ghost" className="text-rose-700" disabled={bulkBusy} onClick={() => markAllOk(true)}>Mark ALL shown OK</Button>
                            )}
                        </div>
                    )}
                    {loading ? (
                        <div className="py-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
                    ) : !items || items.length === 0 ? (
                        <p className="py-8 text-center text-sm text-slate-500">Nothing to review.</p>
                    ) : (
                        <div className="space-y-3">
                            {items.map(r => (
                                <div key={r.id} className={`rounded-xl border p-3 text-sm ${r.risk === 'high' ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'}`}>
                                    <div className="flex flex-wrap items-center gap-2 justify-between">
                                        <div className="font-semibold text-slate-800">{r.studentName || 'Student'} · {r.billType}{r.description ? ` — ${r.description}` : ''}</div>
                                        <div className="flex gap-1">
                                            {r.risk === 'high' && <Badge className="bg-rose-600 text-white"><FileWarning className="h-3 w-3 mr-1" />High risk</Badge>}
                                            <Badge variant="outline">{KIND_LABEL[r.kind] || r.kind}</Badge>
                                            {r.status === 'answered' && <Badge className="bg-blue-600 text-white">Answered</Badge>}
                                        </div>
                                    </div>
                                    <div className="mt-2 grid gap-1">
                                        {Object.entries(r.changes || {}).map(([k, v]) => (
                                            <div key={k} className="text-xs"><span className="text-slate-500">{FIELD_LABEL[k] || k}:</span> <span className="line-through text-slate-500">{String(v.from ?? '—')}</span> → <strong>{String(v.to ?? '—')}</strong></div>
                                        ))}
                                        {!MONEY_OUT.has(r.kind) && (
                                            <div className="text-xs text-slate-500">Already paid on this bill at the time: GH₵{Number(r.amountPaidAtEdit || 0).toFixed(2)}</div>
                                        )}
                                        <div className="text-xs"><span className="text-slate-500">By:</span> {r.editedByName || 'Unknown'}{r.editedByRole ? ` (${r.editedByRole})` : ''} · {when(r.at)}</div>
                                        <div className="text-xs"><span className="text-slate-500">Reason given:</span> {r.reason || <em className="text-rose-700">none given</em>}</div>
                                        {r.directorNote && <div className="text-xs"><span className="text-slate-500">Director&apos;s question:</span> {r.directorNote}</div>}
                                        {r.response && <div className="text-xs"><span className="text-slate-500">Accountant&apos;s answer:</span> {r.response}</div>}
                                    </div>
                                    <div className="mt-2 flex flex-col sm:flex-row gap-2">
                                        <Textarea rows={1} className="text-xs" placeholder={mode === 'director' ? 'Question for the accountant (for Query)…' : 'Your explanation…'}
                                            value={notes[r.id] || ''} onChange={e => setNotes(n => ({ ...n, [r.id]: e.target.value }))} />
                                        {mode === 'director' ? (
                                            <div className="flex gap-2 shrink-0">
                                                <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => act(r, 'queried')}>Query</Button>
                                                <Button size="sm" disabled={busyId === r.id} onClick={() => act(r, 'ok')}><CheckCircle2 className="h-4 w-4 mr-1" />OK</Button>
                                            </div>
                                        ) : (
                                            <Button size="sm" className="shrink-0" disabled={busyId === r.id} onClick={() => act(r, 'answered')}>Send answer</Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
