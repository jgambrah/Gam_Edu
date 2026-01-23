'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, 
  Trophy, Gift, Check, CheckCircle2, XCircle, PenTool, Eraser, Database, 
  Pencil, Pen, Heart, Utensils, Smile, Tv, Users, BrainCircuit, Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateTTSAction, generateLessonImageAction } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { StorySpark, VoiceCoach } from './voice-coach';
import MathPlayground from './math-playground';
import JuniorScienceWorld from './science-world';
import ArtStudio from './art-studio';
import StickerBook from './sticker-book';

// --- JUNIOR STYLES ---
const juniorStyles = {
    card: "rounded-[40px] border-8 border-yellow-200 shadow-[0_15px_0_#FEF9C3] bg-white overflow-hidden",
    header: "bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400 p-8 text-white",
    bubble: "bg-white/80 backdrop-blur-md p-6 rounded-[40px] border-4 border-dashed border-pink-200 shadow-inner",
    btnPrimary: "h-16 px-8 bg-pink-500 hover:bg-pink-600 text-white font-black rounded-3xl shadow-[0_8px_0_#be185d] active:translate-y-1 active:shadow-none transition-all",
};

// --- SUB-COMPONENT: LIFE SKILLS HUB ---
type LifeSkillTab = 'emotions' | 'routine-songs' | 'modeling' | 'practical-life' | 'communication' | 'social' | 'puppet-theater' | 'cognitive' | 'physical-health';

function LifeSkillsZone({ schoolId }: { schoolId: string }) {
  const [activeTab, setActiveTab] = useState<LifeSkillTab>('emotions');
  const [stars, setStars] = useState(0);

  const onSound = async (text: string) => {
    if (!text || !schoolId) return;
    const result = await generateTTSAction({ text, voice: 'Puck', schoolId });
    if (result.success && result.data) {
        const audio = new Audio(`data:audio/wav;base64,${result.data}`);
        audio.play();
    }
  };

  const addStar = () => {
    confetti({ particleCount: 100, spread: 70 });
    setStars(prev => prev + 1);
  };

  const tabs: {id: LifeSkillTab, label: string, icon: any, color: string}[] = [
    { id: 'physical-health', label: 'Health', icon: Activity, color: 'bg-green-500' },
    { id: 'emotions', label: 'Feelings', icon: Smile, color: 'bg-yellow-500' },
    { id: 'routine-songs', label: 'Songs', icon: Music, color: 'bg-pink-500' },
    { id: 'modeling', label: 'Watch', icon: Tv, color: 'bg-indigo-500' },
    { id: 'practical-life', label: 'Routine', icon: Check, color: 'bg-blue-500' },
    { id: 'communication', label: 'Talk', icon: Mic, color: 'bg-orange-500' },
    { id: 'social', label: 'Kindness', icon: Heart, color: 'bg-rose-500' },
    { id: 'puppet-theater', label: 'Puppets', icon: Star, color: 'bg-purple-500' },
    { id: 'cognitive', label: 'Solver', icon: Brain, color: 'bg-emerald-500' }
  ];

  return (
    <div className="flex flex-col items-center max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 font-black">
      <div className="w-full flex justify-between items-center px-6">
        <div>
          <h2 className="text-4xl font-black text-teal-600 uppercase tracking-tighter">Life Skills Hub 🌟</h2>
          <p className="text-slate-500 font-bold italic">Social, Emotional & Independence!</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-3xl shadow-xl border-4 border-yellow-100">
           <Star className="w-8 h-8 text-yellow-400 animate-pulse fill-current" />
           <span className="text-3xl font-black text-slate-800">{stars}</span>
        </div>
      </div>

      <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4">
        <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-teal-50 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-w-[120px] px-6 py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-2 border-4 ${
                  activeTab === tab.id 
                  ? `${tab.color} text-white shadow-xl scale-110 -translate-y-1` 
                  : 'bg-white text-slate-400 border-transparent hover:bg-teal-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full px-4">
        <LifeSkillsModule tab={activeTab} schoolId={schoolId} onSound={onSound} onComplete={addStar} />
      </div>
    </div>
  );
}

// --- DYNAMIC LIFE SKILLS MODULE ENGINE ---
function LifeSkillsModule({ tab, schoolId, onSound, onComplete }: { tab: LifeSkillTab, schoolId: string, onSound: (t: string) => void, onComplete: () => void }) {
    const firestore = useFirestore();
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // SaaS Query for specific skill category
    const dataQuery = useMemoFirebase(() => 
        firestore ? query(
            collection(firestore, 'junior_lifeskills_world'), 
            where('schoolId', '==', schoolId),
            where('category', '==', tab),
            orderBy('createdAt', 'asc')
        ) : null, [firestore, schoolId, tab]);
    
    const { data: items } = useCollection<any>(dataQuery);
    const current = items?.[index];

    const loadVisual = useCallback(async () => {
        if (!current || !schoolId) return;
        setIsLoading(true);
        setImageUrl(null);
        const result = await generateLessonImageAction({
            prompt: current.imagePrompt || `Nursery 3D illustration of ${current.title}`,
            schoolId
        });
        if (result.success && result.data) {
            setImageUrl(result.data);
        }
        setIsLoading(false);
    }, [current, schoolId]);

    useEffect(() => {
        if (current) {
            loadVisual();
        }
    }, [current, loadVisual]);

    return (
        <div className="animate-in zoom-in duration-500">
            {current ? (
                <Card className={juniorStyles.card}>
                    <div className={juniorStyles.header}>
                        <div className="text-center space-y-2">
                             <Badge className="bg-white/20 text-white border-none uppercase px-4">{tab.replace('-', ' ')}</Badge>
                             <CardTitle className="text-5xl font-black uppercase tracking-tighter">{current.title}</CardTitle>
                        </div>
                    </div>
                    <CardContent className="p-12 flex flex-col md:flex-row gap-12 items-center">
                        <div onClick={() => onSound(current.description)} className="relative aspect-square w-full max-w-md bg-teal-50 rounded-[4rem] border-8 border-white shadow-2xl overflow-hidden cursor-pointer group">
                             {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-teal-400 w-12 h-12" /></div>
                             ) : imageUrl && (
                                <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="Skill Visual" />
                             )}
                             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                <Volume2 className="text-white w-20 h-20 opacity-0 group-hover:opacity-100 drop-shadow-xl" />
                             </div>
                        </div>
                        <div className="flex-1 space-y-8">
                             <div className={juniorStyles.bubble}>
                                <p className="text-3xl font-bold text-slate-700 leading-relaxed italic">"{current.description}"</p>
                             </div>
                             <Button onClick={() => { onSound(current.description); onComplete(); }} className={juniorStyles.btnPrimary + " w-full h-20 text-2xl"}>
                                I LEARNED THIS! 🌟
                             </Button>
                             <div className="flex gap-4 justify-center">
                                <button onClick={() => setIndex(i => Math.max(0, i - 1))} className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"><ArrowRight className="rotate-180" /></button>
                                <button onClick={() => items && items.length > 0 && setIndex(i => (i + 1) % items.length)} className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"><ArrowRight /></button>
                             </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="py-40 text-center bg-white rounded-[60px] border-8 border-dashed border-teal-100">
                    <Heart className="w-20 h-20 text-teal-100 mx-auto mb-4 animate-pulse" />
                    <p className="text-teal-200 font-black text-2xl uppercase tracking-widest">Skill Hub Awaiting Content...</p>
                </div>
            )}
        </div>
    );
}

