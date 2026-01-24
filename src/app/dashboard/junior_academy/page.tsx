
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
import LifeSkillsZone from './life-skills-zone';
import WritingCanvas from './writing-canvas'; 


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
        // Fuzzy match: check if user answer contains the key part of the correct answer
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
            // Quiz finished
            setStory(null);
            setTopic('');
            confetti({ particleCount: 200, spread: 100 });
            toast({ title: "Mission Complete!", description: "You mastered the whole story!" });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* 1. TEACHER'S MAGIC WRITING TOOL */}
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
                        {/* THE STORY CONTENT */}
                        <div className="max-w-4xl mx-auto">
                            <p className="text-3xl font-bold text-orange-900 leading-relaxed font-serif first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left whitespace-pre-wrap">
                                {story.content}
                            </p>
                        </div>

                        {/* 3-QUESTION CHALLENGE BOX */}
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
                /* 3. LIBRARY SECTION: SAVED STORIES */
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
                        <TabsContent value="writing" className="mt-0">{schoolId && <WritingCanvas onSound={() => {}} schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="stories" className="mt-0">{schoolId && <StorySpark canEdit={canEdit} schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="phonics" className="mt-0">{schoolId && <PhonicsWorld schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="dictionary" className="mt-0">{schoolId && <SingingDictionary schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="math" className="mt-0">{schoolId && <MathPlayground schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="science" className="mt-0">{schoolId && <JuniorScienceWorld schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="art" className="mt-0"><div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300">{schoolId && <ArtStudio schoolId={schoolId} />}</div></TabsContent>
                        <TabsContent value="rewards" className="mt-0">{schoolId && <StickerBook schoolId={schoolId} />}</TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

    
