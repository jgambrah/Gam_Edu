
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import PayButton from '@/components/subscription/PayButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function SubscriptionPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [isLoadingSchool, setIsLoadingSchool] = useState(true);

  useEffect(() => {
    async function fetchSchoolInfo() {
      if (!user || !firestore) return;
      
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const sId = userDocSnap.data()?.schoolId;
          if (sId) {
            setSchoolId(sId);
            const schoolDocRef = doc(firestore, 'schools', sId);
            const schoolDocSnap = await getDoc(schoolDocRef);
            if (schoolDocSnap.exists()) {
              setSchoolName(schoolDocSnap.data()?.name);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching school info:", error);
      } finally {
        setIsLoadingSchool(false);
      }
    }
    
    fetchSchoolInfo();
  }, [user, firestore]);

  const isLoading = isUserLoading || isLoadingSchool;

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-t-4 border-t-indigo-600">
            <CardHeader>
                <CardTitle className="text-2xl">Upgrade Your Plan</CardTitle>
                <CardDescription>
                    Your trial has ended. Upgrade <strong className="text-indigo-600">{schoolName || 'your school'}</strong> to unlock all features.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Premium School Plan</h3>
                         <ul className="mt-4 space-y-2 text-sm text-slate-600">
                            <li className="flex items-center gap-2">✅ Unlimited Staff & Students</li>
                            <li className="flex items-center gap-2">✅ Full Access to All Modules</li>
                            <li className="flex items-center gap-2">✅ AI-Powered Features</li>
                            <li className="flex items-center gap-2">✅ Priority Support</li>
                        </ul>
                    </div>
                    <div className="bg-indigo-50 p-8 rounded-lg">
                        <div className="text-center">
                            <p className="text-indigo-600 font-bold">ANNUAL PLAN</p>
                            <div className="my-2">
                                <span className="text-5xl font-bold text-gray-900">GHS 500</span>
                                <span className="text-gray-500">/year</span>
                            </div>
                        </div>

                        <PayButton 
                          amount={500} 
                          email={user.email || ''} 
                          userId={user.uid}
                          metadata={{
                              type: 'school_upgrade',
                              schoolId: schoolId,
                              schoolName: schoolName,
                              userId: user.uid
                          }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
