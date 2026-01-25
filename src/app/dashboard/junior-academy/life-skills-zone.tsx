
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where, setDoc, increment } from 'firebase/firestore';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight,
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette,
  Trophy, Gift, Check, CheckCircle2, XCircle, PenTool, Eraser, Database, Pencil, Heart, Utensils, Smile, Tv, Users, Activity, CheckSquare, BrainCircuit, Handshake, Milestone, Ear, Layers, AudioLines, Repeat, Underline, BookCheck, FolderOpen, Car, Earth, Sparkles, HeartPulse, CloudSun, PawPrint, Shapes, Languages, Pen, Apple, Sun, CloudRain, Guitar, Plane, MousePointer2, Box, Carrot, Cookie, School, Home, Recycle, Water, Droplets, HelpCircle, MessageSquare, Drama, ArrowLeft, Play, Flag, GraduationCap, Monitor, Zap, CircleDot,
  BotMessageSquare as Bot, Shirt, FlaskConical, Bed, Eye, TrendingUp, Leaf, Sprout, User as UserIcon, Hand
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

import confetti from 'canvas-confetti';
import { generateLessonImageAction, generateTTSAction, generateRhyme, generateSkillDetails, generateLifeSkillEntry } from '@/ai/flows/junior-actions';
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

const LIFE_SKILLS_DATA = {
    physicalHealth: {
      grossMotor: [
        { title: 'Jumping Jacks', action: 'Jump and spread your legs and arms!', icon: 'fa-star', prompt: 'A child doing a jumping jack, full of energy' },
        { title: 'Running Race', action: 'Run as fast as you can to the finish line!', icon: 'fa-flag', prompt: 'Children racing in a field, with a finish line' }
      ],
      fineMotor: [
        { title: 'Building Blocks', action: 'Stack the blocks as high as you can!', icon: 'fa-cube', prompt: 'A child stacking colorful toy blocks' },
        { title: 'Drawing Fun', action: 'Draw a beautiful picture with your crayons!', icon: 'fa-pen-nib', prompt: 'A colorful drawing made by a child' }
      ],
      hygiene: [
        { title: 'Washing Hands', action: 'Wash your hands with soap and water to get rid of germs!', icon: 'fa-soap', prompt: 'Hands being washed with soap under a faucet' },
        { title: 'Brushing Teeth', action: 'Brush up and down, twice a day!', icon: 'fa-tooth', prompt: 'A child happily brushing their teeth, with sparkles on their teeth' }
      ],
      nutrition: [
        { title: 'Eating Vegetables', action: 'Eat your vegetables to grow big and strong!', icon: 'fa-carrot', prompt: 'A child eating a plate of colorful vegetables' },
        { title: 'Healthy Snack', action: 'An apple is a delicious and healthy snack!', icon: 'fa-apple-whole', prompt: 'A shiny red apple' }
      ]
    },
    music: [
      { title: 'Brushing Teeth Song', theme: 'brushing teeth every morning', icon: 'fa-tooth' },
    ],
    practicalLife: {
      pretendPlay: [
        { title: 'The Chef', scenario: 'Pretend to cook a yummy soup!', modeling: 'Stir the pot carefully so it does not spill.', action: 'Stir Soup', prompt: 'A child wearing a chef hat stirring a big pot, nursery style' },
      ],
      dressing: [
        { item: 'Coat', need: 'it is cold outside', icon: 'fa-vest', prompt: 'A child putting on a warm winter coat, nursery style', clothing: 'winter coat' },
      ],
      schedules: [
        { name: 'Morning Routine', sequence: ['Wake up', 'Eat breakfast', 'Go to school'], icons: ['fa-sun', 'fa-utensils', 'fa-school'], prompt: 'A simple morning routine sequence illustration' }
      ]
    },
    emotions: [
      { name: 'Happy', color: 'bg-yellow-400', icon: 'fa-face-smile', prompt: 'A very happy smiling child face, nursery style', technique: 'Smile big and show your teeth!' },
    ],
    communication: {
      pictureTalk: [
        { title: 'In the Park', prompt: 'A busy park with kids playing, a dog, and a slide, nursery style', description: 'I see kids playing on the slide and a brown dog!' }
      ],
      instructions: [
        { task: 'Touch your nose', icon: 'fa-hand-pointer', spoken: 'Can you touch your nose with one finger?' }
      ],
      circleTime: [
        { q: 'What is your favorite color?', icon: 'fa-palette', followUp: 'Tell us why you like it!' }
      ]
    },
    social: [
      { scenario: 'Sharing Toys', q: 'Your friend wants the ball. What do you do?', options: ['Give it to them', 'Keep it', 'Hide it'], correct: 0, prompt: 'Two kids looking at a colorful ball, nursery style' },
    ],
    community: [
      { role: 'The Teacher', icon: 'fa-chalkboard-user', fact: 'Teachers help us learn new things and be kind to others.', prompt: 'A kind teacher reading a story to a group of happy children' },
    ],
    cognitive: {
      scenarios: [
        { q: 'The floor is messy with toys. How do we fix it?', options: ['fa-broom', 'fa-tv', 'fa-bed'], labels: ['Tidy Up', 'Watch TV', 'Go to Bed'], correct: 0, prompt: 'A room with many toys on the floor, nursery style' }
      ],
      patterns: [
        { sequence: ['fa-apple-whole', 'fa-carrot', 'fa-apple-whole'], next: 'fa-carrot', options: ['fa-apple-whole', 'fa-carrot'], prompt: 'A simple pattern of fruit and vegetables' }
      ],
      whatIf: [
        { q: 'What if we could fly like birds?', a: 'We would see the whole world from high in the sky!', prompt: 'A child with bird wings flying over a colorful town' }
      ]
    },
    tidying: [
      { title: 'Blocks', icon: 'fa-cube', prompt: 'Colorful toy blocks scattered on a rug' }
    ]
  };

