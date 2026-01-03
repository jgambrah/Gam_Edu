
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- SERVER ACTION ---
async function saveNewPuzzle(puzzleData: any, toast: (options: any) => void) {
  // In a real app, this would be a server action.
  // For now, we keep it here to avoid build issues.
  try {
    const { getFirestore } = await import('@/firebase');
    const firestore = getFirestore();
    if (!firestore) throw new Error("Firestore not available");

    const docRef = await addDoc(collection(firestore, 'junior_puzzles'), {
      ...puzzleData,
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding puzzle: ", error);
    toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: (error as Error).message
    });
    return { success: false, error: (error as Error).message };
  }
}


export function AddPuzzleForm() {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [clueText, setClueText] = useState(''); // Format: 1, Across, Clue, Answer, Row, Col
  const { toast } = useToast(); // Correctly call the hook inside the component

  const handleAdd = async () => {
    // Basic parser for demonstration
    // In a real app, use a more structured dynamic form
    const puzzle = {
      title,
      topic,
      clues: { across: [], down: [] },
      grid: [[]] // You can use an AI flow to generate the grid from answers!
    };

    const res = await saveNewPuzzle(puzzle, toast);
    if(res.success) {
      toast({ title: "Puzzle Added!" });
    }
  };

  return (
    <div className="p-6 bg-white rounded-3xl border-4 border-purple-100 space-y-4">
      <h3 className="text-xl font-bold">Teacher Tool: Create Puzzle</h3>
      <Input placeholder="Puzzle Title" value={title} onChange={e => setTitle(e.target.value)} />
      <Input placeholder="Topic (e.g. History)" value={topic} onChange={e => setTopic(e.target.value)} />
      <p className="text-xs text-slate-400">Puzzles added here will appear in the Junior Campus for all students.</p>
      <Button onClick={handleAdd} className="w-full bg-purple-600">Save to Library</Button>
    </div>
  );
}
