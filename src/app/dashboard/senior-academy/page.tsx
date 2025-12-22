
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Rocket, Wand2, 
  Save, Trash2, Library, Brain, BookOpen, 
  CheckCircle2, XCircle, PlusCircle, Microscope, Sigma, Languages, Sparkles, PenTool
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

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
    return formula
        .replace(/\$\$/g, '')      // Remove double dollar signs
        .replace(/\$/g, '')        // Remove single dollar signs
        .replace(/\\\[/g, '')      // Remove \[
        .replace(/\\\]/g, '')      // Remove \]
        .trim();
};

// --- 1. ENGLISH MASTERY (COMPREHENSION) ---
function EnglishMastery({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const [activeStory, setActiveStory] = useState<any>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    
    const storiesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'senior_stories'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: library } = useCollection<any>(storiesQuery);

    const checkAnswers = () => {
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

    return (
        <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in">
            <div className="lg:col-span-2 space-y-6">
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
                    <button key={s.id} onClick={() => { setActiveStory(s); setAnswers([]); }} className={`w-full text-left p-6 rounded-[24px] border-b-4 transition-all ${activeStory?.id === s.id ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-slate-100'}`}>
                        <h4 className="font-bold text-slate-800">{s.title}</h4>
                        <p className="text-[10px] font-black text-slate-400 mt-1 uppercase">{s.genre} • {s.difficulty}</p>
                    </button>
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
            speak("Incorrect. Please re-evaluate.");
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
                    <div className="bg-emerald-600 p-10 text-center text-white relative">
                        <Badge className="bg-emerald-400 mb-4">{problem.category}</Badge>
                        <CardTitle className="text-4xl font-black">{problem.title}</CardTitle>
                    </div>
                    <CardContent className="p-12 space-y-10">
                        <div className="bg-slate-900 p-12 rounded-[40px] shadow-2xl relative border-t-8 border-emerald-500">
                            <div className="text-5xl text-emerald-400 overflow-x-auto py-4 text-center">
                                <BlockMath math={cleanLatex(problem.latexFormula)} />
                            </div>
                            <div className="absolute top-4 right-6 text-slate-700 font-mono text-[10px] uppercase tracking-tighter">Mathematical Logic Engine</div>
                        </div>
                        <div className="text-center space-y-8">
                            <p className="text-2xl font-medium text-slate-600 italic">"{problem.instruction}"</p>
                            <div className="flex flex-col items-center gap-4">
                                <Input 
                                    value={userInput} 
                                    onChange={e => setUserInput(e.target.value)} 
                                    placeholder="Enter Solution..." 
                                    className="h-20 text-4xl font-mono text-center border-4 border-slate-100 rounded-[24px] max-w-sm focus:border-emerald-500 transition-all shadow-inner"
                                />
                                <Button onClick={checkAnswer} className="h-16 px-16 bg-emerald-600 hover:bg-emerald-700 text-xl font-black rounded-full shadow-lg">
                                    VERIFY ANSWER
                                </Button>
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
                                    <h2 className="text-3xl font-black text-slate-800 leading-tight">{lab.question}</h2>
                                    <div className="p-8 bg-blue-50 rounded-3xl border-2 border-blue-100">
                                        <p className="text-slate-600 mb-4 leading-relaxed">{lab.background}</p>
                                        <p className="font-bold text-blue-800 mb-4">{lab.hypothesisPrompt}</p>
                                        <div className="grid grid-cols-2 gap-3">
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
                                            <Progress value={progress} className="w-full h-4" />
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

// --- 4. ADMIN CONSOLE (HYBRID AI & MANUAL CREATOR) ---
function AdminConsole() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [subject, setSubject] = useState<'english' | 'math' | 'science'>('math');
    const [creationMode, setCreationMode] = useState<'ai' | 'manual'>('ai');
    
    // AI Generation States
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("Intermediate");
    const [gradeLevel, setGradeLevel] = useState("Grade 6");
    const [extraInstructions, setExtraInstructions] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [payload, setPayload] = useState<any>(null); // Use a single state for AI and Manual

    const handleAIAction = async () => {
        if (!topic) return;
        setLoading(true);
        const context = { topic, difficulty, gradeLevel, instructions: extraInstructions };
        let res;
        if (subject === 'english') res = await generateSeniorEnglish(context);
        else if (subject === 'math') res = await generateSeniorMath(context);
        else res = await generateSeniorLab(context);

        if (res.success) {
            setPayload(res.data);
            toast({ title: "AI Generation Complete!", description: "Review and publish below." });
        }
        setLoading(false);
    };

    const handlePublish = async () => {
        if (!firestore || !payload?.title) {
            toast({ title: "Error", description: "Title is required to publish.", variant: "destructive" });
            return;
        };
        const colMap: any = { 
            english: 'senior_stories', 
            math: 'senior_math', 
            science: 'senior_labs' 
        };
        
        await addDoc(collection(firestore, colMap[subject]), { 
            ...payload, 
            createdAt: serverTimestamp() 
        });
        
        setPayload(null);
        setTopic("");
        toast({ title: "Success!", description: "Module is now live for students." });
    };

    const handleManualPayloadChange = (field: string, value: any) => {
        setPayload((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
            <Card className="rounded-[40px] border-4 border-slate-900 bg-white overflow-hidden shadow-2xl">
                <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        <PenTool className="text-yellow-400 w-6 h-6" /> Professor's Desk
                    </h2>
                    
                    <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700">
                        <Button variant={creationMode === 'ai' ? 'secondary' : 'ghost'} onClick={() => {setCreationMode('ai'); setPayload(null);}} className="rounded-xl font-bold text-xs h-9">
                            <Sparkles className="w-3 h-3 mr-2 text-blue-400"/> AI Magic
                        </Button>
                        <Button variant={creationMode === 'manual' ? 'secondary' : 'ghost'} onClick={() => {setCreationMode('manual'); setPayload({});}} className="rounded-xl font-bold text-xs h-9">
                            <PenTool className="w-3 h-3 mr-2 text-emerald-400"/> Manual Entry
                        </Button>
                    </div>

                    <div className="flex gap-2 bg-slate-800 p-1 rounded-xl">
                        {['english', 'math', 'science'].map((m: any) => (
                            <Button key={m} variant={subject === m ? 'secondary' : 'ghost'} onClick={() => {setSubject(m); setPayload(null);}} className="capitalize font-black text-[10px] px-4 h-8">{m}</Button>
                        ))}
                    </div>
                </div>

                <CardContent className="p-10 space-y-8">
                    {creationMode === 'ai' && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-4 bg-slate-50 p-6 rounded-[32px] border-2 border-slate-100">
                                <Input placeholder="Topic..." value={topic} onChange={e => setTopic(e.target.value)} className="rounded-xl"/>
                                <select className="h-10 rounded-xl px-3 font-bold text-sm bg-white border outline-none" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                                    <option>Introductory</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                                <select className="h-10 rounded-xl px-3 font-bold text-sm bg-white border outline-none" value={gradeLevel} onChange={e => setGradeLevel(e.target.value)}>
                                    <option>Grade 4</option>
                                    <option>Grade 5</option>
                                    <option>Grade 6</option>
                                </select>
                                <textarea placeholder="Specific AI instructions..." className="md:col-span-3 w-full h-20 rounded-2xl p-4 text-sm outline-none shadow-inner" value={extraInstructions} onChange={e => setExtraInstructions(e.target.value)} />
                            </div>
                            <Button onClick={handleAIAction} disabled={loading || !topic} className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-xl font-black">
                                {loading ? <Loader2 className="animate-spin mr-2"/> : <Wand2 className="mr-2"/>} GENERATE WITH AI
                            </Button>
                        </div>
                    )}

                    {creationMode === 'manual' && (
                        <div className="space-y-6 animate-in fade-in">
                            <Input placeholder="Module Title" value={payload?.title || ''} onChange={e => handleManualPayloadChange('title', e.target.value)} className="h-12 rounded-xl font-bold text-lg border-2"/>
                            
                            {subject === 'math' && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <Input placeholder="Category" value={payload?.category || ''} onChange={e => handleManualPayloadChange('category', e.target.value)} />
                                        <textarea placeholder="LaTeX Formula" value={payload?.latexFormula || ''} onChange={e => handleManualPayloadChange('latexFormula', e.target.value)} className="w-full h-32 p-4 border-2 rounded-xl font-mono" />
                                    </div>
                                    <div className="space-y-4">
                                        <Input placeholder="Instruction" value={payload?.instruction || ''} onChange={e => handleManualPayloadChange('instruction', e.target.value)} />
                                        <Input placeholder="Answer" value={payload?.answer || ''} onChange={e => handleManualPayloadChange('answer', e.target.value)} />
                                        <div className="p-4 bg-emerald-50 rounded-2xl border-2 h-full flex items-center justify-center">
                                            <div className="text-2xl text-center">
                                                {payload?.latexFormula ? <BlockMath math={cleanLatex(payload.latexFormula)} /> : "Preview..."}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {subject === 'english' && (
                                <div className="space-y-4">
                                    <Input placeholder="Genre" value={payload?.genre || ''} onChange={e => handleManualPayloadChange('genre', e.target.value)} />
                                    <textarea placeholder="Passage Content" value={payload?.content || ''} onChange={e => handleManualPayloadChange('content', e.target.value)} className="w-full h-40 p-4 border-2 rounded-xl" />
                                </div>
                            )}

                            {subject === 'science' && (
                                <div className="space-y-4">
                                    <Input placeholder="Emoji Icon" value={payload?.icon || ''} onChange={e => handleManualPayloadChange('icon', e.target.value)} />
                                    <textarea placeholder="Background Context" value={payload?.background || ''} onChange={e => handleManualPayloadChange('background', e.target.value)} className="w-full h-24 p-4 border-2 rounded-xl" />
                                    <textarea placeholder="Conclusion" value={payload?.conclusion || ''} onChange={e => handleManualPayloadChange('conclusion', e.target.value)} className="w-full h-24 p-4 border-2 rounded-xl" />
                                </div>
                            )}

                            <Button onClick={handlePublish} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black">PUBLISH MANUAL MODULE</Button>
                        </div>
                    )}
                    
                    {creationMode === 'ai' && payload?.title && (
                        <div className="space-y-6 border-t pt-8 animate-in slide-in-from-bottom-4">
                            <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-2xl">
                                <h3 className="text-xl font-black text-indigo-900">AI Preview: {payload.title}</h3>
                                <div className="flex gap-2">
                                    <Button onClick={() => setPayload(null)} variant="ghost" className="text-red-500 font-bold">Discard</Button>
                                    <Button onClick={() => handlePublish(payload)} className="bg-green-600 hover:bg-green-700 rounded-xl px-8 shadow-lg font-bold">Publish to Students</Button>
                                </div>
                            </div>
                            <div className="p-8 bg-slate-900 rounded-[32px] border-4 border-slate-800">
                                {subject === 'math' ? <div className="text-4xl text-emerald-400 text-center py-6"><BlockMath math={cleanLatex(payload.latexFormula)} /></div> : <p className="text-slate-300 italic line-clamp-3">{payload.content || payload.background}</p>}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// --- MAIN PAGE ---
export default function SeniorAcademyPage() {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');

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

                <Tabs defaultValue="english" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-24 bg-white p-3 rounded-[32px] shadow-2xl border border-slate-100 mb-16">
                        <TabsTrigger value="english" className="rounded-2xl data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 font-black flex flex-col items-center justify-center gap-1"><Languages className="w-5 h-5"/> English</TabsTrigger>
                        <TabsTrigger value="math" className="rounded-2xl data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-black flex flex-col items-center justify-center gap-1"><Sigma className="w-5 h-5"/> Math Lab</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-2xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black flex flex-col items-center justify-center gap-1"><Microscope className="w-5 h-5"/> Discovery</TabsTrigger>
                        <TabsTrigger value="admin" className="rounded-2xl data-[state=active]:bg-slate-900 data-[state=active]:text-white font-black flex flex-col items-center justify-center gap-1"><PlusCircle className="w-5 h-5"/> Creator</TabsTrigger>
                    </TabsList>
                    
                    <div className="min-h-[700px]">
                        <TabsContent value="english" className="mt-0"><EnglishMastery canEdit={canEdit} /></TabsContent>
                        <TabsContent value="math" className="mt-0"><MathLab canEdit={canEdit} /></TabsContent>
                        <TabsContent value="science" className="mt-0"><DiscoveryLab canEdit={canEdit} /></TabsContent>
                        <TabsContent value="admin" className="mt-0"><AdminConsole /></TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

