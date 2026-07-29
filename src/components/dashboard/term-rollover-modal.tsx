'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Archive, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';

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
  const firestore = useFirestore();

  const handleConfirmRollover = async () => {
    setLoading(true);

    // 1. Attempt Server API Route execution first
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

      if (res.ok) {
        const data = await res.json();
        toast({
          title: 'Term Rollover Completed',
          description: `Successfully processed ${data.processedStudents} student balances. Total arrears carried forward: GH₵${data.totalArrearsCarried?.toFixed(2) || '0.00'}.`,
        });
        setOpen(false);
        onSuccess?.();
        setLoading(false);
        return;
      }
    } catch (apiErr) {
      console.warn('API route call failed, switching to direct client-side rollover:', apiErr);
    }

    // 2. Direct Client-Side Firestore Batch Execution Fallback
    try {
      if (!firestore) throw new Error('Firestore connection unavailable');

      // Fetch active students
      const stQuery = query(collection(firestore, 'students'), where('schoolId', '==', schoolId));
      const stSnap = await getDocs(stQuery);
      const studentMap = new Map<string, string>();
      stSnap.forEach((sDoc) => {
        const s = sDoc.data();
        if (s.isArchived === true) return;
        if (s.enrollmentStatus === 'Active' || !s.enrollmentStatus) {
          studentMap.set(sDoc.id, `${s.firstName || ''} ${s.lastName || ''}`.trim() || 'Student');
        }
      });

      // Fetch financial records for current term
      const recQuery = query(
        collection(firestore, 'financialRecords'),
        where('schoolId', '==', schoolId),
        where('termId', '==', currentTermId)
      );
      const recSnap = await getDocs(recQuery);
      const studentBalances: Record<string, any> = {};

      recSnap.forEach((rDoc) => {
        const r = rDoc.data();
        if (r.isArchived === true) return;
        const studentId = r.studentId;
        if (!studentId || !studentMap.has(studentId)) return;

        if (!studentBalances[studentId]) {
          studentBalances[studentId] = {
            tuitionArrears: 0,
            busArrears: 0,
            canteenArrears: 0,
            examArrears: 0,
            otherArrears: 0,
            totalArrears: 0,
          };
        }

        const billed = Number(r.billedAmount ?? r.amount ?? 0);
        const paid = Number(r.amountPaid ?? 0);
        const waiver = Number(r.waiverAmount ?? 0);
        const balance = billed - paid - waiver;

        if (balance <= 0.01) return;

        const category = (r.category || r.type || 'tuition').toLowerCase();
        if (category.includes('bus') || category.includes('transport')) {
          studentBalances[studentId].busArrears += balance;
        } else if (category.includes('canteen') || category.includes('feeding') || category.includes('mess')) {
          studentBalances[studentId].canteenArrears += balance;
        } else if (category.includes('exam') || category.includes('test')) {
          studentBalances[studentId].examArrears += balance;
        } else if (category.includes('tuition') || category.includes('fee')) {
          studentBalances[studentId].tuitionArrears += balance;
        } else {
          studentBalances[studentId].otherArrears += balance;
        }

        studentBalances[studentId].totalArrears += balance;
      });

      // Execute batch writes with deterministic IDs
      const batch = writeBatch(firestore);
      let totalArrearsCarried = 0;
      let processedCount = 0;

      for (const [studentId, arrears] of Object.entries(studentBalances)) {
        if (arrears.totalArrears <= 0.01) continue;

        const docId = `arrears_${schoolId}_${studentId}_${nextTermId}`;
        const arrearsRef = doc(firestore, 'financialRecords', docId);

        batch.set(arrearsRef, {
          id: docId,
          schoolId,
          studentId,
          studentName: studentMap.get(studentId) || 'Student',
          termId: nextTermId,
          title: 'Arrears Brought Forward',
          category: 'Arrears',
          billedAmount: arrears.totalArrears,
          amountPaid: 0,
          waiverAmount: 0,
          itemizedArrears: {
            tuitionArrears: arrears.tuitionArrears,
            busArrears: arrears.busArrears,
            canteenArrears: arrears.canteenArrears,
            examArrears: arrears.examArrears,
            otherArrears: arrears.otherArrears,
          },
          status: 'Pending',
          isArchived: false,
          createdAt: serverTimestamp(),
        }, { merge: true });

        totalArrearsCarried += arrears.totalArrears;
        processedCount++;
      }

      // Flag raw term records as archived
      recSnap.forEach((rDoc) => {
        const rData = rDoc.data();
        if (rData.isArchived !== true) {
          batch.update(rDoc.ref, { isArchived: true });
        }
      });

      // Update schoolSettings term pointer
      const schoolRef = doc(firestore, 'schoolSettings', schoolId);
      batch.set(schoolRef, {
        currentTermId: nextTermId,
        lastTermRolloverAt: serverTimestamp(),
        termStatus: 'Active',
      }, { merge: true });

      await batch.commit();

      toast({
        title: 'Term Rollover Completed',
        description: `Successfully processed ${processedCount} student balances. Total arrears carried forward: GH₵${totalArrearsCarried.toFixed(2)}.`,
      });

      setOpen(false);
      onSuccess?.();
    } catch (clientErr: any) {
      console.error('Rollover error:', clientErr);
      toast({
        variant: 'destructive',
        title: 'Rollover Failed',
        description: clientErr?.message || 'An error occurred during term financial rollover.',
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
