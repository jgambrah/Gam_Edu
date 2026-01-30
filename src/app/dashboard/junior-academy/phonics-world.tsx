
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as constants from '@/lib/constants';
import { generateLessonImageAction, generateTTSAction, generatePhonicsWorldEntry } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { 
    Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
    Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, 
    Trophy, Gift, Check, CheckCircle2, XCircle, PenTool, Eraser, Database, Pencil, 
    Heart, Utensils, Smile, Tv, Users, Activity, CheckSquare, Handshake, Milestone, 
    Ear, Layers, AudioLines, Repeat, Underline, BookCheck, FolderOpen, Car, Earth, 
    Sparkles, HeartPulse, CloudSun, PawPrint, Shapes, Languages, Pen, Apple, Sun, 
    CloudRain, Guitar, Plane, MousePointer2, Cube, Carrot, Cookie, School, Home, 
    Recycle, Water, Droplets, HelpCircle, MessageSquare, Drama, ArrowLeft, Play,
    Flag, GraduationCap, Monitor, Zap, CircleDot, BotMessageSquare, Shirt, FlaskConical, Bed, 
    Eye, TrendingUp, Leaf, Tree, User, Hand, Signpost, FireExtinguisher, 
    Search, ChefHat, Ship, Shell, Bug, PenLine, GripVertical, GripHorizontal, 
    ChevronUp, ChevronDown, Circle, ThumbsUp, CheckCheck, Puzzle, Box, Image as ImageIcon, Gamepad2
} from 'lucide-react';
import { useRole } from '@/context/role-context';
import confetti from 'canvas-confetti';


// --- ROBUST ICON RENDERER ---
const iconMap: Record<string, React.ComponentType<any>> = {
    'fa-spell-check': Languages, 'fa-ear-listen': Ear, 'fa-pen-nib': Pen, 'fa-arrow-1-9': Calculator, 'fa-hand-holding-heart': Handshake,
    'fa-flask-vial': FlaskConical, 'fa-palette': Palette, 'fa-robot': BotMessageSquare, 'fa-face-smile': Smile, 'fa-tooth': Sparkles,
    'fa-heart-pulse': HeartPulse, 'fa-vest': Shirt, 'fa-sun': Sun, 'fa-utensils': Utensils, 'fa-school': School, 'fa-house': Home,
    'fa-recycle': Recycle, 'fa-water': Droplets, 'fa-broom': Trash2, 'fa-flag': Flag, 'fa-hand-pointer': MousePointer2,
    'fa-chalkboard-user': User, 'fa-tv': Tv, 'fa-bed': Bed, 'fa-eye': Eye, 'fa-cloud-showers-heavy': CloudRain,
    'fa-guitar': Guitar, 'fa-plane': Plane, 'fa-frog': Rabbit, 'fa-circle-dot': CircleDot, 'fa-soap': Sparkles, 'fa-broccoli': Carrot,
    'fa-display': Monitor, 'fa-graduation-cap': GraduationCap, 'fa-comments': MessageSquare, 'fa-people-group': Users,
    'fa-masks-theater': Drama, 'fa-child-reaching': User, 'fa-music': Music, 'fa-magic': Wand2, 'fa-arrow-left': ArrowLeft,
    'fa-arrow-right': ArrowRight, 'fa-spinner': Loader2, 'fa-volume-high': Volume2, 'fa-dna': Atom, 'fa-play': Play,
    'fa-heart': Heart, 'fa-face-smile-wink': Smile, 'fa-images': ImageIcon, 'fa-hands-clapping': Hand, 'fa-gamepad': Gamepad2,
    'fa-layer-group': Layers, 'fa-repeat': Repeat, 'fa-microphone-lines': Mic, 'fa-underline': Underline,
    'fa-road-sign': Signpost, 'fa-book-open': BookOpen, 'fa-apple-whole': Apple, 'fa-star': Star, 'fa-car': Car,
    'fa-bolt': Zap, 'fa-cookie': Cookie, 'fa-rabbit': Rabbit, 'fa-carrot': Carrot, 'fa-lines-leaning': PenLine,
    'fa-grip-lines-vertical': GripVertical, 'fa-grip-lines': GripHorizontal, 'fa-chevron-up': ChevronUp,
    'fa-chevron-down': ChevronDown, 'fa-circle': Circle, 'fa-trash-can': Trash2, 'fa-thumbs-up': ThumbsUp,
    'fa-check-double': CheckCheck, 'fa-puzzle-piece': Puzzle, 'fa-cube': Box
};

const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const IconComponent = iconMap[iconName] || HelpCircle;
    return <IconComponent className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} />;
};


type PhonicsTab = 'jolly-phonics' | 'alphabet' | 'picture-reading' | 'syllables' | 'alliteration' | 'sound-games' | 'blends' | 'rhymes' | 'diction' | 'environmental-print' | 'book-handling' | 'missing-letters';

const TeacherModal: React.FC<{
  title: string; topicLabel: string; topicValue: string; 
  onTopicChange: (v: string) => void; onGenerate: () => void; 
  isLoading: boolean; onClose: () => void;
}> = ({ title, topicLabel, topicValue, onTopicChange, onGenerate, isLoading, onClose }) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
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
          className="w-full"
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
                <IconRenderer iconName={icon} className="h-16 w-16 mx-auto text-pink-300 mb-4"/>
                <h3 className="text-2xl font-bold text-pink-600 mb-2">{title}</h3>
                <p className="text-slate-500 mb-4">Ready to start this activity?</p>
                <Button onClick={() => setStarted(true)} className="bg-pink-500 hover:bg-pink-600">Start Activity</Button>
            </div>
        );
    }
    return <>{children}</>;
};

