'use client';

import { useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import SignatureManager from '@/components/profile/SignatureManager';
import { User, Mail, Shield, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MyProfilePage() {
  const { user } = useUser();
  const { profile, role } = useRole();

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">
          Personal <span className="text-blue-600">Verification</span>
        </h1>
        <p className="text-slate-500 font-bold text-xs uppercase italic">Manage your secure identity and digital signature.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT: INFO */}
        <div className="md:col-span-1 space-y-6">
            <Card className="rounded-[40px] shadow-xl border-4 border-slate-100 overflow-hidden">
                <CardHeader className="bg-slate-50 text-center pb-8 pt-10 border-b">
                    <div className="h-24 w-24 rounded-full bg-indigo-100 mx-auto flex items-center justify-center text-indigo-600 font-black text-3xl mb-4 border-4 border-white shadow-lg">
                        {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                    </div>
                    <CardTitle className="text-xl font-black uppercase">{profile?.firstName} {profile?.lastName}</CardTitle>
                    <div className="flex justify-center mt-2">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold px-3 py-1">
                            {role}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600 font-medium truncate">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        <span className="text-slate-600 font-medium">Verified Identity</span>
                    </div>
                </CardContent>
            </Card>
            
            <div className="p-6 bg-slate-900 text-indigo-100 rounded-[32px] space-y-2 shadow-lg">
                <Shield className="h-6 w-6 text-indigo-400 mb-2"/>
                <h4 className="font-bold text-sm uppercase tracking-tight">Security Notice</h4>
                <p className="text-[10px] leading-relaxed opacity-70">
                    Your profile is part of the GAM Edu Enterprise Cloud. All changes are audited for security compliance and non-repudiation.
                </p>
            </div>
        </div>

        {/* RIGHT: SIGNATURE */}
        <div className="md:col-span-2">
            <SignatureManager />
        </div>
      </div>
    </div>
  );
}