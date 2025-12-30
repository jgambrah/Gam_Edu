
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where, increment, getDocs, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, Trophy, Gift, Check, CheckCircle2, XCircle, Type, PlusCircle, PenSquare, FileText, Search, AlertTriangle, ShieldCheck, Activity, BrainCircuit, MessageSquare, Clapperboard, Users, Lightbulb, Microscope, Sparkles, Database, PenTool, Eraser
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
    generateTTSAction, 
    generateArtDetailsAction, 
    generateNumeracyTask,
    generateDictionDetails,
    generateStorytellingScene,
    generateThemedVocab,
    generateMissingLetterChallenge,
    generateSentence,
    generateRhymingWords,
    generateBlendsExample,
    generateJuniorStory, 
    generateJuniorScience, 
    generateWordDetails, 
    generatePhonicsChallenge 
} from '@/app/dashboard/early-years/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAuth } from 'firebase/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { PHONICS_DATA, INITIAL_WORDS, VOWELS_CONSONANTS, DICTION_DATA, READING_DATA, SENTENCE_DATA, HIDDEN_WORDS_DATA, GRAMMAR_DATA, OPPOSITES_DATA, BLENDS_DATA, RHYMES_DATA, MISSING_LETTERS_DATA, STORYTELLING_DATA, THEME_VOCAB_DATA } from '../constants';

// --- HELPER: TEXT TO SPEECH ---
const speak = async (text: string, rate = 0.9) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Simulate audio generation and playback
    console.log(`Speaking: ${text}`);
};


type LiteracyTab = 'alphabet' | 'blends' | 'rhymes' | 'words' | 'missing-letters' | 'building' | 'grammar' | 'reading' | 'sentences' | 'hidden-words' | 'opposites' | 'storytelling' | 'themes' | 'diction' | 'writing' | 'songs';

const LiteracyZone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LiteracyTab>('alphabet');

  const tabIcons: Record<LiteracyTab, string> = {
    alphabet: 'fa-font',
    blends: 'fa-layer-group',
    rhymes: 'fa-repeat',
    words: 'fa-book-open',
    'missing-letters': 'fa-underline',
    building: 'fa-hammer',
    grammar: 'fa-spell-check',
    reading: 'fa-book-reader',
    sentences: 'fa-list-ol',
    'hidden-words': 'fa-magnifying-glass',
    opposites: 'fa-arrows-left-right',
    storytelling: 'fa-comment-dots',
    themes: 'fa-tags',
    diction: 'fa-mouth',
    writing: 'fa-pen-nib',
    songs: 'fa-music',
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
          {(['alphabet', 'blends', 'rhymes', 'words', 'missing-letters', 'building', 'grammar', 'reading', 'sentences', 'hidden-words', 'opposites', 'storytelling', 'themes', 'diction', 'writing', 'songs'] as LiteracyTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`min-w-[100px] px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${
                activeTab === tab ? `${tabColors[tab]} text-white shadow-xl scale-110 -translate-y-1` : 'text-gray-300 hover:bg-gray-50'
              }`}
            >
              <i className={`fas ${tabIcons[tab]} text-lg`}></i>
              <span>{tab.replace('-', ' ')}</span>
            </button>
          ))}
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

/* --- ALPHABET MODULE --- */
const AlphabetModule: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentItem = PHONICS_DATA[currentIndex];
    
    const playSound = () => speak(`Big ${currentItem.upper}, little ${currentItem.lower}. ${currentItem.upper} is for ${currentItem.word}.`);
    
    return (
        <div className="max-w-2xl mx-auto p-12 bg-white rounded-[4rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center relative overflow-hidden animate-in zoom-in duration-500">
            <div className="flex gap-8 items-end mb-12">
                <div className="text-center"><p className="text-xs font-black text-pink-300 uppercase mb-2">Upper</p><h2 className="text-9xl font-black text-pink-500 drop-shadow-lg">{currentItem.upper}</h2></div>
                <div className="text-center"><p className="text-xs font-black text-pink-300 uppercase mb-2">Lower</p><h2 className="text-7xl font-black text-pink-400 drop-shadow-md">{currentItem.lower}</h2></div>
            </div>
            <div className="w-72 h-72 bg-pink-50 rounded-[3rem] overflow-hidden shadow-inner flex items-center justify-center relative mb-12 border-4 border-white group cursor-pointer" onClick={playSound}>
                <p className="text-6xl">{currentItem.word}</p>
            </div>
            <div className="flex gap-6 items-center">
                <button onClick={() => setCurrentIndex(p => (p === 0 ? PHONICS_DATA.length - 1 : p - 1))} className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center hover:bg-pink-100 shadow-md active:scale-90"><i className="fas fa-chevron-left text-2xl"></i></button>
                <button onClick={playSound} className="w-24 h-24 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xl border-4 border-white active:scale-95 transition-all"><i className="fas fa-volume-high text-4xl"></i></button>
                <button onClick={() => setCurrentIndex(p => (p + 1) % PHONICS_DATA.length)} className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center hover:bg-pink-100 shadow-md active:scale-90"><i className="fas fa-chevron-right text-2xl"></i></button>
            </div>
        </div>
    );
};

