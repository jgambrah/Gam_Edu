
'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where, setDoc, increment, getDocs } from 'firebase/firestore';
import * as LucideIcons from 'lucide-react';

import confetti from 'canvas-confetti';
import { generateLessonImageAction, generateTTSAction, generateLifeSkillEntry } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { generateScienceLessonAction, GeneratedLesson } from '@/ai/flows/generate-science-lesson';

const SCIENCE_DATA = {
    bodyParts: [{ name: "Head", icon: 'fa-user', prompt: "A child's head with hair" }, { name: "Arms", icon: 'fa-hand', prompt: 'Cartoon arms waving' }],
    innerOrgans: [{ name: "Heart", icon: 'fa-heart-pulse', fact: 'Your heart pumps blood to your body.', prompt: 'A simple cartoon heart with a smiley face' }, { name: "Lungs", icon: 'fa-lungs', fact: 'Your lungs help you breathe air.', prompt: 'Two friendly cartoon lungs' }],
    growth: [{ stage: "Baby", icon: 'fa-child-reaching', action: "I crawl and say goo-goo!", prompt: 'A happy baby crawling' }, { stage: "Child", icon: 'fa-user', action: "I run and play with my friends!", prompt: 'A child running in a park' }],
    senses: [{ sense: "See", icon: 'fa-eye', action: 'I see with my eyes!' }, { sense: "Hear", icon: 'fa-ear-listen', action: 'I hear with my ears!' }],
    diet: [{ name: 'Apple', type: 'Fruit', icon: 'fa-apple-whole', prompt: 'A shiny red apple' }, { name: 'Carrot', type: 'Vegetable', icon: 'fa-carrot', prompt: 'A crunchy orange carrot' }],
    living: [{ name: 'Tree', icon: 'fa-tree', isLiving: true, prompt: 'a tall green tree' }, { name: 'Dog', icon: 'fa-paw', isLiving: true, prompt: 'a friendly puppy dog' }],
    nonLiving: [{ name: 'Rock', icon: 'fa-cube', isLiving: false, prompt: 'a grey stone rock' }, { name: 'Car', icon: 'fa-car', isLiving: false, prompt: 'a red toy car' }],
    weather: [{ type: 'Sunny', icon: 'fa-sun', prompt: 'A bright yellow sun smiling' }, { type: 'Rainy', icon: 'fa-cloud-showers-heavy', prompt: 'A gray cloud with rain falling' }],
    animals: [{ name: 'Lion', sound: 'Roar!', fact: 'The lion is the king of the jungle.', icon: 'fa-paw', prompt: 'A friendly cartoon lion' }, { name: 'Monkey', sound: 'Ooh-ooh-aah-aah!', fact: 'Monkeys love to eat bananas.', icon: 'fa-paw', prompt: 'A cheeky cartoon monkey' }],
    transport: [{ name: 'Car', type: 'Road', icon: 'fa-car', prompt: 'A red toy car' }, { name: 'Airplane', type: 'Air', icon: 'fa-plane', prompt: 'A white airplane in the sky' }],
    properties: {
      colors: [{ name: 'Red', explanation: 'Like a juicy apple!', icon: 'fa-circle', prompt: 'A big shiny red apple' }],
      shapes: [{ name: 'Square', explanation: 'A shape with four equal sides.', icon: 'fa-shapes', prompt: 'A blue square' }],
      sizes: [{ pair: 'Big/Small', icon: 'fa-shapes', prompt: 'A big elephant next to a small mouse' }],
      feelings: [{ name: 'Happy', explanation: 'When you feel smiley!', icon: 'fa-face-smile', prompt: 'A very happy smiling sun' }],
    },
    environment: {
      surroundings: [{ name: 'The Forest', icon: 'fa-tree', fact: 'Forests are home to many animals.', prompt: 'A dense green forest with tall trees' }],
      greenHabits: [{ name: 'Recycling', icon: 'fa-recycle', fact: 'Recycling helps keep our Earth clean.', prompt: 'A child putting a plastic bottle in a recycling bin' }],
      cleanWorld: [{ name: 'Clean Beach', icon: 'fa-water', fact: 'We should never leave trash on the beach.', prompt: 'A clean sandy beach with blue water' }],
    }
  };

