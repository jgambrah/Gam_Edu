
'use client';

import { Suspense } from 'react';
import DashboardClient from './dashboard-client';
import DashboardLoading from './loading';
import { useRole } from '@/context/role-context';
import SystemRepair from '@/components/SystemRepair'; // Import the repair tool
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


function DashboardPageContent() {
  const { role, loading, refreshRole } = useRole();

  if (loading) {
    return <DashboardLoading />;
  }

  // If loading is done, and there's still no role, show the repair tool.
  if (!role) {
    return (
        <div className="flex h-full w-full items-center justify-center p-8">
            <Card className="max-w-md">
                <CardHeader>
                    <CardTitle>No Role Assigned</CardTitle>
                    <CardDescription>
                        Your account does not have a role. This can happen for new admin accounts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SystemRepair onRepair={refreshRole} />
                </CardContent>
            </Card>
      </div>
    );
  }

  // If a role is found, show the main dashboard client
  return <DashboardClient />;
}


export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardPageContent />
    </Suspense>
  );
}
