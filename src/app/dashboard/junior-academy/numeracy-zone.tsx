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
    Ear, Layers, Sparkles, HelpCircle, 
    Zap, CircleDot, User, Beaker, Eye, Hash, ListOrdered, Scale, 
    Handshake, Plus, Minus, Coins, Ruler, Move, CheckSquare, ArrowLeftRight, PenTool, 
    Clock, ObjectGroup, Users, Drama, BrainCircuit, Music, Atom, Heart, Star, Tv, Rabbit,
    CaseSensitive as Type, Palette, Utensils, Trash2, Calculator, Shapes, Apple, Cookie, Car, Carrot
} from 'lucide-react';


// --- ROBUST ICON RENDERER ---
const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
      'fa-1': Hash, 'fa-list-ol': ListOrdered, 'fa-arrow-right-long': ArrowRight, 'fa-scale-unbalanced': Scale, 'fa-font': Type, 
      'fa-handshake': Handshake, 'fa-plus': Plus, 'fa-minus': Minus, 'fa-layer-group': Layers, 'fa-object-group': ObjectGroup, 
      'fa-clock': Clock, 'fa-coins': Coins, 'fa-ruler-vertical': Ruler, 'fa-shapes': Shapes, 'fa-arrows-up-down-left-right': Move, 
      'fa-scale-balanced': Scale, 'fa-square-check': CheckSquare, 'fa-arrows-left-right': ArrowLeftRight, 'fa-pen-clip': PenTool,
      'fa-magic': Wand2, 'fa-spinner': Loader2, 'fa-volume-high': Volume2, 'fa-play': Play, 'fa-face-smile': Smile, 'fa-brain': BrainCircuit,
      'fa-apple-whole': Apple, 'fa-star': Star, 'fa-heart': Heart, 'fa-car': Car, 'fa-bolt': Zap, 'fa-cookie': Cookie,
      'fa-rabbit': Rabbit, 'fa-carrot': Carrot
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
          <div onClick={() => onSound(`This is number ${current.value}`)} className="w-80 h-80 bg-purple-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
            {loading ? <Loader2 className="w-16 h-16 animate-spin text-purple-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all" alt={`Number ${current.value}`} />}
          </div>
          <div className="flex gap-6">
            <Button size="icon" onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 shadow-md font-black"><ArrowLeft className="text-2xl" /></Button>
            <Button onClick={() => onSound(`Let's count to ${current.value}`)} className="px-16 h-16 bg-purple-500 text-white font-black rounded-2xl shadow-xl uppercase border-4 border-white hover:scale-105 transition-all font-black">Learn</Button>
            <Button size="icon" onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 shadow-md font-black"><ArrowRight className="text-2xl" /></Button>
          </div>
        </div>
        {isDrawerOpen && <TeacherModal title="Change Number Theme" topicLabel="New Topic" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
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
    const current = data[index];
    const fetchVisual = useCallback(async () => {
        if (!current || !schoolId) return; setLoading(true);
        const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
        if(res.success) setImageUrl(res.data || null); setLoading(false);
    }, [current, schoolId]);
    useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data, fetchVisual]);
    const options = useMemo(() => current ? [current.count, current.count + 1, current.count - 1].filter(o => o > 0).sort(() => Math.random() - 0.5) : [], [current]);
    if (!current) return null;
    return (
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center min-h-[550px]">
            <h3 className="text-4xl font-black text-emerald-600 mb-10 uppercase">How Many? 🧮</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
                <div className="aspect-square bg-emerald-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center overflow-hidden">
                    {loading ? <Loader2 className="animate-spin text-emerald-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover" alt={current.theme} />}
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-2xl font-black text-slate-500 mb-8 uppercase">Count the {current.theme}!</p>
                    <div className="grid grid-cols-3 gap-4">
                        {options.map(opt => (
                            <Button key={opt} onClick={() => { setUserAnswer(opt); onSound(opt === current.count ? "Great job!" : "Try again!"); }} className={cn("w-20 h-20 rounded-3xl font-black text-4xl shadow-xl", userAnswer === opt ? (opt === current.count ? 'bg-green-500' : 'bg-red-500') : 'bg-emerald-50 text-emerald-600')}>{opt}</Button>
                        ))}
                    </div>
                </div>
            </div>
            {userAnswer === current.count && <Button onClick={() => setIndex(p => (p + 1) % data.length)} className="mt-12 px-12 py-8 bg-emerald-500 text-white font-black rounded-3xl animate-bounce">Next Count! 🦁</Button>}
        </div>
    );
};

