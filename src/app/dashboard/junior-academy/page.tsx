
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where, setDoc, increment, getDocs } from 'firebase/firestore';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, 
  Trophy, Gift, Check, CheckCircle2, XCircle, PenTool, Eraser, Database, Pencil, Heart, Utensils, Smile, Tv, Users, Activity, CheckSquare, BrainCircuit, Handshake, Milestone, Ear, Layers, AudioLines, Repeat, Underline, BookCheck, FolderOpen, Car, Earth, Sparkles, HeartPulse, CloudSun, PawPrint, Shapes, Languages, PenNib, Apple, Sun, CloudRain, Guitar, Plane, MousePointer2, Cube, Carrot, Cookie, School, Home, Recycle, Water, Droplets, HelpCircle, MessageSquare, Drama, ArrowLeft, Play, Flag, User as UserIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateWordDetails, generateTTSAction, assessHandwritingAction, generateLifeSkillEntry, generateLessonImageAction, generateRhyme, generateSkillDetails } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Label } from '@/components/ui/label';
import MathPlayground from './math-playground';
import JuniorScienceWorld from './science-world';
import ArtStudio from './art-studio';
import StickerBook from './sticker-book';
import * as constants from '@/lib/constants';
import * as LucideIcons from 'lucide-react';
import PhonicsWorld from './phonics-world';
import { generateScienceLessonAction } from '@/ai/flows/generate-science-lesson';
import type { DictionaryWord, LessonCard } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { getAuth } from 'firebase/auth';


const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const map: Record<string, keyof typeof LucideIcons> = {
      'fa-spell-check': 'Languages', 'fa-ear-listen': 'Ear', 'fa-pen-nib': 'PenNib',
      'fa-arrow-1-9': 'Calculator', 'fa-hand-holding-heart': 'Handshake', 'fa-flask-vial': 'FlaskConical',
      'fa-palette': 'Palette', 'fa-robot': 'Bot', 'fa-face-smile': 'Smile', 'fa-tooth': 'Sparkles',
      'fa-heart-pulse': 'HeartPulse', 'fa-vest': 'Shirt', 'fa-sun': 'Sun', 'fa-utensils': 'Utensils',
      'fa-school': 'School', 'fa-house': 'Home', 'fa-recycle': 'Recycle', 'fa-water': 'Droplets',
      'fa-broom': 'Trash2', 'fa-flag': 'Flag', 'fa-hand-pointer': 'MousePointer2', 'fa-cube': 'Cube',
      'fa-chalkboard-user': 'User', 'fa-rabbit': 'Rabbit', 'fa-carrot': 'Carrot', 'fa-apple-whole': 'Apple',
      'fa-cookie': 'Cookie', 'fa-star': 'Star', 'fa-tv': 'Tv', 'fa-bed': 'Bed', 'fa-eye': 'Eye',
      'fa-cloud-showers-heavy': 'CloudRain', 'fa-guitar': 'Guitar', 'fa-plane': 'Plane', 'fa-car': 'Car',
      'fa-frog': 'Rabbit', 
      'fa-bolt': 'Zap',
      'fa-circle-dot': 'CircleDot',
      'fa-soap': 'Sparkles', 
      'fa-broccoli': 'Carrot', 
      'fa-display': 'Monitor',
      'fa-graduation-cap': 'GraduationCap',
      'fa-comments': 'MessageSquare',
      'fa-people-group': 'Users',
      'fa-masks-theater': 'Drama',
      'fa-brain': 'BrainCircuit',
      'fa-child-reaching': 'User',
      'fa-music': 'Music',
      'fa-magic': 'Wand2',
      'fa-arrow-left': 'ArrowLeft',
      'fa-arrow-right': 'ArrowRight',
      'fa-spinner': 'Loader2',
      'fa-volume-high': 'Volume2',
      'fa-dna': 'Atom',
      'fa-play': 'Play',
      'fa-heart': 'Heart',
      'fa-face-smile-wink': 'Smile'
    };
  
    const LucideName = map[iconName] || 'HelpCircle';
    const IconComponent = (LucideIcons as any)[LucideName];
  
    return <IconComponent className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} />;
};


