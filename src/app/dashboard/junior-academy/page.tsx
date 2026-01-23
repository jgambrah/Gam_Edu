
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, 
  Trophy, Gift, Check, CheckCircle2, XCircle, PenTool, Eraser, Database, Pencil, Heart, Utensils, Smile, Tv, Users, Activity, CheckSquare, BrainCircuit, Handshake, Milestone, Ear, Layers, AudioLines, Repeat, Underline, BookCheck, FolderOpen, Car, Earth
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateWordDetails, generateTTSAction, assessHandwritingAction, generateLifeSkillEntry, generateLessonImageAction, generatePhonicsWorldEntry, generateMathWorldEntry, generateScienceWorldEntry } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Label } from '@/components/ui/label';
import { StorySpark, VoiceCoach } from './voice-coach';
import MathPlayground from './math-playground';
import JuniorScienceWorld from './science-world';
import ArtStudio from './art-studio';
import StickerBook from './sticker-book';
import { GoogleGenAI } from "@google/genai";
import * as constants from '@/lib/constants';
import * as LucideIcons from 'lucide-react';

// --- ICON MAPPER ---
const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
  const map: Record<string, keyof typeof LucideIcons> = {
    // Life Skills
    'fa-face-smile': 'Smile',
    'fa-tooth': 'Sparkles', // Placeholder for Tooth
    'fa-heart-pulse': 'HeartPulse',
    'fa-vest': 'Shirt',
    'fa-sun': 'Sun',
    'fa-utensils': 'Utensils',
    'fa-school': 'School',
    'fa-house': 'Home',
    'fa-recycle': 'Recycle',
    'fa-water': 'Droplets',
    'fa-broom': 'Trash2',
    'fa-flag': 'Flag',
    'fa-hand-pointer': 'MousePointer2',
    'fa-palette': 'Palette',
    'fa-cube': 'Cube',
    'fa-chalkboard-user': 'User',
    'fa-hand-holding-heart': 'HeartHandshake',
    // Numeracy
    'fa-rabbit': 'Rabbit',
    'fa-carrot': 'Carrot',
    'fa-apple-whole': 'Apple',
    'fa-cookie': 'Cookie',
    'fa-star': 'Star',
    'fa-tv': 'Tv',
    'fa-bed': 'Bed',
    // Phonics
    'fa-spell-check': 'Languages',
    'fa-ear-listen': 'Ear',
    'fa-pen-nib': 'PenNib',
    'fa-arrow-1-9': 'Sigma',
    // Science
    'fa-flask-vial': 'FlaskConical',
    'fa-eye': 'Eye',
    'fa-cloud-showers-heavy': 'CloudRain',
    // Creative Arts
    'fa-guitar': 'Guitar',
    // Default
    'fa-robot': 'Bot',
  };

  const LucideName = map[iconName] || 'HelpCircle';
  const IconComponent = (LucideIcons as any)[LucideName];

  return <IconComponent className={className} />;
};


// --- HELPERS ---
const isJuniorLevel = (grade: string) => 
    grade === 'Early Childhood' || grade === 'Lower Primary';

const juniorStyles = {
    storybook: "bg-[#FFFDE7] border-y-8 border-x-4 border-orange-200 rounded-[60px] p-8 shadow-[0_15px_0_#FFE082]",
    storyText: "text-3xl font-bold text-orange-900 leading-relaxed font-serif",
    button: "h-24 px-12 bg-gradient-to-t from-pink-600 to-pink-400 hover:scale-105 text-3xl font-black text-white rounded-[40px] shadow-[0_12px_0_#9d174d] active:translate-y-2 active:shadow-none transition-all",
    input: "h-28 text-7xl font-black text-center border-8 border-yellow-300 rounded-[40px] bg-white text-pink-500 shadow-inner",
    questCard: "bg-gradient-to-b from-sky-400 to-blue-500 border-b-[12px] border-blue-700 rounded-[50px] text-white",
    stepBubble: "w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl shadow-lg border-4 border-blue-200",
    card: "rounded-[60px] border-8 border-yellow-200 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100",
    header: "p-10 text-center",
    mathBox: "bg-sky-100 p-10 rounded-[50px] border-4 border-dashed border-sky-300 shadow-inner",
    bubble: "bg-white/80 backdrop-blur-md p-6 rounded-[40px] border-4 border-dashed border-pink-200",
};


