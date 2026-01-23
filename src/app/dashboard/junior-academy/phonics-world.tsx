
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mic, Volume2, Wand2, Loader2, Sparkles, Trash2, Ear } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { generateWordDetails, generateTTSAction } from '@/ai/flows/junior-actions';
import { useCurrentSchool } from '@/hooks/use-current-school';

const juniorStyles = {
    button: "h-24 px-12 bg-gradient-to-t from-pink-600 to-pink-400 hover:scale-105 text-3xl font-black text-white rounded-[40px] shadow-[0_12px_0_#9d174d] active:translate-y-2 active:shadow-none transition-all",
    input: "h-28 text-7xl font-black text-center border-8 border-yellow-300 rounded-[40px] bg-white text-pink-500 shadow-inner"
};


// --- SUB-COMPONENT: VOICE COACH ---
function VoiceCoach({ canEdit, schoolId }: { canEdit: boolean, schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [word, setWord] = useState('');
    const [details, setDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [newWord, setNewWord] = useState('');

    const { data: dbWords, forceRefetch } = useCollection<any>(useMemoFirebase(() =>
        (firestore && schoolId) ? query(collection(firestore, 'junior_phonics'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null,
    [firestore, schoolId]));

    const fetchDetails = useCallback(async (w: string) => {
        if (!schoolId) return;
        setIsLoading(true);
        setDetails(null);
        setWord(w); // Set the current word
        const result = await generateWordDetails({ word: w, schoolId });
        if (result.success) {
            setDetails(result.data);
        } else {
            toast({ title: "AI Error", description: result.error || "Could not get word details." });
        }
        setIsLoading(false);
    }, [toast, schoolId]);

    const speak = async (text: string) => {
        if (!text || !schoolId) return;
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
    
    const handleSaveWord = async () => {
        if(!firestore || !newWord.trim() || !schoolId) return;
        try {
            await addDoc(collection(firestore, 'junior_phonics'), {
                word: newWord.trim(),
                schoolId: schoolId,
                createdAt: serverTimestamp()
            });
            toast({title: "Word Saved!"});
            forceRefetch();
            setNewWord('');
        } catch (e) {
            console.error(e);
            toast({variant: "destructive", title: "Error"});
        }
    };

    return (
        <div className="text-center">
            <h2 className="text-5xl font-black text-pink-500 uppercase tracking-tighter">Voice & Diction Coach</h2>
            <p className="text-slate-400 font-bold italic text-xl mt-2 mb-12">Learn to pronounce words clearly!</p>

            <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
                <div className="p-10 bg-pink-50 rounded-[4rem] border-8 border-white shadow-xl min-h-[500px] flex flex-col justify-center">
                    <p className="text-[10px] uppercase font-black text-pink-300 mb-2">Word of the Day</p>
                    {isLoading ? (
                        <Loader2 className="w-12 h-12 mx-auto animate-spin text-pink-400"/>
                    ) : details ? (
                        <div className="space-y-4 text-center animate-in fade-in">
                            <p className="text-8xl font-black text-slate-800">{details.word}</p>
                            <p className="text-2xl font-bold text-pink-400 italic">{details.phonetic}</p>
                            <div className="text-6xl">{details.emoji}</div>
                            <Button onClick={() => speak(details.sentence)} className={juniorStyles.button + " text-2xl"}>Hear Sentence 🔊</Button>
                        </div>
                    ) : (
                         <div className="text-center text-slate-400 py-10">
                            <p>Select a word below to start practicing!</p>
                        </div>
                    )}
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
                            <Input value={newWord} onChange={e => setNewWord(e.target.value)} placeholder="Add new word..."/>
                            <Button onClick={handleSaveWord}>+</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function PhonicsWorld({ schoolId }: { schoolId: string }) {
    const { role } = useRole();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <VoiceCoach canEdit={canEdit} schoolId={schoolId} />
        </div>
    );
}
