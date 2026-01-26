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
import confetti from 'canvas-confetti';
import { useRole } from '@/context/role-context';

const {
    Loader2, Wand2, ArrowLeft, ArrowRight, Volume2, Smile, 
    Ear, Layers, Image: ImageIcon, Sparkles, HelpCircle, 
    Zap, CircleDot, User, Beaker, Eye, Hash, ListOrdered, Scale, 
    Handshake, Plus, Minus, Coins, Ruler, Move, CheckSquare, ArrowLeftRight, PenTool, 
    Clock, ObjectGroup, Users, Drama, BrainCircuit, Music, Atom, Heart, Star, Tv, Rabbit,
    Type, Palette, Utensils, Trash2, Calculator, Shapes, Apple, Cookie, Carrot, PenLine, GripVertical, GripHorizontal, ChevronUp, ChevronDown, Circle, ThumbsUp, CheckCheck, Puzzle, Box, Car, Play
} = LucideIcons;

// --- ROBUST ICON RENDERER ---
const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const iconMap: Record<string, keyof typeof LucideIcons> = {
      'fa-1': 'Hash', 'fa-list-ol': 'ListOrdered', 'fa-arrow-right-long': 'ArrowRight', 'fa-scale-unbalanced': 'Scale', 'fa-font': 'Type', 
      'fa-handshake': 'Handshake', 'fa-plus': 'Plus', 'fa-minus': 'Minus', 'fa-layer-group': 'Layers', 'fa-object-group': 'ObjectGroup', 
      'fa-clock': 'Clock', 'fa-coins': 'Coins', 'fa-ruler-vertical': 'Ruler', 'fa-shapes': 'Shapes', 'fa-arrows-up-down-left-right': 'Move', 
      'fa-scale-balanced': 'Scale', 'fa-square-check': 'CheckSquare', 'fa-arrows-left-right': 'ArrowLeftRight', 'fa-pen-clip': 'PenTool',
      'fa-magic': 'Wand2', 'fa-spinner': 'Loader2', 'fa-volume-high': 'Volume2', 'fa-play': 'Play', 'fa-face-smile': 'Smile', 'fa-brain': 'BrainCircuit',
      'fa-apple-whole': 'Apple', 'fa-star': 'Star', 'fa-heart': 'Heart', 'fa-car': 'Car', 'fa-bolt': 'Zap', 'fa-cookie': 'Cookie', 'fa-rabbit': 'Rabbit',
      'fa-carrot': 'Carrot', 'fa-lines-leaning': 'PenLine', 'fa-grip-lines-vertical': 'GripVertical', 'fa-grip-lines': 'GripHorizontal',
      'fa-chevron-up': 'ChevronUp', 'fa-chevron-down': 'ChevronDown', 'fa-circle': 'Circle', 'fa-trash-can': 'Trash2', 'fa-thumbs-up': 'ThumbsUp',
      'fa-check-double': 'CheckCheck',
      'fa-puzzle-piece': 'Puzzle',
      'fa-cube': 'Box',
    };
    const LucideName = iconMap[iconName] || 'HelpCircle';
    const IconComponent = (LucideIcons as any)[LucideName];
    if (!IconComponent) {
        return <HelpCircle className={className} />;
    }
    return <IconComponent className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} />;
};

type MathWorldTab = 'grouping' | 'time' | 'money' | 'measurement' | 'shapes' | 'spatial' | 'comparison' | 'patterns' | 'one-to-one';

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
        <div className="text-center p-12 bg-white rounded-[3rem] shadow-xl border-8 border-sky-50 animate-in fade-in zoom-in">
            <IconRenderer iconName={icon} className="h-20 w-20 mx-auto text-sky-300 mb-6" />
            <h3 className="text-4xl font-black text-sky-600 mb-4 uppercase tracking-tighter">{title}</h3>
            <p className="text-slate-500 mb-8 font-bold">Are you ready to explore and solve puzzles?</p>
            <Button onClick={onStart} size="lg" className="bg-sky-500 hover:bg-sky-600 text-white font-black px-12 py-8 rounded-2xl text-2xl shadow-2xl hover:scale-105 transition-all">LET'S GO!</Button>
        </div>
    );
    return (
        <div className="relative">
            <Button variant="ghost" onClick={onClose} className="absolute -top-16 left-0 text-slate-400 hover:text-sky-500 font-black uppercase text-xs tracking-widest"><ArrowLeft className="mr-2 h-4 w-4"/> Close Activity</Button>
            {children}
        </div>
    );
};

