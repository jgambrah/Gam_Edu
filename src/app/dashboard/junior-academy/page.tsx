

'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where, setDoc, increment, getDocs } from 'firebase/firestore';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight,
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette,
  Trophy, Gift, Check, CheckCircle2, XCircle, PenTool, Eraser, Database, Pencil, Heart, Utensils, Smile, Tv, Users, Activity, CheckSquare, BrainCircuit, Handshake, Milestone, Ear, Layers, AudioLines, Repeat, Underline, BookCheck, FolderOpen, Car, Earth, Sparkles, HeartPulse, CloudSun, PawPrint, Shapes, Languages, PenNib, Apple, Sun, CloudRain, Guitar, Plane, MousePointer2, Cube, Carrot, Cookie, School, Home, Recycle, Water, Droplets, HelpCircle, MessageSquare, Drama, ArrowLeft, Play, Flag, GraduationCap, Monitor, Zap, CircleDot
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

// --- Singing Dictionary ---
const SingingDictionary = ({ schoolId }: { schoolId: string }) => {
    const [selectedLetter, setSelectedLetter] = useState('A');
    const [wordData, setWordData] = useState<any>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const handleLetterClick = useCallback(async (letter: string) => {
        setSelectedLetter(letter);
        setIsLoading(true);
        const wordInfo = constants.VOCABULARY_DATA.find(w => w.word.startsWith(letter)) || constants.VOCABULARY_DATA[0];
        
        const details = await generateWordDetails({ word: wordInfo.word, schoolId });
        if (details.success) setWordData(details.data);

        const imageRes = await generateLessonImageAction({ prompt: `3D claymation style of ${wordInfo.imagePrompt}, centered, simple, nursery aesthetic, soft lighting`, schoolId });
        if (imageRes.success && imageRes.data) setImageUrl(imageRes.data);

        setIsLoading(false);
    }, [schoolId]);

    useEffect(() => {
        handleLetterClick('A');
    }, [handleLetterClick]);
  
    const handleSing = async () => {
      if (!wordData || !schoolId) return;
      await generateTTSAction({ text: `Let's spell ${wordData.word}! ${wordData.word.split('').join(', ')}. ${wordData.word}! Now, let's use it in a sentence. ${wordData.sentence}`, voice: 'Enif', schoolId });
    };
  
    return (
      <Card className="rounded-[60px] border-8 border-red-100 shadow-xl overflow-hidden bg-white">
        <CardHeader className="bg-red-500 p-10 text-white text-center">
            <h3 className="text-4xl font-black uppercase tracking-tighter">Singing Dictionary</h3>
        </CardHeader>
        <CardContent className="p-12 space-y-10 flex flex-col items-center">
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
                {constants.LETTERS.map(l => (
                    <button key={l} onClick={() => handleLetterClick(l)} className={`w-12 h-12 rounded-2xl font-black text-2xl border-4 ${selectedLetter === l ? 'bg-red-500 text-white border-white scale-110' : 'bg-slate-50 text-slate-400 border-transparent'}`}>{l}</button>
                ))}
            </div>
            
            {isLoading || !wordData ? (
                <div className="h-96 flex items-center justify-center"><Loader2 className="w-16 h-16 animate-spin text-red-200" /></div>
            ) : (
                <div className="flex flex-col items-center gap-6 animate-in zoom-in">
                    <div className="w-80 h-80 bg-red-50 rounded-[4rem] border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden">
                        {imageUrl ? <img src={imageUrl} className="w-full h-full object-cover p-8" /> : <Loader2 className="w-12 h-12 animate-spin text-red-300"/>}
                    </div>
                    <h4 className="text-8xl font-black text-slate-800">{wordData.word}</h4>
                    <Button onClick={handleSing} className="h-20 px-16 bg-red-500 text-white rounded-full font-black text-3xl shadow-xl border-4 border-white">Sing with me! 🎤</Button>
                </div>
            )}
        </CardContent>
      </Card>
    );
};

