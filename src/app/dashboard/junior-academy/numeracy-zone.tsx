
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
    Loader2, Wand2, ArrowLeft, ArrowRight, Volume2, Play, Smile, 
    Ear, Layers, Image as ImageIcon, Sparkles, HelpCircle, 
    Zap, CircleDot, User, Beaker, Eye, Hash, ListOrdered, Scale, 
    Handshake, Plus, Minus, Coins, Ruler, Move, CheckSquare, ArrowLeftRight, PenTool, 
    Clock, ObjectGroup, Users, Drama, BrainCircuit, Music, Atom, Heart, Star, Tv, Rabbit,
    Type, Palette, Utensils, Trash2, Calculator, Shapes, Apple, Cookie, Carrot, PenLine, GripVertical, GripHorizontal, ChevronUp, ChevronDown, Circle, ThumbsUp, CheckCheck, Puzzle, Box, Car
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/context/role-context';

// --- ROBUST ICON RENDERER ---
const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'fa-1': Hash, 'fa-list-ol': ListOrdered, 'fa-arrow-right-long': ArrowRight, 'fa-scale-unbalanced': Scale, 'fa-font': Type, 
      'fa-handshake': Handshake, 'fa-plus': Plus, 'fa-minus': Minus, 'fa-layer-group': Layers, 'fa-object-group': ObjectGroup, 
      'fa-clock': Clock, 'fa-coins': Coins, 'fa-ruler-vertical': Ruler, 'fa-shapes': Shapes, 'fa-arrows-up-down-left-right': Move, 
      'fa-scale-balanced': Scale, 'fa-square-check': CheckSquare, 'fa-arrows-left-right': ArrowLeftRight, 'fa-pen-clip': PenTool,
      'fa-magic': Wand2, 'fa-spinner': Loader2, 'fa-volume-high': Volume2, 'fa-play': Play, 'fa-face-smile': Smile, 'fa-brain': BrainCircuit,
      'fa-apple-whole': Apple, 'fa-star': Star, 'fa-heart': Heart, 'fa-car': Car, 'fa-bolt': Zap, 'fa-cookie': Cookie, 'fa-rabbit': Rabbit,
      'fa-carrot': Carrot, 'fa-lines-leaning': PenLine, 'fa-grip-lines-vertical': GripVertical, 'fa-grip-lines': GripHorizontal,
      'fa-chevron-up': ChevronUp, 'fa-chevron-down': ChevronDown, 'fa-circle': Circle, 'fa-trash-can': Trash2, 'fa-thumbs-up': ThumbsUp,
      'fa-check-double': CheckCheck,
      'fa-puzzle-piece': Puzzle,
      'fa-cube': Box,
    };
    const IconComponent = iconMap[iconName] || HelpCircle;
    return <IconComponent className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} />;
};

type NumeracyTab = 'numbers' | 'counting' | 'sequence' | 'comparing' | 'number-words' | 'bonds' | 'addition' | 'subtraction' | 'tens-units' | 'tracing';