// --- MAIN CAMPUS PAGE ---
export default function JuniorCampusPage() {
    const { role } = useRole();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
    
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');

    if (isLoadingSchool) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin h-8 w-8 text-slate-300"/>
                <p className="ml-4 text-slate-500">Loading school data...</p>
            </div>
        )
    }

    if (!schoolId) {
        return (
            <div className="p-8 text-center bg-red-50 border border-red-200 rounded-lg">
                <h2 className="text-xl font-bold text-red-700">Account Configuration Error</h2>
                <p className="text-red-600">Your account is not linked to a valid school ID.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFBEB] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-[45px] shadow-xl border-b-[12px] border-yellow-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-400 p-5 rounded-[30px] shadow-inner rotate-3"><Rabbit className="h-12 w-12 text-white" /></div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-800 tracking-tighter">Junior Campus</h1>
                            <p className="text-xl font-bold text-pink-500 uppercase tracking-widest italic">Play, Learn & Grow! ✨</p>
                        </div>
                    </div>
                </header>

                <Tabs defaultValue="stories" className="w-full">
                    <TabsList className="grid w-full grid-cols-8 h-24 bg-white p-2 rounded-[30px] shadow-xl border-2 border-yellow-100 mb-10 overflow-x-auto no-scrollbar">
                        <TabsTrigger value="lifeskills" className="rounded-2xl data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 font-black flex flex-col items-center gap-1"><Heart className="w-5 h-5"/> Life Skills</TabsTrigger>
                        <TabsTrigger value="stories" className="rounded-2xl data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-black flex flex-col items-center gap-1"><BookOpen className="w-5 h-5"/> Stories</TabsTrigger>
                        <TabsTrigger value="writing" className="rounded-2xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-black flex flex-col items-center gap-1"><Pen className="w-5 h-5"/> Writing</TabsTrigger>
                        <TabsTrigger value="math" className="rounded-2xl data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-black flex flex-col items-center gap-1"><Calculator className="w-5 h-5"/> Math</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-2xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black flex flex-col items-center gap-1"><Atom className="w-5 h-5"/> Science</TabsTrigger>
                        <TabsTrigger value="art" className="rounded-2xl data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-black flex flex-col items-center gap-1"><Palette className="w-5 h-5"/> Art</TabsTrigger>
                        <TabsTrigger value="coach" className="rounded-2xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-black flex flex-col items-center gap-1"><Mic className="w-5 h-5"/> Coach</TabsTrigger>
                        <TabsTrigger value="rewards" className="rounded-2xl data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 font-black flex flex-col items-center gap-1"><Trophy className="w-5 h-5"/> Rewards</TabsTrigger>
                    </TabsList>

                    <div className="min-h-[700px] animate-in slide-in-from-bottom-10 duration-1000">
                        <TabsContent value="lifeskills" className="mt-0"><LifeSkillsZone schoolId={schoolId} /></TabsContent>
                        <TabsContent value="stories" className="mt-0"><StorySpark canEdit={canEdit} /></TabsContent>
                        <TabsContent value="math" className="mt-0"><MathPlayground schoolId={schoolId} /></TabsContent>
                        <TabsContent value="science" className="mt-0"><JuniorScienceWorld schoolId={schoolId} /></TabsContent>
                        <TabsContent value="art" className="mt-0"><div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300"><ArtStudio schoolId={schoolId} /></div></TabsContent>
                        <TabsContent value="coach" className="mt-0"><VoiceCoach canEdit={canEdit} /></TabsContent>
                        <TabsContent value="rewards" className="mt-0"><StickerBook schoolId={schoolId} /></TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}