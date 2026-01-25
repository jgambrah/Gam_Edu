'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as constants from '@/lib/constants';
import { 
    generateLessonImageAction, 
    generateTTSAction, 
    generateMathWorldEntry 
} from '@/ai/flows/junior-actions';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { 
    Loader2, Wand2, ArrowLeft, ArrowRight, Volume2, Play, Smile, Sparkles, HelpCircle, Hash, ListOrdered, Scale, 
    CaseSensitive, Handshake, Plus, Minus, Layers, ObjectGroup, Clock, Coins, Ruler, Shapes, Move, CheckSquare, ArrowLeftRight, PenTool, BrainCircuit, Calculator, Apple, Star, Heart, Car, Zap, Cookie, Rabbit, Carrot, PenLine, GripVertical, GripHorizontal, ChevronUp, ChevronDown, Circle, Trash2, ThumbsUp, CheckCheck
} from 'lucide-react';


// --- ROBUST ICON RENDERER ---
const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'fa-1': Hash, 'fa-list-ol': ListOrdered, 'fa-arrow-right-long': ArrowRight, 'fa-scale-unbalanced': Scale, 'fa-font': CaseSensitive, 
      'fa-handshake': Handshake, 'fa-plus': Plus, 'fa-minus': Minus, 'fa-layer-group': Layers, 'fa-object-group': ObjectGroup, 
      'fa-clock': Clock, 'fa-coins': Coins, 'fa-ruler-vertical': Ruler, 'fa-shapes': Shapes, 'fa-arrows-up-down-left-right': Move, 
      'fa-scale-balanced': Scale, 'fa-square-check': CheckSquare, 'fa-arrows-left-right': ArrowLeftRight, 'fa-pen-clip': PenTool,
      'fa-magic': Wand2, 'fa-spinner': Loader2, 'fa-volume-high': Volume2, 'fa-play': Play, 'fa-face-smile': Smile, 'fa-brain': BrainCircuit,
      'fa-apple-whole': Apple, 'fa-star': Star, 'fa-heart': Heart, 'fa-car': Car, 'fa-bolt': Zap, 'fa-cookie': Cookie, 'fa-rabbit': Rabbit,
      'fa-carrot': Carrot, 'fa-lines-leaning': PenLine, 'fa-grip-lines-vertical': GripVertical, 'fa-grip-lines': GripHorizontal,
      'fa-chevron-up': ChevronUp, 'fa-chevron-down': ChevronDown, 'fa-circle': Circle, 'fa-trash-can': Trash2, 'fa-thumbs-up': ThumbsUp,
      'fa-check-double': CheckCheck,
    };
    const IconComponent = iconMap[iconName] || HelpCircle;
    return <IconComponent className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} />;
};

type NumeracyTab = 'numbers' | 'counting' | 'sequence' | 'comparing' | 'number-words' | 'bonds' | 'addition' | 'subtraction' | 'tens-units' | 'tracing';

// --- SHARED COMPONENTS ---
const ModuleContainer: React.FC<{ title: string; children: React.ReactNode; icon: string }> = ({ title, children, icon }) => {
    const [started, setStarted] = useState(false);
    if (!started) return (
        <div className="text-center p-12 bg-white rounded-[3rem] shadow-xl border-8 border-purple-50 animate-in fade-in zoom-in">
            <IconRenderer iconName={icon} className="h-20 w-20 mx-auto text-purple-300 mb-6" />
            <h3 className="text-4xl font-black text-purple-600 mb-4 uppercase tracking-tighter">{title}</h3>
            <p className="text-slate-500 mb-8 font-bold">Are you ready to learn and play?</p>
            <Button onClick={() => setStarted(true)} size="lg" className="bg-purple-500 hover:bg-purple-600 text-white font-black px-12 py-8 rounded-2xl text-2xl shadow-2xl hover:scale-105 transition-all">START ACTIVITY</Button>
        </div>
    );
    return (
        <div className="relative">
            <Button variant="ghost" onClick={() => setStarted(false)} className="absolute -top-16 left-0 text-slate-400 hover:text-purple-500 font-black uppercase text-xs tracking-widest"><ArrowLeft className="mr-2 h-4 w-4"/> Close Activity</Button>
            {children}
        </div>
    );
};

const TeacherModal: React.FC<{ title: string; topicLabel: string; topicValue: string; onTopicChange: (v: string) => void; onGenerate: () => void; isLoading: boolean; onClose: () => void; }> = ({ title, topicLabel, topicValue, onTopicChange, onGenerate, isLoading, onClose }) => (
    <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="rounded-[3rem] border-8 border-purple-100">
            <DialogHeader><DialogTitle className="text-3xl font-black uppercase tracking-tighter">{title}</DialogTitle></DialogHeader>
            <div className="space-y-6 py-4">
                <div>
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">{topicLabel}</Label>
                    <Input type="text" value={topicValue} onChange={(e) => onTopicChange(e.target.value)} placeholder="Type here..." className="mt-2 h-14 rounded-2xl border-4 border-slate-50 font-black" />
                </div>
                <Button onClick={onGenerate} disabled={isLoading || !topicValue} className="w-full h-16 rounded-2xl bg-purple-500 hover:bg-purple-600 font-black text-xl shadow-xl">
                    {isLoading ? <><Loader2 className="animate-spin mr-2"/> GENERATING...</> : <><Sparkles className="mr-2 h-6 w-6"/> CREATE MAGIC</>}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
);