const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const map: Record<string, keyof typeof LucideIcons> = {
      'fa-spell-check': 'Languages', 'fa-ear-listen': 'Ear', 'fa-pen-nib': 'Pen',
      'fa-arrow-1-9': 'Calculator', 'fa-hand-holding-heart': 'Handshake', 'fa-flask-vial': 'FlaskConical',
      'fa-palette': 'Palette', 'fa-robot': 'Bot', 'fa-face-smile': 'Smile', 'fa-tooth': 'Sparkles',
      'fa-heart-pulse': 'HeartPulse', 'fa-vest': 'User', 'fa-sun': 'Sun', 'fa-utensils': 'Utensils',
      'fa-school': 'School', 'fa-house': 'Home', 'fa-recycle': 'Recycle', 'fa-water': 'Droplets',
      'fa-broom': 'Trash2', 'fa-flag': 'Flag', 'fa-hand-pointer': 'MousePointer2', 'fa-cube': 'Box',
      'fa-chalkboard-user': 'User', 'fa-rabbit': 'Rabbit', 'fa-carrot': 'Carrot', 'fa-apple-whole': 'Apple',
      'fa-cookie': 'Cookie', 'fa-star': 'Star', 'fa-tv': 'Tv', 'fa-bed': 'Bed', 'fa-eye': 'Eye',
      'fa-cloud-showers-heavy': 'CloudRain', 'fa-guitar': 'Guitar', 'fa-plane': 'Plane', 'fa-car': 'Car',
      'fa-frog': 'Rabbit', 
      'fa-bolt': 'Zap',
      'fa-circle-dot': 'CircleDot',
      'fa-soap': 'Sparkles', 
      'fa-broccoli': 'Carrot', 
      'fa-display': 'Monitor',
      'fa-graduation-cap': 'GraduationCap',
      'fa-comments': 'MessageSquare',
      'fa-people-group': 'Users',
      'fa-masks-theater': 'Drama',
      'fa-brain': 'BrainCircuit',
      'fa-child-reaching': 'User',
      'fa-music': 'Music',
      'fa-magic': 'Wand2',
      'fa-arrow-left': 'ArrowLeft',
      'fa-arrow-right': 'ArrowRight',
      'fa-spinner': 'Loader2',
      'fa-volume-high': 'Volume2',
      'fa-dna': 'Atom',
      'fa-play': 'Play',
      'fa-heart': 'Heart',
      'fa-face-smile-wink': 'Smile'
    };
  
    const LucideName = map[iconName] || 'HelpCircle';
    const IconComponent = (LucideIcons as any)[LucideName];
  
    if (!IconComponent || typeof IconComponent !== 'function') {
      console.error('❌ Missing or invalid icon:', LucideName, 'for FA icon:', iconName);
      const FallbackIcon = (LucideIcons as any)['HelpCircle'];
      return <FallbackIcon className={className} />;
    }
  
    return <IconComponent className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} />;
};


type LifeSkillTab = 'emotions' | 'routine-songs' | 'modeling' | 'practical-life' | 'communication' | 'social' | 'puppet-theater' | 'cognitive' | 'physical-health';

