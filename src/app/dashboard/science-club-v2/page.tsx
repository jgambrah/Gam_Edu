

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, where, getDocs, limit } from 'firebase/firestore';
import { 
  FlaskConical, Trophy, PencilRuler, PlusCircle, Loader2, 
  Trash2, BookOpen, CheckCircle2, Wand2, Lightbulb 
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Class, Student, ScienceProblem, DailyFact } from '@/lib/types';
import { AiProblemGenerator } from '../ai-problem-generator';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { format } from 'date-fns';
import { generateDailyFact } from '@/ai/flows/generate-daily-fact-flow';


// --- SUB-COMPONENT: Leaderboard ---
function LeaderboardV2() {
  const firestore = useFirestore();
  // Simple query to avoid index issues initially
  const leaderboardQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'science_leaderboard'), orderBy('total_correct_answers', 'desc')) : null,
    [firestore]
  );
  const { data: leaderboard, isLoading } = useCollection<any>(leaderboardQuery);

  if (isLoading) return <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Student</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboard?.map((entry, index) => (
          <TableRow key={entry.id}>
            <TableCell className="font-bold">#{index + 1}</TableCell>
            <TableCell>{entry.userName || "Unknown Student"}</TableCell>
            <TableCell className="text-right">{entry.total_correct_answers}</TableCell>
          </TableRow>
        ))}
        {(!leaderboard || leaderboard.length === 0) && (
            <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">No records yet.</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}

// --- SUB-COMPONENT: Add Problem Form ---
function AddScienceProblemForm({ open, setOpen, classes }: { open: boolean, setOpen: (o: boolean) => void, classes: Class[] | undefined }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [classId, setClassId] = useState('');
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');

    const handleOptionChange = (idx: number, val: string) => {
        const newOpts = [...options];
        newOpts[idx] = val;
        setOptions(newOpts);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!topic || !questionText || !correctAnswer) {
            toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill in all fields.' });
            return;
        }
        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, 'science_problems'), {
                topic, difficulty, classId, question_text: questionText, options, correct_answer: correctAnswer,
                createdAt: serverTimestamp()
            });
            toast({ title: 'Success', description: 'Problem added.' });
            setOpen(false);
            // Reset form
            setQuestionText(''); setOptions(['','','','']); setCorrectAnswer('');
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to save.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Add Science Problem</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Topic</Label>
                            <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Photosynthesis" />
                        </div>
                        <div className="space-y-2">
                            <Label>Difficulty</Label>
                            <Select value={difficulty} onValueChange={setDifficulty}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Easy">Easy</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Assign to Class (Optional)</Label>
                        <Select value={classId} onValueChange={setClassId}>
                            <SelectTrigger><SelectValue placeholder="All Classes" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Question</Label>
                        <Textarea value={questionText} onChange={e => setQuestionText(e.target.value)} placeholder="What is the powerhouse of the cell?" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {options.map((opt, i) => (
                            <Input key={i} value={opt} onChange={e => handleOptionChange(i, e.target.value)} placeholder={`Option ${i+1}`} />
                        ))}
                    </div>
                    <div className="space-y-2">
                        <Label>Correct Answer (Must match one option exactly)</Label>
                        <Input value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} placeholder="e.g. Mitochondria" />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Save Problem
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// --- Fact of the Day Component ---
function FactOfTheDay({ isStaff }: { isStaff: boolean }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [factText, setFactText] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const factsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'daily_facts'), orderBy('createdAt', 'desc'), limit(1)) : null, [firestore]);
    const { data: facts, isLoading } = useCollection<DailyFact>(factsQuery);
    const latestFact = facts?.[0];
    
    useEffect(() => {
        const generateNewFactIfNeeded = async () => {
          // FIX: Stop students from trying to write to the database
          if (!isStaff) return; 

          // ... existing generation logic ...
          console.log("Fact is stale or missing. Generating a new one...");
          try {
              const result = await generateDailyFact();
              await addDocumentNonBlocking(collection(firestore, 'daily_facts'), {
                  factText: result.fact,
                  createdAt: serverTimestamp(),
                  postedBy: user?.uid,
              });
              toast({ title: "New Fact of the Day Generated!" });
          } catch (error) {
              console.error("Failed to generate new fact:", error);
          }
        };
        
        if (!isLoading && !latestFact) {
            generateNewFactIfNeeded();
        }
      }, [latestFact, isLoading, isStaff, firestore, toast, user]); // Add isStaff to dependency array

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
                ) : <p className="text-muted-foreground text-sm">Generating today's fact...</p>}

                {isStaff && (
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
                    <Button onClick={() => setIsFormOpen(true)}><PlusCircle className="mr-2 h-4"/>New Problem</Button>
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

// --- MAIN PAGE COMPONENT ---
export default function ScienceClubPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { role, isRoleLoading } = useRole();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Filters
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);
  
  const { data: studentData, isLoading: isLoadingStudent } = useCollection<Student>(
    useMemoFirebase(() => {
        if (!user || !firestore || role !== 'Student') return null;
        return query(collection(firestore, 'students'), where('uid', '==', user.uid));
    }, [firestore, user, role])
  );
  
  const studentClassId = studentData?.[0]?.classId;
  
  const problemsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    if (isStaff) {
      return query(collection(firestore, 'science_problems'));
    }
    if (role === 'Student') {
        if (studentClassId) {
             return query(collection(firestore, 'science_problems'), where('classId', '==', studentClassId));
        }
        return null;
    }
    return null;
  }, [firestore, isStaff, role, studentClassId]);

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

  const isLoading = isUserLoading || isRoleLoading || isLoadingProblems || (role === 'Student' && isLoadingStudent);

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
            <FactOfTheDay isStaff={isStaff} />
        </CardContent>
      </Card>
      <Tabs defaultValue="practice">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="practice"><PencilRuler className="mr-2 h-4 w-4"/>Practice Hub</TabsTrigger>
          <TabsTrigger value="leaderboard"><Trophy className="mr-2 h-4 w-4"/>Leaderboard</TabsTrigger>
          {isStaff && <TabsTrigger value="manage">Manage Problems</TabsTrigger>}
        </TabsList>
        <TabsContent value="practice">
          <Card>
            <CardHeader>
                <CardTitle>Start a New Practice Session</CardTitle>
                <CardDescription>Select a topic and difficulty to begin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {(isLoading) ? (
                    <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin"/></div> 
                ) : 
                (role === 'Student' && !studentClassId) ? (
                    <div className="text-center space-y-2">
                        <p className="text-muted-foreground">We could not find your class assignment.</p>
                        <p className="text-xs text-red-500">Debug: User ID {user?.uid}</p>
                    </div>
                ) : 
                (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select onValueChange={setSelectedTopic}>
                                <SelectTrigger><SelectValue placeholder="Select a Topic" /></SelectTrigger>
                                <SelectContent>
                                    {uniqueTopics.map(topic => (
                                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={setSelectedDifficulty}>
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
                    <LeaderboardV2 />
                </CardContent>
            </Card>
        </TabsContent>
         {isStaff && (
            <TabsContent value="manage">
                <ManageProblems />
            </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
