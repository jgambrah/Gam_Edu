
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PHONICS_DATA, INITIAL_WORDS, VOWELS_CONSONANTS, DICTION_DATA, READING_DATA, SENTENCE_DATA, HIDDEN_WORDS_DATA, GRAMMAR_DATA, OPPOSITES_DATA, BLENDS_DATA, RHYMES_DATA, MISSING_LETTERS_DATA, STORYTELLING_DATA, THEME_VOCAB_DATA } from '../constants';
import { generateLessonImage } from '../services/gemini';
import { playRawPcm } from '../services/audio';
import { z } from 'zod';
import { 
  generateWordDetails, 
  generateMissingLetterChallenge, 
  generateSentence, 
  generateRhymingWords, 
  generateStorytellingScene, 
  generateThemedVocab, 
  generateDictionDetails, 
  generateBlendsExample,
  generateTTSAction,
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

const PhonicsZone: React.FC = () => {
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
    const url = await generateLessonImage(currentItem.imagePrompt);
    setImageUrl(url);
    setLoading(false);
  };

  const playSound = async () => {
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch (e) {}
    }

    setPlaying(true);
    /* Fixed: Changed currentItem.letter to currentItem.upper to match PHONICS_DATA structure */
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
    
    /* Fixed: Changed object properties to include 'upper' and 'lower' to match PHONICS_DATA structure */
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
          {/* Fixed: Changed currentItem.letter to currentItem.upper */}
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
            onClick={playSound}
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
              key={tab.id}
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
        {activeTab === 'alphabet' && <PhonicsZone />}
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
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
  
  const playQuestion = async (q: string) => { await playSound(q); };

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
        <div className="w-full max-w-2xl aspect-video bg-blue-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group" onClick={async () => playSound(`Let's look at this picture of ${current.title}! What do you see?`)}>
          {loading ? <div className="w-16 h-16 border-8 border-blue-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 transition-transform group-hover:scale-105" alt={current.title} />}
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
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-blue-50"><h3 className="text-3xl font-black text-blue-600 mb-6 flex items-center gap-3"><i className="fas fa-wand-magic-sparkles"></i> Story AI Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Scene Topic</label><input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Under the Sea" className="w-full px-6 py-4 rounded-2xl border-2 border-blue-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTopic} className="w-full py-5 rounded-2xl font-black text-white bg-blue-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE SCENE'}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Close</button></div></div></div>}
    </div>
  );
};