/* --- 1. NUMBERS (Recognition) --- */
const NumbersMainModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.NUMERACY_DATA.numbers);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const current = data[index];
    const fetchVisual = useCallback(async () => { 
        if (!schoolId || !current) return; setLoading(true); 
        const res = await generateLessonImageAction({ prompt: current.prompt, schoolId }); 
        if(res.success) setImageUrl(res.data || null); setLoading(false); 
    }, [current, schoolId]);
    useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
    const handleLearn = () => onSound(`This is number ${current.value}. Let's count!`);
  
    const generateWithAi = async () => {
      if (!aiTopic || !schoolId) return; setIsAiLoading(true);
      const result = await generateMathWorldEntry(aiTopic, 'numbers', schoolId);
      if(result.success && result.data) { setData(prev => prev.map((item, i) => i === index ? { ...item, ...result.data } : item)); setIsDrawerOpen(false); setAiTopic(''); }
      setIsAiLoading(false);
    };
  
    return (
      <div className="relative font-black">
        <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute -top-12 right-0 rounded-full border-2 border-purple-200 text-purple-500 font-black uppercase text-[10px] tracking-widest z-10"><Wand2 className="h-3 w-3 mr-1"/> Custom Theme</Button>
        <div className="w-full flex flex-col items-center bg-white p-10 rounded-[4rem] shadow-2xl border-8 border-purple-100 animate-in zoom-in min-h-[550px]">
          <h2 className="text-9xl font-black text-purple-600 mb-2 drop-shadow-xl">{current.value}</h2>
          <p className="text-3xl font-black text-slate-500 italic mb-10">{current.word || current.value}</p>
          <div onClick={handleLearn} className="w-80 h-80 bg-purple-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
            {loading ? <Loader2 className="w-16 h-16 animate-spin text-purple-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all" alt={`Number ${current.value}`} />}
          </div>
          <div className="flex gap-6">
            <Button size="icon" onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 shadow-md font-black"><ArrowLeft className="text-2xl" /></Button>
            <Button onClick={handleLearn} className="px-16 h-16 bg-purple-500 text-white font-black rounded-2xl shadow-xl uppercase border-4 border-white hover:scale-105 transition-all font-black">Learn</Button>
            <Button size="icon" onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 shadow-md font-black"><ArrowRight className="text-2xl" /></Button>
          </div>
        </div>
        {isDrawerOpen && <TeacherModal title="Change Number Theme" topicLabel="New Topic" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};
  
/* --- 4. NUMBER COMPARISON (Greater/Less) --- */
const NumberComparisonModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data] = useState(constants.NUMERACY_DATA.numComparison || []);
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const current = data[index];
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center min-h-[550px]">
        <h3 className="text-4xl font-black text-orange-600 mb-10 uppercase text-center">{current.q}</h3>
        <div className="flex gap-12 items-center">
          <Button onClick={() => { setUserAnswer(current.val1); onSound(current.val1 === current.answer ? "Perfect" : "Check again"); }} className={cn("w-32 h-40 rounded-3xl text-6xl", userAnswer === current.val1 ? (current.val1 === current.answer ? 'bg-green-500' : 'bg-red-500') : 'bg-orange-50 text-orange-600')}>{current.val1}</Button>
          <ArrowLeftRight className="text-slate-300 h-12 w-12"/>
          <Button onClick={() => { setUserAnswer(current.val2); onSound(current.val2 === current.answer ? "Perfect" : "Check again"); }} className={cn("w-32 h-40 rounded-3xl text-6xl", userAnswer === current.val2 ? (current.val2 === current.answer ? 'bg-green-500' : 'bg-red-500') : 'bg-orange-50 text-orange-600')}>{current.val2}</Button>
        </div>
        {userAnswer === current.answer && <Button onClick={() => setIndex((index + 1) % data.length)} className="mt-12 bg-green-500 text-white rounded-2xl px-10 h-14">CONTINUE</Button>}
    </div>
  );
};

