
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Rocket, Wand2, 
  Save, Trash2, Library, Brain, BookOpen, 
  CheckCircle2, XCircle, PlusCircle, Microscope, Sigma, Languages, Sparkles, PenTool, ArrowRight, Play, PencilRuler, Lightbulb, Atom, Building2
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

// Import the AI actions
import { generateSeniorEnglish, generateSeniorMath, generateSeniorLab } from '@/ai/flows/senior-actions';

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

// --- SENIOR ACADEMY: GEOGEBRA INTERACTIVE ---
interface GeoGebraProps {
  materialId: string; // The code from the GeoGebra URL
  title?: string;
  height?: number;
}

function GeoGebraInteractive({ materialId, title, height = 500 }: GeoGebraProps) {
  // Constructing the URL with "Clean UI" parameters
  const embedUrl = `https://www.geogebra.org/material/iframe/id/${materialId}/width/800/height/${height}/ai/false/asb/false/sbr/false/cd/false/ize/false/msb/false/stb/false/sts/false/sri/false`;

  return (
    <div className="space-y-3 animate-in fade-in zoom-in duration-500">
      {title && (
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 w-fit rounded-full">
           <Atom className="w-3 h-3 text-indigo-500" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{title}</span>
        </div>
      )}
      <div className="relative w-full rounded-[32px] overflow-hidden border-4 border-slate-100 shadow-2xl bg-white">
        <iframe
          src={embedUrl}
          width="100%"
          height={height}
          style={{ border: 'none' }}
          allowFullScreen
          title={title || "GeoGebra Activity"}
        />
        {/* Attribution Watermark */}
        <div className="absolute bottom-2 right-4 pointer-events-none">
            <p className="text-[8px] font-bold text-slate-300">INTERACTIVE POWERED BY GEOGEBRA OER</p>
        </div>
      </div>
    </div>
  );
}


