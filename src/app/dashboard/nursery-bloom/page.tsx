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
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, ArrowLeft, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, Trophy, Gift, Check, CheckCircle2, XCircle, Type, PlusCircle, PenSquare, FileText, Search, AlertTriangle, ShieldCheck, Activity, BrainCircuit, MessageSquare, Clapperboard, Users, Lightbulb, Microscope, Sparkles, Database, PenTool, Eraser, Bot,
  Hash, Play, Pause, BarChart3, TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateJuniorScience, generateWordDetails, generateLessonImageAction, generateIncompleteSentenceAction, generateMathWordProblemAction } from '@/ai/flows/junior-actions';
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
import { JuniorAgeLevelSelector } from '@/components/dashboard/junior-academy/JuniorAgeLevelSelector';
import { 
  AGE_TIERS, ANIMAL_SOUNDS, HOUSEHOLD_OBJECTS, LETTER_DISTINCTION, 
  PATTERN_DRILLS, CVC_WORDS, SIGHT_WORDS, RHYME_MATCHES, 
  SENTENCE_PACING_READS, STORY_SEQUENCING_DRILLS, INCOMPLETE_SENTENCES,
  ADVANCED_VOICE_WORDS_AGE5, IncompleteSentenceItem
} from '@/lib/junior-age-levels';

// --- HELPER: TEXT TO SPEECH ---
const speak = (text: string, rate = 0.9) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    window.speechSynthesis.speak(u);
};


