
'use client';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Zap } from 'lucide-react';

export default function CreditBalance() {
  const { schoolId } = useCurrentSchool();
  const firestore = useFirestore();
  
  // Real-time listener
  const { data: school } = useDoc(
    firestore && schoolId ? doc(firestore, 'schools', schoolId) : null
  );

  if (!school) return null;

  return (
    <div className="flex items-center gap-1 text-sm font-medium bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
      <Zap className="h-3 w-3 fill-current" />
      <span>{school.aiCredits || 0} Credits</span>
    </div>
  );
}