const WritingCanvas = ({ onSound, schoolId }: { onSound: (text: string) => void, schoolId: string }) => {
    const traceCanvasRef = useRef<HTMLCanvasElement>(null);
    const freeCanvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedItem, setSelectedItem] = useState('1');
    const [isDrawingFree, setIsDrawingFree] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [feedback, setFeedback] = useState('');

    const setupCanvases = useCallback(() => {
        [traceCanvasRef, freeCanvasRef].forEach((ref, isTraceCanvas) => {
            const canvas = ref.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const size = 400; // Fixed size
            canvas.width = size;
            canvas.height = size;
            
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, size, size);

            if (isTraceCanvas && traceCanvasRef.current) {
                const traceCtx = traceCanvasRef.current.getContext('2d')!;
                traceCtx.font = "900 300px 'Nunito', sans-serif";
                traceCtx.textAlign = 'center';
                traceCtx.textBaseline = 'middle';
                traceCtx.strokeStyle = '#E2E8F0'; // Light gray
                traceCtx.setLineDash([10, 15]);
                traceCtx.lineWidth = 8;
                traceCtx.strokeText(selectedItem, size / 2, size / 2 + 10);
            } else if (freeCanvasRef.current) {
                 const freeCtx = freeCanvasRef.current.getContext('2d')!;
                 freeCtx.lineWidth = 20;
                 freeCtx.lineCap = 'round';
                 freeCtx.strokeStyle = '#3b82f6'; // Blue
            }
        });
    }, [selectedItem]);

    useEffect(() => {
        setupCanvases();
    }, [setupCanvases]);

    const handleCheck = async () => {
        const canvas = freeCanvasRef.current;
        if (!canvas || !schoolId) return;

        setIsEvaluating(true);
        setFeedback("Magic eyes checking...");
        
        try {
            const dataUrl = canvas.toDataURL('image/png');
            const result = await assessHandwritingAction({ 
                imageDataUri: dataUrl, 
                targetCharacter: selectedItem,
                schoolId: schoolId 
            });

            if (result.success && result.isCorrect) {
                confetti();
                setFeedback("You are a Number Superstar! ⭐");
                onSound(`Wonderful! You wrote ${selectedItem} perfectly!`);
            } else {
                setFeedback("Almost! Try tracing one more time.");
                onSound("Not quite, but good try! Let's try again!");
            }
        } catch(e: any) {
            setFeedback("The AI teacher is resting. Try again soon!");
        } finally {
            setIsEvaluating(false);
        }
    };
    
    return (
        <Card className="rounded-[60px] border-8 border-purple-100 overflow-hidden bg-white shadow-2xl">
            <div className="bg-purple-500 p-8 text-white text-center">
                <h3 className="text-4xl font-black uppercase tracking-tighter">Number Magic Pen 🪄</h3>
            </div>
            <CardContent className="p-12 space-y-10">
                <div className="flex justify-center gap-2 overflow-x-auto py-4">
                    {constants.NUMBERS.map((n) => (
                        <button key={n} onClick={() => setSelectedItem(n)} className={`w-14 h-14 rounded-2xl font-black text-2xl border-4 ${selectedItem === n ? 'bg-purple-600 text-white border-white scale-110' : 'bg-slate-50 text-slate-400 border-transparent'}`}>{n}</button>
                    ))}
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4 text-center">
                        <p className="text-slate-400 font-bold uppercase text-xs">1. Trace This</p>
                        <canvas ref={traceCanvasRef} className="border-4 border-slate-100 rounded-[3rem] w-full aspect-square" />
                    </div>
                    <div className="space-y-4 text-center relative">
                        <p className="text-slate-800 font-bold uppercase text-xs">2. Write it yourself</p>
                        <canvas 
                            ref={freeCanvasRef} 
                            onMouseDown={() => setIsDrawingFree(true)}
                            onMouseUp={() => setIsDrawingFree(false)}
                            onMouseMove={(e) => {
                                if(!isDrawingFree) return;
                                const ctx = freeCanvasRef.current?.getContext('2d');
                                if (!ctx) return;
                                const rect = freeCanvasRef.current!.getBoundingClientRect();
                                ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                                ctx.stroke();
                            }}
                            className="border-8 border-purple-200 rounded-[3rem] w-full aspect-square cursor-crosshair" 
                        />
                        {isEvaluating && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[3rem] animate-pulse"><Loader2 className="w-12 h-12 animate-spin text-purple-600"/></div>}
                    </div>
                </div>
                <div className="text-center space-y-6">
                    {feedback && <Badge className="bg-purple-100 text-purple-700 text-xl p-4 rounded-2xl border-none">{feedback}</Badge>}
                    <div className="flex gap-4 justify-center">
                        <Button onClick={setupCanvases} variant="outline" className="h-16 px-10 rounded-2xl border-4 font-black">CLEAR</Button>
                        <Button onClick={handleCheck} disabled={isEvaluating} className="h-16 px-16 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black shadow-xl">CHECK MY WORK!</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// --- Life Skills Sub-Modules ---
type LifeSkillTab = 'emotions' | 'routine-songs' | 'modeling' | 'practical-life' | 'communication' | 'social' | 'puppet-theater' | 'cognitive' | 'physical-health';

interface TeacherModalProps {
  title: string;
  topicLabel: string;
  topicValue: string;
  onTopicChange: (v: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  onClose: () => void;
}
const TeacherModal: React.FC<TeacherModalProps> = ({ title, topicLabel, topicValue, onTopicChange, onGenerate, isLoading, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-gray-50 animate-in zoom-in duration-300 font-black">
        <h3 className="text-3xl font-black text-slate-800 mb-6 uppercase tracking-tighter">{title}</h3>
        <div className="space-y-6">
          <div>
            <Label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">{topicLabel}</Label>
            <Input 
              type="text" 
              value={topicValue} 
              onChange={(e) => onTopicChange(e.target.value)} 
              placeholder="Type here..." 
              className="w-full px-6 py-4 rounded-2xl border-4 border-slate-100 outline-none font-bold focus:border-teal-300 transition-colors text-slate-800 uppercase" 
            />
          </div>
          <Button 
            onClick={onGenerate} 
            disabled={isLoading || !topicValue} 
            className="w-full py-5 rounded-2xl font-black text-white bg-teal-500 shadow-xl hover:bg-teal-600 disabled:bg-gray-300 transition-all flex items-center justify-center gap-3 border-4 border-white uppercase tracking-widest"
          >
            {isLoading ? <><Loader2 className="animate-spin"/> GENERATING...</> : <><Sparkles /> CREATE SHOW</>}
          </Button>
          <button onClick={onClose} className="w-full py-2 text-slate-400 uppercase text-[10px] font-black tracking-widest hover:text-slate-600 block text-center transition-colors font-black">Close</button>
        </div>
      </div>
    </div>
  );

const RoutineSongsModule: React.FC<{ onSound: (t: string) => void, schoolId: string }> = ({ onSound, schoolId }) => {
    const [songs, setSongs] = useState(constants.LIFE_SKILLS_DATA.music);
    const [index, setIndex] = useState(0);
    const [singing, setSinging] = useState(false);
    const current = songs[index];
  
    const handleSing = async () => {
      if (!schoolId) return;
      setSinging(true);
      const result = await generateRhyme({ topic: current.theme, schoolId });
      await onSound(`Let's sing about ${current.theme}! ${result.rhyme}`);
      setSinging(false);
    };
  
    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center animate-in zoom-in font-black">
        <h3 className="text-4xl font-black text-pink-500 mb-10 uppercase tracking-tighter">Skill Songs! 🎵</h3>
        <div className="w-32 h-32 bg-pink-100 text-pink-600 rounded-3xl flex items-center justify-center text-6xl mb-8 shadow-md border-4 border-white animate-bounce">
          <IconRenderer iconName={current.icon} />
        </div>
        <h4 className="text-4xl font-black text-slate-800 mb-8 uppercase">{current.title}</h4>
        <Button 
          onClick={handleSing} 
          disabled={singing}
          className="px-16 py-6 bg-pink-500 text-white rounded-[3rem] font-black uppercase text-2xl shadow-xl hover:scale-105 transition-all border-4 border-white"
        >
          {singing ? <Loader2 className="animate-spin" /> : <><Music className="mr-4 h-6 w-6"/> Start Song</>}
        </Button>
        <div className="flex gap-4 mt-12">
          <Button onClick={() => setIndex(i => (i === 0 ? songs.length - 1 : i - 1))} variant="outline" size="icon" className="w-14 h-14 rounded-full"><ArrowLeft/></Button>
          <Button onClick={() => setIndex(i => (i + 1) % songs.length)} variant="outline" size="icon" className="w-14 h-14 rounded-full"><ArrowRight/></Button>
        </div>
      </div>
    );
};
  
const ModelingModule: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const [data, setData] = useState(constants.LIFE_SKILLS_DATA.practicalLife.pretendPlay);
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const current = data[index];
    const [started, setStarted] = useState(false);
  
    const fetchVisual = useCallback(async () => { 
        if(!current || !schoolId) return;
        setLoading(true); 
        const result = await generateLessonImageAction({prompt: current.prompt, schoolId}); 
        if (result.success) setImageUrl(result.data || null); 
        setLoading(false); 
    }, [current, schoolId]);
    
    useEffect(() => { 
        if (started) {
            fetchVisual();
        }
    }, [index, data, started, fetchVisual]);
  
    const handleWatch = () => {
      onSound(`${current.scenario} ${current.modeling}`);
      onComplete();
    };

    if (!started) {
        return (
             <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
                <Tv className="h-16 w-16 mx-auto text-indigo-300 mb-4"/>
                <h3 className="text-2xl font-bold text-indigo-600 mb-2">Watch & Learn</h3>
                <p className="text-slate-500 mb-4">See how to do new things by watching fun animations!</p>
                <Button onClick={() => setStarted(true)} className="bg-indigo-500 hover:bg-indigo-600">Start Watching</Button>
            </div>
        )
    }
  
    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-indigo-100 flex flex-col items-center animate-in zoom-in font-black">
        <h3 className="text-4xl font-black text-indigo-500 mb-10 uppercase tracking-tighter">I Can Do It! 🎥</h3>
        <div onClick={handleWatch} className="w-full max-w-xl aspect-video bg-indigo-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <Loader2 className="w-16 h-16 animate-spin text-indigo-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6" alt={current.title} />}
        </div>
        <h4 className="text-4xl font-black text-slate-800 mb-4 uppercase">{current.title}</h4>
        <p className="text-xl font-black text-slate-500 italic mb-10 text-center leading-relaxed">"{current.scenario}"</p>
        <Button onClick={handleWatch} className="px-16 py-6 bg-indigo-500 text-white rounded-[3rem] font-black uppercase text-2xl shadow-xl border-4 border-white">Watch & Learn!</Button>
      </div>
    );
};
  
const PracticalLifeModule: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const [subTab, setSubTab] = useState<'dressing' | 'schedules'>('dressing');
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const data = subTab === 'dressing' ? constants.LIFE_SKILLS_DATA.practicalLife.dressing : constants.LIFE_SKILLS_DATA.practicalLife.schedules;
    const current = data[index] || data[0];
  
    const fetchVisual = useCallback(async () => { 
        if(!current || !schoolId) return;
        setLoading(true); 
        const result = await generateLessonImageAction({prompt: current.prompt, schoolId}); 
        if (result.success) setImageUrl(result.data || null); 
        setLoading(false); 
    }, [current, schoolId]);
    
    useEffect(() => { 
        if (started) {
            fetchVisual();
        }
    }, [subTab, index, data, started, fetchVisual]);
  
    if (!started) {
        return (
             <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
                <GraduationCap className="h-16 w-16 mx-auto text-blue-300 mb-4"/>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">My Day</h3>
                <p className="text-slate-500 mb-4">Learn about daily routines and how to get ready!</p>
                <Button onClick={() => setStarted(true)} className="bg-blue-500 hover:bg-blue-600">Start My Day</Button>
            </div>
        )
    }

    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center animate-in zoom-in font-black">
        <div className="flex gap-4 mb-10 p-2 bg-blue-50 rounded-2xl font-black">
          <button onClick={() => {setSubTab('dressing'); setIndex(0);}} className={`px-8 py-2 rounded-xl font-black text-xs uppercase ${subTab === 'dressing' ? 'bg-blue-500 text-white' : 'text-blue-400'}`}>Dressing</button>
          <button onClick={() => {setSubTab('schedules'); setIndex(0);}} className={`px-8 py-2 rounded-xl font-black text-xs uppercase ${subTab === 'schedules' ? 'bg-blue-500 text-white' : 'text-blue-400'}`}>Routine</button>
        </div>
        <h3 className="text-4xl font-black text-blue-500 mb-10 uppercase tracking-tighter">My Day ☀️</h3>
        <div onClick={() => { onSound(subTab === 'dressing' ? `I need my ${(current as any).item} because ${(current as any).need}.` : `Let's follow our routine!`); onComplete(); }} className="w-full max-w-sm aspect-square bg-blue-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <Loader2 className="w-16 h-16 animate-spin text-blue-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6" alt="practical life" />}
        </div>
        <h4 className="text-4xl font-black text-slate-800 uppercase mb-8">{(current as any).item || (current as any).name}</h4>
        <div className="flex gap-4">
          <Button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} variant="outline" size="icon" className="w-14 h-14 rounded-full"><ArrowLeft/></Button>
          <Button onClick={() => setIndex(i => (i + 1) % data.length)} variant="outline" size="icon" className="w-14 h-14 rounded-full"><ArrowRight/></Button>
        </div>
      </div>
    );
};
  