/* --- BLENDS & DIGRAPHS MODULE --- */
const BlendsModule: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const current = BLENDS_DATA[index];
    const currentWord = current.words[wordIndex];

    const playSound = () => speak(`Let's learn the sound... ${current.blend.toUpperCase()}! ${current.blend} is for ${currentWord.word}.`);

    return (
        <div className="max-w-4xl mx-auto p-12 bg-white rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center animate-in slide-in-from-bottom duration-500">
            <h3 className="text-4xl font-black text-orange-600 mb-4 uppercase tracking-tighter">Phonemic Blends! ✨</h3>
            <div className="flex gap-4 mb-8 flex-wrap justify-center">
                {BLENDS_DATA.map((b, i) => (<button key={i} onClick={() => { setIndex(i); setWordIndex(0); }} className={`px-6 py-2 rounded-xl font-black text-xl uppercase transition-all ${index === i ? 'bg-orange-500 text-white scale-110 shadow-lg' : 'bg-orange-50 text-orange-300'}`}>{b.blend}</button>))}
            </div>
            <div className="text-center mb-8"><h4 className="text-6xl font-black text-orange-500 mb-2 uppercase tracking-tighter">{currentWord.word}</h4><p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Features the {current.blend.toUpperCase()} {current.type}</p></div>
            <div onClick={playSound} className="relative w-80 h-80 bg-orange-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
                <p className="text-5xl">{currentWord.word}</p>
            </div>
            <div className="flex items-center gap-8">
                <button onClick={() => setWordIndex(i => (i === 0 ? current.words.length - 1 : i - 1))} className="w-14 h-14 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200"><i className="fas fa-chevron-left fa-xl"></i></button>
                <button onClick={playSound} className="px-10 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl">LISTEN SOUND</button>
                <button onClick={() => setWordIndex(i => (i + 1) % current.words.length)} className="w-14 h-14 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200"><i className="fas fa-chevron-right fa-xl"></i></button>
            </div>
        </div>
    );
};

/* --- RHYMES MODULE --- */
const RhymesModule: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const current = RHYMES_DATA[index];
    const currentWord = current.words[wordIndex];

    const playSound = () => speak(`${currentWord.word} rhymes with ${current.words.find(w => w.word !== currentWord.word)?.word || 'it'}. They both end with ${current.ending}!`);

    return (
        <div className="max-w-4xl mx-auto p-12 bg-white rounded-[4rem] shadow-2xl border-8 border-cyan-100 flex flex-col items-center animate-in slide-in-from-bottom duration-500">
            <h3 className="text-4xl font-black text-cyan-600 mb-4 uppercase tracking-tighter">Rhyme Fun! 🔄</h3>
            <div className="flex gap-4 mb-8 flex-wrap justify-center">
                {RHYMES_DATA.map((r, i) => (<button key={i} onClick={() => { setIndex(i); setWordIndex(0); }} className={`px-6 py-2 rounded-xl font-black text-xl uppercase transition-all ${index === i ? 'bg-cyan-500 text-white scale-110 shadow-lg' : 'bg-cyan-50 text-cyan-300'}`}>-{r.ending}</button>))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
                <div className="flex flex-col items-center">
                    <div onClick={playSound} className="relative w-64 h-64 bg-cyan-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-6 overflow-hidden cursor-pointer group">
                        <p className="text-5xl">{currentWord.word}</p>
                    </div>
                    <h4 className="text-5xl font-black text-cyan-600 uppercase tracking-tighter">{currentWord.word}</h4>
                </div>
                <div className="space-y-6">
                    <p className="text-2xl font-bold text-gray-400 italic">"Listen! What rhymes with <span className="text-cyan-500">{currentWord.word}</span>?"</p>
                    <div className="grid grid-cols-1 gap-3">
                        {current.words.map((w, i) => (
                            <button key={i} onClick={() => setWordIndex(i)} className={`py-4 px-6 rounded-2xl font-black text-xl border-4 transition-all ${wordIndex === i ? 'bg-cyan-500 text-white border-white shadow-xl translate-x-2' : 'bg-white border-cyan-50 text-cyan-300'}`}>{w.word}</button>
                        ))}
                    </div>
                    <button onClick={playSound} className="w-full py-4 bg-cyan-600 text-white font-black rounded-2xl shadow-xl">CHECK RHYME</button>
                </div>
            </div>
            <div className="flex gap-4 mt-12"><button onClick={() => setIndex(i => (i === 0 ? RHYMES_DATA.length - 1 : i - 1))} className="w-14 h-14 bg-cyan-100 text-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-200"><i className="fas fa-arrow-left fa-xl"></i></button><button onClick={() => setIndex(i => (i + 1) % RHYMES_DATA.length)} className="w-14 h-14 bg-cyan-100 text-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-200"><i className="fas fa-arrow-right fa-xl"></i></button></div>
        </div>
    );
};

// --- DUMMY COMPONENTS FOR OTHER TABS ---
const WordFactoryModule: React.FC = () => <div>Word Factory Placeholder</div>;
const MissingLettersModule: React.FC = () => <div>Missing Letters Placeholder</div>;
const WordBuildingModule: React.FC = () => <div>Word Building Placeholder</div>;
const GrammarModule: React.FC = () => <div>Grammar Module Placeholder</div>;
const ReadingModule: React.FC = () => <div>Reading Module Placeholder</div>;
const SentencesModule: React.FC = () => <div>Sentences Module Placeholder</div>;
const HiddenWordsModule: React.FC = () => <div>Hidden Words Placeholder</div>;
const OppositesModule: React.FC = () => <div>Opposites Module Placeholder</div>;
const ThemeVocabModule: React.FC = () => <div>Theme Vocab Placeholder</div>;
const DictionModule: React.FC = () => <div>Diction Module Placeholder</div>;
const WritingModule: React.FC = () => <div>Writing Module Placeholder</div>;
const SongsModule: React.FC = () => <div>Songs Module Placeholder</div>;
const StorytellingModule: React.FC = () => <div>Storytelling Module Placeholder</div>;

export default LiteracyZone;
