
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
import { 
  BookOpenCheck, Edit, FileText, ChevronRight, PlusCircle, PenSquare, 
  Wand2, CheckCircle2, XCircle, Lightbulb, Trophy, Microscope, 
  Sparkles, Atom, Database, TrendingUp, AlertCircle, Trash2, PencilRuler,
  Loader2, HelpCircle, Save
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/context/role-context';
import { GrammarPractice } from './grammar-practice';
import { cn } from '@/lib/utils';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, query, addDoc, where, serverTimestamp, doc, setDoc, increment, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { 
  ElaGrammarDrill, elaGrammarDrillSchema, 
  ElaReadingPassage, elaReadingPassageSchema, 
  ElaWritingChallenge, elaWritingChallengeSchema, 
  ElaUserSubmission, Class, Student, ElaLeaderboardEntry 
} from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableRow, TableHeader, TableCell, TableBody, TableHead } from '@/components/ui/table';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
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

// --- SUB-COMPONENT: ELA EXPLORER ---
function ElaExplorerTab() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    const [topic, setTopic] = useState('');
    const [isLearning, setIsLearning] = useState(false);
    const [currentLesson, setCurrentLesson] = useState<LessonCard | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const historyQuery = useMemoFirebase(() => 
        (user && firestore && schoolId) ? query(collection(firestore, 'ela_learning_history'), where('userId', '==', user.uid), where('schoolId', '==', schoolId), orderBy('timestamp', 'desc'), limit(10)) : null,
    [user, firestore, schoolId]);
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
                        schoolId: schoolId,
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