const CommunicationModule: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const [subTab, setSubTab] = useState<'pictureTalk' | 'instructions' | 'circleTime'>('pictureTalk');
    const [index, setIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const data = constants.LIFE_SKILLS_DATA.communication[subTab];
    const current = data[index] || data[0];
  
    const fetchVisual = useCallback(async () => {
        if (subTab !== 'pictureTalk' || !current || !schoolId) {
            setImageUrl(null);
            return;
        }
        setLoading(true); 
        const result = await generateLessonImageAction({ prompt: (current as any).prompt, schoolId });
        if (result.success) setImageUrl(result.data || null); 
        setLoading(false);
    }, [current, schoolId, subTab]);

    useEffect(() => { 
        if(started) fetchVisual();
    }, [subTab, index, data, started, fetchVisual]);
  
    const handleAction = () => {
      onSound((current as any).description || (current as any).spoken || (current as any).q);
      onComplete();
    };

     if (!started) {
        return (
             <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
                <MessageSquare className="h-16 w-16 mx-auto text-orange-300 mb-4"/>
                <h3 className="text-2xl font-bold text-orange-600 mb-2">Let's Talk!</h3>
                <p className="text-slate-500 mb-4">Practice talking and listening with fun activities.</p>
                <Button onClick={() => setStarted(true)} className="bg-orange-500 hover:bg-orange-600">Start Talking</Button>
            </div>
        )
    }
  
    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center animate-in zoom-in font-black">
        <div className="flex flex-wrap justify-center gap-2 mb-10 font-black">
          {(['pictureTalk', 'instructions', 'circleTime'] as const).map(t => (
            <button key={t} onClick={() => {setSubTab(t); setIndex(0);}} className={`px-6 py-2 rounded-xl font-black text-xs uppercase ${subTab === t ? 'bg-orange-500 text-white' : 'bg-slate-100'}`}>{t.replace(/([A-Z])/g, ' $1')}</button>
          ))}
        </div>
        <h3 className="text-3xl font-black text-orange-500 mb-8 uppercase">Let's Talk! 💬</h3>
        {subTab === 'pictureTalk' ? (
          <div onClick={handleAction} className="w-full max-w-2xl aspect-video bg-orange-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
            {loading ? <Loader2 className="w-16 h-16 animate-spin text-orange-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6" alt="talk" />}
          </div>
        ) : (
          <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center text-5xl mb-8 border-4 border-white animate-bounce">
             <IconRenderer iconName={(current as any).icon} />
          </div>
        )}
        <p className="text-2xl font-black text-slate-800 mb-10 text-center italic max-w-lg">"{(current as any).title || (current as any).task || (current as any).q}"</p>
        <button onClick={handleAction} className="px-16 py-6 bg-orange-500 text-white rounded-[3rem] font-black uppercase text-xl shadow-xl border-4 border-white">Start Talking!</button>
      </div>
    );
};
  
