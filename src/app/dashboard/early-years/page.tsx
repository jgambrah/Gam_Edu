

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, increment } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, Trophy, Gift 
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

// --- 1. VOICE COACH (UPGRADED) ---
function VoiceCoach({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [challenge, setChallenge] = useState<any>(null);
    const [isListening, setIsListening] = useState(false);
    const [feedback, setFeedback] = useState("Tap the Mic and say the word!");
    
    // Teacher State
    const [newWord, setNewWord] = useState("");
    const [generatedPreview, setGeneratedPreview] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [viewMode, setViewMode] = useState<'practice' | 'library'>('practice');

    // Fetch Saved Phonics Words
    const phonicsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_phonics'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: wordLibrary, isLoading: libraryLoading, forceRefetch } = useCollection<any>(phonicsQuery);

    const pickRandomWord = useCallback(() => {
        if (!wordLibrary || wordLibrary.length === 0) return;
        const random = wordLibrary[Math.floor(Math.random() * wordLibrary.length)];
        setChallenge(random);
        setFeedback("Tap the Mic and say the word!");
    }, [wordLibrary]);

    // Initial Load: Pick random word from library
    useEffect(() => { 
        if (wordLibrary && wordLibrary.length > 0 && !challenge) {
            pickRandomWord();
        }
    }, [wordLibrary, challenge, pickRandomWord]);

    // --- TEACHER ACTIONS ---
    const handlePreview = async () => {
        if (!newWord) return;
        setIsGenerating(true);
        const res = await generateWordDetails(newWord);
        if (res.success) setGeneratedPreview(res.data);
        setIsGenerating(false);
    };

    const handleSaveWord = async () => {
        if (!generatedPreview || !firestore) return;
        await addDoc(collection(firestore, 'junior_phonics'), {
            ...generatedPreview,
            createdAt: serverTimestamp()
        });
        setGeneratedPreview(null);
        setNewWord("");
        toast({ title: "Success", description: "Word added to Class Library!" });
        forceRefetch();
    };

    const handleDelete = async (id: string) => {
        if (!firestore) return;
        if (confirm("Remove this word?")) {
            await deleteDoc(doc(firestore, 'junior_phonics', id));
            toast({ title: "Removed", description: "Word deleted from the library." });
            forceRefetch();
        }
    };

    // --- STUDENT ACTIONS ---
    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Please use Google Chrome for Speech features.");
            return;
        }
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        setIsListening(true);
        setFeedback("Listening... 👂");

        recognition.onresult = (event: any) => {
            const spoken = event.results[0][0].transcript.toLowerCase();
            const target = challenge.word.toLowerCase();
            setIsListening(false);

            if (spoken.includes(target) || target.includes(spoken)) {
                setFeedback(`PERFECT! You said "${spoken}" 🎉`);
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#4f46e5', '#16a34a'] });
                speak(`Great job! ${challenge.word}`);
                setTimeout(pickRandomWord, 3000); // Auto next
            } else {
                setFeedback(`I heard "${spoken}". Try again!`);
                speak(`Almost! Try saying ${challenge.word}`);
            }
        };
        recognition.onerror = () => { setIsListening(false); setFeedback("I didn't hear you. Try again!"); };
    };

    return (
        <div className="space-y-6">
            {/* VIEW TOGGLE FOR TEACHERS */}
            {canEdit && (
                <div className="flex justify-end mb-4">
                    <div className="bg-pink-100 p-1 rounded-lg flex gap-1">
                        <Button size="sm" variant={viewMode === 'practice' ? 'default' : 'ghost'} onClick={() => setViewMode('practice')} className={viewMode === 'practice' ? 'bg-pink-600' : 'text-pink-700'}>
                            <Mic className="w-4 h-4 mr-2"/> Practice
                        </Button>
                        <Button size="sm" variant={viewMode === 'library' ? 'default' : 'ghost'} onClick={() => setViewMode('library')} className={viewMode === 'library' ? 'bg-pink-600' : 'text-pink-700'}>
                            <Library className="w-4 h-4 mr-2"/> Library Manager
                        </Button>
                    </div>
                </div>
            )}

            {/* MODE: PRACTICE (STUDENT VIEW) */}
            {viewMode === 'practice' && (
                <div className="flex flex-col items-center text-center space-y-6">
                    {(libraryLoading || (!wordLibrary || wordLibrary.length === 0)) ? (
                        <div className="text-center p-8 bg-slate-50 rounded-xl border-2 border-dashed">
                            {libraryLoading ? <Loader2 className="animate-spin h-6 w-6"/> : <p className="text-slate-500 mb-2">No words in the library yet.</p>}
                            {canEdit && !libraryLoading && <Button onClick={() => setViewMode('library')} variant="link">Go to Library to add words</Button>}
                        </div>
                    ) : !challenge ? (
                        <Button onClick={pickRandomWord}>Start</Button>
                    ) : (
                        <div className="animate-in zoom-in space-y-6 max-w-md mx-auto">
                            <div className="text-9xl mb-2 hover:scale-110 transition-transform cursor-pointer drop-shadow-xl" onClick={() => speak(challenge.word)}>
                                {challenge.emoji}
                            </div>
                            
                            <div>
                                <h2 className="text-6xl font-black text-slate-800 tracking-wide mb-2">{challenge.word}</h2>
                                <p className="text-2xl text-slate-400 font-mono tracking-widest">/{challenge.phonetic}/</p>
                            </div>

                            <div className="bg-pink-50 p-6 rounded-3xl border-4 border-pink-200 shadow-sm cursor-pointer hover:bg-pink-100 transition-colors" onClick={() => speak(challenge.sentence)}>
                                <p className="text-xl text-pink-800 font-bold">"{challenge.sentence}"</p>
                                <div className="flex items-center justify-center gap-2 mt-2 text-pink-400 text-sm font-bold uppercase tracking-wide">
                                    <Volume2 className="w-4 h-4"/> Tap to Listen
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-4 py-4">
                                <button 
                                    onClick={startListening}
                                    disabled={isListening}
                                    className={`h-28 w-28 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${isListening ? 'bg-red-500 animate-pulse ring-4 ring-red-200' : 'bg-gradient-to-tr from-pink-500 to-rose-500 ring-4 ring-pink-200'}`}
                                >
                                    <Mic className="h-12 w-12 text-white" />
                                </button>
                                <p className={`font-bold text-lg px-4 py-2 rounded-full ${feedback.includes("PERFECT") ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                                    {feedback}
                                </p>
                            </div>

                            <Button onClick={pickRandomWord} variant="ghost" className="mt-8 text-slate-400 hover:text-slate-600">
                                Skip Word <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* MODE: LIBRARY (TEACHER VIEW) */}
            {viewMode === 'library' && canEdit && (
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-pink-100">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Wand2 className="text-pink-500"/> Add New Word to Curriculum</h3>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Type a word (e.g. Photosynthesis, Elephant, Run)" 
                                value={newWord} 
                                onChange={e => setNewWord(e.target.value)}
                                className="text-lg"
                            />
                            <Button onClick={handlePreview} disabled={isGenerating} className="bg-pink-600 hover:bg-pink-700 min-w-[120px]">
                                {isGenerating ? <Loader2 className="animate-spin"/> : "Generate"}
                            </Button>
                        </div>
                        {generatedPreview && (
                            <div className="mt-4 p-4 bg-pink-50 rounded-xl border border-pink-200 flex items-center justify-between animate-in slide-in-from-top-2">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl">{generatedPreview.emoji}</span>
                                    <div>
                                        <p className="font-bold text-lg">{generatedPreview.word} <span className="text-sm font-normal text-slate-500">/{generatedPreview.phonetic}/</span></p>
                                        <p className="text-sm text-slate-600">{generatedPreview.sentence}</p>
                                    </div>
                                </div>
                                <Button onClick={handleSaveWord} className="bg-green-600 hover:bg-green-700"><Save className="w-4 h-4 mr-2"/> Save</Button>
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {wordLibrary?.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{item.emoji}</span>
                                    <div>
                                        <p className="font-bold text-slate-800">{item.word}</p>
                                        <p className="text-xs text-slate-400">/{item.phonetic}/</p>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" className="text-red-300 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
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

// --- 2. PHONICS FOREST ---
function PhonicsForest() {
    const soundGroups = [
        { name: "Vowels", color: "bg-red-100 text-red-600 border-red-200", sounds: ["a", "e", "i", "o", "u", "ay", "ee", "igh", "ow", "oo"] },
        { name: "Digraphs", color: "bg-green-100 text-green-600 border-green-200", sounds: ["ch", "sh", "th", "wh", "ph", "ck", "ng", "qu"] },
        { name: "Blends", color: "bg-blue-100 text-blue-600 border-blue-200", sounds: ["bl", "br", "cl", "cr", "dr", "fl", "fr", "gl", "gr", "pl", "pr", "sl", "sm", "sn", "sp", "st", "sw", "tr"] },
    ];
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2"><h2 className="text-3xl font-bold text-green-800">Phonics Forest 🌳</h2><p className="text-green-600">Tap a sound to hear it!</p></div>
            {soundGroups.map((group) => (
                <div key={group.name} className="space-y-3">
                    <h3 className="font-bold text-slate-500 uppercase text-sm tracking-wider ml-2">{group.name}</h3>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {group.sounds.map((sound) => (
                            <button key={sound} onClick={() => speak(sound)} className={`aspect-square rounded-2xl border-b-4 font-bold text-2xl shadow-sm hover:-translate-y-1 transition-all flex items-center justify-center ${group.color} bg-white`}>{sound}</button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- 3. ABC KINGDOM ---
function ABCKingdom() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    return (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {alphabet.map(letter => (
                <button 
                    key={letter}
                    onClick={() => speak(letter)}
                    className="aspect-square bg-white rounded-2xl shadow-md border-b-4 border-slate-200 text-4xl font-extrabold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 hover:-translate-y-1 transition-all flex items-center justify-center"
                >
                    {letter}
                </button>
            ))}
        </div>
    );
}

// --- 4. MATH PLAYGROUND (WITH REWARDS) ---
function MathPlayground() {
  const [mode, setMode] = useState<'add' | 'sub' | 'mul' | 'div'>('add');
  const [question, setQuestion] = useState({ a: 2, b: 3, icon: '🍎', ans: 5 });
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState("");
  const { user } = useUser(); 
  const firestore = useFirestore();
  const { toast } = useToast();
  const [streak, setStreak] = useState(0); 

  const generateQuestion = useCallback(() => {
    const icons = ['🍎', '🍌', '🐶', '🐱', '⭐', '🚗', '🦖', '🍪', '🎈', '⚽️'];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    let a = 0, b = 0, ans = 0;
    if (mode === 'add') { a = Math.floor(Math.random() * 9) + 1; b = Math.floor(Math.random() * 9) + 1; ans = a + b; } 
    else if (mode === 'sub') { a = Math.floor(Math.random() * 10) + 2; b = Math.floor(Math.random() * (a - 1)) + 1; ans = a - b; } 
    else if (mode === 'mul') { a = Math.floor(Math.random() * 5) + 1; b = Math.floor(Math.random() * 5) + 1; ans = a * b; } 
    else if (mode === 'div') { b = Math.floor(Math.random() * 4) + 2; ans = Math.floor(Math.random() * 5) + 1; a = b * ans; }
    setQuestion({ a, b, icon, ans });
    setFeedback("");
    setOptions([ans, ans + 1, Math.max(0, ans - (Math.floor(Math.random() * 2) + 1))].sort(() => Math.random() - 0.5));
  }, [mode]);

  useEffect(() => { generateQuestion(); }, [generateQuestion]);

  const checkAnswer = async (val: number) => {
    if (val === question.ans) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFeedback("CORRECT! 🎉");
      confetti({ particleCount: 150 });
      speak("Great Job!");

      // REWARD LOGIC: Every 5 correct answers, give a sticker
      if (newStreak > 0 && newStreak % 5 === 0 && user && firestore) {
          const stickers = ['🦕','🚀','🦄','🦁','🍕','⭐','🌈','⚽'];
          const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
          
          await addDoc(collection(firestore, 'junior_stickers'), {
              userId: user.uid,
              emoji: randomSticker,
              name: 'Math Whiz',
              earnedAt: serverTimestamp()
          });
          toast({ title: "New Sticker!", description: `You earned a ${randomSticker}!` });
      }

      setTimeout(generateQuestion, 2000);
    } else {
      setStreak(0); // Reset streak on error
      setFeedback("Try Again! 🤔");
      speak("Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex gap-2 mb-4 bg-white p-2 rounded-full shadow-sm">
          <Button variant={mode === 'add' ? 'default' : 'ghost'} onClick={() => setMode('add')} className="rounded-full bg-green-500 hover:bg-green-600 text-white font-bold">+</Button>
          <Button variant={mode === 'sub' ? 'default' : 'ghost'} onClick={() => setMode('sub')} className="rounded-full bg-red-500 hover:bg-red-600 text-white font-bold">-</Button>
          <Button variant={mode === 'mul' ? 'default' : 'ghost'} onClick={() => setMode('mul')} className="rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold">×</Button>
          <Button variant={mode === 'div' ? 'default' : 'ghost'} onClick={() => setMode('div')} className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold">÷</Button>
      </div>

      <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-5xl my-4">
        {Array.from({ length: question.a }).map((_, i) => <span key={i}>{question.icon}</span>)}
        <span className="text-slate-400 mx-2 font-bold">{mode === 'add' ? '+' : mode === 'sub' ? '-' : mode === 'mul' ? '×' : '÷'}</span>
        {Array.from({ length: question.b }).map((_, i) => <span key={i}>{question.icon}</span>)}
      </div>
      
      <div className="flex items-center gap-4 text-6xl font-bold text-slate-700">
        <span>{question.a}</span>
        <span className="text-slate-400">{mode === 'add' ? '+' : mode === 'sub' ? '-' : mode === 'mul' ? '×' : '÷'}</span>
        <span>{question.b}</span>
        <span className="text-slate-400">=</span>
        <span className="text-blue-600">?</span>
      </div>

      <div className="flex gap-6 mt-8">
        {options.map((opt, i) => (
          <button key={i} onClick={() => checkAnswer(opt)} className="w-24 h-24 bg-yellow-400 hover:bg-yellow-300 text-white text-5xl font-bold rounded-3xl shadow-[0_8px_0_rgb(202,138,4)] active:shadow-none active:translate-y-2 transition-all">
            {opt}
          </button>
        ))}
      </div>
      <div className="h-10 text-3xl font-bold text-green-600 mt-4">{feedback}</div>
    </div>
  );
}

// --- 5. STORY SPARK ---
function StorySpark({ canEdit }: { canEdit: boolean }) {
    const { user } = useUser(); const firestore = useFirestore(); const { toast } = useToast(); const [story, setStory] = useState<any>(null); const [topic, setTopic] = useState(''); const [loading, setLoading] = useState(false);
    const storiesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_stories'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: savedStories, forceRefetch } = useCollection<any>(storiesQuery);
    
    const handleGenerate = async () => { setLoading(true); const res = await generateJuniorStory(topic); if(res.success) setStory(res.data); setLoading(false); };
    const handleSave = async () => { if(!user||!story||!firestore)return; await addDoc(collection(firestore,'junior_stories'),{...story,topic,createdAt:serverTimestamp(),createdBy:user.uid}); setStory(null); forceRefetch(); toast({ title: "Story Saved!" }); };
    const handleDelete = async (id: string) => { if(!firestore) return; if(confirm("Delete story?")) { await deleteDoc(doc(firestore, 'junior_stories', id)); forceRefetch(); } };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2"><Wand2 /> New Story</h3>
                <div className="flex gap-2"><Input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic (e.g. Space Cat)" className="text-lg h-12 rounded-xl"/><Button onClick={handleGenerate} disabled={loading} className="h-12 rounded-xl bg-purple-600">{loading?<Loader2 className="animate-spin"/>:"Write"}</Button></div>
            </div>
            {story && <Card className="border-4 border-yellow-300 bg-yellow-50 animate-in zoom-in"><CardContent className="p-6 space-y-4"><h3 className="text-3xl text-center">{story.emojiIcon} {story.title}</h3><p className="text-xl leading-relaxed">{story.content}</p><div className="bg-white p-4 rounded-xl border border-yellow-200"><p className="font-bold text-orange-600">Quiz: {story.question}</p><p className="text-slate-400 text-sm mt-1 hover:text-green-600 cursor-pointer">Answer: {story.answer}</p></div><div className="flex gap-2"><Button onClick={()=>speak(story.content)} variant="outline" className="flex-1">Read</Button>{canEdit && <Button onClick={handleSave} className="flex-1 bg-green-600">Save</Button>}</div></CardContent></Card>}
            <div><h3 className="text-2xl font-bold text-slate-700 mb-4">📚 Library</h3><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{savedStories?.map((s:any)=>(<Card key={s.id} className="cursor-pointer border-l-4 border-l-purple-500 hover:shadow-lg relative group"><CardContent className="p-4 flex items-center gap-4" onClick={()=>{setStory(s);speak(s.title);}}><div className="text-4xl">{s.emojiIcon}</div><div><h4 className="font-bold text-lg">{s.title}</h4></div></CardContent>{canEdit && <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500" onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}><Trash2 className="w-4 h-4"/></Button>}</Card>))}</div></div>
        </div>
    );
}

// --- 6. SCIENCE WORLD (SEPARATED) ---
function ScienceWorld({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore(); const { user } = useUser(); const { toast } = useToast(); const [topic, setTopic] = useState(''); const [fact, setFact] = useState<any>(null); const [loading, setLoading] = useState(false);
    const scienceQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_science'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: savedScience, forceRefetch } = useCollection<any>(scienceQuery);
    
    const handleGenerate = async () => { setLoading(true); const res = await generateJuniorScience(topic); if(res.success) setFact(res.data); setLoading(false); };
    const handleSave = async () => { if(!user||!fact||!firestore)return; await addDoc(collection(firestore,'junior_science'),{...fact,createdAt:serverTimestamp(),createdBy:user.uid}); setFact(null); forceRefetch(); toast({title: "Fact Saved!"}) };
    const handleDelete = async (id: string) => { if(!firestore) return; if(confirm("Delete fact?")) { await deleteDoc(doc(firestore, 'junior_science', id)); forceRefetch(); }};

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2"><Atom /> Discovery Lab</h3>
                <div className="flex gap-2"><Input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic (e.g. Volcanoes)" className="text-lg h-12 rounded-xl"/><Button onClick={handleGenerate} disabled={loading} className="h-12 rounded-xl bg-blue-600">{loading?<Loader2 className="animate-spin"/>:"Discover"}</Button></div>
            </div>
            {fact && <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-8 rounded-3xl text-white text-center shadow-xl animate-in zoom-in"><div className="text-8xl mb-4 animate-bounce">{fact.emojiIcon}</div><h2 className="text-3xl font-extrabold mb-4">{fact.title}</h2><p className="text-xl font-medium">{fact.fact}</p>{canEdit && <Button onClick={handleSave} variant="secondary" className="mt-6 font-bold">Save Card</Button>}</div>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{savedScience?.map((s:any)=>(<div key={s.id} className="relative group bg-white p-4 rounded-2xl shadow border-b-4 border-blue-200 flex flex-col items-center text-center"><div className="text-4xl mb-2">{s.emojiIcon}</div><h4 className="font-bold text-slate-800 leading-tight">{s.title}</h4>{canEdit && <Button size="icon" variant="ghost" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500" onClick={() => handleDelete(s.id)}><Trash2 className="w-3 h-3"/></Button>}</div>))}</div>
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
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border-2 border-slate-100">
                <div className="flex gap-2">
                    {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#FFC0CB'].map(c => (<button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-slate-800 scale-110' : 'border-slate-200'}`} style={{ backgroundColor: c }} />))}
                </div>
                <Button variant="outline" onClick={clearCanvas} className="text-red-500 hover:text-red-700">Clear</Button>
            </div>
            <div className="relative h-[400px] w-full bg-white rounded-3xl shadow-xl border-4 border-slate-200 overflow-hidden cursor-crosshair touch-none">
                <canvas ref={canvasRef} className="w-full h-full" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onMouseLeave={() => setIsDrawing(false)} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={() => setIsDrawing(false)} />
            </div>
        </div>
    );
}