/* --- 3. NUMBER SEQUENCE --- */
const NumberSequenceModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
    const [data] = useState(constants.NUMERACY_DATA.sequence || []);
    const [index, setIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const current = data[index];
    if (!current) return null;
    useEffect(() => { setUserAnswer(null); }, [index, data]);
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

/* --- 4. NUMBER COMPARISON (Greater/Less) --- */
const NumberComparisonModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data] = useState(constants.NUMERACY_DATA.numComparison || []);
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const current = data[index];
  useEffect(() => { setUserAnswer(null); }, [index, data]);
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

/* --- 5. NUMBER WORDS --- */
const NumberWordsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [items] = useState(constants.NUMERACY_DATA.numberWords || []);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const current = items[index];
  useEffect(() => {
    generateLessonImageAction({ prompt: current?.prompt, schoolId }).then(res => setImageUrl(res.data || null));
  }, [index, schoolId, current?.prompt]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 flex flex-col items-center">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-24 h-24 bg-purple-500 text-white rounded-2xl flex items-center justify-center text-6xl font-black">{current.digit}</div>
        <ArrowRight className="text-purple-300 h-10 w-10" />
        <span className="text-6xl font-black text-purple-600 uppercase tracking-tighter">{current.word}</span>
      </div>
      <div className="w-80 h-80 bg-purple-50 rounded-[3rem] border-8 border-white overflow-hidden mb-10">
        {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <Loader2 className="animate-spin m-auto"/>}
      </div>
      <div className="flex gap-6">
        <Button size="icon" onClick={() => setIndex(p => (p === 0 ? items.length - 1 : p - 1))} className="bg-slate-100 rounded-full"><ArrowLeft/></Button>
        <Button onClick={() => onSound(current.word)} className="bg-purple-500 text-white px-10 rounded-2xl">LISTEN</Button>
        <Button size="icon" onClick={() => setIndex(p => (p + 1) % items.length)} className="bg-slate-100 rounded-full"><ArrowRight/></Button>
      </div>
    </div>
  );
};

/* --- 6. NUMBER BONDS --- */
const NumberBondsModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data] = useState(constants.NUMERACY_DATA.numberBonds || []);
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const current = data[index];
  useEffect(() => {setUserAnswer(null);}, [index]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center min-h-[550px]">
        <h3 className="text-4xl font-black text-pink-600 mb-8 uppercase">Friends of {current.target}!</h3>
        <div className="flex items-center gap-6 mb-10">
           <div className="w-20 h-20 bg-pink-500 text-white rounded-2xl flex items-center justify-center text-4xl font-black">{current.part1}</div>
           <Plus className="text-slate-400"/>
           <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center border-4 border-dashed text-4xl font-black", userAnswer === current.part2 ? 'bg-green-500 text-white' : 'bg-pink-50 text-pink-200')}>{userAnswer === current.part2 ? userAnswer : '?'}</div>
           <span className="text-4xl text-slate-400">=</span>
           <div className="w-20 h-20 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-4xl font-black">{current.target}</div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
           {Array.from({length: current.target + 1}).map((_, i) => (
             <Button key={i} onClick={() => { setUserAnswer(i); onSound(i === current.part2 ? "Correct!" : "Try again"); }} className={cn("w-14 h-14 rounded-xl text-xl", userAnswer === i ? 'bg-green-500' : 'bg-pink-50 text-pink-600')}>{i}</Button>
           ))}
        </div>
        {userAnswer === current.part2 && <Button onClick={() => setIndex((index + 1) % data.length)} className="mt-8 bg-green-500 text-white rounded-2xl px-10 h-14">NEXT BOND</Button>}
    </div>
  );
};

