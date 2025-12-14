
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase'; // Adjust to your actual import paths
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { PlusCircle, Loader2 } from 'lucide-react';

// Input Props
interface Props {
  missionId: number; // We use the ID from your CURRICULUM
}

export default function AdminBlockManager({ missionId }: Props) {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [newBlock, setNewBlock] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // HARDCODED ADMIN CHECK (Double security layer)
  // Ensure this matches the UID in your Firestore Rules
  const ADMIN_UID = "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";

  useEffect(() => {
    if (user && user.uid === ADMIN_UID) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleAddBlock = async () => {
    if (!newBlock.trim() || !firestore) return;
    setIsSubmitting(true);

    try {
      const docRef = doc(firestore, 'logic_lab_missions', missionId.toString());
      const docSnap = await getDoc(docRef);

      // If document doesn't exist yet, create it. Otherwise, update it.
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          availableBlocks: arrayUnion(newBlock.trim())
        });
      } else {
        await updateDoc(docRef, {
          availableBlocks: arrayUnion(newBlock.trim())
        });
      }

      alert(`✅ Admin: Added block "${newBlock}"`);
      setNewBlock(''); // Clear input
    } catch (error: any) {
      console.error(error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render nothing if not admin
  if (!isAdmin) return null;

  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2 text-red-800 font-bold text-xs uppercase">
        <span className="bg-red-200 px-1 rounded">Admin Zone</span>
        <span>Add Block to Mission {missionId}</span>
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={newBlock}
          onChange={(e) => setNewBlock(e.target.value)}
          placeholder="e.g. x = 10"
          className="flex-1 border border-red-300 rounded px-2 py-1 text-sm text-black"
        />
        <button
          onClick={handleAddBlock}
          disabled={isSubmitting}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <PlusCircle className="h-4 w-4"/>}
          Add
        </button>
      </div>
    </div>
  );
}