// --- 8. STICKER BOOK ---
function StickerBook() {
    const { user } = useUser(); const firestore = useFirestore();
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

  return (
    <div className="min-h-screen bg-[#F0F9FF] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto mb-8 flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border-b-4 border-slate-200">
        <div className="bg-yellow-400 p-3 rounded-2xl shadow-inner"><Rabbit className="h-10 w-10 text-white" /></div>
        <div><h1 className="text-4xl font-extrabold text-slate-800">Junior Campus</h1><p className="text-slate-500 font-medium">Learn, Play, and Grow!</p></div>
      </div>
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="coach" className="w-full">
            <TabsList className="grid w-full grid-cols-7 h-24 bg-white p-2 rounded-2xl shadow-sm border-2 border-slate-100 mb-8 overflow-x-auto">
                <TabsTrigger value="coach" className="rounded-xl data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Mic className="w-5 h-5"/> Voice Coach</TabsTrigger>
                <TabsTrigger value="phonics" className="rounded-xl data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Music className="w-5 h-5"/> Phonics</TabsTrigger>
                <TabsTrigger value="abc" className="rounded-xl data-[state=active]:bg-green-100 data-[state=active]:text-green-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Brain className="w-5 h-5"/> ABCs</TabsTrigger>
                <TabsTrigger value="math" className="rounded-xl data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Calculator className="w-5 h-5"/> Math</TabsTrigger>
                <TabsTrigger value="stories" className="rounded-xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><BookOpen className="w-5 h-5"/> Stories</TabsTrigger>
                <TabsTrigger value="science" className="rounded-xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Atom className="w-5 h-5"/> Science</TabsTrigger>
                <TabsTrigger value="art" className="rounded-xl data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Palette className="w-5 h-5"/> Art</TabsTrigger>
            </TabsList>
            
            {/* CONTENT AREAS */}
            <div className="min-h-[500px]">
                <TabsContent value="coach" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-pink-200"><VoiceCoach canEdit={canEdit} /></div></TabsContent>
                <TabsContent value="phonics" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-teal-200"><PhonicsForest /></div></TabsContent>
                <TabsContent value="abc" className="mt-0"><div className="bg-gradient-to-b from-green-50 to-white p-8 rounded-3xl shadow-xl border-b-8 border-green-200"><ABCKingdom /></div></TabsContent>
                <TabsContent value="math" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-orange-200 relative"><div className="absolute top-4 right-4"><StickerBook /></div><MathPlayground /></div></TabsContent>
                <TabsContent value="stories" className="mt-0"><StorySpark canEdit={canEdit} /></TabsContent>
                <TabsContent value="science" className="mt-0"><ScienceWorld canEdit={canEdit} /></TabsContent>
                <TabsContent value="art" className="mt-0"><div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300"><ArtStudio /></div></TabsContent>
            </div>
        </Tabs>
      </div>
    </div>
  );
}

    