const PuppetTheater: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const [story, setStory] = useState('');
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    
    const generateStory = async () => {
      if (!schoolId) return;
      setLoading(true);
      const result = await generateRhyme({ topic: "Puppet Friends", schoolId });
      setStory(result.rhyme);
      await onSound(`Welcome to the Puppet Theater! ${result.rhyme}`);
      onComplete();
      setLoading(false);
    };

     if (!started) {
        return (
             <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
                <Drama className="h-16 w-16 mx-auto text-purple-300 mb-4"/>
                <h3 className="text-2xl font-bold text-purple-600 mb-2">Puppet Show</h3>
                <p className="text-slate-500 mb-4">Let's put on a fun show with puppets!</p>
                <Button onClick={() => setStarted(true)} className="bg-purple-500 hover:bg-purple-600">Start Show</Button>
            </div>
        )
    }
  
    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-purple-100 flex flex-col items-center animate-in zoom-in font-black">
        <h3 className="text-4xl font-black text-purple-600 mb-10 uppercase tracking-tighter">Puppet Theater 🎭</h3>
        <div className="w-80 h-80 bg-purple-50 rounded-full border-8 border-white shadow-2xl flex items-center justify-center mb-10 relative overflow-hidden group">
           <Drama className="text-8xl text-purple-200 group-hover:scale-110 transition-transform"/>
        </div>
        <Button onClick={generateStory} disabled={loading} className="px-16 py-6 bg-purple-600 text-white rounded-[3rem] font-black uppercase text-2xl shadow-xl border-4 border-white">
          {loading ? <Loader2 className="animate-spin" /> : "Start Show!"}
        </Button>
        {story && <p className="mt-10 text-xl font-black text-slate-700 italic text-center max-w-lg">"{story}"</p>}
      </div>
    );
};
  
