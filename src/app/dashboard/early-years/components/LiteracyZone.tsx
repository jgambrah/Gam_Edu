
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
import { generateJuniorStory, generateJuniorScience, generateWordDetails, generatePhonicsChallenge, generateLessonImageAction as generateLessonImage, generateTTSAction, generateRhymingWords, generateBlendsExample } from '@/ai/flows/junior-actions';
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
import { playRawPcm } from '../services/audio';

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


export default LiteracyZone;
