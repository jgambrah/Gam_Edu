
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PHONICS_DATA, INITIAL_WORDS, VOWELS_CONSONANTS, DICTION_DATA, READING_DATA, SENTENCE_DATA, HIDDEN_WORDS_DATA, GRAMMAR_DATA, OPPOSITES_DATA, BLENDS_DATA, RHYMES_DATA, MISSING_LETTERS_DATA, STORYTELLING_DATA, THEME_VOCAB_DATA } from '../constants';
import { generateLessonImage } from '../services/gemini';
import { playRawPcm } from '../services/audio';
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
} from '@/ai/flows/junior-actions';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, Trophy, Gift, Check, CheckCircle2, XCircle, Type, PlusCircle, PenSquare, FileText, Search, AlertTriangle, ShieldCheck, Activity, BrainCircuit, MessageSquare, Clapperboard, Users, Lightbulb, Microscope, Sparkles, Database, PenTool, Eraser
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAuth } from 'firebase/auth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

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

/* --- STORYTELLING MODULE --- */
const StorytellingModule: React.FC = () => {
  const [data, setData] = useState(STORYTELLING_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const current = data[index];

  useEffect(() => { fetchVisual(); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImageAction(current.prompt); setImageUrl(url.data); setLoading(false); };
  
  const playQuestion = async (q: string) => { 
    const result = await generateTTSAction({text: q, voice: "Kore"}); 
    if(result.success && result.data) await playRawPcm(result.data) 
  };

  const generateWithAi = async () => {
    if (!aiTopic) return; setIsAiLoading(true);
    try {
      const result = await generateStorytellingScene(aiTopic);
      if(result.success && result.data) {
        setData(prev => [...prev, result.data!]);
        setIsTeacherDrawerOpen(false); setIndex(data.length); setAiTopic('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-blue-200 text-blue-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-magic"></i> AI Story Prompt</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-blue-100 flex flex-col items-center min-h-[600px] animate-in zoom-in duration-500">
        <h3 className="text-4xl font-black text-blue-600 mb-8 uppercase tracking-tighter text-center">Look & Tell a Story! 🗨️</h3>
        <div className="w-full max-w-2xl aspect-video bg-blue-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group" onClick={() => generateTTSAction({text: `Let's look at this picture of ${current.title}! What do you see?`, voice: "Kore"}).then(res => res.success && res.data && playRawPcm(res.data))}>
          {loading ? <div className="w-16 h-16 border-8 border-blue-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} alt={current.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />}
        </div>
        <div className="w-full space-y-4">
           <p className="text-xl font-bold text-gray-400 uppercase tracking-widest text-center">Guided Questions:</p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {current.questions.map((q, i) => (
                <button key={i} onClick={() => playQuestion(q)} className="p-6 bg-blue-50 border-4 border-white rounded-3xl text-blue-700 font-bold shadow-md hover:bg-blue-100 transition-all flex items-center gap-3">
                   <i className="fas fa-volume-high text-blue-300"></i>
                   <span className="text-sm">{q}</span>
                </button>
              ))}
           </div>
        </div>
        <div className="flex gap-4 mt-12"><button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} className="w-14 h-14 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-200"><i className="fas fa-arrow-left fa-xl"></i></button><button onClick={() => setIndex(i => (i + 1) % data.length)} className="w-14 h-14 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center hover:bg-blue-200"><i className="fas fa-arrow-right fa-xl"></i></button></div>
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-blue-50"><h3 className="text-3xl font-black text-blue-600 mb-6 flex items-center gap-3"><i className="fas fa-magic"></i> Story AI Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Scene Topic</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Under the Sea" className="w-full px-6 py-4 rounded-2xl border-2 border-blue-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-blue-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE SCENE'}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase font-bold text-[10px] tracking-widest">Close</button></div></div></div>}
    </div>
  );
};

/* --- DUMMY COMPONENTS FOR OTHER TABS --- */
const AlphabetModule: React.FC = () => <div>Alphabet Module Placeholder</div>;
const BlendsModule: React.FC = () => <div>Blends Module Placeholder</div>;
const RhymesModule: React.FC = () => <div>Rhymes Module Placeholder</div>;
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

export default LiteracyZone;
