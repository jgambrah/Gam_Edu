
'use client';

import { useState } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { collection, query, where, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { Quiz } from '@/lib/types';
import { useRouter } from 'next/navigation';

function generateGamePin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function StartGameDialog({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}) {
  const firestore = useFirestore();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const quizzesQuery = useMemoFirebase(
    () => user && query(collection(firestore, 'quizzes'), where('teacherId', '==', user.uid)),
    [firestore, user]
  );
  const { data: quizzes, isLoading } = useCollection<Quiz>(quizzesQuery);

  const handleStartGame = async () => {
    if (!selectedQuizId || !user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a quiz to start.',
      });
      return;
    }

    setIsStarting(true);
    const gamePin = generateGamePin();

    try {
      const lobbyRef = doc(firestore, 'gameLobbies', gamePin);
      await setDoc(lobbyRef, {
        id: gamePin,
        quizId: selectedQuizId,
        hostId: user.uid,
        status: 'waiting',
        players: [],
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Lobby Created!',
        description: `Your game pin is ${gamePin}. Share it with your students.`,
      });

      setOpen(false);
      router.push(`/dashboard/game-zone/lobby/${gamePin}`);
    } catch (error) {
      console.error('Error creating game lobby:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not create the game lobby. Please try again.',
      });
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Host a New Game</DialogTitle>
          <DialogDescription>
            Select a quiz to start a live game session. A unique game pin will be generated for
            your students to join.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select onValueChange={setSelectedQuizId} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? 'Loading quizzes...' : 'Select a quiz'} />
            </SelectTrigger>
            <SelectContent>
              {quizzes?.map((quiz) => (
                <SelectItem key={quiz.id} value={quiz.id}>
                  {quiz.title} ({quiz.questions.length} questions)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleStartGame} disabled={isStarting || !selectedQuizId}>
          {isStarting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Start Game Lobby
        </Button>
      </DialogContent>
    </Dialog>
  );
}
