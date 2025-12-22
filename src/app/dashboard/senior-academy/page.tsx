
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Rocket, Wand2, 
  Save, Trash2, Library, Brain, BookOpen, 
  CheckCircle2, XCircle, PlusCircle, Microscope, Sigma, Languages, Sparkles
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

// --- 1. ENGLISH MASTERY (Comprehension & Grammar) ---
function EnglishMastery({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const [activeStory, setActiveStory] = useState<any>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    
    const storiesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'senior_stories'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: library } = useCollection<any>(storiesQuery);

    const checkAnswers = () => {
        if (!activeStory || !activeStory.quiz) return;
        let correct = 0;
        activeStory.quiz.forEach((q: any, i: number) => {
            if (answers[i]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) correct++;
        });
        if (correct === activeStory.quiz.length) {
            confetti();
            speak("Excellent analysis! You mastered this passage.");
        } else {
            speak(`Keep investigating. You have ${correct} correct answers.`);
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
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
                            <p className="text-2xl leading-relaxed text-slate-700 font-serif whitespace-pre-wrap">
                                {activeStory.content}
                            </p>
                            <div className="bg-slate-50 p-8 rounded-[32px] space-y-8 border-2 border-slate-100">
                                <h3 className="text-2xl font-black text-indigo-900 flex items-center gap-2">
                                    <Brain className="text-indigo-500"/> Critical Analysis
                                </h3>
                                {activeStory.quiz?.map((q: any, i: number) => (
                                    <div key={i} className="space-y-3">
                                        <p className="font-bold text-slate-800 text-lg">{i + 1}. {q.question}</p>
                                        <Input 
                                            placeholder="Analyze and answer..." 
                                            value={answers[i] || ""} 
                                            onChange={e => {
                                                const newAns = [...answers];
                                                newAns[i] = e.target.value;
                                                setAnswers(newAns);
                                            }}
                                            className="h-14 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 bg-white"
                                        />
                                    </div>
                                ))}
                                <Button onClick={checkAnswers} className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-xl font-black rounded-[20px] shadow-xl">
                                    Submit Analysis
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Library className="w-4 h-4" /> Reading Library
                </h3>
                {library?.map((s: any) => (
                    <button 
                        key={s.id} 
                        onClick={() => { setActiveStory(s); setAnswers([]); }}
                        className={`w-full text-left p-6 rounded-[24px] border-b-4 transition-all group ${activeStory?.id === s.id ? 'bg-indigo-50 border-indigo-500 shadow-md scale-105' : 'bg-white border-slate-100 hover:border-indigo-200'}`}
                    >
                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{s.title}</h4>
                        <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-tighter">{s.genre} • {s.wordCount || s.content?.split(' ').length} words</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

// --- 2. ADVANCED MATH LAB ---
function MathLab({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const [problem, setProblem] = useState<any>(null);
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState<any>(null);

    const mathQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'senior_math'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: dbProblems } = useCollection<any>(mathQuery);

    const checkAnswer = () => {
        if (userInput.trim() === problem.answer) {
            setFeedback({ ok: true, msg: "Correct! Your logical derivation is sound." });
            confetti();
            speak("Correct.");
        } else {
            setFeedback({ ok: false, msg: `Not quite. Expected: ${problem.answer}` });
            speak("Review your formula and try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-8">
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar justify-center">
                {dbProblems?.map((p: any) => (
                    <Button 
                        key={p.id} 
                        variant={problem?.id === p.id ? 'default' : 'outline'}
                        onClick={() => { setProblem(p); setUserInput(""); setFeedback(null); }}
                        className="rounded-full border-2 border-emerald-100 whitespace-nowrap"
                    >
                        {p.title}
                    </Button>
                ))}
            </div>

            {problem ? (
                <Card className="rounded-[50px] border-none shadow-2xl overflow-hidden bg-white">
                    <div className="bg-emerald-600 p-10 text-center text-white">
                        <Badge className="bg-emerald-400 mb-4">{problem.category}</Badge>
                        <CardTitle className="text-4xl font-black">{problem.title}</CardTitle>
                    </div>
                    <CardContent className="p-12 space-y-10">
                        <div className="bg-slate-900 p-12 rounded-[40px] shadow-2xl relative">
                            <div className="text-5xl text-emerald-400 overflow-x-auto py-4">
                                <BlockMath math={problem.latexFormula} />
                            </div>
                            <div className="absolute top-4 right-6 text-slate-700 font-mono text-xs italic">LaTeX Engine Active</div>
                        </div>
                        <div className="text-center space-y-8">
                            <p className="text-2xl font-medium text-slate-600">{problem.instruction}</p>
                            <div className="flex flex-col items-center gap-4">
                                <Input 
                                    value={userInput} 
                                    onChange={e => setUserInput(e.target.value)} 
                                    placeholder="Value of x..." 
                                    className="h-20 text-5xl font-mono text-center border-4 border-slate-100 rounded-[24px] max-w-sm focus:border-emerald-500 transition-all"
                                />
                                <Button onClick={checkAnswer} className="h-16 px-16 bg-emerald-600 hover:bg-emerald-700 text-xl font-black rounded-full shadow-lg">
                                    EXECUTE SOLUTION
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

// --- 3. DISCOVERY LAB ---
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
                    <Card 
                        key={l.id} 
                        onClick={() => { setLab(l); setStage('hypothesis'); }}
                        className={`cursor-pointer hover:shadow-xl transition-all border-b-8 ${lab?.id === l.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100'}`}
                    >
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
                        {/* Sidebar Timeline */}
                        <div className="bg-slate-900 text-white p-10 space-y-8">
                            <div className="flex flex-col gap-6">
                                <div className={`flex items-center gap-4 transition-opacity ${stage === 'hypothesis' ? 'opacity-100' : 'opacity-30'}`}>
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">1</div>
                                    <span className="font-bold">Hypothesis</span>
                                </div>
                                <div className={`flex items-center gap-4 transition-opacity ${stage === 'experiment' ? 'opacity-100' : 'opacity-30'}`}>
                                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold">2</div>
                                    <span className="font-bold">Experiment</span>
                                </div>
                                <div className={`flex items-center gap-4 transition-opacity ${stage === 'conclusion' ? 'opacity-100' : 'opacity-30'}`}>
                                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold">3</div>
                                    <span className="font-bold">Conclusion</span>
                                </div>
                            </div>
                            <hr className="opacity-10" />
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-blue-400 tracking-widest uppercase">Field Notes</label>
                                <p className="text-sm opacity-60 leading-relaxed">{lab.background}</p>
                            </div>
                        </div>

                        {/* Interactive Area */}
                        <div className="md:col-span-2 p-10 bg-white">
                            {stage === 'hypothesis' && (
                                <div className="space-y-6 animate-in fade-in">
                                    <h2 className="text-3xl font-black text-slate-800">The Research Question</h2>
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
                                <div className="space-y-6 animate-in zoom-in">
                                    <h2 className="text-3xl font-black text-slate-800">Observation Phase</h2>
                                    <div className="aspect-video bg-slate-100 rounded-[32px] flex items-center justify-center border-4 border-dashed border-slate-200">
                                        <div className="text-center space-y-4">
                                            <div className="text-9xl animate-bounce">{lab.icon}</div>
                                            <Button onClick={() => setStage('conclusion')} className="bg-orange-500 hover:bg-orange-600 px-10 rounded-full font-bold">Collect Data</Button>
                                        </div>
                                    </div>
                                    <p className="text-center text-slate-400 font-bold uppercase tracking-widest">Watching the simulation...</p>
                                </div>
                            )}

                            {stage === 'conclusion' && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                                    <h2 className="text-3xl font-black text-green-800">Scientific Finding</h2>
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
                <div className="text-center py-20 bg-white rounded-[40px] border-4 border-dashed border-slate-100">
                    <Microscope className="w-20 h-20 text-slate-200 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-slate-300 uppercase tracking-widest">Select an Experiment</h2>
                </div>
            )}
        </div>
    );
}

// --- 4. ADMIN CONSOLE (AI CREATOR SUITE) ---
function AdminConsole() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [mode, setMode] = useState<'english' | 'math' | 'science'>('english');
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);

    const handleAIAction = async () => {
        if (!topic) return;
        setLoading(true);
        let res;
        if (mode === 'english') res = await generateSeniorEnglish(topic);
        else if (mode === 'math') res = await generateSeniorMath(topic);
        else res = await generateSeniorLab(topic);

        if (res.success) {
            setPreviewData(res.data);
            toast({ title: "AI Generation Complete", description: "Review the content below before publishing." });
        } else {
             toast({ variant: 'destructive', title: "AI Error", description: res.error });
        }
        setLoading(false);
    };

    const handlePublish = async () => {
        if (!firestore || !previewData) return;
        const colMap: any = { english: 'senior_stories', math: 'senior_math', science: 'senior_labs' };
        await addDoc(collection(firestore, colMap[mode]), {
            ...previewData,
            createdAt: serverTimestamp()
        });
        setPreviewData(null);
        setTopic("");
        toast({ title: "Published!", description: "Module is now live for students." });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">
            <Card className="rounded-[40px] border-4 border-slate-900 bg-white overflow-hidden shadow-2xl">
                <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-black flex items-center gap-2"><Sparkles className="text-yellow-400" /> Professor's AI Lab</h2>
                    <div className="flex gap-2 bg-slate-800 p-1 rounded-xl">
                        {['english', 'math', 'science'].map((m: any) => (
                            <Button key={m} variant={mode === m ? 'secondary' : 'ghost'} onClick={() => {setMode(m); setPreviewData(null);}} className="capitalize font-black text-xs">{m}</Button>
                        ))}
                    </div>
                </div>
                <CardContent className="p-10 space-y-8">
                    <div className="flex gap-3">
                        <Input 
                            placeholder={mode === 'math' ? "Enter Math Concept (e.g. Calculus Derivatives)" : "Enter Topic (e.g. Black Holes)"} 
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            className="h-16 rounded-2xl text-lg border-2 border-slate-100"
                        />
                        <Button onClick={handleAIAction} disabled={loading} className="h-16 px-10 bg-indigo-600 hover:bg-indigo-700 rounded-2xl">
                            {loading ? <Loader2 className="animate-spin"/> : <Wand2/>}
                        </Button>
                    </div>

                    {previewData && (
                        <div className="space-y-6 border-t pt-8 animate-in slide-in-from-bottom-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-black text-slate-800">Preview: {previewData.title}</h3>
                                <div className="flex gap-2">
                                    <Button onClick={() => setPreviewData(null)} variant="ghost" className="text-red-500 font-bold">Discard</Button>
                                    <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700 rounded-xl px-8"><Save className="mr-2 h-4 w-4"/> Publish Now</Button>
                                </div>
                            </div>
                            
                            <div className="p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                {mode === 'math' ? (
                                    <div className="text-3xl text-center"><BlockMath math={previewData.latexFormula} /></div>
                                ) : (
                                    <p className="line-clamp-4 text-slate-500">{previewData.content || previewData.background}</p>
                                )}
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
                            <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Senior Academy</h1>
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] ml-1">Academic Excellence & Logic</p>
                    </div>
                    {canEdit && <Badge className="bg-slate-900 text-yellow-400 px-6 py-2 rounded-full text-sm">Professor Mode Enabled</Badge>}
                </div>

                <Tabs defaultValue="math" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-24 bg-white p-3 rounded-[32px] shadow-2xl border border-slate-100 mb-16">
                        <TabsTrigger value="math" className="rounded-2xl data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-black flex flex-col items-center justify-center gap-1"><Sigma className="w-5 h-5"/> Math Lab</TabsTrigger>
                        <TabsTrigger value="english" className="rounded-2xl data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 font-black flex flex-col items-center justify-center gap-1"><Languages className="w-5 h-5"/> English</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-2xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black flex flex-col items-center justify-center gap-1"><Microscope className="w-5 h-5"/> Discovery</TabsTrigger>
                        <TabsTrigger value="admin" className="rounded-2xl data-[state=active]:bg-slate-900 data-[state=active]:text-white font-black flex flex-col items-center justify-center gap-1"><PlusCircle className="w-5 h-5"/> Creator</TabsTrigger>
                    </TabsList>
                    
                    <div className="min-h-[700px]">
                        <TabsContent value="math" className="mt-0"><MathLab canEdit={canEdit} /></TabsContent>
                        <TabsContent value="english" className="mt-0"><EnglishMastery canEdit={canEdit} /></TabsContent>
                        <TabsContent value="science" className="mt-0"><DiscoveryLab canEdit={canEdit} /></TabsContent>
                        <TabsContent value="admin" className="mt-0"><AdminConsole /></TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

// ... include your existing DiscoveryLab component here ...