/* --- 7. ADDITION --- */
const AdditionModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data] = useState(constants.NUMERACY_DATA.addition || []);
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const current = data[index];
    const fetchVisual = useCallback(async () => {
        if (!current || !schoolId) return;
        const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
        if(res.success) setImageUrl(res.data || null);
    }, [current, schoolId]);
    useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data, fetchVisual]);
    if (!current) return null;
    return (
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center min-h-[600px]">
            <h3 className="text-4xl font-black text-orange-500 mb-10 uppercase">Addition! ➕</h3>
            <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                <div className="flex items-center gap-4">
                    <div className="flex gap-2 p-4 bg-orange-50 rounded-2xl border-2 border-orange-100">
                        {Array.from({length: current.val1}).map((_, i) => <IconRenderer key={i} iconName={current.icon} className="h-10 w-10 text-orange-600" />)}
                    </div>
                    <Plus className="h-10 w-10 text-slate-400" />
                    <div className="flex gap-2 p-4 bg-orange-50 rounded-2xl border-2 border-orange-100">
                        {Array.from({length: current.val2}).map((_, i) => <IconRenderer key={i} iconName={current.icon} className="h-10 w-10 text-orange-600" />)}
                    </div>
                </div>
                <div className="w-48 h-48 bg-white border-4 border-orange-50 rounded-[2.5rem] shadow-xl overflow-hidden relative">
                    {imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-2" alt={current.theme} />}
                </div>
            </div>
            <p className="text-6xl font-black text-slate-800 mb-10">{current.val1} + {current.val2} = ?</p>
            <div className="flex flex-wrap justify-center gap-3">
                {Array.from({length: 11}).map((_, i) => (
                    <Button key={i} onClick={() => { setUserAnswer(i); onSound(i === (current.val1+current.val2) ? "Perfect!" : "Keep counting"); }} className={cn("w-16 h-16 rounded-2xl font-black text-2xl", userAnswer === i ? (i === (current.val1+current.val2) ? 'bg-green-500' : 'bg-red-500') : 'bg-orange-50 text-slate-800')}>{i}</Button>
                ))}
            </div>
        </div>
    );
};

/* --- 8. SUBTRACTION --- */
const SubtractionModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [data] = useState(constants.NUMERACY_DATA.subtraction || []);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const current = data[index];
  const fetchVisual = useCallback(async () => {
    if (!current || !schoolId) return;
    const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
    if(res.success) setImageUrl(res.data || null);
  }, [current, schoolId]);
  useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data, fetchVisual]);
  if (!current) return null;
  const correct = current.val1 - current.val2;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-red-100 flex flex-col items-center">
        <h3 className="text-4xl font-black text-red-500 mb-10 uppercase">Subtraction! ➖</h3>
        <div className="flex items-center gap-4 mb-12">
            <div className="flex gap-2 p-4 bg-red-50 rounded-2xl">
              {Array.from({length: current.val1}).map((_, i) => <IconRenderer key={i} iconName={current.icon} className={cn("h-10 w-10", i >= (current.val1 - current.val2) ? 'text-slate-200 opacity-30' : 'text-red-600')} />)}
            </div>
            <Minus className="h-10 w-10 text-slate-400" />
            <div className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 rounded-xl text-3xl font-black">{current.val2}</div>
        </div>
        <p className="text-6xl font-black text-slate-800 mb-10">{current.val1} - {current.val2} = ?</p>
        <div className="flex flex-wrap justify-center gap-3">
            {Array.from({length: 11}).map((_, i) => (
                <Button key={i} onClick={() => { setUserAnswer(i); onSound(i === correct ? "Yes!" : "Try again"); }} className={cn("w-14 h-14 rounded-2xl", userAnswer === i ? (i === correct ? 'bg-green-500' : 'bg-red-500') : 'bg-red-50 text-slate-800')}>{i}</Button>
            ))}
        </div>
    </div>
  );
};

