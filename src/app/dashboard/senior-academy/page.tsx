'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, where, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { 
  Sigma, Languages, Microscope, BookOpen, 
  Rocket, Volume2, Wand2, PenTool, Loader2
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';

// Import AI actions
import { generateSeniorEnglish, generateSeniorMath, generateSeniorLab } from '@/ai/flows/senior-actions';

const CATEGORIES = [
    'Early Childhood', 'Lower Primary', 'Upper Primary', 
    'Junior Secondary (JHS)', 'Senior Secondary (SHS)'
];

const isJuniorLevel = (grade: string) => 
    grade === 'Early Childhood' || grade === 'Lower Primary';

const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; 
    window.speechSynthesis.speak(u);
};

const cleanLatex = (formula: string = "") => {
    if (!formula) return "";
    return formula.replace(/\$\$/g, '').replace(/\$/g, '').replace(/\\\[/g, '').replace(/\\\]/g, '').trim();
};

function SafeMath({ formula }: { formula: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="h-10 w-full animate-pulse bg-slate-100 rounded" />;
  return <div className="math-container py-2 overflow-x-auto"><BlockMath math={cleanLatex(formula)} /></div>;
}

function CounterDisplay({ count }: { count: number }) {
    const icons = ['🍎', '⭐', '🎈', '🐱', '🚗', '🍦'];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    const displayCount = Math.min(count, 20);
    return (
        <div className="flex flex-wrap justify-center gap-3 p-6 bg-white/50 rounded-3xl mt-4">
            {Array.from({ length: displayCount }).map((_, i) => (
                <span key={i} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>{icon}</span>
            ))}
        </div>
    );
}

// --- SUB-COMPONENT: MATH LAB ---
function MathLab({ selectedGrade }: { selectedGrade: string }) {
    const firestore = useFirestore();
    const [problem, setProblem] = useState<any>(null);
    const [userInput, setUserInput] = useState("");
    const isJunior = isJuniorLevel(selectedGrade);

    const { data: dbProblems } = useCollection<any>(useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'senior_math'), orderBy('createdAt', 'desc')) : null, [firestore]));

    const folders = useMemo(() => {
        if (!dbProblems) return {};
        return dbProblems.filter(p => p.gradeLevel === selectedGrade).reduce((acc, p) => {
            const cat = p.category || 'Mathematics';
            const sub = p.subTopic || 'Standard';
            if (!acc[cat]) acc[cat] = {};
            if (!acc[cat][sub]) acc[cat][sub] = [];
            acc[cat][sub].push(p);
            return acc;
        }, {} as any);
    }, [dbProblems, selectedGrade]);

    return (
        <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
                <ScrollArea className="h-[60vh] bg-white rounded-3xl border p-2 shadow-inner">
                    {Object.entries(folders).map(([cat, subs]: any) => (
                        <Accordion key={cat} type="single" collapsible>
                            <AccordionItem value={cat} className="border-none">
                                <AccordionTrigger className="p-3 bg-slate-50 rounded-xl mb-1 text-xs font-black uppercase">{cat}</AccordionTrigger>
                                <AccordionContent className="pl-4">
                                    {Object.entries(subs).map(([sub, items]: any) => (
                                        <Accordion key={sub} type="single" collapsible>
                                            <AccordionItem value={sub} className="border-none">
                                                <AccordionTrigger className="text-xs font-bold text-slate-400">{sub}</AccordionTrigger>
                                                <AccordionContent className="space-y-1">
                                                    {items.map((item: any) => (
                                                        <button key={item.id} onClick={() => {setProblem(item); setUserInput("");}} className={`w-full text-left p-3 rounded-xl text-xs font-bold ${problem?.id === item.id ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100'}`}>{item.title}</button>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))}
                </ScrollArea>
            </div>
            <div className="lg:col-span-3">
                {problem ? (
                    <Card className={`overflow-hidden ${isJunior ? 'rounded-[60px] border-8 border-yellow-200 shadow-xl' : 'rounded-[40px] border-none shadow-2xl'}`}>
                        <div className={`${isJunior ? 'bg-yellow-400' : 'bg-emerald-600'} p-8 text-white`}>
                            <CardTitle className="text-3xl font-black">{isJunior && "🌈 "} {problem.title}</CardTitle>
                        </div>
                        <CardContent className="p-10 space-y-8 text-center">
                            <div className={`${isJunior ? 'bg-sky-50' : 'bg-slate-900'} p-10 rounded-[32px] border-t-8 border-emerald-500`}>
                                <div className={`${isJunior ? 'text-blue-600 text-6xl' : 'text-emerald-400 text-4xl'}`}>
                                    <SafeMath formula={problem.latexFormula} />
                                </div>
                                {isJunior && !isNaN(parseInt(problem.answer)) && <CounterDisplay count={parseInt(problem.answer)} />}
                            </div>
                            <p className="text-xl font-bold text-slate-600 italic">{isJunior ? "✨ " + problem.instruction : problem.instruction}</p>
                            <Input value={userInput} onChange={e => setUserInput(e.target.value)} className="h-16 text-3xl text-center rounded-2xl" placeholder="Answer..." />
                            <Button onClick={() => { confetti(); speak("Excellent!"); }} className="w-full h-16 bg-emerald-600 rounded-2xl font-black text-white">VERIFY</Button>
                        </CardContent>
                    </Card>
                ) : <div className="h-96 flex flex-col items-center justify-center border-4 border-dashed rounded-[40px]"><Sigma className="w-20 h-20 text-slate-100" /></div>}
            </div>
        </div>
    );
}

// --- SUB-COMPONENT: ENGLISH MASTERY ---
function EnglishMastery({ selectedGrade }: { selectedGrade: string }) {
    const firestore = useFirestore();
    const [activeStory, setActiveStory] = useState<any>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    const isJunior = isJuniorLevel(selectedGrade);

    const { data: library } = useCollection<any>(useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'senior_stories'), orderBy('createdAt', 'desc')) : null, [firestore]));

    const folders = useMemo(() => {
        if (!library) return {};
        return library.filter(s => s.gradeLevel === selectedGrade).reduce((acc, s) => {
            const cat = s.category || 'Reading';
            const sub = s.subTopic || 'Standard';
            if (!acc[cat]) acc[cat] = {};
            if (!acc[cat][sub]) acc[cat][sub] = [];
            acc[cat][sub].push(s);
            return acc;
        }, {} as any);
    }, [library, selectedGrade]);

    return (
        <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
                <ScrollArea className="h-[60vh] bg-white rounded-3xl border p-2">
                    {Object.entries(folders).map(([cat, subs]: any) => (
                        <Accordion key={cat} type="single" collapsible>
                            <AccordionItem value={cat} className="border-none">
                                <AccordionTrigger className="p-3 bg-slate-50 rounded-xl mb-1 text-xs font-black uppercase tracking-widest">{cat}</AccordionTrigger>
                                <AccordionContent className="pl-4">
                                    {Object.entries(subs).map(([sub, items]: any) => (
                                        <Accordion key={sub} type="single" collapsible>
                                            <AccordionItem value={sub} className="border-none">
                                                <AccordionTrigger className="text-xs font-bold text-slate-400">{sub}</AccordionTrigger>
                                                <AccordionContent className="space-y-1">
                                                    {items.map((item: any) => (
                                                        <button key={item.id} onClick={() => { setActiveStory(item); setAnswers([]); }} className={`w-full text-left p-3 rounded-xl text-xs font-bold ${activeStory?.id === item.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100'}`}>{item.title}</button>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))}
                </ScrollArea>
            </div>
            <div className="lg:col-span-3">
                {activeStory ? (
                    <Card className={`overflow-hidden bg-white ${isJunior ? 'rounded-[60px] border-y-8 border-orange-200 shadow-lg' : 'rounded-[40px] shadow-2xl'}`}>
                        <div className={`${isJunior ? 'bg-orange-400' : 'bg-indigo-600'} p-8 text-white flex justify-between items-center`}>
                            <CardTitle className="text-3xl font-black">{isJunior && "📖 "} {activeStory.title}</CardTitle>
                            <Button variant="ghost" onClick={() => speak(activeStory.content)} className="text-white"><Volume2 /></Button>
                        </div>
                        <CardContent className="p-10 space-y-8">
                            <p className={`whitespace-pre-wrap leading-relaxed text-slate-700 ${isJunior ? 'text-3xl font-bold font-serif' : 'text-xl'}`}>{activeStory.content}</p>
                            <div className="bg-slate-50 p-8 rounded-[32px] border-2 space-y-6">
                                <h3 className="text-xl font-black text-indigo-900">Comprehension Check</h3>
                                {activeStory.quiz?.map((q: any, i: number) => (
                                    <div key={i} className="space-y-2">
                                        <p className="font-bold text-slate-800">{q.question}</p>
                                        <Input value={answers[i] || ""} onChange={e => { const n = [...answers]; n[i] = e.target.value; setAnswers(n); }} className="h-12 rounded-xl" />
                                    </div>
                                ))}
                                <Button onClick={() => { confetti(); speak("Good work!"); }} className="w-full h-14 bg-indigo-600 rounded-xl text-white font-bold">SUBMIT</Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : <div className="h-96 flex flex-col items-center justify-center border-4 border-dashed rounded-[40px]"><Languages className="w-20 h-20 text-slate-100" /></div>}
            </div>
        </div>
    );
}

// --- SUB-COMPONENT: DISCOVERY LAB ---
function DiscoveryLab({ selectedGrade }: { selectedGrade: string }) {
    const firestore = useFirestore();
    const [lab, setLab] = useState<any>(null);
    const [stage, setStage] = useState<'hypothesis' | 'experiment' | 'conclusion'>('hypothesis');
    const isJunior = isJuniorLevel(selectedGrade);

    const { data: dbLabs } = useCollection<any>(useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'senior_labs'), orderBy('createdAt', 'desc')) : null, [firestore]));

    const folders = useMemo(() => {
        if (!dbLabs) return {};
        return dbLabs.filter(l => l.gradeLevel === selectedGrade).reduce((acc, l) => {
            const cat = l.category || 'Science';
            const sub = l.subTopic || 'Standard';
            if (!acc[cat]) acc[cat] = {};
            if (!acc[cat][sub]) acc[cat][sub] = [];
            acc[cat][sub].push(l);
            return acc;
        }, {} as any);
    }, [dbLabs, selectedGrade]);

    return (
        <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
                <ScrollArea className="h-[60vh] bg-white rounded-3xl border p-2">
                    {Object.entries(folders).map(([cat, subs]: any) => (
                        <Accordion key={cat} type="single" collapsible>
                            <AccordionItem value={cat} className="border-none">
                                <AccordionTrigger className="p-3 bg-slate-50 rounded-xl mb-1 text-xs font-black uppercase tracking-widest">{cat}</AccordionTrigger>
                                <AccordionContent className="pl-4">
                                    {Object.entries(subs).map(([sub, items]: any) => (
                                        <Accordion key={sub} type="single" collapsible>
                                            <AccordionItem value={sub} className="border-none">
                                                <AccordionTrigger className="text-xs font-bold text-slate-400">{sub}</AccordionTrigger>
                                                <AccordionContent className="space-y-1">
                                                    {items.map((item: any) => (
                                                        <button key={item.id} onClick={() => { setLab(item); setStage('hypothesis'); }} className={`w-full text-left p-3 rounded-xl text-xs font-bold ${lab?.id === item.id ? 'bg-blue-600 text-white' : 'hover:bg-slate-100'}`}>{item.title}</button>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))}
                </ScrollArea>
            </div>
            <div className="lg:col-span-3">
                {lab ? (
                    <Card className={`overflow-hidden bg-white ${isJunior ? 'rounded-[60px] border-8 border-sky-200 shadow-xl' : 'rounded-[40px] shadow-2xl'}`}>
                        <div className={`${isJunior ? 'bg-sky-400' : 'bg-blue-700'} p-8 text-white flex flex-col items-center`}>
                            <div className="text-6xl mb-2">{lab.icon || '🔬'}</div>
                            <CardTitle className="text-3xl font-black uppercase tracking-tighter">{lab.title}</CardTitle>
                        </div>
                        <CardContent className="p-10 space-y-8">
                            <div className="flex gap-4 mb-4">
                                {['hypothesis', 'experiment', 'conclusion'].map((s: any) => (
                                    <div key={s} className={`flex-1 h-2 rounded-full ${stage === s ? 'bg-blue-500' : 'bg-slate-200'}`} />
                                ))}
                            </div>
                            {stage === 'hypothesis' && (
                                <div className="space-y-6 animate-in slide-in-from-right-4">
                                    <h3 className="text-2xl font-black text-slate-800">{lab.question}</h3>
                                    <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100">
                                        <p className="font-bold text-blue-700 mb-4">{lab.hypothesisPrompt}</p>
                                        <div className="grid gap-3">
                                            {lab.hypothesisOptions?.map((opt: string) => (
                                                <Button key={opt} variant="outline" className="bg-white border-2 h-auto py-4 font-bold rounded-2xl hover:bg-blue-600 hover:text-white" onClick={() => setStage('experiment')}>{opt}</Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {stage === 'experiment' && (
                                <div className="text-center space-y-8 animate-in zoom-in">
                                    <h3 className="text-3xl font-black text-orange-500">Mission: Data Collection</h3>
                                    <div className="text-[120px] py-10 animate-bounce">{lab.icon}</div>
                                    <Button onClick={() => setStage('conclusion')} className="h-16 px-12 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-full shadow-lg">Observe Result</Button>
                                </div>
                            )}
                            {stage === 'conclusion' && (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                                    <h3 className="text-3xl font-black text-green-700">Findings</h3>
                                    <div className="p-8 bg-green-50 rounded-[40px] border-4 border-green-100">
                                        <p className="text-2xl font-bold text-slate-800">{lab.conclusion}</p>
                                        <p className="text-slate-600 leading-relaxed text-lg mt-4">{lab.explanation}</p>
                                    </div>
                                    <Button onClick={() => { setLab(null); confetti(); }} className="w-full h-16 bg-green-600 rounded-full font-black text-xl text-white">Mission Complete! ✨</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : <div className="h-96 flex flex-col items-center justify-center border-4 border-dashed rounded-[40px]"><Microscope className="w-20 h-20 text-slate-100" /></div>}
            </div>
        </div>
    );
}

// --- SUB-COMPONENT: ADMIN CONSOLE ---
function AdminConsole({ onContentAdded }: { onContentAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [mode, setMode] = useState<'ai' | 'manual'>('ai');
    const [subject, setSubject] = useState<'math' | 'english' | 'science'>('math');
    const [topic, setTopic] = useState("");
    const [targetGrade, setTargetGrade] = useState('Junior Secondary (JHS)');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        const juniorPrompt = isJuniorLevel(targetGrade) ? ". Use simple language and whole numbers." : "";
        const context = { topic, gradeLevel: targetGrade as any, instructions: juniorPrompt };
        let res;
        if (subject === 'math') res = await generateSeniorMath(context);
        else if (subject === 'english') res = await generateSeniorEnglish(context);
        else res = await generateSeniorLab(context);

        if (res.success) {
            await addDoc(collection(firestore!, subject === 'math' ? 'senior_math' : subject === 'english' ? 'senior_stories' : 'senior_labs'), { ...res.data, gradeLevel: targetGrade, createdAt: serverTimestamp() });
            toast({ title: "Module Published!" });
            setTopic("");
            onContentAdded();
        }
        setLoading(false);
    };

    return (
        <Card className="bg-slate-900 border-none rounded-[40px] text-white p-8 mb-12 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black flex items-center gap-2"><PenTool className="text-yellow-400" /> Professor's Desk</h2>
                <div className="flex bg-slate-800 p-1 rounded-2xl">
                    <Button variant={mode === 'ai' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMode('ai')}>AI Magic</Button>
                    <Button variant={mode === 'manual' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMode('manual')}>Manual</Button>
                </div>
            </div>
            {mode === 'ai' ? (
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 space-y-2 w-full"><Label className="text-slate-400 text-[10px] font-black uppercase">Topic</Label><Input value={topic} onChange={e => setTopic(e.target.value)} className="h-14 bg-slate-800 border-slate-700 text-white" /></div>
                    <div className="w-64 space-y-2"><Label className="text-slate-400 text-[10px] font-black uppercase">Grade</Label><Select value={targetGrade} onValueChange={setTargetGrade}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                    <div className="w-48 space-y-2"><Label className="text-slate-400 text-[10px] font-black uppercase">Subject</Label><Select value={subject} onValueChange={setSubject as any}><SelectTrigger className="capitalize"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="math">Math</SelectItem><SelectItem value="english">English</SelectItem><SelectItem value="science">Science</SelectItem></SelectContent></Select></div>
                    <Button onClick={handleGenerate} disabled={loading} className="h-14 px-8 bg-indigo-600 font-black text-white">{loading ? <Loader2 className="animate-spin" /> : "GENERATE"}</Button>
                </div>
            ) : (
                <div className="text-center py-10 opacity-50 italic">Manual form active in Firestore...</div>
            )}
        </Card>
    );
}

// --- MAIN PAGE (FIXED FOR HYDRATION) ---
export default function SeniorAcademyPage() {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');
    const [selectedGrade, setSelectedGrade] = useState('Junior Secondary (JHS)');
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] p-12 flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Synchronizing Academy...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 p-4 rounded-3xl shadow-xl"><Rocket className="h-8 w-8 text-white" /></div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Academy Studio</h1>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Academic Mastery Pathway</p>
                        </div>
                    </div>
                    <div className="w-72 space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2 italic">Classroom Filter</Label>
                        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                            <SelectTrigger className="h-14 rounded-2xl bg-white border-2 shadow-sm font-bold"><SelectValue /></SelectTrigger>
                            <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </header>

                {canEdit && <AdminConsole onContentAdded={() => {}} />}

                <Tabs defaultValue="math" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-20 bg-white p-2 rounded-[24px] shadow-lg border border-slate-100 mb-12">
                        <TabsTrigger value="math" className="rounded-xl data-[state=active]:bg-emerald-100 font-black"><Sigma className="mr-2 h-4 w-4"/> Math Lab</TabsTrigger>
                        <TabsTrigger value="english" className="rounded-xl data-[state=active]:bg-indigo-100 font-black"><Languages className="mr-2 h-4 w-4"/> English</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-xl data-[state=active]:bg-blue-100 font-black"><Microscope className="mr-2 h-4 w-4"/> Discovery</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="math" className="mt-0"><MathLab selectedGrade={selectedGrade} /></TabsContent>
                    <TabsContent value="english" className="mt-0"><EnglishMastery selectedGrade={selectedGrade} /></TabsContent>
                    <TabsContent value="science" className="mt-0"><DiscoveryLab selectedGrade={selectedGrade} /></TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// --- SELECT COMPONENT FALLBACK (Fixed for HTML nesting) ---
function Select({ children, value, onValueChange }: any) {
    return (
        <select
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            className="w-full h-14 rounded-2xl bg-white border-2 px-4 font-bold outline-none shadow-sm text-slate-800"
        >
            {children}
        </select>
    );
}
function SelectTrigger({ children, className }: any) { return null; } 
function SelectValue() { return null; } 
function SelectContent({ children }: any) { return <>{children}</>; }
function SelectItem({ value, children }: any) { return <option value={value}>{children}</option>; }
