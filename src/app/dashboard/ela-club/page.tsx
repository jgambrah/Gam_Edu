
'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { BookOpenCheck, Edit, FileText, ChevronRight, PlusCircle, PenSquare, Wand2, CheckCircle2, XCircle, Lightbulb, Trophy, Microscope, Sparkles, Atom, Database, TrendingUp, AlertCircle, Trash2, PencilRuler } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/context/role-context';
import { GrammarPractice } from './grammar-practice';
import { cn } from '@/lib/utils';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, addDoc, where, serverTimestamp, getDocs, doc, updateDoc, increment, setDoc, orderBy, limit } from 'firebase/firestore';
import { ElaGrammarDrill, elaGrammarDrillSchema, ElaReadingPassage, elaReadingPassageSchema, ElaWritingChallenge, elaWritingChallengeSchema, ElaUserSubmission, Class, Student, ElaLeaderboardEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableRow, TableHeader, TableCell, TableBody, TableHead } from '@/components/ui/table';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AiProblemGenerator } from '../ai-problem-generator';
import { generateReadingPassage } from '@/ai/flows/generate-reading-passage-flow';
import { generateWritingChallenge } from '@/ai/flows/generate-writing-challenge-flow';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { getAuth } from 'firebase/auth';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateElaLessonAction, GeneratedElaLesson } from '@/ai/flows/generate-ela-lesson';
import { evaluateReadingSubmissionAction } from '@/ai/flows/evaluate-reading-submission';
import { evaluateWritingAction } from '@/ai/flows/evaluate-writing-submission';
import { useCurrentSchool } from '@/hooks/use-current-school';


interface LessonCard extends GeneratedElaLesson {
    id?: string;
    timestamp?: any;
}

