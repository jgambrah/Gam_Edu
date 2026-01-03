
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, getDocs, Firestore } from 'firebase/firestore';
import { PuzzleMaker } from './puzzle-creator';

// --- SERVER ACTION (modified to accept firestore instance) ---
async function saveNewPuzzle(firestore: Firestore, puzzleData: any, toast: (options: any) => void) {
  try {
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
  const { toast } = useToast();
  const firestore = useFirestore(); // Get firestore instance from component

  const handleAdd = async () => {
    if (!firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'Database not ready.'});
        return;
    }
    // Basic parser for demonstration
    // In a real app, use a more structured dynamic form
    const puzzle = {
      title,
      topic,
      clues: { across: [], down: [] },
      grid: [] // FIX: Changed from [[]] to [] to prevent nested array error
    };

    const res = await saveNewPuzzle(firestore, puzzle, toast);
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
