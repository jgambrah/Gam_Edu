'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, limit, getDocs, writeBatch } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Trash2 } from 'lucide-react';

interface TemporaryResetToolProps {
  schoolId: string;
  onResetComplete?: () => void;
}

/**
 * @fileOverview A temporary, destructive tool to wipe all financial records for a school.
 * To be removed after one-time use.
 */
export function TemporaryResetTool({ schoolId, onResetComplete }: TemporaryResetToolProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleNuclearReset = async () => {
    if (!firestore || !schoolId) return;
    if (confirmText !== 'RESET') return;

    setIsDeleting(true);

    try {
      let totalDeleted = 0;
      let hasMore = true;

      while (hasMore) {
        // Fetch up to 500 records for this school
        const q = query(
          collection(firestore, 'financialRecords'),
          where('schoolId', '==', schoolId),
          limit(500)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          hasMore = false;
          break;
        }

        const batch = writeBatch(firestore);
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        await batch.commit();
        totalDeleted += snapshot.size;

        toast({ title: "Deleting...", description: `Removed ${totalDeleted} records so far.` });
      }

      toast({
        title: "Reset Complete",
        description: `Successfully deleted a total of ${totalDeleted} financial records. All student balances for this school are now 0.`,
      });

      setConfirmText('');
      if (onResetComplete) onResetComplete();

    } catch (error: any) {
      console.error("Reset Failed:", error);
      toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-red-600 bg-red-50/50 mt-8 mb-8 border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          DANGER: Financial Reset Tool (TEMPORARY)
        </CardTitle>
        <CardDescription className="text-red-600 font-medium">
          This tool will permanently delete ALL financial records, bills, and payment history for this school. 
          This action is irreversible and should only be used to correct catastrophic data entry errors.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="confirm-reset" className="text-red-800 font-bold uppercase text-xs">Type "RESET" to confirm permanent deletion</Label>
          <Input 
            id="confirm-reset"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type RESET here"
            className="border-red-300 focus:ring-red-500 bg-white"
          />
        </div>
        <Button 
          variant="destructive" 
          className="w-full h-14 font-black text-lg shadow-xl uppercase tracking-tighter"
          disabled={isDeleting || confirmText !== 'RESET'}
          onClick={handleNuclearReset}
        >
          {isDeleting ? (
            <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> WIPING DATABASE...</>
          ) : (
            <><Trash2 className="mr-2 h-6 w-6" /> PERMANENTLY WIPE ALL FINANCIAL RECORDS</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
