'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardClient from './dashboard-client';
import DashboardLoading from './loading';
import { useRole } from '@/context/role-context';
import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, RefreshCw, LogOut } from 'lucide-react';

function DashboardPageContent() {
  const { role, loading: isRoleLoading, refreshRole } = useRole();
  const { user, isUserLoading } = useUser();
  const [gracePeriodExpired, setGracePeriodExpired] = useState(false);
  const router = useRouter();

  const isLoading = isRoleLoading || isUserLoading;

  // Provide a 3.5s verification grace period for newly logged-in sessions
  // so Firestore auth token binding and role resolution can complete without flashing Access Restricted.
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (!role && user) {
      setGracePeriodExpired(false);
      timer = setTimeout(() => {
        setGracePeriodExpired(true);
      }, 3500);
    } else if (role) {
      setGracePeriodExpired(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [role, user]);

  // Keep skeleton loading while initializing or during the grace period for an authenticated user
  if (isLoading || (!role && user && !gracePeriodExpired)) {
    return <DashboardLoading />;
  }

  // --- SAFETY CHECK (ONLY AFTER LOADING & GRACE PERIOD DEFINITIVELY EXPIRE) ---
  if (!role) {
    return (
      <div className="flex h-full min-h-[70vh] w-full items-center justify-center p-4 sm:p-8">
        <Card className="max-w-md w-full text-center border-slate-200/90 shadow-xl rounded-2xl bg-white">
          <div className="flex justify-center mt-6">
            <div className="bg-amber-100 p-4 rounded-full">
              <ShieldAlert className="h-10 w-10 text-amber-600" />
            </div>
          </div>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-xl font-black text-slate-800">Access Restricted</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              We could not verify your institutional role for this portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Signed in as <strong className="text-slate-900 font-semibold">{user?.email || 'Unknown User'}</strong>. This usually happens if your account was just created or your role is still being synchronized.
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Please contact your School Administrator or IT Support if your role has not been assigned.
            </p>
            <div className="flex flex-col gap-2 pt-3">
              <Button
                variant="default"
                onClick={() => {
                  setGracePeriodExpired(false);
                  refreshRole();
                }}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry Access Verification</span>
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    const { getAuth, signOut } = await import('firebase/auth');
                    await signOut(getAuth());
                  } catch (e) {
                    console.error("Sign out error:", e);
                  }
                  router.push('/');
                }}
                className="w-full h-10 border-slate-300 text-slate-700 hover:bg-slate-100 font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
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