interface TeacherModalProps {
  title: string;
  topicLabel: string;
  topicValue: string;
  onTopicChange: (v: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onClose: () => void;
}

const TeacherModal: React.FC<TeacherModalProps> = ({ title, topicLabel, topicValue, onTopicChange, onGenerate, isLoading, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
    <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-gray-50 animate-in zoom-in duration-300 font-black">
      <h3 className="text-3xl font-black text-slate-800 mb-6 uppercase tracking-tighter">{title}</h3>
      <div className="space-y-6">
        <div>
          <Label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">{topicLabel}</Label>
          <Input 
            type="text" 
            value={topicValue} 
            onChange={(e) => onTopicChange(e.target.value)} 
            placeholder="Type here..." 
            className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 outline-none font-bold focus:border-teal-300 transition-colors text-slate-800 uppercase" 
          />
        </div>
        <Button 
          onClick={onGenerate} 
          disabled={isLoading || !topicValue} 
          className="w-full py-5 rounded-2xl font-black text-white bg-teal-500 shadow-xl hover:bg-teal-600 disabled:bg-gray-300 transition-all flex items-center justify-center gap-3 border-4 border-white uppercase tracking-widest"
        >
          {isLoading ? <><Loader2 className="animate-spin"/> GENERATING...</> : <><Sparkles /> CREATE SHOW</>}
        </Button>
        <button onClick={onClose} className="w-full py-2 text-slate-400 uppercase text-[10px] font-black tracking-widest hover:text-slate-600 block text-center transition-colors font-black">Close</button>
      </div>
    </div>
  </div>
);

const RoutineSongsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
  const [songs, setSongs] = useState(LIFE_SKILLS_DATA.music);
  const [index, setIndex] = useState(0);
  const [singing, setSinging] = useState(false);
  const current = songs[index];

  const handleSing = async () => {
    if (!schoolId) return;
    setSinging(true);
    const result = await generateRhyme({ topic: current.theme, schoolId });
    await onSound(`Let's sing about ${current.theme}! ${result.rhyme}`);
    setSinging(false);
  };

  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center animate-in zoom-in font-black">
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
    </div>
  );
};

const ModelingModule: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
  const [data, setData] = useState(LIFE_SKILLS_DATA.practicalLife.pretendPlay);
  const [index, setIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const current = data[index];

  const fetchVisual = useCallback(async () => { 
    if(!current || !schoolId) return;
    setLoading(true); 
    const result = await generateLessonImageAction({prompt: current.prompt, schoolId}); 
    if (result.success) setImageUrl(result.data || null); 
    setLoading(false); 
}, [current, schoolId]);

useEffect(() => { 
    if (started) {
        fetchVisual();
    }
}, [index, data, started, fetchVisual]);


  const handleWatch = () => {
    onSound(`${current.scenario} ${current.modeling}`);
    onComplete();
  };

  if (!started) {
    return (
         <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
            <Tv className="h-16 w-16 mx-auto text-indigo-300 mb-4"/>
            <h3 className="text-2xl font-bold text-indigo-600 mb-2">Watch & Learn</h3>
            <p className="text-slate-500 mb-4">See how to do new things by watching fun animations!</p>
            <Button onClick={() => setStarted(true)} className="bg-indigo-500 hover:bg-indigo-600">Start Watching</Button>
        </div>
    )
}

  return (
    <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-indigo-100 flex flex-col items-center animate-in zoom-in font-black">
      <h3 className="text-4xl font-black text-indigo-500 mb-10 uppercase tracking-tighter">I Can Do It! 🎥</h3>
      <div onClick={handleWatch} className="w-full max-w-xl aspect-video bg-indigo-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
        {loading ? <Loader2 className="w-16 h-16 animate-spin text-indigo-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6" alt={current.title} />}
      </div>
      <h4 className="text-4xl font-black text-slate-800 mb-4 uppercase">{current.title}</h4>
      <p className="text-xl font-black text-slate-500 italic mb-10 text-center leading-relaxed">"{current.scenario}"</p>
      <Button onClick={handleWatch} className="px-16 py-6 bg-indigo-500 text-white rounded-[3rem] font-black uppercase text-2xl shadow-xl border-4 border-white">Watch & Learn!</Button>
    </div>
  );
};
const PracticalLifeModule: React.FC<{ onSound: (t: string) => void; onComplete: () => void; schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const [subTab, setSubTab] = useState<'dressing' | 'schedules'>('dressing');
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const data = subTab === 'dressing' ? LIFE_SKILLS_DATA.practicalLife.dressing : LIFE_SKILLS_DATA.practicalLife.schedules;
    const current = data[index] || data[0];
  
    const fetchVisual = useCallback(async () => {
        if (!current || !schoolId) return;
        setLoading(true);
        const result = await generateLessonImageAction({ prompt: current.prompt, schoolId });
        if (result.success) setImageUrl(result.data || null);
        setLoading(false);
    }, [current, schoolId]);

    useEffect(() => {
        if (started) {
            fetchVisual();
        }
    }, [subTab, index, data, started, fetchVisual]);
  
    if (!started) {
        return (
             <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
                <GraduationCap className="h-16 w-16 mx-auto text-blue-300 mb-4"/>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">My Day</h3>
                <p className="text-slate-500 mb-4">Learn about daily routines and how to get ready!</p>
                <Button onClick={() => setStarted(true)} className="bg-blue-500 hover:bg-blue-600">Start My Day</Button>
            </div>
        )
    }

    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center animate-in zoom-in font-black">
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
      </div>
    );
};

