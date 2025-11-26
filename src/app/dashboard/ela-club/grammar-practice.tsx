
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRole } from '@/context/role-context';
// FIX: Import useUser instead of just useAuth
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { ElaGrammarDrill, Student } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export function GrammarPractice() {
  const firestore = useFirestore();
  // FIX: Use useUser to get the loading state (isUserLoading)
  const { user, isUserLoading } = useUser();
  const { role } = useRole();
  
  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);

  // 1. Get Student Data (Wait for user to exist)
  const { data: studentData, isLoading: isLoadingStudent } = useCollection<Student>(
    useMemoFirebase(() => {
      if (!user || !firestore || isStaff) return null;
      return query(collection(firestore, 'students'), where('uid', '==', user.uid));
    }, [firestore, user, isStaff])
  );
  
  const studentClassId = studentData?.[0]?.classId;

  // 2. Query Drills
  const drillsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    if (isStaff) return query(collection(firestore, 'ela_grammar_drills'));
    if (studentClassId) {
      return query(collection(firestore, 'ela_grammar_drills'), where('classId', '==', studentClassId));
    }
    return null;
  }, [firestore, studentClassId, isStaff]);

  const { data: drills, isLoading: isLoadingDrills } = useCollection<ElaGrammarDrill>(drillsQuery);

  // 3. Combined Loading Logic
  // If Auth is loading, OR Student Data is loading (for students), OR Drills are loading...
  const isLoading = isUserLoading || (isLoadingStudent && !isStaff) || isLoadingDrills;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grammar & Mechanics Practice</CardTitle>
        <CardDescription>Choose a topic to start practicing.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col space-y-3">
             <Skeleton className="h-12 w-full" />
             <Skeleton className="h-12 w-full" />
             <div className="flex items-center justify-center text-muted-foreground text-sm gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading your profile...
             </div>
          </div>
        ) : (!isStaff && !studentClassId) ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You are not assigned to a class. Please contact an administrator.</p>
            {/* Debug info will now only show if User IS loaded but Class IS NOT */}
            <p className="text-xs text-red-400 mt-2">Debug: User ID: {user?.uid || 'Not Found'}</p>
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
                     <Link href={`/dashboard/ela-club/grammar/${drill.id}`}>Start Drill</Link>
                  </Button>
                </Card>
              ))}
           </div>
        ) : (
          <p className="text-center text-muted-foreground py-10">
             {isStaff ? "No grammar drills found." : "No grammar drills found for your class."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
