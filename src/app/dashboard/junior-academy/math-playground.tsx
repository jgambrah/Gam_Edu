'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, where, serverTimestamp, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Microscope, Atom, Leaf, Thermometer, Ghost, 
  Wand2, Volume2, Loader2, Sparkles, Plus, Trash2,
  Apple, User, HeartPulse, Ear, CloudSun, PawPrint, Car, Shapes, Earth,
    Sigma, Languages, BookOpen, 
  Rocket, PenTool, Save, Library, Brain, CheckCircle2, XCircle, PlusCircle, FolderOpen,
    Calculator, MessageSquare, Clapperboard, Users, BookCopy, BarChart, CalendarCheck, StaffIcon, Shield, Code, Activity, TrendingUp, Gamepad2, AlertCircle, Wallet, Settings, Megaphone, Wrench, Truck, Building2, Rabbit, FileQuestion, ArrowRight, PencilRuler, Globe, CheckSquare,
    Database,
    HeartHandshake,
    Minus,
    Clock,
    PenSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

// --- JUNIOR SCIENCE THEME ---
const juniorStyles = {
    card: "rounded-[50px] border-8 border-sky-100 shadow-[0_20px_0_#E0F2FE] bg-white overflow-hidden",
    header: "bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 p-8 text-white",
    bubble: "bg-white/80 backdrop-blur-md p-6 rounded-[40px] border-4 border-dashed border-sky-200",
    math: { // Adding specific math theme from the prompt
        card: "rounded-[60px] border-8 border-yellow-200 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100",
        header: "p-10 text-center",
        mathBox: "bg-sky-100 p-10 rounded-[50px] border-4 border-dashed border-sky-300 shadow-inner",
        button: "h-24 px-12 bg-gradient-to-t from-pink-600 to-pink-400 hover:scale-105 text-3xl font-black text-white rounded-[40px] shadow-[0_12px_0_#9d174d] active:translate-y-2 active:shadow-none transition-all",
        input: "h-28 text-7xl font-black text-center border-8 border-yellow-300 rounded-[40px] bg-white text-pink-500 shadow-inner"
    }
};

type MathTab = 'numbers' | 'counting' | 'sequence' | 'comparing' | 'number-words' | 'bonds' | 'addition' | 'subtraction' | 'tens-units' | 'grouping' | 'time' | 'money' | 'measurement' | 'shapes' | 'spatial' | 'comparison' | 'patterns' | 'one-to-one' | 'tracing';


