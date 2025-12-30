
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PHONICS_DATA, VOCABULARY_DATA, BLENDS_DATA, RHYMES_DATA, MISSING_LETTERS_DATA, STORYTELLING_DATA, THEME_VOCAB_DATA, SENTENCE_DATA, HIDDEN_WORDS_DATA, OPPOSITES_DATA, GRAMMAR_DATA, READING_DATA } from '../constants';
import { playRawPcm } from '../services/audio';
import { z } from 'zod';
import { 
  generateTTSAction,
  generateWordDetails, 
  generateMissingLetterChallenge, 
  generateSentence, 
  generateRhymingWords, 
  generateStorytellingScene, 
  generateThemedVocab, 
  generateDictionDetails, 
  generateBlendsExample,
  generateLessonImageAction,
} from '@/ai/flows/junior-actions';

type LiteracyTab = 'alphabet' | 'blends' | 'rhymes' | 'words' | 'missing-letters' | 'building' | 'grammar' | 'reading' | 'sentences' | 'hidden-words' | 'opposites' | 'storytelling' | 'themes' | 'diction' | 'writing' | 'songs';

const playSound = async (text: string) => {
    if (!text) return;
    try {
        const result = await generateTTSAction({ text, voice: 'Kore' });
        if (result.success && result.data) {
            await playRawPcm(result.data);
        } else {
            console.error("TTS generation failed:", result.error);
        }
    } catch (e) {
        console.error("Audio playback error:", e);
    }
};

