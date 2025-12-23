
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { 
  Loader2, Volume2, Rocket, Wand2, 
  Save, Trash2, Library, Brain, BookOpen, 
  CheckCircle2, XCircle, PlusCircle, Microscope, Sigma, Languages, Sparkles, FolderOpen, Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


// Import the AI actions
import { generateSeniorEnglish, generateSeniorMath, generateSeniorLab } from '@/ai/flows/senior-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


// --- HELPER: TEXT TO SPEECH ---
const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; 
    window.speechSynthesis.speak(u);
};

// --- HELPER: LATEX CLEANER ---
const cleanLatex = (formula: string = "") => {
    if (!formula) return "";
    return formula
        .replace(/\$\$/g, '')      
        .replace(/\$/g, '')        
        .replace(/\\\[/g, '')      
        .replace(/\\\]/g, '')      
        .trim();
};

// --- ROBUST MATH RENDERER ---
function SafeMath({ formula, block = true }: { formula: string, block?: boolean }) {
  const [mounted, setMounted] = useState(false);

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
      <BlockMath math={cleaned} />
    );
  } catch (error) {
    console.error("LaTeX Error:", error);
    return <code className="text-red-500">{formula}</code>;
  }
}

const CATEGORIES = [
    'Early Childhood', 
    'Lower Primary', 
    'Upper Primary', 
    'Junior Secondary (JHS)', 
    'Senior Secondary (SHS)'
];

