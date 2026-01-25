
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import * as constants from '@/lib/constants';
import { generateLessonImageAction, generateTTSAction, generateMathWorldEntry } from '@/ai/flows/junior-actions';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const {
    Loader2, Wand2, ArrowLeft, ArrowRight, Volume2, Play, Smile, CaseSensitive, 
    BookOpen, Ear, Layers, Repeat, Mic, Underline, Signpost, Image: ImageIcon, 
    Hand, Gamepad2, CheckCircle2, XCircle, PlusCircle, Sparkles, FolderOpen, Car, Earth, 
    HeartPulse, CloudSun, PawPrint, Shapes, Languages, Pen, Apple, Sun, 
    CloudRain, Guitar, Plane, MousePointer2, Cube, Carrot, Cookie, School, Home, 
    Recycle, Water, Droplets, HelpCircle, MessageSquare, Drama, Flag, GraduationCap, 
    Monitor, Zap, CircleDot, User: UserIcon, Beaker, Bed, Eye, Hash, ListOrdered, Scale, Handshake,
    Plus, Minus, Coins, Ruler, Move, CheckSquare, ArrowLeftRight, PenTool
} = LucideIcons;

// --- ROBUST ICON RENDERER ---
const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const iconMap: Record<string, keyof typeof LucideIcons> = {
      'fa-1': 'Hash', 'fa-list-ol': 'ListOrdered', 'fa-arrow-right-long': 'ArrowRight', 'fa-scale-unbalanced': 'Scale', 'fa-font': 'CaseSensitive', 
      'fa-handshake': 'Handshake', 'fa-plus': 'Plus', 'fa-minus': 'Minus', 'fa-layer-group': 'Layers', 'fa-object-group': 'Shapes', 
      'fa-clock': 'Clock', 'fa-coins': 'Coins', 'fa-ruler-vertical': 'Ruler', 'fa-shapes': 'Shapes', 'fa-arrows-up-down-left-right': 'Move', 
      'fa-scale-balanced': 'Scale', 'fa-square-check': 'CheckSquare', 'fa-arrows-left-right': 'ArrowLeftRight', 'fa-pen-clip': 'PenTool',
      'fa-magic': 'Wand2', 'fa-spinner': 'Loader2', 'fa-volume-high': 'Volume2', 'fa-play': 'Play', 'fa-face-smile': 'Smile', 'fa-brain': 'BrainCircuit'
    };
    const LucideName = iconMap[iconName] || 'HelpCircle';
    const IconComponent = (LucideIcons as any)[LucideName] || HelpCircle;
    return <IconComponent className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} />;
};

type MathTab = 'numbers' | 'counting' | 'sequence' | 'comparing' | 'number-words' | 'bonds' | 'addition' | 'subtraction' | 'tens-units' | 'grouping' | 'time' | 'money' | 'measurement' | 'shapes' | 'spatial' | 'comparison' | 'patterns' | 'one-to-one' | 'tracing';

const TeacherModal: React.FC<{
  title: string; topicLabel: string; topicValue: string; 
  onTopicChange: (v: string) => void; onGenerate: () => void; 
  isLoading: boolean; onClose: () => void;
}> = ({ title, topicLabel, topicValue, onTopicChange, onGenerate, isLoading, onClose }) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="rounded-[3rem] border-8 border-purple-100">
      <DialogHeader><DialogTitle className="text-3xl font-black uppercase tracking-tighter">{title}</DialogTitle></DialogHeader>
      <div className="space-y-6 py-4">
        <div>
          <Label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">{topicLabel}</Label>
          <Input 
            type="text" 
            value={topicValue} 
            onChange={(e) => onTopicChange(e.target.value)} 
            placeholder="Type here..." 
            className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 outline-none font-bold focus:border-purple-300 transition-colors text-slate-800 uppercase" 
          />
        </div>
        <Button 
          onClick={onGenerate} 
          disabled={isLoading || !topicValue} 
          className="w-full py-5 rounded-2xl font-black text-white bg-purple-500 shadow-xl hover:bg-purple-600 disabled:bg-gray-300 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
        >
          {isLoading ? <><Loader2 className="animate-spin"/> GENERATING...</> : <><Sparkles /> CREATE MAGIC</>}
        </Button>
        <button onClick={onClose} className="w-full py-2 text-slate-400 uppercase text-[10px] font-black tracking-widest hover:text-slate-600 transition-colors text-center block font-black">Close Drawer</button>
      </div>
    </DialogContent>
  </Dialog>
);

