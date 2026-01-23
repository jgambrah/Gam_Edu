
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, where, serverTimestamp, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Microscope, Atom, Leaf, Thermometer, Ghost, 
  Wand2, Volume2, Loader2, Sparkles, Plus, Trash2,
  Apple, User, HeartPulse, Ear, CloudSun, PawPrint, Car, Shapes, Earth, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { generateScienceWorldEntry, generateLessonImageAction } from '@/app/dashboard/junior-actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// --- JUNIOR SCIENCE THEME ---
const juniorStyles = {
    card: "rounded-[50px] border-8 border-sky-100 shadow-[0_20px_0_#E0F2FE] bg-white overflow-hidden",
    header: "bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 p-8 text-white",
    bubble: "bg-white/80 backdrop-blur-md p-6 rounded-[40px] border-4 border-dashed border-sky-200",
};

type ScienceTab = 'environment' | 'body' | 'organs' | 'growth' | 'senses' | 'diet' | 'nature' | 'weather' | 'animals' | 'transport' | 'concepts' | 'matter';

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
          <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">What should the AI create?</label>
          <Input 
            value={topicValue} 
            onChange={(e) => onTopicChange(e.target.value)} 
            placeholder="e.g. Venus Flytrap, Lungs, Solar Power" 
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
        <button onClick={onClose} className="w-full text-slate-400 uppercase text-[10px] font-black tracking-widest mt-4">Close Drawer</button>
      </div>
    </div>
  </div>
);

// --- MAIN SCIENCE COMPONENT ---
export default function JuniorScienceWorld({ schoolId }: { schoolId: string }) {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<ScienceTab>('environment');
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');

    const speak = (text: string) => {
        if (typeof window === 'undefined') return;
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
    };

    const tabs: {id: ScienceTab, label: string, icon: any, color: string}[] = [
        { id: 'environment', label: 'EVS Hub', icon: Earth, color: 'bg-green-500' },
        { id: 'body', label: 'My Body', icon: User, color: 'bg-blue-500' },
        { id: 'organs', label: 'Inside Me', icon: HeartPulse, color: 'bg-red-500' },
        { id: 'growth', label: 'Growing', icon: Sparkles, color: 'bg-orange-500' },
        { id: 'senses', label: 'Senses', icon: Ear, color: 'bg-purple-500' },
        { id: 'diet', label: 'Healthy', icon: Apple, color: 'bg-rose-500' },
        { id: 'nature', label: 'Nature', icon: Leaf, color: 'bg-emerald-500' },
        { id: 'weather', label: 'Weather', icon: CloudSun, color: 'bg-sky-500' },
        { id: 'animals', label: 'Zoo', icon: PawPrint, color: 'bg-amber-600' },
        { id: 'transport', label: 'Travel', icon: Car, color: 'bg-slate-600' },
        { id: 'concepts', label: 'Logic', icon: Shapes, color: 'bg-indigo-500' },
        { id: 'matter', label: 'Matter Lab', icon: Thermometer, color: 'bg-cyan-600' },
    ];

    return (
        <div className="flex flex-col items-center max-w-7xl mx-auto space-y-8 pb-20 font-sans selection:bg-sky-100">
            <div className="text-center space-y-2">
                <h2 className="text-6xl font-black text-sky-700 uppercase tracking-tighter drop-shadow-sm">Science Lab 🔬</h2>
                <p className="text-slate-400 font-bold italic text-xl">Let's discover our wonderful world!</p>
            </div>

            {/* SCROLLABLE NAV */}
            <div className="w-full overflow-x-auto no-scrollbar pb-6 px-4">
                <div className="flex justify-start md:justify-center gap-4 bg-white p-4 rounded-[3rem] shadow-xl border-4 border-sky-50 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 rounded-[2rem] font-black text-xs uppercase tracking-wider transition-all flex flex-col items-center gap-2 border-4 ${
                                activeTab === tab.id 
                                ? 'bg-slate-900 text-white border-slate-900 shadow-2xl scale-110 -translate-y-2' 
                                : 'bg-white text-slate-400 border-transparent hover:bg-sky-50'
                            }`}
                        >
                            <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'text-sky-400' : 'text-slate-300'}`} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* DYNAMIC CONTENT AREA */}
            <div className="w-full px-4">
                {activeTab === 'matter' ? (
                    <MatterLab schoolId={schoolId} />
                ) : (
                    <DiscoveryModule 
                        tab={activeTab} 
                        schoolId={schoolId} 
                        canEdit={canEdit} 
                        onSound={speak}
                    />
                )}
            </div>
        </div>
    );
}

