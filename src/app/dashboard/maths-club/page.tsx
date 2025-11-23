'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Sigma, Trophy, PencilRuler } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import { GlobalLeaderboardEntry } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

function Leaderboard() {
    const firestore = useFirestore();
    const leaderboardQuery = useMemoFirebase(
      () => query(collection(firestore, 'global_leaderboard'), orderBy('total_correct_answers', 'desc')),
      [firestore]
    );
    const { data: leaderboard, isLoading } = useCollection<GlobalLeaderboardEntry>(leaderboardQuery);

    if (isLoading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="text-right">Correct Answers</TableHead>
                    <TableHead className="text-right">Quizzes Completed</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {leaderboard?.map((entry, index) => (
                    <TableRow key={entry.userId}>
                        <TableCell className="font-bold">{index + 1}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={entry.profilePictureUrl} />
                                    <AvatarFallback>{entry.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{entry.userName}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">{entry.total_correct_answers}</TableCell>
                        <TableCell className="text-right">{entry.total_quizzes_completed}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default function MathsClubPage() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const router = useRouter();

  const handleStartPractice = () => {
    if (topic && difficulty) {
      router.push(`/dashboard/maths-club/practice?topic=${topic}&difficulty=${difficulty}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sigma />
            Maths Club
          </CardTitle>
          <CardDescription>
            Welcome to the Maths Club! Practice problems, track your progress,
            and climb the leaderboard.
          </CardDescription>
        </CardHeader>
      </Card>
      <Tabs defaultValue="practice">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="practice"><PencilRuler className="mr-2 h-4 w-4"/>Practice Hub</TabsTrigger>
          <TabsTrigger value="leaderboard"><Trophy className="mr-2 h-4 w-4"/>Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="practice">
          <Card>
            <CardHeader>
                <CardTitle>Start a New Practice Session</CardTitle>
                <CardDescription>Select a topic and difficulty to begin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select onValueChange={setTopic}>
                        <SelectTrigger><SelectValue placeholder="Select a Topic" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Algebra">Algebra</SelectItem>
                            <SelectItem value="Geometry">Geometry</SelectItem>
                            <SelectItem value="Fractions">Fractions</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select onValueChange={setDifficulty}>
                        <SelectTrigger><SelectValue placeholder="Select Difficulty" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleStartPractice} disabled={!topic || !difficulty} className="w-full">
                    Start Practice
                </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="leaderboard">
            <Card>
                <CardHeader>
                    <CardTitle>Global Leaderboard</CardTitle>
                    <CardDescription>See how you rank against other students.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Leaderboard />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