const AlphabetZone: React.FC = () => {
  const [phonicsList, setPhonicsList] = useState(PHONICS_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  // Admin / Teacher state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newLetter, setNewLetter] = useState('');
  const [newWord, setNewWord] = useState('');

  const currentItem = phonicsList[currentIndex];

  useEffect(() => {
    fetchImage();
  }, [currentIndex, phonicsList]);

  const fetchImage = async () => {
    setLoading(true);
    const url = await generateLessonImageAction(currentItem.imagePrompt);
    setImageUrl(url);
    setLoading(false);
  };

  const handleSound = async () => {
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch (e) {}
    }

    setPlaying(true);
    const result = await generateTTSAction({text: `The letter ${currentItem.upper} makes the sound ${currentItem.lower}... ${currentItem.lower}... ${currentItem.upper} is for ${currentItem.word}. Can you say ${currentItem.word}?`, voice: 'Kore'});
    if (result.success && result.data) {
      const source = await playRawPcm(result.data);
      if (source) {
        currentSourceRef.current = source;
        source.onended = () => {
          setPlaying(false);
          currentSourceRef.current = null;
        };
      } else {
        setPlaying(false);
      }
    } else {
      setPlaying(false);
    }
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLetter || !newWord) return;
    
    const newItem = {
      upper: newLetter.toUpperCase().substring(0, 1),
      lower: newLetter.toLowerCase().substring(0, 1),
      word: newWord.charAt(0).toUpperCase() + newWord.slice(1),
      imagePrompt: `A friendly cartoon ${newWord}, nursery style, bright colors, white background`
    };

    setPhonicsList(prev => [...prev, newItem]);
    setNewLetter('');
    setNewWord('');
    setIsAdminOpen(false);
    setCurrentIndex(phonicsList.length); 
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsAdminOpen(true)}
        className="absolute -top-12 right-0 bg-white border-2 border-pink-200 text-pink-400 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-pink-50 transition-colors flex items-center gap-2"
      >
        <i className="fas fa-chalkboard-user"></i> Teacher's Drawer
      </button>

      <div className="max-w-xl mx-auto p-6 bg-white rounded-[3rem] shadow-2xl border-8 border-pink-100 flex flex-col items-center">
        <div className="text-center mb-6">
          <h2 className="text-7xl font-bold text-pink-500 mb-2">{currentItem.upper}</h2>
          <p className="text-2xl text-gray-400 font-medium italic">for {currentItem.word}</p>
        </div>

        <div className="w-64 h-64 bg-gray-50 rounded-[2rem] overflow-hidden shadow-inner flex items-center justify-center relative mb-8 border-4 border-pink-50">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-pink-400 font-medium">Magic drawing...</p>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={currentItem.word} className="w-full h-full object-cover p-4" />
          ) : (
            <div className="text-gray-300 flex flex-col items-center">
               <i className="fas fa-image fa-4x mb-2"></i>
               <p className="text-xs">No image found</p>
            </div>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setCurrentIndex(prev => (prev === 0 ? phonicsList.length - 1 : prev - 1))}
            className="w-14 h-14 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center hover:bg-pink-200 transition-colors shadow-sm"
          >
            <i className="fas fa-chevron-left fa-lg"></i>
          </button>
          
          <button 
            onClick={handleSound}
            disabled={playing}
            className={`w-28 h-28 rounded-full ${playing ? 'bg-pink-300' : 'bg-pink-500'} text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-white`}
          >
            <i className={`fas ${playing ? 'fa-spinner fa-spin' : 'fa-volume-high'} fa-4x`}></i>
          </button>

          <button 
            onClick={() => setCurrentIndex(prev => (prev === phonicsList.length - 1 ? 0 : prev + 1))}
            className="w-14 h-14 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center hover:bg-pink-200 transition-colors shadow-sm"
          >
            <i className="fas fa-chevron-right fa-lg"></i>
          </button>
        </div>
        
        <p className="mt-8 text-gray-400 font-bold tracking-widest">CARD {currentIndex + 1} OF {phonicsList.length}</p>
      </div>

      {isAdminOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Add New Card</h3>
              <button onClick={() => setIsAdminOpen(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times fa-lg"></i>
              </button>
            </div>
            
            <form onSubmit={handleAddNew} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Letter</label>
                <input 
                  type="text" 
                  maxLength={1}
                  required
                  value={newLetter}
                  onChange={(e) => setNewLetter(e.target.value)}
                  placeholder="e.g. S"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-pink-300 focus:outline-none text-2xl font-bold uppercase text-center"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">Object/Word</label>
                <input 
                  type="text" 
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g. Star"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-pink-300 focus:outline-none text-xl font-medium"
                />
              </div>
              <p className="text-xs text-gray-400 italic">
                AI will automatically draw the picture and read the sound for your new card!
              </p>
              <button 
                type="submit"
                className="w-full py-4 bg-pink-500 text-white font-bold rounded-2xl shadow-lg hover:bg-pink-600 transition-all"
              >
                Magic Create Card ✨
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


const VocabularyWorld: React.FC = () => {
    const [vocabList, setVocabList] = useState(VOCABULARY_DATA);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [playing, setPlaying] = useState(false);
    const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
    
    // Admin / Teacher state
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [newWord, setNewWord] = useState('');
    const [newCategory, setNewCategory] = useState('General');
  
    const currentItem = vocabList[currentIndex];
  
    useEffect(() => {
      fetchImage();
    }, [currentIndex, vocabList]);
  
    const fetchImage = async () => {
      setLoading(true);
      const url = await generateLessonImageAction(currentItem.imagePrompt);
      setImageUrl(url);
      setLoading(false);
    };
  
    const handleSound = async () => {
      if (currentSourceRef.current) {
        try { currentSourceRef.current.stop(); } catch (e) {}
      }
  
      setPlaying(true);
      const result = await generateTTSAction({text: `${currentItem.word}. Can you say ${currentItem.word}?`, voice: 'Kore'});
      if (result.success && result.data) {
        const source = await playRawPcm(result.data);
        if (source) {
          currentSourceRef.current = source;
          source.onended = () => {
            setPlaying(false);
            currentSourceRef.current = null;
          };
        } else {
          setPlaying(false);
        }
      } else {
        setPlaying(false);
      }
    };
  
    const handleAddNew = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newWord) return;
      
      const newItem = {
        word: newWord.charAt(0).toUpperCase() + newWord.slice(1),
        category: newCategory,
        imagePrompt: `A cute friendly cartoon ${newWord}, nursery style, bright colors, white background`
      };
  
      setVocabList(prev => [...prev, newItem]);
      setNewWord('');
      setIsAdminOpen(false);
      setCurrentIndex(vocabList.length);
    };
  
    return (
      <div className="relative">
        <button 
          onClick={() => setIsAdminOpen(true)}
          className="absolute -top-12 right-0 bg-white border-2 border-green-200 text-green-500 px-4 py-2 rounded-full font-bold shadow-sm hover:bg-green-50 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-folder-plus"></i> Teacher's Drawer
        </button>
  
        <div className="max-w-xl mx-auto p-8 bg-white rounded-[3rem] shadow-2xl border-8 border-green-100 flex flex-col items-center">
          <div className="text-center mb-6">
            <span className="px-4 py-1 bg-green-50 text-green-600 rounded-full text-sm font-bold uppercase tracking-widest border border-green-100">
              {currentItem.category}
            </span>
            <h2 className="text-6xl font-extrabold text-green-500 mt-4 mb-2 lowercase">{currentItem.word}</h2>
          </div>
  
          <div className="w-72 h-72 bg-gray-50 rounded-[3rem] overflow-hidden shadow-inner flex items-center justify-center relative mb-8 border-4 border-green-50 group cursor-pointer" onClick={handleSound}>
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-green-500 font-bold animate-pulse">Drawing...</p>
              </div>
            ) : imageUrl ? (
              <>
                <img src={imageUrl} alt={currentItem.word} className="w-full h-full object-cover p-6 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <i className="fas fa-volume-high text-white text-5xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"></i>
                </div>
              </>
            ) : (
              <div className="text-gray-300 flex flex-col items-center">
                 <i className="fas fa-image fa-4x mb-2"></i>
                 <p className="text-xs">Finding image...</p>
              </div>
            )}
          </div>
  
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => setCurrentIndex(prev => (prev === 0 ? vocabList.length - 1 : prev - 1))}
              className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-100 transition-colors shadow-md border-2 border-white"
            >
              <i className="fas fa-arrow-left fa-xl"></i>
            </button>
            
            <button 
              onClick={handleSound}
              disabled={playing}
              className={`w-24 h-24 rounded-full ${playing ? 'bg-green-300' : 'bg-green-500'} text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-white`}
            >
              <i className={`fas ${playing ? 'fa-spinner fa-spin' : 'fa-volume-high'} fa-3x`}></i>
            </button>
  
            <button 
              onClick={() => setCurrentIndex(prev => (prev === vocabList.length - 1 ? 0 : prev + 1))}
              className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center hover:bg-green-100 transition-colors shadow-md border-2 border-white"
            >
              <i className="fas fa-arrow-right fa-xl"></i>
            </button>
          </div>
          
          <div className="mt-8 flex items-center gap-2">
            {vocabList.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-green-500' : 'w-2 bg-green-100'}`}
              ></div>
            ))}
          </div>
        </div>
  
        {/* Admin Modal */}
        {isAdminOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">Add New Word</h3>
                <button onClick={() => setIsAdminOpen(false)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleAddNew} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Word Name</label>
                  <input 
                    type="text" 
                    required
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="e.g. Robot, Apple, Sun"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-green-300 focus:outline-none text-xl font-bold placeholder:text-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-green-300 focus:outline-none text-lg font-medium bg-white"
                  >
                    <option>Nature</option>
                    <option>Home</option>
                    <option>Transport</option>
                    <option>Animals</option>
                    <option>General</option>
                  </select>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-100">
                  <p className="text-sm text-green-700 font-bold leading-relaxed flex gap-2">
                    <i className="fas fa-magic mt-1"></i>
                    Magic AI will draw a picture and teach the pronunciation automatically!
                  </p>
                </div>
                <button 
                  type="submit"
                  className="w-full py-5 bg-green-500 text-white font-black text-xl rounded-2xl shadow-xl hover:bg-green-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Create Word Card! 🚀
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
};

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
        {activeTab === 'alphabet' && <AlphabetZone />}
        {activeTab === 'words' && <VocabularyWorld />}
        {activeTab === 'blends' && <BlendsModule />}
        {activeTab === 'rhymes' && <RhymesModule />}
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

/* --- DUMMY COMPONENTS --- */
const BlendsModule: React.FC = () => <div>Blends Module</div>;
const RhymesModule: React.FC = () => <div>Rhymes Module</div>;
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

export default LiteracyZone;
