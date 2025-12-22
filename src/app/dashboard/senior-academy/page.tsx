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

// Import the new AI actions
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
        .replace(/\$\$/g, '')      
        .replace(/\$/g, '')        
        .replace(/\\\[/g, '')      
        .replace(/\\\]/g, '')      
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
                                <Button onClick={() => speak(activeStory.content)} variant="secondary" size="icon" className="rounded-full h-12 w-12"><Volume2/></Button>
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
                <div className="space-y-3">
                    {library?.map((s: any) => (
                        <button key={s.id} onClick={() => { setActiveStory(s); setAnswers([]); }} className={`w-full text-left p-6 rounded-[24px] border-b-4 transition-all ${activeStory?.id === s.id ? 'bg-indigo-50 border-indigo-500 shadow-md' : 'bg-white border-slate-100'}`}>
                            <h4 className="font-bold text-slate-800">{s.title}</h4>
                            <p className="text-[10px] font-black text-slate-400 mt-1 uppercase">{s.genre} • {s.difficulty}</p>
                        </button>
                    ))}
                </div>
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
                                <BlockMath math={cleanLatex(problem.latexFormula)} />
                            </div>
                        </div>
                        <div className="text-center space-y-8">
                            <p className="text-2xl font-medium text-slate-600 italic">"{problem.instruction}"</p>
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

    const labQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'senior_labs'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: dbLabs } = useCollection<any>(labQuery);

    return (
        <div className="space-y-8">
            <div className="grid md:grid-cols-4 gap-4">
                {dbLabs?.map((l: any) => (
                    <Card key={l.id} onClick={() => { setLab(l); setStage('hypothesis'); }} className={`cursor-pointer hover:shadow-xl transition-all border-b-8 ${lab?.id === l.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100'}`}>
                        <CardContent className="p-6 text-center space-y-3">
                            <div className="text-5xl">{l.icon}</div>
                            <h4 className="font-bold text-slate-800">{l.title}</h4>
                            <Badge variant="secondary" className="uppercase text-[10px]">{l.category}</Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {lab ? (
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
                            <hr className="opacity-10"/>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-blue-400 tracking-widest uppercase">Field Notes</label>
                                <p className="text-sm opacity-60 leading-relaxed">{lab.background}</p>
                            </div>
                        </div>
                        <div className="md:col-span-2 p-10 bg-white">
                            {stage === 'hypothesis' && (
                                <div className="space-y-6">
                                    <h2 className="text-3xl font-black text-slate-800">Research Question</h2>
                                    <p className="text-xl text-slate-600 italic">"{lab.question}"</p>
                                    <div className="p-8 bg-blue-50 rounded-3xl border-2 border-blue-100">
                                        <h4 className="font-bold text-blue-800 mb-2">Form your Hypothesis</h4>
                                        <p className="text-slate-600 mb-4">{lab.hypothesisPrompt}</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {lab.hypothesisOptions.map((opt: string) => (
                                                <Button key={opt} variant="outline" className="bg-white border-2 hover:bg-blue-50" onClick={() => { speak(`Selected hypothesis: ${opt}`); setStage('experiment'); }}>{opt}</Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {stage === 'experiment' && (
                                <div className="space-y-6 text-center">
                                    <h2 className="text-3xl font-black text-slate-800">Observation Phase</h2>
                                    <div className="aspect-video bg-slate-100 rounded-[32px] flex items-center justify-center border-4 border-dashed border-slate-200">
                                        <div className="text-center space-y-4">
                                            <div className="text-9xl animate-bounce my-10">{lab.icon}</div>
                                            <Button onClick={() => setStage('conclusion')} className="bg-orange-500 hover:bg-orange-600 px-10 rounded-full font-bold">Collect Data</Button>
                                        </div>
                                    </div>
                                    <p className="text-center text-slate-400 font-bold uppercase tracking-widest">Watching the simulation...</p>
                                </div>
                            )}

                            {stage === 'conclusion' && (
                                <div className="space-y-6">
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
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-200">
                    <Microscope className="w-20 h-20 text-slate-200 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-400">Select an Experiment</h2>
                </div>
            )}
        </div>
    );
}

// --- 4. ADMIN CONSOLE (AI & MANUAL HYBRID) ---
function AdminConsole() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [subject, setSubject] = useState<'english' | 'math' | 'science'>('math');
    const [creationMode, setCreationMode] = useState<'ai' | 'manual'>('ai');
    
    // AI Controls
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("Intermediate");
    const [gradeLevel, setGradeLevel] = useState("Grade 6");
    const [extraInstructions, setExtraInstructions] = useState("");
    const [loading, setLoading] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);

    // Manual Math state
    const [manualMath, setManualMath] = useState({ title: '', category: 'Algebra', latexFormula: '', instruction: '', answer: '' });

    const handleAIAction = async () => {
        if (!topic) return;
        setLoading(true);
        const context = { topic, difficulty, gradeLevel, instructions: extraInstructions };
        let res;
        if (subject === 'english') res = await generateSeniorEnglish(context);
        else if (subject === 'math') res = await generateSeniorMath(context);
        else res = await generateSeniorLab(context);

        if (res.success) {
            setPreviewData(res.data);
            toast({ title: "AI Generation Complete" });
        }
        setLoading(false);
    };

    const handlePublish = async (dataToPublish: any) => {
        if (!firestore || !dataToPublish) return;
        const colMap: any = { english: 'senior_stories', math: 'senior_math', science: 'senior_labs' };
        await addDoc(collection(firestore, colMap[subject]), { ...dataToPublish, createdAt: serverTimestamp() });
        setPreviewData(null);
        setTopic("");
        setExtraInstructions("");
        setManualMath({ title: '', category: 'Algebra', latexFormula: '', instruction: 'Simplify.', answer: '' });
        toast({ title: "Published Successfully!" });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">
            <Card className="rounded-[40px] border-4 border-slate-900 bg-white shadow-2xl">
                <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                    <h2 className="text-2xl font-black flex items-center gap-2"><Sparkles className="text-yellow-400" /> Professor's Creator Suite</h2>
                    <div className="flex bg-slate-800 p-1 rounded-2xl">
                        <Button variant={creationMode === 'ai' ? 'secondary' : 'ghost'} onClick={() => { setCreationMode('ai'); setPreviewData(null); }} className="rounded-xl font-bold text-xs"><Wand2 className="w-3 h-3 mr-2"/>AI Magic</Button>
                        <Button variant={creationMode === 'manual' ? 'secondary' : 'ghost'} onClick={() => { setCreationMode('manual'); setPreviewData(null); }} className="rounded-xl font-bold text-xs"><PenTool className="w-3 h-3 mr-2"/>Manual Entry</Button>
                    </div>
                </div>
                <CardContent className="p-10 space-y-8">
                    {creationMode === 'ai' && (
                         <div className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-4 bg-slate-50 p-6 rounded-3xl border-2 border-slate-100">
                                <Input placeholder="Topic..." value={topic} onChange={e => setTopic(e.target.value)} className="rounded-xl"/>
                                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="rounded-xl px-3 font-medium text-sm outline-none">
                                    <option>Introductory</option><option>Intermediate</option><option>Advanced</option>
                                </select>
                                <select value={gradeLevel} onChange={e => setGradeLevel(e.target.value)} className="rounded-xl px-3 font-medium text-sm outline-none">
                                    <option>Grade 4</option><option>Grade 5</option><option>Grade 6</option><option>Junior High</option>
                                </select>
                                <textarea placeholder="Specific instructions for AI..." value={extraInstructions} onChange={e => setExtraInstructions(e.target.value)} className="md:col-span-3 w-full h-20 rounded-2xl p-4 text-sm"/>
                            </div>
                            <div className="flex gap-2 justify-center">
                                {['english', 'math', 'science'].map((m: any) => <Button key={m} variant={subject === m ? 'default' : 'outline'} onClick={() => setSubject(m)} className="capitalize rounded-full font-black">{m}</Button>)}
                            </div>
                            <Button onClick={handleAIAction} disabled={loading || !topic} className="w-full h-16 bg-indigo-600 rounded-2xl text-xl font-black">
                                {loading ? <Loader2 className="animate-spin mr-2"/> : <Wand2 className="mr-2"/>} GENERATE MODULE
                            </Button>
                            {previewData && (
                                <div className="space-y-6 border-t pt-8">
                                    <Button onClick={() => handlePublish(previewData)} className="w-full bg-green-600">Publish Preview</Button>
                                    <div className="p-8 bg-slate-900 rounded-3xl"><BlockMath math={cleanLatex(previewData.latexFormula)} /></div>
                                </div>
                            )}
                        </div>
                    )}
                    {creationMode === 'manual' && subject === 'math' && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input placeholder="Title" value={manualMath.title} onChange={e => setManualMath({...manualMath, title: e.target.value})} />
                                <Input placeholder="Instruction" value={manualMath.instruction} onChange={e => setManualMath({...manualMath, instruction: e.target.value})} />
                                <textarea placeholder="LaTeX" value={manualMath.latexFormula} onChange={e => setManualMath({...manualMath, latexFormula: e.target.value})} className="md:col-span-2 h-24 p-2"/>
                                <Input placeholder="Answer" value={manualMath.answer} onChange={e => setManualMath({...manualMath, answer: e.target.value})} />
                            </div>
                             <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-100 min-h-[100px] flex items-center justify-center">
                                 <div className="text-2xl text-center">
                                     {manualMath.latexFormula ? <BlockMath math={cleanLatex(manualMath.latexFormula)} /> : "Preview"}
                                 </div>
                             </div>
                            <Button onClick={() => handlePublish(manualMath)} className="w-full">PUBLISH MANUAL</Button>
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
                        <TabsTrigger value="english" className="rounded-2xl data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 font-black flex flex-col gap-1"><Languages/>English</TabsTrigger>
                        <TabsTrigger value="math" className="rounded-2xl data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-black flex flex-col gap-1"><Sigma/>Math</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-2xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black flex flex-col gap-1"><Microscope/>Discovery</TabsTrigger>
                        <TabsTrigger value="admin" className="rounded-2xl data-[state=active]:bg-slate-900 data-[state=active]:text-white font-black flex flex-col gap-1"><PlusCircle/>Creator</TabsTrigger>
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