
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { 
  Loader2, Volume2, Rocket, Wand2, 
  Save, Trash2, Library, Brain, BookOpen, 
  CheckCircle2, XCircle, PlusCircle, Microscope, Sigma, Languages, Sparkles, FolderOpen, Play, PenTool
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

// --- DYNAMIC THEME ENGINE ---
const isJuniorLevel = (grade: string) => 
    grade === 'Early Childhood' || grade === 'Lower Primary';

const juniorTheme = {
    card: "rounded-[60px] border-8 border-yellow-200 shadow-[0_20px_0_#FEF9C3] bg-white",
    header: "bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400 p-10 text-white",
    mathBox: "bg-sky-100 p-10 rounded-[50px] border-4 border-dashed border-sky-300 shadow-inner",
    text: "text-blue-900 font-bold tracking-tight",
    button: "h-20 px-12 bg-pink-500 hover:bg-pink-600 text-2xl font-black rounded-[30px] shadow-[0_10px_0_#be185d] active:translate-y-2 active:shadow-none transition-all"
};

// --- 1. ENGLISH MASTERY (FOLDER ORGANIZED) ---
function EnglishMastery({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [activeStory, setActiveStory] = useState<any>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    const [selectedGrade, setSelectedGrade] = useState('Junior Secondary (JHS)');

    const isJunior = isJuniorLevel(selectedGrade);

    const storiesQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'senior_stories'), orderBy('createdAt', 'desc')) : null, 
    [firestore]);
    const { data: library, isLoading, forceRefetch } = useCollection<any>(storiesQuery);

    const folderStructure = useMemo(() => {
        if (!library) return {};
        const filtered = library.filter(s => (s.gradeLevel || 'Junior Secondary (JHS)') === selectedGrade);
        return filtered.reduce((acc, s) => {
            const category = s.category || 'General Reading';
            const subTopic = s.subTopic || 'Standard Comprehension';
            if (!acc[category]) acc[category] = {};
            if (!acc[category][subTopic]) acc[category][subTopic] = [];
            acc[category][subTopic].push(s);
            return acc;
        }, {} as Record<string, Record<string, any[]>>);
    }, [library, selectedGrade]);

    const checkAnswers = () => {
        let correct = 0;
        activeStory.quiz.forEach((q: any, i: number) => {
            if (answers[i]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) correct++;
        });
        if (correct === activeStory.quiz.length) { confetti(); speak("Analysis complete! You have mastered this passage."); }
        else { speak(`Keep investigating. You found ${correct} insights.`); }
    };
    
    return (
        <div className="grid lg:grid-cols-4 gap-8 animate-in fade-in">
            {/* SIDEBAR NAVIGATION */}
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-indigo-900 p-4 rounded-3xl shadow-lg">
                    <Label className="text-indigo-300 text-[10px] uppercase font-black ml-2 mb-2 block">English Level</Label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                        <SelectTrigger className="bg-indigo-800 border-indigo-700 text-white rounded-2xl h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                </div>

                <ScrollArea className="h-[70vh] rounded-3xl border-2 border-slate-100 bg-white p-2">
                    <div className="p-2 space-y-2">
                        {isLoading ? <Skeleton className="h-40 w-full" /> : Object.keys(folderStructure).length === 0 ? (
                            <div className="text-center py-20 text-slate-300">
                                <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p className="text-xs font-bold">No passages in this category yet.</p>
                            </div>
                        ) : (
                            Object.entries(folderStructure).map(([cat, subs]) => (
                                <Accordion key={cat} type="single" collapsible className="w-full">
                                    <AccordionItem value={cat} className="border-none">
                                        <AccordionTrigger className="hover:no-underline p-3 bg-indigo-50 rounded-2xl mb-1">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-3 h-3 text-indigo-500" />
                                                <span className="font-black text-indigo-900 text-xs uppercase">{cat}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-1 pl-4">
                                            {Object.entries(subs).map(([subTitle, items]) => (
                                                <Accordion key={subTitle} type="single" collapsible>
                                                    <AccordionItem value={subTitle} className="border-none">
                                                        <AccordionTrigger className="text-[11px] font-bold text-slate-500 py-2">{subTitle}</AccordionTrigger>
                                                        <AccordionContent className="space-y-1">
                                                            {items.map((item: any) => (
                                                                <button key={item.id} onClick={() => { setActiveStory(item); setAnswers([]); }} className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all ${activeStory?.id === item.id ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-indigo-50 text-slate-600'}`}>{item.title}</button>
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

            {/* WORKSTATION */}
            <div className="lg:col-span-3">
                {activeStory ? (
                    <Card className={`transition-all duration-500 overflow-hidden ${isJunior ? juniorTheme.card : 'rounded-[48px] shadow-2xl bg-white'}`}>
                        <div className={isJunior ? juniorTheme.header : 'bg-indigo-600 p-10 text-white'}>
                            <Badge className="bg-white/20 border-none mb-4">{activeStory.genre || activeStory.category}</Badge>
                            <CardTitle className={`font-black ${isJunior ? 'text-5xl' : 'text-4xl'}`}>{isJunior && '📖'} {activeStory.title}</CardTitle>
                        </div>
                        <CardContent className="p-12 space-y-10">
                            <p className={`whitespace-pre-wrap font-serif ${isJunior ? 'text-3xl leading-relaxed text-slate-800' : 'text-2xl leading-relaxed text-slate-700'}`}>{activeStory.content}</p>
                            <div className={`p-8 rounded-[32px] space-y-6 border-2 ${isJunior ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100'}`}>
                                <h3 className={`font-black ${isJunior ? 'text-4xl text-yellow-900' : 'text-2xl text-indigo-900'}`}>Critical Analysis Questions</h3>
                                {activeStory.quiz.map((q: any, i: number) => (
                                    <div key={i} className="space-y-2">
                                        <p className={`font-bold ${isJunior ? 'text-xl' : 'text-base'} text-slate-800`}>{i + 1}. {q.question}</p>
                                        <Input placeholder="Type your analysis..." value={answers[i] || ""} onChange={e => { const n = [...answers]; n[i] = e.target.value; setAnswers(n); }} className={`${isJunior ? 'h-20 text-xl rounded-3xl border-4' : 'h-14 rounded-2xl border-2'}`} />
                                    </div>
                                ))}
                                <Button onClick={checkAnswers} className={`w-full ${isJunior ? juniorTheme.button : 'h-16 bg-indigo-600 hover:bg-indigo-700 text-xl font-black rounded-full'}`}>Submit Analysis</Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-white rounded-[48px] border-4 border-dashed border-slate-100 min-h-[500px]">
                        <Languages className="w-20 h-20 text-slate-100 mb-4" />
                        <h2 className="text-2xl font-black text-slate-300 uppercase tracking-widest text-center">Select a Literary Passage</h2>
                    </div>
                )}
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
    const isJunior = isJuniorLevel(selectedGrade);

    const mathQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'senior_math'), orderBy('createdAt', 'desc')) : null, 
    [firestore]);
    const { data: dbProblems, isLoading, forceRefetch } = useCollection<any>(mathQuery);

    const folderStructure = useMemo(() => {
        if (!dbProblems) return {};
        const filtered = dbProblems.filter(p => (p.gradeLevel || 'Junior Secondary (JHS)') === selectedGrade);
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

    return (
        <div className="grid lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
            {/* SIDEBAR */}
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-slate-900 p-4 rounded-3xl shadow-lg border border-slate-700">
                    <Label className="text-slate-400 text-[10px] uppercase font-black ml-2 mb-2 block">Student Category</Label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white font-bold rounded-2xl h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <ScrollArea className="h-[70vh] rounded-3xl border-2 border-slate-100 bg-white p-2">
                    <div className="space-y-2 p-2">
                        {isLoading ? <Skeleton className="h-40 w-full" /> : Object.keys(folderStructure).length === 0 ? (
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
                                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                <span className="font-black text-slate-700 text-xs uppercase tracking-tight">{subject}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-1 pl-4 space-y-1">
                                            {Object.entries(subTopics).map(([subTitle, items]) => (
                                                <Accordion key={subTitle} type="single" collapsible>
                                                    <AccordionItem value={subTitle} className="border-none">
                                                        <AccordionTrigger className="text-[11px] font-bold text-slate-500 py-2 hover:text-emerald-600">
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

            {/* MAIN STAGE */}
            <div className="lg:col-span-3">
                {problem ? (
                    <Card className={`transition-all duration-500 overflow-hidden ${isJunior ? juniorTheme.card : 'rounded-[48px] shadow-2xl bg-white'}`}>
                        <div className={isJunior ? juniorTheme.header : 'bg-emerald-600 p-10 text-white'}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex gap-2 mb-4">
                                        <Badge className="bg-white/20 border-none">{problem.category}</Badge>
                                        <Badge className="bg-emerald-400 border-none">{problem.subTopic}</Badge>
                                    </div>
                                    <CardTitle className={`font-black tracking-tight ${isJunior ? 'text-5xl' : 'text-4xl'}`}>{isJunior && '🧮'} {problem.title}</CardTitle>
                                </div>
                                <div className="text-right">
                                    <p className={`text-[10px] font-black uppercase opacity-60 ${isJunior ? 'text-yellow-100' : ''}`}>Curriculum Level</p>
                                    <p className="font-bold">{problem.gradeLevel}</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-12 space-y-10">
                            {isJunior && (problem.latexFormula.includes('+') || problem.latexFormula.includes('-')) && (
                                <div className="flex flex-wrap justify-center gap-4 text-5xl">
                                    {Array.from({ length: parseInt(problem.latexFormula.split(/[-+]/)[0]) || 0 }).map((_, i) => <span key={i}>{problem.icon || '⭐'}</span>)}
                                    <span className="text-6xl font-black text-slate-300">{problem.latexFormula.includes('+') ? '+' : '-'}</span>
                                    {Array.from({ length: parseInt(problem.latexFormula.split(/[-+]/)[1]) || 0 }).map((_, i) => <span key={i} className="opacity-50">{problem.icon || '⭐'}</span>)}
                                </div>
                            )}
                            <div className={isJunior ? juniorTheme.mathBox : 'bg-slate-900 p-12 rounded-[40px] shadow-2xl border-t-8 border-emerald-500'}>
                                <div className={`text-center overflow-x-auto ${isJunior ? 'text-7xl text-blue-800' : 'text-4xl text-emerald-400'}`}>
                                    <SafeMath formula={problem.latexFormula} />
                                </div>
                            </div>

                            <div className="max-w-2xl mx-auto text-center space-y-8">
                                <p className={`font-medium leading-relaxed italic ${isJunior ? 'text-3xl text-slate-700' : 'text-2xl text-slate-600'}`}>
                                    "{problem.instruction}"
                                </p>
                                <div className="flex flex-col items-center gap-6">
                                    <Input value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Enter final derived value..." className={`font-mono text-center border-4 shadow-inner ${isJunior ? 'h-24 text-5xl rounded-[40px] border-sky-200' : 'h-20 text-4xl rounded-[32px] border-slate-100'}`} />
                                    <Button onClick={checkAnswer} className={isJunior ? juniorTheme.button : 'h-16 px-20 bg-emerald-600 hover:bg-emerald-700 text-xl font-black rounded-full'}>
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
                        <div className="p-8 bg-slate-50 rounded-full mb-6"><Sigma className="w-20 h-20 text-slate-200" /></div>
                        <h2 className="text-3xl font-black text-slate-300 uppercase tracking-widest text-center">
                            Select a topic from the <br /> {selectedGrade} library
                        </h2>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- 3. DISCOVERY LAB (FOLDER ORGANIZED) ---
function DiscoveryLab({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const [lab, setLab] = useState<any>(null);
    const [stage, setStage] = useState<'hypothesis' | 'experiment' | 'conclusion'>('hypothesis');
    const [selectedGrade, setSelectedGrade] = useState('Junior Secondary (JHS)');
    const isJunior = isJuniorLevel(selectedGrade);

    const labQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'senior_labs'), orderBy('createdAt', 'desc')) : null, 
    [firestore]);
    const { data: dbLabs, isLoading } = useCollection<any>(labQuery);

    const folderStructure = useMemo(() => {
        if (!dbLabs) return {};
        const filtered = dbLabs.filter(l => (l.gradeLevel || 'Junior Secondary (JHS)') === selectedGrade);
        return filtered.reduce((acc, l) => {
            const category = l.category || 'Science Journal';
            const subTopic = l.subTopic || 'Research Mission';
            if (!acc[category]) acc[category] = {};
            if (!acc[category][subTopic]) acc[category][subTopic] = [];
            acc[category][subTopic].push(l);
            return acc;
        }, {} as Record<string, Record<string, any[]>>);
    }, [dbLabs, selectedGrade]);
    
    return (
        <div className="grid lg:grid-cols-4 gap-8 animate-in fade-in">
            {/* SIDEBAR NAVIGATION */}
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-cyan-900 p-4 rounded-3xl shadow-lg">
                    <Label className="text-cyan-300 text-[10px] uppercase font-black ml-2 mb-2 block">Research Level</Label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                        <SelectTrigger className="bg-cyan-800 border-cyan-700 text-white rounded-2xl h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                </div>

                <ScrollArea className="h-[70vh] rounded-3xl border-2 border-slate-100 bg-white p-2">
                    <div className="p-2 space-y-2">
                         {isLoading ? <Skeleton className="h-40 w-full"/> : Object.keys(folderStructure).length === 0 ? (
                            <div className="text-center py-20 text-slate-300">
                                <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p className="text-xs font-bold">No labs in this category yet.</p>
                            </div>
                         ) : (
                            Object.entries(folderStructure).map(([cat, subs]) => (
                                <Accordion key={cat} type="single" collapsible className="w-full">
                                    <AccordionItem value={cat} className="border-none">
                                        <AccordionTrigger className="hover:no-underline p-3 bg-cyan-50 rounded-2xl mb-1">
                                            <div className="flex items-center gap-2">
                                                <Microscope className="w-3 h-3 text-cyan-500" />
                                                <span className="font-black text-cyan-900 text-xs uppercase">{cat}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-1 pl-4">
                                            {Object.entries(subs).map(([subTitle, items]) => (
                                                <Accordion key={subTitle} type="single" collapsible>
                                                    <AccordionItem value={subTitle} className="border-none">
                                                        <AccordionTrigger className="text-[11px] font-bold text-slate-500 py-2">{subTitle}</AccordionTrigger>
                                                        <AccordionContent className="space-y-1">
                                                            {items.map((item: any) => (
                                                                <button key={item.id} onClick={() => { setLab(item); setStage('hypothesis'); }} className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all ${lab?.id === item.id ? 'bg-cyan-600 text-white shadow-md' : 'hover:bg-cyan-50 text-slate-600'}`}>{item.title}</button>
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

            {/* WORKSTATION (Discovery View) */}
            <div className="lg:col-span-3">
                {lab ? (
                    <Card className={`transition-all duration-500 overflow-hidden ${isJunior ? juniorTheme.card : 'rounded-[48px] shadow-2xl bg-white'}`}>
                        <div className={`grid md:grid-cols-3 ${isJunior ? 'min-h-[500px]' : 'min-h-[600px]'}`}>
                            <div className="bg-slate-900 text-white p-10 space-y-8">
                                <div className="flex flex-col gap-6">
                                    {['hypothesis', 'experiment', 'conclusion'].map((s: any, i) => (
                                        <div key={s} className={`flex items-center gap-4 transition-opacity ${stage === s ? 'opacity-100' : 'opacity-30'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-orange-500' : 'bg-green-500'}`}>{i+1}</div>
                                            <span className="font-black capitalize">{s}</span>
                                        </div>
                                    ))}
                                </div>
                                <hr className="opacity-10" />
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Scientific Background</p>
                                    <p className="text-sm opacity-60 leading-relaxed italic">{lab.background}</p>
                                </div>
                            </div>
                            <div className="md:col-span-2 p-12 flex flex-col justify-center">
                                {stage === 'hypothesis' && (
                                    <div className="space-y-8 animate-in slide-in-from-right-4">
                                        <h2 className={`font-black leading-tight ${isJunior ? 'text-4xl' : 'text-3xl'} ${juniorTheme.text}`}>{isJunior && '🤔'} {lab.question}</h2>
                                        <div className={`p-8 rounded-[32px] border-2 space-y-4 ${isJunior ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-100'}`}>
                                            <p className={`font-bold ${isJunior ? 'text-xl' : ''} ${isJunior ? 'text-yellow-900' : 'text-blue-800'}`}>{lab.hypothesisPrompt}</p>
                                            <div className="grid gap-3">
                                                {lab.hypothesisOptions.map((opt: string) => (
                                                    <Button key={opt} variant="outline" className={`bg-white border-2 h-auto py-4 font-bold rounded-2xl ${isJunior ? 'text-lg' : ''}`} onClick={() => setStage('experiment')}>{opt}</Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {stage === 'experiment' && (
                                    <div className="text-center space-y-8 animate-in zoom-in">
                                        <h2 className={`font-black ${isJunior ? 'text-4xl' : 'text-3xl'} ${juniorTheme.text}`}>Mission: Data Collection</h2>
                                        <div className="text-[180px] py-10 animate-pulse">{lab.icon}</div>
                                        <Button onClick={() => setStage('conclusion')} className={`h-16 px-12 text-xl font-black rounded-full shadow-xl ${isJunior ? juniorTheme.button : 'bg-orange-500 hover:bg-orange-600'}`}>Observe Outcome</Button>
                                    </div>
                                )}
                                {stage === 'conclusion' && (
                                    <div className="space-y-6 animate-in slide-in-from-bottom-4">
                                        <h2 className={`font-black ${isJunior ? 'text-5xl text-green-800' : 'text-4xl text-green-700'}`}>Discovery Conclusion</h2>
                                        <div className={`p-8 rounded-[40px] border-4 space-y-4 ${isJunior ? 'bg-green-50 border-green-200' : 'bg-green-50 border-green-100'}`}>
                                            <p className={`font-bold ${isJunior ? 'text-3xl' : 'text-2xl'} text-slate-800`}>{lab.conclusion}</p>
                                            <p className={`leading-relaxed ${isJunior ? 'text-2xl text-slate-600' : 'text-lg text-slate-600'}`}>{lab.explanation}</p>
                                        </div>
                                        <Button onClick={() => { setLab(null); confetti(); }} className={`w-full h-16 text-xl font-black rounded-2xl shadow-xl ${isJunior ? juniorTheme.button : 'bg-green-600 hover:bg-green-700'}`}>Complete Mission</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-white rounded-[48px] border-4 border-dashed border-slate-100 min-h-[500px]">
                        <Microscope className="w-20 h-20 text-slate-100 mb-4" />
                        <h2 className="text-2xl font-black text-slate-300 uppercase tracking-widest text-center">Select an Active Research Lab</h2>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- 4. ADMIN CONSOLE (Manual & AI Hybrid) ---
function AdminConsole({ onContentAdded }: { onContentAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [subject, setSubject] = useState<'math' | 'english' | 'science'>('math');
    const [creationMode, setCreationMode] = useState<'ai' | 'manual'>('ai');
    const [loading, setLoading] = useState(false);

    // AI States
    const [topic, setTopic] = useState("");
    const [targetGrade, setTargetGrade] = useState('Junior Secondary (JHS)');

    // Manual States
    const [manualData, setManualData] = useState<any>({
        title: '',
        category: '',
        subTopic: '',
        gradeLevel: 'Junior Secondary (JHS)',
        latexFormula: '',
        instruction: '',
        answer: '',
        content: '',
        genre: '',
        quiz: [{ question: '', answer: '' }, { question: '', answer: '' }, { question: '', answer: '' }],
        background: '',
        question: '',
        hypothesisPrompt: '',
        hypothesisOptions: ['', '', ''],
        conclusion: '',
        explanation: '',
        icon: '🔬'
    });

    const handleAiGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        const context = { topic, gradeLevel: targetGrade as any };
        let result;

        if (subject === 'math') result = await generateSeniorMath(context);
        else if (subject === 'english') result = await generateSeniorEnglish(context);
        else result = await generateSeniorLab(context);

        if (result.success && result.data) {
            await addDoc(collection(firestore!, subject === 'math' ? 'senior_math' : subject === 'english' ? 'senior_stories' : 'senior_labs'), {
                ...result.data,
                gradeLevel: targetGrade, 
                createdAt: serverTimestamp()
            });
            toast({ title: 'AI Success', description: `Added to ${targetGrade} library.` });
            onContentAdded();
            setTopic("");
        }
        setLoading(false);
    };

    const handleManualSave = async () => {
        if (!manualData.title || !manualData.category || !manualData.subTopic) {
            toast({ title: "Filing Required", description: "Title, Category, and Sub-Topic are needed for folder organization.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const colName = subject === 'math' ? 'senior_math' : subject === 'english' ? 'senior_stories' : 'senior_labs';
            await addDoc(collection(firestore!, colName), {
                ...manualData,
                createdAt: serverTimestamp()
            });
            toast({ title: "Saved", description: "Manual entry added to the folders." });
            onContentAdded();
            setManualData({ ...manualData, title: '', latexFormula: '', content: '', background: '', answer: '' });
        } catch (e) {
            toast({ title: "Error", description: "Failed to save manually.", variant: "destructive" });
        }
        setLoading(false);
    };

    return (
        <Card className="bg-slate-900 border-none shadow-2xl overflow-hidden rounded-[40px] animate-in fade-in">
            <div className="p-6 bg-slate-800/50 border-b border-slate-700 flex flex-wrap justify-between items-center gap-4">
                <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-700">
                    <Button variant={creationMode === 'ai' ? 'secondary' : 'ghost'} onClick={() => setCreationMode('ai')} className="rounded-xl font-bold text-xs h-9">
                        <Sparkles className="w-3 h-3 mr-2 text-blue-400"/> AI Magic
                    </Button>
                    <Button variant={creationMode === 'manual' ? 'secondary' : 'ghost'} onClick={() => setCreationMode('manual')} className="rounded-xl font-bold text-xs h-9">
                        <PenTool className="w-3 h-3 mr-2 text-emerald-400"/> Manual Entry
                    </Button>
                </div>
                <div className="flex gap-2">
                    {['math', 'english', 'science'].map((s: any) => (
                        <button key={s} onClick={() => setSubject(s)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${subject === s ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <CardContent className="p-8">
                {creationMode === 'ai' ? (
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 space-y-2 w-full">
                            <Label className="text-slate-500 text-[10px] font-black uppercase ml-2">Topic for AI</Label>
                            <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Simultaneous Equations, Plant Cells..." className="h-14 bg-slate-800 border-slate-700 text-white rounded-2xl" />
                        </div>
                        <div className="w-full md:w-64 space-y-2">
                            <Label className="text-slate-500 text-[10px] font-black uppercase ml-2">Target Grade</Label>
                            <Select value={targetGrade} onValueChange={setTargetGrade}>
                                <SelectTrigger className="h-14 bg-slate-800 border-slate-700 text-white rounded-2xl"><SelectValue /></SelectTrigger>
                                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleAiGenerate} disabled={loading || !topic} className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black min-w-[160px]">
                            {loading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2 h-4 w-4"/> GENERATE</>}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-top-4">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-500 text-[10px] font-black uppercase">Category (Main Folder)</Label>
                                <Input placeholder={subject === 'math' ? 'e.g. Algebra' : 'e.g. Narrative'} value={manualData.category} onChange={e => setManualData({...manualData, category: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-500 text-[10px] font-black uppercase">Sub-Topic (Sub Folder)</Label>
                                <Input placeholder={subject === 'math' ? 'e.g. Differentiation' : 'e.g. Short Stories'} value={manualData.subTopic} onChange={e => setManualData({...manualData, subTopic: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-500 text-[10px] font-black uppercase">Target Student Category</Label>
                                <Select value={manualData.gradeLevel} onValueChange={(v) => setManualData({...manualData, gradeLevel: v})}>
                                    <SelectTrigger className="h-12 bg-slate-800 border-slate-700 text-white rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Input placeholder="Problem/Passage Title" value={manualData.title} onChange={e => setManualData({...manualData, title: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl text-lg font-bold" />
                            
                            {subject === 'math' && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <Textarea placeholder="LaTeX Formula (e.g. \frac{x}{y})" value={manualData.latexFormula} onChange={e => setManualData({...manualData, latexFormula: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-32 rounded-xl font-mono" />
                                        <Input placeholder="Instruction (e.g. Solve for x)" value={manualData.instruction} onChange={e => setManualData({...manualData, instruction: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl" />
                                        <Input placeholder="Final Answer" value={manualData.answer} onChange={e => setManualData({...manualData, answer: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl" />
                                    </div>
                                    <div className="bg-slate-950 rounded-2xl p-6 flex flex-col justify-center items-center border-2 border-dashed border-slate-800">
                                        <p className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-widest">Live Math Preview</p>
                                        <div className="text-2xl text-emerald-400">
                                            {manualData.latexFormula ? <SafeMath formula={manualData.latexFormula} /> : <span className="opacity-20 italic text-sm">Formula will render here</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {subject === 'english' && (
                                <div className="space-y-4">
                                    <Textarea placeholder="Full Literary Passage Content..." value={manualData.content} onChange={e => setManualData({...manualData, content: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-48 rounded-xl" />
                                    <div className="grid grid-cols-3 gap-2">
                                        {[0,1,2].map(i => (
                                            <div key={i} className="p-3 bg-slate-800/50 rounded-xl space-y-2">
                                                <Label className="text-[9px] text-indigo-400 font-bold uppercase">Quiz Q{i+1}</Label>
                                                <Input placeholder="Question" className="h-8 text-xs bg-slate-700 border-none text-white" value={manualData.quiz[i].question} onChange={e => {
                                                    const n = [...manualData.quiz]; n[i].question = e.target.value; setManualData({...manualData, quiz: n});
                                                }} />
                                                <Input placeholder="Answer" className="h-8 text-xs bg-slate-700 border-none text-white" value={manualData.quiz[i].answer} onChange={e => {
                                                    const n = [...manualData.quiz]; n[i].answer = e.target.value; setManualData({...manualData, quiz: n});
                                                }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {subject === 'science' && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Textarea placeholder="Experiment Background" value={manualData.background} onChange={e => setManualData({...manualData, background: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-32 rounded-xl" />
                                    <Textarea placeholder="Hypothesis Prompt" value={manualData.hypothesisPrompt} onChange={e => setManualData({...manualData, hypothesisPrompt: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-32 rounded-xl" />
                                    <div className="md:col-span-2 grid grid-cols-3 gap-2">
                                        {manualData.hypothesisOptions.map((opt: string, i: number) => (
                                            <Input key={i} placeholder={`Option ${i+1}`} value={opt} onChange={e => {
                                                const n = [...manualData.hypothesisOptions]; n[i] = e.target.value; setManualData({...manualData, hypothesisOptions: n});
                                            }} className="bg-slate-800 border-slate-700 text-white h-10 rounded-lg" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button onClick={handleManualSave} disabled={loading} className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black shadow-xl">
                            {loading ? <Loader2 className="animate-spin" /> : <><Save className="mr-2" /> PUBLISH MANUAL MISSION</>}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ... (Keep the rest of the file as is) ...
// --- MAIN PAGE COMPONENT ---
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
