
'use client';

import { useMemo } from 'react';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Zap } from 'lucide-react';
import { useRole } from '@/context/role-context';

export default function CreditBalance() {
  const { schoolId } = useCurrentSchool();
  const { role } = useRole();
  const firestore = useFirestore();
  
  // 🔥 FIX: Memoize the reference so it doesn't change on every render
  const schoolRef = useMemo(() => {
    // Parents are blocked from reading the school doc, and they don't need to see credits anyway.
    if (!firestore || !schoolId || role === 'Parent') return null;
    return doc(firestore, 'schools', schoolId);
  }, [firestore, schoolId, role]); 

  // Pass the stable reference to useDoc
  const { data: school } = useDoc(schoolRef);

  // If no school data or user is a parent, hide the credit balance UI
  if (!school || role === 'Parent') return null;

  // Visual color logic based on credits
  const credits = school.aiCredits || 0;
  let colorClass = "bg-purple-100 text-purple-800";
  if (credits < 50) colorClass = "bg-orange-100 text-orange-800";
  if (credits < 10) colorClass = "bg-red-100 text-red-800 animate-pulse";

  return (
    <div className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full transition-colors ${colorClass}`}>
      <Zap className="h-3 w-3 fill-current" />
      <span>{credits} AI Credits</span>
    </div>
  );
}