const IconRenderer = ({ iconName, className }: { iconName?: string; className?: string }) => {
    const iconMap: Record<string, keyof typeof LucideIcons> = {
      'fa-earth-africa': 'Globe',
      'fa-user': 'User',
      'fa-child-reaching': 'User',
      'fa-heart-pulse': 'HeartPulse',
      'fa-lungs': 'Atom',
      'fa-arrow-up-right-dots': 'TrendingUp',
      'fa-ear-listen': 'Ear',
      'fa-eye': 'Eye',
      'fa-apple-whole': 'Apple',
      'fa-leaf': 'Leaf',
      'fa-tree': 'Sprout',
      'fa-cloud-sun': 'CloudSun',
      'fa-cloud-showers-heavy': 'CloudRain',
      'fa-paw': 'PawPrint',
      'fa-car': 'Car',
      'fa-plane': 'Plane',
      'fa-shapes': 'Shapes',
      'fa-recycle': 'Recycle',
      'fa-water': 'Droplets',
      'fa-magic': 'Wand2',
      'fa-spinner': 'Loader2',
      'fa-arrow-left': 'ArrowLeft',
      'fa-arrow-right': 'ArrowRight',
      'fa-volume-high': 'Volume2',
      'fa-sun': 'Sun',
      'fa-hand': 'Hand',
      'fa-carrot': 'Carrot',
      'fa-cube': 'Box',
    };
    if (!iconName) return <LucideIcons.HelpCircle className={cn(className)} />;
    const LucideName = iconMap[iconName] || 'HelpCircle';
    const IconComponent = (LucideIcons as any)[LucideName];
    
    if (!IconComponent || typeof IconComponent !== 'function') {
      console.error(`Icon "${LucideName}" not found for key "${iconName}"`);
      const FallbackIcon = (LucideIcons as any)['HelpCircle'];
      return <FallbackIcon className={cn(className)} />;
    }
    
    return <IconComponent className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} />;
};

type ScienceTab = 'body' | 'organs' | 'growth' | 'senses' | 'diet' | 'living' | 'weather' | 'animals' | 'transport' | 'concepts' | 'environment';

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
          {isLoading ? <><LucideIcons.Loader2 className="animate-spin mr-2"/> GENERATING...</> : <><LucideIcons.Sparkles className="mr-2 h-4 w-4"/> CREATE MAGIC</>}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

