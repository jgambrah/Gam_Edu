
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where, setDoc, increment, getDocs, onSnapshot } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom as AtomIcon, Music, Palette, Trophy, Gift, Check, CheckCircle2, XCircle, Type, PlusCircle, PenSquare, FileText, Search, AlertTriangle, ShieldCheck, Activity, BrainCircuit, MessageSquare, Clapperboard, Users, Lightbulb, Microscope, Sparkles, Database, PenTool, Eraser, GraduationCap, Languages as LanguagesIcon, Sigma as SigmaIcon, Layers, Repeat, BookUser, ListOrdered, ArrowLeftRight, Tags, MessageCircle as MessageCircleIcon, Pen, Hammer, SpellCheck, Underline
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateJuniorScience, generateWordDetails, generatePhonicsChallenge, generateLessonImageAction as generateLessonImage, generateTTSAction, generateRhymingWords, generateBlendsExample, generateArtDetailsAction, generateNumeracyTask, generateDictionDetails, generateStorytellingScene, generateThemedVocab, generateMissingLetterChallenge, generateSentence } from '@/app/dashboard/early-years/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAuth } from 'firebase/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PHONICS_DATA, INITIAL_WORDS, VOWELS_CONSONANTS, DICTION_DATA, READING_DATA, SENTENCE_DATA, HIDDEN_WORDS_DATA, GRAMMAR_DATA, OPPOSITES_DATA, BLENDS_DATA, RHYMES_DATA, MISSING_LETTERS_DATA, STORYTELLING_DATA, THEME_VOCAB_DATA, ARTS_DATA, SCIENCE_DATA } from '../early-years/constants';
import { playRawPcm } from '../early-years/services/audio';
import ArtsHub from '../early-years/components/ArtsHub';
import ScienceExploration from '../early-years/components/ScienceExploration';

type LiteracyTab = 'alphabet' | 'blends' | 'rhymes' | 'words' | 'missing-letters' | 'building' | 'grammar' | 'reading' | 'sentences' | 'hidden-words' | 'opposites' | 'storytelling' | 'themes' | 'diction' | 'writing' | 'songs';

