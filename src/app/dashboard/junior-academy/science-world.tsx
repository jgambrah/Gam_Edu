
'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, where, serverTimestamp, getDocs } from 'firebase/firestore';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight,
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette,
  Trophy, Gift, Check, CheckCircle2, XCircle, PenTool, Eraser, Database, Pencil, Heart, Utensils, Smile, Tv, Users, Activity, CheckSquare, BrainCircuit, Handshake, Milestone, Ear, Layers, AudioLines, Repeat, Underline, BookCheck, FolderOpen, Car, Earth, Sparkles, HeartPulse, CloudSun, PawPrint, Shapes, Languages, PenNib, Apple, Sun, CloudRain, Guitar, Plane, MousePointer2, Cube, Carrot, Cookie, School, Home, Recycle, Water, Droplets, HelpCircle, MessageSquare, Drama, ArrowLeft, Play, Flag, GraduationCap, Monitor, Zap, CircleDot, RefreshCw, PlusCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateLessonImageAction, generateTTSAction, generateLifeSkillEntry } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// --- LOCAL DATA (to fix dependency issue) ---
const SCIENCE_DATA = {
  bodyParts: [{ name: "Head", icon: 'fa-user', prompt: "A child's head with hair" }, { name: "Arms", icon: 'fa-hand', prompt: 'Cartoon arms waving' }],
  innerOrgans: [{ name: "Heart", icon: 'fa-heart-pulse', fact: 'Your heart pumps blood to your body.' }, { name: "Lungs", icon: 'fa-lungs', fact: 'Your lungs help you breathe air.' }],
  growth: [{ stage: "Baby", action: "I crawl and say goo-goo!", prompt: 'A happy baby crawling' }, { stage: "Child", action: "I run and play with my friends!", prompt: 'A child running in a park' }],
  senses: [{ sense: "See", icon: 'fa-eye', action: 'I see with my eyes!' }, { sense: "Hear", icon: 'fa-ear-listen', action: 'I hear with my ears!' }],
  diet: [{ name: 'Apple', type: 'Fruit' }, { name: 'Carrot', type: 'Vegetable' }],
  living: [{ name: 'Tree' }, { name: 'Dog' }],
  nonLiving: [{ name: 'Rock' }, { name: 'Car' }],
  weather: [{ type: 'Sunny', icon: 'fa-sun' }, { type: 'Rainy', icon: 'fa-cloud-showers-heavy' }],
  animals: [{ name: 'Lion', sound: 'Roar!', fact: 'The lion is the king of the jungle.', prompt: 'A friendly cartoon lion' }, { name: 'Monkey', sound: 'Ooh-ooh-aah-aah!', fact: 'Monkeys love to eat bananas.', prompt: 'A cheeky cartoon monkey' }],
  transport: [{ name: 'Car', type: 'Road', icon: 'fa-car' }, { name: 'Airplane', type: 'Air', icon: 'fa-plane' }],
  properties: {
    colors: [{ name: 'Red', explanation: 'Like a juicy apple!', prompt: 'A big shiny red apple' }],
    shapes: [{ name: 'Circle', explanation: 'A round shape like a ball.', prompt: 'A red bouncy ball' }],
    sizes: [{ pair: 'Big/Small', prompt: 'A big elephant next to a small mouse' }],
    feelings: [{ name: 'Happy', explanation: 'When you feel smiley!', prompt: 'A very happy smiling sun' }],
  },
  environment: {
    surroundings: [{ name: 'The Forest', icon: 'fa-tree', fact: 'Forests are home to many animals.', prompt: 'A dense green forest with tall trees' }],
    greenHabits: [{ name: 'Recycling', icon: 'fa-recycle', fact: 'Recycling helps keep our Earth clean.', prompt: 'A child putting a plastic bottle in a recycling bin' }],
    cleanWorld: [{ name: 'Clean Beach', icon: 'fa-water', fact: 'We should never leave trash on the beach.', prompt: 'A clean sandy beach with blue water' }],
  }
};


