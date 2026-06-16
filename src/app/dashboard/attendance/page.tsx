'use client';

import { Suspense, useEffect } from 'react';
import { Loader2, UserCheck, Fingerprint } from 'lucide-react';
import { DailyAttendanceSheet } from './daily-attendance-sheet';
import { BiometricIntegrationSheet } from './biometric-integration-sheet';
import { useRole } from '@/context/role-context';
import { useRouter } from 'next/navigation';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    <div className="space-y-6">
      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-100/80 backdrop-blur border rounded-xl p-1 mb-6">
          <TabsTrigger value="manual" className="rounded-lg font-bold flex items-center justify-center gap-2 py-2.5">
            <UserCheck className="h-4 w-4" /> Daily Sheet
          </TabsTrigger>
          <TabsTrigger value="biometric" className="rounded-lg font-bold flex items-center justify-center gap-2 py-2.5">
            <Fingerprint className="h-4 w-4" /> Biometric Integration
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="outline-none">
          <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-indigo-600" /></div>}>
              <DailyAttendanceSheet />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="biometric" className="outline-none">
          <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-indigo-600" /></div>}>
              <BiometricIntegrationSheet />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