function ElaExplorerTab() {
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
        (user && firestore) ? query(collection(firestore, 'ela_learning_history'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'), limit(10)) : null,
    [user, firestore]);
    const { data: history, isLoading: historyLoading } = useCollection<LessonCard>(historyQuery);

    const handleLearn = async () => {
        if (!topic.trim() || !schoolId) return;
        setIsLearning(true);
        setShowAnswer(false);
        setCurrentLesson(null);

        try {
            const result = await generateElaLessonAction({ topic, grade: 'JHS 1', schoolId });
            
            if (result.success && result.data) {
                setCurrentLesson(result.data);
                if(user && firestore) {
                    await addDoc(collection(firestore, 'ela_learning_history'), {
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
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
                    <CardHeader>
                        <CardTitle className="text-purple-800 flex items-center gap-2"><Microscope className="h-5 w-5"/> What do you want to learn today?</CardTitle>
                        <CardDescription>Type any ELA topic (e.g. "Simile vs Metaphor", "Subject-Verb Agreement")</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter a topic..." className="bg-white" onKeyDown={(e) => e.key === 'Enter' && handleLearn()}/>
                            <Button onClick={handleLearn} disabled={isLearning || !topic} className="bg-purple-600 hover:bg-purple-700 w-32">
                                {isLearning ? <Loader2 className="h-4 w-4 animate-spin"/> : <><Sparkles className="h-4 w-4 mr-2"/> Learn</>}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {currentLesson && (
                    <Card className="border-t-4 border-t-purple-500 shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardHeader>
                            <CardTitle className="text-2xl">{currentLesson.title}</CardTitle>
                            <CardDescription>Micro-Lesson</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-purple-700 mb-1">The Concept</h4>
                                <p className="text-slate-700 leading-relaxed">{currentLesson.explanation}</p>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                <h4 className="font-semibold text-amber-800 mb-1 flex items-center gap-2"><Lightbulb className="h-4 w-4"/> Example</h4>
                                <p className="text-slate-700 italic">"{currentLesson.example}"</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-700 mb-2">Key Terms</h4>
                                <div className="flex flex-wrap gap-2">
                                    {currentLesson.keyTerms.map((term, i) => (
                                        <Badge key={i} variant="secondary" className="bg-slate-100">{term}</Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4 border-t">
                                <h4 className="font-semibold text-slate-700 mb-2">Quick Check</h4>
                                <p className="mb-3">{currentLesson.quizQuestion}</p>
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

// --- LEADERBOARD ---
function ElaLeaderboard() {
    const firestore = useFirestore();
    const leaderboardQuery = useMemoFirebase(
      () => firestore ? query(collection(firestore, 'ela_leaderboard'), orderBy('total_correct_answers', 'desc')) : null,
      [firestore]
    );
    const { data: leaderboard, isLoading } = useCollection<ElaLeaderboardEntry>(leaderboardQuery);

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
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
                    <TableHead className="text-right">Challenges Completed</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {leaderboard?.map((entry, index) => (
                    <TableRow key={entry.userId}>
                        <TableCell className="font-bold text-lg">{index + 1}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={entry.profilePictureUrl} />
                                    <AvatarFallback>{entry.userName ? entry.userName.charAt(0) : 'S'}</AvatarFallback>
                                </Avatar>
                                <span>{entry.userName}</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">{entry.total_correct_answers}</TableCell>
                        <TableCell className="text-right">{entry.total_challenges_completed}</TableCell>
                    </TableRow>
                ))}
                {leaderboard?.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center">The leaderboard is empty. Be the first to get a correct answer!</TableCell></TableRow>
                )}
            </TableBody>
        </Table>
    )
}

// --- SUB-COMPONENT: The Actual Drill Modal ---
function ActiveDrillDialog({ drill, open, setOpen }: { drill: ElaGrammarDrill | null, open: boolean, setOpen: (o: boolean) => void }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const { user } = useUser();
    const firestore = useFirestore();

    if (!drill) return null;

    const handleSubmit = async () => {
        if (!selectedOption) return;
        
        const correct = selectedOption === drill.correct_answer;
        setIsCorrect(correct);
        setIsSubmitted(true);

        if (correct && user && firestore) {
            const leaderboardRef = doc(firestore, 'ela_leaderboard', user.uid);
            const data = {
                 userId: user.uid,
                 userName: user.displayName || user.email,
                 profilePictureUrl: user.photoURL || '',
                 total_correct_answers: increment(1),
            };
            setDoc(leaderboardRef, data, { merge: true })
             .catch(error => {
                const permissionError = new FirestorePermissionError({
                    path: leaderboardRef.path,
                    operation: 'write',
                    requestResourceData: data,
                });
                errorEmitter.emit('permission-error', permissionError);
            });
        }
    };

    const handleReset = () => {
        setIsSubmitted(false);
        setSelectedOption('');
        setOpen(false);
    };

    // Helper utility for classnames
    function cn(...classes: (string | undefined | null | false)[]) {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <Dialog open={open} onOpenChange={handleReset}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{drill.topic} Practice</DialogTitle>
                    <DialogDescription>Read the prompt and select the correct answer.</DialogDescription>
                </DialogHeader>
                
                <div className="py-4 space-y-4">
                    <div className="bg-muted p-4 rounded-md text-lg font-medium">
                        {drill.question_prompt}
                    </div>

                    <RadioGroup value={selectedOption} onValueChange={setSelectedOption} disabled={isSubmitted}>
                        {drill.options?.map((option, idx) => (
                            <div key={idx} className={cn("flex items-center space-x-2 border p-3 rounded-md transition-colors", 
                                isSubmitted && option === drill.correct_answer ? "border-green-500 bg-green-50" : "",
                                isSubmitted && option === selectedOption && !isCorrect ? "border-red-500 bg-red-50" : ""
                            )}>
                                <RadioGroupItem value={option} id={`opt-${idx}`} />
                                <Label htmlFor={`opt-${idx}`} className="flex-grow cursor-pointer">{option}</Label>
                                {isSubmitted && option === drill.correct_answer && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                                {isSubmitted && option === selectedOption && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                            </div>
                        ))}
                    </RadioGroup>

                    {isSubmitted && (
                        <div className={cn("p-4 rounded-md text-center font-bold", isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                            {isCorrect ? "Correct! Great job." : `Incorrect. The correct answer was: ${drill.correct_answer}`}
                        </div>
                    )}
                    {isSubmitted && (drill as any).explanation && (
                         <div className="p-4 rounded-md bg-sky-50 border border-sky-200 text-sm text-sky-800">
                           <p className="font-bold">Explanation</p>
                           <p>{(drill as any).explanation}</p>
                         </div>
                    )}
                </div>

                <DialogFooter>
                    {!isSubmitted ? (
                        <Button onClick={handleSubmit} disabled={!selectedOption}>Check Answer</Button>
                    ) : (
                        <Button onClick={handleReset}>Close & Continue</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- Reading Practice Tab ---
function ReadingPracticeTab() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { role } = useRole(); 
  const { schoolId } = useCurrentSchool();
  
  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);

  // State for UI
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedPassageId, setSelectedPassageId] = useState<string>('');
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  // 1. Get Student Data
  const { data: studentData, isLoading: isLoadingStudent } = useCollection<Student>(
    useMemoFirebase(() => {
      if (!user || !firestore || isStaff || !schoolId) return null;
      return query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId));
    }, [firestore, user, isStaff, schoolId])
  );
  
  const studentClassId = studentData?.[0]?.classId;

  // 2. Fetch Passages
  const passagesQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    let baseQuery = query(collection(firestore, 'ela_reading_passages'), where('schoolId', '==', schoolId));

    if (isStaff) return baseQuery; // Staff see all
    
    if (studentClassId) { // Students see only their class's
      return query(baseQuery, where('classId', '==', studentClassId));
    }
    
    return null; // Return null if a student has no class yet
  }, [firestore, studentClassId, isStaff, schoolId]);

  const { data: passages, isLoading: isLoadingPassages } = useCollection<ElaReadingPassage>(passagesQuery);

  const isLoading = isUserLoading || (isLoadingStudent && !isStaff) || isLoadingPassages;

  // 3. Derived Lists
  const uniqueLevels = useMemo(() => {
      if (!passages) return [];
      return Array.from(new Set(passages.map(p => p.reading_level))).sort();
  }, [passages]);

  const filteredPassages = useMemo(() => {
      if (!passages) return [];
      if (!selectedLevel) return []; // Show none until level selected
      return passages.filter(p => p.reading_level === selectedLevel);
  }, [passages, selectedLevel]);

  const activePassage = useMemo(() => {
      return passages?.find(p => p.id === selectedPassageId) || null;
  }, [passages, selectedPassageId]);

  const handleStart = () => {
      if (selectedPassageId) setIsReaderOpen(true);
  };

  // Helper utility for classnames
  function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <>
        <Card>
        <CardHeader>
            <CardTitle>Reading Comprehension Practice</CardTitle>
            <CardDescription>{isStaff ? "Viewing ALL passages" : "Select a reading level and a title to begin."}</CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
            <div className="flex flex-col space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="flex justify-center text-muted-foreground text-sm gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading library...
                </div>
            </div>
            ) :
            (!isStaff && !studentClassId) ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">You are not assigned to a class.</p>
                    <p className="text-xs text-red-400 mt-1">Debug: UID {user?.uid}</p>
                </div>
            ) :
            passages && passages.length > 0 ? (
                <div className="space-y-6 max-w-xl mx-auto py-4">
                     {/* DROP DOWN 1: READING LEVEL */}
                     <div className="space-y-2">
                        <Label>1. Choose Reading Level</Label>
                        <Select value={selectedLevel} onValueChange={(val) => { setSelectedLevel(val); setSelectedPassageId(''); }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Level (e.g., Grade 9)" />
                            </SelectTrigger>
                            <SelectContent>
                                {uniqueLevels.map(lvl => (
                                    <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                     {/* DROP DOWN 2: PASSAGE TITLE */}
                     <div className="space-y-2">
                        <Label>2. Choose Passage Title</Label>
                        <Select value={selectedPassageId} onValueChange={setSelectedPassageId} disabled={!selectedLevel}>
                            <SelectTrigger>
                                <SelectValue placeholder={!selectedLevel ? "Select a level first" : "Select a Title"} />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredPassages.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button className="w-full" size="lg" onClick={handleStart} disabled={!selectedPassageId}>
                        Open Reader <BookOpenCheck className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            ) : (
                 <p className="text-center text-muted-foreground py-12">
                    {isStaff ? "No passages found." : "No reading passages available for your class."}
                </p>
            )}
        </CardContent>
        </Card>

        {/* THE READER MODAL */}
        <ActivePassageDialog 
            passage={activePassage} 
            open={isReaderOpen} 
            setOpen={setIsReaderOpen} 
        />
    </>
  );
}

// --- UPDATED COMPONENT: Reading Reader Modal ---
function ActivePassageDialog({ passage, open, setOpen }: { passage: ElaReadingPassage | null, open: boolean, setOpen: (o: boolean) => void }) {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isGrading, setIsGrading] = useState(false); // Loading state for AI
    const [gradingResult, setGradingResult] = useState<any>(null); // Store AI results
    const { schoolId } = useCurrentSchool();
    
    const firestore = useFirestore();
    const { user } = useUser();

    if (!passage) return null;

    const handleSubmit = async () => {
        if (!schoolId) return;
        setIsGrading(true);
        
        try {
            // 1. Call AI to Grade
            const result = await evaluateReadingSubmissionAction({
                passageText: passage.passage_text,
                questions: passage.question_set,
                studentAnswers: answers,
                schoolId: schoolId,
            });

            if (!result.success || !result.data) {
                throw new Error(result.error || "Grading failed");
            }

            const aiFeedback = result.data;
            setGradingResult(aiFeedback);

            // 2. Save to Firestore
            if (user && firestore) {
                await addDocumentNonBlocking(collection(firestore, 'ela_user_submissions'), {
                    userId: user.uid,
                    challenge_id: passage.id,
                    challenge_title: passage.title,
                    type: 'Reading Comprehension',
                    answers: answers,
                    teacher_score: aiFeedback.totalScore, // Use AI Score
                    teacher_feedback: aiFeedback.generalFeedback,
                    detailed_results: aiFeedback.results, // Save specific feedback
                    date_submitted: serverTimestamp(),
                    status: 'Graded'
                });
            }
        } catch (e) {
            console.error("Error:", e);
            alert("Could not connect to AI Grader. Please try again.");
        } finally {
            setIsGrading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setGradingResult(null);
        setAnswers({});
        setIsGrading(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{passage.title}</DialogTitle>
                    <DialogDescription>Read the passage and answer the questions.</DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
                    {/* LEFT SIDE: PASSAGE TEXT */}
                    <div className="w-1/2 flex flex-col border-r pr-6">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4"/> Passage Text 
                            <Badge variant="outline">{passage.reading_level}</Badge>
                        </h4>
                        <ScrollArea className="flex-1 bg-muted/30 p-4 rounded-md border">
                            <div className="prose prose-sm max-w-none whitespace-pre-wrap font-serif text-lg leading-relaxed">
                                {passage.passage_text}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* RIGHT SIDE: QUESTIONS */}
                    <div className="w-1/2 flex flex-col">
                        <h4 className="font-semibold mb-2 flex justify-between items-center">
                            <span>Questions</span>
                            {gradingResult && (
                                <Badge className={gradingResult.totalScore >= 50 ? "bg-green-600" : "bg-red-600"}>
                                    Score: {gradingResult.totalScore}%
                                </Badge>
                            )}
                        </h4>
                        
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-6">
                                {passage.question_set.map((q, idx) => {
                                    // Find specific feedback for this question if graded
                                    const qResult = gradingResult?.results.find((r: any) => r.questionIndex === idx);
                                    
                                    return (
                                        <div key={idx} className={cn("p-4 border rounded-lg transition-colors", 
                                            qResult?.isCorrect ? "bg-green-50 border-green-200" : "",
                                            qResult && !qResult.isCorrect ? "bg-red-50 border-red-200" : ""
                                        )}>
                                            <p className="font-medium mb-3 text-sm">{idx + 1}. {q.question}</p>
                                            
                                            {/* OPTIONS OR INPUT */}
                                            {q.options && q.options.length > 0 ? (
                                                <RadioGroup 
                                                    value={answers[idx] || ''} 
                                                    onValueChange={(val) => setAnswers(prev => ({...prev, [idx]: val}))}
                                                    disabled={!!gradingResult} // Disable after grading
                                                >
                                                    {q.options.map((opt, i) => (
                                                        <div key={i} className="flex items-center space-x-2 mb-1">
                                                            <RadioGroupItem value={opt} id={`q${idx}-opt${i}`} />
                                                            <Label htmlFor={`q${idx}-opt${i}`} className="font-normal cursor-pointer">{opt}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            ) : (
                                                <Input 
                                                    placeholder="Type your answer..." 
                                                    value={answers[idx] || ''}
                                                    onChange={(e) => setAnswers(prev => ({...prev, [idx]: e.target.value}))}
                                                    disabled={!!gradingResult}
                                                />
                                            )}

                                            {/* AI FEEDBACK SECTION */}
                                            {qResult && (
                                                <div className="mt-3 text-xs p-2 rounded bg-white/50 border border-black/5">
                                                    <div className="flex items-center gap-2 mb-1 font-bold">
                                                        {qResult.isCorrect ? 
                                                            <span className="text-green-700 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Correct</span> : 
                                                            <span className="text-red-700 flex items-center gap-1"><XCircle className="h-3 w-3"/> Incorrect</span>
                                                        }
                                                    </div>
                                                    <p className="text-slate-600 italic">"{qResult.feedback}"</p>
                                                    {!qResult.isCorrect && (
                                                        <p className="mt-1 font-semibold text-slate-800">Correct Answer: {q.correct_answer_key}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                        
                        {gradingResult && (
                             <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-800">
                                 <strong>Teacher's Remark:</strong> {gradingResult.generalFeedback}
                             </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="pt-4 border-t mt-4">
                    {!gradingResult ? (
                        <Button onClick={handleSubmit} disabled={isGrading} className="w-full md:w-auto min-w-[150px]">
                            {isGrading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Grading...</> : "Submit Answers"}
                        </Button>
                    ) : (
                        <Button onClick={handleClose} className="w-full md:w-auto">Finish Review</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- SUB-COMPONENT: Writing Workspace Modal ---
function ActiveChallengeDialog({ 
    challenge, 
    existingSubmission, 
    open, 
    setOpen 
}: { 
    challenge: ElaWritingChallenge | null, 
    existingSubmission: ElaUserSubmission | undefined,
    open: boolean, 
    setOpen: (o: boolean) => void 
}) {
    const { toast } = useToast();
    
    // VIEW 1: SUBMISSION FORM
    if (!existingSubmission) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{challenge?.challengeType}</Badge>
                        </div>
                        <DialogTitle className="text-xl">{challenge?.title}</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-1 gap-6 overflow-hidden min-h-0 pt-2">
                        {/* LEFT SIDE: PROMPT */}
                        <div className="w-1/3 flex flex-col border-r pr-6">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Lightbulb className="h-4 w-4 text-yellow-500"/> The Prompt
                            </h4>
                            <ScrollArea className="flex-1 bg-yellow-50/50 p-4 rounded-md border border-yellow-100">
                                <p className="text-sm whitespace-pre-wrap leading-relaxed text-slate-800">
                                    {challenge?.prompt}
                                </p>
                            </ScrollArea>
                        </div>

                        {/* RIGHT SIDE: EDITOR / STATUS */}
                        <div className="w-2/3 flex flex-col">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <PenSquare className="h-4 w-4"/> Your Response
                            </h4>
                            {challenge && <StudentSubmissionForm challenge={challenge} setOpen={setOpen} />}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }
    
    // VIEW 2: VIEWING A SUBMITTED/GRADED PIECE
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{challenge?.challengeType}</Badge>
                        <Badge variant={existingSubmission.status === 'Graded' ? 'default' : 'secondary'}>{existingSubmission.status}</Badge>
                    </div>
                    <DialogTitle className="text-xl">{challenge?.title}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-1 gap-6 overflow-hidden min-h-0 pt-2">
                    <div className="w-1/3 flex flex-col border-r pr-6">
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500"/> The Prompt</h4>
                        <ScrollArea className="flex-1 bg-yellow-50/50 p-4 rounded-md border border-yellow-100">
                            <p className="text-sm whitespace-pre-wrap leading-relaxed text-slate-800">{challenge?.prompt}</p>
                        </ScrollArea>
                    </div>
                    <div className="w-2/3 flex flex-col">
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><PenSquare className="h-4 w-4"/> Your Submission</h4>
                        <ScrollArea className="flex-1 bg-muted/20 p-4 rounded-md border">
                            <div className="prose prose-sm max-w-none whitespace-pre-wrap font-serif text-lg leading-relaxed">
                                {existingSubmission.submission_text}
                            </div>
                            {existingSubmission.status === 'Graded' && (
                                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                                    <p className="font-bold text-green-800 mb-1">Teacher Feedback (Score: {existingSubmission.teacher_score}/100)</p>
                                    <p className="text-sm text-green-700">{existingSubmission.teacher_feedback || "Great job!"}</p>
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>
                 <DialogFooter className="pt-4 mt-4 border-t">
                    <Button onClick={() => setOpen(false)} variant="secondary">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function StudentSubmissionForm({ challenge, setOpen }: { challenge: ElaWritingChallenge, setOpen: (open: boolean) => void }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [aiResult, setAiResult] = useState<any>(null); // Store the report card

    const form = useForm<{ submission_text: string }>({
        defaultValues: { submission_text: '' },
        resolver: zodResolver(z.object({ submission_text: z.string().min(10, "Please write at least a few sentences.") }))
    });

    async function onSubmit(values: { submission_text: string }) {
        if (!user || !firestore || !schoolId) return;
        setIsSubmitting(true);

        try {
            // 1. Get AI Evaluation First
            const evaluation = await evaluateWritingAction({
                prompt: challenge.prompt,
                studentText: values.submission_text,
                type: challenge.challengeType,
                schoolId: schoolId,
            });

            const feedbackData = evaluation.success && evaluation.data ? evaluation.data : null;
            
            // 2. Save to Firestore (Including AI Feedback)
            await addDocumentNonBlocking(collection(firestore, 'ela_user_submissions'), {
                userId: user.uid,
                challenge_id: challenge.id,
                challenge_title: challenge.title,
                type: 'Writing Challenge',
                submission_text: values.submission_text,
                date_submitted: serverTimestamp(),
                status: 'Graded', // Auto-graded by AI
                
                // Save AI Data
                teacher_score: feedbackData ? feedbackData.score : null, 
                teacher_feedback: feedbackData ? feedbackData.summary : "Pending review",
                ai_detailed_feedback: feedbackData // Store full object for detailed view
            });

            // 3. Show Result in UI instead of closing immediately
            if (feedbackData) {
                setAiResult(feedbackData);
                toast({ title: 'Submitted!', description: 'Your work has been graded by AI.' });
            } else {
                toast({ title: 'Submitted', description: 'Your work has been sent to the teacher.' });
                setOpen(false);
            }

        } catch (error) {
            console.error('Error submitting work:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not submit your work.' });
            setOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    }
    
    // VIEW 2: AI REPORT CARD (Shows after successful submit)
    if (aiResult) {
        return (
            <div className="space-y-6 py-2">
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Assessment Complete</h3>
                        <p className="text-sm text-slate-500">Here is how you did:</p>
                    </div>
                    <div className="text-right">
                        <span className="block text-xs font-bold text-slate-400 uppercase">Score</span>
                        <span className={`text-3xl font-bold ${aiResult.score >= 70 ? 'text-green-600' : 'text-orange-500'}`}>
                            {aiResult.score}/100
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-3 rounded-md bg-blue-50 text-blue-800 border border-blue-100">
                        <p className="text-sm italic">"{aiResult.summary}"</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3"/> Strengths
                            </h4>
                            <ul className="text-sm space-y-1 list-disc pl-4 text-slate-700">
                                {aiResult.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase text-orange-600 flex items-center gap-1">
                                <TrendingUp className="h-3 w-3"/> To Improve
                            </h4>
                            <ul className="text-sm space-y-1 list-disc pl-4 text-slate-700">
                                {aiResult.improvements.map((s: string, i: number) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    </div>

                    <div className="p-4 rounded-md border border-yellow-200 bg-yellow-50">
                        <h4 className="text-xs font-bold uppercase text-yellow-700 flex items-center gap-1 mb-2">
                            <Lightbulb className="h-3 w-3"/> AI Writing Tip
                        </h4>
                        <p className="text-sm text-slate-700">
                            <span className="font-semibold">Try rewriting a sentence like this:</span> <br/>
                            "{aiResult.exampleRewrite}"
                        </p>
                    </div>
                </div>

                <Button onClick={() => setOpen(false)} className="w-full">Done</Button>
            </div>
        );
    }

    // VIEW 1: SUBMISSION FORM
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="submission_text" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Response</FormLabel>
                        <FormControl>
                            <Textarea 
                                {...field} 
                                rows={10} 
                                placeholder="Type your response here..." 
                                className="font-serif text-lg leading-relaxed p-4 resize-none"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing & Submitting...</>
                    ) : (
                        "Submit for AI Grading"
                    )}
                </Button>
            </form>
        </Form>
    );
}

// --- Writing Practice Tab ---
function WritingSubmissionTab() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { role } = useRole();
    const { schoolId } = useCurrentSchool();
    
    // UI State
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedChallengeId, setSelectedChallengeId] = useState<string>('');
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

    const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);

    // 1. Fetch Student Data (to get Class ID)
    const { data: studentData, isLoading: isLoadingStudent } = useCollection<Student>(
        useMemoFirebase(() => (user && firestore && !isStaff && schoolId) ? query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, [firestore, user, isStaff, schoolId])
    );
    const studentClassId = studentData?.[0]?.classId;

    // 2. Fetch Challenges
    const { data: challenges, isLoading: isLoadingChallenges } = useCollection<ElaWritingChallenge>(
        useMemoFirebase(() => {
            if(!firestore || !schoolId) return null;
            let baseQuery = query(collection(firestore, 'ela_writing_challenges'), where('schoolId', '==', schoolId));
            if (isStaff) return baseQuery;
            if (studentClassId) return query(baseQuery, where('classId', '==', studentClassId));
            return null;
        }, [firestore, studentClassId, isStaff, schoolId])
    );

    // 3. Fetch My Submissions (to see if I already did it)
    const { data: submissions, isLoading: isLoadingSubmissions } = useCollection<ElaUserSubmission>(
        useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'ela_user_submissions'), where('userId', '==', user.uid)) : null, [firestore, user])
    );

    const isLoading = isUserLoading || isLoadingChallenges || isLoadingSubmissions || (isLoadingStudent && !isStaff);

    // 4. Filtering Logic
    const uniqueTypes = useMemo(() => {
        if (!challenges) return [];
        return Array.from(new Set(challenges.map(c => c.challengeType))).sort();
    }, [challenges]);

    const filteredChallenges = useMemo(() => {
        if (!challenges || !selectedType) return [];
        return challenges.filter(c => c.challengeType === selectedType);
    }, [challenges, selectedType]);

    const activeChallenge = useMemo(() => {
        return challenges?.find(c => c.id === selectedChallengeId) || null;
    }, [challenges, selectedChallengeId]);

    const existingSubmission = useMemo(() => {
        if (!activeChallenge || !submissions) return undefined;
        return submissions.find(s => s.challenge_id === activeChallenge.id);
    }, [activeChallenge, submissions]);

    const handleStart = () => {
        if (selectedChallengeId) setIsWorkspaceOpen(true);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Writing & Summarizing Challenges</CardTitle>
                    <CardDescription>{isStaff ? "Viewing ALL Challenges" : "Select a challenge type to begin writing."}</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex flex-col space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <div className="flex justify-center text-muted-foreground text-sm gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" /> Loading challenges...
                            </div>
                        </div>
                    ) : 
                    (!isStaff && !studentClassId) ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">You are not assigned to a class.</p>
                            <p className="text-xs text-red-400 mt-1">Debug: UID {user?.uid}</p>
                        </div>
                    ) :
                    challenges && challenges.length > 0 ? (
                        <div className="space-y-6 max-w-xl mx-auto py-4">
                            
                            {/* DROPDOWN 1: TYPE */}
                            <div className="space-y-2">
                                <Label>1. Choose Challenge Type</Label>
                                <Select value={selectedType} onValueChange={(val) => { setSelectedType(val); setSelectedChallengeId(''); }}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type (e.g., Essay, Creative Writing)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {uniqueTypes.map(type => (
                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* DROPDOWN 2: TITLE */}
                            <div className="space-y-2">
                                <Label>2. Choose Challenge</Label>
                                <Select value={selectedChallengeId} onValueChange={setSelectedChallengeId} disabled={!selectedType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={!selectedType ? "Select a type first" : "Select a Title"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredChallenges.map(c => {
                                            const isDone = submissions?.some(s => s.challenge_id === c.id);
                                            return (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.title} {isDone ? "✅" : ""}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button className="w-full" size="lg" onClick={handleStart} disabled={!selectedChallengeId}>
                                {existingSubmission ? "View My Submission" : "Open Writing Workspace"}
                                {existingSubmission ? <BookOpenCheck className="ml-2 h-4 w-4"/> : <PenSquare className="ml-2 h-4 w-4" />}
                            </Button>
                        </div>
                    ) : (
                         <p className="text-center text-muted-foreground py-12">{isStaff ? "No challenges found." : "No writing challenges available for your class."}</p>
                    )}
                </CardContent>
            </Card>

            {/* THE WORKSPACE MODAL */}
            <ActiveChallengeDialog 
                challenge={activeChallenge} 
                existingSubmission={existingSubmission}
                open={isWorkspaceOpen} 
                setOpen={setIsWorkspaceOpen} 
            />
        </>
    );
}

// --- NEW COMPONENTS FOR MANAGEMENT ---

const aiPassageSchema = z.object({
  topic: z.string().min(3, "Topic is required."),
  reading_level: z.string().min(1, "Reading level is required."),
  numQuestions: z.coerce.number().min(1).max(5),
  classId: z.string().min(1, "Please select a class to assign this to.")
});

function AiPassageGenerator({ setOpen, onSuccess }: { setOpen: (open: boolean) => void; onSuccess: () => void; }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: classes } = useCollection<Class>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));

  const form = useForm<z.infer<typeof aiPassageSchema>>({
    resolver: zodResolver(aiPassageSchema),
    defaultValues: {
      topic: '',
      reading_level: 'Grade 9',
      numQuestions: 3,
      classId: ''
    }
  });

  async function onSubmit(values: z.infer<typeof aiPassageSchema>) {
    if (!schoolId) {
      toast({ variant: 'destructive', title: 'Error', description: 'School ID is missing.' });
      return;
    }
    setIsGenerating(true);
    toast({ title: 'AI is thinking...', description: 'Generating a reading passage and questions.' });
    try {
      const result = await generateReadingPassage({
          topic: values.topic,
          reading_level: values.reading_level,
          numQuestions: values.numQuestions,
      });
      await addDocumentNonBlocking(collection(firestore, 'ela_reading_passages'), {
        ...result,
        reading_level: values.reading_level,
        classId: values.classId,
        schoolId: schoolId,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Success!', description: 'New passage has been added to the library.' });
      onSuccess();
      setOpen(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'AI Error', description: error.message || 'Failed to generate passage.' });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="topic" render={({ field }) => (
          <FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g. The Roman Empire, Photosynthesis" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-3 gap-4">
          <FormField control={form.control} name="reading_level" render={({ field }) => (
            <FormItem><FormLabel>Reading Level</FormLabel><FormControl><Input placeholder="e.g. Grade 9" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="numQuestions" render={({ field }) => (
            <FormItem><FormLabel># of Questions</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="classId" render={({ field }) => (
              <FormItem><FormLabel>Assign to Class</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a class"/></SelectTrigger></FormControl><SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage/></FormItem>
            )}/>
        </div>
        <Button type="submit" disabled={isGenerating} className="w-full">
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4"/>}
          Generate Passage
        </Button>
      </form>
    </Form>
  )
}

function ManagePassages({ classes, schoolId }: { classes: Class[], schoolId: string }) {
    const firestore = useFirestore();
    const { data: passages, isLoading, forceRefetch } = useCollection<ElaReadingPassage>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'ela_reading_passages'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [isManualOpen, setIsManualOpen] = useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Reading Passage Bank</CardTitle>
                    <CardDescription>Manage reading passages and their comprehension questions.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isAiOpen} onOpenChange={setIsAiOpen}>
                        <DialogTrigger asChild><Button variant="outline"><Wand2 className="mr-2 h-4" />Generate with AI</Button></DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>AI Passage Generator</DialogTitle>
                                <DialogDescription>Let AI create a custom reading passage with questions for any topic.</DialogDescription>
                            </DialogHeader>
                            <AiPassageGenerator setOpen={setIsAiOpen} onSuccess={forceRefetch} />
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isManualOpen} onOpenChange={setIsManualOpen}>
                        <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4"/>New Passage</Button></DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader><DialogTitle>Create Reading Passage</DialogTitle></DialogHeader>
                            <PassageCreationForm setOpen={setIsManualOpen} onSuccess={forceRefetch} classes={classes} schoolId={schoolId} />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-40 w-full" /> : (
                <Table>
                    <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Reading Level</TableHead><TableHead># of Questions</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {passages?.map(p => (
                            <TableRow key={p.id}>
                                <TableCell>{p.title}</TableCell>
                                <TableCell><Badge>{p.reading_level}</Badge></TableCell>
                                <TableCell>{p.question_set.length}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
    );
}

function ManageDrills() {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { data: drills, isLoading, forceRefetch } = useCollection<ElaGrammarDrill>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'ela_grammar_drills'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAiFormOpen, setIsAiFormOpen] = useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Grammar Drill Bank</CardTitle>
                    <CardDescription>Manage multiple-choice grammar questions.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isAiFormOpen} onOpenChange={setIsAiFormOpen}>
                        <DialogTrigger asChild><Button variant="outline"><Wand2 className="mr-2 h-4"/>Generate with AI</Button></DialogTrigger>
                        <DialogContent className="max-w-3xl"><DialogHeader><DialogTitle>AI Problem Generator</DialogTitle><DialogDescription>Generate multiple-choice questions for any topic.</DialogDescription></DialogHeader><AiProblemGenerator subject="ELA Grammar" setOpen={setIsAiFormOpen} /></DialogContent>
                    </Dialog>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4"/>New Drill</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Create New Grammar Drill</DialogTitle></DialogHeader>
                            <DrillCreationForm setOpen={setIsFormOpen} onSuccess={forceRefetch} />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-40 w-full" /> : (
                <Table>
                    <TableHeader><TableRow><TableHead>Topic</TableHead><TableHead>Question</TableHead><TableHead>Type</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {drills?.map(d => (
                            <TableRow key={d.id}>
                                <TableCell><Badge variant="outline">{d.topic}</Badge></TableCell>
                                <TableCell className="max-w-md truncate">{d.question_prompt}</TableCell>
                                <TableCell>{d.type}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
    )
}

function DrillCreationForm({ setOpen, onSuccess }: { setOpen: (open: boolean) => void; onSuccess: () => void; }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { schoolId } = useCurrentSchool();

    const { data: classes } = useCollection<Class>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));

    const form = useForm<z.infer<typeof elaGrammarDrillSchema>>({
        resolver: zodResolver(elaGrammarDrillSchema),
        defaultValues: {
            topic: '',
            type: 'MCQ',
            question_prompt: '',
            options: ['', '', '', ''],
            correct_answer: '',
            classId: '',
        }
    });
    
    const watchType = form.watch('type');

    async function onSubmit(values: z.infer<typeof elaGrammarDrillSchema>) {
        if (!schoolId) {
             toast({ variant: 'destructive', title: 'School ID missing' });
             return;
        }
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'ela_grammar_drills'), {...values, schoolId});
            toast({ title: 'Success', description: 'New grammar drill has been added.' });
            onSuccess();
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error('Error adding drill:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add the drill.' });
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
                        <FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g. Verbs, Punctuation" {...field}/></FormControl><FormMessage/></FormItem>
                    )}/>
                    <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem><FormLabel>Drill Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="MCQ">Multiple Choice</SelectItem><SelectItem value="Drag and Drop" disabled>Drag & Drop (Coming Soon)</SelectItem></SelectContent></Select><FormMessage/></FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="question_prompt" render={({ field }) => (
                    <FormItem><FormLabel>Question Prompt</FormLabel><FormControl><Textarea {...field} placeholder="e.g., Which word is the verb in this sentence?"/></FormControl><FormMessage/></FormItem>
                )}/>
                
                {watchType === 'MCQ' && (
                    <>
                        <div className="grid grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <FormField key={index} control={form.control} name={`options.${index}`} render={({ field }) => (
                                    <FormItem><FormLabel>Option {index + 1}</FormLabel><FormControl><Input {...field}/></FormControl><FormMessage/></FormItem>
                                )}/>
                            ))}
                        </div>
                        <FormField control={form.control} name="correct_answer" render={({ field }) => (
                            <FormItem><FormLabel>Correct Answer</FormLabel><FormControl><Input {...field}/></FormControl><FormDescription>Must exactly match one of the options.</FormDescription><FormMessage/></FormItem>
                        )}/>
                    </>
                )}

                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Add Drill</Button>
            </form>
        </Form>
    );
}

function PassageCreationForm({ setOpen, onSuccess, classes, schoolId }: { setOpen: (open: boolean) => void; onSuccess: () => void; classes: Class[]; schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<z.infer<typeof elaReadingPassageSchema>>({
        resolver: zodResolver(elaReadingPassageSchema),
        defaultValues: { title: '', passage_text: '', reading_level: 'Grade 9', classId: '', question_set: [{ question: '', type: 'MCQ', options: ['', '', ''], correct_answer_key: '' }] }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "question_set"
    });

    async function onSubmit(values: z.infer<typeof elaReadingPassageSchema>) {
        if (!schoolId) return;
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'ela_reading_passages'), {...values, schoolId });
            toast({ title: 'Success', description: 'New reading passage has been created.' });
            onSuccess();
            form.reset();
            setOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add the passage.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <ScrollArea className="h-[70vh] pr-6">
                <div className="space-y-4">
                    <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., The Amazon Rainforest" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                    <FormField control={form.control} name="passage_text" render={({ field }) => (<FormItem><FormLabel>Passage Text</FormLabel><FormControl><Textarea rows={8} {...field}/></FormControl><FormMessage/></FormItem>)}/>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="reading_level" render={({ field }) => (<FormItem><FormLabel>Reading Level</FormLabel><FormControl><Input placeholder="e.g., Grade 9" {...field}/></FormControl><FormMessage/></FormItem>)}/>
                         <FormField control={form.control} name="classId" render={({ field }) => (
                            <FormItem><FormLabel>Assign to Class</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a class"/></SelectTrigger></FormControl><SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage/></FormItem>
                        )}/>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Comprehension Questions</h4>
                        {fields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded space-y-2 relative mb-4">
                                 <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="absolute top-2 right-2 text-red-500"><Trash2 className="h-4 w-4"/></Button>
                                <FormField control={form.control} name={`question_set.${index}.question`} render={({ field }) => (
                                    <FormItem><FormLabel>Question {index + 1}</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                                )}/>
                                <FormField control={form.control} name={`question_set.${index}.type`} render={({ field }) => (
                                    <FormItem><FormLabel>Question Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="MCQ">Multiple Choice</SelectItem><SelectItem value="Short Answer">Short Answer</SelectItem></SelectContent></Select></FormItem>
                                )}/>
                                {form.watch(`question_set.${index}.type`) === 'MCQ' && (
                                     <div className="grid grid-cols-2 gap-2">
                                        {Array.from({ length: 4 }).map((_, optIndex) => (
                                            <FormField key={optIndex} control={form.control} name={`question_set.${index}.options.${optIndex}`} render={({ field }) => (
                                                <FormItem><FormControl><Input placeholder={`Option ${optIndex + 1}`} {...field}/></FormControl></FormItem>
                                            )}/>
                                        ))}
                                    </div>
                                )}
                                <FormField control={form.control} name={`question_set.${index}.correct_answer_key`} render={({ field }) => (
                                    <FormItem><FormLabel>Correct Answer</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                                )}/>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ question: '', type: 'MCQ', options: ['', '', ''], correct_answer_key: '', explanation: ''})}>Add Question</Button>
                    </div>
                </div>
                </ScrollArea>
                <DialogFooter className="pt-4 border-t"><Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Save Passage</Button></DialogFooter>
            </form>
        </Form>
    )
}

function AiWritingChallengeGenerator({ setOpen, onSuccess }: { setOpen: (open: boolean) => void; onSuccess: () => void; }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: classes } = useCollection<Class>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));

  const form = useForm({
    defaultValues: {
      topic: '',
      challengeType: 'Creative Writing' as 'Creative Writing' | 'Summarization' | 'Essay',
      classId: ''
    }
  });

  async function onSubmit(values: any) {
    if (!schoolId) return;
    setIsGenerating(true);
    toast({ title: 'AI is writing...', description: 'Generating a new writing challenge.' });
    try {
      const result = await generateWritingChallenge(values);
      const auth = getAuth();
      await addDocumentNonBlocking(collection(firestore, 'ela_writing_challenges'), {
        ...result,
        classId: values.classId,
        schoolId,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid || 'unknown'
      });
      toast({ title: 'Success!', description: 'New writing challenge added.' });
      onSuccess();
      setOpen(false);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'AI Error', description: error.message });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="topic" render={({ field }) => (
          <FormItem><FormLabel>Topic</FormLabel><FormControl><Input placeholder="e.g., A Journey Through Time, The Importance of Recycling" {...field} /></FormControl></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="challengeType" render={({ field }) => (
            <FormItem><FormLabel>Challenge Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>
                <SelectItem value="Creative Writing">Creative Writing</SelectItem>
                <SelectItem value="Summarization">Summarization</SelectItem>
                <SelectItem value="Essay">Essay</SelectItem>
            </SelectContent></Select></FormItem>
            )} />
            <FormField control={form.control} name="classId" render={({ field }) => (
                <FormItem><FormLabel>Assign to Class</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a class"/></SelectTrigger></FormControl><SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></FormItem>
            )}/>
        </div>
        <Button type="submit" disabled={isGenerating} className="w-full">
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4"/>}
          Generate Challenge
        </Button>
      </form>
    </Form>
  )
}

function WritingChallengeCreationForm({ setOpen, onSuccess, classes, schoolId }: { setOpen: (open: boolean) => void; onSuccess: () => void; classes: Class[]; schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<z.infer<typeof elaWritingChallengeSchema>>({
        resolver: zodResolver(elaWritingChallengeSchema),
        defaultValues: { title: '', prompt: '', challengeType: 'Creative Writing', classId: '' }
    });
    
    async function onSubmit(values: z.infer<typeof elaWritingChallengeSchema>) {
        if (!schoolId) return;
        setIsSubmitting(true);
        try {
            const auth = getAuth();
            await addDocumentNonBlocking(collection(firestore, 'ela_writing_challenges'), {
                ...values,
                schoolId,
                createdBy: auth.currentUser?.uid || 'unknown',
                createdAt: serverTimestamp(),
            });
            toast({ title: 'Success', description: 'New writing challenge has been created.' });
            onSuccess();
            setOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add the challenge.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., A Day in the Life of a Shoe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="prompt" render={({ field }) => (<FormItem><FormLabel>Prompt</FormLabel><FormControl><Textarea rows={5} placeholder="Write a short story from the perspective of..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="challengeType" render={({ field }) => (
                        <FormItem><FormLabel>Challenge Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Creative Writing">Creative Writing</SelectItem><SelectItem value="Summarization">Summarization</SelectItem><SelectItem value="Essay">Essay</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="classId" render={({ field }) => (
                        <FormItem><FormLabel>Assign to Class</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a class"/></SelectTrigger></FormControl><SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                </div>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Create Challenge</Button>
            </form>
        </Form>
    );
}


function ManageWritingChallenges({ classes, schoolId }: { classes: Class[], schoolId: string }) {
    const firestore = useFirestore();
    const { data: challenges, isLoading, forceRefetch } = useCollection<ElaWritingChallenge>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'ela_writing_challenges'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [isManualOpen, setIsManualOpen] = useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Writing Challenge Bank</CardTitle>
                    <CardDescription>Manage creative and academic writing prompts.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isAiOpen} onOpenChange={setIsAiOpen}>
                        <DialogTrigger asChild><Button variant="outline"><Wand2 className="mr-2 h-4"/>Generate with AI</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>AI Writing Challenge Generator</DialogTitle></DialogHeader>
                            <AiWritingChallengeGenerator setOpen={setIsAiOpen} onSuccess={forceRefetch} />
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isManualOpen} onOpenChange={setIsManualOpen}>
                        <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4"/>New Challenge</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Create Writing Challenge</DialogTitle></DialogHeader>
                            <WritingChallengeCreationForm setOpen={setIsManualOpen} onSuccess={forceRefetch} classes={classes} schoolId={schoolId} />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
             <CardContent>
                {isLoading ? <Skeleton className="h-40 w-full" /> : (
                <Table>
                    <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Prompt</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {challenges?.map(c => (
                            <TableRow key={c.id}>
                                <TableCell>{c.title}</TableCell>
                                <TableCell><Badge variant="secondary">{c.challengeType}</Badge></TableCell>
                                <TableCell className="max-w-md truncate">{c.prompt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
    );
}

// --- Main ELA Club Page Component ---
export default function ElaClubPage() {
  const { role } = useRole();
  const isTeacherOrAdmin =
    role === 'Teacher' || role === 'Administrator' || role === 'Director';
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();

  const { data: classes } = useCollection<Class>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenCheck />
            ELA Club
          </CardTitle>
          <CardDescription>
            Improve your reading, writing, and grammar skills.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="grammar" className="w-full">
        <TabsList className={cn("grid w-full", isTeacherOrAdmin ? "grid-cols-5" : "grid-cols-4")}>
          <TabsTrigger value="grammar">
            <Edit className="mr-2 h-4 w-4" />
            Grammar Practice
          </TabsTrigger>
          <TabsTrigger value="reading">
            <FileText className="mr-2 h-4 w-4" />
            Reading Practice
          </TabsTrigger>
          <TabsTrigger value="writing">
            <PenSquare className="mr-2 h-4 w-4" />
            Writing Challenges
          </TabsTrigger>
           <TabsTrigger value="leaderboard">
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </TabsTrigger>
           <TabsTrigger value="learn">ELA Explorer</TabsTrigger>
          {isTeacherOrAdmin && <TabsTrigger value="manage-content">Manage Content</TabsTrigger>}
        </TabsList>
        <TabsContent value="grammar">
          <GrammarPractice />
        </TabsContent>
        <TabsContent value="reading">
          <ReadingPracticeTab />
        </TabsContent>
        <TabsContent value="writing">
          <WritingSubmissionTab />
        </TabsContent>
        <TabsContent value="leaderboard">
            <Card>
                <CardHeader>
                    <CardTitle>ELA Club Leaderboard</CardTitle>
                    <CardDescription>Ranking based on correct answers in grammar and reading drills.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ElaLeaderboard />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="learn" className="mt-6">
            <ElaExplorerTab />
        </TabsContent>
        {isTeacherOrAdmin && (
            <TabsContent value="manage-content" className="space-y-6">
                <ManageDrills />
                {classes && schoolId && <ManagePassages classes={classes} schoolId={schoolId}/>}
                {classes && schoolId && <ManageWritingChallenges classes={classes} schoolId={schoolId}/>}
            </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
