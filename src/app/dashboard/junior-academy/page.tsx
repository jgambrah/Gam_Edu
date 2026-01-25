

'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where, setDoc, increment, getDocs } from 'firebase/firestore';
import * as LucideIcons from 'lucide-react';

import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Label } from '@/components/ui/label';
import MathPlayground from './math-playground';
import JuniorScienceWorld from './science-world';
import ArtStudio from './art-studio';
import StickerBook from './sticker-book';
import PhonicsWorld from './phonics-world';
import type { DictionaryWord, LessonCard } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { getAuth } from 'firebase/auth';
import LifeSkillsZone from './life-skills-zone';
import WritingCanvas from './writing-canvas'; 
import * as constants from '@/lib/constants';

// Bring in StorySpark, but not VoiceCoach
import { StorySpark } from './voice-coach';

const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const iconMap: Record<string, keyof typeof LucideIcons> = {
      'fa-spell-check': 'Languages',
      'fa-ear-listen': 'Ear',
      'fa-pen-nib': 'Pen',
      'fa-arrow-1-9': 'Calculator',
      'fa-hand-holding-heart': 'Handshake',
      'fa-flask-vial': 'Beaker',
      'fa-palette': 'Palette',
      'fa-robot': 'BotMessageSquare',
      'fa-face-smile': 'Smile',
      'fa-tooth': 'Sparkles',
      'fa-heart-pulse': 'HeartPulse',
      'fa-vest': 'User',
      'fa-sun': 'Sun',
      'fa-utensils': 'Utensils',
      'fa-school': 'School',
      'fa-house': 'Home',
      'fa-recycle': 'Recycle',
      'fa-water': 'Droplets',
      'fa-broom': 'Trash2',
      'fa-flag': 'Flag',
      'fa-hand-pointer': 'MousePointer2',
      'fa-cube': 'Box',
      'fa-chalkboard-user': 'User',
      'fa-rabbit': 'Rabbit',
      'fa-carrot': 'Carrot',
      'fa-apple-whole': 'Apple',
      'fa-cookie': 'Cookie',
      'fa-star': 'Star',
      'fa-tv': 'Tv',
      'fa-bed': 'Bed',
      'fa-eye': 'Eye',
      'fa-cloud-showers-heavy': 'CloudRain',
      'fa-guitar': 'Guitar',
      'fa-plane': 'Plane',
      'fa-car': 'Car',
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
      'fa-brain': 'Brain',
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
  
    const lucideIconName = iconMap[iconName] || 'HelpCircle';
    const IconComponent = (LucideIcons as any)[lucideIconName];
  
    if (!IconComponent || typeof IconComponent !== 'function') {
      console.error('❌ Missing or invalid icon:', lucideIconName, 'for FA icon:', iconName);
      const FallbackIcon = (LucideIcons as any)['HelpCircle'];
      return <FallbackIcon className={className} />;
    }
  
    return <IconComponent className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} />;
};

const juniorStyles = {
    storybook: "bg-[#FFFDE7] border-y-8 border-x-4 border-orange-200 rounded-[60px] p-8 shadow-[0_15px_0_#FFE082]",
    storyText: "text-3xl font-bold text-orange-900 leading-relaxed font-serif",
    
    questCard: "bg-gradient-to-b from-sky-400 to-blue-500 border-b-[12px] border-blue-700 rounded-[50px] text-white",
    stepBubble: "w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl shadow-lg border-4 border-blue-200",
    
    card: "rounded-[60px] border-8 border-yellow-200 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100",
    header: "p-10 text-center",
    mathBox: "bg-sky-100 p-10 rounded-[50px] border-4 border-dashed border-sky-300 shadow-inner",
    
    button: "h-24 px-12 bg-gradient-to-t from-pink-600 to-pink-400 hover:scale-105 text-3xl font-black text-white rounded-[40px] shadow-[0_12px_0_#9d174d] active:translate-y-2 active:shadow-none transition-all",
    input: "h-28 text-7xl font-black text-center border-8 border-yellow-300 rounded-[40px] bg-white text-pink-500 shadow-inner"
};


