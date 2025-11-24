
'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Sigma, Trophy, PencilRuler, PlusCircle } from 'lucide-react';
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
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query, addDoc } from 'firebase/firestore';
import { GlobalLeaderboardEntry, MathProblem, mathProblemSchema } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useRole } from '@/context/role-context';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from '@/lib/utils';

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

function ProblemCreationForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof mathProblemSchema>>({
        resolver: zodResolver(mathProblemSchema),
        defaultValues: {
            difficulty: 'Easy',
            options: ['', '', '', ''],
        }
    });

    async function onSubmit(values: z.infer<typeof mathProblemSchema>) {
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'math_problems'), values);
            toast({ title: 'Success', description: 'New math problem has been added.' });
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error('Error adding problem:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add the problem.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="topic" render={({ field }) => (
                        <FormItem><FormLabel>Topic</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a Topic"/></SelectTrigger></FormControl><SelectContent><SelectItem value="Algebra">Algebra</SelectItem><SelectItem value="Geometry">Geometry</SelectItem><SelectItem value="Fractions">Fractions</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="difficulty" render={({ field }) => (
                        <FormItem><FormLabel>Difficulty</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="question_text" render={({ field }) => (
                    <FormItem><FormLabel>Question Text</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage/></FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                    {form.getValues('options').map((_, index) => (
                        <FormField key={index} control={form.control} name={`options.${index}`} render={({ field }) => (
                            <FormItem><FormLabel>Option {index + 1}</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
                        )}/>
                    ))}
                </div>
                 <FormField control={form.control} name="correct_answer" render={({ field }) => (
                    <FormItem><FormLabel>Correct Answer</FormLabel><FormControl><Input {...field}/></FormControl><FormDescription>Must exactly match one of the options.</FormDescription><FormMessage/></FormItem>
                )}/>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Add Problem</Button>
            </form>
        </Form>
    );
}

function ManageProblems() {
    const firestore = useFirestore();
    const { data: problems, isLoading } = useCollection<MathProblem>(useMemoFirebase(() => query(collection(firestore, 'math_problems')), [firestore]));
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Problem Bank</CardTitle>
                    <CardDescription>Manage the collection of math problems for student practice sessions.</CardDescription>
                </div>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4"/>New Problem</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Create New Math Problem</DialogTitle><DialogDescription>Add a new question to the problem bank.</DialogDescription></DialogHeader>
                        <ProblemCreationForm setOpen={setIsFormOpen}/>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-40 w-full" /> : (
                <Table>
                    <TableHeader><TableRow><TableHead>Topic</TableHead><TableHead>Difficulty</TableHead><TableHead>Question</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {problems?.map(p => (
                            <TableRow key={p.id}>
                                <TableCell>{p.topic}</TableCell>
                                <TableCell>{p.difficulty}</TableCell>
                                <TableCell className="max-w-md truncate">{p.question_text}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
    )
}

export default function MathsClubPage() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const router = useRouter();
  const { role } = useRole();

  const handleStartPractice = () => {
    if (topic && difficulty) {
      router.push(`/dashboard/maths-club/practice?topic=${topic}&difficulty=${difficulty}`);
    }
  };

  const isTeacherOrAdmin = role === 'Teacher' || role === 'Administrator' || role === 'Director';

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
        <TabsList className={cn("grid w-full", isTeacherOrAdmin ? "grid-cols-3" : "grid-cols-2")}>
          <TabsTrigger value="practice"><PencilRuler className="mr-2 h-4 w-4"/>Practice Hub</TabsTrigger>
          <TabsTrigger value="leaderboard"><Trophy className="mr-2 h-4 w-4"/>Leaderboard</TabsTrigger>
          {isTeacherOrAdmin && <TabsTrigger value="manage">Manage Problems</TabsTrigger>}
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
         {isTeacherOrAdmin && (
            <TabsContent value="manage">
                <ManageProblems />
            </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
