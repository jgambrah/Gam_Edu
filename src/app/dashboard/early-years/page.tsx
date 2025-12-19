
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where, increment } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, Trophy, Gift, Check, CheckCircle2, XCircle, Type
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateJuniorScience, generateWordDetails, generatePhonicsChallenge } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';

// --- HELPER: TEXT TO SPEECH ---
const speak = (text: string, rate = 0.9) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    window.speechSynthesis.speak(u);
};

// --- NEW VoiceCoach Component ---
function VoiceCoach({ canEdit }: { canEdit: boolean }) {
    const [word, setWord] = useState('Apple');
    const [details, setDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async (targetWord: string) => {
        if (!targetWord.trim()) return;
        setLoading(true);
        setDetails(null);
        try {
            const res = await generateWordDetails(targetWord);
            if(res.success) {
                setDetails(res.data);
                speak(res.data.word);
                setTimeout(() => speak(res.data.phonetic), 800);
                setTimeout(() => speak(res.data.sentence), 2000);
            } else {
                toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch word details.' });
            }
        } catch (e) {
            toast({ variant: 'destructive', title: 'AI Error' });
        }
        setLoading(false);
    };

    // Load initial word
    useEffect(() => {
        handleGenerate('Apple');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-6">
             <div className="flex gap-2">
                <Input value={word} onChange={e => setWord(e.target.value)} placeholder="Enter a word to practice..." className="text-lg h-12" onKeyDown={(e) => e.key === 'Enter' && handleGenerate(word)} />
                <Button onClick={() => handleGenerate(word)} disabled={loading} className="h-12 text-lg px-6 bg-pink-500 hover:bg-pink-600">
                    {loading ? <Loader2 className="animate-spin" /> : 'Practice'}
                </Button>
            </div>

            {details && (
                <div className="text-center space-y-6 p-8 bg-pink-50 rounded-2xl border-2 border-pink-100 animate-in fade-in zoom-in-95">
                    <div className="text-8xl">{details.emoji}</div>
                    <h2 className="text-6xl font-black text-slate-800 capitalize">{details.word}</h2>
                    <h3 className="text-3xl font-bold text-pink-500 tracking-widest">{details.phonetic}</h3>
                    <p className="text-xl text-slate-600 italic">"{details.sentence}"</p>
                    <Button onClick={() => speak(details.sentence)} variant="secondary" size="lg" className="rounded-full"><Volume2 className="mr-2"/> Read Sentence</Button>
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
        const all = soundGroups.flatMap(g => g.sounds);
        const target = all[Math.floor(Math.random() * all.length)];
        const options = [target, ...all.filter(s => s !== target).sort(() => 0.5 - Math.random()).slice(0, 3)].sort();
        setGameTarget(target);
        setGameOptions(options);
        speak(`Find the sound: ${target}`);
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
                                        speak("Great job!");
                                        startNewGame();
                                    } else {
                                        speak("Try again");
                                        toast({ title: "Oops!", description: "Keep trying, you can do it!", variant: "destructive" });
                                    }
                                }}
                                className="h-24 bg-white border-4 border-slate-100 rounded-[30px] text-4xl font-black text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 transition-all shadow-md"
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

// --- 3. ABC KINGDOM (ENHANCED) ---
function ABCKingdom() {
    const [mode, setMode] = useState<'upper' | 'lower' | 'both'>('upper');
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

    // Mapping letters to keywords for "Phonic Awareness"
    const keywords: Record<string, string> = {
        A: "Apple", B: "Ball", C: "Cat", D: "Dog", E: "Egg", F: "Fish", G: "Goat", H: "Hat", 
        I: "Igloo", J: "Jam", K: "Kite", L: "Lion", M: "Moon", N: "Net", O: "Octopus", P: "Pig", 
        Q: "Queen", R: "Rabbit", S: "Sun", T: "Tiger", U: "Umbrella", V: "Van", W: "Watch", 
        X: "Xylophone", Y: "Yo-yo", Z: "Zebra"
    };

    const speakLetter = (letter: string) => {
        // First say the letter, then the phonic sound, then the keyword
        speak(letter);
        setTimeout(() => speak(`as in ${keywords[letter]}`), 800);
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-center gap-2 bg-green-50 p-2 rounded-2xl w-fit mx-auto border border-green-100">
                <Button onClick={() => setMode('upper')} variant={mode === 'upper' ? 'default' : 'ghost'} className="font-bold">ABC</Button>
                <Button onClick={() => setMode('lower')} variant={mode === 'lower' ? 'default' : 'ghost'} className="font-bold">abc</Button>
                <Button onClick={() => setMode('both')} variant={mode === 'both' ? 'default' : 'ghost'} className="font-bold">Aa</Button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-w-5xl mx-auto">
                {alphabet.map(letter => (
                    <button 
                        key={letter}
                        onClick={() => speakLetter(letter)}
                        className="group relative aspect-square bg-white rounded-[32px] shadow-sm border-b-8 border-green-200 text-green-600 hover:bg-green-50 hover:border-green-400 hover:-translate-y-2 transition-all flex flex-col items-center justify-center p-4"
                    >
                        <span className={`font-black tracking-tighter ${mode === 'both' ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'}`}>
                            {mode === 'upper' ? letter : mode === 'lower' ? letter.toLowerCase() : `${letter}${letter.toLowerCase()}`}
                        </span>
                        <span className="text-[10px] font-bold text-slate-300 mt-1 uppercase group-hover:text-green-500 transition-colors">
                            {keywords[letter]}
                        </span>
                        
                        {/* Hidden decoration that appears on hover */}
                        <Star className="absolute top-2 right-2 w-3 h-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
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
        displayPrompt = `The clock says ${a}...`;
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
      setTimeout(generateQuestion, 1500);
    } else {
      setStreak(0);
      setFeedback("Try Again! 🤔");
      speak("Not quite.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Scrollable Mode Selector */}
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

            {/* ADD/SUB Visuals */}
            {(mode === 'add' || mode === 'sub') && (
                <div className="flex flex-wrap justify-center gap-2 mb-6 min-h-[60px]">
                    {Array.from({ length: question.a }).map((_, i) => <span key={i} className="text-3xl">{question.icon}</span>)}
                    <span className="text-3xl font-black text-orange-300 mx-2">{mode === 'add' ? '+' : '-'}</span>
                    {Array.from({ length: question.b }).map((_, i) => <span key={i} className="text-3xl opacity-50">{question.icon}</span>)}
                </div>
            )}

            {/* SHAPES Visual */}
            {mode === 'shapes' && <div className="text-9xl text-blue-500 mb-6">{question.a}</div>}
            
            {/* TIME Visual */}
            {mode === 'time' && (
                <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center mb-6 relative bg-white">
                    <div className="text-2xl font-black">{question.a.split(':')[0]}</div>
                    <div className="absolute top-2">12</div>
                    <div className="absolute bottom-2">6</div>
                    <div className="absolute left-2">9</div>
                    <div className="absolute right-2">3</div>
                </div>
            )}
            
            {/* The Main Question Text */}
            <div className="text-center">
                <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-2">{question.displayPrompt || 'Solve'}</p>
                 <div className="text-5xl font-black text-slate-800">
                    {mode === 'add' || mode === 'sub' || mode === 'mul' || mode === 'div' ? (
                        <div className="flex items-center gap-3">
                            <span>{mode === 'div' ? question.a : (mode === 'mul' ? question.a : question.a)}</span>
                            <span className="text-orange-400">
                                {mode === 'add' ? '+' : mode === 'sub' ? '-' : mode === 'mul' ? '×' : '÷'}
                            </span>
                            <span>{question.b}</span>
                            <span className="text-slate-300">=</span>
                            <span className="text-orange-500">?</span>
                        </div>
                    ) : (
                        <span className="text-6xl font-black text-slate-800 tracking-tighter">{question.displayPrompt || question.a}</span>
                    )}
                </div>
            </div>
        </CardContent>
      </Card>

      {/* Answer Grid */}
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

      <div className="h-10 text-2xl font-black text-green-500">{feedback}</div>
    </div>
  );
}


// --- 5. STORY SPARK ---
function StorySpark({ canEdit }: { canEdit: boolean }) {
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
        const res = await generateJuniorStory(topic, parseInt(targetWordCount)); 
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
        const correct = currentQ.answer.toLowerCase().trim().includes(userAnswer.toLowerCase().trim()) || 
                        userAnswer.toLowerCase().trim().includes(currentQ.answer.toLowerCase().trim());
        
        setIsAnswerCorrect(correct);
        setIsAnswerSubmitted(true);
        if (correct) {
            setScore(s => s + 1);
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
            speak("Great job! That is correct.");
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
            speak(`You finished the quiz! You got ${score + (isAnswerCorrect ? 0 : 0)} out of ${story.questions.length}`);
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

                            <Button onClick={handleGenerate} disabled={loading || !topic} className="h-12 rounded-xl bg-purple-600 px-8">
                                {loading ? <Loader2 className="animate-spin"/> : "Create Story"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {story && (
                <Card className="border-4 border-yellow-300 bg-yellow-50 animate-in zoom-in overflow-hidden">
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

                        {/* Multi-Question Quiz Section */}
                        <div className="bg-purple-50 p-6 rounded-3xl border-4 border-purple-200 shadow-inner">
                            {!quizFinished ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="bg-purple-200 text-purple-700 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                                            Question {currentQuestionIndex + 1} of 3
                                        </span>
                                        <span className="text-purple-600 font-bold">Score: {score}</span>
                                    </div>
                                    
                                    <p className="text-2xl font-bold text-purple-900">
                                        {story.questions?.[currentQuestionIndex]?.question || story.question}
                                    </p>

                                    {!isAnswerSubmitted ? (
                                        <div className="flex gap-2">
                                            <Input 
                                                placeholder="Type your answer here..." 
                                                value={userAnswer}
                                                onChange={(e) => setUserAnswer(e.target.value)}
                                                className="text-lg h-14 border-2 border-purple-200 focus:border-purple-500 rounded-xl"
                                                onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                                            />
                                            <Button onClick={handleCheckAnswer} disabled={!userAnswer.trim()} className="h-14 px-8 bg-purple-600 text-lg font-bold rounded-xl">Check</Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                            <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${isAnswerCorrect ? 'bg-green-100 border-green-300 text-green-800' : 'bg-red-100 border-red-300 text-red-800'}`}>
                                                {isAnswerCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                                                <div>
                                                    <p className="font-bold">{isAnswerCorrect ? "AWESOME!" : "SO CLOSE!"}</p>
                                                    <p className="text-sm">The answer is: <span className="font-bold underline">{story.questions?.[currentQuestionIndex]?.answer || story.answer}</span></p>
                                                </div>
                                            </div>
                                            <Button onClick={handleNextQuestion} className="w-full h-12 bg-purple-600 text-white font-bold rounded-xl">
                                                {currentQuestionIndex < 2 ? "Next Question" : "See Results"} <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6 space-y-4 animate-in zoom-in">
                                    <div className="inline-block p-4 bg-yellow-100 rounded-full mb-2">
                                        <Trophy className="w-12 h-12 text-yellow-600" />
                                    </div>
                                    <h4 className="text-3xl font-black text-purple-900">Quiz Complete!</h4>
                                    <p className="text-xl text-purple-700 font-bold">You got {score} out of 3 correct!</p>
                                    <Button onClick={resetQuiz} variant="outline" className="border-2 border-purple-300 text-purple-600 font-bold">Try Quiz Again</Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
                        <Library className="text-purple-500" /> Story Library
                    </h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedStories?.map((s:any) => (
                        <Card key={s.id} className="cursor-pointer border-b-4 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all relative group overflow-hidden">
                            <CardContent className="p-4 flex items-center gap-4" onClick={() => handleSelectStory(s)}>
                                <div className="text-5xl bg-slate-50 p-2 rounded-2xl">{s.emojiIcon}</div>
                                <div className="pr-6">
                                    <h4 className="font-bold text-lg text-slate-800 line-clamp-1">{s.title}</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase">{s.topic || 'Fun Story'}</p>
                                </div>
                            </CardContent>
                            {canEdit && (
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-200 hover:text-red-500 transition-opacity" 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}
                                >
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

// --- 7. ART STUDIO (CREATIVE ACADEMY) ---
function ArtStudio() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeTab, setActiveTab] = useState<'freestyle' | 'color-lab' | 'shapes' | 'gallery'>('freestyle');
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#4f46e5');
    const [brushSize, setBrushSize] = useState(8);
    
    // Color Lab State
    const [mix1, setMix1] = useState<string | null>(null);
    const [mix2, setMix2] = useState<string | null>(null);

    // Challenges State
    const [challenge, setChallenge] = useState("Can you draw a house using 1 Square and 1 Triangle?");

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
        const canvas = canvasRef.current; if (!canvas) return; 
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.strokeStyle = color; ctx.lineWidth = brushSize; 
        setIsDrawing(true);
    };

    const draw = (e: any) => {
        if (!isDrawing) return; 
        const canvas = canvasRef.current; if (!canvas) return; 
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
        ctx.lineTo(x, y); ctx.stroke();
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

    return (
        <div className="space-y-6">
            {/* Art Academy Navigation */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit mx-auto border border-slate-200">
                <Button variant={activeTab === 'freestyle' ? 'default' : 'ghost'} onClick={() => setActiveTab('freestyle')} className="rounded-xl">Freestyle</Button>
                <Button variant={activeTab === 'color-lab' ? 'default' : 'ghost'} onClick={() => setActiveTab('color-lab')} className="rounded-xl">Color Lab</Button>
                <Button variant={activeTab === 'shapes' ? 'default' : 'ghost'} onClick={() => setActiveTab('shapes')} className="rounded-xl">Shape Quest</Button>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* TOOLBAR */}
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
                            <div className="pt-4 border-t border-slate-100">
                                <Button variant="outline" onClick={clearCanvas} className="w-full text-red-500 border-red-100 hover:bg-red-50 rounded-xl">
                                    <Trash2 className="w-4 h-4 mr-2" /> Clear All
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* CANVAS AREA */}
                <div className="lg:col-span-3 space-y-4">
                    {activeTab === 'shapes' && (
                        <div className="bg-indigo-600 p-4 rounded-2xl text-white flex justify-between items-center shadow-lg animate-in slide-in-from-top-4">
                            <div className="flex items-center gap-3">
                                <Star className="text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-lg">{challenge}</span>
                            </div>
                            <Button size="sm" variant="secondary" onClick={() => setChallenge("Now draw a 🌲 using 3 Triangles!")}>Next Quest</Button>
                        </div>
                    )}

                    <div className="relative bg-white rounded-[40px] shadow-2xl border-8 border-slate-50 overflow-hidden cursor-crosshair touch-none">
                        <canvas 
                            ref={canvasRef} 
                            className="w-full touch-none"
                            onMouseDown={startDrawing} 
                            onMouseMove={draw} 
                            onMouseUp={() => setIsDrawing(false)} 
                            onMouseLeave={() => setIsDrawing(false)}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={() => setIsDrawing(false)}
                        />
                        
                        {/* CANVAS WATERMARK/DECORATION */}
                        <div className="absolute bottom-4 right-6 pointer-events-none opacity-20 flex items-center gap-2">
                            <Palette className="w-6 h-6" />
                            <span className="font-black italic">Junior Artist Studio</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {['🎨', '🖌️', '🖍️', '✏️'].map((e, i) => <span key={i} className="text-2xl">{e}</span>)}
                            </div>
                            <span className="text-sm font-bold text-slate-500">Practice makes perfect!</span>
                        </div>
                        <Button onClick={() => {
                            const link = document.createElement('a');
                            link.download = 'my-masterpiece.png';
                            link.href = canvasRef.current!.toDataURL();
                            link.click();
                            confetti();
                        }} className="bg-green-600 rounded-xl px-6">
                            <Save className="mr-2 h-4 w-4" /> Save Masterpiece
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StickerBook() {
    return <div className="text-center p-8"><h3 className="text-2xl font-bold">My Sticker Book</h3><p className="text-muted-foreground">This feature is coming soon!</p></div>;
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
            <TabsList className="grid w-full grid-cols-8 h-24 bg-white p-2 rounded-2xl shadow-sm border-2 border-slate-100 mb-8 overflow-x-auto">
                <TabsTrigger value="coach" className="rounded-xl data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Mic className="w-5 h-5"/> Coach</TabsTrigger>
                <TabsTrigger value="phonics" className="rounded-xl data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Music className="w-5 h-5"/> Phonics</TabsTrigger>
                <TabsTrigger value="abc" className="rounded-xl data-[state=active]:bg-green-100 data-[state=active]:text-green-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Brain className="w-5 h-5"/> ABCs</TabsTrigger>
                <TabsTrigger value="math" className="rounded-xl data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Calculator className="w-5 h-5"/> Math</TabsTrigger>
                <TabsTrigger value="stories" className="rounded-xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><BookOpen className="w-5 h-5"/> Stories</TabsTrigger>
                <TabsTrigger value="science" className="mt-0"><ScienceWorld canEdit={canEdit} /></TabsContent>
                <TabsTrigger value="art" className="rounded-xl data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Palette className="w-5 h-5"/> Art</TabsTrigger>
                <TabsTrigger value="rewards" className="rounded-xl data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Trophy className="w-5 h-5"/> Rewards</TabsTrigger>
            </TabsList>
            
            {/* CONTENT AREAS */}
            <div className="min-h-[500px]">
                <TabsContent value="coach" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-pink-200"><VoiceCoach canEdit={canEdit} /></div></TabsContent>
                <TabsContent value="phonics" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-teal-200"><PhonicsForest /></div></TabsContent>
                <TabsContent value="abc" className="mt-0"><div className="bg-gradient-to-b from-green-50 to-white p-8 rounded-3xl shadow-xl border-b-8 border-green-200"><ABCKingdom /></div></TabsContent>
                <TabsContent value="math" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-orange-200 relative"><MathPlayground /></div></TabsContent>
                <TabsContent value="stories" className="mt-0"><StorySpark canEdit={canEdit} /></TabsContent>
                <TabsContent value="science" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-blue-200"><ScienceWorld canEdit={canEdit} /></TabsContent>
                <TabsContent value="art" className="mt-0"><div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300"><ArtStudio /></div></TabsContent>
                <TabsContent value="rewards" className="mt-0"><StickerBook /></TabsContent>
            </div>
        </Tabs>
      </div>
    </div>
  );
}

    