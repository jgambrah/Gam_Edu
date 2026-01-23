
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
  Trophy, Gift, Check, CheckCircle2, XCircle, PenTool, Eraser, Database, 
  Pencil, Pen, Heart, Utensils, Smile, Tv, Users, BrainCircuit, Activity,
  FolderOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateJuniorScience, generateWordDetails, generateTTSAction, generateLessonImageAction, assessHandwritingAction, generateLifeSkillEntry } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { StorySpark, VoiceCoach } from './voice-coach';
import MathPlayground from './math-playground';
import JuniorScienceWorld from './science-world';
import ArtStudio from './art-studio';
import StickerBook from './sticker-book';
import PhonicsWorld from './phonics-world';
import { useCurrentSchool } from '@/hooks/use-current-school';

// --- JUNIOR STYLES ---
const juniorStyles = {
    card: "rounded-[40px] border-8 border-yellow-200 shadow-[0_15px_0_#FEF9C3] bg-white overflow-hidden",
    header: "bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400 p-8 text-white",
    bubble: "bg-white/80 backdrop-blur-md p-6 rounded-[40px] border-4 border-dashed border-pink-200 shadow-inner",
    btnPrimary: "h-16 px-8 bg-pink-500 hover:bg-pink-600 text-white font-black rounded-3xl shadow-[0_8px_0_#be185d] active:translate-y-1 active:shadow-none transition-all",
};

// --- NEW COMPONENT: WRITING CANVAS (MAGIC PEN) ---
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