// --- HELPERS ---
const isJuniorLevel = (grade: string) => 
    grade === 'Early Childhood' || grade === 'Lower Primary';

const juniorStyles = {
    storybook: "bg-[#FFFDE7] border-y-8 border-x-4 border-orange-200 rounded-[60px] p-8 shadow-[0_15px_0_#FFE082]",
    storyText: "text-3xl font-bold text-orange-900 leading-relaxed font-serif",
    
    questCard: "bg-gradient-to-b from-sky-400 to-blue-500 border-b-[12px] border-blue-700 rounded-[50px] text-white",
    stepBubble: "w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl shadow-lg border-4 border-blue-200",
    
    card: "rounded-[60px] border-8 border-yellow-200 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100",
    header: "p-10 text-center",
    mathBox: "bg-sky-100 p-10 rounded-[50px] border-4 border-dashed border-sky-300 shadow-inner",
    
    button: "h-24 px-12 bg-gradient-to-t from-pink-600 to-pink-400 hover:scale-105 text-3xl font-black text-white rounded-[40px] shadow-[0_12px_0_#9d174d] active:translate-y-2 active:shadow-none transition-all",
    input: "h-28 text-7xl font-black text-center border-8 border-yellow-300 rounded-[40px] bg-white text-pink-500 shadow-inner"
};