/* --- 9. TENS AND UNITS --- */
const TensUnitsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [data] = useState(constants.NUMERACY_DATA.tensUnits || []);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const current = data[index];
  const fetchVisual = useCallback(async () => {
    if (!current || !schoolId) return;
    const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
    if(res.success) setImageUrl(res.data || null);
  }, [current, schoolId]);
  useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-indigo-100 flex flex-col items-center min-h-[550px]">
      <h3 className="text-4xl font-black text-indigo-500 mb-8 uppercase">Tens and Units 📦</h3>
      <div className="flex items-center gap-12 mb-10">
         <div className="text-center"><p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Number</p><div className="w-24 h-24 bg-indigo-500 text-white rounded-2xl flex items-center justify-center text-5xl font-black shadow-xl">{current.number}</div></div>
         <span className="text-4xl text-slate-300">=</span>
         <div className="flex gap-4">
            <div className="text-center"><p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Tens</p><div className="w-16 h-16 border-4 border-indigo-200 text-indigo-600 rounded-xl flex items-center justify-center text-3xl font-black">{current.tens}</div></div>
            <div className="text-center"><p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Units</p><div className="w-16 h-16 border-4 border-indigo-200 text-indigo-600 rounded-xl flex items-center justify-center text-3xl font-black">{current.units}</div></div>
         </div>
      </div>
      <div className="w-full max-w-2xl aspect-video bg-indigo-50 rounded-[3rem] border-8 border-white overflow-hidden mb-10 cursor-pointer" onClick={() => onSound(`${current.number} has ${current.tens} ten and ${current.units} units`)}>
        {imageUrl && <img src={imageUrl} className="w-full h-full object-cover" />}
      </div>
      <div className="flex gap-4">
        <Button size="icon" onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="bg-slate-100 rounded-full"><ArrowLeft/></Button>
        <Button size="icon" onClick={() => setIndex(p => (p + 1) % data.length)} className="bg-slate-100 rounded-full"><ArrowRight/></Button>
      </div>
    </div>
  );
};

/* --- 10. GROUPING --- */
const GroupingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [data] = useState(constants.NUMERACY_DATA.grouping || []);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const current = data[index];
  const fetchVisual = useCallback(async () => {
    if (!current || !schoolId) return;
    const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
    if(res.success) setImageUrl(res.data || null);
  }, [current, schoolId]);
  useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center">
      <h3 className="text-4xl font-black text-emerald-500 mb-8 uppercase">Grouping Fun 🤝</h3>
      <div className="flex items-center gap-12 mb-10">
         <div className="text-center"><p className="text-xs font-black text-slate-500 uppercase mb-1">Group Size</p><div className="w-20 h-20 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-4xl font-black">{current.groupSize}</div></div>
         <ArrowRight className="text-slate-300"/>
         <div className="text-center"><p className="text-xs font-black text-slate-500 uppercase mb-1">Total {current.theme}</p><div className="w-20 h-20 bg-white border-4 border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center text-4xl font-black">{current.totalItems}</div></div>
      </div>
      <div className="w-full max-w-2xl aspect-video bg-emerald-50 rounded-[3rem] overflow-hidden mb-10">
        {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <Loader2 className="animate-spin m-auto"/>}
      </div>
      <Button onClick={() => setIndex((index + 1) % data.length)} className="bg-emerald-500 text-white rounded-xl h-12 px-10">NEXT TASK</Button>
    </div>
  );
};

/* --- 11. TELLING TIME --- */
const TellingTimeModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data] = useState(constants.NUMERACY_DATA.time || []);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const current = data[index];
  const options = useMemo(() => current ? [current.hour, (current.hour + 3) % 12 || 12, (current.hour + 6) % 12 || 12].sort(() => Math.random() - 0.5) : [], [current]);
  useEffect(() => { setAnswered(false); }, [index]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center min-h-[600px]">
        <h3 className="text-4xl font-black text-blue-500 mb-8 uppercase">Clock Time ⏰</h3>
        <div className="w-72 h-72 bg-blue-50 rounded-full border-8 border-white shadow-2xl flex items-center justify-center mb-12 relative cursor-pointer" onClick={() => onSound(current.phrase)}>
          <Clock className="h-40 w-40 text-blue-300" />
          <div className="absolute inset-0 flex items-center justify-center"><Volume2 className="text-blue-500 h-10 w-10 opacity-50"/></div>
        </div>
        <div className="flex gap-6">
          {options.map(opt => (
            <Button key={opt} onClick={() => { if(opt === current.hour) setAnswered(true); onSound(opt === current.hour ? "Yes!" : "No"); }} className={cn("px-10 py-5 rounded-3xl text-3xl", answered && opt === current.hour ? 'bg-green-500 text-white' : 'bg-blue-50 text-blue-600')}>{opt}:00</Button>
          ))}
        </div>
        {answered && <Button onClick={() => {setIndex((index + 1) % data.length); setAnswered(false);}} className="mt-8 bg-blue-500 text-white px-10 h-14 rounded-2xl">NEXT TIME</Button>}
    </div>
  );
};