// --- MAIN PAGE ---
export default function JuniorCampusPage() {
    const { role } = useRole();
    const { schoolId } = useCurrentSchool();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    
    return (
        <div className="min-h-screen bg-[#FFFBEB] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-[45px] shadow-xl border-b-[12px] border-yellow-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-400 p-5 rounded-[30px] shadow-inner rotate-3"><LucideIcons.Rabbit className="h-12 w-12 text-white" /></div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-800 tracking-tighter">Junior Campus</h1>
                            <p className="text-xl font-bold text-pink-500 uppercase tracking-widest italic">The Magic of Learning! ✨</p>
                        </div>
                    </div>
                    {schoolId && <div className="flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-[20px] border-2 border-slate-100">
                        <Badge variant="outline" className="text-indigo-500 border-indigo-200">SaaS Node</Badge>
                        <span className="text-xs font-black text-slate-400">{schoolId}</span>
                    </div>}
                </header>

                <Tabs defaultValue="stories" className="w-full">
                    <TabsList className="grid w-full grid-cols-8 h-24 bg-white p-2 rounded-[30px] shadow-xl border-2 border-yellow-100 mb-10 overflow-x-auto no-scrollbar">
                        <TabsTrigger value="lifeskills" className="rounded-2xl data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 font-black flex flex-col items-center gap-1"><LucideIcons.Heart className="w-5 h-5"/> Life Skills</TabsTrigger>
                        <TabsTrigger value="writing" className="rounded-2xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-black flex flex-col items-center gap-1"><LucideIcons.Pencil className="w-5 h-5"/> Writing</TabsTrigger>
                        <TabsTrigger value="stories" className="rounded-2xl data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-black flex flex-col items-center gap-1"><LucideIcons.BookOpen className="w-5 h-5"/> Stories</TabsTrigger>
                        <TabsTrigger value="phonics" className="rounded-2xl data-[state=active]:bg-red-100 data-[state=active]:text-red-700 font-black flex flex-col items-center gap-1"><LucideIcons.Ear className="w-5 h-5"/> Phonics</TabsTrigger>
                        <TabsTrigger value="math" className="rounded-2xl data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-black flex flex-col items-center gap-1"><LucideIcons.Calculator className="w-5 h-5"/> Math</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-2xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black flex flex-col items-center gap-1"><LucideIcons.Atom className="w-5 h-5"/> Science</TabsTrigger>
                        <TabsTrigger value="art" className="rounded-2xl data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-black flex flex-col items-center gap-1"><LucideIcons.Palette className="w-5 h-5"/> Art</TabsTrigger>
                        <TabsTrigger value="rewards" className="rounded-2xl data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 font-black flex flex-col items-center gap-1"><LucideIcons.Trophy className="w-5 h-5"/> Rewards</TabsTrigger>
                    </TabsList>

                    <div className="min-h-[700px] animate-in slide-in-from-bottom-10 duration-1000">
                        <TabsContent value="lifeskills" className="mt-0">{schoolId && <LifeSkillsZone />}</TabsContent>
                        <TabsContent value="writing" className="mt-0">{schoolId && <WritingCanvas onSound={() => {}} schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="stories" className="mt-0">{schoolId && <StorySpark canEdit={canEdit} schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="phonics" className="mt-0">{schoolId && <PhonicsWorld schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="math" className="mt-0">{schoolId && <MathPlayground schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="science" className="mt-0">{schoolId && <JuniorScienceWorld schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="art" className="mt-0"><div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300">{schoolId && <ArtStudio schoolId={schoolId} />}</div></TabsContent>
                        <TabsContent value="rewards" className="mt-0">{schoolId && <StickerBook schoolId={schoolId} />}</TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
