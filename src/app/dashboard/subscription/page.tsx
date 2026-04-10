
'use client';

import { useUser } from '@/firebase'; 
import PayButton from '@/components/subscription/PayButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCurrentSchool } from '@/hooks/use-current-school';

export default function SubscriptionPage() {
  const { user, isUserLoading } = useUser();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  if (isUserLoading || isLoadingSchool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }
  
  if (!user || !schoolId) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Error</CardTitle>
                <CardDescription>Could not find your associated school. Please contact support.</CardDescription>
            </CardHeader>
        </Card>
    );
  }
  
  // CRITICAL: Metadata for Webhook
  const commonMetadata = {
    type: 'school_upgrade',
    schoolId: schoolId,
    custom_fields: [
      {
        display_name: "Payment Type",
        variable_name: "payment_type",
        value: "School System Upgrade"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Choose Your Plan</h1>
            <p className="text-muted-foreground mt-2">
                Your trial has ended. Upgrade your school system to unlock all features instantly.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
            
            {/* Monthly Plan */}
            <Card className="shadow-lg border">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Monthly Plan</CardTitle>
                    <div className="my-4">
                        <span className="text-4xl font-bold text-gray-900">GHS 300</span>
                        <span className="text-gray-500">/month</span>
                    </div>
                    <CardDescription>
                        Flexible monthly payments for full access.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2">✅ Unlimited Staff & Students</li>
                        <li className="flex items-center gap-2">✅ Full Access to All Modules</li>
                        <li className="flex items-center gap-2">✅ AI-Powered Features</li>
                        <li className="flex items-center gap-2">✅ Priority Support</li>
                    </ul>
                     <PayButton 
                        amount={300} 
                        email={user.email || ''} 
                        userId={user.uid}
                        metadata={{...commonMetadata, planLabel: 'Monthly'}}
                    />
                </CardContent>
            </Card>

            {/* Annual Plan */}
             <Card className="shadow-2xl border-2 border-indigo-600 relative">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white">
                    <Crown className="mr-2 h-4 w-4"/> Best Value
                </Badge>
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Annual Plan</CardTitle>
                     <div className="my-4">
                        <span className="text-4xl font-bold text-gray-900">GHS 3000</span>
                        <span className="text-gray-500">/year</span>
                    </div>
                    <CardDescription>
                        Save GHS 600 with our discounted annual subscription.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2">✅ Unlimited Staff & Students</li>
                        <li className="flex items-center gap-2">✅ Full Access to All Modules</li>
                        <li className="flex items-center gap-2">✅ AI-Powered Features</li>
                        <li className="flex items-center gap-2">✅ Priority Support</li>
                    </ul>
                    <PayButton 
                        amount={3000} 
                        email={user.email || ''} 
                        userId={user.uid}
                        metadata={{...commonMetadata, planLabel: 'Annual'}}
                    />
                </CardContent>
            </Card>

        </div>
      </div>
    </div>
  );
}
