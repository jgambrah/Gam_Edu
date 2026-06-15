
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, where, setDoc, increment, limit } from 'firebase/firestore';
import { 
  Sigma, Trophy, PencilRuler, Plus, Loader2, 
  Trash2, Lightbulb, CheckCircle2, Wand2, XCircle, FolderOpen, Play, BookOpen, Microscope, Sparkles, Atom, Database, PlusCircle, PenSquare
} from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { generateMathLessonAction, GeneratedMathLesson } from '@/ai/flows/generate-math-lesson';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import ReactMarkdown from 'react-markdown';


// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Class, Student, MathProblem, mathProblemSchema, GlobalLeaderboardEntry } from '@/lib/types';
import { AiProblemGenerator } from '../ai-problem-generator';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useCurrentSchool } from '@/hooks/use-current-school';

const cleanLatex = (formula: string = "") => {
  if (!formula) return "";
  return formula
    .replace(/\$\$/g, '')      // Remove $$
    .replace(/\$/g, '')        // Remove $
    .replace(/\\\[/g, '')      // Remove \[
    .replace(/\\\]/g, '')      // Remove \]
    .replace(/\\begin\{equation\}/g, '') // Remove equation blocks
    .replace(/\\end\{equation\}/g, '')
    .trim();
};

function SafeMath({ formula, block = true }: { formula: string, block?: boolean }) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration errors by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-10 w-full animate-pulse bg-slate-100 rounded" />;

  const cleaned = cleanLatex(formula);

  try {
    return block ? (
      <div className="math-container py-2 overflow-x-auto">
        <BlockMath math={cleaned} />
      </div>
    ) : (
      <InlineMath math={cleaned} />
    );
  } catch (error) {
    console.error("LaTeX Error:", error);
    return <code className="text-red-500">{formula}</code>;
  }
}

interface LessonCard extends GeneratedMathLesson {
    id?: string;
    timestamp?: any;
}