const TeacherModal: React.FC<{ title: string; topicLabel: string; topicValue: string; onTopicChange: (v: string) => void; onGenerate: () => void; isLoading: boolean; onClose: () => void; }> = ({ title, topicLabel, topicValue, onTopicChange, onGenerate, isLoading, onClose }) => (
    <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="rounded-[3rem] border-8 border-sky-100">
            <DialogHeader><DialogTitle className="text-3xl font-black uppercase tracking-tighter">{title}</DialogTitle></DialogHeader>
            <div className="space-y-6 py-4">
                <div>
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">{topicLabel}</Label>
                    <Input type="text" value={topicValue} onChange={(e) => onTopicChange(e.target.value)} placeholder="Type here..." className="mt-2 h-14 rounded-2xl border-4 border-slate-50 font-black" />
                </div>
                <Button onClick={onGenerate} disabled={isLoading || !topicValue} className="w-full h-16 rounded-2xl bg-sky-500 hover:bg-sky-600 font-black text-xl shadow-xl text-white">
                    {isLoading ? <><Loader2 className="animate-spin mr-2"/> GENERATING...</> : <><Sparkles className="mr-2 h-6 w-6"/> CREATE MAGIC</>}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
);

// --- MODULES ---

const GroupingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [data, setData] = useState(constants.NUMERACY_DATA.grouping || []);
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
        const result = await generateMathWorldEntry(aiTopic, 'grouping', schoolId);
        if(result.success && result.data) { setData(prev => [...prev, result.data]); setIsDrawerOpen(false); setIndex(data.length); setAiTopic(''); }
        setIsAiLoading(false);
    };
    if (!current) return null;
    return (
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center relative">
            {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute top-4 right-4 rounded-full border-2 border-emerald-200 text-emerald-600 uppercase text-[10px]"><Wand2 className="h-3 w-3 mr-1"/> AI Maker</Button>}
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
            {isDrawerOpen && <TeacherModal title="AI Grouping Assistant" topicLabel="Theme" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
};

const TellingTimeModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [data, setData] = useState(constants.NUMERACY_DATA.time || []);
    const [index, setIndex] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const current = data[index];
    const options = useMemo(() => current ? [current.hour, (current.hour + 3) % 12 || 12, (current.hour + 6) % 12 || 12].sort(() => Math.random() - 0.5) : [], [current]);
    useEffect(() => { setAnswered(false); }, [index]);
    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        const result = await generateMathWorldEntry(aiTopic, 'time', schoolId);
        if(result.success && result.data) { setData(prev => [...prev, result.data]); setIsDrawerOpen(false); setIndex(data.length); setAiTopic(''); }
        setIsAiLoading(false);
    };
    if (!current) return null;
    return (
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center min-h-[600px] relative">
            {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute top-4 right-4 rounded-full border-2 border-blue-200 text-blue-600 uppercase text-[10px]"><Wand2 className="h-3 w-3 mr-1"/> AI Maker</Button>}
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
            {answered && <Button onClick={() => setIndex((index + 1) % data.length)} className="mt-8 bg-blue-500 text-white px-10 h-14 rounded-2xl">NEXT TIME</Button>}
            {isDrawerOpen && <TeacherModal title="AI Time Assistant" topicLabel="Time Theme" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
};

const MoneyCountingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [data, setData] = useState(constants.NUMERACY_DATA.money || []);
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
    useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data, fetchVisual]);
    const options = useMemo(() => current ? [current.amount, current.amount + 1, current.amount - 1].filter(o => o >= 1).sort(() => Math.random() - 0.5) : [], [current]);
    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        const result = await generateMathWorldEntry(aiTopic, 'money', schoolId);
        if(result.success && result.data) { setData(prev => [...prev, result.data]); setIsDrawerOpen(false); setIndex(data.length); setAiTopic(''); }
        setIsAiLoading(false);
    };
    if (!current) return null;
    return (
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-yellow-100 flex flex-col items-center relative">
            {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute top-4 right-4 rounded-full border-2 border-yellow-200 text-yellow-600 uppercase text-[10px]"><Wand2 className="h-3 w-3 mr-1"/> AI Maker</Button>}
            <h3 className="text-4xl font-black text-yellow-600 mb-8 uppercase">Counting Money! 💰</h3>
            <p className="text-2xl font-black text-slate-500 mb-10 italic">How many shiny coins can you see?</p>
            <div className="w-full max-w-2xl aspect-video bg-yellow-50 rounded-[3rem] border-8 border-white mb-10 overflow-hidden">
                {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover p-6" alt="coins" /> : <Loader2 className="animate-spin m-auto"/>}
            </div>
            <div className="flex gap-6">
               {options.map(opt => (
                 <Button key={opt} onClick={() => { setUserAnswer(opt); onSound(opt === current.amount ? "Yes" : "Count again"); }} className={cn("w-24 h-24 rounded-3xl text-4xl", userAnswer === opt ? (opt === current.amount ? 'bg-green-500' : 'bg-red-500') : 'bg-yellow-50 text-yellow-600')}>{opt}</Button>
               ))}
            </div>
            {userAnswer === current.amount && <Button onClick={() => setIndex((index + 1) % data.length)} className="mt-12 bg-yellow-500 text-white rounded-2xl h-14 px-10">MORE COINS</Button>}
            {isDrawerOpen && <TeacherModal title="AI Money Game" topicLabel="Item to Count" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
};

const MeasurementModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [subTab, setSubTab] = useState<'weight' | 'height'>('weight');
    const [data, setData] = useState(constants.NUMERACY_DATA.measurement || {});
    const [index, setIndex] = useState(0);
    const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
    const [answered, setAnswered] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const current = data[subTab]?.[index];
    const fetchVisuals = useCallback(async () => {
        if (!current) return;
        const results = await Promise.all(current.items.map((i: any) => generateLessonImageAction({ prompt: i.prompt, schoolId })));
        setImageUrls(results.map(r => r.data || null));
    }, [current, schoolId]);
    useEffect(() => { setAnswered(false); fetchVisuals(); }, [index, subTab, data, fetchVisuals]);
    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        const result = await generateMathWorldEntry(aiTopic, 'measurement', schoolId);
        if(result.success && result.data) { setData(prev => ({...prev, [subTab]: [...prev[subTab], result.data]})); setIsDrawerOpen(false); setIndex(data[subTab].length); setAiTopic(''); }
        setIsAiLoading(false);
    };
    if (!current) return null;
    return (
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center relative">
            {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute top-4 right-4 rounded-full border-2 border-emerald-200 text-emerald-600 uppercase text-[10px]"><Wand2 className="h-3 w-3 mr-1"/> AI Maker</Button>}
            <div className="flex gap-4 mb-10">{(['weight', 'height'] as const).map(t => (<Button key={t} onClick={() => { setSubTab(t); setIndex(0); }} variant={subTab === t ? "default" : "outline"} className="px-8 rounded-xl">{t.toUpperCase()}</Button>))}</div>
            <h3 className="text-4xl font-black text-emerald-600 mb-12 uppercase">{current.q}</h3>
            <div className="flex gap-12 items-end">
                {current.items.map((item: any, idx: number) => (<Button key={idx} variant="ghost" onClick={() => { if(idx === current.correct) setAnswered(true); onSound(idx === current.correct ? "Yes" : "No"); }} className={cn("flex flex-col h-auto p-4 rounded-3xl border-4", answered && idx === current.correct ? 'border-green-400 scale-110' : 'border-transparent')}><div className={cn("bg-emerald-50 rounded-[3rem] border-8 overflow-hidden", item.size === 'lg' ? 'w-56 h-56' : 'w-28 h-28', answered && idx === current.correct ? 'border-green-400' : 'border-white')}>{imageUrls[idx] && <img src={imageUrls[idx]!} className="w-full h-full object-cover" />}</div><span className="mt-4 text-xl font-black">{item.label}</span></Button>))}
            </div>
            {answered && <Button onClick={() => {setIndex((index + 1) % data[subTab].length); setAnswered(false);}} className="mt-12 bg-green-500 text-white rounded-2xl px-10 h-14">CONTINUE</Button>}
            {isDrawerOpen && <TeacherModal title="AI Comparison Game" topicLabel="Item to Compare" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
};

const ShapesModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [data, setData] = useState(constants.NUMERACY_DATA.shapes || []);
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
        const result = await generateMathWorldEntry(aiTopic, 'shapes', schoolId);
        if(result.success && result.data) { setData(prev => [...prev, result.data]); setIsDrawerOpen(false); setIndex(data.length); setAiTopic(''); }
        setIsAiLoading(false);
    };
    if (!current) return null;
    return (
        <div className="w-full flex flex-col items-center bg-white p-10 rounded-[4rem] shadow-2xl border-8 border-cyan-100 relative">
            {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute top-4 right-4 rounded-full border-2 border-cyan-200 text-cyan-600 uppercase text-[10px]"><Wand2 className="h-3 w-3 mr-1"/> AI Maker</Button>}
            <h2 className="text-7xl font-black text-cyan-600 mb-8 uppercase">{current.name}</h2>
            <div className="w-80 h-80 bg-cyan-50 rounded-[3rem] overflow-hidden mb-10 cursor-pointer" onClick={() => onSound(`This is a ${current.name}`)}>
                {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" /> : <Loader2 className="animate-spin m-auto"/>}
            </div>
            <div className="flex gap-6">
                <Button size="icon" onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="bg-slate-100 rounded-full"><ArrowLeft/></Button>
                <Button onClick={() => onSound(current.name)} className="bg-cyan-500 text-white px-10 rounded-2xl">TEACH ME</Button>
                <Button size="icon" onClick={() => setIndex(p => (p + 1) % data.length)} className="bg-slate-100 rounded-full"><ArrowRight/></Button>
            </div>
            {isDrawerOpen && <TeacherModal title="AI Shape Maker" topicLabel="Shape Name" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
};

const SpatialModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [data, setData] = useState(constants.NUMERACY_DATA.spatial || []);
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [answered, setAnswered] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const current = data[index];
    const fetchVisual = useCallback(async () => {
        if (!current || !schoolId) return;
        const res = await generateLessonImageAction({ prompt: current.prompt, schoolId });
        if(res.success) setImageUrl(res.data || null);
    }, [current, schoolId]);
    useEffect(() => { fetchVisual(); setAnswered(false); }, [index, data, fetchVisual]);
    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        const result = await generateMathWorldEntry(aiTopic, 'spatial', schoolId);
        if(result.success && result.data) { setData(prev => [...prev, result.data]); setIsDrawerOpen(false); setIndex(data.length); setAiTopic(''); }
        setIsAiLoading(false);
    };
    if (!current) return null;
    return (
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center min-h-[550px] relative">
            {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute top-4 right-4 rounded-full border-2 border-blue-200 text-blue-600 uppercase text-[10px]"><Wand2 className="h-3 w-3 mr-1"/> AI Maker</Button>}
            <h3 className="text-4xl font-black text-blue-600 mb-8 uppercase">Where is it? 🕵️‍♀️</h3>
            <p className="text-2xl font-black text-slate-500 mb-10">Where is the <span className="text-blue-600">{current.target}</span>?</p>
            <div className="w-full max-w-2xl aspect-video bg-blue-50 rounded-[3rem] border-8 border-white overflow-hidden mb-10">
                {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" alt="spatial reasoning"/> : <Loader2 className="animate-spin m-auto"/>}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
               {['above', 'below', 'beside'].map(pos => (
                 <Button key={pos} onClick={() => { if(pos === current.position) setAnswered(true); onSound(pos === current.position ? "Yes" : "Try again"); }} className={cn("px-8 h-16 rounded-2xl text-xl", answered && pos === current.position ? 'bg-green-500 text-white scale-110' : 'bg-blue-50 text-blue-600')}>{pos.toUpperCase()}</Button>
               ))}
            </div>
            {answered && <Button onClick={() => setIndex((index + 1) % data.length)} className="mt-12 bg-green-500 text-white rounded-3xl h-14 px-10">FIND ANOTHER</Button>}
            {isDrawerOpen && <TeacherModal title="AI Puzzle Maker" topicLabel="Puzzle Theme" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
};

const ComparisonGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [data, setData] = useState(constants.NUMERACY_DATA.comparisons || []);
    const [level, setLevel] = useState(0);
    const [answered, setAnswered] = useState<number|null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const currentLevel = data[level];
    useEffect(() => { setAnswered(null); }, [level]);
    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        const result = await generateMathWorldEntry(aiTopic, 'comparison', schoolId);
        if(result.success && result.data) { setData(prev => [...prev, result.data]); setIsDrawerOpen(false); setLevel(data.length); setAiTopic(''); }
        setIsAiLoading(false);
    };
    if (!currentLevel) return null;
    const handleChoice = (val: number) => {
        setAnswered(val);
        const isCorrect = val === currentLevel.answer;
        if (isCorrect) { onSound("Perfect!"); confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); } 
        else { onSound("Check again"); }
    };
    return (
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center relative">
            {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute top-4 right-4 rounded-full border-2 border-orange-200 text-orange-600 uppercase text-[10px]"><Wand2 className="h-3 w-3 mr-1"/> AI Maker</Button>}
            <h3 className="text-4xl font-black text-red-400 mb-12 uppercase text-center">{currentLevel.q}</h3>
            <div className="flex gap-12 items-center">
                <Button onClick={() => handleChoice(currentLevel.val1)} className={cn("w-32 h-40 rounded-3xl text-6xl font-black", answered === currentLevel.val1 ? (currentLevel.val1 === currentLevel.answer ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-orange-50 text-orange-600 hover:bg-orange-100')}>
                    {currentLevel.val1}
                </Button>
                <ArrowLeftRight className="text-slate-300 h-12 w-12"/>
                <Button onClick={() => handleChoice(currentLevel.val2)} className={cn("w-32 h-40 rounded-3xl text-6xl font-black", answered === currentLevel.val2 ? (currentLevel.val2 === currentLevel.answer ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-orange-50 text-orange-600 hover:bg-orange-100')}>
                    {currentLevel.val2}
                </Button>
            </div>
            {answered === currentLevel.answer && <Button onClick={() => setLevel((level + 1) % data.length)} className="mt-8 bg-green-500 text-white rounded-2xl px-10 h-14">NEXT LEVEL</Button>}
            {isDrawerOpen && <TeacherModal title="AI Comparison Game" topicLabel="Theme" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
};

const PatternGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [data, setData] = useState(constants.NUMERACY_DATA.patterns || []);
    const [level, setLevel] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const currentPattern = data[level];
    useEffect(() => { setAnswered(false); }, [level]);
    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        const result = await generateMathWorldEntry(aiTopic, 'patterns', schoolId);
        if(result.success && result.data) { setData(prev => [...prev, result.data]); setIsDrawerOpen(false); setLevel(data.length); setAiTopic(''); }
        setIsAiLoading(false);
    };
    if (!currentPattern) return null;
    return (
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center relative">
            {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute top-4 right-4 rounded-full border-2 border-blue-200 text-blue-600 uppercase text-[10px]"><Wand2 className="h-3 w-3 mr-1"/> AI Maker</Button>}
            <h3 className="text-3xl font-black text-blue-500 mb-12 uppercase">What comes next?</h3>
            <div className="flex gap-4 mb-16 bg-blue-50 p-8 rounded-[3rem] border-4 border-dashed border-blue-200">
                {currentPattern.sequence.map((item: string, idx: number) => (<div key={idx} className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-md"><IconRenderer iconName={`fa-${item}`} className="text-4xl text-blue-500" /></div>))}
            </div>
            <div className="flex gap-8">
                {currentPattern.options.map((opt: string, idx: number) => (<Button key={idx} onClick={() => { if(opt === currentPattern.next) setAnswered(true); onSound(opt === currentPattern.next ? "Success" : "Try again"); }} className={cn("w-32 h-32 bg-white rounded-[2rem] border-8 shadow-xl", answered && opt === currentPattern.next ? 'border-green-400 scale-110' : 'border-slate-100')}><IconRenderer iconName={`fa-${opt}`} className="text-6xl text-blue-500" /></Button>))}
            </div>
            {answered && <Button onClick={() => setLevel((level + 1) % data.length)} className="mt-10 bg-green-500 text-white rounded-xl px-10 h-14">CONTINUE</Button>}
            {isDrawerOpen && <TeacherModal title="AI Pattern Maker" topicLabel="Theme" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
};

const OneToOneGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [data, setData] = useState(constants.NUMERACY_DATA.oneToOne || []);
    const [level, setLevel] = useState(0);
    const [givenCount, setGivenCount] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const current = data[level];
    useEffect(() => { setGivenCount(0); }, [level]);
    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        const result = await generateMathWorldEntry(aiTopic, 'one-to-one', schoolId);
        if(result.success && result.data) { setData(prev => [...prev, result.data]); setIsDrawerOpen(false); setLevel(data.length); setAiTopic(''); }
        setIsAiLoading(false);
    };
    if (!current) return null;
    return (
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-cyan-100 flex flex-col items-center min-h-[550px] relative">
            {canEdit && <Button onClick={() => setIsDrawerOpen(true)} variant="outline" className="absolute top-4 right-4 rounded-full border-2 border-cyan-200 text-cyan-600 uppercase text-[10px]"><Wand2 className="h-3 w-3 mr-1"/> AI Maker</Button>}
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
            {isDrawerOpen && <TeacherModal title="AI Matching Game" topicLabel="Theme (e.g. animal and food)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
};