// --- STORY SPARK COMPONENT ---
function StorySpark({ canEdit, schoolId }: { canEdit: boolean, schoolId: string }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [topic, setTopic] = useState('');
    const [wordCount, setWordCount] = useState('150');
    const [story, setStory] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    
    const [currentQ, setCurrentQ] = useState(0);
    const [userAns, setUserAns] = useState('');
    const [quizStatus, setQuizStatus] = useState<'typing' | 'correct' | 'wrong'>('typing');

    const storiesQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(
            collection(firestore, 'junior_stories'), 
            where('schoolId', '==', schoolId), 
            orderBy('createdAt', 'desc')
        ) : null, [firestore, schoolId]);
    const { data: savedStories, forceRefetch } = useCollection<any>(storiesQuery);
    
    const speak = async (text: string) => {
        if (!text || !schoolId) return;
        const result = await generateTTSAction({ text, voice: 'Algenib', schoolId });
        if(result.success && result.data && typeof window !== 'undefined'){
            const audio = new Audio(`data:audio/wav;base64,${result.data}`);
            audio.play();
        }
    };

    const handleGenerate = async () => {
        if (!topic.trim() || !schoolId) return;
        setLoading(true);
        const res = await generateJuniorStory({ topic, wordCount: parseInt(wordCount), schoolId });
        if (res.success && res.data) {
            setStory(res.data);
            setCurrentQ(0);
            setUserAns('');
            setQuizStatus('typing');
            speak(`I've written a story about ${topic}. Let's read!`);
        } else {
            toast({ title: "Magic Failed", description: res.error || "The story book is stuck!", variant: "destructive" });
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!story || !firestore || !schoolId) return;
        try {
            await addDoc(collection(firestore, 'junior_stories'), {
                ...story,
                topic,
                schoolId: schoolId,
                createdAt: serverTimestamp(),
                createdBy: user?.uid
            });
            toast({ title: "Saved!", description: "This story is now in the school library." });
            forceRefetch();
        } catch (e) {
            toast({ title: "Error", description: "Could not save to library." });
        }
    };

    const checkAnswer = () => {
        if (!userAns.trim()) return;
        const currentQuestion = story.questions[currentQ];
        const isCorrect = userAns.toLowerCase().includes(currentQuestion.answer.toLowerCase()) || 
                          currentQuestion.answer.toLowerCase().includes(userAns.toLowerCase());

        if (isCorrect) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
            setQuizStatus('correct');
            speak("That is exactly right! You are a brilliant reader!");
        } else {
            setQuizStatus('wrong');
            speak("Not quite, but good try! Let's look at the story again.");
        }
    };

    const handleNext = () => {
        if (currentQ < 2) {
            setCurrentQ(currentQ + 1);
            setUserAns('');
            setQuizStatus('typing');
        } else {
            setStory(null);
            setTopic('');
            confetti({ particleCount: 200, spread: 100 });
            toast({ title: "Mission Complete!", description: "You mastered the whole story!" });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {canEdit && (
                <div className="bg-white p-6 rounded-[35px] border-4 border-purple-100 flex flex-col md:flex-row gap-4 shadow-lg">
                    <div className="flex-1 space-y-1">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Story Topic</Label>
                        <Input 
                            value={topic} 
                            onChange={e => setTopic(e.target.value)} 
                            placeholder="e.g. A brave cat in space" 
                            className="rounded-2xl h-14 border-2 focus:border-purple-400" 
                        />
                    </div>
                    <div className="w-full md:w-48 space-y-1">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Length</Label>
                        <select 
                            value={wordCount} 
                            onChange={(e) => setWordCount(e.target.value)}
                            className="w-full h-14 rounded-2xl bg-slate-50 border-2 px-4 font-bold outline-none"
                        >
                            <option value="50">Short (50 words)</option>
                            <option value="150">Medium (150 words)</option>
                            <option value="300">Long (300 words)</option>
                        </select>
                    </div>
                    <Button 
                        onClick={handleGenerate} 
                        disabled={loading || !topic} 
                        className="md:mt-6 h-14 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl px-8 shadow-lg shadow-purple-900/20"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2 h-5 w-5" /> MAGIC WRITE</>}
                    </Button>
                </div>
            )}
            {story ? (
                <Card className="rounded-[60px] border-8 border-orange-100 overflow-hidden shadow-2xl bg-[#FFFDE7] animate-in zoom-in duration-500">
                    <div className="bg-orange-400 p-8 text-white flex justify-between items-center border-b-8 border-orange-500/20">
                        <div className="flex items-center gap-4">
                            <span className="text-6xl drop-shadow-md">{story.emojiIcon || '📖'}</span>
                            <CardTitle className="text-4xl font-black uppercase tracking-tighter">{story.title}</CardTitle>
                        </div>
                        <div className="flex gap-2">
                             <Button variant="ghost" onClick={() => speak(story.content)} className="text-white hover:bg-white/20 rounded-full h-12 w-12"><Volume2 /></Button>
                             {canEdit && <Button onClick={handleSave} variant="ghost" className="text-white hover:bg-white/20 rounded-full h-12 w-12"><Save /></Button>}
                             <Button variant="ghost" onClick={() => setStory(null)} className="text-white hover:bg-white/20 rounded-full h-12 w-12"><XCircle /></Button>
                        </div>
                    </div>

                    <CardContent className="p-12 space-y-12">
                        <div className="max-w-4xl mx-auto">
                            <p className="text-3xl font-bold text-orange-900 leading-relaxed font-serif first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left whitespace-pre-wrap">
                                {story.content}
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[50px] border-4 border-dashed border-orange-300 shadow-inner space-y-8 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <Badge className="bg-purple-600 text-white px-6 py-2 rounded-full text-lg font-black uppercase tracking-widest">
                                    Question {currentQ + 1} of 3
                                </Badge>
                                <div className="flex gap-2">
                                    {[0,1,2].map(i => (
                                        <div key={i} className={`h-3 w-3 rounded-full ${i === currentQ ? 'bg-purple-600 animate-pulse' : i < currentQ ? 'bg-green-400' : 'bg-slate-200'}`} />
                                    ))}
                                </div>
                            </div>

                            <h3 className="text-3xl font-black text-blue-900 leading-tight">
                                {story.questions[currentQ].question}
                            </h3>

                            {quizStatus === 'typing' ? (
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Input 
                                        value={userAns} 
                                        onChange={e => setUserAns(e.target.value)} 
                                        placeholder="Speak your answer or type it here..." 
                                        className="h-20 text-2xl rounded-[30px] border-4 border-orange-100 shadow-inner px-8"
                                        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                                    />
                                    <Button 
                                        onClick={checkAnswer}
                                        disabled={!userAns.trim()}
                                        className="h-20 px-12 bg-blue-600 hover:bg-blue-500 text-white text-2xl font-black rounded-[30px] shadow-[0_8px_0_#1e3a8a] transition-all active:translate-y-1 active:shadow-none"
                                    >
                                        CHECK! 🚀
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in zoom-in duration-300">
                                    <div className={`p-8 rounded-[40px] border-4 flex items-center gap-6 ${quizStatus === 'correct' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                                        <div className={`h-20 w-20 rounded-full flex items-center justify-center text-4xl shadow-lg ${quizStatus === 'correct' ? 'bg-green-500 text-white' : 'bg-rose-500 text-white'}`}>
                                            {quizStatus === 'correct' ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
                                        </div>
                                        <div>
                                            <p className="text-3xl font-black uppercase tracking-tight">{quizStatus === 'correct' ? "Amazing Thinking!" : "Almost There!"}</p>
                                            <p className="text-lg font-bold opacity-80">
                                                {quizStatus === 'correct' 
                                                    ? "You found the correct answer in the story book!" 
                                                    : `Let's try again! The story says: ${story.questions[currentQ].answer}`}
                                            </p>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={handleNext} 
                                        className="w-full h-20 bg-purple-600 hover:bg-purple-500 text-white text-3xl font-black rounded-[40px] shadow-[0_10px_0_#581c87] transition-all active:translate-y-1 active:shadow-none"
                                    >
                                        {currentQ < 2 ? "NEXT QUESTION 🌈" : "FINISH MISSION 🏆"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-black text-slate-700 flex items-center gap-2">
                            <Library className="text-purple-500" /> School Story Library
                        </h3>
                        <Badge variant="outline" className="text-slate-400 font-bold">{savedStories?.length || 0} Stories</Badge>
                    </div>

                    {!savedStories || savedStories.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-[50px] border-8 border-dashed border-slate-50">
                            <BookOpen className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                            <p className="text-slate-300 font-bold uppercase tracking-widest">Library is quiet today...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedStories.map((s: any) => (
                                <Card 
                                    key={s.id} 
                                    className="group cursor-pointer rounded-[40px] border-none shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden bg-white"
                                    onClick={() => {
                                        setStory(s);
                                        setCurrentQ(0);
                                        setQuizStatus('typing');
                                        speak(s.title);
                                    }}
                                >
                                    <div className="p-6 flex items-center gap-4">
                                        <div className="text-5xl bg-slate-50 p-4 rounded-3xl transition-transform group-hover:scale-110">{s.emojiIcon}</div>
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="text-xl font-black text-slate-800 truncate leading-tight">{s.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className="bg-orange-100 text-orange-600 border-none text-[10px] px-2">{s.wordCount} words</Badge>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{s.topic || 'Fun Tale'}</span>
                                            </div>
                                        </div>
                                        {canEdit && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); deleteDoc(doc(firestore!, 'junior_stories', s.id)); }}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-rose-300 hover:text-rose-600 transition-opacity"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
// --- Singing Dictionary Component ---
const SingingDictionary = ({ schoolId }: { schoolId: string }) => {
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [rhyme, setRhyme] = useState('');
    const [isStarted, setIsStarted] = useState(false);
    
    const words = constants.DICTIONARY_WORDS; 
    const current = words[index];

    const loadPage = useCallback(async () => {
        if (!current || !schoolId) return;
        setLoading(true);
        setRhyme('');
        const result = await generateLessonImageAction({ prompt: current.imagePrompt, schoolId });
        if (result.success) setImageUrl(result.data || null);
        setLoading(false);
    }, [current, schoolId]);
    
    useEffect(() => { 
        if (isStarted) {
            loadPage();
        }
    }, [index, isStarted, loadPage]);

    const playSong = async () => {
        if (!schoolId) return;
        setLoading(true);
        const rhymeResult = await generateRhyme({ topic: current.word, schoolId });
        if (rhymeResult.success) {
            setRhyme(rhymeResult.rhyme);
            const ttsResult = await generateTTSAction({ text: rhymeResult.rhyme, schoolId, voice: 'Algenib' });
            if (ttsResult.success && ttsResult.data) {
                const audio = new Audio(`data:audio/wav;base64,${ttsResult.data}`);
                audio.play();
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center space-y-8 animate-in fade-in">
            <div className="grid grid-cols-6 md:grid-cols-13 gap-2 overflow-x-auto p-4 bg-white rounded-3xl shadow-lg border-4 border-red-50">
                {words.map((w, i) => (
                    <button key={i} onClick={() => setIndex(i)} className={`w-10 h-10 rounded-lg font-black ${index === i ? 'bg-red-500 text-white' : 'bg-red-50 text-red-400'}`}>
                        {w.word[0]}
                    </button>
                ))}
            </div>

            <Card className={juniorStyles.card}>
                <div className="bg-gradient-to-r from-red-400 to-pink-400 p-8 text-white text-center">
                    <h2 className="text-7xl font-black">{current.word[0]}{current.word[0].toLowerCase()}</h2>
                    <p className="text-2xl font-bold uppercase tracking-widest">{current.word}</p>
                </div>
                <CardContent className="p-10 flex flex-col items-center space-y-8">
                     {!isStarted ? (
                        <Button onClick={() => setIsStarted(true)} className="h-20 px-12 bg-red-500 hover:bg-red-600 text-white text-2xl font-black rounded-full shadow-[0_10px_0_#991b1b]">
                            Load Word
                        </Button>
                    ) : (
                        <>
                            <div className="w-80 h-80 rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden bg-red-50">
                                {loading ? <div className="flex h-full items-center justify-center animate-spin text-red-200"><Loader2 size={48}/></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover" alt={current.word} />}
                            </div>
                            
                            {rhyme && (
                                <div className="bg-red-50 p-6 rounded-3xl border-4 border-dashed border-red-200 text-center animate-in zoom-in">
                                    <p className="text-xl font-bold text-red-700 whitespace-pre-wrap">{rhyme}</p>
                                </div>
                            )}

                            <Button onClick={playSong} disabled={loading} className="h-20 px-12 bg-red-500 hover:bg-red-600 text-white text-2xl font-black rounded-full shadow-[0_10px_0_#991b1b]">
                                <Music className="mr-3" /> SING ALONG!
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// --- Writing Canvas Component ---
const WritingCanvas = ({ onSound, schoolId }: { onSound: (t: string) => void, schoolId: string }) => {
    const traceCanvasRef = useRef<HTMLCanvasElement>(null);
    const freeCanvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedItem, setSelectedItem] = useState('1');
    const [mode, setMode] = useState<'letters' | 'numbers'>('numbers');
    const [isDrawingFree, setIsDrawingFree] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [feedback, setFeedback] = useState('');

    const items = mode === 'letters' ? constants.LETTERS : constants.NUMBERS;

    const setupCanvases = useCallback(() => {
        [traceCanvasRef, freeCanvasRef].forEach((ref, isTraceCanvas) => {
            const canvas = ref.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);

            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            if (isTraceCanvas === 0 && traceCanvasRef.current) {
                const c = traceCanvasRef.current.getContext('2d')!;
                c.font = "900 200px 'Comic Sans MS', sans-serif";
                c.textAlign = 'center';
                c.textBaseline = 'middle';
                c.strokeStyle = '#E2E8F0'; // A light grey for tracing
                c.lineWidth = 6;
                c.setLineDash([15, 10]);
                c.strokeText(selectedItem, canvas.width / (2*dpr), canvas.height / (2*dpr) + 10);
            } else if (isTraceCanvas === 1 && freeCanvasRef.current) {
                const c = freeCanvasRef.current.getContext('2d')!;
                c.lineWidth = 20;
                c.strokeStyle = '#3b82f6'; // Blue for drawing
            }
        });
    }, [selectedItem]);

    useEffect(() => {
        setupCanvases();
        window.addEventListener('resize', setupCanvases);
        return () => window.removeEventListener('resize', setupCanvases);
    }, [setupCanvases]);

    useEffect(() => {
      if (items && items.length > 0) {
        setSelectedItem(items[0]);
      }
    }, [mode, items]);


    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = freeCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawingFree(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawingFree) return;
        const canvas = freeCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawingFree(false);
    };

    const handleCheck = async () => {
        const canvas = freeCanvasRef.current;
        if (!canvas || !schoolId) return;

        setIsEvaluating(true);
        setFeedback("Magic eyes checking...");
        onSound("Let me see...");
        
        const dataUrl = canvas.toDataURL('image/png');

        try {
            const result = await assessHandwritingAction({
                imageDataUri: dataUrl,
                targetCharacter: selectedItem,
                schoolId: schoolId,
            });

            if (result.success && result.isCorrect) {
                confetti({ zIndex: 9999 });
                setFeedback(`You wrote '${selectedItem}' perfectly! ⭐`);
                onSound(`Wonderful! You wrote the ${mode === 'letters' ? 'letter' : 'number'} ${selectedItem} perfectly!`);
            } else {
                setFeedback(`Not quite! Try tracing '${selectedItem}' again.`);
                onSound(`That's a good try! Let's trace ${selectedItem} one more time.`);
            }
        } catch (error) {
            setFeedback('The AI Teacher is resting. Try again!');
            console.error("AI Evaluation Error:", error);
        } finally {
            setIsEvaluating(false);
        }
    };
    
    const handleClear = () => {
        const canvas = freeCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        setFeedback('');
    };

    return (
        <Card className="rounded-[60px] border-8 border-purple-100 overflow-hidden bg-white shadow-2xl">
            <div className="bg-purple-500 p-8 text-white text-center">
                <h3 className="text-4xl font-black uppercase tracking-tighter">Magic Writing Pen ✍️</h3>
            </div>
            <CardContent className="p-12 space-y-10">
                <div className="flex justify-center gap-4 border-b pb-8">
                    <Button onClick={() => setMode('numbers')} variant={mode === 'numbers' ? 'default' : 'outline'} className="rounded-full px-6 font-bold">Numbers</Button>
                    <Button onClick={() => setMode('letters')} variant={mode === 'letters' ? 'default' : 'outline'} className="rounded-full px-6 font-bold">Letters</Button>
                </div>
                <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar justify-center">
                    {items.map(item => (
                        <button key={item} onClick={() => setSelectedItem(item)} className={`flex-shrink-0 w-14 h-14 rounded-2xl font-black text-2xl border-4 ${selectedItem === item ? 'bg-purple-500 text-white border-white scale-110 shadow-lg' : 'bg-slate-50 text-slate-400'}`}>{item}</button>
                    ))}
                </div>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-4 text-center">
                        <p className="text-slate-400 font-bold uppercase text-xs">1. Trace This</p>
                        <div className="relative w-full max-w-sm mx-auto aspect-square">
                            <canvas ref={traceCanvasRef} className="border-4 border-slate-100 rounded-[3rem] w-full h-full" />
                        </div>
                    </div>
                    <div className="space-y-4 text-center relative">
                        <p className="text-slate-800 font-bold uppercase text-xs">2. Write it yourself</p>
                        <div className="relative w-full max-w-sm mx-auto aspect-square">
                            <canvas 
                                ref={freeCanvasRef} 
                                onMouseDown={startDrawing}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onMouseMove={draw}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                                className="border-8 border-purple-200 rounded-[3rem] w-full h-full cursor-crosshair touch-none" 
                            />
                             {isEvaluating && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[3rem] animate-pulse"><Loader2 className="w-12 h-12 animate-spin text-purple-600"/></div>}
                        </div>
                    </div>
                </div>
                <div className="text-center space-y-6">
                    {feedback && <Badge className="bg-purple-100 text-purple-700 text-xl p-4 rounded-2xl border-none">{feedback}</Badge>}
                    <div className="flex gap-4 justify-center">
                        <Button onClick={handleClear} variant="outline" className="h-16 px-10 rounded-2xl border-4 font-black">
                            <Eraser className="w-5 h-5 mr-2" /> CLEAR
                        </Button>
                        <Button onClick={handleCheck} disabled={isEvaluating} className="h-16 px-16 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black shadow-xl">
                            CHECK MY WORK!
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// --- MAIN PAGE ---
export default function JuniorCampusPage() {
    const { role } = useRole();
    const { user } = useUser();
    
    const { schoolId } = useCurrentSchool();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    
    return (
        <div className="min-h-screen bg-[#FFFBEB] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-[45px] shadow-xl border-b-[12px] border-yellow-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-400 p-5 rounded-[30px] shadow-inner rotate-3"><Rabbit className="h-12 w-12 text-white" /></div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-800 tracking-tighter">Junior Campus</h1>
                            <p className="text-xl font-bold text-pink-500 uppercase tracking-widest italic">The Magic of Learning! ✨</p>
                        </div>
                    </div>
                    {schoolId && <div className="flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-[20px] border-2 border-slate-100">
                        <Badge variant="outline" className="text-indigo-500 border-indigo-200">SaaS Node</Badge>
                        <span className="text-xs font-black text-slate-400">{schoolId}</span>
                    </div>}
                </header>

                <Tabs defaultValue="lifeskills" className="w-full">
                    <TabsList className="grid w-full grid-cols-9 h-24 bg-white p-2 rounded-[30px] shadow-xl border-2 border-yellow-100 mb-10 overflow-x-auto no-scrollbar">
                        <TabsTrigger value="lifeskills" className="rounded-2xl data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 font-black flex flex-col items-center gap-1"><Heart className="w-5 h-5"/> Life Skills</TabsTrigger>
                        <TabsTrigger value="writing" className="rounded-2xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-black flex flex-col items-center gap-1"><Pencil className="w-5 h-5"/> Writing</TabsTrigger>
                        <TabsTrigger value="stories" className="rounded-2xl data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-black flex flex-col items-center gap-1"><BookOpen className="w-5 h-5"/> Stories</TabsTrigger>
                        <TabsTrigger value="phonics" className="rounded-2xl data-[state=active]:bg-red-100 data-[state=active]:text-red-700 font-black flex flex-col items-center gap-1"><Ear className="w-5 h-5"/> Phonics</TabsTrigger>
                        <TabsTrigger value="dictionary" className="rounded-2xl data-[state=active]:bg-red-100 data-[state=active]:text-red-700 font-black flex flex-col items-center gap-1"><Languages className="w-5 h-5"/> Dictionary</TabsTrigger>
                        <TabsTrigger value="math" className="rounded-2xl data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-black flex flex-col items-center gap-1"><Calculator className="w-5 h-5"/> Math</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-2xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black flex flex-col items-center gap-1"><Atom className="w-5 h-5"/> Science</TabsTrigger>
                        <TabsTrigger value="art" className="rounded-2xl data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-black flex flex-col items-center gap-1"><Palette className="w-5 h-5"/> Art</TabsTrigger>
                        <TabsTrigger value="rewards" className="rounded-2xl data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 font-black flex flex-col items-center gap-1"><Trophy className="w-5 h-5"/> Rewards</TabsTrigger>
                    </TabsList>

                    <div className="min-h-[700px] animate-in slide-in-from-bottom-10 duration-1000">
                        <TabsContent value="lifeskills" className="mt-0"><LifeSkillsZone /></TabsContent>
                        <TabsContent value="writing" className="mt-0"><WritingCanvas onSound={() => {}} schoolId={schoolId!} /></TabsContent>
                        <TabsContent value="stories" className="mt-0"><StorySpark canEdit={canEdit} schoolId={schoolId!} /></TabsContent>
                        <TabsContent value="phonics" className="mt-0"><PhonicsWorld schoolId={schoolId!} /></TabsContent>
                        <TabsContent value="dictionary" className="mt-0"><SingingDictionary schoolId={schoolId!} /></TabsContent>
                        <TabsContent value="math" className="mt-0"><MathPlayground schoolId={schoolId!} /></TabsContent>
                        <TabsContent value="science" className="mt-0"><JuniorScienceWorld schoolId={schoolId!} /></TabsContent>
                        <TabsContent value="art" className="mt-0"><div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300"><ArtStudio schoolId={schoolId!} /></div></TabsContent>
                        <TabsContent value="rewards" className="mt-0"><StickerBook schoolId={schoolId!} /></TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

// Full implementations for all Life Skills modules
// All modules now require a schoolId to be passed to them
// and use that for any AI calls to `generateTTSAction`, etc.
const LifeSkillsZone: React.FC = () => {
    const { schoolId } = useCurrentSchool();
    const [activeTab, setActiveTab] = useState<LifeSkillTab>('emotions');
    const [stars, setStars] = useState(0);
    const { toast } = useToast();
  
    const playFeedbackSound = async (text: string) => {
        if (!text || !schoolId) return;
        try {
            const result = await generateTTSAction({ text, schoolId, voice: 'Kore' });
            if (result.success && result.data && typeof window !== 'undefined') {
                const audio = new Audio(`data:audio/wav;base64,${result.data}`);
                audio.play();
            }
        } catch(e) {
            toast({ variant: 'destructive', title: 'Audio Error' });
        }
    };
  
    const addStar = () => {
        setStars(prev => prev + 1);
        confetti({ particleCount: 50, spread: 30, origin: { x: 0.9, y: 0.1 } });
    };
    
    const tabs: {id: LifeSkillTab, label: string, icon: keyof typeof LucideIcons, color: string}[] = [
      { id: 'physical-health', label: 'Physical & Health', icon: 'Heart', color: 'bg-green-500' },
      { id: 'emotions', label: 'Feelings', icon: 'Smile', color: 'bg-yellow-500' },
      { id: 'routine-songs', label: 'Skill Songs', icon: 'Music', color: 'bg-pink-500' },
      { id: 'modeling', label: 'Modeling', icon: 'Tv', color: 'bg-indigo-500' },
      { id: 'practical-life', label: 'Play & Routines', icon: 'Activity', color: 'bg-blue-500' },
      { id: 'communication', label: 'Talk & Listen', icon: 'MessageSquare', color: 'bg-orange-500' },
      { id: 'social', label: 'Social & Kind', icon: 'Users', color: 'bg-rose-500' },
      { id: 'puppet-theater', label: 'Puppet Show', icon: 'Drama', color: 'bg-purple-500' },
      { id: 'cognitive', label: 'Super Solver', icon: 'BrainCircuit', color: 'bg-emerald-500' }
    ];
  
    const renderModule = () => {
      if (!schoolId) return <div className="text-center p-8"><Loader2 className="animate-spin"/></div>;
      switch (activeTab) {
        case 'emotions': return <EmotionsModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
        case 'routine-songs': return <RoutineSongsModule onSound={playFeedbackSound} schoolId={schoolId}/>;
        case 'modeling': return <ModelingModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
        case 'practical-life': return <PracticalLifeModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
        case 'communication': return <CommunicationModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
        case 'social': return <SocialScenarios onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
        case 'puppet-theater': return <PuppetTheater onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
        case 'cognitive': return <CognitiveSkills onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
        case 'physical-health': return <PhysicalHealthModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId}/>;
        default: return <div>Select a module</div>;
      }
    };
  
    return (
      <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500 font-black">
        <div className="w-full flex justify-between items-center px-6">
          <div className="text-left">
            <h2 className="text-5xl font-black text-teal-600 uppercase tracking-tighter">Life Skills Hub 🌱</h2>
            <p className="text-slate-800 font-black italic">Social, Emotional & Independence!</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-3xl shadow-xl border-4 border-yellow-100">
             <Star className="h-8 w-8 text-yellow-400 fill-current" />
             <span className="text-3xl font-black text-slate-800">{stars}</span>
          </div>
        </div>
        <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4">
          <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-teal-50 min-w-max">
            {tabs.map((tab) => {
                const Icon = tab.icon ? LucideIcons[tab.icon] as React.ElementType : HelpCircle;
                return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as LifeSkillTab)}
                        className={`min-w-[120px] px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${activeTab === tab.id ? `${tab.color} text-white shadow-xl scale-110 -translate-y-1` : 'text-slate-800 hover:bg-teal-50'}`}>
                        <Icon className="text-lg" />
                        <span>{tab.label}</span>
                    </button>
                )
            })}
          </div>
        </div>
        <div className="w-full px-4">{renderModule()}</div>
      </div>
    );
};
