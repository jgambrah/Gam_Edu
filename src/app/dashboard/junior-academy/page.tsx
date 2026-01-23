
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, 
  Trophy, Gift, Check, CheckCircle2, XCircle, PenTool, Eraser, Database, 
  Pencil, Pen, Heart, Utensils, Smile, Tv, Users, BrainCircuit, Activity,
  FolderOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateWordDetails, generateTTSAction, generateLessonImageAction, generateLifeSkillEntry } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StorySpark, VoiceCoach } from './voice-coach';
import MathPlayground from './math-playground';
import JuniorScienceWorld from './science-world';
import ArtStudio from './art-studio';
import StickerBook from './sticker-book';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Label } from '@/components/ui/label';
import { WritingCanvas } from './writing-canvas';


// --- JUNIOR STYLES ---
const juniorStyles = {
    card: "rounded-[40px] border-8 border-yellow-200 shadow-[0_15px_0_#FEF9C3] bg-white overflow-hidden",
    header: "bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400 p-8 text-white",
    bubble: "bg-white/80 backdrop-blur-md p-6 rounded-[40px] border-4 border-dashed border-pink-200 shadow-inner",
    btnPrimary: "h-16 px-8 bg-pink-500 hover:bg-pink-600 text-white font-black rounded-3xl shadow-[0_8px_0_#be185d] active:translate-y-1 active:shadow-none transition-all",
};

// --- HELPER FUNCTIONS ---
const speak = async (text: string, schoolId: string, voice: 'Puck' | 'Algenib' | 'Achernar' = 'Puck') => {
    if (!text || !schoolId) return;
    try {
        const result = await generateTTSAction({ text, voice, schoolId });
        if (result.success && result.data && typeof window !== 'undefined') {
            const audio = new Audio(`data:audio/wav;base64,${result.data}`);
            audio.play();
        }
    } catch (e) { console.error("TTS failed:", e); }
};

const isJuniorLevel = (grade: string) => 
    grade === 'Early Childhood' || grade === 'Lower Primary';

// --- TEACHER MAGIC MODAL ---
const TeacherModal: React.FC<{
  title: string; topicValue: string; 
  onTopicChange: (v: string) => void; onGenerate: () => void; 
  isLoading: boolean; onClose: () => void;
}> = ({ title, topicValue, onTopicChange, onGenerate, isLoading, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
    <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-green-100 animate-in zoom-in duration-300">
      <h3 className="text-3xl font-black text-slate-800 mb-6 uppercase tracking-tighter">AI {title}</h3>
      <div className="space-y-6">
        <div>
          <Label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">What should the AI create?</Label>
          <Input 
            value={topicValue} 
            onChange={(e) => onTopicChange(e.target.value)} 
            placeholder="e.g. Being Sad, Sharing Toys" 
            className="h-14 rounded-2xl border-4 border-slate-100 font-bold uppercase" 
          />
        </div>
        <Button 
          onClick={onGenerate} 
          disabled={isLoading || !topicValue} 
          className="w-full h-16 rounded-2xl font-black text-white bg-green-500 hover:bg-green-600 shadow-xl"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2"/> : <Wand2 className="mr-2"/>} CREATE MAGIC
        </Button>
        <button onClick={onClose} className="w-full text-slate-400 uppercase text-[10px] font-black tracking-widest mt-4">Close</button>
      </div>
    </div>
  </div>
);

// --- SPECIFIC LIFE SKILL MODULES ---
const EmotionsModule = ({ schoolId, canEdit, onSound, onComplete }: { schoolId: string, canEdit: boolean, onSound: (t: string) => void, onComplete: () => void }) => {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');

    const dataQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_lifeskills_world'), where('schoolId', '==', schoolId), where('category', '==', 'emotions'), orderBy('createdAt', 'asc')) : null, [firestore, schoolId]);
    const { data: items, forceRefetch } = useCollection<any>(dataQuery);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await generateLifeSkillEntry({ topic: aiTopic, category: 'emotions', schoolId });
            if (result.success && result.data) {
                await addDoc(collection(firestore!, 'junior_lifeskills_world'), { ...result.data, category: 'emotions', schoolId, createdAt: serverTimestamp() });
                setIsDrawerOpen(false); setAiTopic(''); forceRefetch();
            } else { throw new Error(result.error || "AI failed."); }
        } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); }
        finally { setIsLoading(false); }
    };
    
    // UI Logic Here...
    return <div className="p-4 bg-yellow-50 rounded-lg">Emotions Module Content. Total items: {items?.length || 0}</div>;
};

