
'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where, setDoc, increment, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, 
  Trophy, Gift, Check, CheckCircle2, XCircle, PenTool, Eraser, Database, Pencil, Heart, Utensils, Smile, Tv, Users, Activity, CheckSquare, BrainCircuit, Handshake, Milestone, Ear, Layers, AudioLines, Repeat, Underline, BookCheck, FolderOpen, Car, Earth, Sparkles, HeartPulse, CloudSun, PawPrint, Shapes, Languages, PenNib, Apple, Sun, CloudRain, Guitar, Plane, MousePointer2, Cube, Carrot, Cookie, School, Home, Recycle, Water, Droplets, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateWordDetails, generateTTSAction, assessHandwritingAction, generateLifeSkillEntry, generateLessonImageAction, generatePhonicsWorldEntry, generateMathWorldEntry, generateScienceWorldEntry, generateRhyme } from '@/ai/flows/junior-actions';
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


// --- ICON MAPPER ---
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
    };
  
    const LucideName = map[iconName] || 'HelpCircle';
    const IconComponent = (LucideIcons as any)[LucideName];
  
    return <IconComponent className={className} />;
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
    
    bubble: "bg-white/80 backdrop-blur-md p-6 rounded-[40px] border-4 border-dashed border-pink-200",
};


// --- TEACHER MAGIC MODAL ---
const TeacherModal: React.FC<{
  title: string; topicValue: string; 
  onTopicChange: (v: string) => void; onGenerate: () => void; 
  isLoading: boolean; onClose: () => void;
}> = ({ title, topicValue, onTopicChange, onGenerate, isLoading, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
    <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-green-100 animate-in zoom-in duration-300">
      <h3 className="text-3xl font-black text-slate-800 mb-6 uppercase tracking-tighter">AI {title}</h3>
      <div className="space-y-6">
        <div>
          <Label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">What should the AI create?</Label>
          <Input 
            value={topicValue} 
            onChange={(e) => onTopicChange(e.target.value)} 
            placeholder="e.g. Venus Flytrap, Lungs, Solar Power" 
            className="h-14 rounded-2xl border-4 border-slate-100 font-bold uppercase" 
          />
        </div>
        <Button 
          onClick={onGenerate} 
          disabled={isLoading || !topicValue} 
          className="w-full h-16 rounded-2xl font-black text-white bg-green-500 hover:bg-green-600 shadow-xl"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2"/> : <Wand2 className="mr-2"/>} CREATE MAGIC
        </Button>
        <button onClick={onClose} className="w-full text-slate-400 uppercase text-[10px] font-black tracking-widest mt-4">Close Drawer</button>
      </div>
    </div>
  </div>
);


// --- SUB-COMPONENT: STORY SPARK (Dr. Gam Version) ---
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

// --- SUB-COMPONENT: SINGING DICTIONARY ---
function SingingDictionary({ schoolId }: { schoolId: string }) {
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [rhyme, setRhyme] = useState('');
    const { toast } = useToast();
    
    const words = constants.DICTIONARY_WORDS; 
    const current = words[index];

    useEffect(() => {
        const loadPage = async () => {
            if (!current || !schoolId) return;
            setLoading(true);
            setRhyme('');
            try {
                const result = await generateLessonImageAction({ prompt: current.imagePrompt, schoolId });
                if (result.success) {
                    setImageUrl(result.data || null);
                } else {
                    throw new Error(result.error);
                }
            } catch (e: any) {
                toast({ title: 'Image Error', description: e.message, variant: 'destructive' });
            } finally {
                setLoading(false);
            }
        };
        loadPage();
    }, [index, current, schoolId, toast]);

    const playSong = async () => {
        if (!current || !schoolId) return;
        setLoading(true);
        try {
            const rhymeResult = await generateRhyme({ topic: current.word, schoolId });
            if (!rhymeResult.success || !rhymeResult.rhyme) {
                throw new Error(rhymeResult.error || 'Failed to generate rhyme.');
            }
            const songText = rhymeResult.rhyme;
            setRhyme(songText);

            const ttsResult = await generateTTSAction({ text: songText, voice: 'Puck', schoolId });
            if (!ttsResult.success || !ttsResult.data) {
                throw new Error(ttsResult.error || 'Failed to generate audio.');
            }
            if (typeof window !== 'undefined') {
              const audio = new Audio(`data:audio/wav;base64,${ttsResult.data}`);
              audio.play();
            }
        } catch (e: any) {
            toast({ title: 'AI Error', description: e.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-8 animate-in fade-in">
            <div className="flex justify-center gap-2 overflow-x-auto p-4 bg-white rounded-3xl shadow-lg border-4 border-red-50 w-full max-w-4xl">
                {words.map((w, i) => (
                    <button 
                        key={i} 
                        onClick={() => setIndex(i)} 
                        className={`flex-shrink-0 w-12 h-12 rounded-lg font-black text-xl transition-all ${index === i ? 'bg-red-500 text-white scale-110 shadow-lg' : 'bg-red-50 text-red-400 hover:bg-red-100'}`}
                    >
                        {w.word[0]}
                    </button>
                ))}
            </div>

            <Card className={juniorStyles.card}>
                <div className="bg-gradient-to-r from-red-400 to-pink-400 p-8 text-white text-center">
                    <h2 className="text-7xl font-black">{current.word}</h2>
                    <p className="text-2xl font-bold uppercase tracking-widest">{current.category}</p>
                </div>
                <CardContent className="p-10 flex flex-col items-center space-y-8">
                    <div className="w-80 h-80 rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden bg-red-50">
                        {loading && !imageUrl ? <div className="flex h-full items-center justify-center animate-spin text-red-200"><Loader2 size={48}/></div> : imageUrl ? <img src={imageUrl} className="w-full h-full object-cover" alt={current.word} /> : <div className="flex h-full items-center justify-center text-red-200"><Loader2 size={48}/></div>}
                    </div>
                    
                    {rhyme && (
                        <div className="bg-red-50 p-6 rounded-3xl border-4 border-dashed border-red-200 text-center animate-in zoom-in">
                            <p className="text-xl font-bold text-red-700 whitespace-pre-wrap">{rhyme}</p>
                        </div>
                    )}

                    <Button onClick={playSong} disabled={loading} className={`${juniorStyles.button} bg-red-500 hover:bg-red-600 shadow-[0_10px_0_#991b1b]`}>
                        <Music className="mr-3" /> SING ALONG!
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

// --- SUB-COMPONENT: Life Skills Zone ---
function LifeSkillsZone({ schoolId, canEdit }: { schoolId: string, canEdit: boolean }) {
    const firestore = useFirestore();
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState('feelings');
    const [activeItem, setActiveItem] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiTopic, setAiTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // AI-generated image state
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(false);

    const tabs = [
        { id: 'feelings', icon: Smile, label: 'Feelings' },
        { id: 'health', icon: HeartPulse, label: 'My Body & Health' },
        { id: 'kindness', icon: Users, label: 'Kindness & Community' },
        { id: 'songs', icon: Music, label: 'Routine Songs' },
        { id: 'watch', icon: Tv, label: 'Watch & Learn' },
        { id: 'routine', icon: Activity, label: 'My Day' },
        { id: 'talk', icon: MessageSquare, label: 'Let\'s Talk' },
        { id: 'puppets', icon: Handshake, label: 'Puppet Shows' },
        { id: 'solver', icon: CheckSquare, label: 'Problem Solver' },
    ];

    const dataQuery = useMemoFirebase(() => 
        firestore ? query(
            collection(firestore, 'junior_lifeskills_world'), 
            where('schoolId', '==', schoolId),
            where('category', '==', activeTab),
            orderBy('createdAt', 'asc')
        ) : null, [firestore, schoolId, activeTab]);
    
    const { data: dbItems, forceRefetch } = useCollection<any>(dataQuery);

    const displayItems = useMemo(() => {
        if (dbItems && dbItems.length > 0) return dbItems;

        switch (activeTab) {
            case 'feelings': return constants.LIFE_SKILLS_DATA.emotions.map(e => ({ ...e, title: e.name }));
            case 'health': return constants.LIFE_SKILLS_DATA.health.map(h => ({ ...h, prompt: h.action }));
            case 'kindness': return constants.LIFE_SKILLS_DATA.social;
            case 'songs': return constants.LIFE_SKILLS_DATA.music;
            case 'watch': return constants.LIFE_SKILLS_DATA.practicalLife.pretendPlay;
            case 'routine': return constants.LIFE_SKILLS_DATA.practicalLife.schedules;
            case 'talk': return constants.LIFE_SKILLS_DATA.communication.pictureTalk;
            case 'puppets': return []; 
            case 'solver': return constants.LIFE_SKILLS_DATA.cognitive.patterns;
            default: return [];
        }
    }, [dbItems, activeTab]);

    useEffect(() => {
        if (displayItems && displayItems.length > 0) {
            setActiveItem(displayItems[0]);
        } else {
            setActiveItem(null);
        }
    }, [displayItems, activeTab]);

    useEffect(() => {
        const generateImage = async () => {
            if (!activeItem?.imagePrompt || !schoolId) {
                setImageUrl(null);
                return;
            }
            setIsImageLoading(true);
            try {
                const res = await generateLessonImageAction({ prompt: activeItem.imagePrompt, schoolId });
                if (res.success) {
                    setImageUrl(res.data || null);
                }
            } catch (e) { console.error(e); }
            finally { setIsImageLoading(false); }
        };
        generateImage();
    }, [activeItem, schoolId]);

    const handleAiGenerate = async () => {
        if (!aiTopic.trim() || !schoolId) return;
        setIsLoading(true);
        try {
            const result = await generateLifeSkillEntry({ category: activeTab, topic: aiTopic, schoolId });
            if (result.success && result.data) {
                await addDoc(collection(firestore!, 'junior_lifeskills_world'), {
                    ...result.data,
                    category: activeTab,
                    schoolId: schoolId,
                    createdAt: serverTimestamp()
                });
                toast({ title: 'AI created a new activity!' });
                forceRefetch();
                setIsDrawerOpen(false);
                setAiTopic('');
            } else {
                throw new Error(result.error || "AI failed to generate content.");
            }
        } catch (e: any) {
            toast({ variant: "destructive", title: "Error", description: e.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-4 gap-6 animate-in fade-in">
            <Card className="lg:col-span-1 rounded-[40px] border-4 border-green-100 shadow-sm bg-white">
                 <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-black text-green-800">Life Skills Lab</CardTitle>
                    <CardDescription className="text-green-500 font-bold">Growing Smarter & Kinder</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all text-left font-black ${
                                    activeTab === tab.id ? 'bg-green-500 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-green-50'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span className="text-sm">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="lg:col-span-3 space-y-4">
                 {canEdit && (
                    <Button onClick={() => setIsDrawerOpen(true)} className="w-full h-12 bg-green-500 hover:bg-green-600 rounded-2xl font-black shadow-lg">
                        <Wand2 className="w-4 h-4 mr-2" /> AI Magic: Create New Activity
                    </Button>
                 )}

                 {activeItem ? (
                     <Card className="rounded-[40px] border-8 border-green-100 shadow-xl bg-white overflow-hidden min-h-[500px]">
                        <CardHeader className="bg-green-500 text-white p-8">
                            <h3 className="text-4xl font-black uppercase tracking-tighter">{activeItem.title}</h3>
                        </CardHeader>
                        <CardContent className="p-10 flex flex-col items-center gap-8">
                             <div className="w-80 h-64 bg-green-50 rounded-3xl border-4 border-white shadow-inner flex items-center justify-center overflow-hidden">
                                {isImageLoading ? <Loader2 className="animate-spin text-green-200" /> : <img src={imageUrl || "https://placehold.co/400x300/a7f3d0/14532d?text=Activity"} className="w-full h-full object-cover" />}
                             </div>
                             <div className="text-2xl text-center font-bold text-slate-700">
                                {activeItem.prompt || activeItem.action || activeItem.q || activeItem.story}
                             </div>
                        </CardContent>
                     </Card>
                 ) : (
                    <Card className="min-h-[500px] flex items-center justify-center bg-slate-50 border-2 border-dashed">
                        <div className="text-center text-slate-400">
                            <p>No activities for this topic yet.</p>
                            {canEdit && <p>Use the AI Maker to create one!</p>}
                        </div>
                    </Card>
                 )}
            </div>
             {isDrawerOpen && (
                <TeacherModal 
                    title="Life Skills Activity" 
                    topicValue={aiTopic} 
                    onTopicChange={setAiTopic} 
                    onGenerate={handleAiGenerate} 
                    isLoading={isLoading} 
                    onClose={() => setIsDrawerOpen(false)} 
                />
            )}
        </div>
    );
}

// --- SUB-COMPONENT: WRITING CANVAS ---
const WritingCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#3B82F6'); 
    const [mode, setMode] = useState<'letters' | 'numbers'>('letters');
    const [selectedItem, setSelectedItem] = useState('A');
    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = canvas.parentElement?.clientWidth || 500;
        canvas.height = canvas.parentElement?.clientHeight || 500;
        
        ctx.fillStyle = '#F1F5F9';
        ctx.fillRect(0,0, canvas.width, canvas.height);

        ctx.font = `900 ${canvas.height * 0.8}px 'Nunito', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 6;
        ctx.setLineDash([20, 15]);
        ctx.strokeText(selectedItem, canvas.width / 2, canvas.height / 2 + 10);
        ctx.setLineDash([]);
        
    }, [selectedItem]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    };

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        return {
            x: ('touches' in e) ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX,
            y: ('touches' in e) ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY,
        };
    };

    const clearCanvas = () => {
         const canvas = canvasRef.current;
         const ctx = canvas?.getContext('2d');
         if (!ctx || !canvas) return;
         ctx.clearRect(0,0, canvas.width, canvas.height);
         ctx.fillStyle = '#F1F5F9';
         ctx.fillRect(0,0, canvas.width, canvas.height);
         ctx.strokeText(selectedItem, canvas.width / 2, canvas.height / 2 + 10);
    };

    return (
        <Card className="rounded-[60px] border-8 border-purple-100 overflow-hidden bg-white shadow-2xl">
            <div className="bg-purple-500 p-8 text-white text-center">
                <h3 className="text-4xl font-black uppercase tracking-tighter">Magic Writing Pad</h3>
            </div>
            <CardContent className="p-10 space-y-10">
                <div className="flex justify-center gap-2 overflow-x-auto py-4">
                    {(mode === 'letters' ? constants.LETTERS : constants.NUMBERS).map(item => (
                        <button key={item} onClick={() => setSelectedItem(item)} className={`flex-shrink-0 w-14 h-14 rounded-2xl font-black text-2xl border-4 ${selectedItem === item ? 'bg-purple-500 text-white border-white scale-110 shadow-lg' : 'bg-slate-50 text-slate-400'}`}>{item}</button>
                    ))}
                </div>
                
                <div className="w-full max-w-lg mx-auto aspect-square rounded-[3rem] bg-slate-200 overflow-hidden shadow-inner border-8 border-white">
                    <canvas 
                        ref={canvasRef} 
                        onMouseDown={startDrawing}
                        onMouseUp={() => setIsDrawing(false)}
                        onMouseLeave={() => setIsDrawing(false)}
                        onMouseMove={draw}
                        className="cursor-crosshair"
                    />
                </div>
                
                <div className="flex justify-center items-center gap-4">
                     <Button onClick={clearCanvas} variant="outline" className="h-16 px-10 rounded-2xl border-4 font-black"><Eraser className="mr-2"/> Clear</Button>
                     <Button className="h-20 px-12 bg-purple-600 hover:bg-purple-700 rounded-3xl font-black text-xl shadow-lg">Check My Work! ✅</Button>
                </div>
            </CardContent>
        </Card>
    );
};


export default function JuniorCampusPage() {
    const { role, profile } = useRole();
    const { user } = useUser();
    
    const schoolId = profile?.schoolId || (user as any)?.schoolId || "sunnyside-default";
    const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');

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
                    <div className="flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-[20px] border-2 border-slate-100">
                        <Badge variant="outline" className="text-indigo-500 border-indigo-200">SaaS Node</Badge>
                        <span className="text-xs font-black text-slate-400">{schoolId}</span>
                    </div>
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
                        <TabsContent value="lifeskills" className="mt-0"><LifeSkillsZone schoolId={schoolId} canEdit={canEdit} /></TabsContent>
                        <TabsContent value="writing" className="mt-0"><WritingCanvas /></TabsContent>
                        <TabsContent value="stories" className="mt-0"><StorySpark canEdit={canEdit} schoolId={schoolId} /></TabsContent>
                        <TabsContent value="phonics" className="mt-0"><PhonicsWorld schoolId={schoolId} /></TabsContent>
                        <TabsContent value="dictionary" className="mt-0"><SingingDictionary schoolId={schoolId} /></TabsContent>
                        <TabsContent value="math" className="mt-0"><MathPlayground schoolId={schoolId} /></TabsContent>
                        <TabsContent value="science" className="mt-0"><JuniorScienceWorld schoolId={schoolId} /></TabsContent>
                        <TabsContent value="art" className="mt-0"><div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300"><ArtStudio schoolId={schoolId} /></div></TabsContent>
                        <TabsContent value="rewards" className="mt-0"><StickerBook schoolId={schoolId} /></TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
