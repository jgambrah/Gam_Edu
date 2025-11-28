
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
// All imports consolidated here.
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, where } from 'firebase/firestore';
import { 
  FlaskConical, Trophy, PencilRuler, PlusCircle, Loader2, 
  Trash2, Lightbulb, CheckCircle2 
} from 'lucide-react';
import { format } from 'date-fns';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Class, Student, ScienceProblem, DailyFact, ScienceLeaderboardEntry } from '@/lib/types';

// --- SUB-COMPONENT: Leaderboard ---
function LeaderboardV2() {
  const firestore = useFirestore();
  const leaderboardQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'science_leaderboard'), orderBy('total_correct_answers', 'desc')) : null,
    [firestore]
  );
  const { data: leaderboard, isLoading } = useCollection<ScienceLeaderboardEntry>(leaderboardQuery);

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
          <TableRow key={entry.userId || index}>
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
                            <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Biology" />
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
                        <Label>Correct Answer (Must match option)</Label>
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

// --- MAIN PAGE COMPONENT ---
export default function ScienceClubPageFresh() {
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

  // 1. Get Student Data (Safely)
  const { data: studentData, isLoading: isStudentLoading } = useCollection<Student>(
    useMemoFirebase(() => {
        if (!user || !firestore || role !== 'Student') return null;
        return query(collection(firestore, 'students'), where('uid', '==', user.uid));
    }, [user, role, firestore])
  );
  
  const studentClassId = studentData?.[0]?.classId;

  // 2. Get Classes (For Admin Dropdown)
  const { data: classes } = useCollection<Class>(
    useMemoFirebase(() => (isStaff && firestore) ? query(collection(firestore, 'classes')) : null, [isStaff, firestore])
  );

  // 3. Get Problems
  const problemsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'science_problems'));
  }, [firestore]);

  const { data: rawProblems, isLoading: isProblemsLoading } = useCollection<ScienceProblem>(problemsQuery);

  // 4. Process Data (Client-Side Filtering)
  const filteredProblems = useMemo(() => {
    if (!rawProblems) return [];
    
    // Filter for Students
    let list = rawProblems;
    if (role === 'Student') {
        list = rawProblems.filter(p => !p.classId || p.classId === 'all' || p.classId === studentClassId);
    }

    // Filter by UI Selections
    if (selectedTopic) list = list.filter(p => p.topic === selectedTopic);
    if (selectedDifficulty) list = list.filter(p => p.difficulty === selectedDifficulty);

    return list;
  }, [rawProblems, role, studentClassId, selectedTopic, selectedDifficulty]);

  const uniqueTopics = useMemo(() => {
      if(!rawProblems) return [];
      return Array.from(new Set(rawProblems.map(p => p.topic))).sort();
  }, [rawProblems]);

  // Loading State Calculation
  const isLoading = isUserLoading || isRoleLoading || isProblemsLoading || (role === 'Student' && isStudentLoading);

  const handleStart = () => {
      if (!selectedTopic || !selectedDifficulty) return;
      router.push(`/dashboard/science-club/practice?topic=${selectedTopic}&difficulty=${selectedDifficulty}`);
  };

  const handleDelete = async (id: string) => {
      if(!confirm("Delete this problem?")) return;
      try {
          await deleteDoc(doc(firestore, 'science_problems', id));
          toast({ title: "Deleted" });
      } catch(e) {
          toast({ variant: 'destructive', title: "Error", description: "Delete failed" });
      }
  }

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-green-500 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-green-600"/> 
            Science Club 3.0
          </CardTitle>
          <CardDescription>
            Explore the universe through science practice and competition.
          </CardDescription>
        </CardHeader>
        {/* Daily Facts Section Removed for Simplicity */}
      </Card>

      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="practice"><PencilRuler className="mr-2 h-4 w-4"/> Practice Hub</TabsTrigger>
          <TabsTrigger value="leaderboard"><Trophy className="mr-2 h-4 w-4"/> Leaderboard</TabsTrigger>
        </TabsList>

        {/* PRACTICE TAB */}
        <TabsContent value="practice">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle>Problem Library</CardTitle>
                        <CardDescription>Select filters to find problems.</CardDescription>
                    </div>
                    {isStaff && (
                        <Button onClick={() => setIsFormOpen(true)} size="sm">
                            <PlusCircle className="mr-2 h-4 w-4"/> Add Problem
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col items-center py-8 text-muted-foreground gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                            <p>Loading Science Lab...</p>
                        </div>
                    )}

                    {/* Student No Class State */}
                    {!isLoading && role === 'Student' && !studentClassId && (
                        <div className="p-4 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-md text-center">
                            <p className="font-semibold">Notice</p>
                            <p>You are not currently assigned to a class. You can only see global practice questions.</p>
                        </div>
                    )}

                    {/* Filters */}
                    {!isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border">
                            <div className="space-y-2">
                                <Label>Topic</Label>
                                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                                    <SelectTrigger><SelectValue placeholder="All Topics" /></SelectTrigger>
                                    <SelectContent>
                                        {uniqueTopics.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                                    <SelectTrigger><SelectValue placeholder="All Difficulties" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Results / Action */}
                    {!isLoading && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-slate-500">
                                    Found {filteredProblems.length} available problems.
                                </p>
                                <Button onClick={handleStart} disabled={filteredProblems.length === 0} className="bg-green-600 hover:bg-green-700">
                                    Start Practice Session
                                </Button>
                            </div>

                            {/* Staff View: Show Table of Problems to Manage */}
                            {isStaff && filteredProblems.length > 0 && (
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Topic</TableHead>
                                                <TableHead>Question</TableHead>
                                                <TableHead>Class</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredProblems.map(p => (
                                                <TableRow key={p.id}>
                                                    <TableCell><Badge variant="outline">{p.topic}</Badge></TableCell>
                                                    <TableCell className="max-w-[300px] truncate">{p.question_text}</TableCell>
                                                    <TableCell>{classes?.find(c => c.id === p.classId)?.name || 'All'}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}>
                                                            <Trash2 className="h-4 w-4 text-red-500"/>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        {/* LEADERBOARD TAB */}
        <TabsContent value="leaderboard">
            <Card>
                <CardHeader>
                    <CardTitle>Top Scientists</CardTitle>
                    <CardDescription>Global ranking based on correct answers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <LeaderboardV2 />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      {/* Add Problem Modal */}
      {isFormOpen && (
          <AddScienceProblemForm 
            open={isFormOpen} 
            setOpen={setIsFormOpen} 
            classes={classes} 
          />
      )}
    </div>
  );
}
