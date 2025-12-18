
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Plus, Brain, Calculator, BookOpen, Atom } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateJuniorScience } from '@/ai/flows/junior-actions';

// --- 1. NUMBER ZOO (MATH) ---
function MathPlayground() {
  const [mode, setMode] = useState<'add' | 'sub' | 'mul' | 'div'>('add');
  const [question, setQuestion] = useState({ a: 2, b: 3, icon: '🍎', ans: 5 });
  const [options, setOptions] = useState<number[]>([]);
  const [feedback, setFeedback] = useState("");

  const generateQuestion = () => {
    const icons = ['🍎', '🍌', '🐶', '🐱', '⭐', '🚗', '🦖', '🍪'];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    let a = 0, b = 0, ans = 0;

    // "Kid-Safe" Math Logic
    if (mode === 'add') {
        a = Math.floor(Math.random() * 9) + 1;
        b = Math.floor(Math.random() * 9) + 1;
        ans = a + b;
    } else if (mode === 'sub') {
        a = Math.floor(Math.random() * 10) + 2; 
        b = Math.floor(Math.random() * (a - 1)) + 1; // Ensure a > b (No negatives)
        ans = a - b;
    } else if (mode === 'mul') {
        a = Math.floor(Math.random() * 5) + 1; // Keep numbers small
        b = Math.floor(Math.random() * 5) + 1;
        ans = a * b;
    } else if (mode === 'div') {
        b = Math.floor(Math.random() * 4) + 2; 
        ans = Math.floor(Math.random() * 5) + 1; 
        a = b * ans; // Ensure perfect division
    }

    setQuestion({ a, b, icon, ans });
    setFeedback("");
    
    // Generate Options
    const wrong1 = ans + 1;
    const wrong2 = Math.max(0, ans - (Math.floor(Math.random() * 2) + 1));
    setOptions([ans, wrong1, wrong2].sort(() => Math.random() - 0.5));
  };

  // Initial load
  useEffect(() => { generateQuestion(); }, [mode]);

  const checkAnswer = (val: number) => {
    if (val === question.ans) {
      setFeedback("CORRECT! 🎉");
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      const utterance = new SpeechSynthesisUtterance("Great Job!");
      window.speechSynthesis.speak(utterance);
      setTimeout(generateQuestion, 2000);
    } else {
      setFeedback("Try Again! 🤔");
      window.speechSynthesis.speak(new SpeechSynthesisUtterance("Try again."));
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex gap-2 mb-4 bg-white p-2 rounded-full shadow-sm">
          <Button variant={mode === 'add' ? 'default' : 'ghost'} onClick={() => setMode('add')} className="rounded-full bg-green-500 hover:bg-green-600 text-white font-bold text-xl">+</Button>
          <Button variant={mode === 'sub' ? 'default' : 'ghost'} onClick={() => setMode('sub')} className="rounded-full bg-red-500 hover:bg-red-600 text-white font-bold text-xl">-</Button>
          <Button variant={mode === 'mul' ? 'default' : 'ghost'} onClick={() => setMode('mul')} className="rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xl">×</Button>
          <Button variant={mode === 'div' ? 'default' : 'ghost'} onClick={() => setMode('div')} className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl">÷</Button>
      </div>

      <div className="flex items-center gap-4 text-6xl font-bold text-slate-700 animate-in zoom-in">
        <span>{question.a}</span>
        <span className="text-slate-400">
            {mode === 'add' ? '+' : mode === 'sub' ? '-' : mode === 'mul' ? '×' : '÷'}
        </span>
        <span>{question.b}</span>
        <span className="text-slate-400">=</span>
        <span className="text-blue-600">?</span>
      </div>

      {/* Visual Aid (Only for small numbers/Addition) */}
      {mode === 'add' && question.a + question.b <= 10 && (
          <div className="flex gap-4 text-4xl opacity-50">
             <div className="flex">{Array(question.a).fill(question.icon).map((i,x)=><span key={x}>{i}</span>)}</div>
             <div className="flex">{Array(question.b).fill(question.icon).map((i,x)=><span key={`b${x}`}>{i}</span>)}</div>
          </div>
      )}

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

// --- 2. ABC KINGDOM (PHONICS) ---
function ABCKingdom() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    
    const speakLetter = (letter: string) => {
        const words: Record<string, string> = { 
            A: "Apple", B: "Ball", C: "Cat", D: "Dog", E: "Elephant", F: "Fish", 
            G: "Grapes", H: "Hat", I: "Ice Cream", J: "Juice", K: "Kite", L: "Lion",
            M: "Moon", N: "Nest", O: "Orange", P: "Pig", Q: "Queen", R: "Rainbow",
            S: "Sun", T: "Tree", U: "Umbrella", V: "Van", W: "Whale", X: "Xylophone",
            Y: "Yo-Yo", Z: "Zebra"
        };
        const word = words[letter] || letter;
        const msg = new SpeechSynthesisUtterance(`${letter} is for ${word}`);
        window.speechSynthesis.speak(msg);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 }, colors: ['#FF0000', '#00FF00', '#0000FF'] });
    };

    return (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {alphabet.map(letter => (
                <button 
                    key={letter}
                    onClick={() => speakLetter(letter)}
                    className="aspect-square bg-white rounded-2xl shadow-md border-b-4 border-slate-200 text-4xl font-extrabold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 hover:-translate-y-1 transition-all flex items-center justify-center"
                >
                    {letter}
                </button>
            ))}
        </div>
    );
}

