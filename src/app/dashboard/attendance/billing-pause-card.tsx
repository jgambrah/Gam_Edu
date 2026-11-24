'use client';

import { useMemo, useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { PauseCircle, Trash2, Loader2, Utensils, Bus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';
import { logAuditEvent } from '@/lib/audit';
import { schoolDayDateStr, schoolTodayLocalDate } from '@/lib/attendance-date';
import { parseBillingPauses, type BillingPause } from '@/lib/billing-pause';

/** Live list of the school's billing pauses (readable by any signed-in staff; only the Director can change it). */
export function useBillingPauses(): BillingPause[] {
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();
  const ref = useMemoFirebase(
    () => (firestore && schoolId ? doc(firestore, 'schoolSettings', schoolId, 'rates', 'billingPause') : null),
    [firestore, schoolId]
  );
  const { data } = useDoc<any>(ref);
  return useMemo(() => parseBillingPauses(data), [data]);
}

/** Matches `isReviewDirector()` in firestore.rules (Director / Owner) — the only roles allowed to write. */
export function isBillingPauseDirector(role: string | null | undefined): boolean {
  const r = role?.toLowerCase();
  return r === 'director' || r === 'owner';
}

/**
 * Director-only control: pause daily canteen and/or transport billing for a date range while attendance
 * is still taken normally (e.g. the kitchen is closed or the buses are off the road).
 */
export function BillingPauseCard() {
  const { role } = useRole();
  const { user } = useUser();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();
  const pauses = useBillingPauses();

  const today = schoolDayDateStr(schoolTodayLocalDate());
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [canteen, setCanteen] = useState(true);
  const [transport, setTransport] = useState(true);
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isBillingPauseDirector(role)) return null;

  const userName = user?.displayName || user?.email || 'Director';

  const persist = async (next: BillingPause[], auditDetails: string) => {
    if (!firestore || !schoolId) return;
    await setDoc(
      doc(firestore, 'schoolSettings', schoolId, 'rates', 'billingPause'),
      { pauses: next, updatedAt: serverTimestamp(), updatedBy: user?.uid ?? null },
      { merge: true }
    );
    void logAuditEvent({
      firestore, schoolId, userName, userId: user?.uid,
      action: 'BILLING_PAUSE_CHANGED',
      details: auditDetails,
    }).catch(() => {});
  };

  const handleAdd = async () => {
    if (!canteen && !transport) {
      toast({ variant: 'destructive', title: 'Pick a service', description: 'Choose canteen, transport, or both.' });
      return;
    }
    if (!fromDate || !toDate || toDate < fromDate) {
      toast({ variant: 'destructive', title: 'Check the dates', description: 'The end date cannot be before the start date.' });
      return;
    }
    setIsSaving(true);
    try {
      const entry: BillingPause = {
        id: `${Date.now()}`,
        fromDate, toDate, canteen, transport,
        reason: reason.trim(),
        createdBy: user?.uid,
        createdByName: userName,
      };
      const services = [canteen && 'canteen', transport && 'transport'].filter(Boolean).join(' + ');
      await persist([...pauses, entry], `Paused ${services} billing ${fromDate} to ${toDate}${entry.reason ? ` — ${entry.reason}` : ''}`);
      setReason('');
      toast({ title: 'Billing paused', description: `Attendance is still taken, but ${services} will not be billed from ${fromDate} to ${toDate}.` });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Could not pause billing', description: e?.message || 'Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (p: BillingPause) => {
    setIsSaving(true);
    try {
      await persist(pauses.filter(x => x.id !== p.id), `Resumed billing (removed pause ${p.fromDate} to ${p.toDate})`);
      toast({ title: 'Pause removed', description: 'Billing resumes for those dates the next time attendance is saved.' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Could not remove pause', description: e?.message || 'Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Most recent first; hide pauses that ended more than 30 days ago to keep the list short.
  const visible = [...pauses]
    .filter(p => p.toDate >= schoolDayDateStr(new Date(Date.now() - 30 * 86_400_000)))
    .sort((a, b) => b.fromDate.localeCompare(a.fromDate));

  return (
    <Card className="border-amber-200 bg-amber-50/40">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <PauseCircle className="h-5 w-5 text-amber-600" />
          Pause Canteen / Transport Billing
          <Badge variant="outline" className="ml-1 gap-1 text-[10px]"><ShieldCheck className="h-3 w-3" />Director only</Badge>
        </CardTitle>
        <CardDescription>
          Can&apos;t provide a service for a day or a while? Pause it here. Attendance is still recorded, but students are not billed for the paused service on those dates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="pause-from">From</Label>
            <Input id="pause-from" type="date" value={fromDate} onChange={e => { setFromDate(e.target.value); if (toDate < e.target.value) setToDate(e.target.value); }} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="pause-to">To (inclusive)</Label>
            <Input id="pause-to" type="date" value={toDate} min={fromDate} onChange={e => setToDate(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={canteen} onCheckedChange={v => setCanteen(v === true)} /><Utensils className="h-4 w-4" />Canteen</label>
          <label className="flex items-center gap-2 text-sm"><Checkbox checked={transport} onCheckedChange={v => setTransport(v === true)} /><Bus className="h-4 w-4" />Transport</label>
        </div>
        <div className="space-y-1">
          <Label htmlFor="pause-reason">Reason (optional)</Label>
          <Input id="pause-reason" placeholder="e.g. Kitchen closed for repairs" value={reason} onChange={e => setReason(e.target.value)} maxLength={140} />
        </div>
        <Button onClick={handleAdd} disabled={isSaving} className="bg-amber-600 hover:bg-amber-700">
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PauseCircle className="mr-2 h-4 w-4" />}
          Pause billing
        </Button>

        {visible.length > 0 && (
          <div className="space-y-2 border-t pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pauses</p>
            {visible.map(p => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border bg-white px-3 py-2 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">
                    {p.fromDate === p.toDate ? p.fromDate : `${p.fromDate} → ${p.toDate}`}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {[p.canteen && 'Canteen', p.transport && 'Transport'].filter(Boolean).join(' + ')}
                    </span>
                  </p>
                  {p.reason && <p className="truncate text-xs text-muted-foreground">{p.reason}</p>}
                </div>
                <Button variant="ghost" size="icon" disabled={isSaving} onClick={() => handleRemove(p)} aria-label="Remove pause">
                  <Trash2 className="h-4 w-4 text-rose-600" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Bills already created for a date before it was paused are not removed automatically.
        </p>
      </CardContent>
    </Card>
  );
}
