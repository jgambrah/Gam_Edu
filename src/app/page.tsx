
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LoginForm from '@/components/auth/login-form'; 
import { GraduationCap } from 'lucide-react';
import SystemRepair from '@/components/SystemRepair';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8">
        
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-indigo-600 p-3 rounded-full">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-indigo-900 tracking-tight">Sunnyside Academy</h1>
          <p className="text-slate-500">School Management Portal</p>
        </div>

        <Card className="shadow-xl border-0 ring-1 ring-slate-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold tracking-tight">Sign in</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <div className="mt-8">
            <p className="text-xs text-center text-slate-400 mb-2 uppercase tracking-widest">
                Admin Diagnostic Tools
            </p>
            <SystemRepair />
        </div>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Having trouble? Contact the IT department.
        </p>
      </div>
    </div>
  );
}
