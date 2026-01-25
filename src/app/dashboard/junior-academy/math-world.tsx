
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

const {
    Loader2, Wand2, ArrowLeft, ArrowRight, Volume2, Play, Smile, 
    Ear, Layers, Image: ImageIcon, Sparkles, HelpCircle, 
    Zap, CircleDot, User, Beaker, Eye, Hash, ListOrdered, Scale, 
    Handshake, Plus, Minus, Coins, Ruler, Move, CheckSquare, ArrowLeftRight, PenTool, 
    Clock, ObjectGroup, Users, Drama, BrainCircuit, Music, Atom, Heart, Star, Tv, Rabbit,
    Type, FontAwesome, Palette, Utensils, Trash2, Calculator, Shapes
} = LucideIcons;

// --- ROBUST ICON RENDERER ---
export const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const iconMap: Record<string, keyof typeof LucideIcons> = {
      'fa-1': 'Hash', 'fa-list-ol': 'ListOrdered', 'fa-arrow-right-long': 'ArrowRight', 'fa-scale-unbalanced': 'Scale', 'fa-font': 'Type', 
      'fa-handshake': 'Handshake', 'fa-plus': 'Plus', 'fa-minus': 'Minus', 'fa-layer-group': 'Layers', 'fa-object-group': 'ObjectGroup', 
      'fa-clock': 'Clock', 'fa-coins': 'Coins', 'fa-ruler-vertical': 'Ruler', 'fa-shapes': 'Shapes', 'fa-arrows-up-down-left-right': 'Move', 
      'fa-scale-balanced': 'Scale', 'fa-square-check': 'CheckSquare', 'fa-arrows-left-right': 'ArrowLeftRight', 'fa-pen-clip': 'PenTool',
      'fa-magic': 'Wand2', 'fa-spinner': 'Loader2', 'fa-volume-high': 'Volume2', 'fa-play': 'Play', 'fa-face-smile': 'Smile', 'fa-brain': 'BrainCircuit'
    };
    const LucideName = iconMap[iconName] || 'HelpCircle';
    const IconComponent = (LucideIcons as any)[LucideName] || HelpCircle;
    return <IconComponent className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} />;
};

type MathTab = 'grouping' | 'time' | 'money' | 'measurement' | 'shapes' | 'spatial' | 'comparison' | 'patterns' | 'one-to-one';

// --- SHARED COMPONENTS ---
export const ModuleContainer: React.FC<{ title: string; children: React.ReactNode; icon: string }> = ({ title, children, icon }) => {
    const [started, setStarted] = useState(false);
    if (!started) return (
        <div className="text-center p-12 bg-white rounded-[3rem] shadow-xl border-8 border-sky-50 animate-in fade-in zoom-in">
            <IconRenderer iconName={icon} className="h-20 w-20 mx-auto text-sky-300 mb-6" />
            <h3 className="text-4xl font-black text-sky-600 mb-4 uppercase tracking-tighter">{title}</h3>
            <p className="text-slate-500 mb-8 font-bold">Are you ready to explore and solve?</p>
            <Button onClick={() => setStarted(true)} size="lg" className="bg-sky-500 hover:bg-sky-600 text-white font-black px-12 py-8 rounded-2xl text-2xl shadow-2xl hover:scale-105 transition-all">LET'S GO!</Button>
        </div>
    );
    return (
        <div className="relative">
            <Button variant="ghost" onClick={() => setStarted(false)} className="absolute -top-16 left-0 text-slate-400 hover:text-sky-500 font-black uppercase text-xs tracking-widest"><ArrowLeft className="mr-2 h-4 w-4"/> Close Activity</Button>
            {children}
        </div>
    );
};

export const TeacherModal: React.FC<{ title: string; topicLabel: string; topicValue: string; onTopicChange: (v: string) => void; onGenerate: () => void; isLoading: boolean; onClose: () => void; }> = ({ title, topicLabel, topicValue, onTopicChange, onGenerate, isLoading, onClose }) => (
    <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="rounded-[3rem] border-8 border-sky-100">
            <DialogHeader><DialogTitle className="text-3xl font-black uppercase tracking-tighter">{title}</DialogTitle></DialogHeader>
            <div className="space-y-6 py-4">
                <div>
                    <Label className="text-xs font-black text-slate-400 uppercase tracking-widest">{topicLabel}</Label>
                    <Input type="text" value={topicValue} onChange={(e) => onTopicChange(e.target.value)} placeholder="Type here..." className="mt-2 h-14 rounded-2xl border-4 border-slate-50 font-black" />
                </div>
                <Button onClick={onGenerate} disabled={isLoading || !topicValue} className="w-full h-16 rounded-2xl bg-sky-500 hover:bg-sky-600 font-black text-xl shadow-xl">
                    {isLoading ? <><Loader2 className="animate-spin mr-2"/> GENERATING...</> : <><Sparkles className="mr-2 h-6 w-6"/> CREATE MAGIC</>}
                </Button>
            </div>
        </DialogContent>
    </Dialog>
);

