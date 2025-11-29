
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// All imports consolidated here.
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, where, setDoc, increment } from 'firebase/firestore';
import { 
  FlaskConical, Trophy, PencilRuler, Plus, Loader2, 
  Trash2, Lightbulb, CheckCircle2, Database, Sparkles, Wand2, XCircle, FolderOpen, Play, Atom
} from 'lucide-react';
import { format } from 'date-fns';
import { generateScienceQuestionAction } from '@/ai/flows/generate-science-question'; 

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Class, Student } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';


// --- NEW TYPES (Grouped) ---
interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuestionSet {
  id: string;
  title: string; // e.g. "Photosynthesis (5 Qs)"
  topic: string;
  difficulty: string;
  grade: string;
  questions: Question[]; // Array of questions inside one doc
  classId: string;
  createdAt: any;
}

interface LabFact {
  id: string;
  text: string;
  createdAt: any;
}

// --- UPDATED COMPONENT: Quiz Runner (With Debugging & Fixes) ---
function QuizRunnerDialog({ 
    questionSet, 
    open, 
    setOpen 
}: { 
    questionSet: QuestionSet | null, 
    open: boolean, 
    setOpen: (o: boolean) => void 
}) {
    const firestore = useFirestore();
    const { user } = useAuth(); 
    const { toast } = useToast(); // Added toast for error feedback
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false); 
    const [isSaving, setIsSaving] = useState(false); 

    if (!questionSet) return null;

    const currentQuestion = questionSet.questions[currentIndex];
    const totalQuestions = questionSet.questions.length;

    // 1. Handle Check (Updates the local score state)
    const handleCheck = () => {
        const isCorrect = selectedOption === currentQuestion.correctAnswer;
        if (isCorrect) {
            setScore(s => s + 1);
        }
        setShowFeedback(true);
    };

    // 2. Handle Next / Finish
    const handleNext = () => {
        setShowFeedback(false);
        
        if (currentIndex < totalQuestions - 1) {
            // Move to next question
            setSelectedOption('');
            setCurrentIndex(prev => prev + 1);
        } else {
            // End of quiz - Run the save logic
            finishQuiz(); 
        }
    };

    // 3. Finish & Save (The Logic you requested)
    const finishQuiz = async () => {
        setIsFinished(true);
        
        // Calculate final score including the last answer
        const finalScore = score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0);
        
        console.log('========================================');
        console.log('🚀 STARTING DIAGNOSTIC SUBMISSION');
        console.log('========================================');
        console.log('1. User State:', user ? `Logged in as ${user.uid}` : 'NULL (Logged Out)');
        console.log('2. Firestore State:', firestore ? 'Initialized' : 'NULL');
        console.log('3. Score to save:', finalScore);
        
        if (!user) {
            console.error('❌ ABORTING: No User found.');
            toast({ variant: 'destructive', title: 'Error', description: 'You are not logged in.' });
            return;
        }
        
        setIsSaving(true);
        
        try {
            // --- ATTEMPT 1: SAVE RESULT ---
            console.log('📝 Attempting to save to collection: science_lab_results');
            
            const resultData = {
                userId: user.uid,
                userName: user.displayName || user.email?.split('@')[0] || 'Student',
                quizTitle: questionSet.title,
                score: finalScore,
                total: totalQuestions,
                percentage: Math.round((finalScore / totalQuestions) * 100),
                date: serverTimestamp()
            };
            
            // LOG THE DATA WE ARE TRYING TO SEND
            console.log('   Data payload:', resultData);

            const resultRef = await addDoc(collection(firestore, 'science_lab_results'), resultData);
            console.log('✅ SUCCESS: Result saved. Doc ID:', resultRef.id);

            // --- ATTEMPT 2: UPDATE LEADERBOARD ---
            console.log('🏆 Attempting to update collection: science_lab_leaderboard');
            console.log('   Target Document ID:', user.uid);

            const userRef = doc(firestore, 'science_lab_leaderboard', user.uid);
            const leaderboardData = {
                userName: user.displayName || user.email?.split('@')[0] || 'Student',
                userId: user.uid,
                points: increment(finalScore * 10),
                quizzesPlayed: increment(1),
                lastActive: serverTimestamp()
            };

            await setDoc(userRef, leaderboardData, { merge: true });
            console.log('✅ SUCCESS: Leaderboard updated.');
            
            toast({ title: 'Success!', description: `Score saved! You got ${finalScore} points.` });

        } catch (error: any) {
            console.error('========================================');
            console.error('❌ CRITICAL ERROR CAUGHT');
            console.error('========================================');
            console.error('Error Code:', error.code);
            console.error('Error Message:', error.message);
            console.error('Full Error Object:', error);
            
            toast({
                variant: 'destructive',
                title: 'Save Failed',
                description: error.message
            });
        } finally {
            setIsSaving(false);
            console.log('========================================');
            console.log('🏁 DIAGNOSTIC COMPLETE');
            console.log('========================================');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setCurrentIndex(0);
            setScore(0);
            setIsFinished(false);
            setShowFeedback(false);
            setSelectedOption('');
        }, 300);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{questionSet.title}</DialogTitle>
                    <DialogDescription>
                        Question {currentIndex + 1} of {totalQuestions} • Score: {score}
                    </DialogDescription>
                </DialogHeader>
                
                {!isFinished ? (
                    <div className="space-y-6 py-4">
                        <div className="bg-slate-50 p-4 rounded-lg border">
                            <p className="text-lg font-medium text-slate-800">{currentQuestion.question}</p>
                        </div>
                        
                        <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                            {currentQuestion.options.map((opt, i) => {
                                let style = "border hover:bg-slate-50";
                                if (showFeedback) {
                                    if (opt === currentQuestion.correctAnswer) style = "bg-green-100 border-green-500 text-green-800";
                                    else if (opt === selectedOption) style = "bg-red-100 border-red-500 text-red-800";
                                    else style = "opacity-50";
                                } else if (opt === selectedOption) {
                                    style = "border-emerald-500 bg-emerald-50";
                                }

                                return (
                                    <div key={i} className={`flex items-center space-x-2 p-3 rounded-md transition-colors cursor-pointer ${style}`}>
                                        <RadioGroupItem value={opt} id={`opt-${i}`} disabled={showFeedback} />
                                        <Label htmlFor={`opt-${i}`} className="flex-grow cursor-pointer">{opt}</Label>
                                        {showFeedback && opt === currentQuestion.correctAnswer && <CheckCircle2 className="h-5 w-5 text-green-600"/>}
                                        {showFeedback && opt === selectedOption && opt !== currentQuestion.correctAnswer && <XCircle className="h-5 w-5 text-red-600"/>}
                                    </div>
                                )
                            })}
                        </RadioGroup>

                        <DialogFooter>
                            {!showFeedback ? (
                                <Button onClick={handleCheck} disabled={!selectedOption} className="w-full bg-emerald-600 hover:bg-emerald-700">Check Answer</Button>
                            ) : (
                                <Button onClick={handleNext} className="w-full">
                                    {currentIndex < totalQuestions - 1 ? "Next Question" : "Finish Quiz"}
                                </Button>
                            )}
                        </DialogFooter>
                    </div>
                ) : (
                    <div className="text-center py-8 space-y-4">
                        <Trophy className="h-16 w-16 mx-auto text-yellow-400 animate-bounce" />
                        <h3 className="text-2xl font-bold text-slate-800">Quiz Complete!</h3>
                        <div className="space-y-1">
                            <p className="text-lg text-slate-600">You answered <strong>{score}</strong> correct.</p>
                            {isSaving ? (
                                <p className="text-sm text-emerald-600 flex items-center justify-center gap-2"><Loader2 className="h-3 w-3 animate-spin"/> Saving your points...</p>
                            ) : (
                                <p className="text-sm text-emerald-600 font-bold">Points added to Leaderboard!</p>
                            )}
                        </div>
                        
                        <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden mt-4">
                            <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: `${(score / totalQuestions) * 100}%` }}></div>
                        </div>
                        <Button onClick={handleClose} className="w-full mt-4">Close</Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