function WritingCanvas({ schoolId }: { schoolId: string }) {
  const traceCanvasRef = useRef<HTMLCanvasElement>(null);
  const freeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'letters' | 'numbers'>('numbers');
  const [selectedItem, setSelectedItem] = useState('1');
  const [isDrawingFree, setIsDrawingFree] = useState(false);
  const [brushColor, setBrushColor] = useState('#FF9F43');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedback, setFeedback] = useState('');

  const speak = async (text: string) => {
    if (!text || !schoolId) return;
    try {
        const result = await generateTTSAction({ text, voice: 'Achernar', schoolId });
        if (result.success && result.data && typeof window !== 'undefined') {
            const audio = new Audio(`data:audio/wav;base64,${result.data}`);
            audio.play();
        }
    } catch(e) { console.error("Speech Synthesis failed:", e) }
  };

  const initCanvases = useCallback(() => {
    setupCanvas(traceCanvasRef.current, true);
    setupCanvas(freeCanvasRef.current, false);
    setFeedback('');
    setShowSuccess(false);
  }, [traceCanvasRef, freeCanvasRef]);

  const setupCanvas = (canvas: HTMLCanvasElement | null, isTrace: boolean) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 400; canvas.height = 400;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 400, 400);

    if (isTrace) {
      ctx.strokeStyle = '#E2E8F0'; ctx.lineWidth = 4; ctx.setLineDash([10, 10]);
      ctx.font = "900 300px sans-serif"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.strokeText(selectedItem, 200, 220);
    }
  };

  useEffect(() => {
    if (mode === 'numbers') { setBrushColor('#FF9F43'); setSelectedItem('1'); }
    else if (mode === 'letters') { setBrushColor('#FF6B6B'); setSelectedItem('A'); }
    initCanvases();
  }, [mode, initCanvases]);

  useEffect(() => {
    initCanvases();
  }, [selectedItem, initCanvases]);

  const handleAssessment = async () => {
    if (!freeCanvasRef.current || !schoolId) return;
    setIsEvaluating(true);
    setFeedback("Magic eyes checking...");
    try {
      const dataUrl = freeCanvasRef.current.toDataURL('image/png');
      
      const result = await assessHandwritingAction({
          imageDataUri: dataUrl,
          targetCharacter: selectedItem,
          schoolId: schoolId,
      });
      
      if (result.success && result.isCorrect) {
        setShowSuccess(true);
        setFeedback('Number Superstar! ⭐');
        confetti();
        speak(`Wonderful! You wrote ${selectedItem} perfectly!`);
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setFeedback('Try once more! 💪');
        speak(`So close! Let's try to trace ${selectedItem} again.`);
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
          {['numbers', 'letters'].map((m: any) => (
            <Button key={m} onClick={() => setMode(m)} variant={mode === m ? 'default' : 'ghost'} className="rounded-2xl font-black uppercase text-xs">
              {m}
            </Button>
          ))}
      </div>

      <Card className={juniorStyles.card}>
        <CardContent className="p-10 space-y-10">
            <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar">
                {(mode === 'letters' ? LETTERS : NUMBERS).map(item => (
                    <button key={item} onClick={() => setSelectedItem(item)} className={`flex-shrink-0 w-14 h-14 rounded-xl font-black text-2xl border-4 transition-all ${ selectedItem === item ? 'bg-purple-500 text-white border-white scale-110 shadow-lg' : 'bg-slate-50 text-slate-400 border-transparent'}`}>{item}</button>
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
                            onMouseDown={(e) => {
                                const ctx = freeCanvasRef.current?.getContext('2d');
                                const rect = freeCanvasRef.current!.getBoundingClientRect();
                                ctx?.beginPath();
                                ctx?.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                                setIsDrawingFree(true);
                            }}
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
                <Button onClick={handleAssessment} disabled={isEvaluating} className="h-14 px-12 bg-black text-white rounded-2xl font-black shadow-xl hover:bg-slate-800">
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

// --- LIFE SKILLS COMPONENTS ---
type LifeSkillTab = 'emotions' | 'routine-songs' | 'modeling' | 'practical-life' | 'communication' | 'social' | 'puppet-theater' | 'cognitive' | 'physical-health';

const TeacherModal: React.FC<{
  title: string; topicValue: string; 
  onTopicChange: (v: string) => void; onGenerate: () => void; 
  isLoading: boolean; onClose: () => void;
}> = ({ title, topicValue, onTopicChange, onGenerate, isLoading, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
    <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-green-100 animate-in zoom-in duration-300">
      <h3 className="text-3xl font-black text-slate-800 mb-6 uppercase tracking-tighter">AI {title}</h3>
      <div className="space-y-6">
        <div>
          <Label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">What should the AI create?</Label>
          <Input 
            value={topicValue} 
            onChange={(e) => onTopicChange(e.target.value)} 
            placeholder="e.g. Being Sad, Sharing Toys, Brushing Teeth" 
            className="h-14 rounded-2xl border-4 border-slate-100 font-bold uppercase" 
          />
        </div>
        <Button 
          onClick={onGenerate} 
          disabled={isLoading || !topicValue} 
          className="w-full h-16 rounded-2xl font-black text-white bg-green-500 hover:bg-green-600 shadow-xl"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2"/> : <Wand2 className="mr-2"/>} CREATE MAGIC
        </Button>
        <button onClick={onClose} className="w-full text-slate-400 uppercase text-[10px] font-black tracking-widest mt-4">Close Drawer</button>
      </div>
    </div>
  </div>
);

function EmotionsModule({ schoolId, canEdit, onSound, onComplete }: { schoolId: string; canEdit: boolean; onSound: (text: string) => void; onComplete: () => void; }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [index, setIndex] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiGenerating, setIsAiGenerating] = useState(false);

    const dataQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_lifeskills_world'), where('schoolId', '==', schoolId), where('category', '==', 'emotions'), orderBy('createdAt', 'asc')) : null, [firestore, schoolId]);
    const { data: items, forceRefetch } = useCollection<any>(dataQuery);
    const current = items?.[index];

    const handleGenerate = async () => {
        if (!firestore || !schoolId || !aiTopic) return;
        setIsAiGenerating(true);
        try {
            const prompt = `Create a nursery lesson for the feeling: ${aiTopic}. Return JSON: { "name": "string", "color": "string (pick from: bg-yellow-400, bg-blue-400, bg-red-400, bg-green-400)", "icon": "emoji", "prompt": "string", "technique": "string" }`;
            const schema = z.object({ name: z.string(), color: z.string(), icon: z.string(), prompt: z.string(), technique: z.string() });
            const result = await generateLifeSkillEntry({ topic: aiTopic, prompt, schema, schoolId });
            if (result.success && result.data) {
                await addDoc(collection(firestore, 'junior_lifeskills_world'), { ...result.data, category: "emotions", schoolId, createdAt: serverTimestamp() });
                setIsDrawerOpen(false); setAiTopic(''); forceRefetch(); toast({ title: "Feeling Created!" });
            } else { throw new Error(result.error || "AI failed"); }
        } catch (e: any) { toast({ variant: "destructive", title: "Magic Failed", description: e.message }); }
        finally { setIsAiGenerating(false); }
    };

    return (
        <div className="relative">
            {canEdit && <Button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 z-10 bg-white border-2 border-yellow-200 text-yellow-600 font-black text-[10px] uppercase hover:bg-yellow-50 shadow-md">AI Maker</Button>}
            {current ? (
                <Card className={`rounded-[60px] border-8 border-yellow-100 shadow-2xl bg-white overflow-hidden`}>
                    <div className={`${current.color} p-10 text-white text-center`}>
                        <h3 className="text-5xl font-black uppercase tracking-tighter">{current.name}</h3>
                    </div>
                    <CardContent className="p-12 flex flex-col items-center gap-8">
                        <div className="text-[150px] animate-bounce">{current.icon}</div>
                        <p className="text-2xl font-bold text-slate-600 text-center">"{current.prompt}"</p>
                        <div className="p-6 bg-yellow-50 rounded-3xl border-2 border-yellow-100">
                            <p className="text-xl font-bold text-slate-700 text-center">When you feel this way, try this: <span className="text-yellow-600">{current.technique}</span></p>
                        </div>
                        <Button onClick={() => { onSound(current.prompt); onComplete(); items && setIndex((index + 1) % items.length) }} className={juniorStyles.button + " bg-yellow-500 hover:bg-yellow-600 shadow-[0_12px_0_#ca8a04]"}>Next Feeling</Button>
                    </CardContent>
                </Card>
            ) : <div className="text-center py-20"><Loader2 className="animate-spin text-yellow-300 h-10 w-10 mx-auto" /><p className="mt-2 text-slate-400">Loading feelings...</p></div>}
            {isDrawerOpen && <TeacherModal title="Emotions" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={handleGenerate} isLoading={isAiGenerating} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
}

function PhysicalHealthModule({ schoolId, canEdit, onSound, onComplete }: { schoolId: string; canEdit: boolean; onSound: (text: string) => void; onComplete: () => void; }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [index, setIndex] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiGenerating, setIsAiGenerating] = useState(false);

    const dataQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_lifeskills_world'), where('schoolId', '==', schoolId), where('category', '==', 'physical-health'), orderBy('createdAt', 'asc')) : null, [firestore, schoolId]);
    const { data: items, forceRefetch } = useCollection<any>(dataQuery);
    const current = items?.[index];

    const handleGenerate = async () => {
        if (!firestore || !schoolId || !aiTopic) return;
        setIsAiGenerating(true);
        try {
            const prompt = `Create a physical activity or hygiene habit for children about: ${aiTopic}. Return JSON: { "title": "string", "action": "string", "icon": "emoji", "prompt": "string" }`;
            const schema = z.object({ title: z.string(), action: z.string(), icon: z.string(), prompt: z.string() });
            const result = await generateLifeSkillEntry({ topic: aiTopic, prompt, schema, schoolId });
            if (result.success && result.data) {
                await addDoc(collection(firestore, 'junior_lifeskills_world'), {
                    ...result.data, category: "physical-health", schoolId, createdAt: serverTimestamp()
                });
                setIsDrawerOpen(false); setAiTopic(''); forceRefetch();
                toast({ title: "Activity Created!" });
            } else { throw new Error(result.error || "AI failed"); }
        } catch (e: any) { toast({ variant: "destructive", title: "Magic Failed", description: e.message }); }
        finally { setIsAiGenerating(false); }
    };
    
    return (
        <div className="relative">
             {canEdit && <Button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 z-10 bg-white border-2 border-green-200 text-green-600 font-black text-[10px] uppercase hover:bg-green-50 shadow-md">AI Maker</Button>}
             {current ? (
                 <Card className="rounded-[60px] border-8 border-green-100 shadow-2xl bg-white overflow-hidden">
                     <CardHeader className="bg-green-500 p-10 text-white text-center"><CardTitle className="text-5xl font-black uppercase tracking-tighter">{current.title}</CardTitle></CardHeader>
                     <CardContent className="p-12 flex flex-col items-center gap-8">
                         <div className="text-[150px]">{current.icon}</div>
                         <p className="text-2xl font-bold text-slate-600 text-center">"{current.prompt}"</p>
                         <Button onClick={() => { onSound(current.action); onComplete(); }} className={juniorStyles.button + " bg-green-600 hover:bg-green-700 shadow-[0_12px_0_#15803d]"}>{current.action}</Button>
                         <Button variant="outline" onClick={() => items && setIndex((index + 1) % items.length)}>Next Activity</Button>
                     </CardContent>
                 </Card>
             ) : <div className="text-center py-20"><Loader2 className="animate-spin text-green-300 h-10 w-10 mx-auto" /><p className="mt-2 text-slate-400">Loading activities...</p></div>}
             {isDrawerOpen && <TeacherModal title="Health" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={handleGenerate} isLoading={isAiGenerating} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
}

function SocialScenariosModule({ schoolId, canEdit, onSound, onComplete }: { schoolId: string; canEdit: boolean; onSound: (text: string) => void; onComplete: () => void; }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [index, setIndex] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

    const dataQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_lifeskills_world'), where('schoolId', '==', schoolId), where('category', '==', 'social'), orderBy('createdAt', 'asc')) : null, [firestore, schoolId]);
    const { data: items, forceRefetch } = useCollection<any>(dataQuery);
    const current = items?.[index];

    const handleAnswer = (selectedIndex: number) => {
        if (selectedIndex === current.correct) {
            setAnswerStatus('correct');
            confetti();
            onComplete();
        } else {
            setAnswerStatus('wrong');
        }
    };
    
    const handleGenerate = async () => {
        if (!firestore || !schoolId || !aiTopic) return;
        setIsAiGenerating(true);
        try {
            const prompt = `Create a kindness or community helper scenario for children about: ${aiTopic}. Return JSON: { "title": "string", "q": "string (the question)", "options": ["string", "string", "string"], "correct": "number (index 0-2)", "prompt": "string" }`;
            const schema = z.object({ title: z.string(), q: z.string(), options: z.array(z.string()).length(3), correct: z.number(), prompt: z.string() });
            const result = await generateLifeSkillEntry({ topic: aiTopic, prompt, schema, schoolId });
            if (result.success && result.data) {
                await addDoc(collection(firestore, 'junior_lifeskills_world'), {
                    ...result.data, category: "social", schoolId, createdAt: serverTimestamp()
                });
                setIsDrawerOpen(false); setAiTopic(''); forceRefetch();
                toast({ title: "Scenario Created!" });
            } else { throw new Error(result.error || "AI failed"); }
        } catch(e: any) { toast({ variant: "destructive", title: "Magic Failed", description: e.message }); }
        finally { setIsAiGenerating(false); }
    };

    return (
        <div className="relative">
            {canEdit && <Button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 z-10 bg-white border-2 border-rose-200 text-rose-600 font-black text-[10px] uppercase hover:bg-rose-50 shadow-md">AI Maker</Button>}
            {current ? (
                <Card className="rounded-[60px] border-8 border-rose-100 shadow-2xl bg-white overflow-hidden">
                    <CardHeader className="bg-rose-500 p-10 text-white text-center"><CardTitle className="text-5xl font-black uppercase tracking-tighter">{current.title}</CardTitle></CardHeader>
                    <CardContent className="p-12 flex flex-col items-center gap-8">
                        <p className="text-3xl font-bold text-slate-800 text-center">"{current.q}"</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                            {current.options.map((opt: string, i: number) => (
                                <button key={i} onClick={() => handleAnswer(i)} disabled={answerStatus !== 'idle'} 
                                    className={`p-8 rounded-[30px] border-4 font-bold text-xl text-center transition-all ${
                                        answerStatus === 'correct' && i === current.correct ? 'bg-green-500 text-white border-white scale-105' :
                                        answerStatus === 'wrong' && i === current.correct ? 'bg-green-500 text-white border-white' :
                                        answerStatus === 'wrong' && i !== current.correct ? 'bg-red-500 text-white border-white' :
                                        'bg-rose-50 text-rose-800 border-rose-100 hover:bg-rose-100'
                                    }`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                        {answerStatus !== 'idle' && (
                            <Button onClick={() => { setAnswerStatus('idle'); items && setIndex((index + 1) % items.length) }}>Next Scenario</Button>
                        )}
                    </CardContent>
                </Card>
            ) : <div className="text-center py-20"><Loader2 className="animate-spin text-rose-300 h-10 w-10 mx-auto" /><p className="mt-2 text-slate-400">Loading scenarios...</p></div>}
            {isDrawerOpen && <TeacherModal title="Social Scenarios" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={handleGenerate} isLoading={isAiGenerating} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
}

function LifeSkillsZone({ schoolId }: { schoolId: string }) {
  const [activeTab, setActiveTab] = useState<LifeSkillTab>('emotions');
  const [stars, setStars] = useState(0);
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');

  const onSound = async (text: string) => {
    if (!text || !schoolId) return;
    try {
        const result = await generateTTSAction({ text, voice: 'Puck', schoolId });
        if (result.success && result.data && typeof window !== 'undefined') {
            const audio = new Audio(`data:audio/wav;base64,${result.data}`);
            audio.play();
        }
    } catch(e) { console.error("TTS failed:", e); }
  };

  const addStar = () => {
    confetti({ particleCount: 100, spread: 70 });
    setStars(prev => prev + 1);
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
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-3xl shadow-xl border-4 border-yellow-100">
           <Star className="w-8 h-8 text-yellow-400 animate-pulse fill-current" />
           <span className="text-3xl font-black text-slate-800">{stars}</span>
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
                  activeTab === tab.id 
                  ? `${tab.color} text-white shadow-xl scale-110 -translate-y-1` 
                  : 'bg-white text-slate-400 border-transparent hover:bg-teal-50'
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
        {activeTab === 'emotions' && <EmotionsModule schoolId={schoolId} canEdit={canEdit} onSound={onSound} onComplete={addStar} />}
        {activeTab === 'physical-health' && <PhysicalHealthModule schoolId={schoolId} canEdit={canEdit} onSound={onSound} onComplete={addStar} />}
        {activeTab === 'social' && <SocialScenariosModule schoolId={schoolId} canEdit={canEdit} onSound={onSound} onComplete={addStar} />}
        {!['emotions', 'physical-health', 'social'].includes(activeTab) && (
            <LifeSkillsModule tab={activeTab} schoolId={schoolId} onSound={onSound} onComplete={addStar} canEdit={canEdit} />
        )}
      </div>
    </div>
  );
}

// --- MAIN CAMPUS PAGE ---
export default function JuniorCampusPage() {
    const { role } = useRole();
    const { schoolId } = useCurrentSchool();
    
    const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');

    if (!schoolId) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin h-8 w-8 text-slate-300"/>
                <p className="ml-4 text-slate-500">Loading school data...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FFFBEB] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-[45px] shadow-xl border-b-[12px] border-yellow-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-400 p-5 rounded-[30px] shadow-inner rotate-3"><Rabbit className="h-12 w-12 text-white" /></div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-800 tracking-tighter">Junior Campus</h1>
                            <p className="text-xl font-bold text-pink-500 uppercase tracking-widest italic">Play, Learn & Grow! ✨</p>
                        </div>
                    </div>
                </header>

                <Tabs defaultValue="lifeskills" className="w-full">
                    <TabsList className="grid w-full grid-cols-8 h-24 bg-white p-2 rounded-[30px] shadow-xl border-2 border-yellow-100 mb-10 overflow-x-auto no-scrollbar">
                        <TabsTrigger value="lifeskills" className="rounded-2xl data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 font-black flex flex-col items-center gap-1"><Heart className="w-5 h-5"/> Life Skills</TabsTrigger>
                        <TabsTrigger value="stories" className="rounded-2xl data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-black flex flex-col items-center gap-1"><BookOpen className="w-5 h-5"/> Stories</TabsTrigger>
                        <TabsTrigger value="writing" className="rounded-2xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-black flex flex-col items-center gap-1"><Pen className="w-5 h-5"/> Writing</TabsTrigger>
                        <TabsTrigger value="math" className="rounded-2xl data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-black flex flex-col items-center gap-1"><Calculator className="w-5 h-5"/> Math</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-2xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black flex flex-col items-center gap-1"><Atom className="w-5 h-5"/> Science</TabsTrigger>
                        <TabsTrigger value="art" className="rounded-2xl data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-black flex flex-col items-center gap-1"><Palette className="w-5 h-5"/> Art</TabsTrigger>
                        <TabsTrigger value="coach" className="rounded-2xl data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 font-black flex flex-col items-center gap-1"><Mic className="w-5 h-5"/> Coach</TabsTrigger>
                        <TabsTrigger value="rewards" className="rounded-2xl data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 font-black flex flex-col items-center gap-1"><Trophy className="w-5 h-5"/> Rewards</TabsTrigger>
                    </TabsList>

                    <div className="min-h-[700px] animate-in slide-in-from-bottom-10 duration-1000">
                        <TabsContent value="lifeskills" className="mt-0"><LifeSkillsZone schoolId={schoolId} /></TabsContent>
                        <TabsContent value="stories" className="mt-0"><StorySpark canEdit={canEdit} schoolId={schoolId} /></TabsContent>
                        <TabsContent value="writing" className="mt-0"><WritingCanvas schoolId={schoolId} /></TabsContent>
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
```
- src/ai/flows/junior-actions.ts
```ts
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { checkAndSpendCredits } from '@/app/actions/credits';

// --- STORY GENERATOR ---
const JuniorStorySchema = z.object({
  title: z.string().describe("A fun, simple title for a short children's story."),
  emojiIcon: z.string().emoji().describe("A single emoji that represents the story."),
  content: z.string().describe("The full story text. It should be simple, positive, and easy for a 5-7 year old to understand."),
  questions: z.array(z.object({
    question: z.string().describe("A simple comprehension question about the story."),
    answer: z.string().describe("A short, one or two-word answer to the question.")
  })).length(3).describe("Exactly three simple questions to check understanding.")
});

export async function generateJuniorStory(topic: string, wordCount: number, schoolId: string) {
  try {
    const creditResult = await checkAndSpendCredits(schoolId, 3);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error || "Insufficient AI credits to generate a story." };
    }

    const prompt = `
      You are a kindergarten teacher. Write an educational story for a 5-year-old about: ${topic}.
      
      RULES:
      1. The story must be engaging and approximately ${wordCount || 100} words long.
      2. Use simple, age-appropriate words.
      3. The output MUST be a JSON object that strictly follows the provided schema.
      4. The 'questions' array must contain exactly 3 comprehension questions about the story.
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: prompt,
      output: {
        schema: JuniorStorySchema
      }
    });

    if (!output) {
      throw new Error("AI did not return a valid story object.");
    }
    
    return { success: true, data: output };
  } catch (error) {
    console.error("Story Generation Error:", error);
    return { success: false, error: "The story robot is sleeping." };
  }
}

// --- SCIENCE FACT GENERATOR ---
const JuniorScienceSchema = z.object({
  title: z.string().describe("The science topic, e.g., 'Volcanoes'."),
  emojiIcon: z.string().emoji().describe("A single relevant emoji."),
  fact: z.string().describe("A single, simple, 'wow' science fact for a 6-year-old."),
  observation: z.string().describe("A one-sentence observation related to the fact. e.g., 'This is why bubbles pop!'"),
  experiment: z.string().describe("A very simple, safe at-home activity. e.g., 'Mix baking soda and vinegar to see bubbles!'"),
});

export async function generateJuniorScience(input: { topic: string; schoolId: string; }) {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 2);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error || "Insufficient AI credits." };
    }

    const prompt = `
      Generate a super simple and fun science 'discovery' for a 6-year-old child about "${input.topic}".
      Provide a title, an emoji, a simple one-sentence 'wow' fact, a related observation, and a very easy, safe home experiment suggestion.
      Output strictly JSON.
    `;
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt,
      output: { schema: JuniorScienceSchema }
    });
    if (!output) throw new Error("AI did not return data.");
    return { success: true, data: output };
  } catch (error) {
    console.error("AI Science Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

// --- WORD DETAILS GENERATION (for Voice Coach) ---
const WordDetailSchema = z.object({
  word: z.string(),
  phonetic: z.string().describe("A simple phonetic spelling, e.g., /kat/"),
  sentence: z.string().describe("A very simple sentence using the word, for a 5-year-old."),
  emoji: z.string().emoji().describe("A single emoji for the word."),
});

export async function generateWordDetails(input: { word: string; schoolId: string; }) {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 1);
    if (!creditResult.success) {
      return { success: false, error: creditResult.error || "Insufficient AI credits." };
    }
    const prompt = `
      For the word "${input.word}", provide:
      1. A simple phonetic spelling (e.g., /kat/).
      2. A very simple sentence a 5-year-old would understand.
      3. A single, relevant emoji.
      Output strictly JSON.
    `;
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt,
      output: { schema: WordDetailSchema }
    });
    if (!output) throw new Error("AI did not return data.");
    return { success: true, data: { ...output, word: input.word } };
  } catch (error) {
    console.error("AI Word Detail Error:", error);
    return { success: false, error: (error as Error).message };
  }
}


// --- TTS HELPER ---
async function toWav(pcmData: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const writer = new wav.Writer({ channels: 1, sampleRate: 24000, bitDepth: 16 });
        const chunks: Buffer[] = [];
        writer.on('data', (chunk) => chunks.push(chunk));
        writer.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
        writer.on('error', reject);
        writer.write(pcmData);
        writer.end();
    });
}

// --- TTS ACTION ---
const TTSInputSchema = z.object({
    text: z.string(),
    voice: z.enum(['Puck', 'Algenib', 'Achernar', 'Enif', 'Kore']),
});

export async function generateTTS(text: string) {
    try {
        const { media } = await ai.generate({
            model: 'googleai/gemini-2.5-flash-preview-tts',
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Achernar' } },
                },
            },
            prompt: text,
        });

        if (!media || !media.url) throw new Error("No audio returned from TTS.");

        const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
        const wavBase64 = await toWav(audioBuffer);
        return wavBase64;
    } catch (error: any) {
        console.error("TTS Generation Error:", error);
        return null;
    }
}


// --- IMAGE GENERATION ACTION ---
export const generateLessonImage = async (prompt: string): Promise<string | null> => {
    try {
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: prompt,
      });
  
      if (media && media.url) {
        return media.url;
      }
      return null;
    } catch (error) {
      console.error("Image generation error:", error);
      return null;
    }
};

// --- HANDWRITING ASSESSMENT ACTION ---
export async function assessHandwritingAction(input: { imageDataUri: string; targetCharacter: string, schoolId: string; }) {
  try {
    const creditResult = await checkAndSpendCredits(input.schoolId, 3);
    if (!creditResult.success) {
      return { success: false, isCorrect: false, error: creditResult.error || "Insufficient AI credits." };
    }
    const prompt = `
      You are an expert in early childhood education.
      Analyze the attached image. The user was trying to write the letter or digit "${input.targetCharacter}".
      Is this a recognizable attempt? Answer only with the word YES or the word NO.
    `;

    const { text } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: [
        { text: prompt },
        { media: { url: input.imageDataUri } },
      ],
      config: { temperature: 0.1 }
    });

    const isYes = text.toUpperCase().includes('YES');
    return { success: true, isCorrect: isYes };

  } catch (error: any) {
    console.error("AI Handwriting Assessment Error:", error);
    return { success: false, isCorrect: false, error: "The AI teacher is busy right now." };
  }
}

// Placeholder for new functions
export async function generateSkillDetails(input: { skill: string; schoolId: string }) { return { success: false, data: null }; }
export async function generateRhyme(input: { topic: string; schoolId: string }) { return { success: false, data: null }; }