// --- SUB-COMPONENT: LEADERBOARD ---
function ElaLeaderboard() {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const leaderboardQuery = useMemoFirebase(
      () => (firestore && schoolId) ? query(collection(firestore, 'ela_leaderboard'), where('schoolId', '==', schoolId), orderBy('total_correct_answers', 'desc')) : null,
      [firestore, schoolId]
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

// --- SUB-COMPONENT: READING MODAL ---
function ActivePassageDialog({ passage, open, setOpen }: { passage: ElaReadingPassage | null, open: boolean, setOpen: (o: boolean) => void }) {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isGrading, setIsGrading] = useState(false);
    const [gradingResult, setGradingResult] = useState<any>(null);
    const { schoolId } = useCurrentSchool();
    
    const firestore = useFirestore();
    const { user } = useUser();

    if (!passage) return null;

    const handleSubmit = async () => {
        if (!schoolId) return;
        setIsGrading(true);
        
        try {
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

            if (user && firestore) {
                await addDocumentNonBlocking(collection(firestore, 'ela_user_submissions'), {
                    userId: user.uid,
                    challenge_id: passage.id,
                    challenge_title: passage.title,
                    type: 'Reading Comprehension',
                    answers: answers,
                    teacher_score: aiFeedback.totalScore,
                    teacher_feedback: aiFeedback.generalFeedback,
                    detailed_results: aiFeedback.results,
                    date_submitted: serverTimestamp(),
                    status: 'Graded',
                    schoolId: schoolId,
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
                                    const qResult = gradingResult?.results.find((r: any) => r.questionIndex === idx);
                                    
                                    return (
                                        <div key={idx} className={cn("p-4 border rounded-lg transition-colors", 
                                            qResult?.isCorrect ? "bg-green-50 border-green-200" : "",
                                            qResult && !qResult.isCorrect ? "bg-red-50 border-red-200" : ""
                                        )}>
                                            <p className="font-medium mb-3 text-sm">{idx + 1}. {q.question}</p>
                                            
                                            {q.options && q.options.length > 0 ? (
                                                <RadioGroup 
                                                    value={answers[idx] || ''} 
                                                    onValueChange={(val) => setAnswers(prev => ({...prev, [idx]: val}))}
                                                    disabled={!!gradingResult}
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

// --- SUB-COMPONENT: READING LIST ---
function ReadingPracticeTab() {
    const firestore = useFirestore();
    const { user } = useUser();
    const { role } = useRole();
    const { schoolId } = useCurrentSchool();
    
    const [selectedPassage, setSelectedPassage] = useState<ElaReadingPassage | null>(null);
    const [isPassageOpen, setIsPassageOpen] = useState(false);

    const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role || '');

    const { data: studentData } = useCollection<Student>(
        useMemoFirebase(() => (user && firestore && !isStaff && schoolId) ? query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, [firestore, user, isStaff, schoolId])
    );
    const studentClassId = studentData?.[0]?.classId;

    const { data: passages, isLoading } = useCollection<ElaReadingPassage>(
        useMemoFirebase(() => {
            if(!firestore || !schoolId) return null;
            let q = query(collection(firestore, 'ela_reading_passages'), where('schoolId', '==', schoolId));
            if (!isStaff && studentClassId) q = query(q, where('classId', '==', studentClassId));
            return q;
        }, [firestore, studentClassId, isStaff, schoolId])
    );

    const handleStart = (p: ElaReadingPassage) => {
        setSelectedPassage(p);
        setIsPassageOpen(true);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Reading Comprehension</CardTitle>
                    <CardDescription>Practice your reading and analytical skills with these passages.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Loader2 className="animate-spin mx-auto"/> : (!isStaff && !studentClassId) ? (
                        <p className="text-center text-muted-foreground py-8">Your class assignment is pending.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {passages?.map(p => (
                                <Card key={p.id} className="hover:border-primary transition-colors cursor-pointer" onClick={() => handleStart(p)}>
                                    <CardHeader className="pb-2">
                                        <Badge variant="secondary" className="w-fit mb-2">{p.reading_level}</Badge>
                                        <CardTitle className="text-lg">{p.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{p.passage_text}</p>
                                    </CardContent>
                                    <CardFooter className="pt-0">
                                        <Button variant="ghost" size="sm" className="w-full text-primary">Start Reading <ChevronRight className="ml-1 h-4 w-4"/></Button>
                                    </CardFooter>
                                </Card>
                            ))}
                            {passages?.length === 0 && <p className="col-span-full text-center py-10 text-muted-foreground">No passages found.</p>}
                        </div>
                    )}
                </CardContent>
            </Card>
            <ActivePassageDialog passage={selectedPassage} open={isPassageOpen} setOpen={setIsPassageOpen} />
        </>
    );
}

// --- SUB-COMPONENT: WRITING MODAL ---
function ActiveChallengeDialog({ challenge, existingSubmission, open, setOpen }: { challenge: ElaWritingChallenge | null, existingSubmission?: ElaUserSubmission, open: boolean, setOpen: (o: boolean) => void }) {
    const [draft, setDraft] = useState('');
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluation, setEvaluation] = useState<any>(null);
    
    const firestore = useFirestore();
    const { user } = useUser();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();

    useEffect(() => {
        if (existingSubmission) {
            setDraft(existingSubmission.submission_text);
            setEvaluation(existingSubmission.teacher_score !== null ? { 
                score: existingSubmission.teacher_score, 
                summary: existingSubmission.teacher_feedback 
            } : null);
        } else {
            setDraft('');
            setEvaluation(null);
        }
    }, [existingSubmission, open]);

    if (!challenge) return null;

    const handleAutoGrade = async () => {
        if (!draft.trim() || !schoolId) return;
        setIsEvaluating(true);
        try {
            const result = await evaluateWritingAction({
                prompt: challenge.prompt,
                studentText: draft,
                type: challenge.challengeType,
                schoolId: schoolId
            });

            if (result.success && result.data) {
                setEvaluation(result.data);
                if (user && firestore) {
                    await addDocumentNonBlocking(collection(firestore, 'ela_user_submissions'), {
                        userId: user.uid,
                        challenge_id: challenge.id,
                        challenge_title: challenge.title,
                        type: 'Writing Challenge',
                        submission_text: draft,
                        teacher_score: result.data.score,
                        teacher_feedback: result.data.summary,
                        date_submitted: serverTimestamp(),
                        status: 'Graded',
                        schoolId: schoolId,
                    });
                }
            }
        } catch (e) {
            toast({ variant: 'destructive', title: "Grading Error", description: "AI could not evaluate your writing." });
        } finally {
            setIsEvaluating(true);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{challenge.title}</DialogTitle>
                    <DialogDescription>{challenge.challengeType} Challenge</DialogDescription>
                </DialogHeader>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden py-4">
                    <div className="flex flex-col gap-4 overflow-hidden">
                        <div className="p-4 bg-slate-50 border rounded-lg">
                            <h4 className="font-bold text-xs uppercase text-slate-400 mb-2">Prompt</h4>
                            <p className="text-slate-800 leading-relaxed italic">"{challenge.prompt}"</p>
                        </div>
                        <Textarea 
                            value={draft} 
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Start writing here..."
                            className="flex-1 resize-none text-lg font-serif p-4"
                            disabled={!!evaluation}
                        />
                    </div>
                    <div className="flex flex-col gap-4 overflow-hidden">
                        <h4 className="font-bold text-slate-700 flex justify-between">
                            AI Writing Coach
                            {evaluation && <Badge className="bg-indigo-600">Score: {evaluation.score}%</Badge>}
                        </h4>
                        <ScrollArea className="flex-1 border rounded-lg bg-indigo-50/30 p-4">
                            {evaluation ? (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="bg-white p-4 rounded-md border shadow-sm">
                                        <h5 className="font-bold text-sm text-indigo-700 mb-1">Feedback Summary</h5>
                                        <p className="text-sm text-slate-600 italic">"{evaluation.summary}"</p>
                                    </div>
                                    {evaluation.strengths && (
                                        <div className="space-y-2">
                                            <h5 className="font-bold text-xs uppercase text-green-600">Key Strengths</h5>
                                            <ul className="text-sm space-y-1">{evaluation.strengths.map((s:string, i:number) => <li key={i} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5"/> {s}</li>)}</ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center px-6">
                                    <Sparkles className="h-12 w-12 mb-4 opacity-20"/>
                                    <p className="text-sm">Submit your draft to receive detailed feedback and a grade from the AI coach.</p>
                                </div>
                            )}
                        </ScrollArea>
                        {!evaluation && (
                            <Button onClick={handleAutoGrade} disabled={isEvaluating || draft.length < 50} className="bg-indigo-600 hover:bg-indigo-700">
                                {isEvaluating ? <Loader2 className="animate-spin mr-2"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                                Submit for AI Evaluation
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- SUB-COMPONENT: WRITING LIST ---
function WritingSubmissionTab() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { role } = useRole();
    const { schoolId } = useCurrentSchool();
    
    const [selectedChallengeId, setSelectedChallengeId] = useState<string>('');
    const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

    const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role || '');

    const { data: studentData } = useCollection<Student>(
        useMemoFirebase(() => (user && firestore && !isStaff && schoolId) ? query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, [firestore, user, isStaff, schoolId])
    );
    const studentClassId = studentData?.[0]?.classId;

    const { data: challenges, isLoading: isLoadingChallenges } = useCollection<ElaWritingChallenge>(
        useMemoFirebase(() => {
            if(!firestore || !schoolId) return null;
            let baseQuery = query(collection(firestore, 'ela_writing_challenges'), where('schoolId', '==', schoolId));
            if (isStaff) return baseQuery;
            if (studentClassId) return query(baseQuery, where('classId', '==', studentClassId));
            return null;
        }, [firestore, studentClassId, isStaff, schoolId])
    );

    const { data: submissions } = useCollection<ElaUserSubmission>(
        useMemoFirebase(() => {
            if (!user || !firestore || !schoolId) return null;
            return query(
                collection(firestore, 'ela_user_submissions'), 
                where('userId', '==', user.uid),
                where('schoolId', '==', schoolId),
                orderBy('date_submitted', 'desc')
            );
        }, [firestore, user, schoolId])
    );

    const isLoading = isUserLoading || isLoadingChallenges;

    const activeChallenge = useMemo(() => {
        return challenges?.find(c => c.id === selectedChallengeId) || null;
    }, [challenges, selectedChallengeId]);

    const existingSubmission = useMemo(() => {
        if (!activeChallenge || !submissions) return undefined;
        return submissions.find(s => s.challenge_id === activeChallenge.id);
    }, [activeChallenge, submissions]);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Writing Challenges</CardTitle>
                    <CardDescription>Select a challenge to start writing.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Loader2 className="animate-spin mx-auto"/> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {challenges?.map(c => {
                                const isDone = submissions?.some(s => s.challenge_id === c.id);
                                return (
                                    <Card key={c.id} className="cursor-pointer hover:border-primary transition-all" onClick={() => { setSelectedChallengeId(c.id); setIsWorkspaceOpen(true); }}>
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <Badge variant="outline">{c.challengeType}</Badge>
                                                {isDone && <CheckCircle2 className="h-5 w-5 text-green-500"/>}
                                            </div>
                                            <CardTitle className="text-lg mt-2">{c.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground line-clamp-2 italic">"{c.prompt}"</p>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
            <ActiveChallengeDialog challenge={activeChallenge} existingSubmission={existingSubmission} open={isWorkspaceOpen} setOpen={setIsWorkspaceOpen} />
        </>
    );
}

// --- MAIN PAGE ---
export default function ElaClubPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();
  const isTeacherOrAdmin = role === 'Teacher' || role === 'Administrator' || role === 'Director';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpenCheck /> ELA Club
          </CardTitle>
          <CardDescription>Improve your reading, writing, and grammar skills.</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="grammar" className="w-full">
        <TabsList className={cn("grid w-full", isTeacherOrAdmin ? "grid-cols-5" : "grid-cols-4")}>
          <TabsTrigger value="grammar"><Edit className="mr-2 h-4 w-4" /> Grammar</TabsTrigger>
          <TabsTrigger value="reading"><FileText className="mr-2 h-4 w-4" /> Reading</TabsTrigger>
          <TabsTrigger value="writing"><PenSquare className="mr-2 h-4 w-4" /> Writing</TabsTrigger>
          <TabsTrigger value="leaderboard"><Trophy className="mr-2 h-4 w-4" /> Leaderboard</TabsTrigger>
          {isTeacherOrAdmin && <TabsTrigger value="manage">Manage</TabsTrigger>}
        </TabsList>
        <TabsContent value="grammar"><GrammarPractice /></TabsContent>
        <TabsContent value="reading"><ReadingPracticeTab /></TabsContent>
        <TabsContent value="writing"><WritingSubmissionTab /></TabsContent>
        <TabsContent value="leaderboard"><Card><CardContent className="pt-6"><ElaLeaderboard /></CardContent></Card></TabsContent>
        {isTeacherOrAdmin && (
            <TabsContent value="manage">
                <Card>
                    <CardHeader><CardTitle>AI Content Management</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <AiProblemGenerator subject="ELA Grammar" setOpen={() => {}} />
                    </CardContent>
                </Card>
            </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