// --- COMPONENT: AI Generator Modal (The Fix for Issue 2) ---
function AiGeneratorModal({ 
    open, 
    setOpen, 
    onSave 
}: { 
    open: boolean, 
    setOpen: (o: boolean) => void,
    onSave: (data: any, meta: any) => Promise<void>
}) {
    const [topic, setTopic] = useState('');
    const [grade, setGrade] = useState('JHS 1');
    const [difficulty, setDifficulty] = useState('Beginner');
    const [count, setCount] = useState(3);
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewData, setPreviewData] = useState<any[] | null>(null);

    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        setPreviewData(null);
        
        try {
            const result = await generateScienceQuestionAction({ topic, difficulty, grade, count });
            if (result.success && result.data) {
                setPreviewData(result.data);
            } else {
                alert("AI Error: " + result.error);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to generate.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleConfirm = async () => {
        if (previewData && previewData.length > 0) {
            await onSave(previewData, { topic, difficulty, grade, count });
            setOpen(false);
            setPreviewData(null);
            setTopic('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-purple-700">
                        <Sparkles className="h-5 w-5"/> AI Quiz Generator
                    </DialogTitle>
                    <DialogDescription>
                        Create a Science Club quiz instantly.
                    </DialogDescription>
                </DialogHeader>

                {!previewData ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Topic</Label><Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Digestive System" /></div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2"><Label>Grade</Label><Input value={grade} onChange={e => setGrade(e.target.value)} /></div>
                             <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select value={difficulty} onValueChange={setDifficulty}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Questions in Set</Label>
                            <Select value={count.toString()} onValueChange={(v) => setCount(Number(v))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">1 Question</SelectItem>
                                    <SelectItem value="3">3 Questions</SelectItem>
                                    <SelectItem value="5">5 Questions</SelectItem>
                                    <SelectItem value="10">10 Questions</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleGenerate} disabled={isGenerating || !topic} className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2">
                            {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Creating Quiz...</> : <><Wand2 className="mr-2 h-4 w-4"/> Generate Quiz</>}
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 overflow-hidden">
                        <div className="bg-purple-50 p-3 rounded-md border border-purple-100 flex-1 overflow-y-auto">
                            <p className="font-bold text-purple-800 mb-2">Preview: {previewData.length} Questions generated</p>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                                {previewData.map((q, i) => (
                                    <li key={i}>{q.question}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex gap-2 mt-auto pt-2">
                            <Button variant="outline" onClick={() => setPreviewData(null)} className="flex-1">Discard</Button>
                            <Button onClick={handleConfirm} className="flex-1 bg-green-600 hover:bg-green-700 text-white">Save Quiz Set</Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

// --- COMPONENT: Leaderboard ---
function LeaderboardV2() {
  const firestore = useFirestore();
  const leaderboardQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'science_lab_leaderboard'), orderBy('points', 'desc')) : null,
    [firestore]
  );
  const { data: leaderboard, isLoading } = useCollection<any>(leaderboardQuery);

  if (isLoading) return <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead>Scientist</TableHead>
            <TableHead className="text-right">Quizzes Played</TableHead>
            <TableHead className="text-right">Total Points</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {leaderboard?.map((entry, index) => (
            <TableRow key={entry.id}>
                <TableCell className="font-bold text-lg">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </TableCell>
                <TableCell className="font-medium">
                    <span>{entry.userName || "Anonymous Scientist"}</span>
                </TableCell>
                <TableCell className="text-right">{entry.quizzesPlayed || 0}</TableCell>
                <TableCell className="text-right font-bold text-emerald-600">{entry.points || 0}</TableCell>
            </TableRow>
            ))}
            {(!leaderboard || leaderboard.length === 0) && (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No champions yet. Be the first!</TableCell></TableRow>
            )}
        </TableBody>
        </Table>
    </div>
  );
}

// --- COMPONENT: Fact of the Day ---
function FactOfTheDay() {
    const firestore = useFirestore();
    const { user } = useAuth();
    const { role } = useRole();
    const { toast } = useToast();
    const [factText, setFactText] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    
    const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);

    const factsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'science_lab_facts')) : null, [firestore]);
    const { data: facts, isLoading } = useCollection<LabFact>(factsQuery);

    const latestFact = useMemo(() => {
        if (!facts || facts.length === 0) return null;
        return facts.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))[0];
    }, [facts]);

    const handlePostFact = async () => {
        if (!factText.trim()) {
            toast({ variant: 'destructive', title: "Error", description: "Fact cannot be empty." });
            return;
        }
        if (!user) return;

        setIsPosting(true);
        try {
            await addDoc(collection(firestore, 'science_lab_facts'), {
                text: factText,
                createdAt: serverTimestamp(),
                postedBy: user.uid,
            });
            toast({ title: 'Success', description: 'Fact posted successfully.' });
            setFactText('');
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <Card className="bg-emerald-50/50 border-emerald-200">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-emerald-700 text-lg">
                    <Lightbulb className="h-5 w-5"/> Science Club 2.0 Fact of the Day
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? <Skeleton className="h-16 w-full" /> : latestFact ? (
                    <blockquote className="border-l-4 border-emerald-400 pl-4 italic text-slate-700">
                        "{latestFact.text}"
                        <footer className="text-xs text-muted-foreground mt-2 not-italic">
                            — Posted on {latestFact.createdAt ? format(latestFact.createdAt.toDate(), 'PPP') : 'Today'}
                        </footer>
                    </blockquote>
                ) : <p className="text-muted-foreground text-sm">No facts yet.</p>}

                {isStaff && (
                    <div className="space-y-2 pt-4 border-t border-emerald-200/50">
                        <Label>Post a New Fact</Label>
                        <div className="flex gap-2">
                            <Input value={factText} onChange={e => setFactText(e.target.value)} placeholder="Did you know...?" className="bg-white"/>
                            <Button onClick={handlePostFact} disabled={isPosting || !factText.trim()} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                {isPosting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Post"}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// --- COMPONENT: Add Question Form (Manual) ---
function AddQuestionForm({ open, setOpen, classes, onAiOpen }: { open: boolean, setOpen: (o: boolean) => void, classes: Class[] | undefined, onAiOpen: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Beginner');
    const [classId, setClassId] = useState('global');
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');

    // NOTE: Manual form currently creates a "Set" of 1 question to keep structure consistent
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const questionObj: Question = { question, options, correctAnswer };
            
            await addDoc(collection(firestore, 'science_question_sets'), {
                title: `${topic} (Manual)`,
                topic, 
                difficulty, 
                grade: 'General', // Manual default
                classId, 
                questions: [questionObj], // Array of 1
                createdAt: serverTimestamp()
            });
            toast({ title: 'Saved', description: 'Question added.' });
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleOptionChange = (idx: number, val: string) => {
        const newOpts = [...options]; newOpts[idx] = val; setOptions(newOpts);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Add Question Manually</DialogTitle></DialogHeader>
                
                <div className="space-y-4 py-4">
                     <Button variant="outline" onClick={() => { setOpen(false); onAiOpen(); }} className="w-full border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100">
                        <Wand2 className="mr-2 h-4 w-4"/> Switch to AI Generator
                    </Button>
                    <div className="relative">
                        <Separator />
                        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2 text-xs text-muted-foreground">OR ENTER MANUALLY</span>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Topic</Label>
                                <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Physics" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select value={difficulty} onValueChange={setDifficulty}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Target Class</Label>
                            <Select value={classId} onValueChange={setClassId}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="global">All Classes (Global)</SelectItem>
                                    {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Question</Label>
                            <Textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Enter question..." required />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {options.map((opt, i) => (
                                <Input key={i} value={opt} onChange={e => handleOptionChange(i, e.target.value)} placeholder={`Option ${i+1}`} required />
                            ))}
                        </div>
                        <div className="space-y-2">
                            <Label>Correct Answer (Exact Match)</Label>
                            <Input value={correctAnswer} onChange={e => setCorrectAnswer(e.target.value)} placeholder="Paste correct option here" required />
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full">Save Question</Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- COMPONENT: Admin Seed Button ---
function SetupButton({ isStaff }: { isStaff: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    if (!isStaff) return null;

    const initialize = async () => {
        setLoading(true);
        try {
            await addDoc(collection(firestore, 'science_question_sets'), {
                title: "System Check Quiz",
                topic: 'General',
                difficulty: 'Beginner',
                grade: 'All',
                classId: 'global',
                questions: [{ question: "Is the earth flat?", options: ["Yes", "No", "Maybe", "Square"], correctAnswer: "No" }],
                createdAt: serverTimestamp()
            });
            await addDoc(collection(firestore, 'science_lab_facts'), {
                text: 'The universe is expanding.',
                createdAt: serverTimestamp()
            });
            toast({ title: "System Initialized" });
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="outline" size="sm" onClick={initialize} disabled={loading} className="border-indigo-200 text-indigo-700 bg-indigo-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Database className="h-4 w-4 mr-2"/>}
            Initialize New Database
        </Button>
    );
}

// --- MAIN PAGE ---
export default function ScienceLabPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { role, isRoleLoading } = useRole();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('explore');
  const [attemptingSet, setAttemptingSet] = useState<QuestionSet | null>(null);
  
  // Filters
  const [filterTopic, setFilterTopic] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');

  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);

  // Data Loading
  const { data: rawSets, isLoading: qLoading } = useCollection<QuestionSet>(useMemoFirebase(() => firestore ? query(collection(firestore, 'science_question_sets')) : null, [firestore]));

  const { data: classes } = useCollection<Class>(
    useMemoFirebase(() => (isStaff && firestore) ? query(collection(firestore, 'classes')) : null, [isStaff, firestore])
  );

  const { data: studentData, isLoading: sLoading } = useCollection<Student>(
    useMemoFirebase(() => (role === 'Student' && user) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [role, user])
  );
  const studentClassId = studentData?.[0]?.classId;

  const filteredSets = useMemo(() => {
      if(!rawSets) return [];
      let list = rawSets;

      if (role === 'Student') {
          list = list.filter(s => s.classId === 'global' || s.classId === studentClassId);
      }

      if(filterTopic !== 'All') list = list.filter(s => s.topic === filterTopic);
      if(filterDiff !== 'All') list = list.filter(s => s.difficulty === filterDiff);

      return list;
  }, [rawSets, role, studentClassId, filterTopic, filterDiff]);

  const uniqueTopics = useMemo(() => {
      if(!rawSets) return [];
      return Array.from(new Set(rawSets.map(s => s.topic))).sort();
  }, [rawSets]);

  const handleDelete = async (id: string) => {
      if(confirm('Delete this quiz set?')) {
          await deleteDoc(doc(firestore, 'science_question_sets', id));
          toast({ title: 'Deleted' });
      }
  };
  
  const handleAiSave = async (questions: any[], meta: any) => {
      try {
          await addDoc(collection(firestore, 'science_question_sets'), {
              title: `${meta.topic} (${meta.count} Qs)`,
              topic: meta.topic,
              difficulty: meta.difficulty,
              grade: meta.grade,
              classId: 'global',
              questions: questions, 
              createdAt: serverTimestamp()
          });
          toast({ title: 'Saved', description: 'New Quiz Set created.' });
      } catch (e: any) {
          console.error(e);
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to save AI quiz.' + e.message });
      }
  };

  const isLoading = isUserLoading || isRoleLoading || qLoading;

  return (
    <div className="space-y-6 p-6 min-h-screen bg-slate-50/50">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                <Atom className="h-8 w-8 text-emerald-600"/> Science Club 2.0
            </h1>
            <p className="text-slate-500">Explore, Experiment, and Excel.</p>
        </div>
        <div className="flex gap-2">
            <SetupButton isStaff={isStaff} />
            {isStaff && (
                <>
                    <Button variant="outline" onClick={() => setIsAiOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
                        <Wand2 className="mr-2 h-4 w-4"/> AI Generate Quiz
                    </Button>
                    <Button onClick={() => setIsFormOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="mr-2 h-4 w-4"/> Manual Add
                    </Button>
                </>
            )}
        </div>
      </div>

      <FactOfTheDay />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="explore">Quiz Library</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="explore" className="mt-6 space-y-6">
            <div className="flex gap-4">
                <Select value={filterTopic} onValueChange={setFilterTopic}>
                    <SelectTrigger className="w-[180px] bg-white"><SelectValue placeholder="Topic" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Topics</SelectItem>
                        {uniqueTopics.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filterDiff} onValueChange={setFilterDiff}>
                    <SelectTrigger className="w-[180px] bg-white"><SelectValue placeholder="Difficulty" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Levels</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {isLoading ? (
                <div className="text-center py-20"><Loader2 className="h-10 w-10 animate-spin mx-auto text-emerald-500"/></div>
            ) : filteredSets.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-xl">
                    <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-4"/>
                    <p className="text-slate-500">No quizzes found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSets.map((set) => (
                        <Card key={set.id} className="hover:shadow-md transition-shadow border-t-4 border-t-purple-400">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">{set.topic}</Badge>
                                    {isStaff && <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400" onClick={() => handleDelete(set.id)}><Trash2 className="h-4 w-4"/></Button>}
                                </div>
                                <CardTitle className="text-lg mt-2">{set.title}</CardTitle>
                                <CardDescription>{set.difficulty} • {set.grade || 'General'}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <p className="text-xs text-slate-400">Contains {set.questions?.length || 0} Questions</p>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button 
                                    onClick={() => setAttemptingSet(set)} 
                                    className="w-full bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-700 group"
                                >
                                    <Play className="mr-2 h-4 w-4 group-hover:fill-current"/> Start Quiz
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
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
      </Tabs>
      
      <AiGeneratorModal 
        open={isAiOpen} 
        setOpen={setIsAiOpen} 
        onSave={handleAiSave} 
      />
      
      <AddQuestionForm 
          open={isFormOpen} 
          setOpen={setIsFormOpen} 
          classes={classes} 
          onAiOpen={() => setIsAiOpen(true)}
      />

      <QuizRunnerDialog 
        questionSet={attemptingSet}
        open={!!attemptingSet}
        setOpen={(val) => { if(!val) setAttemptingSet(null); }}
      />
    </div>
  );
}

    