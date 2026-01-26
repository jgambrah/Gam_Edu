
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useRole } from '@/context/role-context';
import {
  generateLessonImageAction,
  generateTTSAction,
  generateLifeSkillEntry,
  generateRhyme,
} from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { LIFE_SKILLS_DATA } from '@/lib/constants';
import {
  HelpCircle,
  Smile,
  Music,
  Tv,
  User,
  MessageSquare,
  Users,
  Drama,
  BrainCircuit,
  HeartPulse,
  Loader2,
  Wand2,
  ArrowLeft,
  ArrowRight,
  Volume2,
  Play,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Sparkles,
  Info,
  Puzzle,
  Trash2,
  Flag,
  MousePointer2,
  Box,
  Rabbit,
  Carrot,
  Apple,
  Cookie,
  Star,
  Bed,
  Eye,
  CloudRain,
  Guitar,
  Plane,
  Car,
  Zap,
  CircleDot,
  Monitor,
  GraduationCap,
  Heart,
} from 'lucide-react';

const IconRenderer = ({ iconName, className }: { iconName?: string; className?: string }) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'fa-face-smile': Smile, 'fa-music': Music, 'fa-tv': Tv, 'fa-child-reaching': User, 'fa-comments': MessageSquare,
    'fa-people-group': Users, 'fa-masks-theater': Drama, 'fa-brain': BrainCircuit, 'fa-heart-pulse': HeartPulse,
    'fa-magic': Wand2, 'fa-wand-magic-sparkles': Wand2, 'fa-spinner': Loader2, 'fa-arrow-left': ArrowLeft,
    'fa-arrow-right': ArrowRight, 'fa-volume-high': Volume2, 'fa-play': Play, 'fa-circle-check': CheckCircle2,
    'fa-circle-xmark': XCircle, 'fa-circle-plus': PlusCircle, 'fa-sparkles': Sparkles, 'fa-info-circle': Info,
    'fa-puzzle-piece': Puzzle, 'fa-broom': Trash2, 'fa-flag': Flag, 'fa-hand-pointer': MousePointer2, 'fa-cube': Box,
    'fa-rabbit': Rabbit, 'fa-carrot': Carrot, 'fa-apple-whole': Apple, 'fa-cookie': Cookie, 'fa-star': Star, 'fa-bed': Bed,
    'fa-eye': Eye, 'fa-cloud-showers-heavy': CloudRain, 'fa-guitar': Guitar, 'fa-plane': Plane, 'fa-car': Car,
    'fa-frog': Rabbit, 'fa-bolt': Zap, 'fa-circle-dot': CircleDot, 'fa-soap': Sparkles, 'fa-broccoli': Carrot,
    'fa-display': Monitor, 'fa-graduation-cap': GraduationCap,
  };
  
  if (!iconName) {
    return <HelpCircle className={cn(className)} />;
  }

  const IconComponent = iconMap[iconName] || HelpCircle;
  return <IconComponent className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} />;
};

type LifeSkillTab = 'emotions' | 'routine-songs' | 'modeling' | 'practical-life' | 'communication' | 'social' | 'puppet-theater' | 'cognitive' | 'physical-health';

const TeacherModal: React.FC<{ title: string; topicLabel: string; topicValue: string; onTopicChange: (v: string) => void; onGenerate: () => void; isLoading: boolean; onClose: () => void; }> = ({ title, topicLabel, topicValue, onTopicChange, onGenerate, isLoading, onClose }) => (
    <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="rounded-[3rem] border-8 border-gray-50">
            <DialogHeader><DialogTitle className="text-3xl font-black text-slate-800 uppercase tracking-tighter">{title}</DialogTitle></DialogHeader>
            <div className="space-y-6 py-4">
                <div>
                    <Label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">{topicLabel}</Label>
                    <Input type="text" value={topicValue} onChange={(e) => onTopicChange(e.target.value)} placeholder="Type here..." className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 outline-none font-bold focus:border-teal-300 transition-colors text-slate-800 uppercase" />
                </div>
                <Button onClick={onGenerate} disabled={isLoading || !topicValue} className="w-full py-5 rounded-2xl font-black text-white bg-teal-500 shadow-xl hover:bg-teal-600 disabled:bg-gray-300 transition-all flex items-center justify-center gap-3 border-4 border-white uppercase tracking-widest">
                    {isLoading ? <><Loader2 className="animate-spin"/> GENERATING...</> : <><Sparkles /> CREATE SHOW</>}
                </Button>
                <button onClick={onClose} className="w-full py-2 text-slate-400 uppercase text-[10px] font-black tracking-widest hover:text-slate-600 block text-center transition-colors">Close</button>
            </div>
        </DialogContent>
    </Dialog>
);

