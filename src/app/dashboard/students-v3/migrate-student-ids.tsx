'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, doc, writeBatch, runTransaction, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function MigrateStudentIds() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<{ success: number; skipped: number; errors: string[] }>({
    success: 0,
    skipped: 0,
    errors: []
  });
  const [isComplete, setIsComplete] = useState(false);

  const migrateStudentIds = async () => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore not initialized' });
      return;
    }

    setIsRunning(true);
    setIsComplete(false);
    setResults({ success: 0, skipped: 0, errors: [] });

    try {
      // 1. Get all students
      const studentsSnapshot = await getDocs(collection(firestore, 'students'));
      const students = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      setProgress({ current: 0, total: students.length });

      // 2. Filter students without proper IDs
      const studentsNeedingIds = students.filter(s => !s.studentId || !/^SS-\d{4}-\d{4}$/.test(s.studentId));
      
      if (studentsNeedingIds.length === 0) {
        toast({ title: 'All Set!', description: 'All students already have proper IDs.' });
        setIsComplete(true);
        setIsRunning(false);
        return;
      }

      // 3. Sort students by creation date or UID for consistent ordering
      studentsNeedingIds.sort((a, b) => {
        // If createdAt exists, use it
        if (a.createdAt && b.createdAt) {
          return a.createdAt.toMillis() - b.createdAt.toMillis();
        }
        // Otherwise sort by UID (arbitrary but consistent)
        return a.id.localeCompare(b.id);
      });

      const year = new Date().getFullYear();
      const counterRef = doc(firestore, 'counters', 'students');
      
      let successCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];

      // 4. Process in batches of 500 (Firestore limit)
      const BATCH_SIZE = 500;
      for (let i = 0; i < studentsNeedingIds.length; i += BATCH_SIZE) {
        const batch = writeBatch(firestore);
        const batchStudents = studentsNeedingIds.slice(i, Math.min(i + BATCH_SIZE, studentsNeedingIds.length));

        // Get the starting ID number for this batch
        let startingIdNumber: number;
        try {
          startingIdNumber = await runTransaction(firestore, async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            
            if (!counterDoc.exists()) {
              // Initialize counter
              transaction.set(counterRef, { 
                currentId: batchStudents.length,
                lastUpdated: serverTimestamp()
              });
              return 1;
            }
            
            const currentId = counterDoc.data().currentId || 0;
            const newId = currentId + batchStudents.length;
            
            transaction.update(counterRef, { 
              currentId: newId,
              lastUpdated: serverTimestamp()
            });
            
            return currentId + 1;
          });
        } catch (error: any) {
          errors.push(`Counter transaction failed: ${error.message}`);
          break;
        }

        // Assign IDs to each student in batch
        batchStudents.forEach((student, index) => {
          const idNumber = startingIdNumber + index;
          const paddedNumber = String(idNumber).padStart(4, '0');
          const newStudentId = `SS-${year}-${paddedNumber}`;
          
          const studentRef = doc(firestore, 'students', student.id);
          batch.update(studentRef, {
            studentId: newStudentId,
            migratedAt: serverTimestamp()
          });
          
          successCount++;
          setProgress({ current: i + index + 1, total: studentsNeedingIds.length });
        });

        // Commit batch
        try {
          await batch.commit();
        } catch (error: any) {
          errors.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1} failed: ${error.message}`);
        }
      }

      // 5. Show results
      setResults({
        success: successCount,
        skipped: students.length - studentsNeedingIds.length,
        errors
      });
      
      setIsComplete(true);
      
      if (errors.length === 0) {
        toast({
          title: 'Migration Complete!',
          description: `Successfully assigned IDs to ${successCount} students.`
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Migration Completed with Errors',
          description: `${successCount} succeeded, ${errors.length} failed.`
        });
      }

    } catch (error: any) {
      console.error('Migration error:', error);
      toast({
        variant: 'destructive',
        title: 'Migration Failed',
        description: error.message
      });
      setResults(prev => ({ ...prev, errors: [...prev.errors, error.message] }));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-orange-600" />
          Student ID Migration Tool
        </CardTitle>
        <CardDescription>
          Assign professional student IDs (SS-YYYY-XXXX) to all existing students that don't have them yet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isRunning && !isComplete && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Before You Start</AlertTitle>
            <AlertDescription>
              This will assign sequential student IDs to all students missing them. 
              The process is safe and can be run multiple times. Students with existing valid IDs will be skipped.
            </AlertDescription>
          </Alert>
        )}

        {isRunning && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-orange-600" />
              <span className="text-sm font-medium">
                Processing: {progress.current} / {progress.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-orange-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {isComplete && (
          <div className="space-y-3">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Migration Complete</AlertTitle>
              <AlertDescription className="text-green-700">
                <div className="mt-2 space-y-1 text-sm">
                  <p>✅ {results.success} students assigned new IDs</p>
                  <p>⏭️ {results.skipped} students already had valid IDs</p>
                  {results.errors.length > 0 && (
                    <p className="text-red-600">❌ {results.errors.length} errors occurred</p>
                  )}
                </div>
              </AlertDescription>
            </Alert>

            {results.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Errors Encountered</AlertTitle>
                <AlertDescription>
                  <ul className="mt-2 space-y-1 text-xs">
                    {results.errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <Button
          onClick={migrateStudentIds}
          disabled={isRunning}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrating...
            </>
          ) : isComplete ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Run Migration Again
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Migration
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
