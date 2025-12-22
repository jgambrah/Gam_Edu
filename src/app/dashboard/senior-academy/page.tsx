
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rocket, Wand2, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, 
  Trophy, CheckCircle2, XCircle, PlusCircle, Microscope, Sigma, Languages
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// --- HELPER: TEXT TO SPEECH (More natural for seniors) ---
const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0; 
    u.pitch = 1.0;
    window.speechSynthesis.speak(u);
};

// --- 1. ENGLISH MASTERY (Comprehension & Grammar) ---
function EnglishMastery({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();
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
            speak("Excellent analysis! You mastered this passage.");
        } else {
            speak(`You got ${correct} correct. Review the text and try again.`);
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                {!activeStory ? (
                    <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed">
                        <BookOpen className="w-12 h-12 text-slate-300 mb-2" />
                        <p className="text-slate-500 font-medium">Select a passage to begin analysis</p>
                    </div>
                ) : (
                    <Card className="rounded-[32px] border-none shadow-xl overflow-hidden animate-in fade-in">
                        <CardHeader className="bg-indigo-600 text-white p-8">
                            <CardTitle className="text-3xl font-black">{activeStory.title}</CardTitle>
                            <div className="flex gap-2 mt-2">
                                <Badge className="bg-white/20">{activeStory.genre}</Badge>
                                <Badge className="bg-white/20">Level: {activeStory.difficulty}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <p className="text-xl leading-relaxed text-slate-700 first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
                                {activeStory.content}
                            </p>
                            <hr />
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold flex items-center gap-2 text-indigo-600">
                                    <Brain className="w-6 h-6"/> Comprehension Check
                                </h3>
                                {activeStory.quiz.map((q: any, i: number) => (
                                    <div key={i} className="space-y-2">
                                        <p className="font-bold text-slate-800">{i + 1}. {q.question}</p>
                                        <Input 
                                            placeholder="Analyze and answer..." 
                                            value={answers[i] || ""} 
                                            onChange={e => {
                                                const newAns = [...answers];
                                                newAns[i] = e.target.value;
                                                setAnswers(newAns);
                                            }}
                                            className="bg-slate-50 border-slate-200 h-12 rounded-xl"
                                        />
                                    </div>
                                ))}
                                <Button onClick={checkAnswers} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-lg font-bold rounded-2xl shadow-lg">
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
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all group ${activeStory?.id === s.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-slate-100 hover:bg-slate-50 bg-white'}`}
                    >
                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{s.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 uppercase font-black">{s.genre} • {s.wordCount} words</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

// --- 2. ADVANCED MATH LAB (LaTeX & Logic) ---
function MathLab({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();
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
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
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
                <Card className="rounded-[40px] border-4 border-emerald-50 shadow-2xl overflow-hidden animate-in zoom-in">
                    <CardHeader className="bg-emerald-600 text-white p-8 text-center">
                        <CardTitle className="text-3xl font-black">{problem.title}</CardTitle>
                        <p className="opacity-80 font-medium">{problem.category}</p>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                        <div className="bg-slate-50 p-10 rounded-3xl border-2 border-slate-100 text-center shadow-inner">
                            <div className="text-4xl text-slate-800 mb-4">
                                <BlockMath math={problem.latexFormula} />
                            </div>
                            <p className="text-xl text-slate-500 font-medium">{problem.instruction}</p>
                        </div>

                        <div className="flex gap-4">
                            <Input 
                                value={userInput} 
                                onChange={e => setUserInput(e.target.value)} 
                                placeholder="Enter value for x..." 
                                className="h-16 text-3xl font-mono text-center border-2 border-emerald-100 rounded-2xl"
                            />
                            <Button onClick={checkAnswer} className="h-16 px-10 bg-emerald-600 hover:bg-emerald-700 text-xl font-black rounded-2xl shadow-lg">
                                Solve
                            </Button>
                        </div>

                        {feedback && (
                            <div className={`p-6 rounded-2xl border-2 flex items-center gap-4 animate-in slide-in-from-bottom-2 ${feedback.ok ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                {feedback.ok ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                                <p className="text-lg font-bold">{feedback.msg}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
                    <Sigma className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-400">Select a Problem to Solve</h2>
                </div>
            )}
        </div>
    );
}

// --- 3. DISCOVERY LAB (Scientific Method) ---
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
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
                    <Microscope className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-400">Select an Experiment</h2>
                </div>
            )}
        </div>
    );
}

// --- 4. ADMIN CONSOLE (CREATOR SUITE) ---
function AdminConsole() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [mode, setMode] = useState<'english' | 'math' | 'science'>('english');
    const [payload, setPayload] = useState<any>({});

    const handleSave = async () => {
        if (!firestore) return;
        const collectionMap: any = { 
            english: 'senior_stories', 
            math: 'senior_math', 
            science: 'senior_labs' 
        };
        await addDoc(collection(firestore, collectionMap[mode]), {
            ...payload,
            createdAt: serverTimestamp()
        });
        toast({ title: "Module Published!", description: "Available now in the Academy Library." });
        setPayload({});
    };

    return (
        <Card className="rounded-[40px] border-4 border-slate-900 bg-white overflow-hidden shadow-2xl">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                <h2 className="text-2xl font-black flex items-center gap-2"><Wand2 className="text-yellow-400" /> Professor's Curriculum Tool</h2>
                <div className="flex gap-2">
                    {['english', 'math', 'science'].map((m: any) => (
                        <Button key={m} variant={mode === m ? 'secondary' : 'ghost'} onClick={() => {setMode(m); setPayload({});}} className="capitalize font-bold">{m}</Button>
                    ))}
                </div>
            </div>
            <CardContent className="p-10 space-y-6">
                {mode === 'math' && (
                    <div className="grid gap-4">
                        <Input placeholder="Problem Title (e.g. Quadratic Roots)" onChange={e => setPayload({...payload, title: e.target.value})} />
                        <Input placeholder="Category (e.g. Algebra)" onChange={e => setPayload({...payload, category: e.target.value})} />
                        <Input placeholder="LaTeX Formula (e.g. f(x) = x^2 + 4x + 4)" onChange={e => setPayload({...payload, latexFormula: e.target.value})} />
                        <Input placeholder="Instruction (e.g. Solve for x when f(x) = 0)" onChange={e => setPayload({...payload, instruction: e.target.value})} />
                        <Input placeholder="Correct Answer (String)" onChange={e => setPayload({...payload, answer: e.target.value})} />
                        <div className="p-4 bg-slate-50 rounded-xl border-2 border-dashed">
                            <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Formula Preview</p>
                            <div className="text-2xl"><BlockMath math={payload.latexFormula || "0"} /></div>
                        </div>
                    </div>
                )}

                {mode === 'english' && (
                    <div className="grid gap-4">
                        <Input placeholder="Passage Title" onChange={e => setPayload({...payload, title: e.target.value})} />
                        <Input placeholder="Genre (e.g. Narrative, Historical)" onChange={e => setPayload({...payload, genre: e.target.value})} />
                        <textarea 
                            placeholder="Reading Passage Content..." 
                            className="w-full h-40 p-4 border rounded-2xl"
                            onChange={e => setPayload({...payload, content: e.target.value})}
                        />
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-slate-400 uppercase">Questions (JSON Format Required for multiple)</p>
                            <textarea 
                                placeholder='[{"question": "Why did the hero...", "answer": "Because..."}]' 
                                className="w-full h-32 p-4 border rounded-2xl font-mono text-sm"
                                onChange={e => {
                                    try { setPayload({...payload, quiz: JSON.parse(e.target.value)}); } 
                                    catch(err) { console.log("JSON error"); }
                                }}
                            />
                        </div>
                    </div>
                )}

                {mode === 'science' && (
                    <div className="grid gap-4">
                        <Input placeholder="Lab Title (e.g. Photosynthesis)" onChange={e => setPayload({...payload, title: e.target.value})} />
                        <Input placeholder="Emoji Icon (e.g. 🌿)" onChange={e => setPayload({...payload, icon: e.target.value})} />
                        <textarea placeholder="Background Context" className="w-full h-24 p-4 border rounded-2xl" onChange={e => setPayload({...payload, background: e.target.value})} />
                        <Input placeholder="Research Question" onChange={e => setPayload({...payload, question: e.target.value})} />
                        <Input placeholder="Hypothesis Prompt" onChange={e => setPayload({...payload, hypothesisPrompt: e.target.value})} />
                        <Input placeholder="Options (comma separated)" onChange={e => setPayload({...payload, hypothesisOptions: e.target.value.split(',')})} />
                        <textarea placeholder="Scientific Conclusion" className="w-full h-24 p-4 border rounded-2xl" onChange={e => setPayload({...payload, conclusion: e.target.value})} />
                        <textarea placeholder="Scientific Explanation" className="w-full h-24 p-4 border rounded-2xl" onChange={e => setPayload({...payload, explanation: e.target.value})} />
                    </div>
                )}

                <Button onClick={handleSave} className="w-full h-16 bg-slate-900 hover:bg-black text-xl font-black rounded-2xl shadow-xl">
                    Publish to Academy
                </Button>
            </CardContent>
        </Card>
    );
}

// --- MAIN PAGE ---
export default function SeniorAcademyPage() {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 p-4 rounded-3xl shadow-2xl rotate-3">
                            <Rocket className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Senior Academy</h1>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Innovation • Science • Mastery</p>
                        </div>
                    </div>
                    {canEdit && <Badge className="bg-slate-900 text-yellow-400 px-6 py-2 rounded-full text-sm">Professor Mode Enabled</Badge>}
                </div>

                <Tabs defaultValue="math" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-20 bg-white p-2 rounded-3xl shadow-xl border border-slate-100 mb-12">
                        <TabsTrigger value="math" className="rounded-2xl data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-black flex items-center gap-2"><Sigma className="w-5 h-5"/> Math Lab</TabsTrigger>
                        <TabsTrigger value="english" className="rounded-2xl data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 font-black flex items-center gap-2"><Languages className="w-5 h-5"/> English</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-2xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black flex items-center gap-2"><Microscope className="w-5 h-5"/> Science</TabsTrigger>
                        <TabsTrigger value="admin" className="rounded-2xl data-[state=active]:bg-slate-900 data-[state=active]:text-white font-black flex items-center gap-2"><PlusCircle className="w-5 h-5"/> Admin</TabsTrigger>
                    </TabsList>
                    
                    <div className="min-h-[600px] animate-in slide-in-from-bottom-6 duration-700">
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