/* --- 12. MONEY (Counting Coins) --- */
const MoneyCountingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [data] = useState(constants.NUMERACY_DATA.money || []);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const current = data[index];
  const fetchVisual = useCallback(async () => {
    if (!current || !schoolId) return;
    const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
    if(res.success) setImageUrl(res.data || null);
  }, [current, schoolId]);
  useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data, fetchVisual]);
  const options = useMemo(() => current ? [current.amount, current.amount + 1, current.amount - 1].filter(o => o >= 1).sort(() => Math.random() - 0.5) : [], [current]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-yellow-100 flex flex-col items-center">
        <h3 className="text-4xl font-black text-yellow-600 mb-8 uppercase">Counting Money! 💰</h3>
        <p className="text-2xl font-black text-slate-500 mb-10 italic">How many shiny coins can you see?</p>
        <div className="w-full max-w-2xl aspect-video bg-yellow-50 rounded-[3rem] border-8 border-white mb-10 overflow-hidden">
          {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover p-6" /> : <Loader2 className="animate-spin m-auto"/>}
        </div>
        <div className="flex gap-6">
           {options.map(opt => (
             <Button key={opt} onClick={() => { setUserAnswer(opt); onSound(opt === current.amount ? "Yes" : "Count again"); }} className={cn("w-24 h-24 rounded-3xl text-4xl", userAnswer === opt ? (opt === current.amount ? 'bg-green-500' : 'bg-red-500') : 'bg-yellow-50 text-yellow-600')}>{opt}</Button>
           ))}
        </div>
        {userAnswer === current.amount && <Button onClick={() => setIndex((index + 1) % data.length)} className="mt-12 bg-yellow-500 text-white rounded-2xl h-14 px-10">MORE COINS</Button>}
    </div>
  );
};

/* --- 13. MEASUREMENT --- */
const MeasurementModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [subTab, setSubTab] = useState<'weight' | 'height'>('weight');
  const [data] = useState(constants.NUMERACY_DATA.measurement || {});
  const [index, setIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
  const [answered, setAnswered] = useState(false);
  const current = data[subTab]?.[index];
  const fetchVisuals = useCallback(async () => {
    if (!current) return;
    const results = await Promise.all(current.items.map((i: any) => generateLessonImageAction({ prompt: i.prompt, schoolId })));
    setImageUrls(results.map(r => r.data || null));
  }, [current, schoolId]);
  useEffect(() => { setAnswered(false); fetchVisuals(); }, [index, subTab, data, fetchVisuals]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center">
      <div className="flex gap-4 mb-10">{(['weight', 'height'] as const).map(t => (<Button key={t} onClick={() => { setSubTab(t); setIndex(0); }} variant={subTab === t ? "default" : "outline"} className="px-8 rounded-xl">{t.toUpperCase()}</Button>))}</div>
      <h3 className="text-4xl font-black text-emerald-600 mb-12 uppercase">{current.q}</h3>
      <div className="flex gap-12 items-end">
        {current.items.map((item: any, idx: number) => (<Button key={idx} variant="ghost" onClick={() => { if(idx === current.correct) setAnswered(true); onSound(idx === current.correct ? "Yes" : "No"); }} className={cn("flex flex-col h-auto p-4 rounded-3xl border-4", answered && idx === current.correct ? 'border-green-400' : 'border-transparent')}><div className={cn("bg-emerald-50 rounded-[3rem] border-8 overflow-hidden", item.size === 'lg' ? 'w-56 h-56' : 'w-28 h-28', answered && idx === current.correct ? 'border-green-400' : 'border-white')}>{imageUrls[idx] && <img src={imageUrls[idx]!} className="w-full h-full object-cover" />}</div><span className="mt-4 text-xl font-black">{item.label}</span></Button>))}
      </div>
      {answered && <Button onClick={() => {setIndex((index + 1) % data[subTab].length); setAnswered(false);}} className="mt-12 bg-green-500 text-white rounded-2xl px-10 h-14">CONTINUE</Button>}
    </div>
  );
};

