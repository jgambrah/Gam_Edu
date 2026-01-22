
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
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, Trophy, Gift, Check, CheckCircle2, XCircle, Type, PlusCircle, PenSquare, FileText, Search, AlertTriangle, ShieldCheck, Activity, BrainCircuit, MessageSquare, Clapperboard, Users, Lightbulb, Microscope, Sparkles, Database
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
                                if (res.success) {
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
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

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
        if (activeTab === 'tracing' && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
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
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => { setIsDrawing(false); };
    
    const resetTracingCanvas = () => {
        const canvas = canvasRef.current;
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
                                            ref={canvasRef} width={400} height={400} 
                                            className="touch-none cursor-crosshair"
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                            onTouchStart={startDrawing}
                                            onTouchMove={draw}
                                            onTouchEnd={stopDrawing}
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

            {/* DIVISION: Sharing into Groups Visual */}
            {mode === 'div' && (
                <div className="space-y-4 mb-6">
                    <div className="flex flex-wrap justify-center gap-1 border-b pb-4">
                        {Array.from({ length: question.a }).map((_, i) => <span key={i} className="text-2xl">{question.icon}</span>)}
                    </div>
                    <div className="flex gap-2">
                        {Array.from({ length: question.b }).map((_, i) => (
                            <div key={i} className="w-12 h-12 border-2 border-dashed border-orange-200 rounded-xl flex items-center justify-center text-xs text-orange-300 font-bold">Group</div>
                        ))}
                    </div>
                </div>
            )}

            {(mode === 'add' || mode === 'sub') && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {Array.from({ length: question.a }).map((_, i) => <span key={i} className="text-3xl">{question.icon}</span>)}
                    <span className="text-3xl font-black text-orange-300 mx-2">{mode === 'add' ? '+' : '-'}</span>
                    {Array.from({ length: question.b }).map((_, i) => <span key={i} className="text-3xl opacity-50">{question.icon}</span>)}
                </div>
            )}
            
            {mode === 'shapes' && <div className="text-9xl text-blue-500 mb-6 drop-shadow-md">{question.a}</div>}
            
             {mode === 'time' && (
                <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center mb-6 relative bg-white">
                    <div className="absolute bottom-1/2 left-1/2 w-1 h-8 bg-slate-800 rounded -translate-x-1/2 origin-bottom" style={{ transform: `rotate(${(typeof question.a === 'string' ? parseInt(question.a.split(':')[0], 10) : 12) * 30}deg)` }}></div>
                    <div className="absolute bottom-1/2 left-1/2 w-1 h-12 bg-slate-800 rounded -translate-x-1/2 origin-bottom"></div>
                    <div className="absolute top-2">12</div>
                    <div className="absolute bottom-2">6</div>
                    <div className="absolute left-2">9</div>
                    <div className="absolute right-2">3</div>
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
                    {(mode === 'compare' || mode === 'patterns') && (
                        <span className="text-6xl tracking-tighter">{question.displayPrompt}</span>
                    )}
                    {(mode === 'mul' || mode === 'div' || mode === 'shapes' || mode === 'time') && (
                        <span>{question.displayPrompt ? "" : question.a}</span>
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

// --- 5. STORY SPARK ---
function StorySpark({ canEdit, schoolId }: { canEdit: boolean, schoolId: string | null }) {
    const { user } = useUser(); 
    const { role } = useRole();
    const firestore = useFirestore(); 
    const { toast } = useToast();
    
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
    
    const storiesQuery = useMemoFirebase(() => (firestore && user && schoolId) ? query(collection(firestore, 'junior_stories'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, [firestore, user, schoolId]);
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
        const res = await generateJuniorStory(topic, parseInt(targetWordCount)); 
        if (res.success) {
            setStory(res.data);
            resetQuiz();
        }
        setLoading(false); 
    };
    
    const handleSave = async () => { 
        if (!user || !story || !firestore || !schoolId) return; 
        
        await addDoc(collection(firestore, 'junior_stories'), { 
            ...story, 
            topic, 
            wordCount: story.content.split(' ').length,
            createdAt: serverTimestamp(), 
            createdBy: user.uid,
            schoolId: schoolId,
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
                    <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2"><Wand2 /> Story Lab</h3>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-3">
                            <Input 
                                value={topic} 
                                onChange={e => setTopic(e.target.value)} 
                                placeholder="What is the story about? (e.g. A dragon who loves cupcakes)" 
                                className="text-lg h-12 rounded-xl flex-1"
                            />
                            
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

                            <Button onClick={handleGenerate} disabled={loading || !topic} className="h-12 rounded-xl bg-purple-600 px-8">
                                {loading ? <Loader2 className="animate-spin"/> : "Create Story"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {story && (
                <Card className="border-4 border-yellow-300 bg-yellow-50 animate-in zoom-in overflow-hidden shadow-2xl">
                    <CardHeader className="bg-yellow-300 py-4 flex flex-row justify-between items-center">
                        <CardTitle className="text-2xl font-black text-yellow-900">{story.emojiIcon} {story.title}</CardTitle>
                        {isAdminOrDirector && (
                            <span className="bg-white/50 px-3 py-1 rounded-full text-xs font-bold text-yellow-800">
                                {actualWordCount} words
                            </span>
                        )}
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        {/* THE STORY TEXT */}
                        <div className="prose prose-slate max-w-none">
                            <p className="text-xl md:text-2xl leading-relaxed text-slate-800 font-medium whitespace-pre-wrap">
                                {story.content}
                            </p>
                        </div>
                        
                        <div className="flex gap-4">
                            <Button onClick={() => speak(story.content)} variant="outline" className="flex-1 h-14 text-lg border-2 border-yellow-400 text-yellow-700 font-bold hover:bg-yellow-100">
                                <Volume2 className="mr-2" /> Read Aloud
                            </Button>
                            {canEdit && <Button onClick={handleSave} className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700 font-bold"><Save className="mr-2" /> Save to Library</Button>}
                        </div>

                        {/* 3-QUESTION CHALLENGE AREA */}
                        <div className="bg-white p-6 rounded-3xl border-4 border-purple-200 shadow-inner">
                            {!quizFinished ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-black uppercase tracking-widest text-purple-400">
                                            Question {currentQuestionIndex + 1} of 3
                                        </span>
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map(i => (
                                                <div key={i} className={`h-2 w-8 rounded-full ${i === currentQuestionIndex ? 'bg-purple-500' : i < currentQuestionIndex ? 'bg-green-400' : 'bg-slate-200'}`} />
                                            ))}
                                        </div>
                                    </div>

                                    <h4 className="text-2xl font-bold text-purple-900 leading-tight">
                                        {story.questions?.[currentQuestionIndex]?.question || "Look at the story and answer..."}
                                    </h4>

                                    {!isAnswerSubmitted ? (
                                        <div className="flex gap-2">
                                            <Input 
                                                placeholder="Type your answer here..." 
                                                value={userAnswer}
                                                onChange={(e) => setUserAnswer(e.target.value)}
                                                className="text-lg h-14 border-2 border-purple-100 focus:border-purple-400 rounded-2xl"
                                                onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                                            />
                                            <Button onClick={handleCheckAnswer} disabled={!userAnswer.trim()} className="bg-purple-600 h-14 px-8 rounded-2xl font-bold">Check</Button>
                                        </div>
                                    ) : (
                                        <div className="animate-in slide-in-from-bottom-2 space-y-4">
                                            <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${isAnswerCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                                {isAnswerCorrect ? <CheckCircle2 className="w-6 h-6 mt-1" /> : <XCircle className="w-6 h-6 mt-1" />}
                                                <div>
                                                    <p className="font-bold">{isAnswerCorrect ? "Great Thinking!" : "Not Quite..."}</p>
                                                    <p className="text-sm">The answer is: <span className="font-bold underline">{story.questions?.[currentQuestionIndex]?.answer}</span></p>
                                                </div>
                                            </div>
                                            <Button onClick={handleNextQuestion} className="w-full h-12 bg-purple-600 text-white font-bold rounded-xl">
                                                {currentQuestionIndex < 2 ? "Next Question" : "See Final Score"} <ArrowRight className="ml-2 w-4 h-4" />
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
                                    <p className="text-xl font-bold text-purple-600">You got {score} out of 3 correct!</p>
                                    <Button onClick={resetQuiz} variant="ghost" className="text-purple-400 hover:text-purple-600 font-bold">Try Quiz Again</Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* LIBRARY SECTION */}
            <div>
                <h3 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <BookOpen className="text-purple-500" /> Story Library
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedStories?.map((s:any) => (
                        <Card key={s.id} className="cursor-pointer border-b-8 border-purple-200 hover:border-purple-400 hover:-translate-y-1 transition-all relative group rounded-3xl overflow-hidden">
                            <CardContent className="p-6 flex items-center gap-4" onClick={() => handleSelectStory(s)}>
                                <div className="text-5xl bg-slate-50 p-3 rounded-2xl shadow-inner">{s.emojiIcon}</div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-black text-lg text-slate-800 truncate">{s.title}</h4>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        <span>{s.wordCount || '?'} Words</span>
                                        <span>•</span>
                                        <span className="text-purple-400">{s.topic || 'General'}</span>
                                    </div>
                                </div>
                            </CardContent>
                            {canEdit && (
                                <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-200 hover:text-red-500 transition-opacity" onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}>
                                    <Trash2 className="w-4 w-4"/>
                                </Button>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- 6. SCIENCE WORLD (FIXED JOURNAL SAVE) ---
function ScienceWorld({ canEdit, schoolId }: { canEdit: boolean, schoolId: string | null }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    
    const [activeTab, setActiveTab] = useState<'lab' | 'sorter' | 'experiment' | 'library'>('lab');
    
    // --- 1. DATA FETCHING (Corrected Query) ---
    // Note: If this list is empty, check Console for "Index Required" link
    const scienceQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(
            collection(firestore, 'junior_science'), 
            where('schoolId', '==', schoolId), 
            orderBy('createdAt', 'desc')
        ) : null, 
    [firestore, schoolId]);
    
    const { data: savedScience, forceRefetch: refetchScience } = useCollection<any>(scienceQuery);
    
    const sorterQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'junior_sorter_items'), where('schoolId', '==', schoolId), orderBy('createdAt', 'asc')) : null, 
    [firestore, schoolId]);
    const { data: dbSorterItems, forceRefetch: refetchSorter } = useCollection<any>(sorterQuery);
    
    const materialsQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'junior_science_materials'), where('schoolId', '==', schoolId), orderBy('createdAt', 'asc')) : null, 
    [firestore, schoolId]);
    const { data: dbMaterials, forceRefetch: refetchMaterials } = useCollection<any>(materialsQuery);
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [newItem, setNewItem] = useState({ name: '', emoji: '', type: 'living' });
    const [temp, setTemp] = useState(20);
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
    const [showAddMatForm, setShowAddMatForm] = useState(false);
    const [topic, setTopic] = useState(''); 
    const [fact, setFact] = useState<any>(null); 
    const [loading, setLoading] = useState(false);
    const [newMat, setNewMat] = useState({
        name: '',
        solid: { temp: -100, emoji: '🧊', label: 'Solid', desc: 'Frozen tight!' },
        liquid: { temp: 1, emoji: '💧', label: 'Liquid', desc: 'Flowing around!' },
        gas: { temp: 100, emoji: '💨', label: 'Gas', desc: 'Flying fast!' }
    });

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
        if (!newItem.name || !newItem.emoji || !firestore || !schoolId) return;
        try {
            await addDoc(collection(firestore, 'junior_sorter_items'), {
                ...newItem,
                createdAt: serverTimestamp(),
                schoolId: schoolId,
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
        try {
            if (window.confirm("Are you sure you want to delete this item?")) {
                const itemDoc = doc(firestore, 'junior_sorter_items', id);
                await deleteDoc(itemDoc);
                
                toast({ title: "Item Removed" });
                
                if (refetchSorter) {
                    refetchSorter();
                }
                
                setCurrentIndex(0);
            }
        } catch (error) {
            console.error("Delete Error:", error);
            toast({ 
                title: "Error", 
                description: "Missing permissions or item not found.", 
                variant: "destructive" 
            });
        }
    };

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
            createdAt: serverTimestamp(),
            schoolId: schoolId,
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

    const handleGenerate = async () => { 
        setLoading(true); 
        try {
            const res = await generateJuniorScience(topic); 
            if(res.success) {
                setFact(res.data);
            } else {
                toast({ variant: "destructive", title: "AI Error", description: "Could not generate fact." });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false); 
        }
    };

    const handleSave = async () => { 
        if(!user || !fact || !firestore || !schoolId) return; 
        
        try {
            // Save to Firestore
            await addDoc(collection(firestore,'junior_science'), {
                title: fact.title,
                fact: fact.fact,
                emojiIcon: fact.emojiIcon,
                observation: fact.observation || "",
                experiment: fact.experiment || "",
                createdAt: serverTimestamp(),
                createdBy: user.uid,
                schoolId: schoolId
            }); 
            
            setFact(null); 
            setTopic('');
            
            if (refetchScience) refetchScience(); 
            
            toast({title: "Discovery Saved!", description: "Check your Journal tab."});
            
            setActiveTab('library');

        } catch (e: any) {
            console.error("Save Error:", e);
            toast({ variant: "destructive", title: "Save Failed", description: e.message });
        }
    };
    
    const handleDeleteDiscovery = async (id: string) => {
        if (!firestore) return;
        if(confirm("Delete this discovery?")){
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

            {activeTab === 'lab' && (
                 <div className="space-y-6 animate-in fade-in">
                     {canEdit && (
                        <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-blue-200">
                            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2"><Atom /> What should we investigate?</h3>
                            <div className="flex gap-2">
                                <Input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic (e.g. Gravity, Ants, Clouds)" className="text-lg h-12 rounded-xl"/>
                                <Button onClick={handleGenerate} disabled={loading} className="h-12 rounded-xl bg-blue-600 px-6">
                                    {loading ? <Loader2 className="animate-spin"/> : "Investigate"}
                                </Button>
                            </div>
                        </div>
                    )}
                    {fact && (
                        <Card className="border-4 border-blue-400 overflow-hidden rounded-[40px] shadow-2xl animate-in zoom-in">
                           <div className="bg-blue-500 p-8 text-center text-white">
                                <div className="text-8xl mb-4 animate-pulse">{fact.emojiIcon}</div>
                                <h2 className="text-4xl font-black mb-2">{fact.title}</h2>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100">
                                        <h4 className="font-black text-blue-700 flex items-center gap-2 mb-2"><BookOpen className="w-5 h-5"/> The Big Fact</h4>
                                        <p className="text-lg text-slate-700 leading-relaxed">{fact.fact}</p>
                                    </div>
                                    <div className="bg-green-50 p-6 rounded-3xl border-2 border-green-100">
                                        <h4 className="font-black text-green-700 flex items-center gap-2 mb-2"><Star className="w-5 h-5"/> Observation</h4>
                                        <p className="text-lg text-slate-700 leading-relaxed">{fact.observation || "Look closely at the world around you to see this in action!"}</p>
                                    </div>
                                </div>
                                <div className="bg-orange-50 p-6 rounded-3xl border-4 border-dashed border-orange-200">
                                    <h4 className="font-black text-orange-700 flex items-center gap-2 mb-2"><Wand2 className="w-5 h-5"/> Home Experiment</h4>
                                    <p className="text-lg text-slate-700 italic">"{fact.experiment || "Can you find an example of this in your backyard?"}"</p>
                                </div>
                                <div className="flex gap-4">
                                    <Button onClick={() => speak(`${fact.title}. ${fact.fact}. Try this: ${fact.experiment}`)} className="flex-1 h-14 bg-blue-600 text-lg font-bold rounded-2xl">Read Lesson</Button>
                                    {canEdit && <Button onClick={handleSave} variant="outline" className="flex-1 h-14 border-2 border-green-500 text-green-600 font-bold rounded-2xl">Add to Journal</Button>}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
            
            {activeTab === 'sorter' && (
                <div className="space-y-6">
                    {canEdit && (
                         <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg">
                                    <PlusCircle className="mr-2 h-4 w-4"/> Add or Manage Sorter Items
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Manage Sorter Library</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-4 gap-2 p-4 border rounded-2xl bg-slate-50">
                                        <Input 
                                            placeholder="Name" 
                                            value={newItem.name} 
                                            onChange={e => setNewItem({...newItem, name: e.target.value})} 
                                            className="col-span-2"
                                        />
                                        <Input 
                                            placeholder="Emoji" 
                                            value={newItem.emoji} 
                                            onChange={e => setNewItem({...newItem, emoji: e.target.value})} 
                                            className="text-center"
                                        />
                                        <Button onClick={handleSaveSorterItem} size="icon" className="bg-green-600 hover:bg-green-700">
                                            <Check className="h-4 w-4"/>
                                        </Button>
                                        <div className="col-span-4">
                                            <Select value={newItem.type} onValueChange={(v) => setNewItem({...newItem, type: v})}>
                                                <SelectTrigger><SelectValue placeholder="Select Type"/></SelectTrigger>
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
                                                            <Badge variant="outline" className="mt-1 text-[10px] uppercase">
                                                                {item.type}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        type="button" 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="text-red-400 hover:text-red-600 hover:bg-red-50" 
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

                    <div className="bg-slate-50 p-10 rounded-[40px] border-4 border-slate-200 text-center space-y-8">
                        {(!dbSorterItems || dbSorterItems.length === 0) ? (
                            <div className="py-10 text-slate-400 font-bold">Your library is empty. Please add items above!</div>
                        ) : (
                            <div className="animate-in zoom-in space-y-8">
                                <div className="flex justify-center gap-1">
                                    {dbSorterItems.map((_: any, i: number) => (
                                        <div 
                                            key={i} 
                                            className={`h-2 w-8 rounded-full transition-all ${i === currentIndex ? 'bg-blue-500 w-12' : i < currentIndex ? 'bg-green-400' : 'bg-slate-200'}`} 
                                        />
                                    ))}
                                </div>
                                <div className="text-9xl mb-4 p-8 bg-white rounded-full shadow-xl w-48 h-48 mx-auto flex items-center justify-center border-8 border-blue-50">
                                    {dbSorterItems[currentIndex].emoji}
                                </div>
                                <h3 className="text-4xl font-black text-slate-800 capitalize">{dbSorterItems[currentIndex].name}</h3>
                                
                                <div className="flex justify-center gap-6">
                                    <Button 
                                        onClick={() => handleAnswer('living')}
                                        className="h-24 px-12 bg-green-500 text-2xl font-black rounded-3xl shadow-[0_10px_0_#15803d] active:shadow-none active:translate-y-2 transition-all"
                                    >
                                        🌳 Living
                                    </Button>
                                    <Button 
                                        onClick={() => handleAnswer('non-living')}
                                        className="h-24 px-12 bg-slate-500 text-2xl font-black rounded-3xl shadow-[0_10px_0_#334155] active:shadow-none active:translate-y-2 transition-all"
                                    >
                                        🧸 Non-Living
                                    </Button>
                                </div>
                                <p className="text-slate-400 font-bold">
                                    Item {currentIndex + 1} of {dbSorterItems.length}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
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
                                {s.createdAt?.toDate ? new Date(s.createdAt.seconds * 1000).toLocaleDateString() : 'Discovery'}
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

// --- 7. ART STUDIO (INTERACTIVE PATHWAY) ---
function ArtStudio({ canEdit, schoolId }: { canEdit: boolean, schoolId: string | null }) {
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
    const questsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'junior_art_quests'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
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
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
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
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit mx-auto border border-slate-200">
                 <Button variant={activeTab === 'freestyle' ? 'default' : 'ghost'} onClick={() => setActiveTab('freestyle')} className="rounded-xl">Freestyle</Button>
                <Button variant={activeTab === 'color-lab' ? 'default' : 'ghost'} onClick={() => setActiveTab('color-lab')} className="rounded-xl">Color Lab</Button>
                <Button variant={activeTab === 'shapes' ? 'default' : 'ghost'} onClick={() => setActiveTab('shapes')} className="rounded-xl">Shape Quest</Button>
            </div>

             <div className="bg-indigo-600 p-4 rounded-2xl text-white flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <Star className="text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-lg">{dbQuests?.[currentQuestIdx]?.instruction || "Let your imagination run wild!"}</span>
                </div>
                <Button size="sm" variant="secondary" onClick={() => setCurrentQuestIdx((prev) => (prev + 1) % (dbQuests?.length || 1))}>New Quest</Button>
            </div>


            <div className="grid lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 border-2 border-slate-100 rounded-[32px] p-4 space-y-6 h-fit">
                    {activeTab === 'color-lab' ? (
                        <div className="space-y-4 text-center">
                            <h4 className="font-bold text-slate-800 text-sm uppercase">Primary Colors</h4>
                            <div className="flex justify-center gap-2">
                                {['#FF0000', '#FFFF00', '#0000FF'].map(c => (
                                    <button key={c} onClick={() => handleMix(c)} className="w-10 h-10 rounded-full border-4 border-white shadow-md" style={{backgroundColor: c}} />
                                ))}
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <div className="flex justify-center items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full border shadow-sm" style={{backgroundColor: mix1 || '#eee'}} />
                                    <span className="font-bold">+</span>
                                    <div className="w-8 h-8 rounded-full border shadow-sm" style={{backgroundColor: mix2 || '#eee'}} />
                                </div>
                                {getMixedColor() && (
                                    <div className="animate-in zoom-in text-center">
                                        <p className="text-xs font-bold text-slate-500 mb-1">Result:</p>
                                        <button 
                                            onClick={() => setColor(getMixedColor()!.hex)}
                                            className="w-full py-2 rounded-xl text-white font-bold" 
                                            style={{backgroundColor: getMixedColor()!.hex}}
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
                                <label className="text-xs font-bold text-slate-400">TOOLS</label>
                                <div className="grid grid-cols-4 gap-2">
                                    <Button size="icon" variant={tool === 'brush' ? 'default' : 'outline'} onClick={() => setTool('brush')} title="Brush"><PenTool/></Button>
                                    <Button size="icon" variant={tool === 'bucket' ? 'default' : 'outline'} onClick={() => setTool('bucket')} title="Paint Bucket"><Database/></Button>
                                    <Button size="icon" variant={tool === 'stamp' ? 'default' : 'outline'} onClick={() => setTool('stamp')} title="Stamp"><Star/></Button>
                                    <Button size="icon" variant={tool === 'pencil' ? 'default' : 'outline'} onClick={() => setTool('pencil')} title="Pencil">✏️</Button>
                                    <Button size="icon" variant={tool === 'crayon' ? 'default' : 'outline'} onClick={() => setTool('crayon')} title="Crayon">🖍️</Button>
                                    <Button size="icon" variant={tool === 'paint_brush' ? 'default' : 'outline'} onClick={() => setTool('paint_brush')} title="Paint Brush">🖌️</Button>
                                    <Button size="icon" variant={tool === 'marker' ? 'default' : 'outline'} onClick={() => setTool('marker')} title="Marker">🎨</Button>
                                </div>
                            </div>
                            {tool === 'stamp' && (
                                <div className="flex gap-2">
                                    {['circle', 'square', 'star'].map(s => (
                                        <button key={s} onClick={() => setSelectedShape(s as any)} className={`p-2 border-2 rounded-xl ${selectedShape === s ? 'border-indigo-500' : 'border-slate-100'}`}>
                                            {s === 'circle' ? '●' : s === 'square' ? '■' : '★'}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Brush Color</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#FFC0CB', '#8B4513'].map(c => (
                                        <button 
                                            key={c} onClick={() => setColor(c)} 
                                            className={`aspect-square rounded-full border-2 transition-transform ${color === c ? 'border-slate-800 scale-110 shadow-lg' : 'border-transparent'}`} 
                                            style={{ backgroundColor: c }} 
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase">Brush Size</label>
                                <input type="range" min="2" max="40" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="w-full accent-indigo-500" />
                            </div>
                             <div className="space-y-2 pt-4 border-t">
                                <Button variant="outline" className="w-full" onClick={() => {toast({title:"Artwork Saved!"})}}>
                                    <Save className="mr-2 h-4 w-4"/>Save Masterpiece
                                </Button>
                                <Button variant="destructive" onClick={clearCanvas} className="w-full">
                                    <Eraser className="mr-2 h-4 w-4" /> Clear All
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                <div className="lg:col-span-3 flex flex-col items-center gap-4">
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
                        className="bg-white rounded-[40px] shadow-2xl border-8 border-slate-50 w-full h-[500px] cursor-crosshair touch-none"
                    />
                    <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
                        Practice makes perfect!
                    </p>
                </div>
            </div>
        </div>
    );
}

// --- 8. REWARDS (THE HALL OF FAME) ---
function StickerBook({ schoolId }: { schoolId: string | null }) {
    const { user } = useUser(); 
    const firestore = useFirestore();
    const [activeFilter, setActiveFilter] = useState<'all' | 'math' | 'literacy' | 'science' | 'art'>('all');

    const stickerQuery = useMemoFirebase(() => 
        (user && firestore && schoolId) ? query(
            collection(firestore, 'junior_stickers'), 
            where('userId', '==', user.uid),
            where('schoolId', '==', schoolId),
            orderBy('earnedAt', 'desc')
        ) : null, [firestore, user, schoolId]
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
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h3 className="text-4xl font-black mb-1">Hall of Fame</h3>
                        <p className="font-bold opacity-90 text-lg">You have earned {stats.total} total stickers!</p>
                        <div className="mt-4 flex items-center gap-2 bg-white/20 w-fit px-4 py-2 rounded-full backdrop-blur-sm">
                            <span className="text-2xl">{getTier(stats.total).icon}</span>
                            <span className="font-black uppercase tracking-widest">{getTier(stats.total).label}</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/10 p-4 rounded-3xl text-center backdrop-blur-md border border-white/20 min-w-[100px]">
                            <div className="text-3xl font-black">{stats.math}</div>
                            <div className="text-[10px] font-bold uppercase opacity-80">Math</div>
                        </div>
                        <div className="bg-white/10 p-4 rounded-3xl text-center backdrop-blur-md border border-white/20 min-w-[100px]">
                            <div className="text-3xl font-black">{stats.literacy}</div>
                            <div className="text-[10px] font-bold uppercase opacity-80">Reading</div>
                        </div>
                        <div className="bg-white/10 p-4 rounded-3xl text-center backdrop-blur-md border border-white/20 min-w-[100px]">
                            <div className="text-3xl font-black">{stats.science}</div>
                            <div className="text-[10px] font-bold uppercase opacity-80">Science</div>
                        </div>
                    </div>
                </div>
                {/* Decorative background icons */}
                <Trophy className="absolute -bottom-4 -right-4 w-48 h-48 opacity-10 rotate-12" />
            </div>

            {/* 2. SUBJECT PROGRESS TRACKER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { label: 'Math Whiz', count: stats.math, color: 'bg-orange-500', icon: <Calculator className="w-4 h-4" /> },
                    { label: 'Reading Hero', count: stats.literacy, color: 'bg-purple-500', icon: <BookOpen className="w-4 h-4" /> },
                    { label: 'Science Pro', count: stats.science, color: 'bg-blue-500', icon: <Atom className="w-4 h-4" /> },
                    { label: 'Art Legend', count: stats.art, color: 'bg-pink-500', icon: <Palette className="w-4 h-4" /> },
                ].map((p) => (
                    <div key={p.label} className="bg-white p-5 rounded-3xl border-2 border-slate-50 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 font-black text-slate-700">
                                {p.icon} {p.label}
                            </div>
                            <span className="text-xs font-bold text-slate-400">{p.count} / 10 to next Level</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full ${p.color} transition-all duration-1000`} 
                                style={{ width: `${Math.min((p.count / 10) * 100, 100)}%` }} 
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. FILTER & STICKER GRID */}
            <div className="space-y-6">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {['all', 'math', 'literacy', 'science', 'art'].map((f) => (
                        <Button 
                            key={f} 
                            variant={activeFilter === f ? 'default' : 'outline'} 
                            onClick={() => setActiveFilter(f as any)}
                            className={`rounded-2xl capitalize font-bold px-6 ${activeFilter === f ? 'bg-slate-800' : 'bg-white text-slate-500'}`}
                        >
                            {f}
                        </Button>
                    ))}
                </div>

                {!filteredStickers || filteredStickers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[40px] border-4 border-dashed border-slate-100">
                        <Gift className="h-16 w-16 mx-auto mb-4 text-slate-200" />
                        <p className="text-slate-400 font-bold">No stickers here yet. Keep learning to earn some!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {filteredStickers.map((s, idx) => (
                            <div 
                                key={s.id} 
                                onClick={() => speak(`You earned the ${s.name} sticker!`)}
                                className="group relative aspect-square bg-white rounded-3xl shadow-md border-b-4 border-slate-200 flex flex-col items-center justify-center p-2 hover:-translate-y-2 transition-all cursor-pointer hover:border-yellow-400"
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                <div className="text-4xl mb-1 group-hover:scale-125 transition-transform">{s.emoji}</div>
                                <span className="text-[9px] text-center leading-tight font-black text-slate-500 uppercase">{s.name}</span>
                                
                                <div className="absolute -top-1 -right-1 bg-yellow-400 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
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
                <TabsContent value="science" className="mt-0"><ScienceWorld canEdit={canEdit} schoolId={schoolId} /></TabsContent>
                <TabsContent value="art" className="mt-0"><div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300"><ArtStudio canEdit={canEdit} schoolId={schoolId} /></div></TabsContent>
                <TabsContent value="rewards" className="mt-0"><StickerBook schoolId={schoolId} /></TabsContent>
            </div>
        </Tabs>
      </div>
    </div>
  );
}
