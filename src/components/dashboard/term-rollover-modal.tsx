'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Archive, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TermRolloverModalProps {
  schoolId: string;
  currentTermId: string;
  nextTermId: string;
  onSuccess?: () => void;
}

export function TermRolloverModal({
  schoolId,
  currentTermId,
  nextTermId,
  onSuccess,
}: TermRolloverModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirmRollover = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/terms/rollover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId,
          currentTermId,
          nextTermId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rollover failed');

      toast({
        title: 'Term Rollover Completed',
        description: `Successfully processed ${data.processedStudents} student balances. Total arrears carried forward: GH₵${data.totalArrearsCarried?.toFixed(2) || '0.00'}.`,
      });

      setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Rollover Failed',
        description: err.message || 'An error occurred during term financial rollover.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 rounded-xl shadow-md">
          <Archive className="h-4 w-4" />
          Archive Term & Prepare Next Term
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-2xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            End-of-Term Financial Rollover
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Pre-archiving preview for carrying forward itemized student balances and resetting active query pointers.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Ending Term</p>
              <p className="font-extrabold text-slate-800">{currentTermId}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">New Target Term</p>
              <p className="font-extrabold text-indigo-600">{nextTermId}</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
            <h4 className="text-xs font-black text-amber-900 uppercase flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-amber-600" />
              Itemized Line-Item Preservation Guarantee
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Unpaid student balances (Tuition, Bus, Feeding, Exam Fees) will be carried forward as itemized opening balance entries using deterministic document IDs (<code className="bg-amber-100 px-1 py-0.5 rounded">arrears_&#123;studentId&#125;_&#123;termId&#125;</code>) to prevent double-billing. Raw term transactions will be marked as archived.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRollover}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Executing Rollover...
              </>
            ) : (
              'Confirm & Execute Rollover'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
