'use client';

import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Archive, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';

/**
 * End-of-term rollover, run by an administrator:
 *   1. Dry run  — the server calculates every student's carried balance; nothing is written.
 *   2. Confirm  — the server closes the term shown in the dry run (and only that term).
 * The term to close comes from Admin → School Profile; it cannot be typed in here.
 */

interface TermRolloverModalProps {
  schoolId: string;
  /** Ignored: the term always comes from the school profile. Kept so existing callers still compile. */
  currentTermId?: string;
  /** Ignored: the next term is worked out on the server. */
  nextTermId?: string;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

interface PlanLine {
  studentId: string;
  studentName: string;
  classId: string;
  owing: number;
  credit: number;
  net: number;
  recordCount: number;
}

interface Plan {
  fromTerm: { termId: string; academicYear: string; term: string };
  toTerm: { termId: string; academicYear: string; term: string };
  newTermStartDate: string | null;
  students: PlanLine[];
  totals: {
    students: number;
    studentsWithArrears: number;
    studentsWithCredit: number;
    arrearsCarried: number;
    creditCarried: number;
    recordsToArchive: number;
    recordsWithoutStudent: number;
  };
  blockers: Array<{ recordId: string; studentName: string; reason: string }>;
  alreadyCompleted: boolean;
  resumePending?: boolean;
}

const money = (n: number) => `GH₵${(Number(n) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function TermRolloverModal({ schoolId, onSuccess, open: openProp, onOpenChange, trigger }: TermRolloverModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof openProp === 'boolean';
  const open = isControlled ? openProp : internalOpen;
  const { user } = useUser();
  const { toast } = useToast();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState<'idle' | 'planning' | 'executing'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [search, setSearch] = useState('');
  const [result, setResult] = useState<any>(null);

  const setOpen = (val: boolean) => {
    if (!isControlled) setInternalOpen(val);
    onOpenChange?.(val);
    if (!val) {
      setPlan(null);
      setError(null);
      setConfirmed(false);
      setSearch('');
      setResult(null);
    }
  };

  const callApi = async (body: Record<string, any>) => {
    if (!user) throw new Error('You are not signed in.');
    const token = await user.getIdToken();
    const res = await fetch('/api/terms/rollover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ schoolId, ...body }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  };

  const runDryRun = async () => {
    setLoading('planning');
    setError(null);
    setConfirmed(false);
    try {
      setPlan(await callApi({ mode: 'dry-run' }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading('idle');
    }
  };

  const execute = async () => {
    if (!plan) return;
    setLoading('executing');
    setError(null);
    try {
      const data = await callApi({ mode: 'execute', expectedFromTermId: plan.fromTerm.termId });
      setResult(data);
      toast({
        title: data.alreadyCompleted ? 'Term was already closed' : 'Term closed',
        description: `${data.processedStudents} students. Arrears carried: ${money(data.totalArrearsCarried)}. Credit carried: ${money(data.totalCreditCarried)}.`,
      });
      onSuccess?.();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading('idle');
    }
  };

  const visibleLines = useMemo(() => {
    if (!plan) return [];
    const q = search.trim().toLowerCase();
    return plan.students
      .filter(s => Math.abs(s.net) > 0.009 || s.credit > 0.009)
      .filter(s => !q || s.studentName.toLowerCase().includes(q) || s.classId.toLowerCase().includes(q))
      .slice(0, 300);
  }, [plan, search]);

  const blocked = !!plan && (plan.blockers.length > 0 || plan.alreadyCompleted);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== null && (
        <DialogTrigger asChild>
          {trigger || (
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 rounded-xl shadow-md">
              <Archive className="h-4 w-4" />
              End of Term
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            Close Term &amp; Carry Balances Forward
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Run a dry run first. It calculates every student&apos;s balance without changing anything. Then confirm to close the term.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-800 flex gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> {error}
          </div>
        )}

        {result ? (
          <div className="space-y-3 my-2">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-sm space-y-1">
              <p className="font-black flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {result.alreadyCompleted ? 'This term had already been closed.' : 'Term closed.'}</p>
              <p>{result.fromTermId} → {result.toTermId}</p>
              <p>{result.processedStudents} students · arrears carried {money(result.totalArrearsCarried)} · credit carried {money(result.totalCreditCarried)} · {result.recordsArchived} bills archived</p>
              {result.resumed && <p className="text-xs">An earlier interrupted run was completed using the figures it had already calculated.</p>}
            </div>
            <div className="flex justify-end"><Button onClick={() => setOpen(false)}>Done</Button></div>
          </div>
        ) : !plan ? (
          <div className="my-4 space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 space-y-2">
              <p>What closing the term does:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Each student&apos;s unpaid bills and credits are netted into one balance.</li>
                <li>A balance owed becomes one <b>Arrears Brought Forward</b> bill (Unpaid) in the next term, itemised by fee type.</li>
                <li>A credit becomes <b>Credit Brought Forward</b> and is applied to the student&apos;s next bills automatically.</li>
                <li>The closed term&apos;s bills are archived and become read-only, so nothing is counted twice.</li>
                <li>The school profile moves to the next term.</li>
              </ul>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={runDryRun} disabled={loading !== 'idle'} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2">
                {loading === 'planning' ? <><Loader2 className="h-4 w-4 animate-spin" /> Calculating…</> : 'Run dry run'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="my-2 space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Closing</p>
                <p className="font-extrabold text-slate-800">{plan.fromTerm.term} {plan.fromTerm.academicYear}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400" />
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase">Opening</p>
                <p className="font-extrabold text-indigo-600">{plan.toTerm.term} {plan.toTerm.academicYear}</p>
                <p className="text-[11px] text-slate-500">{plan.newTermStartDate ? `Starts ${plan.newTermStartDate}` : 'Start date not set in School Profile'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="p-3 rounded-xl border"><p className="text-[10px] uppercase font-bold text-slate-400">Arrears carried</p><p className="font-black text-red-700">{money(plan.totals.arrearsCarried)}</p><p className="text-[11px] text-slate-500">{plan.totals.studentsWithArrears} students</p></div>
              <div className="p-3 rounded-xl border"><p className="text-[10px] uppercase font-bold text-slate-400">Credit carried</p><p className="font-black text-emerald-700">{money(plan.totals.creditCarried)}</p><p className="text-[11px] text-slate-500">{plan.totals.studentsWithCredit} students</p></div>
              <div className="p-3 rounded-xl border"><p className="text-[10px] uppercase font-bold text-slate-400">Bills to archive</p><p className="font-black">{plan.totals.recordsToArchive}</p></div>
              <div className="p-3 rounded-xl border"><p className="text-[10px] uppercase font-bold text-slate-400">Students</p><p className="font-black">{plan.totals.students}</p></div>
            </div>

            {plan.resumePending && (
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-900">
                An earlier attempt to close this term was interrupted. These are the figures it had already calculated. Confirm to finish it.
              </div>
            )}
            {plan.alreadyCompleted && (
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-900">
                {plan.fromTerm.term} {plan.fromTerm.academicYear} has already been closed. Check the term in School Profile.
              </div>
            )}
            {plan.blockers.length > 0 && (
              <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-900 space-y-1">
                <p className="font-bold">Resolve these before closing the term ({plan.blockers.length}):</p>
                {plan.blockers.slice(0, 10).map(b => <p key={b.recordId}>• {b.studentName || b.recordId}: {b.reason}</p>)}
              </div>
            )}
            {plan.totals.recordsWithoutStudent > 0 && (
              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-900">
                {plan.totals.recordsWithoutStudent} bill(s) have no student attached. They will be left as they are.
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                <Input className="pl-9" placeholder="Search student or class" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="max-h-72 overflow-auto border rounded-xl">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr className="text-left text-slate-500">
                      <th className="p-2">Student</th><th className="p-2 text-right">Owing</th><th className="p-2 text-right">Credit</th><th className="p-2 text-right">Carried</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleLines.map(s => (
                      <tr key={s.studentId} className="border-t">
                        <td className="p-2">{s.studentName}<span className="text-slate-400"> · {s.recordCount} bills</span></td>
                        <td className="p-2 text-right">{money(s.owing)}</td>
                        <td className="p-2 text-right">{money(s.credit)}</td>
                        <td className={`p-2 text-right font-bold ${s.net > 0 ? 'text-red-700' : s.net < 0 ? 'text-emerald-700' : ''}`}>
                          {s.net > 0 ? `${money(s.net)} owed` : s.net < 0 ? `${money(-s.net)} credit` : '—'}
                        </td>
                      </tr>
                    ))}
                    {visibleLines.length === 0 && <tr><td className="p-3 text-slate-400" colSpan={4}>No balances to carry.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" className="mt-1" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} disabled={blocked} />
              I have checked these figures. Close {plan.fromTerm.term} {plan.fromTerm.academicYear} and open {plan.toTerm.term} {plan.toTerm.academicYear}.
            </label>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={runDryRun} disabled={loading !== 'idle'}>Refresh dry run</Button>
              <Button onClick={execute} disabled={!confirmed || blocked || loading !== 'idle'} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
                {loading === 'executing' ? <><Loader2 className="h-4 w-4 animate-spin" /> Closing term…</> : 'Close term'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
