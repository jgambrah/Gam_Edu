
'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FlaskConical, Trophy, PencilRuler, PlusCircle, Lightbulb, Wand2 } from 'lucide-react';
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
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, orderBy, query, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { ScienceLeaderboardEntry, ScienceProblem, scienceProblemSchema, DailyFact, Class, Student } from '@/lib/types';
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
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AiProblemGenerator } from '../ai-problem-generator';

function Leaderboard() {
    const firestore = useFirestore();
    const leaderboardQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'science_leaderboard'), orderBy('total_correct_answers', 'desc')) : null,
      [firestore]
    );
    const { data: leaderboard, isLoading } = useCollection<ScienceLeaderboardEntry>(leaderboardQuery);

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

    const { data: classes } = useCollection<Class>(useMemoFirebase(() => firestore ? collection(firestore, 'classes'): null, [firestore]));

    const form = useForm<z.infer<typeof scienceProblemSchema>>({
        resolver: zodResolver(scienceProblemSchema),
        defaultValues: {
            difficulty: 'Easy',
            topic: 'Biology',
            options: ['', '', '', ''],
            classId: '',
        }
    });

    async function onSubmit(values: z.infer<typeof scienceProblemSchema>) {
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'science_problems'), values);
            toast({ title: 'Success', description: 'New science problem has been added.' });
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
                 <FormField control={form.control} name="classId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Assign to Class</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a class"/></SelectTrigger></FormControl>
                        <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select><FormMessage/>
                    </FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="topic" render={({ field }) => (
                        <FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g. Photosynthesis" {...field} /></FormControl><FormMessage/></FormItem>
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
    const { data: problems, isLoading } = useCollection<ScienceProblem>(useMemoFirebase(() => firestore ? query(collection(firestore, 'science_problems')) : null, [firestore]));
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAiFormOpen, setIsAiFormOpen] = useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Problem Bank</CardTitle>
                    <CardDescription>Manage the collection of science problems for student practice sessions.</CardDescription>
                </div>
                 <div className="flex gap-2">
                    <Dialog open={isAiFormOpen} onOpenChange={setIsAiFormOpen}>
                        <DialogTrigger asChild><Button variant="outline"><Wand2 className="mr-2 h-4"/>Generate with AI</Button></DialogTrigger>
                        <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>AI Problem Generator</DialogTitle><DialogDescription>Generate multiple-choice questions for any topic.</DialogDescription></DialogHeader><AiProblemGenerator subject="Science" setOpen={setIsAiFormOpen} /></DialogContent>
                    </Dialog>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4"/>New Problem</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Create New Science Problem</DialogTitle><DialogDescription>Add a new question to the problem bank.</DialogDescription></DialogHeader>
                            <ProblemCreationForm setOpen={setIsFormOpen}/>
                        </DialogContent>
                    </Dialog>
                </div>
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

function FactOfTheDay() {
    const firestore = useFirestore();
    const { role, user } = useRole();
    const { toast } = useToast();
    const [factText, setFactText] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const isTeacherOrAdmin = role === 'Teacher' || role === 'Administrator' || role === 'Director';

    // FIX 2: Simplified Query (No orderBy) to prevent index crash
    const factsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'daily_facts')) : null, [firestore]);
    const { data: facts, isLoading } = useCollection<DailyFact>(factsQuery);
    const latestFact = facts?.[0]; // Just take the first one for now

    const handlePostFact = async () => {
        if (!factText.trim() || !user) return;
        setIsPosting(true);
        try {
            await addDoc(collection(firestore, 'daily_facts'), {
                factText,
                createdAt: serverTimestamp(),
                postedBy: user.uid,
            });
            toast({ title: 'Success!', description: 'The new science fact has been posted.' });
            setFactText('');
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not post the fact.' });
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb/> Science Fact of the Day</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? <Skeleton className="h-16 w-full" /> : latestFact ? (
                    <blockquote className="border-l-4 pl-4 italic">
                        {latestFact.factText}
                        <footer className="text-xs text-muted-foreground mt-2">Posted on {latestFact.createdAt ? format(latestFact.createdAt.toDate(), 'PPP') : 'Today'}</footer>
                    </blockquote>
                ) : <p className="text-muted-foreground text-sm">No fact has been posted for today yet.</p>}

                {isTeacherOrAdmin && (
                    <div className="space-y-2 pt-4 border-t">
                        <Label>Post a New Fact</Label>
                        <Textarea value={factText} onChange={e => setFactText(e.target.value)} placeholder="Enter a new interesting science fact..."/>
                        <Button onClick={handlePostFact} disabled={isPosting || !factText.trim()}>
                            {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Post Fact
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function ScienceClubPage() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const router = useRouter();
  const { role } = useRole();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const isTeacherOrAdmin = role === 'Teacher' || role === 'Administrator' || role === 'Director';
  
  const { data: studentData, isLoading: isLoadingStudent } = useCollection<Student>(
    useMemoFirebase(() => {
        if (!user || !firestore || role !== 'Student') return null;
        return query(collection(firestore, 'students'), where('uid', '==', user.uid));
    }, [firestore, user, role])
  );
  
  const studentClassId = studentData?.[0]?.classId;
  
  // FIX 3: Robust Query Logic (Copied from Maths Club)
  const problemsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    
    // Teachers see everything
    if (isTeacherOrAdmin) {
      return query(collection(firestore, 'science_problems'));
    }
    
    // Students see only their class content
    if (role === 'Student') {
        if (studentClassId) {
             return query(collection(firestore, 'science_problems'), where('classId', '==', studentClassId));
        }
        // If classId is missing, return null to avoid query error
        return null;
    }
    return null;
  }, [firestore, isTeacherOrAdmin, role, studentClassId]);

  const { data: problems, isLoading: isLoadingProblems } = useCollection<ScienceProblem>(problemsQuery);

  const uniqueTopics = useMemo(() => {
    if (!problems) return [];
    const topics = new Set(problems.map(p => p.topic));
    return Array.from(topics);
  }, [problems]);

  const handleStartPractice = () => {
    if (topic && difficulty) {
      router.push(`/dashboard/science-club/practice?topic=${topic}&difficulty=${difficulty}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical />
            Science Club
          </CardTitle>
          <CardDescription>
            Welcome to the Science Club! Explore topics, practice problems, and climb the leaderboard.
          </CardDescription>
        </CardHeader>
         <CardContent>
            <FactOfTheDay />
        </CardContent>
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
                {/* FIX 4: Better Loading State Logic */}
                {(isLoadingProblems || (role === 'Student' && isLoadingStudent) || isUserLoading) ? (
                    <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin"/></div>
                ) : 
                (role === 'Student' && !studentClassId) ? (
                    <div className="text-center">
                        <p className="text-muted-foreground">You are not assigned to a class. Please contact an administrator.</p>
                        <p className="text-xs text-red-500 mt-1">Debug: {user?.uid}</p>
                    </div>
                ) : 
                (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select onValueChange={setTopic}>
                                <SelectTrigger><SelectValue placeholder="Select a Topic" /></SelectTrigger>
                                <SelectContent>
                                    {uniqueTopics.map(topic => (
                                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                                    ))}
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
                    </>
                )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="leaderboard">
            <Card>
                <CardHeader>
                    <CardTitle>Science Leaderboard</CardTitle>
                    <CardDescription>See how you rank against other students in science.</CardDescription>
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
