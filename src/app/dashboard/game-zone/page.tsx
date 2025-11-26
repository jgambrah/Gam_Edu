
'use client';

import { useState } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gamepad2, Play, Users } from 'lucide-react';
import { StartGameDialog } from './start-game-dialog';
import { useRouter } from 'next/navigation';

export default function GameZonePage() {
  const { role } = useRole();
  const [gamePin, setGamePin] = useState('');
  const [isStartDialogOpen, setStartDialogOpen] = useState(false);
  const router = useRouter();

  const isTeacherOrAdmin = role === 'Teacher' || role === 'Administrator' || role === 'Director';

  const handleJoinGame = () => {
    if (gamePin.trim()) {
      // In a real app, you'd validate the pin first
      router.push(`/dashboard/game-zone/play/${gamePin.trim()}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-8 w-8" />
            Game Zone
          </CardTitle>
          <CardDescription>
            Join a live quiz game or, if you're a teacher, host a new one!
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Student View: Join Game */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users /> Join a Game</CardTitle>
            <CardDescription>
              Enter the Game PIN provided by your teacher to join the quiz.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="game-pin">Game PIN</Label>
              <Input
                id="game-pin"
                placeholder="123456"
                value={gamePin}
                onChange={(e) => setGamePin(e.target.value)}
                className="text-center text-2xl font-bold h-14 tracking-widest"
              />
            </div>
            <Button onClick={handleJoinGame} className="w-full" disabled={!gamePin.trim()}>
              Join Game
            </Button>
          </CardContent>
        </Card>

        {/* Teacher/Admin View: Host Game */}
        {isTeacherOrAdmin && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Play /> Host a New Game</CardTitle>
                <CardDescription>
                  Select one of your existing quizzes to start a live game session with your students.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setStartDialogOpen(true)} className="w-full">
                  Host New Game
                </Button>
              </CardContent>
            </Card>
            <StartGameDialog isOpen={isStartDialogOpen} setOpen={setStartDialogOpen} />
          </>
        )}
      </div>
    </div>
  );
}
