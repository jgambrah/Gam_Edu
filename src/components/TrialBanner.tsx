
'use client';

import { useEffect, useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { AlertTriangle, Clock, Crown } from 'lucide-react';
import Link from 'next/link';

export default function TrialBanner() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPlan() {
      if (!user || !firestore) return;
      
      try {
        // 1. Get User to find School ID
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        const userData = userDoc.data();
        const schoolId = userData?.schoolId;

        if (!schoolId) {
            setLoading(false);
            return;
        }

        // 2. Get School Data
        const schoolDoc = await getDoc(doc(firestore, 'schools', schoolId));
        const schoolData = schoolDoc.data();

        if (schoolData) {
            setPlan(schoolData.plan);
            
            if (schoolData.plan === 'Trial' && schoolData.trialEndsAt) {
                const endDate = schoolData.trialEndsAt.toDate();
                const now = new Date();
                const diffTime = endDate.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                setDaysLeft(diffDays);
            }
        }
      } catch (err) {
        console.error("Error fetching plan:", err);
      } finally {
        setLoading(false);
      }
    }
    checkPlan();
  }, [user, firestore]);

  if (loading) return null;

  // Don't show banner if they are Premium
  if (plan === 'Premium') return null;

  // EXPIRED TRIAL
  if (plan === 'Trial' && daysLeft !== null && daysLeft <= 0) {
    return (
      <div className="bg-red-600 text-white px-4 py-3 text-center text-sm font-medium flex justify-center items-center gap-2 shadow-md animate-pulse">
        <AlertTriangle className="h-5 w-5" />
        <span>Your Free Trial has expired! Access is restricted.</span>
        <Link 
            href="/dashboard/subscription" 
            className="ml-2 bg-white text-red-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-gray-100 transition"
        >
          UPGRADE NOW
        </Link>
      </div>
    );
  }

  // ACTIVE TRIAL
  if (plan === 'Trial' && daysLeft !== null) {
    return (
      <div className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-900 border-b border-orange-200 px-4 py-2 text-center text-sm font-medium flex justify-center items-center gap-2">
        <Clock className="h-4 w-4 text-orange-600" />
        <span>Free Trial: <strong>{daysLeft} {daysLeft === 1 ? 'day' : 'days'}</strong> remaining.</span>
        <Link 
            href="/dashboard/subscription" 
            className="underline font-bold text-orange-700 hover:text-orange-900 flex items-center gap-1"
        >
          Upgrade to Premium <Crown className="h-3 w-3"/>
        </Link>
      </div>
    );
  }

  return null;
}