// --- SHARED COMPONENTS ---
const ModuleContainerWithState: React.FC<{ 
  title: string; 
  children: React.ReactNode; 
  icon: string;
  started: boolean;
  onStart: () => void;
  onClose: () => void;
}> = ({ title, children, icon, started, onStart, onClose }) => {
    if (!started) return (
        <div className="text-center p-12 bg-white rounded-[3rem] shadow-xl border-8 border-purple-50 animate-in fade-in zoom-in">
            <IconRenderer iconName={icon} className="h-20 w-20 mx-auto text-purple-300 mb-6" />
            <h3 className="text-4xl font-black text-purple-600 mb-4 uppercase tracking-tighter">{title}</h3>
            <p className="text-slate-500 mb-8 font-bold">Are you ready to learn and play?</p>
            <Button onClick={onStart} size="lg" className="bg-purple-500 hover:bg-purple-600 text-white font-black px-12 py-8 rounded-2xl text-2xl shadow-2xl hover:scale-105 transition-all">START ACTIVITY</Button>
        </div>
    );
    return (
        <div className="relative">
            <Button variant="ghost" onClick={onClose} className="absolute -top-16 left-0 text-slate-400 hover:text-purple-500 font-black uppercase text-xs tracking-widest"><ArrowLeft className="mr-2 h-4 w-4"/> Close Activity</Button>
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
                <Button onClick={onGenerate} disabled={isLoading || !topicValue} className="w-full h-16 rounded-2xl bg-purple-500 hover:bg-purple-600 font-black text-xl shadow-xl text-white">
                    {isLoading ? <><Loader2 className="animate-spin mr-2"/> GENERATING...</> : <><Sparkles className="mr-2 h-6 w-6"/> CREATE MAGIC</>}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
);

/* --- 1. NUMBERS (Recognition) --- */
const NumbersMainModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const { role } = useRole();
    const { toast } = useToast();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
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
      try {
        const result = await generateMathWorldEntry({ topic: aiTopic, category: 'numbers', schoolId });
        if(result.success && result.data) {
            const newEntry = { value: parseInt(result.data.correctAnswer), word: result.data.title, prompt: result.data.imagePrompt };
            setData(prev => [...prev, newEntry]);
            setIndex(data.length);
            setIsDrawerOpen(false); setAiTopic('');
            toast({ title: "New Example Added!" });
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative font-black">
        {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute -top-12 right-0 rounded-full border-2 border-purple-200 text-purple-500 font-black uppercase text-[10px] tracking-widest z-10"><Wand2 className="h-3 w-3 mr-1"/> AI Number Maker</Button>}
        <div className="w-full flex flex-col items-center bg-white p-10 rounded-[4rem] shadow-2xl border-8 border-purple-100 animate-in zoom-in min-h-[550px]">
          <h2 className="text-9xl font-black text-purple-600 mb-2 drop-shadow-xl">{current.value}</h2>
          <p className="text-3xl font-black text-slate-500 italic mb-10">{current.word || current.value}</p>
          <div onClick={handleLearn} className="w-80 h-80 bg-purple-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
            {loading ? <Loader2 className="w-16 h-16 animate-spin text-purple-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all" alt={`Number ${current.value}`} />}
          </div>
          <div className="flex gap-6">
            <Button size="icon" onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 shadow-md font-black"><ArrowLeft className="text-2xl" /></Button>
            <Button onClick={handleLearn} className="px-10 py-3 bg-purple-500 text-white font-black rounded-2xl shadow-xl uppercase border-4 border-white hover:scale-105 transition-all font-black">TEACH ME!</Button>
            <Button size="icon" onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 shadow-md font-black"><ArrowRight className="text-2xl" /></Button>
          </div>
        </div>
        {isDrawerOpen && <TeacherModal title="Change Number Theme" topicLabel="New Topic" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};
  
/* --- 2. COUNTING GAME --- */
const CountingGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [data, setData] = useState(constants.COUNTING_TASK_DATA || []);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const current = data[index];
    const fetchVisual = useCallback(async () => {
        if (!current || !schoolId) return; setLoading(true);
        const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
        if(res.success) setImageUrl(res.data || null); setLoading(false);
    }, [current, schoolId]);

    useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data, fetchVisual]);
    const options = useMemo(() => current ? [current.count, current.count + 1, current.count - 1].filter(o => o > 0).sort(() => Math.random() - 0.5) : [], [current]);

    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        try {
            const result = await generateMathWorldEntry({ topic: aiTopic, category: 'counting', schoolId });
            if(result.success && result.data) {
                setData(prev => [...prev, { count: parseInt(result.data.correctAnswer), theme: result.data.title, prompt: result.data.imagePrompt }]);
                setIndex(data.length); setIsDrawerOpen(false);
            }
        } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };

    if (!current) return <div className="p-20 text-center">No Data Loaded</div>;
    return (
        <div className="w-full relative bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center">
            {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute -top-12 right-0 rounded-full border-2 border-emerald-200 text-emerald-600 font-black uppercase text-[10px] tracking-widest z-10"><Wand2 className="h-3 w-3 mr-1"/> AI Question Maker</Button>}
            <h3 className="text-4xl font-black text-emerald-600 mb-10 uppercase">How Many? 🧮</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
                <div className="aspect-square bg-emerald-50 rounded-[3rem] border-8 border-white flex items-center justify-center overflow-hidden">
                    {loading ? <Loader2 className="animate-spin text-emerald-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover" alt={current.theme} />}
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-2xl font-black text-slate-500 mb-8 uppercase text-center">Count the {current.theme}!</p>
                    <div className="grid grid-cols-3 gap-4">
                        {options.map(opt => (
                            <Button key={opt} onClick={() => { setUserAnswer(opt); onSound(opt === current.count ? "Great job!" : "Try again!"); }} className={cn("w-20 h-20 rounded-3xl font-black text-4xl shadow-xl", userAnswer === opt ? (opt === current.count ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-emerald-50 text-emerald-600')}>{opt}</Button>
                        ))}
                    </div>
                </div>
            </div>
            {isDrawerOpen && <TeacherModal title="AI Counting Assistant" topicLabel="Topic (e.g. Lions in the jungle)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
};

/* --- 3. NUMBER SEQUENCE --- */
const NumberSequenceModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [data, setData] = useState(constants.SEQUENCE_DATA || []);
    const [index, setIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const current = data[index];
    useEffect(() => { setUserAnswer(null); }, [index]);
    
    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        try {
            const result = await generateMathWorldEntry(aiTopic, 'sequence', schoolId);
            if(result.success && result.data) {
                const parsed = JSON.parse(result.data.correctAnswer);
                setData(prev => [...prev, parsed]);
                setIndex(data.length); setIsDrawerOpen(false);
            }
        } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };

    if (!current) return null;
    return (
      <div className="w-full relative bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 flex flex-col items-center">
        {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute -top-12 right-0 rounded-full border-2 border-purple-200 text-purple-500 font-black uppercase text-[10px] tracking-widest z-10"><Wand2 className="h-3 w-3 mr-1"/> AI Sequence Maker</Button>}
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
             <Button key={opt} onClick={() => { setUserAnswer(opt); onSound(opt === current.answer ? "Yes!" : "No"); }} className={cn("w-20 h-20 rounded-2xl text-3xl", userAnswer === opt ? (opt === current.answer ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-purple-50 text-slate-700')}>{opt}</Button>
           ))}
        </div>
        {isDrawerOpen && <TeacherModal title="AI Sequence Assistant" topicLabel="Sequence Range (e.g. 10 to 20)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

/* --- 4. NUMBER COMPARISON --- */
const NumberComparisonModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
  const [data, setData] = useState(constants.NUM_COMPARISON_DATA || []);
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const current = data[index];
  useEffect(() => { setUserAnswer(null); }, [index]);
  
  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
        const result = await generateMathWorldEntry(aiTopic, 'comparing', schoolId);
        if(result.success && result.data) {
            const parsed = JSON.parse(result.data.correctAnswer);
            setData(prev => [...prev, parsed]);
            setIndex(data.length); setIsDrawerOpen(false);
        }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  if (!current) return null;
  return (
    <div className="w-full relative bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center">
        {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute -top-12 right-0 rounded-full border-2 border-orange-200 text-orange-600 font-black uppercase text-[10px] tracking-widest z-10"><Wand2 className="h-3 w-3 mr-1"/> AI Comparison Maker</Button>}
        <h3 className="text-4xl font-black text-orange-600 mb-10 uppercase text-center">{current.q}</h3>
        <div className="flex gap-12 items-center">
          <Button onClick={() => { setUserAnswer(current.val1); onSound(current.val1 === current.answer ? "Perfect" : "Check again"); }} className={cn("w-32 h-40 rounded-3xl text-6xl", userAnswer === current.val1 ? (current.val1 === current.answer ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-orange-50 text-orange-600')}>{current.val1}</Button>
          <ArrowLeftRight className="text-slate-300 h-12 w-12"/>
          <Button onClick={() => { setUserAnswer(current.val2); onSound(current.val2 === current.answer ? "Perfect" : "Check again"); }} className={cn("w-32 h-40 rounded-3xl text-6xl", userAnswer === current.val2 ? (current.val2 === current.answer ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-orange-50 text-orange-600')}>{current.val2}</Button>
        </div>
        {isDrawerOpen && <TeacherModal title="AI Comparison Assistant" topicLabel="Logic (e.g. Higher Numbers)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

/* --- 5. NUMBER WORDS --- */
const NumberWordsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
  const [data, setData] = useState(constants.NUMBER_WORDS_DATA || []);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const current = data[index];
  const fetchVisual = useCallback(async () => {
    if (!current || !schoolId) return;
    const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
    if(res.success) setImageUrl(res.data || null);
  }, [current, schoolId]);
  
  useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
  
  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
        const result = await generateMathWorldEntry(aiTopic, 'number-words', schoolId);
        if(result.success && result.data) {
            setData(prev => [...prev, { digit: parseInt(result.data.correctAnswer), word: result.data.title, prompt: result.data.imagePrompt }]);
            setIndex(data.length); setIsDrawerOpen(false);
        }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };
  
  if (!current) return null;
  return (
    <div className="w-full relative bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 flex flex-col items-center">
      {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute -top-12 right-0 rounded-full border-2 border-purple-200 text-purple-500 font-black uppercase text-[10px] tracking-widest z-10"><Wand2 className="h-3 w-3 mr-1"/> AI Word Assistant</Button>}
      <div className="flex items-center gap-6 mb-10 font-black">
        <div className="w-24 h-24 bg-purple-500 text-white rounded-2xl flex items-center justify-center text-6xl font-black shadow-xl">{current.digit}</div>
        <ArrowRight className="text-purple-300 h-10 w-10" />
        <span className="text-6xl font-black text-purple-600 uppercase tracking-tighter">{current.word}</span>
      </div>
      <div className="w-80 h-80 bg-purple-50 rounded-[3rem] border-8 border-white overflow-hidden mb-10">
        {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" alt={current.word} /> : <Loader2 className="animate-spin m-auto text-purple-300"/>}
      </div>
      <div className="flex gap-6">
        <Button size="icon" onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="bg-slate-100 rounded-full"><ArrowLeft/></Button>
        <Button onClick={() => onSound(current.word)} className="bg-purple-500 text-white px-10 rounded-2xl h-14 font-black">LISTEN</Button>
        <Button size="icon" onClick={() => setIndex(p => (p + 1) % data.length)} className="bg-slate-100 rounded-full"><ArrowRight/></Button>
      </div>
      {isDrawerOpen && <TeacherModal title="AI Number Word Assistant" topicLabel="Target Number" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

/* --- 6. NUMBER BONDS --- */
const NumberBondsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
  const [data, setData] = useState(constants.NUMBER_BONDS_DATA || []);
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const current = data[index];
  useEffect(() => { setUserAnswer(null); }, [index]);

  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
        const result = await generateMathWorldEntry(aiTopic, 'bonds', schoolId);
        if(result.success && result.data) {
            const parsed = JSON.parse(result.data.correctAnswer);
            setData(prev => [...prev, parsed]);
            setIndex(data.length); setIsDrawerOpen(false);
        }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  if (!current) return null;
  return (
    <div className="w-full relative bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center">
        {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute -top-12 right-0 rounded-full border-2 border-pink-200 text-pink-600 font-black uppercase text-[10px] tracking-widest z-10"><Wand2 className="h-3 w-3 mr-1"/> AI Bond Maker</Button>}
        <h3 className="text-4xl font-black text-pink-600 mb-8 uppercase">Friends of {current.target}!</h3>
        <div className="flex items-center gap-6 mb-10 font-black">
           <div className="w-20 h-20 bg-pink-500 text-white rounded-2xl flex items-center justify-center text-4xl font-black shadow-xl">{current.part1}</div>
           <Plus className="text-slate-400"/>
           <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center border-4 border-dashed text-4xl font-black", userAnswer === current.part2 ? 'bg-green-500 text-white border-white' : 'bg-pink-50 text-pink-200')}>{userAnswer === current.part2 ? userAnswer : '?'}</div>
           <span className="text-4xl text-slate-400">=</span>
           <div className="w-20 h-20 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-4xl font-black shadow-xl">{current.target}</div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
           {Array.from({length: current.target + 1}).map((_, i) => (
             <Button key={i} onClick={() => { setUserAnswer(i); onSound(i === current.part2 ? "Correct!" : "Try again"); }} className={cn("w-14 h-14 rounded-xl text-xl", userAnswer === i ? 'bg-green-500' : 'bg-pink-50 text-pink-600')}>{i}</Button>
           ))}
        </div>
        {isDrawerOpen && <TeacherModal title="AI Bond Assistant" topicLabel="Bond Total (e.g. 10 or 20)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

/* --- 7. ADDITION --- */
const AdditionModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [data, setData] = useState(constants.ADDITION_DATA || []);
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const current = data[index];
    const fetchVisual = useCallback(async () => {
        if (!current || !schoolId) return;
        const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
        if(res.success) setImageUrl(res.data || null);
    }, [current, schoolId]);

    useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, fetchVisual]);
    
    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        try {
            const result = await generateMathWorldEntry(aiTopic, 'addition', schoolId);
            if(result.success && result.data) {
                const parsed = JSON.parse(result.data.correctAnswer);
                setData(prev => [...prev, parsed]);
                setIndex(data.length); setIsDrawerOpen(false);
            }
        } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };

    if (!current) return null;
    const correct = current.val1 + current.val2;
    return (
        <div className="w-full relative bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center">
            {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute -top-12 right-0 rounded-full border-2 border-orange-200 text-orange-600 font-black uppercase text-[10px] tracking-widest z-10"><Wand2 className="h-3 w-3 mr-1"/> AI Addition Maker</Button>}
            <h3 className="text-4xl font-black text-orange-500 mb-10 uppercase font-black">Addition! ➕</h3>
            <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2 p-4 bg-orange-50 rounded-2xl">
                        {Array.from({length: current.val1}).map((_, i) => <IconRenderer key={i} iconName={current.icon} className="h-10 w-10 text-orange-600" />)}
                    </div>
                    <Plus className="h-10 w-10 text-slate-400" />
                    <div className="flex gap-2 p-4 bg-orange-50 rounded-2xl">
                        {Array.from({length: current.val2}).map((_, i) => <IconRenderer key={i} iconName={current.icon} className="h-10 w-10 text-orange-600" />)}
                    </div>
                </div>
                <div className="w-48 h-48 bg-white border-4 border-orange-50 rounded-[2.5rem] shadow-xl overflow-hidden relative">
                    {imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-2" alt={current.theme}/>}
                </div>
            </div>
            <p className="text-6xl font-black text-slate-800 mb-10">{current.val1} + {current.val2} = ?</p>
            <div className="flex flex-wrap justify-center gap-3">
                {Array.from({length: 21}).map((_, i) => (
                    <Button key={i} onClick={() => { setUserAnswer(i); onSound(i === correct ? "Perfect!" : "Keep counting"); }} className={cn("w-14 h-14 rounded-xl font-black text-xl shadow-md", userAnswer === i ? (i === correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-orange-50 text-slate-800')}>{i}</Button>
                ))}
            </div>
            {isDrawerOpen && <TeacherModal title="AI Addition Assistant" topicLabel="Theme (e.g. Rocket Ships)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
};

/* --- 8. SUBTRACTION --- */
const SubtractionModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
  const [data, setData] = useState(constants.SUBTRACTION_DATA || []);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const current = data[index];
  const fetchVisual = useCallback(async () => {
    if (!current || !schoolId) return;
    const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
    if(res.success) setImageUrl(res.data || null);
  }, [current, schoolId]);
  useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, fetchVisual]);
  
  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
        const result = await generateMathWorldEntry(aiTopic, 'subtraction', schoolId);
        if(result.success && result.data) {
            const parsed = JSON.parse(result.data.correctAnswer);
            setData(prev => [...prev, parsed]);
            setIndex(data.length); setIsDrawerOpen(false);
        }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  if (!current) return null;
  const correct = current.val1 - current.val2;
  return (
    <div className="w-full relative bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-red-100 flex flex-col items-center">
        {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute -top-12 right-0 rounded-full border-2 border-red-200 text-red-600 font-black uppercase text-[10px] tracking-widest z-10"><Wand2 className="h-3 w-3 mr-1"/> AI Subtraction Maker</Button>}
        <h3 className="text-4xl font-black text-red-500 mb-10 uppercase font-black">Subtraction! ➖</h3>
        <div className="flex items-center gap-4 mb-12">
            <div className="flex gap-2 p-4 bg-red-50 rounded-2xl">
              {Array.from({length: current.val1}).map((_, i) => <IconRenderer key={i} iconName={current.icon} className={cn("h-10 w-10", i >= (current.val1 - current.val2) ? 'text-slate-200 opacity-30' : 'text-red-600')} />)}
            </div>
            <Minus className="h-10 w-10 text-slate-400" />
            <div className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 rounded-xl text-3xl font-black">{current.val2}</div>
        </div>
        <p className="text-6xl font-black text-slate-800 mb-10">{current.val1} - {current.val2} = ?</p>
        <div className="flex flex-wrap justify-center gap-3 font-black">
            {Array.from({length: 11}).map((_, i) => (
                <Button key={i} onClick={() => { setUserAnswer(i); onSound(i === correct ? "Yes!" : "Try again"); }} className={cn("w-14 h-14 rounded-2xl font-black", userAnswer === i ? (i === correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-red-50 text-slate-800')}>{i}</Button>
            ))}
        </div>
        {isDrawerOpen && <TeacherModal title="AI Subtraction Assistant" topicLabel="Theme (e.g. Flying Cookies)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

/* --- 9. TENS AND UNITS --- */
const TensUnitsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
  const [data, setData] = useState(constants.TENS_UNITS_DATA || []);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const current = data[index];
  const fetchVisual = useCallback(async () => {
    if (!current || !schoolId) return;
    const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
    if(res.success) setImageUrl(res.data || null);
  }, [current, schoolId]);
  useEffect(() => { fetchVisual(); }, [index, fetchVisual]);
  
  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
        const result = await generateMathWorldEntry(aiTopic, 'tens-units', schoolId);
        if(result.success && result.data) {
            const parsed = JSON.parse(result.data.correctAnswer);
            setData(prev => [...prev, parsed]);
            setIndex(data.length); setIsDrawerOpen(false);
        }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  if (!current) return null;
  return (
    <div className="w-full relative bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-indigo-100 flex flex-col items-center min-h-[550px]">
      {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute -top-12 right-0 rounded-full border-2 border-indigo-200 text-indigo-600 font-black uppercase text-[10px] tracking-widest z-10"><Wand2 className="h-3 w-3 mr-1"/> AI Tens Maker</Button>}
      <h3 className="text-4xl font-black text-indigo-500 mb-8 uppercase font-black">Tens and Units 📦</h3>
      <div className="flex items-center gap-12 mb-10 font-black">
         <div className="text-center font-black"><p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Number</p><div className="w-24 h-24 bg-indigo-500 text-white rounded-2xl flex items-center justify-center text-5xl font-black shadow-xl">{current.number}</div></div>
         <span className="text-4xl text-slate-300">=</span>
         <div className="flex gap-4">
            <div className="text-center"><p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Tens</p><div className="w-16 h-16 border-4 border-indigo-200 text-indigo-600 rounded-xl flex items-center justify-center text-3xl font-black">{current.tens}</div></div>
            <div className="text-center"><p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Units</p><div className="w-16 h-16 border-4 border-indigo-200 text-indigo-600 rounded-xl flex items-center justify-center text-3xl font-black">{current.units}</div></div>
         </div>
      </div>
      <div className="w-full max-w-2xl aspect-video bg-indigo-50 rounded-[3rem] border-8 border-white overflow-hidden mb-10 cursor-pointer" onClick={() => onSound(`${current.number} has ${current.tens} ten and ${current.units} units`)}>
        {imageUrl && <img src={imageUrl} className="w-full h-full object-cover" alt={`${current.number} explained`}/>}
      </div>
      {isDrawerOpen && <TeacherModal title="AI Tens Assistant" topicLabel="Target Number" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

/* --- 10. MAGIC PEN (Tracing) --- */
const NumberMagicPen: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const { role } = useRole();
    const { toast } = useToast();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    
    // Convert static data to state
    const [numbers, setNumbers] = useState(Array.from({length: 10}).map((_, i) => String(i)));
    const [letters, setLetters] = useState(constants.LETTERS);
    const [strokes, setStrokes] = useState(constants.STROKES);

    const [activeMode, setActiveMode] = useState<'numbers' | 'letters' | 'strokes'>('numbers');
    const [selectedItem, setSelectedItem] = useState('1');
    const [isEvaluating, setIsEvaluating] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // AI state
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

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
        const currentItem = activeMode === 'strokes' ? strokes.find(s => s.id === selectedItem)?.label : selectedItem;
        ctx.strokeText(currentItem || '', 200, 220);
    }, [selectedItem, activeMode, strokes]);

    useEffect(() => { clearCanvas(); }, [selectedItem, clearCanvas, activeMode]);

    const handleCheck = () => {
        setIsEvaluating(true);
        setTimeout(() => { onSound("Superstar writing!"); confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }}); setIsEvaluating(false); }, 1500);
    };

    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return;
        setIsAiLoading(true);
        try {
            const result = await generateMathWorldEntry(aiTopic, 'tracing', schoolId);
            if (result.success && result.data) {
                const newItem = result.data.title;
                if (activeMode === 'strokes') {
                    setStrokes(prev => [...prev, { id: newItem.toLowerCase().replace(/\s+/g, '-'), label: newItem, icon: 'fa-pen-clip' }]);
                    toast({ title: "New Stroke Added!" });
                } else {
                    const newItems = [...(activeMode === 'numbers' ? numbers : letters), newItem];
                    activeMode === 'numbers' ? setNumbers(newItems) : setLetters(newItems);
                    toast({ title: `New ${activeMode.slice(0, -1)} added!` });
                }
                setIsDrawerOpen(false); setAiTopic('');
            }
        } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
  return (
    <div className="flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 relative">
        {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute top-4 right-4 rounded-full border-2 border-purple-200 text-purple-600 font-black uppercase text-[10px] tracking-widest z-10"><Wand2 className="h-3 w-3 mr-1"/> AI Maker</Button>}
        
        <div className="w-full">
            <Tabs defaultValue="numbers" onValueChange={(v) => setActiveMode(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="numbers">Numbers</TabsTrigger>
                    <TabsTrigger value="letters">Letters</TabsTrigger>
                    <TabsTrigger value="strokes">Strokes</TabsTrigger>
                </TabsList>
                <div className="flex gap-2 justify-center flex-wrap">
                    {activeMode === 'numbers' && numbers.map(n => (<Button key={n} variant={selectedItem === n ? "default" : "outline"} onClick={() => setSelectedItem(n)} className="flex-shrink-0 w-12 h-12 rounded-xl font-black">{n}</Button>))}
                    {activeMode === 'letters' && letters.map(l => (<Button key={l} variant={selectedItem === l ? "default" : "outline"} onClick={() => setSelectedItem(l)} className="flex-shrink-0 w-12 h-12 rounded-xl font-black">{l}</Button>))}
                    {activeMode === 'strokes' && strokes.map(s => (<Button key={s.id} variant={selectedItem === s.id ? "default" : "outline"} onClick={() => setSelectedItem(s.id)} className="h-12 rounded-xl font-black px-4 gap-2"><IconRenderer iconName={s.icon}/> {s.label}</Button>))}
                </div>
            </Tabs>
        </div>

        <div className="relative w-full max-w-[400px] aspect-square bg-white border-8 border-purple-50 rounded-[3rem] shadow-inner my-8 overflow-hidden">
            <canvas ref={canvasRef} width={400} height={400} className="w-full h-full cursor-crosshair" 
                onMouseDown={() => setIsDrawing(true)} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)}
                onMouseMove={(e) => {
                    if(!isDrawing) return;
                    const canvas = canvasRef.current; const rect = canvas?.getBoundingClientRect(); if(!rect) return;
                    const ctx = canvas?.getContext('2d'); if(!ctx) return;
                    const x = (e.clientX - rect.left) * (400 / rect.width);
                    const y = (e.clientY - rect.top) * (400 / rect.height);
                    ctx.setLineDash([]); ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.strokeStyle = '#8B5CF6';
                    ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y);
                }} 
            />
        </div>
        <div className="flex gap-4">
            <Button variant="outline" onClick={clearCanvas} className="h-14 px-8 rounded-2xl font-black uppercase">Clear</Button>
            <Button onClick={handleCheck} disabled={isEvaluating} className="h-14 px-12 bg-purple-600 text-white rounded-2xl font-black uppercase">Check Work</Button>
        </div>
        {isDrawerOpen && <TeacherModal title={`AI ${activeMode} Maker`} topicLabel="Enter a new Character" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};


// --- MAIN WRAPPER ---
const NumeracyZone: React.FC = () => {
    const [activeTab, setActiveTab] = useState<NumeracyTab>('numbers');
    const [startedModules, setStartedModules] = useState<Record<NumeracyTab, boolean>>({
        numbers: false, counting: false, sequence: false, comparing: false, 'number-words': false, bonds: false,
        addition: false, subtraction: false, 'tens-units': false, tracing: false,
    });
    
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

    const handleStartModule = (moduleId: NumeracyTab) => {
        setStartedModules(prev => ({ ...prev, [moduleId]: true }));
    };

    const handleCloseModule = (moduleId: NumeracyTab) => {
        setStartedModules(prev => ({ ...prev, [moduleId]: false }));
    };
  
    const tabs: {id: NumeracyTab, icon: string}[] = [
      { id: 'numbers', icon: 'fa-1' }, { id: 'counting', icon: 'fa-list-ol' }, { id: 'sequence', icon: 'fa-arrow-right-long' }, 
      { id: 'comparing', icon: 'fa-scale-unbalanced' }, { id: 'number-words', icon: 'fa-font' }, { id: 'bonds', icon: 'fa-handshake' }, 
      { id: 'addition', icon: 'fa-plus' }, { id: 'subtraction', icon: 'fa-minus' }, { id: 'tens-units', icon: 'fa-layer-group' }, 
      { id: 'tracing', icon: 'fa-pen-clip' }
    ];
    
    const renderModule = () => {
      if(!schoolId) return <div className="text-center p-8"><Loader2 className="animate-spin h-10 w-10 mx-auto text-purple-400"/></div>;
      const commonProps = { onSound: playFeedbackSound, schoolId: schoolId };
      
      const moduleToRender = {
        'numbers': <NumbersMainModule {...commonProps} />,
        'counting': <CountingGame {...commonProps} />,
        'sequence': <NumberSequenceModule {...commonProps} />,
        'comparing': <NumberComparisonModule {...commonProps} />,
        'number-words': <NumberWordsModule {...commonProps} />,
        'bonds': <NumberBondsModule {...commonProps} />,
        'addition': <AdditionModule {...commonProps} />,
        'subtraction': <SubtractionModule {...commonProps} />,
        'tens-units': <TensUnitsModule {...commonProps} />,
        'tracing': <NumberMagicPen {...commonProps} />,
      }[activeTab];

      return (
        <ModuleContainerWithState 
            title={activeTab.replace('-', ' ')} 
            icon={tabs.find(t => t.id === activeTab)?.icon || 'fa-1'}
            started={startedModules[activeTab]}
            onStart={() => handleStartModule(activeTab)}
            onClose={() => handleCloseModule(activeTab)}
        >
            {startedModules[activeTab] && moduleToRender}
        </ModuleContainerWithState>
      );
    };
  
    return (
      <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 font-black">
        <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4 font-black">
          <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-purple-50 min-w-max font-black">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); }} className={cn("min-w-[110px] px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1", activeTab === tab.id ? `bg-purple-500 text-white shadow-xl scale-110 -translate-y-1` : 'text-slate-700 hover:bg-slate-50 font-black'
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