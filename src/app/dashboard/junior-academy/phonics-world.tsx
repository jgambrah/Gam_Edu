
'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, where, serverTimestamp, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, Volume2, Wand2, Loader2, Sparkles, Music, 
  BookOpen, HandsClapping, Ear, Gamepad2, Layers, 
  Repeat, Underline, Signpost, BookOpenCheck, ArrowRight, Smile
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { generateTTSAction, generatePhonicsWorldEntry, generateLessonImageAction } from '@/app/dashboard/junior-actions';
import { Label } from '@/components/ui/label';

const juniorStyles = {
    card: "rounded-[60px] border-8 border-pink-100 shadow-[0_20px_0_#FCE7F3] bg-white overflow-hidden",
    header: "bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 p-8 text-white",
    bubble: "bg-white/80 backdrop-blur-md p-6 rounded-[40px] border-4 border-dashed border-pink-200 shadow-inner",
    button: "h-20 px-12 bg-pink-500 hover:bg-pink-600 text-white font-black rounded-[30px] shadow-[0_10px_0_#9d174d] active:translate-y-1 active:shadow-none transition-all",
};

type PhonicsTab = 'jolly-phonics' | 'alphabet' | 'picture-reading' | 'syllables' | 'alliteration' | 'sound-games' | 'blends' | 'rhymes' | 'diction' | 'missing-letters' | 'environmental-print' | 'book-handling';

