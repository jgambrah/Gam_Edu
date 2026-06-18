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
  Loader2, HelpCircle, Save, FolderOpen, Award, Plus, Trash
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/context/role-context';
import { GrammarPractice } from './grammar-practice';
import { cn } from '@/lib/utils';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, addDoc, where, serverTimestamp, doc, setDoc, increment, orderBy, limit, deleteDoc } from 'firebase/firestore';
import { 
  ElaGrammarDrill, 
  ElaReadingPassage, 
  ElaWritingChallenge, 
  ElaUserSubmission, Class, Student, ElaLeaderboardEntry 
} from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableRow, TableHeader, TableCell, TableBody, TableHead } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { AiProblemGenerator } from '../ai-problem-generator';
import { generateReadingPassage } from '@/ai/flows/generate-reading-passage-flow';
import { generateWritingChallenge } from '@/ai/flows/generate-writing-challenge-flow';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { evaluateReadingSubmissionAction } from '@/ai/flows/evaluate-reading-submission';
import { evaluateWritingAction } from '@/ai/flows/evaluate-writing-submission';
import { useCurrentSchool } from '@/hooks/use-current-school';
import CreditBalance from '@/components/CreditBalance';

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
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full bg-slate-800/60 animate-pulse rounded-xl" />)}
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-xs">Rank</TableHead>
                        <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-xs">Student</TableHead>
                        <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-xs text-right">Correct Answers</TableHead>
                        <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-xs text-right">Challenges Completed</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leaderboard?.map((entry, index) => {
                        const isTop3 = index < 3;
                        const rankStyles = [
                            "bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]", // Gold
                            "bg-slate-400/10 border border-slate-400/30 text-slate-350 shadow-[0_0_10px_rgba(148,163,184,0.15)]", // Silver
                            "bg-orange-500/10 border border-orange-500/30 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.15)]", // Bronze
                        ];
                        return (
                            <TableRow key={entry.userId} className="border-b border-slate-900/50 hover:bg-slate-900/20 transition-all">
                                <TableCell className="py-4">
                                    {isTop3 ? (
                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mx-auto", rankStyles[index])}>
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
                                        <Avatar className="h-9 w-9 border border-slate-800">
                                            <AvatarImage src={entry.profilePictureUrl} />
                                            <AvatarFallback className="bg-indigo-650 text-white font-bold text-xs">
                                                {entry.userName ? entry.userName.slice(0, 2).toUpperCase() : 'ST'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{entry.userName}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right py-4 font-mono font-bold text-teal-400">{entry.total_correct_answers}</TableCell>
                                <TableCell className="text-right py-4 font-mono text-slate-400">{entry.total_challenges_completed || 0}</TableCell>
                            </TableRow>
                        );
                    })}
                    {(!leaderboard || leaderboard.length === 0) && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-10 text-slate-500">
                                <Award className="h-10 w-10 text-slate-700 mx-auto mb-2" />
                                The leaderboard is currently empty. Be the first to submit a correct answer!
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
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

                // Increment total completed challenges on leaderboard
                const leaderboardRef = doc(firestore, 'ela_leaderboard', user.uid);
                await setDoc(leaderboardRef, {
                    userId: user.uid,
                    userName: user.displayName || user.email,
                    profilePictureUrl: user.photoURL || '',
                    total_challenges_completed: increment(1),
                    schoolId: schoolId
                }, { merge: true });
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
            <DialogContent className="max-w-5xl h-[90vh] bg-slate-950 border border-slate-800 text-slate-100 flex flex-col rounded-3xl shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-white flex items-center gap-2">
                        📖 {passage.title}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Read the passage and write your comprehensive answers below.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="flex flex-1 gap-6 overflow-hidden min-h-0 py-2">
                    <div className="w-1/2 flex flex-col border-r border-slate-900 pr-6">
                        <h4 className="font-semibold text-slate-350 mb-3 flex items-center gap-2">
                            <FileText className="h-4.5 w-4.5 text-indigo-400"/> Passage Text 
                            <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">{passage.reading_level}</Badge>
                        </h4>
                        <ScrollArea className="flex-1 bg-slate-900/40 p-5 rounded-xl border border-slate-800 font-serif text-lg leading-relaxed text-slate-200 shadow-inner overflow-y-auto">
                            <div className="whitespace-pre-wrap">
                                {passage.passage_text}
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="w-1/2 flex flex-col overflow-hidden">
                        <h4 className="font-semibold text-slate-350 mb-3 flex justify-between items-center">
                            <span>Questions & Responses</span>
                            {gradingResult && (
                                <Badge className={gradingResult.totalScore >= 50 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"}>
                                    Score: {gradingResult.totalScore}%
                                </Badge>
                            )}
                        </h4>
                        
                        <ScrollArea className="flex-1 pr-2 overflow-y-auto space-y-4">
                            <div className="space-y-5">
                                {passage.question_set.map((q, idx) => {
                                    const qResult = gradingResult?.results.find((r: any) => r.questionIndex === idx);
                                    
                                    return (
                                        <div key={idx} className={cn("p-4 border rounded-xl transition-all", 
                                            qResult?.isCorrect ? "bg-emerald-950/20 border-emerald-555 border-emerald-500/35 text-emerald-250" : "",
                                            qResult && !qResult.isCorrect ? "bg-rose-950/20 border-rose-555 border-rose-500/35 text-rose-250" : "",
                                            !qResult ? "bg-slate-900/30 border-slate-800 text-slate-200" : ""
                                        )}>
                                            <p className="font-semibold mb-3 text-sm text-slate-200">{idx + 1}. {q.question}</p>
                                            
                                            {q.options && q.options.length > 0 ? (
                                                <RadioGroup 
                                                    value={answers[idx] || ''} 
                                                    onValueChange={(val) => setAnswers(prev => ({...prev, [idx]: val}))}
                                                    disabled={!!gradingResult}
                                                    className="space-y-1.5"
                                                >
                                                    {q.options.map((opt, i) => (
                                                        <div key={i} className="flex items-center space-x-2">
                                                            <RadioGroupItem value={opt} id={`q${idx}-opt${i}`} className="border-slate-700 bg-slate-950 text-indigo-500" />
                                                            <Label htmlFor={`q${idx}-opt${i}`} className="font-normal cursor-pointer text-slate-350">{opt}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            ) : (
                                                <Textarea 
                                                    placeholder="Type your explanation answer here..." 
                                                    value={answers[idx] || ''}
                                                    onChange={(e) => setAnswers(prev => ({...prev, [idx]: e.target.value}))}
                                                    disabled={!!gradingResult}
                                                    className="bg-slate-950 border border-slate-800 text-slate-200 focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-xl p-3 h-20 text-sm"
                                                />
                                            )}

                                            {qResult && (
                                                <div className="mt-3 text-xs p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                                                    <div className="flex items-center gap-2 font-bold mb-1">
                                                        {qResult.isCorrect ? 
                                                            <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5"/> Correct</span> : 
                                                            <span className="text-rose-400 flex items-center gap-1"><XCircle className="h-3.5 w-3.5"/> Incorrect</span>
                                                        }
                                                    </div>
                                                    <p className="text-slate-350 italic">"{qResult.feedback}"</p>
                                                    {!qResult.isCorrect && (
                                                        <p className="mt-1 font-semibold text-slate-300">Model Answer Key: <span className="text-white">{q.correct_answer_key}</span></p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                        
                        {gradingResult && (
                             <div className="mt-4 p-4 bg-indigo-950/20 border border-indigo-800/40 rounded-xl text-sm text-indigo-200">
                                 <strong>Coach Remark:</strong> {gradingResult.generalFeedback}
                             </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="pt-4 border-t border-slate-900 mt-4">
                    {!gradingResult ? (
                        <Button 
                            onClick={handleSubmit} 
                            disabled={isGrading || Object.keys(answers).length < passage.question_set.length} 
                            className="w-full md:w-auto min-w-[150px] bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 py-2.5 shadow-lg shadow-indigo-500/20 transition-all h-11"
                        >
                            {isGrading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Evaluating answers...</> : "Submit for AI Coaching"}
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleClose} 
                            className="w-full md:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl h-11 px-6 border border-slate-700/50"
                        >
                            Finish Review
                        </Button>
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
            <Card className="border border-slate-850 bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-2xl font-black text-white flex items-center gap-2">
                        📖 Reading Comprehension Bank
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Practice active reading, critical thinking, and textual analysis with personalized stories.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0 pt-4">
                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mb-2"/>
                            <span className="text-slate-400 text-xs">Unlocking passage library...</span>
                        </div>
                    ) : (!isStaff && !studentClassId) ? (
                        <p className="text-center text-slate-400 py-8">Your class assignment is pending from the administration.</p>
                    ) : passages && passages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {passages?.map(p => (
                                <div 
                                    key={p.id} 
                                    className="bg-slate-950/80 border border-slate-900 hover:border-indigo-500/50 hover:bg-slate-900/40 transition-all cursor-pointer rounded-2xl group flex flex-col justify-between p-5 shadow-lg relative overflow-hidden" 
                                    onClick={() => handleStart(p)}
                                >
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">{p.reading_level}</Badge>
                                            <span className="text-[10px] text-slate-500 font-mono">ID: {p.id.slice(0, 5)}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">{p.title}</h3>
                                        <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed font-serif">{p.passage_text}</p>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        className="text-indigo-455 font-bold group-hover:text-white group-hover:bg-indigo-650 w-full mt-5 bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 rounded-xl h-10 flex items-center justify-center gap-1.5 transition-all text-indigo-400"
                                    >
                                        Start Reading <ChevronRight className="h-4 w-4"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                            <FolderOpen className="h-10 w-10 text-slate-700 mx-auto mb-2" />
                            <p className="text-sm font-semibold">No reading passages available</p>
                            <p className="text-xs text-slate-500 mt-1">
                                {isStaff ? "Use the AI Generator in the Manage tab to populate the list." : "Ask your instructor to add some exercises."}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <ActivePassageDialog passage={selectedPassage} open={isPassageOpen} setOpen={setIsPassageOpen} />
        </>
    );
}

// --- SUB-COMPONENT: WRITING CHALLENGE DIALOG ---
function ActiveChallengeDialog({ challenge, existingSubmission, open, setOpen }: { challenge: ElaWritingChallenge | null, existingSubmission?: ElaUserSubmission, open: boolean, setOpen: (o: boolean) => void }) {
    const [draft, setDraft] = useState('');
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluation, setEvaluation] = useState<any>(null);
    const { schoolId } = useCurrentSchool();
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    useEffect(() => {
        if (existingSubmission) {
            setDraft(existingSubmission.submission_text || '');
            setEvaluation(existingSubmission.teacher_score !== null ? { 
                score: existingSubmission.teacher_score, 
                summary: existingSubmission.teacher_feedback,
                strengths: existingSubmission.teacher_feedback?.split('. ').filter(s => s.trim().length > 0).slice(0, 3) || []
            } : null);
        } else {
            setDraft('');
            setEvaluation(null);
        }
    }, [existingSubmission, open]);

    if (!challenge) return null;

    const handleAutoGrade = async () => {
        if (!draft.trim() || !schoolId || !challenge) return;
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

                    // Update leaderboard completed challenges count
                    const leaderboardRef = doc(firestore, 'ela_leaderboard', user.uid);
                    await setDoc(leaderboardRef, {
                        userId: user.uid,
                        userName: user.displayName || user.email,
                        profilePictureUrl: user.photoURL || '',
                        total_challenges_completed: increment(1),
                        schoolId: schoolId
                    }, { merge: true });

                    toast({ title: "Grading complete!", description: "Check your feedback and score card!" });
                }
            } else {
                throw new Error(result.error || "Coaching evaluation error");
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Grading Error", description: e.message || "AI could not evaluate your writing." });
        } finally {
            setIsEvaluating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-5xl h-[90vh] bg-slate-950 border border-slate-800 text-slate-100 flex flex-col rounded-3xl shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-white flex items-center gap-2">
                        ✍️ {challenge.title}
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Type your essay or narrative. You will get live grammatical and stylistic AI feedback.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden py-2 min-h-0">
                    <div className="flex flex-col gap-4 overflow-hidden">
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl relative">
                            <h4 className="font-bold text-xs uppercase text-indigo-400 mb-1">Writing Prompt</h4>
                            <p className="text-slate-250 leading-relaxed italic text-sm">"{challenge.prompt}"</p>
                            <Badge className="absolute top-2 right-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">{challenge.challengeType}</Badge>
                        </div>
                        <Textarea 
                            value={draft} 
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Type your response here (minimum 50 characters required for AI evaluation)..."
                            className="flex-1 bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500 rounded-xl resize-none text-lg font-serif p-5 leading-relaxed shadow-inner focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            disabled={!!evaluation}
                        />
                    </div>
                    <div className="flex flex-col gap-4 overflow-hidden">
                        <h4 className="font-bold text-slate-350 flex justify-between items-center">
                            <span>AI Writing Coach Feedback</span>
                            {evaluation && <Badge className="bg-indigo-600 font-mono">Score: {evaluation.score}%</Badge>}
                        </h4>
                        <ScrollArea className="flex-1 border border-slate-800 rounded-xl bg-slate-900/20 p-5 overflow-y-auto">
                            {evaluation ? (
                                <div className="space-y-4 animate-in fade-in">
                                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
                                        <h5 className="font-bold text-sm text-indigo-400 mb-1">Summary Review</h5>
                                        <p className="text-sm text-slate-300 italic leading-relaxed">"{evaluation.summary}"</p>
                                    </div>
                                    {evaluation.strengths && evaluation.strengths.length > 0 && (
                                        <div className="space-y-2">
                                            <h5 className="font-bold text-xs uppercase text-emerald-400 flex items-center gap-1.5">
                                                <CheckCircle2 className="h-4 w-4"/> Key Strengths
                                            </h5>
                                            <ul className="text-sm space-y-2 text-slate-300">
                                                {evaluation.strengths.map((s:string, i:number) => (
                                                    <li key={i} className="flex gap-2 bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg">
                                                        <span>•</span> {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center px-6">
                                    <Sparkles className="h-12 w-12 mb-4 text-indigo-400/20 animate-pulse"/>
                                    <p className="text-sm">Submit your draft to receive detailed metrics and grading recommendations from the AI coach.</p>
                                </div>
                            )}
                        </ScrollArea>
                        {!evaluation && (
                            <Button 
                                onClick={handleAutoGrade} 
                                disabled={isEvaluating || draft.length < 50} 
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 h-12 flex items-center justify-center gap-2"
                            >
                                {isEvaluating ? <Loader2 className="animate-spin h-5 w-5"/> : <Sparkles className="h-4 w-4"/>}
                                Submit for AI Evaluation (5 credits)
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
            <Card className="border border-slate-850 bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-2xl font-black text-white flex items-center gap-2">
                        ✍️ Stylistic Writing Workshop
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Choose a prompt to practice composition, essay structuring, and storytelling.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0 pt-4">
                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-400 mb-2"/>
                            <span className="text-slate-400 text-xs">Unlocking writing vault...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {challenges?.map(c => {
                                const isDone = submissions?.some(s => s.challenge_id === c.id);
                                return (
                                    <div 
                                        key={c.id} 
                                        className="bg-slate-950/80 border border-slate-900 hover:border-indigo-500/50 hover:bg-slate-900/40 transition-all cursor-pointer rounded-2xl group flex flex-col justify-between p-5 shadow-lg"
                                        onClick={() => { setSelectedChallengeId(c.id); setIsWorkspaceOpen(true); }}
                                    >
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-start">
                                                <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">{c.challengeType}</Badge>
                                                {isDone && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0"/>}
                                            </div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">{c.title}</h3>
                                            <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed italic">"{c.prompt}"</p>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            className="text-indigo-400 font-bold group-hover:text-white group-hover:bg-indigo-655 w-full mt-5 bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 rounded-xl h-10 flex items-center justify-center gap-1.5 transition-all text-indigo-400"
                                        >
                                            {isDone ? "Review Grade" : "Start Composition"} <ChevronRight className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                )
                            })}
                            {(!challenges || challenges.length === 0) && (
                                <div className="col-span-2 text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
                                    <FolderOpen className="h-10 w-10 text-slate-700 mx-auto mb-2" />
                                    <p className="text-sm font-semibold">No writing challenges available</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {isStaff ? "Use the AI Generator in the Manage tab to populate the list." : "Ask your instructor to add some exercises."}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
            <ActiveChallengeDialog challenge={activeChallenge} existingSubmission={existingSubmission} open={isWorkspaceOpen} setOpen={setIsWorkspaceOpen} />
        </>
    );
}

// --- SUB-COMPONENT: ELA CONTENT MANAGEMENT PANEL (TEACHER CRUD) ---
function ManageProblems() {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();
    
    // Fetch classes
    const { data: classes } = useCollection<Class>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));

    // --- Submodule Queries ---
    const { data: grammarDrills, isLoading: isLoadingGrammar } = useCollection<ElaGrammarDrill>(
        useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'ela_grammar_drills'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId])
    );
    const { data: readingPassages, isLoading: isLoadingReading } = useCollection<ElaReadingPassage>(
        useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'ela_reading_passages'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId])
    );
    const { data: writingChallenges, isLoading: isLoadingWriting } = useCollection<ElaWritingChallenge>(
        useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'ela_writing_challenges'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId])
    );

    // --- State flags ---
    const [isGrammarFormOpen, setIsGrammarFormOpen] = useState(false);
    const [isGrammarAiOpen, setIsGrammarAiOpen] = useState(false);

    // --- Grammar Manual Form state ---
    const [gTopic, setGTopic] = useState('');
    const [gDifficulty, setGDifficulty] = useState('Easy');
    const [gClassId, setGClassId] = useState('');
    const [gQuestion, setGQuestion] = useState('');
    const [gOptions, setGOptions] = useState(['', '', '', '']);
    const [gCorrect, setGCorrect] = useState('');
    const [gExplanation, setGExplanation] = useState('');
    const [isSavingGrammar, setIsSavingGrammar] = useState(false);

    // --- Reading Passage AI Generator state ---
    const [readAiTopic, setReadAiTopic] = useState('');
    const [readAiLevel, setReadAiLevel] = useState('Grade 9');
    const [readAiQuestionsCount, setReadAiQuestionsCount] = useState('3');
    const [readAiClassId, setReadAiClassId] = useState('');
    const [isGeneratingReading, setIsGeneratingReading] = useState(false);
    const [generatedReadingResult, setGeneratedReadingResult] = useState<any>(null);
    const [isReadingAiOpen, setIsReadingAiOpen] = useState(false);

    // --- Reading Passage Manual Generator state ---
    const [readManualTitle, setReadManualTitle] = useState('');
    const [readManualLevel, setReadManualLevel] = useState('Grade 9');
    const [readManualText, setReadManualText] = useState('');
    const [readManualClassId, setReadManualClassId] = useState('');
    const [readManualQuestions, setReadManualQuestions] = useState<any[]>([{ question: '', correct_answer_key: '', explanation: '' }]);
    const [isSavingReading, setIsSavingReading] = useState(false);
    const [isReadingManualOpen, setIsReadingManualOpen] = useState(false);

    // --- Writing Challenge AI Generator state ---
    const [writeAiTopic, setWriteAiTopic] = useState('');
    const [writeAiType, setWriteAiType] = useState('Creative Writing');
    const [writeAiClassId, setWriteAiClassId] = useState('');
    const [isGeneratingWriting, setIsGeneratingWriting] = useState(false);
    const [generatedWritingResult, setGeneratedWritingResult] = useState<any>(null);
    const [isWritingAiOpen, setIsWritingAiOpen] = useState(false);

    // --- Writing Challenge Manual Generator state ---
    const [writeManualTitle, setWriteManualTitle] = useState('');
    const [writeManualType, setWriteManualType] = useState('Creative Writing');
    const [writeManualPrompt, setWriteManualPrompt] = useState('');
    const [writeManualClassId, setWriteManualClassId] = useState('');
    const [isSavingWriting, setIsSavingWriting] = useState(false);
    const [isWritingManualOpen, setIsWritingManualOpen] = useState(false);

    // --- Handlers for Deletion ---
    const handleDeleteGrammar = async (id: string) => {
        if(!firestore || !id) return;
        if(!confirm("Are you sure you want to permanently delete this grammar drill?")) return;
        try {
            await deleteDoc(doc(firestore, 'ela_grammar_drills', id));
            toast({ title: "Drill deleted", description: "The grammar drill has been deleted from your school vault." });
        } catch(e) {
            toast({ variant: 'destructive', title: "Delete Error", description: "Failed to delete from database." });
        }
    };

    const handleDeleteReading = async (id: string) => {
        if(!firestore || !id) return;
        if(!confirm("Are you sure you want to permanently delete this reading passage?")) return;
        try {
            await deleteDoc(doc(firestore, 'ela_reading_passages', id));
            toast({ title: "Passage deleted", description: "The reading passage has been deleted from your school vault." });
        } catch(e) {
            toast({ variant: 'destructive', title: "Delete Error", description: "Failed to delete from database." });
        }
    };

    const handleDeleteWriting = async (id: string) => {
        if(!firestore || !id) return;
        if(!confirm("Are you sure you want to permanently delete this writing challenge?")) return;
        try {
            await deleteDoc(doc(firestore, 'ela_writing_challenges', id));
            toast({ title: "Challenge deleted", description: "The writing challenge has been deleted from your school vault." });
        } catch(e) {
            toast({ variant: 'destructive', title: "Delete Error", description: "Failed to delete from database." });
        }
    };

    // --- Submit handlers ---
    const handleSaveManualGrammar = async () => {
        if (!gTopic || !gQuestion || !gCorrect || !gClassId || !schoolId || !firestore) {
            toast({ variant: 'destructive', title: "Missing Fields", description: "Please complete all fields including correct options and class." });
            return;
        }
        setIsSavingGrammar(true);
        try {
            await addDoc(collection(firestore, 'ela_grammar_drills'), {
                topic: gTopic,
                difficulty: gDifficulty,
                classId: gClassId,
                question_prompt: gQuestion,
                options: gOptions,
                correct_answer: gCorrect,
                explanation: gExplanation,
                schoolId: schoolId
            });
            toast({ title: "Drill Saved", description: "Successfully added new grammar drill!" });
            setIsGrammarFormOpen(false);
            setGTopic(''); setGQuestion(''); setGOptions(['', '', '', '']); setGCorrect(''); setGExplanation('');
        } catch(e) {
            toast({ variant: 'destructive', title: "Database Error", description: "Could not write manual drill." });
        } finally {
            setIsSavingGrammar(false);
        }
    };

    const handleGenerateAiReading = async () => {
        if (!readAiTopic || !readAiLevel || !readAiClassId || !schoolId) {
            toast({ variant: 'destructive', title: "Missing parameters", description: "Please complete topic, level, and target class matrix." });
            return;
        }
        setIsGeneratingReading(true);
        setGeneratedReadingResult(null);
        try {
            const result = await generateReadingPassage({
                topic: readAiTopic,
                reading_level: readAiLevel,
                numQuestions: Number(readAiQuestionsCount),
                schoolId: schoolId
            });

            if (result.success && result.data) {
                setGeneratedReadingResult(result.data);
                toast({ title: "Passage Generated!", description: "Review, edit, and click Save to vault." });
            } else {
                toast({ variant: 'destructive', title: "AI Error", description: result.error || "Generation failed." });
            }
        } catch(e: any) {
            toast({ variant: 'destructive', title: "Server Error", description: e.message || "Failed to contact AI engine." });
        } finally {
            setIsGeneratingReading(false);
        }
    };

    const handleSaveAiReading = async () => {
        if(!generatedReadingResult || !readAiClassId || !schoolId || !firestore) return;
        setIsSavingReading(true);
        try {
            await addDoc(collection(firestore, 'ela_reading_passages'), {
                title: generatedReadingResult.title,
                passage_text: generatedReadingResult.passage_text,
                reading_level: readAiLevel,
                question_set: generatedReadingResult.question_set.map((q: any) => ({
                    question: q.question,
                    type: 'Short Answer',
                    correct_answer_key: q.correct_answer_key,
                    explanation: q.explanation || ''
                })),
                classId: readAiClassId,
                schoolId: schoolId
            });
            toast({ title: "Passage Saved", description: "Successfully injected into ELA Reading bank." });
            setGeneratedReadingResult(null);
            setIsReadingAiOpen(false);
            setReadAiTopic('');
        } catch(e) {
            toast({ variant: 'destructive', title: "Database Error", description: "Could not save generated passage." });
        } finally {
            setIsSavingReading(false);
        }
    };

    const handleSaveManualReading = async () => {
        if(!readManualTitle || !readManualText || !readManualClassId || !schoolId || !firestore) {
            toast({ variant: 'destructive', title: "Missing Fields", description: "Complete all fields." });
            return;
        }
        setIsSavingReading(true);
        try {
            await addDoc(collection(firestore, 'ela_reading_passages'), {
                title: readManualTitle,
                passage_text: readManualText,
                reading_level: readManualLevel,
                question_set: readManualQuestions.map((q) => ({
                    question: q.question,
                    type: 'Short Answer',
                    correct_answer_key: q.correct_answer_key,
                    explanation: q.explanation || ''
                })),
                classId: readManualClassId,
                schoolId: schoolId
            });
            toast({ title: "Passage Saved", description: "Successfully saved manual reading passage." });
            setIsReadingManualOpen(false);
            setReadManualTitle(''); setReadManualText(''); setReadManualQuestions([{ question: '', correct_answer_key: '', explanation: '' }]);
        } catch(e) {
            toast({ variant: 'destructive', title: "Database Error", description: "Could not save manual passage." });
        } finally {
            setIsSavingReading(false);
        }
    };

    const handleGenerateAiWriting = async () => {
        if (!writeAiTopic || !writeAiType || !writeAiClassId || !schoolId) {
            toast({ variant: 'destructive', title: "Missing parameters", description: "Please complete topic, type, and target class matrix." });
            return;
        }
        setIsGeneratingWriting(true);
        setGeneratedWritingResult(null);
        try {
            const result = await generateWritingChallenge({
                topic: writeAiTopic,
                challengeType: writeAiType as any,
                schoolId: schoolId
            });

            if (result.success && result.data) {
                setGeneratedWritingResult(result.data);
                toast({ title: "Challenge Generated!", description: "Review and click Save to vault." });
            } else {
                toast({ variant: 'destructive', title: "AI Error", description: result.error || "Generation failed." });
            }
        } catch(e: any) {
            toast({ variant: 'destructive', title: "Server Error", description: e.message || "Failed to contact AI engine." });
        } finally {
            setIsGeneratingWriting(false);
        }
    };

    const handleSaveAiWriting = async () => {
        if(!generatedWritingResult || !writeAiClassId || !schoolId || !firestore) return;
        setIsSavingWriting(true);
        try {
            await addDoc(collection(firestore, 'ela_writing_challenges'), {
                title: generatedWritingResult.title,
                challengeType: generatedWritingResult.challengeType,
                prompt: generatedWritingResult.prompt,
                classId: writeAiClassId,
                schoolId: schoolId
            });
            toast({ title: "Challenge Saved", description: "Successfully injected into ELA Writing bank." });
            setGeneratedWritingResult(null);
            setIsWritingAiOpen(false);
            setWriteAiTopic('');
        } catch(e) {
            toast({ variant: 'destructive', title: "Database Error", description: "Could not save generated challenge." });
        } finally {
            setIsSavingWriting(false);
        }
    };

    const handleSaveManualWriting = async () => {
        if(!writeManualTitle || !writeManualPrompt || !writeManualClassId || !schoolId || !firestore) {
            toast({ variant: 'destructive', title: "Missing Fields", description: "Complete all fields." });
            return;
        }
        setIsSavingWriting(true);
        try {
            await addDoc(collection(firestore, 'ela_writing_challenges'), {
                title: writeManualTitle,
                challengeType: writeManualType,
                prompt: writeManualPrompt,
                classId: writeManualClassId,
                schoolId: schoolId
            });
            toast({ title: "Challenge Saved", description: "Successfully saved manual writing challenge." });
            setIsWritingManualOpen(false);
            setWriteManualTitle(''); setWriteManualPrompt('');
        } catch(e) {
            toast({ variant: 'destructive', title: "Database Error", description: "Could not save manual challenge." });
        } finally {
            setIsSavingWriting(false);
        }
    };

    const getClassName = (id?: string) => {
        return classes?.find(c => c.id === id)?.name || id || 'All';
    };

    return (
        <Card className="border border-slate-800 bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
            <CardHeader className="px-0 pt-0 pb-4 border-b border-slate-900 mb-6">
                <div className="flex items-center gap-2">
                    <Database className="h-6 w-6 text-indigo-400" />
                    <div>
                        <CardTitle className="text-2xl font-black text-white">ELA Problem bank & Curriculum Matrix</CardTitle>
                        <CardDescription className="text-slate-400">Review, add, or generate tasks for all ELA modules.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-0 pb-0 pt-2">
                <Tabs defaultValue="manage-grammar" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 p-1 bg-slate-950 border border-slate-900 rounded-2xl mb-8">
                        <TabsTrigger value="manage-grammar" className="rounded-xl py-2.5 text-xs font-semibold data-[state=active]:bg-indigo-600">Grammar Drills</TabsTrigger>
                        <TabsTrigger value="manage-reading" className="rounded-xl py-2.5 text-xs font-semibold data-[state=active]:bg-indigo-600">Reading Passages</TabsTrigger>
                        <TabsTrigger value="manage-writing" className="rounded-xl py-2.5 text-xs font-semibold data-[state=active]:bg-indigo-600">Writing Challenges</TabsTrigger>
                    </TabsList>

                    {/* --- GRAMMAR SECTION --- */}
                    <TabsContent value="manage-grammar" className="space-y-6">
                        <div className="flex gap-3 justify-end">
                            <Dialog open={isGrammarAiOpen} onOpenChange={setIsGrammarAiOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="bg-slate-950/80 border-slate-800 hover:bg-slate-900 hover:text-white text-indigo-400 font-bold rounded-xl h-11">
                                        <Wand2 className="mr-2 h-4 w-4 animate-pulse text-indigo-400"/> Generate with AI
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl bg-slate-950 border-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black text-white">AI Grammar Generator</DialogTitle>
                                        <DialogDescription className="text-slate-400">Generate multi-choice grammar drills directly. Deducts 5 credits.</DialogDescription>
                                    </DialogHeader>
                                    <div className="p-1 max-h-[80vh] overflow-y-auto">
                                        <AiProblemGenerator subject="ELA Grammar" setOpen={setIsGrammarAiOpen} />
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isGrammarFormOpen} onOpenChange={setIsGrammarFormOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl h-11 shadow-lg shadow-indigo-500/20">
                                        <PlusCircle className="mr-2 h-4 w-4"/> Manual Formulation
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-950 border-slate-850 text-white rounded-3xl max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black text-white">New Grammar Formulation</DialogTitle>
                                        <DialogDescription className="text-slate-400">Add a manually designed grammar puzzle into the matrix.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-slate-400 uppercase font-black">Class Matrix</Label>
                                                <Select value={gClassId} onValueChange={setGClassId}>
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-11">
                                                        <SelectValue placeholder="Select Class" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                        {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-slate-400 uppercase font-black">Topic</Label>
                                                <Input value={gTopic} onChange={e => setGTopic(e.target.value)} placeholder="e.g. Pronouns" className="bg-slate-900 border-slate-800 text-white rounded-xl h-11"/>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-400 uppercase font-black">Question Prompt</Label>
                                            <Textarea value={gQuestion} onChange={e => setGQuestion(e.target.value)} placeholder="Type the incomplete sentence or question prompt..." className="bg-slate-900 border-slate-800 text-white rounded-xl h-24 p-3"/>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {gOptions.map((opt, i) => (
                                                <div key={i} className="space-y-1">
                                                    <Label className="text-[10px] text-slate-400 font-bold">Option {['A', 'B', 'C', 'D'][i]}</Label>
                                                    <Input value={opt} onChange={e => {
                                                        const copy = [...gOptions];
                                                        copy[i] = e.target.value;
                                                        setGOptions(copy);
                                                    }} placeholder={`Option value`} className="bg-slate-900 border-slate-800 text-white rounded-xl h-10"/>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-slate-400 uppercase font-black">Correct Option Key</Label>
                                                <Select value={gCorrect} onValueChange={setGCorrect}>
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-11">
                                                        <SelectValue placeholder="Correct option" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                        {gOptions.filter(opt => opt.trim() !== '').length > 0 ? (
                                                            gOptions.filter(opt => opt.trim() !== '').map((opt, idx) => (
                                                                <SelectItem key={idx} value={opt}>{opt}</SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem value="none" disabled>Type options above first</SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs text-slate-400 uppercase font-black">Difficulty Scale</Label>
                                                <Select value={gDifficulty} onValueChange={setGDifficulty}>
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-11">
                                                        <SelectValue placeholder="Difficulty" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                        <SelectItem value="Easy">Easy</SelectItem>
                                                        <SelectItem value="Medium">Medium</SelectItem>
                                                        <SelectItem value="Hard">Hard</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-400 uppercase font-black">Explanation (Why?)</Label>
                                            <Textarea value={gExplanation} onChange={e => setGExplanation(e.target.value)} placeholder="Write an explanation why this choice is right..." className="bg-slate-900 border-slate-800 text-white rounded-xl h-20 p-3"/>
                                        </div>
                                    </div>
                                    <DialogFooter className="pt-6">
                                        <Button onClick={handleSaveManualGrammar} disabled={isSavingGrammar} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl w-full">
                                            {isSavingGrammar ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>}
                                            Save Grammar Puzzle
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {isLoadingGrammar ? (
                             <Loader2 className="animate-spin mx-auto text-indigo-400 my-6"/>
                        ) : !grammarDrills || grammarDrills.length === 0 ? (
                             <p className="text-center text-slate-500 py-6 text-sm">No grammar drills in this school bank bank yet.</p>
                        ) : (
                             <div className="overflow-x-auto border border-slate-900 rounded-2xl bg-slate-950/20">
                                 <Table>
                                     <TableHeader>
                                         <TableRow className="border-b border-slate-800 hover:bg-transparent">
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4">Topic</TableHead>
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4">Class Target</TableHead>
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4">Difficulty</TableHead>
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4">Question Prompt</TableHead>
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4 text-center">Action</TableHead>
                                         </TableRow>
                                     </TableHeader>
                                     <TableBody>
                                         {grammarDrills.map(drill => (
                                             <TableRow key={drill.id} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-all">
                                                 <TableCell className="font-bold text-slate-200 py-4">{drill.topic}</TableCell>
                                                 <TableCell className="py-4 text-slate-300">{getClassName(drill.classId)}</TableCell>
                                                 <TableCell className="py-4">
                                                     <Badge className="bg-indigo-500/10 text-indigo-455 border border-indigo-500/20 text-indigo-400">{drill.difficulty || 'Easy'}</Badge>
                                                 </TableCell>
                                                 <TableCell className="py-4 text-slate-400 max-w-sm text-xs truncate">{drill.question_prompt}</TableCell>
                                                 <TableCell className="py-4 text-center">
                                                     <Button variant="ghost" size="icon" onClick={() => handleDeleteGrammar(drill.id)} className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl">
                                                         <Trash2 className="h-4.5 w-4.5" />
                                                     </Button>
                                                 </TableCell>
                                             </TableRow>
                                         ))}
                                     </TableBody>
                                 </Table>
                             </div>
                        )}
                    </TabsContent>

                    {/* --- READING PASSAGES SECTION --- */}
                    <TabsContent value="manage-reading" className="space-y-6">
                        <div className="flex gap-3 justify-end">
                            <Dialog open={isReadingAiOpen} onOpenChange={setIsReadingAiOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="bg-slate-950/80 border-slate-800 hover:bg-slate-900 hover:text-white text-indigo-400 font-bold rounded-xl h-11">
                                        <Wand2 className="mr-2 h-4 w-4 animate-pulse text-indigo-400"/> Generate Passage with AI
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl bg-slate-950 border-slate-900 text-white rounded-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black text-white">AI Passage Synthesizer</DialogTitle>
                                        <DialogDescription className="text-slate-400">Generate a custom story, reading comprehension passage & questions. Costs 5 credits.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs uppercase font-black text-slate-455 text-slate-400">Class Target</Label>
                                                <Select value={readAiClassId} onValueChange={setReadAiClassId}>
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-11">
                                                        <SelectValue placeholder="Select class" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                        {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs uppercase font-black text-slate-400">Target Reading Level</Label>
                                                <Select value={readAiLevel} onValueChange={setReadAiLevel}>
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-11">
                                                        <SelectValue placeholder="Reading Grade" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                        <SelectItem value="Grade 7">Grade 7</SelectItem>
                                                        <SelectItem value="Grade 8">Grade 8</SelectItem>
                                                        <SelectItem value="Grade 9">Grade 9</SelectItem>
                                                        <SelectItem value="Grade 10">Grade 10</SelectItem>
                                                        <SelectItem value="Grade 11">Grade 11</SelectItem>
                                                        <SelectItem value="Grade 12">Grade 12</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 items-end">
                                            <div className="col-span-2 space-y-1">
                                                <Label className="text-xs uppercase font-black text-slate-400">Topic theme</Label>
                                                <Input value={readAiTopic} onChange={e => setReadAiTopic(e.target.value)} placeholder="e.g. Space Exploration, African Folklore" className="bg-slate-900 border-slate-800 text-white rounded-xl h-11"/>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs uppercase font-black text-slate-400">Questions Count</Label>
                                                <Select value={readAiQuestionsCount} onValueChange={setReadAiQuestionsCount}>
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-11">
                                                        <SelectValue placeholder="Questions count" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                        <SelectItem value="2">2 Questions</SelectItem>
                                                        <SelectItem value="3">3 Questions</SelectItem>
                                                        <SelectItem value="4">4 Questions</SelectItem>
                                                        <SelectItem value="5">5 Questions</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        
                                        {!generatedReadingResult && (
                                            <Button onClick={handleGenerateAiReading} disabled={isGeneratingReading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold h-11 rounded-xl shadow-lg transition-all">
                                                {isGeneratingReading ? <><Loader2 className="animate-spin mr-2 h-4 w-4"/> AI drafting passage...</> : "Synthesize Passage & Exercises"}
                                            </Button>
                                        )}

                                        {generatedReadingResult && (
                                            <div className="space-y-4 border-t border-slate-900 pt-6 animate-in fade-in">
                                                <h4 className="text-sm font-bold text-indigo-400">Generated Preview (You can modify before saving)</h4>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] uppercase text-slate-500">Edit Title</Label>
                                                    <Input value={generatedReadingResult.title} onChange={e => setGeneratedReadingResult({...generatedReadingResult, title: e.target.value})} className="bg-slate-900 border-slate-800 rounded-xl text-white"/>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] uppercase text-slate-500">Edit Passage Text</Label>
                                                    <Textarea value={generatedReadingResult.passage_text} onChange={e => setGeneratedReadingResult({...generatedReadingResult, passage_text: e.target.value})} className="bg-slate-900 border-slate-800 text-white rounded-xl p-3 h-48 font-serif leading-relaxed text-sm"/>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] uppercase text-slate-500">Questions & Answers Key</Label>
                                                    <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-850">
                                                        {generatedReadingResult.question_set.map((q: any, idx: number) => (
                                                            <div key={idx} className="space-y-1 text-xs">
                                                                <p className="font-semibold text-slate-200">Q{idx + 1}: {q.question}</p>
                                                                <p className="text-slate-400">Key: <span className="text-emerald-400 italic">"{q.correct_answer_key}"</span></p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <Button onClick={handleSaveAiReading} disabled={isSavingReading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl">
                                                    {isSavingReading ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>}
                                                    Commit Passage to Library
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isReadingManualOpen} onOpenChange={setIsReadingManualOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl h-11 shadow-lg shadow-indigo-500/20">
                                        <PlusCircle className="mr-2 h-4 w-4"/> Manual formulation
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-950 border-slate-850 text-white rounded-3xl max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black text-white">Create Manual Reading Passage</DialogTitle>
                                        <DialogDescription className="text-slate-400">Insert custom comprehension passage text and questions.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs uppercase font-black text-slate-400">Target Class</Label>
                                                <Select value={readManualClassId} onValueChange={setReadManualClassId}>
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-11">
                                                        <SelectValue placeholder="Select Class" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                        {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <Label className="text-xs uppercase font-black text-slate-400">Passage Title</Label>
                                                <Input value={readManualTitle} onChange={e => setReadManualTitle(e.target.value)} placeholder="e.g. The Brave Explorer" className="bg-slate-900 border-slate-800 text-white rounded-xl h-11"/>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs uppercase font-black text-slate-400">Reading Level Scale</Label>
                                                <Select value={readManualLevel} onValueChange={setReadManualLevel}>
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-11">
                                                        <SelectValue placeholder="Reading Level" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                        <SelectItem value="Grade 7">Grade 7</SelectItem>
                                                        <SelectItem value="Grade 8">Grade 8</SelectItem>
                                                        <SelectItem value="Grade 9">Grade 9</SelectItem>
                                                        <SelectItem value="Grade 10">Grade 10</SelectItem>
                                                        <SelectItem value="Grade 11">Grade 11</SelectItem>
                                                        <SelectItem value="Grade 12">Grade 12</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase font-black text-slate-400">Passage Text Body</Label>
                                            <Textarea value={readManualText} onChange={e => setReadManualText(e.target.value)} placeholder="Paste/write reading text here..." className="bg-slate-900 border-slate-800 text-white rounded-xl h-40 p-3 font-serif"/>
                                        </div>
                                        
                                        <div className="space-y-4 border-t border-slate-900 pt-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Comprehension Exercises</h4>
                                                <Button type="button" variant="outline" size="sm" onClick={() => setReadManualQuestions([...readManualQuestions, { question: '', correct_answer_key: '', explanation: '' }])} className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 rounded-lg">
                                                    <Plus className="w-3.5 h-3.5 mr-1"/> Add Question
                                                </Button>
                                            </div>
                                            {readManualQuestions.map((q, idx) => (
                                                <div key={idx} className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl space-y-3 relative">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-mono font-bold text-slate-455">Question {idx + 1}</span>
                                                        {readManualQuestions.length > 1 && (
                                                            <Button type="button" variant="ghost" size="icon" onClick={() => setReadManualQuestions(readManualQuestions.filter((_, i) => i !== idx))} className="h-6 w-6 text-slate-500 hover:text-rose-400">
                                                                <Trash className="w-4 h-4"/>
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Input value={q.question} onChange={e => {
                                                            const copy = [...readManualQuestions];
                                                            copy[idx].question = e.target.value;
                                                            setReadManualQuestions(copy);
                                                        }} placeholder="Question text..." className="bg-slate-900 border-slate-800 text-white rounded-xl h-10"/>
                                                        <Input value={q.correct_answer_key} onChange={e => {
                                                            const copy = [...readManualQuestions];
                                                            copy[idx].correct_answer_key = e.target.value;
                                                            setReadManualQuestions(copy);
                                                        }} placeholder="Correct answer key..." className="bg-slate-900 border-slate-800 text-white rounded-xl h-10"/>
                                                        <Input value={q.explanation} onChange={e => {
                                                            const copy = [...readManualQuestions];
                                                            copy[idx].explanation = e.target.value;
                                                            setReadManualQuestions(copy);
                                                        }} placeholder="Brief explanation key (optional)..." className="bg-slate-900 border-slate-800 text-white rounded-xl h-10"/>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <DialogFooter className="pt-6 border-t border-slate-900 mt-4">
                                        <Button onClick={handleSaveManualReading} disabled={isSavingReading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl w-full">
                                            {isSavingReading ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>}
                                            Commit Manual Passage
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {isLoadingReading ? (
                             <Loader2 className="animate-spin mx-auto text-indigo-400 my-6"/>
                        ) : !readingPassages || readingPassages.length === 0 ? (
                             <p className="text-center text-slate-500 py-6 text-sm">No reading passages in bank yet.</p>
                        ) : (
                             <div className="overflow-x-auto border border-slate-900 rounded-2xl bg-slate-950/20">
                                 <Table>
                                     <TableHeader>
                                         <TableRow className="border-b border-slate-800 hover:bg-transparent">
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4">Title</TableHead>
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4">Class Target</TableHead>
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4">Reading Level</TableHead>
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4">Questions Count</TableHead>
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4 text-center">Action</TableHead>
                                         </TableRow>
                                     </TableHeader>
                                     <TableBody>
                                         {readingPassages.map(p => (
                                             <TableRow key={p.id} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-all">
                                                 <TableCell className="font-bold text-slate-200 py-4">{p.title}</TableCell>
                                                 <TableCell className="py-4 text-slate-350">{getClassName(p.classId)}</TableCell>
                                                 <TableCell className="py-4">
                                                     <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{p.reading_level}</Badge>
                                                 </TableCell>
                                                 <TableCell className="py-4 text-slate-400 font-mono text-xs">{p.question_set?.length || 0} Questions</TableCell>
                                                 <TableCell className="py-4 text-center">
                                                     <Button variant="ghost" size="icon" onClick={() => handleDeleteReading(p.id)} className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl">
                                                         <Trash2 className="h-4.5 w-4.5" />
                                                     </Button>
                                                 </TableCell>
                                             </TableRow>
                                         ))}
                                     </TableBody>
                                 </Table>
                             </div>
                        )}
                    </TabsContent>

                    {/* --- WRITING CHALLENGES SECTION --- */}
                    <TabsContent value="manage-writing" className="space-y-6">
                        <div className="flex gap-3 justify-end">
                            <Dialog open={isWritingAiOpen} onOpenChange={setIsWritingAiOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="bg-slate-950/80 border-slate-800 hover:bg-slate-900 hover:text-white text-indigo-400 font-bold rounded-xl h-11">
                                        <Wand2 className="mr-2 h-4 w-4 animate-pulse text-indigo-400"/> Generate Writing AI
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl bg-slate-950 border-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl p-6">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black text-white">AI Writing Challenge Synthesizer</DialogTitle>
                                        <DialogDescription className="text-slate-400">Generate style essays or summarization challenges. Costs 5 credits.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs uppercase font-black text-slate-400">Class Target</Label>
                                                <Select value={writeAiClassId} onValueChange={setWriteAiClassId}>
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-11">
                                                        <SelectValue placeholder="Select class" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                        {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs uppercase font-black text-slate-400">Challenge Type</Label>
                                                <Select value={writeAiType} onValueChange={setWriteAiType}>
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-11">
                                                        <SelectValue placeholder="Select Type" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                        <SelectItem value="Creative Writing">Creative Writing</SelectItem>
                                                        <SelectItem value="Summarization">Summarization</SelectItem>
                                                        <SelectItem value="Essay">Essay</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase font-black text-slate-400">Topic theme</Label>
                                            <Input value={writeAiTopic} onChange={e => setWriteAiTopic(e.target.value)} placeholder="e.g. My memorable trip, Climate Change impact" className="bg-slate-900 border-slate-800 text-white rounded-xl h-11"/>
                                        </div>

                                        {!generatedWritingResult && (
                                            <Button onClick={handleGenerateAiWriting} disabled={isGeneratingWriting} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold h-11 rounded-xl shadow-lg transition-all">
                                                {isGeneratingWriting ? <><Loader2 className="animate-spin mr-2 h-4 w-4"/> AI drafting challenge...</> : "Synthesize Challenge Prompt"}
                                            </Button>
                                        )}

                                        {generatedWritingResult && (
                                            <div className="space-y-4 border-t border-slate-900 pt-6 animate-in fade-in">
                                                <h4 className="text-sm font-bold text-indigo-400">Generated Preview (You can modify before saving)</h4>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] uppercase text-slate-500 font-bold">Edit Title</Label>
                                                    <Input value={generatedWritingResult.title} onChange={e => setGeneratedWritingResult({...generatedWritingResult, title: e.target.value})} className="bg-slate-900 border-slate-800 rounded-xl text-white h-11"/>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] uppercase text-slate-500 font-bold">Edit Prompt Guidelines</Label>
                                                    <Textarea value={generatedWritingResult.prompt} onChange={e => setGeneratedWritingResult({...generatedWritingResult, prompt: e.target.value})} className="bg-slate-900 border-slate-800 text-slate-200 rounded-xl p-3 h-32 leading-relaxed text-sm"/>
                                                </div>
                                                <Button onClick={handleSaveAiWriting} disabled={isSavingWriting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl">
                                                    {isSavingWriting ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>}
                                                    Commit Writing Challenge to Vault
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isWritingManualOpen} onOpenChange={setIsWritingManualOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl h-11 shadow-lg shadow-indigo-500/20">
                                        <PlusCircle className="mr-2 h-4 w-4"/> Manual formulation
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-950 border-slate-850 text-white rounded-3xl max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black text-white">Create Manual Writing Challenge</DialogTitle>
                                        <DialogDescription className="text-slate-400">Design custom narrative or essay outlines manually.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Label className="text-xs uppercase font-black text-slate-400">Class Target</Label>
                                                <Select value={writeManualClassId} onValueChange={setWriteManualClassId}>
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-11">
                                                        <SelectValue placeholder="Select Class" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                        {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs uppercase font-black text-slate-400">Challenge Type</Label>
                                                <Select value={writeManualType} onValueChange={setWriteManualType}>
                                                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white rounded-xl h-11">
                                                        <SelectValue placeholder="Challenge Type" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                                        <SelectItem value="Creative Writing">Creative Writing</SelectItem>
                                                        <SelectItem value="Summarization">Summarization</SelectItem>
                                                        <SelectItem value="Essay">Essay</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase font-black text-slate-400">Title</Label>
                                            <Input value={writeManualTitle} onChange={e => setWriteManualTitle(e.target.value)} placeholder="e.g. Reflections of the Future" className="bg-slate-900 border-slate-800 text-white rounded-xl h-11"/>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs uppercase font-black text-slate-400">Prompt Instructions</Label>
                                            <Textarea value={writeManualPrompt} onChange={e => setWriteManualPrompt(e.target.value)} placeholder="Describe writing outline guidelines..." className="bg-slate-900 border-slate-800 text-white rounded-xl h-36 p-3"/>
                                        </div>
                                    </div>
                                    <DialogFooter className="pt-6">
                                        <Button onClick={handleSaveManualWriting} disabled={isSavingWriting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl w-full">
                                            {isSavingWriting ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>}
                                            Commit Writing Challenge
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {isLoadingWriting ? (
                             <Loader2 className="animate-spin mx-auto text-indigo-400 my-6"/>
                        ) : !writingChallenges || writingChallenges.length === 0 ? (
                             <p className="text-center text-slate-500 py-6 text-sm">No writing challenges in this bank yet.</p>
                        ) : (
                             <div className="overflow-x-auto border border-slate-900 rounded-2xl bg-slate-950/20">
                                 <Table>
                                     <TableHeader>
                                         <TableRow className="border-b border-slate-800 hover:bg-transparent">
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4">Title</TableHead>
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4">Class Target</TableHead>
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4">Challenge Type</TableHead>
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4">Prompt Outline</TableHead>
                                             <TableHead className="text-slate-400 text-xs font-bold uppercase py-4 text-center">Action</TableHead>
                                         </TableRow>
                                     </TableHeader>
                                     <TableBody>
                                         {writingChallenges.map(c => (
                                             <TableRow key={c.id} className="border-b border-slate-900/60 hover:bg-slate-900/20 transition-all">
                                                 <TableCell className="font-bold text-slate-200 py-4">{c.title}</TableCell>
                                                 <TableCell className="py-4 text-slate-350">{getClassName(c.classId)}</TableCell>
                                                 <TableCell className="py-4">
                                                     <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{c.challengeType}</Badge>
                                                 </TableCell>
                                                 <TableCell className="py-4 text-slate-400 max-w-sm text-xs truncate italic">"{c.prompt}"</TableCell>
                                                 <TableCell className="py-4 text-center">
                                                     <Button variant="ghost" size="icon" onClick={() => handleDeleteWriting(c.id)} className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl">
                                                         <Trash2 className="h-4.5 w-4.5" />
                                                     </Button>
                                                 </TableCell>
                                             </TableRow>
                                         ))}
                                     </TableBody>
                                 </Table>
                             </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

// --- MAIN PAGE ---
export default function ElaClubPage() {
  const { role } = useRole();
  const isTeacherOrAdmin = role === 'Teacher' || role === 'Administrator' || role === 'Director';

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-6 relative rounded-3xl border border-slate-900 shadow-2xl overflow-hidden">
      {/* Background ambient cosmic glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        {/* Deep indigo/purple gradient background banner */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
          {/* subtle interior glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
              <BookOpenCheck className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                ELA Club
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Refine your spelling, expand your vocabulary, and master narrative structure.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <CreditBalance />
          </div>
        </div>

        <Tabs defaultValue="grammar" className="w-full">
            <TabsList className={cn("grid w-full p-1 bg-slate-900 border border-slate-800/60 rounded-2xl mb-6", isTeacherOrAdmin ? "grid-cols-5" : "grid-cols-4")}>
                <TabsTrigger value="grammar" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-655 data-[state=active]:to-purple-655 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20"><Edit className="mr-2 h-4 w-4" /> Grammar</TabsTrigger>
                <TabsTrigger value="reading" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-655 data-[state=active]:to-purple-655 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20"><FileText className="mr-2 h-4 w-4" /> Reading</TabsTrigger>
                <TabsTrigger value="writing" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-655 data-[state=active]:to-purple-655 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20"><PenSquare className="mr-2 h-4 w-4" /> Writing</TabsTrigger>
                <TabsTrigger value="leaderboard" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-655 data-[state=active]:to-purple-655 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20"><Trophy className="mr-2 h-4 w-4" /> Leaderboard</TabsTrigger>
                {isTeacherOrAdmin && <TabsTrigger value="manage" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-655 data-[state=active]:to-purple-655 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-indigo-500/20"><Database className="mr-2 h-4 w-4" /> Manage Problems</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="grammar" className="mt-4"><GrammarPractice /></TabsContent>
            <TabsContent value="reading" className="mt-4"><ReadingPracticeTab /></TabsContent>
            <TabsContent value="writing" className="mt-4"><WritingSubmissionTab /></TabsContent>
            <TabsContent value="leaderboard" className="mt-4">
                <Card className="border border-slate-850 bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                    <CardHeader className="px-0 pt-0 pb-4">
                        <CardTitle className="text-2xl font-black text-white flex items-center gap-2">
                            🏆 ELA Hall of Fame
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            See the top performers in the school based on completed drills and writing submissions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pb-0 pt-4">
                        <ElaLeaderboard />
                    </CardContent>
                </Card>
            </TabsContent>
            {isTeacherOrAdmin && (
                <TabsContent value="manage" className="mt-4">
                    <ManageProblems />
                </TabsContent>
            )}
        </Tabs>
      </div>
    </div>
  );
}
