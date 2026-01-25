
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';
import * as constants from '@/lib/constants';
import { generateLessonImageAction, generateTTSAction, generateMathWorldEntry } from '@/ai/flows/junior-actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { Loader2, Wand2, ArrowLeft, ArrowRight, Volume2, Play, Smile, CaseSensitive, BookOpen, Ear, Layers, Repeat, Mic, Underline, Signpost, Image as ImageIcon, Hand, Gamepad2, CheckCircle2, XCircle, PlusCircle, Sparkles, FolderOpen, Car, Earth, HeartPulse, CloudSun, PawPrint, Shapes, Languages, Pen, Apple, Sun, CloudRain, Guitar, Plane, MousePointer2, Cube, Carrot, Cookie, School, Home, Recycle, Water, Droplets, HelpCircle, MessageSquare, Drama, Flag, GraduationCap, Monitor, Zap, CircleDot, User, Beaker, Bed, Eye, Hash, ListOrdered, Scale, Handshake, Plus, Minus, Coins, Ruler, Move, CheckSquare, ArrowLeftRight, PenTool, Bot } from 'lucide-react';

const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const iconMap: Record<string, keyof typeof LucideIcons> = {
      'fa-1': 'Hash', 'fa-list-ol': 'ListOrdered', 'fa-scale-unbalanced': 'Scale', 'fa-handshake': 'Handshake', 'fa-plus': 'Plus', 'fa-minus': 'Minus', 'fa-coins': 'Coins', 'fa-ruler-vertical': 'Ruler', 'fa-shapes': 'Shapes', 'fa-arrows-up-down-left-right': 'Move', 'fa-scale-balanced': 'Scale', 'fa-square-check': 'CheckSquare', 'fa-arrows-left-right': 'ArrowLeftRight', 'fa-pen-clip': 'PenTool',
      'fa-spell-check': 'Languages', 'fa-ear-listen': 'Ear', 'fa-pen-nib': 'Pen', 'fa-arrow-1-9': 'Calculator', 'fa-hand-holding-heart': 'Handshake', 'fa-flask-vial': 'Beaker',
      'fa-palette': 'Palette', 'fa-robot': 'Bot', 'fa-face-smile': 'Smile', 'fa-tooth': 'Sparkles',
      'fa-heart-pulse': 'HeartPulse', 'fa-vest': 'User', 'fa-sun': 'Sun', 'fa-utensils': 'Utensils',
      'fa-school': 'School', 'fa-house': 'Home', 'fa-recycle': 'Recycle', 'fa-water': 'Droplets', 'fa-broom': 'Trash2', 'fa-flag': 'Flag', 'fa-hand-pointer': 'MousePointer2', 'fa-cube': 'Cube', 'fa-chalkboard-user': 'User', 'fa-rabbit': 'Rabbit', 'fa-carrot': 'Carrot', 'fa-apple-whole': 'Apple', 'fa-cookie': 'Cookie', 'fa-star': 'Star', 'fa-tv': 'Tv', 'fa-bed': 'Bed', 'fa-eye': 'Eye', 'fa-cloud-showers-heavy': 'CloudRain', 'fa-guitar': 'Guitar', 'fa-plane': 'Plane', 'fa-car': 'Car', 'fa-frog': 'Rabbit', 'fa-bolt': 'Zap', 'fa-circle-dot': 'CircleDot', 'fa-soap': 'Sparkles', 'fa-broccoli': 'Carrot', 'fa-display': 'Monitor', 'fa-graduation-cap': 'GraduationCap', 'fa-comments': 'MessageSquare', 'fa-people-group': 'Users', 'fa-masks-theater': 'Drama', 'fa-brain': 'BrainCircuit', 'fa-child-reaching': 'User', 'fa-music': 'Music', 'fa-magic': 'Wand2', 'fa-arrow-left': 'ArrowLeft', 'fa-arrow-right': 'ArrowRight', 'fa-spinner': 'Loader2', 'fa-volume-high': 'Volume2', 'fa-dna': 'Atom', 'fa-play': 'Play', 'fa-heart': 'Heart', 'fa-face-smile-wink': 'Smile'
    };
  
    const LucideName = iconMap[iconName] || 'HelpCircle';
    const IconComponent = (LucideIcons as any)[LucideName];
    if (!IconComponent || typeof IconComponent !== 'function') { return <LucideIcons.HelpCircle className={className} />; }
    return <IconComponent className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} />;
};

type MathTab = 'numbers' | 'counting' | 'sequence' | 'comparing' | 'number-words' | 'bonds' | 'addition' | 'subtraction' | 'tens-units' | 'grouping' | 'time' | 'money' | 'measurement' | 'shapes' | 'spatial' | 'comparison' | 'patterns' | 'one-to-one' | 'tracing';

