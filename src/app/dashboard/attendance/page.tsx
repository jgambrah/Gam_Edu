'use client';

import { Suspense, useEffect, useState } from 'react';
import { Loader2, UserCheck, Fingerprint, FileText } from 'lucide-react';
import { DailyAttendanceSheet } from './daily-attendance-sheet';
import { BiometricIntegrationSheet } from './biometric-integration-sheet';
import { AttendanceAuditLogs } from './attendance-audit-logs';
import { useRole } from '@/context/role-context';
import { useRouter } from 'next/navigation';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { SectionHeroBanner } from '@/components/common/SectionHeroBanner';

export default function AttendancePage() {
  const { role, loading } = useRole();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'manual' | 'biometric' | 'audit'>('manual');

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
        actions={
          <div className="bg-slate-950/60 border border-slate-800/80 p-1 rounded-xl flex items-center gap-1 overflow-x-auto max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={cn(
                "text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'manual'
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200 font-medium"
              )}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Daily Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('biometric')}
              className={cn(
                "text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'biometric'
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200 font-medium"
              )}
            >
              <Fingerprint className="h-3.5 w-3.5" />
              <span>Biometric</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={cn(
                "text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer",
                activeTab === 'audit'
                  ? "bg-white text-slate-900 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-200 font-medium"
              )}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Audit Logs</span>
            </button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="w-full">
        <TabsContent value="manual" className="outline-none mt-0">
          <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-teal-650" /></div>}>
              <DailyAttendanceSheet />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="biometric" className="outline-none mt-0">
          <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-teal-650" /></div>}>
              <BiometricIntegrationSheet />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="audit" className="outline-none mt-0">
          <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-indigo-600" /></div>}>
              <AttendanceAuditLogs />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