const ModuleContainer: React.FC<{ title: string; children: React.ReactNode; icon: string; }> = ({ title, children, icon }) => {
    const [started, setStarted] = useState(false);
    if (!started) {
        return (
            <div className="text-center p-12 bg-white rounded-3xl shadow-lg animate-in fade-in">
                <IconRenderer iconName={icon} className="h-16 w-16 mx-auto text-purple-300 mb-4" />
                <h3 className="text-2xl font-bold text-purple-600 mb-2">{title}</h3>
                <p className="text-slate-500 mb-4">Ready to start this activity?</p>
                <Button onClick={() => setStarted(true)} className="bg-purple-500 hover:bg-purple-600">Start Activity</Button>
            </div>
        );
    }
    return <>{children}</>;
};

const NumbersMainModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.NUMERACY_DATA.numbers);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    
    const current = data[index];
    const fetchVisual = useCallback(async () => { if (!schoolId || !current) return; setLoading(true); const res = await generateLessonImageAction({ prompt: current.prompt, schoolId }); if(res.success) setImageUrl(res.data || null); setLoading(false); }, [current, schoolId]);
    useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
    const handleLearn = () => onSound(`This is number ${current.value}. Let's count!`);
  
    const generateWithAi = async () => {
      if (!aiTopic || !schoolId) return; setIsAiLoading(true);
      try {
        const result = await generateMathWorldEntry(aiTopic, 'numbers', schoolId);
        if(result.success && result.data) {
          setData(prev => prev.map((item, i) => i === index ? { ...item, ...result.data } : item));
          setIsDrawerOpen(false); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-purple-200 text-purple-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase tracking-widest z-10 hover:bg-purple-50 transition-colors font-black"><Wand2 className="h-4 w-4 mr-1 inline-block"/> Custom Theme</button>
        <div className="w-full flex flex-col items-center bg-white p-10 rounded-[4rem] shadow-2xl border-8 border-purple-100 animate-in zoom-in duration-500 min-h-[550px]">
          <h2 className="text-9xl font-black text-purple-600 mb-2 drop-shadow-xl">{current.value}</h2>
          <p className="text-3xl font-black text-slate-500 italic mb-10">{current.word || current.value}</p>
          <div onClick={handleLearn} className="w-80 h-80 bg-purple-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
            {loading ? <Loader2 className="w-16 h-16 animate-spin text-purple-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={`Number ${current.value}`} />}
          </div>
          <div className="flex gap-6 font-black"><Button onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 shadow-md font-black"><ArrowLeft className="text-2xl" /></Button><Button onClick={handleLearn} className="px-10 py-3 bg-purple-500 text-white font-black rounded-2xl shadow-xl uppercase border-4 border-white hover:scale-105 transition-all font-black">Learn</Button><Button onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 shadow-md font-black"><ArrowRight className="text-2xl" /></Button></div>
        </div>
        {isDrawerOpen && <TeacherModal title="Change Number Theme" topicLabel="New Topic (e.g. Blue Cats)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};
  
const CountingGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.COUNTING_TASK_DATA || []);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
  
    const current = data[index];
    const options = useMemo(() => current ? [current.count, current.count + 1, current.count - 1].filter(o => o > 0).sort(() => Math.random() - 0.5) : [], [current]);
  
    const fetchVisual = useCallback(async () => { if (!current || !schoolId) return; setLoading(true); const res = await generateLessonImageAction({ prompt: current.prompt, schoolId }); if (res.success) setImageUrl(res.data || null); setLoading(false); }, [current, schoolId]);
    useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data, fetchVisual]);
    
    const handleAnswer = (val: number) => {
      setUserAnswer(val);
      if (val === current.count) onSound(`Great counting! There are ${val} ${current.theme.toLowerCase()}!`);
      else onSound(`Let's count them one by one!`);
    };
  
    const generateWithAi = async () => {
      if (!aiTopic || !schoolId) return; setIsAiLoading(true);
      try {
        const result = await generateMathWorldEntry(aiTopic, 'counting', schoolId);
        if(result.success && result.data) {
          setData(prev => [...prev, result.data as any]);
          setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    if(!current) return <p>No counting tasks available.</p>
  
    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-emerald-200 text-emerald-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-emerald-50 transition-colors"><Wand2 className="h-4 w-4 mr-1 inline-block"/> AI Counting</button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center min-h-[550px]">
          <h3 className="text-4xl font-black text-emerald-600 mb-10 uppercase tracking-tighter text-center">How Many? 🧮</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
             <div onClick={() => onSound(`How many ${current.theme.toLowerCase()} can you see?`)} className="relative aspect-square bg-emerald-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center overflow-hidden cursor-pointer group">
                {loading ? <Loader2 className="w-16 h-16 animate-spin text-emerald-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={current.theme} />}
             </div>
             <div className="flex flex-col items-center">
                <p className="text-2xl font-black text-slate-500 mb-8 uppercase tracking-widest text-center">Count the {current.theme}!</p>
                <div className="grid grid-cols-3 gap-4">
                   {options.map(opt => (
                     <button key={opt} onClick={() => handleAnswer(opt)} className={`w-20 h-20 rounded-3xl font-black text-4xl transition-all border-4 ${userAnswer === opt ? (opt === current.count ? 'bg-green-500 text-white border-white scale-110 shadow-xl' : 'bg-red-500 text-white border-white') : 'bg-emerald-50 text-emerald-600 border-white hover:bg-emerald-100'}`}>{opt}</button>
                   ))}
                </div>
             </div>
          </div>
          {userAnswer === current.count && <Button onClick={() => setIndex(p => (p + 1) % data.length)} className="mt-12 px-12 py-5 bg-emerald-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase border-4 border-white tracking-widest">Next Count! 🦁</Button>}
        </div>
        {isDrawerOpen && <TeacherModal title="AI Counting Maker" topicLabel="Topic Subject" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const NumberSequenceModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    // This is the full implementation you provided.
    // I've added a few UI components to match the project style
    const [data, setData] = useState(constants.SEQUENCE_DATA);
    const [index, setIndex] = useState(0);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);

    const current = data[index];

    useEffect(() => { setUserAnswer(null); }, [index, data]);

    const handleAnswer = (val: number) => {
        setUserAnswer(val);
        if (val === current.answer) {
          onSound(`Yes! ${val} is correct!`);
          confetti({ particleCount: 50, spread: 40, origin: { y: 0.8 } });
        } else {
          onSound(`Try counting!`);
        }
    };
    
    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        try {
          const result = await generateMathWorldEntry(aiTopic, 'sequence', schoolId);
          if (result.success && result.data) {
              setData(prev => [...prev, result.data as any]);
              setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
          }
        } catch(e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
        <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-purple-200 text-purple-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-purple-50 transition-colors"><Wand2 className="w-3 h-3 mr-1 inline-block"/> AI Sequence</button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 flex flex-col items-center min-h-[550px]">
            <h3 className="text-4xl font-black text-purple-600 mb-10 uppercase tracking-tighter text-center">{current.question}</h3>
            <div className="flex gap-4 mb-16 items-center">
            {current.sequence.map((n, i) => (
                <div key={i} className={`w-24 h-32 rounded-3xl flex items-center justify-center border-4 text-5xl font-black ${n === null ? 'bg-purple-50 border-purple-100 text-purple-200 border-dashed' : 'bg-white border-purple-50 text-slate-800 shadow-md'}`}>
                {n === null ? (userAnswer === current.answer ? userAnswer : '?') : n}
                </div>
            ))}
            </div>
            <div className="flex gap-4">
            {current.options.map(opt => (
                <button key={opt} onClick={() => handleAnswer(opt)} className={`w-20 h-20 rounded-2xl font-black text-3xl transition-all border-2 ${userAnswer === opt ? (opt === current.answer ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-purple-50 text-slate-700 border-purple-100 hover:bg-purple-100'}`}>{opt}</button>
            ))}
            </div>
        </div>
        {isDrawerOpen && <TeacherModal title="AI Sequence Maker" topicLabel="Range (e.g. 10-20)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
};

const NumberComparisonModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const NumberWordsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const NumberBondsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const AdditionModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const SubtractionModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const TensUnitsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const GroupingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const TellingTimeModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const MoneyCountingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const MeasurementModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const ShapesModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const SpatialModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const ComparisonGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const PatternGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const OneToOneGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};
const NumberMagicPen: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    return <Card><CardContent className="p-8 text-center">Coming Soon</CardContent></Card>;
};

const NumeracyZone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MathTab>('numbers');
  const { schoolId } = useCurrentSchool();
  const currentSourceRef = useRef<HTMLAudioElement | null>(null);

  const playFeedbackSound = useCallback(async (text: string) => {
    if (!text || !schoolId) return;
    if (currentSourceRef.current) {
        try { currentSourceRef.current.pause(); } catch (e) {}
    }
    const result = await generateTTSAction({ text, voice: 'Kore', schoolId });
    if (result.success && result.data && typeof window !== 'undefined') {
        const audio = new Audio(`data:audio/wav;base64,${result.data}`);
        currentSourceRef.current = audio;
        audio.play();
        audio.onended = () => { currentSourceRef.current = null; };
    }
  }, [schoolId]);

  const tabs: {id: MathTab, icon: string}[] = [
    { id: 'numbers', icon: 'fa-1' },
    { id: 'counting', icon: 'fa-list-ol' },
    { id: 'sequence', icon: 'fa-arrow-right-long' },
    { id: 'comparing', icon: 'fa-scale-unbalanced' },
    { id: 'number-words', icon: 'fa-font' },
    { id: 'bonds', icon: 'fa-handshake' },
    { id: 'addition', icon: 'fa-plus' },
    { id: 'subtraction', icon: 'fa-minus' },
    { id: 'tens-units', icon: 'fa-layer-group' },
    { id: 'grouping', icon: 'fa-object-group' },
    { id: 'time', icon: 'fa-clock' },
    { id: 'money', icon: 'fa-coins' },
    { id: 'measurement', icon: 'fa-ruler-vertical' },
    { id: 'shapes', icon: 'fa-shapes' },
    { id: 'spatial', icon: 'fa-arrows-up-down-left-right' },
    { id: 'comparison', icon: 'fa-scale-balanced' },
    { id: 'patterns', icon: 'fa-square-check' },
    { id: 'one-to-one', icon: 'fa-arrows-left-right' },
    { id: 'tracing', icon: 'fa-pen-clip' }
  ];

  const renderModule = () => {
    if(!schoolId) return <div className="text-center p-8"><Loader2 className="animate-spin"/></div>;
    const commonProps = { onSound: playFeedbackSound, schoolId: schoolId };
    
    const modules: Record<MathTab, React.ReactNode> = {
        'numbers': <ModuleContainer title="Number Recognition" icon="fa-1"><NumbersMainModule {...commonProps} /></ModuleContainer>,
        'counting': <ModuleContainer title="Counting Game" icon="fa-list-ol"><CountingGame {...commonProps} /></ModuleContainer>,
        'sequence': <ModuleContainer title="Number Sequence" icon="fa-arrow-right-long"><NumberSequenceModule {...commonProps} /></ModuleContainer>,
        'comparing': <ModuleContainer title="Number Comparison" icon="fa-scale-unbalanced"><NumberComparisonModule {...commonProps} /></ModuleContainer>,
        'number-words': <ModuleContainer title="Number Words" icon="fa-font"><NumberWordsModule {...commonProps} /></ModuleContainer>,
        'bonds': <ModuleContainer title="Number Bonds" icon="fa-handshake"><NumberBondsModule {...commonProps} /></ModuleContainer>,
        'addition': <ModuleContainer title="Addition" icon="fa-plus"><AdditionModule {...commonProps} /></ModuleContainer>,
        'subtraction': <ModuleContainer title="Subtraction" icon="fa-minus"><SubtractionModule {...commonProps} /></ModuleContainer>,
        'tens-units': <ModuleContainer title="Tens and Units" icon="fa-layer-group"><TensUnitsModule {...commonProps} /></ModuleContainer>,
        'grouping': <ModuleContainer title="Grouping" icon="fa-object-group"><GroupingModule {...commonProps} /></ModuleContainer>,
        'time': <ModuleContainer title="Telling Time" icon="fa-clock"><TellingTimeModule {...commonProps} /></ModuleContainer>,
        'money': <ModuleContainer title="Counting Money" icon="fa-coins"><MoneyCountingModule {...commonProps} /></ModuleContainer>,
        'measurement': <ModuleContainer title="Measurement" icon="fa-ruler-vertical"><MeasurementModule {...commonProps} /></ModuleContainer>,
        'shapes': <ModuleContainer title="Shapes" icon="fa-shapes"><ShapesModule {...commonProps} /></ModuleContainer>,
        'spatial': <ModuleContainer title="Spatial Reasoning" icon="fa-arrows-up-down-left-right"><SpatialModule {...commonProps} /></ModuleContainer>,
        'comparison': <ModuleContainer title="Comparison Game" icon="fa-scale-balanced"><ComparisonGame {...commonProps} /></ModuleContainer>,
        'patterns': <ModuleContainer title="Patterns" icon="fa-square-check"><PatternGame {...commonProps} /></ModuleContainer>,
        'one-to-one': <ModuleContainer title="One-to-One Correspondence" icon="fa-arrows-left-right"><OneToOneGame {...commonProps} /></ModuleContainer>,
        'tracing': <ModuleContainer title="Number Tracing" icon="fa-pen-clip"><NumberMagicPen {...commonProps} /></ModuleContainer>,
    };

    return modules[activeTab] || <p>Coming Soon</p>;
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 font-black">
      <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4">
        <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-purple-50 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-w-[110px] px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${
                activeTab === tab.id ? 'bg-purple-500 text-white shadow-xl scale-110 -translate-y-1' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <IconRenderer iconName={tab.icon} className="text-lg" />
              <span className="whitespace-nowrap">{tab.id.replace('-', ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full px-4">
        {renderModule()}
      </div>
    </div>
  );
};

export default NumeracyZone;

    