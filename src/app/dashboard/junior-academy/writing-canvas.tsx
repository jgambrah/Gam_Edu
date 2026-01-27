
'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { assessHandwritingAction, generateTTSAction } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Mic, StopCircle, Zap, ShieldCheck, MonitorPlay, Volume2, XCircle, Sparkles, Clock, RefreshCw, User, GripVertical, GripHorizontal, Minus, ChevronUp, ChevronDown, ChevronRight, Circle, Trash2, ThumbsUp, CheckCheck, Wand2, Heart, Hash, PenLine, CaseSensitive, HelpCircle, Grip, PenTool, Pen, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LETTERS, NUMBERS, STROKES } from '@/lib/constants';

const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const props = { className };
    switch (iconName) {
        case 'fa-grip-lines-vertical': return <GripVertical {...props} />;
        case 'fa-grip-lines': return <GripHorizontal {...props} />;
        case 'fa-slash': return <Minus {...props} />;
        case 'fa-chevron-up': return <ChevronUp {...props} />;
        case 'fa-chevron-down': return <ChevronDown {...props} />;
        case 'fa-chevron-left': return <ArrowLeft {...props} />;
        case 'fa-chevron-right': return <ChevronRight {...props} />;
        case 'fa-circle': return <Circle {...props} />;
        case 'fa-trash-can': return <Trash2 {...props} />;
        case 'fa-thumbs-up': return <ThumbsUp {...props} />;
        case 'fa-check-double': return <CheckCheck {...props} />;
        case 'fa-wand-magic-sparkles': return <Wand2 {...props} />;
        case 'fa-heart': return <Heart {...props} />;
        case 'fa-1-9': return <Hash {...props} />;
        case 'fa-font': return <CaseSensitive {...props} />;
        case 'fa-lines-leaning': return <PenLine {...props} />;
        default: return <HelpCircle {...props} />;
    }
};

type PracticeMode = 'letters' | 'strokes' | 'numbers';

