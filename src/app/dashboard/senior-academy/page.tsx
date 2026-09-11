

'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { SectionHeroBanner } from '@/components/common/SectionHeroBanner';
import { collection, query, where, orderBy, serverTimestamp, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { 
  Sigma, Languages, Microscope, BookOpen, 
  Rocket, Wand2, PenTool, Loader2, Save, Trash2, Library, Brain, CheckCircle2, XCircle, PlusCircle, Sparkles, FolderOpen, Atom as AtomIcon, Languages as LanguagesIcon, Sigma as SigmaIcon,
  Folder, FileText, ChevronRight, ChevronLeft
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
import { awardActivityXP, triggerStudentBadgeEvent } from '@/lib/achievement-utils';
import { Student } from '@/lib/types';
import { generateSeniorEnglish, generateSeniorMath, generateSeniorLab } from '@/ai/flows/senior-actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';


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

interface SuggestedModuleCard {
    title: string;
    meta: string;
    description: string;
    difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
    sampleInstruction: string;
    sampleFormula?: string;
    sampleAnswer: string;
    content?: string;
    background?: string;
    hypothesisPrompt?: string;
    hypothesisOptions?: string[];
    conclusion?: string;
    explanation?: string;
}

const SUGGESTED_MATH_MODULES: SuggestedModuleCard[] = [
    {
        title: "Linear & Quadratic Equations",
        meta: "4 Subtopics • 45 mins",
        description: "Formulate and solve first and second-degree polynomial systems using factoring and the quadratic formula.",
        difficulty: "Intermediate",
        sampleInstruction: "Solve for the positive value of x in the quadratic expression:",
        sampleFormula: "2x^2 - 8x + 6 = 0",
        sampleAnswer: "3"
    },
    {
        title: "Algebraic Fractions & Indices",
        meta: "3 Subtopics • 35 mins",
        description: "Simplifying rational algebraic expressions, fractional exponents, and exponential power laws.",
        difficulty: "Advanced",
        sampleInstruction: "Simplify and evaluate the exponential index expression:",
        sampleFormula: "\\frac{2^3 \\times 2^4}{2^5}",
        sampleAnswer: "4"
    },
    {
        title: "Simultaneous Systems",
        meta: "5 Subtopics • 50 mins",
        description: "Solve coupled multi-variable linear equations using substitution, elimination, and graph intersections.",
        difficulty: "Intermediate",
        sampleInstruction: "Solve for the value of y in the simultaneous system:",
        sampleFormula: "\\begin{cases} 2x + y = 11 \\\\ x - y = 1 \\end{cases}",
        sampleAnswer: "3"
    },
    {
        title: "Inequalities & Graphs",
        meta: "3 Subtopics • 40 mins",
        description: "Linear inequalities on the Cartesian plane, number line plotting, and boundary solutions.",
        difficulty: "Foundation",
        sampleInstruction: "Find the maximum integer value for x satisfying the inequality:",
        sampleFormula: "3x - 5 < 10",
        sampleAnswer: "4"
    },
    {
        title: "Pythagorean & Trig Ratios",
        meta: "4 Subtopics • 45 mins",
        description: "Right-angled triangle geometry, sine, cosine, and tangent trigonometric relationships.",
        difficulty: "Intermediate",
        sampleInstruction: "Calculate hypotenuse length c for a right-angled triangle where a = 3 and b = 4:",
        sampleFormula: "c = \\sqrt{3^2 + 4^2}",
        sampleAnswer: "5"
    },
    {
        title: "Set Theory & Probability",
        meta: "3 Subtopics • 30 mins",
        description: "Venn diagrams, sample spaces, union, intersection, and event outcome odds.",
        difficulty: "Foundation",
        sampleInstruction: "A fair 6-sided die is rolled. Calculate the probability of rolling a prime number (decimal form):",
        sampleFormula: "P(\\text{Prime}) = \\frac{3}{6}",
        sampleAnswer: "0.5"
    }
];

const SUGGESTED_ENGLISH_MODULES: SuggestedModuleCard[] = [
    {
        title: "Rhetorical Devices & Argumentation",
        meta: "4 Modules • 45 mins",
        description: "Master ethos, pathos, logos, antithesis, and persuasive rhetoric in contemporary and classical essays.",
        difficulty: "Advanced",
        sampleInstruction: "Analyze the tone and rhetorical emphasis of the excerpt.",
        sampleAnswer: "Persuasive",
        content: "To argue for progress is not merely to suggest change; it is to demand that justice and equity form the very foundation upon which tomorrow is constructed."
    },
    {
        title: "Narrative Structure & Perspective",
        meta: "3 Modules • 35 mins",
        description: "Examine first, second, and third-person omniscient viewpoints, non-linear timelines, and story pacing.",
        difficulty: "Intermediate",
        sampleInstruction: "Identify the narrative point of view and thematic motif.",
        sampleAnswer: "First person",
        content: "I watched the morning mist roll down the hills, feeling the quiet rhythm of the school waking to another dawn of discovery and ambition."
    },
    {
        title: "Poetic Meter & Literary Imagery",
        meta: "3 Modules • 40 mins",
        description: "Understand iambic pentameter, metaphor, personification, and sensory imagery in lyric verse.",
        difficulty: "Advanced",
        sampleInstruction: "Evaluate the primary poetic device used in the passage.",
        sampleAnswer: "Metaphor",
        content: "Knowledge is an unending river, carving through solid stone of doubt with patient, unrelenting grace."
    },
    {
        title: "Critical Reading & Textual Inferences",
        meta: "4 Modules • 30 mins",
        description: "Draw deductive conclusions, synthesize implicit author intentions, and analyze text evidence.",
        difficulty: "Foundation",
        sampleInstruction: "Infer the main conclusion drawn by the author.",
        sampleAnswer: "Dedication",
        content: "Success in inquiry is seldom accidental; it is born from countless hours of patient trial, steady observation, and unwavering curiosity."
    }
];

const SUGGESTED_SCIENCE_MODULES: SuggestedModuleCard[] = [
    {
        title: "Photosynthesis & Cellular Respiration",
        meta: "3 Labs • 45 mins",
        description: "Investigate light and dark reaction stages, chlorophyll absorption, and ATP energy synthesis in plant cells.",
        difficulty: "Intermediate",
        sampleInstruction: "Hypothesize oxygen output under concentrated light spectra.",
        sampleAnswer: "Increases",
        background: "Green plants convert sunlight, water, and carbon dioxide into glucose and oxygen through chloroplasts.",
        hypothesisPrompt: "What happens to the rate of photosynthesis when light intensity doubles?",
        hypothesisOptions: ["Photosynthetic rate increases up to saturation", "Photosynthetic rate drops to zero", "No measurable change"],
        conclusion: "Light intensity directly accelerates the photolysis of water until enzyme saturation occurs.",
        explanation: "Chlorophyll pigments absorb photons, transferring energy to reaction centers for ATP generation."
    },
    {
        title: "Newtonian Mechanics & Force Labs",
        meta: "4 Labs • 50 mins",
        description: "Simulate velocity, momentum conservation, kinetic energy transfers, and friction coefficients.",
        difficulty: "Advanced",
        sampleInstruction: "Evaluate net force and acceleration for colliding masses.",
        sampleAnswer: "F = ma",
        background: "Newton's laws govern how macroscopic objects interact under applied external forces and gravity.",
        hypothesisPrompt: "How does doubling mass affect acceleration when applied force remains constant?",
        hypothesisOptions: ["Acceleration is halved", "Acceleration doubles", "Acceleration remains identical"],
        conclusion: "Acceleration is inversely proportional to mass under constant applied net force.",
        explanation: "According to Newton's Second Law (F = ma), a = F/m, hence doubling m halves a."
    },
    {
        title: "Acids, Bases & Neutralization Titration",
        meta: "3 Labs • 40 mins",
        description: "Measure pH shifts, indicator color endpoints, and stoichiometric salt-water yields.",
        difficulty: "Intermediate",
        sampleInstruction: "Calculate neutralization equivalence endpoint.",
        sampleAnswer: "pH 7",
        background: "When hydrochloric acid reacts with sodium hydroxide, neutralization produces salt and water.",
        hypothesisPrompt: "What is the expected pH at the stoichiometric equivalence point for a strong acid and strong base?",
        hypothesisOptions: ["pH = 7.0 (Neutral)", "pH = 3.5 (Acidic)", "pH = 10.0 (Basic)"],
        conclusion: "Strong acid and strong base titrations yield a neutral salt solution at equivalence.",
        explanation: "Equal moles of H+ and OH- ions combine to form neutral H2O molecules."
    },
    {
        title: "Electric Circuits, Voltage & Ohm's Law",
        meta: "4 Labs • 35 mins",
        description: "Construct virtual series and parallel circuits to measure current, potential difference, and resistance.",
        difficulty: "Foundation",
        sampleInstruction: "Determine current I given V = 12V and R = 4Ω.",
        sampleAnswer: "3A",
        background: "Ohm's law relates current (I), voltage (V), and resistance (R) in a closed conductive path.",
        hypothesisPrompt: "If circuit resistance is doubled while supply voltage is kept constant, what occurs to the current?",
        hypothesisOptions: ["Current is halved", "Current doubles", "Voltage drops to zero"],
        conclusion: "Current flowing through a conductor is inversely proportional to resistance.",
        explanation: "By Ohm's Law (I = V/R), increasing resistance diminishes electron flow rate."
    }
];


// --- 1. ENGLISH MASTERY (FOLDER ORGANIZED) ---
function EnglishMastery({ canEdit }: { canEdit: boolean }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [activeStory, setActiveStory] = useState<any>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    const [selectedGrade, setSelectedGrade] = useState('Junior Secondary (JHS)');

    const isJunior = isJuniorLevel(selectedGrade);
    const isPrimary = selectedGrade === 'Early Childhood' || selectedGrade === 'Lower Primary' || selectedGrade === 'Upper Primary';

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

    const { data: studentRecord } = useCollection<Student>(
        useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [user, firestore])
    );

    const checkAnswers = async () => {
        let correct = 0;
        activeStory.quiz.forEach((q: any, i: number) => {
            if (answers[i]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) correct++;
        });
        if (correct === activeStory.quiz.length) { 
            confetti(); 
            speak("Analysis complete! You have mastered this passage.");
            if (user && firestore) {
                const targetStudentId = studentRecord && studentRecord[0]?.id ? studentRecord[0].id : user.uid;
                await awardActivityXP(firestore, targetStudentId, 50, 'Senior English Passage', 'stem_explorer');
                await triggerStudentBadgeEvent(firestore, targetStudentId, { type: 'LIBRARY_BOOK_RETURNED' });
                await triggerStudentBadgeEvent(firestore, targetStudentId, { type: 'STEM_CHALLENGE_COMPLETED' });
                toast({ title: 'Passage Mastered! 📚', description: '+50 XP saved to your profile! STEM Pioneer & Avid Reader badges evaluated.' });
            }
        }
        else { speak(`Keep investigating. You found ${correct} insights.`); }
    };

    return (
        <div className="grid lg:grid-cols-4 gap-8 animate-in fade-in">
            {/* SIDEBAR NAVIGATION */}
            <div className="lg:col-span-1 space-y-4">
                <div className="bg-slate-900 p-4 rounded-3xl shadow-lg border border-slate-800">
                    <Label className="text-slate-400 text-[10px] uppercase font-black ml-2 mb-2 block">English Level</Label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                        <SelectTrigger className="bg-slate-950 border-slate-850 text-white rounded-2xl h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                </div>

                <ScrollArea className="h-[70vh] rounded-3xl border border-indigo-500/20 bg-slate-900 p-2 shadow-2xl">
                    <div className="p-2 space-y-2">
                        {Object.keys(folderStructure).length === 0 ? (
                            <div className="text-center py-20 text-slate-500">
                                <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p className="text-xs font-bold">No passages in this category yet.</p>
                            </div>
                        ) : (
                            Object.entries(folderStructure).map(([cat, subs]) => (
                                <Accordion key={cat} type="single" collapsible className="w-full">
                                    <AccordionItem value={cat} className="border-none">
                                        <AccordionTrigger className="hover:no-underline p-3 bg-slate-950/80 hover:bg-slate-900 border border-slate-850 rounded-2xl mb-1 group flex items-center justify-between text-indigo-300">
                                            <div className="flex items-center gap-2">
                                                <Folder className="w-4 h-4 text-indigo-400 group-data-[state=open]:hidden" />
                                                <FolderOpen className="w-4 h-4 text-indigo-400 hidden group-data-[state=open]:block" />
                                                <span className="font-black text-xs uppercase tracking-wider">{cat}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-1 pl-3 space-y-1">
                                            {Object.entries(subs as any).map(([subTitle, items]: [string, any]) => (
                                                <Accordion key={subTitle} type="single" collapsible>
                                                    <AccordionItem value={subTitle} className="border-none">
                                                        <AccordionTrigger className="text-[11px] font-bold text-slate-300 py-2.5 hover:text-indigo-400 pl-2 flex items-center justify-between group">
                                                            <div className="flex items-center gap-1.5">
                                                                <Folder className="w-3.5 h-3.5 text-indigo-500/80 group-data-[state=open]:hidden" />
                                                                <FolderOpen className="w-3.5 h-3.5 text-indigo-500/80 hidden group-data-[state=open]:block" />
                                                                <span>{subTitle}</span>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="space-y-1 pl-3">
                                                            {items.map((item: any) => (
                                                                <button 
                                                                    key={item.id} 
                                                                    onClick={() => { setActiveStory(item); setAnswers([]); }} 
                                                                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                                                                        activeStory?.id === item.id 
                                                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                                                                            : 'hover:bg-slate-800/60 text-slate-200 hover:text-white'
                                                                    }`}
                                                                >
                                                                    <FileText className="w-3.5 h-3.5 shrink-0 opacity-80" />
                                                                    <span className="truncate">{item.title}</span>
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

            {/* WORKSTATION */}
            <div className="lg:col-span-3">
                {activeStory ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => { setActiveStory(null); setAnswers([]); }}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 pl-0 hover:bg-transparent"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back to Curriculum Modules
                            </Button>
                            <span className="text-xs text-slate-400">
                                Active Module: <strong className="text-indigo-300">{activeStory.title}</strong>
                            </span>
                        </div>
                        <Card className={`overflow-hidden ${isJunior ? juniorStyles.storybook : "rounded-[48px] bg-slate-900 border border-slate-800 shadow-2xl animate-in zoom-in"}`}>
                        <div className={isJunior ? "text-center mb-8" : "bg-gradient-to-r from-indigo-950 to-slate-900 p-10 border-b border-indigo-900/30 text-white"}>
                            {isJunior && <div className="text-7xl mb-4 animate-bounce">📖</div>}
                            <CardTitle className={isJunior ? "text-5xl font-black text-orange-800" : "text-4xl font-black text-white"}>
                                {activeStory.title}
                            </CardTitle>
                            {isJunior && <p className="text-orange-400 font-black mt-2 uppercase tracking-widest">A Magic Tale</p>}
                        </div>

                        <CardContent className={isJunior ? "space-y-12" : "p-10 space-y-10"}>
                            <div className={cn(
                                "relative overflow-hidden font-serif leading-relaxed whitespace-pre-wrap rounded-3xl p-8 md:p-12 shadow-inner",
                                isJunior 
                                    ? "bg-[#FFFDF7] text-orange-950 text-2xl pl-12 md:pl-16 border-4 border-orange-100" 
                                    : isPrimary 
                                        ? "bg-[#FCFBF7] text-slate-800 text-lg pl-12 md:pl-16 border border-slate-200" 
                                        : "bg-[#FCFAF2] text-slate-850 text-lg md:columns-2 gap-10 border border-[#EADFCA]"
                            )}>
                                {activeStory.content}
                            </div>

                            {/* QUIZ SECTION */}
                            <div className="space-y-8 pt-8 border-t border-slate-800">
                                <h3 className={isJunior ? "text-4xl font-black text-orange-600 text-center" : "text-2xl font-black text-white flex items-center gap-3"}>
                                    <Sparkles className="text-indigo-400" /> Comprehension & Literary Check
                                </h3>

                                {activeStory.quiz && activeStory.quiz.map((q: any, i: number) => (
                                    <div key={i} className={isJunior ? "space-y-4 text-center" : "space-y-2"}>
                                        <p className={isJunior ? "text-2xl font-black text-blue-900" : "font-bold text-slate-200 text-sm flex items-center gap-2"}>
                                            {isJunior ? `🌈 ${q.question}` : <><span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">{i + 1}</span> {q.question}</>}
                                        </p>
                                        <Input 
                                            placeholder={isJunior ? "Tell me the secret..." : "Type analysis..."} 
                                            value={answers[i] || ""} 
                                            onChange={e => { const n = [...answers]; n[i] = e.target.value; setAnswers(n); }} 
                                            className={isJunior ? juniorStyles.input : "h-12 bg-slate-900 border-slate-850 text-white rounded-xl focus:border-indigo-550 focus:ring-0"} 
                                        />
                                    </div>
                                ))}
                                <Button 
                                    onClick={checkAnswers} 
                                    className={isJunior 
                                        ? juniorStyles.button 
                                        : "w-full h-14 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black text-base rounded-xl shadow-[0_4px_0_#4338ca] hover:shadow-[0_2px_0_#4338ca] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all"
                                    }
                                >
                                    {isJunior ? "CHECK MY ANSWERS! 🏆" : "SUBMIT ANALYSIS"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                    Literary Modules & Guided Reading • {selectedGrade}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Launch an interactive literary session or select an archived passage from the left.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {SUGGESTED_ENGLISH_MODULES.map((mod, i) => (
                                <div 
                                    key={i} 
                                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/40 hover:bg-slate-850 transition-all flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                                                {mod.title}
                                            </h4>
                                            <span className="text-xs text-slate-400 shrink-0 font-medium">
                                                {mod.meta}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                                            {mod.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider",
                                            mod.difficulty === 'Foundation' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            mod.difficulty === 'Advanced' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        )}>
                                            {mod.difficulty}
                                        </span>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setActiveStory({
                                                    id: `suggested-eng-${i}`,
                                                    title: mod.title,
                                                    content: mod.content,
                                                    quiz: [
                                                        { question: mod.sampleInstruction, answer: mod.sampleAnswer },
                                                        { question: "What is the primary rhetorical goal of the passage?", answer: "To inspire analytical perspective" }
                                                    ],
                                                    gradeLevel: selectedGrade
                                                });
                                                setAnswers([]);
                                            }}
                                            className="h-8 px-3 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                                        >
                                            <span>Launch Lab</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
    const { user } = useUser();
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

    const { data: studentRecord } = useCollection<Student>(
        useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [user, firestore])
    );

    const checkAnswer = async () => {
        if (userInput.trim().toLowerCase() === problem.answer.toLowerCase().trim()) {
            setFeedback({ ok: true, msg: "Logical match confirmed! Well done." });
            confetti();
            speak("Correct solution.");
            if (user && firestore) {
                const targetStudentId = studentRecord && studentRecord[0]?.id ? studentRecord[0].id : user.uid;
                await awardActivityXP(firestore, targetStudentId, 40, 'Senior Math Solution', 'stem_explorer');
                await triggerStudentBadgeEvent(firestore, targetStudentId, { type: 'STEM_CHALLENGE_COMPLETED' });
                toast({ title: 'Math Solution Confirmed! 📐', description: '+40 XP saved to your profile! STEM Pioneer badge evaluated.' });
            }
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
                <ScrollArea className="h-[70vh] rounded-3xl border border-emerald-500/20 bg-slate-900 p-2 shadow-2xl">
                    <div className="space-y-2 p-2">
                        {isLoading ? <Skeleton className="h-40 w-full" /> : Object.keys(folderStructure).length === 0 ? (
                            <div className="text-center py-20 text-slate-500">
                                <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p className="text-xs font-bold">No questions in this category yet.</p>
                            </div>
                        ) : (
                            Object.entries(folderStructure).map(([subject, subTopics]) => (
                                <Accordion key={subject} type="single" collapsible className="w-full">
                                    <AccordionItem value={subject} className="border-none">
                                        <AccordionTrigger className="hover:no-underline p-3.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-850 rounded-2xl mb-1 group flex items-center justify-between text-emerald-400">
                                            <div className="flex items-center gap-2">
                                                <Folder className="w-4 h-4 text-emerald-400 group-data-[state=open]:hidden" />
                                                <FolderOpen className="w-4 h-4 text-emerald-400 hidden group-data-[state=open]:block" />
                                                <span className="font-black text-xs uppercase tracking-wider">{subject}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-1 pl-3 space-y-1">
                                            {Object.entries(subTopics as any).map(([subTitle, items]: [string, any]) => (
                                                <Accordion key={subTitle} type="single" collapsible>
                                                    <AccordionItem value={subTitle} className="border-none">
                                                        <AccordionTrigger className="text-[11px] font-bold text-slate-300 py-2.5 hover:text-emerald-400 pl-2 flex items-center justify-between group">
                                                            <div className="flex items-center gap-1.5">
                                                                <Folder className="w-3.5 h-3.5 text-emerald-500/80 group-data-[state=open]:hidden" />
                                                                <FolderOpen className="w-3.5 h-3.5 text-emerald-500/80 hidden group-data-[state=open]:block" />
                                                                <span>{subTitle} ({items.length})</span>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="space-y-1 pl-3">
                                                            {items.map((item: any) => (
                                                                <button
                                                                    key={item.id}
                                                                    onClick={() => { setProblem(item); setFeedback(null); setUserInput(""); }}
                                                                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                                                                        problem?.id === item.id 
                                                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
                                                                            : 'hover:bg-slate-800/60 text-slate-200 hover:text-white'
                                                                    }`}
                                                                >
                                                                    <FileText className="w-3.5 h-3.5 shrink-0 opacity-80" />
                                                                    <span className="truncate">{item.title}</span>
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
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => { setProblem(null); setFeedback(null); }}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 pl-0 hover:bg-transparent"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back to Curriculum Modules
                            </Button>
                            <span className="text-xs text-slate-400">
                                Active Module: <strong className="text-indigo-300">{problem.title || problem.subTopic}</strong>
                            </span>
                        </div>
                        <Card className={isJunior ? theme?.card : "rounded-[48px] bg-slate-900 border border-slate-850 shadow-2xl overflow-hidden text-white animate-in zoom-in"}>
                        <div className={isJunior ? theme?.header : "bg-gradient-to-r from-emerald-950 to-slate-900 p-10 border-b border-emerald-900/30 text-white"}>
                            <div className="flex justify-between items-center">
                                <CardTitle className={isJunior ? "text-5xl font-black text-blue-900" : "text-4xl font-black text-white"}>
                                    {isJunior && "🌈 "} {problem.title}
                                </CardTitle>
                                <Badge className={isJunior ? "bg-white text-pink-500 text-lg px-4" : "bg-emerald-600"}>
                                    {problem.gradeLevel}
                                </Badge>
                            </div>
                        </div>

                        <CardContent className="p-12 space-y-10">
                            {isJunior ? (
                                <div className={theme?.mathBox}>
                                    <div className="text-7xl text-blue-600 flex justify-center">
                                        <SafeMath formula={problem.latexFormula} />
                                    </div>
                                    {(!isNaN(parseInt(problem.answer))) && (
                                        <div className="mt-8 border-t border-sky-200 pt-6">
                                            <p className="text-center font-black text-sky-500 uppercase text-xs tracking-widest mb-2">Can you count them?</p>
                                            <CounterDisplay count={parseInt(problem.answer)} />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-slate-950 border border-slate-800 shadow-2xl rounded-[36px] overflow-hidden">
                                  {/* Terminal Bar */}
                                  <div className="bg-slate-900/80 px-5 py-3 border-b border-slate-850 flex items-center justify-between">
                                    <div className="flex gap-2">
                                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">DERIVATION ENGINE v1.0</span>
                                    <div className="w-12" />
                                  </div>
                                  <div className="p-10 md:p-14 flex flex-col justify-center items-center">
                                    <div className="text-4xl md:text-5xl text-emerald-450 font-mono tracking-wide drop-shadow-[0_0_8px_rgba(52,211,153,0.25)]">
                                      <SafeMath formula={problem.latexFormula} />
                                    </div>
                                  </div>
                                </div>
                            )}

                            <div className="text-center space-y-8">
                                <p className={isJunior ? "text-3xl font-black text-blue-800" : "text-2xl font-semibold text-slate-350 italic"}>
                                    {isJunior ? "✨ " + problem.instruction : `"${problem.instruction}"`}
                                </p>
                                <div className="flex flex-col items-center gap-6">
                                    <Input 
                                        value={userInput} 
                                        onChange={e => setUserInput(e.target.value)} 
                                        placeholder={isJunior ? "Type Number Here..." : "Enter Solution..."} 
                                        className={isJunior 
                                            ? juniorStyles.input 
                                            : "h-20 text-4xl font-mono text-center border-4 border-slate-800 bg-slate-950 text-emerald-400 rounded-[24px] focus:border-emerald-500 focus:ring-0 shadow-inner max-w-md w-full"
                                        }
                                    />
                                    <Button 
                                        onClick={checkAnswer} 
                                        className={isJunior 
                                            ? theme?.button 
                                            : "h-16 px-16 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-lg rounded-2xl shadow-[0_4px_0_#047857] hover:shadow-[0_2px_0_#047857] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all"
                                        }
                                    >
                                        {isJunior ? "I'M FINISHED! 🚀" : "VERIFY ANSWER"}
                                    </Button>
                                </div>
                            </div>

                            {feedback && (
                                <div className={`p-8 rounded-[32px] border-2 flex items-center justify-center gap-4 animate-bounce ${feedback.ok ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                    {feedback.ok ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                                    <p className="text-xl font-black">{feedback.msg}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                    Curriculum Labs & Recommended Modules • {selectedGrade}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Launch an interactive laboratory module below or select from your catalog folders on the left.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {SUGGESTED_MATH_MODULES.map((mod, i) => (
                                <div 
                                    key={i} 
                                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/40 hover:bg-slate-850 transition-all flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                                                {mod.title}
                                            </h4>
                                            <span className="text-xs text-slate-400 shrink-0 font-medium">
                                                {mod.meta}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                                            {mod.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider",
                                            mod.difficulty === 'Foundation' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            mod.difficulty === 'Advanced' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        )}>
                                            {mod.difficulty}
                                        </span>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setProblem({
                                                    id: `suggested-math-${i}`,
                                                    title: mod.title,
                                                    category: 'Algebra',
                                                    subTopic: mod.title,
                                                    instruction: mod.sampleInstruction,
                                                    latexFormula: mod.sampleFormula,
                                                    answer: mod.sampleAnswer,
                                                    gradeLevel: selectedGrade
                                                });
                                                setFeedback(null);
                                                setUserInput("");
                                            }}
                                            className="h-8 px-3 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                                        >
                                            <span>Launch Lab</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- 3. DISCOVERY LAB (FOLDER ORGANIZED) ---
function DiscoveryLab({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [lab, setLab] = useState<any>(null);
    const [stage, setStage] = useState<'hypothesis' | 'experiment' | 'conclusion'>('hypothesis');
    const [selectedGrade, setSelectedGrade] = useState('Junior Secondary (JHS)');

    const isJunior = isJuniorLevel(selectedGrade);
    const theme = isJunior ? juniorStyles : null;

    const { data: studentRecord } = useCollection<Student>(
        useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [user, firestore])
    );

    const handleCompleteMission = async () => {
        setLab(null);
        confetti();
        if (user && firestore) {
            const targetStudentId = studentRecord && studentRecord[0]?.id ? studentRecord[0].id : user.uid;
            await awardActivityXP(firestore, targetStudentId, 60, 'Discovery Lab Mission', 'stem_explorer');
            await triggerStudentBadgeEvent(firestore, targetStudentId, { type: 'STEM_CHALLENGE_COMPLETED' });
            toast({ title: 'Discovery Mission Complete! 🔬', description: '+60 XP saved to your profile! STEM Pioneer badge evaluated.' });
        }
    };

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
                <div className="bg-slate-900 p-4 rounded-3xl shadow-lg border border-slate-800">
                    <Label className="text-cyan-300 text-[10px] uppercase font-black ml-2 mb-2 block">Research Level</Label>
                    <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                        <SelectTrigger className="bg-slate-950 border-slate-850 text-white rounded-2xl h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                </div>

                <ScrollArea className="h-[70vh] rounded-3xl border border-cyan-500/20 bg-slate-900 p-2 shadow-2xl">
                    <div className="p-2 space-y-2">
                         {Object.keys(folderStructure).length === 0 ? (
                            <div className="text-center py-20 text-slate-500">
                                <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p className="text-xs font-bold">No labs in this category yet.</p>
                            </div>
                          ) : (
                            Object.entries(folderStructure).map(([cat, subs]) => (
                                <Accordion key={cat} type="single" collapsible className="w-full">
                                    <AccordionItem value={cat} className="border-none">
                                        <AccordionTrigger className="hover:no-underline p-3.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-855 rounded-2xl mb-1 group flex items-center justify-between text-cyan-400">
                                            <div className="flex items-center gap-2">
                                                <Folder className="w-4 h-4 text-cyan-450 group-data-[state=open]:hidden" />
                                                <FolderOpen className="w-4 h-4 text-cyan-450 hidden group-data-[state=open]:block" />
                                                <span className="font-black text-xs uppercase tracking-wider">{cat}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-1 pl-3 space-y-1">
                                            {Object.entries(subs as any).map(([subTitle, items]: [string, any]) => (
                                                <Accordion key={subTitle} type="single" collapsible>
                                                    <AccordionItem value={subTitle} className="border-none">
                                                        <AccordionTrigger className="text-[11px] font-bold text-slate-300 py-2.5 hover:text-cyan-400 pl-2 flex items-center justify-between group">
                                                            <div className="flex items-center gap-1.5">
                                                                <Folder className="w-3.5 h-3.5 text-cyan-500/80 group-data-[state=open]:hidden" />
                                                                <FolderOpen className="w-3.5 h-3.5 text-cyan-500/80 hidden group-data-[state=open]:block" />
                                                                <span>{subTitle}</span>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="space-y-1 pl-3">
                                                            {items.map((item: any) => (
                                                                <button 
                                                                    key={item.id} 
                                                                    onClick={() => { setLab(item); setStage('hypothesis'); }} 
                                                                    className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                                                                        lab?.id === item.id 
                                                                            ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' 
                                                                            : 'hover:bg-slate-800/60 text-slate-200 hover:text-white'
                                                                    }`}
                                                                >
                                                                    <FileText className="w-3.5 h-3.5 shrink-0 opacity-80" />
                                                                    <span className="truncate">{item.title}</span>
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

            {/* WORKSTATION (Discovery View) */}
            <div className="lg:col-span-3">
                {lab ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => { setLab(null); }}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 pl-0 hover:bg-transparent"
                            >
                                <ChevronLeft className="w-4 h-4" /> Back to Curriculum Modules
                            </Button>
                            <span className="text-xs text-slate-400">
                                Active Module: <strong className="text-indigo-300">{lab.title}</strong>
                            </span>
                        </div>
                        <Card className={`overflow-hidden ${isJunior ? theme?.card : "rounded-[48px] bg-slate-900 border border-slate-855 shadow-2xl animate-in zoom-in"}`}>
                        <div className={`grid md:grid-cols-3 ${isJunior ? 'min-h-[500px]' : 'min-h-[600px]'}`}>
                            <div className={isJunior ? `p-10 space-y-8 ${theme?.questCard}` : `bg-slate-950 text-white p-10 space-y-8 border-r border-slate-850 relative`}>
                                {!isJunior && (
                                    <div className="absolute left-[38px] top-12 bottom-36 w-0.5 bg-gradient-to-b from-cyan-500 via-indigo-500 to-violet-500/20 hidden md:block" />
                                )}
                                <div className="flex flex-col gap-6 relative z-10">
                                    {['hypothesis', 'experiment', 'conclusion'].map((s: any, i) => {
                                        const isActive = stage === s;
                                        const isCompleted = (stage === 'experiment' && i === 0) || (stage === 'conclusion' && i <= 1);
                                        return (
                                            <div key={s} className={cn("flex items-center gap-4 transition-all duration-300", isActive ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-60')}>
                                                <div className={isJunior 
                                                    ? theme?.stepBubble 
                                                    : cn(
                                                        "w-12 h-12 rounded-full flex items-center justify-center font-bold relative transition-all duration-300 border-2",
                                                        isActive ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]' : 
                                                        isCompleted ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                                                    )
                                                }>
                                                    {(!isJunior && isActive) && <div className="absolute -inset-1.5 rounded-full border border-cyan-400/40 animate-ping" />}
                                                    <span className={isJunior ? "" : "font-mono text-sm"}>{i+1}</span>
                                                </div>
                                                <div>
                                                    {!isJunior && <span className="font-black text-slate-500 text-[10px] tracking-wider block">STAGE {i+1}</span>}
                                                    <span className="font-black text-sm text-slate-200">
                                                        {isJunior 
                                                            ? (s === 'hypothesis' ? 'The Big Guess' : s === 'experiment' ? 'Let\'s Explore!' : 'What Happened?') 
                                                            : (s === 'hypothesis' ? 'Hypothesis' : s === 'experiment' ? 'Experiment' : 'Conclusion')
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <hr className="opacity-10 border-slate-800" />
                                <div className="space-y-2">
                                    <p className={`text-[10px] font-black uppercase tracking-widest ${isJunior ? 'text-blue-200' : 'text-cyan-400 flex items-center gap-1'}`}>🧪 Scientific Background</p>
                                    <p className={isJunior 
                                        ? "text-sm leading-relaxed italic opacity-85" 
                                        : "text-xs leading-relaxed text-slate-400 italic bg-slate-900/40 p-4 rounded-2xl border border-slate-855 shadow-inner"
                                    }>
                                        {lab.background}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="md:col-span-2 p-12 flex flex-col justify-center bg-slate-900/10">
                                {stage === 'hypothesis' && (
                                    <div className="space-y-8 animate-in slide-in-from-right-4">
                                        <h2 className={isJunior ? "text-5xl font-black text-blue-600 text-center" : "text-3xl font-black text-slate-200"}>
                                            {isJunior ? '🤔 What is your Guess?' : lab.question}
                                        </h2>
                                        <div className={isJunior ? "p-10 bg-white rounded-[60px] border-8 border-blue-100 shadow-inner animate-in zoom-in" : "p-8 bg-slate-950 border border-slate-800 rounded-[32px] shadow-2xl animate-in zoom-in"}>
                                            {isJunior && <p className="text-blue-400 font-bold mb-6 text-center uppercase tracking-widest">Pick a card!</p>}
                                            <div className="grid grid-cols-1 gap-4">
                                                {lab.hypothesisOptions.map((opt: string) => (
                                                    <Button 
                                                        key={opt} 
                                                        variant="outline" 
                                                        className={isJunior 
                                                            ? "h-24 text-2xl font-black border-4 border-blue-50 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-[35px] transition-all" 
                                                            : "bg-slate-900 border-2 border-slate-800 hover:border-cyan-500 hover:bg-slate-850 text-slate-200 hover:text-white h-auto py-6 px-8 text-left justify-start font-bold rounded-2xl transition-all duration-300 flex items-center gap-4 group shadow-md"
                                                        } 
                                                        onClick={() => setStage('experiment')}
                                                    >
                                                        {isJunior ? "✨ " + opt : (
                                                            <>
                                                                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black group-hover:bg-cyan-500 group-hover:text-white transition-colors shrink-0">
                                                                    →
                                                                </div>
                                                                <span className="text-base">{opt}</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {stage === 'experiment' && (
                                    <div className="space-y-8 animate-in zoom-in-95">
                                        <div className="text-center space-y-4">
                                            <h2 className={isJunior ? "text-5xl font-black text-blue-600" : "text-3xl font-black text-cyan-400"}>
                                                {isJunior ? '🚀 Experiment Time!' : 'Simulation in Progress'}
                                            </h2>
                                            <p className={isJunior ? "text-2xl font-bold text-slate-600" : "text-slate-400"}>Running active variable simulation model...</p>
                                        </div>

                                        <div className="h-64 bg-slate-950/80 border-2 border-slate-850 rounded-[40px] flex items-center justify-center relative overflow-hidden shadow-inner">
                                            <div className="absolute w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                                            <div className="absolute w-48 h-48 border-2 border-dashed border-cyan-500/20 rounded-full animate-spin [animation-duration:15s]" />
                                            <div className="relative z-10 flex flex-col items-center gap-4">
                                                <span className="text-6xl animate-bounce">🧪</span>
                                                <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-4 py-1 text-xs">
                                                    Data Collecting...
                                                </Badge>
                                            </div>
                                        </div>

                                        <Button 
                                            onClick={() => setStage('conclusion')} 
                                            className={isJunior 
                                                ? juniorStyles.button 
                                                : "w-full h-16 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-lg rounded-2xl shadow-[0_4px_0_#0284c7] hover:shadow-[0_2px_0_#0284c7] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all"
                                            }
                                        >
                                            {isJunior ? "SEE RESULTS! 🔍" : "OBSERVE FINDINGS"}
                                        </Button>
                                    </div>
                                )}
                                {stage === 'conclusion' && (
                                    <div className="space-y-8 animate-in slide-in-from-bottom-6">
                                        <div className="p-8 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[32px] space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">
                                                    ✓
                                                </div>
                                                <h3 className="text-xl font-black text-emerald-400">Scientific Finding</h3>
                                            </div>
                                            <p className={`leading-relaxed font-bold ${isJunior ? 'text-3xl text-emerald-900' : 'text-lg text-emerald-200'}`}>{lab.conclusion}</p>
                                        </div>
                                        <div className="p-8 bg-slate-950/60 border border-slate-850 rounded-[32px] space-y-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Core Principle</span>
                                            <p className={`leading-relaxed ${isJunior ? 'text-2xl text-slate-600' : 'text-base text-slate-300'}`}>{lab.explanation}</p>
                                        </div>
                                        <Button 
                                            onClick={handleCompleteMission} 
                                            className={isJunior 
                                                ? juniorStyles.button 
                                                : "w-full h-16 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-lg rounded-2xl shadow-[0_4px_0_#047857] hover:shadow-[0_2px_0_#047857] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none transition-all"
                                            }
                                        >
                                            {isJunior ? "COMPLETE MY MISSION! 🏆" : "COMPLETE MISSION"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-indigo-400" />
                                    Active Scientific Research Labs • {selectedGrade}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Select a research module to explore hypotheses, virtual experiments, and findings.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {SUGGESTED_SCIENCE_MODULES.map((mod, i) => (
                                <div 
                                    key={i} 
                                    className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/40 hover:bg-slate-850 transition-all flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                                                {mod.title}
                                            </h4>
                                            <span className="text-xs text-slate-400 shrink-0 font-medium">
                                                {mod.meta}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                                            {mod.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider",
                                            mod.difficulty === 'Foundation' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            mod.difficulty === 'Advanced' ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                        )}>
                                            {mod.difficulty}
                                        </span>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setLab({
                                                    id: `suggested-sci-${i}`,
                                                    title: mod.title,
                                                    background: mod.background,
                                                    hypothesisPrompt: mod.hypothesisPrompt,
                                                    hypothesisOptions: mod.hypothesisOptions,
                                                    conclusion: mod.conclusion,
                                                    explanation: mod.explanation,
                                                    gradeLevel: selectedGrade
                                                });
                                                setStage('hypothesis');
                                            }}
                                            className="h-8 px-3 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                                        >
                                            <span>Launch Lab</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- 4. ADMIN CONSOLE (HYBRID AI & MANUAL CREATOR) ---
function AdminConsole({ onContentAdded, activeGrade = 'Junior Secondary (JHS)' }: { onContentAdded: () => void; activeGrade?: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [creationMode, setCreationMode] = useState<'ai' | 'manual'>('ai');
    const [subject, setSubject] = useState<'math' | 'english' | 'science'>('math');
    const [loading, setLoading] = useState(false);

    // AI Form State
    const [topic, setTopic] = useState("");
    const [instructions, setInstructions] = useState('');
    
    // Manual Form State
    const [manualData, setManualData] = useState<any>({
        title: '',
        category: '', // Broad Category (e.g. Algebra)
        subTopic: '', // Sub Topic (e.g. Linear Equations)
        gradeLevel: activeGrade,
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
        const isJunior = isJuniorLevel(activeGrade);
        const systemInstructions = isJunior ? `${instructions}. Target audience: 5-7 year olds. Use simple words, short sentences, and LOTS of emojis. In math, make sure the answer is a whole number between 1 and 20 so it can be counted visually.` : instructions;
        const context = { 
            topic, 
            gradeLevel: activeGrade as any, 
            instructions: systemInstructions 
        };

        let res;
        if (subject === 'math') res = await generateSeniorMath(context);
        else if (subject === 'english') res = await generateSeniorEnglish(context);
        else res = await generateSeniorLab(context);

        if (res.success && res.data) {
            await addDoc(collection(firestore!, subject === 'math' ? 'senior_math' : subject === 'english' ? 'senior_stories' : 'senior_labs'), {
                ...res.data,
                gradeLevel: activeGrade, 
                createdAt: serverTimestamp()
            });
            toast({ title: 'AI Success', description: `Added to ${activeGrade} library.` });
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
                gradeLevel: manualData.gradeLevel || activeGrade,
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
        <Card className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl text-white p-5 mb-8 shadow-xl relative overflow-hidden">
            {/* Header Strip */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                    <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-white">
                        <PenTool className="w-4 h-4 text-indigo-400" /> Professor's Desk
                    </h2>
                    <span className="bg-indigo-950/80 text-indigo-300 text-[11px] px-2.5 py-0.5 rounded-full font-medium border border-indigo-800/40 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" /> Costs 10 Credits
                    </span>
                </div>
                <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                    <Button 
                        variant={creationMode === 'ai' ? 'secondary' : 'ghost'} 
                        size="sm" 
                        onClick={() => setCreationMode('ai')} 
                        className={cn("rounded-lg font-semibold text-xs h-7 px-3", creationMode === 'ai' ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-200')}
                    >
                        AI Magic
                    </Button>
                    <Button 
                        variant={creationMode === 'manual' ? 'secondary' : 'ghost'} 
                        size="sm" 
                        onClick={() => setCreationMode('manual')} 
                        className={cn("rounded-lg font-semibold text-xs h-7 px-3", creationMode === 'manual' ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-200')}
                    >
                        Manual
                    </Button>
                </div>
            </div>
            
            {creationMode === 'ai' ? (
                /* Sleek Single-Line AI Prompt Bar */
                <div className="animate-in fade-in flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                    <div className="flex items-center gap-2.5 flex-1 w-full px-3 py-1">
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                        <Input 
                            value={topic} 
                            onChange={e => setTopic(e.target.value)} 
                            onKeyDown={e => { if (e.key === 'Enter' && !loading && topic.trim()) handleAiGenerate(); }}
                            placeholder="Generate academic module... (e.g. Simultaneous Systems, Cell Respiration, Shakespearean Sonnets)" 
                            className="h-9 bg-transparent border-0 text-sm text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none" 
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end px-1 pb-1 sm:pb-0">
                        <Select value={subject} onValueChange={setSubject as any}>
                            <SelectTrigger className="capitalize h-8 w-28 bg-slate-900 border-slate-700/80 text-xs font-medium text-slate-200 rounded-lg focus:ring-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                <SelectItem value="math">Math</SelectItem>
                                <SelectItem value="english">English</SelectItem>
                                <SelectItem value="science">Science</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button 
                            onClick={handleAiGenerate} 
                            disabled={loading || !topic.trim()} 
                            size="sm"
                            className="h-8 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <><Wand2 className="h-3.5 w-3.5"/> Generate</>}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in slide-in-from-top-4 pt-2">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Category (Main Folder)</Label><Input placeholder={subject === 'math' ? 'e.g. Algebra' : subject === 'english' ? 'e.g. Narrative' : 'e.g. Life Science'} value={manualData.category} onChange={e => setManualData({...manualData, category: e.target.value})} className="bg-slate-950 border-slate-800 text-white h-10 rounded-xl focus:border-indigo-550 focus:ring-0 text-xs" /></div>
                        <div className="space-y-2"><Label className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Sub-Topic (Sub Folder)</Label><Input placeholder={subject === 'math' ? 'e.g. Differentiation' : subject === 'english' ? 'e.g. Short Stories' : 'e.g. Plant Biology'} value={manualData.subTopic} onChange={e => setManualData({...manualData, subTopic: e.target.value})} className="bg-slate-950 border-slate-800 text-white h-10 rounded-xl focus:border-indigo-550 focus:ring-0 text-xs" /></div>
                        <div className="space-y-2"><Label className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Target Student Category</Label><Select value={manualData.gradeLevel} onValueChange={(v) => setManualData({...manualData, gradeLevel: v})}><SelectTrigger className="h-10 bg-slate-950 border-slate-800 text-white font-bold rounded-xl text-xs"><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                    </div>
                    <div className="space-y-4">
                        <Input placeholder="Problem/Passage Title" value={manualData.title} onChange={e => setManualData({...manualData, title: e.target.value})} className="bg-slate-950 border-slate-800 text-white h-11 rounded-xl text-base font-bold focus:border-indigo-550 focus:ring-0" />
                        {subject === 'math' && <div className="grid md:grid-cols-2 gap-4"><div><Textarea placeholder="LaTeX Formula (e.g. \frac{x}{y})" value={manualData.latexFormula} onChange={e => setManualData({...manualData, latexFormula: e.target.value})} className="bg-slate-950 border-slate-800 text-white h-28 rounded-xl font-mono focus:border-indigo-550 focus:ring-0 text-xs" /><Input placeholder="Instruction (e.g. Solve for x)" value={manualData.instruction} onChange={e => setManualData({...manualData, instruction: e.target.value})} className="bg-slate-950 border-slate-800 text-white mt-2 h-10 rounded-lg text-xs" /><Input placeholder="Final Answer" value={manualData.answer} onChange={e => setManualData({...manualData, answer: e.target.value})} className="bg-slate-950 border-slate-800 text-white mt-2 h-10 rounded-lg text-xs" /></div><div className="bg-slate-950 p-6 rounded-2xl flex flex-col justify-center items-center border border-slate-800"><p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Live Math Preview</p><div className="text-xl text-indigo-300">{manualData.latexFormula ? <SafeMath formula={manualData.latexFormula} /> : <span className="opacity-20 italic text-sm text-slate-500">Formula will render here</span>}</div></div></div>}
                        {subject === 'english' && <div className="space-y-4"><Textarea placeholder="Full Literary Passage Content..." value={manualData.content} onChange={e => setManualData({...manualData, content: e.target.value})} className="bg-slate-950 border-slate-800 text-white h-36 rounded-xl focus:border-indigo-550 focus:ring-0 text-xs" /><div className="grid grid-cols-3 gap-2">{[0,1,2].map(i => (<div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2"><Label className="text-[9px] text-indigo-400 font-bold uppercase">Quiz Q{i+1}</Label><Input placeholder="Question" className="h-8 text-xs bg-slate-900 border-none text-white focus:ring-0" value={manualData.quiz[i].question} onChange={e => {const n = [...manualData.quiz]; n[i] = {...n[i], question: e.target.value}; setManualData({...manualData, quiz: n});}} /><Input placeholder="Answer" className="h-8 text-xs bg-slate-900 border-none text-white focus:ring-0" value={manualData.quiz[i].answer} onChange={e => {const n = [...manualData.quiz]; n[i] = {...n[i], answer: e.target.value}; setManualData({...manualData, quiz: n});}} /></div>))}</div></div>}
                        {subject === 'science' && <div className="grid md:grid-cols-2 gap-4"><Textarea placeholder="Experiment Background" value={manualData.background} onChange={e => setManualData({...manualData, background: e.target.value})} className="bg-slate-950 border-slate-800 text-white h-28 rounded-xl focus:border-indigo-550 focus:ring-0 text-xs" /><Textarea placeholder="Hypothesis Prompt" value={manualData.hypothesisPrompt} onChange={e => setManualData({...manualData, hypothesisPrompt: e.target.value})} className="bg-slate-950 border-slate-800 text-white h-28 rounded-xl focus:border-indigo-550 focus:ring-0 text-xs" /><div className="md:col-span-2 grid grid-cols-3 gap-2">{manualData.hypothesisOptions.map((opt: string, i: number) => (<Input key={i} placeholder={`Option ${i+1}`} value={opt} onChange={e => {const n = [...manualData.hypothesisOptions]; n[i] = e.target.value; setManualData({...manualData, hypothesisOptions: n});}} className="bg-slate-950 border-slate-800 text-white h-9 rounded-lg text-xs" />))}<Input placeholder="Icon Emoji (e.g. 🔬)" value={manualData.icon} onChange={e => setManualData({...manualData, icon: e.target.value})} className="bg-slate-950 border-slate-800 text-white h-10 rounded-xl mt-2 text-xs" /><Input placeholder="Conclusion" value={manualData.conclusion} onChange={e => setManualData({...manualData, conclusion: e.target.value})} className="bg-slate-950 border-slate-800 text-white h-10 rounded-xl mt-2 text-xs" /><Textarea placeholder="Explanation" value={manualData.explanation} onChange={e => setManualData({...manualData, explanation: e.target.value})} className="md:col-span-2 bg-slate-950 border-slate-800 text-white h-20 rounded-xl mt-2 focus:border-indigo-550 focus:ring-0 text-xs" /></div></div>}
                    </div>
                    <Button onClick={handleManualSave} disabled={loading} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save className="h-4 w-4" /> Publish Manual Mission</>}
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
    const { schoolId } = useCurrentSchool();

    const schoolRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
    const { data: schoolData } = useDoc<any>(schoolRef);
    const aiCredits = schoolData?.aiCredits ?? 810;
    
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
        <div className="p-6 bg-slate-950 text-slate-100 rounded-3xl min-h-screen relative overflow-hidden border border-slate-900 shadow-2xl">
            {/* Ambient background glows */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

            <SectionHeroBanner
                title="Senior Academy"
                subtitle="Advanced subject modules, curriculum labs, and scientific discoveries."
                eyebrow="SUNNY SIDE ACADEMY • ACADEMICS"
                badge={{
                    label: "LIVE MODULES",
                    variant: "success",
                }}
                icon={Rocket}
                className="mb-6 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800/80 rounded-2xl"
                actions={
                    <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl px-3.5 py-1.5 divide-x divide-slate-800 flex items-center shadow-inner">
                        {/* Stat 1: AI BALANCE */}
                        <div className="flex items-center gap-2 pr-3.5">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                    AI Balance
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="inline-flex items-center justify-center text-amber-400 text-xs">
                                        ⚡
                                    </span>
                                    <span className="text-xs sm:text-sm font-black text-white">
                                        {aiCredits} Credits
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stat 2: TARGET GRADE */}
                        <div className="flex flex-col px-3.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                Target Grade
                            </span>
                            <span className="text-xs sm:text-sm font-black text-slate-200 mt-0.5">
                                Junior Secondary (JHS)
                            </span>
                        </div>

                        {/* Stat 3: STATUS */}
                        <div className="flex flex-col pl-3.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                Status
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs sm:text-sm font-black text-emerald-400">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                }
            />

            {canEdit && (
                <div className="mb-6">
                    <AdminConsole onContentAdded={handleContentUpdate} activeGrade="Junior Secondary (JHS)" />
                </div>
            )}

            <div className="space-y-8">
                <Tabs defaultValue="math" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-12 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80 mb-6">
                        <TabsTrigger 
                            value="math" 
                            className={cn(
                              "h-full rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200",
                              "bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50",
                              "data-[state=active]:bg-indigo-600/20 data-[state=active]:text-indigo-300 data-[state=active]:border-indigo-500/50 data-[state=active]:shadow-sm data-[state=active]:shadow-indigo-950/50"
                            )}
                        >
                            <SigmaIcon className="w-4 h-4"/> Advanced Math Lab
                        </TabsTrigger>
                        <TabsTrigger 
                            value="english" 
                            className={cn(
                              "h-full rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200",
                              "bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50",
                              "data-[state=active]:bg-indigo-600/20 data-[state=active]:text-indigo-300 data-[state=active]:border-indigo-500/50 data-[state=active]:shadow-sm data-[state=active]:shadow-indigo-950/50"
                            )}
                        >
                            <LanguagesIcon className="w-4 h-4"/> English Mastery
                        </TabsTrigger>
                        <TabsTrigger 
                            value="science" 
                            className={cn(
                              "h-full rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200",
                              "bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-800/50",
                              "data-[state=active]:bg-indigo-600/20 data-[state=active]:text-indigo-300 data-[state=active]:border-indigo-500/50 data-[state=active]:shadow-sm data-[state=active]:shadow-indigo-950/50"
                            )}
                        >
                            <AtomIcon className="w-4 h-4"/> Discovery Lab
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

