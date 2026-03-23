'use client';

import { Suspense, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { DailyAttendanceSheet } from './daily-attendance-sheet';
import { useRole } from '@/context/role-context';
import { useRouter } from 'next/navigation';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AttendancePage() {
  const { role, loading } = useRole();
  const router = useRouter();

  // Protect the attendance-taking page from non-staff
  useEffect(() => {
    if (!loading) {
      if (role === 'Student' || role === 'Parent') {
        router.replace('/dashboard/my-children');
      }
    }
  }, [role, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // Final check before rendering
  const isStaff = ['Teacher', 'Administrator', 'Director', 'Accountant'].includes(role || '');

  if (!isStaff) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            This page is for school staff only. Parents and students can view attendance logs in the "My Children" section.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
        <DailyAttendanceSheet />
    </Suspense>
  );
}
