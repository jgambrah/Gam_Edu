'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, limit, getDocs, writeBatch } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertTriangle, Trash2, GraduationCap } from 'lucide-react';

interface AcademicResetToolProps {
  schoolId: string;
  onResetComplete?: () => void;
}

/**
 * @fileOverview A temporary, destructive tool to wipe all academic records (Grades & Reports) for a school.
 * Handles batching logic to overcome Firestore's 500-doc limit.
 */
export function AcademicResetTool({ schoolId, onResetComplete }: AcademicResetToolProps) {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleNuclearReset = async () => {
    if (!firestore || !schoolId) return;
    if (confirmText !== 'ACADEMIC RESET') return;

    setIsDeleting(true);

    try {
      // COLLECTIONS TO WIPE
      const collectionsToWipe = ['assessments', 'report-cards'];
      let grandTotal = 0;

      for (const colName of collectionsToWipe) {
        let totalDeleted = 0;
        let hasMore = true;

        toast({ title: `Scanning ${colName}...`, description: "Locating academic data." });

        while (hasMore) {
          const q = query(
            collection(firestore, colName),
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
          grandTotal += snapshot.size;
          
          toast({ title: `Wiping ${colName}...`, description: `Removed ${totalDeleted} records so far.` });
        }
      }

      toast({ 
        title: "Academic Wipe Complete", 
        description: `Successfully deleted ${grandTotal} academic records. Gradebooks and Report Cards are now empty.` 
      });
      
      setConfirmText('');
      
      if (onResetComplete) onResetComplete();

    } catch (error: any) {
      console.error("Academic Reset Failed:", error);
      toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-red-600 bg-red-50/50 border-2 shadow-lg mb-6">
      <CardHeader>
        <CardTitle className="text-red-700 flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          DANGER: Academic Data Wipe (TEMPORARY)
        </CardTitle>
        <CardDescription className="text-red-600 font-medium">
          This will permanently delete ALL gradebook entries (assessments) and ALL generated report cards for this school. 
          Positions, averages, and terminal reports will be completely erased. This cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="confirm-reset-academic" className="text-red-800 font-bold uppercase text-[10px] tracking-widest">
            Type "ACADEMIC RESET" to confirm permanent deletion
          </Label>
          <Input 
            id="confirm-reset-academic"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type ACADEMIC RESET here"
            className="border-red-300 focus:ring-red-500 bg-white"
            autoComplete="off"
          />
        </div>
        <Button 
          variant="destructive" 
          className="w-full h-14 font-black text-lg shadow-xl uppercase tracking-tighter"
          disabled={isDeleting || confirmText !== 'ACADEMIC RESET'}
          onClick={handleNuclearReset}
        >
          {isDeleting ? (
            <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> PURGING ACADEMIC RECORDS...</>
          ) : (
            <><Trash2 className="mr-2 h-6 w-6" /> PERMANENTLY WIPE ALL GRADES & REPORTS</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
