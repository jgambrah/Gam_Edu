
'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase'; // Adjust path to your firebase config
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SystemRepair({ onRepair }: { onRepair: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const fixSystem = async () => {
    if (!user || !firestore) return;
    setLoading(true);
    try {
      // Create your ADMIN profile in the 'staff' collection
      await setDoc(doc(firestore, 'staff', user.uid), {
        email: user.email,
        role: 'Director', // The most powerful role
        firstName: 'Admin',
        lastName: 'User',
        uid: user.uid,
      }, { merge: true });

      // Also ensure the 'users' collection is correct
      await setDoc(doc(firestore, 'users', user.uid), {
        role: 'Director',
      }, { merge: true });


      toast({
        title: "System Repaired!",
        description: "Your Director profile has been created. Reloading...",
      });

      // Trigger the parent component to re-check the role.
      onRepair();
      
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Repair Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg my-4">
      <h3 className="font-bold text-orange-800 flex items-center gap-2">
        <Wrench className="h-4 w-4"/> Developer Repair Tool
      </h3>
      <p className="text-sm text-orange-700 mb-3">
        Click this to force-create your 'Director' profile and fix the login loop.
      </p>
      <Button onClick={fixSystem} disabled={loading} className="bg-orange-600 hover:bg-orange-700 w-full">
        {loading ? <Loader2 className="animate-spin mr-2"/> : null}
        Create My Admin Profile
      </Button>
    </div>
  );
}
