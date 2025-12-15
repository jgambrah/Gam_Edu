
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LoginForm from '@/components/auth/login-form'; // Ensure this path is correct for your project
import SystemRepair from '@/components/SystemRepair'; 

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* 1. HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-indigo-900">Sunnyside Academy</h1>
          <p className="text-slate-500">School Management System</p>
        </div>

        {/* 2. LOGIN FORM CARD */}
        <Card className="shadow-xl border-t-4 border-t-indigo-600">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Please sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            {/* This is your actual Login Component */}
            <LoginForm /> 
          </CardContent>
        </Card>

        {/* 3. REPAIR TOOL (Visible Publicly for Debugging) */}
        <div className="mt-8">
            <p className="text-xs text-center text-slate-400 mb-2 uppercase tracking-widest">
                Admin Diagnostic Tools
            </p>
            <SystemRepair />
        </div>

      </div>
    </div>
  );
}