const LiteracyZone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LiteracyTab>('alphabet');

  const tabIcons: Record<LiteracyTab, React.FC<any>> = {
    alphabet: Type,
    blends: Layers,
    rhymes: Repeat,
    words: BookOpen,
    'missing-letters': Underline,
    building: Hammer,
    grammar: SpellCheck,
    reading: BookUser,
    sentences: ListOrdered,
    'hidden-words': Search,
    opposites: ArrowLeftRight,
    storytelling: MessageSquare,
    themes: Tags,
    diction: MessageCircleIcon,
    writing: Pen,
    songs: Music,
  };

  const tabColors: Record<LiteracyTab, string> = {
    alphabet: 'bg-pink-500',
    blends: 'bg-orange-600',
    rhymes: 'bg-cyan-600',
    words: 'bg-orange-500',
    'missing-letters': 'bg-emerald-600',
    building: 'bg-yellow-500',
    grammar: 'bg-indigo-500',
    reading: 'bg-emerald-500',
    sentences: 'bg-cyan-500',
    'hidden-words': 'bg-rose-500',
    opposites: 'bg-purple-500',
    storytelling: 'bg-blue-600',
    themes: 'bg-rose-600',
    diction: 'bg-blue-500',
    writing: 'bg-green-500',
    songs: 'bg-yellow-500',
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Tab Switcher - Scrollable */}
      <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4">
        <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-pink-50 min-w-max">
          {(['alphabet', 'blends', 'rhymes', 'words', 'missing-letters', 'building', 'grammar', 'reading', 'sentences', 'hidden-words', 'opposites', 'storytelling', 'themes', 'diction', 'writing', 'songs'] as LiteracyTab[]).map((tab) => {
            const Icon = tabIcons[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`min-w-[100px] px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${
                  activeTab === tab ? `${tabColors[tab]} text-white shadow-xl scale-110 -translate-y-1` : 'text-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.replace('-', ' ')}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full px-4">
        {activeTab === 'alphabet' && <AlphabetModule />}
        {activeTab === 'blends' && <BlendsModule />}
        {activeTab === 'rhymes' && <RhymesModule />}
        {activeTab === 'words' && <WordFactoryModule />}
        {activeTab === 'missing-letters' && <MissingLettersModule />}
        {activeTab === 'building' && <WordBuildingModule />}
        {activeTab === 'grammar' && <GrammarModule />}
        {activeTab === 'reading' && <ReadingModule />}
        {activeTab === 'sentences' && <SentencesModule />}
        {activeTab === 'hidden-words' && <HiddenWordsModule />}
        {activeTab === 'opposites' && <OppositesModule />}
        {activeTab === 'storytelling' && <StorytellingModule />}
        {activeTab === 'themes' && <ThemeVocabModule />}
        {activeTab === 'diction' && <DictionModule />}
        {activeTab === 'writing' && <WritingModule />}
        {activeTab === 'songs' && <SongsModule />}
      </div>
    </div>
  );
};

const ArtStudio: React.FC<{ canEdit: boolean }> = ({ canEdit }) => {
    return <ArtsHub />;
};

const ScienceWorld: React.FC<{ canEdit: boolean }> = ({ canEdit }) => {
    return <ScienceExploration />;
};

// --- DUMMY COMPONENTS (To be implemented) ---
const WordFactoryModule: React.FC = () => <div>Word Factory Module</div>;
const MissingLettersModule: React.FC = () => <div>Missing Letters Module</div>;
const WordBuildingModule: React.FC = () => <div>Word Building Module</div>;
const GrammarModule: React.FC = () => <div>Grammar Module</div>;
const ReadingModule: React.FC = () => <div>Reading Module</div>;
const SentencesModule: React.FC = () => <div>Sentences Module</div>;
const HiddenWordsModule: React.FC = () => <div>Hidden Words Module</div>;
const OppositesModule: React.FC = () => <div>Opposites Module</div>;
const StorytellingModule: React.FC = () => <div>Storytelling Module</div>;
const ThemeVocabModule: React.FC = () => <div>Theme Vocab Module</div>;
const DictionModule: React.FC = () => <div>Diction Module</div>;
const WritingModule: React.FC = () => <div>Writing Module</div>;
const SongsModule: React.FC = () => <div>Songs Module</div>;
const BlendsModule: React.FC = () => <div>Blends Module</div>;
const RhymesModule: React.FC = () => <div>Rhymes Module</div>;
const AlphabetModule: React.FC = () => <div>Alphabet Module</div>;

const VoiceCoach: React.FC<{ canEdit: boolean }> = ({ canEdit }) => {
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
    const icons = ['🍎', '⭐', '🎈', '🐱', '🚗', '🍦'];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    let a, b, ans, options: any[] = [];
    let displayPrompt = "";
    let timeParts = { hour: 0, minute: 0 };


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
        const min = Math.random() > 0.5 ? 30 : 0;
        timeParts = { hour: hr, minute: min };
        a = `${hr}:${String(min).padStart(2, '0')}`;
        ans = min === 30 ? `Half past ${hr}` : `${hr} o'clock`;
        options = [ans, `${(hr % 12) + 1} o'clock`, `${hr}:${min === 30 ? '00' : '30'}`].sort(() => Math.random() - 0.5);
        displayPrompt = `What time is it?`;
        break;
    }

    setQuestion({ a, b, icon, ans, options, displayPrompt, timeParts });
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
                    <div className="absolute top-1/2 left-1/2 w-1 h-12 bg-slate-800 rounded -translate-x-1/2 -translate-y-full origin-bottom" 
                        style={{ transform: `translateX(-50%) translateY(-100%) rotate(${(question.timeParts.hour % 12) * 30 + (question.timeParts.minute / 60) * 30}deg)` }}></div>
                    <div className="absolute top-1/2 left-1/2 w-1 h-16 bg-slate-500 rounded -translate-x-1/2 -translate-y-full origin-bottom" 
                        style={{ transform: `translateX(-50%) translateY(-100%) rotate(${question.timeParts.minute * 6}deg)` }}></div>
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
                    { label: 'Science Pro', count: stats.science, color: 'bg-blue-500', icon: <AtomIcon className="w-4 h-4" /> },
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
                                
                                {/* Date earned - small badge */}
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

// --- MAIN PAGE ---
export default function JuniorAcademyPage() {
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');

  return (
    <div className="min-h-screen bg-[#F0F9FF] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto mb-8 flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border-b-4 border-slate-200">
        <div className="bg-yellow-400 p-3 rounded-2xl shadow-inner"><Rabbit className="h-10 w-10 text-white" /></div>
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800">Junior Campus</h1>
          <p className="text-slate-500 font-medium">Core Skills Academy for Primary Learners</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="literacy" className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-24 bg-white p-3 rounded-[32px] shadow-2xl border border-slate-100 mb-16 overflow-x-auto">
                <TabsTrigger value="literacy" className="h-full rounded-2xl text-lg font-bold flex items-center gap-2 data-[state=active]:bg-pink-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                    <LanguagesIcon className="w-6 h-6"/> Literacy
                </TabsTrigger>
                <TabsTrigger value="math" className="h-full rounded-2xl text-lg font-bold flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                    <SigmaIcon className="w-6 h-6"/> Numeracy
                </TabsTrigger>
                <TabsTrigger value="science" className="h-full rounded-2xl text-lg font-bold flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                    <AtomIcon className="w-6 h-6"/> Science
                </TabsTrigger>
                <TabsTrigger value="arts" className="h-full rounded-2xl text-lg font-bold flex items-center gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                    <Palette className="w-6 h-6"/> Arts
                </TabsTrigger>
                <TabsTrigger value="rewards" className="h-full rounded-2xl text-lg font-bold flex items-center gap-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
                    <Trophy className="w-6 h-6"/> Rewards
                </TabsTrigger>
            </TabsList>
            
            {/* CONTENT AREAS */}
            <div className="min-h-[500px]">
                <TabsContent value="literacy" className="mt-0"><LiteracyZone /></TabsContent>
                <TabsContent value="math" className="mt-0"><MathPlayground /></TabsContent>
                <TabsContent value="science" className="mt-0"><ScienceWorld canEdit={canEdit} /></TabsContent>
                <TabsContent value="arts" className="mt-0"><ArtStudio canEdit={canEdit} /></TabsContent>
                <TabsContent value="rewards" className="mt-0"><StickerBook /></TabsContent>
            </div>
        </Tabs>
      </div>
    </div>
  );
}