// --- ICON RENDERER ---
const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const map: Record<string, keyof typeof LucideIcons> = {
        'fa-earth-africa': 'Earth', 'fa-user': 'User', 'fa-heart-pulse': 'HeartPulse',
        'fa-arrow-up-right-dots': 'TrendingUp', 'fa-ear-listen': 'Ear', 'fa-apple-whole': 'Apple',
        'fa-leaf': 'Leaf', 'fa-cloud-sun': 'CloudSun', 'fa-paw': 'PawPrint',
        'fa-car': 'Car', 'fa-shapes': 'Shapes', 'fa-tree': 'Tree', 'fa-recycle': 'Recycle', 'fa-water': 'Droplets',
        'fa-magic': 'Wand2', 'fa-spinner': 'Loader2', 'fa-arrow-left': 'ArrowLeft', 'fa-arrow-right': 'ArrowRight',
        'fa-volume-high': 'Volume2', 'fa-sun': 'Sun', 'fa-lungs': 'Atom',
        'fa-hand': 'Hand', 'fa-eye': 'Eye'
    };
    const LucideName = map[iconName] || 'HelpCircle';
    const IconComponent = (LucideIcons as any)[LucideName];
    return <IconComponent className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} />;
};

type ScienceTab = 'body' | 'organs' | 'growth' | 'senses' | 'diet' | 'living' | 'weather' | 'animals' | 'transport' | 'concepts' | 'environment';