const CognitiveSkills: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const [subTab, setSubTab] = useState<'scenarios' | 'patterns' | 'whatIf'>('scenarios');
    const [index, setIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [started, setStarted] = useState(false);
    const data = constants.LIFE_SKILLS_DATA.cognitive[subTab];
    const current = data[index] || data[0];
  
    useEffect(() => { setUserAnswer(null); }, [subTab, index]);
  
    const handleChoice = (idx: number) => {
      setUserAnswer(idx);
      if (idx === (current as any).correct || subTab === 'whatIf') {
        onSound(`Great thinking!`);
        onComplete();
      }
    };

    if (!started) {
        return (
             <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
                <BrainCircuit className="h-16 w-16 mx-auto text-emerald-300 mb-4"/>
                <h3 className="text-2xl font-bold text-emerald-600 mb-2">Super Solvers</h3>
                <p className="text-slate-500 mb-4">Let's solve puzzles and think about big ideas!</p>
                <Button onClick={() => setStarted(true)} className="bg-emerald-500 hover:bg-emerald-600">Start Thinking</Button>
            </div>
        )
    }
  
    return (
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center animate-in zoom-in font-black">
        <div className="flex gap-4 mb-10 font-black">
          {(['scenarios', 'patterns', 'whatIf'] as const).map(t => (
            <button key={t} onClick={() => {setSubTab(t); setIndex(0);}} className={`px-6 py-2 rounded-xl font-black text-xs uppercase ${subTab === t ? 'bg-emerald-500 text-white' : 'bg-slate-100'}`}>{t}</button>
          ))}
        </div>
        <h3 className="text-3xl font-black text-emerald-600 mb-8 uppercase">Super Solver 🧠</h3>
        <p className="text-2xl font-black text-slate-800 mb-10 text-center italic max-w-lg">"{(current as any).q}"</p>
        
        {subTab !== 'whatIf' && (
          <div className="flex gap-4 font-black">
            {(current as any).options.map((opt: string, i: number) => (
              <button key={i} onClick={() => handleChoice(i)} className={`w-24 h-24 rounded-3xl font-black text-4xl border-4 transition-all ${userAnswer === i ? (i === (current as any).correct ? 'bg-green-500 text-white border-white scale-110' : 'bg-red-500 text-white border-white') : 'bg-emerald-50 text-emerald-600 border-white'}`}>
                <IconRenderer iconName={opt} />
              </button>
            ))}
          </div>
        )}
  
        {subTab === 'whatIf' && (
          <button onClick={() => { onSound((current as any).a); onComplete(); }} className="px-16 py-6 bg-emerald-500 text-white rounded-[3rem] font-black uppercase text-xl shadow-xl border-4 border-white">Answer Me!</button>
        )}
  
        <div className="flex gap-4 mt-12 font-black">
          <Button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} variant="outline" size="icon" className="w-14 h-14 rounded-full"><ArrowLeft/></Button>
          <Button onClick={() => setIndex(i => (i + 1) % data.length)} variant="outline" size="icon" className="w-14 h-14 rounded-full"><ArrowRight/></Button>
        </div>
      </div>
    );
};
  
