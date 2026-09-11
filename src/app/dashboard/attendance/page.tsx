'use client';

import { Suspense, useEffect } from 'react';
import { Loader2, UserCheck, Fingerprint, FileText } from 'lucide-react';
import { DailyAttendanceSheet } from './daily-attendance-sheet';
import { BiometricIntegrationSheet } from './biometric-integration-sheet';
import { AttendanceAuditLogs } from './attendance-audit-logs';
import { useRole } from '@/context/role-context';
import { useRouter } from 'next/navigation';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { SectionHeroBanner } from '@/components/common/SectionHeroBanner';

export default function AttendancePage() {
  const { role, loading } = useRole();
  const router = useRouter();

  // Protect the attendance-taking page from non-staff
  useEffect(() => {
    if (!loading) {
      const lowerRole = role?.toLowerCase();
      if (lowerRole === 'student' || lowerRole === 'parent') {
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
  const lowerRole = role?.toLowerCase();
  const isStaff = ['teacher', 'administrator', 'director', 'accountant', 'admin'].includes(lowerRole || '');

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
      <SectionHeroBanner
        title="Student Attendance"
        subtitle="Take daily presence sheets, configure local scanning APIs, or upload biometric hardware logs."
        eyebrow="ATTENDANCE REGISTER"
        icon={UserCheck}
        className="mb-6 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800/80 rounded-2xl"
      />

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-3 bg-slate-900 border border-slate-800 rounded-2xl p-1 mb-6 text-slate-400">
          <TabsTrigger value="manual" className="rounded-xl font-bold flex items-center justify-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:text-slate-900 transition-all text-xs sm:text-sm">
            <UserCheck className="h-4 w-4" /> Daily Sheet
          </TabsTrigger>
          <TabsTrigger value="biometric" className="rounded-xl font-bold flex items-center justify-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:text-slate-900 transition-all text-xs sm:text-sm">
            <Fingerprint className="h-4 w-4" /> Biometric
          </TabsTrigger>
          <TabsTrigger value="audit" className="rounded-xl font-bold flex items-center justify-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:text-slate-900 transition-all text-xs sm:text-sm">
            <FileText className="h-4 w-4" /> Audit Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="outline-none">
          <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-teal-650" /></div>}>
              <DailyAttendanceSheet />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="biometric" className="outline-none">
          <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-teal-650" /></div>}>
              <BiometricIntegrationSheet />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="audit" className="outline-none">
          <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-indigo-600" /></div>}>
              <AttendanceAuditLogs />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