// --- TEACHER MODAL ---
const TeacherModal: React.FC<{
  title: string; topicLabel: string; topicValue: string; 
  onTopicChange: (v: string) => void; onGenerate: () => void; 
  isLoading: boolean; onClose: () => void;
}> = ({ title, topicLabel, topicValue, onTopicChange, onGenerate, isLoading, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 font-black">
    <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-green-100 animate-in zoom-in duration-300">
      <h3 className="text-3xl font-black text-slate-800 mb-6 uppercase tracking-tighter">{title}</h3>
      <div className="space-y-6">
        <div>
          <Label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">{topicLabel}</Label>
          <Input 
            type="text" autoFocus value={topicValue} onChange={(e) => onTopicChange(e.target.value)} 
            placeholder="Type here..." className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 outline-none font-bold focus:border-green-300 transition-colors text-slate-800 uppercase" 
          />
        </div>
        <Button onClick={onGenerate} disabled={isLoading || !topicValue} className="w-full py-5 rounded-2xl font-black text-white bg-green-500 shadow-xl hover:bg-green-600 disabled:bg-gray-300 transition-all flex items-center justify-center gap-3 border-4 border-white uppercase tracking-widest">
          {isLoading ? <><Loader2 className="animate-spin"/> PREPARING...</> : <><Sparkles /> CREATE MAGIC</>}
        </Button>
        <button onClick={onClose} className="w-full py-2 text-slate-400 uppercase text-[10px] font-black tracking-widest hover:text-slate-600 transition-colors text-center block font-black">Close Drawer</button>
      </div>
    </div>
  </div>
);

// --- MAIN EXPLORATION COMPONENT ---
const ScienceExploration: React.FC<{ schoolId: string }> = ({ schoolId }) => {
  const [activeTab, setActiveTab] = useState<ScienceTab>('environment');
  const [playing, setPlaying] = useState(false);
  
  const playFeedbackSound = useCallback(async (text: string) => {
    if (!text || !schoolId) return;
    setPlaying(true);
    try {
      const result = await generateTTSAction({ text, voice: 'Kore', schoolId });
      if (result.success && result.data && typeof window !== 'undefined') {
        const audio = new Audio(`data:audio/wav;base64,${result.data}`);
        audio.play();
        audio.onended = () => setPlaying(false);
      } else { setPlaying(false); }
    } catch (err) { setPlaying(false); }
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
    switch(activeTab) {
      case 'environment': return <EnvironmentHub onSound={playFeedbackSound} schoolId={schoolId} />;
      // ... other cases will be added similarly
      default: return (
        <SimpleScienceModule 
            key={activeTab} // Add key to force re-mount on tab change
            initialData={(SCIENCE_DATA as any)[activeTab] || []} 
            title={tabs.find(t => t.id === activeTab)?.label || 'Discovery'} 
            onSound={playFeedbackSound} 
            type={activeTab} 
            schoolId={schoolId}
        />
      );
    }
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 pb-20 font-black selection:bg-green-100">
      <div className="text-center mb-4">
        <h2 className="text-6xl font-black text-green-700 uppercase tracking-tighter drop-shadow-sm font-black">Science Lab 🔬</h2>
        <p className="text-slate-500 font-black italic text-xl">Let's discover our wonderful world!</p>
      </div>

      <div className="w-full overflow-x-auto no-scrollbar pb-6 px-4 font-black">
        <div className="flex justify-start md:justify-center gap-4 bg-white p-5 rounded-[4rem] shadow-2xl border-4 border-green-200 min-w-max font-black">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`min-w-[130px] px-6 py-4 rounded-3xl font-black text-[13px] uppercase tracking-wider transition-all flex flex-col items-center gap-2 border-4 ${ activeTab === tab.id ? 'bg-black text-white border-black shadow-2xl scale-110 -translate-y-2' : 'bg-white text-black border-slate-100 hover:bg-green-50 hover:border-green-300 font-black' }`} >
              <IconRenderer iconName={tab.icon} className={`text-2xl ${activeTab === tab.id ? 'text-green-400' : 'text-green-600'}`} />
              <span className="leading-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="w-full px-4 font-black">{renderActiveTab()}</div>
    </div>
  );
};

// Simplified generic component for most tabs
const SimpleScienceModule: React.FC<{ initialData: any[], title: string, onSound: (t: string) => void, categoryKey?: string, type: string, schoolId: string }> = ({ initialData, title, onSound, categoryKey = 'name', type, schoolId }) => {
  const [data, setData] = useState(initialData);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const current = data[index];

  const fetchVisual = useCallback(async () => { 
    if (!current) return;
    setLoading(true); 
    const prompt = current.prompt || current.imagePrompt || `A simple nursery 3D illustration of ${current[categoryKey]}`;
    const res = await generateLessonImageAction({prompt, schoolId});
    if(res.success) setImageUrl(res.data || null); 
    setLoading(false); 
  }, [current, categoryKey, schoolId]);

  useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
  
  const generateWithAi = async () => {
    if (!aiTopic) return;
    setIsAiLoading(true);
    try {
      const result = await generateLifeSkillEntry({ topic: aiTopic, category: type, schoolId });
      if(result.success && result.data){
        setData(prev => [...prev, result.data]);
        setIsDrawerOpen(false); setIndex(data.length); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };
  
  const getLabel = () => current?.[categoryKey] || 'Item';
  const getDescription = () => current?.action || current?.fact || current?.instruction || `This is ${getLabel().toLowerCase()}.`;

  return (
    <div className="relative font-black">
      <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-green-200 text-green-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-green-50 transition-colors font-black"><Wand2 className="h-3 w-3 mr-1 inline-block"/> AI Add Item</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-green-100 flex flex-col items-center animate-in slide-in-from-bottom font-black">
        <h3 className="text-4xl font-black text-green-600 mb-10 uppercase tracking-tighter text-center font-black">{title}</h3>
        <div className="flex flex-col md:flex-row gap-10 w-full items-center font-black">
           <div onClick={() => onSound(getDescription())} className="relative aspect-square w-full max-w-sm bg-green-50 rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden cursor-pointer group font-black">
              {loading ? <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin m-auto absolute inset-0 font-black"></div> : imageUrl ? <img src={imageUrl} className="w-full h-full object-cover p-6 transition-transform group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center"><IconRenderer iconName={current.icon} className="text-9xl text-green-200 animate-pulse" /></div>}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center font-black">
                 <Volume2 className="text-white text-6xl opacity-0 group-hover:opacity-100 drop-shadow-lg" />
              </div>
           </div>
           <div className="flex-1 text-center md:text-left space-y-6 font-black">
              <div className="bg-green-50 p-8 rounded-3xl border-4 border-white shadow-xl font-black">
                 <h4 className="text-6xl font-black text-green-600 uppercase mb-4 tracking-tighter">{getLabel()}</h4>
                 <p className="text-2xl font-black text-slate-700 italic leading-relaxed">"{getDescription()}"</p>
              </div>
              <Button onClick={() => onSound(getDescription())} className="w-full py-6 bg-green-500 text-white font-black rounded-3xl uppercase text-xl shadow-xl border-4 border-white active:scale-95 transition-all">Read to Me!</Button>
           </div>
        </div>
        <div className="flex gap-4 mt-12 font-black">
          <Button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} variant="outline" size="icon" className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full shadow-md"><ArrowLeft/></Button>
          <Button onClick={() => setIndex(i => (i + 1) % data.length)} variant="outline" size="icon" className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full shadow-md"><ArrowRight/></Button>
        </div>
      </div>
      {isDrawerOpen && <TeacherModal title={`New ${title}`} topicLabel="Item Name" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
    </div>
  );
};

// --- Other modules (Environment, Living, etc.) would follow a similar pattern ---
// For brevity, they are condensed or omitted, but the structure is the same as SimpleScienceModule.
const EnvironmentHub: React.FC<{ onSound: (t: string) => void; schoolId: string }> = (props) => <SimpleScienceModule {...props} initialData={SCIENCE_DATA.environment.surroundings} title="Environment" type="environment" />;
const GrowthModule: React.FC<{ onSound: (t: string) => void; schoolId: string }> = (props) => <SimpleScienceModule {...props} initialData={SCIENCE_DATA.growth} title="Stages of Growth" type="growth" categoryKey="stage" />;
const BalancedDiet: React.FC<{ onSound: (t: string) => void; schoolId: string }> = (props) => <SimpleScienceModule {...props} initialData={SCIENCE_DATA.diet} title="Healthy Foods" type="diet" />;
const LivingSorting: React.FC<{ onSound: (t: string) => void; schoolId: string }> = (props) => <p>Living Sorting Coming Soon</p>;
const WeatherWindow: React.FC<{ onSound: (t: string) => void; schoolId: string }> = (props) => <SimpleScienceModule {...props} initialData={SCIENCE_DATA.weather} title="Weather Window" type="weather" categoryKey="type"/>;
const AnimalKingdom: React.FC<{ onSound: (t: string) => void; schoolId: string }> = (props) => <SimpleScienceModule {...props} initialData={SCIENCE_DATA.animals} title="Animal Kingdom" type="animal" />;
const TransportExplorer: React.FC<{ onSound: (t: string) => void; schoolId: string }> = (props) => <SimpleScienceModule {...props} initialData={SCIENCE_DATA.transport} title="Transport Explorer" type="transport" />;
const ConceptsZone: React.FC<{ onSound: (t: string) => void; schoolId: string }> = (props) => <SimpleScienceModule {...props} initialData={SCIENCE_DATA.properties.colors} title="World Concepts" type="concept"/>;

// --- FINAL EXPORT ---
export default function JuniorScienceWorld({ schoolId }: { schoolId: string }) {
    const [started, setStarted] = useState(false);

    if (!started) {
        return (
            <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
                <Atom className="h-16 w-16 mx-auto text-blue-300 mb-4"/>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">Science Lab</h3>
                <p className="text-slate-500 mb-4">Ready to explore the amazing world of science? Let's go!</p>
                <Button onClick={() => setStarted(true)} className="bg-blue-500 hover:bg-blue-600">Start Exploring</Button>
            </div>
        )
    }
    
    return <ScienceExploration schoolId={schoolId} />;
}