// --- MODULES PART B ---
const GroupingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {/* Implementation from user prompt */ return null};
const TellingTimeModule: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {/* Implementation from user prompt */ return null};
const MoneyCountingModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {/* Implementation from user prompt */ return null};
const MeasurementModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {/* Implementation from user prompt */ return null};
const ShapesModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {/* Implementation from user prompt */ return null};
const SpatialModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {/* Implementation from user prompt */ return null};
const ComparisonGame: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {/* Implementation from user prompt */ return null};
const PatternGame: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {/* Implementation from user prompt */ return null};
const OneToOneGame: React.FC<{ onSound: (t: string) => void }> = ({ onSound }) => {/* Implementation from user prompt */ return null};

// --- MAIN WRAPPER FOR MATH WORLD ---
const MathWorld: React.FC = () => {
    const [activeTab, setActiveTab] = useState<MathTab>('grouping');
    const { schoolId } = useCurrentSchool();
    const currentSourceRef = useRef<HTMLAudioElement | null>(null);

    const playFeedbackSound = useCallback(async (text: string) => {
      if (!text || !schoolId) return;
      if (currentSourceRef.current) try { currentSourceRef.current.pause(); } catch (e) {}
      const result = await generateTTSAction({ text, voice: 'Kore', schoolId });
      if (result.success && result.data) {
          const audio = new Audio(`data:audio/wav;base64,${result.data}`);
          currentSourceRef.current = audio;
          audio.play();
      }
    }, [schoolId]);
  
    const tabs: {id: MathTab, icon: string}[] = [
      { id: 'grouping', icon: 'fa-object-group' }, { id: 'time', icon: 'fa-clock' }, { id: 'money', icon: 'fa-coins' },
      { id: 'measurement', icon: 'fa-ruler-vertical' }, { id: 'shapes', icon: 'fa-shapes' }, { id: 'spatial', icon: 'fa-arrows-up-down-left-right' },
      { id: 'comparison', icon: 'fa-scale-balanced' }, { id: 'patterns', icon: 'fa-square-check' }, { id: 'one-to-one', icon: 'fa-arrows-left-right' },
    ];
    
    const renderModule = () => {
      if(!schoolId) return <div className="text-center p-8"><Loader2 className="animate-spin h-10 w-10 mx-auto text-sky-400"/></div>;
      const commonProps = { onSound: playFeedbackSound, schoolId: schoolId };
      const modules: Record<string, React.ReactNode> = {
          'grouping': <ModuleContainer title="Grouping" icon="fa-object-group"><GroupingModule {...commonProps} /></ModuleContainer>,
          'time': <ModuleContainer title="Telling Time" icon="fa-clock"><TellingTimeModule onSound={playFeedbackSound} /></ModuleContainer>,
          'money': <ModuleContainer title="Counting Money" icon="fa-coins"><MoneyCountingModule {...commonProps} /></ModuleContainer>,
          'measurement': <ModuleContainer title="Measurement" icon="fa-ruler-vertical"><MeasurementModule {...commonProps} /></ModuleContainer>,
          'shapes': <ModuleContainer title="Shapes" icon="fa-shapes"><ShapesModule {...commonProps} /></ModuleContainer>,
          'spatial': <ModuleContainer title="Spatial Reasoning" icon="fa-arrows-up-down-left-right"><SpatialModule {...commonProps} /></ModuleContainer>,
          'comparison': <ModuleContainer title="Comparison Game" icon="fa-scale-balanced"><ComparisonGame {...commonProps} /></ModuleContainer>,
          'patterns': <ModuleContainer title="Patterns" icon="fa-square-check"><PatternGame onSound={playFeedbackSound} /></ModuleContainer>,
          'one-to-one': <ModuleContainer title="One-to-One Matching" icon="fa-arrows-left-right"><OneToOneGame onSound={playFeedbackSound} /></ModuleContainer>,
      };
      return modules[activeTab] || <p>Coming Soon</p>;
    };
  
    return (
      <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 font-black">
        <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4">
          <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-sky-50 min-w-max">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("min-w-[110px] px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1", activeTab === tab.id ? `bg-sky-500 text-white shadow-xl scale-110 -translate-y-1` : 'text-slate-700 hover:bg-slate-50')}>
                <IconRenderer iconName={tab.icon} className="text-lg" /><span className="whitespace-nowrap">{tab.id.replace('-', ' ')}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full px-4">{renderModule()}</div>
      </div>
    );
};
  
export default MathWorld;