// --- NEW COMPONENT: WRITING CANVAS (MAGIC PEN) ---
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const STROKES = [
  { id: 'standing', label: 'Standing', icon: 'fa-grip-lines-vertical' },
  { id: 'sleeping', label: 'Sleeping', icon: 'fa-grip-lines' },
  { id: 'slanting', label: 'Slanting', icon: 'fa-slash' },
  { id: 'circle', label: 'Circle', icon: 'fa-circle' },
];

function WritingCanvas() {
  const traceCanvasRef = useRef<HTMLCanvasElement>(null);
  const freeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'letters' | 'strokes' | 'numbers'>('numbers');
  const [selectedItem, setSelectedItem] = useState('1');
  const [isDrawingFree, setIsDrawingFree] = useState(false);
  const [brushColor, setBrushColor] = useState('#FF9F43');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedback, setFeedback] = useState('');
  const { schoolId } = useCurrentSchool();

  const speak = async (text: string) => {
    if (!text || !schoolId) return;
    try {
      const result = await generateTTSAction({ text, voice: 'Achernar', schoolId });
      if (result.success && result.data && typeof window !== 'undefined') {
        const audio = new Audio(`data:audio/wav;base64,${result.data}`);
        audio.play();
      }
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  useEffect(() => {
    if (mode === 'numbers') setBrushColor('#FF9F43');
    else if (mode === 'letters') setBrushColor('#FF6B6B');
    else setBrushColor('#45AAF2');
    initCanvases();
  }, [selectedItem, mode]);

  const initCanvases = () => {
    setupCanvas(traceCanvasRef.current, true);
    setupCanvas(freeCanvasRef.current, false);
    setFeedback('');
    setShowSuccess(false);
  };

  const setupCanvas = (canvas: HTMLCanvasElement | null, isTrace: boolean) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 400; canvas.height = 400;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 400, 400);

    if (isTrace) {
      ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 4; ctx.setLineDash([10, 10]);
      ctx.font = "900 300px sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const text = mode === 'letters' ? selectedItem : mode === 'numbers' ? selectedItem : '|';
      ctx.strokeText(text, 200, 220);
    }
  };

  const handleCheck = async () => {
    if (!freeCanvasRef.current || !schoolId) return;
    setIsEvaluating(true);
    setFeedback("Magic eyes checking...");
    try {
      const dataUrl = freeCanvasRef.current.toDataURL('image/png');
      const target = mode === 'letters' ? selectedItem : selectedItem;
      
      const result = await assessHandwritingAction({ imageDataUri: dataUrl, targetCharacter: target, schoolId });
      
      if (result.isCorrect) {
        setShowSuccess(true);
        setFeedback('Number Superstar! ⭐');
        confetti();
        speak(`Wonderful! You wrote ${target} perfectly!`);
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setFeedback('Try once more! 💪');
        speak(`So close! Let's try to trace ${target} again.`);
      }
    } catch (e) { setFeedback('Magic is sleeping...'); }
    finally { setIsEvaluating(false); }
  };

  return (
    <div className="flex flex-col items-center space-y-8 relative animate-in fade-in">
      {showSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/80 backdrop-blur-xl animate-in zoom-in">
           <div className="text-center space-y-4">
              <Star className="w-32 h-32 text-yellow-400 animate-bounce mx-auto fill-current" />
              <h2 className="text-6xl font-black text-orange-600">MAGICAL!</h2>
              <p className="text-2xl font-bold text-slate-500 uppercase tracking-widest">Writing Superstar</p>
           </div>
        </div>
      )}

      <div className="flex bg-white p-2 rounded-3xl shadow-xl border-4 border-slate-100 gap-2">
          {['numbers', 'letters', 'strokes'].map((m: any) => (
            <Button key={m} onClick={() => setMode(m)} variant={mode === m ? 'default' : 'ghost'} className="rounded-2xl font-black uppercase text-xs">
              {m}
            </Button>
          ))}
      </div>

      <Card className={juniorStyles.card}>
        <CardContent className="p-10 space-y-10">
            <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar">
                {(mode === 'letters' ? LETTERS : mode === 'numbers' ? NUMBERS : []).map(item => (
                    <button key={item} onClick={() => setSelectedItem(item)} className={`flex-shrink-0 w-14 h-14 rounded-2xl font-black text-2xl border-4 ${selectedItem === item ? 'bg-purple-500 text-white border-white scale-110 shadow-lg' : 'bg-slate-50 text-slate-400'}`}>{item}</button>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4 text-center">
                    <p className="text-slate-400 font-bold uppercase text-xs flex items-center justify-center gap-2"><span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">1</span> Trace the Guide</p>
                    <div className="bg-white border-4 border-slate-100 rounded-[3rem] shadow-inner overflow-hidden">
                        <canvas ref={traceCanvasRef} className="w-full aspect-square opacity-50" />
                    </div>
                </div>
                <div className="space-y-4 text-center relative">
                    <p className="text-slate-800 font-bold uppercase text-xs flex items-center justify-center gap-2"><span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white">2</span> Draw Your Own!</p>
                    <div className="bg-white border-8 border-purple-100 rounded-[3rem] shadow-2xl overflow-hidden relative">
                        <canvas 
                            ref={freeCanvasRef} 
                            onMouseDown={() => setIsDrawingFree(true)}
                            onMouseUp={() => setIsDrawingFree(false)}
                            onMouseMove={(e) => {
                                if(!isDrawingFree) return;
                                const ctx = freeCanvasRef.current?.getContext('2d');
                                const rect = freeCanvasRef.current!.getBoundingClientRect();
                                if (ctx) {
                                    ctx.lineWidth = 15; ctx.lineCap = 'round'; ctx.strokeStyle = brushColor;
                                    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                                    ctx.stroke();
                                }
                            }}
                            className="w-full aspect-square cursor-crosshair" 
                        />
                        {isEvaluating && <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 shadow-[0_0_20px_purple] animate-[scan_2s_infinite]" />}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                {['#FF6B6B', '#FF9F43', '#45AAF2', '#A55EEA', '#000000'].map(c => (
                    <button key={c} onClick={() => setBrushColor(c)} className={`w-12 h-12 rounded-full border-4 ${brushColor === c ? 'border-slate-800 scale-110 shadow-lg' : 'border-white'}`} style={{backgroundColor: c}} />
                ))}
                <div className="w-px h-12 bg-slate-100 mx-2" />
                <Button onClick={initCanvases} variant="outline" className="h-14 rounded-2xl font-bold uppercase"><Eraser className="mr-2" /> Reset</Button>
                <Button onClick={handleCheck} disabled={isEvaluating} className="h-14 px-12 bg-black text-white rounded-2xl font-black shadow-xl hover:bg-slate-800">
                    {isEvaluating ? <Loader2 className="animate-spin mr-2" /> : <PenTool className="mr-2" />} CHECK MY WORK!
                </Button>
            </div>
            {feedback && <div className="text-center text-xl font-black text-purple-600 animate-bounce">{feedback}</div>}
        </CardContent>
      </Card>
      <style>{`@keyframes scan { 0% { top: 0; } 100% { top: 100%; } }`}</style>
    </div>
  );
}

