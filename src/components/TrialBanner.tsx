
'use client';

import { useEffect, useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function TrialBanner() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isTrial, setIsTrial] = useState(false);

  useEffect(() => {
    async function checkPlan() {
      if (!user || !firestore) return;
      
      // 1. Get User to find School ID
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
      const schoolId = userDoc.data()?.schoolId;

      if (!schoolId) return;

      // 2. Get School Data
      const schoolDoc = await getDoc(doc(firestore, 'schools', schoolId));
      const schoolData = schoolDoc.data();

      if (schoolData && schoolData.plan === 'Trial' && schoolData.trialEndsAt) {
        setIsTrial(true);
        const endDate = schoolData.trialEndsAt.toDate();
        const now = new Date();
        // Calculate days difference
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // If expired, it returns negative logic elsewhere, but here just show days
        if (now > endDate) {
            setDaysLeft(0);
        } else {
            setDaysLeft(diffDays);
        }
      }
    }
    checkPlan();
  }, [user, firestore]);

  if (!isTrial || daysLeft === null) return null;

  return (
    <div className={`p-3 text-center text-sm font-medium flex justify-center items-center gap-2 ${daysLeft <= 0 ? 'bg-red-600 text-white' : 'bg-orange-100 text-orange-800'}`}>
      <AlertTriangle className="h-4 w-4" />
      {daysLeft <= 0 ? (
        <span>Your Free Trial has expired! Access will be restricted.</span>
      ) : (
        <span>You are on a Free Trial. {daysLeft} {daysLeft === 1 ? 'day' : 'days'} remaining.</span>
      )}
      <Link href="/dashboard/subscription" className="underline font-bold ml-2">
        Upgrade Now
      </Link>
    </div>
  );
}
