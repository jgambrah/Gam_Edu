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
    <div className="space-y-8">
      {/* Premium Gradient Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-teal-650 via-emerald-600 to-indigo-800 p-8 md:p-12 text-white shadow-2xl border border-teal-400/20">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-teal-100 backdrop-blur-md">
              <UserCheck className="h-3 w-3" /> Attendance Register
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight italic uppercase leading-none">
              Student <span className="text-teal-200">Attendance</span>
            </h1>
            <p className="max-w-md text-sm font-medium text-teal-50">
              Take daily presence sheets, configure local scanning APIs, or upload biometric hardware logs.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="manual" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-900 border border-slate-800 rounded-2xl p-1 mb-6 text-slate-400">
          <TabsTrigger value="manual" className="rounded-xl font-bold flex items-center justify-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:text-slate-900 transition-all">
            <UserCheck className="h-4 w-4" /> Daily Sheet
          </TabsTrigger>
          <TabsTrigger value="biometric" className="rounded-xl font-bold flex items-center justify-center gap-2 py-3 data-[state=active]:bg-white data-[state=active]:text-slate-900 transition-all">
            <Fingerprint className="h-4 w-4" /> Biometric Integration
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
      </Tabs>
    </div>
  );
}
