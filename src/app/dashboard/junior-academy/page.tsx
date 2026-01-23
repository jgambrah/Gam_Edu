
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, 
  Trophy, Gift, Check, CheckCircle2, XCircle, PenTool, Eraser, Database, Pencil, Pen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateWordDetails, generateTTSAction, assessHandwritingAction } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import PhonicsWorld from './phonics-world';
import { VoiceCoach, StorySpark } from './voice-coach';
import ArtStudio from './art-studio';
import JuniorScienceWorld from './science-world';
import MathPlayground from './math-playground';
import StickerBook from './sticker-book';
import { useCurrentSchool } from '@/hooks/use-current-school';

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
  const { schoolId } = useCurrentSchool();
  const traceCanvasRef = useRef<HTMLCanvasElement>(null);
  const freeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<'letters' | 'strokes' | 'numbers'>('numbers');
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [selectedNumber, setSelectedNumber] = useState('1');
  const [selectedStroke, setSelectedStroke] = useState('standing');
  const [isDrawingFree, setIsDrawingFree] = useState(false);
  const [brushColor, setBrushColor] = useState('#FF9F43');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (mode === 'numbers') setBrushColor('#FF9F43');
    else if (mode === 'letters') setBrushColor('#FF6B6B');
    else setBrushColor('#45AAF2');
    initCanvases();
  }, [selectedLetter, selectedNumber, selectedStroke, mode]);

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
      const text = mode === 'letters' ? selectedLetter : mode === 'numbers' ? selectedNumber : '|';
      ctx.strokeText(text, 200, 220);
    }
  };
  
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

  const handleAssessment = async () => {
    if (!freeCanvasRef.current || !schoolId) return;
    setIsEvaluating(true);
    setFeedback("Magic eyes checking...");
    try {
      const imageDataUri = freeCanvasRef.current.toDataURL('image/png');
      const target = mode === 'letters' ? selectedLetter : selectedNumber;
      
      const result = await assessHandwritingAction({ imageDataUri, targetCharacter: target, schoolId });
      
      if(result.success) {
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
      } else {
          throw new Error(result.error || "AI Assessment failed");
      }
    } catch (e: any) { 
        console.error(e);
        setFeedback('Magic is sleeping...'); 
    }
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
                    <button key={item} onClick={() => mode === 'letters' ? setSelectedLetter(item) : setSelectedNumber(item)} className={`flex-shrink-0 w-14 h-14 rounded-xl font-black text-2xl border-4 transition-all ${ (mode === 'letters' ? selectedLetter : selectedNumber) === item ? 'bg-purple-500 text-white border-white scale-110 shadow-lg' : 'bg-slate-50 text-slate-400'}`}>{item}</button>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4 text-center">
                    <p className="text-slate-400 font-bold uppercase text-xs flex items-center justify-center gap-2"><span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">1</span> Trace the Guide</p>
                    <div className="bg-white border-4 border-slate-100 rounded-[3rem] shadow-inner overflow-hidden">
                        <canvas ref={traceCanvasRef} className="w-full aspect-square opacity-50" />
                    </div>
                </div>
                <div className="space-y-4 text-center">
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
                                if (!isDrawingFree) return;
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


export default function JuniorCampusPage() {
    const { role, profile } = useRole();
    const { user } = useUser();
    const schoolId = profile?.schoolId || (user as any)?.schoolId || "sunnyside-default";
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');

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
                </header>

                <Tabs defaultValue="writing" className="w-full">
                    <TabsList className="grid w-full grid-cols-7 h-24 bg-white p-2 rounded-[30px] shadow-xl border-2 border-yellow-100 mb-10 overflow-x-auto no-scrollbar">
                        <TabsTrigger value="writing" className="rounded-2xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-black flex flex-col items-center gap-1"><Pen className="w-5 h-5"/> Writing</TabsTrigger>
                        <TabsTrigger value="stories" className="rounded-2xl data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-black flex flex-col items-center gap-1"><BookOpen className="w-5 h-5"/> Stories</TabsTrigger>
                        <TabsTrigger value="math" className="rounded-2xl data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-black flex flex-col items-center gap-1"><Calculator className="w-5 h-5"/> Math</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-2xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black flex flex-col items-center gap-1"><Atom className="w-5 h-5"/> Science</TabsTrigger>
                        <TabsTrigger value="art" className="rounded-2xl data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-black flex flex-col items-center gap-1"><Palette className="w-5 h-5"/> Art</TabsTrigger>
                        <TabsTrigger value="coach" className="rounded-2xl data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 font-black flex flex-col items-center gap-1"><Mic className="w-5 h-5"/> Coach</TabsTrigger>
                        <TabsTrigger value="rewards" className="rounded-2xl data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 font-black flex flex-col items-center gap-1"><Trophy className="w-5 h-5"/> Rewards</TabsTrigger>
                    </TabsList>

                    <div className="min-h-[700px] animate-in slide-in-from-bottom-10 duration-1000">
                        <TabsContent value="writing" className="mt-0"><WritingCanvas /></TabsContent>
                        <TabsContent value="stories" className="mt-0"><StorySpark canEdit={canEdit} schoolId={schoolId} /></TabsContent>
                        <TabsContent value="math" className="mt-0"><MathPlayground schoolId={schoolId} /></TabsContent>
                        <TabsContent value="science" className="mt-0">{schoolId && <JuniorScienceWorld schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="art" className="mt-0"><div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300">{schoolId && <ArtStudio schoolId={schoolId} />}</div></TabsContent>
                        <TabsContent value="phonics" className="mt-0">{schoolId && <PhonicsWorld schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="rewards" className="mt-0">{schoolId && <StickerBook schoolId={schoolId} />}</TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

// ... Ensure all sub-components like MathPlayground, StorySpark, etc are defined as per previous SaaS versions ...
