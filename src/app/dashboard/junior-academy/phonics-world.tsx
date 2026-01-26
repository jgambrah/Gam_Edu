
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
  HelpCircle, 
  Smile, 
  Type, 
  Image as ImageIcon, 
  Hand, 
  Ear, 
  Gamepad2, 
  Layers, 
  Repeat, 
  Mic, 
  Underline, 
  Signpost, 
  BookOpen,
  Loader2,
  Wand2,
  ArrowLeft,
  ArrowRight,
  Volume2,
  Play,
  Sparkles,
  CheckCircle2,
  XCircle,
  PlusCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useRole } from '@/context/role-context';
import { getAuth } from 'firebase/auth';
import { useFirestore } from '@/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
  // 1. Manually map FontAwesome keys to the static components we imported above
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'fa-face-smile-wink': Smile,
    'fa-font': Type,
    'fa-images': ImageIcon,
    'fa-hands-clapping': Hand,
    'fa-ear-listen': Ear,
    'fa-gamepad': Gamepad2,
    'fa-layer-group': Layers,
    'fa-repeat': Repeat,
    'fa-microphone-lines': Mic,
    'fa-underline': Underline,
    'fa-road-sign': Signpost,
    'fa-book-open': BookOpen,
    'fa-magic': Wand2,
    'fa-spinner': Loader2,
    'fa-arrow-left': ArrowLeft,
    'fa-arrow-right': ArrowRight,
    'fa-volume-high': Volume2,
    'fa-play': Play,
    'fa-sparkles': Sparkles,
  };

  // 2. Get the component from the map
  const IconComponent = iconMap[iconName];

  // 3. Logic for missing or valid icons
  if (!IconComponent) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ Icon mapping missing for: ${iconName}`);
    }
    return <HelpCircle className={className} />;
  }

  return (
    <IconComponent 
      className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} 
    />
  );
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
          {isLoading ? <><Loader2 className="animate-spin mr-2"/> GENERATING...</> : <><Wand2 className="mr-2 h-4 w-4"/> CREATE MAGIC</>}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

const ModuleContainerWithState: React.FC<{ title: string; children: React.ReactNode; icon: string; started: boolean; onStart: () => void; onClose: () => void }> = ({ title, children, icon, started, onStart, onClose }) => {
    if (!started) return (
        <div className="text-center p-12 bg-white rounded-3xl shadow-lg animate-in fade-in">
            <IconRenderer iconName={icon} className="h-16 w-16 mx-auto text-pink-300 mb-4" />
            <h3 className="text-2xl font-bold text-pink-600 mb-2">{title}</h3>
            <p className="text-slate-500 mb-4">Ready to start this activity?</p>
            <Button onClick={onStart} className="bg-pink-500 hover:bg-pink-600">Start Activity</Button>
        </div>
    );
    return (
        <div className="relative">
            <Button variant="ghost" onClick={onClose} className="absolute -top-12 left-0 text-slate-400 hover:text-pink-500 font-bold text-xs"><ArrowLeft className="mr-2 h-4 w-4"/> Close Activity</Button>
            {children}
        </div>
    );
};

const PhonicsZone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PhonicsTab>('jolly-phonics');
  const { schoolId } = useCurrentSchool();
  const currentSourceRef = useRef<HTMLAudioElement | null>(null);
  const [startedModules, setStartedModules] = useState<Record<PhonicsTab, boolean>>({
    'jolly-phonics': false, 'alphabet': false, 'picture-reading': false, 'syllables': false,
    'alliteration': false, 'sound-games': false, 'blends': false, 'rhymes': false,
    'diction': false, 'environmental-print': false, 'book-handling': false, 'missing-letters': false
  });

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

  const handleStartModule = (moduleId: PhonicsTab) => setStartedModules(prev => ({ ...prev, [moduleId]: true }));
  const handleCloseModule = (moduleId: PhonicsTab) => setStartedModules(prev => ({ ...prev, [moduleId]: false }));


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
    
    return (
        <ModuleContainerWithState
            title={activeTab.replace('-', ' ')}
            icon={tabIcons[activeTab]}
            started={startedModules[activeTab]}
            onStart={() => handleStartModule(activeTab)}
            onClose={() => handleCloseModule(activeTab)}
        >
        {startedModules[activeTab] && (
            <>
                {activeTab === 'jolly-phonics' && <JollyPhonicsModule {...commonProps} />}
                {activeTab === 'alphabet' && <AlphabetModule {...commonProps} />}
                {activeTab === 'picture-reading' && <PictureReadingModule {...commonProps} />}
                {activeTab === 'syllables' && <SyllablesModule {...commonProps} />}
                {activeTab === 'alliteration' && <AlliterationModule {...commonProps} />}
                {activeTab === 'sound-games' && <SoundGamesModule {...commonProps} />}
                {activeTab === 'blends' && <BlendsModule {...commonProps} />}
                {activeTab === 'rhymes' && <RhymesModule {...commonProps} />}
                {activeTab === 'diction' && <DictionModule {...commonProps} />}
                {activeTab === 'missing-letters' && <MissingLettersModule {...commonProps} />}
                {activeTab === 'environmental-print' && <EnvironmentalPrintModule {...commonProps} />}
                {activeTab === 'book-handling' && <BookHandlingModule {...commonProps} />}
            </>
        )}
        </ModuleContainerWithState>
    );
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 font-black">
      <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4">
        <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-pink-50 min-w-max font-black">
          {(Object.keys(tabIcons) as PhonicsTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`min-w-[110px] px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${
                activeTab === tab ? `${colors[tab]} text-white shadow-xl scale-110 -translate-y-1` : 'text-slate-700 hover:bg-slate-50 font-black'
              }`}
            >
              <IconRenderer iconName={tabIcons[tab]} className="text-lg" /><span className="whitespace-nowrap">{tab.replace('-', ' ')}</span>
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
  const { role } = useRole();
  const [data, setData] = useState(constants.JOLLY_PHONICS_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');

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
      {canEdit && <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-pink-200 text-pink-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-pink-50 transition-colors"><IconRenderer iconName="fa-magic"/> AI Maker</button>}
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
  const { role } = useRole();
  const { toast } = useToast();
  const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
  const sortedData = useMemo(() => [...constants.PHONICS_DATA].sort((a, b) => a.upper.localeCompare(b.upper)), []);
  const [data, setData] = useState(sortedData);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const current = data[index];

  const fetchImage = useCallback(async () => { if (!schoolId) return; setLoading(true); const url = await generateLessonImageAction({prompt: current.imagePrompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
  useEffect(() => { setImageUrl(null); fetchImage(); }, [index, fetchImage]);
  const playSound = async () => onSound(`Big ${current.upper}, little ${current.lower}. The sound is ${current.lower}... ${current.upper} is for ${current.word}.`);

  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
      const result = await generatePhonicsWorldEntry(aiTopic, 'alphabet', schoolId);
      if(result.success && result.data) {
        const newEntry = { upper: aiTopic.toUpperCase(), lower: aiTopic.toLowerCase(), word: result.data.title, imagePrompt: result.data.imagePrompt };
        setData(prev => [...prev, newEntry].sort((a,b) => a.upper.localeCompare(b.upper)));
        setIsDrawerOpen(false); setAiTopic('');
        toast({ title: 'Success', description: 'New alphabet entry created!' });
      }
    } catch (e) { console.error(e); toast({ title: 'Error', description: 'Failed to create AI entry.' }); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto relative font-black">
      {canEdit && <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-pink-200 text-pink-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-pink-50 transition-colors"><IconRenderer iconName="fa-magic" /></button>}
      <div className="p-8 md:p-12 bg-white rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center relative overflow-hidden animate-in zoom-in">
        <div className="w-full flex overflow-x-auto gap-2 pb-6 mb-8 no-scrollbar border-b-4 border-pink-50 px-4">
           {data.map((item, i) => (
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
          <button onClick={() => setIndex(prev => (prev - 1 + data.length) % data.length)} className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 shadow-md active:scale-90 transition-all"><IconRenderer iconName="fa-arrow-left" className="text-2xl" /></button>
          <button onClick={playSound} className="w-24 h-24 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xl border-4 border-white active:scale-95 transition-all"><IconRenderer iconName="fa-volume-high" className="text-4xl" /></button>
          <button onClick={() => setIndex(prev => (prev + 1) % data.length)} className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 shadow-md active:scale-90 transition-all"><IconRenderer iconName="fa-arrow-right" className="text-2xl" /></button>
        </div>
      </div>
      {isDrawerOpen && <TeacherModal title="AI Alphabet Assistant" topicLabel="Letter Idea" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const PictureReadingModule: React.FC<{onSound: (text:string) => void, schoolId: string}> = ({onSound, schoolId}) => {
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
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
      {canEdit && <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-indigo-200 text-indigo-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-indigo-50 transition-colors"><IconRenderer iconName="fa-magic"/> AI Maker</button>}
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
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
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
      {canEdit && <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-purple-200 text-purple-600 px-4 py-2 rounded-full text-[10px] shadow-sm uppercase z-10 hover:bg-purple-50 transition-colors"><IconRenderer iconName="fa-magic"/> AI Maker</button>}
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

        <div className="bg-rose-50 p-8 rounded-3xl border-4 border-white shadow-inner mb-10 text-center w-full max-w-xl">
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
  const [data, setData] = useState(constants.BOOK_HANDLING_DATA);
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const currentBook = data[index];
  const currentPage = currentBook.pages[page];

  const fetchVisual = useCallback(async () => { if (!schoolId) return; setLoading(true); const url = await generateLessonImageAction({prompt: currentPage.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [currentPage, schoolId]);
  useEffect(() => { setImageUrl(null); fetchVisual(); }, [index, page, fetchVisual]);
  
  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return; setIsAiLoading(true);
    try {
      const result = await generatePhonicsWorldEntry(aiTopic, 'book-handling', schoolId);
      if(result.success && result.data){
        setData(prev => [...prev, result.data]);
        setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
      }
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