// --- 1. VOICE COACH (THE SPEAKING ACADEMY) ---
function VoiceCoach({ canEdit, activeAgeTier = 'ages2-3' }: { canEdit: boolean; activeAgeTier?: string }) {
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

    const TODDLER_WORDS = useMemo(() => [
      { word: "Dog", emoji: "🐶", sentence: "The happy dog says Woof!", phonetic: "/dɒɡ/" },
      { word: "Cat", emoji: "🐱", sentence: "The soft cat says Meow!", phonetic: "/kæt/" },
      { word: "Cow", emoji: "🐮", sentence: "The big cow says Moo!", phonetic: "/kaʊ/" },
      { word: "Duck", emoji: "🦆", sentence: "The yellow duck says Quack!", phonetic: "/dʌk/" },
      { word: "Ball", emoji: "⚽", sentence: "Roll the round ball!", phonetic: "/bɔːl/" },
      { word: "Star", emoji: "⭐", sentence: "Twinkle bright star!", phonetic: "/stɑːr/" }
    ], []);

    const phonicsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_phonics'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: dbWordLibrary, forceRefetch } = useCollection<any>(phonicsQuery);

    const wordLibrary = useMemo(() => {
      if (activeAgeTier === 'ages2-3') return TODDLER_WORDS;
      if (activeAgeTier === 'ages5+') return ADVANCED_VOICE_WORDS_AGE5;
      return dbWordLibrary && dbWordLibrary.length > 0 ? dbWordLibrary : TODDLER_WORDS;
    }, [activeAgeTier, dbWordLibrary, TODDLER_WORDS]);

    const pickRandomWord = useCallback(() => {
        if (!wordLibrary || wordLibrary.length === 0) return;
        const random = wordLibrary[Math.floor(Math.random() * wordLibrary.length)];
        setChallenge(random);
        setFeedback({ text: "Ready when you are!", color: "text-slate-600" });
    }, [wordLibrary]);
    
    useEffect(() => { 
        if (wordLibrary && wordLibrary.length > 0) pickRandomWord();
    }, [wordLibrary, activeAgeTier, pickRandomWord]);

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
function PhonicsForest({ canEdit, activeAgeTier = 'ages2-3' }: { canEdit: boolean; activeAgeTier?: string }) {
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

    const toddlerSoundGroups = [
        { name: "First Alphabet Sounds (Ages 2-3)", color: "bg-amber-100 text-amber-700 border-amber-300", sounds: ["a", "b", "c", "d", "e", "f"], example: ["apple 🍎", "ball ⚽", "cat 🐱", "duck 🦆", "egg 🥚", "fish 🐟"] },
        { name: "Toddler Animal Sounds", color: "bg-pink-100 text-pink-700 border-pink-300", sounds: ["woof", "meow", "moo", "quack", "roar", "baa"], example: ["dog 🐶", "cat 🐱", "cow 🐮", "duck 🦆", "lion 🦁", "sheep 🐑"] },
    ];

    // Comprehensive Sound Categories (SSP Structured)
    const defaultSoundGroups = [
        ...(activeAgeTier === 'ages2-3' ? toddlerSoundGroups : []),
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
function ABCKingdom({ canEdit, activeAgeTier }: { canEdit: boolean; activeAgeTier?: string }) {
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
function MathPlayground({ activeAgeTier = 'ages2-3' }: { activeAgeTier?: string }) {
  type MathMode = 'count' | 'add' | 'sub' | 'mul' | 'div' | 'compare' | 'patterns' | 'shapes' | 'time';
  const [mode, setMode] = useState<MathMode>(activeAgeTier === 'ages2-3' ? 'count' : 'add');
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
      case 'count':
        a = Math.floor(Math.random() * 5) + 1;
        b = 0;
        ans = a;
        options = [a, a === 5 ? 4 : a + 1, Math.max(1, a - 1)].sort(() => Math.random() - 0.5);
        displayPrompt = `Count the objects! How many are there?`;
        break;
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
          {(activeAgeTier === 'ages2-3' 
            ? (['count', 'shapes'] as MathMode[]) 
            : (['count', 'add', 'sub', 'mul', 'div', 'compare', 'patterns', 'shapes', 'time'] as MathMode[])
          ).map((m) => (
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
            
            {/* COUNTING: Toddler Object Visual */}
            {mode === 'count' && (
              <div className="space-y-4 mb-6">
                <p className="text-xs font-black text-orange-600 uppercase tracking-widest text-center">Tap each object to count out loud!</p>
                <div className="flex justify-center gap-4 flex-wrap p-6 bg-orange-50/60 border-2 border-orange-200 rounded-3xl shadow-inner min-w-[200px]">
                  {Array.from({ length: question.a }).map((_, i) => (
                    <span 
                      key={i} 
                      onClick={() => speak(`${i + 1}`)}
                      className="text-6xl hover:scale-125 transition-transform cursor-pointer animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    >
                      {question.icon}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
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
function StorySpark({ canEdit, activeAgeTier = 'ages2-3' }: { canEdit: boolean; activeAgeTier?: string }) {
    const { user } = useUser(); 
    const { role } = useRole();
    const firestore = useFirestore(); 
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    
    const TODDLER_STORY = useMemo(() => ({
      title: "The Happy Little Puppy 🐶",
      pages: [
        { text: "Once upon a time, a happy little puppy ran in the green grass. Woof woof!", emoji: "🐶" },
        { text: "The puppy found a bright red ball and rolled it with his nose. Wheee!", emoji: "⚽" },
        { text: "After playing all day, the tired puppy went to sleep under the warm sun. Goodnight puppy!", emoji: "😴" }
      ]
    }), []);

    // Core State
    const [story, setStory] = useState<any>(activeAgeTier === 'ages2-3' ? TODDLER_STORY : null); 
    const [topic, setTopic] = useState(''); 
    const [context, setContext] = useState('');
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    // Word Explorer States
    const [explorerMode, setExplorerMode] = useState<'read' | 'explore'>('read');
    const [explorerLoading, setExplorerLoading] = useState(false);
    const [exploredWord, setExploredWord] = useState<any>(null);
    const [isExplorerOpen, setIsExplorerOpen] = useState(false);

    // Voice/TTS States
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [spokenCharIndex, setSpokenCharIndex] = useState(-1);
    const [selectedCharId, setSelectedCharId] = useState('narrator');
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceName, setSelectedVoiceName] = useState('');

    useEffect(() => {
        if (story) {
            console.log("Story Spark State Log:", {
                contentLength: story.content?.length,
                story
            });
        }
    }, [story]);

    const voiceCharacters = useMemo(() => [
        { id: 'narrator', name: '👩‍🏫 Miss Sarah', icon: '👩‍🏫', rate: 0.9, pitch: 1.05, description: 'Friendly and clear teacher voice' },
        { id: 'bear', name: '🐻 Barnaby Bear', icon: '🐻', rate: 0.75, pitch: 0.7, description: 'Deep, slow, and cozy story voice' },
        { id: 'unicorn', name: '🦄 Lily Unicorn', icon: '🦄', rate: 1.0, pitch: 1.35, description: 'High, sparkly, and bright voice' },
        { id: 'robot', name: '🤖 Sparky Robot', icon: '🤖', rate: 0.95, pitch: 0.8, description: 'Friendly robotic tone' }
    ], []);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        const loadVoices = () => {
            const allVoices = window.speechSynthesis.getVoices();
            const englishVoices = allVoices.filter(v => v.lang.startsWith('en-'));
            setVoices(englishVoices);
            
            const defaultVoice = englishVoices.find(v => 
                v.name.includes('Google US English') || 
                v.name.includes('Natural') || 
                v.name.includes('Apple') ||
                v.lang === 'en-US'
            ) || englishVoices[0];
            
            if (defaultVoice && !selectedVoiceName) {
                setSelectedVoiceName(defaultVoice.name);
            }
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [selectedVoiceName]);

    // Auto-scroll to currently spoken word during read-aloud
    useEffect(() => {
        if (isSpeaking && typeof document !== 'undefined') {
            const activeWordEl = document.querySelector('.story-word-active');
            if (activeWordEl) {
                activeWordEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }
    }, [spokenCharIndex, isSpeaking]);

    // Get active text based on current story content
    const activeText = useMemo(() => {
        if (!story) return '';
        return story.content || '';
    }, [story]);

    // Split the text into lines, and lines into words, tracking character offsets
    const linesWithWordsAndOffsets = useMemo(() => {
        if (!activeText) return [];
        const lines = activeText.split('\n');
        let totalOffset = 0;
        
        return lines.map((lineText: string, lineIdx: number) => {
            const words: { word: string; start: number; end: number }[] = [];
            const wordRegex = /\S+/g;
            let match;
            while ((match = wordRegex.exec(lineText)) !== null) {
                words.push({
                    word: match[0],
                    start: totalOffset + match.index,
                    end: totalOffset + match.index + match[0].length
                });
            }
            totalOffset += lineText.length + 1; // +1 for the '\n' character
            return {
                lineIdx,
                lineText,
                words
            };
        });
    }, [story?.content]);
    
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
        try {
            // Pass the target word count to the AI flow
            const res = await generateJuniorStory({ topic, context, wordCount: parseInt(targetWordCount), schoolId: schoolId || '' }); 
            if (res.success && res.data) {
                let imageUrl = '';

                try {
                    const imgRes = await generateLessonImageAction({
                        prompt: `A cute 3D Pixar-style digital illustration of a children's storybook scene depicting: ${res.data.title}. Bright colors, soft lighting, friendly characters, highly detailed.`,
                        schoolId: schoolId || ''
                    });
                    if (imgRes.success && imgRes.data) {
                        imageUrl = imgRes.data;
                    }
                } catch (err) {
                    console.error("Story cover image generation failed:", err);
                }

                setStory({ ...res.data, imageUrl });
                setCurrentPageIndex(0);
                resetQuiz();
                toast({ title: "Story Created!", description: "Your custom illustrated storybook is ready! 📖" });
            } else {
                toast({ 
                    title: "Generation Failed", 
                    description: res.error || "Failed to generate story. Please verify your school ID and AI credits.",
                    variant: "destructive"
                });
            }
        } catch (err: any) {
            console.error("Story generation crash:", err);
            toast({
                title: "Unexpected Error",
                description: err.message || "Something went wrong during generation. Check dev console.",
                variant: "destructive"
            });
        } finally {
            setLoading(false); 
        }
    };
     
    const sanitizeForFirestore = (val: any): any => {
        if (val === undefined) return null;
        if (val === null) return null;
        if (Array.isArray(val)) {
            return val.map(sanitizeForFirestore);
        }
        if (typeof val === 'object') {
            if (val.constructor && val.constructor.name !== 'Object' && val.constructor.name !== 'Array') {
                return val;
            }
            const cleaned: any = {};
            for (const key of Object.keys(val)) {
                if (val[key] !== undefined) {
                    cleaned[key] = sanitizeForFirestore(val[key]);
                }
            }
            return cleaned;
        }
        return val;
    };

    const handleSave = async () => { 
        if (!user || !story || !firestore) return; 
        
        let cleanStory = sanitizeForFirestore(story);

        // If the cover image is a base64 string, upload it to Firebase Storage first to avoid Firestore 1MB limit crash
        if (cleanStory.imageUrl && cleanStory.imageUrl.startsWith('data:')) {
            try {
                toast({ title: "Saving Story...", description: "Uploading cover illustration..." });
                const { getStorage, ref: storageRef, uploadString, getDownloadURL } = await import('firebase/storage');
                const storage = getStorage();
                const path = `junior_stories/${user.uid}_${Date.now()}_cover.png`;
                const sRef = storageRef(storage, path);
                const snapshot = await uploadString(sRef, cleanStory.imageUrl, 'data_url');
                const downloadURL = await getDownloadURL(snapshot.ref);
                cleanStory.imageUrl = downloadURL;
            } catch (storageErr) {
                console.error("Firebase Storage upload failed, falling back to empty image:", storageErr);
                cleanStory.imageUrl = ''; // Clear base64 image data to prevent Firestore document size crash
            }
        }
        
        try {
            await addDoc(collection(firestore, 'junior_stories'), { 
                ...cleanStory, 
                topic, 
                wordCount: (cleanStory.content || '').split(/\s+/).filter(Boolean).length || 0,
                createdAt: serverTimestamp(), 
                createdBy: user.uid 
            }); 
            setStory(null); 
            forceRefetch(); 
            toast({ title: "Story Saved!", description: "Saved successfully to your library." }); 
        } catch (dbErr: any) {
            console.error("Firestore save failed:", dbErr);
            toast({ 
                title: "Save Failed", 
                description: dbErr.message || "Failed to save story to library.",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (id: string) => { 
        if (!firestore) return;
        if (confirm("Delete story?")) { 
            await deleteDoc(doc(firestore, 'junior_stories', id)); 
            forceRefetch(); 
        } 
    };

    const speakText = (text: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        
        const char = voiceCharacters.find(c => c.id === selectedCharId) || voiceCharacters[0];
        u.pitch = char.pitch;
        u.rate = char.rate;

        const voice = voices.find(v => v.name === selectedVoiceName);
        if (voice) {
            u.voice = voice;
        }

        window.speechSynthesis.speak(u);
    };

    const handleToggleSpeech = () => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setSpokenCharIndex(-1);
        } else {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(activeText);

            const char = voiceCharacters.find(c => c.id === selectedCharId) || voiceCharacters[0];
            u.pitch = char.pitch;
            u.rate = char.rate;

            const voice = voices.find(v => v.name === selectedVoiceName);
            if (voice) {
                u.voice = voice;
            }

            u.onstart = () => {
                setIsSpeaking(true);
            };
            u.onend = () => {
                setIsSpeaking(false);
                setSpokenCharIndex(-1);
            };
            u.onerror = () => {
                setIsSpeaking(false);
                setSpokenCharIndex(-1);
            };
            u.onboundary = (event) => {
                if (event.name === 'word') {
                    setSpokenCharIndex(event.charIndex);
                }
            };

            window.speechSynthesis.speak(u);
            setIsSpeaking(true);
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
            speakText("Correct! Well done!");
        } else {
            speakText("Not quite, but good try!");
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < story.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setUserAnswer('');
            setIsAnswerSubmitted(false);
        } else {
            setQuizFinished(true);
            if (score === 3) {
                speakText("Sensational job! You got a perfect score! You are a superstar reader!");
                confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
            } else if (score === 2) {
                speakText("Fantastic effort! You got 2 out of 3 correct! You are a star reader!");
            } else {
                speakText("Great try! Keep practicing to become a star reader!");
            }
        }
    };

    const handleSelectStory = (s: any) => {
        setStory(s);
        setCurrentPageIndex(0);
        speakText(s.title);
        resetQuiz();
    };

    const handleWordClick = async (w: any) => {
        if (typeof window === 'undefined') return;
        
        const cleanWord = w.word.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
        if (!cleanWord) return;

        if (explorerMode === 'explore') {
            window.speechSynthesis.cancel();
            speakText(cleanWord);
            
            setExploredWord({ word: cleanWord });
            setIsExplorerOpen(true);
            setExplorerLoading(true);
            
            try {
                const detailRes = await generateWordDetails({ word: cleanWord, schoolId: schoolId || '' });
                if (detailRes.success && detailRes.data) {
                    setExploredWord(detailRes.data);
                } else {
                    toast({ title: "Oops!", description: "Could not load word details." });
                    setIsExplorerOpen(false);
                }
            } catch (err) {
                console.error("Word exploration failed:", err);
                setIsExplorerOpen(false);
            } finally {
                setExplorerLoading(false);
            }
        } else {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
                const remainingText = activeText.slice(w.start);
                const u = new SpeechSynthesisUtterance(remainingText);
                const char = voiceCharacters.find(c => c.id === selectedCharId) || voiceCharacters[0];
                u.pitch = char.pitch;
                u.rate = char.rate;
                const voice = voices.find(v => v.name === selectedVoiceName);
                if (voice) u.voice = voice;
                u.onstart = () => setIsSpeaking(true);
                u.onend = () => { setIsSpeaking(false); setSpokenCharIndex(-1); };
                u.onerror = () => { setIsSpeaking(false); setSpokenCharIndex(-1); };
                u.onboundary = (event) => {
                    if (event.name === 'word') {
                        setSpokenCharIndex(w.start + event.charIndex);
                    }
                };
                window.speechSynthesis.speak(u);
                setIsSpeaking(true);
            }
        }
    };

    // Calculate actual word count of generated story
    const actualWordCount = story?.content?.split(/\s+/).filter(Boolean).length || 0;

    return (
        <div className="space-y-8">
            {canEdit && (
                <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-purple-200">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <h3 className="text-xl font-black text-purple-855 flex items-center gap-2"><Wand2 /> Story Lab</h3>
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
                                className="text-lg h-12 rounded-xl flex-1 border-2 border-purple-100 focus:border-purple-300 focus:ring-0 bg-white"
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
                        </div>
                        
                        {/* Optional Guidelines Context */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-purple-600 block pl-1 tracking-wider">Story Guidelines / Context (Optional)</label>
                            <Input 
                                value={context} 
                                onChange={e => setContext(e.target.value)} 
                                placeholder="E.g., include a character named Barnaby, teach a lesson about sharing, focus on the letter S" 
                                className="h-11 rounded-xl border-2 border-purple-100 focus:border-purple-300 focus:ring-0 text-sm bg-white"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={handleGenerate} disabled={loading || !topic} className="h-12 px-8 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md font-black">
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
                    {story.imageUrl && (
                        <div className="relative w-full h-[280px] border-b-4 border-yellow-300 overflow-hidden bg-yellow-100 flex items-center justify-center select-none">
                            <img 
                                src={story.imageUrl} 
                                alt={story.title} 
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-102" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>
                    )}
                    <CardContent className="p-8 space-y-8">
                        {/* Mode Toggle Switch */}
                        <div className="flex justify-center select-none">
                            <div className="bg-yellow-100/70 p-1.5 rounded-2xl border-2 border-yellow-250/50 flex gap-2 shadow-sm">
                                <button 
                                    onClick={() => setExplorerMode('read')}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                                        explorerMode === 'read'
                                            ? "bg-yellow-300 text-yellow-950 shadow-md scale-[1.02]"
                                            : "text-yellow-800 hover:bg-yellow-200/30"
                                    )}
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Read Along
                                </button>
                                <button 
                                    onClick={() => {
                                        setExplorerMode('explore');
                                        if (isSpeaking) {
                                            window.speechSynthesis.cancel();
                                            setIsSpeaking(false);
                                            setSpokenCharIndex(-1);
                                        }
                                    }}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                                        explorerMode === 'explore'
                                            ? "bg-purple-600 text-white shadow-md scale-[1.02]"
                                            : "text-purple-600 hover:bg-purple-100/40"
                                    )}
                                >
                                    <Search className="w-4 h-4" />
                                    Word Explorer
                                </button>
                            </div>
                        </div>

                        {/* THE STORY TEXT Styled like Lined Book Paper */}
                        <div className="relative bg-white rounded-3xl border-2 border-amber-200/70 p-8 pl-16 md:p-10 md:pl-20 shadow-inner overflow-hidden select-none" style={{ backgroundImage: 'linear-gradient(#fdfbf7 2px, transparent 2px)', backgroundSize: '100% 2.5rem', lineHeight: '2.5rem' }}>
                            <div className="absolute top-0 left-12 md:left-16 w-[2px] h-full bg-red-200"></div>
                            <div className="text-xl md:text-2xl leading-[2.5rem] text-slate-800 font-extrabold tracking-wide space-y-4">
                                {linesWithWordsAndOffsets.map((line: any, lineIdx: number) => (
                                    <div key={lineIdx} className="min-h-[2.5rem]">
                                        {line.words.length > 0 ? (
                                            line.words.map((w: any, wIdx: number) => {
                                                const isActive = isSpeaking && spokenCharIndex >= w.start && spokenCharIndex < w.end;
                                                return (
                                                    <span 
                                                        key={wIdx} 
                                                        className={cn(
                                                            "transition-all duration-150 inline-block px-1 rounded mr-1.5 cursor-pointer hover:bg-yellow-50",
                                                            isActive 
                                                                ? "story-word-active bg-yellow-300 text-yellow-950 font-black scale-110 shadow-md ring-2 ring-yellow-400" 
                                                                : "text-slate-800"
                                                        )}
                                                        onClick={() => handleWordClick(w)}
                                                    >
                                                        {w.word}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            <span>&nbsp;</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Audio Control Bar Panel */}
                        <div className="bg-yellow-100/50 p-5 rounded-3xl border-2 border-yellow-200/65 shadow-inner flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-3.5">
                                <Button 
                                    onClick={handleToggleSpeech} 
                                    className={cn(
                                        "h-14 px-6 rounded-2xl font-black shadow-md flex items-center justify-center gap-2 text-white transition-all",
                                        isSpeaking 
                                            ? "bg-amber-500 hover:bg-amber-600 scale-[1.02]" 
                                            : "bg-emerald-600 hover:bg-emerald-700"
                                    )}
                                >
                                    {isSpeaking ? (
                                        <>
                                            <Pause className="w-5 h-5 fill-current" />
                                            <span>Pause Reading</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5 fill-current" />
                                            <span>Read Aloud</span>
                                        </>
                                    )}
                                </Button>
                                
                                {isSpeaking && (
                                    <Button 
                                        onClick={() => {
                                            if (typeof window !== 'undefined' && window.speechSynthesis) {
                                                window.speechSynthesis.cancel();
                                                setIsSpeaking(false);
                                                setSpokenCharIndex(-1);
                                            }
                                        }} 
                                        variant="destructive"
                                        className="h-14 px-5 rounded-2xl font-black shadow-md flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        <span>Stop</span>
                                    </Button>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 flex-1 justify-end">
                                {/* Voice Character Selector */}
                                <div className="min-w-[165px]">
                                    <span className="text-[10px] font-black uppercase text-yellow-805 block mb-1 pl-1">Voice Character</span>
                                    <Select value={selectedCharId} onValueChange={setSelectedCharId}>
                                        <SelectTrigger className="h-11 rounded-xl border border-yellow-250 bg-white font-bold text-xs text-slate-700 focus:ring-0">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border border-yellow-100">
                                            {voiceCharacters.map(char => (
                                                <SelectItem key={char.id} value={char.id} className="text-xs font-bold text-slate-750">
                                                    <span className="flex items-center gap-1.5">
                                                        <span>{char.icon}</span>
                                                        <span>{char.name}</span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Installed natural English system voices */}
                                {voices.length > 0 && (
                                    <div className="min-w-[210px] max-w-[260px]">
                                        <span className="text-[10px] font-black uppercase text-yellow-805 block mb-1 pl-1">System Voice (Natural feel)</span>
                                        <Select value={selectedVoiceName} onValueChange={setSelectedVoiceName}>
                                            <SelectTrigger className="h-11 rounded-xl border border-yellow-250 bg-white text-xs font-semibold text-slate-600 truncate focus:ring-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl max-h-[220px]">
                                                {voices.map(v => (
                                                    <SelectItem key={v.name} value={v.name} className="text-xs">
                                                        {v.name.replace('Microsoft', '').replace('Desktop', '').trim()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {canEdit && (
                            <div className="flex gap-4">
                                <Button onClick={handleSave} className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700 font-bold rounded-2xl shadow-sm">
                                    <Save className="mr-2" /> Save to Library
                                </Button>
                            </div>
                        )}

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
                                <div className="text-center py-4 space-y-6 animate-in zoom-in">
                                    <div className="flex justify-center gap-3">
                                        {[1, 2, 3].map((starIndex) => {
                                            const isActive = score >= starIndex;
                                            return (
                                                <Star 
                                                    key={starIndex}
                                                    className={cn(
                                                        "w-12 h-12 transition-all duration-700",
                                                        isActive 
                                                            ? "fill-yellow-450 text-yellow-550 scale-110 drop-shadow-md animate-bounce" 
                                                            : "text-slate-200 fill-slate-100"
                                                    )}
                                                    style={{ animationDelay: `${(starIndex - 1) * 200}ms` }}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black text-purple-900 animate-pulse">Quiz Complete!</h3>
                                        <p className="text-xl font-black text-purple-600">You got {score} out of 3 correct!</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-4">
                                        {score === 3 ? (
                                            <div className="inline-block bg-yellow-100 border-2 border-yellow-300 text-yellow-800 text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-sm select-none">
                                                🏆 Superstar Reader
                                            </div>
                                        ) : score === 2 ? (
                                            <div className="inline-block bg-slate-100 border-2 border-slate-300 text-slate-700 text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-sm select-none">
                                                ⭐ Star Reader
                                            </div>
                                        ) : (
                                            <div className="inline-block bg-blue-50 border-2 border-blue-200 text-blue-700 text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-sm select-none">
                                                🚀 Junior Explorer
                                            </div>
                                        )}
                                        <Button onClick={resetQuiz} variant="ghost" className="text-purple-400 hover:text-purple-650 font-extrabold text-sm uppercase tracking-wider">Try Quiz Again</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* WORD EXPLORER DIALOG */}
            <Dialog open={isExplorerOpen} onOpenChange={setIsExplorerOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl border-4 border-purple-200 bg-purple-50 overflow-hidden shadow-2xl p-0">
                    <DialogHeader className="bg-purple-600 p-6 text-white text-center flex flex-col items-center">
                        <DialogTitle className="text-xl font-black tracking-wider flex items-center gap-2">
                            <Search className="w-5 h-5" /> Word Explorer
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="p-8 flex flex-col items-center text-center space-y-6">
                        {explorerLoading ? (
                            <div className="space-y-4 py-8 flex flex-col items-center">
                                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                                <p className="text-sm font-black text-purple-800 animate-pulse uppercase tracking-wider">
                                    Asking the Word Wizard... 🧙‍♂️
                                </p>
                            </div>
                        ) : exploredWord ? (
                            <div className="space-y-5 w-full">
                                <div className="text-7xl bg-white p-6 rounded-full shadow-inner border-2 border-purple-100 inline-block select-none animate-bounce">
                                    {exploredWord.emoji || "✨"}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-purple-950 capitalize flex items-center justify-center gap-2.5">
                                        {exploredWord.word}
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-8 w-8 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 shadow-sm"
                                            onClick={() => speakText(exploredWord.word)}
                                        >
                                            <Volume2 className="h-4 w-4 fill-current" />
                                        </Button>
                                    </h3>
                                    {exploredWord.phonetic && (
                                        <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3.5 py-1 rounded-full font-extrabold border border-purple-200">
                                            {exploredWord.phonetic}
                                        </span>
                                    )}
                                </div>
                                
                                {exploredWord.meaning && (
                                    <div className="bg-purple-150/40 p-4.5 rounded-2xl border border-purple-200 shadow-inner text-left select-none">
                                        <span className="text-[9px] uppercase tracking-widest font-black text-purple-500 block mb-1">What it means</span>
                                        <p className="text-purple-900 font-extrabold text-sm leading-relaxed">
                                            {exploredWord.meaning}
                                        </p>
                                    </div>
                                )}
                                
                                {exploredWord.sentence && (
                                    <div className="bg-white p-5 rounded-2xl border-2 border-purple-150 shadow-sm relative text-left select-none">
                                        <span className="absolute -top-3 left-6 bg-purple-200 text-purple-800 text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-md">Example Sentence</span>
                                        <p className="text-slate-700 font-extrabold text-sm leading-relaxed mt-1 italic">
                                            "{exploredWord.sentence}"
                                        </p>
                                    </div>
                                )}
                                
                                <Button 
                                    onClick={() => setIsExplorerOpen(false)}
                                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-md uppercase tracking-wider text-xs border-0"
                                >
                                    Awesome!
                                </Button>
                            </div>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>

            {/* LIBRARY SECTION */}
            <div>
                <h3 className="text-2xl font-black text-slate-700 mb-6 flex items-center gap-2">
                    <BookOpen className="text-purple-500" /> Story Library
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedStories?.map((s:any) => (
                        <Card key={s.id} className="cursor-pointer border-2 border-b-[10px] border-purple-200 hover:border-purple-400 hover:-translate-y-1 transition-all relative group rounded-3xl overflow-hidden bg-white shadow-md">
                            {/* Colorful spine spine strip */}
                            <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-b from-purple-500 to-indigo-400 z-10"></div>
                            
                            {s.imageUrl && (
                                <div className="w-full h-32 overflow-hidden border-b border-slate-100 pl-3 select-none">
                                    <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                            )}
                            
                            <CardContent className="p-5 pl-8 flex items-center gap-4" onClick={() => handleSelectStory(s)}>
                                {!s.imageUrl && (
                                    <div className="text-5xl bg-slate-50 p-2.5 rounded-2xl shadow-inner border border-slate-100">{s.emojiIcon}</div>
                                )}
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-black text-lg text-slate-800 truncate flex items-center gap-1.5">
                                        {s.imageUrl && <span className="text-xl">{s.emojiIcon}</span>}
                                        <span className="truncate">{s.title}</span>
                                    </h4>
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
function ScienceWorld({ canEdit, activeAgeTier = 'ages2-3' }: { canEdit: boolean; activeAgeTier?: string }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    
    const [activeTab, setActiveTab] = useState<'lab' | 'sorter' | 'solar' | 'body' | 'experiment' | 'library'>(activeAgeTier === 'ages5+' ? 'solar' : 'lab');
    
    const SOLAR_SYSTEM_PLANETS = useMemo(() => [
      { name: "Sun ☀️", type: "Star", fact: "The giant burning ball of gas at the center of our solar system!" },
      { name: "Mercury 🪨", type: "Rocky Planet", fact: "The smallest planet closest to the burning Sun!" },
      { name: "Venus 🟡", type: "Rocky Planet", fact: "The hottest planet with thick yellow clouds!" },
      { name: "Earth 🌍", type: "Home Planet", fact: "Our beautiful blue water world where living plants and animals thrive!" },
      { name: "Mars 🔴", type: "Red Planet", fact: "The rusty red desert planet with giant volcanoes!" },
      { name: "Jupiter 🪐", type: "Gas Giant", fact: "The largest planet in the solar system with a giant stormy red spot!" },
      { name: "Saturn 🪐", type: "Ringed Giant", fact: "Famous for its magnificent rings made of ice and rock!" },
      { name: "Moon 🌙", type: "Earth's Satellite", fact: "Orbits around Earth every month and shines at night!" }
    ], []);

    const HUMAN_BODY_ORGANS = useMemo(() => [
      { name: "Brain 🧠", system: "Nervous System", function: "Controls all thinking, memory, emotions, and bodily movements!" },
      { name: "Heart ❤️", system: "Circulatory System", function: "Pumps oxygen-rich blood through blood vessels to all body parts!" },
      { name: "Lungs 🫁", system: "Respiratory System", function: "Inhales fresh oxygen from air and exhales carbon dioxide waste!" },
      { name: "Stomach 🥪", system: "Digestive System", function: "Breaks down food and absorbs nutrients into energy!" },
      { name: "Skeleton 🦴", system: "Skeletal System", function: "206 bones that protect organs and allow body movement!" }
    ], []);

    const [selectedPlanet, setSelectedPlanet] = useState<any>(SOLAR_SYSTEM_PLANETS[3]);
    const [selectedOrgan, setSelectedOrgan] = useState<any>(HUMAN_BODY_ORGANS[0]);
    
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
            <div className="flex gap-2 p-1.5 bg-blue-50/50 rounded-2xl w-full overflow-x-auto no-scrollbar border border-blue-100/50 shadow-inner">
                <Button 
                    variant={activeTab === 'solar' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('solar')}
                    className={cn(
                      "rounded-xl font-black transition-all text-sm h-10 px-5 min-w-[120px]",
                      activeTab === 'solar' 
                        ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-md border-b-4 border-indigo-800' 
                        : 'text-blue-700 hover:bg-blue-100/40 border border-transparent'
                    )}
                >
                    🌌 Solar System
                </Button>
                <Button 
                    variant={activeTab === 'body' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('body')}
                    className={cn(
                      "rounded-xl font-black transition-all text-sm h-10 px-5 min-w-[120px]",
                      activeTab === 'body' 
                        ? 'bg-gradient-to-b from-purple-600 to-pink-600 text-white shadow-md border-b-4 border-purple-800' 
                        : 'text-purple-700 hover:bg-purple-100/40 border border-transparent'
                    )}
                >
                    🧠 Body Organs
                </Button>
                <Button 
                    variant={activeTab === 'lab' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('lab')}
                    className={cn(
                      "rounded-xl font-black transition-all text-sm h-10 px-5 min-w-[100px]",
                      activeTab === 'lab' 
                        ? 'bg-gradient-to-b from-blue-500 to-sky-500 text-white shadow-md border-b-4 border-blue-700' 
                        : 'text-blue-700 hover:bg-blue-100/40 border border-transparent'
                    )}
                >
                    💡 AI Discovery
                </Button>
                <Button 
                    variant={activeTab === 'sorter' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('sorter')}
                    className={cn(
                      "rounded-xl font-black transition-all text-sm h-10 px-5 min-w-[100px]",
                      activeTab === 'sorter' 
                        ? 'bg-gradient-to-b from-blue-500 to-sky-500 text-white shadow-md border-b-4 border-blue-700' 
                        : 'text-blue-700 hover:bg-blue-100/40 border border-transparent'
                    )}
                >
                    🌱 Living Sorter
                </Button>
                <Button 
                    variant={activeTab === 'experiment' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('experiment')}
                    className={cn(
                      "rounded-xl font-black transition-all text-sm h-10 px-5 min-w-[110px]",
                      activeTab === 'experiment' 
                        ? 'bg-gradient-to-b from-blue-500 to-sky-500 text-white shadow-md border-b-4 border-blue-700' 
                        : 'text-blue-700 hover:bg-blue-100/40 border border-transparent'
                    )}
                >
                    🧊 Matter Lab
                </Button>
                <Button 
                    variant={activeTab === 'library' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('library')}
                    className={cn(
                      "rounded-xl font-black transition-all text-sm h-10 px-5 min-w-[100px]",
                      activeTab === 'library' 
                        ? 'bg-gradient-to-b from-blue-500 to-sky-500 text-white shadow-md border-b-4 border-blue-700' 
                        : 'text-blue-700 hover:bg-blue-100/40 border border-transparent'
                    )}
                >
                    Journal
                </Button>
            </div>

            {/* SOLAR SYSTEM EXPLORER FOR AGE 5+ */}
            {activeTab === 'solar' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-8 rounded-[40px] text-white border-4 border-indigo-500/30 shadow-2xl space-y-6">
                  <div className="text-center">
                    <span className="text-xs font-black uppercase tracking-widest text-indigo-300 bg-indigo-900/50 px-4 py-1 rounded-full border border-indigo-400/30">
                      Primary Science: Solar System Explorer
                    </span>
                    <h3 className="text-3xl font-black text-white mt-2">The Solar System & Planets 🌌</h3>
                    <p className="text-xs text-indigo-200 font-medium">Tap any planet to learn its scientific classification and cosmic fact!</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {SOLAR_SYSTEM_PLANETS.map((p) => (
                      <div
                        key={p.name}
                        onClick={() => {
                          setSelectedPlanet(p);
                          speak(`${p.name}. ${p.fact}`);
                        }}
                        className={cn(
                          "p-4 rounded-3xl border-2 text-center cursor-pointer transition-all hover:scale-105",
                          selectedPlanet?.name === p.name ? "bg-indigo-600/60 border-amber-400 shadow-lg ring-4 ring-amber-400/30" : "bg-white/10 border-white/10 hover:bg-white/20"
                        )}
                      >
                        <span className="text-4xl block mb-1">{p.name.split(' ')[1]}</span>
                        <span className="text-xs font-black block">{p.name.split(' ')[0]}</span>
                        <span className="text-[10px] text-indigo-300 font-bold block">{p.type}</span>
                      </div>
                    ))}
                  </div>

                  {selectedPlanet && (
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center space-y-3">
                      <h4 className="text-2xl font-black text-amber-300">{selectedPlanet.name}</h4>
                      <p className="text-base font-bold text-slate-100 max-w-xl mx-auto">"{selectedPlanet.fact}"</p>
                      <Button onClick={() => speak(`${selectedPlanet.name}. ${selectedPlanet.fact}`)} className="bg-indigo-500 hover:bg-indigo-600 text-white font-black rounded-2xl text-xs">
                        <Volume2 className="w-4 h-4 mr-2" /> Listen to Planet Audio
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* HUMAN BODY ORGANS FOR AGE 5+ */}
            {activeTab === 'body' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-purple-50 p-8 rounded-[40px] border-4 border-purple-200 text-center space-y-6 shadow-xl">
                  <div>
                    <span className="text-xs font-black uppercase tracking-widest text-purple-600 bg-purple-100 px-4 py-1 rounded-full border border-purple-200">
                      Primary Science: Human Body Anatomy
                    </span>
                    <h3 className="text-3xl font-black text-purple-950 mt-2">Human Body Organs & Systems 🧠</h3>
                    <p className="text-xs text-purple-700 font-medium">Explore how vital organs keep the human body healthy and functioning!</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {HUMAN_BODY_ORGANS.map((o) => (
                      <div
                        key={o.name}
                        onClick={() => {
                          setSelectedOrgan(o);
                          speak(`${o.name}. ${o.function}`);
                        }}
                        className={cn(
                          "p-4 rounded-3xl border-2 text-center cursor-pointer transition-all hover:scale-105 bg-white",
                          selectedOrgan?.name === o.name ? "border-purple-500 bg-purple-100 shadow-md ring-4 ring-purple-200" : "border-purple-100 hover:bg-purple-50"
                        )}
                      >
                        <span className="text-4xl block mb-1">{o.name.split(' ')[1]}</span>
                        <span className="text-xs font-black block text-slate-800">{o.name.split(' ')[0]}</span>
                        <span className="text-[9px] text-purple-600 font-bold block">{o.system}</span>
                      </div>
                    ))}
                  </div>

                  {selectedOrgan && (
                    <div className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-inner max-w-xl mx-auto space-y-3">
                      <span className="text-xs font-black text-purple-600 uppercase tracking-widest">{selectedOrgan.system}</span>
                      <h4 className="text-2xl font-black text-slate-900">{selectedOrgan.name}</h4>
                      <p className="text-base font-bold text-slate-700">"{selectedOrgan.function}"</p>
                      <Button onClick={() => speak(`${selectedOrgan.name}. ${selectedOrgan.function}`)} className="bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl text-xs">
                        <Volume2 className="w-4 h-4 mr-2" /> Listen to Organ Function
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

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
function ArtStudio({ canEdit, activeAgeTier = 'ages2-3' }: { canEdit: boolean; activeAgeTier?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeTab, setActiveTab] = useState<'freestyle' | 'color-lab' | 'shapes' | 'gallery' | 'symmetry'>('freestyle');
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#4f46e5');
    const [brushSize, setBrushSize] = useState(3);
    const [tool, setTool] = useState<'brush' | 'bucket' | 'stamp' | 'pencil' | 'crayon' | 'paint_brush' | 'marker'>('brush');
    const [selectedShape, setSelectedShape] = useState<'circle' | 'square' | 'star'>('circle');
    const [symmetryMode, setSymmetryMode] = useState(false);
    const lastPoint = useRef<{ x: number; y: number } | null>(null);
    
    const AGE5_ART_QUESTS = useMemo(() => [
      { title: "Space Adventure 🚀", prompt: "Draw Commander Leo's Rocket launching past stars and planets into deep space!" },
      { title: "Underwater Kingdom 🐠", prompt: "Draw colourful fish swimming through sea anemones and coral reefs!" },
      { title: "Medieval Castle 🏰", prompt: "Draw a tall castle with towers, flags, and a drawbridge!" },
      { title: "Nature Rainbow 🌈", prompt: "Draw a bright 7-color rainbow over a green forest with birds!" },
      { title: "Prehistoric Dinosaur 🦕", prompt: "Draw a friendly green dinosaur eating leaves from a tall tree!" }
    ], []);

    const [questIdx, setQuestIdx] = useState(0);

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

    const getCanvasPos = (e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const { x, y } = getCanvasPos(e);

        if (tool === 'brush' || tool === 'pencil' || tool === 'crayon' || tool === 'paint_brush' || tool === 'marker') {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.strokeStyle = color;
            ctx.lineWidth = tool === 'pencil' ? 2 : tool === 'marker' ? 12 : brushSize;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            setIsDrawing(true);
            lastPoint.current = { x, y };
        }
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const { x, y } = getCanvasPos(e);

        ctx.strokeStyle = color;
        ctx.lineWidth = tool === 'pencil' ? 2 : tool === 'marker' ? 12 : brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.lineTo(x, y);
        ctx.stroke();

        if (symmetryMode && lastPoint.current) {
            const mirrorX = canvas.width - x;
            const mirrorLastX = canvas.width - lastPoint.current.x;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(mirrorLastX, lastPoint.current.y);
            ctx.lineTo(mirrorX, y);
            ctx.stroke();
            ctx.restore();
        }

        lastPoint.current = { x, y };
    };

    const stopDrawing = () => { 
        setIsDrawing(false); 
        lastPoint.current = null;
    };
    
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
            {activeAgeTier === 'ages5+' && (
              <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                    Class 1 Creative Art Challenge
                  </span>
                  <h3 className="text-2xl font-black mt-1 flex items-center gap-2">
                    🎨 {AGE5_ART_QUESTS[questIdx].title}
                  </h3>
                  <p className="text-xs text-pink-100 font-medium mt-0.5 max-w-xl">"{AGE5_ART_QUESTS[questIdx].prompt}"</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setQuestIdx((prev) => (prev + 1) % AGE5_ART_QUESTS.length)} variant="secondary" className="font-black text-xs rounded-2xl bg-white text-purple-900 hover:bg-pink-50">
                    Next Art Challenge <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-2 p-1.5 bg-cyan-50/50 rounded-2xl w-full overflow-x-auto no-scrollbar border border-cyan-100/50 shadow-inner">
                <Button 
                    variant={activeTab === 'freestyle' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('freestyle')} 
                    className={cn(
                      "rounded-xl font-black transition-all text-sm h-10 px-5 min-w-[100px]",
                      activeTab === 'freestyle' 
                        ? 'bg-gradient-to-b from-cyan-500 to-teal-400 text-white shadow-md border-b-4 border-cyan-600' 
                        : 'text-cyan-700 hover:bg-cyan-100/40 border border-transparent'
                    )}
                >
                    🎨 Freestyle
                </Button>
                <Button 
                    variant={symmetryMode ? 'default' : 'ghost'} 
                    onClick={() => setSymmetryMode(!symmetryMode)} 
                    className={cn(
                      "rounded-xl font-black transition-all text-sm h-10 px-5 min-w-[120px]",
                      symmetryMode 
                        ? 'bg-gradient-to-b from-purple-600 to-indigo-600 text-white shadow-md border-b-4 border-purple-800' 
                        : 'text-purple-700 hover:bg-purple-100/40 border border-transparent'
                    )}
                >
                    🦋 Symmetry {symmetryMode ? 'ON' : 'OFF'}
                </Button>
                <Button 
                    variant={activeTab === 'color-lab' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('color-lab')} 
                    className={cn(
                      "rounded-xl font-black transition-all text-sm h-10 px-5 min-w-[100px]",
                      activeTab === 'color-lab' 
                        ? 'bg-gradient-to-b from-cyan-500 to-teal-400 text-white shadow-md border-b-4 border-cyan-600' 
                        : 'text-cyan-700 hover:bg-cyan-100/40 border border-transparent'
                    )}
                >
                    🌈 Color Lab
                </Button>
                <Button 
                    variant={activeTab === 'shapes' ? 'default' : 'ghost'} 
                    onClick={() => setActiveTab('shapes')} 
                    className={cn(
                      "rounded-xl font-black transition-all text-sm h-10 px-5 min-w-[120px]",
                      activeTab === 'shapes' 
                        ? 'bg-gradient-to-b from-cyan-500 to-teal-400 text-white shadow-md border-b-4 border-cyan-600' 
                        : 'text-cyan-700 hover:bg-cyan-100/40 border border-transparent'
                    )}
                >
                    📐 Shape Quest
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
                                <div className="flex justify-between items-center">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Brush Line Size ({brushSize}px)</label>
                                </div>
                                <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-50 border border-slate-100 rounded-xl">
                                  {[
                                    { label: 'Fine', size: 2, icon: '✏️' },
                                    { label: 'Pen', size: 4, icon: '🖊️' },
                                    { label: 'Bold', size: 8, icon: '🖌️' },
                                    { label: 'Shading', size: 16, icon: '🖍️' }
                                  ].map(b => (
                                    <button
                                      key={b.size}
                                      type="button"
                                      onClick={() => setBrushSize(b.size)}
                                      className={cn(
                                        "py-1.5 text-[10px] font-black rounded-lg border transition-all flex flex-col items-center justify-center bg-white",
                                        brushSize === b.size ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm' : 'border-slate-100 text-slate-600 hover:border-slate-200'
                                      )}
                                    >
                                      <span>{b.icon} {b.size}px</span>
                                    </button>
                                  ))}
                                </div>
                                <input type="range" min="1" max="25" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full accent-indigo-500 bg-slate-100 h-2 rounded-full cursor-pointer mt-1" />
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

// --- 9. NUMBER GARDEN (COUNTING, TRACING & WORD MATCHING) ---
function NumberGarden({ activeAgeTier = 'ages2-3' }: { activeAgeTier?: string }) {
    const [activeTab, setActiveTab] = useState<'counting' | 'tracing' | 'matching'>('counting');
    const [currentNumber, setCurrentNumber] = useState(1);
    const [countingItems, setCountingItems] = useState<string[]>([]);
    const [tappedCount, setTappedCount] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [streak, setStreak] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isTracing, setIsTracing] = useState(false);
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    // Duplicate prevention refs
    const lastCountingNumberRef = useRef<number>(-1);
    const lastMatchingNumberRef = useRef<number>(-1);

    // Matching game state
    const [matchTarget, setMatchTarget] = useState<{ digit: number; word: string }>({ digit: 5, word: 'five' });
    const [matchOptions, setMatchOptions] = useState<string[]>([]);
    const [matchMode, setMatchMode] = useState<'digit-to-word' | 'word-to-digit'>('digit-to-word');

    const numberWords: Record<number, string> = {
        1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
        6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
        11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
        16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty'
    };

    const emojis = ['🍎', '🌟', '🐶', '🐱', '🦋', '🌺', '🚗', '⚽', '🎈', '🍪', '🐝', '🌈', '🍓', '🐸', '🎵', '🌻', '🍬', '🐠', '🎀', '🌙'];

    const generateCounting = useCallback(() => {
        let maxNum = 10;
        if (activeAgeTier === 'ages2-3') maxNum = 5;
        else if (activeAgeTier === 'ages3-4') maxNum = 10;
        else if (activeAgeTier === 'ages4-5') maxNum = 15;
        else maxNum = 20;

        let num;
        let attempts = 0;
        do {
            num = Math.floor(Math.random() * maxNum) + 1;
            attempts++;
        } while (num === lastCountingNumberRef.current && maxNum > 1 && attempts < 5);

        lastCountingNumberRef.current = num;

        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        setCurrentNumber(num);
        setCountingItems(Array(num).fill(emoji));
        setTappedCount(0);
        setFeedback('');
        speak(`How many do you see? Tap each one to count!`);
    }, [activeAgeTier]);

    const generateMatching = useCallback(() => {
        let maxNum = 20;
        if (activeAgeTier === 'ages2-3') maxNum = 5;
        else if (activeAgeTier === 'ages3-4') maxNum = 10;
        else if (activeAgeTier === 'ages4-5') maxNum = 15;
        else maxNum = 20;

        let targetNum;
        let attempts = 0;
        do {
            targetNum = Math.floor(Math.random() * maxNum) + 1;
            attempts++;
        } while (targetNum === lastMatchingNumberRef.current && maxNum > 1 && attempts < 5);

        lastMatchingNumberRef.current = targetNum;

        const mode = Math.random() > 0.5 ? 'digit-to-word' : 'word-to-digit';
        setMatchMode(mode);
        setMatchTarget({ digit: targetNum, word: numberWords[targetNum] });

        // Generate 3 wrong options + 1 correct
        const wrongNumbers = new Set<number>();
        let wrongAttempts = 0;
        while (wrongNumbers.size < 3 && wrongAttempts < 30) {
            const r = Math.floor(Math.random() * maxNum) + 1;
            if (r !== targetNum) wrongNumbers.add(r);
            wrongAttempts++;
        }

        if (mode === 'digit-to-word') {
            const options = [...Array.from(wrongNumbers).map(n => numberWords[n]), numberWords[targetNum]];
            setMatchOptions(options.sort(() => Math.random() - 0.5));
        } else {
            const options = [...Array.from(wrongNumbers).map(n => String(n)), String(targetNum)];
            setMatchOptions(options.sort(() => Math.random() - 0.5));
        }
        setFeedback('');
    }, [activeAgeTier]);

    useEffect(() => {
        if (activeTab === 'counting') generateCounting();
        if (activeTab === 'matching') generateMatching();
    }, [activeTab, generateCounting, generateMatching]);

    const handleTapItem = (idx: number) => {
        const newCount = tappedCount + 1;
        setTappedCount(newCount);
        speak(String(newCount));

        if (newCount === currentNumber) {
            setFeedback('PERFECT! 🎉');
            setStreak(s => s + 1);
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
            speak(`Yes! There are ${currentNumber}!`);

            if ((streak + 1) % 5 === 0 && user && firestore) {
                addDoc(collection(firestore, 'junior_stickers'), {
                    userId: user.uid, emoji: '🔢', name: 'Number Whiz',
                    category: 'math', earnedAt: serverTimestamp()
                });
                toast({ title: "Achievement!", description: "You earned a Number Whiz sticker!" });
            }
            setTimeout(generateCounting, 2000);
        }
    };

    const handleMatchAnswer = (answer: string) => {
        const correct = matchMode === 'digit-to-word'
            ? answer === matchTarget.word
            : answer === String(matchTarget.digit);

        if (correct) {
            setFeedback('CORRECT! 🎉');
            setStreak(s => s + 1);
            confetti({ particleCount: 60, spread: 50 });
            speak('Correct! Well done!');
            setTimeout(generateMatching, 1500);
        } else {
            setFeedback('Try Again! 🤔');
            setStreak(0);
            speak('Not quite. Try again!');
        }
    };

    // Number Tracing
    useEffect(() => {
        if (activeTab === 'tracing' && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, 400, 400);
                ctx.font = 'bold 300px sans-serif';
                ctx.fillStyle = '#f1f5f9';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(String(currentNumber), 200, 220);
            }
        }
    }, [currentNumber, activeTab]);

    const startTracing = (e: any) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
        ctx.beginPath(); ctx.moveTo(x, y);
        ctx.strokeStyle = '#f97316'; ctx.lineWidth = 20; ctx.lineCap = 'round';
        setIsTracing(true);
    };

    const drawTrace = (e: any) => {
        if (!isTracing) return;
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
        ctx.lineTo(x, y); ctx.stroke();
    };

    const resetCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = 'bold 300px sans-serif';
            ctx.fillStyle = '#f1f5f9';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(currentNumber), 200, 220);
        }
    };

    return (
        <div className="space-y-6">
            {/* Tab Nav */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-amber-50/50 rounded-2xl w-fit mx-auto border border-amber-100/60 shadow-inner">
                <Button variant={activeTab === 'counting' ? 'default' : 'ghost'} onClick={() => setActiveTab('counting')} className={cn("rounded-xl font-bold transition-all animate-none", activeTab === 'counting' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-700 hover:bg-amber-100/55')}>Counting</Button>
                <Button variant={activeTab === 'tracing' ? 'default' : 'ghost'} onClick={() => setActiveTab('tracing')} className={cn("rounded-xl font-bold transition-all animate-none", activeTab === 'tracing' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-700 hover:bg-amber-100/55')}>Number Tracing</Button>
                <Button variant={activeTab === 'matching' ? 'default' : 'ghost'} onClick={() => setActiveTab('matching')} className={cn("rounded-xl font-bold transition-all animate-none", activeTab === 'matching' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-700 hover:bg-amber-100/55')}>Word Match</Button>
            </div>

            {/* COUNTING TAB */}
            {activeTab === 'counting' && (
                <div className="space-y-8 animate-in fade-in">
                    <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50/30 p-8 rounded-[40px] border-4 border-amber-100 shadow-inner text-center space-y-6">
                        <h2 className="text-3xl font-black text-amber-800">How many {countingItems[0]} do you see?</h2>
                        <p className="text-amber-600 font-bold text-sm">Tap each one to count!</p>

                        <div className="flex flex-wrap gap-4 justify-center max-w-md mx-auto py-6">
                            {countingItems.map((emoji, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleTapItem(idx)}
                                    disabled={tappedCount > idx}
                                    className={cn(
                                        "text-5xl w-20 h-20 rounded-3xl border-2 border-b-[8px] flex items-center justify-center transition-all duration-200 shadow-md",
                                        tappedCount > idx
                                            ? "bg-green-100 border-green-300 scale-90 opacity-70"
                                            : "bg-white border-amber-200 hover:scale-110 hover:border-amber-400 active:translate-y-1 active:border-b-2 cursor-pointer"
                                    )}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>

                        {/* Counter Display */}
                        <div className="inline-flex items-center gap-4 bg-white px-8 py-4 rounded-full border-4 border-amber-200 shadow-lg">
                            <span className="text-sm font-black text-amber-500 uppercase tracking-widest">Count</span>
                            <span className="text-6xl font-black text-amber-600">{tappedCount}</span>
                        </div>

                        {feedback && (
                            <p className={`text-3xl font-black animate-in zoom-in ${feedback.includes("PERFECT") ? "text-green-500" : "text-red-400"}`}>
                                {feedback}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center gap-3">
                        <Button onClick={generateCounting} variant="ghost" className="text-amber-500 hover:text-amber-700 font-bold hover:bg-amber-50 rounded-full py-6 px-6">
                            Try Another <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 rounded-full shadow-lg border border-amber-400 text-white">
                            <Star className="text-yellow-300 fill-yellow-300 w-5 h-5" />
                            <span className="font-black tracking-wide text-sm">Streak: {streak}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* NUMBER TRACING TAB */}
            {activeTab === 'tracing' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="flex flex-wrap justify-center gap-2 bg-amber-50 p-2 rounded-2xl border border-amber-100 shadow-inner">
                        {Array.from({ length: activeAgeTier === 'ages2-3' ? 5 : activeAgeTier === 'ages3-4' ? 10 : activeAgeTier === 'ages4-5' ? 15 : 20 }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                onClick={() => { setCurrentNumber(n); speak(String(n)); }}
                                className={cn(
                                    "w-10 h-10 rounded-xl font-black text-sm transition-all border-2 border-b-4 active:translate-y-0.5 active:border-b-2",
                                    currentNumber === n
                                        ? "bg-gradient-to-b from-amber-400 to-orange-500 text-white border-amber-600 shadow-sm -translate-y-0.5"
                                        : "bg-white text-amber-600 border-amber-200 hover:bg-amber-50/50"
                                )}
                            >
                                {n}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                        <h3 className="text-2xl font-black text-slate-800">Trace the number <span className="text-amber-600">{currentNumber}</span></h3>
                        <p className="text-sm font-bold text-amber-600">"{numberWords[currentNumber]}"</p>

                        <div className="relative bg-amber-50 p-6 rounded-[36px] border-8 border-amber-800 shadow-2xl flex items-center justify-center">
                            <div className="absolute top-2 left-4 w-4 h-4 rounded-full bg-amber-900/40"></div>
                            <div className="absolute top-2 right-4 w-4 h-4 rounded-full bg-amber-900/40"></div>
                            <div className="bg-white rounded-2xl overflow-hidden shadow-inner border border-amber-900/10">
                                <canvas
                                    ref={canvasRef} width={400} height={400}
                                    className="touch-none cursor-crosshair"
                                    onMouseDown={startTracing}
                                    onMouseMove={drawTrace}
                                    onMouseUp={() => setIsTracing(false)}
                                    onMouseLeave={() => setIsTracing(false)}
                                    onTouchStart={startTracing}
                                    onTouchMove={drawTrace}
                                    onTouchEnd={() => setIsTracing(false)}
                                />
                            </div>
                            <Button variant="ghost" size="sm" className="absolute bottom-2 right-8 text-slate-400 hover:text-slate-600 font-black" onClick={resetCanvas}>
                                Reset
                            </Button>
                        </div>
                        <div className="flex gap-4">
                            <Button onClick={() => speak(String(currentNumber))} className="bg-amber-600 hover:bg-amber-700 rounded-full h-12 px-6 font-black shadow-md">
                                <Volume2 className="mr-2 w-4 h-4"/> Hear Number
                            </Button>
                            <Button onClick={() => speak(numberWords[currentNumber])} variant="outline" className="border-2 border-amber-200 text-amber-700 rounded-full h-12 px-6 font-black hover:bg-amber-50">
                                <Volume2 className="mr-2 w-4 h-4"/> Hear Word
                            </Button>
                        </div>
                        <p className="text-xs font-black text-amber-500 uppercase tracking-widest animate-pulse">★ Trace from top to bottom! ★</p>
                    </div>
                </div>
            )}

            {/* WORD MATCHING TAB */}
            {activeTab === 'matching' && (
                <div className="flex flex-col items-center space-y-8 animate-in zoom-in">
                    <Card className="w-full max-w-md bg-white border-4 border-b-[12px] border-amber-200 shadow-2xl rounded-[40px] overflow-hidden">
                        <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                            <p className="text-xs font-black text-amber-400 uppercase tracking-widest">
                                {matchMode === 'digit-to-word' ? 'Find the correct word!' : 'Find the correct number!'}
                            </p>
                            
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-[32px] border-4 border-amber-200 shadow-inner">
                                {matchMode === 'digit-to-word' ? (
                                    <div className="text-9xl font-black text-amber-600 select-none">{matchTarget.digit}</div>
                                ) : (
                                    <div className="text-5xl font-black text-amber-700 capitalize select-none">{matchTarget.word}</div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                {matchOptions.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleMatchAnswer(opt)}
                                        className="h-16 bg-white border-2 border-b-[8px] border-amber-200 hover:border-amber-400 hover:bg-amber-50 text-amber-700 text-xl font-black rounded-2xl transition-all active:translate-y-1 active:border-b-2 shadow-md capitalize"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>

                            {feedback && (
                                <p className={`text-2xl font-black animate-in zoom-in ${feedback.includes("CORRECT") ? "text-green-500" : "text-red-400"}`}>
                                    {feedback}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 rounded-full shadow-lg border border-amber-400 text-white animate-bounce">
                        <Star className="text-yellow-300 fill-yellow-300 w-5 h-5" />
                        <span className="font-black tracking-wide text-sm">Streak: {streak}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- 10. MUSIC & RHYTHM CORNER ---
const pianoNotes = [
    { note: 'C', freq: 261.63, color: 'white' },
    { note: 'C#', freq: 277.18, color: 'black' },
    { note: 'D', freq: 293.66, color: 'white' },
    { note: 'D#', freq: 311.13, color: 'black' },
    { note: 'E', freq: 329.63, color: 'white' },
    { note: 'F', freq: 349.23, color: 'white' },
    { note: 'F#', freq: 369.99, color: 'black' },
    { note: 'G', freq: 392.00, color: 'white' },
    { note: 'G#', freq: 415.30, color: 'black' },
    { note: 'A', freq: 440.00, color: 'white' },
    { note: 'A#', freq: 466.16, color: 'black' },
    { note: 'B', freq: 493.88, color: 'white' },
    { note: 'C5', freq: 523.25, color: 'white' },
];

const SONGS = [
    {
        name: "Mary Had a Little Lamb 🐑",
        notes: ['E', 'D', 'C', 'D', 'E', 'E', 'E', 'D', 'D', 'D', 'E', 'G', 'G'],
    },
    {
        name: "Twinkle Twinkle Little Star ⭐️",
        notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C'],
    },
    {
        name: "Row, Row, Row Your Boat 🛶",
        notes: ['C', 'C', 'C', 'D', 'E', 'E', 'D', 'E', 'F', 'G'],
    },
    {
        name: "Jingle Bells 🔔",
        notes: ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'G', 'C', 'D', 'E'],
    }
];

function MusicRhythmCorner() {
    const [activeTab, setActiveTab] = useState<'piano' | 'patterns' | 'drums'>('piano');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentPattern, setCurrentPattern] = useState<number[]>([]);
    const [playerPattern, setPlayerPattern] = useState<number[]>([]);
    const [patternStep, setPatternStep] = useState(0);
    const [patternLength, setPatternLength] = useState(3);
    const [showingPattern, setShowingPattern] = useState(false);
    const [patternFeedback, setPatternFeedback] = useState('');
    const [streak, setStreak] = useState(0);
    const [activeKey, setActiveKey] = useState<number | null>(null);
    const [activeDrum, setActiveDrum] = useState<string | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    // Drum challenge state
    const [drumMode, setDrumMode] = useState<'free' | 'challenge'>('free');
    const [drumPattern, setDrumPattern] = useState<string[]>([]);
    const [drumPlayerPattern, setDrumPlayerPattern] = useState<string[]>([]);
    const [drumShowingPattern, setDrumShowingPattern] = useState(false);
    const [drumStreak, setDrumStreak] = useState(0);
    const [drumFeedback, setDrumFeedback] = useState('');
    const [drumPatternLength, setDrumPatternLength] = useState(2);

    // Piano guided song state
    const [pianoMode, setPianoMode] = useState<'free' | 'song'>('free');
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [songNoteIndex, setSongNoteIndex] = useState(0);
    const [songFeedback, setSongFeedback] = useState('');

    const getAudioCtx = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioCtxRef.current;
    }, []);

    const playTone = useCallback((freq: number, duration = 0.3) => {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }, [getAudioCtx]);

    const handlePianoPress = useCallback((noteName: string, freq: number) => {
        playTone(freq, 0.5);

        // Flash key visual
        const whiteIdx = pianoNotes.filter(n => n.color === 'white').findIndex(n => n.note === noteName);
        if (whiteIdx !== -1) {
            setActiveKey(whiteIdx);
            setTimeout(() => setActiveKey(null), 200);
        }

        if (pianoMode === 'free') return;

        const currentSong = SONGS[currentSongIndex];
        const expectedNote = currentSong.notes[songNoteIndex];

        if (noteName === expectedNote) {
            const nextIndex = songNoteIndex + 1;
            if (nextIndex >= currentSong.notes.length) {
                setSongFeedback('🎵 SONG COMPLETED! 🌟');
                speak('Fantastic playing!');
                confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
                
                if (user && firestore) {
                    addDoc(collection(firestore, 'junior_stickers'), {
                        userId: user.uid,
                        emoji: '🎹',
                        name: 'Little Mozart',
                        category: 'art',
                        earnedAt: serverTimestamp()
                    });
                    toast({ title: "Achievement!", description: "You earned a Little Mozart sticker!" });
                }
                
                setSongNoteIndex(0);
            } else {
                setSongNoteIndex(nextIndex);
                setSongFeedback('');
            }
        } else {
            setSongFeedback('Oops! Try the highlighted key! 🌟');
        }
    }, [pianoMode, currentSongIndex, songNoteIndex, playTone, user, firestore, toast]);

    const playDrum = useCallback((type: string) => {
        const ctx = getAudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'kick') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.8, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
        } else if (type === 'snare') {
            osc.type = 'triangle';
            osc.frequency.value = 200;
            gain.gain.setValueAtTime(0.5, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.15);
            // Noise burst for snare
            const noise = ctx.createOscillator();
            const noiseGain = ctx.createGain();
            noise.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noise.type = 'square';
            noise.frequency.value = 800;
            noiseGain.gain.setValueAtTime(0.15, ctx.currentTime);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            noise.start(ctx.currentTime);
            noise.stop(ctx.currentTime + 0.1);
        } else if (type === 'hihat') {
            osc.type = 'square';
            osc.frequency.value = 1500;
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.08);
        } else if (type === 'tom') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(250, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.6, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.25);
        }

        setActiveDrum(type);
        setTimeout(() => setActiveDrum(null), 150);
    }, [getAudioCtx]);

    const generateDrumPattern = useCallback(() => {
        const drumIds = ['kick', 'snare', 'hihat', 'tom'];
        const newPattern = Array.from({ length: drumPatternLength }, () => drumIds[Math.floor(Math.random() * 4)]);
        setDrumPattern(newPattern);
        setDrumPlayerPattern([]);
        setDrumFeedback('');
        setDrumShowingPattern(true);

        newPattern.forEach((drumId, i) => {
            setTimeout(() => {
                playDrum(drumId);
                if (i === newPattern.length - 1) {
                    setTimeout(() => setDrumShowingPattern(false), 400);
                }
            }, i * 700);
        });
    }, [drumPatternLength, playDrum]);

    const handleDrumPress = useCallback((drumId: string) => {
        playDrum(drumId);

        if (drumMode === 'free') return;
        if (drumShowingPattern) return;

        const newPlayerPattern = [...drumPlayerPattern, drumId];
        setDrumPlayerPattern(newPlayerPattern);

        if (drumPattern[newPlayerPattern.length - 1] !== drumId) {
            setDrumFeedback('Oops! Try again! 🥁');
            speak('Listen to the beat and try again!');
            setDrumStreak(0);
            setTimeout(generateDrumPattern, 1500);
            return;
        }

        if (newPlayerPattern.length === drumPattern.length) {
            setDrumFeedback('FANTASTIC BEAT! 🥳');
            setDrumStreak(s => s + 1);
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 }, colors: ['#a78bfa', '#f43f5e', '#3b82f6', '#10b981'] });
            speak('Perfect rhythm!');

            if ((drumStreak + 1) % 2 === 0) {
                setDrumPatternLength(l => Math.min(l + 1, 6));
            }

            if ((drumStreak + 1) % 4 === 0 && user && firestore) {
                addDoc(collection(firestore, 'junior_stickers'), {
                    userId: user.uid,
                    emoji: '🥁',
                    name: 'Master Drummer',
                    category: 'art',
                    earnedAt: serverTimestamp()
                });
                toast({ title: "Achievement!", description: "You earned a Master Drummer sticker!" });
            }
            setTimeout(generateDrumPattern, 2000);
        }
    }, [drumMode, drumShowingPattern, drumPlayerPattern, drumPattern, drumStreak, drumPatternLength, generateDrumPattern, playDrum, user, firestore, toast]);

    // Pattern game: 4 colored buttons
    const patternColors = [
        { idx: 0, label: 'Red', bg: 'bg-red-500', active: 'bg-red-300 ring-4 ring-red-200', border: 'border-red-600', freq: 261.63 },
        { idx: 1, label: 'Blue', bg: 'bg-blue-500', active: 'bg-blue-300 ring-4 ring-blue-200', border: 'border-blue-600', freq: 329.63 },
        { idx: 2, label: 'Green', bg: 'bg-green-500', active: 'bg-green-300 ring-4 ring-green-200', border: 'border-green-600', freq: 392.00 },
        { idx: 3, label: 'Yellow', bg: 'bg-yellow-400', active: 'bg-yellow-200 ring-4 ring-yellow-200', border: 'border-yellow-500', freq: 523.25 },
    ];

    const generatePattern = useCallback(() => {
        const newPattern = Array.from({ length: patternLength }, () => Math.floor(Math.random() * 4));
        setCurrentPattern(newPattern);
        setPlayerPattern([]);
        setPatternStep(0);
        setPatternFeedback('');
        setShowingPattern(true);

        // Play the pattern visually and audibly
        newPattern.forEach((colorIdx, i) => {
            setTimeout(() => {
                setActiveKey(colorIdx);
                playTone(patternColors[colorIdx].freq, 0.4);
                setTimeout(() => setActiveKey(null), 350);
                if (i === newPattern.length - 1) {
                    setTimeout(() => setShowingPattern(false), 500);
                }
            }, i * 700);
        });
    }, [patternLength, playTone]);

    const handlePatternPress = (colorIdx: number) => {
        if (showingPattern) return;

        playTone(patternColors[colorIdx].freq, 0.3);
        setActiveKey(colorIdx);
        setTimeout(() => setActiveKey(null), 200);

        const newPlayerPattern = [...playerPattern, colorIdx];
        setPlayerPattern(newPlayerPattern);

        // Check if this step is correct
        if (currentPattern[newPlayerPattern.length - 1] !== colorIdx) {
            setPatternFeedback('Oops! Try again! 🔄');
            speak('Not quite. Watch the pattern again!');
            setStreak(0);
            setTimeout(generatePattern, 1500);
            return;
        }

        // Check if pattern is complete
        if (newPlayerPattern.length === currentPattern.length) {
            setPatternFeedback('PERFECT! 🎶');
            setStreak(s => s + 1);
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 }, colors: ['#ef4444', '#3b82f6', '#22c55e', '#eab308'] });
            speak('Amazing rhythm!');

            if ((streak + 1) % 3 === 0) {
                setPatternLength(l => Math.min(l + 1, 8));
            }

            if ((streak + 1) % 5 === 0 && user && firestore) {
                addDoc(collection(firestore, 'junior_stickers'), {
                    userId: user.uid, emoji: '🎵', name: 'Rhythm Star',
                    category: 'art', earnedAt: serverTimestamp()
                });
                toast({ title: "Achievement!", description: "You earned a Rhythm Star sticker!" });
            }
            setTimeout(generatePattern, 2000);
        }
    };

    const drums = [
        { id: 'kick', label: 'Kick', emoji: '🥁', color: 'from-red-400 to-rose-500 border-red-600' },
        { id: 'snare', label: 'Snare', emoji: '🪘', color: 'from-blue-400 to-indigo-500 border-blue-600' },
        { id: 'hihat', label: 'Hi-Hat', emoji: '🔔', color: 'from-yellow-400 to-amber-500 border-yellow-600' },
        { id: 'tom', label: 'Tom', emoji: '🎯', color: 'from-green-400 to-emerald-500 border-green-600' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2 p-1.5 bg-violet-50/50 rounded-2xl w-fit mx-auto border border-violet-100/60 shadow-inner">
                <Button variant={activeTab === 'piano' ? 'default' : 'ghost'} onClick={() => setActiveTab('piano')} className={cn("rounded-xl font-bold transition-all animate-none", activeTab === 'piano' ? 'bg-violet-500 text-white shadow-sm' : 'text-violet-700 hover:bg-violet-100/55')}>🎹 Piano</Button>
                <Button variant={activeTab === 'patterns' ? 'default' : 'ghost'} onClick={() => { setActiveTab('patterns'); setTimeout(generatePattern, 300); }} className={cn("rounded-xl font-bold transition-all animate-none", activeTab === 'patterns' ? 'bg-violet-500 text-white shadow-sm' : 'text-violet-700 hover:bg-violet-100/55')}>🎵 Patterns</Button>
                <Button variant={activeTab === 'drums' ? 'default' : 'ghost'} onClick={() => setActiveTab('drums')} className={cn("rounded-xl font-bold transition-all animate-none", activeTab === 'drums' ? 'bg-violet-500 text-white shadow-sm' : 'text-violet-700 hover:bg-violet-100/55')}>🥁 Drums</Button>
            </div>

            {/* PIANO TAB */}
            {activeTab === 'piano' && (() => {
                const nextSongNote = pianoMode === 'song' ? SONGS[currentSongIndex].notes[songNoteIndex] : null;
                return (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-violet-800">Mini Piano 🎹</h2>
                            <p className="text-violet-600 font-bold text-sm mt-1">Tap the keys to play music or practice a song!</p>
                        </div>

                        <div className="flex justify-center gap-2 max-w-md mx-auto mb-2">
                            <Button
                                variant={pianoMode === 'free' ? 'default' : 'outline'}
                                onClick={() => {
                                    setPianoMode('free');
                                    setSongFeedback('');
                                }}
                                className={cn(
                                    "flex-1 rounded-2xl font-bold py-5 border-2 transition-all",
                                    pianoMode === 'free' 
                                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md' 
                                        : 'border-violet-200 text-violet-700 hover:bg-violet-50'
                                )}
                            >
                                🎹 Free Play
                            </Button>
                            <Button
                                variant={pianoMode === 'song' ? 'default' : 'outline'}
                                onClick={() => {
                                    setPianoMode('song');
                                    setSongNoteIndex(0);
                                    setSongFeedback('');
                                }}
                                className={cn(
                                    "flex-1 rounded-2xl font-bold py-5 border-2 transition-all",
                                    pianoMode === 'song' 
                                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md' 
                                        : 'border-violet-200 text-violet-700 hover:bg-violet-50'
                                )}
                            >
                                🎼 Play a Song
                            </Button>
                        </div>

                        {pianoMode === 'song' && (
                            <div className="max-w-2xl mx-auto p-4 bg-violet-50/50 rounded-2xl border border-violet-100 flex flex-col items-center gap-4 animate-in zoom-in">
                                <div className="flex items-center gap-3 w-full">
                                    <span className="font-bold text-violet-700 text-sm whitespace-nowrap">Choose Song:</span>
                                    <Select
                                        value={currentSongIndex.toString()}
                                        onValueChange={(val) => {
                                            setCurrentSongIndex(parseInt(val));
                                            setSongNoteIndex(0);
                                            setSongFeedback('');
                                        }}
                                    >
                                        <SelectTrigger className="w-full bg-white border-violet-200 rounded-xl font-bold text-violet-800">
                                            <SelectValue placeholder="Select a song" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                            {SONGS.map((s, idx) => (
                                                <SelectItem key={idx} value={idx.toString()} className="font-bold text-violet-800">
                                                    {s.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Song notes sheet */}
                                <div className="flex flex-wrap gap-2 justify-center items-center p-3 bg-white rounded-xl border border-violet-100/80 w-full shadow-inner">
                                    {SONGS[currentSongIndex].notes.map((note, idx) => {
                                        const isCurrent = idx === songNoteIndex;
                                        const isPast = idx < songNoteIndex;
                                        return (
                                            <span
                                                key={idx}
                                                className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300",
                                                    isCurrent 
                                                        ? "bg-yellow-400 text-white ring-4 ring-yellow-200 scale-125 shadow-md animate-bounce" 
                                                        : isPast 
                                                            ? "bg-green-100 text-green-600 opacity-60" 
                                                            : "bg-slate-100 text-slate-400"
                                                )}
                                            >
                                                {note}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 pb-2 rounded-[32px] shadow-2xl border-4 border-slate-700 max-w-2xl mx-auto">
                            {/* Piano top frame */}
                            <div className="h-4 bg-gradient-to-b from-slate-700 to-slate-800 rounded-t-xl mb-2 border-b border-slate-600"></div>
                            
                            <div className="relative flex">
                                {pianoNotes.filter(n => n.color === 'white').map((note, i) => {
                                    const isNextKey = nextSongNote === note.note;
                                    return (
                                        <button
                                            key={note.note}
                                            onClick={() => handlePianoPress(note.note, note.freq)}
                                            className={cn(
                                                "flex-1 h-44 rounded-b-xl border-x border-b-4 transition-all duration-100 flex items-end justify-center pb-3 text-xs font-black relative overflow-hidden",
                                                activeKey === i
                                                    ? "bg-violet-100 border-violet-300 text-violet-600 translate-y-1 border-b-2 shadow-inner"
                                                    : "bg-gradient-to-b from-white to-slate-50 border-slate-300 text-slate-400 hover:bg-slate-50 shadow-md",
                                                isNextKey && "ring-4 ring-yellow-400 ring-inset animate-pulse bg-yellow-50/50"
                                            )}
                                        >
                                            {note.note}
                                            {isNextKey && (
                                                <div className="absolute top-4 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                                            )}
                                        </button>
                                    );
                                })}
                                {/* Black keys overlay */}
                                <div className="absolute top-0 left-0 right-0 flex pointer-events-none" style={{ paddingLeft: '5%', paddingRight: '7%' }}>
                                    {pianoNotes.filter(n => n.color === 'white').map((note, i) => {
                                        const hasSharp = pianoNotes.find(n => n.note === note.note + '#');
                                        if (!hasSharp) return <div key={`gap-${i}`} className="flex-1"></div>;
                                        const isNextSharp = nextSongNote === hasSharp.note;
                                        return (
                                            <div key={`black-${i}`} className="flex-1 flex justify-end">
                                                <button
                                                    onClick={() => handlePianoPress(hasSharp.note, hasSharp.freq)}
                                                    className={cn(
                                                        "pointer-events-auto w-8 h-28 bg-gradient-to-b from-slate-800 to-slate-900 rounded-b-lg shadow-lg border border-slate-700 hover:from-slate-700 hover:to-slate-800 active:h-[108px] active:shadow-inner transition-all z-10 translate-x-4 text-slate-400 text-[9px] font-bold flex items-end justify-center pb-2 relative overflow-hidden",
                                                        isNextSharp && "ring-4 ring-yellow-400 ring-inset border-yellow-400 shadow-md animate-pulse"
                                                    )}
                                                >
                                                    {hasSharp.note}
                                                    {isNextSharp && (
                                                        <div className="absolute top-4 left-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {songFeedback && (
                            <p className={`text-2xl font-black text-center animate-in zoom-in ${songFeedback.includes("COMPLETED") ? "text-green-500" : "text-orange-500"}`}>
                                {songFeedback}
                            </p>
                        )}

                        <p className="text-center text-xs font-black text-violet-400 uppercase tracking-widest">🎵 Make beautiful music! 🎵</p>
                    </div>
                );
            })()}

            {/* PATTERN GAME TAB */}
            {activeTab === 'patterns' && (
                <div className="flex flex-col items-center space-y-8 animate-in zoom-in">
                    <div className="text-center">
                        <h2 className="text-3xl font-black text-violet-800">Rhythm Patterns 🎵</h2>
                        <p className="text-violet-600 font-bold text-sm mt-1">
                            {showingPattern ? "Watch and listen to the pattern..." : "Now repeat the pattern!"}
                        </p>
                        <div className="flex justify-center gap-1.5 mt-3">
                            {currentPattern.map((_, i) => (
                                <div key={i} className={cn(
                                    "h-2.5 w-8 rounded-full transition-all duration-300",
                                    i < playerPattern.length ? 'bg-green-400' : i === playerPattern.length && !showingPattern ? 'bg-violet-500 w-12' : 'bg-slate-200'
                                )} />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 max-w-sm">
                        {patternColors.map(pc => (
                            <button
                                key={pc.idx}
                                onClick={() => handlePatternPress(pc.idx)}
                                disabled={showingPattern}
                                className={cn(
                                    "w-32 h-32 rounded-3xl border-4 border-b-[10px] transition-all duration-150 shadow-xl font-black text-white text-lg active:translate-y-1 active:border-b-4",
                                    activeKey === pc.idx ? pc.active : pc.bg,
                                    pc.border,
                                    showingPattern && "opacity-80 cursor-not-allowed"
                                )}
                            >
                                {pc.label}
                            </button>
                        ))}
                    </div>

                    {patternFeedback && (
                        <p className={`text-2xl font-black animate-in zoom-in ${patternFeedback.includes("PERFECT") ? "text-green-500" : "text-orange-500"}`}>
                            {patternFeedback}
                        </p>
                    )}

                    <div className="flex items-center gap-4">
                        <Button onClick={generatePattern} variant="outline" className="border-2 border-violet-200 text-violet-700 font-black rounded-full px-6 hover:bg-violet-50">
                            New Pattern
                        </Button>
                        <div className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-2.5 rounded-full shadow-lg text-white">
                            <Star className="text-yellow-300 fill-yellow-300 w-5 h-5" />
                            <span className="font-black text-sm">Level {patternLength - 2} • Streak: {streak}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* DRUMS TAB */}
            {activeTab === 'drums' && (
                <div className="space-y-8 animate-in fade-in">
                    <div className="text-center">
                        <h2 className="text-3xl font-black text-violet-800">Drum Playground 🥁</h2>
                        <p className="text-violet-600 font-bold text-sm mt-1">Tap the drums or take the rhythm challenge!</p>
                    </div>

                    <div className="flex justify-center gap-2 max-w-md mx-auto mb-2">
                        <Button
                            variant={drumMode === 'free' ? 'default' : 'outline'}
                            onClick={() => {
                                setDrumMode('free');
                                setDrumFeedback('');
                                setDrumStreak(0);
                            }}
                            className={cn(
                                "flex-1 rounded-2xl font-bold py-5 border-2 transition-all",
                                drumMode === 'free' 
                                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md' 
                                    : 'border-violet-200 text-violet-700 hover:bg-violet-50'
                            )}
                        >
                            🥁 Free Play
                        </Button>
                        <Button
                            variant={drumMode === 'challenge' ? 'default' : 'outline'}
                            onClick={() => {
                                setDrumMode('challenge');
                                setDrumStreak(0);
                                setDrumPatternLength(2);
                                setTimeout(generateDrumPattern, 200);
                            }}
                            className={cn(
                                "flex-1 rounded-2xl font-bold py-5 border-2 transition-all",
                                drumMode === 'challenge' 
                                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md' 
                                    : 'border-violet-200 text-violet-700 hover:bg-violet-50'
                            )}
                        >
                            🏆 Beat Challenge
                        </Button>
                    </div>

                    {drumMode === 'challenge' && (
                        <div className="text-center">
                            <p className="text-violet-600 font-bold text-sm mt-1">
                                {drumShowingPattern ? "👂 Listen carefully to the beat..." : "👉 Your turn! Tap the drums in order!"}
                            </p>
                            <div className="flex justify-center gap-1.5 mt-3">
                                {drumPattern.map((_, i) => (
                                    <div key={i} className={cn(
                                        "h-2.5 w-8 rounded-full transition-all duration-300",
                                        i < drumPlayerPattern.length ? 'bg-green-400' : i === drumPlayerPattern.length && !drumShowingPattern ? 'bg-violet-500 w-12' : 'bg-slate-200'
                                    )} />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                        {drums.map(drum => (
                            <button
                                key={drum.id}
                                onClick={() => handleDrumPress(drum.id)}
                                disabled={drumShowingPattern}
                                className={cn(
                                    "relative h-36 rounded-[32px] bg-gradient-to-b border-4 border-b-[12px] flex flex-col items-center justify-center gap-2 transition-all duration-100 shadow-2xl text-white font-black",
                                    drum.color,
                                    activeDrum === drum.id
                                        ? "translate-y-2 border-b-4 shadow-inner brightness-110 scale-95"
                                        : "hover:scale-105 hover:-translate-y-1 active:translate-y-2 active:border-b-4",
                                    drumShowingPattern && "opacity-80 cursor-not-allowed"
                                )}
                            >
                                <span className="text-5xl select-none">{drum.emoji}</span>
                                <span className="text-sm uppercase tracking-wider">{drum.label}</span>
                                {activeDrum === drum.id && (
                                    <div className="absolute inset-0 rounded-[28px] bg-white/30 animate-ping pointer-events-none"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {drumFeedback && (
                        <p className={`text-2xl font-black text-center animate-in zoom-in ${drumFeedback.includes("FANTASTIC") ? "text-green-500" : "text-orange-500"}`}>
                            {drumFeedback}
                        </p>
                    )}

                    {drumMode === 'challenge' ? (
                        <div className="flex items-center justify-center gap-4">
                            <Button onClick={generateDrumPattern} disabled={drumShowingPattern} variant="outline" className="border-2 border-violet-200 text-violet-700 font-black rounded-full px-6 hover:bg-violet-50">
                                Replay Beat
                            </Button>
                            <div className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-2.5 rounded-full shadow-lg text-white">
                                <Star className="text-yellow-300 fill-yellow-300 w-5 h-5" />
                                <span className="font-black text-sm">Level {drumPatternLength - 1} • Streak: {drumStreak}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-xs font-black text-violet-400 uppercase tracking-widest animate-pulse">
                            ★ Create your own beat! ★
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

// --- 11. TEACHER PROGRESS DASHBOARD ---
function TeacherDashboard() {
    const firestore = useFirestore();
    const [classStats, setClassStats] = useState<{
        totalStickers: number;
        mathStickers: number;
        literacyStickers: number;
        scienceStickers: number;
        artStickers: number;
        topStudents: { uid: string; count: number }[];
        recentActivity: any[];
    }>({
        totalStickers: 0, mathStickers: 0, literacyStickers: 0,
        scienceStickers: 0, artStickers: 0, topStudents: [], recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'all' | 'week' | 'month'>('all');

    useEffect(() => {
        const fetchStats = async () => {
            if (!firestore) return;
            setLoading(true);
            try {
                const stickersSnap = await getDocs(query(collection(firestore, 'junior_stickers'), orderBy('earnedAt', 'desc')));
                const allStickers = stickersSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

                // Filter by time range
                const now = new Date();
                const filtered = timeRange === 'all' ? allStickers : allStickers.filter(s => {
                    if (!s.earnedAt?.toDate) return false;
                    const earned = s.earnedAt.toDate();
                    if (timeRange === 'week') return (now.getTime() - earned.getTime()) < 7 * 24 * 60 * 60 * 1000;
                    if (timeRange === 'month') return (now.getTime() - earned.getTime()) < 30 * 24 * 60 * 60 * 1000;
                    return true;
                });

                const math = filtered.filter(s => s.category === 'math').length;
                const literacy = filtered.filter(s => s.category === 'literacy' || s.name?.includes('ABC') || s.name?.includes('Word')).length;
                const science = filtered.filter(s => s.category === 'science').length;
                const art = filtered.filter(s => s.category === 'art').length;

                // Top students by sticker count
                const studentMap = new Map<string, number>();
                filtered.forEach(s => {
                    if (s.userId) studentMap.set(s.userId, (studentMap.get(s.userId) || 0) + 1);
                });
                const topStudents = Array.from(studentMap.entries())
                    .map(([uid, count]) => ({ uid, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

                setClassStats({
                    totalStickers: filtered.length,
                    mathStickers: math,
                    literacyStickers: literacy,
                    scienceStickers: science,
                    artStickers: art,
                    topStudents,
                    recentActivity: filtered.slice(0, 10)
                });
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [firestore, timeRange]);

    const maxSubject = Math.max(classStats.mathStickers, classStats.literacyStickers, classStats.scienceStickers, classStats.artStickers, 1);

    const subjects = [
        { label: 'Math', count: classStats.mathStickers, color: 'bg-orange-500', lightColor: 'bg-orange-100', icon: <Calculator className="w-4 h-4 text-orange-600" />, iconBg: 'bg-orange-50 border-orange-200' },
        { label: 'Literacy', count: classStats.literacyStickers, color: 'bg-purple-500', lightColor: 'bg-purple-100', icon: <BookOpen className="w-4 h-4 text-purple-600" />, iconBg: 'bg-purple-50 border-purple-200' },
        { label: 'Science', count: classStats.scienceStickers, color: 'bg-blue-500', lightColor: 'bg-blue-100', icon: <Atom className="w-4 h-4 text-blue-600" />, iconBg: 'bg-blue-50 border-blue-200' },
        { label: 'Art & Music', count: classStats.artStickers, color: 'bg-pink-500', lightColor: 'bg-pink-100', icon: <Palette className="w-4 h-4 text-pink-600" />, iconBg: 'bg-pink-50 border-pink-200' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                <span className="ml-3 font-bold text-slate-500">Loading class data...</span>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in">
            {/* HEADER BANNER */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden border-b-8 border-indigo-700/25">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-3xl font-black mb-1 tracking-tight flex items-center gap-2">
                            <BarChart3 className="w-8 h-8" /> Class Progress Dashboard
                        </h3>
                        <p className="font-extrabold opacity-90 text-lg">Overview of all student achievements</p>
                    </div>

                    <div className="flex gap-2 p-1 bg-white/20 rounded-xl backdrop-blur-sm border border-white/10">
                        {(['all', 'month', 'week'] as const).map(range => (
                            <Button
                                key={range}
                                size="sm"
                                variant={timeRange === range ? 'secondary' : 'ghost'}
                                onClick={() => setTimeRange(range)}
                                className={cn(
                                    "rounded-lg font-black capitalize text-xs transition-all",
                                    timeRange === range ? "bg-white text-indigo-700 shadow-sm" : "text-white/90 hover:bg-white/10"
                                )}
                            >
                                {range === 'all' ? 'All Time' : range === 'month' ? 'This Month' : 'This Week'}
                            </Button>
                        ))}
                    </div>
                </div>
                <Activity className="absolute -bottom-4 -right-4 w-40 h-40 opacity-10 rotate-12" />
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="border-2 border-b-[8px] border-indigo-200 rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-5 text-center">
                        <div className="bg-indigo-50 p-2.5 rounded-xl w-fit mx-auto mb-2 border border-indigo-200">
                            <Trophy className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="text-3xl font-black text-slate-800">{classStats.totalStickers}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Stickers</div>
                    </CardContent>
                </Card>
                {subjects.map(s => (
                    <Card key={s.label} className="border-2 border-b-[8px] border-slate-100 rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <CardContent className="p-5 text-center">
                            <div className={cn("p-2.5 rounded-xl w-fit mx-auto mb-2 border", s.iconBg)}>
                                {s.icon}
                            </div>
                            <div className="text-3xl font-black text-slate-800">{s.count}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* BAR CHART + LEADERBOARD */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Subject Distribution */}
                <Card className="border-2 border-slate-100 rounded-3xl shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="font-black text-slate-800 text-lg flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-indigo-500" /> Subject Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-6">
                        {subjects.map(s => (
                            <div key={s.label} className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("p-1 rounded-lg border", s.iconBg)}>{s.icon}</div>
                                        <span className="font-black text-sm text-slate-700">{s.label}</span>
                                    </div>
                                    <span className="font-black text-sm text-slate-500">{s.count}</span>
                                </div>
                                <div className="h-5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50 shadow-inner">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000 ease-out", s.color)}
                                        style={{ width: `${Math.max((s.count / maxSubject) * 100, 4)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Top Students Leaderboard */}
                <Card className="border-2 border-slate-100 rounded-3xl shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="font-black text-slate-800 text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-500" /> Top Students
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-6">
                        {classStats.topStudents.length === 0 ? (
                            <p className="text-center text-slate-400 font-bold py-8">No student data yet.</p>
                        ) : (
                            classStats.topStudents.map((student, idx) => {
                                const medals = ['🥇', '🥈', '🥉', '🏅', '⭐'];
                                return (
                                    <div key={student.uid} className="flex items-center gap-3 p-3 bg-slate-50/70 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                                        <span className="text-2xl select-none">{medals[idx] || '⭐'}</span>
                                        <div className="flex-1">
                                            <p className="font-black text-sm text-slate-700 truncate">Student {idx + 1}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.uid.slice(0, 8)}...</p>
                                        </div>
                                        <div className="bg-indigo-100 px-3 py-1 rounded-full">
                                            <span className="font-black text-sm text-indigo-700">{student.count} 🌟</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* RECENT ACTIVITY FEED */}
            <Card className="border-2 border-slate-100 rounded-3xl shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="font-black text-slate-800 text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" /> Recent Achievements
                    </CardTitle>
                    <CardDescription className="font-bold text-slate-400">Latest stickers earned across the class</CardDescription>
                </CardHeader>
                <CardContent>
                    {classStats.recentActivity.length === 0 ? (
                        <p className="text-center text-slate-400 font-bold py-8">No recent activity.</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {classStats.recentActivity.map((sticker: any, idx: number) => (
                                <div key={sticker.id || idx} className="flex items-center gap-2.5 p-3 bg-slate-50/70 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                                    <span className="text-2xl">{sticker.emoji}</span>
                                    <div className="overflow-hidden">
                                        <p className="font-black text-xs text-slate-700 truncate">{sticker.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{sticker.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ENGAGEMENT INSIGHTS */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50/30 p-6 rounded-[32px] border-2 border-indigo-100 shadow-inner">
                <h4 className="font-black text-indigo-800 flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-indigo-500" /> Engagement Insights
                </h4>
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-indigo-100/50 shadow-sm">
                        <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Most Popular</p>
                        <p className="font-black text-lg text-slate-800">
                            {subjects.sort((a, b) => b.count - a.count)[0]?.label || 'N/A'}
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-1">Highest sticker count</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-indigo-100/50 shadow-sm">
                        <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Needs Attention</p>
                        <p className="font-black text-lg text-slate-800">
                            {[...subjects].sort((a, b) => a.count - b.count)[0]?.label || 'N/A'}
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-1">Lowest engagement</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-indigo-100/50 shadow-sm">
                        <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1">Active Learners</p>
                        <p className="font-black text-lg text-slate-800">
                            {classStats.topStudents.length}
                        </p>
                        <p className="text-xs font-bold text-slate-400 mt-1">Students with stickers</p>
                    </div>
                </div>
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

// --- AGES 2-3: ANIMAL SOUNDS & GUESS THE SOUND ---
function ToddlerAnimalSoundsQuiz() {
  const [selectedAnimal, setSelectedAnimal] = useState<any>(ANIMAL_SOUNDS[0]);
  const [quizScore, setQuizScore] = useState(0);

  const handleAnimalClick = (item: any) => {
    setSelectedAnimal(item);
    speak(`${item.animal} says ${item.sound}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center bg-amber-50 p-6 rounded-3xl border-2 border-amber-200">
        <span className="text-8xl block mb-3 hover:scale-110 transition-transform cursor-pointer" onClick={() => speak(`${selectedAnimal.animal} says ${selectedAnimal.sound}`)}>
          {selectedAnimal.emoji}
        </span>
        <h3 className="text-3xl font-black text-amber-900">{selectedAnimal.animal}</h3>
        <p className="text-xl font-bold text-amber-700 mt-1">{selectedAnimal.sound}</p>
        <Button onClick={() => speak(`${selectedAnimal.animal} says ${selectedAnimal.sound}`)} className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl">
          <Volume2 className="w-5 h-5 mr-2" /> Hear Sound
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ANIMAL_SOUNDS.map((item) => (
          <div
            key={item.id}
            onClick={() => handleAnimalClick(item)}
            className={cn(
              "p-4 rounded-2xl text-center cursor-pointer border-2 transition-all hover:scale-105",
              selectedAnimal.id === item.id ? "bg-amber-100 border-amber-400 font-black shadow-md" : "bg-white border-amber-100 hover:bg-amber-50"
            )}
          >
            <span className="text-4xl block">{item.emoji}</span>
            <span className="text-xs font-black text-slate-700 mt-1 block">{item.animal}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- AGES 3-4: LETTER DISTINCTION & PATTERNS ---
function LetterDistinctionGame() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [feedback, setFeedback] = useState("");
  const item = LETTER_DISTINCTION[currentIdx];

  const handleSelect = (choice: string) => {
    if (choice === item.target) {
      setFeedback("CORRECT! Wonderful job! 🎉");
      speak(`Awesome! That is letter ${choice}`);
      confetti({ particleCount: 50, spread: 60 });
      setTimeout(() => {
        setFeedback("");
        setCurrentIdx((prev) => (prev + 1) % LETTER_DISTINCTION.length);
      }, 2000);
    } else {
      setFeedback(`Try again! Find letter ${item.target}`);
      speak(`Try again! Look for ${item.target}`);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="bg-pink-50 p-6 rounded-3xl border-2 border-pink-200">
        <h3 className="text-2xl font-black text-pink-900">{item.prompt}</h3>
        <p className="text-xs text-pink-600 font-bold mt-1">Tap the correct letter below</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {item.options.map((opt, i) => (
          <Button
            key={i}
            onClick={() => handleSelect(opt)}
            className="h-24 text-5xl font-black rounded-3xl bg-white hover:bg-pink-100 text-pink-700 border-4 border-pink-200 shadow-lg hover:scale-105 transition-all"
          >
            {opt}
          </Button>
        ))}
      </div>

      {feedback && <p className="text-lg font-black text-pink-600 animate-pulse">{feedback}</p>}
    </div>
  );
}

function PatternCompletionGame() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [feedback, setFeedback] = useState("");
  const item = PATTERN_DRILLS[currentIdx];

  const handleSelect = (choice: string) => {
    if (choice === item.answer) {
      setFeedback("CORRECT! You solved the pattern! 🌟");
      speak("Great job! Pattern complete!");
      confetti({ particleCount: 60, spread: 70 });
      setTimeout(() => {
        setFeedback("");
        setCurrentIdx((prev) => (prev + 1) % PATTERN_DRILLS.length);
      }, 2000);
    } else {
      setFeedback("Not quite! Look at the pattern sequence again.");
      speak("Try again!");
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="bg-rose-50 p-6 rounded-3xl border-2 border-rose-200">
        <h3 className="text-xl font-black text-rose-900 mb-4">Complete the Pattern</h3>
        <div className="flex justify-center items-center gap-3 text-4xl bg-white p-4 rounded-2xl border border-rose-200 shadow-inner">
          {item.sequence.map((seq, i) => (
            <span key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-200">{seq}</span>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 flex-wrap">
        {item.options.map((opt, i) => (
          <Button
            key={i}
            onClick={() => handleSelect(opt)}
            className="h-16 w-16 text-3xl font-black rounded-2xl bg-white hover:bg-rose-100 border-2 border-rose-200 shadow-md"
          >
            {opt}
          </Button>
        ))}
      </div>

      {feedback && <p className="text-base font-black text-rose-600 animate-pulse">{feedback}</p>}
    </div>
  );
}

// --- AGES 4-5: CVC BLENDING & RHYMING ---
function CVCBlendingDrill() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const wordObj = CVC_WORDS[currentIdx];

  const playBlend = () => {
    speak(`${wordObj.C} ... ${wordObj.V} ... ${wordObj.C2} ... ${wordObj.word}`, 0.7);
  };

  return (
    <div className="space-y-6 text-center">
      <div className="bg-teal-50 p-6 rounded-3xl border-2 border-teal-200">
        <span className="text-8xl block mb-2 cursor-pointer hover:scale-110 transition-transform" onClick={() => speak(wordObj.word)}>
          {wordObj.emoji}
        </span>
        <h3 className="text-4xl font-black text-teal-900 uppercase tracking-widest">{wordObj.word}</h3>
        <p className="text-sm font-bold text-teal-700 mt-2">"{wordObj.sentence}"</p>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={playBlend} className="bg-teal-600 hover:bg-teal-700 text-white font-black rounded-2xl text-sm py-3 px-6 shadow-md">
          <Volume2 className="w-5 h-5 mr-2" /> Speed-Blend Sounds
        </Button>
        <Button onClick={() => setCurrentIdx((prev) => (prev + 1) % CVC_WORDS.length)} variant="outline" className="border-teal-300 text-teal-700 hover:bg-teal-50 font-black rounded-2xl text-sm">
          Next Word <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function RhymeMatchingGame() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [feedback, setFeedback] = useState("");
  const item = RHYME_MATCHES[currentIdx];

  const options = useMemo(() => {
    return [...item.rhymesWith.slice(0, 1), item.distractor].sort(() => Math.random() - 0.5);
  }, [item]);

  const handleSelect = (choice: string) => {
    if (item.rhymesWith.includes(choice)) {
      setFeedback(`CORRECT! "${item.word}" rhymes with "${choice}"! 🎉`);
      speak(`Great! ${item.word} rhymes with ${choice}`);
      confetti({ particleCount: 50 });
      setTimeout(() => {
        setFeedback("");
        setCurrentIdx((prev) => (prev + 1) % RHYME_MATCHES.length);
      }, 2000);
    } else {
      setFeedback(`Try again! "${choice}" does not rhyme with "${item.word}".`);
      speak(`Try again! Find what rhymes with ${item.word}`);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-200">
        <span className="text-7xl block mb-2">{item.emoji}</span>
        <h3 className="text-2xl font-black text-emerald-900">Which word rhymes with "{item.word}"?</h3>
      </div>

      <div className="flex justify-center gap-4">
        {options.map((opt, i) => (
          <Button
            key={i}
            onClick={() => handleSelect(opt)}
            className="h-16 px-8 text-2xl font-black rounded-2xl bg-white hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-300 shadow-md"
          >
            {opt}
          </Button>
        ))}
      </div>

      {feedback && <p className="text-base font-black text-emerald-600 animate-pulse">{feedback}</p>}
    </div>
  );
}

// --- AGES 5+: SENTENCE PACING & STORY SEQUENCING ---
function SentencePacingGame() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const item = SENTENCE_PACING_READS[currentIdx];

  const readSentence = () => {
    speak(item.sentence, 0.85);
  };

  return (
    <div className="space-y-6 text-center">
      <div className="bg-indigo-50 p-6 rounded-3xl border-2 border-indigo-200">
        <span className="text-xs font-black uppercase text-indigo-600 tracking-wider block mb-1">Advanced Reading Fluency & Syllabification</span>
        <h3 className="text-2xl font-black text-indigo-950 mb-3">{item.title}</h3>
        <p className="text-2xl font-bold text-slate-800 leading-relaxed bg-white p-6 rounded-2xl border border-indigo-100 shadow-inner">
          "{item.sentence}"
        </p>

        {/* Vocabulary Focus */}
        <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-xs font-black text-indigo-600 uppercase">Key Vocabulary:</span>
          {item.vocabFocus?.map((v, idx) => (
            <span key={idx} onClick={() => speak(v)} className="px-3 py-1 bg-white text-indigo-800 font-extrabold text-xs rounded-xl border border-indigo-200 shadow-sm cursor-pointer hover:bg-indigo-100">
              🔍 {v}
            </span>
          ))}
        </div>

        {/* Syllables breakdown */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {item.syllablesBreakdown.map((syl, i) => (
            <span key={i} onClick={() => speak(syl.replace(/-/g, ''))} className="px-3 py-1 bg-indigo-100 text-indigo-800 font-black text-sm rounded-xl border border-indigo-200 cursor-pointer hover:scale-105 transition-transform">
              {syl}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={readSentence} className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl px-6">
          <Volume2 className="w-5 h-5 mr-2" /> Read Aloud with Pacing
        </Button>
        <Button onClick={() => setCurrentIdx((prev) => (prev + 1) % SENTENCE_PACING_READS.length)} variant="outline" className="border-indigo-300 text-indigo-700 font-black rounded-2xl">
          Next Advanced Story <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

// --- ALGORITHMIC SENTENCE GENERATOR (YEAR 5+) ---
function generateAlgorithmicSentence(index: number): IncompleteSentenceItem {
  const templates = [
    // 1. Science & Nature
    {
      prompt: "The elephant is the largest land animal, known for its long ______.",
      answer: "trunk",
      options: ["trunk", "tail", "ears", "horns"],
      category: "Science & Nature",
      explanation: "Elephants use their long trunk for breathing, smelling, and grabbing things."
    },
    {
      prompt: "Plants use their ______ to absorb water and nutrients from the soil.",
      answer: "roots",
      options: ["roots", "leaves", "flowers", "stems"],
      category: "Science & Nature",
      explanation: "Roots grow underground to anchor the plant and drink water."
    },
    {
      prompt: "______ is the process of water falling from clouds as rain or snow.",
      answer: "Precipitation",
      options: ["Precipitation", "Evaporation", "Condensation", "Freezing"],
      category: "Science & Nature",
      explanation: "Precipitation is the scientific term for rain, snow, sleet, or hail."
    },
    {
      prompt: "Birds are unique animals because their bodies are covered in ______.",
      answer: "feathers",
      options: ["feathers", "fur", "scales", "hair"],
      category: "Science & Nature",
      explanation: "Feathers keep birds warm and help them fly."
    },
    {
      prompt: "The ______ rises in the east and sets in the west every day.",
      answer: "Sun",
      options: ["Sun", "Moon", "Earth", "Mars"],
      category: "Science & Nature",
      explanation: "The Sun is our star that provides light and warmth during the day."
    },

    // 2. Grammar & Words
    {
      prompt: "Words like 'run', 'play', and 'dance' are called ______.",
      answer: "verbs",
      options: ["verbs", "nouns", "pronouns", "adjectives"],
      category: "Grammar & Words",
      explanation: "Verbs are action words that tell us what someone or something is doing."
    },
    {
      prompt: "The opposite of the word 'bright' is ______.",
      answer: "dark",
      options: ["dark", "shiny", "glowing", "sunny"],
      category: "Grammar & Words",
      explanation: "Dark is the antonym (opposite) of bright."
    },
    {
      prompt: "We use the pronoun '______' to refer to a group of people.",
      answer: "they",
      options: ["they", "he", "she", "it"],
      category: "Grammar & Words",
      explanation: "'They' is a plural pronoun used for multiple people."
    },
    {
      prompt: "A ______ is a punctuation mark used at the end of a question.",
      answer: "question mark",
      options: ["question mark", "period", "comma", "exclamation point"],
      category: "Grammar & Words",
      explanation: "A question mark asks something, while a period ends a statement."
    },
    {
      prompt: "The word 'beautiful' is an ______ because it describes a noun.",
      answer: "adjective",
      options: ["adjective", "noun", "verb", "adverb"],
      category: "Grammar & Words",
      explanation: "Adjectives describe or modify nouns, like a beautiful flower."
    },

    // 3. Space & Tech
    {
      prompt: "Astronauts travel to space inside a ______.",
      answer: "rocket",
      options: ["rocket", "airplane", "submarine", "helicopter"],
      category: "Space & Tech",
      explanation: "Rockets have powerful engines capable of escaping Earth's gravity."
    },
    {
      prompt: "We use a computer ______ to type words onto the screen.",
      answer: "keyboard",
      options: ["keyboard", "mouse", "printer", "monitor"],
      category: "Space & Tech",
      explanation: "The keyboard contains keys for letters, numbers, and symbols."
    },
    {
      prompt: "The ______ is a natural satellite that orbits around Earth.",
      answer: "Moon",
      options: ["Moon", "Sun", "asteroid", "comet"],
      category: "Space & Tech",
      explanation: "The Moon orbits the Earth and reflects light from the Sun."
    },
    {
      prompt: "______ is the red planet that is fourth from the Sun.",
      answer: "Mars",
      options: ["Mars", "Venus", "Jupiter", "Saturn"],
      category: "Space & Tech",
      explanation: "Mars is often called the Red Planet due to iron oxide on its surface."
    },

    // 4. Math & Logic
    {
      prompt: "A flat shape with three straight sides and three corners is a ______.",
      answer: "triangle",
      options: ["triangle", "square", "circle", "rectangle"],
      category: "Math & Logic",
      explanation: "Triangles always have exactly three sides."
    },
    {
      prompt: "An analog clock has hands that point to ______ to tell time.",
      answer: "numbers",
      options: ["numbers", "letters", "colors", "shapes"],
      category: "Math & Logic",
      explanation: "The clock face is numbered 1 through 12 to show hours and minutes."
    },
    {
      prompt: "If you have 10 apples and eat 3, you are doing ______.",
      answer: "subtraction",
      options: ["subtraction", "addition", "multiplication", "division"],
      category: "Math & Logic",
      explanation: "Subtraction is taking away a part from a total."
    },
    {
      prompt: "A standard calendar year has ______ months.",
      answer: "twelve",
      options: ["twelve", "ten", "fourteen", "seven"],
      category: "Math & Logic",
      explanation: "A year starts in January and ends in December, total 12 months."
    },

    // 5. Logic & Life
    {
      prompt: "We wear a heavy coat, scarf, and gloves during the ______ season.",
      answer: "winter",
      options: ["winter", "summer", "spring", "autumn"],
      category: "Logic & Life",
      explanation: "Winter is the coldest season of the year."
    },
    {
      prompt: "Doctors and nurses work in a ______ to take care of sick people.",
      answer: "hospital",
      options: ["hospital", "school", "library", "bakery"],
      category: "Logic & Life",
      explanation: "Hospitals provide medical care and treatment."
    },
    {
      prompt: "Before eating dinner, we should always wash our ______ with soap.",
      answer: "hands",
      options: ["hands", "hair", "feet", "shoes"],
      category: "Logic & Life",
      explanation: "Washing hands removes germs and prevents getting sick."
    },
    {
      prompt: "We visit a ______ when we want to borrow and read books.",
      answer: "library",
      options: ["library", "market", "cinema", "park"],
      category: "Logic & Life",
      explanation: "Libraries have bookshelves filled with books you can borrow."
    }
  ];

  const item = templates[index % templates.length];
  const names = ["Ama", "Kofi", "Yaa", "Kwame", "Abena"];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const customPrompt = item.prompt.replace(/Kofi/g, randomName);

  return {
    id: `algo-sentence-${index}-${Math.floor(Math.random() * 1000)}`,
    prompt: customPrompt,
    answer: item.answer,
    options: [...item.options].sort(() => Math.random() - 0.5),
    category: item.category,
    explanation: item.explanation,
    isTeacherAdded: false
  };
}

function SentenceFinisherGame({ canEdit = false, isDedicatedTab = false }: { canEdit?: boolean; isDedicatedTab?: boolean }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();

  // Firestore query for teacher added sentence challenges
  const sentencesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'junior_incomplete_sentences'), orderBy('createdAt', 'desc')) : null, [firestore, schoolId]);
  const { data: dbSentences } = useCollection<any>(sentencesQuery);

  // Combine built-in dataset with teacher-created and algorithmic sentences
  const allSentences = useMemo(() => {
    const custom: IncompleteSentenceItem[] = (dbSentences || []).map((s: any) => ({
      id: s.id,
      prompt: s.prompt,
      answer: s.answer,
      options: s.options || [s.answer, s.option2, s.option3, s.option4].filter(Boolean),
      category: s.category || 'Teacher Created 👩‍🏫',
      explanation: s.explanation || `Created by ${s.createdBy || 'Class Teacher'}`,
      createdBy: s.createdBy,
      isTeacherAdded: true
    }));

    // Generate 50 unique algorithmic sentences!
    const algorithmic: IncompleteSentenceItem[] = [];
    for (let i = 0; i < 50; i++) {
      algorithmic.push(generateAlgorithmicSentence(i));
    }

    // Shuffle the combined built-in and algorithmic pool, then prepend custom questions
    const pool = [...INCOMPLETE_SENTENCES, ...algorithmic].sort(() => Math.random() - 0.5);
    return [...custom, ...pool];
  }, [dbSentences]);

  const categories = ['All', 'Science & Nature', 'Grammar & Words', 'Space & Tech', 'Math & Logic', 'Logic & Life', 'Teacher Added 👩‍🏫'];
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredSentences = useMemo(() => {
    if (activeCategory === 'All') return allSentences;
    if (activeCategory === 'Teacher Added 👩‍🏫') return allSentences.filter(s => s.isTeacherAdded);
    return allSentences.filter(s => s.category === activeCategory);
  }, [allSentences, activeCategory]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [masteredCount, setMasteredCount] = useState(0);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback("");
    setShowExplanation(false);
  }, [activeCategory]);

  const item = filteredSentences[currentIdx] || filteredSentences[0];

  const handleSelect = (choice: string) => {
    if (!item) return;
    setSelectedOption(choice);

    if (choice === item.answer) {
      setIsCorrect(true);
      setFeedback("EXCELLENT! Perfect grammar & context match! 🌟");
      setShowExplanation(true);
      setStreak(prev => prev + 1);
      setScore(prev => prev + 10);
      setMasteredCount(prev => prev + 1);

      const filledSentence = item.prompt.replace(/______/g, item.answer);
      speak(`Superb! ${item.answer}. ${filledSentence}`);
      confetti({ particleCount: 80, spread: 70 });
    } else {
      setIsCorrect(false);
      setFeedback("Not quite! Think about which word completes the sentence context.");
      speak("Not quite. Read the sentence again carefully!");
      setStreak(0);
    }
  };

  const nextChallenge = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback("");
    setShowExplanation(false);
    if (filteredSentences.length > 0) {
      setCurrentIdx((prev) => (prev + 1) % filteredSentences.length);
    }
  };

  const prevChallenge = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedback("");
    setShowExplanation(false);
    if (filteredSentences.length > 0) {
      setCurrentIdx((prev) => (prev - 1 + filteredSentences.length) % filteredSentences.length);
    }
  };

  const speakPrompt = () => {
    if (!item) return;
    const filledText = item.prompt.replace(/______/g, selectedOption || 'blank');
    speak(filledText);
  };

  // --- TEACHER MODAL & AI GENERATOR STATE ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form fields
  const [formPrompt, setFormPrompt] = useState("");
  const [formAnswer, setFormAnswer] = useState("");
  const [formOpt2, setFormOpt2] = useState("");
  const [formOpt3, setFormOpt3] = useState("");
  const [formOpt4, setFormOpt4] = useState("");
  const [formCategory, setFormCategory] = useState("Science & Nature");
  const [formExplanation, setFormExplanation] = useState("");

  // AI Generator state inside modal
  const [aiTopic, setAiTopic] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const resetForm = () => {
    setFormPrompt("");
    setFormAnswer("");
    setFormOpt2("");
    setFormOpt3("");
    setFormOpt4("");
    setFormCategory("Science & Nature");
    setFormExplanation("");
    setAiTopic("");
  };

  const handleSaveSentence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !schoolId) {
      toast({ title: "Error", description: "Database connection unavailable.", variant: "destructive" });
      return;
    }
    if (!formPrompt.includes('______')) {
      toast({ title: "Missing Blank", description: "Please include '______' (6 underscores) in your sentence prompt.", variant: "destructive" });
      return;
    }
    if (!formAnswer || !formOpt2 || !formOpt3 || !formOpt4) {
      toast({ title: "Missing Options", description: "Please provide the correct answer and 3 distractor choices.", variant: "destructive" });
      return;
    }

    try {
      setIsSaving(true);
      const optionsArray = [formAnswer, formOpt2, formOpt3, formOpt4].sort(() => Math.random() - 0.5);

      await addDoc(collection(firestore, 'junior_incomplete_sentences'), {
        prompt: formPrompt.trim(),
        answer: formAnswer.trim(),
        options: optionsArray,
        category: formCategory,
        explanation: formExplanation.trim() || `Context rule: ${formAnswer} correctly finishes the sentence.`,
        schoolId,
        createdBy: user?.displayName || 'Teacher',
        createdAt: serverTimestamp()
      });

      toast({ title: "Success! 🎉", description: "New incomplete sentence challenge added for pupils to master!" });
      resetForm();
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error("Save sentence error:", err);
      toast({ title: "Save Failed", description: err.message || "Failed to save sentence challenge.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) {
      toast({ title: "Missing Topic", description: "Enter a topic e.g. Photosynthesis, Solar System, Verbs", variant: "destructive" });
      return;
    }
    if (!schoolId) {
      toast({ title: "Error", description: "School ID not detected.", variant: "destructive" });
      return;
    }

    try {
      setIsAiGenerating(true);
      const res = await generateIncompleteSentenceAction(aiTopic, formCategory, schoolId);
      if (res.success && res.data) {
        setFormPrompt(res.data.prompt);
        setFormAnswer(res.data.answer);
        const distractors = res.data.options.filter((o: string) => o.toLowerCase() !== res.data.answer.toLowerCase());
        setFormOpt2(distractors[0] || 'chocolate');
        setFormOpt3(distractors[1] || 'pencils');
        setFormOpt4(distractors[2] || 'curtains');
        if (res.data.category) setFormCategory(res.data.category);
        if (res.data.explanation) setFormExplanation(res.data.explanation);

        toast({ title: "AI Generated! ✨", description: "Sentence challenge pre-filled. You can edit before saving." });
      } else {
        toast({ title: "AI Generation Failed", description: res.error || "Could not generate sentence.", variant: "destructive" });
      }
    } catch (err: any) {
      console.error("AI Generate Error:", err);
      toast({ title: "AI Error", description: err.message || "An error occurred during generation.", variant: "destructive" });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleDeleteCustomSentence = async (docId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'junior_incomplete_sentences', docId));
      toast({ title: "Deleted", description: "Teacher challenge removed from Nursery Bloom." });
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & TEACHER CONTROLS */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white p-6 md:p-8 rounded-[36px] shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-white/20 hover:bg-white/30 text-white font-black text-xs px-3 py-1 uppercase tracking-widest border border-white/30">
              Year 5+ KG2 / Class 1 Advanced
            </Badge>
            <Badge className="bg-yellow-400 text-purple-950 font-black text-xs px-3 py-1 uppercase tracking-widest">
              Grammar & Context Mastery
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
            Finishing An Incomplete Sentence <Sparkles className="w-7 h-7 text-yellow-300 animate-bounce" />
          </h2>
          <p className="text-purple-100/90 font-medium text-sm md:text-base mt-2">
            Read carefully, identify context clues, and select the exact word that completes the sentence logically and grammatically!
          </p>
        </div>

        {/* STATS & TEACHER ACTIONS */}
        <div className="z-10 flex flex-wrap items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center min-w-[90px]">
            <div className="text-[10px] font-black uppercase text-purple-200">Streak</div>
            <div className="text-xl font-black text-yellow-300">🔥 {streak}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-center min-w-[90px]">
            <div className="text-[10px] font-black uppercase text-purple-200">Mastered</div>
            <div className="text-xl font-black text-emerald-300">🌟 {masteredCount}</div>
          </div>

          {canEdit && (
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Button
                onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                className="bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black rounded-2xl shadow-lg border-b-4 border-yellow-600 flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> Add Teacher Example
              </Button>

              <Button
                onClick={() => setIsLibraryOpen(true)}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl border-white/30 flex items-center gap-2 text-xs"
              >
                <Library className="w-4 h-4" /> Manage Custom Examples ({dbSentences?.length || 0})
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 pl-1">
          <PenTool className="w-4 h-4" /> Category:
        </span>
        {categories.map((cat) => {
          const count = cat === 'All' ? allSentences.length : cat === 'Teacher Added 👩‍🏫' ? (dbSentences?.length || 0) : allSentences.filter(s => s.category === cat).length;
          return (
            <Button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              variant={activeCategory === cat ? 'default' : 'outline'}
              className={cn(
                "rounded-2xl font-black text-xs px-4 py-2 whitespace-nowrap transition-all",
                activeCategory === cat
                  ? "bg-purple-600 text-white shadow-md border-b-4 border-purple-900"
                  : "border-purple-200 text-purple-900 hover:bg-purple-50"
              )}
            >
              {cat} <span className="ml-1 opacity-75 font-bold text-[10px]">({count})</span>
            </Button>
          );
        })}
      </div>

      {/* GAMEPLAY CONTAINER */}
      {item ? (
        <div className="bg-white p-6 md:p-10 rounded-[40px] border-4 border-purple-100 shadow-2xl space-y-8 relative overflow-hidden">
          {/* Card Meta Header */}
          <div className="flex items-center justify-between border-b border-purple-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-widest bg-purple-100 text-purple-800 px-4 py-1.5 rounded-full border border-purple-200">
                {item.category || 'General Context'}
              </span>
              {item.isTeacherAdded && (
                <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                  👩‍🏫 Teacher Challenge
                </span>
              )}
            </div>

            <div className="text-xs font-black text-slate-400">
              Challenge {currentIdx + 1} of {filteredSentences.length}
            </div>
          </div>

          {/* Prompt Sentence Box */}
          <div className="bg-gradient-to-b from-purple-50 to-indigo-50/40 p-8 rounded-3xl border-2 border-purple-200 text-center relative group">
            <Button
              onClick={speakPrompt}
              size="icon"
              className="absolute top-4 right-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-md"
              title="Listen to sentence"
            >
              <Volume2 className="w-5 h-5" />
            </Button>

            <span className="text-xs font-black uppercase text-purple-600 tracking-widest block mb-2">
              Fill in the missing word:
            </span>

            <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-relaxed max-w-3xl mx-auto">
              "{item.prompt.split('______').map((part, idx, arr) => (
                <span key={idx}>
                  {part}
                  {idx < arr.length - 1 && (
                    <span className={cn(
                      "inline-block mx-2 px-4 py-1 rounded-2xl font-black transition-all border-2",
                      selectedOption
                        ? (isCorrect ? "bg-emerald-500 text-white border-emerald-600 shadow-md scale-105" : "bg-rose-500 text-white border-rose-600 animate-shake")
                        : "bg-white text-purple-700 border-purple-400 shadow-inner min-w-[120px] underline decoration-wavy decoration-purple-400"
                    )}>
                      {selectedOption ? selectedOption : "[ ______ ]"}
                    </span>
                  )}
                </span>
              ))}"
            </h3>
          </div>

          {/* Option Buttons */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase text-slate-400 tracking-widest block text-center">
              Choose the correct word to finish the sentence:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {item.options.map((opt, idx) => {
                const isThisSelected = selectedOption === opt;
                const isAnswer = opt === item.answer;

                return (
                  <Button
                    key={idx}
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      "h-20 text-xl font-black rounded-3xl border-2 border-b-8 transition-all flex items-center justify-between px-6 shadow-md hover:scale-102 active:translate-y-1",
                      isThisSelected
                        ? (isAnswer
                            ? "bg-emerald-500 text-white border-emerald-700 shadow-emerald-200"
                            : "bg-rose-500 text-white border-rose-700 shadow-rose-200")
                        : (selectedOption && isAnswer
                            ? "bg-emerald-100 text-emerald-900 border-emerald-400"
                            : "bg-white hover:bg-purple-50 text-purple-950 border-purple-200 hover:border-purple-400")
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-2xl bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center border border-purple-200">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </span>

                    {isThisSelected && isAnswer && <CheckCircle2 className="w-7 h-7 text-white animate-bounce" />}
                    {isThisSelected && !isAnswer && <XCircle className="w-7 h-7 text-white" />}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Feedback & Explanation Card */}
          {feedback && (
            <div className={cn(
              "p-6 rounded-3xl border-2 text-center transition-all animate-in fade-in-50 duration-300",
              isCorrect ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"
            )}>
              <p className="text-lg font-black">{feedback}</p>

              {showExplanation && item.explanation && (
                <div className="mt-4 bg-white/80 p-4 rounded-2xl border border-emerald-200 text-left text-xs md:text-sm font-medium text-emerald-950 flex items-start gap-3 shadow-sm">
                  <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-emerald-800 block text-xs uppercase tracking-wider mb-1">
                      Context Rule & Explanation:
                    </span>
                    {item.explanation}
                  </div>
                  <Button
                    onClick={() => speak(item.explanation || '')}
                    size="icon"
                    variant="ghost"
                    className="ml-auto text-emerald-700 hover:bg-emerald-100 rounded-xl"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Nav Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              onClick={prevChallenge}
              variant="outline"
              className="rounded-2xl font-black border-purple-200 text-purple-900 hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </Button>

            <Button
              onClick={() => speakPrompt()}
              variant="ghost"
              className="font-black text-purple-700 hover:bg-purple-50 rounded-2xl text-xs"
            >
              <Volume2 className="w-4 h-4 mr-1" /> Replay Voice
            </Button>

            <Button
              onClick={nextChallenge}
              className="bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl px-6 shadow-md"
            >
              Next Challenge <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-[40px] border-4 border-purple-100 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-xl font-black text-slate-800">No Sentences Found</h3>
          <p className="text-sm text-slate-500">No incomplete sentence challenges available in this category yet.</p>
          <Button onClick={() => setActiveCategory('All')} className="bg-purple-600 text-white font-black rounded-2xl">
            Show All Sentences
          </Button>
        </div>
      )}

      {/* TEACHER ADD DIALOG */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-[36px] p-6 md:p-8 border-4 border-purple-200 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-purple-950 flex items-center gap-2">
              <PenTool className="w-6 h-6 text-purple-600" /> Create Teacher Sentence Challenge
            </DialogTitle>
            <CardDescription className="text-xs font-bold text-slate-500">
              Add a new incomplete sentence for pupils to practice context clues, grammar, and vocabulary.
            </CardDescription>
          </DialogHeader>

          {/* AI Generator Helper Box */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-3xl border border-purple-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-purple-600" /> ✨ AI Sentence Creator Helper
              </span>
              <Badge className="bg-purple-200 text-purple-900 font-bold text-[10px]">Gemini AI Powered</Badge>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Topic e.g. Photosynthesis, Solar System, Past Tense Verbs"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="rounded-xl border-purple-200 text-sm font-medium bg-white"
              />
              <Button
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiGenerating}
                className="bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl text-xs whitespace-nowrap px-4"
              >
                {isAiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Challenge"}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSaveSentence} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-black text-purple-900 uppercase">
                Sentence Prompt (Must include '______' for blank space) *
              </Label>
              <Input
                required
                value={formPrompt}
                onChange={(e) => setFormPrompt(e.target.value)}
                placeholder="e.g. Camels store fat in their humps to survive long journeys in the ______."
                className="rounded-2xl border-purple-200 mt-1 font-semibold text-sm"
              />
              <span className="text-[10px] text-slate-400 font-medium">Tip: Type 6 underscores '______' where pupils should fill in the missing word.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-black text-emerald-800 uppercase">Correct Answer *</Label>
                <Input
                  required
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="e.g. desert"
                  className="rounded-2xl border-emerald-300 mt-1 font-black text-emerald-950 bg-emerald-50/50"
                />
              </div>
              <div>
                <Label className="text-xs font-black text-purple-900 uppercase">Category</Label>
                <Select value={formCategory} onValueChange={setFormCategory}>
                  <SelectTrigger className="rounded-2xl border-purple-200 mt-1 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="Science & Nature">Science & Nature</SelectItem>
                    <SelectItem value="Grammar & Words">Grammar & Words</SelectItem>
                    <SelectItem value="Space & Tech">Space & Tech</SelectItem>
                    <SelectItem value="Math & Logic">Math & Logic</SelectItem>
                    <SelectItem value="Logic & Life">Logic & Life</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-black text-rose-800 uppercase">Wrong Options (Distractor Choices) *</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
                <Input
                  required
                  value={formOpt2}
                  onChange={(e) => setFormOpt2(e.target.value)}
                  placeholder="Option 2 (e.g. ocean)"
                  className="rounded-2xl border-purple-200 text-sm"
                />
                <Input
                  required
                  value={formOpt3}
                  onChange={(e) => setFormOpt3(e.target.value)}
                  placeholder="Option 3 (e.g. forest)"
                  className="rounded-2xl border-purple-200 text-sm"
                />
                <Input
                  required
                  value={formOpt4}
                  onChange={(e) => setFormOpt4(e.target.value)}
                  placeholder="Option 4 (e.g. glacier)"
                  className="rounded-2xl border-purple-200 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-black text-purple-900 uppercase">Explanation / Context Rule (Optional)</Label>
              <Input
                value={formExplanation}
                onChange={(e) => setFormExplanation(e.target.value)}
                placeholder="e.g. Deserts are dry ecosystems with minimal rainfall where camels thrive."
                className="rounded-2xl border-purple-200 mt-1 text-sm font-medium"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-purple-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-2xl font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl px-6"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Publish Challenge to Nursery Bloom
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* TEACHER MANAGEMENT LIBRARY DIALOG */}
      <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
        <DialogContent className="max-w-3xl bg-white rounded-[36px] p-6 md:p-8 border-4 border-purple-200 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-purple-950 flex items-center gap-2">
              <Library className="w-6 h-6 text-purple-600" /> Custom Teacher Sentence Challenges
            </DialogTitle>
            <CardDescription className="text-xs font-bold text-slate-500">
              View and manage incomplete sentence exercises published by teachers.
            </CardDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {!dbSentences || dbSentences.length === 0 ? (
              <div className="p-8 text-center bg-purple-50 rounded-3xl border border-purple-100">
                <PenTool className="w-10 h-10 text-purple-400 mx-auto mb-2" />
                <p className="font-black text-purple-950 text-sm">No custom teacher sentences published yet.</p>
                <p className="text-xs text-purple-600 mt-1">Use the "Add Teacher Example" button to create custom challenges.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dbSentences.map((s: any) => (
                  <div key={s.id} className="p-4 bg-purple-50/50 rounded-2xl border border-purple-200 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-purple-200 text-purple-900 font-bold text-[10px] uppercase">
                          {s.category || 'General'}
                        </Badge>
                        <span className="text-[10px] font-bold text-slate-400">By {s.createdBy || 'Teacher'}</span>
                      </div>
                      <p className="font-extrabold text-slate-900 text-sm">"{s.prompt}"</p>
                      <p className="text-xs text-emerald-700 font-bold mt-1">Correct Answer: {s.answer}</p>
                    </div>

                    <Button
                      onClick={() => handleDeleteCustomSentence(s.id)}
                      size="icon"
                      variant="ghost"
                      className="text-rose-500 hover:bg-rose-100 rounded-xl"
                      title="Delete Challenge"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StorySequencerGame() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const story = STORY_SEQUENCING_DRILLS[currentIdx];
  const [userOrder, setUserOrder] = useState<any[]>([]);

  useEffect(() => {
    if (story) {
      setUserOrder([...story.events].sort(() => Math.random() - 0.5));
    }
  }, [story, currentIdx]);

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...userOrder];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    setUserOrder(updated);
  };

  const checkOrder = () => {
    const isCorrect = userOrder.every((item, i) => item.order === i + 1);
    if (isCorrect) {
      speak("Fantastic! You put the story in the correct order!");
      confetti({ particleCount: 70 });
    } else {
      speak("Not quite. Check the story steps once more!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-6 rounded-3xl border-2 border-purple-200 text-center">
        <h3 className="text-xl font-black text-purple-900">Story Event Sequencing: {story.title}</h3>
        <p className="text-xs text-purple-600 font-bold mt-1">Re-order the steps in chronological order</p>
      </div>

      <div className="space-y-3">
        {userOrder.map((ev, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-purple-100 shadow-sm">
            <span className="font-bold text-slate-800 text-sm">{i + 1}. {ev.text}</span>
            <Button size="sm" variant="ghost" onClick={() => moveUp(i)} disabled={i === 0} className="text-purple-600 font-black">
              Move Up ⬆️
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={checkOrder} className="bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl px-6">
          Check Story Order
        </Button>
        <Button onClick={() => setCurrentIdx((prev) => (prev + 1) % STORY_SEQUENCING_DRILLS.length)} variant="outline" className="border-purple-300 text-purple-700 font-black rounded-2xl">
          Next Story
        </Button>
      </div>
    </div>
  );
}

// --- ALGORITHMIC STORY GENERATOR (YEAR 5+) ---
function generateAlgorithmicWordProblem() {
  const names = ["Kofi", "Ama", "Yaa", "Kwame", "Abena", "Ekow", "Adjoa", "Kweku", "Mansa", "Tetteh", "Sena", "Afi", "Bako", "Manu", "Chidi", "Obinna"];
  const items = ["shiny shells", "red balloons", "sweet cupcakes", "ripe mangoes", "toy cars", "colorful marbles", "juicy apples", "ripe bananas", "chocolate bars", "stickers", "crayons", "storybooks"];
  const pronouns: Record<string, string> = {
    "Kofi": "him", "Kwame": "him", "Ekow": "him", "Kweku": "him", "Manu": "him", "Chidi": "him", "Obinna": "him", "Tetteh": "him",
    "Ama": "her", "Yaa": "her", "Abena": "her", "Adjoa": "her", "Mansa": "her", "Afi": "her", "Sena": "her", "Bako": "her"
  };

  const templates = [
    // 1. Addition
    () => {
      const name1 = names[Math.floor(Math.random() * names.length)];
      let name2 = names[Math.floor(Math.random() * names.length)];
      while (name2 === name1) name2 = names[Math.floor(Math.random() * names.length)];
      const item = items[Math.floor(Math.random() * items.length)];
      const x = Math.floor(Math.random() * 30) + 10;
      const y = Math.floor(Math.random() * 30) + 10;
      const ans = x + y;
      const p = pronouns[name1] || "him";
      const prompt = `${name1} collected ${x} ${item}. ${name2} gave ${p} ${y} more. How many ${item} does ${name1} have now?`;
      return { prompt, ans };
    },
    // 2. Subtraction
    () => {
      const name1 = names[Math.floor(Math.random() * names.length)];
      const item = items[Math.floor(Math.random() * items.length)];
      const x = Math.floor(Math.random() * 40) + 40;
      const y = Math.floor(Math.random() * 25) + 10;
      const ans = x - y;
      const prompt = `There were ${x} ${item} in a classroom basket. ${name1} took ${y} of them out. How many ${item} are left in the basket?`;
      return { prompt, ans };
    },
    // 3. Multiplication (Grouping)
    () => {
      const name1 = names[Math.floor(Math.random() * names.length)];
      const item = items[Math.floor(Math.random() * items.length)];
      const x = Math.floor(Math.random() * 5) + 3;
      const y = Math.floor(Math.random() * 4) + 2;
      const ans = x * y;
      const prompt = `${name1} bought ${x} trays of ${item}. Each tray contains ${y} ${item}. How many ${item} did ${name1} get in total?`;
      return { prompt, ans };
    },
    // 4. Division (Sharing)
    () => {
      const name1 = names[Math.floor(Math.random() * names.length)];
      const item = items[Math.floor(Math.random() * items.length)];
      const friends = Math.floor(Math.random() * 3) + 2;
      const ans = Math.floor(Math.random() * 6) + 3;
      const total = friends * ans;
      const prompt = `${name1} wants to share ${total} ${item} equally among ${friends} friends. How many ${item} does each friend receive?`;
      return { prompt, ans };
    },
    // 5. Money
    () => {
      const name1 = names[Math.floor(Math.random() * names.length)];
      const x = Math.floor(Math.random() * 30) + 15;
      const y = Math.floor(Math.random() * 30) + 15;
      const ans = x + y;
      const prompt = `${name1} saved $${x} last week and $${y} this week. How much money did ${name1} save in total?`;
      return { prompt, ans };
    },
    // 6. Difference / Comparison
    () => {
      const name1 = names[Math.floor(Math.random() * names.length)];
      let name2 = names[Math.floor(Math.random() * names.length)];
      while (name2 === name1) name2 = names[Math.floor(Math.random() * names.length)];
      const item = items[Math.floor(Math.random() * items.length)];
      const y = Math.floor(Math.random() * 20) + 10;
      const diff = Math.floor(Math.random() * 15) + 5;
      const x = y + diff;
      const ans = diff;
      const prompt = `${name1} has ${x} ${item}. ${name2} has ${y} ${item}. How many more ${item} does ${name1} have than ${name2}?`;
      return { prompt, ans };
    },
    // 7. Three-person Sum
    () => {
      const name1 = names[Math.floor(Math.random() * names.length)];
      let name2 = names[Math.floor(Math.random() * names.length)];
      while (name2 === name1) name2 = names[Math.floor(Math.random() * names.length)];
      let name3 = names[Math.floor(Math.random() * names.length)];
      while (name3 === name1 || name3 === name2) name3 = names[Math.floor(Math.random() * names.length)];
      
      const item = items[Math.floor(Math.random() * items.length)];
      const x = Math.floor(Math.random() * 15) + 5;
      const y = Math.floor(Math.random() * 15) + 5;
      const z = Math.floor(Math.random() * 15) + 5;
      const ans = x + y + z;
      const prompt = `${name1} has ${x} ${item}, ${name2} has ${y}, and ${name3} has ${z}. How many ${item} do they have in total?`;
      return { prompt, ans };
    }
  ];

  const pickTemplate = templates[Math.floor(Math.random() * templates.length)];
  const result = pickTemplate();

  // Auto-generate distractors
  const distractors = new Set<number>();
  const offsets = [2, -2, 5, -3, 10, -5, 1, -1];
  for (const offset of offsets) {
    const val = result.ans + offset;
    if (val > 0 && val !== result.ans) {
      distractors.add(val);
    }
    if (distractors.size >= 3) break;
  }
  while (distractors.size < 3) {
    const val = result.ans + Math.floor(Math.random() * 20) + 1;
    if (val !== result.ans) distractors.add(val);
  }

  const options = [result.ans, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

  return {
    prompt: result.prompt,
    ans: result.ans,
    options,
    category: "Infinite Word Problem Challenge",
    isTeacherAdded: false,
    id: `algorithmic-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
}

// --- AGES 5+ ADVANCED CLASS 1 MATH MASTERY SUITE ---
function Age5PlusMathMastery({ canEdit = false }: { canEdit?: boolean }) {
  type StandardMathMode = '2digit_add' | '2digit_sub' | 'times_tables' | 'sharing_div' | 'skip_count' | 'compare_100' | 'geometry_3d' | 'clock_money' | 'word_problem';
  
  const firestore = useFirestore();
  const { user } = useUser();
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();

  const lastQuestionPromptRef = useRef<string>("");

  const [activeMode, setActiveMode] = useState<StandardMathMode>('2digit_add');
  const [question, setQuestion] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const [streak, setStreak] = useState(0);

  const WORD_PROBLEMS_5PLUS = useMemo(() => [
    { prompt: "Kofi collected 15 shiny shells at the beach. Ama gave him 12 more shells. How many shells does Kofi have now?", ans: 27, options: [27, 25, 30, 22], isTeacherAdded: false, id: "static-1" },
    { prompt: "There were 28 red balloons at the school party. 10 balloons popped. How many balloons are left?", ans: 18, options: [18, 20, 15, 38], isTeacherAdded: false, id: "static-2" },
    { prompt: "A baker made 4 trays of cupcakes. Each tray has 5 cupcakes. How many cupcakes did the baker make in total?", ans: 20, options: [20, 15, 25, 10], isTeacherAdded: false, id: "static-3" },
    { prompt: "Sharing 15 apples equally among 3 children. How many apples does each child receive?", ans: 5, options: [5, 3, 6, 4], isTeacherAdded: false, id: "static-4" },
    { prompt: "Yaa saved $20 on Monday and $25 on Tuesday. How much money did Yaa save in total?", ans: 45, options: [45, 40, 50, 35], isTeacherAdded: false, id: "static-5" }
  ], []);

  // Firestore query for teacher added math word problems
  const mathProblemsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'junior_math_word_problems'), orderBy('createdAt', 'desc')) : null, [firestore, schoolId]);
  const { data: dbMathProblems } = useCollection<any>(mathProblemsQuery);

  // Combine static word problems with custom teacher problems
  const combinedWordProblems = useMemo(() => {
    const custom = (dbMathProblems || []).map((p: any) => ({
      prompt: p.prompt,
      ans: Number(p.ans),
      options: (p.options || []).map(Number).filter((n: any) => !isNaN(n)),
      isTeacherAdded: true,
      id: p.id
    }));
    return [...WORD_PROBLEMS_5PLUS, ...custom];
  }, [dbMathProblems, WORD_PROBLEMS_5PLUS]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formPrompt, setFormPrompt] = useState("");
  const [formAnswer, setFormAnswer] = useState("");

  // AI Generator state
  const [aiTopic, setAiTopic] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const generateQuestion = useCallback(() => {
    let q: any = {};
    let attempts = 0;

    do {
      if (activeMode === '2digit_add') {
        const a = Math.floor(Math.random() * 40) + 10;
        const b = Math.floor(Math.random() * 40) + 10;
        const ans = a + b;
        const options = [ans, ans + 10, Math.max(10, ans - 5), ans + 2].sort(() => Math.random() - 0.5);
        q = { prompt: `${a} + ${b} = ?`, tensA: Math.floor(a/10), onesA: a%10, tensB: Math.floor(b/10), onesB: b%10, ans, options, category: "2-Digit Addition (Tens & Ones)" };
      } else if (activeMode === '2digit_sub') {
        const a = Math.floor(Math.random() * 40) + 50;
        const b = Math.floor(Math.random() * 30) + 10;
        const ans = a - b;
        const options = [ans, ans + 5, Math.max(5, ans - 10), ans + 2].sort(() => Math.random() - 0.5);
        q = { prompt: `${a} - ${b} = ?`, tensA: Math.floor(a/10), onesA: a%10, tensB: Math.floor(b/10), onesB: b%10, ans, options, category: "2-Digit Subtraction" };
      } else if (activeMode === 'times_tables') {
        const tables = [2, 3, 4, 5, 6, 7, 8, 9, 10];
        const mult = tables[Math.floor(Math.random() * tables.length)];
        const num = Math.floor(Math.random() * 12) + 1;
        const ans = mult * num;
        const options = [ans, ans + mult, Math.max(mult, ans - mult), ans + 2].sort(() => Math.random() - 0.5);
        q = { prompt: `${mult} × ${num} = ?`, ans, options, category: `Times Tables (${mult}x)` };
      } else if (activeMode === 'sharing_div') {
        const groups = [2, 3, 4, 5, 6, 8, 10];
        const grp = groups[Math.floor(Math.random() * groups.length)];
        const itemsPerGroup = Math.floor(Math.random() * 10) + 1;
        const total = grp * itemsPerGroup;
        const ans = itemsPerGroup;
        const options = [ans, ans + 1, Math.max(1, ans - 1), ans + 2].sort(() => Math.random() - 0.5);
        q = { prompt: `Share ${total} items equally into ${grp} groups. How many in each group?`, ans, options, category: "Equal Division & Sharing" };
      } else if (activeMode === 'skip_count') {
        const step = [2, 3, 4, 5, 10, 20][Math.floor(Math.random() * 6)];
        const start = (Math.floor(Math.random() * 12) + 1) * step;
        const seq = [start, start + step, start + step * 2];
        const ans = start + step * 3;
        const options = [ans, ans + step, ans - 1, ans + 2].sort(() => Math.random() - 0.5);
        q = { prompt: `${seq[0]}, ${seq[1]}, ${seq[2]}, ?`, ans, options, category: `Skip Counting by ${step}s` };
      } else if (activeMode === 'compare_100') {
        const a = Math.floor(Math.random() * 80) + 10;
        const b = Math.floor(Math.random() * 80) + 10;
        const ans = a > b ? '>' : a < b ? '<' : '=';
        q = { prompt: `${a}  ___  ${b}`, ans, options: ['>', '<', '='], category: "Comparing Numbers up to 100" };
      } else if (activeMode === 'geometry_3d') {
        const shapes = [
          { name: 'Cube', icon: '🧊', desc: '3D shape with 6 square faces' },
          { name: 'Sphere', icon: '⚽', desc: 'Round 3D ball shape' },
          { name: 'Cylinder', icon: '🛢️', desc: '3D can shape with 2 circular ends' },
          { name: 'Cone', icon: '🍦', desc: '3D party hat shape with 1 point' },
          { name: 'Pyramid', icon: '🔺', desc: '3D triangular faces meeting at top' },
          { name: 'Triangle', icon: '📐', desc: '2D flat shape with 3 sides' },
          { name: 'Square', icon: '⏹️', desc: '2D flat shape with 4 equal sides' },
          { name: 'Circle', icon: '🔴', desc: 'Round 2D flat shape' },
          { name: 'Star', icon: '⭐', desc: '5-pointed flat shape' },
          { name: 'Heart', icon: '❤️', desc: 'Flat heart shape' }
        ];
        const pick = shapes[Math.floor(Math.random() * shapes.length)];
        const randomizedOptions = shapes.map(s => s.name).sort(() => Math.random() - 0.5).slice(0, 4);
        if (!randomizedOptions.includes(pick.name)) {
          randomizedOptions[0] = pick.name;
        }
        const options = randomizedOptions.sort(() => Math.random() - 0.5);
        q = { prompt: `Identify this shape: ${pick.icon}`, icon: pick.icon, desc: pick.desc, ans: pick.name, options, category: "2D & 3D Geometry" };
      } else if (activeMode === 'clock_money') {
        const types = ['clock', 'money'];
        const t = types[Math.floor(Math.random() * types.length)];
        if (t === 'clock') {
          const hr = Math.floor(Math.random() * 12) + 1;
          const clockTypes = ['o_clock', 'half_past', 'quarter_past', 'quarter_to'];
          const ct = clockTypes[Math.floor(Math.random() * clockTypes.length)];
          let ans = "";
          let detail = "";
          if (ct === 'o_clock') {
            ans = `${hr}:00 (${hr} o'clock)`;
            detail = `Hour hand at ${hr}, minute hand at 12`;
          } else if (ct === 'half_past') {
            ans = `${hr}:30 (Half past ${hr})`;
            detail = `Hour hand past ${hr}, minute hand at 6`;
          } else if (ct === 'quarter_past') {
            ans = `${hr}:15 (Quarter past ${hr})`;
            detail = `Hour hand just past ${hr}, minute hand at 3`;
          } else {
            ans = `${hr === 12 ? 11 : hr - 1}:45 (Quarter to ${hr})`;
            detail = `Hour hand almost at ${hr}, minute hand at 9`;
          }
          const options = [ans, `${(hr % 12) + 1}:00`, `${hr}:00 (${hr} o'clock)`, `6:30`].filter((v, i, a) => a.indexOf(v) === i);
          while (options.length < 3) options.push(`${Math.floor(Math.random()*12)+1}:15`);
          q = { prompt: `What time does the clock show?`, detail, ans, options: options.sort(() => Math.random() - 0.5), category: "Telling Time (Analog Clock)" };
        } else {
          const bills = [1, 2, 5, 10, 20];
          const c1 = bills[Math.floor(Math.random() * bills.length)];
          const c2 = bills[Math.floor(Math.random() * bills.length)];
          const c3 = bills[Math.floor(Math.random() * bills.length)];
          const sum = c1 + c2 + c3;
          const ans = `$${sum}`;
          const options = [ans, `$${sum + 3}`, `$${Math.max(1, sum - 2)}`, `$${sum + 5}`].sort(() => Math.random() - 0.5);
          q = { prompt: `Count money: $${c1} bill + $${c2} bill + $${c3} bill = ?`, ans, options, category: "Counting Currency & Money" };
        }
      } else if (activeMode === 'word_problem') {
        const useAlgorithmic = Math.random() > 0.5 || combinedWordProblems.length === 0;
        if (useAlgorithmic) {
          q = generateAlgorithmicWordProblem();
        } else {
          const item = combinedWordProblems[Math.floor(Math.random() * combinedWordProblems.length)];
          q = { prompt: item.prompt, ans: item.ans, options: item.options, category: "Class 1 Word Problem Challenge", isTeacherAdded: item.isTeacherAdded, id: item.id };
        }
      }
      attempts++;
    } while (q.prompt === lastQuestionPromptRef.current && attempts < 5);

    lastQuestionPromptRef.current = q.prompt;
    setQuestion(q);
    setFeedback("");
  }, [activeMode, combinedWordProblems]);

  useEffect(() => { generateQuestion(); }, [generateQuestion]);

  const handleAnswer = (choice: any) => {
    if (choice === question.ans) {
      setFeedback("CORRECT! Outstanding math mastery! 🌟");
      speak("Great job! Correct answer!");
      confetti({ particleCount: 80, spread: 70 });
      setStreak(s => s + 1);
      setTimeout(generateQuestion, 1800);
    } else {
      setFeedback("Try again! Double check your math calculations.");
      speak("Try again!");
      setStreak(0);
    }
  };

  const resetForm = () => {
    setFormPrompt("");
    setFormAnswer("");
    setAiTopic("");
  };

  const handleSaveProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !schoolId) {
      toast({ title: "Database Error", description: "Database is not connected.", variant: "destructive" });
      return;
    }
    const numericalAns = Number(formAnswer.trim());

    if (isNaN(numericalAns)) {
      toast({ title: "Validation Error", description: "The correct answer must be a valid number.", variant: "destructive" });
      return;
    }

    try {
      setIsSaving(true);
      
      // Auto-generate 3 unique numerical distractors
      const distractors = new Set<number>();
      const offsets = [2, -2, 5, -3, 10, -5, 1, -1];
      for (const offset of offsets) {
        const val = numericalAns + offset;
        if (val > 0 && val !== numericalAns) {
          distractors.add(val);
        }
        if (distractors.size >= 3) break;
      }
      while (distractors.size < 3) {
        const val = numericalAns + Math.floor(Math.random() * 20) + 1;
        if (val !== numericalAns) distractors.add(val);
      }
      
      const optionsArray = [numericalAns, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

      await addDoc(collection(firestore, 'junior_math_word_problems'), {
        prompt: formPrompt.trim(),
        ans: numericalAns,
        options: optionsArray,
        schoolId,
        createdBy: user?.displayName || 'Class Teacher',
        createdAt: serverTimestamp()
      });

      toast({ title: "Math Problem Published! 🎉", description: "New custom word problem challenge saved for pupils." });
      resetForm();
      setIsAddModalOpen(false);
      generateQuestion();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to save math problem.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) {
      toast({ title: "Missing Topic", description: "Please enter a topic e.g. sharing cookies, counting frogs, losing balloons", variant: "destructive" });
      return;
    }
    if (!schoolId) return;

    try {
      setIsAiGenerating(true);
      const res = await generateMathWordProblemAction(aiTopic, schoolId);
      if (res.success && res.data) {
        setFormPrompt(res.data.prompt);
        setFormAnswer(String(res.data.ans));
        toast({ title: "AI Generated! ✨", description: "Word problem populated. Verify details and save." });
      } else {
        toast({ title: "AI Failed", description: res.error || "Could not generate math word problem.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "AI Error", description: err.message, variant: "destructive" });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleDeleteProblem = async (docId: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'junior_math_word_problems', docId));
      toast({ title: "Deleted", description: "Math challenge removed from database." });
      generateQuestion();
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
            Class 1 Standard Math Curriculum
          </span>
          <h3 className="text-2xl font-black mt-1 flex items-center gap-2">
            🎓 Age 5+ Advanced Math Mastery Suite <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
          </h3>
          <p className="text-xs text-indigo-100 font-medium mt-0.5">2-Digit Addition/Subtraction, Times Tables, Geometry, Time, Money & Word Problems</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="bg-white/15 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 text-center min-w-[100px]">
            <div className="text-[10px] font-black uppercase text-indigo-200">Math Streak</div>
            <div className="text-2xl font-black text-amber-300">🔥 {streak}</div>
          </div>
          
          {canEdit && (
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <Button
                onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                className="bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black rounded-2xl shadow-lg border-b-4 border-yellow-600 flex items-center gap-2 text-xs py-2"
              >
                <PlusCircle className="w-4 h-4" /> Add Word Problem
              </Button>
              <Button
                onClick={() => setIsLibraryOpen(true)}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl border-white/30 flex items-center gap-2 text-[10px] py-1.5"
              >
                <Library className="w-3.5 h-3.5" /> Manage Problems ({dbMathProblems?.length || 0})
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: '2digit_add', label: '➕ 2-Digit Add' },
          { id: '2digit_sub', label: '➖ 2-Digit Sub' },
          { id: 'times_tables', label: '✖️ Times Tables' },
          { id: 'sharing_div', label: '➗ Equal Division' },
          { id: 'skip_count', label: '🔢 Skip Counting' },
          { id: 'compare_100', label: '⚖️ Compare (<>)' },
          { id: 'geometry_3d', label: '🧊 3D Shapes' },
          { id: 'clock_money', label: '🕒 Time & Money' },
          { id: 'word_problem', label: '📝 Word Problems' }
        ].map(m => (
          <Button
            key={m.id}
            onClick={() => setActiveMode(m.id as StandardMathMode)}
            variant={activeMode === m.id ? 'default' : 'outline'}
            className={cn(
              "rounded-2xl font-black text-xs px-4 py-2 min-w-[120px] transition-all",
              activeMode === m.id
                ? "bg-indigo-600 text-white shadow-md border-b-4 border-indigo-800"
                : "border-indigo-200 text-indigo-800 hover:bg-indigo-50"
            )}
          >
            {m.label}
          </Button>
        ))}
      </div>

      {/* Question Display Card */}
      {question && (
        <div className="bg-white p-8 rounded-[36px] border-4 border-indigo-100 shadow-xl text-center space-y-6">
          <div className="flex justify-center items-center gap-3">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
              {question.category}
            </span>
            {question.isTeacherAdded && (
              <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                👩‍🏫 Teacher Challenge
              </span>
            )}
          </div>

          <h3 className="text-3xl font-black text-slate-800 leading-snug max-w-xl mx-auto">
            {question.prompt}
          </h3>

          {question.desc && <p className="text-sm font-bold text-slate-500">{question.desc}</p>}
          {question.detail && <p className="text-xs font-extrabold text-indigo-600 bg-indigo-50 p-2 rounded-xl inline-block">{question.detail}</p>}

          {/* Place Value Tens & Ones Helper for 2-Digit Math */}
          {question.tensA !== undefined && (
            <div className="flex justify-center items-center gap-6 py-2">
              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 text-xs font-black text-purple-800">
                <span className="block text-[10px] text-purple-500 uppercase">Tens Block</span>
                📦 {question.tensA} Tens ({question.tensA * 10})
              </div>
              <span className="text-xl font-black text-slate-400">+</span>
              <div className="bg-pink-50 p-3 rounded-2xl border border-pink-200 text-xs font-black text-pink-800">
                <span className="block text-[10px] text-pink-500 uppercase">Ones Block</span>
                🎲 {question.onesA} Ones
              </div>
            </div>
          )}

          {/* Answer Choice Buttons */}
          <div className="flex justify-center gap-4 flex-wrap max-w-lg mx-auto pt-2">
            {question.options.map((opt: any, idx: number) => (
              <Button
                key={idx}
                onClick={() => handleAnswer(opt)}
                className="h-16 min-w-[120px] px-6 text-2xl font-black rounded-2xl bg-white hover:bg-indigo-100 text-indigo-900 border-2 border-b-8 border-indigo-200 shadow-lg hover:scale-105 active:translate-y-1 transition-all"
              >
                {opt}
              </Button>
            ))}
          </div>

          {feedback && <p className="text-lg font-black text-indigo-600 animate-pulse pt-2">{feedback}</p>}
        </div>
      )}

      {/* TEACHER ADD DIALOG */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-[36px] p-6 md:p-8 border-4 border-indigo-200 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-indigo-950 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-indigo-600" /> Create Custom Math Problem
            </DialogTitle>
            <CardDescription className="text-xs font-bold text-slate-500">
              Add a new math word problem for Class 1 / Year 5+ pupils to practice math operations.
            </CardDescription>
          </DialogHeader>

          {/* AI Generator Helper Box */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-3xl border border-indigo-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-800 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-indigo-600" /> ✨ AI Math Creator Helper
              </span>
              <Badge className="bg-indigo-200 text-indigo-900 font-bold text-[10px]">Gemini AI Powered</Badge>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Topic e.g. sharing candies, counting frogs, losing balloons"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="rounded-xl border-indigo-200 text-sm font-medium bg-white"
              />
              <Button
                type="button"
                onClick={handleAiGenerate}
                disabled={isAiGenerating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs whitespace-nowrap px-4"
              >
                {isAiGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Challenge"}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSaveProblem} className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-black text-indigo-900 uppercase">
                Word Problem Prompt *
              </Label>
              <Input
                required
                value={formPrompt}
                onChange={(e) => setFormPrompt(e.target.value)}
                placeholder="e.g. Ama has 12 balloons. She gives 5 balloons to Kofi. How many balloons does she have left?"
                className="rounded-2xl border-indigo-200 mt-1 font-semibold text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-black text-emerald-800 uppercase">Correct Answer *</Label>
                <Input
                  required
                  type="number"
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  placeholder="e.g. 7"
                  className="rounded-2xl border-emerald-300 mt-1 font-black text-emerald-950 bg-emerald-50/50"
                />
              </div>
            </div>

            {/* Wrong Options are automatically generated during publication */}

            <div className="flex justify-end gap-3 pt-4 border-t border-indigo-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-2xl font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl px-6"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Publish Math Challenge
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* TEACHER LIBRARY DIALOG */}
      <Dialog open={isLibraryOpen} onOpenChange={setIsLibraryOpen}>
        <DialogContent className="max-w-3xl bg-white rounded-[36px] p-6 md:p-8 border-4 border-indigo-200 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-indigo-950 flex items-center gap-2">
              <Library className="w-6 h-6 text-indigo-600" /> Custom Teacher Math Problems
            </DialogTitle>
            <CardDescription className="text-xs font-bold text-slate-500">
              View and manage math word problems published by teachers.
            </CardDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {!dbMathProblems || dbMathProblems.length === 0 ? (
              <div className="p-8 text-center bg-indigo-50 rounded-3xl border border-indigo-100">
                <Calculator className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
                <p className="font-black text-indigo-950 text-sm">No custom math word problems published yet.</p>
                <p className="text-xs text-indigo-600 mt-1">Use the "Add Word Problem" button to create custom challenges.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {dbMathProblems.map((p: any) => (
                  <div key={p.id} className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-indigo-200 text-indigo-900 font-bold text-[10px] uppercase">
                          Word Problem
                        </Badge>
                        <span className="text-[10px] font-bold text-slate-400">By {p.createdBy || 'Teacher'}</span>
                      </div>
                      <p className="font-extrabold text-slate-900 text-sm">"{p.prompt}"</p>
                      <p className="text-xs text-emerald-700 font-bold mt-1">Correct Answer: {p.ans}</p>
                    </div>

                    <Button
                      onClick={() => handleDeleteProblem(p.id)}
                      size="icon"
                      variant="ghost"
                      className="text-rose-500 hover:bg-rose-100 rounded-xl"
                      title="Delete Challenge"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- MAIN PAGE ---
export default function JuniorCampusPage() {
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');
  const { toast } = useToast(); 

  const [activeAgeTier, setActiveAgeTier] = useState<'ages2-3' | 'ages3-4' | 'ages4-5' | 'ages5+'>('ages2-3');
  const [activeTab, setActiveTab] = useState<string>('level_curriculum');

  const pageModules = useMemo(() => {
    return [
      { id: 'level_curriculum', name: 'Age Level Curriculum', icon: <Brain className="w-5 h-5"/>, color: 'text-amber-600 bg-amber-100' },
      ...(activeAgeTier === 'ages5+' ? [{ id: 'sentence_finisher', name: 'Sentence Finisher (Year 5+)', icon: <PenTool className="w-5 h-5"/>, color: 'text-purple-600 bg-purple-100' }] : []),
      { id: 'coach', name: 'Voice Coach', icon: <Mic className="w-5 h-5"/>, color: 'text-pink-600 bg-pink-100' },
      { id: 'phonics', name: 'Phonics Forest', icon: <Music className="w-5 h-5"/>, color: 'text-teal-600 bg-teal-100' },
      { id: 'abc', name: 'ABC Kingdom', icon: <Brain className="w-5 h-5"/>, color: 'text-green-600 bg-green-100' },
      { id: 'numbers', name: 'Number Garden', icon: <Hash className="w-5 h-5"/>, color: 'text-amber-600 bg-amber-100' },
      { id: 'math', name: 'Math Playground', icon: <Calculator className="w-5 h-5"/>, color: 'text-orange-600 bg-orange-100' },
      { id: 'stories', name: 'Story Spark', icon: <BookOpen className="w-5 h-5"/>, color: 'text-purple-600 bg-purple-100' },
      { id: 'science', name: 'Science World', icon: <Atom className="w-5 h-5"/>, color: 'text-blue-600 bg-blue-100' },
      { id: 'music', name: 'Music Corner', icon: <Lightbulb className="w-5 h-5"/>, color: 'text-violet-600 bg-violet-100' },
      { id: 'art', name: 'Art Studio', icon: <Palette className="w-5 h-5"/>, color: 'text-cyan-600 bg-cyan-100' },
      { id: 'rewards', name: 'Sticker Book', icon: <Trophy className="w-5 h-5"/>, color: 'text-yellow-600 bg-yellow-100' },
      ...(canEdit ? [{ id: 'dashboard', name: 'Dashboard', icon: <BarChart3 className="w-5 h-5"/>, color: 'text-indigo-600 bg-indigo-100' }] : []),
    ];
  }, [activeAgeTier, canEdit]);

  // Safely fallback when active tab gets dynamically hidden
  useEffect(() => {
    const isTabAvailable = pageModules.some(mod => mod.id === activeTab);
    if (!isTabAvailable) {
      setActiveTab('level_curriculum');
    }
  }, [activeAgeTier, pageModules, activeTab]);

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
              <p className="text-slate-700/80 font-bold text-lg mt-1">A magical space to learn, play, and bloom across early childhood levels!</p>
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

        {/* Structured Age Level Selector */}
        <JuniorAgeLevelSelector activeTier={activeAgeTier} onSelectTier={(tier) => setActiveAgeTier(tier)} />
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white/70 backdrop-blur-md p-3 rounded-[32px] shadow-lg border border-white/80 mb-8">
              <TabsList className="flex flex-wrap gap-2.5 bg-transparent p-0 h-auto justify-center w-full">
                  {pageModules.map(mod => (
                      <TabsTrigger 
                          key={mod.id}
                          value={mod.id} 
                          className={cn(
                            "rounded-2xl font-black flex flex-row items-center gap-2 text-xs py-2 px-3.5 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm border border-transparent flex-initial",
                            "data-[state=active]:bg-gradient-to-b data-[state=active]:shadow-md data-[state=active]:border-white/50 data-[state=active]:-translate-y-0.5",
                            mod.id === 'level_curriculum' && "data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white text-amber-600 hover:bg-amber-50/50",
                            mod.id === 'sentence_finisher' && "data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white text-purple-700 hover:bg-purple-50/50",
                            mod.id === 'coach' && "data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white text-pink-600 hover:bg-pink-50/50",
                            mod.id === 'phonics' && "data-[state=active]:from-teal-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white text-teal-600 hover:bg-teal-50/50",
                            mod.id === 'abc' && "data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white text-green-600 hover:bg-green-50/50",
                            mod.id === 'math' && "data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white text-orange-600 hover:bg-orange-50/50",
                            mod.id === 'stories' && "data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white text-purple-600 hover:bg-purple-50/50",
                            mod.id === 'science' && "data-[state=active]:from-blue-500 data-[state=active]:to-sky-500 data-[state=active]:text-white text-blue-600 hover:bg-blue-50/50",
                            mod.id === 'art' && "data-[state=active]:from-cyan-500 data-[state=active]:to-teal-400 data-[state=active]:text-white text-cyan-700 hover:bg-cyan-50/50",
                            mod.id === 'rewards' && "data-[state=active]:from-yellow-400 data-[state=active]:to-orange-400 data-[state=active]:text-white text-yellow-600 hover:bg-yellow-50/50",
                            mod.id === 'numbers' && "data-[state=active]:from-amber-500 data-[state=active]:to-orange-400 data-[state=active]:text-white text-amber-600 hover:bg-amber-50/50",
                            mod.id === 'music' && "data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-violet-600 hover:bg-violet-50/50",
                            mod.id === 'dashboard' && "data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-indigo-600 hover:bg-indigo-50/50"
                          )}
                      >
                          <div className="p-1 rounded-xl bg-white/20 shadow-inner flex-shrink-0">
                            {mod.icon}
                          </div>
                          <span className="font-extrabold tracking-wide whitespace-nowrap">{mod.name}</span>
                      </TabsTrigger>
                  ))}
              </TabsList>
            </div>
            
            {/* CONTENT AREAS */}
            <div className="min-h-[500px]">
                <TabsContent value="level_curriculum" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-amber-400">
                    <div className="mb-6 flex items-center justify-between border-b border-amber-100 pb-4">
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-amber-600">Active Curriculum Tier</span>
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                          {AGE_TIERS[activeAgeTier].iconEmoji} {AGE_TIERS[activeAgeTier].name}: {AGE_TIERS[activeAgeTier].subtitle}
                        </h2>
                      </div>
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                        {AGE_TIERS[activeAgeTier].recommendedGrade}
                      </span>
                    </div>

                    {/* DYNAMIC AGE TIER CONTENT */}
                    {activeAgeTier === 'ages2-3' && (
                      <div className="space-y-8">
                        <ToddlerAnimalSoundsQuiz />
                      </div>
                    )}

                    {activeAgeTier === 'ages3-4' && (
                      <div className="space-y-8">
                        <LetterDistinctionGame />
                        <div className="border-t border-slate-100 pt-6">
                          <PatternCompletionGame />
                        </div>
                      </div>
                    )}

                    {activeAgeTier === 'ages4-5' && (
                      <div className="space-y-8">
                        <CVCBlendingDrill />
                        <div className="border-t border-slate-100 pt-6">
                          <RhymeMatchingGame />
                        </div>
                      </div>
                    )}

                    {activeAgeTier === 'ages5+' && (
                      <div className="space-y-8">
                        <SentencePacingGame />
                        <div className="border-t border-slate-100 pt-6">
                          <StorySequencerGame />
                        </div>
                        <div className="border-t border-slate-100 pt-6">
                          <SentenceFinisherGame canEdit={canEdit} />
                        </div>
                        <div className="border-t border-slate-100 pt-6">
                          <Age5PlusMathMastery canEdit={canEdit} />
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="sentence_finisher" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-purple-500">
                    <SentenceFinisherGame canEdit={canEdit} isDedicatedTab={true} />
                  </div>
                </TabsContent>

                <TabsContent value="coach" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-pink-400">
                    <VoiceCoach canEdit={canEdit} activeAgeTier={activeAgeTier} />
                  </div>
                </TabsContent>
                <TabsContent value="phonics" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-teal-400">
                    <PhonicsForest canEdit={canEdit} activeAgeTier={activeAgeTier} />
                  </div>
                </TabsContent>
                <TabsContent value="abc" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-green-400">
                    <ABCKingdom canEdit={canEdit} activeAgeTier={activeAgeTier} />
                  </div>
                </TabsContent>
                <TabsContent value="math" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-orange-400 relative">
                    {activeAgeTier === 'ages5+' ? (
                      <Age5PlusMathMastery canEdit={canEdit} />
                    ) : (
                      <MathPlayground activeAgeTier={activeAgeTier} />
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="stories" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-purple-400">
                    <StorySpark canEdit={canEdit} activeAgeTier={activeAgeTier} />
                  </div>
                </TabsContent>
                <TabsContent value="science" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-blue-400">
                    <ScienceWorld canEdit={canEdit} activeAgeTier={activeAgeTier} />
                  </div>
                </TabsContent>
                <TabsContent value="art" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-cyan-500">
                    <ArtStudio canEdit={canEdit} activeAgeTier={activeAgeTier} />
                  </div>
                </TabsContent>
                <TabsContent value="rewards" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-yellow-400">
                    <StickerBook />
                  </div>
                </TabsContent>
                <TabsContent value="numbers" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-amber-400">
                    <NumberGarden activeAgeTier={activeAgeTier} />
                  </div>
                </TabsContent>
                <TabsContent value="music" className="mt-0 animate-in fade-in-50 duration-300">
                  <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-violet-400">
                    <MusicRhythmCorner />
                  </div>
                </TabsContent>
                {canEdit && (
                  <TabsContent value="dashboard" className="mt-0 animate-in fade-in-50 duration-300">
                    <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[40px] shadow-2xl border-4 border-white/90 border-b-[12px] border-b-indigo-400">
                      <TeacherDashboard />
                    </div>
                  </TabsContent>
                )}
            </div>
        </Tabs>
      </div>
    </div>
  );
}