const ModuleContainerWithState: React.FC<{ title: string; children: React.ReactNode; icon: string; started: boolean; onStart: () => void; onClose: () => void; }> = ({ title, children, icon, started, onStart, onClose }) => {
    if (!started) return (
        <div className="text-center p-12 bg-white rounded-[3rem] shadow-xl border-8 border-teal-50 animate-in fade-in zoom-in">
            <IconRenderer iconName={icon} className="h-20 w-20 mx-auto text-teal-300 mb-6" />
            <h3 className="text-4xl font-black text-teal-600 mb-4 uppercase tracking-tighter">{title}</h3>
            <p className="text-slate-500 mb-8 font-bold">Are you ready to explore and play?</p>
            <Button onClick={onStart} size="lg" className="bg-teal-500 hover:bg-teal-600 text-white font-black px-12 py-8 rounded-2xl text-2xl shadow-2xl hover:scale-105 transition-all">START ACTIVITY</Button>
        </div>
    );
    return (
        <div className="relative">
            <Button variant="ghost" onClick={onClose} className="absolute -top-16 left-0 text-slate-400 hover:text-teal-500 font-black uppercase text-xs tracking-widest"><ArrowLeft className="mr-2 h-4 w-4"/> Close Activity</Button>
            {children}
        </div>
    );
};

const EmotionsModule: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [data, setData] = useState(LIFE_SKILLS_DATA.emotions);
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
  
    const current = data[index];
    
    const fetchVisual = useCallback(async () => {
        if (!current || !schoolId) return;
        setLoading(true);
        const result = await generateLessonImageAction({ prompt: current.prompt, schoolId });
        if (result.success) setImageUrl(result.data || null);
        setLoading(false);
    }, [current, schoolId]);

    useEffect(() => { 
        fetchVisual();
    }, [index, data, fetchVisual]);
  
    const handleAction = () => {
      onSound(`I feel ${current.name}. When I feel ${current.name}, I can ${current.technique}.`);
      onComplete();
    };

    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return;
        setIsAiLoading(true);
        try {
          const result = await generateLifeSkillEntry({ topic: aiTopic, category: 'emotions', schoolId });
          if(result.success && result.data){
              setData(prev => [...prev, result.data]);
              setIsDrawerOpen(false); 
              setIndex(data.length); 
              setAiTopic('');
          }
        } catch (e) { console.error(e); } 
        finally { setIsAiLoading(false); }
    };
  
    return (
        <div className="relative font-black">
          {canEdit && <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-yellow-200 text-yellow-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-yellow-50 transition-colors"><Wand2 className="w-3 h-3 inline-block mr-1"/> AI Feelings</button>}
          <div className={`w-full p-12 rounded-[4rem] shadow-2xl border-8 flex flex-col items-center min-h-[600px] animate-in zoom-in duration-500 transition-colors ${current.color} border-white`}>
            <h3 className="text-4xl font-black text-white mb-8 uppercase tracking-tighter text-center shadow-text-md">How do I feel?</h3>
            <div onClick={handleAction} className={`relative w-full max-w-sm aspect-square bg-white/30 rounded-[3rem] border-8 border-white shadow-2xl flex items-center justify-center mb-8 overflow-hidden cursor-pointer group`}>
               {loading ? <Loader2 className="w-16 h-16 animate-spin text-white/50" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-10 group-hover:scale-105 transition-transform" alt={current.name} />}
            </div>
            <div className="flex gap-4 mb-8">
                {data.map((item, i) => (
                    <button key={item.name} onClick={() => setIndex(i)} className={`w-16 h-16 rounded-full text-4xl border-4 flex items-center justify-center shadow-lg transition-all ${index === i ? 'border-white scale-125' : 'border-transparent opacity-50 hover:opacity-100'}`}><IconRenderer iconName={item.icon} /></button>
                ))}
            </div>
            <p className="text-2xl font-black text-white/80 italic text-center max-w-md">"{current.technique}"</p>
          </div>
          {isDrawerOpen && <TeacherModal title="AI Feelings Maker" topicLabel="Feeling or Emotion" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
};

const RoutineSongsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
  const [songs, setSongs] = useState(LIFE_SKILLS_DATA.music);
  const [index, setIndex] = useState(0);
  const [singing, setSinging] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const current = songs[index];

  const handleSing = async () => {
    if (!schoolId) return;
    setSinging(true);
    const result = await generateRhyme({ topic: current.theme, schoolId });
    await onSound(`Let's sing about ${current.theme}! ${result.rhyme}`);
    setSinging(false);
  };
  
  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
        const result = await generateLifeSkillEntry({ topic: aiTopic, category: 'songs', schoolId });
        if(result.success && result.data){
            setSongs(prev => [...prev, result.data]);
            setIndex(songs.length);
            setIsDrawerOpen(false);
        }
    } catch(e) {} finally { setIsAiLoading(false); }
  };

  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center animate-in zoom-in relative">
        {canEdit && <button onClick={() => setIsDrawerOpen(true)} className="absolute top-4 right-4 bg-white border-2 border-pink-200 text-pink-600 px-3 py-1 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-pink-50 transition-colors"><Wand2 className="w-3 h-3 inline-block mr-1"/> AI Song</button>}
      <h3 className="text-4xl font-black text-pink-500 mb-10 uppercase tracking-tighter">Skill Songs! 🎵</h3>
      <div className="w-32 h-32 bg-pink-100 text-pink-600 rounded-3xl flex items-center justify-center text-6xl mb-8 shadow-md border-4 border-white animate-bounce">
        <IconRenderer iconName={current.icon} />
      </div>
      <h4 className="text-4xl font-black text-slate-800 mb-8 uppercase">{current.title}</h4>
      <Button 
        onClick={handleSing} 
        disabled={singing}
        className="px-16 py-6 bg-pink-500 text-white rounded-[3rem] font-black uppercase text-2xl shadow-xl hover:scale-105 transition-all border-4 border-white"
      >
        {singing ? <Loader2 className="animate-spin" /> : <><Music className="mr-4 h-6 w-6"/> Start Song</>}
      </Button>
      <div className="flex gap-4 mt-12">
        <Button onClick={() => setIndex(i => (i === 0 ? songs.length - 1 : i - 1))} variant="outline" size="icon" className="w-14 h-14 rounded-full"><ArrowLeft/></Button>
        <Button onClick={() => setIndex(i => (i + 1) % songs.length)} variant="outline" size="icon" className="w-14 h-14 rounded-full"><ArrowRight/></Button>
      </div>
       {isDrawerOpen && <TeacherModal title="AI Song Maker" topicLabel="Song Theme" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const ModelingModule: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [data, setData] = useState(LIFE_SKILLS_DATA.practicalLife.pretendPlay);
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const current = data[index];

    const fetchVisual = useCallback(async () => { 
        if(!current || !schoolId) return; setLoading(true); 
        const result = await generateLessonImageAction({prompt: current.prompt, schoolId}); 
        if (result.success) setImageUrl(result.data || null); setLoading(false); 
    }, [current, schoolId]);

    useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);


    const handleWatch = () => {
        onSound(`${current.scenario} ${current.modeling}`);
        onComplete();
    };

    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        try {
            const result = await generateLifeSkillEntry({ topic: aiTopic, category: 'watch', schoolId });
            if(result.success && result.data){
                setData(prev => [...prev, result.data]);
                setIndex(data.length); setIsDrawerOpen(false);
            }
        } catch(e) {} finally { setIsAiLoading(false); }
    };

    return (
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-indigo-100 flex flex-col items-center animate-in zoom-in font-black relative">
            {canEdit && <button onClick={() => setIsDrawerOpen(true)} className="absolute top-4 right-4 bg-white border-2 border-indigo-200 text-indigo-600 px-3 py-1 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-indigo-50"><Wand2 className="w-3 h-3 inline-block mr-1"/> AI Scene</button>}
            <h3 className="text-4xl font-black text-indigo-500 mb-10 uppercase tracking-tighter">I Can Do It! 🎥</h3>
            <div onClick={handleWatch} className="w-full max-w-xl aspect-video bg-indigo-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
                {loading ? <Loader2 className="w-16 h-16 animate-spin text-indigo-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6" alt={current.title} />}
            </div>
            <h4 className="text-4xl font-black text-slate-800 mb-4 uppercase">{current.title}</h4>
            <p className="text-xl font-black text-slate-500 italic mb-10 text-center leading-relaxed">"{current.scenario}"</p>
            <Button onClick={handleWatch} className="px-16 py-6 bg-indigo-500 text-white rounded-[3rem] font-black uppercase text-xl shadow-xl border-4 border-white">Watch & Learn!</Button>
             {isDrawerOpen && <TeacherModal title="AI Scene Maker" topicLabel="Scenario to Model" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
        </div>
    );
};

