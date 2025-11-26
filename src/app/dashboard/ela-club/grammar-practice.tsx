
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRole } from '@/context/role-context';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { ElaGrammarDrill, Student } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function GrammarPractice() {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { role } = useRole();
  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);

  // 1. ROBUST STUDENT QUERY
  const { data: studentData, isLoading: isLoadingStudent } = useCollection<Student>(
    useMemoFirebase(() => {
      if (!user || !firestore || isStaff) return null;
      return query(collection(firestore, 'students'), where('uid', '==', user.uid));
    }, [firestore, user, isStaff])
  );
  
  const studentClassId = studentData?.[0]?.classId;

  // 2. QUERY DRILLS
  const drillsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Staff see all
    if (isStaff) return query(collection(firestore, 'ela_grammar_drills'));
    // Students see class-specific
    if (studentClassId) {
      return query(collection(firestore, 'ela_grammar_drills'), where('classId', '==', studentClassId));
    }
    return null;
  }, [firestore, studentClassId, isStaff]);

  const { data: drills, isLoading: isLoadingDrills } = useCollection<ElaGrammarDrill>(drillsQuery);

  const isLoading = (isLoadingStudent && !isStaff) || isLoadingDrills;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grammar & Mechanics Practice</CardTitle>
        <CardDescription>Choose a topic to start practicing.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (!isStaff && !studentClassId) ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You are not assigned to a class. Please contact an administrator.</p>
            <p className="text-xs text-red-400 mt-2">Debug: User ID {user?.uid}</p>
          </div>
        ) : drills && drills.length > 0 ? (
           <div className="grid gap-4 md:grid-cols-2">
              {drills.map((drill) => (
                <Card key={drill.id} className="p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold">{drill.topic}</h4>
                        <Badge variant="secondary">{drill.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{drill.question_prompt}</p>
                  </div>
                  <Button className="mt-4" variant="outline" asChild>
                    {/* Assuming you have a route for individual drills, or this might open a modal */}
                     <Link href={`/dashboard/ela-club/grammar/${drill.id}`}>Start Drill</Link>
                  </Button>
                </Card>
              ))}
           </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">No grammar drills found for your class.</p>
        )}
      </CardContent>
    </Card>
  );
}
