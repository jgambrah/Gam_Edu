'use client';

import { Suspense } from 'react';
import DashboardClient from './dashboard-client';
import DashboardLoading from './loading';
import { useRole } from '@/context/role-context';
import { useUser } from '@/firebase'; // Corrected hook
import SystemRepair from '@/components/SystemRepair'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

function DashboardPageContent() {
  const { role, loading: isRoleLoading } = useRole();
  const { user, isUserLoading } = useUser(); // Corrected hook usage

  const isLoading = isRoleLoading || isUserLoading;

  if (isLoading) {
    return <DashboardLoading />;
  }

  // --- SAFETY CHECK ---
  if (!role) {
    
    // 1. If it is YOU (The CEO), show the Repair Tool
    if (user?.email === 'jamesgambrah@gmail.com') {
        return (
            <div className="flex h-full w-full items-center justify-center p-8">
                <Card className="max-w-md border-orange-500 border-2">
                    <CardHeader>
                        <CardTitle className="text-orange-600">CEO Diagnostics</CardTitle>
                        <CardDescription>
                            Your CEO account seems to have lost its role.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SystemRepair onRepair={() => window.location.reload()} />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // 2. For EVERYONE ELSE (Security Block)
    return (
        <div className="flex h-full w-full items-center justify-center p-8">
            <Card className="max-w-md text-center">
                <div className="flex justify-center mt-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <ShieldAlert className="h-10 w-10 text-red-600" />
                    </div>
                </div>
                <CardHeader>
                    <CardTitle>Access Restricted</CardTitle>
                    <CardDescription>
                        We could not verify your role for this school.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        This usually happens if your account was just created but not assigned a specific role (Teacher, Student, etc.) yet.
                    </p>
                    <p className="text-sm font-medium">
                        Please contact your School Administrator or IT Support.
                    </p>
                </CardContent>
            </Card>
      </div>
    );
  }

  // If role exists, show the main dashboard
  return <DashboardClient />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardPageContent />
    </Suspense>
  );
}