// --- TEACHER MAGIC MODAL ---
const TeacherModal: React.FC<{
  title: string; topicValue: string; 
  onTopicChange: (v: string) => void; onGenerate: () => void; 
  isLoading: boolean; onClose: () => void;
}> = ({ title, topicValue, onTopicChange, onGenerate, isLoading, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
    <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-pink-50 animate-in zoom-in duration-300">
      <h3 className="text-3xl font-black text-slate-800 mb-6 uppercase tracking-tighter">AI {title}</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">What should the AI create?</label>
          <Input 
            value={topicValue} 
            onChange={(e) => onTopicChange(e.target.value)} 
            placeholder="e.g. The 'Ch' sound, Short Vowels" 
            className="h-14 rounded-2xl border-4 border-slate-100 font-bold uppercase" 
          />
        </div>
        <Button 
          onClick={onGenerate} 
          disabled={isLoading || !topicValue} 
          className="w-full h-16 rounded-2xl font-black text-white bg-pink-500 hover:bg-pink-600 shadow-xl"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2"/> : <Wand2 className="mr-2"/>} CREATE MAGIC
        </Button>
        <button onClick={onClose} className="w-full text-slate-400 uppercase text-[10px] font-black tracking-widest mt-4">Close Drawer</button>
      </div>
    </div>
  </div>
);

// --- MAIN PHONICS WORLD COMPONENT ---
export default function PhonicsWorld({ schoolId }: { schoolId: string }) {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<PhonicsTab>('jolly-phonics');
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');

    const onSound = async (text: string) => {
        if (!text) return;
        const { success, data } = await generateTTSAction({ text, voice: 'Achernar' });
        if (success && data && typeof window !== 'undefined') {
            const audio = new Audio(`data:audio/wav;base64,${data}`);
            audio.play();
        }
    };

    const tabs: {id: PhonicsTab, label: string, icon: React.ElementType}[] = [
        { id: 'jolly-phonics', label: 'Jolly Sounds', icon: Smile },
        { id: 'alphabet', label: 'ABC Phonics', icon: Music },
        { id: 'picture-reading', label: 'Reading', icon: BookOpen },
        { id: 'syllables', label: 'Clap Out', icon: HandsClapping },
        { id: 'alliteration', label: 'Listening', icon: Ear },
        { id: 'sound-games', label: 'Sound Play', icon: Gamepad2 },
        { id: 'blends', label: 'Blends', icon: Layers },
        { id: 'rhymes', label: 'Rhymes', icon: Repeat },
        { id: 'diction', label: 'Speech', icon: Mic },
        { id: 'missing-letters', label: 'Gaps', icon: Underline },
        { id: 'environmental-print', label: 'Signs', icon: Signpost },
        { id: 'book-handling', label: 'Books', icon: BookOpenCheck },
    ];

    return (
        <div className="flex flex-col items-center max-w-7xl mx-auto space-y-8 pb-20 font-sans selection:bg-pink-100">
            <div className="text-center space-y-2">
                <h2 className="text-6xl font-black text-pink-600 uppercase tracking-tighter drop-shadow-sm">Phonics World 🎵</h2>
                <p className="text-slate-400 font-bold italic text-xl">Let's learn to read and speak with magic!</p>
            </div>

            {/* NAV BAR */}
            <div className="w-full overflow-x-auto no-scrollbar pb-6 px-4">
                <div className="flex justify-start md:justify-center gap-4 bg-white p-4 rounded-[3rem] shadow-xl border-4 border-pink-50 min-w-max">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-4 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center gap-2 border-4 ${
                                    activeTab === tab.id 
                                    ? 'bg-pink-500 text-white border-pink-700 shadow-2xl scale-110 -translate-y-2' 
                                    : 'bg-white text-slate-400 border-transparent hover:bg-pink-50'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-pink-300'}`} />
                                <span>{tab.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* MODULE LOADER */}
            <div className="w-full px-4">
                <PhonicsModule 
                    tab={activeTab} 
                    schoolId={schoolId} 
                    canEdit={canEdit} 
                    onSound={onSound} 
                />
            </div>
        </div>
    );
}

// --- UNIVERSAL PHONICS MODULE (AI + SaaS DB) ---
function PhonicsModule({ tab, schoolId, canEdit, onSound }: { tab: PhonicsTab, schoolId: string, canEdit: boolean, onSound: (t: string) => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // SaaS Query
    const dataQuery = useMemoFirebase(() => 
        firestore ? query(
            collection(firestore, 'junior_phonics_world'), 
            where('schoolId', '==', schoolId),
            where('tab', '==', tab),
            orderBy('createdAt', 'asc')
        ) : null, [firestore, schoolId, tab]);
    
    const { data: items, forceRefetch } = useCollection<any>(dataQuery);
    const current = items?.[index];

    const loadVisual = useCallback(async () => {
        if (!current) return;
        setIsLoading(true);
        setImageUrl(null);
        const url = await generateLessonImageAction(current.imagePrompt || `Nursery illustration of ${current.name || current.letter}`);
        setImageUrl(url);
        setIsLoading(false);
    }, [current]);

    useEffect(() => {
        if (current) {
            loadVisual();
        }
    }, [current, loadVisual]);

    const handleGenerate = async () => {
        if (!firestore) return;
        setIsLoading(true);
        try {
            const result = await generatePhonicsWorldEntry(aiTopic, tab);
            if(result.success && result.data){
                await addDoc(collection(firestore, 'junior_phonics_world'), {
                    ...result.data,
                    tab,
                    schoolId,
                    createdAt: serverTimestamp()
                });
                
                setIsDrawerOpen(false);
                setAiTopic('');
                confetti();
                forceRefetch();
            } else {
                throw new Error(result.error || "Failed to generate entry")
            }
            
        } catch (e: any) { 
            console.error(e); 
            toast({ title: "Magic Failed", variant: "destructive", description: e.message });
        } finally { setIsLoading(false); }
    };

    return (
        <div className="animate-in slide-in-from-bottom-10 duration-700">
            {canEdit && (
                <div className="flex justify-end mb-4">
                    <Button onClick={() => setIsDrawerOpen(true)} className="rounded-full bg-white border-2 border-pink-200 text-pink-600 font-black text-[10px] uppercase shadow-sm">
                        <Wand2 className="w-3 h-3 mr-2" /> AI {tab.replace('-', ' ')} Maker
                    </Button>
                </div>
            )}

            {current ? (
                <Card className={juniorStyles.card}>
                    <div className={juniorStyles.header}>
                        <div className="flex items-center gap-8">
                            <div className="text-8xl p-8 bg-white/20 rounded-[3rem] backdrop-blur-md animate-bounce">
                                {current.icon || '🎵'}
                            </div>
                            <div className="text-left">
                                <h3 className="text-6xl font-black uppercase tracking-tighter">{current.title || current.letter}</h3>
                                <p className="text-2xl font-bold opacity-80 italic">Sound: "{current.sound}"</p>
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-12 flex flex-col md:flex-row gap-12 items-center">
                        <div 
                            onClick={() => onSound(current.description || current.story)}
                            className="relative aspect-square w-full max-w-md bg-pink-50 rounded-[4rem] border-8 border-white shadow-2xl overflow-hidden cursor-pointer group"
                        >
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-pink-400 w-12 h-12" /></div>
                            ) : imageUrl && (
                                <img src={imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt="Phonics Visual" />
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                <Volume2 className="text-white w-20 h-20 opacity-0 group-hover:opacity-100 drop-shadow-xl" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-8">
                            <div className={juniorStyles.bubble}>
                                <h4 className="text-xs font-black text-pink-400 uppercase tracking-widest mb-2">Lesson:</h4>
                                <p className="text-3xl font-bold text-slate-700 leading-relaxed italic">"{current.description || current.story}"</p>
                            </div>
                            
                            <Button onClick={() => onSound(current.description || current.story)} className={juniorStyles.button + " w-full"}>
                                Listen to Sound! 🎙️
                            </Button>

                            <div className="flex gap-4 justify-center">
                                <button onClick={() => setIndex(i => Math.max(0, i - 1))} className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"><ArrowRight className="rotate-180" /></button>
                                <button onClick={() => items && items.length > 0 && setIndex(i => (i + 1) % items.length)} className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"><ArrowRight /></button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="py-40 text-center bg-white rounded-[60px] border-8 border-dashed border-pink-50">
                    <Music className="w-20 h-20 text-pink-100 mx-auto mb-4" />
                    <p className="text-pink-200 font-black text-2xl uppercase">Phonics Studio Empty...</p>
                    {canEdit && <p className="text-slate-400 text-sm mt-2">Use the AI Maker button to add items!</p>}
                </div>
            )}

            {isDrawerOpen && (
                <TeacherModal 
                    title={tab} 
                    topicValue={aiTopic} 
                    onTopicChange={setAiTopic} 
                    onGenerate={handleGenerate} 
                    isLoading={isLoading} 
                    onClose={() => setIsDrawerOpen(false)} 
                />
            )}
        </div>
    );
}
