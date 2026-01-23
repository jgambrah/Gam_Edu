'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, where, serverTimestamp, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Loader2, Volume2, Star, Wand2, Mic, XCircle,
  Save, Trash2, Library, CheckCircle2, Plus, BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateWordDetails, generateTTSAction } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';

const juniorStyles = {
    storybook: "bg-[#FFFDE7] border-y-8 border-x-4 border-orange-200 rounded-[60px] p-8 shadow-[0_15px_0_#FFE082]",
    storyText: "text-3xl font-bold text-orange-900 leading-relaxed font-serif",
    button: "h-24 px-12 bg-gradient-to-t from-pink-600 to-pink-400 hover:scale-105 text-3xl font-black text-white rounded-[40px] shadow-[0_12px_0_#9d174d] active:translate-y-2 active:shadow-none transition-all",
    input: "h-28 text-7xl font-black text-center border-8 border-yellow-300 rounded-[40px] bg-white text-pink-500 shadow-inner"
};

// --- SUB-COMPONENT: VOICE COACH ---
export function VoiceCoach({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [word, setWord] = useState('Apple');
    const [details, setDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { schoolId } = useCurrentSchool();

    const { data: dbWords, forceRefetch } = useCollection<any>(useMemoFirebase(() =>
        (firestore && schoolId) ? query(collection(firestore, 'junior_phonics'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null,
    [firestore, schoolId]));

    const fetchDetails = useCallback(async (w: string) => {
        if (!schoolId) return;
        setIsLoading(true);
        setDetails(null);
        const result = await generateWordDetails({word: w, schoolId});
        if (result.success) setDetails(result.data);
        else toast({ title: "AI Error", description: result.error || "Could not get word details." });
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

    useEffect(() => {
        if (schoolId) {
            fetchDetails('Apple');
        }
    }, [fetchDetails, schoolId]);

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
export function StorySpark({ canEdit, schoolId }: { canEdit: boolean, schoolId: string }) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [topic, setTopic] = useState('');
  const [activeStory, setActiveStory] = useState<any>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const storiesQuery = useMemoFirebase(() =>
      (firestore && schoolId) ? query(collection(firestore, 'junior_stories'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null,
  [firestore, schoolId]);
  const { data: dbStories, forceRefetch } = useCollection<any>(storiesQuery);

  const generateNewStory = async () => {
    if (!topic || !schoolId) return;
    setIsGenerating(true);
    const result = await generateJuniorStory({topic, schoolId});
    if (result.success && result.data) {
        await addDoc(collection(firestore!, 'junior_stories'), {
            ...result.data,
            schoolId: schoolId,
            createdAt: serverTimestamp()
        });
        forceRefetch();
        toast({title: "New Story Created!"});
    } else {
        toast({title: "AI Error", description: result.error, variant: 'destructive'});
    }
    setIsGenerating(false);
  };

  const checkAnswers = () => {
    let correct = 0;
    activeStory.questions.forEach((q: any, i: number) => {
        if (answers[i]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) correct++;
    });
    if (correct === activeStory.questions.length) {
        confetti();
        toast({ title: "Perfect!", description: "You answered all questions correctly." });
    } else {
        toast({ title: "Good Try!", description: `You got ${correct} out of ${activeStory.questions.length} right.` });
    }
  };

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* LIBRARY */}
      <div className="lg:col-span-1">
        <Card className="shadow-inner bg-slate-50 border-slate-100">
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Library className="text-orange-500"/> Story Library</CardTitle></CardHeader>
            <CardContent className="space-y-2">
                {dbStories?.map(story => (
                    <Button key={story.id} variant={activeStory?.id === story.id ? 'default' : 'outline'} className="w-full justify-start gap-2" onClick={() => setActiveStory(story)}>
                        {story.emojiIcon} {story.title}
                    </Button>
                ))}
            </CardContent>
        </Card>
        {canEdit && (
             <Card className="mt-4 shadow-inner bg-slate-50 border-slate-100">
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Wand2 className="text-purple-500"/> AI Story Generator</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <Input placeholder="Story Topic..." value={topic} onChange={e => setTopic(e.target.value)} />
                    <Button onClick={generateNewStory} disabled={isGenerating || !topic} className="w-full bg-purple-600">
                       {isGenerating ? <Loader2 className="animate-spin"/> : 'Create Story'}
                    </Button>
                </CardContent>
            </Card>
        )}
      </div>

      {/* STORYBOOK */}
      <div className="lg:col-span-3">
          {activeStory ? (
              <div className={juniorStyles.storybook}>
                  <div className="text-center mb-8">
                      <div className="text-7xl mb-4 animate-bounce">{activeStory.emojiIcon}</div>
                      <h2 className="text-5xl font-black text-orange-800">{activeStory.title}</h2>
                      <p className="text-orange-400 font-black mt-2 uppercase tracking-widest">A Magic Tale</p>
                  </div>
                  <p className={juniorStyles.storyText}>{activeStory.content}</p>

                  <div className="mt-12 bg-white/80 p-10 rounded-[50px] border-4 border-dashed border-orange-300 space-y-8">
                      <h3 className="text-4xl font-black text-pink-500 text-center">🌟 Discovery Questions 🌟</h3>
                      {activeStory.questions.map((q:any, i: number) => (
                           <div key={i} className="space-y-4 text-center">
                                <p className="text-2xl font-black text-blue-900">🌈 {q.question}</p>
                                <Input placeholder="Type your answer..." value={answers[i] || ""} onChange={e => { const newAnswers = [...answers]; newAnswers[i] = e.target.value; setAnswers(newAnswers); }} className={juniorStyles.input} />
                           </div>
                      ))}
                      <Button onClick={checkAnswers} className={juniorStyles.button}>I'M FINISHED! 🏆</Button>
                  </div>
              </div>
          ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="p-10 rounded-full bg-yellow-100 mb-6 animate-pulse"><BookOpen className="w-20 h-20 text-yellow-500"/></div>
                  <h2 className="text-3xl font-black text-slate-300">Choose a Magic Book</h2>
              </div>
          )}
      </div>
    </div>
  );
}