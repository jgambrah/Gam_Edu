
'use client';

import { Suspense } from 'react';
import DashboardClient from './dashboard-client';
import DashboardLoading from './loading';
import { useRole } from '@/context/role-context';
import { useUser } from '@/firebase'; // Corrected hook
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
    // If no role is found after loading, show an access restricted message.
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
