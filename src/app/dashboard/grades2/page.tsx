'use client';

import { Suspense } from 'react';
import { useRole } from '@/context/role-context';
import Gradebook2Manager from './gradebook2-manager';
import StudentParentGradebook2View from './student-parent-view';
import { Loader2 } from 'lucide-react';

function Gradebook2PageContent() {
  const { role, isRoleLoading } = useRole();

  if (isRoleLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // For this new gradebook, let's keep it to staff for now.
  if (role === 'Student' || role === 'Parent') {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>The student and parent view for this gradebook is under construction.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return <Gradebook2Manager />;
}

export default function Gradebook2Page() {
  return (
    <Suspense fallback={<div className="flex min-h-screen w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
        <Gradebook2PageContent />
    </Suspense>
  )
}
