
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, doc, writeBatch, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Link2, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SubjectRelinker() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  // Fetch ALL Assessments and ALL Subjects
  const assessmentsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'assessments')) : null, [firestore]);
  const { data: assessments, isLoading: loadingAssessments, forceRefetch: refetchAssessments } = useCollection<any>(assessmentsQuery);

  const subjectsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'subjects')) : null, [firestore]);
  const { data: subjects, isLoading: loadingSubjects } = useCollection<any>(subjectsQuery);

  const [fixMap, setFixMap] = useState<Record<string, string>>({}); // { assessmentId: newSubjectId }
  const [isSaving, setIsSaving] = useState(false);

  // 1. Find Broken Links
  const brokenAssessments = useMemo(() => {
    if (!assessments || !subjects) return [];
    
    // Create a Set of valid Subject IDs for quick lookup
    const validSubjectIds = new Set(subjects.map(s => s.id));

    return assessments.filter(a => {
        // An assessment is broken if its subjectId is missing OR not in the valid list
        return !a.subjectId || !validSubjectIds.has(a.subjectId);
    });
  }, [assessments, subjects]);

  const handleFix = async () => {
      if (!firestore) return;
      setIsSaving(true);
      
      const batch = writeBatch(firestore);
      let count = 0;

      Object.entries(fixMap).forEach(([assessmentId, newSubjectId]) => {
          const ref = doc(firestore, 'assessments', assessmentId);
          // We update both ID and Name to be safe
          const subName = subjects?.find(s => s.id === newSubjectId)?.name;
          if (subName) {
              batch.update(ref, { 
                  subjectId: newSubjectId,
                  subjectName: subName // Denormalize for safety
              });
              count++;
          }
      });

      try {
          await batch.commit();
          toast({ title: "Fixed!", description: `Updated ${count} records.` });
          refetchAssessments(); // Re-fetch to clear the list
          setFixMap({});
      } catch (e) {
          toast({ variant: 'destructive', title: "Error", description: "Update failed." });
      } finally {
          setIsSaving(false);
      }
  };

  if (loadingAssessments || loadingSubjects) return <div className="p-4">Scanning database...</div>;

  return (
    <Card className="border-orange-300 bg-orange-50/50 mt-6">
      <CardHeader>
        <CardTitle className="text-orange-800 flex items-center gap-2">
            <Link2 className="h-5 w-5"/> Broken Link Detector
        </CardTitle>
        <CardDescription>
            Found <strong>{brokenAssessments.length}</strong> grades pointing to non-existent subjects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {brokenAssessments.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600 font-bold p-4 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle2 /> All Data is Healthy! No broken links found.
            </div>
        ) : (
            <div className="space-y-4">
                <div className="max-h-[300px] overflow-y-auto border rounded-md bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Assessment Name</TableHead>
                                <TableHead>Current (Broken) ID</TableHead>
                                <TableHead>Map to Correct Subject</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {brokenAssessments.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="font-medium">{item.assessmentName || 'Unknown Assessment'}</div>
                                        <div className="text-xs text-muted-foreground">{item.academicYear} - {item.term}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="destructive" className="font-mono text-[10px]">
                                            {item.subjectId || 'NULL'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Select 
                                            value={fixMap[item.id] || ''} 
                                            onValueChange={(val) => setFixMap(prev => ({...prev, [item.id]: val}))}
                                        >
                                            <SelectTrigger className="w-[200px] h-8">
                                                <SelectValue placeholder="Select Subject..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {subjects?.map(s => (
                                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <Button 
                    onClick={handleFix} 
                    disabled={isSaving || Object.keys(fixMap).length === 0}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                >
                    {isSaving ? <Loader2 className="animate-spin mr-2"/> : <Link2 className="mr-2 h-4 w-4"/>}
                    Fix {Object.keys(fixMap).length} Selected Record(s)
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