const TeacherModal: React.FC<{
  title: string; topicLabel: string; topicValue: string; 
  onTopicChange: (v: string) => void; onGenerate: () => void; 
  isLoading: boolean; onClose: () => void;
}> = ({ title, topicLabel, topicValue, onTopicChange, onGenerate, isLoading, onClose }) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
      <div className="space-y-6 py-4">
        <div>
          <Label>{topicLabel}</Label>
          <Input 
            type="text" 
            autoFocus
            value={topicValue} 
            onChange={(e) => onTopicChange(e.target.value)} 
            placeholder="Type here..." 
            className="mt-2" 
          />
        </div>
        <Button 
          onClick={onGenerate} 
          disabled={isLoading || !topicValue} 
          className="w-full bg-purple-500 hover:bg-purple-600"
        >
          {isLoading ? <><Loader2 className="animate-spin mr-2"/> GENERATING...</> : <><Sparkles className="mr-2 h-4 w-4"/> CREATE MAGIC</>}
        </Button>
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

// --- START OF SUBMODULE DEFINITIONS ---

const NumbersMainModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.NUMERACY_DATA.numbers);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
  
    const current = data[index];
    const fetchVisual = useCallback(async () => { setLoading(true); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
    useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
    const handleLearn = () => onSound(`This is number ${current.value}. Let's count!`);
  
    const generateWithAi = async () => {
      if (!aiTopic) return; setIsAiLoading(true);
      try {
        const result = await generateMathWorldEntry(aiTopic, 'numbers', schoolId);
        if(result.success && result.data) {
          setData(prev => prev.map((item, i) => i === index ? { ...item, ...result.data } as any : item));
          setIsDrawerOpen(false); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-purple-200 text-purple-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase tracking-widest z-10 hover:bg-purple-50 transition-colors font-black"><IconRenderer iconName="fa-magic" className="w-4 h-4 mr-1 inline-block"/> Custom Theme</button>
        <div className="w-full flex flex-col items-center bg-white p-10 rounded-[4rem] shadow-2xl border-8 border-purple-100 animate-in zoom-in duration-500 min-h-[550px]">
          <h2 className="text-9xl font-black text-purple-600 mb-2 drop-shadow-xl">{current.value}</h2>
          <p className="text-3xl font-black text-slate-500 italic mb-10">{current.word || current.value}</p>
          <div onClick={handleLearn} className="w-80 h-80 bg-purple-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
            {loading ? <Loader2 className="w-16 h-16 animate-spin text-purple-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={`Number ${current.value}`} />}
          </div>
          <div className="flex gap-6 font-black"><Button onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 shadow-md font-black"><IconRenderer iconName="fa-arrow-left" className="text-2xl" /></Button><Button onClick={handleLearn} className="px-10 py-3 bg-purple-500 text-white font-black rounded-2xl shadow-xl uppercase border-4 border-white hover:scale-105 transition-all font-black">Learn</Button><Button onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 shadow-md font-black"><IconRenderer iconName="fa-arrow-right" className="text-2xl" /></Button></div>
        </div>
        {isDrawerOpen && <TeacherModal title="Change Number Theme" topicLabel="New Topic (e.g. Blue Cats)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const CountingGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.COUNTING_TASK_DATA);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
  
    const current = data[index];
    const options = [current.count, current.count + 1, current.count - 1].filter(o => o > 0).sort(() => Math.random() - 0.5);
  
    const fetchVisual = useCallback(async () => { setLoading(true); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
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
        if(result.success && result.data){
          setData(prev => [...prev, result.data as any]);
          setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-emerald-200 text-emerald-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-emerald-50 transition-colors font-black"><IconRenderer iconName="fa-magic" /> AI Counting</button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center min-h-[550px]">
          <h3 className="text-4xl font-black text-emerald-600 mb-10 uppercase tracking-tighter text-center">How Many? 🧮</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full font-black">
             <div onClick={() => onSound(`How many ${current.theme.toLowerCase()} can you see?`)} className="relative aspect-square bg-emerald-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center overflow-hidden cursor-pointer group">
                {loading ? <Loader2 className="w-16 h-16 animate-spin text-emerald-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={current.theme} />}
             </div>
             <div className="flex flex-col items-center font-black">
                <p className="text-2xl font-black text-slate-500 mb-8 uppercase tracking-widest text-center font-black">Count the {current.theme}!</p>
                <div className="grid grid-cols-3 gap-4 font-black">
                   {options.map(opt => (
                     <button key={opt} onClick={() => handleAnswer(opt)} className={`w-20 h-20 rounded-3xl font-black text-4xl transition-all border-4 ${userAnswer === opt ? (opt === current.count ? 'bg-green-500 text-white border-white scale-110 shadow-xl font-black' : 'bg-red-500 text-white border-white font-black') : 'bg-emerald-50 text-emerald-600 border-white hover:bg-emerald-100 font-black'}`}>{opt}</button>
                   ))}
                </div>
             </div>
          </div>
          {userAnswer === current.count && <button onClick={() => setIndex(p => (p + 1) % data.length)} className="mt-12 px-12 py-5 bg-emerald-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase border-4 border-white font-black tracking-widest">Next Count! 🦁</button>}
        </div>
        {isDrawerOpen && <TeacherModal title="AI Counting Maker" topicLabel="Topic Subject" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const NumberSequenceModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
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
      if (val === current.answer) onSound(`Yes! ${val} is correct!`);
      else onSound(`Try counting!`);
    };
  
    const generateWithAi = async () => {
      if (!aiTopic || !schoolId) return; setIsAiLoading(true);
      try {
        const result = await generateMathWorldEntry(aiTopic, 'sequence', schoolId);
        if(result.success && result.data){
            setData(prev => [...prev, result.data as any]);
            setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-purple-200 text-purple-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-purple-50 transition-colors"><IconRenderer iconName="fa-magic" /> AI Sequence</button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 flex flex-col items-center min-h-[550px]">
          <h3 className="text-4xl font-black text-purple-600 mb-10 uppercase tracking-tighter text-center">{current.question}</h3>
          <div className="flex gap-4 mb-16 items-center font-black">
             {current.sequence.map((n, i) => (
               <div key={i} className={`w-24 h-32 rounded-3xl flex items-center justify-center border-4 text-5xl font-black ${n === null ? 'bg-purple-50 border-purple-100 text-purple-200 border-dashed font-black' : 'bg-white border-purple-50 text-slate-800 shadow-md font-black'}`}>
                 {n === null ? (userAnswer === current.answer ? userAnswer : '?') : n}
               </div>
             ))}
          </div>
          <div className="flex gap-4 font-black">
             {current.options.map(opt => (
               <button key={opt} onClick={() => handleAnswer(opt)} className={`w-20 h-20 rounded-2xl font-black text-3xl transition-all border-2 ${userAnswer === opt ? (opt === current.answer ? 'bg-green-500 text-white font-black' : 'bg-red-500 text-white font-black') : 'bg-purple-50 text-slate-700 border-purple-100 hover:bg-purple-100 font-black'}`}>{opt}</button>
             ))}
          </div>
        </div>
        {isDrawerOpen && <TeacherModal title="AI Sequence Maker" topicLabel="Range (e.g. 10-20)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const NumberComparisonModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.NUM_COMPARISON_DATA);
    const [index, setIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
  
    const current = data[index];
    useEffect(() => { setUserAnswer(null); }, [index, data]);
  
    const handleChoice = (val: number | string) => {
      setUserAnswer(val);
      if (val === current.answer) onSound(`Excellent! You got it!`);
      else onSound(`Look closely!`);
    };
  
    const generateWithAi = async () => {
      if (!aiTopic || !schoolId) return; setIsAiLoading(true);
      try {
        const result = await generateMathWorldEntry(aiTopic, 'comparing', schoolId);
        if(result.success && result.data){
          setData(prev => [...prev, result.data as any]);
          setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-orange-200 text-orange-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-orange-50 transition-colors"><IconRenderer iconName="fa-magic" /> AI Comparison</button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center min-h-[550px]">
          <h3 className="text-4xl font-black text-orange-600 mb-10 uppercase tracking-tighter text-center">{current.q}</h3>
          <div className="flex gap-12 items-center font-black">
            <button onClick={() => handleChoice(current.val1)} className={`w-32 h-40 rounded-3xl flex items-center justify-center text-6xl font-black border-4 transition-all ${userAnswer === current.val1 ? (current.val1 === current.answer ? 'bg-green-500 text-white border-white scale-110 shadow-xl font-black' : 'bg-red-500 text-white border-white font-black') : 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100 font-black'}`}>{current.val1}</button>
            <IconRenderer iconName="fa-arrows-left-right" className="text-3xl text-slate-300 font-black" />
            <button onClick={() => handleChoice(current.val2)} className={`w-32 h-40 rounded-3xl flex items-center justify-center text-6xl font-black border-4 transition-all ${userAnswer === current.val2 ? (current.val2 === current.answer ? 'bg-green-500 text-white border-white scale-110 shadow-xl font-black' : 'bg-red-500 text-white border-white font-black') : 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100 font-black'}`}>{current.val2}</button>
          </div>
        </div>
        {isDrawerOpen && <TeacherModal title="AI Compare Maker" topicLabel="Topic (e.g. Higher Numbers)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const NumberWordsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [items, setItems] = useState(constants.NUMBER_WORDS_DATA);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const current = items[index];
    
    const fetchVisual = useCallback(async () => { setLoading(true); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
    useEffect(() => { fetchVisual(); }, [index, items, fetchVisual]);
    const handleLearn = () => onSound(`Number ${current.digit} is spelled... ${current.word}.`);
    
    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 flex flex-col items-center min-h-[550px] animate-in zoom-in duration-500 font-black">
        <div className="flex items-center gap-6 mb-10 font-black">
          <div className="w-24 h-24 bg-purple-500 text-white rounded-2xl flex items-center justify-center text-6xl font-black shadow-xl border-4 border-white font-black">{current.digit}</div>
          <IconRenderer iconName="fa-arrow-right" className="text-3xl text-purple-300" />
          <span className="text-6xl font-black text-purple-600 uppercase tracking-tighter">{current.word}</span>
        </div>
        <div onClick={handleLearn} className="w-80 h-80 bg-purple-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <Loader2 className="w-16 h-16 animate-spin text-purple-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={current.word} />}
        </div>
        <div className="flex gap-6 font-black">
          <Button onClick={() => setIndex(p => (p === 0 ? items.length - 1 : p - 1))} className="w-14 h-14 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 transition-all shadow-md"><IconRenderer iconName="fa-arrow-left" /></Button>
          <Button onClick={handleLearn} className="px-10 py-3 bg-purple-500 text-white font-black rounded-2xl shadow-xl uppercase border-4 border-white hover:scale-105 transition-all">TEACH ME!</Button>
          <Button onClick={() => setIndex(p => (p + 1) % items.length)} className="w-14 h-14 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 transition-all shadow-md"><IconRenderer iconName="fa-arrow-right" /></Button>
        </div>
      </div>
    );
};

const NumberBondsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.NUMBER_BONDS_DATA);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
  
    const current = data[index];
    
    const fetchVisual = useCallback(async () => { setLoading(true); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
    useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data, fetchVisual]);
  
    const handleAnswer = (val: number) => {
      setUserAnswer(val);
      if (val === current.part2) onSound(`Yes! ${current.part1} and ${val} make ${current.target}!`);
      else onSound(`How many more to reach ${current.target}?`);
    };
  
    const generateWithAi = async () => {
      if (!aiTopic || !schoolId) return; setIsAiLoading(true);
      try {
        const result = await generateMathWorldEntry(aiTopic, 'bonds', schoolId);
        if(result.success && result.data){
            setData(prev => [...prev, result.data as any]);
            setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-pink-200 text-pink-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-pink-50 transition-colors"><IconRenderer iconName="fa-magic" /> AI Bonds</button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center min-h-[550px]">
          <h3 className="text-4xl font-black text-pink-600 mb-8 uppercase tracking-tighter text-center">Friends of {current.target}!</h3>
          <div className="flex items-center gap-6 mb-10 font-black">
             <div className="w-20 h-20 bg-pink-500 text-white rounded-2xl flex items-center justify-center text-4xl font-black shadow-xl border-4 border-white">{current.part1}</div>
             <Plus className="text-3xl text-slate-400" />
             <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-4 border-dashed text-4xl font-black ${userAnswer === current.part2 ? 'bg-green-500 text-white border-white' : 'bg-pink-50 border-pink-100 text-pink-200'}`}>
               {userAnswer === current.part2 ? userAnswer : '?'}
             </div>
             <IconRenderer iconName="fa-equals" className="text-3xl text-slate-400" />
             <div className="w-20 h-20 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-4xl font-black shadow-xl border-4 border-white">{current.target}</div>
          </div>
          <div className="w-full max-w-2xl aspect-video bg-pink-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden">
            {loading ? <Loader2 className="w-16 h-16 animate-spin text-pink-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6" alt="Bonds" />}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
             {Array.from({length: current.target + 1}).map((_, i) => (
               <button key={i} onClick={() => handleAnswer(i)} className={`w-14 h-14 rounded-xl font-black text-xl border-2 transition-all ${userAnswer === i ? (i === current.part2 ? 'bg-green-500 text-white border-green-600 scale-110' : 'bg-red-500 text-white border-red-600') : 'bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100'}`}>{i}</button>
             ))}
          </div>
        </div>
        {isDrawerOpen && <TeacherModal title="AI Bond Maker" topicLabel="Bond Theme (e.g. Stars)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const AdditionModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.ADDITION_DATA);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTheme, setAiTheme] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
  
    const current = data[index];
    const correct = current.val1 + current.val2;
  
    const fetchVisual = useCallback(async () => { setLoading(true); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
    useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data, fetchVisual]);
  
    const handleAnswer = (val: number) => {
      setUserAnswer(val);
      if (val === correct) onSound(`Yes! ${current.val1} plus ${current.val2} is ${correct}!`);
      else onSound(`Try counting again!`);
    };
  
    const generateWithAi = async () => {
      if (!aiTheme || !schoolId) return; setIsAiLoading(true);
      try {
        const result = await generateMathWorldEntry(aiTheme, 'addition', schoolId);
        if(result.success && result.data){
            setData(prev => [...prev, result.data as any]);
            setIsDrawerOpen(false); setIndex(data.length); setAiTheme('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-orange-200 text-orange-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-orange-50 transition-colors"><IconRenderer iconName="fa-magic" /> AI Addition</button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-bottom duration-500">
          <h3 className="text-4xl font-black text-orange-500 mb-10 uppercase tracking-tighter text-center">Addition! ➕</h3>
          <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
            <div className="flex items-center gap-4">
              <div className="flex gap-2 p-4 bg-orange-50 rounded-2xl border-2 border-orange-100">
                {Array.from({length: current.val1}).map((_, i) => <IconRenderer key={i} iconName={current.icon} className="text-3xl text-orange-600" />)}
              </div>
              <Plus className="text-3xl text-slate-400" />
              <div className="flex gap-2 p-4 bg-orange-50 rounded-2xl border-2 border-orange-100">
                {Array.from({length: current.val2}).map((_, i) => <IconRenderer key={i} iconName={current.icon} className="text-3xl text-orange-600" />)}
              </div>
            </div>
            <div className="w-48 h-48 bg-white border-4 border-orange-50 rounded-[2.5rem] shadow-xl overflow-hidden">
              {loading ? <div className="absolute inset-0 flex items-center justify-center animate-spin"><Plus className="text-orange-200 text-4xl"/></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-2" alt="Addition Visual" />}
            </div>
          </div>
          <div className="text-center mb-10"><p className="text-5xl font-black text-slate-800">{current.val1} + {current.val2} = ?</p></div>
          <div className="flex flex-wrap justify-center gap-3">{Array.from({length: 11}).map((_, i) => (<button key={i} onClick={() => handleAnswer(i)} className={`w-14 h-14 rounded-2xl font-black text-xl border-2 transition-all ${userAnswer === i ? (i === correct ? 'bg-green-500 text-white border-white scale-110' : 'bg-red-500 text-white border-white') : 'bg-orange-50 text-slate-800 border-orange-100 hover:bg-orange-100'}`}>{i}</button>))}</div>
        </div>
        {isDrawerOpen && <TeacherModal title="AI Addition Maker" topicLabel="Theme (e.g. Apples)" topicValue={aiTheme} onTopicChange={setAiTheme} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const SubtractionModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.SUBTRACTION_DATA);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTheme, setAiTheme] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
  
    const current = data[index];
    const correct = current.val1 - current.val2;
  
    const fetchVisual = useCallback(async () => { setLoading(true); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
    useEffect(() => { fetchVisual(); setUserAnswer(null); }, [index, data, fetchVisual]);
  
    const handleAnswer = (val: number) => {
      setUserAnswer(val);
      if (val === correct) onSound(`Yes! ${current.val1} take away ${current.val2} is ${correct}!`);
      else onSound(`Count how many are left!`);
    };
  
    const generateWithAi = async () => {
      if (!aiTheme || !schoolId) return; setIsAiLoading(true);
      try {
        const result = await generateMathWorldEntry(aiTheme, 'subtraction', schoolId);
        if(result.success && result.data){
          setData(prev => [...prev, result.data as any]);
          setIsDrawerOpen(false); setIndex(data.length); setAiTheme('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-red-200 text-red-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-red-50 transition-colors"><IconRenderer iconName="fa-magic" /> AI Subtraction</button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-red-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-bottom duration-500">
          <h3 className="text-4xl font-black text-red-500 mb-10 uppercase tracking-tighter text-center">Subtraction! ➖</h3>
          <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
            <div className="flex items-center gap-4">
              <div className="flex gap-2 p-4 bg-red-50 rounded-2xl border-2 border-red-100">
                {Array.from({length: current.val1}).map((_, i) => <IconRenderer key={i} iconName={current.icon} className={`text-3xl ${i >= current.val1 - current.val2 ? 'text-slate-200 opacity-30 line-through' : 'text-red-600'}`} />)}
              </div>
              <Minus className="text-3xl text-slate-400" />
              <div className="w-12 h-12 flex items-center justify-center bg-red-50 rounded-xl text-3xl font-black text-red-600">{current.val2}</div>
            </div>
            <div className="w-48 h-48 bg-white border-4 border-red-50 rounded-[2.5rem] shadow-xl overflow-hidden">
              {loading ? <div className="absolute inset-0 flex items-center justify-center animate-spin"><Minus className="text-red-200 text-4xl"/></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-2" alt="Subtraction Visual" />}
            </div>
          </div>
          <div className="text-center mb-10"><p className="text-5xl font-black text-slate-800">{current.val1} - {current.val2} = ?</p></div>
          <div className="flex flex-wrap justify-center gap-3">{Array.from({length: 11}).map((_, i) => (<button key={i} onClick={() => handleAnswer(i)} className={`w-14 h-14 rounded-2xl font-black text-xl border-2 transition-all ${userAnswer === i ? (i === correct ? 'bg-green-500 text-white border-white scale-110' : 'bg-red-500 text-white border-white') : 'bg-red-50 text-slate-800 border-red-100 hover:bg-red-100'}`}>{i}</button>))}</div>
        </div>
        {isDrawerOpen && <TeacherModal title="AI Subtraction Maker" topicLabel="Theme (e.g. Cookies)" topicValue={aiTheme} onTopicChange={setAiTheme} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const TellingTimeModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.TIME_DATA);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiSetting, setAiSetting] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [answered, setAnswered] = useState(false);
  
    const current = data[index];
    const options = [current.hour, (current.hour + 3) % 12 || 12, (current.hour + 6) % 12 || 12].sort(() => Math.random() - 0.5);
  
    const fetchVisual = useCallback(async () => { setLoading(true); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
    useEffect(() => { fetchVisual(); setAnswered(false); }, [index, data, fetchVisual]);
  
    const handleAnswer = (val: number) => {
      if (val === current.hour) {
        setAnswered(true);
        onSound(`Yes! It is ${current.phrase}!`);
      } else onSound(`Look at the short hand!`);
    };
  
    const generateWithAi = async () => {
      if (!aiSetting || !schoolId) return; setIsAiLoading(true);
      try {
        const result = await generateMathWorldEntry(aiSetting, 'time', schoolId);
        if(result.success && result.data){
            setData(prev => [...prev, result.data as any]);
            setIsDrawerOpen(false); setIndex(data.length); setAiSetting('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-blue-200 text-blue-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-blue-50 transition-colors"><IconRenderer iconName="fa-magic" /> AI Time</button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center min-h-[600px] animate-in zoom-in duration-500">
          <h3 className="text-4xl font-black text-blue-500 mb-8 uppercase tracking-tighter text-center">Clock Time ⏰</h3>
          <div className="w-72 h-72 bg-blue-50 rounded-full border-8 border-white shadow-2xl overflow-hidden mb-12 relative group cursor-pointer" onClick={() => onSound(current.phrase)}>
            {loading ? <div className="absolute inset-0 flex items-center justify-center animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-10" alt="Clock" />}
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors flex items-center justify-center"><IconRenderer iconName="fa-volume-high" className="text-white opacity-0 group-hover:opacity-100 text-6xl drop-shadow-lg" /></div>
          </div>
          <div className="flex gap-6">{options.map(opt => (<button key={opt} onClick={() => handleAnswer(opt)} className={`px-10 py-5 rounded-3xl font-black text-3xl transition-all border-4 ${answered && opt === current.hour ? 'bg-green-500 text-white border-white scale-110 shadow-xl' : 'bg-blue-50 text-blue-600 border-white hover:bg-blue-100'}`}>{opt}:00</button>))}</div>
        </div>
        {isDrawerOpen && <TeacherModal title="AI Time Maker" topicLabel="Target Hour (1-12)" topicValue={aiSetting} onTopicChange={setAiSetting} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const TensUnitsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.TENS_UNITS_DATA);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
  
    const current = data[index];
    const fetchVisual = useCallback(async () => { setLoading(true); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
    useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
    const handleLearn = () => onSound(`${current.number} has ${current.tens} tens and ${current.units} units!`);
  
    const generateWithAi = async () => {
      if (!aiTopic || !schoolId) return; setIsAiLoading(true);
      try {
        const result = await generateMathWorldEntry(aiTopic, 'tens-units', schoolId);
        if(result.success && result.data){
            setData(prev => [...prev, result.data as any]);
            setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="w-full relative flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-indigo-100 animate-in zoom-in duration-500 min-h-[550px] font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-indigo-200 text-indigo-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-indigo-50 transition-colors"><IconRenderer iconName="fa-magic" /> AI Tens</button>
        <h3 className="text-4xl font-black text-indigo-500 mb-8 uppercase tracking-tighter text-center">Tens and Units 📦</h3>
        <div className="flex items-center gap-12 mb-10">
           <div className="text-center"><p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Number</p><div className="w-24 h-24 bg-indigo-500 text-white rounded-2xl flex items-center justify-center text-5xl font-black shadow-xl border-4 border-white">{current.number}</div></div>
           <IconRenderer iconName="fa-equals" className="text-3xl text-slate-300" />
           <div className="flex gap-4">
              <div className="text-center"><p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Tens</p><div className="w-16 h-16 bg-white border-4 border-indigo-200 text-indigo-600 rounded-xl flex items-center justify-center text-3xl font-black">{current.tens}</div></div>
              <div className="text-center"><p className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">Units</p><div className="w-16 h-16 bg-white border-4 border-indigo-200 text-indigo-600 rounded-xl flex items-center justify-center text-3xl font-black">{current.units}</div></div>
           </div>
        </div>
        <div onClick={handleLearn} className="w-full max-w-2xl aspect-video bg-indigo-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <Loader2 className="w-16 h-16 animate-spin text-indigo-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 p-6" alt="Tens units" />}
        </div>
        <div className="flex gap-6"><Button onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md hover:bg-slate-200"><IconRenderer iconName="fa-arrow-left" className="text-2xl" /></Button><Button onClick={handleLearn} className="px-10 py-3 bg-indigo-500 text-white font-black rounded-2xl shadow-xl uppercase border-4 border-white">TEACH ME!</Button><Button onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md hover:bg-slate-200"><IconRenderer iconName="fa-arrow-right" className="text-2xl" /></Button></div>
        {isDrawerOpen && <TeacherModal title="AI Tens Maker" topicLabel="Target Number" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const GroupingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.GROUPING_DATA);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
  
    const current = data[index];
    const fetchVisual = useCallback(async () => { setLoading(true); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
    useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
    const handleLearn = () => onSound(`Let's count groups of ${current.groupSize}!`);
  
    const generateWithAi = async () => {
      if (!aiTopic || !schoolId) return; setIsAiLoading(true);
      try {
        const result = await generateMathWorldEntry(aiTopic, 'grouping', schoolId);
        if(result.success && result.data){
          setData(prev => [...prev, result.data as any]);
          setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="w-full relative flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 animate-in zoom-in duration-500 min-h-[550px] font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-emerald-200 text-emerald-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-emerald-50 transition-colors"><IconRenderer iconName="fa-magic" /> AI Grouping</button>
        <h3 className="text-4xl font-black text-emerald-500 mb-8 uppercase tracking-tighter text-center font-black">Grouping Fun 🤝</h3>
        <div className="flex items-center gap-12 mb-10 font-black">
           <div className="text-center font-black"><p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 font-black">Group Size</p><div className="w-20 h-20 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-4xl font-black shadow-xl border-4 border-white">{current.groupSize}</div></div>
           <IconRenderer iconName="fa-arrow-right" className="text-2xl text-slate-300" />
           <div className="text-center font-black"><p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1 font-black">Total {current.theme}</p><div className="w-20 h-20 bg-white border-4 border-emerald-200 text-emerald-600 rounded-2xl flex items-center justify-center text-4xl font-black">{current.totalItems}</div></div>
        </div>
        <div onClick={handleLearn} className="w-full max-w-2xl aspect-video bg-emerald-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <Loader2 className="w-16 h-16 animate-spin text-emerald-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 p-6" alt="Grouping" />}
        </div>
        <div className="flex gap-6">
          <Button onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md hover:bg-slate-200"><IconRenderer iconName="fa-arrow-left" className="text-2xl" /></Button>
          <Button onClick={handleLearn} className="px-10 py-3 bg-emerald-500 text-white font-black rounded-2xl shadow-xl uppercase border-4 border-white">TEACH ME!</Button>
          <Button onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md hover:bg-slate-200"><IconRenderer iconName="fa-arrow-right" className="text-2xl" /></Button>
        </div>
        {isDrawerOpen && <TeacherModal title="AI Grouping Maker" topicLabel="Theme (e.g. Birds)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const MeasurementModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [subTab, setSubTab] = useState<'weight' | 'height'>('weight');
    const [data, setData] = useState(constants.MEASUREMENT_DATA);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
    const [answered, setAnswered] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
  
    const current = data[subTab][index];
    
    const fetchVisuals = useCallback(async () => { 
        setLoading(true); 
        const urls = await Promise.all(current.items.map((i: any) => generateLessonImageAction({prompt: i.prompt, schoolId}))); 
        setImageUrls(urls.map(u => u.data || null)); 
        setLoading(false); 
    }, [current, schoolId]);

    useEffect(() => { fetchVisuals(); setAnswered(false); }, [index, subTab, data, fetchVisuals]);
    const handleChoice = (idx: number) => { if (idx === current.correct) { setAnswered(true); onSound(`Yes! That is correct!`); } else onSound(`Look again!`); };
  
    const generateWithAi = async () => {
      if (!aiTopic || !schoolId) return; setIsAiLoading(true);
      try {
        const result = await generateMathWorldEntry(aiTopic, 'measurement', schoolId);
        if(result.success && result.data){
            setData(prev => ({ ...prev, [subTab]: [...prev[subTab], result.data as any] }));
            setIsDrawerOpen(false); setIndex(data[subTab].length); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="w-full relative bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-bottom duration-500 font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-emerald-200 text-emerald-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-emerald-50 transition-colors"><IconRenderer iconName="fa-magic" /> AI Measurement</button>
        <div className="flex gap-4 mb-10 p-2 bg-emerald-50 rounded-2xl border-2 border-emerald-100 font-black">{(['weight', 'height'] as const).map(t => (<button key={t} onClick={() => { setSubTab(t); setIndex(0); }} className={`px-8 py-2 rounded-xl font-black text-xs uppercase transition-all ${subTab === t ? 'bg-emerald-500 text-white shadow-md' : 'text-emerald-700 hover:bg-emerald-100'}`}>{t}</button>))}</div>
        <h3 className="text-4xl font-black text-emerald-600 mb-12 uppercase tracking-tighter text-center">{current.q}</h3>
        <div className="flex flex-wrap justify-center gap-12 items-end">
          {current.items.map((item: any, idx: number) => (
            <button key={idx} onClick={() => handleChoice(idx)} className={`flex flex-col items-center group transition-all ${answered && idx === current.correct ? 'scale-110' : ''}`}>
              <div className={`${item.size === 'lg' ? 'w-56 h-56' : 'w-28 h-28'} bg-emerald-50 rounded-[3rem] border-8 flex items-center justify-center mb-4 transition-all overflow-hidden ${answered && idx === current.correct ? 'border-green-400 shadow-2xl' : 'border-white hover:border-emerald-200 shadow-xl'}`}>
                {imageUrls[idx] ? <img src={imageUrls[idx]!} className="w-full h-full object-cover p-6 drop-shadow-lg" alt={item.label} /> : <Loader2 className="animate-spin" />}
              </div>
              <span className="font-black uppercase text-sm tracking-widest text-emerald-700">{item.label}</span>
            </button>
          ))}
        </div>
        {isDrawerOpen && <TeacherModal title="AI Measurement Maker" topicLabel="Compare Subject (e.g. Fruits)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const ShapesModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.NUMERACY_DATA.shapes);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiName, setAiName] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
  
    const current = data[index];
    const fetchVisual = useCallback(async () => { setLoading(true); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
    useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
    const handleLearn = () => onSound(`This is a ${current.name}! It is a ${current.type} shape.`);
  
    const generateWithAi = async () => {
      if (!aiName || !schoolId) return; setIsAiLoading(true);
      try {
        const result = await generateMathWorldEntry(aiName, 'shapes', schoolId);
        if(result.success && result.data){
            setData(prev => [...prev, result.data as any]);
            setIsDrawerOpen(false); setIndex(data.length); setAiName('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-cyan-200 text-cyan-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase z-10 hover:bg-cyan-50 transition-colors"><IconRenderer iconName="fa-magic" /> AI Shapes</button>
        <div className="w-full flex flex-col items-center bg-white p-10 rounded-[4rem] shadow-2xl border-8 border-cyan-100 animate-in zoom-in duration-500 min-h-[550px]">
          <h2 className="text-7xl font-black text-cyan-600 mb-8 uppercase tracking-tighter">{current.name}</h2>
          <div onClick={handleLearn} className="w-80 h-80 bg-cyan-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
            {loading ? <Loader2 className="w-16 h-16 animate-spin text-cyan-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={current.name} />}
          </div>
          <div className="flex gap-6">
            <Button onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 transition-all shadow-md"><IconRenderer iconName="fa-arrow-left" className="text-2xl" /></Button>
            <Button onClick={handleLearn} className="px-12 py-4 bg-cyan-500 text-white font-black rounded-3xl shadow-xl uppercase border-4 border-white">TEACH ME!</Button>
            <Button onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 transition-all shadow-md"><IconRenderer iconName="fa-arrow-right" className="text-2xl" /></Button>
          </div>
        </div>
        {isDrawerOpen && <TeacherModal title="AI Shape Maker" topicLabel="Shape Name (e.g. Heart)" topicValue={aiName} onTopicChange={setAiName} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
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
    const [playing, setPlaying] = useState(false);
    const currentSourceRef = useRef<HTMLAudioElement | null>(null);
    const { schoolId } = useCurrentSchool();
  
    const playFeedbackSound = useCallback(async (text: string) => {
      if (!text || !schoolId) return;
      if (currentSourceRef.current) {
          try { currentSourceRef.current.pause(); } catch (e) {}
      }
      setPlaying(true);
      try {
          const result = await generateTTSAction({ text, voice: 'Kore', schoolId });
          if (result.success && result.data && typeof window !== 'undefined') {
              const audio = new Audio(`data:audio/wav;base64,${result.data}`);
              currentSourceRef.current = audio;
              audio.play();
              audio.onended = () => { setPlaying(false); currentSourceRef.current = null; };
          } else { setPlaying(false); }
      } catch (err: any) {
          setPlaying(false);
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
          <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-purple-50 min-w-max font-black">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-w-[110px] px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${
                  activeTab === tab.id ? `bg-purple-500 text-white shadow-xl scale-110 -translate-y-1` : 'text-slate-700 hover:bg-slate-50 font-black'
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

    