/* --- 14. SHAPES --- */
const ShapesModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [data] = useState(constants.NUMERACY_DATA.shapes || []);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const current = data[index];
  const fetchVisual = useCallback(async () => {
    if (!current || !schoolId) return;
    const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
    if(res.success) setImageUrl(res.data || null);
  }, [current, schoolId]);
  useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
  if (!current) return null;
  return (
    <div className="w-full flex flex-col items-center bg-white p-10 rounded-[4rem] shadow-2xl border-8 border-cyan-100">
        <h2 className="text-7xl font-black text-cyan-600 mb-8 uppercase">{current.name}</h2>
        <div className="w-80 h-80 bg-cyan-50 rounded-[3rem] overflow-hidden mb-10 cursor-pointer" onClick={() => onSound(`This is a ${current.name}`)}>
          {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <Loader2 className="animate-spin m-auto"/>}
        </div>
        <div className="flex gap-6">
            <Button size="icon" onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="bg-slate-100 rounded-full"><ArrowLeft/></Button>
            <Button onClick={() => onSound(current.name)} className="bg-cyan-500 text-white px-10 rounded-2xl">TEACH ME</Button>
            <Button size="icon" onClick={() => setIndex(p => (p + 1) % data.length)} className="bg-slate-100 rounded-full"><ArrowRight/></Button>
        </div>
    </div>
  );
};

/* --- 15. SPATIAL REASONING --- */
const SpatialModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [data] = useState(constants.NUMERACY_DATA.spatial || []);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const current = data[index];
  const fetchVisual = useCallback(async () => {
    if (!current || !schoolId) return;
    const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
    if(res.success) setImageUrl(res.data || null);
  }, [current, schoolId]);
  useEffect(() => { fetchVisual(); setAnswered(false); }, [index, data, fetchVisual]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center min-h-[550px]">
        <h3 className="text-4xl font-black text-blue-600 mb-8 uppercase">Where is it? 🕵️‍♀️</h3>
        <p className="text-2xl font-black text-slate-500 mb-10">Where is the <span className="text-blue-600">{current.target}</span>?</p>
        <div className="w-full max-w-2xl aspect-video bg-blue-50 rounded-[3rem] border-8 border-white overflow-hidden mb-10">
          {imageUrl && <img src={imageUrl} className="w-full h-full object-cover" />}
        </div>
        <div className="flex flex-wrap justify-center gap-4">
           {['above', 'below', 'beside'].map(pos => (
             <Button key={pos} onClick={() => { if(pos === current.position) setAnswered(true); onSound(pos === current.position ? "Yes" : "Try again"); }} className={cn("px-8 h-16 rounded-2xl text-xl", answered && pos === current.position ? 'bg-green-500 text-white scale-110' : 'bg-blue-50 text-blue-600')}>{pos.toUpperCase()}</Button>
           ))}
        </div>
        {answered && <Button onClick={() => {setIndex((index + 1) % data.length); setAnswered(false);}} className="mt-12 bg-green-500 text-white rounded-3xl h-14 px-10">FIND ANOTHER</Button>}
    </div>
  );
};

/* --- 16. COMPARISON (Visual) --- */
const ComparisonGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [data] = useState(constants.NUMERACY_DATA.comparisons || []);
  const [level, setLevel] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
  const currentLevel = data[level];
  const fetchVisuals = useCallback(async () => {
    if (!currentLevel) return;
    const results = await Promise.all(currentLevel.items.map((i: any) => generateLessonImageAction({ prompt: i.prompt, schoolId })));
    setImageUrls(results.map(r => r.data || null));
  }, [currentLevel, schoolId]);
  useEffect(() => { setAnswered(false); fetchVisuals(); }, [level, data, fetchVisuals]);
  if (!currentLevel) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center">
      <h3 className="text-4xl font-black text-red-400 mb-12 uppercase text-center">{currentLevel.q}</h3>
      <div className="flex gap-12 items-end">
        {currentLevel.items.map((item: any, idx: number) => (<Button key={idx} variant="ghost" onClick={() => { if(idx === currentLevel.correct) setAnswered(true); onSound(idx === currentLevel.correct ? "Yes" : "No"); }} className={cn("flex flex-col h-auto p-4 rounded-3xl border-4", answered && idx === currentLevel.correct ? 'border-green-400' : 'border-transparent')}><div className={cn("bg-orange-50 rounded-[3rem] border-8 overflow-hidden", item.size === 'lg' ? 'w-56 h-56' : 'w-28 h-28', answered && idx === currentLevel.correct ? 'border-green-400' : 'border-white')}>{imageUrls[idx] && <img src={imageUrls[idx]!} className="w-full h-full object-cover" />}</div><span className="mt-4 text-xl font-black">{item.label}</span></Button>))}
      </div>
      {answered && <Button onClick={() => {setLevel((level + 1) % data.length); setAnswered(false);}} className="mt-8 bg-green-500 text-white rounded-2xl px-10 h-14">NEXT LEVEL</Button>}
    </div>
  );
};

