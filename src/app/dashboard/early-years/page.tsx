
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
        a = Math.floor(Math.random() * 4) + 2; 
        b = Math.floor(Math.random() * 4) + 2; 
        ans = a * b;
        displayPrompt = `${a} groups of ${b}`;
        options = [ans, ans + b, ans - a].filter(n => n > 0).sort(() => Math.random() - 0.5);
        if (options.length < 3) options.push(ans + 1);
        break;
      case 'div':
        b = Math.floor(Math.random() * 3) + 2; 
        ans = Math.floor(Math.random() * 4) + 2; 
        a = b * ans; 
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
      <div className="flex gap-2 mb-4 bg-slate-100 p-2 rounded-3xl w-full overflow-x-auto no-scrollbar">
          {(['add', 'sub', 'mul', 'div', 'compare', 'patterns', 'shapes', 'time'] as MathMode[]).map((m) => (
            <Button 
                key={m}
                variant={mode === m ? 'default' : 'ghost'} 
                onClick={() => setMode(m)} 
                className={`rounded-2xl capitalize font-bold min-w-[100px] ${mode === m ? 'bg-orange-500 shadow-md' : 'text-slate-500'}`}
            >
                {m === 'mul' ? '× Multi' : m === 'div' ? '÷ Divide' : m}
            </Button>
          ))}
      </div>

      <Card className="w-full max-w-md bg-white border-4 border-orange-100 shadow-xl rounded-[40px] overflow-hidden">
        <CardContent className="p-8 flex flex-col items-center min-h-[300px] justify-center">
            
            {mode === 'mul' && (
                <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `repeat(${question.b}, minmax(0, 1fr))` }}>
                    {Array.from({ length: question.a * question.b }).map((_, i) => (
                        <span key={i} className="text-3xl animate-in zoom-in">{question.icon}</span>
                    ))}
                </div>
            )}

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

            {mode === 'shapes' && <div className="text-9xl text-blue-500 mb-6">{question.a}</div>}
            
            {mode === 'time' && (
                <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center mb-6 relative bg-white">
                    <div className="text-2xl font-black">{question.a.split(':')[0]}</div>
                    <div className="absolute top-2">12</div>
                    <div className="absolute bottom-2">6</div>
                    <div className="absolute left-2">9</div>
                    <div className="absolute right-2">3</div>
                </div>
            )}
            
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
                        <span className="text-orange-500">{question.displayPrompt || question.a}</span>
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
            className="h-20 bg-white border-b-8 border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-orange-600 text-xl font-black rounded-3xl transition-all active:translate-y-2 active:border-b-0"
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
        // Note: Ensure your backend 'generateJuniorStory' is updated to handle (topic, wordCount)
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
        
        const currentQ = story.questions[currentQuestionIndex];
        const correct = currentQ.answer.toLowerCase().trim().includes(userAnswer.toLowerCase().trim()) || 
                        userAnswer.toLowerCase().trim().includes(currentQ.answer.toLowerCase().trim());
        
        setIsAnswerCorrect(correct);
        setIsAnswerSubmitted(true);
        
        if (correct) {
            setScore(prev => prev + 1);
            speak('Great job! That is correct.');
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
        } else {
            speak('Not quite, but good try!');
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

                        {/* Multi-Question Quiz Section */}
                        <div className="bg-white p-6 rounded-3xl border-4 border-purple-200 shadow-inner">
                            {!quizFinished ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="bg-purple-200 text-purple-700 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                                            Question {currentQuestionIndex + 1} of {story.questions?.length || 3}
                                        </span>
                                        <span className="text-purple-600 font-bold">Score: {score}</span>
                                    </div>
                                    
                                    <p className="text-2xl font-bold text-purple-900 leading-tight">
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
                                            <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${isAnswerCorrect ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'}`}>
                                                {isAnswerCorrect ? <CheckCircle2 className="w-6 h-6 mt-1" /> : <XCircle className="w-6 h-6 mt-1" />}
                                                <div>
                                                    <p className="font-black text-lg">{isAnswerCorrect ? "AWESOME!" : "SO CLOSE!"}</p>
                                                    <p className="font-medium">The answer is: <span className="font-bold underline">{story.questions?.[currentQuestionIndex]?.answer || story.answer}</span></p>
                                                </div>
                                            </div>
                                            <Button onClick={handleNextQuestion} className="w-full h-12 bg-purple-600 text-white font-bold text-lg rounded-xl">
                                                {currentQuestionIndex < (story.questions?.length || 3) - 1 ? "Next Question" : "See Final Score"} <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6 space-y-4 animate-in zoom-in">
                                    <div className="inline-block p-4 bg-yellow-100 rounded-full mb-2">
                                        <Trophy className="w-12 h-12 text-yellow-600" />
                                    </div>
                                    <h3 className="text-3xl font-black text-purple-900">Quiz Complete!</h3>
                                    <p className="text-xl text-purple-700 font-bold">You got {score} out of {story.questions.length} correct!</p>
                                    <Button onClick={resetQuiz} variant="ghost" className="text-purple-400 hover:text-purple-600 font-bold">Try Quiz Again</Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div>
                <h3 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <Library className="text-purple-500" /> Story Library
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedStories?.map((s:any) => (
                        <Card key={s.id} className="cursor-pointer border-b-8 border-purple-200 hover:border-purple-400 hover:-translate-y-1 transition-all relative group rounded-3xl overflow-hidden">
                            <CardContent className="p-6 flex items-center gap-4" onClick={() => handleSelectStory(s)}>
                                <div className="text-5xl bg-slate-50 p-3 rounded-2xl shadow-inner">{s.emojiIcon}</div>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-black text-lg text-slate-800 line-clamp-1">{s.title}</h4>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        <span>{s.wordCount || '?'} Words</span>
                                        <span>•</span>
                                        <span className="text-purple-400">{s.topic || 'General'}</span>
                                    </div>
                                </div>
                            </CardContent>
                            {canEdit && (
                                <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-200 hover:text-red-500 hover:bg-red-50 transition-opacity" 
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

// --- 6. SCIENCE WORLD ---
function ScienceWorld({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore(); 
    const { user } = useUser(); 
    const { toast } = useToast();
    const [topic, setTopic] = useState(''); 
    const [fact, setFact] = useState<any>(null); 
    const [loading, setLoading] = useState(false);
    
    const scienceQuery = useMemoFirebase(() => (firestore && user) ? query(collection(firestore, 'junior_science'), orderBy('createdAt', 'desc')) : null, [firestore, user]);
    const { data: savedScience, forceRefetch } = useCollection<any>(scienceQuery);
    
    const handleGenerate = async () => { setLoading(true); const res = await generateJuniorScience(topic); if(res.success) setFact(res.data); setLoading(false); };
    const handleSave = async () => { if(!user||!fact||!firestore)return; await addDoc(collection(firestore,'junior_science'),{...fact,createdAt:serverTimestamp(),createdBy:user.uid}); setFact(null); forceRefetch(); toast({title: "Fact Saved!"}) };
    const handleDelete = async (id: string) => { if(!firestore) return; if(confirm("Delete fact?")) { await deleteDoc(doc(firestore, 'junior_science', id)); forceRefetch(); }};

    return (
        <div className="space-y-8">
            {canEdit && (
                <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-blue-200">
                    <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2"><Atom /> Discovery Lab</h3>
                    <div className="flex gap-2"><Input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic (e.g. Volcanoes)" className="text-lg h-12 rounded-xl"/><Button onClick={handleGenerate} disabled={loading} className="h-12 rounded-xl bg-blue-600">{loading?<Loader2 className="animate-spin"/>:"Discover"}</Button></div>
                </div>
            )}
            {fact && <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-8 rounded-3xl text-white text-center shadow-xl animate-in zoom-in cursor-pointer hover:scale-105 transition-transform" onClick={() => speak(`${fact.title}. ${fact.fact}`)}><div className="text-8xl mb-4 animate-bounce">{fact.emojiIcon}</div><h2 className="text-3xl font-extrabold mb-4">{fact.title}</h2><p className="text-xl font-medium">{fact.fact}</p>{canEdit && <Button onClick={(e) => { e.stopPropagation(); handleSave(); }} variant="secondary" className="mt-6 font-bold">Save Card</Button>}</div>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{savedScience?.map((s:any)=>(<div key={s.id} className="relative group bg-white p-4 rounded-2xl shadow border-b-4 border-blue-200 flex flex-col items-center text-center cursor-pointer hover:shadow-md" onClick={() => { setFact(s); speak(`${s.title}. ${s.fact}`); }}><div className="text-4xl mb-2">{s.emojiIcon}</div><h4 className="font-bold text-slate-800 leading-tight">{s.title}</h4>{canEdit && <Button size="icon" variant="ghost" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}><Trash2 className="w-3 h-3"/></Button>}</div>))}</div>
        </div>
    );
}

// --- 7. ART STUDIO ---
function ArtStudio() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.parentElement?.clientWidth || 800;
            canvas.height = canvas.parentElement?.clientHeight || 600;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineCap = 'round';
                ctx.lineWidth = 5;
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, []);

    const startDrawing = (e: any) => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left; const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.strokeStyle = color; ctx.lineWidth = 5; setIsDrawing(true);
    };
    const draw = (e: any) => {
        if (!isDrawing) return; const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left; const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.lineTo(x, y); ctx.stroke();
    };
    const clearCanvas = () => { const canvas = canvasRef.current; if(canvas){ const ctx=canvas.getContext('2d'); if(ctx){ctx.fillStyle="white";ctx.fillRect(0,0,canvas.width,canvas.height);} } };

    return (
        <div className="space-y-4">
            <div className="flex gap-2 bg-white p-4 rounded-2xl shadow-sm border-2 border-slate-100 justify-center">
                {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#FFC0CB'].map(c => (<button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-slate-800 scale-110' : 'border-slate-200'}`} style={{ backgroundColor: c }} />))}
                <Button variant="outline" onClick={clearCanvas} size="sm" className="ml-4 text-red-500">Clear</Button>
            </div>
            <div className="relative h-[400px] w-full bg-white rounded-3xl shadow-xl border-4 border-slate-200 overflow-hidden cursor-crosshair touch-none">
                <canvas ref={canvasRef} className="w-full h-full" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={() => setIsDrawing(false)} />
            </div>
        </div>
    );
}

// --- 8. STICKER BOOK ---
function StickerBook() {
    const { user } = useUser(); 
    const firestore = useFirestore();
    const stickerQuery = useMemoFirebase(() => (user && firestore) ? query(collection(firestore, 'junior_stickers'), where('userId', '==', user.uid), orderBy('earnedAt', 'desc')) : null, [firestore, user]);
    const { data: stickers } = useCollection<any>(stickerQuery);

    return (
        <div className="bg-yellow-50 p-6 rounded-3xl border-4 border-yellow-200 min-h-[300px]">
            <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-600"/> My Sticker Book
            </h3>
            {!stickers || stickers.length === 0 ? <div className="text-center py-10 text-yellow-700 opacity-50"><Gift className="h-16 w-16 mx-auto mb-2"/><p>Keep learning to earn stickers!</p></div> : (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                    {stickers.map(s => (<div key={s.id} className="aspect-square bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-2 animate-in zoom-in"><span className="text-4xl">{s.emoji}</span><span className="text-[10px] text-slate-500 mt-1 font-bold">{s.name}</span></div>))}
                </div>
            )}
        </div>
    );
}

// --- MAIN PAGE ---
export default function JuniorCampusPage() {
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');
  const { toast } = useToast(); // Moved toast hook here for reuse

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
                <TabsTrigger value="science" className="rounded-xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Atom className="w-5 h-5"/> Science</TabsTrigger>
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
                <TabsContent value="science" className="mt-0"><ScienceWorld canEdit={canEdit} /></TabsContent>
                <TabsContent value="art" className="mt-0"><div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300"><ArtStudio /></div></TabsContent>
                <TabsContent value="rewards" className="mt-0"><StickerBook /></TabsContent>
            </div>
        </Tabs>
      </div>
    </div>
  );
}