const ScienceExploration: React.FC = () => {
  const { schoolId } = useCurrentSchool();
  const [activeTab, setActiveTab] = useState<ScienceTab>('environment');
  const [playing, setPlaying] = useState(false);
  const currentSourceRef = useRef<HTMLAudioElement | null>(null);
  const [started, setStarted] = useState(false);

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

  const tabs: {id: ScienceTab, label: string, icon: string}[] = [
    { id: 'environment', label: 'EVS Hub', icon: 'fa-earth-africa' },
    { id: 'body', label: 'My Body', icon: 'fa-user' },
    { id: 'organs', label: 'Inside Me', icon: 'fa-heart-pulse' },
    { id: 'growth', label: 'Growing Up', icon: 'fa-arrow-up-right-dots' },
    { id: 'senses', label: 'My Senses', icon: 'fa-ear-listen' },
    { id: 'diet', label: 'Healthy Food', icon: 'fa-apple-whole' },
    { id: 'living', label: 'Nature Sorting', icon: 'fa-leaf' },
    { id: 'weather', label: 'Weather Window', icon: 'fa-cloud-sun' },
    { id: 'animals', label: 'Animal World', icon: 'fa-paw' },
    { id: 'transport', label: 'Travel', icon: 'fa-car' },
    { id: 'concepts', label: 'Concepts', icon: 'fa-shapes' },
  ];
    
    const renderActiveTab = () => {
        if (!schoolId) return <div className="text-center p-8"><LucideIcons.Loader2 className="animate-spin"/></div>;
        if (!started) return (
            <Card className="rounded-[60px] border-8 border-blue-100 shadow-xl overflow-hidden bg-white">
                <CardHeader className="bg-blue-500 p-10 text-white text-center">
                    <CardTitle className="text-4xl font-black uppercase tracking-tighter flex items-center justify-center gap-4">
                        <LucideIcons.Atom className="h-12 w-12" />
                        Science World
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-12 text-center">
                    <div className="flex flex-col items-center gap-8 py-20">
                        <LucideIcons.Sparkles className="h-24 w-24 text-blue-300 animate-pulse" />
                        <h3 className="text-3xl font-black text-blue-600">Start Your Adventure!</h3>
                        <p className="text-xl text-slate-600 max-w-md">
                           Click the button below to begin exploring the amazing world of science.
                        </p>
                        <Button onClick={() => setStarted(true)} className="h-16 px-12 text-xl bg-blue-600 hover:bg-blue-700">Start Exploring</Button>
                    </div>
                </CardContent>
            </Card>
        );

        const props = { onSound: playFeedbackSound, schoolId: schoolId };
        switch(activeTab) {
            case 'environment': return <SimpleScienceModule {...props} initialData={SCIENCE_DATA.environment.surroundings} title="Environment" type="environment" />;
            case 'body': return <SimpleScienceModule {...props} initialData={SCIENCE_DATA.bodyParts} title="My Body Parts" type="body" />;
            case 'organs': return <SimpleScienceModule {...props} initialData={SCIENCE_DATA.innerOrgans} title="Inside My Body" type="organ" />;
            case 'growth': return <SimpleScienceModule {...props} initialData={SCIENCE_DATA.growth} title="Stages of Growth" type="growth" categoryKey="stage" />;
            case 'senses': return <SimpleScienceModule {...props} initialData={SCIENCE_DATA.senses} title="The 5 Senses" type="sense" categoryKey="sense" />;
            case 'diet': return <SimpleScienceModule {...props} initialData={SCIENCE_DATA.diet} title="Healthy Foods" type="diet" />;
            case 'living': return <LivingSorting onSound={playFeedbackSound} schoolId={schoolId}/>;
            case 'weather': return <SimpleScienceModule {...props} initialData={SCIENCE_DATA.weather} title="Weather Window" type="weather" categoryKey="type"/>;
            case 'animals': return <SimpleScienceModule {...props} initialData={SCIENCE_DATA.animals} title="Animal Kingdom" type="animal" />;
            case 'transport': return <SimpleScienceModule {...props} initialData={SCIENCE_DATA.transport} title="Transport Explorer" type="transport" />;
            case 'concepts': return <SimpleScienceModule {...props} initialData={SCIENCE_DATA.properties.colors} title="World Concepts" type="concept"/>;
            default: return null;
        }
    };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 pb-20 font-black selection:bg-green-100">
      <div className="text-center mb-4">
        <h2 className="text-6xl font-black text-green-700 uppercase tracking-tighter drop-shadow-sm">Science Lab 🔬</h2>
        <p className="text-slate-500 font-black italic text-xl">Let's discover our wonderful world!</p>
      </div>

      <div className="w-full overflow-x-auto no-scrollbar pb-6 px-4">
        <div className="flex justify-start md:justify-center gap-4 bg-white p-5 rounded-[4rem] shadow-2xl border-4 border-green-200 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-w-[130px] px-6 py-4 rounded-3xl font-black text-[13px] uppercase tracking-wider transition-all flex flex-col items-center gap-2 border-4 ${
                activeTab === tab.id 
                ? 'bg-black text-white border-black shadow-2xl scale-110 -translate-y-2' 
                : 'bg-white text-black border-slate-100 hover:bg-green-50 hover:border-green-300'
              }`}
            >
              <IconRenderer iconName={tab.icon} className={`text-2xl ${activeTab === tab.id ? 'text-green-400' : 'text-green-600'}`} />
              <span className="leading-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full px-4">{renderActiveTab()}</div>
    </div>
  );
};

const SimpleScienceModule: React.FC<{ initialData: any[], title: string, onSound: (t: string) => void, categoryKey?: string, type: string, schoolId: string }> = ({ initialData, title, onSound, categoryKey = 'name', type, schoolId }) => {
  const [data, setData] = useState(initialData);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [started, setStarted] = useState(false); // NEW STATE

  const current = data?.[index];

  const fetchVisual = useCallback(async () => {
    if (!current || !schoolId) return;
    setLoading(true);
    const prompt = current.prompt || current.imagePrompt || `A simple nursery 3D illustration of ${current[categoryKey]}`;
    const res = await generateLessonImageAction({ prompt, schoolId });
    if (res.success) setImageUrl(res.data || null);
    setLoading(false);
  }, [current, categoryKey, schoolId]);
  
  useEffect(() => { if (started) fetchVisual(); }, [index, data, fetchVisual, started]);
  
  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return;
    setIsAiLoading(true);
    try {
      const result = await generateLifeSkillEntry({ topic: aiTopic, category: type, schoolId });
      if(result.success && result.data){
          setData(prev => [...prev, result.data]);
          setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };
  
  if (!started) {
    return (
        <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
            <IconRenderer iconName={initialData[0].icon} className="h-16 w-16 mx-auto text-green-300 mb-4"/>
            <h3 className="text-2xl font-bold text-green-600 mb-2">{title}</h3>
            <p className="text-slate-500 mb-4">Ready to explore the world of {title.toLowerCase()}?</p>
            <Button onClick={() => setStarted(true)} className="bg-green-500 hover:bg-green-600">Start Learning</Button>
        </div>
    );
  }
  
  if (!current) {
    return (
      <Card>
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent><p className="text-center text-muted-foreground py-10">No items available in this category yet.</p></CardContent>
      </Card>
    );
  }

  const getLabel = () => current?.[categoryKey];
  const getDescription = () => current?.action || current?.fact || current?.instruction || `This is ${getLabel()?.toLowerCase() ?? 'this item'}.`;

  return (
    <div className="relative font-black">
      <Button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-green-200 text-green-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-green-50 transition-colors"><LucideIcons.Wand2 className="h-3 w-3 mr-1 inline-block"/> AI Add Item</Button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-green-100 flex flex-col items-center animate-in slide-in-from-bottom">
        <h3 className="text-4xl font-black text-green-600 mb-10 uppercase tracking-tighter text-center">{title}</h3>
        <div className="flex flex-col md:flex-row gap-10 w-full items-center">
           <div onClick={() => onSound(getDescription())} className="relative aspect-square w-full max-w-sm bg-green-50 rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden cursor-pointer group">
              {loading ? <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin m-auto absolute inset-0"></div> : imageUrl ? <img src={imageUrl} className="w-full h-full object-cover p-6 transition-transform group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center"><IconRenderer iconName={current.icon} className="text-9xl text-green-200 animate-pulse" /></div>}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                 <LucideIcons.Volume2 className="text-white text-6xl opacity-0 group-hover:opacity-100 drop-shadow-lg" />
              </div>
           </div>
           <div className="flex-1 text-center md:text-left space-y-6">
              <div className="bg-green-50 p-8 rounded-3xl border-4 border-white shadow-xl">
                 <h4 className="text-6xl font-black text-green-600 uppercase mb-4 tracking-tighter">{getLabel()}</h4>
                 <p className="text-2xl font-black text-slate-700 italic leading-relaxed">"{getDescription()}"</p>
              </div>
              <Button onClick={() => onSound(getDescription())} className="w-full py-6 bg-green-500 text-white font-black rounded-3xl uppercase text-xl shadow-xl border-4 border-white active:scale-95 transition-all">Read to Me!</Button>
           </div>
        </div>
        <div className="flex gap-4 mt-12">
          <Button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} variant="outline" size="icon" className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full shadow-md"><LucideIcons.ArrowLeft/></Button>
          <Button onClick={() => setIndex(i => (i + 1) % data.length)} variant="outline" size="icon" className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full shadow-md"><LucideIcons.ArrowRight/></Button>
        </div>
      </div>
      {isDrawerOpen && <TeacherModal title={`New ${title}`} topicLabel="Item Name" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

const LivingSorting: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLiving, setIsLiving] = useState(Math.random() > 0.5);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const [livingList, setLivingList] = useState(SCIENCE_DATA.living);
  const [nonLivingList, setNonLivingList] = useState(SCIENCE_DATA.nonLiving);

  const data = isLiving ? livingList : nonLivingList;
  const current = data[index % data.length];

  const fetchImage = useCallback(async () => {
    if (!current?.name || !schoolId) return;
    setLoading(true); 
    generateLessonImageAction({ prompt: `Centered high quality 3D illustration of ${current.name}, white background, nursery style`, schoolId }).then(res => {
      if (res.success) setImageUrl(res.data || null);
      setLoading(false); 
    });
    setFeedback(null);
  }, [current, schoolId]);

  useEffect(() => { if (started) fetchImage(); }, [index, isLiving, livingList, nonLivingList, started, fetchImage]);

  const handleSort = (choice: boolean) => {
    if (choice === isLiving) { setFeedback('YES! Correct! 🌟'); onSound(`That's right! A ${current.name} is a ${isLiving ? 'living' : 'non-living'} thing!`); }
    else { setFeedback('Oops! Try again! 💫'); onSound(`Hmm, can a ${current.name} eat, grow and breathe?`); }
  };

  const generateWithAi = async () => {
    if (!aiTopic || !schoolId) return;
    setIsAiLoading(true);
    try {
      const result = await generateLifeSkillEntry({ topic: aiTopic, category: 'living', schoolId });
      if(result.success && result.data){
        const isLivingResult = (result.data as any).isLiving;
        const newItem = { name: (result.data as any).name, icon: (result.data as any).icon || 'fa-leaf', prompt: 'a photo of ' + (result.data as any).name };
        if (isLivingResult) setLivingList(prev => [...prev, newItem]);
        else setNonLivingList(prev => [...prev, newItem]);
        setIsDrawerOpen(false); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };
  
  if (!started) {
    return (
        <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
            <LucideIcons.Leaf className="h-16 w-16 mx-auto text-green-300 mb-4"/>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Living or Not?</h3>
            <p className="text-slate-500 mb-4">Let's sort things into living and non-living groups!</p>
            <Button onClick={() => setStarted(true)} className="bg-green-500 hover:bg-green-600">Start Sorting</Button>
        </div>
    );
  }

  return (
    <div className="relative font-black">
      <Button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-green-200 text-green-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-green-50 transition-colors"><LucideIcons.Wand2 className="h-3 w-3 mr-1 inline-block"/> AI Add Thing</Button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-green-200 flex flex-col items-center">
        <h3 className="text-4xl font-black text-green-600 mb-10 uppercase text-center">Is it Living? 🌱</h3>
        <div className="w-80 h-80 bg-green-50 rounded-[4rem] border-8 border-white shadow-2xl mb-12 flex items-center justify-center overflow-hidden">
          {loading ? <div className="w-16 h-16 border-8 border-green-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-10" />}
        </div>
        <h4 className="text-5xl font-black mb-12 uppercase tracking-tighter">{current.name}</h4>
        <div className="grid grid-cols-2 gap-8 w-full max-w-xl">
          <Button onClick={() => handleSort(true)} className="py-8 h-auto bg-green-500 text-white rounded-[2.5rem] font-black uppercase text-2xl shadow-xl border-4 border-white hover:scale-105 transition-all">Living</Button>
          <Button onClick={() => handleSort(false)} className="py-8 h-auto bg-slate-800 text-white rounded-[2.5rem] font-black uppercase text-2xl shadow-xl border-4 border-white hover:scale-105 transition-all">Non-Living</Button>
        </div>
        {feedback && <p className="mt-10 text-3xl font-black text-green-600 animate-bounce">{feedback}</p>}
        <Button onClick={() => { setIndex(i => i + 1); setIsLiving(Math.random() > 0.5); }} className="mt-12 text-slate-500 uppercase text-xs tracking-widest font-black" variant="ghost">Next 🔄</Button>
      </div>
      {isDrawerOpen && <TeacherModal title="Add Nature Object" topicLabel="Object Name" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

export default ScienceExploration;

    