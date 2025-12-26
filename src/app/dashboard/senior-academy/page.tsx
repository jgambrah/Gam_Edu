
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, serverTimestamp, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { 
  Sigma, Languages, Microscope, BookOpen, 
  Rocket, Volume2, Wand2, PenTool, Loader2, Save, Trash2, Library, Brain, CheckCircle2, XCircle, PlusCircle, Sparkles, FolderOpen, Atom as AtomIcon, Languages as LanguagesIcon, Sigma as SigmaIcon
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


// Import AI actions
import { generateSeniorEnglish, generateSeniorMath, generateSeniorLab } from '@/ai/flows/senior-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';


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

const isJuniorLevel = (grade: string) => 
    grade === 'Early Childhood' || grade === 'Lower Primary';

const juniorStyles = {
    // English Storybook styles
    storybook: "bg-[#FFFDE7] border-y-8 border-x-4 border-orange-200 rounded-[60px] p-8 shadow-[0_15px_0_#FFE082]",
    storyText: "text-3xl font-bold text-orange-900 leading-relaxed font-serif",
    
    // Science Quest styles
    questCard: "bg-gradient-to-b from-sky-400 to-blue-500 border-b-[12px] border-blue-700 rounded-[50px] text-white",
    stepBubble: "w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl shadow-lg border-4 border-blue-200",
    
    // Math Playground styles
    card: "rounded-[60px] border-8 border-yellow-200 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100",
    header: "p-10 text-center",
    mathBox: "bg-sky-100 p-10 rounded-[50px] border-4 border-dashed border-sky-300 shadow-inner",
    
    // Global Elements
    button: "h-24 px-12 bg-gradient-to-t from-pink-600 to-pink-400 hover:scale-105 text-3xl font-black text-white rounded-[40px] shadow-[0_12px_0_#9d174d] active:translate-y-2 active:shadow-none transition-all",
    input: "h-28 text-7xl font-black text-center border-8 border-yellow-300 rounded-[40px] bg-white text-pink-500 shadow-inner"
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
    const { data: library, forceRefetch } = useCollection<any>(storiesQuery);

    // Folder Logic for English
    const folderStructure = useMemo(() => {
        if (!library) return {};
        const filtered = library.filter(s => (s.gradeLevel || 'Junior Secondary (JHS)') === selectedGrade);
        return filtered.reduce((acc, s) => {
            const category = s.category || s.genre || 'General Reading'; // Folder 1
            const subTopic = s.subTopic || 'Standard Comprehension'; // Folder 2
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
                        {Object.keys(folderStructure).length === 0 ? (
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
                    <Card className={`overflow-hidden bg-white ${isJunior ? juniorStyles.storybook : "rounded-[48px] border-none shadow-2xl animate-in zoom-in"}`}>
                        <div className={isJunior ? "text-center mb-8" : "bg-indigo-600 p-10 text-white"}>
                            {isJunior && <div className="text-7xl mb-4 animate-bounce">📖</div>}
                            <CardTitle className={isJunior ? "text-5xl font-black text-orange-800" : "text-4xl font-black"}>
                                {activeStory.title}
                            </CardTitle>
                            {isJunior && <p className="text-orange-400 font-black mt-2 uppercase tracking-widest">A Magic Tale</p>}
                        </div>

                        <CardContent className={isJunior ? "space-y-12" : "p-12 space-y-10"}>
                            <p className={isJunior ? juniorStyles.storyText : "text-2xl leading-relaxed text-slate-700 font-serif whitespace-pre-wrap"}>
                                {activeStory.content}
                            </p>

                            <div className={isJunior ? "bg-white/80 p-10 rounded-[50px] border-4 border-dashed border-orange-300 space-y-8" : "bg-slate-50 p-8 rounded-[32px] space-y-6 border-2 border-slate-100"}>
                                <h3 className={isJunior ? "text-4xl font-black text-pink-500 text-center" : "text-2xl font-black text-indigo-900"}>
                                    {isJunior ? "🌟 Discovery Questions 🌟" : "Critical Analysis Questions"}
                                </h3>
                                
                                {activeStory.quiz.map((q: any, i: number) => (
                                    <div key={i} className="space-y-4 text-center">
                                        <p className={isJunior ? "text-2xl font-black text-blue-900" : "font-bold text-slate-800"}>
                                            {isJunior ? `🌈 ${q.question}` : `${i + 1}. ${q.question}`}
                                        </p>
                                        <Input 
                                            placeholder={isJunior ? "Tell me the secret..." : "Type analysis..."} 
                                            value={answers[i] || ""} 
                                            onChange={e => { const n = [...answers]; n[i] = e.target.value; setAnswers(n); }} 
                                            className={isJunior ? juniorStyles.input : "h-14 rounded-2xl border-2"} 
                                        />
                                    </div>
                                ))}
                                <Button onClick={checkAnswers} className={isJunior ? juniorStyles.button : "w-full h-16 bg-indigo-600 font-black"}>
                                    {isJunior ? "CHECK MY ANSWERS! 🏆" : "SUBMIT ANALYSIS"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : <div className="h-full flex flex-col items-center justify-center text-center">
                         <div className={`p-10 rounded-full mb-6 ${isJunior ? 'bg-yellow-100 animate-pulse' : 'bg-slate-50'}`}>
                            <BookOpen className={`w-20 h-20 ${isJunior ? 'text-yellow-500' : 'text-slate-100'}`} />
                         </div>
                         <h2 className="text-3xl font-black text-slate-300">Choose a Magic Book</h2>
                    </div>}
            </div>
        </div>
    );
}

// --- 2. ADVANCED MATH LAB ---
function CounterDisplay({ count }: { count: number }) {
    const icons = ['🍎', '⭐', '🎈', '🐱', '🚗', '🍦'];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    // Cap at 20 so the screen doesn't get too messy
    const displayCount = Math.min(count, 20);

    return (
        <div className="flex flex-wrap justify-center gap-3 p-6 bg-white/50 rounded-3xl mt-4">
            {Array.from({ length: displayCount }).map((_, i) => (
                <span key={i} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                    {icon}
                </span>
            ))}
            {count > 20 && <span className="text-xl font-black text-blue-400">... and more!</span>}
        </div>
    );
}

function MathLab({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [problem, setProblem] = useState<any>(null);
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState<any>(null);

    const [selectedGrade, setSelectedGrade] = useState('Junior Secondary (JHS)');
    const isJunior = isJuniorLevel(selectedGrade);
    const theme = isJunior ? juniorStyles : null;

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
                                        <AccordionTrigger className="hover:no-underline p-3 bg-emerald-50 rounded-2xl mb-1 group">
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
                    <Card className={isJunior ? theme?.card : "rounded-[48px] border-none shadow-2xl overflow-hidden bg-white"}>
                        <div className={isJunior ? theme?.header : "bg-emerald-600 p-10 text-white"}>
                            <div className="flex justify-between items-center">
                                <CardTitle className={isJunior ? "text-5xl font-black text-blue-900" : "text-4xl font-black"}>
                                    {isJunior && "🌈 "} {problem.title}
                                </CardTitle>
                                <Badge className={isJunior ? "bg-white text-pink-500 text-lg px-4" : "bg-emerald-400"}>
                                    {problem.gradeLevel}
                                </Badge>
                            </div>
                        </div>

                        <CardContent className="p-12 space-y-10">
                            <div className={isJunior ? theme?.mathBox : "bg-slate-900 p-12 rounded-[40px] shadow-inner border-t-8 border-emerald-500"}>
                                <div className={isJunior ? "text-7xl text-blue-600 flex justify-center" : "text-5xl text-emerald-400"}>
                                    <SafeMath formula={problem.latexFormula} />
                                </div>
                                {isJunior && !isNaN(parseInt(problem.answer)) && (
                                    <div className="mt-8 border-t border-sky-200 pt-6">
                                        <p className="text-center font-black text-sky-500 uppercase text-xs tracking-widest mb-2">Can you count them?</p>
                                        <CounterDisplay count={parseInt(problem.answer)} />
                                    </div>
                                )}
                            </div>

                            <div className="text-center space-y-8">
                                <p className={isJunior ? "text-3xl font-black text-blue-800" : "text-2xl font-medium text-slate-600 italic"}>
                                    {isJunior ? "✨ " + problem.instruction : `"${problem.instruction}"`}
                                </p>
                                <div className="flex flex-col items-center gap-6">
                                    <Input 
                                        value={userInput} 
                                        onChange={e => setUserInput(e.target.value)} 
                                        placeholder={isJunior ? "Type Number Here..." : "Enter Solution..."} 
                                        className={isJunior 
                                            ? juniorStyles.input 
                                            : "h-20 text-4xl font-mono text-center border-4 border-slate-100 rounded-[24px] focus:border-emerald-500 shadow-inner"
                                        }
                                    />
                                    <Button 
                                        onClick={checkAnswer} 
                                        className={isJunior ? theme?.button : "h-16 px-16 bg-emerald-600 hover:bg-emerald-700 text-xl font-black rounded-full"}
                                    >
                                        {isJunior ? "I'M FINISHED! 🚀" : "VERIFY ANSWER"}
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
                        <h2 className="text-2xl font-black text-slate-300 uppercase tracking-widest text-center">
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
    const theme = isJunior ? juniorStyles : null;

    const labQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'senior_labs'), orderBy('createdAt', 'desc')) : null, 
    [firestore]);
    const { data: dbLabs } = useCollection<any>(labQuery);

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
                         {Object.keys(folderStructure).length === 0 ? (
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
                                                <div className="text-lg">{cat === 'Life Science' ? '🧬' : cat === 'Physical Science' ? '🔬' : '🌍'}</div>
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
                    <Card className={`overflow-hidden bg-white ${isJunior ? theme?.card : "rounded-[48px] shadow-2xl animate-in zoom-in"}`}>
                        <div className={`grid md:grid-cols-3 ${isJunior ? 'min-h-[500px]' : 'min-h-[600px]'}`}>
                            <div className={isJunior ? `p-10 space-y-8 ${theme?.questCard}` : `bg-slate-900 text-white p-10 space-y-8`}>
                                <div className="flex flex-col gap-6">
                                    {['hypothesis', 'experiment', 'conclusion'].map((s: any, i) => (
                                        <div key={s} className={`flex items-center gap-4 transition-opacity ${stage === s ? 'opacity-100' : 'opacity-30'}`}>
                                            <div className={isJunior ? theme?.stepBubble : "w-10 h-10 rounded-full flex items-center justify-center font-bold bg-blue-500"}>{i+1}</div>
                                            <span className="font-black capitalize">{isJunior ? (s === 'hypothesis' ? 'The Big Question' : s === 'experiment' ? 'Let\'s Explore!' : 'What Happened?') : s}</span>
                                        </div>
                                    ))}
                                </div>
                                <hr className="opacity-10" />
                                <div className="space-y-2">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${isJunior ? 'text-blue-200' : 'text-blue-400'}`}>Scientific Background</p>
                                    <p className={`text-sm leading-relaxed italic ${isJunior ? 'opacity-80' : 'opacity-60'}`}>{lab.background}</p>
                                </div>
                            </div>
                            <div className="md:col-span-2 p-12 flex flex-col justify-center">
                                {stage === 'hypothesis' && (
                                    <div className="space-y-8 animate-in slide-in-from-right-4">
                                        <h2 className={isJunior ? "text-5xl font-black text-blue-600 text-center" : "text-3xl font-black text-slate-800"}>
                                            {isJunior ? '🤔 What is your Guess?' : lab.question}
                                        </h2>
                                        <div className={isJunior ? "p-10 bg-white rounded-[60px] border-8 border-blue-100 shadow-inner" : "p-8 bg-blue-50 rounded-[32px] border-2 border-blue-100"}>
                                            {isJunior && <p className="text-blue-400 font-bold mb-6 text-center uppercase tracking-widest">Pick a card!</p>}
                                            <div className={isJunior ? "grid grid-cols-1 gap-4" : "grid gap-3"}>
                                                {lab.hypothesisOptions.map((opt: string) => (
                                                    <Button 
                                                        key={opt} 
                                                        variant="outline" 
                                                        className={isJunior 
                                                            ? "h-24 text-2xl font-black border-4 border-blue-50 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-[35px] transition-all" 
                                                            : "bg-white border-2 h-auto py-4 font-bold rounded-2xl"} 
                                                        onClick={() => setStage('experiment')}
                                                    >
                                                        {isJunior && "✨ "} {opt}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {stage === 'experiment' && (
                                    <div className="text-center space-y-12 animate-in zoom-in">
                                        <h2 className={isJunior ? "text-5xl font-black text-orange-500" : "text-3xl font-black text-slate-800"}>
                                            {isJunior ? "🚀 Let's Try It!" : "Mission: Data Collection"}
                                        </h2>
                                        <div className={isJunior ? "text-[200px] hover:rotate-12 transition-transform cursor-pointer" : "text-[180px] py-10 animate-pulse"}>{lab.icon}</div>
                                        <Button onClick={() => setStage('conclusion')} className={isJunior ? juniorStyles.button : "h-16 px-12 bg-orange-500 hover:bg-orange-600 text-xl font-black rounded-full shadow-xl"}>
                                            {isJunior ? "SEE THE SECRET! 🔍" : "Observe Outcome"}
                                        </Button>
                                    </div>
                                )}
                                {stage === 'conclusion' && (
                                    <div className="space-y-6 animate-in slide-in-from-bottom-4">
                                        <h2 className={`font-black ${isJunior ? 'text-5xl text-green-800' : 'text-4xl text-green-700'}`}>Discovery Conclusion</h2>
                                        <div className={`p-8 rounded-[40px] border-4 space-y-4 ${isJunior ? 'bg-green-50 border-green-200' : 'bg-green-50 border-green-100'}`}>
                                            <p className={`font-bold ${isJunior ? 'text-3xl' : 'text-2xl'} text-slate-800`}>{lab.conclusion}</p>
                                            <p className={`leading-relaxed ${isJunior ? 'text-2xl text-slate-600' : 'text-lg text-slate-600'}`}>{lab.explanation}</p>
                                        </div>
                                        <Button onClick={() => { setLab(null); confetti(); }} className={`w-full h-16 text-xl font-black rounded-2xl shadow-xl ${isJunior ? juniorStyles.button : 'bg-green-600 hover:bg-green-700'}`}>Complete Mission</Button>
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

// --- 4. ADMIN CONSOLE (HYBRID AI & MANUAL CREATOR) ---
function AdminConsole({ onContentAdded }: { onContentAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [creationMode, setCreationMode] = useState<'ai' | 'manual'>('ai');
    const [subject, setSubject] = useState<'math' | 'english' | 'science'>('math');
    const [loading, setLoading] = useState(false);

    // AI Form State
    const [topic, setTopic] = useState("");
    const [targetGrade, setTargetGrade] = useState('Junior Secondary (JHS)');
    const [instructions, setInstructions] = useState('');
    
    // Manual Form State
    const [manualData, setManualData] = useState<any>({
        title: '',
        category: '', // Broad Category (e.g. Algebra)
        subTopic: '', // Sub Topic (e.g. Linear Equations)
        gradeLevel: 'Junior Secondary (JHS)',
        latexFormula: '',
        instruction: '',
        answer: '',
        content: '', // For English
        genre: '',   // For English
        quiz: [{ question: '', answer: '' }, { question: '', answer: '' }, { question: '', answer: '' }],
        background: '', // For Science
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
        const isJunior = isJuniorLevel(targetGrade);
        const systemInstructions = isJunior ? `${instructions}. Target audience: 5-7 year olds. Use simple words, short sentences, and LOTS of emojis. In math, make sure the answer is a whole number between 1 and 20 so it can be counted visually.` : instructions;
        const context = { 
            topic, 
            gradeLevel: targetGrade as any, 
            instructions: systemInstructions 
        };

        let res;
        if (subject === 'math') res = await generateSeniorMath(context);
        else if (subject === 'english') res = await generateSeniorEnglish(context);
        else res = await generateSeniorLab(context);

        if (res.success && res.data) {
            await addDoc(collection(firestore!, subject === 'math' ? 'senior_math' : subject === 'english' ? 'senior_stories' : 'senior_labs'), {
                ...res.data,
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
            toast({ title: "Filing Required", description: "You must provide a Category and Sub-Topic to place this in the correct folder.", variant: "destructive" });
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
        <Card className="bg-slate-900 border-none rounded-[40px] text-white p-8 mb-12 shadow-2xl">
            {/* Control Bar */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black flex items-center gap-2"><PenTool className="text-yellow-400" /> Professor's Desk</h2>
                <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700">
                    <Button variant={creationMode === 'ai' ? 'secondary' : 'ghost'} size="sm" onClick={() => setCreationMode('ai')}>AI Magic</Button>
                    <Button variant={creationMode === 'manual' ? 'secondary' : 'ghost'} size="sm" onClick={() => setCreationMode('manual')}>Manual</Button>
                </div>
            </div>
            
            {creationMode === 'ai' ? (
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2 w-full"><Label className="text-slate-400 text-[10px] font-black uppercase ml-2">Topic for AI</Label><Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Simultaneous Equations, Plant Cells..." className="h-14 bg-slate-800 border-slate-700 text-white rounded-2xl" /></div>
                    <div className="w-full md:w-64 space-y-2"><Label className="text-slate-400 text-[10px] font-black uppercase ml-2">Target Grade</Label><Select value={targetGrade} onValueChange={setTargetGrade}><SelectTrigger className="h-14 bg-slate-800 border-slate-700 text-white rounded-2xl"><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                    <div className="w-full md:w-48 space-y-2"><Label className="text-slate-400 text-[10px] font-black uppercase ml-2">Subject</Label><Select value={subject} onValueChange={setSubject as any}><SelectTrigger className="capitalize h-14 bg-slate-800 border-slate-700 text-white rounded-2xl"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="math">Math</SelectItem><SelectItem value="english">English</SelectItem><SelectItem value="science">Science</SelectItem></SelectContent></Select></div>
                    <Button onClick={handleAiGenerate} disabled={loading || !topic} className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black min-w-[160px]">
                        {loading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2 h-4 w-4"/> GENERATE</>}
                    </Button>
                </div>
            ) : (
                /* --- MANUAL ENTRY FORM --- */
                <div className="space-y-6 animate-in slide-in-from-top-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label>Category (Main Folder)</Label><Input placeholder={subject === 'math' ? 'e.g. Algebra' : subject === 'english' ? 'e.g. Narrative' : 'e.g. Life Science'} value={manualData.category} onChange={e => setManualData({...manualData, category: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl" /></div>
                        <div className="space-y-2"><Label>Sub-Topic (Sub Folder)</Label><Input placeholder={subject === 'math' ? 'e.g. Differentiation' : subject === 'english' ? 'e.g. Short Stories' : 'e.g. Plant Biology'} value={manualData.subTopic} onChange={e => setManualData({...manualData, subTopic: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl" /></div>
                        <div className="space-y-2"><Label>Target Student Category</Label><Select value={manualData.gradeLevel} onValueChange={(v) => setManualData({...manualData, gradeLevel: v})}><SelectTrigger className="h-12 bg-slate-800 border-slate-700 text-white rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                    </div>
                    <div className="space-y-4">
                        <Input placeholder="Problem/Passage Title" value={manualData.title} onChange={e => setManualData({...manualData, title: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl text-lg font-bold" />
                        {subject === 'math' && <div className="grid md:grid-cols-2 gap-4"><div><Textarea placeholder="LaTeX Formula (e.g. \frac{x}{y})" value={manualData.latexFormula} onChange={e => setManualData({...manualData, latexFormula: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-32 rounded-xl font-mono" /><Input placeholder="Instruction (e.g. Solve for x)" value={manualData.instruction} onChange={e => setManualData({...manualData, instruction: e.target.value})} className="bg-slate-800 border-slate-700 text-white mt-2" /><Input placeholder="Final Answer" value={manualData.answer} onChange={e => setManualData({...manualData, answer: e.target.value})} className="bg-slate-800 border-slate-700 text-white mt-2" /></div><div className="bg-slate-950 p-6 rounded-2xl flex flex-col justify-center items-center border-2 border-dashed border-slate-800"><p className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-widest">Live Math Preview</p><div className="text-2xl text-emerald-400">{manualData.latexFormula ? <SafeMath formula={manualData.latexFormula} /> : <span className="opacity-20 italic text-sm">Formula will render here</span>}</div></div></div>}
                        {subject === 'english' && <div className="space-y-4"><Textarea placeholder="Full Literary Passage Content..." value={manualData.content} onChange={e => setManualData({...manualData, content: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-48 rounded-xl" /><div className="grid grid-cols-3 gap-2">{[0,1,2].map(i => (<div key={i} className="p-3 bg-slate-800/50 rounded-xl space-y-2"><Label className="text-[9px] text-indigo-400 font-bold uppercase">Quiz Q{i+1}</Label><Input placeholder="Question" className="h-8 text-xs bg-slate-700 border-none text-white" value={manualData.quiz[i].question} onChange={e => {const n = [...manualData.quiz]; n[i] = {...n[i], question: e.target.value}; setManualData({...manualData, quiz: n});}} /><Input placeholder="Answer" className="h-8 text-xs bg-slate-700 border-none text-white" value={manualData.quiz[i].answer} onChange={e => {const n = [...manualData.quiz]; n[i] = {...n[i], answer: e.target.value}; setManualData({...manualData, quiz: n});}} /></div>))}</div></div>}
                        {subject === 'science' && <div className="grid md:grid-cols-2 gap-4"><Textarea placeholder="Experiment Background" value={manualData.background} onChange={e => setManualData({...manualData, background: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-32 rounded-xl" /><Textarea placeholder="Hypothesis Prompt" value={manualData.hypothesisPrompt} onChange={e => setManualData({...manualData, hypothesisPrompt: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-32 rounded-xl" /><div className="md:col-span-2 grid grid-cols-3 gap-2">{manualData.hypothesisOptions.map((opt: string, i: number) => (<Input key={i} placeholder={`Option ${i+1}`} value={opt} onChange={e => {const n = [...manualData.hypothesisOptions]; n[i] = e.target.value; setManualData({...manualData, hypothesisOptions: n});}} className="bg-slate-800 border-slate-700 text-white h-10 rounded-lg" />))}<Input placeholder="Icon Emoji (e.g. 🔬)" value={manualData.icon} onChange={e => setManualData({...manualData, icon: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl" /><Input placeholder="Conclusion" value={manualData.conclusion} onChange={e => setManualData({...manualData, conclusion: e.target.value})} className="bg-slate-800 border-slate-700 text-white h-12 rounded-xl" /><Textarea placeholder="Explanation" value={manualData.explanation} onChange={e => setManualData({...manualData, explanation: e.target.value})} className="md:col-span-2 bg-slate-800 border-slate-700 text-white h-24 rounded-xl" /></div></div>}
                    </div>
                    <Button onClick={handleManualSave} disabled={loading} className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black shadow-xl">
                        {loading ? <Loader2 className="animate-spin" /> : <><Save className="mr-2" /> PUBLISH MANUAL MISSION</>}
                    </Button>
                </div>
            )}
        </Card>
    );
}


// --- MAIN PAGE ---
export default function SeniorAcademyPage() {
    const { role } = useRole();
    const canEdit = ['Teacher', 'Administrator', 'Director'].includes(role || '');
    const firestore = useFirestore();
    
    // Memoize forceRefetch to prevent re-creation on every render
    const { forceRefetch: forceMath } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'senior_math') : null, [firestore]));
    const { forceRefetch: forceEnglish } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'senior_stories') : null, [firestore]));
    const { forceRefetch: forceScience } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'senior_labs') : null, [firestore]));

    const handleContentUpdate = useCallback(() => {
        forceMath();
        forceEnglish();
        forceScience();
    }, [forceMath, forceEnglish, forceScience]);
    
    return (
        <div className="space-y-8 p-1">
            <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-[48px] shadow-2xl border-b-8 border-slate-700">
                <CardHeader className="p-10">
                    <CardTitle className="text-5xl font-black flex items-center gap-4">
                        <Rocket className="w-12 h-12 text-indigo-400" />
                        <span>Senior Academy</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400 text-lg max-w-2xl mt-2">
                        Advanced, folder-organized learning modules for focused study in Mathematics, Literature, and Scientific Discovery, complete with AI-powered content generation for teachers.
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="space-y-12">
                
                {canEdit && <div className="mb-8"><AdminConsole onContentAdded={handleContentUpdate} /></div>}

                <Tabs defaultValue="math" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-24 bg-white p-3 rounded-[32px] shadow-2xl border border-slate-100 mb-16">
                        <TabsTrigger value="math" className="h-full rounded-2xl text-lg font-bold flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                            <SigmaIcon className="w-6 h-6"/> Advanced Math Lab
                        </TabsTrigger>
                        <TabsTrigger value="english" className="h-full rounded-2xl text-lg font-bold flex items-center gap-2 data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                            <LanguagesIcon className="w-6 h-6"/> English Mastery
                        </TabsTrigger>
                        <TabsTrigger value="science" className="h-full rounded-2xl text-lg font-bold flex items-center gap-2 data-[state=active]:bg-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                            <AtomIcon className="w-6 h-6"/> Discovery Lab
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="math"><MathLab canEdit={canEdit} /></TabsContent>
                    <TabsContent value="english"><EnglishMastery canEdit={canEdit} /></TabsContent>
                    <TabsContent value="science"><DiscoveryLab canEdit={canEdit} /></TabsContent>
                </Tabs>
            </div>
             <style jsx global>{`
                .math-container { max-width: 100%; overflow-x: auto; overflow-y: hidden; }
                .katex-display { margin: 0 !important; }
            `}</style>
        </div>
    );
}