/* --- THEME-BASED VOCAB MODULE --- */
const ThemeVocabModule: React.FC = () => {
  const [data, setData] = useState(THEME_VOCAB_DATA.seasons);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiTheme, setAiTheme] = useState('');
  const current = data[index];

  useEffect(() => { fetchVisual(); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };
  
  const playWord = async (word: string) => { await playSound(word); };

  const generateWithAi = async () => {
    if (!aiTheme) return; setIsAiLoading(true);
    try {
      const result = await generateThemedVocab(aiTheme);
      if(result.success && result.data){
        setData(prev => [...prev, result.data!]);
        setIsTeacherDrawerOpen(false); setIndex(data.length); setAiTheme('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-rose-200 text-rose-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-magic"></i> AI Theme</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-rose-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-bottom duration-500">
        <h3 className="text-4xl font-black text-rose-600 mb-8 uppercase tracking-tighter text-center">Themed World! 🌍</h3>
        <div className="flex gap-4 mb-10 overflow-x-auto no-scrollbar max-w-full pb-2">
           {data.map((t, i) => (<button key={i} onClick={() => setIndex(i)} className={`px-6 py-2 rounded-2xl font-black text-xl uppercase transition-all whitespace-nowrap ${index === i ? 'bg-rose-500 text-white scale-110 shadow-lg' : 'bg-rose-50 text-rose-300'}`}>{t.name}</button>))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
           <div onClick={async () => playSound(`This is ${current.name}! Let's learn some ${current.name} words.`)} className="relative w-full aspect-square bg-rose-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center overflow-hidden cursor-pointer group">
              {loading ? <div className="w-16 h-16 border-8 border-rose-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 transition-transform group-hover:scale-105" alt={current.name} />}
              <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/5 flex items-center justify-center"><i className="fas fa-volume-high text-white text-5xl opacity-0 group-hover:opacity-100 drop-shadow-lg"></i></div>
           </div>
           <div className="space-y-6">
              <h4 className="text-5xl font-black text-rose-600 uppercase tracking-tighter mb-4">{current.name}</h4>
              <div className="grid grid-cols-1 gap-4">
                 {current.words.map((word, i) => (
                    <button key={i} onClick={() => playWord(word)} className="py-5 px-8 bg-white border-4 border-rose-50 rounded-[2rem] text-3xl font-black text-rose-500 shadow-lg hover:border-rose-300 hover:scale-105 transition-all flex items-center justify-between">
                       <span>{word}</span>
                       <i className="fas fa-play-circle text-rose-200"></i>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-rose-50"><h3 className="text-3xl font-black text-rose-600 mb-6 flex items-center gap-3"><i className="fas fa-wand-magic-sparkles"></i> Theme AI Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Theme Name</label><input type="text" value={aiTheme} onChange={(e) => setAiTheme(e.target.value)} placeholder="e.g. In the Garden" className="w-full px-6 py-4 rounded-2xl border-2 border-rose-100 focus:border-rose-500 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiTheme} className="w-full py-5 rounded-2xl font-black text-white bg-rose-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE THEME'}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Close</button></div></div></div>}
    </div>
  );
};

/* --- MISSING LETTERS MODULE --- */
const MissingLettersModule: React.FC = () => {
  const [data, setData] = useState(MISSING_LETTERS_DATA);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiWord, setAiWord] = useState('');
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const current = data[index];

  useEffect(() => { fetchVisual(); setAnswered(false); setSelectedOption(null); }, [index, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(current.prompt); setImageUrl(url); setLoading(false); };

  const handleChoice = async (opt: string) => {
    setSelectedOption(opt);
    if (opt === current.missing) {
      setAnswered(true);
      await playSound(`Yes! The missing letter is ${opt}! You spelled ${current.word}!`);
    } else {
      await playSound(`Try again! That sound is different.`);
    }
  };

  const generateWithAi = async () => {
    if (!aiWord) return; setIsAiLoading(true);
    try {
      const result = await generateMissingLetterChallenge(aiWord);
      if(result.success && result.data) {
        setData(prev => [...prev, result.data!]);
        setIsTeacherDrawerOpen(false); setIndex(data.length); setAiWord('');
      }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-emerald-200 text-emerald-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-magic"></i> AI Challenge</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-emerald-100 flex flex-col items-center min-h-[600px] animate-in zoom-in duration-500">
        <h3 className="text-4xl font-black text-emerald-600 mb-8 uppercase tracking-tighter">Complete the Word! 🧩</h3>
        <div className="flex gap-4 mb-12">
          {current.word.split('').map((char, i) => (
            <div key={i} className={`w-20 h-28 md:w-28 md:h-40 rounded-3xl flex items-center justify-center border-8 transition-all text-6xl font-black ${char === current.missing ? (answered ? 'bg-emerald-500 text-white border-white scale-110 shadow-xl' : 'bg-emerald-50 border-emerald-100 text-emerald-200 border-dashed animate-pulse') : 'bg-white border-emerald-50 text-emerald-600 shadow-md'}`}>
              {char === current.missing ? (answered ? char : '?') : char}
            </div>
          ))}
        </div>
        <div className="w-64 h-64 bg-emerald-50 rounded-[3rem] border-8 border-white shadow-inner mb-10 overflow-hidden">
           {loading ? <div className="absolute inset-0 flex items-center justify-center"><i className="fas fa-magic text-emerald-300 text-4xl"></i></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6" alt={current.word} />}
        </div>
        {!answered ? (
          <div className="flex gap-6">
            {current.options.map((opt, i) => (
              <button key={i} onClick={() => handleChoice(opt)} className="w-20 h-20 md:w-24 md:h-24 bg-white border-4 border-emerald-100 rounded-3xl text-4xl font-black text-emerald-500 shadow-lg hover:scale-110 active:scale-95 transition-all">{opt}</button>
            ))}
          </div>
        ) : (
          <button onClick={() => setIndex(i => (i + 1) % data.length)} className="px-12 py-5 bg-emerald-500 text-white font-black rounded-3xl shadow-xl animate-bounce uppercase tracking-widest">Next Challenge! 🚀</button>
        )}
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-emerald-50"><h3 className="text-3xl font-black text-emerald-600 mb-6 flex items-center gap-3"><i className="fas fa-magic"></i> AI Word Challenge</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Target Word</label><input type="text" value={aiWord} onChange={(e) => setAiWord(e.target.value)} placeholder="e.g. BALL" className="w-full px-6 py-4 rounded-2xl border-2 border-emerald-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiWord} className="w-full py-5 rounded-2xl font-black text-white bg-emerald-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE CHALLENGE'}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Close</button></div></div></div>}
    </div>
  );
};

/* --- BLENDS & DIGRAPHS MODULE --- */
const BlendsModule: React.FC = () => {
  const [data, setData] = useState(BLENDS_DATA);
  const [index, setIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiBlend, setAiBlend] = useState('');

  const current = data[index];
  const currentWord = current.words[wordIndex];

  useEffect(() => { fetchVisual(); }, [index, wordIndex, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(currentWord.prompt); setImageUrl(url); setLoading(false); };
  const handleSound = async () => { await playSound(`Let's learn the sound... ${current.blend.toUpperCase()}! ${current.blend} is for ${currentWord.word}.`); };

  const generateWithAi = async () => {
    if (!aiBlend) return; setIsAiLoading(true);
    try {
        const result = await generateBlendsExample(aiBlend);
        if(result.success && result.data) {
            setData(prev => [...prev, result.data!]);
            setIsTeacherDrawerOpen(false); setIndex(data.length); setWordIndex(0); setAiBlend('');
        }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-orange-200 text-orange-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-magic"></i> AI Blend</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-orange-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-bottom duration-500">
        <h3 className="text-4xl font-black text-orange-600 mb-4 uppercase tracking-tighter">Phonemic Blends! ✨</h3>
        <div className="flex gap-4 mb-8 flex-wrap justify-center">
          {data.map((b, i) => (<button key={i} onClick={() => { setIndex(i); setWordIndex(0); }} className={`px-6 py-2 rounded-xl font-black text-xl uppercase transition-all ${index === i ? 'bg-orange-500 text-white scale-110 shadow-lg' : 'bg-orange-50 text-orange-300'}`}>{b.blend}</button>))}
        </div>
        <div className="text-center mb-8"><h4 className="text-6xl font-black text-orange-500 mb-2 uppercase tracking-tighter">{currentWord.word}</h4><p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Features the {current.blend.toUpperCase()} {current.type}</p></div>
        <div onClick={handleSound} className="relative w-80 h-80 bg-orange-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-10 overflow-hidden cursor-pointer group">
          {loading ? <div className="w-16 h-16 border-8 border-orange-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 drop-shadow-xl transition-transform group-hover:scale-105" alt={currentWord.word} />}
          <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors flex items-center justify-center"><i className="fas fa-volume-high text-white text-5xl opacity-0 group-hover:opacity-100 drop-shadow-lg"></i></div>
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => setWordIndex(i => (i === 0 ? current.words.length - 1 : i - 1))} className="w-14 h-14 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200 shadow-md active:scale-90"><i className="fas fa-chevron-left fa-xl"></i></button>
          <button onClick={handleSound} className="px-10 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-xl">LISTEN SOUND</button>
          <button onClick={() => setWordIndex(i => (i + 1) % current.words.length)} className="w-14 h-14 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center hover:bg-orange-200 shadow-md active:scale-90"><i className="fas fa-chevron-right fa-xl"></i></button>
        </div>
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-orange-50"><h3 className="text-3xl font-black text-orange-600 mb-6 flex items-center gap-3"><i className="fas fa-magic"></i> AI Blend Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Blend (e.g. pr, gl, sw)</label><input type="text" value={aiBlend} onChange={(e) => setAiBlend(e.target.value)} placeholder="e.g. PL" className="w-full px-6 py-4 rounded-2xl border-2 border-orange-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiBlend} className="w-full py-5 rounded-2xl font-black text-white bg-orange-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'MAGIC CREATE'}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 uppercase text-[10px]">Close</button></div></div></div>}
    </div>
  );
};

/* --- RHYMES MODULE --- */
const RhymesModule: React.FC = () => {
  const [data, setData] = useState(RHYMES_DATA);
  const [index, setIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isTeacherDrawerOpen, setIsTeacherDrawerOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiEnding, setAiEnding] = useState('');

  const current = data[index];
  const currentWord = current.words[wordIndex];

  useEffect(() => { fetchVisual(); }, [index, wordIndex, data]);
  const fetchVisual = async () => { setLoading(true); const url = await generateLessonImage(currentWord.prompt); setImageUrl(url); setLoading(false); };
  const handleSound = async () => { await playSound(`${currentWord.word} rhymes with ${current.words.find(w => w.word !== currentWord.word)?.word || 'it'}. They both end with ${current.ending}!`); };

  const generateWithAi = async () => {
    if (!aiEnding) return; setIsAiLoading(true);
    try {
       const result = await generateRhymingWords(aiEnding);
       if(result.success && result.data) {
          setData(prev => [...prev, result.data!]);
          setIsTeacherDrawerOpen(false); setIndex(data.length); setWordIndex(0); setAiEnding('');
       }
    } catch (e) { console.error(e); } finally { setIsAiLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center relative">
      <button onClick={() => setIsTeacherDrawerOpen(true)} className="absolute -top-12 right-0 bg-white border-2 border-cyan-200 text-cyan-600 px-4 py-2 rounded-full font-black text-[10px] shadow-sm uppercase tracking-widest"><i className="fas fa-magic"></i> AI Rhyme</button>
      <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-cyan-100 flex flex-col items-center min-h-[600px] animate-in slide-in-from-bottom duration-500">
        <h3 className="text-4xl font-black text-cyan-600 mb-4 uppercase tracking-tighter">Rhyme Fun! 🔄</h3>
        <div className="flex gap-4 mb-8 flex-wrap justify-center">
          {data.map((r, i) => (<button key={i} onClick={() => { setIndex(i); setWordIndex(0); }} className={`px-6 py-2 rounded-xl font-black text-xl uppercase transition-all ${index === i ? 'bg-cyan-500 text-white scale-110 shadow-lg' : 'bg-cyan-50 text-cyan-300'}`}>{r.ending}</button>))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full">
           <div className="flex flex-col items-center">
              <div onClick={handleSound} className="relative w-64 h-64 bg-cyan-50 rounded-[3rem] border-8 border-white shadow-inner flex items-center justify-center mb-6 overflow-hidden cursor-pointer group">
                {loading ? <div className="w-12 h-12 border-8 border-cyan-400 border-t-transparent rounded-full animate-spin"></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover p-6 drop-shadow-xl transition-transform group-hover:scale-105" alt={currentWord.word}/>}
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
              <button onClick={handleSound} className="w-full py-4 bg-cyan-600 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest">CHECK RHYME</button>
           </div>
        </div>
        <div className="flex gap-4 mt-12"><button onClick={() => setIndex(i => (i === 0 ? data.length - 1 : i - 1))} className="w-14 h-14 bg-cyan-100 text-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-200"><i className="fas fa-arrow-left fa-xl"></i></button><button onClick={() => setIndex(i => (i + 1) % data.length)} className="w-14 h-14 bg-cyan-100 text-cyan-500 rounded-full flex items-center justify-center hover:bg-cyan-200"><i className="fas fa-arrow-right fa-xl"></i></button></div>
      </div>
      {isTeacherDrawerOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-8 border-cyan-50"><h3 className="text-3xl font-black text-cyan-600 mb-6 flex items-center gap-3"><i className="fas fa-magic"></i> AI Rhyme Assistant</h3><div className="space-y-6"><div><label className="block text-xs font-black text-gray-400 mb-2 uppercase tracking-widest">Rhyme Ending (e.g. -at, -en, -og)</label><input type="text" value={aiEnding} onChange={(e) => setAiEnding(e.target.value)} placeholder="e.g. -AT" className="w-full px-6 py-4 rounded-2xl border-2 border-cyan-100 outline-none font-bold" /></div><button onClick={generateWithAi} disabled={isAiLoading || !aiEnding} className="w-full py-5 rounded-2xl font-black text-white bg-cyan-500 shadow-xl">{isAiLoading ? <i className="fas fa-spinner fa-spin"></i> : 'CREATE RHYMES'}</button><button onClick={() => setIsTeacherDrawerOpen(false)} className="w-full py-2 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Close</button></div></div></div>}
    </div>
  );
};

// --- DUMMY COMPONENTS ---
const WordFactoryModule: React.FC = () => <div>Word Factory Module</div>;
const WordBuildingModule: React.FC = () => <div>Word Building Module</div>;
const GrammarModule: React.FC = () => <div>Grammar Module</div>;
const ReadingModule: React.FC = () => <div>Reading Module</div>;
const SentencesModule: React.FC = () => <div>Sentences Module</div>;
const HiddenWordsModule: React.FC = () => <div>Hidden Words Module</div>;
const OppositesModule: React.FC = () => <div>Opposites Module</div>;
const DictionModule: React.FC = () => <div>Diction Module</div>;
const WritingModule: React.FC = () => <div>Writing Module</div>;
const SongsModule: React.FC = () => <div>Songs Module</div>;

export default LiteracyZone;

    