// --- 3. STORY SPARK (WITH TEACHER SAVE) ---
function StorySpark({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const [topic, setTopic] = useState('');
    const [story, setStory] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch Saved Stories
    const storiesQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_stories'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: savedStories } = useCollection<any>(storiesQuery);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        const result = await generateJuniorStory(topic);
        if (result.success) {
            setStory(result.data);
            setTimeout(() => speak(result.data.title + ". " + result.data.content), 500);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!user || !story || !firestore) return;
        setSaving(true);
        try {
            await addDoc(collection(firestore, 'junior_stories'), {
                ...story,
                topic,
                createdAt: serverTimestamp(),
                createdBy: user.uid
            });
            setStory(null); // Clear after save to show list
        } catch (e) { console.error(e); }
        setSaving(false);
    };

    const speak = (text: string) => {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.9;
        window.speechSynthesis.speak(u);
    };

    return (
        <div className="space-y-8">
            {/* GENERATOR (Visible to Teacher/Admin OR Students for fun) */}
            <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-purple-200">
                <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2"><Wand2 /> Create a New Story</h3>
                <div className="flex gap-2">
                    <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. A dancing dinosaur" className="text-lg h-12 rounded-xl" />
                    <Button onClick={handleGenerate} disabled={loading} className="h-12 rounded-xl bg-purple-600 hover:bg-purple-700">{loading ? <Loader2 className="animate-spin"/> : "Go!"}</Button>
                </div>
                {/* Quick Prompts */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {['🦄 Unicorn', '🚒 Fire Truck', '🧜‍♀️ Mermaid', '🦁 Lion'].map(t => (
                        <button key={t} onClick={() => setTopic(t)} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-bold hover:bg-purple-100 whitespace-nowrap">{t}</button>
                    ))}
                </div>
            </div>

            {/* CURRENT STORY DISPLAY */}
            {story && (
                <Card className="border-4 border-yellow-300 bg-yellow-50 animate-in zoom-in">
                    <CardHeader><CardTitle className="text-3xl text-center">{story.emojiIcon} {story.title}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-xl leading-relaxed font-medium text-slate-800">{story.content}</p>
                        <div className="bg-white p-4 rounded-xl border border-yellow-200">
                            <p className="font-bold text-orange-600">Question: {story.question}</p>
                            <p className="text-slate-400 text-sm mt-1 hover:text-green-600 cursor-pointer transition-colors">Answer: {story.answer} (Hover to see)</p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => speak(story.content)} variant="outline" className="flex-1"><Volume2 className="mr-2"/> Read to Me</Button>
                            {canEdit && (
                                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-green-600 hover:bg-green-700">
                                    {saving ? <Loader2 className="animate-spin"/> : <Plus className="mr-2"/>} Save to Library
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* LIBRARY (Grid of saved stories) */}
            <div>
                <h3 className="text-2xl font-bold text-slate-700 mb-4">📚 Class Library</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedStories?.map((s: any) => (
                        <Card key={s.id} className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-purple-500" onClick={() => { setStory(s); speak(s.title); }}>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="text-4xl">{s.emojiIcon}</div>
                                <div>
                                    <h4 className="font-bold text-lg leading-tight">{s.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1">Tap to read</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- 4. WORLD OF WONDER (SCIENCE) ---
function ScienceWorld({ canEdit }: { canEdit: boolean }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const [topic, setTopic] = useState('');
    const [fact, setFact] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Fetch Saved Science
    const scienceQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'junior_science'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: savedScience } = useCollection<any>(scienceQuery);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        const result = await generateJuniorScience(topic);
        if (result.success) setFact(result.data);
        setLoading(false);
    };

    const handleSave = async () => {
        if (!user || !fact || !firestore) return;
        try {
            await addDoc(collection(firestore, 'junior_science'), { ...fact, createdAt: serverTimestamp() });
            setFact(null);
        } catch (e) { console.error(e); }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2"><Atom /> Discover Something New</h3>
                <div className="flex gap-2">
                    <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Why is the sky blue?" className="text-lg h-12 rounded-xl" />
                    <Button onClick={handleGenerate} disabled={loading} className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700">{loading ? <Loader2 className="animate-spin"/> : "Discover"}</Button>
                </div>
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {['🌈 Rainbows', '🌋 Volcanoes', '🦋 Butterflies', '🌕 The Moon'].map(t => (
                        <button key={t} onClick={() => setTopic(t)} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold hover:bg-blue-100 whitespace-nowrap">{t}</button>
                    ))}
                </div>
            </div>

            {fact && (
                <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-8 rounded-3xl text-white text-center shadow-xl animate-in zoom-in">
                    <div className="text-8xl mb-4 animate-bounce">{fact.emojiIcon}</div>
                    <h2 className="text-3xl font-extrabold mb-4">{fact.title}</h2>
                    <p className="text-xl font-medium leading-relaxed">{fact.fact}</p>
                    {canEdit && <Button onClick={handleSave} variant="secondary" className="mt-6 font-bold">Save Card</Button>}
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {savedScience?.map((s: any) => (
                    <div key={s.id} className="bg-white p-4 rounded-2xl shadow border-b-4 border-blue-200 flex flex-col items-center text-center">
                        <div className="text-4xl mb-2">{s.emojiIcon}</div>
                        <h4 className="font-bold text-slate-800 leading-tight">{s.title}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- MAIN PAGE ---
export default function JuniorCampusPage() {
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');

  return (
    <div className="min-h-screen bg-[#F0F9FF] p-4 md:p-8 font-sans">
      
      {/* FUN HEADER */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-3xl shadow-sm border-b-4 border-slate-200">
        <div className="flex items-center gap-4">
            <div className="bg-yellow-400 p-3 rounded-2xl shadow-inner"><Rabbit className="h-10 w-10 text-white" /></div>
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Junior Campus</h1>
                <p className="text-slate-500 font-medium">Learn, Play, and Grow!</p>
            </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
            {/* Can add student avatar here */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="math" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-16 bg-white p-2 rounded-2xl shadow-sm border-2 border-slate-100 mb-8">
                <TabsTrigger value="math" className="rounded-xl data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-bold text-lg"><Calculator className="mr-2"/> Math</TabsTrigger>
                <TabsTrigger value="abc" className="rounded-xl data-[state=active]:bg-green-100 data-[state=active]:text-green-700 font-bold text-lg"><Brain className="mr-2"/> ABCs</TabsTrigger>
                <TabsTrigger value="stories" className="rounded-xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-bold text-lg"><BookOpen className="mr-2"/> Stories</TabsTrigger>
                <TabsTrigger value="science" className="rounded-xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-bold text-lg"><Rocket className="mr-2"/> Science</TabsTrigger>
            </TabsList>

            <TabsContent value="math" className="mt-0">
                <div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-orange-200">
                    <MathPlayground />
                </div>
            </TabsContent>

            <TabsContent value="abc" className="mt-0">
                <div className="bg-gradient-to-b from-green-50 to-white p-8 rounded-3xl shadow-xl border-b-8 border-green-200">
                    <ABCKingdom />
                </div>
            </TabsContent>

            <TabsContent value="stories" className="mt-0">
                <StorySpark canEdit={canEdit} />
            </TabsContent>

            <TabsContent value="science" className="mt-0">
                <ScienceWorld canEdit={canEdit} />
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
