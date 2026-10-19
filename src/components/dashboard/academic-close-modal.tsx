'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, GraduationCap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';

/**
 * End-of-term ACADEMIC close (separate from the financial rollover).
 * Choose a term → dry run → confirm. Summarises attendance, freezes report cards and archives the term's
 * assessments, report cards, behaviour records and attendance as read-only. Nothing is deleted.
 */

interface TermOption { termId: string; label: string; isCurrent: boolean; academicClosed: boolean; canClose: boolean; reason?: string; startDate: string | null; endDate: string | null }

const LABELS: Record<string, string> = {
  assessments: 'Assessments', 'report-cards': 'Report cards', behavioral_records: 'Behaviour records', attendance: 'Attendance records',
};

export function AcademicCloseModal({ schoolId }: { schoolId: string }) {
  const { user } = useUser();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [terms, setTerms] = useState<TermOption[]>([]);
  const [termId, setTermId] = useState('');
  const [plan, setPlan] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState<'idle' | 'loading' | 'planning' | 'executing'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const call = async (body: Record<string, any>) => {
    if (!user) throw new Error('You are not signed in.');
    const res = await fetch('/api/terms/academic-close', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}` },
      body: JSON.stringify({ schoolId, ...body }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  };

  useEffect(() => {
    if (!open) { setPlan(null); setResult(null); setError(null); setConfirmed(false); return; }
    setBusy('loading');
    call({ mode: 'list' })
      .then(d => {
        setTerms(d.terms || []);
        const first = (d.terms || []).find((t: TermOption) => !t.academicClosed && t.canClose) || (d.terms || [])[0];
        if (first) setTermId(first.termId);
      })
      .catch(e => setError(e.message))
      .finally(() => setBusy('idle'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const dryRun = async () => {
    setBusy('planning'); setError(null); setConfirmed(false); setResult(null);
    try { setPlan(await call({ mode: 'dry-run', termId })); } catch (e: any) { setError(e.message); } finally { setBusy('idle'); }
  };
  const execute = async () => {
    setBusy('executing'); setError(null);
    try {
      const r = await call({ mode: 'execute', termId });
      setResult(r);
      toast({ title: 'Term closed for academics', description: `${r.attendanceSummaries} attendance summaries, ${r.frozenReportCards} report cards frozen.` });
    } catch (e: any) { setError(e.message); } finally { setBusy('idle'); }
  };

  const selected = terms.find(t => t.termId === termId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 font-bold rounded-xl">
          <GraduationCap className="h-4 w-4" /> Close Term (Academics)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-black flex items-center gap-2"><GraduationCap className="h-6 w-6 text-indigo-600" /> Close Term for Academics</DialogTitle>
          <DialogDescription>
            Summarises attendance, freezes report cards, and makes the term&apos;s assessments, report cards, behaviour records and attendance read-only. Nothing is deleted. This is separate from the financial rollover.
          </DialogDescription>
        </DialogHeader>

        {error && <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-800 flex gap-2"><AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />{error}</div>}

        {result ? (
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-sm text-emerald-900 space-y-1">
              <p className="font-black flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {selected?.label} closed for academics.</p>
              {Object.entries(result.archived || {}).map(([k, v]) => <p key={k}>{LABELS[k] || k}: {String(v)} archived</p>)}
              <p>{result.attendanceSummaries} attendance summaries · {result.frozenReportCards} report cards frozen</p>
            </div>
            <div className="flex justify-end"><Button onClick={() => setOpen(false)}>Done</Button></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-600">Term:</span>
              <select className="border rounded-lg px-2 py-1.5 text-sm" value={termId} onChange={e => { setTermId(e.target.value); setPlan(null); setConfirmed(false); }} disabled={busy !== 'idle'}>
                {terms.map(t => (
                  <option key={t.termId} value={t.termId}>
                    {t.label}{t.isCurrent ? ' (current)' : ''}{t.academicClosed ? ' — already closed' : ''}
                  </option>
                ))}
              </select>
              <Button variant="secondary" onClick={dryRun} disabled={!termId || busy !== 'idle'}>
                {busy === 'planning' ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Checking…</> : 'Run dry run'}
              </Button>
              {busy === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
            </div>
            {selected && !selected.canClose && <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">{selected.reason}</p>}
            {selected?.academicClosed && <p className="text-sm text-slate-600">This term was already closed. Running it again refreshes the summaries and frozen copies; it changes nothing else.</p>}

            {plan && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(plan.counts || {}).map(([k, v]) => (
                    <div key={k} className="p-3 border rounded-xl">
                      <p className="text-[10px] uppercase font-bold text-slate-400">{LABELS[k] || k}</p>
                      <p className="font-black">{String(v)}</p>
                      {plan.alreadyArchived?.[k] ? <p className="text-[11px] text-slate-500">{plan.alreadyArchived[k]} already archived</p> : null}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600">{plan.studentsWithAttendance} students have attendance in this term{plan.startDate && plan.endDate ? ` (${plan.startDate} to ${plan.endDate})` : ''}.</p>
                {plan.attendanceSkippedReason && <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">{plan.attendanceSkippedReason}</p>}
                {plan.draftReportCards > 0 && (
                  <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    {plan.draftReportCards} report card(s) are still in Draft. They will be frozen as drafts. Publish them first if parents should see final versions.
                  </p>
                )}
                {Object.values(plan.unplacedRecords || {}).some((n: any) => n > 0) && (
                  <p className="text-xs text-slate-500">
                    Records with no term recorded (left untouched): {Object.entries(plan.unplacedRecords).filter(([, n]: any) => n > 0).map(([k, n]) => `${LABELS[k] || k} ${n}`).join(', ')}.
                  </p>
                )}
                {!plan.canClose && <p className="text-sm text-red-800">{plan.reason}</p>}
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" className="mt-1" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} disabled={!plan.canClose} />
                  I have checked these figures. Close {selected?.label} for academics.
                </label>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={execute} disabled={!confirmed || !plan.canClose || busy !== 'idle'} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                    {busy === 'executing' ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Closing…</> : 'Close term'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
