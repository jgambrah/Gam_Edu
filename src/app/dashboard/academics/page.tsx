
'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import AcademicsPageContent from './academics-client';
import { useRole } from '@/context/role-context';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AcademicsPage() {
    const { role } = useRole();

    if (role === 'Student') {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>My Classes</CardTitle>
                    <CardDescription>This page is for staff. Your classes and assignments can be found under the "Assignments & Quizzes" tab.</CardDescription>
                </CardHeader>
            </Card>
        )
    }
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
      <AcademicsPageContent />
    </Suspense>
  );
}
