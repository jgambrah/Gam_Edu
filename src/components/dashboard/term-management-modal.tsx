'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Unlock, AlertTriangle, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TermManagementModalProps {
  schoolId: string;
  currentTermId: string;
  onSuccess?: () => void;
}

export function TermManagementModal({
  schoolId,
  currentTermId,
  onSuccess,
}: TermManagementModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [durationHours, setDurationHours] = useState(24);
  const { toast } = useToast();

  const handleConfirmUnlock = async () => {
    if (!reason.trim()) {
      toast({
        variant: 'destructive',
        title: 'Reason Required',
        description: 'Please provide an audit justification for unlocking this term.',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/terms/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId,
          termId: currentTermId,
          requestedDurationHours: Number(durationHours) || 24,
          reason: reason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unlock request failed');

      toast({
        title: 'Term Unlocked for Correction',
        description: `Term ${currentTermId} is temporarily unlocked for ${durationHours} hours. Audit log record: ${data.auditLogId}`,
      });

      setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Unlock Request Failed',
        description: err.message || 'An error occurred while unlocking the term.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold gap-2 rounded-xl text-xs">
          <Unlock className="h-4 w-4 text-amber-400" />
          Request Term Correction / Re-Sync
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-2xl p-6 bg-white text-slate-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-amber-600" />
            Request Term Correction & Audit Re-Sync
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Temporarily unlock archived term data to fix attendance, grades, or fee records. An audit log entry will be created.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-4">
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-950">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Automated Re-Lock & Re-Summarization Guarantee
            </p>
            <p className="leading-relaxed">
              When the unlock window expires, the system will automatically re-run attendance summarization, report card locking, and itemized arrears calculation. Deterministic document IDs prevent duplicate records.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500">Unlock Duration (Hours)</Label>
            <Input
              type="number"
              min={1}
              max={72}
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-slate-500">Audit Reason for Reopening</Label>
            <Textarea
              placeholder="e.g., Correcting Basic 7 Integrated Science exam score entry error for student Kwame Mensah..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded-xl min-h-[90px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmUnlock}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Unlocking Term...
              </>
            ) : (
              'Confirm & Unlock Term'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Active Countdown Banner component for Admin Dashboard */
export function TermUnlockCountdownBanner({
  unlockedTermId,
  expiresAt,
}: {
  unlockedTermId: string;
  expiresAt: any;
}) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!expiresAt) return;

    const expiresMs = typeof expiresAt.toMillis === 'function'
      ? expiresAt.toMillis()
      : new Date(expiresAt).getTime();

    const updateTimer = () => {
      const diffMs = expiresMs - Date.now();
      if (diffMs <= 0) {
        setTimeLeft('Window Expired (Auto re-locking...)');
        return;
      }
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${mins}m ${secs}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-between border border-amber-400/30 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/10 rounded-xl">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-100">Term Correction Mode Active</h4>
          <p className="text-xs font-medium text-white/90">
            Term <span className="font-extrabold underline">{unlockedTermId}</span> is currently unlocked for modifications.
          </p>
        </div>
      </div>
      <div className="text-right shrink-0 bg-black/20 px-3.5 py-1.5 rounded-xl border border-white/10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200 block">Auto-Relock In</span>
        <span className="text-sm font-black text-white font-mono">{timeLeft}</span>
      </div>
    </div>
  );
}
