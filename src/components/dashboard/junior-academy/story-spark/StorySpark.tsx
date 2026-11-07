'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Loader2, Volume2, Star, Wand2, Sparkles, ArrowRight, Save, Trash2, BookOpen,
  CheckCircle2, XCircle, Type, Search, Play, Pause,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateWordDetails, generateLessonImageAction } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';
import { useJuniorSchoolId, juniorStamp, removeJuniorDoc, useSchoolAndMine } from '../junior-shared';
import { normalizeStory } from '@/lib/story-spark/normalize';
import { buildStoryCoverPath } from '@/lib/story-spark/storage-path';

// --- 5. STORY SPARK ---
// What one generation really charges: 3 for the story text + 5 for the cover picture (junior-actions.ts).
const STORY_CREDIT_COST = 3 + 5;
export function StorySpark({ canEdit, activeAgeTier = 'ages2-3' }: { canEdit: boolean; activeAgeTier?: string }) {
    const { user } = useUser(); 
    const { role } = useRole();
    const firestore = useFirestore(); 
    const juniorSchoolId = useJuniorSchoolId();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    // ONE school id for everything this component does: where the cover is stored, which school the story
    // document belongs to, and which school's credits are charged. (Before, these three could disagree.)
    const ownerSchoolId = juniorSchoolId || schoolId || null;
    // A saved story whose cover picture could not be stored yet. The picture is kept here so it can be
    // uploaded again later WITHOUT regenerating the story or spending credits.
    const [pendingCover, setPendingCover] = useState<{ docId: string; dataUrl: string; title: string } | null>(null);
    const [retryingCover, setRetryingCover] = useState(false);
    
    const TODDLER_STORY = useMemo(() => ({
      title: "The Happy Little Puppy 🐶",
      pages: [
        { text: "Once upon a time, a happy little puppy ran in the green grass. Woof woof!", emoji: "🐶" },
        { text: "The puppy found a bright red ball and rolled it with his nose. Wheee!", emoji: "⚽" },
        { text: "After playing all day, the tired puppy went to sleep under the warm sun. Goodnight puppy!", emoji: "😴" }
      ]
    }), []);

    // Core State
    const [story, setStory] = useState<any>(activeAgeTier === 'ages2-3' ? TODDLER_STORY : null); 
    const [topic, setTopic] = useState(''); 
    const [context, setContext] = useState('');
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    // Word Explorer States
    const [explorerMode, setExplorerMode] = useState<'read' | 'explore'>('read');
    const [explorerLoading, setExplorerLoading] = useState(false);
    const [exploredWord, setExploredWord] = useState<any>(null);
    const [isExplorerOpen, setIsExplorerOpen] = useState(false);

    // Voice/TTS States
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [spokenCharIndex, setSpokenCharIndex] = useState(-1);
    const [selectedCharId, setSelectedCharId] = useState('narrator');
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoiceName, setSelectedVoiceName] = useState('');

    // Everything below reads the story through this one normalised view, so old `content` stories and
    // `pages` stories (like the built-in toddler story) both open. `story` itself stays the raw stored shape.
    const view = useMemo(() => normalizeStory(story), [story]);
    // Stories may have any number of questions, or none (then there is simply no quiz — enjoyment-only reading).
    const totalQuestions = view.questions.length;

    const voiceCharacters = useMemo(() => [
        { id: 'narrator', name: '👩‍🏫 Miss Sarah', icon: '👩‍🏫', rate: 0.9, pitch: 1.05, description: 'Friendly and clear teacher voice' },
        { id: 'bear', name: '🐻 Barnaby Bear', icon: '🐻', rate: 0.75, pitch: 0.7, description: 'Deep, slow, and cozy story voice' },
        { id: 'unicorn', name: '🦄 Lily Unicorn', icon: '🦄', rate: 1.0, pitch: 1.35, description: 'High, sparkly, and bright voice' },
        { id: 'robot', name: '🤖 Sparky Robot', icon: '🤖', rate: 0.95, pitch: 0.8, description: 'Friendly robotic tone' }
    ], []);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        const loadVoices = () => {
            const allVoices = window.speechSynthesis.getVoices();
            const englishVoices = allVoices.filter(v => v.lang.startsWith('en-'));
            setVoices(englishVoices);
            
            const defaultVoice = englishVoices.find(v => 
                v.name.includes('Google US English') || 
                v.name.includes('Natural') || 
                v.name.includes('Apple') ||
                v.lang === 'en-US'
            ) || englishVoices[0];
            
            if (defaultVoice && !selectedVoiceName) {
                setSelectedVoiceName(defaultVoice.name);
            }
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [selectedVoiceName]);

    // Auto-scroll to currently spoken word during read-aloud
    useEffect(() => {
        if (isSpeaking && typeof document !== 'undefined') {
            const activeWordEl = document.querySelector('.story-word-active');
            if (activeWordEl) {
                activeWordEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }
    }, [spokenCharIndex, isSpeaking]);

    // Get active text based on current story content
    const activeText = view.fullText;

    // Split the text into lines, and lines into words, tracking character offsets
    const linesWithWordsAndOffsets = useMemo(() => {
        if (!activeText) return [];
        const lines = activeText.split('\n');
        let totalOffset = 0;
        
        return lines.map((lineText: string, lineIdx: number) => {
            const words: { word: string; start: number; end: number }[] = [];
            const wordRegex = /\S+/g;
            let match;
            while ((match = wordRegex.exec(lineText)) !== null) {
                words.push({
                    word: match[0],
                    start: totalOffset + match.index,
                    end: totalOffset + match.index + match[0].length
                });
            }
            totalOffset += lineText.length + 1; // +1 for the '\n' character
            return {
                lineIdx,
                lineText,
                words
            };
        });
    }, [activeText]);
    
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
    
    // This school's stories plus my own (was every school's stories, unbounded).
    const { data: savedStories, forceRefetch } = useSchoolAndMine('junior_stories', juniorSchoolId, user?.uid);
    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setUserAnswer('');
        setIsAnswerSubmitted(false);
        setIsAnswerCorrect(false);
        setScore(0);
        setQuizFinished(false);
    };

    const handleGenerate = async () => { 
        // One id per click: the server charges each step once per id, so a double click or replay can't double-charge.
        const requestId = (typeof crypto !== 'undefined' && 'randomUUID' in crypto) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setLoading(true); 
        try {
            // Pass the target word count to the AI flow
            const res = await generateJuniorStory({ topic, context, wordCount: parseInt(targetWordCount), schoolId: ownerSchoolId || '', requestId }); 
            if (res.success && res.data) {
                let imageUrl = '';

                try {
                    const imgRes = await generateLessonImageAction({
                        prompt: `A cute 3D Pixar-style digital illustration of a children's storybook scene depicting: ${res.data.title}. Bright colors, soft lighting, friendly characters, highly detailed.`,
                        schoolId: ownerSchoolId || '',
                        requestId
                    });
                    if (imgRes.success && imgRes.data) {
                        imageUrl = imgRes.data;
                    }
                } catch (err) {
                    console.error("Story cover image generation failed:", err);
                }

                setStory({ ...res.data, imageUrl });
                setCurrentPageIndex(0);
                resetQuiz();
                toast({ title: "Story Created!", description: "Your custom illustrated storybook is ready! 📖" });
            } else {
                toast({ 
                    title: "Generation Failed", 
                    description: res.error || "Failed to generate story. Please verify your school ID and AI credits.",
                    variant: "destructive"
                });
            }
        } catch (err: any) {
            console.error("Story generation crash:", err);
            toast({
                title: "Unexpected Error",
                description: err.message || "Something went wrong during generation. Check dev console.",
                variant: "destructive"
            });
        } finally {
            setLoading(false); 
        }
    };
     
    const sanitizeForFirestore = (val: any): any => {
        if (val === undefined) return null;
        if (val === null) return null;
        if (Array.isArray(val)) {
            return val.map(sanitizeForFirestore);
        }
        if (typeof val === 'object') {
            if (val.constructor && val.constructor.name !== 'Object' && val.constructor.name !== 'Array') {
                return val;
            }
            const cleaned: any = {};
            for (const key of Object.keys(val)) {
                if (val[key] !== undefined) {
                    cleaned[key] = sanitizeForFirestore(val[key]);
                }
            }
            return cleaned;
        }
        return val;
    };

    /** Uploads a base64 cover under the owning school's folder; returns the download URL or null. */
    const uploadCover = async (dataUrl: string): Promise<string | null> => {
        const coverPath = user ? buildStoryCoverPath(ownerSchoolId, user.uid) : null;
        if (!coverPath) return null;
        try {
            const { getStorage, ref: storageRef, uploadString, getDownloadURL } = await import('firebase/storage');
            const snapshot = await uploadString(storageRef(getStorage(), coverPath), dataUrl, 'data_url');
            return await getDownloadURL(snapshot.ref);
        } catch (storageErr) {
            console.error("Firebase Storage upload failed:", storageErr);
            return null;
        }
    };

    const handleSave = async () => { 
        if (!user || !story || !firestore) return; 
        if (!ownerSchoolId) {
            toast({
                title: "Can't save yet",
                description: "We couldn't work out which school this story belongs to. Please reload the page or contact your administrator.",
                variant: "destructive",
            });
            return;
        }

        let cleanStory = sanitizeForFirestore(story);
        let pendingDataUrl: string | null = null;

        // A base64 cover must not go into Firestore (1MB limit); upload it to Storage first.
        if (cleanStory.imageUrl && cleanStory.imageUrl.startsWith('data:')) {
            toast({ title: "Saving Story...", description: "Uploading cover illustration..." });
            const url = await uploadCover(cleanStory.imageUrl);
            if (url) {
                cleanStory.imageUrl = url;
            } else {
                pendingDataUrl = cleanStory.imageUrl;
                cleanStory.imageUrl = '';
            }
        }
        
        try {
            const ref = await addDoc(collection(firestore, 'junior_stories'), { 
                ...cleanStory, 
                ...juniorStamp(ownerSchoolId),
                topic, 
                wordCount: view.fullText.split(/\s+/).filter(Boolean).length || 0,
                createdAt: serverTimestamp(), 
                createdBy: user.uid 
            }); 
            setStory(null); 
            forceRefetch(); 
            if (pendingDataUrl) {
                setPendingCover({ docId: ref.id, dataUrl: pendingDataUrl, title: cleanStory.title || 'Your story' });
                toast({
                    title: "Story saved — picture missing",
                    description: "The story is in your library, but its cover picture was not stored. Use “Retry picture upload” — no credits are spent.",
                    variant: "destructive",
                });
            } else {
                setPendingCover(null);
                toast({ title: "Story Saved!", description: "Saved successfully to your library, with its picture." }); 
            }
        } catch (dbErr: any) {
            console.error("Firestore save failed:", dbErr);
            toast({ 
                title: "Save Failed", 
                description: dbErr.message || "Failed to save story to library.",
                variant: "destructive"
            });
        }
    };

    /** Re-tries only the picture upload for an already-saved story. Never calls an AI flow, so no credits. */
    const handleRetryCover = async () => {
        if (!pendingCover || !firestore) return;
        setRetryingCover(true);
        try {
            const url = await uploadCover(pendingCover.dataUrl);
            if (!url) {
                toast({ title: "Picture still not saved", description: "Please check your connection and try again. Your story is safe.", variant: "destructive" });
                return;
            }
            try {
                await updateDoc(doc(firestore, 'junior_stories', pendingCover.docId), { imageUrl: url });
            } catch (dbErr: any) {
                console.error("Cover link update failed:", dbErr);
                toast({ title: "Picture uploaded but not linked", description: dbErr.message || "Please try again.", variant: "destructive" });
                return;
            }
            setPendingCover(null);
            forceRefetch();
            toast({ title: "Picture added!", description: "The story now has its cover illustration." });
        } finally {
            setRetryingCover(false);
        }
    };

    const handleDelete = async (id: string) => { 
        if (!firestore) return;
        if (confirm("Delete story?")) { 
            if (!(await removeJuniorDoc(firestore, 'junior_stories', id))) return; 
            forceRefetch(); 
        } 
    };

    const speakText = (text: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        
        const char = voiceCharacters.find(c => c.id === selectedCharId) || voiceCharacters[0];
        u.pitch = char.pitch;
        u.rate = char.rate;

        const voice = voices.find(v => v.name === selectedVoiceName);
        if (voice) {
            u.voice = voice;
        }

        window.speechSynthesis.speak(u);
    };

    const handleToggleSpeech = () => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setSpokenCharIndex(-1);
        } else {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(activeText);

            const char = voiceCharacters.find(c => c.id === selectedCharId) || voiceCharacters[0];
            u.pitch = char.pitch;
            u.rate = char.rate;

            const voice = voices.find(v => v.name === selectedVoiceName);
            if (voice) {
                u.voice = voice;
            }

            u.onstart = () => {
                setIsSpeaking(true);
            };
            u.onend = () => {
                setIsSpeaking(false);
                setSpokenCharIndex(-1);
            };
            u.onerror = () => {
                setIsSpeaking(false);
                setSpokenCharIndex(-1);
            };
            u.onboundary = (event) => {
                if (event.name === 'word') {
                    setSpokenCharIndex(event.charIndex);
                }
            };

            window.speechSynthesis.speak(u);
            setIsSpeaking(true);
        }
    };

    const handleCheckAnswer = () => {
        // Check against the current question in the questions array
        const currentQ = view.questions[currentQuestionIndex];
        if (!userAnswer.trim() || !currentQ) return;
        const correct = currentQ.answer.toLowerCase().trim().includes(userAnswer.toLowerCase().trim());
        
        setIsAnswerCorrect(correct);
        setIsAnswerSubmitted(true);
        if (correct) {
            setScore(s => s + 1);
            confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
            speakText("Correct! Well done!");
        } else {
            speakText("Not quite, but good try!");
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setUserAnswer('');
            setIsAnswerSubmitted(false);
        } else {
            setQuizFinished(true);
            if (score === totalQuestions) {
                speakText("Sensational job! You got a perfect score! You are a superstar reader!");
                confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
            } else if (score / totalQuestions >= 0.6) {
                speakText(`Fantastic effort! You got ${score} out of ${totalQuestions} correct! You are a star reader!`);
            } else {
                speakText("Great try! Keep practicing to become a star reader!");
            }
        }
    };

    const handleSelectStory = (s: any) => {
        setStory(s);
        setCurrentPageIndex(0);
        speakText(s.title);
        resetQuiz();
    };

    const handleWordClick = async (w: any) => {
        if (typeof window === 'undefined') return;
        
        const cleanWord = w.word.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
        if (!cleanWord) return;

        if (explorerMode === 'explore') {
            window.speechSynthesis.cancel();
            speakText(cleanWord);
            
            setExploredWord({ word: cleanWord });
            setIsExplorerOpen(true);
            setExplorerLoading(true);
            
            try {
                const detailRes = await generateWordDetails({ word: cleanWord, schoolId: ownerSchoolId || '' });
                if (detailRes.success && detailRes.data) {
                    setExploredWord(detailRes.data);
                } else {
                    toast({ title: "Oops!", description: "Could not load word details." });
                    setIsExplorerOpen(false);
                }
            } catch (err) {
                console.error("Word exploration failed:", err);
                setIsExplorerOpen(false);
            } finally {
                setExplorerLoading(false);
            }
        } else {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
                const remainingText = activeText.slice(w.start);
                const u = new SpeechSynthesisUtterance(remainingText);
                const char = voiceCharacters.find(c => c.id === selectedCharId) || voiceCharacters[0];
                u.pitch = char.pitch;
                u.rate = char.rate;
                const voice = voices.find(v => v.name === selectedVoiceName);
                if (voice) u.voice = voice;
                u.onstart = () => setIsSpeaking(true);
                u.onend = () => { setIsSpeaking(false); setSpokenCharIndex(-1); };
                u.onerror = () => { setIsSpeaking(false); setSpokenCharIndex(-1); };
                u.onboundary = (event) => {
                    if (event.name === 'word') {
                        setSpokenCharIndex(w.start + event.charIndex);
                    }
                };
                window.speechSynthesis.speak(u);
                setIsSpeaking(true);
            }
        }
    };

    // Calculate actual word count of generated story
    const actualWordCount = view.fullText.split(/\s+/).filter(Boolean).length || 0;

    return (
        <div className="space-y-8">
            {canEdit && (
                <div className="bg-white p-6 rounded-3xl shadow-lg border-4 border-purple-200">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <h3 className="text-xl font-black text-purple-855 flex items-center gap-2"><Wand2 /> Story Lab</h3>
                        <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-black border border-purple-250/50 flex items-center gap-1.5 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-purple-500 animate-pulse" /> Costs {STORY_CREDIT_COST} Credits
                        </span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-3">
                            <Input 
                                value={topic} 
                                onChange={e => setTopic(e.target.value)} 
                                placeholder="What is the story about? (e.g. A dragon who loves cupcakes)" 
                                className="text-lg h-12 rounded-xl flex-1 border-2 border-purple-100 focus:border-purple-300 focus:ring-0 bg-white"
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
                        </div>
                        
                        {/* Optional Guidelines Context */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-purple-600 block pl-1 tracking-wider">Story Guidelines / Context (Optional)</label>
                            <Input 
                                value={context} 
                                onChange={e => setContext(e.target.value)} 
                                placeholder="E.g., include a character named Barnaby, teach a lesson about sharing, focus on the letter S" 
                                className="h-11 rounded-xl border-2 border-purple-100 focus:border-purple-300 focus:ring-0 text-sm bg-white"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={handleGenerate} disabled={loading || !topic} className="h-12 px-8 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md font-black">
                                {loading ? <Loader2 className="animate-spin"/> : "Create Story"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {pendingCover && (
                <div role="alert" data-testid="cover-pending" className="rounded-2xl border-2 border-amber-400 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <p className="flex-1 text-sm font-semibold text-amber-900">
                        “{pendingCover.title}” was saved, but its cover picture was not. Your story is safe in the library.
                    </p>
                    <Button onClick={handleRetryCover} disabled={retryingCover} className="bg-amber-500 hover:bg-amber-600 font-bold">
                        {retryingCover ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Retry picture upload
                    </Button>
                    <Button variant="ghost" onClick={() => setPendingCover(null)}>Dismiss</Button>
                </div>
            )}

            {story && (
                <Card className="border-4 border-b-[12px] border-yellow-300 bg-yellow-50 animate-in zoom-in-95 overflow-hidden shadow-2xl rounded-[40px]">
                    <CardHeader className="bg-yellow-300 py-4 flex flex-row justify-between items-center px-8 border-b-2 border-yellow-400/30">
                        <CardTitle className="text-2xl font-black text-yellow-900">{view.emojiIcon} {view.title}</CardTitle>
                        {isAdminOrDirector && (
                            <span className="bg-white/50 px-3 py-1 rounded-full text-xs font-bold text-yellow-800">
                                {actualWordCount} words
                            </span>
                        )}
                    </CardHeader>
                    {view.imageUrl && (
                        <div className="relative w-full h-[280px] border-b-4 border-yellow-300 overflow-hidden bg-yellow-100 flex items-center justify-center select-none">
                            <img
                                src={view.imageUrl}
                                alt={view.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-102" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>
                    )}
                    <CardContent className="p-8 space-y-8">
                        {/* Mode Toggle Switch */}
                        <div className="flex justify-center select-none">
                            <div className="bg-yellow-100/70 p-1.5 rounded-2xl border-2 border-yellow-250/50 flex gap-2 shadow-sm">
                                <button 
                                    onClick={() => setExplorerMode('read')}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                                        explorerMode === 'read'
                                            ? "bg-yellow-300 text-yellow-950 shadow-md scale-[1.02]"
                                            : "text-yellow-800 hover:bg-yellow-200/30"
                                    )}
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Read Along
                                </button>
                                <button 
                                    onClick={() => {
                                        setExplorerMode('explore');
                                        if (isSpeaking) {
                                            window.speechSynthesis.cancel();
                                            setIsSpeaking(false);
                                            setSpokenCharIndex(-1);
                                        }
                                    }}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                                        explorerMode === 'explore'
                                            ? "bg-purple-600 text-white shadow-md scale-[1.02]"
                                            : "text-purple-600 hover:bg-purple-100/40"
                                    )}
                                >
                                    <Search className="w-4 h-4" />
                                    Word Explorer
                                </button>
                            </div>
                        </div>

                        {/* THE STORY TEXT Styled like Lined Book Paper */}
                        <div className="relative bg-white rounded-3xl border-2 border-amber-200/70 p-8 pl-16 md:p-10 md:pl-20 shadow-inner overflow-hidden select-none" style={{ backgroundImage: 'linear-gradient(#fdfbf7 2px, transparent 2px)', backgroundSize: '100% 2.5rem', lineHeight: '2.5rem' }}>
                            <div className="absolute top-0 left-12 md:left-16 w-[2px] h-full bg-red-200"></div>
                            <div className="text-xl md:text-2xl leading-[2.5rem] text-slate-800 font-extrabold tracking-wide space-y-4">
                                {linesWithWordsAndOffsets.map((line: any, lineIdx: number) => (
                                    <div key={lineIdx} className="min-h-[2.5rem]">
                                        {line.words.length > 0 ? (
                                            line.words.map((w: any, wIdx: number) => {
                                                const isActive = isSpeaking && spokenCharIndex >= w.start && spokenCharIndex < w.end;
                                                return (
                                                    <span 
                                                        key={wIdx} 
                                                        className={cn(
                                                            "transition-all duration-150 inline-block px-1 rounded mr-1.5 cursor-pointer hover:bg-yellow-50",
                                                            isActive 
                                                                ? "story-word-active bg-yellow-300 text-yellow-950 font-black scale-110 shadow-md ring-2 ring-yellow-400" 
                                                                : "text-slate-800"
                                                        )}
                                                        onClick={() => handleWordClick(w)}
                                                    >
                                                        {w.word}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            <span>&nbsp;</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Audio Control Bar Panel */}
                        <div className="bg-yellow-100/50 p-5 rounded-3xl border-2 border-yellow-200/65 shadow-inner flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-3.5">
                                <Button 
                                    onClick={handleToggleSpeech} 
                                    className={cn(
                                        "h-14 px-6 rounded-2xl font-black shadow-md flex items-center justify-center gap-2 text-white transition-all",
                                        isSpeaking 
                                            ? "bg-amber-500 hover:bg-amber-600 scale-[1.02]" 
                                            : "bg-emerald-600 hover:bg-emerald-700"
                                    )}
                                >
                                    {isSpeaking ? (
                                        <>
                                            <Pause className="w-5 h-5 fill-current" />
                                            <span>Pause Reading</span>
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5 fill-current" />
                                            <span>Read Aloud</span>
                                        </>
                                    )}
                                </Button>
                                
                                {isSpeaking && (
                                    <Button 
                                        onClick={() => {
                                            if (typeof window !== 'undefined' && window.speechSynthesis) {
                                                window.speechSynthesis.cancel();
                                                setIsSpeaking(false);
                                                setSpokenCharIndex(-1);
                                            }
                                        }} 
                                        variant="destructive"
                                        className="h-14 px-5 rounded-2xl font-black shadow-md flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        <span>Stop</span>
                                    </Button>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 flex-1 justify-end">
                                {/* Voice Character Selector */}
                                <div className="min-w-[165px]">
                                    <span className="text-[10px] font-black uppercase text-yellow-805 block mb-1 pl-1">Voice Character</span>
                                    <Select value={selectedCharId} onValueChange={setSelectedCharId}>
                                        <SelectTrigger className="h-11 rounded-xl border border-yellow-250 bg-white font-bold text-xs text-slate-700 focus:ring-0">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border border-yellow-100">
                                            {voiceCharacters.map(char => (
                                                <SelectItem key={char.id} value={char.id} className="text-xs font-bold text-slate-750">
                                                    <span className="flex items-center gap-1.5">
                                                        <span>{char.icon}</span>
                                                        <span>{char.name}</span>
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Installed natural English system voices */}
                                {voices.length > 0 && (
                                    <div className="min-w-[210px] max-w-[260px]">
                                        <span className="text-[10px] font-black uppercase text-yellow-805 block mb-1 pl-1">System Voice (Natural feel)</span>
                                        <Select value={selectedVoiceName} onValueChange={setSelectedVoiceName}>
                                            <SelectTrigger className="h-11 rounded-xl border border-yellow-250 bg-white text-xs font-semibold text-slate-600 truncate focus:ring-0">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl max-h-[220px]">
                                                {voices.map(v => (
                                                    <SelectItem key={v.name} value={v.name} className="text-xs">
                                                        {v.name.replace('Microsoft', '').replace('Desktop', '').trim()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {canEdit && (
                            <div className="flex gap-4">
                                <Button onClick={handleSave} className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700 font-bold rounded-2xl shadow-sm">
                                    <Save className="mr-2" /> Save to Library
                                </Button>
                            </div>
                        )}

                        {/* QUESTION CHALLENGE AREA — only when the story has questions */}
                        {totalQuestions > 0 && (
                        <div className="bg-purple-50/40 p-6 md:p-8 rounded-[36px] border-4 border-purple-200 shadow-inner">
                            {!quizFinished ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-black uppercase tracking-widest text-purple-400">
                                            Question {currentQuestionIndex + 1} of {totalQuestions}
                                        </span>
                                        <div className="flex gap-1.5">
                                            {Array.from({ length: totalQuestions }, (_, i) => i).map(i => (
                                                <div key={i} className={`h-2.5 w-8 rounded-full transition-all duration-300 ${i === currentQuestionIndex ? 'bg-purple-500 w-12' : i < currentQuestionIndex ? 'bg-green-400' : 'bg-slate-200'}`} />
                                            ))}
                                        </div>
                                    </div>

                                    <h4 className="text-2xl font-black text-purple-900 leading-tight">
                                        {view.questions[currentQuestionIndex]?.question || "Look at the story and answer..."}
                                    </h4>

                                    {!isAnswerSubmitted ? (
                                        <div className="flex gap-2">
                                            <Input 
                                                placeholder="Type your answer here..." 
                                                value={userAnswer}
                                                onChange={(e) => setUserAnswer(e.target.value)}
                                                className="text-lg h-14 border-2 border-purple-100 focus:border-purple-400 focus:ring-0 rounded-2xl flex-1 bg-white"
                                                onKeyDown={(e) => e.key === 'Enter' && handleCheckAnswer()}
                                            />
                                            <Button onClick={handleCheckAnswer} disabled={!userAnswer.trim()} className="bg-purple-600 hover:bg-purple-750 text-white h-14 px-8 rounded-2xl font-black shadow-md">Check</Button>
                                        </div>
                                    ) : (
                                        <div className="animate-in slide-in-from-bottom-2 space-y-4">
                                            <div className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${isAnswerCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                                {isAnswerCorrect ? <CheckCircle2 className="w-6 h-6 mt-1 text-green-650" /> : <XCircle className="w-6 h-6 mt-1 text-red-505" />}
                                                <div>
                                                    <p className="font-black text-lg">{isAnswerCorrect ? "Great Thinking! 🌟" : "Not Quite... 🤔"}</p>
                                                    <p className="text-sm font-bold opacity-90 mt-1">The correct answer is: <span className="font-black underline">{view.questions[currentQuestionIndex]?.answer}</span></p>
                                                </div>
                                            </div>
                                            <Button onClick={handleNextQuestion} className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-2">
                                                {currentQuestionIndex < totalQuestions - 1 ? "Next Question" : "See Final Score"} <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4 space-y-6 animate-in zoom-in">
                                    <div className="flex justify-center gap-3">
                                        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((starIndex) => {
                                            const isActive = score >= starIndex;
                                            return (
                                                <Star 
                                                    key={starIndex}
                                                    className={cn(
                                                        "w-12 h-12 transition-all duration-700",
                                                        isActive 
                                                            ? "fill-yellow-450 text-yellow-550 scale-110 drop-shadow-md animate-bounce" 
                                                            : "text-slate-200 fill-slate-100"
                                                    )}
                                                    style={{ animationDelay: `${(starIndex - 1) * 200}ms` }}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black text-purple-900 animate-pulse">Quiz Complete!</h3>
                                        <p className="text-xl font-black text-purple-600">You got {score} out of {totalQuestions} correct!</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-4">
                                        {score === totalQuestions ? (
                                            <div className="inline-block bg-yellow-100 border-2 border-yellow-300 text-yellow-800 text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-sm select-none">
                                                🏆 Superstar Reader
                                            </div>
                                        ) : score / totalQuestions >= 0.6 ? (
                                            <div className="inline-block bg-slate-100 border-2 border-slate-300 text-slate-700 text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-sm select-none">
                                                ⭐ Star Reader
                                            </div>
                                        ) : (
                                            <div className="inline-block bg-blue-50 border-2 border-blue-200 text-blue-700 text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-sm select-none">
                                                🚀 Junior Explorer
                                            </div>
                                        )}
                                        <Button onClick={resetQuiz} variant="ghost" className="text-purple-400 hover:text-purple-650 font-extrabold text-sm uppercase tracking-wider">Try Quiz Again</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* WORD EXPLORER DIALOG */}
            <Dialog open={isExplorerOpen} onOpenChange={setIsExplorerOpen}>
                <DialogContent className="sm:max-w-md rounded-3xl border-4 border-purple-200 bg-purple-50 overflow-hidden shadow-2xl p-0">
                    <DialogHeader className="bg-purple-600 p-6 text-white text-center flex flex-col items-center">
                        <DialogTitle className="text-xl font-black tracking-wider flex items-center gap-2">
                            <Search className="w-5 h-5" /> Word Explorer
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="p-8 flex flex-col items-center text-center space-y-6">
                        {explorerLoading ? (
                            <div className="space-y-4 py-8 flex flex-col items-center">
                                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                                <p className="text-sm font-black text-purple-800 animate-pulse uppercase tracking-wider">
                                    Asking the Word Wizard... 🧙‍♂️
                                </p>
                            </div>
                        ) : exploredWord ? (
                            <div className="space-y-5 w-full">
                                <div className="text-7xl bg-white p-6 rounded-full shadow-inner border-2 border-purple-100 inline-block select-none animate-bounce">
                                    {exploredWord.emoji || "✨"}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-purple-950 capitalize flex items-center justify-center gap-2.5">
                                        {exploredWord.word}
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="h-8 w-8 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 shadow-sm"
                                            onClick={() => speakText(exploredWord.word)}
                                        >
                                            <Volume2 className="h-4 w-4 fill-current" />
                                        </Button>
                                    </h3>
                                    {exploredWord.phonetic && (
                                        <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3.5 py-1 rounded-full font-extrabold border border-purple-200">
                                            {exploredWord.phonetic}
                                        </span>
                                    )}
                                </div>
                                
                                {exploredWord.meaning && (
                                    <div className="bg-purple-150/40 p-4.5 rounded-2xl border border-purple-200 shadow-inner text-left select-none">
                                        <span className="text-[9px] uppercase tracking-widest font-black text-purple-500 block mb-1">What it means</span>
                                        <p className="text-purple-900 font-extrabold text-sm leading-relaxed">
                                            {exploredWord.meaning}
                                        </p>
                                    </div>
                                )}
                                
                                {exploredWord.sentence && (
                                    <div className="bg-white p-5 rounded-2xl border-2 border-purple-150 shadow-sm relative text-left select-none">
                                        <span className="absolute -top-3 left-6 bg-purple-200 text-purple-800 text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-md">Example Sentence</span>
                                        <p className="text-slate-700 font-extrabold text-sm leading-relaxed mt-1 italic">
                                            "{exploredWord.sentence}"
                                        </p>
                                    </div>
                                )}
                                
                                <Button 
                                    onClick={() => setIsExplorerOpen(false)}
                                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-md uppercase tracking-wider text-xs border-0"
                                >
                                    Awesome!
                                </Button>
                            </div>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>

            {/* LIBRARY SECTION */}
            <div>
                <h3 className="text-2xl font-black text-slate-700 mb-6 flex items-center gap-2">
                    <BookOpen className="text-purple-500" /> Story Library
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedStories?.map((s:any) => (
                        <Card key={s.id} className="cursor-pointer border-2 border-b-[10px] border-purple-200 hover:border-purple-400 hover:-translate-y-1 transition-all relative group rounded-3xl overflow-hidden bg-white shadow-md">
                            {/* Colorful spine spine strip */}
                            <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-b from-purple-500 to-indigo-400 z-10"></div>
                            
                            {s.imageUrl && (
                                <div className="w-full h-32 overflow-hidden border-b border-slate-100 pl-3 select-none">
                                    <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                </div>
                            )}
                            
                            <CardContent className="p-5 pl-8 flex items-center gap-4" onClick={() => handleSelectStory(s)}>
                                {!s.imageUrl && (
                                    <div className="text-5xl bg-slate-50 p-2.5 rounded-2xl shadow-inner border border-slate-100">{s.emojiIcon}</div>
                                )}
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-black text-lg text-slate-800 truncate flex items-center gap-1.5">
                                        {s.imageUrl && <span className="text-xl">{s.emojiIcon}</span>}
                                        <span className="truncate">{s.title}</span>
                                    </h4>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                        <span>{s.wordCount || '?'} Words</span>
                                        <span>•</span>
                                        <span className="text-purple-500 font-black">{s.topic || 'General'}</span>
                                    </div>
                                </div>
                            </CardContent>
                            {canEdit && (
                                <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-350 hover:text-red-500 hover:bg-red-50 rounded-full" onClick={(e) => { e.stopPropagation(); handleDelete(s.id); }}>
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