const PhysicalHealthModule = ({ schoolId, canEdit, onSound, onComplete }: { schoolId: string, canEdit: boolean, onSound: (t: string) => void, onComplete: () => void }) => {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');

    const dataQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_lifeskills_world'), where('schoolId', '==', schoolId), where('category', '==', 'physical-health'), orderBy('createdAt', 'asc')) : null, [firestore, schoolId]);
    const { data: items, forceRefetch } = useCollection<any>(dataQuery);
    
    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await generateLifeSkillEntry({ topic: aiTopic, category: 'physical-health', schoolId });
            if (result.success && result.data) {
                await addDoc(collection(firestore!, 'junior_lifeskills_world'), { ...result.data, category: 'physical-health', schoolId, createdAt: serverTimestamp() });
                setIsDrawerOpen(false); setAiTopic(''); forceRefetch();
            } else { throw new Error(result.error || "AI failed."); }
        } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); }
        finally { setIsLoading(false); }
    };

    return <div className="p-4 bg-green-50 rounded-lg">Physical Health Module Content. Total items: {items?.length || 0}</div>;
};

const SocialScenariosModule = ({ schoolId, canEdit, onSound, onComplete }: { schoolId: string, canEdit: boolean, onSound: (t: string) => void, onComplete: () => void }) => {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');

    const dataQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_lifeskills_world'), where('schoolId', '==', schoolId), where('category', '==', 'social'), orderBy('createdAt', 'asc')) : null, [firestore, schoolId]);
    const { data: items, forceRefetch } = useCollection<any>(dataQuery);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await generateLifeSkillEntry({ topic: aiTopic, category: 'social', schoolId });
            if (result.success && result.data) {
                await addDoc(collection(firestore!, 'junior_lifeskills_world'), { ...result.data, category: 'social', schoolId, createdAt: serverTimestamp() });
                setIsDrawerOpen(false); setAiTopic(''); forceRefetch();
            } else { throw new Error(result.error || "AI failed."); }
        } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message }); }
        finally { setIsLoading(false); }
    };

    return <div className="p-4 bg-rose-50 rounded-lg">Social Scenarios Module Content. Total items: {items?.length || 0}</div>;
};

// --- SUB-COMPONENT: LIFE SKILLS HUB ---
type LifeSkillTab = 'emotions' | 'routine-songs' | 'modeling' | 'practical-life' | 'communication' | 'social' | 'puppet-theater' | 'cognitive' | 'physical-health';

function LifeSkillsZone({ schoolId }: { schoolId: string }) {
  const [activeTab, setActiveTab] = useState<LifeSkillTab>('emotions');
  const [stars, setStars] = useState(0);
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');

  const onSound = (text: string) => speak(text, schoolId);
  const addStar = () => { confetti({ particleCount: 100, spread: 70 }); setStars(prev => prev + 1); };

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
           <Star className="text-3xl text-yellow-400 animate-pulse fill-current" />
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
                className={`min-w-[120px] px-6 py-4 rounded-3xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center border-4 ${
                  activeTab === tab.id ? `${tab.color} text-white shadow-xl scale-110 -translate-y-1` : 'bg-white text-slate-400 border-transparent hover:bg-teal-50'
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
        {activeTab === 'emotions' && <EmotionsModule schoolId={schoolId} canEdit={canEdit} onSound={onSound} onComplete={addStar} />}
        {activeTab === 'physical-health' && <PhysicalHealthModule schoolId={schoolId} canEdit={canEdit} onSound={onSound} onComplete={addStar} />}
        {activeTab === 'social' && <SocialScenariosModule schoolId={schoolId} canEdit={canEdit} onSound={onSound} onComplete={addStar} />}
        {/* Placeholder for other tabs */}
        {!['emotions', 'physical-health', 'social'].includes(activeTab) && (
            <Card><CardContent className="p-10 text-center text-muted-foreground">Module for '{activeTab}' coming soon!</CardContent></Card>
        )}
      </div>
    </div>
  );
}

// --- MAIN CAMPUS PAGE ---
export default function JuniorCampusPage() {
    const { role, profile } = useRole();
    const { user } = useUser();
    
    const schoolId = profile?.schoolId || (user as any)?.schoolId || "sunnyside-default";
    const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');

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
                    <div className="flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-[20px] border-2 border-slate-100">
                        <Badge className="bg-indigo-500 text-white border-none px-3 font-black">SaaS Node</Badge>
                        <span className="text-xs font-black text-slate-400">{schoolId}</span>
                    </div>
                </header>

                <Tabs defaultValue="lifeskills" className="w-full">
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
                        <TabsContent value="stories" className="mt-0"><StorySpark canEdit={canEdit} schoolId={schoolId} /></TabsContent>
                        <TabsContent value="writing" className="mt-0"><WritingCanvas /></TabsContent>
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