const CommunicationModule: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const [subTab, setSubTab] = useState<'pictureTalk' | 'instructions' | 'circleTime'>('pictureTalk');
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const data = LIFE_SKILLS_DATA.communication[subTab];
    const current = data[index] || data[0];
  
    const fetchVisual = useCallback(async () => {
        if (subTab !== 'pictureTalk' || !current || !schoolId) {
            setImageUrl(null);
            return;
        }
        setLoading(true);
        const result = await generateLessonImageAction({ prompt: (current as any).prompt, schoolId });
        if (result.success) setImageUrl(result.data || null);
        setLoading(false);
    }, [current, schoolId, subTab]);

    useEffect(() => { 
        if(started) fetchVisual();
    }, [subTab, index, data, started, fetchVisual]);
  
    const handleAction = () => {
      onSound((current as any).description || (current as any).spoken || (current as any).q);
      onComplete();
    };

     if (!started) {
        return (
             <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
                <MessageSquare className="h-16 w-16 mx-auto text-orange-300 mb-4"/>
                <h3 className="text-2xl font-bold text-orange-600 mb-2">Let's Talk!</h3>
                <p className="text-slate-500 mb-4">Practice talking and listening with fun activities.</p>
                <Button onClick={() => setStarted(true)} className="bg-orange-500 hover:bg-orange-600">Start Talking</Button>
            </div>
        )
    }
  
    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center animate-in zoom-in font-black">
        <div className="flex flex-wrap justify-center gap-2 mb-10 font-black">
          {(['pictureTalk', 'instructions', 'circleTime'] as const).map(t => (
            <button key={t} onClick={() => {setSubTab(t); setIndex(0);}} className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase ${subTab === t ? 'bg-orange-500 text-white' : 'bg-slate-100'}`}>{t.replace(/([A-Z])/g, ' $1')}</button>
          ))}
        </div>
        <h3 className="text-3xl font-black text-orange-500 mb-8 uppercase">Let's Talk! 💬</h3>
        {subTab === 'pictureTalk' ? (
          <div onClick={handleAction} className="w-full max-w-2xl aspect-video bg-orange-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
            {loading ? <Loader2 className="w-16 h-16 animate-spin text-orange-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6" alt="talk" />}
          </div>
        ) : (
          <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center text-5xl mb-8 border-4 border-white animate-bounce">
             <IconRenderer iconName={(current as any).icon} />
          </div>
        )}
        <p className="text-2xl font-black text-slate-800 mb-10 text-center italic max-w-lg">"{(current as any).title || (current as any).task || (current as any).q}"</p>
        <button onClick={handleAction} className="px-16 py-6 bg-orange-500 text-white rounded-[3rem] font-black uppercase text-xl shadow-xl border-4 border-white">Start Talking!</button>
      </div>
    );
};

const SocialScenarios: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const [subTab, setSubTab] = useState<'interaction' | 'community'>('interaction');
    const [index, setIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [started, setStarted] = useState(false);

    const [socialData, setSocialData] = useState(LIFE_SKILLS_DATA.social);
    const [communityData, setCommunityData] = useState(LIFE_SKILLS_DATA.community);
  
    const isCommunity = subTab === 'community';
    const data = isCommunity ? communityData : socialData;
    const current = data[index] || data[0];
  
    const fetchVisual = useCallback(async () => {
        if (!current || !schoolId) return;
        setLoading(true);
        const result = await generateLessonImageAction({ prompt: current.prompt, schoolId });
        if (result.success) setImageUrl(result.data || null);
        setLoading(false);
    }, [current, schoolId]);

    useEffect(() => { 
        if (started) {
            fetchVisual(); 
        }
        setUserAnswer(null); 
    }, [subTab, index, data, started, fetchVisual]);
  
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
      if (!aiTopic || !schoolId) return;
      setIsAiLoading(true);
      try {
        const result = await generateLifeSkillEntry({ topic: aiTopic, category: subTab === 'community' ? 'community' : 'kindness', schoolId });
        if(result.success && result.data){
            if (subTab === 'community') {
                setCommunityData(prev => [...prev, result.data]);
            } else {
                setSocialData(prev => [...prev, result.data]);
            }
            setIsDrawerOpen(false); 
            setIndex(data.length); 
            setAiTopic('');
        }
      } catch (e) { console.error(e); } 
      finally { setIsAiLoading(false); }
    };
  
     if (!started) {
        return (
             <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
                <Users className="h-16 w-16 mx-auto text-rose-300 mb-4"/>
                <h3 className="text-2xl font-bold text-rose-600 mb-2">Social & Kindness</h3>
                <p className="text-slate-500 mb-4">Learn about friends, family, and our community helpers.</p>
                <Button onClick={() => setStarted(true)} className="bg-rose-500 hover:bg-rose-600">Start Exploring</Button>
            </div>
        )
    }

    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-pink-200 text-pink-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-pink-50 transition-colors font-black"><Wand2 className="w-3 h-3 inline-block mr-1"/> AI Social Assistant</button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-right duration-500 font-black">
          <h3 className="text-4xl font-black text-pink-500 mb-8 uppercase tracking-tighter text-center font-black">Social & Emotional Hub 🤝</h3>
          
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
              {userAnswer === (current as any).correct && <button onClick={() => setIndex(p => (p + 1) % socialData.length)} className="mt-10 px-12 py-5 bg-pink-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase tracking-widest font-black">Next Challenge! ❤️</button>}
            </div>
          ) : (
            <div className="flex flex-col items-center w-full font-black animate-in zoom-in">
               <div className="w-24 h-24 bg-pink-100 text-pink-600 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-md border-4 border-white animate-bounce font-black">
                 <IconRenderer iconName={(current as any).icon} />
               </div>
               <h4 className="text-4xl font-black text-pink-600 uppercase mb-4 tracking-tighter">{(current as any).role}</h4>
               
               <div onClick={() => onSound((current as any).fact)} className="relative w-full max-w-lg aspect-square bg-pink-50 rounded-[4rem] border-8 border-white shadow-2xl overflow-hidden mb-10 cursor-pointer group font-black">
                 {loading ? <div className="absolute inset-0 flex items-center justify-center animate-spin font-black"><Heart className="h-4 w-4 text-pink-200"/></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 transition-transform group-hover:scale-110" alt={(current as any).role} />}
                 <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/5 transition-colors flex items-center justify-center font-black">
                    <Volume2 className="text-white text-6xl opacity-0 group-hover:opacity-100 drop-shadow-lg font-black" />
                 </div>
              </div>
  
              <div className="bg-pink-50 p-8 rounded-3xl border-4 border-dashed border-pink-200 text-center w-full max-w-xl mb-10 font-black">
                 <p className="text-2xl font-black text-pink-800 italic leading-relaxed font-black font-black">"{(current as any).fact}"</p>
              </div>
  
              <div className="flex gap-4 items-center font-black">
                 <Button onClick={() => setIndex(i => (i === 0 ? communityData.length - 1 : i - 1))} variant="outline" size="icon" className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all hover:bg-slate-200 font-black"><ArrowLeft/></Button>
                 <Button onClick={() => { onSound((current as any).fact); onComplete(); }} className="px-12 py-5 bg-pink-500 text-white font-black rounded-3xl shadow-xl border-4 border-white uppercase tracking-widest text-xl font-black">Learn Role! 🌟</Button>
                 <Button onClick={() => setIndex(i => (i + 1) % communityData.length)} variant="outline" size="icon" className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all hover:bg-slate-200 font-black"><ArrowRight/></Button>
              </div>
          </div>
          )}
        </div>
        {isDrawerOpen && <TeacherModal title={`AI Social Assistant`} topicLabel={subTab === 'community' ? 'Community Helper' : 'Social Skill'} topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const PuppetTheater: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const [story, setStory] = useState('');
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    
    const generateStory = async () => {
      if (!schoolId) return;
      setLoading(true);
      const result = await generateRhyme({ topic: "Puppet Friends", schoolId });
      setStory(result.rhyme);
      await onSound(`Welcome to the Puppet Theater! ${result.rhyme}`);
      onComplete();
      setLoading(false);
    };

     if (!started) {
        return (
             <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
                <Drama className="h-16 w-16 mx-auto text-purple-300 mb-4"/>
                <h3 className="text-2xl font-bold text-purple-600 mb-2">Puppet Show</h3>
                <p className="text-slate-500 mb-4">Let's put on a fun show with puppets!</p>
                <Button onClick={() => setStarted(true)} className="bg-purple-500 hover:bg-purple-600">Start Show</Button>
            </div>
        )
    }
  
    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 flex flex-col items-center animate-in zoom-in font-black">
        <h3 className="text-4xl font-black text-purple-600 mb-10 uppercase tracking-tighter">Puppet Theater 🎭</h3>
        <div className="w-80 h-80 bg-purple-50 rounded-full border-8 border-white shadow-2xl flex items-center justify-center mb-10 relative overflow-hidden group">
           <Drama className="text-8xl text-purple-200 group-hover:scale-110 transition-transform"/>
        </div>
        <Button onClick={generateStory} disabled={loading} className="px-16 py-6 bg-purple-600 text-white rounded-[3rem] font-black uppercase text-2xl shadow-xl border-4 border-white">
          {loading ? <Loader2 className="animate-spin" /> : "Start Show!"}
        </Button>
        {story && <p className="mt-10 text-xl font-black text-slate-700 italic text-center max-w-lg">"{story}"</p>}
      </div>
    );
};
  
const CognitiveSkills: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const [subTab, setSubTab] = useState<'scenarios' | 'patterns' | 'whatIf'>('scenarios');
    const [index, setIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [started, setStarted] = useState(false);
    const data = LIFE_SKILLS_DATA.cognitive[subTab];
    const current = data[index] || data[0];
  
    useEffect(() => { setUserAnswer(null); }, [subTab, index]);
  
    const handleChoice = (idx: number) => {
      setUserAnswer(idx);
      if (idx === (current as any).correct || subTab === 'whatIf') {
        onSound(`Great thinking!`);
        onComplete();
      }
    };

    if (!started) {
        return (
             <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
                <BrainCircuit className="h-16 w-16 mx-auto text-emerald-300 mb-4"/>
                <h3 className="text-2xl font-bold text-emerald-600 mb-2">Super Solvers</h3>
                <p className="text-slate-500 mb-4">Let's solve puzzles and think about big ideas!</p>
                <Button onClick={() => setStarted(true)} className="bg-emerald-500 hover:bg-emerald-600">Start Thinking</Button>
            </div>
        )
    }
  
    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center animate-in zoom-in font-black">
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
              <button key={i} onClick={() => handleChoice(i)} className={`w-24 h-24 rounded-3xl font-black text-4xl border-4 transition-all ${userAnswer === i ? (i === (current as any).correct ? 'bg-green-500 text-white border-white scale-110' : 'bg-red-500 text-white border-white') : 'bg-emerald-50 text-emerald-600 border-white'}`}>
                <IconRenderer iconName={opt} />
              </button>
            ))}
          </div>
        )}
  
        {subTab === 'whatIf' && (
          <button onClick={() => { onSound((current as any).a); onComplete(); }} className="px-16 py-6 bg-emerald-500 text-white rounded-[3rem] font-black uppercase text-xl shadow-xl border-4 border-white">Answer Me!</button>
        )}
  
        <div className="flex gap-4 mt-12 font-black">
          <Button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} variant="outline" size="icon" className="w-14 h-14 rounded-full"><ArrowLeft/></Button>
          <Button onClick={() => setIndex(i => (i + 1) % data.length)} variant="outline" size="icon" className="w-14 h-14 rounded-full"><ArrowRight/></Button>
        </div>
      </div>
    );
};

const PhysicalHealthModule: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const [subTab, setSubTab] = useState<'grossMotor' | 'fineMotor' | 'hygiene' | 'nutrition'>('grossMotor');
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [started, setStarted] = useState(false);

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
        if (!current || !schoolId) return;
        setLoading(true);
        const result = await generateLessonImageAction({ prompt: current.prompt, schoolId });
        if (result.success) setImageUrl(result.data || null);
        setLoading(false);
    }, [current, schoolId]);

    useEffect(() => { 
        if (started) {
            fetchVisual();
        }
    }, [subTab, index, data, started, fetchVisual]);
  
    const handleAction = () => {
      onSound(`Great job! ${current.action} You are getting so strong and healthy!`);
      onComplete();
    };
  
    const generateWithAi = async () => {
      if (!aiTopic || !schoolId) return;
      setIsAiLoading(true);
      try {
        const result = await generateLifeSkillEntry({ topic: aiTopic, category: 'health', schoolId });
        if(result.success && result.data){
            const newItem = result.data;
            if (subTab === 'grossMotor') setGrossMotor(prev => [...prev, newItem]);
            else if (subTab === 'fineMotor') setFineMotor(prev => [...prev, newItem]);
            else if (subTab === 'hygiene') setHygiene(prev => [...prev, newItem]);
            else setNutrition(prev => [...prev, newItem]);

            setIsDrawerOpen(false);
            setIndex(data.length);
            setAiTopic('');
        }
      } catch (e) { console.error(e); } 
      finally { setIsAiLoading(false); }
    };
  
     if (!started) {
        return (
             <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
                <HeartPulse className="h-16 w-16 mx-auto text-green-300 mb-4"/>
                <h3 className="text-2xl font-bold text-green-600 mb-2">My Healthy Body</h3>
                <p className="text-slate-500 mb-4">Learn about eating well, moving our bodies, and staying clean!</p>
                <Button onClick={() => setStarted(true)} className="bg-green-500 hover:bg-green-600">Start Learning</Button>
            </div>
        )
    }

    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-green-200 text-green-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-green-50 transition-colors font-black"><Wand2 className="w-3 h-3 inline-block mr-1"/> AI Health Assistant</button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-green-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-top font-black">
          <h3 className="text-4xl font-black text-green-600 mb-8 uppercase tracking-tighter text-center font-black">Physical & Health Hub 🏃‍♂️</h3>
          
          <div className="flex flex-wrap justify-center gap-2 mb-10 p-2 bg-green-50 rounded-2xl font-black">
            <button onClick={() => {setSubTab('grossMotor'); setIndex(0);}} className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${subTab === 'grossMotor' ? 'bg-green-500 text-white shadow-md' : 'text-green-700'}`}>Gross Motor</button>
            <button onClick={() => {setSubTab('fineMotor'); setIndex(0);}} className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${subTab === 'fineMotor' ? 'bg-green-500 text-white shadow-md' : 'text-green-700'}`}>Fine Motor</button>
            <button onClick={() => {setSubTab('hygiene'); setIndex(0);}} className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${subTab === 'hygiene' ? 'bg-green-500 text-white shadow-md' : 'text-green-700'}`}>Hygiene</button>
            <button onClick={() => {setSubTab('nutrition'); setIndex(0);}} className={`px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${subTab === 'nutrition' ? 'bg-green-500 text-white shadow-md' : 'text-green-700'}`}>Nutrition</button>
          </div>
  
          <div className="flex flex-col items-center animate-in zoom-in w-full max-w-2xl font-black">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-md border-4 border-white animate-bounce font-black">
                 <IconRenderer iconName={current.icon} />
              </div>
              <h4 className="text-3xl font-black text-slate-800 uppercase mb-4">{current.title}</h4>
              
              <div onClick={handleAction} className="relative w-full aspect-video bg-green-50 rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden mb-10 cursor-pointer group font-black">
                 {loading ? <div className="absolute inset-0 flex items-center justify-center animate-spin font-black"><HeartPulse className="h-4 w-4 text-green-200"/></div> : imageUrl && <img src={imageUrl} className={`w-full h-full object-cover transition-all duration-700 font-black`} alt={current.title} />}
                 <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/5 transition-colors flex items-center justify-center font-black">
                    <Play className="text-white text-6xl opacity-0 group-hover:opacity-100 drop-shadow-lg font-black" />
                 </div>
              </div>
  
              <div className="bg-green-50 p-8 rounded-3xl border-4 border-dashed border-green-200 text-center w-full mb-10 font-black">
                 <p className="text-2xl font-black text-slate-700 italic leading-relaxed font-black font-black">"{current.action}"</p>
              </div>
  
              <div className="flex gap-4 items-center font-black">
                 <Button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} variant="outline" size="icon" className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all hover:bg-slate-200 font-black"><ArrowLeft/></Button>
                 <Button onClick={handleAction} className="px-12 py-5 bg-green-500 text-white font-black rounded-3xl shadow-xl border-4 border-white uppercase tracking-widest text-xl font-black">I Did It! 🏆</Button>
                 <Button onClick={() => setIndex(i => (i + 1) % data.length)} variant="outline" size="icon" className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all hover:bg-slate-200 font-black"><ArrowRight/></Button>
              </div>
          </div>
        </div>
        {isDrawerOpen && <TeacherModal title={`Add ${subTab.replace('-', ' ')}`} topicLabel="Task or Habit" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const EmotionsModule: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const [data, setData] = useState(LIFE_SKILLS_DATA.emotions);
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [mode, setMode] = useState<'learn' | 'mirror'>('learn');
    const [started, setStarted] = useState(false);
  
    const current = data[index];
  
    const fetchVisual = useCallback(async () => {
      if (!current || !schoolId) return;
      setLoading(true);
      const result = await generateLessonImageAction({ prompt: current.prompt, schoolId });
      if (result.success) setImageUrl(result.data || null);
      setLoading(false);
    }, [current, schoolId]);
  
    useEffect(() => {
        if (started) {
            fetchVisual();
        }
    }, [index, data, started, fetchVisual]);
  
    const handleLearn = () => {
      onSound(`This is feeling ${current.name.toLowerCase()}. ${current.technique}`);
      if (mode === 'mirror') onComplete();
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
  
    if (!started) {
        return (
             <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
                <Smile className="h-16 w-16 mx-auto text-yellow-300 mb-4"/>
                <h3 className="text-2xl font-bold text-yellow-600 mb-2">My Big Feelings</h3>
                <p className="text-slate-500 mb-4">Let's learn about all the different feelings we can have!</p>
                <Button onClick={() => setStarted(true)} className="bg-yellow-500 hover:bg-yellow-600">Start Feeling</Button>
            </div>
        )
    }

    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-yellow-200 text-yellow-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-yellow-50 transition-colors font-black"><Wand2 className="w-3 h-3 inline-block mr-1"/> AI Feeling Maker</button>
        <div className="w-full flex flex-col items-center bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-yellow-100 animate-in zoom-in duration-500 min-h-[550px] font-black">
          <div className="flex gap-4 mb-8 font-black">
             <button onClick={() => setMode('learn')} className={`px-6 py-2 rounded-full font-black text-xs uppercase transition-all ${mode === 'learn' ? 'bg-yellow-400 text-white shadow-md' : 'bg-slate-100 text-slate-800 font-black'}`}>Learning Mode</button>
             <button onClick={() => setMode('mirror')} className={`px-6 py-2 rounded-full font-black text-xs uppercase transition-all ${mode === 'mirror' ? 'bg-yellow-400 text-white shadow-md' : 'bg-slate-100 text-slate-800 font-black'}`}>Mirror Game</button>
          </div>
          
          <h3 className="text-4xl font-black text-yellow-600 mb-8 uppercase tracking-tighter text-center font-black">{mode === 'learn' ? 'How I Feel ✨' : 'Copy My Face! 🪞'}</h3>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10 font-black">
            {data.map((e, i) => (
              <button key={i} onClick={() => setIndex(i)} className={`w-20 h-20 rounded-3xl flex items-center justify-center border-4 transition-all shadow-lg font-black ${index === i ? `${e.color} text-white border-white scale-110 shadow-yellow-200` : 'bg-slate-50 text-slate-800 border-slate-100 hover:bg-yellow-50 font-black'}`}>
                <IconRenderer iconName={e.icon} className="text-3xl" />
              </button>
            ))}
          </div>
  
          <div onClick={handleLearn} className={`w-full max-lg aspect-square rounded-[3rem] border-8 border-white shadow-2xl flex items-center justify-center mb-10 overflow-hidden cursor-pointer group font-black ${mode === 'mirror' ? 'ring-8 ring-yellow-400 animate-pulse' : ''}`}>
            {loading ? <Loader2 className="w-16 h-16 animate-spin text-yellow-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-10 transition-transform group-hover:scale-110" alt={current.name} />}
          </div>
          <h4 className="text-6xl font-black text-yellow-600 uppercase mb-4 tracking-tighter">{current.name}</h4>
          <button onClick={handleLearn} className="px-16 py-6 bg-yellow-400 text-white rounded-[3rem] font-black uppercase text-2xl shadow-xl border-4 border-white">
            {mode === 'learn' ? 'Tell Me More!' : 'I Did It! 🌟'}
          </button>
        </div>
        {isDrawerOpen && <TeacherModal title="AI Feeling Maker" topicLabel="New Feeling" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

const LifeSkillsZone: React.FC = () => {
    const { schoolId } = useCurrentSchool();
    const [activeTab, setActiveTab] = useState<LifeSkillTab>('emotions');
    const [playing, setPlaying] = useState(false);
    const [stars, setStars] = useState(0);
    const currentSourceRef = useRef<HTMLAudioElement | null>(null);

    const playFeedbackSound = async (text: string) => {
      if (!text || !schoolId) return;
      if (currentSourceRef.current) {
        try { currentSourceRef.current.pause(); } catch (e) {}
      }
      setPlaying(true);
      const result = await generateTTSAction({ text, voice: 'Kore', schoolId });
      if (result.success && result.data && typeof window !== 'undefined') {
        const audio = new Audio(`data:audio/wav;base64,${result.data}`);
        currentSourceRef.current = audio;
        audio.play();
        audio.onended = () => setPlaying(false);
      } else { setPlaying(false); }
    };

    const addStar = () => { setStars(prev => prev + 1); };

    const tabs: {id: LifeSkillTab, label: string, icon: React.ElementType, color: string}[] = [
        { id: 'physical-health', label: 'Physical & Health', icon: HeartPulse, color: 'bg-green-500' },
        { id: 'emotions', label: 'Feelings', icon: Smile, color: 'bg-yellow-500' },
        { id: 'routine-songs', label: 'Skill Songs', icon: Music, color: 'bg-pink-500' },
        { id: 'modeling', label: 'Modeling', icon: Tv, color: 'bg-indigo-500' },
        { id: 'practical-life', label: 'Play & Routines', icon: GraduationCap, color: 'bg-blue-500' },
        { id: 'communication', label: 'Talk & Listen', icon: MessageSquare, color: 'bg-orange-500' },
        { id: 'social', label: 'Social & Kind', icon: Users, color: 'bg-rose-500' },
        { id: 'puppet-theater', label: 'Puppet Show', icon: Drama, color: 'bg-purple-500' },
        { id: 'cognitive', label: 'Super Solver', icon: Brain, color: 'bg-emerald-500' }
    ];
    
    const renderModule = () => {
        if (!schoolId) return <div className="text-center p-8"><Loader2 className="animate-spin"/></div>;
        switch (activeTab) {
          case 'emotions': return <EmotionsModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
          case 'routine-songs': return <RoutineSongsModule onSound={playFeedbackSound} schoolId={schoolId}/>;
          case 'modeling': return <ModelingModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
          case 'practical-life': return <PracticalLifeModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
          case 'communication': return <CommunicationModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
          case 'social': return <SocialScenarios onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
          case 'puppet-theater': return <PuppetTheater onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
          case 'cognitive': return <CognitiveSkills onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
          case 'physical-health': return <PhysicalHealthModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId} />;
          default: return null;
        }
    };
  
    return (
      <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500 font-black">
        <div className="w-full flex justify-between items-center px-6">
          <div className="text-left">
            <h2 className="text-5xl font-black text-teal-600 uppercase tracking-tighter">Life Skills Hub 🌟</h2>
            <p className="text-slate-800 font-black italic">Social, Emotional & Independence!</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-3xl shadow-xl border-4 border-yellow-100">
             <Star className="h-8 w-8 text-yellow-400 fill-current" />
             <span className="text-3xl font-black text-slate-800">{stars}</span>
          </div>
        </div>
        <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4 font-black">
          <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-teal-50 min-w-max font-black">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-w-[120px] px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 ${
                    activeTab === tab.id ? `${tab.color} text-white shadow-xl scale-110 -translate-y-1` : 'text-slate-800 hover:bg-teal-50 font-black'
                  }`}
                >
                  <Icon className={`w-5 h-5`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="w-full px-4 font-black">
          {renderModule()}
        </div>
      </div>
    );
};
export default LifeSkillsZone;

    