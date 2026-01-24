
'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { assessHandwritingAction, generateTTSAction } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Mic, StopCircle, Zap, ShieldCheck, MonitorPlay, Volume2, XCircle, Sparkles, Clock, RefreshCw, User, GripVertical, GripHorizontal, Minus, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Circle, Trash2, ThumbsUp, CheckCheck, Wand2, Heart, Hash, PenLine, CaseSensitive, HelpCircle, Grip, PenNib } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Input } from '@/components/ui/input';

const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const props = { className };
    switch (iconName) {
        case 'fa-grip-lines-vertical': return <GripVertical {...props} />;
        case 'fa-grip-lines': return <GripHorizontal {...props} />;
        case 'fa-slash': return <Minus {...props} />;
        case 'fa-chevron-up': return <ChevronUp {...props} />;
        case 'fa-chevron-down': return <ChevronDown {...props} />;
        case 'fa-chevron-left': return <ChevronLeft {...props} />;
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

const STROKES = [
  { id: 'standing', label: 'Standing Line', icon: 'fa-grip-lines-vertical' },
  { id: 'sleeping', label: 'Sleeping Line', icon: 'fa-grip-lines' },
  { id: 'slanting', label: 'Slanting Line', icon: 'fa-slash' },
  { id: 'curve-up', label: 'Curve Up', icon: 'fa-chevron-up' },
  { id: 'curve-down', label: 'Curve Down', icon: 'fa-chevron-down' },
  { id: 'curve-left', label: 'Curve Left', icon: 'fa-chevron-left' },
  { id: 'curve-right', label: 'Curve Right', icon: 'fa-chevron-right' },
  { id: 'circle', label: 'Circle', icon: 'fa-circle' },
];

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

type PracticeMode = 'letters' | 'strokes' | 'numbers';

const WritingCanvas: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const traceCanvasRef = useRef<HTMLCanvasElement>(null);
  const freeCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<PracticeMode>('numbers');
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [selectedNumber, setSelectedNumber] = useState('1');
  const [selectedStroke, setSelectedStroke] = useState(STROKES[0].id);
  const [isDrawingTrace, setIsDrawingTrace] = useState(false);
  const [isDrawingFree, setIsDrawingFree] = useState(false);
  const [brushColor, setBrushColor] = useState('#FF9F43');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const initCanvases = useCallback(() => {
    setupCanvas(traceCanvasRef.current, true);
    setupCanvas(freeCanvasRef.current, false);
    setShowSuccess(false);
    setFeedbackMessage('');
  }, [selectedLetter, selectedNumber, selectedStroke, mode]);

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
        ctx.strokeText(selectedLetter, midX, midY + 20);
      } else if (mode === 'numbers') {
        const fontSize = selectedNumber === '10' ? 280 : 350;
        ctx.font = `900 ${fontSize}px Fredoka, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(selectedNumber, midX, midY + 20);
      } else {
        ctx.beginPath();
        const padding = 100;
        switch (selectedStroke) {
          case 'standing': ctx.moveTo(midX, midY - padding); ctx.lineTo(midX, midY + padding); break;
          case 'sleeping': ctx.moveTo(midX - padding, midY); ctx.lineTo(midX + padding, midY); break;
          case 'slanting': ctx.moveTo(midX - padding, midY - padding); ctx.lineTo(midX + padding, midY + padding); break;
          case 'curve-up': ctx.arc(midX, midY + padding/2, padding, Math.PI, 0); break;
          case 'curve-down': ctx.arc(midX, midY - padding/2, padding, 0, Math.PI); break;
          case 'curve-left': ctx.arc(midX + padding/2, midY, padding, 0.5 * Math.PI, 1.5 * Math.PI); break;
          case 'curve-right': ctx.arc(midX - padding/2, midY, padding, 1.5 * Math.PI, 0.5 * Math.PI); break;
          case 'circle': ctx.arc(midX, midY, padding, 0, Math.PI * 2); break;
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
      else target = STROKES.find(s => s.id === selectedStroke)?.label || 'stroke';

      const result = await assessHandwritingAction({ imageDataUri: dataUrl, targetCharacter: target, schoolId });

      if (result.success && result.isCorrect) {
        setShowSuccess(true);
        setFeedbackMessage('You are a star!');
        await playFeedbackSound(`Wow! You wrote the ${target} perfectly! You are a writing superstar!`);
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setFeedbackMessage('So close! Try once more.');
        await playFeedbackSound(`Almost there! Let's try to trace the ${target} one more time. You can do it!`);
      }
    } catch (error) {
      console.error(error);
      setFeedbackMessage('The magic is sleeping.');
    } finally {
      setIsEvaluating(false);
    }
  };
  
  if (!started) {
      return (
           <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
              <PenNib className="h-16 w-16 mx-auto text-purple-300 mb-4"/>
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

      <div className="flex bg-white p-2 rounded-3xl shadow-xl border-4 border-gray-50 flex-wrap justify-center gap-2">
        <button onClick={() => setMode('numbers')} className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${mode === 'numbers' ? 'bg-orange-500 text-white shadow-lg scale-105' : 'text-slate-900 hover:bg-orange-50'}`}><IconRenderer iconName="fa-1-9" className="mr-2"/> Numbers 1-10</button>
        <button onClick={() => setMode('letters')} className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${mode === 'letters' ? 'bg-pink-500 text-white shadow-lg scale-105' : 'text-slate-900 hover:bg-pink-50'}`}><IconRenderer iconName="fa-font" className="mr-2"/> Letters A-Z</button>
        <button onClick={() => setMode('strokes')} className={`px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${mode === 'strokes' ? 'bg-blue-500 text-white shadow-lg scale-105' : 'text-slate-900 hover:bg-blue-50'}`}><IconRenderer iconName="fa-lines-leaning" className="mr-2"/> Strokes</button>
      </div>

      <div className={`w-full bg-white p-4 rounded-[2.5rem] shadow-xl border-4 transition-colors duration-500 ${mode === 'letters' ? 'border-pink-100' : mode === 'numbers' ? 'border-orange-100' : 'border-blue-100'}`}>
        <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar px-4">
          {mode === 'letters' && LETTERS.map(l => <button key={l} onClick={() => setSelectedLetter(l)} className={`flex-shrink-0 w-16 h-16 rounded-2xl font-black text-2xl flex items-center justify-center transition-all ${selectedLetter === l ? 'bg-pink-500 text-white scale-110 shadow-lg' : 'bg-pink-50 text-pink-300 hover:bg-pink-100'}`}>{l}</button>)}
          {mode === 'numbers' && NUMBERS.map(n => <button key={n} onClick={() => setSelectedNumber(n)} className={`flex-shrink-0 w-16 h-16 rounded-2xl font-black text-2xl flex items-center justify-center transition-all ${selectedNumber === n ? 'bg-orange-500 text-white scale-110 shadow-lg' : 'bg-orange-50 text-orange-400 hover:bg-orange-100'}`}>{n}</button>)}
          {mode === 'strokes' && STROKES.map(s => <button key={s.id} onClick={() => setSelectedStroke(s.id)} className={`flex-shrink-0 px-6 h-16 rounded-2xl font-black flex items-center gap-3 transition-all ${selectedStroke === s.id ? 'bg-blue-500 text-white scale-105 shadow-lg' : 'bg-blue-50 text-blue-300 hover:bg-blue-100'}`}><IconRenderer iconName={s.icon} className="text-2xl" /><span className="whitespace-nowrap uppercase text-[10px] tracking-widest">{s.label}</span></button>)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="flex flex-col gap-4 group">
          <div className="flex items-center justify-between px-6"><h3 className={`text-2xl font-black flex items-center gap-3 uppercase tracking-tighter transition-colors ${mode === 'letters' ? 'text-pink-600' : mode === 'numbers' ? 'text-orange-600' : 'text-blue-600'}`}><span className={`w-10 h-10 ${mode === 'letters' ? 'bg-pink-600' : mode === 'numbers' ? 'bg-orange-600' : 'bg-blue-600'} text-white rounded-full flex items-center justify-center text-lg shadow-md`}>1</span>Trace the Guide</h3></div>
          <div className={`relative bg-white border-8 ${mode === 'letters' ? 'border-pink-50' : mode === 'numbers' ? 'border-orange-50' : 'border-blue-50'} rounded-[3.5rem] shadow-2xl overflow-hidden cursor-crosshair h-[400px] transition-all group-hover:border-white`}><canvas ref={traceCanvasRef} onMouseDown={(e) => startDrawing(e, traceCanvasRef, setIsDrawingTrace)} onMouseMove={(e) => draw(e, traceCanvasRef, isDrawingTrace)} onMouseUp={() => setIsDrawingTrace(false)} onMouseLeave={() => setIsDrawingTrace(false)} onTouchStart={(e) => startDrawing(e, traceCanvasRef, setIsDrawingTrace)} onTouchMove={(e) => draw(e, traceCanvasRef, isDrawingTrace)} onTouchEnd={() => setIsDrawingTrace(false)} className="w-full h-full"/></div>
        </div>
        <div className="flex flex-col gap-4 relative group">
          <div className="flex items-center justify-between px-6"><h3 className={`text-2xl font-black flex items-center gap-3 uppercase tracking-tighter transition-colors ${mode === 'letters' ? 'text-blue-600' : mode === 'numbers' ? 'text-pink-600' : 'text-orange-600'}`}><span className={`w-10 h-10 ${mode === 'letters' ? 'bg-blue-600' : mode === 'numbers' ? 'bg-pink-600' : 'bg-orange-600'} text-white rounded-full flex items-center justify-center text-lg shadow-md`}>2</span>Draw Your Own!</h3></div>
          <div className={`relative bg-white border-8 ${mode === 'letters' ? 'border-blue-50' : mode === 'numbers' ? 'border-pink-50' : 'border-orange-50'} rounded-[3.5rem] shadow-2xl overflow-hidden cursor-crosshair h-[400px] transition-all group-hover:border-white`}>
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
          <Button onClick={initCanvases} variant="outline" className="px-8 py-3 rounded-2xl font-black text-slate-800 hover:bg-slate-200 transition-all flex items-center gap-2 uppercase text-xs tracking-widest border border-slate-200">
            <IconRenderer iconName="fa-trash-can"/> Start Over
          </Button>

          <Button onClick={() => onSound("You are doing great! Keep going!")} className="px-8 py-3 bg-yellow-400 text-black font-black rounded-2xl hover:bg-yellow-500 transition-all flex items-center gap-2 uppercase text-xs tracking-widest shadow-md border border-yellow-500">
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
        @font-face {
          font-family: 'Fredoka';
          src: url('/fonts/FredokaOne-Regular.ttf') format('truetype');
          font-weight: 900;
          font-style: normal;
        }
      `}</style>
    </div>
  );
};

export default WritingCanvas;
