
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
import * as LucideIcons from 'lucide-react';

const {
    Loader2, Wand2, ArrowLeft, ArrowRight, Volume2, Play, Smile, 
    Ear, Layers, Image: ImageIcon, Sparkles, HelpCircle, 
    Zap, CircleDot, User, Beaker, Eye, Hash, ListOrdered, Scale, 
    Handshake, Plus, Minus, Coins, Ruler, Move, CheckSquare, ArrowLeftRight, PenTool, 
    Clock, Users, Drama, BrainCircuit, Music, Atom, Heart, Star, Tv, Rabbit,
    CaseSensitive, BookOpen, Utensils, Trash2, Calculator, Shapes
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
          <div className="flex gap-6 font-black"><Button size="icon" onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 shadow-md font-black"><ArrowLeft className="text-2xl" /></Button><Button onClick={handleLearn} className="px-10 py-3 bg-purple-500 text-white font-black rounded-2xl shadow-xl uppercase border-4 border-white hover:scale-105 transition-all font-black">TEACH ME!</Button><Button size="icon" onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 shadow-md font-black"><ArrowRight className="text-2xl" /></Button></div>
        </div>
        {isDrawerOpen && <TeacherModal title="Change Number Theme" topicLabel="New Topic (e.g. Blue Cats)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};
  
/* --- 2. COUNTING GAME --- */
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
    const fetchVisual = useCallback(async () => {
        if (!current || !schoolId) return; setLoading(true);
        const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
        if(res.success) setImageUrl(res.data || null); setLoading(false);
    }, [current, schoolId]);
    useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data, fetchVisual]);
    const options = useMemo(() => current ? [current.count, current.count + 1, current.count - 1].filter(o => o > 0).sort(() => Math.random() - 0.5) : [], [current]);
    
    const handleAnswer = (val: number) => {
      setUserAnswer(val);
      if (val === current.count) {
        confetti();
        onSound(`Great counting! There are ${val} ${current.theme.toLowerCase()}!`);
      }
      else onSound(`Let's count them one by one!`);
    };

    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        const result = await generateMathWorldEntry(aiTopic, 'counting', schoolId);
        if(result.success && result.data) {
          setData(prev => [...prev, result.data as any]);
          setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
        }
        setIsAiLoading(false);
    };
  
    if (!current) return null;

    return (
        <div className="relative font-black">
        <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute -top-12 right-0 rounded-full border-2 border-emerald-200 text-emerald-600 font-black uppercase text-[10px] tracking-widest z-10"><Wand2 className="h-3 w-3 mr-1"/> AI Counting</Button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center min-h-[550px]">
            <h3 className="text-4xl font-black text-emerald-600 mb-10 uppercase tracking-tighter text-center">How Many? 🧮</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
                <div onClick={() => onSound(`How many ${current.theme.toLowerCase()} can you see?`)} className="relative aspect-square bg-emerald-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center overflow-hidden cursor-pointer group">
                    {loading ? <Loader2 className="w-16 h-16 animate-spin text-emerald-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={current.theme} />}
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-2xl font-black text-slate-500 mb-8 uppercase tracking-widest text-center">Count the {current.theme}!</p>
                    <div className="grid grid-cols-3 gap-4">
                       {options.map(opt => (
                         <Button key={opt} onClick={() => handleAnswer(opt)} className={cn("w-20 h-20 rounded-3xl font-black text-4xl shadow-xl", userAnswer === opt ? (opt === current.count ? 'bg-green-500' : 'bg-red-500') : 'bg-emerald-50 text-emerald-600')}>{opt}</Button>
                       ))}
                    </div>
                </div>
            </div>
            {userAnswer === current.count && <Button onClick={() => setIndex(p => (p + 1) % data.length)} className="mt-12 px-12 py-8 bg-emerald-500 text-white font-black rounded-3xl animate-bounce uppercase">Next Count! 🦁</Button>}
        </div>
        {isDrawerOpen && <TeacherModal title="AI Counting Maker" topicLabel="Topic Subject" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

/* --- 3. NUMBER SEQUENCE --- */
const NumberSequenceModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.NUMERACY_DATA.sequence || []);
    const [index, setIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const current = data[index];
    useEffect(() => { setUserAnswer(null) }, [index]);
    if (!current) return null;
    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 flex flex-col items-center min-h-[550px]">
        <h3 className="text-4xl font-black text-purple-600 mb-10 uppercase">{current.question}</h3>
        <div className="flex gap-4 mb-16 items-center">
           {current.sequence.map((n: any, i: number) => (
             <div key={i} className={cn("w-24 h-32 rounded-3xl flex items-center justify-center border-4 text-5xl font-black", n === null ? 'bg-purple-50 border-dashed text-purple-200' : 'bg-white shadow-md text-slate-800')}>
               {n === null ? (userAnswer === current.answer ? userAnswer : '?') : n}
             </div>
           ))}
        </div>
        <div className="flex gap-4">
           {current.options.map((opt: number) => (
             <Button key={opt} onClick={() => { setUserAnswer(opt); onSound(opt === current.answer ? "Yes!" : "No"); }} className={cn("w-20 h-20 rounded-2xl text-3xl", userAnswer === opt ? (opt === current.answer ? 'bg-green-500' : 'bg-red-500') : 'bg-purple-50 text-slate-700')}>{opt}</Button>
           ))}
        </div>
        {userAnswer === current.answer && <Button onClick={() => setIndex((index + 1) % data.length)} className="mt-8 bg-green-500 text-white rounded-2xl px-10 h-14">NEXT SEQUENCE</Button>}
      </div>
    );
};

/* --- Remaining Submodules --- */
const NumberComparisonModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.NUMERACY_DATA.numComparison || []);
    const [index, setIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<any>(null);
    const current = data[index];
    useEffect(() => { setUserAnswer(null); }, [index]);
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

const NumberWordsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <ModuleContainer title="Number Words" icon="fa-font"><p>Module Under Construction</p></ModuleContainer>;
const NumberBondsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <ModuleContainer title="Number Bonds" icon="fa-handshake"><p>Module Under Construction</p></ModuleContainer>;
const AdditionModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <ModuleContainer title="Addition" icon="fa-plus"><p>Module Under Construction</p></ModuleContainer>;
const SubtractionModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <ModuleContainer title="Subtraction" icon="fa-minus"><p>Module Under Construction</p></ModuleContainer>;
const TensUnitsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <ModuleContainer title="Tens & Units" icon="fa-layer-group"><p>Module Under Construction</p></ModuleContainer>;
const GroupingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <ModuleContainer title="Grouping" icon="fa-object-group"><p>Module Under Construction</p></ModuleContainer>;
const TellingTimeModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <ModuleContainer title="Telling Time" icon="fa-clock"><p>Module Under Construction</p></ModuleContainer>;
const MoneyCountingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <ModuleContainer title="Money Counting" icon="fa-coins"><p>Module Under Construction</p></ModuleContainer>;
const MeasurementModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <ModuleContainer title="Measurement" icon="fa-ruler-vertical"><p>Module Under Construction</p></ModuleContainer>;
const ShapesModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <ModuleContainer title="Shapes" icon="fa-shapes"><p>Module Under Construction</p></ModuleContainer>;
const ComparisonGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <ModuleContainer title="Visual Comparison" icon="fa-scale-balanced"><p>Module Under Construction</p></ModuleContainer>;
const PatternGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <ModuleContainer title="Patterns" icon="fa-square-check"><p>Module Under Construction</p></ModuleContainer>;
const OneToOneGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <ModuleContainer title="One-to-One Matching" icon="fa-arrows-left-right"><p>Module Under Construction</p></ModuleContainer>;
const NumberMagicPen: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <ModuleContainer title="Number Tracing" icon="fa-pen-clip"><p>Module Under Construction</p></ModuleContainer>;


// --- MAIN WRAPPER ---
const MathPlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MathTab>('numbers');
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

  const tabs: {id: MathTab, icon: string}[] = [
    { id: 'numbers', icon: 'fa-1' }, { id: 'counting', icon: 'fa-list-ol' }, { id: 'sequence', icon: 'fa-arrow-right-long' },
    { id: 'comparing', icon: 'fa-scale-unbalanced' }, { id: 'number-words', icon: 'fa-font' }, { id: 'bonds', icon: 'fa-handshake' },
    { id: 'addition', icon: 'fa-plus' }, { id: 'subtraction', icon: 'fa-minus' }, { id: 'tens-units', icon: 'fa-layer-group' },
    { id: 'grouping', icon: 'fa-object-group' }, { id: 'time', icon: 'fa-clock' }, { id: 'money', icon: 'fa-coins' },
    { id: 'measurement', icon: 'fa-ruler-vertical' }, { id: 'shapes', icon: 'fa-shapes' }, { id: 'spatial', icon: 'fa-arrows-up-down-left-right' },
    { id: 'comparison', icon: 'fa-scale-balanced' }, { id: 'patterns', icon: 'fa-square-check' }, { id: 'one-to-one', icon: 'fa-arrows-left-right' },
    { id: 'tracing', icon: 'fa-pen-clip' }
  ];
  
  const renderModule = () => {
    if(!schoolId) return <div className="text-center p-8"><Loader2 className="animate-spin h-10 w-10 mx-auto text-purple-400"/></div>;
    const commonProps = { onSound: playFeedbackSound, schoolId: schoolId };
    
    const modules: Record<MathTab, React.ReactNode> = {
        'numbers': <ModuleContainer title="Number Recognition" icon="fa-1"><NumbersMainModule {...commonProps} /></ModuleContainer>,
        'counting': <ModuleContainer title="Counting Game" icon="fa-list-ol"><CountingGame {...commonProps} /></ModuleContainer>,
        'sequence': <ModuleContainer title="Number Sequence" icon="fa-arrow-right-long"><NumberSequenceModule {...commonProps} /></ModuleContainer>,
        'comparing': <ModuleContainer title="Number Comparison" icon="fa-scale-unbalanced"><NumberComparisonModule {...commonProps} /></ModuleContainer>,
        'number-words': <ModuleContainer title="Number Words" icon="fa-font"><NumberWordsModule {...commonProps} /></ModuleContainer>,
        'bonds': <ModuleContainer title="Number Bonds" icon="fa-handshake"><NumberBondsModule onSound={playFeedbackSound} /></ModuleContainer>,
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
        'patterns': <ModuleContainer title="Patterns" icon="fa-square-check"><PatternGame onSound={playFeedbackSound} /></ModuleContainer>,
        'one-to-one': <ModuleContainer title="One-to-One Matching" icon="fa-arrows-left-right"><OneToOneGame onSound={playFeedbackSound} /></ModuleContainer>,
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
              className={cn("min-w-[110px] px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1", activeTab === tab.id ? `bg-purple-500 text-white shadow-xl scale-110 -translate-y-1` : 'text-slate-700 hover:bg-slate-50')}
            >
              <IconRenderer iconName={tab.icon} className="text-lg" /><span className="whitespace-nowrap">{tab.id.replace('-', ' ')}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="w-full px-4">{renderModule()}</div>
    </div>
  );
};
  
export default MathPlayground;

