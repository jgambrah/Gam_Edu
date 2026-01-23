
'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, query, where, serverTimestamp, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, Sparkles, Wand2, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateWordDetails, generateTTSAction } from '@/ai/flows/junior-actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

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
    
    const { data: dbWords } = useCollection<any>(useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'junior_phonics'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, 
    [firestore, schoolId]));

    const fetchDetails = useCallback(async (w: string) => {
        setIsLoading(true);
        setDetails(null);
        const result = await generateWordDetails(w);
        if (result.success) setDetails(result.data);
        else toast({ title: "AI Error", description: "Could not get word details." });
        setIsLoading(false);
    }, [toast]);
    
    useEffect(() => { fetchDetails('Apple'); }, [fetchDetails]);

    const handleSaveWord = async () => {
        if(!firestore || !schoolId) return;
        await addDoc(collection(firestore, 'junior_phonics'), {
            word: word,
            schoolId: schoolId,
            createdAt: serverTimestamp()
        });
        toast({title: "Word Saved!"});
    };
    
    const speak = async (text: string) => {
        if (!text) return;
        // Use the correct server action
        const result = await generateTTSAction({ text, voice: 'Achernar' });
        if (result.success && result.data && typeof window !== 'undefined') {
            const audio = new Audio(`data:audio/wav;base64,${result.data}`);
            audio.play();
        }
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

// --- SUB-COMPONENT: STORY SPARK ---
export function StorySpark({ canEdit, schoolId }: { canEdit: boolean, schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeStory, setActiveStory] = useState<any>(null);
    
    const storiesQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'junior_stories'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, 
    [firestore, schoolId]);
    const { data: dbStories, isLoading: storiesLoading } = useCollection<any>(storiesQuery);

    const handleGenerate = async () => {
        if(!topic.trim() || !firestore || !schoolId) return;
        setIsGenerating(true);
        const result = await generateJuniorStory(topic);
        if (result.success && result.data && firestore) {
            const docRef = await addDoc(collection(firestore, 'junior_stories'), {
                ...result.data,
                schoolId: schoolId,
                createdAt: serverTimestamp()
            });
            setActiveStory({ id: docRef.id, ...result.data });
        } else {
            toast({ title: 'AI Failed', variant: 'destructive', description: result.error });
        }
        setIsGenerating(false);
    };
    
    return (
        <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-4">
                {canEdit && (
                    <Card className="bg-orange-50 border-orange-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-orange-800 flex items-center gap-2"><Wand2 className="w-4 h-4"/> AI Story Maker</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Story about... e.g. a Lion"/>
                            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-orange-500 hover:bg-orange-600">
                                {isGenerating ? <Loader2 className="animate-spin"/> : "Write New Story"}
                            </Button>
                        </CardContent>
                    </Card>
                )}
                <Card className="max-h-[500px] flex flex-col">
                    <CardHeader className="pb-2"><CardTitle className="text-md">Story Library</CardTitle></CardHeader>
                    <CardContent className="p-0 flex-1 min-h-0">
                        <ScrollArea className="h-full p-4">
                            {storiesLoading && <Skeleton className="h-20 w-full"/>}
                            {dbStories?.map((story: any) => (
                                <button key={story.id} onClick={() => setActiveStory(story)} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${activeStory?.id === story.id ? 'bg-orange-100 text-orange-800' : 'hover:bg-slate-50'}`}>
                                    <span className="text-2xl">{story.emojiIcon}</span>
                                    <span className="font-semibold text-sm">{story.title}</span>
                                </button>
                            ))}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-3">
                {activeStory ? (
                    <Card className={juniorStyles.storybook}>
                        <CardContent className="p-0 space-y-8">
                             <h2 className="text-7xl font-black text-orange-800 text-center">{activeStory.title}</h2>
                             <p className="text-3xl font-bold text-orange-900 leading-relaxed font-serif whitespace-pre-wrap">{activeStory.content}</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed">
                        <BookOpen className="w-16 h-16 text-slate-200 mb-4"/>
                        <p className="text-slate-400 font-bold">Select a story to read!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