// --- SUB-COMPONENT: LIFE SKILLS HUB ---
type LifeSkillTab = 'emotions' | 'physical-health' | 'social' | 'routine-songs' | 'modeling' | 'practical-life' | 'communication' | 'puppet-theater' | 'cognitive';

function LifeSkillsZone({ schoolId }: { schoolId: string }) {
  const [activeTab, setActiveTab] = useState<LifeSkillTab>('emotions');
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();

  const onSound = async (text: string) => {
    if (!text || !schoolId) return;
    try {
        const result = await generateTTSAction({ text, voice: 'Achernar', schoolId });
        if (result.success && result.data && typeof window !== 'undefined') {
            const audio = new Audio(`data:audio/wav;base64,${result.data}`);
            audio.play();
        }
    } catch (e) {
        console.error("Audio error", e);
    }
  };
  
  const handleGenerate = async () => {
    if (!aiTopic || !firestore || !schoolId) return;
    setIsAiLoading(true);
    try {
        const result = await generateLifeSkillEntry({ topic: aiTopic, category: activeTab, schoolId });
        if (result.success && result.data) {
            await addDoc(collection(firestore, 'junior_lifeskills_world'), { ...result.data, category: activeTab, schoolId, createdAt: serverTimestamp() });
            setIsDrawerOpen(false); setAiTopic('');
            toast({ title: 'Magic Created!', description: 'A new learning activity is now available.' });
        } else { throw new Error(result.error || "AI failed."); }
    } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); }
    finally { setIsAiLoading(false); }
  };

  const tabs: {id: LifeSkillTab, label: string, icon: any, color: string}[] = [
    { id: 'physical-health', label: 'Health', icon: Activity, color: 'bg-green-500' },
    { id: 'emotions', label: 'Feelings', icon: Smile, color: 'bg-yellow-500' },
    { id: 'routine-songs', label: 'Songs', icon: Music, color: 'bg-pink-500' },
    { id: 'modeling', label: 'Watch', icon: Tv, color: 'bg-indigo-500' },
    { id: 'practical-life', label: 'Routine', icon: Check, color: 'bg-blue-500' },
    { id: 'communication', label: 'Talk', icon: Mic, color: 'bg-orange-500' },
    { id: 'social', label: 'Kindness', icon: Heart, color: 'bg-rose-500' },
    { id: 'puppet-theater', label: 'Puppets', icon: Star, color: 'bg-purple-500' },
    { id: 'cognitive', label: 'Solver', icon: Brain, color: 'bg-emerald-500' }
  ];

  return (
    <div className="flex flex-col items-center max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-black">
      <div className="w-full flex justify-between items-center px-6">
        <div>
          <h2 className="text-4xl font-black text-teal-600 uppercase tracking-tighter">Life Skills Hub 🌟</h2>
          <p className="text-slate-500 font-bold italic">Social, Emotional & Independence!</p>
        </div>
      </div>

      <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4">
        <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-teal-50 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-w-[120px] px-6 py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center border-4 ${
                  activeTab === tab.id ? `${tab.color} text-white shadow-xl scale-110 -translate-y-1` : 'bg-white text-slate-400 border-transparent hover:bg-teal-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full px-4">
        <LifeSkillsModule 
            tab={activeTab} 
            schoolId={schoolId} 
            onSound={(text) => onSound(text, schoolId)} 
            canEdit={canEdit}
        />
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: GENERAL LIFE SKILLS MODULE (AI + DB DRIVEN) ---
function LifeSkillsModule({ tab, schoolId, canEdit, onSound }: { tab: string, schoolId: string, canEdit: boolean, onSound: (t: string) => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [localImg, setLocalImg] = useState<string | null>(null);

    const dataQuery = useMemoFirebase(() => 
        firestore ? query(
            collection(firestore, 'junior_lifeskills_world'), 
            where('schoolId', '==', schoolId),
            where('category', '==', tab),
            orderBy('createdAt', 'asc')
        ) : null, [firestore, schoolId, tab]);
    
    const { data: dbItems, forceRefetch } = useCollection<any>(dataQuery);
    
    const displayItems = useMemo(() => {
        if (dbItems && dbItems.length > 0) return dbItems;

        switch (tab) {
            case 'emotions': return constants.LIFE_SKILLS_DATA.emotions.map(e => ({ ...e, title: e.name }));
            case 'social': return constants.LIFE_SKILLS_DATA.social;
            case 'physical-health': return constants.LIFE_SKILLS_DATA.health.map(h => ({ ...h, prompt: h.action }));
            case 'routine-songs': return constants.LIFE_SKILLS_DATA.music;
            default: return [];
        }
    }, [dbItems, tab]);

    const current = displayItems?.[index];
    
    const loadVisual = useCallback(async () => {
        if (!current || !current.imagePrompt || !schoolId) return;
        setIsLoading(true);
        setLocalImg(null);
        try {
            const result = await generateLessonImageAction({prompt: current.imagePrompt, schoolId });
            if (result.success) setLocalImg(result.data || null);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
    }, [current, schoolId]);

    useEffect(() => {
        if (current) loadVisual();
    }, [current, loadVisual]);

    const generateWithAi = async () => {
        if (!aiTopic || !firestore || !schoolId) return;
        setIsLoading(true);
        try {
            const result = await generateLifeSkillEntry({ topic: aiTopic, category: tab, schoolId });
            if(result.success && result.data){
                await addDoc(collection(firestore!, 'junior_lifeskills_world'), {
                    ...result.data,
                    category: tab,
                    schoolId,
                    createdAt: serverTimestamp()
                });
                
                setIsDrawerOpen(false);
                setAiTopic('');
                confetti();
                forceRefetch();
            } else { throw new Error(result.error || "Failed to generate entry") }
        } catch (e: any) { 
            console.error(e); 
            toast({ title: "Magic Failed", variant: "destructive", description: e.message });
        } finally { setIsLoading(false); }
    };
    
    return (
        <div className="animate-in zoom-in duration-500 relative">
            {canEdit && (
                 <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white p-3 rounded-full shadow-lg border-2 border-green-200 text-green-600 font-black text-xs uppercase flex items-center gap-1 hover:bg-green-50 z-10">
                    <Wand2 className="w-3 h-3" /> AI Maker
                </button>
            )}

            {current ? (
                <Card className={juniorStyles.card}>
                    <div className={juniorStyles.header}>
                        <div className="flex items-center gap-8">
                            <div className="text-8xl p-8 bg-white/20 rounded-[3rem] backdrop-blur-md animate-bounce">
                                {current.icon ? <IconRenderer iconName={current.icon} className="w-24 h-24 text-white" /> : '🌟'}
                            </div>
                            <div className="text-left">
                                <h3 className="text-6xl font-black uppercase tracking-tighter">{current.title || current.name}</h3>
                            </div>
                        </div>
                    </div>
                     <CardContent className="p-12 flex flex-col md:flex-row gap-12 items-center">
                        <div 
                            onClick={() => onSound(current.prompt || current.action)}
                            className="relative aspect-square w-full max-w-md bg-green-50 rounded-[4rem] border-8 border-white shadow-2xl overflow-hidden cursor-pointer group"
                        >
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-green-400 w-12 h-12" /></div>
                            ) : localImg && (
                                <img src={localImg} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={current.name} />
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <Volume2 className="text-white w-16 h-16 opacity-0 group-hover:opacity-100 drop-shadow-lg" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-8">
                            <div className={juniorStyles.bubble}>
                                <p className="text-3xl font-bold text-slate-700 leading-relaxed italic">"{current.prompt || current.action}"</p>
                            </div>
                            
                            <Button onClick={() => onSound(current.prompt || current.action)} className={juniorStyles.button + " w-full uppercase"}>
                                Read Story! 🎙️
                            </Button>
                            
                            <div className="flex gap-4 justify-center">
                                <button onClick={() => setIndex(i => Math.max(0, i - 1))} className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"><ArrowRight className="rotate-180" /></button>
                                <button onClick={() => displayItems && displayItems.length > 0 && setIndex(i => (i + 1) % displayItems.length)} className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"><ArrowRight /></button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                 <div className="py-40 text-center bg-white rounded-[60px] border-8 border-dashed border-green-50">
                    <Heart className="w-20 h-20 text-green-100 mx-auto mb-4" />
                    <p className="text-green-200 font-black text-2xl uppercase">Skill Hub Awaiting Content...</p>
                </div>
            )}
            
            {isDrawerOpen && (
                <TeacherModal 
                    title={tab} 
                    topicValue={aiTopic} 
                    onTopicChange={setAiTopic} 
                    onGenerate={generateWithAi} 
                    isLoading={isLoading} 
                    onClose={() => setIsDrawerOpen(false)} 
                />
            )}
        </div>
    );
}

// --- MAIN PAGE ---
export default function JuniorCampusPage() {
    const { role, profile } = useRole();
    const { user } = useUser();
    
    const schoolId = profile?.schoolId || (user as any)?.schoolId || "sunnyside-default";
    const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');

    return (
        <div className="min-h-screen bg-[#FFFBEB] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-[45px] shadow-xl border-b-[12px] border-yellow-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-400 p-5 rounded-[30px] shadow-inner rotate-3"><Rabbit className="h-12 w-12 text-white" /></div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-800 tracking-tighter">Junior Campus</h1>
                            <p className="text-xl font-bold text-pink-500 uppercase tracking-widest italic">The Magic of Learning! ✨</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-[20px] border-2 border-slate-100">
                        <Badge variant="outline" className="text-indigo-500 border-indigo-200">SaaS Node</Badge>
                        <span className="text-xs font-black text-slate-400">{schoolId}</span>
                    </div>
                </header>

                <Tabs defaultValue="lifeskills" className="w-full">
                    <TabsList className="grid w-full grid-cols-8 h-24 bg-white p-2 rounded-[30px] shadow-xl border-2 border-yellow-100 mb-10 overflow-x-auto no-scrollbar">
                        <TabsTrigger value="lifeskills" className="rounded-2xl data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 font-black flex flex-col items-center gap-1"><Heart className="w-5 h-5"/> Life Skills</TabsTrigger>
                        <TabsTrigger value="writing" className="rounded-2xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-black flex flex-col items-center gap-1"><Pencil className="w-5 h-5"/> Writing</TabsTrigger>
                        <TabsTrigger value="stories" className="rounded-2xl data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-black flex flex-col items-center gap-1"><BookOpen className="w-5 h-5"/> Stories</TabsTrigger>
                        <TabsTrigger value="math" className="rounded-2xl data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-black flex flex-col items-center gap-1"><Calculator className="w-5 h-5"/> Math</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-2xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black flex flex-col items-center gap-1"><Atom className="w-5 h-5"/> Science</TabsTrigger>
                        <TabsTrigger value="art" className="rounded-2xl data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-black flex flex-col items-center gap-1"><Palette className="w-5 h-5"/> Art</TabsTrigger>
                        <TabsTrigger value="coach" className="rounded-2xl data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 font-black flex flex-col items-center gap-1"><Mic className="w-5 h-5"/> Coach</TabsTrigger>
                        <TabsTrigger value="rewards" className="rounded-2xl data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 font-black flex flex-col items-center gap-1"><Trophy className="w-5 h-5"/> Rewards</TabsTrigger>
                    </TabsList>

                    <div className="min-h-[700px] animate-in slide-in-from-bottom-10 duration-1000">
                        <TabsContent value="lifeskills" className="mt-0"><LifeSkillsZone schoolId={schoolId} /></TabsContent>
                        <TabsContent value="writing" className="mt-0"><WritingCanvas /></TabsContent>
                        <TabsContent value="stories" className="mt-0"><StorySpark canEdit={canEdit} /></TabsContent>
                        <TabsContent value="math" className="mt-0"><MathPlayground schoolId={schoolId} /></TabsContent>
                        <TabsContent value="science" className="mt-0"><JuniorScienceWorld schoolId={schoolId} /></TabsContent>
                        <TabsContent value="art" className="mt-0"><div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300"><ArtStudio schoolId={schoolId} /></div></TabsContent>
                        <TabsContent value="coach" className="mt-0"><VoiceCoach canEdit={canEdit} /></TabsContent>
                        <TabsContent value="rewards" className="mt-0"><StickerBook schoolId={schoolId} /></TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

    