const PracticalLifeModule: React.FC<{ onSound: (t: string) => void; onComplete: () => void; schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [subTab, setSubTab] = useState<'dressing' | 'schedules'>('dressing');
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const data = subTab === 'dressing' ? LIFE_SKILLS_DATA.practicalLife.dressing : LIFE_SKILLS_DATA.practicalLife.schedules;
    const current = data[index] || data[0];
  
    const fetchVisual = useCallback(async () => {
        if (!current || !schoolId) return; setLoading(true);
        const result = await generateLessonImageAction({ prompt: current.prompt, schoolId });
        if (result.success) setImageUrl(result.data || null); setLoading(false);
    }, [current, schoolId]);

    useEffect(() => { fetchVisual(); }, [subTab, index, data, fetchVisual]);
    
    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        try {
            const result = await generateLifeSkillEntry({ topic: aiTopic, category: 'routine', schoolId });
            if(result.success && result.data){
                 // The API doesn't exist to add to this static data.
                setIsDrawerOpen(false);
            }
        } catch(e) {} finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center animate-in zoom-in relative">
        {canEdit && <button onClick={() => setIsDrawerOpen(true)} className="absolute top-4 right-4 bg-white border-2 border-blue-200 text-blue-600 px-3 py-1 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-blue-50"><Wand2 className="w-3 h-3 inline-block mr-1"/> AI Routine</button>}
        <div className="flex gap-4 mb-10 p-2 bg-blue-50 rounded-2xl font-black">
          <button onClick={() => {setSubTab('dressing'); setIndex(0);}} className={`px-8 py-2 rounded-xl font-black text-xs uppercase ${subTab === 'dressing' ? 'bg-blue-500 text-white' : 'text-blue-400'}`}>Dressing</button>
          <button onClick={() => {setSubTab('schedules'); setIndex(0);}} className={`px-8 py-2 rounded-xl font-black text-xs uppercase ${subTab === 'schedules' ? 'bg-blue-500 text-white' : 'text-blue-400'}`}>Routine</button>
        </div>
        <h3 className="text-4xl font-black text-blue-500 mb-10 uppercase tracking-tighter">My Day ☀️</h3>
        <div onClick={() => { onSound(subTab === 'dressing' ? `I need my ${(current as any).item} because ${(current as any).need}.` : `Let's follow our routine!`); onComplete(); }} className="w-full max-w-sm aspect-square bg-blue-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <Loader2 className="w-16 h-16 animate-spin text-blue-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6" alt="practical life" />}
        </div>
        <h4 className="text-4xl font-black text-slate-800 uppercase mb-8">{(current as any).item || (current as any).name}</h4>
        <div className="flex gap-4">
          <Button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} variant="outline" size="icon" className="w-14 h-14 rounded-full"><ArrowLeft/></Button>
          <Button onClick={() => setIndex(i => (i + 1) % data.length)} variant="outline" size="icon" className="w-14 h-14 rounded-full"><ArrowRight/></Button>
        </div>
        {isDrawerOpen && <TeacherModal title="AI Routine Assistant" topicLabel="Routine Step" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const CommunicationModule: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [subTab, setSubTab] = useState<'pictureTalk' | 'instructions' | 'circleTime'>('pictureTalk');
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    const data = LIFE_SKILLS_DATA.communication[subTab];
    const current = data[index] || data[0];
  
    const fetchVisual = useCallback(async () => {
        if (subTab !== 'pictureTalk' || !current || !schoolId) { setImageUrl(null); return; }
        setLoading(true);
        const result = await generateLessonImageAction({ prompt: (current as any).prompt, schoolId });
        if (result.success) setImageUrl(result.data || null); setLoading(false);
    }, [current, schoolId, subTab]);

    useEffect(() => { fetchVisual(); }, [subTab, index, data, fetchVisual]);
    
    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        try {
            const result = await generateLifeSkillEntry({ topic: aiTopic, category: 'talk', schoolId });
            if(result.success && result.data){
                 // This module uses static data, can't add to it directly
                setIsDrawerOpen(false);
            }
        } catch(e) {} finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center animate-in zoom-in relative">
        {canEdit && <button onClick={() => setIsDrawerOpen(true)} className="absolute top-4 right-4 bg-white border-2 border-orange-200 text-orange-600 px-3 py-1 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-orange-50"><Wand2 className="w-3 h-3 inline-block mr-1"/> AI Talk</button>}
        <div className="flex flex-wrap justify-center gap-2 mb-10 font-black">
          {(['pictureTalk', 'instructions', 'circleTime'] as const).map(t => (
            <button key={t} onClick={() => {setSubTab(t); setIndex(0);}} className={`px-6 py-2 rounded-xl font-black text-xs uppercase ${subTab === t ? 'bg-orange-500 text-white' : 'bg-slate-100'}`}>{t.replace(/([A-Z])/g, ' $1')}</button>
          ))}
        </div>
        <h3 className="text-3xl font-black text-orange-500 mb-8 uppercase">Let's Talk! 💬</h3>
        {subTab === 'pictureTalk' ? (
          <div onClick={() => onSound((current as any).description)} className="w-full max-w-2xl aspect-video bg-orange-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
            {loading ? <Loader2 className="w-16 h-16 animate-spin text-orange-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6" alt="talk" />}
          </div>
        ) : (
          <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center text-5xl mb-8 border-4 border-white animate-bounce">
             <IconRenderer iconName={(current as any).icon} />
          </div>
        )}
        <p className="text-2xl font-black text-slate-800 mb-10 text-center italic max-w-lg">"{(current as any).title || (current as any).task || (current as any).q}"</p>
        <button onClick={() => { onSound((current as any).description || (current as any).spoken || (current as any).q); onComplete(); }} className="px-16 py-6 bg-orange-500 text-white rounded-[3rem] font-black uppercase text-xl shadow-xl border-4 border-white">Start Talking!</button>
        {isDrawerOpen && <TeacherModal title="AI Conversation Maker" topicLabel="Conversation Topic" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const SocialScenarios: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [subTab, setSubTab] = useState<'interaction' | 'community'>('interaction');
    const [index, setIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const [socialData, setSocialData] = useState(LIFE_SKILLS_DATA.social);
    const [communityData, setCommunityData] = useState(LIFE_SKILLS_DATA.community);
  
    const isCommunity = subTab === 'community';
    const data = isCommunity ? communityData : socialData;
    const current = data[index] || data[0];
  
    const fetchVisual = useCallback(async () => {
        if (!current || !schoolId) return; setLoading(true);
        const result = await generateLessonImageAction({ prompt: current.prompt, schoolId });
        if (result.success) setImageUrl(result.data || null); setLoading(false);
    }, [current, schoolId]);

    useEffect(() => { fetchVisual(); setUserAnswer(null); }, [subTab, index, data, fetchVisual]);
  
    const handleChoice = (optIdx: number) => {
      setUserAnswer(optIdx);
      if (optIdx === (current as any).correct) {
        onSound(`Yes! That is so kind. Being a good friend is wonderful!`);
        onComplete();
      } else {
        onSound(`Hmm, should we try a kinder choice? Look at the friend's face!`);
      }
    };
  
    const generateWithAi = async () => {
      if (!aiTopic || !schoolId) return; setIsAiLoading(true);
      try {
        const result = await generateLifeSkillEntry({ topic: aiTopic, category: subTab === 'community' ? 'community' : 'kindness', schoolId });
        if(result.success && result.data){
            if (subTab === 'community') setCommunityData(prev => [...prev, result.data]);
            else setSocialData(prev => [...prev, result.data]);
            setIndex(data.length); setIsDrawerOpen(false); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative font-black">
        {canEdit && <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-pink-200 text-pink-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-pink-50 transition-colors"><Wand2 className="w-3 h-3 inline-block mr-1"/> AI Social Assistant</button>}
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-right duration-500 font-black">
          <h3 className="text-4xl font-black text-pink-500 mb-8 uppercase tracking-tighter text-center font-black">Social & Kindness Hub 🤝</h3>
          <div className="flex gap-4 mb-10 p-2 bg-pink-50 rounded-2xl font-black">
            <button onClick={() => {setSubTab('interaction'); setIndex(0);}} className={`px-8 py-2 rounded-xl font-black text-xs uppercase transition-all ${subTab === 'interaction' ? 'bg-pink-500 text-white shadow-md' : 'text-pink-400'}`}>Interaction</button>
            <button onClick={() => {setSubTab('community'); setIndex(0);}} className={`px-8 py-2 rounded-xl font-black text-xs uppercase transition-all ${subTab === 'community' ? 'bg-pink-500 text-white shadow-md' : 'text-pink-400'}`}>Community</button>
          </div>
  
          {subTab === 'interaction' ? (
            <div className="flex flex-col items-center w-full font-black">
              <h4 className="text-3xl font-black text-pink-600 mb-4 uppercase tracking-tighter">{(current as any).scenario}</h4>
              <p className="text-xl font-black text-slate-800 mb-10 italic text-center max-w-lg leading-relaxed">"{(current as any).q}"</p>
              <div className="w-full max-w-lg aspect-video rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden bg-pink-50 font-black">
                {loading ? <Loader2 className="w-16 h-16 animate-spin text-pink-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-4 animate-in zoom-in" />}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl font-black">
                 {(current as any).options.map((opt: string, i: number) => (
                   <button key={i} onClick={() => handleChoice(i)} className={`px-6 py-4 rounded-3xl font-black text-lg border-4 transition-all ${userAnswer === i ? (i === (current as any).correct ? 'bg-green-500 text-white border-white scale-105 shadow-xl' : 'bg-red-500 text-white border-white') : 'bg-pink-50 text-slate-800 border-white hover:bg-pink-100'}`}>
                    {opt}
                 </button>
               ))}
              </div>
              {userAnswer === (current as any).correct && <button onClick={() => setIndex(p => (p + 1) % socialData.length)} className="mt-10 px-12 py-5 bg-pink-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase tracking-widest">Next Challenge! ❤️</button>}
            </div>
          ) : (
            <div className="flex flex-col items-center w-full font-black animate-in zoom-in">
               <div className="w-24 h-24 bg-pink-100 text-pink-600 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-md border-4 border-white animate-bounce">
                 <IconRenderer iconName={(current as any).icon} />
               </div>
               <h4 className="text-4xl font-black text-pink-600 uppercase mb-4 tracking-tighter">{(current as any).role}</h4>
               <div onClick={() => onSound((current as any).fact)} className="relative w-full max-w-lg aspect-square bg-pink-50 rounded-[4rem] border-8 border-white shadow-2xl overflow-hidden mb-10 cursor-pointer group">
                 {loading ? <div className="absolute inset-0 flex items-center justify-center animate-spin"><Heart className="h-4 w-4 text-pink-200"/></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 transition-transform group-hover:scale-110" alt={(current as any).role} />}
                 <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/5 transition-colors flex items-center justify-center"><Volume2 className="text-white text-6xl opacity-0 group-hover:opacity-100 drop-shadow-lg" /></div>
              </div>
              <div className="bg-pink-50 p-8 rounded-3xl border-4 border-dashed border-pink-200 text-center w-full max-w-xl mb-10">
                 <p className="text-2xl font-black text-pink-800 italic leading-relaxed">"{(current as any).fact}"</p>
              </div>
              <div className="flex gap-4 items-center">
                 <Button onClick={() => setIndex(i => (i === 0 ? communityData.length - 1 : i - 1))} variant="outline" size="icon" className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all hover:bg-slate-200"><ArrowLeft/></Button>
                 <Button onClick={() => { onSound((current as any).fact); onComplete(); }} className="px-12 py-5 bg-pink-500 text-white font-black rounded-3xl shadow-xl border-4 border-white uppercase tracking-widest text-xl">Learn Role! 🌟</Button>
                 <Button onClick={() => setIndex(i => (i + 1) % communityData.length)} variant="outline" size="icon" className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all hover:bg-slate-200"><ArrowRight/></Button>
              </div>
          </div>
          )}
        </div>
        {isDrawerOpen && <TeacherModal title={`AI Social Assistant`} topicLabel={subTab === 'community' ? 'Community Helper' : 'Social Skill'} topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const PuppetTheater: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [data, setData] = useState([{ title: 'Sharing Toys', dialogue: 'Mia: Can I play with your car?\nLeo: Yes, let\'s share!', icon: '🎭', imagePrompt: 'A 3D Pixar-style illustration of cute animal puppets discussing sharing' }]);
    const [story, setStory] = useState('');
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    const generateStory = async () => {
      if (!schoolId) return;
      setLoading(true);
      const result = await generateRhyme({ topic: "Puppet Friends", schoolId });
      setStory(result.rhyme);
      await onSound(`Welcome to the Puppet Theater! ${result.rhyme}`);
      onComplete();
      setLoading(false);
    };

    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        try {
            const result = await generateLifeSkillEntry({ topic: aiTopic, category: 'puppets', schoolId });
            if(result.success && result.data){
                setData(prev => [...prev, result.data]);
                setIsDrawerOpen(false);
            }
        } catch(e) {} finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 flex flex-col items-center animate-in zoom-in relative">
        {canEdit && <button onClick={() => setIsDrawerOpen(true)} className="absolute top-4 right-4 bg-white border-2 border-purple-200 text-purple-600 px-3 py-1 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-purple-50"><Wand2 className="w-3 h-3 inline-block mr-1"/> AI Puppet</button>}
        <h3 className="text-4xl font-black text-purple-600 mb-10 uppercase tracking-tighter">Puppet Theater 🎭</h3>
        <div className="w-80 h-80 bg-purple-50 rounded-full border-8 border-white shadow-2xl flex items-center justify-center mb-10 relative overflow-hidden group">
           <Drama className="text-8xl text-purple-200 group-hover:scale-110 transition-transform"/>
        </div>
        <Button onClick={generateStory} disabled={loading} className="px-16 py-6 bg-purple-600 text-white rounded-[3rem] font-black uppercase text-2xl shadow-xl border-4 border-white">
          {loading ? <Loader2 className="animate-spin" /> : "Start Show!"}
        </Button>
        {story && <p className="mt-10 text-xl font-black text-slate-700 italic text-center max-w-lg">"{story}"</p>}
        {isDrawerOpen && <TeacherModal title="AI Puppet Show Maker" topicLabel="Dialogue Topic" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};
  
const CognitiveSkills: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [subTab, setSubTab] = useState<'scenarios' | 'patterns' | 'whatIf'>('scenarios');
    const [index, setIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const [data, setData] = useState(LIFE_SKILLS_DATA.cognitive);
    const currentData = data[subTab];
    const current = currentData[index] || currentData[0];
  
    useEffect(() => { setUserAnswer(null); }, [subTab, index]);
  
    const handleChoice = (idx: number) => {
      setUserAnswer(idx);
      if (idx === (current as any).correct || subTab === 'whatIf') {
        onSound(`Great thinking!`); onComplete();
      }
    };
    
    const generateWithAi = async () => {
        if (!aiTopic || !schoolId) return; setIsAiLoading(true);
        try {
            const result = await generateLifeSkillEntry({ topic: aiTopic, category: subTab, schoolId });
            if(result.success && result.data){
                setData(prev => ({...prev, [subTab]: [...prev[subTab], result.data]}));
                setIndex(data[subTab].length);
                setIsDrawerOpen(false);
            }
        } catch(e) {} finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center animate-in zoom-in relative">
        {canEdit && <button onClick={() => setIsDrawerOpen(true)} className="absolute top-4 right-4 bg-white border-2 border-emerald-200 text-emerald-600 px-3 py-1 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-emerald-50"><Wand2 className="w-3 h-3 inline-block mr-1"/> AI Puzzle</button>}
        <div className="flex gap-4 mb-10 font-black">
          {(['scenarios', 'patterns', 'whatIf'] as const).map(t => (
            <button key={t} onClick={() => {setSubTab(t); setIndex(0);}} className={`px-6 py-2 rounded-xl font-black text-xs uppercase ${subTab === t ? 'bg-emerald-500 text-white' : 'bg-slate-100'}`}>{t}</button>
          ))}
        </div>
        <h3 className="text-3xl font-black text-emerald-600 mb-8 uppercase">Super Solver 🧠</h3>
        <p className="text-2xl font-black text-slate-800 mb-10 text-center italic max-w-lg">"{(current as any).q}"</p>
        
        {subTab !== 'whatIf' && (
          <div className="flex gap-4 font-black">
            {(current as any).options.map((opt: string, i: number) => (
              <button key={i} onClick={() => handleChoice(i)} className={`w-24 h-24 rounded-3xl font-black text-4xl border-4 transition-all ${userAnswer === i ? (i === (current as any).correct ? 'bg-green-500 text-white border-white scale-110' : 'bg-red-500 text-white border-white') : 'bg-emerald-50 text-emerald-600 border-white hover:bg-emerald-100'}`}>
                <IconRenderer iconName={opt} />
              </button>
            ))}
          </div>
        )}
  
        {subTab === 'whatIf' && (
          <button onClick={() => { onSound((current as any).a); onComplete(); }} className="px-16 py-6 bg-emerald-500 text-white rounded-[3rem] font-black uppercase text-xl shadow-xl border-4 border-white">Answer Me!</button>
        )}
  
        <div className="flex gap-4 mt-12 font-black">
          <Button onClick={() => setIndex(i => (i === 0 ? currentData.length - 1 : i - 1))} variant="outline" size="icon" className="w-14 h-14 rounded-full"><ArrowLeft/></Button>
          <Button onClick={() => setIndex(i => (i + 1) % currentData.length)} variant="outline" size="icon" className="w-14 h-14 rounded-full"><ArrowRight/></Button>
        </div>
        {isDrawerOpen && <TeacherModal title="AI Puzzle Assistant" topicLabel="Puzzle Topic" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const PhysicalHealthModule: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const [subTab, setSubTab] = useState<'grossMotor' | 'fineMotor' | 'hygiene' | 'nutrition'>('grossMotor');
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const [grossMotor, setGrossMotor] = useState(LIFE_SKILLS_DATA.physicalHealth.grossMotor);
    const [fineMotor, setFineMotor] = useState(LIFE_SKILLS_DATA.physicalHealth.fineMotor);
    const [hygiene, setHygiene] = useState(LIFE_SKILLS_DATA.physicalHealth.hygiene);
    const [nutrition, setNutrition] = useState(LIFE_SKILLS_DATA.physicalHealth.nutrition);
  
    const getCurrentData = () => {
      if (subTab === 'grossMotor') return grossMotor;
      if (subTab === 'fineMotor') return fineMotor;
      if (subTab === 'hygiene') return hygiene;
      return nutrition;
    };
  
    const data = getCurrentData();
    const current = data[index] || data[0];
  
    const fetchVisual = useCallback(async () => {
        if (!current || !schoolId) return; setLoading(true);
        const result = await generateLessonImageAction({ prompt: current.prompt, schoolId });
        if (result.success) setImageUrl(result.data || null); setLoading(false);
    }, [current, schoolId]);

    useEffect(() => { fetchVisual(); }, [subTab, index, data, fetchVisual]);
  
    const handleAction = () => {
      onSound(`Great job! ${current.action} You are getting so strong and healthy!`);
      onComplete();
    };
  
    const generateWithAi = async () => {
      if (!aiTopic || !schoolId) return; setIsAiLoading(true);
      try {
        const result = await generateLifeSkillEntry({ topic: aiTopic, category: 'health', schoolId });
        if(result.success && result.data){
            const newItem = result.data;
            if (subTab === 'grossMotor') setGrossMotor(prev => [...prev, newItem]);
            else if (subTab === 'fineMotor') setFineMotor(prev => [...prev, newItem]);
            else if (subTab === 'hygiene') setHygiene(prev => [...prev, newItem]);
            else setNutrition(prev => [...prev, newItem]);
            setIndex(data.length); setIsDrawerOpen(false);
        }
      } catch (e) {} finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative font-black">
        {canEdit && <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-green-200 text-green-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-green-50 transition-colors"><Wand2 className="w-3 h-3 inline-block mr-1"/> AI Health Assistant</button>}
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-green-100 flex flex-col items-center min-h-[600px] animate-in zoom-in">
          <h3 className="text-4xl font-black text-green-600 mb-8 uppercase tracking-tighter text-center font-black">Physical & Health Hub 🏃‍♂️</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-10 p-2 bg-green-50 rounded-2xl font-black">
            {['grossMotor', 'fineMotor', 'hygiene', 'nutrition'].map(t => (<button key={t} onClick={() => {setSubTab(t as any); setIndex(0);}} className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${subTab === t ? 'bg-green-500 text-white shadow-md' : 'text-green-700'}`}>{t.replace('Motor', ' Motor')}</button>))}
          </div>
          <div className="flex flex-col items-center animate-in zoom-in w-full max-w-2xl font-black">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-md border-4 border-white animate-bounce"><IconRenderer iconName={current.icon} /></div>
              <h4 className="text-3xl font-black text-slate-800 uppercase mb-4">{current.title}</h4>
              <div onClick={handleAction} className="relative w-full aspect-video bg-green-50 rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden mb-10 cursor-pointer group"><div className="absolute inset-0 flex items-center justify-center animate-spin"><HeartPulse className="h-4 w-4 text-green-200"/></div><div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/5 transition-colors flex items-center justify-center"><Play className="text-white text-6xl opacity-0 group-hover:opacity-100 drop-shadow-lg" /></div></div>
              <div className="bg-green-50 p-8 rounded-3xl border-4 border-dashed border-green-200 text-center w-full mb-10"><p className="text-2xl font-black text-slate-700 italic leading-relaxed">"{current.action}"</p></div>
              <div className="flex gap-4 items-center"><Button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} variant="outline" size="icon" className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all hover:bg-slate-200"><ArrowLeft/></Button><Button onClick={handleAction} className="px-12 py-5 bg-green-500 text-white font-black rounded-3xl shadow-xl border-4 border-white uppercase tracking-widest text-xl">I Did It! 🏆</Button><Button onClick={() => setIndex(i => (i + 1) % data.length)} variant="outline" size="icon" className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all hover:bg-slate-200"><ArrowRight/></Button></div>
          </div>
        </div>
        {isDrawerOpen && <TeacherModal title={`Add ${subTab.replace('-', ' ')}`} topicLabel="Task or Habit" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const LifeSkillsZone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LifeSkillTab>('emotions');
  const [startedModules, setStartedModules] = useState<Record<LifeSkillTab, boolean>>({
    emotions: false, 'routine-songs': false, modeling: false, 'practical-life': false, communication: false, 
    social: false, 'puppet-theater': false, cognitive: false, 'physical-health': false,
  });
  const { schoolId } = useCurrentSchool();
  const currentSourceRef = useRef<HTMLAudioElement | null>(null);

  const playFeedbackSound = useCallback(async (text: string) => {
    if (!text || !schoolId) return;
    if (currentSourceRef.current) try { currentSourceRef.current.pause(); } catch (e) {}
    const result = await generateTTSAction({ text, voice: 'Kore', schoolId });
    if (result.success && result.data && typeof window !== 'undefined') {
        const audio = new Audio(`data:audio/wav;base64,${result.data}`);
        currentSourceRef.current = audio;
        audio.play();
        audio.onended = () => { currentSourceRef.current = null; };
    }
  }, [schoolId]);

  const onComplete = () => { confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } }); };

  const tabs: { id: LifeSkillTab; label: string; icon: string }[] = [
    { id: 'emotions', label: 'My Feelings', icon: 'fa-face-smile' }, { id: 'routine-songs', label: 'Routine Songs', icon: 'fa-music' },
    { id: 'modeling', label: 'Watch & Learn', icon: 'fa-tv' }, { id: 'practical-life', label: 'My Day', icon: 'fa-child-reaching' },
    { id: 'communication', label: 'Let\'s Talk', icon: 'fa-comments' }, { id: 'social', label: 'Kindness', icon: 'fa-people-group' },
    { id: 'puppet-theater', label: 'Puppet Show', icon: 'fa-masks-theater' }, { id: 'cognitive', label: 'Super Solvers', icon: 'fa-brain' },
    { id: 'physical-health', label: 'Healthy Body', icon: 'fa-heart-pulse' },
  ];
  
  const colors: Record<LifeSkillTab, string> = {
    'emotions': 'bg-yellow-500', 'routine-songs': 'bg-pink-500', 'modeling': 'bg-indigo-500', 'practical-life': 'bg-blue-500',
    'communication': 'bg-orange-500', 'social': 'bg-rose-500', 'puppet-theater': 'bg-purple-500', 'cognitive': 'bg-emerald-500', 'physical-health': 'bg-green-500',
  };

  const renderModule = () => {
    if (!schoolId) return <div className="text-center p-8"><Loader2 className="animate-spin"/></div>;
    const commonProps = { onSound: playFeedbackSound, onComplete, schoolId };
    
    return (
        <ModuleContainerWithState
            title={activeTab.replace('-', ' ')}
            icon={tabs.find(t => t.id === activeTab)?.icon || 'fa-star'}
            started={startedModules[activeTab]}
            onStart={() => setStartedModules(p => ({...p, [activeTab]: true}))}
            onClose={() => setStartedModules(p => ({...p, [activeTab]: false}))}
        >
            {startedModules[activeTab] && (
                <>
                    {activeTab === 'emotions' && <EmotionsModule {...commonProps} />}
                    {activeTab === 'routine-songs' && <RoutineSongsModule {...commonProps} />}
                    {activeTab === 'modeling' && <ModelingModule {...commonProps} />}
                    {activeTab === 'practical-life' && <PracticalLifeModule {...commonProps} />}
                    {activeTab === 'communication' && <CommunicationModule {...commonProps} />}
                    {activeTab === 'social' && <SocialScenarios {...commonProps} />}
                    {activeTab === 'puppet-theater' && <PuppetTheater {...commonProps} />}
                    {activeTab === 'cognitive' && <CognitiveSkills {...commonProps} />}
                    {activeTab === 'physical-health' && <PhysicalHealthModule {...commonProps} />}
                </>
            )}
        </ModuleContainerWithState>
    );
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 font-black">
      <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4">
        <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-teal-50 min-w-max">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`min-w-[110px] px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${activeTab === tab.id ? `${colors[tab.id]} text-white shadow-xl scale-110 -translate-y-1` : 'text-slate-700 hover:bg-slate-50'}`}>
              <IconRenderer iconName={tab.icon} className="text-lg" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="w-full px-4">{renderModule()}</div>
    </div>
  );
};

export default LifeSkillsZone;