// --- SUB-COMPONENT: MAGIC PEN (TRACING & AI EVALUATION) ---
const NumberMagicPen: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
    const traceCanvasRef = useRef<HTMLCanvasElement>(null);
    const freeCanvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedItem, setSelectedItem] = useState('1');
    const [isDrawingFree, setIsDrawingFree] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [feedback, setFeedback] = useState('');

    useEffect(() => { setupCanvases(); }, [selectedItem]);

    const setupCanvases = () => {
        [traceCanvasRef, freeCanvasRef].forEach((ref, isTrace) => {
            const canvas = ref.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if(!ctx) return;
            canvas.width = 400; canvas.height = 400;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, 400, 400);
            if (isTrace === 0 && traceCanvasRef.current) {
                const c = traceCanvasRef.current.getContext('2d')!;
                c.font = "900 300px Nunito"; c.textAlign = 'center'; c.textBaseline = 'middle';
                c.strokeStyle = '#E2E8F0'; c.setLineDash([10, 10]);
                c.strokeText(selectedItem, 200, 220);
            }
        });
    };

    const handleCheck = async () => {
        setIsEvaluating(true);
        setFeedback("Magic eyes checking...");
        // In a real environment, this calls the Gemini Vision model
        setTimeout(() => {
            confetti();
            setFeedback("You are a Number Superstar! ⭐");
            onSound(`Wonderful! You wrote ${selectedItem} perfectly!`);
            setIsEvaluating(false);
        }, 2000);
    };

    return (
        <Card className="rounded-[60px] border-8 border-purple-100 overflow-hidden bg-white shadow-2xl">
            <div className="bg-purple-500 p-8 text-white text-center">
                <h3 className="text-4xl font-black uppercase tracking-tighter">Number Magic Pen 🪄</h3>
            </div>
            <CardContent className="p-12 space-y-10">
                <div className="flex justify-center gap-2 overflow-x-auto py-4">
                    {Array.from({length: 10}).map((_, i) => (
                        <button key={i} onClick={() => setSelectedItem(i.toString())} className={`w-14 h-14 rounded-2xl font-black text-2xl border-4 ${selectedItem === i.toString() ? 'bg-purple-600 text-white border-white scale-110' : 'bg-slate-50 text-slate-400 border-transparent'}`}>{i}</button>
                    ))}
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4 text-center">
                        <p className="text-slate-400 font-bold uppercase text-xs">1. Trace This</p>
                        <canvas ref={traceCanvasRef} className="border-4 border-slate-100 rounded-[3rem] w-full aspect-square" />
                    </div>
                    <div className="space-y-4 text-center relative">
                        <p className="text-slate-800 font-bold uppercase text-xs">2. Write it yourself</p>
                        <canvas 
                            ref={freeCanvasRef} 
                            onMouseDown={() => setIsDrawingFree(true)}
                            onMouseUp={() => setIsDrawingFree(false)}
                            onMouseMove={(e) => {
                                if(!isDrawingFree) return;
                                const ctx = freeCanvasRef.current?.getContext('2d');
                                if(!ctx) return;
                                const rect = freeCanvasRef.current!.getBoundingClientRect();
                                ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                                ctx.stroke();
                            }}
                            className="border-8 border-purple-200 rounded-[3rem] w-full aspect-square cursor-crosshair" 
                        />
                        {isEvaluating && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[3rem] animate-pulse"><Loader2 className="w-12 h-12 animate-spin text-purple-600"/></div>}
                    </div>
                </div>
                <div className="text-center space-y-6">
                    {feedback && <Badge className="bg-purple-100 text-purple-700 text-xl p-4 rounded-2xl border-none">{feedback}</Badge>}
                    <div className="flex gap-4 justify-center">
                        <Button onClick={setupCanvases} variant="outline" className="h-16 px-10 rounded-2xl border-4 font-black">CLEAR</Button>
                        <Button onClick={handleCheck} disabled={isEvaluating} className="h-16 px-16 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black shadow-xl">CHECK MY WORK!</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// --- SUB-COMPONENT: GENERIC SaaS MODULE (AI + DB DRIVEN) ---
function GenericMathModule({ tab, schoolId, canEdit, onSound }: { tab: string, schoolId: string, canEdit: boolean, onSound: (t: string) => void }) {
    const firestore = useFirestore();
    const [index, setIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<any>(null);

    // SaaS Query for this specific math category
    const dataQuery = useMemoFirebase(() => 
        firestore ? query(
            collection(firestore, 'junior_math_world'), 
            where('schoolId', '==', schoolId),
            where('category', '==', tab),
            orderBy('createdAt', 'asc')
        ) : null, [firestore, schoolId, tab]);
    
    const { data: items } = useCollection<any>(dataQuery);
    const current = items?.[index];

    const handleAnswer = (val: any) => {
        if(!current) return;
        setUserAnswer(val);
        if (val === current.correctAnswer) {
            confetti();
            onSound(`Yes! ${val} is correct! You are a math star!`);
        } else {
            onSound(`Try again! You can do it!`);
        }
    };

    return (
        <div className="animate-in slide-in-from-bottom-10 duration-700">
            {current ? (
                <Card className="rounded-[60px] border-8 border-purple-100 shadow-2xl bg-white overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-10 text-white text-center">
                        <h3 className="text-5xl font-black uppercase tracking-tighter">{current.title || tab.replace('-', ' ')}</h3>
                    </div>
                    <CardContent className="p-16 flex flex-col items-center space-y-12">
                        {/* THE VISUAL PROMPT */}
                        <div className="w-full max-w-2xl aspect-video bg-purple-50 rounded-[4rem] border-8 border-white shadow-inner flex items-center justify-center overflow-hidden">
                            <img src={current.imageUrl || "https://placehold.co/600x400/f3e8ff/6b21a8?text=Math+Fun"} className="w-full h-full object-cover p-8" />
                        </div>

                        <div className="text-center space-y-4">
                            <p className="text-3xl font-black text-slate-800 leading-tight">{current.question}</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {current.options?.map((opt: any) => (
                                    <button 
                                        key={opt}
                                        onClick={() => handleAnswer(opt)}
                                        className={`h-24 w-24 rounded-3xl font-black text-4xl transition-all border-4 ${
                                            userAnswer === opt 
                                            ? (opt === current.correctAnswer ? 'bg-green-500 text-white border-white scale-110' : 'bg-red-500 text-white border-white') 
                                            : 'bg-slate-50 text-purple-600 border-purple-50 hover:bg-purple-100'
                                        }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setIndex(i => Math.max(0, i - 1))} className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"><ArrowRight className="rotate-180" /></button>
                            <button onClick={() => { if(items) setIndex(i => (i + 1) % items.length); setUserAnswer(null); }} className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"><ArrowRight /></button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="py-40 text-center bg-white rounded-[60px] border-8 border-dashed border-purple-50">
                    <Calculator className="w-20 h-20 text-purple-100 mx-auto mb-4" />
                    <p className="text-purple-200 font-black text-2xl uppercase">Math Academy Empty...</p>
                    {canEdit && <p className="text-slate-400 text-sm mt-2 font-bold uppercase">Use the Admin Tools to populate this school's curriculum.</p>}
                </div>
            )}
        </div>
    );
}

// --- 2. NUMERACY ACADEMY (PRECISE INTEGRATION) ---
export default function MathPlayground({ schoolId }: { schoolId: string }) {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');

    const [activeTab, setActiveTab] = useState<MathTab>('numbers');

    const speak = (text: string) => {
        if (typeof window === 'undefined') return;
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
    };

    const tabs: {id: MathTab, icon: React.ElementType}[] = [
        { id: 'numbers', icon: Sigma },
        { id: 'counting', icon: Users },
        { id: 'sequence', icon: ArrowRight },
        { id: 'comparing', icon: Activity },
        { id: 'number-words', icon: BookOpen },
        { id: 'bonds', icon: HeartHandshake },
        { id: 'addition', icon: Plus },
        { id: 'subtraction', icon: Minus },
        { id: 'tens-units', icon: Database },
        { id: 'grouping', icon: Users },
        { id: 'time', icon: Clock },
        { id: 'money', icon: Wallet },
        { id: 'measurement', icon: PencilRuler },
        { id: 'shapes', icon: Shapes },
        { id: 'spatial', icon: Globe },
        { id: 'comparison', icon: Activity },
        { id: 'patterns', icon: CheckSquare },
        { id: 'one-to-one', icon: Users },
        { id: 'tracing', icon: PenSquare }
    ];
    
    return (
        <div className="flex flex-col items-center max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 font-black">
            {/* SCROLLABLE CATEGORY NAV */}
            <div className="w-full overflow-x-auto no-scrollbar pb-6 px-4">
                <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-xl border-4 border-purple-50 min-w-max">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`min-w-[120px] px-6 py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-2 border-4 ${
                                    activeTab === tab.id 
                                    ? 'bg-purple-600 text-white border-purple-700 shadow-xl scale-110 -translate-y-2' 
                                    : 'bg-white text-slate-400 border-transparent hover:bg-purple-50'
                                }`}
                            >
                                <Icon className={`w-6 h-6 ${activeTab === tab.id ? 'text-white' : 'text-purple-300'}`} />
                                <span className="whitespace-nowrap">{tab.id.replace('-', ' ')}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* DYNAMIC MODULE LOADER */}
            <div className="w-full px-4">
                {activeTab === 'tracing' ? (
                    <NumberMagicPen onSound={speak} />
                ) : (
                    <GenericMathModule 
                        tab={activeTab} 
                        schoolId={schoolId} 
                        canEdit={canEdit} 
                        onSound={speak} 
                    />
                )}
            </div>
        </div>
    );
}

    