/* --- 17. PATTERNS --- */
const PatternGame: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data] = useState(constants.NUMERACY_DATA.patterns || []);
  const [level, setLevel] = useState(0);
  const [answered, setAnswered] = useState(false);
  const currentPattern = data[level];
  useEffect(() => { setAnswered(false); }, [level]);
  if (!currentPattern) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center">
      <h3 className="text-3xl font-black text-blue-500 mb-12 uppercase">What comes next?</h3>
      <div className="flex gap-4 mb-16 bg-blue-50 p-8 rounded-[3rem] border-4 border-dashed border-blue-200">
        {currentPattern.sequence.map((item: string, idx: number) => (<div key={idx} className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md"><IconRenderer iconName={`fa-${item}`} className="text-4xl text-blue-500" /></div>))}
      </div>
      <div className="flex gap-8">
        {currentPattern.options.map((opt: string, idx: number) => (<Button key={idx} onClick={() => { if(opt === currentPattern.next) setAnswered(true); onSound(opt === currentPattern.next ? "Success" : "Try again"); }} className={cn("w-32 h-32 bg-white rounded-[2rem] border-8 shadow-xl", answered && opt === currentPattern.next ? 'border-green-400 scale-110' : 'border-slate-100')}><IconRenderer iconName={`fa-${opt}`} className="text-6xl text-blue-500" /></Button>))}
      </div>
      {answered && <Button onClick={() => {setLevel((level + 1) % data.length); setAnswered(false);}} className="mt-10 bg-green-500 text-white rounded-xl px-10 h-14">CONTINUE</Button>}
    </div>
  );
};

/* --- 18. ONE-TO-ONE MATCHING --- */
const OneToOneGame: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {
  const [data] = useState(constants.NUMERACY_DATA.oneToOne || []);
  const [level, setLevel] = useState(0);
  const [givenCount, setGivenCount] = useState(0);
  const current = data[level];
  useEffect(() => { setGivenCount(0); }, [level]);
  if (!current) return null;
  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-cyan-100 flex flex-col items-center min-h-[550px]">
      <h3 className="text-3xl font-black text-cyan-600 mb-8 uppercase">One for You, One for Me!</h3>
      <p className="text-slate-500 mb-10 italic">Give each {current.name} one {current.itemName}!</p>
      <div className="flex flex-col gap-16 items-center">
        <div className="flex gap-8 flex-wrap">
          {Array.from({ length: current.count }).map((_, i) => (<div key={i} className="relative"><IconRenderer iconName={`fa-${current.character}`} className={cn("h-16 w-16", i < givenCount ? 'text-cyan-500 scale-110' : 'text-cyan-200')} />{i < givenCount && (<div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce"><IconRenderer iconName={`fa-${current.item}`} className="text-orange-500 h-10 w-10" /></div>)}</div>))}
        </div>
        <div className="flex gap-6">
          {Array.from({ length: current.count }).map((_, i) => (<Button key={i} onClick={() => { setGivenCount(prev => prev + 1); onSound("Here you go"); }} disabled={i < givenCount} className={cn("w-20 h-20 bg-cyan-50 rounded-2xl border-4", i < givenCount ? 'opacity-0 scale-0' : 'border-white shadow-md')}><IconRenderer iconName={`fa-${current.item}`} className="h-10 w-10 text-cyan-600" /></Button>))}
        </div>
      </div>
      {givenCount === current.count && <Button onClick={() => setLevel((level + 1) % data.length)} className="mt-12 bg-green-500 text-white rounded-xl px-10 h-14">NEXT PUZZLE</Button>}
    </div>
  );
};

/* --- 19. NUMBER TRACING (Magic Pen) --- */
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
    ctx.font = '900 300px Nunito';
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