// --- SUB-COMPONENT: MATH EXPLORER ---
function MathExplorerTab() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    const [topic, setTopic] = useState('');
    const [isLearning, setIsLearning] = useState(false);
    const [currentLesson, setCurrentLesson] = useState<LessonCard | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    // Fetch History
    const historyQuery = useMemoFirebase(() => 
        (user && firestore) ? query(collection(firestore, 'math_learning_history'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'), limit(10)) : null,
    [user, firestore]);
    const { data: history, isLoading: historyLoading } = useCollection<LessonCard>(historyQuery);

    const handleLearn = async () => {
        if (!topic.trim() || !schoolId) return;
        setIsLearning(true);
        setShowAnswer(false);
        setCurrentLesson(null);

        try {
            const result = await generateMathLessonAction({ topic, grade: 'JHS 1', schoolId });
            
            if (result.success && result.data) {
                setCurrentLesson(result.data);
                if(user && firestore) {
                    await addDoc(collection(firestore, 'math_learning_history'), {
                        ...result.data,
                        userId: user.uid,
                        timestamp: serverTimestamp()
                    });
                }
            } else {
                toast({ variant: 'destructive', title: "AI Error", description: result.error || "Could not generate lesson." });
            }
        } catch (e: any) {
             toast({ variant: 'destructive', title: "Error", description: e.message || "Something went wrong." });
        } finally {
            setIsLearning(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100">
                    <CardHeader>
                        <CardTitle className="text-orange-800 flex items-center gap-2"><Microscope className="h-5 w-5"/> What do you want to learn today?</CardTitle>
                        <CardDescription>Type any math topic (e.g. "Pythagorean Theorem", "Fractions", "Algebra")</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter a topic..." className="bg-white" onKeyDown={(e) => e.key === 'Enter' && handleLearn()}/>
                            <Button onClick={handleLearn} disabled={isLearning || !topic} className="bg-orange-600 hover:bg-orange-700 w-32">
                                {isLearning ? <Loader2 className="h-4 w-4 animate-spin"/> : <><Sparkles className="h-4 w-4 mr-2"/> Learn</>}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {currentLesson && (
                    <Card className="border-t-4 border-t-orange-500 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardHeader>
                            <CardTitle className="text-2xl">{currentLesson.title}</CardTitle>
                            <CardDescription>Micro-Lesson</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 prose prose-slate max-w-none">
                            <div>
                                <h4 className="font-semibold text-orange-700 mb-1">The Concept</h4>
                                <ReactMarkdown
                                  components={{
                                    p: ({node, ...props}) => <p className="text-slate-700 leading-relaxed" {...props} />,
                                    code({node, inline, className, children, ...props}: any) {
                                      if (!inline) {
                                        return <SafeMath formula={String(children)} block={true}/>
                                      }
                                      return <SafeMath formula={String(children)} block={false} />
                                    }
                                  }}
                                >
                                    {currentLesson.explanation}
                                </ReactMarkdown>
                            </div>
                            
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                <h4 className="font-semibold text-amber-800 mb-1 flex items-center gap-2 not-prose"><Lightbulb className="h-4 w-4"/> Example</h4>
                                <ReactMarkdown
                                  components={{
                                    p: ({node, ...props}) => <p className="text-slate-700 italic" {...props} />,
                                    code({node, inline, className, children, ...props}: any) {
                                      return <SafeMath formula={String(children)} block={!inline} />
                                    }
                                  }}
                                >
                                    {currentLesson.example}
                                </ReactMarkdown>
                            </div>

                            <div>
                                <h4 className="font-semibold text-slate-700 mb-2 not-prose">Key Terms / Formulas</h4>
                                <div className="flex flex-wrap gap-2">
                                    {currentLesson.keyTerms.map((term, i) => (
                                        <div key={i} className="text-sm p-2 bg-slate-100 rounded-md border">
                                            <SafeMath formula={term} block={false} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4 border-t not-prose">
                                <h4 className="font-semibold text-slate-700 mb-2">Quick Check</h4>
                                <div className="mb-3">
                                   <ReactMarkdown
                                      components={{
                                        p: ({node, ...props}) => <p className="font-medium" {...props} />,
                                        code({node, inline, className, children, ...props}: any) {
                                          return <SafeMath formula={String(children)} block={!inline} />
                                        }
                                      }}
                                    >
                                        {currentLesson.quizQuestion}
                                    </ReactMarkdown>
                                </div>
                                {showAnswer ? (
                                    <div className="p-3 bg-green-50 text-green-800 rounded border border-green-200">
                                        <strong>Answer:</strong> {currentLesson.quizAnswer}
                                    </div>
                                ) : (
                                    <Button variant="outline" onClick={() => setShowAnswer(true)}>Reveal Answer</Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
            <div>
                 <Card className="h-full max-h-[600px] flex flex-col">
                    <CardHeader className="pb-3"><CardTitle className="text-md">Your Learning History</CardTitle></CardHeader>
                    <CardContent className="p-0 flex-1 min-h-0 overflow-hidden">
                        <div className="h-full overflow-y-auto p-4 space-y-3">
                            {historyLoading && <Skeleton className="h-20 w-full"/>}
                            {!historyLoading && history?.length === 0 && <p className="text-sm text-muted-foreground text-center">No lessons yet.</p>}
                            {history?.map((item) => (
                                <div key={item.id} onClick={() => { setCurrentLesson(item); setShowAnswer(false); }} className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors text-sm">
                                    <p className="font-semibold text-slate-800">{item.title}</p>
                                    <p className="text-xs text-muted-foreground truncate">{item.example}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 text-right">
                                        {item.timestamp?.toDate ? format(item.timestamp.toDate(), 'MMM d, h:mm a') : 'Just now'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                 </Card>
            </div>
        </div>
    );
}

// --- SUB-COMPONENT: Leaderboard ---
function Leaderboard() {
    const firestore = useFirestore();
    const leaderboardQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'global_leaderboard'), orderBy('total_correct_answers', 'desc')) : null,
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

// --- SUB-COMPONENT: Problem Creation ---
function ProblemCreationForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { schoolId } = useCurrentSchool();

    const { data: classes } = useCollection<Class>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));

    const form = useForm<z.infer<typeof mathProblemSchema>>({
        resolver: zodResolver(mathProblemSchema),
        defaultValues: {
            difficulty: 'Easy',
            options: ['', '', '', ''],
            classId: '',
        }
    });

    async function onSubmit(values: z.infer<typeof mathProblemSchema>) {
        if (!schoolId || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not determine school ID or database connection.' });
            return;
        }
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'math_problems'), { ...values, schoolId });
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

    const questionText = form.watch('question_text');

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
                        <FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g. Algebra" {...field}/></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="difficulty" render={({ field }) => (
                        <FormItem><FormLabel>Difficulty</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                    )}/>
                </div>
                <FormField 
                    control={form.control} 
                    name="question_text" 
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question Text</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter text or LaTeX (e.g. \\frac{1}{2})" {...field}/>
                            </FormControl>
                            {field.value && (
                                <div className="mt-2 p-4 bg-slate-900 rounded-xl text-emerald-400">
                                    <p className="text-[10px] uppercase font-black mb-2 text-slate-500">Live LaTeX Preview</p>
                                    <SafeMath formula={field.value} />
                                </div>
                            )}
                            <FormMessage/>
                        </FormItem>
                    )}
                />
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

// --- SUB-COMPONENT: Problem Management ---
function ManageProblems() {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { data: problems, isLoading } = useCollection<MathProblem>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'math_problems'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAiFormOpen, setIsAiFormOpen] = useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Problem Bank</CardTitle>
                    <CardDescription>Manage the collection of math problems for student practice sessions.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isAiFormOpen} onOpenChange={setIsAiFormOpen}>
                        <DialogTrigger asChild><Button variant="outline"><Wand2 className="mr-2 h-4"/>Generate with AI</Button></DialogTrigger>
                        <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>AI Problem Generator</DialogTitle><DialogDescription>Generate multiple-choice questions for any topic.</DialogDescription></DialogHeader><AiProblemGenerator subject="Math" setOpen={setIsAiFormOpen} /></DialogContent>
                    </Dialog>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4"/>New Problem</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Create New Math Problem</DialogTitle><DialogDescription>Add a new question to the problem bank.</DialogDescription></DialogHeader>
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
                                <TableCell className="font-bold">{p.topic}</TableCell>
                                <TableCell><Badge variant="outline">{p.difficulty}</Badge></TableCell>
                                <TableCell className="max-w-md">
                                    <div className="text-xs">
                                        <SafeMath formula={p.question_text} block={false} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
    )
}

// --- MAIN PAGE ---
export default function MathsClubPage() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const router = useRouter();
  const { role, loading: isRoleLoading } = useRole();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();

  const isTeacherOrAdmin = role === 'Teacher' || role === 'Administrator' || role === 'Director';

  const { data: studentData, isLoading: isLoadingStudent } = useCollection<Student>(
    useMemoFirebase(() => {
      if (!user || !firestore || role !== 'Student' || !schoolId) return null;
      return query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId));
    }, [firestore, user, role, schoolId])
  );
  
  const studentInfo = studentData?.[0]; 
  const studentClassId = studentInfo?.classId;
  
  const problemsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    let baseQuery = query(collection(firestore, 'math_problems'), where('schoolId', '==', schoolId));
    
    if (role === 'Student') {
        if (studentClassId) {
             return query(baseQuery, where('classId', '==', studentClassId));
        }
        return null;
    }
    return baseQuery;
  }, [firestore, isTeacherOrAdmin, role, studentClassId, schoolId]);

  const { data: problems, isLoading: isLoadingProblems } = useCollection<MathProblem>(problemsQuery);
  
  const uniqueTopics = useMemo(() => {
    if (!problems) return [];
    const topics = new Set(problems.map(p => p.topic));
    return Array.from(topics);
  }, [problems]);

  const handleStartPractice = () => {
    if (selectedTopic && selectedDifficulty) {
      router.push(`/dashboard/maths-club/practice?topic=${selectedTopic}&difficulty=${selectedDifficulty}`);
    }
  };

  const isLoading = isAuthLoading || isRoleLoading || isLoadingProblems || (role === 'Student' && isLoadingStudent);

  return (
    <>
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
          <TabsList className={cn("grid w-full", isTeacherOrAdmin ? "grid-cols-4" : "grid-cols-3")}>
            <TabsTrigger value="practice"><PencilRuler className="mr-2 h-4 w-4"/>Practice Hub</TabsTrigger>
            <TabsTrigger value="learn">Math Explorer</TabsTrigger>
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
                              <Select onValueChange={setSelectedTopic} value={selectedTopic}>
                                  <SelectTrigger><SelectValue placeholder="Select a Topic" /></SelectTrigger>
                                  <SelectContent>
                                      {uniqueTopics.map(topic => (
                                          <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                              <Select onValueChange={setSelectedDifficulty} value={selectedDifficulty}>
                                  <SelectTrigger><SelectValue placeholder="Select Difficulty" /></SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="Easy">Easy</SelectItem>
                                      <SelectItem value="Medium">Medium</SelectItem>
                                      <SelectItem value="Hard">Hard</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                          <Button onClick={handleStartPractice} disabled={!selectedTopic || !selectedDifficulty} className="w-full">
                              Start Practice
                          </Button>
                      </>
                  )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="learn" className="mt-6">
              <MathExplorerTab />
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
    </>
  );
}