// --- SUB-COMPONENT: MATTER LAB (THE SLIDER) ---
function MatterLab({ schoolId }: { schoolId: string }) {
    const firestore = useFirestore();
    const [temp, setTemp] = useState(20);
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);

    const { data: dbMaterials } = useCollection<any>(useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'junior_science_materials'), where('schoolId', '==', schoolId)) : null, 
    [firestore, schoolId]));

    const state = useMemo(() => {
        if (!selectedMaterial) return { emoji: '🔍', label: 'Pick Item', desc: 'Select a material to test!' };
        const sorted = [...selectedMaterial.states].sort((a,b) => b.temp - a.temp);
        return sorted.find(s => temp >= s.temp) || selectedMaterial.states[0];
    }, [selectedMaterial, temp]);

    return (
        <Card className={juniorStyles.card}>
            <CardHeader className={juniorStyles.header}>
                <div className="text-center space-y-4">
                    <h3 className="text-3xl font-black uppercase">State of Matter Lab</h3>
                    <div className="flex gap-2 justify-center flex-wrap">
                        {dbMaterials?.map((m: any) => (
                            <Button key={m.id} variant={selectedMaterial?.id === m.id ? 'default' : 'secondary'} onClick={() => setSelectedMaterial(m)} className="rounded-full font-bold">{m.name}</Button>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-16 flex flex-col items-center gap-10">
                <div className="text-[180px] p-12 bg-sky-50 rounded-full border-8 border-white shadow-inner animate-pulse">
                    {state.emoji}
                </div>
                <div className="text-center">
                    <h2 className="text-6xl font-black text-sky-900 tracking-tighter uppercase">{state.label}</h2>
                    <p className="text-2xl font-bold text-sky-400 mt-2">{state.desc}</p>
                </div>
                <div className="w-full max-w-xl space-y-6">
                    <div className="flex justify-between font-black text-sky-200 uppercase tracking-widest">
                        <span>Freezing</span>
                        <span className="text-sky-600 bg-sky-50 px-6 py-2 rounded-full border-2 border-sky-100">{temp}°C</span>
                        <span>Boiling</span>
                    </div>
                    <input type="range" min="-50" max="150" value={temp} onChange={e => setTemp(parseInt(e.target.value))} className="w-full h-8 bg-sky-100 rounded-full appearance-none cursor-pointer accent-blue-500 border-8 border-white shadow-lg" />
                </div>
            </CardContent>
        </Card>
    );
}

// --- SUB-COMPONENT: GENERAL DISCOVERY (AI + DB DRIVEN) ---
function DiscoveryModule({ tab, schoolId, canEdit, onSound }: { tab: ScienceTab, schoolId: string, canEdit: boolean, onSound: (t: string) => void }) {
    const firestore = useFirestore();
    const [index, setIndex] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [localImg, setLocalImg] = useState<string | null>(null);

    // SaaS Query
    const dataQuery = useMemoFirebase(() => 
        firestore ? query(
            collection(firestore, 'junior_science_world'), 
            where('schoolId', '==', schoolId),
            where('tab', '==', tab),
            orderBy('createdAt', 'asc')
        ) : null, [firestore, schoolId, tab]);
    
    const { data: items } = useCollection<any>(dataQuery);
    const current = items?.[index];

    const loadVisual = useCallback(async () => {
        if (!current) return;
        setIsLoading(true);
        setLocalImg(null);
        const url = await generateLessonImageAction(current.imagePrompt || `3D illustration of ${current.name} for children`);
        setLocalImg(url);
        setIsLoading(false);
    }, [current]);

    useEffect(() => {
        if (current) {
            loadVisual();
        }
    }, [current, loadVisual]);

    const generateWithAi = async () => {
        if (!firestore) return;
        setIsLoading(true);
        try {
            const result = await generateScienceWorldEntry(aiTopic, tab);
            
            if (!result.success || !result.data) {
                throw new Error(result.error || "AI did not generate valid data.");
            }
    
            await addDoc(collection(firestore, 'junior_science_world'), {
                ...result.data,
                tab,
                schoolId,
                createdAt: serverTimestamp()
            });
            
            setIsDrawerOpen(false);
            setAiTopic('');
            confetti();
        } catch (e: any) { 
            console.error(e); 
        } finally { 
            setIsLoading(false); 
        }
    };

    return (
        <div className="animate-in slide-in-from-bottom-10 duration-700">
            {canEdit && (
                <div className="flex justify-end mb-4">
                    <Button onClick={() => setIsDrawerOpen(true)} className="rounded-full bg-white border-2 border-green-200 text-green-600 font-black text-[10px] uppercase hover:bg-green-50 shadow-sm">
                        <Wand2 className="w-3 h-3 mr-2" /> AI {tab} Maker
                    </Button>
                </div>
            )}

            {current ? (
                <Card className={juniorStyles.card}>
                    <div className={juniorStyles.header}>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white text-blue-500 rounded-[2rem] flex items-center justify-center text-5xl shadow-xl border-4 border-white animate-bounce">
                                {current.icon || '🔬'}
                            </div>
                            <div>
                                <h3 className="text-5xl font-black uppercase tracking-tighter">{current.name}</h3>
                                <Badge className="bg-black/20 text-white border-none">{tab.toUpperCase()}</Badge>
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-12 flex flex-col md:flex-row gap-12 items-center">
                        <div 
                            onClick={() => onSound(current.fact)}
                            className="relative aspect-square w-full max-w-md bg-sky-50 rounded-[4rem] border-8 border-white shadow-2xl overflow-hidden cursor-pointer group"
                        >
                            {isLoading ? (
                                <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-sky-400 w-12 h-12" /></div>
                            ) : localImg && (
                                <img src={localImg} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={current.name} />
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <Volume2 className="text-white w-16 h-16 opacity-0 group-hover:opacity-100 drop-shadow-lg" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-8">
                            <div className={juniorStyles.bubble}>
                                <p className="text-3xl font-bold text-slate-700 leading-relaxed italic">"{current.fact}"</p>
                            </div>
                            <Button onClick={() => onSound(current.fact)} className="h-24 px-12 bg-gradient-to-t from-pink-600 to-pink-400 hover:scale-105 text-3xl font-black text-white rounded-[40px] shadow-[0_12px_0_#9d174d] active:translate-y-2 active:shadow-none transition-all w-full uppercase">
                                Read Story! 🎙️
                            </Button>
                            
                            <div className="flex gap-4 justify-center">
                                <button onClick={() => setIndex(i => Math.max(0, i - 1))} className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"><ArrowRight className="rotate-180" /></button>
                                <button onClick={() => items && setIndex(i => (i + 1) % items.length)} className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"><ArrowRight /></button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="py-40 text-center bg-white rounded-[60px] border-8 border-dashed border-sky-50">
                    <Microscope className="w-20 h-20 text-sky-100 mx-auto mb-4" />
                    <p className="text-sky-200 font-black text-2xl uppercase">Laboratory Empty...</p>
                    {canEdit && <p className="text-slate-400 text-sm mt-2">Use the AI Maker button to add items!</p>}
                </div>
            )}

            {isDrawerOpen && (
                <TeacherModal 
                    title={tab} 
                    topicValue={aiTopic} 
                    onTopicChange={setAiTopic} 
                    onGenerate={generateWithAi} 
                    isLoading={isLoading} 
                    onClose={() => setIsDrawerOpen(false)} 
                />
            )}
        </div>
    );
}
