'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, where, setDoc, increment, limit } from 'firebase/firestore';
import { 
  Sigma, Trophy, PencilRuler, Plus, Loader2, 
  Trash2, Lightbulb, CheckCircle2, Wand2, XCircle, FolderOpen, Play, BookOpen, Microscope, Sparkles, Atom, Database, PlusCircle, PenSquare,
  Rocket, Brain, History, Award, Zap, ChevronRight, GraduationCap
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
import { awardActivityXP } from '@/lib/achievement-utils';
import { AiProblemGenerator } from '../ai-problem-generator';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useCurrentSchool } from '@/hooks/use-current-school';
import CreditBalance from '@/components/CreditBalance';

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

  // Prevent hydration errors by rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-10 w-full animate-pulse bg-slate-900/40 rounded-xl" />;

  const cleaned = cleanLatex(formula);

  try {
    return block ? (
      <div className="math-container py-3 px-4 bg-slate-950/70 border border-slate-900 rounded-xl my-2 overflow-x-auto text-emerald-400 font-mono text-center">
        <BlockMath math={cleaned} />
      </div>
    ) : (
      <span className="text-emerald-400 font-semibold inline-block px-1">
        <InlineMath math={cleaned} />
      </span>
    );
  } catch (error) {
    console.error("LaTeX Error:", error);
    return <code className="text-red-400 font-mono text-xs">{formula}</code>;
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
                    await awardActivityXP(firestore, user.uid, 40, 'Maths Exploration', 'stem_explorer');
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                    <CardHeader className="px-0 pt-0 pb-4">
                        <CardTitle className="text-2xl font-black text-white flex items-center gap-2">
                          <Microscope className="h-6 w-6 text-emerald-400"/> Interactive Math Explorer
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          Enter any mathematical topic or concept (e.g. Pythagorean Theorem, Trigonometry, Fractions) to generate an AI-guided micro-lesson.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                        <div className="flex gap-3">
                            <Input 
                              value={topic} 
                              onChange={(e) => setTopic(e.target.value)} 
                              placeholder="e.g. Quadratic Equations, Fractions, Algebra..." 
                              className="bg-slate-950/80 border-slate-850 text-slate-100 placeholder:text-slate-500 focus-visible:ring-emerald-500 rounded-xl h-12" 
                              onKeyDown={(e) => e.key === 'Enter' && handleLearn()}
                            />
                            <Button 
                              onClick={handleLearn} 
                              disabled={isLearning || !topic} 
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 font-bold px-6 rounded-xl h-12 transition-all duration-300"
                            >
                                {isLearning ? <Loader2 className="h-5 w-5 animate-spin"/> : <><Sparkles className="h-4 w-4 mr-2 text-white fill-white"/> Synthesize</>}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {currentLesson && (
                    <Card className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-white rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-slate-950/80 border-b border-slate-900/60 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                <span className="text-xs font-mono text-slate-500 ml-2">matrix_lesson_compiler_v1.0.sh</span>
                            </div>
                            <span className="text-xs uppercase font-black tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">Lesson Loaded</span>
                        </div>
                        
                        <CardHeader className="px-6 pt-6 pb-2">
                            <CardTitle className="text-3xl font-black text-white leading-tight">{currentLesson.title}</CardTitle>
                            <CardDescription className="text-slate-400 flex items-center gap-1.5 mt-1">
                              <BookOpen className="w-3.5 h-3.5" /> Quantum Micro-Lesson
                            </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="px-6 py-4 space-y-8">
                            {/* Concept explanation */}
                            <div className="space-y-3">
                                <h4 className="text-xs uppercase font-black tracking-wider text-slate-500">The Core Concept</h4>
                                <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-6 text-slate-200 leading-relaxed font-sans text-[15px] space-y-4">
                                    <ReactMarkdown
                                      components={{
                                        p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed" {...props} />,
                                        code({node, inline, children}: any) {
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
                            </div>
                            
                            {/* Example */}
                            <div className="space-y-3">
                                <h4 className="text-xs uppercase font-black tracking-wider text-slate-500">Interactive Example</h4>
                                <div className="bg-emerald-950/10 border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden space-y-3">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none"></div>
                                    <h4 className="font-black text-emerald-300 text-sm flex items-center gap-2"><Lightbulb className="h-4.5 w-4.5 text-emerald-400 animate-pulse"/> Worked Calculation</h4>
                                    <div className="text-slate-300 leading-relaxed text-[15px] italic">
                                        <ReactMarkdown
                                          components={{
                                            p: ({node, ...props}) => <p className="text-slate-300" {...props} />,
                                            code({node, inline, children}: any) {
                                              return <SafeMath formula={String(children)} block={!inline} />
                                            }
                                          }}
                                        >
                                            {currentLesson.example}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>

                            {/* Key Terms / Formulas */}
                            <div className="space-y-3">
                                <h4 className="text-xs uppercase font-black tracking-wider text-slate-500">Key Formulations</h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {currentLesson.keyTerms.map((term, i) => (
                                        <div key={i} className="text-sm px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-center font-mono text-emerald-400 shadow-inner">
                                            <SafeMath formula={term} block={false} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Quiz Check */}
                            <div className="pt-6 border-t border-slate-800 space-y-4">
                                <h4 className="text-xs uppercase font-black tracking-wider text-slate-500">Diagnostic Quick Check</h4>
                                <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-6 space-y-4">
                                    <div className="text-slate-200 text-md font-bold leading-snug">
                                       <ReactMarkdown
                                          components={{
                                            p: ({node, ...props}) => <p className="font-semibold text-slate-200" {...props} />,
                                            code({node, inline, children}: any) {
                                              return <SafeMath formula={String(children)} block={!inline} />
                                            }
                                          }}
                                        >
                                            {currentLesson.quizQuestion}
                                        </ReactMarkdown>
                                    </div>
                                    
                                    {showAnswer ? (
                                        <div className="p-4 bg-emerald-950/25 text-emerald-300 rounded-xl border border-emerald-500/20 font-bold text-sm animate-in fade-in zoom-in-95 duration-300">
                                            <span className="text-[10px] uppercase font-black text-emerald-500 tracking-wider block mb-1">Correct Answer Matrix</span>
                                            {currentLesson.quizAnswer}
                                        </div>
                                    ) : (
                                        <Button 
                                          variant="outline" 
                                          onClick={() => setShowAnswer(true)}
                                          className="bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:text-white text-slate-300 rounded-xl"
                                        >
                                          De-encrypt Answer Matrix
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
            
            {/* Sidebar history */}
            <div>
                 <Card className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-white rounded-3xl shadow-2xl relative overflow-hidden h-full max-h-[600px] flex flex-col">
                    <CardHeader className="pb-3 border-b border-slate-800/60">
                        <CardTitle className="text-md font-black flex items-center gap-2">
                          <History className="w-4 h-4 text-emerald-400" /> Synthesize Logs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 min-h-0 overflow-hidden">
                        <div className="h-full overflow-y-auto p-4 space-y-3">
                            {historyLoading && (
                              <div className="space-y-3 py-4">
                                <Skeleton className="h-20 w-full bg-slate-800/50 rounded-xl" />
                                <Skeleton className="h-20 w-full bg-slate-800/50 rounded-xl" />
                              </div>
                            )}
                            {!historyLoading && history?.length === 0 && (
                              <div className="text-center py-12 text-slate-500">
                                <FolderOpen className="h-8 w-8 mx-auto mb-2 text-slate-700" />
                                <p className="text-xs">No previous compile logs.</p>
                              </div>
                            )}
                            {history?.map((item) => (
                                <div 
                                  key={item.id} 
                                  onClick={() => { setCurrentLesson(item); setShowAnswer(false); }} 
                                  className="p-4 border border-slate-850 rounded-xl hover:bg-slate-800/40 hover:border-slate-750 cursor-pointer transition-all duration-200 text-sm group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <p className="font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">{item.title}</p>
                                    <p className="text-xs text-slate-500 truncate mt-1">{item.example}</p>
                                    <p className="text-[10px] text-slate-600 mt-2 text-right">
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
            <div className="space-y-4 py-6">
                <Skeleton className="h-14 w-full bg-slate-900 rounded-xl" />
                <Skeleton className="h-14 w-full bg-slate-900 rounded-xl" />
                <Skeleton className="h-14 w-full bg-slate-900 rounded-xl" />
            </div>
        )
    }

    if (!leaderboard || leaderboard.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500">
                <Trophy className="h-12 w-12 text-slate-800 mx-auto mb-3" />
                <h4 className="text-md font-bold text-slate-400">Leaderboard is Empty</h4>
                <p className="text-xs">Start practicing to appear on the global leaderboard!</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-500 font-bold uppercase tracking-wider text-xs w-20 text-center">Rank</TableHead>
                        <TableHead className="text-slate-500 font-bold uppercase tracking-wider text-xs">Student</TableHead>
                        <TableHead className="text-slate-500 font-bold uppercase tracking-wider text-xs text-right">Correct Answers</TableHead>
                        <TableHead className="text-slate-500 font-bold uppercase tracking-wider text-xs text-right">Quizzes Completed</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leaderboard?.map((entry, index) => {
                        const isTop3 = index < 3;
                        const rankStyles = [
                          "bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]", // Gold
                          "bg-slate-400/10 border border-slate-400/30 text-slate-355 text-slate-300 shadow-[0_0_10px_rgba(148,163,184,0.15)]", // Silver
                          "bg-orange-500/10 border border-orange-500/30 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.15)]", // Bronze
                        ];
                        
                        return (
                            <TableRow key={entry.userId} className="border-b border-slate-900/60 hover:bg-slate-900/30 transition-colors">
                                <TableCell className="py-4">
                                    {isTop3 ? (
                                        <div className={cn(
                                          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mx-auto animate-pulse",
                                          rankStyles[index]
                                        )}>
                                            {index + 1}
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-slate-500 mx-auto">
                                            {index + 1}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="py-4 font-semibold text-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black uppercase text-slate-350 bg-slate-950 border border-slate-850",
                                          index === 0 && "border-amber-500/50 text-amber-400",
                                          index === 1 && "border-slate-400/50 text-slate-300",
                                          index === 2 && "border-orange-500/50 text-orange-400"
                                        )}>
                                            {entry.userName.slice(0, 2)}
                                        </div>
                                        <span>{entry.userName}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right py-4">
                                    <span className={cn(
                                      "font-mono font-bold text-md",
                                      index === 0 && "text-amber-400",
                                      index === 1 && "text-slate-300",
                                      index === 2 && "text-orange-400",
                                      index > 2 && "text-emerald-400"
                                    )}>
                                        {entry.total_correct_answers}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right py-4 font-mono text-slate-400">{entry.total_quizzes_completed}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 text-slate-200">
                 <FormField control={form.control} name="classId" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black tracking-wider text-slate-400">Assign to Class Matrix</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-950 border-slate-900 text-slate-200 focus-visible:ring-indigo-500 rounded-xl h-11">
                              <SelectValue placeholder="Select a class"/>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-950 border-slate-900 text-slate-200">
                            {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-400 text-xs"/>
                    </FormItem>
                )}/>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="topic" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-black tracking-wider text-slate-400">Topic Area</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Algebra, Geometry" className="bg-slate-950 border-slate-900 text-slate-200 focus-visible:ring-indigo-500 rounded-xl h-11" {...field}/>
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs"/>
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="difficulty" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase font-black tracking-wider text-slate-400">Difficulty Scale</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-slate-950 border-slate-900 text-slate-200 focus-visible:ring-indigo-500 rounded-xl h-11">
                                <SelectValue/>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-950 border-slate-900 text-slate-200">
                              <SelectItem value="Easy">Easy</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-400 text-xs"/>
                        </FormItem>
                    )}/>
                </div>
                <FormField 
                    control={form.control} 
                    name="question_text" 
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[10px] uppercase font-black tracking-wider text-slate-400">Question Formulation</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter text or LaTeX (e.g. \frac{1}{2} x = 4)" className="bg-slate-950 border-slate-900 text-slate-200 focus-visible:ring-indigo-500 rounded-xl min-h-[100px]" {...field}/>
                            </FormControl>
                            {field.value && (
                                <div className="mt-2 p-4 bg-slate-955 border border-slate-900 rounded-xl text-emerald-400 bg-slate-950">
                                    <p className="text-[9px] uppercase font-black mb-2 text-slate-500 tracking-wider">Live LaTeX Interpreter Output</p>
                                    <SafeMath formula={field.value} />
                                </div>
                            )}
                            <FormMessage className="text-red-400 text-xs"/>
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    {form.getValues('options').map((_, index) => (
                        <FormField key={index} control={form.control} name={`options.${index}`} render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase font-black tracking-wider text-slate-400">Option Matrix {index + 1}</FormLabel>
                              <FormControl>
                                <Input className="bg-slate-950 border-slate-900 text-slate-200 focus-visible:ring-indigo-500 rounded-xl h-11" {...field}/>
                              </FormControl>
                              <FormMessage className="text-red-400 text-xs"/>
                            </FormItem>
                        )}/>
                    ))}
                </div>
                 <FormField control={form.control} name="correct_answer" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black tracking-wider text-slate-400">Target Correct Answer</FormLabel>
                      <FormControl>
                        <Input className="bg-slate-950 border-slate-900 text-slate-200 focus-visible:ring-indigo-500 rounded-xl h-11" {...field}/>
                      </FormControl>
                      <FormDescription className="text-slate-500 text-[10px]">Must match one of the defined option matrices exactly.</FormDescription>
                      <FormMessage className="text-red-400 text-xs"/>
                    </FormItem>
                )}/>
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-bold h-12 w-full rounded-xl mt-2 shadow-lg shadow-indigo-500/25">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Inject Problem Unit
                </Button>
            </form>
        </Form>
    );
}

// --- SUB-COMPONENT: Problem Management ---
function ManageProblems() {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();
    const { data: problems, isLoading } = useCollection<MathProblem>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'math_problems'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAiFormOpen, setIsAiFormOpen] = useState(false);

    const handleDeleteProblem = async (problemId: string) => {
        if (!firestore || !problemId) return;
        if (!confirm("Are you sure you want to permanently delete this math problem?")) return;
        try {
            await deleteDoc(doc(firestore, 'math_problems', problemId));
            toast({ title: 'Success', description: 'Math problem successfully deleted from bank.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the problem.' });
        }
    };

    return (
        <Card className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-0 pt-0 pb-6 border-b border-slate-850">
                <div>
                    <CardTitle className="text-2xl font-black text-white flex items-center gap-2">
                      <Database className="h-6 w-6 text-indigo-400" /> Problem Matrix Bank
                    </CardTitle>
                    <CardDescription className="text-slate-400">Manage mathematical challenge units for practice simulator sessions.</CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Dialog open={isAiFormOpen} onOpenChange={setIsAiFormOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="bg-slate-950 border-slate-850 hover:bg-slate-900 hover:text-white text-indigo-300 font-bold rounded-xl flex-1 sm:flex-none">
                            <Wand2 className="mr-2 h-4 w-4 text-indigo-400 animate-pulse"/> Generate with AI
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-slate-950 border-slate-900 text-white rounded-3xl">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-black text-white">AI Problem Generator</DialogTitle>
                            <DialogDescription className="text-slate-400">Generate high-fidelity multiple-choice questions for math.</DialogDescription>
                          </DialogHeader>
                          <AiProblemGenerator subject="Math" setOpen={setIsAiFormOpen} />
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-lg shadow-indigo-500/20 font-bold rounded-xl flex-1 sm:flex-none">
                            <PlusCircle className="mr-2 h-4 w-4"/> New Problem
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-950 border-slate-900 text-white rounded-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-black text-white">Create New Math Problem</DialogTitle>
                              <DialogDescription className="text-slate-400">Add a manually formulated challenge structure to the bank.</DialogDescription>
                            </DialogHeader>
                            <ProblemCreationForm setOpen={setIsFormOpen}/>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="px-0 py-4">
                {isLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-455 text-indigo-400 mb-2"/>
                    <span className="text-slate-500 text-xs">Accessing problem vault...</span>
                  </div>
                ) : !problems || problems.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                    <FolderOpen className="h-10 w-10 text-slate-700 mx-auto mb-2" />
                    <p className="text-sm font-semibold">No problems in bank</p>
                    <p className="text-xs text-slate-500 mt-1">Use the AI Generator or create a manual problem above to start.</p>
                  </div>
                ) : (
                <div className="overflow-x-auto">
                  <Table>
                      <TableHeader>
                          <TableRow className="border-b border-slate-800 hover:bg-transparent">
                              <TableHead className="text-slate-550 text-slate-400 font-bold uppercase tracking-wider text-xs">Topic</TableHead>
                              <TableHead className="text-slate-550 text-slate-400 font-bold uppercase tracking-wider text-xs">Difficulty</TableHead>
                              <TableHead className="text-slate-550 text-slate-400 font-bold uppercase tracking-wider text-xs">Question Formulation</TableHead>
                              <TableHead className="text-slate-555 text-slate-400 font-bold uppercase tracking-wider text-xs text-center w-20">Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {problems?.map(p => {
                              const badgeStyles: Record<string, string> = {
                                Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                                Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                                Hard: "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              };
                              return (
                                  <TableRow key={p.id} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-colors">
                                      <TableCell className="font-bold text-slate-200 py-4">{p.topic}</TableCell>
                                      <TableCell className="py-4">
                                          <Badge className={cn("border", badgeStyles[p.difficulty] || "bg-slate-500/10 text-slate-400")}>{p.difficulty}</Badge>
                                      </TableCell>
                                      <TableCell className="max-w-md py-4 text-slate-300">
                                          <div className="text-xs break-words">
                                              <SafeMath formula={p.question_text} block={false} />
                                          </div>
                                      </TableCell>
                                      <TableCell className="py-4 text-center">
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => handleDeleteProblem(p.id)} 
                                            className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                          >
                                              <Trash2 className="h-4.5 w-4.5" />
                                          </Button>
                                      </TableCell>
                                  </TableRow>
                              );
                          })}
                      </TableBody>
                  </Table>
                </div>
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
  
  // Custom user diagnostic query
  const myLeaderboardQuery = useMemoFirebase(() =>
    (user && firestore) ? query(collection(firestore, 'global_leaderboard'), where('userId', '==', user.uid)) : null,
    [user, firestore]
  );
  const { data: myLeaderboardData } = useCollection<GlobalLeaderboardEntry>(myLeaderboardQuery);
  const myLeaderboard = myLeaderboardData?.[0];

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
    <div className="space-y-8 p-6 bg-slate-950 text-slate-100 rounded-3xl min-h-screen relative overflow-hidden border border-slate-900 shadow-2xl">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Cosmic Hero Header Banner */}
      <Card className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-[36px] shadow-2xl relative overflow-hidden border-b-8 border-emerald-500/20 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full rotate-45 pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full rotate-45 pointer-events-none"></div>
          
          <div className="flex items-center gap-6 z-10">
              <div className="bg-emerald-500/10 backdrop-blur-md p-4 rounded-3xl border border-emerald-500/20 shadow-lg hover:rotate-12 transition-transform duration-300">
                  <Sigma className="h-14 w-14 text-emerald-400 animate-pulse" />
              </div>
              <div>
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-2">
                      Maths Club <Sparkles className="w-7 h-7 text-emerald-400 animate-pulse" />
                  </h1>
                  <p className="text-slate-300/80 font-semibold text-base mt-2 max-w-xl leading-relaxed">
                      Welcome to the Quantum Math Arena! Synthesize AI-guided lessons, formulate challenge units, and conquer the global rankings.
                  </p>
              </div>
          </div>

          <div className="z-10 bg-slate-900/60 backdrop-blur-md border border-slate-800 p-4 rounded-2xl shadow-inner min-w-[200px] flex justify-center items-center">
              <CreditBalance />
          </div>
      </Card>

      <Tabs defaultValue="practice" className="w-full">
          <TabsList className={cn("grid w-full h-16 bg-slate-900 p-2 rounded-2xl border border-slate-800/80 mb-8", isTeacherOrAdmin ? "grid-cols-4" : "grid-cols-3")}>
            <TabsTrigger 
              value="practice"
              className={cn(
                "h-full rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all duration-300",
                "data-[state=active]:bg-gradient-to-b data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/20",
                "text-slate-400 hover:text-slate-200"
              )}
            >
              <PencilRuler className="h-4 w-4"/> Practice Hub
            </TabsTrigger>
            <TabsTrigger 
              value="learn"
              className={cn(
                "h-full rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all duration-300",
                "data-[state=active]:bg-gradient-to-b data-[state=active]:from-teal-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-teal-500/20",
                "text-slate-400 hover:text-slate-200"
              )}
            >
              <BookOpen className="h-4 w-4"/> Math Explorer
            </TabsTrigger>
            <TabsTrigger 
              value="leaderboard"
              className={cn(
                "h-full rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all duration-300",
                "data-[state=active]:bg-gradient-to-b data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/20",
                "text-slate-400 hover:text-slate-200"
              )}
            >
              <Trophy className="h-4 w-4"/> Leaderboard
            </TabsTrigger>
            {isTeacherOrAdmin && (
              <TabsTrigger 
                value="manage"
                className={cn(
                  "h-full rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all duration-300",
                  "data-[state=active]:bg-gradient-to-b data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20",
                  "text-slate-400 hover:text-slate-200"
                )}
              >
                <Database className="h-4 w-4"/> Manage Problems
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="practice" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Practice Setup */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                  <CardHeader className="px-0 pt-0 pb-6">
                    <CardTitle className="text-2xl font-black text-white flex items-center gap-2">
                      <Brain className="h-6 w-6 text-emerald-400 animate-pulse" /> Start Practice Simulation
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Configure your math simulation matrices below. Choose a training topic and difficulty scale.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 space-y-6">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-12 space-y-3">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                        <p className="text-xs text-slate-505 text-slate-400 animate-pulse">Initializing practice algorithms...</p>
                      </div>
                    ) : (role === 'Student' && !studentClassId) ? (
                      <div className="text-center py-8 px-4 border border-dashed border-red-500/20 rounded-2xl bg-red-950/10">
                        <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3 animate-bounce" />
                        <h4 className="text-md font-bold text-red-200">Class Assignment Required</h4>
                        <p className="text-xs text-slate-400 mt-1">We couldn't locate your student profile or class assignment. Please contact your instructor.</p>
                        <p className="text-[10px] text-red-500 mt-2 font-mono">UID: {user?.uid}</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Topic Selector */}
                        <div className="space-y-3">
                          <label className="text-sm font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Select Training Topic
                          </label>
                          {uniqueTopics.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {uniqueTopics.slice(0, 6).map(topic => {
                                const isSelected = selectedTopic === topic;
                                return (
                                  <button
                                    key={topic}
                                    type="button"
                                    onClick={() => setSelectedTopic(topic)}
                                    className={cn(
                                      "p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-28 relative overflow-hidden group",
                                      isSelected 
                                        ? "bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]" 
                                        : "bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                                    )}
                                  >
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                                    <Sigma className={cn("h-6 w-6 mb-2", isSelected ? "text-emerald-400 animate-pulse" : "text-slate-655 text-slate-500 group-hover:text-slate-400")} />
                                    <span className="font-bold text-sm truncate w-full">{topic}</span>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-slate-550 border border-dashed border-slate-850 rounded-2xl bg-slate-950/30">
                              <FolderOpen className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                              <p className="text-sm">No topics available in your class bank yet.</p>
                            </div>
                          )}

                          {/* Secondary Select if topics count is very high */}
                          {uniqueTopics.length > 6 && (
                            <div className="mt-3">
                              <Select onValueChange={setSelectedTopic} value={selectedTopic}>
                                <SelectTrigger className="bg-slate-950/80 border-slate-850 text-slate-300 rounded-xl h-11">
                                  <SelectValue placeholder="Or search all topics..." />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-950 border-slate-850 text-slate-200">
                                  {uniqueTopics.map(t => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        {/* Difficulty Selector */}
                        <div className="space-y-3">
                          <label className="text-sm font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Select Training Difficulty
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { value: 'Easy', color: 'emerald', label: 'Initiate', desc: 'Warm-up calculations' },
                              { value: 'Medium', color: 'amber', label: 'Scholar', desc: 'Intermediate matrix' },
                              { value: 'Hard', color: 'rose', label: 'Quantum', desc: 'Expert challenges' }
                            ].map(({ value, color, label, desc }) => {
                              const isSelected = selectedDifficulty === value;
                              const themeColors = {
                                emerald: isSelected 
                                  ? "bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]" 
                                  : "bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200",
                                amber: isSelected 
                                  ? "bg-amber-950/40 border-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.15)]" 
                                  : "bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200",
                                rose: isSelected 
                                  ? "bg-rose-950/40 border-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.15)]" 
                                  : "bg-slate-950/60 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-200",
                              };
                              const dotColors = {
                                emerald: isSelected ? "bg-emerald-400 animate-ping" : "bg-slate-700",
                                amber: isSelected ? "bg-amber-400 animate-ping" : "bg-slate-700",
                                rose: isSelected ? "bg-rose-400 animate-ping" : "bg-slate-700"
                              };
                              const textAccentColors = {
                                emerald: isSelected ? "text-emerald-400 animate-pulse" : "text-slate-500",
                                amber: isSelected ? "text-amber-400 animate-pulse" : "text-slate-500",
                                rose: isSelected ? "text-rose-400 animate-pulse" : "text-slate-500"
                              };

                              return (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() => setSelectedDifficulty(value)}
                                  className={cn(
                                    "p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-32 relative overflow-hidden group",
                                    themeColors[color as 'emerald' | 'amber' | 'rose']
                                  )}
                                >
                                  <div>
                                    <div className="flex items-center justify-between">
                                      <span className={cn("text-[10px] font-black uppercase tracking-wider", textAccentColors[color as 'emerald' | 'amber' | 'rose'])}>{value}</span>
                                      <div className={cn("w-2 h-2 rounded-full", dotColors[color as 'emerald' | 'amber' | 'rose'])}></div>
                                    </div>
                                    <p className="font-bold text-white text-md mt-1">{label}</p>
                                  </div>
                                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-2">{desc}</p>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Start Button */}
                        <Button 
                          onClick={handleStartPractice} 
                          disabled={!selectedTopic || !selectedDifficulty} 
                          className={cn(
                            "w-full h-14 rounded-2xl text-base font-bold tracking-wide transition-all duration-300 shadow-xl",
                            (selectedTopic && selectedDifficulty)
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/20 hover:brightness-110 active:scale-[0.98]"
                              : "bg-slate-900 border border-slate-850 text-slate-655 text-slate-500 cursor-not-allowed"
                          )}
                        >
                          <Play className="mr-2 h-5 w-5 fill-current" /> Engage Practice Matrix
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Training Diagnostics */}
              <div className="space-y-6">
                <Card className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden h-full flex flex-col justify-between">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-lg font-black text-white flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-400" /> Training Diagnostics
                    </CardTitle>
                    <CardDescription className="text-slate-400">Your current quantum math rankings.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 py-2 space-y-6 flex-1">
                    {/* User Mini Stat Display */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between h-24">
                        <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Total Correct</span>
                        <span className="text-3xl font-black text-emerald-400 tracking-tight">
                          {isLoading ? "..." : (myLeaderboard?.total_correct_answers ?? 0)}
                        </span>
                      </div>
                      <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between h-24">
                        <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">Completed</span>
                        <span className="text-3xl font-black text-teal-400 tracking-tight">
                          {isLoading ? "..." : (myLeaderboard?.total_quizzes_completed ?? 0)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-slate-955 border border-slate-900 rounded-2xl p-4 space-y-3 bg-slate-950/60">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-300">Daily Training Quest</span>
                        <span className="text-emerald-405 text-emerald-400 font-bold">
                          {Math.min(myLeaderboard?.total_quizzes_completed ?? 0, 5)} / 5
                        </span>
                      </div>
                      <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900/60">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(((myLeaderboard?.total_quizzes_completed ?? 0) / 5) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {(myLeaderboard?.total_quizzes_completed ?? 0) >= 5 
                          ? "✓ Daily mission complete! You've locked in bonus credits." 
                          : "Solve 5 practice sessions today to claim an extra daily multiplier!"}
                      </p>
                    </div>

                    {/* Pro Tip Box */}
                    <div className="bg-emerald-950/10 border border-emerald-500/20 rounded-2xl p-4 flex gap-3">
                      <Lightbulb className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h5 className="text-xs font-black text-emerald-300 uppercase tracking-wide">Quantum Tip</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Struggling with Medium or Hard questions? Synthesize a short interactive micro-lesson in the <strong className="text-slate-205 text-emerald-300">Math Explorer</strong> tab.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="learn" className="mt-0">
              <MathExplorerTab />
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-0">
              <Card className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                  <CardHeader className="px-0 pt-0 pb-4">
                      <CardTitle className="text-2xl font-black text-white flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-amber-400" /> Global Leaderboard
                      </CardTitle>
                      <CardDescription className="text-slate-400">Compare operations, check rankings and see how you match against other students.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 pb-0 pt-4">
                      <Leaderboard />
                  </CardContent>
              </Card>
          </TabsContent>

           {isTeacherOrAdmin && (
              <TabsContent value="manage" className="mt-0">
                  <ManageProblems />
              </TabsContent>
          )}
      </Tabs>
    </div>
  );
}
