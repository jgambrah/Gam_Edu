'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, query, where, serverTimestamp, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, Volume2, Star, Wand2, Mic, XCircle, 
  Save, Trash2, Library, CheckCircle2, Plus, BookOpen,
  Zap, ShieldCheck, MonitorPlay, StopCircle, Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateWordDetails, generateTTSAction, generateLessonImageAction } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';

const juniorStyles = {
    storybook: "bg-[#FFFDE7] border-y-8 border-x-4 border-orange-200 rounded-[60px] p-8 shadow-[0_15px_0_#FFE082]",
    storyText: "text-3xl font-bold text-orange-900 leading-relaxed font-serif",
    button: "h-20 px-12 bg-pink-500 hover:bg-pink-600 text-white font-black rounded-[30px] shadow-[0_10px_0_#9d174d] active:translate-y-1 active:shadow-none transition-all",
    input: "h-28 text-7xl font-black text-center border-8 border-yellow-300 rounded-[40px] bg-white text-pink-500 shadow-inner"
};

// --- SUB-COMPONENT: VOICE COACH ---
export function VoiceCoach({ canEdit, schoolId }: { canEdit: boolean; schoolId: string;}) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [word, setWord] = useState('Apple');
    const [details, setDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { data: dbWords, forceRefetch } = useCollection<any>(useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'junior_phonics'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, 
    [firestore, schoolId]));

    const fetchDetails = useCallback(async (w: string) => {
        setIsLoading(true);
        setDetails(null);
        const result = await generateWordDetails({ word: w, schoolId });
        if (result.success) setDetails(result.data);
        else toast({ title: "AI Error", description: result.error || "Could not get word details." });
        setIsLoading(false);
    }, [toast, schoolId]);
    
    const speak = async (text: string) => {
        if (!text) return;
        try {
            const result = await generateTTSAction({ text, voice: 'Achernar', schoolId });
            if (result.success && result.data && typeof window !== 'undefined') {
                const audio = new Audio(`data:audio/wav;base64,${result.data}`);
                audio.play();
            }
        } catch (e) {
            console.error("Audio error", e);
        }
    };
    
    useEffect(() => { fetchDetails('Apple'); }, [fetchDetails]);

    const handleSaveWord = async () => {
        if(!firestore || !schoolId) return;
        await addDoc(collection(firestore, 'junior_phonics'), {
            word: word,
            schoolId: schoolId,
            createdAt: serverTimestamp()
        });
        toast({title: "Word Saved!"});
        forceRefetch();
    };

    return (
        <div className="text-center">
            <h2 className="text-5xl font-black text-pink-500 uppercase tracking-tighter">Voice & Diction Coach</h2>
            <p className="text-slate-400 font-bold italic text-xl mt-2 mb-12">Learn to pronounce words clearly!</p>
            
            <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
                <div className="p-10 bg-pink-50 rounded-[4rem] border-8 border-white shadow-xl">
                    <p className="text-[10px] uppercase font-black text-pink-300 mb-2">Word of the Day</p>
                    {details ? (
                        <div className="space-y-4 text-center animate-in fade-in">
                            <p className="text-8xl font-black text-slate-800">{details.word}</p>
                            <p className="text-2xl font-bold text-pink-400 italic">{details.phonetic}</p>
                            <div className="text-6xl">{details.emoji}</div>
                            <Button onClick={() => speak(details.sentence)} className={juniorStyles.button + " text-2xl"}>Hear Sentence 🔊</Button>
                        </div>
                    ) : <Loader2 className="w-12 h-12 mx-auto animate-spin text-pink-400"/>}
                </div>
                
                <div className="space-y-4">
                    <p className="font-bold text-slate-500">Practice other words:</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {dbWords?.map((w: any) => (
                            <button key={w.id} onClick={() => fetchDetails(w.word)} className="px-6 py-3 bg-white border-2 border-slate-100 rounded-full font-bold text-slate-600 hover:bg-pink-50 hover:border-pink-200 transition-all">{w.word}</button>
                        ))}
                    </div>
                    {canEdit && (
                        <div className="pt-4 border-t flex gap-2">
                            <Input value={word} onChange={e => setWord(e.target.value)} placeholder="Add new word..."/>
                            <Button onClick={handleSaveWord}><Plus /></Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENT: STORY SPARK (Dr. Gam Version) ---
interface VisualState {
  type: 'letter' | 'word' | 'image' | 'number' | 'concept' | 'quiz';
  value: string;
  url?: string;
  id: number;
}

export function StorySpark({ canEdit, schoolId }: { canEdit: boolean, schoolId: string }) {
    const { toast } = useToast();
    
    // Simplified State
    const [isActive, setIsActive] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [activeVisual, setActiveVisual] = useState<VisualState | null>(null);
    const [lastTranscript, setLastTranscript] = useState('');
    const [isVisualLoading, setIsVisualLoading] = useState(false);
    
    const inactivityTimeoutRef = useRef<number | null>(null);
    const lastActivityTimeRef = useRef<number>(Date.now());
    const requestIdRef = useRef(0);

    const INACTIVITY_TIMEOUT = 120000; 

    const endSession = () => {
        setIsActive(false); 
        setIsConnecting(false);
        if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);
        setActiveVisual(null); 
    };

    const resetInactivityTimer = () => {
        lastActivityTimeRef.current = Date.now();
        if (inactivityTimeoutRef.current) window.clearTimeout(inactivityTimeoutRef.current);
        inactivityTimeoutRef.current = window.setTimeout(() => {
          console.warn("⚠️ Inactivity Limit: Auto-closing Dr. Gam.");
          endSession();
        }, INACTIVITY_TIMEOUT);
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden' && isActive) {
                endSession();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', endSession);
        if (isActive) resetInactivityTimer();
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', endSession);
            endSession();
        };
    }, [isActive]);

    const startSession = async () => {
        setIsConnecting(true);
        toast({
            variant: "destructive",
            title: "Feature Not Available",
            description: "Live voice tutoring is not configured for this project environment."
        });
        setTimeout(() => setIsConnecting(false), 1000);
    };

    const updateVisualsFromText = async (fullText: string) => {
        const cleanText = fullText.toUpperCase();
        const commands = Array.from(cleanText.matchAll(/SHOW\s+BOARD:\s*([\w\s]+?)(?=[.!?]|$)/gi));
        if (commands.length === 0) return;

        const lastCommand = commands[commands.length - 1][1].trim();
        const newId = ++requestIdRef.current;
        setIsVisualLoading(true);

        let detectedValue = lastCommand;
        let detectedType: VisualState['type'] = 'concept';
        if (detectedValue.includes("QUIZ")) { detectedType = 'quiz'; } 
        else if (detectedValue.length === 1 && /[A-Z]/.test(detectedValue)) { detectedType = 'letter'; } 
        else if (/^\d+$/.test(detectedValue)) { detectedType = 'number'; }

        setActiveVisual({ type: detectedType, value: detectedValue, id: newId });
        try {
            const result = await generateLessonImageAction({ prompt: `Academic high-quality 3D ${detectedValue}, centered, professional clean style, white background`, schoolId });
            if (newId === requestIdRef.current) {
                setActiveVisual(prev => prev ? { ...prev, url: result.data || undefined } : null);
                setIsVisualLoading(false);
            }
        } catch (e) { setIsVisualLoading(false); }
    };
    
    return (
        <div className="flex flex-col items-center p-6 md:p-12 bg-[#F8FAFC] rounded-[4rem] shadow-2xl max-w-7xl mx-auto border-[12px] border-slate-900 relative overflow-hidden font-black selection:bg-indigo-100">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* PROFESSOR CARD */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center p-10 bg-white rounded-[4rem] border-4 border-slate-900 shadow-xl">
                <div className={`relative w-44 h-44 rounded-full bg-slate-50 flex items-center justify-center mb-8 border-8 transition-all duration-500 ${isActive ? 'border-indigo-500 scale-105' : 'border-slate-200'}`}>
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=DrGam" alt="Dr. Gam" className="w-36 h-36 rounded-full object-cover" />
                    {isActive && <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white border-4 border-white shadow-xl animate-pulse"><Mic className="w-8 h-8" /></div>}
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter text-center mb-6">Dr. Gam</h2>
                {isActive ? (
                  <Button onClick={endSession} className="w-full h-14 bg-red-50 text-red-600 rounded-3xl font-black uppercase text-xs hover:bg-red-600 hover:text-white border-4 border-red-50">Stop Lecture</Button>
                ) : (
                    <Badge variant="outline" className="text-slate-400 uppercase font-black tracking-widest text-[10px]">Awaiting Instruction</Badge>
                )}
            </div>

            {/* INTERACTIVE BOARD */}
            <div className="lg:col-span-9">
                <div className="w-full aspect-[16/10] bg-slate-900 rounded-[5rem] border-[16px] border-slate-800 shadow-inner flex items-center justify-center relative overflow-hidden group">
                    {!activeVisual ? (
                        <div className="text-center opacity-10 flex flex-col items-center gap-8 group-hover:opacity-20 transition-opacity">
                            <MonitorPlay className="w-48 h-48" />
                            <p className="font-black text-3xl uppercase tracking-[0.4em]">Visual Board Offline</p>
                        </div>
                    ) : (
                        <div className="w-full h-full p-16 animate-in zoom-in duration-500">
                            <div className="w-full h-full rounded-[4rem] bg-white shadow-2xl flex items-center justify-center overflow-hidden border-[12px] border-slate-700">
                               {isVisualLoading ? (
                                 <div className="flex flex-col items-center gap-4">
                                   <Loader2 className="w-20 h-20 animate-spin text-slate-300" />
                                   <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Preparing Visual...</span>
                                 </div>
                               ) : activeVisual.url && (
                                 <img src={activeVisual.url} className="w-full h-full object-cover p-10 animate-in fade-in duration-700" alt="visual aid" />
                               )}
                            </div>
                        </div>
                    )}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-800 rounded-full border border-slate-700">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Dr. Gam Digital Board</span>
                    </div>
                </div>
            </div>
          </div>
          
          {!isActive && (
            <div className="mt-16 flex flex-col items-center w-full animate-in slide-in-from-bottom-10 duration-700">
               <button 
                 onClick={() => startSession(false)} 
                 disabled={isConnecting}
                 className="px-24 py-12 bg-slate-900 text-white text-5xl font-black rounded-[4rem] shadow-[0_15px_0_0_#000] hover:translate-y-1 active:translate-y-4 active:shadow-none transition-all flex items-center gap-6 uppercase tracking-tighter border-8 border-white mb-16"
               >
                 {isConnecting ? <><Loader2 className="animate-spin w-12 h-12"/> Awakening...</> : 'Enter Classroom'}
               </button>
            </div>
          )}
        </div>
    );
}