/* --- 10. NUMBER TRACING (Magic Pen) --- */
const NumberMagicPen: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [selectedItem, setSelectedItem] = useState('1');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0,0,400,400);
    ctx.font = '900 300px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#F1F5F9';
    ctx.setLineDash([10, 10]);
    ctx.strokeText(selectedItem, 200, 220);
  }, [selectedItem]);
  useEffect(() => { clearCanvas(); }, [selectedItem, clearCanvas]);
  const handleCheck = async () => {
    setIsEvaluating(true);
    setTimeout(() => { onSound("Superstar!"); setIsEvaluating(false); }, 1500);
  };
  return (
    <div className="flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100">
        <div className="flex gap-2 mb-8 overflow-x-auto w-full no-scrollbar">
            {Array.from({length: 10}).map((_, i) => (<Button key={i} variant={selectedItem === String(i) ? "default" : "outline"} onClick={() => setSelectedItem(String(i))} className="flex-shrink-0 w-12 h-12 rounded-xl font-black">{i}</Button>))}
        </div>
        <div className="relative w-full max-w-[400px] aspect-square bg-white border-8 border-purple-50 rounded-[3rem] shadow-inner mb-8">
            <canvas ref={canvasRef} width={400} height={400} className="w-full h-full cursor-crosshair" onMouseMove={(e) => {
                if(e.buttons !== 1) return;
                const ctx = canvasRef.current?.getContext('2d');
                if(!ctx) return;
                ctx.setLineDash([]);
                ctx.lineWidth = 15;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#8B5CF6';
                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            }} />
        </div>
        <div className="flex gap-4">
            <Button variant="outline" onClick={clearCanvas} className="h-14 px-8 rounded-2xl">CLEAR</Button>
            <Button onClick={handleCheck} disabled={isEvaluating} className="h-14 px-12 bg-purple-600 text-white rounded-2xl font-black">{isEvaluating ? "CHECKING..." : "CHECK WORK"}</Button>
        </div>
    </div>
  );
};
    
const NumeracyZone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NumeracyTab>('numbers');
  const { schoolId } = useCurrentSchool();
  const currentSourceRef = useRef<HTMLAudioElement | null>(null);

  const playFeedbackSound = useCallback(async (text: string) => {
    if (!text || !schoolId) return;
    if (currentSourceRef.current) try { currentSourceRef.current.pause(); } catch (e) {}
    const result = await generateTTSAction({ text, voice: 'Kore', schoolId });
    if (result.success && result.data) {
        const audio = new Audio(`data:audio/wav;base64,${result.data}`);
        currentSourceRef.current = audio;
        audio.play();
    }
  }, [schoolId]);

  const tabs: {id: NumeracyTab, icon: string}[] = [
    { id: 'numbers', icon: 'fa-1' },
    { id: 'counting', icon: 'fa-list-ol' },
    { id: 'sequence', icon: 'fa-arrow-right-long' },
    { id: 'comparing', icon: 'fa-scale-unbalanced' },
    { id: 'number-words', icon: 'fa-font' },
    { id: 'bonds', icon: 'fa-handshake' },
    { id: 'addition', icon: 'fa-plus' },
    { id: 'subtraction', icon: 'fa-minus' },
    { id: 'tens-units', icon: 'fa-layer-group' },
    { id: 'tracing', icon: 'fa-pen-clip' },
  ];
  
  const renderModule = () => {
    if(!schoolId) return <div className="text-center p-8"><Loader2 className="animate-spin"/></div>;
    const commonProps = { onSound: playFeedbackSound, schoolId: schoolId };
    switch(activeTab) {
        case 'numbers': return <ModuleContainer title="Learn Numbers" icon="fa-1"><NumbersMainModule {...commonProps} /></ModuleContainer>;
        case 'counting': return <ModuleContainer title="Counting Game" icon="fa-list-ol"><CountingGame {...commonProps} /></ModuleContainer>;
        case 'sequence': return <ModuleContainer title="Number Sequence" icon="fa-arrow-right-long"><NumberSequenceModule {...commonProps} /></ModuleContainer>;
        case 'comparing': return <ModuleContainer title="Number Comparison" icon="fa-scale-unbalanced"><NumberComparisonModule {...commonProps} /></ModuleContainer>;
        case 'number-words': return <ModuleContainer title="Number Words" icon="fa-font"><NumberWordsModule {...commonProps} /></ModuleContainer>;
        case 'bonds': return <ModuleContainer title="Number Bonds" icon="fa-handshake"><NumberBondsModule {...commonProps} /></ModuleContainer>;
        case 'addition': return <ModuleContainer title="Addition Fun" icon="fa-plus"><AdditionModule {...commonProps} /></ModuleContainer>;
        case 'subtraction': return <ModuleContainer title="Subtraction Fun" icon="fa-minus"><SubtractionModule {...commonProps} /></ModuleContainer>;
        case 'tens-units': return <ModuleContainer title="Tens and Units" icon="fa-layer-group"><TensUnitsModule {...commonProps} /></ModuleContainer>;
        case 'tracing': return <ModuleContainer title="Magic Pen Tracing" icon="fa-pen-clip"><NumberMagicPen {...commonProps} /></ModuleContainer>;
        default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 pb-20 font-black">
      <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4">
        <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-emerald-50 min-w-max font-black">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn("min-w-[110px] px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1", 
              activeTab === tab.id ? `bg-emerald-500 text-white shadow-xl scale-110 -translate-y-1` : 'text-slate-700 hover:bg-slate-50 font-black'
              )}>
              <IconRenderer iconName={tab.icon} className="text-lg" /><span className="whitespace-nowrap">{tab.id.replace('-', ' ')}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="w-full px-4">{renderModule()}</div>
    </div>
  );
};
  
export default NumeracyZone;
