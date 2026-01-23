

'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where, increment, getDocs, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Palette, Trophy, Check, CheckCircle2, XCircle, Type, PlusCircle, PenSquare, FileText, Database, Eraser, PenTool
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateJuniorScience, generateWordDetails } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAuth } from 'firebase/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import StickerBook from './sticker-book';
import ArtStudio from './art-studio';

// --- HELPER: TEXT TO SPEECH ---
const speak = (text: string, rate = 0.9) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    window.speechSynthesis.speak(u);
};


// --- 1. VOICE COACH (THE SPEAKING ACADEMY) ---
function VoiceCoach({ canEdit, schoolId }: { canEdit: boolean, schoolId: string | null }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [challenge, setChallenge] = useState<any>(null);
    const [isListening, setIsListening] = useState(false);
    const [feedback, setFeedback] = useState({ text: "Tap the Mic and say the word!", color: "text-slate-600" });
    const [activeMode, setActiveMode] = useState<'word' | 'syllable' | 'fluency'>('word');
    
    // Teacher/Admin State
    const [newWord, setNewWord] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [viewMode, setViewMode] = useState<'practice' | 'library'>('practice');

    const phonicsQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'junior_phonics'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, 
    [firestore, schoolId]);
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
                const matchCount = targetSentence.split(' ').filter(word => spoken.includes(word.replace(/[.,!]/g, ''))).length;
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
            <div className="flex justify-between items-center bg-white p-2 rounded-2xl shadow-sm border border-pink-100">
                <div className="flex gap-1">
                    <Button size="sm" variant={activeMode === 'word' ? 'default' : 'ghost'} onClick={() => setActiveMode('word')} className="rounded-xl">Word</Button>
                    <Button size="sm" variant={activeMode === 'syllable' ? 'default' : 'ghost'} onClick={() => setActiveMode('syllable')} className="rounded-xl">Syllables</Button>
                    <Button size="sm" variant={activeMode === 'fluency' ? 'default' : 'ghost'} onClick={() => setActiveMode('fluency')} className="rounded-xl">Fluency</Button>
                </div>
                {canEdit && (
                    <Button size="sm" variant="outline" onClick={() => setViewMode(viewMode === 'practice' ? 'library' : 'practice')} className="border-pink-200 text-pink-600">
                        {viewMode === 'practice' ? <Library className="w-4 h-4 mr-2"/> : <Mic className="w-4 h-4 mr-2"/>}
                        {viewMode === 'practice' ? 'Manage' : 'Back'}
                    </Button>
                )}
            </div>

            {viewMode === 'practice' && challenge && (
                <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in">
                    
                    {/* Visual Area */}
                    <div className="relative">
                        <div className="text-9xl mb-4 hover:scale-110 transition-transform cursor-pointer drop-shadow-2xl" onClick={() => speak(challenge.word)}>
                            {challenge.emoji}
                        </div>
                        <div className="absolute -top-4 -right-4 bg-yellow-400 text-white p-2 rounded-full animate-bounce">
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                    </div>

                    {/* Word Display Logic based on Mode */}
                    <div className="space-y-2">
                        {activeMode === 'syllable' ? (
                            <div className="flex gap-4 justify-center">
                                {getSyllables(challenge.word).map((syl: string, i: number) => (
                                    <span key={i} className="text-5xl font-black text-pink-600 bg-pink-50 px-4 py-2 rounded-2xl border-b-4 border-pink-200">
                                        {syl.toLowerCase()}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <h2 className="text-7xl font-black text-slate-800 tracking-tight capitalize">{challenge.word}</h2>
                        )}
                        <p className="text-2xl text-slate-400 font-mono">/{challenge.phonetic}/</p>
                    </div>

                    {/* Context/Fluency Area */}
                    <div 
                        className={`p-6 rounded-[32px] border-4 transition-all max-w-lg cursor-pointer ${activeMode === 'fluency' ? 'bg-indigo-50 border-indigo-200 scale-105 shadow-lg' : 'bg-slate-50 border-slate-100 opacity-60'}`}
                        onClick={() => speak(challenge.sentence)}
                    >
                        <p className={`text-xl font-bold ${activeMode === 'fluency' ? 'text-indigo-700' : 'text-slate-500'}`}>
                            "{challenge.sentence}"
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-2 text-xs font-black uppercase opacity-60">
                            <Volume2 className="w-4 h-4"/> Listen to full sentence
                        </div>
                    </div>

                    {/* Mic Interaction */}
                    <div className="flex flex-col items-center gap-6">
                         <button 
                            onClick={startListening}
                            disabled={isListening}
                            className={`h-32 w-32 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 ${isListening ? 'bg-red-500 animate-pulse ring-8 ring-red-100' : 'bg-gradient-to-tr from-pink-500 to-rose-500 ring-8 ring-pink-50'}`}
                        >
                            {isListening ? <div className="flex gap-1">{[1,2,3].map(i => <div key={i} className="w-2 h-8 bg-white rounded-full animate-bounce" style={{animationDelay: `${i*0.1}s`}}></div>)}</div> : <Mic className="h-16 w-16 text-white" />}
                        </button>
                        
                        <div className={`px-8 py-4 rounded-3xl font-black text-xl shadow-sm border-2 ${feedback.color} bg-white transition-colors`}>
                            {feedback.text}
                        </div>
                    </div>

                    <Button onClick={pickRandomWord} variant="ghost" className="text-slate-400 hover:text-slate-600 font-bold">
                        Try Another Word <ArrowRight className="ml-2 h-4 w-4"/>
                    </Button>
                </div>
            )}

            {viewMode === 'library' && canEdit && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-pink-100">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-pink-600"><Wand2 className="w-5 h-5"/> AI Curriculum Generator</h3>
                        <p className="text-sm text-slate-500 mb-4">Add a word and the AI will generate the phonetics, a junior-friendly sentence, and an emoji!</p>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Enter word (e.g. Caterpillar)" 
                                value={newWord} 
                                onChange={e => setNewWord(e.target.value)}
                                className="text-lg h-12 rounded-xl"
                            />
                            <Button onClick={async () => {
                                if (!firestore || !schoolId) return;
                                setIsGenerating(true);
                                const res = await generateWordDetails(newWord);
                                if (res.success && res.data) {
                                    await addDoc(collection(firestore, 'junior_phonics'), { ...res.data, createdAt: serverTimestamp(), schoolId });
                                    setNewWord("");
                                    forceRefetch();
                                    toast({ title: "Word Added!" });
                                }
                                setIsGenerating(false);
                            }} disabled={isGenerating || !newWord} className="bg-pink-600 h-12 px-8 rounded-xl">
                                {isGenerating ? <Loader2 className="animate-spin"/> : "Add Word"}
                            </Button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {wordLibrary?.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-white border-2 border-slate-50 rounded-2xl hover:border-pink-200 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{item.emoji}</span>
                                    <div>
                                        <p className="font-black text-slate-700 leading-tight">{item.word}</p>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{item.phonetic}</p>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-opacity" onClick={async () => {
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
function PhonicsForest() {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<'library' | 'blender' | 'families' | 'game'>('library');
    
    // Comprehensive Sound Categories (SSP Structured)
    const soundGroups = [
        { name: "Short Vowels", color: "bg-rose-100 text-rose-600 border-rose-200", sounds: ["a", "e", "i", "o", "u"], example: ["apple", "egg", "ink", "octopus", "up"] },
        { name: "Digraphs (2 letters, 1 sound)", color: "bg-teal-100 text-teal-600 border-teal-200", sounds: ["ch", "sh", "th", "ng", "qu", "wh"], example: ["chip", "ship", "thin", "ring", "queen", "whale"] },
        { name: "Long Vowels", color: "bg-purple-100 text-purple-600 border-purple-200", sounds: ["ai", "ee", "igh", "oa", "oo"], example: ["rain", "tree", "light", "boat", "moon"] },
        { name: "Trigraphs (3 letters, 1 sound)", color: "bg-orange-100 text-orange-600 border-orange-200", sounds: ["ear", "air", "ure", "igh"], example: ["near", "fair", "pure", "night"] },
        { name: "R-Controlled", color: "bg-amber-100 text-amber-600 border-amber-200", sounds: ["ar", "or", "ur", "er", "ir"], example: ["car", "fork", "surf", "her", "bird"] },
    ];

    // Blending Station State
    const [blendingWord, setBlendingWord] = useState(["c", "a", "t"]);
    
    // Sound Match Game State
    const [gameTarget, setGameTarget] = useState<any>(null);
    const [gameOptions, setGameOptions] = useState<string[]>([]);
    
    const startNewGame = useCallback(() => {
        const allSounds = soundGroups.flatMap(g => g.sounds);
        const targetSound = allSounds[Math.floor(Math.random() * allSounds.length)];
        
        let shuffledOptions = allSounds.filter(s => s !== targetSound).sort(() => 0.5 - Math.random()).slice(0, 3);
        shuffledOptions.push(targetSound);
        
        setGameTarget(targetSound);
        setGameOptions(shuffledOptions.sort(() => Math.random() - 0.5)); // Final shuffle
        speak(`Find the sound: ${targetSound}`);
    }, [soundGroups]);

    return (
        <div className="space-y-6">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit mx-auto">
                <Button variant={activeTab === 'library' ? 'default' : 'ghost'} onClick={() => setActiveTab('library')} className="rounded-xl">Library</Button>
                <Button variant={activeTab === 'blender' ? 'default' : 'ghost'} onClick={() => setActiveTab('blender')} className="rounded-xl">Blending</Button>
                <Button variant={activeTab === 'families' ? 'default' : 'ghost'} onClick={() => setActiveTab('families')} className="rounded-xl">Rhymes</Button>
                <Button variant={activeTab === 'game' ? 'default' : 'ghost'} onClick={() => {setActiveTab('game'); startNewGame();}} className="rounded-xl">Game</Button>
            </div>

            {/* PILLAR 1: THE SOUND LIBRARY */}
            {activeTab === 'library' && (
                <div className="space-y-8 animate-in fade-in">
                    {soundGroups.map((group) => (
                        <div key={group.name} className="space-y-3">
                            <h3 className="font-bold text-slate-500 uppercase text-xs tracking-widest ml-2">{group.name}</h3>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {group.sounds.map((sound, idx) => (
                                    <button 
                                        key={sound} 
                                        onClick={() => {
                                            speak(sound);
                                            toast({ title: `"${sound}" as in...`, description: group.example[idx].toUpperCase() });
                                        }} 
                                        className={`aspect-square rounded-3xl border-b-8 font-black text-3xl shadow-sm hover:-translate-y-1 transition-all flex flex-col items-center justify-center ${group.color} bg-white`}
                                    >
                                        {sound}
                                        <span className="text-[10px] mt-1 opacity-60">{group.example[idx]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PILLAR 2: BLENDING STATION */}
            {activeTab === 'blender' && (
                <div className="bg-gradient-to-br from-teal-50 to-white p-8 rounded-[40px] border-4 border-teal-100 text-center space-y-8 animate-in zoom-in">
                    <h2 className="text-2xl font-black text-teal-800">Blending Station 🚂</h2>
                    <p className="text-teal-600 font-medium">Tap each sound, then pull the lever to read!</p>
                    
                    <div className="flex justify-center gap-4">
                        {blendingWord.map((letter, i) => (
                            <button 
                                key={i}
                                onClick={() => speak(letter)}
                                className="w-24 h-32 bg-white rounded-3xl shadow-xl border-b-[12px] border-teal-200 text-5xl font-black text-teal-600 hover:scale-105 active:translate-y-2 transition-all flex items-center justify-center"
                            >
                                {letter}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <Button 
                            onClick={() => {
                                speak(blendingWord.join(''), 0.7);
                                confetti({ colors: ['#2dd4bf'], particleCount: 50 });
                            }}
                            className="bg-teal-500 hover:bg-teal-600 h-16 px-12 rounded-full text-2xl font-black shadow-lg"
                        >
                            Read Word <ArrowRight className="ml-2" />
                        </Button>
                        <div className="flex gap-2">
                            {["cat", "dog", "ship", "fish", "rain"].map(w => (
                                <button key={w} onClick={() => setBlendingWord(w.split(''))} className="px-4 py-2 bg-white border rounded-full text-sm font-bold text-teal-700 hover:bg-teal-50">
                                    {w}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* PILLAR 3: WORD FAMILIES (RHYMES) */}
            {activeTab === 'families' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4">
                    {[
                        { family: "-at", words: ["cat", "hat", "mat", "sat"] },
                        { family: "-ig", words: ["big", "dig", "pig", "wig"] },
                        { family: "-op", words: ["hop", "mop", "pop", "top"] },
                        { family: "-un", words: ["bun", "fun", "run", "sun"] }
                    ].map(item => (
                        <div key={item.family} className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm text-center">
                            <div className="bg-indigo-100 text-indigo-600 w-12 h-12 flex items-center justify-center rounded-2xl mx-auto mb-4 font-black text-xl">
                                {item.family}
                            </div>
                            <div className="space-y-2">
                                {item.words.map(w => (
                                    <button key={w} onClick={() => speak(w)} className="block w-full py-1 text-slate-600 font-bold hover:text-indigo-500 capitalize">
                                        {w}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PILLAR 4: SOUND MATCH GAME */}
            {activeTab === 'game' && gameTarget && (
                <div className="text-center py-12 space-y-8 animate-in zoom-in">
                    <div className="space-y-2">
                        <h3 className="text-4xl font-black text-slate-800">Which one says...</h3>
                        <div className="h-16 flex items-center justify-center">
                            <Button size="lg" variant="outline" onClick={() => speak(gameTarget)} className="rounded-full border-2 border-indigo-200">
                                <Volume2 className="mr-2 h-6 w-6 text-indigo-500" /> Hear it Again
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
                                className="h-24 bg-white border-b-8 border-slate-100 rounded-3xl text-5xl font-black text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 transition-all shadow-md"
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
function ABCKingdom() {
    const [activeTab, setActiveTab] = useState<'explorer' | 'tracing' | 'matcher'>('explorer');
    const [selectedLetter, setSelectedLetter] = useState('A');
    const [caseMode, setCaseMode] = useState<'upper' | 'lower' | 'both'>('upper');
    
    // Tracing Canvas Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#4f46e5');
    const [tool, setTool] = useState<'brush' | 'bucket' | 'stamp'>('brush');

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    const dict: Record<string, { word: string, emoji: string, phonic: string }> = {
        A: { word: "Apple", emoji: "🍎", phonic: "ah" },
        B: { word: "Ball", emoji: "⚽", phonic: "buh" },
        C: { word: "Cat", emoji: "🐱", phonic: "cuh" },
        D: { word: "Dog", emoji: "🐶", phonic: "duh" },
        E: { word: "Egg", emoji: "🥚", phonic: "eh" },
        F: { word: "Fish", emoji: "🐟", phonic: "fuh" },
        G: { word: "Goat", emoji: "🐐", phonic: "guh" },
        H: { word: "Hat", emoji: "👒", phonic: "huh" },
        I: { word: "Igloo", emoji: "❄️", phonic: "ih" },
        J: { word: "Jam", emoji: "🍓", phonic: "juh" },
        K: { word: "Kite", emoji: "🪁", phonic: "kuh" },
        L: { word: "Lion", emoji: "🦁", phonic: "luh" },
        M: { word: "Moon", emoji: "🌙", phonic: "muh" },
        N: { word: "Net", emoji: "🕸️", phonic: "nuh" },
        O: { word: "Octopus", emoji: "🐙", phonic: "oh" },
        P: { word: "Pig", emoji: "🐷", phonic: "puh" },
        Q: { word: "Queen", emoji: "👑", phonic: "quuh" },
        R: { word: "Rabbit", emoji: "🐰", phonic: "ruh" },
        S: { word: "Sun", emoji: "☀️", phonic: "suh" },
        T: { word: "Tiger", emoji: "🐯", phonic: "tuh" },
        U: { word: "Umbrella", emoji: "☔", phonic: "uh" },
        V: { word: "Van", emoji: "🚐", phonic: "vuh" },
        W: { word: "Watch", emoji: "⌚", phonic: "wuh" },
        X: { word: "Xylophone", emoji: "🎹", phonic: "ks" },
        Y: { word: "Yo-yo", emoji: "🪀", phonic: "yuh" },
        Z: { word: "Zebra", emoji: "🦓", phonic: "zuh" }
    };

    const handleLetterClick = (letter: string) => {
        setSelectedLetter(letter);
        if (activeTab === 'explorer') {
            const data = dict[letter];
            speak(letter); // Say Letter Name
            setTimeout(() => speak(`${data.phonic}, as in, ${data.word}`), 800);
        }
    };

    return (
        <div className="space-y-8">
            {/* 1. TOP NAVIGATION */}
            <div className="flex gap-2 p-1 bg-green-50 rounded-2xl w-fit mx-auto border border-green-100">
                <Button variant={activeTab === 'explorer' ? 'default' : 'ghost'} onClick={() => setActiveTab('explorer')} className="rounded-xl font-bold">Explorer</Button>
                <Button variant={activeTab === 'tracing' ? 'default' : 'ghost'} onClick={() => setActiveTab('tracing')} className="rounded-xl font-bold">Tracing Lab</Button>
                <Button variant={activeTab === 'matcher' ? 'default' : 'ghost'} onClick={() => setActiveTab('matcher')} className="rounded-xl font-bold">Matcher Game</Button>
            </div>

            <div className="grid lg:grid-cols-5 gap-8">
                {/* 2. LETTER GRID (SIDEBAR ON DESKTOP) */}
                <div className="lg:col-span-2 order-2 lg:order-1">
                    <div className="flex justify-center gap-2 mb-4">
                        <Button size="sm" variant={caseMode === 'upper' ? 'secondary' : 'outline'} onClick={() => setCaseMode('upper')}>ABC</Button>
                        <Button size="sm" variant={caseMode === 'lower' ? 'secondary' : 'outline'} onClick={() => setCaseMode('lower')}>abc</Button>
                        <Button size="sm" variant={caseMode === 'both' ? 'secondary' : 'outline'} onClick={() => setCaseMode('both')}>Aa</Button>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-2">
                        {alphabet.map(letter => (
                            <button 
                                key={letter}
                                onClick={() => handleLetterClick(letter)}
                                className={`aspect-square rounded-2xl font-black text-xl transition-all border-b-4 ${
                                    selectedLetter === letter 
                                    ? 'bg-green-500 text-white border-green-700 scale-105 shadow-lg' 
                                    : 'bg-white text-slate-400 border-slate-100 hover:bg-green-50'
                                }`}
                            >
                                {caseMode === 'upper' ? letter : caseMode === 'lower' ? letter.toLowerCase() : `${letter}${letter.toLowerCase()}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. INTERACTIVE STAGE */}
                <div className="lg:col-span-3 order-1 lg:order-2">
                    <Card className="rounded-[40px] border-4 border-green-100 shadow-xl overflow-hidden h-full">
                        <CardContent className="p-0">
                            
                            {/* EXPLORER MODE */}
                            {activeTab === 'explorer' && (
                                <div className="p-8 text-center space-y-8 animate-in zoom-in">
                                    <div className="flex justify-center gap-4 items-end">
                                        <h1 className="text-[180px] font-black text-green-600 leading-none">{selectedLetter}</h1>
                                        <h2 className="text-[100px] font-black text-green-300 leading-none">{selectedLetter.toLowerCase()}</h2>
                                    </div>
                                    <div className="bg-green-50 p-8 rounded-[40px] border-2 border-dashed border-green-200">
                                        <div className="text-9xl mb-4">{dict[selectedLetter].emoji}</div>
                                        <h3 className="text-5xl font-black text-slate-800">{dict[selectedLetter].word}</h3>
                                        <p className="text-2xl font-bold text-green-500 mt-2 italic">Sound: "{dict[selectedLetter].phonic}"</p>
                                    </div>
                                    <Button onClick={() => handleLetterClick(selectedLetter)} className="h-16 px-12 rounded-full text-xl bg-green-600 hover:bg-green-700">
                                        <Volume2 className="mr-3" /> Listen Again
                                    </Button>
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
function MathPlayground({ schoolId }: { schoolId: string | null }) {
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

      if ((streak + 1) % 5 === 0 && user && firestore && schoolId) {
          const sticker = '🎓';
          await addDoc(collection(firestore, 'junior_stickers'), {
              userId: user.uid,
              emoji: sticker,
              name: `${mode.toUpperCase()} Master`,
              category: 'math',
              earnedAt: serverTimestamp(),
              schoolId: schoolId,
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
      <div className="flex gap-2 mb-4 bg-slate-100 p-2 rounded-3xl w-full overflow-x-auto no-scrollbar">
          {(['add', 'sub', 'mul', 'div', 'compare', 'patterns', 'shapes', 'time'] as MathMode[]).map((m) => (
            <Button 
                key={m}
                variant={mode === m ? 'default' : 'ghost'} 
                onClick={() => setMode(m)} 
                className={`rounded-2xl capitalize font-bold min-w-[100px] ${mode === m ? 'bg-orange-500' : 'text-slate-500'}`}
            >
                {m === 'mul' ? '× Multi' : m === 'div' ? '÷ Divide' : m}
            </Button>
          ))}
      </div>

      <Card className="w-full max-w-md bg-white border-4 border-orange-100 shadow-xl rounded-[40px] overflow-hidden">
        <CardContent className="p-8 flex flex-col items-center min-h-[300px] justify-center">
            
            {/* MULTIPLICATION: Array Grid Visual */}
            {mode === 'mul' && (
                <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `repeat(${question.b}, minmax(0, 1fr))` }}>
                    {Array.from({ length: question.a * question.b }).map((_, i) => (
                        <span key={i} className="text-3xl animate-in zoom-in">{question.icon}</span>
                    ))}
                </div>
            )}

            {(mode === 'add' || mode === 'sub') && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {Array.from({ length: question.a }).map((_, i) => <span key={i} className="text-3xl">{question.icon}</span>)}
                    <span className="text-3xl font-black text-orange-300 mx-2">{mode === 'add' ? '+' : '-'}</span>
                    {Array.from({ length: question.b }).map((_, i) => <span key={i} className="text-3xl opacity-50">{question.icon}</span>)}
                </div>
            )}
            
            <div className="text-center">
                <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-2">{question.displayPrompt || 'Solve'}</p>
                 <div className="text-5xl font-black text-slate-800">
                    {(mode === 'add' || mode === 'sub') && (
                        <div className="flex items-center gap-3">
                            <span>{question.a}</span>
                            <span className="text-orange-400">{mode === 'add' ? '+' : '-'}</span>
                            <span>{question.b}</span>
                            <span className="text-slate-300">=</span>
                            <span className="text-orange-500">?</span>
                        </div>
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
            className="h-20 bg-white border-b-8 border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-orange-600 text-2xl md:text-3xl font-black rounded-3xl transition-all active:translate-y-2 active:border-b-0"
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

      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border shadow-sm">
          <Star className="text-yellow-400 fill-yellow-400 w-5 h-5" />
          <span className="font-bold text-slate-600">Streak: {streak}</span>
      </div>
    </div>
  );
}

// --- 5. STORY SPARK (Story Time) ---
function StorySpark({ canEdit, schoolId }: { canEdit: boolean, schoolId: string | null }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    
    // State
    const [activeStory, setActiveStory] = useState<any>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<boolean[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [topic, setTopic] = useState('');

    // Data Fetching
    const storiesQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'junior_stories'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, 
    [firestore, schoolId]);
    const { data: storyLibrary, isLoading, forceRefetch } = useCollection<any>(storiesQuery);

    // Set initial story
    useEffect(() => {
        if (storyLibrary && storyLibrary.length > 0 && !activeStory) {
            setActiveStory(storyLibrary[0]);
        }
    }, [storyLibrary, activeStory]);

    const handleGenerate = async () => {
        if (!topic.trim() || !schoolId) return;
        setIsGenerating(true);
        toast({ title: "AI is writing a story..." });
        try {
            const res = await generateJuniorStory(topic, 100);
            if (res.success && res.data) {
                await addDoc(collection(firestore, 'junior_stories'), {
                    ...res.data,
                    topic: topic,
                    schoolId: schoolId,
                    createdBy: user?.uid,
                    createdAt: serverTimestamp()
                });
                toast({ title: "New Story Created!", description: "It's now in your library." });
                forceRefetch();
                setTopic('');
            } else {
                throw new Error(res.error || "Failed to generate story");
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsGenerating(false);
        }
    };

    const checkAnswers = () => {
        if (!activeStory) return;
        const newFeedback = activeStory.questions.map((q: any, i: number) => {
            return (answers[i] || '').toLowerCase().trim() === q.answer.toLowerCase().trim();
        });
        setFeedback(newFeedback);
        const correctCount = newFeedback.filter(f => f).length;
        if (correctCount === activeStory.questions.length) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            speak("All correct! Wonderful reading.");
        } else {
            speak(`Good try! Check the green checks for correct answers.`);
        }
    };

    const selectStory = (story: any) => {
        setActiveStory(story);
        setAnswers([]);
        setFeedback([]);
    };
    
    const handleDelete = async (id: string) => {
        if (!firestore) return;
        if (confirm("Delete this story?")) {
            await deleteDoc(doc(firestore, 'junior_stories', id));
            forceRefetch();
            if (activeStory?.id === id) setActiveStory(null);
            toast({ title: "Story Deleted" });
        }
    };

    return (
        <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-4">
                {canEdit && (
                    <Card className="bg-purple-50 border-purple-200">
                        <CardHeader>
                            <CardTitle className="text-purple-700 text-base">AI Story Generator</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Story about a..." />
                            <Button onClick={handleGenerate} disabled={isGenerating || !topic} className="w-full bg-purple-600">
                                {isGenerating ? <Loader2 className="animate-spin" /> : "Write Story"}
                            </Button>
                        </CardContent>
                    </Card>
                )}
                <Card className="max-h-[70vh] flex flex-col">
                    <CardHeader className="py-3"><CardTitle className="text-md">Story Library</CardTitle></CardHeader>
                    <CardContent className="p-0 flex-1 min-h-0">
                        <ScrollArea className="h-full">
                            <div className="p-2 space-y-1">
                                {isLoading && <div className="text-center p-4"><Loader2 className="animate-spin"/></div>}
                                {storyLibrary?.map((story: any) => (
                                    <button 
                                        key={story.id}
                                        onClick={() => selectStory(story)}
                                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors group relative ${activeStory?.id === story.id ? 'bg-purple-100' : 'hover:bg-slate-50'}`}
                                    >
                                        <span className="text-2xl">{story.emojiIcon}</span>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-bold text-sm text-slate-800 truncate">{story.title}</p>
                                            <p className="text-xs text-slate-400">{story.topic}</p>
                                        </div>
                                        {canEdit && <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 text-red-400" onClick={(e) => {e.stopPropagation(); handleDelete(story.id);}}><Trash2 className="w-4 h-4"/></Button>}
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-3">
                {activeStory ? (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="text-8xl">{activeStory.emojiIcon}</div>
                            <h2 className="text-4xl font-black text-slate-800">{activeStory.title}</h2>
                        </div>
                        <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-lg border max-h-[40vh] overflow-y-auto">
                            <p className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap font-serif">{activeStory.content}</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg">Comprehension Check</h3>
                            {activeStory.questions.map((q: any, i: number) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{q.question}</p>
                                        <Input 
                                            value={answers[i] || ''}
                                            onChange={e => { const newAns = [...answers]; newAns[i] = e.target.value; setAnswers(newAns); }}
                                            disabled={feedback.length > 0}
                                        />
                                    </div>
                                    {feedback.length > 0 && (
                                        feedback[i] ? <CheckCircle2 className="text-green-500"/> : <XCircle className="text-red-500"/>
                                    )}
                                </div>
                            ))}
                            <Button onClick={checkAnswers} disabled={feedback.length > 0} className="w-full">Check Answers</Button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-center text-slate-400">Select a story to read</div>
                )}
            </div>
        </div>
    );
}

// --- 6. SCIENCE WORLD (FIXED: Journal & Matter Lab) ---
function ScienceWorld({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    
    const [activeTab, setActiveTab] = useState<'lab' | 'sorter' | 'experiment' | 'library'>('lab');
    
    // --- 1. DATA FETCHING (Scoped to School) ---
    
    // Sorter Items
    const sorterQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'junior_sorter_items'), where('schoolId', '==', schoolId), orderBy('createdAt', 'asc')) : null, 
    [firestore, schoolId]);
    const { data: dbSorterItems, forceRefetch: refetchSorter } = useCollection<any>(sorterQuery);
    
    // Matter Lab Materials
    const materialsQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'junior_science_materials'), where('schoolId', '==', schoolId), orderBy('createdAt', 'asc')) : null, 
    [firestore, schoolId]);
    const { data: dbMaterials, forceRefetch: refetchMaterials } = useCollection<any>(materialsQuery);

    // Science Journal
    const scienceQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'junior_science'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, 
    [firestore, schoolId]);
    const { data: savedScience, forceRefetch: refetchScience } = useCollection<any>(scienceQuery);
    
    // --- 2. GAME STATES ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const [newItem, setNewItem] = useState({ name: '', emoji: '', type: 'living' });
    const [temp, setTemp] = useState(20);
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
    const [showAddMatForm, setShowAddMatForm] = useState(false);
    const [topic, setTopic] = useState(''); 
    const [fact, setFact] = useState<any>(null); 
    const [loading, setLoading] = useState(false);
    const [sorterFeedback, setSorterFeedback] = useState("");


    // --- 3. NEW MATERIAL FORM STATE ---
    const [newMat, setNewMat] = useState({
        name: '',
        solid: { temp: -100, emoji: '🧊', label: 'Solid', desc: 'Frozen tight!' },
        liquid: { temp: 1, emoji: '💧', label: 'Liquid', desc: 'Flowing around!' },
        gas: { temp: 100, emoji: '💨', label: 'Gas', desc: 'Flying fast!' }
    });

    // Select the first material automatically when data loads
    useEffect(() => {
        if (dbMaterials && dbMaterials.length > 0 && !selectedMaterial) {
            setSelectedMaterial(dbMaterials[0]);
        }
    }, [dbMaterials, selectedMaterial]);

    // --- 4. MATTER LAB LOGIC ---
    const handleSaveMaterial = async () => {
        if (!newMat.name || !firestore || !schoolId) return;
        const statesArray = [
            { ...newMat.solid }, 
            { ...newMat.liquid }, 
            { ...newMat.gas }
        ];

        await addDoc(collection(firestore, 'junior_science_materials'), {
            name: newMat.name,
            states: statesArray,
            schoolId: schoolId, // CRITICAL FIX
            createdAt: serverTimestamp()
        });

        setShowAddMatForm(false);
        setNewMat({ name: '', solid: { temp: -100, emoji: '🧊', label: 'Solid', desc: 'Frozen tight!' }, liquid: { temp: 1, emoji: '💧', label: 'Liquid', desc: 'Flowing around!' }, gas: { temp: 100, emoji: '💨', label: 'Gas', desc: 'Flying fast!' } });
        if(refetchMaterials) refetchMaterials();
        toast({ title: "Material Created!" });
    };

    const getCurrentState = () => {
        if (!selectedMaterial) return { emoji: '🔍', label: 'Pick a Material', desc: 'Select one from the list above!' };
        // Logic: Find state matching temperature
        const state = [...selectedMaterial.states].sort((a:any,b:any) => b.temp - a.temp).find((s:any) => temp >= s.temp);
        return state || selectedMaterial.states[0];
    };

    // --- 5. DISCOVERY LAB LOGIC ---
    const handleGenerate = async () => { 
        setLoading(true); 
        try {
            const res = await generateJuniorScience(topic); 
            if(res.success && res.data) setFact(res.data);
            else toast({ variant: "destructive", title: "Error", description: res.error || "AI failed." });
        } catch(e: any) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSave = async () => { 
        if(!user || !fact || !firestore || !schoolId) return; 
        await addDoc(collection(firestore,'junior_science'), {
            ...fact,
            createdAt: serverTimestamp(),
            createdBy: user.uid,
            schoolId: schoolId // CRITICAL FIX
        }); 
        setFact(null); 
        if(refetchScience) refetchScience(); 
        toast({title: "Discovery Saved!", description: "Check Journal Tab"});
        setActiveTab('library');
    };
    
    const handleSaveSorterItem = async () => {
        if (!newItem.name || !newItem.emoji || !schoolId) return;
        await addDoc(collection(firestore, 'junior_sorter_items'), { ...newItem, schoolId: schoolId, createdAt: serverTimestamp() });
        setNewItem({ name: '', emoji: '', type: 'living' });
        if (refetchSorter) refetchSorter();
        toast({ title: 'Item Added!'});
    };
    
    const handleDrop = (type: 'living' | 'non-living', item: any) => {
        if (item.type === type) {
            setSorterFeedback("Correct! 🎉");
            confetti({ particleCount: 50, spread: 30, origin: { x: type === 'living' ? 0.25 : 0.75, y: 0.7 }});
            setCurrentIndex(i => (i + 1) % (dbSorterItems?.length || 1));
        } else {
            setSorterFeedback("Oops, try again! 🤔");
        }
        setTimeout(() => setSorterFeedback(""), 1500);
    };

    const handleDeleteDiscovery = async (id: string) => {
        if (!firestore) return;
        if(confirm("Delete this discovery?")) {
            await deleteDoc(doc(firestore, 'junior_science', id));
            if(refetchScience) refetchScience();
            toast({ title: "Deleted" });
        }
    };
    return (
        <div className="space-y-8">
            <div className="flex gap-2 p-1 bg-blue-50 rounded-2xl w-fit mx-auto border border-blue-100">
                <Button variant={activeTab === 'lab' ? 'default' : 'ghost'} onClick={() => setActiveTab('lab')}>Discovery</Button>
                <Button variant={activeTab === 'sorter' ? 'default' : 'ghost'} onClick={() => setActiveTab('sorter')}>Sorter</Button>
                <Button variant={activeTab === 'experiment' ? 'default' : 'ghost'} onClick={() => setActiveTab('experiment')}>Matter Lab</Button>
                <Button variant={activeTab === 'library' ? 'default' : 'ghost'} onClick={() => setActiveTab('library')}>Journal</Button>
            </div>

            {/* Discovery Lab Tab */}
            {activeTab === 'lab' && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                        <Input 
                            value={topic} 
                            onChange={(e) => setTopic(e.target.value)} 
                            placeholder="What are you curious about?" 
                            className="h-14 text-lg rounded-2xl" 
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <Button onClick={handleGenerate} disabled={loading || !topic} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg font-bold rounded-xl">
                            {loading ? <Loader2 className="animate-spin" /> : <><Sparkles className="mr-2"/> Discover</>}
                        </Button>
                    </div>
                     {fact && (
                        <Card className="animate-in fade-in zoom-in-95 border-blue-200">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-2xl text-blue-800">
                                    <span className="text-4xl">{fact.emojiIcon}</span> {fact.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xl text-slate-700 leading-relaxed font-medium">{fact.fact}</p>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSave} className="w-full">
                                    <Save className="mr-2"/> Save to my Journal
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            )}

            {/* Sorter Tab */}
            {activeTab === 'sorter' && (
                 <div className="space-y-6">
                    <div className="text-center p-4 rounded-xl bg-white border shadow-sm">
                        <h3 className="text-2xl font-black text-slate-800">Living or Non-Living?</h3>
                        <p className="text-slate-500">Drag the item to the correct box!</p>
                    </div>

                    <div className="h-40 flex items-center justify-center">
                        {dbSorterItems && dbSorterItems.length > 0 && (
                            <div className="draggable text-8xl cursor-grab active:cursor-grabbing" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify(dbSorterItems[currentIndex]))}>
                                {dbSorterItems[currentIndex].emoji}
                            </div>
                        )}
                    </div>
                    
                    <div className="text-center h-10 font-bold text-2xl animate-in zoom-in">
                        {sorterFeedback}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="droppable h-48 rounded-2xl bg-green-50 border-4 border-dashed border-green-200 flex flex-col items-center justify-center" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop('living', JSON.parse(e.dataTransfer.getData('text/plain')))}>
                           <span className="text-5xl">🌳</span> <span className="font-bold text-green-700 mt-2">Living</span>
                        </div>
                        <div className="droppable h-48 rounded-2xl bg-slate-100 border-4 border-dashed border-slate-200 flex flex-col items-center justify-center" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop('non-living', JSON.parse(e.dataTransfer.getData('text/plain')))}>
                             <span className="text-5xl">🪨</span> <span className="font-bold text-slate-600 mt-2">Non-Living</span>
                        </div>
                    </div>
                </div>
            )}

            {/* MATTER LAB TAB */}
            {activeTab === 'experiment' && (
                <div className="space-y-8 animate-in zoom-in">
                    <div className="text-center space-y-4">
                        <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Science Laboratory</p>
                        
                        <div className="flex flex-wrap gap-2 justify-center">
                            {(!dbMaterials || dbMaterials.length === 0) && (
                                <p className="text-sm text-slate-400">No materials found. Add one to start!</p>
                            )}
                            {dbMaterials?.map((m: any) => (
                                <Button 
                                    key={m.id} 
                                    variant={selectedMaterial?.id === m.id ? 'default' : 'outline'} 
                                    onClick={() => setSelectedMaterial(m)}
                                    className={`rounded-full px-6 font-bold ${selectedMaterial?.id === m.id ? 'bg-cyan-600' : 'border-cyan-200 text-cyan-700'}`}
                                >
                                    {m.name}
                                </Button>
                            ))}
                            {canEdit && (
                                <Button variant="ghost" onClick={() => setShowAddMatForm(!showAddMatForm)} className="border-dashed border-2 border-cyan-200 text-cyan-500 rounded-full font-bold">
                                    {showAddMatForm ? 'Close Creator' : '+ Add New Material'}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Material Creator Form */}
                    {showAddMatForm && canEdit && (
                        <Card className="p-6 border-4 border-cyan-400 bg-cyan-50 rounded-[32px]">
                            <h4 className="text-xl font-black text-cyan-800 mb-4">Create New Material</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <Input placeholder="Material Name (e.g. Chocolate)" value={newMat.name} onChange={e => setNewMat({...newMat, name: e.target.value})} className="bg-white" />
                                    <p className="text-xs text-slate-500">Define emojis for Solid (-100°C), Liquid (1°C), Gas (100°C)</p>
                                    <div className="flex gap-2">
                                        <Input placeholder="Solid 🍫" value={newMat.solid.emoji} onChange={e => setNewMat({...newMat, solid: {...newMat.solid, emoji: e.target.value}})} />
                                        <Input placeholder="Liquid 🥣" value={newMat.liquid.emoji} onChange={e => setNewMat({...newMat, liquid: {...newMat.liquid, emoji: e.target.value}})} />
                                        <Input placeholder="Gas ♨️" value={newMat.gas.emoji} onChange={e => setNewMat({...newMat, gas: {...newMat.gas, emoji: e.target.value}})} />
                                    </div>
                                    <Button onClick={handleSaveMaterial} className="w-full h-12 bg-cyan-600 text-white font-black rounded-xl">Save to Lab</Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Simulator Display */}
                    <div className="bg-white p-10 rounded-[40px] shadow-xl border-4 border-cyan-100 flex flex-col items-center gap-6">
                        <div className="text-9xl transition-all duration-500 p-8 bg-cyan-50 rounded-full border-4 border-white shadow-inner">
                            {getCurrentState().emoji}
                        </div>
                        <div className="text-center">
                            <h2 className="text-4xl font-black text-cyan-800">{getCurrentState().label}</h2>
                            <p className="text-cyan-600 font-bold text-lg mt-2">{getCurrentState().desc}</p>
                        </div>
                        
                        <div className="w-full max-w-md space-y-4">
                            <div className="flex justify-between font-black text-xl text-slate-400">
                                <span className="text-blue-400">COLD</span>
                                <span className="text-cyan-600 bg-cyan-50 px-4 py-1 rounded-full border border-cyan-100">{temp}°C</span>
                                <span className="text-red-400">HOT</span>
                            </div>
                            <input 
                                type="range" min="-50" max="150" value={temp} 
                                onChange={e => setTemp(parseInt(e.target.value))} 
                                className="w-full h-6 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                            />
                        </div>
                    </div>
                </div>
            )}
            
            {/* Journal Tab */}
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
                            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
                                {new Date(s.createdAt?.seconds * 1000).toLocaleDateString() || 'Discovery'}
                            </p>
                            {canEdit && (
                                <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleDeleteDiscovery(s.id); }}>
                                    <Trash2 className="w-4 w-4"/>
                                </Button>
                            )}
                        </div>
                    ))}
                    
                    {(!savedScience || savedScience.length === 0) && (
                        <div className="col-span-4 text-center py-10 text-slate-400">
                            No discoveries yet. Go to the <strong>Discovery</strong> tab to create one!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// --- MAIN PAGE ---
export default function JuniorCampusPage() {
  const { role } = useRole();
  const { schoolId } = useCurrentSchool();
  const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');
  const { toast } = useToast(); 

  return (
    <div className="min-h-screen bg-[#F0F9FF] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto mb-8 flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border-b-4 border-slate-200">
        <div className="bg-yellow-400 p-3 rounded-2xl shadow-inner"><Rabbit className="h-10 w-10 text-white" /></div>
        <div><h1 className="text-4xl font-extrabold text-slate-800">Junior Campus</h1><p className="text-slate-500 font-medium">Learn, Play, and Grow!</p></div>
      </div>
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="coach" className="w-full">
            <TabsList className="grid w-full grid-cols-8 h-24 bg-white p-2 rounded-2xl shadow-sm border-2 border-slate-100 mb-8 overflow-x-auto no-scrollbar">
                <TabsTrigger value="coach" className="rounded-xl data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Mic className="w-5 h-5"/> Coach</TabsTrigger>
                <TabsTrigger value="phonics" className="rounded-xl data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Music className="w-5 h-5"/> Phonics</TabsTrigger>
                <TabsTrigger value="abc" className="rounded-xl data-[state=active]:bg-green-100 data-[state=active]:text-green-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Brain className="w-5 h-5"/> ABCs</TabsTrigger>
                <TabsTrigger value="math" className="rounded-xl data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Calculator className="w-5 h-5"/> Math</TabsTrigger>
                <TabsTrigger value="stories" className="rounded-xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><BookOpen className="w-5 h-5"/> Stories</TabsTrigger>
                <TabsTrigger value="science" className="rounded-xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Atom className="w-5 h-5"/> Science</TabsTrigger>
                <TabsTrigger value="art" className="rounded-xl data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Palette className="w-5 h-5"/> Art</TabsTrigger>
                <TabsTrigger value="rewards" className="rounded-xl data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Trophy className="w-5 h-5"/> Rewards</TabsTrigger>
            </TabsList>
            
            {/* CONTENT AREAS */}
            <div className="min-h-[500px]">
                <TabsContent value="coach" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-pink-200"><VoiceCoach canEdit={canEdit} schoolId={schoolId} /></div></TabsContent>
                <TabsContent value="phonics" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-teal-200"><PhonicsForest /></div></TabsContent>
                <TabsContent value="abc" className="mt-0"><div className="bg-gradient-to-b from-green-50 to-white p-8 rounded-3xl shadow-xl border-b-8 border-green-200"><ABCKingdom /></div></TabsContent>
                <TabsContent value="math" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-orange-200 relative"><MathPlayground schoolId={schoolId} /></div></TabsContent>
                <TabsContent value="stories" className="mt-0"><StorySpark canEdit={canEdit} schoolId={schoolId} /></TabsContent>
                <TabsContent value="science" className="mt-0"><ScienceWorld canEdit={canEdit} /></TabsContent>
                <TabsContent value="art" className="mt-0"><div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300">{schoolId && <ArtStudio schoolId={schoolId} />}</div></TabsContent>
                <TabsContent value="rewards" className="mt-0">{schoolId && <StickerBook schoolId={schoolId} />}</TabsContent>
            </div>
        </Tabs>
      </div>
    </div>
  );
}

