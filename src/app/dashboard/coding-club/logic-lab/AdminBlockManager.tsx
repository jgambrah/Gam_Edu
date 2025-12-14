
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase'; 
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Plus, Loader2 } from 'lucide-react'; // Changed icon to simple Plus

interface Props {
  missionId: number; 
}

export default function AdminBlockManager({ missionId }: Props) {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [newBlock, setNewBlock] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // YOUR ADMIN UID
  const ADMIN_UID = "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";

  useEffect(() => {
    if (user && user.uid === ADMIN_UID) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleAddBlock = async (e?: React.FormEvent) => {
    // Prevent default form refresh if called via onSubmit
    if (e) e.preventDefault(); 
    
    if (!newBlock.trim() || !firestore) return;
    setIsSubmitting(true);

    try {
      // Ensure ID is string for Firestore
      const docRef = doc(firestore, 'logic_lab_missions', missionId.toString());
      const docSnap = await getDoc(docRef);

      // Create doc if it doesn't exist, otherwise update
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

  // If not admin, hide completely
  if (!isAdmin) return null;

  return (
    <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg shadow-sm">
      <div className="mb-2">
        <h3 className="text-red-800 font-bold text-xs uppercase tracking-wider">
           👮 Admin Control
        </h3>
        <p className="text-[10px] text-red-600">
          Adding to Mission {missionId}
        </p>
      </div>
      
      {/* Use a form so pressing "Enter" works automatically */}
      <form onSubmit={handleAddBlock} className="flex flex-col gap-2">
        <input
          type="text"
          value={newBlock}
          onChange={(e) => setNewBlock(e.target.value)}
          placeholder="Type block code here..."
          className="w-full border border-red-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded text-sm flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin"/> Adding...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4"/> Add Block
            </>
          )}
        </button>
      </form>
    </div>
  );
}

    