const PhonicsZone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PhonicsTab>('jolly-phonics');
  const { schoolId } = useCurrentSchool();
  const currentSourceRef = useRef<HTMLAudioElement | null>(null);

  const playFeedbackSound = useCallback(async (text: string) => {
    if (!text || !schoolId) return;
    if (currentSourceRef.current) {
        try { currentSourceRef.current.pause(); } catch (e) {}
    }
    try {
        const result = await generateTTSAction({ text, voice: 'Kore', schoolId });
        if (result.success && result.data && typeof window !== 'undefined') {
            const audio = new Audio(`data:audio/wav;base64,${result.data}`);
            currentSourceRef.current = audio;
            audio.play();
            audio.onended = () => { currentSourceRef.current = null; };
        }
    } catch (err: any) {
        console.error("Audio playback error:", err);
    }
  }, [schoolId]);

  const tabIcons: Record<PhonicsTab, string> = {
    'jolly-phonics': 'fa-face-smile-wink',
    'alphabet': 'fa-font',
    'picture-reading': 'fa-images',
    'syllables': 'fa-hands-clapping',
    'alliteration': 'fa-ear-listen',
    'sound-games': 'fa-gamepad',
    'blends': 'fa-layer-group',
    'rhymes': 'fa-repeat',
    'diction': 'fa-microphone-lines',
    'missing-letters': 'fa-underline',
    'environmental-print': 'fa-road-sign',
    'book-handling': 'fa-book-open',
  };

  const colors: Record<PhonicsTab, string> = {
    'jolly-phonics': 'bg-pink-600',
    'alphabet': 'bg-pink-500',
    'picture-reading': 'bg-indigo-500',
    'syllables': 'bg-purple-400',
    'alliteration': 'bg-orange-400',
    'sound-games': 'bg-emerald-500',
    'blends': 'bg-orange-600',
    'rhymes': 'bg-cyan-600',
    'diction': 'bg-rose-400',
    'missing-letters': 'bg-emerald-600',
    'environmental-print': 'bg-orange-500',
    'book-handling': 'bg-blue-500',
  };
  
  const renderModule = () => {
    if(!schoolId) return <div className="text-center p-8"><Loader2 className="animate-spin"/></div>;
    const commonProps = { onSound: playFeedbackSound, schoolId: schoolId };
    
    switch(activeTab) {
      case 'jolly-phonics': return <ModuleContainer title="Jolly Phonics" icon="fa-face-smile-wink"><JollyPhonicsModule {...commonProps} /></ModuleContainer>;
      case 'alphabet': return <ModuleContainer title="Alphabet" icon="fa-font"><AlphabetModule {...commonProps} /></ModuleContainer>;
      case 'picture-reading': return <ModuleContainer title="Picture Reading" icon="fa-images"><PictureReadingModule {...commonProps} /></ModuleContainer>;
      case 'syllables': return <ModuleContainer title="Syllable Clapping" icon="fa-hands-clapping"><SyllablesModule {...commonProps} /></ModuleContainer>;
      case 'alliteration': return <ModuleContainer title="Matching Sounds" icon="fa-ear-listen"><AlliterationModule {...commonProps} /></ModuleContainer>;
      case 'sound-games': return <ModuleContainer title="Sound Games" icon="fa-gamepad"><SoundGamesModule {...commonProps} /></ModuleContainer>;
      case 'blends': return <ModuleContainer title="Blends & Digraphs" icon="fa-layer-group"><BlendsModule {...commonProps} /></ModuleContainer>;
      case 'rhymes': return <ModuleContainer title="Rhyming Families" icon="fa-repeat"><RhymesModule {...commonProps} /></ModuleContainer>;
      case 'diction': return <ModuleContainer title="Clear Speaking" icon="fa-microphone-lines"><DictionModule {...commonProps} /></ModuleContainer>;
      case 'missing-letters': return <ModuleContainer title="Fill the Gap" icon="fa-underline"><MissingLettersModule {...commonProps} /></ModuleContainer>;
      case 'environmental-print': return <ModuleContainer title="Reading the World" icon="fa-road-sign"><EnvironmentalPrintModule {...commonProps} /></ModuleContainer>;
      case 'book-handling': return <ModuleContainer title="Book Handling" icon="fa-book-open"><BookHandlingModule {...commonProps} /></ModuleContainer>;
      default: return <p>Coming Soon</p>;
    }
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 font-black">
      <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4">
        <div className="flex justify-start md:justify-center gap-3 bg-white p-5 rounded-[4rem] shadow-2xl border-4 border-pink-50 min-w-max font-black">
          {(Object.keys(tabIcons) as PhonicsTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`min-w-[130px] px-6 py-4 rounded-3xl font-black text-[13px] uppercase tracking-wider transition-all flex flex-col items-center gap-2 border-4 ${
                activeTab === tab 
                ? `${colors[tab]} text-white border-black shadow-2xl scale-110 -translate-y-2` 
                : 'bg-white text-black border-slate-100 hover:bg-pink-50 hover:border-pink-300'
              }`}
            >
              <IconRenderer iconName={tabIcons[tab]} className={`text-2xl ${activeTab === tab ? 'text-white' : 'text-pink-600'}`} />
              <span className="leading-tight">{tab.replace('-', ' ')}</span>
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


const JollyPhonicsModule: React.FC<{onSound: (text:string) => void, schoolId: string}> = ({onSound, schoolId}) => {
  const [data, setData] = useState(constants.JOLLY_PHONICS_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const current = data[index];
  const fetchVisual = useCallback(async () => { if (!schoolId) return; setLoading(true); const url = await generateLessonImageAction({prompt: current.imagePrompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
  useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);

  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
      const result = await generatePhonicsWorldEntry(aiTopic, 'jolly-phonics', schoolId);
      if(result.success && result.data){
          setData(prev => [result.data, ...prev]);
          setIsDrawerOpen(false); setIndex(0); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="w-full relative font-black">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-pink-200 text-pink-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-pink-50 transition-colors"><IconRenderer iconName="fa-magic"/> AI Maker</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center min-h-[600px] animate-in zoom-in">
        <div className="flex items-center gap-8 mb-10">
           <h2 className="text-9xl font-black text-pink-500 drop-shadow-xl">{current.letter}</h2>
           <div className="text-left">
             <p className="text-xl font-black text-slate-500 uppercase tracking-widest">The sound is:</p>
             <h4 className="text-5xl font-black text-pink-400 italic">"{current.sound}"</h4>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full mb-10">
            <div onClick={() => onSound(current.story)} className="relative aspect-square bg-pink-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center overflow-hidden cursor-pointer group">
              {loading ? <Loader2 className="w-16 h-16 animate-spin text-pink-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 group-hover:scale-105 transition-transform" alt={current.letter} />}
              <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/5 transition-colors flex items-center justify-center"><IconRenderer iconName="fa-play" className="text-white text-6xl opacity-0 group-hover:opacity-100 drop-shadow-lg" /></div>
            </div>
            <div className="flex flex-col justify-center gap-6">
               <div className="bg-pink-50 p-6 rounded-3xl border-4 border-white shadow-md">
                 <p className="text-xs font-black text-slate-600 uppercase mb-2">The Action:</p>
                 <p className="text-xl font-bold text-slate-800 leading-relaxed italic">{current.action}</p>
                 <button onClick={() => onSound(current.action)} className="mt-4 px-6 py-2 bg-white text-pink-500 rounded-full font-black text-[11px] uppercase shadow-sm border border-pink-50">Listen to Action</button>
               </div>
               <div className="bg-white p-6 rounded-3xl border-4 border-pink-50 shadow-md">
                 <p className="text-xs font-black text-slate-500 uppercase mb-2">The Story:</p>
                 <p className="text-lg font-black text-slate-800 leading-relaxed">"{current.story}"</p>
               </div>
            </div>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} className="w-14 h-14 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all hover:bg-slate-200"><IconRenderer iconName="fa-arrow-left" /></button>
           <button onClick={() => setIndex(i => (i + 1) % data.length)} className="w-14 h-14 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all hover:bg-slate-200"><IconRenderer iconName="fa-arrow-right" /></button>
        </div>
      </div>
      {isDrawerOpen && <TeacherModal title="AI Phonics Assistant" topicLabel="Sound Focus" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const AlphabetModule: React.FC<{onSound: (text:string) => void, schoolId: string}> = ({onSound, schoolId}) => {
  const sortedData = useMemo(() => [...constants.PHONICS_DATA].sort((a, b) => a.upper.localeCompare(b.upper)), []);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const current = sortedData[index];

  const fetchImage = useCallback(async () => { if (!schoolId) return; setLoading(true); const url = await generateLessonImageAction({prompt: current.imagePrompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
  useEffect(() => { setImageUrl(null); fetchImage(); }, [index, fetchImage]);
  const playSound = async () => onSound(`Big ${current.upper}, little ${current.lower}. The sound is ${current.lower}... ${current.upper} is for ${current.word}.`);

  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
      await generatePhonicsWorldEntry(aiTopic, 'alphabet', schoolId);
      onSound("New letter created!");
      setIsDrawerOpen(false); setAiTopic('');
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto relative font-black">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-pink-200 text-pink-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-pink-50 transition-colors"><IconRenderer iconName="fa-magic" /></button>
      <div className="p-8 md:p-12 bg-white rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center relative overflow-hidden animate-in zoom-in">
        <div className="w-full flex overflow-x-auto gap-2 pb-6 mb-8 no-scrollbar border-b-4 border-pink-50 px-4">
           {sortedData.map((item, i) => (
             <button key={item.upper} onClick={() => setIndex(i)} className={`flex-shrink-0 w-12 h-12 rounded-xl font-black text-2xl border-4 transition-all ${index === i ? 'bg-pink-500 text-white border-white scale-110 shadow-lg' : 'bg-pink-50 text-pink-300 border-transparent hover:bg-pink-100'}`}>{item.upper}</button>
           ))}
        </div>
        <div className="flex gap-8 items-end mb-12">
          <div className="text-center">
            <p className="text-xs font-black text-slate-500 uppercase mb-2">Upper</p>
            <h2 className="text-9xl font-black text-pink-500 drop-shadow-lg">{current.upper}</h2>
          </div>
          <div className="text-center">
            <p className="text-xs font-black text-slate-500 uppercase mb-2">Lower</p>
            <h2 className="text-7xl font-black text-pink-400 drop-shadow-md">{current.lower}</h2>
          </div>
        </div>
        <div className="w-72 h-72 md:w-96 md:h-96 bg-pink-50 rounded-[3rem] overflow-hidden shadow-inner flex items-center justify-center relative mb-12 border-8 border-white group cursor-pointer" onClick={playSound}>
          {loading ? <Loader2 className="w-16 h-16 animate-spin text-pink-400" /> : imageUrl && <img src={imageUrl} alt={current.word} className="w-full h-full object-cover p-10 group-hover:scale-110 transition-transform duration-500" />}
        </div>
        <div className="bg-pink-500 text-white px-10 py-4 rounded-3xl border-4 border-white shadow-xl mb-12"><p className="text-2xl font-black uppercase tracking-widest">{current.word}!</p></div>
        <div className="flex gap-6 items-center">
          <button onClick={() => setIndex(prev => (prev - 1 + sortedData.length) % sortedData.length)} className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 shadow-md active:scale-90 transition-all"><IconRenderer iconName="fa-arrow-left" className="text-2xl" /></button>
          <button onClick={playSound} className="w-24 h-24 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xl border-4 border-white active:scale-95 transition-all"><IconRenderer iconName="fa-volume-high" className="text-4xl" /></button>
          <button onClick={() => setIndex(prev => (prev + 1) % sortedData.length)} className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 shadow-md active:scale-90 transition-all"><IconRenderer iconName="fa-arrow-right" className="text-2xl" /></button>
        </div>
      </div>
      {isDrawerOpen && <TeacherModal title="AI Alphabet Assistant" topicLabel="Letter Idea" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const PictureReadingModule: React.FC<{onSound: (text:string) => void, schoolId: string}> = ({onSound, schoolId}) => {
  const [data, setData] = useState(constants.PICTURE_READING_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [answered, setAnswered] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const current = data[index];
  const fetchImages = useCallback(async () => { if (!schoolId) return; setLoading(true); const urls = await Promise.all(current.options.map(opt => generateLessonImageAction({prompt: opt.prompt, schoolId}))); setImageUrls(urls.map(u => u.data || '')); setLoading(false); }, [current, schoolId]);
  useEffect(() => { fetchImages(); setAnswered(null); }, [index, data, fetchImages]);
  
  const handleChoice = (idx: number) => { setAnswered(idx); if (idx === current.correctIdx) { onSound(`Yes! ${current.target} starts with the sound ${current.sound}!`); confetti(); } else { onSound(`Try again!`); } };

  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
      const result = await generatePhonicsWorldEntry(aiTopic, 'picture-reading', schoolId);
      if(result.success && result.data){
        setData(prev => [result.data, ...prev]);
        setIsDrawerOpen(false); setIndex(0); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="w-full relative font-black">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-indigo-200 text-indigo-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-indigo-50 transition-colors"><IconRenderer iconName="fa-magic"/> AI Maker</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-indigo-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-bottom">
        <h3 className="text-4xl font-black text-indigo-600 mb-8 uppercase tracking-tighter text-center">Picture Reading! 🖼️</h3>
        <p className="text-2xl text-slate-500 mb-10 italic">Which one starts with the sound <span className="text-indigo-600 text-4xl uppercase tracking-widest font-black">{current.sound}</span>?</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          {current.options.map((opt, i) => (
            <button key={i} onClick={() => handleChoice(i)} className={`p-4 rounded-[3rem] border-8 transition-all flex flex-col items-center gap-4 shadow-xl group overflow-hidden ${answered === i ? (i === current.correctIdx ? 'bg-green-500 text-white border-white scale-110 shadow-green-100' : 'bg-red-500 text-white border-white') : 'bg-indigo-50 border-white hover:border-indigo-200'}`}>
              <div className="w-full aspect-square bg-white rounded-[2.5rem] overflow-hidden flex items-center justify-center">
                 {loading ? <Loader2 className="w-8 h-8 animate-spin text-indigo-200" /> : imageUrls[i] && <img src={imageUrls[i]} className="w-full h-full object-cover p-4 transition-transform group-hover:scale-110" alt={opt.name} />}
              </div>
              <span className={`font-black uppercase text-sm tracking-widest ${answered === i ? 'text-white' : 'text-indigo-600'}`}>{opt.name}</span>
            </button>
          ))}
        </div>
        {answered === current.correctIdx && <button onClick={() => setIndex(p => (p + 1) % data.length)} className="mt-12 px-12 py-5 bg-indigo-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase">Next Picture! 🚀</button>}
      </div>
      {isDrawerOpen && <TeacherModal title="AI Picture Assistant" topicLabel="Sound Focus" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const SyllablesModule: React.FC<{onSound: (text:string) => void, schoolId: string}> = ({onSound, schoolId}) => {
  const [data, setData] = useState(constants.SYLLABLES_DATA);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const current = data[index];
  const fetchVisual = useCallback(async () => { if (!schoolId) return; setLoading(true); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
  useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);

  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
      const result = await generatePhonicsWorldEntry(aiTopic, 'syllables', schoolId);
      if(result.success && result.data){
        setData(prev => [result.data, ...prev]);
        setIsDrawerOpen(false); setIndex(0); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="w-full relative font-black">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-purple-200 text-purple-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-purple-50 transition-colors"><IconRenderer iconName="fa-magic"/> AI Maker</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 flex flex-col items-center min-h-[600px] animate-in zoom-in">
        <h3 className="text-4xl font-black text-purple-600 mb-8 uppercase tracking-tighter text-center">Clap the word! 👏</h3>
        <div onClick={() => onSound(`${current.word}... ${current.syllables.join('... ')}`)} className="w-full max-w-lg aspect-square bg-purple-50 rounded-[3rem] border-8 border-white shadow-2xl flex items-center justify-center mb-10 overflow-hidden cursor-pointer group relative">
          {loading ? <Loader2 className="w-16 h-16 animate-spin text-purple-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-10 transition-transform group-hover:scale-105" />}
          <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors flex items-center justify-center"><IconRenderer iconName="fa-volume-high" className="text-white text-6xl opacity-0 group-hover:opacity-100 drop-shadow-lg" /></div>
        </div>
        <div className="flex gap-4 mb-10">
          {current.syllables.map((s, i) => (<div key={i} className="px-10 py-6 bg-purple-600 text-white rounded-[2rem] text-4xl font-black shadow-xl border-4 border-white animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>{s}</div>))}
        </div>
        <button onClick={() => setIndex((index + 1) % data.length)} className="px-12 py-5 bg-purple-500 text-white font-black rounded-full shadow-lg uppercase tracking-widest border-4 border-white">Next Word</button>
      </div>
      {isDrawerOpen && <TeacherModal title="AI Syllable Assistant" topicLabel="Word Focus" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const AlliterationModule: React.FC<{onSound: (text:string) => void, schoolId: string}> = ({onSound, schoolId}) => {
  const [data, setData] = useState(constants.ALLITERATION_DATA);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [answered, setAnswered] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const current = data[index];
  const fetchVisual = useCallback(async () => { if (!schoolId) return; setLoading(true); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
  useEffect(() => { fetchVisual(); setAnswered(null); }, [index, data, fetchVisual]);
  
  const handleChoice = (idx: number, isMatch: boolean) => {
    setAnswered(idx);
    if (isMatch) { onSound(`Yes! ${current.options[idx].word} starts with ${current.sound} just like ${current.target}!`); confetti(); }
    else { onSound(`Oops! That doesn't sound the same!`); }
  };
  
  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
      const result = await generatePhonicsWorldEntry(aiTopic, 'alliteration', schoolId);
      if(result.success && result.data){
        setData(prev => [result.data, ...prev]);
        setIsDrawerOpen(false); setIndex(0); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center min-h-[600px] animate-in zoom-in relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-orange-200 text-orange-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-orange-50 transition-colors"><IconRenderer iconName="fa-magic"/> AI Maker</button>
      <h3 className="text-4xl font-black text-orange-600 mb-8 uppercase tracking-tighter text-center">Matching Sounds! 👂</h3>
      <p className="text-2xl text-slate-500 mb-10 italic">Which word starts like <span className="text-orange-600 font-black">{current.target}</span>?</p>
      <div className="w-64 h-64 bg-orange-50 rounded-[3rem] border-8 border-white shadow-xl flex items-center justify-center mb-10 overflow-hidden">
        {loading ? <Loader2 className="w-12 h-12 animate-spin text-orange-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6" />}
      </div>
      <div className="flex gap-6">
        {current.options.map((opt, i) => (
          <button key={i} onClick={() => handleChoice(i, opt.match)} className={`px-12 py-6 rounded-[2.5rem] text-3xl font-black border-8 transition-all ${answered === i ? (opt.match ? 'bg-green-500 text-white border-white scale-110 shadow-xl' : 'bg-red-500 text-white border-white') : 'bg-orange-50 text-orange-600 border-white hover:border-orange-200'}`}>{opt.word}</button>
        ))}
      </div>
      {answered !== null && data[index].options[answered].match && <button onClick={() => setIndex((index + 1) % data.length)} className="mt-10 px-12 py-5 bg-orange-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase">More Matching!</button>}
      {isDrawerOpen && <TeacherModal title="AI Alliteration Assistant" topicLabel="Word Focus" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const SoundGamesModule: React.FC<{onSound: (text:string) => void, schoolId: string}> = ({onSound, schoolId}) => {
  const [data, setData] = useState(constants.SOUND_MATCHING_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchVisuals = useCallback(async () => { if (!schoolId) return; setLoading(true); const urls = await Promise.all(data[index].items.map(i => generateLessonImageAction({prompt: i.prompt, schoolId}))); setImageUrls(urls.map(u => u.data || '')); setLoading(false); }, [index, data, schoolId]);
  useEffect(() => { setImageUrls([]); fetchVisuals(); }, [index, data, fetchVisuals]);

  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
      const result = await generatePhonicsWorldEntry(aiTopic, 'sound-games', schoolId);
      if(result.success && result.data){
        setData(prev => [result.data, ...prev]);
        setIsDrawerOpen(false); setIndex(0); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center min-h-[600px] animate-in zoom-in relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-emerald-200 text-emerald-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-emerald-50 transition-colors"><IconRenderer iconName="fa-magic"/> AI Game Maker</button>
      <h3 className="text-4xl font-black text-emerald-600 mb-8 uppercase tracking-tighter text-center">The Magic Sound: {data[index].sound}! 🎶</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {data[index].items.map((item, i) => (
          <button key={i} onClick={() => onSound(item.word)} className="p-4 bg-emerald-50 rounded-[3rem] border-8 border-white shadow-xl hover:border-emerald-200 transition-all flex flex-col items-center group overflow-hidden">
            <div className="w-full aspect-square bg-white rounded-[2.5rem] overflow-hidden flex items-center justify-center mb-4">
               {loading ? <Loader2 className="w-8 h-8 animate-spin text-emerald-200" /> : imageUrls[i] && <img src={imageUrls[i]} className="w-full h-full object-cover p-4 group-hover:scale-110 transition-transform" />}
            </div>
            <span className="font-black uppercase text-2xl text-emerald-600">{item.word}</span>
          </button>
        ))}
      </div>
      <button onClick={() => setIndex((index + 1) % data.length)} className="mt-12 px-12 py-5 bg-emerald-500 text-white font-black rounded-3xl shadow-xl border-4 border-white uppercase tracking-widest">Next Sound</button>
      {isDrawerOpen && <TeacherModal title="AI Game Assistant" topicLabel="Letter Focus" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const BlendsModule: React.FC<{onSound: (text:string) => void, schoolId: string}> = ({onSound, schoolId}) => {
  const [data, setData] = useState(constants.BLENDS_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchVisuals = useCallback(async () => { if (!schoolId) return; setLoading(true); const urls = await Promise.all(data[index].words.map(i => generateLessonImageAction({prompt: i.prompt, schoolId}))); setImageUrls(urls.map(u => u.data || '')); setLoading(false); }, [index, data, schoolId]);
  useEffect(() => { setImageUrls([]); fetchVisuals(); }, [index, data, fetchVisuals]);

  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
      const result = await generatePhonicsWorldEntry(aiTopic, 'blends', schoolId);
      if(result.success && result.data){
        setData(prev => [result.data, ...prev]);
        setIsDrawerOpen(false); setIndex(0); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center min-h-[600px] animate-in zoom-in relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-orange-200 text-orange-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-orange-50 transition-colors"><IconRenderer iconName="fa-magic"/> AI Maker</button>
      <div className="text-center mb-10">
        <h3 className="text-8xl font-black text-orange-500 mb-4 uppercase tracking-[0.2em]">{data[index].blend}</h3>
        <span className="px-6 py-2 bg-orange-50 text-orange-600 rounded-full font-black text-xs uppercase tracking-widest border-2 border-orange-100">{data[index].type}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {data[index].words.map((item, i) => (
          <button key={i} onClick={() => onSound(item.word)} className="p-6 bg-orange-50 rounded-[3rem] border-8 border-white shadow-xl hover:border-orange-200 transition-all flex flex-col items-center group overflow-hidden">
            <div className="w-full aspect-square bg-white rounded-[2.5rem] overflow-hidden flex items-center justify-center mb-4">
               {loading ? <Loader2 className="w-8 h-8 animate-spin text-orange-200" /> : imageUrls[i] && <img src={imageUrls[i]} className="w-full h-full object-cover p-6 group-hover:scale-110 transition-transform" />}
            </div>
            <span className="font-black uppercase text-2xl text-orange-600">{item.word}</span>
          </button>
        ))}
      </div>
      <button onClick={() => setIndex((index + 1) % data.length)} className="mt-12 px-12 py-5 bg-orange-500 text-white font-black rounded-3xl shadow-xl border-4 border-white uppercase tracking-widest">Next Blend</button>
      {isDrawerOpen && <TeacherModal title="AI Blend Assistant" topicLabel="Sound Focus" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const RhymesModule: React.FC<{onSound: (text:string) => void, schoolId: string}> = ({onSound, schoolId}) => {
  const [data, setData] = useState(constants.RHYMES_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchVisuals = useCallback(async () => { if (!schoolId) return; setLoading(true); const urls = await Promise.all(data[index].words.map(i => generateLessonImageAction({prompt: i.prompt, schoolId}))); setImageUrls(urls.map(u => u.data || '')); setLoading(false); }, [index, data, schoolId]);
  useEffect(() => { setImageUrls([]); fetchVisuals(); }, [index, data, fetchVisuals]);

  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
      const result = await generatePhonicsWorldEntry(aiTopic, 'rhymes', schoolId);
      if(result.success && result.data){
        setData(prev => [result.data, ...prev]);
        setIsDrawerOpen(false); setIndex(0); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-cyan-100 flex flex-col items-center min-h-[600px] animate-in zoom-in relative">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-cyan-200 text-cyan-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-cyan-50 transition-colors"><IconRenderer iconName="fa-magic"/> AI Maker</button>
      <h3 className="text-6xl font-black text-cyan-600 mb-12 uppercase tracking-tighter text-center">The {data[index].ending} Family! 👨‍👩‍👧‍👦</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {data[index].words.map((item, i) => (
          <button key={i} onClick={() => onSound(item.word)} className="p-4 bg-cyan-50 rounded-[3rem] border-8 border-white shadow-xl hover:border-cyan-200 transition-all flex flex-col items-center group overflow-hidden">
            <div className="w-full aspect-square bg-white rounded-[2.5rem] overflow-hidden flex items-center justify-center mb-4">
               {loading ? <Loader2 className="w-8 h-8 animate-spin text-cyan-200" /> : imageUrls[i] && <img src={imageUrls[i]} className="w-full h-full object-cover p-4 group-hover:scale-110 transition-transform" />}
            </div>
            <span className="font-black uppercase text-2xl text-cyan-600">{item.word}</span>
          </button>
        ))}
      </div>
      <button onClick={() => setIndex((index + 1) % data.length)} className="mt-12 px-12 py-5 bg-cyan-500 text-white font-black rounded-3xl shadow-xl border-4 border-white uppercase tracking-widest">Next Family</button>
      {isDrawerOpen && <TeacherModal title="AI Rhyme Assistant" topicLabel="Ending (e.g. -at)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const DictionModule: React.FC<{onSound: (text:string) => void, schoolId: string}> = ({onSound, schoolId}) => {
  const [data, setData] = useState(constants.DICTION_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const current = data[index];

  const fetchVisual = useCallback(async () => { if (!schoolId) return; setLoading(true); setImageUrl(null); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
  useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
  
  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
      const result = await generatePhonicsWorldEntry(aiTopic, 'diction', schoolId);
      if(result.success && result.data){
        setData(prev => [result.data, ...prev]);
        setIsDrawerOpen(false); setIndex(0); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="w-full relative font-black">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-rose-200 text-rose-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-rose-50 transition-colors"><IconRenderer iconName="fa-magic"/> AI Maker</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-rose-100 flex flex-col items-center min-h-[600px] animate-in zoom-in">
        <h3 className="text-4xl font-black text-rose-600 mb-4 uppercase tracking-tighter text-center">Clear Speaking! 🗣️</h3>
        <p className="text-xl text-slate-500 mb-8 italic">Let's learn to say words clearly!</p>
        
        <div onClick={() => onSound(`${current.word}... ${current.syllables}`)} className="w-full max-w-sm aspect-square bg-rose-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-8 overflow-hidden cursor-pointer group">
          {loading ? <Loader2 className="w-16 h-16 animate-spin text-rose-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 group-hover:scale-105 transition-transform" alt={current.word} />}
        </div>

        <div className="bg-rose-50 p-8 rounded-[3rem] border-4 border-dashed border-rose-200 text-center w-full max-w-xl mb-10">
           <h4 className="text-8xl font-black text-rose-500 mb-4 uppercase tracking-widest leading-none">{current.word}</h4>
           <p className="text-4xl font-black text-slate-800 tracking-[0.5em] mb-4">{current.syllables}</p>
        </div>
        <button onClick={() => onSound(`${current.word}... ${current.syllables}... ${current.instruction}`)} className="px-16 py-6 bg-rose-500 text-white rounded-[3rem] font-black uppercase text-xl shadow-xl hover:scale-105 transition-all">Listen to Teacher 🎙️</button>
        <button onClick={() => setIndex((index + 1) % data.length)} className="mt-8 text-rose-300 uppercase text-[10px] tracking-widest">Next Word</button>
      </div>
      {isDrawerOpen && <TeacherModal title="AI Diction Assistant" topicLabel="Target Word" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const MissingLettersModule: React.FC<{onSound: (text:string) => void, schoolId: string}> = ({onSound, schoolId}) => {
  const [data, setData] = useState(constants.MISSING_LETTERS_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [answered, setAnswered] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const current = data[index];

  const fetchVisual = useCallback(async () => { if (!schoolId) return; setLoading(true); setImageUrl(null); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
  useEffect(() => { fetchVisual(); setAnswered(null); }, [index, data, fetchVisual]);
  
  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
      const result = await generatePhonicsWorldEntry(aiTopic, 'missing-letters', schoolId);
      if(result.success && result.data){
        setData(prev => [result.data, ...prev]);
        setIsDrawerOpen(false); setIndex(0); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  const handleChoice = (opt: string) => {
    setAnswered(opt);
    if (opt === current.missing) {
      onSound(`Yes! ${current.word.replace('_', opt)}!`);
      confetti();
    } else {
      onSound(`Try again!`);
    }
  };

  return (
    <div className="w-full relative font-black">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-emerald-200 text-emerald-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-emerald-50 transition-colors"><IconRenderer iconName="fa-magic"/> AI Maker</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center min-h-[600px] animate-in zoom-in">
        <h3 className="text-4xl font-black text-emerald-600 mb-8 uppercase tracking-tighter text-center">Fill the Gap! 🧩</h3>
        
        <div onClick={() => onSound(`This is a ${current.word.toLowerCase()}. Can you finish the word?`)} className="w-full max-w-sm aspect-square bg-emerald-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <Loader2 className="w-16 h-16 animate-spin text-emerald-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 group-hover:scale-105 transition-transform" alt={current.word} />}
        </div>

        <div className="flex gap-4 mb-12">
          {current.word.split('').map((char, i) => (
              <div key={i} className={`w-20 h-24 rounded-2xl flex items-center justify-center text-6xl font-black border-4 ${char === current.missing && !answered ? 'bg-emerald-50 border-emerald-100 text-emerald-200 border-dashed' : (char === current.missing && answered === current.missing ? 'bg-green-500 text-white border-white' : 'bg-white border-emerald-50 text-slate-800 shadow-md')}`}>
                {char === current.missing ? (answered || '?') : char}
              </div>
          ))}
        </div>
        <div className="flex gap-4">
          {current.options.map(opt => (
            <button key={opt} onClick={() => handleChoice(opt)} className={`w-20 h-20 rounded-2xl font-black text-4xl border-4 transition-all ${answered === opt ? (opt === current.missing ? 'bg-green-500 text-white border-white' : 'bg-red-500 text-white border-white') : 'bg-emerald-50 text-emerald-600 border-white hover:bg-emerald-100'}`}>{opt}</button>
          ))}
        </div>
        {answered === current.missing && <button onClick={() => { setIndex((index + 1) % data.length); setAnswered(null); }} className="mt-12 px-12 py-5 bg-emerald-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase">Next Puzzle! 🚀</button>}
      </div>
      {isDrawerOpen && <TeacherModal title="AI Puzzle Assistant" topicLabel="Target Word" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const EnvironmentalPrintModule: React.FC<{onSound: (text:string) => void, schoolId: string}> = ({onSound, schoolId}) => {
  const [data, setData] = useState(constants.ENVIRONMENTAL_PRINT_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const current = data[index];
  const fetchVisual = useCallback(async () => { if (!schoolId) return; setLoading(true); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
  useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
  
  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
      const result = await generatePhonicsWorldEntry(aiTopic, 'environmental-print', schoolId);
      if(result.success && result.data){
        setData(prev => [result.data, ...prev]);
        setIsDrawerOpen(false); setIndex(0); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="w-full relative font-black">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-orange-200 text-orange-500 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-orange-50 transition-colors"><IconRenderer iconName="fa-magic"/> AI Maker</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center min-h-[600px] animate-in zoom-in">
        <h3 className="text-4xl font-black text-orange-500 mb-8 uppercase tracking-tighter text-center">Reading the World! 🚦</h3>
        <div onClick={() => onSound(`This sign says ${current.text}. We see it at the ${current.context.toLowerCase()}.`)} className="w-full max-w-lg aspect-video bg-orange-50 rounded-[3rem] border-8 border-white shadow-2xl flex items-center justify-center mb-10 overflow-hidden cursor-pointer group relative">
          {loading ? <Loader2 className="w-16 h-16 animate-spin text-orange-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 group-hover:scale-105 transition-transform" />}
          <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors flex items-center justify-center"><IconRenderer iconName="fa-volume-high" className="text-white text-6xl opacity-0 group-hover:opacity-100 drop-shadow-lg" /></div>
        </div>
        <div className="bg-orange-500 text-white px-10 py-6 rounded-[2rem] shadow-xl border-4 border-white mb-10"><h4 className="text-6xl font-black tracking-widest">{current.text}</h4></div>
        <div className="flex gap-4">
          <button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center"><IconRenderer iconName="fa-arrow-left" className="text-2xl"/></button>
          <button onClick={() => setIndex(i => (i + 1) % data.length)} className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center"><IconRenderer iconName="fa-arrow-right" className="text-2xl"/></button>
        </div>
      </div>
      {isDrawerOpen && <TeacherModal title="AI Sign Assistant" topicLabel="Sign Focus" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const BookHandlingModule: React.FC<{onSound: (text:string) => void, schoolId: string}> = ({onSound, schoolId}) => {
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const currentBook = constants.BOOK_HANDLING_DATA[index];
  const currentPage = currentBook.pages[page];

  const fetchVisual = useCallback(async () => { if (!schoolId) return; setLoading(true); const url = await generateLessonImageAction({prompt: currentPage.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [currentPage, schoolId]);
  useEffect(() => { setImageUrl(null); fetchVisual(); }, [index, page, fetchVisual]);
  
  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
      await generatePhonicsWorldEntry(aiTopic, 'book-handling', schoolId);
      onSound("Great! New book instruction added magically!");
      setIsDrawerOpen(false); setAiTopic('');
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="w-full relative font-black">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-blue-200 text-blue-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-blue-50 transition-colors"><IconRenderer iconName="fa-magic"/> AI Maker</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center min-h-[600px] animate-in zoom-in">
        <h3 className="text-4xl font-black text-blue-600 mb-8 uppercase tracking-tighter text-center">{currentBook.title} 📖</h3>
        <div onClick={() => onSound(currentPage.text)} className="w-full max-w-lg aspect-square bg-blue-50 rounded-[3rem] border-8 border-white shadow-2xl flex items-center justify-center mb-10 overflow-hidden cursor-pointer group relative">
          {loading ? <Loader2 className="w-16 h-16 animate-spin text-blue-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 group-hover:scale-105 transition-transform" />}
          <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors flex items-center justify-center"><IconRenderer iconName="fa-volume-high" className="text-white text-6xl opacity-0 group-hover:opacity-100 drop-shadow-lg" /></div>
        </div>
        <div className="bg-blue-50 p-8 rounded-3xl border-4 border-dashed border-blue-200 text-center w-full max-w-xl mb-10"><p className="text-2xl text-slate-800 leading-relaxed italic">"{currentPage.text}"</p></div>
        <div className="flex gap-4">
          <button disabled={page === 0} onClick={() => setPage(page - 1)} className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center disabled:opacity-30"><IconRenderer iconName="fa-arrow-left"/></button>
          <button onClick={() => { if(page < currentBook.pages.length - 1) setPage(page + 1); else setPage(0); }} className="px-12 py-4 bg-blue-500 text-white font-black rounded-3xl shadow-xl uppercase tracking-widest">{page === currentBook.pages.length - 1 ? 'Read Again' : 'Next Page'}</button>
          <button disabled={page === currentBook.pages.length - 1} onClick={() => setPage(page + 1)} className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center disabled:opacity-30"><IconRenderer iconName="fa-arrow-right"/></button>
        </div>
      </div>
      {isDrawerOpen && <TeacherModal title="AI Book Assistant" topicLabel="Handling Tip" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};


export default PhonicsZone;

```
- src/components/ui/date-picker-with-range.tsx:
```tsx

"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
    date?: DateRange;
    onDateChange: (date?: DateRange) => void;
}

export function DatePickerWithRange({ className, date, onDateChange }: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
```
- src/hooks/use-current-school.ts:
```tsx

'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase'; // Use useUser instead of useAuth
import { doc, getDoc } from 'firebase/firestore';

export function useCurrentSchool() {
  const { user, isUserLoading } = useUser(); // Get user and its loading state
  const firestore = useFirestore();
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchool() {
      // Don't proceed until we have a user and firestore instance
      if (!user || !firestore) {
        // If auth is done but there's no user, we can stop loading.
        if (!isUserLoading) {
            setLoading(false);
            setSchoolId(null);
        }
        return;
      }
      
      setLoading(true);
      try {
        // Strategy: Check collections in order of likelihood
        const collectionsToTry = ['staff', 'users', 'students', 'parents'];
        for (const collectionName of collectionsToTry) {
            const docRef = doc(firestore, collectionName, user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().schoolId) {
                const fetchedId = docSnap.data().schoolId;
                setSchoolId(fetchedId);
                setLoading(false);
                return; // Found it, exit the loop and function
            }
        }

        // If loop finishes and nothing is found
        console.warn("No School ID found for this user across all collections.");
        setSchoolId(null);

      } catch (error) {
        console.error("Failed to fetch school ID", error);
        setSchoolId(null);
      } finally {
        setLoading(false);
      }
    }
    
    // Only run the fetch logic when Firebase auth is no longer loading.
    if (!isUserLoading) {
        fetchSchool();
    }

  }, [user, isUserLoading, firestore]);

  return { schoolId, loading };
}
```
- src/lib/student-utils.ts:
```ts

import type { Student } from '@/lib/types';
import { doc, collection, runTransaction, serverTimestamp } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

/**
 * Formats student name with ID for display
 * Usage: Shows "John Doe (SS-2025-0001)" everywhere
 */
export function formatStudentNameWithId(student: Student): string {
  const fullName = `${student.firstName} ${student.lastName}`;
  const studentId = student.studentId || 'ID Pending';
  return `${fullName} (${studentId})`;
}

/**
 * Formats just the student ID with proper fallback
 */
export function formatStudentId(student?: Student): string {
  if (student?.studentId && /^SS-\d{4}-\d{4}$/.test(student.studentId)) {
    return student.studentId;
  }
  return 'ID Pending';
}

/**
 * Search/filter function that includes student ID
 * Usage: Filter students by name OR student ID
 */
export function searchStudent(student: any, searchTerm: string): boolean {
  if (!searchTerm) return true;
  
  const term = searchTerm.toLowerCase().trim();
  const firstName = (student.firstName || '').toLowerCase();
  const lastName = (student.lastName || '').toLowerCase();
  const email = (student.email || '').toLowerCase();
  const studentId = (student.studentId || '').toLowerCase();
  
  return (
    firstName.includes(term) ||
    lastName.includes(term) ||
    email.includes(term) ||
    studentId.includes(term)
  );
}

/**
 * Compact display for badges/small spaces
 */
export function formatStudentBadge(student: Student): string {
  return `${student.firstName} ${student.lastName.charAt(0)}. - ${formatStudentId(student)}`;
}


/**
 * Atomically increments and returns the next student ID.
 * @param firestore - The Firestore instance.
 * @returns A formatted student ID string (e.g., "SS-2024-0001").
 */
export async function generateNextStudentId(firestore: Firestore): Promise<string> {
  const counterRef = doc(firestore, 'counters', 'students');
  
  const newIdNumber = await runTransaction(firestore, async (transaction) => {
    const counterDoc = await transaction.get(counterRef);
    if (!counterDoc.exists()) {
      // Initialize counter if it doesn't exist
      transaction.set(counterRef, { 
        currentId: 1,
        lastUpdated: serverTimestamp()
      });
      return 1;
    }
    
    const newId = (counterDoc.data().currentId || 0) + 1;
    transaction.update(counterRef, { 
      currentId: newId,
      lastUpdated: serverTimestamp()
    });
    
    return newId;
  });
  
  const year = new Date().getFullYear();
  const paddedNumber = String(newIdNumber).padStart(4, '0');
  
  return `SS-${year}-${paddedNumber}`;
}

```
- src/lib/types.ts:
```ts


import type { LucideIcon } from 'lucide-react';
import { z } from 'zod';

export type UserRole =
  | 'Director'
  | 'Administrator'
  | 'Teacher'
  | 'Accountant'
  | 'Student'
  | 'Parent'
  | 'Librarian'
  | 'Cook'
  | 'Transport Staff';

export const ALL_ROLES: UserRole[] = [
  'Director',
  'Administrator',
  'Teacher',
  'Accountant',
  'Student',
  'Parent',
  'Librarian',
  'Cook',
  'Transport Staff',
];

export const STAFF_ROLES: UserRole[] = ALL_ROLES.filter(
  (role) => role !== 'Student' && role !== 'Parent'
);

export type NavItem = {
  path: string;
  title: string;
  icon: LucideIcon;
  roles: UserRole[] | 'all';
  subItems?: NavItem[];
};

export interface CrosswordPuzzle {
  id: string;
  title: string;
  topic: string;
  grid: string[][];
  clues: {
    across: { number: number; clue: string; answer: string; row: number; col: number; }[];
    down: { number: number; clue: string; answer: string; row: number; col: number; }[];
  };
}

export const assignmentSchema = z.object({
    classId: z.string().min(1, 'Class is required.'),
    title: z.string().min(1, 'Title is required.'),
    description: z.string().min(1, 'Description is required.'),
    dueDate: z.date(),
    gradingType: z.enum(['points', 'letter', 'pass_fail', 'standards']),
    attachments: z.string().optional(),
});

export type Assignment = z.infer<typeof assignmentSchema> & {
    id: string;
    teacherId: string;
    createdAt: any;
};

export const studentSubmissionSchema = z.object({
    content: z.string().min(1, 'Content is required.'),
});

export type StudentSubmission = {
    id: string;
    assignmentId: string;
    studentId: string;
    studentName: string;
    submissionType: 'file' | 'text';
    content: string;
    submittedAt: any;
    status: 'Submitted' | 'Late' | 'Graded';
    grade?: string;
    teacherFeedback?: string;
};

export const gradeSubmissionSchema = z.object({
    grade: z.string().min(1, 'Grade is required.'),
    teacherFeedback: z.string().optional(),
});

export const quizSchema = z.object({
    topic: z.string().min(3, "Topic must be at least 3 characters long."),
    numQuestions: z.coerce.number().min(1).max(10),
    classId: z.string().min(1, "Please select a class."),
});

export type QuizQuestion = {
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
}

export type Quiz = {
    id: string;
    classId: string;
    teacherId: string;
    title: string;
    topic: string;
    questions: QuizQuestion[];
    createdAt: any;
    forGradeLevel?: string;
}

export type QuizAttempt = {
    id: string;
    quizId: string;
    studentId: string;
    score: number;
    total: number;
    completedAt: any;
}


// Assessment & Gradebook Schemas
export const assessmentFeedbackSchema = z.object({
  academicYear: z.string().min(1, "Academic year is required."),
  term: z.string().min(1, "Term is required."),
  classId: z.string().min(1, "Class is required."),
  studentId: z.string().min(1, "Student is required."),
  subjectId: z.string().min(1, "Subject is required."),
  assessmentName: z.string().min(1, "Assessment name is required."),
  assessmentType: z.enum(['Quiz', 'Assignment', 'Activity', 'Exam']),
  assessmentDate: z.date(),
  score: z.coerce.number().optional(),
  maxScore: z.coerce.number().optional(),
  teacherId: z.string().optional(),
}).refine(data => !data.score || !data.maxScore || data.score <= data.maxScore, {
  message: "Score cannot exceed max score",
  path: ["score"],
});


export type Assessment = z.infer<typeof assessmentFeedbackSchema> & {
    id: string;
    createdAt: any;
};

export const behavioralRecordSchema = z.object({
    studentId: z.string().min(1, "Student is required."),
    studentName: z.string().optional(),
    incidentType: z.enum(['Infraction', 'Positive Behavior', 'Counseling Note', 'Disciplinary Action', 'Teacher Note']),
    date: z.date(),
    description: z.string().min(1, "Description is required."),
    actionTaken: z.string().optional(),
    recordedById: z.string(),
});

export type BehavioralRecord = z.infer<typeof behavioralRecordSchema> & {
    id: string;
    createdAt: any;
};

export const reportCardCommentSchema = z.object({
    comment: z.string().min(1, "Comment cannot be empty."),
    subjectId: z.string().min(1, "Subject is required."),
});

export type ReportCardComment = {
    id: string;
    studentId: string;
    subjectId: string;
    comment: string;
    teacherId: string;
    term: string;
    academicYear: string;
    createdAt: any;
    updatedAt: any;
}

export type ReportCardStatus = 'Draft' | 'AwaitingFinalApproval' | 'Published';

export type SubjectGradeSummary = {
    subjectId: string;
    subjectName: string;
    assessments: Assessment[];
    finalGrade: string;
    percentage: number;
    teacherComment: string;
};

export type ReportCard = {
    id: string; 
    studentId: string;
    classId: string;
    academicYear: string;
    term: string;
    status: ReportCardStatus;
    generalComment?: string;
    publishedAt?: any;
    finalGrade?: string;
    finalPercentage?: number;
    classPosition?: string; // e.g. "1st", "2nd"
    subjectSummaries?: SubjectGradeSummary[]; // New structured field
}

// Timetable Schemas
export type Subject = { id: string; name: string; teacherIds: string[], schoolId?: string; };
export type Room = { id: string; name: string; capacity: number };
export type TimeSlot = { id: string; day: string; startTime: string; endTime: string };
export type TimetableEntry = {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId: string;
  day: string;
  timeSlotId: string;
};

// Resource Schemas
export const resourceSchema = z.object({
    title: z.string().min(1, 'Title is required.'),
    courseName: z.string().min(1, 'Course is required.'),
    resourceType: z.enum(['Document', 'Video', 'Presentation', 'Link']),
    url: z.string().url('Must be a valid URL.'),
});

export type Resource = z.infer<typeof resourceSchema> & {
    id: string;
};

// Lesson Planning Schemas
export const lessonPlanSchema = z.object({
  classId: z.string().min(1, "Please select a class"),
  date: z.date({
    required_error: "Please select a date",
  }),
  topic: z.string().min(1, "Topic is required"),
  objectives: z.string().min(1, "Objectives are required"),
  activities: z.string().min(1, "Activities are required"),
  materials: z.string().min(1, "Materials are required"),
  notes: z.string().optional(),
});

export type LessonPlan = z.infer<typeof lessonPlanSchema> & {
    id: string;
    teacherId: string;
    createdAt: any;
};

// Library Schemas
export const libraryItemSchema = z.object({
    name: z.string().min(1, "Item name is required."),
    category: z.enum(['Book', 'Magazine', 'DVD', 'Other']),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
    location: z.string().min(1, "Location is required."),
    author: z.string().optional(),
    isbn: z.string().optional(),
    publisher: z.string().optional(),
    unitPrice: z.coerce.number().optional(),
    purchaseDate: z.date().optional(),
});

export type LibraryItem = z.infer<typeof libraryItemSchema> & {
    id: string;
    status: 'Available' | 'Requested' | 'Borrowed' | 'Pending Return';
    currentHolderId?: string;
    currentHolderName?: string;
    dueDate?: any;
    createdAt: any;
};

// Admission Schemas
const parentGuardianSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    relationship: z.string().min(1, 'Relationship is required.'),
    phone: z.string().min(1, 'Phone number is required.'),
    email: z.string().email('Invalid email address.'),
    addressSameAsStudent: z.boolean().default(false),
    address: z.string().optional(),
});
  
export const studentRegistrationSchema = z.object({
    // Student Information
    student: z.object({
        fullName: z.string().min(1, 'Full name is required.'),
        dateOfBirth: z.date({ required_error: 'Date of birth is required.' }),
        gender: z.string().min(1, 'Gender is required.'),
        phone: z.string().optional(),
        email: z.string().email('Invalid email address.').optional(),
        address: z.string().min(1, 'Address is required.'),
        previousSchool: z.string().optional(),
        desiredGrade: z.string().min(1, 'Desired grade is required.'),
    }),
    
    // Parent/Guardian Information
    parent1: parentGuardianSchema,
    addParent2: z.boolean().default(false),
    parent2: parentGuardianSchema.optional(),

    // Emergency Contact
    emergencyContact: z.object({
        name: z.string().min(1, 'Emergency contact name is required.'),
        relationship: z.string().min(1, 'Relationship is required.'),
        phone: z.string().min(1, 'Phone number is required.'),
    }),

    // Medical Information
    addMedicalInfo: z.boolean().default(false),
    medical: z.object({
        allergies: z.string().optional(),
        conditions: z.string().optional(),
        physicianName: z.string().optional(),
        physicianPhone: z.string().optional(),
    }).optional(),

}).superRefine((data, ctx) => {
    // Conditional validation for Parent 1's address
    if (!data.parent1.addressSameAsStudent && !data.parent1.address) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Address is required.',
            path: ['parent1', 'address'],
        });
    }
    // Conditional validation for Parent 2
    if (data.addParent2 && data.parent2) {
        if (!data.parent2.addressSameAsStudent && !data.parent2.address) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Address is required.',
                path: ['parent2', 'address'],
            });
        }
    }
    // Conditional validation for medical info
    if (data.addMedicalInfo && data.medical) {
        if (!data.medical.allergies && !data.medical.conditions && !data.medical.physicianName) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please provide at least one piece of medical information.',
                path: ['medical', 'allergies'],
            });
        }
    }
});
  
export type StudentRegistrationData = z.infer<typeof studentRegistrationSchema>;

export type AdmissionApplication = StudentRegistrationData & {
    id: string;
    applicationId: string; // A user-friendly, unique ID
    status: 'Pending Review' | 'Admitted' | 'Rejected';
    submittedByParentId: string;
    submittedAt: any;
    rejectionReason?: string;
    challengeNotes?: string;
    assessmentTestScore?: number;
    assessmentInterviewNotes?: string;
    adminFeedback?: string;
};

// Alumni Schemas
export const graduateStudentSchema = z.object({
    studentId: z.string().min(1, "You must select a student."),
    graduationYear: z.coerce.number().min(new Date().getFullYear() - 10).max(new Date().getFullYear() + 1),
});

export const editAlumniSchema = z.object({
    currentOccupation: z.string().optional(),
    employer: z.string().optional(),
    mentorshipWillingness: z.boolean().default(false),
});

export type AlumniDetails = z.infer<typeof editAlumniSchema>;

// This extends the existing Student type for alumni management
export type Student = {
    id: string;
    uid: string;
    studentId?: string; // The official SS-YYYY-XXXX ID
    firstName: string;
    lastName: string;
    email: string;
    classId: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    enrollmentStatus?: 'Active' | 'Graduated';
    graduationYear?: number;
    alumniDetails?: AlumniDetails;
    transportStopId?: string;
    usesBusService?: boolean;
    usesCanteen?: boolean;
};

export type Class = {
    id: string;
    name: string;
    description?: string;
    teacherId?: string;
    studentIds?: string[];
    capacity?: number;
};


// Leave Management Schemas
export const LEAVE_TYPES = ['Sick Leave', 'Vacation', 'Personal', 'Study Leave', 'Unpaid Leave'] as const;
export type LeaveType = typeof LEAVE_TYPES[number];
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export const leaveApplicationSchema = z.object({
  leaveType: z.enum(LEAVE_TYPES),
  startDate: z.date({ required_error: 'Start date is required.' }),
  endDate: z.date({ required_error: 'End date is required.' }),
  reason: z.string().min(10, 'Please provide a brief reason for your leave.'),
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date cannot be before the start date.',
  path: ['endDate'],
});

export type LeaveRequest = {
  id: string;
  staffId: string;
  staffName: string;
  leaveType: LeaveType;
  startDate: any;
  endDate: any;
  reason: string;
  status: LeaveStatus;
  approverId?: string;
  approverName?: string;
  approverNotes?: string;
  createdAt: any;
};

export const managerApprovalSchema = z.object({
    notes: z.string().optional(),
});

export const managerRejectionSchema = z.object({
    notes: z.string().min(1, "A reason for rejection is required."),
});


export type PublicHoliday = {
    id: string;
    name: string;
    date: any;
};

// Performance Review Schemas
export const performanceReviewSchema = z.object({
  staffId: z.string().min(1, 'You must select a staff member.'),
  reviewDate: z.date({ required_error: 'Review date is required.' }),
  rating: z.number().min(1, 'Rating is required.').max(5),
  strengths: z.string().min(1, 'Strengths section cannot be empty.'),
  improvementAreas: z.string().min(1, 'Areas for Improvement cannot be empty.'),
  goals: z.string().min(1, 'Goals for next period cannot be empty.'),
  staffComments: z.string().optional(),
});

export type PerformanceReview = z.infer<typeof performanceReviewSchema> & {
  id: string;
  reviewerId: string;
  reviewerName: string;
  createdAt: any;
};


// Financial Schemas
export const financialRecordSchema = z.object({
  studentId: z.string().min(1, "A student must be selected."),
  type: z.enum(['Tuition Fee', 'Library Fine', 'Lab Fee', 'Sports Fee', 'Canteen Fee', 'Transport Fee', 'Other', 'Correction / Reversal']),
  description: z.string().min(1, "Description is required."),
  billedAmount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  dueDate: z.date({ required_error: "Due date is required." }),
  academicYear: z.string().optional(),
  term: z.string().optional(),
});

export const bulkBillingSchema = z.object({
  classId: z.string().min(1, "A class must be selected."),
  type: z.enum(['Tuition Fee', 'Lab Fee', 'Sports Fee', 'Canteen Fee', 'Transport Fee', 'Other']),
  description: z.string().min(1, "Description is required."),
  billedAmount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  dueDate: z.date({ required_error: "Due date is required." }),
});

export const recordPaymentSchema = z.object({
    amount: z.coerce.number().min(0.01, "Payment amount must be positive."),
    method: z.enum(['Cash', 'Card', 'Bank Transfer', 'Mobile Money', 'Other']),
    notes: z.string().optional(),
});

export const applyWaiverSchema = z.object({
    amount: z.coerce.number().min(0.01, "Waiver amount must be positive."),
    reason: z.string().min(1, "A reason for the waiver is required."),
});

export type FinancialRecord = {
    id: string;
    studentId: string;
    studentName: string;
    classId: string;
    type: 'Tuition Fee' | 'Library Fine' | 'Lab Fee' | 'Sports Fee' | 'Canteen Fee' | 'Transport Fee' | 'Other' | 'Correction / Reversal';
    description: string;
    billedAmount: number;
    amountPaid: number;
    waiverAmount?: number;
    waiverReason?: string;
    status: 'Paid' | 'Unpaid' | 'Overdue' | 'Pending Reversal' | 'Rejected Reversal';
    dueDate: any;
    createdAt: any;
    academicYear?: string;
    term?: string;
};

export type Staff = {
    uid: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    email: string;
};

// Payroll Schemas
export const payrollSettingsFormSchema = z.object({
    ssnitEmployeeContributionRate: z.coerce.number().min(0).max(1),
    ssnitEmployerContributionRate: z.coerce.number().min(0).max(1),
    payeeBrackets: z.array(z.object({
        from: z.coerce.number().min(0),
        to: z.coerce.number().min(0).nullable(),
        rate: z.coerce.number().min(0).max(1)
    }))
});

export interface TaxBracket {
  limit: number; 
  rate: number;  
}

export interface PayrollConfig {
  ssnitEmployeeRate: number;
  ssnitEmployerRate: number;
  tier3Rate: number;
  taxBrackets: TaxBracket[];
}

export interface StaffSalaryDetails {
  uid: string;
  name: string;
  role: string;
  basicSalary: number;
  allowances: { name: string; amount: number; isTaxable: boolean }[];
  tier3Contribution: number;
  bankName: string;
  accountNumber: string;
  tin: string;
  ssnitNumber: string;
}

export interface Payslip {
  id: string;
  month: string;
  staffId: string;
  staffName: string;
  basicSalary: number;
  totalAllowances: number;
  grossSalary: number;
  ssnitDeduction: number;
  tier3Deduction: number;
  taxableIncome: number;
  payeTax: number;
  netSalary: number;
  employerSSNIT: number;
  totalCostToCompany: number;
  status: 'Draft' | 'Paid';
  date: any;
}


export type PayrollSettings = z.infer<typeof payrollSettingsFormSchema> & { id: string };

const allowanceSchema = z.object({ name: z.string().min(1), amount: z.coerce.number().min(0) });
const deductionSchema = z.object({ name: z.string().min(1), amount: z.coerce.number().min(0) });

export const staffPayrollConfigSchema = z.object({
    basicSalary: z.coerce.number().min(0),
    allowances: z.array(allowanceSchema).optional(),
    deductions: z.array(deductionSchema).optional(),
    ssnitNumber: z.string().min(1),
    tinNumber: z.string().min(1),
    bankName: z.string().min(1),
    accountNumber: z.string().min(1),
});

export type StaffPayrollConfig = z.infer<typeof staffPayrollConfigSchema> & {
    id?: string;
    staffId: string;
}

export type PayrollRecord = {
    id: string;
    staffId: string;
    staffName: string;
    period: string; // "YYYY-MM"
    grossSalary: number;
    netSalary: number;
    basicSalary: number;
    totalAllowances: number;
    totalDeductions: number;
    allowances: Array<{name: string, amount: number}>;
    deductions: Array<{name: string, amount: number}>;
    statutory: {
        ssnitEmployee: number;
        ssnitEmployer: number;
        paye: number;
    },
    createdAt: any;
}

// Accounts Payable Schemas
export const vendorSchema = z.object({
    name: z.string().min(1, 'Vendor name is required.'),
    category: z.string().min(1, 'Category is required.'),
    email: z.string().email('Invalid email address.'),
    phone: z.string().min(1, 'Phone number is required.'),
});

export type Vendor = z.infer<typeof vendorSchema> & { id: string };

export const payableSchema = z.object({
    vendorId: z.string().min(1, 'A vendor must be selected.'),
    expenseAccountId: z.string().min(1, 'An expense account must be selected.'),
    description: z.string().min(1, 'A description is required.'),
    invoiceNumber: z.string().optional(),
    amount: z.coerce.number().min(0.01, 'Amount must be greater than zero.'),
    dueDate: z.date({ required_error: 'A due date is required.'}),
});

export type AccountsPayableRecord = z.infer<typeof payableSchema> & {
    id: string;
    status: 'Unpaid' | 'Paid';
    createdAt: any;
    paidAt?: any;
    paymentAccountId?: string;
};

// General Ledger Schemas
export const ACCOUNT_TYPES = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'] as const;
export type AccountType = typeof ACCOUNT_TYPES[number];

export const accountSchema = z.object({
    name: z.string().min(1, 'Account name is required.'),
    type: z.enum(ACCOUNT_TYPES),
    parentAccountId: z.string().optional(),
    description: z.string().optional(),
});

export type ChartOfAccount = {
    accountId: string;
    name: string;
    type: AccountType;
    isControlAccount: boolean;
    parentAccountId?: string;
    description?: string;
};

export type JournalEntryItem = {
    accountId: string;
    amount: number;
};

export type GeneralLedgerTransaction = {
    id: number;
    ref: string;
    date: string;
    description: string;
    debits: JournalEntryItem[];
    credits: JournalEntryItem[];
};

export const journalEntrySchema = z.object({
    description: z.string().min(1, 'Description is required.'),
    amount: z.coerce.number().positive('Amount must be positive.'),
    debitAccountId: z.string().min(1, 'Debit account is required.'),
    creditAccountId: z.string().min(1, 'Credit account is required.'),
}).refine(data => data.debitAccountId !== data.creditAccountId, {
    message: 'Debit and Credit accounts cannot be the same.',
    path: ['creditAccountId'],
});
    
// Inventory Schemas
export const inventoryItemSchema = z.object({
    name: z.string().min(1, "Item name is required."),
    category: z.enum(['Uniform', 'Book', 'Stationery', 'Other']),
    quantity: z.coerce.number().int().min(0),
    location: z.string().min(1, "Location is required."),
    supplier: z.string().optional(),
    purchaseDate: z.date().optional(),
    unitPrice: z.coerce.number().min(0).optional(),
    condition: z.enum(['New', 'Good', 'Fair', 'Poor', 'For Repair']),
});

export type InventoryItem = z.infer<typeof inventoryItemSchema> & {
    id: string;
    status: 'Available' | 'In Use' | 'Under Maintenance' | 'Out of Stock';
    currentHolderId?: string;
    currentHolderName?: string;
    lastCheckedOut?: any;
};

export const checkoutSchema = z.object({
  staffId: z.string().min(1, "You must select a staff member."),
});

export type InventoryTransaction = {
    id: string;
    itemId: string;
    transactionType: 'Creation' | 'Check-Out' | 'Check-In' | 'Sale' | 'Adjustment' | 'Audit';
    timestamp: any;
    staffId?: string; // Who performed the action
    quantityChange?: number;
    notes?: string;
};

// Transport Schemas
export type Bus = {
    id: string;
    name: string;
    capacity: number;
    assignedDriverId?: string;
};
  
export type Stop = {
    id: string;
    name: string;
    address: string;
    order: number;
    assignedStudentIds: string[];
};
  
export type Route = {
    id: string;
    name: string;
    busId: string;
    driverId: string;
    stops: Stop[];
};

export const studentAssignmentSchema = z.object({
    studentId: z.string().min(1, "You must select a student."),
    stopId: z.string().min(1, "You must select a stop."),
});

// Attendance Schemas
export const attendanceRecordSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  studentName: z.string().optional(), // For display only, not stored
  classId: z.string(),
  date: z.date(),
  status: z.enum(['Present', 'Absent', 'Late', 'Excused']),
  notes: z.string().optional(),
  usesBusService: z.boolean().optional(),
});

export type AttendanceRecord = z.infer<typeof attendanceRecordSchema> & {
    id: string;
};


// Audit Log Schema
export const auditLogSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  action: z.string(), // e.g., 'CREATE_STUDENT', 'UPDATE_GRADE'
  details: z.string(), // e.g., 'Created student John Doe'
  targetId: z.string().optional(), // ID of the entity that was affected
  timestamp: z.date(),
});

export type AuditLog = z.infer<typeof auditLogSchema> & {
  id: string;
};

// Maths Club Schemas
export const mathProblemSchema = z.object({
    topic: z.string().min(1, "Topic is required."),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    question_text: z.string().min(1, "Question text is required."),
    correct_answer: z.string().min(1, "Correct answer is required."),
    options: z.array(z.string().min(1, "Option cannot be empty.")).length(4, "You must provide 4 options."),
    metadata: z.object({
        source: z.string().optional(),
        gradeLevel: z.string().optional(),
    }).optional(),
    classId: z.string().min(1, "Please select a class."),
});

export type MathProblem = z.infer<typeof mathProblemSchema> & {
    id: string;
    explanation?: string;
};

export type UserResult = {
    id: string;
    userId: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    score: number;
    time_taken_seconds: number;
    date_completed: any;
    correct_count: number;
};

export type GlobalLeaderboardEntry = {
    userId: string;
    userName: string;
    profilePictureUrl?: string;
    total_correct_answers: number;
    total_quizzes_completed: number;
};

// Science Club Schemas
export const scienceProblemSchema = z.object({
    topic: z.string().min(1, "Topic is required."),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    question_text: z.string().min(1, "Question text is required."),
    correct_answer: z.string().min(1, "Correct answer is required."),
    options: z.array(z.string().min(1, "Option cannot be empty.")).length(4, "You must provide 4 options."),
    metadata: z.object({
        source: z.string().optional(),
        gradeLevel: z.string().optional(),
    }).optional(),
    classId: z.string().min(1, "Please select a class."),
});

export type ScienceProblem = z.infer<typeof scienceProblemSchema> & {
    id: string;
    explanation?: string;
};

export type ScienceResult = {
    id: string;
    userId: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    score: number;
    time_taken_seconds: number;
    date_completed: any;
    correct_count: number;
};

export type ScienceLeaderboardEntry = {
    id?: string;
    userId: string;
    userName: string;
    profilePictureUrl?: string;
    total_correct_answers: number;
    points?: number;
    quizzesPlayed?: number;
};

export type DailyFact = {
    id: string;
    factText: string;
    text?: string;
    createdAt: any;
    postedBy: string;
};

// ELA Club Schemas
export const elaGrammarDrillSchema = z.object({
    topic: z.string().min(1, "Topic is required."),
    type: z.enum(["MCQ", "Drag and Drop"]),
    question_prompt: z.string().min(1, "Question prompt is required."),
    options: z.array(z.string()).optional(),
    correct_answer: z.union([z.string(), z.array(z.string())]).refine(val => (Array.isArray(val) ? val.length > 0 : String(val).length > 0), { message: "Correct answer cannot be empty." }),
    classId: z.string().min(1, "Please select a class."),
});

export type ElaGrammarDrill = z.infer<typeof elaGrammarDrillSchema> & {
    id: string;
    explanation?: string;
};

const elaQuestionSchema = z.object({
    question: z.string().min(1, "Question cannot be empty"),
    type: z.enum(["MCQ", "Short Answer"]),
    options: z.array(z.string()).optional(),
    correct_answer_key: z.string().min(1, "Correct answer is required"),
    explanation: z.string().optional(),
});

export const elaReadingPassageSchema = z.object({
    title: z.string().min(1, "Title is required."),
    passage_text: z.string().min(1, "Passage text is required."),
    reading_level: z.string().min(1, "Reading level is required."),
    classId: z.string().min(1, "Please select a class."),
    question_set: z.array(elaQuestionSchema).min(1, "At least one question is required."),
});


export type ElaReadingPassage = z.infer<typeof elaReadingPassageSchema> & {
    id: string;
};

export const elaWritingChallengeSchema = z.object({
    title: z.string().min(1, "Title is required."),
    prompt: z.string().min(10, "Prompt must be at least 10 characters."),
    challengeType: z.enum(['Creative Writing', 'Summarization', 'Essay']),
    classId: z.string().min(1, "Please select a class for this challenge."),
});

export type ElaWritingChallenge = z.infer<typeof elaWritingChallengeSchema> & {
    id: string;
    createdBy: string;
    createdAt: any;
};

export type ElaUserSubmission = {
    id: string;
    userId: string;
    challenge_id: string;
    challenge_title: string;
    submission_text: string;
    date_submitted: any;
    status: 'Submitted' | 'Graded';
    teacher_score?: number | null;
    teacher_feedback?: string | null;
};

export type ElaLeaderboardEntry = {
    userId: string;
    userName: string;
    profilePictureUrl?: string;
    total_correct_answers: number;
    total_challenges_completed: number;
};


// --- RICH LEARNING MATERIAL ---

// Attachment for a Topic
export interface Attachment {
    name: string;
    url: string;
    type: 'PDF' | 'DOC' | 'IMAGE';
}

// Video Link for a Topic
export interface VideoLink {
    title: string;
    url: string;
}

// Question for a Topic
export interface RichQuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

// The Main "Topic" Container
export interface LearningMaterial {
    id: string;
    courseId: string; // e.g. "bs7-integrated-science"
    strand: string;
    subStrand: string;
    topicTitle: string;
    content: string; // This is for rich text / html content
    attachments: Attachment[];
    videoLinks: VideoLink[];
    practiceQuestions: RichQuizQuestion[];
    createdAt: any;
    updatedAt?: any;
}

// --- CASH TILL MANAGEMENT ---
export type TillStatus = 'Open' | 'PendingApproval' | 'Closed';
export type TillTransactionType = 'Payment' | 'Adjustment';
export type TillTransactionStatus = 'Completed' | 'Pending Adjustment' | 'Rejected';

export type Till = {
    id: string;
    accountantId: string;
    accountantName: string;
    openingBalance: number;
    closingBalance: number | null;
    dateOpened: any;
    dateClosed: any | null;
    status: TillStatus;
    directorApproval: {
        directorId: string | null;
        directorName: string | null;
        approvedAt: any | null;
        rejectionReason?: string;
    };
};

export type TillTransaction = {
    id: string;
    tillId: string;
    financialRecordId?: string; 
    studentId?: string; 
    studentName?: string; 
    amount: number;
    timestamp: any;
    description: string; 
    type: TillTransactionType;
    status: TillTransactionStatus;
    schoolId?: string;
};


// --- BANK TRANSACTION APPROVAL ---
export const bankTransactionSchema = z.object({
  amount: z.number(),
  paymentMethod: z.enum(['Card', 'Bank Transfer', 'Mobile Money', 'Other']),
  notes: z.string().optional(),
  studentId: z.string(),
  studentName: z.string(),
  financialRecordId: z.string(),
  recordedById: z.string(),
  recordedByName: z.string(),
  status: z.enum(['Pending', 'Approved', 'Rejected']),
  schoolId: z.string(),
  approverId: z.string().optional(),
  approverName: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export type BankTransaction = z.infer<typeof bankTransactionSchema> & {
    id: string;
    recordedAt: any;
    approvedAt?: any;
};


// --- THINK TANK MODULE ---
export interface Paradox {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: any;
  targetGroup: string;
}

export interface DebateTopic {
  id: string;
  topic: string;
  context: string; // Background info
  createdAt: any;
  targetGroup: string;
}

export interface DebateMessage {
  role: 'user' | 'ai';
  content: string;
}

// --- FORUM ---
export interface ForumThread {
    id: string;
    title: string;
    content: string;
    createdBy: {
        uid: string;
        name: string;
    };
    createdAt: any;
    aiModeratorEnabled: boolean;
    lastReplyAt?: any;
    replyCount?: number;
}

export interface ForumReply {
    id: string;
    threadId: string;
    author: {
        uid: string;
        name: string;
    };
    content: string;
    createdAt: any;
    isAIMessage?: boolean; // True if the reply is from the AI moderator
}

// --- ELA Explorer ---
export type ElaLesson = {
    id?: string;
    userId: string;
    timestamp: any;
    title: string;
    explanation: string;
    example: string;
    keyTerms: string[];
    quizQuestion: string;
    quizAnswer: string;
}
    
// --- Science Explorer ---
export type ScienceLesson = {
    id?: string;
    userId: string;
    timestamp: any;
    title: string;
    explanation: string;
    analogy: string;
    keyTerms: string[];
    quizQuestion: string;
    quizAnswer: string;
}

// --- Direct Messages ---
export interface ChatMetadata {
    id: string;
    participants: string[];
    participantDetails: Record<string, { name: string; role: string }>;
    lastMessage: string;
    lastMessageTime: any;
    unreadCount: Record<string, number>;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: any;
}

export interface Lecture {
  id: string;
  title: string;
  description?: string;
  classId?: string; // Changed from targetGroup
  scheduledFor?: any;
  teacherName: string;
  teacherId: string;
  status: 'scheduled' | 'live' | 'ended';
  createdAt: any;
  slides?: string[];
  currentSlide?: number;
  isPresentationMode?: boolean;
  breakoutActive?: boolean;
  breakoutDuration?: number;
  breakoutEndTime?: any;
}

// --- ACCOUNTING TYPES ---

export interface Account {
  id: string;
  code: string; // e.g., "1001"
  name: string; // e.g., "Cash on Hand"
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number; // Current running balance
  parentId?: string | null;
}

export interface JournalLine {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: any; // Timestamp
  reference?: string; // e.g., "INV-001" or "PV-502"
  description: string;
  lines: JournalLine[];
  totalAmount: number;
  createdBy: string;
  createdAt: any;
}

export interface PaymentVoucher {
  id: string;
  payee: string;
  description: string;
  grossAmount: number;
  whtAmount: number;
  netAmount: number;
  paymentMethod: string;
  referenceNumber?: string;
  expenseAccountId: string;
  paymentAccountId: string;
  whtLiabilityAccountId?: string;
  status: 'Paid' | 'Cancelled';
  date: any;
  createdBy: string;
  linkedBillId?: string;
}

// --- PROCUREMENT & AP ---
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  balance: number; // Amount we owe them
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  date: any;
  status: 'Draft' | 'Sent' | 'Received' | 'Cancelled';
  items: { 
    itemId: string; // From Inventory/Shop items
    name: string; 
    quantity: number; 
    unitCost: number; 
    total: number;
  }[];
  totalAmount: number;
  expectedDate?: any;
}

export interface VendorBill {
  id: string;
  supplierId: string;
  supplierName: string;
  poId: string; // Link to PO
  date: any;
  dueDate: any;
  totalAmount: number;
  amountPaid: number;
  status: 'Unpaid' | 'Partial' | 'Paid';
  items: any[];
}


// --- PAYROLL ---
export interface TaxBracket {
  limit: number; 
  rate: number;  
}

export interface PayrollConfig {
  ssnitEmployeeRate: number;
  ssnitEmployerRate: number;
  tier3Rate: number;
  taxBrackets: TaxBracket[];
}

export interface StaffSalaryDetails {
  uid: string;
  name: string;
  role: string;
  basicSalary: number;
  allowances: { name: string; amount: number; isTaxable: boolean }[];
  tier3Contribution: number;
  bankName: string;
  accountNumber: string;
  tin: string;
  ssnitNumber: string;
}

export interface Payslip {
  id: string;
  month: string;
  staffId: string;
  staffName: string;
  basicSalary: number;
  totalAllowances: number;
  grossSalary: number;
  ssnitDeduction: number;
  tier3Deduction: number;
  taxableIncome: number;
  payeTax: number;
  netSalary: number;
  employerSSNIT: number;
  totalCostToCompany: number;
  status: 'Draft' | 'Paid';
  date: any;
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  attendanceRate: number; // 0-100
  averageGrade: number;   // 0-100
  missedAssessments: number;
  participationScore: number; // Calculated based on behavior records or consistency
}

export interface AiInsight {
  atRiskStudents: {
    studentName: string;
    reason: string; // e.g. "High grades but dropping attendance"
    intervention: string; // e.g. "Schedule parent meeting"
  }[];
  classTrends: string; // General observation
  teachingStrategy: string; // Advice for the teacher
}

export type ModuleType =
  | 'SINGING_DICTIONARY' | 'PHONICS' | 'READING_WRITING'
  | 'NUMERACY' | 'LIFE_SKILLS' | 'SCIENCE'
  | 'CREATIVE_ARTS' | 'TUTOR';

export interface DictionaryWord {
  word: string;
  category: string;
  imagePrompt: string;
}

// Junior Academy Types
export interface JuniorStory {
    id: string;
    title: string;
    emojiIcon: string;
    content: string;
    questions: { question: string, answer: string }[];
    topic: string;
    wordCount: number;
    createdAt: any;
}

export interface JuniorScience {
    id: string;
    title: string;
    emojiIcon: string;
    fact: string;
    observation: string;
    experiment: string;
    topic: string;
    createdAt: any;
}
    

```
- src/lib/utils.ts:
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```
- tailwind.config.ts:
```ts

import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;

```
- tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```