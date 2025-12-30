
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where, increment, getDocs, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, Trophy, Gift, Check, CheckCircle2, XCircle, Type, PlusCircle, PenSquare, FileText, Search, AlertTriangle, ShieldCheck, Activity, BrainCircuit, MessageSquare, Clapperboard, Users, Lightbulb, Microscope, Sparkles, Database, PenTool, Eraser
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateJuniorScience, generateWordDetails, generatePhonicsChallenge } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
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
                                if (!firestore) return;
                                setIsGenerating(true);
                                const res = await generateWordDetails(newWord);
                                if (res.success) {
                                    await addDoc(collection(firestore, 'junior_phonics'), { ...res.data, createdAt: serverTimestamp() });
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
        
        // Ensure options don't include the target, then add it back to shuffle
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
                                className="h-24 bg-white border-4 border-slate-100 rounded-3xl text-5xl font-black text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 transition-all shadow-md"
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
    const traceCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isTracing, setIsTracing] = useState(false);

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
        ctx.beginPath(); ctx.moveTo(x, y); ctx.strokeStyle = "#4f46e5"; ctx.lineWidth = 15; ctx.lineCap = "round";
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

                            {/* TRACING MODE */}
                            {activeTab === 'tracing' && (
                                <div className="p-8 flex flex-col items-center space-y-6 animate-in slide-in-from-right-4">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-black text-slate-800">Can you trace the letter {selectedLetter}?</h3>
                                        <p className="text-slate-500">Use your finger or mouse to draw!</p>
                                    </div>
                                    <div className="relative bg-white border-4 border-slate-100 rounded-3xl shadow-inner">
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
                                        <Button 
                                            variant="ghost" size="sm" 
                                            className="absolute bottom-2 right-2 text-slate-300"
                                            onClick={resetTracingCanvas}
                                        >
                                            Reset
                                        </Button>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Start at the top!</p>
                                </div>
                            )}

                            {/* MATCHER GAME */}
                            {activeTab === 'matcher' && (
                                <div className="p-8 text-center space-y-8 animate-in fade-in">
                                    <h3 className="text-3xl font-black text-slate-800">Find the Lower Case!</h3>
                                    <div className="text-[120px] font-black text-green-600 mb-8 bg-green-50 w-40 h-40 flex items-center justify-center rounded-3xl mx-auto shadow-sm">
                                        {selectedLetter}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                                        {[
                                            selectedLetter.toLowerCase(), 
                                            alphabet[Math.floor(Math.random()*26)].toLowerCase(),
                                            alphabet[Math.floor(Math.random()*26)].toLowerCase(),
                                            alphabet[Math.floor(Math.random()*26)].toLowerCase(),
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
                                                className="h-24 bg-white border-4 border-slate-100 rounded-3xl text-5xl font-black text-slate-700 hover:border-green-400 hover:bg-green-50 transition-all"
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

// --- MAIN PAGE ---
export default function JuniorCampusPage() {
  const { role } = useRole();
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
            <TabsList className="grid w-full grid-cols-4 h-24 bg-white p-2 rounded-2xl shadow-sm border-2 border-slate-100 mb-8 overflow-x-auto">
                <TabsTrigger value="coach" className="rounded-xl data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Mic className="w-5 h-5"/> Coach</TabsTrigger>
                <TabsTrigger value="phonics" className="rounded-xl data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Music className="w-5 h-5"/> Phonics</TabsTrigger>
                <TabsTrigger value="abc" className="rounded-xl data-[state=active]:bg-green-100 data-[state=active]:text-green-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Brain className="w-5 h-5"/> ABCs</TabsTrigger>
                <TabsTrigger value="stories" className="rounded-xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><BookOpen className="w-5 h-5"/> Stories</TabsTrigger>
            </TabsList>
            
            {/* CONTENT AREAS */}
            <div className="min-h-[500px]">
                <TabsContent value="coach" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-pink-200"><VoiceCoach canEdit={canEdit} /></div></TabsContent>
                <TabsContent value="phonics" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-teal-200"><PhonicsForest /></div></TabsContent>
                <TabsContent value="abc" className="mt-0"><div className="bg-gradient-to-b from-green-50 to-white p-8 rounded-3xl shadow-xl border-b-8 border-green-200"><ABCKingdom /></div></TabsContent>
                <TabsContent value="stories" className="mt-0"><StorySpark canEdit={canEdit} /></TabsContent>
            </div>
        </Tabs>
      </div>
    </div>
  );
}