// --- 1. ENGLISH MASTERY (COMPREHENSION) ---
function EnglishMastery({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const [activeStory, setActiveStory] = useState<any>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    
    const storiesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'senior_stories'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: library, forceRefetch } = useCollection<any>(storiesQuery);

    const checkAnswers = () => {
        if (!activeStory || !activeStory.quiz) return;
        let correct = 0;
        activeStory.quiz.forEach((q: any, i: number) => {
            if (answers[i]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) correct++;
        });
        if (correct === activeStory.quiz.length) {
            confetti();
            speak("Excellent analysis!");
        } else {
            speak(`You have ${correct} correct answers. Keep investigating.`);
        }
    };
    
    const handleDelete = async (id: string) => {
        if (!firestore || !confirm("Delete this story?")) return;
        await deleteDoc(doc(firestore, 'senior_stories', id));
        setActiveStory(null); // Clear selection
        forceRefetch();
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in">
            <div className="lg:col-span-2 space-y-6">
                
                {!activeStory ? (
                    <div className="h-96 flex flex-col items-center justify-center bg-white rounded-[40px] border-4 border-dashed border-slate-100">
                        <BookOpen className="w-16 h-16 text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold text-2xl">Select a Literary Work</p>
                    </div>
                ) : (
                    <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white">
                        <div className="bg-indigo-600 p-8 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Badge className="mb-4 bg-white/20 text-white border-none">{activeStory.genre}</Badge>
                                    <CardTitle className="text-4xl font-black">{activeStory.title}</CardTitle>
                                </div>
                                <Button onClick={() => speak(activeStory.content)} variant="secondary" size="icon" className="rounded-full"><Volume2/></Button>
                            </div>
                        </div>
                        <CardContent className="p-10 space-y-10">
                            <p className="whitespace-pre-wrap text-2xl leading-relaxed text-slate-700 font-serif">{activeStory.content}</p>
                            <div className="bg-slate-50 p-8 rounded-[32px] space-y-8 border-2 border-slate-100">
                                <h3 className="text-2xl font-black text-indigo-900 flex items-center gap-2"><Brain className="text-indigo-500"/> Critical Analysis</h3>
                                {activeStory.quiz.map((q: any, i: number) => (
                                    <div key={i} className="space-y-3">
                                        <p className="font-bold text-slate-800 text-lg">{i + 1}. {q.question}</p>
                                        <Input placeholder="Type response..." value={answers[i] || ""} onChange={e => { const n = [...answers]; n[i] = e.target.value; setAnswers(n); }} className="h-14 rounded-2xl border-2 focus:border-indigo-500 shadow-sm"/>
                                    </div>
                                ))}
                                <Button onClick={checkAnswers} className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-xl font-black rounded-2xl shadow-xl">Submit for Review</Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
            <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-2">Archive</h3>
                {library?.map((s: any) => (
                    <div key={s.id} className="relative group">
                        <button onClick={() => { setActiveStory(s); setAnswers([]); }} className={`w-full text-left p-6 rounded-[24px] border-b-4 transition-all ${activeStory?.id === s.id ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-slate-100'}`}>
                            <h4 className="font-bold text-slate-800">{s.title}</h4>
                            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase">{s.genre} • {s.difficulty}</p>
                        </button>
                        {canEdit && (
                            <button onClick={() => handleDelete(s.id)} className="absolute top-2 right-2 text-red-300 opacity-0 group-hover:opacity-100 z-10"><Trash2 className="w-4 h-4"/></button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- 2. ADVANCED MATH LAB (FOLDER ORGANIZED) ---
function MathLab({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [problem, setProblem] = useState<any>(null);
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState<any>(null);

    // Navigation State
    const [selectedGrade, setSelectedGrade] = useState('Junior Secondary (JHS)');

    const mathQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'senior_math'), orderBy('createdAt', 'desc')) : null, 
    [firestore]);
    const { data: dbProblems, isLoading, forceRefetch } = useCollection<any>(mathQuery);

    // BRILLIANT ORGANIZATION LOGIC: Grouping by Subject -> Sub-Topic
    const folderStructure = useMemo(() => {
        if (!dbProblems) return {};
        
        // 1. Filter by current Student Category
        const filtered = dbProblems.filter(p => p.gradeLevel === selectedGrade || (!p.gradeLevel && selectedGrade === 'Junior Secondary (JHS)'));


        // 2. Group into Subjects (Algebra, Stats, etc.)
        return filtered.reduce((acc, p) => {
            const subject = p.category || 'General Mathematics';
            const sub = p.subTopic || 'Standard Practice';
            
            if (!acc[subject]) acc[subject] = {};
            if (!acc[subject][sub]) acc[subject][sub] = [];
            
            acc[subject][sub].push(p);
            return acc;
        }, {} as Record<string, Record<string, any[]>>);
    }, [dbProblems, selectedGrade]);

    const checkAnswer = () => {
        if (userInput.trim().toLowerCase() === problem.answer.toLowerCase().trim()) {
            setFeedback({ ok: true, msg: "Logical match confirmed! Well done." });
            confetti();
            speak("Correct solution.");
        } else {
            setFeedback({ ok: false, msg: `Correction required. Expected: ${problem.answer}` });
            speak("Review your derivation.");
        }
    };
    
    const handleDelete = async (id: string) => {
        if (!firestore || !confirm("Remove this problem from curriculum?")) return;
        await deleteDoc(doc(firestore, 'senior_math', id));
        toast({ title: "Deleted" });
        setProblem(null);
        forceRefetch();
    };

    return (
        <div className="grid lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
            {/* SIDEBAR: THE BRILLIANT NAVIGATOR */}
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-slate-900 p-4 rounded-3xl shadow-lg border border-slate-700">
                    <Label className="text-slate-400 text-[10px] uppercase font-black ml-2 mb-2 block">Student Category</Label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white font-bold rounded-2xl h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <ScrollArea className="h-[70vh] rounded-3xl border-2 border-slate-100 bg-white p-2">
                    <div className="space-y-2 p-2">
                        {isLoading ? (
                            <Skeleton className="h-40 w-full" />
                        ) : Object.keys(folderStructure).length === 0 ? (
                            <div className="text-center py-20 text-slate-300">
                                <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p className="text-xs font-bold">No questions in this category yet.</p>
                            </div>
                        ) : (
                            Object.entries(folderStructure).map(([subject, subTopics]) => (
                                <Accordion key={subject} type="single" collapsible className="w-full">
                                    <AccordionItem value={subject} className="border-none">
                                        <AccordionTrigger className="hover:no-underline p-3 bg-slate-50 rounded-2xl mb-1 group">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                                <span className="font-black text-slate-700 text-xs uppercase tracking-tight">{subject}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-1 pl-4 space-y-1">
                                            {Object.entries(subTopics).map(([subTitle, items]) => (
                                                <Accordion key={subTitle} type="single" collapsible>
                                                    <AccordionItem value={subTitle} className="border-none">
                                                        <AccordionTrigger className="text-[11px] font-bold text-slate-500 py-2 hover:text-indigo-600">
                                                            {subTitle} ({items.length})
                                                        </AccordionTrigger>
                                                        <AccordionContent className="space-y-1">
                                                            {items.map((item: any) => (
                                                                <button
                                                                    key={item.id}
                                                                    onClick={() => { setProblem(item); setFeedback(null); setUserInput(""); }}
                                                                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all ${problem?.id === item.id ? 'bg-emerald-500 text-white shadow-md' : 'hover:bg-slate-100 text-slate-600'}`}
                                                                >
                                                                    {item.title}
                                                                </button>
                                                            ))}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* MAIN STAGE: THE WORKSTATION */}
            <div className="lg:col-span-3">
                {problem ? (
                    <Card className="rounded-[48px] border-none shadow-2xl overflow-hidden bg-white animate-in zoom-in duration-500">
                        <div className="bg-emerald-600 p-10 text-white relative">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex gap-2 mb-4">
                                        <Badge className="bg-white/20 border-none">{problem.category}</Badge>
                                        <Badge className="bg-emerald-400 border-none">{problem.subTopic}</Badge>
                                    </div>
                                    <CardTitle className="text-4xl font-black tracking-tight">{problem.title}</CardTitle>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase opacity-60">Curriculum Level</p>
                                    <p className="font-bold">{problem.gradeLevel}</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-12 space-y-10">
                            {/* THE PROFESSIONAL LATEX BOX */}
                            <div className="bg-slate-900 p-12 rounded-[40px] shadow-2xl border-t-8 border-emerald-500 relative">
                                <div className="text-4xl text-emerald-400 overflow-x-auto py-6 text-center">
                                    <SafeMath formula={problem.latexFormula} />
                                </div>
                                <div className="absolute top-4 right-6 text-slate-700 font-mono text-[10px] uppercase tracking-widest">Neural Math Engine v2.0</div>
                            </div>

                            <div className="max-w-2xl mx-auto text-center space-y-8">
                                <p className="whitespace-pre-wrap text-2xl font-medium text-slate-600 leading-relaxed italic">
                                    "{problem.instruction}"
                                </p>
                                <div className="flex flex-col items-center gap-6">
                                    <Input 
                                        value={userInput} 
                                        onChange={e => setUserInput(e.target.value)} 
                                        placeholder="Enter final derived value..." 
                                        className="h-20 text-4xl font-mono text-center border-4 border-slate-100 rounded-[32px] focus:border-emerald-500 shadow-inner"
                                    />
                                    <Button onClick={checkAnswer} className="h-16 px-20 bg-emerald-600 hover:bg-emerald-700 text-xl font-black rounded-full shadow-xl transition-all hover:-translate-y-1">
                                        VERIFY DERIVATION
                                    </Button>
                                </div>
                            </div>

                            {feedback && (
                                <div className={`p-8 rounded-[32px] border-2 flex items-center justify-center gap-4 animate-bounce ${feedback.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                    {feedback.ok ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                                    <p className="text-xl font-black">{feedback.msg}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-white rounded-[48px] border-4 border-dashed border-slate-100 min-h-[600px]">
                        <div className="p-8 bg-slate-50 rounded-full mb-6">
                            <Sigma className="w-20 h-20 text-slate-200" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-300 uppercase tracking-widest text-center">
                            Select a topic from the <br /> {selectedGrade} library
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- 3. DISCOVERY LAB (SCIENTIFIC METHOD) ---
function DiscoveryLab({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const [lab, setLab] = useState<any>(null);
    const [stage, setStage] = useState<'hypothesis' | 'experiment' | 'conclusion'>('hypothesis');
    const [isExperimentRunning, setIsExperimentRunning] = useState(false);
    const [progress, setProgress] = useState(0);

    const labQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'senior_labs'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: dbLabs } = useCollection<any>(labQuery);

    const runExperiment = () => {
        setIsExperimentRunning(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                const newValue = prev + 20;
                if (newValue >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setStage('conclusion'), 500);
                }
                return newValue;
            });
        }, 400);
    };
    
    useEffect(() => {
        setIsExperimentRunning(false);
        setProgress(0);
    }, [lab]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dbLabs?.map((l: any) => (
                    <Card key={l.id} onClick={() => { setLab(l); setStage('hypothesis'); }} className={`cursor-pointer hover:shadow-xl transition-all border-b-8 ${lab?.id === l.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100'}`}>
                        <CardContent className="p-6 text-center space-y-3">
                            <div className="text-5xl">{l.icon}</div>
                            <h4 className="font-bold text-slate-800">{l.title}</h4>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {lab && (
                <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden animate-in slide-in-from-right-4">
                    <div className="grid md:grid-cols-3">
                        <div className="bg-slate-900 text-white p-10 space-y-8">
                            <div className="flex flex-col gap-6">
                                {['hypothesis', 'experiment', 'conclusion'].map((s: any, i) => (
                                    <div key={s} className={`flex items-center gap-4 transition-opacity ${stage === s ? 'opacity-100' : 'opacity-30'}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-orange-500' : 'bg-green-500'}`}>{i + 1}</div>
                                        <span className="font-bold capitalize">{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2 p-10 bg-white">
                            {stage === 'hypothesis' && (
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-black text-slate-800 leading-relaxed">{lab.question}</h2>
                                    <div className="p-8 bg-blue-50 rounded-3xl border-2 border-blue-100">
                                        <p className="text-slate-600 mb-4 leading-relaxed">{lab.hypothesisPrompt}</p>
                                        <div className="grid grid-cols-1 gap-3">
                                            {lab.hypothesisOptions.map((opt: string) => (
                                                <Button key={opt} variant="outline" className="bg-white border-2 hover:bg-blue-50 font-bold text-left h-auto py-3 whitespace-normal" onClick={() => setStage('experiment')}>{opt}</Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {stage === 'experiment' && (
                                <div className="space-y-8 text-center">
                                    <h2 className="text-3xl font-black text-slate-800">Experimentation in Progress</h2>
                                    <div className="text-9xl my-10 animate-pulse">{lab.icon}</div>
                                    
                                    {isExperimentRunning ? (
                                        <div className="space-y-3">
                                            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                                                <div className="bg-orange-500 h-4 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
                                            </div>
                                            <p className="text-sm font-medium text-orange-600">Running Simulation...</p>
                                        </div>
                                    ) : (
                                        <Button onClick={runExperiment} className="bg-orange-500 hover:bg-orange-600 px-10 rounded-full font-bold h-14 text-lg">Run Experiment</Button>
                                    )}
                                </div>
                            )}
                            {stage === 'conclusion' && (
                                <div className="space-y-6 animate-in zoom-in">
                                    <h2 className="text-3xl font-black text-green-800">Findings</h2>
                                    <div className="p-8 bg-green-50 rounded-3xl border-2 border-green-100 space-y-4">
                                        <p className="text-2xl font-bold text-slate-800">{lab.conclusion}</p>
                                        <p className="text-slate-600 leading-relaxed">{lab.explanation}</p>
                                    </div>
                                    <Button onClick={() => { setLab(null); confetti(); }} className="w-full h-14 bg-green-600 rounded-2xl font-black text-lg">Complete Mission</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}

// --- 4. ADMIN CONSOLE (INTEGRATED CATEGORY CONTROL) ---
function AdminConsole({ onContentAdded }: { onContentAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [subject, setSubject] = useState('math');
    const [targetGrade, setTargetGrade] = useState('Junior Secondary (JHS)');
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAiGenerate = async () => {
        if (!topic.trim()) {
            toast({ variant: 'destructive', title: 'Topic is required' });
            return;
        }
        setLoading(true);

        // Sending the specific grade category to Genkit
        const context = { topic, gradeLevel: targetGrade as any };
        let result;
        let collectionName = '';

        if (subject === 'math') {
            collectionName = 'senior_math';
            result = await generateSeniorMath(context);
        } else if (subject === 'english') {
            collectionName = 'senior_stories';
            result = await generateSeniorEnglish(context);
        } else {
            collectionName = 'senior_labs';
            result = await generateSeniorLab(context);
        }

        if (result.success && result.data) {
            if (firestore) {
                await addDoc(collection(firestore, collectionName), {
                    ...result.data,
                    gradeLevel: targetGrade, // Force the folder association
                    createdAt: serverTimestamp()
                });
                toast({ title: 'Success', description: `Added to ${targetGrade} folder.` });
                onContentAdded();
                setTopic("");
            }
        }
        setLoading(false);
    };

    return (
        <Card className="bg-slate-900 border-none shadow-2xl overflow-hidden rounded-[40px]">
            <div className="p-8 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2 w-full">
                    <Label className="text-slate-500 text-[10px] font-black uppercase ml-2">Topic & Concept</Label>
                    <Input 
                        value={topic} 
                        onChange={e => setTopic(e.target.value)} 
                        placeholder="e.g. Calculus Derivatives, Shakespearean Sonnets..." 
                        className="h-14 bg-slate-800 border-slate-700 text-white rounded-2xl"
                    />
                </div>
                <div className="w-full md:w-64 space-y-2">
                    <Label className="text-slate-500 text-[10px] font-black uppercase ml-2">Target Grade</Label>
                    <Select value={targetGrade} onValueChange={setTargetGrade}>
                        <SelectTrigger className="h-14 bg-slate-800 border-slate-700 text-white rounded-2xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full md:w-48 space-y-2">
                    <Label className="text-slate-500 text-[10px] font-black uppercase ml-2">Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger className="h-14 bg-slate-800 border-slate-700 text-white rounded-2xl capitalize"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="math">Mathematics</SelectItem>
                            <SelectItem value="english">English Literature</SelectItem>
                            <SelectItem value="science">Scientific Discovery</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleAiGenerate} disabled={loading || !topic} className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black min-w-[160px]">
                    {loading ? <Loader2 className="animate-spin"/> : <><Sparkles className="mr-2 h-4 w-4"/> GENERATE</>}
                </Button>
            </div>
        </Card>
    );
}

// --- MAIN PAGE ---
export default function SeniorAcademyPage() {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');
    
    const handleContentUpdate = () => {
        // This is a placeholder for a potential forceRefetch call if needed.
        // Since useCollection is live, direct re-fetching isn't always necessary.
        console.log("Content updated, UI will refresh automatically.");
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-900 p-3 rounded-2xl shadow-xl"><Rocket className="h-8 w-8 text-white" /></div>
                            <h1 className="text-6xl font-black text-slate-900 tracking-tight">Senior Academy</h1>
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] ml-1">Excellence & Academic Rigor</p>
                    </div>
                </div>

                {/* This will render ONLY if user is a teacher or admin */}
                {canEdit && <div className="mb-8"><AdminConsole onContentAdded={handleContentUpdate} /></div>}

                <Tabs defaultValue="math" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-24 bg-white p-3 rounded-[32px] shadow-2xl border border-slate-100 mb-16">
                        <TabsTrigger value="english" className="rounded-2xl data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 font-black flex flex-col items-center justify-center gap-1"><Languages className="w-5 h-5"/> English</TabsTrigger>
                        <TabsTrigger value="math" className="rounded-2xl data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-black flex flex-col items-center justify-center gap-1"><Sigma className="w-5 h-5"/> Math Lab</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-2xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black flex flex-col items-center justify-center gap-1"><Microscope className="w-5 h-5"/> Discovery</TabsTrigger>
                    </TabsList>
                    
                    <div className="min-h-[700px]">
                        <TabsContent value="english" className="mt-0"><EnglishMastery canEdit={canEdit} /></TabsContent>
                        <TabsContent value="math" className="mt-0"><MathLab canEdit={canEdit} /></TabsContent>
                        <TabsContent value="science" className="mt-0"><DiscoveryLab canEdit={canEdit} /></TabsContent>
                    </div>
                </Tabs>
            </div>
             <style jsx global>{`
              .math-container {
                max-width: 100%;
                overflow-x: auto;
                overflow-y: hidden;
              }
              .katex-display {
                margin: 0 !important;
                color: inherit;
              }
            `}</style>
        </div>
    );
}
