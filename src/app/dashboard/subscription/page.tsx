'use client';

import { useUser } from '@/firebase'; 
import PayButton from '@/components/subscription/PayButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function SubscriptionPage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
       return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
       )
  }
  
  if (!user) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Authentication Required</CardTitle>
                <CardDescription>Please log in to manage your subscription.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-blue-900">Premium Access</h2>
            <p className="mt-4 text-gray-600">
              Unlock all lessons, quizzes, and tracking features.
            </p>
            <div className="my-8">
              <span className="text-5xl font-bold text-gray-900">GHS 50</span>
              <span className="text-gray-500">/month</span>
            </div>

            {/* This is the button that triggers Paystack */}
            <PayButton 
              amount={50} 
              email={user.email || ''} 
              userId={user.uid} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