const SocialScenarios: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string }> = ({ onSound, onComplete, schoolId }) => {
    const [subTab, setSubTab] = useState<'interaction' | 'community'>('interaction');
    const [index, setIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [started, setStarted] = useState(false);

    const [socialData, setSocialData] = useState(constants.LIFE_SKILLS_DATA.social);
    const [communityData, setCommunityData] = useState(constants.LIFE_SKILLS_DATA.community);
  
    const isCommunity = subTab === 'community';
    const data = isCommunity ? communityData : socialData;
    const current = data[index] || data[0];
  
    const fetchVisual = useCallback(async () => {
        if (!current || !schoolId) return;
        setLoading(true);
        const result = await generateLessonImageAction({ prompt: current.prompt, schoolId });
        if (result.success) setImageUrl(result.data || null);
        setLoading(false);
    }, [current, schoolId]);

    useEffect(() => { 
        if (started) {
            fetchVisual(); 
        }
        setUserAnswer(null); 
    }, [subTab, index, data, started, fetchVisual]);
  
    const handleChoice = (optIdx: number) => {
      setUserAnswer(optIdx);
      if (optIdx === (current as any).correct) {
        onSound(`Yes! That is so kind. Being a good friend is wonderful!`);
        onComplete();
      } else {
        onSound(`Hmm, should we try a kinder choice? Look at the friend's face!`);
      }
    };
  
    const generateWithAi = async () => {
      if (!aiTopic || !schoolId) return;
      setIsAiLoading(true);
      try {
        const result = await generateLifeSkillEntry({ topic: aiTopic, category: subTab === 'community' ? 'community' : 'kindness', schoolId });
        if(result.success && result.data){
            if (subTab === 'community') {
                setCommunityData(prev => [...prev, result.data]);
            } else {
                setSocialData(prev => [...prev, result.data]);
            }
            setIsDrawerOpen(false); 
            setIndex(data.length); 
            setAiTopic('');
        }
      } catch (e) { console.error(e); } 
      finally { setIsAiLoading(false); }
    };
  
     if (!started) {
        return (
             <div className="text-center p-12 bg-white rounded-3xl shadow-lg">
                <Users className="h-16 w-16 mx-auto text-rose-300 mb-4"/>
                <h3 className="text-2xl font-bold text-rose-600 mb-2">Social & Kindness</h3>
                <p className="text-slate-500 mb-4">Learn about friends, family, and our community helpers.</p>
                <Button onClick={() => setStarted(true)} className="bg-rose-500 hover:bg-rose-600">Start Exploring</Button>
            </div>
        )
    }

    return (
      <div className="relative font-black">
        <button onClick={() => setIsDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-pink-200 text-pink-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase z-10 hover:bg-pink-50 transition-colors font-black"><Wand2 className="w-3 h-3 inline-block mr-1"/> AI Social Assistant</button>
        <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-right duration-500 font-black">
          <h3 className="text-4xl font-black text-pink-500 mb-8 uppercase tracking-tighter text-center font-black">Social & Emotional Hub 🤝</h3>
          
          <div className="flex gap-4 mb-10 p-2 bg-pink-50 rounded-2xl font-black">
            <button onClick={() => {setSubTab('interaction'); setIndex(0);}} className={`px-8 py-2 rounded-xl font-black text-xs uppercase transition-all ${subTab === 'interaction' ? 'bg-pink-500 text-white shadow-md' : 'text-pink-400'}`}>Interaction</button>
            <button onClick={() => {setSubTab('community'); setIndex(0);}} className={`px-8 py-2 rounded-xl font-black text-xs uppercase transition-all ${subTab === 'community' ? 'bg-pink-500 text-white shadow-md' : 'text-pink-400'}`}>Community</button>
          </div>
  
          {subTab === 'interaction' ? (
            <div className="flex flex-col items-center w-full font-black">
              <h4 className="text-3xl font-black text-pink-600 mb-4 uppercase tracking-tighter">{(current as any).scenario}</h4>
              <p className="text-xl font-black text-slate-800 mb-10 italic text-center max-w-lg leading-relaxed">"{(current as any).q}"</p>
              <div className="w-full max-w-lg aspect-video rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden bg-pink-50 font-black">
                {loading ? <Loader2 className="w-16 h-16 animate-spin text-pink-400" /> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-4 animate-in zoom-in" />}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl font-black">
                 {(current as any).options.map((opt: string, i: number) => (
                   <button key={i} onClick={() => handleChoice(i)} className={`px-6 py-4 rounded-3xl font-black text-lg border-4 transition-all ${userAnswer === i ? (i === (current as any).correct ? 'bg-green-500 text-white border-white scale-105 shadow-xl' : 'bg-red-500 text-white border-white') : 'bg-pink-50 text-slate-800 border-white hover:bg-pink-100'}`}>
                    {opt}
                 </button>
               ))}
              </div>
              {userAnswer === (current as any).correct && <button onClick={() => setIndex(p => (p + 1) % socialData.length)} className="mt-10 px-12 py-5 bg-pink-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase tracking-widest font-black">Next Challenge! ❤️</button>}
            </div>
          ) : (
            <div className="flex flex-col items-center w-full font-black animate-in zoom-in">
               <div className="w-24 h-24 bg-pink-100 text-pink-600 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-md border-4 border-white animate-bounce font-black">
                 <IconRenderer iconName={(current as any).icon} />
               </div>
               <h4 className="text-4xl font-black text-pink-600 uppercase mb-4 tracking-tighter">{(current as any).role}</h4>
               
               <div onClick={() => onSound((current as any).fact)} className="relative w-full max-w-lg aspect-square bg-pink-50 rounded-[4rem] border-8 border-white shadow-2xl overflow-hidden mb-10 cursor-pointer group font-black">
                 {loading ? <div className="absolute inset-0 flex items-center justify-center animate-spin font-black"><Heart className="h-4 w-4 text-pink-200"/></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 transition-transform group-hover:scale-110" alt={(current as any).role} />}
                 <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/5 transition-colors flex items-center justify-center font-black">
                    <Volume2 className="text-white text-6xl opacity-0 group-hover:opacity-100 drop-shadow-lg font-black" />
                 </div>
              </div>
  
              <div className="bg-pink-50 p-8 rounded-3xl border-4 border-dashed border-pink-200 text-center w-full max-w-xl mb-10 font-black">
                 <p className="text-2xl font-black text-pink-800 italic leading-relaxed font-black font-black">"{(current as any).fact}"</p>
              </div>
  
              <div className="flex gap-4 font-black">
                <Button onClick={() => setIndex(i => (i === 0 ? communityData.length - 1 : i - 1))} variant="outline" size="icon" className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all hover:bg-slate-200 font-black"><ArrowLeft/></Button>
                <Button onClick={() => { onSound((current as any).fact); onComplete(); }} className="px-12 py-5 bg-pink-500 text-white font-black rounded-3xl shadow-xl border-4 border-white uppercase tracking-widest font-black">Learn Role! 🌟</Button>
                <Button onClick={() => setIndex(i => (i + 1) % communityData.length)} variant="outline" size="icon" className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all hover:bg-slate-200 font-black"><ArrowRight/></Button>
              </div>
            </div>
          )}
        </div>
        {isDrawerOpen && <TeacherModal title={`AI Social Assistant`} topicLabel={subTab === 'community' ? 'Community Helper' : 'Social Skill'} topicValue={aiTopic} onTopicChange={setAiTopic} onGenerate={generateWithAi} isLoading={isAiLoading} onClose={() => setIsDrawerOpen(false)} />}
      </div>
    );
};
  
const LifeSkillsZone: React.FC = () => {
    const { schoolId } = useCurrentSchool();
    const [activeTab, setActiveTab] = useState<LifeSkillTab>('emotions');
    const [playing, setPlaying] = useState(false);
    const [stars, setStars] = useState(0);
    const currentSourceRef = useRef<HTMLAudioElement | null>(null);

    const playFeedbackSound = async (text: string) => {
      if (!text || !schoolId) return;
      if (currentSourceRef.current) {
        try { currentSourceRef.current.pause(); } catch (e) {}
      }
      setPlaying(true);
      const result = await generateTTSAction({ text, voice: 'Kore', schoolId });
      if (result.success && result.data && typeof window !== 'undefined') {
        const audio = new Audio(`data:audio/wav;base64,${result.data}`);
        currentSourceRef.current = audio;
        audio.play();
        audio.onended = () => setPlaying(false);
      } else { setPlaying(false); }
    };

    const addStar = () => { setStars(prev => prev + 1); };

    const tabs: {id: LifeSkillTab, label: string, icon: React.ElementType, color: string}[] = [
        { id: 'physical-health', label: 'Physical & Health', icon: HeartPulse, color: 'bg-green-500' },
        { id: 'emotions', label: 'Feelings', icon: Smile, color: 'bg-yellow-500' },
        { id: 'routine-songs', label: 'Skill Songs', icon: Music, color: 'bg-pink-500' },
        { id: 'modeling', label: 'Modeling', icon: Tv, color: 'bg-indigo-500' },
        { id: 'practical-life', label: 'Play & Routines', icon: GraduationCap, color: 'bg-blue-500' },
        { id: 'communication', label: 'Talk & Listen', icon: MessageSquare, color: 'bg-orange-500' },
        { id: 'social', label: 'Social & Kind', icon: Users, color: 'bg-rose-500' },
        { id: 'puppet-theater', label: 'Puppet Show', icon: Drama, color: 'bg-purple-500' },
        { id: 'cognitive', label: 'Super Solver', icon: Brain, color: 'bg-emerald-500' }
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
          case 'physical-health': return <PhysicalHealthModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId} />;
          default: return null;
        }
    };
  
    return (
      <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500 font-black">
        <div className="w-full flex justify-between items-center px-6">
          <div className="text-left">
            <h2 className="text-5xl font-black text-teal-600 uppercase tracking-tighter">Life Skills Hub 🌟</h2>
            <p className="text-slate-800 font-black italic">Social, Emotional & Independence!</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-3xl shadow-xl border-4 border-yellow-100">
             <Star className="h-8 w-8 text-yellow-400 fill-current" />
             <span className="text-3xl font-black text-slate-800">{stars}</span>
          </div>
        </div>
        <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4 font-black">
          <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-teal-50 min-w-max font-black">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-w-[120px] px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 ${
                    activeTab === tab.id ? `${tab.color} text-white shadow-xl scale-110 -translate-y-1` : 'text-slate-800 hover:bg-teal-50 font-black'
                  }`}
                >
                  <Icon className={`w-5 h-5`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="w-full px-4 font-black">
          {renderModule()}
        </div>
      </div>
    );
};

// --- MAIN PAGE ---
export default function JuniorCampusPage() {
    const { role } = useRole();
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

                <Tabs defaultValue="stories" className="w-full">
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
