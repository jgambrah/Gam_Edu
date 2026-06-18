'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where, increment, getDocs, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, Trophy, Gift, Check, CheckCircle2, XCircle, Type, PlusCircle, PenSquare, FileText, Search, AlertTriangle, ShieldCheck, Activity, BrainCircuit, MessageSquare, Clapperboard, Users, Lightbulb, Microscope, Sparkles, Database, PenTool, Eraser, Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateJuniorScience, generateWordDetails } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAuth } from 'firebase/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

// --- HELPER: TEXT TO SPEECH ---
const speak = (text: string, rate = 0.9) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    window.speechSynthesis.speak(u);
};


// --- 1. VOICE COACH (THE SPEAKING ACADEMY) ---
function VoiceCoach({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    const [challenge, setChallenge] = useState<any>(null);
    const [isListening, setIsListening] = useState(false);
    const [feedback, setFeedback] = useState({ text: "Tap the Mic and say the word!", color: "text-slate-600" });
    const [activeMode, setActiveMode] = useState<'word' | 'syllable' | 'fluency'>('word');
    
    // Teacher/Admin State
    const [newWord, setNewWord] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [viewMode, setViewMode] = useState<'practice' | 'library'>('practice');

    const phonicsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_phonics'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: wordLibrary, forceRefetch } = useCollection<any>(phonicsQuery);

    const pickRandomWord = useCallback(() => {
        if (!wordLibrary || wordLibrary.length === 0) return;
        const random = wordLibrary[Math.floor(Math.random() * wordLibrary.length)];
        setChallenge(random);
        setFeedback({ text: "Ready when you are!", color: "text-slate-600" });
    }, [wordLibrary]);
    
    useEffect(() => { 
        if (wordLibrary && wordLibrary.length > 0 && !challenge) pickRandomWord();
    }, [wordLibrary, challenge, pickRandomWord]);

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Please use Chrome browser for voice features.");
            return;
        }
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.start();
        setIsListening(true);
        setFeedback({ text: "Listening... 👂", color: "text-blue-500" });

        recognition.onresult = (event: any) => {
            const spoken = event.results[0][0].transcript.toLowerCase();
            const targetWord = challenge.word.toLowerCase();
            const targetSentence = challenge.sentence.toLowerCase();
            setIsListening(false);

            if (activeMode === 'fluency') {
                // Check if they got the gist of the sentence
                const matchCount = targetSentence.split(' ').filter((word: string) => spoken.includes(word.replace(/[.,!]/g, ''))).length;
                if (matchCount >= targetSentence.split(' ').length / 2) {
                    onSuccess(spoken);
                } else {
                    onFailure(spoken);
                }
            } else {
                // Word or Syllable check
                if (spoken.includes(targetWord) || targetWord.includes(spoken)) {
                    onSuccess(spoken);
                } else {
                    onFailure(spoken);
                }
            }
        };

        recognition.onerror = () => {
            setIsListening(false);
            setFeedback({ text: "I didn't catch that. Try again!", color: "text-orange-500" });
        };
    };

    const onSuccess = (spoken: string) => {
        setFeedback({ text: `FANTASTIC! I heard "${spoken}"! 🎉`, color: "text-green-600" });
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        speak(`Excellent! ${challenge.word}`);
        setTimeout(pickRandomWord, 3000);
    };

    const onFailure = (spoken: string) => {
        setFeedback({ text: `I heard "${spoken}". Let's try once more!`, color: "text-red-500" });
        speak(`Close! Try saying ${activeMode === 'fluency' ? 'the whole sentence' : challenge.word}`);
    };

    // Helper to split word into syllables (Simple logic for Junior level)
    const getSyllables = (word: string) => {
        // This is a simplified visual breakdown
        return word.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy](?![aeiouy]))*/gi) || [word];
    };

    return (
        <div className="space-y-6">
            {/* Mode Switcher */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-pink-50/50 p-2.5 rounded-[24px] border-2 border-pink-100/60 shadow-inner">
                <div className="flex gap-1.5 bg-white p-1 rounded-2xl border border-pink-100 shadow-sm">
                    <Button 
                      size="sm" 
                      variant={activeMode === 'word' ? 'default' : 'ghost'} 
                      onClick={() => setActiveMode('word')} 
                      className={cn("rounded-xl font-black transition-all", activeMode === 'word' ? 'bg-pink-500 hover:bg-pink-600 text-white animate-none' : 'text-pink-600 hover:bg-pink-50 animate-none')}
                    >
                      Word
                    </Button>
                    <Button 
                      size="sm" 
                      variant={activeMode === 'syllable' ? 'default' : 'ghost'} 
                      onClick={() => setActiveMode('syllable')} 
                      className={cn("rounded-xl font-black transition-all", activeMode === 'syllable' ? 'bg-pink-500 hover:bg-pink-600 text-white animate-none' : 'text-pink-600 hover:bg-pink-50 animate-none')}
                    >
                      Syllables
                    </Button>
                    <Button 
                      size="sm" 
                      variant={activeMode === 'fluency' ? 'default' : 'ghost'} 
                      onClick={() => setActiveMode('fluency')} 
                      className={cn("rounded-xl font-black transition-all", activeMode === 'fluency' ? 'bg-pink-500 hover:bg-pink-600 text-white animate-none' : 'text-pink-600 hover:bg-pink-50 animate-none')}
                    >
                      Fluency
                    </Button>
                </div>
                {canEdit && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setViewMode(viewMode === 'practice' ? 'library' : 'practice')} 
                      className="border-pink-200 text-pink-600 hover:bg-pink-50 rounded-xl font-black transition-all shadow-sm"
                    >
                        {viewMode === 'practice' ? <Library className="w-4 h-4 mr-2"/> : <Mic className="w-4 h-4 mr-2"/>}
                        {viewMode === 'practice' ? 'Manage Words' : 'Back to Practice'}
                    </Button>
                )}
            </div>

            {viewMode === 'practice' && challenge && (
                <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in">
                    
                    {/* Visual Area */}
                    <div className="relative">
                        <div className="text-9xl mb-4 hover:scale-110 transition-transform duration-300 cursor-pointer drop-shadow-2xl bg-gradient-to-br from-pink-50 to-rose-50/50 p-6 rounded-full border-4 border-white shadow-lg" onClick={() => speak(challenge.word)}>
                            {challenge.emoji}
                        </div>
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-white p-2.5 rounded-full animate-bounce shadow-md">
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                    </div>

                    {/* Word Display Logic based on Mode */}
                    <div className="space-y-2">
                        {activeMode === 'syllable' ? (
                            <div className="flex flex-wrap gap-4 justify-center">
                                {getSyllables(challenge.word).map((syl: string, i: number) => {
                                    const blockColors = [
                                      'bg-gradient-to-b from-pink-100 to-pink-200 border-pink-300 text-pink-700 shadow-[0_6px_0_#fda4af]',
                                      'bg-gradient-to-b from-purple-100 to-purple-200 border-purple-300 text-purple-700 shadow-[0_6px_0_#d8b4fe]',
                                      'bg-gradient-to-b from-sky-100 to-sky-200 border-sky-300 text-sky-700 shadow-[0_6px_0_#7dd3fc]',
                                      'bg-gradient-to-b from-emerald-100 to-emerald-200 border-emerald-300 text-emerald-700 shadow-[0_6px_0_#6ee7b7]'
                                    ];
                                    const colorStyle = blockColors[i % blockColors.length];
                                    return (
                                        <span 
                                          key={i} 
                                          className={cn(
                                            "text-5xl font-black px-6 py-4 rounded-3xl border-2 transition-transform hover:scale-105 active:translate-y-1 cursor-pointer flex items-center justify-center min-w-[100px]",
                                            colorStyle
                                          )}
                                          onClick={() => speak(syl)}
                                        >
                                            {syl.toLowerCase()}
                                        </span>
                                    );
                                })}
                            </div>
                        ) : (
                            <h2 className="text-7xl font-black text-slate-800 tracking-tight capitalize">{challenge.word}</h2>
                        )}
                        <p className="text-2xl text-slate-400 font-mono tracking-wide">/{challenge.phonetic}/</p>
                    </div>

                    {/* Context/Fluency Area - Dialogue Bubble */}
                    <div 
                        className={cn(
                          "relative p-6 rounded-[32px] border-4 transition-all duration-300 max-w-lg cursor-pointer shadow-md",
                          activeMode === 'fluency' 
                            ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-300 scale-105 shadow-lg' 
                            : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100'
                        )}
                        onClick={() => speak(challenge.sentence)}
                    >
                        <div className={cn(
                          "absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[16px] transition-colors",
                          activeMode === 'fluency' ? 'border-t-indigo-300' : 'border-t-slate-200'
                        )}></div>
                        <div className={cn(
                          "absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white transition-colors",
                          activeMode === 'fluency' ? 'border-t-indigo-50' : 'border-t-slate-50'
                        )} style={{ top: 'calc(100% - 4px)' }}></div>

                        <p className={cn(
                          "text-xl font-bold text-center",
                          activeMode === 'fluency' ? 'text-indigo-800' : 'text-slate-600'
                        )}>
                            "{challenge.sentence}"
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-3 text-xs font-black uppercase tracking-wider opacity-60 text-slate-500">
                            <Volume2 className="w-4 h-4 text-indigo-500 animate-bounce"/> Click to hear the sentence
                        </div>
                    </div>

                    {/* Mic Interaction */}
                    <div className="flex flex-col items-center gap-6 pt-4">
                      <div className="relative flex items-center justify-center">
                        {isListening && (
                          <>
                            <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping duration-1000 scale-150"></div>
                            <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping duration-1500 scale-125" style={{ animationDelay: '0.5s' }}></div>
                          </>
                        )}
                        <button 
                            onClick={startListening}
                            disabled={isListening}
                            className={cn(
                              "relative z-10 h-32 w-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95",
                              isListening 
                                ? 'bg-red-500 ring-8 ring-red-100' 
                                : 'bg-gradient-to-tr from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 ring-8 ring-pink-50/50'
                            )}
                        >
                            {isListening ? (
                              <div className="flex gap-1.5 items-center justify-center">
                                {[1, 2, 3, 4].map(i => (
                                  <div 
                                    key={i} 
                                    className="w-2 h-10 bg-white rounded-full animate-bounce" 
                                    style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.6s' }}
                                  ></div>
                                ))}
                              </div>
                            ) : (
                              <Mic className="h-16 w-16 text-white drop-shadow-sm" />
                            )}
                        </button>
                      </div>
                        
                      <div className={cn(
                        "px-8 py-4 rounded-3xl font-black text-xl shadow-md border-2 bg-white transition-colors duration-300",
                        feedback.color === "text-green-600" ? "border-green-300 bg-green-50/50" : 
                        feedback.color === "text-red-500" ? "border-red-300 bg-red-50/50" : "border-slate-100 text-slate-700"
                      )}>
                          {feedback.text}
                      </div>
                    </div>

                    <Button onClick={pickRandomWord} variant="ghost" className="text-slate-400 hover:text-slate-600 font-bold hover:bg-slate-50 rounded-full py-6 px-6">
                        Try Another Word <ArrowRight className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
            )}

            {viewMode === 'library' && canEdit && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border-2 border-pink-100">
                        <h3 className="font-black text-xl mb-2 flex items-center gap-2 text-pink-700">
                          <Wand2 className="w-5 h-5 text-pink-500 animate-pulse"/> AI Curriculum Generator
                          <Badge className="bg-pink-100 text-pink-700 border-pink-200 ml-2 font-black text-[10px] uppercase">
                            Costs 5 Credits
                          </Badge>
                        </h3>
                        <p className="text-sm text-slate-500 mb-4">Add a word and the AI will generate the phonetics, a junior-friendly sentence, and an emoji!</p>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Enter word (e.g. Caterpillar)" 
                                value={newWord} 
                                onChange={e => setNewWord(e.target.value)}
                                className="text-lg h-12 rounded-xl"
                            />
                            <Button onClick={async () => {
                                if (!firestore) return;
                                setIsGenerating(true);
                                const res = await generateWordDetails({ word: newWord, schoolId: schoolId || '' });
                                if (res.success) {
                                    await addDoc(collection(firestore, 'junior_phonics'), { ...res.data, createdAt: serverTimestamp() });
                                    setNewWord("");
                                    forceRefetch();
                                    toast({ title: "Word Added!" });
                                }
                                setIsGenerating(false);
                            }} disabled={isGenerating || !newWord} className="bg-pink-600 hover:bg-pink-700 h-12 px-8 rounded-xl font-bold">
                                {isGenerating ? <Loader2 className="animate-spin"/> : "Add Word"}
                            </Button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {wordLibrary?.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-white border-2 border-slate-100/60 rounded-2xl hover:border-pink-200 transition-all hover:shadow-md group">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl bg-pink-50 p-2 rounded-xl">{item.emoji}</span>
                                    <div>
                                        <p className="font-black text-slate-700 leading-tight">{item.word}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">{item.phonetic}</p>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all" onClick={async () => {
                                    if(firestore) await deleteDoc(doc(firestore, 'junior_phonics', item.id));
                                }}>
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- 2. PHONICS FOREST (COMPREHENSIVE) ---
function PhonicsForest({ canEdit }: { canEdit: boolean }) {
    const { toast } = useToast();
    const firestore = useFirestore();
    const [activeTab, setActiveTab] = useState<'library' | 'blender' | 'families' | 'game'>('library');

    // Fetch custom sound cards
    const soundsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_phonics_sounds'), orderBy('createdAt', 'asc')) : null, [firestore]);
    const { data: dbSounds, forceRefetch: refetchSounds } = useCollection<any>(soundsQuery);

    // Fetch custom rhyming families
    const rhymesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_phonics_rhymes'), orderBy('createdAt', 'asc')) : null, [firestore]);
    const { data: dbRhymes, forceRefetch: refetchRhymes } = useCollection<any>(rhymesQuery);

    // Add state
    const [newSound, setNewSound] = useState({ sound: '', example: '', category: 'Short Vowels' });
    const [isAddingSound, setIsAddingSound] = useState(false);
    const [newRhyme, setNewRhyme] = useState({ family: '', words: '' });
    const [isAddingRhyme, setIsAddingRhyme] = useState(false);

    // Comprehensive Sound Categories (SSP Structured)
    const defaultSoundGroups = [
        { name: "Short Vowels", color: "bg-rose-100 text-rose-600 border-rose-200", sounds: ["a", "e", "i", "o", "u"], example: ["apple", "egg", "ink", "octopus", "up"] },
        { name: "Digraphs (2 letters, 1 sound)", color: "bg-teal-100 text-teal-600 border-teal-200", sounds: ["ch", "sh", "th", "ng", "qu", "wh"], example: ["chip", "ship", "thin", "ring", "queen", "whale"] },
        { name: "Long Vowels", color: "bg-purple-100 text-purple-600 border-purple-200", sounds: ["ai", "ee", "igh", "oa", "oo"], example: ["rain", "tree", "light", "boat", "moon"] },
        { name: "Trigraphs (3 letters, 1 sound)", color: "bg-orange-100 text-orange-600 border-orange-200", sounds: ["ear", "air", "ure", "igh"], example: ["near", "fair", "pure", "night"] },
        { name: "R-Controlled", color: "bg-amber-100 text-amber-600 border-amber-200", sounds: ["ar", "or", "ur", "er", "ir"], example: ["car", "fork", "surf", "her", "bird"] },
    ];

    const soundGroups = useMemo(() => {
        const groups = defaultSoundGroups.map(g => ({
            ...g,
            sounds: [...g.sounds],
            example: [...g.example],
            customIds: g.sounds.map(() => '') as string[]
        }));
        if (dbSounds) {
            dbSounds.forEach((item: any) => {
                const group = groups.find(g => g.name === item.category);
                if (group) {
                    const idx = group.sounds.indexOf(item.sound.toLowerCase().trim());
                    if (idx === -1) {
                        group.sounds.push(item.sound.toLowerCase().trim());
                        group.example.push(item.example.toLowerCase().trim());
                        group.customIds.push(item.id);
                    }
                }
            });
        }
        return groups;
    }, [dbSounds]);

    const defaultRhymeFamilies = [
        { family: "-at", words: ["cat", "hat", "mat", "sat"] },
        { family: "-ig", words: ["big", "dig", "pig", "wig"] },
        { family: "-op", words: ["hop", "mop", "pop", "top"] },
        { family: "-un", words: ["bun", "fun", "run", "sun"] }
    ];

    const rhymeFamilies = useMemo(() => {
        const families = defaultRhymeFamilies.map(f => ({ ...f, words: [...f.words], isCustom: false, id: '' }));
        if (dbRhymes) {
            dbRhymes.forEach((item: any) => {
                const existing = families.find(f => f.family.toLowerCase().trim() === item.family.toLowerCase().trim());
                if (existing) {
                    item.words.forEach((w: string) => {
                        const cleaned = w.toLowerCase().trim();
                        if (cleaned && !existing.words.includes(cleaned)) {
                            existing.words.push(cleaned);
                        }
                    });
                } else {
                    families.push({
                        family: item.family.toLowerCase().trim(),
                        words: item.words.map((w: string) => w.toLowerCase().trim()).filter(Boolean),
                        isCustom: true,
                        id: item.id
                    });
                }
            });
        }
        return families;
    }, [dbRhymes]);

    // Blending Station State
    const [blendingWord, setBlendingWord] = useState(["c", "a", "t"]);
    
    // Sound Match Game State
    const [gameTarget, setGameTarget] = useState<any>(null);
    const [gameOptions, setGameOptions] = useState<string[]>([]);
    
    const startNewGame = useCallback(() => {
        const allSounds = soundGroups.flatMap(g => g.sounds);
        if (allSounds.length === 0) return;
        const targetSound = allSounds[Math.floor(Math.random() * allSounds.length)];
        
        // Ensure options don't include the target, then add it back to shuffle
        let shuffledOptions = allSounds.filter(s => s !== targetSound).sort(() => 0.5 - Math.random()).slice(0, 3);
        shuffledOptions.push(targetSound);
        
        setGameTarget(targetSound);
        setGameOptions(shuffledOptions.sort(() => Math.random() - 0.5)); // Final shuffle
        speak(`Find the sound: ${targetSound}`);
    }, [soundGroups]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2 p-1.5 bg-teal-50/50 rounded-2xl w-fit mx-auto border border-teal-100/60 shadow-inner">
                <Button variant={activeTab === 'library' ? 'default' : 'ghost'} onClick={() => setActiveTab('library')} className={cn("rounded-xl font-bold transition-all animate-none", activeTab === 'library' ? 'bg-teal-500 text-white shadow-sm' : 'text-teal-700 hover:bg-teal-100/55')}>Sound Cards</Button>
                <Button variant={activeTab === 'blender' ? 'default' : 'ghost'} onClick={() => setActiveTab('blender')} className={cn("rounded-xl font-bold transition-all animate-none", activeTab === 'blender' ? 'bg-teal-500 text-white shadow-sm' : 'text-teal-700 hover:bg-teal-100/55')}>Blending Station</Button>
                <Button variant={activeTab === 'families' ? 'default' : 'ghost'} onClick={() => setActiveTab('families')} className={cn("rounded-xl font-bold transition-all animate-none", activeTab === 'families' ? 'bg-teal-500 text-white shadow-sm' : 'text-teal-700 hover:bg-teal-100/55')}>Word Families</Button>
                <Button variant={activeTab === 'game' ? 'default' : 'ghost'} onClick={() => {setActiveTab('game'); startNewGame();}} className={cn("rounded-xl font-bold transition-all animate-none", activeTab === 'game' ? 'bg-teal-500 text-white shadow-sm' : 'text-teal-700 hover:bg-teal-100/55')}>Sound Game</Button>
            </div>

            {/* PILLAR 1: THE SOUND LIBRARY */}
            {activeTab === 'library' && (
                <div className="space-y-8 animate-in fade-in">
                    {canEdit && (
                        <Card className="p-6 border-2 border-teal-200 bg-teal-50/30 rounded-3xl space-y-3 shadow-inner">
                            <h4 className="font-black text-teal-800 text-sm flex items-center gap-2">
                                <PlusCircle className="w-4 h-4" /> Add Custom Sound Card
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400">Category</label>
                                    <select 
                                        value={newSound.category} 
                                        onChange={e => setNewSound({...newSound, category: e.target.value})}
                                        className="w-full bg-white border rounded-lg text-sm p-1.5 outline-none font-bold"
                                    >
                                        <option value="Short Vowels">Short Vowels</option>
                                        <option value="Digraphs (2 letters, 1 sound)">Digraphs</option>
                                        <option value="Long Vowels">Long Vowels</option>
                                        <option value="Trigraphs (3 letters, 1 sound)">Trigraphs</option>
                                        <option value="R-Controlled">R-Controlled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400">Sound (e.g. sh)</label>
                                    <Input 
                                        placeholder="Sound" 
                                        value={newSound.sound} 
                                        onChange={e => setNewSound({...newSound, sound: e.target.value})} 
                                        className="bg-white text-sm animate-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400">Example Word (e.g. ship)</label>
                                    <Input 
                                        placeholder="Example" 
                                        value={newSound.example} 
                                        onChange={e => setNewSound({...newSound, example: e.target.value})} 
                                        className="bg-white text-sm animate-none"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button 
                                        onClick={async () => {
                                            if (!newSound.sound || !newSound.example || !firestore) return;
                                            setIsAddingSound(true);
                                            try {
                                                await addDoc(collection(firestore, 'junior_phonics_sounds'), {
                                                    sound: newSound.sound.trim().toLowerCase(),
                                                    example: newSound.example.trim().toLowerCase(),
                                                    category: newSound.category,
                                                    createdAt: serverTimestamp()
                                                });
                                                setNewSound({ sound: '', example: '', category: newSound.category });
                                                refetchSounds();
                                                toast({ title: "Sound card added to library!" });
                                            } catch (err) {
                                                toast({ title: "Error", description: "Failed to add sound card.", variant: "destructive" });
                                            } finally {
                                                setIsAddingSound(false);
                                            }
                                        }} 
                                        disabled={isAddingSound || !newSound.sound || !newSound.example}
                                        className="w-full bg-teal-600 h-10 rounded-xl"
                                    >
                                        {isAddingSound ? <Loader2 className="animate-spin" /> : "Add Card"}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {soundGroups.map((group) => (
                        <div key={group.name} className="space-y-3">
                            <h3 className="font-black text-slate-500 uppercase text-xs tracking-widest ml-2">{group.name}</h3>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                {group.sounds.map((sound, idx) => (
                                    <div 
                                        key={sound} 
                                        className="relative group"
                                    >
                                        <button 
                                            onClick={() => {
                                                speak(sound);
                                                toast({ title: `"${sound}" as in...`, description: group.example[idx].toUpperCase() });
                                            }} 
                                            className={cn(
                                              "w-full aspect-square rounded-[28px] border-2 border-b-[8px] font-black text-3xl shadow-md hover:-translate-y-1 hover:shadow-lg active:translate-y-0.5 active:border-b-2 transition-all flex flex-col items-center justify-center bg-white animate-none",
                                              group.name === "Short Vowels" && "border-rose-200 border-b-rose-400 text-rose-600 hover:bg-rose-50/20",
                                              group.name === "Digraphs (2 letters, 1 sound)" && "border-teal-200 border-b-teal-400 text-teal-600 hover:bg-teal-50/20",
                                              group.name === "Long Vowels" && "border-purple-200 border-b-purple-400 text-purple-600 hover:bg-purple-50/20",
                                              group.name === "Trigraphs (3 letters, 1 sound)" && "border-orange-200 border-b-orange-400 text-orange-600 hover:bg-orange-50/20",
                                              group.name === "R-Controlled" && "border-amber-200 border-b-amber-400 text-amber-600 hover:bg-amber-50/20"
                                            )}
                                        >
                                            <span className="text-4xl tracking-tight capitalize">{sound}</span>
                                            <span className="text-[10px] mt-2 font-black uppercase opacity-65 tracking-widest bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">{group.example[idx]}</span>
                                        </button>
                                        {canEdit && group.customIds[idx] && (
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (confirm("Delete this sound card?")) {
                                                        if (firestore) {
                                                            await deleteDoc(doc(firestore, 'junior_phonics_sounds', group.customIds[idx]));
                                                            refetchSounds();
                                                            toast({ title: "Sound card deleted." });
                                                        }
                                                    }
                                                }}
                                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-opacity bg-white/80 rounded-full"
                                            >
                                                <Trash2 className="w-3.5 h-3.5"/>
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PILLAR 2: BLENDING STATION */}
            {activeTab === 'blender' && (
                <div className="bg-gradient-to-br from-teal-50/50 via-white to-emerald-50/30 p-8 rounded-[40px] border-4 border-teal-100 text-center space-y-8 animate-in zoom-in shadow-inner relative overflow-hidden">
                    {/* Wooden track/shelf line effect */}
                    <div className="absolute top-[40%] left-0 right-0 h-4 bg-amber-800/10 -translate-y-1/2 pointer-events-none border-y border-amber-800/20"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-teal-800 flex items-center justify-center gap-2">Blending Train 🚂</h2>
                        <p className="text-teal-600 font-bold text-sm mt-1">Tap each sound block, then pull the lever to read!</p>
                    </div>
                    
                    <div className="relative z-10 flex justify-center gap-6 py-6">
                        {blendingWord.map((letter, i) => (
                            <button 
                                key={i}
                                onClick={() => speak(letter)}
                                className="w-24 h-32 bg-gradient-to-b from-white to-teal-50/50 rounded-3xl shadow-xl border-2 border-b-[12px] border-teal-200 hover:border-teal-300 text-5xl font-black text-teal-600 hover:scale-105 active:translate-y-2 active:border-b-4 transition-all flex items-center justify-center"
                            >
                                {letter}
                            </button>
                        ))}
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <Button 
                            onClick={() => {
                                speak(blendingWord.join(''), 0.7);
                                confetti({ colors: ['#2dd4bf', '#10b981'], particleCount: 60 });
                            }}
                            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 h-16 px-12 rounded-full text-2xl font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-none animate-none"
                        >
                            Read Word <Sparkles className="ml-2 animate-pulse" />
                        </Button>
                        <div className="space-y-2">
                            <p className="text-xs font-black uppercase text-teal-500/80 tracking-wider">Quick Words to Load</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {["cat", "dog", "ship", "fish", "rain", "sun", "jump", "tree"].map(w => (
                                    <button 
                                      key={w} 
                                      onClick={() => setBlendingWord(w.split(''))} 
                                      className="px-4 py-2 bg-white hover:bg-teal-50 border border-teal-100 rounded-full text-sm font-black text-teal-700 shadow-sm transition-all hover:scale-105"
                                    >
                                        {w}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PILLAR 3: WORD FAMILIES (RHYMES) */}
            {activeTab === 'families' && (
                <div className="space-y-6">
                    {canEdit && (
                        <Card className="p-6 border-2 border-teal-200 bg-teal-50/30 rounded-3xl space-y-3 shadow-inner">
                            <h4 className="font-black text-teal-800 text-sm flex items-center gap-2">
                                <PlusCircle className="w-4 h-4" /> Add Custom Rhyme Family
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400">Rhyme Family (e.g. -ot)</label>
                                    <Input 
                                        placeholder="-ot" 
                                        value={newRhyme.family} 
                                        onChange={e => setNewRhyme({...newRhyme, family: e.target.value})} 
                                        className="bg-white text-sm animate-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-slate-400">Words (comma separated, e.g. hot, pot, cot)</label>
                                    <Input 
                                        placeholder="hot, pot, cot" 
                                        value={newRhyme.words} 
                                        onChange={e => setNewRhyme({...newRhyme, words: e.target.value})} 
                                        className="bg-white text-sm animate-none"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button 
                                        onClick={async () => {
                                            if (!newRhyme.family || !newRhyme.words || !firestore) return;
                                            setIsAddingRhyme(true);
                                            try {
                                                const wordsArr = newRhyme.words.split(',').map(w => w.trim().toLowerCase()).filter(Boolean);
                                                await addDoc(collection(firestore, 'junior_phonics_rhymes'), {
                                                    family: newRhyme.family.trim().toLowerCase(),
                                                    words: wordsArr,
                                                    createdAt: serverTimestamp()
                                                });
                                                setNewRhyme({ family: '', words: '' });
                                                refetchRhymes();
                                                toast({ title: "Rhyme family added!" });
                                            } catch (err) {
                                                toast({ title: "Error", description: "Failed to add rhyme family.", variant: "destructive" });
                                            } finally {
                                                setIsAddingRhyme(false);
                                            }
                                        }} 
                                        disabled={isAddingRhyme || !newRhyme.family || !newRhyme.words}
                                        className="w-full bg-teal-600 h-10 rounded-xl"
                                    >
                                        {isAddingRhyme ? <Loader2 className="animate-spin" /> : "Add Family"}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4">
                        {rhymeFamilies.map((item, index) => {
                            const rhymingColors = [
                              'border-indigo-100 hover:border-indigo-300 bg-indigo-50/10 shadow-indigo-100/50',
                              'border-purple-100 hover:border-purple-300 bg-purple-50/10 shadow-purple-100/50',
                              'border-pink-100 hover:border-pink-300 bg-pink-50/10 shadow-pink-100/50',
                              'border-emerald-100 hover:border-emerald-300 bg-emerald-50/10 shadow-emerald-100/50'
                            ];
                            const colorStyle = rhymingColors[index % rhymingColors.length];
                            return (
                                <div key={item.family} className={cn("relative group bg-white p-6 rounded-[32px] border-2 border-b-8 shadow-md text-center transition-all hover:-translate-y-1 duration-300", colorStyle)}>
                                    <div className="bg-gradient-to-b from-teal-500 to-emerald-600 text-white w-14 h-14 flex items-center justify-center rounded-2xl mx-auto mb-4 font-black text-2xl shadow-md">
                                        {item.family}
                                    </div>
                                    <div className="space-y-2">
                                        {item.words.map(w => (
                                            <button key={w} onClick={() => speak(w)} className="block w-full py-1.5 text-slate-600 font-bold hover:text-teal-600 hover:bg-teal-50/30 rounded-lg transition-colors capitalize">
                                                {w}
                                            </button>
                                        ))}
                                    </div>
                                    {canEdit && item.isCustom && item.id && (
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                if (confirm("Delete this rhyming family?")) {
                                                    if (firestore) {
                                                        await deleteDoc(doc(firestore, 'junior_phonics_rhymes', item.id));
                                                        refetchRhymes();
                                                        toast({ title: "Rhyming family deleted." });
                                                    }
                                                }
                                            }}
                                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full shadow-sm bg-white/95"
                                        >
                                            <Trash2 className="w-3.5 h-3.5"/>
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* PILLAR 4: SOUND MATCH GAME */}
            {activeTab === 'game' && gameTarget && (
                <div className="text-center py-12 space-y-8 animate-in zoom-in">
                    <div className="space-y-2">
                        <h3 className="text-4xl font-black text-slate-800">Which block says...</h3>
                        <div className="h-16 flex items-center justify-center">
                            <Button size="lg" variant="outline" onClick={() => speak(gameTarget)} className="rounded-full border-2 border-teal-200 hover:bg-teal-50 font-black px-6 py-6 shadow-sm animate-none">
                                <Volume2 className="mr-2 h-6 w-6 text-teal-500 animate-pulse" /> Hear Sound Again
                            </Button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                        {gameOptions.map((opt) => (
                            <button 
                                key={opt} 
                                onClick={() => {
                                    if (opt === gameTarget) {
                                        confetti();
                                        speak("Correct!");
                                        startNewGame();
                                    } else {
                                        speak("Try again");
                                        toast({ title: "Oops!", description: "Keep trying, you can do it!", variant: "destructive" });
                                    }
                                }}
                                className="h-24 bg-white border-2 border-b-[8px] border-slate-200 rounded-3xl text-5xl font-black text-slate-700 hover:border-teal-400 hover:bg-teal-50 hover:shadow-lg active:translate-y-1 active:border-b-2 transition-all shadow-md"
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- 3. ABC KINGDOM (ALPHABET ACADEMY) ---
function ABCKingdom({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'explorer' | 'tracing' | 'matcher'>('explorer');
    const [selectedLetter, setSelectedLetter] = useState('A');
    const [caseMode, setCaseMode] = useState<'upper' | 'lower' | 'both'>('upper');
    const [wordIndex, setWordIndex] = useState(0);
    
    // Tracing Canvas Refs
    const traceCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isTracing, setIsTracing] = useState(false);

    // Dynamic ABC custom words state
    const [newAbcWord, setNewAbcWord] = useState({ letter: 'A', word: '', emoji: '', phonic: '' });
    const [isAddingAbc, setIsAddingAbc] = useState(false);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    const defaultDict: Record<string, { word: string, emoji: string, phonic: string }[]> = {
        A: [{ word: "Apple", emoji: "🍎", phonic: "ah" }],
        B: [{ word: "Ball", emoji: "⚽", phonic: "buh" }],
        C: [{ word: "Cat", emoji: "🐱", phonic: "cuh" }],
        D: [{ word: "Dog", emoji: "🐶", phonic: "duh" }],
        E: [{ word: "Egg", emoji: "🥚", phonic: "eh" }],
        F: [{ word: "Fish", emoji: "🐟", phonic: "fuh" }],
        G: [{ word: "Goat", emoji: "🐐", phonic: "guh" }],
        H: [{ word: "Hat", emoji: "👒", phonic: "huh" }],
        I: [{ word: "Igloo", emoji: "❄️", phonic: "ih" }],
        J: [{ word: "Jam", emoji: "🍓", phonic: "juh" }],
        K: [{ word: "Kite", emoji: "🪁", phonic: "kuh" }],
        L: [{ word: "Lion", emoji: "🦁", phonic: "luh" }],
        M: [{ word: "Moon", emoji: "🌙", phonic: "muh" }],
        N: [{ word: "Net", emoji: "🕸️", phonic: "nuh" }],
        O: [{ word: "Octopus", emoji: "🐙", phonic: "oh" }],
        P: [{ word: "Pig", emoji: "🐷", phonic: "puh" }],
        Q: [{ word: "Queen", emoji: "👑", phonic: "quuh" }],
        R: [{ word: "Rabbit", emoji: "🐰", phonic: "ruh" }],
        S: [{ word: "Sun", emoji: "☀️", phonic: "suh" }],
        T: [{ word: "Tiger", emoji: "🐯", phonic: "tuh" }],
        U: [{ word: "Umbrella", emoji: "☔", phonic: "uh" }],
        V: [{ word: "Van", emoji: "🚐", phonic: "vuh" }],
        W: [{ word: "Watch", emoji: "⌚", phonic: "wuh" }],
        X: [{ word: "Xylophone", emoji: "🎹", phonic: "ks" }],
        Y: [{ word: "Yo-yo", emoji: "🪀", phonic: "yuh" }],
        Z: [{ word: "Zebra", emoji: "🦓", phonic: "zuh" }]
    };

    // Fetch custom ABC words from Firestore
    const abcQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_abc_words'), orderBy('createdAt', 'asc')) : null, [firestore]);
    const { data: dbAbcWords, forceRefetch: refetchAbc } = useCollection<any>(abcQuery);

    const mergedDict = useMemo(() => {
        const copy = JSON.parse(JSON.stringify(defaultDict));
        if (dbAbcWords) {
            dbAbcWords.forEach((item: any) => {
                const letter = String(item.letter).toUpperCase();
                if (copy[letter]) {
                    if (!copy[letter].some((w: any) => w.word.toLowerCase() === item.word.toLowerCase())) {
                        copy[letter].push({ word: item.word, emoji: item.emoji, phonic: item.phonic, isCustom: true, id: item.id });
                    }
                }
            });
        }
        return copy;
    }, [dbAbcWords]);

    const handleLetterClick = (letter: string) => {
        setSelectedLetter(letter);
        setWordIndex(0);
        if (activeTab === 'explorer') {
            const list = mergedDict[letter] || [];
            const data = list[0] || { word: '', emoji: '', phonic: '' };
            speak(letter); // Say Letter Name
            if (data.word) {
                setTimeout(() => speak(`${data.phonic}, as in, ${data.word}`), 800);
            }
        }
    };

    const handleAddAbcWord = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAbcWord.word || !newAbcWord.emoji || !firestore) return;
        setIsAddingAbc(true);
        try {
            await addDoc(collection(firestore, 'junior_abc_words'), {
                letter: newAbcWord.letter.toUpperCase().trim(),
                word: newAbcWord.word.trim(),
                emoji: newAbcWord.emoji.trim(),
                phonic: newAbcWord.phonic.trim().toLowerCase(),
                createdAt: serverTimestamp()
            });
            setNewAbcWord({ letter: newAbcWord.letter, word: '', emoji: '', phonic: '' });
            refetchAbc();
            toast({ title: "Word card added to ABC Kingdom!" });
        } catch (err) {
            toast({ title: "Error", description: "Failed to add word card.", variant: "destructive" });
        } finally {
            setIsAddingAbc(false);
        }
    };

    const handleDeleteAbcWord = async (id: string) => {
        if (!firestore) return;
        if (confirm("Delete this word card from ABC Kingdom?")) {
            await deleteDoc(doc(firestore, 'junior_abc_words', id));
            refetchAbc();
            setWordIndex(0);
            toast({ title: "Word card deleted." });
        }
    };

    // Tracing Logic
    useEffect(() => {
        if (activeTab === 'tracing' && traceCanvasRef.current) {
            const ctx = traceCanvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, 400, 400);
                ctx.font = "bold 300px sans-serif";
                ctx.fillStyle = "#f1f5f9"; // Ghost letter
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(selectedLetter, 200, 220);
            }
        }
    }, [selectedLetter, activeTab]);

    const startTracing = (e: any) => {
        const ctx = traceCanvasRef.current?.getContext('2d');
        if (!ctx) return;
        const rect = traceCanvasRef.current!.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.strokeStyle = "#10b981"; ctx.lineWidth = 20; ctx.lineCap = "round";
        setIsTracing(true);
    };

    const draw = (e: any) => {
        if (!isTracing) return;
        const canvas = traceCanvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
        ctx.lineTo(x, y); ctx.stroke();
    };

    const stopTracing = () => {
        setIsTracing(false);
    };

    const resetTracingCanvas = () => {
        const canvas = traceCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "bold 300px sans-serif";
            ctx.fillStyle = "#f1f5f9";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(selectedLetter, 200, 220);
        }
    };

    const currentWordList = mergedDict[selectedLetter] || [];
    const currentWordData = currentWordList[wordIndex] || { word: 'None', emoji: '❓', phonic: '' };

    return (
        <div className="space-y-8">
            {/* 1. TOP NAVIGATION */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-green-50/50 rounded-2xl w-fit mx-auto border border-green-100/60 shadow-inner">
                <Button variant={activeTab === 'explorer' ? 'default' : 'ghost'} onClick={() => { setActiveTab('explorer'); setWordIndex(0); }} className={cn("rounded-xl font-bold transition-all animate-none", activeTab === 'explorer' ? 'bg-green-500 text-white shadow-sm' : 'text-green-700 hover:bg-green-100/50')}>Explorer</Button>
                <Button variant={activeTab === 'tracing' ? 'default' : 'ghost'} onClick={() => setActiveTab('tracing')} className={cn("rounded-xl font-bold transition-all animate-none", activeTab === 'tracing' ? 'bg-green-500 text-white shadow-sm' : 'text-green-700 hover:bg-green-100/50')}>Tracing Lab</Button>
                <Button variant={activeTab === 'matcher' ? 'default' : 'ghost'} onClick={() => setActiveTab('matcher')} className={cn("rounded-xl font-bold transition-all animate-none", activeTab === 'matcher' ? 'bg-green-500 text-white shadow-sm' : 'text-green-700 hover:bg-green-100/50')}>Matcher Game</Button>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
                {/* 2. LETTER GRID (SIDEBAR ON DESKTOP) */}
                <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
                    <div className="flex justify-center gap-2 mb-4 bg-slate-50 p-1.5 border border-slate-100 rounded-2xl w-fit mx-auto">
                        <Button size="sm" variant={caseMode === 'upper' ? 'secondary' : 'outline'} onClick={() => setCaseMode('upper')} className="font-extrabold rounded-xl h-8 px-4">ABC</Button>
                        <Button size="sm" variant={caseMode === 'lower' ? 'secondary' : 'outline'} onClick={() => setCaseMode('lower')} className="font-extrabold rounded-xl h-8 px-4">abc</Button>
                        <Button size="sm" variant={caseMode === 'both' ? 'secondary' : 'outline'} onClick={() => setCaseMode('both')} className="font-extrabold rounded-xl h-8 px-4">Aa</Button>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-2 bg-green-50/20 p-4 rounded-3xl border border-green-100/50 shadow-inner">
                        {alphabet.map(letter => (
                            <button 
                                key={letter}
                                onClick={() => handleLetterClick(letter)}
                                className={cn(
                                  "aspect-square rounded-[20px] font-black text-xl transition-all border-2 border-b-6 active:translate-y-0.5 active:border-b-2 shadow-sm",
                                  selectedLetter === letter 
                                    ? 'bg-gradient-to-b from-green-400 to-emerald-500 text-white border-green-600 shadow-md -translate-y-0.5' 
                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-green-50/50 hover:text-green-600'
                                )}
                            >
                                {caseMode === 'upper' ? letter : caseMode === 'lower' ? letter.toLowerCase() : `${letter}${letter.toLowerCase()}`}
                            </button>
                        ))}
                    </div>

                    {/* Add Custom Word Form for Teachers */}
                    {canEdit && (
                        <Card className="p-4 border-2 border-green-200 bg-green-50/30 rounded-3xl space-y-3 shadow-inner">
                            <h4 className="font-black text-green-800 text-sm flex items-center gap-2">
                                <PlusCircle className="w-4 h-4 text-green-600" /> Add Word to Letter
                            </h4>
                            <form onSubmit={handleAddAbcWord} className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400">Letter</label>
                                        <select 
                                            value={newAbcWord.letter} 
                                            onChange={e => setNewAbcWord({...newAbcWord, letter: e.target.value})}
                                            className="w-full bg-white border border-slate-200 rounded-lg text-sm p-1.5 outline-none font-bold"
                                        >
                                            {alphabet.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400">Word</label>
                                        <Input 
                                            placeholder="e.g. Ant" 
                                            value={newAbcWord.word} 
                                            onChange={e => setNewAbcWord({...newAbcWord, word: e.target.value})} 
                                            className="bg-white rounded-lg h-8 text-xs px-2 animate-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400">Emoji</label>
                                        <Input 
                                            placeholder="e.g. 🐜" 
                                            value={newAbcWord.emoji} 
                                            onChange={e => setNewAbcWord({...newAbcWord, emoji: e.target.value})} 
                                            className="bg-white rounded-lg h-8 text-xs text-center px-2 animate-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-bold text-slate-400">Phonic</label>
                                        <Input 
                                            placeholder="e.g. ah" 
                                            value={newAbcWord.phonic} 
                                            onChange={e => setNewAbcWord({...newAbcWord, phonic: e.target.value})} 
                                            className="bg-white rounded-lg h-8 text-xs px-2 animate-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" disabled={isAddingAbc} className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-xs h-8 shadow-sm">
                                    {isAddingAbc ? <Loader2 className="animate-spin h-3 w-3" /> : "Save Word Card"}
                                </Button>
                            </form>
                        </Card>
                    )}
                </div>

                {/* 3. INTERACTIVE STAGE */}
                <div className="lg:col-span-3 order-1 lg:order-2">
                    <Card className="rounded-[40px] border-4 border-green-100 shadow-xl overflow-hidden h-full">
                        <CardContent className="p-0">
                            
                            {/* EXPLORER MODE */}
                            {activeTab === 'explorer' && (
                                <div className="p-8 text-center space-y-8 animate-in zoom-in relative group">
                                    {currentWordData.isCustom && canEdit && (
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="absolute top-4 right-4 text-red-350 hover:text-red-500 hover:bg-red-50 rounded-full"
                                            onClick={() => handleDeleteAbcWord(currentWordData.id)}
                                        >
                                            <Trash2 className="w-5 h-5"/>
                                        </Button>
                                    )}

                                    <div className="flex justify-center gap-4 items-end">
                                        <h1 className="text-[180px] font-black text-green-500 leading-none drop-shadow-sm select-none">{selectedLetter}</h1>
                                        <h2 className="text-[100px] font-black text-green-300 leading-none select-none">{selectedLetter.toLowerCase()}</h2>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50/50 p-8 rounded-[40px] border-4 border-green-200 shadow-inner animate-in fade-in duration-300" key={`${selectedLetter}-${wordIndex}`}>
                                        <div className="text-9xl mb-4 drop-shadow-md hover:scale-110 transition-transform duration-300 cursor-pointer" onClick={() => speak(currentWordData.word)}>{currentWordData.emoji}</div>
                                        <h3 className="text-5xl font-black text-slate-800">{currentWordData.word}</h3>
                                        <p className="text-2xl font-black text-green-500 mt-2">Sound: <span className="underline">"{currentWordData.phonic}"</span></p>
                                    </div>
                                    <div className="flex gap-4 justify-center">
                                        <Button onClick={() => {
                                            speak(selectedLetter);
                                            setTimeout(() => speak(`${currentWordData.phonic}, as in, ${currentWordData.word}`), 800);
                                        }} className="h-16 px-12 rounded-full text-xl bg-green-600 hover:bg-green-700 shadow-md">
                                            <Volume2 className="mr-3" /> Listen
                                        </Button>
                                        
                                        {currentWordList.length > 1 && (
                                            <Button 
                                                onClick={() => {
                                                    const nextIdx = (wordIndex + 1) % currentWordList.length;
                                                    setWordIndex(nextIdx);
                                                    const data = currentWordList[nextIdx];
                                                    speak(data.word);
                                                }} 
                                                variant="outline"
                                                className="h-16 px-8 rounded-full text-xl border-2 border-green-200 text-green-700 font-bold hover:bg-green-50 shadow-sm"
                                            >
                                                Next Word ➡️
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TRACING MODE */}
                            {activeTab === 'tracing' && (
                                <div className="p-8 flex flex-col items-center space-y-6 animate-in slide-in-from-right-4">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-black text-slate-800">Can you trace the letter {selectedLetter}?</h3>
                                        <p className="text-slate-500 font-bold text-sm">Use your finger or mouse to draw!</p>
                                    </div>
                                    <div className="relative bg-amber-50 p-6 rounded-[36px] border-8 border-amber-800 shadow-2xl flex items-center justify-center">
                                        {/* Wooden frame pegs */}
                                        <div className="absolute top-2 left-4 w-4 h-4 rounded-full bg-amber-900/40"></div>
                                        <div className="absolute top-2 right-4 w-4 h-4 rounded-full bg-amber-900/40"></div>
                                        <div className="bg-white rounded-2xl overflow-hidden shadow-inner border border-amber-900/10">
                                            <canvas 
                                                ref={traceCanvasRef} width={400} height={400} 
                                                className="touch-none cursor-crosshair"
                                                onMouseDown={startTracing}
                                                onMouseMove={draw}
                                                onMouseUp={stopTracing}
                                                onMouseLeave={stopTracing}
                                                onTouchStart={startTracing}
                                                onTouchMove={draw}
                                                onTouchEnd={stopTracing}
                                            />
                                        </div>
                                        <Button 
                                            variant="ghost" size="sm" 
                                            className="absolute bottom-2 right-8 text-slate-400 hover:text-slate-600 font-black"
                                            onClick={resetTracingCanvas}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                    <p className="text-xs font-black text-emerald-500 uppercase tracking-widest animate-pulse">★ Start at the top! ★</p>
                                </div>
                            )}

                            {/* MATCHER GAME */}
                            {activeTab === 'matcher' && (
                                <div className="p-8 text-center space-y-8 animate-in fade-in" key={selectedLetter}>
                                    <h3 className="text-3xl font-black text-slate-800">Find the Lower Case!</h3>
                                    <div className="text-[120px] font-black text-green-600 mb-8 bg-green-50 w-40 h-40 flex items-center justify-center rounded-3xl mx-auto shadow-sm">
                                        {selectedLetter}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                                        {[
                                            selectedLetter.toLowerCase(), 
                                            alphabet[(alphabet.indexOf(selectedLetter) + 5) % 26].toLowerCase(),
                                            alphabet[(alphabet.indexOf(selectedLetter) + 12) % 26].toLowerCase(),
                                            alphabet[(alphabet.indexOf(selectedLetter) + 19) % 26].toLowerCase(),
                                        ].sort(() => Math.random() - 0.5).map((char, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => {
                                                    if (char === selectedLetter.toLowerCase()) {
                                                        confetti();
                                                        speak("Correct!");
                                                        setSelectedLetter(alphabet[Math.floor(Math.random()*26)]);
                                                    } else {
                                                        speak("Try again");
                                                    }
                                                }}
                                                className="h-24 bg-white border-2 border-b-[8px] border-slate-100 rounded-3xl text-5xl font-black text-slate-700 hover:border-green-400 hover:bg-green-50 active:translate-y-1 active:border-b-2 transition-all shadow-md"
                                            >
                                                {char}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// --- 4. MATH PLAYGROUND (ULTIMATE VERSION) ---
function MathPlayground() {
  type MathMode = 'add' | 'sub' | 'mul' | 'div' | 'compare' | 'patterns' | 'shapes' | 'time';
  const [mode, setMode] = useState<MathMode>('add');
  const [question, setQuestion] = useState<any>({ a: 0, b: 0, icon: '🍎', ans: '', options: [], displayPrompt: "" });
  const [feedback, setFeedback] = useState("");
  const [streak, setStreak] = useState(0);
  const { user } = useUser(); 
  const firestore = useFirestore(); 
  const { toast } = useToast();

  const generateQuestion = useCallback(() => {
    const icons = ['🍎', '🍓', '🐶', '🐱', '⭐', '🚗', '🦖', '🍪', '🎈', '⚽️'];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    let a, b, ans, options: any[] = [];
    let displayPrompt = "";

    switch (mode) {
      case 'add':
        a = Math.floor(Math.random() * 9) + 1; b = Math.floor(Math.random() * 9) + 1;
        ans = a + b;
        options = [ans, ans + 1, Math.max(0, ans - 1)].sort(() => Math.random() - 0.5);
        break;
      case 'sub':
        a = Math.floor(Math.random() * 10) + 5; b = Math.floor(Math.random() * a);
        ans = a - b;
        options = [ans, ans + 2, Math.max(0, ans - 1)].sort(() => Math.random() - 0.5);
        break;
      case 'mul':
        a = Math.floor(Math.random() * 4) + 2; // Rows
        b = Math.floor(Math.random() * 4) + 2; // Columns
        ans = a * b;
        displayPrompt = `${a} groups of ${b}`;
        options = [ans, ans + b, ans - a].filter(n => n > 0).sort(() => Math.random() - 0.5);
        if (options.length < 3) options.push(ans + 1);
        break;
      case 'div':
        b = Math.floor(Math.random() * 3) + 2; // Divisor (groups)
        ans = Math.floor(Math.random() * 4) + 2; // Quotient (items per group)
        a = b * ans; // Dividend (total)
        displayPrompt = `Share ${a} into ${b} groups`;
        options = [ans, ans + 1, Math.max(1, ans - 1)].sort(() => Math.random() - 0.5);
        break;
      case 'compare':
        a = Math.floor(Math.random() * 20); b = Math.floor(Math.random() * 20);
        ans = a > b ? '>' : a < b ? '<' : '=';
        options = ['>', '<', '='];
        displayPrompt = `${a} ___ ${b}`;
        break;
      case 'patterns':
        const step = Math.floor(Math.random() * 3) + 1;
        const start = Math.floor(Math.random() * 10);
        a = [start, start + step, start + step * 2];
        ans = start + step * 3;
        options = [ans, ans + 1, ans + step + 1].sort(() => Math.random() - 0.5);
        displayPrompt = `${a[0]}, ${a[1]}, ${a[2]}, ?`;
        break;
      case 'shapes':
        const shapes = [
            { name: 'Triangle', icon: '▲' }, { name: 'Square', icon: '■' },
            { name: 'Pentagon', icon: '⬠' }, { name: 'Circle', icon: '●' }
        ];
        const s = shapes[Math.floor(Math.random() * shapes.length)];
        a = s.icon; ans = s.name;
        options = shapes.map(sh => sh.name).sort(() => Math.random() - 0.5);
        displayPrompt = `What shape is this?`;
        break;
      case 'time':
        const hr = Math.floor(Math.random() * 12) + 1;
        a = `${hr}:00`; ans = `${hr} o'clock`;
        options = [ans, `${(hr % 12) + 1} o'clock`, `${hr === 1 ? 12 : hr - 1} o'clock`].sort(() => Math.random() - 0.5);
        displayPrompt = `The clock says...`;
        break;
    }

    setQuestion({ a, b, icon, ans, options, displayPrompt });
    setFeedback("");
  }, [mode]);

  useEffect(() => { generateQuestion(); }, [generateQuestion]);

  const checkAnswer = async (val: any) => {
    if (val === question.ans) {
      setStreak(s => s + 1);
      setFeedback("CORRECT! 🎉");
      confetti({ particleCount: 100, spread: 70 });
      speak("Correct!");

      if ((streak + 1) % 5 === 0 && user && firestore) {
          const sticker = '🎓';
          await addDoc(collection(firestore, 'junior_stickers'), {
              userId: user.uid,
              emoji: sticker,
              name: `${mode.toUpperCase()} Master`,
              category: 'math',
              earnedAt: serverTimestamp()
          });
          toast({ title: "Achievement!", description: "You earned a Math Master sticker!" });
      }
      setTimeout(generateQuestion, 1500);
    } else {
      setStreak(0);
      setFeedback("Try Again! 🤔");
      speak("Not quite.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex gap-2 p-1.5 bg-orange-50/50 rounded-2xl w-full overflow-x-auto no-scrollbar border border-orange-100/50 shadow-inner">
          {(['add', 'sub', 'mul', 'div', 'compare', 'patterns', 'shapes', 'time'] as MathMode[]).map((m) => (
            <Button 
                key={m}
                variant={mode === m ? 'default' : 'ghost'} 
                onClick={() => setMode(m)} 
                className={cn(
                  "rounded-xl capitalize font-black min-w-[100px] transition-all animate-none text-sm h-10 px-4",
                  mode === m 
                    ? 'bg-gradient-to-b from-orange-400 to-amber-500 text-white shadow-md border-b-4 border-orange-600' 
                    : 'text-orange-700 hover:bg-orange-100/40 border border-transparent hover:border-orange-200/50'
                )}
            >
                {m === 'mul' ? '× Multi' : m === 'div' ? '÷ Divide' : m}
            </Button>
          ))}
      </div>

      <Card className="w-full max-w-md bg-white border-4 border-b-[12px] border-orange-200 shadow-2xl rounded-[40px] overflow-hidden">
        <CardContent className="p-8 flex flex-col items-center min-h-[320px] justify-center relative">
            {/* Decorative background stars */}
            <div className="absolute top-4 left-4 text-orange-200 select-none animate-pulse">★</div>
            <div className="absolute bottom-4 right-4 text-orange-200 select-none animate-pulse">★</div>
            
            {/* MULTIPLICATION: Array Grid Visual */}
            {mode === 'mul' && (
                <div className="grid gap-3 mb-6 p-4 bg-orange-50/40 rounded-3xl border-2 border-orange-100/30 shadow-inner" style={{ gridTemplateColumns: `repeat(${question.b}, minmax(0, 1fr))` }}>
                    {Array.from({ length: question.a * question.b }).map((_, i) => (
                        <div key={i} className="text-4xl hover:scale-125 transition-transform duration-200 cursor-pointer animate-in zoom-in-50 flex items-center justify-center p-1 bg-white rounded-xl shadow-sm border border-orange-100">
                            {question.icon}
                        </div>
                    ))}
                </div>
            )}

            {/* DIVISION: Sharing into Groups Visual */}
            {mode === 'div' && (
                <div className="space-y-6 mb-6 w-full">
                    <div className="flex flex-wrap justify-center gap-2 border-b-2 border-dashed border-orange-100 pb-4 bg-orange-50/20 p-3 rounded-2xl">
                        {Array.from({ length: question.a }).map((_, i) => (
                            <span key={i} className="text-3xl hover:scale-110 transition-transform cursor-pointer">{question.icon}</span>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        {Array.from({ length: question.b }).map((_, i) => (
                            <div key={i} className="w-16 h-16 bg-orange-50/80 border-4 border-dashed border-orange-300 rounded-2xl flex flex-col items-center justify-center text-[10px] text-orange-655 font-extrabold shadow-inner hover:scale-105 transition-transform">
                                <span>Bowl {i+1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(mode === 'add' || mode === 'sub') && (
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="bg-amber-50/60 p-4 border border-amber-250 rounded-3xl flex gap-1.5 justify-center flex-wrap max-w-[140px] min-h-[60px] items-center shadow-inner">
                        {Array.from({ length: question.a }).map((_, i) => (
                            <span key={i} className="text-3xl hover:scale-110 transition-transform">{question.icon}</span>
                        ))}
                    </div>
                    <span className="text-4xl font-black text-orange-500 animate-pulse">{mode === 'add' ? '+' : '-'}</span>
                    <div className="bg-orange-50/60 p-4 border border-orange-200 rounded-3xl flex gap-1.5 justify-center flex-wrap max-w-[140px] min-h-[60px] items-center shadow-inner">
                        {Array.from({ length: question.b }).map((_, i) => (
                            <span key={i} className="text-3xl opacity-50 hover:scale-110 transition-transform">{question.icon}</span>
                        ))}
                    </div>
                </div>
            )}
            
            {mode === 'shapes' && (
                <div className="text-9xl text-indigo-500 mb-6 drop-shadow-md hover:rotate-12 transition-transform duration-300 select-none animate-in zoom-in-75">
                    {question.a}
                </div>
            )}
            
            {mode === 'time' && (
                <div className="w-44 h-44 rounded-full border-[10px] border-orange-500 flex items-center justify-center mb-6 relative bg-white shadow-2xl ring-8 ring-orange-100/50 scale-105">
                    {/* Clock Numbers */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-black text-slate-700">12</div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-black text-slate-700">6</div>
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-700">9</div>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-black text-slate-700">3</div>
                    
                    {/* Center Pin */}
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-orange-600 rounded-full z-20 -translate-x-1/2 -translate-y-1/2 shadow-md"></div>
                    
                    {/* Hour Hand (shorter, rotating) */}
                    <div 
                        className="absolute top-1/2 left-1/2 w-2 h-10 bg-slate-805 rounded-full z-10" 
                        style={{ 
                            transform: `translate(-50%, -100%) rotate(${(typeof question.a === 'string' ? parseInt(question.a.split(':')[0]) : 0) % 12 * 30}deg)`,
                            transformOrigin: 'bottom center'
                        }}
                    ></div>
                    
                    {/* Minute Hand (longer, static pointing to 12) */}
                    <div 
                        className="absolute top-1/2 left-1/2 w-1.5 h-14 bg-slate-500 rounded-full" 
                        style={{ 
                            transform: 'translate(-50%, -100%) rotate(0deg)',
                            transformOrigin: 'bottom center'
                        }}
                    ></div>
                </div>
            )}
            
            <div className="text-center mt-2">
                <p className="text-orange-400 font-extrabold uppercase tracking-widest text-[11px] mb-2">{question.displayPrompt || 'Solve'}</p>
                <div className="text-5xl font-black text-slate-800">
                    {(mode === 'add' || mode === 'sub') && (
                        <div className="flex items-center justify-center gap-3">
                            <span>{question.a}</span>
                            <span className="text-orange-400">{mode === 'add' ? '+' : '-'}</span>
                            <span>{question.b}</span>
                            <span className="text-slate-300">=</span>
                            <span className="text-orange-500 font-black animate-pulse">?</span>
                        </div>
                    )}
                    {(mode === 'compare' || mode === 'patterns') && (
                        <span className="text-6xl tracking-tighter font-black text-orange-600">{question.displayPrompt}</span>
                    )}
                    {(mode === 'mul' || mode === 'div' || mode === 'shapes' || mode === 'time') && (
                        <span className="font-black text-orange-600">{question.displayPrompt ? "" : question.a}</span>
                    )}
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4 w-full max-w-md">
        {question.options.map((opt: any, i: number) => (
          <button 
            key={i} 
            onClick={() => checkAnswer(opt)} 
            className="h-20 bg-white border-2 border-b-[8px] border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-orange-600 text-3xl font-black rounded-3xl transition-all active:translate-y-1 active:border-b-2 shadow-md flex items-center justify-center"
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="h-12 flex items-center">
         {feedback && (
             <p className={`text-2xl font-black animate-in zoom-in ${feedback.includes("CORRECT") ? "text-green-500" : "text-red-400"}`}>
                {feedback}
             </p>
         )}
      </div>

      <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 rounded-full shadow-lg border border-orange-400 text-white animate-bounce">
          <Star className="text-yellow-300 fill-yellow-300 w-5 h-5" />
          <span className="font-black tracking-wide text-sm">Streak: {streak}</span>
      </div>
    </div>
  );
}

// --- 5. STORY SPARK ---
function StorySpark({ canEdit }: { canEdit: boolean }) {
    const { user } = useUser(); 
    const { role } = useRole();
    const firestore = useFirestore(); 
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    
    // Core State
    const [story, setStory] = useState<any>(null); 
    const [topic, setTopic] = useState(''); 
    const [loading, setLoading] = useState(false);
    
    // Admin Control: Word Count
    const [targetWordCount, setTargetWordCount] = useState('100'); // Default to medium
    const isAdminOrDirector = ['Admin', 'Administrator', 'Director'].includes(role || '');

    // Quiz State (Enhanced for 3 Questions)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);
    
    const storiesQuery = useMemoFirebase(() => (firestore && user) ? query(collection(firestore, 'junior_stories'), orderBy('createdAt', 'desc')) : null, [firestore, user]);
    const { data: savedStories, forceRefetch } = useCollection<any>(storiesQuery);
    
    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setUserAnswer('');
        setIsAnswerSubmitted(false);
        setIsAnswerCorrect(false);
        setScore(0);
        setQuizFinished(false);
    };

    const handleGenerate = async () => { 
        setLoading(true); 
        // Pass the target word count to the AI flow
        const res = await generateJuniorStory({ topic, wordCount: parseInt(targetWordCount), schoolId: schoolId || '' }); 
        if (res.success) {
            setStory(res.data);
            resetQuiz();
        }
        setLoading(false); 
    };
    
    const handleSave = async () => { 
        if (!user || !story || !firestore) return; 
        await addDoc(collection(firestore, 'junior_stories'), { 
            ...story, 
            topic, 
            wordCount: story.content.split(' ').length,
            createdAt: serverTimestamp(), 
            createdBy: user.uid 
        }); 
        setStory(null); 
        forceRefetch(); 
        toast({ title: "Story Saved!" }); 
    };

    const handleDelete = async (id: string) => { 
        if (!firestore) return;
        if (confirm("Delete story?")) { 
            await deleteDoc(doc(firestore, 'junior_stories', id)); 
            forceRefetch(); 
        } 
    };

    const handleCheckAnswer = () => {
        if (!userAnswer.trim() || !story) return;
        // Check against the current question in the questions array
        const currentQ = story.questions[currentQuestionIndex];
        const correct = currentQ.answer.toLowerCase().trim().includes(userAnswer.toLowerCase().trim());
        
        setIsAnswerCorrect(correct);
        setIsAnswerSubmitted(true);
        if (correct) {
            setScore(s => s + 1);
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
            speak("Correct! Well done!");
        } else {
            speak("Not quite, but good try!");
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < story.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setUserAnswer('');
            setIsAnswerSubmitted(false);
        } else {
            setQuizFinished(true);
        }
    };

    const handleSelectStory = (s: any) => {
        setStory(s);
        speak(s.title);
        resetQuiz();
    };

    // Calculate actual word count of generated story
    const actualWordCount = story?.content?.split(/\s+/).filter(Boolean).length || 0;

    return (
        <div className="space-y-8">
            {canEdit && (
                <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-purple-200">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <h3 className="text-xl font-black text-purple-850 flex items-center gap-2"><Wand2 /> Story Lab</h3>
                        <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-black border border-purple-250/50 flex items-center gap-1.5 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse" /> Costs 10 Credits
                        </span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-3">
                            <Input 
                                value={topic} 
                                onChange={e => setTopic(e.target.value)} 
                                placeholder="What is the story about? (e.g. A dragon who loves cupcakes)" 
                                className="text-lg h-12 rounded-xl flex-1 border-2 border-purple-100 focus:border-purple-300 focus:ring-0"
                            />
                            
                            {/* Word Count Control for Admin/Director */}
                            {isAdminOrDirector && (
                                <div className="flex items-center gap-2 bg-purple-50 px-3 rounded-xl border border-purple-100">
                                    <Type className="w-4 h-4 text-purple-500" />
                                    <select 
                                        value={targetWordCount} 
                                        onChange={(e) => setTargetWordCount(e.target.value)}
                                        className="bg-transparent font-bold text-purple-700 outline-none text-sm h-12 cursor-pointer"
                                    >
                                        <option value="50">Short (~50 words)</option>
                                        <option value="100">Medium (~100 words)</option>
                                        <option value="200">Long (~200 words)</option>
                                        <option value="400">Epic (~400 words)</option>
                                    </select>
                                </div>
                            )}

                            <Button onClick={handleGenerate} disabled={loading || !topic} className="h-12 rounded-xl bg-purple-650 hover:bg-purple-700 shadow-md">
                                {loading ? <Loader2 className="animate-spin"/> : "Create Story"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {story && (
                <Card className="border-4 border-b-[12px] border-yellow-300 bg-yellow-50 animate-in zoom-in-95 overflow-hidden shadow-2xl rounded-[40px]">
                    <CardHeader className="bg-yellow-300 py-4 flex flex-row justify-between items-center px-8 border-b-2 border-yellow-400/30">
                        <CardTitle className="text-2xl font-black text-yellow-900">{story.emojiIcon} {story.title}</CardTitle>
                        {isAdminOrDirector && (
                            <span className="bg-white/50 px-3 py-1 rounded-full text-xs font-bold text-yellow-800">
                                {actualWordCount} words
                            </span>
                        )}
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        {/* THE STORY TEXT Styled like Lined Book Paper */}
                        <div className="relative bg-white rounded-3xl border-2 border-amber-200/70 p-8 pl-16 md:p-10 md:pl-20 shadow-inner overflow-hidden select-none" style={{ backgroundImage: 'linear-gradient(#fdfbf7 2px, transparent 2px)', backgroundSize: '100% 2.5rem', lineHeight: '2.5rem' }}>
                            <div className="absolute top-0 left-12 md:left-16 w-[2px] h-full bg-red-200"></div>
                            <p className="text-xl md:text-2xl leading-[2.5rem] text-slate-800 font-extrabold whitespace-pre-wrap tracking-wide">
                                {story.content}
                            </p>
                        </div>
                        
                        <div className="flex gap-4">
                            <Button onClick={() => speak(story.content)} variant="outline" className="flex-1 h-14 text-lg border-2 border-yellow-400 text-yellow-700 font-bold hover:bg-yellow-100 rounded-2xl shadow-sm">
                                <Volume2 className="mr-2" /> Read Aloud
                            </Button>
                            {canEdit && <Button onClick={handleSave} className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700 font-bold rounded-2xl shadow-sm"><Save className="mr-2" /> Save to Library</Button>}
                        </div>

                        {/* 3-QUESTION CHALLENGE AREA */}
                        <div className="bg-purple-50/40 p-6 md:p-8 rounded-[36px] border-4 border-purple-200 shadow-inner">
                            {!quizFinished ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-black uppercase tracking-widest text-purple-400">
                                            Question {currentQuestionIndex + 1} of 3
                                        </span>
                                        <div className="flex gap-1.5">
                                            {[0, 1, 2].map(i => (
                                                <div key={i} className={`h-2.5 w-8 rounded-full transition-all duration-300 ${i === currentQuestionIndex ? 'bg-purple-500 w-12' : i < currentQuestionIndex ? 'bg-green-400' : 'bg-slate-200'}`} />
                                            ))}
                                        </div>
                                    </div>

                                    <h4 className="text-2xl font-black text-purple-900 leading-tight">
                                        {story.questions?.[currentQuestionIndex]?.question || "Look at the story and answer..."}
                                    </h4>

                                    {!isAnswerSubmitted ? (
                                        <div className="flex gap-2">
                                            <Input 
                                                placeholder="Type your answer here..." 
                                                value={userAnswer}
                                                onChange={(e) => setUserAnswer(e.target.value)}
                                                className="text-lg h-14 border-2 border-purple-100 focus:border-purple-400 focus:ring-0 rounded-2xl flex-1 bg-white"
                                                onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                                            />
                                            <Button onClick={handleCheckAnswer} disabled={!userAnswer.trim()} className="bg-purple-600 hover:bg-purple-750 text-white h-14 px-8 rounded-2xl font-black shadow-md">Check</Button>
                                        </div>
                                    ) : (
                                        <div className="animate-in slide-in-from-bottom-2 space-y-4">
                                            <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${isAnswerCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                                {isAnswerCorrect ? <CheckCircle2 className="w-6 h-6 mt-1 text-green-650" /> : <XCircle className="w-6 h-6 mt-1 text-red-505" />}
                                                <div>
                                                    <p className="font-black text-lg">{isAnswerCorrect ? "Great Thinking! 🌟" : "Not Quite... 🤔"}</p>
                                                    <p className="text-sm font-bold opacity-90 mt-1">The correct answer is: <span className="font-black underline">{story.questions?.[currentQuestionIndex]?.answer}</span></p>
                                                </div>
                                            </div>
                                            <Button onClick={handleNextQuestion} className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-2">
                                                {currentQuestionIndex < 2 ? "Next Question" : "See Final Score"} <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4 space-y-4 animate-in zoom-in">
                                    <div className="inline-block p-4 bg-yellow-100 rounded-full mb-2">
                                        <Trophy className="w-12 h-12 text-yellow-600" />
                                    </div>
                                    <h3 className="text-3xl font-black text-purple-900">Quiz Complete!</h3>
                                    <p className="text-xl font-black text-purple-600">You got {score} out of 3 correct!</p>
                                    <Button onClick={resetQuiz} variant="ghost" className="text-purple-400 hover:text-purple-600 font-extrabold">Try Quiz Again</Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* LIBRARY SECTION */}
            <div>
                <h3 className="text-2xl font-black text-slate-700 mb-6 flex items-center gap-2">
                    <BookOpen className="text-purple-500" /> Story Library
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedStories?.map((s:any) => (
                        <Card key={s.id} className="cursor-pointer border-2 border-b-[10px] border-purple-200 hover:border-purple-400 hover:-translate-y-1 transition-all relative group rounded-3xl overflow-hidden pl-4 bg-white shadow-md">
                            {/* Colorful spine spine strip */}
                            <div className="absolute top-0 left-0 w-3.5 h-full bg-gradient-to-b from-purple-500 to-indigo-400"></div>
                            
                            <CardContent className="p-5 flex items-center gap-4" onClick={() => handleSelectStory(s)}>
                                <div className="text-5xl bg-slate-50 p-2.5 rounded-2xl shadow-inner border border-slate-100">{s.emojiIcon}</div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-black text-lg text-slate-800 truncate">{s.title}</h4>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                        <span>{s.wordCount || '?'} Words</span>
                                        <span>•</span>
                                        <span className="text-purple-500 font-black">{s.topic || 'General'}</span>
                                    </div>
                                </div>
                            </CardContent>
                            {canEdit && (
                                <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-350 hover:text-red-500 hover:bg-red-50 rounded-full" onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}>
                                    <Trash2 className="w-4 h-4"/>
                                </Button>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- 6. SCIENCE WORLD (NON-SAAS DYNAMIC & CYCLING) ---
function ScienceWorld({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    
    const [activeTab, setActiveTab] = useState<'lab' | 'sorter' | 'experiment' | 'library'>('lab');
    
    // --- 1. DATA FETCHING (Standard Firestore) ---
    const sorterQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'junior_sorter_items'), orderBy('createdAt', 'asc')) : null, 
    [firestore]);
    const { data: dbSorterItems, forceRefetch: refetchSorter } = useCollection<any>(sorterQuery);
    
    const materialsQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, 'junior_science_materials'), orderBy('createdAt', 'asc')) : null, 
    [firestore]);
    const { data: dbMaterials, forceRefetch: refetchMaterials } = useCollection<any>(materialsQuery);

    const scienceQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_science'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: savedScience, forceRefetch: refetchScience } = useCollection<any>(scienceQuery);
    
    // --- 2. GAME & ADMIN STATES ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [newItem, setNewItem] = useState({ name: '', emoji: '', type: 'living' });
    const [temp, setTemp] = useState(20);
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
    const [showAddMatForm, setShowAddMatForm] = useState(false);
    const [topic, setTopic] = useState(''); 
    const [fact, setFact] = useState<any>(null); 
    const [loading, setLoading] = useState(false);

    // --- 3. NEW MATERIAL FORM STATE (Matter Lab) ---
    const [newMat, setNewMat] = useState({
        name: '',
        solid: { temp: -100, emoji: '🧊', label: 'Solid', desc: 'Frozen tight!' },
        liquid: { temp: 1, emoji: '💧', label: 'Liquid', desc: 'Flowing around!' },
        gas: { temp: 100, emoji: '💨', label: 'Gas', desc: 'Flying fast!' }
    });

    // --- 4. SORTER LOGIC (Cycling Loop) ---
    const handleNextSorter = () => {
        if (!dbSorterItems || dbSorterItems.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % dbSorterItems.length);
    };

    const handleAnswer = (choice: string) => {
        if (!dbSorterItems) return;
        const currentItem = dbSorterItems[currentIndex];
        if (choice === currentItem.type) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            speak(`Correct! ${currentItem.name} is ${currentItem.type}!`);
            setTimeout(handleNextSorter, 1500);
        } else {
            speak(`Not quite! Try again.`);
            toast({ title: "Try again!", description: `Is it really ${choice}?`, variant: "destructive" });
        }
    };

    const handleSaveSorterItem = async () => {
        if (!newItem.name || !newItem.emoji || !firestore) return;
        try {
            await addDoc(collection(firestore, 'junior_sorter_items'), {
                ...newItem,
                createdAt: serverTimestamp()
            });
            setNewItem({ name: '', emoji: '', type: 'living' });
            if (refetchSorter) refetchSorter();
            toast({ title: "Item Added!" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to add item.", variant: "destructive" });
        }
    };

    const handleDeleteSorterItem = async (id: string) => {
        if (!firestore) return;
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                const itemDoc = doc(firestore, 'junior_sorter_items', id);
                await deleteDoc(itemDoc);
                
                toast({ title: "Item Removed" });
                
                if (refetchSorter) {
                    refetchSorter();
                }
                
                setCurrentIndex(0);
            } catch (error: any) {
                console.error("Delete Error:", error);
                toast({ 
                    title: "Error", 
                    description: "Missing permissions or item not found: " + error.message, 
                    variant: "destructive" 
                });
            }
        }
    };


    // --- 5. MATTER LAB LOGIC ---
    const handleSaveMaterial = async () => {
        if (!newMat.name || !firestore) return;
        const statesArray = [
            { ...newMat.solid }, 
            { ...newMat.liquid }, 
            { ...newMat.gas }
        ];

        await addDoc(collection(firestore, 'junior_science_materials'), {
            name: newMat.name,
            states: statesArray,
            createdAt: serverTimestamp()
        });

        setShowAddMatForm(false);
        setNewMat({ name: '', solid: { temp: -100, emoji: '🧊', label: 'Solid', desc: 'Frozen tight!' }, liquid: { temp: 1, emoji: '💧', label: 'Liquid', desc: 'Flowing around!' }, gas: { temp: 100, emoji: '💨', label: 'Gas', desc: 'Flying fast!' } });
        refetchMaterials();
        toast({ title: "Material Created!" });
    };

    const getCurrentState = () => {
        if (!selectedMaterial) return { emoji: '🔍', label: 'Pick a Material', desc: 'Select one from the list above!' };
        const state = [...selectedMaterial.states].sort((a,b) => b.temp - a.temp).find(s => temp >= s.temp);
        return state || selectedMaterial.states[0];
    };

    // --- 6. DISCOVERY LAB LOGIC ---
    const handleGenerate = async () => { 
        setLoading(true); 
        const res = await generateJuniorScience({ topic, schoolId: schoolId || '' }); 
        if(res.success) setFact(res.data); 
        setLoading(false); 
    };

    const handleSave = async () => { 
        if(!user || !fact || !firestore) return; 
        await addDoc(collection(firestore,'junior_science'), {
            ...fact,
            createdAt: serverTimestamp(),
            createdBy: user.uid
        }); 
        setFact(null); 
        refetchScience(); 
        toast({title: "Discovery Saved!"});
    };
    
    const handleDeleteDiscovery = async (id: string) => {
        if (!firestore) return;
        if(window.confirm("Are you sure?")){
            await deleteDoc(doc(firestore, 'junior_science', id));
            refetchScience();
            toast({ title: "Deleted discovery" });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex gap-2 p-1.5 bg-blue-50/50 rounded-2xl w-fit mx-auto border border-blue-100/50 shadow-inner">
                <Button 
                    variant={activeTab === 'lab' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('lab')}
                    className={cn(
                      "rounded-xl font-black transition-all animate-none text-sm h-10 px-6",
                      activeTab === 'lab' 
                        ? 'bg-gradient-to-b from-blue-500 to-sky-500 text-white shadow-md border-b-4 border-blue-700' 
                        : 'text-blue-700 hover:bg-blue-100/40 border border-transparent hover:border-blue-200/50'
                    )}
                >
                    Discovery
                </Button>
                <Button 
                    variant={activeTab === 'sorter' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('sorter')}
                    className={cn(
                      "rounded-xl font-black transition-all animate-none text-sm h-10 px-6",
                      activeTab === 'sorter' 
                        ? 'bg-gradient-to-b from-blue-500 to-sky-500 text-white shadow-md border-b-4 border-blue-700' 
                        : 'text-blue-700 hover:bg-blue-100/40 border border-transparent hover:border-blue-200/50'
                    )}
                >
                    Sorter
                </Button>
                <Button 
                    variant={activeTab === 'experiment' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('experiment')}
                    className={cn(
                      "rounded-xl font-black transition-all animate-none text-sm h-10 px-6",
                      activeTab === 'experiment' 
                        ? 'bg-gradient-to-b from-blue-500 to-sky-500 text-white shadow-md border-b-4 border-blue-700' 
                        : 'text-blue-700 hover:bg-blue-100/40 border border-transparent hover:border-blue-200/50'
                    )}
                >
                    Matter Lab
                </Button>
                <Button 
                    variant={activeTab === 'library' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('library')}
                    className={cn(
                      "rounded-xl font-black transition-all animate-none text-sm h-10 px-6",
                      activeTab === 'library' 
                        ? 'bg-gradient-to-b from-blue-500 to-sky-500 text-white shadow-md border-b-4 border-blue-700' 
                        : 'text-blue-700 hover:bg-blue-100/40 border border-transparent hover:border-blue-200/50'
                    )}
                >
                    Journal
                </Button>
            </div>

            {/* DISCOVERY LAB */}
            {activeTab === 'lab' && (
                 <div className="space-y-6 animate-in fade-in">
                     {canEdit && (
                        <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-blue-200">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <h3 className="text-xl font-black text-blue-800 flex items-center gap-2"><Atom /> What should we investigate?</h3>
                                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-black border border-blue-250/50 flex items-center gap-1.5 shadow-sm">
                                    <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> Costs 10 Credits
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <Input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic (e.g. Gravity, Ants, Clouds)" className="text-lg h-12 rounded-xl border-2 border-blue-100 focus:border-blue-300 focus:ring-0"/>
                                <Button onClick={handleGenerate} disabled={loading} className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md">
                                    {loading ? <Loader2 className="animate-spin"/> : "Investigate"}
                                </Button>
                            </div>
                        </div>
                    )}
                    {fact && (
                        <Card className="border-4 border-b-[12px] border-blue-400 overflow-hidden rounded-[40px] shadow-2xl animate-in zoom-in">
                           <div className="bg-gradient-to-r from-blue-500 to-sky-400 p-8 text-center text-white">
                                <div className="text-8xl mb-4 animate-pulse select-none">{fact.emojiIcon}</div>
                                <h2 className="text-4xl font-black mb-2">{fact.title}</h2>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100 shadow-inner">
                                        <h4 className="font-black text-blue-700 flex items-center gap-2 mb-2"><BookOpen className="w-5 h-5"/> The Big Fact</h4>
                                        <p className="text-lg text-slate-700 font-bold leading-relaxed">{fact.fact}</p>
                                    </div>
                                    <div className="bg-green-50 p-6 rounded-3xl border-2 border-green-100 shadow-inner">
                                        <h4 className="font-black text-green-700 flex items-center gap-2 mb-2"><Star className="w-5 h-5"/> Observation</h4>
                                        <p className="text-lg text-slate-700 font-bold leading-relaxed">{fact.observation || "Look closely at the world around you to see this in action!"}</p>
                                    </div>
                                </div>
                                <div className="bg-orange-50 p-6 rounded-3xl border-4 border-dashed border-orange-200">
                                    <h4 className="font-black text-orange-700 flex items-center gap-2 mb-2"><Wand2 className="w-5 h-5"/> Home Experiment</h4>
                                    <p className="text-lg text-slate-700 font-bold italic">"{fact.experiment || "Can you find an example of this in your backyard?"}"</p>
                                </div>
                                <div className="flex gap-4">
                                    <Button onClick={() => speak(`${fact.title}. ${fact.fact}. Try this: ${fact.experiment}`)} className="flex-1 h-14 bg-blue-650 hover:bg-blue-700 text-lg font-bold rounded-2xl shadow-sm text-white">Read Lesson</Button>
                                    {canEdit && <Button onClick={handleSave} variant="outline" className="flex-1 h-14 border-2 border-green-500 text-green-600 font-bold rounded-2xl shadow-sm hover:bg-green-50">Add to Journal</Button>}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* SORTER TAB */}
            {activeTab === 'sorter' && (
                <div className="space-y-6">
                    {canEdit && (
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg text-white font-black h-12 rounded-xl">
                                    <PlusCircle className="mr-2 h-5 w-5"/> Add or Manage Sorter Items
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md rounded-3xl border-4 border-blue-200">
                                <DialogHeader>
                                    <DialogTitle className="font-black text-blue-900 text-xl">Manage Sorter Library</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-4 gap-2 p-4 border rounded-2xl bg-slate-50">
                                        <Input 
                                            placeholder="Name" 
                                            value={newItem.name} 
                                            onChange={e => setNewItem({...newItem, name: e.target.value})} 
                                            className="col-span-2 bg-white"
                                        />
                                        <Input 
                                            placeholder="Emoji" 
                                            value={newItem.emoji} 
                                            onChange={e => setNewItem({...newItem, emoji: e.target.value})} 
                                            className="text-center bg-white"
                                        />
                                        <Button onClick={handleSaveSorterItem} size="icon" className="bg-green-600 hover:bg-green-700">
                                            <Check className="h-4 w-4"/>
                                        </Button>
                                        <div className="col-span-4">
                                            <Select value={newItem.type} onValueChange={(v) => setNewItem({...newItem, type: v})}>
                                                <SelectTrigger className="bg-white"><SelectValue placeholder="Select Type"/></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="living">Living 🌳</SelectItem>
                                                    <SelectItem value="non-living">Non-Living 🧸</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    
                                    <ScrollArea className="h-64 pr-4">
                                        <div className="space-y-2">
                                            {dbSorterItems?.map((item: any) => (
                                                <div key={item.id} className="flex justify-between items-center p-3 border rounded-xl hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl">{item.emoji}</span>
                                                        <div>
                                                            <p className="font-bold text-sm leading-none">{item.name}</p>
                                                            <Badge variant="outline" className="mt-1 text-[10px] uppercase font-black">
                                                                {item.type}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        type="button" 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="text-red-400 hover:text-red-655 hover:bg-red-50 rounded-full" 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteSorterItem(item.id);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4"/>
                                                    </Button>
                                                </div>
                                            ))}
                                            {(!dbSorterItems || dbSorterItems.length === 0) && (
                                                <p className="text-center text-slate-400 py-10">No items found.</p>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}

                    <div className="bg-slate-50 p-10 rounded-[40px] border-4 border-slate-200 text-center space-y-8 shadow-inner">
                        {!dbSorterItems || dbSorterItems.length === 0 ? (
                            <div className="py-10 text-slate-400 font-bold">Your library is empty. Please add items above!</div>
                        ) : (
                            <div className="animate-in zoom-in space-y-8">
                                <div className="flex justify-center gap-1.5">
                                    {dbSorterItems.map((_: any, i: number) => (
                                        <div 
                                            key={i} 
                                            className={`h-2.5 w-8 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-blue-500 w-12' : i < currentIndex ? 'bg-green-400' : 'bg-slate-200'}`} 
                                        />
                                    ))}
                                </div>
                                <div className="text-9xl mb-4 p-8 bg-white rounded-full shadow-2xl w-48 h-48 mx-auto flex items-center justify-center border-8 border-blue-50 hover:scale-105 hover:rotate-6 transition-all cursor-pointer">
                                    {dbSorterItems[currentIndex].emoji}
                                </div>
                                <h3 className="text-4xl font-black text-slate-800 capitalize tracking-tight">{dbSorterItems[currentIndex].name}</h3>
                                
                                <div className="flex justify-center gap-6">
                                    <Button 
                                        onClick={() => handleAnswer('living')}
                                        className="h-24 px-12 bg-white border-2 border-b-[10px] border-green-200 hover:border-green-400 hover:bg-green-50 text-green-600 text-3xl font-black rounded-3xl transition-all active:translate-y-1 active:border-b-2 shadow-lg flex items-center justify-center animate-none"
                                    >
                                        🌳 Living
                                    </Button>
                                    <Button 
                                        onClick={() => handleAnswer('non-living')}
                                        className="h-24 px-12 bg-white border-2 border-b-[10px] border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-slate-655 text-3xl font-black rounded-3xl transition-all active:translate-y-1 active:border-b-2 shadow-lg flex items-center justify-center animate-none"
                                    >
                                        🧸 Non-Living
                                    </Button>
                                </div>
                                <p className="text-slate-400 font-extrabold text-sm uppercase tracking-widest">
                                    Item {currentIndex + 1} of {dbSorterItems.length}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* MATTER LAB TAB */}
            {activeTab === 'experiment' && (
                <div className="space-y-8 animate-in zoom-in">
                    
                    {/* Material Selector */}
                    <div className="text-center space-y-4">
                        <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Science Laboratory</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {dbMaterials?.map(m => (
                                <Button 
                                    key={m.id} 
                                    variant={selectedMaterial?.id === m.id ? 'default' : 'outline'} 
                                    onClick={() => setSelectedMaterial(m)}
                                    className={cn(
                                        "rounded-full px-6 font-black h-10 transition-all border-2",
                                        selectedMaterial?.id === m.id 
                                            ? 'bg-cyan-600 border-cyan-700 text-white shadow-sm' 
                                            : 'border-cyan-200 text-cyan-700 hover:bg-cyan-50/50'
                                    )}
                                >
                                    {m.name}
                                </Button>
                            ))}
                            {canEdit && (
                                <Button variant="ghost" onClick={() => setShowAddMatForm(!showAddMatForm)} className="border-dashed border-2 border-cyan-200 text-cyan-500 rounded-full font-bold h-10">
                                    {showAddMatForm ? 'Close Creator' : '+ Add New Material'}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Material Creator Form */}
                    {showAddMatForm && canEdit && (
                        <Card className="p-6 border-4 border-cyan-400 bg-cyan-50 rounded-[32px] animate-in slide-in-from-top-4">
                            <h4 className="text-xl font-black text-cyan-800 mb-4">Laboratory: Create New Material</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <Input placeholder="Material Name (e.g. Honey)" value={newMat.name} onChange={e => setNewMat({...newMat, name: e.target.value})} className="bg-white" />
                                    <div className="flex gap-2">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400">LIQUID AT (°C)</label>
                                            <Input type="number" value={newMat.liquid.temp} onChange={e => setNewMat({...newMat, liquid: {...newMat.liquid, temp: parseInt(e.target.value)}})} />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400">GAS AT (°C)</label>
                                            <Input type="number" value={newMat.gas.temp} onChange={e => setNewMat({...newMat, gas: {...newMat.gas, temp: parseInt(e.target.value)}})} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input placeholder="Solid Emoji" value={newMat.solid.emoji} onChange={e => setNewMat({...newMat, solid: {...newMat.solid, emoji: e.target.value}})} />
                                        <Input placeholder="Liquid Emoji" value={newMat.liquid.emoji} onChange={e => setNewMat({...newMat, liquid: {...newMat.liquid, emoji: e.target.value}})} />
                                        <Input placeholder="Gas Emoji" value={newMat.gas.emoji} onChange={e => setNewMat({...newMat, gas: {...newMat.gas, emoji: e.target.value}})} />
                                    </div>
                                    <Button onClick={handleSaveMaterial} className="w-full h-12 bg-cyan-600 text-white font-black rounded-xl">Save to Lab</Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Simulator Display */}
                    {(() => {
                        const stateObj = getCurrentState();
                        const label = stateObj.label;
                        const gradientClass = label === 'Solid' 
                            ? 'bg-gradient-to-br from-blue-50 to-sky-100/40 border-blue-200' 
                            : label === 'Gas'
                                ? 'bg-gradient-to-br from-orange-50 to-red-100/40 border-red-200'
                                : 'bg-gradient-to-br from-cyan-50 to-teal-100/40 border-cyan-200';
                        return (
                            <div className={cn("p-10 rounded-[40px] shadow-xl border-4 transition-all duration-500 flex flex-col items-center gap-6 bg-white w-full", gradientClass)}>
                                <div className="text-9xl transition-all duration-500 p-8 bg-white/95 rounded-full border-4 border-white shadow-xl hover:rotate-6 hover:scale-105 cursor-pointer select-none">
                                    {stateObj.emoji}
                                </div>
                                <div className="text-center">
                                    <h2 className="text-4xl font-black text-slate-800">{stateObj.label}</h2>
                                    <p className="text-slate-600 font-extrabold text-lg mt-2">{stateObj.desc}</p>
                                </div>
                                
                                <div className="w-full max-w-md space-y-4">
                                    <div className="flex justify-between font-black text-xl text-slate-400">
                                        <span className="text-blue-400 font-black">COLD</span>
                                        <span className="text-cyan-650 bg-white px-4 py-1 rounded-full border border-cyan-100 shadow-sm">{temp}°C</span>
                                        <span className="text-red-400 font-black">HOT</span>
                                    </div>
                                    <input 
                                        type="range" min="-50" max="150" value={temp} 
                                        onChange={e => setTemp(parseInt(e.target.value))} 
                                        className="w-full h-6 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                                    />
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
             {/* JOURNAL TAB */}
             {activeTab === 'library' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in">
                    {savedScience?.map((s:any)=>(
                        <div 
                            key={s.id} 
                            className="relative group bg-white p-6 rounded-3xl shadow-sm border-b-8 border-blue-200 flex flex-col items-center text-center cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
                            onClick={() => { setFact(s); setActiveTab('lab'); speak(s.title); }}
                        >
                            <div className="text-5xl mb-4">{s.emojiIcon}</div>
                            <h4 className="font-black text-slate-800 leading-tight">{s.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Discovery</p>
                            {canEdit && (
                                <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteDiscovery(s.id); }}>
                                    <Trash2 className="w-4 w-4"/>
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- 7. ART STUDIO (INTERACTIVE PATHWAY) ---
function ArtStudio({ canEdit }: { canEdit: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeTab, setActiveTab] = useState<'freestyle' | 'color-lab' | 'shapes' | 'gallery'>('freestyle');
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#4f46e5');
    const [brushSize, setBrushSize] = useState(8);
    const [tool, setTool] = useState<'brush' | 'bucket' | 'stamp' | 'pencil' | 'crayon' | 'paint_brush' | 'marker'>('brush');
    const [selectedShape, setSelectedShape] = useState<'circle' | 'square' | 'star'>('circle');
    
    // Color Lab State
    const [mix1, setMix1] = useState<string | null>(null);
    const [mix2, setMix2] = useState<string | null>(null);

    // Challenges State
    const [challenge, setChallenge] = useState("Can you draw a house using 1 Square and 1 Triangle?");
    
    // Fetch Dynamic Quests
    const firestore = useFirestore();
    const questsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_art_quests')) : null, [firestore]);
    const { data: dbQuests } = useCollection<any>(questsQuery);
    const [currentQuestIdx, setCurrentQuestIdx] = useState(0);

    const { toast } = useToast();


    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.parentElement?.clientWidth || 800;
            canvas.height = 500;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, [activeTab]);

    const startDrawing = (e: any) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
        if(tool === 'brush' || tool === 'pencil' || tool === 'crayon' || tool === 'paint_brush' || tool === 'marker') {
          ctx.beginPath(); 
          ctx.moveTo(x, y); 
          ctx.strokeStyle = color; 
          ctx.lineWidth = brushSize; 
          setIsDrawing(true);
        }
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => { setIsDrawing(false); };
    
    const clearCanvas = () => { 
        const canvas = canvasRef.current; 
        if(canvas){ 
            const ctx=canvas.getContext('2d'); 
            if(ctx){ctx.fillStyle="white"; ctx.fillRect(0,0,canvas.width,canvas.height);} 
        } 
    };

    const handleMix = (c: string) => {
        if (!mix1) setMix1(c);
        else if (!mix2) setMix2(c);
        else { setMix1(c); setMix2(null); }
    };

    const getMixedColor = () => {
        const colors = [mix1, mix2].sort().join('+');
        if (colors === '#FF0000+#FFFF00') return { name: 'Orange', hex: '#FFA500' };
        if (colors === '#0000FF+#FF0000') return { name: 'Purple', hex: '#800080' };
        if (colors === '#0000FF+#FFFF00') return { name: 'Green', hex: '#008000' };
        return null;
    };
    
    // --- FLOOD FILL ALGORITHM (Paint Bucket) ---
    const floodFill = (startX: number, startY: number, fillColor: string) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const targetColor = getPixelColor(data, startX, startY, canvas.width);
        const fillRGB = hexToRgb(fillColor);

        if (colorsMatch(targetColor, fillRGB)) return;

        const pixels = [{ x: startX, y: startY }];
        while (pixels.length > 0) {
            const { x, y } = pixels.pop()!;
            if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
            const currentColor = getPixelColor(data, x, y, canvas.width);
            
            if (colorsMatch(currentColor, targetColor)) {
                setPixelColor(data, x, y, canvas.width, fillRGB);
                pixels.push({ x: x - 1, y });
                pixels.push({ x: x + 1, y });
                pixels.push({ x, y: y - 1 });
                pixels.push({ x, y: y + 1 });
            }
        }
        ctx.putImageData(imageData, 0, 0);
    };

    // Helper: Draw Shape Stamp
    const drawStamp = (x: number, y: number) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = color;
        ctx.beginPath();
        if (selectedShape === 'circle') ctx.arc(x, y, 30, 0, Math.PI * 2);
        if (selectedShape === 'square') ctx.rect(x - 30, y - 30, 60, 60);
        if (selectedShape === 'star') { 
            ctx.moveTo(x, y - 30);
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(x + Math.cos((18 + i * 72) / 180 * Math.PI) * 30, y - Math.sin((18 + i * 72) / 180 * Math.PI) * 30);
                ctx.lineTo(x + Math.cos((54 + i * 72) / 180 * Math.PI) * 15, y - Math.sin((54 + i * 72) / 180 * Math.PI) * 15);
            }
            ctx.closePath();
        }
        ctx.fill();
    };

    const handleCanvasClick = (e: any) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        
        if (tool === 'bucket') floodFill(x, y, color);
        if (tool === 'stamp') drawStamp(x, y);
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2 p-1.5 bg-cyan-50/50 rounded-2xl w-fit mx-auto border border-cyan-100/50 shadow-inner">
                <Button 
                    variant={activeTab === 'freestyle' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('freestyle')} 
                    className={cn(
                      "rounded-xl font-black transition-all animate-none text-sm h-10 px-6",
                      activeTab === 'freestyle' 
                        ? 'bg-gradient-to-b from-cyan-500 to-teal-400 text-white shadow-md border-b-4 border-cyan-600' 
                        : 'text-cyan-700 hover:bg-cyan-100/40 border border-transparent hover:border-cyan-200/50'
                    )}
                >
                    Freestyle
                </Button>
                <Button 
                    variant={activeTab === 'color-lab' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('color-lab')} 
                    className={cn(
                      "rounded-xl font-black transition-all animate-none text-sm h-10 px-6",
                      activeTab === 'color-lab' 
                        ? 'bg-gradient-to-b from-cyan-500 to-teal-400 text-white shadow-md border-b-4 border-cyan-600' 
                        : 'text-cyan-700 hover:bg-cyan-100/40 border border-transparent hover:border-cyan-200/50'
                    )}
                >
                    Color Lab
                </Button>
                <Button 
                    variant={activeTab === 'shapes' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('shapes')} 
                    className={cn(
                      "rounded-xl font-black transition-all animate-none text-sm h-10 px-6",
                      activeTab === 'shapes' 
                        ? 'bg-gradient-to-b from-cyan-500 to-teal-400 text-white shadow-md border-b-4 border-cyan-600' 
                        : 'text-cyan-700 hover:bg-cyan-100/40 border border-transparent hover:border-cyan-200/50'
                    )}
                >
                    Shape Quest
                </Button>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 via-indigo-650 to-purple-500 rounded-2xl border-b-4 border-indigo-700 p-4 text-white flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <Star className="text-yellow-400 fill-yellow-400 animate-pulse" />
                    <span className="font-black text-lg">{dbQuests?.[currentQuestIdx]?.instruction || "Let your imagination run wild!"}</span>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setCurrentQuestIdx((prev) => (prev + 1) % (dbQuests?.length || 1))} className="rounded-xl font-bold bg-white text-indigo-700 hover:bg-white/90">New Quest</Button>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 border-4 border-b-[12px] border-cyan-100 bg-white rounded-[32px] p-5 space-y-6 h-fit shadow-xl">
                    {activeTab === 'color-lab' ? (
                        <div className="space-y-4 text-center">
                            <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">Primary Colors</h4>
                            <div className="flex justify-center gap-3">
                                {['#FF0000', '#FFFF00', '#0000FF'].map(c => (
                                    <button key={c} onClick={() => handleMix(c)} className="w-12 h-12 rounded-full border-4 border-white shadow-lg active:scale-95 transition-transform" style={{backgroundColor: c}} />
                                ))}
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <div className="flex justify-center items-center gap-2 mb-3">
                                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-md" style={{backgroundColor: mix1 || '#eee'}} />
                                    <span className="font-black text-xl text-slate-400">+</span>
                                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-md" style={{backgroundColor: mix2 || '#eee'}} />
                                </div>
                                {getMixedColor() && (
                                    <div className="animate-in zoom-in text-center space-y-2">
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Result:</p>
                                        <button 
                                            onClick={() => setColor(getMixedColor()!.hex)}
                                            className="w-full py-2.5 rounded-xl text-white font-black border-b-4 shadow-md transition-all active:translate-y-0.5" 
                                            style={{backgroundColor: getMixedColor()!.hex, borderColor: 'rgba(0,0,0,0.15)'}}
                                        >
                                            Use {getMixedColor()!.name}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                             <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tools</label>
                                <div className="grid grid-cols-4 gap-2">
                                    <Button size="icon" variant={tool === 'brush' ? 'default' : 'outline'} onClick={() => setTool('brush')} title="Brush" className="rounded-xl font-bold"><PenTool className="w-4 h-4"/></Button>
                                    <Button size="icon" variant={tool === 'bucket' ? 'default' : 'outline'} onClick={() => setTool('bucket')} title="Paint Bucket" className="rounded-xl font-bold"><Database className="w-4 h-4"/></Button>
                                    <Button size="icon" variant={tool === 'stamp' ? 'default' : 'outline'} onClick={() => setTool('stamp')} title="Stamp" className="rounded-xl font-bold"><Star className="w-4 h-4"/></Button>
                                    <Button size="icon" variant={tool === 'pencil' ? 'default' : 'outline'} onClick={() => setTool('pencil')} title="Pencil" className="rounded-xl font-bold text-lg">✏️</Button>
                                    <Button size="icon" variant={tool === 'crayon' ? 'default' : 'outline'} onClick={() => setTool('crayon')} title="Crayon" className="rounded-xl font-bold text-lg">🖍️</Button>
                                    <Button size="icon" variant={tool === 'paint_brush' ? 'default' : 'outline'} onClick={() => setTool('paint_brush')} title="Paint Brush" className="rounded-xl font-bold text-lg">🖌️</Button>
                                    <Button size="icon" variant={tool === 'marker' ? 'default' : 'outline'} onClick={() => setTool('marker')} title="Marker" className="rounded-xl font-bold text-lg">🎨</Button>
                                </div>
                            </div>
                            {tool === 'stamp' && (
                                <div className="flex gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-xl">
                                    {['circle', 'square', 'star'].map(s => (
                                        <button key={s} onClick={() => setSelectedShape(s as any)} className={cn("flex-1 p-2 border-2 rounded-xl text-lg font-bold transition-all bg-white", selectedShape === s ? 'border-indigo-500 scale-105 shadow-sm' : 'border-slate-100 hover:border-slate-200')}>
                                            {s === 'circle' ? '●' : s === 'square' ? '■' : '★'}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Brush Color</label>
                                <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-inner">
                                    {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#FFC0CB', '#8B4513'].map(c => (
                                        <button 
                                            key={c} onClick={() => setColor(c)} 
                                            className={`aspect-square rounded-full border-4 transition-all hover:scale-110 ${color === c ? 'border-slate-800 scale-110 shadow-lg' : 'border-white'}`} 
                                            style={{ backgroundColor: c }} 
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Brush Size</label>
                                <input type="range" min="2" max="40" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full accent-indigo-500 bg-slate-100 h-2 rounded-full cursor-pointer" />
                            </div>
                             <div className="space-y-2 pt-4 border-t border-slate-100">
                                <Button variant="outline" className="w-full font-black border-2 border-slate-200 hover:bg-slate-50 rounded-xl h-11" onClick={() => {toast({title:"Artwork Saved!"})}}>
                                    <Save className="mr-2 h-4 w-4"/>Save Masterpiece
                                </Button>
                                <Button variant="destructive" onClick={clearCanvas} className="w-full font-black rounded-xl h-11 shadow-sm">
                                    <Eraser className="mr-2 h-4 w-4" /> Clear All
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                <div className="lg:col-span-3 flex flex-col items-center gap-4">
                    <div className="relative bg-amber-50 rounded-[40px] p-6 border-8 border-amber-800 shadow-2xl w-full h-fit flex items-center justify-center">
                        {/* Wooden frame pegs */}
                        <div className="absolute top-2 left-6 w-4 h-4 rounded-full bg-amber-900/40"></div>
                        <div className="absolute top-2 right-6 w-4 h-4 rounded-full bg-amber-900/40"></div>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-amber-900/30 rounded-full"></div>
                        
                        <div className="bg-white rounded-2xl overflow-hidden shadow-inner border border-amber-900/10 w-full">
                            <canvas 
                                ref={canvasRef} 
                                onClick={handleCanvasClick} 
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                className="bg-white w-full h-[500px] cursor-crosshair touch-none"
                            />
                        </div>
                    </div>
                    <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                        ★ Practice makes perfect! ★
                    </p>
                </div>
            </div>
        </div>
    );
}

// --- 8. REWARDS (THE HALL OF FAME) ---
function StickerBook() {
    const { user } = useUser(); 
    const firestore = useFirestore();
    const [activeFilter, setActiveFilter] = useState<'all' | 'math' | 'literacy' | 'science' | 'art'>('all');

    const stickerQuery = useMemoFirebase(() => 
        (user && firestore) ? query(
            collection(firestore, 'junior_stickers'), 
            where('userId', '==', user.uid), 
            orderBy('earnedAt', 'desc')
        ) : null, [firestore, user]
    );
    const { data: stickers } = useCollection<any>(stickerQuery);

    // Calculate progress stats
    const stats = {
        total: stickers?.length || 0,
        math: stickers?.filter(s => s.category === 'math').length || 0,
        literacy: stickers?.filter(s => s.category === 'literacy' || s.name.includes('ABC') || s.name.includes('Word')).length || 0,
        science: stickers?.filter(s => s.category === 'science').length || 0,
        art: stickers?.filter(s => s.category === 'art').length || 0,
    };

    const filteredStickers = activeFilter === 'all' 
        ? stickers 
        : stickers?.filter(s => {
            if (activeFilter === 'math') return s.category === 'math';
            if (activeFilter === 'literacy') return s.category === 'literacy' || s.name.includes('ABC') || s.name.includes('Word');
            if (activeFilter === 'science') return s.category === 'science';
            if (activeFilter === 'art') return s.category === 'art';
            return true;
        });

    const getTier = (count: number) => {
        if (count >= 20) return { label: 'Grand Master', color: 'text-purple-600', icon: '👑' };
        if (count >= 10) return { label: 'Gold Tier', color: 'text-yellow-600', icon: '🥇' };
        if (count >= 5) return { label: 'Silver Tier', color: 'text-slate-400', icon: '🥈' };
        return { label: 'Bronze Tier', color: 'text-orange-600', icon: '🥉' };
    };

    return (
        <div className="space-y-8 animate-in fade-in">
            {/* 1. ACHIEVEMENT HEADER */}
            <div className="bg-gradient-to-r from-yellow-400 via-amber-450 to-orange-500 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden border-b-8 border-orange-600/25">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-4xl font-black mb-1 tracking-tight">Hall of Fame</h3>
                        <p className="font-extrabold opacity-95 text-lg">You have earned {stats.total} total stickers! 🎉</p>
                        <div className="mt-4 flex items-center gap-2 bg-white/20 w-fit px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 shadow-inner">
                            <span className="text-2xl">{getTier(stats.total).icon}</span>
                            <span className="font-black uppercase tracking-widest text-xs">{getTier(stats.total).label}</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/10 p-4 rounded-3xl text-center backdrop-blur-md border border-white/20 min-w-[100px] shadow-sm">
                            <div className="text-3xl font-black">{stats.math}</div>
                            <div className="text-[10px] font-black uppercase opacity-85">Math</div>
                        </div>
                        <div className="bg-white/10 p-4 rounded-3xl text-center backdrop-blur-md border border-white/20 min-w-[100px] shadow-sm">
                            <div className="text-3xl font-black">{stats.literacy}</div>
                            <div className="text-[10px] font-black uppercase opacity-85">Reading</div>
                        </div>
                        <div className="bg-white/10 p-4 rounded-3xl text-center backdrop-blur-md border border-white/20 min-w-[100px] shadow-sm">
                            <div className="text-3xl font-black">{stats.science}</div>
                            <div className="text-[10px] font-black uppercase opacity-85">Science</div>
                        </div>
                    </div>
                </div>
                {/* Decorative background icons */}
                <Trophy className="absolute -bottom-4 -right-4 w-48 h-48 opacity-10 rotate-12" />
            </div>

            {/* 2. SUBJECT PROGRESS TRACKER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { label: 'Math Whiz', count: stats.math, color: 'bg-orange-500', icon: <Calculator className="w-5 h-5 text-orange-600" />, iconBg: 'bg-orange-50' },
                    { label: 'Reading Hero', count: stats.literacy, color: 'bg-purple-500', icon: <BookOpen className="w-5 h-5 text-purple-600" />, iconBg: 'bg-purple-50' },
                    { label: 'Science Pro', count: stats.science, color: 'bg-blue-500', icon: <Atom className="w-5 h-5 text-blue-600" />, iconBg: 'bg-blue-50' },
                    { label: 'Art Legend', count: stats.art, color: 'bg-pink-500', icon: <Palette className="w-5 h-5 text-pink-650" />, iconBg: 'bg-pink-50' },
                ].map((p) => (
                    <div key={p.label} className="bg-white p-5 rounded-[28px] border-2 border-slate-100 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2.5 font-black text-slate-800">
                                <span className={cn("p-1.5 rounded-xl", p.iconBg)}>{p.icon}</span>
                                <span>{p.label}</span>
                            </div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{p.count} / 10 to Next Level</span>
                        </div>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50 shadow-inner">
                            <div 
                                className={cn("h-full rounded-full transition-all duration-1000", p.color)} 
                                style={{ width: `${Math.min((p.count / 10) * 100, 100)}%` }} 
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. FILTER & STICKER GRID */}
            <div className="space-y-6">
                <div className="flex gap-2 p-1.5 bg-yellow-50/50 border border-yellow-100/50 rounded-2xl w-fit no-scrollbar overflow-x-auto shadow-inner">
                    {['all', 'math', 'literacy', 'science', 'art'].map((f) => (
                        <Button 
                            key={f} 
                            variant={activeFilter === f ? 'default' : 'ghost'} 
                            onClick={() => setActiveFilter(f as any)}
                            className={cn(
                              "rounded-xl font-black capitalize transition-all animate-none text-sm h-10 px-6",
                              activeFilter === f 
                                ? 'bg-gradient-to-b from-yellow-450 to-orange-400 text-white shadow-md border-b-4 border-yellow-600' 
                                : 'text-yellow-700 hover:bg-yellow-100/40 border border-transparent hover:border-yellow-250/50'
                            )}
                        >
                            {f}
                        </Button>
                    ))}
                </div>

                {!filteredStickers || filteredStickers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[40px] border-4 border-dashed border-slate-150 shadow-inner">
                        <Gift className="h-16 w-16 mx-auto mb-4 text-slate-200 animate-bounce" />
                        <p className="text-slate-400 font-extrabold text-lg">No stickers here yet!</p>
                        <p className="text-slate-300 text-sm font-bold mt-1">Keep playing and learning to fill your book!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {filteredStickers.map((s, idx) => (
                            <div 
                                key={s.id} 
                                onClick={() => speak(`You earned the ${s.name} sticker!`)}
                                className="group relative aspect-square bg-gradient-to-br from-white to-slate-50 rounded-full shadow-lg border-2 border-b-[8px] border-slate-200 hover:border-yellow-400 hover:border-b-[10px] flex flex-col items-center justify-center p-3 hover:-translate-y-2.5 transition-all duration-300 cursor-pointer overflow-hidden"
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                {/* Glossy Sheen Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                                
                                <div className="text-4xl mb-1 group-hover:scale-120 group-hover:rotate-12 transition-transform duration-300 select-none">{s.emoji}</div>
                                <span className="text-[9px] text-center leading-tight font-black text-slate-500 uppercase tracking-wide px-1 truncate w-full">{s.name}</span>
                                
                                {/* Date earned - small badge */}
                                <div className="absolute -top-1 -right-1 bg-yellow-450 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    NEW
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Utility Helpers for Flood Fill
function getPixelColor(data: Uint8ClampedArray, x: number, y: number, width: number) {
    const i = (y * width + x) * 4;
    return [data[i], data[i+1], data[i+2], data[i+3]];
}
function setPixelColor(data: Uint8ClampedArray, x: number, y: number, width: number, color: number[]) {
    const i = (y * width + x) * 4;
    data[i] = color[0]; data[i+1] = color[1]; data[i+2] = color[2]; data[i+3] = 255;
}
function colorsMatch(c1: number[], c2: number[]) {
    return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2];
}
function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

// --- MAIN PAGE ---
export default function JuniorCampusPage() {
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');
  const { toast } = useToast(); 

  const pageModules = [
    { id: 'coach', name: 'Voice Coach', icon: <Mic className="w-5 h-5"/>, color: 'text-pink-600 bg-pink-100' },
    { id: 'phonics', name: 'Phonics Forest', icon: <Music className="w-5 h-5"/>, color: 'text-teal-600 bg-teal-100' },
    { id: 'abc', name: 'ABC Kingdom', icon: <Brain className="w-5 h-5"/>, color: 'text-green-600 bg-green-100' },
    { id: 'math', name: 'Math Playground', icon: <Calculator className="w-5 h-5"/>, color: 'text-orange-600 bg-orange-100' },
    { id: 'stories', name: 'Story Spark', icon: <BookOpen className="w-5 h-5"/>, color: 'text-purple-600 bg-purple-100' },
    { id: 'science', name: 'Science World', icon: <Atom className="w-5 h-5"/>, color: 'text-blue-600 bg-blue-100' },
    { id: 'art', name: 'Art Studio', icon: <Palette className="w-5 h-5"/>, color: 'text-cyan-600 bg-cyan-100' },
    { id: 'rewards', name: 'Sticker Book', icon: <Trophy className="w-5 h-5"/>, color: 'text-yellow-600 bg-yellow-100' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-[#E0F2FE] p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Ambient background decorations */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute top-40 right-20 w-80 h-80 bg-yellow-200/30 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-6xl mx-auto mb-8 relative">
        <div className="relative overflow-hidden bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200 p-8 rounded-[36px] shadow-xl border-b-8 border-rose-400/30 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Decorative shapes */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full rotate-45 pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full rotate-45 pointer-events-none"></div>
          
          <div className="flex items-center gap-6 z-10">
            <div className="bg-white/95 p-4 rounded-3xl shadow-lg hover:rotate-12 transition-transform duration-300">
              <Rabbit className="h-14 w-14 text-pink-500 animate-bounce" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm flex items-center gap-2">
                Junior Campus <Sparkles className="w-7 h-7 text-yellow-500 animate-pulse" />
              </h1>
              <p className="text-slate-700/80 font-bold text-lg mt-1">A magical space to learn, play, and bloom!</p>
            </div>
          </div>

          {/* Spark Status Badge */}
          <div className="z-10 bg-white/40 backdrop-blur-md border border-white/40 px-6 py-3 rounded-2xl shadow-inner flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
            <div>
              <div className="text-[10px] uppercase tracking-wider font-black text-slate-700">Spark Status</div>
              <div className="text-sm font-black text-slate-900">Ready to Learn! 🌟</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="coach" className="w-full">
            <div className="bg-white/70 backdrop-blur-md p-2 rounded-3xl shadow-lg border border-white/80 mb-8 overflow-x-auto no-scrollbar">
              <TabsList className="flex w-max md:w-full md:grid md:grid-cols-8 gap-2 bg-transparent p-0 h-auto">
                  {pageModules.map(mod => (
                      <TabsTrigger 
                          key={mod.id}
                          value={mod.id} 
                          className={cn(
                            "rounded-2xl font-black flex flex-col items-center gap-2 text-xs py-3 px-4 md:px-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm border border-transparent",
                            "data-[state=active]:bg-gradient-to-b data-[state=active]:shadow-md data-[state=active]:border-white/50 data-[state=active]:-translate-y-0.5",
                            mod.id === 'coach' && "data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white text-pink-600 hover:bg-pink-50/50",
                            mod.id === 'phonics' && "data-[state=active]:from-teal-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white text-teal-600 hover:bg-teal-50/50",
                            mod.id === 'abc' && "data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white text-green-600 hover:bg-green-50/50",
                            mod.id === 'math' && "data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-orange-600 hover:bg-orange-50/50",
                            mod.id === 'stories' && "data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white text-purple-600 hover:bg-purple-50/50",
                            mod.id === 'science' && "data-[state=active]:from-blue-500 data-[state=active]:to-sky-500 data-[state=active]:text-white text-blue-600 hover:bg-blue-50/50",
                            mod.id === 'art' && "data-[state=active]:from-cyan-500 data-[state=active]:to-teal-400 data-[state=active]:text-white text-cyan-700 hover:bg-cyan-50/50",
                            mod.id === 'rewards' && "data-[state=active]:from-yellow-400 data-[state=active]:to-orange-400 data-[state=active]:text-white text-yellow-600 hover:bg-yellow-50/50"
                          )}
                      >
                          <div className="p-1.5 rounded-xl bg-white/20 shadow-inner">
                            {mod.icon}
                          </div>
                          <span className="font-extrabold tracking-wide">{mod.name}</span>
                      </TabsTrigger>
                  ))}
              </TabsList>
            </div>
            
            {/* CONTENT AREAS */}
            <div className="min-h-[500px]">
                <TabsContent value="coach" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-pink-400">
                    <VoiceCoach canEdit={canEdit} />
                  </div>
                </TabsContent>
                <TabsContent value="phonics" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-teal-400">
                    <PhonicsForest canEdit={canEdit} />
                  </div>
                </TabsContent>
                <TabsContent value="abc" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-green-400">
                    <ABCKingdom canEdit={canEdit} />
                  </div>
                </TabsContent>
                <TabsContent value="math" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-orange-400 relative">
                    <MathPlayground />
                  </div>
                </TabsContent>
                <TabsContent value="stories" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-purple-400">
                    <StorySpark canEdit={canEdit} />
                  </div>
                </TabsContent>
                <TabsContent value="science" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-blue-400">
                    <ScienceWorld canEdit={canEdit} />
                  </div>
                </TabsContent>
                <TabsContent value="art" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-cyan-500">
                    <ArtStudio canEdit={canEdit} />
                  </div>
                </TabsContent>
                <TabsContent value="rewards" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-yellow-400">
                    <StickerBook />
                  </div>
                </TabsContent>
            </div>
        </Tabs>
      </div>
    </div>
  );
}