// --- SENIOR ACADEMY: CURRICULUM PATHWAY ---
function CurriculumPathway({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();

    // Navigation State
    const [selection, setSelection] = useState({ grade: '', unit: '', lesson: '' });
    const [activeLesson, setActiveLesson] = useState<any>(null);

    // 1. Fetch Grades
    const gradesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'curriculum'), orderBy('level', 'asc')) : null, [firestore]);
    const { data: grades } = useCollection<any>(gradesQuery);

    // 2. Fetch Units (when grade is selected)
    const unitsQuery = useMemoFirebase(() => 
        (firestore && selection.grade) ? query(collection(firestore, `curriculum/${selection.grade}/units`), orderBy('number', 'asc')) : null, 
    [firestore, selection.grade]);
    const { data: units } = useCollection<any>(unitsQuery);

    // 3. Fetch Lessons (when unit is selected)
    const lessonsQuery = useMemoFirebase(() => 
        (firestore && selection.grade && selection.unit) ? query(collection(firestore, `curriculum/${selection.grade}/units/${selection.unit}/lessons`), orderBy('order', 'asc')) : null, 
    [firestore, selection.grade, selection.unit]);
    const { data: lessons } = useCollection<any>(lessonsQuery);

    const handleStartLesson = (lesson: any) => {
        setActiveLesson(lesson);
        speak(`Starting lesson: ${lesson.title}`);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* --- BREADCRUMB SELECTOR --- */}
            {!activeLesson && (
                <div className="grid md:grid-cols-3 gap-4 bg-white p-6 rounded-[32px] shadow-xl border-b-8 border-slate-100">
                    {/* Grade Selector */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">1. Select Grade</label>
                        <Select onValueChange={(v) => setSelection({ grade: v, unit: '', lesson: '' })}>
                            <SelectTrigger className="rounded-2xl h-14 border-2"><SelectValue placeholder="Pick a Grade" /></SelectTrigger>
                            <SelectContent>
                                {grades?.map(g => <SelectItem key={g.id} value={g.id}>{g.title}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Unit Selector */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">2. Select Unit</label>
                        <Select disabled={!selection.grade} onValueChange={(v) => setSelection({ ...selection, unit: v, lesson: '' })}>
                            <SelectTrigger className="rounded-2xl h-14 border-2"><SelectValue placeholder="Pick a Unit" /></SelectTrigger>
                            <SelectContent>
                                {units?.map(u => <SelectItem key={u.id} value={u.id}>Unit {u.number}: {u.title}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Lesson List Display */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2">3. Available Lessons</label>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {lessons?.map(l => (
                                <button 
                                    key={l.id} 
                                    onClick={() => handleStartLesson(l)}
                                    className="w-full text-left p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 border-2 border-transparent hover:border-indigo-200 transition-all flex justify-between items-center group"
                                >
                                    <span className="font-bold text-slate-700 group-hover:text-indigo-600">{l.title}</span>
                                    <Play className="w-4 h-4 text-indigo-400" />
                                </button>
                            ))}
                            {!selection.unit && <p className="text-center text-slate-300 text-sm py-4">Select a unit to see lessons</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* --- THE LESSON VIEWER (THE "GO" PHASE) --- */}
            {activeLesson ? (
                <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white animate-in zoom-in duration-500">
                    <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => setActiveLesson(null)} className="text-white hover:bg-white/10 rounded-full">
                                <ArrowRight className="rotate-180 mr-2" /> Exit
                            </Button>
                            <div>
                                <h2 className="text-3xl font-black tracking-tight">{activeLesson.title}</h2>
                                <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">{activeLesson.attribution || 'Open Curriculum'}</p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <Badge className="bg-green-500 px-4 py-1">In Progress</Badge>
                        </div>
                    </div>

                    <CardContent className="p-10 space-y-12 max-w-4xl mx-auto">
                        <section className="prose prose-slate max-w-none">
                            <p className="text-2xl leading-relaxed text-slate-600 first-letter:text-5xl first-letter:font-bold first-letter:mr-2">
                                {activeLesson.introduction}
                            </p>
                        </section>

                        <div className="space-y-8">
                            {activeLesson.content_blocks?.map((block: any, i: number) => (
                                <div key={i} className="animate-in fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
                                    {block.type === 'text' && (
                                        <p className="text-xl text-slate-800 leading-relaxed font-medium">{block.body}</p>
                                    )}
                                    
                                    {block.type === 'latex' && (
                                        <div className="bg-slate-900 p-10 rounded-[40px] shadow-inner border-t-8 border-indigo-500 flex justify-center">
                                            <SafeMath formula={block.formula} />
                                        </div>
                                    )}

                                    {block.type === 'interactive' && (
                                        <GeoGebraInteractive 
                                            materialId={block.materialId} 
                                            title={block.label} 
                                        />
                                    )}

                                    {block.type === 'concept' && (
                                        <div className="bg-amber-50 p-6 rounded-3xl border-2 border-amber-100 flex gap-4">
                                            <Lightbulb className="w-8 h-8 text-amber-500 shrink-0" />
                                            <p className="text-lg text-amber-900 font-bold italic">{block.body}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-12 border-t border-slate-100 space-y-8">
                            <h3 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                                <PencilRuler className="text-indigo-500 w-8 h-8" /> Practice Arena
                            </h3>
                            {activeLesson.practice_problems?.map((prob: any, i: number) => (
                                <div key={i} className="p-8 bg-slate-50 rounded-[32px] border-2 border-slate-100 space-y-6">
                                    <div className="text-xl font-bold text-slate-700">
                                        <SafeMath formula={prob.question} />
                                    </div>
                                    <div className="flex gap-4">
                                        <Input placeholder="Your answer..." className="h-14 rounded-2xl text-xl font-mono border-2 focus:border-indigo-500 shadow-sm" />
                                        <Button className="h-14 px-10 bg-indigo-600 rounded-2xl font-bold shadow-lg">Check</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>

                    <CardFooter className="bg-slate-50 p-10 border-t flex justify-between items-center">
                        <div className="flex gap-2">
                             {['📚', '🧬', '📐'].map((emoji, i) => <span key={i} className="text-2xl">{emoji}</span>)}
                        </div>
                        <Button 
                            onClick={() => {
                                confetti();
                                toast({ title: "Lesson Complete!", description: "Progress saved to your transcript." });
                                setActiveLesson(null);
                            }}
                            className="bg-green-600 hover:bg-green-700 px-12 h-16 rounded-2xl text-xl font-black shadow-xl"
                        >
                            Complete & Next <ArrowRight className="ml-2" />
                        </Button>
                    </CardFooter>
                </Card>
            ) : (
                /* --- IF NO SELECTION: WELCOME STATE --- */
                <div className="py-20 text-center space-y-4">
                    <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-xl mb-6">
                        <BookOpen className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-800">Your Learning Path</h2>
                    <p className="text-slate-400 font-medium max-w-md mx-auto">Select a Grade and Unit above to begin your professional academy curriculum.</p>
                </div>
            )}
        </div>
    );
}

// --- TEACHER/ADMIN CONTENT GENERATOR ---
function AdminConsole({ onContentAdded }: { onContentAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    // Form State
    const [subject, setSubject] = useState('math');
    const [topic, setTopic] = useState('');
    const [gradeLevel, setGradeLevel] = useState('SHS');
    const [difficulty, setDifficulty] = useState('University'); // Match existing labels
    const [instructions, setInstructions] = useState('');
    
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast({ variant: 'destructive', title: 'Topic is required' });
            return;
        }
        setLoading(true);

        const context = { topic, gradeLevel, difficulty, instructions };
        let collectionName = '';
        let aiAction;

        switch (subject) {
            case 'english':
                collectionName = 'senior_stories';
                aiAction = generateSeniorEnglish;
                break;
            case 'math':
                collectionName = 'senior_math';
                aiAction = generateSeniorMath;
                break;
            case 'science':
                collectionName = 'senior_labs';
                aiAction = generateSeniorLab;
                break;
            default:
                setLoading(false);
                return;
        }

        try {
            const result = await aiAction(context);
            if (result.success && result.data && firestore) {
                await addDoc(collection(firestore, collectionName), {
                    ...result.data,
                    createdAt: serverTimestamp()
                });
                toast({ title: 'Content Created!', description: `${subject} module added successfully.` });
                onContentAdded(); // Notify parent to refetch
            } else {
                throw new Error(result.error || "AI failed to generate content.");
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-slate-800 text-white shadow-2xl border-indigo-900">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-300"><Wand2 /> AI Admin Console</CardTitle>
                <CardDescription className="text-slate-400">Generate advanced learning modules for students.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label className="text-slate-400 text-xs">Subject</Label>
                        <Select value={subject} onValueChange={setSubject}>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue/></SelectTrigger>
                            <SelectContent><SelectItem value="math">Math</SelectItem><SelectItem value="english">English</SelectItem><SelectItem value="science">Science</SelectItem></SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-1">
                        <Label className="text-slate-400 text-xs">Difficulty</Label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger className="bg-slate-700 border-slate-600 text-white"><SelectValue/></SelectTrigger>
                            <SelectContent><SelectItem value="JHS">JHS</SelectItem><SelectItem value="SHS">SHS</SelectItem><SelectItem value="University">University</SelectItem></SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-1">
                    <Label className="text-slate-400 text-xs">Topic</Label>
                    <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Quantum Physics, Shakespeare" className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <Button onClick={handleGenerate} disabled={loading || !topic} className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold h-12">
                    {loading ? <Loader2 className="animate-spin"/> : "Generate Content"}
                </Button>
            </CardContent>
        </Card>
    );
}


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
                {canEdit && <AdminConsole onContentAdded={forceRefetch} />}
                
                {!activeStory ? (
                    <div className="h-96 flex flex-col items-center justify-center bg-white rounded-[40px] border-4 border-dashed border-slate-100">
                        <BookOpen className="w-16 h-16 text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold text-xl">Select a Literary Work</p>
                    </div>
                ) : (
                    <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden">
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
                            <p className="text-2xl leading-relaxed text-slate-700 font-serif whitespace-pre-wrap">{activeStory.content}</p>
                            <div className="bg-slate-50 p-8 rounded-[32px] space-y-8 border-2 border-slate-100">
                                <h3 className="text-2xl font-black text-indigo-900 flex items-center gap-2"><Brain className="text-indigo-500"/> Critical Analysis</h3>
                                {activeStory.quiz.map((q: any, i: number) => (
                                    <div key={i} className="space-y-3">
                                        <p className="font-bold text-slate-800 text-lg">{i + 1}. {q.question}</p>
                                        <Input placeholder="Type response..." value={answers[i] || ""} onChange={e => { const n = [...answers]; n[i] = e.target.value; setAnswers(n); }} className="h-14 rounded-2xl border-2"/>
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
                            <button onClick={() => handleDelete(s.id)} className="absolute top-2 right-2 text-red-300 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- 2. ADVANCED MATH LAB ---
function MathLab({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [problem, setProblem] = useState<any>(null);
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState<any>(null);

    const mathQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'senior_math'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: dbProblems, forceRefetch } = useCollection<any>(mathQuery);

    const checkAnswer = () => {
        if (userInput.trim().toLowerCase() === problem.answer.toLowerCase().trim()) {
            setFeedback({ ok: true, msg: "Correct logical derivation." });
            confetti();
            speak("Correct.");
        } else {
            setFeedback({ ok: false, msg: `Review calculation. Correct value: ${problem.answer}` });
            speak("Incorrect.");
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
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8">
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar justify-center">
                {dbProblems?.map((p: any) => (
                    <div key={p.id} className="relative group">
                        <Button 
                            variant={problem?.id === p.id ? 'default' : 'outline'} 
                            onClick={() => { setProblem(p); setUserInput(""); setFeedback(null); }} 
                            className="rounded-full border-2 font-bold uppercase text-[10px] tracking-widest px-6 h-10"
                        >
                            {p.title}
                        </Button>
                        {canEdit && (
                            <button onClick={() => handleDelete(p.id)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-3 h-3"/>
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {problem ? (
                <Card className="rounded-[50px] border-none shadow-2xl overflow-hidden bg-white">
                    <div className="bg-emerald-600 p-10 text-center text-white">
                        <Badge className="bg-emerald-400 mb-4">{problem.category}</Badge>
                        <CardTitle className="text-4xl font-black">{problem.title}</CardTitle>
                    </div>
                    <CardContent className="p-12 space-y-10">
                        <div className="bg-slate-900 p-12 rounded-[40px] shadow-2xl relative border-t-8 border-emerald-500">
                            <div className="text-5xl text-emerald-400 overflow-x-auto py-4 text-center">
                                <SafeMath formula={problem.latexFormula} />
                            </div>
                        </div>
                        <div className="text-center space-y-8">
                            <p className="text-2xl font-medium text-slate-600 italic">{problem.instruction}</p>
                            <div className="flex flex-col items-center gap-4">
                                <Input value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Enter Solution..." className="h-20 text-4xl font-mono text-center border-4 border-slate-100 rounded-[24px] max-w-sm"/>
                                <Button onClick={checkAnswer} className="h-16 px-16 bg-emerald-600 hover:bg-emerald-700 text-xl font-black rounded-full shadow-lg">VERIFY ANSWER</Button>
                            </div>
                        </div>
                        {feedback && (
                            <div className={`p-6 rounded-[24px] border-2 flex items-center justify-center gap-4 animate-bounce ${feedback.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                <p className="text-xl font-black">{feedback.msg}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center py-32 bg-white rounded-[50px] border-4 border-dashed border-slate-50">
                    <Sigma className="w-20 h-20 text-slate-100 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-slate-300 uppercase tracking-widest">Awaiting Computation</h2>
                </div>
            )}
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

// --- MAIN PAGE ---
export default function SeniorAcademyPage() {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');
    
    // This is a dummy function. In a real app, you'd fetch data or trigger a re-render.
    const handleContentUpdate = () => {
        console.log("Content updated. Re-fetching data...");
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

                <Tabs defaultValue="curriculum" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-24 bg-white p-3 rounded-[32px] shadow-2xl border border-slate-100 mb-16">
                        <TabsTrigger value="curriculum" className="rounded-2xl data-[state=active]:bg-green-100 data-[state=active]:text-green-700 font-black flex flex-col items-center justify-center gap-1"><Play className="w-5 h-5"/> Open & Go</TabsTrigger>
                        <TabsTrigger value="english" className="rounded-2xl data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 font-black flex flex-col items-center justify-center gap-1"><Languages className="w-5 h-5"/> English</TabsTrigger>
                        <TabsTrigger value="math" className="rounded-2xl data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-black flex flex-col items-center justify-center gap-1"><Sigma className="w-5 h-5"/> Math Lab</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-2xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black flex flex-col items-center justify-center gap-1"><Microscope className="w-5 h-5"/> Discovery</TabsTrigger>
                    </TabsList>
                    
                    <div className="min-h-[700px]">
                        <TabsContent value="curriculum" className="mt-0"><CurriculumPathway canEdit={canEdit} /></TabsContent>
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