const WritingCanvas: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const traceCanvasRef = useRef<HTMLCanvasElement>(null);
  const freeCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<PracticeMode>('numbers');
  const [selectedItem, setSelectedItem] = useState('1');
  const [isDrawingTrace, setIsDrawingTrace] = useState(false);
  const [isDrawingFree, setIsDrawingFree] = useState(false);
  const [brushColor, setBrushColor] = useState('#FF9F43');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const selectedStroke = useMemo(() => STROKES.find(s => s.id === selectedItem), [selectedItem]);
  const selectedLetter = useMemo(() => LETTERS.find(l => l === selectedItem), [selectedItem]);
  const selectedNumber = useMemo(() => NUMBERS.find(n => n === selectedItem), [selectedItem]);

  const initCanvases = useCallback(() => {
    setupCanvas(traceCanvasRef.current, true);
    setupCanvas(freeCanvasRef.current, false);
    setShowSuccess(false);
    setFeedbackMessage('');
  }, [selectedItem, mode]);

  useEffect(() => {
    if (started) {
      if (mode === 'numbers') setBrushColor('#FF9F43');
      else if (mode === 'letters') setBrushColor('#FF6B6B');
      else setBrushColor('#45AAF2');
      initCanvases();
    }
  }, [mode, started, initCanvases]);

  const setupCanvas = (canvas: HTMLCanvasElement | null, isTrace: boolean) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = 400;
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const midY = canvas.height / 2;
    const midX = canvas.width / 2;
    
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(0, midY - 120);
    ctx.lineTo(canvas.width, midY - 120);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, midY + 120);
    ctx.lineTo(canvas.width, midY + 120);
    ctx.stroke();

    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(canvas.width, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    if (isTrace) {
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 8;
      ctx.setLineDash([10, 15]);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (mode === 'letters') {
        ctx.font = '900 350px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(selectedItem, midX, midY + 20);
      } else if (mode === 'numbers') {
        const fontSize = selectedItem === '10' ? 280 : 350;
        ctx.font = `900 ${fontSize}px Fredoka, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(selectedItem, midX, midY + 20);
      } else {
        ctx.beginPath();
        const padding = 100;
        if(selectedStroke){
            switch (selectedStroke.id) {
            case 'standing': ctx.moveTo(midX, midY - padding); ctx.lineTo(midX, midY + padding); break;
            case 'sleeping': ctx.moveTo(midX - padding, midY); ctx.lineTo(midX + padding, midY); break;
            case 'slanting': ctx.moveTo(midX - padding, midY - padding); ctx.lineTo(midX + padding, midY + padding); break;
            case 'curve-up': ctx.arc(midX, midY + padding/2, padding, Math.PI, 0); break;
            case 'curve-down': ctx.arc(midX, midY - padding/2, padding, 0, Math.PI); break;
            case 'curve-left': ctx.arc(midX + padding/2, midY, padding, 0.5 * Math.PI, 1.5 * Math.PI); break;
            case 'curve-right': ctx.arc(midX - padding/2, midY, padding, 1.5 * Math.PI, 0.5 * Math.PI); break;
            case 'circle': ctx.arc(midX, midY, padding, 0, Math.PI * 2); break;
            }
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
  };

  const getPos = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e: any, canvasRef: React.RefObject<HTMLCanvasElement | null>, setDrawing: (v: boolean) => void) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setDrawing(true);
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = brushColor;
  };

  const draw = (e: any, canvasRef: React.RefObject<HTMLCanvasElement | null>, isDrawing: boolean) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const playFeedbackSound = async (text: string) => {
    if (!schoolId) return;
    try {
      const result = await generateTTSAction({ text, voice: 'Kore', schoolId });
      if (result.success && result.data && typeof window !== 'undefined') {
          const audio = new Audio(`data:audio/wav;base64,${result.data}`);
          audio.play();
      }
    } catch (e) {
      console.error("Audio playback error:", e);
    }
  };

  const clearAll = () => {
    initCanvases();
  };

  const playEncouragement = () => {
    playFeedbackSound("Yes! Great job! Keep going!");
  };

  const handleFinish = async () => {
    if (!freeCanvasRef.current || !schoolId) return;
    
    setIsEvaluating(true);
    setFeedbackMessage('Magic checking...');
    
    try {
      const canvas = freeCanvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      
      let target = '';
      if (mode === 'letters') target = `letter ${selectedLetter}`;
      else if (mode === 'numbers') target = `number ${selectedNumber}`;
      else target = STROKES.find(s => s.id === selectedStroke?.id)?.label || 'stroke';

      const result = await assessHandwritingAction({ imageDataUri: dataUrl, targetCharacter: target, schoolId: schoolId });

      if (result.success && result.isCorrect) {
        setShowSuccess(true);
        setFeedbackMessage('You are a star!');
        confetti();
        await playFeedbackSound(`Wow! You wrote the ${target} perfectly! You are a writing superstar!`);
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setFeedbackMessage('So close! Try once more.');
        await playFeedbackSound(`Almost there! Let's try to trace the ${target} one more time. You can do it!`);
      }
    } catch(e: any) {
      setFeedbackMessage("The AI teacher is resting. Try again soon!");
    } finally {
      setIsEvaluating(false);
    }
  };
  
  if (!started) {
    return (
         <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
            <Pen className="h-16 w-16 mx-auto text-purple-300 mb-4"/>
            <h3 className="text-2xl font-bold text-purple-600 mb-2">Writing Practice</h3>
            <p className="text-slate-500 mb-4">Let's learn to write letters, numbers, and strokes!</p>
            <Button onClick={() => setStarted(true)} className="bg-purple-500 hover:bg-purple-600">Start Writing</Button>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-6xl mx-auto space-y-6 relative font-black">
      {showSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
          <div className="bg-white/95 backdrop-blur-xl p-16 rounded-[4rem] shadow-[0_0_100px_rgba(255,159,67,0.3)] border-8 border-orange-400 flex flex-col items-center animate-in zoom-in duration-500">
            <Wand2 className="text-[10rem] text-yellow-400 animate-bounce mb-8"/>
            <h2 className="text-6xl font-black text-orange-600 mb-4 tracking-tighter uppercase">MAGICAL!</h2>
            <p className="text-2xl font-bold text-orange-400 uppercase tracking-widest">Writing Superstar</p>
            <div className="mt-8 flex gap-4">
              {[1,2,3,4,5].map(i => <Heart key={i} className="text-4xl text-pink-400 animate-pulse" style={{animationDelay: `${i*0.2}s`}}/>)}
            </div>
          </div>
        </div>
      )}

      <div className={cn(
          "w-full bg-white p-4 rounded-[2.5rem] shadow-xl border-4 transition-colors duration-500",
          mode === 'letters' ? 'border-pink-100' : 
          mode === 'numbers' ? 'border-orange-100' : 
          'border-blue-100'
      )}>
        <Tabs value={mode} onValueChange={(v) => setMode(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="numbers">Numbers</TabsTrigger>
                    <TabsTrigger value="letters">Letters</TabsTrigger>
                    <TabsTrigger value="strokes">Strokes</TabsTrigger>
                </TabsList>
                <div className="flex gap-2 mb-4 overflow-x-auto w-full no-scrollbar font-black">
                    {mode === 'letters' ? 
                        (LETTERS.map(l => (<Button key={l} variant={selectedItem === l ? "default" : "outline"} onClick={() => setSelectedItem(l)} className="flex-shrink-0 w-12 h-12 rounded-xl font-black">{l}</Button>))) : 
                    mode === 'numbers' ? 
                        (NUMBERS.map(n => (<Button key={n} variant={selectedItem === n ? "default" : "outline"} onClick={() => setSelectedItem(n)} className="flex-shrink-0 w-12 h-12 rounded-xl font-black">{n}</Button>))) :
                        (STROKES.map(s => (<Button key={s.id} variant={selectedItem === s.id ? "default" : "outline"} onClick={() => setSelectedItem(s.id)} className="flex-shrink-0 w-16 h-12 rounded-xl font-black"><IconRenderer iconName={s.icon} /></Button>)))
                    }
                </div>
            </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="flex flex-col gap-4 group">
          <div className="flex items-center justify-between px-6"><h3 className={cn(`text-2xl font-black flex items-center gap-3 uppercase tracking-tighter transition-colors`, mode === 'letters' ? 'text-pink-600' : mode === 'numbers' ? 'text-orange-600' : 'text-blue-600')}><span className={cn(`w-10 h-10 text-white rounded-full flex items-center justify-center text-lg shadow-md`, mode === 'letters' ? 'bg-pink-600' : mode === 'numbers' ? 'bg-orange-600' : 'bg-blue-600')}>1</span>Trace the Guide</h3></div>
          <div className={cn(`relative bg-white border-8 rounded-[3.5rem] shadow-2xl overflow-hidden cursor-crosshair h-[400px] transition-all group-hover:border-white`, mode === 'letters' ? 'border-pink-50' : mode === 'numbers' ? 'border-orange-50' : 'border-blue-50')}><canvas ref={traceCanvasRef} onMouseDown={(e) => startDrawing(e, traceCanvasRef, setIsDrawingTrace)} onMouseMove={(e) => draw(e, traceCanvasRef, isDrawingTrace)} onMouseUp={() => setIsDrawingTrace(false)} onMouseLeave={() => setIsDrawingTrace(false)} onTouchStart={(e) => startDrawing(e, traceCanvasRef, setIsDrawingTrace)} onTouchMove={(e) => draw(e, traceCanvasRef, isDrawingTrace)} onTouchEnd={() => setIsDrawingTrace(false)} className="w-full h-full"/></div>
        </div>
        <div className="flex flex-col gap-4 relative group">
          <div className="flex items-center justify-between px-6"><h3 className={cn(`text-2xl font-black flex items-center gap-3 uppercase tracking-tighter transition-colors`, mode === 'letters' ? 'text-blue-600' : mode === 'numbers' ? 'text-pink-600' : 'text-orange-600')}><span className={cn(`w-10 h-10 text-white rounded-full flex items-center justify-center text-lg shadow-md`, mode === 'letters' ? 'bg-blue-600' : mode === 'numbers' ? 'bg-pink-600' : 'bg-orange-600')}>2</span>Draw Your Own!</h3></div>
          <div className={cn(`relative bg-white border-8 rounded-[3.5rem] shadow-2xl overflow-hidden cursor-crosshair h-[400px] transition-all group-hover:border-white`, mode === 'letters' ? 'border-blue-50' : mode === 'numbers' ? 'border-pink-50' : 'border-orange-50')}>
            <canvas ref={freeCanvasRef} onMouseDown={(e) => startDrawing(e, freeCanvasRef, setIsDrawingFree)} onMouseMove={(e) => draw(e, freeCanvasRef, isDrawingFree)} onMouseUp={() => setIsDrawingFree(false)} onMouseLeave={() => setIsDrawingFree(false)} onTouchStart={(e) => startDrawing(e, freeCanvasRef, setIsDrawingFree)} onTouchMove={(e) => draw(e, freeCanvasRef, isDrawingFree)} onTouchEnd={() => setIsDrawingFree(false)} className="w-full h-full"/>
            {isEvaluating && (<div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[3rem] animate-pulse"><Loader2 className="w-12 h-12 animate-spin text-purple-600"/></div>)}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-6 bg-white px-12 py-7 rounded-[3rem] shadow-2xl border-4 border-gray-100 max-w-full">
        <div className="flex gap-3">
          {['#FF6B6B', '#FF9F43', '#FFE66D', '#4ECDC4', '#45AAF2', '#A55EEA', '#000000'].map(c => (<button key={c} onClick={() => setBrushColor(c)} style={{ backgroundColor: c }} className={`w-11 h-11 rounded-full border-4 transition-all ${brushColor === c ? 'border-black scale-125 shadow-lg' : 'border-white hover:scale-110'}`}/>))}
        </div>
        
        <div className="h-10 w-px bg-gray-200 hidden sm:block" />

        <div className="flex gap-4">
          <Button onClick={clearAll} variant="outline" className="px-8 py-3 rounded-2xl font-black text-slate-800 hover:bg-slate-200 transition-all flex items-center gap-2 uppercase text-xs tracking-widest border border-slate-200">
            <IconRenderer iconName="fa-trash-can"/> Start Over
          </Button>

          <Button onClick={playEncouragement} className="px-8 py-3 bg-yellow-400 text-black font-black rounded-2xl hover:bg-yellow-500 transition-all flex items-center gap-2 uppercase text-xs tracking-widest shadow-md border border-yellow-500">
            <IconRenderer iconName="fa-thumbs-up"/> I'm Ready!
          </Button>

          <Button onClick={handleFinish} disabled={isEvaluating} className={`px-12 py-3 ${isEvaluating ? 'bg-gray-400' : 'bg-black'} text-white font-black rounded-2xl shadow-xl hover:translate-y-[2px] active:translate-y-[6px] active:shadow-none transition-all flex items-center gap-3 uppercase text-sm tracking-widest`}>
            {isEvaluating ? (
              <><Loader2 className="animate-spin mr-2"/> Magical Check...</>
            ) : (
              <><IconRenderer iconName="fa-check-double"/> Check My Work!</>
            )}
          </Button>
        </div>
      </div>
      
      {feedbackMessage && !showSuccess && (
        <Badge className="bg-white text-black text-xl p-4 rounded-2xl border-4 border-slate-100 shadow-lg animate-bounce uppercase text-xs tracking-widest flex items-center gap-3">
            <Wand2 className="text-purple-500"/>{feedbackMessage}
        </Badge>
      )}
      
      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default WritingCanvas;
