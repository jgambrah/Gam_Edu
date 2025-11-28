
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
// All imports consolidated here.
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, where } from 'firebase/firestore';
import { 
  Atom, Trophy, BrainCircuit, Plus, Loader2, 
  Trash2, Lightbulb, CheckCircle2, Database, Wand2, Sparkles, XCircle 
} from 'lucide-react';
import { format } from 'date-fns';
import { generateScienceQuestionAction } from '@/app/actions/generate-science'; 

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
import { Student, Class, DailyFact } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// --- TYPES ---
interface LabQuestion {
  id: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctAnswer: string;
  classId: string;
}

// --- COMPONENT: Attempt Question Dialog (The Fix for Issue 1) ---
function AttemptQuestionDialog({ 
    question, 
    open, 
    setOpen 
}: { 
    question: LabQuestion | null, 
    open: boolean, 
    setOpen: (o: boolean) => void 
}) {
    const [selectedOption, setSelectedOption] = useState('');
    const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

    if (!question) return null;

    const handleCheck = () => {
        if (selectedOption === question.correctAnswer) {
            setStatus('correct');
        } else {
            setStatus('wrong');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setStatus('idle');
        setSelectedOption('');
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Science Challenge</DialogTitle>
                    <DialogDescription>{question.topic} • {question.difficulty}</DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                    <p className="text-lg font-medium">{question.question}</p>
                    
                    <RadioGroup value={selectedOption} onValueChange={(val) => { setSelectedOption(val); setStatus('idle'); }}>
                        {question.options && question.options.map((opt, i) => (
                            <div key={i} className={`flex items-center space-x-2 border p-3 rounded-md transition-colors ${
                                status === 'correct' && opt === question.correctAnswer ? 'bg-green-100 border-green-500' :
                                status === 'wrong' && opt === selectedOption ? 'bg-red-100 border-red-500' : 'hover:bg-slate-50'
                            }`}>
                                <RadioGroupItem value={opt} id={`opt-${i}`} disabled={status === 'correct'} />
                                <Label htmlFor={`opt-${i}`} className="flex-grow cursor-pointer">{opt}</Label>
                                {status === 'correct' && opt === question.correctAnswer && <CheckCircle2 className="h-5 w-5 text-green-600"/>}
                                {status === 'wrong' && opt === selectedOption && <XCircle className="h-5 w-5 text-red-600"/>}
                            </div>
                        ))}
                    </RadioGroup>

                    {status === 'correct' && (
                        <div className="bg-green-50 text-green-800 p-3 rounded-md text-center font-bold">
                            Correct! Great job, Scientist!
                        </div>
                    )}
                    {status === 'wrong' && (
                        <div className="bg-red-50 text-red-800 p-3 rounded-md text-center font-bold">
                            Oops! That's not right. Try again.
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {status === 'correct' ? (
                        <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700">Next Question</Button>
                    ) : (
                        <Button onClick={handleCheck} disabled={!selectedOption} className="w-full">Check Answer</Button>
                    )}
                </DialogFooter>
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
    onSave: (data: any) => Promise<void>
}) {
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Beginner');
    const [count, setCount] = useState(1); // New Count State
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewData, setPreviewData] = useState<any[] | null>(null); // Array of questions

    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        setPreviewData(null);
        
        try {
            // Call the updated Server Action with count
            const result = await generateScienceQuestionAction({ topic, difficulty, count });
            
            if (result.success && result.data) {
                setPreviewData(result.data); // This is now an array of questions
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
            // Loop through and save all generated questions
            for (const question of previewData) {
                await onSave({ ...question, classId: 'global' });
            }
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
                        <Sparkles className="h-5 w-5"/> AI Question Generator
                    </DialogTitle>
                    <DialogDescription>
                        Generate multiple choice questions instantly.
                    </DialogDescription>
                </DialogHeader>

                {!previewData ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Topic / Concept</Label>
                            <Input 
                                value={topic} 
                                onChange={e => setTopic(e.target.value)} 
                                placeholder="e.g. Solar System, Atoms, Gravity" 
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                            <div className="space-y-2">
                                <Label>Count</Label>
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
                        </div>
                        <Button 
                            onClick={handleGenerate} 
                            disabled={isGenerating || !topic} 
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold"
                        >
                            {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating {count} questions...</> : <><Wand2 className="mr-2 h-4 w-4"/> Generate</>}
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 overflow-hidden">
                        <div className="bg-purple-50 p-2 rounded-md border border-purple-100 flex-1 overflow-y-auto pr-2">
                            <p className="font-semibold text-xs text-purple-600 mb-3 uppercase tracking-wide sticky top-0 bg-purple-50 pb-2">
                                Preview ({previewData.length} Questions)
                            </p>
                            
                            <div className="space-y-6">
                                {previewData.map((q, idx) => (
                                    <div key={idx} className="border-b border-purple-200 pb-4 last:border-0">
                                        <p className="font-medium text-md mb-2 text-slate-800">
                                            {idx + 1}. {q.question}
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {q.options.map((opt: string, i: number) => (
                                                <div key={i} className={`p-2 text-xs border rounded-md ${opt === q.correctAnswer ? 'bg-green-100 border-green-300 font-bold text-green-800' : 'bg-white text-slate-600'}`}>
                                                    {opt} {opt === q.correctAnswer && "✓"}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 mt-auto pt-2">
                            <Button variant="outline" onClick={() => setPreviewData(null)} className="flex-1">Discard</Button>
                            <Button onClick={handleConfirm} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                                Save All to Library
                            </Button>
                        </div>
                    </div>
                )}
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
            await addDoc(collection(firestore, 'science_lab_questions'), {
                topic: 'General',
                difficulty: 'Beginner',
                question: 'What planet do we live on?',
                options: ['Mars', 'Earth', 'Venus', 'Jupiter'],
                correctAnswer: 'Earth',
                classId: 'global',
                createdAt: serverTimestamp()
            });
            await addDoc(collection(firestore, 'science_lab_facts'), {
                text: 'Water expands when it freezes.',
                createdAt: serverTimestamp()
            });
            toast({ title: "System Initialized", description: "Collections created successfully." });
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

// --- COMPONENT: Add Question Form (Manual) ---
function AddQuestionForm({ open, setOpen, classes, onAiOpen }: { open: boolean, setOpen: (o: boolean) => void, classes: Class[] | undefined, onAiOpen: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Beginner');
    const [classId, setClassId] = useState('global');
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, 'science_lab_questions'), {
                topic, difficulty, classId, question, options, correctAnswer, createdAt: serverTimestamp()
            });
            toast({ title: 'Saved', description: 'Question added to the Lab.' });
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOptionChange = (idx: number, val: string) => {
        const newOpts = [...options];
        newOpts[idx] = val;
        setOptions(newOpts);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Add Lab Question (Manual)</DialogTitle></DialogHeader>
                
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
        if (!factText.trim() || !user) return;
        setIsPosting(true);
        try {
            await addDoc(collection(firestore, 'science_lab_facts'), {
                factText,
                createdAt: serverTimestamp(),
                postedBy: user.uid,
            });
            toast({ title: 'Success', description: 'Fact posted.' });
            setFactText('');
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to post.' });
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <Card className="bg-emerald-50/50 border-emerald-200">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-emerald-700 text-lg">
                    <Lightbulb className="h-5 w-5"/> Science Fact of the Day
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? <Skeleton className="h-16 w-full" /> : latestFact ? (
                    <blockquote className="border-l-4 border-emerald-400 pl-4 italic text-slate-700">
                        "{latestFact.factText}"
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
  const [attemptingQuestion, setAttemptingQuestion] = useState<LabQuestion | null>(null); // For the new dialog
  
  // Filters
  const [filterTopic, setFilterTopic] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');

  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);

  // Data Loading
  const questionsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'science_lab_questions')) : null, [firestore]);
  const { data: rawQuestions, isLoading: qLoading } = useCollection<LabQuestion>(questionsQuery);

  const { data: classes } = useCollection<Class>(
    useMemoFirebase(() => (isStaff && firestore) ? query(collection(firestore, 'classes')) : null, [isStaff, firestore])
  );

  const { data: studentData, isLoading: sLoading } = useCollection<Student>(
    useMemoFirebase(() => (role === 'Student' && user) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [role, user])
  );
  const studentClassId = studentData?.[0]?.classId;

  const filteredQuestions = useMemo(() => {
      if(!rawQuestions) return [];
      let list = rawQuestions;
      if (role === 'Student') {
          list = list.filter(q => q.classId === 'global' || q.classId === studentClassId);
      }
      if(filterTopic !== 'All') list = list.filter(q => q.topic === filterTopic);
      if(filterDiff !== 'All') list = list.filter(q => q.difficulty === filterDiff);
      return list;
  }, [rawQuestions, role, studentClassId, filterTopic, filterDiff]);

  const uniqueTopics = useMemo(() => {
      if(!rawQuestions) return [];
      return Array.from(new Set(rawQuestions.map(q => q.topic))).sort();
  }, [rawQuestions]);

  const handleDelete = async (id: string) => {
      if(confirm('Delete this question?')) {
          await deleteDoc(doc(firestore, 'science_lab_questions', id));
          toast({ title: 'Deleted' });
      }
  };
  
  const handleAiSave = async (data: any) => {
      try {
          await addDoc(collection(firestore, 'science_lab_questions'), {
              ...data,
              createdAt: serverTimestamp()
          });
          toast({ title: 'Saved', description: 'AI Question added to library.' });
      } catch (e: any) {
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to save AI question.' + e.message });
      }
  };

  const isLoading = isUserLoading || isRoleLoading || qLoading;

  return (
    <div className="space-y-6 p-6 min-h-screen bg-slate-50/50">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                <Atom className="h-8 w-8 text-emerald-600"/> The Science Lab
            </h1>
            <p className="text-slate-500">Explore, Experiment, and Excel.</p>
        </div>
        <div className="flex gap-2">
            <SetupButton isStaff={isStaff} />
            {isStaff && (
                <>
                    <Button variant="outline" onClick={() => setIsAiOpen(true)} className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100">
                        <Wand2 className="mr-2 h-4 w-4"/> AI Generate
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
            <TabsTrigger value="explore">Question Bank</TabsTrigger>
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
            ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-xl">
                    <BrainCircuit className="h-12 w-12 text-slate-300 mx-auto mb-4"/>
                    <p className="text-slate-500">No questions found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredQuestions.map((q) => (
                        <Card key={q.id} className="hover:shadow-md transition-shadow border-t-4 border-t-emerald-400">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline">{q.topic}</Badge>
                                    {isStaff && <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400" onClick={() => handleDelete(q.id)}><Trash2 className="h-4 w-4"/></Button>}
                                </div>
                                <CardTitle className="text-base mt-2 line-clamp-2">{q.question}</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <p className="text-xs text-slate-400">{q.difficulty} • {q.classId === 'global' ? 'Global' : 'Class'}</p>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button 
                                    onClick={() => setAttemptingQuestion(q)} 
                                    className="w-full bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                                >
                                    Attempt Question
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </TabsContent>

        <TabsContent value="leaderboard">
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-400"/>
                    <p>Leaderboard coming soon!</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      
      <AddQuestionForm 
        open={isFormOpen} 
        setOpen={setIsFormOpen} 
        classes={classes}
        onAiOpen={() => setIsAiOpen(true)}
      />

      <AiGeneratorModal 
        open={isAiOpen} 
        setOpen={setIsAiOpen} 
        onSave={handleAiSave} 
      />

      <AttemptQuestionDialog 
        question={attemptingQuestion}
        open={!!attemptingQuestion}
        setOpen={(val) => { if(!val) setAttemptingQuestion(null); }}
      />
    </div>
  );
}
