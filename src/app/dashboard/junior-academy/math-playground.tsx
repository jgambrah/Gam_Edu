
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as constants from '@/lib/constants';
import { generateLessonImageAction, generateTTSAction, generateMathWorldEntry } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { 
  Loader2, Wand2, ArrowLeft, ArrowRight, Volume2, Play, Smile, CaseSensitive, 
  BookOpen, Ear, Layers, Repeat, Mic, Underline, Signpost, Image as ImageIcon, 
  Hand, Gamepad2, CheckCircle2, XCircle, PlusCircle, Sparkles, FolderOpen, Car, Earth, 
  HeartPulse, CloudSun, PawPrint, Shapes, Languages, Pen, Apple, Sun, 
  CloudRain, Guitar, Plane, MousePointer2, Cube, Carrot, Cookie, School, Home, 
  Recycle, Water, Droplets, HelpCircle, MessageSquare, Drama, Flag, GraduationCap, 
  Monitor, Zap, CircleDot, User, Beaker, Bed, Eye, Hash, ListOrdered, Scale, Handshake,
  Plus, Minus, Coins, Ruler, Move, CheckSquare, ArrowLeftRight, PenTool
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const iconMap: Record<string, keyof typeof LucideIcons> = {
      'fa-1': 'Hash', 'fa-list-ol': 'ListOrdered', 'fa-scale-unbalanced': 'Scale', 'fa-handshake': 'Handshake', 'fa-plus': 'Plus', 'fa-minus': 'Minus', 'fa-coins': 'Coins', 'fa-ruler-vertical': 'Ruler', 'fa-shapes': 'Shapes', 'fa-arrows-up-down-left-right': 'Move', 'fa-scale-balanced': 'Scale', 'fa-square-check': 'CheckSquare', 'fa-arrows-left-right': 'ArrowLeftRight', 'fa-pen-clip': 'PenTool',
      'fa-spell-check': 'Languages', 'fa-ear-listen': 'Ear', 'fa-pen-nib': 'Pen', 'fa-arrow-1-9': 'Calculator', 'fa-hand-holding-heart': 'Handshake', 'fa-flask-vial': 'Beaker', 'fa-palette': 'Palette', 'fa-robot': 'BotMessageSquare', 'fa-face-smile': 'Smile', 'fa-tooth': 'Sparkles', 'fa-heart-pulse': 'HeartPulse', 'fa-vest': 'User', 'fa-sun': 'Sun', 'fa-utensils': 'Utensils', 'fa-school': 'School', 'fa-house': 'Home', 'fa-recycle': 'Recycle', 'fa-water': 'Droplets', 'fa-broom': 'Trash2', 'fa-flag': 'Flag', 'fa-hand-pointer': 'MousePointer2', 'fa-cube': 'Cube', 'fa-chalkboard-user': 'User', 'fa-rabbit': 'Rabbit', 'fa-carrot': 'Carrot', 'fa-apple-whole': 'Apple', 'fa-cookie': 'Cookie', 'fa-star': 'Star', 'fa-tv': 'Tv', 'fa-bed': 'Bed', 'fa-eye': 'Eye', 'fa-cloud-showers-heavy': 'CloudRain', 'fa-guitar': 'Guitar', 'fa-plane': 'Plane', 'fa-car': 'Car', 'fa-frog': 'Rabbit', 'fa-bolt': 'Zap', 'fa-circle-dot': 'CircleDot', 'fa-soap': 'Sparkles', 'fa-broccoli': 'Carrot', 'fa-display': 'Monitor', 'fa-graduation-cap': 'GraduationCap', 'fa-comments': 'MessageSquare', 'fa-people-group': 'Users', 'fa-masks-theater': 'Drama', 'fa-brain': 'Brain', 'fa-child-reaching': 'User', 'fa-music': 'Music', 'fa-magic': 'Wand2', 'fa-arrow-left': 'ArrowLeft', 'fa-arrow-right': 'ArrowRight', 'fa-spinner': 'Loader2', 'fa-volume-high': 'Volume2', 'fa-dna': 'Atom', 'fa-play': 'Play', 'fa-heart': 'Heart', 'fa-face-smile-wink': 'Smile'
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
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-6 py-4">
        <div>
          <Label>{topicLabel}</Label>
          <Input 
            type="text" 
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

const NumeracyZone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MathTab>('numbers');
  const [playing, setPlaying] = useState(false);
  const { schoolId } = useCurrentSchool();
  const currentSourceRef = useRef<HTMLAudioElement | null>(null);

  const onSound = useCallback(async (text: string) => {
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
    if(!schoolId) return <div className="text-center p-8"><Loader2 className="animate-spin" /></div>;
    const commonProps = { onSound, schoolId };
    
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


const NumbersMainModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [data, setData] = useState(constants.NUMERACY_DATA.numbers);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
  
    const current = data[index];
    const fetchVisual = useCallback(async () => { setLoading(true); const url = await generateLessonImageAction({prompt: current.prompt, schoolId}); setImageUrl(url.data || null); setLoading(false); }, [current, schoolId]);
    useEffect(() => { fetchVisual(); }, [index, data, fetchVisual]);
    const handleLearn = () => onSound(`This is number ${current.value}. Let's count!`);
  
    const generateWithAi = async () => {
      if (!aiTopic) return; setIsAiLoading(true);
      try {
        const result = await generateMathWorldEntry(aiTopic, 'numbers', schoolId);
        if(result.success && result.data) {
          setData(prev => prev.map((item, i) => i === index ? { ...item, ...result.data } : item));
          setIsDrawerOpen(false); setAiTopic('');
        }
      } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
    };
  
    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-purple-200 text-purple-500 px-4 py-2 rounded-full font-bold shadow-sm uppercase tracking-widest z-10 hover:bg-purple-50 transition-colors font-black"><Wand2 className="h-4 w-4 mr-1 inline-block"/> Custom Theme</button>
        <div className="w-full flex flex-col items-center bg-white p-10 rounded-[4rem] shadow-2xl border-8 border-purple-100 animate-in zoom-in duration-500 min-h-[550px]">
          <h2 className="text-9xl font-black text-purple-600 mb-2 drop-shadow-xl">{current.value}</h2>
          <p className="text-3xl font-black text-slate-500 italic mb-10">{current.word || current.value}</p>
          <div onClick={handleLearn} className="w-80 h-80 bg-purple-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
            {loading ? <Loader2 className="w-16 h-16 animate-spin text-purple-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={`Number ${current.value}`} />}
          </div>
          <div className="flex gap-6 font-black"><button onClick={() => setIndex(p => (p === 0 ? data.length - 1 : p - 1))} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 shadow-md font-black"><ArrowLeft className="text-2xl" /></button><button onClick={handleLearn} className="px-10 py-3 bg-purple-500 text-white font-black rounded-2xl shadow-xl uppercase border-4 border-white hover:scale-105 transition-all font-black">TEACH ME!</button><button onClick={() => setIndex(p => (p + 1) % data.length)} className="w-16 h-16 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 active:scale-90 shadow-md font-black"><ArrowRight className="text-2xl" /></button></div>
        </div>
        {isDrawerOpen && <TeacherModal title="Change Number Theme" topicLabel="New Topic (e.g. Blue Cats)" topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};

// Other modules will be implemented similarly...
const CountingGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Counting Game Coming Soon</p>;
const NumberSequenceModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Number Sequence Coming Soon</p>;
const NumberComparisonModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Number Comparison Coming Soon</p>;
const NumberWordsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Number Words Coming Soon</p>;
const NumberBondsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Number Bonds Coming Soon</p>;
const AdditionModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Addition Coming Soon</p>;
const SubtractionModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Subtraction Coming Soon</p>;
const TensUnitsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Tens and Units Coming Soon</p>;
const GroupingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Grouping Coming Soon</p>;
const TellingTimeModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Telling Time Coming Soon</p>;
const MoneyCountingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Money Counting Coming Soon</p>;
const MeasurementModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Measurement Coming Soon</p>;
const ShapesModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Shapes Coming Soon</p>;
const ComparisonGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Comparison Game Coming Soon</p>;
const PatternGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Pattern Game Coming Soon</p>;
const OneToOneGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>One-to-One Game Coming Soon</p>;
const NumberMagicPen: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => <p>Number Tracing Coming Soon</p>;

export default NumeracyZone;
